import { useState, useRef, useEffect } from "react";

const AMBER = "#FAC775";
const AMBER_INK = "#412402";

const VOICES = [
  { id: "en-US-GuyNeural", label: "Guy", desc: "Deep, documentary" },
  { id: "en-US-AriaNeural", label: "Aria", desc: "Clear, neutral" },
  { id: "en-GB-RyanNeural", label: "Ryan", desc: "British" },
  { id: "en-US-JennyNeural", label: "Jenny", desc: "Warm, conversational" },
];

function formatClock(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds || 0));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

function base64ToBlob(base64, mime = "audio/mpeg") {
  const bytes = atob(base64);
  const buffer = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) buffer[i] = bytes.charCodeAt(i);
  return new Blob([buffer], { type: mime });
}

export default function Narrator({ scenes = [], topic = "narration" }) {
  const [voice, setVoice] = useState(VOICES[0].id);
  const [status, setStatus] = useState("idle"); // idle | loading | error | done
  const [errorMsg, setErrorMsg] = useState("");
  const [audioBase64, setAudioBase64] = useState(null);
  const [src, setSrc] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const audioRef = useRef(null);
  const trackRef = useRef(null);

  async function handleGenerate() {
    setStatus("loading");
    setErrorMsg("");
    try {
      const result = await fetch("http://127.0.0.1:8000/narrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenes, voice }),
      });
      if (!result.ok) throw new Error("Voiceover generation failed.");
      const data = await result.json();
      setAudioBase64(data.audio_base64);
      setStatus("done");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong.");
      setStatus("error");
    }
  }

  useEffect(() => {
    if (!audioBase64) {
      setSrc(null);
      return;
    }
    const blob = base64ToBlob(audioBase64);
    const url = URL.createObjectURL(blob);
    setSrc(url);
    setIsReady(false);
    setIsPlaying(false);
    setCurrentTime(0);
    return () => URL.revokeObjectURL(url);
  }, [audioBase64]);

  function togglePlay() {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) el.pause();
    else el.play();
    setIsPlaying(!isPlaying);
  }

  function seekTo(clientX) {
    const el = audioRef.current;
    const track = trackRef.current;
    if (!el || !track || !duration) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    el.currentTime = ratio * duration;
    setCurrentTime(el.currentTime);
  }

  function downloadAudio() {
    if (!audioBase64) return;
    const blob = base64ToBlob(audioBase64);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${topic.slice(0, 30).replace(/\s+/g, "_")}.mp3`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const progressPct = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-neutral-950 text-neutral-100 rounded-xl">
      <h2 className="text-lg font-medium mb-1">Script → voiceover</h2>
      <p className="text-sm text-neutral-400 mb-6">
        Pick a voice, generate a narration, listen and download.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {/* left column — voice picker */}
        <div>
          <label className="text-xs text-neutral-400 tracking-wide block mb-2">
            Voice
          </label>
          <div className="flex flex-col gap-2 mb-6">
            {VOICES.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVoice(v.id)}
                className={`text-left rounded-lg border px-3 py-2 transition-colors ${
                  voice === v.id
                    ? "border-neutral-700 bg-neutral-800"
                    : "border-neutral-800 bg-neutral-900 hover:border-neutral-700"
                }`}
              >
                <div className="text-sm" style={voice === v.id ? { color: AMBER } : {}}>
                  {v.label}
                </div>
                <div className="text-xs text-neutral-500">{v.desc}</div>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={status === "loading" || !scenes.length}
            className="w-full rounded-lg py-2.5 text-sm font-medium disabled:opacity-40"
            style={{ background: AMBER, color: AMBER_INK }}
          >
            {status === "loading" ? "Generating…" : "Generate voiceover"}
          </button>
          {status === "error" && (
            <p className="text-[11px] mt-2 text-red-400">{errorMsg}</p>
          )}
          <p className="text-[11px] text-neutral-500 mt-2 leading-relaxed">
            Narration is generated from the script shown on the right, using the voice selected above.
          </p>
        </div>

        {/* middle column — the generated script */}
        <div>
          <label className="text-xs text-neutral-400 tracking-wide block mb-2">
            Script ({scenes.length} scenes)
          </label>
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 max-h-96 overflow-y-auto flex flex-col gap-4">
            {scenes.length ? (
              scenes.map((scene, i) => (
                <div key={i}>
                  <div className="text-[10px] tracking-wide text-neutral-500 mb-1">
                    SCENE {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="text-sm text-neutral-200 leading-relaxed">
                    {scene.voiceover.replace(/\*\*/g, "")}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-neutral-500">No script generated yet.</div>
            )}
          </div>
        </div>

        {/* right column — player */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 flex flex-col">
          <label className="text-xs text-neutral-400 tracking-wide block mb-3">
            Narration
          </label>

          {status !== "done" && (
            <div className="flex-1 flex items-center justify-center text-sm text-neutral-500 text-center px-4">
              {status === "loading" ? "Narrating…" : "Your narration will appear here."}
            </div>
          )}

          {status === "done" && (
            <div className="flex flex-col gap-4">
              <audio
                ref={audioRef}
                src={src}
                preload="metadata"
                onLoadedMetadata={(e) => {
                  setDuration(e.currentTarget.duration);
                  setIsReady(true);
                }}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  disabled={!isReady}
                  className="text-xs border border-neutral-700 rounded-md px-3 py-1.5 disabled:opacity-40"
                >
                  {isPlaying ? "❚❚" : "▶"}
                </button>
                <div
                  ref={trackRef}
                  onClick={(e) => seekTo(e.clientX)}
                  className="flex-1 h-1.5 bg-neutral-800 rounded-full relative cursor-pointer"
                >
                  <div
                    className="absolute top-0 left-0 h-full rounded-full"
                    style={{ width: `${progressPct}%`, background: AMBER }}
                  />
                </div>
              </div>

              <div className="text-xs text-neutral-500 tabular-nums text-center">
                {formatClock(currentTime)} / {formatClock(duration)}
              </div>

              <button
                type="button"
                onClick={downloadAudio}
                className="text-xs border border-neutral-700 rounded-md px-3 py-1.5"
              >
                Download MP3
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}