import joblib
from pathlib import Path


# Find the main project folder
BASE_DIR = Path(__file__).resolve().parents[3]

# Location of the trained ML model
MODEL_PATH = BASE_DIR / "ML" / "crowdsense_xgboost_pipeline.pkl"

# Load the trained model
model = joblib.load(MODEL_PATH)

print("CrowdSense AI ML model loaded successfully!")

def predict_crowd(input_data):
    prediction = model.predict(input_data)
    return prediction[0]

def calculate_risk(predicted_crowd, venue_capacity):
    utilization_pct = (predicted_crowd / venue_capacity) * 100

    if utilization_pct < 60.0:
        risk_level = "Low"
        alert_color = "Green"
        action = "Normal monitoring. Standard entry/exit flow."

    elif utilization_pct < 80.0:
        risk_level = "Moderate"
        alert_color = "Yellow"
        action = "Deploy traffic personnel; monitor queue buildup."

    elif utilization_pct <= 100.0:
        risk_level = "High"
        alert_color = "Orange"
        action = "Enforce crowd diversion; restrict incoming entry gates."

    else:
        risk_level = "Critical"
        alert_color = "Red"
        action = "Immediate action: open emergency exits, issue diversion alerts."

    return {
        "predicted_crowd": round(predicted_crowd),
        "venue_capacity": venue_capacity,
        "capacity_utilization_pct": round(float(utilization_pct), 2),
        "risk_level": risk_level,
        "alert_color": alert_color,
        "recommended_action": action
    }