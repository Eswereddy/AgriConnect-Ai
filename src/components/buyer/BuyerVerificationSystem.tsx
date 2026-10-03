import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Smartphone,
  Mail,
  Building,
  Check,
  AlertCircle,
  RefreshCw,
  Search,
  Activity,
  Sparkles,
  ArrowRight,
  Shield,
  Award,
  Info,
  CreditCard,
  CheckCircle,
  Clock,
  Briefcase,
  ExternalLink,
  ChevronRight,
  UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BuyerVerificationSystemProps {
  onVerificationUpdate?: () => void;
}

export default function BuyerVerificationSystem({ onVerificationUpdate }: BuyerVerificationSystemProps) {
  // Get buyer data from localStorage
  const [buyerData, setBuyerData] = useState<any>(() => {
    const raw = localStorage.getItem("agriconnect_buyer_data");
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  // State of verifications (Load or initialize)
  const [verificationState, setVerificationState] = useState(() => {
    if (buyerData.verificationProgress) {
      return buyerData.verificationProgress;
    }
    // Default initial states based on wizard completeness
    const initialGst = buyerData.personalDetails?.gstNumber || "03AAAAA1111A1Z1";
    return {
      emailVerified: true,
      mobileVerified: true, // Complete as part of onboarding wizard
      gstVerified: false,
      gstNumber: initialGst,
      gstDetails: null as any,
      bankVerified: false,
      bankDetails: null as any,
      creditVerified: false,
      creditDetails: null as any,
    };
  });

  // active sub-tab for verification tasks: "basic" | "business" | "advanced"
  const [activeSubTab, setActiveSubTab] = useState<"basic" | "business" | "advanced">("business");

  // Basic Verification Form States
  const [emailInput, setEmailInput] = useState(buyerData.personalDetails?.email || "satnam@foodcorp.com");
  const [mobileInput, setMobileInput] = useState(buyerData.personalDetails?.mobile || "9876543210");
  const [basicLoading, setBasicLoading] = useState(false);
  const [basicSuccessMsg, setBasicSuccessMsg] = useState<string | null>(null);

  // Business Verification States
  const [gstInput, setGstInput] = useState(verificationState.gstNumber || "");
  const [isGstVerifying, setIsGstVerifying] = useState(false);
  const [gstVerifyStep, setGstVerifyStep] = useState(0); // 0: idle, 1: connecting, 2: decoding, 3: completed
  const [gstSuccessMsg, setGstSuccessMsg] = useState<string | null>(null);
  const [gstErrorMsg, setGstErrorMsg] = useState<string | null>(null);

  // Bank Verification States
  const [bankName, setBankName] = useState("State Bank of India");
  const [accountNum, setAccountNum] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [isBankVerifying, setIsBankVerifying] = useState(false);
  const [bankVerifyStep, setBankVerifyStep] = useState(0); // 0: idle, 1: penny drop, 2: fetch name, 3: verified
  const [bankErrorMsg, setBankErrorMsg] = useState<string | null>(null);

  // Credit Score States
  const [panInput, setPanInput] = useState("");
  const [isCreditVerifying, setIsCreditVerifying] = useState(false);
  const [creditVerifyStep, setCreditVerifyStep] = useState(0);
  const [creditErrorMsg, setCreditErrorMsg] = useState<string | null>(null);

  // Update localStorage when state changes
  useEffect(() => {
    const updatedData = {
      ...buyerData,
      verificationProgress: verificationState,
      // If basic is verified and business is verified, marked as generally highly verified
      isVerified: verificationState.emailVerified && verificationState.mobileVerified,
      isGstVerified: verificationState.gstVerified
    };
    localStorage.setItem("agriconnect_buyer_data", JSON.stringify(updatedData));
    if (onVerificationUpdate) {
      onVerificationUpdate();
    }
  }, [verificationState]);

  // Calculate dynamic trust score
  const calculateTrustScore = () => {
    let score = 350; // Base score for filling onboarding
    if (verificationState.emailVerified) score += 100;
    if (verificationState.mobileVerified) score += 100;
    if (verificationState.gstVerified) score += 250;
    if (verificationState.bankVerified) score += 100;
    if (verificationState.creditVerified) score += 100;

    // Bonus for full validation completeness
    if (
      verificationState.emailVerified &&
      verificationState.mobileVerified &&
      verificationState.gstVerified &&
      verificationState.bankVerified &&
      verificationState.creditVerified
    ) {
      score = 1000;
    }
    return score;
  };

  const trustScore = calculateTrustScore();

  // Get current Trust Badge details
  const getTrustBadge = () => {
    if (trustScore === 1000) {
      return {
        name: "Elite Diamond Partner",
        color: "from-blue-600 via-indigo-600 to-teal-500",
        bg: "bg-indigo-50 border-indigo-200 text-indigo-700",
        description: "Ultimate transaction safety clearance. Allowed multi-million bidding pools with zero escrow delays.",
        textColor: "text-indigo-600"
      };
    } else if (trustScore >= 700) {
      return {
        name: "Corporate Gold Buyer",
        color: "from-amber-500 to-yellow-600",
        bg: "bg-amber-50 border-amber-200 text-amber-700",
        description: "Official legal entity validated. Access up to $500,000 active contract volumes.",
        textColor: "text-amber-600"
      };
    } else if (trustScore >= 500) {
      return {
        name: "Silver Procurement Member",
        color: "from-slate-400 to-slate-500",
        bg: "bg-slate-50 border-slate-200 text-slate-700",
        description: "Primary contact and mobile verified. Standard trading capacity unlocked.",
        textColor: "text-slate-600"
      };
    } else {
      return {
        name: "Bronze Trader",
        color: "from-amber-700 to-amber-900",
        bg: "bg-orange-50 border-orange-100 text-orange-700",
        description: "Basic placeholder login. Complete registry validations to avoid bidding caps.",
        textColor: "text-orange-600"
      };
    }
  };

  const trustBadge = getTrustBadge();

  // 1. Simulate Basic OTP Verification
  const handleVerifyBasic = (type: "email" | "mobile") => {
    setBasicLoading(true);
    setBasicSuccessMsg(null);
    setTimeout(() => {
      setBasicLoading(false);
      setVerificationState(prev => ({
        ...prev,
        [type === "email" ? "emailVerified" : "mobileVerified"]: true
      }));
      setBasicSuccessMsg(`Simulated multi-factor validation complete! ${type === "email" ? "Email address" : "Mobile handset"} marks as SECURED.`);
    }, 1200);
  };

  // 2. Simulate GST Registry API Call
  const handleVerifyGst = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gstInput || gstInput.length < 15) {
      setGstErrorMsg("Please enter a valid 15-digit GSTIN ID.");
      return;
    }

    setGstErrorMsg(null);
    setGstSuccessMsg(null);
    setIsGstVerifying(true);
    setGstVerifyStep(1);

    // Step-by-step government gateway handshake simulation
    setTimeout(() => {
      setGstVerifyStep(2);
      setTimeout(() => {
        setGstVerifyStep(3);
        setTimeout(() => {
          setIsGstVerifying(false);
          setGstVerifyStep(0);
          
          const mockGstDetails = {
            gstin: gstInput,
            tradeName: buyerData.personalDetails?.companyName || "Satnam Sovereign Grains Ltd",
            legalName: "Satnam Sovereign Grains Private Limited",
            registrationDate: "14/08/2019",
            constitution: "Private Limited Company",
            addr: "Plot No 44, Focal Point Industrial Area, Nellore, Andhra Pradesh, 144001",
            status: "Active",
            taxpayerType: "Regular",
            filingFrequency: "GSTR-1 Monthly, GSTR-3B Monthly",
            complianceScore: "98/100 (Highly Compliant)"
          };

          setVerificationState(prev => ({
            ...prev,
            gstVerified: true,
            gstNumber: gstInput,
            gstDetails: mockGstDetails
          }));
          setGstSuccessMsg("GST API Validation Succeeded! Company record fetched from National Registry.");
        }, 1200);
      }, 1200);
    }, 1000);
  };

  // 3. Simulate Bank Account Penny-Drop IMPS Verification
  const handleVerifyBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNum || accountNum.length < 8) {
      setBankErrorMsg("Please provide a valid Bank Account Number.");
      return;
    }
    if (!ifscCode || ifscCode.length < 11) {
      setBankErrorMsg("Please provide a valid 11-digit IFSC code (e.g. SBIN0001226).");
      return;
    }

    setBankErrorMsg(null);
    setIsBankVerifying(true);
    setBankVerifyStep(1);

    setTimeout(() => {
      setBankVerifyStep(2);
      setTimeout(() => {
        setBankVerifyStep(3);
        setTimeout(() => {
          setIsBankVerifying(false);
          setBankVerifyStep(0);

          const mockBankDetails = {
            bankName: bankName,
            accountNumber: `******${accountNum.slice(-4)}`,
            ifsc: ifscCode.toUpperCase(),
            beneficiaryName: buyerData.personalDetails?.companyName || "Satnam Sovereign Grains Ltd",
            pennyDropStatus: "SUCCESS",
            depositRef: `IMPS-DP-${Math.floor(100000 + Math.random() * 900000)}`,
            verificationTime: new Date().toLocaleString()
          };

          setVerificationState(prev => ({
            ...prev,
            bankVerified: true,
            bankDetails: mockBankDetails
          }));
        }, 1200);
      }, 1200);
    }, 1000);
  };

  // 4. Simulate Credit Score Experian Lookup
  const handleVerifyCredit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!panInput || panInput.length < 10) {
      setCreditErrorMsg("Please enter a valid 10-character corporate/personal PAN card number.");
      return;
    }

    setCreditErrorMsg(null);
    setIsCreditVerifying(true);
    setCreditVerifyStep(1);

    setTimeout(() => {
      setCreditVerifyStep(2);
      setTimeout(() => {
        setIsCreditVerifying(false);
        setCreditVerifyStep(0);

        const mockCreditDetails = {
          pan: panInput.toUpperCase(),
          bureauName: "Experian Commercial Bureau",
          creditScore: 785,
          scoreTier: "Excellent / Minimal Risk",
          activeCreditFacilities: 3,
          defaultsRecorded: 0,
          leverageRatio: "1.4x (Conservative)",
          riskGrade: "Low Risk Tier-1",
          checkedAt: new Date().toLocaleString()
        };

        setVerificationState(prev => ({
          ...prev,
          creditVerified: true,
          creditDetails: mockCreditDetails
        }));
      }, 1800);
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="buyer-verification-system">
      {/* LEFT PANEL: Trust Scorecard & Badge Display */}
      <div className="lg:col-span-4 space-y-6">
        {/* Dynamic Score Ring Card */}
        <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
            <span className="text-[10px] uppercase font-black text-teal-400 tracking-wider flex items-center gap-1">
              <Shield className="h-4 w-4" /> Compliance & Trust Core
            </span>
            <span className="text-[9px] bg-slate-800 text-teal-300 font-mono font-bold px-2 py-0.5 rounded border border-slate-700">
              ID: {buyerData.personalDetails?.gstNumber ? buyerData.personalDetails.gstNumber.slice(0, 5) : "BUYER"}-VER
            </span>
          </div>

          {/* Circle Gauge */}
          <div className="flex flex-col items-center py-4">
            <div className="relative flex items-center justify-center">
              {/* Outer circular indicator */}
              <svg className="w-36 h-36 transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="60"
                  className="stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="60"
                  className="stroke-teal-500 transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 60}
                  strokeDashoffset={2 * Math.PI * 60 * (1 - trustScore / 1000)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black font-mono tracking-tighter text-white">
                  {trustScore}
                </span>
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">
                  Trust Score
                </span>
              </div>
            </div>

            {/* Current Badge Level */}
            <div className="mt-5 text-center space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-teal-950/50 to-indigo-950/50 border border-teal-500/30 rounded-full">
                <Award className="h-4.5 w-4.5 text-teal-400" />
                <span className="text-xs font-black uppercase text-teal-300">
                  {trustBadge.name}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed max-w-[240px] mx-auto">
                {trustBadge.description}
              </p>
            </div>
          </div>

          {/* Verification Progress Checklist */}
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-2.5">
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">
              Validation Checklist
            </span>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded ${verificationState.emailVerified ? "bg-teal-950 text-teal-400 border border-teal-500/20" : "bg-slate-950 text-slate-600"}`}>
                  {verificationState.emailVerified ? <Check className="h-3 w-3" /> : <Mail className="h-3 w-3" />}
                </div>
                <span className={verificationState.emailVerified ? "text-slate-200" : "text-slate-500"}>Business Email</span>
              </div>
              <span className={`text-[10px] font-bold ${verificationState.emailVerified ? "text-teal-400" : "text-slate-500"}`}>
                {verificationState.emailVerified ? "VERIFIED" : "PENDING"}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded ${verificationState.mobileVerified ? "bg-teal-950 text-teal-400 border border-teal-500/20" : "bg-slate-950 text-slate-600"}`}>
                  {verificationState.mobileVerified ? <Check className="h-3 w-3" /> : <Smartphone className="h-3 w-3" />}
                </div>
                <span className={verificationState.mobileVerified ? "text-slate-200" : "text-slate-500"}>Handset OTP Gateway</span>
              </div>
              <span className={`text-[10px] font-bold ${verificationState.mobileVerified ? "text-teal-400" : "text-slate-500"}`}>
                {verificationState.mobileVerified ? "VERIFIED" : "PENDING"}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded ${verificationState.gstVerified ? "bg-teal-950 text-teal-400 border border-teal-500/20" : "bg-slate-950 text-slate-600"}`}>
                  {verificationState.gstVerified ? <Check className="h-3 w-3" /> : <Building className="h-3 w-3" />}
                </div>
                <span className={verificationState.gstVerified ? "text-slate-200" : "text-slate-500"}>GST Ministry API Registry</span>
              </div>
              <span className={`text-[10px] font-bold ${verificationState.gstVerified ? "text-teal-400" : "text-slate-500"}`}>
                {verificationState.gstVerified ? "VERIFIED" : "PENDING"}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded ${verificationState.bankVerified ? "bg-teal-950 text-teal-400 border border-teal-500/20" : "bg-slate-950 text-slate-600"}`}>
                  {verificationState.bankVerified ? <Check className="h-3 w-3" /> : <CreditCard className="h-3 w-3" />}
                </div>
                <span className={verificationState.bankVerified ? "text-slate-200" : "text-slate-500"}>IMPS Penny Drop Ledger</span>
              </div>
              <span className={`text-[10px] font-bold ${verificationState.bankVerified ? "text-teal-400" : "text-slate-500"}`}>
                {verificationState.bankVerified ? "VERIFIED" : "PENDING"}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded ${verificationState.creditVerified ? "bg-teal-950 text-teal-400 border border-teal-500/20" : "bg-slate-950 text-slate-600"}`}>
                  {verificationState.creditVerified ? <Check className="h-3 w-3" /> : <Activity className="h-3 w-3" />}
                </div>
                <span className={verificationState.creditVerified ? "text-slate-200" : "text-slate-500"}>Experian Commercial Credit</span>
              </div>
              <span className={`text-[10px] font-bold ${verificationState.creditVerified ? "text-teal-400" : "text-slate-500"}`}>
                {verificationState.creditVerified ? "VERIFIED" : "PENDING"}
              </span>
            </div>
          </div>
        </div>

        {/* Security / Vault Certification disclaimer */}
        <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-3.5">
          <div className="flex items-start gap-2">
            <ShieldCheck className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-800">AES-256 Encrypted Ledger</h4>
              <p className="text-[10px] text-slate-500 leading-normal">
                All business tax credentials, bank routing identifiers, and director details undergo cryptographic tokenization prior to verification routing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Dynamic Action Workflows */}
      <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-6">
        {/* Local Section Navigation */}
        <div className="flex p-1 bg-slate-50 border border-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveSubTab("basic")}
            className={`flex-1 py-2 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer text-center ${
              activeSubTab === "basic"
                ? "bg-slate-900 text-teal-400 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            1. Basic Verification
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("business")}
            className={`flex-1 py-2 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer text-center ${
              activeSubTab === "business"
                ? "bg-slate-900 text-teal-400 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            2. Business GST registry
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("advanced")}
            className={`flex-1 py-2 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer text-center ${
              activeSubTab === "advanced"
                ? "bg-slate-900 text-teal-400 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            3. Financials & Credit Check
          </button>
        </div>

        {/* TAB CONTENT */}
        <AnimatePresence mode="wait">
          {/* TAB 1: BASIC VERIFICATION */}
          {activeSubTab === "basic" && (
            <motion.div
              key="basic-tab"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-5"
            >
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <UserCheck className="h-4.5 w-4.5 text-teal-600" /> Primary Contact Verifications
                </h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  Locking contact coordinates establishes baseline operational trust and permits SMS alerts regarding contract payouts.
                </p>
              </div>

              {basicSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-[10px] font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{basicSuccessMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email Panel */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Email Communication</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${verificationState.emailVerified ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                      {verificationState.emailVerified ? "Secured" : "Verification Required"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">Primary Email Address</label>
                    <input
                      type="text"
                      disabled
                      value={emailInput}
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-600 font-medium"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={verificationState.emailVerified || basicLoading}
                    onClick={() => handleVerifyBasic("email")}
                    className={`w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      verificationState.emailVerified
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-600 cursor-default"
                        : "bg-teal-700 hover:bg-teal-800 text-white"
                    }`}
                  >
                    {verificationState.emailVerified ? "Email Confirmed" : basicLoading ? "Securing channel..." : "Verify via Simulated Link"}
                    {!verificationState.emailVerified && <ArrowRight className="h-3 w-3" />}
                  </button>
                </div>

                {/* Mobile Panel */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">SMS Gateway Routing</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${verificationState.mobileVerified ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                      {verificationState.mobileVerified ? "Secured" : "Verification Required"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">Mobile Handset Endpoint</label>
                    <input
                      type="text"
                      disabled
                      value={mobileInput}
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-600 font-mono"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={verificationState.mobileVerified || basicLoading}
                    onClick={() => handleVerifyBasic("mobile")}
                    className={`w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      verificationState.mobileVerified
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-600 cursor-default"
                        : "bg-teal-700 hover:bg-teal-800 text-white"
                    }`}
                  >
                    {verificationState.mobileVerified ? "Mobile OTP Verified" : basicLoading ? "Dispatching handshake..." : "Re-dispatch SMS OTP Link"}
                    {!verificationState.mobileVerified && <ArrowRight className="h-3 w-3" />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: BUSINESS GST REGISTRY */}
          {activeSubTab === "business" && (
            <motion.div
              key="business-tab"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-5"
            >
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <Building className="h-4.5 w-4.5 text-teal-600" /> Government GSTIN Ministry API Verification
                </h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  Automate business legal-entity audit checks using live-query mock-ups interfacing with the GST Network. This locks your official tax status.
                </p>
              </div>

              {gstSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-[10px] font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{gstSuccessMsg}</span>
                </div>
              )}

              {gstErrorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl text-[10px] font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>{gstErrorMsg}</span>
                </div>
              )}

              {/* GST Input / State Display */}
              <div className="p-5 bg-slate-50 border border-slate-150 rounded-2xl">
                {!verificationState.gstVerified ? (
                  <form onSubmit={handleVerifyGst} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-black text-slate-500 tracking-wider">
                        Enter Enterprise GSTIN Number
                      </label>
                      <p className="text-[9px] text-slate-400 mt-0.5 leading-none">Format: 15-digit alphanumeric (e.g., 03AAAAA1111A1Z1)</p>
                      
                      <div className="relative pt-1 flex gap-2">
                        <div className="relative flex-1">
                          <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. 03AAAAA1111A1Z1"
                            value={gstInput}
                            onChange={(e) => setGstInput(e.target.value.toUpperCase())}
                            className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs font-mono font-bold tracking-widest focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-800"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isGstVerifying}
                          className="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-700 text-white font-extrabold uppercase text-[10px] tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 min-w-[150px] justify-center"
                        >
                          {isGstVerifying ? (
                            <>
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              <span>Validating...</span>
                            </>
                          ) : (
                            <>
                              <Search className="h-3.5 w-3.5" />
                              <span>Fetch Profile</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Step-by-Step Simulated Live Call Feedback */}
                    {isGstVerifying && (
                      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2 font-mono text-[9px] text-slate-300">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-teal-400 animate-spin" />
                          <span className={gstVerifyStep >= 1 ? "text-teal-400 font-bold" : "text-slate-500"}>
                            [1/3] Contacting Ministry GSTIN API Endpoints...
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {gstVerifyStep >= 2 ? (
                            <Check className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                          )}
                          <span className={gstVerifyStep >= 2 ? "text-teal-400 font-bold" : "text-slate-500"}>
                            [2/3] Extracting Business PAN legal classification: PARTNERSHIP / CORP...
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {gstVerifyStep >= 3 ? (
                            <Check className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                          )}
                          <span className={gstVerifyStep >= 3 ? "text-teal-400 font-bold" : "text-slate-500"}>
                            [3/3] Authenticating GSTR-3B history compliance log: 100% On-time...
                          </span>
                        </div>
                      </div>
                    )}
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-[9px] font-extrabold uppercase text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          GST Verified Profile
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 mt-1">
                          {verificationState.gstDetails?.legalName}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setVerificationState(prev => ({ ...prev, gstVerified: false }));
                          setGstSuccessMsg(null);
                        }}
                        className="text-[9px] text-slate-400 hover:text-slate-600 font-bold uppercase transition-all flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <RefreshCw className="h-3 w-3" /> Re-enter ID
                      </button>
                    </div>

                    {/* Registry details grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3.5 text-xs text-slate-600 pt-1">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Registered GSTIN ID</span>
                        <span className="font-mono font-bold text-slate-800 tracking-wider">
                          {verificationState.gstDetails?.gstin}
                        </span>
                      </div>

                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Constitution of Business</span>
                        <span className="font-semibold text-slate-800">
                          {verificationState.gstDetails?.constitution}
                        </span>
                      </div>

                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Principal Place of Business</span>
                        <span className="font-semibold text-slate-800 leading-normal block">
                          {verificationState.gstDetails?.addr}
                        </span>
                      </div>

                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Taxpayer Registry Status</span>
                        <span className="font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> {verificationState.gstDetails?.status} (Regular Filing)
                        </span>
                      </div>

                      <div className="md:col-span-2 bg-slate-900 text-slate-300 p-3 rounded-xl flex items-center justify-between text-[11px] border border-slate-800">
                        <span className="font-mono text-[9px] flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4 text-teal-400 shrink-0" />
                          Compliance Score: <span className="text-teal-300 font-bold">{verificationState.gstDetails?.complianceScore}</span>
                        </span>
                        <span className="text-[8px] bg-teal-500/15 border border-teal-500/20 text-teal-400 font-extrabold px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">
                          SLA Rank: AA+
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 3: FINANCIALS & CREDIT CHECK */}
          {activeSubTab === "advanced" && (
            <motion.div
              key="advanced-tab"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-6"
            >
              {/* Introduction */}
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <CreditCard className="h-4.5 w-4.5 text-teal-600" /> Advanced Financial Ledger Security
                </h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  Perform automated Penny-Drop bank verification and corporate risk bureau check-ups to establish highest diamond compliance clearance tier.
                </p>
              </div>

              {/* Sub grid: Left bank verification, right credit bureau query */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* 3.1 Bank Account Verification Card */}
                <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Penny-Drop Ledger Verification</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${verificationState.bankVerified ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                      {verificationState.bankVerified ? "Ledger Verified" : "Verification Required"}
                    </span>
                  </div>

                  {bankErrorMsg && (
                    <p className="text-[9.5px] text-rose-600 font-medium bg-rose-50 border border-rose-100 p-2 rounded-lg">
                      {bankErrorMsg}
                    </p>
                  )}

                  {!verificationState.bankVerified ? (
                    <form onSubmit={handleVerifyBank} className="space-y-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase">Settlement Bank Name</label>
                        <select
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 focus:outline-none"
                        >
                          <option value="State Bank of India">State Bank of India (SBI)</option>
                          <option value="HDFC Bank Limited">HDFC Bank Limited</option>
                          <option value="ICICI Bank Limited">ICICI Bank Limited</option>
                          <option value="State Bank of India">State Bank of India</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase">Account Number</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 5010022314552"
                          value={accountNum}
                          onChange={(e) => setAccountNum(e.target.value.replace(/\D/g, ""))}
                          className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:border-teal-500 font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase">IFSC Routing Code</label>
                        <input
                          type="text"
                          required
                          maxLength={11}
                          placeholder="e.g. HDFC0000240"
                          value={ifscCode}
                          onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                          className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:border-teal-500 font-mono tracking-wider font-bold"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isBankVerifying}
                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-700 text-white font-extrabold uppercase text-[9px] tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
                      >
                        {isBankVerifying ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            <span>
                              {bankVerifyStep === 1 && "Executing Penny Drop..."}
                              {bankVerifyStep === 2 && "Awaiting bank gateway response..."}
                              {bankVerifyStep === 3 && "Matching beneficiary record..."}
                            </span>
                          </>
                        ) : (
                          <>
                            <span>Initiate IMPS Penny-Drop Verification</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-3 text-xs bg-white p-3 border border-slate-150 rounded-xl">
                      <div className="flex items-center gap-2 text-emerald-600 font-bold border-b border-slate-100 pb-2">
                        <CheckCircle className="h-4.5 w-4.5" />
                        <span>Penny-Drop Deposited Match Succeeds</span>
                      </div>
                      <div className="space-y-2 text-slate-500 text-[11px]">
                        <div>
                          <span className="text-[8.5px] uppercase font-bold text-slate-400 block">Settlement Target</span>
                          <span className="font-bold text-slate-800">{verificationState.bankDetails?.bankName}</span>
                        </div>
                        <div>
                          <span className="text-[8.5px] uppercase font-bold text-slate-400 block">Routing Account / IFSC</span>
                          <span className="font-mono text-slate-800">
                            {verificationState.bankDetails?.accountNumber} ({verificationState.bankDetails?.ifsc})
                          </span>
                        </div>
                        <div>
                          <span className="text-[8.5px] uppercase font-bold text-slate-400 block">Beneficiary Entity matched</span>
                          <span className="font-bold text-slate-800 uppercase">
                            {verificationState.bankDetails?.beneficiaryName}
                          </span>
                        </div>
                        <div className="pt-1.5 border-t border-slate-100 text-[10px] text-slate-400 flex justify-between font-mono">
                          <span>Ref: {verificationState.bankDetails?.pennyDropStatus} - OK</span>
                          <span>IMPS Ref ID: {verificationState.bankDetails?.depositRef}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3.2 Credit Bureau Score check Card */}
                <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Corporate Credit Rating Ledger</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${verificationState.creditVerified ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                      {verificationState.creditVerified ? "Credit Secured" : "Verification Required"}
                    </span>
                  </div>

                  {creditErrorMsg && (
                    <p className="text-[9.5px] text-rose-600 font-medium bg-rose-50 border border-rose-100 p-2 rounded-lg">
                      {creditErrorMsg}
                    </p>
                  )}

                  {!verificationState.creditVerified ? (
                    <form onSubmit={handleVerifyCredit} className="space-y-4 text-xs">
                      <p className="text-[10px] text-slate-500 leading-normal">
                        Retrieve the company or director risk assessment metrics from Experian databases using a mock PAN verification log.
                      </p>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase">Company/Director PAN ID</label>
                        <input
                          type="text"
                          required
                          maxLength={10}
                          placeholder="e.g. ABCDE1234F"
                          value={panInput}
                          onChange={(e) => setPanInput(e.target.value.toUpperCase())}
                          className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:border-teal-500 font-mono tracking-widest font-extrabold"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isCreditVerifying}
                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-700 text-white font-extrabold uppercase text-[9px] tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
                      >
                        {isCreditVerifying ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            <span>
                              {creditVerifyStep === 1 && "Connecting bureau database..."}
                              {creditVerifyStep === 2 && "Calculating compliance leverage..."}
                            </span>
                          </>
                        ) : (
                          <>
                            <span>Authorize & Query Credit Bureau Score</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-3.5 text-xs bg-white p-3 border border-slate-150 rounded-xl">
                      <div className="flex items-center gap-2 text-indigo-600 font-bold border-b border-slate-100 pb-2">
                        <Award className="h-4.5 w-4.5" />
                        <span>Corporate Bureau Report Fetched</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-900 text-white p-3 rounded-xl">
                        <div>
                          <span className="text-[8px] font-bold text-slate-400 uppercase block font-mono">Experian Index</span>
                          <span className="text-2xl font-black font-mono text-teal-300">
                            {verificationState.creditDetails?.creditScore}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] font-bold text-slate-400 uppercase block font-mono">Rating classification</span>
                          <span className="text-xs font-bold text-emerald-400 uppercase font-mono">
                            {verificationState.creditDetails?.scoreTier}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-2 gap-y-2 text-[11px] text-slate-500">
                        <div>
                          <span className="text-[8.5px] uppercase font-bold text-slate-400 block">Credit leverage ratio</span>
                          <span className="font-bold text-slate-800 font-mono">{verificationState.creditDetails?.leverageRatio}</span>
                        </div>
                        <div>
                          <span className="text-[8.5px] uppercase font-bold text-slate-400 block">Risk profile band</span>
                          <span className="font-bold text-emerald-600 uppercase">{verificationState.creditDetails?.riskGrade}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
