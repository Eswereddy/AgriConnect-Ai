// ==========================================
// FARMER PROFILES / VALIDATION API  (/api/farmer-profiles/*)
// ==========================================
// Stores the farmer data collected on the ground (name/ID, district, crop, quantity,
// expected price, market price, selling preference, buyer requirement, verification,
// contact permission, date collected) so Admins can validate it and Farmers can see their own.
//
// Rules (enforced here, not just in the UI):
//  - login required. Admin sees everything; a Farmer sees and edits only profiles they created.
//  - only an Admin can verify / reject. A Farmer editing a profile sends it back to "pending".
//  - NO phone numbers or contact details are stored - only whether the farmer GAVE permission.
//  - "Sample" rows (isSample) are demo placeholders and are always flagged.
//  - Prices are Rs per quintal (100 kg), the same unit as mandi prices.

import { Router } from "express";
import { randomUUID, randomBytes } from "crypto";
import { requireAuth, requireRole, type AuthedRequest } from "./auth";
import { query, pgAvailable } from "./pg";
import { HttpError, wrap, idParam } from "./marketplace";
import { SAMPLE_FARMERS } from "./farmerSampleData";

const PREFS = ["mandi", "direct_buyer", "fpo", "contract", "undecided"] as const;
const STATUSES = ["pending", "verified", "rejected"] as const;

const text = (v: unknown, field: string, o: { required?: boolean; max?: number } = {}): string | null => {
  const { required = false, max = 200 } = o;
  if (v === undefined || v === null || v === "") {
    if (required) throw new HttpError(400, `${field} is required.`);
    return null;
  }
  if (typeof v !== "string") throw new HttpError(400, `${field} must be text.`);
  const t = v.trim();
  if (!t) { if (required) throw new HttpError(400, `${field} is required.`); return null; }
  if (t.length > max) throw new HttpError(400, `${field} is too long (max ${max}).`);
  return t;
};
const money = (v: unknown, field: string, required = false): number | null => {
  if (v === undefined || v === null || v === "") {
    if (required) throw new HttpError(400, `${field} is required.`);
    return null;
  }
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0 || n > 100000000) throw new HttpError(400, `${field} must be a number, 0 or more.`);
  return n;
};
const oneOf = <T extends string>(v: unknown, list: readonly T[], field: string, dflt: T): T => {
  if (v === undefined || v === null || v === "") return dflt;
  const s = String(v).trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (!(list as readonly string[]).includes(s)) throw new HttpError(400, `${field} must be one of: ${list.join(", ")}.`);
  return s as T;
};
const bool = (v: unknown): boolean => {
  if (typeof v === "boolean") return v;
  return ["yes", "true", "1", "y"].includes(String(v ?? "").trim().toLowerCase());
};
const dateOnly = (v: unknown, field: string): string => {
  const s = text(v, field, { required: true, max: 10 })!;
  const m = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/.exec(s);
  const iso = m ? `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}` : s;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso) || Number.isNaN(Date.parse(iso))) throw new HttpError(400, `${field} must be a date like 2026-09-30.`);
  return iso;
};

interface Clean {
  farmerCode: string | null; farmerName: string; district: string; location: string | null; crop: string;
  quantityQuintals: number; expectedPrice: number | null; marketPrice: number | null; sellingPreference: string;
  buyerRequirement: string | null; verifiedStatus: string; contactPermission: boolean; collectedOn: string;
}

/** Accepts API (camelCase) and CSV-style (snake_case) names, so imports and the form share one validator. */
function clean(b: any): Clean {
  const g = (...k: string[]) => { for (const x of k) if (b?.[x] !== undefined) return b[x]; return undefined; };
  return {
    farmerCode: text(g("farmerCode", "farmer_id", "farmer_code"), "farmer ID", { max: 40 }),
    farmerName: text(g("farmerName", "farmer_name"), "Farmer name", { required: true, max: 120 })!,
    district: text(g("district"), "District", { required: true, max: 80 })!,
    location: text(g("location", "village"), "Location", { max: 120 }),
    crop: text(g("crop"), "Crop", { required: true, max: 80 })!,
    quantityQuintals: money(g("quantityQuintals", "quantity_quintals", "quantity"), "Quantity", true)!,
    expectedPrice: money(g("expectedPricePerQuintal", "expected_price_per_quintal", "expectedPrice"), "Expected price"),
    marketPrice: money(g("currentMarketPrice", "current_market_price_per_quintal", "marketPrice"), "Current market price"),
    sellingPreference: oneOf(g("sellingPreference", "selling_preference"), PREFS, "Selling preference", "undecided"),
    buyerRequirement: text(g("buyerRequirement", "buyer_requirement"), "Buyer requirement", { max: 300 }),
    verifiedStatus: oneOf(g("verifiedStatus", "verified_status"), STATUSES, "Verified status", "pending"),
    contactPermission: bool(g("contactPermission", "contact_permission")),
    collectedOn: dateOnly(g("collectedOn", "date_collected", "collected_on"), "Date collected"),
  };
}

const mapRow = (r: any, mandi: Map<string, { modal: number; date: string }>) => {
  const crop = String(r.crop).toLowerCase();
  let latest: { modal: number; date: string } | null = null;
  for (const [name, v] of mandi) if (name.includes(crop) || crop.includes(name)) { latest = v; break; }
  return {
    id: r.id, farmerCode: r.farmer_code, ownerId: r.owner_id, farmerName: r.farmer_name, district: r.district,
    location: r.location, crop: r.crop, quantityQuintals: r.quantity_quintals,
    expectedPricePerQuintal: r.expected_price_per_quintal, currentMarketPrice: r.current_market_price_per_quintal,
    latestMandiPrice: latest, sellingPreference: r.selling_preference, buyerRequirement: r.buyer_requirement,
    verifiedStatus: r.verified_status, contactPermission: r.contact_permission,
    collectedOn: typeof r.collected_on === "string" ? r.collected_on.slice(0, 10) : new Date(r.collected_on).toISOString().slice(0, 10),
    isSample: r.is_sample,
  };
};

/** Latest Andhra Pradesh mandi modal price per commodity (only exists once live prices have been saved). */
async function latestMandi(): Promise<Map<string, { modal: number; date: string }>> {
  const out = new Map<string, { modal: number; date: string }>();
  try {
    const rows = await query(
      `SELECT commodity, modal_price, arrival_date FROM mandi_prices WHERE lower(state) = 'andhra pradesh' ORDER BY arrival_date DESC LIMIT 3000`
    );
    const sums = new Map<string, { date: string; total: number; n: number }>();
    for (const r of rows) {
      const k = String(r.commodity).toLowerCase();
      const d = typeof r.arrival_date === "string" ? r.arrival_date.slice(0, 10) : new Date(r.arrival_date).toISOString().slice(0, 10);
      const cur = sums.get(k);
      if (!cur) sums.set(k, { date: d, total: Number(r.modal_price), n: 1 });
      else if (cur.date === d) { cur.total += Number(r.modal_price); cur.n++; }
    }
    for (const [k, v] of sums) out.set(k, { modal: Math.round(v.total / v.n), date: v.date });
  } catch { /* no mandi history yet: that is fine */ }
  return out;
}

const newCode = () => "FP-" + randomBytes(3).toString("hex").toUpperCase();

const COLS = `id, farmer_code, owner_id, farmer_name, district, location, crop, quantity_quintals, expected_price_per_quintal,
  current_market_price_per_quintal, selling_preference, buyer_requirement, verified_status, contact_permission, collected_on, is_sample`;

async function insertOne(c: Clean, ownerId: string, isSample: boolean): Promise<{ row: any } | { duplicate: true }> {
  const code = c.farmerCode ?? newCode();
  // Check first (works the same on real Postgres and the in-memory dev database); the UNIQUE
  // constraint still guards against two requests racing, and that case is reported as a duplicate too.
  if ((await query(`SELECT 1 FROM farmer_profiles WHERE farmer_code = $1`, [code])).length) return { duplicate: true };
  try {
    const rows = await query(
      `INSERT INTO farmer_profiles (id, farmer_code, owner_id, farmer_name, district, location, crop, quantity_quintals, expected_price_per_quintal,
         current_market_price_per_quintal, selling_preference, buyer_requirement, verified_status, contact_permission, collected_on, is_sample)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING ${COLS}`,
      [randomUUID(), code, ownerId, c.farmerName, c.district, c.location, c.crop, c.quantityQuintals, c.expectedPrice, c.marketPrice,
        c.sellingPreference, c.buyerRequirement, c.verifiedStatus, c.contactPermission, c.collectedOn, isSample]
    );
    return { row: rows[0] };
  } catch (e: any) {
    if (e?.code === "23505" || /unique|duplicate/i.test(String(e?.message))) return { duplicate: true };
    throw e;
  }
}

export const farmerProfilesRouter = Router();
farmerProfilesRouter.use((req, res, next) => requireAuth(req as AuthedRequest, res, next));
farmerProfilesRouter.use((req, res, next) => requireRole("Admin", "Farmer")(req as AuthedRequest, res, next));
farmerProfilesRouter.use((_req, _res, next) => {
  if (!pgAvailable()) return next(new HttpError(503, "The database is not available."));
  next();
});

const isAdmin = (req: AuthedRequest) => req.user!.role === "Admin";
const adminOnly = (req: any, res: any, next: any) => requireRole("Admin")(req, res, next);

async function loadOwned(req: AuthedRequest, id: string) {
  const rows = await query(`SELECT ${COLS} FROM farmer_profiles WHERE id = $1`, [id]);
  if (!rows.length || (!isAdmin(req) && rows[0].owner_id !== req.user!.id)) throw new HttpError(404, "Farmer profile not found.");
  return rows[0];
}

farmerProfilesRouter.get("/", wrap(async (req, res) => {
  const where: string[] = []; const params: any[] = [];
  if (!isAdmin(req)) { params.push(req.user!.id); where.push(`owner_id = $${params.length}`); }
  const q = typeof req.query.q === "string" ? req.query.q.trim().slice(0, 80) : "";
  if (q) { params.push(`%${q}%`); where.push(`(farmer_name ILIKE $${params.length} OR farmer_code ILIKE $${params.length} OR crop ILIKE $${params.length})`); }
  if (typeof req.query.district === "string" && req.query.district.trim()) { params.push(req.query.district.trim().slice(0, 80)); where.push(`lower(district) = lower($${params.length})`); }
  if (typeof req.query.status === "string" && (STATUSES as readonly string[]).includes(req.query.status)) { params.push(req.query.status); where.push(`verified_status = $${params.length}`); }
  const w = where.length ? "WHERE " + where.join(" AND ") : "";
  const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? "200"), 10) || 200, 1), 500);
  const rows = await query(`SELECT ${COLS} FROM farmer_profiles ${w} ORDER BY collected_on DESC, farmer_code ASC LIMIT ${limit}`, params);
  const mandi = await latestMandi();
  const profiles = rows.map((r: any) => mapRow(r, mandi));
  res.json({
    profiles,
    stats: {
      total: profiles.length,
      verified: profiles.filter((p: any) => p.verifiedStatus === "verified").length,
      pending: profiles.filter((p: any) => p.verifiedStatus === "pending").length,
      rejected: profiles.filter((p: any) => p.verifiedStatus === "rejected").length,
      contactAllowed: profiles.filter((p: any) => p.contactPermission).length,
      samples: profiles.filter((p: any) => p.isSample).length,
    },
  });
}));

farmerProfilesRouter.post("/", wrap(async (req, res) => {
  const c = clean(req.body);
  if (!isAdmin(req)) { c.verifiedStatus = "pending"; c.farmerCode = null; } // farmers cannot self-verify or pick IDs
  const r = await insertOne(c, req.user!.id, false);
  if ("duplicate" in r) throw new HttpError(409, "A farmer with this ID already exists.");
  res.status(201).json(mapRow(r.row, new Map()));
}));

farmerProfilesRouter.post("/bulk", adminOnly, wrap(async (req, res) => {
  const list = Array.isArray(req.body?.rows) ? req.body.rows : null;
  if (!list || !list.length) throw new HttpError(400, "Send { rows: [...] } with at least one row.");
  if (list.length > 500) throw new HttpError(400, "Import at most 500 rows at a time.");
  let inserted = 0; const skipped: { row: number; error: string }[] = [];
  for (let i = 0; i < list.length; i++) {
    try {
      const c = clean(list[i]);
      // Rows whose ID starts with DEMO- or SAMPLE- are placeholders: flag them so they can never be matched or published as real supply.
      const r = await insertOne(c, req.user!.id, /^(demo|sample)-/i.test(c.farmerCode ?? ""));
      if ("duplicate" in r) skipped.push({ row: i + 1, error: "This farmer ID already exists." }); else inserted++;
    } catch (e: any) {
      if (e instanceof HttpError) skipped.push({ row: i + 1, error: e.message }); else throw e;
    }
  }
  res.json({ inserted, skipped });
}));

farmerProfilesRouter.post("/load-sample", adminOnly, wrap(async (req, res) => {
  let inserted = 0;
  for (const s of SAMPLE_FARMERS) {
    const r = await insertOne(clean(s), req.user!.id, true);
    if (!("duplicate" in r)) inserted++;
  }
  res.json({ inserted, total: SAMPLE_FARMERS.length });
}));

farmerProfilesRouter.delete("/samples", adminOnly, wrap(async (_req, res) => {
  const rows = await query(`DELETE FROM farmer_profiles WHERE is_sample = true RETURNING id`);
  res.json({ removed: rows.length });
}));

farmerProfilesRouter.patch("/:id", wrap(async (req, res) => {
  const id = idParam(req);
  const cur = await loadOwned(req, id);
  const b = req.body ?? {};
  if (!isAdmin(req) && (b.verifiedStatus !== undefined || b.verified_status !== undefined)) {
    throw new HttpError(403, "Only an admin can change the verification status.");
  }
  const merged = clean({
    farmerCode: cur.farmer_code, farmerName: cur.farmer_name, district: cur.district, location: cur.location, crop: cur.crop,
    quantityQuintals: cur.quantity_quintals, expectedPricePerQuintal: cur.expected_price_per_quintal,
    currentMarketPrice: cur.current_market_price_per_quintal, sellingPreference: cur.selling_preference,
    buyerRequirement: cur.buyer_requirement, verifiedStatus: cur.verified_status, contactPermission: cur.contact_permission,
    collectedOn: typeof cur.collected_on === "string" ? cur.collected_on.slice(0, 10) : new Date(cur.collected_on).toISOString().slice(0, 10),
    ...b, // new values win; the farmer code can never be changed (ignored below)
  });
  // A farmer's edit must be re-checked by an admin.
  const status = isAdmin(req) ? merged.verifiedStatus : "pending";
  const rows = await query(
    `UPDATE farmer_profiles SET farmer_name=$2, district=$3, location=$4, crop=$5, quantity_quintals=$6, expected_price_per_quintal=$7,
       current_market_price_per_quintal=$8, selling_preference=$9, buyer_requirement=$10, verified_status=$11, contact_permission=$12,
       collected_on=$13, updated_at=now() WHERE id=$1 RETURNING ${COLS}`,
    [id, merged.farmerName, merged.district, merged.location, merged.crop, merged.quantityQuintals, merged.expectedPrice, merged.marketPrice,
      merged.sellingPreference, merged.buyerRequirement, status, merged.contactPermission, merged.collectedOn]
  );
  res.json(mapRow(rows[0], new Map()));
}));

farmerProfilesRouter.delete("/:id", wrap(async (req, res) => {
  const id = idParam(req);
  await loadOwned(req, id);
  await query(`DELETE FROM farmer_profiles WHERE id = $1`, [id]);
  res.json({ ok: true });
}));
