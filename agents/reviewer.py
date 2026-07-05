def review_script(script):
    total_words = 0

    for segment in script:
        text = segment["voiceover"]
        words_list = text.split()
        total_words += len(words_list)

    print("Total words found:", total_words)

    estimated_seconds = total_words / 2.5

    print("--- Script Stats ---")
    print(f"Total Words: {total_words}")
    print(f"Estimated Duration: {estimated_seconds:.2f} seconds")