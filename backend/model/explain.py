import shap
import joblib
import pandas as pd

from features import create_features
from config import MODEL_PATH

model = joblib.load(MODEL_PATH)
explainer = shap.Explainer(model)


def explain_prediction(input_data: dict):
    df = pd.DataFrame([input_data])
    df = create_features(df)

    shap_values = explainer(df)

    explanation = dict(zip(df.columns, shap_values.values[0]))

    return explanation