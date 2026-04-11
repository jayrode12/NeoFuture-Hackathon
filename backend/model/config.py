import os

# Absolute path to the directory this file lives in.
# All model artefacts are co-located with this file.
MODEL_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH  = os.path.join(MODEL_DIR, "iwts_advanced_model.pkl")
SCHEME_PATH = os.path.join(MODEL_DIR, "schemes_dataset.json")
DATA_PATH   = os.path.join(MODEL_DIR, "iwts_synthetic_data.csv")
