import requests
from tavily import TavilyClient
from dotenv import load_dotenv
import os
import asyncio
load_dotenv()


api_key = os.getenv("TAVILY_API_KEY")


client = TavilyClient(api_key=api_key)

async def research(topic):
    response = client.search(topic)
    return response

print(asyncio.run(research("Theranos scandal")))
  
  