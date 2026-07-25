// src/routes/health.js
//
// A health check endpoint is standard practice for any backend service —
// it's what load balancers, uptime monitors, and deployment tools poll to
// confirm the service is alive. It intentionally returns almost no
// information (no internal details) to avoid leaking anything to the
// public internet.

import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});