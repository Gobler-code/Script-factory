import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from agents.researcher import research
from agents.scriptwriter import write_script
from agents.reviewer import review_script
from agents.narrator import narrate
from db import save_script, list_scripts, get_script, delete_script, save_audio
import json
import base64

limiter = Limiter(key_func=get_remote_address)

app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS origin now comes from an env var, defaulting to local dev
allowed_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[allowed_origin],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)  # compress base64 audio payloads

# Catch-all: any unhandled exception becomes a clean, predictable JSON error
@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    print(f"Unhandled error on {request.url.path}: {exc}")  # swap for real logging later
    return JSONResponse(
        status_code=500,
        content={"error": "Something went wrong generating your content. Please try again."},
    )

@app.get("/generate")
@limiter.limit("10/minute")
async def generate(request: Request, topic: str):
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
@limiter.limit("10/minute")
async def generate_narration(request: Request, payload: dict):
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