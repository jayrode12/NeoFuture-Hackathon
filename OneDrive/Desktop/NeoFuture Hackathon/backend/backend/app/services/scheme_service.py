from app.config.db import db
from app.services.score_service import get_user_score

class SchemeService:
    @staticmethod
    async def match_schemes(workerId: str):
        # Fetch user score
        cursor = db.scores.find({"workerId": workerId}).sort("calculatedAt", -1)
        score_doc = await cursor.to_list(length=1)
        
        if not score_doc:
            return []
            
        user_score = score_doc[0]["iwts_score"]
        
        # Fetch user work type
        user = await db.users.find_one({"workerId": workerId})
        if not user:
            return []
        
        user_work_type = user.get("workType")
        
        # Match schemes where minScore <= user_score
        cursor = db.schemes.find({"minScore": {"$lte": user_score}})
        eligible_schemes = await cursor.to_list(length=100)
        
        for scheme in eligible_schemes:
            scheme["id"] = str(scheme.pop("_id"))
            
        return eligible_schemes

    @staticmethod
    async def get_all_schemes():
        cursor = db.schemes.find({})
        schemes = await cursor.to_list(length=100)
        for scheme in schemes:
            scheme["id"] = str(scheme.pop("_id"))
        return schemes
