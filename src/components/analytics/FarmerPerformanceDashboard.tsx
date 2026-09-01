import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Sprout,
  Activity,
  Droplet,
  Zap,
  Leaf,
  Calendar,
  Layers,
  ArrowUpRight,
  Info,
  Sparkles,
  Sliders,
  Maximize2,
  Minimize2,
  HelpCircle,
  Award,
  ChevronRight,
  RefreshCw,
  SlidersHorizontal,
  Gauge,
  Heart,
  PieChart as PieIcon,
  Coins
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { FarmHealthScoreTracker } from "./FarmHealthScoreTracker";

// Interfaces for Props
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

interface FarmerPerformanceDashboardProps {
  activeFarm?: FarmLocation;
  activities?: FarmActivity[];
  tasks?: FarmTask[];
  onLogActivity?: (activity: Omit<FarmActivity, "id">) => void;
  onCompleteTask?: (taskId: string) => void;
}

// Fallback Mock Data in case props are absent
const FALLBACK_FARM: FarmLocation = {
  id: "farm-punjab-1",
  name: "Punjab Sovereign Wheat Core",
  role: "Lead Cultivator",
  location: "Jalandhar Bypass, Punjab",
  totalAcreage: 12.4,
  soilType: "Clay Loam",
  organicMatter: 2.8,
  waterSource: "Sutlej River Canal",
  irrigationType: "Sprinkler Irrigation System",
  healthScore: 78,
  baselineTelemetry: {
    soilMoisture: 48,
    soilPh: 6.2,
    temperature: 24.5,
    humidity: 55,
    nitrogen: 45,
    phosphorus: 32,
    potassium: 190
  },
  sectors: [
    { id: "s-1", name: "Sector Alpha", cropName: "Wheat", cropVariety: "Kalyansona", moisture: 52, temp: 24.1, valveStatus: "Closed", healthStatus: "Optimal", area: 4.2 },
    { id: "s-2", name: "Sector Beta", cropName: "Wheat", cropVariety: "Sonalika", moisture: 46, temp: 24.8, valveStatus: "Open", healthStatus: "Warning", area: 4.2 },
    { id: "s-3", name: "Sector Gamma", cropName: "Mustard", cropVariety: "Pusa Bold", moisture: 31, temp: 25.4, valveStatus: "Closed", healthStatus: "Critical", area: 4.0 }
  ]
};

const FALLBACK_ACTIVITIES: FarmActivity[] = [
  { id: "act-1", type: "Fertilizer Added", description: "Applied balanced urea and vermicompost blend to Sector Alpha.", date: "2026-06-25", cost: 450 },
  { id: "act-2", type: "Pesticide Sprayed", description: "Administered eco-friendly neem extract against whiteflies in Sector Beta.", date: "2026-06-28", cost: 210 }
];

const FALLBACK_TASKS: FarmTask[] = [
  { id: "task-1", farmId: "farm-punjab-1", title: "Apply nitrogen fertilizer", category: "Nutrients", priority: "High", dueDate: "2026-07-02", isCompleted: true },
  { id: "task-2", farmId: "farm-punjab-1", title: "Weed Sector Gamma edge", category: "Weeding", priority: "Medium", dueDate: "2026-07-04", isCompleted: false },
  { id: "task-3", farmId: "farm-punjab-1", title: "Clear primary canal mesh filter", category: "Irrigation", priority: "Low", dueDate: "2026-07-06", isCompleted: false }
];

const YoY_PROFIT_DATA = [
  { year: "2023", "Gross Revenue": 125000, "Net Profit": 48000, "Operational Cost": 77000 },
  { year: "2024", "Gross Revenue": 148000, "Net Profit": 59000, "Operational Cost": 89000 },
  { year: "2025", "Gross Revenue": 182000, "Net Profit": 78000, "Operational Cost": 104000 },
  { year: "2026 (Est.)", "Gross Revenue": 210000, "Net Profit": 94000, "Operational Cost": 116000 }
];

const SEASONAL_YIELD_DATA = [
  { crop: "Basmati Rice", "Kharif 2024 (Actual)": 8.2, "Kharif 2025 (Actual)": 9.4, "Co-op Average": 7.8, unit: "T/Ha" },
  { crop: "Durum Wheat", "Rabi 2024-25 (Actual)": 9.1, "Rabi 2025-26 (Actual)": 10.2, "Co-op Average": 8.5, unit: "T/Ha" },
  { crop: "Mustard", "Rabi 2024-25 (Actual)": 1.6, "Rabi 2025-26 (Actual)": 1.9, "Co-op Average": 1.5, unit: "T/Ha" },
  { crop: "Maize", "Kharif 2024 (Actual)": 6.8, "Kharif 2025 (Actual)": 7.5, "Co-op Average": 6.4, unit: "T/Ha" },
  { crop: "Soybean", "Kharif 2024 (Actual)": 2.1, "Kharif 2025 (Actual)": 2.4, "Co-op Average": 2.0, unit: "T/Ha" }
];

interface CropProfitData {
  crop: string;
  revenue: number;
  expenses: number;
  profit: number;
}

const CROP_PROFITABILITY_DATA: CropProfitData[] = [
  { crop: "Paddy (Basmati)", revenue: 320000, expenses: 140000, profit: 180000 },
  { crop: "Durum Wheat", revenue: 280000, expenses: 110000, profit: 170000 },
  { crop: "Mustard Seeds", revenue: 150000, expenses: 60000, profit: 90000 },
  { crop: "Bt Cotton", revenue: 240000, expenses: 115000, profit: 125000 },
  { crop: "Sugarcane", revenue: 410000, expenses: 190000, profit: 220000 },
];

interface YieldTrendFiveYears {
  year: string;
  "Basmati Rice": number;
  "Durum Wheat": number;
  "Mustard": number;
  "Bt Cotton": number;
}

const YIELD_TRENDS_FIVE_YEARS: YieldTrendFiveYears[] = [
  { year: "2022", "Basmati Rice": 7.2, "Durum Wheat": 8.0, "Mustard": 1.4, "Bt Cotton": 1.8 },
  { year: "2023", "Basmati Rice": 7.5, "Durum Wheat": 8.3, "Mustard": 1.5, "Bt Cotton": 1.9 },
  { year: "2024", "Basmati Rice": 8.2, "Durum Wheat": 9.1, "Mustard": 1.6, "Bt Cotton": 2.1 },
  { year: "2025", "Basmati Rice": 9.4, "Durum Wheat": 10.2, "Mustard": 1.9, "Bt Cotton": 2.3 },
  { year: "2026", "Basmati Rice": 9.8, "Durum Wheat": 10.5, "Mustard": 2.0, "Bt Cotton": 2.4 },
];

interface ExpenseBreakdownItem {
  name: string;
  value: number;
  color: string;
}

const EXPENSE_BREAKDOWN_DATA: ExpenseBreakdownItem[] = [
  { name: "Seeds", value: 35000, color: "#6366f1" },       // Indigo
  { name: "Fertilizers", value: 70000, color: "#10b981" }, // Emerald
  { name: "Pesticides", value: 52500, color: "#f59e0b" },  // Amber
  { name: "Labor", value: 105000, color: "#ec4899" },      // Pink
  { name: "Equipment", value: 52500, color: "#06b6d4" },  // Cyan
  { name: "Transport", value: 35000, color: "#a855f7" },  // Purple
];

interface MonthlyFinances {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

const MONTHLY_FINANCES_DATA: MonthlyFinances[] = [
  { month: "Jan", revenue: 145000, expenses: 85000, profit: 60000 },
  { month: "Feb", revenue: 160000, expenses: 95000, profit: 65000 },
  { month: "Mar", revenue: 210000, expenses: 110000, profit: 100000 },
  { month: "Apr", revenue: 95000, expenses: 115000, profit: -20000 },
  { month: "May", revenue: 250000, expenses: 120000, profit: 130000 },
  { month: "Jun", revenue: 320000, expenses: 140000, profit: 180000 },
];

export default function FarmerPerformanceDashboard({
  activeFarm = FALLBACK_FARM,
  activities = FALLBACK_ACTIVITIES,
  tasks = FALLBACK_TASKS,
  onLogActivity = () => {},
  onCompleteTask = () => {}
}: FarmerPerformanceDashboardProps) {
  // Mode selection: Fitness tracker vs Historical charts vs AI recommendations
  const [viewMode, setViewMode] = useState<"fitness" | "historical" | "recommendations">("fitness");

  interface AIRecommendation {
    id: string;
    action: string;
    details: string;
    category: string;
    impact: string;
    status: "pending" | "completed";
    completedAt?: string;
    impactMetric?: string;
  }

  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([
    {
      id: "rec-1",
      action: "Apply fertilizer to wheat field",
      details: "Real-time crop sensors in Durum Wheat parcels indicate 12% nitrogen depletion. Dynamic top-dressing with organic NPK is required immediately to secure the target 4.2 T/Ac yield index.",
      category: "Soil & Nutrients",
      impact: "Yield increased by 15%",
      status: "pending"
    },
    {
      id: "rec-2",
      action: "Harvest rice in 3 days",
      details: "Regional weather patterns show localized high humidity and cloud cover starting Thursday afternoon. Harvesting now prevents mold damage and preserves peak milling quality.",
      category: "Harvest Logistics",
      impact: "Averts up to 8% storage loss",
      status: "pending"
    },
    {
      id: "rec-completed-1",
      action: "Optimize irrigation pressure for cotton parcel",
      details: "Adjusted drip valve cycles according to real-time evaporative transpiration rates.",
      category: "Water Management",
      impact: "Saved 22% fresh water, crop stress reduced by 14%",
      status: "completed",
      completedAt: "2026-07-04",
      impactMetric: "Saved 22% fresh water"
    },
    {
      id: "rec-completed-2",
      action: "Deploy whitefly pheromone traps in Sector 2",
      details: "Switched to organic biological lures in response to local drone telemetry reports.",
      category: "Pest Protection",
      impact: "Whitefly population dropped 88%, zero chemical residues.",
      status: "completed",
      completedAt: "2026-07-02",
      impactMetric: "Yield increased by 10%"
    }
  ]);

  const [recFeedbackMsg, setRecFeedbackMsg] = useState<string | null>(null);

  const [selectedYearRange, setSelectedYearRange] = useState<"all" | "recent">("all");
  const [activeChartTab, setActiveChartTab] = useState<"profit" | "yield" | "efficiency" | "crop_profitability" | "yield_trends" | "expense_breakdown" | "rev_vs_exp">("rev_vs_exp");
  
  // Simulation factors
  const [simWaterReduction, setSimWaterReduction] = useState<number>(10); 
  const [simOrganicFertilizer, setSimOrganicFertilizer] = useState<number>(40); 
  const [simDroneInspections, setSimDroneInspections] = useState<number>(4); 

  // Compute simulated outcomes based on user sliding inputs
  const simulatedOutcomes = useMemo(() => {
    const costSavingsWater = simWaterReduction * 450; 
    const waterScoreBoost = Math.min(100, 92 + (simWaterReduction - 10) * 0.4);

    const costSavingsFertilizer = simOrganicFertilizer * 300;
    const organicScoreBoost = Math.min(100, 75 + (simOrganicFertilizer - 30) * 0.5);

    const costSavingsPest = (simDroneInspections - 2) * 800;
    const pestControlBoost = Math.min(100, 81 + (simDroneInspections - 2) * 2);

    const totalCostSavings = costSavingsWater + costSavingsFertilizer + costSavingsPest;
    const overallEfficiencyScore = Math.round((waterScoreBoost + organicScoreBoost + pestControlBoost + 94 + 88) / 5);

    const baseProfit = 94000;
    const projectedProfit = baseProfit + totalCostSavings;

    return {
      totalCostSavings,
      projectedProfit,
      overallEfficiencyScore,
      waterScore: Math.round(waterScoreBoost),
      organicScore: Math.round(organicScoreBoost),
      pestScore: Math.round(pestControlBoost)
    };
  }, [simWaterReduction, simOrganicFertilizer, simDroneInspections]);

  // Dynamic filter for Year Range on profit charts
  const filteredProfitData = useMemo(() => {
    if (selectedYearRange === "recent") {
      return YoY_PROFIT_DATA.slice(1); 
    }
    return YoY_PROFIT_DATA;
  }, [selectedYearRange]);

  // Custom tooltips
  const CustomProfitTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-700 shadow-xl text-xs font-mono">
          <p className="font-extrabold text-slate-300 mb-1.5">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between gap-6 py-0.5">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <strong className="text-slate-100">₹{entry.value.toLocaleString()}</strong>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomYieldTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950 text-slate-100 p-3 rounded-xl border border-slate-800 shadow-lg text-xs">
          <p className="font-bold text-slate-300 mb-1.5">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between gap-5 py-0.5 font-mono">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <strong className="text-white">{entry.value} T/Ha</strong>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomCropProfitTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-700 shadow-xl text-xs font-mono">
          <p className="font-extrabold text-slate-300 mb-1.5">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between gap-6 py-0.5">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <strong className="text-slate-100">₹{entry.value.toLocaleString("en-IN")}</strong>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomYieldTrendTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-700 shadow-xl text-xs font-mono">
          <p className="font-extrabold text-slate-300 mb-1.5">Year: {label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between gap-6 py-0.5">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <strong className="text-slate-100">{entry.value.toFixed(1)} Tons/Acre</strong>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomMonthlyFinanceTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const revenue = payload.find((p: any) => p.dataKey === "revenue")?.value || 0;
      const expenses = payload.find((p: any) => p.dataKey === "expenses")?.value || 0;
      const profit = revenue - expenses;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-700 shadow-xl text-xs font-mono">
          <p className="font-extrabold text-slate-300 mb-1.5">Month: {label} 2026</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between gap-6 py-0.5">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <strong className="text-slate-100">₹{entry.value.toLocaleString("en-IN")}</strong>
            </div>
          ))}
          <div className="border-t border-slate-700 mt-1.5 pt-1.5 flex justify-between gap-6 font-bold">
            <span className="text-slate-400">Net Margin:</span>
            <span className={profit >= 0 ? "text-emerald-400" : "text-rose-400"}>
              ₹{profit.toLocaleString("en-IN")} {profit >= 0 ? "▲" : "▼"}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="farmer-performance-dashboard-root" className="space-y-6">
      
      {/* Dashboard Mode Navigation Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-3xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
            <Award className="h-5 w-5 text-indigo-600" />
            Performance & Health Analytics Engine
          </h2>
          <p className="text-slate-400 text-[10px] mt-0.5">
            Switch between real-time wellness evaluation loops and multi-year macroeconomic cost simulations.
          </p>
        </div>

        {/* View Mode Selector Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start sm:self-center overflow-x-auto max-w-full">
          <button
            onClick={() => setViewMode("fitness")}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              viewMode === "fitness"
                ? "bg-white text-emerald-800 shadow-3xs border border-slate-150"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Heart className="h-4 w-4 text-emerald-600 animate-pulse" />
            Farmer's Fitness Tracker
          </button>
          <button
            onClick={() => setViewMode("historical")}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              viewMode === "historical"
                ? "bg-white text-indigo-800 shadow-3xs border border-slate-150"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <TrendingUp className="h-4 w-4 text-indigo-600" />
            YoY Financial Sandbox
          </button>
          <button
            onClick={() => setViewMode("recommendations")}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              viewMode === "recommendations"
                ? "bg-white text-purple-800 shadow-3xs border border-slate-150"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Sparkles className="h-4 w-4 text-purple-600" />
            AI Recommendations
          </button>
        </div>
      </div>

      {/* Conditional rendering based on mode */}
      {viewMode === "fitness" && (
        <FarmHealthScoreTracker
          activeFarm={activeFarm}
          activities={activities}
          tasks={tasks}
          onLogActivity={onLogActivity}
          onCompleteTask={onCompleteTask}
        />
      )}

      {viewMode === "historical" && (
        <div className="space-y-6 animate-in fade-in duration-350">
          
          {/* Top row - Performance Indicator cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1 */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/85 shadow-3xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Net Profit Margin</span>
                <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600 border border-emerald-100">
                  <DollarSign className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg md:text-xl font-black text-slate-950 font-mono tracking-tight">
                  ₹1.82L
                </h3>
                <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
                  <TrendingUp className="h-3 w-3 shrink-0" />
                  +14.5% YoY trend
                </p>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/85 shadow-3xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Yield Index Score</span>
                <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600 border border-indigo-100">
                  <Sprout className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg md:text-xl font-black text-slate-950 font-mono tracking-tight">
                  9.6 T/Ha
                </h3>
                <p className="text-[10px] text-indigo-600 font-bold flex items-center gap-0.5 mt-1">
                  <ArrowUpRight className="h-3 w-3 shrink-0" />
                  11% over Regional avg
                </p>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/85 shadow-3xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Water Efficiency</span>
                <div className="bg-sky-50 p-2 rounded-xl text-sky-600 border border-sky-100">
                  <Droplet className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg md:text-xl font-black text-slate-950 font-mono tracking-tight">
                  92.0%
                </h3>
                <p className="text-[10px] text-sky-600 font-bold flex items-center gap-0.5 mt-1">
                  <Sparkles className="h-3 w-3 shrink-0" />
                  AWD irrigation active
                </p>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/85 shadow-3xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Clean Energy dependency</span>
                <div className="bg-amber-50 p-2 rounded-xl text-amber-600 border border-amber-100">
                  <Zap className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg md:text-xl font-black text-slate-950 font-mono tracking-tight">
                  94.0%
                </h3>
                <p className="text-[10px] text-amber-600 font-bold flex items-center gap-0.5 mt-1">
                  <Activity className="h-3 w-3 shrink-0" />
                  8.8 kW Solar pump grid
                </p>
              </div>
            </div>
          </div>

          {/* Primary Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 8 columns - Main Recharts Panel */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/85 p-4 md:p-5 flex flex-col shadow-3xs">
              
              {/* Chart Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-900 p-2.5 rounded-xl text-white">
                    <Activity className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 leading-tight">Analytical Trends</h3>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Interactive data visualizer powered by local ledger</p>
                  </div>
                </div>

                {/* Quick Chart Tabs */}
                <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-center border border-slate-200 overflow-x-auto max-w-full">
                  <button
                    onClick={() => setActiveChartTab("rev_vs_exp")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeChartTab === "rev_vs_exp"
                        ? "bg-slate-800 text-white shadow-3xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/55"
                    }`}
                  >
                    Revenue vs Expenses
                  </button>
                  <button
                    onClick={() => setActiveChartTab("crop_profitability")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeChartTab === "crop_profitability"
                        ? "bg-slate-800 text-white shadow-3xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/55"
                    }`}
                  >
                    Crop Profitability
                  </button>
                  <button
                    onClick={() => setActiveChartTab("yield_trends")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeChartTab === "yield_trends"
                        ? "bg-slate-800 text-white shadow-3xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/55"
                    }`}
                  >
                    Yield Trends
                  </button>
                  <button
                    onClick={() => setActiveChartTab("expense_breakdown")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeChartTab === "expense_breakdown"
                        ? "bg-slate-800 text-white shadow-3xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/55"
                    }`}
                  >
                    Expense Breakdown
                  </button>
                  <button
                    onClick={() => setActiveChartTab("efficiency")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeChartTab === "efficiency"
                        ? "bg-slate-800 text-white shadow-3xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/55"
                    }`}
                  >
                    Efficiency Metrics
                  </button>
                </div>
              </div>

              {/* Actual Recharts Chart Canvas */}
              <div className="w-full space-y-4">
                {activeChartTab === "rev_vs_exp" && (
                  <div className="space-y-6">
                    {/* Cumulative Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Total Revenue */}
                      <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-wider text-emerald-700/80">Total Revenue This Season</span>
                          <h4 className="text-xl font-black text-emerald-950 font-mono mt-1">₹11,80,000</h4>
                        </div>
                        <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-1 mt-2">
                          <TrendingUp className="h-3 w-3" /> Target achieved: 104%
                        </span>
                      </div>

                      {/* Total Expenses */}
                      <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-4 flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-wider text-rose-700/80">Total Expenses This Season</span>
                          <h4 className="text-xl font-black text-rose-950 font-mono mt-1">₹6,65,000</h4>
                        </div>
                        <span className="text-[9px] text-rose-600 font-bold flex items-center gap-1 mt-2">
                          <TrendingDown className="h-3 w-3" /> Under budget: -5.3%
                        </span>
                      </div>

                      {/* Net Profit */}
                      <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-wider text-indigo-700/80">Net Season Profit</span>
                          <h4 className="text-xl font-black text-indigo-950 font-mono mt-1">₹5,15,000</h4>
                        </div>
                        <span className="text-[9px] text-indigo-600 font-bold flex items-center gap-1 mt-2">
                          <ArrowUpRight className="h-3 w-3" /> Avg. profit margin: 43.6%
                        </span>
                      </div>
                    </div>

                    {/* Monthly Bar Chart */}
                    <div className="h-[260px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={MONTHLY_FINANCES_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "#64748b", fontWeight: 700 }}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(val) => "₹" + (val / 1000).toFixed(0) + "K"}
                            tick={{ fontSize: 10, fill: "#64748b", fontWeight: 700 }}
                          />
                          <Tooltip content={<CustomMonthlyFinanceTooltip />} />
                          <Legend iconSize={10} wrapperStyle={{ fontSize: 10, fontWeight: 700, marginTop: 10 }} />
                          <Bar dataKey="revenue" fill="#10b981" name="Revenue" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="expenses" fill="#f43f5e" name="Expenses" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Profit/Loss Indicator Details Table */}
                    <div className="bg-slate-50 rounded-xl border border-slate-150 p-4">
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
                        <Coins className="h-4 w-4 text-indigo-600" />
                        Monthly Ledger & Profit/Loss Status Indicators
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px] font-semibold text-slate-600 font-sans">
                          <thead>
                            <tr className="border-b border-slate-200 text-[9px] uppercase tracking-wider text-slate-400">
                              <th className="py-2">Month</th>
                              <th className="py-2 text-right">Revenue</th>
                              <th className="py-2 text-right">Expenses</th>
                              <th className="py-2 text-right">Net Cash Flow</th>
                              <th className="py-2 text-right">Performance Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-mono">
                            {MONTHLY_FINANCES_DATA.map((item, idx) => {
                              const isProfit = item.profit >= 0;
                              return (
                                <tr key={idx} className="hover:bg-slate-100/50 transition-colors">
                                  <td className="py-2.5 font-sans font-bold text-slate-800">{item.month} 2026</td>
                                  <td className="py-2.5 text-right text-slate-700">₹{item.revenue.toLocaleString("en-IN")}</td>
                                  <td className="py-2.5 text-right text-slate-500">₹{item.expenses.toLocaleString("en-IN")}</td>
                                  <td className={`py-2.5 text-right font-black ${isProfit ? "text-emerald-600" : "text-rose-600"}`}>
                                    {isProfit ? "+" : ""}₹{item.profit.toLocaleString("en-IN")}
                                  </td>
                                  <td className="py-2.5 text-right font-bold">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] uppercase font-black tracking-wider ${
                                      isProfit
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                        : "bg-rose-50 text-rose-700 border border-rose-100"
                                    }`}>
                                      <span className={`h-1.5 w-1.5 rounded-full ${isProfit ? "bg-emerald-500" : "bg-rose-500"}`} />
                                      {isProfit ? "Profit" : "Loss Alert"}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeChartTab === "crop_profitability" && (
                  <div className="space-y-6">
                    <div className="h-[260px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={CROP_PROFITABILITY_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis
                            dataKey="crop"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "#64748b", fontWeight: 700 }}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(val) => "₹" + (val / 1000).toFixed(0) + "K"}
                            tick={{ fontSize: 10, fill: "#64748b", fontWeight: 700 }}
                          />
                          <Tooltip content={<CustomCropProfitTooltip />} />
                          <Legend iconSize={10} wrapperStyle={{ fontSize: 10, fontWeight: 700, marginTop: 10 }} />
                          <Bar dataKey="revenue" fill="#6366f1" name="Gross Revenue" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="expenses" fill="#f43f5e" name="Total Expenses" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="profit" fill="#10b981" name="Net Profit" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Table grid showing exact numbers */}
                    <div className="bg-slate-50 rounded-xl border border-slate-150 p-4">
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
                        <Coins className="h-4 w-4 text-indigo-600" />
                        Crop-Wise Financial Ledger (INR)
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px] font-semibold text-slate-600 font-sans">
                          <thead>
                            <tr className="border-b border-slate-200 text-[9px] uppercase tracking-wider text-slate-400">
                              <th className="py-2">Crop Name</th>
                              <th className="py-2 text-right">Revenue</th>
                              <th className="py-2 text-right">Expenses</th>
                              <th className="py-2 text-right text-emerald-700">Net Profit</th>
                              <th className="py-2 text-right">Margin (%)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-mono">
                            {CROP_PROFITABILITY_DATA.map((item, idx) => {
                              const marginPercent = ((item.profit / item.revenue) * 100).toFixed(1);
                              return (
                                <tr key={idx} className="hover:bg-slate-100/50 transition-colors">
                                  <td className="py-2.5 font-sans font-bold text-slate-800">{item.crop}</td>
                                  <td className="py-2.5 text-right text-slate-700">₹{item.revenue.toLocaleString("en-IN")}</td>
                                  <td className="py-2.5 text-right text-red-500">₹{item.expenses.toLocaleString("en-IN")}</td>
                                  <td className="py-2.5 text-right text-emerald-600 font-bold">₹{item.profit.toLocaleString("en-IN")}</td>
                                  <td className="py-2.5 text-right font-bold text-slate-700">
                                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px]">
                                      {marginPercent}%
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeChartTab === "yield_trends" && (
                  <div className="space-y-6">
                    <div className="h-[260px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={YIELD_TRENDS_FIVE_YEARS} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis
                            dataKey="year"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "#64748b", fontWeight: 700 }}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "#64748b", fontWeight: 700 }}
                          />
                          <Tooltip content={<CustomYieldTrendTooltip />} />
                          <Legend iconSize={10} wrapperStyle={{ fontSize: 10, fontWeight: 700, marginTop: 10 }} />
                          <Line type="monotone" dataKey="Basmati Rice" stroke="#6366f1" strokeWidth={3} activeDot={{ r: 6 }} name="Basmati Rice" />
                          <Line type="monotone" dataKey="Durum Wheat" stroke="#10b981" strokeWidth={3} activeDot={{ r: 6 }} name="Durum Wheat" />
                          <Line type="monotone" dataKey="Mustard" stroke="#f59e0b" strokeWidth={3} activeDot={{ r: 6 }} name="Mustard" />
                          <Line type="monotone" dataKey="Bt Cotton" stroke="#ec4899" strokeWidth={3} activeDot={{ r: 6 }} name="Bt Cotton" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* YoY Yield Comparison Table */}
                    <div className="bg-slate-50 rounded-xl border border-slate-150 p-4">
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
                        <Sprout className="h-4 w-4 text-emerald-600" />
                        Year-Over-Year Yield Comparison (Tons per Acre)
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px] font-semibold text-slate-600 font-sans">
                          <thead>
                            <tr className="border-b border-slate-200 text-[9px] uppercase tracking-wider text-slate-400">
                              <th className="py-2">Harvest Year</th>
                              <th className="py-2 text-right">Basmati Rice</th>
                              <th className="py-2 text-right">Durum Wheat</th>
                              <th className="py-2 text-right">Mustard</th>
                              <th className="py-2 text-right">Bt Cotton</th>
                              <th className="py-2 text-right">YoY Average Growth</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-mono">
                            {YIELD_TRENDS_FIVE_YEARS.map((item, idx, arr) => {
                              let yoyGrowth = "N/A";
                              if (idx > 0) {
                                const prev = arr[idx - 1];
                                const currentAvg = (item["Basmati Rice"] + item["Durum Wheat"] + item.Mustard + item["Bt Cotton"]) / 4;
                                const prevAvg = (prev["Basmati Rice"] + prev["Durum Wheat"] + prev.Mustard + prev["Bt Cotton"]) / 4;
                                const pct = ((currentAvg - prevAvg) / prevAvg * 100);
                                yoyGrowth = `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%`;
                              }
                              return (
                                <tr key={idx} className="hover:bg-slate-100/50 transition-colors">
                                  <td className="py-2.5 font-sans font-bold text-slate-800">{item.year}</td>
                                  <td className="py-2.5 text-right">{item["Basmati Rice"].toFixed(1)} T/Ac</td>
                                  <td className="py-2.5 text-right">{item["Durum Wheat"].toFixed(1)} T/Ac</td>
                                  <td className="py-2.5 text-right">{item.Mustard.toFixed(1)} T/Ac</td>
                                  <td className="py-2.5 text-right">{item["Bt Cotton"].toFixed(1)} T/Ac</td>
                                  <td className="py-2.5 text-right font-bold">
                                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                                      idx === 0
                                        ? "bg-slate-100 text-slate-400 border border-slate-200"
                                        : yoyGrowth.startsWith("+")
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                        : "bg-red-50 text-red-700 border border-red-100"
                                    }`}>
                                      {yoyGrowth}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeChartTab === "expense_breakdown" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      {/* Pie chart container */}
                      <div className="md:col-span-5 h-[240px] flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={EXPENSE_BREAKDOWN_DATA}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={85}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {EXPENSE_BREAKDOWN_DATA.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => "₹" + Number(value).toLocaleString("en-IN")} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-[10px] uppercase font-extrabold text-slate-400">Total Budget</span>
                          <span className="text-sm font-black text-slate-900 font-mono">₹3.50L</span>
                        </div>
                      </div>

                      {/* Legend table container */}
                      <div className="md:col-span-7 space-y-2 text-[11px] font-semibold text-slate-600">
                        <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                          <PieIcon className="h-4 w-4 text-indigo-600" />
                          Seasonal Cost Component Breakdown
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {EXPENSE_BREAKDOWN_DATA.map((item, idx) => {
                            const totalExpenses = EXPENSE_BREAKDOWN_DATA.reduce((acc, curr) => acc + curr.value, 0);
                            const percentage = ((item.value / totalExpenses) * 100).toFixed(0);
                            return (
                              <div key={idx} className="bg-slate-50 border border-slate-150 rounded-xl p-3 flex flex-col justify-between hover:border-slate-300 transition-all">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="flex items-center gap-1.5 text-slate-700 font-sans font-bold">
                                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    {item.name}
                                  </span>
                                  <span className="text-[10px] font-bold text-slate-400 font-mono">{percentage}%</span>
                                </div>
                                <div className="flex justify-between items-end">
                                  <span className="text-[12px] font-black text-slate-800 font-mono">₹{item.value.toLocaleString("en-IN")}</span>
                                </div>
                                {/* Subtle bar indicator */}
                                <div className="h-1 w-full bg-slate-200 rounded-full mt-2 overflow-hidden">
                                  <div className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: item.color }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeChartTab === "efficiency" && (
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                        { subject: 'Water', actual: simulatedOutcomes.waterScore, benchmark: 85 },
                        { subject: 'Organic Nitrogen', actual: simulatedOutcomes.organicScore, benchmark: 80 },
                        { subject: 'Bio Pest Control', actual: simulatedOutcomes.pestScore, benchmark: 75 },
                        { subject: 'Solar Power', actual: 94, benchmark: 90 },
                        { subject: 'Labor Load', actual: 88, benchmark: 85 },
                      ]}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#334155', fontWeight: 800 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8, fill: '#94a3b8' }} />
                        <Radar name="Active Sim Score" dataKey="actual" stroke="#6366f1" fill="#6366f1" fillOpacity={0.45} />
                        <Radar name="District Target" dataKey="benchmark" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.15} />
                        <Legend iconSize={10} wrapperStyle={{ fontSize: 11, fontWeight: 700, marginTop: 10 }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* Quick Context Tip */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex gap-2.5 items-start mt-6">
                <Info className="h-4.5 w-4.5 text-indigo-500 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed text-slate-500 font-medium">
                  {activeChartTab === "rev_vs_exp" && "Revenue vs Expenses chart shows the monthly cash inflows and outflows along with real-time profit and loss status indicators."}
                  {activeChartTab === "crop_profitability" && "Crop-wise profitability helps track the revenue efficiency of individual seasonal outputs after adjusting for direct input costs."}
                  {activeChartTab === "yield_trends" && "Yield trends evaluate your historical farming productivity in tons per acre across major rabi and kharif cycles."}
                  {activeChartTab === "expense_breakdown" && "The seasonal cost component diagram highlights operational resource allocation across key categories."}
                  {activeChartTab === "efficiency" && "This multi-axis index scales your resource conservation. Adjust parameters in the Optimization Sandbox to predict changes."}
                </div>
              </div>
            </div>

            {/* Right 4 columns - Resource Optimization Sandbox */}
            <div className="lg:col-span-4 bg-slate-950 text-white rounded-2xl p-5 border border-slate-800 flex flex-col justify-between shadow-xs">
              <div>
                {/* Header */}
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                  <SlidersHorizontal className="h-4.5 w-4.5 text-indigo-400 shrink-0" />
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-indigo-300">Optimization Sandbox</h3>
                    <p className="text-[9px] text-slate-400 leading-normal mt-0.5">Drag parameters to predict ROI limits</p>
                  </div>
                </div>

                {/* Sliders Container */}
                <div className="space-y-5 mt-5">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px] font-bold">
                      <span className="text-slate-300 flex items-center gap-1">
                        <Droplet className="h-3 w-3 text-sky-400" />
                        Water Savings Target
                      </span>
                      <span className="text-sky-300 font-mono">{simWaterReduction}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="25"
                      value={simWaterReduction}
                      onChange={(e) => setSimWaterReduction(parseInt(e.target.value))}
                      className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-full cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px] font-bold">
                      <span className="text-slate-300 flex items-center gap-1">
                        <Leaf className="h-3 w-3 text-emerald-400" />
                        Organic fertilizer ratio
                      </span>
                      <span className="text-emerald-300 font-mono">{simOrganicFertilizer}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="80"
                      value={simOrganicFertilizer}
                      onChange={(e) => setSimOrganicFertilizer(parseInt(e.target.value))}
                      className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-full cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px] font-bold">
                      <span className="text-slate-300 flex items-center gap-1">
                        <Activity className="h-3 w-3 text-indigo-400" />
                        Drone Health Patrols
                      </span>
                      <span className="text-indigo-300 font-mono">{simDroneInspections} / mo</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={simDroneInspections}
                      onChange={(e) => setSimDroneInspections(parseInt(e.target.value))}
                      className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-full cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Results Summary Box */}
              <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 mt-6 space-y-4">
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Projected Outcomes</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/50">
                    <span className="text-[8px] text-slate-400 font-bold block uppercase leading-none">Net Crop Profit</span>
                    <strong className="text-sm font-black text-white font-mono block mt-1.5">
                      ₹{simulatedOutcomes.projectedProfit.toLocaleString()}
                    </strong>
                    <span className="text-[7.5px] text-emerald-400 font-semibold mt-0.5 block">
                      +₹{(simulatedOutcomes.projectedProfit - 94000).toLocaleString()} savings
                    </span>
                  </div>

                  <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/50">
                    <span className="text-[8px] text-slate-400 font-bold block uppercase leading-none">Efficiency Index</span>
                    <strong className="text-sm font-black text-indigo-300 font-mono block mt-1.5">
                      {simulatedOutcomes.overallEfficiencyScore}%
                    </strong>
                  </div>
                </div>

                <div className="space-y-2 text-[10px] font-bold">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Water Retention:</span>
                    <span className="font-mono text-sky-400">{simulatedOutcomes.waterScore}/100</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-400 transition-all duration-300" style={{ width: `${simulatedOutcomes.waterScore}%` }} />
                  </div>

                  <div className="flex justify-between items-center text-slate-300">
                    <span>Nitrogen Assimilation:</span>
                    <span className="font-mono text-emerald-400">{simulatedOutcomes.organicScore}/100</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 transition-all duration-300" style={{ width: `${simulatedOutcomes.organicScore}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ledger benchmarks */}
          <div className="bg-white rounded-2xl border border-slate-200/85 p-5 shadow-3xs">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Resource Utilization Ledger</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="border border-slate-100 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-sky-600 mb-1">
                  <Droplet className="h-4.5 w-4.5 text-sky-500" />
                  <h4 className="text-xs font-extrabold text-slate-900">Hydrological Efficiency</h4>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                  By utilizing tensiometers linked to your sub-surface drip laterals, you maintain root-zone soil water tension strictly at <strong className="text-slate-800">-22 kPa</strong>, reducing sub-canopy evaporation losses.
                </p>
              </div>

              <div className="border border-slate-100 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 mb-1">
                  <Leaf className="h-4.5 w-4.5 text-emerald-500" />
                  <h4 className="text-xs font-extrabold text-slate-900">Organic Matter Buffer</h4>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                  Applying a 40:60 ratio of vermicompost to traditional urea preserves beneficial soil mycorrhizae. This biological carbon matrix buffers soil pH at an optimal <strong className="text-slate-800">6.5 pH</strong>.
                </p>
              </div>

              <div className="border border-slate-100 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-indigo-600 mb-1">
                  <Zap className="h-4.5 w-4.5 text-indigo-500" />
                  <h4 className="text-xs font-extrabold text-slate-900">Carbon offset metrics</h4>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                  Replacing diesel-powered borewells with solar micro-gated grids saves ₹18,000 in fuel annually. It offsets <strong className="text-slate-800">1.4 Tons</strong> of CO₂ emissions.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {viewMode === "recommendations" && (
        <div className="space-y-6 animate-in fade-in duration-350">
          {/* Top Banner & Trigger */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 border border-slate-800 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] uppercase font-black tracking-wider border border-purple-500/30">
                <Sparkles className="h-3 w-3 animate-pulse" /> Advanced ML Agriscience
              </span>
              <h3 className="text-lg font-black tracking-tight mt-1.5">AI Smart Recommendations Dashboard</h3>
              <p className="text-slate-300 text-xs leading-normal">
                Agronomic insights, real-time soil chemistry telemetry, and weather warning loops.
              </p>
            </div>
            
            <button
              onClick={() => {
                setRecFeedbackMsg("Calibrating multispectral satellite channels and local soil moisture arrays...");
                setTimeout(() => {
                  setRecommendations(prev => {
                    if (prev.some(r => r.id.startsWith("rec-dynamic-"))) {
                      setRecFeedbackMsg("Diagnostics complete. Soil buffer stable. No new alerts.");
                      setTimeout(() => setRecFeedbackMsg(null), 3500);
                      return prev;
                    }
                    const newRec: AIRecommendation = {
                      id: `rec-dynamic-${Date.now()}`,
                      action: "Postpone fertigation in Sector 4",
                      details: "Recent soil diagnostic telemetry indicates high nitrogen retention. Scheduled fertigation should be postponed by 4 days to avert nitrate leaching and save costs.",
                      category: "Soil Buffer Health",
                      impact: "Prevents fertilizer runoff & saves ₹4,200",
                      status: "pending"
                    };
                    setRecFeedbackMsg("Analysis complete! New nitrogen-buffer advisory loaded below.");
                    setTimeout(() => setRecFeedbackMsg(null), 4000);
                    return [newRec, ...prev];
                  });
                }, 1200);
              }}
              className="bg-white text-indigo-950 font-black text-xs px-4 py-2.5 rounded-xl border border-indigo-200/50 hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer shadow-3xs hover:shadow-2xs self-start md:self-center shrink-0"
            >
              <RefreshCw className="h-3.5 w-3.5 text-indigo-600 animate-spin-slow" />
              Trigger AI Diagnostic Scan
            </button>
          </div>

          {/* Feedback Toast */}
          {recFeedbackMsg && (
            <div className="bg-indigo-50 border border-indigo-100 text-indigo-900 rounded-xl px-4 py-3 flex justify-between items-center text-xs font-bold animate-in slide-in-from-top-4 duration-300 shadow-3xs">
              <span className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-indigo-600 animate-spin" />
                {recFeedbackMsg}
              </span>
              <button onClick={() => setRecFeedbackMsg(null)} className="text-indigo-400 hover:text-indigo-700 text-[10px] uppercase font-black tracking-wider">Dismiss</button>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Pending */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/85 shadow-3xs flex justify-between items-center">
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Pending Actions</span>
                <h4 className="text-2xl font-black text-slate-900 font-mono mt-1">
                  {recommendations.filter(r => r.status === "pending").length}
                </h4>
              </div>
              <div className="bg-amber-50 p-2.5 rounded-xl text-amber-600 border border-amber-100">
                <Calendar className="h-5 w-5" />
              </div>
            </div>

            {/* Total Completed */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/85 shadow-3xs flex justify-between items-center">
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Completed Advice Adopted</span>
                <h4 className="text-2xl font-black text-slate-900 font-mono mt-1">
                  {recommendations.filter(r => r.status === "completed").length}
                </h4>
              </div>
              <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600 border border-emerald-100">
                <Award className="h-5 w-5" />
              </div>
            </div>

            {/* Cumulative Yield / Savings impact */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/85 shadow-3xs flex justify-between items-center">
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Verifiable Harvest Impact</span>
                <h4 className="text-base font-black text-emerald-700 font-sans mt-2">
                  +15% Yield Increase
                </h4>
              </div>
              <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600 border border-indigo-100">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Recommendation Lists Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 6 Columns: Pending Recommendations */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-amber-500" />
                  Pending Recommendations
                </h4>
                <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 font-black px-2 py-0.5 rounded-full">
                  Action Required
                </span>
              </div>

              {recommendations.filter(r => r.status === "pending").length === 0 ? (
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 font-medium text-xs">
                  ✨ Excellent! All pending AI suggestions have been applied and moved to completed log.
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendations.filter(r => r.status === "pending").map((rec) => (
                    <div
                      key={rec.id}
                      className="bg-white rounded-2xl border border-slate-200/85 p-5 shadow-3xs hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-4">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 text-[9px] font-extrabold uppercase tracking-wide">
                            {rec.category}
                          </span>
                          <span className="text-[10px] font-black text-emerald-600 font-mono bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                            Impact: {rec.impact}
                          </span>
                        </div>
                        <h5 className="text-sm font-black text-slate-900 font-sans tracking-tight leading-tight">
                          {rec.action}
                        </h5>
                        <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                          {rec.details}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[9.5px] text-slate-400 font-bold flex items-center gap-1">
                          <Activity className="h-3.5 w-3.5 text-indigo-400" /> Requires physical action
                        </span>
                        
                        <button
                          onClick={() => {
                            setRecommendations(prev => prev.map(r => {
                              if (r.id === rec.id) {
                                return {
                                  ...r,
                                  status: "completed",
                                  completedAt: new Date().toISOString().split("T")[0],
                                  impactMetric: r.impact
                                };
                              }
                              return r;
                            }));
                            setRecFeedbackMsg(`Successfully adopted advice: "${rec.action}"`);
                            setTimeout(() => setRecFeedbackMsg(null), 3000);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer hover:shadow-3xs"
                        >
                          <Sparkles className="h-3 w-3" />
                          Apply Recommendation
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right 6 Columns: Completed Actions Log & Impact Tracking */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-emerald-500" />
                  Completed Recommendations & Impact Log
                </h4>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-black px-2 py-0.5 rounded-full">
                  Verifiable History
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-4">
                {recommendations.filter(r => r.status === "completed").length === 0 ? (
                  <div className="text-center text-slate-400 py-6 text-xs font-medium">
                    No recommendations completed yet. Mark a pending action completed to begin verification.
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {recommendations.filter(r => r.status === "completed").map((rec) => (
                      <div
                        key={rec.id}
                        className="bg-white rounded-xl border border-slate-150 p-4 flex gap-3.5 items-start shadow-3xs"
                      >
                        <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 p-1.5 rounded-lg shrink-0">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-4">
                            <span className="text-[10px] text-slate-400 font-mono font-bold">
                              Applied: {rec.completedAt}
                            </span>
                            <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[9px] font-black uppercase font-mono tracking-wider shrink-0">
                              Verified
                            </span>
                          </div>
                          
                          <h5 className="text-[12px] font-black text-slate-800 leading-snug">
                            {rec.action}
                          </h5>
                          
                          <p className="text-[11px] text-slate-500 leading-normal font-semibold">
                            {rec.details}
                          </p>

                          <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-2 flex items-center gap-2 mt-1.5">
                            <TrendingUp className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            <span className="text-[10.5px] text-emerald-800 font-bold">
                              Measurable Impact: <strong className="font-extrabold text-emerald-900">{rec.impactMetric || rec.impact}</strong>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Educational Agriscience Notice */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex gap-2.5 items-start">
            <Info className="h-4.5 w-4.5 text-indigo-500 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed text-slate-500 font-medium">
              Diagnostic advisories are compiled by synthesizing the Amritsar central soil-pH matrix, regional ground-truth moisture tensiometers, and micro-climate forecasting. Always verify physical crop conditions before initiating large-scale operations.
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
