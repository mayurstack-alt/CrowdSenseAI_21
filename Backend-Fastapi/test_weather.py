import os
from dotenv import load_dotenv

from app.services.weather_service import get_current_weather


load_dotenv(override=True)

api_key = os.getenv("OPENWEATHER_API_KEY")

print("API key loaded:", api_key is not None)
print("API key length:", len(api_key) if api_key else 0)
print("API key last 4:", api_key[-4:] if api_key else "NONE")

weather = get_current_weather(
    19.0760,
    72.8777,
    api_key
)

print("\nCurrent Weather:")
print(weather)