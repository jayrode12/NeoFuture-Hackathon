"""
app/schemas/chat.py — Pydantic request and response models for the chat API.
"""

from __future__ import annotations

from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


# ── Enumerations ──────────────────────────────────────────────────
class Mode(str, Enum):
    scheme_discovery = "scheme_discovery"
    profile_score    = "profile_score"
    guidance         = "guidance"


class Language(str, Enum):
    en = "en"    # English
    hi = "hi"    # Hindi
    mr = "mr"    # Marathi


# ── Sub-models ────────────────────────────────────────────────────
class UserProfile(BaseModel):
    """Raw feature inputs for the IWTS model. All fields optional — the
    chat service will ask the user to supply missing ones."""
    upi_transactions_count: Optional[float] = Field(None, ge=0, description="Number of UPI transactions")
    upi_avg_monthly_amount: Optional[float] = Field(None, ge=0, description="Average monthly UPI amount (INR)")
    location_consistency:   Optional[float] = Field(None, ge=0, le=1,  description="0–1 location stability score")
    peer_attestations:      Optional[float] = Field(None, ge=0, description="Number of peer attestations received")
    customer_rating_avg:    Optional[float] = Field(None, ge=1, le=5,  description="Average customer rating 1–5")
    work_duration_months:   Optional[float] = Field(None, ge=0, description="Months of continuous work")
    aadhaar_verified:       Optional[float] = Field(None, ge=0, le=1,  description="1 if Aadhaar is verified, else 0")


class SchemeResult(BaseModel):
    schemeId:     str
    name:         str
    type:         str
    provider:     str
    amount:       str
    minScore:     float
    description:  str
    applyUrl:     str
    category:     str
    match_reason: str


class TopFeature(BaseModel):
    feature:   str
    impact:    float
    direction: str    # "positive" | "negative"


class ExplanationResult(BaseModel):
    shap_values:  Dict[str, float]
    base_value:   float
    top_features: List[TopFeature]


# ── Request ───────────────────────────────────────────────────────
class ChatRequest(BaseModel):
    message:      str      = Field(...,   description="User's typed or transcribed message")
    mode:         Mode     = Field(Mode.scheme_discovery, description="Assistant mode")
    language:     Language = Field(Language.en,            description="Response language")
    user_profile: Optional[UserProfile] = Field(None,      description="Worker profile for ML prediction")


# ── Response ──────────────────────────────────────────────────────
class ChatResponse(BaseModel):
    mode:             str
    language:         str
    user_message:     str
    assistant_reply:  str
    iwts_score:       Optional[float]              = None
    eligible_schemes: List[Dict[str, Any]]         = []
    explanation:      Optional[Dict[str, Any]]     = None


# ── Standalone endpoint models ────────────────────────────────────
class PredictRequest(BaseModel):
    user_profile: UserProfile


class PredictResponse(BaseModel):
    iwts_score:       float
    eligible_schemes: List[Dict[str, Any]]


class ExplainRequest(BaseModel):
    user_profile: UserProfile


class MatchSchemesRequest(BaseModel):
    iwts_score: float = Field(..., ge=0, le=100)
