// src/pipelines/writeToGraph.js
//
// Takes ONE chunk's extraction result and writes it into Neo4j using
// MERGE (not CREATE) everywhere — MERGE means "create if it doesn't
// exist, otherwise reuse the existing node." This is what makes the
// pipeline IDEMPOTENT: running it twice on the same chunk never creates
// duplicate Party or DefinedTerm nodes, it just re-confirms the same facts.
//
// We use one fixed Agreement id since this demo covers a single deal.
// A multi-document production system would generate/look up a real
// Facility ID per deal instead.

const AGREEMENT_ID = "taleo-2005-term-loan";

function chunkId(chunk) {
  return `${chunk.documentType}:${chunk.sectionId}${chunk.subLabel ? "/" + chunk.subLabel : ""}`;
}

export async function writeExtractionToGraph(session, chunk, extraction) {
  if (!extraction) return; // failed extraction, nothing to write

  const sourceChunkId = chunkId(chunk);

  // Always ensure the root Agreement node exists.
  await session.run(`MERGE (a:Agreement {id: $id})`, { id: AGREEMENT_ID });

  // --- Parties ---
  for (const party of extraction.parties || []) {
    if (!party.name) continue;
    await session.run(
      `
      MATCH (a:Agreement {id: $agreementId})
      MERGE (p:Party {name: $name})
      MERGE (p)-[r:PARTY_TO]->(a)
      SET r.role = $role, r.sourceChunkId = $sourceChunkId
      `,
      { agreementId: AGREEMENT_ID, name: party.name, role: party.role, sourceChunkId }
    );
  }

  // --- Agreement-level facts (only set non-null values, never overwrite with null) ---
  const facts = extraction.agreementFacts || {};
  const factEntries = Object.entries(facts).filter(([, v]) => v !== null && v !== undefined);
  if (factEntries.length > 0) {
    const setClauses = factEntries.map(([key]) => `a.${key} = $${key}`).join(", ");
    const params = Object.fromEntries(factEntries);
    await session.run(
      `MATCH (a:Agreement {id: $agreementId}) SET ${setClauses}`,
      { agreementId: AGREEMENT_ID, ...params }
    );
  }

  // --- Defined Terms (and their cross-references to other terms) ---
  for (const dt of extraction.definedTerms || []) {
    if (!dt.term) continue;
    await session.run(
      `
      MERGE (t:DefinedTerm {term: $term})
      SET t.definitionSummary = $summary, t.sourceChunkId = $sourceChunkId
      `,
      { term: dt.term, summary: dt.definitionSummary, sourceChunkId }
    );
    for (const refTerm of dt.referencesTerms || []) {
      await session.run(
        `
        MATCH (t:DefinedTerm {term: $term})
        MERGE (ref:DefinedTerm {term: $refTerm})
        MERGE (t)-[:REFERENCES]->(ref)
        `,
        { term: dt.term, refTerm }
      );
    }
  }

  // --- Covenants ---
  for (const cov of extraction.covenants || []) {
    if (!cov.sectionId) continue;
    await session.run(
      `
      MATCH (a:Agreement {id: $agreementId})
      MERGE (c:Covenant {sectionId: $sectionId})
      SET c.type = $type, c.summary = $summary, c.sourceChunkId = $sourceChunkId
      MERGE (c)-[:PART_OF]->(a)
      `,
      { agreementId: AGREEMENT_ID, sectionId: cov.sectionId, type: cov.type, summary: cov.summary, sourceChunkId }
    );
  }

  // --- Events of Default ---
  for (const [i, eod] of (extraction.eventsOfDefault || []).entries()) {
    const eodId = `${sourceChunkId}-eod-${i}`;
    await session.run(
      `
      MATCH (a:Agreement {id: $agreementId})
      MERGE (e:EventOfDefault {id: $eodId})
      SET e.triggerSummary = $trigger, e.sourceChunkId = $sourceChunkId
      MERGE (e)-[:PART_OF]->(a)
      `,
      { agreementId: AGREEMENT_ID, eodId, trigger: eod.triggerSummary, sourceChunkId }
    );
    if (eod.relatedCovenantSectionId) {
      await session.run(
        `
        MATCH (e:EventOfDefault {id: $eodId})
        MATCH (c:Covenant {sectionId: $sectionId})
        MERGE (e)-[:TRIGGERED_BY]->(c)
        `,
        { eodId, sectionId: eod.relatedCovenantSectionId }
      );
    }
  }

  // --- Financial facts (Closing Statement line items) ---
  if ((extraction.financialFacts || []).length > 0) {
    await session.run(`MERGE (cs:ClosingStatement {id: $id})`, { id: "taleo-2005-closing-statement" });
    for (const fact of extraction.financialFacts) {
      await session.run(
        `
        MATCH (cs:ClosingStatement {id: $csId})
        MERGE (f:FinancialLineItem {label: $label, csId: $csId})
        SET f.amount = $amount, f.sourceChunkId = $sourceChunkId
        MERGE (f)-[:PART_OF]->(cs)
        `,
        { csId: "taleo-2005-closing-statement", label: fact.label, amount: fact.amount, sourceChunkId }
      );
    }
  }

  // --- Servicing facts (Auto Debit Form) ---
  const servicing = extraction.servicingFacts || {};
  const servicingEntries = Object.entries(servicing).filter(([, v]) => v !== null && v !== undefined);
  if (servicingEntries.length > 0) {
    const setClauses = servicingEntries.map(([key]) => `f.${key} = $${key}`).join(", ");
    const params = Object.fromEntries(servicingEntries);
    await session.run(
      `MERGE (f:AutoDebitForm {id: $id}) SET ${setClauses}, f.sourceChunkId = $sourceChunkId`,
      { id: "taleo-2005-auto-debit", ...params, sourceChunkId }
    );
  }
}