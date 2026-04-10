from app.config.db import db
from app.models.score import TrustScoreModel
from app.models.transaction import TransactionModel
from bson import ObjectId

async def calculate_trust_score(user_id: str):
    # Fetch user transactions (mocking logic)
    cursor = db.transactions.find({"userId": user_id})
    transactions = await cursor.to_list(length=100)
    
    total_credit = sum(t['amount'] for t in transactions if t['type'] == 'credit')
    total_debit = sum(t['amount'] for t in transactions if t['type'] == 'debit')
    
    # Mock AI calculation: score = (income * 0.4) + (location * 0.25) + (peer * 0.2) + (trend * 0.15)
    # Since we only have transactions, we'll simulate the other factors
    
    income_factor = min(100, (total_credit / 5000) * 100) if total_credit > 0 else 20
    location_factor = 75 # Mock
    peer_factor = 60 # Mock
    trend_factor = 80 if total_credit > total_debit else 40
    
    score = (income_factor * 0.4) + (location_factor * 0.25) + (peer_factor * 0.2) + (trend_factor * 0.15)
    score = int(score)
    
    breakdown = {
        "income": income_factor,
        "location": location_factor,
        "peer": peer_factor,
        "trend": trend_factor
    }
    
    score_data = {
        "userId": user_id,
        "score": score,
        "breakdown": breakdown
    }
    
    # Update or insert score
    await db.scores.update_one(
        {"userId": user_id},
        {"$set": score_data},
        upsert=True
    )
    
    return score_data

async def get_user_score(user_id: str):
    score = await db.scores.find_one({"userId": user_id})
    return score
