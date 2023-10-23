// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod app_config_dir;

use std::fs;
use std::path::Path;
use tauri::Manager;
use tauri::api::dialog::FileDialogBuilder;
use std::collections::HashMap;
use std::fs::Metadata;
use std::time::{Duration, SystemTime, UNIX_EPOCH};
use std::fs::File;
use std::io::BufReader;
use rodio::source::Source;
use once_cell::sync::Lazy;
use std::sync:: Mutex;
use std::time::Instant; 
use std::fs::create_dir_all;
use app_config_dir::*;
use tauri_plugin_store::StoreBuilder;
use serde_json::json;
use tauri::api::path::data_dir;
use tauri::api::path::BaseDirectory;

// Global Mutex-wrapped variable to hold preloaded files
static PRELOADED_FILES: Lazy<Mutex<Option<Vec<HashMap<String, String>>>>> = Lazy::new(|| Mutex::new(None));

// Global variable to store the base folder path
pub static BASE_FOLDER: Lazy<Mutex<Option<String>>> = Lazy::new(|| Mutex::new(None));

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![/* your handlers here */])
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(|app| {
            // Get the path to the app's configuration directory
            let config_dir = app.path_resolver().app_config_dir().ok_or_else(|| {
                eprintln!("Failed to resolve app config directory");
                Box::<dyn std::error::Error>::from("Failed to resolve app config directory")
            })?;
            let settings_path = config_dir.join("settings.json");

            // Print the path to the console
            println!("Settings path: {:?}", settings_path);

            // Create the store
            let mut store = StoreBuilder::new(app.handle(), settings_path.clone()).build();

            // Insert the initial value for baseFolder
            match store.insert("baseFolder".to_string(), json!("")) {
                Ok(_) => {
                    match store.save() {
                        Ok(_) => Ok(()),
                        Err(e) => {
                            eprintln!("Failed to save store: {}", e);
                            Err(Box::new(e))
                        }
                    }
                },
                Err(e) => {
                    eprintln!("Failed to insert initial value: {}", e);
                    Err(Box::new(e))
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


// .setup(|app| {
        //     // Initialize the config directory
        //     match initialize_config_dir(app.app_handle()) {
        //         Ok(_) => {
        //             println!("Successfully initialized the config directory");
        //             match read_base_folder_from_config() {
        //                 Ok(Some(folder)) => println!("Successfully read base folder: {}", folder),
        //                 Ok(None) => println!("Base folder is not set in the config file"),
        //                 Err(err) => println!("Failed to read base folder from config file: {:?}", err),
        //             }
        //         },
        //         Err(err) => println!("Failed to initialize the config directory: {:?}", err),
        //     }
        //     Ok(())
        // })

#[tauri::command]
async fn select_directory(app_handle: tauri::AppHandle) -> Result<String, String> {
    let config_dir_option = app_handle.path_resolver().app_config_dir();

    
    // Safely unwrap the Option
    if let Some(config_dir) = config_dir_option {
        
        let (tx, rx) = std::sync::mpsc::channel();
        
        FileDialogBuilder::new().pick_folder(move |folder_path| {
            if let Some(path) = folder_path {
                let path_str = path.to_str().unwrap_or("").to_string();
                
                // Update the global BASE_FOLDER variable
                let mut base_folder = BASE_FOLDER.lock().unwrap();
                *base_folder = Some(path_str.clone());
                println!("DEBUG: Updated BASE_FOLDER to: {}", path_str);
                
                // Convert PathBuf to &Path and then write to the configuration file
                if let Err(e) = write_base_folder_to_config(&config_dir.as_path(), &path_str) {
                    eprintln!("Failed to write base folder to config: {}", e);
                }
                
                tx.send(Ok(path_str)).unwrap();
            } else {
                println!("No folder was picked.");
                tx.send(Err("No folder was picked".to_string())).unwrap();
            }
        });
        rx.recv().unwrap_or_else(|_| {
            eprintln!("Failed to receive directory path from frontend.");
            Err("Failed to receive directory path from frontend.".to_string())
        })
    } else {
        // Handle the case where the app_config_dir is None
        Err("Could not determine the application config directory.".to_string())
    }
}

#[tauri::command]
async fn scan_directory(base_folder: String) -> Result<Vec<HashMap<String, String>>, String> {
    let start = Instant::now();
    // Check if preloaded files exist
    if let Some(preloaded_files) = PRELOADED_FILES.lock().unwrap().clone() {
        return Ok(preloaded_files);
    }

    let mut files: Vec<HashMap<String, String>> = vec![];
    // Supplying None for days_filter so it uses the default of 30 days.
    if let Err(e) = scan_directory_recursive(Path::new(&base_folder), &mut files, None) {
        return Err(format!("Failed to read directory: {}", e));
    }
    let duration = start.elapsed();
    println!("Time elapsed for scanning directory: {:?}", duration);
    Ok(files)
}

fn scan_directory_recursive(dir: &Path, files: &mut Vec<HashMap<String, String>>, days_filter: Option<u64>) -> std::io::Result<()> {
    if !dir.is_dir() {
        return Ok(());
    }

    let current_time = SystemTime::now();
    let filter_duration = days_filter.map_or(Duration::from_secs(30 * 24 * 60 * 60), |days| {
        Duration::from_secs(days * 24 * 60 * 60)
    });

    for entry in fs::read_dir(dir)? {
        let entry = entry?;
        let path = entry.path();

        if path.is_dir() {
            scan_directory_recursive(&path, files, days_filter)?;
            continue;
        }

        let metadata: Metadata = fs::metadata(&path)?;
        if metadata.modified().map_or(true, |time| {
            time.duration_since(UNIX_EPOCH).map_or(true, |duration| {
                current_time.duration_since(UNIX_EPOCH).unwrap() - duration > filter_duration
            })
        }) {
            continue;
        }

        if let Some(ext_str) = path.extension().and_then(|ext| ext.to_str()) {
            match ext_str {
                "mp3" | "wav" => {
                    // Check if the file's parent directory is "Bounced Files"
                    // Add additional default export folders for DAWS
                    if let Some(parent) = path.parent() {
                        if parent.file_name().and_then(|name| name.to_str()) != Some("Bounced Files") {
                            continue;
                        }
                    }
                    // Check if the file is stereo
                    if check_audio_channels(path.to_str().unwrap().to_string()) != "stereo" {
                        continue;
                    }

                    let mut file_obj = HashMap::new();

                    // Debugging
                    println!("Processing file: {:?}", path);

                    // Add name
                    if let Some(name_str) = path.file_name().and_then(|name| name.to_str()) {
                        file_obj.insert("name".to_string(), name_str.to_string());
                    }
                    // Add parent path (the client's folder name)
    let base_folder_guard = BASE_FOLDER.lock().unwrap();
    if let Some(base_folder) = base_folder_guard.as_ref() {
        println!("BASE_FOLDER is: {}", base_folder);  // Debugging
        let base_path = Path::new(base_folder);
        if let Ok(stripped_path) = path.parent().unwrap().strip_prefix(base_path) {
            if let Some(stripped_path_str) = stripped_path.to_str() {
                let client_folder_str = stripped_path_str.split('/').next().unwrap_or("");
                file_obj.insert("parent".to_string(), client_folder_str.to_string());
                println!("Set parent to: {}", client_folder_str);  // Debugging
            }
        } else {
            println!("Failed to strip prefix");  // Debugging
        }
    } else {
        println!("BASE_FOLDER is not set");  // Debugging
    }
                    // Add path
                    if let Some(path_str) = path.to_str() {
                        file_obj.insert("path".to_string(), path_str.to_string());
                    }

                    file_obj.insert("lastModified".to_string(), metadata.modified().unwrap().duration_since(UNIX_EPOCH).unwrap().as_secs().to_string());
                    file_obj.insert("fileType".to_string(), ext_str.to_string());
                    files.push(file_obj);
                }
                _ => {}
            }
        }
    }

    Ok(())
}

#[tauri::command]
fn check_audio_channels(path: String) -> String {
    let file = match File::open(&path) {
        Ok(f) => f,
        Err(_) => return format!("Error opening file: {}", path),
    };

    let source = match rodio::Decoder::new(BufReader::new(file)) {
        Ok(s) => s,
        Err(_) => return format!("Error decoding file: {}", path),
    };

    let channels = source.channels();
    if channels == 1 {
        "mono".to_string()
    } else if channels == 2 {
        "stereo".to_string()
    } else {
        format!("{} channels", channels)
    }
}

#[tauri::command]
async fn load_audio_file(path: String) -> tauri::Result<Vec<u8>> {
  use std::io::Read;

  let mut file = File::open(path)?;
  let metadata = file.metadata()?;
  let mut buffer = Vec::with_capacity(metadata.len() as usize + 1);
  file.read_to_end(&mut buffer)?;

  Ok(buffer)
}