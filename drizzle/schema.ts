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

export const ridershipMetrics = pgTable("ridership_metrics", {
	id: serial().primaryKey().notNull(),
	reportingMonth: date("reporting_month").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
