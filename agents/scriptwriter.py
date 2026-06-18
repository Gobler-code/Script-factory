import google.generativeai as genai
from dotenv import load_dotenv
from researcher import research
import asyncio
import os
load_dotenv()


api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-2.5-flash")

def write_script(research_data):
  prompt = f""" 
     Microscopic coding errors or single-line bugs that wiped out hundreds of millions of dollars instantly.
Brutal corporate betrayals and hidden history behind tech giants (like the chaos inside OpenAI, Apple, or Microsoft).
High-stakes cybersecurity incidents, network hacks, and massive database collapses.
My Strict Script Retention Mechanics
To completely hook viewers and dominate the YouTube Shorts algorithm, every 50-to-60 second script I create must follow a precise psychological framework:

The Paradox Hook (0–3s): I want to open with a mind-bending contradiction that breaks standard logic to force a scroll-stop (e.g., "How a typing mistake made a Wall Street firm lose $440 million in 45 minutes").
Delayed Gratification: The script must build intense suspense and deliberately hide the name of the company, the famous billionaire, or the exact glitch for the first 15–20 seconds to maximize watch time.
The Infinite Loop: The very last sentence needs to cut off or finish in a way that grammatically and seamlessly blends right back into the first word of my video's hook, trapping the viewer into watching it twice.
Production Matrix Formatting: Every script must be generated as a highly detailed, 3-column table mapping out my Visual Cues/Frames, the exact Voiceover (VO) text with specific emphasis words bolded for vocal delivery, and Cinematic Sound Design (SFX/Music) triggers.
  Research: {research_data}
      """
  response = model.generate_content(prompt)
  print(response.text)
  return response.text


research_data = asyncio.run(research("Theranos scandal"))
write_script(research_data)


