// Client for the farmer data collection / validation API (server/farmerProfiles.ts).
// Prices are Rs per quintal (100 kg); quantity is in quintals.

export type VerifiedStatus = "pending" | "verified" | "rejected";
export type SellingPreference = "mandi" | "direct_buyer" | "fpo" | "contract" | "undecided";

export interface FarmerProfile {
  id: string; farmerCode: string; ownerId: string; farmerName: string; district: string; location: string | null; crop: string;
  quantityQuintals: number; expectedPricePerQuintal: number | null; currentMarketPrice: number | null;
  latestMandiPrice: { modal: number; date: string } | null; sellingPreference: SellingPreference; buyerRequirement: string | null;
  verifiedStatus: VerifiedStatus; contactPermission: boolean; collectedOn: string; isSample: boolean;
}
export interface FarmerProfileInput {
  farmerName: string; district: string; location?: string; crop: string; quantityQuintals: number;
  expectedPricePerQuintal?: number | null; currentMarketPrice?: number | null; sellingPreference: SellingPreference;
  buyerRequirement?: string; contactPermission: boolean; collectedOn: string; verifiedStatus?: VerifiedStatus;
}
export interface FarmerStats { total: number; verified: number; pending: number; rejected: number; contactAllowed: number; samples: number }

async function call<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`/api/farmer-profiles${path}`, {
    method, credentials: "include", headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as any)?.error || `Request failed (${res.status})`);
  return data as T;
}

const qs = (o: Record<string, string | undefined>) => {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(o)) if (v) p.set(k, v);
  const s = p.toString();
  return s ? `?${s}` : "";
};

export const farmerProfilesApi = {
  list: (f: { q?: string; district?: string; status?: string } = {}) => call<{ profiles: FarmerProfile[]; stats: FarmerStats }>("GET", `/${qs(f)}`),
  create: (b: FarmerProfileInput) => call<FarmerProfile>("POST", "/", b),
  update: (id: string, b: Partial<FarmerProfileInput>) => call<FarmerProfile>("PATCH", `/${id}`, b),
  remove: (id: string) => call<{ ok: true }>("DELETE", `/${id}`),
  bulk: (rows: Record<string, string>[]) => call<{ inserted: number; skipped: { row: number; error: string }[] }>("POST", "/bulk", { rows }),
  loadSample: () => call<{ inserted: number; total: number }>("POST", "/load-sample"),
  removeSamples: () => call<{ removed: number }>("DELETE", "/samples"),
};
