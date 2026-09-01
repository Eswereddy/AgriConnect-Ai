import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Info,
  Calendar,
  DollarSign,
  MapPin,
  Layers,
  AlertCircle,
  Sparkles,
  CheckCircle,
  RefreshCw,
  Clock,
  ArrowRight,
  Search,
  BrainCircuit,
  HelpCircle
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
  ReferenceLine
} from "recharts";

interface HistoricalDataPoint {
  name: string;
  price: number;
  isForecast: boolean;
}

interface PricePredictionResponse {
  currentPrice: number;
  recommendation: "Buy Now" | "Wait";
  confidenceScore: number;
  why: string;
  priceTrend30Days: number;
  priceTrend60Days: number;
  priceTrend90Days: number;
  historicalData: HistoricalDataPoint[];
}

export default function BuyerAIPricePredictor() {
  // Input parameters
  const [cropName, setCropName] = useState("Premium Basmati Rice");
  const [region, setRegion] = useState("Punjab & Haryana Basin");
  const [season, setSeason] = useState("Harvest Season");

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  // Prediction output
  const [prediction, setPrediction] = useState<PricePredictionResponse | null>(null);

  // Suggested search shortcuts
  const cropSuggestions = [
    { name: "Premium Basmati Rice", region: "Punjab & Haryana Basin", season: "Harvest Season" },
    { name: "Non-GMO Corn / Maize", region: "Iowa Corn Belt", season: "Growing Season" },
    { name: "Soft Red Winter Wheat", region: "Madhya Pradesh Plains", season: "Sowing Season" },
    { name: "Organic Soybean Seed", region: "São Paulo Highlands", season: "Growing Season" },
    { name: "Arabica Coffee Bean", region: "Karnataka Western Ghats", season: "Off-Season" }
  ];

  const loadingMessages = [
    "Establishing secure link with AgriConnect pricing oracle...",
    "Retrieving regional weather data & reservoir level telemetries...",
    "Querying global commodity exchange price histories...",
    "Computing harvest arrivals with high-resolution satellite imagery forecasts...",
    "Running neural net backpropagation to simulate market price elasticity..."
  ];

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handlePredict = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!cropName.trim()) {
      setError("Please specify a valid crop name.");
      return;
    }

    setLoading(true);
    setError(null);
    setLoadingStep(0);

    try {
      const response = await fetch("/api/buyer/price-prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropName,
          region,
          season
        })
      });

      if (!response.ok) {
        throw new Error("Failed to generate price prediction from API.");
      }

      const data: PricePredictionResponse = await response.json();
      setPrediction(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during price forecasting.");
    } finally {
      setLoading(false);
    }
  };

  // Run initial prediction on load
  useEffect(() => {
    handlePredict();
  }, []);

  const selectSuggestion = (sug: typeof cropSuggestions[0]) => {
    setCropName(sug.name);
    setRegion(sug.region);
    setSeason(sug.season);
    // Automatically trigger prediction after setting states
    setTimeout(() => {
      setLoading(true);
      setError(null);
      setLoadingStep(0);
      fetch("/api/buyer/price-prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sug)
      })
        .then((res) => res.json())
        .then((data) => setPrediction(data))
        .catch((err) => setError(err.message || "Failed to fetch prediction."))
        .finally(() => setLoading(false));
    }, 50);
  };

  // Custom tooltips for chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as HistoricalDataPoint;
      return (
        <div className="bg-white p-3.5 border border-slate-150 rounded-xl shadow-lg space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase">{data.isForecast ? "🔮 Projected Month" : "📊 Historical Month"}</p>
          <p className="text-xs font-black text-slate-800">{data.name}</p>
          <p className="text-sm font-extrabold text-teal-600">
            ${data.price.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">/ Ton</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="buyer-ai-price-predictor" className="space-y-6">
      {/* Title block */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-teal-50 border border-teal-100 text-teal-700 rounded-lg">
            <BrainCircuit className="h-5 w-5 animate-pulse" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-1.5">
            AI Price Predictor & Procurement Strategist (Feature 7.1)
          </h3>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Unlock neural net commodity forecasts to secure purchasing margins. By cross-analyzing regional seasons, local arrivals, reservoir indexes, and weather anomalies, AgriConnect computes 30/60/90-day pricing curves and renders optimal procurement signals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Input Form & Shortcuts */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-teal-600" />
              Forecasting Inputs
            </h4>

            <form onSubmit={handlePredict} className="space-y-4">
              {/* Crop Selector / Custom input */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Crop Commodity</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400">
                    <Search className="h-3.5 w-3.5" />
                  </span>
                  <input
                    type="text"
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    placeholder="Enter crop (e.g. Basmati Rice, Wheat)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Region Parameter */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Production Region</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400">
                    <MapPin className="h-3.5 w-3.5" />
                  </span>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="Enter region (e.g. Punjab, Midwest)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Season Selection */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Market / Crop Season</label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition-colors"
                >
                  <option value="Harvest Season">Harvest Season (High Volume Arrival)</option>
                  <option value="Post-Harvest Phase">Post-Harvest Phase (Arrivals tapering)</option>
                  <option value="Sowing Season">Sowing Season (Off-season storage)</option>
                  <option value="Growing Season">Growing Season (High vegetative stress)</option>
                  <option value="Off-Season">Off-Season Gap (Minimal mandi arrivals)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-300 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all hover:shadow"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate AI Forecast
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Shortcuts / Presets */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Verify Global Baselines
            </h4>
            <div className="space-y-2">
              {cropSuggestions.map((sug) => (
                <button
                  key={sug.name}
                  onClick={() => selectSuggestion(sug)}
                  className={`w-full p-2.5 text-left rounded-xl border border-slate-100 hover:border-teal-300 hover:bg-teal-50/20 text-xs font-semibold transition-all flex justify-between items-center cursor-pointer ${
                    cropName === sug.name ? "border-teal-600 bg-teal-50/10" : ""
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="text-slate-800 font-bold">{sug.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <MapPin className="h-2.5 w-2.5 text-slate-300" /> {sug.region}
                    </p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Prediction Outputs, Badges and Chart */}
        <div className="lg:col-span-8 space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-800 p-4 rounded-2xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="text-xs font-bold">Calculation Interrupted</h5>
                <p className="text-[11px] leading-relaxed font-semibold">{error}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 shadow-sm flex flex-col items-center justify-center space-y-6 min-h-[450px]">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-slate-100 border-t-teal-600 animate-spin"></div>
                <BrainCircuit className="h-7 w-7 text-teal-600 absolute top-4.5 left-4.5 animate-pulse" />
              </div>
              <div className="text-center space-y-2 max-w-sm">
                <h5 className="text-sm font-extrabold text-slate-800">Processing Predictive Models</h5>
                <p className="text-xs text-slate-400 font-mono italic font-semibold min-h-[32px] leading-relaxed">
                  "{loadingMessages[loadingStep]}"
                </p>
              </div>
              <div className="w-48 bg-slate-100 h-1 rounded-full overflow-hidden">
                <div className="h-full bg-teal-600 rounded-full animate-pulse" style={{ width: `${(loadingStep + 1) * 20}%` }}></div>
              </div>
            </div>
          ) : prediction ? (
            <div className="space-y-6">
              {/* Main signal block */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4.5">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-teal-700 bg-teal-50 border border-teal-150 px-2 py-0.5 rounded-md">
                      Procurement Signal
                    </span>
                    <h4 className="text-lg font-black text-slate-800 font-sans tracking-tight">
                      {cropName}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {region} • {season}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Model Current Price</p>
                      <p className="text-2xl font-black text-slate-800 font-mono mt-0.5">
                        ${prediction.currentPrice.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ ton</span>
                      </p>
                    </div>

                    <div className="border-l border-slate-100 h-10 self-center" />

                    <div className="text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recommendation</p>
                      <span className={`inline-block text-xs font-black uppercase px-4 py-1.5 rounded-full mt-1.5 border tracking-wider shadow-sm animate-pulse ${
                        prediction.recommendation === "Buy Now"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-150"
                          : "bg-amber-50 text-amber-700 border-amber-150"
                      }`}>
                        🛡️ {prediction.recommendation}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Why & Confidence panel */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  <div className="md:col-span-8 bg-slate-50 p-4 rounded-xl border border-slate-150 shadow-inner">
                    <div className="flex gap-2 items-start">
                      <Info className="h-4.5 w-4.5 text-teal-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h5 className="text-[11px] font-black text-slate-700 uppercase tracking-wider">AI Strategic Recommendation Why</h5>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                          {prediction.why}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-4 bg-teal-50/35 border border-teal-100 p-4 rounded-xl flex flex-col justify-center items-center text-center space-y-2">
                    <p className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">Confidence Score</p>
                    <div className="relative flex items-center justify-center">
                      <span className="text-3xl font-black text-teal-900 font-mono tracking-tight">{prediction.confidenceScore}%</span>
                    </div>
                    <div className="w-full bg-teal-200/50 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-600 rounded-full" style={{ width: `${prediction.confidenceScore}%` }}></div>
                    </div>
                    <p className="text-[9px] text-teal-700 font-semibold uppercase">High Forecast Trust Factor</p>
                  </div>
                </div>
              </div>

              {/* Price trends indices cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col justify-between hover:border-teal-200 transition-colors">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">30-Day Forecast Delta</span>
                    <h5 className={`text-xl font-black mt-1 font-mono flex items-center gap-1 ${
                      prediction.priceTrend30Days >= 0 ? "text-emerald-600" : "text-rose-500"
                    }`}>
                      {prediction.priceTrend30Days >= 0 ? (
                        <TrendingUp className="h-5 w-5" />
                      ) : (
                        <TrendingDown className="h-5 w-5" />
                      )}
                      {prediction.priceTrend30Days >= 0 ? "+" : ""}{prediction.priceTrend30Days}%
                    </h5>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">Estimated target price: ${(prediction.currentPrice * (1 + prediction.priceTrend30Days / 100)).toFixed(0)}</p>
                </div>

                <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col justify-between hover:border-teal-200 transition-colors">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">60-Day Forecast Delta</span>
                    <h5 className={`text-xl font-black mt-1 font-mono flex items-center gap-1 ${
                      prediction.priceTrend60Days >= 0 ? "text-emerald-600" : "text-rose-500"
                    }`}>
                      {prediction.priceTrend60Days >= 0 ? (
                        <TrendingUp className="h-5 w-5" />
                      ) : (
                        <TrendingDown className="h-5 w-5" />
                      )}
                      {prediction.priceTrend60Days >= 0 ? "+" : ""}{prediction.priceTrend60Days}%
                    </h5>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">Estimated target price: ${(prediction.currentPrice * (1 + prediction.priceTrend60Days / 100)).toFixed(0)}</p>
                </div>

                <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col justify-between hover:border-teal-200 transition-colors">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">90-Day Forecast Delta</span>
                    <h5 className={`text-xl font-black mt-1 font-mono flex items-center gap-1 ${
                      prediction.priceTrend90Days >= 0 ? "text-emerald-600" : "text-rose-500"
                    }`}>
                      {prediction.priceTrend90Days >= 0 ? (
                        <TrendingUp className="h-5 w-5" />
                      ) : (
                        <TrendingDown className="h-5 w-5" />
                      )}
                      {prediction.priceTrend90Days >= 0 ? "+" : ""}{prediction.priceTrend90Days}%
                    </h5>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">Estimated target price: ${(prediction.currentPrice * (1 + prediction.priceTrend90Days / 100)).toFixed(0)}</p>
                </div>
              </div>

              {/* Price forecast Recharts Curve */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-teal-600" />
                    AI Pricing Model Continuous Timeline
                  </span>
                  <div className="flex gap-4 text-[9px] font-bold">
                    <span className="flex items-center gap-1 text-slate-500">
                      <span className="h-2 w-2 rounded-full bg-slate-300"></span> Historical
                    </span>
                    <span className="flex items-center gap-1 text-teal-600">
                      <span className="h-2 w-2 rounded-full bg-teal-500"></span> Forecast Range
                    </span>
                  </div>
                </div>

                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={prediction.historicalData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                      <defs>
                        <linearGradient id="historicalGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: 10, fontWeight: "bold" }} />
                      <YAxis stroke="#94a3b8" domain={["auto", "auto"]} style={{ fontSize: 10, fontWeight: "bold" }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 10, fontWeight: "bold", paddingTop: 10 }} />
                      
                      {/* Split area for historical and forecast */}
                      <Area
                        name="Baseline Trade Price ($/Ton)"
                        type="monotone"
                        dataKey="price"
                        stroke="#0d9488"
                        strokeWidth={2.5}
                        fill="url(#forecastGrad)"
                        fillOpacity={1}
                        activeDot={{ r: 6 }}
                      />
                      
                      {/* Reference line marking the boundary between past and forecast */}
                      <ReferenceLine
                        x={prediction.historicalData[3]?.name}
                        stroke="#94a3b8"
                        strokeDasharray="3 3"
                        label={{ value: "Forecast Pivot", position: "top", fill: "#94a3b8", fontSize: 9, fontWeight: "bold" }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 shadow-sm text-center text-slate-500">
              No price prediction generated yet. Specify crops and click 'Generate AI Forecast' to compile trends.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
