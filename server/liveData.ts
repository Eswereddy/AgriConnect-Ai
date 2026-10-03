// ==========================================
// LIVE DATA FEEDS  (/api/live/*)
// ==========================================
//   GET /api/live/status                         which feeds are configured
//   GET /api/live/weather?place=Anantapur        (or ?lat=14.68&lon=77.6)
//   GET /api/live/mandi?state=&district=&market=&commodity=&limit=
//   GET /api/live/mandi/trend?commodity=&market=&days=30
//
// Sources
//   Weather : Open-Meteo (https://open-meteo.com). Free, no API key. NOTE: the free tier
//             is for NON-COMMERCIAL use - buy their commercial plan before charging users.
//             (IMD has no open public API; Open-Meteo is the practical alternative.)
//   Mandi   : data.gov.in "Current daily price of various commodities from various
//             markets (Mandi)" - the official open dataset fed by Agmarknet.
//             Needs a FREE key: DATA_GOV_API_KEY (register at https://data.gov.in).
//
// Principles
//   - NEVER invent data. If a feed is unavailable the API says so (503/502) or serves
//     previously fetched real data clearly marked stale - it never returns made-up numbers.
//   - Responses are cached (weather 15 min, mandi 30 min) to protect rate limits.
//   - Every mandi fetch is saved to Postgres, building a real price history for trends.

import { Router } from "express";
import { randomUUID } from "crypto";
import { requireAuth, type AuthedRequest } from "./auth";
import { query, pgAvailable } from "./pg";
import { HttpError, wrap } from "./marketplace";

const WEATHER_TTL = 15 * 60 * 1000;
const MANDI_TTL = 30 * 60 * 1000;
const DEFAULT_MANDI_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";

const cache = new Map<string, { at: number; data: any }>();
const fromCache = (key: string, ttl: number) => {
  const hit = cache.get(key);
  return hit && Date.now() - hit.at < ttl ? hit.data : null;
};
const toCache = (key: string, data: any) => {
  if (cache.size > 500) cache.clear();
  cache.set(key, { at: Date.now(), data });
};

/** GET JSON with a timeout. Error messages never include the URL (it may carry an API key). */
async function getJson(url: string, label: string): Promise<any> {
  let res: Response;
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(10000), headers: { Accept: "application/json" } });
  } catch {
    throw new HttpError(502, `${label} is not reachable right now.`);
  }
  if (!res.ok) throw new HttpError(502, `${label} returned an error (${res.status}).`);
  try { return await res.json(); } catch { throw new HttpError(502, `${label} returned an unreadable response.`); }
}

// ======================= WEATHER =======================

const WMO: Record<number, string> = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast", 45: "Fog", 48: "Rime fog",
  51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle", 56: "Freezing drizzle", 57: "Freezing drizzle",
  61: "Light rain", 63: "Rain", 65: "Heavy rain", 66: "Freezing rain", 67: "Freezing rain",
  71: "Light snow", 73: "Snow", 75: "Heavy snow", 77: "Snow grains",
  80: "Light showers", 81: "Showers", 82: "Violent showers", 85: "Snow showers", 86: "Snow showers",
  95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Thunderstorm with hail",
};

interface Place { name: string; latitude: number; longitude: number; region?: string }

async function geocode(place: string): Promise<Place> {
  const base = process.env.OPEN_METEO_GEOCODE_URL || "https://geocoding-api.open-meteo.com/v1/search";
  const j = await getJson(`${base}?name=${encodeURIComponent(place)}&count=1&language=en&country_code=IN`, "The place lookup service");
  const r = j?.results?.[0];
  if (!r) throw new HttpError(404, `Could not find a place called "${place}" in India.`);
  return { name: r.name, latitude: r.latitude, longitude: r.longitude, region: r.admin1 };
}

/**
 * Simple, transparent rules over the real forecast. These are guidance, not agronomist
 * advice, and are labelled that way in the response.
 */
export function farmAdvisories(d: { daily: any[]; current: any }): string[] {
  const out: string[] = [];
  const next2 = d.daily.slice(0, 2);
  const rain48 = next2.reduce((a, x) => a + (x.rainMm || 0), 0);
  const maxProb48 = Math.max(0, ...next2.map((x) => x.rainChancePct || 0));
  if (rain48 >= 5 || maxProb48 >= 60) {
    out.push(`Rain likely in the next 48 hours (${Math.round(rain48)} mm, up to ${maxProb48}% chance): postpone spraying and fertiliser top-dressing, and hold off irrigation.`);
  }
  if (Math.max(0, ...d.daily.slice(0, 3).map((x) => x.windMaxKmh || 0)) >= 25) {
    out.push("Strong winds expected (25+ km/h): avoid pesticide spraying, it will drift.");
  }
  if (d.daily.slice(0, 3).some((x) => (x.tempMaxC ?? 0) >= 40)) {
    out.push("Very hot days ahead (40°C+): irrigate early morning or evening and watch for heat stress.");
  }
  if (d.daily.slice(0, 3).some((x) => (x.tempMinC ?? 99) <= 5)) {
    out.push("Cold nights ahead (5°C or below): frost risk for sensitive crops.");
  }
  const rain7 = d.daily.reduce((a, x) => a + (x.rainMm || 0), 0);
  const et7 = d.daily.reduce((a, x) => a + (x.evapotranspirationMm || 0), 0);
  if (rain7 < 2 && et7 >= 25) {
    out.push(`Dry week ahead (${rain7.toFixed(1)} mm rain vs about ${Math.round(et7)} mm crop water demand): plan irrigation.`);
  }
  if (!out.length) out.push("No weather alerts for the next few days. Normal field operations look fine.");
  return out;
}

export async function getWeather(opts: { place?: string; lat?: number; lon?: number }) {
  let place: Place;
  if (opts.lat !== undefined && opts.lon !== undefined) {
    place = { name: `${opts.lat.toFixed(2)}, ${opts.lon.toFixed(2)}`, latitude: opts.lat, longitude: opts.lon };
  } else if (opts.place) {
    const gk = `geo:${opts.place.toLowerCase()}`;
    place = fromCache(gk, 24 * 60 * 60 * 1000) ?? (await geocode(opts.place));
    toCache(gk, place);
  } else {
    throw new HttpError(400, "Give a place name or lat and lon.");
  }

  const key = `wx:${place.latitude.toFixed(2)},${place.longitude.toFixed(2)}`;
  const hit = fromCache(key, WEATHER_TTL);
  if (hit) return { ...hit, place, cached: true };

  const base = process.env.OPEN_METEO_FORECAST_URL || "https://api.open-meteo.com/v1/forecast";
  const url =
    `${base}?latitude=${place.latitude}&longitude=${place.longitude}&timezone=auto&forecast_days=7` +
    `&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,et0_fao_evapotranspiration`;
  const j = await getJson(url, "The weather service");
  if (!j?.current || !j?.daily?.time) throw new HttpError(502, "The weather service returned incomplete data.");

  const c = j.current;
  const current = {
    tempC: c.temperature_2m, humidityPct: c.relative_humidity_2m, rainMm: c.precipitation,
    windKmh: c.wind_speed_10m, summary: WMO[c.weather_code] ?? "Unknown", time: c.time,
  };
  const daily = (j.daily.time as string[]).map((date, i) => ({
    date,
    summary: WMO[j.daily.weather_code?.[i]] ?? "Unknown",
    tempMaxC: j.daily.temperature_2m_max?.[i], tempMinC: j.daily.temperature_2m_min?.[i],
    rainMm: j.daily.precipitation_sum?.[i], rainChancePct: j.daily.precipitation_probability_max?.[i],
    windMaxKmh: j.daily.wind_speed_10m_max?.[i], evapotranspirationMm: j.daily.et0_fao_evapotranspiration?.[i],
  }));
  const data = {
    source: "open-meteo.com", fetchedAt: new Date().toISOString(), current, daily,
    advisories: farmAdvisories({ daily, current }),
    advisoryNote: "Rule-based guidance from the forecast, not agronomist advice.",
  };
  toCache(key, data);
  return { ...data, place, cached: false };
}

// ======================= MANDI PRICES =======================

export interface MandiRecord {
  state: string; district: string; market: string; commodity: string; variety: string; grade: string;
  arrivalDate: string; minPerQuintal: number; maxPerQuintal: number; modalPerQuintal: number; modalPerKg: number;
}
interface MandiFilter { state?: string; district?: string; market?: string; commodity?: string }

const lc = (v: unknown) => String(v ?? "").trim().toLowerCase();

function toIso(d: string): string | null {
  const m = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/.exec(d.trim());
  if (m) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  return /^\d{4}-\d{2}-\d{2}$/.test(d.trim()) ? d.trim() : null;
}

/** data.gov.in has used both Capitalised_Keys and lowercase_keys over time; accept either. */
function normaliseRecord(raw: any): MandiRecord | null {
  const r: Record<string, any> = {};
  for (const [k, v] of Object.entries(raw ?? {})) r[k.toLowerCase()] = v;
  const date = toIso(String(r.arrival_date ?? ""));
  const min = Number(r.min_price), max = Number(r.max_price), modal = Number(r.modal_price);
  if (!date || !r.commodity || !r.market || ![min, max, modal].every(Number.isFinite) || modal <= 0) return null;
  return {
    state: String(r.state ?? "").trim(), district: String(r.district ?? "").trim(), market: String(r.market).trim(),
    commodity: String(r.commodity).trim(), variety: String(r.variety ?? "").trim(), grade: String(r.grade ?? "").trim(),
    arrivalDate: date, minPerQuintal: min, maxPerQuintal: max, modalPerQuintal: modal,
    modalPerKg: Math.round((modal / 100) * 100) / 100, // Rs/quintal -> Rs/kg
  };
}

/** Always applied locally too, so a filter the API ignores can never leak other states' rows. */
function matches(rec: MandiRecord, f: MandiFilter): boolean {
  const has = (hay: string, needle?: string) => !needle || lc(hay).includes(lc(needle));
  return (!f.state || lc(rec.state) === lc(f.state)) && has(rec.district, f.district) && has(rec.market, f.market) && has(rec.commodity, f.commodity);
}

async function fetchMandiUpstream(f: MandiFilter): Promise<MandiRecord[]> {
  const key = process.env.DATA_GOV_API_KEY!;
  const base = process.env.DATA_GOV_MANDI_URL || DEFAULT_MANDI_URL;
  const PAGE = 500;
  const MAX_PAGES = 6; // up to 3000 rows - enough for one whole state in a day
  const titleCase = (v: string) => v.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  // data.gov.in has exposed filters two ways: `filters[state.keyword]` (current) and
  // `filters[State]` (older). We try the current form first, then the older one.
  // The upstream "keyword" filters are exact + case-sensitive ("groundnut" finds nothing,
  // "Groundnut" works). So when a state is given we send ONLY the state upstream and let
  // matches() do the forgiving district/market/commodity search locally.
  const build = (style: "new" | "legacy", offset: number) => {
    const p = new URLSearchParams({ "api-key": key, format: "json", limit: String(PAGE), offset: String(offset) });
    const set = (name: string, v?: string) => {
      if (v) p.set(`filters[${style === "new" ? name.toLowerCase() + ".keyword" : name}]`, v);
    };
    set("State", f.state);
    if (!f.state) { // no state: narrow upstream instead, using the dataset's own capitalisation
      set("District", f.district && titleCase(f.district));
      set("Commodity", f.commodity && titleCase(f.commodity));
      set("Market", f.market && titleCase(f.market));
    }
    return `${base}?${p.toString()}`;
  };
  const pull = async (style: "new" | "legacy") => {
    const all: MandiRecord[] = [];
    for (let page = 0; page < MAX_PAGES; page++) {
      const j = await getJson(build(style, page * PAGE), "The mandi price service (data.gov.in)");
      const raw = (j?.records ?? []) as any[];
      all.push(...raw.map(normaliseRecord).filter((x): x is MandiRecord => !!x));
      if (raw.length < PAGE || !f.state) break; // last page (or unfiltered: one page is enough)
    }
    return all.filter((x) => matches(x, f));
  };
  let rows: MandiRecord[] = [];
  let firstErr: unknown = null;
  try { rows = await pull("new"); } catch (e) { firstErr = e; }
  const anyFilter = Boolean(f.state || f.district || f.commodity || f.market);
  if (!rows.length && anyFilter) {
    try { rows = await pull("legacy"); firstErr = null; } catch (e) { firstErr = firstErr ?? e; }
  }
  if (!rows.length && firstErr) throw firstErr;
  return rows;
}

async function saveMandi(rows: MandiRecord[]): Promise<void> {
  if (!pgAvailable() || !rows.length) return;
  const uniq = new Map<string, MandiRecord>();
  for (const r of rows) uniq.set([r.state, r.district, r.market, r.commodity, r.variety, r.grade, r.arrivalDate].join("|"), r);
  const list = [...uniq.values()];
  for (let i = 0; i < list.length; i += 40) {
    const chunk = list.slice(i, i + 40);
    const params: any[] = [];
    const values = chunk.map((r, j) => {
      const o = j * 11;
      params.push(randomUUID(), r.state, r.district, r.market, r.commodity, r.variety, r.grade, r.arrivalDate, r.minPerQuintal, r.maxPerQuintal, r.modalPerQuintal);
      return `($${o + 1},$${o + 2},$${o + 3},$${o + 4},$${o + 5},$${o + 6},$${o + 7},$${o + 8},$${o + 9},$${o + 10},$${o + 11})`;
    });
    await query(
      `INSERT INTO mandi_prices (id,state,district,market,commodity,variety,grade,arrival_date,min_price,max_price,modal_price)
       VALUES ${values.join(",")}
       ON CONFLICT (state,district,market,commodity,variety,grade,arrival_date)
       DO UPDATE SET min_price = EXCLUDED.min_price, max_price = EXCLUDED.max_price, modal_price = EXCLUDED.modal_price, fetched_at = now()`,
      params
    );
  }
}

const rowToRecord = (r: any): MandiRecord => ({
  state: r.state, district: r.district, market: r.market, commodity: r.commodity, variety: r.variety, grade: r.grade,
  arrivalDate: typeof r.arrival_date === "string" ? r.arrival_date.slice(0, 10) : new Date(r.arrival_date).toISOString().slice(0, 10),
  minPerQuintal: r.min_price, maxPerQuintal: r.max_price, modalPerQuintal: r.modal_price,
  modalPerKg: Math.round((r.modal_price / 100) * 100) / 100,
});

async function loadStoredMandi(f: MandiFilter, limit: number): Promise<MandiRecord[]> {
  if (!pgAvailable()) return [];
  const where: string[] = []; const params: any[] = [];
  if (f.state) { params.push(f.state); where.push(`lower(state) = lower($${params.length})`); }
  for (const [col, v] of [["district", f.district], ["market", f.market], ["commodity", f.commodity]] as const) {
    if (v) { params.push(`%${v}%`); where.push(`${col} ILIKE $${params.length}`); }
  }
  params.push(limit);
  const rows = await query(
    `SELECT * FROM mandi_prices ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY arrival_date DESC, commodity, market LIMIT $${params.length}`, params
  );
  return rows.map(rowToRecord);
}

export async function getMandiPrices(f: MandiFilter, limit = 100) {
  if (!process.env.DATA_GOV_API_KEY) {
    throw new HttpError(503, "Live mandi prices are not configured. Set DATA_GOV_API_KEY (free key from data.gov.in).");
  }
  const ck = `mandi:${lc(f.state)}|${lc(f.district)}|${lc(f.market)}|${lc(f.commodity)}`;
  const hit = fromCache(ck, MANDI_TTL);
  if (hit) return { ...hit, records: hit.records.slice(0, limit), source: "cache" as const };

  try {
    const rows = await fetchMandiUpstream(f);
    rows.sort((a, b) => b.arrivalDate.localeCompare(a.arrivalDate) || a.commodity.localeCompare(b.commodity));
    saveMandi(rows).catch((e) => console.error("[live] could not store mandi prices:", e?.message));
    const data = { source: "data.gov.in" as const, stale: false, fetchedAt: new Date().toISOString(), records: rows };
    toCache(ck, data);
    return { ...data, records: rows.slice(0, limit) };
  } catch (err) {
    // Upstream is down: serve REAL previously stored prices, clearly marked stale.
    const stored = await loadStoredMandi(f, limit).catch(() => []);
    if (stored.length) {
      return { source: "stored" as const, stale: true, fetchedAt: null, records: stored,
        note: "The live feed is unavailable, so these are the most recent prices saved earlier." };
    }
    throw err;
  }
}

export async function getMandiTrend(commodity: string, market: string | undefined, days: number) {
  if (!pgAvailable()) throw new HttpError(503, "The database is not available.");
  const cutoff = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
  const params: any[] = [`%${commodity}%`, cutoff];
  let marketSql = "";
  if (market) { params.push(`%${market}%`); marketSql = `AND market ILIKE $3`; }
  const rows = await query(
    `SELECT arrival_date, avg(modal_price) AS modal, min(min_price) AS lo, max(max_price) AS hi, count(*) AS n
     FROM mandi_prices WHERE commodity ILIKE $1 ${marketSql} AND arrival_date >= $2
     GROUP BY arrival_date ORDER BY arrival_date ASC`, params
  );
  return rows.map((r: any) => ({
    date: typeof r.arrival_date === "string" ? r.arrival_date.slice(0, 10) : new Date(r.arrival_date).toISOString().slice(0, 10),
    modalPerQuintal: Math.round(Number(r.modal)), lowPerQuintal: Number(r.lo), highPerQuintal: Number(r.hi), markets: Number(r.n),
  }));
}

// ======================= ROUTER =======================

export const liveRouter = Router();
liveRouter.use((req, res, next) => requireAuth(req as AuthedRequest, res, next));

const text = (v: unknown, max = 80): string | undefined => {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  if (t.length > max) throw new HttpError(400, "A search value is too long.");
  return t || undefined;
};

liveRouter.get("/status", wrap(async (_req, res) => {
  res.json({
    weather: { configured: true, source: "open-meteo.com", needsKey: false },
    mandi: { configured: Boolean(process.env.DATA_GOV_API_KEY), source: "data.gov.in" },
  });
}));

liveRouter.get("/weather", wrap(async (req, res) => {
  const place = text(req.query.place);
  const latQ = req.query.lat, lonQ = req.query.lon;
  if (latQ !== undefined || lonQ !== undefined) {
    const lat = Number(latQ), lon = Number(lonQ);
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      throw new HttpError(400, "lat must be -90..90 and lon -180..180.");
    }
    res.json(await getWeather({ lat, lon }));
    return;
  }
  if (!place) throw new HttpError(400, "Give ?place=<name> or ?lat=&lon=.");
  res.json(await getWeather({ place }));
}));

liveRouter.get("/mandi", wrap(async (req, res) => {
  const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? "100"), 10) || 100, 1), 500);
  res.json(await getMandiPrices({
    state: text(req.query.state), district: text(req.query.district), market: text(req.query.market), commodity: text(req.query.commodity),
  }, limit));
}));

liveRouter.get("/mandi/trend", wrap(async (req, res) => {
  const commodity = text(req.query.commodity);
  if (!commodity) throw new HttpError(400, "commodity is required.");
  const days = Math.min(Math.max(parseInt(String(req.query.days ?? "30"), 10) || 30, 1), 365);
  res.json({ commodity, market: text(req.query.market) ?? null, days, points: await getMandiTrend(commodity, text(req.query.market), days) });
}));
