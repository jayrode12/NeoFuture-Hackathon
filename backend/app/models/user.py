from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId
from .base import PyObjectId

class UserModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    fullName: str
    phone: str
    aadhaarNumber: str
    state: str
    district: str
    primaryWorkType: str
    email: str
    password: str

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }
