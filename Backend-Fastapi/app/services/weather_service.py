import requests


def get_current_weather(latitude, longitude, api_key):

    url = "https://api.openweathermap.org/data/2.5/weather"

    params = {
        "lat": latitude,
        "lon": longitude,
        "appid": api_key,
        "units": "metric"
    }

    response = requests.get(url, params=params)

    response.raise_for_status()

    data = response.json()

    return {
        "weather": data["weather"][0]["main"],
        "temperature": data["main"]["temp"],
        "humidity": data["main"]["humidity"],
        "rainfall": data.get("rain", {}).get("1h", 0),
        "wind_speed": data["wind"]["speed"]
    }