import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { maintenanceMetrics } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

type MaintenanceMetricsPayload = {
  monthlyReportId: number;
  motorBusMajorRoadCalls?: number | null;
  motorBusOtherRoadCalls?: number | null;
  liftMajorRoadCalls?: number | null;
  liftOtherRoadCalls?: number | null;
  busDieselGallons?: number | null;
  busGasolineGallons?: number | null;
  ebKwhCharging?: number | null;
  ebKwhPropulsion?: number | null;
  liftDieselGallons?: number | null;
  liftGasolineGallons?: number | null;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as MaintenanceMetricsPayload;

    const { monthlyReportId } = body;

    if (!monthlyReportId) {
      return NextResponse.json(
        { error: "monthlyReportId is required" },
        { status: 400 },
      );
    }

    const existing = await db
      .select()
      .from(maintenanceMetrics)
      .where(eq(maintenanceMetrics.monthlyReportId, monthlyReportId))
      .limit(1);

    if (existing.length > 0) {
      await db
        .delete(maintenanceMetrics)
        .where(eq(maintenanceMetrics.monthlyReportId, monthlyReportId));
    }

    await db.insert(maintenanceMetrics).values({
      monthlyReportId,
      motorBusMajorRoadCalls: body.motorBusMajorRoadCalls ?? 0,
      motorBusOtherRoadCalls: body.motorBusOtherRoadCalls ?? 0,
      liftMajorRoadCalls: body.liftMajorRoadCalls ?? 0,
      liftOtherRoadCalls: body.liftOtherRoadCalls ?? 0,
      busDieselGallons: body.busDieselGallons ?? 0,
      busGasolineGallons: body.busGasolineGallons ?? 0,
      ebKwhCharging: body.ebKwhCharging ?? 0,
      ebKwhPropulsion: body.ebKwhPropulsion ?? 0,
      liftDieselGallons: body.liftDieselGallons ?? 0,
      liftGasolineGallons: body.liftGasolineGallons ?? 0,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error saving maintenance metrics:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const monthlyReportIdParam = req.nextUrl.searchParams.get("monthlyReportId");

    if (monthlyReportIdParam) {
      const monthlyReportId = Number(monthlyReportIdParam);

      const rows = await db
        .select()
        .from(maintenanceMetrics)
        .where(eq(maintenanceMetrics.monthlyReportId, monthlyReportId));

      return NextResponse.json(rows);
    }

    const rows = await db
      .select()
      .from(maintenanceMetrics)
      .orderBy(asc(maintenanceMetrics.id));

    return NextResponse.json(rows);
  } catch (err) {
    console.error("Error loading maintenance metrics:", err);
    return NextResponse.json(
      { error: "Failed to load metrics" },
      { status: 500 },
    );
  }
}
