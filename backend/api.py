import time
import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.MoodClassifier import predict_mood
from backend.recommender import get_recommended_track, df

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("APIServer")

app = FastAPI(
    title="vedikarecommends API",
    description="Backend service for predicting user mood from text and fetching song recommendations.",
    version="1.0.0",
)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    logger.info(
        f"{request.method} {request.url.path} "
        f"completed in {process_time:.4f}s with status {response.status_code}"
    )
    return response

# CORS middleware configuration
# Allows communication with the local Next.js client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RecommendRequest(BaseModel):
    text: str
    genre: str


class RecommendResponse(BaseModel):
    mood: str
    track_id: str | None
    genre: str


@app.post("/api/recommend", response_model=RecommendResponse)
def recommend(req: RecommendRequest) -> RecommendResponse:
    """
    Classifies the user's input mood description, then finds a matching song.
    """
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Please describe your mood.")

    # Step 1: Predict user emotion/mood
    mood = predict_mood(req.text)

    # Step 2: Fetch corresponding track ID directly from recommender
    track_id = get_recommended_track(mood, req.genre)

    return RecommendResponse(mood=mood, track_id=track_id, genre=req.genre)


@app.get("/api/genres")
def get_genres() -> dict[str, list[str]]:
    """
    Returns a sorted list of unique music genres present in the dataset.
    """
    genres = sorted(df["genre"].unique().tolist())
    return {"genres": genres}


@app.get("/api/moods")
def get_moods() -> dict[str, list[str]]:
    """
    Returns a sorted list of unique emotional moods present in the dataset.
    """
    moods = sorted(df["mood"].unique().tolist())
    return {"moods": moods}
