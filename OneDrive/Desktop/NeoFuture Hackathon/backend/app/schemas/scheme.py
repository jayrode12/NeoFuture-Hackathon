from pydantic import BaseModel
from typing import List

class SchemeMatchRequest(BaseModel):
    userId: str

class SchemeResponse(BaseModel):
    userId: str
    eligibleSchemes: List[str]

    model_config = {
        "from_attributes": True
    }
