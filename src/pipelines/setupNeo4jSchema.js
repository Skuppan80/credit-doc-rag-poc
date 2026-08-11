// src/pipelines/setupNeo4jSchema.js
//
// Creates uniqueness constraints for each node type in our ontology.
// This is Neo4j's closest equivalent to a relational schema — it doesn't
// enforce a rigid structure the way SQL tables do, but it DOES guarantee
// no two nodes of the same type can share an identifying property (e.g.
// two Agreement nodes with the same id), and it auto-creates an index
// for fast lookups.
//
// "IF NOT EXISTS" makes this script idempotent — safe to run multiple
// times without erroring if the constraints already exist.

import "dotenv/config";
import neo4j from "neo4j-driver";
import { env } from "../config/env.js";

const driver = neo4j.driver(
  env.NEO4J_URI,
  neo4j.auth.basic(env.NEO4J_USERNAME, env.NEO4J_PASSWORD)
);

const CONSTRAINTS = [
  "CREATE CONSTRAINT agreement_id IF NOT EXISTS FOR (a:Agreement) REQUIRE a.id IS UNIQUE",
  "CREATE CONSTRAINT party_name IF NOT EXISTS FOR (p:Party) REQUIRE p.name IS UNIQUE",
  "CREATE CONSTRAINT promissory_note_id IF NOT EXISTS FOR (n:PromissoryNote) REQUIRE n.id IS UNIQUE",
  "CREATE CONSTRAINT closing_statement_id IF NOT EXISTS FOR (c:ClosingStatement) REQUIRE c.id IS UNIQUE",
  "CREATE CONSTRAINT auto_debit_form_id IF NOT EXISTS FOR (f:AutoDebitForm) REQUIRE f.id IS UNIQUE",
  "CREATE CONSTRAINT defined_term_name IF NOT EXISTS FOR (t:DefinedTerm) REQUIRE t.term IS UNIQUE",
  "CREATE CONSTRAINT section_id IF NOT EXISTS FOR (s:Section) REQUIRE s.sectionId IS UNIQUE",
  "CREATE CONSTRAINT chunk_id IF NOT EXISTS FOR (c:Chunk) REQUIRE c.chunkId IS UNIQUE",
];

async function setupSchema() {
  const session = driver.session();
  try {
    for (const constraint of CONSTRAINTS) {
      await session.run(constraint);
      console.log("✅", constraint.split(" FOR ")[0]);
    }

    const result = await session.run("SHOW CONSTRAINTS");
    console.log(`\nTotal constraints in database: ${result.records.length}`);
  } finally {
    await session.close();
    await driver.close();
  }
}

setupSchema().catch((err) => {
  console.error("Schema setup failed:", err.message);
  process.exit(1);
});