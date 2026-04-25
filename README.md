# 🌾 AgriAI — AI-Powered Agriculture Assistant

A production-grade full-stack web platform that converts Android agriculture app logic into a modern web application. Built with React + Vite, Flask, MongoDB, and Docker.

---

## 📦 Tech Stack

| Layer      | Technology                                       |
|------------|--------------------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, Framer Motion      |
| Maps       | React Leaflet (OpenStreetMap)                    |
| Charts     | Recharts                                         |
| HTTP       | Axios (with retry logic)                         |
| Backend    | Python Flask, Blueprints, REST API               |
| ML         | scikit-learn (Ridge regression pipeline)         |
| Database   | MongoDB 7, PyMongo                               |
| Deployment | Docker, docker-compose, Nginx, Gunicorn          |

---

## 🗂️ Project Structure

```
agri-ai/
├── docker-compose.yml
├── .env.example
├── docker/
│   └── mongo-init.js
│
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── components/
│       │   ├── layout/     (Navbar, PageWrapper)
│       │   ├── map/        (MapView)
│       │   ├── forms/      (AnalysisForm)
│       │   ├── charts/     (AnalyticsCharts)
│       │   └── ui/         (KPICard, ResultsPanel, Skeleton, WeatherBadge)
│       ├── pages/
│       │   ├── LandingPage.jsx
│       │   ├── DashboardPage.jsx
│       │   ├── HistoryPage.jsx
│       │   └── AnalyticsPage.jsx
│       ├── hooks/
│       │   ├── useAnalysis.js
│       │   ├── useGeolocation.js
│       │   └── useCounter.js
│       ├── services/
│       │   └── api.js
│       └── styles/
│           └── globals.css
│
└── backend/
    ├── Dockerfile
    ├── requirements.txt
    ├── app.py
    ├── routes/
    │   ├── analyze.py
    │   ├── history.py
    │   └── weather.py
    ├── ml/
    │   ├── yield_predictor.py
    │   └── agri_logic.py
    ├── models/
    │   └── analysis.py
    └── utils/
        ├── db.py
        ├── validators.py
        ├── helpers.py
        └── weather_service.py
```

---

## 🚀 Quick Start (Docker — Recommended)

### 1. Clone and Configure

```bash
git clone <your-repo-url> agri-ai
cd agri-ai
cp .env.example .env
```

Edit `.env` and set at minimum:
- `OPENWEATHER_API_KEY` — free key from [openweathermap.org](https://openweathermap.org/api)
- `SECRET_KEY` — any random string for Flask

### 2. Build and Run

```bash
docker-compose up --build
```

This starts **3 containers**:
- `agri_frontend` → http://localhost:3000 , custom domain
- `agri_backend`  → http://localhost:5000
- `agri_mongodb`  → port 27017

### 3. Open the App

Navigate to **http://localhost:3000** in your browser.

---

## 💻 Local Development (Without Docker)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set env vars (or create .env file in backend/)
export MONGO_URI=mongodb://localhost:27017/agri_ai
export OPENWEATHER_API_KEY=your_key_here
export FLASK_ENV=development

python app.py
# Backend runs at http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install

# Create .env.local
echo "VITE_API_URL=http://localhost:5000" > .env.local

npm run dev
# Frontend runs at http://localhost:3000
```

### MongoDB

If you have MongoDB installed locally:
```bash
mongod --dbpath /data/db
```

Or use Docker for just MongoDB:
```bash
docker run -d -p 27017:27017 --name agri_mongo mongo:7.0
```

---

## 🌿 Environment Variables

| Variable              | Required | Default              | Description                              |
|-----------------------|----------|----------------------|------------------------------------------|
| `MONGO_USERNAME`      | No       | `admin`              | MongoDB root username                    |
| `MONGO_PASSWORD`      | No       | `agri_secret_2024`   | MongoDB root password                    |
| `MONGO_DB`            | No       | `agri_ai`            | MongoDB database name                    |
| `FLASK_ENV`           | No       | `production`         | Flask environment                        |
| `SECRET_KEY`          | **Yes**  | —                    | Flask secret key (change in production!) |
| `OPENWEATHER_API_KEY` | No       | —                    | OpenWeatherMap API key (free tier works) |
| `CORS_ORIGINS`        | No       | `http://localhost:3000` | Allowed CORS origins (comma-separated)|
| `VITE_API_URL`        | No       | `http://localhost:5000` | Backend URL for frontend               |

---

## 📡 API Documentation

### Base URL
- Local: `http://localhost:5000`
- Docker: `http://backend:5000` (internal)

### `POST /api/analyze`

Run full agricultural analysis for a field.

**Request Body:**
```json
{
  "crop": "rice",
  "area": 2.5,
  "unit": "hectare",
  "latitude": 20.5937,
  "longitude": 78.9629
}
```

**Supported crops:** `rice`, `maize`, `wheat`, `brinjal`, `tomato`, `potato`, `cotton`, `sugarcane`, `soybean`, `groundnut`

**Supported units:** `acre`, `hectare`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "input": { "crop": "rice", "area": 2.5, "unit": "hectare", "area_hectares": 2.5 },
    "weather": {
      "temperature": 28.5,
      "rainfall_annual_mm": 1050,
      "humidity_percent": 72,
      "source": "openweathermap"
    },
    "yield": {
      "yield_per_hectare": 4200,
      "total_yield": 10500,
      "ml_multiplier": 1.05,
      "confidence_percent": 90
    },
    "irrigation": {
      "required": true,
      "schedule": "Weekly irrigation",
      "frequency_days": 7,
      "method": "Sprinkler or furrow irrigation"
    },
    "fertilizer": {
      "NPK": { "N_kg": 300, "P_kg": 150, "K_kg": 100 },
      "application_schedule": [...]
    },
    "pest_control": {
      "rotation": [...],
      "target_pests": ["Stem borer", "Leaf folder"]
    },
    "profit": {
      "gross_revenue_inr": 210000,
      "input_cost_inr": 62500,
      "net_profit_inr": 147500,
      "roi_percent": 236
    }
  }
}
```

---

### `GET /api/weather?lat={lat}&lon={lon}`

Fetch current weather for coordinates.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "weather": {
      "temperature": 28.5,
      "rainfall_annual_mm": 1050,
      "humidity_percent": 72,
      "wind_speed_kmh": 14,
      "description": "Partly cloudy",
      "source": "openweathermap"
    }
  }
}
```

---

### `GET /api/history`

Get paginated list of past analyses.

**Query Params:**
- `page` (int, default: 1)
- `limit` (int, default: 20, max: 100)
- `crop` (string, optional filter)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "analyses": [...],
    "total": 42,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

---

### `GET /api/history/stats`

Get aggregated statistics for the analytics dashboard.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total_analyses": 42,
    "crop_breakdown": [
      {
        "crop": "rice",
        "count": 15,
        "avg_yield_kg": 10500,
        "avg_profit_inr": 147500,
        "total_area_ha": 37.5
      }
    ]
  }
}
```

---

### `DELETE /api/history/{id}`

Delete a specific analysis.

**Response (200):**
```json
{ "success": true, "data": { "deleted": true, "id": "abc123" } }
```

---

### `GET /health`

Health check endpoint.

**Response (200):**
```json
{ "status": "healthy", "service": "agri-ai-backend" }
```

---

## 🧠 ML Logic Reference

### Yield Prediction
| Crop       | Base Yield (kg/ha) |
|------------|--------------------|
| Rice       | 4,000              |
| Maize      | 3,500              |
| Wheat      | 3,200              |
| Brinjal    | 25,000             |
| Tomato     | 20,000             |
| Potato     | 18,000             |

**Weather Adjustments:**
- Rainfall > 1300mm → +15% yield
- Rainfall < 800mm → −20% yield
- Temperature > 30°C → −10% yield
- Temperature > 35°C → −25% yield

**Model:** 60% scikit-learn Ridge regression + 40% rule-based ensemble.

### Irrigation Logic
| Condition        | Schedule             |
|------------------|----------------------|
| Rainfall > 1300mm | No irrigation needed |
| Rainfall < 800mm  | Every 3 days         |
| 800–1300mm        | Weekly               |

### Fertilizer (Rice Example)
- N = 120 kg/ha × area
- P = 60 kg/ha × area
- K = 40 kg/ha × area

### Pest Rotation
Neem Oil → Spinosad → Emamectin Benzoate (24-day cycle)

### Profit Formula
`net_profit = (total_yield × market_price_per_kg) − (input_cost_per_ha × area)`

---

## 🐳 Docker Services

| Service   | Image           | Port  | Description              |
|-----------|-----------------|-------|--------------------------|
| frontend  | nginx:alpine    | 3000  | React SPA via Nginx      |
| backend   | python:3.11     | 5000  | Flask API via Gunicorn   |
| mongodb   | mongo:7.0       | 27017 | MongoDB with auth        |

---

## 🔒 Production Checklist

- [ ] Set `SECRET_KEY` to a cryptographically random value
- [ ] Set `MONGO_PASSWORD` to a strong password
- [ ] Add `OPENWEATHER_API_KEY` from openweathermap.org
- [ ] Update `CORS_ORIGINS` to your production frontend URL
- [ ] Set up SSL/TLS with a reverse proxy (e.g., Traefik, Nginx Proxy Manager)
- [ ] Configure MongoDB replica set for production
- [ ] Add log aggregation (e.g., ELK, Datadog)
- [ ] Set up monitoring/alerting

---

## 🎨 UI Color Palette

| Name       | Hex       | Usage                        |
|------------|-----------|------------------------------|
| Sage Hint  | `#BFCFBB` | Page background              |
| Mint       | `#A8BFA6` | Card backgrounds             |
| Sage       | `#8EA58C` | Primary UI elements          |
| Moss       | `#738A6E` | Hover states, secondary text |
| Evergreen  | `#344C3D` | Text, headers, buttons       |

---

## 📄 License

MIT License — free to use, modify, and deploy.
