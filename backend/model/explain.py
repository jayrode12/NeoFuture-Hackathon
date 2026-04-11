"""
explain.py — SHAP-based IWTS score explainability.

Uses a lazy-loaded TreeExplainer (suited for GradientBoostingRegressor).
Returns a dict mapping each feature name to its SHAP impact value.
"""

import sys
import os

_MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
if _MODEL_DIR not in sys.path:
    sys.path.insert(0, _MODEL_DIR)

import shap
import joblib
import pandas as pd

from features import create_features
from config import MODEL_PATH

# ── Lazy singletons ────────────────────────────────────────────────
_model     = None
_explainer = None


def _load():
    global _model, _explainer

    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(
                f"Model file not found at {MODEL_PATH}. "
                "Run `python model/train.py` first."
            )
        _model = joblib.load(MODEL_PATH)

    if _explainer is None:
        # TreeExplainer is the correct choice for tree-based regressors
        _explainer = shap.TreeExplainer(_model)

    return _model, _explainer


def explain_prediction(input_data: dict) -> dict:
    """
    Args:
        input_data: same dict as predict_pipeline()

    Returns:
        {
            "shap_values": {feature: impact, ...},
            "base_value": float,
            "top_features": [
                {"feature": str, "impact": float, "direction": "positive"|"negative"},
                ...
            ]
        }
    """
    _, explainer = _load()

    df = pd.DataFrame([input_data])
    df = create_features(df)

    shap_values = explainer(df)   # shap.Explanation object

    raw_impacts: dict = dict(zip(df.columns.tolist(), shap_values.values[0].tolist()))
    base_value: float = float(shap_values.base_values[0])

    # Build a clean sorted list of top features for the frontend
    top_features = sorted(
        [
            {
                "feature": feat,
                "impact": round(val, 4),
                "direction": "positive" if val >= 0 else "negative",
            }
            for feat, val in raw_impacts.items()
        ],
        key=lambda x: abs(x["impact"]),
        reverse=True,
    )

    return {
        "shap_values": {k: round(v, 4) for k, v in raw_impacts.items()},
        "base_value": round(base_value, 4),
        "top_features": top_features[:5],    # top-5 most impactful
    }
