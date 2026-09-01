import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Thermometer,
  Droplets,
  AlertOctagon,
  ShieldAlert,
  HeartPulse,
  Clock,
  Droplet,
  Sun,
  Wind,
  Info,
  InfoIcon
} from "lucide-react";

export interface HeatStressData {
  temperature: number; // in Celsius
  humidity: number; // in %
  windSpeed?: number; // in km/h
  uvIndex?: number;
}

interface HeatStressWarningProps {
  initialData?: HeatStressData;
  onDataChange?: (data: HeatStressData) => void;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  uvIndex?: number;
}

// Robust Heat Index Calculation (NOAA / Rothfusz Regression)
function calculateHeatIndex(celsiusTemp: number, relativeHumidity: number): {
  heatIndexC: number;
  heatIndexF: number;
} {
  const tF = (celsiusTemp * 9) / 5 + 32;
  const rh = relativeHumidity;

  // Simple formula for low temperature/humidity
  let hiF = 0.5 * (tF + 61.0 + ((tF - 68.0) * 1.2) + (rh * 0.094));

  if (hiF >= 80) {
    // Standard Rothfusz regression
    hiF =
      -42.379 +
      2.04901523 * tF +
      10.14333127 * rh -
      0.22475541 * tF * rh -
      0.00683783 * tF * tF -
      0.05481717 * rh * rh +
      0.00122874 * tF * tF * rh +
      0.00085282 * tF * rh * rh -
      0.00000199 * tF * tF * rh * rh;

    // Adjustments
    if (rh < 13 && tF >= 80 && tF <= 112) {
      const adjustment = ((13 - rh) / 4) * Math.sqrt((17 - Math.abs(tF - 95)) / 17);
      hiF -= adjustment;
    } else if (rh > 85 && tF >= 80 && tF <= 87) {
      const adjustment = ((rh - 85) / 10) * ((87 - tF) / 5);
      hiF += adjustment;
    }
  }

  const hiC = ((hiF - 32) * 5) / 9;
  return {
    heatIndexC: hiC,
    heatIndexF: hiF
  };
}

export const HeatStressWarning: React.FC<HeatStressWarningProps> = ({
  initialData = { temperature: 34, humidity: 75, windSpeed: 10, uvIndex: 8 },
  onDataChange,
  temperature,
  humidity: humidityProp,
  windSpeed: windProp,
  uvIndex: uvProp
}) => {
  const [internalTemp, setInternalTemp] = useState<number>(initialData.temperature);
  const [internalHumidity, setInternalHumidity] = useState<number>(initialData.humidity);
  const [internalWind, setInternalWind] = useState<number>(initialData.windSpeed || 10);
  const [internalUv, setInternalUv] = useState<number>(initialData.uvIndex || 8);

  const isControlled = temperature !== undefined && humidityProp !== undefined;

  const temp = isControlled ? temperature : internalTemp;
  const humidity = isControlled ? humidityProp : internalHumidity;
  const wind = isControlled ? (windProp ?? 10) : internalWind;
  const uv = isControlled ? (uvProp ?? 8) : internalUv;

  const handleTempChange = (newVal: number) => {
    if (isControlled) {
      if (onDataChange) onDataChange({ temperature: newVal, humidity, windSpeed: wind, uvIndex: uv });
    } else {
      setInternalTemp(newVal);
    }
  };

  const handleHumidityChange = (newVal: number) => {
    if (isControlled) {
      if (onDataChange) onDataChange({ temperature: temp, humidity: newVal, windSpeed: wind, uvIndex: uv });
    } else {
      setInternalHumidity(newVal);
    }
  };

  const handleWindChange = (newVal: number) => {
    if (isControlled) {
      if (onDataChange) onDataChange({ temperature: temp, humidity, windSpeed: newVal, uvIndex: uv });
    } else {
      setInternalWind(newVal);
    }
  };

  const handleUvChange = (newVal: number) => {
    if (isControlled) {
      if (onDataChange) onDataChange({ temperature: temp, humidity, windSpeed: wind, uvIndex: newVal });
    } else {
      setInternalUv(newVal);
    }
  };

  // Trigger callback when state changes for uncontrolled setup
  React.useEffect(() => {
    if (onDataChange && !isControlled) {
      onDataChange({ temperature: internalTemp, humidity: internalHumidity, windSpeed: internalWind, uvIndex: internalUv });
    }
  }, [internalTemp, internalHumidity, internalWind, internalUv, onDataChange, isControlled]);

  const { heatIndexC, heatIndexF } = useMemo(() => {
    return calculateHeatIndex(temp, humidity);
  }, [temp, humidity]);

  // Determine stress level and corresponding assets/styles
  const stressAssessment = useMemo(() => {
    const hi = heatIndexC;

    if (hi >= 41) {
      return {
        level: "Extreme Danger",
        badge: "bg-rose-600 text-white border-rose-700",
        bg: "bg-rose-50 border-rose-200 text-rose-950",
        alertBg: "bg-rose-500/10 border-rose-500/20 text-rose-700",
        text: "text-rose-900",
        progressColor: "bg-rose-600",
        description: "CRITICAL DANGER. Heatstroke is highly imminent with continued exposure or physical exertion.",
        medicalWarning: "HEATSTROKE EMERGENCY LEVEL. Stop all active field labor immediately. Retreat to air-cooled or heavily shaded rooms.",
        waterNeeded: "1000 - 1200 mL / hour (with ORS electrolyte support)",
        restCycle: "Rest 45 mins, Work max 15 mins (under complete shade only)",
        iconColor: "text-rose-600",
        pulse: true
      };
    } else if (hi >= 32) {
      return {
        level: "Danger",
        badge: "bg-amber-600 text-white border-amber-700",
        bg: "bg-amber-50 border-amber-200 text-amber-950",
        alertBg: "bg-amber-500/10 border-amber-500/20 text-amber-700",
        text: "text-amber-900",
        progressColor: "bg-amber-500",
        description: "HIGH RISK. Heat exhaustion, severe dehydration, and heat cramps are highly likely. Avoid direct mid-day sun.",
        medicalWarning: "STRESS DANGER ZONE. Set up a mandatory buddy system. Make sure every worker is monitored.",
        waterNeeded: "800 - 1000 mL / hour",
        restCycle: "Rest 30 mins, Work 30 mins",
        iconColor: "text-amber-600",
        pulse: true
      };
    } else if (hi >= 27) {
      return {
        level: "Caution",
        badge: "bg-yellow-500 text-slate-900 border-yellow-600",
        bg: "bg-yellow-50 border-yellow-200 text-yellow-950",
        alertBg: "bg-yellow-500/10 border-yellow-500/20 text-yellow-700",
        text: "text-yellow-900",
        progressColor: "bg-yellow-500",
        description: "MODERATE RISK. Fatigue, muscle stiffness, and light-headedness are possible with prolonged exposure.",
        medicalWarning: "EXPOSURE WARNING. Ensure workers take shade breaks and maintain steady fluid intake.",
        waterNeeded: "500 - 800 mL / hour",
        restCycle: "Rest 15 mins, Work 45 mins",
        iconColor: "text-yellow-600",
        pulse: false
      };
    } else {
      return {
        level: "Safe / Nominal",
        badge: "bg-emerald-600 text-white border-emerald-700",
        bg: "bg-emerald-50 border-emerald-200 text-emerald-950",
        alertBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-700",
        text: "text-emerald-900",
        progressColor: "bg-emerald-500",
        description: "LOW RISK. Microclimatic comfort index is stable. Safe for standard farm operations.",
        medicalWarning: "NOMINAL CONDITIONS. Follow standard hydration guidelines (250ml every 30 minutes of physical labor).",
        waterNeeded: "250 - 500 mL / hour",
        restCycle: "Standard breaks (e.g., 10 mins every 2 hours)",
        iconColor: "text-emerald-600",
        pulse: false
      };
    }
  }, [heatIndexC]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6" id="heat-stress-warning-card">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
            <Sun className="h-3 w-3 text-emerald-600 animate-spin-slow" /> Microclimate Advisory
          </span>
          <h3 className="text-base font-extrabold text-slate-900 font-display">
            Heat Stress Warning & Biometeorological Monitor
          </h3>
          <p className="text-slate-500 text-xs font-medium">
            Dynamic worker health protection system fueled by real-time heat load indices.
          </p>
        </div>

        {/* Status Indicator Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold">Risk Level:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-xs ${stressAssessment.badge}`}>
            {stressAssessment.level}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Microclimate Simulator Panel */}
        <div className="lg:col-span-5 space-y-4 bg-slate-50 rounded-xl p-4 border border-slate-100">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Wind className="h-4 w-4 text-emerald-600" />
            Simulator Controls
          </h4>
          <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
            Drag the sliders to simulate temperature, humidity, UV index, and wind to observe dynamic changes in alerts.
          </p>

          <div className="space-y-4 pt-2">
            {/* Temperature Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-bold flex items-center gap-1">
                  <Thermometer className="h-4 w-4 text-rose-500" /> Temperature
                </span>
                <span className="text-slate-800 font-black font-mono">{temp.toFixed(1)}°C ({((temp * 9) / 5 + 32).toFixed(1)}°F)</span>
              </div>
              <input
                type="range"
                min="15"
                max="48"
                step="0.5"
                value={temp}
                id="simulator-temp"
                onChange={(e) => handleTempChange(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 bg-slate-200 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                <span>15°C (Cool)</span>
                <span>32°C (Warm)</span>
                <span>48°C (Extreme)</span>
              </div>
            </div>

            {/* Humidity Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-bold flex items-center gap-1">
                  <Droplets className="h-4 w-4 text-sky-500" /> Relative Humidity
                </span>
                <span className="text-slate-800 font-black font-mono">{humidity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="1"
                value={humidity}
                id="simulator-humidity"
                onChange={(e) => handleHumidityChange(parseInt(e.target.value))}
                className="w-full accent-emerald-600 bg-slate-200 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                <span>10% (Arid)</span>
                <span>55% (Moderate)</span>
                <span>100% (Saturated)</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="pt-2 border-t border-slate-200/60">
              <span className="text-[10px] font-black uppercase text-slate-400 block mb-1.5">Simulated Climate Presets</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="preset-monsoon"
                  onClick={() => {
                    handleTempChange(32.5);
                    handleHumidityChange(85);
                    handleWindChange(8);
                    handleUvChange(7);
                  }}
                  className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 transition shadow-xs text-left cursor-pointer"
                >
                  🌧️ Monsoon Humid (32°C, 85%)
                </button>
                <button
                  type="button"
                  id="preset-heatwave"
                  onClick={() => {
                    handleTempChange(41.0);
                    handleHumidityChange(45);
                    handleWindChange(12);
                    handleUvChange(11);
                  }}
                  className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/50 rounded-lg text-[10px] font-bold text-rose-800 transition shadow-xs text-left cursor-pointer"
                >
                  🔥 Dry Heatwave (41°C, 45%)
                </button>
                <button
                  type="button"
                  id="preset-nominal"
                  onClick={() => {
                    handleTempChange(26.0);
                    handleHumidityChange(55);
                    handleWindChange(15);
                    handleUvChange(5);
                  }}
                  className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/50 rounded-lg text-[10px] font-bold text-emerald-800 transition shadow-xs text-left cursor-pointer"
                >
                  🍃 Optimal Spring (26°C, 55%)
                </button>
                <button
                  type="button"
                  id="preset-extreme"
                  onClick={() => {
                    handleTempChange(44.0);
                    handleHumidityChange(80);
                    handleWindChange(5);
                    handleUvChange(12);
                  }}
                  className="px-2.5 py-1.5 bg-red-100 hover:bg-red-200 border border-red-200 rounded-lg text-[10px] font-bold text-red-900 transition shadow-xs text-left cursor-pointer"
                >
                  🚨 Severe Critical (44°C, 80%)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Warnings and Guidance Display */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Heat Index Readout Panel */}
          <div className={`p-5 rounded-2xl border transition-all duration-300 ${stressAssessment.bg}`}>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Calculated Heat Index</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black tracking-tight leading-none">
                    {heatIndexC.toFixed(1)}°C
                  </span>
                  <span className="text-sm font-bold opacity-80">
                     / {heatIndexF.toFixed(1)}°F
                  </span>
                </div>
                <span className="text-[10px] font-bold bg-white/60 text-slate-800 border border-black/5 px-2 py-0.5 rounded-md inline-block mt-1">
                  Feels like index accounting for humidity
                </span>
              </div>

              {stressAssessment.pulse && (
                <div className="relative flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-black/5 space-y-2">
              <p className="text-xs font-semibold leading-relaxed">
                {stressAssessment.description}
              </p>
              
              <div className={`p-3 rounded-lg flex gap-2 items-start text-xs border ${stressAssessment.alertBg}`}>
                <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <div className="font-semibold">
                  <strong>Safety Action Warning:</strong> {stressAssessment.medicalWarning}
                </div>
              </div>
            </div>
          </div>

          {/* Core Physiological Safety Guidance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Hydration Guidance */}
            <div className="p-4 rounded-xl border border-slate-200/70 bg-white shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-sky-50 rounded-lg text-sky-600">
                  <Droplet className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Hydration Guide</span>
                  <h5 className="text-xs font-black text-slate-800 leading-none">Hourly Fluid Intake</h5>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <p className="text-sm font-extrabold text-slate-900">{stressAssessment.waterNeeded}</p>
                <p className="text-[10px] text-slate-500 font-semibold mt-1 leading-relaxed">
                  Avoid caffeinated and high-sugar drinks. Prefer cool well water with ORS rehydration powder.
                </p>
              </div>
            </div>

            {/* Rest-Work Cycle */}
            <div className="p-4 rounded-xl border border-slate-200/70 bg-white shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
                  <Clock className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Rest Protocol</span>
                  <h5 className="text-xs font-black text-slate-800 leading-none">Work / Shade Breaks</h5>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <p className="text-sm font-extrabold text-slate-900">{stressAssessment.restCycle}</p>
                <p className="text-[10px] text-slate-500 font-semibold mt-1 leading-relaxed">
                  Take active breaks inside heavy tree shade or air-conditioned tractor cabins. Maintain observation of peers.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Heat Stress Prevention Tips */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/60 flex items-start gap-2.5">
            <HeartPulse className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 block">Immediate Heat Exhaustion Warning Signs</span>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-600 font-bold list-disc pl-4">
                <li>Heavy sweating & skin clamminess</li>
                <li>Dizziness, lightheadedness or nausea</li>
                <li>Rapid breathing or weak pulse</li>
                <li>Sudden severe muscle cramps</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
