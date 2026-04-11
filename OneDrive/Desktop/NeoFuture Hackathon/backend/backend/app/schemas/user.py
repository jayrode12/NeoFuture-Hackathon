from pydantic import BaseModel, Field, field_validator, EmailStr
from typing import Optional, Any, Dict, Literal
import re

# ────────────────────────────────────────────────
# Constants — Maharashtra is the ONLY allowed state
# ────────────────────────────────────────────────
MAHARASHTRA_STATE: Literal["Maharashtra"] = "Maharashtra"

MAHARASHTRA_DISTRICTS = [
    "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed",
    "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli",
    "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur",
    "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded",
    "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani",
    "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara",
    "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
]

PRIMARY_WORK_TYPES = [
    "Construction Worker",
    "Domestic Help",
    "Delivery Partner",
    "Street Vendor",
    "Agricultural Labour",
    "Plumber",
    "Electrician",
    "Carpenter",
    "Painter",
    "Driver / Transport",
    "Factory Worker",
    "Security Guard",
    "Tailor / Weaver",
    "Sanitation Worker",
    "Fisherman",
    "Other"
]


class UserCreate(BaseModel):
    fullName: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Full name of the worker (2–100 characters)"
    )
    phone: str = Field(
        ...,
        description="10-digit Indian mobile number (digits only, no country code)"
    )
    aadhaarNumber: str = Field(
        ...,
        description="12-digit Aadhaar number (digits only)"
    )
    state: Literal["Maharashtra"] = Field(
        default="Maharashtra",
        description="State is fixed to Maharashtra only"
    )
    district: str = Field(
        ...,
        description="District must be one of the 36 Maharashtra districts"
    )
    age: int = Field(
        ...,
        ge=18,
        le=120,
        description="Age of the worker (18-120)"
    )
    primaryWorkType: str = Field(
        ...,
        description="Occupation / primary work type"
    )
    monthlySalary: Optional[float] = Field(
        default=None,
        ge=0,
        le=10_000_000,
        description="Average monthly income in INR (₹0 – ₹1,00,00,000)"
    )
    email: EmailStr = Field(..., description="Valid email address")
    password: str = Field(
        ...,
        min_length=6,
        max_length=128,
        description="Password (minimum 6 characters)"
    )

    # ── Validators ──────────────────────────────
    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        cleaned = v.replace(" ", "").replace("-", "")
        if not re.fullmatch(r"[6-9]\d{9}", cleaned):
            raise ValueError(
                "Phone must be a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9."
            )
        return cleaned

    @field_validator("aadhaarNumber")
    @classmethod
    def validate_aadhaar(cls, v: str) -> str:
        cleaned = v.replace(" ", "")
        if not re.fullmatch(r"\d{12}", cleaned):
            raise ValueError("Aadhaar number must be exactly 12 digits.")
        return cleaned

    @field_validator("district")
    @classmethod
    def validate_district(cls, v: str) -> str:
        if v not in MAHARASHTRA_DISTRICTS:
            raise ValueError(
                f"Invalid district. Must be one of Maharashtra's 36 districts: "
                f"{', '.join(MAHARASHTRA_DISTRICTS)}"
            )
        return v

    @field_validator("primaryWorkType")
    @classmethod
    def validate_work_type(cls, v: str) -> str:
        if v not in PRIMARY_WORK_TYPES:
            raise ValueError(
                f"Invalid work type. Allowed values: {', '.join(PRIMARY_WORK_TYPES)}"
            )
        return v

    @field_validator("fullName")
    @classmethod
    def validate_full_name(cls, v: str) -> str:
        if not re.fullmatch(r"[A-Za-z\u0900-\u097F\s\.\-']+", v):
            raise ValueError("Full name must contain only letters, spaces, dots, hyphens, or apostrophes.")
        return v.strip()


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)


class CheckUserRequest(BaseModel):
    phone: Optional[str] = None
    aadhaarNumber: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    fullName: str
    age: int
    phone: str
    aadhaarNumber: str
    state: str
    district: str
    primaryWorkType: str
    monthlySalary: Optional[float] = None
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