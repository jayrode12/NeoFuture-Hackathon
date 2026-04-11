from fastapi import HTTPException, Response
from app.config.db import db
from app.models.user import UserModel
from app.schemas.user import UserCreate, UserLogin, UserResponse, StandardResponse
from app.utils.security import hash_password, verify_password, create_access_token
from fastapi.encoders import jsonable_encoder
from bson import ObjectId
import datetime
import secrets

class UserService:
    @staticmethod
    async def register_user(user_data: UserCreate):
        existing_user = await db.users.find_one({"email": user_data.email})
        if existing_user:
            return StandardResponse(status="error", message="Email already registered")
        
        user_dict = jsonable_encoder(user_data)
        if not user_dict.get("workerId"):
            user_dict["workerId"] = f"w{secrets.token_hex(4)}"
        
        user_dict["createdAt"] = datetime.datetime.now().isoformat()
        user_dict["password"] = hash_password(user_data.password)
        
        new_user = await db.users.insert_one(user_dict)
        created_user = await db.users.find_one({"_id": new_user.inserted_id})
        
        access_token = create_access_token(data={"sub": user_data.email})
        
        user_data_copy = created_user.copy()
        user_id = str(user_data_copy.pop("_id"))
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
        user_res = UserResponse(id=user_id, **user_data_copy)
        
        return StandardResponse(
            status="success", 
            message="Login successful", 
            data={"user": user_res, "access_token": access_token}
        )

    @staticmethod
    async def save_verification_data(email: str, data: dict):
        user = await db.users.find_one({"email": email})
        if not user:
            return StandardResponse(status="error", message="User not found")
        
        workerId = user["workerId"]
        data["workerId"] = workerId
        
        # Save to verification_data collection (Collection 2 in dataset_requirements.json)
        await db.verification_data.update_one(
            {"workerId": workerId},
            {"$set": data},
            upsert=True
        )
        
        # Mock score calculation after receiving data
        mock_score = {
            "workerId": workerId,
            "iwts_score": 75,
            "score_band": "HIGH",
            "eligibility": "Full Credit Access",
            "breakdown": {"upi": 25, "location": 20, "peer": 15, "rating": 10, "duration": 5},
            "calculatedAt": datetime.datetime.now().isoformat()
        }
        await db.scores.update_one({"workerId": workerId}, {"$set": mock_score}, upsert=True)
        
        return StandardResponse(
            status="success", 
            message="Verification data saved and score updated",
            data={"workerId": workerId, "score": 75}
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
        user_res = UserResponse(id=user_id, **user_data_copy)
        
        return StandardResponse(
            status="success", 
            message="Profile updated successfully", 
            data=user_res
        )

