// Pays for an order. With real payments on, this opens Razorpay Checkout: card / UPI details
// are typed into Razorpay's own window and never touch our server. The server then verifies
// the result with Razorpay before marking the order paid.
import { marketApi } from "./marketApi";

declare global { interface Window { Razorpay?: any } }

function loadCheckoutScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Could not load the payment window. Check your internet connection."));
    document.body.appendChild(s);
  });
}

export async function payForOrder(orderId: string, buyer: { name?: string; email?: string }): Promise<void> {
  const cfg = await marketApi.paymentConfig();
  if (cfg.provider === "ledger") { await marketApi.payOrder(orderId); return; } // dev only: bookkeeping, no money
  if (cfg.provider !== "razorpay") throw new Error("Payments are not set up on this server yet.");

  await loadCheckoutScript();
  const intent = await marketApi.paymentIntent(orderId);

  await new Promise<void>((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: intent.keyId,
      order_id: intent.razorpayOrderId,
      amount: intent.amount,
      currency: intent.currency,
      name: "AgriConnect AI",
      description: "Crop purchase (held until you confirm delivery)",
      prefill: { name: buyer.name, email: buyer.email },
      theme: { color: "#059669" },
      handler: async (resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
        try { await marketApi.paymentVerify(orderId, resp); resolve(); } catch (e) { reject(e); }
      },
      modal: { ondismiss: () => reject(new Error("Payment window closed before the payment finished.")) },
    });
    rzp.on("payment.failed", (r: any) => reject(new Error(r?.error?.description || "The payment failed. You have not been charged.")));
    rzp.open();
  });
}
