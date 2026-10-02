// End-to-end test for the Postgres marketplace (/api/market/*).
//   npm run test:market
//
// Runs against an in-memory Postgres (pg-mem) and a throwaway SQLite users file,
// so it never touches real data. Set DATABASE_URL to run it against a real
// Postgres instead (use a scratch database!).

import os from "os";
import path from "path";
import fs from "fs";
import assert from "assert/strict";

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "agri-test-"));
process.env.DATA_DIR = tmp;
process.env.DATABASE_PATH = path.join(tmp, "users.db");
process.env.JWT_SECRET = "test-secret-test-secret-test-secret-123456";
process.env.NODE_ENV = "test";

let passed = 0;
let failed = 0;
async function check(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    passed++;
    console.log(`  PASS  ${name}`);
  } catch (e: any) {
    failed++;
    console.log(`  FAIL  ${name}\n        ${e?.message ?? e}`);
  }
}

async function main() {
  const express = (await import("express")).default;
  const cookieParser = (await import("cookie-parser")).default;
  const { registerUser, signToken } = await import("../auth");
  const { db } = await import("../db");
  const { initPg, closePg } = await import("../pg");
  const { marketRouter } = await import("../marketplace");

  assert.ok(await initPg(), "Postgres failed to initialise");

  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use("/api/market", marketRouter);
  const server = app.listen(0);
  const port = (server.address() as any).port;
  const base = `http://127.0.0.1:${port}/api/market`;

  const mk = async (name: string, role: string) => {
    const u = await registerUser({ name, email: `${name.toLowerCase().replace(/\s/g, "")}@t.test`, password: "password123", role });
    return { ...u, token: signToken(u) };
  };
  const api = async (token: string | null, method: string, url: string, body?: any) => {
    const r = await fetch(base + url, {
      method,
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    let json: any = null;
    try { json = await r.json(); } catch { /* empty */ }
    return { status: r.status, json };
  };

  const farmer = await mk("Ravi Farmer", "Farmer");
  const farmer2 = await mk("Other Farmer", "Farmer");
  const buyerA = await mk("Buyer A", "Buyer");
  const buyerB = await mk("Buyer B", "Buyer");
  const carrier = await mk("Fast Carrier", "Logistics Provider");
  const wh = await mk("Warehouse Op", "Warehouse Operator");
  const adminU = await mk("Admin User", "Farmer");
  db.prepare(`UPDATE users SET role = 'Admin' WHERE id = ?`).run(adminU.id);
  const admin = { ...adminU, token: signToken({ ...adminU, role: "Admin" }) };

  let farmId = "", cropId = "", listingId = "", bidA = "", bidB = "", orderId = "", shipmentId = "";

  console.log("\nAccess control");
  await check("unauthenticated request is rejected (401)", async () => {
    assert.equal((await api(null, "GET", "/listings")).status, 401);
  });
  await check("buyer cannot create a farm (403)", async () => {
    assert.equal((await api(buyerA.token, "POST", "/farms", { name: "x", district: "d", state: "s", areaAcres: 1 })).status, 403);
  });
  await check("farmer cannot place a bid (403)", async () => {
    assert.equal((await api(farmer.token, "POST", `/listings/00000000-0000-4000-8000-000000000000/bids`, { quantityKg: 1, pricePerKg: 1 })).status, 403);
  });

  console.log("\nFarms, crops, listings");
  await check("farmer creates a farm", async () => {
    const r = await api(farmer.token, "POST", "/farms", { name: "Ravi Fields", village: "Rasapudipalem", district: "Anantapur", state: "Andhra Pradesh", areaAcres: 4.5, soilType: "red" });
    assert.equal(r.status, 201); assert.equal(r.json.ownerId, farmer.id); assert.equal(r.json.areaAcres, 4.5);
    farmId = r.json.id;
  });
  await check("invalid farm input is rejected (400)", async () => {
    assert.equal((await api(farmer.token, "POST", "/farms", { name: "x", district: "d", state: "s", areaAcres: -3 })).status, 400);
    assert.equal((await api(farmer.token, "POST", "/farms", { district: "d", state: "s", areaAcres: 3 })).status, 400);
  });
  await check("farmer adds a crop to own farm", async () => {
    const r = await api(farmer.token, "POST", `/farms/${farmId}/crops`, { cropName: "Groundnut", variety: "K-6", areaAcres: 2, sownOn: "2026-06-20", expectedHarvestOn: "2026-10-25" });
    assert.equal(r.status, 201); cropId = r.json.id;
  });
  await check("another farmer cannot touch this farm's crops (403)", async () => {
    assert.equal((await api(farmer2.token, "POST", `/farms/${farmId}/crops`, { cropName: "Rice", areaAcres: 1 })).status, 403);
    assert.equal((await api(farmer2.token, "PATCH", `/crops/${cropId}`, { status: "harvested" })).status, 404);
  });
  await check("farmer lists 100 kg at Rs 22.35/kg minimum (paise-exact)", async () => {
    const r = await api(farmer.token, "POST", "/listings", { farmId, cropId, quantityKg: 100, minPricePerKg: 22.35, grade: "A" });
    assert.equal(r.status, 201);
    assert.equal(r.json.availableKg, 100); assert.equal(r.json.minPricePerKg, 22.35); assert.equal(r.json.cropName, "Groundnut");
    assert.equal(r.json.district, "Anantapur");
    listingId = r.json.id;
  });
  await check("listing can't use someone else's farm (403)", async () => {
    assert.equal((await api(farmer2.token, "POST", "/listings", { farmId, cropName: "Groundnut", quantityKg: 5, minPricePerKg: 10 })).status, 403);
  });
  await check("buyers can browse and filter listings", async () => {
    const r = await api(buyerA.token, "GET", "/listings?crop=ground&district=anantapur");
    assert.equal(r.status, 200); assert.equal(r.json.length, 1); assert.equal(r.json[0].id, listingId);
    assert.equal((await api(buyerA.token, "GET", "/listings?crop=wheat")).json.length, 0);
  });

  console.log("\nBidding and overselling");
  await check("bid above available quantity is rejected (409)", async () => {
    assert.equal((await api(buyerA.token, "POST", `/listings/${listingId}/bids`, { quantityKg: 101, pricePerKg: 25 })).status, 409);
  });
  await check("two buyers bid 60 kg each", async () => {
    const a = await api(buyerA.token, "POST", `/listings/${listingId}/bids`, { quantityKg: 60, pricePerKg: 25 });
    const b = await api(buyerB.token, "POST", `/listings/${listingId}/bids`, { quantityKg: 60, pricePerKg: 26 });
    assert.equal(a.status, 201); assert.equal(b.status, 201);
    assert.equal(a.json.totalAmount, 1500);
    bidA = a.json.id; bidB = b.json.id;
  });
  await check("seller sees all bids; a buyer sees only their own", async () => {
    assert.equal((await api(farmer.token, "GET", `/listings/${listingId}/bids`)).json.length, 2);
    const mine = await api(buyerA.token, "GET", `/listings/${listingId}/bids`);
    assert.equal(mine.json.length, 1); assert.equal(mine.json[0].buyerId, buyerA.id);
  });
  await check("a different farmer cannot accept the bid (403)", async () => {
    assert.equal((await api(farmer2.token, "POST", `/bids/${bidA}/accept`)).status, 403);
  });
  await check("accepting bid A reserves 60 kg and creates the order (Rs 1500)", async () => {
    const r = await api(farmer.token, "POST", `/bids/${bidA}/accept`);
    assert.equal(r.status, 201); assert.equal(r.json.totalAmount, 1500); assert.equal(r.json.status, "pending_payment");
    orderId = r.json.id;
    assert.equal((await api(buyerA.token, "GET", `/listings/${listingId}`)).json.availableKg, 40);
  });
  await check("accepting bid B (60 kg) now fails: only 40 kg left (409) and bid B stays pending", async () => {
    assert.equal((await api(farmer.token, "POST", `/bids/${bidB}/accept`)).status, 409);
    const bids = (await api(farmer.token, "GET", `/listings/${listingId}/bids`)).json;
    assert.equal(bids.find((b: any) => b.id === bidB).status, "pending", "failed accept must roll back");
    assert.equal((await api(buyerA.token, "GET", `/listings/${listingId}`)).json.availableKg, 40, "stock must not change");
  });
  await check("the same bid cannot be accepted twice (409)", async () => {
    assert.equal((await api(farmer.token, "POST", `/bids/${bidA}/accept`)).status, 409);
  });
  await check("two simultaneous accepts for the last kg: exactly one wins", async () => {
    const l = (await api(farmer.token, "POST", "/listings", { cropName: "Chilli", quantityKg: 10, minPricePerKg: 100 })).json;
    const b1 = (await api(buyerA.token, "POST", `/listings/${l.id}/bids`, { quantityKg: 10, pricePerKg: 110 })).json;
    const b2 = (await api(buyerB.token, "POST", `/listings/${l.id}/bids`, { quantityKg: 10, pricePerKg: 120 })).json;
    const [r1, r2] = await Promise.all([
      api(farmer.token, "POST", `/bids/${b1.id}/accept`),
      api(farmer.token, "POST", `/bids/${b2.id}/accept`),
    ]);
    assert.deepEqual([r1.status, r2.status].sort(), [201, 409]);
    const after = (await api(farmer.token, "GET", `/listings/${l.id}`)).json;
    assert.equal(after.availableKg, 0); assert.equal(after.status, "sold_out");
  });
  await check("buyer can withdraw a pending bid; seller can reject one", async () => {
    assert.equal((await api(buyerB.token, "POST", `/bids/${bidB}/withdraw`)).json.status, "withdrawn");
    const b3 = (await api(buyerB.token, "POST", `/listings/${listingId}/bids`, { quantityKg: 5, pricePerKg: 21 })).json;
    assert.equal((await api(farmer.token, "POST", `/bids/${b3.id}/reject`)).json.status, "rejected");
  });

  console.log("\nOrder, escrow, shipment, delivery");
  await check("strangers cannot read the order (404)", async () => {
    assert.equal((await api(buyerB.token, "GET", `/orders/${orderId}`)).status, 404);
    assert.equal((await api(farmer2.token, "GET", `/orders/${orderId}`)).status, 404);
  });
  await check("cannot ship before payment (409)", async () => {
    assert.equal((await api(farmer.token, "POST", `/orders/${orderId}/ship`, {})).status, 409);
  });
  await check("only the buyer on the order can pay", async () => {
    assert.equal((await api(buyerB.token, "POST", `/orders/${orderId}/pay`)).status, 409);
    assert.equal((await api(farmer.token, "POST", `/orders/${orderId}/pay`)).status, 403);
  });
  await check("buyer pays: order paid, Rs 1500 held in escrow", async () => {
    const r = await api(buyerA.token, "POST", `/orders/${orderId}/pay`);
    assert.equal(r.status, 200); assert.equal(r.json.order.status, "paid");
    assert.equal(r.json.payment.amount, 1500); assert.equal(r.json.payment.escrowStatus, "held");
  });
  await check("paying twice is blocked (409)", async () => {
    assert.equal((await api(buyerA.token, "POST", `/orders/${orderId}/pay`)).status, 409);
  });
  await check("seller ships with a registered carrier", async () => {
    const r = await api(farmer.token, "POST", `/orders/${orderId}/ship`, { carrierId: carrier.id, pickupAddress: "Rasapudipalem", dropAddress: "Kurnool APMC" });
    assert.equal(r.status, 201); assert.equal(r.json.order.status, "shipped"); assert.match(r.json.shipment.trackingCode, /^AGC-/);
    shipmentId = r.json.shipment.id;
  });
  await check("carrier must be a real Logistics Provider (400)", async () => {
    const l = (await api(farmer.token, "POST", "/listings", { cropName: "Maize", quantityKg: 5, minPricePerKg: 10 })).json;
    const bid = (await api(buyerA.token, "POST", `/listings/${l.id}/bids`, { quantityKg: 5, pricePerKg: 12 })).json;
    const o = (await api(farmer.token, "POST", `/bids/${bid.id}/accept`)).json;
    await api(buyerA.token, "POST", `/orders/${o.id}/pay`);
    assert.equal((await api(farmer.token, "POST", `/orders/${o.id}/ship`, { carrierId: buyerB.id })).status, 400);
  });
  await check("shipment steps must go in order (skipping is 409)", async () => {
    assert.equal((await api(carrier.token, "POST", `/shipments/${shipmentId}/events`, { status: "in_transit" })).status, 409);
  });
  await check("an unrelated logistics user cannot update the shipment (404)", async () => {
    const other = await mk("Other Carrier", "Logistics Provider");
    assert.equal((await api(other.token, "POST", `/shipments/${shipmentId}/events`, { status: "picked_up" })).status, 404);
  });
  await check("carrier moves it booked -> picked_up -> in_transit -> delivered", async () => {
    for (const s of ["picked_up", "in_transit", "delivered"]) {
      const r = await api(carrier.token, "POST", `/shipments/${shipmentId}/events`, { status: s, note: `step ${s}` });
      assert.equal(r.status, 201); assert.equal(r.json.status, s);
    }
    const o = await api(buyerA.token, "GET", `/orders/${orderId}`);
    assert.equal(o.json.order.status, "delivered"); assert.equal(o.json.shipmentEvents.length, 4);
  });
  await check("buyer confirms delivery: order completed, escrow released", async () => {
    const r = await api(buyerA.token, "POST", `/orders/${orderId}/confirm-delivery`);
    assert.equal(r.status, 200); assert.equal(r.json.status, "completed");
    const o = await api(buyerA.token, "GET", `/orders/${orderId}`);
    assert.equal(o.json.payments[0].escrowStatus, "released");
  });
  await check("a completed order cannot be cancelled (409)", async () => {
    assert.equal((await api(buyerA.token, "POST", `/orders/${orderId}/cancel`)).status, 409);
  });
  await check("cancelling a paid order refunds escrow and returns stock to the listing", async () => {
    const l = (await api(farmer.token, "POST", "/listings", { cropName: "Cotton", quantityKg: 50, minPricePerKg: 60 })).json;
    const bid = (await api(buyerA.token, "POST", `/listings/${l.id}/bids`, { quantityKg: 50, pricePerKg: 65 })).json;
    const o = (await api(farmer.token, "POST", `/bids/${bid.id}/accept`)).json;
    assert.equal((await api(farmer.token, "GET", `/listings/${l.id}`)).json.status, "sold_out");
    await api(buyerA.token, "POST", `/orders/${o.id}/pay`);
    const c = await api(buyerA.token, "POST", `/orders/${o.id}/cancel`);
    assert.equal(c.json.status, "cancelled");
    const after = (await api(farmer.token, "GET", `/listings/${l.id}`)).json;
    assert.equal(after.availableKg, 50); assert.equal(after.status, "open");
    assert.equal((await api(buyerA.token, "GET", `/orders/${o.id}`)).json.payments[0].escrowStatus, "refunded");
  });

  console.log("\nWarehouse stock and admin");
  let stockId = "";
  await check("warehouse operator records stock; cannot go below zero", async () => {
    const s = await api(wh.token, "POST", "/stock", { warehouseName: "Kurnool Cold Store", location: "Kurnool", cropName: "Groundnut", quantityKg: 500 });
    assert.equal(s.status, 201); stockId = s.json.id;
    assert.equal((await api(wh.token, "POST", `/stock/${stockId}/adjust`, { deltaKg: -600 })).status, 409);
    assert.equal((await api(wh.token, "POST", `/stock/${stockId}/adjust`, { deltaKg: -200 })).json.quantityKg, 300);
  });
  await check("stock is private to its owner", async () => {
    assert.equal((await api(farmer.token, "POST", `/stock/${stockId}/adjust`, { deltaKg: 1 })).status, 409);
    assert.equal((await api(farmer.token, "GET", "/stock")).json.length, 0);
  });
  await check("admin stats reflect real data; non-admin is blocked", async () => {
    assert.equal((await api(buyerA.token, "GET", "/stats")).status, 403);
    const s = await api(admin.token, "GET", "/stats");
    assert.equal(s.status, 200); assert.equal(s.json.completedOrders, 1); assert.equal(s.json.completedValue, 1500);
    assert.equal(s.json.farms, 1);
  });

  server.close();
  await closePg();
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
