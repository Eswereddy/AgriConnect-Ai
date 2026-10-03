// ==========================================
// POSTGRES CONNECTION
// ==========================================
// Production: set DATABASE_URL (e.g. Render/Railway/Neon/Supabase connection string).
// Development: if DATABASE_URL is unset and NODE_ENV !== "production", an
// in-memory Postgres (pg-mem) is used so `npm run dev` works with zero setup.
// That data is lost on restart, and pg-mem does NOT implement ROLLBACK - a
// warning is logged so nobody mistakes it for the real thing.

import pg from "pg";
import { SCHEMA_STATEMENTS } from "./schema";

// NUMERIC / BIGINT come back as strings by default. Money is BIGINT paise and
// stays well below 2^53, so plain numbers are safe and far less error-prone.
pg.types.setTypeParser(20, (v) => Number(v));      // BIGINT
pg.types.setTypeParser(1700, (v) => Number(v));    // NUMERIC
pg.types.setTypeParser(1082, (v) => v);              // DATE -> 'YYYY-MM-DD' (no timezone shifting)

let pool: pg.Pool | null = null;
let usingMemory = false;

export function pgAvailable(): boolean {
  return pool !== null;
}

export function pgIsInMemory(): boolean {
  return usingMemory;
}

export async function initPg(): Promise<boolean> {
  if (pool) return true;

  const url = process.env.DATABASE_URL;
  try {
    if (url) {
      pool = new pg.Pool({
        connectionString: url,
        max: 10,
        // Most managed Postgres hosts require TLS. Set PGSSL=disable for a local server.
        ssl: process.env.PGSSL === "disable" ? false : { rejectUnauthorized: false },
      });
      await pool.query("SELECT 1");
    } else if (process.env.NODE_ENV !== "production") {
      const { newDb } = await import("pg-mem");
      const mem = newDb();
      const adapter = mem.adapters.createPg();
      pool = new adapter.Pool() as unknown as pg.Pool;
      usingMemory = true;
      console.warn(
        "[pg] DATABASE_URL is not set - using an IN-MEMORY Postgres for development. " +
        "Marketplace data will be lost on restart, and pg-mem does not honour ROLLBACK, so use a real " +
        "Postgres (set DATABASE_URL) for anything beyond quick UI work."
      );
    } else {
      console.error("[pg] DATABASE_URL is required in production. Marketplace endpoints are disabled.");
      return false;
    }

    for (const stmt of SCHEMA_STATEMENTS) {
      await pool.query(stmt);
    }
    console.log(`[pg] Marketplace schema ready (${usingMemory ? "in-memory" : "postgres"}).`);
    return true;
  } catch (err) {
    console.error("[pg] Failed to initialise Postgres:", err);
    pool = null;
    return false;
  }
}

export async function query<T = any>(text: string, params: any[] = []): Promise<T[]> {
  if (!pool) throw new Error("Postgres is not initialised");
  const res = await pool.query(text, params);
  return res.rows as T[];
}

/** Runs fn inside BEGIN/COMMIT; rolls back and rethrows on any error. */
export async function withTransaction<T>(fn: (q: <R = any>(text: string, params?: any[]) => Promise<R[]>) => Promise<T>): Promise<T> {
  if (!pool) throw new Error("Postgres is not initialised");
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(async (text, params = []) => (await client.query(text, params)).rows);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    try { await client.query("ROLLBACK"); } catch { /* ignore */ }
    throw err;
  } finally {
    client.release();
  }
}

export async function closePg(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
