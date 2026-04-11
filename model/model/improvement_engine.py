def generate_improvements(data, current_score):

    suggestions = []

    # -------------------------------
    # RULE-BASED IMPROVEMENTS
    # -------------------------------

    if data.get("upi_transactions_count", 0) < 50:
        suggestions.append("Increase UPI transactions to improve financial activity")

    if data.get("upi_avg_monthly_amount", 0) < 10000:
        suggestions.append("Increase monthly income or transaction amount")

    if data.get("customer_rating_avg", 0) < 4:
        suggestions.append("Improve customer rating above 4.0")

    if data.get("peer_attestations", 0) < 3:
        suggestions.append("Get more peer attestations to build trust")

    if data.get("location_consistency", 0) < 0.8:
        suggestions.append("Maintain consistent working location")

    if data.get("work_duration_months", 0) < 24:
        suggestions.append("Increase work experience duration")

    if data.get("aadhaar_verified", 0) == 0:
        suggestions.append("Complete Aadhaar verification")

    # -------------------------------
    # NEXT LEVEL TARGET
    # -------------------------------
    if current_score < 70:
        gap = round(70 - current_score, 2)
        next_target = {
            "target_score": 70,
            "message": f"You are {gap} points away from HIGH trust level"
        }
    elif current_score < 40:
        gap = round(40 - current_score, 2)
        next_target = {
            "target_score": 40,
            "message": f"You are {gap} points away from MEDIUM trust level"
        }
    else:
        next_target = {
            "target_score": 100,
            "message": "You already have high trust score"
        }

    return {
        "suggestions": suggestions,
        "next_target": next_target
    }