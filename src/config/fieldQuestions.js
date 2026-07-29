// src/config/fieldQuestions.js
//
// WHY THIS FILE EXISTS:
// Converts each of the 60 booking sheet fields into an actual question we
// can send through the RAG/GraphRAG pipelines. Most fields translate
// cleanly with a simple template ("What is the X?"), but some (especially
// Yes/No-style fields like covenant restrictions) read awkwardly that way
// and need a hand-written override — otherwise we'd risk the PIPELINE
// looking bad when really the QUESTION was just poorly phrased.

// Manual overrides: field id -> better-phrased question.
// Only fields where the auto-template would read awkwardly are listed here.
const OVERRIDES = {
  16: "What type of interest rate applies to this loan (Base Rate or LIBOR)?",
  26: "Is voluntary prepayment allowed under this loan?",
  29: "What are the mandatory prepayment triggers?",
  30: "In what order are prepayments applied?",
  32: "Does a ratable sharing provision apply among lenders?",
  33: "What are the general payment terms (place and method)?",
  44: "Does the agreement restrict the Company from incurring additional indebtedness?",
  45: "Does the agreement restrict the Company from creating liens?",
  46: "Does the agreement restrict the Company from making restricted junior payments?",
  47: "What financial covenant ratio must the Company maintain, and what is the minimum threshold?",
  48: "How often must the Company deliver financial statements?",
  49: "What triggers a Payment Default event?",
  50: "What triggers a covenant-breach default?",
  51: "Is auto-debit payment authorization in place for this loan?",
};

function autoGenerate(fieldName) {
  return `What is the ${fieldName}?`;
}

export function generateQuestion(field) {
  return OVERRIDES[field.id] || autoGenerate(field.field);
}