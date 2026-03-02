"use client";

import React, { useEffect, useState } from "react";
import type { JSX } from "react";

import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

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

export default function MaintenancePage(): JSX.Element {
  const [reportingMonth, setReportingMonth] = useState<Date | null>(null);

  const [motorBusMajor, setMotorBusMajor] = useState<string>("");
  const [motorBusOther, setMotorBusOther] = useState<string>("");
  const [liftMajor, setLiftMajor] = useState<string>("");
  const [liftOther, setLiftOther] = useState<string>("");
  const [interruptions, setInterruptions] = useState<string>("");
  const [diesel, setDiesel] = useState<string>("");
  const [cng, setCng] = useState<string>("");
  const [electric, setElectric] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [savedMetrics, setSavedMetrics] = useState<any[]>([]);

  const isMotorBusMajorValid = isNonNegative(motorBusMajor);
  const isMotorBusOtherValid = isNonNegative(motorBusOther);
  const isLiftMajorValid = isNonNegative(liftMajor);
  const isLiftOtherValid = isNonNegative(liftOther);
  const isInterruptionsValid = isNonNegative(interruptions);
  const isDieselValid = isNonNegative(diesel);
  const isCngValid = isNonNegative(cng);
  const isElectricValid = isNonNegative(electric);

  const isFormValid =
    reportingMonth !== null &&
    isMotorBusMajorValid &&
    isMotorBusOtherValid &&
    isLiftMajorValid &&
    isLiftOtherValid &&
    isInterruptionsValid &&
    isDieselValid &&
    isCngValid &&
    isElectricValid;

  async function loadMetrics() {
    try {
      const res = await fetch("/api/maintenance");
      if (!res.ok) return;
      const data = await res.json();
      setSavedMetrics(data);
    } catch (err) {
      console.error("[Maintenance] failed to load metrics", err);
    }
  }

  useEffect(() => {
    void loadMetrics();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("[Maintenance] submit clicked");

    if (!isFormValid) {
      console.log("[Maintenance] form invalid");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    const payload = {
      reportingMonth: reportingMonth ? reportingMonth.toISOString().split('T')[0] : null,
      motorBusMajor: motorBusMajor ? Number(motorBusMajor) : null,
      motorBusOther: motorBusOther ? Number(motorBusOther) : null,
      liftMajor: liftMajor ? Number(liftMajor) : null,
      liftOther: liftOther ? Number(liftOther) : null,
      interruptions: interruptions ? Number(interruptions) : null,
      diesel: diesel ? Number(diesel) : null,
      cng: cng ? Number(cng) : null,
      electric: electric ? Number(electric) : null,
    };

    console.log("[Maintenance] payload", payload);

    try {
      const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("[Maintenance] response status", res.status);

      const text = await res.text();
      console.log("[Maintenance] response body", text);

      if (!res.ok) {
        setSubmitError(`Failed to save maintenance metrics: ${text}`);
        alert("Failed to save maintenance metrics.");
        return;
      }

      setSubmitSuccess(true);
      alert("Maintenance metrics saved!");

      // Clear form
      setReportingMonth(null);
      setMotorBusMajor("");
      setMotorBusOther("");
      setLiftMajor("");
      setLiftOther("");
      setInterruptions("");
      setDiesel("");
      setCng("");
      setElectric("");

      // Refresh list of saved metrics
      void loadMetrics();
    } catch (err) {
      console.error("[Maintenance] network or JS error", err);
      setSubmitError("Unexpected error while saving maintenance metrics.");
      alert("Unexpected error while saving maintenance metrics.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Maintenance – Fleet Performance Entry Form
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            Enter maintenance and fleet performance metrics for the selected reporting month.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={4}>
            {/* Reporting Month */}
              <Box sx={{ maxWidth: 400 }}>
                <DatePicker
                  label="Reporting Month"
                  views={["year", "month"]}
                  value={reportingMonth}
                  onChange={(newValue) => setReportingMonth(newValue ? new Date(newValue as any) : null)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              </Box>

              {/* Road Calls Section */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Road Calls
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
                  <TextField
                    label="Motor Bus — Major"
                    type="number"
                    value={motorBusMajor}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setMotorBusMajor)
                    }
                    error={!isMotorBusMajorValid}
                    helperText={
                      isMotorBusMajorValid
                        ? ""
                        : "Must be a non-negative number."
                    }
                    inputProps={{ min: 0 }}
                    fullWidth
                  />

                  <TextField
                    label="Motor Bus — Other"
                    type="number"
                    value={motorBusOther}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setMotorBusOther)
                    }
                    error={!isMotorBusOtherValid}
                    helperText={
                      isMotorBusOtherValid
                        ? ""
                        : "Must be a non-negative number."
                    }
                    inputProps={{ min: 0 }}
                    fullWidth
                  />

                  <TextField
                    label="Lift — Major"
                    type="number"
                    value={liftMajor}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setLiftMajor)
                    }
                    error={!isLiftMajorValid}
                    helperText={
                      isLiftMajorValid
                        ? ""
                        : "Must be a non-negative number."
                    }
                    inputProps={{ min: 0 }}
                    fullWidth
                  />

                  <TextField
                    label="Lift — Other"
                    type="number"
                    value={liftOther}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setLiftOther)
                    }
                    error={!isLiftOtherValid}
                    helperText={
                      isLiftOtherValid
                        ? ""
                        : "Must be a non-negative number."
                    }
                    inputProps={{ min: 0 }}
                    fullWidth
                  />
                </Box>
              </Box>

              {/* Service Interruptions */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Service Interruptions
                </Typography>
                <Box sx={{ maxWidth: 400 }}>
                  <TextField
                    label="Service Interruptions"
                    type="number"
                    value={interruptions}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setInterruptions)
                    }
                    error={!isInterruptionsValid}
                    helperText={
                      isInterruptionsValid
                        ? ""
                        : "Must be a non-negative number."
                    }
                    inputProps={{ min: 0 }}
                    fullWidth
                  />
                </Box>
              </Box>

              {/* Fuel / Energy Consumption */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Fuel / Energy Consumption
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
                  <TextField
                    label="Diesel (gal)"
                    type="number"
                    value={diesel}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setDiesel)
                    }
                    error={!isDieselValid}
                    helperText={
                      isDieselValid ? "" : "Must be a non-negative number."
                    }
                    inputProps={{ min: 0 }}
                    fullWidth
                  />

                  <TextField
                    label="CNG (GGE)"
                    type="number"
                    value={cng}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setCng)
                    }
                    error={!isCngValid}
                    helperText={
                      isCngValid ? "" : "Must be a non-negative number."
                    }
                    inputProps={{ min: 0 }}
                    fullWidth
                  />

                  <TextField
                    label="Electric (kWh)"
                    type="number"
                    value={electric}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setElectric)
                    }
                    error={!isElectricValid}
                    helperText={
                      isElectricValid ? "" : "Must be a non-negative number."
                    }
                    inputProps={{ min: 0 }}
                    fullWidth
                  />
                </Box>
              </Box>

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
                  <Typography color="success.main" variant="body2" sx={{ mt: 1 }}>
                    Saved successfully.
                  </Typography>
                )}
              </Box>
            </Stack>
          </Box>

          {/* Saved Entries */}
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" gutterBottom>
              Saved Entries
            </Typography>

            {savedMetrics.length === 0 ? (
              <Typography variant="body2">
                No metrics saved yet.
              </Typography>
            ) : (
              <Box component="ul" sx={{ pl: 3 }}>
                {savedMetrics.map((metric: any) => (
                  <li key={metric.id}>
                    {new Date(metric.reportingMonth).toLocaleDateString(
                      undefined,
                      { year: "numeric", month: "long" }
                    )}{" "}
                    – Motor Bus (Major: {metric.motorBusMajor ?? 0}, Other:{" "}
                    {metric.motorBusOther ?? 0}), Lift (Major:{" "}
                    {metric.liftMajor ?? 0}, Other: {metric.liftOther ?? 0}),
                    Interruptions: {metric.interruptions ?? 0}
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
