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
  monthlyReportId: number;
  completedTrips: number | null;
  tripsScheduled: number | null;
  passengers: number | null;
  revenueMiles: number | null;
  revenueHours: number | null;
  tripsDenied: number | null;
  noShowsCancellations: number | null;
  weekdayRidership: number | null;
  saturdayRidership: number | null;
  sundayRidership: number | null;
  onTimePerformancePercent: number | null;
};

export default function LiftPage(): JSX.Element {
  const [monthlyReportId, setMonthlyReportId] = useState<string>("");

  const [completedTrips, setCompletedTrips] = useState<string>("");
  const [tripsScheduled, setTripsScheduled] = useState<string>("");
  const [passengers, setPassengers] = useState<string>("");
  const [revenueMiles, setRevenueMiles] = useState<string>("");
  const [revenueHours, setRevenueHours] = useState<string>("");
  const [tripsDenied, setTripsDenied] = useState<string>("");
  const [noShowsCancellations, setNoShowsCancellations] = useState<string>("");
  const [weekdayRidership, setWeekdayRidership] = useState<string>("");
  const [saturdayRidership, setSaturdayRidership] = useState<string>("");
  const [sundayRidership, setSundayRidership] = useState<string>("");
  const [onTimePerformancePercent, setOnTimePerformancePercent] =
    useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const [savedMetrics, setSavedMetrics] = useState<LiftMetricsRow[]>([]);

  const isFormValid =
    monthlyReportId !== "" &&
    isNonNegative(completedTrips) &&
    isNonNegative(tripsScheduled) &&
    isNonNegative(passengers) &&
    isNonNegative(revenueMiles) &&
    isNonNegative(revenueHours) &&
    isNonNegative(tripsDenied) &&
    isNonNegative(noShowsCancellations) &&
    isNonNegative(weekdayRidership) &&
    isNonNegative(saturdayRidership) &&
    isNonNegative(sundayRidership) &&
    isPercent(onTimePerformancePercent);

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

  const resetForm = () => {
    setMonthlyReportId("");
    setCompletedTrips("");
    setTripsScheduled("");
    setPassengers("");
    setRevenueMiles("");
    setRevenueHours("");
    setTripsDenied("");
    setNoShowsCancellations("");
    setWeekdayRidership("");
    setSaturdayRidership("");
    setSundayRidership("");
    setOnTimePerformancePercent("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const res = await fetch("/api/lift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monthlyReportId: Number(monthlyReportId),
          completedTrips:
            completedTrips !== "" ? Number(completedTrips) : null,
          tripsScheduled:
            tripsScheduled !== "" ? Number(tripsScheduled) : null,
          passengers: passengers !== "" ? Number(passengers) : null,
          revenueMiles: revenueMiles !== "" ? Number(revenueMiles) : null,
          revenueHours: revenueHours !== "" ? Number(revenueHours) : null,
          tripsDenied: tripsDenied !== "" ? Number(tripsDenied) : null,
          noShowsCancellations:
            noShowsCancellations !== ""
              ? Number(noShowsCancellations)
              : null,
          weekdayRidership:
            weekdayRidership !== "" ? Number(weekdayRidership) : null,
          saturdayRidership:
            saturdayRidership !== "" ? Number(saturdayRidership) : null,
          sundayRidership:
            sundayRidership !== "" ? Number(sundayRidership) : null,
          onTimePerformancePercent:
            onTimePerformancePercent !== ""
              ? Number(onTimePerformancePercent)
              : null,
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setSubmitError(data.error ?? "An error occurred.");
      } else {
        setSubmitSuccess(true);
        resetForm();
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
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Lift – Monthly Metrics Entry
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>
          Enter monthly Lift service metrics
        </Typography>

        <Stack spacing={4}>
          {/* Monthly Report ID */}
          <Box maxWidth={320}>
            <TextField
              label="Monthly Report ID"
              type="number"
              value={monthlyReportId}
              onChange={(e) =>
                handleNumericChange(e.target.value, setMonthlyReportId)
              }
              required
              fullWidth
              inputProps={{ min: 1 }}
            />
          </Box>

          {/* Trips */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <TextField
                label="Completed Trips"
                type="number"
                value={completedTrips}
                onChange={(e) =>
                  handleNumericChange(e.target.value, setCompletedTrips)
                }
                error={!isNonNegative(completedTrips)}
                helperText={
                  isNonNegative(completedTrips)
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
                label="Passengers"
                type="number"
                value={passengers}
                onChange={(e) =>
                  handleNumericChange(e.target.value, setPassengers)
                }
                error={!isNonNegative(passengers)}
                helperText={
                  isNonNegative(passengers)
                    ? ""
                    : "Must be a non-negative number."
                }
                fullWidth
                inputProps={{ min: 0 }}
              />
            </Grid>
          </Grid>

          {/* Revenue Miles / Hours + No-Shows */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Revenue Miles"
                type="number"
                value={revenueMiles}
                onChange={(e) =>
                  handleNumericChange(e.target.value, setRevenueMiles)
                }
                error={!isNonNegative(revenueMiles)}
                helperText={
                  isNonNegative(revenueMiles)
                    ? ""
                    : "Must be a non-negative number."
                }
                fullWidth
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Revenue Hours"
                type="number"
                value={revenueHours}
                onChange={(e) =>
                  handleNumericChange(e.target.value, setRevenueHours)
                }
                error={!isNonNegative(revenueHours)}
                helperText={
                  isNonNegative(revenueHours)
                    ? ""
                    : "Must be a non-negative number."
                }
                fullWidth
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="No-Shows / Cancellations"
                type="number"
                value={noShowsCancellations}
                onChange={(e) =>
                  handleNumericChange(e.target.value, setNoShowsCancellations)
                }
                error={!isNonNegative(noShowsCancellations)}
                helperText={
                  isNonNegative(noShowsCancellations)
                    ? ""
                    : "Must be a non-negative number."
                }
                fullWidth
                inputProps={{ min: 0 }}
              />
            </Grid>
          </Grid>

          {/* Ridership + OTP */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <TextField
                label="Weekday Ridership"
                type="number"
                value={weekdayRidership}
                onChange={(e) =>
                  handleNumericChange(e.target.value, setWeekdayRidership)
                }
                error={!isNonNegative(weekdayRidership)}
                helperText={
                  isNonNegative(weekdayRidership)
                    ? ""
                    : "Must be a non-negative number."
                }
                fullWidth
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="Saturday Ridership"
                type="number"
                value={saturdayRidership}
                onChange={(e) =>
                  handleNumericChange(e.target.value, setSaturdayRidership)
                }
                error={!isNonNegative(saturdayRidership)}
                helperText={
                  isNonNegative(saturdayRidership)
                    ? ""
                    : "Must be a non-negative number."
                }
                fullWidth
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="Sunday Ridership"
                type="number"
                value={sundayRidership}
                onChange={(e) =>
                  handleNumericChange(e.target.value, setSundayRidership)
                }
                error={!isNonNegative(sundayRidership)}
                helperText={
                  isNonNegative(sundayRidership)
                    ? ""
                    : "Must be a non-negative number."
                }
                fullWidth
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="On-Time Performance %"
                type="number"
                value={onTimePerformancePercent}
                onChange={(e) =>
                  handleNumericChange(
                    e.target.value,
                    setOnTimePerformancePercent,
                  )
                }
                error={!isPercent(onTimePerformancePercent)}
                helperText={
                  isPercent(onTimePerformancePercent)
                    ? ""
                    : "Must be between 0 and 100."
                }
                fullWidth
                inputProps={{ min: 0, max: 100 }}
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
              type="submit"
              variant="contained"
              disabled={!isFormValid || isSubmitting}
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
                      Report #{row.monthlyReportId}
                    </Typography>
                    <Typography variant="body2">
                      Completed: {row.completedTrips ?? "—"} | Scheduled:{" "}
                      {row.tripsScheduled ?? "—"} | Denied:{" "}
                      {row.tripsDenied ?? "—"} | Passengers:{" "}
                      {row.passengers ?? "—"}
                    </Typography>
                    <Typography variant="body2">
                      Miles: {row.revenueMiles ?? "—"} | Hours:{" "}
                      {row.revenueHours ?? "—"} | OTP:{" "}
                      {row.onTimePerformancePercent ?? "—"}%
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </Box>
    </main>
  );
}
