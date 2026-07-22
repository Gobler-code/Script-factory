# 🎬 Script Factory

**A Full-Stack AI Pipeline for Generating Short-Form Technical Documentary Scripts**

 An intelligent automation system that transforms trending topics into engaging YouTube Shorts scripts — end to end, from a live web app down to the underlying AI agents. Script Factory combines real-time web research, AI-powered narrative writing, and automatic script analysis, all served through a FastAPI backend and a React landing page with a built-in caption/subtitle generator and AI voiceover — all through a modern React web interface powered by a FastAPI backend.

The goal is simple:

> **Turn an idea into a narrated, production-ready YouTube Short.**

---

## 📋 Table of Contents

* [Overview](#-overview)
* [Core Workflow](#-core-workflow)
* [Features](#-features)
* [Project Architecture](#-project-architecture)
* [Project Structure](#-project-structure)
* [Tech Stack](#-tech-stack)
* [Installation & Setup](#-installation--setup)
* [Usage](#-usage)
* [API Endpoints](#-api-endpoints)
* [Key Components](#-key-components)
* [Voiceover System](#-voiceover-system)
* [Progress](#-progress)
* [API Requirements](#-api-requirements)
* [Future Enhancements](#-future-enhancements)
* [Contributing](#-contributing)
* [License](#-license)

---

## 🎯 Overview

Script Factory is a full-stack AI content creation pipeline designed specifically for short-form technical documentaries and YouTube Shorts.

Instead of manually researching a topic, writing a script, calculating its duration, creating captions, and recording narration, Script Factory brings the entire process into one workflow.

A user enters a topic and the system can:

1. Research the topic using real-time web data
2. Generate a structured, narrative-driven script
3. Analyze word count and estimated runtime
4. Generate timed subtitles
5. Convert the generated script into AI voiceover
6. Choose from multiple narrator voices
7. Preview and control the generated narration
8. Download the final voiceover as an MP3

The system is built around a modular AI-agent architecture, making it possible to expand the pipeline with additional agents and production tools over time.

---

## 🔄 Core Workflow

```text
                    ┌───────────────────┐
                    │   ENTER TOPIC     │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │  RESEARCH AGENT   │
                    │   Tavily Search   │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │ SCRIPTWRITER AGENT│
                    │   Gemini 2.5 Flash│
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │  REVIEWER AGENT   │
                    │ Word Count + Time  │
                    └─────────┬─────────┘
                              │
                 ┌────────────┴────────────┐
                 │                         │
                 ▼                         ▼
       ┌───────────────────┐     ┌───────────────────┐
       │ CAPTION GENERATOR │     │  NARRATOR AGENT   │
       │     SRT / ASS     │     │     Edge TTS      │
       └───────────────────┘     └─────────┬─────────┘
                                           │
                                           ▼
                                 ┌───────────────────┐
                                 │ AUDIO PLAYER      │
                                 │ Play / Seek / Time │
                                 └─────────┬─────────┘
                                           │
                                           ▼
                                 ┌───────────────────┐
                                 │   DOWNLOAD MP3    │
                                 └───────────────────┘
```

---

## ✨ Features

### 🔍 Intelligent Web Research

* Real-time topic research using the Tavily API
* Asynchronous research operations
* Collects relevant information before script generation
* Allows the AI writer to build stories from current information

---

### ✍️ AI Script Generation

* Powered by Google Gemini 2.5 Flash
* Generates structured JSON script segments
* Optimized for short-form content
* Technical thriller storytelling approach
* Designed around high-retention narrative principles
* Includes voiceover, visual cues, and SFX triggers

Each generated scene contains:

```json
{
  "voiceover": "Narrative text for the scene",
  "rough_visual_cue": "Server racks glitching",
  "rough_sfx_trigger": "[System crash sound]"
}
```

---

### 📊 Automatic Script Review

The Reviewer Agent analyzes the generated script and provides:

* Total word count
* Estimated spoken duration
* Production-ready script metrics

This allows creators to quickly determine whether the generated script fits the intended short-form video duration.

---

### 💬 Built-In Caption Generator

The Caption Generator transforms generated scripts into subtitles.

Features include:

* Automatic narration extraction
* Scene formatting detection
* Removes visual and SFX labels
* Automatic caption timing
* Keyword highlighting
* Number and currency highlighting
* `.srt` subtitle export
* `.ass` subtitle export

The caption system runs client-side and does not require an additional API request.

---

### 🎙️ AI Voiceover Generation

Script Factory can now transform the generated script directly into spoken narration.

The new **Narrator** component takes the generated scenes and sends them to the FastAPI backend, where the Narrator Agent converts the script into audio using **Edge TTS**.

### Available Voices

| Voice     | Style                |
| --------- | -------------------- |
| **Guy**   | Deep, documentary    |
| **Aria**  | Clear, neutral       |
| **Ryan**  | British              |
| **Jenny** | Warm, conversational |

The user can select a voice before generating the narration.

The complete voiceover workflow is:

```text
Generated Script
      │
      ▼
Select Voice
      │
      ▼
POST /narrate
      │
      ▼
Narrator Agent
      │
      ▼
Edge TTS
      │
      ▼
MP3 Audio Buffer
      │
      ▼
Base64 Audio Response
      │
      ▼
Browser Audio Player
      │
      ├── Play / Pause
      ├── Seek
      ├── View Duration
      └── Download MP3
```

---

### 🎧 Custom Audio Player

The Narrator component includes a custom audio interface that allows users to:

* Play generated narration
* Pause narration
* Seek through the audio timeline
* View current playback time
* View total duration
* Download generated narration as an MP3

The generated audio is converted from Base64 into a browser-compatible Blob and played through the HTML5 Audio API.

---

### 🎬 Production-Ready Script Segments

Each script segment contains:

* **Voiceover** — The actual narration
* **Visual Cue** — Suggested visual direction
* **SFX Trigger** — Suggested sound effect

This structure allows the same generated script to power multiple production stages:

```text
                 Script Segment
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
    Voiceover      Visual Cue     SFX Trigger
        │
        ├───────────────► AI Voiceover
        │
        └───────────────► Captions
```

---

### 🎯 Engagement Optimization

The ScriptWriter Agent uses several storytelling techniques:

#### The Paradox Hook

A logic-defying opening designed to stop viewers from scrolling.

#### Delayed Gratification

Information is revealed gradually to build tension and curiosity.

#### Vocal Emboldening

Important words can be emphasized using Markdown formatting.

#### Invisible Loop Design

The beginning and ending of the script are designed to connect naturally, helping create seamless looping Shorts.

---

## 🏗️ Project Architecture

```text
                         ┌─────────────────────────┐
                         │      REACT FRONTEND      │
                         │                         │
                         │  Topic Input            │
                         │  Script Renderer         │
                         │  Caption Generator      │
                         │  Narrator                │
                         └────────────┬────────────┘
                                      │
                       ┌──────────────┴──────────────┐
                       │                             │
                       │ GET /generate               │ POST /narrate
                       │                             │
                       ▼                             ▼
             ┌───────────────────┐         ┌───────────────────┐
             │      FastAPI       │         │      FastAPI      │
             │      API Layer     │         │      API Layer    │
             └─────────┬─────────┘         └─────────┬─────────┘
                       │                             │
                       ▼                             ▼
             ┌───────────────────┐         ┌───────────────────┐
             │ Researcher Agent  │         │  Narrator Agent   │
             │      Tavily       │         │     Edge TTS      │
             └─────────┬─────────┘         └─────────┬─────────┘
                       │                             │
                       ▼                             ▼
             ┌───────────────────┐         ┌───────────────────┐
             │ ScriptWriter Agent│         │    MP3 Audio      │
             │ Gemini 2.5 Flash  │         │   Base64 Response │
             └─────────┬─────────┘         └─────────┬─────────┘
                       │                             │
                       ▼                             ▼
             ┌───────────────────┐         ┌───────────────────┐
             │  Reviewer Agent   │         │   Audio Player    │
             │ Word Count / Time │         │  Play / Seek /    │
             └─────────┬─────────┘         │  Download         │
                       │                   └───────────────────┘
                       ▼
             ┌───────────────────┐
             │ Script + Metrics  │
             └───────────────────┘
```

---

## 📁 Project Structure

```text
Script-factory/
│
├── backend/
│   ├── main.py
│   ├── api.py
│   ├── practice.py
│   ├── notes.md
│   │
│   └── agents/
│       ├── researcher.py
│       ├── scriptwriter.py
│       ├── reviewer.py
│       └── narrator.py
│
├── frontend/
│   └── landing-page/
│       ├── src/
│       │   ├── App.jsx
│       │   ├── main.jsx
│       │   │
│       │   └── components/
│       │       ├── ScriptFactory.jsx
│       │       ├── CaptionGenerator.jsx
│       │       └── Narrator.jsx
│       │
│       ├── public/
│       ├── package.json
│       └── vite.config.js
│
├── README.md
├── .env
└── .gitignore
```

---

## 🛠️ Tech Stack

| Component            | Technology              | Purpose                    |
| -------------------- | ----------------------- | -------------------------- |
| **Backend Language** | Python 3.x              | Core AI pipeline           |
| **API Server**       | FastAPI                 | Backend API layer          |
| **Async Processing** | asyncio                 | Asynchronous operations    |
| **Web Research**     | Tavily API              | Real-time research         |
| **AI / LLM**         | Google Gemini 2.5 Flash | Script generation          |
| **Validation**       | Pydantic                | Structured data validation |
| **Text-to-Speech**   | Edge TTS                | AI voiceover generation    |
| **Environment**      | python-dotenv           | Environment configuration  |
| **Frontend**         | React 19                | User interface             |
| **Build Tool**       | Vite                    | Frontend development       |
| **Styling**          | Tailwind CSS v4         | UI styling                 |
| **Animation**        | GSAP                    | UI animations              |
| **Audio**            | HTML5 Audio API         | Browser audio playback     |

---

## 💾 Installation & Setup

### Prerequisites

* Python 3.8+
* Node.js 18+
* npm
* Tavily API Key
* Google Gemini API Key

Edge TTS is used for voice generation through the `edge-tts` Python package.

---

### 1. Clone the Repository

```bash
git clone https://github.com/Gobler-code/Script-factory.git
cd Script-factory
```

---

### 2. Backend Setup

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

For macOS/Linux:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install requests tavily-python google-genai pydantic python-dotenv fastapi uvicorn edge-tts
```

---

### 3. Configure Environment Variables

Create a `.env` file in the backend directory:

```env
TAVILY_API_KEY=your_tavily_api_key
GEMINI_API_KEY=your_google_gemini_api_key
```

Never commit your `.env` file to GitHub.

---

### 4. Start the Backend

From the `backend` directory:

```bash
uvicorn api:app --reload
```

The FastAPI backend will run at:

```text
http://127.0.0.1:8000
```

---

### 5. Start the Frontend

Open a new terminal:

```bash
cd frontend/landing-page
npm install
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

---

## 🚀 Usage

### Step 1 — Enter a Topic

Enter a technology topic or recent event into the Script Factory interface.

Example:

```text
The CrowdStrike outage
```

---

### Step 2 — Generate the Script

The system:

1. Researches the topic
2. Generates the narrative
3. Reviews the script
4. Displays the scenes
5. Shows word count and estimated duration

---

### Step 3 — Generate Captions

Open the Caption Generator to:

* Generate timed captions
* Preview the subtitle structure
* Export `.srt`
* Export `.ass`

---

### Step 4 — Generate Voiceover

Open the Narrator interface.

1. Select a voice
2. Review the generated script
3. Click **Generate Voiceover**
4. Wait for Edge TTS to generate the narration
5. Play the generated audio
6. Seek through the narration
7. Download the MP3

---

## 🔌 API Endpoints

### Generate Script

```http
GET /generate?topic=<topic>
```

Example:

```bash
curl "http://127.0.0.1:8000/generate?topic=the%20CrowdStrike%20outage"
```

Response:

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

### Generate Voiceover

```http
POST /narrate
```

Request body:

```json
{
  "scenes": [
    {
      "voiceover": "The entire world woke up to a digital disaster.",
      "rough_visual_cue": "Airport screens freezing",
      "rough_sfx_trigger": "[System crash]"
    }
  ],
  "voice": "en-US-GuyNeural"
}
```

The endpoint:

1. Receives the generated scenes
2. Extracts the voiceover text
3. Removes Markdown emphasis
4. Combines the scenes into one narration
5. Sends the text to Edge TTS
6. Generates audio
7. Encodes the audio as Base64
8. Returns the audio to the frontend

Response:

```json
{
  "audio_base64": "<base64 encoded audio>"
}
```

---

## 🔧 Key Components

### 1. Researcher Agent

**File:**

```text
backend/agents/researcher.py
```

Responsible for gathering real-time information using Tavily.

---

### 2. ScriptWriter Agent

**File:**

```text
backend/agents/scriptwriter.py
```

Transforms research data into a structured short-form documentary script using Gemini.

The generated script follows a defined structure:

```python
class ScriptSegment(BaseModel):
    voiceover: str
    rough_visual_cue: str
    rough_sfx_trigger: str
```

---

### 3. Reviewer Agent

**File:**

```text
backend/agents/reviewer.py
```

Analyzes the generated script and calculates:

* Total word count
* Estimated spoken duration

---

### 4. Narrator Agent

**File:**

```text
backend/agents/narrator.py
```

The Narrator Agent converts generated script segments into spoken audio.

The agent:

```text
Script Segments
      ↓
Extract Voiceover
      ↓
Remove Markdown Formatting
      ↓
Combine Narration
      ↓
Edge TTS
      ↓
Audio Buffer
      ↓
Return MP3 Data
```

The core narration function uses asynchronous streaming to collect generated audio data into an in-memory `BytesIO` buffer.

---

### 5. FastAPI API Layer

**File:**

```text
backend/api.py
```

Connects the frontend with the AI pipeline.

Current endpoints:

```text
GET  /generate
POST /narrate
```

The `/generate` endpoint handles:

```text
Research → Writing → Review
```

The `/narrate` endpoint handles:

```text
Script → Voice Selection → TTS → Audio
```

---

### 6. ScriptFactory Component

**File:**

```text
frontend/landing-page/src/components/ScriptFactory.jsx
```

Responsible for:

* Topic input
* Script generation
* Loading states
* Scene rendering
* Word count display
* Runtime display
* Script downloads
* Access to production tools

---

### 7. CaptionGenerator Component

**File:**

```text
frontend/landing-page/src/components/CaptionGenerator.jsx
```

Responsible for:

* Extracting narration
* Generating caption timings
* Highlighting important terms
* Exporting SRT
* Exporting ASS

---

### 8. Narrator Component

**File:**

```text
frontend/landing-page/src/components/Narrator.jsx
```

Responsible for the complete voiceover experience.

It provides:

* Voice selection
* Script preview
* Voiceover generation
* Loading and error states
* Audio playback
* Play / pause controls
* Audio seeking
* Playback timer
* MP3 download

The component communicates with:

```text
POST http://127.0.0.1:8000/narrate
```

The returned Base64 audio is converted into a browser Blob and played using an HTML5 Audio element.

---

## 🎙️ Voiceover System

The current voiceover system supports four Edge TTS voices:

```javascript
const VOICES = [
  {
    id: "en-US-GuyNeural",
    label: "Guy",
    desc: "Deep, documentary"
  },
  {
    id: "en-US-AriaNeural",
    label: "Aria",
    desc: "Clear, neutral"
  },
  {
    id: "en-GB-RyanNeural",
    label: "Ryan",
    desc: "British"
  },
  {
    id: "en-US-JennyNeural",
    label: "Jenny",
    desc: "Warm, conversational"
  }
];
```

The narration is generated from the **voiceover field only**.

Visual cues and SFX triggers are intentionally excluded from the spoken narration.

Markdown emphasis is also removed before the text is sent to the TTS engine:

```python
full_text = " ".join(
    seg["voiceover"].replace("**", "")
    for seg in script_segments
)
```

This ensures the AI-generated narration is clean and natural.

---

## 📈 Progress

### ✅ Phase 1 — Foundation

* [x] Project structure established
* [x] Tavily API integration
* [x] Gemini API integration
* [x] Asynchronous pipeline architecture

### ✅ Phase 2 — Core AI Pipeline

* [x] Researcher Agent
* [x] ScriptWriter Agent
* [x] Pydantic validation
* [x] End-to-end CLI pipeline
* [x] Structured JSON script output

### ✅ Phase 3 — Storytelling Optimization

* [x] Temperature control
* [x] 90/10 narrative rule
* [x] Paradox Hook
* [x] Delayed Gratification
* [x] Vocal Emboldening
* [x] Invisible Loop design

### ✅ Phase 4 — Script Review

* [x] Reviewer Agent
* [x] Word count calculation
* [x] Runtime estimation
* [x] Reviewer integrated with API

### ✅ Phase 5 — Web Application

* [x] FastAPI backend
* [x] React frontend
* [x] Vite integration
* [x] Tailwind CSS
* [x] GSAP animations
* [x] Scene rendering
* [x] Live word/runtime counters
* [x] Script downloads

### ✅ Phase 6 — Caption Generation

* [x] Client-side caption generation
* [x] Automatic narration extraction
* [x] Caption timing
* [x] Keyword highlighting
* [x] SRT export
* [x] ASS export

### ✅ Phase 7 — AI Voiceover

* [x] Narrator Agent
* [x] Edge TTS integration
* [x] Multiple voice options
* [x] Voice selection UI
* [x] Script preview
* [x] Audio generation endpoint
* [x] Base64 audio transfer
* [x] Browser audio playback
* [x] Custom progress bar
* [x] Play/pause controls
* [x] Audio seeking
* [x] Playback duration display
* [x] MP3 download

---

## 🔑 API Requirements

### Tavily API

**Purpose:** Real-time web research and information gathering.

Used by:

```text
Researcher Agent
```

Authentication:

```env
TAVILY_API_KEY=your_key
```

---

### Google Gemini API

**Model:** Gemini 2.5 Flash

**Purpose:** AI-powered script generation.

Used by:

```text
ScriptWriter Agent
```

Authentication:

```env
GEMINI_API_KEY=your_key
```

---

### Edge TTS

**Purpose:** AI-powered text-to-speech narration.

Used by:

```text
Narrator Agent
```

The current implementation uses the `edge-tts` Python package and supports multiple neural voices.

Unlike the research and script-generation stages, the current voiceover implementation does not require an additional API key.

---

## 🚧 Future Enhancements

### Short-Term

* [ ] Add better backend error handling
* [ ] Add retry logic for failed AI requests
* [ ] Add configurable backend URL
* [ ] Add loading progress for voice generation
* [ ] Add voice preview before narration generation
* [ ] Add more voice options
* [ ] Improve audio player UI
* [ ] Add audio regeneration without regenerating the script

### Medium-Term

* [ ] Store generated scripts and audio
* [ ] Database integration
* [ ] User accounts and project history
* [ ] Cloud deployment
* [ ] Batch topic generation
* [ ] Script A/B testing
* [ ] Multi-language voiceover
* [ ] Voiceover speed and pitch controls
* [ ] Analytics dashboard

### Long-Term

* [ ] Automated visual asset collection
* [ ] AI-generated video assembly
* [ ] Automatic B-roll selection
* [ ] SFX and background music generation
* [ ] Voiceover + captions synchronization
* [ ] Complete YouTube Shorts production pipeline
* [ ] Automated video rendering
* [ ] Direct publishing workflow
* [ ] Trend detection and topic discovery

---

## 🤝 Contributing

To extend Script Factory:

1. Add new AI agents in:

```text
backend/agents/
```

2. Add new API endpoints in:

```text
backend/api.py
```

3. Add new Pydantic models where required.

4. Create frontend components in:

```text
frontend/landing-page/src/components/
```

5. Test backend logic before integrating it into the full pipeline.

The modular architecture makes it possible to continue adding production stages without rebuilding the entire application.

---

## 📄 License

This project is developed for educational and commercial purposes.

---

## 🎬 The Vision

Script Factory is evolving from a simple AI script generator into a complete **AI-powered short-form content production pipeline**.

The long-term goal is to automate the journey from:

```text
IDEA
  ↓
RESEARCH
  ↓
SCRIPT
  ↓
REVIEW
  ↓
VOICEOVER
  ↓
CAPTIONS
  ↓
VISUALS
  ↓
SOUND EFFECTS
  ↓
VIDEO
  ↓
PUBLISH
```

The ultimate goal:

> **Give Script Factory a topic. Get a finished short-form documentary.**

---

**Built with ❤️ for AI-powered storytelling.**
