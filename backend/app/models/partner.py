from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class PartnerModel(BaseModel):
    partnerId: str
    organizationName: str
    email: EmailStr
    role: str  # 'NGO', 'Bank', 'Government'
    registrationId: Optional[str] = None
    password: str  # Hashed
    verified: bool = False
    createdAt: datetime = datetime.utcnow()

class PartnerLoginRequest(BaseModel):
    email: EmailStr
    password: str
