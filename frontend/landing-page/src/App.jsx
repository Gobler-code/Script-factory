import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ScriptFactory from "./components/ScriptFactory";
import CaptionsPage from "./components/CaptionPage";
import VoiceoverPage from "./components/VoiceoverPage";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-[#0a0a09]">
        <Sidebar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<ScriptFactory />} />
            <Route path="/captions" element={<CaptionsPage />} />
            <Route path="/voiceover" element={<VoiceoverPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;