import React, { useState } from "react";
import { 
  DollarSign, 
  Tag, 
  HelpCircle, 
  X, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Loader2, 
  AlertCircle, 
  Scale, 
  Percent, 
  Users,
  Briefcase
} from "lucide-react";
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Bar, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";

interface AIPricingOptimizerProps {
  onClose: () => void;
  products?: { name: string; price: number; category: string }[];
}

interface PricingData {
  optimalPrice: number;
  suggestedDiscount: number;
  recommendation: "Increase price" | "Decrease price" | "Maintain price";
  elasticityScore: number;
  sensitivityAnalysis: string;
  projectedMarginChange: number;
  competitorPositioning: string;
}

export default function AIPricingOptimizer({ onClose, products = [] }: AIPricingOptimizerProps) {
  // Use inventory products if available, else standard fallback inputs
  const defaultProducts = products.length > 0 ? products : [
    { name: "Hybrid Basmati Paddy Seeds (10kg)", price: 650, category: "Seeds" },
    { name: "Premium Neem Coated Urea (50kg)", price: 420, category: "Fertilizers" },
    { name: "Sub-surface Soil Moisture IoT Node", price: 3400, category: "IoT Sensors" },
    { name: "Automatic Laser Land Leveler Blade", price: 45000, category: "Machinery" }
  ];

  const [selectedProduct, setSelectedProduct] = useState(defaultProducts[0].name);
  const [currentPrice, setCurrentPrice] = useState(defaultProducts[0].price);
  
  // Competitor prices as comma separated values
  const [competitorInput, setCompetitorInput] = useState("610, 680, 640");
  const [demandContext, setDemandContext] = useState("High");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optimizerResult, setOptimizerResult] = useState<PricingData | null>(null);

  // Sync price if product changes
  const handleProductChange = (prodName: string) => {
    setSelectedProduct(prodName);
    const prod = defaultProducts.find((p) => p.name === prodName);
    if (prod) {
      setCurrentPrice(prod.price);
      // Auto-set mock competitor coordinates based on baseline price
      const baseline = prod.price;
      const c1 = Math.round(baseline * 0.94);
      const c2 = Math.round(baseline * 1.05);
      const c3 = Math.round(baseline * 0.98);
      setCompetitorInput(`${c1}, ${c2}, ${c3}`);
    }
  };

  const handleOptimize = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    // Parse competitor prices
    const competitorPrices = competitorInput
      .split(",")
      .map((p) => parseFloat(p.trim()))
      .filter((p) => !isNaN(p) && p > 0);

    try {
      const response = await fetch("/api/supplier/pricing-optimization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: selectedProduct,
          currentPrice: Number(currentPrice),
          competitorPrices,
          demandContext
        }),
      });

      if (!response.ok) {
        throw new Error("Could not process pricing strategy analysis. Please try again.");
      }

      const data = await response.json();
      setOptimizerResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during optimization.");
    } finally {
      setLoading(false);
    }
  };

  // Generate dynamic chart points based on price changes around optimal
  const getElasticityChartData = () => {
    if (!optimizerResult) return [];
    const opt = optimizerResult.optimalPrice;
    const base = Number(currentPrice);
    
    // Generate a response curve showing how demand units shift with price (demand = constant / price^elasticity)
    // Elasticity formula simulation
    const elasticity = optimizerResult.elasticityScore;
    
    // Create points from -20% of optimal to +20%
    const steps = [-20, -10, 0, 10, 20];
    return steps.map((percent) => {
      const targetPrice = Math.round(opt * (1 + percent / 100));
      // relative sales quantity estimation based on elasticity
      const quantityMultiplier = Math.pow(opt / targetPrice, elasticity);
      // hypothetical baseline sales of 100 units at optimal price
      const projectedQuantity = Math.round(100 * quantityMultiplier);
      const projectedRevenue = Math.round(targetPrice * projectedQuantity);

      return {
        pricePoint: `₹${targetPrice}`,
        priceVal: targetPrice,
        QuantityShift: projectedQuantity,
        ProjectedRevenue: projectedRevenue,
        isOptimal: percent === 0 ? "Optimal" : "Draft"
      };
    });
  };

  const elasticityData = getElasticityChartData();

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-100 rounded-3xl p-6 max-w-5xl w-full max-h-[90vh] shadow-2xl relative flex flex-col space-y-4 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-violet-50 rounded-2xl border border-violet-100/50">
              <DollarSign className="h-6 w-6 text-violet-600 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-tight">AI Dynamic Pricing Optimizer</h3>
                <span className="bg-violet-100/80 text-violet-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-violet-200">Elasticity ML Active</span>
              </div>
              <p className="text-slate-400 text-[10px] font-semibold">Simulate local buyer price sensitivity, competitor benchmarks, and optimize gross margins</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-6">
          
          {/* Inputs Section */}
          <form onSubmit={handleOptimize} className="bg-slate-50 border border-slate-100/50 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            
            {/* Target Product */}
            <div className="space-y-1.5 col-span-1 md:col-span-2">
              <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <Briefcase className="h-3 w-3 text-violet-500" /> Target Wholesale Product
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedProduct}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-violet-500 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-hidden transition-all shadow-2xs"
                >
                  {defaultProducts.map((p) => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Current Price (Editable) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <DollarSign className="h-3 w-3 text-emerald-500" /> Current Price (₹)
              </label>
              <input
                type="number"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(Number(e.target.value))}
                min={1}
                className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-violet-500 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-hidden transition-all shadow-2xs"
              />
            </div>

            {/* Demand Context */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <TrendingUp className="h-3 w-3 text-indigo-500" /> Market Demand Context
              </label>
              <select
                value={demandContext}
                onChange={(e) => setDemandContext(e.target.value)}
                className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-violet-500 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-hidden transition-all shadow-2xs"
              >
                <option value="High">High Sowing Intensity</option>
                <option value="Medium">Standard Stable Demand</option>
                <option value="Low">Off-Season Saturated</option>
              </select>
            </div>

            {/* Competitor Price CSV Line */}
            <div className="space-y-1.5 col-span-1 md:col-span-3">
              <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <Users className="h-3 w-3 text-rose-500" /> Competitor Wholesale Prices (₹, separated by commas)
              </label>
              <input
                type="text"
                value={competitorInput}
                onChange={(e) => setCompetitorInput(e.target.value)}
                placeholder="e.g. 620, 685, 640"
                className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-violet-500 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-hidden transition-all shadow-2xs"
              />
            </div>

            {/* Action Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-violet-600/10 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Optimize Price
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-800">Dynamic Pricing System Interrupted</h4>
                <p className="text-[11px] text-rose-600 font-semibold mt-0.5">{error}</p>
                <button
                  type="button"
                  onClick={() => handleOptimize()}
                  className="mt-2 text-[10px] font-black text-rose-700 hover:text-rose-900 underline flex items-center gap-1"
                >
                  Optimize Again
                </button>
              </div>
            </div>
          )}

          {/* Initial State Helper */}
          {!optimizerResult && !loading && !error && (
            <div className="border border-dashed border-slate-200 rounded-2xl p-8 text-center max-w-xl mx-auto space-y-4">
              <div className="p-4 bg-violet-50 rounded-full w-fit mx-auto">
                <Scale className="h-8 w-8 text-violet-600" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-tight">Run Live Elasticity Simulations</h4>
                <p className="text-[11px] text-slate-400 font-medium">
                  Input competitor pricing coordinates, local farming seasons, and baseline wholesale values. The AI model will calculate purchase thresholds, price elasticity matrices, and provide clear actionable pricing recommendations.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleProductChange("Hybrid Basmati Paddy Seeds (10kg)");
                    setDemandContext("High");
                  }}
                  className="text-[10px] font-bold text-slate-500 hover:text-violet-600 bg-slate-50 hover:bg-violet-50 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  🌾 Seeds High Sowing Season
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleProductChange("Premium Neem Coated Urea (50kg)");
                    setDemandContext("Medium");
                  }}
                  className="text-[10px] font-bold text-slate-500 hover:text-violet-600 bg-slate-50 hover:bg-violet-50 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  🧪 Fertilizer Standard Market
                </button>
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="space-y-6 animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="bg-slate-50 h-20 rounded-2xl border border-slate-100 animate-pulse"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-slate-50 h-64 rounded-2xl border border-slate-100"></div>
                <div className="bg-slate-50 h-64 rounded-2xl border border-slate-100"></div>
              </div>
            </div>
          )}

          {/* Results Area */}
          {optimizerResult && !loading && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Output Summary KPI cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                {/* Recommendation Target */}
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between shadow-2xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Pricing Directive</span>
                    <h4 className={`text-sm font-black uppercase ${
                      optimizerResult.recommendation === "Increase price" ? "text-emerald-600" :
                      optimizerResult.recommendation === "Decrease price" ? "text-rose-600" : "text-amber-600"
                    }`}>
                      {optimizerResult.recommendation}
                    </h4>
                  </div>
                  <div className={`p-2 rounded-xl border ${
                    optimizerResult.recommendation === "Increase price" ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                    optimizerResult.recommendation === "Decrease price" ? "bg-rose-50 border-rose-100 text-rose-600" : "bg-amber-50 border-amber-100 text-amber-600"
                  }`}>
                    {optimizerResult.recommendation === "Increase price" ? (
                      <ArrowUpRight className="h-5 w-5" />
                    ) : optimizerResult.recommendation === "Decrease price" ? (
                      <ArrowDownRight className="h-5 w-5" />
                    ) : (
                      <TrendingUp className="h-5 w-5 rotate-45" />
                    )}
                  </div>
                </div>

                {/* Optimal Recommended Price */}
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between shadow-2xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Optimal Price</span>
                    <h4 className="text-base font-black text-slate-800">
                      ₹{optimizerResult.optimalPrice.toLocaleString()} 
                      <span className="text-[10px] font-medium text-slate-400 ml-1.5">
                        (vs. ₹{currentPrice})
                      </span>
                    </h4>
                  </div>
                  <div className="p-2.5 bg-violet-50 border border-violet-100/50 rounded-xl text-violet-600 font-extrabold">
                    ₹
                  </div>
                </div>

                {/* Suggested Discount */}
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between shadow-2xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Suggested Promo Tag</span>
                    <h4 className="text-base font-black text-slate-800">
                      {optimizerResult.suggestedDiscount}% <span className="text-[10px] font-medium text-slate-400">off</span>
                    </h4>
                  </div>
                  <div className="p-2.5 bg-amber-50 border border-amber-100/50 rounded-xl text-amber-600">
                    <Percent className="h-5 w-5" />
                  </div>
                </div>

                {/* Projected Gross Margin Change */}
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between shadow-2xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Margin Impact</span>
                    <h4 className={`text-base font-black ${optimizerResult.projectedMarginChange >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {optimizerResult.projectedMarginChange >= 0 ? "+" : ""}{optimizerResult.projectedMarginChange}%
                    </h4>
                  </div>
                  <div className="p-2.5 bg-emerald-50 border border-emerald-100/50 rounded-xl text-emerald-600">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                </div>

              </div>

              {/* Graphical Analysis & Competitors */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Elasticity Chart */}
                <div className="lg:col-span-2 border border-slate-100 p-4 rounded-2xl shadow-2xs flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-700 uppercase tracking-tight flex items-center gap-1.5">
                        <Scale className="h-4 w-4 text-violet-500" /> Pricing Elasticity Simulation Map
                      </h4>
                      <p className="text-[10px] text-slate-400 font-semibold">How quantity sales projections scale across customized target prices</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        Elasticity Score: {optimizerResult.elasticityScore}
                      </span>
                    </div>
                  </div>

                  {/* Recharts Chart */}
                  <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={elasticityData} margin={{ top: 10, right: -5, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="pricePoint" 
                          stroke="#94a3b8" 
                          fontSize={9} 
                          fontWeight="bold"
                          tickLine={false}
                        />
                        <YAxis 
                          yAxisId="left"
                          stroke="#94a3b8" 
                          fontSize={9} 
                          fontWeight="bold"
                          tickLine={false}
                          label={{ value: 'Projected Volume Units', angle: -90, position: 'insideLeft', fontSize: 8, fill: '#64748b' }}
                        />
                        <YAxis 
                          yAxisId="right"
                          orientation="right"
                          stroke="#a78bfa" 
                          fontSize={9} 
                          fontWeight="bold"
                          tickLine={false}
                          tickFormatter={(val) => `₹${Math.round(val / 1000)}k`}
                          label={{ value: 'Gross Revenue Output', angle: 90, position: 'insideRight', fontSize: 8, fill: '#a78bfa' }}
                        />
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const q = payload[0].value as number;
                              const r = payload[1].value as number;
                              const name = payload[0].payload.pricePoint;
                              const isOpt = payload[0].payload.isOptimal === "Optimal";
                              return (
                                <div className="bg-slate-900 text-white p-2 text-[10px] rounded-lg shadow-lg border border-slate-800 space-y-0.5">
                                  <p className="font-extrabold text-slate-300">{name} {isOpt ? "(Recommended Optimal)" : ""}</p>
                                  <p className="font-bold">Quantity Index: {q} units</p>
                                  <p className="text-violet-300 font-extrabold">Projected Revenue: ₹{r.toLocaleString()}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar yAxisId="left" dataKey="QuantityShift" fill="#e2e8f0" barSize={25} radius={[4, 4, 0, 0]}>
                          {elasticityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.isOptimal === "Optimal" ? "#818cf8" : "#cbd5e1"} />
                          ))}
                        </Bar>
                        <Line yAxisId="right" type="monotone" dataKey="ProjectedRevenue" stroke="#8b5cf6" strokeWidth={2.5} activeDot={{ r: 6 }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="text-[10px] text-slate-400 font-medium flex items-center justify-between pt-1 border-t border-slate-50">
                    <span>💡 Grey bars show projected sales quantities. Violet line shows estimated total revenue potential.</span>
                    <span>Values scaled relative to 100 base.</span>
                  </div>

                </div>

                {/* Competitor Positioning Card */}
                <div className="border border-slate-100 p-4 rounded-2xl shadow-2xs flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-tight flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-rose-500" /> Regional Competitive Position
                    </h4>
                    
                    {/* Competitor price listings compared */}
                    <div className="p-3 bg-slate-50 rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-[11px] font-bold text-slate-600">
                        <span>Your Current price:</span>
                        <span className="text-slate-800">₹{currentPrice}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] font-bold text-slate-600">
                        <span>AI Optimal price:</span>
                        <span className="text-violet-700">₹{optimizerResult.optimalPrice}</span>
                      </div>
                      <div className="border-t border-slate-200/60 my-1 pt-1 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>Reported peer prices:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {competitorInput.split(",").map((p, idx) => (
                          <span key={idx} className="bg-white border border-slate-200 text-slate-600 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                            ₹{p.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-extrabold uppercase text-slate-400">Positioning Analysis</span>
                      <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">
                        {optimizerResult.competitorPositioning}
                      </p>
                    </div>

                  </div>

                  <div className="text-[10px] text-slate-400 font-medium leading-relaxed border-t border-slate-100 pt-3 mt-3">
                    🛡️ Positioning minimizes attrition while preserving highest-quality delivery metrics.
                  </div>
                </div>

              </div>

              {/* Price Sensitivity Analysis Description */}
              <div className="bg-violet-50/40 border border-violet-100 p-5 rounded-2xl space-y-2">
                <h4 className="text-xs font-black text-violet-800 uppercase tracking-tight flex items-center gap-1.5">
                  📈 Detailed Price Sensitivity Analysis
                </h4>
                <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">
                  {optimizerResult.sensitivityAnalysis}
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Footer info line */}
        <div className="shrink-0 pt-3 border-t border-slate-100 text-[9px] text-slate-400 font-medium flex items-center justify-between">
          <span>Target calculations align with current regional crop plans and fertilizer transport subsidies.</span>
          <span>Optimizer Version: 2.1</span>
        </div>

      </div>
    </div>
  );
}
