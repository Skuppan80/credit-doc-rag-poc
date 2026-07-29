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
  16: "Base Rate Loan or LIBOR Rate Loan (Company elects, per Section 2.6 Conversion/Continuation)",
  17: "4.50% (Base Rate Margin)",
  18: "6.00% (LIBOR Margin)",
  19: "Otherwise-applicable rate + 3.00% per annum, upon Event of Default (Section 2.7)",
  20: "April 25, 2008 (Term Loan Maturity Date)",
  21: "Monthly for Base Rate Loans (per 'Interest Payment Date' definition); tied to Interest Period end for LIBOR Rate Loans",
  22: "Actual/360 (360-day year, actual days elapsed)",
  23: "April __, 2005 (day left blank in source document)",
  24: "Goldman Sachs Specialty Lending Holdings, Inc.",
  25: "New York",
  26: "Yes — voluntary prepayment permitted per Note and Section 2.10",

  27: "Quarterly (consecutive quarterly installments)",
  28: "June 30, 2005 (first Installment Date, $500,000 per installment)",
  29: "Net Asset Sale Proceeds (above $250,000/year reinvestment threshold) and Insurance/Condemnation Proceeds (Section 2.11)",
  30: "Waterfall: (1) fees/expenses, (2) accrued interest at Current Rate, (3) accrued interest at Default Rate, (4) Prepayment/Yield Maintenance Premium, (5)... (Section 2.12)",
  31: "1 Business Day notice (Base Rate Loans); 3 Business Days notice (LIBOR Rate Loans) — both by 12:00pm NY time (Section 2.10)",
  32: "Yes — Ratable Sharing provision exists (Section 2.14)",
  33: "Dollars, same-day funds, due by 12:00pm New York City time, to Administrative Agent's Principal Office (Section 2.13)",
  34: "Occurrence of an Event of Default triggers +3% per annum over the otherwise-applicable rate (Section 2.7)",

  35: "$20,000,000.00",
  36: "$19,550,000.00",
  37: "$200,000.00",
  38: "$150,000.00",
  39: "$100,000.00",
  40: "$20,000,000.00",
  41: "Wire Transfer",
  42: "[Borrower's Depository Bank Account] — placeholder in synthetic document",

  43: NEEDS_VERIFICATION,
  44: "Yes — general prohibition on additional Indebtedness, subject to carve-outs (Section 6.1)",
  45: "Yes — Liens restricted (Section 6.2)",
  46: "Yes — 'Restricted Junior Payments' restricted (Section 6.5)",
  47: "Current Ratio financial covenant — e.g. >= 1.15:1.00 as of March 31, 2005, varies by quarter thereafter (Section 6.8(a)); NOT Tangible Net Worth",
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
  58: "Goldman Sachs Specialty Lending Group, L.P. (same entity holds Collateral Agent role)",
  59: "Goldman Sachs Specialty Lending Group, L.P. (same entity holds Syndication Agent role)",
  60: "Goldman Sachs Specialty Lending Group, L.P. (same entity holds Documentation Agent role)",
};