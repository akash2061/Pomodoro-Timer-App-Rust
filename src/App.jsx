import "./App.css";
import Timer from "./components/Timer";
import { getCurrentWindow } from "@tauri-apps/api/window";

function App() {
  const minimizeWebview = async () => {
    const currentWindow = await getCurrentWindow();
    await currentWindow.minimize();
  };

  const closeWebview = async () => {
    const currentWindow = await getCurrentWindow();
    await currentWindow.close();
  };

  return (
    // <div className="bg-[#202225] opacity-[0.95]">
    <div>
      <div
        data-tauri-drag-region
        className="relative flex items-center rounded-3xl h-7 w-full bg-[#40444b] px-4"
      >
        <div data-tauri-drag-region className="flex-grow text-center font-bold text-cyan-100 ml-14">Pomodoro-Timer
        </div>
        <div className="flex space-x-2">
          <button onClick={minimizeWebview}>🟡</button>
          <button onClick={closeWebview}>🔴</button>
        </div>
      </div>
      <Timer />
    </div>
  );
}

export default App;
