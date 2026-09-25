import joblib
from pathlib import Path

# Re-export calculate_risk so existing callers (test_model.py, predict.py)
# continue to work without changing their import lines.
from app.services.risk_service import calculate_risk  # noqa: F401


# Find the main project folder
BASE_DIR = Path(__file__).resolve().parents[3]

# Location of the trained ML model
MODEL_PATH = BASE_DIR / "ML" / "crowdsense_xgboost_pipeline.pkl"

# Load the trained model
model = joblib.load(MODEL_PATH)

print("CrowdSense AI ML model loaded successfully!")


def predict_crowd(input_data):
    """Run the XGBoost pipeline and return the predicted crowd count."""
    prediction = model.predict(input_data)
    return prediction[0]