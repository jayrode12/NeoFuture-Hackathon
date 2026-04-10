from pydantic import BaseModel, Field
from typing import Optional, List
from bson import ObjectId
from .base import PyObjectId

class SchemeMatchModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    userId: str
    eligibleSchemes: List[str]

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }
