from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_predict_returns_stable_contract(monkeypatch):
    fake_context = {
        "location": {
            "location_id": "loc-42",
            "city": "Mumbai",
            "place": "Marine Drive",
            "latitude": 19.076,
            "longitude": 72.8777,
        },
        "venues": [{
            "venue_id": "v-1",
            "venue_capacity": 1200,
            "venue_area_km2": 1.2,
            "special_features": "Seafront",
            "transportation_type": "Road",
        }],
        "historical_data": [{
            "venue_id": "v-1",
            "time": "18:00:00",
            "peak_hour": 1,
            "historical_average_crowd": 800,
            "historical_peak_crowd": 1000,
            "historical_incident_count": 2,
            "previous_overcrowding": True,
        }],
    }

    monkeypatch.setattr("app.services.feature_builder.get_location_context", lambda _loc_id: fake_context)
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
    monkeypatch.setattr("app.services.feature_builder.is_public_holiday", lambda country, dt: 0)
    monkeypatch.setenv("OPENWEATHER_API_KEY", "demo-key")
    monkeypatch.setattr("app.services.ml_service.model.predict", lambda df: [850])

    response = client.post(
        "/predict",
        json={
            "location_id": "loc-42",
            "requested_datetime": "2026-09-26T18:30:00",
            "event": "Festival",
            "event_type": "Festival",
        },
    )

    assert response.status_code == 200, response.text
    payload = response.json()
    assert payload["location_id"] == "loc-42"
    assert payload["predicted_crowd"] == 850
    assert payload["capacity"] == 1200
    assert payload["utilization"] > 0
    assert payload["risk_score"] >= 0
    assert payload["risk_level"] in {"Low", "Moderate", "High", "Critical"}
    assert payload["weather"] == "Clear"
    assert isinstance(payload["recommended_action"], str)
