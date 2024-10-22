use rodio::{Decoder, OutputStream, Sink};
use std::io::Cursor;
use tauri::{Builder, Manager};
use tauri_plugin_notification::NotificationExt; // Import NotificationExt for easy usage

#[tauri::command]
async fn play_bell_sound() {
    let (_stream, handle) = OutputStream::try_default().unwrap();
    let sink = Sink::try_new(&handle).unwrap();

    let bell_sound = include_bytes!("../assets/bell.mp3");
    let cursor = Cursor::new(bell_sound.as_ref());
    let source = Decoder::new(cursor).unwrap();

    sink.append(source);
    sink.sleep_until_end();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    Builder::default()
        .plugin(tauri_plugin_notification::init()) // Initialize the notification plugin
        .setup(|app| {
            let _main_window = app.get_webview_window("main").unwrap(); // Get the main window

            // Simulate a background task (timer)
            let main_window = app.get_webview_window("main").unwrap(); // Get the main window
            tauri::async_runtime::spawn({
                let main_window = main_window.clone();
                async move {
                    // Replace with your timer logic
                    tokio::time::sleep(std::time::Duration::from_secs(1500)).await; // Example: 25 minutes timer

                    // Show notification
                    main_window.show().unwrap(); // Optionally show the window
                    main_window.app_handle().notification() // Use the app notification builder
                        .builder()
                        .title("Pomodoro Timer")
                        .body("Your Pomodoro session is complete.")
                        .show()
                        .expect("Failed to show notification.");

                    play_bell_sound().await; // Play sound after timer ends
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![play_bell_sound])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
