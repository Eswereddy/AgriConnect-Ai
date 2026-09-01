export interface PaymentPayload {
  amount: number;
  gateway: "razorpay" | "stripe";
  paymentMethod: "upi" | "card" | "netbanking";
  buyerName: string;
  buyerPhone: string;
  upiId?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  bankName?: string;
}

export interface GSTCalculationResult {
  orderAmount: number;
  platformFee: number;
  gatewayFee: number;
  baseServiceFee: number;
  serviceGst: number;
  cgstAmount: number;
  sgstAmount: number;
  sellerPayout: number;
}

export interface InvoiceResult {
  invoiceId: string;
  date: string;
  provider: {
    name: string;
    address: string;
    gstin: string;
  };
  buyer: {
    name: string;
    phone: string;
  };
  calculations: GSTCalculationResult;
  status: "paid" | "pending" | "failed";
}

export interface EscrowStatus {
  transactionId: string;
  amount: number;
  status: "held" | "released" | "refunded";
  heldAt: string;
  releasedAt?: string;
  refundedAt?: string;
}

export class PaymentGatewayService {
  /**
   * Performs dynamic GST-compliant calculations.
   * Calculates a 1% platform fee, 1% gateway processing fee, and 18% standard GST on service fees.
   */
  public static calculateGSTAndFees(
    amount: number,
    platformFeeRate = 0.01, // 1%
    gatewayFeeRate = 0.01,  // 1%
    gstRate = 0.18          // 18% standard service GST
  ): GSTCalculationResult {
    const platformFee = parseFloat((amount * platformFeeRate).toFixed(2));
    const gatewayFee = parseFloat((amount * gatewayFeeRate).toFixed(2));
    const baseServiceFee = parseFloat(((platformFee + gatewayFee) / (1 + gstRate)).toFixed(2));
    const serviceGst = parseFloat((platformFee + gatewayFee - baseServiceFee).toFixed(2));
    
    const cgstAmount = parseFloat((serviceGst / 2).toFixed(2));
    const sgstAmount = parseFloat((serviceGst / 2).toFixed(2));
    const sellerPayout = parseFloat((amount - platformFee - gatewayFee).toFixed(2));

    return {
      orderAmount: amount,
      platformFee,
      gatewayFee,
      baseServiceFee,
      serviceGst,
      cgstAmount,
      sgstAmount,
      sellerPayout
    };
  }

  /**
   * Simulates PCI-DSS compliant secure transaction initialization and escrow locking
   * using modern Stripe or Razorpay endpoints.
   */
  public static async processPayment(
    payload: PaymentPayload
  ): Promise<{
    success: boolean;
    transactionId: string;
    invoice: InvoiceResult;
    escrow: EscrowStatus;
    gatewayUsed: string;
  }> {
    // Basic validation guards
    if (payload.amount <= 0) {
      throw new Error("Transaction amount must be greater than ₹0.");
    }
    if (payload.paymentMethod === "upi" && (!payload.upiId || !payload.upiId.includes("@"))) {
      throw new Error("Invalid Virtual Payment Address (UPI ID) format.");
    }
    if (payload.paymentMethod === "card" && (!payload.cardNumber || payload.cardNumber.replace(/\s/g, "").length < 16)) {
      throw new Error("Secure payment failed: Invalid 16-digit card number.");
    }

    // Simulate standard payment processing network latency (1000ms)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const transactionId = "TXN_" + Math.random().toString(36).substring(2, 11).toUpperCase();
    const invoiceId = "ACAI-2026-" + Math.floor(100000 + Math.random() * 900000);
    const calculations = this.calculateGSTAndFees(payload.amount);

    const invoice: InvoiceResult = {
      invoiceId,
      date: new Date().toLocaleDateString("en-IN"),
      provider: {
        name: "AgriConnect AI Private Ltd",
        address: "7th Block, Koramangala, Bengaluru, Karnataka, 560034",
        gstin: "29AAFCA8324M1ZP"
      },
      buyer: {
        name: payload.buyerName,
        phone: payload.buyerPhone
      },
      calculations,
      status: "paid"
    };

    const escrow: EscrowStatus = {
      transactionId,
      amount: payload.amount,
      status: "held",
      heldAt: new Date().toLocaleTimeString()
    };

    return {
      success: true,
      transactionId,
      invoice,
      escrow,
      gatewayUsed: payload.gateway === "razorpay" ? "Razorpay v3.2.1" : "Stripe v2026-06"
    };
  }

  /**
   * Simulates releasing escrowed funds to the supplier or farmer upon buyer's verification.
   */
  public static async releaseEscrow(transactionId: string, amount: number): Promise<EscrowStatus> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      transactionId,
      amount,
      status: "released",
      heldAt: new Date(Date.now() - 3600000).toLocaleTimeString(),
      releasedAt: new Date().toLocaleTimeString()
    };
  }

  /**
   * Simulates refunding escrowed funds to the buyer under Buyer Protection Policy.
   */
  public static async refundEscrow(transactionId: string, amount: number): Promise<EscrowStatus> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      transactionId,
      amount,
      status: "refunded",
      heldAt: new Date(Date.now() - 3600000).toLocaleTimeString(),
      refundedAt: new Date().toLocaleTimeString()
    };
  }
}
