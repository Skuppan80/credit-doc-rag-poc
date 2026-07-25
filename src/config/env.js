// src/config/env.js
//
// WHY THIS FILE EXISTS:
// Instead of reading process.env.WHATEVER scattered throughout the codebase
// (easy to typo, easy to forget, fails silently), we load and validate every
// required environment variable in exactly ONE place, at startup.
//
// If something required is missing, the app refuses to start at all —
// "fail fast" — rather than crashing later on some unlucky request in
// production, which is much harder to debug.

import "dotenv/config"; // loads .env into process.env
import { z } from "zod";

// Define the SHAPE we expect our environment to have.
// zod both validates AND gives us type-safe access afterward.
const envSchema = z.object({
  ANTHROPIC_API_KEY: z.string().min(1, "ANTHROPIC_API_KEY is required"),
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),
  NEO4J_URI: z.string().min(1, "NEO4J_URI is required"),
  NEO4J_USERNAME: z.string().min(1, "NEO4J_USERNAME is required"),
  NEO4J_PASSWORD: z.string().min(1, "NEO4J_PASSWORD is required"),
  MAX_SPEND_USD: z.string().default("2.00").transform((v) => parseFloat(v)),
  PORT: z.string().default("3000").transform((v) => parseInt(v, 10)),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

// Parse immediately on import. If this throws, the app exits before
// binding to any port or accepting any traffic — exactly what we want.
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid or missing environment variables:");
  for (const issue of parsed.error.issues) {
    console.error(`   - ${issue.path.join(".")}: ${issue.message}`);
  }
  console.error("\nCheck your .env file against .env.example and try again.");
  process.exit(1);
}

export const env = parsed.data;