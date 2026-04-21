"""
Database utility - PyMongo connection management
"""

from pymongo import MongoClient
from flask import current_app, g
import logging

logger = logging.getLogger(__name__)

_client = None


def init_db(app):
    """Initialize MongoDB connection on app startup."""
    global _client
    try:
        _client = MongoClient(app.config["MONGO_URI"], serverSelectionTimeoutMS=5000)
        # Verify connection
        _client.admin.command("ping")
        logger.info("✅ MongoDB connected successfully")
    except Exception as e:
        logger.error(f"❌ MongoDB connection failed: {e}")
        logger.warning("Running without database - history will not be saved")
        _client = None


def get_db():
    """Get database instance. Returns None if not connected."""
    if _client is None:
        return None
    try:
        db_name = current_app.config["MONGO_URI"].split("/")[-1].split("?")[0]
        return _client[db_name]
    except Exception as e:
        logger.error(f"DB access error: {e}")
        return None


def get_collection(name: str):
    """Get a specific collection. Returns None if DB not available."""
    db = get_db()
    if db is None:
        return None
    return db[name]
