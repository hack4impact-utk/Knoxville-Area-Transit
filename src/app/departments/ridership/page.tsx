
"use client";

import React, { useEffect, useState } from "react";
import type { JSX } from "react";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import Grid from "@mui/material/Grid";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";

const isNonNegative = (value: string): boolean => {
  if (value === "") return true;
  const num = Number.parseFloat(value);
  return !Number.isNaN(num) && num >= 0;
};

const handleNumericChange = (
  value: string,
  setter: (value: string) => void
): void => {
  if (value === "" || /^\d*\.?\d*$/.test(value)) {
    setter(value);
  }
};

async function checkMonthExists(monthlyReportId: number) {
  const res = await fetch(
    `/api/ridership/exists?monthlyReportId=${monthlyReportId}`
  );

  if (!res.ok) return false;

  const data = await res.json();
  return data.exists;
}

export default function RiderShip(): JSX.Element {
  const [reportingMonth, setReportingMonth] = useState<Dayjs | null>(null);

  const [routeNumber, setRouteNumber] = useState("");
  const [routeName, setRouteName] = useState("");

  const [dayType, setDayType] = useState("");

  const [scheduleId, setScheduleId] = useState("");
  const [avgDailyRidershipUpt, setAvgDailyRidershipUpt] = useState("");
  const [avgDailyPassMilesPmt, setAvgDailyPassMilesPmt] = useState("");
  const [avgTripLengthPtl, setAvgTripLengthPtl] = useState("");

  const [sampledTrips, setSampledTrips] = useState("");
  const [scheduledTrips, setScheduledTrips] = useState("");

  const [expansionFactor, setExpansionFactor] = useState("");

  const [expandedRidershipUpt, setExpandedRidershipUpt] = useState("");
  const [expandedPassMilesPmt, setExpandedPassMilesPmt] = useState("");

  const [expandedRevenueMiles, setExpandedRevenueMiles] = useState("");
  const [expandedRevenueHours, setExpandedRevenueHours] = useState("");

  const [dayCount, setDayCount] = useState("");

  const [monthlyRidershipUpt, setMonthlyRidershipUpt] = useState("");
  const [monthlyPassMilesPmt, setMonthlyPassMilesPmt] = useState("");

  const [monthlyRevenueMiles, setMonthlyRevenueMiles] = useState("");
  const [monthlyRevenueHours, setMonthlyRevenueHours] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [savedRows, setSavedRows] = useState<any[]>([]);

  const isFormValid = reportingMonth !== null && dayType !== "";

  let monthlyReportId = reportingMonth ? reportingMonth.year() * 100 + (reportingMonth.month() + 1) : null;

  async function loadRows() {
    if (!monthlyReportId) return;

    try {
      const res = await fetch(
        `/api/ridership?monthlyReportId=${monthlyReportId}`
      );

      if (!res.ok) return;

      const data = await res.json();
      setSavedRows(data);
    } catch (err) {
      console.error("Failed loading ridership rows", err);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    const payload = [
      {
        monthlyReportId,
        routeNumber: routeNumber ? Number(routeNumber) : null,
        routeName,

        dayType,

        avgDailyRidershipUpt: avgDailyRidershipUpt
          ? Number(avgDailyRidershipUpt)
          : null,
        avgDailyPassMilesPmt: avgDailyPassMilesPmt
          ? Number(avgDailyPassMilesPmt)
          : null,
        avgTripLengthPtl: avgTripLengthPtl ? Number(avgTripLengthPtl) : null,

        scheduleId: scheduleId ? Number(scheduleId) : null,
        sampledTrips: sampledTrips ? Number(sampledTrips) : null,
        scheduledTrips: scheduledTrips ? Number(scheduledTrips) : null,

        expansionFactor: expansionFactor ? Number(expansionFactor) : null,

        expandedRidershipUpt: expandedRidershipUpt
          ? Number(expandedRidershipUpt)
          : null,
        expandedPassMilesPmt: expandedPassMilesPmt
          ? Number(expandedPassMilesPmt)
          : null,

        expandedRevenueMiles: expandedRevenueMiles
          ? Number(expandedRevenueMiles)
          : null,
        expandedRevenueHours: expandedRevenueHours
          ? Number(expandedRevenueHours)
          : null,

        dayCount: dayCount ? Number(dayCount) : null,

        monthlyRidershipUpt: monthlyRidershipUpt
          ? Number(monthlyRidershipUpt)
          : null,
        monthlyPassMilesPmt: monthlyPassMilesPmt
          ? Number(monthlyPassMilesPmt)
          : null,

        monthlyRevenueMiles: monthlyRevenueMiles
          ? Number(monthlyRevenueMiles)
          : null,
        monthlyRevenueHours: monthlyRevenueHours
          ? Number(monthlyRevenueHours)
          : null,
      },
    ];

    const answer = await checkMonthExists(monthlyReportId as number);
    if(answer) {
      const confirmed = window.confirm(
        "Data already exists for this month. Continuing will replace the existing data. Continue?"
        );

      if (!confirmed) {
        setIsSubmitting(false);
        return;
      }
    }
    try {
      const res = await fetch("/api/ridership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        setSubmitError(text);
        return;
      }

      setSubmitSuccess(true);

      await loadRows();
    } catch (err) {
      setSubmitError("Unexpected error while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Fixed Route Monthly Ridership
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={4}>
                  <DatePicker
                    label="Reporting Month"
                    views={["year", "month"]}
                    value={reportingMonth}
                    onChange={(v) => setReportingMonth(v)}
                    slotProps={{ textField: { fullWidth: true, required: true} }}
                  />


              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <TextField
                    label="Route Number"
                    value={routeNumber}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setRouteNumber)
                    }
                    fullWidth
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Route Name"
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                    fullWidth
                  />
                </Grid>
              </Grid>

              <FormControl fullWidth>
                <InputLabel>Day Type</InputLabel>
                <Select
                  value={dayType}
                  label="Day Type"
                  onChange={(e) => setDayType(e.target.value)}
                >
                  <MenuItem value="weekday">Weekday</MenuItem>
                  <MenuItem value="saturday">Saturday</MenuItem>
                  <MenuItem value="sunday">Sunday</MenuItem>
                </Select>
              </FormControl>

              {/* Schedule */}
              <Typography variant="h6">Schedule</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Schedule ID"
                    value={scheduleId}
                    onChange={(e) => handleNumericChange(e.target.value, setScheduleId)}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    label="Day Count"
                    value={dayCount}
                    onChange={(e) => handleNumericChange(e.target.value, setDayCount)}
                    fullWidth
                  />
                </Grid>
              </Grid>

              {/* Daily Averages */}
              <Typography variant="h6">Daily Averages</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Avg Daily Ridership (UPT)"
                    value={avgDailyRidershipUpt}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setAvgDailyRidershipUpt)
                    }
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    label="Avg Daily Passenger Miles (PMT)"
                    value={avgDailyPassMilesPmt}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setAvgDailyPassMilesPmt)
                    }
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    label="Avg Trip Length (PTL)"
                    value={avgTripLengthPtl}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setAvgTripLengthPtl)
                    }
                    fullWidth
                  />
                </Grid>
              </Grid>

              {/* Trip Sampling */}
              <Typography variant="h6">Trip Sampling</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Sampled Trips"
                    value={sampledTrips}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setSampledTrips)
                    }
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    label="Scheduled Trips"
                    value={scheduledTrips}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setScheduledTrips)
                    }
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    label="Expansion Factor"
                    value={expansionFactor}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setExpansionFactor)
                    }
                    fullWidth
                  />
                </Grid>
              </Grid>

              {/* Expanded Totals */}
              <Typography variant="h6">Expanded Totals</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Expanded Ridership (UPT)"
                    value={expandedRidershipUpt}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setExpandedRidershipUpt)
                    }
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    label="Expanded Passenger Miles (PMT)"
                    value={expandedPassMilesPmt}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setExpandedPassMilesPmt)
                    }
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    label="Expanded Revenue Miles"
                    value={expandedRevenueMiles}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setExpandedRevenueMiles)
                    }
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    label="Expanded Revenue Hours"
                    value={expandedRevenueHours}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setExpandedRevenueHours)
                    }
                    fullWidth
                  />
                </Grid>
              </Grid>

              {/* Monthly Totals */}
              <Typography variant="h6">Monthly Totals</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Monthly Ridership (UPT)"
                    value={monthlyRidershipUpt}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setMonthlyRidershipUpt)
                    }
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    label="Monthly Passenger Miles (PMT)"
                    value={monthlyPassMilesPmt}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setMonthlyPassMilesPmt)
                    }
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    label="Monthly Revenue Miles"
                    value={monthlyRevenueMiles}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setMonthlyRevenueMiles)
                    }
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    label="Monthly Revenue Hours"
                    value={monthlyRevenueHours}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setMonthlyRevenueHours)
                    }
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                variant="contained"
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Confirm & Save"}
              </Button>

              {submitError && (
                <Typography color="error">{submitError}</Typography>
              )}

              {submitSuccess && (
                <Typography color="success.main">
                  Saved successfully.
                </Typography>
              )}
            </Stack>
          </Box>

          <Box sx={{ mt: 6 }}>

            {savedRows.length === 0 ? (
              <Typography>No rows saved yet.</Typography>
            ) : (

<Box>
  <Typography variant="h5" sx={{ mb: 2 }}>
    Saved Rows: {savedRows.length}
  </Typography>

  <TableContainer component={Paper}>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Monthly Report Id</TableCell>
          <TableCell>Route #</TableCell>
          <TableCell>Route Name</TableCell>
          <TableCell>Day Type</TableCell>
          <TableCell>Schedule ID</TableCell>
          <TableCell>Avg Daily Riders</TableCell>
          <TableCell>Avg Passenger Miles</TableCell>
          <TableCell>Avg Trip Length</TableCell>
          <TableCell>Sampled Trips</TableCell>
          <TableCell>Scheduled Trips</TableCell>
          <TableCell>Expansion Factor</TableCell>
          <TableCell>Expanded Ridership</TableCell>
          <TableCell>Monthly Ridership</TableCell>
          <TableCell>Monthly Passenger Miles</TableCell>
          <TableCell>Monthly Revenue Miles</TableCell>
          <TableCell>Monthly Revenue Hours</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {savedRows.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.routeNumber ?? "-"}</TableCell>
            <TableCell>{row.routeName ?? "-"}</TableCell>
            <TableCell>{row.dayType}</TableCell>
            <TableCell>{row.scheduleId ?? "-"}</TableCell>
            <TableCell>{row.avgDailyRidershipUpt ?? 0}</TableCell>
            <TableCell>{row.avgDailyPassMilesPmt ?? 0}</TableCell>
            <TableCell>{row.avgTripLengthPtl ?? 0}</TableCell>
            <TableCell>{row.sampledTrips ?? 0}</TableCell>
            <TableCell>{row.scheduledTrips ?? 0}</TableCell>
            <TableCell>{row.expansionFactor ?? 0}</TableCell>
            <TableCell>{row.expandedRidershipUpt ?? 0}</TableCell>
            <TableCell>{row.monthlyRidershipUpt ?? 0}</TableCell>
            <TableCell>{row.monthlyPassMilesPmt ?? 0}</TableCell>
            <TableCell>{row.monthlyRevenueMiles ?? 0}</TableCell>
            <TableCell>{row.monthlyRevenueHours ?? 0}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
</Box>
            )}
          </Box>
        </Box>
      </LocalizationProvider>
    </main>
  );
}