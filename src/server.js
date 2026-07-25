// src/server.js
//
// Application entry point. Responsibilities kept deliberately narrow here:
// wire up middleware and routes, then start listening. Actual logic lives
// in src/routes/, src/pipelines/, etc. — this file should stay readable
// as a "table of contents" for the whole app.

import express from "express";
import helmet from "helmet";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { env } from "./config/env.js";
import { healthRouter } from "./routes/health.js";
import { errorHandler } from "./middleware/errorHandler.js";

// __dirname doesn't exist by default in ES Modules (it's a CommonJS thing) —
// this recreates it, since we need the absolute path to this file's folder.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// helmet() sets a range of protective HTTP response headers automatically —
// e.g. disables the "X-Powered-By: Express" header (don't advertise what
// server software you're running to anyone probing it).
app.use(helmet());

// CORS: default-deny allow-list. Only origins explicitly listed here can
// make cross-origin requests to this API. Since this server also serves
// the frontend itself (see static files below), same-origin requests work
// regardless — this only matters for a separate frontend dev server later.
const allowedOrigins =
  env.NODE_ENV === "development"
    ? ["http://localhost:5173", "http://localhost:3000"]
    : []; // production: same-origin only

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

// Limit request body size to prevent large-payload denial-of-service.
app.use(express.json({ limit: "1mb" }));

// --- Routes ---
app.use("/api", healthRouter);

// Serve the frontend as static files from public/
app.use(express.static(path.join(__dirname, "..", "public")));

// Error handler MUST be registered last, after all routes —
// Express only calls it when something earlier throws or calls next(err).
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Server listening on http://localhost:${env.PORT} [${env.NODE_ENV}]`);
});