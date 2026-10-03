// Typed client for server/buyerProfiles.ts (/api/buyer-profiles). Quantities in quintals, prices in Rs per quintal.

export type BuyerType = "trader" | "retailer" | "wholesaler" | "processor" | "exporter";
export type Frequency = "one_time" | "weekly" | "monthly" | "seasonal";
export type DeliveryPref = "delivery" | "pickup" | "either";
export type PaymentTerms = "advance" | "on_delivery" | "credit_7d" | "credit_15d";

export interface BuyerProfile {
  id: string; buyerCode: string; ownerId: string; buyerName: string; buyerType: BuyerType;
  district: string; location: string | null; requiredCrop: string; requiredQuantityQuintals: number;
  offeredPricePerQuintal: number; preferredGrade: string | null; purchaseFrequency: Frequency;
  deliveryPreference: DeliveryPref; paymentTerms: PaymentTerms; verifiedStatus: "pending" | "verified" | "rejected";
  contactPermission: boolean;
}
export type BuyerProfileInput = Omit<BuyerProfile, "id" | "buyerCode" | "ownerId" | "verifiedStatus">;

export interface Match {
  score: number; priceGap: number | null; matchedQuantityQuintals: number; fullFill: boolean;
  needsNegotiation: boolean; sameDistrict: boolean; crop: string; nextStep: "negotiate" | "place_order";
  farmer: { code: string; name: string | null; district: string; quantityQuintals: number; expectedPricePerQuintal: number | null };
  buyer: { code: string; name: string | null; type: BuyerType; district: string; requiredQuantityQuintals: number; offeredPricePerQuintal: number; paymentTerms: PaymentTerms; deliveryPreference: DeliveryPref };
}

async function call<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`/api/buyer-profiles${path}`, {
    method, credentials: "include", headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as any)?.error || `Request failed (${res.status})`);
  return data as T;
}

export const buyerProfilesApi = {
  list: () => call<{ profiles: BuyerProfile[] }>("GET", ""),
  create: (b: BuyerProfileInput) => call<BuyerProfile>("POST", "", b),
  update: (id: string, b: BuyerProfileInput) => call<BuyerProfile>("PUT", `/${id}`, b),
  verify: (id: string, status: "verified" | "rejected") => call<BuyerProfile>("POST", `/${id}/verify`, { status }),
  matches: () => call<{ matches: Match[]; total: number }>("GET", "/matches"),
};
