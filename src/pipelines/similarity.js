// src/pipelines/similarity.js
//
// Cosine similarity measures how similar two vectors are, regardless of
// their magnitude — just their direction. Score ranges from -1 (opposite)
// to 1 (identical). For embeddings, higher = more similar meaning.

export function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}