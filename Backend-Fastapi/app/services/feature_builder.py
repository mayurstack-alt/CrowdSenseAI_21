import math
import os
from datetime import datetime

import pandas as pd

from app.schemas.prediction import PredictionRequest
from app.services.holiday_service import is_public_holiday
from app.services.location_service import get_location_context
from app.services.weather_service import get_current_weather

FEATURE_NAMES = [
    "City", "Place", "Latitude", "Longitude", "Venue_Capacity", "Venue_Area_km2",
    "Weather", "Temperature_C", "Humidity_pct", "Rainfall_mm", "Wind_Speed_kmh",
    "Day_of_Week", "Holiday", "Event", "Event_Type", "Week_of_Year",
    "Special_Features", "Transportation_Type", "Peak_Hour",
    "Historical_Average_Crowd", "Historical_Peak_Crowd",
    "Historical_Incident_Count", "Previous_Overcrowding", "Month", "Day",
    "hour_sin", "hour_cos",
]


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Return the Great-circle distance in kilometers between two lat/lon pairs."""
    radius_km = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = (
        math.sin(delta_phi / 2) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2
    )
    return 2 * radius_km * math.asin(math.sqrt(a))


def _safe_float(value, default=0.0):
    try:
        return float(value)
    except (TypeError, ValueError):
        return float(default)


def _safe_int(value, default=0):
    try:
        return int(value)
    except (TypeError, ValueError):
        return int(default)


def _choose_deterministic_venue(venues, historical_data):
    if not venues:
        return []

    if len(venues) == 1:
        return venues

    scored_venues = []
    for venue in venues:
        venue_id = str(venue.get("venue_id") or "")
        matching_history = [
            item for item in historical_data if str(item.get("venue_id") or "") == venue_id
        ]
        score = (
            len(matching_history),
            _safe_float(venue.get("venue_capacity"), 0.0),
            _safe_float(venue.get("venue_area_km2"), 0.0),
            -ord(venue_id[0]) if venue_id else 0,
        )
        scored_venues.append((score, venue))

    return [sorted(scored_venues, key=lambda item: (-item[0][0], -item[0][1], -item[0][2], item[0][3]))[0][1]]


def build_features(request: PredictionRequest):
    context = get_location_context(request.location_id)
    if not context or not context["location"]:
        raise ValueError(f"Location {request.location_id} not found.")

    location = context["location"]
    venues = context.get("venues") or []
    historical_data = context.get("historical_data") or []

    if request.venue_id:
        selected_venues = [v for v in venues if str(v.get("venue_id")) == str(request.venue_id)]
    else:
        selected_venues = _choose_deterministic_venue(venues, historical_data)

    if not selected_venues:
        raise ValueError("No valid venues found for this location.")

    selected_venues = sorted(selected_venues, key=lambda v: str(v.get("venue_id") or ""))
    venue_ids = {str(v.get("venue_id")) for v in selected_venues}
    relevant_history = [
        entry for entry in historical_data if str(entry.get("venue_id") or "") in venue_ids
    ]

    venue_capacity = sum(_safe_float(v.get("venue_capacity"), 0.0) for v in selected_venues)
    venue_area_km2 = sum(_safe_float(v.get("venue_area_km2"), 0.0) for v in selected_venues)
    special_features = selected_venues[0].get("special_features") or "None"
    transportation_type = selected_venues[0].get("transportation_type") or "Unknown"

    if relevant_history:
        avg_crowd = sum(_safe_float(h.get("historical_average_crowd"), 0.0) for h in relevant_history) / len(relevant_history)
        peak_crowd = max(_safe_float(h.get("historical_peak_crowd"), 0.0) for h in relevant_history)
        incidents = sum(_safe_int(h.get("historical_incident_count"), 0) for h in relevant_history)
        overcrowding = any(bool(h.get("previous_overcrowding")) for h in relevant_history)
    else:
        avg_crowd = 0.0
        peak_crowd = 0.0
        incidents = 0
        overcrowding = False

    req_dt = request.requested_datetime or datetime.now()
    req_hour = req_dt.hour
    peak_hours = {
        int(str(h.get("time") or "").split(":", 1)[0])
        for h in relevant_history
        if str(h.get("time") or "").strip() and str(h.get("peak_hour") or "").strip() in {"1", "true", "True", "yes", "Yes"}
    }
    is_peak = 1 if req_hour in peak_hours else 0

    api_key = os.getenv("OPENWEATHER_API_KEY")
    if not api_key:
        raise ValueError("OpenWeather API key not configured.")

    weather = get_current_weather(float(location["latitude"]), float(location["longitude"]), api_key)
    holiday = 0
    if weather.get("country"):
        try:
            holiday = is_public_holiday(weather["country"], req_dt.date())
        except ValueError:
            holiday = 0

    decimal_hour = req_hour + (req_dt.minute / 60.0)
    hour_sin = math.sin(2 * math.pi * decimal_hour / 24.0)
    hour_cos = math.cos(2 * math.pi * decimal_hour / 24.0)

    features = {
        "City": str(location.get("city") or "Unknown"),
        "Place": str(location.get("place") or "Unknown"),
        "Latitude": _safe_float(location.get("latitude"), 0.0),
        "Longitude": _safe_float(location.get("longitude"), 0.0),
        "Venue_Capacity": venue_capacity,
        "Venue_Area_km2": venue_area_km2,
        "Weather": str(weather.get("weather") or "Clear"),
        "Temperature_C": _safe_float(weather.get("temperature"), 0.0),
        "Humidity_pct": _safe_float(weather.get("humidity"), 0.0),
        "Rainfall_mm": _safe_float(weather.get("rainfall"), 0.0),
        "Wind_Speed_kmh": _safe_float(weather.get("wind_speed"), 0.0),
        "Day_of_Week": req_dt.strftime("%A"),
        "Holiday": holiday,
        "Event": request.event,
        "Event_Type": request.event_type,
        "Week_of_Year": req_dt.isocalendar()[1],
        "Special_Features": str(special_features),
        "Transportation_Type": str(transportation_type),
        "Peak_Hour": is_peak,
        "Historical_Average_Crowd": avg_crowd,
        "Historical_Peak_Crowd": peak_crowd,
        "Historical_Incident_Count": incidents,
        "Previous_Overcrowding": 1 if overcrowding else 0,
        "Month": req_dt.month,
        "Day": req_dt.day,
        "hour_sin": hour_sin,
        "hour_cos": hour_cos,
    }

    return pd.DataFrame([features], columns=FEATURE_NAMES), venue_capacity

