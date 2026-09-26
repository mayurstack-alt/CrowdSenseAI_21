import logging
import traceback
from typing import Any

from fastapi import APIRouter, HTTPException

from app.schemas.prediction import PredictionRequest
from app.services.feature_builder import build_features, haversine_km
from app.services.ml_service import model
from app.services.risk_service import calculate_risk
from app.services.supabase_service import get_supabase_client

logger = logging.getLogger(__name__)
router = APIRouter()


def _predict_for_location(location_id: str, event: str = "Regular Day", event_type: str = "Regular") -> dict[str, Any]:
    req = PredictionRequest(location_id=location_id, event=event, event_type=event_type)
    input_df, venue_capacity = build_features(req)
    prediction = model.predict(input_df)[0]
    risk = calculate_risk(
        predicted_crowd=prediction,
        venue_capacity=venue_capacity,
        weather_condition=input_df["Weather"].iloc[0],
        event_type=req.event_type,
        historical_incident_count=int(input_df["Historical_Incident_Count"].iloc[0]),
        previous_overcrowding=int(input_df["Previous_Overcrowding"].iloc[0]),
    )
    return {
        "location_id": location_id,
        "weather": input_df["Weather"].iloc[0],
        "risk": risk,
        "input_df": input_df,
        "venue_capacity": venue_capacity,
        "predicted_crowd": prediction,
    }


@router.post("/predict")
def predict_crowd(request: PredictionRequest):
    try:
        input_df, venue_capacity = build_features(request)
        prediction = model.predict(input_df)[0]

        risk_result = calculate_risk(
            predicted_crowd=prediction,
            venue_capacity=venue_capacity,
            weather_condition=input_df["Weather"].iloc[0],
            event_type=request.event_type,
            historical_incident_count=int(input_df["Historical_Incident_Count"].iloc[0]),
            previous_overcrowding=int(input_df["Previous_Overcrowding"].iloc[0]),
        )

        return {
            "location_id": request.location_id,
            "predicted_crowd": int(round(float(risk_result["predicted_crowd"]))),
            "capacity": int(venue_capacity),
            "utilization": round(float(risk_result["capacity_utilization_pct"]), 2),
            "risk_score": int(risk_result["risk_score"]),
            "risk_level": risk_result["risk_level"],
            "weather": input_df["Weather"].iloc[0],
            "recommended_action": risk_result["recommended_action"],
            "alert_color": risk_result.get("alert_color"),
            "alert_color_hex": risk_result.get("alert_color_hex"),
            "dominant_factor": risk_result.get("dominant_factor"),
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception:
        logger.exception("predict endpoint failed")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/risk/nearby")
def get_nearby_risk(lat: float = 19.076, lon: float = 72.8777, radius_km: float = 10.0):
    try:
        supabase = get_supabase_client()
        locations_res = supabase.table("locations").select("*").execute()
        locations = locations_res.data or []
        if not locations:
            return []

        results = []
        for loc in locations:
            try:
                latitude = float(loc.get("latitude"))
                longitude = float(loc.get("longitude"))
                distance_km = haversine_km(lat, lon, latitude, longitude)
                if distance_km > radius_km:
                    continue

                prediction_payload = _predict_for_location(loc["location_id"], event="Regular Day", event_type="Regular")
                risk = prediction_payload["risk"]
                results.append({
                    "location_id": loc["location_id"],
                    "name": loc.get("place") or loc.get("city"),
                    "city": loc.get("city"),
                    "lat": latitude,
                    "lng": longitude,
                    "risk": float(risk["risk_score"]),
                    "level": risk["risk_level"],
                    "crowd": risk["predicted_crowd"],
                    "distance_km": round(distance_km, 2),
                    "distance": f"{distance_km:.1f} km",
                    "color": risk["alert_color_hex"],
                    "capacity_utilization_pct": risk["capacity_utilization_pct"],
                    "recommended_action": risk["recommended_action"],
                })
            except Exception as inner_exc:
                logger.warning("Skipping nearby location %s: %s", loc.get("location_id"), inner_exc)

        results.sort(key=lambda item: item["risk"], reverse=True)
        return results[:10]
    except Exception:
        logger.exception("nearby risk failed")
        raise HTTPException(status_code=500, detail="Internal server error")

