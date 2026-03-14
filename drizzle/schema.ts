import { pgTable, unique, text, timestamp, foreignKey, integer, serial, date, numeric } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text(),
	email: text(),
	emailVerified: timestamp({ mode: 'string' }),
	image: text(),
}, (table) => [
	unique("user_email_unique").on(table.email),
]);

export const account = pgTable("account", {
	userId: text().notNull(),
	type: text().notNull(),
	provider: text().notNull(),
	providerAccountId: text().notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text(),
	idToken: text("id_token"),
	sessionState: text("session_state"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const session = pgTable("session", {
	sessionToken: text().primaryKey().notNull(),
	userId: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const charterEvents = pgTable("charter_events", {
	id: serial().primaryKey().notNull(),
	reportingMonth: date("reporting_month").notNull(),
	eventType: text("event_type").notNull(),
	eventDate: date("event_date"),
	passengerCount: integer("passenger_count"),
	vehicleHours: numeric("vehicle_hours"),
	vehicleMiles: numeric("vehicle_miles"),
	driverAssignments: text("driver_assignments"),
	revenueTotal: numeric("revenue_total"),
	serviceTotal: numeric("service_total"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const fixedRouteMonthlyRidership = pgTable("fixed_route_monthly_ridership", {
	id: serial().primaryKey().notNull(),
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
}, (table) => [
	unique("fixed_route_monthly_ridership_monthly_report_id_unique").on(table.monthlyReportId),
]);
