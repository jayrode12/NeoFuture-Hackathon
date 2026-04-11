"""
app/schemas/voice.py — Pydantic schemas for the voice assistant step-by-step endpoints.
"""

from __future__ import annotations
from typing import Optional
from pydantic import BaseModel
from enum import Enum


class VoiceLang(str, Enum):
    en = "en"
    hi = "hi"
    mr = "mr"


class VoiceMode(str, Enum):
    registration = "registration"
    login        = "login"


# ── Request ───────────────────────────────────────────────────────
class VoiceStepRequest(BaseModel):
    field:    str              # e.g. "phone", "email"
    input:    str              # raw spoken / typed text
    language: VoiceLang = VoiceLang.en
    mode:     VoiceMode = VoiceMode.registration


# ── Response ──────────────────────────────────────────────────────
class VoiceStepResponse(BaseModel):
    mode:            str
    language:        str
    field:           str
    valid:           bool
    normalizedValue: str          # empty string when invalid
    nextField:       Optional[str]  # None when this was the last field
    message:         str
