from app.config.db import db
from app.models.application import ApplicationModel
from fastapi.encoders import jsonable_encoder
import datetime
import secrets

class ApplicationService:
    @staticmethod
    async def apply_for_scheme(workerId: str, schemeId: str):
        # Check if already applied
        existing = await db.applications.find_one({"workerId": workerId, "schemeId": schemeId})
        if existing:
            return {"status": "error", "message": "Already applied for this scheme"}
        
        application_id = f"a{secrets.token_hex(4)}"
        
        application = {
            "applicationId": application_id,
            "workerId": workerId,
            "schemeId": schemeId,
            "status": "pending",
            "appliedAt": datetime.datetime.now().isoformat()
        }
        
        await db.applications.insert_one(application)
        return {"status": "success", "message": "Application submitted", "applicationId": application_id}

    @staticmethod
    async def get_user_applications(workerId: str):
        cursor = db.applications.find({"workerId": workerId})
        applications = await cursor.to_list(length=100)
        
        for app in applications:
            app["id"] = str(app.pop("_id"))
            # Fetch scheme details
            scheme = await db.schemes.find_one({"schemeId": app["schemeId"]})
            if scheme:
                app["schemeName"] = scheme["name"]
                app["category"] = scheme["category"]
            
        return applications

    @staticmethod
    async def get_application_tracking(applicationId: str):
        application = await db.applications.find_one({"applicationId": applicationId})
        if not application:
            return None
        
        application["id"] = str(application.pop("_id"))
        
        # Mock timeline based on architecture doc
        timeline = [
            {"step": "Application Submitted", "timestamp": "Oct 12, 2023", "completed": True},
            {"step": "Partner Verification", "estimatedCompletion": "Oct 15, 2023", "completed": application["status"] == "approved"}
        ]
        
        return {
            "referenceId": f"IV-{applicationId.upper()}-II",
            "currentStatus": "Approved" if application["status"] == "approved" else "Partner Verification",
            "timeline": timeline
        }
