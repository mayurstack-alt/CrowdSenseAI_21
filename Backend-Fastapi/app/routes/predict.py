from fastapi import APIRouter
import pandas as pd
import numpy as np
import os
from datetime import datetime

from app.schemas.prediction import PredictionRequest
from app.services.ml_service import model, calculate_risk
from app.services.weather_service import get_current_weather


router = APIRouter()


@router.post("/predict")
def predict_crowd(request: PredictionRequest):
    api_key = os.getenv("OPENWEATHER_API_KEY")

    weather = get_current_weather(
        request.Latitude,
        request.Longitude,
        api_key
    )

    now = datetime.now()

    decimal_hour = now.hour + (now.minute / 60.0)
    hour_sin = np.sin(2 * np.pi * decimal_hour / 24.0)
    hour_cos = np.cos(2 * np.pi * decimal_hour / 24.0)

    # Convert request data into a dictionary
    input_data = request.model_dump()

    

    input_data["Day_of_Week"] = now.strftime("%A")
    input_data["Month"] = now.month
    input_data["Day"] = now.day
    input_data["Week_of_Year"] = now.isocalendar().week
    input_data["hour_sin"] = hour_sin
    input_data["hour_cos"] = hour_cos
   

    input_data["Weather"] = weather["weather"]
    input_data["Temperature_C"] = weather["temperature"]
    input_data["Humidity_pct"] = weather["humidity"]
    input_data["Rainfall_mm"] = weather["rainfall"]
    input_data["Wind_Speed_kmh"] = weather["wind_speed"]

    # Convert dictionary into DataFrame
    input_df = pd.DataFrame([input_data])

    # Predict crowd count
    prediction = model.predict(input_df)[0]

    # Get venue capacity
    venue_capacity = request.Venue_Capacity

    # Calculate risk
    risk_result = calculate_risk(
        prediction,
        venue_capacity
    )

    return risk_result