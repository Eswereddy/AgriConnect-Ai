// ==========================================
// MARKETPLACE API  (/api/market/*)
// ==========================================
// Real, persisted marketplace loop on Postgres:
//   farm -> crop -> listing -> bid -> order -> payment (escrow ledger) -> shipment -> delivery
//
// Rules enforced SERVER-SIDE (not just in the UI):
//  - every route needs a logged-in user; role-restricted where it matters
//  - users can only touch rows they own / are a party to
//  - bids can't oversell a listing (atomic conditional UPDATE inside a transaction)
//  - orders move through a strict state machine (conditional UPDATE ... WHERE status = x)
//  - money is integer paise internally; the API speaks rupees at the edge
//
// NOTE ON PAYMENTS: /orders/:id/pay records a payment in an escrow LEDGER
// (provider "ledger"). It does NOT move real money. Replace it with Razorpay:
// create a Razorpay order, verify the checkout signature on the server, then
// write the same payments row with provider "razorpay" and the payment id.

import { Router, type Request, type Response, type NextFunction } from "express";
import { randomUUID, randomBytes } from "crypto";
import { requireAuth, requireRole, type AuthedRequest } from "./auth";
import { findUserById } from "./db";
import { query, withTransaction, pgAvailable } from "./pg";

// ---------- small helpers ----------

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function wrap(fn: (req: AuthedRequest, res: Response) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req as AuthedRequest, res).catch((err) => {
      if (err instanceof HttpError) {
        res.status(err.status).json({ error: err.message });
      } else {
        next(err);
      }
    });
  };
}

function idParam(req: Request, name = "id"): string {
  const v = req.params[name];
  if (!UUID_RE.test(v)) throw new HttpError(400, `Invalid ${name}.`);
  return v;
}

function str(v: unknown, field: string, opts: { required?: boolean; max?: number } = {}): string | null {
  const { required = false, max = 200 } = opts;
  if (v === undefined || v === null || v === "") {
    if (required) throw new HttpError(400, `${field} is required.`);
    return null;
  }
  if (typeof v !== "string") throw new HttpError(400, `${field} must be text.`);
  const t = v.trim();
  if (!t && required) throw new HttpError(400, `${field} is required.`);
  if (t.length > max) throw new HttpError(400, `${field} is too long (max ${max}).`);
  return t || null;
}

function num(v: unknown, field: string, opts: { required?: boolean; min?: number; max?: number; gt?: number } = {}): number | null {
  const { required = false, min, max, gt } = opts;
  if (v === undefined || v === null || v === "") {
    if (required) throw new HttpError(400, `${field} is required.`);
    return null;
  }
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) throw new HttpError(400, `${field} must be a number.`);
  if (gt !== undefined && !(n > gt)) throw new HttpError(400, `${field} must be greater than ${gt}.`);
  if (min !== undefined && n < min) throw new HttpError(400, `${field} must be at least ${min}.`);
  if (max !== undefined && n > max) throw new HttpError(400, `${field} must be at most ${max}.`);
  return n;
}

function dateStr(v: unknown, field: string): string | null {
  const s = str(v, field, { max: 10 });
  if (!s) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || Number.isNaN(Date.parse(s))) {
    throw new HttpError(400, `${field} must be a date like 2026-11-30.`);
  }
  return s;
}

const toPaise = (rupees: number) => Math.round(rupees * 100);
const toRupees = (paise: number) => paise / 100;

function paging(req: Request) {
  const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? "50"), 10) || 50, 1), 100);
  const offset = Math.max(parseInt(String(req.query.offset ?? "0"), 10) || 0, 0);
  return { limit, offset };
}

function userName(id: string): string | null {
  return findUserById(id)?.name ?? null;
}

// ---------- row mappers (snake_case rows -> camelCase API, paise -> rupees) ----------

const mFarm = (r: any) => ({
  id: r.id, ownerId: r.owner_id, name: r.name, village: r.village, district: r.district, state: r.state,
  areaAcres: r.area_acres, soilType: r.soil_type, latitude: r.latitude, longitude: r.longitude, createdAt: r.created_at,
});
const mCrop = (r: any) => ({
  id: r.id, farmId: r.farm_id, cropName: r.crop_name, variety: r.variety, areaAcres: r.area_acres,
  sownOn: r.sown_on, expectedHarvestOn: r.expected_harvest_on, status: r.status, createdAt: r.created_at,
});
const mListing = (r: any) => ({
  id: r.id, sellerId: r.seller_id, sellerName: userName(r.seller_id), farmId: r.farm_id, cropId: r.crop_id,
  cropName: r.crop_name, variety: r.variety, grade: r.grade, district: r.district, state: r.state,
  quantityKg: r.quantity_kg, availableKg: r.available_kg, minPricePerKg: toRupees(r.min_price_paise_per_kg),
  status: r.status, createdAt: r.created_at,
});
const mBid = (r: any) => ({
  id: r.id, listingId: r.listing_id, buyerId: r.buyer_id, buyerName: userName(r.buyer_id), quantityKg: r.quantity_kg,
  pricePerKg: toRupees(r.price_paise_per_kg), totalAmount: toRupees(Math.round(r.quantity_kg * r.price_paise_per_kg)),
  status: r.status, createdAt: r.created_at, decidedAt: r.decided_at,
});
const mOrder = (r: any) => ({
  id: r.id, listingId: r.listing_id, bidId: r.bid_id, sellerId: r.seller_id, sellerName: userName(r.seller_id),
  buyerId: r.buyer_id, buyerName: userName(r.buyer_id), cropName: r.crop_name, quantityKg: r.quantity_kg,
  pricePerKg: toRupees(r.price_paise_per_kg), totalAmount: toRupees(r.total_paise), status: r.status,
  createdAt: r.created_at, updatedAt: r.updated_at,
});
const mPayment = (r: any) => ({
  id: r.id, orderId: r.order_id, amount: toRupees(r.amount_paise), provider: r.provider, providerRef: r.provider_ref,
  status: r.status, escrowStatus: r.escrow_status, createdAt: r.created_at, releasedAt: r.released_at,
});
const mShipment = (r: any) => ({
  id: r.id, orderId: r.order_id, carrierId: r.carrier_id, trackingCode: r.tracking_code,
  pickupAddress: r.pickup_address, dropAddress: r.drop_address, status: r.status,
  createdAt: r.created_at, updatedAt: r.updated_at,
});
const mStock = (r: any) => ({
  id: r.id, ownerId: r.owner_id, warehouseName: r.warehouse_name, location: r.location, cropName: r.crop_name,
  quantityKg: r.quantity_kg, updatedAt: r.updated_at,
});

// ---------- router ----------

export const marketRouter = Router();

// Must be logged in for everything below (also applies when DEMO_MODE is on:
// real stored data always needs a real owner).
marketRouter.use((req, res, next) => {
  if (!pgAvailable()) {
    res.status(503).json({ error: "The marketplace database is not available. Set DATABASE_URL and restart." });
    return;
  }
  requireAuth(req as AuthedRequest, res, next);
});

// ===== Farms & crops (Farmer) =====

marketRouter.post("/farms", requireRole("Farmer"), wrap(async (req, res) => {
  const b = req.body ?? {};
  const row = (await query(
    `INSERT INTO farms (id, owner_id, name, village, district, state, area_acres, soil_type, latitude, longitude)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [
      randomUUID(), req.user!.id,
      str(b.name, "name", { required: true, max: 120 }),
      str(b.village, "village", { max: 120 }),
      str(b.district, "district", { required: true, max: 120 }),
      str(b.state, "state", { required: true, max: 120 }),
      num(b.areaAcres, "areaAcres", { required: true, gt: 0, max: 100000 }),
      str(b.soilType, "soilType", { max: 60 }),
      num(b.latitude, "latitude", { min: -90, max: 90 }),
      num(b.longitude, "longitude", { min: -180, max: 180 }),
    ]
  ))[0];
  res.status(201).json(mFarm(row));
}));

marketRouter.get("/farms", requireRole("Farmer"), wrap(async (req, res) => {
  const rows = await query(`SELECT * FROM farms WHERE owner_id = $1 ORDER BY created_at DESC`, [req.user!.id]);
  res.json(rows.map(mFarm));
}));

async function ownedFarm(farmId: string, userId: string) {
  const f = (await query(`SELECT * FROM farms WHERE id = $1`, [farmId]))[0];
  if (!f) throw new HttpError(404, "Farm not found.");
  if (f.owner_id !== userId) throw new HttpError(403, "That farm belongs to another user.");
  return f;
}

marketRouter.post("/farms/:farmId/crops", requireRole("Farmer"), wrap(async (req, res) => {
  const farmId = idParam(req, "farmId");
  await ownedFarm(farmId, req.user!.id);
  const b = req.body ?? {};
  const status = str(b.status, "status", { max: 20 }) ?? "growing";
  if (!["planned", "growing", "harvested"].includes(status)) throw new HttpError(400, "status must be planned, growing or harvested.");
  const row = (await query(
    `INSERT INTO crops (id, farm_id, crop_name, variety, area_acres, sown_on, expected_harvest_on, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [
      randomUUID(), farmId,
      str(b.cropName, "cropName", { required: true, max: 80 }),
      str(b.variety, "variety", { max: 80 }),
      num(b.areaAcres, "areaAcres", { required: true, gt: 0, max: 100000 }),
      dateStr(b.sownOn, "sownOn"), dateStr(b.expectedHarvestOn, "expectedHarvestOn"), status,
    ]
  ))[0];
  res.status(201).json(mCrop(row));
}));

marketRouter.get("/farms/:farmId/crops", requireRole("Farmer"), wrap(async (req, res) => {
  const farmId = idParam(req, "farmId");
  await ownedFarm(farmId, req.user!.id);
  const rows = await query(`SELECT * FROM crops WHERE farm_id = $1 ORDER BY created_at DESC`, [farmId]);
  res.json(rows.map(mCrop));
}));

marketRouter.patch("/crops/:id", requireRole("Farmer"), wrap(async (req, res) => {
  const id = idParam(req);
  const status = str(req.body?.status, "status", { required: true, max: 20 });
  if (!["planned", "growing", "harvested"].includes(status!)) throw new HttpError(400, "status must be planned, growing or harvested.");
  const rows = await query(
    `UPDATE crops SET status = $1
     WHERE id = $2 AND farm_id IN (SELECT id FROM farms WHERE owner_id = $3) RETURNING *`,
    [status, id, req.user!.id]
  );
  if (!rows[0]) throw new HttpError(404, "Crop not found.");
  res.json(mCrop(rows[0]));
}));

// ===== Listings =====

marketRouter.post("/listings", requireRole("Farmer"), wrap(async (req, res) => {
  const b = req.body ?? {};
  const userId = req.user!.id;
  let farmId: string | null = null;
  let cropId: string | null = null;
  let district = str(b.district, "district", { max: 120 });
  let state = str(b.state, "state", { max: 120 });
  let cropName = str(b.cropName, "cropName", { max: 80 });

  if (b.farmId) {
    if (!UUID_RE.test(b.farmId)) throw new HttpError(400, "Invalid farmId.");
    const farm = await ownedFarm(b.farmId, userId);
    farmId = farm.id;
    district = district ?? farm.district;
    state = state ?? farm.state;
  }
  if (b.cropId) {
    if (!UUID_RE.test(b.cropId)) throw new HttpError(400, "Invalid cropId.");
    const crop = (await query(
      `SELECT c.* FROM crops c JOIN farms f ON f.id = c.farm_id WHERE c.id = $1 AND f.owner_id = $2`, [b.cropId, userId]
    ))[0];
    if (!crop) throw new HttpError(404, "Crop not found.");
    cropId = crop.id;
    farmId = farmId ?? crop.farm_id;
    cropName = cropName ?? crop.crop_name;
  }
  if (!cropName) throw new HttpError(400, "cropName is required.");

  const quantity = num(b.quantityKg, "quantityKg", { required: true, gt: 0, max: 100000000 })!;
  const minPrice = num(b.minPricePerKg, "minPricePerKg", { required: true, min: 0, max: 1000000 })!;

  const row = (await query(
    `INSERT INTO listings (id, seller_id, farm_id, crop_id, crop_name, variety, grade, district, state,
                           quantity_kg, available_kg, min_price_paise_per_kg)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$10,$11) RETURNING *`,
    [randomUUID(), userId, farmId, cropId, cropName, str(b.variety, "variety", { max: 80 }), str(b.grade, "grade", { max: 40 }),
      district, state, quantity, toPaise(minPrice)]
  ))[0];
  res.status(201).json(mListing(row));
}));

marketRouter.get("/listings", wrap(async (req, res) => {
  const { limit, offset } = paging(req);
  const where: string[] = [];
  const params: any[] = [];
  const status = typeof req.query.status === "string" ? req.query.status : "open";
  if (status !== "all") {
    if (!["open", "sold_out", "closed"].includes(status)) throw new HttpError(400, "Invalid status filter.");
    params.push(status); where.push(`status = $${params.length}`);
  }
  if (typeof req.query.crop === "string" && req.query.crop.trim()) {
    params.push(`%${req.query.crop.trim().slice(0, 80)}%`); where.push(`crop_name ILIKE $${params.length}`);
  }
  if (typeof req.query.district === "string" && req.query.district.trim()) {
    params.push(`%${req.query.district.trim().slice(0, 120)}%`); where.push(`district ILIKE $${params.length}`);
  }
  if (req.query.mine === "true") {
    params.push(req.user!.id); where.push(`seller_id = $${params.length}`);
  }
  params.push(limit, offset);
  const rows = await query(
    `SELECT * FROM listings ${where.length ? "WHERE " + where.join(" AND ") : ""}
     ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  res.json(rows.map(mListing));
}));

marketRouter.get("/listings/:id", wrap(async (req, res) => {
  const row = (await query(`SELECT * FROM listings WHERE id = $1`, [idParam(req)]))[0];
  if (!row) throw new HttpError(404, "Listing not found.");
  res.json(mListing(row));
}));

marketRouter.post("/listings/:id/close", requireRole("Farmer"), wrap(async (req, res) => {
  const rows = await query(
    `UPDATE listings SET status = 'closed' WHERE id = $1 AND seller_id = $2 AND status = 'open' RETURNING *`,
    [idParam(req), req.user!.id]
  );
  if (!rows[0]) throw new HttpError(404, "Open listing not found.");
  res.json(mListing(rows[0]));
}));

// ===== Bids =====

marketRouter.post("/listings/:id/bids", requireRole("Buyer"), wrap(async (req, res) => {
  const listingId = idParam(req);
  const quantity = num(req.body?.quantityKg, "quantityKg", { required: true, gt: 0 })!;
  const price = num(req.body?.pricePerKg, "pricePerKg", { required: true, gt: 0, max: 1000000 })!;
  const pricePaise = toPaise(price);
  if (pricePaise <= 0) throw new HttpError(400, "pricePerKg is too small.");

  const listing = (await query(`SELECT * FROM listings WHERE id = $1`, [listingId]))[0];
  if (!listing) throw new HttpError(404, "Listing not found.");
  if (listing.status !== "open") throw new HttpError(409, "This listing is no longer open.");
  if (quantity > listing.available_kg) throw new HttpError(409, `Only ${listing.available_kg} kg is available.`);

  const pending = (await query(
    `SELECT count(*) AS n FROM bids WHERE listing_id = $1 AND buyer_id = $2 AND status = 'pending'`, [listingId, req.user!.id]
  ))[0];
  if (Number(pending.n) >= 5) throw new HttpError(429, "You already have 5 pending bids on this listing.");

  const row = (await query(
    `INSERT INTO bids (id, listing_id, buyer_id, quantity_kg, price_paise_per_kg) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [randomUUID(), listingId, req.user!.id, quantity, pricePaise]
  ))[0];
  res.status(201).json(mBid(row));
}));

marketRouter.get("/listings/:id/bids", wrap(async (req, res) => {
  const listingId = idParam(req);
  const listing = (await query(`SELECT seller_id FROM listings WHERE id = $1`, [listingId]))[0];
  if (!listing) throw new HttpError(404, "Listing not found.");
  // The seller sees every bid; anyone else only sees their own.
  const isSeller = listing.seller_id === req.user!.id;
  const rows = await query(
    isSeller
      ? `SELECT * FROM bids WHERE listing_id = $1 ORDER BY price_paise_per_kg DESC, created_at ASC`
      : `SELECT * FROM bids WHERE listing_id = $1 AND buyer_id = $2 ORDER BY created_at DESC`,
    isSeller ? [listingId] : [listingId, req.user!.id]
  );
  res.json(rows.map(mBid));
}));

marketRouter.get("/bids/mine", requireRole("Buyer"), wrap(async (req, res) => {
  const { limit, offset } = paging(req);
  const rows = await query(
    `SELECT * FROM bids WHERE buyer_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`, [req.user!.id, limit, offset]
  );
  res.json(rows.map(mBid));
}));

marketRouter.post("/bids/:id/withdraw", requireRole("Buyer"), wrap(async (req, res) => {
  const rows = await query(
    `UPDATE bids SET status = 'withdrawn', decided_at = now()
     WHERE id = $1 AND buyer_id = $2 AND status = 'pending' RETURNING *`,
    [idParam(req), req.user!.id]
  );
  if (!rows[0]) throw new HttpError(404, "Pending bid not found.");
  res.json(mBid(rows[0]));
}));

marketRouter.post("/bids/:id/reject", requireRole("Farmer"), wrap(async (req, res) => {
  const rows = await query(
    `UPDATE bids SET status = 'rejected', decided_at = now()
     WHERE id = $1 AND status = 'pending'
       AND listing_id IN (SELECT id FROM listings WHERE seller_id = $2) RETURNING *`,
    [idParam(req), req.user!.id]
  );
  if (!rows[0]) throw new HttpError(404, "Pending bid not found on one of your listings.");
  res.json(mBid(rows[0]));
}));

// Accepting a bid reserves the stock and creates the order, atomically.
marketRouter.post("/bids/:id/accept", requireRole("Farmer"), wrap(async (req, res) => {
  const bidId = idParam(req);
  const userId = req.user!.id;

  const order = await withTransaction(async (q) => {
    const bid = (await q(`SELECT * FROM bids WHERE id = $1`, [bidId]))[0];
    if (!bid) throw new HttpError(404, "Bid not found.");
    const listing = (await q(`SELECT * FROM listings WHERE id = $1`, [bid.listing_id]))[0];
    if (!listing || listing.seller_id !== userId) throw new HttpError(403, "That bid is not on one of your listings.");

    // Guard against double-accept: only a still-pending bid can flip.
    const flipped = await q(
      `UPDATE bids SET status = 'accepted', decided_at = now() WHERE id = $1 AND status = 'pending' RETURNING id`, [bidId]
    );
    if (!flipped[0]) throw new HttpError(409, "This bid is no longer pending.");

    // Atomic stock reservation: succeeds only if enough is still available.
    const reserved = await q(
      `UPDATE listings SET available_kg = available_kg - $1
       WHERE id = $2 AND status = 'open' AND available_kg >= $1 RETURNING *`,
      [bid.quantity_kg, bid.listing_id]
    );
    if (!reserved[0]) {
      // Real Postgres rolls the whole transaction back when we throw. The in-memory
      // dev database (pg-mem) ignores ROLLBACK, so undo the bid flip explicitly too.
      await q(`UPDATE bids SET status = 'pending', decided_at = NULL WHERE id = $1`, [bidId]);
      throw new HttpError(409, "Not enough stock left on this listing for that bid.");
    }
    if (reserved[0].available_kg === 0) {
      await q(`UPDATE listings SET status = 'sold_out' WHERE id = $1`, [bid.listing_id]);
    }

    const total = Math.round(bid.quantity_kg * bid.price_paise_per_kg);
    const created = await q(
      `INSERT INTO orders (id, listing_id, bid_id, seller_id, buyer_id, crop_name, quantity_kg, price_paise_per_kg, total_paise)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [randomUUID(), bid.listing_id, bid.id, listing.seller_id, bid.buyer_id, listing.crop_name,
        bid.quantity_kg, bid.price_paise_per_kg, total]
    );
    return created[0];
  });

  res.status(201).json(mOrder(order));
}));

// ===== Orders =====

async function loadOrderForParty(orderId: string, userId: string, role?: string) {
  const o = (await query(`SELECT * FROM orders WHERE id = $1`, [orderId]))[0];
  if (!o) throw new HttpError(404, "Order not found.");
  const isParty = o.buyer_id === userId || o.seller_id === userId;
  if (!isParty && role !== "Admin") throw new HttpError(404, "Order not found."); // don't reveal existence
  return o;
}

marketRouter.get("/orders", wrap(async (req, res) => {
  const { limit, offset } = paging(req);
  const rows = await query(
    `SELECT * FROM orders WHERE buyer_id = $1 OR seller_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [req.user!.id, limit, offset]
  );
  res.json(rows.map(mOrder));
}));

marketRouter.get("/orders/:id", wrap(async (req, res) => {
  const o = await loadOrderForParty(idParam(req), req.user!.id, req.user!.role);
  const payments = await query(`SELECT * FROM payments WHERE order_id = $1 ORDER BY created_at ASC`, [o.id]);
  const shipment = (await query(`SELECT * FROM shipments WHERE order_id = $1`, [o.id]))[0];
  const events = shipment
    ? await query(`SELECT * FROM shipment_events WHERE shipment_id = $1 ORDER BY created_at ASC`, [shipment.id])
    : [];
  res.json({
    order: mOrder(o),
    payments: payments.map(mPayment),
    shipment: shipment ? mShipment(shipment) : null,
    shipmentEvents: events.map((e: any) => ({ id: e.id, status: e.status, note: e.note, actorId: e.actor_id, createdAt: e.created_at })),
  });
}));

// Buyer pays -> money sits in escrow (ledger entry; see the note at the top of this file).
marketRouter.post("/orders/:id/pay", requireRole("Buyer"), wrap(async (req, res) => {
  const orderId = idParam(req);
  const userId = req.user!.id;
  const result = await withTransaction(async (q) => {
    const moved = await q(
      `UPDATE orders SET status = 'paid', updated_at = now()
       WHERE id = $1 AND buyer_id = $2 AND status = 'pending_payment' RETURNING *`, [orderId, userId]
    );
    if (!moved[0]) throw new HttpError(409, "This order is not awaiting your payment.");
    const pay = await q(
      `INSERT INTO payments (id, order_id, amount_paise, provider, provider_ref, status, escrow_status)
       VALUES ($1,$2,$3,'ledger',$4,'captured','held') RETURNING *`,
      [randomUUID(), orderId, moved[0].total_paise, "LEDGER-" + randomBytes(5).toString("hex").toUpperCase()]
    );
    return { order: moved[0], payment: pay[0] };
  });
  res.json({ order: mOrder(result.order), payment: mPayment(result.payment) });
}));

// Cancel before shipment. A paid order's escrow is refunded and the stock goes back on the listing.
marketRouter.post("/orders/:id/cancel", wrap(async (req, res) => {
  const orderId = idParam(req);
  const userId = req.user!.id;
  const cancelled = await withTransaction(async (q) => {
    const upd = await q(
      `UPDATE orders SET status = 'cancelled', updated_at = now()
       WHERE id = $1 AND (buyer_id = $2 OR seller_id = $2) AND status IN ('pending_payment','paid') RETURNING *`,
      [orderId, userId]
    );
    if (!upd[0]) throw new HttpError(409, "This order can't be cancelled (not yours, or already shipped/closed).");
    await q(
      `UPDATE payments SET status = 'refunded', escrow_status = 'refunded', released_at = now()
       WHERE order_id = $1 AND escrow_status = 'held'`, [orderId]
    );
    await q(
      `UPDATE listings SET available_kg = available_kg + $1,
              status = CASE WHEN status = 'sold_out' THEN 'open' ELSE status END
       WHERE id = $2`, [upd[0].quantity_kg, upd[0].listing_id]
    );
    return upd[0];
  });
  res.json(mOrder(cancelled));
}));

// Seller books the shipment (order must be paid).
marketRouter.post("/orders/:id/ship", requireRole("Farmer"), wrap(async (req, res) => {
  const orderId = idParam(req);
  const userId = req.user!.id;
  const pickup = str(req.body?.pickupAddress, "pickupAddress", { max: 300 });
  const drop = str(req.body?.dropAddress, "dropAddress", { max: 300 });

  let carrierId: string | null = null;
  if (req.body?.carrierId) {
    const carrier = typeof req.body.carrierId === "string" ? findUserById(req.body.carrierId) : undefined;
    if (!carrier || carrier.role !== "Logistics Provider") throw new HttpError(400, "carrierId must be a registered Logistics Provider.");
    carrierId = carrier.id;
  }

  const out = await withTransaction(async (q) => {
    const moved = await q(
      `UPDATE orders SET status = 'shipped', updated_at = now()
       WHERE id = $1 AND seller_id = $2 AND status = 'paid' RETURNING *`, [orderId, userId]
    );
    if (!moved[0]) throw new HttpError(409, "Only a paid order that you sell can be shipped.");
    const ship = (await q(
      `INSERT INTO shipments (id, order_id, carrier_id, tracking_code, pickup_address, drop_address)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [randomUUID(), orderId, carrierId, "AGC-" + randomBytes(4).toString("hex").toUpperCase(), pickup, drop]
    ))[0];
    await q(`INSERT INTO shipment_events (id, shipment_id, status, note, actor_id) VALUES ($1,$2,'booked',$3,$4)`,
      [randomUUID(), ship.id, "Shipment booked by seller", userId]);
    return { order: moved[0], shipment: ship };
  });
  res.status(201).json({ order: mOrder(out.order), shipment: mShipment(out.shipment) });
}));

// Buyer confirms receipt -> escrow released to the seller, order completed.
marketRouter.post("/orders/:id/confirm-delivery", requireRole("Buyer"), wrap(async (req, res) => {
  const orderId = idParam(req);
  const done = await withTransaction(async (q) => {
    const upd = await q(
      `UPDATE orders SET status = 'completed', updated_at = now()
       WHERE id = $1 AND buyer_id = $2 AND status = 'delivered' RETURNING *`, [orderId, req.user!.id]
    );
    if (!upd[0]) throw new HttpError(409, "Only a delivered order you bought can be confirmed.");
    await q(`UPDATE payments SET escrow_status = 'released', released_at = now() WHERE order_id = $1 AND escrow_status = 'held'`, [orderId]);
    return upd[0];
  });
  res.json(mOrder(done));
}));

// ===== Shipments =====

const SHIP_FLOW = ["booked", "picked_up", "in_transit", "delivered"];

// Seller may hand the shipment to a registered Logistics Provider.
marketRouter.post("/shipments/:id/assign-carrier", requireRole("Farmer"), wrap(async (req, res) => {
  const carrierId = str(req.body?.carrierId, "carrierId", { required: true, max: 80 })!;
  const carrier = findUserById(carrierId);
  if (!carrier || carrier.role !== "Logistics Provider") throw new HttpError(400, "carrierId must be a registered Logistics Provider.");
  const rows = await query(
    `UPDATE shipments SET carrier_id = $1, updated_at = now()
     WHERE id = $2 AND status <> 'delivered' AND order_id IN (SELECT id FROM orders WHERE seller_id = $3) RETURNING *`,
    [carrier.id, idParam(req), req.user!.id]
  );
  if (!rows[0]) throw new HttpError(404, "Active shipment on one of your orders not found.");
  res.json(mShipment(rows[0]));
}));

// Assigned carrier or the seller moves it forward one step at a time.
marketRouter.post("/shipments/:id/events", wrap(async (req, res) => {
  const shipmentId = idParam(req);
  const user = req.user!;
  const next = str(req.body?.status, "status", { required: true, max: 20 })!;
  if (!SHIP_FLOW.includes(next)) throw new HttpError(400, `status must be one of ${SHIP_FLOW.join(", ")}.`);
  const note = str(req.body?.note, "note", { max: 300 });

  const out = await withTransaction(async (q) => {
    const ship = (await q(`SELECT s.*, o.seller_id FROM shipments s JOIN orders o ON o.id = s.order_id WHERE s.id = $1`, [shipmentId]))[0];
    if (!ship) throw new HttpError(404, "Shipment not found.");
    const isSeller = ship.seller_id === user.id;
    const isCarrier = user.role === "Logistics Provider" && ship.carrier_id === user.id;
    if (!isSeller && !isCarrier) throw new HttpError(404, "Shipment not found.");

    if (SHIP_FLOW.indexOf(next) !== SHIP_FLOW.indexOf(ship.status) + 1) {
      throw new HttpError(409, `Shipment is "${ship.status}"; the next valid status is "${SHIP_FLOW[SHIP_FLOW.indexOf(ship.status) + 1] ?? "none"}".`);
    }
    // Conditional update keeps two simultaneous updates from both succeeding.
    const upd = await q(`UPDATE shipments SET status = $1, updated_at = now() WHERE id = $2 AND status = $3 RETURNING *`, [next, shipmentId, ship.status]);
    if (!upd[0]) throw new HttpError(409, "Shipment was updated by someone else. Refresh and retry.");
    await q(`INSERT INTO shipment_events (id, shipment_id, status, note, actor_id) VALUES ($1,$2,$3,$4,$5)`,
      [randomUUID(), shipmentId, next, note, user.id]);
    if (next === "delivered") {
      await q(`UPDATE orders SET status = 'delivered', updated_at = now() WHERE id = $1 AND status = 'shipped'`, [ship.order_id]);
    }
    return upd[0];
  });
  res.status(201).json(mShipment(out));
}));

marketRouter.get("/shipments/mine", wrap(async (req, res) => {
  const rows = await query(
    `SELECT s.* FROM shipments s JOIN orders o ON o.id = s.order_id
     WHERE o.buyer_id = $1 OR o.seller_id = $1 OR s.carrier_id = $1 ORDER BY s.created_at DESC LIMIT 100`, [req.user!.id]
  );
  res.json(rows.map(mShipment));
}));

// ===== Warehouse stock (Warehouse Operator, Farmer) =====

marketRouter.post("/stock", requireRole("Warehouse Operator", "Farmer"), wrap(async (req, res) => {
  const b = req.body ?? {};
  const row = (await query(
    `INSERT INTO warehouse_stock (id, owner_id, warehouse_name, location, crop_name, quantity_kg) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [randomUUID(), req.user!.id, str(b.warehouseName, "warehouseName", { required: true, max: 120 }),
      str(b.location, "location", { max: 160 }), str(b.cropName, "cropName", { required: true, max: 80 }),
      num(b.quantityKg, "quantityKg", { required: true, min: 0, max: 100000000 })]
  ))[0];
  res.status(201).json(mStock(row));
}));

marketRouter.get("/stock", requireRole("Warehouse Operator", "Farmer"), wrap(async (req, res) => {
  const rows = await query(`SELECT * FROM warehouse_stock WHERE owner_id = $1 ORDER BY updated_at DESC`, [req.user!.id]);
  res.json(rows.map(mStock));
}));

// Stock in (+) or out (-). Never lets quantity go negative.
marketRouter.post("/stock/:id/adjust", requireRole("Warehouse Operator", "Farmer"), wrap(async (req, res) => {
  const delta = num(req.body?.deltaKg, "deltaKg", { required: true, min: -100000000, max: 100000000 })!;
  const rows = await query(
    `UPDATE warehouse_stock SET quantity_kg = quantity_kg + $1, updated_at = now()
     WHERE id = $2 AND owner_id = $3 AND quantity_kg + $1 >= 0 RETURNING *`,
    [delta, idParam(req), req.user!.id]
  );
  if (!rows[0]) throw new HttpError(409, "Stock row not found, or that would take it below zero.");
  res.json(mStock(rows[0]));
}));

// ===== Admin overview =====

marketRouter.get("/stats", requireRole("Admin"), wrap(async (_req, res) => {
  const one = async (sql: string) => Number((await query(sql))[0]?.n ?? 0);
  res.json({
    farms: await one(`SELECT count(*) AS n FROM farms`),
    openListings: await one(`SELECT count(*) AS n FROM listings WHERE status = 'open'`),
    pendingBids: await one(`SELECT count(*) AS n FROM bids WHERE status = 'pending'`),
    orders: await one(`SELECT count(*) AS n FROM orders`),
    completedOrders: await one(`SELECT count(*) AS n FROM orders WHERE status = 'completed'`),
    completedValue: toRupees(await one(`SELECT COALESCE(sum(total_paise), 0) AS n FROM orders WHERE status = 'completed'`)),
    escrowHeld: toRupees(await one(`SELECT COALESCE(sum(amount_paise), 0) AS n FROM payments WHERE escrow_status = 'held'`)),
  });
}));
