/* eslint-disable prettier/prettier */
// src/db/schema/index.ts

import {
    date,
    integer,
    numeric,
    pgTable,
    primaryKey,
    serial,
    text,
    timestamp,
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
      FINANCES TABLE
     ====================== */
  export const finance_metrics = pgTable("finance_metrics", {
    id: serial("id").primaryKey(),
    monthlyReportId: integer("monthly_report_id")
    .references(() => MonthlyDepartmentReport.id)
    .unique(),
    fixedRouteRevenue: numeric("fixed_route_revenue").notNull(),
    liftRevenue: numeric("lift_revenue").notNull(),
    footballShuttleRevenue: numeric("football_shuttle_revenue").notNull(),
    boydsSoccerRevenue: numeric("boyds_soccer_revenue").notNull(),
    otherCharterRevenue: numeric("other_charter_revenue").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  });
  