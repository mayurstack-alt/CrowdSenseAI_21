import os
import requests
from dotenv import load_dotenv

load_dotenv("Backend-Fastapi/.env")

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

headers = {
    "apikey": key,
    "Authorization": f"Bearer {key}"
}

# Fetch one row from historical_data
response = requests.get(f"{url}/rest/v1/historical_data?limit=1", headers=headers)
if response.status_code == 200:
    data = response.json()
    if data:
        print("Columns in historical_data:", list(data[0].keys()))
        if "Peak_Hour" in data[0]:
            print("Peak_Hour value:", data[0]["Peak_Hour"])
    else:
        print("No data in historical_data")
else:
    print("Error:", response.status_code, response.text)
