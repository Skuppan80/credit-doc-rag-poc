// src/ingestion/loadAllDocuments.js
//
// Combines all 4 source documents into ONE unified list of chunks, each
// tagged with which document it came from. This tagging is what lets us
// later check "did the pipeline pull Net Proceeds from the Closing
// Statement, like it should?" — traceability back to source document type.
//
// The main Credit Agreement uses our section-based chunker (many chunks).
// The other 3 documents are short enough that each is treated as ONE
// single chunk — no further splitting needed.

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadDocument } from "./loadDocument.js";
import { cleanDocument, trimBoilerplateExhibits } from "./cleanDocument.js";
import { chunkDocument } from "./chunkDocument.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAW_DIR = path.join(__dirname, "..", "..", "data", "raw");

async function loadSimpleDocument(filename, documentType) {
  const text = await readFile(path.join(RAW_DIR, filename), "utf-8");
  return [
    {
      documentType,
      sectionId: "full",
      subLabel: null,
      text: text.trim(),
    },
  ];
}

export async function loadAllChunks() {
  // Main credit agreement: full pipeline (load, clean, trim, chunk by section)
  const rawAgreement = await loadDocument();
  const cleanedAgreement = trimBoilerplateExhibits(cleanDocument(rawAgreement));
  const agreementChunks = chunkDocument(cleanedAgreement).map((c) => ({
    ...c,
    documentType: "LoanAgreement",
  }));

  // The 3 short documents: one chunk each
  const promissoryNoteChunks = await loadSimpleDocument("promissory_note.txt", "PromissoryNote");
  const closingStatementChunks = await loadSimpleDocument("closing_statement.txt", "ClosingStatement");
  const autoDebitChunks = await loadSimpleDocument("auto_debit_form.txt", "AutoDebitForm");

  return [
    ...agreementChunks,
    ...promissoryNoteChunks,
    ...closingStatementChunks,
    ...autoDebitChunks,
  ];
}