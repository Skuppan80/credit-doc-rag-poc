// src/pipelines/runBatchRag.js
//
// Runs all 60 booking-sheet-field questions through the RAG pipeline,
// one at a time, and saves every result. This is the raw output we'll
// later compare against ground truth to get RAG's actual score.

import "dotenv/config";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { BOOKING_SHEET_SCHEMA } from "../config/bookingSheetSchema.js";
import { generateQuestion } from "../config/fieldQuestions.js";
import { ragQuery } from "./ragQuery.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, "..", "..", "data", "processed", "rag_results.json");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runBatchRag() {
  const results = [];

  for (const field of BOOKING_SHEET_SCHEMA) {
    const question = generateQuestion(field);
    console.log(`[${field.id}/60] ${question}`);

    try {
      const result = await ragQuery(question, 5);
      results.push({
        fieldId: field.id,
        fieldName: field.field,
        expectedSourceDocument: field.sourceDocument,
        question,
        answer: result.answer,
        sourcesUsed: result.sources,
      });
    } catch (err) {
      // Don't let one failed question kill the whole batch — record the
      // failure and keep going, so we still get results for the other 59.
      console.error(`  Failed: ${err.message}`);
      results.push({
        fieldId: field.id,
        fieldName: field.field,
        expectedSourceDocument: field.sourceDocument,
        question,
        answer: null,
        error: err.message,
      });
    }

    await sleep(300); // small pause between calls, polite to the API
  }

  await writeFile(OUTPUT_PATH, JSON.stringify(results, null, 2));
  console.log(`\nDone. Saved ${results.length} results to ${OUTPUT_PATH}`);

  return results;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runBatchRag().catch((err) => {
    console.error("Batch run failed:", err.message);
    process.exit(1);
  });
}