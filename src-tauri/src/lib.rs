use rodio::{Decoder, OutputStream, Sink};
use std::io::Cursor;

#[tauri::command]
fn play_bell_sound() {
    let (_stream, handle) = OutputStream::try_default().unwrap();
    let sink = Sink::try_new(&handle).unwrap();

    let bell_sound = include_bytes!("../assets/bell.wav");
    let cursor = Cursor::new(bell_sound.as_ref());
    let source = Decoder::new(cursor).unwrap();

    sink.append(source);
    sink.sleep_until_end();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![play_bell_sound])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
