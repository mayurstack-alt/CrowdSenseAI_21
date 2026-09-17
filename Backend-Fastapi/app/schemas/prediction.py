from pydantic import BaseModel
from typing import Optional


class PredictionRequest(BaseModel):

    City: str
    Place: str
    Latitude: float
    Longitude: float
    Venue_Capacity: int
    Venue_Area_km2: float

    Weather: Optional[str] = None
    Temperature_C: Optional[float] = None
    Humidity_pct: Optional[float] = None
    Rainfall_mm: Optional[float] = None
    Wind_Speed_kmh: Optional[float] = None

    Day_of_Week: Optional[str] = None
    Holiday: int
    Event: str
    Event_Type: str
    Week_of_Year: Optional[int] = None
    Special_Features: str
    Transportation_Type: str
    Peak_Hour: int

    Historical_Average_Crowd: float
    Historical_Peak_Crowd: float
    Historical_Incident_Count: int
    Previous_Overcrowding: int

    Month: Optional[int] = None
    Day: Optional[int] = None

    hour_sin: Optional[float] = None
    hour_cos: Optional[float] = None