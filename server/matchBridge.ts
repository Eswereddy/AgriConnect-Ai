// ==========================================
// MATCH -> LISTING / BID BRIDGE  (/api/match-bridge/*)
// ==========================================
// Connects the profile-based matching (server/buyerProfiles.ts) to the bid / negotiation / order flow:
//
//   1. FARMER   POST /farmer-profiles/:id/publish   -> turns THEIR verified supply profile into a marketplace listing
//   2. BUYER    POST /start                         -> from a match, places a bid on that listing at the buyer's own offer,
//                                                      then the UI opens the negotiation panel for that bid
//   3. then the existing flow: counter-offers -> seller accepts -> order -> payment -> shipment -> delivery
//
// Each side only ever acts as THEMSELVES (a farmer publishes their own produce, a buyer bids from their own
// requirement) - nobody is made to sell or buy on someone else's behalf.
//
// Units: profiles use quintals (100 kg) and Rs/quintal; listings and bids use kg and paise/kg.
//   quantity_kg        = quintals * 100
//   paise per kg       = (Rs per quintal) * 100 paise / 100 kg  = the same number as Rs per quintal

import { Router } from "express";
import { randomUUID } from "crypto";
import { requireAuth, requireRole, type AuthedRequest } from "./auth";
import { query, pgAvailable } from "./pg";
import { HttpError, wrap, idParam, UUID_RE } from "./marketplace";
import { scoreMatch } from "./buyerProfiles";

export const quintalsToKg = (q: number) => q * 100;
export const rupeesPerQuintalToPaisePerKg = (r: number) => Math.round(r);

export const matchBridgeRouter = Router();
matchBridgeRouter.use((req, res, next) => requireAuth(req as AuthedRequest, res, next));
matchBridgeRouter.use((_req, _res, next) => {
  if (!pgAvailable()) return next(new HttpError(503, "The database is not available."));
  next();
});
const farmerOnly = (req: any, res: any, next: any) => requireRole("Farmer")(req, res, next);
const buyerOnly = (req: any, res: any, next: any) => requireRole("Buyer")(req, res, next);

const openListingFor = async (farmerProfileId: string) =>
  (await query(
    `SELECT l.* FROM profile_listings pl JOIN listings l ON l.id = pl.listing_id
     WHERE pl.farmer_profile_id = $1 AND l.status = 'open' AND l.available_kg > 0
     ORDER BY l.created_at DESC LIMIT 1`, [farmerProfileId]))[0];

// ---- 1. Farmer publishes their own verified supply profile as a listing ----
matchBridgeRouter.post("/farmer-profiles/:id/publish", farmerOnly, wrap(async (req, res) => {
  const id = idParam(req);
  const p = (await query(`SELECT * FROM farmer_profiles WHERE id = $1`, [id]))[0];
  if (!p || p.owner_id !== req.user!.id) throw new HttpError(404, "Farmer profile not found.");
  if (p.is_sample) throw new HttpError(409, "Demo/sample profiles can't be published.");
  if (p.verified_status !== "verified") throw new HttpError(409, "Only a verified profile can be published. Ask an admin to verify it first.");
  if (!(Number(p.quantity_quintals) > 0)) throw new HttpError(409, "Set an available quantity above 0 before publishing.");
  const price = Number(p.expected_price_per_quintal);
  if (!Number.isFinite(price) || price <= 0) throw new HttpError(409, "Set your expected price before publishing.");

  const existing = await openListingFor(id);
  if (existing) { res.json({ listingId: existing.id, alreadyPublished: true }); return; }

  const qtyKg = quintalsToKg(Number(p.quantity_quintals));
  const listing = (await query(
    `INSERT INTO listings (id, seller_id, crop_name, district, quantity_kg, available_kg, min_price_paise_per_kg)
     VALUES ($1,$2,$3,$4,$5,$5,$6) RETURNING *`,
    [randomUUID(), req.user!.id, p.crop, p.district, qtyKg, rupeesPerQuintalToPaisePerKg(price)]
  ))[0];
  await query(`INSERT INTO profile_listings (farmer_profile_id, listing_id) VALUES ($1,$2)`, [id, listing.id]);
  res.status(201).json({ listingId: listing.id, alreadyPublished: false });
}));

// ---- 2. Buyer starts negotiating from a match ----
matchBridgeRouter.post("/start", buyerOnly, wrap(async (req, res) => {
  const fid = String(req.body?.farmerProfileId ?? ""), bid_ = String(req.body?.buyerProfileId ?? "");
  if (!UUID_RE.test(fid) || !UUID_RE.test(bid_)) throw new HttpError(400, "farmerProfileId and buyerProfileId are required.");

  const b = (await query(`SELECT * FROM buyer_profiles WHERE id = $1`, [bid_]))[0];
  if (!b || b.owner_id !== req.user!.id) throw new HttpError(404, "Buyer profile not found.");
  if (b.verified_status !== "verified") throw new HttpError(409, "Your buyer profile must be verified first.");
  const f = (await query(`SELECT * FROM farmer_profiles WHERE id = $1`, [fid]))[0];
  if (!f || f.verified_status !== "verified" || f.is_sample) throw new HttpError(404, "Farmer profile not found.");

  const m = scoreMatch(
    { quantityQuintals: Number(f.quantity_quintals), expectedPrice: f.expected_price_per_quintal === null ? null : Number(f.expected_price_per_quintal),
      district: f.district, crop: f.crop, sellingPreference: f.selling_preference },
    { requiredQuantity: Number(b.required_quantity_quintals), offeredPrice: Number(b.offered_price_per_quintal), district: b.district, crop: b.required_crop });
  if (!m) throw new HttpError(409, "This is no longer a match.");

  const listing = await openListingFor(fid);
  if (!listing) throw new HttpError(409, "The farmer hasn't published this produce to the marketplace yet.");

  const qtyKg = Math.min(quintalsToKg(m.matchedQuantityQuintals), Number(listing.available_kg));
  const pricePaise = rupeesPerQuintalToPaisePerKg(Number(b.offered_price_per_quintal));
  if (!(qtyKg > 0)) throw new HttpError(409, "No stock left on that listing.");
  if (pricePaise <= 0) throw new HttpError(400, "Your offered price must be above 0.");

  // Idempotent: clicking twice must not create duplicate bids.
  const dup = (await query(
    `SELECT * FROM bids WHERE listing_id = $1 AND buyer_id = $2 AND status = 'pending' AND quantity_kg = $3 AND price_paise_per_kg = $4 LIMIT 1`,
    [listing.id, req.user!.id, qtyKg, pricePaise]))[0];
  let bid = dup;
  if (!bid) {
    const pending = Number((await query(`SELECT count(*) AS n FROM bids WHERE listing_id = $1 AND buyer_id = $2 AND status = 'pending'`, [listing.id, req.user!.id]))[0].n);
    if (pending >= 5) throw new HttpError(429, "You already have 5 pending bids on this listing.");
    bid = (await query(
      `INSERT INTO bids (id, listing_id, buyer_id, quantity_kg, price_paise_per_kg) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [randomUUID(), listing.id, req.user!.id, qtyKg, pricePaise]))[0];
  }
  res.status(dup ? 200 : 201).json({
    bidId: bid.id, listingId: listing.id, quantityKg: Number(bid.quantity_kg), pricePerKg: Number(bid.price_paise_per_kg) / 100,
    score: m.score, nextStep: m.needsNegotiation ? "negotiate" : "await_seller_accept",
  });
}));
