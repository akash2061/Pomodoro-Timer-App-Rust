import "./App.css";
import Timer from "./components/Timer";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Toaster } from 'sonner';

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
    <div className="items-center">
      <div
        data-tauri-drag-region
        className="relative flex items-center rounded-3xl h-7 w-full bg-[#40444b] opacity-[0.90] px-4"
      >
        <div data-tauri-drag-region className="flex-grow text-center font-bold text-cyan-100 ml-12">Pomodoro-Timer</div>
        <div className="flex space-x-2">
          <button onClick={minimizeWebview}>🟡</button>
          <button onClick={closeWebview}>🔴</button>
        </div>
      </div>
      <Timer />
      <Toaster richColors position="top-center" theme="dark"
        toastOptions={{
          style: {
            fontSize: '1rem',
            padding: '1rem',
            marginTop: '1rem',
            // backgroundColor: '#2d3748f0',
            color: '#f7fafc',
            borderRadius: '0.5rem',
            boxShadow: '0 0 0.5rem rgba(0, 0, 0, 0.1)',
            // border: '1px solid #2d3748',
            zIndex: 9999
          }
        }}
      />
    </div>
  );
}

export default App;
