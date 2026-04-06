import fs from "fs/promises";
import path from "path";
import { z } from "zod";

// --- STEP 2: The Schema ---
export const ArtifactSchema = z.object({
  metadata: z.object({
    kind: z.string(),
    reporting_month: z.number().min(1).max(12).optional(),
    fiscal_year: z.number().optional(),
  }),
  warnings: z.array(z.string()).default([]),
  data: z.array(z.any()), 
});

export type Artifact = z.infer<typeof ArtifactSchema>;

// --- STEP 3: The Core Loader ---
export async function loadArtifact(fileName: string): Promise<Artifact> {
  try {
    const filePath = path.join(process.cwd(), "data", "normalized", fileName);
    const fileContents = await fs.readFile(filePath, "utf-8");
    const rawJson = JSON.parse(fileContents);
    return ArtifactSchema.parse(rawJson); // Validates and returns
  } catch (error) {
    console.error(`Failed to load or validate artifact: ${fileName}`);
    throw error; 
  }
}

// --- STEP 4: The Query Helper ---
export async function getMonthlyArtifact(
  kind: string, 
  year: number, 
  month: number
): Promise<Artifact> {
  const formattedMonth = month.toString().padStart(2, "0");
  const fileName = `${kind}-${year}-${formattedMonth}.json`;
  return loadArtifact(fileName);
}