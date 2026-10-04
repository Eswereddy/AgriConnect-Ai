// ==========================================
// COUNTER-OFFER NEGOTIATION ON BIDS  (/api/negotiation/*)
// ==========================================
// Sits on top of the existing bid flow in server/marketplace.ts WITHOUT changing it:
//
//   buyer bids  ->  seller counters  <->  buyer counters  ...  one side accepts the latest counter
//   -> the bid's price/quantity are updated to the agreed terms
//   -> the seller then uses the EXISTING  POST /api/market/bids/:id/accept  to create the order
//      (stock reservation + order creation stay in one place, so they can't drift apart).
//
// Rules:
//  - Only the listing's seller and the bid's buyer can see or act on a negotiation.
//  - The buyer's original bid is the opening offer, so the SELLER counters first; after that sides alternate.
//  - You can only accept the OTHER side's latest open counter, never your own.
//  - Max 6 counters per bid, bid must still be 'pending', listing 'open', quantity must fit the stock.
//  - Price is in rupees per kg in the API (like bids) and paise per kg in the database.

import { Router } from "express";
import { randomUUID } from "crypto";
import { requireAuth, requireRole, type AuthedRequest } from "./auth";
import { query, pgAvailable } from "./pg";
import { HttpError, wrap, idParam } from "./marketplace";

export type Side = "seller" | "buyer";
export const MAX_COUNTERS = 6;

/** Whose turn is it to counter? The buyer's bid is the opening offer, so with no counters yet it is the seller's turn. */
export function whoseTurn(lastCounterFrom: Side | null): Side {
  return lastCounterFrom === null || lastCounterFrom === "buyer" ? "seller" : "buyer";
}

const toPaise = (rupees: number) => Math.round(rupees * 100);
const toRupees = (paise: number | string) => Number(paise) / 100;
const positive = (v: unknown, field: string, max: number): number => {
  const n = Number(v);
  if (v === undefined || v === null || v === "" || !Number.isFinite(n) || n <= 0 || n > max) {
    throw new HttpError(400, `${field} must be a number greater than 0.`);
  }
  return n;
};

const mCounter = (r: any) => ({
  id: r.id, bidId: r.bid_id, from: r.from_role as Side, quantityKg: Number(r.quantity_kg),
  pricePerKg: toRupees(r.price_paise_per_kg), totalAmount: toRupees(Math.round(Number(r.quantity_kg) * Number(r.price_paise_per_kg))),
  note: r.note, status: r.status, createdAt: r.created_at,
});

export const negotiationRouter = Router();
negotiationRouter.use((req, res, next) => requireAuth(req as AuthedRequest, res, next));
negotiationRouter.use((_req, _res, next) => {
  if (!pgAvailable()) return next(new HttpError(503, "The database is not available."));
  next();
});
const sellerOrBuyer = (req: any, res: any, next: any) => requireRole("Farmer", "Buyer")(req, res, next);

/** Loads the bid + listing and works out which side the caller is. 404 for outsiders so existence isn't revealed. */
async function loadParty(req: AuthedRequest, bidId: string) {
  const bid = (await query(`SELECT * FROM bids WHERE id = $1`, [bidId]))[0];
  if (!bid) throw new HttpError(404, "Bid not found.");
  const listing = (await query(`SELECT * FROM listings WHERE id = $1`, [bid.listing_id]))[0];
  if (!listing) throw new HttpError(404, "Bid not found.");
  const uid = req.user!.id;
  const side: Side | null = listing.seller_id === uid ? "seller" : bid.buyer_id === uid ? "buyer" : null;
  if (!side) throw new HttpError(404, "Bid not found.");
  return { bid, listing, side };
}

async function openCounter(bidId: string) {
  return (await query(`SELECT * FROM bid_counters WHERE bid_id = $1 AND status = 'open' ORDER BY created_at DESC LIMIT 1`, [bidId]))[0];
}

function assertNegotiable(bid: any, listing: any) {
  if (bid.status !== "pending") throw new HttpError(409, `This bid is ${bid.status}, so it can't be negotiated.`);
  if (listing.status !== "open") throw new HttpError(409, "This listing is no longer open.");
}

// Negotiation history + whose turn it is.
negotiationRouter.get("/bids/:id", sellerOrBuyer, wrap(async (req, res) => {
  const { bid, listing, side } = await loadParty(req, idParam(req));
  const history = await query(`SELECT * FROM bid_counters WHERE bid_id = $1 ORDER BY created_at ASC`, [bid.id]);
  const last = history.filter((c: any) => c.status === "open").pop();
  res.json({
    you: side,
    bid: { status: bid.status, quantityKg: Number(bid.quantity_kg), pricePerKg: toRupees(bid.price_paise_per_kg) },
    listing: { cropName: listing.crop_name, availableKg: Number(listing.available_kg), status: listing.status },
    turn: bid.status === "pending" ? whoseTurn(last ? last.from_role : null) : null,
    counters: history.map(mCounter),
    maxCounters: MAX_COUNTERS,
  });
}));

// Make a counter-offer.
negotiationRouter.post("/bids/:id/counter", sellerOrBuyer, wrap(async (req, res) => {
  const { bid, listing, side } = await loadParty(req, idParam(req));
  assertNegotiable(bid, listing);

  const last = await openCounter(bid.id);
  if (whoseTurn(last ? last.from_role : null) !== side) throw new HttpError(409, "It's the other side's turn to respond.");

  const total = Number((await query(`SELECT count(*) AS n FROM bid_counters WHERE bid_id = $1`, [bid.id]))[0].n);
  if (total >= MAX_COUNTERS) throw new HttpError(409, `Negotiation limit reached (${MAX_COUNTERS} counters). Accept the latest offer, reject, or withdraw.`);

  const pricePaise = toPaise(positive(req.body?.pricePerKg, "pricePerKg", 1000000));
  if (pricePaise <= 0) throw new HttpError(400, "pricePerKg is too small.");
  const baseQty = last ? Number(last.quantity_kg) : Number(bid.quantity_kg);
  const quantity = req.body?.quantityKg === undefined ? baseQty : positive(req.body.quantityKg, "quantityKg", 100000000);
  if (quantity > Number(listing.available_kg)) throw new HttpError(409, `Only ${listing.available_kg} kg is available.`);
  const note = typeof req.body?.note === "string" && req.body.note.trim() ? req.body.note.trim().slice(0, 300) : null;

  if (last) await query(`UPDATE bid_counters SET status = 'superseded' WHERE id = $1 AND status = 'open'`, [last.id]);
  const row = (await query(
    `INSERT INTO bid_counters (id, bid_id, from_role, from_user_id, quantity_kg, price_paise_per_kg, note)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [randomUUID(), bid.id, side, req.user!.id, quantity, pricePaise, note]
  ))[0];
  res.status(201).json({ counter: mCounter(row), turn: whoseTurn(side) });
}));

// Accept the OTHER side's latest counter -> bid terms are updated to the agreed price/quantity.
negotiationRouter.post("/bids/:id/accept-counter", sellerOrBuyer, wrap(async (req, res) => {
  const { bid, listing, side } = await loadParty(req, idParam(req));
  assertNegotiable(bid, listing);

  const last = await openCounter(bid.id);
  if (!last) throw new HttpError(409, "There is no counter-offer to accept.");
  if (last.from_role === side) throw new HttpError(409, "You can't accept your own counter-offer.");
  if (Number(last.quantity_kg) > Number(listing.available_kg)) throw new HttpError(409, `Only ${listing.available_kg} kg is available now.`);

  // Guard against a double click / race: only a still-open counter can flip.
  const flipped = await query(`UPDATE bid_counters SET status = 'accepted' WHERE id = $1 AND status = 'open' RETURNING id`, [last.id]);
  if (!flipped[0]) throw new HttpError(409, "That counter-offer is no longer open.");
  const updated = await query(
    `UPDATE bids SET quantity_kg = $2, price_paise_per_kg = $3 WHERE id = $1 AND status = 'pending' RETURNING *`,
    [bid.id, last.quantity_kg, last.price_paise_per_kg]
  );
  if (!updated[0]) {
    await query(`UPDATE bid_counters SET status = 'open' WHERE id = $1`, [last.id]);
    throw new HttpError(409, "This bid is no longer pending.");
  }
  res.json({
    agreed: { quantityKg: Number(updated[0].quantity_kg), pricePerKg: toRupees(updated[0].price_paise_per_kg),
      totalAmount: toRupees(Math.round(Number(updated[0].quantity_kg) * Number(updated[0].price_paise_per_kg))) },
    // The order itself is created by the existing seller action, at exactly these terms.
    nextStep: "seller_accepts_bid",
    nextCall: `POST /api/market/bids/${bid.id}/accept`,
  });
}));
