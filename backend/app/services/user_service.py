from fastapi import HTTPException, Response
from app.config.db import db
from app.models.user import UserModel
from app.schemas.user import UserCreate, UserLogin, UserResponse, StandardResponse, CheckUserRequest
from app.utils.security import hash_password, verify_password, create_access_token
from fastapi.encoders import jsonable_encoder
from bson import ObjectId

class UserService:
    @staticmethod
    async def check_user_exists(check_data: CheckUserRequest):
        query = {}
        if check_data.phone:
            query["phone"] = check_data.phone
        elif check_data.aadhaarNumber:
            query["aadhaarNumber"] = check_data.aadhaarNumber
        else:
            return StandardResponse(status="error", message="Provide either phone or aadhaarNumber")

        existing_user = await db.users.find_one(query)
        if existing_user:
            return StandardResponse(status="success", message="User exists", data={"exists": True})
        return StandardResponse(status="success", message="User does not exist", data={"exists": False})

    @staticmethod
    async def register_user(user_data: UserCreate):
        existing_user = await db.users.find_one({"email": user_data.email})
        if existing_user:
            return StandardResponse(status="error", message="Email already registered")
        
        user_dict = jsonable_encoder(user_data)
        user_dict["password"] = hash_password(user_data.password)
        
        new_user = await db.users.insert_one(user_dict)
        created_user = await db.users.find_one({"_id": new_user.inserted_id})
        
        access_token = create_access_token(data={"sub": user_data.email})
        
        user_data_copy = created_user.copy()
        user_id = str(user_data_copy.pop("_id"))
        user_data_copy.pop("password", None)  # never expose hashed password
        user_res = UserResponse(id=user_id, **user_data_copy)
        
        return StandardResponse(
            status="success", 
            message="User registered successfully", 
            data={"user": user_res, "access_token": access_token}
        )

    @staticmethod
    async def login_user(login_data: UserLogin, response: Response):
        user = await db.users.find_one({"email": login_data.email})
        if not user or not verify_password(login_data.password, user["password"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        access_token = create_access_token(data={"sub": login_data.email})
        
        # Set cookie as well for session management if requested
        if response:
            response.set_cookie(key="access_token", value=access_token, httponly=True)
        
        user_data_copy = user.copy()
        user_id = str(user_data_copy.pop("_id"))
        user_data_copy.pop("password", None)  # never expose hashed password
        user_res = UserResponse(id=user_id, **user_data_copy)
        
        return StandardResponse(
            status="success", 
            message="Login successful", 
            data={"user": user_res, "access_token": access_token}
        )

    @staticmethod
    async def update_profile(user_id: str, profile_data: UserCreate):
        user = await db.users.find_one({"_id": ObjectId(user_id) if ObjectId.is_valid(user_id) else user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        profile_dict = jsonable_encoder(profile_data)
        profile_dict["password"] = hash_password(profile_data.password)
        
        await db.users.update_one(
            {"_id": user["_id"]}, {"$set": profile_dict}
        )
        
        updated_user = await db.users.find_one({"_id": user["_id"]})
        user_data_copy = updated_user.copy()
        user_id = str(user_data_copy.pop("_id"))
        user_data_copy.pop("password", None)  # never expose hashed password
        user_res = UserResponse(id=user_id, **user_data_copy)
        
        return StandardResponse(
            status="success", 
            message="Profile updated successfully", 
            data=user_res
        )

