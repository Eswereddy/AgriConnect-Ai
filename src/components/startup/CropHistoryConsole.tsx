import React, { useState, useMemo } from "react";
import {
  Calendar,
  Sprout,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Download,
  Filter,
  Plus,
  Trash2,
  ChevronDown,
  CheckCircle,
  FileSpreadsheet,
  FileText,
  FileCode,
  Sparkles,
  RefreshCw,
  Info
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { motion, AnimatePresence } from "motion/react";

interface HarvestedCrop {
  id: string;
  farmId: string;
  farmName: string;
  name: string;
  variety: string;
  acreage: number;
  season: "Kharif" | "Rabi" | "Zaid";
  year: number;
  yieldPerAcre: number; // tons per acre
  totalYield: number; // tons
  pricePerTon: number; // ₹ per ton
  revenue: number; // ₹
  expensePerAcre: number; // ₹ per acre
  expenses: number; // ₹
  profit: number; // ₹
  harvestDate: string;
}

interface CropHistoryConsoleProps {
  farms: Array<{ id: string; name: string }>;
  selectedFarmId: string;
}

// Pre-seeded high-quality harvested crop history
const INITIAL_HARVEST_HISTORY: HarvestedCrop[] = [
  {
    id: "h-1",
    farmId: "farm-1",
    farmName: "Amritsar Digital Grainfield",
    name: "Wheat",
    variety: "HD-2967 Lokwan",
    acreage: 15,
    season: "Rabi",
    year: 2023,
    yieldPerAcre: 2.1,
    totalYield: 31.5,
    pricePerTon: 21250,
    revenue: 669375,
    expensePerAcre: 18000,
    expenses: 270000,
    profit: 399375,
    harvestDate: "2023-04-15"
  },
  {
    id: "h-2",
    farmId: "farm-1",
    farmName: "Amritsar Digital Grainfield",
    name: "Rice Paddy",
    variety: "Pusa Basmati 1121",
    acreage: 15,
    season: "Kharif",
    year: 2023,
    yieldPerAcre: 2.4,
    totalYield: 36.0,
    pricePerTon: 38000,
    revenue: 1368000,
    expensePerAcre: 24000,
    expenses: 360000,
    profit: 1008000,
    harvestDate: "2023-10-25"
  },
  {
    id: "h-3",
    farmId: "farm-1",
    farmName: "Amritsar Digital Grainfield",
    name: "Wheat",
    variety: "HD-3086 Co-Sow",
    acreage: 15,
    season: "Rabi",
    year: 2024,
    yieldPerAcre: 2.3,
    totalYield: 34.5,
    pricePerTon: 22750,
    revenue: 784875,
    expensePerAcre: 19000,
    expenses: 285000,
    profit: 499875,
    harvestDate: "2024-04-18"
  },
  {
    id: "h-4",
    farmId: "farm-1",
    farmName: "Amritsar Digital Grainfield",
    name: "Soybean",
    variety: "JS 335 Organic",
    acreage: 12,
    season: "Kharif",
    year: 2024,
    yieldPerAcre: 1.1,
    totalYield: 13.2,
    pricePerTon: 46000,
    revenue: 607200,
    expensePerAcre: 14000,
    expenses: 168000,
    profit: 439200,
    harvestDate: "2024-09-30"
  },
  {
    id: "h-5",
    farmId: "farm-1",
    farmName: "Amritsar Digital Grainfield",
    name: "Moong Dal",
    variety: "SML 668 Nitric",
    acreage: 10,
    season: "Zaid",
    year: 2024,
    yieldPerAcre: 0.6,
    totalYield: 6.0,
    pricePerTon: 72000,
    revenue: 432000,
    expensePerAcre: 9500,
    expenses: 95000,
    profit: 337000,
    harvestDate: "2024-06-12"
  },
  {
    id: "h-6",
    farmId: "farm-1",
    farmName: "Amritsar Digital Grainfield",
    name: "Wheat",
    variety: "DBW 187 Karan Vandana",
    acreage: 18,
    season: "Rabi",
    year: 2025,
    yieldPerAcre: 2.6,
    totalYield: 46.8,
    pricePerTon: 24000,
    revenue: 1123200,
    expensePerAcre: 20500,
    expenses: 369000,
    profit: 754200,
    harvestDate: "2025-04-10"
  },
  {
    id: "h-7",
    farmId: "farm-1",
    farmName: "Amritsar Digital Grainfield",
    name: "Rice Paddy",
    variety: "PR 126 Medium",
    acreage: 18,
    season: "Kharif",
    year: 2025,
    yieldPerAcre: 2.7,
    totalYield: 48.6,
    pricePerTon: 41000,
    revenue: 1992600,
    expensePerAcre: 26000,
    expenses: 468000,
    profit: 1524600,
    harvestDate: "2025-10-28"
  },
  {
    id: "h-8",
    farmId: "farm-2",
    farmName: "Ludhiana Precision Acres",
    name: "Wheat",
    variety: "PBW 725 High-Res",
    acreage: 12,
    season: "Rabi",
    year: 2024,
    yieldPerAcre: 2.2,
    totalYield: 26.4,
    pricePerTon: 22750,
    revenue: 600600,
    expensePerAcre: 18500,
    expenses: 222000,
    profit: 378600,
    harvestDate: "2024-04-22"
  },
  {
    id: "h-9",
    farmId: "farm-2",
    farmName: "Ludhiana Precision Acres",
    name: "Maize",
    variety: "DeKalb 9108",
    acreage: 12,
    season: "Kharif",
    year: 2024,
    yieldPerAcre: 3.5,
    totalYield: 42.0,
    pricePerTon: 19500,
    revenue: 819000,
    expensePerAcre: 16000,
    expenses: 192000,
    profit: 627000,
    harvestDate: "2024-10-05"
  },
  {
    id: "h-10",
    farmId: "farm-2",
    farmName: "Ludhiana Precision Acres",
    name: "Wheat",
    variety: "DBW 222 Super-Seed",
    acreage: 15,
    season: "Rabi",
    year: 2025,
    yieldPerAcre: 2.5,
    totalYield: 37.5,
    pricePerTon: 24000,
    revenue: 900000,
    expensePerAcre: 20000,
    expenses: 300000,
    profit: 600000,
    harvestDate: "2025-04-12"
  }
];

export default function CropHistoryConsole({ farms, selectedFarmId }: CropHistoryConsoleProps) {
  const [historyList, setHistoryList] = useState<HarvestedCrop[]>(() => {
    const saved = localStorage.getItem("crop_harvest_history");
    return saved ? JSON.parse(saved) : INITIAL_HARVEST_HISTORY;
  });

  // Modal form toggle
  const [isLogFormOpen, setIsLogFormOpen] = useState(false);

  // Filter and Sorting state
  const [selectedFarmFilter, setSelectedFarmFilter] = useState<string>("all");
  const [selectedSeasonFilter, setSelectedSeasonFilter] = useState<string>("all");
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>("all");
  const [seasonSortOrder, setSeasonSortOrder] = useState<"asc" | "desc" | "none">("none");
  const [yearSortOrder, setYearSortOrder] = useState<"asc" | "desc">("desc");

  // Log Form State
  const [cropName, setCropName] = useState("Wheat");
  const [cropVariety, setCropVariety] = useState("");
  const [logAcreage, setLogAcreage] = useState("");
  const [logSeason, setLogSeason] = useState<"Kharif" | "Rabi" | "Zaid">("Rabi");
  const [logYear, setLogYear] = useState("2026");
  const [yieldPerAc, setYieldPerAc] = useState("");
  const [pricePerT, setPricePerT] = useState("");
  const [expensePerAc, setExpensePerAc] = useState("");
  const [harvestDateInput, setHarvestDateInput] = useState("2026-04-10");

  const saveHistory = (newList: HarvestedCrop[]) => {
    setHistoryList(newList);
    localStorage.setItem("crop_harvest_history", JSON.stringify(newList));
  };

  // Unique seasons & years for dropdown filters
  const availableYears = useMemo(() => {
    const yearsSet = new Set<number>();
    historyList.forEach((h) => yearsSet.add(h.year));
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [historyList]);

  // Log new harvest submit
  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropVariety || !logAcreage || !yieldPerAc || !pricePerT || !expensePerAc) return;

    const acreageVal = parseFloat(logAcreage) || 0;
    const yieldPerAcVal = parseFloat(yieldPerAc) || 0;
    const pricePerTonVal = parseFloat(pricePerT) || 0;
    const expensePerAcVal = parseFloat(expensePerAc) || 0;
    const yearVal = parseInt(logYear) || 2026;

    const totalYieldVal = acreageVal * yieldPerAcVal;
    const revenueVal = totalYieldVal * pricePerTonVal;
    const expensesVal = acreageVal * expensePerAcVal;
    const profitVal = revenueVal - expensesVal;

    const matchedFarmObj = farms.find((f) => f.id === selectedFarmId) || farms[0];

    const newRecord: HarvestedCrop = {
      id: `h-logged-${Date.now()}`,
      farmId: selectedFarmId,
      farmName: matchedFarmObj?.name || "Managed Landholding",
      name: cropName,
      variety: cropVariety,
      acreage: acreageVal,
      season: logSeason,
      year: yearVal,
      yieldPerAcre: yieldPerAcVal,
      totalYield: parseFloat(totalYieldVal.toFixed(2)),
      pricePerTon: pricePerTonVal,
      revenue: Math.round(revenueVal),
      expensePerAcre: expensePerAcVal,
      expenses: Math.round(expensesVal),
      profit: Math.round(profitVal),
      harvestDate: harvestDateInput
    };

    const updated = [newRecord, ...historyList];
    saveHistory(updated);

    // Dispatch automatic logging event
    window.dispatchEvent(
      new CustomEvent("farmActivityLogged", {
        detail: {
          type: "Harvest Completed",
          description: `Harvest completed for ${cropName} (${cropVariety}) on ${acreageVal} acres. Total yield: ${totalYieldVal.toFixed(2)} tons.`,
          date: harvestDateInput,
          cost: Math.round(expensesVal)
        }
      })
    );

    setIsLogFormOpen(false);

    // reset fields
    setCropVariety("");
    setLogAcreage("");
    setYieldPerAc("");
    setPricePerT("");
    setExpensePerAc("");
  };

  const handleDeleteRecord = (id: string) => {
    const updated = historyList.filter((h) => h.id !== id);
    saveHistory(updated);
  };

  // Filtered and Sorted History list
  const filteredAndSortedList = useMemo(() => {
    let result = [...historyList];

    // 1. Apply Filters
    if (selectedFarmFilter !== "all") {
      result = result.filter((h) => h.farmId === selectedFarmFilter);
    }
    if (selectedSeasonFilter !== "all") {
      result = result.filter((h) => h.season === selectedSeasonFilter);
    }
    if (selectedYearFilter !== "all") {
      result = result.filter((h) => h.year.toString() === selectedYearFilter);
    }

    // 2. Apply Sorting
    // Primary sorting: Year
    result.sort((a, b) => {
      if (yearSortOrder === "asc") {
        return a.year - b.year;
      } else {
        return b.year - a.year;
      }
    });

    // Secondary sorting: Season if specified
    if (seasonSortOrder !== "none") {
      const seasonWeights = { Kharif: 1, Rabi: 2, Zaid: 3 };
      result.sort((a, b) => {
        const weightA = seasonWeights[a.season] || 0;
        const weightB = seasonWeights[b.season] || 0;
        if (seasonSortOrder === "asc") {
          return weightA - weightB;
        } else {
          return weightB - weightA;
        }
      });
    }

    return result;
  }, [historyList, selectedFarmFilter, selectedSeasonFilter, selectedYearFilter, seasonSortOrder, yearSortOrder]);

  // Aggregate Metrics based on filtered list
  const metrics = useMemo(() => {
    let totalYield = 0;
    let totalRevenue = 0;
    let totalExpenses = 0;
    let totalProfit = 0;
    let totalAcreage = 0;

    filteredAndSortedList.forEach((h) => {
      totalYield += h.totalYield;
      totalRevenue += h.revenue;
      totalExpenses += h.expenses;
      totalProfit += h.profit;
      totalAcreage += h.acreage;
    });

    const averageYieldPerAcre = totalAcreage > 0 ? totalYield / totalAcreage : 0;

    return {
      totalYield,
      totalRevenue,
      totalExpenses,
      totalProfit,
      averageYieldPerAcre,
      totalAcreage
    };
  }, [filteredAndSortedList]);

  // Chart Data: Year-over-Year Yield & Financial Trends (grouped by Year)
  const chartData = useMemo(() => {
    const dataByYear: { [year: number]: { year: number; yield: number; revenue: number; expenses: number; profit: number } } = {};

    historyList.forEach((h) => {
      if (!dataByYear[h.year]) {
        dataByYear[h.year] = { year: h.year, yield: 0, revenue: 0, expenses: 0, profit: 0 };
      }
      dataByYear[h.year].yield += h.totalYield;
      dataByYear[h.year].revenue += h.revenue;
      dataByYear[h.year].expenses += h.expenses;
      dataByYear[h.year].profit += h.profit;
    });

    return Object.values(dataByYear).sort((a, b) => a.year - b.year);
  }, [historyList]);

  // Export functions (CSV, PDF mock-visual layout, Excel)
  const handleExportCSV = () => {
    const headers = ["ID", "Farm Name", "Crop Name", "Variety", "Acreage (Ac)", "Season", "Year", "Yield per Acre (T)", "Total Yield (T)", "Price per Ton (INR)", "Total Revenue (INR)", "Expense per Acre (INR)", "Total Expenses (INR)", "Net Profit (INR)", "Harvest Date"];
    const rows = filteredAndSortedList.map((h) => [
      h.id,
      `"${h.farmName}"`,
      h.name,
      h.variety,
      h.acreage,
      h.season,
      h.year,
      h.yieldPerAcre,
      h.totalYield,
      h.pricePerTon,
      h.revenue,
      h.expensePerAcre,
      h.expenses,
      h.profit,
      h.harvestDate
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `agri_twin_harvest_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    // Basic Excel-ready tab separated file download with XLS extension
    const headers = ["ID", "Farm Name", "Crop Name", "Variety", "Acreage", "Season", "Year", "Yield/Acre", "Total Yield", "Price/Ton", "Revenue", "Expense/Acre", "Expenses", "Profit", "Harvest Date"];
    const rows = filteredAndSortedList.map((h) => [
      h.id,
      h.farmName,
      h.name,
      h.variety,
      h.acreage,
      h.season,
      h.year,
      h.yieldPerAcre,
      h.totalYield,
      h.pricePerTon,
      h.revenue,
      h.expensePerAcre,
      h.expenses,
      h.profit,
      h.harvestDate
    ]);

    const content = [headers.join("\t"), ...rows.map(e => e.join("\t"))].join("\n");
    const blob = new Blob([content], { type: "application/vnd.ms-excel" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `agri_twin_harvest_excel_${Date.now()}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    // Generate an beautiful printable summary window
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to download/print the PDF history report!");
      return;
    }

    const htmlContent = `
      <html>
        <head>
          <title>Agri-Twin Intelligent Harvest Ledger Report</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #334155; padding: 30px; line-height: 1.5; }
            h1 { color: #047857; margin-bottom: 5px; font-size: 24px; }
            h2 { color: #64748b; font-size: 14px; margin-top: 0; margin-bottom: 25px; border-b: 1px solid #e2e8f0; padding-bottom: 10px; }
            .metrics { display: flex; gap: 15px; margin-bottom: 30px; }
            .metric-card { flex: 1; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; background: #f8fafc; }
            .metric-card span { font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: bold; display: block; }
            .metric-card strong { font-size: 18px; color: #0f172a; display: block; margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
            th { background-color: #f1f5f9; color: #475569; text-transform: uppercase; font-size: 10px; }
            tr:nth-child(even) { background-color: #f8fafc; }
            .footer { margin-top: 50px; font-size: 10px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <h1>Agri-Twin Intelligent Harvest &amp; P&amp;L Report</h1>
          <h2>Generated on: ${new Date().toLocaleDateString()} | User Email: jakkireddyeswarreddy@gmail.com</h2>
          
          <div class="metrics">
            <div class="metric-card">
              <span>Total Harvested Yield</span>
              <strong>${metrics.totalYield.toFixed(2)} Tons</strong>
            </div>
            <div class="metric-card">
              <span>Gross Sales Revenue</span>
              <strong>₹${metrics.totalRevenue.toLocaleString()}</strong>
            </div>
            <div class="metric-card">
              <span>Production Expenses</span>
              <strong>₹${metrics.totalExpenses.toLocaleString()}</strong>
            </div>
            <div class="metric-card">
              <span>Net Agronomic Profit</span>
              <strong>₹${metrics.totalProfit.toLocaleString()}</strong>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Season</th>
                <th>Crop Type</th>
                <th>Variety</th>
                <th>Acres</th>
                <th>Yield/Ac (T)</th>
                <th>Total Yield (T)</th>
                <th>Revenue</th>
                <th>Expenses</th>
                <th>Profit</th>
              </tr>
            </thead>
            <tbody>
              ${filteredAndSortedList.map(h => `
                <tr>
                  <td><strong>${h.year}</strong></td>
                  <td>${h.season}</td>
                  <td><strong>${h.name}</strong></td>
                  <td>${h.variety}</td>
                  <td>${h.acreage} Ac</td>
                  <td>${h.yieldPerAcre} T</td>
                  <td>${h.totalYield} T</td>
                  <td>₹${h.revenue.toLocaleString()}</td>
                  <td>₹${h.expenses.toLocaleString()}</td>
                  <td style="color: ${h.profit >= 0 ? '#15803d' : '#b91c1c'}; font-weight: bold;">₹${h.profit.toLocaleString()}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div class="footer">
            Agri-Twin Sovereign Web Management Platform | Verification Secure Ledger
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div id="crop-history-suite" className="space-y-6">
      
      {/* HEADER SECTION WITH FILTER REGISTERS */}
      <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between bg-slate-50 border border-slate-200 p-5 rounded-2xl">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Sprout className="h-5 w-5 text-emerald-600 animate-pulse" />
            Historic Harvest Register &amp; P&amp;L Analysis
          </h2>
          <p className="text-slate-400 text-[10px]">Analyze historic crop yields, compare year-over-year production metrics, and audit net cash earnings per acre.</p>
        </div>

        <div className="flex flex-wrap gap-2.5 items-center w-full xl:w-auto">
          {/* Farm filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl shrink-0 text-xs text-slate-700">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedFarmFilter}
              onChange={(e) => setSelectedFarmFilter(e.target.value)}
              className="bg-transparent font-semibold focus:outline-none cursor-pointer text-[11px]"
            >
              <option value="all">All Farm Holdings</option>
              {farms.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          {/* Season Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl shrink-0 text-xs text-slate-700">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedSeasonFilter}
              onChange={(e) => setSelectedSeasonFilter(e.target.value)}
              className="bg-transparent font-semibold focus:outline-none cursor-pointer text-[11px]"
            >
              <option value="all">All Seasons</option>
              <option value="Kharif">Kharif (Monsoon)</option>
              <option value="Rabi">Rabi (Winter)</option>
              <option value="Zaid">Zaid (Summer)</option>
            </select>
          </div>

          {/* Year Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl shrink-0 text-xs text-slate-700">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedYearFilter}
              onChange={(e) => setSelectedYearFilter(e.target.value)}
              className="bg-transparent font-semibold focus:outline-none cursor-pointer text-[11px]"
            >
              <option value="all">All Years</option>
              {availableYears.map((y) => (
                <option key={y} value={y.toString()}>{y}</option>
              ))}
            </select>
          </div>

          {/* Action buttons */}
          <button
            onClick={() => setIsLogFormOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm ml-auto cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Log Harvest
          </button>
        </div>
      </div>

      {/* METRICS ROW CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-1">
          <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Total Harvested Yield</span>
          <span className="text-lg font-black text-slate-800 block">{metrics.totalYield.toFixed(1)} Tons</span>
          <span className="text-[10px] text-slate-500 font-semibold block">Across {metrics.totalAcreage.toFixed(0)} cultivated Ac</span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-1">
          <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Total Sales Revenue</span>
          <span className="text-lg font-black text-emerald-700 block">₹{metrics.totalRevenue.toLocaleString()}</span>
          <span className="text-[10px] text-emerald-600/80 font-semibold flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" />
            Gross Farm Income
          </span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-1">
          <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Production Expenses</span>
          <span className="text-lg font-black text-slate-800 block">₹{metrics.totalExpenses.toLocaleString()}</span>
          <span className="text-[10px] text-rose-500 font-semibold flex items-center gap-0.5">
            <TrendingDown className="h-3 w-3" />
            Seed, Water, Rigs
          </span>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-1">
          <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Net Farm Profit</span>
          <span className={`text-lg font-black block ${metrics.totalProfit >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            ₹{metrics.totalProfit.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500 font-semibold block">
            {(metrics.totalRevenue > 0 ? (metrics.totalProfit / metrics.totalRevenue) * 100 : 0).toFixed(1)}% margin
          </span>
        </div>

        {/* Metric 5 */}
        <div className="col-span-2 md:col-span-1 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl p-4 shadow-xs space-y-1">
          <span className="text-[9px] uppercase font-bold text-emerald-100 block tracking-wider">Average Yield/Acre</span>
          <span className="text-lg font-black block">{metrics.averageYieldPerAcre.toFixed(2)} Tons/Ac</span>
          <span className="text-[10px] text-emerald-100/90 font-medium block">Region base standard: 1.8T</span>
        </div>
      </div>

      {/* CHARTS CONTAINER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* GRAPH 1: Year-over-Year Yield Comparison */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-2xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-150 pb-3">
            <div>
              <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-tight">Year-over-Year Crop Yield comparison</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Visualize aggregated harvest volumes in metric tons across multiple seasons.</p>
            </div>
            <span className="text-[9px] bg-slate-100 text-slate-600 font-black px-2 py-0.5 rounded-md uppercase">Metric Tons</span>
          </div>

          <div className="h-[230px] w-full text-xs font-semibold">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }}
                    labelFormatter={(label) => `Season Year: ${label}`}
                  />
                  <Legend iconType="circle" />
                  <Bar dataKey="yield" name="Total Yield (Tons)" fill="#10b981" radius={[4, 4, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">No chart data generated.</div>
            )}
          </div>
        </div>

        {/* GRAPH 2: Revenue vs Expense Trends */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-2xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-150 pb-3">
            <div>
              <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-tight">Revenue vs Production Expense trends</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Track multi-year financial cash flow, comparing inputs vs gross market earnings.</p>
            </div>
            <span className="text-[9px] bg-emerald-50 text-emerald-700 font-black px-2 py-0.5 rounded-md uppercase">₹ (INR)</span>
          </div>

          <div className="h-[230px] w-full text-xs font-semibold">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }}
                    formatter={(value) => `₹${Number(value).toLocaleString()}`}
                  />
                  <Legend iconType="circle" />
                  <Line type="monotone" dataKey="revenue" name="Sales Revenue" stroke="#059669" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="expenses" name="Operational Expenses" stroke="#f43f5e" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">No chart data generated.</div>
            )}
          </div>
        </div>

      </div>

      {/* CORE EXPORTS & HISTORY TABLE LIST */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
        
        {/* Table Header Controls */}
        <div className="p-5 border-b border-slate-150 bg-slate-50/50 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <div>
            <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-tight">Harvest ledger index &amp; Sort Engine</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Click sort icons to rearrange harvest cycles dynamically by year and seasonal parameters.</p>
          </div>

          {/* Export and Sorting order controls */}
          <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
            {/* Year Sorting Switcher */}
            <button
              onClick={() => setYearSortOrder(prev => prev === "asc" ? "desc" : "asc")}
              className="px-2.5 py-1.5 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
            >
              Year: {yearSortOrder === "asc" ? "⬆️ Asc" : "⬇️ Desc"}
            </button>

            {/* Season Sorting Switcher */}
            <button
              onClick={() => setSeasonSortOrder(prev => prev === "none" ? "asc" : prev === "asc" ? "desc" : "none")}
              className="px-2.5 py-1.5 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
            >
              Season Sort: {seasonSortOrder === "none" ? "None" : seasonSortOrder === "asc" ? "Kharif ➔ Zaid" : "Zaid ➔ Kharif"}
            </button>

            <span className="h-5 w-px bg-slate-300 mx-1 hidden sm:inline" />

            {/* Export Dropdown buttons */}
            <button
              onClick={handleExportCSV}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold rounded-xl flex items-center gap-1 transition-all cursor-pointer"
              title="Download CSV Spreadsheet"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
              CSV
            </button>

            <button
              onClick={handleExportExcel}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold rounded-xl flex items-center gap-1 transition-all cursor-pointer"
              title="Download MS Excel sheet"
            >
              <FileCode className="h-3.5 w-3.5 text-blue-600" />
              Excel
            </button>

            <button
              onClick={handleExportPDF}
              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-xl flex items-center gap-1 transition-all cursor-pointer"
              title="Print beautiful PDF report"
            >
              <FileText className="h-3.5 w-3.5 text-emerald-700" />
              PDF Report
            </button>
          </div>
        </div>

        {/* Real Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-150 text-[10px] text-slate-400 font-black uppercase tracking-wider">
                <th className="p-4">Farm &amp; Crop</th>
                <th className="p-4">Season/Year</th>
                <th className="p-4">Variety Spec</th>
                <th className="p-4 text-right">Acreage</th>
                <th className="p-4 text-right">Yield/Ac</th>
                <th className="p-4 text-right">Total Yield</th>
                <th className="p-4 text-right">Revenue (₹)</th>
                <th className="p-4 text-right">Expenses (₹)</th>
                <th className="p-4 text-right">Net Profit (₹)</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
              {filteredAndSortedList.length > 0 ? (
                filteredAndSortedList.map((h) => {
                  const isProfit = h.profit >= 0;
                  return (
                    <tr key={h.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className="font-extrabold text-slate-800 flex items-center gap-1">
                            <Sprout className="h-3.5 w-3.5 text-emerald-600" />
                            {h.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate max-w-[160px]">{h.farmName}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className={`text-[9.5px] font-extrabold px-1.5 py-0.5 rounded uppercase block w-fit ${
                            h.season === "Kharif" 
                              ? "bg-amber-100 text-amber-800" 
                              : h.season === "Rabi"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-emerald-100 text-emerald-800"
                          }`}>
                            {h.season}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold block">{h.year}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-[11px] font-bold text-slate-700">{h.variety}</span>
                      </td>
                      <td className="p-4 text-right font-bold text-slate-800">{h.acreage} Ac</td>
                      <td className="p-4 text-right font-bold text-slate-700">{h.yieldPerAcre} Tons</td>
                      <td className="p-4 text-right text-emerald-700 font-black">{h.totalYield.toFixed(1)} Tons</td>
                      <td className="p-4 text-right text-slate-800 font-bold">₹{h.revenue.toLocaleString()}</td>
                      <td className="p-4 text-right text-slate-500">₹{h.expenses.toLocaleString()}</td>
                      <td className={`p-4 text-right font-black ${isProfit ? "text-emerald-600" : "text-rose-600"}`}>
                        ₹{h.profit.toLocaleString()}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDeleteRecord(h.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                          title="Delete historical harvest cycle"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="p-12 text-center text-slate-400">
                    <Info className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-sm">No harvest logs found matching selected filters.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Adjust filters or click "Log Harvest" to append a brand-new entry.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* LOG HARVEST MODAL DIALOG */}
      <AnimatePresence>
        {isLogFormOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 max-w-lg w-full space-y-4 text-slate-850"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="h-5 w-5 text-emerald-600" />
                  Log Sown Harvest Completion
                </h3>
                <button
                  onClick={() => setIsLogFormOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-extrabold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleLogSubmit} className="space-y-4 text-xs font-medium text-slate-600">
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Crop Selection */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Crop Type</label>
                    <select
                      value={cropName}
                      onChange={(e) => setCropName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700"
                    >
                      <option value="Wheat">Wheat</option>
                      <option value="Rice Paddy">Rice Paddy</option>
                      <option value="Maize">Maize / Corn</option>
                      <option value="Tomato">Tomato</option>
                      <option value="Soybean">Soybean</option>
                      <option value="Moong Dal">Moong Dal</option>
                      <option value="Cotton">Cotton</option>
                    </select>
                  </div>

                  {/* Seed Variety */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Variety Name *</label>
                    <input
                      type="text"
                      required
                      value={cropVariety}
                      onChange={(e) => setCropVariety(e.target.value)}
                      placeholder="e.g. PBW-343 Deluxe"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700"
                    />
                  </div>

                  {/* Acreage */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Cultivated Acreage *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={logAcreage}
                      onChange={(e) => setLogAcreage(e.target.value)}
                      placeholder="e.g. 12"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700"
                    />
                  </div>

                  {/* Harvest Date */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Harvest Completion Date *</label>
                    <input
                      type="date"
                      required
                      value={harvestDateInput}
                      onChange={(e) => setHarvestDateInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700"
                    />
                  </div>

                  {/* Season */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Crop Cycle Season</label>
                    <select
                      value={logSeason}
                      onChange={(e) => setLogSeason(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700"
                    >
                      <option value="Rabi">Rabi (Winter)</option>
                      <option value="Kharif">Kharif (Monsoon)</option>
                      <option value="Zaid">Zaid (Summer)</option>
                    </select>
                  </div>

                  {/* Year */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Crop Year</label>
                    <select
                      value={logYear}
                      onChange={(e) => setLogYear(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700"
                    >
                      <option value="2026">2026</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                    </select>
                  </div>

                  {/* Yield per acre */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Yield per Acre (Tons) *</label>
                    <input
                      type="number"
                      step="0.05"
                      required
                      value={yieldPerAc}
                      onChange={(e) => setYieldPerAc(e.target.value)}
                      placeholder="e.g. 2.4"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700"
                    />
                  </div>

                  {/* Price per Ton */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Market Price (₹ per Ton) *</label>
                    <input
                      type="number"
                      required
                      value={pricePerT}
                      onChange={(e) => setPricePerT(e.target.value)}
                      placeholder="e.g. 22750"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700"
                    />
                  </div>

                  {/* Production Expense per acre */}
                  <div className="col-span-2">
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Production Expense (₹ per cultivated Acre) *</label>
                    <input
                      type="number"
                      required
                      value={expensePerAc}
                      onChange={(e) => setExpensePerAc(e.target.value)}
                      placeholder="e.g. 18500"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700"
                    />
                  </div>
                </div>

                <div className="pt-3 flex gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsLogFormOpen(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-center uppercase tracking-wider"
                  >
                    Log To History
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
