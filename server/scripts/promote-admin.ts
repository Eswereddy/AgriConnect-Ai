// ==========================================
// PROMOTE A USER TO ADMIN (run out-of-band, never over HTTP)
// ==========================================
// Admin can't be self-assigned through /api/auth/register on purpose (see
// server/auth.ts). Once someone has registered a normal account, run this
// script against the server's own filesystem/database to grant them Admin:
//
//   npm run promote-admin -- someone@example.com
//
// This only works for whoever can already run commands on the machine the
// database file lives on, which is the point - promotion requires that
// level of access, not just a web request.

import { findUserByEmail, db, syncUsersWithPg } from "../db";
import { initPg, query, pgAvailable, closePg } from "../pg";

// With DATABASE_URL set (e.g. your Neon string) this edits the durable Postgres
// copy, so you can run it from your own laptop against the live database:
//   DATABASE_URL="postgresql://..." npm run promote-admin -- someone@example.com
const email = process.argv[2];

async function main() {
  if (!email) {
    console.error("Usage: npm run promote-admin -- <email>");
    process.exit(1);
  }
  if (process.env.DATABASE_URL) {
    await initPg();
    await syncUsersWithPg();
  }

  const user = findUserByEmail(email);
  if (!user) {
    console.error(`No account found for ${email}. Ask them to register first, then run this again.`);
    process.exit(1);
  }
  if (user.role === "Admin") {
    console.log(`${email} is already an Admin.`);
    process.exit(0);
  }

  db.prepare(`UPDATE users SET role = 'Admin' WHERE id = ?`).run(user.id);
  if (pgAvailable()) await query(`UPDATE app_users SET role = 'Admin' WHERE id = $1`, [user.id]);
  console.log(`Promoted ${email} (was "${user.role}") to Admin.`);
  await closePg();
}

main().catch((e) => { console.error(e); process.exit(1); });
