"""
GrooveIn CLI — Command-line interface for local mood-based music recommendations.
"""

import os
import webbrowser
from MoodClassifier import predict_mood
from recommender import get_recommendation

def main():
    print("=" * 60)
    print("Welcome to GrooveIn - Your Mood, Your Music")
    print("Describe how you feel and pick a genre, we'll recommend a song.")
    print("=" * 60)

    user_input = input("\nHow are you feeling today? (e.g. 'Stressed but hopeful'): ").strip()
    if not user_input:
        print("\n[Warning] Mood description cannot be empty!")
        return

    genre_options = ["pop", "rock", "indie", "hiphop", "jazz", "bollywood", "rnb"]
    print("\nAvailable Genres:")
    for idx, genre in enumerate(genre_options, 1):
        print(f"  {idx}. {genre.capitalize()}")
    
    try:
        genre_choice = int(input("\nSelect a genre number (1-7): ").strip())
        if 1 <= genre_choice <= len(genre_options):
            selected_genre = genre_options[genre_choice - 1]
        else:
            print("\n[Error] Invalid choice. Defaulting to 'pop'")
            selected_genre = "pop"
    except ValueError:
        print("\n[Error] Invalid input. Defaulting to 'pop'")
        selected_genre = "pop"

    # Step 1: Predict user's mood
    print("\nAnalyzing your emotional state...")
    mood = predict_mood(user_input)
    print(f"Detected Mood: {mood.capitalize()}")

    # Step 2: Retrieve recommendations
    print(f"Finding a matching {selected_genre.capitalize()} song for your vibe...")
    embed_html = get_recommendation(mood, selected_genre)

    if embed_html:
        # Save HTML player locally
        html_file = "recommendation.html"
        html_path = os.path.abspath(html_file)
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(embed_html)
        
        print(f"\n[Success] Song recommendation saved to {html_file}")
        print("Opening the Spotify player in your default web browser...")
        webbrowser.open(f"file:///{html_path}")
    else:
        print(f"\n[Error] Sorry, no song matches the mood '{mood}' in the '{selected_genre}' genre.")

if __name__ == "__main__":
    main()
