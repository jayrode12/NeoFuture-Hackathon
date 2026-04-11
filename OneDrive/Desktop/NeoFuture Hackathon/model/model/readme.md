# IWTS Model Integration Guide

## Files
- iwts_model.pkl → trained model
- predictor.py → main prediction function
- schema.py → input format

---

## 🔧 How to Use

```python
from model.predictor import predict_iwts_score

data = {
    "upi_transactions_count": 50,
    "upi_avg_monthly_amount": 12000,
    "location_consistency": 0.8,
    "peer_attestations": 2,
    "customer_rating_avg": 4.2,
    "work_duration_months": 24,
    "aadhaar_verified": 1
}

result = predict_iwts_score(data)