from fastapi import APIRouter, HTTPException
import traceback
from datetime import datetime

from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.services.feature_builder import build_features
from app.services.ml_service import model
from app.services.risk_service import calculate_risk
from app.services.supabase_service import supabase

router = APIRouter()

@router.post("/predict")
def predict_crowd(request: PredictionRequest):
    try:
        # Build exact 27-feature DataFrame
        input_df, venue_capacity = build_features(request)
        
        # Predict crowd count
        prediction = model.predict(input_df)[0]
        
        # Calculate risk using multi-factor scoring
        historical_incident_count = int(input_df["Historical_Incident_Count"].iloc[0])
        previous_overcrowding = int(input_df["Previous_Overcrowding"].iloc[0])
        weather_condition = input_df["Weather"].iloc[0]
        
        risk_result = calculate_risk(
            predicted_crowd=prediction,
            venue_capacity=venue_capacity,
            weather_condition=weather_condition,
            event_type=request.event_type,
            historical_incident_count=historical_incident_count,
            previous_overcrowding=previous_overcrowding,
        )

        return risk_result
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/risk/nearby")
def get_nearby_risk(lat: float = 19.076, lon: float = 72.8777, radius_km: float = 10.0):
    try:
        locations_res = supabase.table("locations").select("*").execute()
        locations = locations_res.data
        if not locations:
            return []

        results = []
        for loc in locations:
            # We skip distance filtering for simplicity unless we do Haversine
            # Call prediction for each location
            try:
                req = PredictionRequest(location_id=loc["location_id"])
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
                results.append({
                    "location_id": loc["location_id"],
                    "name": loc["place"],
                    "city": loc["city"],
                    "lat": loc["latitude"],
                    "lng": loc["longitude"],
                    "risk": risk["capacity_utilization_pct"],
                    "level": risk["risk_level"],
                    "crowd": risk["predicted_crowd"],
                    "distance": "2.0 km", # mock distance
                    "color": risk["alert_color_hex"]
                })
            except Exception as inner_e:
                # skip locations that fail to predict
                pass
                
        # Sort by risk descending
        results.sort(key=lambda x: x["risk"], reverse=True)
        return results[:10]
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Internal server error")
