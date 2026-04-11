from pydantic import BaseModel, Field
from typing import Optional
from .base import PyObjectId

class VerificationDataModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    workerId: str
    aadhaar_verified: int
    upi_transactions_count: int
    upi_avg_monthly_amount: float
    location_lat: float
    location_lng: float
    location_consistency: float
    peer_attestations: int
    customer_rating_avg: float
    work_duration_months: int
    document_score: float
    consent_score: int

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }
