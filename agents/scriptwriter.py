from google import genai
from google.genai import types
from dotenv import load_dotenv
from agents.researcher import research
import asyncio
from pydantic import BaseModel,Field
from typing import List
import os
load_dotenv()

class ScriptSegment(BaseModel):
  voiceover:str = Field(description="CRITICAL PRIORITY (90% effort). Premium, rhythmic, word-for-word narrative text. Bold key words.")
  rough_visual_cue: str = Field(description="BONUS: A microscopic, 3-5 word placeholder visual cue for context. Keep it ultra-brief.")
  rough_sfx_trigger: str = Field(description="BONUS: A simple 1-2 word audio trigger keyword (e.g., [Sub drop], [Glitch noise]).")



client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def write_script(research_data):
  prompt = f""" 
    
      You are an elite short-form narrative writer specializing in technical thriller documentaries for YouTube Shorts. 

Your core task is to turn raw web research data into a precise, high-suspense 50-to-60 second vocal script. 

### THE 90/10 RULE DECREE:
- 90% of your cognitive processing and word choice MUST be spent engineering the `voiceover` text. Focus deeply on pacing, vocabulary, and high-retention storytelling flow.
- The `rough_visual_cue` and `rough_sfx_trigger` fields are strictly secondary metadata tags for a veteran video editor. Do NOT write long paragraphs for them. Keep them under 5 words max per frame to save execution energy for the written spoken word.

### CRITICAL ALGORITHMIC RETENTION DIRECTIVES:
1. THE PARADOX HOOK (0-3s): Open directly with a massive, logic-defying contradiction about the tech event to stop the scroll instantly. No filler greetings.
2. DELAYED GRATIFICATION (3-25s): Build intense curiosity like a true-crime story. Completely hide the name of the company, the developer, or the specific bug for the first 15 to 20 seconds.
3. VOCAL EMBOLDENING: You must aggressively enclose key punch words in **bold markdown** so the voiceover delivery hits with maximum dramatic emphasis.
4. THE INFINITE LOOP: The final word of the script must grammatically finish or loop right back into the first word of your `paradox_hook_line`.

Return ONLY a valid JSON array. Each object must follow this exact structure:
{{
  "voiceover": "the spoken script line",
  "rough_visual_cue": "short visual note",
  "rough_sfx_trigger": "short sound note"
}}

      Research: {research_data}
    
 
      """

  response =client.models.generate_content(
    model='gemini-2.5-flash',
    contents=prompt,
    config=types.GenerateContentConfig(
     temperature = 0.3,
     response_mime_type ='application/json',
     response_schema= list[ScriptSegment]
    )
)

  print(response.text)
  return response.text

if __name__ == "__main__":
    research_data = asyncio.run(research("CrowdStrike outage"))
    write_script(research_data)



