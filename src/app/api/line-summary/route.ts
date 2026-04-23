// src/app/api/line-summary/route.ts
import db from "@/db";
import { fixedRouteLineSummary, NewFixedRouteLineSummary } from "@/db/schema";
import handleError from "@/utils/handle-error";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// ── GET /api/line-summary?monthlyReportId=<id> ────────────────────────────────
// Returns all line summary rows for a given monthly report, optionally filtered
// by day type.  Joins naturally with fixed_route_monthly_ridership on
// (monthly_report_id, route_number, day_type).
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const monthlyReportIdParam = searchParams.get("monthlyReportId");

    if (!monthlyReportIdParam) {
      return NextResponse.json(
        { error: "monthlyReportId query param is required" },
        { status: 400 }
      );
    }

    const monthlyReportId = parseInt(monthlyReportIdParam, 10);
    if (isNaN(monthlyReportId)) {
      return NextResponse.json(
        { error: "monthlyReportId must be an integer" },
        { status: 400 }
      );
    }

    const rows = await db
      .select()
      .from(fixedRouteLineSummary)
      .where(eq(fixedRouteLineSummary.monthlyReportId, monthlyReportId));

    return NextResponse.json(rows);
  } catch (err) {
    return handleError(err);
  }
}

// ── POST /api/line-summary ────────────────────────────────────────────────────
// Bulk-inserts line summary rows for a monthly report.
// Body: { monthlyReportId: number; rows: NewFixedRouteLineSummary[] }
//
// Idempotency: existing rows for (monthlyReportId) are deleted first so
// re-importing a corrected file is safe.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { monthlyReportId, rows } = body as {
      monthlyReportId: number;
      rows: NewFixedRouteLineSummary[];
    };

    if (!monthlyReportId || !Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { error: "monthlyReportId and a non-empty rows array are required" },
        { status: 400 }
      );
    }

    // Validate day_type values before hitting the DB
    const validDayTypes = new Set(["weekday", "saturday", "sunday"]);
    const invalid = rows.find(
      (r) => r.dayType && !validDayTypes.has(r.dayType)
    );
    if (invalid) {
      return NextResponse.json(
        {
          error: `Invalid day_type "${invalid.dayType}". Must be weekday | saturday | sunday.`,
        },
        { status: 422 }
      );
    }

    await db.transaction(async (tx) => {
    await tx
        .delete(fixedRouteLineSummary)
        .where(eq(fixedRouteLineSummary.monthlyReportId, monthlyReportId));

    await tx
        .insert(fixedRouteLineSummary)
        .values(rows.map((r) => ({ ...r, monthlyReportId })));
    });

    return NextResponse.json({ inserted: rows.length }, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}