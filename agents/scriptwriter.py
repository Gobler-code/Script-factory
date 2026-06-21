import google.generativeai as genai
from dotenv import load_dotenv
from researcher import research
import asyncio
import os
load_dotenv()


api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)
model = genai.GenerativeModel(
    "gemini-2.5-flash", 
     generation_config= genai.GenerationConfig(
     temperature = 0.3,
     response_mime_type ='application/json'
     ))

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
  response = model.generate_content(prompt)
  print(response.text)
  return response.text


research_data = asyncio.run(research("Theranos scandal"))
write_script(research_data)



