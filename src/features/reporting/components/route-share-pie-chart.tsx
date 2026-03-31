"use client";

import { Box, Typography } from "@mui/material";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { getRouteColor } from "@/features/reporting/lib/route-color-palette";

type RouteShareEntry = {
  routeNumber: number;
  routeName: string;
  totalMonthlyRidership: number;
  colorOverride?: string;
};

type RouteSharePieChartProps = {
  data: RouteShareEntry[];
};

export default function RouteSharePieChart({ data }: RouteSharePieChartProps) {
  const chartData = data.map((entry, i) => ({
    name: `${entry.routeNumber} – ${entry.routeName}`,
    value: entry.totalMonthlyRidership,
    fill: getRouteColor(i, entry.colorOverride),
  }));

  return (
    <Box sx={{ "& svg": { outline: "none" } }}>
      <Typography variant="h5" gutterBottom>
        Fixed-Route Ridership Share
      </Typography>
      <ResponsiveContainer width="100%" height={500}>
        <PieChart style={{ outline: "none" }}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={160}
            label={false}
            style={{ outline: "none" }}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} style={{ outline: "none" }} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => value.toLocaleString()}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            wrapperStyle={{ fontSize: 12, maxHeight: 480, overflowY: "auto" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}
