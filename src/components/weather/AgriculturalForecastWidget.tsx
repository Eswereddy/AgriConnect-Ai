import React, { useState, useEffect } from "react";
import {
  CloudSun,
  Wind,
  Droplets,
  Thermometer,
  AlertTriangle,
  Calendar,
  TrendingUp,
  CheckCircle,
  RefreshCw,
  Search,
  Sparkles,
  MapPin,
  CloudRain,
  Snowflake,
  ArrowUpRight
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

interface ForecastItem {
  day: string;
  date: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  rainMm: number;
  windKmh: number;
  frostRiskPercent: number;
  sowingSuitability: string;
  harvestSuitability: string;
  agronomicAdvice: string;
}

interface ForecastResponse {
  locationName: string;
  cropName: string;
  forecast: ForecastItem[];
  planningSummary: string;
}

interface AgriculturalForecastWidgetProps {
  defaultLocation?: string;
  defaultCrop?: string;
}

export const AgriculturalForecastWidget: React.FC<AgriculturalForecastWidgetProps> = ({
  defaultLocation = "Ludhiana Sector 4, Punjab",
  defaultCrop = "Rice Paddy"
}) => {
  const [location, setLocation] = useState<string>(defaultLocation);
  const [cropName, setCropName] = useState<string>(defaultCrop);
  const [customLocation, setCustomLocation] = useState<string>("");
  const [isCustomLocActive, setIsCustomLocActive] = useState<boolean>(false);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<ForecastResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  const locationsList = [
    "Ludhiana Sector 4, Punjab",
    "Solan Valley Block B, Himachal",
    "Deccan Cotton Belt, Andhra Pradesh",
    "Srinagar Apple Orchards, Kashmir",
    "Guntur Chilli Zones, Andhra"
  ];

  const cropsList = [
    "Rice Paddy",
    "Wheat",
    "Tomato",
    "Maize",
    "Coffee",
    "Cotton",
    "Apple"
  ];

  const fetchForecast = async (locToFetch: string, cropToFetch: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/agricultural-forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: locToFetch,
          cropName: cropToFetch
        })
      });

      if (!response.ok) {
        throw new Error("Failed to retrieve weather intelligence.");
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while loading agricultural weather metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchForecast(location, cropName);
    }, 800);

    return () => clearTimeout(handler);
  }, [location, cropName]);

  const handleRefresh = () => {
    fetchForecast(location, cropName);
  };

  const handleCustomLocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customLocation.trim()) {
      setLocation(customLocation);
      setIsCustomLocActive(false);
    }
  };

  // Suitability styling helper
  const getSuitabilityStyle = (status: string) => {
    switch (status) {
      case "Highly Optimal":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Optimal":
        return "bg-teal-50 text-teal-800 border-teal-200";
      case "Marginal":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Unsuitable":
        return "bg-rose-50 text-rose-800 border-rose-200";
      default:
        return "bg-slate-50 text-slate-800 border-slate-200";
    }
  };

  const selectedDay = data?.forecast?.[selectedDayIndex];

  return (
    <div id="agri-weather-forecast-widget" className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Widget Header */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-900 text-white p-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-emerald-950/50 border border-emerald-500/30 text-teal-200 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
              <CloudSun className="h-4 w-4 text-emerald-400 animate-pulse" /> 7-Day Precision Agricultural Forecast
            </span>
            <h2 className="text-xl font-extrabold tracking-tight mt-2 text-white">METEOROLOGICAL CYCLES PLANNER</h2>
            <p className="text-teal-100/80 text-xs mt-1">
              Analyzing rain volume patterns, surface wind velocity, and radiative frost risk to schedule operations.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="bg-white/10 hover:bg-white/20 active:bg-white/30 text-white border border-white/20 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Feed
          </button>
        </div>

        {/* Configuration Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 mt-5 pt-4 border-t border-white/15">
          {/* Location Selector */}
          <div className="lg:col-span-5 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider">Farm Location</span>
            <div className="flex gap-2">
              {isCustomLocActive ? (
                <form onSubmit={handleCustomLocSubmit} className="flex-1 flex gap-1">
                  <input
                    type="text"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    placeholder="Enter city, region, or state..."
                    className="flex-1 bg-white text-slate-800 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2.5 rounded-lg font-bold"
                  >
                    Set
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCustomLocActive(false)}
                    className="bg-white/10 text-white text-[10px] px-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <div className="flex-1 flex gap-1 items-center bg-emerald-950/40 border border-teal-700/50 rounded-lg px-2 py-1.5">
                  <MapPin className="h-4.5 w-4.5 text-teal-400 shrink-0" />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1 bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
                  >
                    {locationsList.map((loc) => (
                      <option key={loc} value={loc} className="bg-emerald-900 text-white text-xs">
                        {loc}
                      </option>
                    ))}
                    <option value="CUSTOM_TRIGGER" className="bg-emerald-900 text-teal-300 text-xs font-bold">
                      + Custom Location...
                    </option>
                  </select>
                </div>
              )}
              {!isCustomLocActive && (
                <button
                  onClick={() => setIsCustomLocActive(true)}
                  className="bg-white/10 hover:bg-white/20 text-white p-1.5 rounded-lg transition-all"
                  title="Search custom location"
                >
                  <Search className="h-4.5 w-4.5" />
                </button>
              )}
            </div>
          </div>

          {/* Crop Selector */}
          <div className="lg:col-span-4 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider">Target Crop Context</span>
            <div className="flex items-center bg-emerald-950/40 border border-teal-700/50 rounded-lg px-2 py-1.5">
              <Sparkles className="h-4.5 w-4.5 text-teal-400 shrink-0 mr-1" />
              <select
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="flex-1 bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
              >
                {cropsList.map((crop) => (
                  <option key={crop} value={crop} className="bg-emerald-900 text-white text-xs">
                    {crop}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Display badge */}
          <div className="lg:col-span-3 flex items-end justify-start md:justify-end">
            <div className="bg-emerald-950/30 border border-teal-500/20 px-3.5 py-1.5 rounded-xl text-right">
              <span className="text-[8px] text-teal-300 block font-bold uppercase tracking-widest">Active Analysis</span>
              <span className="text-white text-xs font-black uppercase tracking-tight">
                {data?.locationName || location.split(",")[0]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="h-10 w-10 text-emerald-600 animate-spin" />
          <p className="text-slate-500 text-xs font-semibold animate-pulse uppercase tracking-wider">
            Compiling micro-climate forecasting matrices via Gemini...
          </p>
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-rose-50/50 border-b border-rose-100 flex flex-col items-center gap-3">
          <AlertTriangle className="h-12 w-12 text-rose-500" />
          <div className="max-w-md">
            <h4 className="text-rose-800 text-sm font-bold uppercase">Forecast Sync Error</h4>
            <p className="text-rose-600 text-xs mt-1 font-medium">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl uppercase tracking-wider"
            >
              Retry Connection
            </button>
          </div>
        </div>
      ) : data ? (
        <div className="p-5 space-y-6">
          {/* Executive Scientific Summary */}
          <div className="bg-teal-50/50 border border-teal-100 rounded-2xl p-4 flex gap-3.5 items-start">
            <div className="bg-teal-600 text-white p-2 rounded-xl shadow-xs shrink-0 mt-0.5">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] text-teal-800 font-extrabold uppercase tracking-widest">
                AI Agronomic Planning Outlook
              </span>
              <p className="text-slate-700 text-xs leading-relaxed font-medium">
                {data.planningSummary}
              </p>
            </div>
          </div>

          {/* 7-Day Timeline Selector (horizontal cards) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="h-4.5 w-4.5 text-emerald-600" /> Weekly Atmospheric Timeline
              </h3>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Select day to view detailed guide</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {data.forecast.map((fd, idx) => {
                const isSelected = selectedDayIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between h-32 cursor-pointer ${
                      isSelected
                        ? "bg-slate-900 border-slate-900 text-white shadow-md scale-[1.02]"
                        : "bg-slate-50 hover:bg-slate-100/70 border-slate-200/80 text-slate-800"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-black uppercase">{fd.day}</span>
                        <span className={`text-[8px] font-bold ${isSelected ? "text-teal-400" : "text-slate-400"}`}>
                          {fd.date}
                        </span>
                      </div>
                      <p className={`text-[10px] font-semibold truncate mt-1 ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                        {fd.condition}
                      </p>
                    </div>

                    <div className="space-y-1">
                      {/* Highlight key agricultural metrics: Rainfall, Wind, Frost */}
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="opacity-70">Rain:</span>
                        <span className={`font-black ${fd.rainMm > 0 ? "text-sky-500" : ""}`}>{fd.rainMm.toFixed(1)}mm</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="opacity-70">Wind:</span>
                        <span className="font-bold">{fd.windKmh.toFixed(0)}kph</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="opacity-70">Frost:</span>
                        <span className={`font-bold ${fd.frostRiskPercent > 20 ? "text-rose-500" : ""}`}>{fd.frostRiskPercent}%</span>
                      </div>
                    </div>

                    <div className="border-t pt-1.5 mt-1 border-current/10 flex justify-between items-center text-[10px] font-bold">
                      <span className="truncate">Range:</span>
                      <span className="font-mono">{fd.tempMax}°/{fd.tempMin}°</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Day Analytical Intelligence Card */}
          {selectedDay && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 border border-slate-200 rounded-2xl p-5 bg-slate-50/45">
              {/* Highlight Parameters Gauges/Details */}
              <div className="lg:col-span-5 space-y-4">
                <div className="border-b border-slate-200 pb-2.5">
                  <span className="text-[9px] uppercase font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    Day Assessment
                  </span>
                  <h4 className="text-slate-800 font-extrabold text-sm mt-1">
                    {selectedDay.day} ({selectedDay.date}) Micro-climate Parameters
                  </h4>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* Localized Rainfall widget */}
                  <div className="bg-white border border-slate-200/75 p-3 rounded-xl flex flex-col justify-between h-24">
                    <span className="text-[8px] text-slate-400 font-bold uppercase flex items-center gap-1">
                      <CloudRain className="h-3 w-3 text-sky-500" /> Rainfall
                    </span>
                    <div className="my-1.5">
                      <span className="text-slate-800 text-base font-black tracking-tight font-mono">
                        {selectedDay.rainMm.toFixed(1)}
                      </span>
                      <span className="text-[10px] text-slate-500 ml-0.5 font-bold">mm</span>
                    </div>
                    <span className={`text-[8px] font-extrabold px-1 py-0.2 rounded w-fit ${
                      selectedDay.rainMm > 5 ? "bg-sky-50 text-sky-700" : "bg-slate-50 text-slate-400"
                    }`}>
                      {selectedDay.rainMm > 5 ? "Significant Rain" : "No Rain Risk"}
                    </span>
                  </div>

                  {/* Wind Velocity */}
                  <div className="bg-white border border-slate-200/75 p-3 rounded-xl flex flex-col justify-between h-24">
                    <span className="text-[8px] text-slate-400 font-bold uppercase flex items-center gap-1">
                      <Wind className="h-3 w-3 text-teal-500" /> Wind Speed
                    </span>
                    <div className="my-1.5">
                      <span className="text-slate-800 text-base font-black tracking-tight font-mono">
                        {selectedDay.windKmh.toFixed(1)}
                      </span>
                      <span className="text-[10px] text-slate-500 ml-0.5 font-bold">km/h</span>
                    </div>
                    <span className={`text-[8px] font-extrabold px-1 py-0.2 rounded w-fit ${
                      selectedDay.windKmh > 18 ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                    }`}>
                      {selectedDay.windKmh > 18 ? "High Spray Drift" : "Calm Canopy"}
                    </span>
                  </div>

                  {/* Frost Risk Data */}
                  <div className="bg-white border border-slate-200/75 p-3 rounded-xl flex flex-col justify-between h-24">
                    <span className="text-[8px] text-slate-400 font-bold uppercase flex items-center gap-1">
                      <Snowflake className="h-3 w-3 text-rose-400" /> Frost Risk
                    </span>
                    <div className="my-1.5">
                      <span className="text-slate-800 text-base font-black tracking-tight font-mono">
                        {selectedDay.frostRiskPercent}
                      </span>
                      <span className="text-[10px] text-slate-500 ml-0.5 font-bold">%</span>
                    </div>
                    <span className={`text-[8px] font-extrabold px-1 py-0.2 rounded w-fit ${
                      selectedDay.frostRiskPercent > 35 ? "bg-rose-50 text-rose-700 animate-pulse" : "bg-slate-50 text-slate-400"
                    }`}>
                      {selectedDay.frostRiskPercent > 35 ? "Critical Danger" : "Negligible"}
                    </span>
                  </div>
                </div>

                {/* Sowing and Harvesting Suitability ratings */}
                <div className="space-y-2.5 bg-white border border-slate-200/75 rounded-xl p-3.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-600">Sowing / Planting Suitability:</span>
                    <span className={`text-[9.5px] uppercase font-black px-2 py-0.5 rounded-md border ${getSuitabilityStyle(selectedDay.sowingSuitability)}`}>
                      {selectedDay.sowingSuitability}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold pt-2.5 border-t border-slate-100">
                    <span className="text-slate-600">Harvest Window Rating:</span>
                    <span className={`text-[9.5px] uppercase font-black px-2 py-0.5 rounded-md border ${getSuitabilityStyle(selectedDay.harvestSuitability)}`}>
                      {selectedDay.harvestSuitability}
                    </span>
                  </div>
                </div>
              </div>

              {/* Day Agronomic Guidance & Visualizations */}
              <div className="lg:col-span-7 flex flex-col justify-between gap-4">
                <div className="bg-white border border-slate-200/75 rounded-2xl p-4.5 space-y-3 shadow-xs h-full flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h5 className="text-slate-800 font-black text-xs uppercase tracking-widest flex items-center gap-1.5">
                      <ArrowUpRight className="h-4 w-4 text-emerald-600" /> Operational Action Advice
                    </h5>
                    <p className="text-slate-600 text-xs leading-relaxed font-medium">
                      {selectedDay.agronomicAdvice}
                    </p>
                  </div>

                  <div className="bg-slate-50/55 rounded-xl p-3 border border-slate-150 flex items-center justify-between text-[11px] text-slate-500 font-bold">
                    <span>Expected Temperatures:</span>
                    <span className="text-slate-800 font-extrabold font-mono text-xs">
                      Max: <strong className="text-rose-600">{selectedDay.tempMax}°C</strong> • Min: <strong className="text-sky-600">{selectedDay.tempMin}°C</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Weekly Parameter Curve Chart (Recharts) */}
          <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-3">
            <div>
              <h4 className="text-slate-800 font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="h-4.5 w-4.5 text-emerald-600" /> Micro-climate Parameters Trend
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Plotting localized rainfall (mm), surface wind speed (km/h) and radiative frost risk (%) over the 7-day window.</p>
            </div>

            <div className="h-52 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.forecast} margin={{ top: 5, right: 15, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartRain" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="chartWind" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="chartFrost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                  <YAxis stroke="#94a3b8" fontSize={10} />
                  <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "12px", border: "1px solid #e2e8f0" }} />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  <Area
                    name="Rainfall (mm)"
                    type="monotone"
                    dataKey="rainMm"
                    stroke="#0ea5e9"
                    fillOpacity={1}
                    fill="url(#chartRain)"
                    strokeWidth={2}
                  />
                  <Area
                    name="Wind Speed (km/h)"
                    type="monotone"
                    dataKey="windKmh"
                    stroke="#0d9488"
                    fillOpacity={1}
                    fill="url(#chartWind)"
                    strokeWidth={2}
                  />
                  <Area
                    name="Frost Risk (%)"
                    type="monotone"
                    dataKey="frostRiskPercent"
                    stroke="#ec4899"
                    fillOpacity={1}
                    fill="url(#chartFrost)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default AgriculturalForecastWidget;
