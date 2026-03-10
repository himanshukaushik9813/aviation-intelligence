"""
Tests for ML model module.
"""

import pytest
import numpy as np
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ml_model.model import predict_disruption


class TestPredictDisruption:
    def test_returns_valid_structure(self):
        """Test that prediction returns correct structure."""
        result = predict_disruption(
            airline="Emirates",
            origin_country="UAE",
            destination_country="Singapore",
            airspace_status="open"
        )

        assert "risk_score" in result
        assert "risk_level" in result
        assert "confidence" in result
        assert "factors" in result
        assert "recommendation" in result

    def test_risk_score_in_valid_range(self):
        """Test that risk score is within valid range."""
        result = predict_disruption(
            airline="Emirates",
            origin_country="UAE",
            destination_country="Japan",
            airspace_status="open"
        )

        assert isinstance(result["risk_score"], (int, float))
        assert 0 <= result["risk_score"] <= 100

    def test_risk_level_values(self):
        """Test that risk level is one of the valid values."""
        result = predict_disruption(
            airline="Emirates",
            origin_country="UAE",
            destination_country="Singapore",
            airspace_status="open"
        )

        valid_levels = ["low", "moderate", "high", "critical"]
        assert result["risk_level"] in valid_levels

    def test_confidence_in_valid_range(self):
        """Test that confidence is within valid range."""
        result = predict_disruption(
            airline="Emirates",
            origin_country="UAE",
            destination_country="Singapore",
            airspace_status="open"
        )

        assert isinstance(result["confidence"], (int, float))
        assert 0 <= result["confidence"] <= 100

    def test_factors_structure(self):
        """Test that factors have correct structure."""
        result = predict_disruption(
            airline="Emirates",
            origin_country="UAE",
            destination_country="Singapore",
            airspace_status="open"
        )

        assert isinstance(result["factors"], list)
        assert len(result["factors"]) > 0

        for factor in result["factors"]:
            assert "factor" in factor
            assert "weight" in factor
            assert isinstance(factor["factor"], str)
            assert isinstance(factor["weight"], (int, float))

    def test_recommendation_is_string(self):
        """Test that recommendation is a non-empty string."""
        result = predict_disruption(
            airline="Emirates",
            origin_country="UAE",
            destination_country="Singapore",
            airspace_status="open"
        )

        assert isinstance(result["recommendation"], str)
        assert len(result["recommendation"]) > 0

    def test_high_risk_route_prediction(self):
        """Test prediction for high-risk route."""
        result = predict_disruption(
            airline="Aeroflot",
            origin_country="Russia",
            destination_country="Syria",
            airspace_status="closed"
        )

        # High risk route should have high risk score
        assert result["risk_score"] > 50
        assert result["risk_level"] in ["high", "critical"]

    def test_low_risk_route_prediction(self):
        """Test prediction for low-risk route."""
        result = predict_disruption(
            airline="Emirates",
            origin_country="UAE",
            destination_country="Singapore",
            airspace_status="open"
        )

        # Low risk route should have lower risk score
        assert result["risk_level"] in ["low", "moderate"]

    def test_sanctioned_airline_increases_risk(self):
        """Test that sanctioned airline increases risk."""
        safe_result = predict_disruption(
            airline="Emirates",
            origin_country="UAE",
            destination_country="Germany",
            airspace_status="open"
        )

        risky_result = predict_disruption(
            airline="Aeroflot",
            origin_country="UAE",
            destination_country="Germany",
            airspace_status="open"
        )

        # Sanctioned airline should have higher risk
        assert risky_result["risk_score"] > safe_result["risk_score"]

    def test_high_risk_destination_increases_risk(self):
        """Test that high-risk destination increases risk."""
        safe_result = predict_disruption(
            airline="Emirates",
            origin_country="UAE",
            destination_country="Singapore",
            airspace_status="open"
        )

        risky_result = predict_disruption(
            airline="Emirates",
            origin_country="UAE",
            destination_country="Syria",
            airspace_status="open"
        )

        # High-risk destination should have higher risk
        assert risky_result["risk_score"] > safe_result["risk_score"]

    def test_closed_airspace_increases_risk(self):
        """Test that closed airspace increases risk."""
        open_result = predict_disruption(
            airline="Emirates",
            origin_country="UAE",
            destination_country="Turkey",
            airspace_status="open"
        )

        closed_result = predict_disruption(
            airline="Emirates",
            origin_country="UAE",
            destination_country="Turkey",
            airspace_status="closed"
        )

        # Closed airspace should have higher risk
        assert closed_result["risk_score"] > open_result["risk_score"]

    def test_restricted_airspace_increases_risk(self):
        """Test that restricted airspace increases risk."""
        open_result = predict_disruption(
            airline="Emirates",
            origin_country="UAE",
            destination_country="Turkey",
            airspace_status="open"
        )

        restricted_result = predict_disruption(
            airline="Emirates",
            origin_country="UAE",
            destination_country="Turkey",
            airspace_status="restricted"
        )

        # Restricted airspace should have higher risk than open
        assert restricted_result["risk_score"] >= open_result["risk_score"]

    def test_risk_level_matches_risk_score(self):
        """Test that risk level correctly reflects risk score."""
        test_cases = [
            ("Emirates", "UAE", "Singapore", "open"),
            ("Aeroflot", "Russia", "Syria", "closed"),
            ("Turkish Airlines", "Turkey", "Iraq", "restricted"),
        ]

        for airline, origin, dest, airspace in test_cases:
            result = predict_disruption(airline, origin, dest, airspace)
            score = result["risk_score"]
            level = result["risk_level"]

            if score >= 80:
                assert level == "critical"
            elif score >= 60:
                assert level == "high"
            elif score >= 40:
                assert level == "moderate"
            else:
                assert level == "low"

    def test_factors_sorted_by_weight(self):
        """Test that factors are sorted by weight in descending order."""
        result = predict_disruption(
            airline="Emirates",
            origin_country="UAE",
            destination_country="Singapore",
            airspace_status="open"
        )

        weights = [factor["weight"] for factor in result["factors"]]
        # Check if sorted in descending order
        assert weights == sorted(weights, reverse=True)

    def test_different_routes_give_different_results(self):
        """Test that different routes produce different risk scores."""
        result1 = predict_disruption(
            airline="Emirates",
            origin_country="UAE",
            destination_country="Singapore",
            airspace_status="open"
        )

        result2 = predict_disruption(
            airline="Aeroflot",
            origin_country="Russia",
            destination_country="Syria",
            airspace_status="closed"
        )

        # Very different routes should have different risk scores
        assert result1["risk_score"] != result2["risk_score"]
        assert result1["risk_level"] != result2["risk_level"]

    def test_prediction_is_deterministic(self):
        """Test that same inputs produce same results (excluding random confidence)."""
        result1 = predict_disruption(
            airline="Emirates",
            origin_country="UAE",
            destination_country="Singapore",
            airspace_status="open"
        )

        result2 = predict_disruption(
            airline="Emirates",
            origin_country="UAE",
            destination_country="Singapore",
            airspace_status="open"
        )

        assert result1["risk_score"] == result2["risk_score"]
        assert result1["risk_level"] == result2["risk_level"]
        # Confidence may vary slightly due to random component
