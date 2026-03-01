// src/app/api/lift/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { liftMetrics } from "@/db/schema";

type LiftMetricsPayload = {
  reportingMonth: string | null;
  tripsDenied: number | null;
  noShows: number | null;
  tripsScheduled: number | null;
  totalPassengers: number | null;
  revenueVehicleMiles: number | null;
  revenueVehicleHours: number | null;
  avgCostPerTrip: number | null;
  passengerPerMile: number | null;
  passengerPerHour: number | null;
  otpPercent: number | null;
  avgWeekdayRidership: number | null;
  avgSaturdayRidership: number | null;
  avgSundayRidership: number | null;
  totalWeekdayRidership: number | null;
  totalSaturdayRidership: number | null;
  totalSundayRidership: number | null;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LiftMetricsPayload;

    if (!body.reportingMonth) {
      return NextResponse.json(
        { error: "reportingMonth is required" },
        { status: 400 },
      );
    }

    await db.insert(liftMetrics).values({
      reportingMonth: new Date(body.reportingMonth).toISOString().slice(0, 10),
      tripsDenied: body.tripsDenied,
      noShows: body.noShows,
      tripsScheduled: body.tripsScheduled,
      totalPassengers: body.totalPassengers,
      revenueVehicleMiles: body.revenueVehicleMiles?.toString() ?? null,
      revenueVehicleHours: body.revenueVehicleHours?.toString() ?? null,
      avgCostPerTrip: body.avgCostPerTrip?.toString() ?? null,
      passengerPerMile: body.passengerPerMile?.toString() ?? null,
      passengerPerHour: body.passengerPerHour?.toString() ?? null,
      otpPercent: body.otpPercent?.toString() ?? null,
      avgWeekdayRidership: body.avgWeekdayRidership?.toString() ?? null,
      avgSaturdayRidership: body.avgSaturdayRidership?.toString() ?? null,
      avgSundayRidership: body.avgSundayRidership?.toString() ?? null,
      totalWeekdayRidership: body.totalWeekdayRidership?.toString() ?? null,
      totalSaturdayRidership: body.totalSaturdayRidership?.toString() ?? null,
      totalSundayRidership: body.totalSundayRidership?.toString() ?? null,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error saving lift metrics:", err);
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
      .from(liftMetrics)
      .orderBy(liftMetrics.id);

    return NextResponse.json(rows);
  } catch (err) {
    console.error("Error loading lift metrics:", err);
    return NextResponse.json(
      { error: "Failed to load metrics" },
      { status: 500 },
    );
  }
}