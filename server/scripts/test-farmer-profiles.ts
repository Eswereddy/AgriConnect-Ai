// Tests for /api/farmer-profiles using a throwaway in-memory Postgres.   npm run test:farmers
import os from "os";
import path from "path";
import fs from "fs";
import assert from "node:assert/strict";

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "agri-farmers-"));
process.env.DATA_DIR = tmp;
process.env.DATABASE_PATH = path.join(tmp, "users.db");
process.env.JWT_SECRET = "test-secret-test-secret-test-secret-123456";
process.env.NODE_ENV = "test";

let pass = 0, fail = 0;
const check = async (name: string, fn: () => Promise<void>) => {
  try { await fn(); pass++; console.log("  PASS ", name); } catch (e: any) { fail++; console.log("  FAIL ", name, "-", e.message); }
};

(async () => {
  const express = (await import("express")).default;
  const cookieParser = (await import("cookie-parser")).default;
  const { registerUser, signToken } = await import("../auth");
  const { db } = await import("../db");
  const { initPg } = await import("../pg");
  const { farmerProfilesRouter } = await import("../farmerProfiles");
  const { HttpError } = await import("../marketplace");

  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use("/api/farmer-profiles", farmerProfilesRouter);
  app.use((err: any, _q: any, res: any, _n: any) => res.status(err instanceof HttpError ? err.status : 500).json({ error: err.message }));

  assert.ok(await initPg(), "Postgres failed to initialise");
  const srv = app.listen(0);
  const port = (srv.address() as any).port;
  const mk = async (name: string, role: string) => {
    const u = await registerUser({ name, email: `${name.toLowerCase().replace(/\s/g, "")}@t.test`, password: "password123", role });
    return signToken(u);
  };
  const farmerA = await mk("Farmer A", "Farmer"), farmerB = await mk("Farmer B", "Farmer"), buyer = await mk("Buyer One", "Buyer");
  const adminU = await registerUser({ name: "Admin User", email: "adminuser@t.test", password: "password123", role: "Farmer" });
  db.prepare(`UPDATE users SET role = 'Admin' WHERE id = ?`).run(adminU.id);
  const admin = signToken({ ...adminU, role: "Admin" });
  const api = async (t: string | null, method: string, path: string, body?: any) => {
    const r = await fetch(`http://127.0.0.1:${port}/api/farmer-profiles${path}`, {
      method, headers: { "Content-Type": "application/json", ...(t ? { Authorization: `Bearer ${t}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return { status: r.status, json: await r.json().catch(() => ({})) as any };
  };
  const good = { farmerName: "Test Farmer", district: "Anantapur", crop: "Groundnut", quantityQuintals: 10, expectedPricePerQuintal: 6500, sellingPreference: "mandi", contactPermission: true, collectedOn: "2026-10-01" };

  console.log("\nFarmer profiles");
  await check("login required (401) and buyers are refused (403)", async () => {
    assert.equal((await api(null, "GET", "/")).status, 401);
    assert.equal((await api(buyer, "GET", "/")).status, 403);
  });
  await check("admin loads the 30 sample farmers once (second load adds nothing)", async () => {
    const a = await api(admin, "POST", "/load-sample"); assert.equal(a.status, 200); assert.equal(a.json.inserted, 30);
    const b = await api(admin, "POST", "/load-sample"); assert.equal(b.json.inserted, 0);
    const list = await api(admin, "GET", "/"); assert.equal(list.json.stats.total, 30); assert.equal(list.json.stats.samples, 30);
    assert.ok(list.json.profiles.every((p: any) => p.isSample));
  });
  await check("a farmer cannot load samples or bulk import (403)", async () => {
    assert.equal((await api(farmerA, "POST", "/load-sample")).status, 403);
    assert.equal((await api(farmerA, "POST", "/bulk", { rows: [good] })).status, 403);
  });
  await check("a farmer's new profile is always pending and only they (and admin) can see it", async () => {
    const r = await api(farmerA, "POST", "/", { ...good, verifiedStatus: "verified", farmerCode: "HACK-1" });
    assert.equal(r.status, 201); assert.equal(r.json.verifiedStatus, "pending"); assert.match(r.json.farmerCode, /^FP-/);
    assert.equal((await api(farmerA, "GET", "/")).json.stats.total, 1);
    assert.equal((await api(farmerB, "GET", "/")).json.stats.total, 0);
    assert.equal((await api(admin, "GET", "/")).json.stats.total, 31);
  });
  await check("validation: missing crop, negative quantity, bad date are rejected (400)", async () => {
    assert.equal((await api(farmerA, "POST", "/", { ...good, crop: "" })).status, 400);
    assert.equal((await api(farmerA, "POST", "/", { ...good, quantityQuintals: -5 })).status, 400);
    assert.equal((await api(farmerA, "POST", "/", { ...good, collectedOn: "not-a-date" })).status, 400);
    assert.equal((await api(farmerA, "POST", "/", { ...good, sellingPreference: "teleport" })).status, 400);
  });
  let mine = "";
  await check("only admin verifies; a farmer edit sends it back to pending; other farmers get 404", async () => {
    mine = (await api(farmerA, "GET", "/")).json.profiles[0].id;
    assert.equal((await api(farmerA, "PATCH", `/${mine}`, { verifiedStatus: "verified" })).status, 403);
    const v = await api(admin, "PATCH", `/${mine}`, { verifiedStatus: "verified" });
    assert.equal(v.status, 200); assert.equal(v.json.verifiedStatus, "verified");
    const e = await api(farmerA, "PATCH", `/${mine}`, { quantityQuintals: 12 });
    assert.equal(e.json.quantityQuintals, 12); assert.equal(e.json.verifiedStatus, "pending");
    assert.equal((await api(farmerB, "PATCH", `/${mine}`, { quantityQuintals: 1 })).status, 404);
    assert.equal((await api(farmerB, "DELETE", `/${mine}`)).status, 404);
  });
  await check("CSV-style bulk import: good rows saved, bad/duplicate rows reported", async () => {
    const r = await api(admin, "POST", "/bulk", { rows: [
      { farmer_id: "REAL-001", farmer_name: "Real One", district: "Kurnool", crop: "Cotton", quantity_quintals: "20", expected_price_per_quintal: "7300",
        selling_preference: "Direct Buyer", contact_permission: "yes", date_collected: "05/10/2026", verified_status: "verified" },
      { farmer_id: "REAL-001", farmer_name: "Dup", district: "Kurnool", crop: "Cotton", quantity_quintals: "1", date_collected: "2026-10-05" },
      { farmer_id: "REAL-003", farmer_name: "Bad", district: "Kurnool", crop: "", quantity_quintals: "1", date_collected: "2026-10-05" },
    ] });
    assert.equal(r.json.inserted, 1); assert.equal(r.json.skipped.length, 2);
    const one = (await api(admin, "GET", "/?q=REAL-001")).json.profiles[0];
    assert.equal(one.sellingPreference, "direct_buyer"); assert.equal(one.contactPermission, true); assert.equal(one.collectedOn, "2026-10-05"); assert.equal(one.isSample, false);
  });
  await check("filters: district and status", async () => {
    const d = await api(admin, "GET", "/?district=kurnool"); assert.ok(d.json.profiles.length >= 4 && d.json.profiles.every((p: any) => p.district === "Kurnool"));
    const s = await api(admin, "GET", "/?status=verified"); assert.ok(s.json.profiles.every((p: any) => p.verifiedStatus === "verified"));
  });
  await check("admin removes only the sample rows; real rows stay", async () => {
    const r = await api(admin, "DELETE", "/samples"); assert.equal(r.json.removed, 30);
    const list = await api(admin, "GET", "/"); assert.equal(list.json.stats.total, 2); assert.equal(list.json.stats.samples, 0);
  });
  await check("a farmer can delete their own profile", async () => {
    assert.equal((await api(farmerA, "DELETE", `/${mine}`)).status, 200);
    assert.equal((await api(farmerA, "GET", "/")).json.stats.total, 0);
  });

  console.log(`\n${pass} passed, ${fail} failed`);
  srv.close(); process.exit(fail ? 1 : 0);
})();
