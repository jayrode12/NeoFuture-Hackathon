from pydantic import BaseModel, Field
from typing import Optional
from .base import PyObjectId

class ApplicationModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    applicationId: str
    workerId: str
    schemeId: str
    status: str # approved, pending, rejected
    appliedAt: str

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }
