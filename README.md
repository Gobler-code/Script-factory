# 🎬 Script Factory

**A Full-Stack AI Pipeline for Generating Short-Form Technical Documentary Scripts**

An intelligent automation system that transforms trending topics into engaging YouTube Shorts scripts — end to end, from a live web app down to the underlying AI agents. Script Factory combines real-time web research, AI-powered narrative writing, script analysis, and free neural text-to-speech narration, all served through a FastAPI + Supabase backend and a React frontend with a sidebar, history, and standalone caption/voiceover tools.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Architecture](#project-architecture)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Key Components](#key-components)
- [Progress Made](#progress-made)
- [API Requirements](#api-requirements)
- [Future Enhancements](#future-enhancements)

---

## 🎯 Overview

Script Factory takes any trending topic or tech event and produces a structured, narrative-driven script optimized for YouTube Shorts — then lets you turn that script into captions and a fully narrated voiceover, all from one app.

**Core Workflow:**
1. **Research Phase** → Gathers real-time data from the web using the Tavily API
2. **Writing Phase** → Generates engaging, high-retention scripts using Google Gemini AI
3. **Review Phase** → Analyzes the generated script for word count and estimated runtime
4. **Persistence Phase** → Every generated script is saved to a Postgres database (via Supabase)
5. **Narration Phase** → On demand, converts any script into a real, downloadable voiceover using free neural text-to-speech
6. **Presentation Phase** → A React app with a collapsible sidebar, chat-style history, and dedicated caption/voiceover tools

---

## ✨ Features

### 🔍 **Intelligent Web Research**
- Real-time data collection using the Tavily API
- Asynchronous research operations for efficiency

### 🎨 **Advanced Script Generation**
- AI-powered narrative writing using Google Gemini 2.5 Flash
- Optimized for short-form content (50-60 seconds)
- JSON-structured output validated with Pydantic

### 📊 **Automatic Script Review**
- Reviewer Agent calculates total word count and estimated spoken runtime
- Surfaced live in the frontend as animated counters

### 🗣️ **Free Neural Voiceover Generation** — *new*
- New **Narrator Agent** converts any script into narrated audio using `edge-tts` (Microsoft's free neural voices) — no API key, no per-character billing like ElevenLabs or Google Cloud TTS
- Multiple selectable voices (deep documentary, neutral, British, conversational)
- Audio is generated and streamed entirely in memory (no temp files on disk), then returned to the frontend as base64-encoded audio
- Custom-built inline audio player: play/pause, click-to-seek scrubber, live elapsed/total time, and MP3 download — no default browser `<audio>` controls

### 🗄️ **Persistent Storage with Supabase (Postgres)** — *new*
- Every generated script (topic, scenes, word count, estimated duration, timestamp) is saved automatically to a Postgres database via Supabase
- Backend talks to Supabase through its REST client — no raw SQL needed for day-to-day reads/writes
- Powers the sidebar's chat-style history

### 🧭 **Sidebar Navigation with Chat-Style History** — *new*
- Collapsible sidebar (logo doubles as a "collapse/expand" toggle) with:
  - **+ New Script** — the main generation flow
  - **Captions** / **Voiceover** — standalone tools, usable independent of a freshly-generated script
  - **History** — every past script you've generated, grouped into *Today*, *Yesterday*, *Previous 7 Days*, and by month beyond that, exactly like a chat app's conversation list
- Clicking any history entry reloads that exact script into the main view — no regeneration, no data loss
- History updates immediately after a new script is generated, without a page refresh, via a shared `HistoryContext`

### 🌐 **Client-Side Routing** — *new*
- Built with React Router: `/` (script generation), `/captions`, `/voiceover` — real URLs, browser back/forward support

### 🎬 **Standalone Caption & Voiceover Tools** — *new*
- `/captions` and `/voiceover` routes let you paste in *any* script text and generate captions or narration immediately — no need to regenerate a script first
- Reuse the exact same `CaptionGenerator` and `Narrator` components used inside the main flow — no duplicated logic

### 💬 **Built-In Caption Generator**
- Client-side caption timing engine — no extra API calls
- Auto-detects Script Factory's scene formatting and strips VISUAL/SFX labels to isolate narration
- Exports captions as **.srt** or **.ass** subtitle files

### 🎬 **Production-Ready Script Segments**
Each script segment includes:
- **Voiceover**: Premium, rhythmic narrative text with bold emphasis on key words
- **Visual Cues**: Brief 3-5 word placeholders for video context
- **Sound Effects Triggers**: Simple audio keywords for production enhancement

### 🎯 **Engagement Optimization**
- **The Paradox Hook**: Logic-defying opening (0-3s) to stop scrolling
- **Delayed Gratification**: True-crime-style buildup with hidden reveals
- **Invisible Loop Design**: Last line and first line combine into one seamless sentence, so the Short loops undetectably

---

## 🏗️ Project Architecture

```
┌───────────────────────────────────────────────────────────┐
│                     REACT FRONTEND                         │
│  Sidebar (History, Tools) ── React Router ── / /captions   │
│                                             └ /voiceover    │
└───────────┬─────────────────────────────────┬─────────────┘
            │ GET /generate?topic=...          │ POST /narrate
            ▼                                 ▼
   ┌────────────────────┐          ┌────────────────────────┐
   │   FastAPI (api.py) │          │   Narrator Agent        │
   └────────┬───────────┘          │   (edge-tts, in-memory) │
            │                      └────────────────────────┘
            ▼
   Researcher → ScriptWriter → Reviewer
            │
            ▼
   Supabase (Postgres) — scripts table
            │
            ▼
   GET /scripts, GET /scripts/{id} → Sidebar history, "load past script"
```

---

## 📁 Project Structure

```
Script-factory/
├── backend/
│   ├── main.py                  # CLI pipeline orchestrator
│   ├── api.py                   # FastAPI: /generate, /narrate, /scripts, /scripts/{id}
│   ├── db.py                    # Supabase client + save_script/list_scripts/get_script
│   ├── practice.py              # Mock script data for testing
│   ├── notes.md
│   └── agents/
│       ├── researcher.py        # Tavily web research
│       ├── scriptwriter.py      # Gemini script generation
│       ├── reviewer.py          # Word count + estimated runtime
│       └── narrator.py          # edge-tts voiceover generation (in-memory)
│
├── frontend/
│   └── landing-page/
│       ├── src/
│       │   ├── App.jsx                     # BrowserRouter + Sidebar + Routes
│       │   ├── main.jsx
│       │   ├── context/
│       │   │   └── HistoryContext.jsx      # Shared script-history state
│       │   └── components/
│       │       ├── Sidebar.jsx             # Collapsible nav + grouped history
│       │       ├── ScriptFactory.jsx        # Main generation flow
│       │       ├── CaptionGenerator.jsx     # SRT/ASS caption export
│       │       ├── Narrator.jsx             # Voice picker + player
│       │       ├── CaptionsPage.jsx         # Standalone captions route
│       │       └── VoiceoverPage.jsx        # Standalone voiceover route
│       ├── package.json
│       └── vite.config.js
│
├── README.md
├── .env
└── .gitignore
```

---

## 🛠️ Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Backend Language** | Python 3.x | Core pipeline implementation |
| **API Server** | FastAPI | Serves the pipeline over HTTP |
| **Database** | Supabase (Postgres) | Persists every generated script |
| **Web Research** | Tavily API | Real-time data collection |
| **AI/LLM** | Google Gemini 2.5 Flash | Script generation |
| **Text-to-Speech** | edge-tts | Free neural voiceover generation |
| **Validation** | Pydantic | Schema validation |
| **Frontend Framework** | React 19 | UI |
| **Routing** | React Router | `/`, `/captions`, `/voiceover` |
| **Build Tool** | Vite | Dev server & bundler |
| **Styling** | Tailwind CSS v4 | Utility-first styling |
| **Animation** | GSAP | Entrance animations, counters, loading states |

---

## 💾 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 18+ and npm
- API Keys: Tavily, Google Gemini
- A free [Supabase](https://supabase.com) project

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
pip install requests tavily-python google-genai pydantic python-dotenv fastapi uvicorn edge-tts supabase
```

Create `backend/.env`:
```env
TAVILY_API_KEY=your_tavily_api_key_here
GEMINI_API_KEY=your_google_gemini_api_key_here
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_role_key
```

> Use the **service_role** key here, never the anon key — this file only runs server-side and is never exposed to the browser.

In your Supabase project's SQL editor, create the table once:
```sql
create table scripts (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  scenes jsonb not null,
  word_count integer,
  estimated_duration real,
  created_at timestamptz default now()
);
```

Run the API server:
```bash
uvicorn api:app --reload
```
Available at `http://127.0.0.1:8000`.

### Frontend Setup

```bash
cd frontend/landing-page
npm install
npm run dev
```
Available at `http://localhost:5173`. Make sure the backend is running first — the frontend currently points at `http://127.0.0.1:8000`.

---

## 🚀 Usage

### Main Flow
1. Start the backend, then the frontend
2. Open `http://localhost:5173`, type a topic, hit **Generate**
3. Scenes stream in with animated word-count and runtime counters
4. Open **Generate Caption** or **Generate Voiceover** inline to export captions or narration for this script
5. The script is automatically saved — find it anytime in the sidebar's **History**, grouped by date

### Standalone Tools
- Click **Captions** or **Voiceover** in the sidebar to jump straight into either tool with any script you paste in — no need to regenerate one first

### Via the CLI Pipeline
```bash
cd backend
python main.py
```

### Via the API Directly
```bash
curl "http://127.0.0.1:8000/generate?topic=the%20CrowdStrike%20outage"
curl -X POST http://127.0.0.1:8000/narrate -H "Content-Type: application/json" \
  -d '{"scenes": [...], "voice": "en-US-GuyNeural"}'
curl "http://127.0.0.1:8000/scripts"
curl "http://127.0.0.1:8000/scripts/<id>"
```

---

## 🔧 Key Components

### 1. **Researcher Agent** (`backend/agents/researcher.py`)
Async Tavily web search for a given topic.

### 2. **ScriptWriter Agent** (`backend/agents/scriptwriter.py`)
Gemini 2.5 Flash + Pydantic schema validation to generate structured script segments.

### 3. **Reviewer Agent** (`backend/agents/reviewer.py`)
Word count + estimated spoken duration (words ÷ 2.5 words/sec).

### 4. **Narrator Agent** (`backend/agents/narrator.py`) — *new*
```python
async def narrate(script_segments, voice="en-US-GuyNeural"):
    ...
```
Strips markdown bold from voiceover text, streams synthesized speech from `edge-tts` directly into an in-memory `BytesIO` buffer (no disk writes — works cleanly even on serverless/ephemeral filesystems), and returns the buffer for the caller to encode and send back.

### 5. **`db.py`** (`backend/db.py`) — *new*
Thin wrapper around the Supabase Python client: `save_script`, `list_scripts`, `get_script`.

### 6. **API Layer** (`backend/api.py`)
- `GET /generate?topic=...` → research → write → review → save to Supabase → return script + review
- `POST /narrate` → `{ scenes, voice }` → returns base64-encoded MP3
- `GET /scripts` → list of saved scripts (for history)
- `GET /scripts/{id}` → full script by id (for reloading into the main view)

### 7. **Sidebar** (`frontend/.../Sidebar.jsx`) — *new*
Collapsible navigation with "+ New Script," tool links, and a chat-style **History** list grouped into Today / Yesterday / Previous 7 Days / by month, sourced from `HistoryContext`.

### 8. **HistoryContext** (`frontend/.../context/HistoryContext.jsx`) — *new*
Shared React context holding the list of saved scripts, so `Sidebar` (which displays it) and `ScriptFactory` (which triggers a refresh after generating) stay in sync without prop drilling. This is an in-memory cache of Supabase's data for the current session, not the source of truth itself.

### 9. **Narrator Component** (`frontend/.../Narrator.jsx`) — *new*
Voice picker, script preview, and a custom-built inline audio player (play/pause, click-to-seek, live time, MP3 download) — no native browser audio controls.

### 10. **CaptionsPage / VoiceoverPage** (`frontend/.../`) — *new*
Standalone routes that reuse `CaptionGenerator` and `Narrator` untouched, just fed from a pasted script instead of one generated moments earlier.

---

## 📈 Progress Made

### ✅ Phase 1–3: Foundation, Core Pipeline, Prompt Optimization (Completed)
Research → write → structured JSON output, with retention-focused prompting (Paradox Hook, Delayed Gratification, Invisible Loop).

### ✅ Phase 4: Script Review (Completed)
Reviewer agent wired into both CLI and API.

### ✅ Phase 5: API & Frontend (Completed)
FastAPI server, React + Vite + Tailwind + GSAP landing page, animated counters, script download.

### ✅ Phase 6: Caption Generator (Completed)
Client-side SRT/ASS caption export.

### ✅ Phase 7: Voiceover Generation (Completed)
- Narrator agent using free `edge-tts` neural voices
- In-memory audio streaming (no disk writes, serverless-safe)
- Voice selection, custom audio player, MP3 download

### ✅ Phase 8: Persistence & Navigation (Completed)
- Supabase (Postgres) integration — every script saved automatically
- React Router with dedicated `/captions` and `/voiceover` routes
- Collapsible sidebar with chat-style, date-grouped history
- Shared `HistoryContext` so new scripts appear in the sidebar immediately

---

## 🔑 API Requirements

### Tavily API
Real-time web search and data gathering.

### Google Gemini API
- **Model**: Gemini 2.5 Flash
- **Features Used**: `response_mime_type: 'application/json'`, `response_schema` (Pydantic), temperature 0.3

### edge-tts
No API key required — uses Microsoft Edge's free neural "Read Aloud" voice service under the hood. Unofficial, so worth monitoring for breaking changes upstream.

### Supabase
- Postgres database, accessed via the Supabase Python client (REST layer over Postgres, not raw SQL)
- Requires `SUPABASE_URL` and a **service_role** key, backend-only

### Internal Script Factory API
- `GET /generate?topic=<topic>`
- `POST /narrate` — body: `{ scenes, voice }`
- `GET /scripts`, `GET /scripts/{id}`
- CORS configured for `http://localhost:5173`

---

## 🚧 Future Enhancements

### Short-term
- [ ] Real-time history sync across tabs/sessions (Supabase Realtime, rather than manual refresh-on-generate)
- [ ] Word-level caption timing sourced directly from `edge-tts`'s streamed `WordBoundary` events, instead of estimated timing
- [ ] Error handling / retries on all agent API calls
- [ ] Configurable backend URL for frontend (currently hardcoded to `127.0.0.1:8000`)
- [ ] Rate limiting on `/generate` and `/narrate` ahead of any public deployment

### Medium-term
- [ ] Deployed hosting (backend on Render/Railway/Fly.io, frontend on Vercel)
- [ ] Delete/rename entries from history
- [ ] Multi-language support

### Long-term
- [ ] Automated video generation
- [ ] Trending-topic discovery model
- [ ] Microservices architecture

---

## 📝 Development Notes

- Added a **Reviewer Agent** for word count and estimated runtime
- Wrapped the pipeline in a **FastAPI** server for frontend consumption
- Built a full **React + Vite + Tailwind + GSAP** landing page
- Added a **Caption Generator** for SRT/ASS export
- Added a **Narrator Agent** using free `edge-tts` neural voices, streaming audio entirely in memory rather than to disk — deliberately chosen so it works identically on serverless hosts with ephemeral filesystems
- Added **Supabase (Postgres)** persistence for every generated script
- Rebuilt navigation around **React Router** with a collapsible **sidebar** and **chat-style, date-grouped history**, backed by a shared `HistoryContext`
- Added standalone **Captions** and **Voiceover** routes that reuse existing components rather than duplicating logic

---

## 🤝 Contributing

1. Add new agents in `backend/agents/`
2. Expand `backend/main.py` or `backend/api.py` with additional pipelines/endpoints
3. Add new Supabase tables/columns via the SQL editor, and a matching helper in `backend/db.py`
4. Add or update frontend components in `frontend/landing-page/src/components/`
5. Test backend logic with `backend/practice.py` before integration

---

## 📄 License

This project is developed for educational and commercial purposes.

---

## 📞 Support

- `backend/notes.md` — development notes and progress log
- `backend/practice.py` — testing and mock script data
- Individual agent files (`backend/agents/`) for component details
- `frontend/landing-page/src/components/` and `src/context/` for frontend behavior

---

**Built with ❤️ for AI-powered storytelling**