"use client";

import React, { useEffect, useState } from "react";
import type { JSX } from "react";

import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";

const SERVICE_TYPES = [
  { value: "special_shuttle", label: "Special Shuttles Route 70" },
  { value: "football", label: "Football" },
  { value: "baseball", label: "Baseball" },
  { value: "basketball", label: "Basketball" },
  { value: "soccer", label: "Soccer" },
] as const;

const LOCATIONS = [
  "Coliseum (A)",
  "Old City (D)",
  "Market Square (E)",
] as const;

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

type SpecialServicesRow = {
  id: number;
  monthlyReportId: number;
  serviceType: string;
  eventDate: string;
  passengerCount: number | null;
  revenueMiles: number | null;
  revenueHours: number | null;
  eventName: string | null;
  location: string | null;
};

export default function ChartersPage(): JSX.Element {
  const [monthlyReportId, setMonthlyReportId] = useState<string>("");
  const [serviceType, setServiceType] = useState<string>("");
  const [eventDate, setEventDate] = useState<Dayjs | null>(null);

  const [passengerCount, setPassengerCount] = useState<string>("");
  const [revenueMiles, setRevenueMiles] = useState<string>("");
  const [revenueHours, setRevenueHours] = useState<string>("");
  const [eventName, setEventName] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [savedRuns, setSavedRuns] = useState<SpecialServicesRow[]>([]);

  const isFormValid =
    monthlyReportId !== "" &&
    serviceType !== "" &&
    eventDate !== null &&
    isNonNegative(passengerCount) &&
    isNonNegative(revenueMiles) &&
    isNonNegative(revenueHours);

  async function loadRuns() {
    try {
      const res = await fetch("/api/charters");
      if (!res.ok) return;
      const data = (await res.json()) as SpecialServicesRow[];
      setSavedRuns(data);
    } catch (err) {
      console.error("[Charters] failed to load runs", err);
    }
  }

  useEffect(() => {
    void loadRuns();
  }, []);

  const resetForm = () => {
    setServiceType("");
    setEventDate(null);
    setPassengerCount("");
    setRevenueMiles("");
    setRevenueHours("");
    setEventName("");
    setLocation("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const res = await fetch("/api/charters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monthlyReportId: Number(monthlyReportId),
          serviceType,
          eventDate: eventDate?.format("YYYY-MM-DD") ?? null,
          passengerCount: passengerCount ? Number(passengerCount) : null,
          revenueMiles: revenueMiles ? Number(revenueMiles) : null,
          revenueHours: revenueHours ? Number(revenueHours) : null,
          eventName: eventName || null,
          location: location || null,
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setSubmitError(data.error ?? "An error occurred.");
      } else {
        setSubmitSuccess(true);
        resetForm();
        await loadRuns();
      }
    } catch (err) {
      console.error(err);
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const groupedRuns = SERVICE_TYPES.map(({ value, label }) => ({
    label,
    serviceType: value,
    rows: savedRuns.filter((r) => r.serviceType === value),
  }));

  return (
    <main>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Special Services – Run Entry
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            Enter special service runs (shuttles, football, baseball,
            basketball, soccer).
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {/* Monthly Report ID + Service Type + Event Date */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
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
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth required>
                    <InputLabel id="service-type-label">
                      Service Type
                    </InputLabel>
                    <Select
                      labelId="service-type-label"
                      label="Service Type"
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                    >
                      {SERVICE_TYPES.map((st) => (
                        <MenuItem key={st.value} value={st.value}>
                          {st.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <DatePicker
                    label="Event Date"
                    value={eventDate}
                    onChange={(newValue) => setEventDate(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel id="location-label">Location</InputLabel>
                    <Select
                      labelId="location-label"
                      label="Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    >
                      <MenuItem value="">None</MenuItem>
                      {LOCATIONS.map((loc) => (
                        <MenuItem key={loc} value={loc}>
                          {loc}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Numeric Fields */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Passenger Count"
                    type="number"
                    value={passengerCount}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setPassengerCount)
                    }
                    error={!isNonNegative(passengerCount)}
                    helperText={
                      isNonNegative(passengerCount)
                        ? ""
                        : "Must be a non-negative number."
                    }
                    inputProps={{ min: 0 }}
                    fullWidth
                  />
                </Grid>
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
                    inputProps={{ min: 0 }}
                    fullWidth
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
                    inputProps={{ min: 0 }}
                    fullWidth
                  />
                </Grid>
              </Grid>

              {/* Event Name */}
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Event Name"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    fullWidth
                  />
                </Grid>
              </Grid>

              {/* Feedback */}
              {submitSuccess && (
                <Alert severity="success">Run saved successfully!</Alert>
              )}
              {submitError && <Alert severity="error">{submitError}</Alert>}

              {/* Save Button */}
              <Box>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </Box>
            </Stack>
          </Box>

          {/* Saved Runs grouped by service type */}
          <Box sx={{ mt: 6 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Saved Runs
            </Typography>

            {groupedRuns.map((group) => (
              <Box key={group.serviceType} sx={{ mb: 3 }}>
                <Typography variant="h6">{group.label}</Typography>
                {group.rows.length === 0 ? (
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    No runs saved yet.
                  </Typography>
                ) : (
                  <Box component="ul" sx={{ pl: 3 }}>
                    {group.rows.map((row) => (
                      <li key={row.id}>
                        {row.eventDate}
                        {row.eventName ? ` — ${row.eventName}` : ""} |{" "}
                        Passengers: {row.passengerCount ?? 0} | Miles:{" "}
                        {row.revenueMiles ?? 0} | Hours:{" "}
                        {row.revenueHours ?? 0}
                        {row.location ? ` | Location: ${row.location}` : ""}
                      </li>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </LocalizationProvider>
    </main>
  );
}
