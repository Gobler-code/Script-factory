from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from agents.researcher import research
from agents.scriptwriter import write_script
from agents.reviewer import review_script
import asyncio
import json

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
    return {"review":review , "response": response}
    

