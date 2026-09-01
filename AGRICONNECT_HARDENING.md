# Production Hardening — What Changed

This document covers the auth, database, and monitoring layer added on top
of the existing AgriConnect AI codebase. **Nothing in the original 133 files
was rewritten.** Three files got small, additive, backward-compatible edits;
everything else is new.

## What was added

### 1. Real authentication (replaces the demo role-switcher)
- `server/auth.ts` — bcrypt password hashing, JWT sessions (httpOnly cookie
  + Bearer header support), `requireAuth` / `requireRole` middleware.
- `server/db.ts` — SQLite (`better-sqlite3`) tables for `users`,
  `audit_logs`, `error_logs`. File lives at `./data/agriconnect.db` (or
  `DATABASE_PATH`), survives restarts.
- New endpoints in `server.ts`: `POST /api/auth/register`,
  `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`,
  `GET /api/auth/users` (Admin only), `GET /api/auth/errors` (Admin only).
- `src/contexts/AuthContext.tsx`, `src/components/auth/LoginScreen.tsx`,
  `src/components/auth/AuthGate.tsx` — a real login/register screen that
  gates the whole app. Wired in from `src/main.tsx` only; `src/App.tsx` is
  untouched, so all 18 dashboards behave exactly as before once someone is
  signed in.
- **Admin can't self-register.** The role dropdown on the register form
  doesn't offer it, and the backend downgrades any `role: "Admin"` sent to
  `/api/auth/register` to `"Farmer"`. Promote a real admin with:
  ```
  npm run promote-admin -- someone@example.com
  ```
  (After they've registered a normal account first.) This runs directly
  against the database file, not over HTTP — promotion requires shell
  access to wherever the app is deployed.

### 2. Error monitoring
- `server/monitoring.ts` (backend) / `src/utils/monitoring.ts` (frontend) —
  Sentry if `SENTRY_DSN` / `VITE_SENTRY_DSN` is set **and** the optional
  `@sentry/node` / `@sentry/react` packages are installed; otherwise errors
  are written to the `error_logs` SQLite table and `./logs/*.log` files.
  Sentry is an `optionalDependency` — `npm install` succeeds with or
  without it, matching the existing Gemini-fallback pattern already used
  throughout this codebase.
- `src/components/ErrorBoundary.tsx` — catches React render crashes and
  reports them instead of showing a blank white screen.
- Every request is logged (method/path/status/latency) to `./logs/access.log`.
- Unhandled promise rejections and uncaught exceptions are captured, not
  just left to crash the process silently.

### 3. All 30 existing endpoints are now login-gated
One middleware, added once near the top of `server.ts` (the
`REQUIRE LOGIN FOR EVERY EXISTING API ROUTE` block), checks every `/api/*`
request except `/api/auth/*` and `/api/client-error`. It works with **zero**
edits to any of the 30 route definitions, and zero frontend changes: the 18
dashboards' existing `fetch("/api/...")` calls are same-origin, and
same-origin `fetch()` sends cookies by default per the Fetch spec — so the
httpOnly session cookie set at login is already sent on every one of those
existing calls without them needing `credentials: "include"`.

### 4. Login/register rate limiting
`server/rateLimiter.ts` — 10 login attempts / 15 min and 20 new accounts /
hour, per IP, via `express-rate-limit`. Closes the obvious
credential-stuffing gap on `/api/auth/login`.

### 5. Optional demo mode (bypass login entirely)
Set **both** `DEMO_MODE=true` (backend) and `VITE_DEMO_MODE=true` (frontend
build) to open the whole app back up — no login screen, every `/api/*`
endpoint accepts anonymous requests. This is for a short pitch/investor demo
where signup friction costs more than open access, not for real usage. Both
print a console warning when active as a reminder to turn them back off.

### 6. The files that *were* touched
| File | Change | Why |
|---|---|---|
| `server.ts` | Added imports + one auth-gate middleware + new routes + `app.use(errorHandlerMiddleware)`, all appended/inserted around the existing routes without editing their bodies | No existing route logic was edited, removed, or reordered |
| `src/main.tsx` | Wrapped `<App />` in `<ErrorBoundary><AuthGate>...` | Only way to turn on the login gate and crash reporting |
| `package.json` / `.env.example` / `.gitignore` | New deps, new env vars, ignore `data/` + `logs/` | Config only |

## Setting it up

1. `npm install`
2. Copy `.env.example` to `.env` and fill in:
   - `GEMINI_API_KEY` — your real key (you said you already have this).
   - `JWT_SECRET` — generate one: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
   - Leave `SENTRY_DSN` / `VITE_SENTRY_DSN` blank unless you have a Sentry project.
3. `npm run dev` — the database file and `./logs` directory are created
   automatically on first run.
4. Register your own account in the UI, then run
   `npm run promote-admin -- your@email.com` to make it an Admin.

## Verifying it actually works

Code review (mine, or reading it yourself) can confirm the logic is sound.
It cannot confirm your `GEMINI_API_KEY` is valid, that quota isn't
exhausted, or that a specific endpoint isn't quietly falling back — only
actually calling it can. Run:

```
npm run dev        # terminal 1
npm run verify      # terminal 2
```

`verify-setup.mjs` registers a real test account, confirms unauthenticated
requests get a 401 (proving the login gate above actually blocks
something), then calls all 30 existing endpoints plus the new auth/video-
status flow with valid payloads, and prints PASS/FAIL with the HTTP status
and a preview of each response.

**Important:** a PASS only means the endpoint responded successfully — it
can't tell from outside whether that response came from real Gemini or this
codebase's built-in fallback simulator (they return the same JSON shape on
purpose, so the UI never breaks either way). While `npm run verify` runs,
watch the `npm run dev` terminal: if you see `[Precision Engine Mode] Live
Gemini temporarily bypassed: <reason>`, that specific call fell back —
usually because `GEMINI_API_KEY` is still the placeholder, or you've hit a
quota limit. No such line printed = everything really hit Gemini.

## What's deliberately NOT done yet (and why)

- **The in-memory demo caches (`aiCache`, `tradeSessions`,
  `videoOperations`) are still in-memory.** They power live demo flows
  (trade negotiation chat, AI response caching) that reset on restart by
  design during a demo. Migrating them to SQLite is straightforward with
  the same `db.ts` pattern used for users, but touches more of the
  existing route bodies, so it's split out as separate follow-up work
  rather than bundled into this pass.
- **The WebSocket server** (trade negotiation chat) isn't gated by the new
  auth layer — it's a separate connection from the HTTP `/api/*` routes.
  Worth adding a handshake auth check if that flow needs the same
  protection.
- **Per-role restrictions** weren't added to the 30 endpoints — just "must
  be logged in," not "must be a Farmer to call `/api/diagnose`." Several of
  these are legitimately called by more than one role's dashboard, and
  mapping all 30 correctly without breaking a legitimate cross-role call
  would need a careful pass through each component. Worth doing once you've
  confirmed which endpoints are actually role-restricted in practice.

## One deployment gotcha worth knowing

`better-sqlite3` has a native binding compiled for a specific OS/CPU. As
long as `npm install` runs **on the machine (or in the build step) that will
actually run the server** — the normal flow on Render, Railway, Docker,
etc. — this is handled automatically. It only bites you if `node_modules`
gets copied from a different OS (e.g. built on a Mac laptop, then uploaded
as-is to a Linux host) instead of installed there directly.

