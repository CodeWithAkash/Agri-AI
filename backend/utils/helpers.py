"""
Response formatting helpers
"""

from flask import jsonify
from datetime import datetime


def success_response(data: dict, status_code: int = 200):
    """Standard success response envelope."""
    return jsonify({
        "success": True,
        "data": data,
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }), status_code


def error_response(message: str, errors: list = None, status_code: int = 400):
    """Standard error response envelope."""
    response = {
        "success": False,
        "error": message,
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }
    if errors:
        response["errors"] = errors
    return jsonify(response), status_code
