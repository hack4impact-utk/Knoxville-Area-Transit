"use client";

import React, { useState } from "react";
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

  return (
    <main>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ p: 4 }}>
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
                onChange={(newValue) => setReportingMonth(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                  },
                }}
              />
            </Box>

            {/* Preventable Accidents */}
            <Grid container spacing={3}>
              <Grid container item xs={12} md={6}>
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
              </Grid>

              <Grid container item xs={12} md={6}>
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
              </Grid>
            </Grid>

            {/* Collisions */}
            <Grid container spacing={3}>
              <Grid container item xs={12} md={6}>
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
              </Grid>

              <Grid container item xs={12} md={6}>
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
              </Grid>
            </Grid>

            {/* Notes */}
            <Grid container spacing={3}>
              <Grid container item xs={12}>
                <TextField
                  label="Notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  multiline
                  minRows={3}
                  fullWidth
                />
              </Grid>
            </Grid>

            {/* Disabled Save Button */}
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" disabled>
                Save
              </Button>
            </Box>
          </Stack>
        </Box>
      </LocalizationProvider>
    </main>
  );
}
