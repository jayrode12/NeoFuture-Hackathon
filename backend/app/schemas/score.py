from pydantic import BaseModel
from typing import Dict

class ScoreCalculateRequest(BaseModel):
    userId: str

class ScoreResponse(BaseModel):
    userId: str
    score: int
    breakdown: Dict[str, float]

    model_config = {
        "from_attributes": True
    }
