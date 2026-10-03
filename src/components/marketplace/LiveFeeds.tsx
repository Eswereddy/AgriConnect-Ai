import React, { useCallback, useEffect, useState } from "react";
import { liveApi, type WeatherResponse, type MandiResponse, type MandiRecord, type TrendPoint } from "../../services/liveApi";

// REAL feeds: weather from Open-Meteo, mandi prices from data.gov.in (Agmarknet data).
// If a feed is down you are told so. Nothing on this screen is generated or random.

const card = "bg-white border border-slate-200 rounded-2xl p-4 shadow-sm";
const input = "border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400";
const primary = "px-3 py-2 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50";
const inr = (n: number) => "\u20B9" + n.toLocaleString("en-IN", { maximumFractionDigits: 2 });

function WeatherPanel() {
  const [place, setPlace] = useState("Anantapur");
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (p: string) => {
    setLoading(true); setError(null);
    try { setData(await liveApi.weather(p)); } catch (e: any) { setData(null); setError(e?.message || "Could not load weather."); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load("Anantapur"); }, [load]);

  return (
    <div className={card}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <h3 className="font-bold text-slate-800 mr-2">Weather</h3>
        <input className={input} placeholder="Village / town / city" value={place} onChange={e => setPlace(e.target.value)} onKeyDown={e => e.key === "Enter" && load(place)} />
        <button className={primary} disabled={loading || !place.trim()} onClick={() => load(place)}>{loading ? "Loading..." : "Get forecast"}</button>
      </div>
      {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg px-3 py-2 mb-3">{error}</div>}
      {data && (
        <>
          <p className="text-xs text-slate-500 mb-2">{data.place.name}{data.place.region ? `, ${data.place.region}` : ""} · live from {data.source}{data.cached ? " (cached up to 15 min)" : ""}</p>
          <div className="flex flex-wrap items-end gap-6 mb-3">
            <p className="text-4xl font-black text-slate-800">{Math.round(data.current.tempC)}°C</p>
            <p className="text-sm text-slate-600">{data.current.summary}<br />Humidity {data.current.humidityPct}% · Wind {data.current.windKmh} km/h</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-3">
            <p className="text-xs font-black text-emerald-800 uppercase tracking-wider mb-1">Farm advisory</p>
            <ul className="text-sm text-emerald-900 space-y-1 list-disc ml-4">{data.advisories.map((a, i) => <li key={i}>{a}</li>)}</ul>
            <p className="text-[10px] text-emerald-700 mt-2">{data.advisoryNote}</p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
            {data.daily.map(d => (
              <div key={d.date} className="border border-slate-100 rounded-xl p-2 text-center">
                <p className="text-[10px] font-bold text-slate-500">{new Date(d.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric" })}</p>
                <p className="text-sm font-black text-slate-800">{Math.round(d.tempMaxC)}° <span className="text-slate-400 font-semibold">{Math.round(d.tempMinC)}°</span></p>
                <p className="text-[10px] text-slate-500">{d.summary}</p>
                <p className="text-[10px] text-sky-600 font-bold">{d.rainMm > 0 ? `${d.rainMm} mm` : "dry"} · {d.rainChancePct}%</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Sparkline({ points }: { points: TrendPoint[] }) {
  if (points.length < 2) return <p className="text-xs text-slate-400">Not enough saved history yet. A trend appears as daily prices accumulate.</p>;
  const w = 320, h = 70, pad = 6;
  const ys = points.map(p => p.modalPerQuintal);
  const min = Math.min(...ys), max = Math.max(...ys), span = max - min || 1;
  const pts = points.map((p, i) => `${pad + (i * (w - 2 * pad)) / (points.length - 1)},${h - pad - ((p.modalPerQuintal - min) / span) * (h - 2 * pad)}`).join(" ");
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-sm h-[70px]"><polyline points={pts} fill="none" stroke="#059669" strokeWidth="2" /></svg>
      <p className="text-[10px] text-slate-500">{points[0].date}: {inr(points[0].modalPerQuintal)} → {points[points.length - 1].date}: {inr(points[points.length - 1].modalPerQuintal)} per quintal</p>
    </div>
  );
}

function MandiPanel() {
  const [f, setF] = useState({ state: "Andhra Pradesh", district: "", commodity: "", market: "" });
  const [data, setData] = useState<MandiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [trend, setTrend] = useState<{ key: string; points: TrendPoint[] } | null>(null);

  const search = useCallback(async (filters: typeof f) => {
    setLoading(true); setError(null); setTrend(null);
    try { setData(await liveApi.mandi({ ...filters, limit: 100 })); } catch (e: any) { setData(null); setError(e?.message || "Could not load prices."); } finally { setLoading(false); }
  }, []);
  useEffect(() => { search({ state: "Andhra Pradesh", district: "", commodity: "", market: "" }); }, [search]);

  const showTrend = async (r: MandiRecord) => {
    const key = `${r.commodity}|${r.market}`;
    if (trend?.key === key) { setTrend(null); return; }
    try { setTrend({ key, points: (await liveApi.trend(r.commodity, r.market, 30)).points }); } catch (e: any) { setError(e?.message || "Could not load trend."); }
  };

  const badge = !data ? null : data.source === "data.gov.in" ? { t: "Live from data.gov.in", c: "bg-emerald-50 text-emerald-700" }
    : data.source === "cache" ? { t: "Live (cached up to 30 min)", c: "bg-emerald-50 text-emerald-700" }
    : data.source === "kaggle-file" ? { t: "Not live - saved Kaggle dataset prices", c: "bg-amber-50 text-amber-700" }
    : { t: "Feed unavailable - showing last saved prices", c: "bg-amber-50 text-amber-700" };

  return (
    <div className={card}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <h3 className="font-bold text-slate-800 mr-2">Mandi prices</h3>
        <input className={`${input} w-40`} placeholder="State" value={f.state} onChange={e => setF({ ...f, state: e.target.value })} />
        <input className={`${input} w-32`} placeholder="District" value={f.district} onChange={e => setF({ ...f, district: e.target.value })} />
        <input className={`${input} w-32`} placeholder="Market" value={f.market} onChange={e => setF({ ...f, market: e.target.value })} />
        <input className={`${input} w-32`} placeholder="Crop" value={f.commodity} onChange={e => setF({ ...f, commodity: e.target.value })} onKeyDown={e => e.key === "Enter" && search(f)} />
        <button className={primary} disabled={loading} onClick={() => search(f)}>{loading ? "Loading..." : "Search"}</button>
      </div>
      {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg px-3 py-2 mb-3">{error}</div>}
      {badge && <p className={`inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${badge.c}`}>{badge.t}</p>}
      {data?.note && <p className="text-xs text-amber-700 mb-2">{data.note}</p>}
      {data && data.records.length === 0 && <p className="text-sm text-slate-400 py-4 text-center">No arrivals reported for this search today. Try a wider search.</p>}
      {data && data.records.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[10px] uppercase tracking-wider text-slate-400">
              <th className="py-1 pr-3">Crop</th><th className="pr-3">Market</th><th className="pr-3">Date</th><th className="pr-3 text-right">Min</th><th className="pr-3 text-right">Modal</th><th className="pr-3 text-right">Max</th><th className="text-right">₹/kg</th><th />
            </tr></thead>
            <tbody>
              {data.records.map((r, i) => {
                const key = `${r.commodity}|${r.market}`;
                return (
                  <React.Fragment key={`${key}|${r.variety}|${r.grade}|${r.arrivalDate}|${i}`}>
                    <tr className="border-t border-slate-100">
                      <td className="py-1.5 pr-3 font-semibold text-slate-800">{r.commodity}{r.variety ? <span className="text-slate-400 font-normal"> · {r.variety}</span> : null}</td>
                      <td className="pr-3 text-slate-600">{r.market}, {r.district}</td>
                      <td className="pr-3 text-slate-500">{r.arrivalDate}</td>
                      <td className="pr-3 text-right">{inr(r.minPerQuintal)}</td>
                      <td className="pr-3 text-right font-bold">{inr(r.modalPerQuintal)}</td>
                      <td className="pr-3 text-right">{inr(r.maxPerQuintal)}</td>
                      <td className="text-right text-emerald-700 font-bold">{inr(r.modalPerKg)}</td>
                      <td className="pl-2"><button className="text-[10px] font-bold text-emerald-700 hover:underline" onClick={() => showTrend(r)}>{trend?.key === key ? "hide" : "trend"}</button></td>
                    </tr>
                    {trend?.key === key && <tr><td colSpan={8} className="pb-3"><Sparkline points={trend.points} /></td></tr>}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
          <p className="text-[10px] text-slate-400 mt-2">Prices are ₹ per quintal (100 kg) as reported by mandis via Agmarknet / data.gov.in.</p>
        </div>
      )}
    </div>
  );
}

export default function LiveFeeds() {
  return <div className="space-y-4"><WeatherPanel /><MandiPanel /></div>;
}
