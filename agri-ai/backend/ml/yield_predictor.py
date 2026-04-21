"""
Yield Prediction ML Engine
Converted from Android Java logic + enhanced with scikit-learn pipeline
"""

import numpy as np
import logging
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import Ridge

logger = logging.getLogger(__name__)

# ── Crop Base Yields (kg/hectare) ──────────────────────────────────────
CROP_BASE_YIELDS = {
    "rice": 4000,
    "maize": 3500,
    "brinjal": 25000,
    "wheat": 3200,
    "tomato": 20000,
    "potato": 18000,
    "cotton": 1800,
    "sugarcane": 60000,
    "soybean": 2500,
    "groundnut": 2200,
}

# ── Market Price per kg (INR) ─────────────────────────────────────────
CROP_MARKET_PRICE = {
    "rice": 20,
    "maize": 15,
    "brinjal": 25,
    "wheat": 22,
    "tomato": 30,
    "potato": 18,
    "cotton": 65,
    "sugarcane": 3,
    "soybean": 45,
    "groundnut": 55,
}

# ── Season Classification ─────────────────────────────────────────────
CROP_SEASON = {
    "rice": "Kharif",
    "maize": "Kharif",
    "brinjal": "Rabi",
    "wheat": "Rabi",
    "tomato": "Rabi",
    "potato": "Rabi",
    "cotton": "Kharif",
    "sugarcane": "Annual",
    "soybean": "Kharif",
    "groundnut": "Kharif",
}


class YieldPredictor:
    """
    ML-enhanced yield prediction pipeline.
    Combines rule-based logic (from Android app) with a Ridge regression model
    trained on synthetic agronomic data patterns.
    """

    def __init__(self):
        self._model = self._build_model()

    def _build_model(self) -> Pipeline:
        """Build and pre-train a simple scikit-learn pipeline on synthetic data."""
        # Generate synthetic training data based on agronomic domain knowledge
        np.random.seed(42)
        n = 500

        # Features: [base_yield_ratio, rainfall_norm, temp_norm, area_log]
        X = np.column_stack([
            np.random.uniform(0.7, 1.3, n),    # base yield ratio
            np.random.uniform(0, 1, n),          # rainfall normalized
            np.random.uniform(0, 1, n),          # temperature normalized
            np.random.uniform(0.1, 1.0, n),      # area log-normalized
        ])

        # Target: yield multiplier (ground truth = domain rule logic)
        y = np.array([
            self._rule_based_multiplier(r[1] * 2000, r[2] * 50)
            for r in X
        ]) + np.random.normal(0, 0.02, n)  # add small noise

        pipeline = Pipeline([
            ("scaler", StandardScaler()),
            ("regressor", Ridge(alpha=1.0)),
        ])
        pipeline.fit(X, y)
        logger.info("✅ Yield prediction ML model trained on synthetic data")
        return pipeline

    def _rule_based_multiplier(self, rainfall: float, temperature: float) -> float:
        """
        Original Android app logic converted to Python.
        Returns a yield multiplier based on weather conditions.
        """
        multiplier = 1.0

        # Rainfall adjustments
        if rainfall > 1300:
            multiplier += 0.15   # excess rain boost (irrigated crops)
        elif rainfall < 800:
            multiplier -= 0.20   # drought stress
        elif 800 <= rainfall <= 1300:
            multiplier += 0.05   # optimal range

        # Temperature adjustments
        if temperature > 35:
            multiplier -= 0.25   # extreme heat stress
        elif temperature > 30:
            multiplier -= 0.10   # moderate heat stress
        elif 20 <= temperature <= 28:
            multiplier += 0.10   # optimal temperature

        return max(0.3, min(1.8, multiplier))  # clamp between 0.3 and 1.8

    def predict(
        self,
        crop: str,
        area_hectares: float,
        rainfall: float,
        temperature: float,
    ) -> dict:
        """
        Predict yield for given parameters.

        Returns:
            dict with total_yield, yield_per_hectare, ml_multiplier, confidence
        """
        base_yield = CROP_BASE_YIELDS.get(crop.lower(), 3000)

        # Normalize features for ML model
        rainfall_norm = min(1.0, rainfall / 2000)
        temp_norm = min(1.0, temperature / 50)
        base_ratio = base_yield / max(CROP_BASE_YIELDS.values())
        area_norm = min(1.0, np.log1p(area_hectares) / np.log1p(1000))

        X = np.array([[base_ratio, rainfall_norm, temp_norm, area_norm]])

        # ML prediction
        ml_multiplier = float(self._model.predict(X)[0])
        ml_multiplier = max(0.3, min(1.8, ml_multiplier))

        # Rule-based multiplier (for confidence blending)
        rule_multiplier = self._rule_based_multiplier(rainfall, temperature)

        # Ensemble: 60% ML + 40% rule-based
        final_multiplier = (0.6 * ml_multiplier) + (0.4 * rule_multiplier)

        yield_per_hectare = base_yield * final_multiplier
        total_yield = yield_per_hectare * area_hectares

        # Confidence based on how far conditions are from optimal
        confidence = self._calculate_confidence(rainfall, temperature)

        return {
            "yield_per_hectare": round(yield_per_hectare, 2),
            "total_yield": round(total_yield, 2),
            "base_yield_per_hectare": base_yield,
            "ml_multiplier": round(final_multiplier, 3),
            "confidence_percent": confidence,
            "unit": "kg",
        }

    def _calculate_confidence(self, rainfall: float, temperature: float) -> int:
        """Calculate prediction confidence percentage."""
        score = 100

        # Rainfall confidence
        if 800 <= rainfall <= 1300:
            pass  # optimal
        elif rainfall < 500 or rainfall > 2000:
            score -= 20
        else:
            score -= 10

        # Temperature confidence
        if 20 <= temperature <= 28:
            pass  # optimal
        elif temperature > 40 or temperature < 10:
            score -= 20
        else:
            score -= 10

        return max(60, score)


# Singleton instance
yield_predictor = YieldPredictor()
