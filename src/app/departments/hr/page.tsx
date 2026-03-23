"use client";

import React, { useEffect, useState } from "react";
import type { JSX } from "react";

import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";

type HrMetricRow = {
  id: number;
  reportingMonth: string;
  otpWeekday: string | number | null;
  otpSaturday: string | number | null;
  otpSunday: string | number | null;
  otpSystem: string | number | null;
  peakVehicles: number | null;
  driverHours: string | number | null;
  overtimeHours: string | number | null;
  absenteeism: string | number | null;
  trainingCertifications: string | null;
};

const isNonNegative = (value: string): boolean => {
  if (value === "") return true;
  const number = Number.parseFloat(value);
  return !Number.isNaN(number) && number >= 0;
};

const isOtpPercent = (value: string): boolean => {
  if (value === "") return true;
  const number = Number.parseFloat(value);
  return !Number.isNaN(number) && number >= 0 && number <= 100;
};

const handleNumericChange = (
  value: string,
  setter: (value: string) => void,
): void => {
  if (value === "" || /^\d*\.?\d*$/.test(value)) {
    setter(value);
  }
};

export default function HRPage(): JSX.Element {
  const [reportingMonth, setReportingMonth] = useState<Dayjs | null>(null);

  const [otpWeekday, setOtpWeekday] = useState("");
  const [otpSaturday, setOtpSaturday] = useState("");
  const [otpSunday, setOtpSunday] = useState("");
  const [otpSystem, setOtpSystem] = useState("");

  const [peakVehicles, setPeakVehicles] = useState("");
  const [driverHours, setDriverHours] = useState("");
  const [overtimeHours, setOvertimeHours] = useState("");
  const [absenteeism, setAbsenteeism] = useState("");

  const [trainingCertifications, setTrainingCertifications] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [savedMetrics, setSavedMetrics] = useState<HrMetricRow[]>([]);

  const isOtpWeekdayValid = isOtpPercent(otpWeekday);
  const isOtpSaturdayValid = isOtpPercent(otpSaturday);
  const isOtpSundayValid = isOtpPercent(otpSunday);
  const isOtpSystemValid = isOtpPercent(otpSystem);

  const isPeakVehiclesValid = isNonNegative(peakVehicles);
  const isDriverHoursValid = isNonNegative(driverHours);
  const isOvertimeHoursValid = isNonNegative(overtimeHours);
  const isAbsenteeismValid = isNonNegative(absenteeism);

  const isFormValid =
    reportingMonth !== null &&
    isOtpWeekdayValid &&
    isOtpSaturdayValid &&
    isOtpSundayValid &&
    isOtpSystemValid &&
    isPeakVehiclesValid &&
    isDriverHoursValid &&
    isOvertimeHoursValid &&
    isAbsenteeismValid;

  async function loadMetrics() {
    try {
      const response = await fetch("/api/hr");
      if (!response.ok) return;
      const rows = (await response.json()) as HrMetricRow[];
      setSavedMetrics(rows);
    } catch (error) {
      console.error("[HR] failed to load metrics", error);
    }
  }

  useEffect(() => {
    void loadMetrics();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isFormValid) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    const payload = {
      reportingMonth: reportingMonth?.toISOString() ?? null,
      otpWeekday: otpWeekday ? Number(otpWeekday) : null,
      otpSaturday: otpSaturday ? Number(otpSaturday) : null,
      otpSunday: otpSunday ? Number(otpSunday) : null,
      otpSystem: otpSystem ? Number(otpSystem) : null,
      peakVehicles: peakVehicles ? Number(peakVehicles) : null,
      driverHours: driverHours ? Number(driverHours) : null,
      overtimeHours: overtimeHours ? Number(overtimeHours) : null,
      absenteeism: absenteeism ? Number(absenteeism) : null,
      trainingCertifications,
    };

    try {
      const response = await fetch("/api/hr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        setSubmitError(`Failed to save HR metrics: ${text}`);
        return;
      }

      setSubmitSuccess(true);
      void loadMetrics();
    } catch (error) {
      console.error("[HR] failed to save metrics", error);
      setSubmitError("Unexpected error while saving HR metrics.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            HR / Operations Metrics
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            Enter monthly HR and operations metrics.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <DatePicker
                    label="Reporting Month"
                    views={["year", "month"]}
                    value={reportingMonth}
                    onChange={(value) => setReportingMonth(value as Dayjs | null)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="OTP Weekday"
                    type="number"
                    value={otpWeekday}
                    onChange={(e) => handleNumericChange(e.target.value, setOtpWeekday)}
                    error={!isOtpWeekdayValid}
                    helperText={isOtpWeekdayValid ? "" : "Must be between 0 and 100."}
                    inputProps={{ min: 0, max: 100 }}
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="OTP Saturday"
                    type="number"
                    value={otpSaturday}
                    onChange={(e) => handleNumericChange(e.target.value, setOtpSaturday)}
                    error={!isOtpSaturdayValid}
                    helperText={isOtpSaturdayValid ? "" : "Must be between 0 and 100."}
                    inputProps={{ min: 0, max: 100 }}
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="OTP Sunday"
                    type="number"
                    value={otpSunday}
                    onChange={(e) => handleNumericChange(e.target.value, setOtpSunday)}
                    error={!isOtpSundayValid}
                    helperText={isOtpSundayValid ? "" : "Must be between 0 and 100."}
                    inputProps={{ min: 0, max: 100 }}
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="OTP System"
                    type="number"
                    value={otpSystem}
                    onChange={(e) => handleNumericChange(e.target.value, setOtpSystem)}
                    error={!isOtpSystemValid}
                    helperText={isOtpSystemValid ? "" : "Must be between 0 and 100."}
                    inputProps={{ min: 0, max: 100 }}
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="Peak Vehicles"
                    type="number"
                    value={peakVehicles}
                    onChange={(e) => handleNumericChange(e.target.value, setPeakVehicles)}
                    error={!isPeakVehiclesValid}
                    helperText={isPeakVehiclesValid ? "" : "Must be a non-negative number."}
                    inputProps={{ min: 0 }}
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="Driver Hours"
                    type="number"
                    value={driverHours}
                    onChange={(e) => handleNumericChange(e.target.value, setDriverHours)}
                    error={!isDriverHoursValid}
                    helperText={isDriverHoursValid ? "" : "Must be a non-negative number."}
                    inputProps={{ min: 0 }}
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="Overtime Hours"
                    type="number"
                    value={overtimeHours}
                    onChange={(e) => handleNumericChange(e.target.value, setOvertimeHours)}
                    error={!isOvertimeHoursValid}
                    helperText={isOvertimeHoursValid ? "" : "Must be a non-negative number."}
                    inputProps={{ min: 0 }}
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="Absenteeism"
                    type="number"
                    value={absenteeism}
                    onChange={(e) => handleNumericChange(e.target.value, setAbsenteeism)}
                    error={!isAbsenteeismValid}
                    helperText={isAbsenteeismValid ? "" : "Must be a non-negative number."}
                    inputProps={{ min: 0 }}
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Training / Certifications"
                    value={trainingCertifications}
                    onChange={(e) => setTrainingCertifications(e.target.value)}
                    multiline
                    minRows={3}
                    fullWidth
                  />
                </Grid>
              </Grid>

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
                  <Typography color="success.main" variant="body2" sx={{ mt: 1 }}>
                    Saved successfully.
                  </Typography>
                )}
              </Box>
            </Stack>
          </Box>

          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" gutterBottom>
              Saved Entries
            </Typography>

            {savedMetrics.length === 0 ? (
              <Typography variant="body2">No entries saved yet.</Typography>
            ) : (
              <Box component="ul" sx={{ pl: 3 }}>
                {savedMetrics.map((metric) => (
                  <li key={metric.id}>
                    {metric.reportingMonth} — OTP System: {metric.otpSystem ?? "N/A"}, Peak
                    Vehicles: {metric.peakVehicles ?? "N/A"}
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
