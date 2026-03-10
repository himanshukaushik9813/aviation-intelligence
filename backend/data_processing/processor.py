"""
Aviation Disruption Data Processor
Handles data ingestion, cleaning, and feature engineering for the ML pipeline.
"""

import pandas as pd
import numpy as np
from typing import Optional


HIGH_RISK_COUNTRIES = [
    "Ukraine", "Syria", "Afghanistan", "Yemen", "Somalia",
    "Libya", "Iraq", "Iran", "Russia", "Mali",
]

SANCTIONED_AIRLINES = ["Aeroflot"]


def generate_synthetic_dataset(n_samples: int = 5000) -> pd.DataFrame:
    """Generate synthetic aviation disruption dataset for model training."""
    np.random.seed(42)

    airlines = [
        "Lufthansa", "Emirates", "Turkish Airlines", "British Airways",
        "Air France", "Qatar Airways", "United Airlines", "Singapore Airlines",
        "Aeroflot", "El Al", "Korean Air", "Cathay Pacific",
        "Ethiopian Airlines", "Air India", "American Airlines",
    ]

    countries = [
        "United States", "United Kingdom", "Germany", "France", "Turkey",
        "UAE", "Qatar", "Israel", "Russia", "Ukraine", "Syria", "Iraq",
        "Iran", "Afghanistan", "Pakistan", "India", "Singapore",
        "South Korea", "Japan", "Ethiopia", "Somalia", "Mali",
        "Libya", "Yemen", "Lebanon", "Venezuela", "Myanmar", "Hong Kong",
    ]

    statuses = ["cancelled", "diverted", "delayed", "on_time"]
    airspace_statuses = ["open", "restricted", "closed"]

    records = []
    for i in range(n_samples):
        origin = np.random.choice(countries)
        destination = np.random.choice(countries)
        airline = np.random.choice(airlines)
        airspace = np.random.choice(airspace_statuses, p=[0.5, 0.3, 0.2])

        # Simulate risk-based status
        risk = 20
        if destination in HIGH_RISK_COUNTRIES:
            risk += 30
        if origin in HIGH_RISK_COUNTRIES:
            risk += 20
        if airline in SANCTIONED_AIRLINES:
            risk += 25
        if airspace == "closed":
            risk += 20
        elif airspace == "restricted":
            risk += 10

        risk += np.random.normal(0, 10)
        risk = np.clip(risk, 0, 100)

        if risk > 75:
            status = np.random.choice(statuses, p=[0.6, 0.15, 0.15, 0.1])
        elif risk > 50:
            status = np.random.choice(statuses, p=[0.2, 0.2, 0.35, 0.25])
        elif risk > 30:
            status = np.random.choice(statuses, p=[0.05, 0.1, 0.25, 0.6])
        else:
            status = np.random.choice(statuses, p=[0.02, 0.03, 0.1, 0.85])

        records.append({
            "flight_id": f"FL-{i:05d}",
            "airline": airline,
            "origin_country": origin,
            "destination_country": destination,
            "airspace_status": airspace,
            "status": status,
            "risk_score": round(risk, 1),
        })

    return pd.DataFrame(records)


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Apply feature engineering to the dataset."""
    df = df.copy()

    # Binary features
    df["dest_high_risk"] = df["destination_country"].isin(HIGH_RISK_COUNTRIES).astype(int)
    df["origin_high_risk"] = df["origin_country"].isin(HIGH_RISK_COUNTRIES).astype(int)
    df["airline_sanctioned"] = df["airline"].isin(SANCTIONED_AIRLINES).astype(int)

    # Airspace encoding
    airspace_map = {"open": 0, "restricted": 1, "closed": 2}
    df["airspace_encoded"] = df["airspace_status"].map(airspace_map)

    # Target: is_disrupted (cancelled or diverted)
    df["is_disrupted"] = df["status"].isin(["cancelled", "diverted"]).astype(int)

    return df


def get_feature_columns() -> list:
    """Return list of feature columns used by the model."""
    return [
        "dest_high_risk",
        "origin_high_risk",
        "airline_sanctioned",
        "airspace_encoded",
    ]


if __name__ == "__main__":
    df = generate_synthetic_dataset()
    df = engineer_features(df)
    print(f"Dataset shape: {df.shape}")
    print(f"\nDisruption rate: {df['is_disrupted'].mean():.2%}")
    print(f"\nStatus distribution:\n{df['status'].value_counts(normalize=True)}")
    print(f"\nFeature columns: {get_feature_columns()}")
