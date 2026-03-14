// src/app/api/charters/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { fixedRouteMonthlyRidership } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

type FixedRouteMonthlyRidershipPayload = {
  monthlyReportId: number;
  routeNumber: number | null;
  routeName: string | null;
  dayType: "weekday" | "saturday" | "sunday";
  scheduleId: number | null;
  avgDailyRidershipUpt: number | null;
  avgDailyPassMilesPmt: number | null;
  avgTripLengthPtl: number | null;
  sampledTrips: number | null;
  scheduledTrips: number | null;
  expansionFactor: number | null;
  expandedRidershipUpt: number | null;
  expandedPassMilesPmt: number | null;
  expandedRevenueMiles: number | null;
  expandedRevenueHours: number | null;
  dayCount: number | null;
  monthlyRidershipUpt: number | null;
  monthlyPassMilesPmt: number | null;
  monthlyRevenueMiles: number | null;
  monthlyRevenueHours: number | null;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as FixedRouteMonthlyRidershipPayload[];

    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { error: "Payload must be a non-empty array" },
        { status: 400 }
      );
    }

    const monthlyReportId = body[0].monthlyReportId;

    if (!monthlyReportId) {
      return NextResponse.json(
        { error: "monthlyReportId is required" },
        { status: 400 }
      );
    }

    if (!body.every((r) => r.monthlyReportId === monthlyReportId)) {
      return NextResponse.json(
        { error: "All rows must use the same monthlyReportId" },
        { status: 400 }
      );
    }

    // Delete existing rows
    const result = await db
      .select()
      .from(fixedRouteMonthlyRidership)
      .where(eq(fixedRouteMonthlyRidership.monthlyReportId, monthlyReportId))
      .limit(1);
  
    if(result.length > 0) {
      await db
        .delete(fixedRouteMonthlyRidership)
        .where(eq(fixedRouteMonthlyRidership.monthlyReportId, monthlyReportId));
    }

    // Insert new rows
    await db.insert(fixedRouteMonthlyRidership).values(body);

    return NextResponse.json({ ok: true, count: body.length });
  } catch (err) {
    console.error("Error saving Fixed Route Monthly Ridership:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const monthlyReportIdParam = req.nextUrl.searchParams.get("monthlyReportId");

    if (!monthlyReportIdParam) {
      return NextResponse.json(
        { error: "monthlyReportId query parameter is required" },
        { status: 400 }
      );
    }

    const monthlyReportId = Number(monthlyReportIdParam);

    const rows = await db
      .select()
      .from(fixedRouteMonthlyRidership)
      .where(eq(fixedRouteMonthlyRidership.monthlyReportId, monthlyReportId))
      .orderBy(
        asc(fixedRouteMonthlyRidership.routeNumber),
        asc(fixedRouteMonthlyRidership.dayType)
      );

    return NextResponse.json(rows);
  } catch (err) {
    console.error("Error loading fixed route monthly ridership:", err);

    return NextResponse.json(
      { error: "Failed to load monthly report" },
      { status: 500 }
    );
  }
}
