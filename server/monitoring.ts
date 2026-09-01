// ==========================================
// ERROR MONITORING & STRUCTURED LOGGING
// ==========================================
// Every unhandled server error used to just print to the console and vanish
// when the process restarted. This module gives errors somewhere durable to
// land, in three layers (each one a fallback for the one before it):
//
//   1. Sentry, IF a SENTRY_DSN is configured and @sentry/node is installed.
//   2. The SQLite error_logs table (server/db.ts) - always on, always cheap.
//   3. Local rotating log files under ./logs - a last-resort copy in case
//      the database itself is the thing that's unavailable.
//
// Sentry is intentionally NOT a hard dependency: this file loads it with a
// dynamic import guarded by try/catch, exactly like the rest of this
// codebase falls back gracefully when GEMINI_API_KEY / quota isn't
// available. `npm install` succeeds with or without Sentry installed.

import type { Express, Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { recordError } from "./db";

const LOG_DIR = process.env.LOG_DIR || path.join(process.cwd(), "logs");
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

let sentryEnabled = false;
let sentryModule: any = null;

function appendLog(file: string, line: string): void {
  try {
    fs.appendFileSync(path.join(LOG_DIR, file), line + "\n");
  } catch {
    // Best-effort only - a logging failure must never crash the request.
  }
}

/**
 * Records an error through every available layer. Safe to call from
 * anywhere (route handlers, process-level handlers, the Express error
 * middleware below) - it never throws.
 */
export function captureServerError(err: Error, context?: Record<string, any>): void {
  console.error("[error]", err.message, context || "");

  appendLog(
    "error.log",
    JSON.stringify({ ts: new Date().toISOString(), message: err.message, stack: err.stack, context })
  );

  try {
    recordError("server", err.message, err.stack, context);
  } catch {
    // DB unavailable - the file log above already has a copy.
  }

  if (sentryEnabled && sentryModule) {
    try {
      sentryModule.captureException(err, { extra: context });
    } catch {
      // Never let monitoring itself become a source of crashes.
    }
  }
}

/** Records a frontend error reported via POST /api/client-error. */
export function captureClientError(message: string, stack: string | undefined, context?: Record<string, any>): void {
  appendLog("client-error.log", JSON.stringify({ ts: new Date().toISOString(), message, stack, context }));
  try {
    recordError("client", message, stack, context);
  } catch {
    // DB unavailable - the file log above already has a copy.
  }
  if (sentryEnabled && sentryModule) {
    try {
      sentryModule.captureMessage(`[client] ${message}`, { extra: { stack, ...context } });
    } catch {
      // Never let monitoring itself become a source of crashes.
    }
  }
}

/**
 * Wires up request logging, process-level crash handlers, and (if
 * SENTRY_DSN is set and the package is installed) Sentry. Call this once,
 * early, before mounting routes.
 */
export function initMonitoring(app: Express): void {
  // Lightweight structured access log - method, path, status, latency.
  app.use((req: Request, res: Response, next: NextFunction) => {
    const startedAt = Date.now();
    res.on("finish", () => {
      appendLog(
        "access.log",
        JSON.stringify({
          ts: new Date().toISOString(),
          method: req.method,
          path: req.path,
          status: res.statusCode,
          durationMs: Date.now() - startedAt
        })
      );
    });
    next();
  });

  process.on("unhandledRejection", (reason: any) => {
    captureServerError(reason instanceof Error ? reason : new Error(String(reason)), { type: "unhandledRejection" });
  });
  process.on("uncaughtException", (err: Error) => {
    captureServerError(err, { type: "uncaughtException" });
  });

  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    console.log("[monitoring] SENTRY_DSN not set - errors are logged to ./logs and the local database instead.");
    return;
  }

  // Fire-and-forget: don't block server startup on this optional dependency.
  import("@sentry/node")
    .then((mod) => {
      sentryModule = mod;
      sentryModule.init({ dsn, tracesSampleRate: 0.1, environment: process.env.NODE_ENV || "development" });
      sentryEnabled = true;
      console.log("[monitoring] Sentry error monitoring active.");
    })
    .catch(() => {
      console.warn(
        "[monitoring] SENTRY_DSN is set but @sentry/node is not installed. " +
        "Run `npm install @sentry/node` to enable it - falling back to local logging for now."
      );
    });
}

/** Express error-handling middleware. Must be registered LAST, after every route. */
export function errorHandlerMiddleware(err: any, req: Request, res: Response, next: NextFunction): void {
  captureServerError(err instanceof Error ? err : new Error(String(err)), {
    method: req.method,
    path: req.path
  });
  if (res.headersSent) {
    next(err);
    return;
  }
  res.status(err?.status || 500).json({ error: "Something went wrong on our end. Our team has been notified." });
}
