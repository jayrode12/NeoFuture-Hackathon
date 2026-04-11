from pydantic import BaseModel
from typing import List

class SchemeInfo(BaseModel):
    schemeId: str
    name: str
    type: str
    provider: str
    amount: str
    minScore: int
    description: str
    applyUrl: str
    category: str

class SchemeMatchRequest(BaseModel):
    workerId: str

class SchemeResponse(BaseModel):
    workerId: str
    eligibleSchemes: List[SchemeInfo]

    model_config = {
        "from_attributes": True
    }
