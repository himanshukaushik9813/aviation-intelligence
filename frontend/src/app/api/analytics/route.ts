import { NextResponse } from "next/server";
import {
  airlineImpacts,
  timelineData,
  cancellationReasons,
} from "@/lib/aviation-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (type === "timeline") {
    return NextResponse.json(timelineData);
  }

  if (type === "reasons") {
    return NextResponse.json(cancellationReasons);
  }

  return NextResponse.json(airlineImpacts);
}
