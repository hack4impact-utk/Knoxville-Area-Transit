// src/app/api/safety/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { safetyMetrics, monthlyDepartmentReport } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { 
            month, 
            year, 
            preventableMotorBus, 
            preventableLift, 
            collisionMotorBus, 
            collisionLift 
        } = body;

        if (!month || !year) {
            return NextResponse.json(
                { error: "Month and Year are required" },
                { status: 400 }
            );
        }

        // 1. Find or Create the Parent Report
        let report = await db
            .select()
            .from(monthlyDepartmentReport)
            .where(
                and(
                    eq(monthlyDepartmentReport.month, month),
                    eq(monthlyDepartmentReport.year, year)
                )
            )
            .limit(1);

        let reportId: number;

        if (report.length === 0) {
            const newReport = await db.insert(monthlyDepartmentReport)
                .values({ month, year })
                .returning({ id: monthlyDepartmentReport.id });
            reportId = newReport[0].id;
        } else {
            reportId = report[0].id;
        }

        // 2. Insert into the correct table: safetyMetrics
        const result = await db.insert(safetyMetrics).values({
            monthlyReportId: reportId,
            preventableMotorBus: preventableMotorBus ?? 0,
            preventableLift: preventableLift ?? 0,
            collisionMotorBus: collisionMotorBus ?? 0,
            collisionLift: collisionLift ?? 0,
        }).returning();

        return NextResponse.json({ success: true, data: result[0] });

    } catch (err) {
        console.error("POST Error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        // We join with the parent report so the frontend knows WHICH month/year 
        // these metrics belong to.
        const rows = await db
            .select({
                id: safetyMetrics.id,
                month: monthlyDepartmentReport.month,
                year: monthlyDepartmentReport.year,
                preventableMotorBus: safetyMetrics.preventableMotorBus,
                preventableLift: safetyMetrics.preventableLift,
                collisionMotorBus: safetyMetrics.collisionMotorBus,
                collisionLift: safetyMetrics.collisionLift,
            })
            .from(safetyMetrics)
            .innerJoin(
                monthlyDepartmentReport, 
                eq(safetyMetrics.monthlyReportId, monthlyDepartmentReport.id)
            );

        return NextResponse.json(rows);
    } catch (err) {
        console.error("GET Error:", err);
        return NextResponse.json({ error: "Failed to load metrics" }, { status: 500 });
    }
}