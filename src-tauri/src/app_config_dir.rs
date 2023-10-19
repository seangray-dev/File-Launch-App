use std::fs::{create_dir_all, File};
use std::path::{Path, PathBuf};
use std::io::Write;
use std::sync::Mutex;
use lazy_static::lazy_static;
use serde_json::json;
use std::io::Error;
use std::io::ErrorKind;
use crate::BASE_FOLDER;

lazy_static! {
    static ref CONFIG_DIR: Mutex<Option<PathBuf>> = Mutex::new(None);
}

const DATA_DIR: &str = "data";
const CONFIG_FILE: &str = "settings.json";

pub fn initialize_config_dir(app_handle: tauri::AppHandle) -> std::io::Result<()> {
    let config_dir = app_handle.path_resolver().app_config_dir().ok_or_else(|| std::io::Error::new(std::io::ErrorKind::NotFound, "Cannot resolve app config directory"))?;

    if !config_dir.exists() {
        create_dir_all(&config_dir)?;
    }

    let mut global_config_dir = CONFIG_DIR.lock().unwrap();
    *global_config_dir = Some(config_dir.to_path_buf());

    Ok(())
}

pub fn write_base_folder_to_config(config_dir_path: &Path, base_folder: &str) -> std::io::Result<()> {
    let mut config_dir = CONFIG_DIR.lock().unwrap();

    if config_dir.is_none() {
        create_dir_all(config_dir_path)?;
        *config_dir = Some(config_dir_path.to_path_buf());
    }

    let data_dir_path = config_dir.as_ref().unwrap().join(DATA_DIR);

    // Create data directory if not exists
    if !data_dir_path.exists() {
        create_dir_all(&data_dir_path)?;
    }

    let config_file_path = data_dir_path.join(CONFIG_FILE);
    let serialized = json!({
        "baseFolder": base_folder // renamed to match frontend key
    }).to_string();

    let mut file = File::create(&config_file_path)?;
    file.write_all(serialized.as_bytes())?;

    println!("Config file successfully created at: {:?}", config_file_path);

    // Update the global BASE_FOLDER after successfully writing to the config file
    let mut global_base_folder = BASE_FOLDER.lock().unwrap();
    *global_base_folder = Some(base_folder.to_string());

    Ok(())
}

#[tauri::command]
pub fn read_base_folder_from_config() -> Result<Option<String>, std::io::Error> {
    let config_dir = CONFIG_DIR.lock().map_err(|_| Error::new(ErrorKind::Other, "Failed to lock CONFIG_DIR mutex"))?;

    if let Some(ref dir) = *config_dir {
        let data_dir_path = dir.join(DATA_DIR);
        let config_file_path = data_dir_path.join(CONFIG_FILE);

        if config_file_path.exists() {
            let content = std::fs::read_to_string(&config_file_path).map_err(|e| Error::new(ErrorKind::Other, format!("Failed to read config file: {}", e)))?;
            let json: serde_json::Value = serde_json::from_str(&content).map_err(|_| Error::new(ErrorKind::InvalidData, "Error parsing JSON"))?;

            if let Some(base_folder) = json["baseFolder"].as_str() { // Key is "baseFolder" to match frontend
                // Update the global BASE_FOLDER after successfully reading from the config file
                let mut global_base_folder = BASE_FOLDER.lock().unwrap();
                *global_base_folder = Some(base_folder.to_string());

                return Ok(Some(base_folder.to_string()));
            } else {
                return Ok(None);
            }
        } else {
            return Err(Error::new(ErrorKind::NotFound, "Config file does not exist"));
        }
    }

    Err(Error::new(ErrorKind::NotFound, "Config dir is None"))
}

