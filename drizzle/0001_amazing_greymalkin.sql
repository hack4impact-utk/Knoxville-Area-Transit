CREATE TABLE "charter_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"reporting_month" date NOT NULL,
	"event_type" text NOT NULL,
	"event_date" date,
	"passenger_count" integer,
	"vehicle_hours" numeric,
	"vehicle_miles" numeric,
	"driver_assignments" text,
	"revenue_total" numeric,
	"service_total" numeric,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "maintenance_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"reporting_month" date NOT NULL,
	"motor_bus_major" integer,
	"motor_bus_other" integer,
	"lift_major" integer,
	"lift_other" integer,
	"interruptions" integer,
	"diesel" numeric,
	"cng" numeric,
	"electric" numeric,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
