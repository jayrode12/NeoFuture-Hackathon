from fastapi import APIRouter, HTTPException
from app.schemas.score import ScoreCalculateRequest, ScoreResponse
from app.services.score_service import calculate_trust_score, get_user_score

router = APIRouter()

@router.post("/score/calculate", response_model=ScoreResponse)
async def trigger_calculate_score(req: ScoreCalculateRequest):
    score_data = await calculate_trust_score(req.userId)
    return score_data

@router.get("/score/{userId}", response_model=ScoreResponse)
async def get_score(userId: str):
    score_data = await get_user_score(userId)
    if not score_data:
        raise HTTPException(status_code=404, detail="Score not found for user")
    return score_data
