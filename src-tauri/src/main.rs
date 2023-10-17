// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod write_config;

use std::fs;
use std::path::Path;
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
use write_config::*;

// Global Mutex-wrapped variable to hold preloaded files
static PRELOADED_FILES: Lazy<Mutex<Option<Vec<HashMap<String, String>>>>> = Lazy::new(|| Mutex::new(None));

// Global variable to store the base folder path
static BASE_FOLDER: Lazy<Mutex<Option<String>>> = Lazy::new(|| Mutex::new(None));

fn main() {
     let runtime = tokio::runtime::Runtime::new().unwrap();
    runtime.block_on(async {
        // Try to read base_folder from the global variable
        let base_folder_guard = BASE_FOLDER.lock().unwrap();
        if let Some(base_folder) = base_folder_guard.as_ref() {
            match scan_directory(base_folder.to_string()).await {
                Ok(files) => {
                    let mut preloaded_files = PRELOADED_FILES.lock().unwrap();
                    *preloaded_files = Some(files);
                },
                Err(e) => eprintln!("Failed to preload files: {}", e),
            }
        } else {
            // Handle the case where the folder has not been set, if necessary.
            println!("Base folder has not been set.");
        }
    });

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![select_directory, scan_directory, check_audio_channels,load_audio_file])
        .plugin(tauri_plugin_oauth::init())
        .plugin(tauri_plugin_persisted_scope::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn select_directory(app_handle: tauri::AppHandle) -> Result<String, String> {
    let config_dir_option = app_handle.path_resolver().app_config_dir();

    
    // Safely unwrap the Option
    if let Some(config_dir) = config_dir_option {
        // Create the directory if it does not exist
        if !config_dir.exists() {
            create_dir_all(&config_dir).expect("Failed to create config directory");
        }
        
        let (tx, rx) = std::sync::mpsc::channel();
        FileDialogBuilder::new().pick_folder(move |folder_path| {
            if let Some(path) = folder_path {
                let path_str = path.to_str().unwrap_or("").to_string();
                
                // Update the global BASE_FOLDER variable
                let mut base_folder = BASE_FOLDER.lock().unwrap();
                *base_folder = Some(path_str.clone());
                
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
        rx.recv().unwrap()
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

                    // Add name
                    if let Some(name_str) = path.file_name().and_then(|name| name.to_str()) {
                        file_obj.insert("name".to_string(), name_str.to_string());
                    }
                    // Add parent path
                    if let Some(parent_str) = path.parent().and_then(|parent| parent.to_str()) {
                        file_obj.insert("parent".to_string(), parent_str.to_string());
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