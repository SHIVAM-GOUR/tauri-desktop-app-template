// REGISTER TAURI COMMANDS IN THIS FILE
mod commands;

use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            commands::auth::store_access_token,
            commands::auth::get_access_token,
            commands::auth::clear_access_token,
            commands::auth::store_refresh_token,
            commands::auth::get_refresh_token,
            commands::auth::clear_refresh_token,
            // here define new commands
            // commands::system::get_system_info
        ])
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            if let Some(monitor) = window.current_monitor()? {
                let screen: &tauri::PhysicalSize<u32> = monitor.size();
                let min_width = screen.width / 2;
                let min_height = screen.height / 2;
                window.set_min_size(Some(tauri::Size::Physical(tauri::PhysicalSize {
                    width: min_width,
                    height: min_height,
                })))?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
