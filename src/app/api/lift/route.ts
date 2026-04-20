import { NextRequest, NextResponse } from "next/server";

import db from "@/db";
import { liftMetrics } from "@/db/schema";

type LiftMetricsPayload = {
  monthlyReportId: number | null;
  completedTrips: number | null;
  tripsScheduled: number | null;
  passengers: number | null;
  revenueMiles: number | null;
  revenueHours: number | null;
  tripsDenied: number | null;
  noShowsCancellations: number | null;
  weekdayRidership: number | null;
  saturdayRidership: number | null;
  sundayRidership: number | null;
  onTimePerformancePercent: number | null;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LiftMetricsPayload;

    if (!body.monthlyReportId) {
      return NextResponse.json(
        { error: "monthlyReportId is required" },
        { status: 400 },
      );
    }

    const insertValues: typeof liftMetrics.$inferInsert = {
      monthlyReportId: body.monthlyReportId,
      completedTrips: body.completedTrips,
      tripsScheduled: body.tripsScheduled,
      passengers: body.passengers,
      revenueMiles: body.revenueMiles,
      revenueHours: body.revenueHours,
      tripsDenied: body.tripsDenied,
      noShowsCancellations: body.noShowsCancellations,
      weekdayRidership: body.weekdayRidership,
      saturdayRidership: body.saturdayRidership,
      sundayRidership: body.sundayRidership,
      onTimePerformancePercent: body.onTimePerformancePercent,
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
