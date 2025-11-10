"use client";

import Link from "next/link";
import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export default function Maintenance() {
  const [reportingMonth, setReportingMonth] = useState<Date | null>(new Date());
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

  const handleChange = (field: string, value: string) => {
    if (/^\d*$/.test(value)) {
      setValues((prev) => ({ ...prev, [field]: value }));
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
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box p={4}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Maintenance Input Form
            </Typography>

            {/* Reporting Month */}
            <Box mb={3} maxWidth={400}>
              <DatePicker
                views={["year", "month"]}
                label="Reporting Month"
                value={reportingMonth}
                onChange={(newValue) => setReportingMonth(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Box>

            {/* Road Calls Section */}
            <Typography variant="h6" gutterBottom>
              Road Calls
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
              <TextField
                label="Motor Bus — Major"
                type="number"
                value={values.motorBusMajor}
                onChange={(e) => handleChange("motorBusMajor", e.target.value)}
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Motor Bus — Other"
                type="number"
                value={values.motorBusOther}
                onChange={(e) => handleChange("motorBusOther", e.target.value)}
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

            {/* Service Interruptions */}
            <Typography variant="h6" gutterBottom>
              Service Interruptions
            </Typography>
            <Box mb={3} maxWidth={300}>
              <TextField
                label="Service Interruptions"
                type="number"
                value={values.interruptions}
                onChange={(e) => handleChange("interruptions", e.target.value)}
                inputProps={{ min: 0 }}
                fullWidth
              />
            </Box>

            {/* Fuel / Energy Consumption */}
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
          </Paper>
        </Box>
      </LocalizationProvider>
      
    </main>
  );
}
