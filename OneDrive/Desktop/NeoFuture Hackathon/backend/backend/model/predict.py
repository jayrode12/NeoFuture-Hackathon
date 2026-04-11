"""
predict.py — IWTS score prediction pipeline.

Importable from any location; resolves its own sys.path so that
sibling modules (features, scheme_matcher, config) are always found.
"""

import sys
import os

# Ensure this directory's siblings are importable when called from app/
_MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
if _MODEL_DIR not in sys.path:
    sys.path.insert(0, _MODEL_DIR)

import pandas as pd
import joblib

from features import create_features
from scheme_matcher import match_schemes
from config import MODEL_PATH, DATA_PATH

# ── Lazy singletons ────────────────────────────────────────────────
_model      = None
_data_store = None


def _load():
    global _model, _data_store

    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(
                f"Model file not found at {MODEL_PATH}. "
                "Run `python model/train.py` first."
            )
        _model = joblib.load(MODEL_PATH)

    if _data_store is None:
        if os.path.exists(DATA_PATH):
            _data_store = pd.read_csv(DATA_PATH)
        else:
            _data_store = pd.DataFrame()   # no exact-match fallback available

    return _model, _data_store


# ── Exact-match check (optional fast path) ────────────────────────
def _find_exact_match(input_data: dict, data_store: pd.DataFrame):
    if data_store.empty:
        return None

    # Only compare on raw feature columns present in the CSV
    cols = [c for c in input_data.keys() if c in data_store.columns]
    if not cols:
        return None

    query = pd.DataFrame([{c: input_data[c] for c in cols}])
    try:
        match = data_store[
            (data_store[cols] == query.iloc[0]).all(axis=1)
        ]
        if not match.empty:
            return float(match["iwts_score"].values[0])
    except Exception:
        pass

    return None


# ── Public API ─────────────────────────────────────────────────────
def predict_pipeline(input_data: dict) -> dict:
    """
    Args:
        input_data: dict with keys:
            upi_transactions_count, upi_avg_monthly_amount,
            location_consistency, peer_attestations,
            customer_rating_avg, work_duration_months, aadhaar_verified

    Returns:
        {
            "iwts_score": float,
            "eligible_schemes": list[dict]   # top-5, sorted by minScore desc
        }
    """
    model, data_store = _load()

    # Step 1 — exact match (deterministic short-circuit)
    score = _find_exact_match(input_data, data_store)

    if score is None:
        # Step 2 — ML prediction
        df = pd.DataFrame([input_data])
        df = create_features(df)
        score = float(model.predict(df)[0])

    score = round(min(max(score, 0), 100), 2)

    # Step 3 — scheme matching
    schemes = match_schemes(score)

    return {
        "iwts_score": score,
        "eligible_schemes": schemes[:5],
    }
