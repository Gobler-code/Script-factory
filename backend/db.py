import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

def save_script(topic, scenes, review):
    result = supabase.table("scripts").insert({
        "topic": topic,
        "scenes": scenes,
        "word_count": review.get("total words"),
        "estimated_duration": review.get("Estimated Duration"),
    }).execute()
    return result.data[0] if result.data else None

def list_scripts():
    result = (
        supabase.table("scripts")
        .select("id, topic, word_count, estimated_duration, created_at")
        .order("created_at", desc=True)
        .execute()
    )
    return result.data

def get_script(script_id):
    result = supabase.table("scripts").select("*").eq("id", script_id).single().execute()
    return result.data