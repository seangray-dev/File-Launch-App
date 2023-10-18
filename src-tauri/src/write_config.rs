use std::fs::{create_dir_all, File};
use std::path::{Path, PathBuf};
use std::io::Write;
use std::sync::Mutex;
use lazy_static::lazy_static;
use serde_json::json;
use std::io::Error;
use std::io::ErrorKind;



lazy_static! {
    static ref CONFIG_DIR: Mutex<Option<PathBuf>> = Mutex::new(None);
}

pub fn initialize_config_dir(app_handle: tauri::AppHandle) -> std::io::Result<()> {
    let config_dir_option = app_handle.path_resolver().app_config_dir();

    // Safely unwrap the Option
    if let Some(config_dir) = config_dir_option {
        // Create the directory if it does not exist
        if !config_dir.exists() {
            create_dir_all(&config_dir)?;
        }
        let mut global_config_dir = CONFIG_DIR.lock().unwrap();
        *global_config_dir = Some(config_dir.to_path_buf());
        Ok(())
    } else {
        Err(std::io::Error::new(
            std::io::ErrorKind::NotFound,
            "Cannot resolve app config directory",
        ))
    }
}

pub fn write_base_folder_to_config(config_dir_path: &Path, base_folder: &str) -> std::io::Result<()> {
    let mut config_dir = CONFIG_DIR.lock().unwrap();

    if config_dir.is_none() {
        if !config_dir_path.exists() {
            create_dir_all(config_dir_path)?;
        }
        *config_dir = Some(config_dir_path.to_path_buf());
    }

    let config_file_path = config_dir.as_ref().unwrap().join("base_folder_config.json");
    let serialized = json!({
        "base_folder": base_folder
    }).to_string();

    let mut file = File::create(&config_file_path)?;
    file.write_all(serialized.as_bytes())?;

    println!("Config file successfully created at: {:?}", config_file_path);
    
    Ok(())
}

pub fn read_base_folder_from_config() -> Result<Option<String>, std::io::Error> {
    let config_dir = CONFIG_DIR.lock().map_err(|_| Error::new(ErrorKind::Other, "Failed to lock CONFIG_DIR mutex"))?;

    if let Some(ref dir) = *config_dir {
        let config_file_path = dir.join("base_folder_config.json");

        if config_file_path.exists() {
            match std::fs::read_to_string(&config_file_path) {
                Ok(content) => {
                    let json: serde_json::Value = match serde_json::from_str(&content) {
                        Ok(val) => val,
                        Err(_) => return Err(Error::new(ErrorKind::InvalidData, "Error parsing JSON")),
                    };
                    
                    if json["base_folder"].is_null() {
                        return Ok(None);
                    }
                    
                    return Ok(json["base_folder"].as_str().map(String::from));
                },
                Err(e) => {
                    return Err(Error::new(ErrorKind::Other, format!("Failed to read config file: {}", e)));
                }
            }
        } else {
            return Err(Error::new(ErrorKind::NotFound, "Config file does not exist"));
        }
    }

    Err(Error::new(ErrorKind::NotFound, "Config dir is None"))
}
