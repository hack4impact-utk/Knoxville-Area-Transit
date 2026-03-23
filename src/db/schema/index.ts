// src/db/schema/index.ts

import {
    integer,
    pgTable,
    primaryKey,
    text,
    timestamp,
    numeric,
    date,
    serial,
  } from "drizzle-orm/pg-core";
  
  /* ======================
     USERS TABLE
     ====================== */
  export const users = pgTable("user", {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
  });
  
  /* ======================
     ACCOUNTS TABLE
     ====================== */
  export const accounts = pgTable(
    "account",
    {
      userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
      type: text("type").notNull(),
      provider: text("provider").notNull(),
      providerAccountId: text("providerAccountId").notNull(),
      refresh_token: text("refresh_token"),
      access_token: text("access_token"),
      expires_at: integer("expires_at"),
      token_type: text("token_type"),
      scope: text("scope"),
      id_token: text("id_token"),
      session_state: text("session_state"),
    },
    (account) => [
      {
        compoundKey: primaryKey({
          columns: [account.provider, account.providerAccountId],
        }),
      },
    ],
  );
  
  /* ======================
     SESSIONS TABLE
     ====================== */
  export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  });
  
  /* ======================
     CHARTER EVENTS TABLE
     ====================== */
  export const charterEvents = pgTable("charter_events", {
    id: serial("id").primaryKey(),
  
    reportingMonth: date("reporting_month").notNull(),
    eventType: text("event_type").notNull(),
    eventDate: date("event_date"),
  
    passengerCount: integer("passenger_count"),
    vehicleHours: numeric("vehicle_hours"),
    vehicleMiles: numeric("vehicle_miles"),
  
    driverAssignments: text("driver_assignments"),
  
    revenueTotal: numeric("revenue_total"),
    serviceTotal: numeric("service_total"),
  
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  });

  /* ======================
     HR METRICS TABLE
     ====================== */
  export const hrMetrics = pgTable("hr_metrics", {
    id: serial("id").primaryKey(),

    reportingMonth: date("reporting_month").notNull(),

    otpWeekday: numeric("otp_weekday"),
    otpSaturday: numeric("otp_saturday"),
    otpSunday: numeric("otp_sunday"),
    otpSystem: numeric("otp_system"),

    peakVehicles: integer("peak_vehicles"),
    driverHours: numeric("driver_hours"),
    overtimeHours: numeric("overtime_hours"),
    absenteeism: numeric("absenteeism"),

    trainingCertifications: text("training_certifications"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  });

  /* ======================
     MAINTENANCE METRICS TABLE
     ====================== */
  export const maintenanceMetrics = pgTable("maintenance_metrics", {
    id: serial("id").primaryKey(),

    reportingMonth: date("reporting_month").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  });

  /* ======================
     LIFT METRICS TABLE
     ====================== */
  export const liftMetrics = pgTable("lift_metrics", {
    id: serial("id").primaryKey(),

    reportingMonth: date("reporting_month").notNull(),

    tripsDenied: integer("trips_denied"),
    noShows: integer("no_shows"),
    tripsScheduled: integer("trips_scheduled"),
    totalPassengers: integer("total_passengers"),

    revenueVehicleMiles: numeric("revenue_vehicle_miles"),
    revenueVehicleHours: numeric("revenue_vehicle_hours"),

    avgCostPerTrip: numeric("avg_cost_per_trip"),
    passengerPerMile: numeric("passenger_per_mile"),
    passengerPerHour: numeric("passenger_per_hour"),
    otpPercent: numeric("otp_percent"),

    avgWeekdayRidership: numeric("avg_weekday_ridership"),
    avgSaturdayRidership: numeric("avg_saturday_ridership"),
    avgSundayRidership: numeric("avg_sunday_ridership"),

    totalWeekdayRidership: numeric("total_weekday_ridership"),
    totalSaturdayRidership: numeric("total_saturday_ridership"),
    totalSundayRidership: numeric("total_sunday_ridership"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  });

  /* ======================
     SAFETY REPORTS TABLE
     ====================== */
  export const safetyReports = pgTable("safety_reports", {
    id: serial("id").primaryKey(),

    reportingMonth: date("reporting_month").notNull(),
    preventableMain: integer("preventable_main"),
    preventableLift: integer("preventable_lift"),
    collisionsMain: integer("collisions_main"),
    collisionsLift: integer("collisions_lift"),
    notes: text("notes"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  });
  /* ======================
     FIXED ROUTE MONTHLY RIDERSHIP TABLE
     ====================== */
  export const fixedRouteMonthlyRidership = pgTable("fixed_route_monthly_ridership", {
    id: serial("id").primaryKey(),

    monthlyReportId: integer("monthly_report_id").notNull(),

    routeNumber: integer("route_number"),
    routeName: text("route_name"),

    dayType: text("day_type"),

    scheduleId: integer("schedule_id"),

    avgDailyRidershipUpt: integer("avg_daily_ridership_upt"),
    avgDailyPassMilesPmt: integer("avg_daily_pass_miles_pmt"),
    avgTripLengthPtl: numeric("avg_trip_length_ptl"),

    sampledTrips: integer("sampled_trips"),
    scheduledTrips: integer("scheduled_trips"),
    expansionFactor: numeric("expansion_factor"),

    expandedRidershipUpt: integer("expanded_ridership_upt"),
    expandedPassMilesPmt: integer("expanded_pass_miles_pmt"),

    expandedRevenueMiles: integer("expanded_revenue_miles"),
    expandedRevenueHours: numeric("expanded_revenue_hours"),

    dayCount: integer("day_count"),

    monthlyRidershipUpt: integer("monthly_ridership_upt"),
    monthlyPassMilesPmt: integer("monthly_pass_miles_pmt"),

    monthlyRevenueMiles: integer("monthly_revenue_miles"),
    monthlyRevenueHours: numeric("monthly_revenue_hours"),
  });
