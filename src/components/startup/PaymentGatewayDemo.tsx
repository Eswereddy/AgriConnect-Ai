import React, { useState } from "react";
import {
  CreditCard,
  Wallet,
  Coins,
  DollarSign,
  CheckCircle,
  FileText,
  ShieldCheck,
  Building2,
  Sparkles,
  AlertCircle,
  Download,
  Loader2,
  Lock,
  ArrowRight,
  RefreshCw,
  Undo2
} from "lucide-react";
import {
  PaymentGatewayService,
  PaymentPayload,
  GSTCalculationResult,
  InvoiceResult,
  EscrowStatus
} from "../../services/PaymentGatewayService";

interface PaymentGatewayDemoProps {
  onAddTransactionToARR?: (feeAmount: number) => void;
}

export const PaymentGatewayDemo: React.FC<PaymentGatewayDemoProps> = ({ onAddTransactionToARR }) => {
  const [gateway, setGateway] = useState<"razorpay" | "stripe">("razorpay");
  const [payMethod, setPayMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [orderAmount, setOrderAmount] = useState<number>(18500); // Default ₹18,500
  
  // Payment credentials state
  const [upiId, setUpiId] = useState<string>("farmer.amir@okaxis");
  const [cardNumber, setCardNumber] = useState<string>("4111 2222 3333 4444");
  const [cardExpiry, setCardExpiry] = useState<string>("12/29");
  const [cardCvv, setCardCvv] = useState<string>("123");
  const [buyerName, setBuyerName] = useState<string>("Amir Patel");
  const [buyerPhone, setBuyerPhone] = useState<string>("+91 98765 43210");
  
  // Simulation states
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processStep, setProcessStep] = useState<string>("");
  const [processProgress, setProcessProgress] = useState<number>(0);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [invoiceRecord, setInvoiceRecord] = useState<InvoiceResult | null>(null);
  const [validationError, setValidationError] = useState<string>("");

  // Escrow state integration
  const [escrowRecord, setEscrowRecord] = useState<EscrowStatus | null>(null);
  const [isEscrowUpdating, setIsEscrowUpdating] = useState<boolean>(false);
  const [escrowLog, setEscrowLog] = useState<string>("");

  // Calculate dynamic values using PaymentGatewayService
  const calculations: GSTCalculationResult = PaymentGatewayService.calculateGSTAndFees(orderAmount);
  const {
    platformFee,
    gatewayFee,
    baseServiceFee,
    serviceGst,
    cgstAmount,
    sgstAmount,
    sellerPayout
  } = calculations;

  const triggerPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    setPaymentSuccess(false);
    setEscrowRecord(null);
    setEscrowLog("");

    if (payMethod === "upi" && !upiId.includes("@")) {
      setValidationError("Please enter a valid UPI ID (e.g., user@bank)");
      return;
    }
    if (payMethod === "card" && cardNumber.replace(/\s/g, "").length < 16) {
      setValidationError("Please enter a valid 16-digit Card Number");
      return;
    }

    setIsProcessing(true);
    setProcessProgress(10);
    setProcessStep("Establishing encrypted tunnel with payment networks...");

    // Stage 1: Handshake
    setTimeout(() => {
      setProcessProgress(35);
      setProcessStep(
        gateway === "razorpay" 
          ? "Redirecting to Razorpay UPI Core... Requesting push notification..." 
          : "Stripe Tokenizer authenticating secure PCI-DSS card credentials..."
      );
    }, 1000);

    // Stage 2: Verification
    setTimeout(() => {
      setProcessProgress(65);
      setProcessStep("Validating multi-factor token credentials & funds reservation...");
    }, 2000);

    // Stage 3: Split and Settlement
    setTimeout(() => {
      setProcessProgress(90);
      setProcessStep("Executing escrow split: 98% Escrow Holding, 1% Commission, 1% Gateway Fee...");
    }, 3000);

    try {
      const payload: PaymentPayload = {
        amount: orderAmount,
        gateway,
        paymentMethod: payMethod,
        buyerName,
        buyerPhone,
        upiId: payMethod === "upi" ? upiId : undefined,
        cardNumber: payMethod === "card" ? cardNumber : undefined,
        cardExpiry: payMethod === "card" ? cardExpiry : undefined,
        cardCvv: payMethod === "card" ? cardCvv : undefined
      };

      // Call the PaymentGatewayService method
      const result = await PaymentGatewayService.processPayment(payload);

      setIsProcessing(false);
      setPaymentSuccess(true);
      setInvoiceRecord(result.invoice);
      setEscrowRecord(result.escrow);
      setEscrowLog("Secured funds locked in escrow. Awaiting delivery approval.");
      setProcessProgress(100);

      if (onAddTransactionToARR) {
        onAddTransactionToARR(platformFee);
      }
    } catch (err: any) {
      setIsProcessing(false);
      setValidationError(err.message || "An unexpected error occurred during payment processing.");
    }
  };

  const handleReleaseEscrow = async () => {
    if (!escrowRecord) return;
    setIsEscrowUpdating(true);
    setEscrowLog("Broadcasting transaction to release locked funds to Seller...");
    try {
      const updated = await PaymentGatewayService.releaseEscrow(escrowRecord.transactionId, escrowRecord.amount);
      setEscrowRecord(updated);
      setEscrowLog("Escrow released! ₹" + updated.amount.toLocaleString() + " successfully dispatched to the Supplier's account.");
    } catch (err: any) {
      setEscrowLog("Error releasing escrow: " + err.message);
    } finally {
      setIsEscrowUpdating(false);
    }
  };

  const handleRefundEscrow = async () => {
    if (!escrowRecord) return;
    setIsEscrowUpdating(true);
    setEscrowLog("Initiating full rollback. Refunding buyer account...");
    try {
      const updated = await PaymentGatewayService.refundEscrow(escrowRecord.transactionId, escrowRecord.amount);
      setEscrowRecord(updated);
      setEscrowLog("Escrow refunded! ₹" + updated.amount.toLocaleString() + " returned to " + buyerName + ".");
    } catch (err: any) {
      setEscrowLog("Error refunding escrow: " + err.message);
    } finally {
      setIsEscrowUpdating(false);
    }
  };

  return (
    <div id="payment-gateway-sandbox" className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
        <div>
          <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="h-4.5 w-4.5 text-emerald-400" /> Secure Multi-Gateway Escrow System
          </h4>
          <p className="text-[11px] text-slate-400 font-medium">
            Dual Razorpay & Stripe pipeline routing agricultural trade payouts with 1% platform escrow commissions.
          </p>

        </div>
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => { setGateway("razorpay"); setPayMethod("upi"); }}
            className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
              gateway === "razorpay" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Razorpay (India)
          </button>
          <button
            onClick={() => { setGateway("stripe"); setPayMethod("card"); }}
            className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
              gateway === "stripe" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Stripe (Global)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Checkout Inputs */}
        <div className="lg:col-span-7 space-y-4">
          <form onSubmit={triggerPayment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-black text-slate-400 mb-1.5">Trade Buyout Amount (INR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-black text-xs">₹</span>
                  <input
                    type="number"
                    min="100"
                    max="1000000"
                    value={orderAmount}
                    onChange={(e) => setOrderAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-7 pr-3 py-2 text-xs font-black text-white focus:outline-none focus:border-emerald-500 font-mono"
                    disabled={isProcessing}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black text-slate-400 mb-1.5 font-sans">Payment Method</label>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl">
                  {gateway === "razorpay" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setPayMethod("upi")}
                        className={`py-1 rounded-lg text-[9px] font-black uppercase cursor-pointer ${
                          payMethod === "upi" ? "bg-slate-800 text-emerald-400" : "text-slate-400"
                        }`}
                      >
                        UPI
                      </button>
                      <button
                        type="button"
                        onClick={() => setPayMethod("card")}
                        className={`py-1 rounded-lg text-[9px] font-black uppercase cursor-pointer ${
                          payMethod === "card" ? "bg-slate-800 text-emerald-400" : "text-slate-400"
                        }`}
                      >
                        Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPayMethod("netbanking")}
                        className={`py-1 rounded-lg text-[9px] font-black uppercase cursor-pointer ${
                          payMethod === "netbanking" ? "bg-slate-800 text-emerald-400" : "text-slate-400"
                        }`}
                      >
                        Bank
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setPayMethod("card")}
                        className={`py-1 col-span-3 rounded-lg text-[9px] font-black uppercase cursor-pointer ${
                          payMethod === "card" ? "bg-slate-800 text-emerald-400" : "text-slate-400"
                        }`}
                      >
                        Secure Card Tokenizer
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-xl space-y-3.5">
              <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block border-b border-slate-800 pb-1.5">
                Billing Details
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    required
                    disabled={isProcessing}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    required
                    disabled={isProcessing}
                  />
                </div>
              </div>

              {payMethod === "upi" && (
                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase mb-1">Virtual Payment Address (UPI ID)</label>
                  <div className="relative">
                    <Wallet className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. user@okaxis"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1.5 text-xs font-mono text-emerald-300"
                      required
                      disabled={isProcessing}
                    />
                  </div>
                </div>
              )}

              {payMethod === "card" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[9px] font-black text-slate-500 uppercase mb-1">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1.5 text-xs font-mono text-white"
                        required
                        disabled={isProcessing}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-black text-slate-500 uppercase mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white text-center"
                        required
                        disabled={isProcessing}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-slate-500 uppercase mb-1">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white text-center"
                        required
                        disabled={isProcessing}
                      />
                    </div>
                  </div>
                </div>
              )}

              {payMethod === "netbanking" && (
                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase mb-1">Select Bank Partner</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white">
                    <option>State Bank of India (SBI)</option>
                    <option>HDFC Bank Ltd</option>
                    <option>ICICI Bank Ltd</option>
                    <option>Punjab National Bank (PNB)</option>
                    <option>NABARD Rural Credit</option>
                  </select>
                </div>
              )}
            </div>

            {validationError && (
              <div className="p-3 bg-rose-950/40 border border-rose-500/20 rounded-xl text-xs text-rose-300 font-bold flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {validationError}
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-3 rounded-xl font-black uppercase text-xs tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md ${
                isProcessing
                  ? "bg-slate-800 text-slate-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                  Authorizing Secured Settlement...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 text-emerald-300" />
                  Process Escrow Settlement (₹{orderAmount.toLocaleString()})
                </>
              )}
            </button>
          </form>

          {/* Secure Handshake Process Loader */}
          {isProcessing && (
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2.5 animate-in fade-in duration-200">
              <div className="flex justify-between text-[10px] font-extrabold text-slate-400">
                <span>GATEWAY HANDSHAKE</span>
                <span className="font-mono text-emerald-400">{processProgress}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${processProgress}%` }}
                />
              </div>
              <p className="text-[11px] text-emerald-300 font-bold animate-pulse">
                {processStep}
              </p>
            </div>
          )}
        </div>

        {/* Right Side: Ledger Split & Dynamic GST Invoice */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
              Automated Escrow Commission Split
            </span>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Buyer Order Value:</span>
                <span className="font-mono text-white font-bold">₹{orderAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-2">
                <span className="text-slate-400">AgriConnect Protection Escrow:</span>
                <span className="font-mono text-slate-300">98.0%</span>
              </div>
              
              <div className="flex justify-between items-center text-xs">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Coins className="h-3.5 w-3.5 text-emerald-400" />
                  Startup Comm. Fee (1%):
                </span>
                <span className="font-mono text-emerald-300 font-bold">₹{platformFee}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-indigo-400 font-bold flex items-center gap-1">
                  <CreditCard className="h-3.5 w-3.5 text-indigo-400" />
                  Gateway Processing (1%):
                </span>
                <span className="font-mono text-indigo-300">₹{gatewayFee}</span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 flex justify-between items-center text-xs mt-2.5">
                <span className="text-slate-400">Total Revenue Retained:</span>
                <span className="font-mono text-emerald-400 font-black">₹{(platformFee + gatewayFee).toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 pt-1.5">
                <span>Net Supplier/Seller Payout:</span>
                <span className="font-mono text-white">₹{sellerPayout.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Escrow Status & Buyer Protection Controls */}
          {paymentSuccess && escrowRecord && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  🛡️ Buyer Protection Escrow
                </span>
                <span className={`text-[9.5px] px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                  escrowRecord.status === "held"
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                    : escrowRecord.status === "released"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                }`}>
                  Status: {escrowRecord.status}
                </span>
              </div>

              <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                Platform guarantees delivery: Funds are held safely in AgriConnect's verified escrow pipeline and are only released once the Buyer approves quality.
              </p>

              {escrowLog && (
                <div className="bg-slate-950 border border-slate-850 p-2 rounded text-[10px] font-mono text-emerald-300 flex items-center gap-2 leading-tight">
                  <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping shrink-0" />
                  {escrowLog}
                </div>
              )}

              {escrowRecord.status === "held" && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={handleReleaseEscrow}
                    disabled={isEscrowUpdating}
                    className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] tracking-wider rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    {isEscrowUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                    Confirm & Release
                  </button>
                  <button
                    onClick={handleRefundEscrow}
                    disabled={isEscrowUpdating}
                    className="py-2 bg-rose-950 text-rose-400 hover:bg-rose-900 border border-rose-500/20 font-black uppercase text-[10px] tracking-wider rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    {isEscrowUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Undo2 className="h-3 w-3" />}
                    Raise Refund
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Dynamic GST Invoice */}
          {paymentSuccess && invoiceRecord ? (
            <div id="invoice-doc-preview" className="bg-white text-slate-900 border border-slate-200 rounded-xl p-4 space-y-4 animate-in zoom-in-95 duration-300 shadow-xl relative overflow-hidden">
              {/* Paid Stamp watermark */}
              <div className="absolute right-4 top-14 border-4 border-emerald-500 text-emerald-600 uppercase font-black text-xs px-3 py-1 rounded-lg rotate-12 select-none">
                {escrowRecord?.status === "refunded" ? "REFUNDED" : "PAID VIA ESCROW"}
              </div>

              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <h5 className="text-[11px] font-black tracking-tight text-slate-800">TAX INVOICE</h5>
                  <p className="text-[9px] text-slate-400 font-bold">{invoiceRecord.invoiceId}</p>
                </div>
                <div className="text-right">
                  <span className="bg-emerald-100 text-emerald-800 font-black text-[9px] px-2 py-0.5 rounded uppercase">
                    GST-COMPLIANT
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[9px] text-slate-500 leading-snug">
                <div>
                  <p className="font-bold text-slate-700 uppercase">Provider:</p>
                  <p className="font-extrabold text-slate-800">{invoiceRecord.provider.name}</p>
                  <p>{invoiceRecord.provider.address}</p>
                  <p className="font-mono font-bold">GSTIN: {invoiceRecord.provider.gstin}</p>
                </div>
                <div>
                  <p className="font-bold text-slate-700 uppercase">Billed To:</p>
                  <p className="font-extrabold text-slate-800">{invoiceRecord.buyer.name}</p>
                  <p>Punjab Block 4 Agriculture Hub</p>
                  <p className="font-mono">{invoiceRecord.buyer.phone}</p>
                </div>
              </div>

              {/* Invoice Table */}
              <div className="border-t border-b border-slate-200 py-2.5 text-[9.5px]">
                <div className="grid grid-cols-12 font-black text-slate-600 border-b border-slate-100 pb-1 mr-1.5">
                  <span className="col-span-6">Description</span>
                  <span className="col-span-2 text-right">Base</span>
                  <span className="col-span-2 text-right">GST</span>
                  <span className="col-span-2 text-right">Total</span>
                </div>

                <div className="grid grid-cols-12 py-1.5 text-slate-700">
                  <span className="col-span-6 font-semibold">AgriConnect Marketplace Facilitation Fee</span>
                  <span className="col-span-2 text-right font-mono">₹{baseServiceFee}</span>
                  <span className="col-span-2 text-right font-mono">18%</span>
                  <span className="col-span-2 text-right font-mono">₹{(platformFee + gatewayFee).toFixed(2)}</span>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-1 text-right text-[10px] font-semibold text-slate-500">
                <div className="flex justify-between items-center text-[9px]">
                  <span>CGST (9.0%):</span>
                  <span className="font-mono text-slate-800">₹{cgstAmount}</span>
                </div>
                <div className="flex justify-between items-center text-[9px]">
                  <span>SGST (9.0%):</span>
                  <span className="font-mono text-slate-800">₹{sgstAmount}</span>
                </div>
                <div className="flex justify-between items-center text-slate-800 font-extrabold pt-1.5 border-t border-slate-100">
                  <span>Total Tax Included:</span>
                  <span className="font-mono">₹{serviceGst}</span>
                </div>
                <div className="flex justify-between items-center text-slate-900 font-black text-[12px] pt-1">
                  <span>Gross Transaction Amount:</span>
                  <span className="font-mono text-emerald-700">₹{orderAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 text-[9px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                  PCI-DSS SECURE BLOCKCHAIN RECEIPT
                </span>
                <button
                  type="button"
                  onClick={() => alert("GST Invoice downloaded successfully (Simulated PDF download)")}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Download className="h-3 w-3" /> PDF
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-slate-800 rounded-xl p-8 text-center text-slate-500 flex flex-col items-center justify-center space-y-2 h-[260px]">
              <FileText className="h-10 w-10 text-slate-600 animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">GST Invoice Pending Authorization</p>
              <p className="text-[10px] max-w-[200px] leading-relaxed">
                A valid PCI-DSS split invoice will render dynamically here once payment execution successfully completes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentGatewayDemo;
