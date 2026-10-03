// ==========================================
// PERSISTENT DATABASE LAYER (SQLite via better-sqlite3)
// ==========================================
// This replaces "restart the server and everything resets" with a real,
// file-backed database for the data that actually needs to survive restarts:
// user accounts, login audit history, and error logs.
//
// Deliberately scoped: the existing in-memory demo caches in server.ts
// (aiCache, tradeSessions, videoOperations, etc.) power the live Gemini
// demo flows and are left untouched here to avoid destabilizing 30 working
// endpoints in one pass. Migrating those to persistent storage is a natural
// follow-up once this auth/monitoring foundation is in place.
//
// SQLite (a single file on disk) was chosen over requiring a separate
// Postgres/MySQL server so this runs out of the box in dev, on a single
// Render/Railway/VM instance, or anywhere else - no extra infra to stand up.
// If you outgrow a single file (multiple server instances, heavy concurrent
// writes), swap this module for a Postgres client; every function below has
// a narrow, single-purpose signature specifically so that swap only touches
// this one file.

import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { pgAvailable, query as pgQuery } from "./pg";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = process.env.DATABASE_PATH || path.join(DATA_DIR, "agriconnect.db");

export const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL"); // safe concurrent reads while a write is in flight

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    last_login_at TEXT
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    action TEXT NOT NULL,
    metadata TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS error_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source TEXT NOT NULL,
    message TEXT NOT NULL,
    stack TEXT,
    context TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
  CREATE INDEX IF NOT EXISTS idx_error_logs_created ON error_logs(created_at);
`);

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  created_at: string;
  last_login_at: string | null;
}

export function createUser(user: { id: string; name: string; email: string; passwordHash: string; role: string }): void {
  db.prepare(
    `INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)`
  ).run(user.id, user.name, user.email.toLowerCase(), user.passwordHash, user.role);
}

export function deleteLocalUser(id: string): void {
  db.prepare(`DELETE FROM users WHERE id = ?`).run(id);
}

export function findUserByEmail(email: string): UserRecord | undefined {
  return db.prepare(`SELECT * FROM users WHERE email = ?`).get(email.toLowerCase()) as UserRecord | undefined;
}

export function findUserById(id: string): UserRecord | undefined {
  return db.prepare(`SELECT * FROM users WHERE id = ?`).get(id) as UserRecord | undefined;
}

export function touchLastLogin(id: string): void {
  db.prepare(`UPDATE users SET last_login_at = datetime('now') WHERE id = ?`).run(id);
}

export function listUsers(limit = 50, offset = 0) {
  return db
    .prepare(`SELECT id, name, email, role, created_at, last_login_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?`)
    .all(limit, offset);
}

export function countUsers(): number {
  const row = db.prepare(`SELECT COUNT(*) as count FROM users`).get() as { count: number };
  return row.count;
}

export function recordAudit(userId: string | null, action: string, metadata?: Record<string, any>): void {
  db.prepare(`INSERT INTO audit_logs (user_id, action, metadata) VALUES (?, ?, ?)`).run(
    userId,
    action,
    metadata ? JSON.stringify(metadata) : null
  );
}

export function recordError(source: "server" | "client", message: string, stack?: string | null, context?: Record<string, any>): void {
  db.prepare(`INSERT INTO error_logs (source, message, stack, context) VALUES (?, ?, ?, ?)`).run(
    source,
    message,
    stack || null,
    context ? JSON.stringify(context) : null
  );
}

export function recentErrors(limit = 100) {
  return db.prepare(`SELECT * FROM error_logs ORDER BY created_at DESC LIMIT ?`).all(limit);
}

// ------------------------------------------------------------------
// DURABLE USER ACCOUNTS (Postgres)
// ------------------------------------------------------------------
// On Render's free plan the disk is wiped on every restart/deploy, so SQLite
// alone would lose all accounts. When Postgres (DATABASE_URL) is available it is
// the source of truth for users: accounts are written through to Postgres and
// loaded back into the local SQLite cache at startup. The synchronous lookup
// functions above keep working unchanged. Without Postgres, behaviour is as before.

/** Call once after initPg(): copies Postgres users into SQLite and pushes any local-only users up. */
export async function syncUsersWithPg(): Promise<void> {
  if (!pgAvailable()) return;
  try {
    const remote = await pgQuery<any>(`SELECT id, name, email, password_hash, role, created_at, last_login_at FROM app_users`);
    const upsert = db.prepare(
      `INSERT INTO users (id, name, email, password_hash, role, created_at, last_login_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET name=excluded.name, email=excluded.email, password_hash=excluded.password_hash,
         role=excluded.role, last_login_at=excluded.last_login_at`
    );
    db.transaction(() => {
      for (const u of remote) {
        // a stale local row with the same email but another id would violate UNIQUE(email)
        db.prepare(`DELETE FROM users WHERE email = ? AND id <> ?`).run(u.email, u.id);
        upsert.run(u.id, u.name, u.email, u.password_hash, u.role, u.created_at, u.last_login_at);
      }
    })();
    const known = new Set(remote.map((u) => u.id));
    const local = db.prepare(`SELECT * FROM users`).all() as UserRecord[];
    for (const u of local) if (!known.has(u.id)) await persistUser(u);
    console.log(`[db] User accounts synced with Postgres (${remote.length} loaded).`);
  } catch (err) {
    console.error("[db] Could not sync users with Postgres:", err);
  }
}

/** Writes a user to Postgres (no-op without Postgres). Throws on failure so registration can be rejected. */
export async function persistUser(u: { id: string; name: string; email: string; password_hash: string; role: string; created_at: string; last_login_at?: string | null }): Promise<void> {
  if (!pgAvailable()) return;
  await pgQuery(
    `INSERT INTO app_users (id, name, email, password_hash, role, created_at, last_login_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, email=EXCLUDED.email, password_hash=EXCLUDED.password_hash,
       role=EXCLUDED.role, last_login_at=EXCLUDED.last_login_at`,
    [u.id, u.name, u.email.toLowerCase(), u.password_hash, u.role, u.created_at, u.last_login_at ?? null]
  );
}

/** Best-effort: records the login time in Postgres. */
export async function persistLastLogin(id: string): Promise<void> {
  if (!pgAvailable()) return;
  try {
    const u = findUserById(id);
    await pgQuery(`UPDATE app_users SET last_login_at = $2 WHERE id = $1`, [id, u?.last_login_at ?? new Date().toISOString()]);
  } catch (err) {
    console.error("[db] persistLastLogin failed:", err);
  }
}
