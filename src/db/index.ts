// src/db/index.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

const db = databaseUrl
  ? drizzle({
      client: neon(databaseUrl),
      schema,
    })
  : null;

export default db;
