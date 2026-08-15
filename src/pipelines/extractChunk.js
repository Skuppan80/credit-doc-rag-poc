// src/pipelines/extractChunk.js
//
// Sends ONE chunk to Claude Haiku, asking it to extract entities and
// relationships matching OUR ontology (designed earlier, not auto-
// inferred). Most chunks won't have every field — that's expected and
// fine; a defined-term chunk won't mention parties, a covenant chunk
// won't mention fees. Empty arrays/nulls are a correct, honest result,
// not a failure.

import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { env } from "../config/env.js";

const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

const EXTRACTION_SCHEMA_INSTRUCTIONS = `Extract structured information from this loan document excerpt. Return ONLY valid JSON (no markdown fences, no other text), matching this exact shape:

{
  "parties": [{ "name": string, "role": "Company" | "Guarantor" | "Agent" | "Lender" | null }],
  "agreementFacts": {
    "facilityAmount": string | null,
    "agreementDate": string | null,
    "maturityDate": string | null,
    "governingLaw": string | null
  },
  "definedTerms": [{ "term": string, "definitionSummary": string, "referencesTerms": [string] }],
  "covenants": [{ "sectionId": string, "type": "affirmative" | "negative" | "financial", "summary": string }],
  "eventsOfDefault": [{ "triggerSummary": string, "relatedCovenantSectionId": string | null }],
  "financialFacts": { "amount": string, "label": string }[],
  "servicingFacts": { "accountHolder": string | null, "frequency": string | null, "method": string | null }
}

Only populate fields that are ACTUALLY present in this excerpt. Use null or empty arrays for anything not mentioned — do not guess or infer beyond what's written.`;

export async function extractFromChunk(chunk) {
  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 800,
    messages: [
      {
        role: "user",
        content: `${EXTRACTION_SCHEMA_INSTRUCTIONS}\n\nDOCUMENT TYPE: ${chunk.documentType}\nSECTION: ${chunk.sectionId}${chunk.subLabel ? "/" + chunk.subLabel : ""}\n\nEXCERPT:\n${chunk.text}`,
      },
    ],
  });

  let rawText = response.content[0].text.trim();

  // LLMs sometimes wrap JSON in markdown code fences despite instructions
  // not to. Strip them defensively rather than trusting the instruction
  // alone — this is a known, common quirk, not something we should assume
  // away.
  rawText = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/```\s*$/, "").trim();

  try {
    return JSON.parse(rawText);
  } catch (err) {
    // Don't let one malformed JSON response crash a whole batch run later —
    // surface it clearly so we can see which chunk caused it.
    console.error(`Failed to parse extraction JSON for ${chunk.sectionId}:`, rawText.slice(0, 200));
    return null;
  }
}