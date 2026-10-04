// Typed client for server/negotiation.ts (/api/negotiation). Prices in rupees per kg.

export type Side = "seller" | "buyer";
export interface Counter {
  id: string; bidId: string; from: Side; quantityKg: number; pricePerKg: number; totalAmount: number;
  note: string | null; status: "open" | "accepted" | "superseded"; createdAt: string;
}
export interface Negotiation {
  you: Side;
  bid: { status: "pending" | "accepted" | "rejected" | "withdrawn"; quantityKg: number; pricePerKg: number };
  listing: { cropName: string; availableKg: number; status: string };
  turn: Side | null;
  counters: Counter[];
  maxCounters: number;
}

async function call<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`/api/negotiation${path}`, {
    method, credentials: "include", headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as any)?.error || `Request failed (${res.status})`);
  return data as T;
}

export const negotiationApi = {
  get: (bidId: string) => call<Negotiation>("GET", `/bids/${bidId}`),
  counter: (bidId: string, b: { pricePerKg: number; quantityKg?: number; note?: string }) =>
    call<{ counter: Counter; turn: Side }>("POST", `/bids/${bidId}/counter`, b),
  acceptCounter: (bidId: string) =>
    call<{ agreed: { quantityKg: number; pricePerKg: number; totalAmount: number }; nextStep: string }>("POST", `/bids/${bidId}/accept-counter`),
};
