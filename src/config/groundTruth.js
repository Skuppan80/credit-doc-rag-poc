// src/config/groundTruth.js
//
// WHY THIS FILE EXISTS:
// This is the ANSWER KEY for scoring RAG and GraphRAG. Every value here
// MUST be something confirmed by actually reading the source documents —
// never a guess. A wrong ground truth value would silently corrupt every
// score we compute against it.
//
// Fields we have NOT yet confirmed from real document text are marked
// NEEDS_VERIFICATION rather than filled with a guess. These need to be
// checked against the actual files before scoring is meaningful.

export const NEEDS_VERIFICATION = "NEEDS_VERIFICATION";

export const GROUND_TRUTH = {
  1: "NOT ASSIGNED — internal ID, not in source docs",
  2: "Term Loan",
  3: "April 25, 2005",
  4: "April 25, 2005",
  5: "New York (internal laws, without regard to conflicts of laws principles)",
  6: "$20,000,000.00",

  7: "Taleo Corporation",
  8: "Delaware corporation",
  9: "575 Market Street, 8th Floor, San Francisco, CA 94105",
  10: "Recruitforce.com, Inc.",
  11: "California corporation",
  12: "444 Castro Street, Suite 302, Mountain View, CA 94041",
  13: "Goldman Sachs Specialty Lending Group, L.P.",
  14: "Goldman Sachs Specialty Lending Holdings, Inc.",

  15: "$20,000,000.00",
  16: NEEDS_VERIFICATION,
  17: "4.50% (Base Rate Margin)",
  18: "6.00% (LIBOR Margin)",
  19: NEEDS_VERIFICATION,
  20: NEEDS_VERIFICATION,
  21: NEEDS_VERIFICATION,
  22: NEEDS_VERIFICATION,
  23: "April __, 2005 (day left blank in source document)",
  24: "Goldman Sachs Specialty Lending Holdings, Inc.",
  25: "New York",
  26: "Yes — voluntary prepayment permitted per Note and Section 2.10",

  27: NEEDS_VERIFICATION,
  28: NEEDS_VERIFICATION,
  29: NEEDS_VERIFICATION,
  30: NEEDS_VERIFICATION,
  31: NEEDS_VERIFICATION,
  32: NEEDS_VERIFICATION,
  33: NEEDS_VERIFICATION,
  34: NEEDS_VERIFICATION,

  35: "$20,000,000.00",
  36: "$19,550,000.00",
  37: "$200,000.00",
  38: "$150,000.00",
  39: "$100,000.00",
  40: "$20,000,000.00",
  41: "Wire Transfer",
  42: "[Borrower's Depository Bank Account] — placeholder in synthetic document",

  43: NEEDS_VERIFICATION,
  44: NEEDS_VERIFICATION,
  45: NEEDS_VERIFICATION,
  46: NEEDS_VERIFICATION,
  47: NEEDS_VERIFICATION,
  48: NEEDS_VERIFICATION,
  49: NEEDS_VERIFICATION,
  50: NEEDS_VERIFICATION,

  51: "Yes — recurring monthly authorization",
  52: "Taleo Corporation",
  53: "[Borrower's Depository Bank] — placeholder, not a real value in source",
  54: "[9-digit ABA routing number] — placeholder, not a real value in source",
  55: "[Borrower account number] — placeholder, not a real value in source",
  56: "Monthly",

  57: NEEDS_VERIFICATION,
  58: NEEDS_VERIFICATION,
  59: NEEDS_VERIFICATION,
  60: NEEDS_VERIFICATION,
};