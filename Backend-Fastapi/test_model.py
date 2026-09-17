import pandas as pd
from app.services.ml_service import model, calculate_risk

# One sample input
data = {
    "City": ["Mumbai"],
    "Place": ["Marine Drive"],
    "Latitude": [19.0760],
    "Longitude": [72.8777],
    "Venue_Capacity": [50000],
    "Venue_Area_km2": [0.5],
    "Weather": ["Clear"],
    "Temperature_C": [30],
    "Humidity_pct": [65],
    "Rainfall_mm": [0],
    "Wind_Speed_kmh": [12],
    "Day_of_Week": ["Saturday"],
    "Holiday": [1],
    "Event": ["Ganesh Chaturthi"],
    "Event_Type": ["Festival"],
    "Week_of_Year": [35],
    "Special_Features": ["Beachfront"],
    "Transportation_Type": ["Road"],
    "Peak_Hour": [1],
    "Historical_Average_Crowd": [25000],
    "Historical_Peak_Crowd": [45000],
    "Historical_Incident_Count": [2],
    "Previous_Overcrowding": [1],
    "Month": [8],
    "Day": [30],
    "hour_sin": [0.5],
    "hour_cos": [-0.5]
}

# Convert to DataFrame
input_data = pd.DataFrame(data)

# Make prediction
prediction = model.predict(input_data)

print("\nPredicted Crowd Count:", prediction[0])

venue_capacity = data["Venue_Capacity"][0]

risk_result = calculate_risk(
    prediction[0],
    venue_capacity
)

print("\nRisk Assessment:")

for key, value in risk_result.items():
    print(f"{key}: {value}")