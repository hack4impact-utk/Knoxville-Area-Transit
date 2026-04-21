CREATE TABLE IF NOT EXISTS "monthly_department_report" (
	"id" integer PRIMARY KEY NOT NULL,
	"reporting_month" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ntd_operational_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"monthly_report_id" integer NOT NULL,
	"max_motor_buses_in_service" integer,
	"max_lift_vehicles_in_service" integer,
	"fixed_route_weekday_avg_riders" integer,
	"fixed_route_weekday_avg_rev_hours" numeric,
	"fixed_route_weekday_avg_rev_miles" numeric,
	"fixed_route_sat_avg_riders" integer,
	"fixed_route_sat_avg_rev_hours" numeric,
	"fixed_route_sat_avg_rev_miles" numeric,
	"fixed_route_sun_avg_riders" integer,
	"fixed_route_sun_avg_rev_hours" numeric,
	"fixed_route_sun_avg_rev_miles" numeric,
	"demand_response_weekday_avg_riders" integer,
	"demand_response_weekday_avg_rev_hours" numeric,
	"demand_response_weekday_avg_rev_miles" numeric,
	"demand_response_sat_avg_riders" integer,
	"demand_response_sat_avg_rev_hours" numeric,
	"demand_response_sat_avg_rev_miles" numeric,
	"demand_response_sun_avg_riders" integer,
	"demand_response_sun_avg_rev_hours" numeric,
	"demand_response_sun_avg_rev_miles" numeric
);
--> statement-breakpoint
ALTER TABLE "ntd_operational_metrics"
ADD CONSTRAINT "ntd_operational_metrics_monthly_report_id_monthly_department_report_id_fk"
FOREIGN KEY ("monthly_report_id") REFERENCES "public"."monthly_department_report"("id")
ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ntd_operational_metrics_monthly_report_id_idx"
ON "ntd_operational_metrics" ("monthly_report_id");

