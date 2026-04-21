"""
AgriAI Backend - Flask Application Factory
Production-ready AI-powered agriculture assistant API
"""

import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from routes.analyze import analyze_bp
from routes.history import history_bp
from routes.weather import weather_bp
from utils.db import init_db

# Load environment variables
load_dotenv()


def create_app(config=None):
    """Application factory pattern for Flask."""
    app = Flask(__name__)

    # ── Configuration ──────────────────────────────────────────
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-change-me")
    app.config["MONGO_URI"] = os.getenv(
        "MONGO_URI", "mongodb://localhost:27017/agri_ai"
    )
    app.config["OPENWEATHER_API_KEY"] = os.getenv("OPENWEATHER_API_KEY", "")
    app.config["ENV"] = os.getenv("FLASK_ENV", "production")

    if config:
        app.config.update(config)

    # ── CORS ───────────────────────────────────────────────────
    allowed_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    CORS(
        app,
        resources={r"/*": {"origins": allowed_origins}},
        supports_credentials=True,
    )

    # ── Database ───────────────────────────────────────────────
    with app.app_context():
        init_db(app)

    # ── Blueprints ─────────────────────────────────────────────
    app.register_blueprint(analyze_bp, url_prefix="/api")
    app.register_blueprint(history_bp, url_prefix="/api")
    app.register_blueprint(weather_bp, url_prefix="/api")

    # ── Health Check ───────────────────────────────────────────
    @app.route("/health")
    def health():
        return jsonify({"status": "healthy", "service": "agri-ai-backend"}), 200

    # ── Root ───────────────────────────────────────────────────
    @app.route("/")
    def root():
        return jsonify(
            {
                "message": "AgriAI API",
                "version": "1.0.0",
                "endpoints": ["/api/analyze", "/api/history", "/api/weather"],
            }
        )

    # ── Error Handlers ─────────────────────────────────────────
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": "Internal server error"}), 500

    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"error": "Bad request", "message": str(e)}), 400

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=os.getenv("FLASK_ENV") == "development")
