"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

export default function ChartersPage() {
  const [reportingMonth, setReportingMonth] = useState<Dayjs | null>(null);
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState<Dayjs | null>(null);
  const [passengerCount, setPassengerCount] = useState("");
  const [vehicleHours, setVehicleHours] = useState("");
  const [vehicleMiles, setVehicleMiles] = useState("");
  const [driverAssignments, setDriverAssignments] = useState("");
  const [revenueTotal, setRevenueTotal] = useState("");
  const [serviceTotal, setServiceTotal] = useState("");

  const isNonNegative = (val: string) =>
    val === "" || (!isNaN(Number(val)) && Number(val) >= 0);

  const isEventDateRequired = eventType !== "" && !eventDate;

  const isFormValid =
    !isEventDateRequired &&
    isNonNegative(passengerCount) &&
    isNonNegative(vehicleHours) &&
    isNonNegative(vehicleMiles) &&
    isNonNegative(revenueTotal) &&
    isNonNegative(serviceTotal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const formData = {
      reportingMonth: reportingMonth ? reportingMonth.format("YYYY-MM") : null,
      eventType,
      eventDate: eventDate ? eventDate.format("YYYY-MM-DD") : null,
      passengerCount: Number(passengerCount),
      vehicleHours: Number(vehicleHours),
      vehicleMiles: Number(vehicleMiles),
      driverAssignments,
      revenueTotal: Number(revenueTotal),
      serviceTotal: Number(serviceTotal),
    };

    console.log("Submitted:", formData);
    alert("Form data logged to console.");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Charters Event Entry Form
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
              <Box sx={{ flex: 1 }}>
                <DatePicker
                  views={["year", "month"]}
                  label="Reporting Month"
                  value={reportingMonth}
                  onChange={(newValue) => setReportingMonth(newValue)}
                  slotProps={{
                    textField: { fullWidth: true },
                  }}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <FormControl fullWidth>
                  <InputLabel id="event-type-label">Event Type</InputLabel>
                  <Select
                    labelId="event-type-label"
                    value={eventType}
                    label="Event Type"
                    onChange={(e) => setEventType(e.target.value)}
                  >
                    <MenuItem value="UT Football">UT Football</MenuItem>
                    <MenuItem value="Basketball">Basketball</MenuItem>
                    <MenuItem value="Concert">Concert</MenuItem>
                    <MenuItem value="Conference">Conference</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ flex: 1 }}>
                <DatePicker
                  label="Event Date"
                  value={eventDate}
                  onChange={(newValue) => setEventDate(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: isEventDateRequired,
                      helperText: isEventDateRequired
                        ? "Event Date is required if Event Type is filled."
                        : "",
                    },
                  }}
                />
              </Box>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  label="Passenger Count"
                  type="number"
                  value={passengerCount}
                  onChange={(e) => setPassengerCount(e.target.value)}
                  error={!isNonNegative(passengerCount)}
                  helperText={
                    !isNonNegative(passengerCount)
                      ? "Must be a non-negative number."
                      : ""
                  }
                  fullWidth
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <TextField
                  label="Vehicle Hours"
                  type="number"
                  value={vehicleHours}
                  onChange={(e) => setVehicleHours(e.target.value)}
                  error={!isNonNegative(vehicleHours)}
                  helperText={
                    !isNonNegative(vehicleHours)
                      ? "Must be a non-negative number."
                      : ""
                  }
                  fullWidth
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <TextField
                  label="Vehicle Miles"
                  type="number"
                  value={vehicleMiles}
                  onChange={(e) => setVehicleMiles(e.target.value)}
                  error={!isNonNegative(vehicleMiles)}
                  helperText={
                    !isNonNegative(vehicleMiles)
                      ? "Must be a non-negative number."
                      : ""
                  }
                  fullWidth
                />
              </Box>
            </Stack>

            <TextField
              label="Driver Assignments"
              multiline
              minRows={3}
              value={driverAssignments}
              onChange={(e) => setDriverAssignments(e.target.value)}
              fullWidth
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  label="Revenue Total"
                  type="number"
                  value={revenueTotal}
                  onChange={(e) => setRevenueTotal(e.target.value)}
                  error={!isNonNegative(revenueTotal)}
                  helperText={
                    !isNonNegative(revenueTotal)
                      ? "Must be a non-negative number."
                      : ""
                  }
                  fullWidth
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <TextField
                  label="Service Total"
                  type="number"
                  value={serviceTotal}
                  onChange={(e) => setServiceTotal(e.target.value)}
                  error={!isNonNegative(serviceTotal)}
                  helperText={
                    !isNonNegative(serviceTotal)
                      ? "Must be a non-negative number."
                      : ""
                  }
                  fullWidth
                />
              </Box>
            </Stack>

            <Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!isFormValid}
              >
                Save
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
