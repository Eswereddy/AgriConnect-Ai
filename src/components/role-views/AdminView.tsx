import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { farmerProfilesApi, type FarmerProfile, type FarmerProfileInput, type FarmerStats, type SellingPreference, type VerifiedStatus } from "../../services/farmerProfilesApi";

// Farmer Validation / Farmer Profiles.
// mode="admin": sees every profile, verifies/rejects, imports CSV, loads/removes the demo sample rows.
// mode="farmer": sees and edits only the profiles they added (an edit sends it back to "pending").
// Prices are Rs per quintal (100 kg); quantity is in quintals.

const PREF_LABEL: Record<SellingPreference, string> = { mandi: "Mandi", direct_buyer: "Direct buyer", fpo: "FPO", contract: "Contract", undecided: "Undecided" };
const STATUS_STYLE: Record<VerifiedStatus, string> = {
  verified: "bg-emerald-50 text-emerald-700", pending: "bg-amber-50 text-amber-700", rejected: "bg-rose-50 text-rose-700",
};
const inr = (n: number | null | undefined) => (n === null || n === undefined ? "-" : `₹${Math.round(n).toLocaleString("en-IN")}`);
const today = () => new Date().toISOString().slice(0, 10);
const blank = (): FarmerProfileInput => ({ farmerName: "", district: "", location: "", crop: "", quantityQuintals: 0, expectedPricePerQuintal: null,
  currentMarketPrice: null, sellingPreference: "undecided", buyerRequirement: "", contactPermission: false, collectedOn: today() });

/** Minimal CSV reader (handles "quoted, values"). First row = headers. */
function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = []; let cur: string[] = []; let cell = ""; let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
    else if (c === '"') q = true;
    else if (c === ",") { cur.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; cur.push(cell); cell = ""; if (cur.some((x) => x.trim())) rows.push(cur); cur = []; }
    else cell += c;
  }
  cur.push(cell); if (cur.some((x) => x.trim())) rows.push(cur);
  if (rows.length < 2) return [];
  const head = rows[0].map((h) => h.trim().toLowerCase().replace(/^\uFEFF/, ""));
  return rows.slice(1).map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] ?? "").trim()])));
}

const csvCell = (v: unknown) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };

export default function FarmerProfiles({ mode }: { mode: "admin" | "farmer" }) {
  const admin = mode === "admin";
  const [profiles, setProfiles] = useState<FarmerProfile[]>([]);
  const [stats, setStats] = useState<FarmerStats | null>(null);
  const [filters, setFilters] = useState({ q: "", district: "", status: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [form, setForm] = useState<{ id: string | null; data: FarmerProfileInput } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async (f = filters) => {
    setLoading(true); setError(null);
    try { const r = await farmerProfilesApi.list(f); setProfiles(r.profiles); setStats(r.stats); }
    catch (e: any) { setError(e?.message || "Could not load farmer profiles."); }
    finally { setLoading(false); }
  }, [filters]);
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const districts = useMemo(() => [...new Set(profiles.map((p) => p.district))].sort(), [profiles]);
  const run = async (fn: () => Promise<unknown>, ok?: string) => {
    setError(null); setNotice(null);
    try { await fn(); if (ok) setNotice(ok); await load(); } catch (e: any) { setError(e?.message || "Something went wrong."); }
  };

  const save = () => form && run(async () => {
    const d = form.data;
    if (!d.farmerName.trim() || !d.district.trim() || !d.crop.trim()) throw new Error("Farmer name, district and crop are required.");
    if (!(d.quantityQuintals >= 0)) throw new Error("Quantity must be 0 or more.");
    if (form.id) await farmerProfilesApi.update(form.id, d); else await farmerProfilesApi.create(d);
    setForm(null);
  }, form.id ? "Profile updated." : "Farmer profile added.");

  const importCsv = async (file: File) => {
    const rows = parseCsv(await file.text());
    if (!rows.length) { setError("That CSV has no data rows. Use the template columns."); return; }
    await run(async () => {
      const r = await farmerProfilesApi.bulk(rows);
      setNotice(`Imported ${r.inserted} farmer(s).` + (r.skipped.length ? ` Skipped ${r.skipped.length}: ` + r.skipped.slice(0, 5).map((s) => `row ${s.row} (${s.error})`).join("; ") : ""));
    });
  };

  const exportCsv = () => {
    const head = ["farmer_id", "farmer_name", "district", "location", "crop", "quantity_quintals", "expected_price_per_quintal", "current_market_price_per_quintal", "selling_preference", "buyer_requirement", "verified_status", "contact_permission", "date_collected"];
    const lines = profiles.map((p) => [p.farmerCode, p.farmerName, p.district, p.location, p.crop, p.quantityQuintals, p.expectedPricePerQuintal, p.currentMarketPrice ?? "", p.sellingPreference, p.buyerRequirement, p.verifiedStatus, p.contactPermission ? "yes" : "no", p.collectedOn].map(csvCell).join(","));
    const blob = new Blob([[head.join(","), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "farmer-profiles.csv"; a.click(); URL.revokeObjectURL(a.href);
  };

  const input = "border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200";
  const btn = "px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer disabled:opacity-50";
  const primary = `${btn} bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700`;
  const ghost = `${btn} bg-white text-slate-700 border-slate-200 hover:bg-slate-50`;
  const set = (patch: Partial<FarmerProfileInput>) => setForm((f) => (f ? { ...f, data: { ...f.data, ...patch } } : f));

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="mr-auto">
          <h3 className="font-bold text-slate-800">{admin ? "Farmer Validation / Farmer Profiles" : "My Farmer Profiles"}</h3>
          <p className="text-xs text-slate-500">Prices are ₹ per quintal (100 kg). {admin ? "Verify the data collected from farmers." : "An admin verifies what you add."}</p>
        </div>
        <button className={primary} onClick={() => setForm({ id: null, data: blank() })}>+ Add farmer</button>
        {admin && <>
          <button className={ghost} onClick={() => fileRef.current?.click()}>Import CSV</button>
          <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) importCsv(f); e.target.value = ""; }} />
          <button className={ghost} onClick={() => run(async () => { const r = await farmerProfilesApi.loadSample(); setNotice(r.inserted ? `Loaded ${r.inserted} sample farmers.` : "The 30 sample farmers are already loaded."); })}>Load 30 sample farmers</button>
          {!!stats?.samples && <button className={ghost} onClick={() => window.confirm("Remove all SAMPLE rows? Real data is not touched.") && run(async () => { const r = await farmerProfilesApi.removeSamples(); setNotice(`Removed ${r.removed} sample rows.`); })}>Remove samples</button>}
        </>}
        <button className={ghost} disabled={!profiles.length} onClick={exportCsv}>Export CSV</button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center">
          {[["Total", stats.total], ["Verified", stats.verified], ["Pending", stats.pending], ["Rejected", stats.rejected], ["OK to contact", stats.contactAllowed]].map(([l, v]) => (
            <div key={l as string} className="bg-slate-50 rounded-xl py-2"><p className="text-lg font-black text-slate-800">{v}</p><p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{l}</p></div>
          ))}
        </div>
      )}
      {!!stats?.samples && <p className="text-xs bg-amber-50 text-amber-800 border border-amber-200 rounded-lg px-3 py-2">{stats.samples} row(s) marked SAMPLE are demo placeholders with illustrative numbers, not real survey data. {admin ? "Import your real data with Import CSV, then remove the samples." : ""}</p>}

      <div className="flex flex-wrap gap-2">
        <input className={`${input} w-48`} placeholder="Search name, ID or crop" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} onKeyDown={(e) => e.key === "Enter" && load(filters)} />
        <select className={input} value={filters.district} onChange={(e) => { const f = { ...filters, district: e.target.value }; setFilters(f); load(f); }}>
          <option value="">All districts</option>{districts.map((d) => <option key={d}>{d}</option>)}
        </select>
        <select className={input} value={filters.status} onChange={(e) => { const f = { ...filters, status: e.target.value }; setFilters(f); load(f); }}>
          <option value="">Any status</option><option value="pending">Pending</option><option value="verified">Verified</option><option value="rejected">Rejected</option>
        </select>
        <button className={ghost} disabled={loading} onClick={() => load(filters)}>{loading ? "Loading..." : "Search"}</button>
      </div>

      {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg px-3 py-2">{error}</div>}
      {notice && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-lg px-3 py-2">{notice}</div>}

      {form && (
        <div className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-3 space-y-2">
          <p className="text-sm font-bold text-slate-800">{form.id ? "Edit farmer" : "Add farmer"}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <label className="text-[11px] font-bold text-slate-500">Farmer name<input className={`${input} w-full mt-0.5`} value={form.data.farmerName} onChange={(e) => set({ farmerName: e.target.value })} /></label>
            <label className="text-[11px] font-bold text-slate-500">District<input className={`${input} w-full mt-0.5`} value={form.data.district} onChange={(e) => set({ district: e.target.value })} /></label>
            <label className="text-[11px] font-bold text-slate-500">Village / location<input className={`${input} w-full mt-0.5`} value={form.data.location ?? ""} onChange={(e) => set({ location: e.target.value })} /></label>
            <label className="text-[11px] font-bold text-slate-500">Crop<input className={`${input} w-full mt-0.5`} value={form.data.crop} onChange={(e) => set({ crop: e.target.value })} /></label>
            <label className="text-[11px] font-bold text-slate-500">Quantity (quintals)<input type="number" min={0} className={`${input} w-full mt-0.5`} value={form.data.quantityQuintals} onChange={(e) => set({ quantityQuintals: Number(e.target.value) })} /></label>
            <label className="text-[11px] font-bold text-slate-500">Expected price (₹/quintal)<input type="number" min={0} className={`${input} w-full mt-0.5`} value={form.data.expectedPricePerQuintal ?? ""} onChange={(e) => set({ expectedPricePerQuintal: e.target.value === "" ? null : Number(e.target.value) })} /></label>
            <label className="text-[11px] font-bold text-slate-500">Current market price (₹/quintal)<input type="number" min={0} className={`${input} w-full mt-0.5`} value={form.data.currentMarketPrice ?? ""} onChange={(e) => set({ currentMarketPrice: e.target.value === "" ? null : Number(e.target.value) })} /></label>
            <label className="text-[11px] font-bold text-slate-500">Selling preference
              <select className={`${input} w-full mt-0.5`} value={form.data.sellingPreference} onChange={(e) => set({ sellingPreference: e.target.value as SellingPreference })}>
                {Object.entries(PREF_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select></label>
            <label className="text-[11px] font-bold text-slate-500 md:col-span-2">Buyer requirement<input className={`${input} w-full mt-0.5`} value={form.data.buyerRequirement ?? ""} onChange={(e) => set({ buyerRequirement: e.target.value })} /></label>
            <label className="text-[11px] font-bold text-slate-500">Date collected<input type="date" className={`${input} w-full mt-0.5`} value={form.data.collectedOn} onChange={(e) => set({ collectedOn: e.target.value })} /></label>
            <label className="text-xs font-bold text-slate-600 flex items-end gap-2 pb-1.5"><input type="checkbox" checked={form.data.contactPermission} onChange={(e) => set({ contactPermission: e.target.checked })} /> Farmer allows contact</label>
          </div>
          <div className="flex gap-2"><button className={primary} onClick={save}>Save</button><button className={ghost} onClick={() => setForm(null)}>Cancel</button></div>
        </div>
      )}

      {!loading && profiles.length === 0 && !error && (
        <p className="text-sm text-slate-400 py-6 text-center">No farmer profiles yet. {admin ? "Press “Load 30 sample farmers” for a demo, or “Import CSV” for real data." : "Press “Add farmer” to add one."}</p>
      )}
      {profiles.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[10px] uppercase tracking-wider text-slate-400">
              <th className="py-1 pr-3">Farmer</th><th className="pr-3">District / location</th><th className="pr-3">Crop</th><th className="pr-3 text-right">Qty (q)</th>
              <th className="pr-3 text-right">Expected ₹/q</th><th className="pr-3 text-right">Market ₹/q</th><th className="pr-3">Sells via</th><th className="pr-3">Buyer requirement</th>
              <th className="pr-3">Status</th><th className="pr-3">Contact OK</th><th className="pr-3">Collected</th><th />
            </tr></thead>
            <tbody>
              {profiles.map((p) => (
                <tr key={p.id} className="border-t border-slate-100 align-top">
                  <td className="py-1.5 pr-3"><p className="font-semibold text-slate-800">{p.farmerName}{p.isSample && <span className="ml-1.5 text-[9px] font-black bg-slate-200 text-slate-600 rounded px-1 py-0.5">SAMPLE</span>}</p><p className="text-[10px] text-slate-400">{p.farmerCode}</p></td>
                  <td className="pr-3 text-slate-600">{p.district}{p.location ? <span className="text-slate-400"> · {p.location}</span> : null}</td>
                  <td className="pr-3 font-semibold text-slate-700">{p.crop}</td>
                  <td className="pr-3 text-right">{p.quantityQuintals}</td>
                  <td className="pr-3 text-right">{inr(p.expectedPricePerQuintal)}</td>
                  <td className="pr-3 text-right">{p.currentMarketPrice !== null ? inr(p.currentMarketPrice) : p.latestMandiPrice ? <span title={`Latest saved mandi price (${p.latestMandiPrice.date})`}>{inr(p.latestMandiPrice.modal)}<span className="text-[9px] text-emerald-600"> mandi</span></span> : "-"}</td>
                  <td className="pr-3 text-slate-600">{PREF_LABEL[p.sellingPreference]}</td>
                  <td className="pr-3 text-slate-500 max-w-[200px]">{p.buyerRequirement || "-"}</td>
                  <td className="pr-3"><span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${STATUS_STYLE[p.verifiedStatus]}`}>{p.verifiedStatus}</span></td>
                  <td className="pr-3">{p.contactPermission ? "Yes" : "No"}</td>
                  <td className="pr-3 text-slate-500">{p.collectedOn}</td>
                  <td className="whitespace-nowrap">
                    {admin && p.verifiedStatus !== "verified" && <button className="text-[10px] font-bold text-emerald-700 hover:underline mr-2" onClick={() => run(() => farmerProfilesApi.update(p.id, { verifiedStatus: "verified" }))}>verify</button>}
                    {admin && p.verifiedStatus !== "rejected" && <button className="text-[10px] font-bold text-rose-600 hover:underline mr-2" onClick={() => run(() => farmerProfilesApi.update(p.id, { verifiedStatus: "rejected" }))}>reject</button>}
                    <button className="text-[10px] font-bold text-slate-600 hover:underline mr-2" onClick={() => setForm({ id: p.id, data: { farmerName: p.farmerName, district: p.district, location: p.location ?? "", crop: p.crop, quantityQuintals: p.quantityQuintals, expectedPricePerQuintal: p.expectedPricePerQuintal, currentMarketPrice: p.currentMarketPrice, sellingPreference: p.sellingPreference, buyerRequirement: p.buyerRequirement ?? "", contactPermission: p.contactPermission, collectedOn: p.collectedOn } })}>edit</button>
                    <button className="text-[10px] font-bold text-slate-400 hover:text-rose-600 hover:underline" onClick={() => window.confirm(`Delete ${p.farmerName}?`) && run(() => farmerProfilesApi.remove(p.id))}>delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-[10px] text-slate-400">Only whether a farmer gave permission to be contacted is stored, never phone numbers.</p>
    </div>
  );
}
