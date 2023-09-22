// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


use std::fs;
use std::path::Path;
use tauri::api::dialog::FileDialogBuilder;
use std::collections::HashMap;
use std::fs::Metadata;
use std::time::SystemTime;
use std::time::Duration;
use std::fs::File;
use std::io::BufReader;
use rodio::{Decoder, OutputStream, Sink, source::Source, source::SineWave};
use once_cell::sync::Lazy;
use std::sync::Mutex;
use std::thread;
use std::sync::Arc;


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
        .invoke_handler(tauri::generate_handler![select_directory, scan_directory, check_audio_channels, play_audio])
        .plugin(tauri_plugin_oauth::init())
        .plugin(tauri_plugin_persisted_scope::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn select_directory() -> Result<String, String> {
    let (tx, rx) = std::sync::mpsc::channel();
    FileDialogBuilder::new().pick_folder(move |folder_path| {
        if let Some(path) = folder_path {
            println!("Picked folder path: {:?}", path);
            let path_str = path.to_str().unwrap_or("").to_string();
            
            // Update the global BASE_FOLDER variable
            let mut base_folder = BASE_FOLDER.lock().unwrap();
            *base_folder = Some(path_str.clone());
            
            tx.send(Ok(path_str)).unwrap();
        } else {
            println!("No folder was picked.");
            tx.send(Err("No folder was picked".to_string())).unwrap();
        }
    });
    rx.recv().unwrap()
}

#[tauri::command]
async fn scan_directory(base_folder: String) -> Result<Vec<HashMap<String, String>>, String> {
    // Check if preloaded files exist
    if let Some(preloaded_files) = PRELOADED_FILES.lock().unwrap().clone() {
        return Ok(preloaded_files);
    }

    let mut files: Vec<HashMap<String, String>> = vec![];
    if let Err(e) = scan_directory_recursive(Path::new(&base_folder), &mut files) {
        return Err(format!("Failed to read directory: {}", e));
    }
    Ok(files)
}

fn scan_directory_recursive(dir: &Path, files: &mut Vec<HashMap<String, String>>) -> std::io::Result<()> {
    if dir.is_dir() {
        for entry in fs::read_dir(dir)? {
            let entry = entry?;
            let path = entry.path();
            if path.is_dir() {
                scan_directory_recursive(&path, files)?;
            } else {
                let mut file_obj = HashMap::new();
                
                // Add name
                if let Some(name) = path.file_name() {
                    if let Some(name_str) = name.to_str() {
                        file_obj.insert("name".to_string(), name_str.to_string());
                    }
                }

                // Add parent
                if let Some(parent) = path.parent() {
                    if let Some(parent_str) = parent.to_str() {
                        file_obj.insert("parent".to_string(), parent_str.to_string());
                    }
                }
                
                // Add path
                if let Some(path_str) = path.to_str() {
                    file_obj.insert("path".to_string(), path_str.to_string());
                }

                // Add last modified time
                let metadata: Metadata = fs::metadata(&path)?;
                if let Ok(time) = metadata.modified() {
                    if let Ok(duration) = time.duration_since(SystemTime::UNIX_EPOCH) {
                        file_obj.insert("lastModified".to_string(), duration.as_secs().to_string());
                    }
                }

                // Add file type (extension)
                if let Some(ext) = path.extension() {
                    if let Some(ext_str) = ext.to_str() {
                        file_obj.insert("fileType".to_string(), ext_str.to_string());
                    }
                }
                
                files.push(file_obj);
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
fn play_audio(path: String) -> Result<String, String> {
    println!("Spawning new thread for full audio pipeline...");

    thread::spawn(move || {
        println!("Trying to initialize audio output stream and sink...");

        let (_stream, stream_handle) = match OutputStream::try_default() {
            Ok((stream, handle)) => (stream, handle),
            Err(e) => {
                println!("Failed to get output stream: {}", e);
                return;
            }
        };

        let sink = match Sink::try_new(&stream_handle) {
            Ok(s) => Arc::new(s),
            Err(e) => {
                println!("Failed to create audio sink");
                return;
            }
        };

        println!("Trying to open file at: {}", path);
        let file = match File::open(&path) {
            Ok(f) => f,
            Err(e) => {
                println!("Failed to open file: {} ({})", path, e);
                return;
            }
        };

        let source = match Decoder::new(BufReader::new(file)) {
            Ok(s) => s,
            Err(e) => {
                println!("Failed to decode file: {} ({})", path, e);
                return;
            }
        };

        println!("Appending audio source to sink...");
        sink.append(source);

        println!("Is sink empty before play: {}", sink.empty());

        println!("About to play the audio...");
        sink.set_volume(1.0);
        sink.play();
        println!("Audio should be playing now...");

        // Keeping the thread alive while the audio plays
        sink.sleep_until_end();

        println!("Audio playback complete. Thread exiting.");
    });

    Ok("Playback thread spawned".to_string())
}