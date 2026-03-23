import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { maintenanceMetrics } from "@/db/schema";

type MaintenanceMetricsPayload = {
  reportingMonth: string | null; // ISO string from client
  motorBusMajor?: number | null;
  motorBusOther?: number | null;
  liftMajor?: number | null;
  liftOther?: number | null;
  interruptions?: number | null;
  diesel?: number | null;
  cng?: number | null;
  electric?: number | null;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as MaintenanceMetricsPayload;

    const { reportingMonth } = body;

    if (!reportingMonth) {
      return NextResponse.json(
        { error: "reportingMonth is required" },
        { status: 400 },
      );
    }

    await db.insert(maintenanceMetrics).values({
      reportingMonth,
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

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(maintenanceMetrics)
      .orderBy(maintenanceMetrics.id);

    return NextResponse.json(rows);
  } catch (err) {
    console.error("Error loading maintenance metrics:", err);
    return NextResponse.json(
      { error: "Failed to load metrics" },
      { status: 500 },
    );
  }
}
