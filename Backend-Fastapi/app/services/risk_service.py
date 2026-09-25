"""
CrowdSense AI — Risk Service
=============================
Converts a predicted crowd count into a structured risk assessment.

Two modes of operation:
  1. **Simple** — capacity utilization thresholds only (backward-compatible).
  2. **Multi-factor** — weighted score combining density, weather severity,
     event scale, and historical incident baseline.
"""


# ---------------------------------------------------------------------------
# Weather severity mapping
# ---------------------------------------------------------------------------
# Maps the weather condition string (as stored in the training dataset or
# returned by the weather service after normalization) to a 0–1 severity
# score.  Higher = more dangerous for crowd safety.

WEATHER_SEVERITY = {
    "Clear":      0.0,
    "Cloudy":     0.1,
    "Humid":      0.2,
    "Rain":       0.5,
    "Heavy Rain": 0.8,
    "Storm":      1.0,
}

# Fallback for any condition string not in the map
_DEFAULT_WEATHER_SEVERITY = 0.3


# ---------------------------------------------------------------------------
# Event-type severity mapping
# ---------------------------------------------------------------------------
# Estimates how much crowd-management risk a given event type introduces.

EVENT_TYPE_SEVERITY = {
    "Regular":       0.1,
    "Tourism":       0.3,
    "Market":        0.3,
    "Cultural":      0.4,
    "Entertainment": 0.5,
    "Sports":        0.5,
    "Public Event":  0.6,
    "Religious":     0.7,
    "Festival":      0.9,
}

_DEFAULT_EVENT_SEVERITY = 0.4


# ---------------------------------------------------------------------------
# Risk tier thresholds  (<30 LOW · 30-55 MEDIUM · 55-75 HIGH · >75 CRITICAL)
# ---------------------------------------------------------------------------

def _level_from_score(score: float) -> str:
    """Return a risk level string from a 0-100 risk score."""
    if score < 30:
        return "Low"
    elif score < 55:
        return "Moderate"
    elif score < 75:
        return "High"
    else:
        return "Critical"


def _alert_color(risk_level: str) -> dict:
    """Return color name and hex for a given risk level."""
    colors = {
        "Low":      {"name": "Green",  "hex": "#22C55E"},
        "Moderate": {"name": "Yellow", "hex": "#F59E0B"},
        "High":     {"name": "Orange", "hex": "#F97316"},
        "Critical": {"name": "Red",    "hex": "#EF4444"},
    }
    return colors.get(risk_level, colors["Moderate"])


def _dominant_factor(factors: dict) -> str:
    """Return the key of the factor with the highest weighted contribution."""
    return max(factors, key=factors.get)


# ---------------------------------------------------------------------------
# Recommendation templates
# ---------------------------------------------------------------------------

_RECOMMENDATIONS = {
    ("Low", "density"):      "Normal monitoring. Standard entry/exit flow.",
    ("Low", "weather"):      "Normal monitoring. Standard entry/exit flow.",
    ("Low", "event"):        "Normal monitoring. Standard entry/exit flow.",
    ("Low", "baseline"):     "Normal monitoring. Standard entry/exit flow.",

    ("Moderate", "density"):  "Deploy traffic personnel; monitor queue buildup.",
    ("Moderate", "weather"):  "Issue weather advisory to visitors; prepare shelter areas.",
    ("Moderate", "event"):    "Pre-position additional security at event entry points.",
    ("Moderate", "baseline"): "Deploy traffic personnel; monitor queue buildup.",

    ("High", "density"):     "Enforce crowd diversion; restrict incoming entry gates.",
    ("High", "weather"):     "Coordinate shelter arrangements; monitor for slip/fall hazards.",
    ("High", "event"):       "Activate alternate route diversion; notify traffic control.",
    ("High", "baseline"):    "Enforce crowd diversion; restrict incoming entry gates.",

    ("Critical", "density"):  "Immediate action: open emergency exits, issue diversion alerts.",
    ("Critical", "weather"):  "Halt outdoor activities; execute emergency weather protocol.",
    ("Critical", "event"):    "Activate alternate route diversion; notify traffic control. Deploy all reserves.",
    ("Critical", "baseline"): "Immediate action: open emergency exits, issue diversion alerts.",
}


def _get_recommendation(risk_level: str, dominant: str) -> str:
    """Look up the recommendation template for a risk level + dominant factor."""
    return _RECOMMENDATIONS.get(
        (risk_level, dominant),
        "Monitor situation closely and follow standard operating procedures."
    )


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def get_weather_severity(weather_condition: str) -> float:
    """Return a 0–1 severity score for a weather condition string."""
    if weather_condition is None:
        return _DEFAULT_WEATHER_SEVERITY
    return WEATHER_SEVERITY.get(weather_condition, _DEFAULT_WEATHER_SEVERITY)


def get_event_severity(event_type: str) -> float:
    """Return a 0–1 severity score for an event type string."""
    if event_type is None:
        return _DEFAULT_EVENT_SEVERITY
    return EVENT_TYPE_SEVERITY.get(event_type, _DEFAULT_EVENT_SEVERITY)


def calculate_risk(
    predicted_crowd: float,
    venue_capacity: int,
    weather_condition: str = None,
    event_type: str = None,
    historical_incident_count: int = 0,
    previous_overcrowding: int = 0,
):
    """
    Compute a full risk assessment for a predicted crowd count.

    Parameters
    ----------
    predicted_crowd : float
        The ML model's predicted crowd count.
    venue_capacity : int
        Maximum safe capacity of the venue.
    weather_condition : str, optional
        Weather label (e.g. "Clear", "Rain", "Storm").
    event_type : str, optional
        Event category (e.g. "Festival", "Religious", "Sports").
    historical_incident_count : int, optional
        Number of past safety incidents at this location.
    previous_overcrowding : int, optional
        Whether the location has experienced overcrowding before (0 or 1).

    Returns
    -------
    dict
        Full risk assessment payload ready for API response.
    """

    # --- Guard against bad inputs ---
    if venue_capacity is None or venue_capacity <= 0:
        venue_capacity = 1  # prevent ZeroDivisionError; flag as unknown
    predicted_crowd = max(float(predicted_crowd), 0)

    # --- Core utilization ---
    utilization_pct = (predicted_crowd / venue_capacity) * 100

    # --- Factor scores (each 0–1) ---
    density_factor = min(predicted_crowd / venue_capacity, 1.5) / 1.5
    weather_factor = get_weather_severity(weather_condition)
    event_factor = get_event_severity(event_type)

    # Baseline risk from historical incidents & past overcrowding
    incident_score = min(historical_incident_count / 5.0, 1.0)
    overcrowding_score = float(previous_overcrowding)
    baseline_factor = (incident_score * 0.6) + (overcrowding_score * 0.4)

    # --- Weighted risk score (0–100) ---
    weights = {
        "density": 0.45,
        "weather": 0.20,
        "event":   0.20,
        "baseline": 0.15,
    }

    factor_contributions = {
        "density":  weights["density"]  * density_factor,
        "weather":  weights["weather"]  * weather_factor,
        "event":    weights["event"]    * event_factor,
        "baseline": weights["baseline"] * baseline_factor,
    }

    risk_score = round(100 * sum(factor_contributions.values()))
    risk_score = max(0, min(risk_score, 100))  # clamp to 0-100

    # --- Derive level, color, recommendation ---
    risk_level = _level_from_score(risk_score)
    color = _alert_color(risk_level)
    dominant = _dominant_factor(factor_contributions)
    recommendation = _get_recommendation(risk_level, dominant)

    return {
        "predicted_crowd": round(predicted_crowd),
        "venue_capacity": venue_capacity,
        "capacity_utilization_pct": round(float(utilization_pct), 2),
        "risk_score": risk_score,
        "risk_level": risk_level,
        "alert_color": color["name"],
        "alert_color_hex": color["hex"],
        "recommended_action": recommendation,
        "dominant_factor": dominant,
        "factors": {
            "density": round(density_factor, 3),
            "weather": round(weather_factor, 3),
            "event": round(event_factor, 3),
            "baseline": round(baseline_factor, 3),
        },
    }
