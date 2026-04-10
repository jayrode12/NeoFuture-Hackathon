import pandas as pd
import joblib

from features import create_features
from scheme_matcher import match_schemes
from config import MODEL_PATH, DATA_PATH

# load model
model = joblib.load(MODEL_PATH)

# optional: load dataset for exact match
data_store = pd.read_csv(DATA_PATH)


def find_exact_match(input_data):
    query = pd.DataFrame([input_data])

    match = data_store[
        (data_store[list(input_data.keys())] == query.iloc[0]).all(axis=1)
    ]

    if not match.empty:
        return float(match["iwts_score"].values[0])

    return None


def predict_pipeline(input_data: dict):
    # STEP 1 — exact match check
    exact_score = find_exact_match(input_data)

    if exact_score is not None:
        score = exact_score
    else:
        # STEP 2 — ML prediction
        df = pd.DataFrame([input_data])
        df = create_features(df)

        score = float(model.predict(df)[0])

    score = round(score, 2)

    # STEP 3 — match schemes
    schemes = match_schemes(score)

    return {
        "iwts_score": score,
        "eligible_schemes": schemes[:5]  # top 5
    }