// Checks the REAL external services from YOUR machine, using the keys in your .env.
//   npm run check:feeds
//
// It never moves money and never creates anything: Razorpay is only asked to list orders
// (a read-only call that proves your keys work).

import "dotenv/config";
import { getWeather, getMandiPrices } from "../liveData";

let bad = 0;
const ok = (m: string) => console.log(`  OK    ${m}`);
const fail = (m: string) => { bad++; console.log(`  FAIL  ${m}`); };
const skip = (m: string) => console.log(`  SKIP  ${m}`);
const msg = (e: any) => String(e?.message || e).slice(0, 200);

async function main() {
  console.log("\n1. Weather (Open-Meteo, no key needed)");
  try {
    const w = await getWeather({ place: "Anantapur" });
    ok(`${w.place.name}${w.place.region ? ", " + w.place.region : ""}: ${w.current.tempC}°C, ${w.current.summary}; ${w.daily.length}-day forecast`);
    ok(`advisories: ${w.advisories.join(" | ")}`);
    console.log("  NOTE  Open-Meteo's free tier is for NON-COMMERCIAL use. Get their commercial plan before you charge users.");
  } catch (e) { fail(`weather: ${msg(e)}`); }

  console.log("\n2. Mandi prices (data.gov.in)");
  if (!process.env.DATA_GOV_API_KEY) {
    skip("DATA_GOV_API_KEY is not set. Get a free key at https://data.gov.in (sign in -> My Account -> API key) and add it to .env");
  } else {
    try {
      const m = await getMandiPrices({ state: "Andhra Pradesh" }, 5);
      if (!m.records.length) {
        fail("The call worked but returned 0 Andhra Pradesh records. Try again later (mandis report daily), or run with a different state.");
      } else {
        ok(`${m.records.length} sample records (source: ${m.source}${m.stale ? ", STALE" : ""})`);
        for (const r of m.records.slice(0, 3)) console.log(`        ${r.arrivalDate}  ${r.commodity} @ ${r.market}, ${r.district}: modal ₹${r.modalPerQuintal}/quintal (₹${r.modalPerKg}/kg)`);
        if (m.stale) fail("Served saved data because the live call failed. Check your key and network.");
      }
    } catch (e) { fail(`mandi prices: ${msg(e)}`); }
  }

  console.log("\n3. Razorpay");
  const id = process.env.RAZORPAY_KEY_ID, secret = process.env.RAZORPAY_KEY_SECRET;
  if (!id || !secret) {
    skip("RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET not set. Create TEST keys: Razorpay dashboard -> Account & Settings -> API Keys.");
  } else {
    console.log(`        key mode: ${id.startsWith("rzp_live_") ? "LIVE (real money!)" : id.startsWith("rzp_test_") ? "TEST (safe)" : "unknown prefix"}`);
    try {
      const base = process.env.RAZORPAY_API_BASE || "https://api.razorpay.com/v1";
      const r = await fetch(`${base}/orders?count=1`, { headers: { Authorization: "Basic " + Buffer.from(`${id}:${secret}`).toString("base64") }, signal: AbortSignal.timeout(15000) });
      if (r.ok) ok("keys are valid (read-only call succeeded)");
      else fail(`Razorpay rejected the keys (HTTP ${r.status}). Re-copy the key id and secret from the dashboard.`);
    } catch (e) { fail(`could not reach Razorpay: ${msg(e)}`); }
    if (process.env.RAZORPAY_WEBHOOK_SECRET) ok("RAZORPAY_WEBHOOK_SECRET is set");
    else fail("RAZORPAY_WEBHOOK_SECRET is not set. Without the webhook, a buyer who closes the tab mid-payment will not be marked paid.");
    console.log("  TODO  In the Razorpay dashboard add a webhook: URL https://<your-domain>/api/payments/razorpay/webhook, events payment.captured, order.paid, payment.failed.");
  }

  console.log(bad ? `\n${bad} problem(s) found.` : "\nAll configured services look good.");
  process.exit(bad ? 1 : 0);
}
main();
