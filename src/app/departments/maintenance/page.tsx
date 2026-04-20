"use client";

import Link from "next/link";
import React, { useState } from "react";
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
    motorBusMajorRoadCalls: "",
    motorBusOtherRoadCalls: "",
    liftMajorRoadCalls: "",
    liftOtherRoadCalls: "",
    busDieselGallons: "",
    busGasolineGallons: "",
    ebKwhCharging: "",
    ebKwhPropulsion: "",
    liftDieselGallons: "",
    liftGasolineGallons: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (field: string, value: string) => {
    if (/^\d*$/.test(value)) {
      setValues((prev) => ({ ...prev, [field]: value }));
    }
  };

  const toInt = (v: string) => (v ? parseInt(v, 10) : 0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!reportingMonth) {
      setSubmitError("Reporting Month is required");
      return;
    }

    const monthlyReportId =
      reportingMonth.year() * 100 + (reportingMonth.month() + 1);

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monthlyReportId,
          motorBusMajorRoadCalls: toInt(values.motorBusMajorRoadCalls),
          motorBusOtherRoadCalls: toInt(values.motorBusOtherRoadCalls),
          liftMajorRoadCalls: toInt(values.liftMajorRoadCalls),
          liftOtherRoadCalls: toInt(values.liftOtherRoadCalls),
          busDieselGallons: toInt(values.busDieselGallons),
          busGasolineGallons: toInt(values.busGasolineGallons),
          ebKwhCharging: toInt(values.ebKwhCharging),
          ebKwhPropulsion: toInt(values.ebKwhPropulsion),
          liftDieselGallons: toInt(values.liftDieselGallons),
          liftGasolineGallons: toInt(values.liftGasolineGallons),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save metrics");
      }

      setSubmitSuccess(true);
      setValues({
        motorBusMajorRoadCalls: "",
        motorBusOtherRoadCalls: "",
        liftMajorRoadCalls: "",
        liftOtherRoadCalls: "",
        busDieselGallons: "",
        busGasolineGallons: "",
        ebKwhCharging: "",
        ebKwhPropulsion: "",
        liftDieselGallons: "",
        liftGasolineGallons: "",
      });
      setReportingMonth(dayjs());

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

                <Box>
                  <Typography variant="h6" gutterBottom>
                    Road Calls
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={2}>
                    <TextField
                      label="Motor Bus — Major"
                      type="number"
                      value={values.motorBusMajorRoadCalls}
                      onChange={(e) =>
                        handleChange("motorBusMajorRoadCalls", e.target.value)
                      }
                      inputProps={{ min: 0 }}
                    />
                    <TextField
                      label="Motor Bus — Other"
                      type="number"
                      value={values.motorBusOtherRoadCalls}
                      onChange={(e) =>
                        handleChange("motorBusOtherRoadCalls", e.target.value)
                      }
                      inputProps={{ min: 0 }}
                    />
                    <TextField
                      label="Lift — Major"
                      type="number"
                      value={values.liftMajorRoadCalls}
                      onChange={(e) =>
                        handleChange("liftMajorRoadCalls", e.target.value)
                      }
                      inputProps={{ min: 0 }}
                    />
                    <TextField
                      label="Lift — Other"
                      type="number"
                      value={values.liftOtherRoadCalls}
                      onChange={(e) =>
                        handleChange("liftOtherRoadCalls", e.target.value)
                      }
                      inputProps={{ min: 0 }}
                    />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom>
                    Bus Fuel
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={2}>
                    <TextField
                      label="Bus Diesel (gal)"
                      type="number"
                      value={values.busDieselGallons}
                      onChange={(e) =>
                        handleChange("busDieselGallons", e.target.value)
                      }
                      inputProps={{ min: 0 }}
                    />
                    <TextField
                      label="Bus Gasoline (gal)"
                      type="number"
                      value={values.busGasolineGallons}
                      onChange={(e) =>
                        handleChange("busGasolineGallons", e.target.value)
                      }
                      inputProps={{ min: 0 }}
                    />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom>
                    Electric Bus Energy
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={2}>
                    <TextField
                      label="EB kWh — Charging"
                      type="number"
                      value={values.ebKwhCharging}
                      onChange={(e) =>
                        handleChange("ebKwhCharging", e.target.value)
                      }
                      inputProps={{ min: 0 }}
                    />
                    <TextField
                      label="EB kWh — Propulsion"
                      type="number"
                      value={values.ebKwhPropulsion}
                      onChange={(e) =>
                        handleChange("ebKwhPropulsion", e.target.value)
                      }
                      inputProps={{ min: 0 }}
                    />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom>
                    Lift Fuel
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={2}>
                    <TextField
                      label="Lift Diesel (gal)"
                      type="number"
                      value={values.liftDieselGallons}
                      onChange={(e) =>
                        handleChange("liftDieselGallons", e.target.value)
                      }
                      inputProps={{ min: 0 }}
                    />
                    <TextField
                      label="Lift Gasoline (gal)"
                      type="number"
                      value={values.liftGasolineGallons}
                      onChange={(e) =>
                        handleChange("liftGasolineGallons", e.target.value)
                      }
                      inputProps={{ min: 0 }}
                    />
                  </Box>
                </Box>

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
