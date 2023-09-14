// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::api::dialog::FileDialogBuilder;


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

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![select_directory])
        .plugin(tauri_plugin_oauth::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}