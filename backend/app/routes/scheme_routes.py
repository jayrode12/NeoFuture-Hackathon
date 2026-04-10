from fastapi import APIRouter, HTTPException
from app.schemas.scheme import SchemeMatchRequest, SchemeResponse
from app.services.scheme_service import match_schemes, get_user_schemes

router = APIRouter()

@router.post("/schemes/match", response_model=SchemeResponse)
async def trigger_match_schemes(req: SchemeMatchRequest):
    eligible = await match_schemes(req.userId)
    return {"userId": req.userId, "eligibleSchemes": eligible}

@router.get("/schemes/{userId}", response_model=SchemeResponse)
async def get_schemes(userId: str):
    scheme_data = await get_user_schemes(userId)
    if not scheme_data:
        raise HTTPException(status_code=404, detail="Schemes not found for user")
    return scheme_data
