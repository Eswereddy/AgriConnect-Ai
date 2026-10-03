// Client for the live data feeds (server/liveData.ts): weather + mandi prices.
// These are REAL feeds. If one is unavailable the server says so; it never invents numbers.

export interface WeatherDay { date: string; summary: string; tempMaxC: number; tempMinC: number; rainMm: number; rainChancePct: number; windMaxKmh: number; evapotranspirationMm: number }
export interface WeatherResponse {
  place: { name: string; latitude: number; longitude: number; region?: string };
  source: string; fetchedAt: string; cached: boolean;
  current: { tempC: number; humidityPct: number; rainMm: number; windKmh: number; summary: string; time: string };
  daily: WeatherDay[]; advisories: string[]; advisoryNote: string;
}
export interface MandiRecord { state: string; district: string; market: string; commodity: string; variety: string; grade: string; arrivalDate: string; minPerQuintal: number; maxPerQuintal: number; modalPerQuintal: number; modalPerKg: number }
export interface MandiResponse { source: "data.gov.in" | "cache" | "stored"; stale: boolean; fetchedAt: string | null; records: MandiRecord[]; note?: string }
export interface TrendPoint { date: string; modalPerQuintal: number; lowPerQuintal: number; highPerQuintal: number; markets: number }

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`/api/live${path}`, { credentials: "include" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as any)?.error || `Request failed (${res.status})`);
  return data as T;
}

const qs = (o: Record<string, string | number | undefined>) => {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(o)) if (v !== undefined && v !== "") p.set(k, String(v));
  const s = p.toString();
  return s ? `?${s}` : "";
};

export const liveApi = {
  weather: (place: string) => get<WeatherResponse>(`/weather${qs({ place })}`),
  weatherAt: (lat: number, lon: number) => get<WeatherResponse>(`/weather${qs({ lat, lon })}`),
  mandi: (f: { state?: string; district?: string; market?: string; commodity?: string; limit?: number }) => get<MandiResponse>(`/mandi${qs(f)}`),
  trend: (commodity: string, market?: string, days = 30) => get<{ points: TrendPoint[] }>(`/mandi/trend${qs({ commodity, market, days })}`),
};
