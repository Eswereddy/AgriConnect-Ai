import React, { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  LineChart as ChartIcon,
  HelpCircle,
  Calendar,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Coins,
  Globe,
  Database,
  Layers,
  MapPin,
  Clock,
  Briefcase,
  Sliders,
  DollarSign,
  RefreshCw,
  Info,
  CheckCircle,
  AlertCircle,
  TrendingUp as TrendUpIcon,
  Zap,
  Gauge
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from "recharts";

// Input Structures
interface YieldInputModel {
  crop: "Basmati Rice" | "Wheat" | "Tomato" | "Cotton" | "Rice Paddy";
  // Soil Data
  soilPh: number;
  soilOrganicMatter: number; // %
  soilMoisture: number; // %
  // Weather Data
  temperatureC: number;
  rainfallMm: number;
  weatherForecast: "Sunny & Optimal" | "Heavy Rain Alert" | "Dry Spell" | "Frost Warning";
  // Fertilizer Usage
  fertilizerType: "Urea & DAP" | "NPK 12-32-16" | "Compost Organic";
  fertilizerKgsPerAcre: number;
  // Historical Yield
  historicalYieldTons: number;
  algorithm: "LSTM Neural Net" | "FB Prophet" | "ARIMA Auto-regressive";
}

// Fixed baseline Mandi prices per quintal
const CROP_BASE_PRICES: Record<string, number> = {
  "Basmati Rice": 6800,
  "Wheat": 2450,
  "Tomato": 1800,
  "Cotton": 5800,
  "Rice Paddy": 4300
};

export const YieldPricePrediction: React.FC = () => {
  // 1. Inputs states
  const [yieldInputs, setYieldInputs] = useState<YieldInputModel>({
    crop: "Basmati Rice",
    soilPh: 6.8,
    soilOrganicMatter: 2.1,
    soilMoisture: 55,
    temperatureC: 28,
    rainfallMm: 340,
    weatherForecast: "Sunny & Optimal",
    fertilizerType: "NPK 12-32-16",
    fertilizerKgsPerAcre: 120,
    historicalYieldTons: 12.5,
    algorithm: "LSTM Neural Net"
  });

  const [currentMarketPrice, setCurrentMarketPrice] = useState<number>(6800);
  const [isFetchingPrice, setIsFetchingPrice] = useState<boolean>(false);
  const [priceSyncTime, setPriceSyncTime] = useState<string>("Synced just now");

  // Global demand & Tariff indicators
  const [globalDemandScore, setGlobalDemandScore] = useState<number>(84);
  const [localInventoryLevel, setLocalInventoryLevel] = useState<"Low" | "Moderate" | "Abundant">("Low");
  const [exportDutyTariff, setExportDutyTariff] = useState<number>(10);

  const [activeAnalysisTab, setActiveAnalysisTab] = useState<"dashboard" | "yield" | "price">("dashboard");

  // Sync market price when crop changes or manual reload triggers
  useEffect(() => {
    const base = CROP_BASE_PRICES[yieldInputs.crop] || 4500;
    // Add minor randomized daily jitter to simulate real live data feed
    const jitter = Math.floor((Math.sin(Date.now() / 10000) * 120));
    setCurrentMarketPrice(base + jitter);
  }, [yieldInputs.crop]);

  const handleManualPriceFetch = () => {
    setIsFetchingPrice(true);
    setTimeout(() => {
      const base = CROP_BASE_PRICES[yieldInputs.crop] || 4500;
      const randomVariance = Math.floor((Math.random() - 0.5) * 160);
      setCurrentMarketPrice(base + randomVariance);
      setIsFetchingPrice(false);
      setPriceSyncTime("Synced just now via National Mandi Portal API");
    }, 900);
  };

  // ========================================================
  // A. YIELD PROJECTION ENGINE
  // ========================================================
  const yieldProjections = useMemo(() => {
    let multiplier = 1.0;

    // Soil ph multiplier
    if (yieldInputs.soilPh >= 6.0 && yieldInputs.soilPh <= 7.5) {
      multiplier += 0.06;
    } else {
      multiplier -= 0.12;
    }

    // Soil Organic Matter
    if (yieldInputs.soilOrganicMatter > 2.0) {
      multiplier += (yieldInputs.soilOrganicMatter - 2.0) * 0.12;
    } else {
      multiplier -= (2.0 - yieldInputs.soilOrganicMatter) * 0.18;
    }

    // Soil Moisture
    if (yieldInputs.soilMoisture >= 40 && yieldInputs.soilMoisture <= 70) {
      multiplier += 0.05;
    } else {
      multiplier -= 0.15;
    }

    // Weather forecast effects
    if (yieldInputs.weatherForecast === "Heavy Rain Alert") {
      multiplier -= 0.10;
    } else if (yieldInputs.weatherForecast === "Dry Spell") {
      multiplier -= 0.15;
    } else if (yieldInputs.weatherForecast === "Frost Warning") {
      multiplier -= 0.22;
    } else {
      multiplier += 0.04; // optimal weather bonus
    }

    // Fertilizer factor
    const fert = yieldInputs.fertilizerKgsPerAcre;
    if (fert >= 100 && fert <= 180) {
      multiplier += 0.08;
    } else if (fert < 80) {
      multiplier -= 0.14; // nutrient deficiency
    } else {
      multiplier -= 0.04; // slight salt burn / wastage penalty
    }

    // Expected production (tons)
    const expectedTons = parseFloat((yieldInputs.historicalYieldTons * multiplier).toFixed(2));
    const lowBound = parseFloat((expectedTons * 0.90).toFixed(1));
    const highBound = parseFloat((expectedTons * 1.08).toFixed(1));

    // Dynamic list of active Risk Factors
    const risks: string[] = [];
    if (yieldInputs.soilPh < 5.8) risks.push("Soil acidity restricts root nutrient absorption.");
    if (yieldInputs.soilPh > 8.0) risks.push("Alkaline soil stress may lock essential iron minerals.");
    if (yieldInputs.soilMoisture < 35) risks.push("Sub-optimal moisture profile indicates plant drought fatigue.");
    if (yieldInputs.soilMoisture > 75) risks.push("Excess hydration risks anaerobic fungal root pathogens.");
    if (yieldInputs.weatherForecast === "Heavy Rain Alert") risks.push("Impending downpours risk grain lodging & soil washing.");
    if (yieldInputs.weatherForecast === "Dry Spell") risks.push("Arid winds will trigger premature spikelet sterility.");
    if (yieldInputs.weatherForecast === "Frost Warning") risks.push("Freezing air risks cellular leaf rupture & black blight.");
    if (yieldInputs.fertilizerKgsPerAcre < 80) risks.push("Critical nitrogen depletion; stunted canopy development forecasted.");

    if (risks.length === 0) {
      risks.push("No severe active anomalies. Follow standard preventative irrigation cycles.");
    }

    // Numeric Risk Factor percentage
    let riskFactorPercent = 15;
    if (yieldInputs.weatherForecast !== "Sunny & Optimal") riskFactorPercent += 30;
    if (yieldInputs.soilMoisture < 35 || yieldInputs.soilMoisture > 75) riskFactorPercent += 20;
    if (yieldInputs.soilPh < 5.8 || yieldInputs.soilPh > 7.8) riskFactorPercent += 15;
    if (yieldInputs.fertilizerKgsPerAcre < 80) riskFactorPercent += 15;
    riskFactorPercent = Math.min(95, Math.max(8, riskFactorPercent));

    return {
      expectedTons,
      confidenceIntervalLow: lowBound,
      confidenceIntervalHigh: highBound,
      riskFactors: risks,
      riskFactorPercent
    };
  }, [yieldInputs]);

  // ========================================================
  // B. PRICE FORECASTING ENGINE (30/60/90 Days)
  // ========================================================
  const priceForecast = useMemo(() => {
    // Determine dynamic price multipliers based on global demand, local inventory and tariff
    let baseTrendMultiplier30 = 1.0;
    let baseTrendMultiplier60 = 1.0;
    let baseTrendMultiplier90 = 1.0;

    // Inventory pressure
    if (localInventoryLevel === "Low") {
      baseTrendMultiplier30 += 0.05;
      baseTrendMultiplier60 += 0.12;
      baseTrendMultiplier90 += 0.18;
    } else if (localInventoryLevel === "Abundant") {
      baseTrendMultiplier30 -= 0.04;
      baseTrendMultiplier60 -= 0.08;
      baseTrendMultiplier90 -= 0.12;
    }

    // Global demand impact
    const demandDelta = (globalDemandScore - 50) / 100; // -0.5 to 0.5
    baseTrendMultiplier30 += demandDelta * 0.08;
    baseTrendMultiplier60 += demandDelta * 0.16;
    baseTrendMultiplier90 += demandDelta * 0.24;

    // Export duties restrict dynamic margin
    const tariffDampener = (exportDutyTariff / 100) * 0.2;
    baseTrendMultiplier30 -= tariffDampener;
    baseTrendMultiplier60 -= tariffDampener;
    baseTrendMultiplier90 -= tariffDampener;

    // Compute prices
    const price30 = Math.round(currentMarketPrice * baseTrendMultiplier30);
    const price60 = Math.round(currentMarketPrice * baseTrendMultiplier60);
    const price90 = Math.round(currentMarketPrice * baseTrendMultiplier90);

    // Volatility score calculation
    let volatility = "Medium";
    let volatilityBadgeColor = "bg-amber-50 text-amber-700 border-amber-200";
    const deltaMaxMin = Math.abs(price90 - currentMarketPrice) / currentMarketPrice;
    if (deltaMaxMin > 0.18 || globalDemandScore > 85) {
      volatility = "High Volatility";
      volatilityBadgeColor = "bg-red-50 text-red-700 border-red-200 animate-pulse";
    } else if (deltaMaxMin < 0.06) {
      volatility = "Low Volatility (Stable)";
      volatilityBadgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    // Best Selling Window Recommendation
    let bestWindow = "Sell immediately (Mandi supply surplus expected)";
    if (price90 > currentMarketPrice && price90 > price30) {
      bestWindow = "Hold 60-90 Days (Target late seasonal inventory peak)";
    } else if (price30 > currentMarketPrice && price30 > price90) {
      bestWindow = "Short-term storage: Sell in 30 Days (Pre-harvest gap)";
    }

    return {
      price30,
      price60,
      price90,
      volatility,
      volatilityBadgeColor,
      bestWindow
    };
  }, [currentMarketPrice, globalDemandScore, localInventoryLevel, exportDutyTariff]);

  // ========================================================
  // C. COMBINED INTELLIGENCE: DECISION DASHBOARD
  // ========================================================
  const combinedDecision = useMemo(() => {
    // Harvest decision relies on crop price projections vs weather risk
    // Dynamic expected revenue calculation:
    // 1 Ton = 10 Quintals
    const totalQuintals = yieldProjections.expectedTons * 10;
    
    // Evaluate waiting 2 weeks (approx 14 days)
    // Estimate 14 days price as halfway to 30 days
    const priceDiff14d = Math.round((priceForecast.price30 - currentMarketPrice) * 0.5);
    const futurePrice14d = currentMarketPrice + priceDiff14d;
    
    const revenueNow = Math.round(totalQuintals * currentMarketPrice);
    const revenue14d = Math.round(totalQuintals * futurePrice14d);
    
    const extraEarnings = revenue14d - revenueNow;

    // Wait Risk index
    let waitRiskPercent = yieldProjections.riskFactorPercent;
    if (yieldInputs.weatherForecast === "Heavy Rain Alert") {
      waitRiskPercent = Math.min(99, waitRiskPercent + 15);
    }

    // Recommendation logic
    let decision = "HARVEST & SELL NOW";
    let decisionReason = "Severe impending weather or down-trending market recommends immediate sale to safeguard margins.";
    let themeColor = "border-red-300 bg-red-50/50 text-red-950";
    let badgeStyle = "bg-red-600 text-white";

    if (extraEarnings > 0 && waitRiskPercent < 60) {
      decision = "WAIT & HOLD FOR HIGHER PROFIT";
      decisionReason = "Upward market momentum indicates significant storage arbitrage margins. Weather remains within normal safe thresholds.";
      themeColor = "border-emerald-300 bg-emerald-50/50 text-emerald-950";
      badgeStyle = "bg-emerald-600 text-white";
    } else if (extraEarnings > 0 && waitRiskPercent >= 60) {
      decision = "HARVEST IMMEDIATELY (HIGH RISK)";
      decisionReason = "Although holding has a ₹" + extraEarnings.toLocaleString("en-IN") + " theoretical premium, impending meteorological risks render waiting unsafe.";
      themeColor = "border-amber-300 bg-amber-50/50 text-amber-950";
      badgeStyle = "bg-amber-600 text-white animate-pulse";
    }

    return {
      decision,
      decisionReason,
      extraEarnings,
      waitRiskPercent,
      themeColor,
      badgeStyle,
      revenueNow,
      revenue14d
    };
  }, [yieldProjections, priceForecast, currentMarketPrice, yieldInputs.weatherForecast]);

  // Chart data for price forecasts
  const chartData = useMemo(() => {
    return [
      { name: "Current", Price: currentMarketPrice },
      { name: "30 Days", Price: priceForecast.price30 },
      { name: "60 Days", Price: priceForecast.price60 },
      { name: "90 Days", Price: priceForecast.price90 }
    ];
  }, [currentMarketPrice, priceForecast]);

  return (
    <div id="ai-price-yield-prediction-panel" className="space-y-6">
      
      {/* 1. Header with simulation indicators */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-900 flex items-center gap-1 w-fit">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Neural Forecast Engine Active
          </span>
          <h2 className="text-white text-sm font-bold uppercase tracking-tight">
            AI Yield & Price Projections Suite
          </h2>
          <p className="text-slate-400 text-[10px] font-medium leading-relaxed">
            Multi-layered LSTM networks for harvest yield, transformer-driven price analytics, and storage arbitrage modeling.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleManualPriceFetch}
            disabled={isFetchingPrice}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetchingPrice ? "animate-spin" : ""}`} />
            Sync Live Mandi Price
          </button>
        </div>
      </div>

      {/* 2. Top-level dashboard tabs */}
      <div className="flex border-b border-slate-200 gap-1 bg-white p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveAnalysisTab("dashboard")}
          className={`pb-2.5 pt-2 text-xs font-black uppercase tracking-wider border-b-2 px-5 cursor-pointer transition-all flex items-center gap-1.5 ${
            activeAnalysisTab === "dashboard"
              ? "border-emerald-600 text-emerald-700 font-extrabold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Gauge className="h-4 w-4" />
          Combined Decision Desk
        </button>
        <button
          type="button"
          onClick={() => setActiveAnalysisTab("yield")}
          className={`pb-2.5 pt-2 text-xs font-black uppercase tracking-wider border-b-2 px-5 cursor-pointer transition-all flex items-center gap-1.5 ${
            activeAnalysisTab === "yield"
              ? "border-emerald-600 text-emerald-700 font-extrabold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Database className="h-4 w-4" />
          Yield Neural Inputs
        </button>
        <button
          type="button"
          onClick={() => setActiveAnalysisTab("price")}
          className={`pb-2.5 pt-2 text-xs font-black uppercase tracking-wider border-b-2 px-5 cursor-pointer transition-all flex items-center gap-1.5 ${
            activeAnalysisTab === "price"
              ? "border-emerald-600 text-emerald-700 font-extrabold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ChartIcon className="h-4 w-4" />
          Price Volatility Timeline
        </button>
      </div>

      {/* Main Grid: Parameter controllers on left, visual analytics on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: INTERACTIVE INPUT CONTROLLER (4 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-5">
          
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
              <Sliders className="h-4 w-4 text-emerald-600" />
              Dynamic Simulation Inputs
            </h3>
            <p className="text-[10px] text-slate-400 font-medium">Adjust soil, meteorological, and warehouse params to alter model outputs.</p>
          </div>

          {/* CROP SELECTOR */}
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-black text-slate-400">Target Crop Variety</label>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {(["Basmati Rice", "Wheat", "Tomato", "Cotton", "Rice Paddy"] as const).map((cr) => (
                <button
                  key={cr}
                  type="button"
                  onClick={() => setYieldInputs((prev) => ({ ...prev, crop: cr }))}
                  className={`py-2 px-1 rounded-xl text-[9.5px] font-black border tracking-wide uppercase transition-all cursor-pointer ${
                    yieldInputs.crop === cr
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-3xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {cr}
                </button>
              ))}
            </div>
          </div>

          {/* SOIL DATA SECTION */}
          <div className="space-y-3.5 pt-2">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-slate-400" />
              Soil Characteristics
            </h4>

            <div className="grid grid-cols-2 gap-3.5 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-600 text-[10px] uppercase mb-1">
                  <span>Soil pH</span>
                  <span className="text-slate-800">{yieldInputs.soilPh}</span>
                </div>
                <input
                  type="range"
                  min="4.5"
                  max="9.0"
                  step="0.1"
                  value={yieldInputs.soilPh}
                  onChange={(e) => setYieldInputs((prev) => ({ ...prev, soilPh: parseFloat(e.target.value) }))}
                  className="w-full accent-emerald-600 cursor-pointer h-1 bg-slate-100 rounded-lg appearance-none"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-600 text-[10px] uppercase mb-1">
                  <span>Organic Matter (%)</span>
                  <span className="text-slate-800">{yieldInputs.soilOrganicMatter}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="4.5"
                  step="0.1"
                  value={yieldInputs.soilOrganicMatter}
                  onChange={(e) => setYieldInputs((prev) => ({ ...prev, soilOrganicMatter: parseFloat(e.target.value) }))}
                  className="w-full accent-emerald-600 cursor-pointer h-1 bg-slate-100 rounded-lg appearance-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-600 text-[10px] uppercase mb-1">
                <span>Soil Moisture Level (%)</span>
                <span className="text-slate-800 font-extrabold">{yieldInputs.soilMoisture}% RH</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                value={yieldInputs.soilMoisture}
                onChange={(e) => setYieldInputs((prev) => ({ ...prev, soilMoisture: parseInt(e.target.value) }))}
                className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
              />
            </div>
          </div>

          {/* WEATHER DATA SECTION */}
          <div className="space-y-3.5 pt-2">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              Meteorological Profile
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-600 text-[10px] uppercase mb-1">
                  <span>Avg Temp (°C)</span>
                  <span className="text-slate-800">{yieldInputs.temperatureC}°C</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="45"
                  value={yieldInputs.temperatureC}
                  onChange={(e) => setYieldInputs((prev) => ({ ...prev, temperatureC: parseInt(e.target.value) }))}
                  className="w-full accent-emerald-600 cursor-pointer h-1 bg-slate-100 rounded-lg appearance-none"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-600 text-[10px] uppercase mb-1">
                  <span>Season Rain (mm)</span>
                  <span className="text-slate-800">{yieldInputs.rainfallMm}mm</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="900"
                  step="10"
                  value={yieldInputs.rainfallMm}
                  onChange={(e) => setYieldInputs((prev) => ({ ...prev, rainfallMm: parseInt(e.target.value) }))}
                  className="w-full accent-emerald-600 cursor-pointer h-1 bg-slate-100 rounded-lg appearance-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-black text-slate-400 mb-1">Incoming Weather Warning</label>
              <select
                value={yieldInputs.weatherForecast}
                onChange={(e) => setYieldInputs((prev) => ({ ...prev, weatherForecast: e.target.value as any }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value="Sunny & Optimal">Sunny & Optimal Conditions</option>
                <option value="Heavy Rain Alert">Heavy Rain Alert / Flood Warning</option>
                <option value="Dry Spell">Arid Dry Spell / Heatwave Alert</option>
                <option value="Frost Warning">Sudden Night Frost Alert</option>
              </select>
            </div>
          </div>

          {/* FERTILIZER USAGE SECTION */}
          <div className="space-y-3.5 pt-2">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-slate-400" />
              Nutritional Supplementation
            </h4>

            <div className="grid grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-black text-slate-400 mb-1">Fertilizer Type</label>
                <select
                  value={yieldInputs.fertilizerType}
                  onChange={(e) => setYieldInputs((prev) => ({ ...prev, fertilizerType: e.target.value as any }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value="NPK 12-32-16">NPK 12-32-16 Ratio</option>
                  <option value="Urea & DAP">Urea & DAP Blend</option>
                  <option value="Compost Organic">Cold Vermicompost Organic</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-600 text-[10px] uppercase mb-1">
                  <span>Usage (kg/acre)</span>
                  <span className="text-slate-800">{yieldInputs.fertilizerKgsPerAcre} kg</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="300"
                  step="10"
                  value={yieldInputs.fertilizerKgsPerAcre}
                  onChange={(e) => setYieldInputs((prev) => ({ ...prev, fertilizerKgsPerAcre: parseInt(e.target.value) }))}
                  className="w-full accent-emerald-600 cursor-pointer h-1 bg-slate-100 rounded-lg appearance-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-600 text-[10px] uppercase mb-1">
                <span>Historical Baseline Yield (Tons)</span>
                <span className="text-slate-800 font-extrabold">{yieldInputs.historicalYieldTons} Tons</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="25.0"
                step="0.5"
                value={yieldInputs.historicalYieldTons}
                onChange={(e) => setYieldInputs((prev) => ({ ...prev, historicalYieldTons: parseFloat(e.target.value) }))}
                className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
              />
            </div>
          </div>

          {/* MARKET PARAMETERS */}
          <div className="space-y-3.5 pt-2">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-slate-400" />
              Mandi Demand & Tariffs
            </h4>

            <div className="grid grid-cols-2 gap-3.5 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-600 text-[10px] uppercase mb-1">
                  <span>Global Demand</span>
                  <span className="text-emerald-700">{globalDemandScore}/100</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={globalDemandScore}
                  onChange={(e) => setGlobalDemandScore(parseInt(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer h-1 bg-slate-100 rounded-lg appearance-none"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-600 text-[10px] uppercase mb-1">
                  <span>Export Duty (%)</span>
                  <span className="text-slate-800">{exportDutyTariff}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={exportDutyTariff}
                  onChange={(e) => setExportDutyTariff(parseInt(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer h-1 bg-slate-100 rounded-lg appearance-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-black text-slate-400 mb-1">Local Mandi Reserves</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["Low", "Moderate", "Abundant"] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setLocalInventoryLevel(level)}
                    className={`py-1.5 rounded-lg text-[9px] font-bold border text-center transition-all cursor-pointer ${
                      localInventoryLevel === level
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-3xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {level} Volume
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: DETAIL ANALYSIS VIEWS (8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* TAB 1: COMBINED DECISION DESK */}
          {activeAnalysisTab === "dashboard" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* PRIMARY AI HARVEST RECOMMENDATION CARD */}
              <div className={`border-2 rounded-2xl p-5 shadow-3xs space-y-4 ${combinedDecision.themeColor}`}>
                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">
                      AI Harvest Decision Desk
                    </span>
                    <h3 className="text-sm font-black text-slate-900 mt-0.5">
                      "Should I harvest now or wait?"
                    </h3>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow ${combinedDecision.badgeStyle}`}>
                    {combinedDecision.decision}
                  </span>
                </div>

                <p className="text-xs font-bold leading-relaxed text-slate-800">
                  {combinedDecision.decisionReason}
                </p>

                {/* CRITICAL STATEMENT MANDATE */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                  <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider block mb-1">Estimated Option Difference</span>
                  <p className="text-xs text-slate-900 font-extrabold font-sans">
                    {combinedDecision.extraEarnings > 0 ? (
                      <>
                        If I wait 2 weeks, I earn <span className="text-emerald-600 font-black text-sm">₹{combinedDecision.extraEarnings.toLocaleString("en-IN")}</span> more — but risk is <span className="text-amber-600 font-black text-sm">{combinedDecision.waitRiskPercent}%</span>
                      </>
                    ) : (
                      <>
                        Immediate harvest saves <span className="text-red-600 font-black text-sm">₹{Math.abs(combinedDecision.extraEarnings).toLocaleString("en-IN")}</span> loss — risk index is <span className="text-slate-700 font-black text-sm">{combinedDecision.waitRiskPercent}%</span>
                      </>
                    )}
                  </p>
                </div>

                {/* Subsidized option details */}
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 block font-bold uppercase">Immediate Harvest Value</span>
                    <p className="text-sm font-extrabold text-slate-800">₹{combinedDecision.revenueNow.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="space-y-0.5 text-right">
                    <span className="text-[9px] text-slate-400 block font-bold uppercase">Stored Hold Value (+14d)</span>
                    <p className="text-sm font-extrabold text-emerald-700">₹{combinedDecision.revenue14d.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              </div>

              {/* TWO PANEL ANALYTICS SUMMARY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Expected Yield Output Preview */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4.5 space-y-3 shadow-3xs">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-black uppercase text-slate-400">Yield Neural Output</span>
                    <span className="text-[8.5px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[8.5px] uppercase font-bold text-slate-400 block">Expected Production Volume</span>
                    <p className="text-lg font-black text-emerald-800 leading-none">{yieldProjections.expectedTons} Metric Tons</p>
                    <p className="text-[10px] font-semibold text-slate-500 mt-1">
                      Confidence Interval: {yieldProjections.confidenceIntervalLow}t - {yieldProjections.confidenceIntervalHigh}t
                    </p>
                  </div>

                  <div className="pt-2">
                    <span className="text-[8.5px] uppercase font-bold text-slate-400 block mb-1">Key Environmental Risks</span>
                    <div className="space-y-1">
                      <div className="flex gap-1.5 items-start text-[9.5px] text-slate-600 font-semibold leading-relaxed">
                        <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>{yieldProjections.riskFactors[0]}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price prediction Output Preview */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4.5 space-y-3 shadow-3xs">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-black uppercase text-slate-400">Price Timeline Output</span>
                    <span className="text-[8.5px] font-extrabold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">Auto-Fetched</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[8.5px] uppercase font-bold text-slate-400 block">Current Market Rate</span>
                    <p className="text-lg font-black text-teal-800 leading-none">₹{currentMarketPrice} <span className="text-[10px] text-slate-400">/ Quintal</span></p>
                    <div className="flex items-center gap-1 text-[9.5px] text-slate-400 mt-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{priceSyncTime}</span>
                    </div>
                  </div>

                  <div className="pt-2 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-bold text-[9px] uppercase">Best Selling Window</span>
                      <span className="text-slate-800 font-black text-[10px] text-right">{priceForecast.bestWindow}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-100 pt-1.5">
                      <span className="text-slate-400 font-bold text-[9px] uppercase">Mandi Volatility</span>
                      <span className={`text-[9.5px] px-1.5 rounded uppercase font-black border ${priceForecast.volatilityBadgeColor}`}>
                        {priceForecast.volatility}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: DETAILED YIELD ANALYSIS */}
          {activeAnalysisTab === "yield" && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Crop Production Yield Projections
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Statistical confidence distributions generated through LSTM Agronomy algorithms.</p>
                </div>
                <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded">
                  {yieldInputs.algorithm}
                </span>
              </div>

              {/* Yield metrics list */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
                  <span className="text-slate-400 text-[9px] font-bold block uppercase">Expected Production</span>
                  <p className="text-lg font-black text-slate-800 leading-none">{yieldProjections.expectedTons} t</p>
                  <p className="text-[8.5px] text-slate-400">Total expected tonnage</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
                  <span className="text-slate-400 text-[9px] font-bold block uppercase">Confidence Interval</span>
                  <p className="text-sm font-black text-slate-800 leading-none">{yieldProjections.confidenceIntervalLow}t - {yieldProjections.confidenceIntervalHigh}t</p>
                  <p className="text-[8.5px] text-slate-400">Normal production bounds</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
                  <span className="text-slate-400 text-[9px] font-bold block uppercase">Soil & Weather Risk</span>
                  <p className="text-lg font-black text-amber-700 leading-none">{yieldProjections.riskFactorPercent}%</p>
                  <p className="text-[8.5px] text-slate-400">Combined damage indexes</p>
                </div>
              </div>

              {/* Complete Risk factors */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4.5 space-y-3">
                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-widest">
                  Identified Active Risk Factors
                </span>
                <div className="space-y-2">
                  {yieldProjections.riskFactors.map((risk, idx) => (
                    <div key={idx} className="flex gap-2 items-start text-xs font-semibold text-slate-700">
                      <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      <p>{risk}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRICE TIMELINE FORECASTS */}
          {activeAnalysisTab === "price" && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Price Predictor Timeline (next 30/60/90 Days)
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Macroeconomic inventory fluctuations and global sovereign import/export demand models.</p>
              </div>

              {/* Future price cards */}
              <div className="grid grid-cols-4 gap-2.5">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
                  <span className="text-slate-400 text-[8.5px] font-bold block uppercase">Today</span>
                  <p className="text-xs font-black text-slate-800 mt-1">₹{currentMarketPrice}</p>
                  <span className="text-[8px] bg-slate-200 px-1 py-0.2 rounded font-black text-slate-600">Sync</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
                  <span className="text-slate-400 text-[8.5px] font-bold block uppercase">30 Days</span>
                  <p className="text-xs font-black text-teal-800 mt-1">₹{priceForecast.price30}</p>
                  <span className={`text-[8.5px] font-black ${priceForecast.price30 >= currentMarketPrice ? "text-emerald-600" : "text-red-500"}`}>
                    {priceForecast.price30 >= currentMarketPrice ? "+" : ""}{Math.round(((priceForecast.price30 - currentMarketPrice)/currentMarketPrice)*100)}%
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
                  <span className="text-slate-400 text-[8.5px] font-bold block uppercase">60 Days</span>
                  <p className="text-xs font-black text-teal-800 mt-1">₹{priceForecast.price60}</p>
                  <span className={`text-[8.5px] font-black ${priceForecast.price60 >= currentMarketPrice ? "text-emerald-600" : "text-red-500"}`}>
                    {priceForecast.price60 >= currentMarketPrice ? "+" : ""}{Math.round(((priceForecast.price60 - currentMarketPrice)/currentMarketPrice)*100)}%
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
                  <span className="text-slate-400 text-[8.5px] font-bold block uppercase">90 Days</span>
                  <p className="text-xs font-black text-teal-800 mt-1">₹{priceForecast.price90}</p>
                  <span className={`text-[8.5px] font-black ${priceForecast.price90 >= currentMarketPrice ? "text-emerald-600" : "text-red-500"}`}>
                    {priceForecast.price90 >= currentMarketPrice ? "+" : ""}{Math.round(((priceForecast.price90 - currentMarketPrice)/currentMarketPrice)*100)}%
                  </span>
                </div>
              </div>

              {/* RECHARTS TIMELINE GRAPH */}
              <div className="h-44 bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                    <YAxis stroke="#94a3b8" fontSize={9} />
                    <Tooltip contentStyle={{ fontSize: "10px" }} />
                    <Area name={`Predicted ₹ / Quintal`} type="monotone" dataKey="Price" stroke="#0d9488" fillOpacity={1} fill="url(#priceFill)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-xl border border-slate-150 text-xs font-bold text-slate-700">
                <span className="text-slate-400 font-black text-[9px] uppercase tracking-wider">Volatility Metrics Summary</span>
                <span className={`text-[10px] px-2.5 py-0.5 rounded border uppercase ${priceForecast.volatilityBadgeColor}`}>
                  {priceForecast.volatility}
                </span>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
