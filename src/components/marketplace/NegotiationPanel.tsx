import { useCallback, useEffect, useState } from "react";
import { negotiationApi, type Negotiation } from "../../services/negotiationApi";
import { marketApi, inr } from "../../services/marketApi";

/**
 * Counter-offer panel for ONE bid. Works for both the seller (farmer) and the bid's buyer;
 * the server decides who you are and whose turn it is.
 * Flow: seller counters first -> sides alternate -> one side accepts the other's latest counter
 * -> bid terms update -> the seller presses "Confirm & create order" (the existing accept-bid step).
 */
export default function NegotiationPanel({ bidId, onChanged }: { bidId: string; onChanged?: () => void }) {
  const [n, setN] = useState<Negotiation | null>(null);
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try { setN(await negotiationApi.get(bidId)); setErr(""); } catch (e: any) { setErr(e.message); }
  }, [bidId]);
  useEffect(() => { load(); }, [load]);

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true); setErr("");
    try { await fn(); await load(); onChanged?.(); } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  };

  if (!n) return <div className="mt-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">{err || "Loading negotiation…"}</div>;

  const open = n.counters.find((c) => c.status === "open");
  const last = n.counters[n.counters.length - 1];
  const agreed = n.bid.status === "pending" && !open && last?.status === "accepted";
  const myTurn = n.bid.status === "pending" && n.turn === n.you;
  const canAccept = !!open && open.from !== n.you && n.bid.status === "pending";
  const btn = "rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-50";

  return (
    <div className="mt-2 space-y-3 rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="font-semibold text-slate-800">Negotiation · {n.listing.cropName}</div>
        <div className="text-xs text-slate-500">Current bid: {n.bid.quantityKg} kg @ {inr(n.bid.pricePerKg)} · available {n.listing.availableKg} kg</div>
      </div>

      {n.counters.length === 0 && <p className="text-xs text-slate-500">No counter-offers yet. {n.you === "seller" ? "You can counter the buyer's bid." : "The seller can counter your bid; you will then be able to respond."}</p>}
      <ul className="space-y-1">
        {n.counters.map((c) => (
          <li key={c.id} className={`flex flex-wrap justify-between gap-2 rounded-lg px-2 py-1 text-xs ${c.from === n.you ? "bg-white" : "bg-emerald-100/60"}`}>
            <span><b>{c.from === n.you ? "You" : c.from === "seller" ? "Seller" : "Buyer"}</b>: {c.quantityKg} kg @ {inr(c.pricePerKg)} = {inr(c.totalAmount)}{c.note ? ` — “${c.note}”` : ""}</span>
            <span className="text-slate-500">{c.status === "open" ? "latest" : c.status}</span>
          </li>
        ))}
      </ul>

      {err && <p className="text-xs text-red-600">{err}</p>}

      {agreed && (
        <div className="rounded-lg bg-white p-3">
          <p className="text-xs text-emerald-700">Price agreed: {n.bid.quantityKg} kg @ {inr(n.bid.pricePerKg)}.</p>
          {n.you === "seller"
            ? <button disabled={busy} className={`${btn} mt-2 bg-emerald-600 text-white`} onClick={() => run(() => marketApi.acceptBid(bidId))}>Confirm &amp; create order</button>
            : <p className="mt-1 text-xs text-slate-500">Waiting for the seller to confirm and create the order.</p>}
        </div>
      )}

      {canAccept && (
        <button disabled={busy} className={`${btn} bg-emerald-600 text-white`} onClick={() => run(() => negotiationApi.acceptCounter(bidId))}>
          Accept {open!.from === "seller" ? "seller's" : "buyer's"} offer: {inr(open!.pricePerKg)}/kg
        </button>
      )}

      {myTurn && n.counters.length < n.maxCounters && (
        <div className="grid gap-2 sm:grid-cols-4">
          <input className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs" type="number" min={0} step="0.01" placeholder="Your price ₹/kg" value={price} onChange={(e) => setPrice(e.target.value)} />
          <input className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs" type="number" min={0} placeholder="Qty kg (optional)" value={qty} onChange={(e) => setQty(e.target.value)} />
          <input className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs" maxLength={300} placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
          <button disabled={busy || !Number(price)} className={`${btn} bg-slate-800 text-white`}
            onClick={() => run(async () => {
              await negotiationApi.counter(bidId, { pricePerKg: Number(price), quantityKg: qty ? Number(qty) : undefined, note: note || undefined });
              setPrice(""); setQty(""); setNote("");
            })}>Send counter</button>
        </div>
      )}
      {n.bid.status === "pending" && !myTurn && !agreed && !canAccept && <p className="text-xs text-slate-500">Waiting for the other side to respond.</p>}
      {n.bid.status !== "pending" && <p className="text-xs text-slate-500">This bid is {n.bid.status}; negotiation is closed.</p>}
    </div>
  );
}
