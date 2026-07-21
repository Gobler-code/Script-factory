# 🎬 Script Factory

**A Full-Stack AI Pipeline for Generating Short-Form Technical Documentary Scripts**

An intelligent automation system that transforms trending topics into engaging YouTube Shorts scripts — end to end, from a live web app down to the underlying AI agents. Script Factory combines real-time web research, AI-powered narrative writing, and automatic script analysis, all served through a FastAPI backend and a React landing page with a built-in caption/subtitle generator.

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

Script Factory is a comprehensive AI pipeline designed to automate the creation of short-form technical documentary scripts. The system takes any trending topic or tech event as input and produces a structured, narrative-driven script optimized for YouTube Shorts — now accessible through a live, animated web frontend instead of just the command line.

**Core Workflow:**
1. **Research Phase** → Gathers real-time data from the web using the Tavily API
2. **Writing Phase** → Generates engaging, high-retention scripts using Google Gemini AI
3. **Review Phase** → Analyzes the generated script for word count and estimated runtime
4. **Serving Phase** → Exposes the whole pipeline through a FastAPI endpoint
5. **Presentation Phase** → A React landing page sends the topic, renders the script scene-by-scene, and lets the user generate downloadable captions

---

## ✨ Features

### 🔍 **Intelligent Web Research**
- Real-time data collection using the Tavily API
- Asynchronous research operations for efficiency
- Comprehensive fact gathering on any topic

### 🎨 **Advanced Script Generation**
- AI-powered narrative writing using Google Gemini 2.5 Flash
- Optimized for short-form content (50-60 seconds)
- Technical thriller storytelling approach
- JSON-structured output for easy integration

### 📊 **Automatic Script Review**
- New **Reviewer Agent** calculates total word count from the generated script
- Estimates spoken runtime (using a words-per-second speaking rate)
- Surfaces both metrics through the API so the frontend can display them live

### 🌐 **Live API Layer**
- FastAPI server (`api.py`) exposes a `/generate` endpoint
- Ties together research → writing → review in a single request
- CORS-enabled for local frontend development (`localhost:5173`)

### 🖥️ **React Frontend (Landing Page)**
- Built with React 19 + Vite + Tailwind CSS v4 + GSAP animations
- Type a topic, hit generate, and watch the script stream in scene-by-scene
- Animated word-count and runtime counters
- Duplicate-request guard so the same topic can't be regenerated needlessly
- Download the finished script as plain text (voiceover-only or full script with visual/SFX cues)

### 💬 **Built-In Caption Generator**
- New `CaptionGenerator` component turns any script into timed captions
- Pure client-side timing/formatting — no extra API calls
- Detects "scene script" formatting automatically and strips VISUAL/SFX labels to isolate narration
- Auto-highlights numbers, currency, percentages, and key words
- Exports captions as **.srt** or **.ass** subtitle files

### 🎬 **Production-Ready Script Segments**
Each script segment includes:
- **Voiceover**: Premium, rhythmic, word-for-word narrative text with bold emphasis on key words
- **Visual Cues**: Brief 3-5 word placeholders for video context
- **Sound Effects Triggers**: Simple audio keywords for production enhancement

### 🎯 **Engagement Optimization**
- **The Paradox Hook**: Logic-defying opening (0-3s) to stop scrolling
- **Delayed Gratification**: True-crime-style buildup with hidden reveals (3-25s)
- **Vocal Emboldening**: Strategic use of bold markdown for maximum delivery impact
- **Invisible Loop Design**: The last line and the first line are engineered to combine into one seamless, natural sentence so the Short loops undetectably

---

## 🏗️ Project Architecture

```
┌─────────────────────────────────────────────────────────┐
│              REACT FRONTEND (landing-page)               │
│         Topic input → fetch("/generate") → render        │
└────────────────────┬───────────────────────────────────┘
                      │ HTTP GET /generate?topic=...
                      ▼
        ┌────────────────────────────┐
        │      FastAPI (api.py)      │
        └────────────┬───────────────┘
                      │
                      ▼
        ┌────────────────────────────┐
        │   Researcher Agent         │
        │  (Tavily API Integration)  │
        └────────────┬───────────────┘
                      │ Research Data
                      ▼
        ┌────────────────────────────┐
        │   ScriptWriter Agent       │
        │  (Gemini 2.5 Flash API)    │
        │  (Pydantic Validation)     │
        └────────────┬───────────────┘
                      │ Script Segments (JSON)
                      ▼
        ┌────────────────────────────┐
        │     Reviewer Agent         │
        │  (Word count + runtime)    │
        └────────────┬───────────────┘
                      │
                      ▼
        ┌────────────────────────────┐
        │ { review, response } JSON  │
        │ → rendered as scenes       │
        │ → optional caption export  │
        └────────────────────────────┘
```

---

## 📁 Project Structure

```
Script-factory/
├── backend/
│   ├── main.py                 # CLI pipeline orchestrator (research → write → review)
│   ├── api.py                  # FastAPI server exposing /generate
│   ├── practice.py             # Development/testing file with mock script data
│   ├── notes.md                # Project notes and development log
│   └── agents/
│       ├── researcher.py       # Web research agent (Tavily API)
│       ├── scriptwriter.py     # Script generation agent (Gemini API)
│       └── reviewer.py         # Word count + estimated runtime agent
│
├── frontend/
│   └── landing-page/           # React + Vite + Tailwind + GSAP web app
│       ├── src/
│       │   ├── App.jsx
│       │   ├── main.jsx
│       │   └── components/
│       │       ├── ScriptFactory.jsx     # Main topic input + scene renderer
│       │       └── CaptionGenerator.jsx  # SRT/ASS caption export tool
│       ├── public/
│       ├── package.json
│       └── vite.config.js
│
├── README.md                   # This file
├── .env                         # API keys (not committed)
└── .gitignore                   # Git ignore rules
```

---

## 🛠️ Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Backend Language** | Python 3.x | Core pipeline implementation |
| **API Server** | FastAPI | Serves the pipeline over HTTP |
| **Async** | asyncio | Asynchronous research operations |
| **Web Research** | Tavily API | Real-time data collection |
| **AI/LLM** | Google Gemini 2.5 Flash | Script generation |
| **Validation** | Pydantic | Type safety & schema validation |
| **Environment** | python-dotenv | Configuration management |
| **HTTP (backend)** | requests | API communication |
| **Frontend Framework** | React 19 | UI for topic input & script display |
| **Build Tool** | Vite | Frontend dev server & bundler |
| **Styling** | Tailwind CSS v4 | Utility-first styling |
| **Animation** | GSAP | Entrance animations, counters, loading bar |

---

## 💾 Installation & Setup

### Prerequisites
- Python 3.8 or higher
- Node.js 18+ and npm (for the frontend)
- API Keys:
  - Tavily API Key (for web research)
  - Google Gemini API Key (for script generation)

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install requests tavily-python google-genai pydantic python-dotenv fastapi uvicorn
```

Create a `.env` file in the `backend/` directory:
```env
TAVILY_API_KEY=your_tavily_api_key_here
GEMINI_API_KEY=your_google_gemini_api_key_here
```

Run the API server:
```bash
uvicorn api:app --reload
```
The API will be available at `http://127.0.0.1:8000`.

### Frontend Setup

```bash
cd frontend/landing-page
npm install
npm run dev
```
The app will be available at `http://localhost:5173`.

> The frontend currently points at `http://127.0.0.1:8000/generate`, so make sure the backend is running first.

---

## 🚀 Usage

### Via the Web App (recommended)
1. Start the FastAPI backend (`uvicorn api:app --reload` from `backend/`)
2. Start the frontend (`npm run dev` from `frontend/landing-page/`)
3. Open `http://localhost:5173`, type a topic (e.g. *"the CrowdStrike outage"*), and hit **Generate**
4. Scenes stream in with animated word-count and runtime counters
5. Optionally open the **Caption Generator** panel to export `.srt` or `.ass` subtitles, or download the raw script as text

### Via the CLI Pipeline
```bash
cd backend
python main.py
```
This will:
1. Research a hardcoded topic (`"CrowdStrike outage"`)
2. Generate a JSON array of script segments
3. Run the Reviewer Agent and print total word count + estimated duration

### Via the API Directly
```bash
curl "http://127.0.0.1:8000/generate?topic=the%20CrowdStrike%20outage"
```

**Response shape:**
```json
{
  "review": {
    "total words": 142,
    "Estimated Duration": 56.8
  },
  "response": [
    {
      "voiceover": "A **massive** contradiction about the tech event...",
      "rough_visual_cue": "Server racks glitching",
      "rough_sfx_trigger": "[System crash sound]"
    }
  ]
}
```

---

## 🔧 Key Components

### 1. **Researcher Agent** (`backend/agents/researcher.py`)
Handles real-time web research using the Tavily API.

**Key Functions:**
- `research(topic)` — async function to search and gather research data

### 2. **ScriptWriter Agent** (`backend/agents/scriptwriter.py`)
Transforms research data into engaging scripts using Gemini 2.5 Flash.

**Pydantic Model:**
```python
class ScriptSegment(BaseModel):
    voiceover: str = Field(description="Premium narrative text")
    rough_visual_cue: str = Field(description="3-5 word visual placeholder")
    rough_sfx_trigger: str = Field(description="1-2 word audio trigger")
```

**Prompt Strategy:**
- 90/10 Rule: 90% focus on voiceover quality
- Paradox Hook: attention-grabbing opening
- Delayed Gratification: story-building tension
- Invisible Loop: the model self-validates that the last line + first line combine into one natural sentence before returning the script

### 3. **Reviewer Agent** (`backend/agents/reviewer.py`) — *new*
Analyzes a generated script and returns simple production metrics.

- Counts total words across all voiceover segments
- Estimates spoken duration (words ÷ 2.5 words/sec)
- Returns `{"total words": ..., "Estimated Duration": ...}`

### 4. **API Layer** (`backend/api.py`) — *new*
FastAPI app that ties the three agents together behind a single `GET /generate?topic=...` endpoint, with CORS enabled for the Vite dev server.

### 5. **ScriptFactory Component** (`frontend/landing-page/src/components/ScriptFactory.jsx`) — *new*
The main React UI: topic input, GSAP-animated headline/loading states, scene cards with bolded voiceover text, animated word/runtime counters, script download buttons, and a toggle into the caption workspace.

### 6. **CaptionGenerator Component** (`frontend/landing-page/src/components/CaptionGenerator.jsx`) — *new*
A standalone, client-side caption/subtitle builder:
- Auto-detects Script Factory's scene formatting and extracts just the narration
- Times out cues based on words-per-minute and chunk size
- Highlights numbers, currency, and key terms
- Exports `.srt` and `.ass` subtitle files for editing software

---

## 📈 Progress Made

### ✅ **Phase 1: Foundation (Completed)**
- [x] Project structure established
- [x] Tavily API integration for web research
- [x] Google Gemini AI integration
- [x] Asynchronous pipeline architecture

### ✅ **Phase 2: Core Pipeline (Completed)**
- [x] Researcher agent fully functional
- [x] ScriptWriter agent with advanced prompting
- [x] Pydantic model validation for script segments
- [x] End-to-end CLI pipeline working (main.py)
- [x] JSON output with voiceovers, visual cues, and SFX

### ✅ **Phase 3: Optimization (Completed)**
- [x] Temperature control for script consistency
- [x] Advanced narrative prompting (90/10 rule)
- [x] Paradox Hook strategy implementation
- [x] Delayed Gratification storytelling
- [x] Vocal emboldening with markdown
- [x] Invisible loop script design with self-validation step

### ✅ **Phase 4: Script Review (Completed)**
- [x] Reviewer agent for word count and estimated runtime
- [x] Reviewer wired into both the CLI pipeline and the API

### ✅ **Phase 5: API & Frontend (Completed)**
- [x] FastAPI server exposing `/generate`
- [x] CORS configured for local frontend development
- [x] React + Vite + Tailwind + GSAP landing page
- [x] Animated topic input, scene rendering, and live counters
- [x] Script download (voiceover-only or full script)
- [x] Duplicate-topic request guard

### ✅ **Phase 6: Caption Generator (Completed)**
- [x] Client-side caption timing engine
- [x] Automatic scene-script narration extraction
- [x] Keyword/number highlighting
- [x] SRT and ASS subtitle export

---

## 🔑 API Requirements

### Tavily API
- **Purpose**: Real-time web search and data gathering
- **Endpoint**: Tavily Search API
- **Authentication**: API Key via environment variable
- **Rate Limits**: Depends on subscription tier

### Google Gemini API
- **Model**: Gemini 2.5 Flash
- **Purpose**: Advanced script generation with JSON schema validation
- **Authentication**: API Key via environment variable
- **Features Used**:
  - `response_mime_type`: `'application/json'`
  - `response_schema`: Pydantic model validation
  - Temperature: 0.3 (for consistency)

### Internal Script Factory API
- **Endpoint**: `GET /generate?topic=<topic>`
- **Server**: FastAPI, served locally via `uvicorn`
- **CORS**: Configured for `http://localhost:5173`
- **Returns**: `{ review, response }` — review metrics plus the full script segment array

---

## 🚧 Future Enhancements

### Short-term (Next Iterations)
- [ ] Support for multiple topics in batch mode
- [ ] Script variation generation (A/B testing)
- [ ] Caching system for research results
- [ ] Performance metrics and logging
- [ ] Error handling and retry logic (including on the frontend fetch)
- [ ] Configurable backend URL for the frontend (currently hardcoded to `127.0.0.1:8000`)

### Medium-term
- [ ] Database integration for script storage
- [ ] Deployed hosting for both frontend and backend (currently local-only)
- [ ] Analytics tracking for script performance
- [ ] Multi-language support

### Long-term
- [ ] Voice synthesis integration
- [ ] Automated video generation
- [ ] Machine learning model for topic trending
- [ ] Microservices architecture

---

## 📝 Development Notes

- **Day 7**: Full CLI pipeline (`main.py`) worked end-to-end
- Added a **Reviewer Agent** to calculate word count and estimated spoken duration
- Wrapped the pipeline in a **FastAPI** server (`api.py`) for frontend consumption
- Built a full **React + Vite + Tailwind + GSAP** landing page (`frontend/landing-page`) to replace the CLI-only workflow
- Added a standalone **Caption Generator** for SRT/ASS subtitle export directly from generated scripts
- **Narrative Strategy**: Technical thriller approach for maximum engagement
- **Script Length**: Optimized for 50-60 second YouTube Shorts
- **AI Model**: Using Gemini 2.5 Flash for speed and quality balance

---

## 🤝 Contributing

To extend Script Factory:
1. Add new agents in `backend/agents/`
2. Expand `backend/main.py` or `backend/api.py` with additional pipelines/endpoints
3. Create new Pydantic models in the respective agent files
4. Add or update frontend components in `frontend/landing-page/src/components/`
5. Test backend logic with `backend/practice.py` before integration

---

## 📄 License

This project is developed for educational and commercial purposes.

---

## 📞 Support

For issues or questions about the pipeline, refer to:
- `backend/notes.md` — development notes and progress log
- `backend/practice.py` — testing and mock script data
- Individual agent files (`backend/agents/`) for specific component details
- `frontend/landing-page/src/components/` for frontend behavior

---

**Built with ❤️ for AI-powered storytelling**