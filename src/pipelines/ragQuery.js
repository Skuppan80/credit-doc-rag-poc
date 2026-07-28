// src/pipelines/ragQuery.js
//
// The complete vector RAG pipeline in one function:
// question -> retrieve top chunks -> generate answer from them.
// This is what the API route (later) will actually call.

import { retrieveTopChunks } from "./retrieve.js";
import { generateAnswer } from "./generateAnswer.js";

export async function ragQuery(question, topK = 5) {
  const chunks = await retrieveTopChunks(question, topK);
  const answer = await generateAnswer(question, chunks);

  return {
    question,
    answer,
    sources: chunks.map((c) => ({
      documentType: c.documentType,
      sectionId: c.sectionId,
      subLabel: c.subLabel,
      score: c.score,
    })),
  };
}