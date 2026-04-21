"""
/api/weather - Weather data endpoint
GET: Fetch weather for given coordinates
"""

import logging
from flask import Blueprint, request
from utils.helpers import success_response, error_response
from utils.weather_service import fetch_weather

logger = logging.getLogger(__name__)
weather_bp = Blueprint("weather", __name__)


@weather_bp.route("/weather", methods=["GET"])
def get_weather():
    """
    GET /api/weather?lat=<latitude>&lon=<longitude>
    
    Returns current weather data for the given coordinates.
    Used by the frontend map for quick weather previews.
    """
    try:
        lat = request.args.get("lat")
        lon = request.args.get("lon")

        if lat is None or lon is None:
            return error_response(
                "Missing required query parameters: lat, lon",
                status_code=400,
            )

        try:
            latitude = float(lat)
            longitude = float(lon)
        except ValueError:
            return error_response("lat and lon must be valid numbers", status_code=400)

        if not (-90 <= latitude <= 90):
            return error_response("Latitude must be between -90 and 90", status_code=400)
        if not (-180 <= longitude <= 180):
            return error_response("Longitude must be between -180 and 180", status_code=400)

        weather = fetch_weather(latitude, longitude)
        return success_response({"weather": weather})

    except Exception as e:
        logger.exception(f"Weather endpoint error: {e}")
        return error_response("Failed to fetch weather data", status_code=500)
