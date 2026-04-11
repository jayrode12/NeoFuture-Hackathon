from fastapi import APIRouter, Depends, HTTPException
from app.services.application_service import ApplicationService
from app.utils.auth import get_current_user
from typing import List

router = APIRouter()

@router.post("/applications/apply")
async def apply_scheme(schemeId: str, current_user = Depends(get_current_user)):
    # current_user is the email from JWT, we need to find the workerId
    from app.config.db import db
    user = await db.users.find_one({"email": current_user})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return await ApplicationService.apply_for_scheme(user["workerId"], schemeId)

@router.get("/applications/my")
async def get_my_applications(current_user = Depends(get_current_user)):
    from app.config.db import db
    user = await db.users.find_one({"email": current_user})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return await ApplicationService.get_user_applications(user["workerId"])

@router.get("/applications/track/{application_id}")
async def track_application(application_id: str):
    tracking = await ApplicationService.get_application_tracking(application_id)
    if not tracking:
        raise HTTPException(status_code=404, detail="Application not found")
    return tracking
