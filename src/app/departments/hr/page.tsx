"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export default function HR() {
  const [month, setMonth] = useState(null);
  const [form, setForm] = useState({
    weekday: "",
    saturday: "",
    sunday: "",
    system: "",
    vehicles: "",
    driverHours: "",
    overtime: "",
    absenteeism: "",
    training: ""
  });

  const handle = (k: string, v: string) => setForm({ ...form, [k]: v });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
    <div style={{ padding: "1rem" }}>
      <h1>HR / Operations Metrics</h1>

      <DatePicker
        label="Reporting Month"
        views={["year", "month"]}
        value={month}
        onChange={setMonth}
      />

      {[
        { l: "OTP Weekday", k: "weekday" },
        { l: "OTP Saturday", k: "saturday" },
        { l: "OTP Sunday", k: "sunday" },
        { l: "OTP System", k: "system" },
        { l: "Peak Vehicles", k: "vehicles" },
        { l: "Driver Hours", k: "driverHours" },
        { l: "Overtime Hours", k: "overtime" },
        { l: "Absenteeism", k: "absenteeism" }
      ].map(({ l, k }) => (
        <TextField
          key={k}
          label={l}
          type="number"
          value={(form as any)[k]}
          onChange={(e) => handle(k, e.target.value)}
          inputProps={{ min: 0, max: k.includes("otp") ? 100 : undefined }}
          style={{ display: "block", margin: "0.5rem 0" }}
        />
      ))}

      <TextField
        label="Training / Certifications"
        multiline
        minRows={2}
        value={form.training}
        onChange={(e) => handle("training", e.target.value)}
        style={{ display: "block", margin: "0.5rem 0" }}
      />

      <p>
        <Link href="/">← Home</Link>
      </p>
    </div>
    </LocalizationProvider>
  );
}
