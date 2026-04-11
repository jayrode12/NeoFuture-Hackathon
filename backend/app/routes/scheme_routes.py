from fastapi import APIRouter, Depends, HTTPException
from app.services.scheme_service import SchemeService
from app.utils.auth import get_current_user

router = APIRouter()

@router.get("/schemes")
async def get_all_schemes():
    return await SchemeService.get_all_schemes()

@router.get("/schemes/matched")
async def get_matched_schemes(current_user = Depends(get_current_user)):
    from app.config.db import db
    user = await db.users.find_one({"email": current_user})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return await SchemeService.match_schemes(user["workerId"])
