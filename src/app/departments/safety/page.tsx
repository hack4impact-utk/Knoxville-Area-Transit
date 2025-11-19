"use client";

import { JSX } from "react";
import Link from "next/link";
import {
  Box,
  TextField,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import { Dayjs } from "dayjs";

export default function Safety(): JSX.Element {
  const [reportingMonth, setReportingMonth] = useState<Dayjs | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Safety Report
        </Typography>

        <Paper sx={{ p: 3, mt: 3 }}>
          <form>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Reporting Month */}
              <DatePicker
                views={["month"]}
                label="Reporting Month"
                value={reportingMonth}
                onChange={(newValue) => setReportingMonth(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />

              {/* Preventable Accidents - Main Line */}
              <TextField
                fullWidth
                label="Preventable Accidents — Main Line"
                type="number"
                required
                slotProps={{ htmlInput: { min: 0 } }}
              />

              {/* Preventable Accidents - Lift */}
              <TextField
                fullWidth
                label="Preventable Accidents — Lift"
                type="number"
                required
                slotProps={{ htmlInput: { min: 0 } }}
              />

              {/* Collisions - Main Line */}
              <TextField
                fullWidth
                label="Collisions — Main Line"
                type="number"
                required
                slotProps={{ htmlInput: { min: 0 } }}
              />

              {/* Collisions - Lift */}
              <TextField
                fullWidth
                label="Collisions — Lift"
                type="number"
                required
                slotProps={{ htmlInput: { min: 0 } }}
              />

              {/* Notes */}
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={4}
                placeholder="Enter any additional notes or details about the safety report..."
              />

              {/* Submit Button */}
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button variant="outlined" component={Link} href="/">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Submit Report
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>

        <Box sx={{ mt: 2 }}>
          <Link href="/">← Back to Home</Link>
        </Box>
      </Box>
    </LocalizationProvider>
    <div>
      <h1>Safety</h1>
      <p>This is the safety page here.</p>
      <Link href="/">Home</Link>
    </div>
  );
}
