// src/app/departments/ridership/line-summary/page.tsx
"use client";

import React, { useCallback, useState } from "react";
import * as XLSX from "xlsx";

// ── Types ─────────────────────────────────────────────────────────────────────

type DayType = "weekday" | "saturday" | "sunday";

interface LineSummaryRow {
  routeNumber: number | null;
  dayType: DayType;
  peakVehicles: number | null;
  revenueTimeHours: string | null;
  nonRevenueTimeHours: string | null;
  recoveryTimeHours: string | null;
  revenueDistanceMiles: string | null;
  nonRevenueDistanceMiles: string | null;
  revenueTrips: number | null;
  nonRevenueTrips: number | null;
  totalTimeHours: string | null;
  totalDistanceMiles: string | null;
}

// ── Excel column mapping ──────────────────────────────────────────────────────
// Adjust these indices to match the actual column layout in the xlsx sheets.
const COL = {
  routeNumber: 0,
  peakVehicles: 1,
  revenueTimeHours: 2,
  nonRevenueTimeHours: 3,
  recoveryTimeHours: 4,
  revenueDistanceMiles: 5,
  nonRevenueDistanceMiles: 6,
  revenueTrips: 7,
  nonRevenueTrips: 8,
  totalTimeHours: 9,
  totalDistanceMiles: 10,
} as const;

const SHEET_DAY_TYPE: Record<string, DayType> = {
  Weekday: "weekday",
  Saturday: "saturday",
  Sunday: "sunday",
};

// ── Parsing helpers ───────────────────────────────────────────────────────────

function toNum(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
}

function toStr(v: unknown): string | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return isNaN(n) ? null : String(n);
}

function isDataRow(row: unknown[]): boolean {
  // A data row must have a numeric value in the route-number column
  return toNum(row[COL.routeNumber]) !== null;
}

function parseSheet(
  worksheet: XLSX.WorkSheet,
  dayType: DayType,
): LineSummaryRow[] {
  const raw: unknown[][] = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: "",
  });

  return raw.filter(isDataRow).map((row) => ({
    routeNumber: toNum(row[COL.routeNumber]),
    dayType,
    peakVehicles: toNum(row[COL.peakVehicles]),
    revenueTimeHours: toStr(row[COL.revenueTimeHours]),
    nonRevenueTimeHours: toStr(row[COL.nonRevenueTimeHours]),
    recoveryTimeHours: toStr(row[COL.recoveryTimeHours]),
    revenueDistanceMiles: toStr(row[COL.revenueDistanceMiles]),
    nonRevenueDistanceMiles: toStr(row[COL.nonRevenueDistanceMiles]),
    revenueTrips: toNum(row[COL.revenueTrips]),
    nonRevenueTrips: toNum(row[COL.nonRevenueTrips]),
    totalTimeHours: toStr(row[COL.totalTimeHours]),
    totalDistanceMiles: toStr(row[COL.totalDistanceMiles]),
  }));
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function LineSummaryPage() {
  const [rows, setRows] = useState<LineSummaryRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // monthlyReportId should come from route params or a context in the real app.
  // Hardcoded here as a placeholder — wire up to your report-selection flow.
  const monthlyReportId = 1;

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setSaved(false);
    setError(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        const parsed: LineSummaryRow[] = [];

        for (const [sheetName, dayType] of Object.entries(SHEET_DAY_TYPE)) {
          if (workbook.SheetNames.includes(sheetName)) {
            parsed.push(...parseSheet(workbook.Sheets[sheetName], dayType));
          }
        }

        if (parsed.length === 0) {
          setError(
            "No data rows found. Make sure the file has Weekday, Saturday, and/or Sunday sheets.",
          );
          return;
        }

        setRows(parsed);
      } catch {
        setError("Failed to parse the Excel file. Please check the format.");
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const handleSave = async () => {
    if (rows.length === 0) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/line-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monthlyReportId, rows }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Server error ${res.status}`);
      }

      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  const dayTypes: DayType[] = ["weekday", "saturday", "sunday"];

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Monthly Line Summary Import</h1>
      <p style={{ color: "#555" }}>
        Upload the Monthly Line Summary Report Excel file. Weekday, Saturday,
        and Sunday sheets will be parsed automatically.
      </p>

      {/* File input */}
      <div style={{ margin: "1.5rem 0" }}>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFile}
          style={{ display: "block", marginBottom: "0.5rem" }}
        />
        {fileName && (
          <span style={{ fontSize: "0.875rem", color: "#444" }}>
            Loaded: {fileName}
          </span>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div
          style={{
            background: "#fee2e2",
            border: "1px solid #f87171",
            borderRadius: 6,
            padding: "0.75rem 1rem",
            marginBottom: "1rem",
            color: "#b91c1c",
          }}
        >
          {error}
        </div>
      )}

      {/* Preview tables, one per day type */}
      {rows.length > 0 && (
        <>
          <p style={{ marginBottom: "0.5rem" }}>
            <strong>{rows.length}</strong> rows parsed across{" "}
            {dayTypes.filter((d) => rows.some((r) => r.dayType === d)).length}{" "}
            day type(s).
          </p>

          {dayTypes.map((dt) => {
            const subset = rows.filter((r) => r.dayType === dt);
            if (subset.length === 0) return null;
            return (
              <section key={dt} style={{ marginBottom: "2rem" }}>
                <h2 style={{ textTransform: "capitalize" }}>{dt}</h2>
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      borderCollapse: "collapse",
                      width: "100%",
                      fontSize: "0.8rem",
                    }}
                  >
                    <thead>
                      <tr style={{ background: "#f1f5f9" }}>
                        {[
                          "Route",
                          "Peak Veh.",
                          "Rev. Time (h)",
                          "Non-Rev. Time (h)",
                          "Recovery (h)",
                          "Rev. Miles",
                          "Non-Rev. Miles",
                          "Rev. Trips",
                          "Non-Rev. Trips",
                          "Total Time (h)",
                          "Total Miles",
                        ].map((h) => (
                          <th
                            key={h}
                            style={{
                              border: "1px solid #cbd5e1",
                              padding: "6px 10px",
                              textAlign: "right",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {subset.map((r, i) => (
                        <tr
                          key={i}
                          style={{
                            background: i % 2 === 0 ? "#fff" : "#f8fafc",
                          }}
                        >
                          {[
                            r.routeNumber,
                            r.peakVehicles,
                            r.revenueTimeHours,
                            r.nonRevenueTimeHours,
                            r.recoveryTimeHours,
                            r.revenueDistanceMiles,
                            r.nonRevenueDistanceMiles,
                            r.revenueTrips,
                            r.nonRevenueTrips,
                            r.totalTimeHours,
                            r.totalDistanceMiles,
                          ].map((val, j) => (
                            <td
                              key={j}
                              style={{
                                border: "1px solid #e2e8f0",
                                padding: "5px 10px",
                                textAlign: "right",
                              }}
                            >
                              {val ?? "—"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })}

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving || saved}
            style={{
              background: saved ? "#16a34a" : "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "0.6rem 1.4rem",
              fontSize: "1rem",
              cursor: saving || saved ? "default" : "pointer",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saved ? "✓ Saved" : saving ? "Saving…" : "Save to Database"}
          </button>
        </>
      )}
    </main>
  );
}
