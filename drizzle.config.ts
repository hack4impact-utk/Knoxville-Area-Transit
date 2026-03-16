import dotenv from "dotenv";

// Load .env.local first (Next.js convention), then .env
dotenv.config({ path: ".env.local" });
dotenv.config();

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
