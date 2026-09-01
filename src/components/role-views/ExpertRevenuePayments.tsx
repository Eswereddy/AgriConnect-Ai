import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  DollarSign,
  TrendingUp,
  Clock,
  ArrowRight,
  Download,
  Calendar,
  Sliders,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  Percent,
  Lock,
  ChevronRight,
  Wallet,
  Settings,
  X,
  CreditCard
} from "lucide-react";

interface ExpertRevenuePaymentsProps {
  expertProfile: any;
  earnedBonus: number;
}

export default function ExpertRevenuePayments({ expertProfile, earnedBonus }: ExpertRevenuePaymentsProps) {
  const [revenueTab, setRevenueTab] = useState<"dashboard" | "fees" | "withdraw" | "tax">("dashboard");

  // Cumulative earnings calculations
  const textEarnings = 8200;
  const videoEarnings = 14200 + earnedBonus;
  const webinarEarnings = 12500;
  const researchEarnings = 9500;
  const totalEarnings = textEarnings + videoEarnings + webinarEarnings + researchEarnings;

  // Withdrawal States
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("Bank Transfer");
  const [isAutoWithdraw, setIsAutoWithdraw] = useState(true);
  const [autoWithdrawThreshold, setAutoWithdrawThreshold] = useState("5000");

  const [payoutsList, setPayoutsList] = useState([
    { id: "PAY-98102", date: "2026-07-01", amount: "12,450", status: "Disbursed", method: "State Bank of India (****5901)" },
    { id: "PAY-97304", date: "2026-06-01", amount: "15,800", status: "Disbursed", method: "UPI (vikram@ybl)" },
    { id: "PAY-96101", date: "2026-05-01", amount: "9,200", status: "Disbursed", method: "State Bank of India (****5901)" }
  ]);

  // Fee management states
  const [textFee, setTextFee] = useState("199");
  const [videoFee15, setVideoFee15] = useState("299");
  const [videoFee30, setVideoFee30] = useState("499");
  const [videoFee60, setVideoFee60] = useState("899");
  const [emergencyFee, setEmergencyFee] = useState("150");

  const handleSaveFees = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Sovereign consultation pricing updated and published directly onto the Farmer Portal.");
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(withdrawAmount);
    if (!withdrawAmount || isNaN(amountVal) || amountVal <= 0) {
      alert("Please enter a valid monetary amount.");
      return;
    }
    if (amountVal > videoEarnings) {
      alert("Insufficient balance in your pending wallet account.");
      return;
    }

    const newPayout = {
      id: `PAY-${Math.floor(10000 + Math.random() * 90000)}`,
      date: "2026-07-18",
      amount: amountVal.toLocaleString("en-IN"),
      status: "In Progress",
      method: withdrawMethod === "Bank Transfer" ? "Bank Transfer (****5901)" : "UPI (vikram@ybl)"
    };

    setPayoutsList([newPayout, ...payoutsList]);
    alert(`Withdrawal request for ₹${amountVal.toLocaleString("en-IN")} submitted successfully. Transfer processing takes 12-24 banking hours.`);
    setWithdrawAmount("");
  };

  return (
    <div className="space-y-6 text-left">
      {/* Sub tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setRevenueTab("dashboard")}
          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            revenueTab === "dashboard"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <DollarSign className="h-4 w-4" />
          Earnings Ledger
        </button>
        <button
          onClick={() => setRevenueTab("fees")}
          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            revenueTab === "fees"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Settings className="h-4 w-4" />
          Fee & Subscriptions
        </button>
        <button
          onClick={() => setRevenueTab("withdraw")}
          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            revenueTab === "withdraw"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Wallet className="h-4 w-4" />
          Request Payout
        </button>
        <button
          onClick={() => setRevenueTab("tax")}
          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            revenueTab === "tax"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Percent className="h-4 w-4" />
          Tax & GST Compliance
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* 6.1 EARNINGS LEDGER */}
        {revenueTab === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Quick stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-3xs text-left">
                <span className="text-[8px] font-black text-slate-400 uppercase block tracking-wider">This Month's Profit</span>
                <p className="text-2xl font-black text-slate-800 mt-1">₹{totalEarnings.toLocaleString("en-IN")}</p>
                <p className="text-[9px] text-emerald-600 font-bold mt-2">Payout pending: ₹{videoEarnings.toLocaleString("en-IN")}</p>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-3xs text-left">
                <span className="text-[8px] font-black text-slate-400 uppercase block tracking-wider">Quarterly Revenue</span>
                <p className="text-2xl font-black text-slate-800 mt-1">₹1,18,400</p>
                <p className="text-[9px] text-slate-400 font-bold mt-2">Q2 fiscal projection met</p>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-3xs text-left">
                <span className="text-[8px] font-black text-slate-400 uppercase block tracking-wider">Annual Earnings</span>
                <p className="text-2xl font-black text-slate-800 mt-1">₹4,82,900</p>
                <p className="text-[9px] text-emerald-600 font-bold mt-2">Tax deductible: ₹48,290 TDS (10%)</p>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-3xs text-left">
                <span className="text-[8px] font-black text-slate-400 uppercase block tracking-wider">Lifetime Cumulative</span>
                <p className="text-2xl font-black text-slate-800 mt-1">₹14,58,000</p>
                <p className="text-[9px] text-emerald-600 font-bold mt-2">Gold Tier badge verified</p>
              </div>
            </div>

            {/* Split layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Revenue Breakdown */}
              <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Services Revenue Segmentation
                </h3>
                <div className="space-y-3.5 text-xs font-bold pt-1">
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-150">
                    <div>
                      <p className="text-slate-800">Text-Based Consultations</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">₹{textFee} fee per closed ticket</p>
                    </div>
                    <span className="text-slate-700 font-mono font-black">₹{textEarnings.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-150">
                    <div>
                      <p className="text-slate-800">WebRTC Video Consultations</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">₹{videoFee30} per standard hourly block</p>
                    </div>
                    <span className="text-slate-700 font-mono font-black">₹{videoEarnings.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-150">
                    <div>
                      <p className="text-slate-800">Group Webinars & Workshops</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">Paid audience attendance tickets</p>
                    </div>
                    <span className="text-slate-700 font-mono font-black">₹{webinarEarnings.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-150">
                    <div>
                      <p className="text-slate-800">Scientific Research Publication</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">In-hub paper licensing by research units</p>
                    </div>
                    <span className="text-slate-700 font-mono font-black">₹{researchEarnings.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Payout Schedule */}
              <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Upcoming Disbursements & Logs
                  </h3>
                  <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded font-black">
                    CYCLE: BI-WEEKLY
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[8px] text-slate-400 font-black uppercase block">Next Auto Payout Date:</span>
                    <span className="text-slate-800 font-extrabold flex items-center gap-1.5 mt-0.5">
                      <Calendar className="h-4 w-4 text-emerald-600" />
                      August 01, 2026
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] text-slate-400 font-black uppercase block">Pending Balance:</span>
                    <span className="text-lg font-black text-slate-800 font-mono">₹{videoEarnings.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Past Disbursed Transactions:</span>
                  {payoutsList.map((p) => (
                    <div key={p.id} className="p-3 bg-white border border-slate-150 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <p className="font-extrabold text-slate-700">₹{p.amount}</p>
                        <p className="text-[9px] text-slate-400 font-bold">Transfer method: {p.method}</p>
                      </div>
                      <div className="text-right text-[10px]">
                        <p className="text-slate-400 font-bold">{p.date}</p>
                        <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-black uppercase">
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 6.2 PRICE CONFIGS */}
        {revenueTab === "fees" && (
          <motion.div
            key="fees"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            <form onSubmit={handleSaveFees} className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Consultation Pricing Panel</h3>
              <p className="text-[10px] text-slate-400 font-bold">Configure fees directly presented to smallholder farmers and Cooperatives booking your calendar slots.</p>

              <div className="space-y-3.5 text-xs font-bold">
                <div>
                  <label className="text-slate-400 text-[9px] block uppercase">Standard Text Query (₹ per question):</label>
                  <input
                    type="number"
                    value={textFee}
                    onChange={(e) => setTextFee(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg mt-1 text-slate-700 font-extrabold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-[9px] block uppercase">Video Consultation (₹ per 30 minutes):</label>
                  <input
                    type="number"
                    value={videoFee30}
                    onChange={(e) => setVideoFee30(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg mt-1 text-slate-700 font-extrabold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-[9px] block uppercase">Emergency Immediate Consultation Premium (₹ Surcharge):</label>
                  <input
                    type="number"
                    value={emergencyFee}
                    onChange={(e) => setEmergencyFee(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg mt-1 text-slate-700 font-extrabold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-black uppercase tracking-wider cursor-pointer"
              >
                Publish updated Fees
              </button>
            </form>

            {/* subscription package templates */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4 text-left">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Farmer Subscription Packages Templates
              </h3>
              <p className="text-[10px] text-slate-400 font-bold">Sovereign cooperative tier templates configured by the clinical administration team.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1 text-xs">
                {/* Free Tier */}
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 flex flex-col justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-[11px]">Free Tier</h4>
                    <p className="text-[10px] font-black text-slate-400 font-mono mt-1">₹0 / month</p>
                    <ul className="text-[9px] text-slate-500 space-y-1 font-semibold mt-3">
                      <li>• 1 Text Question / mo</li>
                      <li>• Standard 48h Response</li>
                      <li>• Public Articles</li>
                    </ul>
                  </div>
                </div>

                {/* Premium Tier */}
                <div className="border border-emerald-300 rounded-xl p-3 bg-emerald-50/20 flex flex-col justify-between relative">
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[7px] font-black uppercase tracking-wide px-1.5 py-0.2 rounded">
                    RECOMMENDED
                  </span>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-[11px] mt-1">Premium Tier</h4>
                    <p className="text-[10px] font-black text-slate-400 font-mono mt-1">₹299 / month</p>
                    <ul className="text-[9px] text-slate-500 space-y-1 font-semibold mt-3">
                      <li>• Unlimited Text Queries</li>
                      <li>• 1 Video Consultation / mo</li>
                      <li>• Priority 2h Response</li>
                      <li>• PDF Handout Library</li>
                    </ul>
                  </div>
                </div>

                {/* Pro Tier */}
                <div className="border border-indigo-300 rounded-xl p-3 bg-indigo-50/20 flex flex-col justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-[11px]">Pro Tier</h4>
                    <p className="text-[10px] font-black text-slate-400 font-mono mt-1">₹699 / month</p>
                    <ul className="text-[9px] text-slate-500 space-y-1 font-semibold mt-3">
                      <li>• Unlimited Text Queries</li>
                      <li>• 3 Video Consultations / mo</li>
                      <li>• Direct SMS Alerts</li>
                      <li>• Soil Analysis Audit</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 6.3 WITHDRAWAL REQUESTS */}
        {revenueTab === "withdraw" && (
          <motion.div
            key="withdraw"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Withdrawal form */}
            <form onSubmit={handleWithdrawSubmit} className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <CreditCard className="h-4.5 w-4.5 text-emerald-600" />
                Sovereign Withdrawal Request Terminal
              </h3>

              <div className="space-y-3.5 text-xs font-bold pt-1">
                <div>
                  <span className="text-[8px] text-slate-400 font-black uppercase block">Available Balance:</span>
                  <span className="text-xl font-black text-slate-800 font-mono">₹{videoEarnings.toLocaleString("en-IN")}</span>
                </div>

                <div>
                  <label className="text-slate-400 text-[9px] block uppercase">Enter Payout Amount (₹):</label>
                  <input
                    type="number"
                    placeholder="e.g., 5000"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-extrabold mt-1"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-[9px] block uppercase">Select Destination Settlement Method:</label>
                  <select
                    value={withdrawMethod}
                    onChange={(e) => setWithdrawMethod(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg mt-1 text-xs font-extrabold"
                  >
                    <option value="Bank Transfer">State Bank of India (Settlement Acc ****5901)</option>
                    <option value="UPI">UPI Direct Virtual address (vikram@ybl)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
              >
                Execute Payout Settlement
              </button>
            </form>

            {/* Auto withdraw sweep configuration */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4 text-left flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Sliders className="h-4.5 w-4.5 text-emerald-600" />
                  Auto-Withdraw Sweep Settings
                </h3>
                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                  Toggle immediate weekly payouts. When enabled, your clinical account will auto-sweep all funds exceeding the threshold value on the 1st of every calendar month.
                </p>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-150">
                  <div>
                    <span className="text-xs font-extrabold text-slate-700 block">Enable Auto-Sweep</span>
                    <span className="text-[9px] text-slate-400 font-bold">Bi-weekly settlement automated schedule</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isAutoWithdraw}
                    onChange={(e) => setIsAutoWithdraw(e.target.checked)}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded cursor-pointer"
                  />
                </div>

                {isAutoWithdraw && (
                  <div>
                    <label className="text-slate-400 text-[9px] block uppercase">Auto-Sweep Minimum Balance Threshold (₹):</label>
                    <input
                      type="number"
                      value={autoWithdrawThreshold}
                      onChange={(e) => setAutoWithdrawThreshold(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg mt-1 text-xs font-extrabold text-slate-700"
                    />
                  </div>
                )}
              </div>

              <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 flex items-center gap-2.5 text-[10px] text-indigo-800 font-bold">
                <CheckCircle className="h-4.5 w-4.5 text-indigo-600 shrink-0" />
                Your settlement details conform with ICAR and payment gateway compliance certifications.
              </div>
            </div>
          </motion.div>
        )}

        {/* 6.4 TAX LEDGER */}
        {revenueTab === "tax" && (
          <motion.div
            key="tax"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* GST Auto Calculations */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4 text-left flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  GST Ledger & Quarterly Filing
                </h3>
                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                  The clinical portal automatically calculates and details the mandatory 18% Integrated Goods and Services Tax (IGST) applicable on commercial consultations.
                </p>

                <div className="space-y-2 pt-1 text-xs font-bold text-slate-600">
                  <div className="flex justify-between">
                    <span>Taxable Base Earnings (Q2):</span>
                    <span className="font-mono text-slate-800">₹{totalEarnings.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Calculated GST Liability (18%):</span>
                    <span className="font-mono text-emerald-700">₹{(totalEarnings * 0.18).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-150 pt-2 text-slate-800">
                    <span>Total Net Settlements disbursed:</span>
                    <span className="font-mono">₹{(totalEarnings * 0.82).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => alert("Quarterly GST report generated successfully. Download queued...")}
                className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 mt-4"
              >
                <Download className="h-3.5 w-3.5 text-emerald-400" />
                Generate GST Return spreadsheet
              </button>
            </div>

            {/* TDS Deduction */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4 text-left flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  TDS Deduction & Form 16A Archive
                </h3>
                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                  As per Section 194J of Income Tax Act, 10% Tax Deducted at Source (TDS) is held on professional agronomist service fees and deposited with the Income Tax Department.
                </p>

                <div className="space-y-2.5 pt-1 text-xs font-bold">
                  <div className="flex justify-between text-slate-600">
                    <span>TDS Deposited This Fiscal Year:</span>
                    <span className="font-mono text-rose-700">₹{(totalEarnings * 0.10).toFixed(2)}</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-[10px] text-slate-500">
                    TDS filings are updated on the 10th of every month. Download Form 16A to verify tax credits on your PAN profile.
                  </div>
                </div>
              </div>

              <button
                onClick={() => alert("Form 16A verified with TRACES. PDF certificate download initiated.")}
                className="w-full py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 mt-4"
              >
                <Download className="h-3.5 w-3.5 text-rose-500" />
                Download Form 16A PDF Certificate
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
