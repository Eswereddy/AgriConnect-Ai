import React, { useState, useEffect } from "react";
import {
  Building2, ThermometerSnowflake, Layers, Activity, Plus, Search, Filter, Check, X,
  FileText, MapPin, TrendingUp, DollarSign, Users, Settings, ShieldCheck, Award,
  Navigation, Clock, Sparkles, Upload, Download, AlertTriangle, Volume2, Mic, Send,
  Sliders, Bell, Mail, BookOpen, HeartHandshake, UserCheck, FileSpreadsheet, Play,
  Pause, RefreshCw, Star, ArrowRight, CheckCircle, HelpCircle, Eye, Trash2, Edit3,
  BarChart2, PieChart as PieChartIcon, ShieldAlert, Zap, Cpu, Calendar, ChevronRight,
  Printer, QrCode, Lock, LogOut, CheckSquare, Droplets, Wind, Gauge, Scale, Box
} from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { WarehouseSilo, UserRole } from "../../types";

// 10 Supported Languages
const LANGUAGES = ["English", "Telugu", "Hindi", "Tamil", "Kannada", "Marathi", "Gujarati", "Bengali", "Punjabi", "Malayalam"];

// Translation dictionary
const T: Record<string, Record<string, string>> = {
  English: {
    portalTitle: "AgriConnect Warehouse Portal",
    subtitle: "Complete Post-Harvest Storage, Cold Chain Integrity & Inventory Network",
    dashboard: "Dashboard",
    onboarding: "Onboarding & Auth",
    warehouses: "Warehouse Setup",
    bookings: "Storage Bookings",
    inventory: "Inventory & FEFO",
    coldChain: "Cold Chain IoT",
    inspections: "Quality Inspections",
    revenue: "Revenue & Billing",
    customers: "Customers & Reviews",
    aiCopilot: "AI Assistant",
    settings: "Settings & Profile",
    trustScore: "Trust Score",
    goldVerified: "Gold Certified Operator",
    activeWarehouses: "Active Warehouses",
    totalCapacity: "Total Capacity",
    usedCapacity: "Occupied Capacity",
    occupancyRate: "Occupancy Rate",
    monthlyRevenue: "Monthly Revenue (₹)",
    activeBookings: "Active Bookings"
  },
  Hindi: {
    portalTitle: "एग्रीकनेक्ट वेयरहाउस पोर्टल",
    subtitle: "संपूर्ण कटाई के बाद भंडारण, कोल्ड चेन और इन्वेंटरी नेटवर्क",
    dashboard: "डैशबोर्ड",
    onboarding: "ऑनबोर्डिंग और प्रमाणीकरण",
    warehouses: "वेयरहाउस प्रबंधन",
    bookings: "भंडारण बुकिंग",
    inventory: "इन्वेंटरी और FEFO",
    coldChain: "कोल्ड चेन IoT",
    inspections: "गुणवत्ता निरीक्षण",
    revenue: "राजस्व और बिलिंग",
    customers: "ग्राहक और समीक्षाएं",
    aiCopilot: "एआई सहायक",
    settings: "सेटिंग्स और प्रोफ़ाइल",
    trustScore: "विश्वास स्कोर",
    goldVerified: "गोल्ड प्रमाणित संचालक",
    activeWarehouses: "सक्रिय वेयरहाउस",
    totalCapacity: "कुल क्षमता",
    usedCapacity: "उपयोग की गई क्षमता",
    occupancyRate: "उपयोग दर",
    monthlyRevenue: "मासिक राजस्व (₹)",
    activeBookings: "सक्रिय बुकिंग"
  },
  Telugu: {
    portalTitle: "అగ్రి కనెక్ట్ వేర్‌హౌస్ పోర్టల్",
    subtitle: "పూర్తి పంట అనంతర నిల్వ, కోల్డ్ చైన్ ఐఓటీ మరియు ఇన్వెంటరీ నెట్‌వర్క్",
    dashboard: "డాష్‌బోర్డ్",
    onboarding: "ఆన్‌బోర్డింగ్ & ప్రామాణీకరణ",
    warehouses: "వేర్‌హౌస్ నిర్వహణ",
    bookings: "స్టోరేజ్ బుకింగ్‌లు",
    inventory: "ఇన్వెంటరీ & FEFO",
    coldChain: "కోల్డ్ చైన్ IoT",
    inspections: "నాణ్యతా తనిఖీలు",
    revenue: "ఆదాయం & బిల్లింగ్",
    customers: "వినియోగదారులు & సమీక్షలు",
    aiCopilot: "AI సహాయకుడు",
    settings: "సెట్టింగ్‌లు & ప్రొఫైల్",
    trustScore: "నమ్మకం స్కోరు",
    goldVerified: "గోల్డ్ ధృవీకరించబడిన ఆపరేటర్",
    activeWarehouses: "క్రియాశీల వేర్‌హౌస్‌లు",
    totalCapacity: "మొత్తం సామర్థ్యం",
    usedCapacity: "వాడిన సామర్థ్యం",
    occupancyRate: "ఆక్రమణ రేటు",
    monthlyRevenue: "నెలవారీ ఆదాయం (₹)",
    activeBookings: "యాక్టివ్ బుకింగ్‌లు"
  }
};

interface WarehouseOperatorPortalProps {
  activeRole?: UserRole;
  silos?: WarehouseSilo[];
  onUpdateSilo?: (id: string, updated: Partial<WarehouseSilo>) => void;
}

export default function WarehouseOperatorPortal({
  silos = [],
  onUpdateSilo
}: WarehouseOperatorPortalProps) {
  // Global App States
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [lang, setLang] = useState<string>("English");
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<number>(3);
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);

  // Operator Data
  const [operatorProfile, setOperatorProfile] = useState({
    name: "Rajesh Sharma",
    companyName: "Apex Cold Chain & Logistics Pvt Ltd",
    gstNumber: "07AAAAA0000A1Z5",
    panNumber: "ABCDE1234F",
    businessType: "Private Limited",
    yearsInOperation: 8,
    serviceAreas: ["Andhra Pradesh", "Haryana", "Delhi-NCR", "Rajasthan"],
    mobile: "+91 98765 43210",
    email: "rajesh@apexcoldchain.in",
    address: "Plot 42, Focal Point Industrial Area, Guntur, Andhra Pradesh",
    trustScore: 94,
    badge: "Gold",
    verificationStatus: "Verified"
  });

  // Onboarding Wizard State
  const [onboardingStep, setOnboardingStep] = useState<number>(4); // 1-4
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [loginPhone, setLoginPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(60);

  // Warehouses List State
  const [warehouses, setWarehouses] = useState([
    {
      id: "WH-101",
      name: "Apex Guntur Cold Depot & Silo",
      type: "Cold Storage",
      address: "Industrial Area Phase-2, Guntur, Andhra Pradesh",
      gps: "30.9010° N, 75.8573° E",
      totalCapacityTons: 5000,
      usedCapacityTons: 3800,
      availableCapacityTons: 1200,
      buildingAreaSqFt: 25000,
      baysCount: 8,
      ceilingHeightM: 7.5,
      floorType: "Epoxy Coated Anti-Slip Concrete",
      yearBuilt: 2018,
      tempRange: "-5°C to +12°C",
      humidityRange: "45% to 90% RH",
      hasVentilation: true,
      hasPestControl: true,
      hasFireSafety: true,
      hasCCTV: true,
      hasSecurity247: true,
      loadingDocks: 4,
      forklifts: 3,
      rackingSystem: true,
      weighingScaleTons: 60,
      storageRatePerTonDay: 45, // ₹
      coldStorageRatePerTonDay: 85, // ₹
      status: "Active",
      rating: 4.8,
      certifiedExport: true,
      fssaiLicense: "FSSAI-10019082726",
      fireSafetyCert: "FIRE-2025-LUD-991"
    },
    {
      id: "WH-102",
      name: "Apex Vijayawada Grain Terminal & Controlled Atmosphere",
      type: "Controlled Atmosphere Storage",
      address: "GT Road Near APMC Yard, Vijayawada, Andhra Pradesh",
      gps: "16.5062° N, 80.6480° E",
      totalCapacityTons: 8000,
      usedCapacityTons: 6200,
      availableCapacityTons: 1800,
      buildingAreaSqFt: 40000,
      baysCount: 12,
      ceilingHeightM: 9.0,
      floorType: "Heavy Industrial Concrete",
      yearBuilt: 2021,
      tempRange: "0°C to +15°C",
      humidityRange: "40% to 80% RH",
      hasVentilation: true,
      hasPestControl: true,
      hasFireSafety: true,
      hasCCTV: true,
      hasSecurity247: true,
      loadingDocks: 6,
      forklifts: 5,
      rackingSystem: true,
      weighingScaleTons: 100,
      storageRatePerTonDay: 50,
      coldStorageRatePerTonDay: 110,
      status: "Active",
      rating: 4.9,
      certifiedExport: true,
      fssaiLicense: "FSSAI-10020082911",
      fireSafetyCert: "FIRE-2025-ASR-442"
    },
    {
      id: "WH-103",
      name: "Apex Machilipatnam Dry Grain Silo Complex",
      type: "Silo",
      address: "Bypass Road, Machilipatnam, Andhra Pradesh",
      gps: "32.0410° N, 75.4053° E",
      totalCapacityTons: 12000,
      usedCapacityTons: 11200,
      availableCapacityTons: 800,
      buildingAreaSqFt: 55000,
      baysCount: 6,
      ceilingHeightM: 18.0,
      floorType: "Reinforced Silo Base",
      yearBuilt: 2022,
      tempRange: "Ambient",
      humidityRange: "30% to 60% RH",
      hasVentilation: true,
      hasPestControl: true,
      hasFireSafety: true,
      hasCCTV: true,
      hasSecurity247: true,
      loadingDocks: 4,
      forklifts: 2,
      rackingSystem: false,
      weighingScaleTons: 120,
      storageRatePerTonDay: 25,
      coldStorageRatePerTonDay: 0,
      status: "Full",
      rating: 4.7,
      certifiedExport: false,
      fssaiLicense: "FSSAI-10022082100",
      fireSafetyCert: "FIRE-2025-GDP-109"
    }
  ]);

  // Selected Warehouse for Detail View / Edit
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>("WH-101");
  const selectedWarehouse = warehouses.find(w => w.id === selectedWarehouseId) || warehouses[0];
  const [showAddWarehouseModal, setShowAddWarehouseModal] = useState<boolean>(false);
  const [showWarehouseDetailModal, setShowWarehouseDetailModal] = useState<boolean>(false);

  // Warehouse Form State
  const [newWhName, setNewWhName] = useState("");
  const [newWhType, setNewWhType] = useState<any>("Cold Storage");
  const [newWhAddress, setNewWhAddress] = useState("");
  const [newWhCapacity, setNewWhCapacity] = useState(2500);
  const [newWhStorageRate, setNewWhStorageRate] = useState(40);
  const [newWhColdRate, setNewWhColdRate] = useState(80);

  // Storage Bookings State
  const [bookings, setBookings] = useState([
    {
      id: "BK-8801",
      customerName: "Harpreet Singh (Andhra Pradesh Co-op)",
      customerType: "Farmer",
      mobile: "+91 98123 45678",
      cropName: "Premium Basmati Rice Grade-A",
      quantityTons: 250,
      storageType: "Cold Storage",
      warehouseId: "WH-101",
      warehouseName: "Apex Guntur Cold Depot & Silo",
      startDate: "2026-07-20",
      endDate: "2026-10-20",
      durationDays: 92,
      budgetRupees: 195500,
      status: "Active",
      assignedBay: "Chamber 2B",
      paymentStatus: "Paid",
      specialInstructions: "Maintain temperature between 3°C - 5°C. Aerate twice weekly."
    },
    {
      id: "BK-8802",
      customerName: "AgriExport Global Traders",
      customerType: "Buyer",
      mobile: "+91 99887 66554",
      cropName: "Fresh Red Organic Tomatoes",
      quantityTons: 120,
      storageType: "Cold Storage",
      warehouseId: "WH-102",
      warehouseName: "Apex Vijayawada Grain Terminal",
      startDate: "2026-07-22",
      endDate: "2026-08-22",
      durationDays: 31,
      budgetRupees: 316200,
      status: "Pending",
      assignedBay: "Unassigned",
      paymentStatus: "Unpaid",
      specialInstructions: "Ethylene gas control required below 1.0 ppm."
    },
    {
      id: "BK-8803",
      customerName: "Kisan Producer Company Ltd",
      customerType: "Supplier",
      mobile: "+91 97766 55443",
      cropName: "Sharbati Durum Wheat",
      quantityTons: 500,
      storageType: "Silo",
      warehouseId: "WH-103",
      warehouseName: "Apex Machilipatnam Dry Grain Silo Complex",
      startDate: "2026-05-10",
      endDate: "2026-11-10",
      durationDays: 184,
      budgetRupees: 230000,
      status: "Active",
      assignedBay: "Silo Tower 1",
      paymentStatus: "Paid",
      specialInstructions: "Check grain moisture weekly. Keep below 12%."
    },
    {
      id: "BK-8799",
      customerName: "Guntur Flour Mills",
      customerType: "Buyer",
      mobile: "+91 94111 22334",
      cropName: "Maize / Yellow Corn",
      quantityTons: 300,
      storageType: "Dry Warehouse",
      warehouseId: "WH-101",
      warehouseName: "Apex Guntur Cold Depot & Silo",
      startDate: "2026-04-01",
      endDate: "2026-07-01",
      durationDays: 91,
      budgetRupees: 109200,
      status: "Completed",
      assignedBay: "Bay 4",
      paymentStatus: "Paid",
      ratingGiven: 5
    }
  ]);

  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [bookingFilter, setBookingFilter] = useState<string>("All");

  // Inventory Batches State
  const [batches, setBatches] = useState([
    {
      batchNo: "BAT-2026-001",
      productName: "Premium Basmati Rice",
      warehouseId: "WH-101",
      warehouseName: "Apex Guntur Cold Depot",
      bayRoom: "Chamber 2B",
      quantityTons: 250,
      receiptDate: "2026-07-20",
      expiryDate: "2027-01-20",
      daysToExpiry: 184,
      fefoRank: 3,
      qualityGrade: "Grade A+",
      customerName: "Harpreet Singh",
      moisturePercent: 11.4,
      tempCelsius: 4.2,
      humidityPercent: 62,
      status: "In Storage",
      qrCodeUrl: "QR-BAT-2026-001"
    },
    {
      batchNo: "BAT-2026-002",
      productName: "Organic Tomatoes (Perishable)",
      warehouseId: "WH-102",
      warehouseName: "Apex Vijayawada Grain Terminal",
      bayRoom: "Chamber 1A",
      quantityTons: 85,
      receiptDate: "2026-07-15",
      expiryDate: "2026-08-05",
      daysToExpiry: 15,
      fefoRank: 1, // Urgent!
      qualityGrade: "Grade A",
      customerName: "AgriExport Global",
      moisturePercent: 88.0,
      tempCelsius: 7.8,
      humidityPercent: 82,
      status: "Reserved",
      qrCodeUrl: "QR-BAT-2026-002"
    },
    {
      batchNo: "BAT-2026-003",
      productName: "Sharbati Wheat Grain",
      warehouseId: "WH-103",
      warehouseName: "Apex Machilipatnam Silo Complex",
      bayRoom: "Silo Tower 1",
      quantityTons: 500,
      receiptDate: "2026-05-10",
      expiryDate: "2026-11-10",
      daysToExpiry: 112,
      fefoRank: 2,
      qualityGrade: "Grade A",
      customerName: "Kisan Producer Co.",
      moisturePercent: 12.1,
      tempCelsius: 18.5,
      humidityPercent: 48,
      status: "In Storage",
      qrCodeUrl: "QR-BAT-2026-003"
    }
  ]);

  const [showAddBatchModal, setShowAddBatchModal] = useState<boolean>(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [showBatchDetailModal, setShowBatchDetailModal] = useState<boolean>(false);

  // New Batch Form State
  const [batchProduct, setBatchProduct] = useState("Kashmir Apples");
  const [batchQuantity, setBatchQuantity] = useState(50);
  const [batchWarehouseId, setBatchWarehouseId] = useState("WH-101");
  const [batchBayRoom, setBatchBayRoom] = useState("Chamber 3A");
  const [batchMoisture, setBatchMoisture] = useState(12.0);
  const [batchGrade, setBatchGrade] = useState("Grade A+");
  const [batchCustomer, setBatchCustomer] = useState("Kashmir Fruit Growers");

  // Cold Chain IoT Sensors State
  const [chamberSensors, setChamberSensors] = useState({
    tempCelsius: 4.2,
    tempMin: 3.8,
    tempMax: 4.8,
    humidityPercent: 64,
    humidityMin: 60,
    humidityMax: 70,
    co2Ppm: 420,
    ethylenePpm: 0.6,
    coolingUnitActive: true,
    dehumidifierActive: true,
    ventilationActive: true,
    powerSource: "Grid + Solar Backup (Active)",
    doorStatus: "Closed & Sealed"
  });

  const [coldChainAlerts, setColdChainAlerts] = useState([
    { id: 1, time: "10:14 AM", type: "Warning", msg: "Ethylene gas reached 0.9 ppm in Chamber 1A (Tomatoes). Scrubber activated." },
    { id: 2, time: "Yesterday", type: "Normal", msg: "Scheduled automated 15-min aeration cycle completed for Silo Tower 1." }
  ]);

  // Quality Inspection State
  const [inspections, setInspections] = useState([
    {
      id: "INS-901",
      batchNo: "BAT-2026-001",
      productName: "Premium Basmati Rice",
      requestedBy: "Harpreet Singh",
      date: "2026-07-21",
      inspector: "Dr. A. K. Verma (QCI Certified)",
      moistureResult: "11.4% (Passed, <12%)",
      purityResult: "99.2% (Passed)",
      pesticideResidue: "Below Detectable Limit (ND)",
      microbiological: "Clean / Negative",
      overallGrade: "Grade A+ Export Quality",
      status: "Completed",
      result: "Pass"
    },
    {
      id: "INS-902",
      batchNo: "BAT-2026-002",
      productName: "Organic Tomatoes",
      requestedBy: "AgriExport Global",
      date: "2026-07-22",
      inspector: "Rajesh Sharma (Warehouse Manager)",
      moistureResult: "88% RH Optimal",
      purityResult: "98% Visual Quality",
      pesticideResidue: "Pending Lab Confirmation",
      microbiological: "Clear",
      overallGrade: "Grade A",
      status: "In Progress",
      result: "Pending"
    }
  ]);

  const [showPerformInspectionModal, setShowPerformInspectionModal] = useState<boolean>(false);
  const [inspBatchNo, setInspBatchNo] = useState("BAT-2026-001");
  const [inspMoisture, setInspMoisture] = useState(11.5);
  const [inspPurity, setInspPurity] = useState(99.0);
  const [inspGrade, setInspGrade] = useState("Grade A+");
  const [inspResult, setInspResult] = useState<"Pass" | "Fail">("Pass");

  // Revenue & Billing State
  const [financialStats, setFinancialStats] = useState({
    monthlyEarningsRupees: 742000,
    pendingPayoutsRupees: 185000,
    storageRevenue: 420000,
    coldStorageRevenue: 282000,
    valueAddedRevenue: 40000,
    nextPayoutDate: "2026-07-25"
  });

  const [invoices, setInvoices] = useState([
    {
      invoiceNo: "INV-2026-401",
      bookingId: "BK-8801",
      customerName: "Harpreet Singh",
      amountRupees: 195500,
      gstRupees: 23460, // 12%
      totalRupees: 218960,
      date: "2026-07-20",
      status: "Paid"
    },
    {
      invoiceNo: "INV-2026-402",
      bookingId: "BK-8802",
      customerName: "AgriExport Global",
      amountRupees: 316200,
      gstRupees: 37944,
      totalRupees: 354144,
      date: "2026-07-22",
      status: "Pending"
    }
  ]);

  // AI Assistant Chat State
  const [aiChatMessages, setAiChatMessages] = useState([
    { sender: "ai", text: "Namaste Rajesh Ji! I am your AgriConnect AI Warehouse Co-Pilot. Ask me about occupancy, expiring batches, cold chain optimizations, or demand forecasts." }
  ]);
  const [aiInputText, setAiInputText] = useState("");
  const [isListening, setIsListening] = useState(false);

  // Quick Helper: Translate text
  const tr = (key: string) => {
    return (T[lang] && T[lang][key]) || (T["English"] && T["English"][key]) || key;
  };

  // Handle Accept / Reject Booking
  const handleUpdateBookingStatus = (id: string, newStatus: string, assignedBay?: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus, assignedBay: assignedBay || b.assignedBay } : b));
    alert(`Booking ${id} status updated to ${newStatus}`);
    setShowBookingModal(false);
  };

  // Handle Add New Warehouse
  const handleAddWarehouseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newWh = {
      id: `WH-${100 + warehouses.length + 1}`,
      name: newWhName || "New Grain & Cold Depot",
      type: newWhType,
      address: newWhAddress || "Industrial Hub, Andhra Pradesh",
      gps: "30.9500° N, 75.8200° E",
      totalCapacityTons: newWhCapacity,
      usedCapacityTons: 0,
      availableCapacityTons: newWhCapacity,
      buildingAreaSqFt: 15000,
      baysCount: 4,
      ceilingHeightM: 6.0,
      floorType: "Epoxy Concrete",
      yearBuilt: 2026,
      tempRange: newWhType === "Cold Storage" ? "-5°C to +10°C" : "Ambient",
      humidityRange: "40% to 75% RH",
      hasVentilation: true,
      hasPestControl: true,
      hasFireSafety: true,
      hasCCTV: true,
      hasSecurity247: true,
      loadingDocks: 2,
      forklifts: 2,
      rackingSystem: true,
      weighingScaleTons: 50,
      storageRatePerTonDay: newWhStorageRate,
      coldStorageRatePerTonDay: newWhColdRate,
      status: "Active",
      rating: 5.0,
      certifiedExport: true,
      fssaiLicense: "FSSAI-10026001122",
      fireSafetyCert: "FIRE-2026-NEW-001"
    };
    setWarehouses([newWh, ...warehouses]);
    setShowAddWarehouseModal(false);
    alert("New Warehouse Facility successfully registered!");
  };

  // Handle Add Batch Submit
  const handleAddBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetWh = warehouses.find(w => w.id === batchWarehouseId) || warehouses[0];
    const newB = {
      batchNo: `BAT-2026-${String(4 + batches.length).padStart(3, '0')}`,
      productName: batchProduct,
      warehouseId: batchWarehouseId,
      warehouseName: targetWh.name,
      bayRoom: batchBayRoom,
      quantityTons: batchQuantity,
      receiptDate: new Date().toISOString().split("T")[0],
      expiryDate: new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0],
      daysToExpiry: 90,
      fefoRank: batches.length + 1,
      qualityGrade: batchGrade,
      customerName: batchCustomer,
      moisturePercent: batchMoisture,
      tempCelsius: 4.0,
      humidityPercent: 65,
      status: "In Storage",
      qrCodeUrl: `QR-BAT-NEW-${Date.now()}`
    };
    setBatches([newB, ...batches]);
    setShowAddBatchModal(false);
    alert(`Batch ${newB.batchNo} created and assigned to ${targetWh.name}!`);
  };

  // Handle Inspection Submit
  const handlePerformInspectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInsp = {
      id: `INS-${900 + inspections.length + 1}`,
      batchNo: inspBatchNo,
      productName: batches.find(b => b.batchNo === inspBatchNo)?.productName || "Crop Goods",
      requestedBy: "AgriConnect Quality Assurance",
      date: new Date().toISOString().split("T")[0],
      inspector: operatorProfile.name,
      moistureResult: `${inspMoisture}% Moisture`,
      purityResult: `${inspPurity}% Purity`,
      pesticideResidue: "Verified Clean / Compliant",
      microbiological: "Negative / Safe",
      overallGrade: inspGrade,
      status: "Completed",
      result: inspResult
    };
    setInspections([newInsp, ...inspections]);
    setShowPerformInspectionModal(false);
    alert(`Quality Inspection Certificate ${newInsp.id} generated!`);
  };

  // Handle AI Chat Send
  const handleAiSend = () => {
    if (!aiInputText.trim()) return;
    const userMsg = { sender: "user", text: aiInputText };
    setAiChatMessages(prev => [...prev, userMsg]);
    setAiInputText("");

    setTimeout(() => {
      let reply = "I analyzed your warehouse metrics: Occupancy is currently at 85% across all facilities. Recommend clearing Batch BAT-2026-002 (Tomatoes) within 15 days due to FEFO rank 1.";
      if (aiInputText.toLowerCase().includes("revenue")) {
        reply = "Your revenue for this month is ₹7,42,000. Apex Vijayawada Terminal is your most profitable facility generating ₹3,16,200 this month.";
      } else if (aiInputText.toLowerCase().includes("temp") || aiInputText.toLowerCase().includes("cold")) {
        reply = "All cold storage chambers are operating within target parameters (3.8°C - 4.8°C). Solar energy backup is active at 100% capacity.";
      }
      setAiChatMessages(prev => [...prev, { sender: "ai", text: reply }]);
    }, 800);
  };

  // Chart Data Calculations
  const occupancyChartData = warehouses.map(w => ({
    name: w.name.split(" ")[1] || w.name,
    Occupied: w.usedCapacityTons,
    Available: w.availableCapacityTons
  }));

  const revenueMonthlyData = [
    { month: "Feb", Storage: 220000, ColdChain: 180000, Services: 20000 },
    { month: "Mar", Storage: 280000, ColdChain: 210000, Services: 25000 },
    { month: "Apr", Storage: 310000, ColdChain: 240000, Services: 30000 },
    { month: "May", Storage: 350000, ColdChain: 260000, Services: 35000 },
    { month: "Jun", Storage: 390000, ColdChain: 270000, Services: 38000 },
    { month: "Jul", Storage: 420000, ColdChain: 282000, Services: 40000 }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-12">

      {/* TOP BRANDING & OPERATOR BAR */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40 px-4 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <Building2 className="h-6 w-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight text-white">{tr("portalTitle")}</h1>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full flex items-center gap-1">
                  <Award className="h-3 w-3 text-amber-400" /> {operatorProfile.badge} Badge
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">{tr("subtitle")}</p>
            </div>
          </div>

          {/* Quick Actions & Profile Metrics */}
          <div className="flex items-center gap-3">
            
            {/* Language Switcher */}
            <div className="relative">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {LANGUAGES.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            {/* Offline Sync Status */}
            <button
              onClick={() => {
                setSyncing(true);
                setTimeout(() => setSyncing(false), 1200);
              }}
              className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isOffline ? "bg-amber-900/30 border-amber-700 text-amber-300" : "bg-emerald-900/30 border-emerald-700 text-emerald-300"
              }`}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin text-blue-400" : ""}`} />
              <span className="hidden sm:inline">{syncing ? "Syncing..." : isOffline ? "Offline" : "Live Cloud"}</span>
            </button>

            {/* Notifications */}
            <button
              onClick={() => setShowNotificationsModal(true)}
              className="relative p-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg text-slate-200 transition-colors"
            >
              <Bell className="h-4 w-4" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            {/* Trust Score Pill */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <div>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Trust Score</p>
                <p className="text-xs font-black text-emerald-400">{operatorProfile.trustScore} / 100</p>
              </div>
            </div>

            {/* Login / Auth Button */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>{operatorProfile.name}</span>
            </button>

          </div>

        </div>
      </header>

      {/* NAVIGATION TABS BAR */}
      <nav className="bg-slate-950/80 backdrop-blur border-b border-slate-800 sticky top-[57px] z-30 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-2 no-scrollbar">
          {[
            { id: "dashboard", label: tr("dashboard"), icon: Activity },
            { id: "onboarding", label: tr("onboarding"), icon: ShieldCheck },
            { id: "warehouses", label: tr("warehouses"), icon: Building2 },
            { id: "bookings", label: tr("bookings"), icon: Clock },
            { id: "inventory", label: tr("inventory"), icon: Layers },
            { id: "coldChain", label: tr("coldChain"), icon: ThermometerSnowflake },
            { id: "inspections", label: tr("inspections"), icon: CheckSquare },
            { id: "revenue", label: tr("revenue"), icon: DollarSign },
            { id: "customers", label: tr("customers"), icon: Users },
            { id: "aiCopilot", label: tr("aiCopilot"), icon: Sparkles },
            { id: "settings", label: tr("settings"), icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-white" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 pt-6">

        {/* TAB 1: WAREHOUSE DASHBOARD OVERVIEW */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-in fade-in">
            
            {/* HERO BANNER */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 border border-blue-800/50 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-400" /> {tr("goldVerified")} • Trust Score: {operatorProfile.trustScore}/100
                </span>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Welcome back, {operatorProfile.name}
                </h2>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {operatorProfile.companyName} oversees <strong className="text-white">{warehouses.length} Storage Facilities</strong> with a total capacity of <strong className="text-emerald-400">25,000 Metric Tons</strong> across Andhra Pradesh & Haryana.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowAddWarehouseModal(true)}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Add Facility
                </button>
                <button
                  onClick={() => setActiveTab("bookings")}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Clock className="h-4 w-4 text-amber-400" /> Pending Requests ({bookings.filter(b => b.status === "Pending").length})
                </button>
              </div>
            </div>

            {/* QUICK STATS CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { title: tr("activeWarehouses"), val: warehouses.length, sub: "Facilities", color: "text-blue-400", icon: Building2 },
                { title: tr("totalCapacity"), val: "25,000", sub: "Tons", color: "text-indigo-400", icon: Box },
                { title: tr("usedCapacity"), val: "21,200", sub: "Tons (84.8%)", color: "text-emerald-400", icon: Gauge },
                { title: tr("activeBookings"), val: bookings.filter(b => b.status === "Active").length, sub: "In Progress", color: "text-amber-400", icon: Clock },
                { title: "Quality Rating", val: "4.8 ★", sub: "Out of 5.0", color: "text-yellow-400", icon: Star },
                { title: tr("monthlyRevenue"), val: "₹7,42,000", sub: "+12.4% vs last mo", color: "text-teal-400", icon: DollarSign }
              ].map((st, idx) => {
                const Icon = st.icon;
                return (
                  <div key={idx} className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 shadow-sm space-y-1.5 hover:border-slate-600 transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400">{st.title}</span>
                      <Icon className={`h-4 w-4 ${st.color}`} />
                    </div>
                    <p className={`text-lg font-black tracking-tight ${st.color}`}>{st.val}</p>
                    <p className="text-[10px] font-semibold text-slate-500">{st.sub}</p>
                  </div>
                );
              })}
            </div>

            {/* PERFORMANCE CHARTS WIDGET */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Occupancy Chart */}
              <div className="lg:col-span-6 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-700/60 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <BarChart2 className="h-4.5 w-4.5 text-blue-400" /> Facility Occupancy Breakdown (Tons)
                    </h3>
                    <p className="text-[10px] text-slate-400">Used vs Available capacity across all facilities</p>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-lg">
                    84.8% Total Filled
                  </span>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={occupancyChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#fff" }} />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <Bar dataKey="Occupied" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Available" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Revenue Trends Chart */}
              <div className="lg:col-span-6 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-700/60 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <TrendingUp className="h-4.5 w-4.5 text-teal-400" /> Revenue Growth Trends (₹)
                    </h3>
                    <p className="text-[10px] text-slate-400">Monthly breakdown by Storage, Cold Chain & Services</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-teal-300 bg-teal-950/60 border border-teal-800/60 px-2.5 py-1 rounded-lg">
                    ₹7.42 Lakhs
                  </span>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueMonthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#fff" }} />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <Area type="monotone" dataKey="Storage" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
                      <Area type="monotone" dataKey="ColdChain" stackId="1" stroke="#06b6d4" fill="#06b6d4" />
                      <Area type="monotone" dataKey="Services" stackId="1" stroke="#10b981" fill="#10b981" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* QUICK ACTIONS & RECENT ACTIVITY */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Quick Actions Grid */}
              <div className="lg:col-span-5 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-700/60 pb-2">
                  Operator Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {[
                    { label: "New Booking Request", act: () => setActiveTab("bookings"), color: "bg-blue-600/20 text-blue-300 border-blue-500/40" },
                    { label: "Add Inventory Batch", act: () => setShowAddBatchModal(true), color: "bg-emerald-600/20 text-emerald-300 border-emerald-500/40" },
                    { label: "Check Cold Telemetry", act: () => setActiveTab("coldChain"), color: "bg-indigo-600/20 text-indigo-300 border-indigo-500/40" },
                    { label: "New Quality Test", act: () => setShowPerformInspectionModal(true), color: "bg-amber-600/20 text-amber-300 border-amber-500/40" },
                    { label: "Generate Invoice", act: () => setActiveTab("revenue"), color: "bg-teal-600/20 text-teal-300 border-teal-500/40" },
                    { label: "Ask AI Co-Pilot", act: () => setActiveTab("aiCopilot"), color: "bg-purple-600/20 text-purple-300 border-purple-500/40" }
                  ].map((qa, i) => (
                    <button
                      key={i}
                      onClick={qa.act}
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition-all hover:scale-[1.02] cursor-pointer ${qa.color}`}
                    >
                      {qa.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Bookings Quick Summary Table */}
              <div className="lg:col-span-7 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-700/60 pb-2">
                  <h3 className="text-sm font-bold text-white">Active Storage Bookings Summary</h3>
                  <button onClick={() => setActiveTab("bookings")} className="text-xs font-bold text-blue-400 hover:underline">View All →</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 text-[10px] uppercase border-b border-slate-700">
                        <th className="pb-2">Booking ID</th>
                        <th className="pb-2">Customer</th>
                        <th className="pb-2">Crop</th>
                        <th className="pb-2">Weight</th>
                        <th className="pb-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {bookings.slice(0, 3).map(b => (
                        <tr key={b.id} className="hover:bg-slate-700/30">
                          <td className="py-2.5 font-mono font-bold text-blue-400">{b.id}</td>
                          <td className="py-2.5 text-slate-200">{b.customerName}</td>
                          <td className="py-2.5 text-slate-300">{b.cropName}</td>
                          <td className="py-2.5 font-bold text-white">{b.quantityTons} Tons</td>
                          <td className="py-2.5">
                            <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                              b.status === "Active" ? "bg-emerald-900/60 text-emerald-300 border border-emerald-700" : "bg-amber-900/60 text-amber-300 border border-amber-700"
                            }`}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: AUTH & ONBOARDING WIZARD */}
        {activeTab === "onboarding" && (
          <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-6">
              
              <div className="border-b border-slate-700 pb-4 flex flex-col md:flex-row justify-between md:items-center gap-3">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-blue-400" /> Warehouse Operator Onboarding & Verification
                  </h2>
                  <p className="text-xs text-slate-400">Complete business details & document uploads to unlock Gold verification status</p>
                </div>
                <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full text-xs font-bold w-fit">
                  Status: {operatorProfile.verificationStatus} (Trust Score: {operatorProfile.trustScore}/100)
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Wizard Completion Progress</span>
                  <span>{onboardingStep * 25}% Completed</span>
                </div>
                <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${onboardingStep * 25}%` }}></div>
                </div>
              </div>

              {/* Step Tabs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
                {[
                  { step: 1, label: "1. Business Details" },
                  { step: 2, label: "2. Contact Info" },
                  { step: 3, label: "3. Facility Profile" },
                  { step: 4, label: "4. Document Verification" }
                ].map((s) => (
                  <button
                    key={s.step}
                    onClick={() => setOnboardingStep(s.step)}
                    className={`py-2 px-3 rounded-lg font-bold border transition-all cursor-pointer ${
                      onboardingStep === s.step
                        ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                        : "bg-slate-700/50 text-slate-300 border-slate-600 hover:bg-slate-700"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Step 1 Content */}
              {onboardingStep === 1 && (
                <div className="space-y-4 text-xs">
                  <h3 className="font-bold text-slate-200 text-sm">Step 1: Business Registration Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 mb-1">Company Name *</label>
                      <input
                        type="text"
                        value={operatorProfile.companyName}
                        onChange={(e) => setOperatorProfile({ ...operatorProfile, companyName: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">GST Number (For Billing) *</label>
                      <input
                        type="text"
                        value={operatorProfile.gstNumber}
                        onChange={(e) => setOperatorProfile({ ...operatorProfile, gstNumber: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">PAN Number *</label>
                      <input
                        type="text"
                        value={operatorProfile.panNumber}
                        onChange={(e) => setOperatorProfile({ ...operatorProfile, panNumber: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Business Type</label>
                      <select
                        value={operatorProfile.businessType}
                        onChange={(e) => setOperatorProfile({ ...operatorProfile, businessType: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-semibold"
                      >
                        <option value="Sole Proprietor">Sole Proprietor</option>
                        <option value="Partnership">Partnership</option>
                        <option value="LLP">LLP</option>
                        <option value="Private Limited">Private Limited</option>
                        <option value="Public Limited">Public Limited</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Documents Locker */}
              {onboardingStep === 4 && (
                <div className="space-y-4 text-xs">
                  <h3 className="font-bold text-slate-200 text-sm">Step 4: Upload Mandatory Compliance Certificates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: "GST Certificate", file: "GST_Apex_2025.pdf", status: "Verified" },
                      { title: "PAN Card Document", file: "PAN_ABCDE1234F.pdf", status: "Verified" },
                      { title: "FSSAI License Certificate", file: "FSSAI_10019082726.pdf", status: "Verified" },
                      { title: "Fire Safety Certificate", file: "Fire_Safety_Guntur.pdf", status: "Verified" },
                      { title: "Building Safety Plan Approval", file: "Building_Plan_App.pdf", status: "Verified" },
                      { title: "Cold Storage Insurance Policy", file: "Insurance_2026.pdf", status: "Verified" }
                    ].map((doc, i) => (
                      <div key={i} className="p-3 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-200">{doc.title}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{doc.file}</p>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold rounded">
                          ✓ {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between border-t border-slate-700 pt-4">
                <button
                  disabled={onboardingStep === 1}
                  onClick={() => setOnboardingStep(prev => prev - 1)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold"
                >
                  ← Previous Step
                </button>
                <button
                  onClick={() => {
                    if (onboardingStep < 4) setOnboardingStep(prev => prev + 1);
                    else alert("Onboarding details and document compliance submitted for review!");
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold"
                >
                  {onboardingStep === 4 ? "Submit For Final Verification" : "Save & Next Step →"}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: WAREHOUSE MANAGEMENT */}
        {activeTab === "warehouses" && (
          <div className="space-y-6 animate-in fade-in">
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-400" /> Warehouse Facilities Management
                </h2>
                <p className="text-xs text-slate-400">List and manage cold storages, grain silos, and controlled atmosphere depots</p>
              </div>
              <button
                onClick={() => setShowAddWarehouseModal(true)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 w-fit cursor-pointer shadow-lg"
              >
                <Plus className="h-4 w-4" /> Add New Warehouse
              </button>
            </div>

            {/* Facilities Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {warehouses.map((wh) => (
                <div key={wh.id} className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 space-y-4 hover:border-blue-500/50 transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 text-[9px] font-bold uppercase rounded">
                          {wh.type}
                        </span>
                        <h3 className="font-extrabold text-white text-sm mt-1.5">{wh.name}</h3>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-red-400 shrink-0" /> {wh.address}
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                        wh.status === "Active" ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "bg-amber-950 text-amber-300 border border-amber-800"
                      }`}>
                        {wh.status}
                      </span>
                    </div>

                    {/* Capacity Visual Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400">
                        <span>Capacity Occupied</span>
                        <span>{Math.round((wh.usedCapacityTons / wh.totalCapacityTons) * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-700 h-3 rounded-lg overflow-hidden relative">
                        <div
                          className="bg-blue-500 h-full rounded-lg transition-all duration-500"
                          style={{ width: `${(wh.usedCapacityTons / wh.totalCapacityTons) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-[10px] font-mono text-slate-300 text-right">
                        {wh.usedCapacityTons} / {wh.totalCapacityTons} Tons
                      </p>
                    </div>

                    {/* Rates & Specifications */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/40 text-center text-xs">
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Dry Rate</p>
                        <p className="font-extrabold text-white">₹{wh.storageRatePerTonDay}/ton/day</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Cold Rate</p>
                        <p className="font-extrabold text-emerald-400">₹{wh.coldStorageRatePerTonDay}/ton/day</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedWarehouseId(wh.id);
                        setShowWarehouseDetailModal(true);
                      }}
                      className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      View Details & Equipment
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 4: STORAGE BOOKINGS MANAGEMENT */}
        {activeTab === "bookings" && (
          <div className="space-y-6 animate-in fade-in">
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-400" /> Storage Bookings & Space Reservations
                </h2>
                <p className="text-xs text-slate-400">Accept or reject incoming storage space requests from Farmers, Buyers & Suppliers</p>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2 bg-slate-800 p-1 rounded-xl border border-slate-700">
                {["All", "Pending", "Active", "Completed"].map(f => (
                  <button
                    key={f}
                    onClick={() => setBookingFilter(f)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      bookingFilter === f ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 text-[10px] uppercase tracking-wider border-b border-slate-700">
                    <tr>
                      <th className="p-4">Booking Ref</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Crop & Weight</th>
                      <th className="p-4">Facility / Bay</th>
                      <th className="p-4">Duration</th>
                      <th className="p-4">Budget</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {bookings
                      .filter(b => bookingFilter === "All" || b.status === bookingFilter)
                      .map(b => (
                        <tr key={b.id} className="hover:bg-slate-700/30 transition-colors">
                          <td className="p-4 font-mono font-bold text-blue-400">{b.id}</td>
                          <td className="p-4">
                            <p className="font-extrabold text-white">{b.customerName}</p>
                            <p className="text-[10px] text-slate-400">{b.customerType} • {b.mobile}</p>
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-slate-200">{b.cropName}</p>
                            <p className="text-[10px] text-emerald-400 font-extrabold">{b.quantityTons} Metric Tons</p>
                          </td>
                          <td className="p-4">
                            <p className="text-slate-300 font-semibold">{b.warehouseName}</p>
                            <span className="text-[10px] text-amber-400 font-mono">Assigned: {b.assignedBay}</span>
                          </td>
                          <td className="p-4 text-slate-300">
                            <p className="font-bold">{b.durationDays} Days</p>
                            <p className="text-[10px] text-slate-400">{b.startDate} → {b.endDate}</p>
                          </td>
                          <td className="p-4 font-mono font-bold text-white">₹{b.budgetRupees.toLocaleString()}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${
                              b.status === "Active" ? "bg-emerald-950 text-emerald-300 border-emerald-800" : b.status === "Pending" ? "bg-amber-950 text-amber-300 border-amber-800 animate-pulse" : "bg-slate-700 text-slate-300 border-slate-600"
                            }`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedBooking(b);
                                setShowBookingModal(true);
                              }}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                            >
                              Manage / Review
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: INVENTORY & FEFO MANAGEMENT */}
        {activeTab === "inventory" && (
          <div className="space-y-6 animate-in fade-in">
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Layers className="h-5 w-5 text-emerald-400" /> Stored Inventory & FEFO Dispatch Management
                </h2>
                <p className="text-xs text-slate-400">Track stored crop batches, moisture %, expiry countdowns & QR code labels</p>
              </div>
              <button
                onClick={() => setShowAddBatchModal(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Plus className="h-4 w-4" /> Add Inventory Batch
              </button>
            </div>

            {/* FEFO Warning Banner */}
            <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-extrabold text-amber-200 uppercase">FEFO Urgent Dispatch Alert</h4>
                  <p className="text-xs text-amber-300/90">
                    Batch <strong className="text-white">BAT-2026-002 (Organic Tomatoes, 85 Tons)</strong> has only <strong>15 days remaining</strong> before quality degradation. Priority dispatch recommended!
                  </p>
                </div>
              </div>
            </div>

            {/* Batches Table */}
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 text-[10px] uppercase border-b border-slate-700">
                    <tr>
                      <th className="p-4">Batch No</th>
                      <th className="p-4">Product Name</th>
                      <th className="p-4">Facility / Chamber</th>
                      <th className="p-4">Quantity</th>
                      <th className="p-4">Moisture %</th>
                      <th className="p-4">Expiry Date</th>
                      <th className="p-4 text-center">FEFO Rank</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {batches.map(b => (
                      <tr key={b.batchNo} className="hover:bg-slate-700/30 transition-colors">
                        <td className="p-4 font-mono font-bold text-emerald-400">{b.batchNo}</td>
                        <td className="p-4">
                          <p className="font-extrabold text-white">{b.productName}</p>
                          <p className="text-[10px] text-slate-400">Customer: {b.customerName}</p>
                        </td>
                        <td className="p-4 text-slate-300">
                          <p className="font-semibold">{b.warehouseName}</p>
                          <span className="text-[10px] text-blue-400 font-mono">{b.bayRoom}</span>
                        </td>
                        <td className="p-4 font-bold text-white">{b.quantityTons} Metric Tons</td>
                        <td className="p-4 font-mono text-slate-300">{b.moisturePercent}%</td>
                        <td className="p-4 font-mono text-slate-300">
                          <p>{b.expiryDate}</p>
                          <p className="text-[10px] text-amber-400 font-bold">({b.daysToExpiry} days left)</p>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2.5 py-1 text-[10px] font-black rounded border ${
                            b.fefoRank === 1 ? "bg-rose-950 text-rose-300 border-rose-800 animate-pulse" : "bg-emerald-950 text-emerald-300 border-emerald-800"
                          }`}>
                            Rank {b.fefoRank} {b.fefoRank === 1 ? "• Priority" : ""}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedBatch(b);
                              setShowBatchDetailModal(true);
                            }}
                            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-bold cursor-pointer inline-flex items-center gap-1"
                          >
                            <QrCode className="h-3.5 w-3.5 text-blue-400" /> Details & QR
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 6: COLD CHAIN & IOT TELEMETRY */}
        {activeTab === "coldChain" && (
          <div className="space-y-6 animate-in fade-in">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ThermometerSnowflake className="h-5 w-5 text-blue-400" /> Real-Time Cold Chain & Environmental IoT Gauges
                </h2>
                <p className="text-xs text-slate-400">Live chamber climate sensors, ethylene gas scrubbers & power status</p>
              </div>
              <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full text-xs font-bold flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-emerald-400" /> {chamberSensors.powerSource}
              </span>
            </div>

            {/* IoT Gauges Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 space-y-2 relative">
                <span className="text-[10px] uppercase font-bold text-slate-400">Chamber Temperature</span>
                <p className="text-3xl font-black text-blue-400 font-mono">{chamberSensors.tempCelsius}°C</p>
                <p className="text-[10px] text-slate-400 font-semibold">Min: {chamberSensors.tempMin}°C • Max: {chamberSensors.tempMax}°C</p>
                <ThermometerSnowflake className="h-6 w-6 text-blue-400 absolute top-4 right-4" />
              </div>

              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 space-y-2 relative">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-semibold">Relative Humidity</span>
                <p className="text-3xl font-black text-teal-400 font-mono">{chamberSensors.humidityPercent}% RH</p>
                <p className="text-[10px] text-slate-400 font-semibold">Min: {chamberSensors.humidityMin}% • Max: {chamberSensors.humidityMax}%</p>
                <Droplets className="h-6 w-6 text-teal-400 absolute top-4 right-4" />
              </div>

              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 space-y-2 relative">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-semibold">Ethylene Gas Level</span>
                <p className="text-3xl font-black text-amber-400 font-mono">{chamberSensors.ethylenePpm} PPM</p>
                <p className="text-[10px] text-amber-300 font-extrabold">✓ Scrubber Active (&lt;1.0 PPM)</p>
                <Wind className="h-6 w-6 text-amber-400 absolute top-4 right-4" />
              </div>

              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 space-y-2 relative">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-semibold">Chamber Door Seal</span>
                <p className="text-lg font-black text-emerald-400 mt-2">{chamberSensors.doorStatus}</p>
                <p className="text-[10px] text-slate-400 font-semibold">Zero Thermal Leakage</p>
                <Lock className="h-6 w-6 text-emerald-400 absolute top-4 right-4" />
              </div>
            </div>

            {/* Equipment Controls */}
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Automated Climate Controls</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: "Main Cooling Units", active: chamberSensors.coolingUnitActive, key: "coolingUnitActive" },
                  { name: "Dehumidifier Systems", active: chamberSensors.dehumidifierActive, key: "dehumidifierActive" },
                  { name: "Silo Aeration Fans", active: chamberSensors.ventilationActive, key: "ventilationActive" }
                ].map((eq, i) => (
                  <div key={i} className="p-4 bg-slate-900/60 border border-slate-700/60 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white text-xs">{eq.name}</p>
                      <span className={`text-[10px] font-bold ${eq.active ? "text-emerald-400" : "text-slate-400"}`}>
                        {eq.active ? "● Running Optimal" : "○ Paused"}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setChamberSensors({ ...chamberSensors, [eq.key]: !eq.active });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer transition-all ${
                        eq.active ? "bg-emerald-600 text-white border-emerald-500" : "bg-slate-700 text-slate-300 border-slate-600"
                      }`}
                    >
                      {eq.active ? "Active" : "Start"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 7: QUALITY INSPECTION SERVICES */}
        {activeTab === "inspections" && (
          <div className="space-y-6 animate-in fade-in">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-indigo-400" /> Quality Inspection & Phytosanitary Certification
                </h2>
                <p className="text-xs text-slate-400">Perform moisture, purity & pesticide tests to issue digital export certificates</p>
              </div>
              <button
                onClick={() => setShowPerformInspectionModal(true)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Plus className="h-4 w-4" /> Conduct New Inspection
              </button>
            </div>

            {/* Inspections Table */}
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 text-[10px] uppercase border-b border-slate-700">
                    <tr>
                      <th className="p-4">Cert ID</th>
                      <th className="p-4">Batch No & Product</th>
                      <th className="p-4">Inspector</th>
                      <th className="p-4">Moisture %</th>
                      <th className="p-4">Purity %</th>
                      <th className="p-4">Grade</th>
                      <th className="p-4">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {inspections.map(ins => (
                      <tr key={ins.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="p-4 font-mono font-bold text-indigo-400">{ins.id}</td>
                        <td className="p-4">
                          <p className="font-extrabold text-white">{ins.productName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{ins.batchNo}</p>
                        </td>
                        <td className="p-4 text-slate-300 font-semibold">{ins.inspector}</td>
                        <td className="p-4 font-mono text-slate-300">{ins.moistureResult}</td>
                        <td className="p-4 font-mono text-slate-300">{ins.purityResult}</td>
                        <td className="p-4 font-bold text-amber-300">{ins.overallGrade}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded text-[10px] font-extrabold border ${
                            ins.result === "Pass" ? "bg-emerald-950 text-emerald-300 border-emerald-800" : "bg-amber-950 text-amber-300 border-amber-800"
                          }`}>
                            ✓ {ins.result}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 8: REVENUE & BILLING */}
        {activeTab === "revenue" && (
          <div className="space-y-6 animate-in fade-in">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-teal-400" /> Revenue, Dynamic Rate Management & Invoicing
                </h2>
                <p className="text-xs text-slate-400">Track monthly earnings, manage storage rates per ton/day & issue GST invoices</p>
              </div>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 space-y-2">
                <p className="text-[10px] uppercase font-bold text-slate-400">Total Monthly Revenue</p>
                <p className="text-2xl font-black text-emerald-400 font-mono">₹{financialStats.monthlyEarningsRupees.toLocaleString()}</p>
                <p className="text-xs text-slate-400 font-semibold">Storage: ₹4.2L • Cold Chain: ₹2.82L</p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 space-y-2">
                <p className="text-[10px] uppercase font-bold text-slate-400">Pending Customer Payouts</p>
                <p className="text-2xl font-black text-amber-400 font-mono">₹{financialStats.pendingPayoutsRupees.toLocaleString()}</p>
                <p className="text-xs text-slate-400 font-semibold">Next Bank Transfer: {financialStats.nextPayoutDate}</p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 space-y-2">
                <p className="text-[10px] uppercase font-bold text-slate-400">GST Collected (12%)</p>
                <p className="text-2xl font-black text-blue-400 font-mono">₹89,040</p>
                <p className="text-xs text-slate-400 font-semibold">Auto-Calculated GST Billing</p>
              </div>
            </div>

            {/* Invoices List */}
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-700/60 pb-3">
                Generated GST Invoices
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 text-[10px] uppercase">
                    <tr>
                      <th className="p-3">Invoice No</th>
                      <th className="p-3">Booking Ref</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Base Amount</th>
                      <th className="p-3">GST (12%)</th>
                      <th className="p-3">Grand Total</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {invoices.map(inv => (
                      <tr key={inv.invoiceNo} className="hover:bg-slate-700/30">
                        <td className="p-3 font-mono font-bold text-teal-400">{inv.invoiceNo}</td>
                        <td className="p-3 font-mono text-slate-300">{inv.bookingId}</td>
                        <td className="p-3 font-bold text-white">{inv.customerName}</td>
                        <td className="p-3 font-mono text-slate-300">₹{inv.amountRupees.toLocaleString()}</td>
                        <td className="p-3 font-mono text-slate-400">₹{inv.gstRupees.toLocaleString()}</td>
                        <td className="p-3 font-mono font-bold text-emerald-400">₹{inv.totalRupees.toLocaleString()}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                            inv.status === "Paid" ? "bg-emerald-950 text-emerald-300 border-emerald-800" : "bg-amber-950 text-amber-300 border-amber-800"
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 9: CUSTOMERS & RATINGS */}
        {activeTab === "customers" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-yellow-400" /> Customer Relationships & Ratings Reviews
              </h2>
              <p className="text-xs text-slate-400">View customer booking history and reply to rating reviews</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "Harpreet Singh", type: "Farmer Co-op", rating: 5, review: "Excellent cold storage condition. Zero crop spoilage over 3 months!", date: "2026-07-21" },
                { name: "AgriExport Global", type: "Exporter", rating: 5, review: "Instant phytosanitary cert and fast dock loading times.", date: "2026-07-18" }
              ].map((rev, idx) => (
                <div key={idx} className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-white text-sm">{rev.name}</h4>
                      <p className="text-[10px] text-slate-400">{rev.type} • {rev.date}</p>
                    </div>
                    <div className="flex items-center text-yellow-400 text-xs font-bold gap-1">
                      <Star className="h-4 w-4 fill-yellow-400" /> {rev.rating}.0
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 italic">"{rev.review}"</p>
                  <div className="pt-2 border-t border-slate-700/60">
                    <button
                      onClick={() => alert(`Replied to ${rev.name}: Thank you for storing with Apex Cold Chain!`)}
                      className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Reply to Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 10: AI ASSISTANT FOR WAREHOUSE */}
        {activeTab === "aiCopilot" && (
          <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-4">
              
              <div className="border-b border-slate-700 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-600/30 rounded-xl border border-purple-500/30">
                    <Sparkles className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">AgriConnect AI Warehouse Co-Pilot</h2>
                    <p className="text-xs text-slate-400">Demand Predictor, FEFO Inventory Layout & Cold Chain Energy Optimizer</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-purple-300 bg-purple-950/60 border border-purple-800 px-3 py-1 rounded-full">
                  10 Languages Supported
                </span>
              </div>

              {/* Chat Messages Window */}
              <div className="h-80 bg-slate-900 border border-slate-700 rounded-xl p-4 overflow-y-auto space-y-3 font-sans">
                {aiChatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-md p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                      msg.sender === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask AI: e.g. 'Show me demand forecast for wheat next 60 days'..."
                  value={aiInputText}
                  onChange={(e) => setAiInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAiSend()}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={() => setIsListening(!isListening)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isListening ? "bg-rose-600 text-white border-rose-500 animate-pulse" : "bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600"
                  }`}
                >
                  <Mic className="h-4 w-4" />
                </button>
                <button
                  onClick={handleAiSend}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <Send className="h-4 w-4" /> Send
                </button>
              </div>

            </div>
          </div>
        )}

        {/* TAB 11: SETTINGS & PROFILE */}
        {activeTab === "settings" && (
          <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-700 pb-3">
                <Settings className="h-5 w-5 text-slate-400" /> Operator Profile & Application Preferences
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Operator Name</label>
                  <input
                    type="text"
                    value={operatorProfile.name}
                    onChange={(e) => setOperatorProfile({ ...operatorProfile, name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Mobile Contact</label>
                  <input
                    type="text"
                    value={operatorProfile.mobile}
                    onChange={(e) => setOperatorProfile({ ...operatorProfile, mobile: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Registered Address</label>
                  <textarea
                    rows={2}
                    value={operatorProfile.address}
                    onChange={(e) => setOperatorProfile({ ...operatorProfile, address: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-semibold"
                  />
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4 flex justify-end">
                <button
                  onClick={() => alert("Profile & Settings successfully saved!")}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODAL 1: ADD NEW WAREHOUSE */}
      {showAddWarehouseModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Register New Warehouse Facility</h3>
              <button onClick={() => setShowAddWarehouseModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddWarehouseSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Warehouse Facility Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Apex Nellore Cold Depot"
                  value={newWhName}
                  onChange={(e) => setNewWhName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Facility Type</label>
                  <select
                    value={newWhType}
                    onChange={(e) => setNewWhType(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                  >
                    <option value="Cold Storage">Cold Storage</option>
                    <option value="Controlled Atmosphere Storage">Controlled Atmosphere Storage</option>
                    <option value="General Warehouse">General Warehouse</option>
                    <option value="Silo">Silo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Total Capacity (Tons)</label>
                  <input
                    type="number"
                    value={newWhCapacity}
                    onChange={(e) => setNewWhCapacity(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Full Address</label>
                <input
                  type="text"
                  placeholder="Full street address & district"
                  value={newWhAddress}
                  onChange={(e) => setNewWhAddress(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Dry Rate (₹ / ton / day)</label>
                  <input
                    type="number"
                    value={newWhStorageRate}
                    onChange={(e) => setNewWhStorageRate(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Cold Rate (₹ / ton / day)</label>
                  <input
                    type="number"
                    value={newWhColdRate}
                    onChange={(e) => setNewWhColdRate(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddWarehouseModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  Save Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD INVENTORY BATCH */}
      {showAddBatchModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add New Inventory Batch</h3>
              <button onClick={() => setShowAddBatchModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddBatchSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Crop / Product Name *</label>
                <input
                  type="text"
                  required
                  value={batchProduct}
                  onChange={(e) => setBatchProduct(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Facility</label>
                  <select
                    value={batchWarehouseId}
                    onChange={(e) => setBatchWarehouseId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                  >
                    {warehouses.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Quantity (Metric Tons)</label>
                  <input
                    type="number"
                    value={batchQuantity}
                    onChange={(e) => setBatchQuantity(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Bay / Chamber Room</label>
                  <input
                    type="text"
                    value={batchBayRoom}
                    onChange={(e) => setBatchBayRoom(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Customer Name</label>
                  <input
                    type="text"
                    value={batchCustomer}
                    onChange={(e) => setBatchCustomer(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddBatchModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  Register Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: BOOKING MANAGEMENT DETAILS */}
      {showBookingModal && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Booking Review: {selectedBooking.id}</h3>
                <p className="text-xs text-slate-400">{selectedBooking.customerName} ({selectedBooking.customerType})</p>
              </div>
              <button onClick={() => setShowBookingModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="grid grid-cols-2 gap-2 bg-slate-800 p-3 rounded-xl">
                <div>
                  <span className="text-slate-400 font-bold block">Crop & Weight</span>
                  <span className="font-extrabold text-white">{selectedBooking.cropName} ({selectedBooking.quantityTons} Tons)</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Budget Total</span>
                  <span className="font-extrabold text-emerald-400">₹{selectedBooking.budgetRupees.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-bold block">Special Instructions</span>
                <p className="p-2.5 bg-slate-800 rounded-lg text-slate-200 mt-1">{selectedBooking.specialInstructions || "Standard cold chain handling."}</p>
              </div>

              {selectedBooking.status === "Pending" && (
                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => handleUpdateBookingStatus(selectedBooking.id, "Rejected")}
                    className="flex-1 py-2 bg-rose-950 text-rose-300 border border-rose-800 rounded-xl font-bold hover:bg-rose-900 cursor-pointer"
                  >
                    Reject Booking
                  </button>
                  <button
                    onClick={() => handleUpdateBookingStatus(selectedBooking.id, "Active", "Chamber 1A")}
                    className="flex-1 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 cursor-pointer shadow-md"
                  >
                    Accept & Assign Bay
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: PERFORM QUALITY INSPECTION */}
      {showPerformInspectionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Conduct Quality Inspection</h3>
              <button onClick={() => setShowPerformInspectionModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePerformInspectionSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Select Batch *</label>
                <select
                  value={inspBatchNo}
                  onChange={(e) => setInspBatchNo(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                >
                  {batches.map(b => (
                    <option key={b.batchNo} value={b.batchNo}>{b.batchNo} - {b.productName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Moisture Test (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={inspMoisture}
                    onChange={(e) => setInspMoisture(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Purity Check (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={inspPurity}
                    onChange={(e) => setInspPurity(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Assigned Quality Grade</label>
                  <select
                    value={inspGrade}
                    onChange={(e) => setInspGrade(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                  >
                    <option value="Grade A+ Export Quality">Grade A+ Export Quality</option>
                    <option value="Grade A Domestic Standard">Grade A Domestic Standard</option>
                    <option value="Grade B">Grade B</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Final Verdict</label>
                  <select
                    value={inspResult}
                    onChange={(e) => setInspResult(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                  >
                    <option value="Pass">Pass (Certified)</option>
                    <option value="Fail">Fail (Rejected)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPerformInspectionModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  Generate Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: BATCH DETAIL & QR CODE */}
      {showBatchDetailModal && selectedBatch && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 text-center">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 text-left">
              <div>
                <h3 className="text-base font-bold text-white">{selectedBatch.productName}</h3>
                <p className="text-xs font-mono text-emerald-400">{selectedBatch.batchNo}</p>
              </div>
              <button onClick={() => setShowBatchDetailModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* QR Code Container */}
            <div className="p-6 bg-white rounded-2xl inline-block mx-auto border-4 border-slate-800 shadow-inner">
              <QrCode className="h-32 w-32 text-slate-900 mx-auto" />
              <p className="text-[10px] font-mono text-slate-600 font-bold mt-2">{selectedBatch.qrCodeUrl}</p>
            </div>

            <div className="text-left text-xs space-y-2 bg-slate-800 p-4 rounded-xl text-slate-300 font-mono">
              <p>Facility: {selectedBatch.warehouseName}</p>
              <p>Chamber Location: {selectedBatch.bayRoom}</p>
              <p>Weight: {selectedBatch.quantityTons} Metric Tons</p>
              <p>Quality Grade: {selectedBatch.qualityGrade}</p>
              <p>Expiry: {selectedBatch.expiryDate} (FEFO Rank {selectedBatch.fefoRank})</p>
            </div>

            <button
              onClick={() => {
                alert(`QR Code Label for ${selectedBatch.batchNo} printed!`);
                setShowBatchDetailModal(false);
              }}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Printer className="h-4 w-4" /> Print Physical QR Label
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
