"use client";

import { TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Link from "next/link";
import type { JSX } from "react";
import React, { useState } from "react";

type HrFieldKey =
  | "weekday"
  | "saturday"
  | "sunday"
  | "system"
  | "vehicles"
  | "driverHours"
  | "overtime"
  | "absenteeism"
  | "training";

type HrFormState = Record<HrFieldKey, string>;

export default function HR(): JSX.Element {
  const [month, setMonth] = useState<Date | null>(null);
  const [form, setForm] = useState<HrFormState>({
    weekday: "",
    saturday: "",
    sunday: "",
    system: "",
    vehicles: "",
    driverHours: "",
    overtime: "",
    absenteeism: "",
    training: "",
  });

  const handle = (k: HrFieldKey, v: string): void =>
    setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div style={{ padding: "1rem" }}>
        <h1>HR / Operations Metrics</h1>

        <DatePicker
          label="Reporting Month"
          views={["year", "month"]}
          value={month}
          onChange={(newValue) => setMonth(newValue as Date | null)}
        />

        {[
          { l: "OTP Weekday", k: "weekday" as HrFieldKey },
          { l: "OTP Saturday", k: "saturday" as HrFieldKey },
          { l: "OTP Sunday", k: "sunday" as HrFieldKey },
          { l: "OTP System", k: "system" as HrFieldKey },
          { l: "Peak Vehicles", k: "vehicles" as HrFieldKey },
          { l: "Driver Hours", k: "driverHours" as HrFieldKey },
          { l: "Overtime Hours", k: "overtime" as HrFieldKey },
          { l: "Absenteeism", k: "absenteeism" as HrFieldKey },
        ].map(({ l, k }) => (
          <TextField
            key={k}
            label={l}
            type="number"
            value={form[k]}
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
