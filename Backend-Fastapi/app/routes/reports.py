import json
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(prefix="/reports", tags=["Reports"])

REPORTS_FILE = Path(__file__).resolve().parents[1] / "data" / "reports.json"


class ReportSubmission(BaseModel):
    location: str = Field(..., min_length=2)
    estimated_crowd_range: str = Field(..., min_length=2)
    description: str = Field(..., min_length=10)
    timestamp: datetime | str | None = None
    user_metadata: dict | None = None
    image_metadata: dict | None = None


def _ensure_reports_file():
    REPORTS_FILE.parent.mkdir(parents=True, exist_ok=True)
    if not REPORTS_FILE.exists():
        REPORTS_FILE.write_text("[]", encoding="utf-8")


def _load_reports() -> list[dict]:
    _ensure_reports_file()
    try:
        raw = REPORTS_FILE.read_text(encoding="utf-8")
        data = json.loads(raw) if raw.strip() else []
        return data if isinstance(data, list) else []
    except json.JSONDecodeError:
        return []


def _save_reports(reports: list[dict]) -> None:
    _ensure_reports_file()
    REPORTS_FILE.write_text(json.dumps(reports, indent=2), encoding="utf-8")


@router.get("")
def list_reports():
    return _load_reports()


@router.post("")
def create_report(payload: ReportSubmission):
    reports = _load_reports()
    now = datetime.now(timezone.utc)

    final_timestamp = payload.timestamp
    if final_timestamp is None:
        final_timestamp = now.isoformat()
    elif isinstance(final_timestamp, datetime):
        final_timestamp = final_timestamp.isoformat()

    report = {
        "id": uuid4().hex,
        "location": payload.location.strip(),
        "estimated_crowd_range": payload.estimated_crowd_range.strip(),
        "description": payload.description.strip(),
        "timestamp": final_timestamp,
        "user_metadata": payload.user_metadata or {},
        "image_metadata": payload.image_metadata or {},
        "created_at": now.isoformat(),
    }
    reports.insert(0, report)
    _save_reports(reports)
    return report


@router.get("/{report_id}")
def get_report(report_id: str):
    reports = _load_reports()
    for report in reports:
        if report.get("id") == report_id:
            return report
    raise HTTPException(status_code=404, detail="Report not found")
