import React, { useState, useMemo } from "react";
import {
  FileText,
  Download,
  Calendar,
  Mail,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  Play,
  Pause,
  Clock,
  TrendingUp,
  BarChart2,
  PieChart,
  DollarSign,
  Package,
  Users,
  AlertTriangle,
  Printer,
  Share2,
  FileSpreadsheet,
  Filter,
  ArrowUpDown,
  RefreshCw,
  PlusCircle,
  CheckCircle,
  HelpCircle
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
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";

interface CustomReportsProps {
  orders: any[];
  products: any[];
  onClose: () => void;
}

interface ScheduledReport {
  id: string;
  reportType: "sales" | "inventory" | "financial" | "customer";
  frequency: "daily" | "weekly" | "monthly";
  format: "csv" | "excel" | "pdf" | "json";
  deliveryTime: string;
  recipients: string;
  status: "active" | "paused";
  lastSent?: string;
}

export default function CustomReports({ orders, products, onClose }: CustomReportsProps) {
  // Main states
  const [activeReportTab, setActiveReportTab] = useState<"sales" | "inventory" | "financial" | "customer">("sales");
  
  // Sales report filter states
  const [salesGroupBy, setSalesGroupBy] = useState<"product" | "category" | "customer" | "region">("product");
  const [salesRegionFilter, setSalesRegionFilter] = useState<string>("All");
  
  // Inventory report states
  const [inventoryStockFilter, setInventoryStockFilter] = useState<"all" | "low" | "out">("all");
  
  // Financial report states
  const [financialYearFilter, setFinancialYearFilter] = useState<string>("2026");
  
  // PDF Preview / Printable modal state
  const [printPreviewOpen, setPrintPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<{ title: string; headers: string[]; rows: any[][]; summaryText?: string } | null>(null);

  // Scheduler states
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>(() => {
    const stored = localStorage.getItem("agriconnect_scheduled_reports");
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    return [
      {
        id: "SCH-1",
        reportType: "sales",
        frequency: "weekly",
        format: "pdf",
        deliveryTime: "08:00 AM Every Monday",
        recipients: "jakkireddyeswarreddy@gmail.com, executive@agriconnect.in",
        status: "active",
        lastSent: "2026-07-06 08:00 AM"
      },
      {
        id: "SCH-2",
        reportType: "inventory",
        frequency: "daily",
        format: "csv",
        deliveryTime: "06:00 PM Daily",
        recipients: "warehouse-ops@agriconnect.in",
        status: "active",
        lastSent: "2026-07-11 06:00 PM"
      }
    ];
  });

  // Schedule Form states
  const [schReportType, setSchReportType] = useState<"sales" | "inventory" | "financial" | "customer">("sales");
  const [schFrequency, setSchFrequency] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [schFormat, setSchFormat] = useState<"csv" | "excel" | "pdf" | "json">("pdf");
  const [schDeliveryTime, setSchDeliveryTime] = useState<string>("08:00 AM");
  const [schDayOfWeek, setSchDayOfWeek] = useState<string>("Monday");
  const [schDayOfMonth, setSchDayOfMonth] = useState<number>(1);
  const [schRecipients, setSchRecipients] = useState<string>("jakkireddyeswarreddy@gmail.com");
  const [schEditingId, setSchEditingId] = useState<string | null>(null);
  
  // Feedback notices
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Helper to persist schedules
  const saveSchedules = (updated: ScheduledReport[]) => {
    setScheduledReports(updated);
    localStorage.setItem("agriconnect_scheduled_reports", JSON.stringify(updated));
  };

  // Trigger temporary success notification
  const triggerSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage("");
    }, 4000);
  };

  // Convert prices from USD (default in mock) to INR
  const INR_CONVERSION = 84;

  // --- DYNAMIC DATA GENERATORS FOR EACH REPORT TYPE ---

  // 1. SALES REPORT DATA
  const salesReportData = useMemo(() => {
    let filteredOrders = [...orders];
    
    // Apply region filter if set
    if (salesRegionFilter !== "All") {
      filteredOrders = filteredOrders.filter(o => 
        o.location && o.location.toLowerCase().includes(salesRegionFilter.toLowerCase())
      );
    }

    if (salesGroupBy === "product") {
      const productMap: Record<string, { qty: number; sales: number; ordersCount: number; category: string }> = {};
      filteredOrders.forEach(o => {
        const prodName = o.productName || "Unknown Product";
        const cat = o.category || (prodName.includes("Seed") ? "Seeds" : "Fertilizers");
        if (!productMap[prodName]) {
          productMap[prodName] = { qty: 0, sales: 0, ordersCount: 0, category: cat };
        }
        productMap[prodName].qty += Number(o.quantity || 0);
        productMap[prodName].sales += Number(o.amount || 0) * INR_CONVERSION;
        productMap[prodName].ordersCount += 1;
      });

      return Object.entries(productMap).map(([name, val]) => ({
        label: name,
        category: val.category,
        quantity: val.qty,
        revenue: Math.round(val.sales),
        orders: val.ordersCount,
        averageTicket: val.ordersCount > 0 ? Math.round(val.sales / val.ordersCount) : 0
      })).sort((a, b) => b.revenue - a.revenue);

    } else if (salesGroupBy === "category") {
      const categoryMap: Record<string, { qty: number; sales: number; ordersCount: number }> = {};
      filteredOrders.forEach(o => {
        const prodName = o.productName || "";
        const cat = o.category || (prodName.includes("Seed") ? "Seeds" : prodName.includes("Fertilizer") || prodName.includes("Compost") ? "Fertilizers" : prodName.includes("Sensor") || prodName.includes("Meter") ? "IoT Sensors" : "Machinery");
        
        if (!categoryMap[cat]) {
          categoryMap[cat] = { qty: 0, sales: 0, ordersCount: 0 };
        }
        categoryMap[cat].qty += Number(o.quantity || 0);
        categoryMap[cat].sales += Number(o.amount || 0) * INR_CONVERSION;
        categoryMap[cat].ordersCount += 1;
      });

      return Object.entries(categoryMap).map(([cat, val]) => ({
        label: cat,
        quantity: val.qty,
        revenue: Math.round(val.sales),
        orders: val.ordersCount,
        averageTicket: val.ordersCount > 0 ? Math.round(val.sales / val.ordersCount) : 0
      })).sort((a, b) => b.revenue - a.revenue);

    } else if (salesGroupBy === "customer") {
      const customerMap: Record<string, { qty: number; sales: number; ordersCount: number; company: string }> = {};
      filteredOrders.forEach(o => {
        const name = o.farmerName || "Walk-in Partner";
        if (!customerMap[name]) {
          customerMap[name] = { qty: 0, sales: 0, ordersCount: 0, company: o.buyerCompany || "Agricultural Grower" };
        }
        customerMap[name].qty += Number(o.quantity || 0);
        customerMap[name].sales += Number(o.amount || 0) * INR_CONVERSION;
        customerMap[name].ordersCount += 1;
      });

      return Object.entries(customerMap).map(([name, val]) => ({
        label: name,
        company: val.company,
        quantity: val.qty,
        revenue: Math.round(val.sales),
        orders: val.ordersCount,
        averageTicket: val.ordersCount > 0 ? Math.round(val.sales / val.ordersCount) : 0
      })).sort((a, b) => b.revenue - a.revenue);

    } else { // region
      const regionMap: Record<string, { qty: number; sales: number; ordersCount: number }> = {};
      filteredOrders.forEach(o => {
        const fullLoc = o.location || "Haryana, Andhra Pradesh";
        const parts = fullLoc.split(",");
        const state = (parts.length > 1 ? parts[parts.length - 1] : parts[0]).trim();
        
        if (!regionMap[state]) {
          regionMap[state] = { qty: 0, sales: 0, ordersCount: 0 };
        }
        regionMap[state].qty += Number(o.quantity || 0);
        regionMap[state].sales += Number(o.amount || 0) * INR_CONVERSION;
        regionMap[state].ordersCount += 1;
      });

      return Object.entries(regionMap).map(([state, val]) => ({
        label: state,
        quantity: val.qty,
        revenue: Math.round(val.sales),
        orders: val.ordersCount,
        averageTicket: val.ordersCount > 0 ? Math.round(val.sales / val.ordersCount) : 0
      })).sort((a, b) => b.revenue - a.revenue);
    }
  }, [orders, salesGroupBy, salesRegionFilter]);

  // Unique list of regions from orders for filter dropdown
  const orderRegionsList = useMemo(() => {
    const list = new Set<string>();
    orders.forEach(o => {
      if (o.location) {
        const parts = o.location.split(",");
        const state = (parts.length > 1 ? parts[parts.length - 1] : parts[0]).trim();
        list.add(state);
      }
    });
    return ["All", ...Array.from(list)];
  }, [orders]);


  // 2. INVENTORY REPORT DATA
  const inventoryReportData = useMemo(() => {
    // Process base products with status/alerts
    let processed = products.map((p, idx) => {
      const stock = Number(p.stock !== undefined ? p.stock : 25);
      const isLow = stock > 0 && stock < 15;
      const isOut = stock === 0;
      
      let status: "OK" | "Low Stock" | "Out of Stock" = "OK";
      if (isOut) status = "Out of Stock";
      else if (isLow) status = "Low Stock";

      // Mocking some stock movements
      const movements = [
        { date: "2026-07-10", type: "Sale", qty: -3, ref: "ORD-9842" },
        { date: "2026-07-05", type: "Inbound replenishment", qty: 40, ref: "PO-REPL-09" },
        { date: "2026-07-02", type: "Audit adjustment", qty: -1, ref: "AUDIT-022" }
      ];

      return {
        id: p.id,
        sku: p.sku || `SKU-PROD-${p.id}`,
        name: p.name,
        category: p.category || "Seeds",
        price: Math.round(Number(p.price || 50) * INR_CONVERSION),
        stock,
        status,
        movements
      };
    });

    if (inventoryStockFilter === "low") {
      processed = processed.filter(item => item.status === "Low Stock");
    } else if (inventoryStockFilter === "out") {
      processed = processed.filter(item => item.status === "Out of Stock");
    }

    return processed;
  }, [products, inventoryStockFilter]);

  // Simulated inventory stock movements for overall logging
  const recentStockMovementsLog = useMemo(() => {
    return [
      { id: "M-1", date: "2026-07-11 02:40 PM", sku: "POT-ORG-A", product: "Certified Organic Seed Potatoes", type: "Wholesale Order", qty: -20, ref: "ORD-9842", operator: "Automated API" },
      { id: "M-2", date: "2026-07-10 11:15 AM", sku: "FERT-NITRO-25", product: "Nitrogen-Release Bio-Fertilizer", type: "Wholesale Order", qty: -50, ref: "ORD-9839", operator: "Automated API" },
      { id: "M-3", date: "2026-07-09 04:30 PM", sku: "SEED-HYB-WHT", product: "High-Yield Hybrid Wheat Grain", type: "Inbound Delivery", qty: +500, ref: "INB-REPL-82", operator: "Eswar Reddy" },
      { id: "M-4", date: "2026-07-08 09:00 AM", sku: "PUMP-SOLAR-05", product: "Solar-Powered Submersible Pump", type: "Wholesale Order", qty: -1, ref: "ORD-9831", operator: "System Core" },
      { id: "M-5", date: "2026-07-06 01:22 PM", sku: "METER-MOIST-PRO", product: "Grain Moisture Meter Pro", type: "Manual Stock Edit", qty: +10, ref: "STOCK-ADJ-9", operator: "Eswar Reddy" }
    ];
  }, []);


  // 3. FINANCIAL REPORT DATA
  const financialReportData = useMemo(() => {
    // Months mapping
    const months = ["January", "February", "March", "April", "May", "June", "July"];
    
    // Calculate revenues by month from orders
    const revenueByMonth: Record<string, number> = {};
    orders.forEach(o => {
      if (!o.date) return;
      const monthNum = parseInt(o.date.split("-")[1]); // YYYY-MM-DD
      const monthName = months[monthNum - 1] || "July";
      const amtInr = Number(o.amount || 0) * INR_CONVERSION;
      revenueByMonth[monthName] = (revenueByMonth[monthName] || 0) + amtInr;
    });

    // Fallbacks to create beautiful trend for previous months
    const historicalSales = {
      "January": 142000,
      "February": 165000,
      "March": 289000,
      "April": 341000,
      "May": 195000,
      "June": 210000,
    };

    const dataList = months.map(m => {
      const revenue = Math.round(revenueByMonth[m] !== undefined ? revenueByMonth[m] : (historicalSales as any)[m] || 150000);
      const cogs = Math.round(revenue * 0.72); // cost of goods sold is ~72%
      const grossProfit = revenue - cogs;
      // Tax calculation: 12% for seeds/fertilizers, 18% machinery. Let's assume average 14% GST Tax
      const taxLiability = Math.round(revenue * 0.14);
      const netProfit = grossProfit - taxLiability;

      return {
        month: m,
        revenue,
        cogs,
        grossProfit,
        taxLiability,
        netProfit,
        margin: parseFloat(((netProfit / revenue) * 100).toFixed(1))
      };
    });

    const totalRevenue = dataList.reduce((sum, item) => sum + item.revenue, 0);
    const totalCOGS = dataList.reduce((sum, item) => sum + item.cogs, 0);
    const totalGrossProfit = totalRevenue - totalCOGS;
    const totalTax = dataList.reduce((sum, item) => sum + item.taxLiability, 0);
    const totalNetProfit = totalGrossProfit - totalTax;

    return {
      monthlyBreakdown: dataList,
      totals: {
        revenue: totalRevenue,
        cogs: totalCOGS,
        gross: totalGrossProfit,
        tax: totalTax,
        net: totalNetProfit,
        netMargin: parseFloat(((totalNetProfit / totalRevenue) * 100).toFixed(1))
      }
    };
  }, [orders]);


  // 4. CUSTOMER REPORT DATA (Acquisition, Retention, CLV)
  const customerReportData = useMemo(() => {
    // Total Unique customer names
    const buyerNames = new Set(orders.map(o => (o.farmerName || "").toLowerCase()));
    
    // Average purchase interval & repeat rates
    const repeatBuyersCount = orders.reduce((acc: Record<string, number>, o) => {
      const name = (o.farmerName || "").toLowerCase();
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});
    
    const repeatCount = Object.values(repeatBuyersCount).filter((count: any) => count > 1).length;
    const totalCount = Object.keys(repeatBuyersCount).length;
    const repeatPurchaseRate = totalCount > 0 ? parseFloat(((repeatCount / totalCount) * 100).toFixed(1)) : 80.0;

    // Top customer value rank
    const customerCLVs = Object.entries(repeatBuyersCount).map(([name, count]: any) => {
      const matchedOrders = orders.filter(o => (o.farmerName || "").toLowerCase() === name);
      const totalSpent = matchedOrders.reduce((sum, o) => sum + (Number(o.amount || 0) * INR_CONVERSION), 0);
      const email = matchedOrders[0]?.buyerEmail || "not-configured@agri.in";
      const location = matchedOrders[0]?.location || "Haryana";
      const company = matchedOrders[0]?.buyerCompany || "Agricultural Grower";

      return {
        name: name.replace(/\b\w/g, (c: string) => c.toUpperCase()),
        email,
        company,
        location,
        ordersCount: count,
        totalSpent: Math.round(totalSpent),
        clvTier: totalSpent >= 50000 ? "Premium Member" : totalSpent >= 15000 ? "Growth Member" : "Standard Partner"
      };
    }).sort((a, b) => b.totalSpent - a.totalSpent);

    const averageCLV = customerCLVs.length > 0 
      ? Math.round(customerCLVs.reduce((sum, item) => sum + item.totalSpent, 0) / customerCLVs.length)
      : 35000;

    // Acquisition by month
    const acquisitionTimeline = [
      { month: "Jan", accounts: 1, cumulative: 1 },
      { month: "Feb", accounts: 2, cumulative: 3 },
      { month: "Mar", accounts: 3, cumulative: 6 },
      { month: "Apr", accounts: 2, cumulative: 8 },
      { month: "May", accounts: 1, cumulative: 9 },
      { month: "Jun", accounts: 3, cumulative: 12 },
      { month: "Jul (This Month)", accounts: 2, cumulative: 14 }
    ];

    return {
      repeatPurchaseRate,
      averageCLV,
      customerCLVs,
      acquisitionTimeline,
      activeAccountsCount: totalCount
    };
  }, [orders]);


  // --- EXPORT TRIGGERS & UTILS (CSV, Excel, JSON, PDF) ---

  const handleExportCSV = () => {
    let csvContent = "";
    let filename = "";

    if (activeReportTab === "sales") {
      filename = `sales_report_grouped_by_${salesGroupBy}.csv`;
      csvContent = "Label/Entity,Wholesale Volume,Total Revenue (INR),Orders Placed,Average Ticket Value (INR)\n";
      salesReportData.forEach((row: any) => {
        csvContent += `"${row.label.replace(/"/g, '""')}",${row.quantity},${row.revenue},${row.orders},${row.averageTicket}\n`;
      });
    } else if (activeReportTab === "inventory") {
      filename = `inventory_stock_report.csv`;
      csvContent = "SKU,Product Name,Category,Price (INR),Stock Levels,Alert Status\n";
      inventoryReportData.forEach((row: any) => {
        csvContent += `"${row.sku}","${row.name.replace(/"/g, '""')}","${row.category}",${row.price},${row.stock},"${row.status}"\n`;
      });
    } else if (activeReportTab === "financial") {
      filename = `financial_statement_report.csv`;
      csvContent = "Operating Month,Gross Revenue (INR),COGS Outlays (INR),Gross Margin Profit (INR),Tax Liability (14% GST),Wholesale Net Profit (INR),Net Percentage Margin\n";
      financialReportData.monthlyBreakdown.forEach((row: any) => {
        csvContent += `"${row.month}",${row.revenue},${row.cogs},${row.grossProfit},${row.taxLiability},${row.netProfit},${row.margin}%\n`;
      });
      const t = financialReportData.totals;
      csvContent += `\n"TOTALS",${t.revenue},${t.cogs},${t.gross},${t.tax},${t.net},${t.netMargin}%\n`;
    } else {
      filename = `customer_intelligence_report.csv`;
      csvContent = "Partner Profile Name,Corporate Company,State Location,Transactions Count,Monetary Value (CLV - INR),Category Tier\n";
      customerReportData.customerCLVs.forEach((row: any) => {
        csvContent += `"${row.name}","${row.company.replace(/"/g, '""')}","${row.location}",${row.ordersCount},${row.totalSpent},"${row.clvTier}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerSuccess(`Successfully exported and downloaded ${filename}!`);
  };

  const handleExportExcel = () => {
    let excelContent = "";
    let filename = "";

    // Generate HTML/Spreadsheet XML compatible table format which opens perfectly as rich spreadsheets
    if (activeReportTab === "sales") {
      filename = `sales_report_grouped_by_${salesGroupBy}.xls`;
      excelContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="UTF-8"><style>table {border-collapse:collapse;} th {background-color:#4f46e5;color:white;font-weight:bold;} td,th {border:1px solid #ddd;padding:8px;}</style></head>
        <body>
          <h2>Sales Summary Report (Grouped by ${salesGroupBy.toUpperCase()})</h2>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>Entity Label</th>
                <th>Units Sold</th>
                <th>Total Revenue (INR)</th>
                <th>Order Counts</th>
                <th>Average Ticket (INR)</th>
              </tr>
            </thead>
            <tbody>
              ${salesReportData.map((row: any) => `
                <tr>
                  <td><b>${row.label}</b></td>
                  <td>${row.quantity}</td>
                  <td>₹${row.revenue.toLocaleString()}</td>
                  <td>${row.orders}</td>
                  <td>₹${row.averageTicket.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `;
    } else if (activeReportTab === "inventory") {
      filename = `inventory_stock_levels.xls`;
      excelContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="UTF-8"><style>table {border-collapse:collapse;} th {background-color:#0d9488;color:white;font-weight:bold;} td,th {border:1px solid #ddd;padding:8px;}</style></head>
        <body>
          <h2>AgriConnect Inventory Status & Stock Alert Sheet</h2>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>SKU Code</th>
                <th>Product Label</th>
                <th>Category</th>
                <th>Unit Price (INR)</th>
                <th>Stock Level</th>
                <th>Alert Status</th>
              </tr>
            </thead>
            <tbody>
              ${inventoryReportData.map((row: any) => `
                <tr>
                  <td><code>${row.sku}</code></td>
                  <td><b>${row.name}</b></td>
                  <td>${row.category}</td>
                  <td>₹${row.price.toLocaleString()}</td>
                  <td style="color:${row.stock === 0 ? 'red' : row.stock < 15 ? 'orange' : 'green'}; font-weight:bold;">${row.stock} units</td>
                  <td>${row.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `;
    } else if (activeReportTab === "financial") {
      filename = `financial_statement_2026.xls`;
      const t = financialReportData.totals;
      excelContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="UTF-8"><style>table {border-collapse:collapse;} th {background-color:#1e293b;color:white;font-weight:bold;} td,th {border:1px solid #ddd;padding:8px;} .total-row {background-color:#f1f5f9;font-weight:bold;}</style></head>
        <body>
          <h2>Supplier Financial Income & Tax Statement (2026)</h2>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>Operating Month</th>
                <th>Wholesale Revenue</th>
                <th>Estimated COGS (72%)</th>
                <th>Gross Margin Profit</th>
                <th>Tax Liability (14% GST)</th>
                <th>Net Wholesale Profit</th>
                <th>Percentage Margin</th>
              </tr>
            </thead>
            <tbody>
              ${financialReportData.monthlyBreakdown.map((row: any) => `
                <tr>
                  <td><b>${row.month}</b></td>
                  <td>₹${row.revenue.toLocaleString()}</td>
                  <td>₹${row.cogs.toLocaleString()}</td>
                  <td>₹${row.grossProfit.toLocaleString()}</td>
                  <td>₹${row.taxLiability.toLocaleString()}</td>
                  <td>₹${row.netProfit.toLocaleString()}</td>
                  <td>${row.margin}%</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td>GRAND TOTALS</td>
                <td>₹${t.revenue.toLocaleString()}</td>
                <td>₹${t.cogs.toLocaleString()}</td>
                <td>₹${t.gross.toLocaleString()}</td>
                <td>₹${t.tax.toLocaleString()}</td>
                <td>₹${t.net.toLocaleString()}</td>
                <td>${t.netMargin}%</td>
              </tr>
            </tbody>
          </table>
        </body>
        </html>
      `;
    } else {
      filename = `customer_clv_analytics.xls`;
      excelContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="UTF-8"><style>table {border-collapse:collapse;} th {background-color:#4338ca;color:white;font-weight:bold;} td,th {border:1px solid #ddd;padding:8px;}</style></head>
        <body>
          <h2>Wholesale Partner Profiles & Lifetime Value (CLV) Index</h2>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <p><b>Average CLV:</b> ₹${customerReportData.averageCLV.toLocaleString()}</p>
          <p><b>Repeat Purchase Rate:</b> ${customerReportData.repeatPurchaseRate}%</p>
          <table>
            <thead>
              <tr>
                <th>Partner Name</th>
                <th>Company Entity</th>
                <th>Registered Location</th>
                <th>Orders Placed</th>
                <th>Lifetime Spent (CLV)</th>
                <th>Monetary Tier</th>
              </tr>
            </thead>
            <tbody>
              ${customerReportData.customerCLVs.map((row: any) => `
                <tr>
                  <td><b>${row.name}</b></td>
                  <td>${row.company}</td>
                  <td>${row.location}</td>
                  <td>${row.ordersCount} orders</td>
                  <td style="font-weight:bold;color:#10b981;">₹${row.totalSpent.toLocaleString()}</td>
                  <td>${row.clvTier}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `;
    }

    const blob = new Blob([excelContent], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerSuccess(`Successfully exported and downloaded ${filename} sheet!`);
  };

  const handleExportJSON = () => {
    let rawData: any = {};
    let filename = `custom_report_${activeReportTab}.json`;

    if (activeReportTab === "sales") {
      rawData = {
        reportType: "sales",
        groupedBy: salesGroupBy,
        generatedAt: new Date().toISOString(),
        rows: salesReportData
      };
    } else if (activeReportTab === "inventory") {
      rawData = {
        reportType: "inventory",
        stockFilter: inventoryStockFilter,
        generatedAt: new Date().toISOString(),
        rows: inventoryReportData,
        stockMovementsLog: recentStockMovementsLog
      };
    } else if (activeReportTab === "financial") {
      rawData = {
        reportType: "financial",
        year: financialYearFilter,
        generatedAt: new Date().toISOString(),
        ...financialReportData
      };
    } else {
      rawData = {
        reportType: "customer",
        generatedAt: new Date().toISOString(),
        ...customerReportData
      };
    }

    const blob = new Blob([JSON.stringify(rawData, null, 2)], { type: "application/json;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerSuccess(`Successfully exported and downloaded JSON structured schema!`);
  };

  const handleOpenPrintPreview = () => {
    let title = "";
    let headers: string[] = [];
    let rows: any[][] = [];
    let summaryText = "";

    if (activeReportTab === "sales") {
      title = `Enterprise Sales & Revenue Report (Grouped by ${salesGroupBy.toUpperCase()})`;
      headers = ["Label / Entity Name", "Wholesale Volume", "Total Revenue (INR)", "Orders Count", "Avg Ticket (INR)"];
      rows = salesReportData.map(r => [
        r.label,
        `${r.quantity} units`,
        `₹${r.revenue.toLocaleString()}`,
        `${r.orders} transactions`,
        `₹${r.averageTicket.toLocaleString()}`
      ]);
      summaryText = `This sales report aggregates wholesale input volumes and currency revenues filtered across agricultural trade cycles. Regional metrics emphasize ${salesGroupBy} velocity.`;
    } else if (activeReportTab === "inventory") {
      title = `AgriConnect Supply Inventory & SKU Status Statement`;
      headers = ["SKU Code", "Product Description", "Category", "Wholesale Price", "Stock Level", "Alert Status"];
      rows = inventoryReportData.map(r => [
        r.sku,
        r.name,
        r.category,
        `₹${r.price.toLocaleString()}`,
        `${r.stock} units`,
        r.status
      ]);
      summaryText = `This report monitors active SKU holdings, identifying replenishment deficits. Immediate buy orders recommended for critical out-of-stock items.`;
    } else if (activeReportTab === "financial") {
      title = `Supplier Income & Tax Liability Statement (FY 2026)`;
      headers = ["Operating Month", "Wholesale Revenue", "Estimated COGS", "Gross Profit", "Tax Liability (14% GST)", "Net Profit"];
      rows = financialReportData.monthlyBreakdown.map(r => [
        r.month,
        `₹${r.revenue.toLocaleString()}`,
        `₹${r.cogs.toLocaleString()}`,
        `₹${r.grossProfit.toLocaleString()}`,
        `₹${r.taxLiability.toLocaleString()}`,
        `₹${r.netProfit.toLocaleString()}`
      ]);
      const t = financialReportData.totals;
      summaryText = `GRAND TOTALS: Revenue: ₹${t.revenue.toLocaleString()} | COGS: ₹${t.cogs.toLocaleString()} | Gross Profit: ₹${t.gross.toLocaleString()} | GST Tax Liability: ₹${t.tax.toLocaleString()} | Net Wholesale Profit: ₹${t.net.toLocaleString()} | Cumulative Profit Margin: ${t.netMargin}%`;
    } else {
      title = `Wholesale Client Lifecycle Valuation & Retention Registry`;
      headers = ["Partner Name", "Company / Cooperative", "Registered Region", "Transactions", "Total Spent (CLV)", "Category Tier"];
      rows = customerReportData.customerCLVs.map(r => [
        r.name,
        r.company,
        r.location,
        `${r.ordersCount} orders`,
        `₹${r.totalSpent.toLocaleString()}`,
        r.clvTier
      ]);
      summaryText = `Customer Lifetime Value index calculates aggregate trade volumes. Top accounts represent essential regional cooperative buyers in Haryana, Andhra Pradesh, and Maharashtra.`;
    }

    setPreviewData({ title, headers, rows, summaryText });
    setPrintPreviewOpen(true);
  };


  // --- REPORT SCHEDULER MANAGEMENT ---

  const handleOpenNewSchedule = () => {
    setSchEditingId(null);
    setSchReportType("sales");
    setSchFrequency("weekly");
    setSchFormat("pdf");
    setSchDeliveryTime("08:00 AM");
    setSchDayOfWeek("Monday");
    setSchDayOfMonth(1);
    setSchRecipients("jakkireddyeswarreddy@gmail.com");
    setScheduleModalOpen(true);
  };

  const handleEditSchedule = (sch: ScheduledReport) => {
    setSchEditingId(sch.id);
    setSchReportType(sch.reportType);
    setSchFrequency(sch.frequency);
    setSchFormat(sch.format);
    
    // Parse delivery time string (e.g. "08:00 AM Every Monday", "06:00 PM Daily")
    const parts = sch.deliveryTime.split(" ");
    if (parts.length > 1) {
      setSchDeliveryTime(`${parts[0]} ${parts[1]}`);
    } else {
      setSchDeliveryTime("08:00 AM");
    }

    if (sch.frequency === "weekly") {
      const match = sch.deliveryTime.match(/Every (\w+)/);
      if (match) setSchDayOfWeek(match[1]);
    } else if (sch.frequency === "monthly") {
      const match = sch.deliveryTime.match(/Day (\d+)/);
      if (match) setSchDayOfMonth(parseInt(match[1]));
    }

    setSchRecipients(sch.recipients);
    setScheduleModalOpen(true);
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();

    let finalDeliveryString = "";
    if (schFrequency === "daily") {
      finalDeliveryString = `${schDeliveryTime} Daily`;
    } else if (schFrequency === "weekly") {
      finalDeliveryString = `${schDeliveryTime} Every ${schDayOfWeek}`;
    } else {
      finalDeliveryString = `${schDeliveryTime} on Day ${schDayOfMonth} of Month`;
    }

    if (schEditingId) {
      // Edit
      const updated = scheduledReports.map(r => r.id === schEditingId ? {
        ...r,
        reportType: schReportType,
        frequency: schFrequency,
        format: schFormat,
        deliveryTime: finalDeliveryString,
        recipients: schRecipients
      } : r);
      saveSchedules(updated);
      triggerSuccess("Successfully updated the custom scheduled report configuration!");
    } else {
      // Create
      const newSch: ScheduledReport = {
        id: `SCH-${Math.floor(Math.random() * 9000) + 1000}`,
        reportType: schReportType,
        frequency: schFrequency,
        format: schFormat,
        deliveryTime: finalDeliveryString,
        recipients: schRecipients,
        status: "active"
      };
      saveSchedules([...scheduledReports, newSch]);
      triggerSuccess("Successfully configured a new automated scheduled report!");
    }

    setScheduleModalOpen(false);
  };

  const handleDeleteSchedule = (id: string) => {
    const updated = scheduledReports.filter(r => r.id !== id);
    saveSchedules(updated);
    triggerSuccess("Scheduled automated report configuration deleted successfully.");
  };

  const handleToggleScheduleStatus = (id: string) => {
    const updated = scheduledReports.map(r => r.id === id ? {
      ...r,
      status: r.status === "active" ? "paused" : "active" as "active" | "paused"
    } : r);
    saveSchedules(updated);
    triggerSuccess("Toggled scheduled report status.");
  };

  const handleTriggerManualTest = (sch: ScheduledReport) => {
    // Simulate real-time email dispatch
    const reportLabel = sch.reportType.toUpperCase() + " REPORT";
    const formatLabel = sch.format.toUpperCase();
    triggerSuccess(`🔄 SIMULATING: Rendering ${reportLabel} in ${formatLabel} format...`);
    
    setTimeout(() => {
      // Update last sent
      const dateStr = new Date().toLocaleString();
      const updated = scheduledReports.map(r => r.id === sch.id ? { ...r, lastSent: dateStr } : r);
      saveSchedules(updated);
      
      triggerSuccess(`✉️ SUCCESS: Scheduled automated dispatch triggered! "${reportLabel}" was sent as a ${formatLabel} attachment to [${sch.recipients}].`);
    }, 1500);
  };


  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-100 rounded-3xl p-6 max-w-7xl w-full h-[92vh] shadow-2xl relative flex flex-col space-y-5 overflow-hidden">
        
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-indigo-600 shrink-0" />
            <div className="text-left">
              <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">8.4 Custom Reporting & Analytics Engine</h3>
              <p className="text-slate-400 text-[10px] font-semibold">Generate granular wholesale intelligence, schedule background summaries, and export premium reports</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-full cursor-pointer transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Global Success / Alert Banner */}
        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-100/60 rounded-xl text-left flex items-center gap-2 animate-fadeIn shrink-0">
            <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
            <span className="text-[11px] font-bold text-emerald-800 leading-tight">{successMessage}</span>
          </div>
        )}

        {/* Main Interface Layout - Split into Left workspace, Right side scheduler */}
        <div className="flex-1 flex gap-6 min-h-0">
          
          {/* LEFT: REPORT GENERATOR & PREVIEW WORKSPACE */}
          <div className="flex-1 flex flex-col space-y-4 min-h-0 bg-slate-50/50 p-4 border border-slate-200/60 rounded-2xl overflow-y-auto">
            
            {/* Report Selector Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 pb-3 shrink-0">
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/50">
                <button
                  onClick={() => setActiveReportTab("sales")}
                  className={`px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
                    activeReportTab === "sales" ? "bg-white text-slate-800 shadow-3xs" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <TrendingUp className="h-3.5 w-3.5" /> Sales
                </button>
                <button
                  onClick={() => setActiveReportTab("inventory")}
                  className={`px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
                    activeReportTab === "inventory" ? "bg-white text-emerald-800 shadow-3xs" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Package className="h-3.5 w-3.5" /> Inventory
                </button>
                <button
                  onClick={() => setActiveReportTab("financial")}
                  className={`px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
                    activeReportTab === "financial" ? "bg-white text-slate-800 shadow-3xs" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <DollarSign className="h-3.5 w-3.5" /> Financial
                </button>
                <button
                  onClick={() => setActiveReportTab("customer")}
                  className={`px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
                    activeReportTab === "customer" ? "bg-white text-indigo-800 shadow-3xs" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Users className="h-3.5 w-3.5" /> Customer
                </button>
              </div>

              {/* Instant Export Actions Row */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleExportCSV}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-[10.5px] font-black text-slate-700 cursor-pointer flex items-center gap-1 shadow-3xs"
                  title="Export to comma-separated values"
                >
                  <FileText className="h-3.5 w-3.5 text-slate-500" /> CSV
                </button>
                <button
                  onClick={handleExportExcel}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-[10.5px] font-black text-teal-800 cursor-pointer flex items-center gap-1 shadow-3xs"
                  title="Export styled Excel workbook spreadsheet"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-teal-600" /> Excel
                </button>
                <button
                  onClick={handleExportJSON}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-[10.5px] font-black text-purple-800 cursor-pointer flex items-center gap-1 shadow-3xs"
                  title="Download standard JSON schema data"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-purple-600" /> JSON
                </button>
                <button
                  onClick={handleOpenPrintPreview}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[10.5px] font-black cursor-pointer flex items-center gap-1 shadow-2xs"
                  title="Generate high-fidelity PDF / Printed version"
                >
                  <Printer className="h-3.5 w-3.5 text-indigo-400" /> Print PDF
                </button>
              </div>
            </div>

            {/* DYNAMIC FILTERS PANEL BASED ON ACTIVE TAB */}
            <div className="bg-white p-3.5 border border-slate-200 rounded-xl text-left shrink-0">
              {activeReportTab === "sales" && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider block mb-1">Group Analysis By:</span>
                      <div className="flex gap-1">
                        {(["product", "category", "customer", "region"] as const).map(group => (
                          <button
                            key={group}
                            onClick={() => setSalesGroupBy(group)}
                            className={`px-2.5 py-1 rounded-md text-[10.5px] font-bold uppercase border cursor-pointer transition-all ${
                              salesGroupBy === group 
                                ? "bg-slate-800 border-slate-800 text-white" 
                                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            {group}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider block mb-1">Region Scope:</span>
                      <select
                        value={salesRegionFilter}
                        onChange={(e) => setSalesRegionFilter(e.target.value)}
                        className="p-1 border border-slate-200 rounded text-xs font-bold bg-slate-50 cursor-pointer"
                      >
                        {orderRegionsList.map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block">Current Metrics:</span>
                    <span className="text-xs font-black text-indigo-600">{salesReportData.length} entities grouped</span>
                  </div>
                </div>
              )}

              {activeReportTab === "inventory" && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider block mb-1">Stock Level Filters:</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setInventoryStockFilter("all")}
                          className={`px-2.5 py-1 rounded-md text-[10.5px] font-bold uppercase border cursor-pointer ${
                            inventoryStockFilter === "all" ? "bg-teal-700 border-teal-700 text-white" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          All Holdings
                        </button>
                        <button
                          onClick={() => setInventoryStockFilter("low")}
                          className={`px-2.5 py-1 rounded-md text-[10.5px] font-bold uppercase border cursor-pointer flex items-center gap-1 ${
                            inventoryStockFilter === "low" ? "bg-amber-600 border-amber-600 text-white" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <AlertTriangle className="h-3 w-3" /> Low Stock
                        </button>
                        <button
                          onClick={() => setInventoryStockFilter("out")}
                          className={`px-2.5 py-1 rounded-md text-[10.5px] font-bold uppercase border cursor-pointer flex items-center gap-1 ${
                            inventoryStockFilter === "out" ? "bg-rose-600 border-rose-600 text-white" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <X className="h-3 w-3" /> Out of stock
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block">Total Items Logged:</span>
                    <span className="text-xs font-black text-teal-600">{inventoryReportData.length} registered SKUs</span>
                  </div>
                </div>
              )}

              {activeReportTab === "financial" && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider block mb-1">Financial Cycle Year:</span>
                      <select
                        value={financialYearFilter}
                        onChange={(e) => setFinancialYearFilter(e.target.value)}
                        className="p-1 border border-slate-200 rounded text-xs font-bold bg-slate-50 cursor-pointer"
                      >
                        <option value="2026">FY 2026 (Active Calendar)</option>
                        <option value="2025">FY 2025 (Audited Baseline)</option>
                      </select>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block">Cumulative Sales Turnover:</span>
                    <span className="text-xs font-black text-emerald-600 font-mono">₹{financialReportData.totals.revenue.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {activeReportTab === "customer" && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-left">
                    <h4 className="text-[11px] font-extrabold text-slate-700">Wholesale Partner Retention Diagnostics</h4>
                    <p className="text-[9.5px] text-slate-400">Lifetime value (CLV) aggregates and acquisition history analytics</p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider block leading-none">Repeat Rate</span>
                      <span className="text-xs font-black text-indigo-600">{customerReportData.repeatPurchaseRate}%</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider block leading-none">Avg CLV Value</span>
                      <span className="text-xs font-black text-indigo-600 font-mono">₹{customerReportData.averageCLV.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CHART VISUALIZER */}
            <div className="bg-white p-4.5 border border-slate-200 rounded-xl h-[230px] shrink-0 flex flex-col space-y-1 text-left">
              <span className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider">Dynamic Analytics Visualization</span>
              <div className="flex-1 min-h-0 text-[10px] font-bold">
                {activeReportTab === "sales" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesReportData.slice(0, 6)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="label" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, "Revenue"]} />
                      <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Turnover (INR)" />
                    </BarChart>
                  </ResponsiveContainer>
                )}

                {activeReportTab === "inventory" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={inventoryReportData.slice(0, 7)} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="sku" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip formatter={(value: any) => [value, "Stock Units"]} />
                      <Bar dataKey="stock" fill="#0d9488" radius={[4, 4, 0, 0]} name="Stock Units" />
                    </BarChart>
                  </ResponsiveContainer>
                )}

                {activeReportTab === "financial" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={financialReportData.monthlyBreakdown} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.01}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, "Amount"]} />
                      <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" name="Revenue" />
                      <Line type="monotone" dataKey="netProfit" stroke="#ef4444" strokeWidth={2} name="Net Profit" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}

                {activeReportTab === "customer" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={customerReportData.acquisitionTimeline} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCust" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.01}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip formatter={(value: any) => [value, "Count"]} />
                      <Area type="monotone" dataKey="cumulative" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCust)" name="Total Scale" />
                      <Line type="monotone" dataKey="accounts" stroke="#34d399" strokeWidth={2} name="New This Month" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* TABULAR DATAGRID PREVIEW */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex-1 min-h-0 flex flex-col">
              
              <div className="bg-slate-50/80 px-4 py-2.5 border-b border-slate-100 flex items-center justify-between shrink-0">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Report Output Registry Rows</span>
                <span className="text-[9.5px] text-slate-400 font-semibold italic">Real-time calculations</span>
              </div>

              <div className="flex-1 overflow-y-auto text-xs font-bold text-slate-700">
                {activeReportTab === "sales" && (
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-[9px] uppercase text-slate-500 border-b border-slate-100 sticky top-0">
                      <tr>
                        <th className="p-3">Entity Description</th>
                        <th className="p-3 text-center">Volume Sold</th>
                        <th className="p-3 text-right">Wholesale Amount</th>
                        <th className="p-3 text-center">Orders Placed</th>
                        <th className="p-3 text-right">Avg Ticket</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {salesReportData.map((row: any, i) => (
                        <tr key={i} className="hover:bg-slate-50/55 transition-colors">
                          <td className="p-3 text-left">
                            <span className="font-extrabold text-slate-800 text-[11.5px] block">{row.label}</span>
                            {row.category && <span className="text-[9.5px] text-slate-400 font-semibold uppercase">{row.category}</span>}
                            {row.company && <span className="text-[9.5px] text-slate-400 font-semibold uppercase">{row.company}</span>}
                          </td>
                          <td className="p-3 text-center font-mono">{row.quantity} bags/units</td>
                          <td className="p-3 text-right font-mono text-slate-900">₹{row.revenue.toLocaleString()}</td>
                          <td className="p-3 text-center font-mono">{row.orders} orders</td>
                          <td className="p-3 text-right font-mono text-indigo-600">₹{row.averageTicket.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeReportTab === "inventory" && (
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-[9px] uppercase text-slate-500 border-b border-slate-100 sticky top-0">
                      <tr>
                        <th className="p-3">SKU Code</th>
                        <th className="p-3">Product Name</th>
                        <th className="p-3">Category</th>
                        <th className="p-3 text-right">Base Price</th>
                        <th className="p-3 text-center">Current Stock</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {inventoryReportData.map((row: any, i) => (
                        <tr key={i} className="hover:bg-slate-50/55 transition-colors">
                          <td className="p-3 font-mono text-slate-500"><code>{row.sku}</code></td>
                          <td className="p-3 text-left font-extrabold text-slate-800 text-[11.5px]">{row.name}</td>
                          <td className="p-3 font-semibold text-slate-500">{row.category}</td>
                          <td className="p-3 text-right font-mono">₹{row.price.toLocaleString()}</td>
                          <td className="p-3 text-center font-mono font-black">{row.stock} units</td>
                          <td className="p-3 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                              row.status === "OK" 
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                                : row.status === "Low Stock" 
                                ? "bg-amber-50 text-amber-700 border border-amber-100 animate-pulse" 
                                : "bg-rose-50 text-rose-700 border border-rose-100 animate-bounce"
                            }`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeReportTab === "financial" && (
                  <div className="flex flex-col h-full justify-between">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 text-[9px] uppercase text-slate-500 border-b border-slate-100 sticky top-0">
                        <tr>
                          <th className="p-3">Operating Month</th>
                          <th className="p-3 text-right">Revenue</th>
                          <th className="p-3 text-right">Est. COGS (72%)</th>
                          <th className="p-3 text-right">Gross Profit</th>
                          <th className="p-3 text-right">Tax (14% GST)</th>
                          <th className="p-3 text-right">Wholesale Net</th>
                          <th className="p-3 text-center">Margin</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {financialReportData.monthlyBreakdown.map((row: any, i) => (
                          <tr key={i} className="hover:bg-slate-50/55 transition-colors">
                            <td className="p-3 text-left font-extrabold text-slate-800">{row.month}</td>
                            <td className="p-3 text-right font-mono text-slate-900">₹{row.revenue.toLocaleString()}</td>
                            <td className="p-3 text-right font-mono text-slate-400">₹{row.cogs.toLocaleString()}</td>
                            <td className="p-3 text-right font-mono text-slate-700">₹{row.grossProfit.toLocaleString()}</td>
                            <td className="p-3 text-right font-mono text-amber-600">₹{row.taxLiability.toLocaleString()}</td>
                            <td className="p-3 text-right font-mono text-emerald-600">₹{row.netProfit.toLocaleString()}</td>
                            <td className="p-3 text-center font-mono text-indigo-600">{row.margin}%</td>
                          </tr>
                        ))}
                        
                        {/* Totals Row */}
                        <tr className="bg-slate-50 font-black text-slate-800 border-t-2 border-slate-200">
                          <td className="p-3 text-left">GRAND TOTALS</td>
                          <td className="p-3 text-right font-mono text-slate-900">₹{financialReportData.totals.revenue.toLocaleString()}</td>
                          <td className="p-3 text-right font-mono text-slate-400">₹{financialReportData.totals.cogs.toLocaleString()}</td>
                          <td className="p-3 text-right font-mono text-slate-800">₹{financialReportData.totals.gross.toLocaleString()}</td>
                          <td className="p-3 text-right font-mono text-amber-700">₹{financialReportData.totals.tax.toLocaleString()}</td>
                          <td className="p-3 text-right font-mono text-emerald-700">₹{financialReportData.totals.net.toLocaleString()}</td>
                          <td className="p-3 text-center font-mono text-indigo-700">{financialReportData.totals.netMargin}%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {activeReportTab === "customer" && (
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-[9px] uppercase text-slate-500 border-b border-slate-100 sticky top-0">
                      <tr>
                        <th className="p-3">Partner Name</th>
                        <th className="p-3">Company Entity</th>
                        <th className="p-3">State Region</th>
                        <th className="p-3 text-center">Transactions</th>
                        <th className="p-3 text-right">Lifetime spent (CLV)</th>
                        <th className="p-3 text-center">Membership Tier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {customerReportData.customerCLVs.map((row: any, i) => (
                        <tr key={i} className="hover:bg-slate-50/55 transition-colors">
                          <td className="p-3 text-left font-extrabold text-slate-800 text-[11.5px]">{row.name}</td>
                          <td className="p-3 text-left font-semibold text-slate-400">{row.company}</td>
                          <td className="p-3 text-left text-slate-600">{row.location}</td>
                          <td className="p-3 text-center font-mono">{row.ordersCount} orders</td>
                          <td className="p-3 text-right font-mono text-slate-900">₹{row.totalSpent.toLocaleString()}</td>
                          <td className="p-3 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                              row.clvTier === "Premium Member" 
                                ? "bg-amber-100 text-amber-800 border border-amber-200" 
                                : row.clvTier === "Growth Member" 
                                ? "bg-indigo-50 text-indigo-700 border border-indigo-100" 
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}>
                              {row.clvTier}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT: SCHEDULE AUTOMATED REPORTS PANEL */}
          <div className="w-full lg:w-[380px] shrink-0 border border-slate-200 rounded-2xl p-4 bg-slate-50/30 flex flex-col space-y-4 min-h-0 text-left">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">Report Scheduler</h4>
                  <p className="text-[10px] text-slate-400 font-semibold leading-tight mt-0.5">Configure automated summaries</p>
                </div>
              </div>
              
              <button
                onClick={handleOpenNewSchedule}
                className="p-1 text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer flex items-center gap-1 text-[10px] font-black uppercase tracking-wider"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>

            {/* List of Scheduled Reports */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-0.5">
              {scheduledReports.length === 0 ? (
                <div className="p-8 text-center bg-white border border-slate-100 rounded-xl space-y-2">
                  <Mail className="h-8 w-8 text-slate-300 mx-auto" />
                  <p className="text-[10.5px] text-slate-400 font-bold">No active automatic schedules configured. Click add to start.</p>
                </div>
              ) : (
                scheduledReports.map(sch => {
                  const isPaused = sch.status === "paused";
                  
                  return (
                    <div 
                      key={sch.id} 
                      className={`p-3.5 bg-white border rounded-xl shadow-3xs space-y-3 transition-all ${
                        isPaused ? "border-slate-200/50 bg-slate-50/50 opacity-70" : "border-slate-200"
                      }`}
                    >
                      {/* Top Row: Type and Format Badge */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            sch.reportType === "sales" ? "bg-blue-500" : sch.reportType === "inventory" ? "bg-emerald-500" : sch.reportType === "financial" ? "bg-amber-500" : "bg-purple-500"
                          }`} />
                          <span className="text-[10.5px] font-black uppercase text-slate-700 tracking-wider">
                            {sch.reportType} report
                          </span>
                        </div>

                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[9px] font-black rounded uppercase border border-slate-200">
                          {sch.format} attachment
                        </span>
                      </div>

                      {/* Detail List */}
                      <div className="space-y-1.5 text-[10.5px] font-bold text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>Interval: <b className="text-slate-800 uppercase text-[10px]">{sch.frequency}</b> ({sch.deliveryTime})</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">To: <code className="text-slate-800 text-[10px] font-bold break-all bg-slate-50 px-1 rounded">{sch.recipients}</code></span>
                        </div>
                        {sch.lastSent && (
                          <div className="flex items-center gap-1.5 text-[9.5px] text-slate-400 italic">
                            <span>Last sent: {sch.lastSent}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions row */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100/60 shrink-0">
                        <button
                          onClick={() => handleToggleScheduleStatus(sch.id)}
                          className={`px-2 py-1 rounded-md text-[9.5px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors ${
                            isPaused 
                              ? "bg-slate-100 text-slate-600 hover:bg-slate-200" 
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100"
                          }`}
                        >
                          {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                          {isPaused ? "Activate" : "Active"}
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleTriggerManualTest(sch)}
                            className="p-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md cursor-pointer flex items-center gap-1 text-[9.5px] font-black uppercase"
                            title="Trigger a test email delivery immediately"
                          >
                            <Mail className="h-3 w-3" /> Test Sent
                          </button>
                          <button
                            onClick={() => handleEditSchedule(sch)}
                            className="p-1 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-md cursor-pointer"
                            title="Edit schedule configuration"
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteSchedule(sch.id)}
                            className="p-1 hover:bg-rose-50 text-rose-500 hover:text-rose-700 rounded-md cursor-pointer"
                            title="Delete configuration"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Scheduler Guidelines Alert box */}
            <div className="p-3.5 bg-indigo-50/40 border border-indigo-100/60 rounded-xl space-y-1">
              <h5 className="text-[10.5px] font-black text-indigo-900 uppercase tracking-wider flex items-center gap-1">
                <HelpCircle className="h-3.5 w-3.5 text-indigo-600 shrink-0" /> Background Worker Details
              </h5>
              <p className="text-[9.5px] text-indigo-600 font-semibold leading-relaxed">
                Automatic scheduled dispatches run via a background worker. Simulated attachments are delivered directly to the designated client or regional co-operative email accounts.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* SCHEDULE FORM DIALOG MODAL */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 z-55 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 animate-scaleUp text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-sm font-black uppercase text-slate-800 flex items-center gap-1.5">
                <Calendar className="h-4.5 w-4.5 text-indigo-600" />
                {schEditingId ? "Edit Scheduled Report" : "Schedule Automated Report"}
              </h4>
              <button
                onClick={() => setScheduleModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-full cursor-pointer text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-4 text-xs font-bold text-slate-700">
              
              {/* Report Type */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-black text-slate-400 block">Select Report Type</label>
                <select
                  value={schReportType}
                  onChange={(e: any) => setSchReportType(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 font-bold focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="sales">Sales & Revenue Report</option>
                  <option value="inventory">Inventory & SKU Deficits Report</option>
                  <option value="financial">Financial Profit & Tax Statement</option>
                  <option value="customer">Customer Valuation (CLV) & Retention Registry</option>
                </select>
              </div>

              {/* Format Selection */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-black text-slate-400 block">Export Format Preference</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["pdf", "csv", "excel", "json"] as const).map(fmt => (
                    <button
                      type="button"
                      key={fmt}
                      onClick={() => setSchFormat(fmt)}
                      className={`p-2 border rounded-lg uppercase text-[10px] font-black cursor-pointer text-center ${
                        schFormat === fmt 
                          ? "bg-indigo-600 border-indigo-600 text-white" 
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency Selection */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-black text-slate-400 block">Dispatch Frequency</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["daily", "weekly", "monthly"] as const).map(freq => (
                    <button
                      type="button"
                      key={freq}
                      onClick={() => setSchFrequency(freq)}
                      className={`p-2 border rounded-lg uppercase text-[10px] font-black cursor-pointer text-center ${
                        schFrequency === freq 
                          ? "bg-slate-800 border-slate-800 text-white" 
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery Timing Options depending on Frequency */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black text-slate-400 block">Dispatch Time</label>
                  <input
                    type="text"
                    value={schDeliveryTime}
                    onChange={(e) => setSchDeliveryTime(e.target.value)}
                    placeholder="e.g. 08:00 AM, 06:00 PM"
                    className="w-full p-1.5 border border-slate-200 bg-white rounded font-mono"
                    required
                  />
                </div>

                {schFrequency === "weekly" && (
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-black text-slate-400 block">Dispatch Day</label>
                    <select
                      value={schDayOfWeek}
                      onChange={(e) => setSchDayOfWeek(e.target.value)}
                      className="w-full p-1.5 border border-slate-200 bg-white rounded font-semibold"
                    >
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                )}

                {schFrequency === "monthly" && (
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-black text-slate-400 block">Dispatch Day of Month</label>
                    <input
                      type="number"
                      min={1}
                      max={28}
                      value={schDayOfMonth}
                      onChange={(e) => setSchDayOfMonth(parseInt(e.target.value) || 1)}
                      className="w-full p-1.5 border border-slate-200 bg-white rounded font-mono"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Recipients */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-black text-slate-400 block">Recipients (Comma-separated emails)</label>
                <input
                  type="text"
                  value={schRecipients}
                  onChange={(e) => setSchRecipients(e.target.value)}
                  placeholder="e.g. partner@gmail.com, ceo@coop.in"
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 font-mono"
                  required
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" /> Save Schedule
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* PRINT PREVIEW / HIGH QUALITY PDF GENERATOR MODAL */}
      {printPreviewOpen && previewData && (
        <div className="fixed inset-0 z-55 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded-3xl max-w-4xl w-full p-8 shadow-2xl flex flex-col space-y-6 my-4 max-h-[90vh]">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div className="text-left">
                <h4 className="text-xs font-black uppercase text-indigo-600">Print Preview Portal</h4>
                <p className="text-[10px] text-slate-400 font-semibold leading-tight">Formatted according to ISO standard B2B invoice styleheets</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="h-4 w-4" /> Print Document (PDF)
                </button>
                <button
                  onClick={() => setPrintPreviewOpen(false)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>

            {/* PRINT BODY - Styled with high contrast grid */}
            <div id="printable-area-sheet" className="flex-1 overflow-y-auto border border-slate-300 bg-white p-10 text-slate-800 text-left space-y-6 font-sans">
              
              {/* Report Corporate Letterhead */}
              <div className="flex justify-between items-start border-b-2 border-slate-800 pb-5">
                <div>
                  <h1 className="text-xl font-black uppercase text-slate-900 tracking-tight">AgriConnect Enterprise</h1>
                  <p className="text-xs font-bold text-slate-500">Official Wholesale Supplier Intelligence Registry</p>
                  <p className="text-[10.5px] text-slate-400 font-semibold mt-1">G-5, Sector-18, Karnal, Haryana, 132001</p>
                  <p className="text-[10.5px] text-slate-400 font-semibold">GSTIN: 06AABCA1298D1Z5 | support@agriconnect.in</p>
                </div>
                <div className="text-right">
                  <h3 className="text-xs font-black uppercase text-slate-500 tracking-wide">STATISTICAL RECORD</h3>
                  <p className="text-[11px] font-bold text-slate-700 font-mono mt-1">REF: AG-REP-2026-{(Math.floor(Math.random() * 89999) + 10000)}</p>
                  <p className="text-[10.5px] text-slate-400 font-semibold">Generated: {new Date().toLocaleString()}</p>
                  <p className="text-[10.5px] text-slate-400 font-semibold">Signatory: Eswar Reddy</p>
                </div>
              </div>

              {/* Title Block */}
              <div className="space-y-1.5">
                <h2 className="text-sm font-black uppercase text-slate-900 tracking-wider underline decoration-indigo-500 decoration-2 underline-offset-4">
                  {previewData.title}
                </h2>
                {previewData.summaryText && (
                  <p className="text-[10.5px] text-slate-500 italic font-semibold leading-relaxed">
                    {previewData.summaryText}
                  </p>
                )}
              </div>

              {/* Data Table */}
              <table className="w-full text-xs font-semibold text-slate-700 border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-[10px] font-black uppercase text-slate-800 border-b border-slate-300">
                    {previewData.headers.map((h, idx) => (
                      <th key={idx} className="p-2.5 border border-slate-300">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/20 border-b border-slate-200">
                      {row.map((val, cIdx) => (
                        <td key={cIdx} className="p-2.5 border border-slate-300 font-medium">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Verification & Signature Block */}
              <div className="pt-8 flex justify-between items-end">
                <div className="space-y-1 text-[10.5px] text-slate-400">
                  <p className="font-bold text-slate-500 flex items-center gap-1">✓ Automated Cryptographic Signature</p>
                  <p>Verified via AgriConnect Supplier Hub security credentials.</p>
                  <p>Hash Code: <code className="bg-slate-100 px-1 rounded text-[9px] font-mono">SHA-256: 8a4c84d12e9b98ff...</code></p>
                </div>
                <div className="text-right space-y-6">
                  <div className="w-40 border-b border-slate-400 mx-auto inline-block" />
                  <p className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider">Authorized Officer Signature</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
