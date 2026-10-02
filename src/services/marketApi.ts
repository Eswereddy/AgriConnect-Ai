// Typed client for the real marketplace API (server/marketplace.ts).
// Amounts are in RUPEES at this layer; the server stores integer paise.

export interface Farm { id: string; name: string; village: string | null; district: string; state: string; areaAcres: number; soilType: string | null; createdAt: string }
export interface Crop { id: string; farmId: string; cropName: string; variety: string | null; areaAcres: number; sownOn: string | null; expectedHarvestOn: string | null; status: "planned" | "growing" | "harvested" }
export interface Listing { id: string; sellerId: string; sellerName: string | null; farmId: string | null; cropName: string; variety: string | null; grade: string | null; district: string | null; state: string | null; quantityKg: number; availableKg: number; minPricePerKg: number; status: "open" | "sold_out" | "closed"; createdAt: string }
export interface Bid { id: string; listingId: string; buyerId: string; buyerName: string | null; quantityKg: number; pricePerKg: number; totalAmount: number; status: "pending" | "accepted" | "rejected" | "withdrawn"; createdAt: string }
export type OrderStatus = "pending_payment" | "paid" | "shipped" | "delivered" | "completed" | "cancelled";
export interface Order { id: string; listingId: string; sellerId: string; sellerName: string | null; buyerId: string; buyerName: string | null; cropName: string; quantityKg: number; pricePerKg: number; totalAmount: number; status: OrderStatus; createdAt: string }
export interface Payment { id: string; orderId: string; amount: number; provider: string; providerRef: string | null; status: string; escrowStatus: "held" | "released" | "refunded" }
export interface Shipment { id: string; orderId: string; carrierId: string | null; trackingCode: string; pickupAddress: string | null; dropAddress: string | null; status: "booked" | "picked_up" | "in_transit" | "delivered" }
export interface OrderDetail { order: Order; payments: Payment[]; shipment: Shipment | null; shipmentEvents: { id: string; status: string; note: string | null; createdAt: string }[] }
export interface StockRow { id: string; warehouseName: string; location: string | null; cropName: string; quantityKg: number }
export interface MarketStats { farms: number; openListings: number; pendingBids: number; orders: number; completedOrders: number; completedValue: number; escrowHeld: number }

async function call<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`/api/market${path}`, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as any)?.error || `Request failed (${res.status})`);
  return data as T;
}

export const marketApi = {
  // farmer
  listFarms: () => call<Farm[]>("GET", "/farms"),
  createFarm: (b: { name: string; village?: string; district: string; state: string; areaAcres: number; soilType?: string }) => call<Farm>("POST", "/farms", b),
  listCrops: (farmId: string) => call<Crop[]>("GET", `/farms/${farmId}/crops`),
  createCrop: (farmId: string, b: { cropName: string; variety?: string; areaAcres: number; sownOn?: string; expectedHarvestOn?: string }) => call<Crop>("POST", `/farms/${farmId}/crops`, b),
  // listings
  listListings: (q: { crop?: string; district?: string; mine?: boolean; status?: string } = {}) => {
    const p = new URLSearchParams();
    if (q.crop) p.set("crop", q.crop);
    if (q.district) p.set("district", q.district);
    if (q.mine) p.set("mine", "true");
    if (q.status) p.set("status", q.status);
    const s = p.toString();
    return call<Listing[]>("GET", `/listings${s ? "?" + s : ""}`);
  },
  createListing: (b: { farmId?: string; cropId?: string; cropName?: string; variety?: string; grade?: string; quantityKg: number; minPricePerKg: number }) => call<Listing>("POST", "/listings", b),
  closeListing: (id: string) => call<Listing>("POST", `/listings/${id}/close`),
  // bids
  placeBid: (listingId: string, b: { quantityKg: number; pricePerKg: number }) => call<Bid>("POST", `/listings/${listingId}/bids`, b),
  listingBids: (listingId: string) => call<Bid[]>("GET", `/listings/${listingId}/bids`),
  myBids: () => call<Bid[]>("GET", "/bids/mine"),
  withdrawBid: (id: string) => call<Bid>("POST", `/bids/${id}/withdraw`),
  rejectBid: (id: string) => call<Bid>("POST", `/bids/${id}/reject`),
  acceptBid: (id: string) => call<Order>("POST", `/bids/${id}/accept`),
  // orders
  listOrders: () => call<Order[]>("GET", "/orders"),
  orderDetail: (id: string) => call<OrderDetail>("GET", `/orders/${id}`),
  payOrder: (id: string) => call<{ order: Order; payment: Payment }>("POST", `/orders/${id}/pay`),
  cancelOrder: (id: string) => call<Order>("POST", `/orders/${id}/cancel`),
  shipOrder: (id: string, b: { pickupAddress?: string; dropAddress?: string; carrierId?: string }) => call<{ order: Order; shipment: Shipment }>("POST", `/orders/${id}/ship`, b),
  confirmDelivery: (id: string) => call<Order>("POST", `/orders/${id}/confirm-delivery`),
  // shipments
  myShipments: () => call<Shipment[]>("GET", "/shipments/mine"),
  addShipmentEvent: (id: string, b: { status: string; note?: string }) => call<Shipment>("POST", `/shipments/${id}/events`, b),
  // warehouse stock
  listStock: () => call<StockRow[]>("GET", "/stock"),
  addStock: (b: { warehouseName: string; location?: string; cropName: string; quantityKg: number }) => call<StockRow>("POST", "/stock", b),
  adjustStock: (id: string, deltaKg: number) => call<StockRow>("POST", `/stock/${id}/adjust`, { deltaKg }),
  // admin
  stats: () => call<MarketStats>("GET", "/stats"),
};

export const inr = (n: number) => "\u20B9" + n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
