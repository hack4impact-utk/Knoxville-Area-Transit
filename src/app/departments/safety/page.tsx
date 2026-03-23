"use client";

import React, { useState, useEffect } from "react";
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

const handleNumericChange = (
  value: string,
  setter: (value: string) => void,
): void => {
  if (value === "" || /^\d*\.?\d*$/.test(value)) {
    setter(value);
  }
};

export default function Safety(): JSX.Element {
  const [reportingMonth, setReportingMonth] = useState<Dayjs | null>(null);

  const [preventableMain, setPreventableMain] = useState<string>("");
  const [preventableLift, setPreventableLift] = useState<string>("");
  const [collisionsMain, setCollisionsMain] = useState<string>("");
  const [collisionsLift, setCollisionsLift] = useState<string>("");

  const [notes, setNotes] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [savedReports, setSavedReports] = useState<any[]>([]);

  const isPreventableMainValid = isNonNegative(preventableMain);
  const isPreventableLiftValid = isNonNegative(preventableLift);
  const isCollisionsMainValid = isNonNegative(collisionsMain);
  const isCollisionsLiftValid = isNonNegative(collisionsLift);

  const isFormValid =
    reportingMonth !== null &&
    isPreventableMainValid &&
    isPreventableLiftValid &&
    isCollisionsMainValid &&
    isCollisionsLiftValid;

  async function loadReports() {
    try {
      const res = await fetch("/api/safety");
      if (!res.ok) return;
      const data = await res.json();
      setSavedReports(data);
    } catch (err) {
      console.error("[Safety] failed to load reports", err);
    }
  }

  useEffect(() => {
    void loadReports();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    const payload = {
      reportingMonth: reportingMonth?.toISOString() ?? null,
      preventableMain: preventableMain ? Number(preventableMain) : null,
      preventableLift: preventableLift ? Number(preventableLift) : null,
      collisionsMain: collisionsMain ? Number(collisionsMain) : null,
      collisionsLift: collisionsLift ? Number(collisionsLift) : null,
      notes,
    };

    try {
      const res = await fetch("/api/safety", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        setSubmitError(`Failed to save safety report: ${text}`);
        alert("Failed to save safety report.");
        return;
      }

      setSubmitSuccess(true);
      alert("Safety report saved!");

      void loadReports();
    } catch (err) {
      console.error("[Safety] network or JS error", err);
      setSubmitError("Unexpected error while saving safety report.");
      alert("Unexpected error while saving safety report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ p: 4 }}
        >
          <Typography variant="h4" gutterBottom>
            Safety – Monthly Report
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            Enter monthly Safety metrics for preventable accidents and collisions.
          </Typography>

          <Stack spacing={4}>
            {/* Reporting Month */}
            <Box maxWidth={320}>
              <DatePicker
                label="Reporting Month"
                views={["year", "month"]}
                value={reportingMonth}
                onChange={(newValue) => setReportingMonth(newValue as Dayjs | null)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                  },
                }}
              />
            </Box>

            {/* Preventable Accidents */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
              <TextField
                label="Preventable Accidents — Main Line"
                type="number"
                value={preventableMain}
                onChange={(e) =>
                  handleNumericChange(e.target.value, setPreventableMain)
                }
                error={!isNonNegative(preventableMain)}
                helperText={
                  isNonNegative(preventableMain)
                    ? ""
                    : "Must be a non-negative number."
                }
                fullWidth
                inputProps={{ min: 0 }}
              />

              <TextField
                label="Preventable Accidents — Lift"
                type="number"
                value={preventableLift}
                onChange={(e) =>
                  handleNumericChange(e.target.value, setPreventableLift)
                }
                error={!isNonNegative(preventableLift)}
                helperText={
                  isNonNegative(preventableLift)
                    ? ""
                    : "Must be a non-negative number."
                }
                fullWidth
                inputProps={{ min: 0 }}
              />
            </Box>

            {/* Collisions */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
              <TextField
                label="Collisions — Main Line"
                type="number"
                value={collisionsMain}
                onChange={(e) =>
                  handleNumericChange(e.target.value, setCollisionsMain)
                }
                error={!isNonNegative(collisionsMain)}
                helperText={
                  isNonNegative(collisionsMain)
                    ? ""
                    : "Must be a non-negative number."
                }
                fullWidth
                inputProps={{ min: 0 }}
              />

              <TextField
                label="Collisions — Lift"
                type="number"
                value={collisionsLift}
                onChange={(e) =>
                  handleNumericChange(e.target.value, setCollisionsLift)
                }
                error={!isNonNegative(collisionsLift)}
                helperText={
                  isNonNegative(collisionsLift)
                    ? ""
                    : "Must be a non-negative number."
                }
                fullWidth
                inputProps={{ min: 0 }}
              />
            </Box>

            {/* Notes */}
            <Box>
              <TextField
                label="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                multiline
                minRows={3}
                fullWidth
              />
            </Box>

            {/* Save Button + Status */}
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                disabled={!isFormValid || isSubmitting}
                onClick={handleSubmit}
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

        {/* Saved Reports section */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            Saved Reports
          </Typography>

          {savedReports.length === 0 ? (
            <Typography variant="body2">No reports saved yet.</Typography>
          ) : (
            <Box component="ul" sx={{ pl: 3 }}>
              {savedReports.map((rep: any) => (
                <li key={rep.id}>
                  {new Date(rep.reportingMonth).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                  })}{" "}
                  — preventable: {rep.preventableMain ?? 0}/{rep.preventableLift ?? 0},
                  collisions: {rep.collisionsMain ?? 0}/{rep.collisionsLift ?? 0}
                </li>
              ))}
            </Box>
          )}
        </Box>
      </LocalizationProvider>
    </main>
  );
}
