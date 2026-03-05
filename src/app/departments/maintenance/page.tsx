"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Paper,
  Button,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function Maintenance() {
  const [reportingMonth, setReportingMonth] = useState<dayjs.Dayjs | null>(
    dayjs()
  );
  const [values, setValues] = useState({
    motorBusMajor: "",
    motorBusOther: "",
    liftMajor: "",
    liftOther: "",
    interruptions: "",
    diesel: "",
    cng: "",
    electric: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (field: string, value: string) => {
    if (/^\d*$/.test(value)) {
      setValues((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!reportingMonth) {
      setSubmitError("Reporting Month is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportingMonth: reportingMonth.toISOString(),
          motorBusMajor: values.motorBusMajor
            ? parseInt(values.motorBusMajor, 10)
            : null,
          motorBusOther: values.motorBusOther
            ? parseInt(values.motorBusOther, 10)
            : null,
          liftMajor: values.liftMajor
            ? parseInt(values.liftMajor, 10)
            : null,
          liftOther: values.liftOther
            ? parseInt(values.liftOther, 10)
            : null,
          interruptions: values.interruptions
            ? parseInt(values.interruptions, 10)
            : null,
          diesel: values.diesel ? parseInt(values.diesel, 10) : null,
          cng: values.cng ? parseInt(values.cng, 10) : null,
          electric: values.electric ? parseInt(values.electric, 10) : null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save metrics");
      }

      setSubmitSuccess(true);
      setValues({
        motorBusMajor: "",
        motorBusOther: "",
        liftMajor: "",
        liftOther: "",
        interruptions: "",
        diesel: "",
        cng: "",
        electric: "",
      });
      setReportingMonth(dayjs());

      // Clear success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <Box sx={{ p: 4, mb: 4 }}>
        <h1 className="text-3xl font-bold">Maintenance page</h1>
        <p className="text-gray-700">
          This is the page that will display Maintenance metrics and future inputs.
        </p>

        <Link
          href="/"
          className="text-blue-600 hover:underline block mt-8"
        >
          ← Back to Home
        </Link>
      </Box>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box p={4}>
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Maintenance Input Form
            </Typography>

            {submitError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {submitError}
              </Alert>
            )}
            {submitSuccess && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Maintenance metrics saved successfully!
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* Reporting Month */}
                <Box maxWidth={400}>
                  <DatePicker
                    views={["year", "month"]}
                    label="Reporting Month"
                    value={reportingMonth}
                    onChange={(newValue) => {
                      if (newValue && "isValid" in newValue) {
                        setReportingMonth(newValue);
                      }
                    }}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Box>

                {/* Road Calls Section */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Road Calls
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={2}>
                    <TextField
                      label="Motor Bus — Major"
                      type="number"
                      value={values.motorBusMajor}
                      onChange={(e) =>
                        handleChange("motorBusMajor", e.target.value)
                      }
                      inputProps={{ min: 0 }}
                    />
                    <TextField
                      label="Motor Bus — Other"
                      type="number"
                      value={values.motorBusOther}
                      onChange={(e) =>
                        handleChange("motorBusOther", e.target.value)
                      }
                      inputProps={{ min: 0 }}
                    />
                    <TextField
                      label="Lift — Major"
                      type="number"
                      value={values.liftMajor}
                      onChange={(e) => handleChange("liftMajor", e.target.value)}
                      inputProps={{ min: 0 }}
                    />
                    <TextField
                      label="Lift — Other"
                      type="number"
                      value={values.liftOther}
                      onChange={(e) => handleChange("liftOther", e.target.value)}
                      inputProps={{ min: 0 }}
                    />
                  </Box>
                </Box>

                {/* Service Interruptions */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Service Interruptions
                  </Typography>
                  <Box maxWidth={300}>
                    <TextField
                      label="Service Interruptions"
                      type="number"
                      value={values.interruptions}
                      onChange={(e) =>
                        handleChange("interruptions", e.target.value)
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
                  <Box display="flex" flexWrap="wrap" gap={2}>
                    <TextField
                      label="Diesel (gal)"
                      type="number"
                      value={values.diesel}
                      onChange={(e) => handleChange("diesel", e.target.value)}
                      inputProps={{ min: 0 }}
                    />
                    <TextField
                      label="CNG (GGE)"
                      type="number"
                      value={values.cng}
                      onChange={(e) => handleChange("cng", e.target.value)}
                      inputProps={{ min: 0 }}
                    />
                    <TextField
                      label="Electric (kWh)"
                      type="number"
                      value={values.electric}
                      onChange={(e) => handleChange("electric", e.target.value)}
                      inputProps={{ min: 0 }}
                    />
                  </Box>
                </Box>

                {/* Save Button */}
                <Box>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={reportingMonth === null || isSubmitting}
                    sx={{ mt: 2 }}
                  >
                    {isSubmitting ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Saving...
                      </>
                    ) : (
                      "Save"
                    )}
                  </Button>
                </Box>
              </Stack>
            </form>
          </Paper>
        </Box>
      </LocalizationProvider>
    </main>
  );
}

