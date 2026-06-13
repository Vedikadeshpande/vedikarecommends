# vedikarecommends — Your Mood, Your Music

vedikarecommends is an intelligent, mood-based music recommendation system that combines **Natural Language Processing (NLP)** with dynamic **Spotify Playback** to recommend songs matching your current emotional landscape. 

Tell vedikarecommends how you are feeling in your own words, select a genre, and let the algorithm discover the track that fits your moment.

---

## 🚀 Key Features

* **Cinematic Storytelling Intro:** A fluid scroll-driven interaction designed around a vintage silver iPod, combining animations with ambient background sound.
* **Smart Emotion Classification:** Uses TF-IDF vectorization and a Logistic Regression classifier trained on emotional text corpuses to predict feelings (e.g. Mellow, Fiery, Romantic, Melancholic).
* **Production-Grade ML Serving:** The model loading is optimized to load serialized weights dynamically from disk on inference, preventing any startup retraining overhead.
* **Clean API Design:** FastAPI backend that communicates cleanly with a responsive, glassmorphic Next.js UI.
* **Embed Spotify Integration:** Renders custom native Spotify embeds dynamically.

---

## 🛠️ Tech Stack

### Frontend
* **Next.js 15 (App Router)** & **React 19**
* **TypeScript**
* **Framer Motion** (for premium micro-interactions and scroll animation)
* **Vanilla CSS** custom design system

### Backend
* **Python 3.13**
* **FastAPI** (high-performance asynchronous API framework)
* **Scikit-Learn** (model inference and training)
* **Joblib** (asset serialization)
* **Pandas** & **NumPy** (data manipulation)

---

## 📂 Project Structure

```
├── GrooveIn.py            # Local CLI application wrapper
├── api.py                 # FastAPI backend server
├── MoodClassifier.py      # ML classifier (handles training & prediction)
├── recommender.py         # Filtering logic & song recommendations
├── requirements.txt       # Python dependencies
├── songsDataSet.csv       # Music catalog mapping track IDs to mood/genres
├── model.pkl              # Serialized classification model
├── vectorizer.pkl         # Serialized TF-IDF feature extractor
└── frontend/              # Next.js web application
    ├── src/
    │   ├── app/           # App router layouts and styles
    │   ├── components/    # Reusable React UI components
    │   └── lib/           # Fetch clients for FastAPI endpoints
    └── public/            # Static files, frames, and background music
```

---

## 💻 Running the Application

### 1. Run the FastAPI Backend
Ensure Python 3.13 is installed, then set up the backend server:

```bash
# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server
uvicorn api:app --reload
```
The API will start running at `http://localhost:8000`.

*(Optional)* If you wish to retrain the underlying ML model using the raw text datasets:
```bash
python MoodClassifier.py --train
```

### 2. Run the Next.js Frontend
In a new terminal shell:

```bash
cd frontend

# Install client packages
npm install

# Start local server
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 📡 API Reference

#### `POST /api/recommend`
Accepts a text description of your feeling and a genre choice, returning the predicted mood and Spotify track ID.
* **Payload:**
  ```json
  {
    "text": "I feel like a warm cup of coffee on a rainy Sunday morning.",
    "genre": "indie"
  }
  ```
* **Response:**
  ```json
  {
    "mood": "chill",
    "track_id": "0D47p41qg0B9p... (Spotify Track ID)",
    "genre": "indie"
  }
  ```

#### `GET /api/genres`
Returns a list of all available musical genres.

#### `GET /api/moods`
Returns a list of all emotional classifications supported by the model.

---

## 📄 License

This project is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International License](https://creativecommons.org/licenses/by-nc/4.0/).
