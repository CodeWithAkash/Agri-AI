"""
/api/history - Historical analysis data endpoint
GET: Retrieve past analyses
DELETE: Remove a specific analysis
"""

import logging
from flask import Blueprint, request
from utils.helpers import success_response, error_response
from utils.db import get_collection
from models.analysis import serialize_doc
from bson import ObjectId
from bson.errors import InvalidId

logger = logging.getLogger(__name__)
history_bp = Blueprint("history", __name__)


@history_bp.route("/history", methods=["GET"])
def get_history():
    """
    GET /api/history
    
    Query params:
        page (int): Page number (default 1)
        limit (int): Items per page (default 20, max 100)
        crop (str): Filter by crop type
    
    Returns paginated list of past analyses.
    """
    try:
        page = max(1, int(request.args.get("page", 1)))
        limit = min(100, max(1, int(request.args.get("limit", 20))))
        crop_filter = request.args.get("crop", "").strip().lower()

        col = get_collection("analyses")
        if col is None:
            return success_response(
                {
                    "analyses": [],
                    "total": 0,
                    "page": page,
                    "limit": limit,
                    "message": "Database not connected - no history available",
                }
            )

        # Build query filter
        query = {}
        if crop_filter:
            query["crop"] = crop_filter

        total = col.count_documents(query)
        skip = (page - 1) * limit

        cursor = (
            col.find(query)
            .sort("createdAt", -1)
            .skip(skip)
            .limit(limit)
        )

        analyses = [serialize_doc(doc) for doc in cursor]

        return success_response(
            {
                "analyses": analyses,
                "total": total,
                "page": page,
                "limit": limit,
                "pages": (total + limit - 1) // limit,
            }
        )

    except ValueError:
        return error_response("Invalid page or limit parameter", status_code=400)
    except Exception as e:
        logger.exception(f"History endpoint error: {e}")
        return error_response("Failed to fetch history", status_code=500)


@history_bp.route("/history/<analysis_id>", methods=["DELETE"])
def delete_analysis(analysis_id: str):
    """
    DELETE /api/history/<analysis_id>
    
    Delete a specific analysis by its MongoDB ObjectId.
    """
    try:
        obj_id = ObjectId(analysis_id)
    except InvalidId:
        return error_response("Invalid analysis ID", status_code=400)

    try:
        col = get_collection("analyses")
        if col is None:
            return error_response("Database not available", status_code=503)

        result = col.delete_one({"_id": obj_id})
        if result.deleted_count == 0:
            return error_response("Analysis not found", status_code=404)

        return success_response({"deleted": True, "id": analysis_id})

    except Exception as e:
        logger.exception(f"Delete analysis error: {e}")
        return error_response("Failed to delete analysis", status_code=500)


@history_bp.route("/history/stats", methods=["GET"])
def get_stats():
    """
    GET /api/history/stats
    
    Returns aggregate statistics for analytics dashboard.
    """
    try:
        col = get_collection("analyses")
        if col is None:
            return success_response(_mock_stats())

        # Aggregate pipeline for stats
        pipeline = [
            {
                "$group": {
                    "_id": "$crop",
                    "count": {"$sum": 1},
                    "avg_yield": {"$avg": "$results.yield.total_yield"},
                    "avg_profit": {"$avg": "$results.profit.net_profit_inr"},
                    "total_area": {"$sum": "$area.hectares"},
                }
            },
            {"$sort": {"count": -1}},
        ]

        crop_stats = list(col.aggregate(pipeline))
        total_analyses = col.count_documents({})

        return success_response(
            {
                "total_analyses": total_analyses,
                "crop_breakdown": [
                    {
                        "crop": s["_id"],
                        "count": s["count"],
                        "avg_yield_kg": round(s["avg_yield"] or 0, 2),
                        "avg_profit_inr": round(s["avg_profit"] or 0, 2),
                        "total_area_ha": round(s["total_area"] or 0, 2),
                    }
                    for s in crop_stats
                ],
            }
        )

    except Exception as e:
        logger.exception(f"Stats endpoint error: {e}")
        return success_response(_mock_stats())


def _mock_stats() -> dict:
    """Return mock stats when DB is unavailable."""
    return {
        "total_analyses": 0,
        "crop_breakdown": [],
        "message": "No data yet - run your first analysis!",
    }
