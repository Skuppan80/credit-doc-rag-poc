// src/pipelines/embedChunks.js
//
// Embeds all chunks and saves the results to disk, so downstream code
// (vector search, comparisons) never needs to re-call the API. Batches
// requests (20 chunks per call) instead of one-by-one — faster and
// avoids hitting rate limits.

import "dotenv/config";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";

import { env } from "../config/env.js";
import { loadAllChunks } from "../ingestion/loadAllDocuments.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, "..", "..", "data", "processed", "embeddings.json");

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
const BATCH_SIZE = 20;

// Simple delay helper — small pause between batches to be a polite API citizen.
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function embedAllChunks() {
  const chunks = await loadAllChunks();
  const results = [];
  let totalTokens = 0;

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);

    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: batch.map((c) => c.text),
    });

    totalTokens += response.usage.total_tokens;

    // Cost guardrail: stop if we've exceeded the budget mid-run, rather
    // than finishing the whole job and finding out too late.
    const costSoFar = (totalTokens / 1_000_000) * 0.02;
    if (costSoFar > env.MAX_SPEND_USD) {
      throw new Error(
        `Aborting: embedding cost ($${costSoFar.toFixed(4)}) exceeded MAX_SPEND_USD ($${env.MAX_SPEND_USD})`
      );
    }

    for (let j = 0; j < batch.length; j++) {
      results.push({
        ...batch[j],
        embedding: response.data[j].embedding,
      });
    }

    console.log(`Embedded ${Math.min(i + BATCH_SIZE, chunks.length)} / ${chunks.length} chunks...`);
    await sleep(200); // small pause between batches
  }

  await writeFile(OUTPUT_PATH, JSON.stringify(results, null, 2));

  console.log(`\nDone. Total tokens: ${totalTokens}`);
  console.log(`Estimated cost: $${((totalTokens / 1_000_000) * 0.02).toFixed(4)}`);
  console.log(`Saved to: ${OUTPUT_PATH}`);

  return results;
}

// Allow running this file directly: node src/pipelines/embedChunks.js
if (import.meta.url === `file://${process.argv[1]}`) {
  embedAllChunks().catch((err) => {
    console.error("Embedding failed:", err.message);
    process.exit(1);
  });
}