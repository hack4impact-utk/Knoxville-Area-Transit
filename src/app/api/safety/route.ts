// src/app/api/safety/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { safetyReports } from "@/db/schema";

type SafetyReportPayload = {
    reportingMonth: string | null; // ISO string
    preventableMain: number | null;
    preventableLift: number | null;
    collisionsMain: number | null;
    collisionsLift: number | null;
    notes: string | null;
};

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as SafetyReportPayload;
        const {
            reportingMonth,
            preventableMain,
            preventableLift,
            collisionsMain,
            collisionsLift,
            notes,
        } = body;

        if (!reportingMonth) {
            return NextResponse.json(
                { error: "reportingMonth is required" },
                { status: 400 },
            );
        }

        await db.insert(safetyReports).values({
            reportingMonth,
            preventableMain,
            preventableLift,
            collisionsMain,
            collisionsLift,
            notes,
        });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("Error saving safety report:", err);
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
            .from(safetyReports)
            .orderBy(safetyReports.id);

        return NextResponse.json(rows);
    } catch (err) {
        console.error("Error loading safety reports:", err);
        return NextResponse.json(
            { error: "Failed to load reports" },
            { status: 500 },
        );
    }
}
