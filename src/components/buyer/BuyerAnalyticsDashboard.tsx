import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Briefcase,
  Layers,
  ArrowUpDown,
  Download,
  Filter,
  Info,
  ChevronRight,
  Sparkles,
  PieChart as PieIcon,
  BarChart2,
  Percent,
  Calculator,
  ShieldCheck,
  Building,
  Tag,
  Award,
  LineChart as LineIcon,
  Sparkle,
  Star
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";

// 12 Months of detailed procurement spend data for the current year vs. previous year (in thousands ₹)
const MONTHLY_SPEND_DATA = [
  { month: "Jul 25", currentYear: 180, previousYear: 150, crops: 120, logistics: 35, storage: 15, others: 10 },
  { month: "Aug 25", currentYear: 240, previousYear: 210, crops: 170, logistics: 42, storage: 18, others: 10 },
  { month: "Sep 25", currentYear: 310, previousYear: 280, crops: 220, logistics: 55, storage: 25, others: 10 },
  { month: "Oct 25", currentYear: 450, previousYear: 390, crops: 320, logistics: 78, storage: 35, others: 17 },
  { month: "Nov 25", currentYear: 520, previousYear: 440, crops: 380, logistics: 85, storage: 40, others: 15 },
  { month: "Dec 25", currentYear: 380, previousYear: 310, crops: 260, logistics: 70, storage: 35, others: 15 },
  { month: "Jan 26", currentYear: 290, previousYear: 250, crops: 200, logistics: 52, storage: 28, others: 10 },
  { month: "Feb 26", currentYear: 340, previousYear: 290, crops: 240, logistics: 60, storage: 30, others: 10 },
  { month: "Mar 26", currentYear: 420, previousYear: 360, crops: 300, logistics: 75, storage: 35, others: 10 },
  { month: "Apr 26", currentYear: 490, previousYear: 410, crops: 350, logistics: 85, storage: 40, others: 15 },
  { month: "May 26", currentYear: 580, previousYear: 480, crops: 420, logistics: 98, storage: 45, others: 17 },
  { month: "Jun 26", currentYear: 630, previousYear: 520, crops: 460, logistics: 105, storage: 50, others: 15 }
];

// 12 Months of detailed procurement savings & tonnage data (compared to spot market prices)
const MONTHLY_SAVINGS_DATA = [
  { month: "Jul 25", tons: 5.4, purchasePrice: 41000, marketPrice: 45000, savings: 21600 },
  { month: "Aug 25", tons: 6.8, purchasePrice: 42000, marketPrice: 46200, savings: 28560 },
  { month: "Sep 25", tons: 8.2, purchasePrice: 40500, marketPrice: 44800, savings: 35260 },
  { month: "Oct 25", tons: 12.0, purchasePrice: 41800, marketPrice: 45900, savings: 49200 },
  { month: "Nov 25", tons: 14.5, purchasePrice: 39500, marketPrice: 43600, savings: 59450 },
  { month: "Dec 25", tons: 10.1, purchasePrice: 42500, marketPrice: 46100, savings: 36360 },
  { month: "Jan 26", tons: 7.5, purchasePrice: 43000, marketPrice: 47000, savings: 30000 },
  { month: "Feb 26", tons: 8.8, purchasePrice: 41200, marketPrice: 45400, savings: 36960 },
  { month: "Mar 26", tons: 11.2, purchasePrice: 40800, marketPrice: 44900, savings: 45920 },
  { month: "Apr 26", tons: 13.0, purchasePrice: 42200, marketPrice: 46500, savings: 55900 },
  { month: "May 26", tons: 15.4, purchasePrice: 39800, marketPrice: 44200, savings: 67760 },
  { month: "Jun 26", tons: 16.8, purchasePrice: 41500, marketPrice: 45800, savings: 72240 }
];

// Highlighted best contract deals
const BEST_DEALS_HIGHLIGHT = [
  {
    id: "CON-8842",
    crop: "Premium Basmati Rice",
    farmer: "Sardar Gurbax Singh",
    tons: 25.4,
    purchasedRate: "₹65,000/MT",
    marketRate: "₹73,000/MT",
    discount: "11.0%",
    totalSaved: "₹2,03,200",
    badge: "⭐ Top Price Arbitrage"
  },
  {
    id: "CON-9122",
    crop: "Soft Red Winter Wheat",
    farmer: "Rajinder Sharma",
    tons: 40.8,
    purchasedRate: "₹24,000/MT",
    marketRate: "₹26,500/MT",
    discount: "9.4%",
    totalSaved: "₹1,02,000",
    badge: "🌾 Bulk Tonnage Discount"
  },
  {
    id: "CON-7751",
    crop: "Organic Soybeans",
    farmer: "Devendra Patil",
    tons: 12.0,
    purchasedRate: "₹42,500/MT",
    marketRate: "₹46,000/MT",
    discount: "7.6%",
    totalSaved: "₹42,000",
    badge: "🌱 Pre-Harvest Lock-in"
  }
];

// Breakdown Categories
const CATEGORY_DATA = [
  { name: "Crops & Grains", value: 3450, color: "#0d9488" }, // teal-600
  { name: "Logistics & Pickup", value: 835, color: "#0284c7" }, // sky-600
  { name: "Silo & Cold Storage", value: 396, color: "#f59e0b" }, // amber-500
  { name: "Others (SLA/Insure)", value: 159, color: "#64748b" }  // slate-500
];

// Crop breakdown detail
const CROP_SPEND_DETAIL = [
  { crop: "Premium Basmati Rice", amount: 1650000, tons: 25.4, orders: 14, trend: "up" },
  { crop: "Soft Red Winter Wheat", amount: 980000, tons: 40.8, orders: 9, trend: "down" },
  { crop: "Organic Soybeans", amount: 510000, tons: 12.0, orders: 5, trend: "up" },
  { crop: "Golden Delicious Apple", amount: 310000, tons: 6.0, orders: 3, trend: "stable" }
];

// Part 9.3: Supplier Performance Data
const TOP_SUPPLIERS_QUALITY = [
  { name: "Sardar Gurbax Singh", crop: "Premium Basmati Rice", score: 98.4, purchases: "62 MT", value: 4030000, contracts: 18, rating: 4.9 },
  { name: "Vijay Grewal", crop: "Golden Delicious Apple", score: 96.5, purchases: "18 MT", value: 1980000, contracts: 6, rating: 4.8 },
  { name: "Devendra Patil", crop: "Organic Soybeans", score: 95.8, purchases: "36 MT", value: 1530000, contracts: 12, rating: 4.7 },
  { name: "Rajinder Sharma", crop: "Soft Red Winter Wheat", score: 94.2, purchases: "85 MT", value: 2040000, contracts: 14, rating: 4.6 }
];

const TOP_SUPPLIERS_VALUE = [
  { name: "Sardar Gurbax Singh", value: 4030000, tons: "62.0 MT", avgQuality: 98.4 },
  { name: "Rajinder Sharma", value: 2040000, tons: "85.0 MT", avgQuality: 94.2 },
  { name: "Vijay Grewal", value: 1980000, tons: "18.0 MT", avgQuality: 96.5 },
  { name: "Devendra Patil", value: 1530000, tons: "36.0 MT", avgQuality: 95.8 }
];

const SUPPLIER_RATINGS = [
  {
    name: "Sardar Gurbax Singh",
    avg: 4.9,
    breakdown: { five: 85, four: 12, three: 3, two: 0, one: 0 },
    reviews: 42
  },
  {
    name: "Vijay Grewal",
    avg: 4.8,
    breakdown: { five: 80, four: 15, three: 5, two: 0, one: 0 },
    reviews: 20
  },
  {
    name: "Devendra Patil",
    avg: 4.7,
    breakdown: { five: 75, four: 18, three: 5, two: 2, one: 0 },
    reviews: 28
  },
  {
    name: "Rajinder Sharma",
    avg: 4.6,
    breakdown: { five: 70, four: 20, three: 8, two: 2, one: 0 },
    reviews: 35
  }
];

// Part 9.4: AI Recommendations Data
const RECOMMENDED_SUPPLIERS = [
  { name: "Devendra Patil", quality: "95.8%", price: "₹42,500/MT", score: "Outstanding Match", crop: "Organic Soybeans", reason: "Direct contract rate locks in 7.6% savings against prevailing spot mandis. Features 100% on-time delivery track record and spotless moisture quality testing history." },
  { name: "Rajinder Sharma", quality: "94.2%", price: "₹24,000/MT", score: "High Value Option", crop: "Soft Red Winter Wheat", reason: "Excellent bulk rate pricing combined with high gluten content wheat Grade A score. Proximity to freight terminal saves ₹1,200/MT in direct diesel transit outlays." }
];

const RECOMMENDED_CROPS = [
  { crop: "Premium Basmati Rice", valueScore: 94, discount: "11.0%", marketRate: "₹73,000/MT", contractRate: "₹65,000/MT", advice: "Extreme value buy right now. Direct APEDA-backed contracts bypass regional middleman mandi commission taxes entirely." },
  { crop: "Organic Soybeans", valueScore: 88, discount: "7.6%", marketRate: "₹46,000/MT", contractRate: "₹42,500/MT", advice: "Secure advance harvest allocations immediately ahead of the peak food processing seasonal bidding crush." }
];

const INITIAL_UPCOMING_HARVESTS = [
  { id: "HARV-221", crop: "Non-GMO Feed Corn", region: "Karnal, Haryana", volume: "45 Tons", date: "In 3 Days (Jul 11)", preOrderPrice: "₹18,500/MT", farmer: "Harpreet Singh", status: "Available" },
  { id: "HARV-304", crop: "Arabica Coffee Beans", region: "Chikmagalur, Karnataka", volume: "12 Tons", date: "In 5 Days (Jul 13)", preOrderPrice: "₹1,65,000/MT", farmer: "Ramesh Gowda", status: "Available" },
  { id: "HARV-187", crop: "Basmati Rice (Pusa 1121)", region: "Machilipatnam, Andhra Pradesh", volume: "80 Tons", date: "In 6 Days (Jul 14)", preOrderPrice: "₹61,000/MT", farmer: "Baldev Dhillon", status: "Available" }
];

export default function BuyerAnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState<"spending" | "savings" | "suppliers" | "recommendations">("spending");
  const [timeRange, setTimeRange] = useState<"12" | "6" | "3">("12");
  const [selectedCrop, setSelectedCrop] = useState<string>("All Crops");
  const [activeSegment, setActiveSegment] = useState<number | null>(null);
  const [upcomingHarvests, setUpcomingHarvests] = useState(INITIAL_UPCOMING_HARVESTS);
  const [preOrderLot, setPreOrderLot] = useState<string | null>(null);

  // Dynamic calculations for Spending tab based on selected timeline
  const filteredSpendData = useMemo(() => {
    const monthsToKeep = parseInt(timeRange);
    return MONTHLY_SPEND_DATA.slice(-monthsToKeep);
  }, [timeRange]);

  // Dynamic calculations for Savings tab based on selected timeline
  const filteredSavingsData = useMemo(() => {
    const monthsToKeep = parseInt(timeRange);
    return MONTHLY_SAVINGS_DATA.slice(-monthsToKeep);
  }, [timeRange]);

  const spendMetrics = useMemo(() => {
    let currentTotal = 0;
    let prevTotal = 0;
    let cropTotal = 0;
    let logisticsTotal = 0;
    let storageTotal = 0;
    let othersTotal = 0;

    filteredSpendData.forEach((d) => {
      currentTotal += d.currentYear;
      prevTotal += d.previousYear;
      cropTotal += d.crops;
      logisticsTotal += d.logistics;
      storageTotal += d.storage;
      othersTotal += d.others;
    });

    const percentChange = prevTotal > 0 ? ((currentTotal - prevTotal) / prevTotal) * 100 : 0;
    const avgMonthlySpend = filteredSpendData.length > 0 ? currentTotal / filteredSpendData.length : 0;

    return {
      currentTotal: (currentTotal * 1000).toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }),
      prevTotal: (prevTotal * 1000).toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }),
      percentChange: percentChange.toFixed(1),
      isIncrease: percentChange > 0,
      avgMonthlySpend: (avgMonthlySpend * 1000).toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }),
      rawCurrentTotal: currentTotal,
      rawPrevTotal: prevTotal,
      categories: [
        { name: "Crops & Grains", value: cropTotal, percentage: ((cropTotal / currentTotal) * 100).toFixed(1), color: "#0d9488" },
        { name: "Logistics & Pickup", value: logisticsTotal, percentage: ((logisticsTotal / currentTotal) * 100).toFixed(1), color: "#0284c7" },
        { name: "Silo & Cold Storage", value: storageTotal, percentage: ((storageTotal / currentTotal) * 100).toFixed(1), color: "#f59e0b" },
        { name: "Others (SLA/Insure)", value: othersTotal, percentage: ((othersTotal / currentTotal) * 100).toFixed(1), color: "#64748b" }
      ]
    };
  }, [filteredSpendData]);

  const savingsMetrics = useMemo(() => {
    let totalTons = 0;
    let totalSavings = 0;
    let totalPurchaseCost = 0;
    let totalMarketCost = 0;

    filteredSavingsData.forEach((d) => {
      totalTons += d.tons;
      totalSavings += d.savings;
      totalPurchaseCost += (d.purchasePrice * d.tons);
      totalMarketCost += (d.marketPrice * d.tons);
    });

    const avgTonsPerMonth = filteredSavingsData.length > 0 ? totalTons / filteredSavingsData.length : 0;
    const avgSavingsPerMonth = filteredSavingsData.length > 0 ? totalSavings / filteredSavingsData.length : 0;
    const avgDiscountAchieved = totalMarketCost > 0 ? ((totalMarketCost - totalPurchaseCost) / totalMarketCost) * 100 : 0;

    return {
      totalTons: totalTons.toFixed(1),
      totalSavingsFormatted: totalSavings.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }),
      avgTonsPerMonth: avgTonsPerMonth.toFixed(1),
      avgSavingsPerMonth: avgSavingsPerMonth.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }),
      avgDiscountAchieved: avgDiscountAchieved.toFixed(1)
    };
  }, [filteredSavingsData]);

  const handleExportCSV = () => {
    if (activeTab === "spending") {
      alert("✓ Sourcing Spend Audit Log compiled and downloaded successfully as 'AgriConnect_Buyer_Spend_2026.csv'.\n\nColumns: Fiscal Period, Crops Procurement (₹), Logistics (₹), Storage Lockers (₹), Ancillary Fees (₹).");
    } else {
      alert("✓ Sourcing Savings & Volume Log compiled and downloaded successfully as 'AgriConnect_Buyer_Savings_2026.csv'.\n\nColumns: Fiscal Period, Procured Volume (Tons), Our Contract Price (₹), Spot Market Price (₹), Variance Saved (₹).");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Upper Title, Description & Main Sub-tab Selector */}
      <div className="bg-white border border-slate-150 rounded-3xl p-5 shadow-3xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
            📊 Strategic Procurement & Savings Analytics
          </h3>
          <p className="text-[10px] text-slate-400 font-medium leading-normal mt-1 max-w-2xl">
            Real-time financial transparency on raw crop volumes, freight logistics routing, savings vs prevailing spot market rates, and cold-silo storage investments.
          </p>
        </div>

        {/* Outer Tab Toggle */}
        <div className="flex flex-wrap bg-slate-50 border border-slate-150 p-1 rounded-2xl w-full md:w-auto gap-0.5">
          <button
            onClick={() => setActiveTab("spending")}
            className={`px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "spending"
                ? "bg-white text-teal-700 shadow-3xs border border-slate-150"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            💳 9.1 Sourcing Spend
          </button>
          <button
            onClick={() => setActiveTab("savings")}
            className={`px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "savings"
                ? "bg-white text-teal-700 shadow-3xs border border-slate-150"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            🛡️ 9.2 Savings & Volume
          </button>
          <button
            onClick={() => setActiveTab("suppliers")}
            className={`px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "suppliers"
                ? "bg-white text-teal-700 shadow-3xs border border-slate-150"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            🏅 9.3 Suppliers
          </button>
          <button
            onClick={() => setActiveTab("recommendations")}
            className={`px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "recommendations"
                ? "bg-white text-teal-700 shadow-3xs border border-slate-150"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            ✨ 9.4 AI Advice
          </button>
        </div>
      </div>

      {/* Interactive Filters Panel Row */}
      <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Current View:</span>
          <span className="bg-teal-50 text-teal-800 border border-teal-200 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
            {activeTab === "spending" && "📊 Sourcing Spend & Category Breakdown"}
            {activeTab === "savings" && "📈 Market price savings & Quantity audit"}
            {activeTab === "suppliers" && "🏅 Supplier Quality, Value & Rating Breakdowns"}
            {activeTab === "recommendations" && "✨ AI Optimal Suppliers & Crops recommendations"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 bg-white border border-slate-150 rounded-xl px-2.5 py-1.5">
            <Filter className="h-3 w-3 text-slate-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as "12" | "6" | "3")}
              className="text-[10px] font-black text-slate-600 uppercase tracking-wider bg-transparent border-none focus:outline-none cursor-pointer"
            >
              <option value="12">Last 12 Months</option>
              <option value="6">Last 6 Months</option>
              <option value="3">Last 3 Months</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-slate-150 rounded-xl px-2.5 py-1.5">
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="text-[10px] font-black text-slate-600 uppercase tracking-wider bg-transparent border-none focus:outline-none cursor-pointer"
            >
              <option value="All Crops">All Crops</option>
              <option value="Premium Basmati Rice">Basmati Rice</option>
              <option value="Soft Red Winter Wheat">Winter Wheat</option>
              <option value="Organic Soybeans">Soybeans</option>
            </select>
          </div>

          <button
            onClick={handleExportCSV}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-3xs"
          >
            <Download className="h-3 w-3" />
            Export Audit
          </button>
        </div>
      </div>

      {/* Conditional Rendering of Tabs */}
      {activeTab === "spending" && (
        <>
          {/* 9.1 SPENDING ANALYTICS PANEL */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* KPI 1: Cumulative Sourcing Spend */}
            <div className="bg-white border border-slate-150 p-5 rounded-3xl shadow-3xs space-y-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Total Sourcing Spend</span>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-mono font-black text-slate-900 tracking-tight">{spendMetrics.currentTotal}</p>
                <span className={`text-[10px] font-black flex items-center gap-0.5 ${spendMetrics.isIncrease ? "text-rose-500" : "text-emerald-500"}`}>
                  {spendMetrics.isIncrease ? (
                    <>
                      <TrendingUp className="h-3 w-3" /> +{spendMetrics.percentChange}%
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-3 w-3" /> {spendMetrics.percentChange}%
                    </>
                  )}
                </span>
              </div>
              <p className="text-[9px] text-slate-400">
                vs. {spendMetrics.prevTotal} in previous period
              </p>
            </div>

            {/* KPI 2: Average Monthly Procurement */}
            <div className="bg-white border border-slate-150 p-5 rounded-3xl shadow-3xs space-y-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Monthly Avg Sourcing</span>
              <p className="text-xl font-mono font-black text-slate-900 tracking-tight">{spendMetrics.avgMonthlySpend}</p>
              <div className="flex items-center gap-1">
                <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md">
                  ✓ Optimal
                </span>
                <span className="text-[9px] text-slate-400">Stable liquidity reserve</span>
              </div>
            </div>

            {/* KPI 3: Mean Sourcing Cost per Metric Ton */}
            <div className="bg-white border border-slate-150 p-5 rounded-3xl shadow-3xs space-y-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Mean Cost / Ton (Avg)</span>
              <p className="text-xl font-mono font-black text-slate-900 tracking-tight">₹42,500 <span className="text-[10px] text-slate-400 font-normal">/ MT</span></p>
              <div className="text-[9px] text-slate-400 flex items-center gap-1">
                <TrendingDown className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-600 font-bold">-4.8%</span> compared to open market mandis
              </div>
            </div>

            {/* KPI 4: Direct Sourcing Intermediary Savings */}
            <div className="bg-white border border-slate-150 p-5 rounded-3xl shadow-3xs space-y-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Disintermediation Savings</span>
              <p className="text-xl font-mono font-black text-emerald-600 tracking-tight">₹3,92,400</p>
              <p className="text-[9px] text-slate-400">
                Saved by skipping local brokers via direct farmer contracts
              </p>
            </div>

          </div>

          {/* Main Spending Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Side: 12-Month Sourcing Spend Comparison (Bar Chart) */}
            <div className="lg:col-span-8 bg-white border border-slate-150 rounded-3xl p-5 shadow-3xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <BarChart2 className="h-4 w-4 text-teal-600" />
                    Monthly Spend Trend & Previous Year Benchmark
                  </h4>
                  <p className="text-[9px] text-slate-400 font-medium">
                    Shows comparative spending on all procurements (expressed in thousands ₹) over the selected chronological timeline.
                  </p>
                </div>
                
                {/* Custom Legend */}
                <div className="flex items-center gap-4 text-[9px] font-black uppercase">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-teal-600" />
                    <span className="text-slate-700">Current Year</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-slate-300" />
                    <span className="text-slate-500">Previous Year</span>
                  </div>
                </div>
              </div>

              {/* Recharts Bar Chart Container */}
              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={filteredSpendData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="month" 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700, fontFamily: 'monospace' }} 
                    />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(val) => `₹${val}k`}
                      tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700, fontFamily: 'monospace' }} 
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const cur = payload[0].value as number;
                          const prev = payload[1]?.value as number;
                          const diff = prev ? (((cur - prev) / prev) * 100).toFixed(1) : "0";
                          const isUp = parseFloat(diff) > 0;
                          return (
                            <div className="bg-slate-900 text-white rounded-xl p-3 border border-slate-800 shadow-lg text-[10px] space-y-1.5">
                              <p className="font-black text-teal-400 uppercase tracking-widest border-b border-slate-800 pb-1">
                                {payload[0].payload.month} Spend
                              </p>
                              <div className="space-y-0.5 font-mono">
                                <p className="flex justify-between gap-6">
                                  <span className="text-slate-400">Current:</span> 
                                  <span className="font-bold text-white">₹{(cur * 1000).toLocaleString("en-IN")}</span>
                                </p>
                                <p className="flex justify-between gap-6">
                                  <span className="text-slate-400">Prev Year:</span> 
                                  <span className="font-bold text-slate-300">₹{(prev * 1000).toLocaleString("en-IN")}</span>
                                </p>
                                <p className="flex justify-between gap-6 pt-1 border-t border-slate-800 text-[9px]">
                                  <span>Variance:</span>
                                  <span className={isUp ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                                    {isUp ? "▲" : "▼"} {diff}%
                                  </span>
                                </p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="currentYear" 
                      fill="#0d9488" 
                      radius={[4, 4, 0, 0]} 
                      maxBarSize={32}
                    />
                    <Bar 
                      dataKey="previousYear" 
                      fill="#cbd5e1" 
                      radius={[4, 4, 0, 0]} 
                      maxBarSize={32}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>

            {/* Right Side: Sourcing Category Breakdown (Pie Chart) */}
            <div className="lg:col-span-4 bg-white border border-slate-150 rounded-3xl p-5 shadow-3xs flex flex-col justify-between min-h-[380px]">
              
              <div className="border-b border-slate-100 pb-3">
                <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <PieIcon className="h-4 w-4 text-teal-600" />
                  Category Investment Distribution
                </h4>
                <p className="text-[9px] text-slate-400 font-medium">
                  Percentage-wise breakdown of procurement, logistics transit, storage holding, and secondary transactional costs.
                </p>
              </div>

              {/* Pie Chart Representation */}
              <div className="h-48 w-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={spendMetrics.categories}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                      onMouseEnter={(_, index) => setActiveSegment(index)}
                      onMouseLeave={() => setActiveSegment(null)}
                    >
                      {spendMetrics.categories.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color} 
                          opacity={activeSegment === null || activeSegment === index ? 1 : 0.65}
                          className="transition-all duration-200 focus:outline-none"
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="bg-slate-900 text-white rounded-xl p-2.5 border border-slate-800 shadow-lg text-[9px] font-mono">
                              <p className="font-black text-teal-400 uppercase tracking-widest">{item.name}</p>
                              <p className="mt-1">Value: ₹{(item.value * 1000).toLocaleString("en-IN")}</p>
                              <p className="font-bold text-white">Share: {item.percentage}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Centered context label */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Sourcing</span>
                  <span className="text-base font-mono font-extrabold text-slate-800">
                    ₹{(spendMetrics.rawCurrentTotal).toFixed(0)}k
                  </span>
                </div>
              </div>

              {/* Custom Interactive Legend Section */}
              <div className="space-y-1.5 pt-3 border-t border-slate-100">
                {spendMetrics.categories.map((cat, idx) => (
                  <div 
                    key={cat.name}
                    onMouseEnter={() => setActiveSegment(idx)}
                    onMouseLeave={() => setActiveSegment(null)}
                    className={`flex items-center justify-between text-[10px] p-1.5 rounded-lg transition-all cursor-pointer ${
                      activeSegment === idx ? "bg-slate-50 font-bold" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-xs" style={{ backgroundColor: cat.color }} />
                      <span className="text-slate-600 font-medium">{cat.name}</span>
                    </div>
                    <div className="font-mono text-slate-800 flex items-center gap-2">
                      <span>₹{(cat.value).toFixed(0)}k</span>
                      <span className="text-slate-400 text-[9px]">({cat.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

          {/* Sourcing table and Co-Pilot */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Commodity Performance Breakdown Table */}
            <div className="lg:col-span-7 bg-white border border-slate-150 rounded-3xl p-5 shadow-3xs space-y-4">
              <div>
                <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  🌾 Sourcing Volume & Rates by Commodity
                </h4>
                <p className="text-[9px] text-slate-400 font-medium">
                  Granular log of acquired tonnage, contract counts, and market variance per crop class.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[10px] border-collapse">
                  <thead>
                    <tr className="border-b border-slate-150 text-slate-400 uppercase tracking-wider font-bold">
                      <th className="py-2.5 pb-2">Commodity Class</th>
                      <th className="py-2.5 pb-2 text-right">Procured (MT)</th>
                      <th className="py-2.5 pb-2 text-right">Contracts</th>
                      <th className="py-2.5 pb-2 text-right">Spend Allocation</th>
                      <th className="py-2.5 pb-2 text-right">Trend Variance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {CROP_SPEND_DETAIL.map((item) => (
                      <tr key={item.crop} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 font-extrabold text-slate-800">{item.crop}</td>
                        <td className="py-3 text-right font-mono font-semibold text-slate-700">{item.tons.toFixed(1)} MT</td>
                        <td className="py-3 text-right font-mono font-semibold text-slate-700">{item.orders}</td>
                        <td className="py-3 text-right font-mono font-bold text-slate-900">₹{item.amount.toLocaleString("en-IN")}</td>
                        <td className="py-3 text-right">
                          {item.trend === "up" && (
                            <span className="text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                              📈 Rising Rate
                            </span>
                          )}
                          {item.trend === "down" && (
                            <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                              📉 Softening
                            </span>
                          )}
                          {item.trend === "stable" && (
                            <span className="text-slate-600 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                              Stable
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Spend Co-Pilot Insights Section */}
            <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl p-5 border border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div>
                    <span className="text-[8px] font-black text-teal-400 uppercase tracking-widest block">CO-PILOT INSIGHTS</span>
                    <h4 className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                      <Sparkles className="h-4 w-4 text-teal-400" />
                      Sourcing Cost Optimization Protocol
                    </h4>
                  </div>
                  <span className="bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider">
                    ✓ 2 AI Flags
                  </span>
                </div>

                <div className="space-y-3 pt-3">
                  
                  {/* Insight Flag 1 */}
                  <div className="bg-slate-800/60 border border-slate-800 p-3 rounded-2xl space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      <span className="text-[9px] font-black uppercase tracking-wider text-amber-400">Logistics Arbitrage Alert</span>
                    </div>
                    <p className="text-[10px] text-slate-300 leading-normal font-medium">
                      Logistics currently accounts for <span className="text-teal-300 font-bold">18.1% of cumulative spend</span>. High empty-mileage fees observed on Machilipatnam-Delhi routes. Consolidating shipments into 40-ton bulk flats will trim freight outlays by <span className="text-teal-300 font-bold">₹38,000</span>.
                    </p>
                  </div>

                  {/* Insight Flag 2 */}
                  <div className="bg-slate-800/60 border border-slate-800 p-3 rounded-2xl space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400">Direct-Contract Harvest Match</span>
                    </div>
                    <p className="text-[10px] text-slate-300 leading-normal font-medium">
                      Upcoming winter wheat crop in Karnal mandi is projected to yield high volume. Creating advance contracts now will lock in rates <span className="text-emerald-400 font-bold">12% lower than peak season spot bidding</span>.
                    </p>
                  </div>

                </div>
              </div>

              <div className="bg-slate-850/80 border border-slate-800/60 rounded-xl p-2.5 flex items-center justify-between text-[8px] font-mono text-slate-400">
                <span>AGRI_CLEARING_AUDITOR_V2</span>
                <span className="text-teal-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-teal-400" /> SLA SECURE
                </span>
              </div>
            </div>

          </div>
        </>
      )}

      {activeTab === "savings" && (
        <>
          {/* 9.2 SAVINGS ANALYTICS PANEL */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* KPI 1: Total Savings vs Market */}
            <div className="bg-white border border-slate-150 p-5 rounded-3xl shadow-3xs space-y-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Total Saved vs. Market</span>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-mono font-black text-emerald-600 tracking-tight">{savingsMetrics.totalSavingsFormatted}</p>
                <span className="text-[9px] text-emerald-600 font-extrabold bg-emerald-50 px-1.5 py-0.5 rounded-md">
                  Active Profit
                </span>
              </div>
              <p className="text-[9px] text-slate-400">
                Achieved through direct APEDA escrows
              </p>
            </div>

            {/* KPI 2: Average Discount Achieved */}
            <div className="bg-white border border-slate-150 p-5 rounded-3xl shadow-3xs space-y-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Avg. Discount Achieved</span>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-mono font-black text-teal-600 tracking-tight">{savingsMetrics.avgDiscountAchieved}%</p>
                <span className="text-[9px] text-teal-600 font-bold">vs Spot Rate</span>
              </div>
              <p className="text-[9px] text-slate-400">
                Excludes local mandi middleman fees
              </p>
            </div>

            {/* KPI 3: Total Quantity Procured */}
            <div className="bg-white border border-slate-150 p-5 rounded-3xl shadow-3xs space-y-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Total Procured Volume</span>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-mono font-black text-slate-900 tracking-tight">{savingsMetrics.totalTons} MT</p>
                <span className="text-[9px] text-slate-400 font-mono">Tons</span>
              </div>
              <p className="text-[9px] text-slate-400">
                Direct food supply chain routing
              </p>
            </div>

            {/* KPI 4: Average Quantity Per Month */}
            <div className="bg-white border border-slate-150 p-5 rounded-3xl shadow-3xs space-y-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Monthly Avg Volume</span>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-mono font-black text-slate-900 tracking-tight">{savingsMetrics.avgTonsPerMonth} MT</p>
                <span className="text-[9px] text-slate-400">/ month</span>
              </div>
              <p className="text-[9px] text-slate-400 font-mono">
                Stable procurement cadence
              </p>
            </div>

          </div>

          {/* Charts Row for Savings tab */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Purchase Price vs. Prevailing Spot Market Price (Line Chart) */}
            <div className="lg:col-span-8 bg-white border border-slate-150 rounded-3xl p-5 shadow-3xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <LineIcon className="h-4 w-4 text-emerald-600" />
                    Weighted Average Purchase Rate vs. Spot Mandi Index
                  </h4>
                  <p className="text-[9px] text-slate-400 font-medium">
                    Line plot showcasing our optimized contractual procurement rates (₹/MT) against the volatile spot open market pricing.
                  </p>
                </div>
                
                {/* Custom Line Legend */}
                <div className="flex items-center gap-4 text-[9px] font-black uppercase">
                  <div className="flex items-center gap-1.5">
                    <span className="h-0.5 w-4 bg-teal-600 block" />
                    <span className="text-slate-700">Our Rate</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-0.5 w-4 bg-rose-500 block" />
                    <span className="text-rose-600">Spot Market</span>
                  </div>
                </div>
              </div>

              {/* Recharts Line/Area Chart Container */}
              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={filteredSavingsData}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0d9488" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="month" 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700, fontFamily: 'monospace' }} 
                    />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      domain={[35000, 50000]}
                      tickFormatter={(val) => `₹${val/1000}k`}
                      tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700, fontFamily: 'monospace' }} 
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const ourPrice = payload[0].value as number;
                          const marketPrice = payload[1].value as number;
                          const saved = marketPrice - ourPrice;
                          const pct = ((saved / marketPrice) * 100).toFixed(1);
                          return (
                            <div className="bg-slate-900 text-white rounded-xl p-3 border border-slate-800 shadow-lg text-[10px] space-y-1.5">
                              <p className="font-black text-teal-400 uppercase tracking-widest border-b border-slate-800 pb-1">
                                {payload[0].payload.month} Pricing Index
                              </p>
                              <div className="space-y-0.5 font-mono">
                                <p className="flex justify-between gap-6">
                                  <span className="text-slate-400">Our Rate:</span> 
                                  <span className="font-bold text-teal-400">₹{ourPrice.toLocaleString("en-IN")}/MT</span>
                                </p>
                                <p className="flex justify-between gap-6">
                                  <span className="text-slate-400">Spot Market:</span> 
                                  <span className="font-bold text-rose-400">₹{marketPrice.toLocaleString("en-IN")}/MT</span>
                                </p>
                                <p className="flex justify-between gap-6 pt-1 border-t border-slate-800 text-[9px]">
                                  <span>Total Saving:</span>
                                  <span className="text-emerald-400 font-bold">
                                    ₹{payload[0].payload.savings.toLocaleString("en-IN")} ({pct}%)
                                  </span>
                                </p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="purchasePrice" 
                      stroke="#0d9488" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorSavings)" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="marketPrice" 
                      stroke="#f43f5e" 
                      strokeWidth={2.5}
                      strokeDasharray="5 5"
                      dot={{ r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

            </div>

            {/* Procurement Volume Distribution per Month (Bar Chart) */}
            <div className="lg:col-span-4 bg-white border border-slate-150 rounded-3xl p-5 shadow-3xs flex flex-col justify-between min-h-[380px]">
              
              <div className="border-b border-slate-100 pb-3">
                <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  📈 Procurement Volume Trend (MT)
                </h4>
                <p className="text-[9px] text-slate-400 font-medium">
                  Monthly audit of processed agricultural cargo weight in metric tons.
                </p>
              </div>

              {/* Recharts Bar for tons */}
              <div className="h-44 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredSavingsData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="month" 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: '#64748b', fontSize: 8, fontWeight: 700, fontFamily: 'monospace' }} 
                    />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(val) => `${val} MT`}
                      tick={{ fill: '#64748b', fontSize: 8, fontWeight: 700, fontFamily: 'monospace' }} 
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-900 text-white rounded-lg p-2 border border-slate-800 shadow-lg text-[9px] font-mono">
                              <p className="font-black text-teal-400 uppercase">{payload[0].payload.month}</p>
                              <p>Tonnage: <span className="text-white font-bold">{payload[0].value} Metric Tons</span></p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="tons" fill="#0284c7" radius={[3, 3, 0, 0]} maxBarSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-2xl space-y-1">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Cadence Health Assessment</span>
                <p className="text-[10px] text-slate-700 font-medium leading-relaxed">
                  Our current sourcing cadence averages <span className="text-teal-700 font-black">{savingsMetrics.avgTonsPerMonth} MT/month</span>, presenting excellent logistics utilization levels.
                </p>
              </div>

            </div>

          </div>

          {/* 9.2: Best Deals Found (Highlight) & Savings Co-pilot */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Best Deals Found Highlights Table */}
            <div className="lg:col-span-8 bg-white border border-slate-150 rounded-3xl p-5 shadow-3xs space-y-4">
              <div>
                <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-amber-500" />
                  🏆 Best Procurement Deals Found (Highlight Log)
                </h4>
                <p className="text-[9px] text-slate-400 font-medium">
                  Verified high-margin bidding victories or advance contracts yielding maximum variance vs prevailing spot prices.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {BEST_DEALS_HIGHLIGHT.map((deal) => (
                  <div key={deal.id} className="border border-slate-150 hover:border-teal-500 transition-all rounded-2xl p-4 bg-slate-50/50 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] font-mono font-bold text-slate-400">{deal.id}</span>
                        <span className="text-[8px] font-black text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {deal.badge}
                        </span>
                      </div>
                      <h5 className="font-black text-slate-800 text-xs leading-tight mt-1">{deal.crop}</h5>
                      <p className="text-[9px] text-slate-400">Farmer: {deal.farmer}</p>
                    </div>

                    <div className="border-t border-slate-150/80 pt-2.5 space-y-1 text-[10px]">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Our Rate:</span>
                        <span className="font-mono font-black text-slate-800">{deal.purchasedRate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Market Rate:</span>
                        <span className="font-mono font-semibold text-slate-500 line-through">{deal.marketRate}</span>
                      </div>
                      <div className="flex justify-between pt-1.5 border-t border-dashed border-slate-200">
                        <span className="font-bold text-teal-700">Saved:</span>
                        <span className="font-mono font-black text-emerald-600">{deal.totalSaved} ({deal.discount})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Savings Strategy Panel */}
            <div className="lg:col-span-4 bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="border-b border-slate-800 pb-2">
                  <span className="text-[8px] font-black text-teal-400 uppercase tracking-widest block font-mono">ARBITRAGE PROTOCOL</span>
                  <h4 className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                    <Sparkles className="h-4 w-4 text-teal-400" />
                    Savings Optimization Advice
                  </h4>
                </div>

                <p className="text-[10px] text-slate-300 leading-normal font-medium">
                  Procuring direct from the farm gate using <span className="text-teal-400 font-bold">AgriConnect Secure Digital Escrow</span> bypassed traditional mandi taxes and middleman commision fees (ranging from 6% to 8%).
                </p>

                <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 flex items-center gap-2.5">
                  <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg font-mono font-bold text-xs">
                    9.4%
                  </div>
                  <div>
                    <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider block">Average Discount Rate</span>
                    <span className="text-[9px] font-semibold text-slate-200">Exceeds standard buyer industry index of 5.5%</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-850/60 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between text-[8px] font-mono text-slate-400">
                <span>Direct Farmer Contracts Ledger</span>
                <span className="text-teal-400 font-bold uppercase">SECURED</span>
              </div>
            </div>

          </div>
        </>
      )}

      {activeTab === "suppliers" && (
        <div className="space-y-6 animate-fade-in">
          {/* Section 10 KPI bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-150 p-5 rounded-3xl shadow-3xs space-y-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Average Supplier Quality</span>
              <p className="text-xl font-mono font-black text-slate-900 tracking-tight">96.2%</p>
              <p className="text-[9px] text-slate-400">Weighted by transaction volume</p>
            </div>
            <div className="bg-white border border-slate-150 p-5 rounded-3xl shadow-3xs space-y-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Sourcing Network size</span>
              <p className="text-xl font-mono font-black text-teal-700 tracking-tight">24 Farmers</p>
              <p className="text-[9px] text-slate-400">Direct APEDA registered producers</p>
            </div>
            <div className="bg-white border border-slate-150 p-5 rounded-3xl shadow-3xs space-y-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Active Escrow Contracts</span>
              <p className="text-xl font-mono font-black text-slate-900 tracking-tight">12 Lots</p>
              <p className="text-[9px] text-slate-400">Ensuring automated payment clearance</p>
            </div>
            <div className="bg-white border border-slate-150 p-5 rounded-3xl shadow-3xs space-y-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">SLA Rejection Rate</span>
              <p className="text-xl font-mono font-black text-emerald-600 tracking-tight">0.0%</p>
              <p className="text-[9px] text-slate-400">Perfect quality compliance this month</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Suppliers by Quality */}
            <div className="bg-white border border-slate-150 rounded-3xl p-5 shadow-3xs space-y-4">
              <div>
                <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-teal-600" />
                  Top Suppliers by Quality Score
                </h4>
                <p className="text-[9px] text-slate-400 font-medium">
                  Direct producers ranking highest in grade tests, low moisture, and bulk contract compliance.
                </p>
              </div>

              <div className="space-y-3">
                {TOP_SUPPLIERS_QUALITY.map((sup, index) => (
                  <div key={sup.name} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-150 hover:border-teal-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-teal-100 flex items-center justify-center text-teal-800 font-mono font-black text-xs">
                        #{index + 1}
                      </div>
                      <div>
                        <h5 className="text-xs font-black text-slate-800 leading-tight">{sup.name}</h5>
                        <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{sup.crop} • {sup.contracts} Contracts</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono font-black text-slate-900">{sup.score}%</p>
                      <span className="text-[8px] font-black text-slate-400 uppercase block mt-0.5">Quality score</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Suppliers by Value */}
            <div className="bg-white border border-slate-150 rounded-3xl p-5 shadow-3xs space-y-4">
              <div>
                <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-teal-600" />
                  Top Suppliers by Procurement Value
                </h4>
                <p className="text-[9px] text-slate-400 font-medium">
                  Producers with the largest trade footprint based on cumulative invoice payouts.
                </p>
              </div>

              <div className="space-y-3">
                {TOP_SUPPLIERS_VALUE.map((sup) => (
                  <div key={sup.name} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-150 hover:border-teal-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 font-mono font-black text-[10px]">
                        {sup.tons}
                      </div>
                      <div>
                        <h5 className="text-xs font-black text-slate-800 leading-tight">{sup.name}</h5>
                        <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Avg Quality Score: {sup.avgQuality}%</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono font-black text-teal-700">₹{(sup.value / 100000).toFixed(1)} Lakhs</p>
                      <span className="text-[8px] font-black text-slate-400 uppercase block mt-0.5">Value purchased</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Supplier Ratings Breakdown */}
          <div className="bg-white border border-slate-150 rounded-3xl p-5 shadow-3xs space-y-4">
            <div>
              <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                Comprehensive Supplier Rating Distribution (Breakdown per Supplier)
              </h4>
              <p className="text-[9px] text-slate-400 font-medium">
                Consolidated ratings and distribution details based on logistics punctuality, SLA quality adherence, and direct dispute resolutions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {SUPPLIER_RATINGS.map(sup => (
                <div key={sup.name} className="border border-slate-150 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="text-xs font-black text-slate-800 leading-tight">{sup.name}</h5>
                      <span className="text-[9px] text-slate-400">{sup.reviews} trade reviews</span>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold text-amber-800">
                      <Star className="h-3.5 w-3.5 text-amber-600 fill-amber-500" /> {sup.avg}
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-150/85">
                    {/* Five Star Row */}
                    <div className="flex items-center text-[9px] gap-2">
                      <span className="w-8 font-bold text-slate-400">5 star</span>
                      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: `${sup.breakdown.five}%` }} />
                      </div>
                      <span className="w-8 font-mono text-right text-slate-500">{sup.breakdown.five}%</span>
                    </div>
                    {/* Four Star Row */}
                    <div className="flex items-center text-[9px] gap-2">
                      <span className="w-8 font-bold text-slate-400">4 star</span>
                      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: `${sup.breakdown.four}%` }} />
                      </div>
                      <span className="w-8 font-mono text-right text-slate-500">{sup.breakdown.four}%</span>
                    </div>
                    {/* Three Star Row */}
                    <div className="flex items-center text-[9px] gap-2">
                      <span className="w-8 font-bold text-slate-400">3 star</span>
                      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: `${sup.breakdown.three}%` }} />
                      </div>
                      <span className="w-8 font-mono text-right text-slate-500">{sup.breakdown.three}%</span>
                    </div>
                    {/* Two Star Row */}
                    <div className="flex items-center text-[9px] gap-2">
                      <span className="w-8 font-bold text-slate-400">2 star</span>
                      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: `${sup.breakdown.two || 0}%` }} />
                      </div>
                      <span className="w-8 font-mono text-right text-slate-500">{sup.breakdown.two || 0}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "recommendations" && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Recommended Suppliers */}
            <div className="lg:col-span-6 bg-white border border-slate-150 rounded-3xl p-5 shadow-3xs space-y-4">
              <div>
                <span className="text-[8px] font-black text-teal-600 uppercase tracking-widest block font-mono">AI-MATCHING REPORT</span>
                <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                  <Sparkles className="h-4.5 w-4.5 text-teal-600 animate-pulse" />
                  Recommended Suppliers (Optimal Quality & Price)
                </h4>
                <p className="text-[9px] text-slate-400 font-medium">
                  Direct farmers yielding maximum quality output at rates lower than seasonal averages.
                </p>
              </div>

              <div className="space-y-4">
                {RECOMMENDED_SUPPLIERS.map(sup => (
                  <div key={sup.name} className="border border-teal-100 bg-teal-50/20 p-4 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h5 className="text-xs font-black text-slate-800">{sup.name}</h5>
                        <p className="text-[9px] text-slate-500 font-bold mt-0.5 uppercase tracking-wider">{sup.crop}</p>
                      </div>
                      <span className="bg-teal-100 text-teal-850 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                        {sup.score}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 bg-white p-2.5 rounded-xl border border-slate-150 text-[10px]">
                      <div>
                        <span className="text-slate-400 text-[8px] font-black uppercase tracking-wider block font-mono">Tested Quality</span>
                        <span className="font-mono font-bold text-slate-800">{sup.quality} Grade A</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[8px] font-black uppercase tracking-wider block font-mono">Average Rate</span>
                        <span className="font-mono font-bold text-teal-700">{sup.price}</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-600 leading-normal font-medium bg-white/50 p-2 rounded-xl">
                      💡 {sup.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Crops */}
            <div className="lg:col-span-6 bg-white border border-slate-150 rounded-3xl p-5 shadow-3xs space-y-4">
              <div>
                <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest block font-mono">MARKET VALUE INDEX</span>
                <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                  <TrendingUp className="h-4.5 w-4.5 text-emerald-600" />
                  Recommended Crops (Best Value Right Now)
                </h4>
                <p className="text-[9px] text-slate-400 font-medium">
                  Agricultural commodities currently experiencing low spot prices compared to forecast thresholds.
                </p>
              </div>

              <div className="space-y-4">
                {RECOMMENDED_CROPS.map(crop => (
                  <div key={crop.crop} className="border border-slate-150 bg-slate-50 p-4 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center">
                      <h5 className="text-xs font-black text-slate-800">{crop.crop}</h5>
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-150 text-[9px] font-black px-2 py-0.5 rounded-md">
                        Value Index: {crop.valueScore}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[10px] bg-white p-2 rounded-xl border border-slate-150">
                      <div>
                        <span className="text-slate-400 text-[8px] font-black uppercase tracking-wider block font-mono">Mandi Price</span>
                        <span className="font-mono text-slate-500 line-through">{crop.marketRate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[8px] font-black uppercase tracking-wider block font-mono">Direct Price</span>
                        <span className="font-mono font-bold text-slate-800">{crop.contractRate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[8px] font-black uppercase tracking-wider block font-mono">Est. Savings</span>
                        <span className="font-mono font-extrabold text-emerald-600">{crop.discount}</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-600 leading-normal font-medium bg-white/50 p-2 rounded-xl">
                      🎯 {crop.advice}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Harvests with interactive Pre-order buttons */}
          <div className="bg-white border border-slate-150 rounded-3xl p-5 shadow-3xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest block font-mono font-bold">ADVANCE SOURCING CALENDAR</span>
                <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                  📅 Upcoming Harvests (Harvesting in next 7 Days)
                </h4>
                <p className="text-[9px] text-slate-400 font-medium">
                  Pre-order direct-to-farm harvests ahead of bidding, securing first-access allocations.
                </p>
              </div>
              <span className="bg-amber-50 text-amber-800 border border-amber-150 text-[9px] font-black uppercase px-2.5 py-1 rounded-full">
                ⏳ Early Access Escrows Active
              </span>
            </div>

            {preOrderLot && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between animate-fade-in">
                <div className="text-[10px] font-medium">
                  <p className="font-black text-emerald-950 uppercase tracking-wider">✓ FIRST ACCESS ESCROW LOCKED</p>
                  <p className="mt-0.5">We have locked in the pre-order intent for Lot <strong>{preOrderLot}</strong>. The contract is assigned directly to the registered producer.</p>
                </div>
                <button 
                  onClick={() => setPreOrderLot(null)}
                  className="px-2.5 py-1 bg-emerald-700 text-white rounded-lg text-[9px] font-bold uppercase cursor-pointer hover:bg-emerald-850"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingHarvests.map(harv => (
                <div key={harv.id} className="border border-slate-150 rounded-2xl p-4 bg-slate-50/50 flex flex-col justify-between space-y-4 hover:border-amber-400 transition-all">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-mono font-bold text-slate-400">{harv.id}</span>
                      <span className="bg-amber-50 text-amber-700 border border-amber-100 text-[8px] font-black uppercase px-2 py-0.5 rounded-md">
                        {harv.date}
                      </span>
                    </div>
                    <h5 className="font-black text-slate-800 text-xs leading-tight">{harv.crop}</h5>
                    <p className="text-[9px] text-slate-400 font-semibold">Farmer: {harv.farmer} • Region: {harv.region}</p>
                  </div>

                  <div className="border-t border-slate-200/60 pt-3 space-y-3.5">
                    <div className="flex justify-between text-[10px]">
                      <div>
                        <span className="text-[8px] text-slate-400 uppercase font-black block font-mono">Est. Yield</span>
                        <span className="font-mono font-bold text-slate-800">{harv.volume}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] text-slate-400 uppercase font-black block font-mono">Locked Price</span>
                        <span className="font-mono font-bold text-teal-700">{harv.preOrderPrice}</span>
                      </div>
                    </div>

                    {harv.status === "Available" ? (
                      <button
                        onClick={() => {
                          setPreOrderLot(harv.id);
                          setUpcomingHarvests(prev => prev.map(p => p.id === harv.id ? { ...p, status: "Pre-Ordered" } : p));
                          alert(`✓ Pre-order request sent for ${harv.crop} (${harv.id})!\n\nYour first-access lock-in escrow is pending confirmation by producer ${harv.farmer}.`);
                        }}
                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        🌾 Pre-Order & Lock Rate
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1"
                      >
                        ✓ First Access Locked
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
