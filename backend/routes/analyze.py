"""
/api/analyze - Core analysis endpoint
POST: Run full agricultural analysis for a field
"""

import logging
from flask import Blueprint, request
from utils.validators import validate_analyze_input
from utils.helpers import success_response, error_response
from utils.weather_service import fetch_weather
from utils.db import get_collection
from models.analysis import analysis_document, serialize_doc
from ml.yield_predictor import yield_predictor, CROP_BASE_YIELDS
from ml.agri_logic import (
    calculate_irrigation,
    calculate_fertilizer,
    get_pest_control,
    calculate_profit,
)

logger = logging.getLogger(__name__)
analyze_bp = Blueprint("analyze", __name__)


def convert_to_hectares(area: float, unit: str) -> float:
    """Convert area to hectares."""
    if unit == "acre":
        return area * 0.404686
    return area  # already hectares


@analyze_bp.route("/analyze", methods=["POST"])
def analyze():
    """
    POST /api/analyze
    
    Body: { crop, area, unit, latitude, longitude }
    
    Returns comprehensive agricultural analysis including:
    - Yield prediction (ML-enhanced)
    - Irrigation schedule
    - Fertilizer NPK recommendation
    - Pest control rotation
    - Profit estimation
    - Weather data
    """
    try:
        data = request.get_json(silent=True)
        if not data:
            return error_response("Request body must be JSON", status_code=400)

        # Validate input
        cleaned, errors = validate_analyze_input(data)
        if errors:
            return error_response("Validation failed", errors=errors, status_code=422)

        crop = cleaned["crop"].lower()
        area = cleaned["area"]
        unit = cleaned["unit"]
        latitude = cleaned["latitude"]
        longitude = cleaned["longitude"]

        # Convert area to hectares for all calculations
        area_ha = convert_to_hectares(area, unit)

        # 1. Fetch weather data
        logger.info(f"Fetching weather for ({latitude}, {longitude})")
        weather = fetch_weather(latitude, longitude)

        rainfall = weather.get("rainfall_annual_mm", 1000)
        temperature = weather.get("temperature", 25)

        # 2. Yield Prediction (ML)
        logger.info(f"Predicting yield for {crop}, {area_ha:.2f} ha")
        yield_data = yield_predictor.predict(
            crop=crop,
            area_hectares=area_ha,
            rainfall=rainfall,
            temperature=temperature,
        )

        # 3. Irrigation Recommendation
        irrigation = calculate_irrigation(rainfall, crop)

        # 4. Fertilizer Calculation
        fertilizer = calculate_fertilizer(crop, area_ha)

        # 5. Pest Control Rotation
        pest_control = get_pest_control(crop)

        # 6. Profit Estimation
        profit = calculate_profit(
            total_yield_kg=yield_data["total_yield"],
            area_hectares=area_ha,
            crop=crop,
        )

        # 7. Build response payload
        result = {
            "input": {
                "crop": crop,
                "area": area,
                "unit": unit,
                "area_hectares": round(area_ha, 4),
                "latitude": latitude,
                "longitude": longitude,
            },
            "weather": weather,
            "yield": yield_data,
            "irrigation": irrigation,
            "fertilizer": fertilizer,
            "pest_control": pest_control,
            "profit": profit,
        }

        # 8. Persist to MongoDB (non-blocking - failure doesn't break response)
        try:
            col = get_collection("analyses")
            if col is not None:
                doc = analysis_document(
                    crop=crop,
                    area_hectares=area_ha,
                    original_area=area,
                    original_unit=unit,
                    latitude=latitude,
                    longitude=longitude,
                    weather=weather,
                    yield_data=yield_data,
                    irrigation=irrigation,
                    fertilizer=fertilizer,
                    pest_control=pest_control,
                    profit=profit,
                )
                inserted = col.insert_one(doc)
                result["analysis_id"] = str(inserted.inserted_id)
                logger.info(f"Analysis saved: {inserted.inserted_id}")
        except Exception as db_err:
            logger.warning(f"DB save failed (non-critical): {db_err}")

        return success_response(result, status_code=200)

    except Exception as e:
        logger.exception(f"Analyze endpoint error: {e}")
        return error_response("Analysis failed - internal error", status_code=500)
