import os
import math
import pandas as pd
from datetime import datetime
from typing import Dict, Any

from app.schemas.prediction import PredictionRequest
from app.services.location_service import get_location_context
from app.services.weather_service import get_current_weather
from app.services.holiday_service import is_public_holiday

def build_features(request: PredictionRequest) -> pd.DataFrame:
    # 1. Fetch location, venues, historical data
    context = get_location_context(request.location_id)
    if not context or not context["location"]:
        raise ValueError(f"Location {request.location_id} not found.")

    location = context["location"]
    venues = context["venues"]
    historical_data = context["historical_data"]

    # Venue Selection
    if request.venue_id:
        selected_venues = [v for v in venues if v["venue_id"] == request.venue_id]
    else:
        selected_venues = venues

    if not selected_venues:
        raise ValueError("No valid venues found for this location.")

    # Historical Selection
    venue_ids = {v["venue_id"] for v in selected_venues}
    relevant_history = [h for h in historical_data if h["venue_id"] in venue_ids]

    # Aggregating Venue Features
    venue_capacity = sum(v["venue_capacity"] for v in selected_venues)
    venue_area_km2 = sum(v["venue_area_km2"] for v in selected_venues)
    
    # Just take the first venue's categorical attributes to remain deterministic
    selected_venues.sort(key=lambda v: v["venue_id"])
    special_features = selected_venues[0]["special_features"]
    transportation_type = selected_venues[0]["transportation_type"]

    # Aggregating Historical Data
    if not relevant_history:
        raise ValueError("No historical data found for the selected venue(s).")
    
    avg_crowd = sum(h["historical_average_crowd"] for h in relevant_history) / len(relevant_history)
    peak_crowd = max(h["historical_peak_crowd"] for h in relevant_history)
    incidents = sum(h["historical_incident_count"] for h in relevant_history)
    overcrowding = any(h["previous_overcrowding"] for h in relevant_history)
    
    req_dt = request.requested_datetime or datetime.now()
    req_hour = req_dt.hour
    
    is_peak = 0
    for h in relevant_history:
        h_time = h["time"]
        if h_time:
            h_hour = int(h_time.split(":")[0])
            if h_hour == req_hour and h.get("peak_hour") == 1:
                is_peak = 1
                break

    # 3. Weather Data
    api_key = os.getenv("OPENWEATHER_API_KEY")
    if not api_key:
        raise ValueError("OpenWeather API key not configured.")
    
    weather = get_current_weather(location["latitude"], location["longitude"], api_key)

    # 4. Holiday
    holiday = is_public_holiday(weather["country"], req_dt.date())

    # 5. Time features
    decimal_hour = req_hour + req_dt.minute / 60.0
    hour_sin = math.sin(2 * math.pi * decimal_hour / 24.0)
    hour_cos = math.cos(2 * math.pi * decimal_hour / 24.0)
    
    features = {
        "City": location["city"],
        "Place": location["place"],
        "Latitude": location["latitude"],
        "Longitude": location["longitude"],
        "Venue_Capacity": venue_capacity,
        "Venue_Area_km2": venue_area_km2,
        "Weather": weather["weather"],
        "Temperature_C": weather["temperature"],
        "Humidity_pct": weather["humidity"],
        "Rainfall_mm": weather["rainfall"],
        "Wind_Speed_kmh": weather["wind_speed"],
        "Day_of_Week": req_dt.strftime('%A'),
        "Holiday": holiday,
        "Event": request.event,
        "Event_Type": request.event_type,
        "Week_of_Year": req_dt.isocalendar()[1],
        "Special_Features": special_features,
        "Transportation_Type": transportation_type,
        "Peak_Hour": is_peak,
        "Historical_Average_Crowd": avg_crowd,
        "Historical_Peak_Crowd": peak_crowd,
        "Historical_Incident_Count": incidents,
        "Previous_Overcrowding": 1 if overcrowding else 0,
        "Month": req_dt.month,
        "Day": req_dt.day,
        "hour_sin": hour_sin,
        "hour_cos": hour_cos
    }
    
    feature_names = [
        "City", "Place", "Latitude", "Longitude", "Venue_Capacity", "Venue_Area_km2",
        "Weather", "Temperature_C", "Humidity_pct", "Rainfall_mm", "Wind_Speed_kmh",
        "Day_of_Week", "Holiday", "Event", "Event_Type", "Week_of_Year",
        "Special_Features", "Transportation_Type", "Peak_Hour",
        "Historical_Average_Crowd", "Historical_Peak_Crowd",
        "Historical_Incident_Count", "Previous_Overcrowding", "Month", "Day",
        "hour_sin", "hour_cos"
    ]
    
    return pd.DataFrame([features], columns=feature_names), venue_capacity
