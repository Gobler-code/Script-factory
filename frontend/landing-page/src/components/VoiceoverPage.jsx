import { useState } from "react";
import Narrator from "./Narrator";

export default function VoiceoverPage() {
  const [scriptText, setScriptText] = useState("");

  const scenes = scriptText.trim()
    ? [{ voiceover: scriptText.trim(), rough_visual_cue: "", rough_sfx_trigger: "" }]
    : [];

  return (
    <div className="min-h-screen text-[#f3f1ea] p-6 max-w-5xl mx-auto">
      <label className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#55534c] block mb-3">
        Script /
      </label>
      <textarea
        value={scriptText}
        onChange={(e) => setScriptText(e.target.value)}
        rows={6}
        placeholder="Paste or write your script here…"
        className="w-full bg-neutral-900 border border-[#f3f1ea]/10 rounded-lg p-4 text-sm text-[#f3f1ea] placeholder:text-[#55534c] outline-none focus:border-[#f3f1ea]/30 mb-8"
      />
      <Narrator scenes={scenes} topic="voiceover" />
    </div>
  );
}