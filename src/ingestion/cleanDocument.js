// src/ingestion/cleanDocument.js
//
// SEC EDGAR filings are wrapped in their own metadata tags
// (<DOCUMENT>, <TYPE>, <SEQUENCE>, <FILENAME>, <DESCRIPTION>, <TEXT>,
// <PAGE>) that are NOT part of the actual legal document. If we don't
// strip these, they'll pollute both the embeddings and the graph
// extraction later.
//
// Strategy: go line by line, and drop any line that is PURELY one of
// these known SEC tags. Everything else is left completely untouched —
// we are deliberately narrow here rather than using a broad regex that
// might accidentally delete real contract text.

const SEC_METADATA_TAGS = [
  "DOCUMENT",
  "TYPE",
  "SEQUENCE",
  "FILENAME",
  "DESCRIPTION",
  "TEXT",
  "PAGE",
];

// Matches a line that STARTS with one of the known tags, e.g.
// "<TYPE>EX-10.19" or "<PAGE>" or "</TEXT>" — case-insensitive.
const tagPattern = new RegExp(
  `^</?(${SEC_METADATA_TAGS.join("|")})>`,
  "i"
);

export function cleanDocument(rawText) {
  const lines = rawText.split("\n");

  const cleanedLines = lines.filter((line) => {
    const trimmed = line.trim();
    return !tagPattern.test(trimmed);
  });

  return cleanedLines.join("\n").trim();
}
// Everything from "EXHIBIT B" onward is boilerplate legal forms (Funding
// Notice, Term Loan Note, Assignment Agreement, etc.) — template documents,
// not core contract terms. We trim them off before chunking. Appendix A
// (commitment amounts) and Appendix B (party addresses) come BEFORE this
// point and are kept, since they contain real deal-specific information.
export function trimBoilerplateExhibits(text) {
  const match = text.match(/^\s*EXHIBIT B\s*$/m);
  if (!match) return text; // nothing to trim, leave as-is
  return text.slice(0, match.index).trim();
}