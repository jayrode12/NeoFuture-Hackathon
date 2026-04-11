from app.config.db import db
from app.models.score import TrustScoreModel
from app.models.transaction import VerificationDataModel
from datetime import datetime

async def calculate_trust_score(worker_id: str):
    # Fetch verification data for this worker
    v_data = await db.verification_data.find_one({"workerId": worker_id})
    
    if not v_data:
        # Default starting values if no verification data exists
        return {
            "workerId": worker_id,
            "iwts_score": 30,
            "score_band": "Bronze",
            "eligibility": "Basic Banking",
            "breakdown": {"identity": 10, "financial": 10, "social": 10},
            "calculatedAt": datetime.utcnow().isoformat()
        }
    
    # IWTS Logic based on VerificationDataSchema
    # Financial Factor (40%): Transaction Count + Avg Amount
    financial_score = min(100, (v_data.get('upi_transactions_count', 0) * 2) + (v_data.get('upi_avg_monthly_amount', 0) / 500))
    
    # Social Factor (30%): Peer Attestations + Rating
    social_score = min(100, (v_data.get('peer_attestations', 0) * 20) + (v_data.get('customer_rating_avg', 0) * 10))
    
    # Reliability Factor (30%): Location Consistency + Work Duration
    reliability_score = min(100, (v_data.get('location_consistency', 0) * 50) + (v_data.get('work_duration_months', 0) * 2))
    
    total_score = int((financial_score * 0.4) + (social_score * 0.3) + (reliability_score * 0.3))
    
    # Determine Band and Eligibility
    score_band = "Diamond" if total_score > 80 else "Gold" if total_score > 60 else "Silver" if total_score > 40 else "Bronze"
    eligibility = "Micro Loans" if total_score > 40 else "Insurance Only"
    
    score_doc = {
        "workerId": worker_id,
        "iwts_score": total_score,
        "score_band": score_band,
        "eligibility": eligibility,
        "breakdown": {
            "financial": financial_score,
            "social": social_score,
            "reliability": reliability_score
        },
        "calculatedAt": datetime.utcnow().isoformat()
    }
    
    # Save to database
    await db.scores.update_one(
        {"workerId": worker_id},
        {"$set": score_doc},
        upsert=True
    )
    
    return score_doc

async def get_user_score(worker_id: str):
    score = await db.scores.find_one({"workerId": worker_id})
    return score
