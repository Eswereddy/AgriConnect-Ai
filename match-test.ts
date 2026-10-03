const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
export const sameCrop = (a: string, b: string) => {
  const x = norm(a), y = norm(b);
  return !!x && !!y && (x === y || x.includes(y) || y.includes(x));
};

export interface MatchFarmer { quantityQuintals: number; expectedPrice: number | null; district: string; crop: string; sellingPreference: string; }
export interface MatchBuyer { requiredQuantity: number; offeredPrice: number; district: string; crop: string; }
export interface MatchResult {
  score: number;                        // 0-100
  priceGap: number | null;              // buyer offer - farmer expected, Rs/quintal (>= 0 means the buyer already meets the ask)
  matchedQuantityQuintals: number;      // how much can trade now (smaller of the two)
  fullFill: boolean;                    // farmer can cover the whole requirement
  needsNegotiation: boolean;            // offer is below ask but inside the negotiation band
  sameDistrict: boolean;
}
export const NEGOTIATION_BAND = 0.10;   // an offer up to 10% under the ask still opens a negotiation

/** Returns null when the pair cannot match at all (different crop, or the offer is too far under the ask). */
export function scoreMatch(f: MatchFarmer, b: MatchBuyer): MatchResult | null {
  if (!sameCrop(f.crop, b.crop)) return null;
  if (f.quantityQuintals <= 0 || b.requiredQuantity <= 0) return null;

  let priceScore = 1, priceGap: number | null = null, needsNegotiation = false;
  if (f.expectedPrice !== null && f.expectedPrice > 0) {
    priceGap = b.offeredPrice - f.expectedPrice;
    if (priceGap < 0) {
      const shortfall = -priceGap / f.expectedPrice;
      if (shortfall > NEGOTIATION_BAND) return null;
      needsNegotiation = true;
      priceScore = 1 - shortfall / NEGOTIATION_BAND * 0.6;   // 1.0 down to 0.4 at the edge of the band
    }
  } else {
    priceScore = 0.5;                                        // farmer gave no ask: can't judge price fit
  }

  const matched = Math.min(f.quantityQuintals, b.requiredQuantity);
  const qtyScore = matched / b.requiredQuantity;             // share of the buyer's need this farmer covers
  const sameDistrict = norm(f.district) === norm(b.district);
  const distScore = sameDistrict ? 1 : 0.5;                  // district-level only; add real distance when coordinates exist
  const prefScore = ["direct_buyer", "contract"].includes(f.sellingPreference) ? 1 : f.sellingPreference === "undecided" ? 0.6 : 0.3;

  const score = Math.round(100 * (0.40 * priceScore + 0.30 * qtyScore + 0.20 * distScore + 0.10 * prefScore));
  return { score, priceGap, matchedQuantityQuintals: matched, fullFill: f.quantityQuintals >= b.requiredQuantity, needsNegotiation, sameDistrict };
}

import { readFileSync } from "fs";
const rows = (f: string) => { const [h, ...r] = readFileSync(f, "utf8").trim().split(/\r?\n/); const k = h.split(","); return r.map((l) => Object.fromEntries(l.split(",").map((v, i) => [k[i], v]))); };
const F = rows("farmers-test.csv"), B = rows("buyers-test.csv");
const out: any[] = [];
for (const f of F) for (const b of B) {
  if (f.verified_status !== "verified" || b.verification !== "verified") continue;   // same rule as the API
  const m = scoreMatch(
    { quantityQuintals: +f.quantity_quintals, expectedPrice: +f.expected_price_per_quintal, district: f.district, crop: f.crop, sellingPreference: f.selling_preference },
    { requiredQuantity: +b.required_quantity_quintals, offeredPrice: +b.offered_price_per_quintal, district: b.location, crop: b.required_crops });
  if (m) out.push({ farmer: f.farmer_id, buyer: b.buyer_id, crop: f.crop, score: m.score, ask: f.expected_price_per_quintal, offer: b.offered_price_per_quintal, qty_q: m.matchedQuantityQuintals, full: m.fullFill, next: m.needsNegotiation ? "NEGOTIATE" : "PLACE ORDER" });
}
out.sort((a, b) => b.score - a.score); console.table(out);
