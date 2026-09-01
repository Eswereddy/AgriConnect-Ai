import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Droplets,
  Sprout,
  Bug,
  Award,
  Plus,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Gauge,
  Sparkles,
  Info,
  Layers,
  ChevronRight,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot
} from "recharts";

// TypeScript Interfaces for Props
interface Sector {
  id: string;
  name: string;
  cropName: string;
  cropVariety: string;
  moisture: number;
  temp: number;
  valveStatus: "Open" | "Closed";
  healthStatus: "Optimal" | "Warning" | "Critical";
  area: number;
}

interface FarmLocation {
  id: string;
  name: string;
  role: string;
  location: string;
  totalAcreage: number;
  soilType: string;
  organicMatter: number;
  waterSource: string;
  irrigationType: string;
  healthScore: number;
  baselineTelemetry: {
    soilMoisture: number;
    soilPh: number;
    temperature: number;
    humidity: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  sectors: Sector[];
}

interface FarmActivity {
  id: string;
  type: string;
  description: string;
  date: string;
  cost: number;
  photo?: string;
}

interface FarmTask {
  id: string;
  farmId: string;
  title: string;
  category: string;
  priority: string;
  dueDate: string;
  isCompleted: boolean;
}

interface FarmHealthScoreTrackerProps {
  activeFarm: FarmLocation;
  activities: FarmActivity[];
  tasks: FarmTask[];
  onLogActivity: (activity: Omit<FarmActivity, "id">) => void;
  onCompleteTask: (taskId: string) => void;
}

export function FarmHealthScoreTracker({
  activeFarm,
  activities,
  tasks,
  onLogActivity,
  onCompleteTask
}: FarmHealthScoreTrackerProps) {
  // Simulator adjustments
  const [soilHealthOverride, setSoilHealthOverride] = useState<number | null>(null);
  const [cropHealthOverride, setCropHealthOverride] = useState<number | null>(null);
  const [waterEfficiencyOverride, setWaterEfficiencyOverride] = useState<number | null>(null);
  const [pestPressureOverride, setPestPressureOverride] = useState<number | null>(null);
  const [activityCompletenessOverride, setActivityCompletenessOverride] = useState<number | null>(null);

  // Custom simulation actions checklist
  const [hasPlantedCoverCrops, setHasPlantedCoverCrops] = useState(false);
  const [hasInstalledDripIrrigation, setHasInstalledDripIrrigation] = useState(
    activeFarm.irrigationType.toLowerCase().includes("drip")
  );
  const [hasAppliedBioagents, setHasAppliedBioagents] = useState(false);
  const [hasCompletedRotationalSowing, setHasCompletedRotationalSowing] = useState(false);

  // Calibration and settings view toggle
  const [showCalibrationPanel, setShowCalibrationPanel] = useState(false);

  // Dynamic weights
  const weights = {
    soil: 0.30,
    crop: 0.30,
    water: 0.20,
    pest: 0.10,
    activity: 0.10
  };

  // 1. Calculate Soil Health Score (Base: 75)
  const soilScore = useMemo(() => {
    if (soilHealthOverride !== null) return soilHealthOverride;
    
    let score = 75;
    // Boost from organic matter
    if (activeFarm.organicMatter > 3.0) score += 15;
    else if (activeFarm.organicMatter > 2.0) score += 8;
    else score -= 10;

    // Boost from pH suitability (6.0 - 7.0 is optimal)
    const ph = activeFarm.baselineTelemetry.soilPh;
    if (ph >= 6.0 && ph <= 7.0) score += 10;
    else if (ph >= 5.5 && ph <= 7.5) score += 5;
    else score -= 15;

    // Boost from manual interactive action: Cover Crops
    if (hasPlantedCoverCrops) score += 12;

    return Math.max(0, Math.min(100, score));
  }, [activeFarm, hasPlantedCoverCrops, soilHealthOverride]);

  // 2. Calculate Crop Health Score (Base: 80)
  const cropScore = useMemo(() => {
    if (cropHealthOverride !== null) return cropHealthOverride;

    let score = 80;
    const sectors = activeFarm.sectors || [];
    if (sectors.length > 0) {
      const optimalCount = sectors.filter(s => s.healthStatus === "Optimal").length;
      const criticalCount = sectors.filter(s => s.healthStatus === "Critical").length;
      const warningCount = sectors.filter(s => s.healthStatus === "Warning").length;

      const ratio = (optimalCount * 1.0 + warningCount * 0.5) / sectors.length;
      score = Math.round(ratio * 100);
      
      if (criticalCount > 0) {
        score -= (criticalCount * 12);
      }
    }

    if (hasCompletedRotationalSowing) score += 8;

    return Math.max(0, Math.min(100, score));
  }, [activeFarm, hasCompletedRotationalSowing, cropHealthOverride]);

  // 3. Calculate Water Efficiency Score (Base: 70)
  const waterScore = useMemo(() => {
    if (waterEfficiencyOverride !== null) return waterEfficiencyOverride;

    let score = 70;
    
    // Evaluate based on actual irrigation type listed on farm metadata
    const type = activeFarm.irrigationType.toLowerCase();
    if (type.includes("drip") || type.includes("precision")) {
      score += 15;
    } else if (type.includes("sprinkler")) {
      score += 8;
    } else {
      score -= 5;
    }

    // Evaluate based on soil moisture profile
    const sectors = activeFarm.sectors || [];
    if (sectors.length > 0) {
      const avgMoisture = sectors.reduce((sum, s) => sum + s.moisture, 0) / sectors.length;
      // Ideal moisture zone is 45% - 65%
      if (avgMoisture >= 45 && avgMoisture <= 65) {
        score += 10;
      } else if (avgMoisture < 30 || avgMoisture > 80) {
        score -= 15;
      }
    }

    if (hasInstalledDripIrrigation) {
      score = Math.max(score, 88) + 8; // Guarantee good water efficiency
    }

    return Math.max(0, Math.min(100, score));
  }, [activeFarm, hasInstalledDripIrrigation, waterEfficiencyOverride]);

  // 4. Calculate Pest Pressure Score (100 means NO pest pressure / safe, 0 means maximum infestation)
  const pestScore = useMemo(() => {
    if (pestPressureOverride !== null) return pestPressureOverride;

    let score = 90; // Default: healthy & clean

    const criticalSectors = activeFarm.sectors?.filter(s => s.healthStatus === "Critical") || [];
    if (criticalSectors.length > 0) {
      score -= (criticalSectors.length * 15);
    }

    // If there was a recent disease activity logged
    const diseaseActivities = activities.filter(a => 
      a.description.toLowerCase().includes("blight") || 
      a.description.toLowerCase().includes("pest") || 
      a.description.toLowerCase().includes("infestation")
    );
    if (diseaseActivities.length > 0) {
      score -= 20;
    }

    if (hasAppliedBioagents) score += 15;

    return Math.max(0, Math.min(100, score));
  }, [activeFarm, activities, hasAppliedBioagents, pestPressureOverride]);

  // 5. Calculate Recent Activities Score (Base: 60)
  const activityScore = useMemo(() => {
    if (activityCompletenessOverride !== null) return activityCompletenessOverride;

    let score = 60;
    
    // Evaluate completed chores
    const farmTasks = tasks.filter(t => t.farmId === activeFarm.id);
    if (farmTasks.length > 0) {
      const completedCount = farmTasks.filter(t => t.isCompleted).length;
      const ratio = completedCount / farmTasks.length;
      score += Math.round(ratio * 30);
    } else {
      score += 15; // default buffer if clear
    }

    // Evaluate recent activity density
    const last3Days = activities.length;
    score += Math.min(last3Days * 5, 10);

    return Math.max(0, Math.min(100, score));
  }, [activeFarm, tasks, activities, activityCompletenessOverride]);

  // Overall Combined Score
  const overallScore = useMemo(() => {
    const calculated = 
      (soilScore * weights.soil) +
      (cropScore * weights.crop) +
      (waterScore * weights.water) +
      (pestScore * weights.pest) +
      (activityScore * weights.activity);
    
    return Math.round(calculated);
  }, [soilScore, cropScore, waterScore, pestScore, activityScore]);

  // Status mapping
  const statusInfo = useMemo(() => {
    if (overallScore >= 85) {
      return {
        label: "Excellent",
        colorClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
        ringColor: "stroke-emerald-600",
        badgeColor: "bg-emerald-600",
        description: "Optimal vegetative vigor, balanced soil chemistry, and extreme precision resources management."
      };
    } else if (overallScore >= 70) {
      return {
        label: "Good",
        colorClass: "bg-amber-50 text-amber-800 border-amber-200",
        ringColor: "stroke-amber-500",
        badgeColor: "bg-amber-500",
        description: "Healthy holding conditions. Slight room for improvement in soil microbiology or water drainage."
      };
    } else if (overallScore >= 50) {
      return {
        label: "Needs Attention",
        colorClass: "bg-orange-50 text-orange-800 border-orange-200",
        ringColor: "stroke-orange-500",
        badgeColor: "bg-orange-500",
        description: "Mild nutrient deficiency, inconsistent moisture rates, or unaddressed scheduled crop chores."
      };
    } else {
      return {
        label: "Critical",
        colorClass: "bg-rose-50 text-rose-800 border-rose-200 animate-pulse",
        ringColor: "stroke-rose-600",
        badgeColor: "bg-rose-600",
        description: "Severe crop stress detected. Low water levels, high pathogen threats, and depleted soil nutrients."
      };
    }
  }, [overallScore]);

  // Dynamic recommendations based on score factors
  const recommendations = useMemo(() => {
    const list = [];

    if (soilScore < 85 && !hasPlantedCoverCrops) {
      list.push({
        id: "rec-soil-1",
        category: "Soil Health",
        impact: "+12 Score Increase Potential",
        text: "Plant cover crops (such as clover, alfalfa, or rye) to naturally raise organic carbon and improve soil organic matter.",
        actionLabel: "Sow Alfalfa Cover Crops",
        cost: 350,
        execute: () => {
          setHasPlantedCoverCrops(true);
          onLogActivity({
            type: "Custom",
            description: "Sowed Alfalfa green manure cover crop across buffer sectors to remediate organic carbon index.",
            date: new Date().toISOString().split("T")[0],
            cost: 350
          });
        }
      });
    }

    if (waterScore < 85 && !hasInstalledDripIrrigation) {
      list.push({
        id: "rec-water-1",
        category: "Water Efficiency",
        impact: "+15 Score Increase Potential",
        text: "Install micro-drip precision irrigation lines to reduce moisture evaporation and secure consistent subsoil water allocation.",
        actionLabel: "Upgrade to Precision Drip",
        cost: 1200,
        execute: () => {
          setHasInstalledDripIrrigation(true);
          onLogActivity({
            type: "Irrigation Done",
            description: "Installed smart sub-canopy drip lines and automated solenoids to elevate water efficiency.",
            date: new Date().toISOString().split("T")[0],
            cost: 1200
          });
        }
      });
    }

    if (pestScore < 85 && !hasAppliedBioagents) {
      list.push({
        id: "rec-pest-1",
        category: "Pest & Pathology",
        impact: "+15 Score Increase Potential",
        text: "Incorporate organic bio-agents (Trichoderma viride or Bacillus thuringiensis) to establish localized biological soil defense.",
        actionLabel: "Dispense Bio-agents",
        cost: 220,
        execute: () => {
          setHasAppliedBioagents(true);
          onLogActivity({
            type: "Pesticide Sprayed",
            description: "Dispensed organic Trichoderma microbial bio-agent protectants to suppress pathogenic root spores.",
            date: new Date().toISOString().split("T")[0],
            cost: 220
          });
        }
      });
    }

    if (cropScore < 88 && !hasCompletedRotationalSowing) {
      list.push({
        id: "rec-crop-1",
        category: "Crop Health",
        impact: "+8 Score Increase Potential",
        text: "Initiate strict crop rotation schedules (alternating cereals with legumes) to disrupt pathogen lifecycles.",
        actionLabel: "Schedule Legume Rotation",
        cost: 180,
        execute: () => {
          setHasCompletedRotationalSowing(true);
          onLogActivity({
            type: "Crop Planted",
            description: "Scheduled subsequent Chickpea rotation sequence to balance soil Rhizobium nitrogen fixing.",
            date: new Date().toISOString().split("T")[0],
            cost: 180
          });
        }
      });
    }

    // Generic fallback recommendation if all is good
    if (list.length === 0) {
      list.push({
        id: "rec-perfect",
        category: "System Maintenance",
        impact: "Optimal Level Sustenance",
        text: "Your Farm Health Score is in an extraordinary tier. Review physical drone soil temperature heat maps weekly to verify status.",
        actionLabel: "Calibrate IoT Sensors",
        cost: 0,
        execute: () => {
          onLogActivity({
            type: "Custom",
            description: "Calibrated on-field wireless IoT soil moisture probes and telemetry relays.",
            date: new Date().toISOString().split("T")[0],
            cost: 0
          });
        }
      });
    }

    return list;
  }, [soilScore, cropScore, waterScore, pestScore, hasPlantedCoverCrops, hasInstalledDripIrrigation, hasAppliedBioagents, hasCompletedRotationalSowing, onLogActivity]);

  // 30-Day Trend Chart Generator
  const chartData = useMemo(() => {
    const data = [];
    const baseline = activeFarm.healthScore;
    const dateToday = new Date();

    // Generate 30 days of data ending today
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(dateToday.getDate() - i);
      const dayLabel = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      
      // Introduce calculated variations and events
      let dailyScore = baseline;
      let milestone: string | null = null;
      let actionImpact: number = 0;

      if (i === 25) {
        dailyScore -= 8;
        milestone = "Severe Dry Spell (Moisture Dropped)";
        actionImpact = -8;
      } else if (i === 20) {
        dailyScore += 6;
        milestone = "Activated Canal Solenoid Valves (+6)";
        actionImpact = 6;
      } else if (i === 15) {
        dailyScore -= 5;
        milestone = "Tomato Early Blight detected (-5)";
        actionImpact = -5;
      } else if (i === 12) {
        dailyScore += 7;
        milestone = "Bio-fungicide Treatment Administered (+7)";
        actionImpact = 7;
      } else if (i === 5) {
        dailyScore += 4;
        milestone = "Logged Balanced NPK Soil Test (+4)";
        actionImpact = 4;
      } else if (i === 0) {
        // Match today's dynamically calculated score
        dailyScore = overallScore;
      } else {
        // Progressive transition curves between milestones
        if (i > 25) {
          dailyScore = baseline;
        } else if (i > 20) {
          dailyScore = baseline - 8 + Math.round(((25 - i) / 5) * 6);
        } else if (i > 15) {
          dailyScore = baseline - 2 - Math.round(((20 - i) / 5) * 3);
        } else if (i > 12) {
          dailyScore = baseline - 5 + Math.round(((15 - i) / 3) * 7);
        } else if (i > 5) {
          dailyScore = baseline + 2 + Math.round(((12 - i) / 7) * 2);
        } else {
          // Approach current overall calculated score
          dailyScore = baseline + 4 + Math.round(((5 - i) / 5) * (overallScore - (baseline + 4)));
        }
      }

      // bound score between 0 and 100
      dailyScore = Math.max(0, Math.min(100, dailyScore));

      data.push({
        dayIndex: 30 - i,
        date: dayLabel,
        score: dailyScore,
        milestone,
        impact: actionImpact
      });
    }

    return data;
  }, [activeFarm.healthScore, overallScore]);

  // Find the exact dot coordinates for milestones
  const milestoneDots = useMemo(() => {
    return chartData.filter(d => d.milestone !== null);
  }, [chartData]);

  // Reset simulation to baseline
  const handleResetSimulation = () => {
    setSoilHealthOverride(null);
    setCropHealthOverride(null);
    setWaterEfficiencyOverride(null);
    setPestPressureOverride(null);
    setActivityCompletenessOverride(null);
    setHasPlantedCoverCrops(false);
    setHasInstalledDripIrrigation(activeFarm.irrigationType.toLowerCase().includes("drip"));
    setHasAppliedBioagents(false);
    setHasCompletedRotationalSowing(false);
  };

  return (
    <div id="farm-health-tracker" className="space-y-6 animate-in fade-in duration-300">
      
      {/* Introduction Banner card */}
      <div className="bg-white rounded-2xl border border-slate-200/85 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div>
            <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Award className="h-4.5 w-4.5 text-emerald-600" />
              Farmer's Fitness Tracker & Analytics Suite
            </h3>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Comprehensive real-time algorithmic crop health scoring, historical telemetry modeling, and actionable recommendations.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowCalibrationPanel(!showCalibrationPanel)}
              className="text-[10px] bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-lg border border-slate-200 transition-all flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`h-3 w-3 ${showCalibrationPanel ? "animate-spin" : ""}`} />
              {showCalibrationPanel ? "Hide Simulator Panel" : "Open Simulator & Calibration"}
            </button>
            <button
              onClick={handleResetSimulation}
              className="text-[10px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-lg border border-emerald-200/50 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="h-3 w-3" />
              Reset Tracker Baseline
            </button>
          </div>
        </div>

        {/* Interactive Calibration Panel */}
        {showCalibrationPanel && (
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/50 mb-5 text-xs text-slate-600 grid grid-cols-1 md:grid-cols-5 gap-4 animate-in slide-in-from-top-2 duration-300">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-slate-400">Soil Health Override</label>
              <input
                type="range"
                min="0"
                max="100"
                value={soilHealthOverride ?? soilScore}
                onChange={(e) => setSoilHealthOverride(parseInt(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                <span>Calc: {soilScore}</span>
                <span className="text-emerald-700">Override: {soilHealthOverride ?? "None"}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-slate-400">Crop Vigor Override</label>
              <input
                type="range"
                min="0"
                max="100"
                value={cropHealthOverride ?? cropScore}
                onChange={(e) => setCropHealthOverride(parseInt(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                <span>Calc: {cropScore}</span>
                <span className="text-emerald-700">Override: {cropHealthOverride ?? "None"}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-slate-400">Water Efficiency Override</label>
              <input
                type="range"
                min="0"
                max="100"
                value={waterEfficiencyOverride ?? waterScore}
                onChange={(e) => setWaterEfficiencyOverride(parseInt(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                <span>Calc: {waterScore}</span>
                <span className="text-emerald-700">Override: {waterEfficiencyOverride ?? "None"}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-slate-400">Pest Pressure Override</label>
              <input
                type="range"
                min="0"
                max="100"
                value={pestPressureOverride ?? pestScore}
                onChange={(e) => setPestPressureOverride(parseInt(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                <span>Calc: {pestScore}</span>
                <span className="text-emerald-700">Override: {pestPressureOverride ?? "None"}</span>
              </div>
            </div>

            <div className="space-y-1 flex flex-col justify-between">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400">Calibration Tools</label>
                <p className="text-[9px] text-slate-400 mt-0.5 leading-snug">Drag inputs to simulate crisis conditions or verify algorithm stress resistance.</p>
              </div>
              <button
                onClick={() => {
                  setSoilHealthOverride(null);
                  setCropHealthOverride(null);
                  setWaterEfficiencyOverride(null);
                  setPestPressureOverride(null);
                  setActivityCompletenessOverride(null);
                }}
                className="text-[9px] bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-2 py-1 rounded border border-slate-300 block w-full text-center"
              >
                Clear Overrides
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Visual Core - Gauge (Left 4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center bg-slate-50 border border-slate-200/50 p-5 rounded-2xl relative overflow-hidden">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider absolute top-4 left-4">Holding Status Profile</span>
            
            {/* Health Rings Circle */}
            <div className="relative flex items-center justify-center my-6">
              <svg className="w-40 h-40" viewBox="0 0 100 100">
                {/* Background tracks */}
                <circle cx="50" cy="50" r="42" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                <circle cx="50" cy="50" r="33" stroke="#f1f5f9" strokeWidth="4" fill="transparent" />
                <circle cx="50" cy="50" r="26" stroke="#f1f5f9" strokeWidth="4" fill="transparent" />
                
                {/* Main Fitness track (Soil + Crop + Water combo) */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className={`transition-all duration-700 ${statusInfo.ringColor}`}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * overallScore) / 100}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                
                {/* Secondary inner ring: Soil health subset */}
                <circle
                  cx="50"
                  cy="50"
                  r="33"
                  stroke="#34d399"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray="207"
                  strokeDashoffset={207 - (207 * soilScore) / 100}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  opacity="0.6"
                />

                {/* Third inner ring: Crop vigor subset */}
                <circle
                  cx="50"
                  cy="50"
                  r="26"
                  stroke="#60a5fa"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray="163"
                  strokeDashoffset={163 - (163 * cropScore) / 100}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  opacity="0.6"
                />
              </svg>
              
              <div className="absolute text-center">
                <span className="text-4xl font-black text-slate-800 tracking-tight">{overallScore}</span>
                <span className="text-xs text-slate-400 font-bold block mt-0.5">Fitness Rating</span>
              </div>
            </div>

            {/* Overall status description block */}
            <div className="w-full text-center space-y-2 mt-2">
              <div className="inline-flex items-center gap-1">
                <span className={`w-2.5 h-2.5 rounded-full ${statusInfo.badgeColor} animate-pulse`} />
                <span className="text-xs font-black uppercase text-slate-700 tracking-wider">Status: {statusInfo.label}</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed max-w-[220px] mx-auto">
                {statusInfo.description}
              </p>
            </div>
          </div>

          {/* Interactive Weight breakdown bars (Right 8 cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Agricultural Score Composition (Weighted Index)</h4>
              <p className="text-[10px] text-slate-400 leading-snug">The Farm Fitness Tracker calculates holding safety by continuously evaluating biochemical telemetry against plant pathologists.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Soil Health Factor */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/40 relative overflow-hidden">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase mb-1">
                  <span className="flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-emerald-600" />
                    Soil Organic Index (30%)
                  </span>
                  <span className="text-slate-800 font-black">{soilScore} / 100</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${soilScore}%` }} />
                </div>
                <span className="text-[9px] text-slate-400 font-semibold mt-1.5 block">
                  {soilScore >= 85 ? "✓ Excellent Organic Content" : "▲ Deficiency warning: Carbon low"}
                </span>
              </div>

              {/* Crop Vigor Factor */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/40 relative overflow-hidden">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase mb-1">
                  <span className="flex items-center gap-1.5">
                    <Sprout className="h-3.5 w-3.5 text-blue-500" />
                    Crop Vigor Profile (30%)
                  </span>
                  <span className="text-slate-800 font-black">{cropScore} / 100</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${cropScore}%` }} />
                </div>
                <span className="text-[9px] text-slate-400 font-semibold mt-1.5 block">
                  {cropScore >= 80 ? "✓ Stabile vegetative maturation" : "▲ Low photosynthesis efficiency"}
                </span>
              </div>

              {/* Water Efficiency Factor */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/40 relative overflow-hidden">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase mb-1">
                  <span className="flex items-center gap-1.5">
                    <Droplets className="h-3.5 w-3.5 text-cyan-500" />
                    Irrigation Efficiency (20%)
                  </span>
                  <span className="text-slate-800 font-black">{waterScore} / 100</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full transition-all duration-500" style={{ width: `${waterScore}%` }} />
                </div>
                <span className="text-[9px] text-slate-400 font-semibold mt-1.5 block">
                  {waterScore >= 85 ? "✓ High drip subsoil conservation" : "▲ Loss of water via topsoil evaporation"}
                </span>
              </div>

              {/* Pest Protection Factor */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/40 relative overflow-hidden">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase mb-1">
                  <span className="flex items-center gap-1.5">
                    <Bug className="h-3.5 w-3.5 text-amber-500" />
                    Pathogen Protection (10%)
                  </span>
                  <span className="text-slate-800 font-black">{pestScore} / 100</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${pestScore}%` }} />
                </div>
                <span className="text-[9px] text-slate-400 font-semibold mt-1.5 block">
                  {pestScore >= 85 ? "✓ Low insect pressure" : "▲ Micro-infestation identified"}
                </span>
              </div>

              {/* Activities and Chore Completeness */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/40 sm:col-span-2 relative overflow-hidden">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase mb-1">
                  <span className="flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-indigo-500" />
                    Chore Compliance Index (10%)
                  </span>
                  <span className="text-slate-800 font-black">{activityScore} / 100</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${activityScore}%` }} />
                </div>
                <span className="text-[9px] text-slate-400 font-semibold mt-1.5 block">
                  {activityScore >= 75 ? "✓ Tasks completed in timely matrix" : "▲ Calendar clutter detected: Chores pending"}
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* 30-Day Trend Chart & Milestone Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recharts Area Chart */}
        <div className="lg:col-span-8 bg-white border border-slate-200/85 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h4 className="text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-emerald-600" />
              Dynamic 30-Day Fitness Evaluation
            </h4>
            <p className="text-slate-400 text-[10px] mt-0.5">Visualize chronologically how specific farming operations or atmospheric fluctuations impact aggregate score stability.</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis domain={[40, 100]} stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-800 text-white p-3.5 rounded-xl text-xs space-y-1.5 shadow-md max-w-[200px] border border-slate-700 font-sans">
                          <p className="font-extrabold text-[10px] uppercase text-slate-400">{data.date}</p>
                          <p className="text-base font-black flex items-center gap-1">
                            <Gauge className="h-4 w-4 text-emerald-400" />
                            Score: <span className="text-white">{data.score}</span>
                          </p>
                          {data.milestone && (
                            <div className="border-t border-slate-700 pt-1.5 mt-1.5 space-y-1">
                              <span className="text-[9px] bg-emerald-950 text-emerald-300 font-extrabold px-1.5 py-0.5 rounded uppercase inline-block">
                                Event logged
                              </span>
                              <p className="text-[10px] text-slate-300 leading-snug">{data.milestone}</p>
                              <span className={`text-[10px] font-black flex items-center gap-0.5 ${data.impact > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                                {data.impact > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                {data.impact > 0 ? `+${data.impact}` : data.impact} points
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorScore)" />
                
                {/* Milestone Reference Dots */}
                {milestoneDots.map((dot, idx) => (
                  <ReferenceDot
                    key={idx}
                    x={dot.date}
                    y={dot.score}
                    r={dot.impact > 0 ? 5 : 6}
                    fill={dot.impact > 0 ? "#10b981" : "#ef4444"}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex gap-4 mt-2 text-[10px] font-semibold text-slate-400 uppercase border-t border-slate-100 pt-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
              Positive Operations
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-white shadow-xs" />
              Crisis/Stressor Alerts
            </span>
          </div>
        </div>

        {/* Actionable Recommendations Feed */}
        <div className="lg:col-span-4 bg-white border border-slate-200/85 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 pb-3 mb-4 flex justify-between items-center">
              <div>
                <h4 className="text-slate-800 font-bold text-xs uppercase tracking-wider">Dynamic Crop Recommendations</h4>
                <p className="text-slate-400 text-[10px] mt-0.5">Automated actionable items based on score leaks.</p>
              </div>
              <span className="text-[10px] font-mono bg-amber-50 border border-amber-200 text-amber-800 px-2 py-0.5 rounded font-black">
                {recommendations.length} Pending
              </span>
            </div>

            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
              {recommendations.map((rec) => (
                <div key={rec.id} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2 text-xs hover:border-slate-300 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded uppercase font-extrabold font-mono">
                      {rec.category}
                    </span>
                    <span className="text-[9px] font-extrabold text-emerald-700 uppercase flex items-center gap-0.5">
                      <Sparkles className="h-3 w-3" />
                      {rec.impact}
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed text-[11px]">{rec.text}</p>
                  
                  <button
                    onClick={rec.execute}
                    className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-[10px] rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                    {rec.actionLabel} (₹{rec.cost})
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 bg-emerald-50/40 p-3 rounded-lg text-[10px] text-emerald-900 leading-relaxed font-semibold">
            <div className="flex gap-1 items-start text-emerald-800 font-bold">
              <Info className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>Implementing the suggested operations automatically logs to activities and permanently increments score factors.</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
