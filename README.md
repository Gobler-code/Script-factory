# 🎬 Script Factory

**A Complete AI Pipeline for Generating Short-Form Technical Documentary Scripts**

An intelligent automation system that transforms trending topics into engaging YouTube Shorts scripts. Script Factory combines advanced web research with AI-powered narrative writing to create high-retention, 50-60 second technical thriller documentaries.

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

Script Factory is a comprehensive AI pipeline designed to automate the creation of short-form technical documentary scripts. The system takes any trending topic or tech event as input and produces a structured, narrative-driven script optimized for YouTube Shorts.

**Core Workflow:**
1. **Research Phase** → Gathers real-time data from the web using Tavily API
2. **Analysis Phase** → Processes and understands the research data
3. **Writing Phase** → Generates engaging, high-retention scripts using Google Gemini AI
4. **Output** → Produces structured script segments with voiceovers, visual cues, and sound effects

---

## ✨ Features

### 🔍 **Intelligent Web Research**
- Real-time data collection using Tavily API
- Asynchronous research operations for efficiency
- Comprehensive fact gathering on any topic

### 🎨 **Advanced Script Generation**
- AI-powered narrative writing using Google Gemini 2.5 Flash
- Optimized for short-form content (50-60 seconds)
- Technical thriller storytelling approach
- JSON-structured output for easy integration

### 🎬 **Production-Ready Script Segments**
Each script segment includes:
- **Voiceover**: Premium, rhythmic, word-for-word narrative text with bold emphasis on key words
- **Visual Cues**: Brief 3-5 word placeholders for video context
- **Sound Effects Triggers**: Simple audio keywords for production enhancement

### 🎯 **Engagement Optimization**
- **The Paradox Hook**: Logic-defying opening (0-3s) to stop scrolling
- **Delayed Gratification**: True-crime-style buildup with hidden reveals (3-25s)
- **Vocal Emboldening**: Strategic use of bold markdown for maximum delivery impact
- **Infinite Loop Design**: Scripts end by looping back to the opening line

---

## 🏗️ Project Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     INPUT: TOPIC                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │   Researcher Agent         │
        │  (Tavily API Integration)  │
        └────────────┬───────────────┘
                     │
                     ▼ Research Data
        ┌────────────────────────────┐
        │   ScriptWriter Agent       │
        │  (Gemini 2.5 Flash API)    │
        │  (Pydantic Validation)     │
        └────────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  Script Segments (JSON)    │
        │  - Voiceovers             │
        │  - Visual Cues            │
        │  - Sound Effects          │
        └────────────────────────────┘
```

---

## 📁 Project Structure

```
ScriptFactory/
├── main.py                 # Main pipeline orchestrator
├── practice.py             # Development/testing file with Pydantic models
├── notes.md                # Project notes and development log
├── README.md               # This file
├── .env                    # API keys (not committed)
├── .gitignore             # Git ignore rules
└── agents/
    ├── researcher.py       # Web research agent (Tavily API)
    └── scriptwriter.py     # Script generation agent (Gemini API)
```

---

## 🛠️ Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Language** | Python 3.x | Core implementation |
| **Async** | asyncio | Asynchronous operations |
| **Web Research** | Tavily API | Real-time data collection |
| **AI/LLM** | Google Gemini 2.5 Flash | Script generation |
| **Validation** | Pydantic | Type safety & schema validation |
| **Environment** | python-dotenv | Configuration management |
| **HTTP** | requests | API communication |

---

## 💾 Installation & Setup

### Prerequisites
- Python 3.8 or higher
- API Keys:
  - Tavily API Key (for web research)
  - Google Gemini API Key (for script generation)

### Step 1: Clone/Setup Repository
```bash
cd c:\ScriptFactory
```

### Step 2: Create Virtual Environment
```bash
python -m venv venv
venv\Scripts\activate
```

### Step 3: Install Dependencies
```bash
pip install requests tavily-python google-genai pydantic python-dotenv
```

### Step 4: Configure Environment Variables
Create a `.env` file in the root directory:
```env
TAVILY_API_KEY=your_tavily_api_key_here
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### Step 5: Verify Installation
```bash
python -m agents.researcher
```

---

## 🚀 Usage

### Basic Usage

```python
from agents.researcher import research
from agents.scriptwriter import write_script
import asyncio

# Define topic
topic = "CrowdStrike outage"

# Step 1: Research the topic
research_data = asyncio.run(research(topic))

# Step 2: Generate script from research
write_script(research_data)
```

### Running the Main Pipeline
```bash
python main.py
```

The script will:
1. Research "CrowdStrike outage"
2. Generate a JSON array of script segments
3. Output structured script with voiceovers, visual cues, and sound effects

### Output Format
```json
[
  {
    "voiceover": "A **massive** contradiction about the tech event...",
    "rough_visual_cue": "Server racks glitching",
    "rough_sfx_trigger": "[System crash sound]"
  },
  {
    "voiceover": "The suspense builds here...",
    "rough_visual_cue": "Code on screen",
    "rough_sfx_trigger": "[Typing sounds]"
  }
]
```

---

## 🔧 Key Components

### 1. **Researcher Agent** (`agents/researcher.py`)
Handles real-time web research using Tavily API.

**Features:**
- Asynchronous research operations
- Environment-based API key management
- Returns structured search results with URLs and summaries

**Key Functions:**
- `research(topic)` - Async function to search and gather research data

**Usage:**
```python
research_data = asyncio.run(research("Your topic"))
```

### 2. **ScriptWriter Agent** (`agents/scriptwriter.py`)
Transforms research data into engaging scripts using AI.

**Features:**
- Google Gemini 2.5 Flash integration
- Structured JSON output using Pydantic
- Advanced prompt engineering for retention optimization
- Temperature control (0.3) for consistency

**Pydantic Model:**
```python
class ScriptSegment(BaseModel):
    voiceover: str = Field(description="Premium narrative text")
    rough_visual_cue: str = Field(description="3-5 word visual placeholder")
    rough_sfx_trigger: str = Field(description="1-2 word audio trigger")
```

**Prompt Strategy:**
- 90/10 Rule: 90% focus on voiceover quality
- Paradox Hook: Attention-grabbing opening
- Delayed Gratification: Story-building tension
- Infinite Loop: Script cycles back to opening

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
- [x] End-to-end pipeline working (main.py)
- [x] JSON output with voiceovers, visual cues, and SFX

### ✅ **Phase 3: Optimization (Completed)**
- [x] Temperature control for script consistency
- [x] Advanced narrative prompting (90/10 rule)
- [x] Paradox Hook strategy implementation
- [x] Delayed Gratification storytelling
- [x] Vocal emboldening with markdown
- [x] Infinite loop script design

### ✅ **Phase 4: Development Tools (Completed)**
- [x] Practice.py for model testing
- [x] Environment configuration (.env)
- [x] Development and testing framework
- [x] Comprehensive documentation

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
  - `response_mime_type`: 'application/json'
  - `response_schema`: Pydantic model validation
  - Temperature: 0.3 (for consistency)

---

## 🚧 Future Enhancements

### Short-term (Next Iterations)
- [ ] Support for multiple topics in batch mode
- [ ] Script variation generation (A/B testing)
- [ ] Caching system for research results
- [ ] Performance metrics and logging
- [ ] Error handling and retry logic

### Medium-term
- [ ] Database integration for script storage
- [ ] Web UI dashboard for monitoring
- [ ] Export formats (SRT subtitles, video metadata)
- [ ] Analytics tracking for script performance
- [ ] Multi-language support

### Long-term
- [ ] Voice synthesis integration
- [ ] Automated video generation
- [ ] Machine learning model for topic trending
- [ ] API service deployment
- [ ] Microservices architecture

---

## 📝 Development Notes

- **Day 7**: Full pipeline (main.py) now works end-to-end
- **Narrative Strategy**: Technical thriller approach for maximum engagement
- **Script Length**: Optimized for 50-60 second YouTube Shorts
- **AI Model**: Using Gemini 2.5 Flash for speed and quality balance
- **Prompt Engineering**: Heavy emphasis on storytelling mechanics

---

## 🤝 Contributing

To extend Script Factory:
1. Add new agents in `agents/` directory
2. Expand `main.py` with additional pipelines
3. Create new Pydantic models in respective agent files
4. Test with `practice.py` before integration

---

## 📄 License

This project is developed for educational and commercial purposes.

---

## 📞 Support

For issues or questions about the pipeline, refer to:
- `notes.md` - Development notes and progress log
- `practice.py` - Testing and model validation examples
- Individual agent files for specific component details

---

**Built with ❤️ for AI-powered storytelling**