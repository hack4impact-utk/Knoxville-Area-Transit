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
CREATE TABLE "fixed_route_monthly_ridership" (
	"id" serial PRIMARY KEY NOT NULL,
	"monthly_report_id" integer NOT NULL,
	"route_number" integer,
	"route_name" text,
	"day_type" text,
	"schedule_id" integer,
	"avg_daily_ridership_upt" integer,
	"avg_daily_pass_miles_pmt" integer,
	"avg_trip_length_ptl" numeric,
	"sampled_trips" integer,
	"scheduled_trips" integer,
	"expansion_factor" numeric,
	"expanded_ridership_upt" integer,
	"expanded_pass_miles_pmt" integer,
	"expanded_revenue_miles" integer,
	"expanded_revenue_hours" numeric,
	"day_count" integer,
	"monthly_ridership_upt" integer,
	"monthly_pass_miles_pmt" integer,
	"monthly_revenue_miles" integer,
	"monthly_revenue_hours" numeric
);
--> statement-breakpoint
CREATE TABLE "hr_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"reporting_month" date NOT NULL,
	"otp_weekday" numeric,
	"otp_saturday" numeric,
	"otp_sunday" numeric,
	"otp_system" numeric,
	"peak_vehicles" integer,
	"driver_hours" numeric,
	"overtime_hours" numeric,
	"absenteeism" numeric,
	"training_certifications" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lift_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"monthly_report_id" integer NOT NULL,
	"completed_trips" integer DEFAULT 0,
	"trips_scheduled" integer DEFAULT 0,
	"passengers" integer DEFAULT 0,
	"revenue_miles" integer DEFAULT 0,
	"revenue_hours" integer DEFAULT 0,
	"trips_denied" integer DEFAULT 0,
	"no_shows_cancellations" integer DEFAULT 0,
	"weekday_ridership" integer DEFAULT 0,
	"saturday_ridership" integer DEFAULT 0,
	"sunday_ridership" integer DEFAULT 0,
	"on_time_performance_percent" integer,
	CONSTRAINT "lift_metrics_monthly_report_id_unique" UNIQUE("monthly_report_id")
);
--> statement-breakpoint
CREATE TABLE "maintenance_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"reporting_month" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "safety_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"reporting_month" date NOT NULL,
	"preventable_main" integer,
	"preventable_lift" integer,
	"collisions_main" integer,
	"collisions_lift" integer,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
