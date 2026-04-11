from fastapi import APIRouter, HTTPException, Depends
from app.services.partner_service import PartnerService
from app.models.partner import PartnerLoginRequest
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class ApplicationActionRequest(BaseModel):
    applicationId: str
    action: str # 'APPROVED' or 'REJECTED'
    approverId: str

class PartnerRegisterRequest(BaseModel):
    organizationName: str
    email: str
    password: str
    registrationId: str
    role: str = "Partner Organization"

class SchemeCreateRequest(BaseModel):
    name: str
    description: str
    provider: str
    category: str
    eligibility_criteria: dict
    benefits: list

@router.post("/register")
async def partner_register(request: PartnerRegisterRequest):
    try:
        result = await PartnerService.create_partner(request.dict())
        return {"status": "success", "message": "Partner registered successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
async def partner_login(request: PartnerLoginRequest):
    result = await PartnerService.login_partner(request.email, request.password)
    if not result:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return result

@router.get("/metrics")
async def get_partner_metrics():
    return await PartnerService.get_dashboard_metrics()

@router.get("/workers")
async def get_workers():
    return await PartnerService.get_all_workers()

@router.get("/workers/{worker_id}")
async def get_worker_detail(worker_id: str):
    worker = await PartnerService.get_worker_by_id(worker_id)
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    return worker

@router.get("/applications")
async def get_applications():
    return await PartnerService.get_all_applications()

@router.get("/applications/{application_id}")
async def get_application_detail(application_id: str):
    app = await PartnerService.get_application_by_id(application_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app

@router.get("/analytics/funnel")
async def get_analytics_funnel():
    return await PartnerService.get_funnel_analytics()

@router.post("/applications/action")
async def application_action(request: ApplicationActionRequest):
    return await PartnerService.update_application_status(request.applicationId, request.action)

@router.post("/schemes")
async def create_scheme(request: SchemeCreateRequest):
    return await PartnerService.create_partnership_scheme(request.dict())

@router.post("/seed")
async def seed_partner():
    test_partner = {
        "organizationName": "Govt of India - Schemes Dept",
        "email": "admin@partner.gov.in",
        "password": "Password123",
        "role": "Government"
    }
    return await PartnerService.create_partner(test_partner)
