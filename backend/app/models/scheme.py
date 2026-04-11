from pydantic import BaseModel, Field
from typing import Optional, List
from bson import ObjectId
from .base import PyObjectId

class SchemeModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    schemeId: str
    name: str
    type: str # Loan, Insurance, etc.
    provider: str
    amount: str
    minScore: int
    description: str
    applyUrl: str
    category: str

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }

class SchemeMatchModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    workerId: str
    eligibleSchemes: List[str]

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }
