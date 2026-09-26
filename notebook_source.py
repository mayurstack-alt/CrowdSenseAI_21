print("Hello")

import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, r2_score,mean_squared_error


df=pd.read_csv("CrowdSense_AI_Master_Synthetic_Dataset.csv")

subset=df.head()

subset.to_csv("subsetCrowd.csv",index=False)

df.info()

df.shape

duplicates_count = df.duplicated().sum()

print(duplicates_count)

df = df.drop_duplicates(subset=['Record_ID'])

print(df.isnull().sum())

text_cols = ['City', 'Place', 'Region', 'Weather', 'Day_of_Week', 'Event', 'Event_Type', 'Special_Features', 'Transportation_Type']
for col in text_cols:
    df[col] = df[col].astype(str).str.strip().str.title()

df = df[(df['Crowd_Count'] >= 0) & (df['Venue_Capacity'] > 0) & (df['Venue_Area_km2'] > 0)]

df = df[(df['Humidity_pct'].between(0, 100)) & (df['Rainfall_mm'] >= 0) & (df['Wind_Speed_kmh'] >= 0)]

df = df[df['Latitude'].between(-90, 90) & df['Longitude'].between(-180, 180)]

df['Date'] = pd.to_datetime(df['Date'], errors='coerce')

df['Time'] = df['Time'].astype(str).str.strip()

df['Date'] = pd.to_datetime(df['Date'])
df['Month'] = df['Date'].dt.month
df['Day'] = df['Date'].dt.day

time_parts = df['Time'].astype(str).str.split(':', expand=True).astype(int)
df['Decimal_Hour'] = time_parts[0] + (time_parts[1] / 60.0)

df['hour_sin'] = np.sin(2 * np.pi * df['Decimal_Hour'] / 24.0)
df['hour_cos'] = np.cos(2 * np.pi * df['Decimal_Hour'] / 24.0)

leakage_and_metadata = [
    'Record_ID', 'Date', 'Time', 'Decimal_Hour', 'Region',
    'Crowd_Count',                # Target variable
    'Crowd_Density_per_km2',      # Derived from Crowd_Count
    'Capacity_Utilization_pct',   # Derived from Crowd_Count
    'Risk_Score',                 # Derived target
    'Risk_Level'                  # Derived target
]

X = df.drop(columns=[col for col in leakage_and_metadata if col in df.columns])
y = df['Crowd_Count']

categorical_features = [
    'City', 'Place', 'Weather', 'Day_of_Week',
    'Event', 'Event_Type', 'Special_Features', 'Transportation_Type'
]

categorical_features = [col for col in categorical_features if col in X.columns]

numerical_features = [col for col in X.columns if col not in categorical_features]

preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numerical_features),
        ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_features)
    ]
)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

X_train_processed = preprocessor.fit_transform(X_train)
X_test_processed = preprocessor.transform(X_test)

print("Preprocessing complete!")
print(f"X_train transformed shape: {X_train_processed.shape}")
print(f"X_test transformed shape: {X_test_processed.shape}")

model = RandomForestRegressor(
    n_estimators=100,      # Number of decision trees
    random_state=42,       # Ensures reproducible results
    n_jobs=-1              # Uses all CPU cores for faster training
)

model.fit(X_train_processed, y_train)

print("Model training complete!")

y_pred = model.predict(X_test_processed)

mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))

print(f"Mean Absolute Error (MAE): {mae:.2f} people")
print(f"Root Mean Squared Error (RMSE): {rmse:.2f} people")

if len(y_test) > 1:
    r2 = r2_score(y_test, y_pred)
    print(f"R-squared (R2 Score): {r2:.4f}")

def assign_risk_level(predicted_crowd: float, venue_capacity: int) -> dict:
    utilization_pct = (predicted_crowd / venue_capacity) * 100

    if utilization_pct < 60.0:
        risk_level = "Low"
        alert_color = "Green"
        action = "Normal monitoring. Standard entry/exit flow."
    elif utilization_pct < 80.0:
        risk_level = "Moderate"
        alert_color = "Yellow"
        action = "Deploy traffic personnel; monitor queue buildup."
    elif utilization_pct <= 100.0:
        risk_level = "High"
        alert_color = "Orange"
        action = "Enforce crowd diversion; restrict incoming entry gates."
    else:
        risk_level = "Critical"
        alert_color = "Red"
        action = "Immediate action: open emergency exits, issue diversion alerts."

    return {
        "predicted_crowd": round(predicted_crowd),
        "venue_capacity": venue_capacity,
        "capacity_utilization_pct": round(utilization_pct, 2),
        "risk_level": risk_level,
        "alert_color": alert_color,
        "recommended_action": action
    }

# Test sample calculation using the first test item
sample_venue_capacity = int(X_test['Venue_Capacity'].iloc[0])
sample_prediction = float(y_pred[0])
risk_result = assign_risk_level(sample_prediction, sample_venue_capacity)

print("Sample Risk Assessment Output:")
for key, value in risk_result.items():
    print(f"  {key}: {value}")

from xgboost import XGBRegressor
from lightgbm import LGBMRegressor

# Define candidate models
models = {
    "Random Forest": RandomForestRegressor(
        n_estimators=100, 
        random_state=42, 
        n_jobs=-1
    ),
    "XGBoost": XGBRegressor(
        n_estimators=100, 
        learning_rate=0.05, 
        max_depth=6, 
        random_state=42, 
        n_jobs=-1
    ),
    "LightGBM": LGBMRegressor(
        n_estimators=100, 
        learning_rate=0.05, 
        max_depth=6, 
        random_state=42, 
        n_jobs=-1,
        verbose=-1
    )
}

# Train and evaluate each model
results = []

for name, model in models.items():
    # 1. Fit on training data
    model.fit(X_train_processed, y_train)
    
    # 2. Predict on unseen test data
    y_pred = model.predict(X_test_processed)
    
    # 3. Compute metrics
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred) if len(y_test) > 1 else np.nan
    
    results.append({
        "Model": name,
        "MAE (Lower is Better)": round(mae, 2),
        "RMSE (Lower is Better)": round(rmse, 2),
        "R2 Score (Closer to 1 is Better)": round(r2, 4) if not np.isnan(r2) else "N/A (single test sample)"
    })

# Format comparison as a clean DataFrame
comparison_df = pd.DataFrame(results)
print(comparison_df.to_string(index=False))

best_model = XGBRegressor(
    n_estimators=100,
    learning_rate=0.05,
    max_depth=6,
    random_state=42,
    n_jobs=-1
)

crowdsense_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('model', best_model)
])

crowdsense_pipeline.fit(X_train, y_train)

joblib.dump(crowdsense_pipeline, 'crowdsense_xgboost_pipeline.pkl')
print("Complete pipeline exported successfully to 'crowdsense_xgboost_pipeline.pkl'!")


# Load the saved pipeline
loaded_pipeline = joblib.load('crowdsense_xgboost_pipeline.pkl')

# Take a single raw row from X_test to simulate an API request
sample_input = X_test.iloc[[1]]
predicted_crowd = loaded_pipeline.predict(sample_input)[0]

# Venue capacity from the input
capacity = sample_input['Venue_Capacity'].values[0]
utilization = (predicted_crowd / capacity) * 100

# Compute risk tier
if utilization < 60:
    risk = "Low"
elif utilization < 80:
    risk = "Moderate"
elif utilization <= 100:
    risk = "High"
else:
    risk = "Critical"

print(f"Predicted Crowd: {round(predicted_crowd):,}")
print(f"Venue Capacity: {capacity:,}")
print(f"Capacity Utilization: {utilization:.2f}%")
print(f"Assigned Risk Level: {risk}")

