import "./App.css";
import Timer from "./components/Timer";
// import getCurrentWindow from "@tauri-apps/api/core";

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
    <>
      <nav
        data-tauri-drag-region
        className="flex justify-end items-center rounded-3xl bg-slate-500 h-7 w-full"
      >
        <button onClick={minimizeWebview}>🗕</button>
        <button onClick={closeWebview}>🗙</button>
      </nav>
        <Timer />
    </>
  );
}

export default App;
