import type {
  FlightDisruption,
  AirspaceZone,
  AirlineImpact,
  DisruptionStats,
  TimelineEvent,
} from "./aviation-types";

export const disruptionStats: DisruptionStats = {
  total_flights_monitored: 48729,
  flights_affected: 3847,
  airlines_impacted: 142,
  airspaces_restricted: 23,
  routes_disrupted: 891,
  cancellation_rate: 7.89,
  avg_risk_score: 62.4,
};

export const flightDisruptions: FlightDisruption[] = [
  {
    flight_id: "UA-4821", airline: "United Airlines", airline_code: "UA",
    origin_country: "United States", origin_city: "New York", origin_lat: 40.6413, origin_lng: -73.7781,
    destination_country: "Ukraine", destination_city: "Kyiv", dest_lat: 50.4019, dest_lng: 30.4507,
    route: "JFK → KBP", status: "cancelled", cancellation_reason: "Airspace closure - conflict zone",
    airspace_status: "closed", timestamp: "2026-03-09T08:30:00Z", risk_score: 95,
  },
  {
    flight_id: "LH-1903", airline: "Lufthansa", airline_code: "LH",
    origin_country: "Germany", origin_city: "Frankfurt", origin_lat: 50.0379, origin_lng: 8.5622,
    destination_country: "Israel", destination_city: "Tel Aviv", dest_lat: 32.0055, dest_lng: 34.8854,
    route: "FRA → TLV", status: "diverted", cancellation_reason: "Security concerns - regional tensions",
    airspace_status: "restricted", timestamp: "2026-03-09T10:15:00Z", risk_score: 82,
  },
  {
    flight_id: "EK-502", airline: "Emirates", airline_code: "EK",
    origin_country: "UAE", origin_city: "Dubai", origin_lat: 25.2532, origin_lng: 55.3657,
    destination_country: "Iran", destination_city: "Tehran", dest_lat: 35.6891, dest_lng: 51.3114,
    route: "DXB → IKA", status: "cancelled", cancellation_reason: "Diplomatic tensions - airspace restrictions",
    airspace_status: "closed", timestamp: "2026-03-09T06:45:00Z", risk_score: 91,
  },
  {
    flight_id: "SQ-321", airline: "Singapore Airlines", airline_code: "SQ",
    origin_country: "Singapore", origin_city: "Singapore", origin_lat: 1.3644, origin_lng: 103.9915,
    destination_country: "Russia", destination_city: "Moscow", dest_lat: 55.9736, dest_lng: 37.4125,
    route: "SIN → SVO", status: "cancelled", cancellation_reason: "Overflight restrictions - sanctions",
    airspace_status: "closed", timestamp: "2026-03-09T02:00:00Z", risk_score: 88,
  },
  {
    flight_id: "QR-840", airline: "Qatar Airways", airline_code: "QR",
    origin_country: "Qatar", origin_city: "Doha", origin_lat: 25.2731, origin_lng: 51.6081,
    destination_country: "Lebanon", destination_city: "Beirut", dest_lat: 33.8209, dest_lng: 35.4884,
    route: "DOH → BEY", status: "delayed", cancellation_reason: "Regional security assessment",
    airspace_status: "restricted", timestamp: "2026-03-09T14:20:00Z", risk_score: 67,
  },
  {
    flight_id: "TK-1792", airline: "Turkish Airlines", airline_code: "TK",
    origin_country: "Turkey", origin_city: "Istanbul", origin_lat: 41.2753, origin_lng: 28.7519,
    destination_country: "Syria", destination_city: "Damascus", dest_lat: 33.4114, dest_lng: 36.5155,
    route: "IST → DAM", status: "cancelled", cancellation_reason: "Active conflict zone",
    airspace_status: "closed", timestamp: "2026-03-09T09:00:00Z", risk_score: 97,
  },
  {
    flight_id: "BA-157", airline: "British Airways", airline_code: "BA",
    origin_country: "United Kingdom", origin_city: "London", origin_lat: 51.47, origin_lng: -0.4543,
    destination_country: "Pakistan", destination_city: "Islamabad", dest_lat: 33.5561, dest_lng: 72.8379,
    route: "LHR → ISB", status: "diverted", cancellation_reason: "Alternate routing - airspace closure",
    airspace_status: "restricted", timestamp: "2026-03-09T22:10:00Z", risk_score: 71,
  },
  {
    flight_id: "AF-662", airline: "Air France", airline_code: "AF",
    origin_country: "France", origin_city: "Paris", origin_lat: 49.0097, origin_lng: 2.5479,
    destination_country: "Mali", destination_city: "Bamako", dest_lat: 12.5335, dest_lng: -7.9494,
    route: "CDG → BKO", status: "cancelled", cancellation_reason: "Political instability - coup concerns",
    airspace_status: "restricted", timestamp: "2026-03-09T07:30:00Z", risk_score: 78,
  },
  {
    flight_id: "KE-951", airline: "Korean Air", airline_code: "KE",
    origin_country: "South Korea", origin_city: "Seoul", origin_lat: 37.4602, origin_lng: 126.4407,
    destination_country: "Japan", destination_city: "Tokyo", dest_lat: 35.7647, dest_lng: 140.3864,
    route: "ICN → NRT", status: "on_time", cancellation_reason: "None",
    airspace_status: "open", timestamp: "2026-03-09T11:00:00Z", risk_score: 12,
  },
  {
    flight_id: "ET-701", airline: "Ethiopian Airlines", airline_code: "ET",
    origin_country: "Ethiopia", origin_city: "Addis Ababa", origin_lat: 8.9779, origin_lng: 38.7993,
    destination_country: "Somalia", destination_city: "Mogadishu", dest_lat: 2.0144, dest_lng: 45.3049,
    route: "ADD → MGQ", status: "delayed", cancellation_reason: "Security threat assessment",
    airspace_status: "restricted", timestamp: "2026-03-09T13:45:00Z", risk_score: 73,
  },
  {
    flight_id: "AI-144", airline: "Air India", airline_code: "AI",
    origin_country: "India", origin_city: "Delhi", origin_lat: 28.5562, origin_lng: 77.1,
    destination_country: "Afghanistan", destination_city: "Kabul", dest_lat: 34.5659, dest_lng: 69.2124,
    route: "DEL → KBL", status: "cancelled", cancellation_reason: "Airspace closure - security",
    airspace_status: "closed", timestamp: "2026-03-09T04:15:00Z", risk_score: 94,
  },
  {
    flight_id: "AA-7302", airline: "American Airlines", airline_code: "AA",
    origin_country: "United States", origin_city: "Dallas", origin_lat: 32.8998, origin_lng: -97.0403,
    destination_country: "Venezuela", destination_city: "Caracas", dest_lat: 10.6012, dest_lng: -66.9913,
    route: "DFW → CCS", status: "cancelled", cancellation_reason: "Political sanctions - restricted operations",
    airspace_status: "restricted", timestamp: "2026-03-09T16:30:00Z", risk_score: 76,
  },
  {
    flight_id: "SU-2614", airline: "Aeroflot", airline_code: "SU",
    origin_country: "Russia", origin_city: "Moscow", origin_lat: 55.9736, origin_lng: 37.4125,
    destination_country: "Germany", destination_city: "Berlin", dest_lat: 52.3667, dest_lng: 13.5033,
    route: "SVO → BER", status: "cancelled", cancellation_reason: "EU airspace ban - sanctions",
    airspace_status: "closed", timestamp: "2026-03-09T05:00:00Z", risk_score: 99,
  },
  {
    flight_id: "LY-315", airline: "El Al", airline_code: "LY",
    origin_country: "Israel", origin_city: "Tel Aviv", origin_lat: 32.0055, origin_lng: 34.8854,
    destination_country: "United States", destination_city: "New York", dest_lat: 40.6413, dest_lng: -73.7781,
    route: "TLV → JFK", status: "on_time", cancellation_reason: "None",
    airspace_status: "open", timestamp: "2026-03-09T18:00:00Z", risk_score: 34,
  },
  {
    flight_id: "CX-271", airline: "Cathay Pacific", airline_code: "CX",
    origin_country: "Hong Kong", origin_city: "Hong Kong", origin_lat: 22.308, origin_lng: 113.9185,
    destination_country: "Myanmar", destination_city: "Yangon", dest_lat: 16.9074, dest_lng: 96.1332,
    route: "HKG → RGN", status: "delayed", cancellation_reason: "Military activity in region",
    airspace_status: "restricted", timestamp: "2026-03-09T15:00:00Z", risk_score: 64,
  },
];

export const airspaceZones: AirspaceZone[] = [
  { id: "az-001", name: "Ukraine FIR", country: "Ukraine", status: "closed", lat: 49.0, lng: 32.0, radius: 400, affected_flights: 892, reason: "Active conflict zone" },
  { id: "az-002", name: "Eastern Syria", country: "Syria", status: "closed", lat: 35.0, lng: 38.0, radius: 250, affected_flights: 341, reason: "Military operations" },
  { id: "az-003", name: "Northern Iraq", country: "Iraq", status: "restricted", lat: 36.0, lng: 44.0, radius: 200, affected_flights: 287, reason: "Security operations" },
  { id: "az-004", name: "Afghanistan FIR", country: "Afghanistan", status: "closed", lat: 34.0, lng: 67.0, radius: 350, affected_flights: 564, reason: "Governance instability" },
  { id: "az-005", name: "Somalia Airspace", country: "Somalia", status: "restricted", lat: 5.0, lng: 46.0, radius: 300, affected_flights: 198, reason: "Security threat" },
  { id: "az-006", name: "Libya FIR", country: "Libya", status: "restricted", lat: 27.0, lng: 17.0, radius: 350, affected_flights: 234, reason: "Political instability" },
  { id: "az-007", name: "Yemen Airspace", country: "Yemen", status: "closed", lat: 15.5, lng: 48.0, radius: 250, affected_flights: 412, reason: "Active conflict" },
  { id: "az-008", name: "Mali FIR", country: "Mali", status: "restricted", lat: 17.0, lng: -4.0, radius: 300, affected_flights: 156, reason: "Coup - political instability" },
];

export const airlineImpacts: AirlineImpact[] = [
  { airline: "Lufthansa", code: "LH", total_flights: 4200, cancelled: 312, diverted: 89, delayed: 445, impact_score: 78 },
  { airline: "Emirates", code: "EK", total_flights: 3800, cancelled: 287, diverted: 134, delayed: 398, impact_score: 85 },
  { airline: "Turkish Airlines", code: "TK", total_flights: 5100, cancelled: 456, diverted: 167, delayed: 534, impact_score: 91 },
  { airline: "British Airways", code: "BA", total_flights: 3600, cancelled: 198, diverted: 76, delayed: 312, impact_score: 64 },
  { airline: "Air France", code: "AF", total_flights: 3200, cancelled: 234, diverted: 98, delayed: 367, impact_score: 72 },
  { airline: "Qatar Airways", code: "QR", total_flights: 2900, cancelled: 189, diverted: 112, delayed: 289, impact_score: 79 },
  { airline: "United Airlines", code: "UA", total_flights: 4800, cancelled: 267, diverted: 56, delayed: 423, impact_score: 61 },
  { airline: "Singapore Airlines", code: "SQ", total_flights: 2400, cancelled: 145, diverted: 34, delayed: 198, impact_score: 58 },
  { airline: "Aeroflot", code: "SU", total_flights: 1200, cancelled: 987, diverted: 0, delayed: 213, impact_score: 99 },
  { airline: "El Al", code: "LY", total_flights: 980, cancelled: 312, diverted: 189, delayed: 234, impact_score: 94 },
];

export const timelineData: TimelineEvent[] = [
  { date: "Feb 01", cancellations: 120, diversions: 45, delays: 230 },
  { date: "Feb 05", cancellations: 156, diversions: 52, delays: 245 },
  { date: "Feb 10", cancellations: 189, diversions: 67, delays: 289 },
  { date: "Feb 15", cancellations: 234, diversions: 78, delays: 312 },
  { date: "Feb 20", cancellations: 198, diversions: 89, delays: 278 },
  { date: "Feb 25", cancellations: 267, diversions: 95, delays: 345 },
  { date: "Mar 01", cancellations: 312, diversions: 112, delays: 398 },
  { date: "Mar 03", cancellations: 345, diversions: 98, delays: 367 },
  { date: "Mar 05", cancellations: 289, diversions: 87, delays: 334 },
  { date: "Mar 07", cancellations: 334, diversions: 104, delays: 389 },
  { date: "Mar 09", cancellations: 378, diversions: 118, delays: 412 },
];

export const cancellationReasons = [
  { reason: "Airspace Closure", count: 1423, percentage: 37 },
  { reason: "Security Concerns", count: 876, percentage: 23 },
  { reason: "Sanctions/Restrictions", count: 654, percentage: 17 },
  { reason: "Political Instability", count: 498, percentage: 13 },
  { reason: "Military Operations", count: 267, percentage: 7 },
  { reason: "Other", count: 129, percentage: 3 },
];

export const airlines = [
  "Lufthansa", "Emirates", "Turkish Airlines", "British Airways",
  "Air France", "Qatar Airways", "United Airlines", "Singapore Airlines",
  "Aeroflot", "El Al", "Korean Air", "Cathay Pacific",
  "Ethiopian Airlines", "Air India", "American Airlines",
];

export const countries = [
  "United States", "United Kingdom", "Germany", "France", "Turkey",
  "UAE", "Qatar", "Israel", "Russia", "Ukraine", "Syria", "Iraq",
  "Iran", "Afghanistan", "Pakistan", "India", "Singapore",
  "South Korea", "Japan", "Ethiopia", "Somalia", "Mali",
  "Libya", "Yemen", "Lebanon", "Venezuela", "Myanmar", "Hong Kong",
];
