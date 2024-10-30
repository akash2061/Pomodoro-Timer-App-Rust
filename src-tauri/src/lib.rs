use rodio::{Decoder, OutputStream, Sink};
use std::io::Cursor;
use tauri::{AppHandle, Builder};
// use tauri::{LogicalPosition, LogicalSize, Manager, WebviewUrl, WindowBuilder};

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

// #[tauri::command]
// fn create_notification_window(app_handle: AppHandle) -> Result<(), tauri::Error> {
//     // let window = app_handle.get_window("main").unwrap().inner_size().unwrap();
//     // let window_width = 300.0; // Your window width
//     // let window_height = 150.0; // Your window height
//     let width = 800.;
//     let height = 600.;
//     let window = tauri::window::WindowBuilder::new(&app_handle, "main2")
//         .inner_size(width, height)
//         .build()?;

//     let _webview1 = window.add_child(
//         tauri::webview::WebviewBuilder::new("main1", WebviewUrl::App("index1.html".into()))
//             .auto_resize(),
//         LogicalPosition::new(0., 0.),
//         LogicalSize::new(width / 2., height / 2.),
//     )?;
//         Ok(())

//     // // Calculate the position for the center-top placement
//     // let x_position = (window.width as f64) * 1.35;
//     // let y_position = 0.0; // Top of the screen

//     // let _notification_window = WindowBuilder::new(&app_handle, "notification")
//     //     .title("Notification")
//     //     .inner_size(window_width, window_height)
//     //     .position(x_position, y_position)
//     //     .always_on_top(true)
//     //     .resizable(false)
//     //     .build()
//     //     .expect("Failed to create notification window");
// }

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    Builder::default()
        .plugin(tauri_plugin_notification::init())
        .invoke_handler(tauri::generate_handler![
            play_bell_sound,
            // create_notification_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
