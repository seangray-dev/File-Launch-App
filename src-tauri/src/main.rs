// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


use std::fs;
use std::path::Path;
use tauri::api::dialog::FileDialogBuilder;
use std::collections::HashMap;
use std::fs::Metadata;
use std::time::SystemTime;



fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![select_directory, scan_directory])
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
            // Serialize the PathBuf to a JSON string
            let path_str = path.to_str().unwrap_or("").to_string();
            tx.send(Ok(path_str)).unwrap();
        } else {
            // The user canceled the dialog.
            println!("No folder was picked.");
            tx.send(Err("No folder was picked".to_string())).unwrap();
        }
    });
    rx.recv().unwrap()
}

#[tauri::command]
async fn scan_directory(base_folder: String) -> Result<Vec<HashMap<String, String>>, String> {
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
                if let Some(name) = path.file_name() {
                    if let Some(name_str) = name.to_str() {
                        file_obj.insert("name".to_string(), name_str.to_string());
                    }
                }
                if let Some(parent) = path.parent() {
                    if let Some(parent_str) = parent.to_str() {
                        file_obj.insert("parent".to_string(), parent_str.to_string());
                    }
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

