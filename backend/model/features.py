import pandas as pd

def create_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    df["txn_per_month"] = df["upi_transactions_count"] / (df["work_duration_months"] + 1)
    df["amount_per_txn"] = df["upi_avg_monthly_amount"] / (df["upi_transactions_count"] + 1)
    df["trust_signal"] = df["aadhaar_verified"] * df["location_consistency"]
    df["stability_score"] = df["work_duration_months"] * df["location_consistency"]

    return df