// src/app/api/charters/route.ts
import { NextRequest, NextResponse } from "next/server";

import db from "@/db";
import { charterEvents } from "@/db/schema";

type NewCharterEvent = typeof charterEvents.$inferInsert;

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

export async function POST(req: NextRequest): Promise<NextResponse> {
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
      // Drizzle `date` column expects a string like "YYYY-MM-DD"
      reportingMonth: new Date(reportingMonth).toISOString().slice(0, 10),
      eventType,
      eventDate: eventDate
        ? new Date(eventDate).toISOString().slice(0, 10)
        : null,
      passengerCount,
      vehicleHours,
      vehicleMiles,
      driverAssignments,
      revenueTotal,
      serviceTotal,
    } as NewCharterEvent);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error saving charter event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// NEW: return all saved charter events
export async function GET(): Promise<NextResponse> {
  try {
    const rows = await db
      .select()
      .from(charterEvents)
      .orderBy(charterEvents.id);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error loading charter events:", error);
    return NextResponse.json(
      { error: "Failed to load events" },
      { status: 500 },
    );
  }
}
