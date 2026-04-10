from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId
from .base import PyObjectId

class TransactionModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    userId: str
    amount: float
    type: str # credit or debit
    date: datetime = Field(default_factory=datetime.utcnow)

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_schema_extra": {
            "example": {
                "userId": "60d5ecb8b392d40015f8a0a1",
                "amount": 500.0,
                "type": "credit",
                "date": "2023-10-27T10:00:00Z"
            }
        }
    }
