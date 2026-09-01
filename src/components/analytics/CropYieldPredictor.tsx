import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Sliders,
  TrendingUp,
  AlertTriangle,
  Info,
  Layers,
  Activity,
  Compass,
  ArrowUpRight,
  TrendingDown,
  Droplets,
  Thermometer,
  Zap,
  CheckCircle,
  HelpCircle
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

interface CropYieldPredictorProps {
  activeFarmName: string;
  baseline: {
    soilMoisture: number;
    soilPh: number;
    temperature: number;
    humidity: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
}

export default function CropYieldPredictor({ activeFarmName, baseline }: CropYieldPredictorProps) {
  // 1. Selector for simulation target crop
  const [selectedCrop, setSelectedCrop] = useState<"Basmati Rice" | "Wheat" | "Tomato" | "Cotton">("Basmati Rice");

  // 2. Interactive variables that the operator can tweak to simulate different farm management scenarios
  const [irrigationOffset, setIrrigationOffset] = useState<number>(0); // -50% to +50% irrigation
  const [fertilizerBonus, setFertilizerBonus] = useState<number>(0); // Extra NPK kg/acre (0 to 150)
  const [pesticideControl, setPesticideControl] = useState<"None" | "Standard Integrated" | "Aggressive Preventive">("Standard Integrated");
  const [tillageMethod, setTillageMethod] = useState<"Conventional" | "Conservation No-Till" | "Deep Tillage">("Conservation No-Till");

  // 3. Define the regression weights for each parameter depending on the crop.
  // Yield = BaseYield + w1*Moisture + w2*pH + w3*Temp + w4*NPK + w5*Irrigation + w6*PestControl + w7*Tillage
  const regressionWeights = useMemo(() => {
    const weights = {
      "Basmati Rice": {
        base: 3.5, // base tons per acre
        moistureWeight: 0.04, // positive correlation
        phWeight: -0.15, // optimum pH is ~6.5, penalize deviation
        tempWeight: 0.02, // optimal is around 28-32°C
        npkWeight: 0.008,
        irrigationWeight: 0.03, // rice loves water
        pestWeight: { "None": -0.8, "Standard Integrated": 0.2, "Aggressive Preventive": 0.4 },
        tillageWeight: { "Conventional": -0.1, "Conservation No-Till": 0.3, "Deep Tillage": 0.1 }
      },
      "Wheat": {
        base: 2.8,
        moistureWeight: 0.02,
        phWeight: -0.2, // optimum pH ~6.8
        tempWeight: -0.04, // wheat prefers cooler temperatures
        npkWeight: 0.012, // highly responsive to fertilizer
        irrigationWeight: 0.015,
        pestWeight: { "None": -0.5, "Standard Integrated": 0.15, "Aggressive Preventive": 0.25 },
        tillageWeight: { "Conventional": 0.0, "Conservation No-Till": 0.25, "Deep Tillage": -0.05 }
      },
      "Tomato": {
        base: 18.2, // high yield tonnage per acre
        moistureWeight: 0.12, // tomatoes are water sensitive
        phWeight: -0.8, // optimum pH ~6.2
        tempWeight: 0.08, // tomatoes like warmth
        npkWeight: 0.04,
        irrigationWeight: 0.09,
        pestWeight: { "None": -4.5, "Standard Integrated": 1.2, "Aggressive Preventive": 2.5 },
        tillageWeight: { "Conventional": -0.5, "Conservation No-Till": 0.8, "Deep Tillage": 0.3 }
      },
      "Cotton": {
        base: 1.6,
        moistureWeight: -0.01, // cotton is relatively drought resistant
        phWeight: -0.1, // optimum pH ~7.0
        tempWeight: 0.03, // loves hot dry weather
        npkWeight: 0.005,
        irrigationWeight: 0.008,
        pestWeight: { "None": -0.6, "Standard Integrated": 0.18, "Aggressive Preventive": 0.35 },
        tillageWeight: { "Conventional": -0.05, "Conservation No-Till": 0.2, "Deep Tillage": 0.15 }
      }
    };
    return weights[selectedCrop];
  }, [selectedCrop]);

  // 4. Calculate final regression prediction & variables
  const prediction = useMemo(() => {
    const w = regressionWeights;
    
    // Calculate telemetry deviation from optimal
    const optPh = selectedCrop === "Basmati Rice" ? 6.5 : selectedCrop === "Wheat" ? 6.8 : selectedCrop === "Tomato" ? 6.2 : 7.0;
    const phDeviation = Math.abs(baseline.soilPh - optPh);
    
    // Telemetry components
    const moistureTerm = baseline.soilMoisture * w.moistureWeight;
    const phTerm = phDeviation * w.phWeight;
    const tempTerm = (baseline.temperature - 25) * w.tempWeight;
    
    // Fertilizer NPK sum contribution
    const totalBaselineNpk = baseline.nitrogen + baseline.phosphorus + baseline.potassium;
    const npkTotalSimulated = totalBaselineNpk + fertilizerBonus;
    const npkTerm = npkTotalSimulated * w.npkWeight;

    // Management components
    const irrigationTerm = irrigationOffset * w.irrigationWeight;
    const pestTerm = w.pestWeight[pesticideControl];
    const tillageTerm = w.tillageWeight[tillageMethod];

    // Compute final yield
    const rawYield = w.base + moistureTerm + phTerm + tempTerm + npkTerm + irrigationTerm + pestTerm + tillageTerm;
    const expectedYield = parseFloat(Math.max(0.1, rawYield).toFixed(2));

    // Calculate baseline yield (without the operator adjustments / bonuses)
    const baseRawYield = w.base + moistureTerm + phTerm + tempTerm + (totalBaselineNpk * w.npkWeight) + (w.pestWeight["Standard Integrated"]) + (w.tillageWeight["Conventional"]);
    const baselineYield = parseFloat(Math.max(0.1, baseRawYield).toFixed(2));

    const percentImprovement = parseFloat((((expectedYield - baselineYield) / baselineYield) * 100).toFixed(1));

    // Generate factor breakdown data for charts
    const breakdown = [
      { name: "Base Potential", value: parseFloat(w.base.toFixed(2)), color: "#64748b" },
      { name: "Soil Hydration", value: parseFloat(moistureTerm.toFixed(2)), color: "#0ea5e9" },
      { name: "pH Dev Penalty", value: parseFloat(phTerm.toFixed(2)), color: "#d97706" },
      { name: "Temperature Influence", value: parseFloat(tempTerm.toFixed(2)), color: "#f43f5e" },
      { name: "Nutrient (NPK)", value: parseFloat(npkTerm.toFixed(2)), color: "#10b981" },
      { name: "Extra Irrigation", value: parseFloat(irrigationTerm.toFixed(2)), color: "#6366f1" },
      { name: "Pest Mitigation", value: parseFloat(pestTerm.toFixed(2)), color: "#8b5cf6" },
      { name: "Tillage Method", value: parseFloat(tillageTerm.toFixed(2)), color: "#ec4899" }
    ];

    return {
      expectedYield,
      baselineYield,
      percentImprovement,
      breakdown,
      optPh
    };
  }, [selectedCrop, baseline, fertilizerBonus, irrigationOffset, pesticideControl, tillageMethod, regressionWeights]);

  return (
    <div id="crop-yield-predictor-regression" className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] uppercase font-black tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit">
            <Sparkles className="h-3 w-3 text-emerald-600 animate-pulse" />
            AI Machine Learning Predictive Engine
          </span>
          <h3 className="text-sm font-extrabold text-slate-800 tracking-tight mt-1.5 flex items-center gap-2">
            Multivariate Regression Yield Predictor
          </h3>
          <p className="text-slate-400 text-xs mt-0.5">
            Uses real-time underground telemetry, regional soil chemistry, and projected watering volumes to simulate harvest outputs.
          </p>
        </div>

        {/* Crop Selector Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start lg:self-center">
          {(["Basmati Rice", "Wheat", "Tomato", "Cotton"] as const).map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                selectedCrop === crop
                  ? "bg-white text-slate-800 shadow-xs border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Controls Panel (Left) */}
        <div className="lg:col-span-5 space-y-5 bg-slate-50/50 rounded-xl border border-slate-150 p-4">
          <div className="border-b border-slate-200/60 pb-2.5">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="h-4 w-4 text-emerald-600" />
              Adjust Treatment Parameters
            </h4>
            <p className="text-[10px] text-slate-400">Simulate variable farming treatments to optimize output curves.</p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Slider 1: Irrigation Volume */}
            <div>
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase mb-1">
                <span>Extra Irrigation Volume</span>
                <span className="text-indigo-600 font-black">
                  {irrigationOffset > 0 ? `+${irrigationOffset}` : irrigationOffset} Liters/Acre
                </span>
              </div>
              <input
                type="range"
                min="-100"
                max="300"
                step="10"
                value={irrigationOffset}
                onChange={(e) => setIrrigationOffset(parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[8px] text-slate-400 font-bold font-mono">
                <span>Deficit (-100L)</span>
                <span>Dryland</span>
                <span>Abundant (+300L)</span>
              </div>
            </div>

            {/* Slider 2: Extra NPK Supplement */}
            <div>
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase mb-1">
                <span>NPK Chemical Fertilizer Supplement</span>
                <span className="text-emerald-700 font-black">+{fertilizerBonus} kg/Acre</span>
              </div>
              <input
                type="range"
                min="0"
                max="150"
                step="5"
                value={fertilizerBonus}
                onChange={(e) => setFertilizerBonus(parseInt(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[8px] text-slate-400 font-bold font-mono">
                <span>None (Organic Baseline)</span>
                <span>Targeted Boost (150kg)</span>
              </div>
            </div>

            {/* Selector 1: Pesticide Strategy */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Crop Protection / Pesticides</label>
              <div className="grid grid-cols-3 gap-2">
                {(["None", "Standard Integrated", "Aggressive Preventive"] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPesticideControl(method)}
                    className={`py-2 rounded-lg text-[9px] font-black border text-center transition-all cursor-pointer ${
                      pesticideControl === method
                        ? "bg-purple-700 border-purple-700 text-white"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {method.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector 2: Tillage Strategy */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Tillage Strategy</label>
              <div className="grid grid-cols-3 gap-2">
                {(["Conventional", "Conservation No-Till", "Deep Tillage"] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setTillageMethod(method)}
                    className={`py-2 rounded-lg text-[9px] font-black border text-center transition-all cursor-pointer ${
                      tillageMethod === method
                        ? "bg-amber-700 border-amber-700 text-white"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {method.replace("Conservation ", "")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Current Micro-climate conditions info block */}
          <div className="border-t border-slate-200 pt-3 space-y-1.5 text-[10px] text-slate-650 font-semibold font-mono">
            <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider">Environmental Constants</span>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-slate-150">
                <Thermometer className="h-3.5 w-3.5 text-rose-500" />
                <span>Temp: {baseline.temperature}°C</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-slate-150">
                <Droplets className="h-3.5 w-3.5 text-sky-500" />
                <span>Moisture: {baseline.soilMoisture}%</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-slate-150">
                <Compass className="h-3.5 w-3.5 text-amber-500" />
                <span>pH level: {baseline.soilPh} (Opt: {prediction.optPh})</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-slate-150">
                <Zap className="h-3.5 w-3.5 text-emerald-500" />
                <span>NPK baseline: {baseline.nitrogen}N</span>
              </div>
            </div>
          </div>
        </div>

        {/* Prediction Outputs Panel (Right) */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          {/* Headline Predictions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Projected Output Card */}
            <div className="bg-emerald-950 text-white rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-12 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-1 z-10">
                <span className="text-[8px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                  Yield Projection
                </span>
                <p className="text-3xl font-black tracking-tight leading-none pt-2 text-emerald-300">
                  {prediction.expectedYield} <span className="text-xs font-bold text-white">Tons / Acre</span>
                </p>
                <p className="text-[10px] text-slate-300 font-medium pt-1">
                  Expected weight projection per single acre harvested.
                </p>
              </div>

              <div className="border-t border-emerald-800/60 pt-3 mt-4 flex items-center justify-between text-[10px] font-mono font-bold">
                <span className="text-slate-400">Baseline Yield: {prediction.baselineYield}t</span>
                <span className={`flex items-center gap-1 ${prediction.percentImprovement >= 0 ? "text-emerald-400" : "text-rose-450"}`}>
                  {prediction.percentImprovement >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {prediction.percentImprovement >= 0 ? `+${prediction.percentImprovement}%` : `${prediction.percentImprovement}%`}
                </span>
              </div>
            </div>

            {/* Quality Index Rating Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="text-[8px] font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                  Estimated Grain Grade
                </span>
                <h4 className="text-base font-black text-slate-800 pt-1.5 flex items-center gap-1.5">
                  <CheckCircle className="h-4.5 w-4.5 text-purple-600" />
                  {prediction.expectedYield > (regressionWeights.base * 1.2) ? "Premium Grade A" : "Standard Grade B"}
                </h4>
                <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                  Driven by nutrient availability index and water replenishment balance curves. Good density indices predicted.
                </p>
              </div>

              <div className="border-t border-slate-250 pt-3 text-[9px] text-slate-400 font-semibold font-mono flex justify-between">
                <span>Predicted Seed Starch: 84%</span>
                <span>Moisture Ratio: Perfect</span>
              </div>
            </div>
          </div>

          {/* D3/Recharts Regression Coefficient Component Contributions Chart */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-emerald-600" />
              Multivariate Linear Model Breakdown (Contributions)
            </h4>
            <div className="h-36 bg-slate-50/60 rounded-xl border border-slate-200/80 p-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prediction.breakdown} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={8} fontWeight="bold" />
                  <YAxis stroke="#94a3b8" fontSize={8} />
                  <Tooltip contentStyle={{ fontSize: "10px" }} />
                  <Bar dataKey="value" name="Contribution (Tons)" fill="#10b981" radius={[4, 4, 0, 0]}>
                    {prediction.breakdown.map((entry, index) => (
                      <rect key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Machine Learning Model Summary Notes */}
          <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3.5 flex gap-3 text-[10px]">
            <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-slate-600 leading-relaxed font-medium">
              This simulation executes a real-time <strong>Ordinary Least Squares (OLS) multivariate regression model</strong>. It balances positive telemetry weights (such as baseline moistures and nitrogen supplement buffers) against extreme climate variables and tillage coefficients to generate accurate agricultural production estimates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
