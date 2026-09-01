import React, { useState, useMemo } from "react";
import {
  Sprout,
  Calculator,
  ShieldCheck,
  CreditCard,
  Building2,
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  Coins,
  TrendingUp,
  Droplets,
  Zap,
  Sparkles,
  Layers,
  ArrowRight,
  RefreshCw,
  QrCode,
  Share2,
  Lock,
  PieChart as PieChartIcon,
  Percent,
  Warehouse,
  Flame,
  BadgeAlert,
  Sliders,
  DollarSign
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CropPrescriptionProfile {
  name: string;
  category: "Cereal" | "Pulse" | "Cash Crop" | "Horticulture" | "Oilseed";
  recommendedNPK: { n: number; p: number; k: number }; // kg per acre
  targetPh: { min: number; max: number };
  durationDays: number;
  expectedYieldTonsPerAcre: number;
  stageSplit: {
    basal: { nPct: number; pPct: number; kPct: number; desc: string };
    vegetative: { nPct: number; pPct: number; kPct: number; desc: string };
    flowering: { nPct: number; pPct: number; kPct: number; desc: string };
  };
  micronutrients: string[];
  organicSubstituteRecommendation: string;
}

const CROP_DATABASE: Record<string, CropPrescriptionProfile> = {
  "Paddy (Basmati / High Yield)": {
    name: "Paddy (Basmati / High Yield)",
    category: "Cereal",
    recommendedNPK: { n: 50, p: 25, k: 25 },
    targetPh: { min: 6.0, max: 7.0 },
    durationDays: 120,
    expectedYieldTonsPerAcre: 3.5,
    stageSplit: {
      basal: { nPct: 33, pPct: 100, kPct: 50, desc: "At final land preparation / transplanting" },
      vegetative: { nPct: 34, pPct: 0, kPct: 0, desc: "Active Tillering (20-25 days after transplanting)" },
      flowering: { nPct: 33, pPct: 0, kPct: 50, desc: "Panicle Initiation (45-50 days after transplanting)" }
    },
    micronutrients: ["Zinc Sulphate (21%) @ 10kg/acre", "Ferrous Sulphate foliar @ 0.5%"],
    organicSubstituteRecommendation: "Apply 2.5 Tons Vermicompost + Azospirillum (2kg) + PSB (2kg) per acre to reduce synthetic urea by 25%."
  },
  "Wheat (HD-2967 / PBW-343)": {
    name: "Wheat (HD-2967 / PBW-343)",
    category: "Cereal",
    recommendedNPK: { n: 60, p: 30, k: 20 },
    targetPh: { min: 6.2, max: 7.5 },
    durationDays: 135,
    expectedYieldTonsPerAcre: 2.8,
    stageSplit: {
      basal: { nPct: 50, pPct: 100, kPct: 100, desc: "At sowing time with seed drill" },
      vegetative: { nPct: 25, pPct: 0, kPct: 0, desc: "First Crown Root Irrigation (21 days)" },
      flowering: { nPct: 25, pPct: 0, kPct: 0, desc: "Boot leaf / Jointing stage (45-50 days)" }
    },
    micronutrients: ["Zinc Sulphate (33%) @ 5kg/acre", "Manganese Sulphate foliar spray"],
    organicSubstituteRecommendation: "Add 3 Tons Farm Yard Manure (FYM) + Trichoderma viride to improve moisture retention and cut DAP requirement by 20%."
  },
  "Cotton (Bt / Long Staple)": {
    name: "Cotton (Bt / Long Staple)",
    category: "Cash Crop",
    recommendedNPK: { n: 60, p: 30, k: 30 },
    targetPh: { min: 6.5, max: 8.0 },
    durationDays: 160,
    expectedYieldTonsPerAcre: 1.8,
    stageSplit: {
      basal: { nPct: 20, pPct: 100, kPct: 50, desc: "Basal application at dibbling" },
      vegetative: { nPct: 40, pPct: 0, kPct: 0, desc: "Square formation stage (45 days)" },
      flowering: { nPct: 40, pPct: 0, kPct: 50, desc: "Boll development stage (75 days)" }
    },
    micronutrients: ["Boron (20%) foliar spray @ 1g/L", "Magnesium Sulphate @ 10kg/acre for red leaf control"],
    organicSubstituteRecommendation: "Neem cake (100kg/acre) + mycorrhizal biofertilizer to enhance boll retention."
  },
  "Sugarcane (Ratoon / Planted)": {
    name: "Sugarcane (Ratoon / Planted)",
    category: "Cash Crop",
    recommendedNPK: { n: 100, p: 40, k: 50 },
    targetPh: { min: 6.5, max: 7.8 },
    durationDays: 330,
    expectedYieldTonsPerAcre: 40,
    stageSplit: {
      basal: { nPct: 25, pPct: 100, kPct: 50, desc: "At set planting / ratoon initiation" },
      vegetative: { nPct: 50, pPct: 0, kPct: 0, desc: "Formative tillering stage (45-90 days)" },
      flowering: { nPct: 25, pPct: 0, kPct: 50, desc: "Grand growth earthing-up stage (120 days)" }
    },
    micronutrients: ["Ferrous Sulphate @ 10kg/acre", "Zinc Sulphate @ 10kg/acre"],
    organicSubstituteRecommendation: "Pressmud compost (5 Tons/acre) + Acetobacter diazotrophicus nitrogen-fixing bioinoculant."
  },
  "Chilli / Tomato (Hybrid Vegetable)": {
    name: "Chilli / Tomato (Hybrid Vegetable)",
    category: "Horticulture",
    recommendedNPK: { n: 75, p: 45, k: 60 },
    targetPh: { min: 6.0, max: 7.0 },
    durationDays: 140,
    expectedYieldTonsPerAcre: 15,
    stageSplit: {
      basal: { nPct: 30, pPct: 100, kPct: 40, desc: "Basal bed preparation" },
      vegetative: { nPct: 35, pPct: 0, kPct: 20, desc: "Vegetative fertigation (30-40 days)" },
      flowering: { nPct: 35, pPct: 0, kPct: 40, desc: "Fruit set and multiple harvests fertigation" }
    },
    micronutrients: ["Calcium Nitrate + Boron 2g/L foliar spray (prevents blossom end rot)", "Chelated Zinc"],
    organicSubstituteRecommendation: "Seaweed extract (Ascophyllum nodosum) + Panchagavya foliar spray weekly."
  },
  "Soybean / Chickpea (Legume)": {
    name: "Soybean / Chickpea (Legume)",
    category: "Pulse",
    recommendedNPK: { n: 15, p: 35, k: 15 },
    targetPh: { min: 6.5, max: 7.5 },
    durationDays: 105,
    expectedYieldTonsPerAcre: 1.2,
    stageSplit: {
      basal: { nPct: 100, pPct: 100, kPct: 100, desc: "100% applied as basal (root nodules fix atmospheric nitrogen)" },
      vegetative: { nPct: 0, pPct: 0, kPct: 0, desc: "Natural nodulation period" },
      flowering: { nPct: 0, pPct: 0, kPct: 0, desc: "1% 19:19:19 foliar spray at pod initiation" }
    },
    micronutrients: ["Ammonium Molybdate seed treatment (crucial for nitrogenase enzyme)", "Sulphur @ 8kg/acre"],
    organicSubstituteRecommendation: "Rhizobium leguminosarum seed inoculation + PSB culture saves 80% synthetic nitrogen."
  }
};

export const PrecisionAgronomyAndFintech: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"npk_prescription" | "kisan_credit_score" | "warehouse_receipt">("npk_prescription");

  // =========================================================================
  // MODULE 1: AI PRECISION NPK SOIL FERTILIZER PRESCRIPTION ENGINE
  // =========================================================================
  const [selectedCropKey, setSelectedCropKey] = useState<string>("Paddy (Basmati / High Yield)");
  const [farmAcres, setFarmAcres] = useState<number>(3.5);
  const [soilN, setSoilN] = useState<number>(180); // kg/ha (Low <280, Med 280-560, High >560)
  const [soilP, setSoilP] = useState<number>(14);  // kg/ha (Low <10, Med 10-25, High >25)
  const [soilK, setSoilK] = useState<number>(190); // kg/ha (Low <120, Med 120-280, High >280)
  const [soilPh, setSoilPh] = useState<number>(6.8);
  const [organicCarbon, setOrganicCarbon] = useState<number>(0.45); // % (Low <0.5, Med 0.5-0.75, High >0.75)
  const [applyOrganicDiscount, setApplyOrganicDiscount] = useState<boolean>(true);
  const [prescriptionGenerated, setPrescriptionGenerated] = useState<boolean>(false);

  const activeCrop = CROP_DATABASE[selectedCropKey] || CROP_DATABASE["Paddy (Basmati / High Yield)"];

  // Soil Nutrient Status Factors
  const soilStatus = useMemo(() => {
    const nRating = soilN < 200 ? "Deficient (-25% rec increase)" : soilN > 350 ? "Surplus (-20% rec reduction)" : "Medium (Optimal)";
    const pRating = soilP < 12 ? "Deficient (+20% rec increase)" : soilP > 25 ? "Surplus (-15% rec reduction)" : "Medium (Optimal)";
    const kRating = soilK < 130 ? "Deficient (+20% rec increase)" : soilK > 250 ? "Surplus (-15% rec reduction)" : "Medium (Optimal)";
    
    // Adjust NPK recommendation based on soil test
    const nFactor = soilN < 200 ? 1.25 : soilN > 350 ? 0.8 : 1.0;
    const pFactor = soilP < 12 ? 1.2 : soilP > 25 ? 0.85 : 1.0;
    const kFactor = soilK < 130 ? 1.2 : soilK > 250 ? 0.85 : 1.0;

    const organicSavingFactor = applyOrganicDiscount ? 0.78 : 1.0; // 22% synthetic reduction if organic bio-inoculants used

    const finalN = Math.round(activeCrop.recommendedNPK.n * nFactor * farmAcres * organicSavingFactor);
    const finalP = Math.round(activeCrop.recommendedNPK.p * pFactor * farmAcres);
    const finalK = Math.round(activeCrop.recommendedNPK.k * kFactor * farmAcres);

    // Fertilizer Bag Equivalents:
    // DAP (18% N, 46% P2O5) -> 1 bag (50kg) has 23kg P2O5 and 9kg N
    const dapBags = Math.ceil(finalP / 23);
    const nFromDAP = dapBags * 9;
    const remainingN = Math.max(0, finalN - nFromDAP);
    // Urea (46% N) -> 1 bag (45kg or 50kg) has 23kg N
    const ureaBags = Math.ceil(remainingN / 23);
    // MOP (60% K2O) -> 1 bag (50kg) has 30kg K2O
    const mopBags = Math.ceil(finalK / 30);

    // Cost Estimations (Standard subsidized rates: Urea ₹268/bag, DAP ₹1,350/bag, MOP ₹1,700/bag)
    const ureaCost = ureaBags * 268;
    const dapCost = dapBags * 1350;
    const mopCost = mopBags * 1700;
    const totalChemicalCost = ureaCost + dapCost + mopCost;
    const organicBioKitCost = applyOrganicDiscount ? Math.round(farmAcres * 480) : 0;
    const netCost = totalChemicalCost + organicBioKitCost;
    const netSaving = applyOrganicDiscount ? Math.round(totalChemicalCost * 0.24) : 0;

    return {
      nRating,
      pRating,
      kRating,
      finalN,
      finalP,
      finalK,
      dapBags,
      ureaBags,
      mopBags,
      ureaCost,
      dapCost,
      mopCost,
      totalChemicalCost,
      organicBioKitCost,
      netCost,
      netSaving
    };
  }, [activeCrop, farmAcres, soilN, soilP, soilK, applyOrganicDiscount]);

  // =========================================================================
  // MODULE 2: KISAN CREDIT SCORE (KCS) & ALTERNATIVE AGRI-LENDING ENGINE
  // =========================================================================
  const [landHoldingAcres, setLandHoldingAcres] = useState<number>(4.2);
  const [satelliteNdviIndex, setSatelliteNdviIndex] = useState<number>(0.74); // 0.2 to 0.9
  const [irrigationCoveragePct, setIrrigationCoveragePct] = useState<number>(90); // 0 to 100%
  const [apmcAnnualTurnover, setApmcAnnualTurnover] = useState<number>(340000); // ₹
  const [cropDiversificationCount, setCropDiversificationCount] = useState<number>(3); // 1 to 5 crops
  const [repaymentTrackRecordYears, setRepaymentTrackRecordYears] = useState<number>(4);
  const [pmfbyInsuranceActive, setPmfbyInsuranceActive] = useState<boolean>(true);
  const [appliedKccLoan, setAppliedKccLoan] = useState<boolean>(false);
  const [disbursedStatus, setDisbursedStatus] = useState<boolean>(false);

  // KCS Score & Eligibility Computation
  const creditUnderwriting = useMemo(() => {
    // 1. NDVI Satellite Vigor (max 250 pts)
    const ndviScore = Math.min(250, Math.round((satelliteNdviIndex / 0.85) * 250));
    // 2. Land & Irrigation Security (max 220 pts)
    const irrigationScore = Math.min(220, Math.round((irrigationCoveragePct / 100) * 160 + (landHoldingAcres > 2 ? 60 : 30)));
    // 3. APMC & B2B Trading Record (max 200 pts)
    const revenueScore = Math.min(200, Math.round((apmcAnnualTurnover / 400000) * 200));
    // 4. Financial Track Record & Insurance (max 180 pts)
    const disciplineScore = Math.min(180, (repaymentTrackRecordYears * 30) + (pmfbyInsuranceActive ? 60 : 0));
    // 5. Crop Diversification (max 50 pts)
    const diversityScore = Math.min(50, cropDiversificationCount * 12);

    const totalScore = Math.min(900, Math.max(300, 300 + Math.round((ndviScore + irrigationScore + revenueScore + disciplineScore + diversityScore) * (600 / 900))));
    
    // Rating Tier
    let ratingTier = "Prime AAA (Very Low Risk)";
    let interestRate = "4.0% (with 3% Prompt Repayment Incentive)";
    let maxLimit = Math.round(landHoldingAcres * 65000 + (apmcAnnualTurnover * 0.35));
    let defaultRecommendedLimit = Math.min(maxLimit, 300000); // Standard KCC limit without collateral

    if (totalScore < 600) {
      ratingTier = "Subprime / Monitored";
      interestRate = "8.5% (Collateral Backed)";
      maxLimit = Math.round(landHoldingAcres * 35000);
      defaultRecommendedLimit = Math.min(maxLimit, 100000);
    } else if (totalScore < 720) {
      ratingTier = "Standard Good";
      interestRate = "7.0% (Standard KCC rate)";
      maxLimit = Math.round(landHoldingAcres * 50000);
      defaultRecommendedLimit = Math.min(maxLimit, 200000);
    }

    return {
      totalScore,
      ratingTier,
      interestRate,
      maxLimit,
      defaultRecommendedLimit,
      subventionSaving: Math.round(defaultRecommendedLimit * 0.03),
      ndviScore,
      irrigationScore,
      revenueScore,
      disciplineScore
    };
  }, [satelliteNdviIndex, irrigationCoveragePct, landHoldingAcres, apmcAnnualTurnover, repaymentTrackRecordYears, pmfbyInsuranceActive, cropDiversificationCount]);

  // =========================================================================
  // MODULE 3: e-NWR WAREHOUSE RECEIPT COMMODITY FINANCING
  // =========================================================================
  const [depositCommodity, setDepositCommodity] = useState<string>("Premium Basmati Paddy (PBW-1121)");
  const [depositQuantityQuintals, setDepositQuantityQuintals] = useState<number>(120); // 120 Quintals = 12 MT
  const [currentSpotPricePerQuintal, setCurrentSpotPricePerQuintal] = useState<number>(3850);
  const [targetExpectedFuturePrice, setTargetExpectedFuturePrice] = useState<number>(4700);
  const [storageMonths, setStorageMonths] = useState<number>(3);
  const [pledgeLoanTaken, setPledgeLoanTaken] = useState<boolean>(false);

  const warehouseFinancing = useMemo(() => {
    const totalHarvestValue = depositQuantityQuintals * currentSpotPricePerQuintal;
    const maxPledgeLoan = Math.round(totalHarvestValue * 0.70); // 70% LTV
    const monthlyWarehouseRent = depositQuantityQuintals * 14; // ₹14/quintal/month
    const totalRent = monthlyWarehouseRent * storageMonths;
    const loanInterestRate = 0.07; // 7% p.a.
    const pledgeInterest = Math.round(maxPledgeLoan * (loanInterestRate / 12) * storageMonths);

    const futureHarvestValue = depositQuantityQuintals * targetExpectedFuturePrice;
    const grossPriceGain = futureHarvestValue - totalHarvestValue;
    const netProfitGainAfterStorage = grossPriceGain - totalRent - pledgeInterest;

    return {
      totalHarvestValue,
      maxPledgeLoan,
      monthlyWarehouseRent,
      totalRent,
      pledgeInterest,
      futureHarvestValue,
      grossPriceGain,
      netProfitGainAfterStorage,
      roiPct: Math.round((netProfitGainAfterStorage / totalHarvestValue) * 100)
    };
  }, [depositQuantityQuintals, currentSpotPricePerQuintal, targetExpectedFuturePrice, storageMonths]);

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden border border-emerald-500/20">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold border border-emerald-500/30">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              <span>Real-World Agricultural Technology & Fintech Suite</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display text-white">
              AI Precision Agronomy & Agri-Fintech Hub
            </h2>
            <p className="text-xs md:text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
              Cutting-edge real-world agritech modules: Soil Health Card to NPK Fertilizer Prescription, Satellite-Driven Alternative Kisan Credit Score (KCS) underwriting, and e-NWR Electronic Warehouse Receipt pledge financing.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 shrink-0 text-center">
            <div className="p-2">
              <p className="text-[10px] text-emerald-200 font-bold uppercase">Fertilizer Saved</p>
              <p className="text-lg font-black text-white">24%</p>
              <p className="text-[9px] text-emerald-300">Bio-Opt</p>
            </div>
            <div className="p-2 border-x border-white/10">
              <p className="text-[10px] text-emerald-200 font-bold uppercase">KCS Credit</p>
              <p className="text-lg font-black text-amber-300">{creditUnderwriting.totalScore}</p>
              <p className="text-[9px] text-emerald-300">Out of 900</p>
            </div>
            <div className="p-2">
              <p className="text-[10px] text-emerald-200 font-bold uppercase">e-NWR Advance</p>
              <p className="text-lg font-black text-white">70% LTV</p>
              <p className="text-[9px] text-emerald-300">Zero Distress</p>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-white/10">
          <button
            onClick={() => setActiveTab("npk_prescription")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "npk_prescription"
                ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                : "bg-white/10 text-emerald-100 hover:bg-white/20"
            }`}
          >
            <Sprout className="h-4 w-4" />
            <span>AI Precision Soil & NPK Prescription</span>
          </button>

          <button
            onClick={() => setActiveTab("kisan_credit_score")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "kisan_credit_score"
                ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20"
                : "bg-white/10 text-amber-100 hover:bg-white/20"
            }`}
          >
            <CreditCard className="h-4 w-4" />
            <span>Kisan Credit Score (KCS) & Loan Engine</span>
          </button>

          <button
            onClick={() => setActiveTab("warehouse_receipt")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "warehouse_receipt"
                ? "bg-sky-400 text-slate-950 shadow-lg shadow-sky-400/20"
                : "bg-white/10 text-sky-100 hover:bg-white/20"
            }`}
          >
            <Warehouse className="h-4 w-4" />
            <span>e-NWR Warehouse Receipt Pledge Financing</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: AI PRECISION NPK FERTILIZER PRESCRIPTION ENGINE */}
      {/* ========================================================================= */}
      {activeTab === "npk_prescription" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Input Parameter Form */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">Soil Health Card & Crop Setup</h3>
                    <p className="text-[11px] text-slate-400">Calibrated against ICAR & Soil Science norms</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Live Calculator
                </span>
              </div>

              {/* Crop Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Target Crop Commodity</span>
                  <span className="text-[10px] text-slate-400 font-normal">{activeCrop.category}</span>
                </label>
                <select
                  value={selectedCropKey}
                  onChange={(e) => setSelectedCropKey(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-emerald-500 cursor-pointer"
                >
                  {Object.keys(CROP_DATABASE).map((crop) => (
                    <option key={crop} value={crop}>
                      {crop}
                    </option>
                  ))}
                </select>
              </div>

              {/* Acreage Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Cultivation Area (Acres)</span>
                  <span className="text-emerald-700 font-extrabold">{farmAcres} Acres ({(farmAcres * 0.4046).toFixed(2)} Ha)</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="25"
                  step="0.5"
                  value={farmAcres}
                  onChange={(e) => setFarmAcres(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0.5 Acre</span>
                  <span>10 Acres</span>
                  <span>25 Acres</span>
                </div>
              </div>

              {/* Soil Test Readings Grid */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">Soil Test Matrix (From Lab/IoT)</h4>
                  <button
                    type="button"
                    onClick={() => {
                      setSoilN(195);
                      setSoilP(11);
                      setSoilK(140);
                      setSoilPh(6.7);
                    }}
                    className="text-[10px] text-emerald-700 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" /> Auto-fill Soil Card
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Nitrogen (N) */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-700">
                      <span>Available N (kg/ha)</span>
                      <span className="text-emerald-700">{soilN}</span>
                    </div>
                    <input
                      type="number"
                      value={soilN}
                      onChange={(e) => setSoilN(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono font-bold"
                    />
                    <p className="text-[9px] text-slate-500">{soilStatus.nRating}</p>
                  </div>

                  {/* Phosphorus (P) */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-700">
                      <span>Available P (kg/ha)</span>
                      <span className="text-emerald-700">{soilP}</span>
                    </div>
                    <input
                      type="number"
                      value={soilP}
                      onChange={(e) => setSoilP(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono font-bold"
                    />
                    <p className="text-[9px] text-slate-500">{soilStatus.pRating}</p>
                  </div>

                  {/* Potassium (K) */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-700">
                      <span>Available K (kg/ha)</span>
                      <span className="text-emerald-700">{soilK}</span>
                    </div>
                    <input
                      type="number"
                      value={soilK}
                      onChange={(e) => setSoilK(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono font-bold"
                    />
                    <p className="text-[9px] text-slate-500">{soilStatus.kRating}</p>
                  </div>

                  {/* pH & Organic Carbon */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-700">
                      <span>Soil pH</span>
                      <span className="text-emerald-700">{soilPh}</span>
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      value={soilPh}
                      onChange={(e) => setSoilPh(parseFloat(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono font-bold"
                    />
                    <p className="text-[9px] text-slate-500">{soilPh < 6.5 ? "Slightly Acidic" : soilPh > 7.5 ? "Alkaline" : "Near Neutral"}</p>
                  </div>
                </div>
              </div>

              {/* Bio-Fertilizer Integrated Management Switch */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  <div>
                    <p className="text-xs font-extrabold text-emerald-900">Integrate Organic Bio-Inoculants</p>
                    <p className="text-[10px] text-emerald-700">Cuts chemical urea by 22% & adds soil microbes</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={applyOrganicDiscount}
                  onChange={(e) => setApplyOrganicDiscount(e.target.checked)}
                  className="h-4 w-4 accent-emerald-600 cursor-pointer"
                />
              </div>

              <button
                type="button"
                onClick={() => setPrescriptionGenerated(true)}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-emerald-900/10 cursor-pointer transition-all"
              >
                <FileText className="h-4 w-4" />
                Generate Precision Rx Fertilizer Sheet
              </button>
            </div>
          </div>

          {/* Right Column: Dynamic Precision Prescription Output */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-black text-slate-900 text-base font-display">
                    Agronomic Fertilizer Prescription Sheet
                  </h3>
                  <p className="text-xs text-slate-500">
                    Target: {activeCrop.name} for {farmAcres} Acres | Yield Goal: {(activeCrop.expectedYieldTonsPerAcre * farmAcres).toFixed(1)} MT
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Print PDF Rx
                  </button>
                </div>
              </div>

              {/* Fertilizer Bag Requirements Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* DAP / P2O5 */}
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-black text-amber-900 uppercase">DAP (18-46-0)</span>
                    <span className="text-[10px] bg-amber-200/80 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                      Phosphorus
                    </span>
                  </div>
                  <p className="text-2xl font-black text-amber-900 font-mono">
                    {soilStatus.dapBags} <span className="text-xs font-normal">Bags (50kg)</span>
                  </p>
                  <div className="text-[11px] text-amber-800 space-y-0.5">
                    <p>Total P2O5: {soilStatus.finalP} kg</p>
                    <p className="font-bold">Est Cost: ₹{soilStatus.dapCost.toLocaleString()}</p>
                  </div>
                </div>

                {/* Urea / Nitrogen */}
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-black text-emerald-900 uppercase">Urea (46% N)</span>
                    <span className="text-[10px] bg-emerald-200/80 text-emerald-900 font-bold px-1.5 py-0.5 rounded">
                      Nitrogen
                    </span>
                  </div>
                  <p className="text-2xl font-black text-emerald-900 font-mono">
                    {soilStatus.ureaBags} <span className="text-xs font-normal">Bags (45kg)</span>
                  </p>
                  <div className="text-[11px] text-emerald-800 space-y-0.5">
                    <p>Total N: {soilStatus.finalN} kg</p>
                    <p className="font-bold">Est Cost: ₹{soilStatus.ureaCost.toLocaleString()}</p>
                  </div>
                </div>

                {/* MOP / Potash */}
                <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-black text-rose-900 uppercase">MOP (60% K2O)</span>
                    <span className="text-[10px] bg-rose-200/80 text-rose-900 font-bold px-1.5 py-0.5 rounded">
                      Potassium
                    </span>
                  </div>
                  <p className="text-2xl font-black text-rose-900 font-mono">
                    {soilStatus.mopBags} <span className="text-xs font-normal">Bags (50kg)</span>
                  </p>
                  <div className="text-[11px] text-rose-800 space-y-0.5">
                    <p>Total K2O: {soilStatus.finalK} kg</p>
                    <p className="font-bold">Est Cost: ₹{soilStatus.mopCost.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Application Timeline Split */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                  <Sliders className="h-4 w-4 text-slate-500" />
                  Split Application Schedule (Prevents Leaching & Runoff)
                </h4>

                <div className="space-y-2">
                  {/* Stage 1: Basal */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-slate-200 text-slate-800 font-black px-1.5 py-0.5 rounded">
                          Basal (Day 0)
                        </span>
                        <span className="text-xs font-bold text-slate-800">{activeCrop.stageSplit.basal.desc}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Apply: 100% of DAP ({soilStatus.dapBags} bags) + 50% MOP ({Math.ceil(soilStatus.mopBags * 0.5)} bags) + {Math.ceil(soilStatus.ureaBags * (activeCrop.stageSplit.basal.nPct / 100))} bags Urea
                      </p>
                    </div>
                    <span className="text-xs font-black text-emerald-700 font-mono">Stage 1</span>
                  </div>

                  {/* Stage 2: Vegetative */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.5 rounded">
                          Tillering / Vegetative
                        </span>
                        <span className="text-xs font-bold text-slate-800">{activeCrop.stageSplit.vegetative.desc}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Top dress: {Math.ceil(soilStatus.ureaBags * (activeCrop.stageSplit.vegetative.nPct / 100))} bags Urea in moist soil before light irrigation
                      </p>
                    </div>
                    <span className="text-xs font-black text-emerald-700 font-mono">Stage 2</span>
                  </div>

                  {/* Stage 3: Flowering */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-black px-1.5 py-0.5 rounded">
                          Panicle / Flowering
                        </span>
                        <span className="text-xs font-bold text-slate-800">{activeCrop.stageSplit.flowering.desc}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Apply: Remaining {Math.floor(soilStatus.ureaBags * (activeCrop.stageSplit.flowering.nPct / 100))} bags Urea + Remaining MOP
                      </p>
                    </div>
                    <span className="text-xs font-black text-emerald-700 font-mono">Stage 3</span>
                  </div>
                </div>
              </div>

              {/* Micronutrients & Bio-Savings Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-900">
                    <Droplets className="h-4 w-4 text-indigo-600" />
                    <span>Essential Micronutrient Additions</span>
                  </div>
                  <ul className="text-[11px] text-indigo-800 space-y-1 list-disc pl-4">
                    {activeCrop.micronutrients.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-emerald-900 flex items-center gap-1">
                      <Coins className="h-4 w-4 text-emerald-600" />
                      Economics & Savings
                    </span>
                    {applyOrganicDiscount && (
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.2 rounded">
                        -24% Cost Cut
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-emerald-950">
                    Total Input Outlay: <span className="font-bold">₹{soilStatus.netCost.toLocaleString()}</span>
                  </p>
                  {applyOrganicDiscount && (
                    <p className="text-[11px] text-emerald-700 font-semibold">
                      Farmer Saves: <span className="font-bold">₹{soilStatus.netSaving.toLocaleString()}</span> vs unoptimized chemical flooding!
                    </p>
                  )}
                  <p className="text-[10px] text-slate-500 italic mt-1">
                    {activeCrop.organicSubstituteRecommendation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: KISAN CREDIT SCORE (KCS) & INSTANT AGRI-LENDING ENGINE */}
      {/* ========================================================================= */}
      {activeTab === "kisan_credit_score" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Underwriting Parameters Panel */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">Alternative Agri-Credit Risk Model</h3>
                    <p className="text-[11px] text-slate-400">Satellite NDVI, Geo-Land & APMC Data Underwriting</p>
                  </div>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                  AI FinTech
                </span>
              </div>

              {/* Satellite NDVI Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Satellite Crop Health (NDVI Index)</span>
                  <span className="text-emerald-700 font-extrabold">{satelliteNdviIndex} (Dense Healthy Vigor)</span>
                </div>
                <input
                  type="range"
                  min="0.30"
                  max="0.90"
                  step="0.02"
                  value={satelliteNdviIndex}
                  onChange={(e) => setSatelliteNdviIndex(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0.30 (Stressed)</span>
                  <span>0.60 (Moderate)</span>
                  <span>0.90 (Excellent)</span>
                </div>
              </div>

              {/* Landholding and Irrigation */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Land Title (Acres)</label>
                  <input
                    type="number"
                    value={landHoldingAcres}
                    onChange={(e) => setLandHoldingAcres(parseFloat(e.target.value) || 1)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Irrigation Security (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={irrigationCoveragePct}
                    onChange={(e) => setIrrigationCoveragePct(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
              </div>

              {/* APMC Revenue & Repayment History */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Annual APMC Sales (₹)</label>
                  <input
                    type="number"
                    value={apmcAnnualTurnover}
                    onChange={(e) => setApmcAnnualTurnover(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Clean Loan Repayment (Yrs)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={repaymentTrackRecordYears}
                    onChange={(e) => setRepaymentTrackRecordYears(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
              </div>

              {/* Crop Insurance Verification */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <div>
                    <p className="text-xs font-extrabold text-slate-800">PMFBY Crop Insurance Enrolled</p>
                    <p className="text-[10px] text-slate-500">Adds +60 credit points to risk score</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={pmfbyInsuranceActive}
                  onChange={(e) => setPmfbyInsuranceActive(e.target.checked)}
                  className="h-4 w-4 accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl space-y-1 text-xs text-amber-900">
                <p className="font-bold flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-amber-600" />
                  Kisan Credit Card (KCC) Subvention Benefit
                </p>
                <p className="text-[11px] text-amber-800">
                  Government provides 2% standard interest subsidy + 3% prompt repayment incentive, reducing effective farmer loan cost to just 4.0% p.a.
                </p>
              </div>
            </div>
          </div>

          {/* Underwriting Decision & Digital Sanction Card */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-black text-slate-900 text-base font-display">
                    Kisan Credit Score & Loan Eligibility
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real-time automated credit underwriting decision generated in 850ms
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full border border-emerald-300">
                    {creditUnderwriting.ratingTier}
                  </span>
                </div>
              </div>

              {/* Score Gauge & Limit Banner */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-linear-to-br from-slate-900 to-slate-800 text-white rounded-3xl space-y-3 relative overflow-hidden">
                  <div className="absolute right-2 top-2 opacity-10">
                    <ShieldCheck className="h-28 w-28 text-white" />
                  </div>
                  <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">Kisan Credit Score (KCS)</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white font-mono">{creditUnderwriting.totalScore}</span>
                    <span className="text-xs text-slate-400 font-bold">/ 900</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-linear-to-r from-amber-400 to-emerald-400 h-2 rounded-full transition-all duration-700"
                      style={{ width: `${(creditUnderwriting.totalScore / 900) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-300">
                    Top 8% credit profile in regional agro-cluster. Eligible for zero-collateral credit limit.
                  </p>
                </div>

                <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-3xl space-y-2">
                  <p className="text-xs font-black text-emerald-900 uppercase">Pre-Approved KCC Credit Line</p>
                  <p className="text-3xl font-black text-emerald-950 font-mono">
                    ₹{creditUnderwriting.defaultRecommendedLimit.toLocaleString()}
                  </p>
                  <div className="text-xs text-emerald-800 space-y-0.5">
                    <p>• Interest Rate: <span className="font-bold text-emerald-900">{creditUnderwriting.interestRate}</span></p>
                    <p>• Annual Subvention Saving: <span className="font-bold text-emerald-900">₹{creditUnderwriting.subventionSaving.toLocaleString()}</span></p>
                    <p>• Tenure: <span className="font-bold">12 Months Revolving (Crop Cycle)</span></p>
                  </div>
                </div>
              </div>

              {/* Credit Risk Factor Decomposition */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                  Underwriting Feature Importance
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">NDVI Satellite</p>
                    <p className="text-sm font-black text-slate-800">{creditUnderwriting.ndviScore}/250</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Irrigation Security</p>
                    <p className="text-sm font-black text-slate-800">{creditUnderwriting.irrigationScore}/220</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">APMC Settlement</p>
                    <p className="text-sm font-black text-slate-800">{creditUnderwriting.revenueScore}/200</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Loan Track Record</p>
                    <p className="text-sm font-black text-slate-800">{creditUnderwriting.disciplineScore}/180</p>
                  </div>
                </div>
              </div>

              {/* Digital Sanction & DBT Disbursement Flow */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-emerald-400" />
                    <div>
                      <p className="text-xs font-black text-white">AgriConnect Partner Bank Sanction Terminal</p>
                      <p className="text-[10px] text-slate-400">NABARD & RBI Regulated Digital Lending Protocol</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                    <Lock className="h-3.5 w-3.5" />
                    <span>256-bit Encrypted</span>
                  </div>
                </div>

                {disbursedStatus ? (
                  <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-center space-y-2">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
                    <p className="font-black text-sm text-emerald-300">
                      ₹{creditUnderwriting.defaultRecommendedLimit.toLocaleString()} Disbursed Successfully!
                    </p>
                    <p className="text-xs text-slate-300">
                      Transferred directly via DBT to Farmer Bank Account: **** **** 4892 (State Bank of India). KCC Card tokenized for agricultural merchant POS purchases.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => setDisbursedStatus(true)}
                      className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg"
                    >
                      <Coins className="h-4 w-4" />
                      Instant 1-Click DBT Loan Disbursement
                    </button>
                    <button
                      type="button"
                      onClick={() => alert(`Digital Sanction Letter #${Math.floor(100000 + Math.random() * 900000)} generated with NABARD verification QR!`)}
                      className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="h-4 w-4" />
                      Download Sanction Letter
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: e-NWR ELECTRONIC WAREHOUSE RECEIPT & COMMODITY FINANCING */}
      {/* ========================================================================= */}
      {activeTab === "warehouse_receipt" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Warehouse Deposit Configuration */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-sky-50 text-sky-700 rounded-xl">
                    <Warehouse className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">WDRA Certified Warehouse Terminal</h3>
                    <p className="text-[11px] text-slate-400">Electronic Negotiable Warehouse Receipts (e-NWR)</p>
                  </div>
                </div>
                <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full">
                  Zero Distress Sale
                </span>
              </div>

              {/* Commodity Selector */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Stored Harvest Commodity</label>
                <select
                  value={depositCommodity}
                  onChange={(e) => setDepositCommodity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 cursor-pointer"
                >
                  <option value="Premium Basmati Paddy (PBW-1121)">Premium Basmati Paddy (PBW-1121)</option>
                  <option value="Certified Milling Wheat (HD-2967)">Certified Milling Wheat (HD-2967)</option>
                  <option value="Non-GMO Feed Maize / Corn">Non-GMO Feed Maize / Corn</option>
                  <option value="Organic Soybean Yellow Dent">Organic Soybean Yellow Dent</option>
                  <option value="Long Staple Cotton Bales">Long Staple Cotton Bales</option>
                </select>
              </div>

              {/* Quantity Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Harvest Volume Deposited</span>
                  <span className="text-sky-700 font-extrabold">{depositQuantityQuintals} Quintals ({(depositQuantityQuintals / 10).toFixed(1)} MT)</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="10"
                  value={depositQuantityQuintals}
                  onChange={(e) => setDepositQuantityQuintals(parseInt(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>20 Qtl (2 MT)</span>
                  <span>250 Qtl (25 MT)</span>
                  <span>500 Qtl (50 MT)</span>
                </div>
              </div>

              {/* Pricing & Timeframe Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Current Spot Rate (₹/Qtl)</label>
                  <input
                    type="number"
                    value={currentSpotPricePerQuintal}
                    onChange={(e) => setCurrentSpotPricePerQuintal(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold font-mono"
                  />
                  <p className="text-[9px] text-rose-500">Post-harvest low price</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Expected Peak Rate (₹/Qtl)</label>
                  <input
                    type="number"
                    value={targetExpectedFuturePrice}
                    onChange={(e) => setTargetExpectedFuturePrice(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold font-mono"
                  />
                  <p className="text-[9px] text-emerald-600">+22% Lean Season Peak</p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Storage Duration in Cold Silo</span>
                  <span className="text-sky-700 font-extrabold">{storageMonths} Months</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="9"
                  step="1"
                  value={storageMonths}
                  onChange={(e) => setStorageMonths(parseInt(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              <div className="p-3 bg-sky-50 border border-sky-200 rounded-2xl text-xs text-sky-900 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <QrCode className="h-4 w-4 text-sky-600" />
                  Tokenized Electronic Warehouse Receipt
                </p>
                <p className="text-[11px] text-sky-800">
                  WDRA e-NWR eliminates physical receipt fraud and allows immediate electronic pledge with leading agricultural banks.
                </p>
              </div>
            </div>
          </div>

          {/* e-NWR Pledge Financing & Market Timing Matrix */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-black text-slate-900 text-base font-display">
                    e-NWR Post-Harvest Value Optimizer
                  </h3>
                  <p className="text-xs text-slate-500">
                    Avoid distress selling: unlock 70% cash now and capture lean season market peaks
                  </p>
                </div>
                <span className="text-xs font-black px-3 py-1 bg-sky-100 text-sky-900 rounded-full">
                  WDRA Approved
                </span>
              </div>

              {/* Bento Comparison: Distress Sale vs e-NWR Stored Sale */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Distress Sale (Immediate) */}
                <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-2">
                  <p className="text-xs font-black text-rose-900 uppercase">Scenario A: Immediate Distress Sale</p>
                  <p className="text-2xl font-black text-rose-950 font-mono">
                    ₹{warehouseFinancing.totalHarvestValue.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-rose-800 leading-relaxed">
                    Sold at mandi harvest glut for ₹{currentSpotPricePerQuintal}/Qtl. Zero storage cost, but loses all future seasonal price appreciation.
                  </p>
                </div>

                {/* Stored + e-NWR Pledge Financing */}
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-black text-emerald-900 uppercase">Scenario B: e-NWR Smart Storage</p>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.5 rounded">
                      +{warehouseFinancing.roiPct}% Gain
                    </span>
                  </div>
                  <p className="text-2xl font-black text-emerald-950 font-mono">
                    ₹{warehouseFinancing.futureHarvestValue.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Net Profit after {storageMonths}mo storage (₹{warehouseFinancing.totalRent.toLocaleString()}) and pledge interest (₹{warehouseFinancing.pledgeInterest.toLocaleString()}): <span className="font-bold text-emerald-950">+₹{warehouseFinancing.netProfitGainAfterStorage.toLocaleString()} extra profit</span>!
                  </p>
                </div>
              </div>

              {/* Instant Pledge Loan Terminal */}
              <div className="p-5 bg-linear-to-r from-sky-950 to-slate-900 text-white rounded-3xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <p className="text-xs font-bold text-sky-400 uppercase tracking-wider">Instant Pledge Advance (70% LTV)</p>
                    <p className="text-3xl font-black text-white font-mono">
                      ₹{warehouseFinancing.maxPledgeLoan.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-left sm:text-right text-xs text-sky-200">
                    <p>Interest: <span className="font-bold text-white">7.0% p.a.</span></p>
                    <p>Commodity Collateral: <span className="font-bold text-white">{depositQuantityQuintals} Qtl e-NWR</span></p>
                  </div>
                </div>

                {pledgeLoanTaken ? (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-center text-xs text-emerald-300 font-bold space-y-1">
                    <p>✓ Electronic Pledge Completed! ₹{warehouseFinancing.maxPledgeLoan.toLocaleString()} credited to Farmer Account.</p>
                    <p className="text-[10px] text-slate-300 font-normal">
                      Automated price alert set for ₹{targetExpectedFuturePrice}/Qtl. Warehouse will auto-liquidate on buyer e-mandate upon market target trigger.
                    </p>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setPledgeLoanTaken(true)}
                      className="w-full py-3 bg-sky-400 hover:bg-sky-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-sky-400/20"
                    >
                      <Coins className="h-4 w-4" />
                      Avail Instant e-NWR Pledge Loan (₹{warehouseFinancing.maxPledgeLoan.toLocaleString()})
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
