// End-to-end tests for REAL PAYMENTS (Razorpay) and LIVE FEEDS (Open-Meteo, data.gov.in).
//   npm run test:live
//
// The real services can't be called from a test (they need your secret keys, and a test
// must not move money), so this spins up local stand-in servers that speak the same
// HTTP contracts, and points the app at them with the *_URL / RAZORPAY_API_BASE overrides.
// What this proves: OUR logic (signatures, amounts, idempotency, refunds, caching,
// fallbacks). What it can't prove: that Razorpay/data.gov.in still behave as documented -
// run `npm run check:feeds` on your machine with your real keys for that.

import os from "os";
import path from "path";
import fs from "fs";
import http from "http";
import crypto from "crypto";
import assert from "assert/strict";

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "agri-live-"));
process.env.DATA_DIR = tmp;
process.env.DATABASE_PATH = path.join(tmp, "users.db");
process.env.JWT_SECRET = "test-secret-test-secret-test-secret-123456";
process.env.NODE_ENV = "test";

const KEY_ID = "rzp_test_abc123", KEY_SECRET = "super_secret_key_value", WH_SECRET = "webhook_secret_value";
process.env.RAZORPAY_KEY_ID = KEY_ID;
process.env.RAZORPAY_KEY_SECRET = KEY_SECRET;
process.env.RAZORPAY_WEBHOOK_SECRET = WH_SECRET;
const DATA_GOV_KEY = "datagov_key_do_not_leak";

let passed = 0, failed = 0;
async function check(name: string, fn: () => Promise<void>) {
  try { await fn(); passed++; console.log(`  PASS  ${name}`); }
  catch (e: any) { failed++; console.log(`  FAIL  ${name}\n        ${e?.message ?? e}`); }
}

// ------------------------------------------------------------------ stand-in external services

const rz = {
  orders: new Map<string, any>(), payments: new Map<string, any>(), createCalls: 0,
  captures: [] as string[], refunds: [] as { payment: string; amount: number }[], failRefunds: false, badAuth: 0,
};
const wx = { geoHits: 0, forecastHits: 0, failForecast: false, rainy: true };
const md = { hits: 0, fail: false, legacyOnly: false, lastUrls: [] as string[] };

const today = () => new Date().toISOString().slice(0, 10);
const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);
const ddmmyyyy = (iso: string) => iso.split("-").reverse().join("/");

function mandiRows() {
  const t = ddmmyyyy(today()), y = ddmmyyyy(daysAgo(1));
  return [
    { State: "Andhra Pradesh", District: "Anantapur", Market: "Anantapur", Commodity: "Groundnut", Variety: "Bold", Grade: "FAQ", Arrival_Date: t, Min_Price: "5800", Max_Price: "6600", Modal_Price: "6200" },
    { State: "Andhra Pradesh", District: "Anantapur", Market: "Anantapur", Commodity: "Groundnut", Variety: "Bold", Grade: "FAQ", Arrival_Date: y, Min_Price: "5700", Max_Price: "6500", Modal_Price: "6100" },
    { State: "Andhra Pradesh", District: "Kurnool", Market: "Kurnool", Commodity: "Groundnut", Variety: "Other", Grade: "FAQ", Arrival_Date: t, Min_Price: "5900", Max_Price: "6700", Modal_Price: "6300" },
    { State: "Andhra Pradesh", District: "Kurnool", Market: "Adoni", Commodity: "Cotton", Variety: "Other", Grade: "FAQ", Arrival_Date: t, Min_Price: "6800", Max_Price: "7400", Modal_Price: "7100" },
    { State: "Karnataka", District: "Raichur", Market: "Raichur", Commodity: "Groundnut", Variety: "Other", Grade: "FAQ", Arrival_Date: t, Min_Price: "5000", Max_Price: "5600", Modal_Price: "5300" },
    { State: "Andhra Pradesh", District: "Anantapur", Market: "Gooty", Commodity: "Groundnut", Variety: "Bad", Grade: "FAQ", Arrival_Date: "not-a-date", Min_Price: "x", Max_Price: "y", Modal_Price: "z" },
  ];
}

function body(req: http.IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let b = ""; req.on("data", (c) => (b += c)); req.on("end", () => { try { resolve(b ? JSON.parse(b) : {}); } catch { resolve({}); } });
  });
}
const send = (res: http.ServerResponse, code: number, obj: any) => { res.writeHead(code, { "Content-Type": "application/json" }); res.end(JSON.stringify(obj)); };

const stub = http.createServer(async (req, res) => {
  const url = new URL(req.url!, "http://stub");
  const p = url.pathname;
  // ---- Razorpay
  if (p.startsWith("/rzp/")) {
    const expected = "Basic " + Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64");
    if (req.headers.authorization !== expected) { rz.badAuth++; return send(res, 401, { error: { description: "Authentication failed" } }); }
    const sub = p.slice(4);
    if (req.method === "POST" && sub === "/orders") {
      const b = await body(req); rz.createCalls++;
      const o = { id: `order_${rz.createCalls}`, amount: b.amount, currency: b.currency, receipt: b.receipt, status: "created" };
      rz.orders.set(o.id, o); return send(res, 200, o);
    }
    let m = /^\/payments\/([^/]+)$/.exec(sub);
    if (req.method === "GET" && m) { const pay = rz.payments.get(m[1]); return pay ? send(res, 200, pay) : send(res, 404, { error: { description: "not found" } }); }
    m = /^\/payments\/([^/]+)\/capture$/.exec(sub);
    if (req.method === "POST" && m) { const pay = rz.payments.get(m[1]); if (!pay) return send(res, 404, {}); pay.status = "captured"; rz.captures.push(m[1]); return send(res, 200, pay); }
    m = /^\/payments\/([^/]+)\/refund$/.exec(sub);
    if (req.method === "POST" && m) {
      const b = await body(req);
      if (rz.failRefunds) return send(res, 500, { error: { description: "refund service down" } });
      rz.refunds.push({ payment: m[1], amount: b.amount }); return send(res, 200, { id: `rfnd_${rz.refunds.length}` });
    }
    return send(res, 404, {});
  }
  // ---- Open-Meteo
  if (p === "/geo") {
    wx.geoHits++;
    const name = (url.searchParams.get("name") || "").toLowerCase();
    return send(res, 200, name === "anantapur" ? { results: [{ name: "Anantapur", latitude: 14.68, longitude: 77.6, admin1: "Andhra Pradesh" }] } : {});
  }
  if (p === "/forecast") {
    wx.forecastHits++;
    if (wx.failForecast) return send(res, 500, { error: true });
    const days = Array.from({ length: 7 }, (_, i) => daysAgo(-i));
    return send(res, 200, {
      current: { time: `${today()}T10:00`, temperature_2m: 31.4, relative_humidity_2m: 55, precipitation: 0, wind_speed_10m: 9.5, weather_code: 3 },
      daily: {
        time: days, weather_code: days.map(() => 61),
        temperature_2m_max: days.map(() => 34), temperature_2m_min: days.map(() => 24),
        precipitation_sum: days.map((_, i) => (wx.rainy && i === 0 ? 12 : 0)),
        precipitation_probability_max: days.map((_, i) => (wx.rainy && i === 0 ? 80 : 5)),
        wind_speed_10m_max: days.map(() => 12), et0_fao_evapotranspiration: days.map(() => 5),
      },
    });
  }
  // ---- data.gov.in
  if (p === "/mandi") {
    md.hits++; md.lastUrls.push(req.url!);
    if (md.fail) return send(res, 503, { error: "down" });
    const isNew = [...url.searchParams.keys()].some((k) => k.endsWith(".keyword]"));
    if (md.legacyOnly && isNew) return send(res, 200, { records: [] });
    // Deliberately IGNORES filters, so the app's own filtering is what's under test.
    return send(res, 200, { records: mandiRows() });
  }
  send(res, 404, {});
});

// ------------------------------------------------------------------ main

async function main() {
  await new Promise<void>((r) => stub.listen(0, "127.0.0.1", () => r()));
  const stubPort = (stub.address() as any).port;
  const S = `http://127.0.0.1:${stubPort}`;
  process.env.RAZORPAY_API_BASE = `${S}/rzp`;
  process.env.OPEN_METEO_GEOCODE_URL = `${S}/geo`;
  process.env.OPEN_METEO_FORECAST_URL = `${S}/forecast`;
  process.env.DATA_GOV_MANDI_URL = `${S}/mandi`;
  process.env.DATA_GOV_API_KEY = DATA_GOV_KEY;

  const express = (await import("express")).default;
  const cookieParser = (await import("cookie-parser")).default;
  const { registerUser, signToken } = await import("../auth");
  const { db } = await import("../db");
  const { initPg, closePg, query } = await import("../pg");
  const { marketRouter } = await import("../marketplace");
  const { paymentsRouter, razorpayWebhook } = await import("../payments");
  const { liveRouter } = await import("../liveData");

  assert.ok(await initPg(), "Postgres failed to initialise");

  const app = express();
  app.use(express.json({ verify: (req: any, _res, buf) => { if (req.originalUrl.startsWith("/api/payments/razorpay/webhook")) req.rawBody = buf; } }));
  app.use(cookieParser());
  app.post("/api/payments/razorpay/webhook", razorpayWebhook);
  app.use("/api/market/payments", paymentsRouter);
  app.use("/api/market", marketRouter);
  app.use("/api/live", liveRouter);
  const server = app.listen(0);
  const base = `http://127.0.0.1:${(server.address() as any).port}`;

  const mk = async (name: string, role: string) => {
    const u = await registerUser({ name, email: `${name.toLowerCase().replace(/\s/g, "")}@t.test`, password: "password123", role });
    return { ...u, token: signToken(u) };
  };
  const api = async (token: string | null, method: string, url: string, b?: any) => {
    const r = await fetch(base + url, { method, headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: b ? JSON.stringify(b) : undefined });
    const text = await r.text(); let json: any = null; try { json = JSON.parse(text); } catch { /* */ }
    return { status: r.status, json, text };
  };
  const hmac = (secret: string, data: string | Buffer) => crypto.createHmac("sha256", secret).update(data).digest("hex");
  const sendWebhook = (event: any, secret = WH_SECRET, tamper = false) => {
    const raw = JSON.stringify(event);
    return fetch(`${base}/api/payments/razorpay/webhook`, {
      method: "POST", headers: { "Content-Type": "application/json", "x-razorpay-signature": hmac(secret, tamper ? raw + " " : raw) }, body: raw,
    }).then(async (r) => ({ status: r.status, json: await r.json().catch(() => null) }));
  };
  const capturedEvent = (rzOrder: string, payId: string, amount: number) => ({ event: "payment.captured", payload: { payment: { entity: { id: payId, order_id: rzOrder, amount, status: "captured" } } } });

  const farmer = await mk("Ravi Farmer", "Farmer");
  const buyerA = await mk("Buyer A", "Buyer");
  const buyerB = await mk("Buyer B", "Buyer");
  const adminU = await mk("Admin User", "Farmer");
  db.prepare(`UPDATE users SET role = 'Admin' WHERE id = ?`).run(adminU.id);
  const admin = { ...adminU, token: signToken({ ...adminU, role: "Admin" }) };

  // helper: a fresh order of 10 kg @ Rs50 = 50000 paise
  const newOrder = async (qty = 10) => {
    const l = (await api(farmer.token, "POST", "/api/market/listings", { cropName: "Groundnut", quantityKg: 100, minPricePerKg: 40 })).json;
    const bid = (await api(buyerA.token, "POST", `/api/market/listings/${l.id}/bids`, { quantityKg: qty, pricePerKg: 50 })).json;
    const order = (await api(farmer.token, "POST", `/api/market/bids/${bid.id}/accept`)).json;
    return { listingId: l.id as string, order };
  };
  const intent = async (orderId: string, tok = buyerA.token) => api(tok, "POST", `/api/market/payments/orders/${orderId}/intent`);
  const verifyBody = (rzOrder: string, payId: string, secret = KEY_SECRET) => ({ razorpay_order_id: rzOrder, razorpay_payment_id: payId, razorpay_signature: hmac(secret, `${rzOrder}|${payId}`) });
  const detail = async (orderId: string, tok = buyerA.token) => (await api(tok, "GET", `/api/market/orders/${orderId}`)).json;
  const stubPay = (id: string, orderId: string, amount: number, status = "authorized") => rz.payments.set(id, { id, order_id: orderId, amount, status });

  // =========================================================== PAYMENTS
  console.log("\nReal payments (Razorpay)");
  const o1 = await newOrder();
  let rzO1 = "";

  await check("config reports razorpay and exposes only the public key id", async () => {
    const r = await api(buyerA.token, "GET", "/api/market/payments/config");
    assert.equal(r.json.provider, "razorpay"); assert.equal(r.json.keyId, KEY_ID);
    assert.ok(!r.text.includes(KEY_SECRET), "secret must never be exposed");
  });
  await check("the old ledger pay route is refused once real payments are on (409)", async () => {
    assert.equal((await api(buyerA.token, "POST", `/api/market/orders/${o1.order.id}/pay`)).status, 409);
  });
  await check("only the buyer on the order can start checkout", async () => {
    assert.equal((await intent(o1.order.id, buyerB.token)).status, 404);
    assert.equal((await intent(o1.order.id, farmer.token)).status, 403);
  });
  await check("intent charges the amount stored in OUR database, authenticated to Razorpay", async () => {
    const r = await intent(o1.order.id);
    assert.equal(r.status, 200); assert.equal(r.json.amount, 50000); assert.equal(r.json.currency, "INR"); assert.equal(r.json.keyId, KEY_ID);
    rzO1 = r.json.razorpayOrderId;
    const o = rz.orders.get(rzO1); assert.equal(o.amount, 50000); assert.equal(o.receipt, o1.order.id);
    assert.equal(rz.badAuth, 0);
  });
  await check("repeating intent reuses the same Razorpay order (no orphans)", async () => {
    const r = await intent(o1.order.id);
    assert.equal(r.json.razorpayOrderId, rzO1); assert.equal(rz.createCalls, 1);
  });
  await check("verify with a forged signature is rejected (400) even though the payment itself is valid", async () => {
    // Everything is genuine EXCEPT the signature, so only the signature check can stop this.
    stubPay("pay_1", rzO1, 50000, "authorized");
    const r = await api(buyerA.token, "POST", `/api/market/payments/orders/${o1.order.id}/verify`, verifyBody(rzO1, "pay_1", "wrong_secret"));
    assert.equal(r.status, 400); assert.match(r.json.error, /signature/i);
    assert.equal((await detail(o1.order.id)).order.status, "pending_payment");
    assert.equal(rz.captures.length, 0, "must not capture at Razorpay on a forged signature");
  });
  await check("verify rejects a payment whose real amount differs from the order (400)", async () => {
    stubPay("pay_short", rzO1, 49900);
    const r = await api(buyerA.token, "POST", `/api/market/payments/orders/${o1.order.id}/verify`, verifyBody(rzO1, "pay_short"));
    assert.equal(r.status, 400);
    assert.equal((await detail(o1.order.id)).order.status, "pending_payment");
  });
  await check("verify rejects a payment Razorpay doesn't know (no fake success)", async () => {
    const r = await api(buyerA.token, "POST", `/api/market/payments/orders/${o1.order.id}/verify`, verifyBody(rzO1, "pay_ghost"));
    assert.ok(r.status >= 400, `got ${r.status}`);
    assert.equal((await detail(o1.order.id)).order.status, "pending_payment");
  });
  await check("a different buyer cannot settle someone else's order (404)", async () => {
    stubPay("pay_1", rzO1, 50000, "authorized");
    assert.equal((await api(buyerB.token, "POST", `/api/market/payments/orders/${o1.order.id}/verify`, verifyBody(rzO1, "pay_1"))).status, 404);
  });
  await check("good signature + authorized payment: captured via API, order paid, funds held", async () => {
    const r = await api(buyerA.token, "POST", `/api/market/payments/orders/${o1.order.id}/verify`, verifyBody(rzO1, "pay_1"));
    assert.equal(r.status, 200); assert.equal(r.json.order.status, "paid");
    assert.equal(r.json.payment.provider, "razorpay"); assert.equal(r.json.payment.amount, 500); assert.equal(r.json.payment.escrowStatus, "held");
    assert.deepEqual(rz.captures, ["pay_1"]);
  });
  await check("verifying twice is harmless (idempotent) and creates no second payment", async () => {
    const r = await api(buyerA.token, "POST", `/api/market/payments/orders/${o1.order.id}/verify`, verifyBody(rzO1, "pay_1"));
    assert.equal(r.status, 200); assert.equal(r.json.order.status, "paid");
    assert.equal((await detail(o1.order.id)).payments.length, 1);
  });

  console.log("\nWebhook");
  await check("webhook with a bad signature is rejected (400)", async () => {
    assert.equal((await sendWebhook(capturedEvent(rzO1, "pay_1", 50000), "not_the_secret")).status, 400);
    assert.equal((await sendWebhook(capturedEvent(rzO1, "pay_1", 50000), WH_SECRET, true)).status, 400);
  });
  await check("a valid duplicate webhook changes nothing (200)", async () => {
    assert.equal((await sendWebhook(capturedEvent(rzO1, "pay_1", 50000))).status, 200);
    const d = await detail(o1.order.id); assert.equal(d.order.status, "paid"); assert.equal(d.payments.length, 1);
  });
  const o2 = await newOrder(); let rzO2 = "";
  await check("webhook alone can settle an order (buyer closed the tab before verify)", async () => {
    rzO2 = (await intent(o2.order.id)).json.razorpayOrderId;
    assert.equal((await sendWebhook(capturedEvent(rzO2, "pay_2", 50000))).status, 200);
    const d = await detail(o2.order.id); assert.equal(d.order.status, "paid"); assert.equal(d.payments[0].escrowStatus, "held");
  });
  const o3 = await newOrder(); let rzO3 = "";
  await check("webhook with the wrong amount is ignored; order stays unpaid", async () => {
    rzO3 = (await intent(o3.order.id)).json.razorpayOrderId;
    assert.equal((await sendWebhook(capturedEvent(rzO3, "pay_3x", 100))).status, 200);
    assert.equal((await detail(o3.order.id)).order.status, "pending_payment");
  });
  await check("payment.failed marks the attempt failed, and a retry on the same checkout can still succeed", async () => {
    await sendWebhook({ event: "payment.failed", payload: { payment: { entity: { id: "pay_3f", order_id: rzO3, amount: 50000 } } } });
    assert.equal((await detail(o3.order.id)).payments[0].status, "failed");
    stubPay("pay_3", rzO3, 50000, "captured");
    const r = await api(buyerA.token, "POST", `/api/market/payments/orders/${o3.order.id}/verify`, verifyBody(rzO3, "pay_3"));
    assert.equal(r.status, 200); assert.equal(r.json.order.status, "paid");
  });

  console.log("\nRefunds");
  await check("cancelling a paid order refunds the REAL payment through Razorpay and restores stock", async () => {
    const r = await api(buyerA.token, "POST", `/api/market/orders/${o1.order.id}/cancel`);
    assert.equal(r.status, 200); assert.equal(r.json.status, "cancelled"); assert.equal(r.json.refundPending, false);
    assert.deepEqual(rz.refunds.filter((x) => x.payment === "pay_1"), [{ payment: "pay_1", amount: 50000 }]);
    const p = (await detail(o1.order.id)).payments[0];
    assert.equal(p.status, "refunded"); assert.equal(p.escrowStatus, "refunded");
    assert.equal((await api(farmer.token, "GET", `/api/market/listings/${o1.listingId}`)).json.availableKg, 100);
  });
  await check("if Razorpay is down the refund is queued, flagged, and retried later by an admin", async () => {
    rz.failRefunds = true;
    const r = await api(buyerA.token, "POST", `/api/market/orders/${o2.order.id}/cancel`);
    assert.equal(r.status, 200); assert.equal(r.json.refundPending, true);
    assert.equal((await api(admin.token, "GET", "/api/market/stats")).json.refundsPending, 1);
    rz.failRefunds = false;
    assert.equal((await api(buyerA.token, "POST", "/api/market/payments/admin/retry-refunds")).status, 403);
    const retry = await api(admin.token, "POST", "/api/market/payments/admin/retry-refunds");
    assert.equal(retry.json.refunded, 1); assert.equal(retry.json.failed, 0);
    assert.equal((await api(admin.token, "GET", "/api/market/stats")).json.refundsPending, 0);
    assert.equal((await detail(o2.order.id)).payments[0].status, "refunded");
  });
  await check("money that arrives after the order was cancelled is refunded automatically", async () => {
    const o4 = await newOrder(); const rzO4 = (await intent(o4.order.id)).json.razorpayOrderId;
    assert.equal((await api(buyerA.token, "POST", `/api/market/orders/${o4.order.id}/cancel`)).status, 200);
    assert.equal((await sendWebhook(capturedEvent(rzO4, "pay_4", 50000))).status, 200);
    assert.ok(rz.refunds.some((x) => x.payment === "pay_4" && x.amount === 50000), "late payment must be refunded");
    const d = await detail(o4.order.id); assert.equal(d.order.status, "cancelled"); assert.equal(d.payments[0].status, "refunded");
  });
  await check("a duplicate payment on an already-paid order is refunded; the order stays paid", async () => {
    const o5 = await newOrder();
    const rzA = (await intent(o5.order.id)).json.razorpayOrderId;
    await sendWebhook({ event: "payment.failed", payload: { payment: { entity: { id: "pay_5f", order_id: rzA, amount: 50000 } } } });
    const rzB = (await intent(o5.order.id)).json.razorpayOrderId;
    assert.notEqual(rzA, rzB, "a failed checkout should get a fresh Razorpay order");
    stubPay("pay_5b", rzB, 50000, "captured");
    assert.equal((await api(buyerA.token, "POST", `/api/market/payments/orders/${o5.order.id}/verify`, verifyBody(rzB, "pay_5b"))).status, 200);
    assert.equal((await sendWebhook(capturedEvent(rzA, "pay_5a", 50000))).status, 200); // buyer also paid the old checkout
    assert.ok(rz.refunds.some((x) => x.payment === "pay_5a"), "duplicate must be refunded");
    const d = await detail(o5.order.id);
    assert.equal(d.order.status, "paid");
    assert.equal(d.payments.filter((p: any) => p.status === "captured" && p.escrowStatus === "held").length, 1);
  });

  // =========================================================== LIVE FEEDS
  console.log("\nLive weather (Open-Meteo)");
  await check("unauthenticated feed requests are rejected (401)", async () => {
    assert.equal((await api(null, "GET", "/api/live/weather?place=Anantapur")).status, 401);
  });
  await check("feed status reports what is configured", async () => {
    const r = await api(buyerA.token, "GET", "/api/live/status");
    assert.equal(r.json.mandi.configured, true); assert.equal(r.json.weather.configured, true);
  });
  await check("weather by place name: geocoded, 7-day forecast, rain advisory from the real numbers", async () => {
    const r = await api(buyerA.token, "GET", "/api/live/weather?place=Anantapur");
    assert.equal(r.status, 200); assert.equal(r.json.place.name, "Anantapur"); assert.equal(r.json.daily.length, 7);
    assert.equal(r.json.current.tempC, 31.4); assert.equal(r.json.current.summary, "Overcast");
    assert.ok(r.json.advisories.some((a: string) => /Rain likely/.test(a)), r.json.advisories.join(" | "));
    assert.equal(r.json.cached, false);
  });
  await check("repeat request is served from cache (no new upstream call)", async () => {
    const before = { g: wx.geoHits, f: wx.forecastHits };
    const r = await api(buyerA.token, "GET", "/api/live/weather?place=Anantapur");
    assert.equal(r.json.cached, true); assert.equal(wx.geoHits, before.g); assert.equal(wx.forecastHits, before.f);
  });
  await check("a dry forecast gives an irrigation-style advisory instead of a rain warning", async () => {
    wx.rainy = false;
    const r = await api(buyerA.token, "GET", "/api/live/weather?lat=17.38&lon=78.48");
    assert.ok(!r.json.advisories.some((a: string) => /Rain likely/.test(a)));
    assert.ok(r.json.advisories.some((a: string) => /Dry week/.test(a)), r.json.advisories.join(" | "));
  });
  await check("bad input is rejected: unknown place 404, invalid coords 400, nothing given 400", async () => {
    assert.equal((await api(buyerA.token, "GET", "/api/live/weather?place=Nowhereville")).status, 404);
    assert.equal((await api(buyerA.token, "GET", "/api/live/weather?lat=999&lon=10")).status, 400);
    assert.equal((await api(buyerA.token, "GET", "/api/live/weather")).status, 400);
  });
  await check("if the weather service is down the API says so (502) and invents nothing", async () => {
    wx.failForecast = true;
    const r = await api(buyerA.token, "GET", "/api/live/weather?lat=20.5&lon=78.9");
    wx.failForecast = false;
    assert.equal(r.status, 502); assert.equal(r.json.current, undefined); assert.equal(r.json.daily, undefined);
  });

  console.log("\nLive mandi prices (data.gov.in)");
  await check("without DATA_GOV_API_KEY the feed refuses (503) instead of faking prices", async () => {
    delete process.env.DATA_GOV_API_KEY;
    const r = await api(buyerA.token, "GET", "/api/live/mandi?state=Andhra%20Pradesh");
    process.env.DATA_GOV_API_KEY = DATA_GOV_KEY;
    assert.equal(r.status, 503); assert.match(r.json.error, /DATA_GOV_API_KEY/);
  });
  await check("live prices: only the requested state+commodity, normalised, Rs/quintal and Rs/kg", async () => {
    const r = await api(buyerA.token, "GET", "/api/live/mandi?state=Andhra%20Pradesh&commodity=groundnut");
    assert.equal(r.status, 200); assert.equal(r.json.source, "data.gov.in"); assert.equal(r.json.stale, false);
    const recs = r.json.records;
    assert.equal(recs.length, 3, "Karnataka row, cotton row and the malformed row must all be dropped");
    assert.ok(recs.every((x: any) => x.state === "Andhra Pradesh" && /groundnut/i.test(x.commodity)));
    const a = recs.find((x: any) => x.market === "Anantapur" && x.arrivalDate === today());
    assert.equal(a.modalPerQuintal, 6200); assert.equal(a.modalPerKg, 62); assert.equal(a.minPerQuintal, 5800);
  });
  await check("the API key is sent upstream but never echoed back to the browser", async () => {
    const r = await api(buyerA.token, "GET", "/api/live/mandi?state=Andhra%20Pradesh&commodity=groundnut&market=Anantapur");
    assert.ok(!r.text.includes(DATA_GOV_KEY));
    assert.ok(md.lastUrls.some((u) => u.includes("api-key=" + DATA_GOV_KEY)));
    assert.ok(md.lastUrls.some((u) => u.includes("filters%5Bstate.keyword%5D")), "should use the current filter style first");
  });
  await check("repeat request is cached (no new upstream call)", async () => {
    const before = md.hits;
    const r = await api(buyerA.token, "GET", "/api/live/mandi?state=Andhra%20Pradesh&commodity=groundnut");
    assert.equal(r.json.source, "cache"); assert.equal(md.hits, before);
  });
  await check("falls back to the older filter style when the current one returns nothing", async () => {
    md.legacyOnly = true;
    const r = await api(buyerA.token, "GET", "/api/live/mandi?state=Andhra%20Pradesh&commodity=cotton");
    md.legacyOnly = false;
    assert.equal(r.status, 200); assert.equal(r.json.records.length, 1); assert.equal(r.json.records[0].commodity, "Cotton");
  });
  await check("fetched prices are saved to Postgres and form a price trend", async () => {
    for (let i = 0; i < 20; i++) { const n = (await query(`SELECT count(*) AS n FROM mandi_prices`))[0].n; if (n >= 4) break; await new Promise((r) => setTimeout(r, 50)); }
    const r = await api(buyerA.token, "GET", "/api/live/mandi/trend?commodity=groundnut&market=Anantapur&days=30");
    assert.equal(r.status, 200); assert.equal(r.json.points.length, 2);
    assert.deepEqual(r.json.points.map((p: any) => p.modalPerQuintal), [6100, 6200]);
    assert.equal((await api(buyerA.token, "GET", "/api/live/mandi/trend")).status, 400);
  });
  await check("if data.gov.in is down, real saved prices are served marked STALE", async () => {
    md.fail = true;
    const r = await api(buyerA.token, "GET", "/api/live/mandi?state=Andhra%20Pradesh&commodity=groundnut&district=Anantapur");
    md.fail = false;
    assert.equal(r.status, 200); assert.equal(r.json.source, "stored"); assert.equal(r.json.stale, true);
    assert.ok(r.json.records.length >= 2 && r.json.records.every((x: any) => x.district === "Anantapur"));
  });
  await check("if it is down and nothing was ever saved, the API errors (502) rather than inventing prices", async () => {
    md.fail = true;
    const r = await api(buyerA.token, "GET", "/api/live/mandi?state=Andhra%20Pradesh&commodity=dragonfruit");
    md.fail = false;
    assert.equal(r.status, 502); assert.equal(r.json.records, undefined);
  });

  server.close(); stub.close();
  await closePg();
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
