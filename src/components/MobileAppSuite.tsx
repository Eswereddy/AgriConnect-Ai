import React, { useState, useEffect } from "react";
import {
  Smartphone,
  Wifi,
  WifiOff,
  Camera,
  Mic,
  MicOff,
  Bell,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Sparkles,
  CloudRain,
  Coins,
  ShieldCheck,
  Award,
  Zap,
  TrendingUp,
  Search,
  ShoppingCart,
  User,
  Settings,
  Layers,
  RefreshCw,
  Download,
  Share2,
  ChevronRight,
  Flame,
  Globe,
  FileText,
  CreditCard,
  Building2,
  Trophy,
  MessageSquare,
  Play,
  Database,
  Terminal,
  Activity,
  Plus,
  ArrowLeft,
  Sliders,
  Check,
  Cpu,
  Fingerprint,
  Phone,
  Volume2,
  BookOpen,
  Filter,
  Package,
  Heart,
  Star,
  DollarSign,
  HelpCircle,
  BarChart3,
  X
} from "lucide-react";

// Screen Categories
type ScreenCategory =
  | "auth"
  | "farmer"
  | "ai"
  | "marketplace"
  | "equipment"
  | "government"
  | "financial"
  | "community"
  | "settings";

export default function MobileAppSuite() {
  // Mobile Frame & Device Simulation State
  const [devicePlatform, setDevicePlatform] = useState<"iOS" | "Android">("iOS");
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("Telugu (తెలుగు)");
  const [activeCategory, setActiveCategory] = useState<ScreenCategory>("farmer");
  const [currentScreen, setCurrentScreen] = useState<string>("Farmer Dashboard");
  
  // Simulated Mobile Features
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [voiceQuery, setVoiceQuery] = useState<string>("");
  const [voiceResponse, setVoiceResponse] = useState<string>("");
  const [showNotificationToast, setShowNotificationToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [dailyStreak, setDailyStreak] = useState<number>(14);
  const [offlineSyncQueueCount, setOfflineSyncQueueCount] = useState<number>(3);
  
  // Camera Disease Detector Simulator
  const [scanningImage, setScanningImage] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<any | null>(null);

  // Trigger simulated push notification
  const triggerNotification = (msg: string) => {
    setToastMessage(msg);
    setShowNotificationToast(true);
    setTimeout(() => setShowNotificationToast(false), 4000);
  };

  // Handle Voice Command
  const handleVoiceCommand = () => {
    if (isRecordingVoice) {
      setIsRecordingVoice(false);
      setVoiceResponse("AI: 'వరంగల్ మార్కెట్‌లో మిర్చి క్వింటాల్ ధర ₹18,500 నడుస్తోంది. తదుపరి 5 రోజులు వర్షపాతం సానుకూలంగా ఉంది.'");
    } else {
      setIsRecordingVoice(true);
      setVoiceQuery("మిర్చి పంట ధర మరియు వర్షపాతం ఎంత?");
      setVoiceResponse("");
    }
  };

  // Handle Disease Scan Simulation
  const handleSimulateDiseaseScan = () => {
    setScanningImage(true);
    setScanResult(null);
    setTimeout(() => {
      setScanningImage(false);
      setScanResult({
        disease: "Tomato Early Blight (Alternaria solani)",
        confidence: 96.8,
        severity: "Moderate (25% Foliage Impact)",
        treatment: "Spray Mancozeb 75% WP @ 2g/liter or Copper Oxychloride. Ensure 14-day safety window.",
        organicAlt: "Neem oil emulsion 5ml/L with Pseudomonas fluorescens bio-agent."
      });
    }, 2000);
  };

  return (
    <div className="space-y-6 text-slate-800">
      {/* App Header & Mobile Suite Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Smartphone className="w-64 h-64 text-emerald-400" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black rounded-full uppercase tracking-widest flex items-center gap-1.5">
                  <Smartphone className="h-3.5 w-3.5" /> Native Mobile Suite (React Native)
                </span>
                <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold rounded-full">
                  iOS & Android 40+ Native Screens
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-2 font-display">
                AgriConnect AI Mobile App Portal
              </h1>
              <p className="text-xs text-slate-300 max-w-2xl mt-1">
                Offline-First WatermelonDB SQLite Sync, Voice AI Assistant in 10 Languages, On-Device TensorFlow Lite Disease Detection, and Fastlane Automated Store Deployment.
              </p>
            </div>

            {/* Quick Mobile Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsOffline(!isOffline)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                  isOffline
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                }`}
              >
                {isOffline ? <WifiOff className="h-4 w-4 text-amber-400" /> : <Wifi className="h-4 w-4 text-emerald-400" />}
                <span>{isOffline ? "Mode: OFFLINE (SQLite)" : "Mode: ONLINE (Live API)"}</span>
              </button>

              <select
                value={devicePlatform}
                onChange={(e) => setDevicePlatform(e.target.value as any)}
                className="bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
              >
                <option value="iOS">Apple iPhone 15 Pro (iOS)</option>
                <option value="Android">Samsung Galaxy S24 (Android)</option>
              </select>

              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-emerald-300 font-bold text-xs rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
              >
                <option>Telugu (తెలుగు)</option>
                <option>Hindi (हिंदी)</option>
                <option>English</option>
                <option>Tamil (தமிழ்)</option>
                <option>Kannada (కన్నడ)</option>
                <option>Marathi (मराठी)</option>
              </select>
            </div>
          </div>

          {/* Quick Metrics & Push Trigger Test Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
            <div className="flex items-center gap-4 text-slate-300">
              <div className="flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-amber-400" />
                <span>Daily Streak:</span>
                <span className="font-extrabold text-amber-300">{dailyStreak} Days 🔥</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Database className="h-4 w-4 text-indigo-400" />
                <span>Offline Queue:</span>
                <span className="font-extrabold text-indigo-300">{offlineSyncQueueCount} Actions Pending</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => triggerNotification("🌧️ వరంగల్‌లో రేపు మోస్తరు వర్షపాతం సూచన! మిర్చి కోత వాయిదా వేయండి.")}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-[11px] rounded-lg border border-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Bell className="h-3.5 w-3.5 text-emerald-400" /> Test Weather Push Alert
              </button>
              <button
                onClick={() => triggerNotification("💰 PM-KISAN ₹2,000 Installment credited to your SBI Account!")}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-[11px] rounded-lg border border-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <DollarSign className="h-3.5 w-3.5 text-amber-400" /> Test PM-KISAN Credit Alert
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout: Left Screen Navigator & Right Phone Frame Emulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: 40+ Screen Selector & Module Index */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-display">
              <Layers className="h-4 w-4 text-emerald-600" />
              React Native Screen Navigator (40+ Mobile Views)
            </h2>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 text-xs border-b border-slate-100 pb-3">
              {[
                { id: "farmer", label: "Farmer Core" },
                { id: "ai", label: "AI & Camera" },
                { id: "marketplace", label: "Marketplace" },
                { id: "equipment", label: "Equipments" },
                { id: "government", label: "Schemes & PM" },
                { id: "financial", label: "Loans & Insurance" },
                { id: "community", label: "Community & Gamification" },
                { id: "auth", label: "Auth & Profile" },
                { id: "settings", label: "Sync & System" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer text-[11px] ${
                    activeCategory === cat.id
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Screens Grid List based on Category */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {activeCategory === "farmer" && [
                "Farmer Dashboard", "Farms List", "Farm Detail", "Add Farm (GPS)", "Crops List", "Crop Detail", "Add Crop (AI)", "Harvest Crop", "Crop History", "Soil Tests", "Farm Activities"
              ].map((sc) => (
                <button
                  key={sc}
                  onClick={() => setCurrentScreen(sc)}
                  className={`p-2.5 rounded-xl text-left text-xs font-bold border transition-all cursor-pointer ${
                    currentScreen === sc
                      ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-2xs"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-700"
                  }`}
                >
                  {sc}
                </button>
              ))}

              {activeCategory === "ai" && [
                "AI Dashboard", "Crop Recommendation", "Disease Detection (TFLite)", "Yield Prediction", "Price Prediction", "Voice AI Assistant", "Weather Intelligence"
              ].map((sc) => (
                <button
                  key={sc}
                  onClick={() => setCurrentScreen(sc)}
                  className={`p-2.5 rounded-xl text-left text-xs font-bold border transition-all cursor-pointer ${
                    currentScreen === sc
                      ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-2xs"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-700"
                  }`}
                >
                  {sc}
                </button>
              ))}

              {activeCategory === "marketplace" && [
                "Marketplace Home", "Product Detail", "Shopping Cart", "Checkout & Razorpay", "My Orders", "Order Detail", "Crop Bidding Auction"
              ].map((sc) => (
                <button
                  key={sc}
                  onClick={() => setCurrentScreen(sc)}
                  className={`p-2.5 rounded-xl text-left text-xs font-bold border transition-all cursor-pointer ${
                    currentScreen === sc
                      ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-2xs"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-700"
                  }`}
                >
                  {sc}
                </button>
              ))}

              {activeCategory === "equipment" && [
                "Equipment Rental Hub", "Tractor & Drone Detail", "Book Equipment", "Rental History"
              ].map((sc) => (
                <button
                  key={sc}
                  onClick={() => setCurrentScreen(sc)}
                  className={`p-2.5 rounded-xl text-left text-xs font-bold border transition-all cursor-pointer ${
                    currentScreen === sc
                      ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-2xs"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-700"
                  }`}
                >
                  {sc}
                </button>
              ))}

              {activeCategory === "government" && [
                "Schemes Overview", "PM-KISAN Portal", "Eligibility Checker", "Apply for Scheme", "My Applications"
              ].map((sc) => (
                <button
                  key={sc}
                  onClick={() => setCurrentScreen(sc)}
                  className={`p-2.5 rounded-xl text-left text-xs font-bold border transition-all cursor-pointer ${
                    currentScreen === sc
                      ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-2xs"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-700"
                  }`}
                >
                  {sc}
                </button>
              ))}

              {activeCategory === "financial" && [
                "KCC Loan Dashboard", "Apply KCC Loan", "EMI Calculator", "PMFBY Insurance", "File Disaster Claim"
              ].map((sc) => (
                <button
                  key={sc}
                  onClick={() => setCurrentScreen(sc)}
                  className={`p-2.5 rounded-xl text-left text-xs font-bold border transition-all cursor-pointer ${
                    currentScreen === sc
                      ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-2xs"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-700"
                  }`}
                >
                  {sc}
                </button>
              ))}

              {activeCategory === "community" && [
                "Education Hub & Courses", "Community Forum", "Create Post", "Chat & Direct Messages", "Streak & Badges Leaderboard"
              ].map((sc) => (
                <button
                  key={sc}
                  onClick={() => setCurrentScreen(sc)}
                  className={`p-2.5 rounded-xl text-left text-xs font-bold border transition-all cursor-pointer ${
                    currentScreen === sc
                      ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-2xs"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-700"
                  }`}
                >
                  {sc}
                </button>
              ))}

              {activeCategory === "auth" && [
                "Login (Mobile / Biometric)", "OTP Verification", "Register & Role Select", "Profile Setup Wizard", "User Profile"
              ].map((sc) => (
                <button
                  key={sc}
                  onClick={() => setCurrentScreen(sc)}
                  className={`p-2.5 rounded-xl text-left text-xs font-bold border transition-all cursor-pointer ${
                    currentScreen === sc
                      ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-2xs"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-700"
                  }`}
                >
                  {sc}
                </button>
              ))}

              {activeCategory === "settings" && [
                "Offline WatermelonDB SQLite Sync", "Push Notification Settings", "Language Selector", "Fastlane & Build Status"
              ].map((sc) => (
                <button
                  key={sc}
                  onClick={() => setCurrentScreen(sc)}
                  className={`p-2.5 rounded-xl text-left text-xs font-bold border transition-all cursor-pointer ${
                    currentScreen === sc
                      ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-2xs"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-700"
                  }`}
                >
                  {sc}
                </button>
              ))}
            </div>
          </div>

          {/* Technical Native Specifications Box */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="font-bold text-emerald-400 flex items-center gap-2">
                <Terminal className="h-4 w-4" /> Native Build Details (Fastlane CI)
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">v2.1.0 (Build 108)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
              <p>• Framework: React Native 0.74</p>
              <p>• Offline DB: WatermelonDB SQLite</p>
              <p>• On-Device ML: TensorFlow Lite</p>
              <p>• Audio TTS: ElevenLabs + Native Speech</p>
              <p>• Push: Firebase FCM + APNS</p>
              <p>• Payments: Razorpay SDK / Stripe</p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Live Interactive Smartphone Mockup */}
        <div className="lg:col-span-6 flex justify-center">
          {/* Phone Shell */}
          <div className="w-full max-w-[380px] bg-slate-900 p-3.5 rounded-[44px] shadow-2xl border-4 border-slate-800 relative">
            {/* Camera Notch / Dynamic Island */}
            <div className="w-32 h-5 bg-black rounded-full mx-auto mb-2 flex items-center justify-center gap-2 z-30">
              <div className="h-2.5 w-2.5 rounded-full bg-slate-800 border border-slate-700"></div>
              <div className="h-2 w-2 rounded-full bg-blue-900/80"></div>
            </div>

            {/* Screen Canvas (375px x 680px approx) */}
            <div className="bg-slate-50 rounded-[32px] overflow-hidden min-h-[640px] flex flex-col justify-between relative border border-slate-200">
              {/* Simulated Mobile Status Bar */}
              <div className="bg-emerald-900 text-white px-5 py-2 text-[10px] font-bold flex justify-between items-center z-20">
                <span>09:41 AM</span>
                <div className="flex items-center gap-2">
                  {isOffline ? (
                    <span className="text-amber-300 flex items-center gap-1"><WifiOff className="h-3 w-3" /> Offline</span>
                  ) : (
                    <span className="text-emerald-300 flex items-center gap-1"><Wifi className="h-3 w-3" /> 5G</span>
                  )}
                  <span>100%</span>
                  <div className="w-4 h-2 border border-white rounded-xs p-0.5">
                    <div className="w-full h-full bg-emerald-400 rounded-2xs"></div>
                  </div>
                </div>
              </div>

              {/* Live Simulated Push Notification Toast inside Mockup */}
              {showNotificationToast && (
                <div className="absolute top-10 left-3 right-3 z-50 bg-slate-900/95 text-white p-3 rounded-2xl border border-emerald-500 shadow-xl text-xs space-y-1 animate-bounce">
                  <div className="flex items-center justify-between text-[10px] font-bold text-emerald-400">
                    <span className="flex items-center gap-1"><Bell className="h-3 w-3" /> AgriConnect Notification</span>
                    <span>Just Now</span>
                  </div>
                  <p className="text-[11px] font-medium leading-snug">{toastMessage}</p>
                </div>
              )}

              {/* Mobile App Header Bar */}
              <div className="bg-emerald-800 text-white p-3.5 flex justify-between items-center shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-black">
                    AC
                  </div>
                  <div>
                    <h3 className="text-xs font-black truncate max-w-[160px]">{currentScreen}</h3>
                    <p className="text-[9px] text-emerald-200">{selectedLanguage}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-amber-400 text-slate-900 rounded-full text-[9px] font-black flex items-center gap-1">
                    <Flame className="h-3 w-3" /> {dailyStreak}d
                  </span>
                  <button onClick={() => setCurrentScreen("Notifications")} className="p-1 hover:bg-emerald-700 rounded-full">
                    <Bell className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Dynamic Screen Body Content based on `currentScreen` */}
              <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
                {/* 1. FARMER DASHBOARD SCREEN */}
                {currentScreen === "Farmer Dashboard" && (
                  <div className="space-y-3">
                    {/* Welcome Card */}
                    <div className="p-3.5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white rounded-2xl space-y-1.5 shadow-xs">
                      <p className="text-[10px] text-emerald-200 font-bold">నమస్కారం, రాజేష్ పటేల్ గారు!</p>
                      <p className="text-sm font-extrabold">Green Field Farm #4 (15 Acres)</p>
                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <span>Farm Health Index: <strong className="text-emerald-300 font-black">94/100</strong></span>
                        <span className="bg-white/20 px-2 py-0.5 rounded text-[9px]">Optimal</span>
                      </div>
                    </div>

                    {/* Quick Weather Widget */}
                    <div className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <CloudRain className="h-7 w-7 text-blue-600" />
                        <div>
                          <p className="font-extrabold text-slate-900 text-sm">29°C - వర్షాపాతం (Rain 80%)</p>
                          <p className="text-[10px] text-slate-500">వరంగల్, తెలంగాణ | గాలి తేమ: 74%</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>

                    {/* Action Cards Grid */}
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <button
                        onClick={() => setCurrentScreen("Disease Detection (TFLite)")}
                        className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1 cursor-pointer"
                      >
                        <Camera className="h-5 w-5 text-emerald-700 mx-auto" />
                        <p className="font-bold text-emerald-900 text-[11px]">పంట రోగ నిర్ధారణ</p>
                        <p className="text-[9px] text-emerald-600">Scan Crop Disease</p>
                      </button>

                      <button
                        onClick={() => setCurrentScreen("Voice AI Assistant")}
                        className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-1 cursor-pointer"
                      >
                        <Mic className="h-5 w-5 text-indigo-700 mx-auto" />
                        <p className="font-bold text-indigo-900 text-[11px]">వాయిస్ అసిస్టెంట్</p>
                        <p className="text-[9px] text-indigo-600">Voice AI Helper</p>
                      </button>
                    </div>

                    {/* Active Crop Health Status */}
                    <div className="p-3 bg-white border border-slate-200 rounded-2xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-slate-800">పంటల వివరాలు (Crops)</span>
                        <span className="text-[10px] text-emerald-600 font-bold">2 Active Crops</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl">
                        <div>
                          <p className="font-bold text-slate-900">Bio-Wheat PBW 343</p>
                          <p className="text-[10px] text-slate-500">Sown: 10-Nov | Harvest in 15 days</p>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[9px]">Grade A</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. DISEASE DETECTION SCREEN */}
                {currentScreen === "Disease Detection (TFLite)" && (
                  <div className="space-y-3">
                    <div className="p-3 bg-indigo-900 text-white rounded-2xl text-center space-y-1">
                      <p className="text-xs font-bold">On-Device TFLite Camera Scanner</p>
                      <p className="text-[10px] text-indigo-200">No Internet Required (Works 100% Offline)</p>
                    </div>

                    <div className="p-4 bg-slate-900 text-white rounded-2xl text-center space-y-3 relative overflow-hidden">
                      <div className="h-40 border-2 border-dashed border-emerald-400 rounded-xl flex flex-col items-center justify-center space-y-2 bg-slate-800/80">
                        <Camera className="h-8 w-8 text-emerald-400 animate-pulse" />
                        <p className="text-[10px] text-slate-300">Frame crop leaf inside grid & tap capture</p>
                      </div>

                      <button
                        onClick={handleSimulateDiseaseScan}
                        disabled={scanningImage}
                        className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-extrabold rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        {scanningImage ? "Analyzing Leaf Image..." : "Capture & Analyze Leaf"}
                      </button>
                    </div>

                    {scanResult && (
                      <div className="p-3.5 bg-emerald-50 border-2 border-emerald-500 rounded-2xl space-y-2 text-slate-900">
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-emerald-900">{scanResult.disease}</span>
                          <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-full font-black text-[9px]">
                            {scanResult.confidence}% Confidence
                          </span>
                        </div>
                        <p className="text-[10px] text-emerald-800 font-bold">Impact: {scanResult.severity}</p>
                        <p className="text-[10px] text-slate-700 bg-white p-2 rounded-xl border border-emerald-200">
                          <strong>Treatment:</strong> {scanResult.treatment}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. VOICE AI ASSISTANT SCREEN */}
                {currentScreen === "Voice AI Assistant" && (
                  <div className="space-y-3">
                    <div className="p-4 bg-indigo-950 text-white rounded-2xl space-y-3 text-center">
                      <p className="text-xs font-extrabold">Multilingual Voice AI (10 Languages)</p>
                      <p className="text-[10px] text-indigo-300">Speak naturally in your native language</p>

                      <div className="py-6 flex flex-col items-center justify-center gap-3">
                        <button
                          onClick={handleVoiceCommand}
                          className={`h-20 w-20 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                            isRecordingVoice
                              ? "bg-rose-500 animate-ping text-white"
                              : "bg-emerald-500 text-slate-900 hover:bg-emerald-400"
                          }`}
                        >
                          <Mic className="h-8 w-8" />
                        </button>
                        <p className="text-[11px] font-bold text-emerald-300">
                          {isRecordingVoice ? "Listening... Tap to stop" : "Tap Mic to speak in Telugu/Hindi"}
                        </p>
                      </div>

                      {voiceQuery && (
                        <div className="p-2.5 bg-slate-900 rounded-xl text-left font-mono text-[11px] text-slate-200">
                          <p className="text-[9px] text-slate-400">User Query:</p>
                          <p className="font-bold">"{voiceQuery}"</p>
                        </div>
                      )}

                      {voiceResponse && (
                        <div className="p-3 bg-emerald-900/80 rounded-xl text-left text-emerald-100 text-[11px] space-y-1">
                          <p className="text-[9px] font-bold text-emerald-400">AI Response (Audio Playing):</p>
                          <p className="font-bold">{voiceResponse}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. OFFLINE WATERMELONDB SQLITE SCREEN */}
                {currentScreen === "Offline WatermelonDB SQLite Sync" && (
                  <div className="space-y-3">
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-900 space-y-1">
                      <p className="font-extrabold text-xs flex items-center gap-1.5">
                        <Database className="h-4 w-4 text-amber-600" /> WatermelonDB SQLite Sync Engine
                      </p>
                      <p className="text-[10px]">All farm data is stored locally in SQLite database and synchronized when connection is restored.</p>
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded-2xl space-y-2">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-slate-700">Pending Sync Queue:</span>
                        <span className="font-extrabold text-indigo-600">{offlineSyncQueueCount} Actions</span>
                      </div>
                      <div className="space-y-1 text-[10px] font-mono">
                        <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                          <span>1. ADD_FARM_ACTIVITY (Watering)</span>
                          <span className="text-amber-600 font-bold">QUEUED</span>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                          <span>2. SOIL_TEST_UPDATE (#ST-902)</span>
                          <span className="text-amber-600 font-bold">QUEUED</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setOfflineSyncQueueCount(0);
                          alert("Offline SQLite queue synced with Cloud Server!");
                        }}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Force Manual Cloud Sync
                      </button>
                    </div>
                  </div>
                )}

                {/* DEFAULT GENERIC SCREEN FALLBACK */}
                {![
                  "Farmer Dashboard", "Disease Detection (TFLite)", "Voice AI Assistant", "Offline WatermelonDB SQLite Sync"
                ].includes(currentScreen) && (
                  <div className="p-6 bg-white border border-slate-200 rounded-2xl text-center space-y-3 my-auto">
                    <Smartphone className="h-10 w-10 text-emerald-600 mx-auto" />
                    <h3 className="font-extrabold text-slate-900 text-sm">{currentScreen} Screen</h3>
                    <p className="text-[10px] text-slate-500">
                      React Native view loaded successfully for language: <strong>{selectedLanguage}</strong>. Integrated with native state handlers.
                    </p>
                    <button
                      onClick={() => setCurrentScreen("Farmer Dashboard")}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs cursor-pointer"
                    >
                      Return to Main Dashboard
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom Mobile Navigation Bar */}
              <div className="bg-white border-t border-slate-200 p-2.5 grid grid-cols-5 text-center text-[9px] text-slate-600">
                <button
                  onClick={() => setCurrentScreen("Farmer Dashboard")}
                  className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                    currentScreen === "Farmer Dashboard" ? "text-emerald-700 font-black" : ""
                  }`}
                >
                  <Smartphone className="h-4 w-4" />
                  <span>Home</span>
                </button>
                <button
                  onClick={() => setCurrentScreen("Disease Detection (TFLite)")}
                  className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                    currentScreen === "Disease Detection (TFLite)" ? "text-emerald-700 font-black" : ""
                  }`}
                >
                  <Camera className="h-4 w-4" />
                  <span>Camera</span>
                </button>
                <button
                  onClick={() => setCurrentScreen("Voice AI Assistant")}
                  className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                    currentScreen === "Voice AI Assistant" ? "text-emerald-700 font-black" : ""
                  }`}
                >
                  <Mic className="h-4 w-4 text-emerald-600" />
                  <span>Voice AI</span>
                </button>
                <button
                  onClick={() => setCurrentScreen("Marketplace Home")}
                  className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                    currentScreen === "Marketplace Home" ? "text-emerald-700 font-black" : ""
                  }`}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Market</span>
                </button>
                <button
                  onClick={() => setCurrentScreen("User Profile")}
                  className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                    currentScreen === "User Profile" ? "text-emerald-700 font-black" : ""
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </button>
              </div>

              {/* Simulated Home Indicator Bar */}
              <div className="bg-white py-1 flex justify-center">
                <div className="w-28 h-1 bg-slate-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
