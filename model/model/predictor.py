import numpy as np

def predict_iwts_score(data: dict):

    # DIRECT FORMULA (SAME AS TRAINING)
    score = (
        data.get("upi_transactions_count", 0) * 0.25 +
        (data.get("upi_avg_monthly_amount", 0) / 1000) * 0.15 +
        data.get("location_consistency", 0) * 25 +
        data.get("peer_attestations", 0) * 5 +
        data.get("customer_rating_avg", 0) * 2 +
        data.get("work_duration_months", 0) * 0.15 +
        data.get("aadhaar_verified", 0) * 10
    )

    iwts_score = max(0, min(100, score))

    # SCORE BAND
    if iwts_score >= 71:
        band = "HIGH"
        eligibility = "Full Credit Access"
    elif iwts_score >= 41:
        band = "MEDIUM"
        eligibility = "Basic Schemes"
    else:
        band = "LOW"
        eligibility = "Limited Access"

    # SIMPLE EXPLANATION
    explanation = {
        "UPI Activity": f"+{round(data.get('upi_transactions_count',0)*0.25,2)}",
        "Income Level": f"+{round((data.get('upi_avg_monthly_amount',0)/1000)*0.15,2)}",
        "Location Stability": f"+{round(data.get('location_consistency',0)*25,2)}"
    }

    # CONFIDENCE + RISK
    confidence = 1.0
    risk_flag = "LOW"

    # INSIGHT
    insight = "Score calculated using financial and behavioral signals"

    return {
        "iwts_score": round(iwts_score, 2),
        "score_band": band,
        "eligibility": eligibility,
        "confidence": confidence,
        "risk_flag": risk_flag,
        "insight": insight,
        "explanation": explanation
    }






# import joblib
# import shap
# import numpy as np
# import pandas as pd
# import os

# # -------------------------------
# # LOAD MODEL (SAFE PATH)
# # -------------------------------
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# MODEL_PATH = os.path.join(BASE_DIR, "iwts_model.pkl")

# model = joblib.load(MODEL_PATH)

# # -------------------------------
# # SHAP EXPLAINER
# # -------------------------------
# explainer = shap.TreeExplainer(model)

# # -------------------------------
# # FEATURE ORDER
# # -------------------------------
# FEATURE_ORDER = [
#     "upi_transactions_count",
#     "upi_avg_monthly_amount",
#     "location_consistency",
#     "peer_attestations",
#     "customer_rating_avg",
#     "work_duration_months",
#     "aadhaar_verified"
# ]

# # -------------------------------
# # DISPLAY NAMES
# # -------------------------------
# DISPLAY_NAMES = {
#     "upi_transactions_count": "UPI Activity",
#     "upi_avg_monthly_amount": "Income Level",
#     "location_consistency": "Location Stability",
#     "peer_attestations": "Peer Trust",
#     "customer_rating_avg": "Customer Rating",
#     "work_duration_months": "Work Experience",
#     "aadhaar_verified": "Identity Verified"
# }

# # -------------------------------
# # MAIN FUNCTION
# # -------------------------------
# def predict_iwts_score(data: dict):

#     # -------------------------------
#     # 🔥 APPLY SAME TRAINING LOGIC
#     # -------------------------------
#     features = [
#         data.get("upi_transactions_count", 0),
#         data.get("upi_avg_monthly_amount", 0),
#         data.get("location_consistency", 0),
#         data.get("peer_attestations", 0),
#         data.get("customer_rating_avg", 0),
#         data.get("work_duration_months", 0),
#         data.get("aadhaar_verified", 0)
#     ]

#     X = pd.DataFrame([{
#         "upi_transactions_count": data.get("upi_transactions_count", 0),
#         "upi_avg_monthly_amount": data.get("upi_avg_monthly_amount", 0),
#         "location_consistency": data.get("location_consistency", 0),
#         "peer_attestations": data.get("peer_attestations", 0),
#         "customer_rating_avg": data.get("customer_rating_avg", 0),
#         "work_duration_months": data.get("work_duration_months", 0),
#         "aadhaar_verified": data.get("aadhaar_verified", 0)
#     }])

#     # -------------------------------
#     # PREDICT SCORE
#     # -------------------------------
#     iwts_score = model.predict(X)[0]

#     # -------------------------------
#     # SCORE BAND
#     # -------------------------------
#     if iwts_score >= 71:
#         band = "HIGH"
#         eligibility = "Full Credit Access"
#     elif iwts_score >= 41:
#         band = "MEDIUM"
#         eligibility = "Basic Schemes"
#     else:
#         band = "LOW"
#         eligibility = "Limited Access"

#     # -------------------------------
#     # SHAP EXPLANATION
#     # -------------------------------
#     explanation = {}
#     sorted_explanation = []

#     try:
#         shap_values = explainer.shap_values(X)

#         explanation_raw = {}
#         for i, feature_name in enumerate(FEATURE_ORDER):
#             explanation_raw[feature_name] = float(shap_values[0][i])

#         sorted_explanation = sorted(
#             explanation_raw.items(), key=lambda x: abs(x[1]), reverse=True
#         )

#         for feature, value in sorted_explanation[:3]:
#             sign = "+" if value >= 0 else "-"
#             explanation[DISPLAY_NAMES[feature]] = f"{sign}{abs(round(value, 2))}"

#     except Exception:
#         explanation = {"message": "Explanation not available"}

#     # -------------------------------
#     # INSIGHT
#     # -------------------------------
#     try:
#         if sorted_explanation:
#             top_feature, top_value = sorted_explanation[0]

#             if top_value > 0:
#                 insight = f"Score boosted due to strong {DISPLAY_NAMES[top_feature]}"
#             else:
#                 insight = f"Score reduced due to weak {DISPLAY_NAMES[top_feature]}"
#         else:
#             insight = "Score based on multiple behavioral factors"

#     except Exception:
#         insight = "Score based on multiple behavioral factors"

#     # -------------------------------
#     # CONFIDENCE
#     # -------------------------------
#     filled_fields = sum(
#         [1 for f in FEATURE_ORDER if data.get(f) not in [None, 0]]
#     )
#     confidence = round(filled_fields / len(FEATURE_ORDER), 2)

#     # -------------------------------
#     # RISK FLAG
#     # -------------------------------
#     if confidence < 0.4:
#         risk_flag = "HIGH"
#     elif confidence < 0.7:
#         risk_flag = "MEDIUM"
#     else:
#         risk_flag = "LOW"

#     # -------------------------------
#     # FINAL OUTPUT
#     # -------------------------------
#     return {
#         "features": features,
#         "iwts_score": round(float(iwts_score), 2),
#         "score_band": band,
#         "eligibility": eligibility,
#         "confidence": confidence,
#         "risk_flag": risk_flag,
#         "insight": insight,
#         "explanation": explanation
#     }

