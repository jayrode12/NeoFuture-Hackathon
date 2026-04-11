from fastapi import FastAPI
from predict import predict_pipeline
from explain import explain_prediction

app = FastAPI()


@app.get("/")
def home():
    return {"message": "IWTS + Scheme Recommendation API"}


@app.post("/predict")
def predict(data: dict):
    result = predict_pipeline(data)
    return result


@app.post("/predict_with_explain")
def predict_explain(data: dict):
    result = predict_pipeline(data)
    explanation = explain_prediction(data)

    return {
        **result,
        "explanation": explanation
    }