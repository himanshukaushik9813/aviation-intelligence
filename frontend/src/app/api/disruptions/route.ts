import { NextResponse } from "next/server";
import { flightDisruptions, airspaceZones, disruptionStats } from "@/lib/aviation-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (type === "stats") {
    return NextResponse.json(disruptionStats);
  }

  if (type === "airspaces") {
    return NextResponse.json(airspaceZones);
  }

  const status = searchParams.get("status");
  let flights = flightDisruptions;

  if (status && status !== "all") {
    flights = flights.filter((f) => f.status === status);
  }

  return NextResponse.json(flights);
}
