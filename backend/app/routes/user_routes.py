from fastapi import APIRouter, HTTPException, Body, Depends, Response
from app.schemas.user import UserCreate, UserResponse, UserLogin, StandardResponse, CheckUserRequest
from app.services.user_service import UserService
from app.utils.auth import get_current_user

router = APIRouter()

@router.post("/check", response_model=StandardResponse)
async def check_user_exists(check_data: CheckUserRequest = Body(...)):
    return await UserService.check_user_exists(check_data)

@router.post("/register", response_model=StandardResponse)
async def register_user(user: UserCreate = Body(...)):
    return await UserService.register_user(user)

@router.post("/login", response_model=StandardResponse)
async def login_user(login_data: UserLogin = Body(...), response: Response = None):
    return await UserService.login_user(login_data, response)

@router.post("/profile", response_model=StandardResponse)
async def update_profile(
    user_id: str, 
    profile_data: UserCreate = Body(...),
    current_user_email: str = Depends(get_current_user)
):
    # Additional check: ensure the user is updating their own profile
    # For now, we trust the user_id or we could look up the user by email
    return await UserService.update_profile(user_id, profile_data)
