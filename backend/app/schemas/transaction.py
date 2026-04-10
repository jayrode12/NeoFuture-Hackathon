from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TransactionCreate(BaseModel):
    userId: str
    amount: float
    type: str # credit/debit

class TransactionResponse(TransactionCreate):
    id: str
    date: datetime

    model_config = {
        "from_attributes": True
    }
