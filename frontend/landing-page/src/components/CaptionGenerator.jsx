

import { useState, useRef, useEffect } from "react";

// Drop this component anywhere in your React app.
// No API calls, no external services — pure client-side timing + formatting.
// Usage: <CaptionGenerator initialScript={geminiScriptOutput} />
// If you don't pass initialScript, it just starts empty and the user pastes one in.

const AMBER = "#FAC775";
const AMBER_INK = "#412402";

function looksLikeSceneScript(text) {
  return /^\s*SCENE\s*\d+/im.test(text);
}

// Strips SCENE/VISUAL/SFX labels and returns only the spoken narration lines.
// Keep this in sync with your Gemini prompt's output structure — if the block
// labels ever change, update the regexes below to match.
function extractNarration(text) {
  const lines = text.split("\n").map((l) => l.trim());
  let mode = "narration";
  const out = [];
  for (const line of lines) {
    if (line === "") continue;
    if (/^conversation with/i.test(line)) continue;
    if (/^scene\s*\d+/i.test(line)) { mode = "narration"; continue; }
    if (/^visual\s*\/?\s*$/i.test(line)) { mode = "visual"; continue; }
    if (/^sfx\s*\/?\s*$/i.test(line)) { mode = "sfx"; continue; }
    if (mode === "narration") out.push(line);
  }
  return out.join(" ").replace(/\s+/g, " ").trim();
}

function isHighlightWord(word, keywordList) {
  const clean = word.replace(/[^\w$%.-]/g, "");
  if (/\d/.test(clean)) return true;
  if (/[$%]/.test(word)) return true;
  return keywordList.includes(clean.toLowerCase());
}

function fmtSrtTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const ms = Math.round((sec - Math.floor(sec)) * 1000);
  const pad = (n, l = 2) => String(n).padStart(l, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)},${pad(ms, 3)}`;
}

function fmtAssTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = (sec % 60).toFixed(2);
  const pad = (n) => String(n).padStart(2, "0");
  return `${h}:${pad(m)}:${s < 10 ? "0" + s : s}`;
}

function buildCues(script, wpm, chunkSize, keywordList) {
  const words = script.split(/\s+/).filter(Boolean);
  const baseDur = 60 / wpm;
  let t = 0;
  const timed = words.map((w) => {
    const dur = baseDur + (w.replace(/[^\w]/g, "").length > 6 ? 0.12 : 0);
    const start = t;
    t += dur;
    return { word: w, start, end: t, hl: isHighlightWord(w, keywordList) };
  });

  const cues = [];
  for (let i = 0; i < timed.length; i += chunkSize) {
    const group = timed.slice(i, i + chunkSize);
    cues.push({ start: group[0].start, end: group[group.length - 1].end, words: group });
  }
  return cues;
}

function cuesToSrt(cues) {
  return cues
    .map((c, i) => {
      const text = c.words
        .map((w) => (w.hl ? `<font color="${AMBER}">${w.word}</font>` : w.word))
        .join(" ");
      return `${i + 1}\n${fmtSrtTime(c.start)} --> ${fmtSrtTime(c.end)}\n${text}\n`;
    })
    .join("\n");
}

function cuesToAss(cues) {
  const header = `[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,72,&H00F1F2F2,&H000000FF,&H00000000,&H00000000,-1,0,1,3,0,2,60,60,300,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;
  const body = cues
    .map((c) => {
      const text = c.words
        .map((w) => (w.hl ? `{\\c&H75C7FA&}${w.word}{\\c&HF2F1EA&}` : w.word))
        .join(" ");
      return `Dialogue: 0,${fmtAssTime(c.start)},${fmtAssTime(c.end)},Default,,0,0,0,,${text}`;
    })
    .join("\n");
  return header + body;
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function CaptionGenerator({ initialScript = "" }) {
  const [script, setScript] = useState(initialScript);
  const [wpm, setWpm] = useState(150);
  const [chunkSize, setChunkSize] = useState(3);
  const [keywords, setKeywords] = useState("");
  const [cues, setCues] = useState([]);
  const [tab, setTab] = useState("srt");
  const [previewIdx, setPreviewIdx] = useState(-1);
  const timerRef = useRef(null);

  const isScene = looksLikeSceneScript(script);
  const narration = isScene ? extractNarration(script) : script.trim();

  const srtText = cues.length ? cuesToSrt(cues) : "";
  const assText = cues.length ? cuesToAss(cues) : "";
  const output = tab === "srt" ? srtText : assText;

  function handleGenerate() {
    const keywordList = keywords
      .split(",")
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);
    setCues(buildCues(narration, wpm, chunkSize, keywordList));
    setPreviewIdx(-1);
  }

  function handleDownload() {
    if (!output) return;
    downloadText(tab === "srt" ? "captions.srt" : "captions.ass", output);
  }

  function handleCopy() {
    if (output) navigator.clipboard.writeText(output);
  }

  function playPreview() {
    let list = cues;
    if (!list.length) {
      const keywordList = keywords
        .split(",")
        .map((k) => k.trim().toLowerCase())
        .filter(Boolean);
      list = buildCues(narration, wpm, chunkSize, keywordList);
      setCues(list);
    }
    if (!list.length) return; // narration is empty, nothing to preview
    clearTimeout(timerRef.current);
    let i = 0;
    const step = () => {
      if (i >= list.length) return;
      setPreviewIdx(i);
      const dur = Math.max(300, (list[i].end - list[i].start) * 1000);
      i++;
      timerRef.current = setTimeout(step, dur);
    };
    step();
  }

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const activeCue = previewIdx >= 0 ? cues[previewIdx] : null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-neutral-950 text-neutral-100 rounded-xl">
      <h2 className="text-lg font-medium mb-1">Script → caption generator</h2>
      <p className="text-sm text-neutral-400 mb-6">
        Same timing model, same highlight rule, same style, every video.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* left column */}
        <div>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-neutral-400 tracking-wide">Script</label>
              <span className="text-xs" style={{ color: AMBER }}>
                {isScene ? "script factory format detected" : "plain script"}
              </span>
            </div>
            <textarea
              className="w-full h-56 bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-sm leading-relaxed focus:outline-none focus:border-neutral-600"
              placeholder="Paste a plain script, or a Script Factory SCENE/VISUAL/SFX block — both work."
              value={script}
              onChange={(e) => setScript(e.target.value)}
            />
          </div>

          {isScene && (
            <div className="mb-4">
              <label className="text-xs text-neutral-400 tracking-wide block mb-1">
                Extracted narration (this is what gets captioned)
              </label>
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-sm text-neutral-400 max-h-24 overflow-auto">
                {narration || "—"}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs text-neutral-400 flex justify-between mb-1">
                Speaking speed <span style={{ color: AMBER }}>{wpm} wpm</span>
              </label>
              <input
                type="range"
                min="110"
                max="190"
                value={wpm}
                onChange={(e) => setWpm(Number(e.target.value))}
                className="w-full accent-amber-400"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400 flex justify-between mb-1">
                Words per caption <span style={{ color: AMBER }}>{chunkSize}</span>
              </label>
              <input
                type="range"
                min="1"
                max="6"
                value={chunkSize}
                onChange={(e) => setChunkSize(Number(e.target.value))}
                className="w-full accent-amber-400"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs text-neutral-400 block mb-1">
              Extra highlight words (comma separated)
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="typo, foundation, fandation"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-sm focus:outline-none focus:border-neutral-600"
            />
          </div>

          <button
              type="button"
            onClick={handleGenerate}
            className="w-full rounded-lg py-2.5 text-sm font-medium"
            style={{ background: AMBER, color: AMBER_INK }}
          >
            Generate captions
          </button>
          <p className="text-[11px] text-neutral-500 mt-2 leading-relaxed">
            Timing is estimated from word count and speaking speed — re-sync against your
            actual voiceover audio before exporting.
          </p>
        </div>

        {/* right column */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="mx-auto w-40 aspect-[9/16] bg-black rounded-xl relative overflow-hidden mb-3">
            <div className="absolute left-3 right-3 bottom-8 text-center">
              <div className="text-white text-base font-medium leading-snug">
                {activeCue
                  ? activeCue.words.map((w, i) => (
                      <span key={i}>
                        {w.hl ? (
                          <span
                            className="px-1 rounded"
                            style={{ background: AMBER, color: AMBER_INK }}
                          >
                            {w.word}
                          </span>
                        ) : (
                          w.word
                        )}{" "}
                      </span>
                    ))
                  : "your captions appear here"}
              </div>
            </div>
          </div>
          <div className="flex justify-center mb-4">
            <button
              type="button"
              onClick={playPreview}
              className="text-xs border border-neutral-700 rounded-md px-3 py-1.5"
            >
              ▶ play preview
            </button>
          </div>

          <div className="flex gap-2 mb-2">
            {["srt", "ass"].map((f) => (
              <button
              type="button"
                key={f}
                onClick={() => setTab(f)}
                className={`text-xs px-3 py-1 rounded-md border ${
                  tab === f
                    ? "border-neutral-700 bg-neutral-800 text-neutral-100"
                    : "border-transparent text-neutral-500"
                }`}
              >
                .{f}
              </button>
            ))}
          </div>
          <pre className="bg-black border border-neutral-800 rounded-lg p-3 text-xs leading-relaxed max-h-60 overflow-auto whitespace-pre-wrap break-words text-neutral-300">
            {output || "Generate captions to see output here."}
          </pre>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={handleCopy}
              className="text-xs border border-neutral-700 rounded-md px-3 py-1.5"
            >
              Copy
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="text-xs border border-neutral-700 rounded-md px-3 py-1.5"
            >
              Download file
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}