from fastapi import APIRouter
import os

from app.services.weather_service import get_current_weather


router = APIRouter()


@router.get("/weather")
def get_weather(latitude: float, longitude: float):

    api_key = os.getenv("OPENWEATHER_API_KEY")

    print("Weather API key loaded:", api_key is not None)
    print("Weather API key length:", len(api_key) if api_key else 0)

    weather = get_current_weather(
        latitude,
        longitude,
        api_key
    )

    return weather