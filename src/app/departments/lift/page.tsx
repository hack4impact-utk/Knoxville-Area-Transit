"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

export default function Lift() {
  const [reportingMonth, setReportingMonth] = useState<Dayjs | null>(null);
  const [formData, setFormData] = useState({
    tripsDenied: "",
    noShows: "",
    tripsScheduled: "",
    totalPassengers: "",
    revenueVehicleMiles: "",
    revenueVehicleHours: "",
    passengerPerMile: "",
    passengerPerHour: "",
    onTimePerformance: "",
    avgWeekdayRidership: "",
    avgSaturdayRidership: "",
    avgSundayRidership: "",
    totalWeekdayRidership: "",
    totalSaturdayRidership: "",
    totalSundayRidership: "",
    avgCostPerTrip: "",
  });

  const handleChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom color="primary">
            Lift Monthly Metrics
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Enter the monthly performance metrics for the Lift service.
          </Typography>
        </Box>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Grid container spacing={3}>
            {/* Reporting Month */}
            <Grid item xs={12} md={6}>
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
            </Grid>

            {/* Trip Metrics */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Trip Metrics
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Trips Denied"
                type="number"
                value={formData.tripsDenied}
                onChange={handleChange("tripsDenied")}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="No-Shows"
                type="number"
                value={formData.noShows}
                onChange={handleChange("noShows")}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Trips Scheduled"
                type="number"
                value={formData.tripsScheduled}
                onChange={handleChange("tripsScheduled")}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Total Passengers"
                type="number"
                value={formData.totalPassengers}
                onChange={handleChange("totalPassengers")}
                inputProps={{ min: 0 }}
              />
            </Grid>

            {/* Service Metrics */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Service Metrics
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Revenue Vehicle Miles"
                type="number"
                value={formData.revenueVehicleMiles}
                onChange={handleChange("revenueVehicleMiles")}
                inputProps={{ min: 0, step: "0.01" }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Revenue Vehicle Hours"
                type="number"
                value={formData.revenueVehicleHours}
                onChange={handleChange("revenueVehicleHours")}
                inputProps={{ min: 0, step: "0.01" }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Passenger per Mile"
                type="number"
                value={formData.passengerPerMile}
                onChange={handleChange("passengerPerMile")}
                inputProps={{ min: 0, step: "0.01" }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Passenger per Hour"
                type="number"
                value={formData.passengerPerHour}
                onChange={handleChange("passengerPerHour")}
                inputProps={{ min: 0, step: "0.01" }}
              />
            </Grid>

            {/* Performance Metrics */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Performance Metrics
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="On-Time Performance %"
                type="number"
                value={formData.onTimePerformance}
                onChange={handleChange("onTimePerformance")}
                inputProps={{ min: 0, max: 100, step: "0.1" }}
                helperText="0-100"
              />
            </Grid>

            {/* Ridership Metrics */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Average Ridership
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Avg. Weekday Ridership"
                type="number"
                value={formData.avgWeekdayRidership}
                onChange={handleChange("avgWeekdayRidership")}
                inputProps={{ min: 0, step: "0.01" }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Avg. Saturday Ridership"
                type="number"
                value={formData.avgSaturdayRidership}
                onChange={handleChange("avgSaturdayRidership")}
                inputProps={{ min: 0, step: "0.01" }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Avg. Sunday Ridership"
                type="number"
                value={formData.avgSundayRidership}
                onChange={handleChange("avgSundayRidership")}
                inputProps={{ min: 0, step: "0.01" }}
              />
            </Grid>

            {/* Total Ridership */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Total Ridership
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Total Weekday Ridership"
                type="number"
                value={formData.totalWeekdayRidership}
                onChange={handleChange("totalWeekdayRidership")}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Total Saturday Ridership"
                type="number"
                value={formData.totalSaturdayRidership}
                onChange={handleChange("totalSaturdayRidership")}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Total Sunday Ridership"
                type="number"
                value={formData.totalSundayRidership}
                onChange={handleChange("totalSundayRidership")}
                inputProps={{ min: 0 }}
              />
            </Grid>

            {/* Cost Metrics */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Cost Metrics
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Average Cost per Trip"
                type="number"
                value={formData.avgCostPerTrip}
                onChange={handleChange("avgCostPerTrip")}
                inputProps={{ min: 0, step: "0.01" }}
              />
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                <Button variant="contained" size="large" disabled>
                  Save
                </Button>
                <Link href="/" style={{ textDecoration: "none" }}>
                  <Button variant="outlined" size="large">
                    Back to Home
                  </Button>
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
}