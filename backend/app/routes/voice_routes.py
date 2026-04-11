"""
app/routes/voice_routes.py
──────────────────────────
Voice assistant step-by-step form validation endpoints.

POST /api/voice/register-step
POST /api/voice/login-step

These are called from the frontend VoiceFormAssistant component for
field-by-field validation and normalization of spoken/typed input.
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from app.schemas.voice import VoiceStepRequest, VoiceStepResponse
from app.services.voice_service import (
    validate_register_step,
    validate_login_step,
    REG_FIELD_ORDER,
    LOGIN_FIELD_ORDER,
)

router = APIRouter(prefix="/voice", tags=["Voice Assistant"])


@router.post("/register-step", response_model=VoiceStepResponse)
async def register_step(req: VoiceStepRequest):
    """
    Validate and normalise one field of the registration form.

    Request body:
        field    — e.g. "phone"
        input    — raw spoken/typed text
        language — "en" | "hi" | "mr"

    Response:
        valid            — True / False
        normalizedValue  — clean value to store, empty when invalid
        nextField        — next field name, null when form is complete
        message          — reply in the requested language
    """
    if req.field not in REG_FIELD_ORDER:
        raise HTTPException(status_code=422, detail=f"Unknown registration field: {req.field}")

    result = validate_register_step(req.field, req.input, req.language.value)
    return JSONResponse(content=result)


@router.post("/login-step", response_model=VoiceStepResponse)
async def login_step(req: VoiceStepRequest):
    """
    Validate one field of the login form (currently email only).
    """
    if req.field not in LOGIN_FIELD_ORDER:
        raise HTTPException(status_code=422, detail=f"Unknown login field: {req.field}")

    result = validate_login_step(req.field, req.input, req.language.value)
    return JSONResponse(content=result)
