// src/ingestion/chunkDocument.js
//
// Splits the cleaned document into chunks, using section boundaries
// (e.g. "1.1", "6.2") as the primary split point — these are natural,
// meaningful units in a legal contract.
//
// SPECIAL CASE: Section 1.1 (Definitions) is ~190x larger than a typical
// section (~81,000 characters vs ~2,000) because it bundles hundreds of
// individual defined terms under one header. If left as one chunk, it
// would be far too large for embeddings/LLM calls to handle well. So we
// detect this oversized case and sub-split it by individual defined term
// instead (each one starts with a quotation mark, e.g. "GAAP" means...).

const SECTION_PATTERN = /^\s*(\d+\.\d+)\.\s+(.+)$/gm;
const DEFINED_TERM_PATTERN = /^\s*"([A-Z][A-Z0-9 ,.\-'&\/]*)"/gm;

// Anything bigger than this gets sub-split by defined term instead of
// kept as one chunk. Chosen well above a normal section's size (~1-5k
// chars) but well below Section 1.1's actual size (~81k chars).
const OVERSIZE_THRESHOLD = 8000;

function splitByPattern(text, pattern) {
  const matches = [...text.matchAll(pattern)];
  const pieces = [];

  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    const end = matches[i + 1] ? matches[i + 1].index : text.length;
    pieces.push({
      label: matches[i][1],
      content: text.slice(start, end).trim(),
    });
  }

  return pieces;
}

export function chunkDocument(cleanedText) {
  const allMatches = [...cleanedText.matchAll(SECTION_PATTERN)];

  // Drop Table-of-Contents duplicates (their titles contain dotted leaders)
  const realMatches = allMatches.filter((m) => !m[2].includes("...."));

  const sections = splitByPattern(cleanedText, SECTION_PATTERN);
  const realLabels = new Set(realMatches.map((m) => m[1]));

  const chunks = [];
  // TOC and body share the same section labels (e.g. "1.1" appears twice) —
  // we only want each label's 2nd occurrence (the real body content).
  let labelCount = {};

  for (const section of sections) {
    labelCount[section.label] = (labelCount[section.label] || 0) + 1;
    const isRealOccurrence = labelCount[section.label] === 2; // 1st = TOC, 2nd = body
    if (!realLabels.has(section.label) || !isRealOccurrence) continue;

    if (section.label === "1.1" && section.content.length > OVERSIZE_THRESHOLD) {
      // Sub-split this oversized section by individual defined term.
      const terms = splitByPattern(section.content, DEFINED_TERM_PATTERN);
      for (const term of terms) {
        chunks.push({
          sectionId: section.label,
          subLabel: term.label,
          text: term.content,
        });
      }
    } else {
      chunks.push({
        sectionId: section.label,
        subLabel: null,
        text: section.content,
      });
    }
  }

  return chunks;
}