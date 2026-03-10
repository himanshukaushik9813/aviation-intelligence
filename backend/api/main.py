"""
Aviation Disruption Intelligence Platform — FastAPI Backend
Serves ML predictions and analytics data via REST API.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ml_model.model import predict_disruption
from data_processing.processor import (
    generate_synthetic_dataset,
    engineer_features,
    HIGH_RISK_COUNTRIES,
)

app = FastAPI(
    title="Aviation Disruption Intelligence API",
    description="ML-powered aviation disruption prediction and analytics",
    version="1.0.0",
)

# Configure CORS to allow requests from frontend
# For production, consider using allow_origin_regex for better security
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://.*\.vercel\.app",  # Allow all Vercel deployments
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictionRequest(BaseModel):
    airline: str
    origin_country: str
    destination_country: str
    airspace_status: str = "open"


class PredictionResponse(BaseModel):
    risk_score: float
    risk_level: str
    confidence: float
    factors: list
    recommendation: str


@app.get("/")
def root():
    return {
        "service": "Aviation Disruption Intelligence API",
        "version": "1.0.0",
        "status": "operational",
        "endpoints": [
            "/predict",
            "/analytics/stats",
            "/analytics/high-risk-countries",
            "/health",
        ],
    }


@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    """Predict disruption risk for a given aviation route."""
    try:
        result = predict_disruption(
            airline=request.airline,
            origin_country=request.origin_country,
            destination_country=request.destination_country,
            airspace_status=request.airspace_status,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/analytics/stats")
def get_stats():
    """Get aggregated disruption statistics."""
    df = generate_synthetic_dataset(n_samples=5000)
    df = engineer_features(df)

    total = len(df)
    disrupted = df["is_disrupted"].sum()

    return {
        "total_flights": total,
        "disrupted_flights": int(disrupted),
        "disruption_rate": round(disrupted / total * 100, 2),
        "status_distribution": df["status"].value_counts().to_dict(),
        "high_risk_routes": int(df["dest_high_risk"].sum()),
        "airspace_distribution": df["airspace_status"].value_counts().to_dict(),
    }


@app.get("/analytics/high-risk-countries")
def get_high_risk_countries():
    """Get list of high-risk countries."""
    return {"countries": HIGH_RISK_COUNTRIES}


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "adip-backend"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
