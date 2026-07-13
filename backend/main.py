from agents.researcher import research
from agents.scriptwriter import write_script
from agents.reviewer import review_script
import json
import asyncio

topic = "CrowdStrike outage"
research_data = asyncio.run(research(topic))
script = write_script(research_data)
response = json.loads(script)
review_script(response)

