// src/app/api/ridership/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { ridershipMetrics } from "@/db/schema";

type RidershipPayload = {
  reportingMonth: string | null; // ISO string from client
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RidershipPayload;
    const { reportingMonth } = body;

    if (!reportingMonth) {
      return NextResponse.json(
        { error: "reportingMonth is required" },
        { status: 400 },
      );
    }

    await db.insert(ridershipMetrics).values({
      reportingMonth: new Date(reportingMonth).toISOString().slice(0, 10),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Error saving ridership metric:", err);
    return NextResponse.json(
      {
        error: "Internal server error",
        ...(process.env.NODE_ENV === "development" && { detail: message }),
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(ridershipMetrics)
      .orderBy(ridershipMetrics.id);

    return NextResponse.json(rows);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Error loading ridership metrics:", err);
    return NextResponse.json(
      {
        error: "Failed to load metrics",
        ...(process.env.NODE_ENV === "development" && { detail: message }),
      },
      { status: 500 },
    );
  }
}
