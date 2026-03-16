"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";
import Link from "next/link";
import type { JSX } from "react";
import React, { useEffect, useState } from "react";

export default function RidershipPage(): JSX.Element {
  const [reportingMonth, setReportingMonth] = useState<Dayjs | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [savedMetrics, setSavedMetrics] = useState<
    { id: number; reportingMonth: string; createdAt?: string }[]
  >([]);

  const isFormValid = reportingMonth !== null;

  async function loadMetrics(): Promise<void> {
    try {
      const res = await fetch("/api/ridership");
      if (!res.ok) return;
      const data = await res.json();
      setSavedMetrics(data);
    } catch (error) {
      console.error("[Ridership] failed to load metrics", error);
    }
  }

  useEffect(() => {
    void loadMetrics();
  }, []);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!isFormValid) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    const payload = {
      reportingMonth: reportingMonth?.toISOString() ?? null,
    };

    try {
      const res = await fetch("/api/ridership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();

      if (!res.ok) {
        setSubmitError(`Failed to save ridership metric: ${text}`);
        return;
      }

      setSubmitSuccess(true);
      void loadMetrics();
    } catch (error) {
      console.error("[Ridership] network or JS error", error);
      setSubmitError("Unexpected error while saving ridership metric.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ p: 4 }}>
          <Link href="/" className="text-blue-500 hover:underline">
            ← Back to Home
          </Link>

          <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
            Ridership and System Performance
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            Enter monthly ridership metrics for the selected reporting month.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={4}>
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

          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" gutterBottom>
              Saved Entries
            </Typography>

            {savedMetrics.length === 0 ? (
              <Typography variant="body2">No entries saved yet.</Typography>
            ) : (
              <Box component="ul" sx={{ pl: 3 }}>
                {savedMetrics.map((m) => (
                  <li key={m.id}>Reporting month: {m.reportingMonth}</li>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </LocalizationProvider>
    </main>
  );
}
