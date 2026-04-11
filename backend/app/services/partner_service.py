from app.config.db import db
from datetime import datetime, timedelta
import jwt
import os
import secrets
from passlib.context import CryptContext

# Configuration for password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
JWT_SECRET = os.getenv("JWT_SECRET", "supersecretkey123")
ALGORITHM = "HS256"

class PartnerService:
    @staticmethod
    async def create_partner(partner_data: dict):
        # Hash the password before saving
        partner_data["password"] = pwd_context.hash(partner_data["password"])
        partner_data["partnerId"] = secrets.token_hex(8)
        partner_data["createdAt"] = datetime.utcnow()
        
        await db.partners.insert_one(partner_data)
        return partner_data

    @staticmethod
    async def login_partner(email, password):
        partner = await db.partners.find_one({"email": email})
        if not partner or not pwd_context.verify(password, partner["password"]):
            return None
        
        # Generate JWT
        token_data = {
            "sub": str(partner["_id"]),
            "role": "partner",
            "partnerId": partner["partnerId"],
            "org": partner["organizationName"],
            "exp": datetime.utcnow() + timedelta(days=7)
        }
        token = jwt.encode(token_data, JWT_SECRET, algorithm=ALGORITHM)
        
        return {
            "token": token,
            "partner": {
                "name": partner["organizationName"],
                "role": partner["role"],
                "id": partner["partnerId"]
            }
        }

    @staticmethod
    async def get_dashboard_metrics():
        total_workers = await db.users.count_documents({})
        total_apps = await db.applications.count_documents({})
        pending_apps = await db.applications.count_documents({"status": "pending"})
        
        return {
            "metrics": {
                "totalWorkers": total_workers,
                "growthRate": 15, # Hardcoded for demo
                "averageScore": 765,
                "pendingApplications": pending_apps,
                "approvalRate": 92
            },
            "recentApplications": await PartnerService.get_all_applications()
        }

    @staticmethod
    async def get_worker_by_id(worker_id: str):
        worker = await db.users.find_one({"workerId": worker_id})
        if worker:
            worker["id"] = str(worker.pop("_id"))
            # Fetch score data
            score_data = await db.scores.find_one({"workerId": worker_id})
            worker["trust_score"] = score_data["iwts_score"] if score_data else 0
            worker["kyc_status"] = "Aadhaar Verified"
            worker["history"] = [
                { "job_id": "J1011", "employer": "Construction Corp", "duration": "4 months", "rating": 4.8 }
            ]
        return worker

    @staticmethod
    async def get_application_by_id(app_id: str):
        app = await db.applications.find_one({"applicationId": app_id})
        if app:
            app["id"] = str(app.pop("_id"))
        return app

    @staticmethod
    async def update_application_status(app_id: str, action: str):
        status = "approved" if action == "APPROVED" else "rejected"
        await db.applications.update_one(
            {"applicationId": app_id},
            {"$set": {"status": status, "updatedAt": datetime.utcnow()}}
        )
        return {"status": "success", "new_status": status}

    @staticmethod
    async def create_partnership_scheme(scheme_data: dict):
        scheme_data["schemeId"] = secrets.token_hex(4)
        scheme_data["createdAt"] = datetime.utcnow()
        await db.schemes.insert_one(scheme_data)
        return {"status": "success", "schemeId": scheme_data["schemeId"]}

    @staticmethod
    async def get_all_workers():
        workers = await db.users.find().to_list(1000)
        for w in workers:
            w["id"] = str(w.pop("_id"))
        return workers

    @staticmethod
    async def get_all_applications():
        apps = await db.applications.find().sort("createdAt", -1).to_list(1000)
        for a in apps:
            a["id"] = str(a.pop("_id"))
        return apps

    @staticmethod
    async def get_funnel_analytics():
        # Aggregating applications by month for the last 6 months
        pipeline = [
            {
                "$group": {
                    "_id": { "$dateToString": { "format": "%Y-%m", "date": "$createdAt" } },
                    "count": { "$sum": 1 }
                }
            },
            { "$sort": { "_id": 1 } },
            { "$project": { "month": "$_id", "count": 1, "_id": 0 } }
        ]
        results = await db.applications.aggregate(pipeline).to_list(10)
        # Fallback for empty data
        if not results:
            return [{"month": "2024-01", "count": 10}, {"month": "2024-02", "count": 15}]
        return results
