"use client";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";
import type { JSX } from "react";
import React, { useEffect, useState } from "react";

const isNonNegative = (value: string): boolean => {
  if (value === "") return true;
  const num = Number.parseFloat(value);
  return !Number.isNaN(num) && num >= 0;
};

const handleNumericChange = (
  value: string,
  setter: (value: string) => void,
): void => {
  if (value === "" || /^\d*\.?\d*$/.test(value)) {
    setter(value);
  }
};

type SavedCharterEvent = {
  id: number;
  eventType: string;
  passengerCount: number | null;
  vehicleHours: number | null;
  vehicleMiles: number | null;
};

export default function ChartersPage(): JSX.Element {
  const [reportingMonth, setReportingMonth] = useState<Dayjs | null>(null);
  const [eventType, setEventType] = useState<string>("");
  const [eventDate, setEventDate] = useState<Dayjs | null>(null);

  const [passengerCount, setPassengerCount] = useState<string>("");
  const [vehicleHours, setVehicleHours] = useState<string>("");
  const [vehicleMiles, setVehicleMiles] = useState<string>("");
  const [driverAssignments, setDriverAssignments] = useState<string>("");
  const [revenueTotal, setRevenueTotal] = useState<string>("");
  const [serviceTotal, setServiceTotal] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [savedEvents, setSavedEvents] = useState<SavedCharterEvent[]>([]);

  const isEventDateRequired = eventType !== "";
  const isEventDateValid = isEventDateRequired ? eventDate !== null : true;

  const isPassengerCountValid = isNonNegative(passengerCount);
  const isVehicleHoursValid = isNonNegative(vehicleHours);
  const isVehicleMilesValid = isNonNegative(vehicleMiles);
  const isRevenueTotalValid = isNonNegative(revenueTotal);
  const isServiceTotalValid = isNonNegative(serviceTotal);

  const isFormValid =
    reportingMonth !== null &&
    eventType !== "" &&
    isEventDateValid &&
    isPassengerCountValid &&
    isVehicleHoursValid &&
    isVehicleMilesValid &&
    isRevenueTotalValid &&
    isServiceTotalValid;

  async function loadEvents(): Promise<void> {
    try {
      const res = await fetch("/api/charters");
      if (!res.ok) return;
      const data = await res.json();
      setSavedEvents(data);
    } catch (error) {
      console.error("[Charters] failed to load events", error);
    }
  }

  useEffect(() => {
    void loadEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!isFormValid) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    const payload = {
      reportingMonth: reportingMonth?.toISOString() ?? null,
      eventType,
      eventDate: eventDate?.toISOString() ?? null,
      passengerCount: passengerCount ? Number(passengerCount) : null,
      vehicleHours: vehicleHours ? Number(vehicleHours) : null,
      vehicleMiles: vehicleMiles ? Number(vehicleMiles) : null,
      driverAssignments,
      revenueTotal: revenueTotal ? Number(revenueTotal) : null,
      serviceTotal: serviceTotal ? Number(serviceTotal) : null,
    };

    try {
      const res = await fetch("/api/charters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();

      if (!res.ok) {
        setSubmitError(`Failed to save charter event: ${text}`);
        alert("Failed to save charter event.");
        return;
      }

      setSubmitSuccess(true);
      alert("Charter event saved!");

      // Refresh list of saved events for the demo
      void loadEvents();
    } catch (error) {
      console.error("[Charters] network or JS error", error);
      setSubmitError("Unexpected error while saving charter event.");
      alert("Unexpected error while saving charter event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Charters – Event Entry Form
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            Enter charter event metrics for the selected reporting month.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {/* Top row: Reporting Month, Event Type, Event Date */}
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <DatePicker
                    label="Reporting Month"
                    views={["year", "month"]}
                    value={reportingMonth}
                    onChange={(newValue) =>
                      setReportingMonth(newValue as Dayjs | null)
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel id="event-type-label">Event Type</InputLabel>
                    <Select
                      labelId="event-type-label"
                      label="Event Type"
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                    >
                      <MenuItem value="UT Football">UT Football</MenuItem>
                      <MenuItem value="Basketball">Basketball</MenuItem>
                      <MenuItem value="Baseball">Baseball</MenuItem>
                      <MenuItem value="Soccer">Soccer</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <DatePicker
                    label="Event Date"
                    value={eventDate}
                    onChange={(newValue) =>
                      setEventDate(newValue as Dayjs | null)
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: isEventDateRequired && !eventDate,
                        helperText:
                          isEventDateRequired && !eventDate
                            ? "Event Date is required when Event Type is selected."
                            : "",
                      },
                    }}
                  />
                </Grid>
              </Grid>

              {/* Numeric Fields: Passenger Count, Vehicle Hours, Vehicle Miles */}
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    label="Passenger Count"
                    type="number"
                    value={passengerCount}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setPassengerCount)
                    }
                    error={!isPassengerCountValid}
                    helperText={
                      isPassengerCountValid
                        ? ""
                        : "Must be a non-negative number."
                    }
                    inputProps={{ min: 0 }}
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    label="Vehicle Hours"
                    type="number"
                    value={vehicleHours}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setVehicleHours)
                    }
                    error={!isVehicleHoursValid}
                    helperText={
                      isVehicleHoursValid
                        ? ""
                        : "Must be a non-negative number."
                    }
                    inputProps={{ min: 0 }}
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    label="Vehicle Miles"
                    type="number"
                    value={vehicleMiles}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setVehicleMiles)
                    }
                    error={!isVehicleMilesValid}
                    helperText={
                      isVehicleMilesValid
                        ? ""
                        : "Must be a non-negative number."
                    }
                    inputProps={{ min: 0 }}
                    fullWidth
                  />
                </Grid>
              </Grid>

              {/* Driver Assignments */}
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Driver Assignments"
                    value={driverAssignments}
                    onChange={(e) => setDriverAssignments(e.target.value)}
                    multiline
                    minRows={3}
                    fullWidth
                  />
                </Grid>
              </Grid>

              {/* Revenue & Service Totals */}
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Revenue Total"
                    type="number"
                    value={revenueTotal}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setRevenueTotal)
                    }
                    error={!isRevenueTotalValid}
                    helperText={
                      isRevenueTotalValid
                        ? ""
                        : "Must be a non-negative number."
                    }
                    inputProps={{ min: 0 }}
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Service Total"
                    type="number"
                    value={serviceTotal}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setServiceTotal)
                    }
                    error={!isServiceTotalValid}
                    helperText={
                      isServiceTotalValid
                        ? ""
                        : "Must be a non-negative number."
                    }
                    inputProps={{ min: 0 }}
                    fullWidth
                  />
                </Grid>
              </Grid>

              {/* Save Button + Status */}
              <Box>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>

                {submitError && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {submitError}
                  </Typography>
                )}

                {submitSuccess && (
                  <Typography
                    color="success.main"
                    variant="body2"
                    sx={{ mt: 1 }}
                  >
                    Saved successfully.
                  </Typography>
                )}
              </Box>
            </Stack>
          </Box>

          {/* Saved Events (very simple demo view) */}
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" gutterBottom>
              Saved Events
            </Typography>

            {savedEvents.length === 0 ? (
              <Typography variant="body2">No events saved yet.</Typography>
            ) : (
              <Box component="ul" sx={{ pl: 3 }}>
                {savedEvents.map((evt) => (
                  <li key={evt.id}>
                    {evt.eventType} — {evt.passengerCount ?? 0} passengers,{" "}
                    {evt.vehicleHours ?? 0} hours, {evt.vehicleMiles ?? 0} miles
                  </li>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </LocalizationProvider>
    </main>
  );
}
