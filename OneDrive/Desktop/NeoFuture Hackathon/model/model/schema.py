from pydantic import BaseModel

class WorkerFeatures(BaseModel):
    upi_transactions_count: int
    upi_avg_monthly_amount: float
    location_consistency: float
    peer_attestations: int
    customer_rating_avg: float
    work_duration_months: int
    aadhaar_verified: int