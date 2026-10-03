import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { payForOrder } from "../../services/checkout";
import LiveFeeds from "./LiveFeeds";
import {
  marketApi, inr,
  type Farm, type Crop, type Listing, type Bid, type Order, type OrderDetail, type Shipment, type StockRow, type MarketStats,
} from "../../services/marketApi";

// LIVE marketplace: every list below is read from, and every button writes to, the
// Postgres-backed API. Nothing here is mock data. What you can do is decided by the
// role of the account you are LOGGED IN as (the server enforces it too).

const card = "bg-white border border-slate-200 rounded-2xl p-4 shadow-sm";
const input = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400";
const btn = "px-3 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-50";
const primary = `${btn} bg-emerald-600 text-white hover:bg-emerald-700`;
const ghost = `${btn} bg-slate-100 text-slate-700 hover:bg-slate-200`;
const danger = `${btn} bg-rose-50 text-rose-700 hover:bg-rose-100`;

const STATUS_STYLE: Record<string, string> = {
  open: "bg-emerald-50 text-emerald-700", sold_out: "bg-slate-100 text-slate-600", closed: "bg-slate-100 text-slate-500",
  pending: "bg-amber-50 text-amber-700", accepted: "bg-emerald-50 text-emerald-700", rejected: "bg-rose-50 text-rose-700", withdrawn: "bg-slate-100 text-slate-500",
  pending_payment: "bg-amber-50 text-amber-700", paid: "bg-sky-50 text-sky-700", shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-teal-50 text-teal-700", completed: "bg-emerald-50 text-emerald-700", cancelled: "bg-rose-50 text-rose-700",
  booked: "bg-slate-100 text-slate-600", picked_up: "bg-sky-50 text-sky-700", in_transit: "bg-indigo-50 text-indigo-700",
};
const Pill = ({ s }: { s: string }) => (
  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${STATUS_STYLE[s] ?? "bg-slate-100 text-slate-600"}`}>{s.replace(/_/g, " ")}</span>
);

function useAction() {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const run = useCallback(async (fn: () => Promise<unknown>) => {
    setBusy(true); setError(null);
    try { await fn(); return true; } catch (e: any) { setError(e?.message || "Something went wrong."); return false; } finally { setBusy(false); }
  }, []);
  return { error, busy, run, setError };
}

function useLoad<T>(loader: () => Promise<T>, initial: T) {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reload = useCallback(async () => {
    try { setData(await loader()); setError(null); } catch (e: any) { setError(e?.message || "Could not load."); } finally { setLoading(false); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { reload(); }, [reload]);
  return { data, loading, error, reload };
}

const ErrorBanner = ({ msg }: { msg: string | null }) => msg ? <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg px-3 py-2 mb-3">{msg}</div> : null;
const Empty = ({ text }: { text: string }) => <p className="text-sm text-slate-400 py-6 text-center">{text}</p>;

// ---------------------------------------------------------------- Farmer

function FarmsPanel() {
  const farms = useLoad<Farm[]>(marketApi.listFarms, []);
  const act = useAction();
  const [f, setF] = useState({ name: "", village: "", district: "", state: "Andhra Pradesh", areaAcres: "" });
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <div className={card}>
        <h3 className="font-bold text-slate-800 mb-3">Add a farm</h3>
        <ErrorBanner msg={act.error} />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <input className={input} placeholder="Farm name" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
          <input className={input} placeholder="Village" value={f.village} onChange={e => setF({ ...f, village: e.target.value })} />
          <input className={input} placeholder="District" value={f.district} onChange={e => setF({ ...f, district: e.target.value })} />
          <input className={input} placeholder="State" value={f.state} onChange={e => setF({ ...f, state: e.target.value })} />
          <input className={input} placeholder="Acres" type="number" min="0" step="0.1" value={f.areaAcres} onChange={e => setF({ ...f, areaAcres: e.target.value })} />
        </div>
        <button className={`${primary} mt-3`} disabled={act.busy} onClick={async () => {
          if (await act.run(() => marketApi.createFarm({ name: f.name, village: f.village || undefined, district: f.district, state: f.state, areaAcres: Number(f.areaAcres) }))) {
            setF({ ...f, name: "", village: "", areaAcres: "" }); farms.reload();
          }
        }}>Save farm</button>
      </div>
      {farms.loading ? <Empty text="Loading farms..." /> : farms.data.length === 0 ? <Empty text="No farms yet. Add your first one above." /> :
        farms.data.map(farm => (
          <div key={farm.id} className={card}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">{farm.name}</p>
                <p className="text-xs text-slate-500">{[farm.village, farm.district, farm.state].filter(Boolean).join(", ")} · {farm.areaAcres} acres</p>
              </div>
              <button className={ghost} onClick={() => setOpen(open === farm.id ? null : farm.id)}>{open === farm.id ? "Hide crops" : "Crops"}</button>
            </div>
            {open === farm.id && <CropsPanel farmId={farm.id} />}
          </div>
        ))}
    </div>
  );
}

function CropsPanel({ farmId }: { farmId: string }) {
  const crops = useLoad<Crop[]>(() => marketApi.listCrops(farmId), []);
  const act = useAction();
  const [c, setC] = useState({ cropName: "", variety: "", areaAcres: "", expectedHarvestOn: "" });
  return (
    <div className="mt-3 pt-3 border-t border-slate-100">
      <ErrorBanner msg={act.error} />
      {crops.data.map(cr => (
        <div key={cr.id} className="flex justify-between text-sm py-1">
          <span>{cr.cropName}{cr.variety ? ` (${cr.variety})` : ""} · {cr.areaAcres} ac</span><Pill s={cr.status} />
        </div>
      ))}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
        <input className={input} placeholder="Crop" value={c.cropName} onChange={e => setC({ ...c, cropName: e.target.value })} />
        <input className={input} placeholder="Variety" value={c.variety} onChange={e => setC({ ...c, variety: e.target.value })} />
        <input className={input} placeholder="Acres" type="number" min="0" step="0.1" value={c.areaAcres} onChange={e => setC({ ...c, areaAcres: e.target.value })} />
        <input className={input} type="date" value={c.expectedHarvestOn} onChange={e => setC({ ...c, expectedHarvestOn: e.target.value })} />
        <button className={primary} disabled={act.busy} onClick={async () => {
          if (await act.run(() => marketApi.createCrop(farmId, { cropName: c.cropName, variety: c.variety || undefined, areaAcres: Number(c.areaAcres), expectedHarvestOn: c.expectedHarvestOn || undefined }))) {
            setC({ cropName: "", variety: "", areaAcres: "", expectedHarvestOn: "" }); crops.reload();
          }
        }}>Add crop</button>
      </div>
    </div>
  );
}

function SellPanel() {
  const farms = useLoad<Farm[]>(marketApi.listFarms, []);
  const mine = useLoad<Listing[]>(() => marketApi.listListings({ mine: true, status: "all" }), []);
  const act = useAction();
  const [f, setF] = useState({ farmId: "", cropName: "", grade: "A", quantityKg: "", minPricePerKg: "" });
  const [bidsFor, setBidsFor] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <div className={card}>
        <h3 className="font-bold text-slate-800 mb-3">List a crop for sale</h3>
        <ErrorBanner msg={act.error} />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <select className={input} value={f.farmId} onChange={e => setF({ ...f, farmId: e.target.value })}>
            <option value="">Farm (optional)</option>
            {farms.data.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
          </select>
          <input className={input} placeholder="Crop" value={f.cropName} onChange={e => setF({ ...f, cropName: e.target.value })} />
          <select className={input} value={f.grade} onChange={e => setF({ ...f, grade: e.target.value })}>{["A", "B", "C"].map(g => <option key={g}>{g}</option>)}</select>
          <input className={input} placeholder="Quantity (kg)" type="number" min="0" value={f.quantityKg} onChange={e => setF({ ...f, quantityKg: e.target.value })} />
          <input className={input} placeholder="Min price (₹/kg)" type="number" min="0" step="0.01" value={f.minPricePerKg} onChange={e => setF({ ...f, minPricePerKg: e.target.value })} />
        </div>
        <button className={`${primary} mt-3`} disabled={act.busy} onClick={async () => {
          if (await act.run(() => marketApi.createListing({ farmId: f.farmId || undefined, cropName: f.cropName || undefined, grade: f.grade, quantityKg: Number(f.quantityKg), minPricePerKg: Number(f.minPricePerKg) }))) {
            setF({ ...f, cropName: "", quantityKg: "", minPricePerKg: "" }); mine.reload();
          }
        }}>Publish listing</button>
      </div>
      {mine.loading ? <Empty text="Loading..." /> : mine.data.length === 0 ? <Empty text="You have no listings yet." /> : mine.data.map(l => (
        <div key={l.id} className={card}>
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="font-bold text-slate-800">{l.cropName} {l.grade ? `· Grade ${l.grade}` : ""}</p>
              <p className="text-xs text-slate-500">{l.availableKg} of {l.quantityKg} kg left · min {inr(l.minPricePerKg)}/kg</p>
            </div>
            <div className="flex items-center gap-2"><Pill s={l.status} />
              <button className={ghost} onClick={() => setBidsFor(bidsFor === l.id ? null : l.id)}>Bids</button>
              {l.status === "open" && <button className={danger} onClick={async () => { if (await act.run(() => marketApi.closeListing(l.id))) mine.reload(); }}>Close</button>}
            </div>
          </div>
          {bidsFor === l.id && <ListingBids listingId={l.id} onChanged={mine.reload} />}
        </div>
      ))}
    </div>
  );
}

function ListingBids({ listingId, onChanged }: { listingId: string; onChanged: () => void }) {
  const bids = useLoad<Bid[]>(() => marketApi.listingBids(listingId), []);
  const act = useAction();
  const after = async (fn: () => Promise<unknown>) => { if (await act.run(fn)) { bids.reload(); onChanged(); } };
  return (
    <div className="mt-3 pt-3 border-t border-slate-100">
      <ErrorBanner msg={act.error} />
      {bids.data.length === 0 ? <Empty text="No bids yet." /> : bids.data.map(b => (
        <div key={b.id} className="flex items-center justify-between text-sm py-1.5">
          <span>{b.buyerName ?? "Buyer"} · {b.quantityKg} kg @ {inr(b.pricePerKg)} = <b>{inr(b.totalAmount)}</b></span>
          <span className="flex items-center gap-2"><Pill s={b.status} />
            {b.status === "pending" && <>
              <button className={primary} disabled={act.busy} onClick={() => after(() => marketApi.acceptBid(b.id))}>Accept</button>
              <button className={danger} disabled={act.busy} onClick={() => after(() => marketApi.rejectBid(b.id))}>Reject</button>
            </>}
          </span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- Buyer

function BrowsePanel() {
  const [crop, setCrop] = useState("");
  const [district, setDistrict] = useState("");
  const list = useLoad<Listing[]>(() => marketApi.listListings({ crop, district }), []);
  const act = useAction();
  const [bid, setBid] = useState<Record<string, { q: string; p: string }>>({});
  const [done, setDone] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <div className={`${card} flex flex-wrap gap-2 items-center`}>
        <input className={`${input} max-w-[200px]`} placeholder="Crop" value={crop} onChange={e => setCrop(e.target.value)} />
        <input className={`${input} max-w-[200px]`} placeholder="District" value={district} onChange={e => setDistrict(e.target.value)} />
        <button className={primary} onClick={list.reload}>Search</button>
      </div>
      <ErrorBanner msg={act.error || list.error} />
      {done && <div className="bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg px-3 py-2">{done}</div>}
      {list.loading ? <Empty text="Loading listings..." /> : list.data.length === 0 ? <Empty text="No open listings match." /> : list.data.map(l => {
        const b = bid[l.id] ?? { q: "", p: "" };
        return (
          <div key={l.id} className={card}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">{l.cropName} {l.grade ? `· Grade ${l.grade}` : ""}</p>
                <p className="text-xs text-slate-500">{l.sellerName ?? "Farmer"} · {l.district ?? "-"} · {l.availableKg} kg available · asking from {inr(l.minPricePerKg)}/kg</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <input className={`${input} max-w-[140px]`} type="number" min="0" placeholder="Qty (kg)" value={b.q} onChange={e => setBid({ ...bid, [l.id]: { ...b, q: e.target.value } })} />
              <input className={`${input} max-w-[140px]`} type="number" min="0" step="0.01" placeholder="₹ per kg" value={b.p} onChange={e => setBid({ ...bid, [l.id]: { ...b, p: e.target.value } })} />
              <button className={primary} disabled={act.busy} onClick={async () => {
                setDone(null);
                if (await act.run(() => marketApi.placeBid(l.id, { quantityKg: Number(b.q), pricePerKg: Number(b.p) }))) {
                  setDone(`Bid placed on ${l.cropName}. The farmer will see it now.`); setBid({ ...bid, [l.id]: { q: "", p: "" } });
                }
              }}>Place bid</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MyBidsPanel() {
  const bids = useLoad<Bid[]>(marketApi.myBids, []);
  const act = useAction();
  return (
    <div className={card}>
      <ErrorBanner msg={act.error || bids.error} />
      {bids.loading ? <Empty text="Loading..." /> : bids.data.length === 0 ? <Empty text="You haven't placed any bids." /> : bids.data.map(b => (
        <div key={b.id} className="flex items-center justify-between text-sm py-1.5">
          <span>{b.quantityKg} kg @ {inr(b.pricePerKg)} = <b>{inr(b.totalAmount)}</b></span>
          <span className="flex items-center gap-2"><Pill s={b.status} />
            {b.status === "pending" && <button className={danger} onClick={async () => { if (await act.run(() => marketApi.withdrawBid(b.id))) bids.reload(); }}>Withdraw</button>}
          </span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- Orders (buyer + seller)

function OrdersPanel({ role }: { role: string }) {
  const { user } = useAuth();
  const orders = useLoad<Order[]>(marketApi.listOrders, []);
  const act = useAction();
  const [notice, setNotice] = useState<string | null>(null);
  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [addr, setAddr] = useState({ pickup: "", drop: "" });
  const isBuyer = role === "Buyer";
  const isSeller = role === "Farmer";
  const refresh = async (id?: string) => { await orders.reload(); if (id) setDetail(await marketApi.orderDetail(id)); };
  const go = (id: string, fn: () => Promise<unknown>) => async () => { setNotice(null); if (await act.run(fn)) await refresh(id); };
  const cancel = (id: string) => async () => {
    setNotice(null);
    let pending = false;
    if (await act.run(async () => { pending = Boolean((await marketApi.cancelOrder(id)).refundPending); })) {
      setNotice(pending ? "Order cancelled. Your refund could not be sent just now and will be retried; contact support if it does not arrive." : "Order cancelled. Any payment is being refunded to your original payment method.");
      await refresh(id);
    }
  };
  return (
    <div className="space-y-3">
      <ErrorBanner msg={act.error || orders.error} />
      {notice && <div className="bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg px-3 py-2">{notice}</div>}
      {orders.loading ? <Empty text="Loading orders..." /> : orders.data.length === 0 ? <Empty text="No orders yet. They appear when a bid is accepted." /> : orders.data.map(o => (
        <div key={o.id} className={card}>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <p className="font-bold text-slate-800">{o.cropName} · {o.quantityKg} kg · {inr(o.totalAmount)}</p>
              <p className="text-xs text-slate-500">{isBuyer ? `Seller: ${o.sellerName ?? "-"}` : `Buyer: ${o.buyerName ?? "-"}`} · {inr(o.pricePerKg)}/kg</p>
            </div>
            <div className="flex items-center gap-2"><Pill s={o.status} />
              <button className={ghost} onClick={async () => setDetail(detail?.order.id === o.id ? null : await marketApi.orderDetail(o.id))}>Details</button>
              {isBuyer && o.status === "pending_payment" && <button className={primary} disabled={act.busy} onClick={go(o.id, () => payForOrder(o.id, { name: user?.name, email: user?.email }))}>Pay {inr(o.totalAmount)}</button>}
              {isBuyer && o.status === "delivered" && <button className={primary} disabled={act.busy} onClick={go(o.id, () => marketApi.confirmDelivery(o.id))}>Confirm delivery</button>}
              {(o.status === "pending_payment" || o.status === "paid") && <button className={danger} disabled={act.busy} onClick={cancel(o.id)}>Cancel</button>}
            </div>
          </div>
          {isSeller && o.status === "paid" && (
            <div className="flex flex-wrap gap-2 mt-3">
              <input className={`${input} max-w-[220px]`} placeholder="Pickup address" value={addr.pickup} onChange={e => setAddr({ ...addr, pickup: e.target.value })} />
              <input className={`${input} max-w-[220px]`} placeholder="Drop address" value={addr.drop} onChange={e => setAddr({ ...addr, drop: e.target.value })} />
              <button className={primary} disabled={act.busy} onClick={go(o.id, () => marketApi.shipOrder(o.id, { pickupAddress: addr.pickup || undefined, dropAddress: addr.drop || undefined }))}>Book shipment</button>
            </div>
          )}
          {detail?.order.id === o.id && (
            <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
              {detail.payments.map(p => <p key={p.id}>Payment {inr(p.amount)} · {p.provider} · escrow <b>{p.escrowStatus}</b></p>)}
              {detail.shipment && <p>Shipment <b>{detail.shipment.trackingCode}</b> · <Pill s={detail.shipment.status} /></p>}
              {detail.shipmentEvents.map(e => <p key={e.id}>• {e.status.replace(/_/g, " ")} — {new Date(e.createdAt).toLocaleString("en-IN")}{e.note ? ` (${e.note})` : ""}</p>)}
              {!detail.payments.length && !detail.shipment && <p>No payment yet.</p>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- Logistics

const NEXT_SHIP: Record<string, string | undefined> = { booked: "picked_up", picked_up: "in_transit", in_transit: "delivered" };

function ShipmentsPanel() {
  const ships = useLoad<Shipment[]>(marketApi.myShipments, []);
  const act = useAction();
  return (
    <div className="space-y-3">
      <ErrorBanner msg={act.error || ships.error} />
      {ships.loading ? <Empty text="Loading..." /> : ships.data.length === 0 ? <Empty text="No shipments assigned to you yet." /> : ships.data.map(s => {
        const next = NEXT_SHIP[s.status];
        return (
          <div key={s.id} className={`${card} flex items-center justify-between flex-wrap gap-2`}>
            <div>
              <p className="font-bold text-slate-800">{s.trackingCode}</p>
              <p className="text-xs text-slate-500">{s.pickupAddress ?? "-"} → {s.dropAddress ?? "-"}</p>
            </div>
            <div className="flex items-center gap-2"><Pill s={s.status} />
              {next && <button className={primary} disabled={act.busy} onClick={async () => { if (await act.run(() => marketApi.addShipmentEvent(s.id, { status: next }))) ships.reload(); }}>Mark {next.replace(/_/g, " ")}</button>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------- Warehouse

function StockPanel() {
  const stock = useLoad<StockRow[]>(marketApi.listStock, []);
  const act = useAction();
  const [f, setF] = useState({ warehouseName: "", location: "", cropName: "", quantityKg: "" });
  const [delta, setDelta] = useState<Record<string, string>>({});
  return (
    <div className="space-y-4">
      <div className={card}>
        <ErrorBanner msg={act.error || stock.error} />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <input className={input} placeholder="Warehouse" value={f.warehouseName} onChange={e => setF({ ...f, warehouseName: e.target.value })} />
          <input className={input} placeholder="Location" value={f.location} onChange={e => setF({ ...f, location: e.target.value })} />
          <input className={input} placeholder="Crop" value={f.cropName} onChange={e => setF({ ...f, cropName: e.target.value })} />
          <input className={input} type="number" min="0" placeholder="Qty (kg)" value={f.quantityKg} onChange={e => setF({ ...f, quantityKg: e.target.value })} />
          <button className={primary} disabled={act.busy} onClick={async () => {
            if (await act.run(() => marketApi.addStock({ warehouseName: f.warehouseName, location: f.location || undefined, cropName: f.cropName, quantityKg: Number(f.quantityKg) }))) {
              setF({ warehouseName: "", location: "", cropName: "", quantityKg: "" }); stock.reload();
            }
          }}>Add stock</button>
        </div>
      </div>
      {stock.data.map(s => (
        <div key={s.id} className={`${card} flex items-center justify-between flex-wrap gap-2`}>
          <div><p className="font-bold text-slate-800">{s.cropName} · {s.quantityKg} kg</p><p className="text-xs text-slate-500">{s.warehouseName}{s.location ? ` · ${s.location}` : ""}</p></div>
          <div className="flex gap-2">
            <input className={`${input} w-28`} type="number" placeholder="+/- kg" value={delta[s.id] ?? ""} onChange={e => setDelta({ ...delta, [s.id]: e.target.value })} />
            <button className={primary} disabled={act.busy} onClick={async () => { if (await act.run(() => marketApi.adjustStock(s.id, Number(delta[s.id])))) { setDelta({ ...delta, [s.id]: "" }); stock.reload(); } }}>Apply</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- Admin

function StatsPanel() {
  const s = useLoad<MarketStats | null>(marketApi.stats, null);
  if (s.error) return <ErrorBanner msg={s.error} />;
  if (!s.data) return <Empty text="Loading..." />;
  const items: [string, string][] = [
    ["Farms", String(s.data.farms)], ["Open listings", String(s.data.openListings)], ["Pending bids", String(s.data.pendingBids)],
    ["Orders", String(s.data.orders)], ["Completed orders", String(s.data.completedOrders)],
    ["Completed value", inr(s.data.completedValue)], ["Held in escrow", inr(s.data.escrowHeld)],
    ["Refunds pending", String(s.data.refundsPending ?? 0)],
  ];
  return <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{items.map(([k, v]) => <div key={k} className={card}><p className="text-xs text-slate-500">{k}</p><p className="text-xl font-black text-slate-800">{v}</p></div>)}</div>;
}

// ---------------------------------------------------------------- Shell

type Tab = { id: string; label: string; node: React.ReactNode };

export default function LiveMarketplace() {
  const { user } = useAuth();
  const role = user?.role ?? "";
  const tabs: Tab[] =
    role === "Farmer" ? [
      { id: "sell", label: "Sell & bids", node: <SellPanel /> },
      { id: "farms", label: "My farms & crops", node: <FarmsPanel /> },
      { id: "orders", label: "Orders & shipping", node: <OrdersPanel role={role} /> },
      { id: "stock", label: "Stored stock", node: <StockPanel /> },
      { id: "feeds", label: "Mandi prices & weather", node: <LiveFeeds /> },
    ] : role === "Buyer" ? [
      { id: "browse", label: "Browse & bid", node: <BrowsePanel /> },
      { id: "bids", label: "My bids", node: <MyBidsPanel /> },
      { id: "orders", label: "My orders", node: <OrdersPanel role={role} /> },
      { id: "feeds", label: "Mandi prices & weather", node: <LiveFeeds /> },
    ] : role === "Logistics Provider" ? [
      { id: "ships", label: "My shipments", node: <ShipmentsPanel /> },
    ] : role === "Warehouse Operator" ? [
      { id: "stock", label: "Warehouse stock", node: <StockPanel /> },
    ] : role === "Admin" ? [
      { id: "stats", label: "Marketplace stats", node: <StatsPanel /> },
    ] : [];

  const [tab, setTab] = useState<string>("");
  const active = tabs.find(t => t.id === tab) ?? tabs[0];

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div>
        <h2 className="text-xl font-black text-slate-800">Live Marketplace</h2>
        <p className="text-xs text-slate-500">Real data saved on the server. You are signed in as <b>{role || "unknown"}</b>; what you can do follows your account role.</p>
      </div>
      {!active ? (
        <div className={card}><p className="text-sm text-slate-600">The live marketplace is available to Farmer, Buyer, Logistics Provider, Warehouse Operator and Admin accounts. Register one of those roles to trade.</p></div>
      ) : (
        <>
          <div className="flex gap-2 flex-wrap">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${active.id === t.id ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>{t.label}</button>
            ))}
          </div>
          <React.Fragment key={active.id}>{active.node}</React.Fragment>
        </>
      )}
    </div>
  );
}
