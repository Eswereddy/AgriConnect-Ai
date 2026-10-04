import { useEffect, useState } from "react";
import { buyerProfilesApi, type BuyerProfile, type BuyerProfileInput, type Match } from "../../services/buyerProfilesApi";
import NegotiationPanel from "../marketplace/NegotiationPanel";

const EMPTY: BuyerProfileInput = {
  buyerName: "", buyerType: "trader", district: "", location: "", requiredCrop: "", requiredQuantityQuintals: 0,
  offeredPricePerQuintal: 0, preferredGrade: "", purchaseFrequency: "one_time", deliveryPreference: "either",
  paymentTerms: "on_delivery", contactPermission: false,
};
const label = (s: string) => s.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
const inp = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm";

export default function BuyerProfiles({ isAdmin = false, role }: { isAdmin?: boolean; role?: "Farmer" | "Buyer" | "Admin" }) {
  const me = role ?? (isAdmin ? "Admin" : "Buyer");
  const [profiles, setProfiles] = useState<BuyerProfile[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [form, setForm] = useState<BuyerProfileInput>(EMPTY);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [started, setStarted] = useState<Record<string, string>>({});   // match key -> bidId
  const [rowErr, setRowErr] = useState<Record<string, string>>({});
  const key = (m: Match) => `${m.farmerProfileId}:${m.buyerProfileId}`;
  const rowAction = async (m: Match, fn: () => Promise<unknown>) => {
    setRowErr((e) => ({ ...e, [key(m)]: "" }));
    try { await fn(); await load(); } catch (e: any) { setRowErr((x) => ({ ...x, [key(m)]: e.message })); }
  };

  const load = async () => {
    try {
      const [p, m] = await Promise.all([buyerProfilesApi.list(), buyerProfilesApi.matches()]);
      setProfiles(p.profiles); setMatches(m.matches);
    } catch (e: any) { setErr(e.message); }
  };
  useEffect(() => { load(); }, []);

  const set = <K extends keyof BuyerProfileInput>(k: K, v: BuyerProfileInput[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    setBusy(true); setErr("");
    try { await buyerProfilesApi.create(form); setForm(EMPTY); await load(); }
    catch (e: any) { setErr(e.message); }
    finally { setBusy(false); }
  };

  return (
    <div className="space-y-8 p-4">
      <section className="rounded-xl border bg-white p-5">
        <h2 className="mb-1 text-lg font-semibold">Buyer profile</h2>
        <p className="mb-4 text-xs text-gray-500">Buyer ID is generated automatically. Quantity in quintals (100 kg), price in ₹ per quintal. New profiles start as "pending" until an admin verifies them.</p>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">Business / buyer name<input className={inp} value={form.buyerName} onChange={(e) => set("buyerName", e.target.value)} /></label>
          <label className="text-sm">Buyer type
            <select className={inp} value={form.buyerType} onChange={(e) => set("buyerType", e.target.value as any)}>
              {["trader", "retailer", "wholesaler", "processor", "exporter"].map((t) => <option key={t} value={t}>{label(t)}</option>)}
            </select></label>
          <label className="text-sm">District<input className={inp} value={form.district} onChange={(e) => set("district", e.target.value)} /></label>
          <label className="text-sm">Location (town / market)<input className={inp} value={form.location ?? ""} onChange={(e) => set("location", e.target.value)} /></label>
          <label className="text-sm">Required crop<input className={inp} value={form.requiredCrop} onChange={(e) => set("requiredCrop", e.target.value)} /></label>
          <label className="text-sm">Required quantity (quintals)<input type="number" min={0} className={inp} value={form.requiredQuantityQuintals || ""} onChange={(e) => set("requiredQuantityQuintals", Number(e.target.value))} /></label>
          <label className="text-sm">Offered price (₹/quintal)<input type="number" min={0} className={inp} value={form.offeredPricePerQuintal || ""} onChange={(e) => set("offeredPricePerQuintal", Number(e.target.value))} /></label>
          <label className="text-sm">Quality requirement (grade)<input className={inp} value={form.preferredGrade ?? ""} onChange={(e) => set("preferredGrade", e.target.value)} /></label>
          <label className="text-sm">Purchase frequency
            <select className={inp} value={form.purchaseFrequency} onChange={(e) => set("purchaseFrequency", e.target.value as any)}>
              {["one_time", "weekly", "monthly", "seasonal"].map((t) => <option key={t} value={t}>{label(t)}</option>)}
            </select></label>
          <label className="text-sm">Pickup / delivery
            <select className={inp} value={form.deliveryPreference} onChange={(e) => set("deliveryPreference", e.target.value as any)}>
              {["pickup", "delivery", "either"].map((t) => <option key={t} value={t}>{label(t)}</option>)}
            </select></label>
          <label className="text-sm">Payment terms
            <select className={inp} value={form.paymentTerms} onChange={(e) => set("paymentTerms", e.target.value as any)}>
              {["advance", "on_delivery", "credit_7d", "credit_15d"].map((t) => <option key={t} value={t}>{label(t)}</option>)}
            </select></label>
          <label className="flex items-center gap-2 pt-6 text-sm">
            <input type="checkbox" checked={form.contactPermission} onChange={(e) => set("contactPermission", e.target.checked)} />
            I allow farmers I match with to see my business name</label>
        </div>
        {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
        <button disabled={busy} onClick={submit} className="mt-4 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
          {busy ? "Saving…" : "Save buyer profile"}
        </button>
      </section>

      <section className="overflow-x-auto rounded-xl border bg-white p-5">
        <h2 className="mb-3 text-lg font-semibold">Buyer profiles</h2>
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-gray-500"><tr>
            {["Buyer ID", "Business", "Type", "Location", "Crop", "Qty (q)", "Offer ₹/q", "Quality", "Frequency", "Pickup/Delivery", "Payment", "Verification", "Contact"].map((h) => <th key={h} className="py-2 pr-3">{h}</th>)}
            {isAdmin && <th />}
          </tr></thead>
          <tbody>
            {profiles.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="py-2 pr-3 font-mono">{p.buyerCode}</td><td className="pr-3">{p.buyerName}</td><td className="pr-3">{label(p.buyerType)}</td>
                <td className="pr-3">{[p.location, p.district].filter(Boolean).join(", ")}</td><td className="pr-3">{p.requiredCrop}</td>
                <td className="pr-3">{p.requiredQuantityQuintals}</td><td className="pr-3">{p.offeredPricePerQuintal}</td><td className="pr-3">{p.preferredGrade || "-"}</td>
                <td className="pr-3">{label(p.purchaseFrequency)}</td><td className="pr-3">{label(p.deliveryPreference)}</td><td className="pr-3">{label(p.paymentTerms)}</td>
                <td className="pr-3">{label(p.verifiedStatus)}</td><td className="pr-3">{p.contactPermission ? "Yes" : "No"}</td>
                {isAdmin && <td className="space-x-2 whitespace-nowrap">
                  <button className="text-green-700" onClick={async () => { await buyerProfilesApi.verify(p.id, "verified"); load(); }}>Verify</button>
                  <button className="text-red-600" onClick={async () => { await buyerProfilesApi.verify(p.id, "rejected"); load(); }}>Reject</button>
                </td>}
              </tr>
            ))}
            {!profiles.length && <tr><td colSpan={14} className="py-4 text-gray-500">No buyer profiles yet.</td></tr>}
          </tbody>
        </table>
      </section>

      <section className="rounded-xl border bg-white p-5">
        <h2 className="mb-3 text-lg font-semibold">Matches</h2>
        <p className="mb-3 text-xs text-gray-500">Only verified farmers and buyers are matched.</p>
        <div className="space-y-2">
          {matches.map((m, i) => (
            <div key={i} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 text-sm">
              <div>
                <div className="font-medium">{m.crop}: {m.farmer.name ?? m.farmer.code} → {m.buyer.name ?? m.buyer.code}</div>
                <div className="text-gray-600">
                  {m.matchedQuantityQuintals} q • ask ₹{m.farmer.expectedPricePerQuintal ?? "?"} vs offer ₹{m.buyer.offeredPricePerQuintal}
                  {m.fullFill ? "" : " • partial fill"}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{m.score}/100</div>
                <div className={m.needsNegotiation ? "text-amber-600" : "text-green-700"}>{m.needsNegotiation ? "Negotiate" : "Ready to order"}</div>
                {me === "Buyer" && (m.listed
                  ? <button className="mt-1 rounded-lg bg-green-700 px-3 py-1 text-xs font-medium text-white" onClick={() => rowAction(m, async () => { const r = await buyerProfilesApi.startFromMatch(m.farmerProfileId, m.buyerProfileId); setStarted((x) => ({ ...x, [key(m)]: r.bidId })); })}>Start negotiation</button>
                  : <div className="mt-1 text-xs text-gray-500">Farmer hasn't listed this yet</div>)}
                {me === "Farmer" && !m.listed && (
                  <button className="mt-1 rounded-lg bg-green-700 px-3 py-1 text-xs font-medium text-white" onClick={() => rowAction(m, () => buyerProfilesApi.publishFarmerProfile(m.farmerProfileId))}>Publish to marketplace</button>)}
                {me === "Farmer" && m.listed && <div className="mt-1 text-xs text-green-700">Listed — see Bids</div>}
              </div>
              {rowErr[key(m)] && <p className="basis-full text-xs text-red-600">{rowErr[key(m)]}</p>}
              {started[key(m)] && <div className="basis-full"><NegotiationPanel bidId={started[key(m)]} /></div>}
            </div>
          ))}
          {!matches.length && <p className="text-sm text-gray-500">No matches yet.</p>}
        </div>
      </section>
    </div>
  );
          }
