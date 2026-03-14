import { NextRequest, NextResponse } from "next/server";
import { fixedRouteMonthlyRidership } from "@/db/schema";
import db from "@/db";
import { eq } from "drizzle-orm";

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

    const result = await db
      .select()
      .from(fixedRouteMonthlyRidership)
      .where(eq(fixedRouteMonthlyRidership.monthlyReportId, monthlyReportId))
      .limit(1);

    return NextResponse.json({
      exists: result.length > 0,
    });
  } catch (err) {
    console.error("Error checking monthly report existence:", err);

    return NextResponse.json(
      { error: "Failed to check monthly report" },
      { status: 500 }
    );
  }
}