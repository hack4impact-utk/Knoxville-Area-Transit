CREATE TABLE "special_services_runs" (
	"id" serial PRIMARY KEY NOT NULL,
	"monthly_report_id" integer NOT NULL,
	"service_type" text NOT NULL,
	"event_date" date NOT NULL,
	"passenger_count" integer DEFAULT 0,
	"revenue_miles" integer DEFAULT 0,
	"revenue_hours" integer DEFAULT 0,
	"event_name" text,
	"location" text
);
--> statement-breakpoint
DROP TABLE "charter_events" CASCADE;