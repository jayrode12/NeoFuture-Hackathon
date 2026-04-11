"""
app/routes/chat_routes.py — Chat, prediction, explanation, and scheme-match endpoints.

Registered in app/main.py under the /api prefix.
"""

from __future__ import annotations

import sys
import os

# Make the model directory importable (needed by chat_service → predict, explain, match_schemes)
_BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
_MODEL_DIR   = os.path.join(_BACKEND_DIR, "model")
if _MODEL_DIR not in sys.path:
    sys.path.insert(0, _MODEL_DIR)

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from app.schemas.chat import (
    ChatRequest,
    ChatResponse,
    PredictRequest,
    PredictResponse,
    ExplainRequest,
    MatchSchemesRequest,
)
from app.services.chat_service import process_chat

# Lazy imports for standalone endpoints — only import when needed so that
# a missing model file does not crash the whole app at startup.
def _get_predict():
    from predict import predict_pipeline
    return predict_pipeline

def _get_explain():
    from explain import explain_prediction
    return explain_prediction

def _get_match():
    from scheme_matcher import match_schemes
    return match_schemes


router = APIRouter()


# ── /api/chat ─────────────────────────────────────────────────────
@router.post("/chat", response_model=ChatResponse, tags=["Assistant"])
async def chat(request: ChatRequest):
    """
    Main conversational endpoint.

    Accepts a message, mode, language, and optional user_profile.
    Returns a structured JSON with assistant_reply, iwts_score,
    eligible_schemes, and SHAP explanation.

    Modes:
      scheme_discovery — predict score + match schemes
      profile_score    — explain current score
      guidance         — answer general questions
    """
    try:
        result = process_chat(request)
        return JSONResponse(content=result)
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=503,
            detail=f"ML model not loaded: {exc}. Run model/train.py first.",
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


# ── /api/predict ──────────────────────────────────────────────────
@router.post("/predict", response_model=PredictResponse, tags=["Assistant"])
async def predict(request: PredictRequest):
    """
    Raw IWTS score prediction + scheme matching.
    Returns iwts_score and eligible_schemes without any chat wrapper.
    """
    try:
        pipeline = _get_predict()
        profile  = request.user_profile
        input_data = {
            "upi_transactions_count": float(profile.upi_transactions_count),
            "upi_avg_monthly_amount": float(profile.upi_avg_monthly_amount),
            "location_consistency":   float(profile.location_consistency),
            "peer_attestations":      float(profile.peer_attestations),
            "customer_rating_avg":    float(profile.customer_rating_avg),
            "work_duration_months":   float(profile.work_duration_months),
            "aadhaar_verified":       float(profile.aadhaar_verified),
        }
        result = pipeline(input_data)
        return JSONResponse(content=result)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


# ── /api/explain ──────────────────────────────────────────────────
@router.post("/explain", tags=["Assistant"])
async def explain(request: ExplainRequest):
    """
    SHAP-based explainability for a given worker profile.
    Returns shap_values, base_value, and top_features list.
    """
    try:
        explain_fn = _get_explain()
        profile    = request.user_profile
        input_data = {
            "upi_transactions_count": float(profile.upi_transactions_count),
            "upi_avg_monthly_amount": float(profile.upi_avg_monthly_amount),
            "location_consistency":   float(profile.location_consistency),
            "peer_attestations":      float(profile.peer_attestations),
            "customer_rating_avg":    float(profile.customer_rating_avg),
            "work_duration_months":   float(profile.work_duration_months),
            "aadhaar_verified":       float(profile.aadhaar_verified),
        }
        result = explain_fn(input_data)
        return JSONResponse(content=result)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


# ── /api/match-schemes ────────────────────────────────────────────
@router.post("/match-schemes", tags=["Assistant"])
async def match_schemes_endpoint(request: MatchSchemesRequest):
    """
    Given a raw IWTS score, return eligible schemes without calling the ML model.
    Useful when the score is already known (e.g. stored in the database).
    """
    try:
        match_fn = _get_match()
        schemes  = match_fn(request.iwts_score)
        return JSONResponse(content={"iwts_score": request.iwts_score, "eligible_schemes": schemes})
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
