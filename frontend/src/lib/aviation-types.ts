export interface FlightDisruption {
  flight_id: string;
  airline: string;
  airline_code: string;
  origin_country: string;
  origin_city: string;
  origin_lat: number;
  origin_lng: number;
  destination_country: string;
  destination_city: string;
  dest_lat: number;
  dest_lng: number;
  route: string;
  status: "cancelled" | "diverted" | "delayed" | "on_time";
  cancellation_reason: string;
  airspace_status: "open" | "restricted" | "closed";
  timestamp: string;
  risk_score: number;
}

export interface AirspaceZone {
  id: string;
  name: string;
  country: string;
  status: "open" | "restricted" | "closed";
  lat: number;
  lng: number;
  radius: number;
  affected_flights: number;
  reason: string;
}

export interface AirlineImpact {
  airline: string;
  code: string;
  total_flights: number;
  cancelled: number;
  diverted: number;
  delayed: number;
  impact_score: number;
}

export interface DisruptionStats {
  total_flights_monitored: number;
  flights_affected: number;
  airlines_impacted: number;
  airspaces_restricted: number;
  routes_disrupted: number;
  cancellation_rate: number;
  avg_risk_score: number;
}

export interface PredictionInput {
  airline: string;
  origin_country: string;
  destination_country: string;
  airspace_status: string;
}

export interface PredictionResult {
  risk_score: number;
  risk_level: "low" | "moderate" | "high" | "critical";
  confidence: number;
  factors: { factor: string; weight: number }[];
  recommendation: string;
}

export interface TimelineEvent {
  date: string;
  cancellations: number;
  diversions: number;
  delays: number;
}
