"use client";

import React, { useState } from "react";
import type { JSX } from "react";

import {
  Box,
  Button,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  LocalizationProvider,
  DatePicker,
} from "@mui/x-date-pickers";
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
  // allow empty or simple numeric input
  if (value === "" || /^\d*\.?\d*$/.test(value)) {
    setter(value);
  }
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

  const [totalWeekdayRidership, setTotalWeekdayRidership] = useState<string>("");
  const [totalSaturdayRidership, setTotalSaturdayRidership] = useState<string>("");
  const [totalSundayRidership, setTotalSundayRidership] = useState<string>("");

  const [avgCostPerTrip, setAvgCostPerTrip] = useState<string>("");

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
                    isPercent(otpPercent)
                      ? ""
                      : "Must be between 0 and 100."
                  }
                  fullWidth
                  inputProps={{ min: 0, max: 100 }}
                />
              </Grid>
            </Grid>

            {/* Average Ridership (Weekday / Sat / Sun) */}
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
                    handleNumericChange(
                      e.target.value,
                      setAvgSaturdayRidership,
                    )
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

            {/* Total Ridership (Weekday / Sat / Sun) */}
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

            {/* Disabled Save Button */}
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" disabled>
                Save
              </Button>
            </Box>
          </Stack>
        </Box>
      </LocalizationProvider>
    </main>
  );
}
