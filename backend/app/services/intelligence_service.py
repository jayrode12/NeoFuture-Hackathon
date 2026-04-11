import json
import os
from app.config.db import db

class IntelligenceService:
    @staticmethod
    def calculate_current_score(data):
        # Formula from model/predictor.py
        score = (
            data.get("upi_transactions_count", 0) * 0.25 +
            (data.get("upi_avg_monthly_amount", 0) / 1000) * 0.15 +
            data.get("location_consistency", 0) * 25 +
            data.get("peer_attestations", 0) * 5 +
            data.get("customer_rating_avg", 0) * 2 +
            data.get("work_duration_months", 0) * 0.15 +
            data.get("aadhaar_verified", 0) * 10
        )
        return round(max(0, min(100, score)), 2)

    @staticmethod
    async def get_scheme_insights(worker_id: str, current_scheme_id: str):
        # 1. Fetch user data
        v_data = await db.verification_data.find_one({"workerId": worker_id})
        if not v_data:
            v_data = {}

        current_score = IntelligenceService.calculate_current_score(v_data)

        # 2. Fetch all schemes to find "Next Best"
        cursor = db.schemes.find({})
        schemes = await cursor.to_list(length=100)
        schemes = sorted(schemes, key=lambda x: x.get("minScore", 0))

        next_best = None
        for scheme in schemes:
            if scheme.get("minScore", 0) > current_score:
                next_best = scheme
                break

        # 3. Improvement path logic from model/recommendation_engine.py
        improvements = []
        if v_data.get("upi_transactions_count", 0) < 60:
            improvements.append({"action": "Increase UPI transactions", "impact": "+5 score approx"})
        if v_data.get("customer_rating_avg", 0) < 4.5:
            improvements.append({"action": "Improve customer rating to 4.5", "impact": "+4 score approx"})
        if v_data.get("peer_attestations", 0) < 5:
            improvements.append({"action": "Add peer attestations", "impact": "+5 score approx"})
        if v_data.get("location_consistency", 0) < 0.95:
            improvements.append({"action": "Improve location consistency", "impact": "+3 score approx"})

        # 4. Gap calculation
        gap = 0
        if next_best:
            gap = round(next_best["minScore"] - current_score, 2)

        return {
            "current_score": current_score,
            "next_best": {
                "name": next_best["name"] if next_best else None,
                "required_score": next_best["minScore"] if next_best else None,
                "gap": gap
            },
            "improvement_path": improvements[:3],
            "insights": [
                f"You are currently at {current_score}% trust score.",
                f"You need {gap} more points to unlock {next_best['name']}." if next_best else "You have unlocked the highest tier schemes!"
            ]
        }
