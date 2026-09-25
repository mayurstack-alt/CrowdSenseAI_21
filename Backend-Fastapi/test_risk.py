"""
Test script for the Risk Service module.
Verifies all 4 risk tiers, multi-factor scoring, and edge cases.
"""
from app.services.risk_service import calculate_risk, get_weather_severity, get_event_severity


def separator(title):
    print(f"\n{'=' * 60}")
    print(f"  {title}")
    print(f"{'=' * 60}")


def print_result(label, result):
    print(f"\n--- {label} ---")
    for key, value in result.items():
        print(f"  {key}: {value}")


# ──────────────────────────────────────────────────────────────
# 1. Basic tier tests — monotonic ordering (density-only, defaults)
# ──────────────────────────────────────────────────────────────
separator("1. Basic Tier Tests (density-only, defaults apply)")

result_low = calculate_risk(predicted_crowd=4000, venue_capacity=10000)
print_result("LOW crowd  (4,000 / 10,000 = 40%)", result_low)

result_mod = calculate_risk(predicted_crowd=7000, venue_capacity=10000)
print_result("MODERATE crowd  (7,000 / 10,000 = 70%)", result_mod)

result_high = calculate_risk(predicted_crowd=9500, venue_capacity=10000)
print_result("HIGH crowd  (9,500 / 10,000 = 95%)", result_high)

result_crit = calculate_risk(predicted_crowd=13000, venue_capacity=10000)
print_result("OVER-CAPACITY  (13,000 / 10,000 = 130%)", result_crit)

# Scores must increase monotonically with crowd density
assert result_low["risk_score"] < result_mod["risk_score"] < result_high["risk_score"] < result_crit["risk_score"], \
    "Risk score must increase with crowd density"
print("\n  [PASS] Monotonic ordering confirmed")


# ──────────────────────────────────────────────────────────────
# 1b. Full context tier tests — all 4 levels
# ──────────────────────────────────────────────────────────────
separator("1b. Full Context Tier Tests")

tier_low = calculate_risk(
    predicted_crowd=2000, venue_capacity=10000,
    weather_condition="Clear", event_type="Regular",
)
print_result("LOW  (20% + Clear + Regular)", tier_low)
assert tier_low["risk_level"] == "Low", f"Expected Low, got {tier_low['risk_level']}"

tier_mod = calculate_risk(
    predicted_crowd=6000, venue_capacity=10000,
    weather_condition="Rain", event_type="Sports",
)
print_result("MODERATE  (60% + Rain + Sports)", tier_mod)
assert tier_mod["risk_level"] == "Moderate", f"Expected Moderate, got {tier_mod['risk_level']}"

tier_high = calculate_risk(
    predicted_crowd=9000, venue_capacity=10000,
    weather_condition="Heavy Rain", event_type="Religious",
    historical_incident_count=2, previous_overcrowding=1,
)
print_result("HIGH  (90% + Heavy Rain + Religious + incidents)", tier_high)
assert tier_high["risk_level"] == "High", f"Expected High, got {tier_high['risk_level']}"

tier_crit = calculate_risk(
    predicted_crowd=14000, venue_capacity=10000,
    weather_condition="Storm", event_type="Festival",
    historical_incident_count=5, previous_overcrowding=1,
)
print_result("CRITICAL  (140% + Storm + Festival + max incidents)", tier_crit)
assert tier_crit["risk_level"] == "Critical", f"Expected Critical, got {tier_crit['risk_level']}"


# ──────────────────────────────────────────────────────────────
# 2. Multi-factor scoring
# ──────────────────────────────────────────────────────────────
separator("2. Multi-Factor Scoring")

# Heavy rain + festival + overcrowding history should push risk up
result_multi = calculate_risk(
    predicted_crowd=8000,
    venue_capacity=10000,
    weather_condition="Heavy Rain",
    event_type="Festival",
    historical_incident_count=3,
    previous_overcrowding=1,
)
print_result("Multi-factor (80% util + Heavy Rain + Festival + incidents)", result_multi)
print(f"  -> risk_score should be elevated: {result_multi['risk_score']}")

# Same crowd but clear weather, regular day, no history
result_calm = calculate_risk(
    predicted_crowd=8000,
    venue_capacity=10000,
    weather_condition="Clear",
    event_type="Regular",
    historical_incident_count=0,
    previous_overcrowding=0,
)
print_result("Same density but calm conditions", result_calm)
print(f"  -> risk_score should be lower: {result_calm['risk_score']}")

assert result_multi["risk_score"] > result_calm["risk_score"], \
    "Multi-factor storm scenario should score higher than calm scenario"


# ──────────────────────────────────────────────────────────────
# 3. Weather severity lookup
# ──────────────────────────────────────────────────────────────
separator("3. Weather Severity Lookup")

for condition in ["Clear", "Cloudy", "Rain", "Heavy Rain", "Storm", "Humid", "Unknown"]:
    score = get_weather_severity(condition)
    print(f"  {condition:>12s} -> {score}")

print(f"  {'None':>12s} -> {get_weather_severity(None)}")


# ──────────────────────────────────────────────────────────────
# 4. Event severity lookup
# ──────────────────────────────────────────────────────────────
separator("4. Event Severity Lookup")

for etype in ["Regular", "Tourism", "Festival", "Religious", "Sports", "Unknown"]:
    score = get_event_severity(etype)
    print(f"  {etype:>14s} -> {score}")

print(f"  {'None':>14s} -> {get_event_severity(None)}")


# ──────────────────────────────────────────────────────────────
# 5. Edge cases
# ──────────────────────────────────────────────────────────────
separator("5. Edge Cases")

# Zero venue capacity — should not crash
result_zero = calculate_risk(predicted_crowd=5000, venue_capacity=0)
print_result("Zero venue capacity (guarded)", result_zero)
assert result_zero["venue_capacity"] == 1, "Should default to 1 to prevent ZeroDivisionError"

# Negative predicted crowd — should clamp to 0
result_neg = calculate_risk(predicted_crowd=-500, venue_capacity=10000)
print_result("Negative predicted crowd (clamped)", result_neg)
assert result_neg["predicted_crowd"] == 0, "Negative crowd should be clamped to 0"

# None venue capacity — should not crash
result_none = calculate_risk(predicted_crowd=5000, venue_capacity=None)
print_result("None venue capacity (guarded)", result_none)
assert result_none["venue_capacity"] == 1, "None capacity should default to 1"


# ──────────────────────────────────────────────────────────────
separator("ALL TESTS PASSED")
