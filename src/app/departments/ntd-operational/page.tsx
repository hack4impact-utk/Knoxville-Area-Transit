"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { JSX } from "react";

import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";

type NtdOperationalMetricsRow = {
  id: number;
  monthlyReportId: number;

  maxMotorBusesInService: number | null;
  maxLiftVehiclesInService: number | null;

  fixedRouteWeekdayAvgRiders: number | null;
  fixedRouteWeekdayAvgRevHours: string | number | null;
  fixedRouteWeekdayAvgRevMiles: string | number | null;
  fixedRouteSatAvgRiders: number | null;
  fixedRouteSatAvgRevHours: string | number | null;
  fixedRouteSatAvgRevMiles: string | number | null;
  fixedRouteSunAvgRiders: number | null;
  fixedRouteSunAvgRevHours: string | number | null;
  fixedRouteSunAvgRevMiles: string | number | null;

  demandResponseWeekdayAvgRiders: number | null;
  demandResponseWeekdayAvgRevHours: string | number | null;
  demandResponseWeekdayAvgRevMiles: string | number | null;
  demandResponseSatAvgRiders: number | null;
  demandResponseSatAvgRevHours: string | number | null;
  demandResponseSatAvgRevMiles: string | number | null;
  demandResponseSunAvgRiders: number | null;
  demandResponseSunAvgRevHours: string | number | null;
  demandResponseSunAvgRevMiles: string | number | null;
};

const handleNumericChange = (
  value: string,
  setter: (value: string) => void,
): void => {
  if (value === "" || /^\d*\.?\d*$/.test(value)) {
    setter(value);
  }
};

function asNullableNumber(value: string): number | null {
  if (value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export default function NtdOperationalPage(): JSX.Element {
  const [reportingMonth, setReportingMonth] = useState<Dayjs | null>(null);

  const monthlyReportId = useMemo(() => {
    return reportingMonth
      ? reportingMonth.year() * 100 + (reportingMonth.month() + 1)
      : null;
  }, [reportingMonth]);

  const [maxMotorBusesInService, setMaxMotorBusesInService] = useState("");
  const [maxLiftVehiclesInService, setMaxLiftVehiclesInService] = useState("");

  const [fixedRouteWeekdayAvgRiders, setFixedRouteWeekdayAvgRiders] =
    useState("");
  const [fixedRouteWeekdayAvgRevHours, setFixedRouteWeekdayAvgRevHours] =
    useState("");
  const [fixedRouteWeekdayAvgRevMiles, setFixedRouteWeekdayAvgRevMiles] =
    useState("");
  const [fixedRouteSatAvgRiders, setFixedRouteSatAvgRiders] = useState("");
  const [fixedRouteSatAvgRevHours, setFixedRouteSatAvgRevHours] = useState("");
  const [fixedRouteSatAvgRevMiles, setFixedRouteSatAvgRevMiles] = useState("");
  const [fixedRouteSunAvgRiders, setFixedRouteSunAvgRiders] = useState("");
  const [fixedRouteSunAvgRevHours, setFixedRouteSunAvgRevHours] = useState("");
  const [fixedRouteSunAvgRevMiles, setFixedRouteSunAvgRevMiles] = useState("");

  const [demandResponseWeekdayAvgRiders, setDemandResponseWeekdayAvgRiders] =
    useState("");
  const [demandResponseWeekdayAvgRevHours, setDemandResponseWeekdayAvgRevHours] =
    useState("");
  const [demandResponseWeekdayAvgRevMiles, setDemandResponseWeekdayAvgRevMiles] =
    useState("");
  const [demandResponseSatAvgRiders, setDemandResponseSatAvgRiders] =
    useState("");
  const [demandResponseSatAvgRevHours, setDemandResponseSatAvgRevHours] =
    useState("");
  const [demandResponseSatAvgRevMiles, setDemandResponseSatAvgRevMiles] =
    useState("");
  const [demandResponseSunAvgRiders, setDemandResponseSunAvgRiders] =
    useState("");
  const [demandResponseSunAvgRevHours, setDemandResponseSunAvgRevHours] =
    useState("");
  const [demandResponseSunAvgRevMiles, setDemandResponseSunAvgRevMiles] =
    useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  async function loadExisting() {
    if (!monthlyReportId) return;
    setIsLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const res = await fetch(
        `/api/ntd-operational?monthlyReportId=${monthlyReportId}`,
      );

      if (!res.ok) {
        const text = await res.text();
        setSubmitError(text);
        return;
      }

      const data = (await res.json()) as NtdOperationalMetricsRow | null;
      if (!data) {
        // Clear fields if nothing exists for that month
        setMaxMotorBusesInService("");
        setMaxLiftVehiclesInService("");
        setFixedRouteWeekdayAvgRiders("");
        setFixedRouteWeekdayAvgRevHours("");
        setFixedRouteWeekdayAvgRevMiles("");
        setFixedRouteSatAvgRiders("");
        setFixedRouteSatAvgRevHours("");
        setFixedRouteSatAvgRevMiles("");
        setFixedRouteSunAvgRiders("");
        setFixedRouteSunAvgRevHours("");
        setFixedRouteSunAvgRevMiles("");
        setDemandResponseWeekdayAvgRiders("");
        setDemandResponseWeekdayAvgRevHours("");
        setDemandResponseWeekdayAvgRevMiles("");
        setDemandResponseSatAvgRiders("");
        setDemandResponseSatAvgRevHours("");
        setDemandResponseSatAvgRevMiles("");
        setDemandResponseSunAvgRiders("");
        setDemandResponseSunAvgRevHours("");
        setDemandResponseSunAvgRevMiles("");
        return;
      }

      setMaxMotorBusesInService(
        data.maxMotorBusesInService === null
          ? ""
          : String(data.maxMotorBusesInService),
      );
      setMaxLiftVehiclesInService(
        data.maxLiftVehiclesInService === null
          ? ""
          : String(data.maxLiftVehiclesInService),
      );

      setFixedRouteWeekdayAvgRiders(
        data.fixedRouteWeekdayAvgRiders === null
          ? ""
          : String(data.fixedRouteWeekdayAvgRiders),
      );
      setFixedRouteWeekdayAvgRevHours(
        data.fixedRouteWeekdayAvgRevHours === null
          ? ""
          : String(data.fixedRouteWeekdayAvgRevHours),
      );
      setFixedRouteWeekdayAvgRevMiles(
        data.fixedRouteWeekdayAvgRevMiles === null
          ? ""
          : String(data.fixedRouteWeekdayAvgRevMiles),
      );
      setFixedRouteSatAvgRiders(
        data.fixedRouteSatAvgRiders === null
          ? ""
          : String(data.fixedRouteSatAvgRiders),
      );
      setFixedRouteSatAvgRevHours(
        data.fixedRouteSatAvgRevHours === null
          ? ""
          : String(data.fixedRouteSatAvgRevHours),
      );
      setFixedRouteSatAvgRevMiles(
        data.fixedRouteSatAvgRevMiles === null
          ? ""
          : String(data.fixedRouteSatAvgRevMiles),
      );
      setFixedRouteSunAvgRiders(
        data.fixedRouteSunAvgRiders === null
          ? ""
          : String(data.fixedRouteSunAvgRiders),
      );
      setFixedRouteSunAvgRevHours(
        data.fixedRouteSunAvgRevHours === null
          ? ""
          : String(data.fixedRouteSunAvgRevHours),
      );
      setFixedRouteSunAvgRevMiles(
        data.fixedRouteSunAvgRevMiles === null
          ? ""
          : String(data.fixedRouteSunAvgRevMiles),
      );

      setDemandResponseWeekdayAvgRiders(
        data.demandResponseWeekdayAvgRiders === null
          ? ""
          : String(data.demandResponseWeekdayAvgRiders),
      );
      setDemandResponseWeekdayAvgRevHours(
        data.demandResponseWeekdayAvgRevHours === null
          ? ""
          : String(data.demandResponseWeekdayAvgRevHours),
      );
      setDemandResponseWeekdayAvgRevMiles(
        data.demandResponseWeekdayAvgRevMiles === null
          ? ""
          : String(data.demandResponseWeekdayAvgRevMiles),
      );
      setDemandResponseSatAvgRiders(
        data.demandResponseSatAvgRiders === null
          ? ""
          : String(data.demandResponseSatAvgRiders),
      );
      setDemandResponseSatAvgRevHours(
        data.demandResponseSatAvgRevHours === null
          ? ""
          : String(data.demandResponseSatAvgRevHours),
      );
      setDemandResponseSatAvgRevMiles(
        data.demandResponseSatAvgRevMiles === null
          ? ""
          : String(data.demandResponseSatAvgRevMiles),
      );
      setDemandResponseSunAvgRiders(
        data.demandResponseSunAvgRiders === null
          ? ""
          : String(data.demandResponseSunAvgRiders),
      );
      setDemandResponseSunAvgRevHours(
        data.demandResponseSunAvgRevHours === null
          ? ""
          : String(data.demandResponseSunAvgRevHours),
      );
      setDemandResponseSunAvgRevMiles(
        data.demandResponseSunAvgRevMiles === null
          ? ""
          : String(data.demandResponseSunAvgRevMiles),
      );
    } catch (err) {
      console.error("[NTD Ops] failed to load metrics", err);
      setSubmitError("Unexpected error while loading.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadExisting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthlyReportId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!monthlyReportId) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    const payload = {
      monthlyReportId,

      maxMotorBusesInService: asNullableNumber(maxMotorBusesInService),
      maxLiftVehiclesInService: asNullableNumber(maxLiftVehiclesInService),

      fixedRouteWeekdayAvgRiders: asNullableNumber(fixedRouteWeekdayAvgRiders),
      fixedRouteWeekdayAvgRevHours: asNullableNumber(
        fixedRouteWeekdayAvgRevHours,
      ),
      fixedRouteWeekdayAvgRevMiles: asNullableNumber(
        fixedRouteWeekdayAvgRevMiles,
      ),
      fixedRouteSatAvgRiders: asNullableNumber(fixedRouteSatAvgRiders),
      fixedRouteSatAvgRevHours: asNullableNumber(fixedRouteSatAvgRevHours),
      fixedRouteSatAvgRevMiles: asNullableNumber(fixedRouteSatAvgRevMiles),
      fixedRouteSunAvgRiders: asNullableNumber(fixedRouteSunAvgRiders),
      fixedRouteSunAvgRevHours: asNullableNumber(fixedRouteSunAvgRevHours),
      fixedRouteSunAvgRevMiles: asNullableNumber(fixedRouteSunAvgRevMiles),

      demandResponseWeekdayAvgRiders: asNullableNumber(
        demandResponseWeekdayAvgRiders,
      ),
      demandResponseWeekdayAvgRevHours: asNullableNumber(
        demandResponseWeekdayAvgRevHours,
      ),
      demandResponseWeekdayAvgRevMiles: asNullableNumber(
        demandResponseWeekdayAvgRevMiles,
      ),
      demandResponseSatAvgRiders: asNullableNumber(demandResponseSatAvgRiders),
      demandResponseSatAvgRevHours: asNullableNumber(
        demandResponseSatAvgRevHours,
      ),
      demandResponseSatAvgRevMiles: asNullableNumber(
        demandResponseSatAvgRevMiles,
      ),
      demandResponseSunAvgRiders: asNullableNumber(demandResponseSunAvgRiders),
      demandResponseSunAvgRevHours: asNullableNumber(
        demandResponseSunAvgRevHours,
      ),
      demandResponseSunAvgRevMiles: asNullableNumber(
        demandResponseSunAvgRevMiles,
      ),
    };

    try {
      const res = await fetch("/api/ntd-operational", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        setSubmitError(text);
        return;
      }

      setSubmitSuccess(true);
      await loadExisting();
    } catch (err) {
      console.error("[NTD Ops] failed to save metrics", err);
      setSubmitError("Unexpected error while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            NTD Operational Metrics
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            Enter monthly NTD-facing operational summary values (peak vehicles and
            averages).
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <DatePicker
                    label="Reporting Month"
                    views={["year", "month"]}
                    value={reportingMonth}
                    onChange={(value) => setReportingMonth(value as Dayjs | null)}
                    slotProps={{
                      textField: { fullWidth: true, required: true },
                    }}
                  />
                </Grid>
              </Grid>

              <Divider />

              <Typography variant="h6">Peak vehicles (in service)</Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="Max Motor Buses"
                    value={maxMotorBusesInService}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setMaxMotorBusesInService)
                    }
                    inputProps={{ inputMode: "numeric" }}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="Max Lift Vehicles"
                    value={maxLiftVehiclesInService}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setMaxLiftVehiclesInService)
                    }
                    inputProps={{ inputMode: "numeric" }}
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Divider />

              <Typography variant="h6">Fixed Route — daily averages</Typography>
              <Typography variant="subtitle2">Weekday</Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="Avg Riders"
                    value={fixedRouteWeekdayAvgRiders}
                    onChange={(e) =>
                      handleNumericChange(
                        e.target.value,
                        setFixedRouteWeekdayAvgRiders,
                      )
                    }
                    inputProps={{ inputMode: "numeric" }}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="Avg Rev Hours"
                    value={fixedRouteWeekdayAvgRevHours}
                    onChange={(e) =>
                      handleNumericChange(
                        e.target.value,
                        setFixedRouteWeekdayAvgRevHours,
                      )
                    }
                    inputProps={{ inputMode: "decimal" }}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="Avg Rev Miles"
                    value={fixedRouteWeekdayAvgRevMiles}
                    onChange={(e) =>
                      handleNumericChange(
                        e.target.value,
                        setFixedRouteWeekdayAvgRevMiles,
                      )
                    }
                    inputProps={{ inputMode: "decimal" }}
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Typography variant="subtitle2">Saturday</Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="Avg Riders"
                    value={fixedRouteSatAvgRiders}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setFixedRouteSatAvgRiders)
                    }
                    inputProps={{ inputMode: "numeric" }}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="Avg Rev Hours"
                    value={fixedRouteSatAvgRevHours}
                    onChange={(e) =>
                      handleNumericChange(
                        e.target.value,
                        setFixedRouteSatAvgRevHours,
                      )
                    }
                    inputProps={{ inputMode: "decimal" }}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="Avg Rev Miles"
                    value={fixedRouteSatAvgRevMiles}
                    onChange={(e) =>
                      handleNumericChange(
                        e.target.value,
                        setFixedRouteSatAvgRevMiles,
                      )
                    }
                    inputProps={{ inputMode: "decimal" }}
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Typography variant="subtitle2">Sunday</Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="Avg Riders"
                    value={fixedRouteSunAvgRiders}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, setFixedRouteSunAvgRiders)
                    }
                    inputProps={{ inputMode: "numeric" }}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="Avg Rev Hours"
                    value={fixedRouteSunAvgRevHours}
                    onChange={(e) =>
                      handleNumericChange(
                        e.target.value,
                        setFixedRouteSunAvgRevHours,
                      )
                    }
                    inputProps={{ inputMode: "decimal" }}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="Avg Rev Miles"
                    value={fixedRouteSunAvgRevMiles}
                    onChange={(e) =>
                      handleNumericChange(
                        e.target.value,
                        setFixedRouteSunAvgRevMiles,
                      )
                    }
                    inputProps={{ inputMode: "decimal" }}
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Divider />

              <Typography variant="h6">Demand Response — daily averages</Typography>
              <Typography variant="subtitle2">Weekday</Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="Avg Riders"
                    value={demandResponseWeekdayAvgRiders}
                    onChange={(e) =>
                      handleNumericChange(
                        e.target.value,
                        setDemandResponseWeekdayAvgRiders,
                      )
                    }
                    inputProps={{ inputMode: "numeric" }}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="Avg Rev Hours"
                    value={demandResponseWeekdayAvgRevHours}
                    onChange={(e) =>
                      handleNumericChange(
                        e.target.value,
                        setDemandResponseWeekdayAvgRevHours,
                      )
                    }
                    inputProps={{ inputMode: "decimal" }}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="Avg Rev Miles"
                    value={demandResponseWeekdayAvgRevMiles}
                    onChange={(e) =>
                      handleNumericChange(
                        e.target.value,
                        setDemandResponseWeekdayAvgRevMiles,
                      )
                    }
                    inputProps={{ inputMode: "decimal" }}
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Typography variant="subtitle2">Saturday</Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="Avg Riders"
                    value={demandResponseSatAvgRiders}
                    onChange={(e) =>
                      handleNumericChange(
                        e.target.value,
                        setDemandResponseSatAvgRiders,
                      )
                    }
                    inputProps={{ inputMode: "numeric" }}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="Avg Rev Hours"
                    value={demandResponseSatAvgRevHours}
                    onChange={(e) =>
                      handleNumericChange(
                        e.target.value,
                        setDemandResponseSatAvgRevHours,
                      )
                    }
                    inputProps={{ inputMode: "decimal" }}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="Avg Rev Miles"
                    value={demandResponseSatAvgRevMiles}
                    onChange={(e) =>
                      handleNumericChange(
                        e.target.value,
                        setDemandResponseSatAvgRevMiles,
                      )
                    }
                    inputProps={{ inputMode: "decimal" }}
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Typography variant="subtitle2">Sunday</Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="Avg Riders"
                    value={demandResponseSunAvgRiders}
                    onChange={(e) =>
                      handleNumericChange(
                        e.target.value,
                        setDemandResponseSunAvgRiders,
                      )
                    }
                    inputProps={{ inputMode: "numeric" }}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="Avg Rev Hours"
                    value={demandResponseSunAvgRevHours}
                    onChange={(e) =>
                      handleNumericChange(
                        e.target.value,
                        setDemandResponseSunAvgRevHours,
                      )
                    }
                    inputProps={{ inputMode: "decimal" }}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="Avg Rev Miles"
                    value={demandResponseSunAvgRevMiles}
                    onChange={(e) =>
                      handleNumericChange(
                        e.target.value,
                        setDemandResponseSunAvgRevMiles,
                      )
                    }
                    inputProps={{ inputMode: "decimal" }}
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Box>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!monthlyReportId || isSubmitting || isLoading}
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
        </Box>
      </LocalizationProvider>
    </main>
  );
}

