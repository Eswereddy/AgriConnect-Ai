import React, { useState, useEffect } from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Clock,
  TrendingUp,
  Droplet,
  Wrench,
  Bot,
  RefreshCw,
  Play,
  Check,
  Activity,
  Leaf,
  DollarSign,
  Wind,
  Sun,
  CloudRain,
  Database,
  Layers,
  CheckCircle,
  Cpu,
  Languages
} from "lucide-react";
import { SupportedLanguage, LANGUAGES_INFO } from "../../utils/translation";

interface Task {
  task: string;
  priority: "High" | "Medium" | "Low";
  category: "Irrigation" | "Fertilizer" | "Pest Control" | "Maintenance";
  urgencyScore: number;
  description: string;
  resourceOptimization: string;
  costBenefit: {
    estimatedCost: number;
    projectedImpact: number;
  };
}

interface Alert {
  alert: string;
  component: string;
  severity: "Critical" | "Warning" | "Info";
}

interface CalendarWeek {
  week: string;
  focus: string;
  actions: string[];
}

interface AdvisoryData {
  dailyChecklist: Task[];
  predictiveAlerts: Alert[];
  calendar: CalendarWeek[];
  schedule: {
    irrigation: string;
    fertilizer: string;
    pestSpray: string;
    harvestTiming: string;
  };
  postHarvest: string[];
  marketTiming: {
    mandiSuggestions: string;
    pricePrediction: string;
  };
  weatherAdaptiveSuggestions: string;
}

// Fallback high-fidelity mock data if Gemini API key is missing
const MOCK_ADVISORIES: Record<string, AdvisoryData> = {
  "Basmati Rice": {
    dailyChecklist: [
      {
        task: "Sub-surface irrigation cycle optimization",
        priority: "High",
        category: "Irrigation",
        urgencyScore: 92,
        description: "Maintain a thin 3cm standing water film on transplant fields. Dwell sensors indicate accelerated percolation due to high solar radiation.",
        resourceOptimization: "Decrease active pump rate by 15% (Target: 4.5mm/hr) to protect aquifer reserves.",
        costBenefit: { estimatedCost: 1200, projectedImpact: 8500 }
      },
      {
        task: "Symmetric Split Nitrogen (Urea) application",
        priority: "High",
        category: "Fertilizer",
        urgencyScore: 88,
        description: "Apply third split dose of prilled urea during early morning cool hours to prevent toxic ammonia volatilization.",
        resourceOptimization: "Precision banding: apply 22.5kg nitrogen/acre specifically around active root zones.",
        costBenefit: { estimatedCost: 3500, projectedImpact: 14000 }
      },
      {
        task: "Stem Borer preventive bio-pesticide misting",
        priority: "Medium",
        category: "Pest Control",
        urgencyScore: 74,
        description: "Monitor yellow stem borer moth count. Initiate neem seed kernel extract (NSKE 5%) prophylactic spraying.",
        resourceOptimization: "Calibrate drone spray pressure to 2.2 bar for fine droplet canopy adherence.",
        costBenefit: { estimatedCost: 2400, projectedImpact: 9500 }
      },
      {
        task: "Drip solenoid battery diagnostics",
        priority: "Low",
        category: "Maintenance",
        urgencyScore: 45,
        description: "Replace lithium backup cells in South sector solenoid valves to maintain constant RF telemetry.",
        resourceOptimization: "Proactive replacement prevents complete valve lockout in upcoming heat cycles.",
        costBenefit: { estimatedCost: 450, projectedImpact: 4500 }
      }
    ],
    predictiveAlerts: [
      { alert: "High calcium calcification detected in West-3 line nozzle nodes.", component: "Drip Emitters", severity: "Warning" },
      { alert: "Tractor hydraulic pressure dropping under high drafts.", component: "Primary Power Take-Off (PTO)", severity: "Warning" },
      { alert: "Pump #2 thermal heat sink threshold reached (78°C). Shutting down for cooling cycles.", component: "Deep Well Submersible Pump", severity: "Critical" }
    ],
    calendar: [
      { week: "Week 5-6 (Tillering Phase)", focus: "Root development & maximum tillers stabilization", actions: ["Maintain saturation-to-shallow flooding cycle", "Weed clearing using hand-hoes or selective post-emergence", "Monitor leaf color chart (LCC) index"] },
      { week: "Week 7-8 (Panicle Initiation)", focus: "Biomass density and healthy spikelets formation", actions: ["Apply phosphate top-dressing", "Maintain continuous 2cm shallow flooding", "Prophylactic leaf blast spray check"] },
      { week: "Week 9-10 (Flowering Phase)", focus: "Uniform anthesis & protective microclimate", actions: ["Avoid drainage; maintain constant water cushion", "Zero agrochemical sprays during direct pollen release", "Monitor wind velocity indices"] }
    ],
    schedule: {
      irrigation: "Initiate smart cycle at 05:00 AM. Stop at 09:30 AM before peak heat index. Re-evaluate moisture at 04:30 PM.",
      fertilizer: "Split dose band placement scheduled at 06:15 AM (Soil temperature: 24°C; minimal wind drift).",
      pestSpray: "Prophylactic drone misting window: 05:30 PM - 07:00 PM (Wind velocity < 5 km/h; protects pollinator populations).",
      harvestTiming: "Target panicle moisture of 20-22%. Expect harvest readiness around mid-October. Avoid late drainage to protect grain weight."
    },
    postHarvest: [
      "Field dry harvested sheaves for 24-48 hours to initiate primary physiological curing.",
      "Thresh and clean immediately; mechanically dry down to 14% moisture for standard storage.",
      "Utilize hermetic grain bags (e.g., GrainPro) to block oxygen ingress and prevent weevil reproduction.",
      "Store bag lots on raised wooden pallets with 30cm clearance from cold walls."
    ],
    marketTiming: {
      mandiSuggestions: "Andhra Pradesh Central Cooperative Mandi & National Digital Agri-Exchange (NCDEX) Rice Lot #R204.",
      pricePrediction: "Rice wholesale indexes are highly bullish. Hold grain assets for 45 days post-harvest to capture premium pricing (+18.5% margin)."
    },
    weatherAdaptiveSuggestions: "High humidity indices forecast for next 72 hours. Postpone non-essential irrigation. Focus immediately on prophylactic fungal sheath blight monitoring."
  },
  "Tomatoes": {
    dailyChecklist: [
      {
        task: "Drip fertilizer calcium nitrate injection",
        priority: "High",
        category: "Fertilizer",
        urgencyScore: 95,
        description: "Inject water-soluble Calcium Nitrate to prevent blossom end rot in developing fruit trusses.",
        resourceOptimization: "Target EC: 2.2 dS/m. Direct nutrient injection into active root microclimates.",
        costBenefit: { estimatedCost: 1800, projectedImpact: 12000 }
      },
      {
        task: "Trellis wire tensioning & leaf pruning",
        priority: "Medium",
        category: "Maintenance",
        urgencyScore: 78,
        description: "Prune lower senescent leaves up to the first healthy fruit cluster. Tighten high-tensile trellis support wires.",
        resourceOptimization: "Improves under-canopy ventilation, decreasing relative humidity from 85% to 68%.",
        costBenefit: { estimatedCost: 800, projectedImpact: 6500 }
      },
      {
        task: "Early Blight copper fungicide check",
        priority: "High",
        category: "Pest Control",
        urgencyScore: 89,
        description: "Humid weather trigger. Spray organic copper octanoate prophylactic spray to suppress early blight spores.",
        resourceOptimization: "Spray volume: 150 liters/acre. Nozzle type: hollow cone for complete leaf underside coverage.",
        costBenefit: { estimatedCost: 1500, projectedImpact: 11000 }
      }
    ],
    predictiveAlerts: [
      { alert: "Drip zone #4 pressure drops below 1.2 bar. Check for mainline tears.", component: "Solenoid Valves", severity: "Critical" },
      { alert: "Whitefly populations spotted in neighboring sector blocks.", component: "Yellow Sticky Trap Telemetry", severity: "Warning" }
    ],
    calendar: [
      { week: "Week 4-5 (Vegetative Growth)", focus: "Vigorous branching and early trellis adaptation", actions: ["Prune side suckers regularly", "Maintain consistent drip moisture to avoid soil stress", "Check for leaf miner lines"] },
      { week: "Week 6-7 (Flowering & Fruit Set)", focus: "Blossom health & high calcium intake", actions: ["Introduce bumblebee box or manually shake trellises", "Increase potassium-calcium ratio in fertigates", "Check leaf petioles for nitrogen status"] }
    ],
    schedule: {
      irrigation: "Run pulse irrigation 3 times daily (07:00 AM, 11:30 AM, 03:30 PM). 1.8 Liters per plant total.",
      fertilizer: "Fertigation injection during the middle 50% of the morning watering cycle to prevent nutrient leaching.",
      pestSpray: "Late afternoon spray (04:00 PM). Avoid midday sprays to prevent solar-chemical leaf burn.",
      harvestTiming: "Harvest at 'breaker stage' (pink blush at blossom end) for maximum shelf-life and high structural transit integrity."
    },
    postHarvest: [
      "Sort and classify tomatoes by size and ripeness color index immediately.",
      "Pre-cool harvested boxes in a shaded, ventilated packinghouse to 12°C. Never refrigerate below 10°C (causes chilling injury).",
      "Pack in ventilated reusable plastic crates with cushioning inserts.",
      "Store away from ethylene-emitting crops like bananas if delayed ripening is desired."
    ],
    marketTiming: {
      mandiSuggestions: "Regional APMC Tomato Hub & Direct-to-Consumer Quick Commerce B2B Nodes.",
      pricePrediction: "Prices fluctuating. Sell 60% of current yield immediately to minimize spoilage risk; store 40% in cool units for retail spikes."
    },
    weatherAdaptiveSuggestions: "Incoming storm alert. Secure trellis anchors. Double-check drain trenches to avoid standing root water logging."
  }
};

export default function AutomatedFarmAdvisory() {
  const [selectedCrop, setSelectedCrop] = useState<string>("Basmati Rice");
  const [selectedStage, setSelectedStage] = useState<string>("Vegetative Stage");
  const [selectedWeather, setSelectedWeather] = useState<string>("Sunny, 32°C, 65% humidity");
  const [soilMoisture, setSoilMoisture] = useState<number>(42);
  const [temperature, setTemperature] = useState<number>(28);
  const [location, setLocation] = useState<string>("Andhra Pradesh, India");

  const [loading, setLoading] = useState<boolean>(false);
  const [advisory, setAdvisory] = useState<AdvisoryData>(MOCK_ADVISORIES["Basmati Rice"]);
  const [apiActive, setApiActive] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Auto-recorded Activity Log State
  const [activityLogs, setActivityLogs] = useState<Array<{ id: string; timestamp: string; action: string; category: string; status: "success" | "pending" }>>([
    { id: "log-1", timestamp: "08:15 AM", action: "Co-Pilot initialized autonomous moisture check: 42% recorded.", category: "System", status: "success" },
    { id: "log-2", timestamp: "08:30 AM", action: "Solenoid valve check: Sector #3 reported normal telemetry.", category: "Irrigation", status: "success" }
  ]);

  // Tasks checked state (auto-recording)
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});
  // Executing state for specific items
  const [executingTask, setExecutingTask] = useState<string | null>(null);

  // On-demand AI translation of the generated advisory (calls /api/translate,
  // which is Gemini-powered - separate from the static UI-chrome dictionary)
  const [translateLanguage, setTranslateLanguage] = useState<SupportedLanguage>("Hindi");
  const [translatedAdvisory, setTranslatedAdvisory] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translateError, setTranslateError] = useState<string | null>(null);

  const handleTranslateAdvisory = async () => {
    setIsTranslating(true);
    setTranslateError(null);
    setTranslatedAdvisory(null);
    try {
      const summaryText = [
        advisory.weatherAdaptiveSuggestions,
        ...advisory.dailyChecklist.map((t) => `${t.task}: ${t.description}`),
        ...advisory.predictiveAlerts.map((a) => `${a.alert} (${a.component})`)
      ].join("\n");

      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: summaryText,
          targetLanguage: translateLanguage
        })
      });
      const data = await res.json();
      if (res.ok && data.translatedText) {
        setTranslatedAdvisory(data.translatedText);
      } else {
        setTranslateError("Translation unavailable right now. Please try again.");
      }
    } catch (e) {
      console.error("Advisory translation failed:", e);
      setTranslateError("Translation unavailable right now. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  // Fetch AI Advisor from our backend /api/farm-advisory
  const fetchAIAdvisory = async (crop: string, stage: string, weather: string, moisture: number, temp: number, loc: string) => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await fetch("/api/farm-advisory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropName: crop,
          stage: stage,
          weather: weather,
          soilMoisture: moisture,
          temperature: temp,
          location: loc
        })
      });

      if (!res.ok) {
        throw new Error("Failed to reach server-side Gemini API. Falling back to precision simulation mode.");
      }

      const data = await res.ok ? await res.json() : null;
      if (data && data.dailyChecklist) {
        setAdvisory(data);
        setApiActive(true);
        // Log AI Generation
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setActivityLogs(prev => [
          {
            id: `gen-${Date.now()}`,
            timestamp: timeStr,
            action: `⚡ Agentic AI successfully generated a customized weather-adaptive advisory for ${crop}.`,
            category: "Agent AI",
            status: "success"
          },
          ...prev
        ]);
      } else {
        throw new Error("Structured response format invalid. Falling back to local precision simulator.");
      }
    } catch (err: any) {
      console.warn("AI Farm Advisory API Fetch Error:", err);
      // Fallback to local high-fidelity simulator based on selected crop
      const fallback = MOCK_ADVISORIES[crop] || MOCK_ADVISORIES["Basmati Rice"];
      setAdvisory(fallback);
      setApiActive(false);
      setApiError(err.message || "Using precision simulator mode.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIAdvisory(selectedCrop, selectedStage, selectedWeather, soilMoisture, temperature, location);
  }, [selectedCrop, selectedStage, selectedWeather]);

  // Trigger manual API refresh
  const handleRefresh = () => {
    fetchAIAdvisory(selectedCrop, selectedStage, selectedWeather, soilMoisture, temperature, location);
  };

  // Trigger task execution simulation (e.g. spray drone, watering solenoid)
  const executeAutonomousTask = (taskName: string, category: string) => {
    setExecutingTask(taskName);
    const actionMsg = `[Autonomous Dispatch] Triggered agricultural ${category === "Irrigation" ? "valves" : category === "Pest Control" ? "autonomous hexacopter drones" : "smart actuators"} for task: "${taskName}"`;
    
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const pendingLogId = `act-${Date.now()}`;
    
    setActivityLogs(prev => [
      {
        id: pendingLogId,
        timestamp: timeStr,
        action: `${actionMsg} - Processing...`,
        category: category,
        status: "pending"
      },
      ...prev
    ]);

    setTimeout(() => {
      setExecutingTask(null);
      setActivityLogs(prev => 
        prev.map(log => 
          log.id === pendingLogId 
            ? { ...log, action: `✓ Completed: ${taskName}. IoT metrics logged.`, status: "success" } 
            : log
        )
      );
      alert(`Autonomous task successfully executed!\nAction logged: ${taskName}`);
    }, 2500);
  };

  // Toggle task checkbox (auto-recording)
  const toggleTaskCheckbox = (taskIndex: number, taskName: string, category: string) => {
    const isChecked = !checkedTasks[taskIndex];
    setCheckedTasks(prev => ({ ...prev, [taskIndex]: isChecked }));

    if (isChecked) {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setActivityLogs(prev => [
        {
          id: `check-${Date.now()}`,
          timestamp: timeStr,
          action: `📝 Manual checklist verify: Registered and auto-recorded task "${taskName}" to farm database.`,
          category: category,
          status: "success"
        },
        ...prev
      ]);
    }
  };

  return (
    <div id="automated-farm-advisory" className="space-y-6">
      
      {/* Upper Control Bar & Avatar */}
      <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          
          {/* Left: AI Avatar & Status */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="p-3.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl text-white shadow-md relative overflow-hidden">
                <Bot className="h-7 w-7 relative z-10 animate-bounce" />
                <div className="absolute inset-0 bg-white/10 rotate-12 transform origin-top-left"></div>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-1.5">
                  AgriConnect AI Co-Pilot <span className="text-[11px] font-black uppercase text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">Agentic AI</span>
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Autonomous decision agent monitoring telemetry, predicting maintenance, and optimizing resources.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Status: <span className="text-emerald-600 font-black">Active Monitoring</span>
                </span>
                <span className="text-slate-200">•</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  Model: <span className="text-slate-600 font-black">Gemini 3.5 Flash</span>
                </span>
                {apiActive && (
                  <>
                    <span className="text-slate-200">•</span>
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                      Live Cloud Sync Active
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Dynamic selectors and refresh */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Focus Crop</span>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="Basmati Rice">Basmati Rice (Rice Var. 1121)</option>
                <option value="Tomatoes">Tomatoes (Hybrid Roma)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Growth Phase</span>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="Vegetative Stage">Vegetative (Growth Phase)</option>
                <option value="Flowering Phase">Flowering (Anthesis)</option>
                <option value="Harvesting Stage">Harvesting & Maturity</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Live Weather</span>
              <select
                value={selectedWeather}
                onChange={(e) => setSelectedWeather(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="Sunny, 32°C, 65% humidity">Sunny & Warm (32°C, 65% RH)</option>
                <option value="Heavy Rain forecasting, 26°C">Monsoon/Storm (Heavy Rain Forecast)</option>
                <option value="Extreme Heat Index, 39°C">Severe Heatwaves (39°C, Low RH)</option>
                <option value="Heavy Wind, 28°C, wind 25km/h">High Winds (25 km/h gusts)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Translate To</span>
              <select
                value={translateLanguage}
                onChange={(e) => setTranslateLanguage(e.target.value as SupportedLanguage)}
                className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl px-3 py-2 focus:outline-none"
              >
                {Object.keys(LANGUAGES_INFO).map((langName) => (
                  <option key={langName} value={langName}>
                    {LANGUAGES_INFO[langName as SupportedLanguage].flag} {langName}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleRefresh}
              disabled={loading}
              className="mt-4 lg:mt-0 p-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Sync AI
            </button>

            <button
              onClick={handleTranslateAdvisory}
              disabled={isTranslating}
              className="mt-4 lg:mt-0 p-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-300 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Languages className={`h-4 w-4 ${isTranslating ? "animate-pulse" : ""}`} />
              {isTranslating ? "Translating..." : "Translate Advisory"}
            </button>
          </div>

        </div>

        {(translatedAdvisory || translateError) && (
          <div className="mt-5 pt-4 border-t border-slate-100">
            {translateError ? (
              <p className="text-xs text-rose-600 font-semibold">{translateError}</p>
            ) : (
              <div className="p-4 bg-cyan-50 border border-cyan-100 rounded-2xl space-y-2">
                <div className="flex items-center gap-1.5">
                  <Languages className="h-4 w-4 text-cyan-700" />
                  <h4 className="text-xs font-black text-cyan-900 uppercase tracking-wider">
                    Advisory in {translateLanguage}
                  </h4>
                </div>
                <p className="text-xs text-cyan-950 leading-relaxed whitespace-pre-line">
                  {translatedAdvisory}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Real-time telemetry feed strip */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Soil Moisture</span>
              <span className="text-sm font-black text-slate-800 font-mono">{soilMoisture}%</span>
            </div>
            <Droplet className="h-4 w-4 text-emerald-500" />
          </div>

          <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Soil Temperature</span>
              <span className="text-sm font-black text-slate-800 font-mono">{temperature}°C</span>
            </div>
            <Sun className="h-4 w-4 text-amber-500" />
          </div>

          <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Active Area</span>
              <span className="text-sm font-black text-slate-800 font-mono">{location}</span>
            </div>
            <Layers className="h-4 w-4 text-indigo-500" />
          </div>

          <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Weather Mode</span>
              <span className="text-sm font-black text-slate-800 font-mono text-ellipsis overflow-hidden whitespace-nowrap block max-w-[140px]">
                {selectedWeather.split(",")[0]}
              </span>
            </div>
            <CloudRain className="h-4 w-4 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Hand: Daily Action checklist (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Autonomous Decisions checklist */}
          <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                  <Cpu className="h-4.5 w-4.5 text-emerald-600" />
                  Autonomous Decision Engine & Daily Action Checklist
                </h4>
                <p className="text-[10px] text-slate-400 font-medium">
                  Dynamic actions generated in real-time. Execute directly to dispatch robotic actuators or log manually.
                </p>
              </div>
              <span className="text-[10px] font-bold bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded-lg">
                Adaptive AI Active
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center space-y-3">
                <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-bold">Consulting AgriConnect Co-Pilot decision nodes...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {advisory.dailyChecklist.map((task, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row justify-between gap-4 ${
                      checkedTasks[idx]
                        ? "bg-slate-50/50 border-slate-200 opacity-75"
                        : "bg-white border-slate-150 hover:border-slate-250 shadow-sm"
                    }`}
                  >
                    
                    {/* Checkbox and text info */}
                    <div className="flex items-start gap-3.5 flex-1">
                      <button
                        onClick={() => toggleTaskCheckbox(idx, task.task, task.category)}
                        className={`mt-1 h-5 w-5 rounded-md border flex items-center justify-center cursor-pointer transition-all ${
                          checkedTasks[idx]
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "border-slate-300 hover:border-indigo-500 bg-white"
                        }`}
                      >
                        {checkedTasks[idx] && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </button>

                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                            task.priority === "High"
                              ? "bg-rose-50 border-rose-100 text-rose-700"
                              : task.priority === "Medium"
                              ? "bg-amber-50 border-amber-100 text-amber-700"
                              : "bg-slate-50 border-slate-100 text-slate-700"
                          }`}>
                            {task.priority} Priority
                          </span>

                          <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                            {task.category}
                          </span>

                          <span className="text-[10px] font-bold text-slate-500">
                            Urgency: <span className="font-extrabold font-mono text-indigo-600">{task.urgencyScore}%</span>
                          </span>
                        </div>

                        <h5 className={`font-extrabold text-xs text-slate-800 ${checkedTasks[idx] ? "line-through text-slate-400" : ""}`}>
                          {task.task}
                        </h5>

                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {task.description}
                        </p>

                        {/* Resource optimization info */}
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex items-start gap-2">
                          <Leaf className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <div className="text-[10px] font-semibold text-slate-600">
                            <span className="text-slate-400 font-extrabold block uppercase tracking-wider text-[8px]">Resource Optimization Matrix</span>
                            {task.resourceOptimization}
                          </div>
                        </div>

                        {/* Cost Benefit Analysis */}
                        <div className="grid grid-cols-2 gap-4 pt-1">
                          <div className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                            <DollarSign className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                            Est. Budget Cost: <span className="font-extrabold font-mono text-slate-800">₹{task.costBenefit.estimatedCost}</span>
                          </div>
                          <div className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                            <TrendingUp className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            Projected Benefit: <span className="font-extrabold font-mono text-emerald-700">₹{task.costBenefit.projectedImpact}</span>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Action Execution Button */}
                    <div className="flex md:flex-col justify-end items-end gap-2 md:w-32 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                      <button
                        onClick={() => executeAutonomousTask(task.task, task.category)}
                        disabled={executingTask !== null || checkedTasks[idx]}
                        className={`w-full py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                          checkedTasks[idx]
                            ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow"
                        }`}
                      >
                        {executingTask === task.task ? (
                          <>
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            Processing
                          </>
                        ) : (
                          <>
                            <Play className="h-3 w-3" />
                            Execute IoT
                          </>
                        )}
                      </button>
                      <span className="text-[8px] text-slate-400 font-bold block text-center md:text-right">
                        Auto-saves to activity logs
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Personalized Farming Calendar */}
          <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-4">
            <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <Calendar className="h-4.5 w-4.5 text-indigo-600" />
              Personalized Farming Calendar ({selectedCrop})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {advisory.calendar.map((cal, index) => (
                <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wide">
                      {cal.week}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  </div>
                  
                  <div className="space-y-1">
                    <h5 className="font-extrabold text-xs text-slate-800">
                      Focus: {cal.focus}
                    </h5>
                  </div>

                  <div className="text-[10px] text-slate-500 space-y-1 pt-1.5 border-t border-slate-200 leading-relaxed font-semibold">
                    <span className="text-slate-400 font-extrabold block uppercase text-[8px]">Scheduled physical steps</span>
                    <ul className="list-disc pl-3.5 space-y-0.5">
                      {cal.actions.map((act, aIdx) => (
                        <li key={aIdx}>{act}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Post-Harvest Guidelines & Steps */}
          <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-4">
            <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <Layers className="h-4.5 w-4.5 text-amber-600" />
              Optimal Post-Harvest Handling & Preservation Guidelines
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {advisory.postHarvest.map((step, sIdx) => (
                <div key={sIdx} className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div className="p-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-xs font-black font-mono">
                    0{sIdx + 1}
                  </div>
                  <div className="space-y-1 text-[11px] font-semibold leading-relaxed">
                    <p className="text-slate-700">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Hand: Timeline Schedules, Maintenance Alerts & Activity Log (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Real-time Schedules */}
          <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-4">
            <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Clock className="h-4.5 w-4.5 text-indigo-600" />
              AI Precision Activity Schedules
            </h4>

            <div className="space-y-4">
              
              {/* Irrigation Schedule */}
              <div className="space-y-1.5 border-l-2 border-blue-500 pl-3">
                <span className="text-[9px] font-black uppercase text-blue-600 tracking-wider block">
                  💧 Automated Irrigation Schedule
                </span>
                <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">
                  {advisory.schedule.irrigation}
                </p>
              </div>

              {/* Fertilizer Schedule */}
              <div className="space-y-1.5 border-l-2 border-emerald-500 pl-3">
                <span className="text-[9px] font-black uppercase text-emerald-600 tracking-wider block">
                  🌱 Fertilizer Application Timing
                </span>
                <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">
                  {advisory.schedule.fertilizer}
                </p>
              </div>

              {/* Pest Spray Schedule */}
              <div className="space-y-1.5 border-l-2 border-rose-500 pl-3">
                <span className="text-[9px] font-black uppercase text-rose-600 tracking-wider block">
                  🐛 Pest Spray Scheduling
                </span>
                <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">
                  {advisory.schedule.pestSpray}
                </p>
              </div>

              {/* Harvest Schedule */}
              <div className="space-y-1.5 border-l-2 border-amber-500 pl-3">
                <span className="text-[9px] font-black uppercase text-amber-600 tracking-wider block">
                  🌾 Harvest Timing Optimization
                </span>
                <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">
                  {advisory.schedule.harvestTiming}
                </p>
              </div>

            </div>
          </div>

          {/* Predictive Maintenance Alerts */}
          <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-4">
            <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Wrench className="h-4.5 w-4.5 text-amber-600" />
              Predictive Maintenance & Health Alerts
            </h4>

            <div className="space-y-3">
              {advisory.predictiveAlerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-xl border flex items-start gap-2.5 text-[11px] font-semibold leading-relaxed ${
                    alert.severity === "Critical"
                      ? "bg-rose-50 border-rose-100 text-rose-800"
                      : alert.severity === "Warning"
                      ? "bg-amber-50 border-amber-100 text-amber-800"
                      : "bg-slate-50 border-slate-150 text-slate-700"
                  }`}
                >
                  <AlertTriangle className={`h-4.5 w-4.5 shrink-0 mt-0.5 ${
                    alert.severity === "Critical" ? "text-rose-600 animate-pulse" : "text-amber-600"
                  }`} />
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black uppercase tracking-wider block">
                      {alert.component} ({alert.severity})
                    </span>
                    <p>{alert.alert}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weather adaptive recommendations card */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-indigo-100 rounded-2xl p-5 shadow-md space-y-3.5 border border-indigo-950">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
              <Wind className="h-4 w-4 text-indigo-300" />
              Weather-Adaptive AI Dynamic Guard
            </h4>
            <p className="text-xs leading-relaxed font-semibold">
              {advisory.weatherAdaptiveSuggestions}
            </p>
            <div className="pt-2 border-t border-indigo-800 text-[10px] font-mono text-indigo-300">
              ⚡ Status: Adjusted for {selectedWeather.split(",")[0]}.
            </div>
          </div>

          {/* Market Timing Suggestions */}
          <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-4">
            <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <TrendingUp className="h-4.5 w-4.5 text-indigo-600" />
              Market Timing & Price Prediction
            </h4>

            <div className="space-y-3 text-[11px] font-semibold leading-relaxed text-slate-600">
              <div className="bg-indigo-50/50 border border-indigo-100 p-3 rounded-xl space-y-1">
                <span className="text-[9px] font-black uppercase text-indigo-700 tracking-wider block">Recommended Mandis & Exchanges</span>
                <p className="text-slate-800">{advisory.marketTiming.mandiSuggestions}</p>
              </div>

              <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl space-y-1">
                <span className="text-[9px] font-black uppercase text-emerald-700 tracking-wider block">Maturity / Arbitrage Prediction</span>
                <p className="text-slate-800">{advisory.marketTiming.pricePrediction}</p>
              </div>
            </div>
          </div>

          {/* Real-Time Live Farm Activity Log */}
          <div className="bg-slate-950 text-slate-300 rounded-2xl border border-slate-900 p-5 shadow-lg space-y-3.5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Database className="h-4 w-4 text-emerald-500 animate-pulse" />
                Live Farm Activity Log (Auto-Recorded)
              </h4>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            </div>

            <div className="max-h-56 overflow-y-auto space-y-2.5 pr-1 font-mono text-[10px]">
              {activityLogs.map((log) => (
                <div key={log.id} className="flex gap-2 items-start border-b border-slate-900 pb-2 last:border-0 last:pb-0">
                  <span className="text-slate-500 shrink-0">{log.timestamp}</span>
                  <div className="flex-1 space-y-0.5">
                    <span className={`text-[8px] font-black uppercase px-1 py-0.2 rounded-md ${
                      log.category === "Irrigation"
                        ? "bg-blue-950 text-blue-400"
                        : log.category === "Fertilizer"
                        ? "bg-emerald-950 text-emerald-400"
                        : log.category === "Pest Control"
                        ? "bg-rose-950 text-rose-400"
                        : "bg-slate-800 text-slate-400"
                    }`}>
                      {log.category}
                    </span>
                    <p className={`${log.status === "pending" ? "text-slate-400 italic" : "text-slate-200"}`}>
                      {log.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                setActivityLogs(prev => [
                  {
                    id: `manual-${Date.now()}`,
                    timestamp: timeStr,
                    action: "📝 Manual entry: Commenced mechanical land survey log.",
                    category: "Manual",
                    status: "success"
                  },
                  ...prev
                ]);
              }}
              className="w-full py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white transition-colors rounded-xl text-[9px] font-black uppercase tracking-wider cursor-pointer border border-slate-800"
            >
              Add Custom Log Entry
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
