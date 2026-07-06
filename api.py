from fastapi import FastAPI
from agents.researcher import research
from agents.scriptwriter import write_script
from agents.reviewer import review_script
import asyncio
import json

app = FastAPI()

@app.get("/generate")
async def generate(topic):
    research_data = await research(topic)
    script = write_script(research_data)
    response = json.loads(script)
    review_script(response)
    return response
