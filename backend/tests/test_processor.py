"""
Tests for data processing module.
"""

import pytest
import pandas as pd
import numpy as np
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from data_processing.processor import (
    generate_synthetic_dataset,
    engineer_features,
    get_feature_columns,
    HIGH_RISK_COUNTRIES,
    SANCTIONED_AIRLINES,
)


class TestGenerateSyntheticDataset:
    def test_generates_correct_number_of_samples(self):
        """Test that dataset has correct number of rows."""
        df = generate_synthetic_dataset(n_samples=1000)
        assert len(df) == 1000

    def test_generates_required_columns(self):
        """Test that dataset contains all required columns."""
        df = generate_synthetic_dataset(n_samples=100)
        required_cols = [
            "flight_id",
            "airline",
            "origin_country",
            "destination_country",
            "airspace_status",
            "status",
            "risk_score",
        ]
        for col in required_cols:
            assert col in df.columns

    def test_flight_ids_are_unique(self):
        """Test that flight IDs are unique."""
        df = generate_synthetic_dataset(n_samples=100)
        assert df["flight_id"].nunique() == len(df)

    def test_status_values_are_valid(self):
        """Test that status column contains only valid values."""
        df = generate_synthetic_dataset(n_samples=500)
        valid_statuses = ["cancelled", "diverted", "delayed", "on_time"]
        assert df["status"].isin(valid_statuses).all()

    def test_airspace_status_values_are_valid(self):
        """Test that airspace_status contains only valid values."""
        df = generate_synthetic_dataset(n_samples=500)
        valid_airspace = ["open", "restricted", "closed"]
        assert df["airspace_status"].isin(valid_airspace).all()

    def test_risk_scores_in_valid_range(self):
        """Test that risk scores are within valid range."""
        df = generate_synthetic_dataset(n_samples=500)
        assert df["risk_score"].min() >= 0
        assert df["risk_score"].max() <= 100

    def test_deterministic_with_seed(self):
        """Test that same seed produces same data."""
        df1 = generate_synthetic_dataset(n_samples=100)
        df2 = generate_synthetic_dataset(n_samples=100)
        assert df1.equals(df2)


class TestEngineerFeatures:
    def test_creates_binary_features(self):
        """Test that binary features are created correctly."""
        df = generate_synthetic_dataset(n_samples=100)
        df = engineer_features(df)

        assert "dest_high_risk" in df.columns
        assert "origin_high_risk" in df.columns
        assert "airline_sanctioned" in df.columns

        # Check binary values (0 or 1)
        assert df["dest_high_risk"].isin([0, 1]).all()
        assert df["origin_high_risk"].isin([0, 1]).all()
        assert df["airline_sanctioned"].isin([0, 1]).all()

    def test_creates_airspace_encoding(self):
        """Test that airspace status is encoded correctly."""
        df = generate_synthetic_dataset(n_samples=100)
        df = engineer_features(df)

        assert "airspace_encoded" in df.columns
        assert df["airspace_encoded"].isin([0, 1, 2]).all()

        # Verify encoding mapping
        assert (df[df["airspace_status"] == "open"]["airspace_encoded"] == 0).all()
        assert (df[df["airspace_status"] == "restricted"]["airspace_encoded"] == 1).all()
        assert (df[df["airspace_status"] == "closed"]["airspace_encoded"] == 2).all()

    def test_creates_disruption_target(self):
        """Test that is_disrupted target is created correctly."""
        df = generate_synthetic_dataset(n_samples=100)
        df = engineer_features(df)

        assert "is_disrupted" in df.columns
        assert df["is_disrupted"].isin([0, 1]).all()

        # Verify disruption logic
        cancelled = df[df["status"] == "cancelled"]["is_disrupted"]
        diverted = df[df["status"] == "diverted"]["is_disrupted"]
        on_time = df[df["status"] == "on_time"]["is_disrupted"]

        assert (cancelled == 1).all()
        assert (diverted == 1).all()
        assert (on_time == 0).all()

    def test_high_risk_country_detection(self):
        """Test that high-risk countries are detected correctly."""
        test_data = pd.DataFrame([
            {
                "flight_id": "FL-001",
                "airline": "Emirates",
                "origin_country": "UAE",
                "destination_country": "Syria",
                "airspace_status": "open",
                "status": "on_time",
                "risk_score": 50,
            },
            {
                "flight_id": "FL-002",
                "airline": "Emirates",
                "origin_country": "UAE",
                "destination_country": "Singapore",
                "airspace_status": "open",
                "status": "on_time",
                "risk_score": 20,
            },
        ])

        df = engineer_features(test_data)
        assert df.iloc[0]["dest_high_risk"] == 1  # Syria is high risk
        assert df.iloc[1]["dest_high_risk"] == 0  # Singapore is not high risk

    def test_sanctioned_airline_detection(self):
        """Test that sanctioned airlines are detected correctly."""
        test_data = pd.DataFrame([
            {
                "flight_id": "FL-001",
                "airline": "Aeroflot",
                "origin_country": "Russia",
                "destination_country": "Germany",
                "airspace_status": "open",
                "status": "on_time",
                "risk_score": 50,
            },
            {
                "flight_id": "FL-002",
                "airline": "Emirates",
                "origin_country": "UAE",
                "destination_country": "Germany",
                "airspace_status": "open",
                "status": "on_time",
                "risk_score": 20,
            },
        ])

        df = engineer_features(test_data)
        assert df.iloc[0]["airline_sanctioned"] == 1  # Aeroflot is sanctioned
        assert df.iloc[1]["airline_sanctioned"] == 0  # Emirates is not sanctioned

    def test_does_not_modify_original_dataframe(self):
        """Test that original dataframe is not modified."""
        df_original = generate_synthetic_dataset(n_samples=10)
        cols_before = df_original.columns.tolist()

        df_engineered = engineer_features(df_original)
        cols_after = df_original.columns.tolist()

        assert cols_before == cols_after
        assert "is_disrupted" not in df_original.columns
        assert "is_disrupted" in df_engineered.columns


class TestGetFeatureColumns:
    def test_returns_list_of_strings(self):
        """Test that feature columns are returned as list of strings."""
        feature_cols = get_feature_columns()
        assert isinstance(feature_cols, list)
        assert all(isinstance(col, str) for col in feature_cols)

    def test_returns_correct_features(self):
        """Test that correct feature columns are returned."""
        feature_cols = get_feature_columns()
        expected = [
            "dest_high_risk",
            "origin_high_risk",
            "airline_sanctioned",
            "airspace_encoded",
        ]
        assert feature_cols == expected

    def test_feature_columns_exist_in_engineered_data(self):
        """Test that returned columns exist in engineered dataset."""
        df = generate_synthetic_dataset(n_samples=10)
        df = engineer_features(df)
        feature_cols = get_feature_columns()

        for col in feature_cols:
            assert col in df.columns


class TestConstants:
    def test_high_risk_countries_not_empty(self):
        """Test that high-risk countries list is not empty."""
        assert len(HIGH_RISK_COUNTRIES) > 0
        assert isinstance(HIGH_RISK_COUNTRIES, list)

    def test_sanctioned_airlines_not_empty(self):
        """Test that sanctioned airlines list is not empty."""
        assert len(SANCTIONED_AIRLINES) > 0
        assert isinstance(SANCTIONED_AIRLINES, list)

    def test_high_risk_countries_are_strings(self):
        """Test that all high-risk countries are strings."""
        assert all(isinstance(country, str) for country in HIGH_RISK_COUNTRIES)

    def test_sanctioned_airlines_are_strings(self):
        """Test that all sanctioned airlines are strings."""
        assert all(isinstance(airline, str) for airline in SANCTIONED_AIRLINES)
