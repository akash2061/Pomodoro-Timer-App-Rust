use rodio::{Decoder, OutputStream, Sink};
use std::io::Cursor;
use tauri::{AppHandle, Builder, Manager};

#[tauri::command]
async fn play_bell_sound(_app_handle: AppHandle) {
    let (_stream, handle) = OutputStream::try_default().unwrap();
    let sink = Sink::try_new(&handle).unwrap();

    let bell_sound = include_bytes!("../assets/bell.mp3");
    let cursor = Cursor::new(bell_sound.as_ref());
    let source = Decoder::new(cursor).unwrap();

    sink.append(source);
    sink.sleep_until_end();
}
#[tauri::command]
async fn bring_window_to_front(app: AppHandle) {
    if let Some(window) = app.get_window("main") {
        // Unminimize the window if it's minimized
        if let Ok(is_minimized) = window.is_minimized() {
            if is_minimized {
                window.unminimize().unwrap();
                window.set_always_on_top(true).unwrap();
                window.set_focus().unwrap();
            }
        }

        // Set window to always on top and focus it
        window.set_always_on_top(true).unwrap();
        window.set_focus().unwrap();

        // Optionally, remove the always-on-top after a short delay
        tauri::async_runtime::spawn(async move {
            tokio::time::sleep(std::time::Duration::from_secs(5)).await;
            window.set_always_on_top(false).unwrap();
        });
    }
}
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    Builder::default()
        .invoke_handler(tauri::generate_handler![
            play_bell_sound,
            bring_window_to_front
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
