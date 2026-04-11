from predictor import predict_iwts_score
from schemes_function import get_eligible_schemes
from improvement_engine import generate_improvements
from simulator import simulate_score_improvements
from goal_engine import goal_based_schemes
from recommendation_engine import recommend_and_plan

sample = {
    "upi_transactions_count": 24,
    "upi_avg_monthly_amount": 13808,
    "location_consistency": 0.84,
    "peer_attestations": 3,
    "customer_rating_avg": 2.2,
    "work_duration_months": 36,
    "aadhaar_verified": 1
}

result = predict_iwts_score(sample)
schemes = get_eligible_schemes(result["iwts_score"])
improvements = generate_improvements(sample, result["iwts_score"])
simulation = simulate_score_improvements(sample)
goal_result = goal_based_schemes("loan", result["iwts_score"])
plan = recommend_and_plan(sample)

# Final output
print({
    "model_result": result,
    "eligible_schemes": schemes,
    "improvements": improvements,
    "simulation": simulation,
    "goal_based_schemes": goal_result,
    "recommendation_plan": plan
})