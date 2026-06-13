import os
import random
import logging
import pandas as pd
from typing import Optional

logger = logging.getLogger("Recommender")

# Load the songs dataset from the 'data' directory relative to this file
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET_PATH = os.path.join(BASE_DIR, "data", "songsDataSet.csv")

if not os.path.exists(DATASET_PATH):
    logger.error(f"Missing track dataset file at: '{DATASET_PATH}'")
    raise FileNotFoundError(f"Missing track dataset file at: '{DATASET_PATH}'")

logger.info(f"Loading song database from '{DATASET_PATH}'...")
df = pd.read_csv(DATASET_PATH, encoding="utf-8")

# Clean column headers
df.columns = df.columns.str.strip()

# Clean mood and genre values to ensure matching works properly
df['mood'] = df['mood'].str.strip().str.lower()
df['genre'] = df['genre'].str.strip().str.lower()


def get_recommended_track(mood: str, genre: str) -> Optional[str]:
    """
    Search the dataset for tracks matching the specified mood and genre.
    Returns:
        str: A randomly selected Spotify track ID if matches exist.
        None: If no tracks match the criteria.
    """
    cleaned_mood = mood.strip().lower()
    cleaned_genre = genre.strip().lower()
    
    # Filter matching tracks
    matches = df[(df['mood'] == cleaned_mood) & (df['genre'] == cleaned_genre)]
    
    if matches.empty:
        return None
        
    # Return a random track ID from the matched results
    track_ids = matches['track_id'].tolist()
    return random.choice(track_ids)


def generate_embed_html(track_id: str) -> str:
    """
    Generates a complete Spotify track player iframe inside an HTML wrapper.
    """
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Spotify Track Embed</title>
  <style>
    body {{
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #000000;
    }}
    iframe {{
      border-radius: 12px;
      box-shadow: 0 0 10px rgba(0,0,0,0.2);
    }}
  </style>
</head>
<body>
  <iframe 
    src="https://open.spotify.com/embed/track/{track_id}?utm_source=generator"
    width="100%" 
    height="352" 
    frameborder="0" 
    allowfullscreen 
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    loading="lazy">
  </iframe>
</body>
</html>"""


def get_recommendation(mood: str, genre: str) -> Optional[str]:
    """
    Backwards-compatible recommendation helper.
    Finds a matching track and generates the Spotify embed HTML.
    """
    track_id = get_recommended_track(mood, genre)
    if not track_id:
        return None
    return generate_embed_html(track_id)