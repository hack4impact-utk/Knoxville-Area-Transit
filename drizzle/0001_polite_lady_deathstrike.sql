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
	"reporting_month" date NOT NULL,
	"trips_denied" integer,
	"no_shows" integer,
	"trips_scheduled" integer,
	"total_passengers" integer,
	"revenue_vehicle_miles" numeric,
	"revenue_vehicle_hours" numeric,
	"avg_cost_per_trip" numeric,
	"passenger_per_mile" numeric,
	"passenger_per_hour" numeric,
	"otp_percent" numeric,
	"avg_weekday_ridership" numeric,
	"avg_saturday_ridership" numeric,
	"avg_sunday_ridership" numeric,
	"total_weekday_ridership" numeric,
	"total_saturday_ridership" numeric,
	"total_sunday_ridership" numeric,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "maintenance_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"reporting_month" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "monthly_department_report" (
	"id" serial PRIMARY KEY NOT NULL,
	"month" text NOT NULL,
	"year" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "safety_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"monthly_report_id" integer NOT NULL,
	"preventable_motor_bus" integer DEFAULT 0,
	"preventable_lift" integer DEFAULT 0,
	"collision_motor_bus" integer DEFAULT 0,
	"collision_lift" integer DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "safety_metrics" ADD CONSTRAINT "safety_metrics_monthly_report_id_monthly_department_report_id_fk" FOREIGN KEY ("monthly_report_id") REFERENCES "public"."monthly_department_report"("id") ON DELETE no action ON UPDATE no action;