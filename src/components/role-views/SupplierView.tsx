import React, { useState, useMemo } from "react";
import {
  Tag,
  Package,
  Wrench,
  BarChart,
  ShoppingBag,
  TrendingUp,
  Sliders,
  DollarSign,
  Briefcase,
  Layers,
  ArrowUpRight,
  AlertCircle,
  Building,
  Search,
  Calculator,
  Sparkles,
  Check,
  ArrowDownRight,
  HelpCircle,
  Activity,
  Info,
  Cpu,
  ShieldCheck,
  Smartphone,
  Laptop,
  Tablet,
  ShieldAlert,
  Trash2,
  CheckSquare,
  Download,
  X,
  Lock,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Shield,
  Award,
  RefreshCw,
  Upload,
  Fingerprint,
  Star,
  CreditCard,
  FileText,
  MessageSquare,
  ThumbsUp,
  Plus,
  ArrowUp,
  ArrowDown,
  Video,
  Percent,
  Truck,
  Eye,
  Settings,
  Copy,
  Archive,
  Pencil,
  Printer
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from "recharts";
import OrderHistoryAnalytics from "../supplier/OrderHistoryAnalytics";
import ReturnsRefundsManager from "../supplier/ReturnsRefundsManager";
import InventoryTracker from "../supplier/InventoryTracker";
import { SupplierItem } from "../../types";
import MLPredictionHub from "../analytics/MLPredictionHub";
import SupplierAuthOnboarding from "../supplier/SupplierAuthOnboarding";
import CustomerManager from "../supplier/CustomerManager";
import CustomReports from "../supplier/CustomReports";
import CertificationHub from "../supplier/CertificationHub";
import AIDemandPredictor from "../supplier/AIDemandPredictor";
import AIPricingOptimizer from "../supplier/AIPricingOptimizer";
import AIProductGenerator from "../supplier/AIProductGenerator";
import SupplierAIChatAssistant from "../supplier/SupplierAIChatAssistant";
import SupplierProfileSettings from "../supplier/SupplierProfileSettings";
import { LogOut, Users } from "lucide-react";
import { addAuditEntry } from "../../utils/auditLogger";

interface SupplierViewProps {
  items: SupplierItem[];
  onUpdateItem: (id: string, updated: Partial<SupplierItem>) => void;
}

const COMPARISON_PRODUCTS = [
  {
    id: "comp-1",
    name: "Certified Organic Seed Potatoes (A-Grade)",
    category: "Seeds",
    unit: "Bag (15kg)",
    averageMarketRate: 48,
    linkedSkuId: "sup-1",
    defaultStorePrice: 45,
    greenfield: 49,
    bharatAgro: 46,
    kisanCoop: 44
  },
  {
    id: "comp-2",
    name: "Drought-Resilient Hybrid Millet Seeds",
    category: "Seeds",
    unit: "Bag (10kg)",
    averageMarketRate: 35,
    linkedSkuId: "millet-seeds",
    defaultStorePrice: 32,
    greenfield: 34,
    bharatAgro: 36,
    kisanCoop: 33
  },
  {
    id: "comp-3",
    name: "High-Yield Durum Wheat Seeds (Certified)",
    category: "Seeds",
    unit: "Bag (20kg)",
    averageMarketRate: 44,
    linkedSkuId: "durum-wheat",
    defaultStorePrice: 40,
    greenfield: 42,
    bharatAgro: 45,
    kisanCoop: 41
  },
  {
    id: "comp-4",
    name: "Nitrogen-Release Bio-Fertilizer Compost (25kg)",
    category: "Fertilizers",
    unit: "Bag (25kg)",
    averageMarketRate: 28,
    linkedSkuId: "sup-3",
    defaultStorePrice: 25,
    greenfield: 29,
    bharatAgro: 27,
    kisanCoop: 24
  },
  {
    id: "comp-5",
    name: "Organic Neem-Based Liquid Pesticide",
    category: "Fertilizers",
    unit: "Litre",
    averageMarketRate: 18,
    linkedSkuId: "neem-pest",
    defaultStorePrice: 15,
    greenfield: 16,
    bharatAgro: 19,
    kisanCoop: 17
  },
  {
    id: "comp-6",
    name: "Premium Potash Granular Fertilizer",
    category: "Fertilizers",
    unit: "Bag (50kg)",
    averageMarketRate: 68,
    linkedSkuId: "potash-fert",
    defaultStorePrice: 62,
    greenfield: 65,
    bharatAgro: 70,
    kisanCoop: 64
  }
];

const MACHINERY_OPTIONS = [
  {
    id: "iot-soil",
    name: "Smart IoT Soil Moisture Sensor Grid",
    category: "IoT Sensors",
    costBase: 1200,
    costPerAcre: 80,
    yieldBoostPct: 6,
    waterSavingPct: 25,
    laborSavingAnnual: 400,
    description: "Real-time wireless soil telemetry probes mapping nitrogen, moisture, and temperature. Drastically reduces waste water and optimizes feeding windows."
  },
  {
    id: "drone-spectral",
    name: "Precision UAV Multi-Spectral Drone",
    category: "Machinery",
    costBase: 6500,
    costPerAcre: 0,
    yieldBoostPct: 10,
    waterSavingPct: 35,
    laborSavingAnnual: 1500,
    description: "Automated high-definition aerial mapping spotting weed clusters and early nitrogen deficiencies. Enables micro-dosage application."
  },
  {
    id: "solar-drip",
    name: "Automated Solar-Powered Irrigation Hub",
    category: "Machinery",
    costBase: 4500,
    costPerAcre: 120,
    yieldBoostPct: 15,
    waterSavingPct: 45,
    laborSavingAnnual: 900,
    description: "Autonomous solar pump and manifold controller delivering localized irrigation and fertigation directly to root systems."
  },
  {
    id: "smart-weeder",
    name: "AI Autonomous Laser Weeder Bot",
    category: "Machinery",
    costBase: 15000,
    costPerAcre: 60,
    yieldBoostPct: 5,
    waterSavingPct: 15,
    laborSavingAnnual: 3000,
    description: "Self-navigating field robot that identifies weed species in real-time and uses thermal lasers to eliminate them without herbicide."
  }
];

export default function SupplierView({ items, onUpdateItem }: SupplierViewProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem("agriconnect_supplier_auth") === "true");
  const [supplierData, setSupplierData] = useState<any>(() => {
    const stored = localStorage.getItem("agriconnect_supplier_data");
    return stored ? JSON.parse(stored) : null;
  });

  // Supplier Verification System states
  const [verificationStatus, setVerificationStatus] = useState(() => {
    const stored = localStorage.getItem("agriconnect_supplier_verification");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }
    return {
      emailVerified: false,
      mobileVerified: false,
      emailOtpSent: false,
      mobileOtpSent: false,
      emailOtpInput: "",
      mobileOtpInput: "",
      emailOtpCode: "4198",
      mobileOtpCode: "9251",
      gstVerified: true,
      gstApiChecked: false,
      bankVerified: false,
      bankPennyDropped: false,
      creditScoreChecked: false,
      creditScore: null as number | null,
      govDocsUploaded: [] as string[]
    };
  });

  const [emailOtpLoading, setEmailOtpLoading] = useState(false);
  const [emailVerifyLoading, setEmailVerifyLoading] = useState(false);
  const [mobileOtpLoading, setMobileOtpLoading] = useState(false);
  const [mobileVerifyLoading, setMobileVerifyLoading] = useState(false);
  
  const [gstChecking, setGstChecking] = useState(false);
  const [bankChecking, setBankChecking] = useState(false);
  const [creditChecking, setCreditChecking] = useState(false);
  
  const [govDocType, setGovDocType] = useState("National Seeds Certificate");
  const [govFileUploading, setGovFileUploading] = useState(false);
  const [govUploadProgress, setGovUploadProgress] = useState(0);

  // Active status messages
  const [verificationFeedback, setVerificationFeedback] = useState("");

  // Localized items list to allow adding new products and persisting them locally
  const [localItems, setLocalItems] = useState<any[]>(() => {
    const stored = localStorage.getItem("agriconnect_supplier_items");
    let itemsList = items;
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed) && parsed.length >= items.length) {
          itemsList = parsed;
        }
      } catch (e) {}
    }
    
    const defaultImages: Record<string, string> = {
      "Seeds": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop",
      "Fertilizers": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&auto=format&fit=crop",
      "IoT Sensors": "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=400&auto=format&fit=crop",
      "Machinery": "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400&auto=format&fit=crop"
    };

    return itemsList.map((item, idx) => ({
      ...item,
      sku: item.sku || `SKU-${item.category.toUpperCase().slice(0,3)}-${item.name.replace(/[^a-zA-Z]/g, "").slice(0,3).toUpperCase()}-${item.id}`,
      publishStatus: item.publishStatus || (idx === 2 ? "Draft" : idx === 3 ? "Archived" : "Active"),
      dateAdded: item.dateAdded || `2026-07-0${idx + 1}`,
      images: item.images || [item.image || defaultImages[item.category as string] || defaultImages["Seeds"]],
      image: item.image || defaultImages[item.category as string] || defaultImages["Seeds"]
    }));
  });

  // State controls for interactive product lists view (Section 3.2)
  const [productSearchQuery, setProductSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("All"); // All, Active, Draft, Archived
  const [filterStock, setFilterStock] = useState<string>("All"); // All, In Stock, Low Stock, Out of Stock
  const [filterDateAdded, setFilterDateAdded] = useState<string>("All"); // All, 7 (last 7 days), 30 (last 30 days), 365 (this year)
  const [sortBy, setSortBy] = useState<string>("name-asc"); // name-asc, name-desc, price-asc, price-desc, stock-asc, stock-desc, date-desc, date-asc
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [inventoryActiveTab, setInventoryActiveTab] = useState<"catalog" | "stock-tracking">("catalog");

  React.useEffect(() => {
    localStorage.setItem("agriconnect_supplier_items", JSON.stringify(localItems));
  }, [localItems]);

  React.useEffect(() => {
    addAuditEntry(
      "Supplier Portal Authentication",
      "User 'jakkireddyeswarreddy@gmail.com' successfully authenticated via AgriConnect 2FA secure OAuth gateway. Session established.",
      "login"
    );
  }, []);

  // Orders State for interactive dashboard
  const [orders, setOrders] = useState(() => {
    const stored = localStorage.getItem("agriconnect_supplier_orders");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed)) {
          return parsed.map(o => ({
            ...o,
            status: o.status === "Pending" ? "New" : (o.status === "Active" ? "Processing" : (o.status === "Completed" ? "Delivered" : o.status)),
            paymentStatus: o.paymentStatus || "Paid",
            trackingNumber: o.trackingNumber || "",
            location: o.location || "Karnal, Haryana",
            buyerCompany: o.buyerCompany || "Farmers Cooperative Association",
            buyerContact: o.buyerContact || "+91 98450-12345",
            buyerEmail: o.buyerEmail || `buyer.${(o.id || "guest").toLowerCase()}@agriconnect.org`,
            sku: o.sku || "AGR-INPUT-SKU",
            unitPrice: o.unitPrice || Math.max(1, Math.round((o.amount || 100) / (o.quantity || 1))),
            paymentMethod: o.paymentMethod || "UPI",
            shippingMethod: o.shippingMethod || "Standard",
            courierCompany: o.courierCompany || "Delhivery Logistics",
            estimatedDelivery: o.estimatedDelivery || "2026-07-12"
          }));
        }
      } catch (e) {}
    }
    return [
      {
        id: "ORD-2026-003",
        farmerName: "Priya Sharma",
        buyerCompany: "Priya Organic Farms Ltd.",
        buyerContact: "+91 98123-45603",
        buyerEmail: "priya.sharma@organicagri.in",
        productName: "Hybrid Wheat Seeds (PBW 343)",
        sku: "WHT-HYB-PBW",
        location: "Karnal, Haryana",
        quantity: 10,
        unitPrice: 1200,
        amount: 12000,
        status: "Shipped",
        paymentStatus: "Paid",
        paymentMethod: "UPI",
        shippingMethod: "Standard",
        trackingNumber: "TRK-WHT-2026-003",
        courierCompany: "Delhivery Logistics",
        estimatedDelivery: "2026-07-15",
        date: "2026-07-10"
      },
      {
        id: "ORD-2026-004",
        farmerName: "Rajesh Patel",
        buyerCompany: "Patel Agro Cooperative",
        buyerContact: "+91 99876-54321",
        buyerEmail: "rajesh.patel@gujaratcoop.org",
        productName: "Urea Fertilizer (Premium)",
        sku: "FERT-UREA-PREM",
        location: "Anand, Gujarat",
        quantity: 10,
        unitPrice: 800,
        amount: 8000,
        status: "Processing",
        paymentStatus: "Paid",
        paymentMethod: "Net Banking",
        shippingMethod: "Express",
        trackingNumber: "",
        courierCompany: "BlueDart",
        estimatedDelivery: "2026-07-16",
        date: "2026-07-12"
      },
      {
        id: "ORD-9831",
        farmerName: "Siddharth Roy",
        buyerCompany: "Sahyadri Agro-Tech Pvt Ltd",
        buyerContact: "+91 98220-11223",
        buyerEmail: "siddharth.roy@sahyadri.com",
        productName: "Tractor (Mahindra 575)",
        sku: "MACH-TRACT-575",
        location: "Nashik, Maharashtra",
        quantity: 1,
        unitPrice: 250000,
        amount: 250000,
        status: "Delivered",
        paymentStatus: "Paid",
        paymentMethod: "Card",
        shippingMethod: "Standard",
        trackingNumber: "TRK-9831-IND",
        courierCompany: "Delhivery",
        estimatedDelivery: "2026-07-05",
        date: "2026-07-01"
      },
      {
        id: "ORD-9844",
        farmerName: "Sunita Rao",
        buyerCompany: "Belgaum Growers Federation",
        buyerContact: "+91 97401-23456",
        buyerEmail: "sunita.rao@belgaumgrowers.org",
        productName: "High-Capacity Grain Moisture Meter Pro",
        sku: "METER-MOIST-PRO",
        location: "Belgaum, Karnataka",
        quantity: 5,
        unitPrice: 300,
        amount: 1500,
        status: "Shipped",
        paymentStatus: "Paid",
        paymentMethod: "Wallet",
        shippingMethod: "Express",
        trackingNumber: "TRK-9844-IND",
        courierCompany: "Speed Post",
        estimatedDelivery: "2026-07-10",
        date: "2026-07-07"
      }
    ];
  });

  React.useEffect(() => {
    localStorage.setItem("agriconnect_supplier_orders", JSON.stringify(orders));
  }, [orders]);

  // Modal Dialog states
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [addProductActiveTab, setAddProductActiveTab] = useState<"general" | "pricing" | "inventory" | "media" | "shipping">("general");
  const [selectedProductForView, setSelectedProductForView] = useState<any>(null);
  const [productViewTab, setProductViewTab] = useState<"overview" | "edit" | "sales" | "reviews" | "performance" | "related">("overview");
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isCustomersOpen, setIsCustomersOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isCertificationsOpen, setIsCertificationsOpen] = useState(false);
  const [isDemandPredictorOpen, setIsDemandPredictorOpen] = useState(false);
  const [isPricingOptimizerOpen, setIsPricingOptimizerOpen] = useState(false);
  const [isProductGeneratorOpen, setIsProductGeneratorOpen] = useState(false);
  const [isChatAssistantOpen, setIsChatAssistantOpen] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [approvedCertificates, setApprovedCertificates] = useState<string[]>(() => {
    const saved = localStorage.getItem("agriconnect_supplier_applications");
    if (saved) {
      try {
        const apps = JSON.parse(saved);
        return apps
          .filter((app: any) => app.status === "Approved")
          .map((app: any) => app.typeId);
      } catch (e) {}
    }
    return ["gov-approved"]; // default initial approved cert for testing
  });

  // Order Management additional states
  const [selectedOrderForView, setSelectedOrderForView] = useState<any>(null);
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>("ALL");
  const [orderFilterPaymentStatus, setOrderFilterPaymentStatus] = useState<string>("ALL");
  const [orderFilterBuyerName, setOrderFilterBuyerName] = useState<string>("");
  const [orderFilterDateStart, setOrderFilterDateStart] = useState<string>("");
  const [orderFilterDateEnd, setOrderFilterDateEnd] = useState<string>("");
  const [trackingInputMap, setTrackingInputMap] = useState<Record<string, string>>({});
  
  // Tabs & timeframe states for 4.3 Order History & Analytics
  const [ordersActiveTab, setOrdersActiveTab] = useState<"pipeline" | "history" | "analytics" | "returns">("pipeline");
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<"month" | "quarter" | "year">("year");

  // Sub-modal states for advanced order details action flows
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isPackingSlipOpen, setIsPackingSlipOpen] = useState(false);
  const [isContactBuyerOpen, setIsContactBuyerOpen] = useState(false);
  const [contactChannel, setContactChannel] = useState<"email" | "sms" | "whatsapp">("email");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isContactSending, setIsContactSending] = useState(false);
  const [contactSuccessAlert, setContactSuccessAlert] = useState("");
  const [isSendingInvoiceEmail, setIsSendingInvoiceEmail] = useState(false);
  const [invoiceEmailSuccessAlert, setInvoiceEmailSuccessAlert] = useState("");

  // Export helper functions
  const exportToCSV = (orderList: any[]) => {
    const headers = ["Order ID", "Date", "Buyer Name", "Buyer Company", "Product", "SKU", "Quantity", "Unit Price (INR)", "Amount (INR)", "Payment Method", "Payment Status", "Shipping Address", "Shipping Method", "Courier", "Tracking Number", "Estimated Delivery", "Status"];
    const rows = orderList.map(o => [
      o.id,
      o.date,
      o.farmerName,
      o.buyerCompany || "Farmers Cooperative Association",
      o.productName,
      o.sku || "",
      o.quantity,
      o.unitPrice * 84,
      o.amount * 84,
      o.paymentMethod || "UPI",
      o.paymentStatus || "Paid",
      o.location || "",
      o.shippingMethod || "Standard",
      o.courierCompany || "",
      o.trackingNumber || "",
      o.estimatedDelivery || "",
      o.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `agriconnect_orders_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = (orderList: any[]) => {
    const headers = ["Order ID", "Date", "Buyer Name", "Buyer Company", "Product", "SKU", "Quantity", "Unit Price (INR)", "Amount (INR)", "Payment Method", "Payment Status", "Shipping Address", "Shipping Method", "Courier", "Tracking Number", "Estimated Delivery", "Status"];
    const rows = orderList.map(o => [
      o.id,
      o.date,
      o.farmerName,
      o.buyerCompany || "Farmers Cooperative Association",
      o.productName,
      o.sku || "",
      o.quantity,
      o.unitPrice * 84,
      o.amount * 84,
      o.paymentMethod || "UPI",
      o.paymentStatus || "Paid",
      o.location || "",
      o.shippingMethod || "Standard",
      o.courierCompany || "",
      o.trackingNumber || "",
      o.estimatedDelivery || "",
      o.status
    ]);
    const content = [headers.join("\t"), ...rows.map(e => e.join("\t"))].join("\n");
    const blob = new Blob([content], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `agriconnect_orders_${new Date().toISOString().slice(0,10)}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToXML = (orderList: any[]) => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<orders>\n`;
    orderList.forEach(o => {
      xml += `  <order>\n`;
      xml += `    <id>${o.id}</id>\n`;
      xml += `    <date>${o.date}</date>\n`;
      xml += `    <buyerName>${o.farmerName}</buyerName>\n`;
      xml += `    <buyerCompany>${o.buyerCompany || "Farmers Cooperative Association"}</buyerCompany>\n`;
      xml += `    <productName>${o.productName}</productName>\n`;
      xml += `    <sku>${o.sku || ""}</sku>\n`;
      xml += `    <quantity>${o.quantity}</quantity>\n`;
      xml += `    <unitPriceINR>${o.unitPrice * 84}</unitPriceINR>\n`;
      xml += `    <amountINR>${o.amount * 84}</amountINR>\n`;
      xml += `    <paymentMethod>${o.paymentMethod || "UPI"}</paymentMethod>\n`;
      xml += `    <paymentStatus>${o.paymentStatus || "Paid"}</paymentStatus>\n`;
      xml += `    <shippingAddress>${o.location || ""}</shippingAddress>\n`;
      xml += `    <shippingMethod>${o.shippingMethod || "Standard"}</shippingMethod>\n`;
      xml += `    <courier>${o.courierCompany || ""}</courier>\n`;
      xml += `    <trackingNumber>${o.trackingNumber || ""}</trackingNumber>\n`;
      xml += `    <estimatedDelivery>${o.estimatedDelivery || ""}</estimatedDelivery>\n`;
      xml += `    <status>${o.status}</status>\n`;
      xml += `  </order>\n`;
    });
    xml += `</orders>`;
    const blob = new Blob([xml], { type: "application/xml;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `agriconnect_orders_${new Date().toISOString().slice(0,10)}.xml`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = (orderList: any[]) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    
    const rowsHtml = orderList.map(o => `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${o.id}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${o.date}</td>
        <td style="border: 1px solid #ddd; padding: 8px;"><b>${o.farmerName}</b><br/><span style="font-size:9px;color:#666">${o.buyerCompany || "Farmers Cooperative Association"}</span></td>
        <td style="border: 1px solid #ddd; padding: 8px;">${o.productName}<br/><span style="font-size:9px;color:#888">SKU: ${o.sku || ""}</span></td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${o.quantity}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">₹${(o.amount * 84).toLocaleString()}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><span style="font-size: 10px; font-weight: bold; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px;">${o.status}</span></td>
      </tr>
    `).join("");

    const html = `
      <html>
        <head>
          <title>AgriConnect Past Orders History Export</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #333; }
            h2 { margin-bottom: 5px; color: #4f46e5; }
            p { margin-top: 0; font-size: 12px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }
            th { background: #f3f4f6; text-align: left; padding: 10px; border: 1px solid #ddd; }
            .footer { margin-top: 30px; font-size: 10px; color: #999; text-align: center; }
          </style>
        </head>
        <body>
          <h2>AgriConnect India</h2>
          <p>Enterprise Order History Log — Exported on ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Buyer / Coop</th>
                <th>Product Details</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Total Amount</th>
                <th style="text-align: center;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
          <div class="footer">
            Document generated by AgriConnect Supplier Analytics. © ${new Date().getFullYear()} AgriConnect. All rights reserved.
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
  };

  // Memoized filter calculation for the Order Management Hub
  const filteredOrders = useMemo(() => {
    return orders.filter((ord: any) => {
      // 1. Status Filter
      if (orderFilterStatus !== "ALL" && ord.status !== orderFilterStatus) {
        return false;
      }
      // 2. Payment Status Filter
      if (orderFilterPaymentStatus !== "ALL" && ord.paymentStatus !== orderFilterPaymentStatus) {
        return false;
      }
      // 3. Buyer Name / Order ID / Product Name search
      if (orderFilterBuyerName.trim()) {
        const query = orderFilterBuyerName.toLowerCase();
        const matchesName = (ord.farmerName || "").toLowerCase().includes(query);
        const matchesId = (ord.id || "").toLowerCase().includes(query);
        const matchesProduct = (ord.productName || "").toLowerCase().includes(query);
        const matchesLocation = (ord.location || "").toLowerCase().includes(query);
        if (!matchesName && !matchesId && !matchesProduct && !matchesLocation) {
          return false;
        }
      }
      // 4. Date range checks
      if (orderFilterDateStart && ord.date < orderFilterDateStart) {
        return false;
      }
      if (orderFilterDateEnd && ord.date > orderFilterDateEnd) {
        return false;
      }
      return true;
    });
  }, [orders, orderFilterStatus, orderFilterPaymentStatus, orderFilterBuyerName, orderFilterDateStart, orderFilterDateEnd]);

  // Bulk operation states
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [bulkEditPriceType, setBulkEditPriceType] = useState<"flat" | "percentage">("flat");
  const [bulkEditPriceVal, setBulkEditPriceVal] = useState<string>("");
  const [bulkEditStockVal, setBulkEditStockVal] = useState<string>("");
  const [bulkEditStatus, setBulkEditStatus] = useState<"Active" | "Archived" | "">("");

  // Bulk CSV Upload states
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [csvRawData, setCsvRawData] = useState<any[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    sku: ""
  });
  const [importErrors, setImportErrors] = useState<string[]>([]);

  // New Product Form state
  const [newProdName, setNewProdName] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("Seeds");
  const [newProdSubCategory, setNewProdSubCategory] = useState("Wheat");
  const [newProdSku, setNewProdSku] = useState("");
  const [newProdDescription, setNewProdDescription] = useState("");
  const [newProdUnit, setNewProdUnit] = useState("kg");
  
  // Pricing
  const [newProdPrice, setNewProdPrice] = useState(30);
  const [newProdCostPrice, setNewProdCostPrice] = useState(20);
  const [newProdMrp, setNewProdMrp] = useState(45);
  const [newProdMoq, setNewProdMoq] = useState(10);
  const [newProdBulkPricing, setNewProdBulkPricing] = useState<Array<{ minQty: number; discount: number }>>([
    { minQty: 10, discount: 5 },
    { minQty: 50, discount: 10 }
  ]);

  // Inventory
  const [newProdStock, setNewProdStock] = useState(100);
  const [newProdLowStockThreshold, setNewProdLowStockThreshold] = useState(15);
  const [newProdReorderPoint, setNewProdReorderPoint] = useState(10);

  // Images & Media
  const [newProdImages, setNewProdImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1599933333931-e4065a7fb487?w=400&auto=format&fit=crop"
  ]);
  const [newProdVideo, setNewProdVideo] = useState<string>("");

  // Certifications
  const [newProdGovApproved, setNewProdGovApproved] = useState(false);
  const [newProdOrganicCertified, setNewProdOrganicCertified] = useState(false);
  const [newProdIsoCertified, setNewProdIsoCertified] = useState(false);
  const [newProdFssaiLicense, setNewProdFssaiLicense] = useState("");

  // Shipping
  const [newProdWeight, setNewProdWeight] = useState(1);
  const [newProdDimLength, setNewProdDimLength] = useState(15);
  const [newProdDimWidth, setNewProdDimWidth] = useState(10);
  const [newProdDimHeight, setNewProdDimHeight] = useState(12);
  const [newProdShippingCost, setNewProdShippingCost] = useState(120);
  const [newProdShippingCostType, setNewProdShippingCostType] = useState<"flat" | "calculated">("flat");
  const [newProdShippingZones, setNewProdShippingZones] = useState<string[]>(["India"]);

  // Publish Status
  const [newProdPublishStatus, setNewProdPublishStatus] = useState<"Draft" | "Active" | "Archived">("Active");

  React.useEffect(() => {
    if (selectedProductForView) {
      const product = selectedProductForView;
      setNewProdName(product.name || "");
      setNewProdCategory(product.category || "Seeds");
      setNewProdSubCategory(product.subCategory || "Wheat");
      setNewProdSku(product.sku || "");
      setNewProdDescription(product.description || "");
      setNewProdUnit(product.unit || "kg");
      setNewProdPrice(product.price || 0);
      setNewProdCostPrice(product.costPrice || 0);
      setNewProdMrp(product.mrp || 0);
      setNewProdMoq(product.moq || 1);
      setNewProdBulkPricing(product.bulkPricing || []);
      setNewProdStock(product.stock || 0);
      setNewProdLowStockThreshold(product.lowStockThreshold || 15);
      setNewProdReorderPoint(product.reorderPoint || 10);
      setNewProdImages(product.images || []);
      setNewProdVideo(product.video || "");
      setNewProdGovApproved(product.certifications?.govApproved || false);
      setNewProdOrganicCertified(product.certifications?.organicCertified || false);
      setNewProdIsoCertified(product.certifications?.isoCertified || false);
      setNewProdFssaiLicense(product.certifications?.fssaiLicense || "");
      setNewProdWeight(product.shipping?.weight || 1);
      setNewProdDimLength(product.shipping?.dimensions?.length || 15);
      setNewProdDimWidth(product.shipping?.dimensions?.width || 10);
      setNewProdDimHeight(product.shipping?.dimensions?.height || 12);
      setNewProdShippingCost(product.shipping?.cost || 0);
      setNewProdShippingCostType(product.shipping?.costType || "flat");
      setNewProdShippingZones(product.shipping?.zones || ["India"]);
      setNewProdPublishStatus(product.publishStatus || "Active");
    }
  }, [selectedProductForView]);

  // Scroll helper
  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      el.classList.add("ring-4", "ring-teal-500/20", "transition-all", "duration-500");
      setTimeout(() => {
        el.classList.remove("ring-4", "ring-teal-500/20");
      }, 2000);
    }
  };

  // CSV Custom Parser (RFC 4180 robust compliant)
  const parseCSV = (text: string) => {
    const lines: string[][] = [];
    let row: string[] = [""];
    let inQuotes = false;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          row[row.length - 1] += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push("");
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        lines.push(row);
        row = [""];
      } else {
        row[row.length - 1] += char;
      }
    }
    if (row.length > 1 || row[0] !== "") {
      lines.push(row);
    }
    return lines;
  };

  const handleDownloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Product Name,Category,Price,Stock,Description,SKU\n"
      + "\"Organic Vermicompost\",\"Organic Inputs\",45,250,\"100% pure earthworm manure for soil enrichment.\",\"SKU-ORG-VMC-01\"\n"
      + "\"Premium Wheat Seeds\",\"Seeds\",35,500,\"High-yielding, drought-resilient wheat grain seeds.\",\"SKU-SEED-WHT-99\"\n"
      + "\"IoT Moisture Sensor V2\",\"IoT Sensors\",1200,45,\"Real-time smart moisture reading sensor.\",\"SKU-IOT-MST-02\"\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "agriconnect_bulk_sku_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;
      const allRows = parseCSV(text);
      if (allRows.length === 0) return;
      
      const headers = allRows[0].map(h => h.trim());
      setCsvHeaders(headers);
      
      const dataRows = allRows.slice(1).filter(r => r.length > 0 && r.some(cell => cell.trim() !== ""));
      setCsvRawData(dataRows);
      
      const mapping: Record<string, string> = {
        name: "", category: "", price: "", stock: "", description: "", sku: ""
      };
      headers.forEach(h => {
        const clean = h.toLowerCase().trim();
        if (clean.includes("name") || clean.includes("product")) mapping.name = h;
        else if (clean.includes("category")) mapping.category = h;
        else if (clean.includes("price") || clean.includes("mrp") || clean.includes("cost") || clean.includes("selling")) mapping.price = h;
        else if (clean.includes("stock") || clean.includes("qty") || clean.includes("quantity")) mapping.stock = h;
        else if (clean.includes("desc")) mapping.description = h;
        else if (clean.includes("sku") || clean.includes("id")) mapping.sku = h;
      });
      setColumnMapping(mapping);
      setImportErrors([]);
    };
    reader.readAsText(file);
  };

  const mappedAndValidatedProducts = useMemo(() => {
    if (csvRawData.length === 0) return { products: [], errors: [] };
    
    const list: any[] = [];
    const errors: string[] = [];
    
    const nameIdx = csvHeaders.indexOf(columnMapping.name);
    const categoryIdx = csvHeaders.indexOf(columnMapping.category);
    const priceIdx = csvHeaders.indexOf(columnMapping.price);
    const stockIdx = csvHeaders.indexOf(columnMapping.stock);
    const descIdx = csvHeaders.indexOf(columnMapping.description);
    const skuIdx = csvHeaders.indexOf(columnMapping.sku);
    
    csvRawData.forEach((row, rowIdx) => {
      const name = nameIdx !== -1 ? (row[nameIdx] || "").trim() : "";
      const category = categoryIdx !== -1 ? (row[categoryIdx] || "").trim() : "Seeds";
      const priceRaw = priceIdx !== -1 ? (row[priceIdx] || "").trim() : "0";
      const stockRaw = stockIdx !== -1 ? (row[stockIdx] || "").trim() : "0";
      const description = descIdx !== -1 ? (row[descIdx] || "").trim() : "";
      const sku = skuIdx !== -1 ? (row[skuIdx] || "").trim() : `SKU-IMP-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const rowNum = rowIdx + 2;
      const itemErrors: string[] = [];
      
      if (!name) {
        itemErrors.push(`Row ${rowNum}: Product Name is missing.`);
      }
      
      const price = parseFloat(priceRaw);
      if (isNaN(price) || price <= 0) {
        itemErrors.push(`Row ${rowNum}: Price "${priceRaw}" must be a valid positive number.`);
      }
      
      const stock = parseInt(stockRaw);
      if (isNaN(stock) || stock < 0) {
        itemErrors.push(`Row ${rowNum}: Stock quantity "${stockRaw}" must be a non-negative integer.`);
      }
      
      list.push({
        id: `sup-csv-${Date.now()}-${rowIdx}`,
        name,
        category: category || "Seeds",
        price: isNaN(price) ? 0 : price,
        stock: isNaN(stock) ? 0 : stock,
        description: description || `Bulk imported SKU: ${name}`,
        sku: sku || `SKU-GEN-${Math.floor(100000 + Math.random() * 900000)}`,
        publishStatus: "Active",
        rating: 5.0,
        dateAdded: new Date().toISOString().split("T")[0],
        certifications: {
          govApproved: false,
          organicCertified: false,
          isoCertified: false,
          fssaiLicense: ""
        }
      });
      
      if (itemErrors.length > 0) {
        errors.push(...itemErrors);
      }
    });
    
    return {
      products: list,
      errors
    };
  }, [csvRawData, csvHeaders, columnMapping]);

  const handleImportValidatedProducts = () => {
    const { products, errors } = mappedAndValidatedProducts;
    const validProducts: any[] = [];
    
    products.forEach((prod) => {
      const hasName = !!prod.name;
      const isPriceValid = prod.price > 0;
      const isStockValid = prod.stock >= 0;
      
      if (hasName && isPriceValid && isStockValid) {
        validProducts.push(prod);
      }
    });
    
    if (validProducts.length === 0) {
      setImportErrors(["No valid products found to import. Correct the template errors first."]);
      return;
    }
    
    setLocalItems(prev => [...validProducts, ...prev]);
    setVerificationFeedback(`🎉 Successfully imported ${validProducts.length} new SKUs into your marketplace inventory!`);
    
    setUploadedFileName("");
    setCsvRawData([]);
    setCsvHeaders([]);
    setIsBulkUploadOpen(false);
  };

  React.useEffect(() => {
    localStorage.setItem("agriconnect_supplier_verification", JSON.stringify(verificationStatus));
  }, [verificationStatus]);

  const trustScore = useMemo(() => {
    let score = 30; // base rating from GST onboarding details entry
    if (verificationStatus.emailVerified) score += 15;
    if (verificationStatus.mobileVerified) score += 15;
    if (verificationStatus.gstApiChecked) score += 15;
    if (verificationStatus.bankPennyDropped) score += 15;
    if (verificationStatus.creditScoreChecked) score += 15;
    if (verificationStatus.govDocsUploaded && verificationStatus.govDocsUploaded.length > 0) {
      score += 10;
    }
    // Boost score for our approved compliance certificates (+15% for each certification type, up to 100%)
    if (approvedCertificates && approvedCertificates.length > 0) {
      score += approvedCertificates.length * 15;
    }
    return Math.min(score, 100);
  }, [verificationStatus, approvedCertificates]);

  const trustColorBg = useMemo(() => {
    if (trustScore >= 70) return "bg-emerald-600";
    if (trustScore >= 50) return "bg-amber-500";
    return "bg-rose-500";
  }, [trustScore]);

  const trustColorText = useMemo(() => {
    if (trustScore >= 70) return "text-emerald-600";
    if (trustScore >= 50) return "text-amber-600";
    return "text-rose-600";
  }, [trustScore]);

  const trustColorBorder = useMemo(() => {
    if (trustScore >= 70) return "border-emerald-200";
    if (trustScore >= 50) return "border-amber-200";
    return "border-rose-200";
  }, [trustScore]);

  const totalRevenue = useMemo(() => {
    // Convert USD sales from orders to Rupees, plus a realistic base revenue of ₹2,45,000
    const ordersRupees = orders.reduce((sum: number, ord: any) => sum + ord.amount * 84, 0);
    return 245000 + ordersRupees;
  }, [orders]);

  const totalSalesUnits = useMemo(() => {
    const ordersUnits = orders.reduce((sum: number, ord: any) => sum + ord.quantity, 0);
    return 320 + ordersUnits;
  }, [orders]);

  const averageRating = useMemo(() => {
    if (localItems.length === 0) return "5.0";
    const sum = localItems.reduce((acc, item) => acc + item.rating, 0);
    return (sum / localItems.length).toFixed(1);
  }, [localItems]);

  const lowStockCount = useMemo(() => {
    return localItems.filter((item) => item.stock < 15).length;
  }, [localItems]);

  const hasVerifiedBadge = trustScore >= 70;
  const hasGovApprovedBadge = verificationStatus.govDocsUploaded && verificationStatus.govDocsUploaded.length > 0;

  // Section 2.2: Supplier Performance Widget States and Memos
  const [salesTrendDays, setSalesTrendDays] = useState<"7" | "30" | "90">("30");
  
  // Interactive reviews rating upvotes simulation
  const [reviewUpvotes, setReviewUpvotes] = useState<Record<string, number>>({
    "rev-1": 18,
    "rev-2": 9,
    "rev-3": 4
  });

  const [reviewsList, setReviewsList] = useState([
    {
      id: "rev-1",
      customerName: "Suresh Patil",
      role: "Mandi Cooperative Chairman",
      rating: 5,
      date: "2026-07-04",
      comment: "Ordered 100 bags of seed potatoes for our village cluster. The germination rate is outstanding (94%+), and the logistics coordination was handled perfectly by AgriConnect. Highly recommended!",
      verified: true
    },
    {
      id: "rev-2",
      customerName: "Dr. Vikram Seth",
      role: "Individual Organic Farmer",
      rating: 5,
      date: "2026-07-02",
      comment: "The NPK IoT moisture probe works flawlessly. Integrates beautifully with our local server and has helped us reduce water waste by 30% this cycle.",
      verified: true
    },
    {
      id: "rev-3",
      customerName: "Gurpreet Singh",
      role: "Wholesale Input Buyer",
      rating: 4,
      date: "2026-06-28",
      comment: "Bio-fertilizer compost quality is extremely rich, and nutrient profiling matches testing. Packaging could be slightly more rugged for rough local roads.",
      verified: true
    }
  ]);

  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewAuthor, setNewReviewAuthor] = useState("");

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim() || !newReviewAuthor.trim()) return;
    const newId = `rev-${Date.now()}`;
    const newRev = {
      id: newId,
      customerName: newReviewAuthor,
      role: "Verified Buyer",
      rating: newReviewRating,
      date: new Date().toISOString().split('T')[0],
      comment: newReviewText,
      verified: true
    };
    setReviewsList([newRev, ...reviewsList]);
    setReviewUpvotes(prev => ({ ...prev, [newId]: 0 }));
    setNewReviewText("");
    setNewReviewAuthor("");
    setVerificationFeedback("💬 Thank you! Your review has been added to our feedback board.");
  };

  const handleUpvoteReview = (id: string) => {
    setReviewUpvotes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  // Sales Trend Data (7, 30, 90 Days)
  const salesTrendData = useMemo(() => {
    if (salesTrendDays === "7") {
      return [
        { name: "Jul 02", units: 12, revenue: 12 * 84 * 35 },
        { name: "Jul 03", units: 18, revenue: 18 * 84 * 30 },
        { name: "Jul 04", units: 25, revenue: 25 * 84 * 40 },
        { name: "Jul 05", units: 42, revenue: 42 * 84 * 45 },
        { name: "Jul 06", units: 31, revenue: 31 * 84 * 38 },
        { name: "Jul 07", units: 48, revenue: 48 * 84 * 42 },
        { name: "Jul 08", units: 55, revenue: 55 * 84 * 44 }
      ];
    }
    if (salesTrendDays === "90") {
      return [
        { name: "May W1", units: 120, revenue: 410000 },
        { name: "May W3", units: 145, revenue: 490000 },
        { name: "Jun W1", units: 160, revenue: 540000 },
        { name: "Jun W3", units: 190, revenue: 640000 },
        { name: "Jul W1", units: 210, revenue: 710000 },
        { name: "Jul W2", units: 240, revenue: 820000 }
      ];
    }
    // Default 30 Days
    return [
      { name: "Jun 09", units: 24, revenue: 81000 },
      { name: "Jun 14", units: 38, revenue: 128000 },
      { name: "Jun 19", units: 45, revenue: 152000 },
      { name: "Jun 24", units: 62, revenue: 210000 },
      { name: "Jun 29", units: 58, revenue: 196000 },
      { name: "Jul 04", units: 75, revenue: 253000 },
      { name: "Jul 08", units: 92, revenue: 312000 }
    ];
  }, [salesTrendDays]);

  // Top Selling Products (top 5 with quantity sold)
  const topSellingProducts = useMemo(() => {
    return [
      {
        name: "Certified Organic Seed Potatoes (A-Grade)",
        category: "Seeds",
        sold: 145,
        revenue: 145 * 84 * 45,
        rating: 4.9,
        percentage: 85
      },
      {
        name: "Drought-Resilient Hybrid Millet Seeds",
        category: "Seeds",
        sold: 98,
        revenue: 98 * 84 * 32,
        rating: 4.8,
        percentage: 60
      },
      {
        name: "Nitrogen-Release Bio-Fertilizer Compost (25kg)",
        category: "Fertilizers",
        sold: 85,
        revenue: 85 * 84 * 25,
        rating: 4.7,
        percentage: 52
      },
      {
        name: "Solar-Powered Deep Well Submersible Pump",
        category: "Machinery",
        sold: 12,
        revenue: 12 * 84 * 850,
        rating: 5.0,
        percentage: 45
      },
      {
        name: "IoT Soil NPK Moisture Sensor Probe",
        category: "IoT Sensors",
        sold: 34,
        revenue: 34 * 84 * 120,
        rating: 4.8,
        percentage: 30
      }
    ];
  }, []);

  // Revenue Breakdown by Category (Seeds, Fertilizers, IoT Sensors, Machinery)
  const revenueBreakdownData = useMemo(() => {
    return [
      { name: "Seeds", value: 187520, color: "#10b981" }, // emerald-500
      { name: "Fertilizers", value: 130450, color: "#06b6d4" }, // cyan-500
      { name: "IoT Sensors", value: 86460, color: "#6366f1" }, // indigo-500
      { name: "Machinery", value: 242800, color: "#f59e0b" } // amber-500
    ];
  }, []);

  // OTP Handlers
  const handleSendEmailOtp = () => {
    setEmailOtpLoading(true);
    setVerificationFeedback("");
    setTimeout(() => {
      setEmailOtpLoading(false);
      setVerificationStatus((prev: any) => ({ ...prev, emailOtpSent: true }));
      setVerificationFeedback("📩 Simulated OTP code [4198] sent to " + (supplierData?.email || "your registered email") + ".");
    }, 800);
  };

  const handleVerifyEmailOtp = () => {
    setEmailVerifyLoading(true);
    setTimeout(() => {
      setEmailVerifyLoading(false);
      if (verificationStatus.emailOtpInput.trim() === verificationStatus.emailOtpCode) {
        setVerificationStatus((prev: any) => ({ ...prev, emailVerified: true }));
        setVerificationFeedback("✅ Email address verified successfully! Trust Score improved by +15.");
      } else {
        setVerificationFeedback("❌ Invalid verification code. Please enter '4198' to simulate verification.");
      }
    }, 800);
  };

  const handleSendMobileOtp = () => {
    setMobileOtpLoading(true);
    setVerificationFeedback("");
    setTimeout(() => {
      setMobileOtpLoading(false);
      setVerificationStatus((prev: any) => ({ ...prev, mobileOtpSent: true }));
      setVerificationFeedback("📱 Simulated SMS OTP code [9251] sent to +91 " + (supplierData?.mobile || "your phone") + ".");
    }, 800);
  };

  const handleVerifyMobileOtp = () => {
    setMobileVerifyLoading(true);
    setTimeout(() => {
      setMobileVerifyLoading(false);
      if (verificationStatus.mobileOtpInput.trim() === verificationStatus.mobileOtpCode) {
        setVerificationStatus((prev: any) => ({ ...prev, mobileVerified: true }));
        setVerificationFeedback("✅ Mobile phone verified successfully! Trust Score improved by +15.");
      } else {
        setVerificationFeedback("❌ Invalid SMS code. Please enter '9251' to simulate verification.");
      }
    }, 800);
  };

  // GST Portal sync
  const handleGstPortalSync = () => {
    setGstChecking(true);
    setVerificationFeedback("");
    setTimeout(() => {
      setGstChecking(false);
      setVerificationStatus((prev: any) => ({ ...prev, gstApiChecked: true }));
      setVerificationFeedback("🏛️ GST Portal Sync Successful! Validated active status for '" + (supplierData?.businessName || "AgriInput Global Ltd") + "'.");
    }, 1500);
  };

  // Penny drop
  const handleBankPennyDrop = () => {
    setBankChecking(true);
    setVerificationFeedback("");
    setTimeout(() => {
      setBankChecking(false);
      setVerificationStatus((prev: any) => ({ ...prev, bankPennyDropped: true, bankVerified: true }));
      setVerificationFeedback("💳 Bank Account penny-drop verified! Recipient name matches GST register business name. Settlement account activated.");
    }, 1500);
  };

  // Credit check
  const handleCreditCheck = () => {
    setCreditChecking(true);
    setVerificationFeedback("");
    setTimeout(() => {
      setCreditChecking(false);
      setVerificationStatus((prev: any) => ({ ...prev, creditScoreChecked: true, creditScore: 785 }));
      setVerificationFeedback("📈 Experian Credit Bureau lookup succeeded! Score: 785 (Excellent). Enterprise qualified for $100k trading limit.");
    }, 1500);
  };

  // Doc upload
  const handleGovDocUploadSimulate = () => {
    if (govFileUploading) return;
    setGovFileUploading(true);
    setGovUploadProgress(10);
    
    const interval = setInterval(() => {
      setGovUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 30;
      });
    }, 150);

    setTimeout(() => {
      setGovFileUploading(false);
      setVerificationStatus((prev: any) => {
        const currentUploaded = prev.govDocsUploaded || [];
        if (!currentUploaded.includes(govDocType)) {
          return {
            ...prev,
            govDocsUploaded: [...currentUploaded, govDocType]
          };
        }
        return prev;
      });
      setVerificationFeedback(`📜 ${govDocType} uploaded and validated with National Agricultural Registry!`);
    }, 1000);
  };

  const [securityDialogOpen, setSecurityDialogOpen] = useState(false);
  const [dashboardSessions, setDashboardSessions] = useState<any[]>(() => {
    const stored = localStorage.getItem("agriconnect_supplier_sessions");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }
    return [
      {
        id: "sess-1",
        device: "Corporate Desktop PC",
        browser: "Chrome v126.0 (Windows)",
        location: "Mumbai, Maharashtra, India",
        ipAddress: "103.45.2.19",
        lastActive: "Active now",
        isCurrent: true
      },
      {
        id: "sess-2",
        device: "AgriConnect Companion Mobile",
        browser: "Android Native Shell",
        location: "Krishna, Maharashtra, India",
        ipAddress: "110.22.45.1",
        lastActive: "2 hours ago",
        isCurrent: false
      },
      {
        id: "sess-3",
        device: "Field Tablet Pro",
        browser: "Safari (iPadOS)",
        location: "New Delhi, Delhi, India",
        ipAddress: "202.89.120.55",
        lastActive: "2 days ago",
        isCurrent: false
      }
    ];
  });

  React.useEffect(() => {
    localStorage.setItem("agriconnect_supplier_sessions", JSON.stringify(dashboardSessions));
  }, [dashboardSessions]);

  const handleRevokeDashboardSession = (sessionId: string) => {
    setDashboardSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const handleRevokeAllDashboardSessions = () => {
    setDashboardSessions((prev) => prev.filter((s) => s.isCurrent));
  };

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [tempStock, setTempStock] = useState<number>(0);

  // States for Supply Price Comparison section
  const [comparisonCategory, setComparisonCategory] = useState<"All" | "Seeds" | "Fertilizers">("All");
  const [selectedCalcProduct, setSelectedCalcProduct] = useState<string>("comp-1");
  const [calcQuantity, setCalcQuantity] = useState<number>(50);
  const [preOrderSuccess, setPreOrderSuccess] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // States for Machinery ROI Calculator
  const [selectedMachineId, setSelectedMachineId] = useState<string>("iot-soil");
  const [farmSize, setFarmSize] = useState<number>(45);
  const [cropYield, setCropYield] = useState<number>(3.5);
  const [cropPrice, setCropPrice] = useState<number>(320);
  const [annualInputCost, setAnnualInputCost] = useState<number>(400);

  const categories = ["All", "Seeds", "Fertilizers", "IoT Sensors", "Machinery"];

  // Advanced Filtering, Searching, and Sorting logic (Section 3.2)
  const filteredItems = useMemo(() => {
    let result = [...localItems];

    // 1. Search Query (Name, SKU, keyword)
    if (productSearchQuery.trim()) {
      const query = productSearchQuery.toLowerCase().trim();
      result = result.filter((item) => {
        const nameMatch = item.name.toLowerCase().includes(query);
        const skuMatch = (item.sku || "").toLowerCase().includes(query);
        const idMatch = item.id.toLowerCase().includes(query);
        const catMatch = item.category.toLowerCase().includes(query);
        const descMatch = (item.description || "").toLowerCase().includes(query);
        const subCatMatch = (item.subCategory || "").toLowerCase().includes(query);
        return nameMatch || skuMatch || idMatch || catMatch || descMatch || subCatMatch;
      });
    }

    // 2. Category Filter (synchronized with selectedCategory)
    if (selectedCategory !== "All") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // 3. Status Filter (Active / Draft / Archived)
    if (filterStatus !== "All") {
      result = result.filter((item) => {
        const s = item.publishStatus || "Active";
        return s.toLowerCase() === filterStatus.toLowerCase();
      });
    }

    // 4. Stock Filter (All, In Stock, Low Stock, Out of Stock)
    if (filterStock !== "All") {
      result = result.filter((item) => {
        const threshold = item.lowStockThreshold || 15;
        if (filterStock === "In Stock") {
          return item.stock > threshold;
        } else if (filterStock === "Low Stock") {
          return item.stock <= threshold && item.stock > 0;
        } else if (filterStock === "Out of Stock") {
          return item.stock === 0;
        }
        return true;
      });
    }

    // 5. Date Added Filter (All, Last 7 Days, Last 30 Days, This Year)
    if (filterDateAdded !== "All") {
      const today = new Date("2026-07-08");
      result = result.filter((item) => {
        if (!item.dateAdded) return true;
        const itemDate = new Date(item.dateAdded);
        const diffTime = today.getTime() - itemDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (filterDateAdded === "7") {
          return diffDays <= 7 && diffDays >= 0;
        } else if (filterDateAdded === "30") {
          return diffDays <= 30 && diffDays >= 0;
        } else if (filterDateAdded === "365") {
          return itemDate.getFullYear() === 2026;
        }
        return true;
      });
    }

    // 6. Sort mapping
    result.sort((a, b) => {
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name);
      } else if (sortBy === "price-asc") {
        return a.price - b.price;
      } else if (sortBy === "price-desc") {
        return b.price - a.price;
      } else if (sortBy === "stock-asc") {
        return a.stock - b.stock;
      } else if (sortBy === "stock-desc") {
        return b.stock - a.stock;
      } else if (sortBy === "date-desc") {
        const dateA = a.dateAdded ? new Date(a.dateAdded).getTime() : 0;
        const dateB = b.dateAdded ? new Date(b.dateAdded).getTime() : 0;
        return dateB - dateA;
      } else if (sortBy === "date-asc") {
        const dateA = a.dateAdded ? new Date(a.dateAdded).getTime() : 0;
        const dateB = b.dateAdded ? new Date(b.dateAdded).getTime() : 0;
        return dateA - dateB;
      }
      return 0;
    });

    return result;
  }, [localItems, productSearchQuery, selectedCategory, filterStatus, filterStock, filterDateAdded, sortBy]);

  // Product actions
  const handleDuplicateProduct = (item: any) => {
    const newId = `sup-${Date.now().toString().slice(-4)}`;
    const finalSku = `SKU-${item.category.toUpperCase().slice(0, 3)}-${item.subCategory?.toUpperCase().slice(0, 3) || "GEN"}-${newId}`;
    const duplicated = {
      ...item,
      id: newId,
      name: `${item.name} (Copy)`,
      sku: finalSku,
      dateAdded: "2026-07-08", // today's date
    };
    setLocalItems((prev) => [duplicated, ...prev]);
    setVerificationFeedback(`📋 Duplicated product successfully! New SKU: ${finalSku}`);
    addAuditEntry(
      "Product Catalog Entry Duplicated",
      `Duplicated product SKU: ${item.sku} to create a new SKU: ${finalSku} named '${item.name} (Copy)'.`,
      "product"
    );
  };

  const handleToggleArchiveProduct = (id: string) => {
    const target = localItems.find((item) => item.id === id);
    const updated = localItems.map((item) => {
      if (item.id === id) {
        const nextStatus = item.publishStatus === "Archived" ? "Active" : "Archived";
        return { ...item, publishStatus: nextStatus };
      }
      return item;
    });
    setLocalItems(updated);
    setVerificationFeedback(`📦 Product status updated successfully!`);
    if (target) {
      const isArchiving = target.publishStatus !== "Archived";
      addAuditEntry(
        isArchiving ? "Product Archived" : "Product Restored",
        `Product '${target.name}' (SKU: ${target.sku || "N/A"}) status set to ${isArchiving ? "Archived" : "Active"}.`,
        "product"
      );
    }
  };

  const handleDeleteProduct = (id: string) => {
    const target = localItems.find((item) => item.id === id);
    const updated = localItems.filter((item) => item.id !== id);
    setLocalItems(updated);
    setVerificationFeedback(`🗑️ Product deleted successfully!`);
    setDeleteConfirmId(null);
    if (target) {
      addAuditEntry(
        "Product Deleted from Catalog",
        `Permanently removed product '${target.name}' (SKU: ${target.sku || "N/A"}) from the catalog.`,
        "product"
      );
    }
  };

  const handleOpenEditProduct = (product: any) => {
    setEditingProduct(product);
    setNewProdName(product.name || "");
    setNewProdCategory(product.category || "Seeds");
    setNewProdSubCategory(product.subCategory || "Wheat");
    setNewProdSku(product.sku || "");
    setNewProdDescription(product.description || "");
    setNewProdUnit(product.unit || "kg");
    setNewProdPrice(product.price || 0);
    setNewProdCostPrice(product.costPrice || 0);
    setNewProdMrp(product.mrp || 0);
    setNewProdMoq(product.moq || 1);
    setNewProdBulkPricing(product.bulkPricing || []);
    setNewProdStock(product.stock || 0);
    setNewProdLowStockThreshold(product.lowStockThreshold || 15);
    setNewProdReorderPoint(product.reorderPoint || 10);
    setNewProdImages(product.images || []);
    setNewProdVideo(product.video || "");
    setNewProdGovApproved(product.certifications?.govApproved || false);
    setNewProdOrganicCertified(product.certifications?.organicCertified || false);
    setNewProdIsoCertified(product.certifications?.isoCertified || false);
    setNewProdFssaiLicense(product.certifications?.fssaiLicense || "");
    setNewProdWeight(product.shipping?.weight || 1);
    setNewProdDimLength(product.shipping?.dimensions?.length || 15);
    setNewProdDimWidth(product.shipping?.dimensions?.width || 10);
    setNewProdDimHeight(product.shipping?.dimensions?.height || 12);
    setNewProdShippingCost(product.shipping?.cost || 0);
    setNewProdShippingCostType(product.shipping?.costType || "flat");
    setNewProdShippingZones(product.shipping?.zones || ["India"]);
    setNewProdPublishStatus(product.publishStatus || "Active");
    
    setAddProductActiveTab("general");
    setIsAddProductOpen(true);
  };

  const handleResetForm = () => {
    setEditingProduct(null);
    setNewProdName("");
    setNewProdCategory("Seeds");
    setNewProdSubCategory("Wheat");
    setNewProdSku("");
    setNewProdDescription("");
    setNewProdUnit("kg");
    setNewProdPrice(30);
    setNewProdCostPrice(20);
    setNewProdMrp(45);
    setNewProdMoq(10);
    setNewProdBulkPricing([
      { minQty: 10, discount: 5 },
      { minQty: 50, discount: 10 }
    ]);
    setNewProdStock(100);
    setNewProdLowStockThreshold(15);
    setNewProdReorderPoint(10);
    setNewProdImages([
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599933333931-e4065a7fb487?w=400&auto=format&fit=crop"
    ]);
    setNewProdVideo("");
    setNewProdGovApproved(false);
    setNewProdOrganicCertified(false);
    setNewProdIsoCertified(false);
    setNewProdFssaiLicense("");
    setNewProdWeight(1);
    setNewProdDimLength(15);
    setNewProdDimWidth(10);
    setNewProdDimHeight(12);
    setNewProdShippingCost(120);
    setNewProdShippingCostType("flat");
    setNewProdShippingZones(["India"]);
    setNewProdPublishStatus("Active");
    setAddProductActiveTab("general");
  };

  const startEdit = (item: SupplierItem) => {
    setEditingId(item.id);
    setTempPrice(item.price);
    setTempStock(item.stock);
  };

  const saveEdit = (id: string) => {
    const target = localItems.find(item => item.id === id);
    const updatedItems = localItems.map(item => item.id === id ? { ...item, price: tempPrice, stock: tempStock } : item);
    setLocalItems(updatedItems);
    onUpdateItem(id, { price: tempPrice, stock: tempStock });
    setEditingId(null);
    if (target) {
      const priceChanged = target.price !== tempPrice;
      const stockChanged = target.stock !== tempStock;
      if (priceChanged && stockChanged) {
        addAuditEntry("Product Details Quick Edited", `Updated '${target.name}' (SKU: ${target.sku || "N/A"}) pricing to ${tempPrice} INR and stock level to ${tempStock}.`, "product");
        addAuditEntry("Inventory Stock Reconciled", `Quick adjusted inventory stock level for '${target.name}' from ${target.stock} to ${tempStock}.`, "inventory");
      } else if (priceChanged) {
        addAuditEntry("Product Price Quick Edited", `Updated pricing for '${target.name}' from ${target.price} INR to ${tempPrice} INR.`, "product");
      } else if (stockChanged) {
        addAuditEntry("Inventory Stock Reconciled", `Quick adjusted inventory stock level for '${target.name}' from ${target.stock} to ${tempStock}.`, "inventory");
      }
    }
  };

  // Dynamically resolve 'your storefront' price from current items state or fallback default
  const getProductPrice = (item: typeof COMPARISON_PRODUCTS[0]) => {
    const storeItem = localItems.find((i) => i.id === item.linkedSkuId);
    return storeItem ? storeItem.price : item.defaultStorePrice;
  };

  const filteredComparisonProducts = useMemo(() => {
    return COMPARISON_PRODUCTS.filter((prod) => {
      const matchCategory = comparisonCategory === "All" || prod.category === comparisonCategory;
      const matchSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [comparisonCategory, searchQuery]);

  const calcProductDetails = useMemo(() => {
    return COMPARISON_PRODUCTS.find((p) => p.id === selectedCalcProduct) || COMPARISON_PRODUCTS[0];
  }, [selectedCalcProduct]);

  const calculatedCosts = useMemo(() => {
    const yourPrice = getProductPrice(calcProductDetails);
    return {
      yourStore: yourPrice * calcQuantity,
      average: calcProductDetails.averageMarketRate * calcQuantity,
      greenfield: calcProductDetails.greenfield * calcQuantity,
      bharatAgro: calcProductDetails.bharatAgro * calcQuantity,
      kisanCoop: calcProductDetails.kisanCoop * calcQuantity,
    };
  }, [calcProductDetails, calcQuantity, localItems]);

  const cheapestSource = useMemo(() => {
    const costs = [
      { name: "Your Storefront", value: calculatedCosts.yourStore },
      { name: "Regional Mandi (Avg)", value: calculatedCosts.average },
      { name: "Greenfield Inputs", value: calculatedCosts.greenfield },
      { name: "Bharat Agro Depot", value: calculatedCosts.bharatAgro },
      { name: "Kisan Sahayak Co-op", value: calculatedCosts.kisanCoop }
    ];
    costs.sort((a, b) => a.value - b.value);
    return costs[0];
  }, [calculatedCosts]);

  // Computation for Machinery & IoT Sensor ROI
  const roiCalculations = useMemo(() => {
    const machine = MACHINERY_OPTIONS.find((m) => m.id === selectedMachineId) || MACHINERY_OPTIONS[0];
    
    // Upfront Cost = base cost + per acre cost
    const upfrontCost = machine.costBase + (machine.costPerAcre * farmSize);
    
    // Annual Crop Revenue Boost = normal revenue * yield boost pct
    const normalRevenue = farmSize * cropYield * cropPrice;
    const annualRevenueBoost = normalRevenue * (machine.yieldBoostPct / 100);
    
    // Annual Input resource savings = (farmSize * annualInputCost) * waterSavingPct
    const annualResourceSavings = (farmSize * annualInputCost) * (machine.waterSavingPct / 100);
    
    // Annual labor savings
    const annualLaborSavings = machine.laborSavingAnnual;
    
    // Total annual monetary benefit
    const totalAnnualBenefit = annualRevenueBoost + annualResourceSavings + annualLaborSavings;
    
    // Payback period (Years)
    const paybackPeriod = totalAnnualBenefit > 0 ? parseFloat((upfrontCost / totalAnnualBenefit).toFixed(1)) : 0;
    
    // 5-Year Return on Investment
    const net5YearGain = (totalAnnualBenefit * 5) - upfrontCost;
    const roiPct = upfrontCost > 0 ? parseFloat(((net5YearGain / upfrontCost) * 100).toFixed(0)) : 0;

    // Generate Chart Data: Cumulative Cash Flow over 5 years
    const chartData = Array.from({ length: 6 }, (_, year) => {
      const netBenefit = year === 0 ? -upfrontCost : Math.round((totalAnnualBenefit * year) - upfrontCost);
      return {
        year: `Year ${year}`,
        "Net Return": netBenefit,
        "Break Even": 0
      };
    });

    return {
      machine,
      upfrontCost,
      annualRevenueBoost,
      annualResourceSavings,
      annualLaborSavings,
      totalAnnualBenefit,
      paybackPeriod,
      net5YearGain,
      roiPct,
      chartData
    };
  }, [selectedMachineId, farmSize, cropYield, cropPrice, annualInputCost]);

  if (!isAuthenticated) {
    return (
      <SupplierAuthOnboarding
        onComplete={(data) => {
          setIsAuthenticated(true);
          setSupplierData(data);
        }}
      />
    );
  }

  const handleSignOut = () => {
    localStorage.removeItem("agriconnect_supplier_auth");
    localStorage.removeItem("agriconnect_supplier_data");
    setIsAuthenticated(false);
    setSupplierData(null);
  };

  return (
    <div id="supplier-workspace" className="space-y-6">
      {/* Supplier Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-indigo-900 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-1 bg-white rounded-xl w-11 h-11 flex items-center justify-center overflow-hidden shrink-0 shadow-xs border border-teal-500/10">
              {supplierData?.logoUrl ? (
                <img src={supplierData.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
              ) : (
                <Building className="h-6 w-6 text-teal-700" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight uppercase">
                  {supplierData?.businessName || "AgriInput Global Ltd"}
                </h2>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <ShieldCheck className="h-3 w-3" /> GSTIN Verified
                  </span>
                  {hasVerifiedBadge ? (
                    <span className="bg-emerald-600 text-white border border-emerald-500 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm shadow-emerald-500/20">
                      <Award className="h-3 w-3" /> Verified Partner
                    </span>
                  ) : (
                    <span className="bg-slate-500/20 text-slate-300 border border-slate-500/30 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <Shield className="h-3 w-3" /> Unverified Partner
                    </span>
                  )}
                  {(hasGovApprovedBadge || approvedCertificates.includes("gov-approved")) && (
                    <span className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white border border-amber-400 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm shadow-amber-500/20">
                      <Star className="h-3 w-3 fill-current text-amber-200" /> Govt Approved
                    </span>
                  )}
                  {approvedCertificates.includes("organic-certified") && (
                    <span className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border border-emerald-400 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm shadow-emerald-500/20">
                      <Award className="h-3 w-3 text-emerald-100" /> Organic Certified
                    </span>
                  )}
                  {approvedCertificates.includes("iso-9001") && (
                    <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border border-blue-400 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm shadow-indigo-500/20">
                      <Award className="h-3 w-3 text-blue-100" /> ISO 9001 QMS
                    </span>
                  )}
                  {approvedCertificates.includes("fssai-license") && (
                    <span className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white border border-cyan-400 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm shadow-cyan-500/20">
                      <Award className="h-3 w-3 text-cyan-100" /> FSSAI Food-Safe
                    </span>
                  )}
                  {approvedCertificates.includes("export-quality") && (
                    <span className="bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white border border-purple-400 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm shadow-purple-500/20">
                      <Award className="h-3 w-3 text-purple-100" /> Export Quality
                    </span>
                  )}
                  <span className="bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full font-mono">
                    Trust Rating: {trustScore}%
                  </span>
                </div>
              </div>
              <p className="text-[10px] font-mono text-teal-200 font-semibold tracking-wide">
                GSTIN: {supplierData?.gstNumber || "27AAAAA1111A1Z1"} | Contact: {supplierData?.mobile || "9876543210"}
              </p>
            </div>
          </div>
          <p className="text-teal-100/80 text-xs max-w-xl">
            Distribute state-certified hybrid seeds, bio-fertilizers, solar-powered drip kits, and advanced IoT telemetry soil probes to cooperatives worldwide. Monitor warehouse levels and update market prices.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/10 text-center min-w-[90px]">
            <p className="text-[9px] text-teal-200 uppercase tracking-widest font-extrabold">Store Items</p>
            <p className="text-base font-black">{localItems.length} SKUs</p>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/10 text-center min-w-[90px]">
            <p className="text-[9px] text-teal-200 uppercase tracking-widest font-extrabold">Critical Stock</p>
            <p className="text-base font-black">{localItems.filter((item) => item.stock < 15).length} Items</p>
          </div>
          <button
            onClick={() => setSecurityDialogOpen(true)}
            className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 hover:text-white border border-emerald-500/20 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer h-10"
          >
            <ShieldCheck className="h-4 w-4" /> Device Security ({dashboardSessions.length})
          </button>
          <button
            onClick={handleSignOut}
            className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 hover:text-white border border-rose-500/20 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer h-10"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* 2.1 Dashboard Overview - Landing Page Cockpit */}
      <div id="supplier-dashboard-overview" className="space-y-6">
        {/* Welcome Hero Grid */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-teal-50 to-indigo-50/40 rounded-full blur-3xl -z-10" />

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-center">
            {/* Left Welcome message */}
            <div className="xl:col-span-7 space-y-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase text-teal-600 tracking-widest bg-teal-50 border border-teal-100/50 px-3 py-1 rounded-full inline-block">
                  Supplier Operations Center
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-tight">
                  Welcome back, <span className="text-teal-700">{supplierData?.ownerName || "Rajesh Kumar"}</span>!
                </h2>
                <p className="text-slate-500 text-xs md:text-sm font-semibold max-w-xl leading-relaxed">
                  You are managing <strong className="text-slate-700">{supplierData?.businessName || "AgriInput Global Ltd"}</strong>. Your inventory is active, and you have secure verification badges unlocked.
                </p>
              </div>

              {/* Multi-pill stats summary requested for the Hero section */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-100/50">
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Active Products</span>
                  <span className="text-lg font-black text-slate-800 font-mono">{localItems.length} SKUs</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Pending Orders</span>
                  <span className="text-lg font-black text-slate-800 font-mono text-amber-600">
                    {orders.filter((o: any) => o.status === "Pending").length}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Total Revenue</span>
                  <span className="text-lg font-black text-slate-800 font-mono text-emerald-600">
                    ₹{totalRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Total Sales</span>
                  <span className="text-lg font-black text-slate-800 font-mono text-indigo-600">
                    {totalSalesUnits} units
                  </span>
                </div>
              </div>
            </div>

            {/* Right Trust Score display with Color Indicator (Green/Orange/Red) requested */}
            <div className="xl:col-span-5 flex flex-col items-center justify-center bg-slate-50/50 p-6 rounded-2xl border border-slate-100 text-center space-y-4">
              <div className="relative flex items-center justify-center">
                {/* Visual dial representation */}
                <div className="w-24 h-24 rounded-full border-4 border-slate-200 flex items-center justify-center">
                  <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center text-white shadow-md ${trustColorBg}`}>
                    <span className="text-2xl font-black font-mono leading-none">{trustScore}</span>
                    <span className="text-[8px] font-black uppercase tracking-widest mt-0.5">TRUST</span>
                  </div>
                </div>
                {/* Overlay dot indicating score level */}
                <span className={`absolute top-1.5 right-1.5 w-4.5 h-4.5 rounded-full border-2 border-white shadow-sm ${trustColorBg} animate-ping`} />
                <span className={`absolute top-1.5 right-1.5 w-4.5 h-4.5 rounded-full border-2 border-white shadow-sm ${trustColorBg}`} />
              </div>

              <div className="space-y-1 max-w-[260px]">
                <div className="flex items-center justify-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${trustColorBg}`} />
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    {trustScore >= 70 ? "HIGH TRUST PARTNER" : trustScore >= 50 ? "MEDIUM TRUST STATUS" : "ACTION REQUIRED"}
                  </h4>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                  Your digital trust status is checked live against national registries. Unverified accounts have restricted trade capacities.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Stats Card 1: Total Products Listed */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs flex items-center gap-4 transition-transform hover:-translate-y-0.5 duration-200">
            <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Products</span>
              <span className="text-lg font-black text-slate-800 font-mono">{localItems.length} listed</span>
            </div>
          </div>

          {/* Stats Card 2: Active Orders */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs flex items-center gap-4 transition-transform hover:-translate-y-0.5 duration-200">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Orders</span>
              <span className="text-lg font-black text-slate-800 font-mono">
                {orders.filter((o: any) => o.status === "Pending" || o.status === "Active").length} items
              </span>
            </div>
          </div>

          {/* Stats Card 3: Revenue (this month) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs flex items-center gap-4 transition-transform hover:-translate-y-0.5 duration-200">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <span className="text-lg font-black text-emerald-700 font-mono">₹</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Monthly Revenue</span>
              <span className="text-lg font-black text-slate-800 font-mono text-emerald-600">₹{totalRevenue.toLocaleString()}</span>
            </div>
          </div>

          {/* Stats Card 4: Average Rating */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs flex items-center gap-4 transition-transform hover:-translate-y-0.5 duration-200">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Star className="h-5 w-5 fill-current text-indigo-500" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Rating</span>
              <span className="text-lg font-black text-slate-800 font-mono">★ {averageRating}</span>
            </div>
          </div>

          {/* Stats Card 5: Stock Alerts */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs flex items-center gap-4 transition-transform hover:-translate-y-0.5 duration-200">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Stock Alerts</span>
              <span className={`text-lg font-mono font-black ${lowStockCount > 0 ? "text-rose-600" : "text-slate-500"}`}>
                {lowStockCount} items low
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons Panel */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs flex flex-wrap gap-3 items-center justify-between">
          <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider pl-2">
            🚀 Quick Operations Panel
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                handleResetForm();
                setIsAddProductOpen(true);
              }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs shadow-emerald-500/20"
            >
              <Package className="h-4 w-4" /> Add New Product
            </button>
            <button
              onClick={() => setIsBulkUploadOpen(!isBulkUploadOpen)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs shadow-indigo-500/20"
            >
              <Upload className="h-4 w-4" /> Bulk SKU Upload
            </button>
            <button
              onClick={() => setIsOrdersOpen(true)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <ShoppingBag className="h-4 w-4" /> View Orders
              {orders.filter((o: any) => o.status === "Pending").length > 0 && (
                <span className="bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {orders.filter((o: any) => o.status === "Pending").length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsCustomersOpen(true)}
              className="px-4 py-2.5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <Users className="h-4 w-4" /> View Customers
            </button>
            <button
              onClick={() => setIsReportsOpen(true)}
              className="px-4 py-2.5 bg-indigo-800 hover:bg-indigo-900 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <FileText className="h-4 w-4" /> Custom Reports
            </button>
            <button
              onClick={() => setIsCertificationsOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs border border-amber-500/20"
            >
              <Award className="h-4 w-4 text-amber-100 fill-current" /> Certifications Hub
            </button>
            <button
              onClick={() => setIsDemandPredictorOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs border border-indigo-500/20"
            >
              <TrendingUp className="h-4 w-4 text-indigo-100" /> AI Demand Predictor
            </button>
            <button
              onClick={() => setIsPricingOptimizerOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs border border-violet-500/20"
            >
              <DollarSign className="h-4 w-4 text-violet-100" /> AI Pricing Optimizer
            </button>
            <button
              onClick={() => setIsProductGeneratorOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs border border-emerald-500/20"
            >
              <FileText className="h-4 w-4 text-emerald-100" /> AI Product Copywriter
            </button>
            <button
              onClick={() => setIsChatAssistantOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs border border-teal-500/20"
            >
              <MessageSquare className="h-4 w-4 text-teal-100" /> AI Chat Assistant
            </button>
            <button
              onClick={() => setIsProfileSettingsOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs border border-slate-600/20"
            >
              <Settings className="h-4 w-4 text-slate-100" /> Profile & Settings
            </button>
            <button
              onClick={() => handleScrollToSection("sku-inventory-section")}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2"
            >
              <Sliders className="h-4 w-4" /> Manage Inventory
            </button>
            <button
              onClick={() => handleScrollToSection("supplier-performance-widget")}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2"
            >
              <BarChart className="h-4 w-4" /> View Analytics
            </button>
            <button
              onClick={() => handleScrollToSection("supplier-verification-hub")}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2"
            >
              <Award className="h-4 w-4" /> Apply for Certification
            </button>
          </div>
        </div>
      </div>

      {/* Tab Switcher for Inventory Catalog vs Real-time Tracking */}
      <div className="flex items-center gap-1 border-b border-slate-150 pb-1 mb-4">
        <button
          onClick={() => setInventoryActiveTab("catalog")}
          className={`px-5 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            inventoryActiveTab === "catalog"
              ? "border-emerald-600 text-emerald-700 font-extrabold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sliders className="h-4 w-4" /> SKU Catalog & Bulk Imports
        </button>
        <button
          onClick={() => setInventoryActiveTab("stock-tracking")}
          className={`px-5 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 relative ${
            inventoryActiveTab === "stock-tracking"
              ? "border-emerald-600 text-emerald-700 font-extrabold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Package className="h-4 w-4" /> Real-Time Stock Tracking & Alerts
          {localItems.filter(item => item.stock <= (item.lowStockThreshold || 15)).length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          )}
        </button>
      </div>

      {/* Main Grid: Inventory Management */}
      {inventoryActiveTab === "catalog" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Filter and Supply Stats */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-6">
          <div>
            <h3 className="font-semibold text-slate-800 text-sm border-b border-slate-100 pb-2.5 mb-3">
              Input Categories
            </h3>
            <div className="space-y-1.5">
              {categories.map((cat) => (
                <button
                   key={cat}
                   onClick={() => setSelectedCategory(cat)}
                   className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                     selectedCategory === cat
                       ? "bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600"
                       : "text-slate-600 hover:bg-slate-50"
                   }`}
                >
                  <span>{cat}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-full">
                    {cat === "All" ? localItems.length : localItems.filter((i) => i.category === cat).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
            <h4 className="text-[11px] font-bold text-amber-800 flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4" /> Stock Warnings
            </h4>
            <p className="text-[10px] text-amber-700 mt-1 leading-relaxed">
              Verify your inventory levels. High demand is expected for certified drought-resilient millets and nitrogen-release organic compost next week.
            </p>
          </div>
        </div>

        {/* Product SKU Table / Grid (Section 3.2 List View, Filters, Sort, Search, Actions) */}
        <div id="sku-inventory-section" className="lg:col-span-9 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
            <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <Sliders className="h-4.5 w-4.5 text-emerald-600" />
              SKU Inventory Controls & Catalog
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">
              Regional Currency: INR (₹)
            </span>
          </div>

          {/* BULK SKU UPLOAD WORKSPACE */}
          {isBulkUploadOpen && (
            <div className="bg-slate-50 border border-slate-200/85 rounded-2xl p-5 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                <div className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-indigo-600" />
                  <div>
                    <h4 className="font-extrabold text-slate-850 text-sm">
                      Bulk SKU Upload Hub
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Import inventory entries instantly via CSV mapping and validation.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsBulkUploadOpen(false)}
                  className="p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer border-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Step 1: File Drag-n-Drop & Template Download */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-black tracking-widest text-indigo-600 block mb-1">
                      Step 1: Download Template
                    </span>
                    <h5 className="font-black text-slate-800 text-xs">
                      AgriConnect Format Template
                    </h5>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      Download our pre-structured template containing compatible column headers to ensure correct field pairing and validation.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadTemplate}
                    className="mt-4 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-800 text-xs font-black rounded-lg cursor-pointer flex items-center justify-center gap-1.5 transition-colors border-0"
                  >
                    <Download className="h-4 w-4" /> Download CSV Template
                  </button>
                </div>

                <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center relative group hover:border-indigo-400 transition-colors">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCsvUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full mb-2 group-hover:scale-105 transition-transform">
                    <Upload className="h-5 w-5" />
                  </div>
                  <h5 className="font-black text-slate-800 text-xs">
                    {uploadedFileName ? `Selected: ${uploadedFileName}` : "Upload CSV File"}
                  </h5>
                  <p className="text-[9px] text-slate-400 mt-1 max-w-[200px]">
                    Drag & drop your CSV file here or click to browse. Max size 5MB.
                  </p>
                </div>
              </div>

              {/* Step 2: Mapping columns */}
              {csvHeaders.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3.5">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <span className="text-[9px] uppercase font-black tracking-widest text-teal-600 block mb-1">
                        Step 2: Map Columns
                      </span>
                      <h5 className="font-black text-slate-800 text-xs">
                        Align CSV Headers with Marketplace Fields
                      </h5>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400">
                      Auto-matched {Object.values(columnMapping).filter(Boolean).length} of 6
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.keys(columnMapping).map((systemField) => (
                      <div key={systemField} className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <label className="block text-[9.5px] uppercase font-black text-slate-500">
                          {systemField === "sku" ? "SKU / Code" : systemField} <span className="text-rose-500">{["name", "price", "stock"].includes(systemField) ? "*" : ""}</span>
                        </label>
                        <select
                          value={columnMapping[systemField]}
                          onChange={(e) => setColumnMapping(prev => ({ ...prev, [systemField]: e.target.value }))}
                          className="w-full bg-white border border-slate-200 text-slate-700 text-[10px] rounded px-1.5 py-1 font-bold cursor-pointer focus:outline-none"
                        >
                          <option value="">-- Ignore / Skip --</option>
                          {csvHeaders.map(h => (
                            <option key={h} value={h}>{h}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3 & 4: Validation Summary & Import action */}
              {csvRawData.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2.5 gap-2">
                    <div>
                      <span className="text-[9px] uppercase font-black tracking-widest text-emerald-600 block mb-1">
                        Step 3: Preview & Validation
                      </span>
                      <h5 className="font-black text-slate-800 text-xs">
                        Integrity Checks Summary
                      </h5>
                    </div>
                    <div className="flex items-center gap-2 text-[10.5px]">
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 font-extrabold px-2 py-0.5 rounded-md">
                        {mappedAndValidatedProducts.products.length - mappedAndValidatedProducts.errors.length} Valid Rows
                      </span>
                      {mappedAndValidatedProducts.errors.length > 0 && (
                        <span className="bg-rose-50 text-rose-800 border border-rose-100 font-extrabold px-2 py-0.5 rounded-md">
                          {mappedAndValidatedProducts.errors.length} Validation Errors
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Errors display */}
                  {mappedAndValidatedProducts.errors.length > 0 && (
                    <div className="p-3 bg-rose-50/70 border border-rose-100 text-rose-900 rounded-lg space-y-1 text-[10px] max-h-32 overflow-y-auto">
                      <span className="font-extrabold uppercase tracking-widest text-[8px] text-rose-600 block mb-1">
                        Found {mappedAndValidatedProducts.errors.length} Integrity Violations:
                      </span>
                      {mappedAndValidatedProducts.errors.map((err, i) => (
                        <p key={i} className="font-medium">⚠️ {err}</p>
                      ))}
                    </div>
                  )}

                  {/* Preview list of rows */}
                  <div className="border border-slate-100 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                    <table className="w-full text-left text-[10px] border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b text-slate-500 font-black uppercase text-[8px]">
                          <th className="p-2">Line</th>
                          <th className="p-2">Name</th>
                          <th className="p-2">Category</th>
                          <th className="p-2">Price (₹)</th>
                          <th className="p-2">Stock</th>
                          <th className="p-2">SKU</th>
                          <th className="p-2 text-right">Integrity</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-bold text-slate-700">
                        {mappedAndValidatedProducts.products.map((p, idx) => {
                          const hasName = !!p.name;
                          const isPriceValid = p.price > 0;
                          const isStockValid = p.stock >= 0;
                          const isValid = hasName && isPriceValid && isStockValid;

                          return (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="p-2 font-mono text-slate-400">#{idx + 2}</td>
                              <td className="p-2 truncate max-w-[150px]">{p.name || <span className="text-rose-500 italic">Empty</span>}</td>
                              <td className="p-2 text-slate-500">{p.category}</td>
                              <td className="p-2 font-mono">₹{p.price}</td>
                              <td className="p-2 font-mono">{p.stock}</td>
                              <td className="p-2 font-mono text-slate-500 truncate max-w-[80px]">{p.sku}</td>
                              <td className="p-2 text-right">
                                <span className={`px-1.5 py-0.5 rounded text-[8.5px] uppercase font-black ${
                                  isValid ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                                }`}>
                                  {isValid ? "Passed" : "Failed"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2.5 pt-2 border-t">
                    <button
                      onClick={() => {
                        setUploadedFileName("");
                        setCsvRawData([]);
                        setCsvHeaders([]);
                        setImportErrors([]);
                      }}
                      className="px-3 py-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-700 text-xs font-black rounded-lg cursor-pointer border-0"
                    >
                      Clear Data
                    </button>
                    <button
                      onClick={handleImportValidatedProducts}
                      disabled={mappedAndValidatedProducts.products.length === 0 || mappedAndValidatedProducts.products.length === mappedAndValidatedProducts.errors.length}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-black rounded-lg cursor-pointer flex items-center gap-1 shadow-sm transition-colors border-0"
                    >
                      <Check className="h-4 w-4" /> Import {mappedAndValidatedProducts.products.filter(p => p.name && p.price > 0 && p.stock >= 0).length} Valid SKUs
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* BULK EDIT WORKSPACE ACTION PANEL */}
          {selectedProductIds.length > 0 && (
            <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-600 text-white rounded-xl">
                  <CheckSquare className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-850 text-xs uppercase tracking-wider">
                    Bulk Edit Workspace
                  </h4>
                  <p className="text-[10px] text-emerald-800 font-bold">
                    {selectedProductIds.length} {selectedProductIds.length === 1 ? "product" : "products"} selected for batch operations
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3.5 w-full md:w-auto">
                {/* Price Edit Control */}
                <div className="bg-white p-2 border border-slate-200 rounded-xl flex items-center gap-1.5 text-[10px] shadow-3xs">
                  <span className="font-bold text-slate-500 uppercase tracking-wider">Price ₹:</span>
                  <select
                    value={bulkEditPriceType}
                    onChange={(e) => setBulkEditPriceType(e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-[10px] font-bold focus:outline-none"
                  >
                    <option value="flat">Flat Adj</option>
                    <option value="percentage">% Adj</option>
                  </select>
                  <input
                    type="number"
                    placeholder="e.g. +10 or -15"
                    value={bulkEditPriceVal}
                    onChange={(e) => setBulkEditPriceVal(e.target.value)}
                    className="w-16 bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-[10px] font-bold text-slate-850 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={() => {
                      const val = parseFloat(bulkEditPriceVal);
                      if (isNaN(val)) return;
                      setLocalItems(prev => prev.map(item => {
                        if (selectedProductIds.includes(item.id)) {
                          let newPrice = item.price;
                          if (bulkEditPriceType === "flat") {
                            newPrice = Math.max(1, item.price + val);
                          } else {
                            newPrice = Math.max(1, Math.round(item.price * (1 + val / 100)));
                          }
                          return { ...item, price: newPrice };
                        }
                        return item;
                      }));
                      setVerificationFeedback(`📈 Successfully updated pricing for ${selectedProductIds.length} selected products!`);
                      setBulkEditPriceVal("");
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded px-2.5 py-1 font-black cursor-pointer text-[9.5px] border-0"
                  >
                    Apply
                  </button>
                </div>

                {/* Stock Edit Control */}
                <div className="bg-white p-2 border border-slate-200 rounded-xl flex items-center gap-1.5 text-[10px] shadow-3xs">
                  <span className="font-bold text-slate-500 uppercase tracking-wider">Stock:</span>
                  <input
                    type="number"
                    placeholder="e.g. +50 or -20"
                    value={bulkEditStockVal}
                    onChange={(e) => setBulkEditStockVal(e.target.value)}
                    className="w-16 bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-[10px] font-bold text-slate-850 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={() => {
                      const val = parseInt(bulkEditStockVal);
                      if (isNaN(val)) return;
                      setLocalItems(prev => prev.map(item => {
                        if (selectedProductIds.includes(item.id)) {
                          return { ...item, stock: Math.max(0, item.stock + val) };
                        }
                        return item;
                      }));
                      setVerificationFeedback(`📦 Successfully updated inventory levels for ${selectedProductIds.length} products!`);
                      setBulkEditStockVal("");
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded px-2.5 py-1 font-black cursor-pointer text-[9.5px] border-0"
                  >
                    Apply
                  </button>
                </div>

                {/* Status Edit Control */}
                <div className="bg-white p-2 border border-slate-200 rounded-xl flex items-center gap-1.5 text-[10px] shadow-3xs">
                  <span className="font-bold text-slate-500 uppercase tracking-wider">Status:</span>
                  <select
                    value={bulkEditStatus}
                    onChange={(e) => setBulkEditStatus(e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-[10px] font-bold focus:outline-none"
                  >
                    <option value="">Select...</option>
                    <option value="Active">Activate</option>
                    <option value="Archived">Archive</option>
                  </select>
                  <button
                    onClick={() => {
                      if (!bulkEditStatus) return;
                      setLocalItems(prev => prev.map(item => {
                        if (selectedProductIds.includes(item.id)) {
                          return { ...item, publishStatus: bulkEditStatus };
                        }
                        return item;
                      }));
                      setVerificationFeedback(`📦 Successfully updated status of ${selectedProductIds.length} products to ${bulkEditStatus}!`);
                      setBulkEditStatus("");
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded px-2.5 py-1 font-black cursor-pointer text-[9.5px] border-0"
                  >
                    Apply
                  </button>
                </div>

                {/* Clear Selection */}
                <button
                  onClick={() => setSelectedProductIds([])}
                  className="text-xs text-slate-500 hover:text-slate-800 font-extrabold underline cursor-pointer ml-1 border-0 bg-transparent"
                >
                  Clear Select
                </button>
              </div>
            </div>
          )}

          {/* Section 3.2 Product Filters, Search & Sort Control Bar */}
          <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4 space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search Control */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products by name, SKU, or description..."
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200/80 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                />
                {productSearchQuery && (
                  <button
                    onClick={() => setProductSearchQuery("")}
                    className="absolute right-2.5 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Sort Control */}
              <div className="md:w-56 flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-white border border-slate-200/80 text-slate-600 text-xs rounded-xl px-2.5 py-2 focus:outline-none focus:border-emerald-500 cursor-pointer font-bold"
                >
                  <option value="name-asc font-bold">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="stock-asc">Stock: Low to High</option>
                  <option value="stock-desc">Stock: High to Low</option>
                  <option value="date-desc">Date Added: Newest</option>
                  <option value="date-asc">Date Added: Oldest</option>
                </select>
              </div>
            </div>

            {/* Dropdown Filters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Category Dropdown Filter */}
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-white border border-slate-200/80 text-slate-600 text-[11px] rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer font-bold"
                >
                  <option value="All">All Categories</option>
                  <option value="Seeds">Seeds</option>
                  <option value="Fertilizers">Fertilizers</option>
                  <option value="IoT Sensors">IoT Sensors</option>
                  <option value="Machinery">Machinery</option>
                </select>
              </div>

              {/* Status Dropdown Filter */}
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full bg-white border border-slate-200/80 text-slate-600 text-[11px] rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer font-bold"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              {/* Stock Filter */}
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Stock Level</label>
                <select
                  value={filterStock}
                  onChange={(e) => setFilterStock(e.target.value)}
                  className="w-full bg-white border border-slate-200/80 text-slate-600 text-[11px] rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer font-bold"
                >
                  <option value="All">All Stock Levels</option>
                  <option value="In Stock">In Stock (&gt;15)</option>
                  <option value="Low Stock">Low Stock (≤15)</option>
                  <option value="Out of Stock">Out of Stock (0)</option>
                </select>
              </div>

              {/* Date Added Filter */}
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date Added</label>
                <select
                  value={filterDateAdded}
                  onChange={(e) => setFilterDateAdded(e.target.value)}
                  className="w-full bg-white border border-slate-200/80 text-slate-600 text-[11px] rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer font-bold"
                >
                  <option value="All">All Dates</option>
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                  <option value="365">This Year</option>
                </select>
              </div>
            </div>
            
            {/* Active filters feedback */}
            {(productSearchQuery || selectedCategory !== "All" || filterStatus !== "All" || filterStock !== "All" || filterDateAdded !== "All") && (
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2 text-[10px]">
                <div className="flex flex-wrap items-center gap-1.5 text-slate-500 font-bold">
                  <span>Active Filters:</span>
                  {selectedCategory !== "All" && (
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md text-[9px] font-bold border border-emerald-100">
                      Category: {selectedCategory}
                    </span>
                  )}
                  {filterStatus !== "All" && (
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md text-[9px] font-bold border border-emerald-100">
                      Status: {filterStatus}
                    </span>
                  )}
                  {filterStock !== "All" && (
                    <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md text-[9px] font-bold border border-amber-100">
                      Stock: {filterStock}
                    </span>
                  )}
                  {filterDateAdded !== "All" && (
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-[9px] font-bold border border-indigo-100">
                      Added: {filterDateAdded === "7" ? "Last 7 Days" : filterDateAdded === "30" ? "Last 30 Days" : "This Year"}
                    </span>
                  )}
                  {productSearchQuery && (
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[9px] font-bold max-w-[150px] truncate border border-slate-200">
                      Search: "{productSearchQuery}"
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setProductSearchQuery("");
                    setSelectedCategory("All");
                    setFilterStatus("All");
                    setFilterStock("All");
                    setFilterDateAdded("All");
                    setSortBy("name-asc");
                  }}
                  className="text-emerald-600 hover:text-emerald-800 font-extrabold hover:underline cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                  <th className="p-3.5 w-10 text-center font-black">
                    <input
                      type="checkbox"
                      checked={filteredItems.length > 0 && filteredItems.every(i => selectedProductIds.includes(i.id))}
                      onChange={(e) => {
                        if (e.target.checked) {
                          const allIds = filteredItems.map(i => i.id);
                          setSelectedProductIds(prev => Array.from(new Set([...prev, ...allIds])));
                        } else {
                          const allIds = filteredItems.map(i => i.id);
                          setSelectedProductIds(prev => prev.filter(id => !allIds.includes(id)));
                        }
                      }}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                  </th>
                  <th className="p-3.5 font-black">Product Thumbnail & Name</th>
                  <th className="p-3.5 font-black">Category</th>
                  <th className="p-3.5 font-black">Price (₹)</th>
                  <th className="p-3.5 font-black">Stock Status</th>
                  <th className="p-3.5 font-black text-center">National Status</th>
                  <th className="p-3.5 text-right font-black">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Package className="h-8 w-8 text-slate-300" />
                        <span className="font-extrabold text-sm">No matching products found</span>
                        <p className="text-[10px] text-slate-400 font-medium">Try broadening your search query or removing active filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => {
                    const isDraft = (item.publishStatus || "Active") === "Draft";
                    const isArchived = (item.publishStatus || "Active") === "Archived";
                    const isLowStock = item.stock <= (item.lowStockThreshold || 15) && item.stock > 0;
                    const isOutOfStock = item.stock === 0;

                    return (
                      <tr key={item.id} className="text-slate-700 hover:bg-slate-50/40 transition-colors">
                        <td className="p-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={selectedProductIds.includes(item.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProductIds(prev => [...prev, item.id]);
                              } else {
                                setSelectedProductIds(prev => prev.filter(id => id !== item.id));
                              }
                            }}
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          />
                        </td>
                        {/* 1. Thumbnail & SKU Info */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              <img
                                src={item.images?.[0] || item.image || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=100&auto=format&fit=crop"}
                                alt={item.name}
                                className="h-10 w-10 object-cover rounded-lg border border-slate-100 shadow-3xs"
                                referrerPolicy="no-referrer"
                              />
                              {isOutOfStock && (
                                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[7px] font-black uppercase px-1 rounded-full scale-90">
                                  Empty
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-black text-slate-800 text-[12px]">{item.name}</p>
                              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap max-w-[280px]">
                                <span className="text-[8.5px] text-slate-400 font-bold font-mono uppercase bg-slate-50 border px-1.5 py-0.2 rounded-md">
                                  {item.sku || item.id}
                                </span>
                                {item.certifications?.govApproved && (
                                  <span className="text-[7.5px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-extrabold px-1 rounded">
                                    APEDA
                                  </span>
                                )}
                                {item.certifications?.organicCertified && (
                                  <span className="text-[7.5px] bg-indigo-50 text-indigo-700 border border-indigo-100 font-extrabold px-1 rounded">
                                    Organic
                                  </span>
                                )}
                                {approvedCertificates.includes("gov-approved") && (
                                  <span className="text-[7px] bg-amber-500 text-white font-black px-1 rounded uppercase tracking-wider">
                                    Govt Approved
                                  </span>
                                )}
                                {approvedCertificates.includes("organic-certified") && (
                                  <span className="text-[7px] bg-emerald-600 text-white font-black px-1 rounded uppercase tracking-wider">
                                    Organic Certified
                                  </span>
                                )}
                                {approvedCertificates.includes("iso-9001") && (
                                  <span className="text-[7px] bg-indigo-600 text-white font-black px-1 rounded uppercase tracking-wider">
                                    ISO 9001
                                  </span>
                                )}
                                {approvedCertificates.includes("fssai-license") && (
                                  <span className="text-[7px] bg-cyan-600 text-white font-black px-1 rounded uppercase tracking-wider">
                                    FSSAI
                                  </span>
                                )}
                                {approvedCertificates.includes("export-quality") && (
                                  <span className="text-[7px] bg-purple-600 text-white font-black px-1 rounded uppercase tracking-wider">
                                    Export Ready
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Category & Subcategory */}
                        <td className="p-3.5 text-[11px] text-slate-500">
                          <span className="font-extrabold text-slate-700 block">{item.category}</span>
                          <span className="text-[9px] text-slate-400 block mt-0.5 uppercase tracking-wider">{item.subCategory || "General Input"}</span>
                        </td>

                        {/* 3. Pricing Row */}
                        <td className="p-3.5">
                          {editingId === item.id ? (
                            <div className="relative max-w-[90px]">
                              <span className="absolute left-1.5 top-1 text-slate-400 text-[10px]">₹</span>
                              <input
                                type="number"
                                value={tempPrice}
                                onChange={(e) => setTempPrice(parseInt(e.target.value) || 0)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-1.5 py-0.5 text-xs text-slate-800 pl-4 font-black focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                          ) : (
                            <div>
                              <span className="text-slate-800 font-black text-xs">₹{item.price}</span>
                              {item.mrp && item.mrp > item.price && (
                                <span className="text-[9px] text-slate-400 line-through block mt-0.5">
                                  MRP: ₹{item.mrp}
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* 4. Stock Availability with warning triggers */}
                        <td className="p-3.5">
                          {editingId === item.id ? (
                            <input
                              type="number"
                              value={tempStock}
                              onChange={(e) => setTempStock(parseInt(e.target.value) || 0)}
                              className="max-w-[70px] bg-slate-50 border border-slate-200 rounded-lg px-1.5 py-0.5 text-xs text-slate-800 font-black focus:outline-none focus:border-emerald-500"
                            />
                          ) : (
                            <div>
                              <span className={`px-2 py-1.5 rounded-lg text-[10px] font-black inline-block ${
                                isOutOfStock
                                  ? "bg-rose-50 text-rose-800 border border-rose-100"
                                  : isLowStock
                                  ? "bg-amber-50 text-amber-800 border border-amber-100"
                                  : "bg-emerald-50 text-emerald-800 border border-emerald-100"
                              }`}>
                                {item.stock} {item.unit || "units"} left
                              </span>
                              {isLowStock && (
                                <span className="text-[8px] text-amber-600 font-extrabold block mt-1 uppercase tracking-widest animate-pulse">
                                  ⚠️ Low Stock Alert
                                </span>
                              )}
                              {isOutOfStock && (
                                <span className="text-[8px] text-rose-600 font-extrabold block mt-1 uppercase tracking-widest">
                                  🚫 Out of Stock
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* 5. Publish Status Badge */}
                        <td className="p-3.5 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${
                            isArchived
                              ? "bg-rose-50 text-rose-600 border-rose-100"
                              : isDraft
                              ? "bg-slate-100 text-slate-600 border-slate-200"
                              : "bg-emerald-50 text-emerald-600 border-emerald-100"
                          }`}>
                            {item.publishStatus || "Active"}
                          </span>
                        </td>

                        {/* 6. Dynamic Actions */}
                        <td className="p-3.5 text-right">
                          {editingId === item.id ? (
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => setEditingId(null)}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => saveEdit(item.id)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black transition-all cursor-pointer shadow-xs"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-1.5 items-center">
                              {/* 1. Inspect */}
                              <button
                                onClick={() => setSelectedProductForView(item)}
                                className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 border border-slate-200/80 rounded-lg cursor-pointer transition-colors inline-flex items-center justify-center shrink-0"
                                title="Inspect complete trade details"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </button>

                              {/* 2. Full Edit / Adjust SKU */}
                              <button
                                onClick={() => handleOpenEditProduct(item)}
                                className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 border border-slate-200/80 rounded-lg cursor-pointer transition-colors inline-flex items-center justify-center shrink-0"
                                title="Edit full product details"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>

                              {/* 3. Duplicate */}
                              <button
                                onClick={() => handleDuplicateProduct(item)}
                                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200/80 rounded-lg cursor-pointer transition-colors inline-flex items-center justify-center shrink-0"
                                title="Duplicate product SKU"
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </button>

                              {/* 4. Archive/Activate Toggle */}
                              <button
                                onClick={() => handleToggleArchiveProduct(item.id)}
                                className={`p-1.5 border border-slate-200/80 rounded-lg cursor-pointer transition-colors inline-flex items-center justify-center shrink-0 ${
                                  isArchived
                                    ? "text-emerald-600 hover:bg-emerald-50"
                                    : "text-slate-500 hover:text-purple-600 hover:bg-purple-50"
                                }`}
                                title={isArchived ? "Publish Product to Market" : "Archive Product SKU"}
                              >
                                <Archive className="h-3.5 w-3.5" />
                              </button>

                              {/* 5. Delete (with confirmation safety trigger) */}
                              {deleteConfirmId === item.id ? (
                                <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 rounded-lg p-1 animate-fadeIn">
                                  <span className="text-[8px] font-black text-rose-800 uppercase px-1">Confirm?</span>
                                  <button
                                    onClick={() => handleDeleteProduct(item.id)}
                                    className="bg-rose-600 hover:bg-rose-700 text-white rounded px-1.5 py-0.5 text-[8.5px] font-black cursor-pointer"
                                  >
                                    YES
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 rounded px-1.5 py-0.5 text-[8.5px] font-bold cursor-pointer"
                                  >
                                    NO
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeleteConfirmId(item.id)}
                                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/80 rounded-lg cursor-pointer transition-colors inline-flex items-center justify-center shrink-0"
                                  title="Delete product catalog entry"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
          <InventoryTracker
            items={localItems}
            setItems={setLocalItems}
            onUpdateItem={onUpdateItem}
            setFeedback={setVerificationFeedback}
          />
        </div>
      )}

      {/* 2.2 Supplier Performance Widget */}
      <div id="supplier-performance-widget" className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-teal-500 to-emerald-600 text-white rounded-2xl shadow-sm">
              <TrendingUp className="h-5.5 w-5.5" />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase text-teal-600 tracking-widest bg-teal-50 border border-teal-100/50 px-2.5 py-0.5 rounded-full inline-block">
                Performance Dashboard
              </span>
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mt-0.5">
                Supplier Performance Analytics
              </h3>
              <p className="text-slate-400 text-[10px] font-semibold">
                Track sales volume, revenue breakdown channels, and buyer customer reviews.
              </p>
            </div>
          </div>

          {/* 7/30/90 Days Interactive Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1 self-start sm:self-center">
            {([
              { label: "7 Days", val: "7" },
              { label: "30 Days", val: "30" },
              { label: "90 Days", val: "90" }
            ] as const).map((t) => (
              <button
                key={t.val}
                onClick={() => setSalesTrendDays(t.val)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  salesTrendDays === t.val
                    ? "bg-slate-800 text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Top Analytics Row: Sales Trend & Revenue Pie Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sales Trend (Line/Area Chart) - Col span 8 */}
          <div className="lg:col-span-8 bg-slate-50/40 border border-slate-100 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-teal-600" /> Sales Trend & Order Outlay
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold">
                  Visualizing units shipped versus total turnover (₹)
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-slate-700 block">
                  Avg. {salesTrendDays === "7" ? "32" : salesTrendDays === "90" ? "180" : "55"} Units/Day
                </span>
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">
                  Steady Volume
                </span>
              </div>
            </div>

            {/* Area Chart representation */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight="bold" tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} fontWeight="bold" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderRadius: "12px",
                      border: "none",
                      color: "#fff",
                      fontSize: "11px",
                      fontWeight: "bold"
                    }}
                    formatter={(value: any, name: any) => [
                      name === "revenue" ? `₹${value.toLocaleString()}` : `${value} Units`,
                      name === "revenue" ? "Turnover" : "Qty Sold"
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#14b8a6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="units"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorUnits)"
                    name="units"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Category Breakdown (Pie Chart) - Col span 4 */}
          <div className="lg:col-span-4 bg-slate-50/40 border border-slate-100 p-5 rounded-2xl flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-indigo-600" /> Revenue Breakdown
              </h4>
              <p className="text-[10px] text-slate-400 font-semibold">
                Turnover contribution by category
              </p>
            </div>

            {/* Pie Chart display */}
            <div className="flex items-center justify-center h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {revenueBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderRadius: "12px",
                      border: "none",
                      color: "#fff",
                      fontSize: "10px",
                      fontWeight: "bold"
                    }}
                    formatter={(value: any) => `₹${value.toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart Legend with detail metrics */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
              {revenueBreakdownData.map((entry, idx) => {
                const total = revenueBreakdownData.reduce((sum, item) => sum + item.value, 0);
                const pct = Math.round((entry.value / total) * 100);
                return (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                    <div className="truncate text-left">
                      <span className="text-slate-600 font-semibold block truncate leading-none">{entry.name}</span>
                      <span className="text-slate-800 font-mono mt-0.5 inline-block">{pct}% (₹{(entry.value / 1000).toFixed(0)}k)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Analytics Row: Top Selling Products & Customer Feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Top Selling Products - Col span 6 */}
          <div className="lg:col-span-6 bg-slate-50/40 border border-slate-100 p-5 rounded-2xl space-y-4">
            <div>
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Package className="h-4 w-4 text-emerald-600" /> Top Selling Inputs
              </h4>
              <p className="text-[10px] text-slate-400 font-semibold">
                Your highest trading input lines this month (Top 5)
              </p>
            </div>

            <div className="space-y-3.5">
              {topSellingProducts.map((p, index) => (
                <div key={index} className="space-y-1.5 text-left text-xs font-bold">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-teal-500/10 text-teal-700 flex items-center justify-center font-black text-[9px] shrink-0 font-mono">
                        0{index + 1}
                      </span>
                      <span className="text-slate-800 text-[11.5px] truncate max-w-[200px] sm:max-w-[280px]">
                        {p.name}
                      </span>
                    </div>
                    <span className="text-slate-500 text-[10px] font-mono shrink-0">
                      {p.sold} sold
                    </span>
                  </div>

                  {/* Visual progress bar and metadata */}
                  <div className="flex items-center gap-3">
                    <div className="h-2 bg-slate-200/60 rounded-full flex-1 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${p.percentage}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-black shrink-0">
                      <span className="text-emerald-600 font-mono">
                        ₹{(p.revenue / 1000).toFixed(1)}k
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="text-amber-500">★ {p.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Satisfaction & Live Feedback Board - Col span 6 */}
          <div className="lg:col-span-6 bg-slate-50/40 border border-slate-100 p-5 rounded-2xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" /> Customer Satisfaction
                </h4>
                <span className="text-[9.5px] bg-amber-50 border border-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-black">
                  ★ {averageRating} / 5.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                Rating trends & feedback verified on the blockchain ledger
              </p>
            </div>

            {/* Satisfaction breakdown stats */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-white p-3 rounded-xl border border-slate-100/50">
              <div className="sm:col-span-4 text-center space-y-1 py-1">
                <span className="text-2xl font-mono font-black text-slate-800">{averageRating}</span>
                <div className="flex justify-center text-amber-500 text-xs">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider">
                  Out of {32 + reviewsList.length - 3} reviews
                </span>
              </div>

              {/* Bar charts for rating distribution */}
              <div className="sm:col-span-8 space-y-1.5 text-[9px] font-bold text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-7 shrink-0">5 Star</span>
                  <div className="h-1.5 bg-slate-100 rounded-full flex-1 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "85%" }} />
                  </div>
                  <span className="w-6 text-right font-mono">85%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-7 shrink-0">4 Star</span>
                  <div className="h-1.5 bg-slate-100 rounded-full flex-1 overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: "12%" }} />
                  </div>
                  <span className="w-6 text-right font-mono">12%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-7 shrink-0">3 Star</span>
                  <div className="h-1.5 bg-slate-100 rounded-full flex-1 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: "3%" }} />
                  </div>
                  <span className="w-6 text-right font-mono">3%</span>
                </div>
              </div>
            </div>

            {/* Interactive Scrollable Reviews List with live upvotes */}
            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
              {reviewsList.map((rev) => (
                <div key={rev.id} className="bg-white p-3 rounded-xl border border-slate-100/50 text-left space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10.5px] font-black text-slate-800">{rev.customerName}</span>
                      <span className="text-[8.5px] font-bold text-slate-400">({rev.role})</span>
                    </div>
                    <span className="text-[8px] text-slate-400 font-bold font-mono">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                    <span className="text-[8px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-extrabold ml-1 uppercase">
                      ✓ Verified Buyer
                    </span>
                  </div>

                  <p className="text-[9.5px] text-slate-500 font-semibold leading-relaxed">
                    "{rev.comment}"
                  </p>

                  <div className="flex items-center justify-between border-t border-slate-50 pt-1.5">
                    <span className="text-[8px] text-slate-400 font-semibold">Was this review helpful?</span>
                    <button
                      type="button"
                      onClick={() => handleUpvoteReview(rev.id)}
                      className="flex items-center gap-1 text-[8.5px] font-extrabold text-teal-600 hover:text-teal-700 bg-teal-50 px-2 py-0.5 rounded transition-all cursor-pointer"
                    >
                      <ThumbsUp className="h-3 w-3 shrink-0" /> Helpful ({reviewUpvotes[rev.id] || 0})
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Live review input form */}
            <form onSubmit={handleAddReview} className="bg-white/80 p-2.5 rounded-xl border border-slate-150 flex items-center gap-2 text-[10px]">
              <input
                type="text"
                required
                placeholder="Name"
                value={newReviewAuthor}
                onChange={(e) => setNewReviewAuthor(e.target.value)}
                className="w-1/4 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-800 focus:outline-none"
              />
              <input
                type="text"
                required
                placeholder="Add rating feedback to ledger..."
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-800 focus:outline-none"
              />
              <select
                value={newReviewRating}
                onChange={(e) => setNewReviewRating(parseInt(e.target.value))}
                className="bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-amber-600 font-bold focus:outline-none cursor-pointer"
              >
                <option value={5}>5 ★</option>
                <option value={4}>4 ★</option>
                <option value={3}>3 ★</option>
              </select>
              <button
                type="submit"
                className="bg-slate-800 hover:bg-slate-900 text-white font-extrabold px-3 py-1 rounded transition-colors cursor-pointer"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Supply Price Comparison & Group Opportunity Finder */}
      <div id="supply-price-comparison" className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <BarChart className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Supply Price Comparison Index</h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Real-time local mandi rate matching & competitor comparison engine</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search comparison items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-500 w-44"
              />
            </div>

            {/* Category toggle buttons */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1">
              {(["All", "Seeds", "Fertilizers"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setComparisonCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    comparisonCategory === cat
                      ? "bg-slate-800 text-white shadow-3xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Outer grid for Table and Interactive Calculator side-by-side */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Column: Comparisons Table (span 8) */}
          <div className="xl:col-span-8 space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[9px] font-bold">
                    <th className="py-2">Product & Unit</th>
                    <th className="py-2 text-center bg-slate-50/50">Mandi Avg</th>
                    <th className="py-2 text-center text-teal-700 bg-teal-50/40">Your Store</th>
                    <th className="py-2 text-center">Greenfield</th>
                    <th className="py-2 text-center">Bharat Agro</th>
                    <th className="py-2 text-center">Kisan Co-op</th>
                    <th className="py-2 text-right">Best Saving</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/60 font-medium text-slate-700">
                  {filteredComparisonProducts.map((p) => {
                    const yourPrice = getProductPrice(p);
                    const prices = [yourPrice, p.greenfield, p.bharatAgro, p.kisanCoop];
                    const minPrice = Math.min(...prices);
                    const isYourStoreBest = yourPrice === minPrice;
                    
                    // Saving relative to the general Regional Mandi Average
                    const unitSaving = p.averageMarketRate - minPrice;
                    const savingPct = Math.round((unitSaving / p.averageMarketRate) * 100);

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="py-3 pr-2">
                          <p className="font-bold text-slate-800 text-xs">{p.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[8.5px] uppercase font-black bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded">
                              {p.category}
                            </span>
                            <span className="text-[9px] text-slate-400 font-semibold">{p.unit}</span>
                          </div>
                        </td>
                        
                        {/* Mandi average */}
                        <td className="py-3 text-center bg-slate-50/40 font-bold text-slate-600">
                          ${p.averageMarketRate}
                        </td>

                        {/* Your Store price */}
                        <td className={`py-3 text-center bg-teal-50/20 font-extrabold ${isYourStoreBest ? "text-emerald-600 font-black" : "text-slate-800"}`}>
                          ${yourPrice}
                          {isYourStoreBest && (
                            <span className="block text-[8px] text-emerald-500 leading-none mt-0.5">★ Lowest</span>
                          )}
                        </td>

                        {/* Competitors */}
                        <td className={`py-3 text-center ${p.greenfield === minPrice ? "text-emerald-600 font-black" : "text-slate-500"}`}>
                          ${p.greenfield}
                          {p.greenfield === minPrice && !isYourStoreBest && (
                            <span className="block text-[8px] text-emerald-500 leading-none mt-0.5">Lowest</span>
                          )}
                        </td>

                        <td className={`py-3 text-center ${p.bharatAgro === minPrice ? "text-emerald-600 font-black" : "text-slate-500"}`}>
                          ${p.bharatAgro}
                          {p.bharatAgro === minPrice && !isYourStoreBest && (
                            <span className="block text-[8px] text-emerald-500 leading-none mt-0.5">Lowest</span>
                          )}
                        </td>

                        <td className={`py-3 text-center ${p.kisanCoop === minPrice ? "text-emerald-600 font-black" : "text-slate-500"}`}>
                          ${p.kisanCoop}
                          {p.kisanCoop === minPrice && !isYourStoreBest && (
                            <span className="block text-[8px] text-emerald-500 leading-none mt-0.5">Lowest</span>
                          )}
                        </td>

                        {/* Best Saving Column */}
                        <td className="py-3 text-right">
                          <div className="inline-block text-right">
                            {unitSaving > 0 ? (
                              <>
                                <span className="text-emerald-600 font-black text-xs block">${unitSaving.toFixed(1)} saved</span>
                                <span className="text-[8px] text-slate-400 font-bold block">{savingPct}% off Mandi</span>
                              </>
                            ) : (
                              <span className="text-slate-400 text-[10px] font-semibold">At Par</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  
                  {filteredComparisonProducts.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 text-xs font-semibold">
                        No comparison products match your search. Try "seeds" or "fertilizer".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Note about regional average */}
            <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-100 flex items-start gap-2">
              <Info className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                <strong>Smart Margin Alert:</strong> Farmers can leverage our collaborative wholesale pre-ordering pool on the right side to pool resources. If your store matching rates are lower, farmers receive smart push-alerts pointing to your SKUs.
              </p>
            </div>
          </div>

          {/* Right Column: Bulk Opportunities & Savings Calculator (span 4) */}
          <div className="xl:col-span-4 bg-slate-900 text-white rounded-2xl p-4 md:p-5 flex flex-col justify-between border border-slate-800 space-y-4">
            <div className="space-y-4">
              {/* Card Title */}
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800">
                <Calculator className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-emerald-300">Farmer Savings Calc</h4>
                  <p className="text-[9px] text-slate-400 mt-0.5">Simulate bulk cost optimization</p>
                </div>
              </div>

              {/* Form Select Product */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-300 block">Select Input SKU:</label>
                <select
                  value={selectedCalcProduct}
                  onChange={(e) => {
                    setSelectedCalcProduct(e.target.value);
                    setPreOrderSuccess(false);
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {COMPARISON_PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.unit})
                    </option>
                  ))}
                </select>
              </div>

              {/* Slider for Quantity */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-300">
                  <span>Bulk Order Qty:</span>
                  <span className="text-emerald-400 font-mono text-xs">{calcQuantity} units</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  value={calcQuantity}
                  onChange={(e) => {
                    setCalcQuantity(parseInt(e.target.value));
                    setPreOrderSuccess(false);
                  }}
                  className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-full cursor-pointer"
                />
                <div className="flex justify-between text-[8px] text-slate-500 font-bold font-mono">
                  <span>5 units</span>
                  <span>100 (Co-op pool)</span>
                  <span>200 units Max</span>
                </div>
              </div>

              {/* Visual Bars for Costs comparison */}
              <div className="space-y-3 pt-2">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Total Bulk Cost Comparison:</p>
                
                {/* Cost at different suppliers */}
                {(() => {
                  const maxCost = Math.max(
                    calculatedCosts.yourStore,
                    calculatedCosts.average,
                    calculatedCosts.greenfield,
                    calculatedCosts.bharatAgro,
                    calculatedCosts.kisanCoop
                  );

                  const costSources = [
                    { name: "Your Store", cost: calculatedCosts.yourStore, highlight: true, brandColor: "bg-teal-500" },
                    { name: "Mandi Avg", cost: calculatedCosts.average, highlight: false, brandColor: "bg-slate-500" },
                    { name: "Greenfield", cost: calculatedCosts.greenfield, highlight: false, brandColor: "bg-indigo-500" },
                    { name: "Bharat Agro", cost: calculatedCosts.bharatAgro, highlight: false, brandColor: "bg-purple-500" },
                    { name: "Kisan Co-op", cost: calculatedCosts.kisanCoop, highlight: false, brandColor: "bg-emerald-500" }
                  ];

                  return (
                    <div className="space-y-2">
                      {costSources.map((source, index) => {
                        const widthPct = Math.max(15, (source.cost / maxCost) * 100);
                        const isCheapest = source.cost === cheapestSource.value;

                        return (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between text-[9px] font-bold">
                              <span className={`${source.highlight ? "text-teal-300 font-extrabold" : "text-slate-300"} flex items-center gap-1`}>
                                {source.name}
                                {isCheapest && <span className="text-[7.5px] bg-emerald-500/20 text-emerald-400 px-1 rounded uppercase font-black tracking-tight font-sans">Best</span>}
                              </span>
                              <span className="font-mono text-slate-100">${source.cost.toLocaleString()}</span>
                            </div>
                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${isCheapest ? "bg-emerald-400" : source.brandColor} transition-all duration-300`}
                                style={{ width: `${widthPct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Simulated Outcomes & Group Pre-order button */}
            <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                <span>Maximum Savings:</span>
                <span className="text-emerald-400 font-mono text-xs">
                  ${Math.max(0, calculatedCosts.average - cheapestSource.value).toLocaleString()} saved
                </span>
              </div>
              <p className="text-[8.5px] text-slate-400 leading-normal font-medium">
                By purchasing at the lowest rate (<strong>{cheapestSource.name}</strong>) instead of regional average market rates, farmers optimize their input margins by {Math.round(((calculatedCosts.average - cheapestSource.value) / (calculatedCosts.average || 1)) * 100)}%.
              </p>

              {preOrderSuccess ? (
                <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-lg p-2 text-center text-[10px] font-bold flex items-center justify-center gap-1.5">
                  <Check className="h-3.5 w-3.5" />
                  Pre-Order Locked on Cooperative Ledger!
                </div>
              ) : (
                <button
                  onClick={() => setPreOrderSuccess(true)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2 text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Lock Cooperative Pre-Order Deal
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Machinery ROI Calculator Section */}
      <div id="machinery-roi-calculator" className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                <Calculator className="h-3 w-3 animate-pulse" /> Precision Tech ROI Suite
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-700 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest">
                Supplier CAPEX Planner
              </span>
            </div>
            <h3 className="text-slate-800 text-lg font-black uppercase tracking-tight mt-1 flex items-center gap-2">
              🚜 Smart Machinery & IoT Payback Calculator
            </h3>
            <p className="text-slate-500 text-xs font-semibold">
              Enter your specific cultivation scale and current economics to estimate the exact break-even year, cash flow projection, and multi-year savings when procuring advanced equipment.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Inputs Section */}
          <div className="xl:col-span-5 space-y-5">
            {/* 1. Device Selection List */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">
                1. Select Equipment or Sensor System
              </label>
              <div className="space-y-2.5 max-h-[310px] overflow-y-auto pr-1">
                {MACHINERY_OPTIONS.map((machine) => {
                  const isSelected = machine.id === selectedMachineId;
                  const estimatedCost = machine.costBase + (machine.costPerAcre * farmSize);
                  return (
                    <div
                      key={machine.id}
                      onClick={() => setSelectedMachineId(machine.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer text-xs flex flex-col gap-1.5 ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50/20 shadow-2xs"
                          : "border-slate-150 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="font-extrabold text-slate-800 block text-[12px]">
                            {machine.name}
                          </span>
                          <span className="text-[9px] bg-slate-100 text-slate-600 font-extrabold px-1.5 py-0.2 rounded uppercase mt-0.5 inline-block">
                            {machine.category}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[11px] font-black text-slate-700 block">
                            ${estimatedCost.toLocaleString()}
                          </span>
                          <span className="text-[8px] text-slate-400 font-semibold block">
                            {machine.costPerAcre > 0 ? `+$${machine.costPerAcre}/ac` : "Flat cost"}
                          </span>
                        </div>
                      </div>
                      <p className="text-[10.5px] text-slate-500 leading-normal font-medium">
                        {machine.description}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1 text-[9px] font-black text-slate-500 border-t border-slate-100/60 mt-1">
                        <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <TrendingUp className="h-3 w-3" /> +{machine.yieldBoostPct}% Yield
                        </span>
                        <span className="text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Activity className="h-3 w-3" /> {machine.waterSavingPct}% Input Saved
                        </span>
                        {machine.laborSavingAnnual > 0 && (
                          <span className="text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Sliders className="h-3 w-3" /> +${machine.laborSavingAnnual}/yr Labor Saved
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Farm Scaling Sliders */}
            <div className="bg-slate-50/80 p-4 border border-slate-200/60 rounded-2xl space-y-4">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider block">
                2. Customize Farm Scaling & Crop Metrics
              </span>

              {/* Slider for Farm Size */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-600 flex items-center gap-1">Farm Size:</span>
                  <span className="text-slate-800 font-black">{farmSize} Acres</span>
                </div>
                <div className="flex gap-3 items-center">
                  <input
                    type="range"
                    min="1"
                    max="500"
                    step="1"
                    value={farmSize}
                    onChange={(e) => setFarmSize(parseInt(e.target.value) || 1)}
                    className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={farmSize}
                    onChange={(e) => setFarmSize(Math.max(1, Math.min(500, parseInt(e.target.value) || 1)))}
                    className="w-16 bg-white border border-slate-200 rounded-lg text-center font-extrabold text-xs py-1 text-slate-800"
                  />
                </div>
              </div>

              {/* Slider for Expected Crop Yield */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-600">Expected Yield per Acre:</span>
                  <span className="text-slate-800 font-black">{cropYield} Tons</span>
                </div>
                <div className="flex gap-3 items-center">
                  <input
                    type="range"
                    min="0.5"
                    max="15.0"
                    step="0.1"
                    value={cropYield}
                    onChange={(e) => setCropYield(parseFloat(e.target.value) || 0.5)}
                    className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="15"
                    value={cropYield}
                    onChange={(e) => setCropYield(Math.max(0.5, Math.min(15, parseFloat(e.target.value) || 0.5)))}
                    className="w-16 bg-white border border-slate-200 rounded-lg text-center font-extrabold text-xs py-1 text-slate-800"
                  />
                </div>
              </div>

              {/* Slider for Crop Market Price */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-600">Crop Market Price:</span>
                  <span className="text-slate-800 font-black">${cropPrice} / Ton</span>
                </div>
                <div className="flex gap-3 items-center">
                  <input
                    type="range"
                    min="50"
                    max="1500"
                    step="10"
                    value={cropPrice}
                    onChange={(e) => setCropPrice(parseInt(e.target.value) || 50)}
                    className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                  <input
                    type="number"
                    min="50"
                    max="1500"
                    value={cropPrice}
                    onChange={(e) => setCropPrice(Math.max(50, Math.min(1500, parseInt(e.target.value) || 50)))}
                    className="w-16 bg-white border border-slate-200 rounded-lg text-center font-extrabold text-xs py-1 text-slate-800"
                  />
                </div>
              </div>

              {/* Slider for Annual Input Resource Costs */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-600">Annual Water & Fertilizer Cost per Acre:</span>
                  <span className="text-slate-800 font-black">${annualInputCost} / Acre</span>
                </div>
                <div className="flex gap-3 items-center">
                  <input
                    type="range"
                    min="50"
                    max="1200"
                    step="10"
                    value={annualInputCost}
                    onChange={(e) => setAnnualInputCost(parseInt(e.target.value) || 50)}
                    className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                  <input
                    type="number"
                    min="50"
                    max="1200"
                    value={annualInputCost}
                    onChange={(e) => setAnnualInputCost(Math.max(50, Math.min(1200, parseInt(e.target.value) || 50)))}
                    className="w-16 bg-white border border-slate-200 rounded-lg text-center font-extrabold text-xs py-1 text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Outcomes & Payback Projections Chart */}
          <div className="xl:col-span-7 space-y-6 flex flex-col justify-between">
            
            {/* KPI Matrix Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-50 border border-slate-150 p-3 rounded-2xl flex flex-col justify-between">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Upfront CAPEX</span>
                <span className="text-slate-800 text-[14px] font-black mt-1 block">
                  ${Math.round(roiCalculations.upfrontCost).toLocaleString()}
                </span>
                <span className="text-[8px] text-slate-400 font-semibold block mt-0.5">
                  Investment
                </span>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl flex flex-col justify-between">
                <span className="text-[9px] text-emerald-700 font-bold uppercase block">Annual Savings</span>
                <span className="text-emerald-700 text-[14px] font-black mt-1 block">
                  +${Math.round(roiCalculations.totalAnnualBenefit).toLocaleString()}
                </span>
                <span className="text-[8px] text-emerald-600 font-semibold block mt-0.5">
                  Added revenue & savings
                </span>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-2xl flex flex-col justify-between">
                <span className="text-[9px] text-indigo-700 font-bold uppercase block">Payback Period</span>
                <span className="text-indigo-800 text-[14px] font-black mt-1 block">
                  {roiCalculations.paybackPeriod} {roiCalculations.paybackPeriod === 1 ? 'Year' : 'Years'}
                </span>
                <span className="text-[8px] text-indigo-500 font-semibold block mt-0.5 flex items-center gap-1">
                  <Check className="h-3 w-3 text-emerald-600" /> Break-Even Target
                </span>
              </div>

              <div className="bg-purple-50 border border-purple-100 p-3 rounded-2xl flex flex-col justify-between">
                <span className="text-[9px] text-purple-700 font-bold uppercase block">5-Year Net ROI</span>
                <span className="text-purple-800 text-[14px] font-black mt-1 block">
                  +{roiCalculations.roiPct}%
                </span>
                <span className="text-[8px] text-purple-500 font-semibold block mt-0.5">
                  +${Math.round(roiCalculations.net5YearGain).toLocaleString()} Profit
                </span>
              </div>
            </div>

            {/* Projection Payback Graph */}
            <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-850 space-y-3.5 shadow-sm">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <div className="space-y-0.5">
                  <span className="text-[8px] bg-emerald-500/10 text-emerald-300 border border-emerald-900/30 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold inline-block">
                    Cumulative Cash Flow Projection
                  </span>
                  <h4 className="text-xs font-black uppercase text-white">5-Year Break-Even Curve</h4>
                </div>
                <div className="text-right text-[9px] font-mono text-slate-400">
                  Breaks Even in <span className="text-emerald-400 font-extrabold">{roiCalculations.paybackPeriod} years</span>
                </div>
              </div>

              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={roiCalculations.chartData}>
                    <defs>
                      <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="year" stroke="#94a3b8" style={{ fontSize: 9, fontWeight: "bold" }} />
                    <YAxis
                      stroke="#94a3b8"
                      style={{ fontSize: 9, fontWeight: "bold" }}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 12, fontSize: 10 }}
                      formatter={(value: any) => [`$${parseFloat(value).toLocaleString()}`, "Net Cumulative Cash Flow"]}
                    />
                    <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" />
                    <Area
                      type="monotone"
                      dataKey="Net Return"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#roiGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                <span>Investment Date (Year 0)</span>
                <span>Optimized Maturity (Year 5)</span>
              </div>
            </div>

            {/* AI Advisor Box */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-start gap-3 text-xs leading-relaxed text-slate-600">
              <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-xl shrink-0">
                <Cpu className="h-4.5 w-4.5 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-black text-indigo-600 tracking-wider block">Co-Op Advisor Assessment</span>
                <p className="text-[11px] font-semibold text-slate-700">
                  {roiCalculations.paybackPeriod <= 2.0 ? (
                    <span>⚡ <strong>Highly Profitable (Immediate Turnaround):</strong> With a rapid payback of {roiCalculations.paybackPeriod} years, this technology is an exceptional operational priority. It will save you <strong>${Math.round(roiCalculations.annualResourceSavings).toLocaleString()}/year</strong> in inputs and increase harvest value by <strong>${Math.round(roiCalculations.annualRevenueBoost).toLocaleString()}/year</strong>. Ask your co-op manager about collective bulk pricing terms.</span>
                  ) : roiCalculations.paybackPeriod <= 4.0 ? (
                    <span>🌿 <strong>Strong Viability (Healthy Payback):</strong> This system pays for itself in {roiCalculations.paybackPeriod} years. Stable resource optimization and consistent crop yield increases ensure healthy margins. This is well-suited for standard agricultural cooperative equipment leasing or interest-free green credit financing.</span>
                  ) : (
                    <span>⚖️ <strong>Marginal Viability (Scale Constraint):</strong> Payback of {roiCalculations.paybackPeriod} years is slightly extended due to your current farm parameters. To accelerate break-even, consider pooling this machinery across 2-3 neighborhood plots to share the upfront CAPEX, or increase the target crop vegetative yield.</span>
                  )}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 1.4 SUPPLIER VERIFICATION SYSTEM PANEL */}
      <div id="supplier-verification-hub" className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl shrink-0 shadow-sm">
              <ShieldCheck className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-tight">Enterprise Trust & Verification Hub</h3>
                {hasVerifiedBadge && (
                  <span className="bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Award className="h-3.5 w-3.5" /> Verified Status Active
                  </span>
                )}
                {(hasGovApprovedBadge || approvedCertificates.includes("gov-approved")) && (
                  <span className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="h-3.5 w-3.5 fill-current text-amber-200" /> Govt Approved
                  </span>
                )}
                {approvedCertificates.includes("organic-certified") && (
                  <span className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Award className="h-3.5 w-3.5" /> Organic Certified
                  </span>
                )}
                {approvedCertificates.includes("iso-9001") && (
                  <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Award className="h-3.5 w-3.5" /> ISO 9001 Quality
                  </span>
                )}
                {approvedCertificates.includes("fssai-license") && (
                  <span className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Award className="h-3.5 w-3.5" /> FSSAI Food-Safe
                  </span>
                )}
                {approvedCertificates.includes("export-quality") && (
                  <span className="bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Award className="h-3.5 w-3.5" /> Export Quality
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-xs mt-0.5">
                Complete basic, corporate, and advanced credit/clearing verification pipelines to increase limit capacities.
              </p>
            </div>
          </div>
          
          {/* Trust Score circular-style status meter */}
          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-150 flex items-center gap-4 min-w-[240px]">
            <div className="relative h-12 w-12 flex items-center justify-center rounded-full bg-slate-100 border-2 border-dashed border-teal-600/30 shrink-0">
              <span className="text-sm font-black text-slate-800 font-mono">{trustScore}%</span>
            </div>
            <div className="space-y-1 w-full">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
                <span className="text-slate-500">Corporate Trust Rating</span>
                <span className={trustScore >= 70 ? "text-emerald-600" : "text-amber-600"}>
                  {trustScore >= 70 ? "High Trust (Verified)" : "Standard Status"}
                </span>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-700 rounded-full ${
                    trustScore >= 70 ? 'bg-emerald-600' : 'bg-amber-500'
                  }`}
                  style={{ width: `${trustScore}%` }}
                />
              </div>
              <p className="text-[8px] font-semibold text-slate-400">
                {trustScore >= 70 ? "✅ Verified Badge active! Trade capacity increased to unlimited." : "⚠️ Complete remaining steps to reach 70% and earn Verified Badge."}
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Alert box */}
        {verificationFeedback && (
          <div className="p-3.5 bg-indigo-50 border border-indigo-100 text-indigo-950 rounded-2xl text-xs font-semibold flex items-start gap-2.5 animate-fadeIn">
            <Info className="h-4.5 w-4.5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase font-black text-indigo-700 tracking-wider block">Real-time Pipeline Update</span>
              <p>{verificationFeedback}</p>
            </div>
          </div>
        )}

        {/* 4-Step Verification Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* STEP 1: BASIC VERIFICATION (EMAIL + MOBILE OTP) */}
          <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200/60 pb-3">
              <div className="p-1.5 bg-sky-100 text-sky-800 rounded-lg">
                <Smartphone className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Basic Contact Authentication</h4>
                <p className="text-[10px] text-slate-400 font-semibold">Simulated OTP checks confirm personal liaisons</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Email Authentication Row */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-slate-600 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-slate-400" /> Corporate Email Verification
                  </span>
                  {verificationStatus.emailVerified ? (
                    <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 uppercase tracking-widest">
                      ✓ Verified (+15%)
                    </span>
                  ) : (
                    <span className="text-[9px] font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100 uppercase tracking-widest">
                      Pending Action
                    </span>
                  )}
                </div>

                {!verificationStatus.emailVerified ? (
                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2.5">
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                      Liaison registered email: <strong className="text-slate-700">{supplierData?.email || "partner@agriinputglobal.com"}</strong>.
                    </p>
                    {!verificationStatus.emailOtpSent ? (
                      <button
                        onClick={handleSendEmailOtp}
                        disabled={emailOtpLoading}
                        className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        {emailOtpLoading ? <RefreshCw className="h-3 w-3 animate-spin" /> : null}
                        Send Verification Email OTP
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={4}
                            placeholder="Enter 4-digit code (4198)"
                            value={verificationStatus.emailOtpInput || ""}
                            onChange={(e) => setVerificationStatus((prev: any) => ({ ...prev, emailOtpInput: e.target.value.replace(/\D/g, "") }))}
                            className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-teal-500 text-center"
                          />
                          <button
                            onClick={handleVerifyEmailOtp}
                            disabled={emailVerifyLoading || !verificationStatus.emailOtpInput}
                            className="px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white font-black text-[10px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                          >
                            {emailVerifyLoading ? "..." : "Confirm"}
                          </button>
                        </div>
                        <p className="text-[8.5px] font-semibold text-indigo-600/80 bg-indigo-50/50 p-1.5 rounded text-center">
                          💡 Enter simulated OTP code <strong className="font-bold">4198</strong> to verify.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="text-[10px] text-emerald-800 font-bold leading-none">
                      Email verified: {supplierData?.email || "partner@agriinputglobal.com"}
                    </span>
                  </div>
                )}
              </div>

              {/* Mobile Phone Authentication Row */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-slate-600 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-slate-400" /> Representative SMS Verification
                  </span>
                  {verificationStatus.mobileVerified ? (
                    <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 uppercase tracking-widest">
                      ✓ Verified (+15%)
                    </span>
                  ) : (
                    <span className="text-[9px] font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100 uppercase tracking-widest">
                      Pending Action
                    </span>
                  )}
                </div>

                {!verificationStatus.mobileVerified ? (
                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2.5">
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                      Liaison registered mobile: <strong className="text-slate-700">+91 {supplierData?.mobile || "9876543210"}</strong>.
                    </p>
                    {!verificationStatus.mobileOtpSent ? (
                      <button
                        onClick={handleSendMobileOtp}
                        disabled={mobileOtpLoading}
                        className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        {mobileOtpLoading ? <RefreshCw className="h-3 w-3 animate-spin" /> : null}
                        Send Mobile OTP via SMS
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={4}
                            placeholder="Enter 4-digit code (9251)"
                            value={verificationStatus.mobileOtpInput || ""}
                            onChange={(e) => setVerificationStatus((prev: any) => ({ ...prev, mobileOtpInput: e.target.value.replace(/\D/g, "") }))}
                            className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-teal-500 text-center"
                          />
                          <button
                            onClick={handleVerifyMobileOtp}
                            disabled={mobileVerifyLoading || !verificationStatus.mobileOtpInput}
                            className="px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white font-black text-[10px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                          >
                            {mobileVerifyLoading ? "..." : "Confirm"}
                          </button>
                        </div>
                        <p className="text-[8.5px] font-semibold text-indigo-600/80 bg-indigo-50/50 p-1.5 rounded text-center">
                          💡 Enter simulated OTP code <strong className="font-bold">9251</strong> to verify.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="text-[10px] text-emerald-800 font-bold leading-none">
                      Mobile SMS authenticated: +91 {supplierData?.mobile || "9876543210"}
                    </span>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* STEP 2: BUSINESS VERIFICATION (GST REGISTER) */}
          <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200/60 pb-3">
              <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                <Building className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Business Registry Verification</h4>
                <p className="text-[10px] text-slate-400 font-semibold">Live check against National GSTIN Government database</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Registered Corporate Identity</span>
                    <h5 className="text-xs font-extrabold text-slate-800">{supplierData?.businessName || "AgriInput Global Ltd"}</h5>
                    <p className="text-[10px] font-mono text-indigo-600 font-bold">GSTIN: {supplierData?.gstNumber || "27AAAAA1111A1Z1"}</p>
                  </div>
                  <div className="text-right">
                    {verificationStatus.gstApiChecked ? (
                      <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 uppercase tracking-widest">
                        ✓ GST Portal Sync (+15%)
                      </span>
                    ) : (
                      <span className="text-[9px] font-black text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 uppercase tracking-widest">
                        Unconfirmed Sync
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-150 space-y-1.5">
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>GSTIN Tax Filing status</span>
                    <span className="text-emerald-600 font-black">Active - Filings Regular</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Corporate Constitution</span>
                    <span className="font-bold text-slate-700">{supplierData?.businessType || "Manufacturer"}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Registered Site Address</span>
                    <span className="text-[9px] text-right font-semibold text-slate-600 max-w-[150px] truncate" title={supplierData?.address}>
                      {supplierData?.address || "Mumbai, India"}
                    </span>
                  </div>
                </div>

                {!verificationStatus.gstApiChecked ? (
                  <button
                    onClick={handleGstPortalSync}
                    disabled={gstChecking}
                    className="w-full py-2 bg-[#164e63] hover:bg-teal-950 disabled:bg-slate-300 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    {gstChecking ? (
                      <>
                        <RefreshCw className="h-3 w-3 animate-spin" /> Querying GSTN API Gateway...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-3 w-3" /> Execute API Check & Refresh GST Status
                      </>
                    )}
                  </button>
                ) : (
                  <div className="p-2.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-lg border border-emerald-200 flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>Government registry status successfully linked! Verified owner Rajesh Kumar matches GSTIN records.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* STEP 3: ADVANCED FINANCIAL CLEARING */}
          <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200/60 pb-3">
              <div className="p-1.5 bg-purple-100 text-purple-800 rounded-lg">
                <CreditCard className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Advanced Financial Clearing</h4>
                <p className="text-[10px] text-slate-400 font-semibold">Immediate settlement penny tests and CIBIL credit score inquiry</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Penny Drop Test Box */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-black text-purple-600 block tracking-wider">Penny-Drop Settlement Check</span>
                  <p className="text-[10px] font-bold text-slate-800">
                    {supplierData?.bankName || "HDFC Bank"} Clearing Acc
                  </p>
                  <p className="text-[9px] font-mono text-slate-400">
                    A/C: ****{supplierData?.accountNumber ? supplierData.accountNumber.slice(-4) : "848"} | IFSC: {supplierData?.ifscCode || "HDFC0000012"}
                  </p>
                </div>

                {verificationStatus.bankPennyDropped ? (
                  <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 p-2 rounded-lg flex items-center gap-1">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> Bank Active (+15%)
                  </span>
                ) : (
                  <button
                    onClick={handleBankPennyDrop}
                    disabled={bankChecking}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-200 text-white font-extrabold text-[9px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    {bankChecking ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : (
                      "Run Penny Drop ($0.01)"
                    )}
                  </button>
                )}
              </div>

              {/* Credit check Box */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-black text-purple-600 block tracking-wider">Experian Commercial Credit</span>
                  {verificationStatus.creditScoreChecked ? (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-black">
                        <span className="text-slate-500">Bureau Score:</span>
                        <span className="text-emerald-700 font-mono bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">785 / 900</span>
                      </div>
                      <p className="text-[8px] text-slate-400">Risk Grade: <strong>Excellent (Low Risk)</strong></p>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                      Check credit registry for risk profiling. Enables delayed invoice credit terms.
                    </p>
                  )}
                </div>

                {verificationStatus.creditScoreChecked ? (
                  <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 p-2 rounded-lg flex items-center gap-1">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> Credit Checked (+15%)
                  </span>
                ) : (
                  <button
                    onClick={handleCreditCheck}
                    disabled={creditChecking}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-200 text-white font-extrabold text-[9px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    {creditChecking ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : (
                      "Execute Credit Check"
                    )}
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* STEP 4: GOVERNMENT CERTIFICATIONS (FILE UPLOADER) */}
          <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200/60 pb-3">
              <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
                <Award className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Government Certifications</h4>
                <p className="text-[10px] text-slate-400 font-semibold">Earn Government-Approved status with validated trading licenses</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                
                {/* Selector */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">License Certificate Type</label>
                  <select
                    value={govDocType}
                    onChange={(e) => setGovDocType(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-[11px] font-extrabold text-slate-700 focus:outline-none"
                  >
                    <option value="National Seeds Trading Certificate">National Seeds Trading Certificate</option>
                    <option value="Organic Inputs Council Accreditation">Organic Inputs Council Accreditation</option>
                    <option value="State Insecticides Wholesale License">State Insecticides Wholesale License</option>
                    <option value="Agri-Products Wholesale Board Permit">Agri-Products Wholesale Board Permit</option>
                  </select>
                  <p className="text-[8.5px] text-slate-400 font-semibold leading-relaxed">
                    Licensed suppliers gain state subsidies and cooperative purchase quotas.
                  </p>
                </div>

                {/* Upload zone */}
                <div className="border border-dashed border-slate-200 rounded-xl p-3 bg-white flex flex-col justify-between space-y-2">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Upload License Document</span>
                  
                  {govFileUploading ? (
                    <div className="space-y-1.5 py-1 text-center">
                      <div className="flex justify-between items-center text-[8.5px] font-bold text-slate-500">
                        <span>Scanning & Verifying signature...</span>
                        <span>{govUploadProgress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${govUploadProgress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleGovDocUploadSimulate}
                      className="w-full py-3 border border-dashed border-amber-300 bg-amber-50/20 hover:bg-amber-50 text-amber-800 font-bold text-[10px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Upload className="h-3.5 w-3.5" /> Drop PDF/Click to Select
                    </button>
                  )}
                </div>

              </div>

              {/* Uploaded items status list */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2.5">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Validated Government Certificates (+10%)</span>
                
                {verificationStatus.govDocsUploaded && verificationStatus.govDocsUploaded.length > 0 ? (
                  <div className="space-y-1.5">
                    {verificationStatus.govDocsUploaded.map((doc: string, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-amber-50/50 border border-amber-100/50 rounded-lg text-[10px]">
                        <span className="font-extrabold text-amber-900 flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5 text-amber-600" /> {doc}
                        </span>
                        <span className="text-[8.5px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-0.5">
                          ✓ Validated Active
                        </span>
                      </div>
                    ))}
                    <div className="p-2.5 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 text-[10px] rounded-xl flex items-start gap-2">
                      <Star className="h-4.5 w-4.5 text-amber-500 shrink-0 fill-current mt-0.5" />
                      <div>
                        <p className="text-amber-950 font-black uppercase tracking-tight">Government-Approved Badge Unlocked!</p>
                        <p className="text-amber-800 text-[9px] font-semibold">Your items are highlighted in local cooperative catalogs as certified organic & government approved.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-100 text-slate-400 text-[10px] font-semibold">
                    No verified government credentials uploaded. Upload seed, compost, or device trading permits to earn the Government-Approved badge!
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Dynamic ML Co-Pilot Suite */}
      <MLPredictionHub currentPhase="Supplier" />

      {/* Device Security Dialog */}
      {securityDialogOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5.5 w-5.5 text-emerald-600 shrink-0" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-tight">Security & Device Sessions</h3>
                  <p className="text-slate-400 text-[10px] font-semibold">Active authorized logins for {supplierData?.businessName || "Your Business"}</p>
                </div>
              </div>
              <button
                onClick={() => setSecurityDialogOpen(false)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-full cursor-pointer transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {dashboardSessions.map((sess) => (
                <div
                  key={sess.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    sess.isCurrent
                      ? "bg-emerald-50/50 border-emerald-200/80 shadow-sm"
                      : "bg-slate-50 border-slate-200/60"
                  } flex items-center justify-between gap-3`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                      sess.isCurrent ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-500"
                    }`}>
                      {sess.device.includes("Mobile") ? (
                        <Smartphone className="h-4 w-4" />
                      ) : sess.device.includes("Tablet") ? (
                        <Tablet className="h-4 w-4" />
                      ) : (
                        <Laptop className="h-4 w-4" />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-extrabold text-slate-800">{sess.device}</span>
                        {sess.isCurrent && (
                          <span className="bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <Check className="h-2 w-2 stroke-[3]" /> THIS DEVICE
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-semibold space-y-0.5">
                        <p className="flex items-center gap-1"><Info className="h-3 w-3 shrink-0" /> {sess.browser} • IP: {sess.ipAddress}</p>
                        <p className="flex items-center gap-1"><MapPin className="h-3 w-3 shrink-0 text-slate-400" /> {sess.location}</p>
                        <p className="flex items-center gap-1"><Calendar className="h-3 w-3 shrink-0 text-slate-400" /> Last Active: {sess.lastActive}</p>
                      </div>
                    </div>
                  </div>

                  {!sess.isCurrent && (
                    <button
                      onClick={() => handleRevokeDashboardSession(sess.id)}
                      className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all cursor-pointer border border-transparent hover:border-rose-100 shrink-0"
                      title="Revoke session"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {dashboardSessions.length > 1 && (
              <button
                onClick={handleRevokeAllDashboardSessions}
                className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/50 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <ShieldAlert className="h-4 w-4 shrink-0" /> Revoke All Other Active Sessions
              </button>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSecurityDialogOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Close Security Panel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW PRODUCT FORM MODAL */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 max-w-2xl w-full shadow-2xl relative space-y-5 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                  <Package className="h-5 w-5 shrink-0" />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-tight">Product Management & SKU Creator</h3>
                  <p className="text-slate-400 text-[10px] font-semibold">Stage 3.1: Complete required trade fields for instant national listing</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAddProductOpen(false);
                  setAddProductActiveTab("general");
                }}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-full cursor-pointer transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Wizard Steps / Tabs Navigation */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1.5 border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
              <button
                type="button"
                onClick={() => setAddProductActiveTab("general")}
                className={`px-3 py-2 rounded-lg transition-all shrink-0 cursor-pointer ${
                  addProductActiveTab === "general"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "hover:bg-slate-50 text-slate-600"
                }`}
              >
                1. General Info
              </button>
              <button
                type="button"
                onClick={() => setAddProductActiveTab("pricing")}
                className={`px-3 py-2 rounded-lg transition-all shrink-0 cursor-pointer ${
                  addProductActiveTab === "pricing"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "hover:bg-slate-50 text-slate-600"
                }`}
              >
                2. Pricing & Discounts
              </button>
              <button
                type="button"
                onClick={() => setAddProductActiveTab("inventory")}
                className={`px-3 py-2 rounded-lg transition-all shrink-0 cursor-pointer ${
                  addProductActiveTab === "inventory"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "hover:bg-slate-50 text-slate-600"
                }`}
              >
                3. Inventory Level
              </button>
              <button
                type="button"
                onClick={() => setAddProductActiveTab("media")}
                className={`px-3 py-2 rounded-lg transition-all shrink-0 cursor-pointer ${
                  addProductActiveTab === "media"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "hover:bg-slate-50 text-slate-600"
                }`}
              >
                4. Media & Certs
              </button>
              <button
                type="button"
                onClick={() => setAddProductActiveTab("shipping")}
                className={`px-3 py-2 rounded-lg transition-all shrink-0 cursor-pointer ${
                  addProductActiveTab === "shipping"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "hover:bg-slate-50 text-slate-600"
                }`}
              >
                5. Logistical Outlay
              </button>
            </div>

            {/* Form Fields container */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newProdName.trim()) {
                  setAddProductActiveTab("general");
                  return;
                }

                const finalId = editingProduct ? editingProduct.id : `sup-${Date.now().toString().slice(-4)}`;
                const finalSku = newProdSku.trim() || `SKU-${newProdCategory.toUpperCase().slice(0, 3)}-${newProdSubCategory.toUpperCase().slice(0, 3)}-${finalId}`;
                
                const updatedProduct = {
                  id: finalId,
                  name: newProdName,
                  category: newProdCategory,
                  subCategory: newProdSubCategory,
                  sku: finalSku,
                  description: newProdDescription || "No description provided.",
                  unit: newProdUnit,
                  price: newProdPrice,
                  costPrice: newProdCostPrice,
                  mrp: newProdMrp,
                  moq: newProdMoq,
                  bulkPricing: newProdBulkPricing,
                  stock: newProdStock,
                  lowStockThreshold: newProdLowStockThreshold,
                  reorderPoint: newProdReorderPoint,
                  images: newProdImages.length > 0 ? newProdImages : ["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop"],
                  image: newProdImages?.[0] || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop",
                  video: newProdVideo,
                  certifications: {
                    govApproved: newProdGovApproved,
                    organicCertified: newProdOrganicCertified,
                    isoCertified: newProdIsoCertified,
                    fssaiLicense: newProdFssaiLicense
                  },
                  shipping: {
                    weight: newProdWeight,
                    dimensions: {
                      length: newProdDimLength,
                      width: newProdDimWidth,
                      height: newProdDimHeight
                    },
                    cost: newProdShippingCost,
                    costType: newProdShippingCostType,
                    zones: newProdShippingZones
                  },
                  publishStatus: newProdPublishStatus,
                  rating: editingProduct ? editingProduct.rating : 5.0,
                  dateAdded: editingProduct ? (editingProduct.dateAdded || "2026-07-08") : "2026-07-08"
                };

                if (editingProduct) {
                  setLocalItems((prev) => prev.map((item) => item.id === finalId ? updatedProduct : item));
                  setVerificationFeedback(`🎉 Product SKU "${finalSku}" updated successfully!`);
                  addAuditEntry(
                    "Product Updated in Catalog",
                    `Modified product catalog entry for '${newProdName}' (SKU: ${finalSku}). New price: ${newProdPrice} INR, stock level: ${newProdStock}.`,
                    "product"
                  );
                } else {
                  setLocalItems((prev) => [updatedProduct, ...prev]);
                  setVerificationFeedback(`🎉 Real-time SKU Created successfully! National ID: ${finalId} (SKU: ${finalSku}). Ready for purchase coordination.`);
                  addAuditEntry(
                    "Product Added to Catalog",
                    `Created new catalog product: '${newProdName}' with SKU: ${finalSku}, price: ${newProdPrice} INR, and initial stock: ${newProdStock} ${newProdUnit}.`,
                    "product"
                  );
                }

                setIsAddProductOpen(false);
                handleResetForm();
              }}
              className="space-y-4 text-xs font-semibold text-left"
            >
              
              {/* TAB 1: GENERAL INFO */}
              {addProductActiveTab === "general" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-500 uppercase tracking-wider text-[9px] block">Product Name <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Prime Drought-Resilient Millet Seeds"
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-500 uppercase tracking-wider text-[9px] block">Unit of Sale</label>
                      <select
                        value={newProdUnit}
                        onChange={(e) => setNewProdUnit(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
                      >
                        <option value="kg">kg (Kilogram)</option>
                        <option value="liter">liter (Liter)</option>
                        <option value="piece">piece (Individual Unit)</option>
                        <option value="pack">pack (Retail Pack)</option>
                        <option value="bag">bag (Wholesale Bag)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-500 uppercase tracking-wider text-[9px] block">Category <span className="text-rose-500">*</span></label>
                      <select
                        value={newProdCategory}
                        onChange={(e) => {
                          const cat = e.target.value;
                          setNewProdCategory(cat);
                          // Reset subcategory matching the selected category
                          const subMap: Record<string, string[]> = {
                            "Seeds": ["Wheat", "Rice", "Corn", "Vegetable", "Fruit"],
                            "Fertilizers": ["Nitrogen", "Phosphate", "Potash", "Micro-nutrients", "Bio-compost"],
                            "Pesticides": ["Insecticide", "Fungicide", "Herbicide", "Bio-pesticide"],
                            "Equipment": ["Hand tools", "Spraying machines", "Harvesting tools", "Seeding tools"],
                            "Irrigation": ["Drip tape", "Sprinkler heads", "Water pump", "Moisture valve"],
                            "Organic Inputs": ["Vermicompost", "Neem cake", "Bio-stimulants", "Organic manure"]
                          };
                          setNewProdSubCategory(subMap[cat]?.[0] || "");
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
                      >
                        <option value="Seeds">Seeds</option>
                        <option value="Fertilizers">Fertilizers</option>
                        <option value="Pesticides">Pesticides</option>
                        <option value="Equipment">Equipment</option>
                        <option value="Irrigation">Irrigation</option>
                        <option value="Organic Inputs">Organic Inputs</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-500 uppercase tracking-wider text-[9px] block">Sub-Category</label>
                      <select
                        value={newProdSubCategory}
                        onChange={(e) => setNewProdSubCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
                      >
                        {newProdCategory === "Seeds" && (
                          <>
                            <option value="Wheat">Wheat</option>
                            <option value="Rice">Rice</option>
                            <option value="Corn">Corn</option>
                            <option value="Vegetable">Vegetable</option>
                            <option value="Fruit">Fruit</option>
                          </>
                        )}
                        {newProdCategory === "Fertilizers" && (
                          <>
                            <option value="Nitrogen">Nitrogen</option>
                            <option value="Phosphate">Phosphate</option>
                            <option value="Potash">Potash</option>
                            <option value="Micro-nutrients">Micro-nutrients</option>
                            <option value="Bio-compost">Bio-compost</option>
                          </>
                        )}
                        {newProdCategory === "Pesticides" && (
                          <>
                            <option value="Insecticide">Insecticide</option>
                            <option value="Fungicide">Fungicide</option>
                            <option value="Herbicide">Herbicide</option>
                            <option value="Bio-pesticide">Bio-pesticide</option>
                          </>
                        )}
                        {newProdCategory === "Equipment" && (
                          <>
                            <option value="Hand tools">Hand tools</option>
                            <option value="Spraying machines">Spraying machines</option>
                            <option value="Harvesting tools">Harvesting tools</option>
                            <option value="Seeding tools">Seeding tools</option>
                          </>
                        )}
                        {newProdCategory === "Irrigation" && (
                          <>
                            <option value="Drip tape">Drip tape</option>
                            <option value="Sprinkler heads">Sprinkler heads</option>
                            <option value="Water pump">Water pump</option>
                            <option value="Moisture valve">Moisture valve</option>
                          </>
                        )}
                        {newProdCategory === "Organic Inputs" && (
                          <>
                            <option value="Vermicompost">Vermicompost</option>
                            <option value="Neem cake">Neem cake</option>
                            <option value="Bio-stimulants">Bio-stimulants</option>
                            <option value="Organic manure">Organic manure</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  {/* SKU Management */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-500 uppercase tracking-wider text-[9px] block">Stock Keeping Unit (SKU)</label>
                      <button
                        type="button"
                        onClick={() => {
                          const catCode = newProdCategory.slice(0, 3).toUpperCase();
                          const subCode = newProdSubCategory.slice(0, 3).toUpperCase();
                          const randNum = Math.floor(1000 + Math.random() * 9000);
                          setNewProdSku(`${catCode}-${subCode}-${randNum}`);
                        }}
                        className="text-[9.5px] text-emerald-600 hover:text-emerald-700 font-extrabold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded cursor-pointer"
                      >
                        <Sparkles className="h-3 w-3" /> Auto-Generate SKU
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter SKU Code (or leave blank to auto-generate)"
                      value={newProdSku}
                      onChange={(e) => setNewProdSku(e.target.value.toUpperCase())}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-mono text-xs focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  {/* Rich Text Editor for Description */}
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider text-[9px] block">Product Description (Rich Text Editor)</label>
                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                      {/* Rich Text Toolbar */}
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border-b border-slate-200 text-slate-600">
                        <button
                          type="button"
                          onClick={() => setNewProdDescription(prev => prev + " **Bold Text**")}
                          className="px-2 py-1 bg-white hover:bg-slate-200 rounded text-[9.5px] font-black border border-slate-200/50 cursor-pointer"
                          title="Bold Text"
                        >
                          B
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewProdDescription(prev => prev + " *Italic Text*")}
                          className="px-2 py-1 bg-white hover:bg-slate-200 rounded text-[9.5px] italic border border-slate-200/50 cursor-pointer"
                          title="Italic Text"
                        >
                          I
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewProdDescription(prev => prev + "\n• Bullet item\n")}
                          className="px-2 py-1 bg-white hover:bg-slate-200 rounded text-[9.5px] border border-slate-200/50 cursor-pointer"
                          title="Bullet List"
                        >
                          • Bullet List
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={() => setNewProdDescription("")}
                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded text-[9.5px] border border-rose-100/50 cursor-pointer"
                          title="Clear Field"
                        >
                          Clear
                        </button>
                      </div>

                      <textarea
                        rows={3}
                        placeholder="Provide details of the agricultural input (seed purity, moisture rate, chemical ratios, instructions for application)..."
                        value={newProdDescription}
                        onChange={(e) => setNewProdDescription(e.target.value)}
                        className="w-full bg-transparent px-3 py-2 text-slate-800 focus:outline-none text-xs leading-relaxed"
                      />
                    </div>

                    {/* Rich text visual preview */}
                    {newProdDescription && (
                      <div className="p-3 bg-indigo-50/50 border border-indigo-100/50 rounded-xl space-y-1">
                        <span className="text-[8px] uppercase tracking-widest text-indigo-600 font-black block">Lived Rendered Rich-Text Preview:</span>
                        <div className="text-[10px] text-slate-600 font-semibold leading-relaxed">
                          {newProdDescription.split("\n").map((line, lidx) => {
                            let content: React.ReactNode = line;
                            if (line.startsWith("•") || line.startsWith("-")) {
                              content = <li className="ml-3 mt-0.5">{line.substring(1).trim()}</li>;
                            } else {
                              // basic parsing of bold and italics
                              // Escape HTML first so typed text can never inject markup (XSS),
                              // then apply the simple bold/italic formatting below.
                              let txt = line
                                .replace(/&/g, "&amp;")
                                .replace(/</g, "&lt;")
                                .replace(/>/g, "&gt;")
                                .replace(/"/g, "&quot;");
                              // Replace **bold**
                              const boldRegex = /\*\*(.*?)\*\*/g;
                              const italicRegex = /\*(.*?)\*/g;
                              txt = txt.replace(boldRegex, "<strong>$1</strong>");
                              txt = txt.replace(italicRegex, "<em>$1</em>");
                              content = <p dangerouslySetInnerHTML={{ __html: txt }} />;
                            }
                            return <div key={lidx}>{content}</div>;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: PRICING & DISCOUNTS */}
              {addProductActiveTab === "pricing" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-500 uppercase tracking-wider text-[9px] block">National Selling Price (₹) <span className="text-rose-500">*</span></label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-500 uppercase tracking-wider text-[9px] block">Cost Price (₹) <span className="text-[8px] text-slate-400 font-normal">(for margin metrics)</span></label>
                      <input
                        type="number"
                        required
                        min={0}
                        value={newProdCostPrice}
                        onChange={(e) => setNewProdCostPrice(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-500 uppercase tracking-wider text-[9px] block">MRP (₹) <span className="text-[8px] text-slate-400 font-normal">(for discount visuals)</span></label>
                      <input
                        type="number"
                        required
                        min={0}
                        value={newProdMrp}
                        onChange={(e) => setNewProdMrp(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Financial projections preview */}
                  <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-2xl grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[8px] uppercase tracking-wider text-slate-400 block font-bold">Estimated Profit Margin</span>
                      <p className="text-emerald-700 font-extrabold text-sm mt-0.5">
                        ₹{Math.max(0, newProdPrice - newProdCostPrice)} 
                        <span className="text-[10px] font-semibold text-emerald-600 ml-1">
                          ({newProdPrice > 0 ? Math.round(((newProdPrice - newProdCostPrice) / newProdPrice) * 100) : 0}% markup)
                        </span>
                      </p>
                    </div>
                    <div>
                      <span className="text-[8px] uppercase tracking-wider text-slate-400 block font-bold">Showcased Discount Value</span>
                      <p className="text-indigo-700 font-extrabold text-sm mt-0.5">
                        {newProdMrp > newProdPrice ? Math.round(((newProdMrp - newProdPrice) / newProdMrp) * 100) : 0}% Off MRP
                        <span className="text-[9px] font-semibold text-slate-400 block">Listed below Max Retail Price</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-500 uppercase tracking-wider text-[9px] block">Minimum Order Quantity (MOQ)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newProdMoq}
                      onChange={(e) => setNewProdMoq(parseInt(e.target.value) || 1)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-emerald-600"
                    />
                    <p className="text-[8px] text-slate-400 font-semibold">Minimum units necessary for wholesale buyer shipping coordination.</p>
                  </div>

                  {/* Bulk Tier-based Pricing discounts */}
                  <div className="space-y-2">
                    <label className="text-slate-500 uppercase tracking-wider text-[9px] block">Wholesale Bulk Pricing Tiers</label>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 space-y-3">
                      {newProdBulkPricing.length === 0 ? (
                        <p className="text-[10px] text-slate-400 font-semibold">No bulk pricing tier active. Set discounts to attract agricultural cooperatives!</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                          {newProdBulkPricing.map((tier, tidx) => (
                            <div key={tidx} className="flex items-center justify-between bg-white px-3 py-1.5 rounded-xl border border-slate-150">
                              <span className="text-slate-700 font-extrabold">
                                {tier.minQty}+ units: <strong className="text-emerald-600">{tier.discount}% Off</strong>
                              </span>
                              <button
                                type="button"
                                onClick={() => setNewProdBulkPricing(newProdBulkPricing.filter((_, idx) => idx !== tidx))}
                                className="text-rose-500 hover:text-rose-700 cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add new Tier Input row */}
                      <div className="flex gap-2 items-end pt-2 border-t border-slate-200/50">
                        <div className="flex-1 space-y-1 text-left">
                          <span className="text-[8px] text-slate-400 uppercase font-black">Min Units</span>
                          <input
                            type="number"
                            id="bulkMinQtyInput"
                            placeholder="10"
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs"
                          />
                        </div>
                        <div className="flex-1 space-y-1 text-left">
                          <span className="text-[8px] text-slate-400 uppercase font-black">Discount (%)</span>
                          <input
                            type="number"
                            id="bulkDiscountInput"
                            placeholder="5"
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const mqEl = document.getElementById("bulkMinQtyInput") as HTMLInputElement;
                            const dEl = document.getElementById("bulkDiscountInput") as HTMLInputElement;
                            const mq = parseInt(mqEl?.value || "0");
                            const ds = parseInt(dEl?.value || "0");
                            if (mq > 0 && ds > 0 && ds < 100) {
                              setNewProdBulkPricing([...newProdBulkPricing, { minQty: mq, discount: ds }].sort((a,b) => a.minQty - b.minQty));
                              mqEl.value = "";
                              dEl.value = "";
                            }
                          }}
                          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-[10px] rounded-lg transition-colors cursor-pointer shrink-0"
                        >
                          + Add Tier
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: INVENTORY */}
              {addProductActiveTab === "inventory" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-500 uppercase tracking-wider text-[9px] block">Initial Stock Quantity <span className="text-rose-500">*</span></label>
                      <input
                        type="number"
                        required
                        min={0}
                        value={newProdStock}
                        onChange={(e) => setNewProdStock(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-500 uppercase tracking-wider text-[9px] block">Low Stock Alert Level</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={newProdLowStockThreshold}
                        onChange={(e) => setNewProdLowStockThreshold(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-500 uppercase tracking-wider text-[9px] block">PO Reorder Point</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={newProdReorderPoint}
                        onChange={(e) => setNewProdReorderPoint(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-2">
                    <h5 className="text-[10px] uppercase tracking-wider text-slate-700 font-extrabold flex items-center gap-1">
                      <Settings className="h-4 w-4 text-indigo-600" /> Automated Inventory Logistics
                    </h5>
                    <ul className="text-[9.5px] text-slate-500 font-semibold space-y-1.5 list-disc pl-4 leading-relaxed">
                      <li>
                        A high-alert system triggers a visual <span className="text-amber-600 font-bold">"Low Stock Warning"</span> notification if stock falls below <strong className="text-slate-700">{newProdLowStockThreshold} {newProdUnit}s</strong>.
                      </li>
                      <li>
                        An automated procurement draft (Purchase Order proposal) will trigger when stock hits <strong className="text-slate-700">{newProdReorderPoint} {newProdUnit}s</strong> to prevent supply-chain depletion.
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 4: MEDIA & CERTIFICATIONS */}
              {addProductActiveTab === "media" && (
                <div className="space-y-4 animate-fadeIn">
                  
                  {/* Images Reordering and Addition */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-500 uppercase tracking-wider text-[9px] block">Product Images (Up to 10)</label>
                      <span className="text-[8.5px] text-slate-400 font-semibold font-mono">{newProdImages.length}/10 Images</span>
                    </div>

                    {/* Horizontal scroll/list of uploaded images with Move/Reorder Buttons */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {newProdImages.map((img, idx) => (
                        <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 p-1 flex flex-col justify-between">
                          <img
                            src={img}
                            alt={`Preview ${idx + 1}`}
                            className="h-16 w-full object-cover rounded-lg"
                            referrerPolicy="no-referrer"
                          />
                          
                          {/* Image controls for reordering */}
                          <div className="flex items-center justify-between mt-1 text-[8px] bg-slate-50 rounded p-0.5">
                            <span className="font-mono text-slate-400">#{idx + 1}</span>
                            <div className="flex gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => {
                                  const arr = [...newProdImages];
                                  const temp = arr[idx];
                                  arr[idx] = arr[idx - 1];
                                  arr[idx - 1] = temp;
                                  setNewProdImages(arr);
                                }}
                                className="p-0.5 bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 rounded text-slate-600 cursor-pointer"
                                title="Move Left"
                              >
                                <ArrowUp className="h-2 w-2 transform -rotate-90" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === newProdImages.length - 1}
                                onClick={() => {
                                  const arr = [...newProdImages];
                                  const temp = arr[idx];
                                  arr[idx] = arr[idx + 1];
                                  arr[idx + 1] = temp;
                                  setNewProdImages(arr);
                                }}
                                className="p-0.5 bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 rounded text-slate-600 cursor-pointer"
                                title="Move Right"
                              >
                                <ArrowDown className="h-2 w-2 transform -rotate-90" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setNewProdImages(newProdImages.filter((_, i) => i !== idx))}
                                className="p-0.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded cursor-pointer"
                                title="Delete Image"
                              >
                                <Trash2 className="h-2.5 w-2.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Prepopulated Agriculture Options selector to quickly add realistic mock images */}
                    {newProdImages.length < 10 && (
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[9.5px] text-slate-500 font-extrabold flex items-center gap-1 shrink-0">
                          <Upload className="h-3 w-3 text-emerald-600" /> Insert Mock Agricultural Image:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {([
                            { label: "Seeds Stock", url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop" },
                            { label: "Field Sprout", url: "https://images.unsplash.com/photo-1599933333931-e4065a7fb487?w=400&auto=format&fit=crop" },
                            { label: "Organic Compost", url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&auto=format&fit=crop" },
                            { label: "Moisture Valve", url: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=400&auto=format&fit=crop" },
                            { label: "Solar Pump", url: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400&auto=format&fit=crop" }
                          ]).map((opt, oidx) => (
                            <button
                              key={oidx}
                              type="button"
                              onClick={() => {
                                if (newProdImages.includes(opt.url)) return;
                                setNewProdImages([...newProdImages, opt.url]);
                              }}
                              className="px-2 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-[8.5px] font-bold border border-slate-200 rounded transition-all cursor-pointer"
                            >
                              + {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Optional Video Upload link */}
                    <div className="space-y-1">
                      <label className="text-slate-500 uppercase tracking-wider text-[9px] block flex items-center gap-1">
                        <Video className="h-3.5 w-3.5 text-slate-400" /> Product Promo Video Link <span className="text-[8px] text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., https://agriconnect-videos.s3.amazonaws.com/millet_seeds_demo.mp4"
                        value={newProdVideo}
                        onChange={(e) => setNewProdVideo(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono text-[10px] focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Certifications Block */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-slate-500 uppercase tracking-wider text-[9px] block">Government & Organic Trust Certifications</label>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Toggle 1: Gov Approved */}
                      <label className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                        newProdGovApproved 
                          ? "bg-emerald-50/50 border-emerald-200 text-emerald-950" 
                          : "bg-slate-50/50 border-slate-200 text-slate-500"
                      }`}>
                        <input
                          type="checkbox"
                          checked={newProdGovApproved}
                          onChange={(e) => setNewProdGovApproved(e.target.checked)}
                          className="h-4 w-4 accent-emerald-600 cursor-pointer"
                        />
                        <div className="text-left leading-tight">
                          <span className="text-[10px] font-black uppercase block">Govt Approved</span>
                          <span className="text-[8.5px] font-semibold text-slate-400 block">State Mandated Trade</span>
                        </div>
                      </label>

                      {/* Toggle 2: Organic Certified */}
                      <label className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                        newProdOrganicCertified 
                          ? "bg-emerald-50/50 border-emerald-200 text-emerald-950" 
                          : "bg-slate-50/50 border-slate-200 text-slate-500"
                      }`}>
                        <input
                          type="checkbox"
                          checked={newProdOrganicCertified}
                          onChange={(e) => setNewProdOrganicCertified(e.target.checked)}
                          className="h-4 w-4 accent-emerald-600 cursor-pointer"
                        />
                        <div className="text-left leading-tight">
                          <span className="text-[10px] font-black uppercase block">Organic Cert.</span>
                          <span className="text-[8.5px] font-semibold text-slate-400 block">Eco-Safe/Non-toxic</span>
                        </div>
                      </label>

                      {/* Toggle 3: ISO Certified */}
                      <label className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                        newProdIsoCertified 
                          ? "bg-indigo-50/50 border-indigo-200 text-indigo-950" 
                          : "bg-slate-50/50 border-slate-200 text-slate-500"
                      }`}>
                        <input
                          type="checkbox"
                          checked={newProdIsoCertified}
                          onChange={(e) => setNewProdIsoCertified(e.target.checked)}
                          className="h-4 w-4 accent-indigo-600 cursor-pointer"
                        />
                        <div className="text-left leading-tight">
                          <span className="text-[10px] font-black uppercase block">ISO Certified</span>
                          <span className="text-[8.5px] font-semibold text-slate-400 block">Standard ISO 9001</span>
                        </div>
                      </label>
                    </div>

                    {/* FSSAI License File simulated upload */}
                    <div className="space-y-1.5 pt-1">
                      <label className="text-slate-500 uppercase tracking-wider text-[9px] block">FSSAI Trade / Seed Certification License Upload</label>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 text-[10px]">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                          <div>
                            {newProdFssaiLicense ? (
                              <p className="text-slate-700 font-extrabold flex items-center gap-1">
                                ✓ <span className="text-emerald-700 font-bold">{newProdFssaiLicense}</span>
                              </p>
                            ) : (
                              <p className="text-slate-400 font-semibold">No certification paper uploaded yet.</p>
                            )}
                            <span className="text-[8px] text-slate-400 font-semibold block">Accepted format: PDF, PNG up to 15MB</span>
                          </div>
                        </div>

                        <div className="flex gap-1.5">
                          {["fssai_cert_2026.pdf", "seed_germination_report_94pct.pdf"].map((mockF, mockIdx) => (
                            <button
                              key={mockIdx}
                              type="button"
                              onClick={() => {
                                setNewProdFssaiLicense(mockF);
                                setNewProdGovApproved(true);
                              }}
                              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 font-extrabold border border-slate-200 rounded-lg transition-colors cursor-pointer text-[8px]"
                            >
                              Attach {mockF.slice(0, 10)}...
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SHIPPING & PUBLISH */}
              {addProductActiveTab === "shipping" && (
                <div className="space-y-4 animate-fadeIn">
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Shipping Weight */}
                    <div className="space-y-1">
                      <label className="text-slate-500 uppercase tracking-wider text-[9px] block flex items-center gap-1">
                        <Truck className="h-3.5 w-3.5 text-slate-400" /> Weight (kg)
                      </label>
                      <input
                        type="number"
                        required
                        min={0.1}
                        step={0.1}
                        value={newProdWeight}
                        onChange={(e) => setNewProdWeight(parseFloat(e.target.value) || 1)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    {/* Dimensions L */}
                    <div className="space-y-1">
                      <label className="text-slate-500 uppercase tracking-wider text-[9px] block">Length (cm)</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={newProdDimLength}
                        onChange={(e) => setNewProdDimLength(parseInt(e.target.value) || 10)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    {/* Dimensions W */}
                    <div className="space-y-1">
                      <label className="text-slate-500 uppercase tracking-wider text-[9px] block">Width (cm)</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={newProdDimWidth}
                        onChange={(e) => setNewProdDimWidth(parseInt(e.target.value) || 10)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    {/* Dimensions H */}
                    <div className="space-y-1">
                      <label className="text-slate-500 uppercase tracking-wider text-[9px] block">Height (cm)</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={newProdDimHeight}
                        onChange={(e) => setNewProdDimHeight(parseInt(e.target.value) || 10)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Shipping Cost */}
                    <div className="space-y-1">
                      <label className="text-slate-500 uppercase tracking-wider text-[9px] block">Base Shipping Cost (₹)</label>
                      <input
                        type="number"
                        required
                        min={0}
                        value={newProdShippingCost}
                        onChange={(e) => setNewProdShippingCost(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    {/* Cost Type selection */}
                    <div className="space-y-1">
                      <label className="text-slate-500 uppercase tracking-wider text-[9px] block">Shipping Valuation Type</label>
                      <select
                        value={newProdShippingCostType}
                        onChange={(e) => setNewProdShippingCostType(e.target.value as "flat" | "calculated")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
                      >
                        <option value="flat">Flat Shipping Rate</option>
                        <option value="calculated">Calculated dynamically by Weight</option>
                      </select>
                    </div>
                  </div>

                  {/* Shipping zones checkmarks */}
                  <div className="space-y-2">
                    <label className="text-slate-500 uppercase tracking-wider text-[9px] block">Eligible Indian/International Trade Zones</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                        <input
                          type="checkbox"
                          checked={newProdShippingZones.includes("India")}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewProdShippingZones([...newProdShippingZones, "India"]);
                            } else {
                              setNewProdShippingZones(newProdShippingZones.filter(z => z !== "India"));
                            }
                          }}
                          className="h-4 w-4 accent-emerald-600 cursor-pointer"
                        />
                        <span className="text-[11px] font-bold">Domestic India (All States)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                        <input
                          type="checkbox"
                          checked={newProdShippingZones.includes("International")}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewProdShippingZones([...newProdShippingZones, "International"]);
                            } else {
                              setNewProdShippingZones(newProdShippingZones.filter(z => z !== "International"));
                            }
                          }}
                          className="h-4 w-4 accent-indigo-600 cursor-pointer"
                        />
                        <span className="text-[11px] font-bold">International Export (APEDA approved)</span>
                      </label>
                    </div>
                  </div>

                  {/* Publish Status Block */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-slate-500 uppercase tracking-wider text-[9px] block">National Ledger Publication Status</label>
                    <div className="flex gap-2">
                      {([
                        { label: "Save Draft", val: "Draft", desc: "No public sales listed", color: "hover:border-slate-300" },
                        { label: "Active Marketplace", val: "Active", desc: "Instantly tradeable online", color: "hover:border-emerald-300" },
                        { label: "Archive SKU", val: "Archived", desc: "Hidden from cooperatives", color: "hover:border-rose-300" }
                      ] as const).map((st) => (
                        <button
                          key={st.val}
                          type="button"
                          onClick={() => setNewProdPublishStatus(st.val)}
                          className={`flex-1 p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                            newProdPublishStatus === st.val
                              ? "bg-slate-900 border-slate-900 text-white shadow-md"
                              : `bg-slate-50/50 border-slate-200 text-slate-600 ${st.color}`
                          }`}
                        >
                          <span className="text-[10px] font-black uppercase tracking-wider block">{st.label}</span>
                          <span className={`text-[8.5px] font-medium block mt-0.5 ${newProdPublishStatus === st.val ? "text-slate-300" : "text-slate-400"}`}>
                            {st.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Nav Buttons Footer */}
              <div className="flex gap-2.5 pt-3.5 border-t border-slate-100">
                {addProductActiveTab !== "general" ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (addProductActiveTab === "pricing") setAddProductActiveTab("general");
                      else if (addProductActiveTab === "inventory") setAddProductActiveTab("pricing");
                      else if (addProductActiveTab === "media") setAddProductActiveTab("inventory");
                      else if (addProductActiveTab === "shipping") setAddProductActiveTab("media");
                    }}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer transition-colors"
                  >
                    Back Stage
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddProductOpen(false);
                      setAddProductActiveTab("general");
                    }}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer transition-colors"
                  >
                    Cancel Setup
                  </button>
                )}

                {addProductActiveTab !== "shipping" ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (addProductActiveTab === "general") setAddProductActiveTab("pricing");
                      else if (addProductActiveTab === "pricing") setAddProductActiveTab("inventory");
                      else if (addProductActiveTab === "inventory") setAddProductActiveTab("media");
                      else if (addProductActiveTab === "media") setAddProductActiveTab("shipping");
                    }}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-extrabold uppercase tracking-wider cursor-pointer transition-colors"
                  >
                    Next Stage
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black uppercase tracking-wider cursor-pointer shadow-md shadow-emerald-500/10"
                  >
                    Confirm & Publish SKU
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRODUCT INSPECT DETAILS MODAL & COMPREHENSIVE DETAIL WORKSPACE */}
      {selectedProductForView && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 max-w-4xl w-full shadow-2xl relative space-y-5 max-h-[92vh] overflow-y-auto text-xs font-semibold text-left">
            
            {/* Modal Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-3.5 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                  <Package className="h-6 w-6 shrink-0" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] bg-slate-100 text-slate-500 border px-2 py-0.5 rounded-full font-black uppercase font-mono tracking-wider">
                      SKU: {selectedProductForView.sku || selectedProductForView.id}
                    </span>
                    <span className={`text-[8.5px] px-2 py-0.5 rounded-full font-extrabold uppercase border ${
                      selectedProductForView.publishStatus === "Archived"
                        ? "bg-rose-50 border-rose-100 text-rose-600"
                        : selectedProductForView.publishStatus === "Draft"
                        ? "bg-slate-100 border-slate-200 text-slate-600"
                        : "bg-emerald-50 border-emerald-100 text-emerald-600"
                    }`}>
                      {selectedProductForView.publishStatus || "Active"}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-800 mt-1">{selectedProductForView.name}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedProductForView(null)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-full cursor-pointer self-start md:self-center transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* QUICK ACTIONS BAR (Section 3.3 Product Actions) */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 text-[10px]">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-slate-400 font-extrabold uppercase tracking-wider mr-1 text-[9px]">Quick SKU Actions:</span>
                
                {/* 1. Duplicate */}
                <button
                  onClick={() => {
                    // Trigger the duplication process using existing duplication flow or localItems cloning
                    const duplicatedItem = {
                      ...selectedProductForView,
                      id: `sup-${Date.now()}`,
                      sku: `SKU-DUP-${Math.floor(1000 + Math.random() * 9000)}`,
                      name: `${selectedProductForView.name} (Copy)`,
                      dateAdded: new Date().toISOString().split("T")[0]
                    };
                    setLocalItems(prev => [duplicatedItem, ...prev]);
                    setVerificationFeedback(`📋 Successfully duplicated "${selectedProductForView.name}" into a new SKU!`);
                    setSelectedProductForView(duplicatedItem);
                    setProductViewTab("overview");
                  }}
                  className="px-3 py-1.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1"
                  title="Duplicate product catalog entry"
                >
                  <Copy className="h-3.5 w-3.5" /> Duplicate Product
                </button>

                {/* 2. Archive/Publish Toggle */}
                <button
                  onClick={() => {
                    const nextStatus = selectedProductForView.publishStatus === "Archived" ? "Active" : "Archived";
                    setLocalItems(prev => prev.map(item => item.id === selectedProductForView.id ? { ...item, publishStatus: nextStatus } : item));
                    setSelectedProductForView({ ...selectedProductForView, publishStatus: nextStatus });
                    setVerificationFeedback(`📦 Successfully toggled publish status of product to ${nextStatus}.`);
                  }}
                  className={`px-3 py-1.5 border rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    selectedProductForView.publishStatus === "Archived"
                      ? "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700"
                      : "bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700"
                  }`}
                  title={selectedProductForView.publishStatus === "Archived" ? "Unarchive & publish product" : "Archive product"}
                >
                  <Archive className="h-3.5 w-3.5" /> {selectedProductForView.publishStatus === "Archived" ? "Unarchive / Publish" : "Archive Product"}
                </button>
              </div>

              {/* 3. Delete with safety confirm trigger */}
              <div>
                {deleteConfirmId === selectedProductForView.id ? (
                  <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 rounded-lg p-1 animate-fadeIn">
                    <span className="text-[9px] font-black text-rose-800 uppercase px-1.5 font-sans">Are you sure?</span>
                    <button
                      onClick={() => {
                        setLocalItems(prev => prev.filter(item => item.id !== selectedProductForView.id));
                        setVerificationFeedback(`❌ Product "${selectedProductForView.name}" deleted permanently.`);
                        setDeleteConfirmId(null);
                        setSelectedProductForView(null);
                      }}
                      className="bg-rose-600 hover:bg-rose-700 text-white rounded-md px-2 py-1 text-[9px] font-black cursor-pointer"
                    >
                      CONFIRM DELETE
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md px-2 py-1 text-[9px] font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(selectedProductForView.id)}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1"
                    title="Delete product permanently"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete Product
                  </button>
                )}
              </div>
            </div>

            {/* Detail Tabs Switching Navigation */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
              <button
                onClick={() => setProductViewTab("overview")}
                className={`px-3 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                  productViewTab === "overview"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "hover:bg-slate-50 text-slate-600"
                }`}
              >
                🔍 Overview
              </button>
              <button
                onClick={() => setProductViewTab("edit")}
                className={`px-3 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                  productViewTab === "edit"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "hover:bg-slate-50 text-slate-600"
                }`}
              >
                ✏️ Edit Specifications
              </button>
              <button
                onClick={() => setProductViewTab("sales")}
                className={`px-3 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                  productViewTab === "sales"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "hover:bg-slate-50 text-slate-600"
                }`}
              >
                📈 Sales History
              </button>
              <button
                onClick={() => setProductViewTab("reviews")}
                className={`px-3 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                  productViewTab === "reviews"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "hover:bg-slate-50 text-slate-600"
                }`}
              >
                ⭐ Customer Reviews
              </button>
              <button
                onClick={() => setProductViewTab("performance")}
                className={`px-3 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                  productViewTab === "performance"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "hover:bg-slate-50 text-slate-600"
                }`}
              >
                📊 Performance Metrics
              </button>
              <button
                onClick={() => setProductViewTab("related")}
                className={`px-3 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                  productViewTab === "related"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "hover:bg-slate-50 text-slate-600"
                }`}
              >
                🔗 Related Products
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="space-y-4">
              
              {/* TAB 1: OVERVIEW */}
              {productViewTab === "overview" && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 animate-fadeIn">
                  {/* Left Column: Visual Media */}
                  <div className="md:col-span-5 space-y-4 text-left">
                    <div className="border border-slate-150 rounded-2xl overflow-hidden bg-slate-50 p-2 space-y-2">
                      <img
                        src={selectedProductForView.images?.[0] || selectedProductForView.image || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop"}
                        alt={selectedProductForView.name}
                        className="h-44 w-full object-cover rounded-xl border"
                        referrerPolicy="no-referrer"
                      />
                      {selectedProductForView.images && selectedProductForView.images.length > 1 && (
                        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                          {selectedProductForView.images.map((img: string, idx: number) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Thumb ${idx}`}
                              className="h-11 w-11 object-cover rounded-lg border border-slate-200 cursor-pointer hover:border-indigo-500 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {selectedProductForView.video && (
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-1.5 text-[10px]">
                        <Video className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span className="text-slate-500 font-bold">Promo Video Attachment:</span>
                        <span className="font-mono text-slate-600 truncate flex-1">{selectedProductForView.video}</span>
                      </div>
                    )}

                    {/* Certifications list */}
                    <div className="space-y-2 text-left">
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">Verifications Ledger</span>
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-150 space-y-2.5">
                        <div className="flex flex-wrap gap-1.5">
                          {selectedProductForView.certifications?.govApproved ? (
                            <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-0.5">
                              ✓ Govt Approved
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-400 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                              No Govt Cert
                            </span>
                          )}
                          {selectedProductForView.certifications?.organicCertified ? (
                            <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                              ✓ Organic Certified
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-400 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                              Non-Organic
                            </span>
                          )}
                          {selectedProductForView.certifications?.isoCertified ? (
                            <span className="bg-indigo-50 border border-indigo-250 text-indigo-700 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                              ✓ ISO Standard
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-400 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                              No ISO Cert
                            </span>
                          )}
                        </div>
                        {selectedProductForView.certifications?.fssaiLicense && (
                          <div className="p-2 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center gap-1.5 text-[9.5px]">
                            <FileText className="h-4 w-4 text-indigo-500" />
                            <div>
                              <span className="text-slate-500 font-extrabold block">FSSAI / Seed License No:</span>
                              <strong className="text-indigo-950 font-black">{selectedProductForView.certifications.fssaiLicense}</strong>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Parameters Details */}
                  <div className="md:col-span-7 space-y-4 text-left">
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">Market Description</span>
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-150 text-[10px] text-slate-600 font-semibold leading-relaxed max-h-[120px] overflow-y-auto">
                        {selectedProductForView.description || "No product description provided."}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 bg-slate-50/50 p-3.5 rounded-2xl border border-slate-150">
                      <div>
                        <span className="text-[8px] uppercase font-black text-slate-400 block">Category</span>
                        <p className="text-slate-800 font-black text-[11px]">{selectedProductForView.category}</p>
                        <p className="text-[9.5px] text-slate-400 font-semibold">{selectedProductForView.subCategory || "General Input"}</p>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase font-black text-slate-400 block">Unit of Sale</span>
                        <p className="text-slate-800 font-black text-[11px]">per {selectedProductForView.unit || "unit"}</p>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase font-black text-slate-400 block">MOQ Requirement</span>
                        <p className="text-slate-800 font-black text-[11px]">{selectedProductForView.moq || 1} units</p>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase font-black text-slate-400 block">Stock & Low Limit</span>
                        <p className="text-slate-800 font-black text-[11px]">{selectedProductForView.stock} in stock</p>
                        <p className="text-[8.5px] text-slate-400 font-semibold">Low alert trigger: {selectedProductForView.lowStockThreshold || 15}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">Wholesale Pricing Structure (₹)</span>
                      <div className="grid grid-cols-3 gap-2 bg-emerald-50/20 p-3 rounded-xl border border-emerald-100">
                        <div>
                          <span className="text-[8px] text-slate-400 font-bold block uppercase">MRP Price</span>
                          <p className="font-extrabold text-slate-500 text-[11px] line-through">₹{(selectedProductForView.mrp || selectedProductForView.price * 1.5).toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-[8px] text-emerald-600 font-bold block uppercase">Selling Price</span>
                          <p className="font-black text-emerald-800 text-[12px]">₹{selectedProductForView.price.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-[8px] text-indigo-600 font-bold block uppercase">Cost Price</span>
                          <p className="font-extrabold text-indigo-800 text-[11px]">₹{(selectedProductForView.costPrice || selectedProductForView.price * 0.7).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    {selectedProductForView.bulkPricing && selectedProductForView.bulkPricing.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">Volume-Based Discount Tiers</span>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150 grid grid-cols-2 gap-2 text-[10px]">
                          {selectedProductForView.bulkPricing.map((tier: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between bg-white px-2.5 py-1 rounded-lg border border-slate-100">
                              <span className="text-slate-600 font-bold">{tier.minQty}+ units:</span>
                              <span className="text-emerald-750 font-black">{tier.discount}% discount</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedProductForView.shipping && (
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">Shipping Logistics & Physical Dimensions</span>
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150 text-[10px] space-y-1.5">
                          <div className="grid grid-cols-2 gap-2">
                            <p className="text-slate-500 font-bold">Cargo Net Weight:</p>
                            <p className="text-slate-800 font-black text-right">{selectedProductForView.shipping.weight} kg</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <p className="text-slate-500 font-bold">Dimensions (L × W × H):</p>
                            <p className="text-slate-800 font-mono text-right text-[9px]">
                              {selectedProductForView.shipping.dimensions?.length} × {selectedProductForView.shipping.dimensions?.width} × {selectedProductForView.shipping.dimensions?.height} cm
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <p className="text-slate-500 font-bold">Estimated Base Shipping:</p>
                            <p className="text-emerald-700 font-black text-right font-mono">
                              ₹{selectedProductForView.shipping.cost} ({selectedProductForView.shipping.costType === "flat" ? "Flat Rate" : "By Weight"})
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: EDIT SPECIFICATIONS (All fields from "Add New Product" are editable here) */}
              {productViewTab === "edit" && (
                <div className="bg-slate-50/50 p-4 border border-slate-100 rounded-2xl space-y-4 animate-fadeIn text-left">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h4 className="font-extrabold text-emerald-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Pencil className="h-4 w-4" /> Edit Complete SKU Field Ledger
                    </h4>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Click "Save Changes" below to submit updates</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* General Field Box */}
                    <div className="bg-white p-4 rounded-xl border border-slate-150 space-y-3">
                      <h5 className="font-bold text-slate-800 text-[10px] uppercase tracking-wider border-b pb-1.5 text-indigo-600">General Information</h5>
                      
                      <div className="space-y-1 text-left">
                        <label className="text-slate-500 uppercase font-bold text-[8.5px] tracking-wide block">Product Name *</label>
                        <input
                          type="text"
                          value={newProdName}
                          onChange={(e) => setNewProdName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1 text-left">
                          <label className="text-slate-500 uppercase font-bold text-[8.5px] block">Category</label>
                          <select
                            value={newProdCategory}
                            onChange={(e) => {
                              const cat = e.target.value;
                              setNewProdCategory(cat);
                              const subMap: Record<string, string[]> = {
                                "Seeds": ["Wheat", "Rice", "Corn", "Vegetable", "Fruit"],
                                "Fertilizers": ["Nitrogen", "Phosphate", "Potash", "Micro-nutrients", "Bio-compost"],
                                "Pesticides": ["Insecticide", "Fungicide", "Herbicide", "Bio-pesticide"],
                                "Equipment": ["Hand tools", "Spraying machines", "Harvesting tools", "Seeding tools"],
                                "Irrigation": ["Drip tape", "Sprinkler heads", "Water pump", "Moisture valve"],
                                "Organic Inputs": ["Vermicompost", "Neem cake", "Bio-stimulants", "Organic manure"]
                              };
                              setNewProdSubCategory(subMap[cat]?.[0] || "");
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[11px]"
                          >
                            <option value="Seeds">Seeds</option>
                            <option value="Fertilizers">Fertilizers</option>
                            <option value="Pesticides">Pesticides</option>
                            <option value="Equipment">Equipment</option>
                            <option value="Irrigation">Irrigation</option>
                            <option value="Organic Inputs">Organic Inputs</option>
                          </select>
                        </div>

                        <div className="space-y-1 text-left">
                          <label className="text-slate-500 uppercase font-bold text-[8.5px] block">Sub-Category</label>
                          <input
                            type="text"
                            value={newProdSubCategory}
                            onChange={(e) => setNewProdSubCategory(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[11px]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1 text-left">
                          <label className="text-slate-500 uppercase font-bold text-[8.5px] block">Custom SKU</label>
                          <input
                            type="text"
                            value={newProdSku}
                            onChange={(e) => setNewProdSku(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[11px] font-mono"
                          />
                        </div>

                        <div className="space-y-1 text-left">
                          <label className="text-slate-500 uppercase font-bold text-[8.5px] block">Unit of Sale</label>
                          <input
                            type="text"
                            value={newProdUnit}
                            onChange={(e) => setNewProdUnit(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[11px]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="text-slate-500 uppercase font-bold text-[8.5px] block">Description</label>
                        <textarea
                          rows={2}
                          value={newProdDescription}
                          onChange={(e) => setNewProdDescription(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] resize-none"
                        />
                      </div>
                    </div>

                    {/* Pricing, Discounts, MOQ Box */}
                    <div className="bg-white p-4 rounded-xl border border-slate-150 space-y-3 text-left">
                      <h5 className="font-bold text-slate-800 text-[10px] uppercase tracking-wider border-b pb-1.5 text-indigo-600">Pricing & Volume Tiers</h5>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1 text-left">
                          <label className="text-slate-500 uppercase font-bold text-[8.5px] block">MRP Price (₹)</label>
                          <input
                            type="number"
                            value={newProdMrp}
                            onChange={(e) => setNewProdMrp(parseInt(e.target.value) || 0)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[11px] font-bold"
                          />
                        </div>
                        <div className="space-y-1 text-left">
                          <label className="text-slate-500 uppercase font-bold text-[8.5px] block">Selling Price (₹)</label>
                          <input
                            type="number"
                            value={newProdPrice}
                            onChange={(e) => setNewProdPrice(parseInt(e.target.value) || 0)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[11px] font-bold text-emerald-700"
                          />
                        </div>
                        <div className="space-y-1 text-left">
                          <label className="text-slate-500 uppercase font-bold text-[8.5px] block">Cost Price (₹)</label>
                          <input
                            type="number"
                            value={newProdCostPrice}
                            onChange={(e) => setNewProdCostPrice(parseInt(e.target.value) || 0)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[11px] font-bold text-indigo-700"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1 text-left">
                          <label className="text-slate-500 uppercase font-bold text-[8.5px] block">Min Order Qty (MOQ)</label>
                          <input
                            type="number"
                            value={newProdMoq}
                            onChange={(e) => setNewProdMoq(parseInt(e.target.value) || 1)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[11px]"
                          />
                        </div>

                        <div className="space-y-1 text-left">
                          <label className="text-slate-500 uppercase font-bold text-[8.5px] block">Publication Status</label>
                          <select
                            value={newProdPublishStatus}
                            onChange={(e) => setNewProdPublishStatus(e.target.value as any)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[11px]"
                          >
                            <option value="Active">Active Marketplace</option>
                            <option value="Draft">Draft</option>
                            <option value="Archived">Archived</option>
                          </select>
                        </div>
                      </div>

                      {/* Bulk Pricing Tier Setup in edit mode */}
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-2 text-left">
                        <span className="text-[8px] uppercase tracking-wider text-slate-500 block font-bold">Wholesale Pricing Tiers:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {newProdBulkPricing.map((tier, idx) => (
                            <span key={idx} className="bg-white px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1">
                              {tier.minQty}+ units: {tier.discount}%
                              <button
                                type="button"
                                onClick={() => setNewProdBulkPricing(newProdBulkPricing.filter((_, i) => i !== idx))}
                                className="text-rose-500 hover:text-rose-700 cursor-pointer text-[8px]"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-1.5 items-center">
                          <input
                            type="number"
                            id="editBulkMin"
                            placeholder="Qty"
                            className="w-14 bg-white border rounded px-1.5 py-0.5 text-[10px]"
                          />
                          <input
                            type="number"
                            id="editBulkDisc"
                            placeholder="%"
                            className="w-14 bg-white border rounded px-1.5 py-0.5 text-[10px]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const qEl = document.getElementById("editBulkMin") as HTMLInputElement;
                              const dEl = document.getElementById("editBulkDisc") as HTMLInputElement;
                              const q = parseInt(qEl?.value || "0");
                              const d = parseInt(dEl?.value || "0");
                              if (q > 0 && d > 0 && d < 100) {
                                setNewProdBulkPricing([...newProdBulkPricing, { minQty: q, discount: d }].sort((a,b)=>a.minQty - b.minQty));
                                qEl.value = "";
                                dEl.value = "";
                              }
                            }}
                            className="bg-slate-800 hover:bg-slate-900 text-white rounded px-2 py-0.5 text-[9px] font-bold cursor-pointer"
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Stock & Physical Logistics Box */}
                    <div className="bg-white p-4 rounded-xl border border-slate-150 space-y-3 text-left">
                      <h5 className="font-bold text-slate-800 text-[10px] uppercase tracking-wider border-b pb-1.5 text-indigo-600">Stock & Logistical Footprint</h5>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1 text-left">
                          <label className="text-slate-500 uppercase font-bold text-[8.5px] block">Stock Qty *</label>
                          <input
                            type="number"
                            value={newProdStock}
                            onChange={(e) => setNewProdStock(parseInt(e.target.value) || 0)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[11px] font-bold"
                          />
                        </div>
                        <div className="space-y-1 text-left">
                          <label className="text-slate-500 uppercase font-bold text-[8.5px] block">Low Threshold</label>
                          <input
                            type="number"
                            value={newProdLowStockThreshold}
                            onChange={(e) => setNewProdLowStockThreshold(parseInt(e.target.value) || 15)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[11px]"
                          />
                        </div>
                        <div className="space-y-1 text-left">
                          <label className="text-slate-500 uppercase font-bold text-[8.5px] block">Reorder Point</label>
                          <input
                            type="number"
                            value={newProdReorderPoint}
                            onChange={(e) => setNewProdReorderPoint(parseInt(e.target.value) || 10)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[11px]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1 text-left">
                          <label className="text-slate-500 uppercase font-bold text-[8.5px] block">Weight (kg)</label>
                          <input
                            type="number"
                            step={0.1}
                            value={newProdWeight}
                            onChange={(e) => setNewProdWeight(parseFloat(e.target.value) || 1)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[11px]"
                          />
                        </div>
                        <div className="space-y-1 text-left">
                          <label className="text-slate-500 uppercase font-bold text-[8.5px] block">Base Ship Cost (₹)</label>
                          <input
                            type="number"
                            value={newProdShippingCost}
                            onChange={(e) => setNewProdShippingCost(parseInt(e.target.value) || 0)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[11px] font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5">
                        <div className="space-y-1 text-left">
                          <label className="text-slate-400 font-bold text-[8px] uppercase">L (cm)</label>
                          <input
                            type="number"
                            value={newProdDimLength}
                            onChange={(e) => setNewProdDimLength(parseInt(e.target.value) || 15)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-1.5 py-1 text-[11px]"
                          />
                        </div>
                        <div className="space-y-1 text-left">
                          <label className="text-slate-400 font-bold text-[8px] uppercase">W (cm)</label>
                          <input
                            type="number"
                            value={newProdDimWidth}
                            onChange={(e) => setNewProdDimWidth(parseInt(e.target.value) || 10)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-1.5 py-1 text-[11px]"
                          />
                        </div>
                        <div className="space-y-1 text-left">
                          <label className="text-slate-400 font-bold text-[8px] uppercase">H (cm)</label>
                          <input
                            type="number"
                            value={newProdDimHeight}
                            onChange={(e) => setNewProdDimHeight(parseInt(e.target.value) || 12)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-1.5 py-1 text-[11px]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Certifications & Media Box */}
                    <div className="bg-white p-4 rounded-xl border border-slate-150 space-y-3 text-left">
                      <h5 className="font-bold text-slate-800 text-[10px] uppercase tracking-wider border-b pb-1.5 text-indigo-600">Certifications & Media Links</h5>
                      
                      <div className="flex flex-wrap gap-3.5 py-1 bg-slate-50/50 px-2.5 rounded-lg border border-dashed border-slate-200">
                        <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                          <input
                            type="checkbox"
                            checked={newProdGovApproved}
                            onChange={(e) => setNewProdGovApproved(e.target.checked)}
                            className="h-4.5 w-4.5 accent-emerald-600"
                          />
                          <span className="text-[10px] font-bold">Gov Approved</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                          <input
                            type="checkbox"
                            checked={newProdOrganicCertified}
                            onChange={(e) => setNewProdOrganicCertified(e.target.checked)}
                            className="h-4.5 w-4.5 accent-emerald-600"
                          />
                          <span className="text-[10px] font-bold">Organic Certified</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                          <input
                            type="checkbox"
                            checked={newProdIsoCertified}
                            onChange={(e) => setNewProdIsoCertified(e.target.checked)}
                            className="h-4.5 w-4.5 accent-indigo-600"
                          />
                          <span className="text-[10px] font-bold">ISO Certified</span>
                        </label>
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="text-slate-500 uppercase font-bold text-[8.5px] block">FSSAI / Seed License Attachment Name</label>
                        <input
                          type="text"
                          value={newProdFssaiLicense}
                          onChange={(e) => setNewProdFssaiLicense(e.target.value)}
                          placeholder="e.g. FSSAI-271810238128"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[11px]"
                        />
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="text-slate-500 uppercase font-bold text-[8.5px] block">Attached Video Promo URL</label>
                        <input
                          type="text"
                          value={newProdVideo}
                          onChange={(e) => setNewProdVideo(e.target.value)}
                          placeholder="YouTube or file URL"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[11px]"
                        />
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="text-slate-500 uppercase font-bold text-[8.5px] block">Image Gallery Links (Comma Separated)</label>
                        <textarea
                          rows={2}
                          value={newProdImages.join(", ")}
                          onChange={(e) => setNewProdImages(e.target.value.split(",").map(lnk => lnk.trim()).filter(Boolean))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] font-mono resize-none leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions inside tab */}
                  <div className="flex justify-end gap-2 border-t pt-3 border-slate-200/60">
                    <button
                      type="button"
                      onClick={() => setProductViewTab("overview")}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all cursor-pointer text-xs"
                    >
                      Cancel Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newProdName.trim()) {
                          setVerificationFeedback("⚠️ Error: Product name is required!");
                          return;
                        }
                        const finalSku = newProdSku.trim() || `SKU-${newProdCategory.toUpperCase().slice(0,3)}-${selectedProductForView.id}`;
                        const updatedProduct = {
                          ...selectedProductForView,
                          name: newProdName,
                          category: newProdCategory,
                          subCategory: newProdSubCategory,
                          sku: finalSku,
                          description: newProdDescription || "No description provided.",
                          unit: newProdUnit,
                          price: newProdPrice,
                          costPrice: newProdCostPrice,
                          mrp: newProdMrp,
                          moq: newProdMoq,
                          bulkPricing: newProdBulkPricing,
                          stock: newProdStock,
                          lowStockThreshold: newProdLowStockThreshold,
                          reorderPoint: newProdReorderPoint,
                          images: newProdImages.length > 0 ? newProdImages : ["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop"],
                          image: newProdImages?.[0] || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop",
                          video: newProdVideo,
                          certifications: {
                            govApproved: newProdGovApproved,
                            organicCertified: newProdOrganicCertified,
                            isoCertified: newProdIsoCertified,
                            fssaiLicense: newProdFssaiLicense
                          },
                          shipping: {
                            weight: newProdWeight,
                            dimensions: {
                              length: newProdDimLength,
                              width: newProdDimWidth,
                              height: newProdDimHeight
                            },
                            cost: newProdShippingCost,
                            costType: newProdShippingCostType,
                            zones: newProdShippingZones
                          },
                          publishStatus: newProdPublishStatus
                        };

                        setLocalItems((prev) => prev.map((item) => item.id === selectedProductForView.id ? updatedProduct : item));
                        setSelectedProductForView(updatedProduct);
                        setVerificationFeedback(`🎉 Product SKU "${finalSku}" updated successfully!`);
                        setProductViewTab("overview");
                      }}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-emerald-600/10 text-xs"
                    >
                      Update Product Details
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: SALES HISTORY (Dynamic sales, units, revenue, transactions) */}
              {productViewTab === "sales" && (
                <div className="bg-slate-50/50 p-5 border border-slate-100 rounded-2xl space-y-4 animate-fadeIn text-left">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="font-extrabold text-indigo-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <ShoppingBag className="h-4 w-4" /> SKU Sales Ledger & Revenue Track
                    </h4>
                    <span className="text-[9px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-100 font-sans">National Wholesale Channels</span>
                  </div>

                  {/* Math Generator for simulated real values */}
                  {(() => {
                    const seed = selectedProductForView.id.charCodeAt(0) || 45;
                    const unitsSold = (seed * 3) % 210 + 45;
                    const priceVal = selectedProductForView.price || 50;
                    const revenueVal = unitsSold * priceVal;
                    const activeDirectBuyers = (seed % 12) + 4;

                    const mockSalesRows = [
                      { buyer: "Karnal Co-operative Grain Depot", qty: Math.round(unitsSold * 0.4), date: "2026-07-06", status: "Completed" },
                      { buyer: "Sukhdev Farmer Producer Org (FPO)", qty: Math.round(unitsSold * 0.3), date: "2026-07-03", status: "Completed" },
                      { buyer: "Hindustan Agro Trading Ltd", qty: Math.round(unitsSold * 0.2), date: "2026-06-28", status: "Completed" },
                      { buyer: "Satara Progressive Cooperative", qty: Math.round(unitsSold * 0.1), date: "2026-06-22", status: "Completed" }
                    ].filter(row => row.qty > 0);

                    return (
                      <div className="space-y-4 text-left">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="bg-white p-4 rounded-xl border border-slate-200/80 text-left space-y-1 shadow-2xs">
                            <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-widest block">Accumulated Units Sold</span>
                            <div className="flex items-baseline gap-2">
                              <p className="text-xl font-black text-slate-800">{unitsSold.toLocaleString()}</p>
                              <span className="text-[10px] text-slate-500 font-semibold">{selectedProductForView.unit || "units"}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
                              <div className="bg-indigo-600 h-full rounded-full" style={{ width: "68%" }}></div>
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded-xl border border-slate-200/80 text-left space-y-1 shadow-2xs">
                            <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-widest block">Total Revenue Generated</span>
                            <div className="flex items-baseline gap-1 text-emerald-750">
                              <span className="text-xs font-black">₹</span>
                              <p className="text-xl font-black">{revenueVal.toLocaleString()}</p>
                              <span className="text-[8.5px] text-slate-400 font-semibold uppercase tracking-wider ml-1">INR</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
                              <div className="bg-emerald-500 h-full rounded-full" style={{ width: "75%" }}></div>
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded-xl border border-slate-200/80 text-left space-y-1 shadow-2xs">
                            <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-widest block">Active Institutional Buyers</span>
                            <p className="text-xl font-black text-slate-800">{activeDirectBuyers} Entities</p>
                            <span className="text-[8.5px] text-slate-400 font-semibold block mt-1.5">Direct FPO & cooperative procurement agreements</span>
                          </div>
                        </div>

                        {/* Recent sales logs table */}
                        <div className="space-y-2 text-left">
                          <h5 className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Wholesale Transaction Records</h5>
                          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-150 text-[9px] text-slate-400 uppercase font-black">
                                  <th className="p-2.5">Buyer Name</th>
                                  <th className="p-2.5">Date Added</th>
                                  <th className="p-2.5 text-center">Quantity (Units)</th>
                                  <th className="p-2.5 text-right">Settlement Revenue</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                                {mockSalesRows.map((row, idx) => (
                                  <tr key={idx} className="hover:bg-slate-50/50">
                                    <td className="p-2.5 font-bold text-slate-800">{row.buyer}</td>
                                    <td className="p-2.5 font-mono text-[10px] text-slate-400">{row.date}</td>
                                    <td className="p-2.5 text-center font-extrabold">{row.qty} {selectedProductForView.unit || "units"}</td>
                                    <td className="p-2.5 text-right font-black text-emerald-750">₹{(row.qty * priceVal).toLocaleString()}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* TAB 4: CUSTOMER REVIEWS (Star statistics and reviews feed) */}
              {productViewTab === "reviews" && (
                <div className="bg-slate-50/50 p-5 border border-slate-100 rounded-2xl space-y-4 animate-fadeIn text-left">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="font-extrabold text-indigo-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-amber-500 fill-current" /> Buyer Feedback Ledger
                    </h4>
                    <span className="text-[9px] text-slate-500 font-bold">Authenticated Agronomist Rating</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start text-left">
                    {/* Stat panel left */}
                    <div className="md:col-span-4 bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-2xs">
                      <div className="text-center space-y-1">
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-black block">Weighted Rating</span>
                        <p className="text-3xl font-black text-slate-800">{selectedProductForView.rating || "4.8"}</p>
                        <div className="flex justify-center text-amber-500 gap-0.5 text-sm">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                        <p className="text-[9px] font-semibold text-slate-400">Based on 14 cooperative orders</p>
                      </div>

                      {/* Distribution block */}
                      <div className="space-y-1.5 pt-2 border-t text-[10px] text-left">
                        {[
                          { star: 5, pct: "85%", count: 12 },
                          { star: 4, pct: "10%", count: 1 },
                          { star: 3, pct: "5%", count: 1 },
                          { star: 2, pct: "0%", count: 0 },
                          { star: 1, pct: "0%", count: 0 }
                        ].map((dist) => (
                          <div key={dist.star} className="flex items-center gap-2 text-slate-500">
                            <span className="font-extrabold w-3">{dist.star}★</span>
                            <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-amber-400 h-full rounded-full" style={{ width: dist.pct }}></div>
                            </div>
                            <span className="text-[8.5px] font-mono text-slate-400 shrink-0 w-8 text-right">{dist.count} ({dist.pct})</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Feed right */}
                    <div className="md:col-span-8 space-y-3 text-left">
                      <span className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Verifiable Cooperative Testimonials</span>
                      
                      {[
                        { author: "Karan Singh, Agri Cooperative Delegate", comment: "Highly resilient. Yield outputs were recorded at 95% germination rates across Maharashtra test plots. The organic accreditation certificate was checked and cleared.", rating: 5, date: "2026-07-01", verify: "✓ Verified APEDA Buyer" },
                        { author: "Amit Patel, Wheat & Spices Farmer Producer Group", comment: "Well packaged and delivered on time via Indian Railways freight corridors. Price point is competitive with Greenfield. Will reorder next season.", rating: 4, date: "2026-06-25", verify: "✓ Verified FPO Buyer" },
                        { author: "Satish Patil, Progressive Farms Consortium", comment: "Certified ISO guidelines are visible on the product sacks. Extremely satisfied with high active nitrogen percentages.", rating: 5, date: "2026-06-12", verify: "✓ Verified Agro Buyer" }
                      ].map((rev, rIdx) => (
                        <div key={rIdx} className="bg-white p-3.5 rounded-xl border border-slate-200 text-[10px] space-y-1.5 shadow-2xs">
                          <div className="flex justify-between items-start flex-wrap gap-1">
                            <div className="space-y-0.5 text-left">
                              <h5 className="font-black text-slate-800 text-[11px]">{rev.author}</h5>
                              <span className="text-[8.5px] text-emerald-700 font-extrabold flex items-center gap-1">
                                {rev.verify}
                              </span>
                            </div>
                            <span className="text-slate-400 font-mono text-[9px]">{rev.date}</span>
                          </div>
                          
                          <div className="flex text-amber-500 text-[11px] gap-0.5">
                            {Array.from({ length: rev.rating }, (_, k) => (
                              <span key={k}>★</span>
                            ))}
                          </div>

                          <p className="text-slate-600 font-semibold leading-relaxed text-[10px]">"{rev.comment}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: PERFORMANCE METRICS (Impressions, conversion funnel, metrics cards) */}
              {productViewTab === "performance" && (
                <div className="bg-slate-50/50 p-5 border border-slate-100 rounded-2xl space-y-4 animate-fadeIn text-left">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="font-extrabold text-indigo-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <BarChart className="h-4 w-4 text-emerald-600" /> Catalog Telemetry & ML Insights
                    </h4>
                    <span className="text-[9px] text-slate-500 font-bold">Last 30-Day Active Performance Log</span>
                  </div>

                  {(() => {
                    const seed = selectedProductForView.id.charCodeAt(0) || 50;
                    const pageViews = (seed * 11) % 450 + 210;
                    const addCartRate = (((seed * 7) % 9) + 4.5);
                    const purchases = Math.round(pageViews * (addCartRate / 100) * 0.4);
                    const finalConversion = ((purchases / pageViews) * 100).toFixed(1);

                    return (
                      <div className="space-y-4 text-left">
                        {/* Summary metrics */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="bg-white p-4 rounded-xl border border-slate-250 text-left space-y-1 shadow-2xs">
                            <span className="text-[8.5px] font-bold text-slate-400 uppercase block tracking-widest">Cooperative Page Views</span>
                            <p className="text-xl font-black text-slate-800">{pageViews} Impress</p>
                            <span className="text-[8.5px] text-emerald-600 font-black flex items-center gap-0.5">
                              +14.2% vs previous period
                            </span>
                          </div>

                          <div className="bg-white p-4 rounded-xl border border-slate-250 text-left space-y-1 shadow-2xs">
                            <span className="text-[8.5px] font-bold text-slate-400 uppercase block tracking-widest">Add-To-Cart Rate</span>
                            <p className="text-xl font-black text-indigo-700">{addCartRate.toFixed(1)}%</p>
                            <span className="text-[8.5px] text-slate-400 font-semibold block">Industry average is 6.5%</span>
                          </div>

                          <div className="bg-white p-4 rounded-xl border border-slate-250 text-left space-y-1 shadow-2xs">
                            <span className="text-[8.5px] font-bold text-slate-400 uppercase block tracking-widest">Overall Conversion Rate</span>
                            <p className="text-xl font-black text-emerald-800">{finalConversion}%</p>
                            <span className="text-[8.5px] text-slate-400 font-semibold block">Ratio of visits to wholesale payments</span>
                          </div>
                        </div>

                        {/* Funnel chart visual */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-2 text-left">
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-black block mb-2">Wholesale Sales Conversion Funnel</span>
                          <div className="space-y-3 text-left">
                            {/* Level 1 */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] font-bold">
                                <span className="text-slate-500">1. Total Impressions (Unique Cooperatives)</span>
                                <span className="text-slate-800 font-mono font-black">{pageViews} Visitors (100%)</span>
                              </div>
                              <div className="bg-slate-100 h-6.5 rounded-lg overflow-hidden relative flex items-center pl-3">
                                <div className="bg-indigo-600/20 absolute inset-0 w-full"></div>
                                <span className="text-[9px] font-black text-indigo-950 z-10 font-sans">Top-of-Funnel Exposure</span>
                              </div>
                            </div>

                            {/* Level 2 */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] font-bold">
                                <span className="text-slate-500">2. Input Comparison / Add To Cart</span>
                                <span className="text-slate-850 font-mono font-black">{Math.round(pageViews * (addCartRate/100))} Actions ({addCartRate.toFixed(1)}%)</span>
                              </div>
                              <div className="bg-slate-100 h-6.5 rounded-lg overflow-hidden relative flex items-center pl-3">
                                <div className="bg-indigo-600/40 absolute inset-0" style={{ width: `${addCartRate * 3}%` }}></div>
                                <span className="text-[9px] font-black text-indigo-950 z-10 font-sans">Purchase Evaluation Stage</span>
                              </div>
                            </div>

                            {/* Level 3 */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] font-bold">
                                <span className="text-slate-500">3. Final Wholesale Payment Clearance</span>
                                <span className="text-emerald-800 font-mono font-black">{purchases} Orders ({finalConversion}%)</span>
                              </div>
                              <div className="bg-slate-100 h-6.5 rounded-lg overflow-hidden relative flex items-center pl-3">
                                <div className="bg-emerald-500/30 absolute inset-0" style={{ width: `${parseFloat(finalConversion) * 12}%` }}></div>
                                <span className="text-[9px] font-black text-emerald-950 z-10 font-sans">Fulfilled Trade Orders</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* TAB 6: RELATED PRODUCTS (Cross-sell recommendations) */}
              {productViewTab === "related" && (
                <div className="bg-slate-50/50 p-5 border border-slate-100 rounded-2xl space-y-4 animate-fadeIn text-left">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="font-extrabold text-indigo-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders className="h-4 w-4 text-emerald-600" /> Cross-Sell Recommendations & Bundle Options
                    </h4>
                    <span className="text-[9px] text-slate-500 font-bold">Cooperative Catalog Placement</span>
                  </div>

                  {(() => {
                    // Find related products in the same category (or any other category if empty)
                    const related = localItems.filter(
                      (item) => item.category === selectedProductForView.category && item.id !== selectedProductForView.id
                    ).slice(0, 3);

                    const fallbackRelated = related.length > 0 
                      ? related 
                      : localItems.filter((item) => item.id !== selectedProductForView.id).slice(0, 3);

                    if (fallbackRelated.length === 0) {
                      return (
                        <div className="text-center p-6 text-slate-400 font-bold text-left">
                          No other products available in the storefront to link. Add more SKUs to trigger ML cross-sell recommendations!
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-3 text-left">
                        <p className="text-[10px] text-slate-500 font-semibold mb-2">
                          Farmers looking at this product typically consider bundling or comparing with the following alternative inputs:
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5 text-left">
                          {fallbackRelated.map((relItem) => (
                            <div key={relItem.id} className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3 shadow-3xs hover:border-emerald-300 transition-colors text-left">
                              <div className="space-y-1.5">
                                <img
                                  src={relItem.images?.[0] || relItem.image}
                                  alt={relItem.name}
                                  className="h-20 w-full object-cover rounded-lg border"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="space-y-0.5 text-left">
                                  <h5 className="font-black text-slate-800 text-[11px] line-clamp-1">{relItem.name}</h5>
                                  <span className="text-[8px] uppercase tracking-wider text-slate-400 block font-mono font-black">{relItem.sku}</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-1 border-t text-[10px] text-left">
                                <span className="font-black text-slate-800">₹{relItem.price.toLocaleString()}</span>
                                <button
                                  onClick={() => {
                                    setSelectedProductForView(relItem);
                                    setProductViewTab("overview");
                                  }}
                                  className="px-2.5 py-1 bg-slate-900 hover:bg-emerald-600 text-white rounded font-bold cursor-pointer transition-all text-[9.5px]"
                                >
                                  Inspect Item
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedProductForView(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                Close Product Portal
              </button>
            </div>

          </div>
        </div>
      )}

      {isCustomersOpen && (
        <CustomerManager
          orders={orders}
          onClose={() => setIsCustomersOpen(false)}
        />
      )}

      {isReportsOpen && (
        <CustomReports
          orders={orders}
          products={localItems}
          onClose={() => setIsReportsOpen(false)}
        />
      )}

      {isCertificationsOpen && (
        <CertificationHub
          trustScore={trustScore}
          onClose={() => setIsCertificationsOpen(false)}
          onUpdateCertificates={(approvedCerts) => setApprovedCertificates(approvedCerts)}
        />
      )}

      {isDemandPredictorOpen && (
        <AIDemandPredictor
          onClose={() => setIsDemandPredictorOpen(false)}
        />
      )}

      {isPricingOptimizerOpen && (
        <AIPricingOptimizer
          products={localItems}
          onClose={() => setIsPricingOptimizerOpen(false)}
        />
      )}

      {isProductGeneratorOpen && (
        <AIProductGenerator
          onClose={() => setIsProductGeneratorOpen(false)}
        />
      )}

      {isChatAssistantOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-100 rounded-3xl p-1 max-w-4xl w-full shadow-2xl relative overflow-hidden flex flex-col animate-fadeIn">
            <SupplierAIChatAssistant onClose={() => setIsChatAssistantOpen(false)} />
          </div>
        </div>
      )}

      {isProfileSettingsOpen && (
        <SupplierProfileSettings
          supplierData={supplierData}
          reviewsList={reviewsList}
          approvedCertificates={approvedCertificates}
          products={localItems}
          orders={orders}
          onClose={() => setIsProfileSettingsOpen(false)}
          onUpdateProfile={(updatedData) => {
            setSupplierData(updatedData);
            localStorage.setItem("agriconnect_supplier_data", JSON.stringify(updatedData));
            addAuditEntry("Profile Settings", `Updated enterprise supplier profile details for ${updatedData.businessName}`, "product");
          }}
        />
      )}

      {/* VIEW ORDERS DRAWER/MODAL */}
      {isOrdersOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 max-w-5xl w-full h-[85vh] shadow-2xl relative flex flex-col space-y-4 overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-6 w-6 text-indigo-600 shrink-0" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-tight">Enterprise Order Management</h3>
                  <p className="text-slate-400 text-[10px] font-semibold">Track and process wholesale input demands, dispatch shipments, and manage payments</p>
                </div>
              </div>
              <button
                onClick={() => setIsOrdersOpen(false)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-full cursor-pointer transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Navigation Tabs Bar */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 shrink-0 text-xs">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setOrdersActiveTab("pipeline")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-extrabold tracking-tight transition-all cursor-pointer ${
                    ordersActiveTab === "pipeline"
                      ? "bg-white text-indigo-700 shadow-3xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Activity className="h-3.5 w-3.5 text-indigo-500" />
                  Order Pipeline
                </button>
                <button
                  onClick={() => setOrdersActiveTab("history")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-extrabold tracking-tight transition-all cursor-pointer ${
                    ordersActiveTab === "history"
                      ? "bg-white text-indigo-700 shadow-3xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5 text-emerald-500" />
                  History Logs & Exports
                </button>
                <button
                  onClick={() => setOrdersActiveTab("analytics")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-extrabold tracking-tight transition-all cursor-pointer ${
                    ordersActiveTab === "analytics"
                      ? "bg-white text-indigo-700 shadow-3xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <BarChart className="h-3.5 w-3.5 text-amber-500" />
                  Performance Analytics
                </button>
                <button
                  onClick={() => setOrdersActiveTab("returns")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-extrabold tracking-tight transition-all cursor-pointer ${
                    ordersActiveTab === "returns"
                      ? "bg-white text-indigo-700 shadow-3xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <RefreshCw className="h-3.5 w-3.5 text-rose-500" />
                  Returns & Refunds
                </button>
              </div>
              <div className="text-[10px] text-slate-400 font-extrabold uppercase bg-slate-50 border border-slate-200/60 px-2.5 py-1 rounded-lg">
                Total Orders Logged: <span className="text-indigo-600 font-black">{orders.length}</span>
              </div>
            </div>

            {ordersActiveTab === "pipeline" && (
              <>
                {/* Filters Section */}
            <div className="bg-slate-50/70 border border-slate-150 rounded-2xl p-4 shrink-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
              {/* Filter 1: Buyer / Order ID search */}
              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase text-slate-500">Search Buyer / SKU / ID</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={orderFilterBuyerName}
                    onChange={(e) => setOrderFilterBuyerName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 font-bold text-slate-700 placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Filter 2: Order Status */}
              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase text-slate-500">Order Status</label>
                <select
                  value={orderFilterStatus}
                  onChange={(e) => setOrderFilterStatus(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-700 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Filter 3: Payment Status */}
              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase text-slate-500">Payment Status</label>
                <select
                  value={orderFilterPaymentStatus}
                  onChange={(e) => setOrderFilterPaymentStatus(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-700 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="ALL">All Payments</option>
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>

              {/* Filter 4: Start Date */}
              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase text-slate-500">Start Date</label>
                <input
                  type="date"
                  value={orderFilterDateStart}
                  onChange={(e) => setOrderFilterDateStart(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1 font-bold text-slate-700 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Filter 5: End Date */}
              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase text-slate-500">End Date</label>
                <input
                  type="date"
                  value={orderFilterDateEnd}
                  onChange={(e) => setOrderFilterDateEnd(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1 font-bold text-slate-700 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Clear Filters bar */}
            {(orderFilterStatus !== "ALL" || orderFilterPaymentStatus !== "ALL" || orderFilterBuyerName || orderFilterDateStart || orderFilterDateEnd) && (
              <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2 text-[11px] font-bold text-indigo-800 shrink-0">
                <span>Filtering orders by active attributes</span>
                <button
                  onClick={() => {
                    setOrderFilterStatus("ALL");
                    setOrderFilterPaymentStatus("ALL");
                    setOrderFilterBuyerName("");
                    setOrderFilterDateStart("");
                    setOrderFilterDateEnd("");
                  }}
                  className="px-2 py-0.5 bg-white hover:bg-indigo-100 text-indigo-700 rounded border border-indigo-200 text-[10px] transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Orders Split-Pane Content */}
            <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-4">
              
              {/* Orders List Pane */}
              <div className={`flex-1 overflow-y-auto pr-1 space-y-2.5 min-w-0 ${selectedOrderForView ? "hidden md:block md:w-1/2" : "w-full"}`}>
                {filteredOrders.length === 0 ? (
                  <div className="text-center p-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs font-semibold flex flex-col items-center justify-center space-y-3 h-full">
                    <ShoppingBag className="h-8 w-8 text-slate-300 animate-bounce" />
                    <div>
                      <p className="font-extrabold text-sm text-slate-700">No Orders Matched</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Adjust your filter options to discover other inventory entries.</p>
                    </div>
                  </div>
                ) : (
                  filteredOrders.map((ord: any) => {
                    return (
                      <div
                        key={ord.id}
                        className={`p-4 rounded-2xl border transition-all text-xs text-left cursor-pointer flex flex-col justify-between gap-3 ${
                          selectedOrderForView?.id === ord.id
                            ? "bg-indigo-50/50 border-indigo-300 shadow-xs"
                            : "bg-white border-slate-200/85 hover:border-slate-350"
                        }`}
                        onClick={() => setSelectedOrderForView(ord)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-800">{ord.id}</span>
                              <span className="text-[10px] text-slate-400 font-bold">• {ord.date}</span>
                            </div>
                            <p className="font-extrabold text-slate-800 text-xs truncate max-w-[280px]">
                              {ord.productName}
                            </p>
                            <p className="text-[10px] text-slate-500 font-bold">
                              Buyer: <span className="text-slate-700 font-black">{ord.farmerName}</span> ({ord.location})
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                              ord.status === "New"
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : ord.status === "Confirmed"
                                ? "bg-blue-100 text-blue-800 border border-blue-200"
                                : ord.status === "Processing"
                                ? "bg-sky-100 text-sky-800 border border-sky-200"
                                : ord.status === "Shipped"
                                ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                                : ord.status === "Delivered"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : "bg-slate-150 text-slate-700 border border-slate-200"
                            }`}>
                              {ord.status}
                            </span>
                            <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded ${
                              ord.paymentStatus === "Paid"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-150"
                                : ord.paymentStatus === "Refunded"
                                ? "bg-rose-50 text-rose-700 border border-rose-150"
                                : "bg-amber-50 text-amber-700 border border-amber-150"
                            }`}>
                              {ord.paymentStatus}
                            </span>
                          </div>
                        </div>

                        <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-[10.5px]">
                          <div className="font-bold text-slate-500">
                            Qty: <span className="text-slate-800 font-extrabold">{ord.quantity} units</span> | Total: <span className="text-indigo-600 font-black">₹{(ord.amount * 84).toLocaleString()}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setSelectedOrderForView(ord)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-lg text-[9.5px] transition-colors border-0"
                            >
                              View Details
                            </button>
                            
                            {/* Fast Actions inside list */}
                            {ord.status === "New" && (
                              <button
                                onClick={() => {
                                  setOrders((prev: any) =>
                                    prev.map((o: any) => (o.id === ord.id ? { ...o, status: "Confirmed" } : o))
                                  );
                                  setVerificationFeedback(`✓ Order ${ord.id} has been confirmed!`);
                                }}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-lg text-[9.5px] transition-colors shadow-xs shadow-emerald-500/10 border-0 cursor-pointer"
                              >
                                Confirm
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Order Detail Inspector Pane */}
              {selectedOrderForView && (
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-5 overflow-y-auto space-y-4 text-left flex flex-col justify-between">
                  <div>
                    {/* Details Header */}
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-indigo-700 uppercase tracking-widest">Order Inspector</span>
                          <span className="text-[10px] font-bold text-slate-400">ID: {selectedOrderForView.id}</span>
                        </div>
                        <h4 className="font-black text-slate-800 text-sm mt-0.5">
                          Placed on {selectedOrderForView.date}
                        </h4>
                      </div>
                      <button
                        onClick={() => setSelectedOrderForView(null)}
                        className="p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer border-0 bg-transparent"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Quick Actions Bar (Print Invoice, Packing Slip, Contact Buyer) */}
                    <div className="flex flex-wrap items-center gap-2 py-2.5 border-b border-slate-200/60">
                      <button
                        onClick={() => setIsInvoiceOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-extrabold text-slate-700 transition-all cursor-pointer shadow-2xs shrink-0"
                      >
                        <Printer className="h-3.5 w-3.5 text-slate-500" />
                        Print Invoice
                      </button>
                      <button
                        onClick={() => setIsPackingSlipOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-extrabold text-slate-700 transition-all cursor-pointer shadow-2xs shrink-0"
                      >
                        <FileText className="h-3.5 w-3.5 text-slate-500" />
                        Print Packing Slip
                      </button>
                      <button
                        onClick={() => {
                          // Prepare default message template
                          setContactSubject(`Update on your AgriConnect Order ${selectedOrderForView.id}`);
                          setContactMessage(`Hello ${selectedOrderForView.farmerName},\n\nThis is an update regarding your order ${selectedOrderForView.id} for "${selectedOrderForView.productName}" (Qty: ${selectedOrderForView.quantity}).\n\nStatus: ${selectedOrderForView.status}\nPayment: ${selectedOrderForView.paymentStatus} (${selectedOrderForView.paymentMethod})\nLogistics: ${selectedOrderForView.courierCompany || "Pending"}\nEst. Delivery: ${selectedOrderForView.estimatedDelivery || "Pending"}\n\nPlease let us know if you have any questions.\n\nRegards,\nAgriConnect Supplier Hub`);
                          setContactSuccessAlert("");
                          setIsContactBuyerOpen(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-lg text-[10px] font-extrabold text-indigo-700 transition-all cursor-pointer shadow-2xs shrink-0"
                      >
                        <Mail className="h-3.5 w-3.5 text-indigo-600" />
                        Contact Buyer
                      </button>
                    </div>

                    {/* Timeline Milestones */}
                    <div className="py-2.5 border-b border-slate-200/60">
                      <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 block mb-2.5">
                        Fulfillment Journey
                      </span>
                      <div className="grid grid-cols-5 text-center text-[9px] font-bold text-slate-400 relative">
                        {/* Connecting Line */}
                        <div className="absolute top-2 left-10 right-10 h-0.5 bg-slate-200 -z-0"></div>
                        
                        {/* Milestones */}
                        {["New", "Confirmed", "Processing", "Shipped", "Delivered"].map((st, idx) => {
                          const stages = ["New", "Confirmed", "Processing", "Shipped", "Delivered"];
                          const currentIdx = stages.indexOf(selectedOrderForView.status);
                          const isPastOrCurrent = currentIdx >= idx && selectedOrderForView.status !== "Cancelled";
                          
                          return (
                            <div key={st} className="flex flex-col items-center relative z-10">
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black ${
                                isPastOrCurrent ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-400"
                              }`}>
                                {isPastOrCurrent ? "✓" : idx + 1}
                              </div>
                              <span className={`mt-1 truncate max-w-full ${isPastOrCurrent ? "text-indigo-700 font-extrabold" : ""}`}>
                                {st}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      
                      {selectedOrderForView.status === "Cancelled" && (
                        <div className="mt-2.5 p-2 bg-rose-50 border border-rose-100 rounded-xl text-[10.5px] font-extrabold text-rose-800 text-center">
                          ⚠️ This order was cancelled.
                        </div>
                      )}
                    </div>

                    {/* Section: Buyer & Shipping Address */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 py-3 border-b border-slate-200/60 text-[11px] leading-relaxed">
                      <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-150">
                        <span className="text-[8.5px] uppercase font-black tracking-widest text-slate-400 block mb-0.5">
                          Buyer Details
                        </span>
                        <p className="font-black text-slate-800 text-xs">
                          {selectedOrderForView.farmerName}
                        </p>
                        <p className="text-slate-600 font-bold text-[10px]">
                          🏢 {selectedOrderForView.buyerCompany || "Farmers Agro Association"}
                        </p>
                        <p className="text-slate-500 font-semibold text-[10px] mt-1">
                          📞 {selectedOrderForView.buyerContact || `+91 98450-${selectedOrderForView.id.replace("ORD-", "")}`}
                        </p>
                        <p className="text-slate-500 font-semibold text-[10px] break-all">
                          ✉️ {selectedOrderForView.buyerEmail || `buyer.${selectedOrderForView.id.toLowerCase()}@agriconnect.org`}
                        </p>
                      </div>

                      <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-150">
                        <span className="text-[8.5px] uppercase font-black tracking-widest text-slate-400 block mb-0.5">
                          Shipping Logistics
                        </span>
                        <p className="font-extrabold text-slate-750 text-xs">
                          {selectedOrderForView.location}
                        </p>
                        <p className="text-slate-500 text-[10px] font-semibold leading-normal">
                          Block C, Warehouse Row 4, Main Agri Market Yard, Near APMC Market.
                        </p>
                        <div className="pt-1 text-[10px] space-y-0.5">
                          <p className="text-slate-600 font-bold">Method: <span className="text-slate-800">{selectedOrderForView.shippingMethod || "Standard"}</span></p>
                          <p className="text-slate-600 font-bold">Courier: <span className="text-slate-800">{selectedOrderForView.courierCompany || "Delhivery Logistics"}</span></p>
                          <p className="text-slate-600 font-bold">Est. Delivery: <span className="text-indigo-600 font-extrabold">{selectedOrderForView.estimatedDelivery || "Pending"}</span></p>
                        </div>
                      </div>
                    </div>

                    {/* Section: Itemized list & financials */}
                    <div className="py-3 border-b border-slate-200/60 space-y-2 text-[11px]">
                      <span className="text-[8.5px] uppercase font-black tracking-widest text-slate-400 block">
                        Itemized Goods & Financials
                      </span>
                      <div className="bg-white rounded-xl border border-slate-150 overflow-hidden shadow-2xs">
                        {/* Table Header */}
                        <div className="bg-slate-50 border-b border-slate-100 p-2.5 grid grid-cols-12 text-[8.5px] font-black uppercase text-slate-500 text-left">
                          <div className="col-span-6">Item & SKU</div>
                          <div className="col-span-2 text-center">Price</div>
                          <div className="col-span-1 text-center">Qty</div>
                          <div className="col-span-3 text-right">Total</div>
                        </div>

                        {/* Item Row */}
                        <div className="p-3 grid grid-cols-12 items-center text-left text-xs border-b border-slate-100">
                          <div className="col-span-6 pr-2">
                            <p className="font-extrabold text-slate-800 leading-snug">{selectedOrderForView.productName}</p>
                            <p className="text-[9px] text-indigo-600 font-mono mt-0.5">{selectedOrderForView.sku || "AGR-INPUT-SKU"}</p>
                          </div>
                          <div className="col-span-2 text-center text-slate-600 font-semibold">
                            ₹{(selectedOrderForView.unitPrice * 84).toLocaleString()}
                          </div>
                          <div className="col-span-1 text-center text-slate-800 font-black">
                            {selectedOrderForView.quantity}
                          </div>
                          <div className="col-span-3 text-right text-slate-800 font-extrabold">
                            ₹{(selectedOrderForView.amount * 84).toLocaleString()}
                          </div>
                        </div>

                        {/* Subtotal, tax, shipping breakdown */}
                        <div className="p-3 bg-slate-50/50 space-y-1.5 font-bold text-slate-600 text-[10.5px]">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span className="text-slate-800">₹{(selectedOrderForView.amount * 84).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-[10px]">
                            <span className="flex items-center gap-1">Tax (GST 5%):</span>
                            <span className="text-slate-800">₹{Math.round((selectedOrderForView.amount * 84) * 0.05).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-[10px]">
                            <span>Shipping ({selectedOrderForView.shippingMethod || "Standard"}):</span>
                            <span className="text-slate-800">
                              ₹{selectedOrderForView.shippingMethod === "Express" ? "350" : "120"}
                            </span>
                          </div>
                          <div className="flex justify-between text-[10px]">
                            <span>Payment Mode:</span>
                            <span className="text-slate-800 font-extrabold uppercase">
                              {selectedOrderForView.paymentMethod || "UPI"}
                            </span>
                          </div>
                          <div className="flex justify-between text-[10px]">
                            <span>Payment Status:</span>
                            <span className={`font-black uppercase text-[9px] px-1.5 py-0.2 rounded ${
                              selectedOrderForView.paymentStatus === "Paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                            }`}>
                              {selectedOrderForView.paymentStatus}
                            </span>
                          </div>
                          
                          <div className="flex justify-between text-xs font-black text-slate-800 pt-1.5 border-t border-dashed">
                            <span>Total Settlement Value:</span>
                            <span className="text-indigo-600 text-xs font-black">
                              ₹{((selectedOrderForView.amount * 84) + Math.round((selectedOrderForView.amount * 84) * 0.05) + (selectedOrderForView.shippingMethod === "Express" ? 350 : 120)).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tracking details */}
                    {selectedOrderForView.trackingNumber && (
                      <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl mt-3 text-[11px] font-bold text-indigo-900 flex items-center gap-2">
                        <Truck className="h-4 w-4 text-indigo-600 shrink-0" />
                        <div>
                          <span>Tracking Reference: </span>
                          <span className="font-black text-slate-800">{selectedOrderForView.trackingNumber}</span>
                          <span className="text-slate-400 font-medium"> ({selectedOrderForView.courierCompany || "Logistics Partner"})</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Section: Action Triggers / Status Controls */}
                  <div className="bg-white p-3.5 border border-slate-150 rounded-xl mt-4 space-y-3 shadow-3xs">
                    <span className="text-[8.5px] uppercase font-black tracking-widest text-slate-500 block">
                      Workflow Actions Control Panel
                    </span>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Action 1: New -> Confirmed */}
                      {selectedOrderForView.status === "New" && (
                        <>
                          <button
                            onClick={() => {
                              setOrders((prev: any) =>
                                prev.map((o: any) => (o.id === selectedOrderForView.id ? { ...o, status: "Confirmed" } : o))
                              );
                              setSelectedOrderForView((prev: any) => ({ ...prev, status: "Confirmed" }));
                              setVerificationFeedback(`✓ Order ${selectedOrderForView.id} has been confirmed successfully!`);
                            }}
                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-black text-[10.5px] uppercase tracking-wide cursor-pointer transition-colors border-0"
                          >
                            Confirm Order
                          </button>
                          
                          <button
                            onClick={() => {
                              setOrders((prev: any) =>
                                prev.map((o: any) => (o.id === selectedOrderForView.id ? { ...o, status: "Cancelled" } : o))
                              );
                              setSelectedOrderForView((prev: any) => ({ ...prev, status: "Cancelled" }));
                              setVerificationFeedback(`❌ Order ${selectedOrderForView.id} has been cancelled.`);
                            }}
                            className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-black text-[10.5px] uppercase tracking-wide cursor-pointer transition-colors border-0"
                          >
                            Cancel Order
                          </button>
                        </>
                      )}

                      {/* Action 2: Confirmed -> Processing */}
                      {selectedOrderForView.status === "Confirmed" && (
                        <>
                          <button
                            onClick={() => {
                              setOrders((prev: any) =>
                                prev.map((o: any) => (o.id === selectedOrderForView.id ? { ...o, status: "Processing" } : o))
                              );
                              setSelectedOrderForView((prev: any) => ({ ...prev, status: "Processing" }));
                              setVerificationFeedback(`✓ Order ${selectedOrderForView.id} moved to Processing stage.`);
                              addAuditEntry(
                                "Order Confirmed & Processing",
                                `Order #${selectedOrderForView.id} moved to processing status. Escrow verified and inventory allocation locked.`,
                                "order"
                              );
                            }}
                            className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-black text-[10.5px] uppercase tracking-wide cursor-pointer transition-colors border-0"
                          >
                            Move to Processing
                          </button>
                          
                          <button
                            onClick={() => {
                              setOrders((prev: any) =>
                                prev.map((o: any) => (o.id === selectedOrderForView.id ? { ...o, status: "Cancelled" } : o))
                              );
                              setSelectedOrderForView((prev: any) => ({ ...prev, status: "Cancelled" }));
                              setVerificationFeedback(`❌ Order ${selectedOrderForView.id} has been cancelled.`);
                              addAuditEntry(
                                "Order Cancelled",
                                `Order #${selectedOrderForView.id} has been cancelled. Released procurement holds and updated stock reservations.`,
                                "order"
                              );
                            }}
                            className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-black text-[10.5px] uppercase tracking-wide cursor-pointer transition-colors border-0"
                          >
                            Cancel Order
                          </button>
                        </>
                      )}

                      {/* Action 3: Processing -> Shipped (requires Tracking Number) */}
                      {selectedOrderForView.status === "Processing" && (
                        <div className="w-full space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Enter logistics tracking code..."
                              value={trackingInputMap[selectedOrderForView.id] || ""}
                              onChange={(e) => setTrackingInputMap(prev => ({ ...prev, [selectedOrderForView.id]: e.target.value }))}
                              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 font-bold text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                            />
                            <button
                              onClick={() => {
                                const code = trackingInputMap[selectedOrderForView.id] || `TRK-${Math.floor(100000 + Math.random() * 900000)}-IND`;
                                setOrders((prev: any) =>
                                  prev.map((o: any) => (o.id === selectedOrderForView.id ? { ...o, status: "Shipped", trackingNumber: code, courierCompany: o.courierCompany || "Delhivery Logistics" } : o))
                                );
                                setSelectedOrderForView((prev: any) => ({ ...prev, status: "Shipped", trackingNumber: code, courierCompany: prev.courierCompany || "Delhivery Logistics" }));
                                setVerificationFeedback(`🚚 Order ${selectedOrderForView.id} has been marked as Shipped! Tracking code: ${code}`);
                                addAuditEntry(
                                  "Order Shipped",
                                  `Order #${selectedOrderForView.id} marked as Shipped. Dispatched via Delhivery Logistics with Tracking ID: ${code}.`,
                                  "order"
                                );
                              }}
                              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-black text-[10.5px] uppercase tracking-wide cursor-pointer transition-colors border-0 shrink-0"
                            >
                              Dispatch Goods
                            </button>
                          </div>
                          
                          <button
                            onClick={() => {
                              setOrders((prev: any) =>
                                prev.map((o: any) => (o.id === selectedOrderForView.id ? { ...o, status: "Cancelled" } : o))
                              );
                              setSelectedOrderForView((prev: any) => ({ ...prev, status: "Cancelled" }));
                              setVerificationFeedback(`❌ Order ${selectedOrderForView.id} has been cancelled.`);
                              addAuditEntry(
                                "Order Cancelled",
                                `Order #${selectedOrderForView.id} has been cancelled. Released procurement holds and updated stock reservations.`,
                                "order"
                              );
                            }}
                            className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-black text-[10.5px] uppercase tracking-wide cursor-pointer transition-colors border-0"
                          >
                            Cancel Order
                          </button>
                        </div>
                      )}

                      {/* Action 4: Shipped -> Delivered */}
                      {selectedOrderForView.status === "Shipped" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setOrders((prev: any) =>
                                prev.map((o: any) => (o.id === selectedOrderForView.id ? { ...o, status: "Delivered", paymentStatus: "Paid" } : o))
                              );
                              setSelectedOrderForView((prev: any) => ({ ...prev, status: "Delivered", paymentStatus: "Paid" }));
                              setVerificationFeedback(`🎉 Order ${selectedOrderForView.id} is confirmed as Delivered and payment is processed!`);
                              addAuditEntry(
                                "Order Delivered & Settled",
                                `Order #${selectedOrderForView.id} marked as Delivered. Escrow funds released to supplier vault. Payment completed.`,
                                "order"
                              );
                            }}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-black text-[10.5px] uppercase tracking-wide cursor-pointer transition-colors border-0"
                          >
                            Mark as Delivered
                          </button>
                          {selectedOrderForView.paymentStatus !== "Paid" && (
                            <button
                              onClick={() => {
                                setOrders((prev: any) =>
                                  prev.map((o: any) => (o.id === selectedOrderForView.id ? { ...o, paymentStatus: "Paid" } : o))
                                );
                                setSelectedOrderForView((prev: any) => ({ ...prev, paymentStatus: "Paid" }));
                                setVerificationFeedback(`💳 Cash on Delivery settlement received for order ${selectedOrderForView.id}!`);
                                addAuditEntry(
                                  "Order Payment Settlement Received",
                                  `Received Cash on Delivery settlement payment for Order #${selectedOrderForView.id}. Status changed to Paid.`,
                                  "order"
                                );
                              }}
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-black text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              Collect COD Payment
                            </button>
                          )}
                        </div>
                      )}

                      {/* Refund Action if Cancelled & Paid */}
                      {selectedOrderForView.status === "Cancelled" && selectedOrderForView.paymentStatus === "Paid" && (
                        <button
                          onClick={() => {
                            setOrders((prev: any) =>
                              prev.map((o: any) => (o.id === selectedOrderForView.id ? { ...o, paymentStatus: "Refunded" } : o))
                            );
                            setSelectedOrderForView((prev: any) => ({ ...prev, paymentStatus: "Refunded" }));
                            setVerificationFeedback(`💸 Refund processed for Order ${selectedOrderForView.id}! Refunded ₹${(selectedOrderForView.amount * 84).toLocaleString()}`);
                          }}
                          className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-black text-[10.5px] uppercase tracking-wide cursor-pointer transition-colors border-0"
                        >
                          Process Refund
                        </button>
                      )}

                      {/* Static status display fallback */}
                      {selectedOrderForView.status === "Delivered" && (
                        <span className="text-emerald-700 font-extrabold text-[11px] bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1">
                          ✓ Completed & Settled Successfully
                        </span>
                      )}
                      
                      {selectedOrderForView.status === "Cancelled" && selectedOrderForView.paymentStatus !== "Paid" && (
                        <span className="text-slate-500 font-extrabold text-[11px] bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg">
                          Closed (Cancelled)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>
              </>
            )}

            {(ordersActiveTab === "history" || ordersActiveTab === "analytics") && (
              <OrderHistoryAnalytics
                orders={orders}
                activeTab={ordersActiveTab}
                setFeedback={(msg) => setVerificationFeedback(msg)}
              />
            )}

            {ordersActiveTab === "returns" && (
              <ReturnsRefundsManager
                orders={orders}
                setOrders={setOrders}
                setFeedback={(msg) => setVerificationFeedback(msg)}
              />
            )}

            {/* Footer */}
            <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 shrink-0 text-xs">
              <span className="text-slate-400 font-bold">
                Total Orders Logged: <strong className="text-slate-700">{orders.length}</strong>
              </span>
              <button
                onClick={() => {
                  setIsOrdersOpen(false);
                  setSelectedOrderForView(null);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all cursor-pointer border-0"
              >
                Close Order Portal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL 1: TAX INVOICE PRINT VIEW */}
      {isInvoiceOpen && selectedOrderForView && (() => {
        // Dynamic calculations for GST compliance
        const getProductGSTDetails = (productName: string) => {
          const name = (productName || "").toLowerCase();
          if (name.includes("potato") || name.includes("seed")) {
            return { hsn: "0701", rate: 5, label: "Seeds (Seed Tubers)" };
          } else if (name.includes("fertilizer") || name.includes("compost")) {
            return { hsn: "3101", rate: 5, label: "Organic Compost / Bio-Fertilizer" };
          } else if (name.includes("pump") || name.includes("submersible")) {
            return { hsn: "8413", rate: 12, label: "Solar Agricultural Water Pump" };
          } else if (name.includes("meter") || name.includes("moisture")) {
            return { hsn: "9031", rate: 18, label: "Agricultural Moisture Sensor / Probes" };
          }
          return { hsn: "3101", rate: 5, label: "Agri Input Product" };
        };

        const gst = getProductGSTDetails(selectedOrderForView.productName);
        const isIntraState = !selectedOrderForView.location || selectedOrderForView.location.toLowerCase().includes("maharashtra") || selectedOrderForView.location.toLowerCase().includes("mumbai");
        const baseAmount = selectedOrderForView.amount * 84;
        const cgstRate = isIntraState ? gst.rate / 2 : 0;
        const sgstRate = isIntraState ? gst.rate / 2 : 0;
        const igstRate = isIntraState ? 0 : gst.rate;

        const cgstAmount = Math.round(baseAmount * (cgstRate / 100));
        const sgstAmount = Math.round(baseAmount * (sgstRate / 100));
        const igstAmount = Math.round(baseAmount * (igstRate / 100));
        const totalTax = cgstAmount + sgstAmount + igstAmount;
        const shippingCost = selectedOrderForView.shippingMethod === "Express" ? 350 : 120;
        const grandTotal = baseAmount + totalTax + shippingCost;
        
        const buyerGSTIN = isIntraState 
          ? `27AABCF${(Math.abs(selectedOrderForView.farmerName.split("").reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0)) % 90000) + 10000}D1Z5` 
          : `03AABCF${(Math.abs(selectedOrderForView.farmerName.split("").reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0)) % 90000) + 10000}D1Z5`;

        const handleSendEmail = () => {
          setIsSendingInvoiceEmail(true);
          const buyerEmail = selectedOrderForView.buyerEmail || `${selectedOrderForView.farmerName.toLowerCase().replace(/[^a-z0-9]/g, "")}@gmail.com`;
          setTimeout(() => {
            setIsSendingInvoiceEmail(false);
            setInvoiceEmailSuccessAlert(`✓ GST Tax Invoice INV-${selectedOrderForView.id.replace("ORD-", "")} successfully dispatched to buyer email: ${buyerEmail}`);
            setVerificationFeedback(`✉️ Auto-sent GST-compliant Tax Invoice to ${buyerEmail}!`);
            setTimeout(() => setInvoiceEmailSuccessAlert(""), 4000);
          }, 1500);
        };

        const triggerPDFDownload = () => {
          const printWindow = window.open("", "_blank");
          if (!printWindow) return;
          
          const html = `
            <html>
              <head>
                <title>Tax Invoice - INV-${selectedOrderForView.id.replace("ORD-", "")}</title>
                <style>
                  body { font-family: 'Inter', sans-serif; color: #1e293b; padding: 40px; line-height: 1.5; }
                  .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
                  .logo { font-size: 20px; font-weight: 800; color: #4f46e5; }
                  .title { text-align: right; }
                  .invoice-title { font-size: 24px; font-weight: 900; color: #1e1b4b; margin: 0; }
                  .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 30px; }
                  .details-box h4 { font-size: 10px; font-weight: 900; color: #64748b; margin-bottom: 8px; text-transform: uppercase; }
                  .details-box p { font-size: 12px; margin: 2px 0; font-weight: 500; }
                  table { width: 100%; border-collapse: collapse; margin-top: 40px; }
                  th { background: #f8fafc; border-bottom: 2px solid #cbd5e1; padding: 12px; font-size: 10px; font-weight: 900; color: #475569; text-align: left; }
                  td { border-bottom: 1px solid #f1f5f9; padding: 12px; font-size: 12px; font-weight: 500; }
                  .totals-container { display: flex; justify-content: flex-end; margin-top: 30px; }
                  .totals-table { width: 300px; }
                  .totals-table td { padding: 6px 12px; border: none; font-size: 12px; }
                  .totals-table .grand-total { font-size: 14px; font-weight: 900; color: #4f46e5; border-top: 1px dashed #cbd5e1; padding-top: 10px; }
                  .footer-note { text-align: center; font-size: 10px; color: #94a3b8; margin-top: 60px; border-top: 1px dashed #e2e8f0; padding-top: 20px; }
                </style>
              </head>
              <body>
                <div class="header">
                  <div>
                    <div class="logo">AgriConnect India</div>
                    <p style="font-size:11px; color:#64748b; margin: 4px 0 0 0;">Wholesale Agricultural Input Supplier Network</p>
                    <p style="font-size:11px; color:#64748b; margin:2px 0;">GSTIN: 27AABCA1212K1Z9 (Supplier)</p>
                  </div>
                  <div class="title">
                    <h1 class="invoice-title">TAX INVOICE</h1>
                    <p style="font-size:11px; margin: 6px 0 2px 0;">Invoice No: <b>INV-${selectedOrderForView.id.replace("ORD-", "")}</b></p>
                    <p style="font-size:11px; margin: 2px 0;">Order Ref: <b>${selectedOrderForView.id}</b></p>
                    <p style="font-size:11px; margin: 2px 0;">Date: <b>${selectedOrderForView.date}</b></p>
                  </div>
                </div>

                <div class="details-grid">
                  <div class="details-box">
                    <h4>Billed To (Recipient)</h4>
                    <p><b>${selectedOrderForView.farmerName}</b></p>
                    <p>${selectedOrderForView.buyerCompany || "Farmers Agro Cooperative"}</p>
                    <p>GSTIN: <b>${buyerGSTIN}</b></p>
                    <p>${selectedOrderForView.buyerContact} | ${selectedOrderForView.buyerEmail || `${selectedOrderForView.farmerName.toLowerCase().replace(/[^a-z0-9]/g, "")}@gmail.com`}</p>
                  </div>
                  <div class="details-box">
                    <h4>Shipped To (Delivery Destination)</h4>
                    <p><b>${selectedOrderForView.farmerName}</b></p>
                    <p>${selectedOrderForView.location}</p>
                    <p style="font-size:11px; color:#64748b; margin-top:5px;">Logistics Agent: Standard Surface Carrier Ltd</p>
                    <p style="font-size:11px; color:#64748b;">Method: ${selectedOrderForView.shippingMethod || "Standard"}</p>
                  </div>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>Item Description / SKU</th>
                      <th style="text-align: center;">HSN Code</th>
                      <th style="text-align: right;">Unit Price</th>
                      <th style="text-align: center;">Qty</th>
                      <th style="text-align: right;">Taxable Value</th>
                      <th style="text-align: center;">GST Rate</th>
                      <th style="text-align: right;">Total GST</th>
                      <th style="text-align: right;">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <p style="margin:0; font-weight:700;">${selectedOrderForView.productName}</p>
                        <p style="margin:2px 0 0 0; font-size:10px; color:#64748b;">SKU: ${selectedOrderForView.sku || "AGR-INPUT"}</p>
                      </td>
                      <td style="text-align: center;"><b>${gst.hsn}</b></td>
                      <td style="text-align: right;">₹${(selectedOrderForView.unitPrice * 84).toLocaleString()}</td>
                      <td style="text-align: center;"><b>${selectedOrderForView.quantity}</b></td>
                      <td style="text-align: right;">₹${baseAmount.toLocaleString()}</td>
                      <td style="text-align: center;">${gst.rate}%</td>
                      <td style="text-align: right;">₹${totalTax.toLocaleString()}</td>
                      <td style="text-align: right;"><b>₹${(baseAmount + totalTax).toLocaleString()}</b></td>
                    </tr>
                  </tbody>
                </table>

                <div class="totals-container">
                  <table class="totals-table">
                    <tr>
                      <td>Subtotal:</td>
                      <td style="text-align: right;">₹${baseAmount.toLocaleString()}</td>
                    </tr>
                    ${isIntraState ? `
                    <tr>
                      <td>CGST (${cgstRate}%):</td>
                      <td style="text-align: right;">₹${cgstAmount.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td>SGST (${sgstRate}%):</td>
                      <td style="text-align: right;">₹${sgstAmount.toLocaleString()}</td>
                    </tr>
                    ` : `
                    <tr>
                      <td>IGST (${igstRate}%):</td>
                      <td style="text-align: right;">₹${igstAmount.toLocaleString()}</td>
                    </tr>
                    `}
                    <tr>
                      <td>Shipping & Handling:</td>
                      <td style="text-align: right;">₹${shippingCost}</td>
                    </tr>
                    <tr class="grand-total">
                      <td><b>Grand Total:</b></td>
                      <td style="text-align: right; color: #4f46e5;"><b>₹${grandTotal.toLocaleString()}</b></td>
                    </tr>
                  </table>
                </div>

                <div style="margin-top: 50px; display: flex; justify-content: space-between; font-size: 11px;">
                  <div>
                    <p><b>Payment Status:</b> ${selectedOrderForView.paymentStatus.toUpperCase()} via ${selectedOrderForView.paymentMethod ? selectedOrderForView.paymentMethod.toUpperCase() : "UPI"}</p>
                  </div>
                  <div style="text-align: right; width: 250px;">
                    <div style="border-bottom: 1px solid #cbd5e1; height: 50px;"></div>
                    <p style="margin-top: 5px; font-weight: bold; color: #475569;">Authorized Signatory</p>
                  </div>
                </div>

                <div class="footer-note">
                  <p>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
                  <p style="font-size: 8px; margin-top: 10px; color: #cbd5e1;">Generated electronically by AgriConnect Supplier Hub. No physical signature required.</p>
                </div>

                <script>
                  window.onload = function() {
                    window.print();
                    setTimeout(function() { window.close(); }, 1000);
                  }
                </script>
              </body>
            </html>
          `;
          
          printWindow.document.write(html);
          printWindow.document.close();
          setVerificationFeedback(`📥 Tax Invoice PDF document generated and spooling completed!`);
        };

        return (
          <div className="fixed inset-0 z-100 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-left text-xs text-slate-700">
              {/* Action Header bar */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 sticky top-0 bg-white z-10 shrink-0">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  <span className="font-extrabold text-slate-800 text-sm">GST-Compliant Tax Invoice</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {/* Download PDF button */}
                  <button
                    onClick={triggerPDFDownload}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg text-[10px] uppercase cursor-pointer border-0 shadow-xs transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download Invoice (PDF)
                  </button>

                  {/* Send Email button */}
                  <button
                    onClick={handleSendEmail}
                    disabled={isSendingInvoiceEmail}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-extrabold rounded-lg text-[10px] uppercase cursor-pointer border-0 shadow-xs transition-colors"
                  >
                    {isSendingInvoiceEmail ? (
                      <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <Mail className="h-3.5 w-3.5" />
                    )}
                    Send to Email
                  </button>

                  {/* Close button */}
                  <button
                    onClick={() => setIsInvoiceOpen(false)}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full cursor-pointer border-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Email Send Success Alert banner */}
              {invoiceEmailSuccessAlert && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 font-semibold">
                  <span className="p-1 bg-emerald-100 rounded-full text-emerald-600">✓</span>
                  <span>{invoiceEmailSuccessAlert}</span>
                </div>
              )}

              {/* Invoice Printable Sheet */}
              <div id={`invoice-sheet-${selectedOrderForView.id}`} className="p-6 border border-slate-200 bg-white rounded-2xl shadow-inner space-y-6 printable-area font-sans">
                
                {/* Top Meta info */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="w-5 h-5 bg-indigo-600 rounded flex items-center justify-center text-white text-[10px] font-black">AC</div>
                      <span className="font-black text-slate-900 tracking-tight">AgriConnect India</span>
                    </div>
                    <p className="font-bold text-slate-750">Wholesale Input Supplier Hub</p>
                    <p className="text-slate-500 text-[10px]">Agri logistics complex, Sector 5</p>
                    <p className="text-slate-500 text-[10px]">Mumbai, Maharashtra - 400072</p>
                    <p className="text-indigo-600 font-extrabold text-[10px]">GSTIN: 27AABCA1212K1Z9 (Supplier)</p>
                  </div>

                  <div className="text-right">
                    <h2 className="text-lg font-black text-indigo-700 tracking-tight uppercase">TAX INVOICE</h2>
                    <p className="text-[10px] text-slate-500 mt-1">Invoice Number: <strong className="text-slate-800">INV-{selectedOrderForView.id.replace("ORD-", "")}</strong></p>
                    <p className="text-[10px] text-slate-500">Order Ref: <strong className="text-slate-800">{selectedOrderForView.id}</strong></p>
                    <p className="text-[10px] text-slate-500">Date: <strong className="text-slate-800">{selectedOrderForView.date}</strong></p>
                    <div className="mt-2.5">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                        selectedOrderForView.paymentStatus === "Paid" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-rose-100 text-rose-800 border border-rose-200"
                      }`}>
                        {selectedOrderForView.paymentStatus === "Paid" ? "✓ PAID & SETTLED" : "⚠️ UNPAID - COD DEMAND"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Billing vs Shipping details */}
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <div>
                    <h4 className="text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1">BILL TO (BUYER)</h4>
                    <p className="font-black text-slate-800">{selectedOrderForView.farmerName}</p>
                    <p className="font-bold text-slate-600 text-[10px]">{selectedOrderForView.buyerCompany || "Farmers Agro Cooperative"}</p>
                    <p className="text-slate-500 text-[10px] mt-1">{selectedOrderForView.buyerContact}</p>
                    <p className="text-slate-500 text-[10px] break-all">{selectedOrderForView.buyerEmail || `${selectedOrderForView.farmerName.toLowerCase().replace(/[^a-z0-9]/g, "")}@gmail.com`}</p>
                    <p className="text-indigo-600 font-extrabold text-[10px] mt-1">GSTIN: {buyerGSTIN} (Buyer)</p>
                  </div>
                  <div>
                    <h4 className="text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1">SHIP TO (DELIVERY)</h4>
                    <p className="font-black text-slate-800">{selectedOrderForView.farmerName}</p>
                    <p className="text-slate-600 font-bold text-[10px]">{selectedOrderForView.location}</p>
                    <p className="text-slate-500 text-[10px] leading-snug mt-1">
                      Block C, Warehouse Row 4, Main Agri Market Yard, Near APMC Market.
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">Logistics Method: <strong className="text-slate-700">{selectedOrderForView.shippingMethod || "Standard"}</strong></p>
                  </div>
                </div>

                {/* Items Table with HSN codes */}
                <table className="w-full text-left text-[11px] border-collapse mt-4">
                  <thead>
                    <tr className="bg-slate-50 text-[9px] font-black uppercase text-slate-500 border-b border-slate-100">
                      <th className="p-2.5 w-5/12">Item Description / SKU</th>
                      <th className="p-2.5 text-center w-2/12">HSN Code</th>
                      <th className="p-2.5 text-center w-2/12">Unit Price</th>
                      <th className="p-2.5 text-center w-1/12">Qty</th>
                      <th className="p-2.5 text-right w-2/12">Taxable Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2.5">
                        <p className="font-extrabold text-slate-800">{selectedOrderForView.productName}</p>
                        <p className="text-[9.5px] text-indigo-600 font-mono mt-0.5">SKU: {selectedOrderForView.sku || "AGR-INPUT-SKU"}</p>
                      </td>
                      <td className="p-2.5 text-center text-slate-700 font-extrabold font-mono">
                        {gst.hsn}
                      </td>
                      <td className="p-2.5 text-center text-slate-600 font-bold">
                        ₹{(selectedOrderForView.unitPrice * 84).toLocaleString()}
                      </td>
                      <td className="p-2.5 text-center text-slate-800 font-black">
                        {selectedOrderForView.quantity}
                      </td>
                      <td className="p-2.5 text-right text-slate-800 font-extrabold">
                        ₹{baseAmount.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Financial calculations block */}
                <div className="flex justify-between items-start pt-4 border-t border-slate-100 gap-4">
                  <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-lg text-[10px] text-slate-500 space-y-1">
                    <p className="font-black text-slate-700 uppercase tracking-tight">GST Tax Breakdown ({gst.label})</p>
                    <p>Total Taxable Value: <strong>₹{baseAmount.toLocaleString()}</strong></p>
                    {isIntraState ? (
                      <>
                        <p>CGST @ {cgstRate}%: <strong>₹{cgstAmount.toLocaleString()}</strong></p>
                        <p>SGST @ {sgstRate}%: <strong>₹{sgstAmount.toLocaleString()}</strong></p>
                      </>
                    ) : (
                      <p>IGST @ {igstRate}%: <strong>₹{igstAmount.toLocaleString()}</strong></p>
                    )}
                    <p>Combined GST Rate: <strong>{gst.rate}%</strong></p>
                  </div>

                  <div className="w-64 space-y-1.5 font-bold text-slate-600 text-[10.5px]">
                    <div className="flex justify-between">
                      <span>Subtotal value:</span>
                      <span className="text-slate-800">₹{baseAmount.toLocaleString()}</span>
                    </div>
                    {isIntraState ? (
                      <>
                        <div className="flex justify-between">
                          <span>CGST ({cgstRate}%):</span>
                          <span className="text-slate-800">₹{cgstAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>SGST ({sgstRate}%):</span>
                          <span className="text-slate-800">₹{sgstAmount.toLocaleString()}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between">
                        <span>IGST ({igstRate}%):</span>
                        <span className="text-slate-800">₹{igstAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping Handling:</span>
                      <span className="text-slate-800">₹{shippingCost}</span>
                    </div>
                    
                    <div className="flex justify-between text-xs font-black text-slate-900 pt-2 border-t border-dashed">
                      <span>Invoice Total Amount:</span>
                      <span className="text-indigo-600 text-sm font-black">
                        ₹{grandTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Details footer and signoff */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100 text-[10px]">
                  <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                    <p className="font-black text-slate-700">Payment Summary</p>
                    <p className="text-slate-500">Method: <strong className="text-slate-700 uppercase">{selectedOrderForView.paymentMethod || "UPI"}</strong></p>
                    <p className="text-slate-500">Transaction Date: <strong className="text-slate-700">{selectedOrderForView.date}</strong></p>
                    <p className="text-slate-500">Status: <strong className="text-slate-700 uppercase">{selectedOrderForView.paymentStatus}</strong></p>
                  </div>
                  <div className="text-right flex flex-col justify-end items-end h-full">
                    <div className="w-36 h-8 border-b border-slate-200 flex items-center justify-center text-slate-300 italic text-[11px] font-semibold">
                      AgriConnect Admin
                    </div>
                    <p className="text-[9px] text-slate-400 font-extrabold uppercase mt-1">Authorized Signatory</p>
                  </div>
                </div>

                {/* Declaration */}
                <div className="text-center text-[9px] text-slate-400 pt-4 border-t border-dashed">
                  Declaration: We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct under GST rules.
                </div>

              </div>
            </div>
          </div>
        );
      })()}

      {/* SUB-MODAL 2: PACKING SLIP VIEW */}
      {isPackingSlipOpen && selectedOrderForView && (
        <div className="fixed inset-0 z-100 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-left text-xs text-slate-700">
            {/* Action Header bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 sticky top-0 bg-white z-10 shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                <span className="font-extrabold text-slate-800 text-sm">Packing Slip & Dispatch Note</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const originalFeedback = verificationFeedback;
                    setVerificationFeedback("🖨️ Packing slip printed successfully! Ready for warehouse picker attachment.");
                    setTimeout(() => setVerificationFeedback(originalFeedback), 3000);
                    window.print();
                  }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-lg text-[10px] uppercase cursor-pointer border-0 shadow-xs"
                >
                  Print Packing Slip
                </button>
                <button
                  onClick={() => setIsPackingSlipOpen(false)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full cursor-pointer border-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Slip Printable Sheet */}
            <div className="p-6 border border-slate-200 bg-white rounded-2xl shadow-inner space-y-5 printable-area">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-black text-slate-800 text-sm">PACKING SLIP / DISPATCH NOTE</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">AgriConnect Fulfillment Network</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs font-black tracking-wide text-slate-800">PKG-{selectedOrderForView.id.replace("ORD-", "")}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">Date: {selectedOrderForView.date}</p>
                </div>
              </div>

              {/* Delivery info & carrier */}
              <div className="grid grid-cols-2 gap-4 py-2 border-b border-slate-100 text-[10.5px]">
                <div>
                  <span className="text-[8.5px] uppercase font-black text-slate-400 tracking-wider block mb-1">DELIVER TO:</span>
                  <p className="font-black text-slate-800">{selectedOrderForView.farmerName}</p>
                  <p className="font-bold text-slate-600">{selectedOrderForView.buyerCompany}</p>
                  <p className="text-slate-500 leading-snug mt-1">
                    {selectedOrderForView.location}, Block C, Warehouse Row 4, Main Agri Market Yard.
                  </p>
                  <p className="text-slate-500 mt-1">📞 {selectedOrderForView.buyerContact}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 space-y-1">
                  <span className="text-[8.5px] uppercase font-black text-slate-400 tracking-wider block mb-1">LOGISTICS ROUTING:</span>
                  <p className="font-extrabold text-slate-700">Courier: <span className="text-indigo-600">{selectedOrderForView.courierCompany || "Delhivery Logistics"}</span></p>
                  <p className="font-extrabold text-slate-700">Shipping Mode: <span className="text-slate-800">{selectedOrderForView.shippingMethod || "Standard"}</span></p>
                  <p className="font-extrabold text-slate-700">Tracking Reference: <span className="text-slate-800 font-mono">{selectedOrderForView.trackingNumber || "PENDING DISPATCH"}</span></p>
                  <p className="font-extrabold text-slate-700">Est. Delivery Date: <span className="text-slate-800">{selectedOrderForView.estimatedDelivery || "Pending"}</span></p>
                </div>
              </div>

              {/* Item checklist for picker */}
              <div className="space-y-2">
                <span className="text-[8.5px] uppercase font-black text-slate-400 tracking-wider block">WAREHOUSE PICK CHECKLIST:</span>
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                  <div className="bg-slate-50 p-2.5 grid grid-cols-12 text-[8.5px] font-black uppercase text-slate-500">
                    <div className="col-span-8">Product Name & SKU</div>
                    <div className="col-span-2 text-center">Ordered Qty</div>
                    <div className="col-span-2 text-center">Pick Status</div>
                  </div>
                  
                  <div className="p-3.5 grid grid-cols-12 items-center text-xs">
                    <div className="col-span-8">
                      <p className="font-extrabold text-slate-800 leading-snug">{selectedOrderForView.productName}</p>
                      <p className="text-[9px] text-slate-400 font-mono mt-0.5">SKU: {selectedOrderForView.sku || "AGR-INPUT-SKU"}</p>
                    </div>
                    <div className="col-span-2 text-center font-black text-slate-700">
                      {selectedOrderForView.quantity} units
                    </div>
                    <div className="col-span-2 flex justify-center items-center gap-1 text-[9.5px] font-black text-slate-400">
                      <div className="w-4 h-4 border border-slate-300 rounded flex items-center justify-center font-black text-indigo-600 text-xs bg-white">✓</div>
                      <span>Verified</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checklist verification tasks */}
              <div className="bg-slate-50/50 p-3 rounded-xl border border-dashed border-slate-200 text-[10px] space-y-1 text-slate-500 font-bold">
                <p className="text-slate-700 font-black text-[10.5px] mb-1">Fulfillment Verification Instructions:</p>
                <div className="flex items-center gap-1.5">
                  <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-0 cursor-pointer" />
                  <span>Goods inspected for defects or quality seal breaks prior to dispatch package.</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-0 cursor-pointer" />
                  <span>A-Grade agricultural batch cert matching SKU attached to shipment document.</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-0 cursor-pointer" />
                  <span>Protected bubble packing seal added for electronic items / heavy meters.</span>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-4 pt-6 text-[10px]">
                <div>
                  <div className="w-32 h-6 border-b border-slate-200 flex items-center justify-center text-slate-300 italic">
                    Warehouse staff
                  </div>
                  <p className="text-[8.5px] text-slate-400 font-extrabold uppercase mt-1">Packed By</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="w-32 h-6 border-b border-slate-200"></div>
                  <p className="text-[8.5px] text-slate-400 font-extrabold uppercase mt-1">Dispatched Stamp</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL 3: CONTACT BUYER DIALOG */}
      {isContactBuyerOpen && selectedOrderForView && (
        <div className="fixed inset-0 z-100 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl relative text-left text-xs text-slate-700">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-indigo-600" />
                <span className="font-extrabold text-slate-800 text-sm">Contact Buyer: {selectedOrderForView.farmerName}</span>
              </div>
              <button
                onClick={() => setIsContactBuyerOpen(false)}
                className="p-1 hover:bg-slate-100 text-slate-500 rounded-full cursor-pointer border-0 bg-transparent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {contactSuccessAlert ? (
              <div className="space-y-4 py-4 text-center">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold animate-pulse">
                  ✓
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-800 text-sm">Message Sent Successfully!</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed px-4">{contactSuccessAlert}</p>
                </div>
                <button
                  onClick={() => setIsContactBuyerOpen(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs cursor-pointer border-0 mt-2"
                >
                  Close Contact Panel
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Select Channel */}
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 block">Communication Channel</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: "email", label: "Email Dispatch", icon: Mail },
                      { key: "sms", label: "Mobile SMS", icon: Smartphone },
                      { key: "whatsapp", label: "WhatsApp Chat", icon: MessageSquare }
                    ].map((ch) => {
                      const Icon = ch.icon;
                      const isActive = contactChannel === ch.key;
                      return (
                        <button
                          key={ch.key}
                          onClick={() => {
                            setContactChannel(ch.key as any);
                            if (ch.key === "sms" || ch.key === "whatsapp") {
                              setContactSubject(""); // Not used
                            } else {
                              setContactSubject(`Update on your AgriConnect Order ${selectedOrderForView.id}`);
                            }
                          }}
                          className={`p-3.5 border rounded-xl flex flex-col items-center gap-1.5 text-center transition-all cursor-pointer ${
                            isActive
                              ? "bg-indigo-50/50 border-indigo-400 text-indigo-700"
                              : "bg-white border-slate-200 hover:bg-slate-50 text-slate-500"
                          }`}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="text-[10px] font-black uppercase tracking-tight">{ch.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Subject (only for Email) */}
                {contactChannel === "email" && (
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-black text-slate-400 block">Email Subject Line</label>
                    <input
                      type="text"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-bold text-slate-750 focus:outline-none focus:border-indigo-500 text-xs"
                    />
                  </div>
                )}

                {/* Message draft body */}
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black text-slate-400 block">Message Content Draft</label>
                  <textarea
                    rows={6}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-750 focus:outline-none focus:border-indigo-500 text-xs leading-relaxed"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setIsContactBuyerOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-all border-0 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setIsContactSending(true);
                      setTimeout(() => {
                        setIsContactSending(false);
                        const dest = contactChannel === "email" ? selectedOrderForView.buyerEmail : selectedOrderForView.buyerContact;
                        setContactSuccessAlert(`Successfully dispatched message regarding Order ${selectedOrderForView.id} to ${selectedOrderForView.farmerName} (${dest}) via ${contactChannel.toUpperCase()}.`);
                      }, 1000);
                    }}
                    disabled={isContactSending || !contactMessage.trim()}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl font-extrabold transition-all border-0 cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    {isContactSending ? "Sending Alert..." : `Send via ${contactChannel.toUpperCase()}`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
