import { NextRequest, NextResponse } from "next/server";

import db from "@/db";
import { hrMetrics } from "@/db/schema";

type HrMetricsPayload = {
  reportingMonth: string | null;
  otpWeekday: number | null;
  otpSaturday: number | null;
  otpSunday: number | null;
  otpSystem: number | null;
  driverHours: number | null;
  overtimeHours: number | null;
  absenteeism: number | null;
  trainingCertifications: string;
};

const toNullableString = (value: number | null): string | null =>
  value === null ? null : String(value);

export async function POST(req: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "DATABASE_URL is not set" },
        { status: 500 },
      );
    }

    const body = (await req.json()) as HrMetricsPayload;

    if (!body.reportingMonth) {
      return NextResponse.json(
        { error: "reportingMonth is required" },
        { status: 400 },
      );
    }

    const insertValues: typeof hrMetrics.$inferInsert = {
      reportingMonth: body.reportingMonth.slice(0, 10),
      otpWeekday: toNullableString(body.otpWeekday),
      otpSaturday: toNullableString(body.otpSaturday),
      otpSunday: toNullableString(body.otpSunday),
      otpSystem: toNullableString(body.otpSystem),
      driverHours: toNullableString(body.driverHours),
      overtimeHours: toNullableString(body.overtimeHours),
      absenteeism: toNullableString(body.absenteeism),
      trainingCertifications: body.trainingCertifications,
    };

    await db.insert(hrMetrics).values(insertValues);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error saving HR metrics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "DATABASE_URL is not set" },
        { status: 500 },
      );
    }

    const rows = await db.select().from(hrMetrics).orderBy(hrMetrics.id);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error loading HR metrics:", error);
    return NextResponse.json(
      { error: "Failed to load metrics" },
      { status: 500 },
    );
  }
}
