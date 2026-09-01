import React, { useState, useMemo } from "react";
import {
  Globe,
  Calculator,
  Leaf,
  TrendingUp,
  Award,
  Link,
  Shield,
  FileText,
  DollarSign,
  Plus,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Users,
  Download,
  Flame,
  CheckCircle,
  Clock,
  ChevronRight,
  TrendingDown,
  Info,
  Layers,
  Sprout,
  Workflow
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend
} from "recharts";

interface CarbonProject {
  id: string;
  practice: string;
  category: "Agroforestry" | "Soil Organic Carbon" | "Methane Reduction" | "Forest Farming";
  estimatedCredits: number;
  unverifiedBags: number;
  verifiedCredits: number;
  adopted: boolean;
  costEstimate: string;
  impactMetrics: string;
}

interface CorporateBuyer {
  id: string;
  companyName: string;
  sector: string;
  requestedCredits: number;
  bidPricePerTon: number;
  verifiedOnly: boolean;
}

interface LedgerTx {
  txId: string;
  timestamp: string;
  type: "Generation" | "Audit" | "Verification" | "Sale";
  creditsCount: number;
  status: "Completed" | "Pending Audit" | "Verified on Ledger";
  blockHeight: number;
}

export default function CarbonCreditMarketplace() {
  // --- STATE FOR CALCULATOR INPUTS ---
  const [agroforestryTrees, setAgroforestryTrees] = useState<number>(350);
  const [soilCarbonPercent, setSoilCarbonPercent] = useState<number>(2.4); // % Soil Organic Carbon
  const [biomassAreaHectares, setBiomassAreaHectares] = useState<number>(4.5);
  const [methaneMitigationAdopted, setMethaneMitigationAdopted] = useState<boolean>(true); // livestock methane
  const [totalLandArea, setTotalLandArea] = useState<number>(12); // Hectares

  // --- MARKET STUFF ---
  const [availableCreditsToSell, setAvailableCreditsToSell] = useState<number>(42.5);
  const [totalRevenueEarned, setTotalRevenueEarned] = useState<number>(1850); // USD (approx ₹1.5L)
  const [selectedExchange, setSelectedExchange] = useState<string>("Gold Standard");

  // --- BLOCKCHAIN LEDGER STATE ---
  const [blockchainLedger, setBlockchainLedger] = useState<LedgerTx[]>([
    { txId: "0x8fa4b...92ce", timestamp: "Today 08:15 UTC", type: "Verification", creditsCount: 15, status: "Verified on Ledger", blockHeight: 142095 },
    { txId: "0x7c91e...110a", timestamp: "Yesterday", type: "Sale", creditsCount: 20, status: "Completed", blockHeight: 141940 },
    { txId: "0x3ddf2...b84f", timestamp: "June 24, 2026", type: "Generation", creditsCount: 12.5, status: "Verified on Ledger", blockHeight: 141200 },
    { txId: "0x1aa44...df88", timestamp: "June 18, 2026", type: "Audit", creditsCount: 10, status: "Pending Audit", blockHeight: 140510 }
  ]);

  // --- ADOPTABLE SUSTAINABLE PRACTICES ---
  const [sustainablePractices, setSustainablePractices] = useState<CarbonProject[]>([
    {
      id: "prac-1",
      practice: "Deep-Rooted Agroforestry Buffer Strips",
      category: "Agroforestry",
      estimatedCredits: 12.5,
      unverifiedBags: 15,
      verifiedCredits: 0,
      adopted: true,
      costEstimate: "₹25,000 Setup",
      impactMetrics: "Provides deep organic carbon reserves & prevents water logging."
    },
    {
      id: "prac-2",
      practice: "Biochar Soil Dressing & Green Fallow Rotation",
      category: "Soil Organic Carbon",
      estimatedCredits: 15,
      unverifiedBags: 20,
      verifiedCredits: 12.5,
      adopted: true,
      costEstimate: "₹12,000 Setup",
      impactMetrics: "Increases overall moisture retention & sequesters carbon for up to 100 years."
    },
    {
      id: "prac-3",
      practice: "Livestock Feed Methane Inhibitors & Anaerobic Digesters",
      category: "Methane Reduction",
      estimatedCredits: 18.2,
      unverifiedBags: 18,
      verifiedCredits: 15,
      adopted: false,
      costEstimate: "₹45,000 Setup",
      impactMetrics: "Reduces bovine enteric methane outputs by up to 35% using organic supplements."
    },
    {
      id: "prac-4",
      practice: "Boundary Canopy Forest Farming Integration",
      category: "Forest Farming",
      estimatedCredits: 22.4,
      unverifiedBags: 25,
      verifiedCredits: 0,
      adopted: false,
      costEstimate: "₹60,005 Setup",
      impactMetrics: "Integrates tall teak or mango shade trees over multi-tier cropping environments."
    }
  ]);

  // --- CORPORATE BID BUYERS PLATFORM ---
  const [corporateBuyers, setCorporateBuyers] = useState<CorporateBuyer[]>([
    { id: "corp-1", companyName: "Tata Power Renewables", sector: "Energy Infrastructure", requestedCredits: 100, bidPricePerTon: 45, verifiedOnly: true },
    { id: "corp-2", companyName: "Infosys GreenTech Initiative", sector: "Software Systems", requestedCredits: 50, bidPricePerTon: 42, verifiedOnly: true },
    { id: "corp-3", companyName: "Reliance Industries Net-Zero Fund", sector: "Petroleum & retail conglomerate", requestedCredits: 250, bidPricePerTon: 40, verifiedOnly: false },
    { id: "corp-4", companyName: "ITC Sustainable Agri-Purchasing", sector: "FMCG Products", requestedCredits: 80, bidPricePerTon: 48, verifiedOnly: true }
  ]);

  // --- HISTORIC EXCHANGE PRICES SERIES (Carbon Exchanges) ---
  const priceHistory = useMemo(() => [
    { month: "Jan", CER_Gold: 32, VER_Verified: 28, Voluntary_Avg: 25 },
    { month: "Feb", CER_Gold: 34, VER_Verified: 29, Voluntary_Avg: 27 },
    { month: "Mar", CER_Gold: 37, VER_Verified: 32, Voluntary_Avg: 29 },
    { month: "Apr", CER_Gold: 41, VER_Verified: 35, Voluntary_Avg: 31 },
    { month: "May", CER_Gold: 44, VER_Verified: 39, Voluntary_Avg: 35 },
    { month: "Jun", CER_Gold: 48, VER_Verified: 42, Voluntary_Avg: 38 }
  ], []);

  // --- LIVE SEQUESTRATION CALCULATIONS ---
  const calculatedMetrics = useMemo(() => {
    // 1 Tree sequests approx 21.8 kg (0.0218 metric tons) of CO2 per year
    const agroforestrySec = (agroforestryTrees * 0.0218);
    
    // Soil organic carbon sequestration: landArea * soilCarbonPercent * constant
    const soilSec = (totalLandArea * (soilCarbonPercent / 100) * 1.5);
    
    // Biomass sequestration: biomassArea * constant
    const biomassSec = (biomassAreaHectares * 2.1);
    
    // Livestock methane mitigation credits
    const methaneSec = methaneMitigationAdopted ? 5.2 : 0;

    // Gross Footprint estimation: baseline footprint minus sequestration
    // Standard baseline footprint: landArea * constant
    const grossFootprint = Math.max(1.2, totalLandArea * 0.85 - (methaneMitigationAdopted ? 2.5 : 0));
    
    const grossSequestration = agroforestrySec + soilSec + biomassSec + methaneSec;
    const netCarbonBalance = grossSequestration - grossFootprint;
    
    // 1 Ton Net Sequestration = 1 Carbon Credit
    const simulatedCreditsGenerated = Math.max(0, parseFloat(netCarbonBalance.toFixed(2)));

    return {
      agroforestrySec: parseFloat(agroforestrySec.toFixed(2)),
      soilSec: parseFloat(soilSec.toFixed(2)),
      biomassSec: parseFloat(biomassSec.toFixed(2)),
      methaneSec: parseFloat(methaneSec.toFixed(2)),
      grossFootprint: parseFloat(grossFootprint.toFixed(2)),
      grossSequestration: parseFloat(grossSequestration.toFixed(2)),
      netCarbonBalance: parseFloat(netCarbonBalance.toFixed(2)),
      simulatedCreditsGenerated
    };
  }, [agroforestryTrees, soilCarbonPercent, biomassAreaHectares, methaneMitigationAdopted, totalLandArea]);

  // --- ADOPT PRACTICE HANDLER ---
  const handleAdoptPractice = (id: string, category: string, credits: number) => {
    setSustainablePractices(prev =>
      prev.map(p => {
        if (p.id === id) {
          return { ...p, adopted: true };
        }
        return p;
      })
    );

    // Dynamically adjust inputs
    if (category === "Agroforestry") {
      setAgroforestryTrees(prev => prev + 250);
    } else if (category === "Soil Organic Carbon") {
      setSoilCarbonPercent(prev => parseFloat((prev + 0.5).toFixed(1)));
    } else if (category === "Methane Reduction") {
      setMethaneMitigationAdopted(true);
    } else if (category === "Forest Farming") {
      setBiomassAreaHectares(prev => prev + 2.5);
    }

    // Add generated ledger tx
    const nextBlock = blockchainLedger[0].blockHeight + Math.floor(Math.random() * 50 + 10);
    const newTx: LedgerTx = {
      txId: "0x" + Math.floor(Math.random() * 1000000).toString(16) + "...abcd",
      timestamp: "Just Now",
      type: "Generation",
      creditsCount: credits,
      status: "Pending Audit",
      blockHeight: nextBlock
    };
    setBlockchainLedger([newTx, ...blockchainLedger]);

    alert(`Successfully adopted practice: ${category}! Your simulated farm physical parameters have been updated, and a credits verification order is logged.`);
  };

  // --- SELL CREDITS TO CORPORATES ---
  const handleSellCredits = (buyerId: string, bidPrice: number, company: string) => {
    if (availableCreditsToSell <= 0) {
      alert("No available verified carbon credits to sell! Adopt more eco-friendly practices or complete land audits to generate verified credits.");
      return;
    }

    const creditsTraded = Math.min(availableCreditsToSell, 10); // Trade in blocks of 10 or remaining
    setAvailableCreditsToSell(prev => parseFloat((prev - creditsTraded).toFixed(1)));
    setTotalRevenueEarned(prev => prev + (creditsTraded * bidPrice));

    // Log blockchain transaction
    const nextBlock = blockchainLedger[0].blockHeight + Math.floor(Math.random() * 40 + 5);
    const newTx: LedgerTx = {
      txId: "0x" + Math.floor(Math.random() * 1000000).toString(16) + "...f2e3",
      timestamp: "Just Now",
      type: "Sale",
      creditsCount: creditsTraded,
      status: "Completed",
      blockHeight: nextBlock
    };
    setBlockchainLedger([newTx, ...blockchainLedger]);

    alert(`TRADE SUCCESS! Dispatched ${creditsTraded} verified Tons to ${company} for $${(creditsTraded * bidPrice).toLocaleString()} USD equivalent, settled directly into your connected escrow smart wallet.`);
  };

  // --- MANUAL VERIFICATION SIMULATOR ---
  const handleVerifyOnBlockchain = () => {
    // Collect unverified items
    const unverifiedCount = sustainablePractices.filter(p => p.adopted && p.verifiedCredits < p.estimatedCredits);
    if (unverifiedCount.length === 0) {
      alert("All active farm practices have been fully audited and are currently 100% verified on the ledger.");
      return;
    }

    setSustainablePractices(prev =>
      prev.map(p => {
        if (p.adopted && p.verifiedCredits < p.estimatedCredits) {
          return { ...p, verifiedCredits: p.estimatedCredits };
        }
        return p;
      })
    );

    // Add credits to available pool
    const newVerifiedSum = unverifiedCount.reduce((sum, item) => sum + (item.estimatedCredits - item.verifiedCredits), 0);
    setAvailableCreditsToSell(prev => parseFloat((prev + newVerifiedSum).toFixed(1)));

    // Ledger TX
    const nextBlock = blockchainLedger[0].blockHeight + 15;
    const newTx: LedgerTx = {
      txId: "0x" + Math.floor(Math.random() * 1000000).toString(16) + "...5e3b",
      timestamp: "Just Now",
      type: "Verification",
      creditsCount: parseFloat(newVerifiedSum.toFixed(1)),
      status: "Verified on Ledger",
      blockHeight: nextBlock
    };
    setBlockchainLedger([newTx, ...blockchainLedger]);

    alert(`Blockchain Oracle Audit Completed! Soil samples verified. +${newVerifiedSum.toFixed(1)} carbon credits unlocked and converted to sellable assets on the voluntary offset boards.`);
  };

  return (
    <div id="carbon-credits-marketplace" className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-6">
      
      {/* Title Segment */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg">
              <Globe className="h-5 w-5 text-emerald-600" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
              🌍 Voluntary Carbon Credit & Offsetting Marketplace
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 font-semibold tracking-wide uppercase">
            Calculate your farm carbon footprints, audit sequestration parameters, and trade verified credits directly to green corporate buyers
          </p>
        </div>

        {/* Annual Certification Badge */}
        <div className="flex items-center gap-2.5 bg-emerald-950 text-emerald-300 p-2.5 rounded-xl border border-emerald-800 shadow-md">
          <Award className="h-4.5 w-4.5 text-emerald-400 animate-bounce" />
          <div className="text-left">
            <span className="text-[8px] font-black uppercase text-emerald-400 tracking-wider block">Net-Zero Standard</span>
            <span className="text-[10px] font-black font-mono">Offset Certificate 2026 Issued</span>
          </div>
        </div>
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Net Sequestration tons */}
        <div className="p-4 rounded-2xl border bg-slate-50 border-slate-150 shadow-inner flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider font-sans">Gross Carbon Sequestration</span>
            <Leaf className="h-4.5 w-4.5 text-emerald-600 animate-pulse" />
          </div>
          <div className="mt-2">
            <h4 className="text-2xl font-black text-emerald-700 font-mono">
              {calculatedMetrics.grossSequestration} <span className="text-xs font-bold text-slate-400 uppercase">tCO2e/yr</span>
            </h4>
            <span className="text-[9.5px] font-semibold text-slate-400 block mt-1">
              Agroforestry ({calculatedMetrics.agroforestrySec}) + Soil ({calculatedMetrics.soilSec})
            </span>
          </div>
        </div>

        {/* Baseline Footprint */}
        <div className="p-4 rounded-2xl border bg-slate-50 border-slate-150 shadow-inner flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Estimated Farm Footprint</span>
            <Flame className="h-4.5 w-4.5 text-orange-500" />
          </div>
          <div className="mt-2">
            <h4 className="text-2xl font-black text-orange-700 font-mono">
              {calculatedMetrics.grossFootprint} <span className="text-xs font-bold text-slate-400 uppercase">tCO2e/yr</span>
            </h4>
            <span className="text-[9px] text-slate-400 font-bold block mt-1">
              Based on {totalLandArea} Ha arable management
            </span>
          </div>
        </div>

        {/* Sellable Credits */}
        <div className="p-4 rounded-2xl border bg-slate-50 border-slate-150 shadow-inner flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Verified Balance to Sell</span>
            <CheckCircle className="h-4.5 w-4.5 text-indigo-600" />
          </div>
          <div className="mt-2">
            <h4 className="text-2xl font-black text-indigo-700 font-mono">
              {availableCreditsToSell} <span className="text-xs font-bold text-slate-400 uppercase font-sans">Credits</span>
            </h4>
            <span className="text-[8.5px] font-black bg-indigo-50 border border-indigo-150 text-indigo-700 px-1.5 py-0.5 rounded-full inline-block mt-1">
              1 Credit = 1 Ton Offsets Verified
            </span>
          </div>
        </div>

        {/* Cash Settled Earnings */}
        <div className="p-4 rounded-2xl border bg-slate-50 border-slate-150 shadow-inner flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Total Trading Revenue</span>
            <DollarSign className="h-4.5 w-4.5 text-yellow-500" />
          </div>
          <div className="mt-2">
            <h4 className="text-2xl font-black text-slate-800 font-mono">
              ${totalRevenueEarned.toLocaleString()} <span className="text-xs font-semibold text-slate-400 uppercase">USD</span>
            </h4>
            <span className="text-[9px] font-extrabold text-emerald-600 block mt-1">
              ≈ ₹{(totalRevenueEarned * 83).toLocaleString()} INR Equivalent
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Calculator Inputs & Exchange Pricing chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Live Carbon footprint & Agroforestry estimation (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Farm-level carbon calculator inputs */}
          <div className="p-5 bg-slate-50 border border-slate-150 rounded-2xl space-y-4">
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="h-4.5 w-4.5 text-indigo-600" />
              Interactive Carbon Footprint & Soil Sequestration Simulator
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Land area */}
              <div className="space-y-1 bg-white p-3 rounded-xl border">
                <label className="block text-[8.5px] font-black text-slate-400 uppercase">Arable Area (Hectares)</label>
                <input
                  type="number"
                  value={totalLandArea}
                  onChange={(e) => setTotalLandArea(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full text-xs font-black font-mono text-slate-800 bg-transparent border-0 p-0 focus:ring-0 focus:outline-none"
                />
                <span className="text-[9px] text-slate-400">Total active plots</span>
              </div>

              {/* Agroforestry Trees */}
              <div className="space-y-1 bg-white p-3 rounded-xl border">
                <label className="block text-[8.5px] font-black text-slate-400 uppercase">Agroforestry trees</label>
                <input
                  type="number"
                  step="50"
                  value={agroforestryTrees}
                  onChange={(e) => setAgroforestryTrees(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full text-xs font-black font-mono text-slate-800 bg-transparent border-0 p-0 focus:ring-0 focus:outline-none"
                />
                <span className="text-[9px] text-slate-400">Teak & Mango shade trees</span>
              </div>

              {/* Soil Organic carbon % */}
              <div className="space-y-1 bg-white p-3 rounded-xl border">
                <label className="block text-[8.5px] font-black text-slate-400 uppercase">Soil Organic Carbon (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={soilCarbonPercent}
                  onChange={(e) => setSoilCarbonPercent(Math.max(0.1, parseFloat(e.target.value) || 0))}
                  className="w-full text-xs font-black font-mono text-slate-800 bg-transparent border-0 p-0 focus:ring-0 focus:outline-none"
                />
                <span className="text-[9px] text-slate-400">Certified lab sample</span>
              </div>

              {/* Methane mitigation */}
              <div className="space-y-1 bg-white p-3 rounded-xl border flex flex-col justify-between">
                <label className="block text-[8.5px] font-black text-slate-400 uppercase">Methane inhibitors</label>
                <button
                  onClick={() => setMethaneMitigationAdopted(prev => !prev)}
                  className={`py-1 px-2.5 rounded text-[10px] font-bold text-center cursor-pointer transition-colors ${
                    methaneMitigationAdopted ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {methaneMitigationAdopted ? "Active (-35% CH4)" : "Disabled (Standard)"}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3 bg-white border border-dashed rounded-xl">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-wide flex items-center gap-1">
                  <Sprout className="h-4 w-4 text-emerald-600" />
                  Net Sequestration Balance Output:
                </span>
                <p className="text-[10.5px] text-slate-500 font-semibold">
                  Gross Sequestration ({calculatedMetrics.grossSequestration} tCO2) minus gross footprints ({calculatedMetrics.grossFootprint} tCO2) = <span className="font-bold text-emerald-600 font-mono">{calculatedMetrics.netCarbonBalance} metric tons</span> of potential offsets generated annually.
                </p>
              </div>

              <button
                onClick={handleVerifyOnBlockchain}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1 shrink-0"
              >
                <Shield className="h-3.5 w-3.5 text-indigo-400" />
                Trigger Blockchain Oracle Audit
              </button>
            </div>
          </div>

          {/* Sustainable Practices suggestion carousel list */}
          <div className="p-5 bg-white border border-slate-150 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Leaf className="h-4.5 w-4.5 text-emerald-600 animate-pulse" />
                High-Impact Sustainable Practice Suggestions (Earn Credits)
              </h4>
              <span className="text-[9px] text-slate-400 font-black">CLICK TO ADOPT FOR SYSTEM UPDATE</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sustainablePractices.map(prac => (
                <div key={prac.id} className={`p-4 rounded-2xl border transition-all ${
                  prac.adopted
                    ? "bg-emerald-50/50 border-emerald-200 opacity-100"
                    : "bg-slate-50/70 border-slate-200 hover:bg-white"
                }`}>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[8.5px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold uppercase font-mono">
                        {prac.category}
                      </span>
                      <span className="text-xs font-black text-emerald-700 font-mono">
                        +{prac.estimatedCredits} tCO2e potential
                      </span>
                    </div>

                    <h5 className="text-xs font-extrabold text-slate-800 leading-snug">{prac.practice}</h5>
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                      {prac.impactMetrics}
                    </p>

                    <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 text-[10px] text-slate-400">
                      <span className="font-mono">{prac.costEstimate}</span>
                      {prac.adopted ? (
                        <div className="flex items-center gap-1 text-emerald-700 font-bold">
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>Active / Auditing</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAdoptPractice(prac.id, prac.category, prac.estimatedCredits)}
                          className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-[9px] font-black cursor-pointer hover:bg-indigo-700"
                        >
                          Adopt Practice
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right column: Price history exchange chart and blockchain ledger (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Carbon Credit Price Tracker partnered with exchanges */}
          <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-3 shadow-sm">
            <div className="flex justify-between items-center">
              <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-emerald-600 animate-pulse" />
                Carbon Credit Price Tracker
              </h4>
              <select
                value={selectedExchange}
                onChange={(e) => setSelectedExchange(e.target.value)}
                className="bg-white border text-[9px] font-bold text-slate-600 rounded px-1.5 py-0.5 focus:outline-none"
              >
                <option value="Gold Standard">Gold Standard Voluntary</option>
                <option value="Verra VCS">Verra VCS offsets</option>
                <option value="APX Exchange">APX Exchange</option>
              </select>
            </div>

            {/* Simulated Recharts display */}
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceHistory} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorCER" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 9, fontWeight: "bold" }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 9, fontWeight: "bold" }} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ fontSize: 10, fontWeight: "bold" }} />
                  <Area type="monotone" dataKey="CER_Gold" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCER)" name="Price / Ton ($)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-wide">
              Voluntary offset price is currently within 2% of historic peak
            </div>
          </div>

          {/* Blockchain Ledger Auditing Logs */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 space-y-3.5 shadow-md">
            <h4 className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Workflow className="h-4 w-4 text-indigo-400 animate-spin" style={{ animationDuration: "12s" }} />
              Solidity Ledger Audit Trails
            </h4>

            <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
              {blockchainLedger.map((tx, idx) => (
                <div key={idx} className="text-[9.5px] font-mono border-b border-slate-800 pb-2 last:border-b-0 space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="text-white font-bold leading-none flex items-center gap-1">
                      <Layers className="h-3 w-3 text-indigo-400" />
                      {tx.type} Log
                    </span>
                    <span className={`px-1 rounded text-[8px] font-extrabold font-sans uppercase tracking-wider ${
                      tx.status === "Verified on Ledger" ? "bg-emerald-950 text-emerald-400 border border-emerald-800" :
                      tx.status === "Completed" ? "bg-indigo-950 text-indigo-400 border border-indigo-900" :
                      "bg-amber-950 text-amber-400 border border-amber-800"
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[8.5px]">
                    <span>Block: #{tx.blockHeight} • Tx: {tx.txId}</span>
                    <span>{tx.creditsCount} tCO2</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-1.5 border-t border-slate-800 flex justify-between text-[8.5px] font-bold text-slate-500 font-mono">
              <span>Security Protocols: ISO-14064 Verified</span>
              <span>Network Status: Live</span>
            </div>
          </div>

        </div>

      </div>

      {/* Corporate Buyer Marketplace */}
      <div className="p-6 bg-slate-50 border border-slate-150 rounded-2xl space-y-4">
        <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Users className="h-4.5 w-4.5 text-indigo-600 animate-pulse" />
          Active Corporate Bids & Purchasing Platform
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {corporateBuyers.map(buyer => {
            const potentialEarningsSimulated = 10 * buyer.bidPricePerTon;
            const canTrade = availableCreditsToSell >= 10;

            return (
              <div key={buyer.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3.5 hover:shadow-md transition-all">
                
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded uppercase">
                      {buyer.sector}
                    </span>
                    <span className="text-xs font-black text-emerald-600 font-mono">
                      Bid: ${buyer.bidPricePerTon}/T
                    </span>
                  </div>
                  
                  <h5 className="text-xs font-extrabold text-slate-800">{buyer.companyName}</h5>
                  
                  <div className="text-[10px] text-slate-400 font-semibold space-y-0.5 leading-snug">
                    <p>Demand: {buyer.requestedCredits} Tons Offset</p>
                    {buyer.verifiedOnly && (
                      <p className="text-indigo-600 font-bold uppercase text-[8.5px]">✓ Verified credits only</p>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>Simulated Block trade:</span>
                    <span className="font-bold text-slate-800">10 tCO2</span>
                  </div>
                  
                  <button
                    onClick={() => handleSellCredits(buyer.id, buyer.bidPricePerTon, buyer.companyName)}
                    disabled={!canTrade}
                    className={`w-full py-1.5 rounded-lg text-xs font-black cursor-pointer transition-colors ${
                      canTrade
                        ? "bg-slate-900 text-white hover:bg-slate-800"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    {canTrade ? `Sell 10 Tons (+$${potentialEarningsSimulated})` : `Needs 10 Verified Tons`}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
