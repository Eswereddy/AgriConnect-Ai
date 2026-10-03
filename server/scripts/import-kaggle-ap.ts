// Turns the Kaggle mandi CSV into a small Andhra Pradesh-only file the app can use
// when live data.gov.in is unavailable.
//
//   1. Download the CSV from Kaggle:
//      https://www.kaggle.com/datasets/ishankat/daily-wholesale-commodity-prices-india-mandis
//   2. npm run import:kaggle -- path/to/downloaded.csv            (keeps the last 90 days in the file)
//      npm run import:kaggle -- path/to/downloaded.csv --days 180
//   3. Commit server/fallback/ap-mandi.json and push.
//
// Streams the file line by line, so a huge CSV is fine.

import fs from "fs";
import path from "path";
import readline from "readline";

const args = process.argv.slice(2);
const dIdx = args.indexOf("--days");
const file = args.find((a, i) => !a.startsWith("--") && (dIdx < 0 || i !== dIdx + 1)) ?? "";
const DAYS = dIdx >= 0 ? Math.max(1, parseInt(args[dIdx + 1], 10) || 90) : 90;
const STATE = "andhra pradesh";
const OUT = path.join(process.cwd(), "server", "fallback", "ap-mandi.json");

if (!file || !fs.existsSync(file)) {
  console.error("Usage: npm run import:kaggle -- <path-to-csv> [--days 90]\nFile not found: " + (file || "(none given)"));
  process.exit(1);
}

/** Splits one CSV line, respecting "quoted, values". */
function splitCsv(line: string): string[] {
  const out: string[] = []; let cur = ""; let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') { if (q && line[i + 1] === '"') { cur += '"'; i++; } else q = !q; }
    else if (c === "," && !q) { out.push(cur); cur = ""; }
    else cur += c;
  }
  out.push(cur);
  return out.map((v) => v.trim());
}

function toIso(d: string): string | null {
  const m = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/.exec(d.trim());
  if (m) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  const iso = /^(\d{4}-\d{2}-\d{2})/.exec(d.trim());
  return iso ? iso[1] : null;
}

async function main() {
  const rl = readline.createInterface({ input: fs.createReadStream(file, "utf8"), crlfDelay: Infinity });
  let header: string[] | null = null;
  let idx: Record<string, number> = {};
  let total = 0;
  const rows: any[] = [];

  for await (const line of rl) {
    if (!line.trim()) continue;
    if (!header) {
      header = splitCsv(line.replace(/^\uFEFF/, "")).map((h) => h.toLowerCase().replace(/[^a-z]/g, "_"));
      header.forEach((h, i) => (idx[h] = i));
      const need = ["state", "market", "commodity", "arrival_date", "min_price", "max_price", "modal_price"];
      const missing = need.filter((n) => !(n in idx));
      if (missing.length) { console.error("This CSV is missing columns: " + missing.join(", ") + "\nFound: " + header.join(", ")); process.exit(1); }
      continue;
    }
    total++;
    const c = splitCsv(line);
    if ((c[idx.state] || "").toLowerCase() !== STATE) continue;
    const date = toIso(c[idx.arrival_date] || "");
    const min = Number(c[idx.min_price]), max = Number(c[idx.max_price]), modal = Number(c[idx.modal_price]);
    if (!date || ![min, max, modal].every(Number.isFinite) || modal <= 0) continue;
    rows.push({
      s: "Andhra Pradesh", d: c[idx.district] || "", m: c[idx.market] || "", c: c[idx.commodity] || "",
      v: c[idx.variety] || "", g: idx.grade !== undefined ? c[idx.grade] || "" : "", t: date, lo: min, hi: max, md: modal,
    });
  }

  if (!rows.length) { console.error(`Read ${total} rows but found none for Andhra Pradesh. Is this the right file?`); process.exit(1); }
  const latest = rows.reduce((a, r) => (r.t > a ? r.t : a), "");
  const cutoff = new Date(new Date(latest).getTime() - DAYS * 86400000).toISOString().slice(0, 10);
  const kept = rows.filter((r) => r.t >= cutoff);

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({ source: "kaggle", generatedAt: new Date().toISOString(), latestDate: latest, rows: kept }));
  console.log(`Read ${total} rows, ${rows.length} for Andhra Pradesh.`);
  console.log(`Saved ${kept.length} rows (${cutoff} to ${latest}) to ${path.relative(process.cwd(), OUT)}`);
}
main();
