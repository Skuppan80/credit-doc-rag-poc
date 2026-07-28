// src/pipelines/retrieve.js
//
// Given a question, this:
//   1. Embeds the question using the SAME model used for chunks
//      (comparing vectors from different models would be meaningless)
//   2. Compares it against every stored chunk embedding
//   3. Returns the top-K most similar chunks
//
// This is the core of "vector RAG" — retrieval based purely on semantic
// similarity, no structural/relational awareness of the documents.

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";

import { env } from "../config/env.js";
import { cosineSimilarity } from "./similarity.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EMBEDDINGS_PATH = path.join(__dirname, "..", "..", "data", "processed", "embeddings.json");

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

let cachedChunks = null;

async function loadEmbeddings() {
  // Cache in memory so repeated queries in the same run don't re-read
  // the 13.5MB file from disk every time.
  if (!cachedChunks) {
    const raw = await readFile(EMBEDDINGS_PATH, "utf-8");
    cachedChunks = JSON.parse(raw);
  }
  return cachedChunks;
}

export async function retrieveTopChunks(question, topK = 5) {
  const chunks = await loadEmbeddings();

  const queryResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: question,
  });
  const queryEmbedding = queryResponse.data[0].embedding;

  const scored = chunks.map((chunk) => ({
    ...chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK);
}