from pydantic import BaseModel, Field
from typing import Optional, Dict
from bson import ObjectId
from .base import PyObjectId

class TrustScoreModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    userId: str
    score: int
    breakdown: Dict[str, float]

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }
