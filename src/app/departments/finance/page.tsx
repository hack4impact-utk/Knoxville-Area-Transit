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
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const emptyValues = {
  fixedRouteRevenue: "",
  liftRevenue: "",
  footballShuttleRevenue: "",
  boydsSoccerRevenue: "",
  boydsBaseballRevenue: "",
  otherCharterRevenue: "",
};

type FinanceRecord = {
  id: number;
  monthlyReportId: number;
  fixedRouteRevenue: number | null;
  liftRevenue: number | null;
  footballShuttleRevenue: number | null;
  boydsSoccerRevenue: number | null;
  boydsBaseballRevenue: number | null;
  otherCharterRevenue: number | null;
};

const formatCurrency = (value: number | null) =>
  value == null ? "—" : `$${value.toLocaleString()}`;

export default function Finance() {
  const [reportingMonth, setReportingMonth] = useState<dayjs.Dayjs | null>(dayjs());
  const [values, setValues] = useState(emptyValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showOverwriteDialog, setShowOverwriteDialog] = useState(false);

  // Lookup state
  const [lookupMonth, setLookupMonth] = useState<dayjs.Dayjs | null>(null);
  const [lookupResult, setLookupResult] = useState<FinanceRecord | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [isLooking, setIsLooking] = useState(false);

  const handleChange = (field: string, value: string) => {
    if (/^\d*$/.test(value)) {
      setValues((prev) => ({ ...prev, [field]: value }));
    }
  };

  const toMonthId = (date: dayjs.Dayjs): number =>
    parseInt(date.format("YYYYMM"), 10);

  const buildPayload = () => ({
    monthlyReportId: toMonthId(reportingMonth!),
    fixedRouteRevenue: values.fixedRouteRevenue ? parseInt(values.fixedRouteRevenue, 10) : null,
    liftRevenue: values.liftRevenue ? parseInt(values.liftRevenue, 10) : null,
    footballShuttleRevenue: values.footballShuttleRevenue ? parseInt(values.footballShuttleRevenue, 10) : null,
    boydsSoccerRevenue: values.boydsSoccerRevenue ? parseInt(values.boydsSoccerRevenue, 10) : null,
    boydsBaseballRevenue: values.boydsBaseballRevenue ? parseInt(values.boydsBaseballRevenue, 10) : null,
    otherCharterRevenue: values.otherCharterRevenue ? parseInt(values.otherCharterRevenue, 10) : null,
  });

  const submitToApi = async (overwrite: boolean) => {
    const url = overwrite ? "/api/finance?overwrite=true" : "/api/finance";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload()),
    });

    if (response.status === 409) {
      setShowOverwriteDialog(true);
      return;
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to save finance metrics");
    }

    setSubmitSuccess(true);
    setValues(emptyValues);
    setReportingMonth(dayjs());
    setTimeout(() => setSubmitSuccess(false), 3000);
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
      await submitToApi(false);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverwriteConfirm = async () => {
    setShowOverwriteDialog(false);
    setIsSubmitting(true);
    try {
      await submitToApi(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLookup = async () => {
    if (!lookupMonth) return;
    setLookupError(null);
    setLookupResult(null);
    setIsLooking(true);

    try {
      const monthId = toMonthId(lookupMonth);
      const response = await fetch(`/api/finance?monthlyReportId=${monthId}`);

      if (response.status === 404) {
        setLookupError(`No record found for ${lookupMonth.format("MMMM YYYY")}.`);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch finance metrics");
      }

      const data = await response.json();
      setLookupResult(data);
    } catch (err) {
      setLookupError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLooking(false);
    }
  };

  return (
    <main>
      <Box sx={{ marginLeft: "40px"}}>
        <h1 className="text-3xl font-bold">Finance page</h1>
        <p className="text-gray-700">
          This page displays key finance metrics and projections for future inputs.
        </p>
        <Link href="/" className="text-blue-600 hover:underline block mt-8">
          ← Back to Home
        </Link>
      </Box>

      <Dialog open={showOverwriteDialog} onClose={() => setShowOverwriteDialog(false)}>
        <DialogTitle>Record Already Exists</DialogTitle>
        <DialogContent>
          <DialogContentText>
            A finance record for {reportingMonth?.format("MMMM YYYY")} already
            exists in the database. Do you want to overwrite it with the new values?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowOverwriteDialog(false)}>Cancel</Button>
          <Button onClick={handleOverwriteConfirm} color="warning" variant="contained">
            Overwrite
          </Button>
        </DialogActions>
      </Dialog>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box p={4}>
          {/* Input Form */}
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Finance Input Form
            </Typography>

            {submitError && <Alert severity="error" sx={{ mb: 3 }}>{submitError}</Alert>}
            {submitSuccess && <Alert severity="success" sx={{ mb: 3 }}>Finance metrics saved successfully!</Alert>}

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Box maxWidth={400}>
                  <DatePicker
                    views={["year", "month"]}
                    label="Reporting Month"
                    value={reportingMonth}
                    onChange={(newValue) => {
                      if (newValue && "isValid" in newValue) setReportingMonth(newValue);
                    }}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom>Transit Revenue</Typography>
                  <Box display="flex" flexWrap="wrap" gap={2}>
                    <TextField
                      label="Fixed Route Revenue" type="number" value={values.fixedRouteRevenue}
                      onChange={(e) => handleChange("fixedRouteRevenue", e.target.value)}
                      inputProps={{ min: 0 }}
                      InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                    />
                    <TextField
                      label="Lift Revenue" type="number" value={values.liftRevenue}
                      onChange={(e) => handleChange("liftRevenue", e.target.value)}
                      inputProps={{ min: 0 }}
                      InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                    />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom>Charter & Special Events Revenue</Typography>
                  <Box display="flex" flexWrap="wrap" gap={2}>
                    <TextField
                      label="Football Shuttle Revenue" type="number" value={values.footballShuttleRevenue}
                      onChange={(e) => handleChange("footballShuttleRevenue", e.target.value)}
                      inputProps={{ min: 0 }}
                      InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                    />
                    <TextField
                      label="Boyd's Soccer Revenue" type="number" value={values.boydsSoccerRevenue}
                      onChange={(e) => handleChange("boydsSoccerRevenue", e.target.value)}
                      inputProps={{ min: 0 }}
                      InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                    />
                    <TextField
                      label="Boyd's Baseball Revenue" type="number" value={values.boydsBaseballRevenue}
                      onChange={(e) => handleChange("boydsBaseballRevenue", e.target.value)}
                      inputProps={{ min: 0 }}
                      InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                    />
                    <TextField
                      label="Other Charter Revenue" type="number" value={values.otherCharterRevenue}
                      onChange={(e) => handleChange("otherCharterRevenue", e.target.value)}
                      inputProps={{ min: 0 }}
                      InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                    />
                  </Box>
                </Box>

                <Box>
                  <Button
                    type="submit" variant="contained"
                    disabled={reportingMonth === null || isSubmitting}
                    sx={{ mt: 2 }}
                  >
                    {isSubmitting ? <><CircularProgress size={20} sx={{ mr: 1 }} />Saving...</> : "Save"}
                  </Button>
                </Box>
              </Stack>
            </form>
          </Paper>

          {/* Lookup Section */}
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Look Up Monthly Record
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Stack direction="row" spacing={2} alignItems="center">
              <DatePicker
                views={["year", "month"]}
                label="Select Month"
                value={lookupMonth}
                onChange={(newValue) => {
                  setLookupResult(null);
                  setLookupError(null);
                  if (newValue && "isValid" in newValue) setLookupMonth(newValue);
                }}
                slotProps={{ textField: { sx: { minWidth: 200 } } }}
              />
              <Button
                variant="outlined"
                onClick={handleLookup}
                disabled={!lookupMonth || isLooking}
              >
                {isLooking ? <><CircularProgress size={20} sx={{ mr: 1 }} />Loading...</> : "Look Up"}
              </Button>
            </Stack>

            {lookupError && (
              <Alert severity="warning" sx={{ mt: 3 }}>{lookupError}</Alert>
            )}

            {lookupResult && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {lookupMonth?.format("MMMM YYYY")} — Finance Metrics
                </Typography>
                <Table size="small" sx={{ maxWidth: 400 }}>
                  <TableBody>
                    {[
                      ["Fixed Route Revenue", lookupResult.fixedRouteRevenue],
                      ["Lift Revenue", lookupResult.liftRevenue],
                      ["Football Shuttle Revenue", lookupResult.footballShuttleRevenue],
                      ["Boyd's Soccer Revenue", lookupResult.boydsSoccerRevenue],
                      ["Boyd's Baseball Revenue", lookupResult.boydsBaseballRevenue],
                      ["Other Charter Revenue", lookupResult.otherCharterRevenue],
                    ].map(([label, value]) => (
                      <TableRow key={label as string}>
                        <TableCell sx={{ fontWeight: 500 }}>{label}</TableCell>
                        <TableCell align="right">{formatCurrency(value as number | null)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </Paper>
        </Box>
      </LocalizationProvider>
    </main>
  );
}