import json
import os

# -------------------------------
# CALCULATE SCORE (SAME FORMULA)
# -------------------------------
def calculate_score(data):
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

# -------------------------------
# MAIN ENGINE
# -------------------------------
def recommend_and_plan(data):

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    path = os.path.join(BASE_DIR, "database", "schemes_dataset.json")

    with open(path, "r") as f:
        schemes = json.load(f)

    current_score = calculate_score(data)

    # -------------------------------
    # SORT SCHEMES BY minScore
    # -------------------------------
    schemes = sorted(schemes, key=lambda x: x["minScore"])

    recommended = None
    next_best = None

    for scheme in schemes:
        if current_score >= scheme["minScore"]:
            recommended = scheme
        else:
            next_best = scheme
            break

    # -------------------------------
    # GAP CALCULATION
    # -------------------------------
    if next_best:
        gap = round(next_best["minScore"] - current_score, 2)
    else:
        gap = 0

    # -------------------------------
    # IMPROVEMENT PATH
    # -------------------------------
    improvements = []

    if data.get("upi_transactions_count", 0) < 60:
        improvements.append("Increase UPI transactions (+5 score approx)")

    if data.get("customer_rating_avg", 0) < 4.5:
        improvements.append("Improve rating to 4.5 (+4 score approx)")

    if data.get("peer_attestations", 0) < 5:
        improvements.append("Add peer attestations (+5 score approx)")

    if data.get("location_consistency", 0) < 0.95:
        improvements.append("Improve location consistency (+3 score approx)")

    # -------------------------------
    # FINAL OUTPUT
    # -------------------------------
    return {
        "current_score": current_score,

        "recommended_scheme": {
            "name": recommended["name"] if recommended else None,
            "status": "eligible"
        },

        "next_best": {
            "scheme": next_best["name"] if next_best else None,
            "required_score": next_best["minScore"] if next_best else None,
            "gap": gap
        },

        "fastest_path": improvements[:3]
    }