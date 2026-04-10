from pydantic import BaseModel
from typing import Optional, Any, Dict
from pydantic import EmailStr, Field

class UserCreate(BaseModel):
    fullName: str
    phone: str
    aadhaarNumber: str
    state: str
    district: str
    primaryWorkType: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    fullName: str
    phone: str
    aadhaarNumber: str
    state: str
    district: str
    primaryWorkType: str
    email: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class StandardResponse(BaseModel):
    status: str
    message: str
    data: Optional[Any] = None

    model_config = {
        "from_attributes": True
    }
