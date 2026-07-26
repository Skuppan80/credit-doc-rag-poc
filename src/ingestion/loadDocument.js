// src/ingestion/loadDocument.js
//
// Single responsibility: read the raw source document from disk and
// return its text content. Nothing else. Chunking, cleaning, and
// processing all happen in separate files — this one just loads.

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Resolve the path relative to this file, so it works no matter
// what directory you run the app from.
const DOCUMENT_PATH = path.join(
  __dirname,
  "..",
  "..",
  "data",
  "raw",
  "credit_agreement.txt"
);

export async function loadDocument() {
  const text = await readFile(DOCUMENT_PATH, "utf-8");
  return text;
}