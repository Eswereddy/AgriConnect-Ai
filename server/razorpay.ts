// ==========================================
// RAZORPAY (real payments)
// ==========================================
// Env (read at call time):
//   RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET   - from the Razorpay dashboard (use TEST keys first)
//   RAZORPAY_WEBHOOK_SECRET                - the secret you set on the webhook in the dashboard
//   RAZORPAY_API_BASE                      - optional override (used by tests)
//
// Card / UPI details are entered inside Razorpay's own checkout window and never
// touch this server - that is what keeps you out of PCI scope. The server only:
//   1. creates a Razorpay order for the exact amount stored in OUR database,
//   2. verifies the signature Razorpay returns, and re-reads the payment from
//      Razorpay's API (never trusts the amount or status sent by the browser),
//   3. refunds through the API when an order is cancelled.

import crypto from "crypto";
import { query } from "./pg";

export type PaymentMode = "razorpay" | "ledger" | "disabled";

/**
 * razorpay  - keys configured: real payments.
 * ledger    - no keys, non-production: the old bookkeeping-only escrow, for UI work.
 * disabled  - no keys in production: paying is refused rather than faked.
 */
export function paymentMode(): PaymentMode {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) return "razorpay";
  return process.env.NODE_ENV === "production" ? "disabled" : "ledger";
}

export const razorpayKeyId = () => process.env.RAZORPAY_KEY_ID || "";

export class RazorpayError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const apiBase = () => process.env.RAZORPAY_API_BASE || "https://api.razorpay.com/v1";

async function rz<T>(method: string, path: string, body?: unknown): Promise<T> {
  const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
  let res: Response;
  try {
    res = await fetch(apiBase() + path, {
      method,
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new RazorpayError(502, "Could not reach Razorpay. Please try again.");
  }
  const data: any = await res.json().catch(() => ({}));
  if (!res.ok) throw new RazorpayError(res.status, data?.error?.description || `Razorpay error (${res.status})`);
  return data as T;
}

export interface RzOrder { id: string; amount: number; currency: string; status: string }
export interface RzPayment { id: string; order_id: string; amount: number; status: string; currency?: string }

export const createRzOrder = (amountPaise: number, receipt: string, notes: Record<string, string>) =>
  rz<RzOrder>("POST", "/orders", { amount: amountPaise, currency: "INR", receipt, notes });

export const fetchRzPayment = (paymentId: string) => rz<RzPayment>("GET", `/payments/${encodeURIComponent(paymentId)}`);

export const captureRzPayment = (paymentId: string, amountPaise: number) =>
  rz<RzPayment>("POST", `/payments/${encodeURIComponent(paymentId)}/capture`, { amount: amountPaise, currency: "INR" });

export const refundRzPayment = (paymentId: string, amountPaise: number, notes?: Record<string, string>) =>
  rz<{ id: string }>("POST", `/payments/${encodeURIComponent(paymentId)}/refund`, { amount: amountPaise, notes });

// ---------- signatures ----------

function safeEqualHex(a: string, b: string): boolean {
  const x = Buffer.from(a, "utf8");
  const y = Buffer.from(b, "utf8");
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

/** Checkout success signature = HMAC_SHA256(key_secret, "<order_id>|<payment_id>"). */
export function verifyCheckoutSignature(orderId: string, paymentId: string, signature: string): boolean {
  if (!process.env.RAZORPAY_KEY_SECRET || !orderId || !paymentId || !signature) return false;
  const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest("hex");
  return safeEqualHex(expected, signature);
}

/** Webhook signature = HMAC_SHA256(webhook_secret, <raw request body>). */
export function verifyWebhookSignature(rawBody: Buffer | undefined, signature: string | undefined): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !rawBody || !signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqualHex(expected, signature);
}

// ---------- refunds ----------

/**
 * Refunds every Razorpay payment that is OWED back to the buyer: captured, flagged
 * escrow_status = 'refunded' (set when an order is cancelled, or when a duplicate/late
 * payment arrives) and with no refund id yet. Optionally limited to one order.
 * Safe to call repeatedly: a payment only becomes status "refunded" after Razorpay
 * accepts the refund, so a failed attempt simply stays queued for the next retry.
 */
export async function refundHeldPayments(orderId?: string): Promise<{ refunded: number; failed: number }> {
  const rows = await query(
    `SELECT id, provider_payment_id, amount_paise, order_id FROM payments
     WHERE provider = 'razorpay' AND status = 'captured' AND escrow_status = 'refunded'
       AND provider_refund_id IS NULL AND provider_payment_id IS NOT NULL
       ${orderId ? "AND order_id = $1" : ""}`,
    orderId ? [orderId] : []
  );
  let refunded = 0, failed = 0;
  for (const p of rows) {
    try {
      const rf = await refundRzPayment(p.provider_payment_id, p.amount_paise, { order_id: p.order_id, reason: "refund_owed" });
      await query(`UPDATE payments SET status = 'refunded', provider_refund_id = $1 WHERE id = $2`, [rf.id, p.id]);
      refunded++;
    } catch (err: any) {
      failed++;
      console.error(`[payments] REFUND PENDING for order ${p.order_id}, payment ${p.provider_payment_id}: ${err?.message}`);
    }
  }
  return { refunded, failed };
}
