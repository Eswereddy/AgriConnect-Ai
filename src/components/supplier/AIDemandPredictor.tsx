import React, { useState } from "react";
import { 
  TrendingUp, 
  MapPin, 
  Sun, 
  Layers, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Loader2, 
  X, 
  RefreshCw, 
  Package, 
  HelpCircle,
  TrendingDown,
  Activity
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
  Cell
} from "recharts";

interface AIDemandPredictorProps {
  onClose: () => void;
}

interface DemandData {
  demandForecast30Days: number;
  demandForecast60Days: number;
  demandForecast90Days: number;
  recommendedStockLevel: number;
  recommendation: "Increase stock" | "Reduce stock" | "Maintain stock";
  confidenceScore: number;
  marketInsights: string;
  riskFactors: string[];
  recommendedProducts: string[];
}

export default function AIDemandPredictor({ onClose }: AIDemandPredictorProps) {
  const [category, setCategory] = useState("Seeds");
  const [region, setRegion] = useState("Punjab");
  const [season, setSeason] = useState("Kharif (Monsoon)");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<DemandData | null>(null);

  const categories = ["Seeds", "Fertilizers", "Machinery", "IoT Sensors"];
  const regions = ["Punjab", "Haryana", "Maharashtra", "Karnataka", "Tamil Nadu", "Uttar Pradesh", "Gujarat", "Andhra Pradesh"];
  const seasons = ["Kharif (Monsoon)", "Rabi (Winter)", "Zaid (Summer)"];

  const handlePredict = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/supplier/demand-prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, region, season }),
      });

      if (!response.ok) {
        throw new Error("Could not process demand prediction. Please check your network connection.");
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while predicting demand.");
    } finally {
      setLoading(false);
    }
  };

  // Format Recharts demand timeline data
  const getChartData = () => {
    if (!prediction) return [];
    return [
      { name: "Current", DemandChange: 0, text: "Baseline" },
      { name: "30 Days", DemandChange: prediction.demandForecast30Days, text: `${prediction.demandForecast30Days > 0 ? "+" : ""}${prediction.demandForecast30Days}%` },
      { name: "60 Days", DemandChange: prediction.demandForecast60Days, text: `${prediction.demandForecast60Days > 0 ? "+" : ""}${prediction.demandForecast60Days}%` },
      { name: "90 Days", DemandChange: prediction.demandForecast90Days, text: `${prediction.demandForecast90Days > 0 ? "+" : ""}${prediction.demandForecast90Days}%` },
    ];
  };

  const chartData = getChartData();

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-100 rounded-3xl p-6 max-w-5xl w-full max-h-[90vh] shadow-2xl relative flex flex-col space-y-4 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 rounded-2xl border border-indigo-100/50">
              <TrendingUp className="h-6 w-6 text-indigo-600 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-tight">AI Input Demand Predictor</h3>
                <span className="bg-indigo-100/80 text-indigo-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-indigo-200">Gemini 3.5 Active</span>
              </div>
              <p className="text-slate-400 text-[10px] font-semibold">Forecast inventory demands, estimate recommended warehouse levels, and optimize local stock lines</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Container (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-6">
          
          {/* Main Predictor Form */}
          <form onSubmit={handlePredict} className="bg-slate-50 border border-slate-100/50 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            
            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <Layers className="h-3 w-3 text-indigo-500" /> Input Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-hidden transition-all shadow-2xs"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Region Select */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-rose-500" /> Target Region
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-hidden transition-all shadow-2xs"
              >
                {regions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Season Select */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <Sun className="h-3 w-3 text-amber-500" /> Target Season
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-hidden transition-all shadow-2xs"
              >
                {seasons.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-indigo-600/10 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Run Prediction
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-800">Prediction Engine Interrupted</h4>
                <p className="text-[11px] text-rose-600 font-semibold mt-0.5">{error}</p>
                <button
                  type="button"
                  onClick={() => handlePredict()}
                  className="mt-2 text-[10px] font-black text-rose-700 hover:text-rose-900 underline flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" /> Retry Analysis
                </button>
              </div>
            </div>
          )}

          {/* Initial State / Help Guide */}
          {!prediction && !loading && !error && (
            <div className="border border-dashed border-slate-200 rounded-2xl p-8 text-center max-w-xl mx-auto space-y-4">
              <div className="p-4 bg-indigo-50 rounded-full w-fit mx-auto">
                <Activity className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-tight">Generate Live Supply Chain Forecasts</h4>
                <p className="text-[11px] text-slate-400 font-medium">
                  Select your product category, geographical region, and seasonal cycle above. Our AI system will scan regional sensor models, farm weather outlooks, historical trade data, and local crop plans to compile a detailed 90-day demand matrix.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => { setCategory("Seeds"); setRegion("Punjab"); setSeason("Kharif (Monsoon)"); }}
                  className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  🌾 Seeds in Punjab (Kharif)
                </button>
                <button
                  type="button"
                  onClick={() => { setCategory("Fertilizers"); setRegion("Haryana"); setSeason("Rabi (Winter)"); }}
                  className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  🧪 Fertilizers in Haryana (Rabi)
                </button>
                <button
                  type="button"
                  onClick={() => { setCategory("Machinery"); setRegion("Maharashtra"); setSeason("Rabi (Winter)"); }}
                  className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  🚜 Machinery in Maharashtra
                </button>
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="space-y-6 animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-slate-50 h-24 rounded-2xl border border-slate-100"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-slate-50 h-64 rounded-2xl border border-slate-100"></div>
                <div className="bg-slate-50 h-64 rounded-2xl border border-slate-100"></div>
              </div>
            </div>
          )}

          {/* Results Display */}
          {prediction && !loading && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* KPIs Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Recommendation KPI */}
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between shadow-2xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Demand Directive</span>
                    <h4 className={`text-base font-black ${
                      prediction.recommendation === "Increase stock" ? "text-emerald-600" :
                      prediction.recommendation === "Reduce stock" ? "text-rose-600" : "text-amber-600"
                    }`}>
                      {prediction.recommendation}
                    </h4>
                  </div>
                  <div className={`p-3 rounded-xl border ${
                    prediction.recommendation === "Increase stock" ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                    prediction.recommendation === "Reduce stock" ? "bg-rose-50 border-rose-100 text-rose-600" : "bg-amber-50 border-amber-100 text-amber-600"
                  }`}>
                    {prediction.recommendation === "Increase stock" ? (
                      <ArrowUpRight className="h-6 w-6" />
                    ) : prediction.recommendation === "Reduce stock" ? (
                      <ArrowDownRight className="h-6 w-6" />
                    ) : (
                      <TrendingUp className="h-6 w-6 rotate-45" />
                    )}
                  </div>
                </div>

                {/* Recommended Stock Level */}
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between shadow-2xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Optimal Stock Level</span>
                    <h4 className="text-lg font-black text-slate-800">
                      {prediction.recommendedStockLevel.toLocaleString()} <span className="text-xs font-semibold text-slate-400">units</span>
                    </h4>
                  </div>
                  <div className="p-3 bg-slate-100/80 border border-slate-200/50 rounded-xl text-slate-600">
                    <Package className="h-6 w-6" />
                  </div>
                </div>

                {/* Confidence Score */}
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between shadow-2xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Forecast Confidence</span>
                    <h4 className="text-lg font-black text-indigo-600">
                      {prediction.confidenceScore}%
                    </h4>
                  </div>
                  <div className="p-3 bg-indigo-50 border border-indigo-100/50 rounded-xl text-indigo-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                </div>

              </div>

              {/* Data Visualization & Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Demand Forecast Chart */}
                <div className="lg:col-span-2 border border-slate-100 p-4 rounded-2xl shadow-2xs flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-tight flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-indigo-500" /> Projected Demand Shift Timeline (90 Days)
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400">Values represent % shift from baseline</span>
                  </div>
                  
                  {/* Recharts Area Chart */}
                  <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="name" 
                          stroke="#94a3b8" 
                          fontSize={9} 
                          fontWeight="bold"
                          tickLine={false}
                        />
                        <YAxis 
                          stroke="#94a3b8" 
                          fontSize={9} 
                          fontWeight="bold"
                          tickLine={false}
                          tickFormatter={(val) => `${val > 0 ? "+" : ""}${val}%`}
                        />
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const demandVal = payload[0].value as number;
                              return (
                                <div className="bg-slate-900 text-white p-2 text-[10px] rounded-lg shadow-lg border border-slate-800">
                                  <p className="font-bold">{payload[0].payload.name}</p>
                                  <p className="text-indigo-300 font-extrabold mt-0.5">
                                    Demand Shift: {demandVal > 0 ? "+" : ""}{demandVal}%
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="DemandChange" 
                          stroke="#4f46e5" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#colorDemand)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Horizontal Bar Visualizer */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                    <div className="p-2 bg-slate-50 rounded-xl text-center">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Next 30 Days</span>
                      <p className={`text-xs font-black mt-0.5 ${prediction.demandForecast30Days >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        {prediction.demandForecast30Days > 0 ? "+" : ""}{prediction.demandForecast30Days}%
                      </p>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl text-center">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Next 60 Days</span>
                      <p className={`text-xs font-black mt-0.5 ${prediction.demandForecast60Days >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        {prediction.demandForecast60Days > 0 ? "+" : ""}{prediction.demandForecast60Days}%
                      </p>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl text-center">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Next 90 Days</span>
                      <p className={`text-xs font-black mt-0.5 ${prediction.demandForecast90Days >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        {prediction.demandForecast90Days > 0 ? "+" : ""}{prediction.demandForecast90Days}%
                      </p>
                    </div>
                  </div>

                </div>

                {/* Recommended Products */}
                <div className="border border-slate-100 p-4 rounded-2xl shadow-2xs flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-tight flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-emerald-500" /> High-Demand Products
                    </h4>
                    <p className="text-[10px] text-slate-400 font-semibold">Priority SKUs predicted to experience the highest transaction volume based on harvest calendars:</p>
                    <div className="space-y-2 mt-2">
                      {prediction.recommendedProducts.map((p, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 p-2.5 bg-slate-50 hover:bg-slate-100/60 border border-slate-200/50 rounded-xl transition-colors">
                          <div className="h-5 w-5 bg-indigo-100 text-indigo-600 text-[10px] font-black rounded-lg flex items-center justify-center shrink-0">
                            {idx + 1}
                          </div>
                          <span className="text-[11px] font-bold text-slate-700 leading-tight">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 text-[10px] text-slate-400 font-medium leading-relaxed">
                    🌟 Direct procurement linkages from verified buyer demand queues are prioritized.
                  </div>
                </div>

              </div>

              {/* Insights and Risks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* AI Market Insights */}
                <div className="bg-slate-50 border border-slate-100/80 p-5 rounded-2xl space-y-2">
                  <h4 className="text-xs font-black text-indigo-700 uppercase tracking-tight flex items-center gap-1.5">
                    💡 Deep Market Intelligence & Insights
                  </h4>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                    {prediction.marketInsights}
                  </p>
                </div>

                {/* Supply Chain Risks */}
                <div className="bg-rose-50/40 border border-rose-100 p-5 rounded-2xl space-y-3">
                  <h4 className="text-xs font-black text-rose-700 uppercase tracking-tight flex items-center gap-1.5">
                    ⚠️ Critical Risk Factors & Constraints
                  </h4>
                  <div className="space-y-2">
                    {prediction.riskFactors.map((r, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-rose-800">
                        <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                        <span className="text-[11px] font-bold leading-tight">{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Footer info line */}
        <div className="shrink-0 pt-3 border-t border-slate-100 text-[9px] text-slate-400 font-medium flex items-center justify-between">
          <span>AI prediction accuracy is subject to localized weather patterns and global macro index variables.</span>
          <span>Last Calculated: Just Now</span>
        </div>

      </div>
    </div>
  );
}
