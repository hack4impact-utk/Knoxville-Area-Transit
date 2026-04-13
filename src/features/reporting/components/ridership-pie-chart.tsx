"use client";

import React, { useEffect, useRef } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { MonthlySummaryData } from "./monthly-service-summary-table";

const SLICE_COLORS = [
  "#378ADD", "#E24B4A", "#1D9E75", "#BA7517", "#D4537E",
  "#7F77DD", "#185FA5", "#3B6D11", "#534AB7", "#639922",
  "#D85A30", "#0F6E56", "#888780", "#5DCAA5", "#F0997B",
  "#AFA9EC", "#FA8C2A", "#97C459", "#F4C0D1",
];

function formatMonth(iso: string): string {
  const [year, month] = iso.split("-");
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" }
  );
}


interface RidershipPieChartProps {
  data: MonthlySummaryData;
}

export default function RidershipPieChart({ data }: RidershipPieChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  const { selectedMonth, fixedRoutes, lift, charter } = data;

  const slices = [
    ...fixedRoutes.map((r) => ({
      label: `${r.routeNumber} - ${r.routeName}`,
      passengers: r.passengers ?? 0,
    })),
    { label: `${lift.routeNumber} - ${lift.routeName}`, passengers: lift.passengers ?? 0 },
    { label: `${charter.routeNumber} - ${charter.routeName}`, passengers: charter.passengers ?? 0 },
  ];

  const total = slices.reduce((s, r) => s + r.passengers, 0);

  useEffect(() => {
    if (!canvasRef.current) return;

    import("chart.js/auto").then(({ default: Chart }) => {

      // Destroy previous instance if it exists
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      chartRef.current = new Chart(canvasRef.current!, {
        type: "pie",
        data: {
          labels: slices.map((s) => s.label),
          datasets: [
            {
              data: slices.map((s) => s.passengers),
              backgroundColor: slices.map((_, i) => SLICE_COLORS[i % SLICE_COLORS.length]),
              borderColor: "#ffffff",
              borderWidth: 1.5,
              hoverOffset: 10,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: `${formatMonth(selectedMonth)} System Ridership by Route`,
              font: { size: 15, weight: "bold" },
              padding: { bottom: 16 },
            },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const val = ctx.parsed as number;
                  const pct = total > 0 ? ((val / total) * 100).toFixed(1) : "0.0";
                  return ` ${ctx.label}: ${val.toLocaleString()} (${pct}%)`;
                },
              },
            },
          },
        },
      });
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [data]);

  return (
    <Box>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Box sx={{ position: "relative", width: "100%", height: 420 }}>
          <canvas ref={canvasRef} />
        </Box>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "4px 16px",
          mt: 2,
        }}
      >
        {slices.map((s, i) => {
          const pct = total > 0 ? Math.round((s.passengers / total) * 100) : 0;
          return (
            <Box
              key={s.label}
              sx={{ display: "flex", alignItems: "center", gap: 1, overflow: "hidden" }}
              title={`${s.label}: ${s.passengers.toLocaleString()} (${pct}%)`}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "2px",
                  flexShrink: 0,
                  backgroundColor: SLICE_COLORS[i % SLICE_COLORS.length],
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                sx={{ fontSize: "0.75rem" }}
              >
                {s.label}: {s.passengers.toLocaleString()}, {pct}%
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}