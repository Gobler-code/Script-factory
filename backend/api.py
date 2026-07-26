from fastapi import FastAPI,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from agents.researcher import research
from agents.scriptwriter import write_script
from agents.reviewer import review_script
from agents.narrator import narrate
from db import save_script, list_scripts, get_script, delete_script,save_audio
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

    saved = save_script(topic, response, review)

    return {
        "review": review,
        "response": response,
        "id": saved["id"] if saved else None,
    }

@app.post("/narrate")
async def generate_narration(payload: dict):
    scenes = payload["scenes"]
    voice = payload.get("voice", "en-US-GuyNeural")
    script_id = payload.get("script_id")

    audio_buffer = await narrate(scenes, voice)
    audio_base64 = base64.b64encode(audio_buffer.read()).decode("utf-8")

    if script_id:
        save_audio(script_id, audio_base64, voice)

    return {"audio_base64": audio_base64}

@app.get("/scripts")
async def get_scripts():
    return list_scripts()

@app.get("/scripts/{script_id}")
async def get_script_by_id(script_id: str):
    script = get_script(script_id)
    if not script:
        raise HTTPException(status_code=404, detail="Script not found")
    return script

@app.delete("/scripts/{script_id}")
async def remove_script(script_id: str):
    delete_script(script_id)
    return {"deleted": script_id}