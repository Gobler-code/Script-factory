import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HistoryProvider } from "./context/HistoryContext";
import Sidebar from "./components/Sidebar";
import ScriptFactory from "./components/ScriptFactory";
import CaptionsPage from "./components/CaptionPage";
import VoiceoverPage from "./components/VoiceoverPage";

function App() {
  return (
    <BrowserRouter>
      <HistoryProvider>
        {/* flex-col stacks header on mobile; lg:flex-row puts sidebar on left for desktop */}
        <div className="flex flex-col lg:flex-row min-h-screen bg-[#0a0a09] w-full overflow-x-hidden">
          <Sidebar />
          {/* min-w-0 prevents child flex items from overflowing horizontally */}
          <div className="flex-1 w-full min-w-0">
            <Routes>
              <Route path="/" element={<ScriptFactory />} />
              <Route path="/captions" element={<CaptionsPage />} />
              <Route path="/voiceover" element={<VoiceoverPage />} />
            </Routes>
          </div>
        </div>
      </HistoryProvider>
    </BrowserRouter>
  );
}

export default App;