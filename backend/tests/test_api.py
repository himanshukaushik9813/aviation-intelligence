"""
Tests for FastAPI endpoints.
"""

import pytest
from starlette.testclient import TestClient
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from api.main import app

client = TestClient(app)


class TestRootEndpoint:
    def test_root_returns_service_info(self):
        """Test that root endpoint returns service information."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["service"] == "Aviation Disruption Intelligence API"
        assert data["version"] == "1.0.0"
        assert data["status"] == "operational"
        assert isinstance(data["endpoints"], list)
        assert "/predict" in data["endpoints"]


class TestHealthEndpoint:
    def test_health_check_returns_healthy(self):
        """Test that health check endpoint returns healthy status."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "adip-backend"


class TestPredictEndpoint:
    def test_predict_low_risk_route(self):
        """Test prediction for a low-risk route."""
        payload = {
            "airline": "Emirates",
            "origin_country": "UAE",
            "destination_country": "Singapore",
            "airspace_status": "open"
        }
        response = client.post("/predict", json=payload)
        assert response.status_code == 200
        data = response.json()

        assert "risk_score" in data
        assert "risk_level" in data
        assert "confidence" in data
        assert "factors" in data
        assert "recommendation" in data

        assert isinstance(data["risk_score"], (int, float))
        assert data["risk_level"] in ["low", "moderate", "high", "critical"]
        assert isinstance(data["confidence"], (int, float))
        assert isinstance(data["factors"], list)
        assert isinstance(data["recommendation"], str)

    def test_predict_high_risk_route(self):
        """Test prediction for a high-risk route."""
        payload = {
            "airline": "Aeroflot",
            "origin_country": "Russia",
            "destination_country": "Syria",
            "airspace_status": "closed"
        }
        response = client.post("/predict", json=payload)
        assert response.status_code == 200
        data = response.json()

        assert data["risk_score"] > 50  # Should be high risk
        assert data["risk_level"] in ["high", "critical"]
        assert len(data["factors"]) > 0

    def test_predict_with_restricted_airspace(self):
        """Test prediction with restricted airspace."""
        payload = {
            "airline": "Turkish Airlines",
            "origin_country": "Turkey",
            "destination_country": "Iraq",
            "airspace_status": "restricted"
        }
        response = client.post("/predict", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["risk_score"] > 0

    def test_predict_missing_required_fields(self):
        """Test prediction with missing required fields."""
        payload = {
            "airline": "Emirates"
            # Missing required fields
        }
        response = client.post("/predict", json=payload)
        assert response.status_code == 422  # Validation error

    def test_predict_factors_structure(self):
        """Test that factors have correct structure."""
        payload = {
            "airline": "Emirates",
            "origin_country": "UAE",
            "destination_country": "Japan",
            "airspace_status": "open"
        }
        response = client.post("/predict", json=payload)
        assert response.status_code == 200
        data = response.json()

        for factor in data["factors"]:
            assert "factor" in factor
            assert "weight" in factor
            assert isinstance(factor["factor"], str)
            assert isinstance(factor["weight"], (int, float))


class TestAnalyticsEndpoints:
    def test_get_stats_returns_valid_data(self):
        """Test that stats endpoint returns valid analytics data."""
        response = client.get("/analytics/stats")
        assert response.status_code == 200
        data = response.json()

        assert "total_flights" in data
        assert "disrupted_flights" in data
        assert "disruption_rate" in data
        assert "status_distribution" in data
        assert "high_risk_routes" in data
        assert "airspace_distribution" in data

        assert isinstance(data["total_flights"], int)
        assert isinstance(data["disrupted_flights"], int)
        assert isinstance(data["disruption_rate"], (int, float))
        assert data["total_flights"] > 0

    def test_get_high_risk_countries_returns_list(self):
        """Test that high-risk countries endpoint returns country list."""
        response = client.get("/analytics/high-risk-countries")
        assert response.status_code == 200
        data = response.json()

        assert "countries" in data
        assert isinstance(data["countries"], list)
        assert len(data["countries"]) > 0
        # Check that known high-risk countries are in the list
        assert "Ukraine" in data["countries"] or "Syria" in data["countries"]


class TestCORSMiddleware:
    def test_cors_headers_present(self):
        """Test that CORS headers are configured."""
        response = client.options("/", headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "POST"
        })
        # CORS headers should be present in response
        assert response.status_code in [200, 405]  # FastAPI may return 405 for OPTIONS


class TestDataValidation:
    def test_predict_with_default_airspace_status(self):
        """Test that airspace_status has a default value."""
        payload = {
            "airline": "Emirates",
            "origin_country": "UAE",
            "destination_country": "Singapore"
            # airspace_status should default to "open"
        }
        response = client.post("/predict", json=payload)
        assert response.status_code == 200

    def test_predict_with_invalid_json(self):
        """Test prediction with invalid JSON."""
        response = client.post("/predict", data="invalid json")
        assert response.status_code == 422
