import { NextResponse } from "next/server";

const HIGH_RISK_COUNTRIES = [
  "Ukraine", "Syria", "Afghanistan", "Yemen", "Somalia",
  "Libya", "Iraq", "Iran", "Russia", "Mali",
];

const SANCTIONED_AIRLINES = ["Aeroflot"];

export async function POST(request: Request) {
  const body = await request.json();
  const { airline, origin_country, destination_country, airspace_status } = body;

  if (!airline || !origin_country || !destination_country) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  let score = 20;

  if (HIGH_RISK_COUNTRIES.includes(destination_country)) score += 35;
  if (HIGH_RISK_COUNTRIES.includes(origin_country)) score += 25;
  if (SANCTIONED_AIRLINES.includes(airline)) score += 30;
  if (airspace_status === "closed") score += 25;
  if (airspace_status === "restricted") score += 15;

  score += Math.random() * 10;
  score = Math.min(99, Math.max(5, Math.round(score)));

  let risk_level: string;
  if (score >= 80) risk_level = "critical";
  else if (score >= 60) risk_level = "high";
  else if (score >= 40) risk_level = "moderate";
  else risk_level = "low";

  const factors = [
    { factor: "Destination risk", weight: HIGH_RISK_COUNTRIES.includes(destination_country) ? 0.85 : 0.2 },
    { factor: "Origin security", weight: HIGH_RISK_COUNTRIES.includes(origin_country) ? 0.7 : 0.15 },
    { factor: "Airspace status", weight: airspace_status === "closed" ? 0.9 : airspace_status === "restricted" ? 0.6 : 0.1 },
    { factor: "Carrier profile", weight: SANCTIONED_AIRLINES.includes(airline) ? 0.95 : 0.25 },
    { factor: "Geopolitical index", weight: score > 60 ? 0.75 : 0.3 },
  ].sort((a, b) => b.weight - a.weight);

  const recommendations: Record<string, string> = {
    low: "Route is currently safe for operations. Standard monitoring protocols apply.",
    moderate: "Elevated awareness recommended. Monitor situation closely.",
    high: "Significant risk. Consider alternate routing and prepare for cancellation.",
    critical: "Extreme risk. Route cancellation strongly recommended.",
  };

  return NextResponse.json({
    risk_score: score,
    risk_level,
    confidence: 87 + Math.round(Math.random() * 8),
    factors,
    recommendation: recommendations[risk_level],
  });
}
