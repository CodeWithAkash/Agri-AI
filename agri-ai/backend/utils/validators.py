"""
Input validation utilities
"""

from marshmallow import Schema, fields, validate, ValidationError

SUPPORTED_CROPS = [
    "rice", "maize", "wheat", "brinjal", "tomato",
    "potato", "cotton", "sugarcane", "soybean", "groundnut",
]

SUPPORTED_UNITS = ["acre", "hectare"]


class AnalyzeSchema(Schema):
    crop = fields.Str(
        required=True,
        validate=validate.OneOf(SUPPORTED_CROPS),
        error_messages={"required": "Crop type is required"},
    )
    area = fields.Float(
        required=True,
        validate=validate.Range(min=0.01, max=100000),
        error_messages={"required": "Area is required"},
    )
    unit = fields.Str(
        required=True,
        validate=validate.OneOf(SUPPORTED_UNITS),
        error_messages={"required": "Unit (acre/hectare) is required"},
    )
    latitude = fields.Float(
        required=True,
        validate=validate.Range(min=-90, max=90),
    )
    longitude = fields.Float(
        required=True,
        validate=validate.Range(min=-180, max=180),
    )


def validate_analyze_input(data: dict) -> tuple[dict, list]:
    """Validate analyze endpoint input. Returns (cleaned_data, errors)."""
    schema = AnalyzeSchema()
    try:
        result = schema.load(data)
        return result, []
    except ValidationError as err:
        errors = []
        for field, messages in err.messages.items():
            for msg in messages:
                errors.append(f"{field}: {msg}")
        return {}, errors
