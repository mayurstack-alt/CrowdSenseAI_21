from datetime import datetime

from app.schemas.prediction import PredictionRequest
from app.services.feature_builder import build_features, haversine_km


def test_build_features_uses_deterministic_venue_and_exact_feature_contract(monkeypatch):
    fake_context = {
        "location": {
            "location_id": "loc-1",
            "city": "Mumbai",
            "place": "Marine Drive",
            "latitude": 19.076,
            "longitude": 72.8777,
        },
        "venues": [
            {
                "venue_id": "v-2",
                "venue_capacity": 120,
                "venue_area_km2": 1.2,
                "special_features": "Beachfront",
                "transportation_type": "Road",
            },
            {
                "venue_id": "v-1",
                "venue_capacity": 200,
                "venue_area_km2": 4.0,
                "special_features": "Promenade",
                "transportation_type": "Metro",
            },
        ],
        "historical_data": [
            {
                "venue_id": "v-1",
                "location_id": "loc-1",
                "time": "18:00:00",
                "peak_hour": 1,
                "historical_average_crowd": 300,
                "historical_peak_crowd": 450,
                "historical_incident_count": 2,
                "previous_overcrowding": True,
            },
            {
                "venue_id": "v-2",
                "location_id": "loc-1",
                "time": "19:00:00",
                "peak_hour": 0,
                "historical_average_crowd": 180,
                "historical_peak_crowd": 240,
                "historical_incident_count": 1,
                "previous_overcrowding": False,
            },
        ],
    }

    monkeypatch.setattr(
        "app.services.feature_builder.get_location_context",
        lambda _loc_id: fake_context,
    )
    monkeypatch.setattr(
        "app.services.feature_builder.get_current_weather",
        lambda lat, lon, api_key: {
            "country": "IN",
            "weather": "Clear",
            "temperature": 30,
            "humidity": 65,
            "rainfall": 0,
            "wind_speed": 12,
        },
    )
    monkeypatch.setattr(
        "app.services.feature_builder.is_public_holiday",
        lambda country, dt: 0,
    )
    monkeypatch.setenv("OPENWEATHER_API_KEY", "demo")

    df, venue_capacity = build_features(
        PredictionRequest(
            location_id="loc-1",
            requested_datetime=datetime(2026, 1, 5, 18, 30),
        )
    )

    assert venue_capacity == 200
    assert df["Venue_Capacity"].iloc[0] == 200
    assert df["Venue_Area_km2"].iloc[0] == 4.0
    assert df["Peak_Hour"].iloc[0] == 1
    assert list(df.columns) == [
        "City", "Place", "Latitude", "Longitude", "Venue_Capacity",
        "Venue_Area_km2", "Weather", "Temperature_C", "Humidity_pct",
        "Rainfall_mm", "Wind_Speed_kmh", "Day_of_Week", "Holiday",
        "Event", "Event_Type", "Week_of_Year", "Special_Features",
        "Transportation_Type", "Peak_Hour", "Historical_Average_Crowd",
        "Historical_Peak_Crowd", "Historical_Incident_Count",
        "Previous_Overcrowding", "Month", "Day", "hour_sin", "hour_cos",
    ]


def test_haversine_distance_is_numeric_and_reliable():
    d = haversine_km(19.076, 72.8777, 19.0765, 72.8783)
    assert isinstance(d, float)
    assert d > 0
    assert d < 1
