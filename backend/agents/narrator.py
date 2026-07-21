import edge_tts
import io

DEFAULT_VOICE = "en-US-GuyNeural"

async def narrate(script_segments, voice=DEFAULT_VOICE):
    full_text = " ".join(
        seg["voiceover"].replace("**", "")
        for seg in script_segments
    )
    communicate = edge_tts.Communicate(full_text, voice)
    audio_buffer = io.BytesIO()
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_buffer.write(chunk["data"])
    audio_buffer.seek(0)
    return audio_buffer