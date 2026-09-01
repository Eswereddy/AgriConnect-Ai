import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Scale,
  Receipt,
  Truck,
  Info,
  ShieldCheck,
  Coins,
  DollarSign,
  Activity,
  Percent,
  MapPin,
  Users,
  Layers,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Filter,
  Globe,
  RefreshCw,
  FileSpreadsheet,
  Building2,
  CalendarDays,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Check,
  Plus,
  ArrowRight,
  Search,
  FileText,
  CreditCard,
  Link
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Mock financial dataset with regions, timeframe models, and breakdown slices
const REVENUE_DATA_SETS = {
  month: {
    label: "This Month (July 2026)",
    grossRevenue: 1245000,
    priorRevenue: 1110000,
    growthRate: 12.16,
    targetRevenue: 1200000,
    avgOrderValue: 24900,
    activeCustomers: 48,
    categories: [
      { name: "Organic Seeds", value: 373500, percentage: 30, color: "#4f46e5" },
      { name: "Bio-Fertilizers", value: 435750, percentage: 35, color: "#10b981" },
      { name: "IoT Crop Sensors", value: 249000, percentage: 20, color: "#f59e0b" },
      { name: "Heavy Machinery", value: 186750, percentage: 15, color: "#ec4899" }
    ],
    customers: [
      { name: "GreenValley Co-op", amount: 410000, orders: 12, region: "North" },
      { name: "Punjab Organic Farms", amount: 320000, orders: 9, region: "North" },
      { name: "Pioneer Agritech Ltd", amount: 220000, orders: 6, region: "West" },
      { name: "Deccan Crop Producers", amount: 180000, orders: 5, region: "South" },
      { name: "Sahyadri Agri Solutions", amount: 115000, orders: 3, region: "West" }
    ],
    regions: [
      { id: "North", name: "Punjab & Haryana (North)", amount: 480000, percentage: 38.5, growth: 14.2 },
      { id: "West", name: "Maharashtra & Gujarat (West)", amount: 360000, percentage: 28.9, growth: 10.8 },
      { id: "South", name: "Karnataka & AP (South)", amount: 245000, percentage: 19.7, growth: 9.3 },
      { id: "East", name: "Bihar & West Bengal (East)", amount: 90000, percentage: 7.2, growth: -2.1 },
      { id: "Central", name: "Madhya Pradesh (Central)", amount: 70000, percentage: 5.7, growth: 5.4 }
    ],
    trends: [
      { period: "Day 1-5", current: 180000, prior: 160000 },
      { period: "Day 6-10", current: 210000, prior: 190000 },
      { period: "Day 11-15", current: 240000, prior: 220000 },
      { period: "Day 16-20", current: 195000, prior: 180000 },
      { period: "Day 21-25", current: 225000, prior: 200000 },
      { period: "Day 26-30", current: 195000, prior: 160000 }
    ]
  },
  quarter: {
    label: "This Quarter (Q2 2026)",
    grossRevenue: 3680000,
    priorRevenue: 3390000,
    growthRate: 8.55,
    targetRevenue: 3500000,
    avgOrderValue: 28300,
    activeCustomers: 124,
    categories: [
      { name: "Organic Seeds", value: 1104000, percentage: 30, color: "#4f46e5" },
      { name: "Bio-Fertilizers", value: 1214400, percentage: 33, color: "#10b981" },
      { name: "IoT Crop Sensors", value: 662400, percentage: 18, color: "#f59e0b" },
      { name: "Heavy Machinery", value: 699200, percentage: 19, color: "#ec4899" }
    ],
    customers: [
      { name: "GreenValley Co-op", amount: 1180000, orders: 38, region: "North" },
      { name: "Punjab Organic Farms", amount: 920000, orders: 27, region: "North" },
      { name: "Pioneer Agritech Ltd", amount: 650000, orders: 19, region: "West" },
      { name: "Deccan Crop Producers", amount: 510000, orders: 15, region: "South" },
      { name: "Sahyadri Agri Solutions", amount: 420000, orders: 11, region: "West" }
    ],
    regions: [
      { id: "North", name: "Punjab & Haryana (North)", amount: 1420000, percentage: 38.6, growth: 9.8 },
      { id: "West", name: "Maharashtra & Gujarat (West)", amount: 1050000, percentage: 28.5, growth: 8.2 },
      { id: "South", name: "Karnataka & AP (South)", amount: 720000, percentage: 19.6, growth: 7.1 },
      { id: "East", name: "Bihar & West Bengal (East)", amount: 280000, percentage: 7.6, growth: 1.4 },
      { id: "Central", name: "Madhya Pradesh (Central)", amount: 210000, percentage: 5.7, growth: 4.8 }
    ],
    trends: [
      { period: "Week 1-2", current: 540000, prior: 500000 },
      { period: "Week 3-4", current: 580000, prior: 530000 },
      { period: "Week 5-6", current: 610000, prior: 560000 },
      { period: "Week 7-8", current: 590000, prior: 540000 },
      { period: "Week 9-10", current: 670000, prior: 610000 },
      { period: "Week 11-12", current: 690000, prior: 650000 }
    ]
  },
  year: {
    label: "This Year (FY 2026)",
    grossRevenue: 14850000,
    priorRevenue: 12900000,
    growthRate: 15.12,
    targetRevenue: 14000000,
    avgOrderValue: 31200,
    activeCustomers: 340,
    categories: [
      { name: "Organic Seeds", value: 4158000, percentage: 28, color: "#4f46e5" },
      { name: "Bio-Fertilizers", value: 4752000, percentage: 32, color: "#10b981" },
      { name: "IoT Crop Sensors", value: 2673000, percentage: 18, color: "#f59e0b" },
      { name: "Heavy Machinery", value: 3267000, percentage: 22, color: "#ec4899" }
    ],
    customers: [
      { name: "GreenValley Co-op", amount: 4650000, orders: 142, region: "North" },
      { name: "Punjab Organic Farms", amount: 3720000, orders: 110, region: "North" },
      { name: "Pioneer Agritech Ltd", amount: 2680000, orders: 84, region: "West" },
      { name: "Deccan Crop Producers", amount: 2050000, orders: 62, region: "South" },
      { name: "Sahyadri Agri Solutions", amount: 1750000, orders: 51, region: "West" }
    ],
    regions: [
      { id: "North", name: "Punjab & Haryana (North)", amount: 5650000, percentage: 38.0, growth: 16.4 },
      { id: "West", name: "Maharashtra & Gujarat (West)", amount: 4250000, percentage: 28.6, growth: 14.1 },
      { id: "South", name: "Karnataka & AP (South)", amount: 2920000, percentage: 19.7, growth: 12.8 },
      { id: "East", name: "Bihar & West Bengal (East)", amount: 1080000, percentage: 7.3, growth: 8.5 },
      { id: "Central", name: "Madhya Pradesh (Central)", amount: 950000, percentage: 6.4, growth: 10.2 }
    ],
    trends: [
      { period: "Jan-Feb", current: 2100000, prior: 1800000 },
      { period: "Mar-Apr", current: 2450000, prior: 2150000 },
      { period: "May-Jun", current: 2780000, prior: 2400000 },
      { period: "Jul-Aug", current: 2320000, prior: 2050000 },
      { period: "Sep-Oct", current: 2600000, prior: 2250000 },
      { period: "Nov-Dec", current: 2600000, prior: 2250000 }
    ]
  }
};

export default function RevenueDashboard() {
  const [timeframe, setTimeframe] = useState<"month" | "quarter" | "year">("month");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<"PDF" | "CSV">("CSV");
  const [exportSuccess, setExportSuccess] = useState("");
  const [subTab, setSubTab] = useState<"revenue" | "profit" | "payments" | "taxes">("revenue");

  // Types for payment tracking
  interface OrderPayment {
    id: string;
    customerName: string;
    amount: number;
    dueDate: string;
    orderDate: string;
    status: "Pending" | "Overdue" | "Paid";
    cropVariety: string;
  }

  interface BankTransaction {
    id: string;
    sender: string;
    amount: number;
    receivedDate: string;
    status: "Unreconciled" | "Reconciled";
  }

  interface PaymentHistoryRecord {
    id: string;
    orderId: string;
    customerName: string;
    amount: number;
    paidDate: string;
    method: string;
    reference: string;
  }

  // Payment tracking states
  const [orders, setOrders] = useState<OrderPayment[]>([
    { id: "ORD-2026-089", customerName: "Pioneer Agritech Ltd", amount: 124500, orderDate: "2026-06-15", dueDate: "2026-07-05", status: "Overdue", cropVariety: "LoRaWAN Smart Soil Moisture Probes" },
    { id: "ORD-2026-092", customerName: "Punjab Organic Farms", amount: 320000, orderDate: "2026-06-28", dueDate: "2026-07-15", status: "Pending", cropVariety: "Nano-Urea Liquid Bio-fertilizer" },
    { id: "ORD-2026-095", customerName: "GreenValley Co-op", amount: 410000, orderDate: "2026-07-01", dueDate: "2026-07-20", status: "Pending", cropVariety: "Premium Hybrid Maize Seeds (F1)" },
    { id: "ORD-2026-085", customerName: "Hari Singh Estates", amount: 950000, orderDate: "2026-06-05", dueDate: "2026-06-25", status: "Overdue", cropVariety: "Autonomous Solar Pest Traps (v3)" },
    { id: "ORD-2026-098", customerName: "Krishi Cooperative Soc", amount: 150000, orderDate: "2026-07-05", dueDate: "2026-07-25", status: "Pending", cropVariety: "Cold-Storage Smart Node Sensors" },
    { id: "ORD-2026-101", customerName: "Deccan Crop Producers", amount: 180000, orderDate: "2026-07-08", dueDate: "2026-07-28", status: "Pending", cropVariety: "Bacterial Blight Resilient Rice Seedlings" }
  ]);

  const [transactions, setTransactions] = useState<BankTransaction[]>([
    { id: "TXN-REF-8910", sender: "Pioneer Agritech Ltd (Direct RTGS)", amount: 124500, receivedDate: "2026-07-08", status: "Unreconciled" },
    { id: "TXN-REF-9022", sender: "GreenValley Co-op (NEFT transfer)", amount: 410000, receivedDate: "2026-07-09", status: "Unreconciled" },
    { id: "TXN-REF-7121", sender: "Punjab Organic Farms (RTGS transfer)", amount: 320000, receivedDate: "2026-07-09", status: "Unreconciled" },
    { id: "TXN-REF-5034", sender: "Hari Singh Estates (IMPS check)", amount: 950000, receivedDate: "2026-07-09", status: "Unreconciled" }
  ]);

  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryRecord[]>([
    { id: "PAY-001", orderId: "ORD-2026-078", customerName: "Deccan Crop Producers", amount: 180000, paidDate: "2026-06-28", method: "RTGS Bank Transfer", reference: "TXN-REF-3011" },
    { id: "PAY-002", orderId: "ORD-2026-081", customerName: "Sahyadri Agri Solutions", amount: 115000, paidDate: "2026-07-02", method: "NEFT Bank Transfer", reference: "TXN-REF-4091" },
    { id: "PAY-003", orderId: "ORD-2026-083", customerName: "Krishi Cooperative Soc", amount: 210000, paidDate: "2026-07-04", method: "UPI Instant Settlement", reference: "TXN-REF-5110" }
  ]);

  const [selectedTxn, setSelectedTxn] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [reconToast, setReconToast] = useState<string>("");
  const [reconSearchTerm, setReconSearchTerm] = useState<string>("");

  // Reconcile selected bank transaction with selected order
  const handleReconcile = (txnId: string, orderId: string) => {
    const txn = transactions.find(t => t.id === txnId);
    const order = orders.find(o => o.id === orderId);

    if (!txn || !order) return;

    // Update order status to paid
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "Paid" } : o));

    // Remove bank transaction from unreconciled list
    setTransactions(prev => prev.filter(t => t.id !== txnId));

    // Create a payment history record
    const newPayment: PaymentHistoryRecord = {
      id: `PAY-${Date.now().toString().slice(-3)}`,
      orderId: order.id,
      customerName: order.customerName,
      amount: txn.amount,
      paidDate: new Date().toISOString().slice(0, 10),
      method: txn.sender.includes("RTGS") ? "RTGS Bank Transfer" : txn.sender.includes("NEFT") ? "NEFT Bank Transfer" : "IMPS Bank Settlement",
      reference: txn.id
    };

    setPaymentHistory(prev => [newPayment, ...prev]);
    setSelectedTxn(null);
    setSelectedOrder(null);
    setReconToast(`Successfully reconciled Order ${order.id} with Receipt ${txn.id} for ₹${txn.amount.toLocaleString("en-IN")}!`);
    
    // Auto clear toast after 4s
    setTimeout(() => {
      setReconToast("");
    }, 4000);
  };

  // Auto suggest / Auto Match function
  const handleAutoMatch = (txnId: string) => {
    const txn = transactions.find(t => t.id === txnId);
    if (!txn) return;

    // Search for a pending or overdue order with exact amount match
    const matchingOrder = orders.find(o => o.status !== "Paid" && o.amount === txn.amount);
    
    if (matchingOrder) {
      handleReconcile(txnId, matchingOrder.id);
    } else {
      setReconToast(`No precise matching pending order found for ₹${txn.amount.toLocaleString("en-IN")}. Please reconcile manually.`);
      setTimeout(() => setReconToast(""), 4000);
    }
  };

  // Dynamic sliders for Profit calculation parameters
  const [shippingRate, setShippingRate] = useState<number>(6); // default 6%
  const [taxRate, setTaxRate] = useState<number>(12); // default 12%
  const [platformFeesRate, setPlatformFeesRate] = useState<number>(4); // default 4%
  const [discountRate, setDiscountRate] = useState<number>(5); // default 5%

  // GST Tax Management types
  interface TaxRecord {
    id: string; // Invoice or Purchase Order ID
    partnerName: string; // Customer or Supplier Name
    date: string;
    itemDescription: string;
    hsnCode: string;
    taxableValue: number;
    gstRate: number; // e.g. 5, 12, 18
    placeOfSupply: string; // State of transaction (determines SGST+CGST vs IGST)
    type: "Sales" | "Purchase";
  }

  // Initial Tax Records
  const [taxRecords, setTaxRecords] = useState<TaxRecord[]>([
    // Sales Records (Output GST)
    { id: "INV-2026-441", partnerName: "Pioneer Agritech Ltd", date: "2026-06-15", itemDescription: "LoRaWAN Smart Soil Moisture Probes", hsnCode: "9015", taxableValue: 105500, gstRate: 18, placeOfSupply: "Karnataka", type: "Sales" },
    { id: "INV-2026-442", partnerName: "Punjab Organic Farms", date: "2026-06-28", itemDescription: "Nano-Urea Liquid Bio-fertilizer", hsnCode: "3105", taxableValue: 285700, gstRate: 12, placeOfSupply: "Punjab", type: "Sales" },
    { id: "INV-2026-443", partnerName: "GreenValley Co-op", date: "2026-07-01", itemDescription: "Premium Hybrid Maize Seeds (F1)", hsnCode: "1209", taxableValue: 390400, gstRate: 5, placeOfSupply: "Haryana", type: "Sales" },
    { id: "INV-2026-444", partnerName: "Hari Singh Estates", date: "2026-06-05", itemDescription: "Autonomous Solar Pest Traps (v3)", hsnCode: "8424", taxableValue: 805000, gstRate: 12, placeOfSupply: "Punjab", type: "Sales" },
    { id: "INV-2026-445", partnerName: "Krishi Cooperative Soc", date: "2026-07-05", itemDescription: "Cold-Storage Smart Node Sensors", hsnCode: "9015", taxableValue: 127100, gstRate: 18, placeOfSupply: "Maharashtra", type: "Sales" },
    { id: "INV-2026-446", partnerName: "Deccan Crop Producers", date: "2026-07-08", itemDescription: "Bacterial Blight Resilient Rice Seedlings", hsnCode: "1209", taxableValue: 171400, gstRate: 5, placeOfSupply: "Andhra Pradesh", type: "Sales" },
    
    // Purchases (Input Tax Credit / ITC)
    { id: "PUR-2026-050", partnerName: "SemTech Chipsets India", date: "2026-06-10", itemDescription: "Radio Transceiver IC chips for IoT", hsnCode: "9015", taxableValue: 45000, gstRate: 18, placeOfSupply: "Karnataka", type: "Purchase" },
    { id: "PUR-2026-051", partnerName: "Nagarjuna Chemicals Ltd", date: "2026-06-20", itemDescription: "Concentrated Bio-Chemical Base", hsnCode: "3105", taxableValue: 120000, gstRate: 12, placeOfSupply: "Punjab", type: "Purchase" },
    { id: "PUR-2026-052", partnerName: "Apex Drone Frame Labs", date: "2026-06-25", itemDescription: "Carbon Fiber Drone Chassis", hsnCode: "8424", taxableValue: 350000, gstRate: 18, placeOfSupply: "Tamil Nadu", type: "Purchase" },
    { id: "PUR-2026-053", partnerName: "Indo-American Seed Breeders", date: "2026-07-02", itemDescription: "Parent Breeder Seeds (Inbred Line)", hsnCode: "1209", taxableValue: 80000, gstRate: 5, placeOfSupply: "Punjab", type: "Purchase" },
    { id: "PUR-2026-054", partnerName: "Zenith IoT Enclosures", date: "2026-07-04", itemDescription: "Waterproof IP67 Plastic Injection Casings", hsnCode: "9015", taxableValue: 25000, gstRate: 18, placeOfSupply: "Maharashtra", type: "Purchase" }
  ]);

  // Filters for Tax tab
  const [taxFilterType, setTaxFilterType] = useState<"All" | "Sales" | "Purchase">("All");
  const [taxFilterPeriod, setTaxFilterPeriod] = useState<"All" | "June" | "July">("All");
  const [taxFilterHSN, setTaxFilterHSN] = useState<"All" | "1209" | "3105" | "9015" | "8424">("All");

  // Form states for adding a new invoice/PO and auto-calculating GST
  const [showAddTaxModal, setShowAddTaxModal] = useState(false);
  const [newTaxPartner, setNewTaxPartner] = useState("");
  const [newTaxDate, setNewTaxDate] = useState(new Date().toISOString().slice(0, 10));
  const [newTaxDesc, setNewTaxDesc] = useState("");
  const [newTaxHsn, setNewTaxHsn] = useState("1209");
  const [newTaxValue, setNewTaxValue] = useState<string>("50000");
  const [newTaxRate, setNewTaxRate] = useState<number>(12);
  const [newTaxState, setNewTaxState] = useState("Punjab");
  const [newTaxType, setNewTaxType] = useState<"Sales" | "Purchase">("Sales");
  const [newTaxSuccess, setNewTaxSuccess] = useState("");

  // Simulated GST filing state
  const [filingPeriod, setFilingPeriod] = useState<"Q1-2026" | "June-2026" | "July-2026">("June-2026");
  const [filingSuccessMsg, setFilingSuccessMsg] = useState("");

  // Helper to add new computed tax record
  const handleAddTaxRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaxPartner || !newTaxDesc) return;

    const value = parseFloat(newTaxValue) || 0;
    const isSales = newTaxType === "Sales";
    const prefix = isSales ? "INV-2026-" : "PUR-2026-";
    const generatedId = `${prefix}${Math.floor(100 + Math.random() * 900)}`;

    const newRecord: TaxRecord = {
      id: generatedId,
      partnerName: newTaxPartner,
      date: newTaxDate,
      itemDescription: newTaxDesc,
      hsnCode: newTaxHsn,
      taxableValue: value,
      gstRate: newTaxRate,
      placeOfSupply: newTaxState,
      type: newTaxType
    };

    setTaxRecords(prev => [newRecord, ...prev]);
    setNewTaxPartner("");
    setNewTaxDesc("");
    setNewTaxSuccess(`Successfully generated and posted transaction ${generatedId} with GST calculated automatically!`);

    setTimeout(() => {
      setNewTaxSuccess("");
      setShowAddTaxModal(false);
    }, 3000);
  };

  // Memoized GST calculations
  const computedRecords = useMemo(() => {
    return taxRecords.map(r => {
      const isLocal = r.placeOfSupply === "Punjab";
      const cgst = isLocal ? r.taxableValue * (r.gstRate / 100) / 2 : 0;
      const sgst = isLocal ? r.taxableValue * (r.gstRate / 100) / 2 : 0;
      const igst = !isLocal ? r.taxableValue * (r.gstRate / 100) : 0;
      const totalTax = cgst + sgst + igst;
      return {
        ...r,
        cgst,
        sgst,
        igst,
        totalTax,
        grossValue: r.taxableValue + totalTax,
        month: r.date.split("-")[1] === "06" ? "June" : "July"
      };
    });
  }, [taxRecords]);

  // Filtered computed records for tables
  const filteredTaxRecords = useMemo(() => {
    return computedRecords.filter(r => {
      const typeMatch = taxFilterType === "All" || r.type === taxFilterType;
      const periodMatch = taxFilterPeriod === "All" || r.month === taxFilterPeriod;
      const hsnMatch = taxFilterHSN === "All" || r.hsnCode === taxFilterHSN;
      return typeMatch && periodMatch && hsnMatch;
    });
  }, [computedRecords, taxFilterType, taxFilterPeriod, taxFilterHSN]);

  // Output Tax calculations (Sales)
  const salesSummary = useMemo(() => {
    const sales = computedRecords.filter(r => r.type === "Sales");
    const taxable = sales.reduce((sum, r) => sum + r.taxableValue, 0);
    const cgst = sales.reduce((sum, r) => sum + r.cgst, 0);
    const sgst = sales.reduce((sum, r) => sum + r.sgst, 0);
    const igst = sales.reduce((sum, r) => sum + r.igst, 0);
    const totalTax = cgst + sgst + igst;
    return { taxable, cgst, sgst, igst, totalTax };
  }, [computedRecords]);

  // Input Tax Credit calculations (Purchases)
  const purchaseSummary = useMemo(() => {
    const purchases = computedRecords.filter(r => r.type === "Purchase");
    const taxable = purchases.reduce((sum, r) => sum + r.taxableValue, 0);
    const cgst = purchases.reduce((sum, r) => sum + r.cgst, 0);
    const sgst = purchases.reduce((sum, r) => sum + r.sgst, 0);
    const igst = purchases.reduce((sum, r) => sum + r.igst, 0);
    const totalTax = cgst + sgst + igst;
    return { taxable, cgst, sgst, igst, totalTax };
  }, [computedRecords]);

  // HSN-wise grouped report for outward (Sales) and inward (Purchases)
  const hsnGroupedReport = useMemo(() => {
    const categories: { [key: string]: { name: string; hsn: string; rate: number; salesTaxable: number; salesCGST: number; salesSGST: number; salesIGST: number; purchaseTaxable: number; purchaseCGST: number; purchaseSGST: number; purchaseIGST: number } } = {
      "1209": { name: "Hybrid Agri Seeds", hsn: "1209", rate: 5, salesTaxable: 0, salesCGST: 0, salesSGST: 0, salesIGST: 0, purchaseTaxable: 0, purchaseCGST: 0, purchaseSGST: 0, purchaseIGST: 0 },
      "3105": { name: "Bio-Fertilizers / Nano-Urea", hsn: "3105", rate: 12, salesTaxable: 0, salesCGST: 0, salesSGST: 0, salesIGST: 0, purchaseTaxable: 0, purchaseCGST: 0, purchaseSGST: 0, purchaseIGST: 0 },
      "9015": { name: "IoT Node Sensors & Probes", hsn: "9015", rate: 18, salesTaxable: 0, salesCGST: 0, salesSGST: 0, salesIGST: 0, purchaseTaxable: 0, purchaseCGST: 0, purchaseSGST: 0, purchaseIGST: 0 },
      "8424": { name: "Agricultural Drones & Sprayers", hsn: "8424", rate: 12, salesTaxable: 0, salesCGST: 0, salesSGST: 0, salesIGST: 0, purchaseTaxable: 0, purchaseCGST: 0, purchaseSGST: 0, purchaseIGST: 0 },
    };

    computedRecords.forEach(r => {
      const cat = categories[r.hsnCode];
      if (cat) {
        if (r.type === "Sales") {
          cat.salesTaxable += r.taxableValue;
          cat.salesCGST += r.cgst;
          cat.salesSGST += r.sgst;
          cat.salesIGST += r.igst;
        } else {
          cat.purchaseTaxable += r.taxableValue;
          cat.purchaseCGST += r.cgst;
          cat.purchaseSGST += r.sgst;
          cat.purchaseIGST += r.igst;
        }
      }
    });

    return Object.values(categories);
  }, [computedRecords]);

  // Retrieve current active dataset
  const dataset = useMemo(() => REVENUE_DATA_SETS[timeframe], [timeframe]);

  // Handle region filtering multiplier effect to make the dashboard highly interactive
  const filteredMetrics = useMemo(() => {
    if (selectedRegion === "All") {
      return {
        grossRevenue: dataset.grossRevenue,
        priorRevenue: dataset.priorRevenue,
        growthRate: dataset.growthRate,
        targetRevenue: dataset.targetRevenue,
        activeCustomers: dataset.activeCustomers,
        avgOrderValue: dataset.avgOrderValue,
        categories: dataset.categories,
        customers: dataset.customers,
        trends: dataset.trends
      };
    }

    // Filter by selected region
    const rData = dataset.regions.find(r => r.id === selectedRegion);
    const multiplier = rData ? rData.amount / dataset.grossRevenue : 1;

    const scaledCategories = dataset.categories.map(c => ({
      ...c,
      value: Math.round(c.value * multiplier)
    }));

    const scaledTrends = dataset.trends.map(t => ({
      ...t,
      current: Math.round(t.current * multiplier),
      prior: Math.round(t.prior * multiplier)
    }));

    const regionCustomers = dataset.customers.filter(c => c.region === selectedRegion);

    return {
      grossRevenue: rData ? rData.amount : 0,
      priorRevenue: Math.round(dataset.priorRevenue * multiplier),
      growthRate: rData ? rData.growth : 0,
      targetRevenue: Math.round(dataset.targetRevenue * multiplier),
      activeCustomers: regionCustomers.length || Math.round(dataset.activeCustomers * multiplier),
      avgOrderValue: Math.round(dataset.avgOrderValue * (0.9 + Math.random() * 0.2)),
      categories: scaledCategories,
      customers: regionCustomers.length ? regionCustomers : dataset.customers.slice(0, 3),
      trends: scaledTrends
    };
  }, [dataset, selectedRegion]);

  // Top 10 Products with custom base parameters, scaled and calculated interactively
  const productsProfitData = useMemo(() => {
    const totalRev = filteredMetrics.grossRevenue;

    const baseProducts = [
      { id: 1, name: "Premium Hybrid Maize Seeds (F1)", share: 0.22, cogsRate: 0.32 },
      { id: 2, name: "Nano-Urea Liquid Bio-fertilizer", share: 0.18, cogsRate: 0.38 },
      { id: 3, name: "LoRaWAN Smart Soil Moisture Probes", share: 0.14, cogsRate: 0.52 },
      { id: 4, name: "Autonomous Solar Pest Traps (v3)", share: 0.12, cogsRate: 0.48 },
      { id: 5, name: "Cold-Storage Smart Node Sensors", share: 0.10, cogsRate: 0.45 },
      { id: 6, name: "Bacterial Blight Resilient Rice Seedlings", share: 0.08, cogsRate: 0.28 },
      { id: 7, name: "Drone Multispectral Camera Attachment", share: 0.06, cogsRate: 0.58 },
      { id: 8, name: "Mycorrhizal Bio-stimulant Powder", share: 0.04, cogsRate: 0.35 },
      { id: 9, name: "Organic Trichoderma Bio-fungicide", share: 0.03, cogsRate: 0.34 },
      { id: 10, name: "Tractor-mounted IoT Fuel Flowmeters", share: 0.03, cogsRate: 0.50 }
    ];

    return baseProducts.map(p => {
      const revenue = Math.round(totalRev * p.share);
      const cogs = Math.round(revenue * p.cogsRate);
      const grossProfit = revenue - cogs;
      
      const shipping = Math.round(revenue * (shippingRate / 100));
      const taxes = Math.round(revenue * (taxRate / 100));
      const fees = Math.round(revenue * (platformFeesRate / 100));
      const discounts = Math.round(revenue * (discountRate / 100));

      const netProfit = grossProfit - (shipping + taxes + fees + discounts);
      const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
      const netMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

      return {
        ...p,
        revenue,
        cogs,
        grossProfit,
        shipping,
        taxes,
        fees,
        discounts,
        netProfit,
        grossMargin,
        netMargin
      };
    }).sort((a, b) => b.netProfit - a.netProfit);
  }, [filteredMetrics.grossRevenue, shippingRate, taxRate, platformFeesRate, discountRate]);

  // Aggregate profit summaries
  const profitSummary = useMemo(() => {
    let totalRev = 0;
    let totalCogs = 0;
    let totalGrossProfit = 0;
    let totalShipping = 0;
    let totalTaxes = 0;
    let totalFees = 0;
    let totalDiscounts = 0;
    let totalNetProfit = 0;

    productsProfitData.forEach(p => {
      totalRev += p.revenue;
      totalCogs += p.cogs;
      totalGrossProfit += p.grossProfit;
      totalShipping += p.shipping;
      totalTaxes += p.taxes;
      totalFees += p.fees;
      totalDiscounts += p.discounts;
      totalNetProfit += p.netProfit;
    });

    const averageNetMargin = totalRev > 0 ? (totalNetProfit / totalRev) * 100 : 0;
    const averageGrossMargin = totalRev > 0 ? (totalGrossProfit / totalRev) * 100 : 0;

    return {
      totalRev,
      totalCogs,
      totalGrossProfit,
      totalShipping,
      totalTaxes,
      totalFees,
      totalDiscounts,
      totalNetProfit,
      averageNetMargin,
      averageGrossMargin
    };
  }, [productsProfitData]);

  const handleExport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(`🎉 Successfully generated and dispatched Agritech Revenue ${exportFormat} statement!`);
      setTimeout(() => setExportSuccess(""), 4500);
    }, 1200);
  };

  return (
    <div id="revenue-dashboard-main" className="space-y-6">
      
      {/* HEADER CONTROLS CARD */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-left space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
              <Coins className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Institutional Revenue & Financial Services Suite</h2>
          </div>
          <p className="text-xs text-slate-400">
            Frictionless tracking of sovereign agritech sales, micro-finance transaction pipelines, and regional market clearances.
          </p>
        </div>

        {/* Filters and Controls Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Timeframe selector */}
          <div className="flex items-center bg-slate-50 border border-slate-150 rounded-2xl p-1">
            <button
              onClick={() => setTimeframe("month")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                timeframe === "month"
                  ? "bg-white text-indigo-600 shadow-xs"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeframe("quarter")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                timeframe === "quarter"
                  ? "bg-white text-indigo-600 shadow-xs"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Quarter
            </button>
            <button
              onClick={() => setTimeframe("year")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                timeframe === "year"
                  ? "bg-white text-indigo-600 shadow-xs"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Year
            </button>
          </div>

          {/* Region selector dropdown */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-150 rounded-2xl px-3 py-1.5 text-xs text-slate-700 font-bold">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-transparent border-0 focus:outline-none cursor-pointer"
            >
              <option value="All">All Regions</option>
              <option value="North">Punjab & Haryana (North)</option>
              <option value="West">Maharashtra & Gujarat (West)</option>
              <option value="South">Karnataka & AP (South)</option>
              <option value="East">Bihar & West Bengal (East)</option>
              <option value="Central">Madhya Pradesh (Central)</option>
            </select>
          </div>

          {/* Export utility button */}
          <button
            onClick={() => {
              setExportSuccess("");
              const modal = document.getElementById("export-financial-modal");
              if (modal) modal.classList.remove("hidden");
            }}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider rounded-2xl cursor-pointer border-0 shadow-xs flex items-center gap-1.5"
          >
            <Download className="h-4 w-4" /> Export Report
          </button>
        </div>
      </div>

      {exportSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-800 text-xs font-extrabold text-left animate-slideDown flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span>{exportSuccess}</span>
        </div>
      )}

      {/* NAVIGATION TABS FOR REVENUE vs PROFIT */}
      <div className="flex border-b border-slate-100 bg-white p-1 rounded-2xl shadow-sm gap-1 w-full sm:w-fit text-left">
        <button
          onClick={() => setSubTab("revenue")}
          className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border-0 ${
            subTab === "revenue"
              ? "bg-indigo-50 text-indigo-700 shadow-sm"
              : "bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          Revenue Streams
        </button>
        <button
          onClick={() => setSubTab("profit")}
          className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border-0 ${
            subTab === "profit"
              ? "bg-emerald-50 text-emerald-700 shadow-sm"
              : "bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Coins className="h-4 w-4" />
          Profit Analytics & Margins
        </button>
        <button
          onClick={() => setSubTab("payments")}
          className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border-0 ${
            subTab === "payments"
              ? "bg-amber-50 text-amber-700 shadow-sm"
              : "bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          }`}
        >
          <CreditCard className="h-4 w-4" />
          Payment Tracking & Reconciliation
        </button>
        <button
          onClick={() => setSubTab("taxes")}
          className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border-0 ${
            subTab === "taxes"
              ? "bg-indigo-50 text-indigo-700 shadow-sm"
              : "bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Percent className="h-4 w-4" />
          Tax Management & GST Filing
        </button>
      </div>

      {subTab === "revenue" && (
        <>
          {/* REVENUE OVERVIEW METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1: Gross Revenue */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-indigo-300 transition-all text-left">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Gross Sales Revenue</span>
            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold flex items-center gap-0.5 ${
              filteredMetrics.growthRate >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            }`}>
              {filteredMetrics.growthRate >= 0 ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {Math.abs(filteredMetrics.growthRate)}%
            </span>
          </div>
          <div className="space-y-0.5">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">
              ₹{filteredMetrics.grossRevenue.toLocaleString("en-IN")}
            </h3>
            <p className="text-[10px] text-slate-400">
              Prior period: ₹{filteredMetrics.priorRevenue.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="absolute right-0 bottom-0 translate-x-1 translate-y-1 opacity-5 group-hover:opacity-10 transition-opacity">
            <DollarSign className="h-20 w-20 text-slate-900" />
          </div>
        </div>

        {/* Metric 2: Revenue Target */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-indigo-300 transition-all text-left">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Target Attainment</span>
            <span className="p-1 bg-indigo-50 text-indigo-700 rounded-md">
              <Percent className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="space-y-0.5">
            <h3 className="text-2xl font-black text-indigo-700 tracking-tight">
              {((filteredMetrics.grossRevenue / filteredMetrics.targetRevenue) * 100).toFixed(1)}%
            </h3>
            <p className="text-[10px] text-slate-400">
              Target quota: ₹{filteredMetrics.targetRevenue.toLocaleString("en-IN")}
            </p>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div
              className="bg-indigo-600 h-1.5 rounded-full"
              style={{ width: `${Math.min(100, (filteredMetrics.grossRevenue / filteredMetrics.targetRevenue) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Metric 3: Avg Order Value */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-indigo-300 transition-all text-left">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Average Order Value</span>
            <span className="p-1 bg-emerald-50 text-emerald-700 rounded-md">
              <Activity className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="space-y-0.5">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">
              ₹{filteredMetrics.avgOrderValue.toLocaleString("en-IN")}
            </h3>
            <p className="text-[10px] text-slate-400">
              Per commercial seed/IoT bill
            </p>
          </div>
          <div className="absolute right-0 bottom-0 translate-x-1 translate-y-1 opacity-5 group-hover:opacity-10 transition-opacity">
            <Coins className="h-20 w-20 text-slate-900" />
          </div>
        </div>

        {/* Metric 4: Active Commercial Clients */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-indigo-300 transition-all text-left">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Active Client Entities</span>
            <span className="p-1 bg-amber-50 text-amber-700 rounded-md">
              <Users className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="space-y-0.5">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight font-mono">
              {filteredMetrics.activeCustomers}
            </h3>
            <p className="text-[10px] text-slate-400">
              Invoiced agricultural cooperatives
            </p>
          </div>
          <div className="absolute right-0 bottom-0 translate-x-1 translate-y-1 opacity-5 group-hover:opacity-10 transition-opacity">
            <Building2 className="h-20 w-20 text-slate-900" />
          </div>
        </div>

      </div>

      {/* REVENUE TRENDS WITH COMPARISON (Dual Line Area Chart) */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm text-left space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-50 pb-4">
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-indigo-600" />
              Agronomic Revenue Over Time
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Comparison of current {timeframe} trajectory with the previous cycle.
            </p>
          </div>

          {/* Chart Legend Labels */}
          <div className="flex items-center gap-4 text-[11px] font-bold">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-600"></span>
              Current Period (₹)
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300"></span>
              Prior Period (₹)
            </span>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={filteredMetrics.trends}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPrior" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#cbd5e1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="period"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `₹${value >= 100000 ? (value / 1000).toFixed(0) + "k" : value}`}
                tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
              />
              <Tooltip
                formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, ""]}
                contentStyle={{
                  backgroundColor: "#1e293b",
                  borderRadius: "16px",
                  border: "none",
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: "bold",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
                }}
              />
              <Area
                type="monotone"
                dataKey="current"
                name="Current Cycle"
                stroke="#6366f1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCurrent)"
              />
              <Area
                type="monotone"
                dataKey="prior"
                name="Prior Cycle"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#colorPrior)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CATEGORY & CUSTOMER BREAKDOWN ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PIE CHART: REVENUE BY CATEGORY */}
        <div className="lg:col-span-6 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm text-left flex flex-col justify-between">
          <div className="border-b border-slate-50 pb-3 mb-4">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <Layers className="h-4.5 w-4.5 text-indigo-600" />
              Revenue By Product Category
            </h3>
            <p className="text-[10px] text-slate-400">
              Categorized commercial product group distributions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Pie Drawing */}
            <div className="sm:col-span-5 h-[160px] flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={filteredMetrics.categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {filteredMetrics.categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `₹${Number(value).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[9px] uppercase font-black tracking-widest text-slate-400">Category</span>
                <span className="text-xs font-black text-slate-700">Mix</span>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="sm:col-span-7 space-y-2.5">
              {filteredMetrics.categories.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-slate-50/50 p-2 rounded-xl border border-slate-100 hover:border-slate-200 transition-all">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }}></span>
                    <span className="font-semibold text-slate-700">{cat.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">₹{cat.value.toLocaleString()}</p>
                    <p className="text-[9px] font-mono text-slate-400">{cat.percentage}% share</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BAR CHART: REVENUE BY CUSTOMER COOPERATIVES */}
        <div className="lg:col-span-6 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm text-left flex flex-col justify-between">
          <div className="border-b border-slate-50 pb-3 mb-4">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <Building2 className="h-4.5 w-4.5 text-indigo-600" />
              Top B2B Customer Cooperatives
            </h3>
            <p className="text-[10px] text-slate-400">
              Top volume-purchasing rural unions & agricultural conglomerates.
            </p>
          </div>

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredMetrics.customers}
                layout="vertical"
                margin={{ top: 5, right: 10, left: 15, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 9, fontWeight: 700 }}
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  width={110}
                  tick={{ fill: "#475569", fontSize: 9, fontWeight: 800 }}
                />
                <Tooltip
                  formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, "Purchases"]}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderRadius: "16px",
                    border: "none",
                    color: "#fff",
                    fontSize: "10px",
                    fontWeight: "bold"
                  }}
                />
                <Bar dataKey="amount" radius={[0, 8, 8, 0]} barSize={12}>
                  {filteredMetrics.customers.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#4f46e5" : index === 1 ? "#6366f1" : index === 2 ? "#818cf8" : "#a5b4fc"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* GEOGRAPHIC REGION MAP SECTION */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm text-left space-y-6">
        <div className="border-b border-slate-50 pb-4">
          <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
            <Globe className="h-4.5 w-4.5 text-indigo-600" />
            Agronomic Regional Revenue Distribution Map
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Interactive territory map. Click a region zone to filter and dynamically lock the dashboard analytics to that specific hub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* COLUMN 1: SLEEK GEOGRAPHIC SVG RENDER */}
          <div className="md:col-span-6 flex justify-center bg-slate-50/50 rounded-2xl p-4 border border-slate-100 relative">
            <div className="absolute top-3 left-3 bg-white border border-slate-200 px-3 py-1 rounded-xl text-[9px] font-bold text-slate-500 shadow-xs">
              🌎 Live Map Grid
            </div>

            <svg
              viewBox="0 0 400 400"
              className="w-full max-w-[280px] h-auto drop-shadow-md select-none"
            >
              {/* background grid */}
              <g stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="5 5">
                <line x1="50" y1="0" x2="50" y2="400" />
                <line x1="150" y1="0" x2="150" y2="400" />
                <line x1="250" y1="0" x2="250" y2="400" />
                <line x1="350" y1="0" x2="350" y2="400" />
                <line x1="0" y1="50" x2="400" y2="50" />
                <line x1="0" y1="150" x2="400" y2="150" />
                <line x1="0" y1="250" x2="400" y2="250" />
                <line x1="0" y1="350" x2="400" y2="350" />
              </g>

              {/* REGION 1: NORTH (Punjab/Haryana) - Green block top left */}
              <path
                d="M 120,50 L 220,50 L 210,120 L 110,110 Z"
                fill={selectedRegion === "North" ? "#4f46e5" : hoveredRegion === "North" ? "#818cf8" : "#c7d2fe"}
                stroke="#ffffff"
                strokeWidth="2.5"
                className="cursor-pointer transition-all duration-300 hover:opacity-90"
                onClick={() => setSelectedRegion(selectedRegion === "North" ? "All" : "North")}
                onMouseEnter={() => setHoveredRegion("North")}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              <text x="165" y="85" fill="#1e1b4b" fontSize="10" fontWeight="900" textAnchor="middle" className="pointer-events-none">
                North Hub
              </text>

              {/* REGION 2: WEST (Maharashtra/Gujarat) - Yellow block mid left */}
              <path
                d="M 80,130 L 150,140 L 160,240 L 60,230 L 50,170 Z"
                fill={selectedRegion === "West" ? "#10b981" : hoveredRegion === "West" ? "#34d399" : "#a7f3d0"}
                stroke="#ffffff"
                strokeWidth="2.5"
                className="cursor-pointer transition-all duration-300 hover:opacity-90"
                onClick={() => setSelectedRegion(selectedRegion === "West" ? "All" : "West")}
                onMouseEnter={() => setHoveredRegion("West")}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              <text x="110" y="195" fill="#064e3b" fontSize="10" fontWeight="900" textAnchor="middle" className="pointer-events-none">
                West Hub
              </text>

              {/* REGION 3: SOUTH (Karnataka/AP) - Pink block bottom */}
              <path
                d="M 160,250 L 230,240 L 210,350 L 150,340 Z"
                fill={selectedRegion === "South" ? "#f59e0b" : hoveredRegion === "South" ? "#fbbf24" : "#fef3c7"}
                stroke="#ffffff"
                strokeWidth="2.5"
                className="cursor-pointer transition-all duration-300 hover:opacity-90"
                onClick={() => setSelectedRegion(selectedRegion === "South" ? "All" : "South")}
                onMouseEnter={() => setHoveredRegion("South")}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              <text x="190" y="300" fill="#78350f" fontSize="10" fontWeight="900" textAnchor="middle" className="pointer-events-none">
                South Hub
              </text>

              {/* REGION 4: EAST (Bihar/Bengal) - Blue block mid right */}
              <path
                d="M 230,120 L 320,130 L 310,210 L 240,200 Z"
                fill={selectedRegion === "East" ? "#ec4899" : hoveredRegion === "East" ? "#f472b6" : "#fbcfe8"}
                stroke="#ffffff"
                strokeWidth="2.5"
                className="cursor-pointer transition-all duration-300 hover:opacity-90"
                onClick={() => setSelectedRegion(selectedRegion === "East" ? "All" : "East")}
                onMouseEnter={() => setHoveredRegion("East")}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              <text x="275" y="170" fill="#500724" fontSize="10" fontWeight="900" textAnchor="middle" className="pointer-events-none">
                East Hub
              </text>

              {/* REGION 5: CENTRAL (MP) - Gray/Purple block middle */}
              <path
                d="M 180,130 L 220,130 L 230,220 L 170,230 Z"
                fill={selectedRegion === "Central" ? "#8b5cf6" : hoveredRegion === "Central" ? "#a78bfa" : "#ddd6fe"}
                stroke="#ffffff"
                strokeWidth="2.5"
                className="cursor-pointer transition-all duration-300 hover:opacity-90"
                onClick={() => setSelectedRegion(selectedRegion === "Central" ? "All" : "Central")}
                onMouseEnter={() => setHoveredRegion("Central")}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              <text x="200" y="185" fill="#2e1065" fontSize="10" fontWeight="900" textAnchor="middle" className="pointer-events-none">
                Central
              </text>
            </svg>
          </div>

          {/* COLUMN 2: REGIONAL LEDGER STATS */}
          <div className="md:col-span-6 space-y-3">
            <h4 className="font-extrabold text-slate-800 text-xs">Regional Sales Contribution Breakdown</h4>
            
            <div className="space-y-2.5">
              {dataset.regions.map((reg) => {
                const isActive = selectedRegion === reg.id;
                const isHovered = hoveredRegion === reg.id;

                return (
                  <div
                    key={reg.id}
                    onClick={() => setSelectedRegion(selectedRegion === reg.id ? "All" : reg.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer text-left flex items-center justify-between ${
                      isActive
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-md scale-102"
                        : isHovered
                          ? "bg-indigo-50/50 border-indigo-200 text-indigo-900"
                          : "bg-slate-50 border-slate-150 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`p-1 rounded-lg ${isActive ? "bg-white/20 text-white" : "bg-white border border-slate-200 text-slate-500"}`}>
                        <MapPin className="h-3.5 w-3.5" />
                      </span>
                      <div>
                        <p className={`text-xs font-extrabold ${isActive ? "text-white" : "text-slate-800"}`}>
                          {reg.name}
                        </p>
                        <p className={`text-[9.5px] ${isActive ? "text-indigo-200" : "text-slate-400"}`}>
                          Growth vs last period: <span className={reg.growth >= 0 ? "text-emerald-500 font-bold" : "text-rose-500 font-bold"}>
                            {reg.growth >= 0 ? "+" : ""}{reg.growth}%
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`text-xs font-black ${isActive ? "text-white" : "text-slate-800"}`}>
                        ₹{reg.amount.toLocaleString("en-IN")}
                      </p>
                      <p className={`text-[10px] font-mono ${isActive ? "text-indigo-200" : "text-slate-400"}`}>
                        {reg.percentage}% of aggregate
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedRegion !== "All" && (
              <button
                onClick={() => setSelectedRegion("All")}
                className="w-full text-center py-2 text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-800 border-2 border-indigo-200 hover:border-indigo-400 rounded-xl transition-all cursor-pointer bg-transparent mt-2"
              >
                Clear Territory Locks (Show Unified Country View)
              </button>
            )}
          </div>

        </div>
      </div>
        </>
      )}

      {subTab === "profit" && (
        <div className="space-y-6 animate-in fade-in duration-200 text-left">
          
          {/* PROFIT METRICS BENTO GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Metric 1: Gross Sales */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Gross Sales Revenue</span>
                <span className="p-1 bg-indigo-50 text-indigo-700 rounded-md">
                  <DollarSign className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="space-y-0.5">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                  ₹{profitSummary.totalRev.toLocaleString("en-IN")}
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold">
                  Aggregated agronomic sales volume
                </p>
              </div>
              <div className="absolute right-0 bottom-0 translate-x-1 translate-y-1 opacity-5 group-hover:opacity-10 transition-opacity">
                <DollarSign className="h-20 w-20 text-slate-900" />
              </div>
            </div>

            {/* Metric 2: Cost of Goods Sold */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Cost of Goods Sold (COGS)</span>
                <span className="p-1 bg-amber-50 text-amber-700 rounded-md">
                  <TrendingDown className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="space-y-0.5">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                  ₹{profitSummary.totalCogs.toLocaleString("en-IN")}
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold">
                  COGS ratio: {((profitSummary.totalCogs / (profitSummary.totalRev || 1)) * 100).toFixed(1)}% of sales
                </p>
              </div>
              <div className="absolute right-0 bottom-0 translate-x-1 translate-y-1 opacity-5 group-hover:opacity-10 transition-opacity">
                <TrendingDown className="h-20 w-20 text-slate-900" />
              </div>
            </div>

            {/* Metric 3: Gross Profit */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Gross Profit</span>
                <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-indigo-50 text-indigo-700">
                  {profitSummary.averageGrossMargin.toFixed(1)}% margin
                </span>
              </div>
              <div className="space-y-0.5">
                <h3 className="text-2xl font-black text-indigo-700 tracking-tight">
                  ₹{profitSummary.totalGrossProfit.toLocaleString("en-IN")}
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold">
                  Revenue minus direct seed/IoT COGS
                </p>
              </div>
              <div className="absolute right-0 bottom-0 translate-x-1 translate-y-1 opacity-5 group-hover:opacity-10 transition-opacity">
                <Scale className="h-20 w-20 text-indigo-900" />
              </div>
            </div>

            {/* Metric 4: Net Profit */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Net Profit</span>
                <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-emerald-50 text-emerald-700">
                  {profitSummary.averageNetMargin.toFixed(1)}% margin
                </span>
              </div>
              <div className="space-y-0.5">
                <h3 className="text-2xl font-black text-emerald-700 tracking-tight">
                  ₹{profitSummary.totalNetProfit.toLocaleString("en-IN")}
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold">
                  After shipping, taxes, fees, discounts
                </p>
              </div>
              <div className="absolute right-0 bottom-0 translate-x-1 translate-y-1 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldCheck className="h-20 w-20 text-emerald-900" />
              </div>
            </div>

          </div>

          {/* DYNAMIC PARAMETERS & REVENUE FLOW CHART SPLIT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Interactive sliders to change variables */}
            <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                  <Coins className="h-4.5 w-4.5 text-emerald-600" />
                  Profit Margin Expense Sliders
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Adjust regional and commercial expenses dynamically to audit profit thresholds.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                {/* 1. Shipping Rate Slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Truck className="h-3.5 w-3.5 text-slate-400" />
                      Shipping & Bulk Transport
                    </span>
                    <span className="text-emerald-700 font-mono">{shippingRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="1"
                    value={shippingRate}
                    onChange={(e) => setShippingRate(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer h-1 bg-slate-100 rounded-lg appearance-none border-0"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>1% (Bulk Rail)</span>
                    <span>15% (Express Air)</span>
                  </div>
                </div>

                {/* 2. Tax Rate Slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Receipt className="h-3.5 w-3.5 text-slate-400" />
                      Taxes & Legal Levies (GST)
                    </span>
                    <span className="text-emerald-700 font-mono">{taxRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="28"
                    step="1"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer h-1 bg-slate-100 rounded-lg appearance-none border-0"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>0% (Exempted)</span>
                    <span>28% (Luxury Seed/Tech)</span>
                  </div>
                </div>

                {/* 3. Platform Fees Rate Slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Percent className="h-3.5 w-3.5 text-slate-400" />
                      Platform Processing & Fees
                    </span>
                    <span className="text-emerald-700 font-mono">{platformFeesRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={platformFeesRate}
                    onChange={(e) => setPlatformFeesRate(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer h-1 bg-slate-100 rounded-lg appearance-none border-0"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>0% (Free Hub)</span>
                    <span>10% (Premium Brokerage)</span>
                  </div>
                </div>

                {/* 4. Discount Rate Slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Percent className="h-3.5 w-3.5 text-slate-400" />
                      Cooperative Sales Discounts
                    </span>
                    <span className="text-emerald-700 font-mono">{discountRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={discountRate}
                    onChange={(e) => setDiscountRate(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer h-1 bg-slate-100 rounded-lg appearance-none border-0"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>0% (None)</span>
                    <span>20% (Max Subsidy)</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Visual Breakdown of Revenue stream */}
            <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                  <Info className="h-4.5 w-4.5 text-indigo-600" />
                  Sovereign Revenue Allocation Waterfall
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Segmented distribution of Indian Rupees (₹) across COGS, transport, taxes, and final Net Profit.
                </p>
              </div>

              {/* Stacked Waterfall Segment Block */}
              <div className="space-y-5 py-4">
                <div className="w-full h-10 rounded-2xl overflow-hidden flex shadow-xs border border-slate-100">
                  {/* COGS Segment */}
                  <div 
                    style={{ width: `${(profitSummary.totalCogs / (profitSummary.totalRev || 1)) * 100}%` }}
                    className="bg-amber-500 hover:opacity-90 transition-opacity flex items-center justify-center text-[10px] text-white font-bold"
                    title={`COGS: ₹${profitSummary.totalCogs.toLocaleString()}`}
                  >
                    {((profitSummary.totalCogs / (profitSummary.totalRev || 1)) * 100) > 8 && "COGS"}
                  </div>
                  
                  {/* Shipping Segment */}
                  <div 
                    style={{ width: `${shippingRate}%` }}
                    className="bg-sky-500 hover:opacity-90 transition-opacity flex items-center justify-center text-[10px] text-white font-bold"
                    title={`Shipping: ₹${profitSummary.totalShipping.toLocaleString()}`}
                  >
                    {shippingRate > 5 && "Ship"}
                  </div>

                  {/* Taxes Segment */}
                  <div 
                    style={{ width: `${taxRate}%` }}
                    className="bg-rose-500 hover:opacity-90 transition-opacity flex items-center justify-center text-[10px] text-white font-bold"
                    title={`Taxes: ₹${profitSummary.totalTaxes.toLocaleString()}`}
                  >
                    {taxRate > 5 && "Tax"}
                  </div>

                  {/* Fees Segment */}
                  <div 
                    style={{ width: `${platformFeesRate}%` }}
                    className="bg-purple-500 hover:opacity-90 transition-opacity flex items-center justify-center text-[10px] text-white font-bold"
                    title={`Fees: ₹${profitSummary.totalFees.toLocaleString()}`}
                  >
                    {platformFeesRate > 5 && "Fees"}
                  </div>

                  {/* Discounts Segment */}
                  <div 
                    style={{ width: `${discountRate}%` }}
                    className="bg-orange-500 hover:opacity-90 transition-opacity flex items-center justify-center text-[10px] text-white font-bold"
                    title={`Discounts: ₹${profitSummary.totalDiscounts.toLocaleString()}`}
                  >
                    {discountRate > 5 && "Disc"}
                  </div>

                  {/* Net Profit Segment */}
                  <div 
                    style={{ width: `${Math.max(1, profitSummary.averageNetMargin)}%` }}
                    className="bg-emerald-500 hover:opacity-90 transition-opacity flex-1 flex items-center justify-center text-[10px] text-white font-black"
                    title={`Net Profit: ₹${profitSummary.totalNetProfit.toLocaleString()}`}
                  >
                    {profitSummary.averageNetMargin > 8 && "Net Profit"}
                  </div>
                </div>

                {/* Legend explanation card */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="h-3 w-3 rounded-md bg-amber-500 flex-shrink-0"></span>
                    <span className="font-medium truncate">COGS: {((profitSummary.totalCogs / (profitSummary.totalRev || 1)) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="h-3 w-3 rounded-md bg-sky-500 flex-shrink-0"></span>
                    <span className="font-medium truncate">Shipping: {shippingRate}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="h-3 w-3 rounded-md bg-rose-500 flex-shrink-0"></span>
                    <span className="font-medium truncate">Taxes: {taxRate}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="h-3 w-3 rounded-md bg-purple-500 flex-shrink-0"></span>
                    <span className="font-medium truncate">Platform Fees: {platformFeesRate}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="h-3 w-3 rounded-md bg-orange-500 flex-shrink-0"></span>
                    <span className="font-medium truncate">Discounts: {discountRate}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-800 font-extrabold">
                    <span className="h-3 w-3 rounded-md bg-emerald-500 flex-shrink-0 animate-pulse"></span>
                    <span className="truncate">Net profit: {profitSummary.averageNetMargin.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] text-slate-400 font-medium">
                💡 <strong>Equation check:</strong> Gross Profit is calculated as <code>Revenue - COGS</code>. Net Profit is calculated as <code>Gross Profit - (Shipping + Taxes + Fees + Discounts)</code>. Adjust slide parameters to observe real-time ledger response.
              </div>
            </div>

          </div>

          {/* TOP 10 PRODUCTS BY PROFIT LEDGER TABLE */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                <FileSpreadsheet className="h-4.5 w-4.5 text-emerald-600" />
                Top 10 Sovereign Products by Absolute Profit Margin
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Sorted by absolute net profit contributions including direct COGS offset and auxiliary fee allocations.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 uppercase font-black tracking-wider">
                    <th className="py-3 px-2">Rank & Product Name</th>
                    <th className="py-3 px-2">Revenue (₹)</th>
                    <th className="py-3 px-2">Direct COGS (₹)</th>
                    <th className="py-3 px-2">Gross Profit (₹)</th>
                    <th className="py-3 px-2 text-center">Net Expenses (₹)</th>
                    <th className="py-3 px-2 text-right">Net Profit (₹)</th>
                    <th className="py-3 px-2 text-right">Net Margin (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs">
                  {productsProfitData.map((prod, index) => {
                    const totalExpenses = prod.shipping + prod.taxes + prod.fees + prod.discounts;
                    return (
                      <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-2 font-bold text-slate-800 flex items-center gap-2">
                          <span className="h-5 w-5 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center text-[10px] font-black">
                            {index + 1}
                          </span>
                          <span className="truncate max-w-[200px] sm:max-w-xs">{prod.name}</span>
                        </td>
                        <td className="py-3.5 px-2 font-mono text-slate-600">
                          ₹{prod.revenue.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3.5 px-2 font-mono text-amber-600">
                          ₹{prod.cogs.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3.5 px-2 font-mono text-indigo-600 font-semibold">
                          ₹{prod.grossProfit.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3.5 px-2 text-center text-slate-500">
                          <span className="bg-slate-100 px-2 py-0.5 rounded-lg text-[10px] font-medium" title={`Transport: ₹${prod.shipping.toLocaleString()}, Taxes: ₹${prod.taxes.toLocaleString()}, Fees: ₹${prod.fees.toLocaleString()}, Discounts: ₹${prod.discounts.toLocaleString()}`}>
                            ₹{totalExpenses.toLocaleString("en-IN")}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 text-right font-mono font-black text-emerald-700">
                          ₹{prod.netProfit.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3.5 px-2 text-right font-semibold">
                          <div className="flex items-center justify-end gap-1.5">
                            <span className={`font-mono text-xs ${prod.netMargin > 20 ? "text-emerald-600" : prod.netMargin > 10 ? "text-amber-600" : "text-rose-600"}`}>
                              {prod.netMargin.toFixed(1)}%
                            </span>
                            <div className="w-12 bg-slate-100 rounded-full h-1.5 hidden sm:block overflow-hidden">
                              <div 
                                style={{ width: `${Math.max(0, Math.min(100, prod.netMargin))}%` }} 
                                className={`h-1.5 rounded-full ${prod.netMargin > 20 ? "bg-emerald-500" : prod.netMargin > 10 ? "bg-amber-500" : "bg-rose-500"}`}
                              ></div>
                            </div>
                          </div>
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

      {subTab === "payments" && (
        <div className="space-y-6 animate-in fade-in duration-200 text-left">
          
          {/* PAYMENT METRICS BENTO GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Metric 1: Collected Payments */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-amber-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Collected Payments</span>
                <span className="p-1 bg-emerald-50 text-emerald-700 rounded-md">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="space-y-0.5">
                <h3 className="text-2xl font-black text-emerald-700 tracking-tight font-mono">
                  ₹{paymentHistory.reduce((sum, p) => sum + p.amount, 0).toLocaleString("en-IN")}
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold">
                  {paymentHistory.length} ledger payments settled
                </p>
              </div>
              <div className="absolute right-0 bottom-0 translate-x-1 translate-y-1 opacity-5 group-hover:opacity-10 transition-opacity">
                <CheckCircle2 className="h-20 w-20 text-emerald-900" />
              </div>
            </div>

            {/* Metric 2: Confirmed Pending */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-amber-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Pending (Confirmed)</span>
                <span className="p-1 bg-indigo-50 text-indigo-700 rounded-md">
                  <Clock className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="space-y-0.5">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight font-mono">
                  ₹{orders.filter(o => o.status === "Pending").reduce((sum, o) => sum + o.amount, 0).toLocaleString("en-IN")}
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold">
                  {orders.filter(o => o.status === "Pending").length} orders awaiting settlement
                </p>
              </div>
              <div className="absolute right-0 bottom-0 translate-x-1 translate-y-1 opacity-5 group-hover:opacity-10 transition-opacity">
                <Clock className="h-20 w-20 text-slate-900" />
              </div>
            </div>

            {/* Metric 3: Overdue Payments */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-amber-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Overdue Receivables</span>
                <span className="p-1 bg-rose-50 text-rose-700 rounded-md">
                  <AlertTriangle className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="space-y-0.5">
                <h3 className="text-2xl font-black text-rose-600 tracking-tight font-mono">
                  ₹{orders.filter(o => o.status === "Overdue").reduce((sum, o) => sum + o.amount, 0).toLocaleString("en-IN")}
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold">
                  {orders.filter(o => o.status === "Overdue").length} orders past terms grace period
                </p>
              </div>
              <div className="absolute right-0 bottom-0 translate-x-1 translate-y-1 opacity-5 group-hover:opacity-10 transition-opacity">
                <AlertTriangle className="h-20 w-20 text-rose-900" />
              </div>
            </div>

            {/* Metric 4: Reconciliation Rate */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-amber-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Reconciliation Ratio</span>
                <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-amber-50 text-amber-700">
                  Real-time match
                </span>
              </div>
              <div className="space-y-0.5">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight font-mono">
                  {((paymentHistory.length / (paymentHistory.length + orders.filter(o => o.status !== "Paid").length)) * 100).toFixed(1)}%
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold">
                  {paymentHistory.length} reconciled of {paymentHistory.length + orders.filter(o => o.status !== "Paid").length} payments
                </p>
              </div>
              <div className="absolute right-0 bottom-0 translate-x-1 translate-y-1 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldCheck className="h-20 w-20 text-slate-900" />
              </div>
            </div>

          </div>

          {/* DYNAMIC TOAST / CONFIRMATION PANEL */}
          {reconToast && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs animate-in slide-in-from-top duration-300">
              <Sparkles className="h-4.5 w-4.5 text-amber-600 animate-pulse" />
              <span>{reconToast}</span>
            </div>
          )}

          {/* INTERACTIVE RECONCILIATION CENTER */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* UNRECONCILED BANK RECEIPTS */}
            <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-1 text-left">
                <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                  <CreditCard className="h-4.5 w-4.5 text-amber-600" />
                  Unreconciled Bank Clearings ({transactions.length})
                </h3>
                <p className="text-[10px] text-slate-400">
                  Select a raw incoming bank receipt to initiate transaction reconciliation.
                </p>
              </div>

              {transactions.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-10 text-center space-y-2 bg-slate-50/50 rounded-2xl border border-dashed border-slate-100">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                  <p className="text-xs font-bold text-slate-700">All Bank Clearings Reconciled</p>
                  <p className="text-[10px] text-slate-400 max-w-xs">No pending direct ledger clearings. Your books are perfectly balanced!</p>
                </div>
              ) : (
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[420px] pr-1 py-1">
                  {transactions.map((txn) => {
                    const isSelected = selectedTxn === txn.id;
                    const hasDirectMatch = orders.some(o => o.status !== "Paid" && o.amount === txn.amount);
                    return (
                      <div 
                        key={txn.id}
                        className={`p-4 rounded-2xl border transition-all space-y-2 cursor-pointer text-left ${
                          isSelected 
                            ? "border-amber-400 bg-amber-50/20 ring-1 ring-amber-400 shadow-xs" 
                            : "border-slate-100 hover:border-slate-200 bg-white"
                        }`}
                        onClick={() => {
                          setSelectedTxn(txn.id);
                          // Auto select matching order if there's an exact match
                          const match = orders.find(o => o.status !== "Paid" && o.amount === txn.amount);
                          if (match) {
                            setSelectedOrder(match.id);
                          } else {
                            setSelectedOrder(null);
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                            {txn.id}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                            <CalendarDays className="h-3 w-3" />
                            {txn.receivedDate}
                          </span>
                        </div>
                        
                        <div className="space-y-0.5">
                          <p className="text-xs font-extrabold text-slate-800 truncate">{txn.sender}</p>
                          <p className="text-sm font-black text-slate-800 font-mono">₹{txn.amount.toLocaleString("en-IN")}</p>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          {hasDirectMatch ? (
                            <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                              <Sparkles className="h-2.5 w-2.5 animate-bounce" />
                              Exact Match Found
                            </span>
                          ) : (
                            <span className="text-[9px] text-slate-400 font-medium">Requires Manual Audit</span>
                          )}

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAutoMatch(txn.id);
                              }}
                              className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[9px] font-bold rounded-lg border-0 cursor-pointer transition-colors"
                              title="Smart AI Auto-reconciliation match based on exact amount"
                            >
                              Auto Match
                            </button>
                            <button
                              type="button"
                              className={`px-2 py-1 text-[9px] font-bold rounded-lg border-0 cursor-pointer transition-colors ${
                                isSelected ? "bg-amber-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                              }`}
                            >
                              {isSelected ? "Selected" : "Select"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* UNPAID / CONFIRMED ORDERS LEDGER */}
            <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                    <FileText className="h-4.5 w-4.5 text-indigo-600" />
                    Unsettled Orders Accounts Receivable
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Match with bank receipt to offset balance and stamp legal receipt.
                  </p>
                </div>
                
                {/* Search orders */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search className="h-3.5 w-3.5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search by customer..."
                    value={reconSearchTerm}
                    onChange={(e) => setReconSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-1.5 w-full sm:w-48 text-[11px] font-medium text-slate-700 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* ACTIVE RECONCILIATION PAIRING COMPANION HEADER */}
              {selectedTxn && (
                <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-in slide-in-from-top duration-300 text-left">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-indigo-700 font-extrabold uppercase">Active Reconciliation Pair</span>
                      <span className="text-[9px] font-mono text-slate-400">({selectedTxn})</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      Reconciling: <span className="text-indigo-700 font-mono">₹{transactions.find(t => t.id === selectedTxn)?.amount.toLocaleString("en-IN")}</span> from <span className="underline">{transactions.find(t => t.id === selectedTxn)?.sender.split(" ")[0]}</span>
                    </p>
                  </div>

                  {selectedOrder ? (
                    <button
                      onClick={() => handleReconcile(selectedTxn, selectedOrder)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] rounded-xl border-0 cursor-pointer flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Approve & Reconcile
                    </button>
                  ) : (
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-3 py-2 rounded-xl font-bold border border-amber-100">
                      Select matching order below
                    </span>
                  )}
                </div>
              )}

              {/* LIST OF UNPAID ORDERS */}
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 text-left">
                {orders
                  .filter(o => o.status !== "Paid" && (reconSearchTerm === "" || o.customerName.toLowerCase().includes(reconSearchTerm.toLowerCase()) || o.id.toLowerCase().includes(reconSearchTerm.toLowerCase())))
                  .map((order) => {
                    const isSelected = selectedOrder === order.id;
                    const isAmountMatching = selectedTxn ? transactions.find(t => t.id === selectedTxn)?.amount === order.amount : false;
                    
                    return (
                      <div 
                        key={order.id}
                        onClick={() => {
                          if (selectedTxn) {
                            setSelectedOrder(order.id);
                          } else {
                            setReconToast("Please select a raw bank clearing transaction on the left first!");
                            setTimeout(() => setReconToast(""), 3000);
                          }
                        }}
                        className={`p-4 rounded-2xl border transition-all text-left space-y-3 cursor-pointer ${
                          isSelected 
                            ? "border-indigo-500 bg-indigo-50/10 ring-1 ring-indigo-500 shadow-xs" 
                            : isAmountMatching 
                            ? "border-emerald-200 bg-emerald-50/10 hover:border-emerald-300" 
                            : "border-slate-100 hover:border-slate-200 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                              {order.id}
                            </span>
                            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                              order.status === "Overdue" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 font-semibold block">Due Date</span>
                            <span className={`text-[10px] font-bold ${order.status === "Overdue" ? "text-rose-600" : "text-slate-600"}`}>
                              {order.dueDate}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1 border-t border-slate-50">
                          <div className="space-y-0.5">
                            <h4 className="font-extrabold text-slate-800 text-xs">{order.customerName}</h4>
                            <p className="text-[10px] text-slate-400 font-medium">Item: {order.cropVariety}</p>
                          </div>

                          <div className="flex items-center gap-3 justify-between sm:justify-end">
                            <span className="text-xs font-black text-slate-800 font-mono">
                              ₹{order.amount.toLocaleString("en-IN")}
                            </span>
                            
                            {selectedTxn && isAmountMatching && !isSelected && (
                              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md animate-pulse">
                                Exact Amount Match
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

          </div>

          {/* HISTORICAL COMPLETED PAYMENTS JOURNAL */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                  <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" />
                  Historical Reconciled Payment Ledger & Audit Trail
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Chronological logs of all cleared bank transfers matched and posted to direct accounting books.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const csvContent = "data:text/csv;charset=utf-8," 
                      + "Payment ID,Order ID,Customer Name,Amount,Paid Date,Method,Reference\n"
                      + paymentHistory.map(e => `"${e.id}","${e.orderId}","${e.customerName}",${e.amount},"${e.paidDate}","${e.method}","${e.reference}"`).join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", `payment_audit_trail_${new Date().toISOString().slice(0,10)}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-xl border-0 cursor-pointer flex items-center gap-1 transition-all"
                >
                  <Download className="h-3.5 w-3.5" /> Export Audit Trail (.CSV)
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 uppercase font-black tracking-wider">
                    <th className="py-3 px-2">Payment ID</th>
                    <th className="py-3 px-2">Order Association</th>
                    <th className="py-3 px-2">Customer Account</th>
                    <th className="py-3 px-2">Settlement Date</th>
                    <th className="py-3 px-2">Gateway / Method</th>
                    <th className="py-3 px-2">System Clearance Ref</th>
                    <th className="py-3 px-2 text-right">Settled Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs">
                  {paymentHistory.map((pmt) => (
                    <tr key={pmt.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-2 font-mono font-bold text-slate-700">
                        {pmt.id}
                      </td>
                      <td className="py-3 px-2 font-mono font-semibold text-indigo-600">
                        {pmt.orderId}
                      </td>
                      <td className="py-3 px-2 font-bold text-slate-800">
                        {pmt.customerName}
                      </td>
                      <td className="py-3 px-2 font-mono text-slate-500">
                        {pmt.paidDate}
                      </td>
                      <td className="py-3 px-2">
                        <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full text-[9px] font-bold">
                          {pmt.method}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-mono text-[10px] text-slate-400">
                        {pmt.reference}
                      </td>
                      <td className="py-3 px-2 text-right font-mono font-black text-emerald-700">
                        ₹{pmt.amount.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {subTab === "taxes" && (
        <div className="space-y-6 animate-in fade-in duration-200 text-left">
          
          {/* TAX OVERVIEW METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Metric 1: Output CGST + SGST + IGST (Collected) */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-indigo-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Output GST (Sales Tax)</span>
                <span className="p-1 bg-indigo-50 text-indigo-700 rounded-md">
                  <TrendingUp className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="space-y-0.5">
                <h3 className="text-2xl font-black text-indigo-700 tracking-tight font-mono">
                  ₹{salesSummary.totalTax.toLocaleString("en-IN")}
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold">
                  Output liability on ₹{salesSummary.taxable.toLocaleString("en-IN")} sales
                </p>
              </div>
              <div className="absolute right-0 bottom-0 translate-x-1 translate-y-1 opacity-5 group-hover:opacity-10 transition-opacity">
                <Percent className="h-20 w-20 text-indigo-950" />
              </div>
            </div>

            {/* Metric 2: Input Tax Credit / ITC (Claimable) */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Input Tax Credit (ITC)</span>
                <span className="p-1 bg-emerald-50 text-emerald-700 rounded-md">
                  <TrendingDown className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="space-y-0.5">
                <h3 className="text-2xl font-black text-emerald-700 tracking-tight font-mono">
                  ₹{purchaseSummary.totalTax.toLocaleString("en-IN")}
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold">
                  Offset tax on ₹{purchaseSummary.taxable.toLocaleString("en-IN")} purchases
                </p>
              </div>
              <div className="absolute right-0 bottom-0 translate-x-1 translate-y-1 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldCheck className="h-20 w-20 text-emerald-950" />
              </div>
            </div>

            {/* Metric 3: Net Tax Liability Payable */}
            {(() => {
              const netTax = salesSummary.totalTax - purchaseSummary.totalTax;
              const isRefund = netTax < 0;
              return (
                <div className={`bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden group transition-all ${
                  isRefund ? "hover:border-emerald-300" : "hover:border-amber-300"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">
                      {isRefund ? "Net GST Refund Due" : "Net GST Payable"}
                    </span>
                    <span className={`p-1 rounded-md text-[10px] font-bold ${
                      isRefund ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      {isRefund ? "Credit Carry" : "Cash Ledger"}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <h3 className={`text-2xl font-black tracking-tight font-mono ${
                      isRefund ? "text-emerald-700" : "text-amber-700"
                    }`}>
                      ₹{Math.abs(netTax).toLocaleString("en-IN")}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-semibold">
                      {isRefund ? "Carrying forward to next month" : "Net output liability after ITC discount"}
                    </p>
                  </div>
                  <div className="absolute right-0 bottom-0 translate-x-1 translate-y-1 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Scale className="h-20 w-20 text-slate-900" />
                  </div>
                </div>
              );
            })()}

            {/* Metric 4: Filing Status Calendar */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-indigo-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Filing Status Tracker</span>
                <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-indigo-50 text-indigo-700">
                  GSTR-3B Return
                </span>
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">
                  {filingSuccessMsg ? "June 2026 Filed!" : "June 2026 Pending"}
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold">
                  {filingSuccessMsg ? "ARN Package Generated & Dispatched" : "Review summaries to file return"}
                </p>
              </div>
              <div className="absolute right-0 bottom-0 translate-x-1 translate-y-1 opacity-5 group-hover:opacity-10 transition-opacity">
                <CalendarDays className="h-20 w-20 text-slate-900" />
              </div>
            </div>

          </div>

          {/* DYNAMIC NOTIFICATION */}
          {filingSuccessMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs animate-in slide-in-from-top duration-300">
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
              <div className="space-y-0.5 text-left">
                <p>{filingSuccessMsg}</p>
                <p className="text-[10px] font-mono text-emerald-700">Reference ARN Code: ARN-GST-2026-{Math.floor(100000 + Math.random() * 900000)}</p>
              </div>
            </div>
          )}

          {/* TAX COMPLIANCE CENTER */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* GST FILING FORMS (GSTR-1, GSTR-3B) */}
            <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5 flex flex-col justify-between">
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1 text-left">
                  <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                    <Receipt className="h-4.5 w-4.5 text-indigo-600" />
                    GST Compliance returns Filing simulator
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Prepare, audit, and dispatch outward supply (GSTR-1) and summary return (GSTR-3B) directly.
                  </p>
                </div>
                
                {/* Time Period Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase">Period:</span>
                  <select
                    value={filingPeriod}
                    onChange={(e) => setFilingPeriod(e.target.value as any)}
                    className="p-2 border border-slate-100 rounded-xl text-xs bg-slate-50 focus:outline-none focus:border-indigo-500 font-bold text-slate-700"
                  >
                    <option value="June-2026">June 2026 (Monthly)</option>
                    <option value="July-2026">July 2026 (Monthly)</option>
                    <option value="Q1-2026">Q1 2026-27 (Quarterly)</option>
                  </select>
                </div>
              </div>

              {/* TWO COLUMN GSTR REPORTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                
                {/* GSTR-1 OUTWARD SUPPLIES SUMMARY */}
                <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-extrabold text-slate-800">Form GSTR-1 (Outward Supplies)</span>
                    <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">Sales</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-slate-500">
                      <span>Total Invoice count:</span>
                      <span className="text-slate-800 font-bold">
                        {computedRecords.filter(r => r.type === "Sales" && (filingPeriod === "Q1-2026" || r.month === (filingPeriod === "June-2026" ? "June" : "July"))).length} invoices
                      </span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold text-slate-500">
                      <span>Taxable Value:</span>
                      <span className="text-slate-800 font-bold font-mono">
                        ₹{computedRecords
                          .filter(r => r.type === "Sales" && (filingPeriod === "Q1-2026" || r.month === (filingPeriod === "June-2026" ? "June" : "July")))
                          .reduce((sum, r) => sum + r.taxableValue, 0)
                          .toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold text-slate-500">
                      <span>Central Tax (CGST):</span>
                      <span className="text-slate-800 font-bold font-mono">
                        ₹{computedRecords
                          .filter(r => r.type === "Sales" && (filingPeriod === "Q1-2026" || r.month === (filingPeriod === "June-2026" ? "June" : "July")))
                          .reduce((sum, r) => sum + r.cgst, 0)
                          .toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold text-slate-500">
                      <span>State Tax (SGST):</span>
                      <span className="text-slate-800 font-bold font-mono">
                        ₹{computedRecords
                          .filter(r => r.type === "Sales" && (filingPeriod === "Q1-2026" || r.month === (filingPeriod === "June-2026" ? "June" : "July")))
                          .reduce((sum, r) => sum + r.sgst, 0)
                          .toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold text-slate-500">
                      <span>Integrated Tax (IGST):</span>
                      <span className="text-slate-800 font-bold font-mono">
                        ₹{computedRecords
                          .filter(r => r.type === "Sales" && (filingPeriod === "Q1-2026" || r.month === (filingPeriod === "June-2026" ? "June" : "July")))
                          .reduce((sum, r) => sum + r.igst, 0)
                          .toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="border-t border-slate-200/50 pt-2 flex justify-between text-xs font-black text-slate-800">
                      <span>Total Output Liability:</span>
                      <span className="text-indigo-700 font-mono">
                        ₹{computedRecords
                          .filter(r => r.type === "Sales" && (filingPeriod === "Q1-2026" || r.month === (filingPeriod === "June-2026" ? "June" : "July")))
                          .reduce((sum, r) => sum + r.totalTax, 0)
                          .toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => {
                        const targetSales = computedRecords.filter(r => r.type === "Sales" && (filingPeriod === "Q1-2026" || r.month === (filingPeriod === "June-2026" ? "June" : "July")));
                        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify({
                          gstin: "03AABCA4411D1ZN",
                          returnPeriod: filingPeriod,
                          form: "GSTR-1",
                          b2b: targetSales.map(r => ({
                            invoiceNo: r.id,
                            customerName: r.partnerName,
                            invoiceDate: r.date,
                            placeOfSupply: r.placeOfSupply,
                            taxableValue: r.taxableValue,
                            rate: r.gstRate,
                            cgst: r.cgst,
                            sgst: r.sgst,
                            igst: r.igst
                          }))
                        }, null, 2))}`;
                        const link = document.createElement("a");
                        link.setAttribute("href", jsonString);
                        link.setAttribute("download", `GSTR1_${filingPeriod}_OfflinePayload.json`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-xl border-0 cursor-pointer flex items-center justify-center gap-1 transition-all"
                    >
                      <Download className="h-3.5 w-3.5" /> GSTR-1 Payload (.JSON)
                    </button>
                  </div>
                </div>

                {/* GSTR-3B SUMMARIZED MONTHLY RETURN */}
                <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-extrabold text-slate-800">Form GSTR-3B (Consolidated Return)</span>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Balanced</span>
                  </div>

                  {(() => {
                    const periodSales = computedRecords.filter(r => r.type === "Sales" && (filingPeriod === "Q1-2026" || r.month === (filingPeriod === "June-2026" ? "June" : "July")));
                    const periodPurchases = computedRecords.filter(r => r.type === "Purchase" && (filingPeriod === "Q1-2026" || r.month === (filingPeriod === "June-2026" ? "June" : "July")));

                    const outTax = periodSales.reduce((sum, r) => sum + r.totalTax, 0);
                    const inTaxCredit = periodPurchases.reduce((sum, r) => sum + r.totalTax, 0);
                    const netPayable = outTax - inTaxCredit;

                    return (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold text-slate-500">
                          <span>Total Output Tax:</span>
                          <span className="text-slate-800 font-bold font-mono">₹{outTax.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between text-xs font-semibold text-slate-500">
                          <span>Eligible ITC:</span>
                          <span className="text-emerald-700 font-bold font-mono">₹{inTaxCredit.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between text-xs font-semibold text-slate-500">
                          <span>Interest / Penalty:</span>
                          <span className="text-slate-800 font-bold font-mono">₹0</span>
                        </div>
                        <div className="flex justify-between text-xs font-semibold text-slate-500">
                          <span>Late Fee liability:</span>
                          <span className="text-slate-800 font-bold font-mono">₹0</span>
                        </div>
                        <div className="border-t border-slate-200/50 pt-2 flex justify-between text-xs font-black text-slate-800">
                          <span>Net cash to be paid:</span>
                          <span className={`font-mono ${netPayable < 0 ? "text-emerald-700" : "text-amber-700"}`}>
                            {netPayable < 0 ? `Refund (₹${Math.abs(netPayable).toLocaleString("en-IN")})` : `₹${netPayable.toLocaleString("en-IN")}`}
                          </span>
                        </div>

                        <div className="pt-2 flex gap-2">
                          <button
                            onClick={() => {
                              setFilingSuccessMsg(`Successfully compiled, signed with Class-3 DSC, and filed Form GSTR-3B for the period ${filingPeriod}!`);
                              setTimeout(() => setFilingSuccessMsg(""), 7000);
                            }}
                            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-xl border-0 cursor-pointer flex items-center justify-center gap-1 transition-all"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" /> File GSTR-3B Return
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                </div>

              </div>

            </div>

            {/* QUICK TRANSACTION POST & AUTO-CALCULATE GST */}
            <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-1 text-left">
                <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                  <Plus className="h-4.5 w-4.5 text-indigo-600" />
                  Smart GST Invoicing Post
                </h3>
                <p className="text-[10px] text-slate-400">
                  Instantly post a sales/purchase transaction. GST, CGST, SGST, & IGST will calculate dynamically.
                </p>
              </div>

              {newTaxSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-[10px] font-bold text-emerald-800">
                  {newTaxSuccess}
                </div>
              )}

              <form onSubmit={handleAddTaxRecord} className="space-y-3 text-left">
                
                {/* Transaction Type Selection */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewTaxType("Sales")}
                    className={`py-1.5 rounded-lg border text-xs font-bold cursor-pointer transition-colors ${
                      newTaxType === "Sales"
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                        : "bg-white border-slate-200 text-slate-600"
                    }`}
                  >
                    Output (Sales)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTaxType("Purchase")}
                    className={`py-1.5 rounded-lg border text-xs font-bold cursor-pointer transition-colors ${
                      newTaxType === "Purchase"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                        : "bg-white border-slate-200 text-slate-600"
                    }`}
                  >
                    Input Credit (Purchase)
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 font-extrabold uppercase">Partner / Client Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Haryana Agri Seed Corp"
                    value={newTaxPartner}
                    onChange={(e) => setNewTaxPartner(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-400 font-extrabold uppercase">Pre-tax Amount (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="50000"
                      value={newTaxValue}
                      onChange={(e) => setNewTaxValue(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-400 font-extrabold uppercase">Date</label>
                    <input
                      type="date"
                      required
                      value={newTaxDate}
                      onChange={(e) => setNewTaxDate(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 font-extrabold uppercase">Item Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Breeding Seed Stock Lot B"
                    value={newTaxDesc}
                    onChange={(e) => setNewTaxDesc(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-400 font-extrabold uppercase">HSN Code</label>
                    <select
                      value={newTaxHsn}
                      onChange={(e) => {
                        setNewTaxHsn(e.target.value);
                        // Auto set standard GST rate based on HSN choice
                        if (e.target.value === "1209") setNewTaxRate(5);
                        else if (e.target.value === "3105") setNewTaxRate(12);
                        else if (e.target.value === "9015") setNewTaxRate(18);
                        else if (e.target.value === "8424") setNewTaxRate(12);
                      }}
                      className="w-full px-2 py-1.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    >
                      <option value="1209">1209 (Seeds - 5%)</option>
                      <option value="3105">3105 (Fertilizer - 12%)</option>
                      <option value="9015">9015 (IoT Hardware - 18%)</option>
                      <option value="8424">8424 (Smart Drones - 12%)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-400 font-extrabold uppercase">Place of Supply</label>
                    <select
                      value={newTaxState}
                      onChange={(e) => setNewTaxState(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Punjab">Punjab (Local Office)</option>
                      <option value="Haryana">Haryana (Inter-state)</option>
                      <option value="Karnataka">Karnataka (Inter-state)</option>
                      <option value="Maharashtra">Maharashtra (Inter-state)</option>
                      <option value="Andhra Pradesh">Andhra Pradesh (Inter-state)</option>
                    </select>
                  </div>
                </div>

                {/* DYNAMIC REAL-TIME PREVIEW */}
                {(() => {
                  const val = parseFloat(newTaxValue) || 0;
                  const isLocal = newTaxState === "Punjab";
                  const totalGstVal = val * (newTaxRate / 100);
                  const cgst = isLocal ? totalGstVal / 2 : 0;
                  const sgst = isLocal ? totalGstVal / 2 : 0;
                  const igst = !isLocal ? totalGstVal : 0;
                  const totalWithTax = val + totalGstVal;

                  return (
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-[10px] space-y-1 font-semibold text-slate-500">
                      <div className="flex justify-between border-b border-slate-200/50 pb-1 font-bold text-slate-800">
                        <span>Dynamic Computation Preview</span>
                        <span className="text-indigo-600 font-extrabold uppercase">Local state: Punjab</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span>Taxable Value:</span>
                        <span>₹{val.toLocaleString("en-IN")}</span>
                      </div>
                      {isLocal ? (
                        <>
                          <div className="flex justify-between font-mono">
                            <span>CGST ({newTaxRate/2}%):</span>
                            <span>₹{cgst.toLocaleString("en-IN")}</span>
                          </div>
                          <div className="flex justify-between font-mono">
                            <span>SGST ({newTaxRate/2}%):</span>
                            <span>₹{sgst.toLocaleString("en-IN")}</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-between font-mono">
                          <span>IGST ({newTaxRate}%):</span>
                          <span>₹{igst.toLocaleString("en-IN")}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-mono font-black border-t border-slate-200/50 pt-1 text-slate-800">
                        <span>Invoice Total:</span>
                        <span>₹{totalWithTax.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  );
                })()}

                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] rounded-xl cursor-pointer border-0 shadow-sm transition-colors flex items-center justify-center gap-1"
                >
                  <Check className="h-3.5 w-3.5" /> Commit Invoice & Calculate GST
                </button>
              </form>
            </div>

          </div>

          {/* HSN-WISE TAX REPORT */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                  <Scale className="h-4.5 w-4.5 text-indigo-600" />
                  AgTech HSN-wise Sales & Purchase Tax Report
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Customs & GST HSN classification compliance logs for Agritech equipment, organic biochemicals, smart devices, and seed lines.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const csvContent = "data:text/csv;charset=utf-8," 
                      + "HSN Code,Category Name,GST Rate,Sales Taxable,Sales CGST,Sales SGST,Sales IGST,Purchase Taxable,Purchase CGST,Purchase SGST,Purchase IGST\n"
                      + hsnGroupedReport.map(e => `"${e.hsn}","${e.name}",${e.rate},${e.salesTaxable},${e.salesCGST},${e.salesSGST},${e.salesIGST},${e.purchaseTaxable},${e.purchaseCGST},${e.purchaseSGST},${e.purchaseIGST}`).join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", `HSN_tax_report_${new Date().toISOString().slice(0,10)}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-xl border-0 cursor-pointer flex items-center gap-1 transition-all"
                >
                  <Download className="h-3.5 w-3.5" /> Export HSN Report (.CSV)
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 uppercase font-black tracking-wider">
                    <th className="py-3 px-2">HSN Code</th>
                    <th className="py-3 px-2">Product Category</th>
                    <th className="py-3 px-2 text-center">GST Rate</th>
                    <th className="py-3 px-2 text-right">Sales Taxable (Output)</th>
                    <th className="py-3 px-2 text-right">Sales GST</th>
                    <th className="py-3 px-2 text-right">Purchases Taxable (Input)</th>
                    <th className="py-3 px-2 text-right">Purchase ITC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs">
                  {hsnGroupedReport.map((hsn) => {
                    const salesGst = hsn.salesCGST + hsn.salesSGST + hsn.salesIGST;
                    const purchaseGst = hsn.purchaseCGST + hsn.purchaseSGST + hsn.purchaseIGST;
                    return (
                      <tr key={hsn.hsn} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-2 font-mono font-bold text-slate-700">
                          {hsn.hsn}
                        </td>
                        <td className="py-3 px-2 font-bold text-slate-800">
                          {hsn.name}
                        </td>
                        <td className="py-3 px-2 text-center font-bold">
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px]">
                            {hsn.rate}%
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right font-mono font-bold text-slate-700">
                          ₹{hsn.salesTaxable.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-2 text-right font-mono font-black text-indigo-700">
                          ₹{salesGst.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-2 text-right font-mono font-bold text-slate-500">
                          ₹{hsn.purchaseTaxable.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-2 text-right font-mono font-black text-emerald-700">
                          ₹{purchaseGst.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* TAX TRANSACTION AUDIT TRAIL LEDGER */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-left">
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                  <FileText className="h-4.5 w-4.5 text-indigo-600" />
                  Tax Invoices & Purchases Ledger (Audit Trail)
                </h3>
                <p className="text-[10px] text-slate-400">
                  Search, filter, and drill down on localized SGST, CGST, and IGST breakdowns for institutional taxation audits.
                </p>
              </div>

              {/* AUDIT SEARCH & FILTERS ROW */}
              <div className="flex flex-wrap items-center gap-3">
                
                {/* Type Filter */}
                <select
                  value={taxFilterType}
                  onChange={(e) => setTaxFilterType(e.target.value as any)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                >
                  <option value="All">All Transactions</option>
                  <option value="Sales">Output Sales Invoices</option>
                  <option value="Purchase">Input Vendor POs</option>
                </select>

                {/* Date Month Filter */}
                <select
                  value={taxFilterPeriod}
                  onChange={(e) => setTaxFilterPeriod(e.target.value as any)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                >
                  <option value="All">All Months</option>
                  <option value="June">June 2026</option>
                  <option value="July">July 2026</option>
                </select>

                {/* HSN Filter */}
                <select
                  value={taxFilterHSN}
                  onChange={(e) => setTaxFilterHSN(e.target.value as any)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                >
                  <option value="All">All HSN Codes</option>
                  <option value="1209">HSN 1209 (Seeds)</option>
                  <option value="3105">HSN 3105 (Fertilizers)</option>
                  <option value="9015">HSN 9015 (Sensors)</option>
                  <option value="8424">HSN 8424 (Machinery)</option>
                </select>

                <button
                  onClick={() => {
                    setTaxFilterType("All");
                    setTaxFilterPeriod("All");
                    setTaxFilterHSN("All");
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border-0 cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 uppercase font-black tracking-wider">
                    <th className="py-3 px-2">ID Ref</th>
                    <th className="py-3 px-2">Account Name</th>
                    <th className="py-3 px-2">Product Description</th>
                    <th className="py-3 px-2">Date</th>
                    <th className="py-3 px-2">HSN</th>
                    <th className="py-3 px-2">POS State</th>
                    <th className="py-3 px-2 text-right">Pre-Tax (₹)</th>
                    <th className="py-3 px-2 text-right">CGST</th>
                    <th className="py-3 px-2 text-right">SGST</th>
                    <th className="py-3 px-2 text-right">IGST</th>
                    <th className="py-3 px-2 text-right">Total GST (₹)</th>
                    <th className="py-3 px-2 text-right">Gross Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs">
                  {filteredTaxRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-2 font-mono font-extrabold text-slate-800">
                        {r.id}
                      </td>
                      <td className="py-3 px-2 font-bold text-slate-800 truncate max-w-[130px]">
                        {r.partnerName}
                      </td>
                      <td className="py-3 px-2 text-slate-600 truncate max-w-[150px]">
                        {r.itemDescription}
                      </td>
                      <td className="py-3 px-2 font-mono text-slate-500">
                        {r.date}
                      </td>
                      <td className="py-3 px-2 font-mono text-slate-500">
                        {r.hsnCode}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          r.placeOfSupply === "Punjab" ? "bg-amber-50 text-amber-800" : "bg-sky-50 text-sky-800"
                        }`}>
                          {r.placeOfSupply}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right font-mono font-semibold text-slate-700">
                        ₹{r.taxableValue.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-2 text-right font-mono text-slate-500">
                        {r.cgst > 0 ? `₹${r.cgst.toLocaleString("en-IN")}` : "-"}
                      </td>
                      <td className="py-3 px-2 text-right font-mono text-slate-500">
                        {r.sgst > 0 ? `₹${r.sgst.toLocaleString("en-IN")}` : "-"}
                      </td>
                      <td className="py-3 px-2 text-right font-mono text-slate-500">
                        {r.igst > 0 ? `₹${r.igst.toLocaleString("en-IN")}` : "-"}
                      </td>
                      <td className={`py-3 px-2 text-right font-mono font-bold ${
                        r.type === "Sales" ? "text-indigo-600" : "text-emerald-600"
                      }`}>
                        ₹{r.totalTax.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-2 text-right font-mono font-black text-slate-800">
                        ₹{r.grossValue.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                  {filteredTaxRecords.length === 0 && (
                    <tr>
                      <td colSpan={12} className="py-8 text-center text-slate-400 font-bold">
                        No transactions found matching active search parameters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* EXPORT REPORT DIALOG MODAL */}
      <div id="export-financial-modal" className="fixed inset-0 z-100 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 hidden animate-fadeIn">
        <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative text-left">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="space-y-0.5">
              <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                <FileSpreadsheet className="h-5 w-5 text-indigo-600" />
                Agritech Financial Audit Export
              </h4>
              <p className="text-[10px] text-slate-400">
                Compile institutional books and dispatch legal spreadsheets.
              </p>
            </div>
            <button
              onClick={() => {
                const modal = document.getElementById("export-financial-modal");
                if (modal) modal.classList.add("hidden");
              }}
              className="text-slate-400 hover:text-slate-600 border-0 bg-transparent text-lg font-bold cursor-pointer"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleExport} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] text-slate-400 font-bold uppercase block">1. Select Target Export Format</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setExportFormat("CSV")}
                  className={`p-3 rounded-xl border font-bold text-xs cursor-pointer transition-all ${
                    exportFormat === "CSV"
                      ? "border-indigo-600 bg-indigo-50/50 text-indigo-700"
                      : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                  }`}
                >
                  Comma Separated (.CSV)
                </button>
                <button
                  type="button"
                  onClick={() => setExportFormat("PDF")}
                  className={`p-3 rounded-xl border font-bold text-xs cursor-pointer transition-all ${
                    exportFormat === "PDF"
                      ? "border-indigo-600 bg-indigo-50/50 text-indigo-700"
                      : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                  }`}
                >
                  Printable Ledger (.PDF)
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-slate-400 font-bold uppercase block">2. Invoiced Territory Boundary</label>
              <p className="text-xs text-slate-600 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                🌎 <strong>Scope:</strong> {selectedRegion === "All" ? "Unified Nationwide (All Hubs)" : `Locked Territory: Hub ${selectedRegion}`}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-slate-400 font-bold uppercase block">3. Timeframe Bound</label>
              <p className="text-xs text-slate-600 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                📅 <strong>Coverage Period:</strong> {dataset.label}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  const modal = document.getElementById("export-financial-modal");
                  if (modal) modal.classList.add("hidden");
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wide rounded-xl border-0 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isExporting}
                onClick={() => {
                  setTimeout(() => {
                    const modal = document.getElementById("export-financial-modal");
                    if (modal) modal.classList.add("hidden");
                  }, 1200);
                }}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer border-0 shadow-xs flex items-center gap-1.5"
              >
                {isExporting ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Compiling...
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5" /> Dispatch Report
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}
