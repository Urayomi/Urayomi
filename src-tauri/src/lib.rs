pub mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::manga::read_manga,
            commands::manga::get_manga_list
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
