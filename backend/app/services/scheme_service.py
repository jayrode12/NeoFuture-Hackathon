from app.config.db import db
from app.services.score_service import get_user_score

async def match_schemes(user_id: str):
    score_data = await get_user_score(user_id)
    if not score_data:
        return []
    
    score = score_data['score']
    eligible_schemes = []
    
    # Logic from plan:
    # Score > 70 → Loan
    # Score > 50 → Bank Account
    # Score > 60 → Insurance
    
    if score > 50:
        eligible_schemes.append("Pradhan Mantri Jan Dhan Yojana (Bank Account)")
    if score > 60:
        eligible_schemes.append("Pradhan Mantri Suraksha Bima Yojana (Insurance)")
    if score > 70:
        eligible_schemes.append("MUDRA Loan for Small Businesses")
        
    scheme_data = {
        "userId": user_id,
        "eligibleSchemes": eligible_schemes
    }
    
    await db.schemes.update_one(
        {"userId": user_id},
        {"$set": scheme_data},
        upsert=True
    )
    
    return eligible_schemes

async def get_user_schemes(user_id: str):
    schemes = await db.schemes.find_one({"userId": user_id})
    return schemes
