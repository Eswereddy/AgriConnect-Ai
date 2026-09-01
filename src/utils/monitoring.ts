// ==========================================
// FRONTEND ERROR MONITORING
// ==========================================
// Mirrors server/monitoring.ts: Sentry if VITE_SENTRY_DSN is configured and
// @sentry/react is installed, otherwise every captured error is POSTed to
// /api/client-error and lands in the same SQLite error_logs table + log
// files the backend already writes to. Either way, errors are captured
// somewhere instead of only appearing in a browser console nobody reads.

let sentryModule: any = null;
let sentryReady = false;

export function initClientMonitoring(): void {
  const dsn = (import.meta as any).env?.VITE_SENTRY_DSN;
  if (!dsn) return;

  import("@sentry/react")
    .then((mod) => {
      sentryModule = mod;
      sentryModule.init({ dsn, tracesSampleRate: 0.1 });
      sentryReady = true;
      console.log("[monitoring] Sentry (browser) active.");
    })
    .catch(() => {
      console.warn("[monitoring] VITE_SENTRY_DSN is set but @sentry/react is not installed. Falling back to server-side logging.");
    });
}

export function captureClientError(error: Error, context?: Record<string, any>): void {
  console.error("[client error]", error, context || "");

  if (sentryReady && sentryModule) {
    try {
      sentryModule.captureException(error, { extra: context });
    } catch {
      // fall through to the backend-logging path below regardless
    }
  }

  fetch("/api/client-error", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: error.message, stack: error.stack, context })
  }).catch(() => {
    // If even this fails (offline, server down), there's nowhere left to log to.
  });
}
