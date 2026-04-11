"""
train.py — Synthetic data generation and IWTS model training.

Run once before starting the backend:
    cd backend/backend/model
    python train.py

Produces:
    iwts_advanced_model.pkl   — GradientBoostingRegressor
    iwts_synthetic_data.csv   — 2000-row synthetic dataset (used for exact-match fallback)
"""

import os
import sys
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import joblib

# Ensure imports from this directory work regardless of cwd
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from config import MODEL_PATH, DATA_PATH


# ──────────────────────────────────────────────
# Feature engineering (must stay in sync with features.py)
# ──────────────────────────────────────────────
def _engineer(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["txn_per_month"]   = df["upi_transactions_count"] / (df["work_duration_months"] + 1)
    df["amount_per_txn"]  = df["upi_avg_monthly_amount"] / (df["upi_transactions_count"] + 1)
    df["trust_signal"]    = df["aadhaar_verified"] * df["location_consistency"]
    df["stability_score"] = df["work_duration_months"] * df["location_consistency"]
    return df


# Column order used at training time — prediction must match this exactly
FEATURE_COLS = [
    "upi_transactions_count",
    "upi_avg_monthly_amount",
    "location_consistency",
    "peer_attestations",
    "customer_rating_avg",
    "work_duration_months",
    "aadhaar_verified",
    "txn_per_month",
    "amount_per_txn",
    "trust_signal",
    "stability_score",
]


def generate_synthetic_data(n: int = 2000, seed: int = 42) -> pd.DataFrame:
    rng = np.random.default_rng(seed)

    raw = {
        "upi_transactions_count": rng.integers(1, 200, n).astype(float),
        "upi_avg_monthly_amount": rng.uniform(500, 50_000, n),
        "location_consistency":   rng.uniform(0.3, 1.0, n),
        "peer_attestations":      rng.integers(0, 20, n).astype(float),
        "customer_rating_avg":    rng.uniform(1.0, 5.0, n),
        "work_duration_months":   rng.integers(1, 120, n).astype(float),
        "aadhaar_verified":       rng.choice([0.0, 1.0], n, p=[0.2, 0.8]),
    }
    df = pd.DataFrame(raw)

    # Deterministic IWTS score (0–100) before noise
    score = (
        np.clip(df["upi_transactions_count"] / 200, 0, 1) * 25
        + np.clip(df["upi_avg_monthly_amount"] / 10_000, 0, 1) * 20
        + df["location_consistency"] * 15
        + np.clip(df["peer_attestations"] / 10, 0, 1) * 15
        + (df["customer_rating_avg"] / 5) * 10
        + np.clip(df["work_duration_months"] / 36, 0, 1) * 10
        + df["aadhaar_verified"] * 5
    )

    # Small Gaussian noise so the model has something non-trivial to learn
    noise = rng.normal(0, 2, n)
    df["iwts_score"] = np.clip(score + noise, 0, 100).round(2)

    return df


def train():
    print("Generating synthetic data …")
    df = generate_synthetic_data(2000)

    df_feat = _engineer(df)
    X = df_feat[FEATURE_COLS]
    y = df_feat["iwts_score"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training GradientBoostingRegressor …")
    model = GradientBoostingRegressor(
        n_estimators=200,
        max_depth=4,
        learning_rate=0.1,
        subsample=0.8,
        random_state=42,
    )
    model.fit(X_train, y_train)

    mae = mean_absolute_error(y_test, model.predict(X_test))
    print(f"Test MAE: {mae:.3f}")

    # Save model
    joblib.dump(model, MODEL_PATH)
    print(f"Model saved → {MODEL_PATH}")

    # Save raw data (no engineered columns) for exact-match fallback
    raw_cols = [
        "upi_transactions_count", "upi_avg_monthly_amount", "location_consistency",
        "peer_attestations", "customer_rating_avg", "work_duration_months",
        "aadhaar_verified", "iwts_score",
    ]
    df[raw_cols].to_csv(DATA_PATH, index=False)
    print(f"Synthetic data saved → {DATA_PATH}")


if __name__ == "__main__":
    train()
