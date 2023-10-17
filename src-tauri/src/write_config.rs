use std::fs::create_dir_all;
use std::path::Path;
use std::fs::File;
use serde_json::json;
use std::io::Write; 

pub fn write_base_folder_to_config(config_dir: &Path, base_folder: &str) -> std::io::Result<()> {
    if !config_dir.exists() {
        if let Err(e) = create_dir_all(&config_dir) {
            eprintln!("Failed to create config directory: {}", e);
            return Err(e);
        }
    }
    
    let config_file_path = config_dir.join("base_folder_config.json");
    let serialized = json!({
        "base_folder": base_folder
    }).to_string();
    
    match File::create(&config_file_path) {
        Ok(mut file) => {
            if let Err(e) = file.write_all(serialized.as_bytes()) {
                eprintln!("Failed to write to config file: {}", e);
                return Err(e);
            }

            if config_file_path.exists() {
            println!("Config file successfully created at: {:?}", config_file_path);
            } else {
                println!("Config file does not exist.");
            }

        },
        Err(e) => {
            eprintln!("Failed to create config file: {}", e);
            return Err(e);
        }
    }
    
    Ok(())
}