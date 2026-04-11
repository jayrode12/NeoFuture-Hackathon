def simulate_score_improvements(data):

    simulations = []

    # Helper function (same formula)
    def calculate_score(d):
        score = (
            d.get("upi_transactions_count", 0) * 0.25 +
            (d.get("upi_avg_monthly_amount", 0) / 1000) * 0.15 +
            d.get("location_consistency", 0) * 25 +
            d.get("peer_attestations", 0) * 5 +
            d.get("customer_rating_avg", 0) * 2 +
            d.get("work_duration_months", 0) * 0.15 +
            d.get("aadhaar_verified", 0) * 10
        )
        return round(max(0, min(100, score)), 2)

    # Current score
    current_score = calculate_score(data)

    # -------------------------------
    # SIMULATION CASES
    # -------------------------------

    # 1. Improve UPI transactions
    new_data = data.copy()
    new_data["upi_transactions_count"] = max(data.get("upi_transactions_count", 0), 60)

    simulations.append({
        "action": "Increase UPI transactions",
        "new_score": calculate_score(new_data),
        "impact": round(calculate_score(new_data) - current_score, 2)
    })

    # 2. Improve rating
    new_data = data.copy()
    new_data["customer_rating_avg"] = max(data.get("customer_rating_avg", 0), 4.5)

    simulations.append({
        "action": "Improve customer rating to 4.5",
        "new_score": calculate_score(new_data),
        "impact": round(calculate_score(new_data) - current_score, 2)
    })

    # 3. Increase peer attestations
    new_data = data.copy()
    new_data["peer_attestations"] = max(data.get("peer_attestations", 0), 5)

    simulations.append({
        "action": "Get more peer attestations",
        "new_score": calculate_score(new_data),
        "impact": round(calculate_score(new_data) - current_score, 2)
    })

    # 4. Improve location consistency
    new_data = data.copy()
    new_data["location_consistency"] = max(data.get("location_consistency", 0), 0.95)

    simulations.append({
        "action": "Improve location consistency",
        "new_score": calculate_score(new_data),
        "impact": round(calculate_score(new_data) - current_score, 2)
    })

    # Sort by best improvement
    simulations = sorted(simulations, key=lambda x: x["impact"], reverse=True)

    return {
        "current_score": current_score,
        "best_improvements": simulations[:3]
    }