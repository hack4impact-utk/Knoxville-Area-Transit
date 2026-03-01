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
   RIDERSHIP METRICS TABLE
   ====================== */
export const ridershipMetrics = pgTable("ridership_metrics", {
  id: serial("id").primaryKey(),
  reportingMonth: date("reporting_month").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});