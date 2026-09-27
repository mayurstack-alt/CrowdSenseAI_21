from pathlib import Path

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_report_round_trip(tmp_path, monkeypatch):
    report_path = tmp_path / "reports.json"
    monkeypatch.setattr(
        "app.routes.reports.REPORTS_FILE",
        report_path,
    )

    payload = {
        "location": "Marine Drive",
        "estimated_crowd_range": "2000-5000",
        "description": "Crowd building near the promenade.",
        "timestamp": "2026-09-26T18:15:00",
        "user_metadata": {"name": "Visitor", "phone": "9999999999"},
        "image_metadata": {"filename": "crowd.jpg", "size_bytes": 24500, "content_type": "image/jpeg"},
    }

    create_response = client.post("/reports", json=payload)
    assert create_response.status_code == 200, create_response.text
    body = create_response.json()
    assert body["location"] == "Marine Drive"
    assert body["estimated_crowd_range"] == "2000-5000"
    assert body["id"]

    list_response = client.get("/reports")
    assert list_response.status_code == 200, list_response.text
    assert len(list_response.json()) >= 1
