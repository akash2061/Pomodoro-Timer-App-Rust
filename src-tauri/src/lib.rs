use rodio::{Decoder, OutputStream, Sink};
use std::io::Cursor;
use tauri::{AppHandle, Builder};

#[tauri::command]
async fn play_bell_sound(_app_handle: AppHandle) {
    let (_stream, handle) = OutputStream::try_default().unwrap();
    let sink = Sink::try_new(&handle).unwrap();

    let bell_sound = include_bytes!("../assets/bell.mp3");
    let cursor = Cursor::new(bell_sound.as_ref());
    let source = Decoder::new(cursor).unwrap();

    sink.append(source);
    // let _ = create_notification_window(app_handle);
    sink.sleep_until_end();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    Builder::default()
        .invoke_handler(tauri::generate_handler![play_bell_sound,])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
