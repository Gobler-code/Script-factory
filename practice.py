# practice.py

mock_script = [
    {
        "voiceover": "A **cybersecurity** company just broke the entire world.",
        "rough_visual_cue": "Glitch effect on blue screen",
        "rough_sfx_trigger": "Sub drop"
    },
    {
        "voiceover": "Eighty-five **million** computers crashed instantly.",
        "rough_visual_cue": "Flashing server room",
        "rough_sfx_trigger": "Static screech"
    },
    {
        "voiceover": "All because of a single line of bad code for a **cybersecurity**...",
        "rough_visual_cue": "Code scrolling fast",
        "rough_sfx_trigger": "Whoosh"
    }
]

# 1. Start our counter at zero
total_words = 0

# 2. Loop through each segment dictionary in our mock_script list
for segment in mock_script:
    # 3. Grab the voiceover string using the key
    text = segment["voiceover"]
    
    # 4. Split the text into a list of words
    words_list = text.split()
    
    # 5. Add the count of this segment's words to our total
    total_words = total_words + len(words_list)

# 6. Print the final result to the terminal
print("Total words found:", total_words)