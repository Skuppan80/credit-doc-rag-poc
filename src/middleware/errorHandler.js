// src/middleware/errorHandler.js
//
// WHY THIS FILE EXISTS:
// Without centralized error handling, every route has to remember to
// try/catch and format errors consistently — and it's easy to accidentally
// leak internal details (stack traces, file paths, library names) to the
// client, which is an information-disclosure risk.
//
// This middleware is the ONE place that decides what an error response
// looks like to the outside world.
//
// Express recognizes this as an error handler specifically because it
// takes FOUR parameters (err, req, res, next) — that's a strict Express
// convention, not a stylistic choice. Three-parameter functions are treated
// as normal middleware/routes instead.

import { env } from "../config/env.js";

export function errorHandler(err, req, res, next) {
  // Always log the full error server-side for debugging.
  console.error("Unhandled error:", err);

  const statusCode = err.statusCode || 500;

  // In production, never expose internal error details to the client.
  // In development, showing the real message helps you debug faster.
  const responseBody = {
    error: {
      message:
        env.NODE_ENV === "production" && statusCode === 500
          ? "An internal error occurred."
          : err.message,
    },
  };

  res.status(statusCode).json(responseBody);
}

// A small helper so route code can throw errors with an explicit
// HTTP status attached, e.g.: throw new HttpError(400, "bad input")
export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}