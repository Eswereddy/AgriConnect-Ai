// ==========================================
// REAL PAYMENTS (Razorpay)
// ==========================================
//   GET  /api/market/payments/config                 which payment mode is active (no secrets)
//   POST /api/market/payments/orders/:id/intent      buyer: create (or reuse) the Razorpay order
//   POST /api/market/payments/orders/:id/verify      buyer: checkout finished -> verify + settle
//   POST /api/market/payments/admin/retry-refunds    admin: retry refunds that failed earlier
//   POST /api/payments/razorpay/webhook              Razorpay -> us (signature verified, no login)
//
// Trust rules:
//  - the amount charged always comes from OUR orders table, never from the browser
//  - a payment only counts after we (a) verify Razorpay's signature AND (b) re-read the
//    payment from Razorpay's API and confirm order id, amount and "captured" status
//  - browser verify and webhook can both arrive, in either order, any number of times:
//    settlement is idempotent (conditional UPDATEs)
//  - if money arrives for an order that was cancelled meanwhile (or a duplicate payment
//    arrives for an already-paid order), it is refunded

import { Router, type Request, type Response, type NextFunction } from "express";
import { randomUUID } from "crypto";
import { requireAuth, requireRole, type AuthedRequest } from "./auth";
import { query, withTransaction, pgAvailable } from "./pg";
import { HttpError, wrap, idParam, mOrder, mPayment } from "./marketplace";
import {
  paymentMode, razorpayKeyId, createRzOrder, fetchRzPayment, captureRzPayment,
  verifyCheckoutSignature, verifyWebhookSignature, refundHeldPayments, RazorpayError,
} from "./razorpay";

export const paymentsRouter = Router();

paymentsRouter.use((req, res, next) => {
  if (!pgAvailable()) {
    res.status(503).json({ error: "The marketplace database is not available. Set DATABASE_URL and restart." });
    return;
  }
  requireAuth(req as AuthedRequest, res, next);
});

// Turns Razorpay client errors into clean API errors.
function rzGuard(err: unknown): never {
  if (err instanceof RazorpayError) throw new HttpError(err.status === 401 ? 502 : err.status >= 500 ? 502 : 400, err.message);
  throw err;
}

paymentsRouter.get("/config", wrap(async (_req, res) => {
  const mode = paymentMode();
  res.json({ provider: mode, keyId: mode === "razorpay" ? razorpayKeyId() : null });
}));

// ---------- 1. intent ----------

paymentsRouter.post("/orders/:id/intent", requireRole("Buyer"), wrap(async (req, res) => {
  if (paymentMode() !== "razorpay") throw new HttpError(409, "Razorpay is not configured on this server.");
  const orderId = idParam(req);
  const order = (await query(`SELECT * FROM orders WHERE id = $1 AND buyer_id = $2`, [orderId, req.user!.id]))[0];
  if (!order) throw new HttpError(404, "Order not found.");
  if (order.status !== "pending_payment") throw new HttpError(409, "This order is not awaiting payment.");

  // Reuse an open checkout so repeated clicks don't pile up orphan Razorpay orders.
  const open = (await query(
    `SELECT * FROM payments WHERE order_id = $1 AND provider = 'razorpay' AND status = 'created' ORDER BY created_at DESC LIMIT 1`, [orderId]
  ))[0];
  let rzOrderId = open?.provider_ref as string | undefined;
  if (!rzOrderId) {
    try {
      const rz = await createRzOrder(order.total_paise, order.id, { order_id: order.id, buyer_id: order.buyer_id });
      rzOrderId = rz.id;
    } catch (e) { rzGuard(e); }
    await query(
      `INSERT INTO payments (id, order_id, amount_paise, provider, provider_ref, status, escrow_status)
       VALUES ($1,$2,$3,'razorpay',$4,'created','held')`, [randomUUID(), orderId, order.total_paise, rzOrderId]
    );
  }
  res.json({ keyId: razorpayKeyId(), razorpayOrderId: rzOrderId, amount: order.total_paise, currency: "INR", orderId });
}));

// ---------- 2. settle (shared by verify + webhook) ----------

type Settled =
  | { kind: "paid" | "already"; orderId: string }
  | { kind: "refunded"; orderId: string }
  | { kind: "unknown" | "mismatch" };

async function settleCaptured(rzOrderId: string, rzPaymentId: string, amountPaise: number): Promise<Settled> {
  const out = await withTransaction(async (q) => {
    const pay = (await q(`SELECT * FROM payments WHERE provider = 'razorpay' AND provider_ref = $1`, [rzOrderId]))[0];
    if (!pay) return { kind: "unknown" } as const;
    if (amountPaise !== pay.amount_paise) return { kind: "mismatch" } as const;
    if (pay.status === "captured") return { kind: "already", orderId: pay.order_id } as const;

    const upd = await q(
      `UPDATE payments SET status = 'captured', escrow_status = 'held', provider_payment_id = $1
       WHERE id = $2 AND status IN ('created','failed') RETURNING id`, [rzPaymentId, pay.id]
    );
    if (!upd[0]) return { kind: "already", orderId: pay.order_id } as const;

    const ord = await q(
      `UPDATE orders SET status = 'paid', updated_at = now() WHERE id = $1 AND status = 'pending_payment' RETURNING id`, [pay.order_id]
    );
    if (ord[0]) return { kind: "paid", orderId: pay.order_id } as const;

    // The order was cancelled, or is already paid by another payment (duplicate): this
    // money is not owed to the seller. Flag it as owed back to the buyer.
    await q(`UPDATE payments SET escrow_status = 'refunded', released_at = now() WHERE id = $1`, [pay.id]);
    return { kind: "refund", orderId: pay.order_id } as const;
  });

  if (out.kind === "refund") {
    const r = await refundHeldPayments(out.orderId);
    console.warn(`[payments] Extra/late payment for order ${out.orderId}: refund ${r.failed ? "QUEUED (will retry)" : "issued"}.`);
    return { kind: "refunded", orderId: out.orderId };
  }
  return out;
}

// ---------- 3. verify (browser says "done") ----------

paymentsRouter.post("/orders/:id/verify", requireRole("Buyer"), wrap(async (req, res) => {
  if (paymentMode() !== "razorpay") throw new HttpError(409, "Razorpay is not configured on this server.");
  const orderId = idParam(req);
  const b = req.body ?? {};
  const rzOrderId = typeof b.razorpay_order_id === "string" ? b.razorpay_order_id : "";
  const rzPaymentId = typeof b.razorpay_payment_id === "string" ? b.razorpay_payment_id : "";
  const signature = typeof b.razorpay_signature === "string" ? b.razorpay_signature : "";

  if (!verifyCheckoutSignature(rzOrderId, rzPaymentId, signature)) throw new HttpError(400, "Payment signature is invalid.");

  const pay = (await query(
    `SELECT p.* FROM payments p JOIN orders o ON o.id = p.order_id
     WHERE p.provider = 'razorpay' AND p.provider_ref = $1 AND p.order_id = $2 AND o.buyer_id = $3`,
    [rzOrderId, orderId, req.user!.id]
  ))[0];
  if (!pay) throw new HttpError(404, "No matching checkout for this order.");

  // Never trust the browser's word on amount/status: read the payment from Razorpay.
  let rp;
  try {
    rp = await fetchRzPayment(rzPaymentId);
    if (rp.order_id !== rzOrderId || rp.amount !== pay.amount_paise) throw new HttpError(400, "Payment does not match this order.");
    if (rp.status === "authorized") rp = await captureRzPayment(rzPaymentId, pay.amount_paise);
  } catch (e) { rzGuard(e); }
  if (!rp || rp.status !== "captured") throw new HttpError(402, `Payment not completed (status: ${rp?.status ?? "unknown"}).`);

  const settled = await settleCaptured(rzOrderId, rzPaymentId, rp.amount);
  if (settled.kind === "refunded") throw new HttpError(409, "This order could not take that payment (it was cancelled or is already paid). The money is being refunded.");
  if (settled.kind === "unknown" || settled.kind === "mismatch") throw new HttpError(400, "Payment could not be matched to the order.");

  const order = (await query(`SELECT * FROM orders WHERE id = $1`, [orderId]))[0];
  const payment = (await query(`SELECT * FROM payments WHERE id = $1`, [pay.id]))[0];
  res.json({ order: mOrder(order), payment: mPayment(payment) });
}));

// ---------- 4. admin: retry stuck refunds ----------

paymentsRouter.post("/admin/retry-refunds", requireRole("Admin"), wrap(async (_req, res) => {
  res.json(await refundHeldPayments());
}));

// ---------- 5. webhook (Razorpay -> server) ----------
// Mounted in server.ts WITHOUT login, and with the raw body preserved for the signature.

export async function razorpayWebhook(req: Request, res: Response, next: NextFunction) {
  try {
    const raw: Buffer | undefined = (req as any).rawBody;
    if (!verifyWebhookSignature(raw, req.header("x-razorpay-signature") ?? undefined)) {
      res.status(400).json({ error: "Invalid signature." });
      return;
    }
    if (!pgAvailable()) { res.status(503).json({ error: "Database unavailable, please retry." }); return; }

    const event = JSON.parse(raw!.toString("utf8"));
    const type: string = event?.event;
    const entity = event?.payload?.payment?.entity;

    if ((type === "payment.captured" || type === "order.paid") && entity?.id && entity?.order_id) {
      const r = await settleCaptured(entity.order_id, entity.id, entity.amount);
      if (r.kind === "mismatch") console.error(`[payments] Webhook amount mismatch for Razorpay order ${entity.order_id} - ignored.`);
    } else if (type === "payment.failed" && entity?.order_id) {
      await query(`UPDATE payments SET status = 'failed' WHERE provider = 'razorpay' AND provider_ref = $1 AND status = 'created'`, [entity.order_id]);
    }
    // Always 200 for a verified event we don't act on, so Razorpay stops retrying it.
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
