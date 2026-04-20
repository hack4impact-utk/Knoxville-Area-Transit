// src/app/api/charters/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { specialServicesRuns } from "@/db/schema";

const VALID_SERVICE_TYPES = [
  "special_shuttle",
  "football",
  "baseball",
  "basketball",
  "soccer",
] as const;

const VALID_LOCATIONS = [
  "Coliseum (A)",
  "Old City (D)",
  "Market Square (E)",
] as const;

type SpecialServicesPayload = {
  monthlyReportId: number | null;
  serviceType: string;
  eventDate: string | null;
  passengerCount: number | null;
  revenueMiles: number | null;
  revenueHours: number | null;
  eventName: string | null;
  location: string | null;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SpecialServicesPayload;

    if (!body.monthlyReportId || !body.serviceType || !body.eventDate) {
      return NextResponse.json(
        { error: "monthlyReportId, serviceType, and eventDate are required" },
        { status: 400 },
      );
    }

    if (
      !VALID_SERVICE_TYPES.includes(
        body.serviceType as (typeof VALID_SERVICE_TYPES)[number],
      )
    ) {
      return NextResponse.json(
        { error: `serviceType must be one of: ${VALID_SERVICE_TYPES.join(", ")}` },
        { status: 400 },
      );
    }

    if (
      body.location &&
      !VALID_LOCATIONS.includes(
        body.location as (typeof VALID_LOCATIONS)[number],
      )
    ) {
      return NextResponse.json(
        { error: `location must be one of: ${VALID_LOCATIONS.join(", ")}` },
        { status: 400 },
      );
    }

    await db.insert(specialServicesRuns).values({
      monthlyReportId: body.monthlyReportId,
      serviceType: body.serviceType,
      eventDate: body.eventDate.slice(0, 10),
      passengerCount: body.passengerCount,
      revenueMiles: body.revenueMiles,
      revenueHours: body.revenueHours,
      eventName: body.eventName,
      location: body.location,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error saving special services run:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(specialServicesRuns)
      .orderBy(specialServicesRuns.id);

    return NextResponse.json(rows);
  } catch (err) {
    console.error("Error loading special services runs:", err);
    return NextResponse.json(
      { error: "Failed to load runs" },
      { status: 500 },
    );
  }
}
