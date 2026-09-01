import React, { useState, useMemo } from "react";
import {
  Leaf,
  Users,
  Scale,
  Award,
  Activity,
  TrendingUp,
  Droplets,
  Coins,
  BookOpen,
  Heart,
  CheckCircle2,
  HelpCircle,
  FileText,
  Sparkles,
  Info,
  Calendar,
  RotateCcw,
  Compass,
  Cpu,
  Layers,
  ShieldCheck,
  Flame,
  ArrowUpRight,
  TrendingDown
} from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from "recharts";
import { motion, AnimatePresence } from "motion/react";

interface EsgMetric {
  name: string;
  category: "E" | "S" | "G";
  value: number; // 0-100 scale
  target: number;
  weight: number; // impact weight
  unit: string;
  rawValue: string;
  description: string;
  impactType: "Positive" | "Neutral" | "Needs Attention";
}

export default function EsgImpactDashboard() {
  // --- Simulation Inputs ---
  const [coverCropPct, setCoverCropPct] = useState<number>(65); // % of farm using cover crops
  const [dripIrrigationPct, setDripIrrigationPct] = useState<number>(80); // % of fields on drip irrigation
  const [bioFertilizerPct, setBioFertilizerPct] = useState<number>(75); // % ratio of organic/bio fertilizers
  
  const [localProcurementPct, setLocalProcurementPct] = useState<number>(70); // % of inputs sourced locally
  const [fairWagePremiumPct, setFairWagePremiumPct] = useState<number>(15); // % above minimum wage paid
  const [femaleParticipationPct, setFemaleParticipationPct] = useState<number>(42); // % female staff/leadership

  const [complianceAuditScore, setComplianceAuditScore] = useState<number>(95); // Regulatory compliance audit score
  const [governanceLedgerRate, setGovernanceLedgerRate] = useState<number>(90); // % transactions on block-ledger

  // Reset simulation variables
  const handleReset = () => {
    setCoverCropPct(65);
    setDripIrrigationPct(80);
    setBioFertilizerPct(75);
    setLocalProcurementPct(70);
    setFairWagePremiumPct(15);
    setFemaleParticipationPct(42);
    setComplianceAuditScore(95);
    setGovernanceLedgerRate(90);
  };

  // --- Dynamic Computations ---
  const esgMetrics = useMemo<EsgMetric[]>(() => {
    // 1. Environmental metrics driven by cover crops, drip irrigation, organic ratio
    const soilHealth = Math.round(40 + (coverCropPct * 0.4) + (bioFertilizerPct * 0.2));
    const waterEfficiency = Math.round(50 + (dripIrrigationPct * 0.5));
    const carbonFootprintReduction = Math.round(30 + (coverCropPct * 0.3) + (bioFertilizerPct * 0.4));
    
    // 2. Social metrics driven by local sourcing, premium wages, diversity
    const localSourcing = localProcurementPct;
    const workerWelfare = Math.round(50 + (fairWagePremiumPct * 2.5));
    const diversityGender = Math.round(30 + (femaleParticipationPct * 1.5));

    // 3. Governance metrics driven by audit scores, transparency
    const policyCompliance = complianceAuditScore;
    const supplyChainTransparency = governanceLedgerRate;
    const coopParticipation = 88; // Static cooperative attendance metric

    return [
      {
        name: "Soil Carbon Sequestration",
        category: "E",
        value: soilHealth,
        target: 95,
        weight: 0.15,
        unit: "% SOC Index",
        rawValue: `${(2.1 + (coverCropPct * 0.015) + (bioFertilizerPct * 0.008)).toFixed(2)}%`,
        description: "Soil Organic Carbon index reflecting biological microbial vitality and tillage recovery.",
        impactType: soilHealth >= 80 ? "Positive" : soilHealth >= 60 ? "Neutral" : "Needs Attention"
      },
      {
        name: "Water Conservation Efficiency",
        category: "E",
        value: waterEfficiency,
        target: 90,
        weight: 0.15,
        unit: "L/kg saved",
        rawValue: `${Math.round(150 + dripIrrigationPct * 3.5)} L/kg`,
        description: "Liters of fresh groundwater saved per crop kilogram compared to state flood baseline averages.",
        impactType: waterEfficiency >= 80 ? "Positive" : waterEfficiency >= 60 ? "Neutral" : "Needs Attention"
      },
      {
        name: "Carbon Emissions Offset",
        category: "E",
        value: carbonFootprintReduction,
        target: 85,
        weight: 0.12,
        unit: "Tons CO2e",
        rawValue: `${(4.2 + coverCropPct * 0.06 + bioFertilizerPct * 0.04).toFixed(1)} MT`,
        description: "Avoided greenhouse gases via reduced tractor hours, cover cropping, and chemical gas offsets.",
        impactType: carbonFootprintReduction >= 75 ? "Positive" : carbonFootprintReduction >= 55 ? "Neutral" : "Needs Attention"
      },
      {
        name: "Local Sourcing & S&P Support",
        category: "S",
        value: localSourcing,
        target: 85,
        weight: 0.12,
        unit: "% Local spend",
        rawValue: `${localSourcing}%`,
        description: "Share of annual spending on seeds, bio-inputs, and machinery redirected to local co-op merchants.",
        impactType: localSourcing >= 75 ? "Positive" : localSourcing >= 50 ? "Neutral" : "Needs Attention"
      },
      {
        name: "Fair Wage & Labor Welfare",
        category: "S",
        value: workerWelfare,
        target: 95,
        weight: 0.14,
        unit: "% Premium",
        rawValue: `+$${fairWagePremiumPct}%`,
        description: "Percentage of salaries paid above local state farm laborers minimum wages, ensuring high local standard of living.",
        impactType: workerWelfare >= 85 ? "Positive" : workerWelfare >= 65 ? "Neutral" : "Needs Attention"
      },
      {
        name: "Gender Equity & Training",
        category: "S",
        value: diversityGender,
        target: 80,
        weight: 0.08,
        unit: "% Participation",
        rawValue: `${femaleParticipationPct}%`,
        description: "Female representation in cooperative voting committees, field management, and agritech training courses.",
        impactType: diversityGender >= 70 ? "Positive" : diversityGender >= 50 ? "Neutral" : "Needs Attention"
      },
      {
        name: "Regulatory & Food Safety Compliance",
        category: "G",
        value: policyCompliance,
        target: 100,
        weight: 0.14,
        unit: "% Audit score",
        rawValue: `${policyCompliance}/100`,
        description: "Conformance score during unexpected bio-residue spot checks and chemical usage registries.",
        impactType: policyCompliance >= 90 ? "Positive" : policyCompliance >= 75 ? "Neutral" : "Needs Attention"
      },
      {
        name: "Blockchain Supply Chain Integrity",
        category: "G",
        value: supplyChainTransparency,
        target: 95,
        weight: 0.10,
        unit: "% Logged on-chain",
        rawValue: `${supplyChainTransparency}%`,
        description: "Proportion of crop transactions, weights, and logistics routes permanently stamped into sovereign co-op DIDs.",
        impactType: supplyChainTransparency >= 85 ? "Positive" : supplyChainTransparency >= 60 ? "Neutral" : "Needs Attention"
      }
    ];
  }, [
    coverCropPct,
    dripIrrigationPct,
    bioFertilizerPct,
    localProcurementPct,
    fairWagePremiumPct,
    femaleParticipationPct,
    complianceAuditScore,
    governanceLedgerRate
  ]);

  // Aggregate Category Scores
  const categoryScores = useMemo(() => {
    const categories = {
      E: { sum: 0, count: 0, weight: 0 },
      S: { sum: 0, count: 0, weight: 0 },
      G: { sum: 0, count: 0, weight: 0 }
    };

    esgMetrics.forEach((m) => {
      categories[m.category].sum += m.value;
      categories[m.category].count += 1;
      categories[m.category].weight += m.weight;
    });

    return {
      E: Math.round(categories.E.sum / categories.E.count),
      S: Math.round(categories.S.sum / categories.S.count),
      G: Math.round(categories.G.sum / categories.G.count)
    };
  }, [esgMetrics]);

  // Combined Total ESG Impact Score
  const totalEsgScore = useMemo(() => {
    let weightedSum = 0;
    let totalWeight = 0;
    esgMetrics.forEach((m) => {
      weightedSum += m.value * m.weight;
      totalWeight += m.weight;
    });
    return Math.round(weightedSum / (totalWeight || 1));
  }, [esgMetrics]);

  // Determine ESG Rating Grade
  const esgGrade = useMemo(() => {
    if (totalEsgScore >= 95) return { grade: "AAA", color: "text-emerald-600 bg-emerald-50 border-emerald-200", badge: "Gold Standard Vanguard" };
    if (totalEsgScore >= 85) return { grade: "AA", color: "text-teal-600 bg-teal-50 border-teal-200", badge: "Premium Sustainable Leader" };
    if (totalEsgScore >= 75) return { grade: "A", color: "text-indigo-600 bg-indigo-50 border-indigo-200", badge: "Co-Op Compliant Steward" };
    if (totalEsgScore >= 60) return { grade: "BBB", color: "text-amber-600 bg-amber-50 border-amber-200", badge: "Active Transitional" };
    return { grade: "BB", color: "text-rose-600 bg-rose-50 border-rose-200", badge: "Needs Operational Remediation" };
  }, [totalEsgScore]);

  // Format chart data for Radar & Bar representation
  const chartData = useMemo(() => {
    return esgMetrics.map((m) => ({
      metric: m.name.substring(0, 20) + (m.name.length > 20 ? "..." : ""),
      Current: m.value,
      Target: m.target,
      Category: m.category === "E" ? "Environmental" : m.category === "S" ? "Social" : "Governance"
    }));
  }, [esgMetrics]);

  const bentoCategoryData = [
    {
      id: "E",
      title: "Environmental (E)",
      score: categoryScores.E,
      colorClass: "bg-emerald-600",
      textColor: "text-emerald-700",
      borderColor: "border-emerald-200/60",
      bgColor: "bg-emerald-50/30",
      icon: Leaf,
      description: "Direct measurement of organic carbon levels, subsoil retention, chemical input reductions, and precision irrigation parameters.",
      metrics: esgMetrics.filter((m) => m.category === "E")
    },
    {
      id: "S",
      title: "Social (S)",
      score: categoryScores.S,
      colorClass: "bg-indigo-600",
      textColor: "text-indigo-700",
      borderColor: "border-indigo-200/60",
      bgColor: "bg-indigo-50/30",
      icon: Users,
      description: "Aggregates agricultural labor standards, premium wage programs, local co-op merchant support, and training equity.",
      metrics: esgMetrics.filter((m) => m.category === "S")
    },
    {
      id: "G",
      title: "Governance (G)",
      score: categoryScores.G,
      colorClass: "bg-teal-600",
      textColor: "text-teal-700",
      borderColor: "border-teal-200/60",
      bgColor: "bg-teal-50/30",
      icon: Scale,
      description: "Validates digital bio-residue audits, decentralized crop journey records, billing fairness, and pesticide compliance.",
      metrics: esgMetrics.filter((m) => m.category === "G")
    }
  ];

  // Verified ESG events on blockchain ledger (Social, Environmental proofs)
  const [esgBlockchainLedger] = useState([
    {
      id: "ESG-TX-9901",
      timestamp: "2026-06-25 09:15 UTC",
      category: "Environmental",
      proof: "Soil Organic Carbon Lab Upload",
      node: "Karnataka AgriLab Cluster #4",
      status: "Verified On-Chain",
      metricImpact: "+4.5 SOC",
      did: "did:agri:eswar-reddy",
      txHash: "0xe88a7b1b0f51d3b"
    },
    {
      id: "ESG-TX-8842",
      timestamp: "2026-06-22 14:00 UTC",
      category: "Social",
      proof: "Fair Wage Premium Payment Batch",
      node: "Sovereign Co-Op Banking Node",
      status: "Verified On-Chain",
      metricImpact: "+15% Labor standard",
      did: "did:agri:coop-bank-99",
      txHash: "0x12fc7a3b8cd5d21"
    },
    {
      id: "ESG-TX-7761",
      timestamp: "2026-06-18 11:30 UTC",
      category: "Governance",
      proof: "Pesticide Chemical Spot Audit Check",
      node: "APEDA Compliance Authority Ring",
      status: "Verified On-Chain",
      metricImpact: "95/100 Compliance Score",
      did: "did:agri:govt-apeda-inspector",
      txHash: "0xfa77b102ef190bc"
    },
    {
      id: "ESG-TX-5510",
      timestamp: "2026-06-12 16:45 UTC",
      category: "Environmental",
      proof: "Drip Irrigation Manifold Telemetry Link",
      node: "Helios IoT Core Gateway",
      status: "Verified On-Chain",
      metricImpact: "-35% Water Consumption",
      did: "did:agri:sensor-grid-north",
      txHash: "0x981bcde5a019d18"
    }
  ]);

  return (
    <div id="esg-impact-score-dashboard" className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-6 shadow-xs">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 animate-pulse">
              <Leaf className="h-3 w-3" /> ESG IMPACT COMPLIANCE
            </span>
            <span className="text-[10px] bg-indigo-100 text-indigo-800 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> SECURE AUDIT BLOCKCHAIN
            </span>
          </div>
          <h2 className="text-slate-800 text-lg font-black uppercase tracking-tight mt-1 flex items-center gap-2">
            🌿 Grower ESG Impact Score & Compliance Hub
          </h2>
          <p className="text-slate-500 text-xs font-semibold">
            Aggregate real-time subsoil biochemistry, conservation metrics, and local social contributions into a unified rating dashboard. Optimize farming choices to qualify for carbon premium pricing and low-interest green microloans.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="px-3.5 py-2 text-xs font-black uppercase tracking-wider text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 bg-white rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-3xs"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset Variables
        </button>
      </div>

      {/* Overview Hero Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Aggregated Score dial/card */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-5 shadow-3xs flex flex-col justify-between text-center relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
          
          <div className="space-y-1 text-left">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Unified ESG Index Score</span>
            <h3 className="font-extrabold text-slate-800 text-sm">Grower Performance Rating</h3>
          </div>

          <div className="my-6 relative flex items-center justify-center">
            {/* Circular Gauge Representation */}
            <div className="w-40 h-40 rounded-full border-8 border-slate-100 flex flex-col items-center justify-center relative shadow-inner">
              {/* Colored active border overlay */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="72"
                  stroke={totalEsgScore >= 85 ? "#10b981" : totalEsgScore >= 70 ? "#4f46e5" : "#f59e0b"}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="452.3"
                  strokeDashoffset={452.3 - (452.3 * totalEsgScore) / 100}
                  strokeLinecap="round"
                />
              </svg>
              
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Score</span>
              <span className="text-4xl font-black text-slate-800 tracking-tight leading-none my-1">{totalEsgScore}</span>
              <span className="text-[10px] font-bold text-slate-400 font-mono">out of 100</span>
            </div>

            {/* Float Badge */}
            <div className={`absolute bottom-0 right-4 px-3 py-1.5 border rounded-2xl shadow-3xs flex flex-col items-center ${esgGrade.color}`}>
              <span className="text-[14px] font-black tracking-tight leading-none">{esgGrade.grade}</span>
              <span className="text-[8px] font-bold uppercase tracking-wider mt-0.5">Rating</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-150 p-3 rounded-2xl text-left space-y-1">
            <div className="flex items-center gap-1.5">
              <Award className="h-4 w-4 text-indigo-600 shrink-0" />
              <span className="text-[11px] font-black text-slate-800">{esgGrade.badge}</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium leading-normal">
              Verified by autonomous Merkle-proof validators on the regional co-op node. Qualifies for high-tier sustainable export grants.
            </p>
          </div>
        </div>

        {/* Breakdown Radar/Bar charts */}
        <div className="lg:col-span-8 bg-slate-900 text-white border border-slate-800 rounded-3xl p-5 shadow-md flex flex-col justify-between">
          <div className="flex justify-between items-start border-b border-slate-800 pb-3">
            <div className="space-y-0.5">
              <span className="text-[8px] bg-indigo-500/10 text-indigo-300 border border-indigo-900/40 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold inline-block">
                Metric Performance Comparison
              </span>
              <h4 className="text-xs font-black uppercase text-white">Current ESG Compliance vs Targets</h4>
            </div>
            <div className="flex gap-2 text-[9px] font-mono text-slate-400">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Current</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-slate-600" /> Target Benchmark</span>
            </div>
          </div>

          <div className="h-[210px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="metric" stroke="#94a3b8" style={{ fontSize: 8, fontWeight: "bold" }} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" style={{ fontSize: 8, fontWeight: "bold" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 12, fontSize: 10 }}
                  formatter={(value) => [`${value}/100`, "Score"]}
                />
                <Legend style={{ fontSize: 9 }} />
                <Bar dataKey="Current" fill="#10b981" radius={[4, 4, 0, 0]} name="Farmer Performance Score">
                  {chartData.map((entry, index) => {
                    const colors = { Environmental: "#10b981", Social: "#4f46e5", Governance: "#0d9488" };
                    return <Cell key={`cell-${index}`} fill={colors[entry.Category as keyof typeof colors] || "#10b981"} />;
                  })}
                </Bar>
                <Bar dataKey="Target" fill="#334155" radius={[4, 4, 0, 0]} name="State Target Standard" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-800">
            <span>Soil biological health: +{coverCropPct}% cover crops adopted</span>
            <span>Total emission footprint avoided: {((coverCropPct + bioFertilizerPct) * 0.05).toFixed(1)} MT CO2e</span>
          </div>
        </div>

      </div>

      {/* Simulation Controllers & Detailed Bento breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (span 5): Real-time Impact Simulator Sliders */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-5 shadow-3xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[9px] text-indigo-600 font-black uppercase tracking-wider block">Co-Op Advisor Model</span>
            <h3 className="font-extrabold text-slate-800 text-xs mt-0.5 flex items-center gap-1.5">
              <Cpu className="h-4.5 w-4.5 text-indigo-500 animate-spin" style={{ animationDuration: '10s' }} /> Active ESG Metric Optimizer
            </h3>
            <p className="text-[10.5px] text-slate-400 font-medium leading-relaxed mt-0.5">
              Simulate operational changes on your farm lot to view immediate downstream compliance score improvements.
            </p>
          </div>

          <div className="space-y-4">
            
            {/* Category: Environmental Adjustments */}
            <div className="bg-slate-50/70 p-3.5 border border-slate-150 rounded-2xl space-y-3">
              <span className="text-[9.5px] text-emerald-700 font-black uppercase tracking-wider flex items-center gap-1">
                <Leaf className="h-3.5 w-3.5" /> Environmental (E) Simulation Variables
              </span>

              {/* Cover crops */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-600">Cover Crop Area:</span>
                  <span className="text-slate-800 font-extrabold">{coverCropPct}% of acreage</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={coverCropPct}
                  onChange={(e) => setCoverCropPct(parseInt(e.target.value) || 0)}
                  className="w-full accent-emerald-600 h-1 cursor-pointer bg-slate-200 rounded"
                />
              </div>

              {/* Drip Irrigation */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-600">Precision Drip Irrigation:</span>
                  <span className="text-slate-800 font-extrabold">{dripIrrigationPct}% deployment</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={dripIrrigationPct}
                  onChange={(e) => setDripIrrigationPct(parseInt(e.target.value) || 0)}
                  className="w-full accent-emerald-600 h-1 cursor-pointer bg-slate-200 rounded"
                />
              </div>

              {/* Bio Fertilizers */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-600">Organic/Bio Fertilization ratio:</span>
                  <span className="text-slate-800 font-extrabold">{bioFertilizerPct}% share</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={bioFertilizerPct}
                  onChange={(e) => setBioFertilizerPct(parseInt(e.target.value) || 0)}
                  className="w-full accent-emerald-600 h-1 cursor-pointer bg-slate-200 rounded"
                />
              </div>
            </div>

            {/* Category: Social Adjustments */}
            <div className="bg-slate-50/70 p-3.5 border border-slate-150 rounded-2xl space-y-3">
              <span className="text-[9.5px] text-indigo-700 font-black uppercase tracking-wider flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> Social (S) Simulation Variables
              </span>

              {/* Local Spend ratio */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-600">Local Sourcing Ratio:</span>
                  <span className="text-slate-800 font-extrabold">{localProcurementPct}% procurement</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localProcurementPct}
                  onChange={(e) => setLocalProcurementPct(parseInt(e.target.value) || 0)}
                  className="w-full accent-indigo-600 h-1 cursor-pointer bg-slate-200 rounded"
                />
              </div>

              {/* Fair Wage Premium */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-600">Wage Standards Premium:</span>
                  <span className="text-slate-800 font-extrabold">+{fairWagePremiumPct}% over state minimum</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={fairWagePremiumPct}
                  onChange={(e) => setFairWagePremiumPct(parseInt(e.target.value) || 0)}
                  className="w-full accent-indigo-600 h-1 cursor-pointer bg-slate-200 rounded"
                />
              </div>

              {/* Diversity leadership participation */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-600">Staff Training Participation:</span>
                  <span className="text-slate-800 font-extrabold">{femaleParticipationPct}% local participation</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="70"
                  value={femaleParticipationPct}
                  onChange={(e) => setFemaleParticipationPct(parseInt(e.target.value) || 10)}
                  className="w-full accent-indigo-600 h-1 cursor-pointer bg-slate-200 rounded"
                />
              </div>
            </div>

            {/* Category: Governance Adjustments */}
            <div className="bg-slate-50/70 p-3.5 border border-slate-150 rounded-2xl space-y-3">
              <span className="text-[9.5px] text-teal-700 font-black uppercase tracking-wider flex items-center gap-1">
                <Scale className="h-3.5 w-3.5" /> Governance (G) Simulation Variables
              </span>

              {/* Compliance score */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-600">Audit Compliance Score:</span>
                  <span className="text-slate-800 font-extrabold">{complianceAuditScore}/100</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={complianceAuditScore}
                  onChange={(e) => setComplianceAuditScore(parseInt(e.target.value) || 50)}
                  className="w-full accent-teal-600 h-1 cursor-pointer bg-slate-200 rounded"
                />
              </div>

              {/* Blockchain on-chain transaction rate */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-600">Sovereign DID Ledger logging:</span>
                  <span className="text-slate-800 font-extrabold">{governanceLedgerRate}% transparency</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={governanceLedgerRate}
                  onChange={(e) => setGovernanceLedgerRate(parseInt(e.target.value) || 30)}
                  className="w-full accent-teal-600 h-1 cursor-pointer bg-slate-200 rounded"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Right Column (span 7): Detailed Bento-grids & Individual Metrics */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Category score list cards */}
          <div className="space-y-4">
            {bentoCategoryData.map((category) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.id}
                  className={`bg-white border ${category.borderColor} ${category.bgColor} rounded-3xl p-5 shadow-3xs space-y-4 transition-all hover:scale-[1.005]`}
                >
                  <div className="flex justify-between items-center border-b border-slate-200/50 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl text-white ${category.colorClass}`}>
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide">
                          {category.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase font-mono">
                          Compliance Standard Category
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Category Index</span>
                      <span className={`text-[18px] font-black tracking-tight ${category.textColor}`}>
                        {category.score}/100
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                    {category.description}
                  </p>

                  {/* Individual metrics within category */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                    {category.metrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className="bg-white/80 border border-slate-150 p-3 rounded-2xl flex flex-col justify-between hover:shadow-3xs"
                      >
                        <div>
                          <span className="text-[9px] text-slate-400 font-extrabold block leading-tight">
                            {metric.name}
                          </span>
                          <span className="text-[11px] text-slate-800 font-black mt-1 block">
                            {metric.rawValue}
                          </span>
                        </div>
                        <div className="mt-2.5 flex justify-between items-center text-[9px] font-black uppercase tracking-tight">
                          <span className="text-slate-400">{metric.value}/100</span>
                          <span
                            className={
                              metric.impactType === "Positive"
                                ? "text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded"
                                : metric.impactType === "Neutral"
                                ? "text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded"
                                : "text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded"
                            }
                          >
                            {metric.impactType}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Carbon Incentives & Financial Uplift assessment box */}
          <div className="bg-emerald-950 text-white border border-emerald-900 rounded-3xl p-5 shadow-sm space-y-3.5 relative overflow-hidden">
            {/* Soft decorative glow */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-emerald-800/40 rounded-full blur-3xl" />
            
            <div className="flex items-center gap-2 border-b border-emerald-900 pb-2.5">
              <Sparkles className="h-4.5 w-4.5 text-emerald-400 animate-pulse" />
              <h4 className="text-xs font-black uppercase text-emerald-300">
                Eco-Premium Financial & carbon incentive assessments
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[8.5px] text-emerald-400 font-bold uppercase block tracking-wider">Projected Premium Bonus</span>
                <span className="text-white text-[16px] font-black block">
                  +${((totalEsgScore * 0.12) + (coverCropPct * 0.4)).toFixed(2)} / Ton Base
                </span>
                <p className="text-[10px] text-emerald-300/80 leading-normal font-semibold">
                  Estimated premium export bonus paid by global retail partners (e.g., FabIndia, ITC) for high ESG certification tiers.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[8.5px] text-emerald-400 font-bold uppercase block tracking-wider">Green Micro-credit Margin</span>
                <span className="text-white text-[16px] font-black block">
                  -{((totalEsgScore - 50) * 0.04).toFixed(2)}% APR reduction
                </span>
                <p className="text-[10px] text-emerald-300/80 leading-normal font-semibold">
                  Pre-qualified interest discount offered by Nabard Green Credit scheme for achieving score compliant marks.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Verified On-Chain ESG Log Ledger Streams */}
      <div className="bg-slate-950 text-white rounded-3xl p-5 border border-slate-800 space-y-4 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-850 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4.5 w-4.5 text-emerald-500" />
            <div>
              <h4 className="text-xs font-black uppercase text-indigo-300">
                Cryptographically Signed ESG Ledger Streams
              </h4>
              <p className="text-[9px] text-slate-400 mt-0.5 font-semibold">
                Permanent zero-knowledge compliance audits stamped into sovereign decentralized identities.
              </p>
            </div>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        <div className="space-y-2 max-h-[190px] overflow-y-auto font-mono text-[9.5px] text-slate-300 pr-1">
          {esgBlockchainLedger.map((tx, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-900/70 border border-slate-850 rounded-xl space-y-1 hover:border-slate-800 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[8px] font-black text-slate-500">
                  <span>ID: {tx.id}</span>
                  <span>•</span>
                  <span>{tx.timestamp}</span>
                  <span>•</span>
                  <span className="text-emerald-400 bg-emerald-950/40 px-1 py-0.2 rounded font-sans">{tx.category}</span>
                </div>
                <p className="text-slate-100 font-bold text-[11px] leading-snug">
                  Proof Type: <span className="text-slate-300">"{tx.proof}"</span>
                </p>
                <div className="text-[8.5px] text-slate-400 flex items-center gap-2">
                  <span>Signatory Node: <strong className="text-slate-300">{tx.node}</strong></span>
                </div>
              </div>
              <div className="text-left md:text-right shrink-0 space-y-1 w-full md:w-auto border-t md:border-t-0 border-slate-800/60 pt-2 md:pt-0">
                <span className="text-[10px] font-black text-emerald-400 block font-sans">
                  {tx.metricImpact}
                </span>
                <span className="text-[8px] text-slate-500 block truncate max-w-[200px]">
                  TX: {tx.txHash}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
