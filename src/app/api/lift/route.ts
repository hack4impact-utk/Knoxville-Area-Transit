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

const toNullableString = (value: number | null): string | null =>
  value === null ? null : String(value);

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LiftMetricsPayload;

    if (!body.reportingMonth) {
      return NextResponse.json(
        { error: "reportingMonth is required" },
        { status: 400 },
      );
    }

    const insertValues: typeof liftMetrics.$inferInsert = {
      reportingMonth: body.reportingMonth.slice(0, 10),
      tripsDenied: body.tripsDenied,
      noShows: body.noShows,
      tripsScheduled: body.tripsScheduled,
      totalPassengers: body.totalPassengers,
      revenueVehicleMiles: toNullableString(body.revenueVehicleMiles),
      revenueVehicleHours: toNullableString(body.revenueVehicleHours),
      avgCostPerTrip: toNullableString(body.avgCostPerTrip),
      passengerPerMile: toNullableString(body.passengerPerMile),
      passengerPerHour: toNullableString(body.passengerPerHour),
      otpPercent: toNullableString(body.otpPercent),
      avgWeekdayRidership: toNullableString(body.avgWeekdayRidership),
      avgSaturdayRidership: toNullableString(body.avgSaturdayRidership),
      avgSundayRidership: toNullableString(body.avgSundayRidership),
      totalWeekdayRidership: toNullableString(body.totalWeekdayRidership),
      totalSaturdayRidership: toNullableString(body.totalSaturdayRidership),
      totalSundayRidership: toNullableString(body.totalSundayRidership),
    };

    await db.insert(liftMetrics).values(insertValues);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error saving lift metrics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const rows = await db.select().from(liftMetrics).orderBy(liftMetrics.id);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error loading lift metrics:", error);
    return NextResponse.json(
      { error: "Failed to load metrics" },
      { status: 500 },
    );
  }
}
