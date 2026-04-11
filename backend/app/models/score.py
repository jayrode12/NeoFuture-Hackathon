from pydantic import BaseModel, Field
from typing import Optional, Dict
from bson import ObjectId
from .base import PyObjectId

class TrustScoreModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    workerId: str
    iwts_score: int
    score_band: str
    eligibility: str
    breakdown: Dict[str, float]
    calculatedAt: str

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }
