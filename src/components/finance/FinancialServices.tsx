import React, { useState, useMemo } from "react";
import {
  Coins,
  Shield,
  Calculator,
  Compass,
  FileCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  Upload,
  Layers,
  HelpCircle,
  Building2,
  DollarSign,
  Briefcase,
  Sliders,
  ChevronRight,
  Sparkles,
  Info,
  UserCheck,
  FileText,
  BadgeAlert,
  Download,
  Percent,
  Plus,
  Check
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Interfaces
interface LoanProduct {
  id: string;
  name: string;
  type: "KCC (Kisan Credit Card)" | "Agricultural Term Loan" | "Farm Machinery Loan";
  interestRate: number; // %
  maxTenureMonths: number;
  minAmount: number;
  maxAmount: number;
  prepaymentPenaltyRate: number; // %
  description: string;
}

interface InsuranceProduct {
  id: string;
  name: string;
  category: "Crop (Weather-based)" | "Crop (Yield-based)" | "Equipment" | "Livestock" | "Farmer Life";
  basePremiumRate: number; // % of sum insured
  sumInsured: number; // ₹
  description: string;
}

interface ActiveClaim {
  id: string;
  policyId: string;
  category: string;
  sumInsured: number;
  estimatedSettlement: number;
  status: "Reviewing Documents" | "Field Inspection Scheduled" | "Settlement Approved" | "Disbursed";
  filedDate: string;
}

interface ActivePolicy {
  id: string;
  policyType: "PMFBY (Pradhan Mantri Fasal Bima Yojana)" | "Weather-based insurance" | "Livestock insurance";
  cropName: string;
  areaAcres: number;
  sumInsuredPerAcre: number;
  totalSumInsured: number;
  premiumAmount: number;
  appliedDate: string;
  status: "Active" | "Pending Document Review" | "Underwriting Approval";
  documentsAttached: string[];
}

export const FinancialServices: React.FC = () => {
  // Global View Mode
  const [activeTab, setActiveTab] = useState<"loans" | "insurance">("loans");

  // Pre-seeded Loan Products
  const loanProducts: LoanProduct[] = [
    {
      id: "KCC-01",
      name: "Sovereign Kisan Credit Card (KCC)",
      type: "KCC (Kisan Credit Card)",
      interestRate: 7.0, // Base interest rate
      maxTenureMonths: 12,
      minAmount: 10000,
      maxAmount: 300000,
      prepaymentPenaltyRate: 0.0, // 0 penalty under government subsidy
      description: "Highly subsidized short-term crop loans with interest subvention schemes. Best for seasonal cultivation costs."
    },
    {
      id: "TERM-02",
      name: "Agronomic High-Yield Term Loan",
      type: "Agricultural Term Loan",
      interestRate: 9.5,
      maxTenureMonths: 60,
      minAmount: 100000,
      maxAmount: 1500000,
      prepaymentPenaltyRate: 1.5,
      description: "Medium to long-term funding for minor irrigation, land development, solar pumps, and orchard setup."
    },
    {
      id: "EQUIP-03",
      name: "Harvester & Tractor Equipment Loan",
      type: "Farm Machinery Loan",
      interestRate: 8.8,
      maxTenureMonths: 48,
      minAmount: 50000,
      maxAmount: 1000000,
      prepaymentPenaltyRate: 2.0,
      description: "Asset-backed machinery financing with flexible hypothecation terms. Low processing overheads."
    }
  ];

  // Pre-seeded Insurance Products
  const insuranceProducts: InsuranceProduct[] = [
    {
      id: "INS-CROP-01",
      name: "Sovereign PMFBY Weather-Index Crop Cover",
      category: "Crop (Weather-based)",
      basePremiumRate: 2.0, // Government subsidized
      sumInsured: 150000,
      description: "Subsidized yield protection against dry spell deficits, unseasonal rainfall, and high temperature index spikes."
    },
    {
      id: "INS-LIVE-02",
      name: "Livestock Bovine & Poultry Protection",
      category: "Livestock",
      basePremiumRate: 3.5,
      sumInsured: 80000,
      description: "Covers cattle mortality due to Foot and Mouth disease, lightning strikes, or regional water contamination."
    },
    {
      id: "INS-EQUIP-03",
      name: "Tractor & Multi-Crop Thresher Insurance",
      category: "Equipment",
      basePremiumRate: 1.8,
      sumInsured: 650000,
      description: "Direct asset insurance cover protecting against fire, mechanical theft, road transit accidents, and flooding."
    },
    {
      id: "INS-LIFE-04",
      name: "Farmer Jeevan Suraksha Term Life Policy",
      category: "Farmer Life",
      basePremiumRate: 0.9,
      sumInsured: 500000,
      description: "Direct term life insurance providing direct support and collateral relief to farming households."
    }
  ];

  // State values for Loan Eligibility & Valuation Checker
  const [landAreaAcres, setLandAreaAcres] = useState<number>(4.5);
  const [irrigationSource, setIrrigationSource] = useState<"Tubewell" | "Canal Feed" | "Rainfed">("Tubewell");
  const [existingDebt, setExistingDebt] = useState<number>(30000);
  const [selectedCollateralType, setSelectedCollateralType] = useState<"Land Title" | "Harvester Machinery">("Land Title");

  // AI scoring model evaluation
  const aiEligibilityScore = useMemo(() => {
    let baseScore = 65;

    // Land multiplier
    baseScore += Math.min(25, landAreaAcres * 5.5);

    // Irrigation source
    if (irrigationSource === "Tubewell") baseScore += 10;
    if (irrigationSource === "Canal Feed") baseScore += 5;

    // Debt reduction
    if (existingDebt > 100000) baseScore -= 20;
    else if (existingDebt > 30000) baseScore -= 8;
    else baseScore += 5;

    const finalScore = Math.min(100, Math.max(10, Math.round(baseScore)));

    let status: "Excellent" | "Good" | "Marginal" | "High Risk" = "Excellent";
    let loanApprovalProbability = "98%";
    if (finalScore >= 85) { status = "Excellent"; loanApprovalProbability = "98%"; }
    else if (finalScore >= 70) { status = "Good"; loanApprovalProbability = "85%"; }
    else if (finalScore >= 50) { status = "Marginal"; loanApprovalProbability = "50%"; }
    else { status = "High Risk"; loanApprovalProbability = "12%"; }

    // Collateral Valuation calculation (Land value ₹2,50,000 per acre, Harvester base ₹6,00,000)
    let collateralValuationValue = 0;
    if (selectedCollateralType === "Land Title") {
      collateralValuationValue = landAreaAcres * 250000;
    } else {
      collateralValuationValue = 600000;
    }

    return {
      score: finalScore,
      status,
      loanApprovalProbability,
      collateralValuationValue: Math.round(collateralValuationValue),
      maxEligibleLimit: Math.round(collateralValuationValue * 0.7) // 70% LTV ratio
    };
  }, [landAreaAcres, irrigationSource, existingDebt, selectedCollateralType]);

  // --- LOAN EMI CALCULATOR ---
  const [selectedLoanId, setSelectedLoanId] = useState<string>("KCC-01");
  const selectedLoanProduct = useMemo(() => {
    return loanProducts.find((p) => p.id === selectedLoanId) || loanProducts[0];
  }, [selectedLoanId]);

  const [requestedLoanAmount, setRequestedLoanAmount] = useState<number>(150000);
  const [requestedTenureMonths, setRequestedTenureMonths] = useState<number>(12);

  // Prepayment Calculator states
  const [prepayAmount, setPrepayAmount] = useState<number>(30000);

  const emiCalculations = useMemo(() => {
    // Interest is calculated as monthly
    const r = (selectedLoanProduct.interestRate / 12) / 100;
    const n = requestedTenureMonths;
    const P = requestedLoanAmount;

    // EMI standard mathematical formula
    let emi = 0;
    if (r > 0) {
      emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else {
      emi = P / n;
    }

    const totalRepayment = emi * n;
    const totalInterestPayable = totalRepayment - P;

    // Calculate prepayment penalty
    const penaltyAmount = prepayAmount * (selectedLoanProduct.prepaymentPenaltyRate / 100);

    // Repayment schedule data for charting
    const scheduleData = [];
    let remainingPrincipal = P;
    const monthlyRate = (selectedLoanProduct.interestRate / 12) / 100;

    for (let month = 1; month <= n; month++) {
      const interestComponent = remainingPrincipal * monthlyRate;
      const principalComponent = emi - interestComponent;
      remainingPrincipal = Math.max(0, remainingPrincipal - principalComponent);

      scheduleData.push({
        name: `M${month}`,
        Principal: Math.round(principalComponent),
        Interest: Math.round(interestComponent),
        Outstanding: Math.round(remainingPrincipal)
      });
    }

    return {
      monthlyEmi: Math.round(emi),
      totalRepayment: Math.round(totalRepayment),
      totalInterestPayable: Math.round(totalInterestPayable),
      penaltyAmount: Math.round(penaltyAmount),
      scheduleData
    };
  }, [selectedLoanProduct, requestedLoanAmount, requestedTenureMonths, prepayAmount]);

  // --- DOCUMENT UPLOAD SIMULATION ---
  const [uploadedDocuments, setUploadedDocuments] = useState<{ name: string; size: string; status: "Verified" | "Uploading" }[]>([
    { name: "Land-Title-Records-Machilipatnam.pdf", size: "2.4 MB", status: "Verified" },
    { name: "Aadhaar-KYC-Identity.pdf", size: "1.2 MB", status: "Verified" }
  ]);
  const [documentMessage, setDocumentMessage] = useState<string | null>(null);

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newDoc = {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        status: "Uploading" as const
      };
      setUploadedDocuments((prev) => [...prev, newDoc]);
      setDocumentMessage("📄 Document uploaded. Scanning using sovereign verification OCR algorithms...");

      setTimeout(() => {
        setUploadedDocuments((prev) =>
          prev.map((doc) => (doc.name === file.name ? { ...doc, status: "Verified" } : doc))
        );
        setDocumentMessage("✅ Verification Completed! Land registry validation complete.");
      }, 3000);
    }
  };

  // --- 8.2 CROP INSURANCE STATE & SYSTEM ---
  const [activePolicies, setActivePolicies] = useState<ActivePolicy[]>([
    {
      id: "POL-PMFBY-781",
      policyType: "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
      cropName: "Paddy (Rice)",
      areaAcres: 5,
      sumInsuredPerAcre: 50000,
      totalSumInsured: 250000,
      premiumAmount: 5000, // 2% Kharif Paddy Rate
      appliedDate: "2026-06-12",
      status: "Active",
      documentsAttached: ["Land-Records-Machilipatnam.pdf", "Aadhaar-KYC.pdf"]
    },
    {
      id: "POL-WEATHER-294",
      policyType: "Weather-based insurance",
      cropName: "Cotton",
      areaAcres: 4,
      sumInsuredPerAcre: 60000,
      totalSumInsured: 240000,
      premiumAmount: 7200, // 3% Weather Rate
      appliedDate: "2026-06-20",
      status: "Active",
      documentsAttached: ["Land-Title-Records.pdf"]
    },
    {
      id: "POL-LIVESTOCK-104",
      policyType: "Livestock insurance",
      cropName: "Milch Buffalo (Bovine)",
      areaAcres: 2, // 2 Animals
      sumInsuredPerAcre: 80000,
      totalSumInsured: 160000,
      premiumAmount: 6400, // 4% Livestock Rate
      appliedDate: "2026-06-25",
      status: "Active",
      documentsAttached: ["Veterinary-Health-Cert.pdf", "Aadhaar-KYC.pdf"]
    }
  ]);

  const [activeClaims, setActiveClaims] = useState<ActiveClaim[]>([
    {
      id: "CLM-9201",
      policyId: "POL-PMFBY-781",
      category: "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
      sumInsured: 250000,
      estimatedSettlement: 185000,
      status: "Field Inspection Scheduled",
      filedDate: "2026-06-20"
    }
  ]);

  // Premium Calculator inputs
  const [calcPolicyType, setCalcPolicyType] = useState<"PMFBY" | "Weather-based" | "Livestock">("PMFBY");
  const [calcCrop, setCalcCrop] = useState<string>("Paddy (Rice)");
  const [calcArea, setCalcArea] = useState<number>(5);
  const [calcSumInsuredPerAcre, setCalcSumInsuredPerAcre] = useState<number>(50000);

  // Apply for Insurance form inputs
  const [applyPolicyType, setApplyPolicyType] = useState<"PMFBY" | "Weather-based" | "Livestock">("PMFBY");
  const [applyCrop, setApplyCrop] = useState<string>("Paddy (Rice)");
  const [applyArea, setApplyArea] = useState<number>(5);
  const [applySumInsuredPerAcre, setApplySumInsuredPerAcre] = useState<number>(50000);
  const [applyDocs, setApplyDocs] = useState<string[]>([]);
  const [applySuccessMsg, setApplySuccessMsg] = useState<string | null>(null);
  const [isUploadingApplyDoc, setIsUploadingApplyDoc] = useState<boolean>(false);

  // Claim filing form inputs
  const [claimPolicyId, setClaimPolicyId] = useState<string>("POL-PMFBY-781");
  const [claimIncident, setClaimIncident] = useState<string>("Excess monsoonal washouts destroyed early-stage paddy seeds.");
  const [claimProofDocs, setClaimProofDocs] = useState<string[]>([]);
  const [claimSuccessMsg, setClaimSuccessMsg] = useState<string | null>(null);
  const [isUploadingClaimDoc, setIsUploadingClaimDoc] = useState<boolean>(false);

  // --- MEMOS FOR PREMIUM CALCULATORS ---
  const premiumCalculatorOutput = useMemo(() => {
    let rate = 2.0; // standard default
    if (calcPolicyType === "PMFBY") {
      const cropLower = calcCrop.toLowerCase();
      if (cropLower.includes("wheat") || cropLower.includes("mustard") || cropLower.includes("barley") || cropLower.includes("rabi")) {
        rate = 1.5; // Rabi crops
      } else if (cropLower.includes("tomato") || cropLower.includes("sugarcane") || cropLower.includes("onion") || cropLower.includes("chili") || cropLower.includes("fruit") || cropLower.includes("vegetable")) {
        rate = 5.0; // Commercial/Horticultural
      } else {
        rate = 2.0; // Kharif (Paddy, Cotton, etc.)
      }
    } else if (calcPolicyType === "Weather-based") {
      rate = 3.0; // Weather index based
    } else {
      rate = 4.0; // Livestock insurance
    }

    const premiumPerAcre = calcSumInsuredPerAcre * (rate / 100);
    const totalPremium = premiumPerAcre * calcArea;
    const totalSumInsured = calcSumInsuredPerAcre * calcArea;

    return {
      rate,
      premiumPerAcre: Math.round(premiumPerAcre),
      totalPremium: Math.round(totalPremium),
      totalSumInsured: Math.round(totalSumInsured)
    };
  }, [calcPolicyType, calcCrop, calcArea, calcSumInsuredPerAcre]);

  const applyFormPremiumOutput = useMemo(() => {
    let rate = 2.0;
    if (applyPolicyType === "PMFBY") {
      const cropLower = applyCrop.toLowerCase();
      if (cropLower.includes("wheat") || cropLower.includes("mustard") || cropLower.includes("barley") || cropLower.includes("rabi")) {
        rate = 1.5;
      } else if (cropLower.includes("tomato") || cropLower.includes("sugarcane") || cropLower.includes("onion") || cropLower.includes("chili") || cropLower.includes("fruit") || cropLower.includes("vegetable")) {
        rate = 5.0;
      } else {
        rate = 2.0;
      }
    } else if (applyPolicyType === "Weather-based") {
      rate = 3.0;
    } else {
      rate = 4.0;
    }

    const premiumPerAcre = applySumInsuredPerAcre * (rate / 100);
    const totalPremium = premiumPerAcre * applyArea;
    const totalSumInsured = applySumInsuredPerAcre * applyArea;

    return {
      rate,
      premiumPerAcre: Math.round(premiumPerAcre),
      totalPremium: Math.round(totalPremium),
      totalSumInsured: Math.round(totalSumInsured)
    };
  }, [applyPolicyType, applyCrop, applyArea, applySumInsuredPerAcre]);

  // --- ACTIONS HANDLERS ---
  const handleSimulateApplyDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploadingApplyDoc(true);
      setTimeout(() => {
        setApplyDocs((prev) => [...prev, file.name]);
        setIsUploadingApplyDoc(false);
      }, 1000);
    }
  };

  const handleSimulateClaimDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploadingClaimDoc(true);
      setTimeout(() => {
        setClaimProofDocs((prev) => [...prev, file.name]);
        setIsUploadingClaimDoc(false);
      }, 1000);
    }
  };

  const handleApplyInsurance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyCrop.trim()) {
      alert("Please specify a valid crop or subject details.");
      return;
    }

    const fullPolicyName = applyPolicyType === "PMFBY"
      ? "PMFBY (Pradhan Mantri Fasal Bima Yojana)"
      : applyPolicyType === "Weather-based"
      ? "Weather-based insurance"
      : "Livestock insurance";

    const newPolicyId = `POL-${applyPolicyType.toUpperCase().split("-")[0]}-${Math.floor(100 + Math.random() * 900)}`;
    const newPolicy: ActivePolicy = {
      id: newPolicyId,
      policyType: fullPolicyName as any,
      cropName: applyCrop.trim(),
      areaAcres: applyArea,
      sumInsuredPerAcre: applySumInsuredPerAcre,
      totalSumInsured: applyFormPremiumOutput.totalSumInsured,
      premiumAmount: applyFormPremiumOutput.totalPremium,
      appliedDate: new Date().toISOString().split("T")[0],
      status: "Active",
      documentsAttached: applyDocs.length > 0 ? applyDocs : ["Standard-Land-Records.pdf"]
    };

    setActivePolicies((prev) => [newPolicy, ...prev]);
    
    // Automatically pre-select newly applied policy in Claim select
    setClaimPolicyId(newPolicyId);

    setApplySuccessMsg(`🎉 Success! Applied for ${newPolicy.policyType}. Premium of ₹${newPolicy.premiumAmount.toLocaleString()} paid. Policy ${newPolicy.id} is now Active.`);
    
    // Reset apply form fields
    setApplyCrop("Paddy (Rice)");
    setApplyArea(5);
    setApplySumInsuredPerAcre(50000);
    setApplyDocs([]);

    setTimeout(() => {
      setApplySuccessMsg(null);
    }, 6000);
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const policy = activePolicies.find((p) => p.id === claimPolicyId);
    if (!policy) {
      alert("Please select a valid policy.");
      return;
    }
    if (!claimIncident.trim()) {
      alert("Please provide the incident breakdown details.");
      return;
    }

    // Settlement covers ~80% to 90% of sum insured under standard loss assessments
    const settlementEstimate = Math.round(policy.totalSumInsured * 0.82);

    const newClaim: ActiveClaim = {
      id: `CLM-${Math.floor(1000 + Math.random() * 9000)}`,
      policyId: policy.id,
      category: policy.policyType,
      sumInsured: policy.totalSumInsured,
      estimatedSettlement: settlementEstimate,
      status: "Reviewing Documents",
      filedDate: new Date().toISOString().split("T")[0]
    };

    setActiveClaims((prev) => [newClaim, ...prev]);
    setClaimSuccessMsg(`🎉 Claim successfully filed. Reference: ${newClaim.id}. Status set to 'Reviewing Documents'.`);

    setClaimIncident("");
    setClaimProofDocs([]);

    setTimeout(() => {
      setClaimSuccessMsg(null);
    }, 6000);
  };

  return (
    <div id="financial-services-dashboard" className="space-y-6">

      {/* Main Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[9px] uppercase font-black tracking-widest text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-900 flex items-center gap-1.5 w-fit">
            <Coins className="h-4 w-4 animate-pulse" /> Unified Sovereign Agricultural Finance
          </span>
          <h2 className="text-white text-base font-black uppercase tracking-tight mt-2">Farmers Financial Command Center</h2>
          <p className="text-slate-400 text-[10px] font-medium">Bilateral Kisan Credit Card limits, AI credit scoring metrics, automated premium discount bundlers, and direct claims filing networks.</p>
        </div>

        {/* Global Tab Switcher */}
        <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800 flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("loans")}
            className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "loans"
                ? "bg-emerald-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🌾 Subsidized Loans
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("insurance")}
            className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "insurance"
                ? "bg-emerald-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🛡 Crop Insurance & Claims
          </button>
        </div>
      </div>

      {/* VIEW SECTION 1: SUBSIDIZED LOANS & CALCULATORS */}
      {activeTab === "loans" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT: LOAN CALCULATORS, EMI SCHEDULE & PREPAYMENT PENALTY (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6">

            {/* 1. Agricultural Loan Product Comparison */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Subsidized Agricultural Loan Products</h3>
                <p className="text-[10px] text-slate-400">Government backed schemes with pre-subvented interest multipliers for local farmers.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {loanProducts.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedLoanId(p.id);
                      setRequestedLoanAmount(p.minAmount);
                    }}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      selectedLoanId === p.id
                        ? "bg-emerald-50/70 border-emerald-600"
                        : "bg-white border-slate-200 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <span className="text-[8.5px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {p.type.split(" ")[0]}
                      </span>
                      <h4 className="text-xs font-black text-slate-800 leading-snug">{p.name}</h4>
                      <p className="text-[9.5px] text-slate-500 leading-relaxed font-semibold">{p.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] font-mono">
                      <div>
                        <span className="text-slate-400 text-[8px] font-bold block uppercase leading-none">Interest Rate</span>
                        <span className="text-emerald-700 font-black">{p.interestRate.toFixed(1)}% p.a.</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 text-[8px] font-bold block uppercase leading-none">Prepayment Fee</span>
                        <span className="text-slate-700 font-extrabold">{p.prepaymentPenaltyRate}%</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. EMI CALCULATOR WITH VISUAL GRAPH REPRESENTATION */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Dynamic Repayment Schedule & EMI Planner</h3>
                <p className="text-[10px] text-slate-400">Forecast cumulative interest outlays over the amortized cycle of the loan.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Inputs and Stats */}
                <div className="md:col-span-4 space-y-4 text-xs font-semibold">
                  <div>
                    <div className="flex justify-between items-center text-[10.5px] font-black text-slate-500 uppercase mb-1">
                      <span>Principal Amount</span>
                      <span className="text-emerald-700 font-extrabold">₹{requestedLoanAmount.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min={selectedLoanProduct.minAmount}
                      max={selectedLoanProduct.maxAmount}
                      step={10000}
                      value={requestedLoanAmount}
                      onChange={(e) => setRequestedLoanAmount(parseInt(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-[10.5px] font-black text-slate-500 uppercase mb-1">
                      <span>Tenure Duration</span>
                      <span className="text-emerald-700 font-extrabold">{requestedTenureMonths} Months</span>
                    </div>
                    <input
                      type="range"
                      min={3}
                      max={selectedLoanProduct.maxTenureMonths}
                      step={3}
                      value={requestedTenureMonths}
                      onChange={(e) => setRequestedTenureMonths(parseInt(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                    />
                  </div>

                  {/* Calculations breakdown list */}
                  <div className="bg-slate-900 text-slate-300 rounded-xl p-4 space-y-2 text-[9.5px] font-mono">
                    <div className="flex justify-between">
                      <span>Monthly EMI:</span>
                      <span className="text-white">₹{emiCalculations.monthlyEmi.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interest Outlay:</span>
                      <span className="text-white">₹{emiCalculations.totalInterestPayable.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-2 text-xs font-bold font-sans text-white">
                      <span>Total Repayment:</span>
                      <span className="text-emerald-400">₹{emiCalculations.totalRepayment.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                {/* Graph Visualization (recharts AreaChart) */}
                <div className="md:col-span-8 h-48 bg-slate-50 border border-slate-150 p-2 rounded-xl">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={emiCalculations.scheduleData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#dc2626" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                      <YAxis stroke="#94a3b8" fontSize={9} />
                      <Tooltip contentStyle={{ fontSize: "10px" }} />
                      <Legend wrapperStyle={{ fontSize: "9px" }} />
                      <Area name="Principal Portion" type="monotone" dataKey="Principal" stroke="#059669" fillOpacity={1} fill="url(#colorPrincipal)" strokeWidth={1.5} />
                      <Area name="Interest Portion" type="monotone" dataKey="Interest" stroke="#dc2626" fillOpacity={1} fill="url(#colorInterest)" strokeWidth={1.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

              </div>
            </div>

            {/* 3. PREPAYMENT PENALTY CALCULATOR */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Percent className="h-4.5 w-4.5 text-emerald-600" /> Prepayment Penalty & Subsidy Calculator
                </h3>
                <p className="text-[10px] text-slate-400">Estimate closing costs or interest subvention benefits for clearing debt early.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">
                    Simulate Prepayment Amount (₹)
                  </label>
                  <input
                    type="number"
                    step="5000"
                    value={prepayAmount}
                    onChange={(e) => setPrepayAmount(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold"
                  />
                  <span className="text-[9px] text-slate-400 mt-1 block">
                    Product rate applied: {selectedLoanProduct.prepaymentPenaltyRate}% of prepayment principal.
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 text-[8.5px] uppercase font-black block">Prepayment Penalty Levy</span>
                    <span className={`text-base font-black ${emiCalculations.penaltyAmount > 0 ? "text-red-600" : "text-emerald-700"}`}>
                      {emiCalculations.penaltyAmount > 0 ? `₹${emiCalculations.penaltyAmount.toLocaleString()}` : "Zero Penalty (KCC Waived)"}
                    </span>
                  </div>
                  <div className="text-[9px] text-slate-400 text-right space-y-0.5">
                    <p>• Government subventions cover KCC prepayment.</p>
                    <p>• Non-KCC terms apply small penalty charges.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: AI ELIGIBILITY & DOCUMENT UPLOAD (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6">

            {/* 1. AI CREDIT SCORING & ELIGIBILITY CHECKER */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <UserCheck className="h-4.5 w-4.5 text-emerald-600" /> AI Credit Scorer & Collateral Valuation
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Automated land title evaluation and immediate eligibility scoring.</p>
                </div>
                <Sparkles className="h-4 w-4 text-emerald-600 animate-pulse" />
              </div>

              {/* Dynamic land size and irrigation inputs */}
              <div className="space-y-3.5 text-xs font-semibold">
                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Land Holding Area (Acres)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={landAreaAcres}
                    onChange={(e) => setLandAreaAcres(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Irrigation Source</label>
                    <select
                      value={irrigationSource}
                      onChange={(e) => setIrrigationSource(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold"
                    >
                      <option value="Tubewell">Tubewell (Stable)</option>
                      <option value="Canal Feed">Canal Feed</option>
                      <option value="Rainfed">Rainfed (Unstable)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Other Debt Outstandings</label>
                    <input
                      type="number"
                      step="5000"
                      value={existingDebt}
                      onChange={(e) => setExistingDebt(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Collateral valuation type selector */}
                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Collateral Pledge Option</label>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    {(["Land Title", "Harvester Machinery"] as const).map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setSelectedCollateralType(col)}
                        className={`py-1.5 rounded-lg text-[9.5px] font-black border uppercase text-center transition-all cursor-pointer ${
                          selectedCollateralType === col
                            ? "bg-emerald-700 border-emerald-700 text-white"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Results Screen */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center border-b border-emerald-100 pb-2">
                    <div>
                      <span className="text-[8.5px] font-black text-emerald-800 uppercase block">AI Rating Index</span>
                      <span className="text-xl font-black text-emerald-950 leading-none">{aiEligibilityScore.score} / 100</span>
                    </div>
                    <span className="text-[9px] font-black uppercase text-emerald-700">
                      Approval Status: <strong className="underline">{aiEligibilityScore.status}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[9.5px] font-semibold text-emerald-900 leading-normal">
                    <div>
                      <span className="text-[8px] text-emerald-700 uppercase block font-bold">Collateral Value</span>
                      <span className="font-extrabold text-emerald-950">₹{aiEligibilityScore.collateralValuationValue.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-emerald-700 uppercase block font-bold">Max Limit Approved</span>
                      <span className="font-extrabold text-emerald-950">₹{aiEligibilityScore.maxEligibleLimit.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* 2. DOCUMENT UPLOAD & REGISTRY VERIFICATION SUITE */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="h-4.5 w-4.5 text-emerald-600" /> Land Registry Documents Verification
                </h3>
                <p className="text-[10px] text-slate-400">Bilateral document verification scanned with immediate OCR land records indexing.</p>
              </div>

              <div className="space-y-3">
                {uploadedDocuments.map((doc, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-150 p-2.5 rounded-lg flex justify-between items-center text-xs font-semibold">
                    <div>
                      <span className="text-slate-800 block text-[10.5px] font-extrabold">{doc.name}</span>
                      <span className="text-[9px] text-slate-400 font-mono">Size: {doc.size}</span>
                    </div>
                    <span className="text-[9px] font-extrabold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-150">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> verified
                    </span>
                  </div>
                ))}

                {/* Upload Action */}
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50/50 transition-colors relative cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg"
                    onChange={handleDocumentUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="h-6 w-6 text-slate-400 mx-auto mb-2" />
                  <span className="text-[10px] font-extrabold text-slate-600 block uppercase tracking-wide">Upload Land Registry Document</span>
                  <span className="text-[8.5px] text-slate-400 mt-1 block">Supports PDF, PNG, JPG files up to 10MB</span>
                </div>

                {documentMessage && (
                  <div className="text-[9.5px] font-bold p-2 bg-emerald-50 text-emerald-800 border border-emerald-150 rounded">
                    {documentMessage}
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* VIEW SECTION 2: 8.2 CROP INSURANCE, ENROLLMENT & CLAIMS TRACKER */}
      {activeTab === "insurance" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN: POLICY TYPES, PREMIUM CALCULATOR & ACTIVE POLICIES LEDGER (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6">

            {/* 1. Policy Types Directory */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-600" />
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Sovereign Agricultural Policy Types</h3>
                  <p className="text-[10px] text-slate-400">Approved bilateral protection protocols backed by interest subventions and regional disaster funding.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* PMFBY */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[8px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                      Subsidized Yield
                    </span>
                    <h4 className="text-[11px] font-extrabold text-slate-800 leading-tight">PMFBY (Pradhan Mantri Fasal Bima Yojana)</h4>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                      Yield-based cover protecting farmers against regional rain deficits, post-harvest losses, and localized storms. Subsidized flat rates.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center text-[9px] font-mono font-bold text-slate-400">
                    <span>Premium Rates</span>
                    <span className="text-emerald-700 font-extrabold">1.5% - 5.0%</span>
                  </div>
                </div>

                {/* Weather-based */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[8px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                      Weather Index
                    </span>
                    <h4 className="text-[11px] font-extrabold text-slate-800 leading-tight">Weather-based insurance</h4>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                      Index-based cover designed to offset dry spells, unseasonal rain surges, high wind speeds, and temperature spikes.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center text-[9px] font-mono font-bold text-slate-400">
                    <span>Premium Rates</span>
                    <span className="text-blue-700 font-extrabold">3.0% flat</span>
                  </div>
                </div>

                {/* Livestock */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[8px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded border border-purple-200">
                      Animal Protection
                    </span>
                    <h4 className="text-[11px] font-extrabold text-slate-800 leading-tight">Livestock insurance</h4>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                      Protects dairy cows, milch buffaloes, poultry, and goats against contagious disease, natural catastrophes, and accidental death.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center text-[9px] font-mono font-bold text-slate-400">
                    <span>Premium Rates</span>
                    <span className="text-purple-700 font-extrabold">4.0% flat</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Interactive Premium Calculator */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Calculator className="h-5 w-5 text-emerald-600" />
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Dynamic Premium & Coverage Estimator</h3>
                  <p className="text-[10px] text-slate-400">Determine dynamic per-acre premium levies and overall sum coverage before applying.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-xs font-semibold">
                
                {/* Inputs Area */}
                <div className="md:col-span-7 space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Policy Category</label>
                      <select
                        value={calcPolicyType}
                        onChange={(e) => setCalcPolicyType(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="PMFBY">PMFBY Subsidized Cover</option>
                        <option value="Weather-based">Weather-based insurance</option>
                        <option value="Livestock">Livestock insurance</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Crop / Subject Name</label>
                      <select
                        value={calcCrop}
                        onChange={(e) => setCalcCrop(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        {calcPolicyType === "Livestock" ? (
                          <>
                            <option value="Milch Buffalo (Bovine)">Milch Buffalo (Bovine)</option>
                            <option value="Hybrid Dairy Cow">Hybrid Dairy Cow</option>
                            <option value="Poultry Broiler Flock">Poultry Broiler Flock</option>
                          </>
                        ) : (
                          <>
                            <option value="Paddy (Rice)">Paddy (Rice) [Kharif]</option>
                            <option value="Cotton">Cotton [Kharif]</option>
                            <option value="Wheat">Wheat [Rabi]</option>
                            <option value="Mustard">Mustard [Rabi]</option>
                            <option value="Tomato">Tomato [Commercial]</option>
                            <option value="Sugarcane">Sugarcane [Commercial]</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between items-center text-[9px] font-bold uppercase text-slate-500 mb-1">
                        <span>{calcPolicyType === "Livestock" ? "Number of Animals" : "Land Area (Acres)"}</span>
                        <span className="text-emerald-700 font-extrabold">{calcArea} {calcPolicyType === "Livestock" ? "Units" : "Acres"}</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={30}
                        step={1}
                        value={calcArea}
                        onChange={(e) => setCalcArea(parseInt(e.target.value) || 1)}
                        className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-[9px] font-bold uppercase text-slate-500 mb-1">
                        <span>Sum Insured (₹/{calcPolicyType === "Livestock" ? "Unit" : "Acre"})</span>
                        <span className="text-emerald-700 font-extrabold">₹{calcSumInsuredPerAcre.toLocaleString()}</span>
                      </div>
                      <input
                        type="range"
                        min={15000}
                        max={120000}
                        step={5000}
                        value={calcSumInsuredPerAcre}
                        onChange={(e) => setCalcSumInsuredPerAcre(parseInt(e.target.value) || 15000)}
                        className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Calculation Outputs Panel */}
                <div className="md:col-span-5 bg-slate-900 text-slate-300 rounded-xl p-4 flex flex-col justify-between space-y-2 border border-slate-800">
                  <div className="space-y-1.5">
                    <span className="text-[7.5px] uppercase font-mono tracking-widest text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-900 w-fit block">
                      Calculator Estimates
                    </span>
                    <h4 className="text-[10px] text-slate-400 font-mono">Formula: Sum Insured × Rate ({premiumCalculatorOutput.rate}%)</h4>
                  </div>

                  <div className="space-y-1.5 border-t border-b border-slate-800 py-2.5 font-mono text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Premium ({calcPolicyType === "Livestock" ? "₹/Unit" : "₹/Acre"}):</span>
                      <span className="text-white font-bold">₹{premiumCalculatorOutput.premiumPerAcre.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Total Area/Units:</span>
                      <span className="text-white font-bold">{calcArea} {calcPolicyType === "Livestock" ? "Units" : "Acres"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Total Sum Insured:</span>
                      <span className="text-white font-bold">₹{premiumCalculatorOutput.totalSumInsured.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <div>
                      <span className="text-[8px] text-slate-400 font-bold uppercase block leading-none">Total Premium Payable</span>
                      <span className="text-emerald-400 text-sm font-black font-mono">₹{premiumCalculatorOutput.totalPremium.toLocaleString("en-IN")}</span>
                    </div>
                    <span className="text-[8.5px] text-slate-500 font-sans text-right italic leading-tight">
                      *Govt subsidy of 50% already subvented.
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* 3. Active Policies Ledger */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-emerald-600" />
                  <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Active Policy Cover Ledger</h3>
                    <p className="text-[10px] text-slate-400">Verifiable active policy references eligible for localized disaster claim filing.</p>
                  </div>
                </div>
                <span className="text-[9px] font-extrabold text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                  {activePolicies.length} Active Policies
                </span>
              </div>

              <div className="space-y-3">
                {activePolicies.map((pol) => (
                  <div key={pol.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 hover:border-slate-300 transition-all">
                    
                    {/* Header */}
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[8.5px] font-mono font-black text-slate-400 uppercase">Policy ID: {pol.id}</span>
                          <span className="text-[8.5px] bg-emerald-50 text-emerald-700 font-black uppercase px-2 py-0.2 rounded border border-emerald-100 flex items-center gap-0.5">
                            <span className="h-1 w-1 bg-emerald-500 rounded-full animate-pulse mr-0.5"></span>
                            {pol.status}
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-slate-800 leading-tight">
                          {pol.policyType}
                        </h4>
                      </div>

                      <div className="text-right text-[10px] font-mono">
                        <span className="text-slate-400 text-[8px] font-bold block uppercase leading-none">Net Premium Paid</span>
                        <span className="text-slate-800 font-black">₹{pol.premiumAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Meta values */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-medium text-slate-500 pt-2 border-t border-dashed border-slate-200/60 leading-normal">
                      <div>
                        <span className="text-[8px] font-bold text-slate-400 uppercase block">Subject / Crop</span>
                        <strong className="text-slate-700 font-extrabold">{pol.cropName}</strong>
                      </div>
                      <div>
                        <span className="text-[8px] font-bold text-slate-400 uppercase block">Total Area / Units</span>
                        <strong className="text-slate-700 font-extrabold">{pol.areaAcres} {pol.policyType.includes("Livestock") ? "Units" : "Acres"}</strong>
                      </div>
                      <div>
                        <span className="text-[8px] font-bold text-slate-400 uppercase block">Sum Insured per Acre</span>
                        <strong className="text-slate-700 font-extrabold">₹{pol.sumInsuredPerAcre.toLocaleString()}</strong>
                      </div>
                      <div>
                        <span className="text-[8px] font-bold text-slate-400 uppercase block">Aggregate Coverage</span>
                        <strong className="text-emerald-700 font-black">₹{pol.totalSumInsured.toLocaleString()}</strong>
                      </div>
                    </div>

                    {/* Attached files */}
                    <div className="flex items-center justify-between text-[8.5px] text-slate-400 font-semibold border-t border-slate-200/50 pt-2 font-mono">
                      <span className="flex items-center gap-1">
                        📄 Documents: <span className="text-slate-600 font-bold">{pol.documentsAttached.join(", ")}</span>
                      </span>
                      <span>Enrolled on: {pol.appliedDate}</span>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: APPLY FOR INSURANCE, CLAIMS FILING & SETTLEMENT TRACKER (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6">

            {/* 1. APPLY FOR INSURANCE FORM */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="h-4.5 w-4.5 text-emerald-600" /> Apply For Insurance Cover
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Secure customized weather and crop protection for your seasonal seeds.</p>
              </div>

              <form onSubmit={handleApplyInsurance} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Select Policy Protocol</label>
                  <select
                    value={applyPolicyType}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setApplyPolicyType(val);
                      if (val === "Livestock") {
                        setApplyCrop("Milch Buffalo (Bovine)");
                      } else {
                        setApplyCrop("Paddy (Rice)");
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="PMFBY">PMFBY Subsidized Cover</option>
                    <option value="Weather-based">Weather-based insurance</option>
                    <option value="Livestock">Livestock insurance</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Crop / Subject</label>
                    <input
                      type="text"
                      value={applyCrop}
                      onChange={(e) => setApplyCrop(e.target.value)}
                      placeholder="e.g. Basmati Paddy"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">
                      {applyPolicyType === "Livestock" ? "Number of Animals" : "Land Area (Acres)"}
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={applyArea}
                      onChange={(e) => setApplyArea(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Sum Insured (₹/{applyPolicyType === "Livestock" ? "Unit" : "Acre"})</label>
                  <input
                    type="number"
                    step={1000}
                    value={applySumInsuredPerAcre}
                    onChange={(e) => setApplySumInsuredPerAcre(Math.max(5000, parseInt(e.target.value) || 5000))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none"
                    required
                  />
                </div>

                {/* Simulated Document Upload */}
                <div className="space-y-1.5">
                  <label className="block text-slate-500 text-[9px] font-bold uppercase">Upload Verification Documents</label>
                  <div className="border border-dashed border-slate-200 rounded-xl p-3.5 text-center bg-slate-50 hover:bg-slate-100/50 transition-colors relative cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg"
                      onChange={handleSimulateApplyDocUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={isUploadingApplyDoc}
                    />
                    <Upload className="h-5 w-5 text-slate-400 mx-auto mb-1.5" />
                    <span className="text-[9.5px] font-extrabold text-slate-600 block uppercase">
                      {isUploadingApplyDoc ? "Uploading Document..." : "Attach Land Registry / Aadhaar"}
                    </span>
                    <span className="text-[8px] text-slate-400 block mt-0.5">PDF or PNG scan files</span>
                  </div>

                  {applyDocs.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {applyDocs.map((doc, idx) => (
                        <span key={idx} className="text-[8px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-150 rounded px-1.5 py-0.5 flex items-center gap-1">
                          ✓ {doc}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subsidized Premium Quote */}
                <div className="bg-slate-900 text-slate-300 rounded-xl p-3 flex justify-between items-center font-mono text-[10px]">
                  <div>
                    <span className="text-slate-400 text-[8px] block uppercase font-sans mb-0.5">Subsidized Premium Levy</span>
                    <span className="text-emerald-400 text-xs font-black">₹{applyFormPremiumOutput.totalPremium.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[8px] block uppercase font-sans mb-0.5">Agg. Coverage</span>
                    <span className="text-white font-bold">₹{applyFormPremiumOutput.totalSumInsured.toLocaleString()}</span>
                  </div>
                </div>

                {applySuccessMsg && (
                  <div className="text-[9px] font-bold p-2 bg-emerald-50 text-emerald-800 border border-emerald-150 rounded leading-relaxed">
                    {applySuccessMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-lg text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow"
                >
                  <DollarSign className="h-4 w-4" /> Pay Premium & Activate Cover
                </button>
              </form>
            </div>

            {/* 2. INSURANCE CLAIMS FILING FORM */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="h-4.5 w-4.5 text-red-600" /> File Insurance Loss Claim
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Initiate emergency claim processing following field or crop damage incidents.</p>
              </div>

              <form onSubmit={handleClaimSubmit} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Select Active Policy Reference</label>
                  <select
                    value={claimPolicyId}
                    onChange={(e) => setClaimPolicyId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {activePolicies.map((pol) => (
                      <option key={pol.id} value={pol.id}>
                        [{pol.id}] {pol.cropName} ({pol.policyType.split(" ")[0]})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Loss Incident & Damage Details</label>
                  <textarea
                    rows={3}
                    value={claimIncident}
                    onChange={(e) => setClaimIncident(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="Provide details about weather anomaly (drought, flood, hail) or veterinary reports, and approx date of loss..."
                    required
                  />
                </div>

                {/* Simulated Proof Document Upload */}
                <div className="space-y-1.5">
                  <label className="block text-slate-500 text-[9px] font-bold uppercase">Upload Verification Proof (Photos/Reports)</label>
                  <div className="border border-dashed border-slate-200 rounded-xl p-3.5 text-center bg-slate-50 hover:bg-slate-100/50 transition-colors relative cursor-pointer">
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,.pdf"
                      onChange={handleSimulateClaimDocUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={isUploadingClaimDoc}
                    />
                    <Upload className="h-5 w-5 text-slate-400 mx-auto mb-1.5" />
                    <span className="text-[9.5px] font-extrabold text-slate-600 block uppercase">
                      {isUploadingClaimDoc ? "Uploading..." : "Attach Crop damage Photo / Vet Cert"}
                    </span>
                    <span className="text-[8px] text-slate-400 block mt-0.5">JPEG, PNG images or PDF surveyor reports</span>
                  </div>

                  {claimProofDocs.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {claimProofDocs.map((doc, idx) => (
                        <span key={idx} className="text-[8px] font-mono font-bold bg-indigo-50 text-indigo-800 border border-indigo-150 rounded px-1.5 py-0.5 flex items-center gap-1">
                          ✓ {doc}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {claimSuccessMsg && (
                  <div className="text-[9px] font-bold p-2.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-150 leading-relaxed">
                    {claimSuccessMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-2.5 rounded-lg text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow"
                >
                  <ShieldAlert className="h-4 w-4" /> File Emergency Claim
                </button>
              </form>
            </div>

            {/* 3. CLAIMS SETTLEMENT TRACKER */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Clock className="h-5 w-5 text-slate-600" />
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Claims Settlement Tracker</h3>
                  <p className="text-[10px] text-slate-400">Track filed claims, field verification progress, and subvention payouts.</p>
                </div>
              </div>

              <div className="space-y-3 font-semibold text-xs text-slate-600">
                {activeClaims.map((claim) => (
                  <div key={claim.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-between gap-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[8px] font-black uppercase text-slate-400 font-mono">Claim ID: {claim.id}</span>
                          <span className="text-[8.5px] font-black uppercase text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                            Cover Sum: ₹{claim.sumInsured.toLocaleString()}
                          </span>
                        </div>
                        <h4 className="text-slate-800 font-extrabold text-[11px] leading-tight">{claim.category}</h4>
                        <p className="text-[9px] text-slate-400 font-mono">Policy Ref: {claim.policyId} • Filed: {claim.filedDate}</p>
                      </div>

                      <div className="text-right font-mono text-[9px] shrink-0">
                        <span className="text-[7.5px] text-slate-400 font-bold uppercase block leading-none">Est. Payout</span>
                        <span className="text-emerald-700 font-black">₹{claim.estimatedSettlement.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-200/50 pt-2 text-[9px]">
                      <span className="text-slate-400">Current Phase:</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                        claim.status === "Settlement Approved"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : claim.status === "Field Inspection Scheduled"
                          ? "bg-amber-50 text-amber-700 border border-amber-100"
                          : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                      }`}>
                        {claim.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
