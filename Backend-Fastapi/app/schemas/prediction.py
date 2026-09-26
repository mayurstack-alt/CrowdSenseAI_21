from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PredictionRequest(BaseModel):
    location_id: str
    venue_id: Optional[str] = None
    event: str = "Regular Day"
    event_type: str = "Regular"
    requested_datetime: Optional[datetime] = None

class PredictionResponse(BaseModel):
    predicted_crowd: int
    venue_capacity: int
    capacity_utilization_pct: float
    risk_level: str
    alert_color: str
    recommended_action: str
    dominant_factor: Optional[str] = None
