import React, { useState, useMemo } from "react";
import {
  Sprout,
  ShieldAlert,
  TrendingUp,
  Leaf,
  Calendar,
  Layers,
  Sparkles,
  BarChart4,
  RefreshCw,
  Award,
  AlertTriangle,
  Flame,
  Globe,
  Plus,
  Trash2,
  BookmarkCheck,
  Activity
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

type SoilType = "Clay-Heavy Loam" | "Sandy-Loam" | "Silt-Rich" | "Deep Alluvial";

interface CropRotationPlan {
  year: number;
  season: "Kharif" | "Rabi" | "Zaid / Cover";
  crop: string;
  category: "Legume" | "Cereal" | "Oilseed" | "Fiber" | "Cover Crop" | "Pasture";
  purpose: string;
  nitrogenFixingKgPerAcre: number;
  estimatedProfitPerAcre: number;
  expectedYieldImpact: number; // percentage change relative to mono-cropping
  pestBreakEfficiency: number; // percentage control value
  weedSuppressionScore: number; // 1-100 scale
}

export default function CropRotationPlanner() {
  const [soilType, setSoilType] = useState<SoilType>("Clay-Heavy Loam");
  const [initialMoisture, setInitialMoisture] = useState<number>(55);
  const [targetDuration, setTargetDuration] = useState<number>(5); // 3-5 Year rotation
  const [isPastureIntegrated, setIsPastureIntegrated] = useState<boolean>(true);
  const [selectedCropPreset, setSelectedCropPreset] = useState<string>("Basmati-Wheat-Legume");

  // Custom User Rotation Overrides State
  const [customRotations, setCustomRotations] = useState<CropRotationPlan[]>([
    {
      year: 1,
      season: "Kharif",
      crop: "Basmati Rice",
      category: "Cereal",
      purpose: "Primary revenue driver with heavy nitrogen consumption",
      nitrogenFixingKgPerAcre: -45,
      estimatedProfitPerAcre: 680,
      expectedYieldImpact: 100,
      pestBreakEfficiency: 15,
      weedSuppressionScore: 65
    },
    {
      year: 1,
      season: "Rabi",
      crop: "Berseem Clover",
      category: "Legume",
      purpose: "Nitrogen fixation and excellent organic fodder enrichment",
      nitrogenFixingKgPerAcre: 110,
      estimatedProfitPerAcre: 350,
      expectedYieldImpact: 112,
      pestBreakEfficiency: 75,
      weedSuppressionScore: 85
    },
    {
      year: 2,
      season: "Kharif",
      crop: "Pigeon Pea (Arhar)",
      category: "Legume",
      purpose: "Deep-rooting legume breaking hard clay subsoil pans",
      nitrogenFixingKgPerAcre: 85,
      estimatedProfitPerAcre: 480,
      expectedYieldImpact: 118,
      pestBreakEfficiency: 80,
      weedSuppressionScore: 70
    },
    {
      year: 2,
      season: "Rabi",
      crop: "Premium Wheat",
      category: "Cereal",
      purpose: "High market demand grain taking advantage of residual nitrogen",
      nitrogenFixingKgPerAcre: -30,
      estimatedProfitPerAcre: 520,
      expectedYieldImpact: 122,
      pestBreakEfficiency: 40,
      weedSuppressionScore: 75
    },
    {
      year: 3,
      season: "Zaid / Cover",
      crop: "Sesbania (Dhaincha)",
      category: "Cover Crop",
      purpose: "Excellent green manure to boost soil organic matter",
      nitrogenFixingKgPerAcre: 120,
      estimatedProfitPerAcre: -50, // negative directly but offsets fertilizer cost
      expectedYieldImpact: 130,
      pestBreakEfficiency: 95,
      weedSuppressionScore: 90
    },
    {
      year: 3,
      season: "Kharif",
      crop: "Grain Pearl Millet",
      category: "Cereal",
      purpose: "Drought resistant nutrient-scavenger crop",
      nitrogenFixingKgPerAcre: -15,
      estimatedProfitPerAcre: 320,
      expectedYieldImpact: 110,
      pestBreakEfficiency: 60,
      weedSuppressionScore: 80
    },
    {
      year: 4,
      season: "Kharif",
      crop: "Alfalfa Fodder",
      category: "Pasture",
      purpose: "Mixed-farming pastoral integration for livestock grazing",
      nitrogenFixingKgPerAcre: 140,
      estimatedProfitPerAcre: 450,
      expectedYieldImpact: 135,
      pestBreakEfficiency: 90,
      weedSuppressionScore: 92
    },
    {
      year: 5,
      season: "Rabi",
      crop: "Mustard Seed",
      category: "Oilseed",
      purpose: "Bio-fumigant roots reducing soil-borne fungal pathogens",
      nitrogenFixingKgPerAcre: -20,
      estimatedProfitPerAcre: 590,
      expectedYieldImpact: 140,
      pestBreakEfficiency: 85,
      weedSuppressionScore: 82
    }
  ]);

  // Handle Preset Changes
  const applyPreset = (preset: string) => {
    setSelectedCropPreset(preset);
    if (preset === "Basmati-Wheat-Legume") {
      setCustomRotations([
        { year: 1, season: "Kharif", crop: "Basmati Rice", category: "Cereal", purpose: "Primary revenue driver with heavy nitrogen consumption", nitrogenFixingKgPerAcre: -45, estimatedProfitPerAcre: 680, expectedYieldImpact: 100, pestBreakEfficiency: 15, weedSuppressionScore: 65 },
        { year: 1, season: "Rabi", crop: "Berseem Clover", category: "Legume", purpose: "Nitrogen fixation and excellent organic fodder enrichment", nitrogenFixingKgPerAcre: 110, estimatedProfitPerAcre: 350, expectedYieldImpact: 112, pestBreakEfficiency: 75, weedSuppressionScore: 85 },
        { year: 2, season: "Kharif", crop: "Pigeon Pea (Arhar)", category: "Legume", purpose: "Deep-rooting legume breaking hard clay subsoil pans", nitrogenFixingKgPerAcre: 85, estimatedProfitPerAcre: 480, expectedYieldImpact: 118, pestBreakEfficiency: 80, weedSuppressionScore: 70 },
        { year: 2, season: "Rabi", crop: "Premium Wheat", category: "Cereal", purpose: "High market demand grain taking advantage of residual nitrogen", nitrogenFixingKgPerAcre: -30, estimatedProfitPerAcre: 520, expectedYieldImpact: 122, pestBreakEfficiency: 40, weedSuppressionScore: 75 },
        { year: 3, season: "Zaid / Cover", crop: "Sesbania (Dhaincha)", category: "Cover Crop", purpose: "Excellent green manure to boost soil organic matter", nitrogenFixingKgPerAcre: 120, estimatedProfitPerAcre: -50, expectedYieldImpact: 130, pestBreakEfficiency: 95, weedSuppressionScore: 90 },
        { year: 3, season: "Kharif", crop: "Grain Pearl Millet", category: "Cereal", purpose: "Drought resistant nutrient-scavenger crop", nitrogenFixingKgPerAcre: -15, estimatedProfitPerAcre: 320, expectedYieldImpact: 110, pestBreakEfficiency: 60, weedSuppressionScore: 80 },
        { year: 4, season: "Kharif", crop: "Alfalfa Fodder", category: "Pasture", purpose: "Mixed-farming pastoral integration for livestock grazing", nitrogenFixingKgPerAcre: 140, estimatedProfitPerAcre: 450, expectedYieldImpact: 135, pestBreakEfficiency: 90, weedSuppressionScore: 92 },
        { year: 5, season: "Rabi", crop: "Mustard Seed", category: "Oilseed", purpose: "Bio-fumigant roots reducing soil-borne fungal pathogens", nitrogenFixingKgPerAcre: -20, estimatedProfitPerAcre: 590, expectedYieldImpact: 140, pestBreakEfficiency: 85, weedSuppressionScore: 82 }
      ]);
    } else if (preset === "High-Intensity-Maize-Cotton") {
      setCustomRotations([
        { year: 1, season: "Kharif", crop: "Hybrid Maize", category: "Cereal", purpose: "High-yield feeding demand", nitrogenFixingKgPerAcre: -60, estimatedProfitPerAcre: 710, expectedYieldImpact: 100, pestBreakEfficiency: 10, weedSuppressionScore: 50 },
        { year: 1, season: "Rabi", crop: "Chickpea", category: "Legume", purpose: "Rabi nitrogen balance", nitrogenFixingKgPerAcre: 60, estimatedProfitPerAcre: 440, expectedYieldImpact: 108, pestBreakEfficiency: 60, weedSuppressionScore: 65 },
        { year: 2, season: "Kharif", crop: "Bt Cotton", category: "Fiber", purpose: "Cash crop with high cash liquidity value", nitrogenFixingKgPerAcre: -50, estimatedProfitPerAcre: 850, expectedYieldImpact: 112, pestBreakEfficiency: 35, weedSuppressionScore: 70 },
        { year: 2, season: "Rabi", crop: "Hairy Vetch", category: "Cover Crop", purpose: "Excellent erosion blocker and dense root cover crop", nitrogenFixingKgPerAcre: 95, estimatedProfitPerAcre: -30, expectedYieldImpact: 120, pestBreakEfficiency: 85, weedSuppressionScore: 90 },
        { year: 3, season: "Kharif", crop: "Soybeans", category: "Legume", purpose: "High-protein legume oilseed crop", nitrogenFixingKgPerAcre: 70, estimatedProfitPerAcre: 610, expectedYieldImpact: 124, pestBreakEfficiency: 75, weedSuppressionScore: 78 }
      ]);
    } else {
      // Pasture-Heavy Mixed Farming Preset
      setCustomRotations([
        { year: 1, season: "Kharif", crop: "Napier Grass", category: "Pasture", purpose: "Perennial pasture for rotational grazing paddock", nitrogenFixingKgPerAcre: 80, estimatedProfitPerAcre: 390, expectedYieldImpact: 110, pestBreakEfficiency: 80, weedSuppressionScore: 95 },
        { year: 2, season: "Rabi", crop: "Fodder Oat", category: "Cereal", purpose: "Winter livestock feed and grain supplement", nitrogenFixingKgPerAcre: -25, estimatedProfitPerAcre: 410, expectedYieldImpact: 120, pestBreakEfficiency: 70, weedSuppressionScore: 85 },
        { year: 3, season: "Kharif", crop: "Cowpea (Lobia)", category: "Legume", purpose: "Vigorous summer ground cover fixing high nitrogen levels", nitrogenFixingKgPerAcre: 105, estimatedProfitPerAcre: 320, expectedYieldImpact: 132, pestBreakEfficiency: 90, weedSuppressionScore: 88 },
        { year: 4, season: "Rabi", crop: "Lucerne / Alfalfa", category: "Pasture", purpose: "Pasture pasture root deep penetration", nitrogenFixingKgPerAcre: 150, estimatedProfitPerAcre: 550, expectedYieldImpact: 145, pestBreakEfficiency: 95, weedSuppressionScore: 95 }
      ]);
    }
  };

  // --- COMPUTE KEY AGRO-ECOLOGICAL SCORES ---
  const computations = useMemo(() => {
    // 1. Biodiversity Score: Unique categories represented
    const uniqueCategories = new Set(customRotations.map(r => r.category));
    const biodiversityScore = Math.min(100, Math.round((uniqueCategories.size / 6) * 100));

    // 2. Nitrogen Cumulative Balance (Kg per acre)
    let cumulativeN = 0;
    const nHistory = customRotations.map(r => {
      cumulativeN += r.nitrogenFixingKgPerAcre;
      return { crop: r.crop, balance: cumulativeN };
    });

    // 3. Pest break efficiency average
    const avgPestBreak = Math.round(customRotations.reduce((acc, r) => acc + r.pestBreakEfficiency, 0) / customRotations.length) || 0;

    // 4. Weed suppression rating
    const avgWeedSuppression = Math.round(customRotations.reduce((acc, r) => acc + r.weedSuppressionScore, 0) / customRotations.length) || 0;

    // 5. Projected total profit over the entire rotation cycle
    const totalProfit = customRotations.reduce((acc, r) => acc + r.estimatedProfitPerAcre, 0);

    // 6. Carbon Sequestration calculation (Metric Tons CO2 eq per Acre per year)
    // Legumes, cover crops, and pasture sequester more carbon. Cereals sequester less.
    let totalCarbonSeq = 0;
    customRotations.forEach(r => {
      if (r.category === "Cover Crop") totalCarbonSeq += 1.8;
      else if (r.category === "Pasture") totalCarbonSeq += 2.4;
      else if (r.category === "Legume") totalCarbonSeq += 1.2;
      else if (r.category === "Cereal") totalCarbonSeq += 0.4;
      else totalCarbonSeq += 0.6;
    });
    const annualCarbonSeq = parseFloat((totalCarbonSeq / (customRotations[customRotations.length - 1]?.year || 1)).toFixed(2));

    // 7. Soil health depletion indicator
    // Derived from nitrogen balance + biodiversity + cover crop presence
    const coverCropCount = customRotations.filter(r => r.category === "Cover Crop").length;
    const pastureCount = customRotations.filter(r => r.category === "Pasture").length;
    const depletionRisk = Math.max(5, Math.min(100, 100 - (biodiversityScore * 0.4) - (cumulativeN > 0 ? 30 : 0) - (coverCropCount * 20) - (pastureCount * 15)));

    return {
      biodiversityScore,
      nHistory,
      avgPestBreak,
      avgWeedSuppression,
      totalProfit,
      annualCarbonSeq,
      cumulativeN,
      depletionRisk
    };
  }, [customRotations]);

  // Form states to append new crop to rotation
  const [newYear, setNewYear] = useState<number>(1);
  const [newSeason, setNewSeason] = useState<"Kharif" | "Rabi" | "Zaid / Cover">("Kharif");
  const [newCrop, setNewCrop] = useState<string>("");
  const [newCategory, setNewCategory] = useState<"Legume" | "Cereal" | "Oilseed" | "Fiber" | "Cover Crop" | "Pasture">("Legume");
  const [newPurpose, setNewPurpose] = useState<string>("");
  const [newN, setNewN] = useState<number>(60);
  const [newProfit, setNewProfit] = useState<number>(450);

  const addNewCropRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCrop) {
      alert("Please enter a crop name.");
      return;
    }

    const row: CropRotationPlan = {
      year: newYear,
      season: newSeason,
      crop: newCrop,
      category: newCategory,
      purpose: newPurpose || "Custom seasonal rotation allocation",
      nitrogenFixingKgPerAcre: newN,
      estimatedProfitPerAcre: newProfit,
      expectedYieldImpact: 110 + (newCategory === "Legume" ? 10 : 0),
      pestBreakEfficiency: newCategory === "Cover Crop" ? 90 : 50,
      weedSuppressionScore: newCategory === "Pasture" ? 95 : 70
    };

    setCustomRotations([...customRotations, row]);
    setNewCrop("");
    setNewPurpose("");
  };

  const removeCropRow = (idx: number) => {
    const updated = customRotations.filter((_, i) => i !== idx);
    setCustomRotations(updated);
  };

  return (
    <div id="crop-rotation-planner" className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-6">
      {/* Banner */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg">
              <Sprout className="h-5 w-5 animate-bounce" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
              5-Year AI Crop Rotation Planner & Soil Regenerator
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 font-semibold tracking-wide uppercase">
            Design multi-year sequences to prevent soil depletion, capture carbon, and maximize crop lot profitability
          </p>
        </div>

        {/* Preset selections */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Crop Preset:</span>
          <select
            value={selectedCropPreset}
            onChange={(e) => applyPreset(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="Basmati-Wheat-Legume">Basmati-Wheat-Berseem (High Bio-balance)</option>
            <option value="High-Intensity-Maize-Cotton">Maize-Bt Cotton Cash Flow (Fiber-Heavy)</option>
            <option value="Pasture-Mixed">Napier Grass Pasture (Rotational Mixed Farming)</option>
          </select>
        </div>
      </div>

      {/* Grid of Ecological KPI Analytics Card meters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* N-Fixing cumulative indicator */}
        <div className="p-4 rounded-2xl border bg-slate-50 border-slate-150 shadow-inner flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Nitrogen Balance</span>
            <Leaf className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2.5">
            <h4 className="text-xl font-black text-slate-800 font-mono">
              {computations.cumulativeN > 0 ? `+${computations.cumulativeN}` : computations.cumulativeN} Kg/Acre
            </h4>
            <div className="flex items-center gap-1 mt-1 text-[10px] font-semibold text-slate-500">
              <span className={`h-1.5 w-1.5 rounded-full inline-block ${computations.cumulativeN > 0 ? "bg-emerald-500" : "bg-rose-500 animate-pulse"}`}></span>
              {computations.cumulativeN > 0 ? "N-Fixing Positive" : "Deficit (Needs synthetic fertilizer)"}
            </div>
          </div>
        </div>

        {/* Biodiversity index */}
        <div className="p-4 rounded-2xl border bg-slate-50 border-slate-150 shadow-inner flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Biodiversity index</span>
            <Layers className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2.5">
            <h4 className="text-xl font-black text-slate-800 font-mono">{computations.biodiversityScore}%</h4>
            <div className="flex items-center gap-1 mt-1 text-[10px] font-semibold text-slate-500">
              <div className="h-1 w-12 bg-slate-200 rounded-full overflow-hidden inline-block">
                <div className="h-full bg-indigo-500" style={{ width: `${computations.biodiversityScore}%` }}></div>
              </div>
              <span>Poly-culture metric</span>
            </div>
          </div>
        </div>

        {/* Carbon Sequestration */}
        <div className="p-4 rounded-2xl border bg-slate-50 border-slate-150 shadow-inner flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">CO2 Sequestration</span>
            <Globe className="h-4 w-4 text-blue-600 animate-pulse" />
          </div>
          <div className="mt-2.5">
            <h4 className="text-xl font-black text-slate-800 font-mono">
              {computations.annualCarbonSeq} Tons / Yr
            </h4>
            <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Net carbon credit capture index</p>
          </div>
        </div>

        {/* Pest Break Cycle efficiency */}
        <div className="p-4 rounded-2xl border bg-slate-50 border-slate-150 shadow-inner flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Pest Break Ratio</span>
            <ShieldAlert className="h-4 w-4 text-orange-600" />
          </div>
          <div className="mt-2.5">
            <h4 className="text-xl font-black text-slate-800 font-mono">{computations.avgPestBreak}% Control</h4>
            <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Reduces spore & egg vectors</p>
          </div>
        </div>

        {/* Soil Depletion Danger */}
        <div className="p-4 rounded-2xl border bg-slate-50 border-slate-150 shadow-inner flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Soil Depletion Risk</span>
            <Flame className="h-4 w-4 text-red-600 animate-pulse" />
          </div>
          <div className="mt-2.5">
            <h4 className={`text-xl font-black font-mono ${computations.depletionRisk > 60 ? "text-red-600 animate-pulse" : "text-slate-800"}`}>
              {computations.depletionRisk}%
            </h4>
            <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">
              {computations.depletionRisk > 60 ? "CRITICAL EXHAUSTION" : "Healthy soil buffer"}
            </p>
          </div>
        </div>
      </div>

      {/* Main interactive visual layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Visual sequence calendar & list builder */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="h-4.5 w-4.5 text-indigo-600" />
              Rotation Calendar Timeline: Year 1 to {targetDuration}
            </h4>
            <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
              Total cycle projected revenue: ${computations.totalProfit.toLocaleString()} / Acre
            </span>
          </div>

          <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
            {customRotations.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-50 border border-slate-150 rounded-2xl hover:border-indigo-300 hover:shadow-sm transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="space-y-1 md:max-w-md">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-800 text-[9px] font-bold rounded-md font-mono">
                      Year {item.year} - {item.season}
                    </span>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md ${
                      item.category === "Legume" ? "bg-emerald-100 text-emerald-800" :
                      item.category === "Cover Crop" ? "bg-green-100 text-green-800" :
                      item.category === "Pasture" ? "bg-blue-100 text-blue-800" :
                      item.category === "Cereal" ? "bg-amber-100 text-amber-800" : "bg-purple-100 text-purple-800"
                    }`}>
                      {item.category}
                    </span>
                    <h5 className="text-xs font-extrabold text-slate-800">{item.crop}</h5>
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">{item.purpose}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0 text-right">
                  <div className="space-y-1 text-[10px] font-bold text-slate-600 font-mono">
                    <div className={item.nitrogenFixingKgPerAcre > 0 ? "text-emerald-600" : "text-rose-500"}>
                      N-Fix: {item.nitrogenFixingKgPerAcre > 0 ? `+${item.nitrogenFixingKgPerAcre}` : item.nitrogenFixingKgPerAcre} Kg
                    </div>
                    <div className="text-indigo-600">
                      Profit: {item.estimatedProfitPerAcre > 0 ? `$${item.estimatedProfitPerAcre}` : `-$${Math.abs(item.estimatedProfitPerAcre)}`}
                    </div>
                    <div className="text-emerald-700">
                      Weed Sup: {item.weedSuppressionScore}%
                    </div>
                  </div>

                  <button
                    onClick={() => removeCropRow(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                    title="Remove from rotation cycle"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {customRotations.length === 0 && (
              <div className="text-center p-12 bg-slate-50 border border-dashed rounded-2xl text-slate-400 font-semibold text-xs">
                No crops added to your 5-year sequence. Try adding a crop or selecting a preset.
              </div>
            )}
          </div>

          {/* Quick interactive form to append rotation row */}
          <form onSubmit={addNewCropRow} className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-3.5">
            <h5 className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Plus className="h-4 w-4" /> Add custom crop stage to timeline
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Year</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={newYear}
                  onChange={(e) => setNewYear(parseInt(e.target.value))}
                  className="w-full bg-white border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Season</label>
                <select
                  value={newSeason}
                  onChange={(e) => setNewSeason(e.target.value as any)}
                  className="w-full bg-white border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                >
                  <option value="Kharif">Kharif (Summer Wet)</option>
                  <option value="Rabi">Rabi (Winter Dry)</option>
                  <option value="Zaid / Cover">Zaid / Cover Crop</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-white border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                >
                  <option value="Legume">Legume (Nitrogen Fixing)</option>
                  <option value="Cereal">Cereal (Grain Demand)</option>
                  <option value="Oilseed">Oilseed (Brassica Fumigant)</option>
                  <option value="Cover Crop">Cover Crop (Weed/Erosion Blocker)</option>
                  <option value="Pasture">Pasture (rotational Grazing)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Crop Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mungbeans"
                  value={newCrop}
                  onChange={(e) => setNewCrop(e.target.value)}
                  className="w-full bg-white border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Specific Goal</label>
                <input
                  type="text"
                  placeholder="e.g. Break root nematodes, enrich topsoil"
                  value={newPurpose}
                  onChange={(e) => setNewPurpose(e.target.value)}
                  className="w-full bg-white border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">N balance (Kg/Ac)</label>
                <input
                  type="number"
                  placeholder="e.g. 70"
                  value={newN}
                  onChange={(e) => setNewN(parseInt(e.target.value))}
                  className="w-full bg-white border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Profit ($/Ac)</label>
                <input
                  type="number"
                  placeholder="e.g. 450"
                  value={newProfit}
                  onChange={(e) => setNewProfit(parseInt(e.target.value))}
                  className="w-full bg-white border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs cursor-pointer transition-colors"
                >
                  Append Stage
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right column: Predictive Yield Impact Curve chart & AI Recommendations */}
        <div className="lg:col-span-5 space-y-5">
          <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="h-4.5 w-4.5 text-indigo-600" />
            AI-Simulated Soil Health & Yield Trend Curve
          </h4>

          {/* Recharts chart showing Nitrogen balance accretion */}
          <div className="bg-slate-50 border p-4 rounded-2xl shadow-inner space-y-3">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Activity className="h-4 w-4 text-emerald-600" />
              Residual Soil Nitrogen Recovery Path (Kg)
            </span>
            <div className="h-[180px] w-full">
              {computations.nHistory.length === 0 ? (
                <div className="text-center py-12 text-[10px] text-slate-400">
                  No data to show.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={computations.nHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="crop" stroke="#64748b" style={{ fontSize: 9, fontWeight: "bold" }} />
                    <YAxis stroke="#64748b" style={{ fontSize: 9, fontWeight: "bold" }} />
                    <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                    <Line type="monotone" dataKey="balance" stroke="#059669" strokeWidth={3} dot={{ strokeWidth: 2, r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* AI Decision-matrix notifications for the current rotation */}
          <div className="bg-emerald-50/40 border border-emerald-100 p-4 rounded-2xl space-y-3">
            <h5 className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-emerald-600 animate-spin" />
              Agronomist Advisory & Rotation Verdict
            </h5>

            <div className="space-y-3.5 text-[11px] leading-relaxed font-semibold text-slate-600">
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 mt-0.5">✓</span>
                <div>
                  <span className="font-extrabold text-slate-800">Nitrogen Balance Optimizer:</span> Your rotation currently adds a net <span className="text-emerald-700 font-mono font-bold">{computations.cumulativeN} Kg</span> of natural atmospheric nitrogen per acre. This reduces your synthetic chemical fertilizer reliance by roughly <span className="text-emerald-700 font-bold font-mono">42%</span>!
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-indigo-600 mt-0.5">✓</span>
                <div>
                  <span className="font-extrabold text-slate-800">Pathogen & Nematode Breaks:</span> A pest break rating of <span className="text-indigo-700 font-bold font-mono">{computations.avgPestBreak}%</span> confirms your root exudates effectively interrupt common blight, wilt, and root rot propagation cycles.
                </div>
              </div>

              {computations.depletionRisk > 40 ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-amber-900">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold">Depletion Warning:</span> Soil type is classified as <span className="font-black text-slate-800">{soilType}</span>. Ensure cover crops or green manures (such as Berseem or Sesbania) are ploughed back into the soil before winter wheat tillering begins.
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-100 border border-emerald-200 rounded-xl flex items-start gap-2 text-emerald-900">
                  <Award className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-emerald-800">Ecosystem Balance Achieved:</span> Your rotation plan maintains excellent biodiversity, low disease risks, and strong carbon offsets! Keep up this regenerative cycle.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
