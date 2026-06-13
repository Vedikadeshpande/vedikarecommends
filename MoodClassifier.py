import os
import re
import joblib

MODEL_PATH = "model.pkl"
VECTORIZER_PATH = "vectorizer.pkl"

# Global placeholders for the model and vectorizer
_model = None
_vectorizer = None


def load_model():
    """
    Dynamically loads the pre-trained LogisticRegression model and TfidfVectorizer.
    If the weights are not found, it automatically triggers a fresh training run.
    """
    global _model, _vectorizer
    if _model is None or _vectorizer is None:
        if os.path.exists(MODEL_PATH) and os.path.exists(VECTORIZER_PATH):
            _model = joblib.load(MODEL_PATH)
            _vectorizer = joblib.load(VECTORIZER_PATH)
        else:
            print("[Warning] Trained weights not found. Training model from scratch...")
            train_model()


def train_model():
    """
    Downloads NLTK components, reads training datasets, trains the Logistic Regression
    classifier using TF-IDF text features, and serializes the model to disk.
    """
    global _model, _vectorizer
    import pandas as pd
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.linear_model import LogisticRegression
    import nltk
    from nltk.corpus import stopwords
    from nltk.stem import WordNetLemmatizer

    print("Downloading required NLTK resources...")
    nltk.download('stopwords', quiet=True)
    nltk.download('wordnet', quiet=True)
    
    stop_words = set(stopwords.words('english'))
    lemmatizer = WordNetLemmatizer()

    print("Loading datasets...")
    for filename in ["train.txt", "val.txt", "test.txt"]:
        if not os.path.exists(filename):
            raise FileNotFoundError(
                f"Missing dataset '{filename}' required for training. "
                "Ensure train.txt, val.txt, and test.txt are in the root directory."
            )

    train_df = pd.read_csv("train.txt", sep=";", names=["text", "emotion"])
    val_df = pd.read_csv("val.txt", sep=";", names=["text", "emotion"])
    test_df = pd.read_csv("test.txt", sep=";", names=["text", "emotion"])

    def cleaningText(data):
        data['text'] = data['text'].str.lower()
        data['text'] = data['text'].apply(lambda x: re.sub(r'[^\w\s]', '', x))
        data['text'] = data['text'].apply(lambda x: " ".join([
            lemmatizer.lemmatize(word)
            for word in x.split()
            if word not in stop_words
        ]))
        data.drop_duplicates(inplace=True)
        data.dropna(inplace=True)
        data['text'] = data['text'].str.replace(r"\bim\b", "i am", regex=True)
        return data

    print("Cleaning text datasets...")
    train_df = cleaningText(train_df)
    val_df = cleaningText(val_df)
    test_df = cleaningText(test_df)

    # Combine training + validation data for optimal performance
    combined_df = pd.concat([train_df, val_df])
    X_train = combined_df['text']
    y_train = combined_df['emotion']

    print("Fitting TF-IDF Vectorizer...")
    _vectorizer = TfidfVectorizer(max_features=5000)
    X_train_vec = _vectorizer.fit_transform(X_train)

    print("Training Logistic Regression classifier...")
    _model = LogisticRegression(max_iter=1000)
    _model.fit(X_train_vec, y_train)

    print(f"Saving serialized assets to '{MODEL_PATH}' and '{VECTORIZER_PATH}'...")
    joblib.dump(_model, MODEL_PATH)
    joblib.dump(_vectorizer, VECTORIZER_PATH)
    print("Model training complete!")


def predict_mood(text: str) -> str:
    """
    Cleans the input text, vectorizes it, and predicts the emotion/mood.
    """
    load_model()
    
    # Preprocess text (must match the preprocessing logic used during training)
    clean_text = re.sub(r'[^\w\s]', '', text.lower())
    clean_text = re.sub(r"\bim\b", "i am", clean_text)

    # Vectorize and predict
    text_vec = _vectorizer.transform([clean_text])
    predicted_emotion = _model.predict(text_vec)[0]
    
    return str(predicted_emotion)


if __name__ == "__main__":
    import sys
    
    # Explicit training flag
    if len(sys.argv) > 1 and sys.argv[1] == "--train":
        train_model()
    else:
        print("=" * 60)
        print("MoodTune - Emotion Based Music Recommender (Model CLI)")
        print("=" * 60)
        user_input = input("How are you feeling today? Describe your mood: ").strip()
        if user_input:
            mood = predict_mood(user_input)
            print(f"\nDetected Vibe: {mood.capitalize()}")
        else:
            print("No input provided.")
