// ==========================================
// BUYER PROFILES + FARMER<->BUYER MATCHING  (/api/buyer-profiles/*)
// ==========================================
// Completes the flow:  Farmer profile + Buyer profile -> MATCH -> (bid/negotiation) -> order -> payment -> delivery
// (the bid -> order -> payment -> delivery half already lives in server/marketplace.ts).
//
// Rules (enforced here):
//  - login required. Admin sees everything; a Buyer sees/edits only their own profiles.
//  - only an Admin can verify / reject. A Buyer editing a profile sends it back to "pending".
//  - matching only uses VERIFIED profiles. Farmers need contact permission for a buyer to be told who they are.
//  - NO phone numbers or contact details are stored - only whether permission was given.
//  - Units follow farmer_profiles: quantities in quintals (100 kg), prices in Rs per quintal.
//  - The match score is a transparent weighted formula (see scoreMatch), not a black box.

import { Router } from "express";
import { randomUUID, randomBytes } from "crypto";
import { requireAuth, requireRole, type AuthedRequest } from "./auth";
import { query, pgAvailable } from "./pg";
import { HttpError, wrap, idParam } from "./marketplace";

export const BUYER_TYPES = ["trader", "retailer", "wholesaler", "processor", "exporter"] as const;
const FREQ = ["one_time", "weekly", "monthly", "seasonal"] as const;
const DELIVERY = ["delivery", "pickup", "either"] as const;
const TERMS = ["advance", "on_delivery", "credit_7d", "credit_15d"] as const;
const STATUSES = ["pending", "verified", "rejected"] as const;

const text = (v: unknown, field: string, o: { required?: boolean; max?: number } = {}): string | null => {
  const { required = false, max = 200 } = o;
  if (v === undefined || v === null || (typeof v === "string" && !v.trim())) {
    if (required) throw new HttpError(400, `${field} is required.`);
    return null;
  }
  if (typeof v !== "string") throw new HttpError(400, `${field} must be text.`);
  const t = v.trim();
  if (t.length > max) throw new HttpError(400, `${field} is too long (max ${max}).`);
  return t;
};
const num = (v: unknown, field: string, o: { required?: boolean; positive?: boolean } = {}): number | null => {
  if (v === undefined || v === null || v === "") {
    if (o.required) throw new HttpError(400, `${field} is required.`);
    return null;
  }
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0 || n > 100000000 || (o.positive && n <= 0)) {
    throw new HttpError(400, `${field} must be a number${o.positive ? " greater than 0" : ", 0 or more"}.`);
  }
  return n;
};
const oneOf = <T extends string>(v: unknown, list: readonly T[], field: string, dflt?: T): T => {
  if (v === undefined || v === null || v === "") {
    if (dflt) return dflt;
    throw new HttpError(400, `${field} is required.`);
  }
  const s = String(v).trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (!(list as readonly string[]).includes(s)) throw new HttpError(400, `${field} must be one of: ${list.join(", ")}.`);
  return s as T;
};
const bool = (v: unknown) => (typeof v === "boolean" ? v : ["yes", "true", "1", "y"].includes(String(v ?? "").trim().toLowerCase()));

function clean(b: any) {
  return {
    buyerName: text(b?.buyerName, "Buyer / business name", { required: true, max: 120 })!,
    buyerType: oneOf(b?.buyerType, BUYER_TYPES, "Buyer type"),
    district: text(b?.district, "District", { required: true, max: 80 })!,
    location: text(b?.location, "Location", { max: 120 }),
    requiredCrop: text(b?.requiredCrop, "Required crop", { required: true, max: 80 })!,
    requiredQuantity: num(b?.requiredQuantityQuintals, "Required quantity", { required: true, positive: true })!,
    offeredPrice: num(b?.offeredPricePerQuintal, "Offered price", { required: true })!,
    preferredGrade: text(b?.preferredGrade, "Preferred grade", { max: 40 }),
    purchaseFrequency: oneOf(b?.purchaseFrequency, FREQ, "Purchase frequency", "one_time"),
    deliveryPreference: oneOf(b?.deliveryPreference, DELIVERY, "Delivery preference", "either"),
    paymentTerms: oneOf(b?.paymentTerms, TERMS, "Payment terms", "on_delivery"),
    contactPermission: bool(b?.contactPermission),
  };
}

const COLS = `id, buyer_code, owner_id, buyer_name, buyer_type, district, location, required_crop, required_quantity_quintals,
  offered_price_per_quintal, preferred_grade, purchase_frequency, delivery_preference, payment_terms, verified_status, contact_permission`;

const mapRow = (r: any) => ({
  id: r.id, buyerCode: r.buyer_code, ownerId: r.owner_id, buyerName: r.buyer_name, buyerType: r.buyer_type,
  district: r.district, location: r.location, requiredCrop: r.required_crop,
  requiredQuantityQuintals: r.required_quantity_quintals, offeredPricePerQuintal: r.offered_price_per_quintal,
  preferredGrade: r.preferred_grade, purchaseFrequency: r.purchase_frequency, deliveryPreference: r.delivery_preference,
  paymentTerms: r.payment_terms, verifiedStatus: r.verified_status, contactPermission: r.contact_permission,
});

// ---------- matching ----------

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

// ---------- routes ----------

const newCode = () => "BP-" + randomBytes(3).toString("hex").toUpperCase();
export const buyerProfilesRouter = Router();
buyerProfilesRouter.use((req, res, next) => requireAuth(req as AuthedRequest, res, next));
buyerProfilesRouter.use((_req, _res, next) => {
  if (!pgAvailable()) return next(new HttpError(503, "The database is not available."));
  next();
});
const isAdmin = (req: AuthedRequest) => req.user!.role === "Admin";
const buyerOrAdmin = (req: any, res: any, next: any) => requireRole("Admin", "Buyer")(req, res, next);
const adminOnly = (req: any, res: any, next: any) => requireRole("Admin")(req, res, next);

async function loadOwned(req: AuthedRequest, id: string) {
  const rows = await query(`SELECT ${COLS} FROM buyer_profiles WHERE id = $1`, [id]);
  if (!rows.length || (!isAdmin(req) && rows[0].owner_id !== req.user!.id)) throw new HttpError(404, "Buyer profile not found.");
  return rows[0];
}

buyerProfilesRouter.get("/", buyerOrAdmin, wrap(async (req, res) => {
  const params: any[] = []; let w = "";
  if (!isAdmin(req)) { params.push(req.user!.id); w = "WHERE owner_id = $1"; }
  const rows = await query(`SELECT ${COLS} FROM buyer_profiles ${w} ORDER BY created_at DESC LIMIT 200`, params);
  res.json({ profiles: rows.map(mapRow) });
}));

buyerProfilesRouter.post("/", buyerOrAdmin, wrap(async (req, res) => {
  const c = clean(req.body);
  const rows = await query(
    `INSERT INTO buyer_profiles (id, buyer_code, owner_id, buyer_name, buyer_type, district, location, required_crop, required_quantity_quintals,
       offered_price_per_quintal, preferred_grade, purchase_frequency, delivery_preference, payment_terms, contact_permission)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING ${COLS}`,
    [randomUUID(), newCode(), req.user!.id, c.buyerName, c.buyerType, c.district, c.location, c.requiredCrop, c.requiredQuantity,
      c.offeredPrice, c.preferredGrade, c.purchaseFrequency, c.deliveryPreference, c.paymentTerms, c.contactPermission]
  );
  res.status(201).json(mapRow(rows[0]));
}));

buyerProfilesRouter.put("/:id", buyerOrAdmin, wrap(async (req, res) => {
  const id = idParam(req);
  await loadOwned(req, id);
  const c = clean(req.body);
  const rows = await query(
    `UPDATE buyer_profiles SET buyer_name=$2, buyer_type=$3, district=$4, location=$5, required_crop=$6, required_quantity_quintals=$7,
       offered_price_per_quintal=$8, preferred_grade=$9, purchase_frequency=$10, delivery_preference=$11, payment_terms=$12,
       contact_permission=$13, verified_status = CASE WHEN $14 THEN verified_status ELSE 'pending' END, updated_at = now()
     WHERE id=$1 RETURNING ${COLS}`,
    [id, c.buyerName, c.buyerType, c.district, c.location, c.requiredCrop, c.requiredQuantity, c.offeredPrice, c.preferredGrade,
      c.purchaseFrequency, c.deliveryPreference, c.paymentTerms, c.contactPermission, isAdmin(req)]
  );
  res.json(mapRow(rows[0]));
}));

buyerProfilesRouter.post("/:id/verify", adminOnly, wrap(async (req, res) => {
  const id = idParam(req);
  const status = oneOf(req.body?.status, ["verified", "rejected"] as const, "Status");
  const rows = await query(`UPDATE buyer_profiles SET verified_status=$2, updated_at=now() WHERE id=$1 RETURNING ${COLS}`, [id, status]);
  if (!rows.length) throw new HttpError(404, "Buyer profile not found.");
  res.json(mapRow(rows[0]));
}));

/**
 * GET /api/buyer-profiles/matches
 *  - Buyer: verified farmers matching each of their VERIFIED requirements.
 *  - Farmer: verified buyers matching each of their VERIFIED supply profiles.
 *  - Admin: every verified pair.
 * Names are shown to the other side only when that party gave contact permission; otherwise just the code.
 */
buyerProfilesRouter.get("/matches", wrap(async (req, res) => {
  const role = req.user!.role, uid = req.user!.id;
  if (!["Admin", "Buyer", "Farmer"].includes(role)) throw new HttpError(403, "Not allowed.");

  const fRows = await query(
    `SELECT id, farmer_code, owner_id, farmer_name, district, crop, quantity_quintals, expected_price_per_quintal, selling_preference, contact_permission
     FROM farmer_profiles WHERE verified_status = 'verified' AND is_sample = false LIMIT 2000`);
  const bRows = await query(`SELECT ${COLS} FROM buyer_profiles WHERE verified_status = 'verified' LIMIT 2000`);

  // Which farmer profiles already have an open marketplace listing (so a buyer can start negotiating).
  const listedRows = await query(
    `SELECT pl.farmer_profile_id FROM profile_listings pl JOIN listings l ON l.id = pl.listing_id
     WHERE l.status = 'open' AND l.available_kg > 0`);
  const listed = new Set(listedRows.map((r: any) => r.farmer_profile_id));

  const matches: any[] = [];
  for (const f of fRows) {
    for (const b of bRows) {
      if (role === "Buyer" && b.owner_id !== uid) continue;
      if (role === "Farmer" && f.owner_id !== uid) continue;
      const m = scoreMatch(
        { quantityQuintals: f.quantity_quintals, expectedPrice: f.expected_price_per_quintal, district: f.district, crop: f.crop, sellingPreference: f.selling_preference },
        { requiredQuantity: b.required_quantity_quintals, offeredPrice: b.offered_price_per_quintal, district: b.district, crop: b.required_crop },
      );
      if (!m) continue;
      const seeFarmer = role === "Admin" || role === "Farmer" || f.contact_permission;
      const seeBuyer = role === "Admin" || role === "Buyer" || b.contact_permission;
      matches.push({
        ...m,
        crop: b.required_crop,
        farmerProfileId: f.id, buyerProfileId: b.id, listed: listed.has(f.id),
        farmer: { code: f.farmer_code, name: seeFarmer ? f.farmer_name : null, district: f.district, quantityQuintals: f.quantity_quintals, expectedPricePerQuintal: f.expected_price_per_quintal },
        buyer: { code: b.buyer_code, name: seeBuyer ? b.buyer_name : null, type: b.buyer_type, district: b.district, requiredQuantityQuintals: b.required_quantity_quintals,
          offeredPricePerQuintal: b.offered_price_per_quintal, paymentTerms: b.payment_terms, deliveryPreference: b.delivery_preference },
        nextStep: m.needsNegotiation ? "negotiate" : "place_order",
      });
    }
  }
  matches.sort((a, b) => b.score - a.score);
  res.json({ matches: matches.slice(0, 200), total: matches.length });
}));
