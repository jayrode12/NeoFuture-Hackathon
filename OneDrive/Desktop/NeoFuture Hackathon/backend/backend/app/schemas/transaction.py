from pydantic import BaseModel
from typing import Optional

class VerificationDataSchema(BaseModel):
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
        "from_attributes": True
    }
