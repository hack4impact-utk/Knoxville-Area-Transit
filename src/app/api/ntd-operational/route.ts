import { NextRequest, NextResponse } from "next/server";

import db from "@/db";
import { monthlyDepartmentReport, ntdOperationalMetrics } from "@/db/schema";
import { eq } from "drizzle-orm";

type NtdOperationalMetricsPayload = {
  monthlyReportId: number | null;

  maxMotorBusesInService: number | null;
  maxLiftVehiclesInService: number | null;

  fixedRouteWeekdayAvgRiders: number | null;
  fixedRouteWeekdayAvgRevHours: number | null;
  fixedRouteWeekdayAvgRevMiles: number | null;
  fixedRouteSatAvgRiders: number | null;
  fixedRouteSatAvgRevHours: number | null;
  fixedRouteSatAvgRevMiles: number | null;
  fixedRouteSunAvgRiders: number | null;
  fixedRouteSunAvgRevHours: number | null;
  fixedRouteSunAvgRevMiles: number | null;

  demandResponseWeekdayAvgRiders: number | null;
  demandResponseWeekdayAvgRevHours: number | null;
  demandResponseWeekdayAvgRevMiles: number | null;
  demandResponseSatAvgRiders: number | null;
  demandResponseSatAvgRevHours: number | null;
  demandResponseSatAvgRevMiles: number | null;
  demandResponseSunAvgRiders: number | null;
  demandResponseSunAvgRevHours: number | null;
  demandResponseSunAvgRevMiles: number | null;
};

const toNullableString = (value: number | null): string | null =>
  value === null ? null : String(value);

function monthlyReportIdToIsoDate(monthlyReportId: number): string {
  const year = Math.floor(monthlyReportId / 100);
  const month = monthlyReportId % 100;
  const safeMonth = Math.min(Math.max(month, 1), 12);
  return `${year}-${String(safeMonth).padStart(2, "0")}-01`;
}

export async function POST(req: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "DATABASE_URL is not set" },
        { status: 500 },
      );
    }

    const body = (await req.json()) as NtdOperationalMetricsPayload;

    if (!body.monthlyReportId) {
      return NextResponse.json(
        { error: "monthlyReportId is required" },
        { status: 400 },
      );
    }

    const monthlyReportId = body.monthlyReportId;

    // Ensure the parent monthly report exists (dependency: MonthlyDepartmentReport)
    const parent = await db
      .select({ id: monthlyDepartmentReport.id })
      .from(monthlyDepartmentReport)
      .where(eq(monthlyDepartmentReport.id, monthlyReportId))
      .limit(1);

    if (parent.length === 0) {
      await db.insert(monthlyDepartmentReport).values({
        id: monthlyReportId,
        reportingMonth: monthlyReportIdToIsoDate(monthlyReportId),
      });
    }

    // Upsert-by-replace: 1 row per monthly report id
    await db
      .delete(ntdOperationalMetrics)
      .where(eq(ntdOperationalMetrics.monthlyReportId, monthlyReportId));

    const insertValues: typeof ntdOperationalMetrics.$inferInsert = {
      monthlyReportId,

      maxMotorBusesInService: body.maxMotorBusesInService,
      maxLiftVehiclesInService: body.maxLiftVehiclesInService,

      fixedRouteWeekdayAvgRiders: body.fixedRouteWeekdayAvgRiders,
      fixedRouteWeekdayAvgRevHours: toNullableString(
        body.fixedRouteWeekdayAvgRevHours,
      ),
      fixedRouteWeekdayAvgRevMiles: toNullableString(
        body.fixedRouteWeekdayAvgRevMiles,
      ),
      fixedRouteSatAvgRiders: body.fixedRouteSatAvgRiders,
      fixedRouteSatAvgRevHours: toNullableString(body.fixedRouteSatAvgRevHours),
      fixedRouteSatAvgRevMiles: toNullableString(body.fixedRouteSatAvgRevMiles),
      fixedRouteSunAvgRiders: body.fixedRouteSunAvgRiders,
      fixedRouteSunAvgRevHours: toNullableString(body.fixedRouteSunAvgRevHours),
      fixedRouteSunAvgRevMiles: toNullableString(body.fixedRouteSunAvgRevMiles),

      demandResponseWeekdayAvgRiders: body.demandResponseWeekdayAvgRiders,
      demandResponseWeekdayAvgRevHours: toNullableString(
        body.demandResponseWeekdayAvgRevHours,
      ),
      demandResponseWeekdayAvgRevMiles: toNullableString(
        body.demandResponseWeekdayAvgRevMiles,
      ),
      demandResponseSatAvgRiders: body.demandResponseSatAvgRiders,
      demandResponseSatAvgRevHours: toNullableString(
        body.demandResponseSatAvgRevHours,
      ),
      demandResponseSatAvgRevMiles: toNullableString(
        body.demandResponseSatAvgRevMiles,
      ),
      demandResponseSunAvgRiders: body.demandResponseSunAvgRiders,
      demandResponseSunAvgRevHours: toNullableString(
        body.demandResponseSunAvgRevHours,
      ),
      demandResponseSunAvgRevMiles: toNullableString(
        body.demandResponseSunAvgRevMiles,
      ),
    };

    await db.insert(ntdOperationalMetrics).values(insertValues);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error saving NTD operational metrics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "DATABASE_URL is not set" },
        { status: 500 },
      );
    }

    const monthlyReportIdParam = req.nextUrl.searchParams.get("monthlyReportId");
    if (!monthlyReportIdParam) {
      return NextResponse.json(
        { error: "monthlyReportId query parameter is required" },
        { status: 400 },
      );
    }

    const monthlyReportId = Number(monthlyReportIdParam);
    if (!Number.isFinite(monthlyReportId)) {
      return NextResponse.json(
        { error: "monthlyReportId must be a number" },
        { status: 400 },
      );
    }

    const rows = await db
      .select()
      .from(ntdOperationalMetrics)
      .where(eq(ntdOperationalMetrics.monthlyReportId, monthlyReportId))
      .limit(1);

    return NextResponse.json(rows.length === 0 ? null : rows[0]);
  } catch (error) {
    console.error("Error loading NTD operational metrics:", error);
    return NextResponse.json(
      { error: "Failed to load metrics" },
      { status: 500 },
    );
  }
}

