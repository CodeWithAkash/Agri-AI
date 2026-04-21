"""
MongoDB document models (schema definitions via dicts)
Using PyMongo directly - no ODM overhead
"""

from datetime import datetime
from bson import ObjectId


def analysis_document(
    crop: str,
    area_hectares: float,
    original_area: float,
    original_unit: str,
    latitude: float,
    longitude: float,
    weather: dict,
    yield_data: dict,
    irrigation: dict,
    fertilizer: dict,
    pest_control: dict,
    profit: dict,
) -> dict:
    """Create a new analysis document for MongoDB insertion."""
    return {
        "crop": crop,
        "area": {
            "value": original_area,
            "unit": original_unit,
            "hectares": area_hectares,
        },
        "location": {
            "type": "Point",
            "coordinates": [longitude, latitude],  # GeoJSON format [lng, lat]
            "latitude": latitude,
            "longitude": longitude,
        },
        "weather": weather,
        "results": {
            "yield": yield_data,
            "irrigation": irrigation,
            "fertilizer": fertilizer,
            "pest_control": pest_control,
            "profit": profit,
        },
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
    }


def serialize_doc(doc: dict) -> dict:
    """Convert MongoDB document to JSON-serializable dict."""
    if doc is None:
        return None
    result = {}
    for key, value in doc.items():
        if key == "_id":
            result["id"] = str(value)
        elif isinstance(value, ObjectId):
            result[key] = str(value)
        elif isinstance(value, datetime):
            result[key] = value.isoformat() + "Z"
        elif isinstance(value, dict):
            result[key] = serialize_doc(value)
        elif isinstance(value, list):
            result[key] = [
                serialize_doc(i) if isinstance(i, dict) else i
                for i in value
            ]
        else:
            result[key] = value
    return result
