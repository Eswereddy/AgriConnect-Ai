import React, { useState, lazy, Suspense } from "react";
import {
  Sprout,
  ShoppingBag,
  Building,
  Package,
  Award,
  ShieldAlert,
  Truck,
  Layers,
  ShieldCheck,
  Banknote,
  BookOpen,
  GraduationCap,
  Bell,
  Search,
  Globe,
  Activity,
  Menu,
  CheckCircle,
  Leaf,
  Sparkles,
  Wifi,
  WifiOff,
  RefreshCw,
  BrainCircuit,
  Coins,
  Smartphone,
  Rocket,
  Calculator,
  Bot
} from "lucide-react";

import {
  UserRole,
  TelemetryReading,
  CropDiagnostic,
  MarketBid,
  SubsidyScheme,
  SupplierItem,
  LogisticsRoute,
  WarehouseSilo,
  InsurancePolicy,
  MicroLoan,
  ResearchPaper,
  FieldWorkshop
} from "./types";

// Import Role Views
const FarmerView = lazy(() => import("./components/role-views/FarmerView"));
const BuyerView = lazy(() => import("./components/role-views/BuyerView"));
const GovernmentView = lazy(() => import("./components/role-views/GovernmentView"));
const SupplierView = lazy(() => import("./components/role-views/SupplierView"));
const ExpertView = lazy(() => import("./components/role-views/ExpertView"));
const LogisticsAndWarehouseView = lazy(() => import("./components/role-views/LogisticsAndWarehouseView"));
const FinanceAndInsuranceView = lazy(() => import("./components/role-views/FinanceAndInsuranceView"));
const ResearchAndExtensionView = lazy(() => import("./components/role-views/ResearchAndExtensionView"));
const AdminView = lazy(() => import("./components/role-views/AdminView"));
const AIIoTIntegrationEngine = lazy(() => import("./components/AIIoTIntegrationEngine"));
const BlockchainCarbonEngine = lazy(() => import("./components/BlockchainCarbonEngine"));
const MobileAppSuite = lazy(() => import("./components/MobileAppSuite"));
const StartupPitchHub = lazy(() => import("./components/startup/StartupPitchHub").then((m) => ({ default: m.StartupPitchHub })));
const PrecisionAgronomyAndFintech = lazy(() => import("./components/startup/PrecisionAgronomyAndFintech").then((m) => ({ default: m.PrecisionAgronomyAndFintech })));
const LiveMarketplace = lazy(() => import("./components/marketplace/LiveMarketplace"));
const GeminiAIStudioSuite = lazy(() => import("./components/startup/GeminiAIStudioSuite").then((m) => ({ default: m.GeminiAIStudioSuite })));

// Floating AI Advisor
import AIConsultant from "./components/AIConsultant";

import MultilingualVoiceManager from "./components/MultilingualVoiceManager";
import SmartNotificationsPanel from "./components/SmartNotificationsPanel";
import { SupportedLanguage, t, LANGUAGES_INFO } from "./utils/translation";
import { useEffect } from "react";
import { registerSyncListener, triggerBackgroundSync } from "./utils/syncEngine";

// ==========================================
// SEED DATA FOR INTERACTIVE DEMO
// ==========================================

const INITIAL_TELEMETRY: TelemetryReading = {
  soilMoisture: 42,
  soilPh: 6.4,
  temperature: 28.5,
  humidity: 62,
  nitrogen: 45,
  phosphorus: 35,
  potassium: 58,
  timestamp: new Date().toLocaleTimeString()
};

const INITIAL_DIAGNOSTICS: CropDiagnostic[] = [
  {
    id: "diag-1",
    cropName: "Tomato",
    symptoms: "Lower leaves are yellowing with concentric rings and small dark spots. Yield falling.",
    status: "AI Diagnosed",
    aiDiagnosis: "Early Blight (Alternaria solani)",
    treatment: "Apply organic copper fungicide, prune lower leaves, and establish sub-surface drip irrigation to dry canopy.",
    confidence: 94,
    date: "2026-06-25"
  },
  {
    id: "diag-2",
    cropName: "Rice Paddy",
    symptoms: "Narrow, reddish-brown streaks parallel to leaf veins. Leaves drying out.",
    status: "Expert Verified",
    aiDiagnosis: "Bacterial Leaf Streak",
    treatment: "Use certified disease-free seeds, avoid excessive nitrogen, and apply copper hydroxide sprays.",
    confidence: 88,
    expertName: "Dr. Rachel Carter",
    expertNotes: "Validated symptoms. Advised immediate nitrogen restriction to preserve surrounding blocks.",
    date: "2026-06-22"
  }
];

const INITIAL_BIDS: MarketBid[] = [
  {
    id: "bid-1",
    cropType: "Premium Basmati Rice",
    quantity: 12,
    quality: "Grade A",
    pricePerTon: 640,
    buyerName: "Global Agrifood Corp",
    status: "Active",
    date: "2026-06-26"
  },
  {
    id: "bid-2",
    cropType: "Non-GMO Corn / Maize",
    quantity: 30,
    quality: "Grade B",
    pricePerTon: 310,
    buyerName: "Indus Milling Group",
    status: "Accepted",
    date: "2026-06-24"
  }
];

const INITIAL_SCHEMES: SubsidyScheme[] = [
  {
    id: "scheme-1",
    title: "Smallholder Solar Drip Irrigation Subsidy",
    category: "Climate Resilience",
    fundingAmount: 250000,
    approvedCount: 14,
    status: "Active",
    description: "Funding to provide 80% subsidy for solar-powered micro-irrigation pump kits for rural smallholders."
  },
  {
    id: "scheme-2",
    title: "Organic Bio-Fertilizer Transition Program",
    category: "Organic Transition",
    fundingAmount: 180000,
    approvedCount: 8,
    status: "Active",
    description: "Grants enabling cooperative groups to establish vermicomposting pits and transition off synthetic nitrogen."
  }
];

const INITIAL_SUPPLIER_ITEMS: SupplierItem[] = [
  {
    id: "sup-1",
    name: "Hybrid Wheat Seeds (PBW 343)",
    category: "Seeds",
    price: 1200,
    stock: 500,
    rating: 4.8,
    image: "",
    sku: "WHT-HYB-PBW",
    unit: "5kg Bag"
  } as any,
  {
    id: "sup-2",
    name: "Urea Fertilizer (Premium)",
    category: "Fertilizers",
    price: 800,
    stock: 1000,
    rating: 4.6,
    image: "",
    sku: "FERT-UREA-PREM",
    unit: "50kg Bag"
  } as any,
  {
    id: "sup-3",
    name: "Tractor (Mahindra 575)",
    category: "Machinery",
    price: 250000,
    stock: 5,
    rating: 4.9,
    image: "",
    sku: "MACH-TRACT-575",
    unit: "Unit"
  } as any,
  {
    id: "sup-4",
    name: "Organic Pesticide (Neem Oil)",
    category: "Fertilizers",
    price: 450,
    stock: 200,
    rating: 4.7,
    image: "",
    sku: "PEST-NEEM-OIL",
    unit: "Liter"
  } as any
];

const INITIAL_ROUTES: LogisticsRoute[] = [
  {
    id: "route-1",
    driverName: "Aarav Sharma",
    cargo: "Premium Basmati Rice Lot-4",
    weight: 4200,
    origin: "Andhra Pradesh Agrifarm Hub",
    destination: "Silo Terminal 4B",
    tempCelsius: 4.2,
    status: "In Transit",
    progress: 45
  },
  {
    id: "route-2",
    driverName: "Michael Chang",
    cargo: "Grade-A Organic Potatoes",
    weight: 2500,
    origin: "Himalayan Co-Op Cell",
    destination: "Cold Storage Unit 3A",
    tempCelsius: 3.8,
    status: "Dispatched",
    progress: 15
  }
];

const INITIAL_SILOS: WarehouseSilo[] = [
  {
    id: "silo-1",
    name: "Silo Terminal 4B (Grain Tower)",
    grainType: "Premium Basmati Rice",
    capacityTons: 5000,
    currentFillTons: 3800,
    tempCelsius: 16.5,
    humidityPercent: 12.2,
    status: "Optimal"
  },
  {
    id: "silo-2",
    name: "Silo Terminal 4C (Wheat Terminal)",
    grainType: "Winter Wheat",
    capacityTons: 4000,
    currentFillTons: 3950,
    tempCelsius: 24.2,
    humidityPercent: 14.8,
    status: "Warning"
  },
  {
    id: "silo-3",
    name: "Cold Vault 3A",
    grainType: "A-Grade Potatoes",
    capacityTons: 1500,
    currentFillTons: 450,
    tempCelsius: 4.5,
    humidityPercent: 88.0,
    status: "Optimal"
  }
];

const INITIAL_POLICIES: InsurancePolicy[] = [
  {
    id: "pol-1",
    farmerName: "Amir Patel",
    premiumAmount: 280,
    coverageAmount: 8500,
    riskScore: 32,
    status: "Active",
    cropInsured: "Basmati Rice Paddy"
  },
  {
    id: "pol-2",
    farmerName: "Vikram Singh",
    premiumAmount: 420,
    coverageAmount: 15000,
    riskScore: 68,
    status: "Active",
    cropInsured: "Rainfed Maize Crop"
  }
];

const INITIAL_LOANS: MicroLoan[] = [
  {
    id: "loan-1",
    farmerName: "Rajesh Grewal",
    requestedAmount: 5000,
    purpose: "Precision Solar Drip Pump Purchase",
    creditScore: 740,
    status: "Applied",
    date: "2026-06-27"
  },
  {
    id: "loan-2",
    farmerName: "Siddharth Roy",
    requestedAmount: 12000,
    purpose: "Acquire IoT Sensor Network Cluster",
    creditScore: 680,
    status: "Approved",
    date: "2026-06-25"
  }
];

const INITIAL_PAPERS: ResearchPaper[] = [
  {
    id: "paper-1",
    title: "Genetic Adaptations of Millet Varieties for Severe Drought Resilience",
    author: "Dr. Rachel Carter",
    domain: "Agro-Genomics",
    summary: "A study identifying key root architectural genes in pearl millet (Pennisetum glaucum) that enhance water extraction in sandy clay loam under sub-surface dry spells.",
    views: 142,
    date: "2026-06-15"
  },
  {
    id: "paper-2",
    title: "Optimizing N-P-K Soil Ratios for Multi-Cropping Micro-Ecosystems",
    author: "Prof. Kenneth Mercer",
    domain: "Precision Agronomy",
    summary: "Statistical analysis of soil sensor matrices, confirming crop rotation schedules reduce chemical fertilizer inputs by 38% while improving soil carbon indexes.",
    views: 98,
    date: "2026-06-11"
  }
];

const INITIAL_WORKSHOPS: FieldWorkshop[] = [
  {
    id: "ws-1",
    title: "Sustainable Vermicomposting and Soil Microbiology",
    location: "Andhra Pradesh Central Cooperative Hub",
    date: "2026-07-02",
    attendeesCount: 0,
    status: "Scheduled",
    objective: "Training farmers on setting up organic composting pits to substitute synthetic fertilizers."
  },
  {
    id: "ws-2",
    title: "Drip Irrigation Setup & Telemetry Maintenance",
    location: "Himalayan Seed Farm Hall",
    date: "2026-06-20",
    attendeesCount: 24,
    status: "Completed",
    objective: "Instruction on calibration and minor repair of solar pump kits and sub-surface tubes."
  }
];

const INITIAL_ACTORS = [
  { id: "act-1", name: "Amir Patel", email: "amir.patel@agrifarm.org", role: "Farmer", status: "Pending" },
  { id: "act-2", name: "Dr. Rachel Carter", email: "rachel.carter@agriuni.edu", role: "Agriculture Expert", status: "Approved" },
  { id: "act-3", name: "Global Agrifood Corp", email: "procure@globalfoods.com", role: "Buyer", status: "Approved" },
  { id: "act-4", name: "Indus Credit Bank", email: "agrofinance@indusbank.com", role: "Bank Officer", status: "Approved" }
];

export default function App() {
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.FARMER);
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>("English");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  const [activeRegionName, setActiveRegionName] = useState<string>("Local Smart Farm Region");

  // Real-time network and IndexedDB sync states
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = registerSyncListener((online, count) => {
      setIsOnline(online);
      setPendingSyncCount(count);
    });
    return unsubscribe;
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    const result = await triggerBackgroundSync();
    setIsSyncing(false);
    if (result.success) {
      alert(`Successfully synchronized ${result.syncedCount} queued actions from IndexedDB to the local caches!`);
    } else {
      alert(`Reconciled ${result.syncedCount} actions. Failed on some operations: ${result.errors.join(", ")}`);
    }
  };

  useEffect(() => {
    const handleLangChange = (e: any) => {
      setCurrentLanguage(e.detail);
    };
    const handleTelemetrySync = (e: any) => {
      if (e.detail?.location) {
        setActiveRegionName(`${e.detail.location}`);
      }
    };
    window.addEventListener("languageChange", handleLangChange);
    window.addEventListener("syncFarmTelemetry", handleTelemetrySync);
    const saved = localStorage.getItem("agri_connect_lang") as SupportedLanguage;
    if (saved) {
      setCurrentLanguage(saved);
    } else {
      // Auto-detect browser language and map to supported language
      const browserLang = (navigator.language || (navigator.languages && navigator.languages[0]) || "en-US").toLowerCase();
      let detected: SupportedLanguage = "English";
      
      if (browserLang.startsWith("te")) detected = "Telugu";
      else if (browserLang.startsWith("hi")) detected = "Hindi";
      else if (browserLang.startsWith("ta")) detected = "Tamil";
      else if (browserLang.startsWith("kn")) detected = "Kannada";
      else if (browserLang.startsWith("mr")) detected = "Marathi";
      else if (browserLang.startsWith("gu")) detected = "Gujarati";
      else if (browserLang.startsWith("bn")) detected = "Bengali";
      else if (browserLang.startsWith("pa")) detected = "Punjabi";
      else if (browserLang.startsWith("ml")) detected = "Malayalam";
      
      setCurrentLanguage(detected);
      localStorage.setItem("agri_connect_lang", detected);
      window.dispatchEvent(new CustomEvent("languageChange", { detail: detected }));
    }
    return () => {
      window.removeEventListener("languageChange", handleLangChange);
      window.removeEventListener("syncFarmTelemetry", handleTelemetrySync);
    };
  }, []);

  // Synchronized Global States
  const [telemetry, setTelemetry] = useState<TelemetryReading>(INITIAL_TELEMETRY);
  const [diagnostics, setDiagnostics] = useState<CropDiagnostic[]>(INITIAL_DIAGNOSTICS);
  const [bids, setBids] = useState<MarketBid[]>(INITIAL_BIDS);
  const [schemes, setSchemes] = useState<SubsidyScheme[]>(INITIAL_SCHEMES);
  const [supplierItems, setSupplierItems] = useState<SupplierItem[]>(INITIAL_SUPPLIER_ITEMS);
  const [routes, setRoutes] = useState<LogisticsRoute[]>(INITIAL_ROUTES);
  const [silos, setSilos] = useState<WarehouseSilo[]>(INITIAL_SILOS);
  const [policies, setPolicies] = useState<InsurancePolicy[]>(INITIAL_POLICIES);
  const [loans, setLoans] = useState<MicroLoan[]>(INITIAL_LOANS);
  const [papers, setPapers] = useState<ResearchPaper[]>(INITIAL_PAPERS);
  const [workshops, setWorkshops] = useState<FieldWorkshop[]>(INITIAL_WORKSHOPS);
  const [actors, setActors] = useState(INITIAL_ACTORS);

  // Navigation Sidebar Roles configuration
  const roleConfigs = [
    { role: UserRole.FARMER, icon: Sprout, color: "text-emerald-500 bg-emerald-50" },
    { role: UserRole.BUYER, icon: ShoppingBag, color: "text-teal-500 bg-teal-50" },
    { role: UserRole.GOVERNMENT, icon: Building, color: "text-amber-500 bg-amber-50" },
    { role: UserRole.SUPPLIER, icon: Package, color: "text-indigo-500 bg-indigo-50" },
    { role: UserRole.EXPERT, icon: Award, color: "text-rose-500 bg-rose-50" },
    { role: UserRole.LOGISTICS, icon: Truck, color: "text-blue-500 bg-blue-50" },
    { role: UserRole.WAREHOUSE, icon: Layers, color: "text-sky-500 bg-sky-50" },
    { role: UserRole.INSURANCE, icon: ShieldCheck, color: "text-cyan-500 bg-cyan-50" },
    { role: UserRole.BANK, icon: Banknote, color: "text-emerald-500 bg-emerald-50" },
    { role: UserRole.RESEARCHER, icon: BookOpen, color: "text-teal-500 bg-teal-50" },
    { role: UserRole.EXTENSION, icon: GraduationCap, color: "text-indigo-500 bg-indigo-50" },
    { role: UserRole.ADMIN, icon: ShieldAlert, color: "text-slate-500 bg-slate-50" },
    { role: UserRole.PRECISION_FINTECH, icon: Calculator, color: "text-emerald-600 bg-emerald-50" },
    { role: UserRole.AI_IOT, icon: BrainCircuit, color: "text-purple-500 bg-purple-50" },
    { role: UserRole.BLOCKCHAIN, icon: Coins, color: "text-emerald-500 bg-emerald-50" },
    { role: UserRole.MOBILE_APP, icon: Smartphone, color: "text-blue-500 bg-blue-50" },
    { role: UserRole.STARTUP_HUB, icon: Rocket, color: "text-rose-500 bg-rose-50" },
    { role: UserRole.LIVE_MARKET, icon: ShoppingBag, color: "text-emerald-600 bg-emerald-50" },
    { role: UserRole.GEMINI_SUITE, icon: Bot, color: "text-emerald-600 bg-emerald-50" }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col antialiased">
      {/* Dynamic Header */}
      <header className="h-20 bg-white border-b border-slate-200 px-8 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="AgriConnect AI logo" width={48} height={48} className="h-12 w-12 object-contain" />
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-slate-800 text-lg tracking-tight font-display">AgriConnect <span className="text-emerald-600">AI</span></h1>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded-full border border-emerald-100">
                {t("Co-Pilot Active", currentLanguage)}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-display">{t("Farm Ecosystem Intelligence", currentLanguage)}</p>
          </div>
        </div>

        {/* Global Hub Telemetry Ribbon (Contextual Awareness) */}
        <div className="hidden lg:flex items-center gap-6 text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-200/50 px-4 py-2 rounded-xl">
          <div className="flex items-center gap-1.5">
            <Globe className="h-4 w-4 text-emerald-600" />
            <span>{t("Co-Op Region", currentLanguage)}:</span>
            <span className="text-slate-800 font-bold">{activeRegionName}</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-emerald-600" />
            <span>{t("Telemetry", currentLanguage)}:</span>
            <span className="text-emerald-700 font-extrabold">{telemetry.soilMoisture}% Moisture</span>
          </div>
        </div>

        <div className="flex items-center gap-4 animate-fade-in">
          {/* Quick Language Switcher Dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-1.5 shadow-2xs transition-colors">
            <Globe className="h-4 w-4 text-emerald-600 animate-pulse" />
            <select
              id="global-language-switcher"
              value={currentLanguage}
              onChange={(e) => {
                const lang = e.target.value as SupportedLanguage;
                setCurrentLanguage(lang);
                localStorage.setItem("agri_connect_lang", lang);
                window.dispatchEvent(new CustomEvent("languageChange", { detail: lang }));
              }}
              className="bg-transparent border-none text-xs font-extrabold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              {Object.keys(LANGUAGES_INFO).map((langKey) => {
                const lang = langKey as SupportedLanguage;
                return (
                  <option key={lang} value={lang}>
                    {LANGUAGES_INFO[lang].flag} {lang} ({LANGUAGES_INFO[lang].native})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Real-time Network & Offline Sync Status Badge */}
          <button
            id="network-sync-status-badge"
            onClick={handleManualSync}
            disabled={isSyncing}
            className={`flex items-center gap-1.5 border px-3 py-1.5 rounded-xl shadow-2xs transition-all text-xs font-black uppercase tracking-wider ${
              isOnline
                ? pendingSyncCount > 0
                  ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 animate-pulse cursor-pointer"
                  : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
                : "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100 animate-pulse cursor-pointer"
            }`}
            title={
              isOnline
                ? pendingSyncCount > 0
                  ? `System online with ${pendingSyncCount} offline actions pending. Click to reconcile!`
                  : "System online & fully synchronized"
                : `System offline. ${pendingSyncCount} actions queued in IndexedDB.`
            }
          >
            {isOnline ? (
              <>
                <Wifi className="h-3.5 w-3.5 text-emerald-600" />
                <span>ONLINE</span>
                {pendingSyncCount > 0 && (
                  <span className="bg-amber-500 text-white rounded-full h-4 px-1 text-[9px] flex items-center justify-center font-bold">
                    {pendingSyncCount}
                  </span>
                )}
              </>
            ) : (
              <>
                <WifiOff className="h-3.5 w-3.5 text-rose-500 animate-pulse" />
                <span>OFFLINE</span>
                {pendingSyncCount > 0 && (
                  <span className="bg-rose-600 text-white rounded-full h-4 px-1 text-[9px] flex items-center justify-center font-bold">
                    {pendingSyncCount}
                  </span>
                )}
              </>
            )}
            <RefreshCw className={`h-3 w-3 ml-1 ${isSyncing ? "animate-spin text-slate-500" : "text-slate-400"}`} />
          </button>

          {/* Multilingual and Voice Support Hub */}
          <MultilingualVoiceManager activeRole={activeRole} setActiveRole={setActiveRole} />

          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-all cursor-pointer relative"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
            </button>
          </div>

          <div className="flex items-center gap-2.5 border-l border-slate-200 pl-4">
            <div className="h-9 w-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-inner uppercase">
              {activeRole.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800">{t(activeRole, currentLanguage)}</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">{t("Authorized Hub Profile", currentLanguage)}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Roles Navigation Sidebar */}
        <aside className="w-full md:w-72 bg-[#164e63] flex flex-col justify-between p-5 border-r border-slate-200/10 text-white shadow-xl">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest pl-2 font-display">{t("Select Ecosystem Role", currentLanguage)}</p>
              <p className="text-[10px] text-slate-400 pl-2 mt-0.5 mb-4 font-medium">{t("12 Authorized Platform Actors Available", currentLanguage)}</p>
              <div className="space-y-1 overflow-y-auto max-h-[500px] pr-1">
                {roleConfigs.map((cfg) => {
                  const Icon = cfg.icon;
                  const isActive = activeRole === cfg.role;
                  return (
                    <button
                      key={cfg.role}
                      onClick={() => setActiveRole(cfg.role)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer border ${
                        isActive
                          ? "bg-white/10 text-emerald-200 border-white/10 shadow-lg shadow-emerald-950/20"
                          : "text-slate-200 border-transparent hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg ${isActive ? "bg-emerald-500/20 text-emerald-300" : "bg-white/5 text-slate-300"}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="font-bold">{t(cfg.role, currentLanguage)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/10">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                <Leaf className="h-4 w-4 text-emerald-400" />
                <span>{t("Green Verified", currentLanguage)}</span>
              </div>
              <p className="text-[10px] text-slate-300 font-medium leading-relaxed">
                {t("Ecosystem governed strictly via agricultural policy audits & ESG standards.", currentLanguage)}
              </p>
            </div>
          </div>
        </aside>

        {/* Dynamic Center Workstation Dashboard */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-24 text-sm font-semibold text-emerald-700">
                🌱 Loading your workspace...
              </div>
            }
          >
          {activeRole === UserRole.FARMER && (
            <FarmerView
              telemetry={telemetry}
              diagnostics={diagnostics}
              onAddDiagnostic={(newRecord) => setDiagnostics((prev) => [newRecord, ...prev])}
              onUpdateDiagnostic={(id, updated) => setDiagnostics((prev) => prev.map((d) => (d.id === id ? { ...d, ...updated } : d)))}
            />
          )}

          {activeRole === UserRole.BUYER && (
            <BuyerView
              bids={bids}
              onAddBid={(newBid) => setBids((prev) => [newBid, ...prev])}
              onUpdateBid={(id, updated) => setBids((prev) => prev.map((b) => (b.id === id ? { ...b, ...updated } : b)))}
            />
          )}

          {activeRole === UserRole.GOVERNMENT && (
            <GovernmentView
              schemes={schemes}
              onAddScheme={(newScheme) => setSchemes((prev) => [newScheme, ...prev])}
              onUpdateScheme={(id, updated) => setSchemes((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)))}
            />
          )}

          {activeRole === UserRole.SUPPLIER && (
            <SupplierView
              items={supplierItems}
              onUpdateItem={(id, updated) => setSupplierItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updated } : item)))}
            />
          )}

          {activeRole === UserRole.EXPERT && (
            <ExpertView
              diagnostics={diagnostics}
              onUpdateDiagnostic={(id, updated) => setDiagnostics((prev) => prev.map((d) => (d.id === id ? { ...d, ...updated } : d)))}
            />
          )}

          {(activeRole === UserRole.LOGISTICS || activeRole === UserRole.WAREHOUSE) && (
            <LogisticsAndWarehouseView
              activeRole={activeRole}
              routes={routes}
              silos={silos}
              onAddRoute={(newRoute) => setRoutes((prev) => [newRoute, ...prev])}
              onUpdateRoute={(id, updated) => setRoutes((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated } : r)))}
              onUpdateSilo={(id, updated) => setSilos((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)))}
            />
          )}

          {(activeRole === UserRole.BANK || activeRole === UserRole.INSURANCE) && (
            <FinanceAndInsuranceView
              activeRole={activeRole}
              loans={loans}
              policies={policies}
              onAddLoan={(newLoan) => setLoans((prev) => [newLoan, ...prev])}
              onUpdateLoan={(id, updated) => setLoans((prev) => prev.map((l) => (l.id === id ? { ...l, ...updated } : l)))}
              onAddPolicy={(newPolicy) => setPolicies((prev) => [newPolicy, ...prev])}
              onUpdatePolicy={(id, updated) => setPolicies((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)))}
            />
          )}

          {(activeRole === UserRole.RESEARCHER || activeRole === UserRole.EXTENSION) && (
            <ResearchAndExtensionView
              activeRole={activeRole}
              papers={papers}
              workshops={workshops}
              onAddPaper={(newPaper) => setPapers((prev) => [newPaper, ...prev])}
              onAddWorkshop={(newWorkshop) => setWorkshops((prev) => [newWorkshop, ...prev])}
              onUpdateWorkshop={(id, updated) => setWorkshops((prev) => prev.map((ws) => (ws.id === id ? { ...ws, ...updated } : ws)))}
            />
          )}

          {activeRole === UserRole.ADMIN && (
            <AdminView
              actors={actors}
              onVerifyActor={(id, status) => setActors((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))}
            />
          )}

          {activeRole === UserRole.AI_IOT && (
            <AIIoTIntegrationEngine />
          )}

          {activeRole === UserRole.BLOCKCHAIN && (
            <BlockchainCarbonEngine />
          )}

          {activeRole === UserRole.MOBILE_APP && (
            <MobileAppSuite />
          )}

          {activeRole === UserRole.PRECISION_FINTECH && (
            <PrecisionAgronomyAndFintech />
          )}

          {activeRole === UserRole.STARTUP_HUB && (
            <StartupPitchHub />
          )}

          {activeRole === UserRole.LIVE_MARKET && (
            <LiveMarketplace />
          )}

          {activeRole === UserRole.GEMINI_SUITE && (
            <GeminiAIStudioSuite />
          )}
          </Suspense>
        </main>
      </div>

      {/* Floating AI Advisor widget */}
      <AIConsultant activeRole={activeRole} />

      {isNotificationsOpen && (
        <SmartNotificationsPanel onClose={() => setIsNotificationsOpen(false)} />
      )}
    </div>
  );
}
