// ==========================================
// END-TO-END VERIFICATION SCRIPT
// ==========================================
// Answers the two questions "is my AI actually working?" and "does
// everything actually work?" by really calling every endpoint, not by
// reading the code and guessing. Run this against a running server:
//
//   npm run dev            (in one terminal)
//   npm run verify          (in another terminal)
//
// WATCH THE TERMINAL RUNNING `npm run dev` WHILE THIS RUNS. This script can
// tell you an endpoint returned 200 OK - it CANNOT tell you from the
// outside whether that 200 came from real Gemini or from this codebase's
// built-in fallback simulator (they intentionally return the same JSON
// shape, by design, so the UI never breaks). The dev server prints
// "[Precision Engine Mode] Live Gemini temporarily bypassed: <reason>" to
// its own console the moment any call falls back - that line, not this
// script's output, is the real signal. If you never see that line while
// this runs, every call you hit went to real Gemini.

const BASE_URL = process.env.VERIFY_BASE_URL || "http://localhost:3000";
const TINY_PNG_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGNgAAACAAFVJz3lAAAAAElFTkSuQmCC";

let authCookie = "";
const results = [];

function record(name, pass, detail) {
  results.push({ name, pass, detail });
  const mark = pass ? "PASS" : "FAIL";
  console.log(`[${mark}] ${name}${detail ? " - " + detail : ""}`);
}

async function call(method, path, body, { auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth && authCookie) headers.Cookie = authCookie;
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) authCookie = setCookie.split(";")[0];
  let json = null;
  try {
    json = await res.json();
  } catch {
    // non-JSON response (e.g. HTML from the SPA catch-all) - fine for some checks
  }
  return { status: res.status, json };
}

function preview(json) {
  if (!json) return "(no JSON body)";
  const str = JSON.stringify(json);
  return str.length > 140 ? str.slice(0, 140) + "..." : str;
}

async function main() {
  console.log(`Verifying AgriConnect AI at ${BASE_URL}\n`);

  // 0. Server reachable at all
  try {
    const res = await fetch(BASE_URL);
    record("Server is reachable", res.status < 500, `HTTP ${res.status}`);
  } catch (e) {
    record("Server is reachable", false, e.message);
    console.log("\nServer isn't reachable - is `npm run dev` running? Stopping here.");
    printSummary();
    return;
  }

  // 1. Auth: gating actually blocks anonymous requests
  const gated = await call("POST", "/api/farm-advisory", { cropName: "Wheat" }, { auth: false });
  record(
    "Unauthenticated requests are blocked (401)",
    gated.status === 401,
    `HTTP ${gated.status} - ${gated.status === 401 ? "gating works" : "UNEXPECTED: endpoint responded without login"}`
  );

  // 2. Register a fresh test account
  const testEmail = `verify-${Date.now()}@example.com`;
  const reg = await call(
    "POST",
    "/api/auth/register",
    { name: "Verify Script", email: testEmail, password: "verify-test-password-123", role: "Farmer" },
    { auth: false }
  );
  record("Registration works", reg.status === 201 && !!authCookie, `HTTP ${reg.status}`);

  // 3. Session actually persists (GET /api/auth/me with the cookie we got)
  const me = await call("GET", "/api/auth/me");
  record("Session persists (/api/auth/me)", me.status === 200 && me.json?.user?.email === testEmail, `HTTP ${me.status}`);

  if (!authCookie) {
    console.log("\nCouldn't establish a session - skipping the 30 endpoint checks.");
    printSummary();
    return;
  }

  // 4. Every existing AI endpoint, with a minimally valid payload each
  const endpoints = [
    ["POST", "/api/quality-grading", { cropName: "Tomato", imageBase64: TINY_PNG_BASE64, imageMime: "image/png" }],
    ["POST", "/api/buyer/logistics-optimize", { pickupAddress: "Pune", deliveryAddress: "Mumbai", quantity: "500kg", urgency: "Standard" }],
    ["POST", "/api/buyer/price-prediction", { cropName: "Wheat", region: "Punjab", season: "Rabi" }],
    ["POST", "/api/supplier/demand-prediction", { category: "Seeds", region: "Maharashtra", season: "Kharif" }],
    ["POST", "/api/supplier/pricing-optimization", { productName: "NPK Fertilizer", currentPrice: 500, competitorPrices: [480, 520], demandContext: "steady" }],
    ["POST", "/api/supplier/product-generator", { productName: "Bio Pesticide", category: "Pesticides", keyFeatures: "organic, fast-acting" }],
    ["POST", "/api/diagnose", { cropName: "Tomato", symptoms: "yellow leaves", diseaseImageBase64: TINY_PNG_BASE64, diseaseImageMime: "image/png", aiModel: "default" }],
    ["POST", "/api/smart-alerts", { farmName: "Test Farm", cropName: "Wheat", cropVariety: "PBW-343", soilMoisture: 40, temperature: 28, humidity: 60, nitrogen: 45, phosphorus: 35, potassium: 55 }],
    ["POST", "/api/crop-plan", { soilType: "Loam", temperature: 28, rainfall: 600, soilPh: 6.5, waterAvailability: "Medium", season: "Rabi", historicalData: "", soilMoisture: 40, nitrogen: 45, phosphorus: 35 }],
    ["POST", "/api/farm-advisory", { cropName: "Wheat", soilMoisture: 40, temperature: 28, weather: "Clear", location: "Punjab", stage: "Vegetative" }],
    ["POST", "/api/analyze-soil", { soilTypeManual: "Loam", phManual: 6.5, location: "Punjab" }],
    ["POST", "/api/chat", { messages: [{ role: "user", content: "What crops suit sandy soil?" }], activeRole: "Farmer", language: "English", dialect: "", farmData: {} }],
    ["POST", "/api/translate", { text: "Irrigate the field tomorrow morning.", targetLanguage: "Hindi", dialect: "" }],
    ["POST", "/api/ocr", { documentBase64: TINY_PNG_BASE64, documentMime: "image/png", targetLanguage: "English" }],
    ["POST", "/api/research", { task: "summarize", payload: { topic: "drip irrigation" } }],
    ["POST", "/api/analyze-location", { location: "Pune, Maharashtra" }],
    ["POST", "/api/agricultural-forecast", { location: "Punjab", cropName: "Wheat" }],
    ["POST", "/api/yield-forecast", { cropName: "Wheat", variety: "PBW-343", district: "Pune" }],
    ["POST", "/api/scheme-eligibility", { farmerName: "Test Farmer", land: 3, income: 120000, age: 45, category: "Small & Marginal", schemeId: "PM-KISAN" }],
    ["POST", "/api/disaster-predictor", { zone: "Pune District West", rainfall: 120, wind: 45, temperature: 28, humidity: 65, historicalPattern: "Frequent Floods" }],
    ["GET", "/api/resource-exchange/listings", null],
    ["POST", "/api/resource-exchange/listings", { farmerName: "Test Farmer", resourceType: "Seeds", name: "Wheat Seeds", quantity: "50kg", soughtResource: "Fertilizer" }],
    ["POST", "/api/farm-health-report", { farmName: "Test Farm", soilPh: 6.5, soilMoisture: 40, soilOrganicMatter: 2.1, npkN: 45, npkP: 35, npkK: 55, crops: "Wheat", waterVolume: "Adequate", waterSource: "Canal", pestLevel: "Low", pestsIdentified: "None", weatherCondition: "Clear", temperature: 28 }],
    ["POST", "/api/suggest-bid", { cropName: "Wheat", variety: "PBW-343", qualityGrade: "A", startingBid: 2000, currentHighestBid: 2100, organic: false, quantity: "1000kg", location: "Punjab" }],
    ["POST", "/api/gemini/maps-grounding", { query: "agricultural markets near Pune", latitude: 18.5204, longitude: 73.8567, radiusKm: 10 }],
    ["POST", "/api/gemini/search-grounding", { query: "current wheat MSP India" }],
    ["POST", "/api/gemini/chat", { messages: [{ role: "user", content: "Give me one tip for soil health." }], roleContext: "Farmer", speedMode: true }],
    ["POST", "/api/gemini/generate-image", { prompt: "a healthy wheat field", editMode: false }],
    ["POST", "/api/gemini/transcribe-audio", { audioBase64: TINY_PNG_BASE64, mimeType: "audio/wav", language: "English" }]
  ];

  for (const [method, path, body] of endpoints) {
    const start = Date.now();
    try {
      const { status, json } = await call(method, path, body);
      const ms = Date.now() - start;
      const ok = status >= 200 && status < 300;
      record(`${method} ${path}`, ok, `HTTP ${status}, ${ms}ms - ${preview(json)}`);
    } catch (e) {
      record(`${method} ${path}`, false, e.message);
    }
  }

  // 5. Video generation + one status poll (doesn't wait for full completion)
  const gen = await call("POST", "/api/gemini/generate-video", { prompt: "drone footage over a wheat field", aspectRatio: "16:9", resolution: "720p" });
  const genOk = gen.status === 200 && !!gen.json?.operationName;
  record("POST /api/gemini/generate-video", genOk, `HTTP ${gen.status} - ${preview(gen.json)}`);
  if (genOk) {
    await new Promise((r) => setTimeout(r, 2000));
    const status = await call("POST", "/api/gemini/video-status", { operationName: gen.json.operationName });
    record("POST /api/gemini/video-status", status.status === 200, `HTTP ${status.status} - ${preview(status.json)} (checked once, 2s in - may still say done:false, that's normal)`);
  }

  printSummary();
}

function printSummary() {
  const passed = results.filter((r) => r.pass).length;
  const total = results.length;
  console.log(`\n${passed}/${total} checks passed.`);
  const failed = results.filter((r) => !r.pass);
  if (failed.length) {
    console.log("\nFailed checks:");
    for (const f of failed) console.log(`  - ${f.name}: ${f.detail}`);
  }
  console.log(
    "\nReminder: a PASS here means the endpoint responded successfully - it does " +
    "NOT by itself prove the response came from real Gemini rather than the " +
    "built-in fallback simulator. Check the `npm run dev` terminal for any " +
    '"[Precision Engine Mode] Live Gemini temporarily bypassed" lines printed ' +
    "while this ran. None printed = everything above hit real Gemini."
  );
}

main().catch((e) => {
  console.error("Verification script crashed:", e);
  process.exit(1);
});
