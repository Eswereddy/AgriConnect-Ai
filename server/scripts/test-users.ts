// Checks accounts survive a "restart" (local SQLite wiped) when Postgres is present.
import assert from "node:assert";
process.env.DATA_DIR = process.env.DATA_DIR || "/tmp/agri-test-users";
import { initPg, query } from "../pg";
import { db, findUserByEmail, syncUsersWithPg } from "../db";
import { registerUser, authenticateUser } from "../auth";

(async () => {
  await initPg();
  const u = await registerUser({ name: "Test Farmer", email: "T@Example.com", password: "password123", role: "Farmer" } as any);
  assert.equal((await query(`SELECT count(*) c FROM app_users`))[0].c, 1);
  db.exec("DELETE FROM users");                       // simulate Render wiping the disk
  assert.equal(findUserByEmail("t@example.com"), undefined);
  await syncUsersWithPg();                             // simulate startup
  assert.equal(findUserByEmail("t@example.com")?.id, u.id);
  const again = await authenticateUser("t@example.com", "password123");
  assert.equal(again.id, u.id);
  await assert.rejects(authenticateUser("t@example.com", "wrong-password"));
  await assert.rejects(registerUser({ name: "Dup", email: "t@example.com", password: "password123", role: "Farmer" } as any));
  console.log("users persistence: OK");
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
