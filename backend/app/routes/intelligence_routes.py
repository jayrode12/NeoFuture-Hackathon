from fastapi import APIRouter, Depends, HTTPException
from app.services.intelligence_service import IntelligenceService
from app.utils.auth import get_current_user

router = APIRouter()

@router.get("/intelligence/insights/{schemeId}")
async def get_scheme_insights(schemeId: str, current_user = Depends(get_current_user)):
    from app.config.db import db
    user = await db.users.find_one({"email": current_user})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return await IntelligenceService.get_scheme_insights(user["workerId"], schemeId)
