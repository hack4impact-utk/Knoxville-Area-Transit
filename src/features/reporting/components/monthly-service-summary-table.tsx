"use client";

import React from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import {
  formatPassengers,
  formatPassengersPerHour,
  formatPassengersPerMile,
  formatRevenueHours,
  formatRevenueMiles,
} from "@/utils/formatters";

export interface ServiceRow {
  routeNumber: string;
  routeName: string;
  passengers?: number;
  revenueMiles?: number;
  revenueHours?: number;
}

export interface MonthlySummaryData {
  selectedMonth: string;
  fixedRoutes: ServiceRow[];
  lift: ServiceRow;
  charter: ServiceRow;
}

function sumField(rows: ServiceRow[], key: keyof ServiceRow): number {
  return rows.reduce((acc, row) => acc + ((row[key] as number) ?? 0), 0);
}

function deriveRow(
  label: string,
  routeNumber: string,
  rows: ServiceRow[],
): ServiceRow {
  return {
    routeNumber,
    routeName: label,
    passengers: sumField(rows, "passengers"),
    revenueMiles: sumField(rows, "revenueMiles"),
    revenueHours: sumField(rows, "revenueHours"),
  };
}

function formatMonth(iso: string): string {
  const [year, month] = iso.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

const COLUMNS = [
  { id: "routeNumber", label: "-", align: "left" as const, width: 80 },
  { id: "routeName", label: "-", align: "left" as const, width: 220 },
  {
    id: "passengers",
    label: "Passengers",
    align: "right" as const,
    width: 110,
  },
  {
    id: "revenueMiles",
    label: "Rev. Miles",
    align: "right" as const,
    width: 110,
  },
  {
    id: "revenueHours",
    label: "Rev. Hours",
    align: "right" as const,
    width: 110,
  },
  {
    id: "passPerMile",
    label: "Pass/Mile",
    align: "right" as const,
    width: 100,
  },
  {
    id: "passPerHour",
    label: "Pass/Hour",
    align: "right" as const,
    width: 100,
  },
];

interface DataRowProps {
  row: ServiceRow;
  sx?: SxProps<Theme>;
}

function DataRow({ row, sx }: DataRowProps) {
  return (
    <TableRow sx={sx}>
      <TableCell>{row.routeNumber}</TableCell>
      <TableCell>{row.routeName}</TableCell>
      <TableCell align="right">{formatPassengers(row.passengers)}</TableCell>
      <TableCell align="right">
        {formatRevenueMiles(row.revenueMiles)}
      </TableCell>
      <TableCell align="right">
        {formatRevenueHours(row.revenueHours)}
      </TableCell>
      <TableCell align="right">
        {formatPassengersPerMile(row.passengers, row.revenueMiles)}
      </TableCell>
      <TableCell align="right">
        {formatPassengersPerHour(row.passengers, row.revenueHours)}
      </TableCell>
    </TableRow>
  );
}

interface SummaryRowProps {
  row: ServiceRow;
  variant?: "subtotal" | "total" | "grand";
}

const summaryStyles: Record<string, SxProps<Theme>> = {
  subtotal: {
    backgroundColor: "action.hover",
    "& td": { fontWeight: 600, borderTop: "2px solid", borderColor: "divider" },
  },
  total: {
    backgroundColor: "primary.50",
    "& td": {
      fontWeight: 700,
      borderTop: "2px solid",
      borderColor: "primary.light",
    },
  },
  grand: {
    backgroundColor: "primary.main",
    "& td": {
      fontWeight: 700,
      color: "primary.contrastText",
      borderTop: "2px solid",
      borderColor: "primary.dark",
    },
  },
};

function SummaryRow({ row, variant = "subtotal" }: SummaryRowProps) {
  return <DataRow row={row} sx={summaryStyles[variant]} />;
}

interface MonthlyServiceSummaryTableProps {
  data: MonthlySummaryData;
}

export default function MonthlyServiceSummaryTable({
  data,
}: MonthlyServiceSummaryTableProps) {
  const { selectedMonth, fixedRoutes, lift, charter } = data;

  const subtotalLineService = deriveRow("Subtotal — Line Service", "SUB", [
    ...fixedRoutes,
    lift,
  ]);

  const totalScheduled = deriveRow("Total Scheduled Service", "SCHED", [
    ...fixedRoutes,
    lift,
  ]);

  const grandTotal = deriveRow("Grand Total — All KAT Services", "TOTAL", [
    ...fixedRoutes,
    lift,
    charter,
  ]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h1" fontWeight={700} gutterBottom>
          Monthly Service Summary
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Reporting Period: {formatMonth(selectedMonth)}
        </Typography>
      </Box>

      <Paper variant="outlined" sx={{ overflow: "hidden", borderRadius: 2 }}>
        <Box sx={{ overflowX: "auto" }}>
          <Table
            size="small"
            aria-label="Monthly service summary table"
            sx={{ minWidth: 760 }}
          >
            {/* Column headers */}
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.100" }}>
                {COLUMNS.map((col) => (
                  <TableCell
                    key={col.id}
                    align={col.align}
                    sx={{
                      width: col.width,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      fontSize: "0.8rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "text.secondary",
                    }}
                  >
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <SummaryRow row={grandTotal} variant="grand" />
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </Box>
  );
}
