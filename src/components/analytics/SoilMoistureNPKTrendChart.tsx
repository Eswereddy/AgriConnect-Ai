import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import {
  Activity,
  Droplets,
  Sparkles,
  Info,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  SlidersHorizontal,
  Lightbulb,
  AlertTriangle
} from "lucide-react";

interface TelemetryHistoryItem {
  dateStr: string;
  moisture: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

interface SoilMoistureNPKTrendChartProps {
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

export default function SoilMoistureNPKTrendChart({
  activeFarmName,
  baseline
}: SoilMoistureNPKTrendChartProps) {
  // Toggle states for line visibility
  const [visibleLines, setVisibleLines] = useState({
    moisture: true,
    nitrogen: true,
    phosphorus: true,
    potassium: true
  });

  // Filter state for nutrient focus
  const [focusMetric, setFocusMetric] = useState<"all" | "moisture" | "npk">("all");

  // Generate 30 days of consistent historical data centered around the baseline
  const historicalData = useMemo<TelemetryHistoryItem[]>(() => {
    const data: TelemetryHistoryItem[] = [];
    const now = new Date();

    // Stable seed based on farm name for consistent organic random walks
    let seed = activeFarmName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric"
      });

      // Organic dynamic walks around baseline
      const moistureWalk = baseline.soilMoisture + (random() - 0.5) * 10 + Math.sin(i / 3.5) * 6;
      const nitrogenWalk = baseline.nitrogen + (random() - 0.5) * 15 + Math.cos(i / 5) * 8;
      const phosphorusWalk = baseline.phosphorus + (random() - 0.5) * 8 + Math.sin(i / 4) * 4;
      const potassiumWalk = baseline.potassium + (random() - 0.5) * 20 + Math.cos(i / 3) * 10;

      data.push({
        dateStr,
        moisture: Math.max(5, Math.min(100, Math.round(moistureWalk))),
        nitrogen: Math.max(10, Math.round(nitrogenWalk)),
        phosphorus: Math.max(5, Math.round(phosphorusWalk)),
        potassium: Math.max(20, Math.round(potassiumWalk))
      });
    }
    return data;
  }, [activeFarmName, baseline]);

  // Calculate high-level stats over 30 days
  const stats = useMemo(() => {
    if (historicalData.length === 0) return null;

    const sumMoisture = historicalData.reduce((sum, item) => sum + item.moisture, 0);
    const sumN = historicalData.reduce((sum, item) => sum + item.nitrogen, 0);
    const sumP = historicalData.reduce((sum, item) => sum + item.phosphorus, 0);
    const sumK = historicalData.reduce((sum, item) => sum + item.potassium, 0);

    const latest = historicalData[historicalData.length - 1];
    const initial = historicalData[0];

    return {
      avgMoisture: Math.round(sumMoisture / historicalData.length),
      avgN: Math.round(sumN / historicalData.length),
      avgP: Math.round(sumP / historicalData.length),
      avgK: Math.round(sumK / historicalData.length),
      moistureTrend: latest.moisture - initial.moisture,
      nTrend: latest.nitrogen - initial.nitrogen,
      pTrend: latest.phosphorus - initial.phosphorus,
      kTrend: latest.potassium - initial.potassium
    };
  }, [historicalData]);

  // AI Agronomic Insights based on actual trend numbers
  const agronomicInsights = useMemo(() => {
    if (!stats) return [];
    const insights = [];

    // Soil Moisture Insight
    if (stats.moistureTrend < -5) {
      insights.push({
        type: "warning",
        title: "Soil Moisture Depletion Trend",
        desc: `Average moisture is ${stats.avgMoisture}% and has dropped by ${Math.abs(stats.moistureTrend)}% over 30 days. Increase drip irrigation cycles to prevent root moisture stress.`,
        icon: <TrendingDown className="h-4 w-4 text-amber-500" />
      });
    } else if (stats.avgMoisture < 35) {
      insights.push({
        type: "danger",
        title: "Critical Low Moisture Threshold",
        desc: `Moisture average is ${stats.avgMoisture}%, which is below the optimal crop threshold (40%). Immediate irrigation flush recommended.`,
        icon: <AlertTriangle className="h-4 w-4 text-rose-500" />
      });
    } else {
      insights.push({
        type: "success",
        title: "Sufficient Hydration Matrix",
        desc: `Soil moisture is healthy at ${stats.avgMoisture}% average with stable seasonal retention (+${stats.moistureTrend}% walk).`,
        icon: <TrendingUp className="h-4 w-4 text-emerald-500" />
      });
    }

    // NPK Insights
    if (stats.avgN < 80) {
      insights.push({
        type: "warning",
        title: "Nitrogen Deficient Runoff",
        desc: `Average nitrogen is low at ${stats.avgN} mg/kg. Organic urea spray or bio-fertilizers are recommended to support leaf development.`,
        icon: <Lightbulb className="h-4 w-4 text-indigo-500" />
      });
    } else if (stats.nTrend < -10) {
      insights.push({
        type: "warning",
        title: "Nitrogen Leaching Spotted",
        desc: `Nitrogen level declined by ${Math.abs(stats.nTrend)} mg/kg. Corresponds to heavy irrigation or rainfall draining sub-surface nutrients.`,
        icon: <TrendingDown className="h-4 w-4 text-amber-500" />
      });
    } else {
      insights.push({
        type: "success",
        title: "Optimal Nitrogen Nitrogenase Activity",
        desc: `Nitrogen levels are holding a highly active average of ${stats.avgN} mg/kg (+${stats.nTrend} mg/kg shift).`,
        icon: <Sparkles className="h-4 w-4 text-emerald-500" />
      });
    }

    if (stats.avgP < 25) {
      insights.push({
        type: "info",
        title: "Phosphorus Root Activation Tip",
        desc: `Phosphorus is sitting at ${stats.avgP} mg/kg. High potassium/phosphorus rock dust during flowering will accelerate root starch storage.`,
        icon: <Info className="h-4 w-4 text-sky-500" />
      });
    }

    return insights;
  }, [stats]);

  const toggleLine = (key: keyof typeof visibleLines) => {
    setVisibleLines((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Custom tooltips for nice styling and localized human diagnostics
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 text-white border border-slate-700/80 p-3.5 rounded-xl shadow-xl font-sans text-xs space-y-2 max-w-[240px]">
          <p className="font-bold text-[11px] text-slate-300 border-b border-slate-700 pb-1.5 flex items-center justify-between">
            <span>📅 {label}</span>
            <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-extrabold">Soil Log</span>
          </p>
          <div className="space-y-1.5">
            {payload.map((entry: any) => {
              const isMoisture = entry.dataKey === "moisture";
              return (
                <div key={entry.name} className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: entry.stroke }}
                    />
                    {entry.name}
                  </span>
                  <span className="font-mono font-bold" style={{ color: entry.stroke }}>
                    {entry.value} {isMoisture ? "%" : "mg/kg"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    };
    return null;
  };

  return (
    <div
      id="soil-moisture-npk-trend-container"
      className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6"
    >
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-indigo-600 animate-pulse" /> Recharts Analytics
          </span>
          <h2 className="text-slate-800 text-lg font-black uppercase tracking-tight mt-1.5 flex items-center gap-2">
            📊 Historical 30-Day Moisture & N-P-K Trends
          </h2>
          <p className="text-slate-500 text-xs font-semibold">
            Interactive dual-axis line chart logging telemetry dynamics across primary vital soil attributes.
          </p>
        </div>

        {/* View Focus Controller */}
        <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1 gap-1">
          <button
            onClick={() => setFocusMetric("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              focusMetric === "all"
                ? "bg-white text-indigo-700 shadow-sm border border-slate-100"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            All Active
          </button>
          <button
            onClick={() => setFocusMetric("moisture")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              focusMetric === "moisture"
                ? "bg-white text-emerald-700 shadow-sm border border-slate-100"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Moisture Only
          </button>
          <button
            onClick={() => setFocusMetric("npk")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              focusMetric === "npk"
                ? "bg-white text-indigo-700 shadow-sm border border-slate-100"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            N-P-K Focus
          </button>
        </div>
      </div>

      {/* Grid of 4 Key Indicators with Trend Badges */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Soil Moisture Mini-card */}
          <div className="p-4 bg-slate-50/70 border border-slate-150 rounded-xl space-y-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">30D Avg Moisture</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black text-slate-800 font-mono">{stats.avgMoisture}%</span>
              <span
                className={`text-[9.5px] font-extrabold flex items-center gap-0.5 px-1.5 py-0.5 rounded ${
                  stats.moistureTrend >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                }`}
              >
                {stats.moistureTrend >= 0 ? "+" : ""}
                {stats.moistureTrend}%
              </span>
            </div>
            <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: `${stats.avgMoisture}%` }} />
            </div>
          </div>

          {/* Nitrogen N Mini-card */}
          <div className="p-4 bg-slate-50/70 border border-slate-150 rounded-xl space-y-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">30D Avg Nitrogen (N)</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black text-slate-800 font-mono">{stats.avgN} mg/kg</span>
              <span
                className={`text-[9.5px] font-extrabold flex items-center gap-0.5 px-1.5 py-0.5 rounded ${
                  stats.nTrend >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                }`}
              >
                {stats.nTrend >= 0 ? "+" : ""}
                {stats.nTrend} mg
              </span>
            </div>
            <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full" style={{ width: `${Math.min((stats.avgN / 200) * 100, 100)}%` }} />
            </div>
          </div>

          {/* Phosphorus P Mini-card */}
          <div className="p-4 bg-slate-50/70 border border-slate-150 rounded-xl space-y-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">30D Avg Phosphorus (P)</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black text-slate-800 font-mono">{stats.avgP} mg/kg</span>
              <span
                className={`text-[9.5px] font-extrabold flex items-center gap-0.5 px-1.5 py-0.5 rounded ${
                  stats.pTrend >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                }`}
              >
                {stats.pTrend >= 0 ? "+" : ""}
                {stats.pTrend} mg
              </span>
            </div>
            <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
              <div className="bg-teal-500 h-full" style={{ width: `${Math.min((stats.avgP / 100) * 100, 100)}%` }} />
            </div>
          </div>

          {/* Potassium K Mini-card */}
          <div className="p-4 bg-slate-50/70 border border-slate-150 rounded-xl space-y-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">30D Avg Potassium (K)</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black text-slate-800 font-mono">{stats.avgK} mg/kg</span>
              <span
                className={`text-[9.5px] font-extrabold flex items-center gap-0.5 px-1.5 py-0.5 rounded ${
                  stats.kTrend >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                }`}
              >
                {stats.kTrend >= 0 ? "+" : ""}
                {stats.kTrend} mg
              </span>
            </div>
            <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
              <div className="bg-orange-500 h-full" style={{ width: `${Math.min((stats.avgK / 300) * 100, 100)}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Main Chart Section */}
      <div className="relative">
        {/* Interactive Checkbox Legend Overlays */}
        <div className="flex flex-wrap justify-center gap-3.5 md:gap-5 pb-4 text-xs font-extrabold">
          <button
            onClick={() => toggleLine("moisture")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
              visibleLines.moisture
                ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs"
                : "bg-slate-50 border-slate-200 text-slate-400 line-through"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
            Soil Moisture (%)
          </button>
          <button
            onClick={() => toggleLine("nitrogen")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
              visibleLines.nitrogen
                ? "bg-indigo-50 border-indigo-300 text-indigo-800 shadow-xs"
                : "bg-slate-50 border-slate-200 text-slate-400 line-through"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#6366f1]" />
            Nitrogen (N)
          </button>
          <button
            onClick={() => toggleLine("phosphorus")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
              visibleLines.phosphorus
                ? "bg-teal-50 border-teal-300 text-teal-800 shadow-xs"
                : "bg-slate-50 border-slate-200 text-slate-400 line-through"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#14b8a6]" />
            Phosphorus (P)
          </button>
          <button
            onClick={() => toggleLine("potassium")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
              visibleLines.potassium
                ? "bg-orange-50 border-orange-300 text-orange-800 shadow-xs"
                : "bg-slate-50 border-slate-200 text-slate-400 line-through"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />
            Potassium (K)
          </button>
        </div>

        {/* Chart Canvas */}
        <div className="h-[280px] w-full bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={historicalData}
              margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              
              {/* Common X-Axis */}
              <XAxis
                dataKey="dateStr"
                stroke="#64748b"
                fontSize={9}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              
              {/* Dual Y-Axes: Left for Moisture (%), Right for Nutrients (mg/kg) */}
              {(focusMetric === "all" || focusMetric === "moisture") && (
                <YAxis
                  yAxisId="left"
                  domain={[0, 100]}
                  stroke="#10b981"
                  fontSize={9}
                  tickFormatter={(val) => `${val}%`}
                  tickLine={false}
                  axisLine={false}
                />
              )}
              
              {(focusMetric === "all" || focusMetric === "npk") && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, "auto"]}
                  stroke="#6366f1"
                  fontSize={9}
                  tickFormatter={(val) => `${val} mg`}
                  tickLine={false}
                  axisLine={false}
                />
              )}

              <Tooltip content={<CustomTooltip />} />

              {/* Moisture Line on Left Axis */}
              {(focusMetric === "all" || focusMetric === "moisture") && visibleLines.moisture && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="moisture"
                  name="Soil Moisture"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              )}

              {/* N Line on Right Axis */}
              {(focusMetric === "all" || focusMetric === "npk") && visibleLines.nitrogen && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="nitrogen"
                  name="Nitrogen (N)"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              )}

              {/* P Line on Right Axis */}
              {(focusMetric === "all" || focusMetric === "npk") && visibleLines.phosphorus && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="phosphorus"
                  name="Phosphorus (P)"
                  stroke="#14b8a6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              )}

              {/* K Line on Right Axis */}
              {(focusMetric === "all" || focusMetric === "npk") && visibleLines.potassium && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="potassium"
                  name="Potassium (K)"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Agronomic AI Advisor Box */}
      <div className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-2xl p-5 border border-indigo-100/70 space-y-3">
        <h3 className="text-xs font-black uppercase text-indigo-900 tracking-wider flex items-center gap-1.5">
          <Sparkles className="h-4.5 w-4.5 text-indigo-600" />
          Soil Telemetry AI Agronomic Report
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agronomicInsights.map((insight, index) => (
            <div
              key={index}
              className="p-3 bg-white rounded-xl border border-slate-100 flex gap-3 items-start shadow-xs"
            >
              <div className="p-1.5 bg-slate-50 rounded-lg shrink-0">
                {insight.icon}
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-slate-800 block">{insight.title}</span>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{insight.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
