from agents.researcher import research
from agents.scriptwriter import write_script
import asyncio

topic = "CrowdStrike outage"
research_data = asyncio.run(research(topic))

write_script(research_data)