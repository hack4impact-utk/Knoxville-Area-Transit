CREATE TABLE "ridership_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"reporting_month" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
