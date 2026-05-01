import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { financeMetrics } from "@/db/schema";
import { eq } from "drizzle-orm/sql";

type FinancePayload = {
  monthlyReportId: number;
  fixedRouteRevenue?: number | null;
  liftRevenue?: number | null;
  footballShuttleRevenue?: number | null;
  boydsSoccerRevenue?: number | null;
  boydsBaseballRevenue?: number | null;
  otherCharterRevenue?: number | null;
};

export async function POST(req: NextRequest) {
  try {
    const overwrite = req.nextUrl.searchParams.get("overwrite") === "true";
    const body = (await req.json()) as FinancePayload;
    const { monthlyReportId, ...metrics } = body;

    if (!monthlyReportId) {
      return NextResponse.json(
        { error: "monthlyReportId is required" },
        { status: 400 },
      );
    }

    // Check if a record already exists for this month
    const existing = await db
      .select()
      .from(financeMetrics)
      .where(eq(financeMetrics.monthlyReportId, monthlyReportId))
      .limit(1);

    if (existing.length > 0 && !overwrite) {
      return NextResponse.json(
        { error: "DUPLICATE_MONTH" },
        { status: 409 },
      );
    }

    if (existing.length > 0 && overwrite) {
      await db
        .update(financeMetrics)
        .set(metrics)
        .where(eq(financeMetrics.monthlyReportId, monthlyReportId));
    } else {
      await db.insert(financeMetrics).values({ monthlyReportId, ...metrics });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error saving finance metrics:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const monthlyReportId = req.nextUrl.searchParams.get("monthlyReportId");

    if (monthlyReportId) {
      const rows = await db
        .select()
        .from(financeMetrics)
        .where(eq(financeMetrics.monthlyReportId, parseInt(monthlyReportId, 10)))
        .limit(1);

      if (rows.length === 0) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      return NextResponse.json(rows[0]);
    }

    // No filter — return all rows
    const rows = await db
      .select()
      .from(financeMetrics)
      .orderBy(financeMetrics.monthlyReportId);

    return NextResponse.json(rows);
  } catch (err) {
    console.error("Error loading finance metrics:", err);
    return NextResponse.json({ error: "Failed to load metrics" }, { status: 500 });
  }
}