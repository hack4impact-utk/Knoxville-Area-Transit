"use client";

import React, { useState, useEffect } from "react";
import type { JSX } from "react";

import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";

const isNonNegative = (value: string): boolean => {
  if (value === "") return true;
  const num = Number.parseFloat(value);
  return !Number.isNaN(num) && num >= 0;
};

const isPercent = (value: string): boolean => {
  if (value === "") return true;
  const num = Number.parseFloat(value);
  return !Number.isNaN(num) && num >= 0 && num <= 100;
};

const handleNumericChange = (
  value: string,
  setter: (value: string) => void,
): void => {
  if (value === "" || /^\d*\.?\d*$/.test(value)) {
    setter(value);
  }
};

type LiftMetricsRow = {
  id: number;
  reportingMonth: string;
  tripsDenied: number | null;
  noShows: number | null;
  tripsScheduled: number | null;
  totalPassengers: number | null;
  revenueVehicleMiles: string | null;
  revenueVehicleHours: string | null;
  avgCostPerTrip: string | null;
  passengerPerMile: string | null;
  passengerPerHour: string | null;
  otpPercent: string | null;
  avgWeekdayRidership: string | null;
  avgSaturdayRidership: string | null;
  avgSundayRidership: string | null;
  totalWeekdayRidership: string | null;
  totalSaturdayRidership: string | null;
  totalSundayRidership: string | null;
  createdAt: string;
};

export default function LiftPage(): JSX.Element {
  const [reportingMonth, setReportingMonth] = useState<Dayjs | null>(null);

  const [tripsDenied, setTripsDenied] = useState<string>("");
  const [noShows, setNoShows] = useState<string>("");
  const [tripsScheduled, setTripsScheduled] = useState<string>("");
  const [totalPassengers, setTotalPassengers] = useState<string>("");

  const [revenueVehicleMiles, setRevenueVehicleMiles] = useState<string>("");
  const [revenueVehicleHours, setRevenueVehicleHours] = useState<string>("");

  const [passengerPerMile, setPassengerPerMile] = useState<string>("");
  const [passengerPerHour, setPassengerPerHour] = useState<string>("");

  const [otpPercent, setOtpPercent] = useState<string>("");

  const [avgWeekdayRidership, setAvgWeekdayRidership] = useState<string>("");
  const [avgSaturdayRidership, setAvgSaturdayRidership] = useState<string>("");
  const [avgSundayRidership, setAvgSundayRidership] = useState<string>("");

  const [totalWeekdayRidership, setTotalWeekdayRidership] =
    useState<string>("");
  const [totalSaturdayRidership, setTotalSaturdayRidership] =
    useState<string>("");
  const [totalSundayRidership, setTotalSundayRidership] = useState<string>("");

  const [avgCostPerTrip, setAvgCostPerTrip] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const [savedMetrics, setSavedMetrics] = useState<LiftMetricsRow[]>([]);

  const isFormValid =
    reportingMonth !== null &&
    isNonNegative(tripsDenied) &&
    isNonNegative(noShows) &&
    isNonNegative(tripsScheduled) &&
    isNonNegative(totalPassengers) &&
    isNonNegative(revenueVehicleMiles) &&
    isNonNegative(revenueVehicleHours) &&
    isNonNegative(avgCostPerTrip) &&
    isNonNegative(passengerPerMile) &&
    isNonNegative(passengerPerHour) &&
    isPercent(otpPercent) &&
    isNonNegative(avgWeekdayRidership) &&
    isNonNegative(avgSaturdayRidership) &&
    isNonNegative(avgSundayRidership) &&
    isNonNegative(totalWeekdayRidership) &&
    isNonNegative(totalSaturdayRidership) &&
    isNonNegative(totalSundayRidership);

  const loadMetrics = async () => {
    try {
      const res = await fetch("/api/lift");
      if (res.ok) {
        const data = (await res.json()) as LiftMetricsRow[];
        setSavedMetrics(data);
      }
    } catch (err) {
      console.error("Failed to load metrics:", err);
    }
  };

  useEffect(() => {
    void loadMetrics();
  }, []);

  const handleSubmit = async () => {
    if (!reportingMonth) return;
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const res = await fetch("/api/lift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportingMonth: reportingMonth.toISOString(),
          tripsDenied: tripsDenied !== "" ? Number(tripsDenied) : null,
          noShows: noShows !== "" ? Number(noShows) : null,
          tripsScheduled: tripsScheduled !== "" ? Number(tripsScheduled) : null,
          totalPassengers:
            totalPassengers !== "" ? Number(totalPassengers) : null,
          revenueVehicleMiles:
            revenueVehicleMiles !== "" ? Number(revenueVehicleMiles) : null,
          revenueVehicleHours:
            revenueVehicleHours !== "" ? Number(revenueVehicleHours) : null,
          avgCostPerTrip: avgCostPerTrip !== "" ? Number(avgCostPerTrip) : null,
          passengerPerMile:
            passengerPerMile !== "" ? Number(passengerPerMile) : null,
          passengerPerHour:
            passengerPerHour !== "" ? Number(passengerPerHour) : null,
          otpPercent: otpPercent !== "" ? Number(otpPercent) : null,
          avgWeekdayRidership:
            avgWeekdayRidership !== "" ? Number(avgWeekdayRidership) : null,
          avgSaturdayRidership:
            avgSaturdayRidership !== "" ? Number(avgSaturdayRidership) : null,
          avgSundayRidership:
            avgSundayRidership !== "" ? Number(avgSundayRidership) : null,
          totalWeekdayRidership:
            totalWeekdayRidership !== "" ? Number(totalWeekdayRidership) : null,
          totalSaturdayRidership:
            totalSaturdayRidership !== ""
              ? Number(totalSaturdayRidership)
              : null,
          totalSundayRidership:
            totalSundayRidership !== "" ? Number(totalSundayRidership) : null,
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setSubmitError(data.error ?? "An error occurred.");
      } else {
        setSubmitSuccess(true);
        await loadMetrics();
      }
    } catch (err) {
      console.error(err);
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Lift – Monthly Metrics Entry
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            Enter monthly Lift service metrics
          </Typography>

          <Stack spacing={4}>
            {/* Reporting Month */}
            <Box maxWidth={320}>
              <DatePicker
                label="Reporting Month"
                views={["year", "month"]}
                value={reportingMonth}
                onChange={(newValue) => setReportingMonth(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                  },
                }}
              />
            </Box>

            {/* Trips + Passengers */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Trips Denied"
                  type="number"
                  value={tripsDenied}
                  onChange={(e) =>
                    handleNumericChange(e.target.value, setTripsDenied)
                  }
                  error={!isNonNegative(tripsDenied)}
                  helperText={
                    isNonNegative(tripsDenied)
                      ? ""
                      : "Must be a non-negative number."
                  }
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="No-Shows"
                  type="number"
                  value={noShows}
                  onChange={(e) =>
                    handleNumericChange(e.target.value, setNoShows)
                  }
                  error={!isNonNegative(noShows)}
                  helperText={
                    isNonNegative(noShows)
                      ? ""
                      : "Must be a non-negative number."
                  }
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Trips Scheduled"
                  type="number"
                  value={tripsScheduled}
                  onChange={(e) =>
                    handleNumericChange(e.target.value, setTripsScheduled)
                  }
                  error={!isNonNegative(tripsScheduled)}
                  helperText={
                    isNonNegative(tripsScheduled)
                      ? ""
                      : "Must be a non-negative number."
                  }
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Total Passengers"
                  type="number"
                  value={totalPassengers}
                  onChange={(e) =>
                    handleNumericChange(e.target.value, setTotalPassengers)
                  }
                  error={!isNonNegative(totalPassengers)}
                  helperText={
                    isNonNegative(totalPassengers)
                      ? ""
                      : "Must be a non-negative number."
                  }
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>

            {/* Revenue Miles / Hours */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Revenue Vehicle Miles"
                  type="number"
                  value={revenueVehicleMiles}
                  onChange={(e) =>
                    handleNumericChange(e.target.value, setRevenueVehicleMiles)
                  }
                  error={!isNonNegative(revenueVehicleMiles)}
                  helperText={
                    isNonNegative(revenueVehicleMiles)
                      ? ""
                      : "Must be a non-negative number."
                  }
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Revenue Vehicle Hours"
                  type="number"
                  value={revenueVehicleHours}
                  onChange={(e) =>
                    handleNumericChange(e.target.value, setRevenueVehicleHours)
                  }
                  error={!isNonNegative(revenueVehicleHours)}
                  helperText={
                    isNonNegative(revenueVehicleHours)
                      ? ""
                      : "Must be a non-negative number."
                  }
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Average Cost per Trip"
                  type="number"
                  value={avgCostPerTrip}
                  onChange={(e) =>
                    handleNumericChange(e.target.value, setAvgCostPerTrip)
                  }
                  error={!isNonNegative(avgCostPerTrip)}
                  helperText={
                    isNonNegative(avgCostPerTrip)
                      ? ""
                      : "Must be a non-negative number."
                  }
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>

            {/* Passenger per Mile / Hour + OTP */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Passengers per Mile"
                  type="number"
                  value={passengerPerMile}
                  onChange={(e) =>
                    handleNumericChange(e.target.value, setPassengerPerMile)
                  }
                  error={!isNonNegative(passengerPerMile)}
                  helperText={
                    isNonNegative(passengerPerMile)
                      ? ""
                      : "Must be a non-negative number."
                  }
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Passengers per Hour"
                  type="number"
                  value={passengerPerHour}
                  onChange={(e) =>
                    handleNumericChange(e.target.value, setPassengerPerHour)
                  }
                  error={!isNonNegative(passengerPerHour)}
                  helperText={
                    isNonNegative(passengerPerHour)
                      ? ""
                      : "Must be a non-negative number."
                  }
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="On-Time Performance %"
                  type="number"
                  value={otpPercent}
                  onChange={(e) =>
                    handleNumericChange(e.target.value, setOtpPercent)
                  }
                  error={!isPercent(otpPercent)}
                  helperText={
                    isPercent(otpPercent) ? "" : "Must be between 0 and 100."
                  }
                  fullWidth
                  inputProps={{ min: 0, max: 100 }}
                />
              </Grid>
            </Grid>

            {/* Average Ridership */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Avg. Weekday Ridership"
                  type="number"
                  value={avgWeekdayRidership}
                  onChange={(e) =>
                    handleNumericChange(e.target.value, setAvgWeekdayRidership)
                  }
                  error={!isNonNegative(avgWeekdayRidership)}
                  helperText={
                    isNonNegative(avgWeekdayRidership)
                      ? ""
                      : "Must be a non-negative number."
                  }
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Avg. Saturday Ridership"
                  type="number"
                  value={avgSaturdayRidership}
                  onChange={(e) =>
                    handleNumericChange(e.target.value, setAvgSaturdayRidership)
                  }
                  error={!isNonNegative(avgSaturdayRidership)}
                  helperText={
                    isNonNegative(avgSaturdayRidership)
                      ? ""
                      : "Must be a non-negative number."
                  }
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Avg. Sunday Ridership"
                  type="number"
                  value={avgSundayRidership}
                  onChange={(e) =>
                    handleNumericChange(e.target.value, setAvgSundayRidership)
                  }
                  error={!isNonNegative(avgSundayRidership)}
                  helperText={
                    isNonNegative(avgSundayRidership)
                      ? ""
                      : "Must be a non-negative number."
                  }
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>

            {/* Total Ridership */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Total Weekday Ridership"
                  type="number"
                  value={totalWeekdayRidership}
                  onChange={(e) =>
                    handleNumericChange(
                      e.target.value,
                      setTotalWeekdayRidership,
                    )
                  }
                  error={!isNonNegative(totalWeekdayRidership)}
                  helperText={
                    isNonNegative(totalWeekdayRidership)
                      ? ""
                      : "Must be a non-negative number."
                  }
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Total Saturday Ridership"
                  type="number"
                  value={totalSaturdayRidership}
                  onChange={(e) =>
                    handleNumericChange(
                      e.target.value,
                      setTotalSaturdayRidership,
                    )
                  }
                  error={!isNonNegative(totalSaturdayRidership)}
                  helperText={
                    isNonNegative(totalSaturdayRidership)
                      ? ""
                      : "Must be a non-negative number."
                  }
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Total Sunday Ridership"
                  type="number"
                  value={totalSundayRidership}
                  onChange={(e) =>
                    handleNumericChange(e.target.value, setTotalSundayRidership)
                  }
                  error={!isNonNegative(totalSundayRidership)}
                  helperText={
                    isNonNegative(totalSundayRidership)
                      ? ""
                      : "Must be a non-negative number."
                  }
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>

            {/* Feedback */}
            {submitSuccess && (
              <Alert severity="success">Metrics saved successfully!</Alert>
            )}
            {submitError && <Alert severity="error">{submitError}</Alert>}

            {/* Save Button */}
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                disabled={!isFormValid || isSubmitting}
                onClick={() => void handleSubmit()}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </Box>

            {/* Saved Entries */}
            {savedMetrics.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Saved Entries
                </Typography>
                <Stack spacing={2}>
                  {savedMetrics.map((row) => (
                    <Box
                      key={row.id}
                      sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        {row.reportingMonth}
                      </Typography>
                      <Typography variant="body2">
                        Trips Scheduled: {row.tripsScheduled ?? "—"} | Denied:{" "}
                        {row.tripsDenied ?? "—"} | No-Shows:{" "}
                        {row.noShows ?? "—"} | Passengers:{" "}
                        {row.totalPassengers ?? "—"}
                      </Typography>
                      <Typography variant="body2">
                        Miles: {row.revenueVehicleMiles ?? "—"} | Hours:{" "}
                        {row.revenueVehicleHours ?? "—"} | OTP:{" "}
                        {row.otpPercent ?? "—"}%
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        </Box>
      </LocalizationProvider>
    </main>
  );
}
