import os
import re
import joblib
import logging
from typing import Optional, Tuple, Any

# Set up module-level logger
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("MoodClassifier")

MODEL_PATH = "model.pkl"
VECTORIZER_PATH = "vectorizer.pkl"

# Global placeholders for the model and vectorizer
_model: Optional[Any] = None
_vectorizer: Optional[Any] = None

# Global placeholders for NLTK components to avoid repeated loading
_stop_words: Optional[set] = None
_lemmatizer: Optional[Any] = None


def _init_nltk() -> Tuple[set, Any]:
    """
    Initializes and returns NLTK stop words and WordNet lemmatizer.
    Loads components lazily and silently to optimize startup.
    Configures a writable path (/tmp) on Vercel serverless environment.
    """
    global _stop_words, _lemmatizer
    if _stop_words is None or _lemmatizer is None:
        import nltk
        
        # Configure writable directory for Vercel serverless environment
        if os.environ.get("VERCEL"):
            nltk_data_dir = "/tmp/nltk_data"
            if not os.path.exists(nltk_data_dir):
                os.makedirs(nltk_data_dir, exist_ok=True)
            if nltk_data_dir not in nltk.data.path:
                nltk.data.path.append(nltk_data_dir)
        else:
            nltk_data_dir = None
            
        nltk.download('stopwords', download_dir=nltk_data_dir, quiet=True)
        nltk.download('wordnet', download_dir=nltk_data_dir, quiet=True)
        from nltk.corpus import stopwords
        from nltk.stem import WordNetLemmatizer
        _stop_words = set(stopwords.words('english'))
        _lemmatizer = WordNetLemmatizer()
    return _stop_words, _lemmatizer


def clean_text(text: str) -> str:
    """
    Standardized text cleaning pipeline for both training and inference.
    
    Args:
        text (str): The raw input text.
        
    Returns:
        str: Preprocessed, lemmatized, and cleaned text.
    """
    if not isinstance(text, str):
        return ""
    
    stop_words, lemmatizer = _init_nltk()
    
    # Lowercase and remove punctuation/special characters
    text_lower = text.lower()
    text_no_punc = re.sub(r'[^\w\s]', '', text_lower)
    
    # Tokenize, remove stopwords, and lemmatize
    words = [
        lemmatizer.lemmatize(word)
        for word in text_no_punc.split()
        if word not in stop_words
    ]
    cleaned = " ".join(words)
    
    # Standardize common slang/contractions (e.g. "im" to "i am")
    cleaned = re.sub(r"\bim\b", "i am", cleaned)
    return cleaned


def load_model() -> None:
    """
    Dynamically loads the pre-trained LogisticRegression model and TfidfVectorizer.
    If the weights are not found, it automatically triggers a fresh training run.
    """
    global _model, _vectorizer
    if _model is None or _vectorizer is None:
        if os.path.exists(MODEL_PATH) and os.path.exists(VECTORIZER_PATH):
            logger.info("Loading pre-trained classifier and vectorizer weights...")
            _model = joblib.load(MODEL_PATH)
            _vectorizer = joblib.load(VECTORIZER_PATH)
        else:
            logger.warning("Serialized weights not found. Training model from scratch...")
            train_model()


def train_model() -> None:
    """
    Downloads NLTK components, reads training datasets, trains the Logistic Regression
    classifier using TF-IDF text features, and serializes the model to disk.
    """
    global _model, _vectorizer
    import pandas as pd
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.linear_model import LogisticRegression

    logger.info("Starting model training pipeline...")
    
    # Verify dataset files exist
    for filename in ["train.txt", "val.txt", "test.txt"]:
        if not os.path.exists(filename):
            raise FileNotFoundError(
                f"Missing dataset '{filename}' required for training. "
                "Ensure train.txt, val.txt, and test.txt are in the root directory."
            )

    logger.info("Loading datasets into memory...")
    train_df = pd.read_csv("train.txt", sep=";", names=["text", "emotion"])
    val_df = pd.read_csv("val.txt", sep=";", names=["text", "emotion"])
    test_df = pd.read_csv("test.txt", sep=";", names=["text", "emotion"])

    logger.info("Preprocessing text datasets...")
    # Apply standardized cleaning to all datasets
    for df in [train_df, val_df, test_df]:
        df['text'] = df['text'].apply(clean_text)
        df.drop_duplicates(inplace=True)
        df.dropna(inplace=True)

    # Combine training + validation data for optimal performance
    combined_df = pd.concat([train_df, val_df])
    X_train = combined_df['text']
    y_train = combined_df['emotion']

    logger.info(f"Fitting TF-IDF Vectorizer (vocab limit: 5000) on {len(X_train)} samples...")
    _vectorizer = TfidfVectorizer(max_features=5000)
    X_train_vec = _vectorizer.fit_transform(X_train)

    logger.info("Training Logistic Regression classifier (max_iter: 1000)...")
    _model = LogisticRegression(max_iter=1000)
    _model.fit(X_train_vec, y_train)

    # Evaluate on test set
    X_test = test_df['text']
    y_test = test_df['emotion']
    X_test_vec = _vectorizer.transform(X_test)
    test_accuracy = _model.score(X_test_vec, y_test)
    logger.info(f"Model test accuracy: {test_accuracy:.4f}")

    logger.info(f"Saving serialized assets to '{MODEL_PATH}' and '{VECTORIZER_PATH}'...")
    joblib.dump(_model, MODEL_PATH)
    joblib.dump(_vectorizer, VECTORIZER_PATH)
    logger.info("Model training complete!")


def predict_mood(text: str) -> str:
    """
    Cleans the input text, vectorizes it, and predicts the emotion/mood.
    
    Args:
        text (str): The raw input description from the user.
        
    Returns:
        str: The predicted emotion category.
    """
    load_model()
    
    # Preprocess text (must match the preprocessing logic used during training)
    cleaned_input = clean_text(text)

    # Vectorize and predict
    text_vec = _vectorizer.transform([cleaned_input])
    predicted_emotion = _model.predict(text_vec)[0]
    
    logger.info(f"Prediction input: '{text}' -> Cleaned: '{cleaned_input}' -> Emotion: '{predicted_emotion}'")
    return str(predicted_emotion)


if __name__ == "__main__":
    import sys
    
    # Explicit training flag
    if len(sys.argv) > 1 and sys.argv[1] == "--train":
        train_model()
    else:
        logger.info("=" * 60)
        logger.info("MoodTune - Emotion Based Music Recommender (Model CLI)")
        logger.info("=" * 60)
        user_input = input("How are you feeling today? Describe your mood: ").strip()
        if user_input:
            mood = predict_mood(user_input)
            print(f"\nDetected Vibe: {mood.capitalize()}")
        else:
            print("No input provided.")
