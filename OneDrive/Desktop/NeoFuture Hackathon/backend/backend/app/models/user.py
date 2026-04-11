from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId
from .base import PyObjectId

class UserModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    workerId: str
    name: str
    phone: str
    aadhaarMasked: str
    state: str
    district: str
    workType: str
    email: str
    password: str
    createdAt: Optional[str] = None

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }
