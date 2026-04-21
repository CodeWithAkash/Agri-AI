"""
Weather Service - OpenWeatherMap API integration
Falls back to mock data if API key not configured
"""

import requests
import logging
from flask import current_app

logger = logging.getLogger(__name__)

# Mock weather data for development / fallback
MOCK_WEATHER = {
    "temperature": 28.5,
    "rainfall_annual_mm": 1050,
    "humidity_percent": 72,
    "wind_speed_kmh": 14,
    "description": "Partly cloudy",
    "source": "mock",
}


def fetch_weather(latitude: float, longitude: float) -> dict:
    """
    Fetch weather data from OpenWeatherMap API.
    Falls back to mock data if API key is not set.
    
    Args:
        latitude: Location latitude
        longitude: Location longitude
    
    Returns:
        dict with weather data
    """
    api_key = current_app.config.get("OPENWEATHER_API_KEY", "")

    if not api_key:
        logger.warning("No OpenWeatherMap API key configured - using mock weather data")
        return _mock_weather_for_location(latitude, longitude)

    try:
        url = "https://api.openweathermap.org/data/2.5/weather"
        params = {
            "lat": latitude,
            "lon": longitude,
            "appid": api_key,
            "units": "metric",
        }
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()

        # Extract and normalize relevant fields
        return {
            "temperature": round(data["main"]["temp"], 1),
            "feels_like": round(data["main"]["feels_like"], 1),
            "humidity_percent": data["main"]["humidity"],
            "wind_speed_kmh": round(data["wind"]["speed"] * 3.6, 1),
            "description": data["weather"][0]["description"].capitalize(),
            "city": data.get("name", "Unknown"),
            "country": data.get("sys", {}).get("country", ""),
            # Annual rainfall estimated from current (rough approximation)
            "rainfall_annual_mm": _estimate_annual_rainfall(
                data["main"]["humidity"], latitude
            ),
            "source": "openweathermap",
        }

    except requests.exceptions.Timeout:
        logger.error("Weather API timeout")
        return _mock_weather_for_location(latitude, longitude)
    except requests.exceptions.RequestException as e:
        logger.error(f"Weather API error: {e}")
        return _mock_weather_for_location(latitude, longitude)
    except Exception as e:
        logger.error(f"Unexpected weather error: {e}")
        return _mock_weather_for_location(latitude, longitude)


def _estimate_annual_rainfall(humidity: float, latitude: float) -> float:
    """
    Rough annual rainfall estimate from humidity and latitude.
    Used when historical rainfall data is unavailable.
    """
    # Tropical zone (within 23.5° of equator) typically wetter
    base = 800 if abs(latitude) < 23.5 else 600
    humidity_factor = humidity / 100
    return round(base + (humidity_factor * 800), 0)


def _mock_weather_for_location(latitude: float, longitude: float) -> dict:
    """Generate realistic mock weather based on latitude."""
    import random
    random.seed(int(abs(latitude * 100)) % 100)

    # Tropical vs temperate
    is_tropical = abs(latitude) < 23.5
    temp = random.uniform(26, 35) if is_tropical else random.uniform(15, 28)
    rainfall = random.uniform(900, 1600) if is_tropical else random.uniform(500, 1100)
    humidity = random.uniform(60, 85) if is_tropical else random.uniform(40, 70)

    return {
        "temperature": round(temp, 1),
        "feels_like": round(temp + 2, 1),
        "humidity_percent": round(humidity, 1),
        "wind_speed_kmh": round(random.uniform(8, 20), 1),
        "description": "Partly cloudy (simulated)",
        "rainfall_annual_mm": round(rainfall, 0),
        "source": "simulated",
        "note": "Add OPENWEATHER_API_KEY to .env for real weather data",
    }
