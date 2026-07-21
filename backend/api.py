from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from agents.researcher import research
from agents.scriptwriter import write_script
from agents.reviewer import review_script
from agents.narrator import narrate
import json
import base64

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/generate")
async def generate(topic):
    research_data = await research(topic)
    script = write_script(research_data)
    response = json.loads(script)
    review = review_script(response)

    return {
        "review": review,
        "response": response,
    }

@app.post("/narrate")
async def generate_narration(payload: dict):
    scenes = payload["scenes"]
    voice = payload.get("voice", "en-US-GuyNeural")
    audio_buffer = await narrate(scenes, voice)
    audio_base64 = base64.b64encode(audio_buffer.read()).decode("utf-8")
    return {"audio_base64": audio_base64}