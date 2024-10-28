use rodio::{Decoder, OutputStream, Sink};
use std::io::Cursor;
use tauri::{AppHandle, Builder, Manager, WindowBuilder};

#[tauri::command]
async fn play_bell_sound(app_handle: AppHandle) {
    let (_stream, handle) = OutputStream::try_default().unwrap();
    let sink = Sink::try_new(&handle).unwrap();

    let bell_sound = include_bytes!("../assets/bell.mp3");
    let cursor = Cursor::new(bell_sound.as_ref());
    let source = Decoder::new(cursor).unwrap();

    sink.append(source);
    create_notification_window(app_handle);
    sink.sleep_until_end();
}

#[tauri::command]
fn create_notification_window(app_handle: AppHandle) {
    let screen_size = app_handle.get_window("main").unwrap().inner_size().unwrap();
    let window_width = 300.0; // Your window width
    let window_height = 150.0; // Your window height

    // Calculate the position for the center-top placement
    let x_position = (screen_size.width as f64) * 1.35;
    let y_position = 0.0; // Top of the screen

    let _notification_window = WindowBuilder::new(&app_handle, "notification")
        .title("Notification")
        .inner_size(window_width, window_height)
        .position(x_position, y_position)
        .always_on_top(true)
        .resizable(false)
        .build()
        .expect("Failed to create notification window");
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    Builder::default()
        .plugin(tauri_plugin_notification::init())
        .invoke_handler(tauri::generate_handler![
            play_bell_sound,
            create_notification_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
