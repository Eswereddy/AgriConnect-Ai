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
