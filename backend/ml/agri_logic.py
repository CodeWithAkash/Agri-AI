"""
Agriculture Logic Engine
Converted from Android Java logic to Python
Handles: Irrigation, Fertilizer, Pest Control, Profit calculations
"""

import logging

logger = logging.getLogger(__name__)

# ── Pest Rotation Schedule ────────────────────────────────────────────
PEST_ROTATION = ["Neem Oil", "Spinosad", "Emamectin Benzoate"]

# ── Fertilizer Profiles (kg/hectare) ─────────────────────────────────
FERTILIZER_PROFILES = {
    "rice":      {"N": 120, "P": 60,  "K": 40},
    "maize":     {"N": 150, "P": 75,  "K": 50},
    "wheat":     {"N": 120, "P": 60,  "K": 40},
    "brinjal":   {"N": 100, "P": 50,  "K": 80},
    "tomato":    {"N": 110, "P": 55,  "K": 90},
    "potato":    {"N": 130, "P": 90,  "K": 120},
    "cotton":    {"N": 160, "P": 80,  "K": 60},
    "sugarcane": {"N": 250, "P": 100, "K": 150},
    "soybean":   {"N": 20,  "P": 60,  "K": 40},
    "groundnut": {"N": 25,  "P": 50,  "K": 50},
}

# ── Water Requirement (mm/season) ─────────────────────────────────────
CROP_WATER_REQUIREMENT = {
    "rice": 1200, "maize": 500, "wheat": 450, "brinjal": 600,
    "tomato": 550, "potato": 500, "cotton": 700, "sugarcane": 1500,
    "soybean": 450, "groundnut": 500,
}

# ── Market Price per kg (INR) ─────────────────────────────────────────
CROP_MARKET_PRICE = {
    "rice": 20, "maize": 15, "brinjal": 25, "wheat": 22,
    "tomato": 30, "potato": 18, "cotton": 65, "sugarcane": 3,
    "soybean": 45, "groundnut": 55,
}

# ── Input Cost per hectare (INR) ──────────────────────────────────────
CROP_INPUT_COST = {
    "rice": 25000, "maize": 18000, "wheat": 20000, "brinjal": 30000,
    "tomato": 35000, "potato": 40000, "cotton": 28000, "sugarcane": 45000,
    "soybean": 15000, "groundnut": 18000,
}


def calculate_irrigation(rainfall: float, crop: str) -> dict:
    """
    Irrigation recommendation based on rainfall and crop type.
    Ported from Android Java logic.
    
    Args:
        rainfall: Annual rainfall in mm
        crop: Crop type
    
    Returns:
        dict with schedule, frequency_days, method, notes
    """
    water_req = CROP_WATER_REQUIREMENT.get(crop.lower(), 600)

    if rainfall > 1300:
        return {
            "required": False,
            "schedule": "No irrigation required",
            "frequency_days": None,
            "method": "Rainfall sufficient",
            "monthly_requirement_mm": 0,
            "notes": "Monitor for waterlogging during heavy rain periods",
            "efficiency_tip": "Install drainage channels to prevent root rot",
        }
    elif rainfall < 800:
        return {
            "required": True,
            "schedule": "Irrigate every 3 days",
            "frequency_days": 3,
            "method": "Drip irrigation recommended",
            "monthly_requirement_mm": round((water_req - rainfall) / 12, 1),
            "notes": "Critical irrigation zone - monitor soil moisture daily",
            "efficiency_tip": "Mulching can reduce water loss by up to 35%",
        }
    else:
        return {
            "required": True,
            "schedule": "Weekly irrigation",
            "frequency_days": 7,
            "method": "Sprinkler or furrow irrigation",
            "monthly_requirement_mm": round((water_req - rainfall) / 12, 1),
            "notes": "Supplemental irrigation during dry spells",
            "efficiency_tip": "Early morning irrigation minimizes evaporation",
        }


def calculate_fertilizer(crop: str, area_hectares: float) -> dict:
    """
    NPK fertilizer calculation based on crop type and area.
    
    Args:
        crop: Crop type
        area_hectares: Area in hectares
    
    Returns:
        dict with N, P, K quantities and application schedule
    """
    profile = FERTILIZER_PROFILES.get(crop.lower(), {"N": 100, "P": 50, "K": 40})

    n_total = round(profile["N"] * area_hectares, 2)
    p_total = round(profile["P"] * area_hectares, 2)
    k_total = round(profile["K"] * area_hectares, 2)

    return {
        "NPK": {
            "N_kg": n_total,
            "P_kg": p_total,
            "K_kg": k_total,
        },
        "per_hectare": profile,
        "application_schedule": [
            {
                "stage": "Basal (pre-planting)",
                "percentage": 30,
                "N_kg": round(n_total * 0.30, 2),
                "P_kg": p_total,  # full P at basal
                "K_kg": round(k_total * 0.50, 2),
            },
            {
                "stage": "Top dressing 1 (25-30 days)",
                "percentage": 40,
                "N_kg": round(n_total * 0.40, 2),
                "P_kg": 0,
                "K_kg": round(k_total * 0.30, 2),
            },
            {
                "stage": "Top dressing 2 (50-60 days)",
                "percentage": 30,
                "N_kg": round(n_total * 0.30, 2),
                "P_kg": 0,
                "K_kg": round(k_total * 0.20, 2),
            },
        ],
        "notes": (
            f"Use urea for N, SSP for P, MOP for K. "
            f"Soil test recommended before application."
        ),
    }


def get_pest_control(crop: str) -> dict:
    """
    Pest control rotation schedule.
    Rotation: Neem → Spinosad → Emamectin Benzoate
    
    Returns:
        dict with rotation schedule and application guidance
    """
    crop_specific_pests = {
        "rice": ["Stem borer", "Leaf folder", "Brown plant hopper"],
        "maize": ["Fall armyworm", "Corn borer", "Aphids"],
        "wheat": ["Aphids", "Rust", "Powdery mildew"],
        "brinjal": ["Shoot & fruit borer", "Aphids", "Whitefly"],
        "tomato": ["Fruit borer", "Whitefly", "Thrips"],
        "potato": ["Colorado beetle", "Aphids", "Late blight"],
        "cotton": ["Bollworm", "Whitefly", "Thrips"],
        "sugarcane": ["Stem borer", "Woolly aphid", "Mealybug"],
        "soybean": ["Pod borer", "Aphids", "Whitefly"],
        "groundnut": ["Leaf miner", "Aphids", "Bud necrosis"],
    }

    pests = crop_specific_pests.get(crop.lower(), ["Aphids", "Caterpillars", "Whitefly"])

    rotation = [
        {
            "order": 1,
            "product": "Neem Oil",
            "type": "Organic / Biopesticide",
            "dose_per_liter": "5 ml/L",
            "interval_days": 7,
            "target": "Early infestation, preventive",
            "notes": "Safe for beneficial insects, apply in evening",
        },
        {
            "order": 2,
            "product": "Spinosad",
            "type": "Bioinsecticide",
            "dose_per_liter": "0.45 ml/L",
            "interval_days": 7,
            "target": "Caterpillars, thrips, borers",
            "notes": "Low toxicity to mammals, PHI 7 days",
        },
        {
            "order": 3,
            "product": "Emamectin Benzoate",
            "type": "Chemical insecticide",
            "dose_per_liter": "0.5 g/L",
            "interval_days": 10,
            "target": "Heavy infestation, borers",
            "notes": "Use only as last resort, observe 14-day PHI",
        },
    ]

    return {
        "rotation": rotation,
        "target_pests": pests,
        "cycle_days": 24,
        "ipm_note": (
            "Follow Integrated Pest Management (IPM). "
            "Rotate chemicals to prevent resistance buildup."
        ),
    }


def calculate_profit(
    total_yield_kg: float,
    area_hectares: float,
    crop: str,
) -> dict:
    """
    Profit estimation.
    Formula: profit = total_yield × market_price - input_cost
    
    Returns:
        dict with revenue, cost, profit, ROI
    """
    price_per_kg = CROP_MARKET_PRICE.get(crop.lower(), 20)
    input_cost_per_ha = CROP_INPUT_COST.get(crop.lower(), 25000)

    gross_revenue = round(total_yield_kg * price_per_kg, 2)
    total_input_cost = round(input_cost_per_ha * area_hectares, 2)
    net_profit = round(gross_revenue - total_input_cost, 2)
    roi_percent = round((net_profit / total_input_cost * 100) if total_input_cost > 0 else 0, 1)
    profit_per_hectare = round(net_profit / area_hectares if area_hectares > 0 else 0, 2)

    return {
        "gross_revenue_inr": gross_revenue,
        "input_cost_inr": total_input_cost,
        "net_profit_inr": net_profit,
        "profit_per_hectare_inr": profit_per_hectare,
        "roi_percent": roi_percent,
        "price_per_kg_inr": price_per_kg,
        "breakeven_yield_kg": round(total_input_cost / price_per_kg, 2),
        "is_profitable": net_profit > 0,
    }
