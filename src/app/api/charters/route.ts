// src/app/api/charters/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { charterEvents } from "@/db/schema";

type CharterEventPayload = {
  reportingMonth: string | null; // ISO string from client
  eventType: string;
  eventDate: string | null; // ISO string from client
  passengerCount: number | null;
  vehicleHours: number | null;
  vehicleMiles: number | null;
  driverAssignments: string;
  revenueTotal: number | null;
  serviceTotal: number | null;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CharterEventPayload;

    const {
      reportingMonth,
      eventType,
      eventDate,
      passengerCount,
      vehicleHours,
      vehicleMiles,
      driverAssignments,
      revenueTotal,
      serviceTotal,
    } = body;

    if (!reportingMonth || !eventType) {
      return NextResponse.json(
        { error: "reportingMonth and eventType are required" },
        { status: 400 },
      );
    }

    await db.insert(charterEvents).values({
      reportingMonth: new Date(reportingMonth),
      eventType,
      eventDate: eventDate ? new Date(eventDate) : null,
      passengerCount,
      vehicleHours,
      vehicleMiles,
      driverAssignments,
      revenueTotal,
      serviceTotal,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error saving charter event:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// NEW: return all saved charter events
export async function GET() {
  try {
    const rows = await db
      .select()
      .from(charterEvents)
      .orderBy(charterEvents.id);

    return NextResponse.json(rows);
  } catch (err) {
    console.error("Error loading charter events:", err);
    return NextResponse.json(
      { error: "Failed to load events" },
      { status: 500 },
    );
  }
}
