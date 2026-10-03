import React, { useState, useEffect } from "react";
import {
  Wifi,
  WifiOff,
  Smartphone,
  Cpu,
  Database,
  DatabaseZap,
  BatteryCharging,
  Share2,
  Bell,
  RefreshCw,
  QrCode,
  Bluetooth,
  MapPin,
  Check,
  Play,
  RotateCcw,
  Maximize2,
  AlertCircle,
  Activity,
  CheckCircle2,
  Clipboard,
  ShieldAlert,
  Sparkles,
  Sprout,
  Award,
  HelpCircle,
  FileText,
  Clock,
  ArrowRight,
  TrendingUp,
  Atom,
  Plus,
  Trash2
} from "lucide-react";
import { CropDiagnostic } from "../../types";
import {
  getOfflineStats,
  saveOfflineItem,
  resetOfflineDB,
  getAllOfflineItems,
  queueOfflineAction,
  SEED_FARMERS,
  SEED_SCHEMES,
  SEED_REPORTS
} from "../../utils/offlineDB";
import { registerSyncListener, triggerBackgroundSync } from "../../utils/syncEngine";

interface OfflineAppHubProps {
  diagnostics?: CropDiagnostic[];
  onAddDiagnostic?: (newDiag: CropDiagnostic) => void;
}

interface QueuedDiagnostic {
  id: string;
  cropName: string;
  symptoms: string;
  aiModel: string;
  timestamp: string;
  status: "Queued (Offline)" | "Syncing" | "Synced" | "Failed";
  errorMsg?: string;
}

interface CachedTelemetry {
  id: string;
  nodeName: string;
  location: string;
  soilMoisture: number;
  temperature: number;
  ph: number;
  npk: string;
  timestamp: string;
  status: "Cached" | "Synced";
}

const INITIAL_CACHED_TELEMETRY: CachedTelemetry[] = [
  {
    id: "tele-1",
    nodeName: "Soil Hydration Probe Alpha",
    location: "Nandi Valley Block 2 - Quadrant A",
    soilMoisture: 42.5,
    temperature: 28.4,
    ph: 6.5,
    npk: "N: 135, P: 24, K: 210 mg/kg",
    timestamp: "Today 11:20 UTC (Last Cached)",
    status: "Cached"
  },
  {
    id: "tele-2",
    nodeName: "Canopy Air Microclimate Sensor",
    location: "Nandi Valley Block 2 - Quadrant B",
    soilMoisture: 45.1,
    temperature: 29.1,
    ph: 6.4,
    npk: "N: 130, P: 26, K: 205 mg/kg",
    timestamp: "Today 11:15 UTC (Last Cached)",
    status: "Cached"
  },
  {
    id: "tele-3",
    nodeName: "Sub-surface Aquifer Flow Tensiometer",
    location: "Gagan Hills Agro Union - Sector C",
    soilMoisture: 38.2,
    temperature: 27.8,
    ph: 6.7,
    npk: "N: 140, P: 22, K: 215 mg/kg",
    timestamp: "Today 11:00 UTC (Last Cached)",
    status: "Cached"
  }
];

export default function OfflineAppHub({ diagnostics = [], onAddDiagnostic }: OfflineAppHubProps) {
  // Check live network or simulate manual offline mode
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== "undefined" ? navigator.onLine : true;
  });
  const [isManualOffline, setIsManualOffline] = useState<boolean>(false);
  const [swStatus, setSwStatus] = useState<string>("Detecting...");

  // Storage and queues
  const [indexedDBCachedRows, setIndexedDBCachedRows] = useState<number>(450);
  const [offlineSyncQueue, setOfflineSyncQueue] = useState<number>(0);
  const [batteryOptimization, setBatteryOptimization] = useState<boolean>(true);
  const [dataSaverEnabled, setDataSaverEnabled] = useState<boolean>(true);
  const [pushSubscribed, setPushSubscribed] = useState<boolean>(true);
  const [bluetoothPaired, setBluetoothPaired] = useState<boolean>(true);
  const [nfcScanned, setNfcScanned] = useState<boolean>(false);
  const [offlineMapCached, setOfflineMapCached] = useState<boolean>(true);

  // Diagnostic Queue States
  const [offlineDiagQueue, setOfflineDiagQueue] = useState<QueuedDiagnostic[]>(() => {
    const cached = localStorage.getItem("agriconnect_offline_diag_queue");
    return cached ? JSON.parse(cached) : [];
  });
  const [diagCropName, setDiagCropName] = useState<string>("Tomato");
  const [diagSymptoms, setDiagSymptoms] = useState<string>("");
  const [diagModel, setDiagModel] = useState<string>("ResNet-50 Disease Classifier");
  const [isQueueSyncing, setIsQueueSyncing] = useState<boolean>(false);

  // Cached Telemetry Data
  const [cachedTelemetry, setCachedTelemetry] = useState<CachedTelemetry[]>(() => {
    const cached = localStorage.getItem("agriconnect_cached_telemetry");
    return cached ? JSON.parse(cached) : INITIAL_CACHED_TELEMETRY;
  });

  // Offline Farmer, Scheme and Report States
  const [offlineFarmers, setOfflineFarmers] = useState<any[]>([]);
  const [offlineSchemes, setOfflineSchemes] = useState<any[]>([]);
  const [offlineReports, setOfflineReports] = useState<any[]>([]);
  const [activeOfflineTab, setActiveOfflineTab] = useState<"farmers" | "schemes" | "reports">("farmers");

  // Offline Farmer Addition
  const [newFarmerName, setNewFarmerName] = useState("");
  const [newFarmerLocation, setNewFarmerLocation] = useState("Krishna Block");
  const [newFarmerCrops, setNewFarmerCrops] = useState("Basmati Rice");

  // Offline Scheme Application
  const [applySchemeTitle, setApplySchemeTitle] = useState("scheme-db-1");

  // Offline Report Submission
  const [newReportTitle, setNewReportTitle] = useState("");
  const [newReportCategory, setNewReportCategory] = useState("Executive Summary");
  const [newReportDesc, setNewReportDesc] = useState("");

  // Retro Feature Phone USSD simulator states
  const [phoneScreenText, setPhoneScreenText] = useState<string>("Enter USSD: *414# and click SEND");
  const [phoneInput, setPhoneInput] = useState<string>("*414#");
  const [isPhoneLoading, setIsPhoneLoading] = useState<boolean>(false);
  const [incomingSMS, setIncomingSMS] = useState<string | null>(null);

  // Track Service Worker Status
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then(() => {
        setSwStatus("Active & Protecting (Local Caching Enabled)");
      }).catch(() => {
        setSwStatus("Ready (Awaiting Activation)");
      });

      // Check current registration state
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) {
          if (reg.active) {
            setSwStatus("Active & Protecting (Local Caching Enabled)");
          } else if (reg.installing) {
            setSwStatus("Installing...");
          } else if (reg.waiting) {
            setSwStatus("Waiting for Activation...");
          }
        } else {
          setSwStatus("Unregistered");
        }
      });
    } else {
      setSwStatus("Not supported in this browser");
    }
  }, []);

  // Listen to physical internet connection changes
  useEffect(() => {
    const handleOnline = () => {
      if (!isManualOffline) {
        setIsOnline(true);
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isManualOffline]);

  // Hook up real IndexedDB metrics and synchronization listener
  useEffect(() => {
    const fetchRealStats = async () => {
      try {
        const stats = await getOfflineStats();
        // Fallback to initial seed if empty
        if (stats.totalRecords === 0) {
          // Auto-seed IndexedDB with standard products/orders/customers if first time
          const prods = JSON.parse(localStorage.getItem("agriconnect_supplier_items") || "[]");
          const ords = JSON.parse(localStorage.getItem("agriconnect_supplier_orders") || "[]");
          const custs = JSON.parse(localStorage.getItem("agriconnect_supplier_customers") || "[]");
          await resetOfflineDB(prods, ords, custs);
          const newStats = await getOfflineStats();
          setIndexedDBCachedRows(newStats.totalRecords);
        } else {
          setIndexedDBCachedRows(stats.totalRecords);
        }
        setOfflineSyncQueue(stats.queueCount);

        // Load offline farmers, schemes, reports from IndexedDB
        const fList = await getAllOfflineItems<any>("farmers");
        const sList = await getAllOfflineItems<any>("schemes");
        const rList = await getAllOfflineItems<any>("reports");
        setOfflineFarmers(fList);
        setOfflineSchemes(sList);
        setOfflineReports(rList);
      } catch (err) {
        console.error("IndexedDB initialization error:", err);
      }
    };
    fetchRealStats();

    // Subscribe to background sync events
    const unsubscribe = registerSyncListener((online, pendingCount) => {
      setOfflineSyncQueue(pendingCount);
      getOfflineStats().then((stats) => {
        setIndexedDBCachedRows(stats.totalRecords);
      });
    });

    const handleGlobalSyncComplete = () => {
      fetchRealStats();
    };

    window.addEventListener("agriconnect_offline_sync_completed", handleGlobalSyncComplete);

    return () => {
      unsubscribe();
      window.removeEventListener("agriconnect_offline_sync_completed", handleGlobalSyncComplete);
    };
  }, []);

  // Persist local diagnostic queue
  useEffect(() => {
    localStorage.setItem("agriconnect_offline_diag_queue", JSON.stringify(offlineDiagQueue));
  }, [offlineDiagQueue]);

  // Persist cached telemetry
  useEffect(() => {
    localStorage.setItem("agriconnect_cached_telemetry", JSON.stringify(cachedTelemetry));
  }, [cachedTelemetry]);

  // Toggle Network simulation
  const handleNetworkToggle = () => {
    const nextManualState = !isManualOffline;
    setIsManualOffline(nextManualState);
    
    if (nextManualState) {
      setIsOnline(false);
    } else {
      setIsOnline(navigator.onLine);
    }
  };

  // Save a dynamic telemetry event in IndexedDB (products store for catalog caching)
  const logOfflineTelemetryAction = async () => {
    const id = `tele-event-${Date.now()}`;
    const telemetryProduct = {
      id,
      name: `Sensed Node Data (${new Date().toLocaleTimeString()})`,
      category: "Telemetry Logs",
      stock: Math.floor(Math.random() * 80) + 20,
      rating: 4.8,
      price: 1500
    };

    if (!isOnline) {
      // Offline action: save to syncQueue
      await saveOfflineItem("syncQueue", {
        id: `sync-${id}`,
        type: "ADD_PRODUCT",
        storeName: "products",
        payload: telemetryProduct,
        timestamp: Date.now(),
        synced: false
      });
      const stats = await getOfflineStats();
      setOfflineSyncQueue(stats.queueCount);
    } else {
      // Online action: save directly to products store
      await saveOfflineItem("products", telemetryProduct);
      const stats = await getOfflineStats();
      setIndexedDBCachedRows(stats.totalRecords);
    }
  };

  // Simulate USSD/SMS fallback execution
  const triggerUSSDCommand = () => {
    setIsPhoneLoading(true);
    setIncomingSMS(null);

    setTimeout(() => {
      setIsPhoneLoading(false);
      const code = phoneInput.trim();
      if (code === "*414#") {
        setPhoneScreenText(
          "AgriConnect Menu:\n1. Spot Market Prices\n2. Soil Advisory\n3. Weather Alerts\n\nReply with menu index:"
        );
      } else if (code === "1") {
        setPhoneScreenText(
          "Spot Market Prices:\n- Basmati Rice: ₹4,800/q\n- Durum Wheat: ₹2,450/q\n\nReply 0 to Go Back"
        );
        setTimeout(() => {
          setIncomingSMS(
            "💬 FALLBACK SMS RECEIVED:\nAgriConnect-Alert: Guntur Delta basmati bids jumped 3.5% this morning. Lock bids now via *414*4#."
          );
        }, 1500);
      } else if (code === "2") {
        setPhoneScreenText(
          "Soil Advisory Sensed:\n- Moisture: 42% (Optimal)\n- Nitrogen: Low (Apply organic bio-mix in 3 days)"
        );
      } else if (code === "3") {
        setPhoneScreenText(
          "Weather Emergency Alert:\n- Severe Heatwave warning for Andhra Pradesh Plain. Avoid field labor between 11 AM - 4 PM."
        );
      } else if (code === "0") {
        setPhoneScreenText(
          "AgriConnect Menu:\n1. Spot Market Prices\n2. Soil Advisory\n3. Weather Alerts"
        );
      } else {
        setPhoneScreenText("USSD Connection Error.\nInvalid code. Use *414# for main menu.");
      }
    }, 800);
  };

  // Queue a diagnostic entry locally
  const handleQueueDiagnostic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagSymptoms.trim()) {
      alert("Please specify crop symptoms to queue diagnostic.");
      return;
    }

    const newQueued: QueuedDiagnostic = {
      id: `offline-diag-${Date.now()}`,
      cropName: diagCropName,
      symptoms: diagSymptoms,
      aiModel: diagModel,
      timestamp: new Date().toLocaleTimeString(),
      status: "Queued (Offline)"
    };

    setOfflineDiagQueue((prev) => [newQueued, ...prev]);
    setDiagSymptoms("");

    // Double-write queued diagnostic to IndexedDB orders store
    await saveOfflineItem("orders", {
      id: newQueued.id,
      customerName: "Offline Queue Diagnostics",
      productName: `${newQueued.cropName} Diagnosis Request`,
      quantity: 1,
      totalPrice: 0,
      status: "pending",
      date: newQueued.timestamp
    });

    const stats = await getOfflineStats();
    setIndexedDBCachedRows(stats.totalRecords);
  };

  // Process and Sync diagnostic queue to the backend server
  const handleSyncQueue = async () => {
    if (!isOnline) {
      alert("Cannot sync queue while offline. Please connect to a stable network.");
      return;
    }

    if (offlineDiagQueue.length === 0) {
      alert("Offline diagnostics queue is empty!");
      return;
    }

    setIsQueueSyncing(true);

    // Deep copy of current queue to update states
    let updatedQueue = [...offlineDiagQueue];
    let syncSuccessCount = 0;

    for (let i = 0; i < updatedQueue.length; i++) {
      const item = updatedQueue[i];
      if (item.status === "Synced") continue;

      updatedQueue[i] = { ...item, status: "Syncing" };
      setOfflineDiagQueue([...updatedQueue]);

      try {
        const response = await fetch("/api/diagnose", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cropName: item.cropName,
            symptoms: item.symptoms,
            aiModel: item.aiModel
          })
        });

        if (response.ok) {
          const data = await response.json();
          const newRecord: CropDiagnostic = {
            id: `diag-${Date.now()}-${i}`,
            cropName: item.cropName,
            symptoms: item.symptoms,
            status: "AI Diagnosed",
            aiDiagnosis: data.diseaseName || "Leaf Blast (Magnaporthe oryzae)",
            treatment: `Chemical: ${data.treatments?.chemicalPesticide || "N/A"}. Organic: ${data.treatments?.organicTreatment || "N/A"}`,
            confidence: data.confidenceScore || 90,
            date: new Date().toLocaleDateString()
          };

          // Append to master list in parent if available
          if (onAddDiagnostic) {
            onAddDiagnostic(newRecord);
          }

          updatedQueue[i] = { ...item, status: "Synced" };
          syncSuccessCount++;
        } else {
          updatedQueue[i] = { ...item, status: "Failed", errorMsg: "Server responded with error" };
        }
      } catch (err) {
        console.error("Failed to sync offline diagnostic entry:", err);
        updatedQueue[i] = { ...item, status: "Failed", errorMsg: "Network timeout/connection refused" };
      }

      setOfflineDiagQueue([...updatedQueue]);
      // Small visual delay between syncs
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    setIsQueueSyncing(false);

    if (syncSuccessCount > 0) {
      // Retain only failed ones or clear list if all synced successfully
      setTimeout(() => {
        setOfflineDiagQueue((prev) => prev.filter((item) => item.status !== "Synced"));
        alert(`Successfully synchronized ${syncSuccessCount} queued diagnostic records with master ledger!`);
      }, 1500);
    } else {
      alert("Failed to synchronize offline queue. Please verify your connection or try again later.");
    }
  };

  // Remove individual queued diagnostic
  const handleRemoveQueued = (id: string) => {
    setOfflineDiagQueue((prev) => prev.filter((item) => item.id !== id));
  };

  // Add a mock telemetry reading offline
  const handleAddCachedTelemetry = async () => {
    const moisture = Math.floor(Math.random() * 25) + 30; // 30-55%
    const temp = Number((Math.random() * 5 + 25).toFixed(1)); // 25-30 °C
    const ph = Number((Math.random() * 1.2 + 5.8).toFixed(1)); // 5.8-7.0
    const n = Math.floor(Math.random() * 40) + 110;
    const p = Math.floor(Math.random() * 10) + 18;
    const k = Math.floor(Math.random() * 30) + 190;

    const newReading: CachedTelemetry = {
      id: `tele-${Date.now()}`,
      nodeName: `Offline Hydration Probe ${String.fromCharCode(65 + cachedTelemetry.length)}`,
      location: "Local Sandbox Field Block 2",
      soilMoisture: moisture,
      temperature: temp,
      ph: ph,
      npk: `N: ${n}, P: ${p}, K: ${k} mg/kg`,
      timestamp: `Today ${new Date().toLocaleTimeString().slice(0, 5)} UTC (Local Saved)`,
      status: "Cached"
    };

    setCachedTelemetry([newReading, ...cachedTelemetry]);

    // Also cache telemetry records in IndexedDB products store
    await saveOfflineItem("products", {
      id: newReading.id,
      name: newReading.nodeName,
      category: "Telemetry Logs",
      stock: Math.floor(newReading.soilMoisture),
      rating: newReading.ph,
      price: newReading.temperature
    });

    const stats = await getOfflineStats();
    setIndexedDBCachedRows(stats.totalRecords);
  };

  // Offline Farmer Addition
  const handleAddFarmerOffline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFarmerName.trim()) return;

    const id = `FMR-${Date.now()}`;
    const farmerObj = {
      id,
      name: newFarmerName,
      email: `${newFarmerName.toLowerCase().replace(/\s+/g, ".")}@agrifarm.org`,
      location: newFarmerLocation,
      phone: "+91 98765-" + Math.floor(10000 + Math.random() * 90000),
      joinedDate: new Date().toISOString().split("T")[0],
      landSizeAcres: Number((Math.random() * 10 + 2).toFixed(1)),
      crops: newFarmerCrops
    };

    if (!isOnline) {
      await queueOfflineAction({
        type: "ADD_FARMER",
        storeName: "farmers",
        payload: farmerObj
      });
      alert(`Farmer "${newFarmerName}" registration queued offline! This will automatically synchronize upon re-establishing network.`);
    } else {
      await saveOfflineItem("farmers", farmerObj);
      alert(`Farmer "${newFarmerName}" registered successfully!`);
    }

    setNewFarmerName("");
    const fList = await getAllOfflineItems<any>("farmers");
    setOfflineFarmers(fList);
    const statsObj = await getOfflineStats();
    setIndexedDBCachedRows(statsObj.totalRecords);
    setOfflineSyncQueue(statsObj.queueCount);
  };

  // Offline Scheme Application
  const handleApplySchemeOffline = async () => {
    const selectedScheme = offlineSchemes.find(s => s.id === applySchemeTitle) || SEED_SCHEMES[0] || { title: "PM-KISAN", category: "DBT", fundingAmount: 6000, approvedCount: 14000, description: "PM-KISAN Subsidy" };
    const id = `SCH-APP-${Date.now()}`;
    const schemeAppObj = {
      id,
      title: selectedScheme.title,
      category: selectedScheme.category,
      fundingAmount: selectedScheme.fundingAmount,
      approvedCount: selectedScheme.approvedCount + 1,
      status: "Active",
      description: selectedScheme.description
    };

    if (!isOnline) {
      await queueOfflineAction({
        type: "ADD_SCHEME",
        storeName: "schemes",
        payload: schemeAppObj
      });
      alert(`Scheme application for "${selectedScheme.title}" queued offline!`);
    } else {
      await saveOfflineItem("schemes", schemeAppObj);
      alert(`Scheme application for "${selectedScheme.title}" submitted successfully!`);
    }

    const sList = await getAllOfflineItems<any>("schemes");
    setOfflineSchemes(sList);
    const statsObj = await getOfflineStats();
    setIndexedDBCachedRows(statsObj.totalRecords);
    setOfflineSyncQueue(statsObj.queueCount);
  };

  // Offline Report Submission
  const handleAddReportOffline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReportTitle.trim() || !newReportDesc.trim()) return;

    const id = `REP-${Date.now()}`;
    const reportObj = {
      id,
      title: newReportTitle,
      category: newReportCategory,
      date: new Date().toISOString().split("T")[0],
      description: newReportDesc
    };

    if (!isOnline) {
      await queueOfflineAction({
        type: "ADD_REPORT",
        storeName: "reports",
        payload: reportObj
      });
      alert(`Report "${newReportTitle}" submission queued offline!`);
    } else {
      await saveOfflineItem("reports", reportObj);
      alert(`Report "${newReportTitle}" submitted successfully!`);
    }

    setNewReportTitle("");
    setNewReportDesc("");
    const rList = await getAllOfflineItems<any>("reports");
    setOfflineReports(rList);
    const statsObj = await getOfflineStats();
    setIndexedDBCachedRows(statsObj.totalRecords);
    setOfflineSyncQueue(statsObj.queueCount);
  };

  return (
    <div id="offline-app-hub" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      
      {/* Visual Header */}
      <div className="border-b border-slate-100 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
            <Smartphone className="h-3.5 w-3.5 text-emerald-600 animate-pulse" /> Official Hybrid Mobile & Offline Hub
          </span>
          <h2 className="text-slate-800 text-lg font-black uppercase tracking-tight mt-2 flex items-center gap-2">
            📱 Progressive Web App (PWA) offline co-pilot
          </h2>
          <p className="text-slate-500 text-xs font-semibold">
            Manage Service Worker assets cache, view offline local telemetry, and queue diagnostic requests securely.
          </p>
        </div>

        {/* Network Toggle Button */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={handleNetworkToggle}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer flex items-center justify-center gap-2 border ${
              isOnline
                ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                : "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100"
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="h-4 w-4 text-emerald-600 animate-pulse" /> Live Online
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-rose-600 animate-pulse" /> Offline Mode
              </>
            )}
          </button>
          {isManualOffline && (
            <span className="text-[10px] text-rose-500 font-extrabold flex items-center justify-center bg-rose-50 border border-rose-100 rounded-lg px-2">
              Simulated unstable network
            </span>
          )}
        </div>
      </div>

      {/* Service Worker Status Board */}
      <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
            <Atom className="h-5 w-5 animate-spin" />
          </div>
          <div>
            <span className="text-[8px] font-black text-slate-400 uppercase block tracking-wider">Service Worker System Engine</span>
            <span className="text-xs font-bold text-slate-700 font-mono">{swStatus}</span>
          </div>
        </div>
        <div className="text-[10px] text-slate-400 font-semibold max-w-sm">
          Service worker caches all pages, javascript blocks and CSS styling assets so the app works flawlessly on zero network connectivity.
        </div>
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Hand: Diagnostic Form and Queued Diagnoses */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Form to Queue Diagnostic Offline */}
            <div className="bg-slate-50/50 border border-slate-150 p-5 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                  <DatabaseZap className="h-4.5 w-4.5 text-indigo-600" />
                  Queue Offline Diagnostic Scan
                </h3>
                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${isOnline ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600 animate-pulse"}`}>
                  {isOnline ? "Auto-Forward Enabled" : "Queue Mode Active"}
                </span>
              </div>

              <p className="text-[10.5px] text-slate-400 font-semibold leading-relaxed">
                If the field has unstable signal, inputs are cached inside local browser storage. The scan is queued and synchronized as soon as network is restored.
              </p>

              <form onSubmit={handleQueueDiagnostic} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-[8.5px] font-black text-slate-400 uppercase">Crop Classification</label>
                    <select
                      value={diagCropName}
                      onChange={(e) => setDiagCropName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[11px] font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="Tomato">🍅 Tomato</option>
                      <option value="Wheat">🌾 Wheat</option>
                      <option value="Paddy/Rice">🍚 Paddy/Rice</option>
                      <option value="Maize">🌽 Maize</option>
                      <option value="Mustard">🌱 Mustard</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[8.5px] font-black text-slate-400 uppercase">Detector Pipeline</label>
                    <select
                      value={diagModel}
                      onChange={(e) => setDiagModel(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[11px] font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="ResNet-50 Disease Classifier">ResNet-50 CNN</option>
                      <option value="MobileNet Soil Pathologist">MobileNet v3</option>
                      <option value="YOLOv8 Pest Segmenter">YOLOv8 segment</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[8.5px] font-black text-slate-400 uppercase">Describe Symptoms</label>
                  <textarea
                    rows={2}
                    required
                    value={diagSymptoms}
                    onChange={(e) => setDiagSymptoms(e.target.value)}
                    placeholder="e.g. Concentric brown rings on leaves, yellow margins, mold spots..."
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {isOnline ? "Submit Live Diagnostic" : "Queue Diagnostic (Offline)"}
                </button>
              </form>
            </div>

            {/* Offline Diagnostic Sync Queue List */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                  <Clock className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
                  Offline Sync Ledger ({offlineDiagQueue.length})
                </h3>
                {offlineDiagQueue.length > 0 && (
                  <button
                    disabled={isQueueSyncing}
                    onClick={handleSyncQueue}
                    className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all ${
                      isOnline
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <RefreshCw className={`h-3 w-3 ${isQueueSyncing ? "animate-spin" : ""}`} />
                    {isQueueSyncing ? "Syncing..." : "Sync Queue"}
                  </button>
                )}
              </div>

              {offlineDiagQueue.length === 0 ? (
                <div className="h-[180px] flex flex-col items-center justify-center text-center p-4 bg-slate-50 border border-dashed rounded-xl space-y-2">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                  <p className="text-[11px] font-bold text-slate-600">All local diagnostic sessions synchronized.</p>
                  <p className="text-[9.5px] text-slate-400">Queue will display entries filed when operating on offline grid sectors.</p>
                </div>
              ) : (
                <div className="h-[180px] overflow-y-auto divide-y divide-slate-100 pr-1 space-y-2">
                  {offlineDiagQueue.map((item) => (
                    <div key={item.id} className="pt-2 pb-1.5 flex justify-between items-start gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-[11px] text-slate-800">
                            {item.cropName === "Tomato" ? "🍅" : item.cropName === "Wheat" ? "🌾" : "🌱"} {item.cropName}
                          </span>
                          <span className={`text-[8px] font-black px-1 rounded ${
                            item.status === "Synced"
                              ? "bg-emerald-50 text-emerald-600"
                              : item.status === "Syncing"
                              ? "bg-indigo-50 text-indigo-600 animate-pulse"
                              : item.status === "Failed"
                              ? "bg-rose-50 text-rose-600"
                              : "bg-amber-50 text-amber-600"
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium italic truncate max-w-[180px]">
                          "{item.symptoms}"
                        </p>
                        <span className="text-[8.5px] block text-slate-400 font-semibold">{item.timestamp} • {item.aiModel}</span>
                        {item.errorMsg && (
                          <span className="text-[8px] text-rose-500 block font-bold">Error: {item.errorMsg}</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveQueued(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-50 cursor-pointer"
                        title="Remove entry from queue"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Cached Telemetry Inspector Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                  <Activity className="h-4.5 w-4.5 text-emerald-500" />
                  Service Worker Offline Telemetry Caches
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold">
                  Last downloaded telemetry records from hardware probes. Safe to view with no network.
                </p>
              </div>
              <button
                onClick={handleAddCachedTelemetry}
                className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 rounded-lg text-[10px] font-extrabold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Offline Reading
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cachedTelemetry.map((item) => (
                <div key={item.id} className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl space-y-2 hover:border-slate-300 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-wide block">Node Receiver</span>
                      <h4 className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[150px]">{item.nodeName}</h4>
                    </div>
                    <span className="text-[8px] bg-emerald-50 border border-emerald-200 text-emerald-700 font-black px-1.5 py-0.2 rounded uppercase">
                      Offline Cached
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[10px] font-semibold text-slate-500 pt-1.5 border-t border-slate-200/50">
                    <div>
                      <span className="block text-[8px] text-slate-400 font-bold uppercase">Moisture</span>
                      <span className="text-slate-800 font-bold font-mono">{item.soilMoisture}% VWC</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-slate-400 font-bold uppercase">Soil Temp</span>
                      <span className="text-slate-800 font-bold font-mono">{item.temperature}°C</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-slate-400 font-bold uppercase">Soil pH</span>
                      <span className="text-slate-800 font-bold font-mono">{item.ph} pH</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-slate-400 font-bold uppercase">NPK Index</span>
                      <span className="text-slate-700 font-bold text-[9px] truncate max-w-[70px]">{item.npk.split(" ")[0]}</span>
                    </div>
                  </div>

                  <div className="text-[8.5px] text-slate-400 font-bold border-t border-slate-200/50 pt-1.5 flex justify-between items-center">
                    <span>📍 {item.location.split(" - ")[0]}</span>
                    <span>{item.timestamp.split(" (")[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* IndexedDB Offline Collections Viewer */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-100 pb-2.5 gap-2">
              <div>
                <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                  <Database className="h-4.5 w-4.5 text-indigo-600" />
                  IndexedDB Offline Collections Viewer
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold">
                  Manage independent local datasets cached for complete zero-network reliability.
                </p>
              </div>

              {/* Sub-tabs inside the offline viewer */}
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {(["farmers", "schemes", "reports"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveOfflineTab(tab)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      activeOfflineTab === tab
                        ? "bg-white text-indigo-700 shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab} ({tab === "farmers" ? offlineFarmers.length : tab === "schemes" ? offlineSchemes.length : offlineReports.length})
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-tab contents */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              
              {/* Left side of viewer: List of cached items */}
              <div className="md:col-span-7 space-y-3">
                <div className="max-h-[320px] overflow-y-auto space-y-2 pr-1">
                  {activeOfflineTab === "farmers" && (
                    offlineFarmers.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No farmers stored offline.</p>
                    ) : (
                      offlineFarmers.map((f: any) => (
                        <div key={f.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-800">{f.name}</span>
                            <span className="text-[8px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-black uppercase">{f.id}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-semibold space-y-0.5">
                            <p>📍 Location: <span className="text-slate-700">{f.location}</span></p>
                            <p>📞 Phone: <span className="text-slate-700">{f.phone}</span></p>
                            <p>🌾 Crops: <span className="text-emerald-700 font-bold">{f.crops}</span></p>
                            <p className="text-[8.5px] text-slate-400">Registered: {f.joinedDate}</p>
                          </div>
                        </div>
                      ))
                    )
                  )}

                  {activeOfflineTab === "schemes" && (
                    offlineSchemes.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No schemes stored offline.</p>
                    ) : (
                      offlineSchemes.map((s: any) => (
                        <div key={s.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1.5">
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-xs font-bold text-slate-800 leading-tight">{s.title}</span>
                            <span className="text-[8px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-black uppercase shrink-0">{s.id}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">{s.description}</p>
                          <div className="flex justify-between items-center text-[9px] font-black uppercase pt-1 border-t border-slate-200/50 text-slate-400">
                            <span>Category: {s.category}</span>
                            <span className="text-indigo-600 font-bold font-mono">Funding: ₹{s.fundingAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      ))
                    )
                  )}

                  {activeOfflineTab === "reports" && (
                    offlineReports.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No reports stored offline.</p>
                    ) : (
                      offlineReports.map((r: any) => (
                        <div key={r.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-800">{r.title}</span>
                            <span className="text-[8px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-black uppercase">{r.id}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">{r.description}</p>
                          <div className="flex justify-between text-[8.5px] text-slate-400 font-bold">
                            <span>Category: {r.category}</span>
                            <span>Date: {r.date}</span>
                          </div>
                        </div>
                      ))
                    )
                  )}
                </div>
              </div>

              {/* Right side of viewer: Offline registration/submission form */}
              <div className="md:col-span-5 bg-slate-50/50 border border-slate-150 rounded-xl p-4 space-y-3">
                <div className="border-b border-slate-100 pb-1.5">
                  <span className="text-[8.5px] font-black uppercase text-indigo-600 tracking-wider">
                    {isOnline ? "Online Submission" : "Simulate Offline Queue"}
                  </span>
                  <h4 className="text-xs font-extrabold text-slate-700">
                    {activeOfflineTab === "farmers" ? "Quick Register Farmer" : activeOfflineTab === "schemes" ? "Quick Apply to Scheme" : "Quick Submit Report"}
                  </h4>
                </div>

                {activeOfflineTab === "farmers" && (
                  <form onSubmit={handleAddFarmerOffline} className="space-y-2.5">
                    <div className="space-y-0.5">
                      <label className="block text-[8px] font-black text-slate-400 uppercase">Full Name</label>
                      <input
                        type="text"
                        required
                        value={newFarmerName}
                        onChange={(e) => setNewFarmerName(e.target.value)}
                        placeholder="e.g. Ramesh Devadiga"
                        className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[11px] font-semibold text-slate-700 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-0.5">
                        <label className="block text-[8px] font-black text-slate-400 uppercase">Block Jurisdiction</label>
                        <select
                          value={newFarmerLocation}
                          onChange={(e) => setNewFarmerLocation(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[11px] font-semibold text-slate-700 focus:outline-none"
                        >
                          <option value="Krishna Block">Krishna Block</option>
                          <option value="Guntur Block">Guntur Block</option>
                          <option value="Karnal Block">Karnal Block</option>
                          <option value="Vijayawada Block B">Vijayawada Block B</option>
                        </select>
                      </div>
                      <div className="space-y-0.5">
                        <label className="block text-[8px] font-black text-slate-400 uppercase">Primary Crops</label>
                        <select
                          value={newFarmerCrops}
                          onChange={(e) => setNewFarmerCrops(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[11px] font-semibold text-slate-700 focus:outline-none"
                        >
                          <option value="Basmati Rice">Basmati Rice</option>
                          <option value="Hybrid Wheat & Maize">Hybrid Wheat & Maize</option>
                          <option value="Organic Tomatoes">Organic Tomatoes</option>
                          <option value="Sugarcane">Sugarcane</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] py-2 rounded-lg transition-all cursor-pointer uppercase tracking-wider font-mono"
                    >
                      {isOnline ? "Register Farmer" : "Register Farmer (Offline Queue)"}
                    </button>
                  </form>
                )}

                {activeOfflineTab === "schemes" && (
                  <div className="space-y-2.5">
                    <div className="space-y-0.5">
                      <label className="block text-[8px] font-black text-slate-400 uppercase">Select Target Scheme</label>
                      <select
                        value={applySchemeTitle}
                        onChange={(e) => setApplySchemeTitle(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[11px] font-semibold text-slate-700 focus:outline-none"
                      >
                        {offlineSchemes.map((s: any) => (
                          <option key={s.id} value={s.id}>{s.title.split(" (")[0]}</option>
                        ))}
                      </select>
                    </div>
                    <p className="text-[9.5px] text-slate-400 font-semibold leading-relaxed">
                      This will queue a formal subsidy or program application offline inside the IndexedDB sync registry, which resolves automatically upon reconnecting.
                    </p>
                    <button
                      type="button"
                      onClick={handleApplySchemeOffline}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] py-2 rounded-lg transition-all cursor-pointer uppercase tracking-wider font-mono"
                    >
                      {isOnline ? "Apply Scheme" : "Apply Scheme (Offline Queue)"}
                    </button>
                  </div>
                )}

                {activeOfflineTab === "reports" && (
                  <form onSubmit={handleAddReportOffline} className="space-y-2.5">
                    <div className="space-y-0.5">
                      <label className="block text-[8px] font-black text-slate-400 uppercase">Report Title</label>
                      <input
                        type="text"
                        required
                        value={newReportTitle}
                        onChange={(e) => setNewReportTitle(e.target.value)}
                        placeholder="e.g. Village Water Access Audit"
                        className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[11px] font-semibold text-slate-700 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="block text-[8px] font-black text-slate-400 uppercase">Report Category</label>
                      <select
                        value={newReportCategory}
                        onChange={(e) => setNewReportCategory(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[11px] font-semibold text-slate-700 focus:outline-none"
                      >
                        <option value="Executive Summary">Executive Summary</option>
                        <option value="Yield Analytics">Yield Analytics</option>
                        <option value="Disaster Management">Disaster Management</option>
                        <option value="Soil Chemistry">Soil Chemistry</option>
                      </select>
                    </div>
                    <div className="space-y-0.5">
                      <label className="block text-[8px] font-black text-slate-400 uppercase">Summary Findings</label>
                      <textarea
                        rows={2}
                        required
                        value={newReportDesc}
                        onChange={(e) => setNewReportDesc(e.target.value)}
                        placeholder="Detail the metrics, block indices, and general outcome findings..."
                        className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[10.5px] text-slate-700 focus:outline-none"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] py-2 rounded-lg transition-all cursor-pointer uppercase tracking-wider font-mono"
                    >
                      {isOnline ? "Submit Report" : "Submit Report (Offline Queue)"}
                    </button>
                  </form>
                )}

              </div>

            </div>
          </div>

        </div>

        {/* Right Side: Feature Phone Console and PWA System Settings */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* USSD & SMS Feature Phone Console */}
          <div className="flex flex-col items-center p-4 bg-slate-50 border border-slate-150 rounded-2xl">
            <div className="text-center mb-3">
              <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5 justify-center">
                📟 USSD & SMS Feature Phone Console
              </h4>
              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                Simulates cellular-level fallback if smartphone internet is completely disabled.
              </p>
            </div>

            {/* Interactive Retro Phone Chassis */}
            <div className="w-[200px] bg-slate-800 border-[8px] border-slate-700 rounded-3xl p-3 shadow-xl flex flex-col gap-2.5">
              
              {/* Phone Screen */}
              <div className="bg-amber-100 border-2 border-slate-900 rounded p-2 h-[110px] text-slate-900 font-mono text-[10px] leading-tight select-none flex flex-col justify-between overflow-y-auto">
                {isPhoneLoading ? (
                  <div className="h-full flex items-center justify-center font-bold">
                    <span>Dialing USSD...</span>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap font-sans font-semibold text-[9.5px]">
                    {phoneScreenText}
                  </pre>
                )}
              </div>

              {/* Input keyboard on phone */}
              <div className="space-y-1">
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="Type USSD / Reply"
                  className="w-full bg-slate-900 text-white rounded text-center py-0.5 font-mono text-[11px] focus:outline-none border border-slate-700"
                />
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { label: "1", val: "1" }, { label: "2", val: "2" }, { label: "3", val: "3" },
                    { label: "4", val: "4" }, { label: "5", val: "5" }, { label: "6", val: "6" },
                    { label: "7", val: "7" }, { label: "8", val: "8" }, { label: "9", val: "9" },
                    { label: "*", val: "*" }, { label: "0", val: "0" }, { label: "#", val: "#" }
                  ].map((k) => (
                    <button
                      key={k.label}
                      onClick={() => {
                        setPhoneInput((prev) => prev + k.val);
                      }}
                      className="bg-slate-700 hover:bg-slate-600 active:bg-slate-500 py-0.5 rounded text-[10px] font-bold text-slate-200 cursor-pointer"
                    >
                      {k.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-1 pt-1.5 border-t border-slate-700/60 mt-1">
                  <button
                    onClick={() => setPhoneInput("")}
                    className="bg-slate-600 hover:bg-slate-500 py-0.5 rounded text-[8.5px] font-black text-slate-200 cursor-pointer uppercase"
                  >
                    Clear
                  </button>
                  <button
                    onClick={triggerUSSDCommand}
                    className="bg-emerald-600 hover:bg-emerald-500 py-0.5 rounded text-[8.5px] font-black text-white cursor-pointer uppercase"
                  >
                    Dial USSD
                  </button>
                </div>
              </div>

            </div>

            {/* SMS incoming floating notification simulator */}
            {incomingSMS && (
              <div className="mt-3 p-2.5 bg-indigo-50 border border-indigo-200 text-indigo-950 font-semibold text-[9.5px] rounded-xl leading-normal animate-fade-in space-y-1">
                <p className="font-extrabold text-indigo-900">🚨 INCOMING SMS ALERT</p>
                <p className="font-mono">{incomingSMS}</p>
                <button
                  onClick={() => setIncomingSMS(null)}
                  className="text-[8.5px] text-slate-400 hover:text-slate-600 block underline pt-1 cursor-pointer"
                >
                  Dismiss Message
                </button>
              </div>
            )}
          </div>

          {/* PWA System Caches Size Metrics */}
          <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">IndexedDB Storage Cache</span>
              <Database className="h-4.5 w-4.5 text-indigo-600" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-800 font-mono">
                {indexedDBCachedRows} Cached Records
              </h4>
              <div className="flex justify-between text-[9.5px] text-slate-400 font-bold mt-0.5">
                <span>99.2% of farm data loaded</span>
                <span>Size: 2.15 MB</span>
              </div>
            </div>

            {/* Simulated manual diagnostics increment */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={logOfflineTelemetryAction}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[9.5px] font-black py-1.5 rounded-lg transition-all cursor-pointer text-center"
              >
                ➕ Record Telemetry Event
              </button>
              <button
                type="button"
                onClick={async () => {
                  const prods = JSON.parse(localStorage.getItem("agriconnect_supplier_items") || "[]");
                  const ords = JSON.parse(localStorage.getItem("agriconnect_supplier_orders") || "[]");
                  const custs = JSON.parse(localStorage.getItem("agriconnect_supplier_customers") || "[]");
                  await resetOfflineDB(prods, ords, custs);
                  const stats = await getOfflineStats();
                  setIndexedDBCachedRows(stats.totalRecords);
                  setOfflineSyncQueue(stats.queueCount);
                  setCachedTelemetry(INITIAL_CACHED_TELEMETRY);
                  alert("IndexedDB databases successfully refreshed & re-seeded.");
                }}
                className="bg-slate-200 p-1.5 rounded-lg text-slate-600 hover:bg-slate-300 cursor-pointer"
                title="Purge / Reset client storage caches"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Hardware Connections list */}
          <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-2.5">
            <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Paired Bluetooth & GPS Nodes</h4>
            
            <div className="space-y-1.5 text-[11px] font-bold">
              <div className="flex justify-between items-center border-b border-slate-200/50 pb-1.5">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <Bluetooth className="h-3.5 w-3.5 text-blue-500" /> Bluetooth Soil Probe
                </span>
                <button
                  onClick={() => setBluetoothPaired(!bluetoothPaired)}
                  className={`px-1.5 py-0.5 rounded text-[8.5px] font-black uppercase ${
                    bluetoothPaired ? "bg-emerald-50 text-emerald-700" : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {bluetoothPaired ? "PAIRED" : "SEARCHING"}
                </button>
              </div>

              <div className="flex justify-between items-center border-b border-slate-200/50 pb-1.5">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <QrCode className="h-3.5 w-3.5 text-emerald-600" /> NFC Fertilizers Tag
                </span>
                <button
                  onClick={() => {
                    setNfcScanned(true);
                    setTimeout(() => setNfcScanned(false), 2000);
                  }}
                  className={`px-1.5 py-0.5 rounded text-[8.5px] font-black uppercase ${
                    nfcScanned ? "bg-indigo-600 text-white animate-bounce" : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {nfcScanned ? "✓ Scanned" : "SCAN Tag"}
                </button>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <MapPin className="h-3.5 w-3.5 text-rose-500" /> Offline Sector GPS Maps
                </span>
                <button
                  onClick={() => setOfflineMapCached(!offlineMapCached)}
                  className={`px-1.5 py-0.5 rounded text-[8.5px] font-black uppercase ${
                    offlineMapCached ? "bg-emerald-50 text-emerald-700" : "bg-indigo-100 text-indigo-700"
                  }`}
                >
                  {offlineMapCached ? "Cached" : "DOWNLOAD"}
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
