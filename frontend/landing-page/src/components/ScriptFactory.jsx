import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import CaptionGenerator from "./CaptionGenerator";

const HEADLINE = "SCRIPT FACTORY";

const MOCK_SCENES = [
  {
    voiceover:
      "Nineteen minutes. That's how long it took a single bad update to ground planes, freeze hospitals, and black out **8.5 million** Windows machines worldwide.",
    rough_visual_cue: "Airport departure boards flipping to red, all cancelled",
    rough_sfx_trigger: "[Low drone, single alert tone]",
  },
  {
    voiceover:
      "It wasn't a hack. It wasn't even complicated code. A routine content update from CrowdStrike shipped a **logic error** straight into the kernel.",
    rough_visual_cue: "Zoom into a terminal, a single diff line highlighted",
    rough_sfx_trigger: "[Keyboard typing, sudden silence]",
  },
  {
    voiceover:
      "Every affected machine hit the same wall: the Blue Screen of Death, stuck in a boot loop with no easy fix but manual intervention.",
    rough_visual_cue: "Rows of monitors all showing BSOD simultaneously",
    rough_sfx_trigger: "[System crash chime, echo]",
  },
];

function renderVoiceover(text) {
  const escaped = String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const withBold = escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  return { __html: withBold };
}

function formatClock(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

export default function ScriptFactory() {
  const [topic, setTopic] = useState("");
  // Track the exact topic string that is currently rendered on screen
  const [activeTopic, setActiveTopic] = useState(""); 
  const [status, setStatus] = useState("idle"); // idle | loading | error | done
  const [errorMsg, setErrorMsg] = useState("");
  const [scenes, setScenes] = useState([]);
  const [wordCount, setWordCount] = useState(0);
  const [estimatedSeconds, setEstimatedSeconds] = useState(0);
  const [showCaptionPane, setShowCaptionPane] = useState(false);
 
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const searchRef = useRef(null);
  const processingBarRef = useRef(null);
  const resultsRef = useRef(null);
  const wordDisplayRef = useRef(null);
  const timeDisplayRef = useRef(null);
  const tweenTargets = useRef({ words: 0, seconds: 0 });

  // Entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const letters = headlineRef.current?.querySelectorAll(".sf-letter");
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(letters, {
        opacity: 0,
        y: 32,
        duration: 0.7,
        stagger: 0.02,
        clearProps: "opacity,transform",
      })
        .from(
          subRef.current,
          { opacity: 0, y: 12, duration: 0.5, clearProps: "opacity,transform" },
          "-=0.35"
        )
        .from(
          searchRef.current,
          { opacity: 0, y: 12, duration: 0.5, clearProps: "opacity,transform" },
          "-=0.3"
        );
    });
    return () => ctx.revert();
  }, []);

  // Loading loop
  useEffect(() => {
    if (status !== "loading" || !processingBarRef.current) return;
    const tween = gsap.fromTo(
      processingBarRef.current,
      { xPercent: -100 },
      { xPercent: 400, duration: 1.1, repeat: -1, ease: "power1.inOut" }
    );
    return () => tween.kill();
  }, [status]);

  // Results entrance count-ups
  useEffect(() => {
    if (status !== "done" || !resultsRef.current) return;

    const cards = resultsRef.current.querySelectorAll(".sf-scene");
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out",
      stagger: 0.08,
      delay: 0.1,
    });

    const counter = tweenTargets.current;
    counter.words = 0;
    counter.seconds = 0;
    gsap.to(counter, {
      words: wordCount,
      seconds: estimatedSeconds,
      duration: 1,
      ease: "power2.out",
      onUpdate: () => {
        if (wordDisplayRef.current) {
          wordDisplayRef.current.textContent = Math.round(counter.words);
        }
        if (timeDisplayRef.current) {
          timeDisplayRef.current.textContent = formatClock(counter.seconds);
        }
      },
    });
  }, [status, scenes, wordCount, estimatedSeconds]);

  async function runSearch(e) {
    e?.preventDefault();
    const trimmed = topic.trim();
    
    // Guard Clause: Block request if empty, loading, OR matches the active visible topic
    if (!trimmed || status === "loading" || trimmed.toLowerCase() === activeTopic.toLowerCase()) return;

    setStatus("loading");
    setErrorMsg("");
    setShowCaptionPane(false); 

    try {
      const URL = `http://127.0.0.1:8000/generate?topic=${encodeURIComponent(trimmed)}`;
      const result = await fetch(URL);
      const data = await result.json();
      
      setScenes(data.response);
      setWordCount(data.review["total words"]);
      setEstimatedSeconds(data.review["Estimated Duration"]);
      
      // Save the topic successfully generated to lock duplicate requests
      setActiveTopic(trimmed);
      setStatus("done");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong.");
      setStatus("error");
    }
  }

  const captionScript = scenes.map((scene) => scene.voiceover).join(" ");
  
  // Dynamic button parameters
  const isDuplicate = topic.trim().toLowerCase() === activeTopic.toLowerCase() && status === "done";
  const isSubmitDisabled = status === "loading" || !topic.trim() || isDuplicate;

  return (
    <div className="min-h-screen bg-[#0a0a09] text-[#f3f1ea] font-sans relative overflow-x-hidden">
      {/* Hero Header Area */}
      <section className={`transition-opacity duration-300 ${showCaptionPane ? "opacity-40" : "opacity-100"} flex flex-col items-center justify-center px-6 pt-[8vh] pb-6 text-center relative z-10`}>
        <div className="font-mono text-[11px] tracking-[0.32em] uppercase text-[#8f8c82] mb-7">
          <span className="text-[#f3f1ea]">●</span> script generation
        </div>

        <h1
          ref={headlineRef}
          aria-label={HEADLINE}
          className="font-serif font-light leading-[0.96] tracking-tight text-[clamp(48px,11vw,128px)]"
        >
          {HEADLINE.split("").map((char, i) => (
            <span className="sf-letter inline-block will-change-transform" key={i}>
              {char === " " ? "\u00A0\u00A0" : char}
            </span>
          ))}
        </h1>

        <p ref={subRef} className="mt-6 max-w-[480px] text-base leading-relaxed text-[#8f8c82]">
          Give it a topic. Get back a{" "}
          <em className="not-italic font-serif italic text-[#f3f1ea]">shot-ready</em> script.
        </p>

        <form ref={searchRef} onSubmit={runSearch} className="mt-14 w-[min(560px,88vw)]">
          <div className="flex items-end gap-5 border-b border-[#f3f1ea]/30 pb-3.5 transition-colors focus-within:border-[#f3f1ea]">
            <span className="font-mono text-[11px] tracking-[0.18em] text-[#55534c] pb-[3px] whitespace-nowrap">
              TOPIC /
            </span>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. the CrowdStrike outage"
              aria-label="Script topic"
              className="flex-1 bg-transparent outline-none font-serif italic text-xl text-[#f3f1ea] placeholder:text-[#55534c] placeholder:italic"
            />
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="font-mono text-xs tracking-[0.14em] text-[#f3f1ea]/90 hover:text-[#f3f1ea] hover:translate-x-0.5 disabled:opacity-35 disabled:hover:translate-x-0 transition-all py-1.5 whitespace-nowrap uppercase"
            >
              {status === "loading" ? "WRITING…" : isDuplicate ? "ALREADY GENERATED" : "GENERATE →"}
            </button>
          </div>
          <div
            className={`mt-3.5 text-xs min-h-[16px] ${
              status === "error" ? "text-[#d6a89a]" : "text-[#55534c]"
            }`}
          >
            {status === "error"
              ? errorMsg
              : isDuplicate
              ? "This script is already loaded below."
              : status === "idle"
              ? "Press enter to send it to the backend."
              : "\u00A0"}
          </div>
        </form>

        {status === "loading" && (
          <div
            aria-hidden="true"
            className="w-[min(560px,88vw)] mx-auto mt-4 h-px bg-[#f3f1ea]/10 relative overflow-hidden"
          >
            <div
              ref={processingBarRef}
              className="absolute top-0 left-0 h-full w-[30%] bg-[#f3f1ea]"
            />
          </div>
        )}
      </section>

      {/* Main Response Output Container */}
      {status === "done" && (
        <section ref={resultsRef} className="w-full px-6 pb-36 relative z-10 transition-all duration-300">
          {scenes.length === 0 ? (
            <div className="text-center py-20 px-6 text-[#8f8c82] text-sm">
              No scenes came back for this topic. Try rephrasing it.
            </div>
          ) : (
            <div className={`grid gap-10 transition-all duration-300 items-start ${showCaptionPane ? "grid-cols-1 lg:grid-cols-2 max-w-[1600px] mx-auto" : "max-w-[760px] mx-auto grid-cols-1"}`}>
              
              {/* SCRIPT COLUMN PANEL */}
              <div className={`${showCaptionPane ? "bg-[#111310]/40 border border-[#f3f1ea]/10 rounded-lg p-6 lg:p-8 max-h-[75vh] overflow-y-auto" : ""}`}>
                <div className="flex justify-between items-baseline border-t border-b border-[#f3f1ea]/10 py-4.5 px-1 mb-10 font-mono">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#55534c]">Est. runtime</span>
                    <span className="text-xl tabular-nums text-[#f3f1ea]"><span ref={timeDisplayRef}>00:00</span></span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#55534c]">Word count</span>
                    <span className="text-xl tabular-nums text-[#f3f1ea]"><span ref={wordDisplayRef}>0</span></span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#55534c]">Scenes</span>
                    <span className="text-xl tabular-nums text-[#f3f1ea]">{scenes.length}</span>
                  </div>
                </div>

                {scenes.map((scene, i) => (
                  <article
                    key={i}
                    className="sf-scene grid grid-cols-[70px_1fr] gap-5 py-8 border-b border-[#f3f1ea]/10 last:border-none translate-y-7 max-[640px]:grid-cols-1 max-[640px]:gap-2"
                  >
                    <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#55534c] pt-1.5 max-[640px]:flex max-[640px]:items-baseline max-[640px]:gap-2.5 max-[640px]:pt-0">
                      SCENE
                      <span className="block text-xl text-[#8f8c82] tracking-normal mt-1 max-[640px]:mt-0 max-[640px]:inline">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div>
                      <p
                        className="font-serif italic text-[clamp(17px,2.2vw,21px)] leading-relaxed text-[#f3f1ea] mb-4 [&>strong]:not-italic [&>strong]:font-medium"
                        dangerouslySetInnerHTML={renderVoiceover(scene.voiceover)}
                      />
                      <div className="flex flex-col gap-1.5">
                        <div className="flex gap-2 items-baseline font-mono text-xs">
                          <span className="text-[#55534c] tracking-[0.14em] shrink-0">VISUAL /</span>
                          <span className="text-[#8f8c82]">{scene.rough_visual_cue}</span>
                        </div>
                        <div className="flex gap-2 items-baseline font-mono text-xs">
                          <span className="text-[#55534c] tracking-[0.14em] shrink-0">SFX /</span>
                          <span className="text-[#8f8c82]">{scene.rough_sfx_trigger}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}

                {!showCaptionPane && (
                  <div className="mt-10 flex justify-center">
                    <button
                      onClick={() => setShowCaptionPane(true)}
                      className="font-mono text-xs tracking-[0.14em] text-[#f3f1ea]/90 hover:text-[#f3f1ea] hover:translate-x-0.5 transition-all py-1.5 whitespace-nowrap"
                    >
                      GENERATE CAPTION →
                    </button>
                  </div>
                )}
              </div>

              {/* CAPTIONS WORKSPACE SIDE PANEL */}
              {showCaptionPane && (
                <div className="bg-[#111310] border border-[#f3f1ea]/10 rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300 max-h-[75vh] flex flex-col">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-[#f3f1ea]/10 bg-[#111310] shrink-0">
                    <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#8f8c82]">
                      Caption Generator Workspace
                    </span>
                    <button
                      onClick={() => setShowCaptionPane(false)}
                      aria-label="Back to single column view"
                      className="font-mono text-xs text-[#8f8c82] hover:text-[#f3f1ea] transition-colors border border-[#f3f1ea]/20 px-2.5 py-1 rounded bg-transparent hover:bg-[#f3f1ea]/5"
                    >
                      ✕ CLOSE PANEL
                    </button>
                  </div>
                  <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
                    <CaptionGenerator initialScript={captionScript} />
                  </div>
                </div>
              )}

            </div>
          )}
        </section>
      )}
    </div>
  );
}