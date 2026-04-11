from pydantic import BaseModel
from typing import Dict

class ScoreCalculateRequest(BaseModel):
    workerId: str

class ScoreResponse(BaseModel):
    workerId: str
    iwts_score: int
    score_band: str
    eligibility: str
    breakdown: Dict[str, float]
    calculatedAt: str

    model_config = {
        "from_attributes": True
    }
