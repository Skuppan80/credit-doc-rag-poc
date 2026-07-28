// src/config/bookingSheetSchema.js
//
// WHY THIS FILE EXISTS:
// This is the target field list a commercial loan servicing system (e.g.
// ACBS) would need to "book" this loan. It's the shared goal both the
// vector RAG pipeline and the GraphRAG pipeline try to fill in.
//
// It's also our SCORING CHECKLIST: for each field, did the pipeline find
// the correct value, the wrong value, or correctly report "not found"?
// A field genuinely absent from the source documents (e.g. a blank
// routing number) should score as correctly "not found" — not as a
// failure — since hallucinating a value there would be worse than
// admitting it's missing.

export const BOOKING_SHEET_SCHEMA = [
  // --- Deal / Facility Identification ---
  { id: 1, category: "Deal Identification", field: "Facility ID / Loan Number", sourceDocument: "assigned internally, not in source docs" },
  { id: 2, category: "Deal Identification", field: "Facility Type", sourceDocument: "Loan Agreement" },
  { id: 3, category: "Deal Identification", field: "Agreement Date", sourceDocument: "Loan Agreement" },
  { id: 4, category: "Deal Identification", field: "Closing Date", sourceDocument: "Loan Agreement" },
  { id: 5, category: "Deal Identification", field: "Governing Law", sourceDocument: "Loan Agreement" },
  { id: 6, category: "Deal Identification", field: "Facility Amount", sourceDocument: "Loan Agreement" },

  // --- Borrower & Guarantor Info ---
  { id: 7, category: "Parties", field: "Borrower Legal Name", sourceDocument: "Loan Agreement" },
  { id: 8, category: "Parties", field: "Borrower Entity Type / State of Incorporation", sourceDocument: "Loan Agreement" },
  { id: 9, category: "Parties", field: "Borrower Address", sourceDocument: "Loan Agreement" },
  { id: 10, category: "Parties", field: "Guarantor Legal Name", sourceDocument: "Loan Agreement" },
  { id: 11, category: "Parties", field: "Guarantor Entity Type / State of Incorporation", sourceDocument: "Loan Agreement" },
  { id: 12, category: "Parties", field: "Guarantor Address", sourceDocument: "Loan Agreement" },
  { id: 13, category: "Parties", field: "Administrative Agent Name", sourceDocument: "Loan Agreement" },
  { id: 14, category: "Parties", field: "Lender Name", sourceDocument: "Loan Agreement" },

  // --- Loan Terms ---
  { id: 15, category: "Loan Terms", field: "Principal Amount", sourceDocument: "Loan Agreement" },
  { id: 16, category: "Loan Terms", field: "Interest Rate Type", sourceDocument: "Loan Agreement" },
  { id: 17, category: "Loan Terms", field: "Base Rate Margin", sourceDocument: "Loan Agreement" },
  { id: 18, category: "Loan Terms", field: "LIBOR Margin", sourceDocument: "Loan Agreement" },
  { id: 19, category: "Loan Terms", field: "Default Interest Rate", sourceDocument: "Loan Agreement" },
  { id: 20, category: "Loan Terms", field: "Term Loan Maturity Date", sourceDocument: "Loan Agreement" },
  { id: 21, category: "Loan Terms", field: "Interest Payment Frequency", sourceDocument: "Loan Agreement" },
  { id: 22, category: "Loan Terms", field: "Day Count Convention", sourceDocument: "Loan Agreement" },
  { id: 23, category: "Loan Terms", field: "Promissory Note Date", sourceDocument: "Promissory Note" },
  { id: 24, category: "Loan Terms", field: "Note Payee", sourceDocument: "Promissory Note" },
  { id: 25, category: "Loan Terms", field: "Note Governing Law", sourceDocument: "Promissory Note" },
  { id: 26, category: "Loan Terms", field: "Voluntary Prepayment Allowed", sourceDocument: "Loan Agreement" },

  // --- Payment / Amortization Schedule ---
  { id: 27, category: "Payment Schedule", field: "Scheduled Payment Frequency", sourceDocument: "Loan Agreement" },
  { id: 28, category: "Payment Schedule", field: "First Payment Date", sourceDocument: "Loan Agreement" },
  { id: 29, category: "Payment Schedule", field: "Mandatory Prepayment Triggers", sourceDocument: "Loan Agreement" },
  { id: 30, category: "Payment Schedule", field: "Application of Prepayments Order", sourceDocument: "Loan Agreement" },
  { id: 31, category: "Payment Schedule", field: "Voluntary Prepayment Notice Period", sourceDocument: "Loan Agreement" },
  { id: 32, category: "Payment Schedule", field: "Ratable Sharing Provision", sourceDocument: "Loan Agreement" },
  { id: 33, category: "Payment Schedule", field: "General Payment Terms (place/method)", sourceDocument: "Loan Agreement" },
  { id: 34, category: "Payment Schedule", field: "Default Interest Trigger", sourceDocument: "Loan Agreement" },

  // --- Fees & Disbursement ---
  { id: 35, category: "Fees & Disbursement", field: "Total Sources", sourceDocument: "Closing Statement" },
  { id: 36, category: "Fees & Disbursement", field: "Net Proceeds to Borrower", sourceDocument: "Closing Statement" },
  { id: 37, category: "Fees & Disbursement", field: "Closing Fee Amount", sourceDocument: "Closing Statement" },
  { id: 38, category: "Fees & Disbursement", field: "Administrative Agent Fee Amount", sourceDocument: "Closing Statement" },
  { id: 39, category: "Fees & Disbursement", field: "Legal & Documentation Expenses", sourceDocument: "Closing Statement" },
  { id: 40, category: "Fees & Disbursement", field: "Total Uses", sourceDocument: "Closing Statement" },
  { id: 41, category: "Fees & Disbursement", field: "Disbursement Method", sourceDocument: "Closing Statement" },
  { id: 42, category: "Fees & Disbursement", field: "Disbursement Account", sourceDocument: "Closing Statement" },

  // --- Collateral / Key Covenants ---
  { id: 43, category: "Collateral & Covenants", field: "Collateral Description", sourceDocument: "Loan Agreement" },
  { id: 44, category: "Collateral & Covenants", field: "Negative Covenant: Indebtedness Restrictions", sourceDocument: "Loan Agreement" },
  { id: 45, category: "Collateral & Covenants", field: "Negative Covenant: Liens Restrictions", sourceDocument: "Loan Agreement" },
  { id: 46, category: "Collateral & Covenants", field: "Negative Covenant: Restricted Payments", sourceDocument: "Loan Agreement" },
  { id: 47, category: "Collateral & Covenants", field: "Financial Covenant: Tangible Net Worth", sourceDocument: "Loan Agreement" },
  { id: 48, category: "Collateral & Covenants", field: "Reporting Covenant: Financial Statements Frequency", sourceDocument: "Loan Agreement" },
  { id: 49, category: "Collateral & Covenants", field: "Events of Default: Payment Default Trigger", sourceDocument: "Loan Agreement" },
  { id: 50, category: "Collateral & Covenants", field: "Events of Default: Covenant Breach Trigger", sourceDocument: "Loan Agreement" },

  // --- Servicing / Payment Mechanism ---
  { id: 51, category: "Servicing", field: "Auto-Debit Authorization", sourceDocument: "Auto Debit Form" },
  { id: 52, category: "Servicing", field: "Debited Account Holder", sourceDocument: "Auto Debit Form" },
  { id: 53, category: "Servicing", field: "Debited Account Bank Name", sourceDocument: "Auto Debit Form" },
  { id: 54, category: "Servicing", field: "Debited Account Routing Number", sourceDocument: "Auto Debit Form" },
  { id: 55, category: "Servicing", field: "Debited Account Number", sourceDocument: "Auto Debit Form" },
  { id: 56, category: "Servicing", field: "Auto-Debit Frequency", sourceDocument: "Auto Debit Form" },

  // --- Agent / Routing Info ---
  { id: 57, category: "Agent / Routing", field: "Administrative Agent Payment Address", sourceDocument: "Loan Agreement" },
  { id: 58, category: "Agent / Routing", field: "Collateral Agent Name", sourceDocument: "Loan Agreement" },
  { id: 59, category: "Agent / Routing", field: "Syndication Agent Name", sourceDocument: "Loan Agreement" },
  { id: 60, category: "Agent / Routing", field: "Documentation Agent Name", sourceDocument: "Loan Agreement" },
];