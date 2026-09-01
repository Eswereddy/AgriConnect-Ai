import React, { useState, useMemo } from "react";
import { ResearchPaper } from "../../types";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ReferenceLine,
  Cell
} from "recharts";
import {
  TrendingUp,
  FlaskConical,
  Activity,
  Plus,
  Scale,
  DollarSign,
  Sparkles,
  Database,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  BookOpen
} from "lucide-react";

interface ResearchAnalyticsModuleProps {
  papers: ResearchPaper[];
}

// Initial default high-fidelity datasets mapped to initial papers
const DEFAULT_DATASETS: Record<string, any[]> = {
  "paper-1": [
    { fertilizer: 20, yield: 1.8, soilPh: 6.8, efficiency: 90.0, crop: "Pearl Millet" },
    { fertilizer: 40, yield: 2.9, soilPh: 6.7, efficiency: 72.5, crop: "Pearl Millet" },
    { fertilizer: 60, yield: 4.1, soilPh: 6.5, efficiency: 68.3, crop: "Pearl Millet" },
    { fertilizer: 80, yield: 4.8, soilPh: 6.3, efficiency: 60.0, crop: "Pearl Millet" },
    { fertilizer: 100, yield: 5.2, soilPh: 6.1, efficiency: 52.0, crop: "Pearl Millet" },
    { fertilizer: 120, yield: 5.0, soilPh: 5.8, efficiency: 41.7, crop: "Pearl Millet" },
    { fertilizer: 140, yield: 4.4, soilPh: 5.5, efficiency: 31.4, crop: "Pearl Millet" },
  ],
  "paper-2": [
    { fertilizer: 30, yield: 3.5, soilPh: 6.6, efficiency: 116.7, crop: "Basmati Rice" },
    { fertilizer: 70, yield: 5.8, soilPh: 6.5, efficiency: 82.9, crop: "Basmati Rice" },
    { fertilizer: 110, yield: 7.3, soilPh: 6.3, efficiency: 66.4, crop: "Basmati Rice" },
    { fertilizer: 150, yield: 8.1, soilPh: 6.0, efficiency: 54.0, crop: "Basmati Rice" },
    { fertilizer: 190, yield: 7.7, soilPh: 5.7, efficiency: 40.5, crop: "Basmati Rice" },
    { fertilizer: 230, yield: 6.9, soilPh: 5.4, efficiency: 30.0, crop: "Basmati Rice" },
  ]
};

// Generates an on-demand high-fidelity dataset for custom research papers
const generatePaperDataset = (title: string) => {
  const isRice = title.toLowerCase().includes("rice") || title.toLowerCase().includes("paddy");
  const isWheat = title.toLowerCase().includes("wheat");
  const isMillet = title.toLowerCase().includes("millet") || title.toLowerCase().includes("ragi") || title.toLowerCase().includes("finger");
  const crop = isRice ? "Rice" : isWheat ? "Wheat" : isMillet ? "Millet" : "Legumes";
  
  const baseYield = isRice ? 3.2 : isWheat ? 2.6 : isMillet ? 1.6 : 2.1;
  const sweetSpot = isRice ? 140 : isWheat ? 110 : isMillet ? 75 : 100;
  
  const dataset = [];
  const points = [20, 50, 85, 120, 155, 190, 225];
  for (const fert of points) {
    const diff = fert - sweetSpot;
    const peakYield = baseYield + 3.6;
    const factor = isMillet ? 0.00028 : 0.00016;
    // Quadratic agronomic response curve with minor randomized noise
    const noise = Math.sin(fert) * 0.15;
    const simulatedYield = Math.max(1.0, parseFloat((peakYield - factor * diff * diff + noise).toFixed(2)));
    const efficiency = parseFloat(((simulatedYield * 1000) / fert).toFixed(1));
    const soilPh = parseFloat((6.75 - 0.0055 * fert).toFixed(2));
    dataset.push({
      fertilizer: fert,
      yield: simulatedYield,
      crop,
      efficiency,
      soilPh
    });
  }
  return dataset;
};

export default function ResearchAnalyticsModule({ papers }: ResearchAnalyticsModuleProps) {
  // We maintain dynamic datasets for all papers so researchers can append their own data points
  const [datasets, setDatasets] = useState<Record<string, any[]>>(DEFAULT_DATASETS);
  const [selectedPaperId, setSelectedPaperId] = useState<string>(papers[0]?.id || "paper-1");

  // Form states for adding custom experimental data
  const [inputFertilizer, setInputFertilizer] = useState<string>("");
  const [inputYield, setInputYield] = useState<string>("");
  const [inputCrop, setInputCrop] = useState<string>("");
  const [formError, setFormError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  // Retrieve or generate dataset for currently selected paper
  const activeDataset = useMemo(() => {
    if (datasets[selectedPaperId]) {
      return datasets[selectedPaperId];
    }
    // Generate dynamically if it doesn't exist
    const selectedPaper = papers.find(p => p.id === selectedPaperId);
    const paperTitle = selectedPaper ? selectedPaper.title : "Custom Farm Study";
    const newDataset = generatePaperDataset(paperTitle);
    
    // Save to datasets state so it is stored and editable
    setDatasets(prev => ({
      ...prev,
      [selectedPaperId]: newDataset
    }));
    return newDataset;
  }, [selectedPaperId, papers, datasets]);

  // Compute key insights from current active dataset
  const insights = useMemo(() => {
    if (!activeDataset || activeDataset.length === 0) return null;

    // Find point with highest yield
    let peakPoint = activeDataset[0];
    let minPhPoint = activeDataset[0];
    
    for (const pt of activeDataset) {
      if (pt.yield > peakPoint.yield) {
        peakPoint = pt;
      }
      if (pt.soilPh < minPhPoint.soilPh) {
        minPhPoint = pt;
      }
    }

    // Average Fertilizer Use Efficiency (FUE)
    const avgFUE = parseFloat((activeDataset.reduce((sum, pt) => sum + pt.efficiency, 0) / activeDataset.length).toFixed(1));
    
    // Acidification threshold: points where soil pH drops below 6.0
    const highAcidPoints = activeDataset.filter(pt => pt.soilPh < 6.0);
    const acidThreshold = highAcidPoints.length > 0 ? Math.min(...highAcidPoints.map(p => p.fertilizer)) : null;

    return {
      peakYield: peakPoint.yield,
      optimalFertilizer: peakPoint.fertilizer,
      cropName: peakPoint.crop,
      avgFUE,
      currentPh: minPhPoint.soilPh,
      acidThreshold,
    };
  }, [activeDataset]);

  const activePaper = useMemo(() => {
    return papers.find(p => p.id === selectedPaperId) || {
      id: "custom",
      title: "Active Simulation Workspace",
      author: "Cooperative Lab System",
      domain: "Agronomic Modeling",
      summary: "Dynamic modeling environment evaluating local multi-crop response matrices vs. chemical inputs.",
      date: new Date().toLocaleDateString()
    };
  }, [selectedPaperId, papers]);

  // Handle adding custom trial points
  const handleAddTrial = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSuccessMsg("");

    const fertVal = parseFloat(inputFertilizer);
    const yieldVal = parseFloat(inputYield);

    if (isNaN(fertVal) || fertVal <= 0) {
      setFormError("Please enter a valid Fertilizer rate greater than 0 kg/ha");
      return;
    }
    if (isNaN(yieldVal) || yieldVal <= 0) {
      setFormError("Please enter a valid Yield value greater than 0 tons/ha");
      return;
    }

    const resolvedCrop = inputCrop.trim() || insights?.cropName || "Crop";
    const simulatedPh = parseFloat((6.85 - 0.0055 * fertVal + (Math.random() * 0.1 - 0.05)).toFixed(2));
    const calculatedFUE = parseFloat(((yieldVal * 1000) / fertVal).toFixed(1));

    const newPoint = {
      fertilizer: fertVal,
      yield: yieldVal,
      soilPh: simulatedPh,
      efficiency: calculatedFUE,
      crop: resolvedCrop
    };

    // Add point and sort dataset by fertilizer so the charts draw smoothly
    const updatedDataset = [...activeDataset, newPoint].sort((a, b) => a.fertilizer - b.fertilizer);

    setDatasets(prev => ({
      ...prev,
      [selectedPaperId]: updatedDataset
    }));

    setInputFertilizer("");
    setInputYield("");
    setSuccessMsg(`Experimental trial recorded! Integrated ${fertVal} kg/ha rate into the database.`);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div id="research-analytics-dashboard" className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-6 animate-in fade-in duration-200">
      
      {/* Module Title Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-teal-700" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Agronomic Trial Analyzer (Recharts Core)
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            Empirical statistical analysis modeling chemical fertilizer saturation vs. crop yield returns.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-xl text-[10.5px] text-teal-800 font-extrabold shadow-sm">
          <FlaskConical className="h-3.5 w-3.5 text-teal-600 animate-pulse" />
          Precision Research Sandbox
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Paper Selector Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <BookOpen className="h-3 w-3 text-slate-400" />
              1. Choose Shared Paper
            </h4>
            <span className="text-[9px] font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">
              {papers.length} Published
            </span>
          </div>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {papers.map((paper) => {
              const isSelected = paper.id === selectedPaperId;
              return (
                <button
                  key={paper.id}
                  id={`analytics-paper-btn-${paper.id}`}
                  onClick={() => {
                    setSelectedPaperId(paper.id);
                    setFormError("");
                    setSuccessMsg("");
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                    isSelected
                      ? "bg-white border-teal-500 shadow-md ring-2 ring-teal-500/20"
                      : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 w-full">
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                      isSelected ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-500"
                    }`}>
                      {paper.domain}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400">
                      {paper.date}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-800 leading-snug line-clamp-2">
                    {paper.title}
                  </h5>
                  <p className="text-[10px] text-slate-400 font-semibold leading-none">
                    Lead: {paper.author}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Scientific Context Tip */}
          <div className="bg-slate-100/80 border border-slate-200/60 rounded-xl p-3.5 text-[10.5px] text-slate-500 space-y-2">
            <div className="flex items-center gap-1.5 text-slate-700 font-bold">
              <AlertCircle className="h-3.5 w-3.5 text-slate-500" />
              Scientific Rule of Thumb
            </div>
            <p className="leading-relaxed font-medium">
              Over-fertilization leads to soil acidification. This simulator matches yield responses to empirical quadratic models, predicting chemical saturation curves.
            </p>
          </div>
        </div>

        {/* Right Side: Active Analysis and Recharts Visualizer */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Active Paper Header Summary */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-sm space-y-2">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
              <p className="text-[9.5px] text-teal-600 font-bold uppercase tracking-widest flex items-center gap-1">
                <Activity className="h-3 w-3 text-teal-600" />
                Active Dataset Focus
              </p>
              <p className="text-[10px] text-slate-400 font-semibold">
                Published by {activePaper.author} • {activePaper.views || 45} peer reads
              </p>
            </div>
            <h4 className="text-sm font-bold text-slate-800 leading-normal">
              {activePaper.title}
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed italic">
              &ldquo;{activePaper.summary}&rdquo;
            </p>
          </div>

          {/* Interactive Recharts Graphics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Chart 1: Agronomic Response Curve (Composed) */}
            <div id="yield-curve-chart" className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
              <div className="mb-3">
                <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                  Crop Response Curve
                </h5>
                <p className="text-[9.5px] text-slate-400 font-medium">
                  Yield (tons/ha) & Soil pH vs. Fertilizer rate (kg/ha)
                </p>
              </div>

              <div className="h-[210px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={activeDataset} margin={{ top: 10, right: -5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="fertilizer" 
                      tick={{ fontSize: 9, fill: "#64748b" }}
                      label={{ value: "Fertilizer Input (kg/ha)", position: "insideBottom", offset: -2, fontSize: 8, fill: "#94a3b8" }}
                    />
                    <YAxis 
                      yAxisId="left"
                      tick={{ fontSize: 9, fill: "#059669" }}
                      label={{ value: "Yield (tons/ha)", angle: -90, position: "insideLeft", offset: 12, fontSize: 8, fill: "#059669" }} 
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      domain={[4.5, 7.5]}
                      tick={{ fontSize: 9, fill: "#ef4444" }}
                      label={{ value: "Soil pH (Acidification)", angle: 90, position: "insideRight", offset: 10, fontSize: 8, fill: "#ef4444" }}
                    />
                    <Tooltip 
                      contentStyle={{ fontSize: "10.5px", borderRadius: "10px", borderColor: "#cbd5e1" }}
                      formatter={(value: any, name: string) => {
                        if (name.includes("Yield")) return [`${value} tons/ha`, "Crop Yield"];
                        if (name.includes("pH")) return [`${value} pH`, "Soil pH Level"];
                        return [value, name];
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "9px" }} />
                    
                    {/* Plot Yield as smooth emerald curve */}
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      name="Observed Yield" 
                      dataKey="yield" 
                      stroke="#059669" 
                      strokeWidth={3} 
                      activeDot={{ r: 6 }} 
                    />
                    {/* Plot Soil pH as red dashed curve representing acidification hazard */}
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      name="Soil pH Indicator" 
                      dataKey="soilPh" 
                      stroke="#ef4444" 
                      strokeWidth={2} 
                      strokeDasharray="4 4" 
                    />

                    {/* Reference Line showing Peak Yield sweet spot */}
                    {insights && (
                      <ReferenceLine 
                        yAxisId="left" 
                        x={insights.optimalFertilizer} 
                        stroke="#d97706" 
                        strokeDasharray="3 3"
                        label={{ value: "Peak", fill: "#d97706", fontSize: 8, position: "top" }} 
                      />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              
              <p className="text-[9px] text-slate-400 font-medium text-center italic mt-1.5">
                X-axis reflects chemical application load. Highlight shows sweet spot.
              </p>
            </div>

            {/* Chart 2: Fertilizer Use Efficiency & Economic Cost */}
            <div id="efficiency-cost-chart" className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
              <div className="mb-3">
                <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                  Nutrient Efficiency vs. Economic Cost
                </h5>
                <p className="text-[9.5px] text-slate-400 font-medium">
                  FUE (kg grain per kg N) & Est. Fertilizer Cost ($/ha)
                </p>
              </div>

              <div className="h-[210px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activeDataset} margin={{ top: 10, right: -5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="fertilizer" 
                      tick={{ fontSize: 9, fill: "#64748b" }}
                      label={{ value: "Input Rate (kg/ha)", position: "insideBottom", offset: -2, fontSize: 8, fill: "#94a3b8" }}
                    />
                    <YAxis 
                      yAxisId="left"
                      tick={{ fontSize: 9, fill: "#0d9488" }}
                      label={{ value: "FUE (kg/kg)", angle: -90, position: "insideLeft", offset: 12, fontSize: 8, fill: "#0d9488" }} 
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 9, fill: "#b45309" }}
                      label={{ value: "Cost ($/ha)", angle: 90, position: "insideRight", offset: 10, fontSize: 8, fill: "#b45309" }}
                    />
                    <Tooltip 
                      contentStyle={{ fontSize: "10.5px", borderRadius: "10px", borderColor: "#cbd5e1" }}
                      formatter={(value: any, name: string) => {
                        if (name.includes("FUE")) return [`${value} kg grain/kg input`, "Fertilizer Use Efficiency"];
                        if (name.includes("Cost")) return [`$${parseFloat((value).toFixed(1))} / ha`, "Fertilizer Cost"];
                        return [value, name];
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "9px" }} />
                    
                    {/* Efficiency represented as Teal Bar */}
                    <Bar 
                      yAxisId="left" 
                      name="FUE Index" 
                      dataKey="efficiency" 
                      fill="#0d9488" 
                      radius={[3, 3, 0, 0]} 
                    />
                    
                    {/* Fertilizer Cost represented as Amber line (assuming $0.90 per kg fertilizer) */}
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      name="Estimated Cost ($)" 
                      dataKey={(pt) => parseFloat((pt.fertilizer * 0.9).toFixed(1))} 
                      stroke="#b45309" 
                      strokeWidth={2} 
                      dot={{ fill: "#b45309", r: 3 }} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <p className="text-[9px] text-slate-400 font-medium text-center italic mt-1.5">
                Teal bars show return per unit. Brown curve tracks direct variable cost.
              </p>
            </div>

          </div>

          {/* Dynamic Scientific Insights Panels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5 space-y-1">
              <p className="text-[9px] text-emerald-700 font-bold uppercase tracking-wider">Agronomic Sweet Spot</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-emerald-800">{insights?.optimalFertilizer}</span>
                <span className="text-xs font-semibold text-emerald-600">kg / ha</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal font-medium">
                Optimizes yield returns for <strong className="text-slate-700">{insights?.cropName}</strong> at <strong className="text-slate-700">{insights?.peakYield} tons/ha</strong>.
              </p>
            </div>

            <div className="bg-red-50/40 border border-red-100 rounded-xl p-3.5 space-y-1">
              <p className="text-[9px] text-red-700 font-bold uppercase tracking-wider">Soil Acidification Risk</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-red-800">{insights?.currentPh}</span>
                <span className="text-xs font-semibold text-red-500">Min pH</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal font-medium">
                {insights && insights.acidThreshold ? (
                  <span>Acidification hazard begins at <strong className="text-red-700">{insights.acidThreshold} kg/ha</strong>. High priority soil liming recommended.</span>
                ) : (
                  <span>Soil pH remains stable within active testing boundaries. Crop has excellent bio-buffering.</span>
                )}
              </p>
            </div>

            <div className="bg-teal-50/50 border border-teal-100 rounded-xl p-3.5 space-y-1">
              <p className="text-[9px] text-teal-700 font-bold uppercase tracking-wider">Mean Efficiency Index</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-teal-800">{insights?.avgFUE}</span>
                <span className="text-xs font-semibold text-teal-600">kg grain / kg</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal font-medium">
                Average Fertilizer Use Efficiency (FUE) across trials. Higher implies lower chemical wastage.
              </p>
            </div>

          </div>

          {/* Form to insert custom scientific trial data point */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-sm space-y-3.5">
            <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Plus className="h-4 w-4 text-teal-700" />
              <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                2. Insert Custom Experimental Trial
              </h5>
            </div>

            <form onSubmit={handleAddTrial} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Fertilizer Rate (kg/ha)
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  max="500"
                  placeholder="e.g. 100"
                  value={inputFertilizer}
                  onChange={(e) => setInputFertilizer(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Observed Crop Yield (tons/ha)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  max="25"
                  placeholder="e.g. 5.6"
                  value={inputYield}
                  onChange={(e) => setInputYield(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Crop Variety Label
                </label>
                <input
                  type="text"
                  placeholder={insights?.cropName || "e.g. Pearl Millet"}
                  value={inputCrop}
                  onChange={(e) => setInputCrop(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium"
                />
              </div>

              <button
                type="submit"
                id="add-trial-point-btn"
                className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Insert Trial
              </button>
            </form>

            {formError && (
              <div className="text-[10.5px] font-semibold text-red-600 bg-red-50 px-3 py-2 rounded-lg flex items-center gap-1.5 animate-in fade-in">
                <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                {formError}
              </div>
            )}

            {successMsg && (
              <div className="text-[10.5px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-2 rounded-lg flex items-center gap-1.5 animate-in fade-in">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                {successMsg}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
