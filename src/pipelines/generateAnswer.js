// src/pipelines/generateAnswer.js
//
// Takes retrieved chunks + the original question, and asks Claude to
// answer USING ONLY that retrieved context — not its own general
// knowledge. This is critical for a legal/financial document: we want
// answers grounded in the actual source text, not the model's guesses.

import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { env } from "../config/env.js";

const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

export async function generateAnswer(question, chunks) {
  const context = chunks
    .map(
      (c, i) =>
        `[Source ${i + 1}: ${c.documentType}, Section ${c.sectionId}${c.subLabel ? "/" + c.subLabel : ""}]\n${c.text}`
    )
    .join("\n\n---\n\n");

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `You are answering questions about a commercial loan based ONLY on the provided source excerpts. If the answer isn't in the excerpts, say so clearly — do not guess or use outside knowledge.

SOURCE EXCERPTS:
${context}

QUESTION: ${question}

Answer concisely, and cite which Source number(s) you used.`,
      },
    ],
  });

  return response.content[0].text;
}