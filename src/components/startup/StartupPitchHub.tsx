import React, { useState, useEffect } from "react";
import {
  Rocket,
  Award,
  DollarSign,
  TrendingUp,
  Coins,
  ShieldCheck,
  Bot,
  Layers,
  Sparkles,
  Smartphone,
  ChevronRight,
  ChevronLeft,
  Volume2,
  VolumeX,
  Target,
  Presentation,
  CheckCircle,
  Search,
  BookOpen,
  Mic,
  Cpu,
  BarChart3,
  HelpCircle,
  Lightbulb,
  ArrowUpRight,
  AlertCircle,
  Users
} from "lucide-react";

import { PaymentGatewayDemo } from "./PaymentGatewayDemo";
import { AlertOrchestration } from "./AlertOrchestration";
import { CropPathologyAI } from "./CropPathologyAI";
import { GeospatialFarmMapper } from "./GeospatialFarmMapper";
import { TraceabilityBlockchain } from "./TraceabilityBlockchain";
import { WebRTCConsultation } from "./WebRTCConsultation";

export const StartupPitchHub: React.FC = () => {
  // Navigation & Sub-tabs
  const [activeSubTab, setActiveSubTab] = useState<"deck" | "simulator" | "features" | "voice" | "integrations">("deck");
  const [integrationView, setIntegrationView] = useState<"payments" | "alerts" | "pathology" | "gis" | "blockchain" | "webrtc">("payments");
  const [commissionEarned, setCommissionEarned] = useState<number>(0);
  const [smsRevenueActive, setSmsRevenueActive] = useState<boolean>(false);
  
  // Slide Index for Pitch Deck
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  
  // Valuation Simulator Parameters
  const [activeFarmers, setActiveFarmers] = useState<number>(120000); // Default 120k farmers
  const [monthlySubPrice, setMonthlySubPrice] = useState<number>(99); // ₹99/month
  const [transactionFee, setTransactionFee] = useState<number>(1.5); // 1.5% take rate
  const [avgTransactionVal, setAvgTransactionVal] = useState<number>(4500); // ₹4500 avg harvest transaction
  const [droneFee, setDroneFee] = useState<number>(350); // ₹350 per autonomous scan
  const [scansPerYear, setScansPerYear] = useState<number>(4); // 4 scans per year per farmer

  // Voice Assistant / AI Startup Coach states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [voiceQuery, setVoiceQuery] = useState<string>("");
  const [coachResponse, setCoachResponse] = useState<string>(
    "Welcome, future AgriTech investor! I am your AI Startup Companion. Select any preset question below, type a query, or activate voice mode to ask me about our unit economics, defensive moats, or growth strategies."
  );
  const [speechSynthesisSupported, setSpeechSynthesisSupported] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [voiceSearchText, setVoiceSearchText] = useState<string>("");

  // Feature Search & Category Filter
  const [featureSearch, setFeatureSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setSpeechSynthesisSupported(true);
    }
  }, []);

  // Speak AI Coach Response
  const speakResponse = (textToSpeak: string) => {
    if (!speechSynthesisSupported) return;
    window.speechSynthesis.cancel();
    const cleanText = textToSpeak.replace(/[*#]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    
    // Choose a professional-sounding voice if available
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(v => v.name.includes("Google") || v.name.includes("Natural") || v.lang.startsWith("en"));
    if (premiumVoice) {
      utterance.voice = premiumVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (speechSynthesisSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Web Speech API - Speech Recognition
  const startSpeechRecognition = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      setCoachResponse("Speech recognition is not fully supported in this browser environment. Please use the search bar or presets to interact with the AI Coach!");
      return;
    }

    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.lang = "en-IN"; // English with Indian accents or general English
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
      setCoachResponse("Listening to your pitch question... Speak clearly now.");
    };

    recognition.onerror = (event: any) => {
      console.warn("Speech Recognition Error handled:", event);
      setIsRecording(false);
      setCoachResponse("Sorry, I couldn't catch that. Please try again or use the buttons below.");
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setVoiceQuery(transcript);
      processPitchQuestion(transcript);
    };

    recognition.start();
  };

  // AI Pitch Advisor Responses
  const processPitchQuestion = (query: string) => {
    const q = query.toLowerCase();
    let response = "";

    if (q.includes("monetiz") || q.includes("revenue") || q.includes("business model") || q.includes("make money")) {
      response = "AgriConnect AI utilizes a highly defensive multi-tiered monetization strategy: 1) SaaS Subscription (₹99/month for premium NPK maps and 7-day predictive weather indices); 2) Transaction take-rates of 1.5% on direct marketplace trades; 3) Per-scan drone telemetry fees of ₹350; 4) Commission on carbon credit liquidations and institutional crop escrows. This generates an estimated ₹2,340 annual LTV per active farmer against a ₹320 CAC.";
    } else if (q.includes("competit") || q.includes("moat") || q.includes("competitor") || q.includes("dehaat") || q.includes("agrostar")) {
      response = "Our technical moat is three-fold: 1) Offline-first edge database sync (ensuring critical operations work without cellular grid connections); 2) High-fidelity 3D subsoil profiling and microclimate AI models that deliver predictive advice on a 1-meter precision radius rather than regional averages; 3) Our unified 203-micro-service hub covering farm-to-fork smart contracts and gamified task engagement.";
    } else if (q.includes("market size") || q.includes("tam") || q.includes("valuation") || q.includes("opportunity")) {
      response = "Agriculture accounts for 18% of India's GDP, touching 150 Million farmers. The Total Addressable Market (TAM) is $350 Billion. Our Serviceable Addressable Market (SAM) is $42 Billion across high-yield horticulture and cash crops. With our platform model, scaling to 1.5 Million farmers in 5 years secures a projected $120 Million ARR business valued at over $1.5 Billion.";
    } else if (q.includes("offline") || q.includes("pwa") || q.includes("no internet")) {
      response = "Our application incorporates a groundbreaking ServiceWorker-backed Offline Sync Hub. It stores telemetry, crop pathology images, and diagnostic logs locally. When internet connectivity is restored, the client automatically reconciles logs with the Postgres/Firestore backend. This is critical as 60% of smallholder farmers operate in low-bandwidth fields.";
    } else if (q.includes("voice") || q.includes("literacy") || q.includes("multilingual")) {
      response = "Low-literacy barriers are broken using our high-fidelity Speech-to-Text and Text-to-Speech system. Farmers can converse naturally in 10 major vernacular languages (Hindi, Punjabi, Telugu, Tamil, etc.). Every diagnostic output and weather recommendation has speech-synth enabled so farmers can listen rather than read.";
    } else if (q.includes("carbon") || q.includes("esg") || q.includes("green")) {
      response = "We incentivize organic conversion by calculating carbon offsets generated through soil nitrogen optimization. Every credit earned is stored in a decentralized Carbon Wallet and liquidated instantly to global ESG buyers. This increases typical farmer income by up to 15% with zero upfront capital.";
    } else {
      response = `Great question about "${query}"! AgriConnect AI's autonomous system leverages Gemini 2.5 Flash server-side to orchestrate 203 microservices. Our platform creates a high-trust digital twin of each plot of land, unifying IoT, logistics, and fintech into a single, cohesive operating system for rural economies. This provides deep user stickiness that traditional marketplaces cannot replicate.`;
    }

    setCoachResponse(response);
    speakResponse(response);
  };

  // Unit Economic Calculations
  const calculatedGMV = activeFarmers * avgTransactionVal * 2.5; // Avg 2.5 harvests/trades per year
  const calculatedMarketplaceRev = calculatedGMV * (transactionFee / 100);
  const calculatedSubRev = activeFarmers * monthlySubPrice * 12;
  const calculatedDroneRev = activeFarmers * droneFee * scansPerYear;
  const premiumSmsRev = smsRevenueActive ? (activeFarmers * 50 * 12) : 0;
  const totalARR = calculatedMarketplaceRev + calculatedSubRev + calculatedDroneRev + commissionEarned + premiumSmsRev;
  const projectedValuation = totalARR * 12.5; // Standard 12.5x ARR multiplier for rapid-growth AgriTech SaaS

  // Pitch Deck Slides data
  const pitchSlides = [
    {
      title: "THE CRISIS",
      subtitle: "150M+ Farmers left in the Dark",
      points: [
        { label: "Inefficient Microclimates", desc: "Regional forecasts fail to predict hyper-local radiative frost, ruining cash crops." },
        { label: "Biochemical Depletion", desc: "Over-fertilization and lack of subsoil NPK analysis degrade soil yields by 42%." },
        { label: "Extreme Supply Chain Leakage", desc: "Intermediaries and cartels capture up to 60% of the crop value, starving the smallholder." }
      ],
      color: "from-rose-800 to-rose-950",
      accent: "text-rose-400"
    },
    {
      title: "THE SOLUTION",
      subtitle: "AgriConnect AI: The Operating System for Rural Commerce",
      points: [
        { label: "Hyper-Precision Diagnostics", desc: "Gemini-powered neural pathologizer analyzes crop leaf photos with 96.8% accuracy." },
        { label: "Autonomous Agri-Advisory", desc: "Real-time soil sensors talk to automated drip irrigation networks and pesticide blenders." },
        { label: "Sovereign Trade Escrows", desc: "Blockchain-inspired secure smart-contracts link local cooperatives directly to corporate buyers." }
      ],
      color: "from-emerald-800 to-emerald-950",
      accent: "text-emerald-400"
    },
    {
      title: "MARKET POTENTIAL",
      subtitle: "Capturing a $350 Billion Agri-Fintech Revolution",
      points: [
        { label: "Total Addressable Market (TAM)", desc: "$350 Billion agricultural economy across India and Southeast Asia." },
        { label: "Serviceable Addressable Market (SAM)", desc: "$42 Billion segment specializing in high-yield seed, pesticide, and drone scanning." },
        { label: "SaaS & FinTech Expansion", desc: "Expanding into micro-insurance, sovereign tractor leases, and carbon credit trade." }
      ],
      color: "from-teal-800 to-teal-950",
      accent: "text-teal-400"
    },
    {
      title: "UNSURPASSABLE TECHNOLOGY MOATS",
      subtitle: "Why AgriConnect Wins Over DeHaat and AgroStar",
      points: [
        { label: "Full Offline Reconciler", desc: "Patented EdgeDB structure retains all IoT data, and synchronizes when cellular signals return." },
        { label: "3D Soil Horizon Profiler", desc: "Simulates subsoil compaction and biochemical leaching dynamically to suggest custom blends." },
        { label: "Integrated 203 Microservices", desc: "Covers Carbon Wallets, AI Marketing, Telemedicine, Drone-as-a-Service, and Gamified Quests." }
      ],
      color: "from-indigo-800 to-indigo-950",
      accent: "text-indigo-400"
    }
  ];

  // 203 Features categories data
  const startupFeatureDatabase = [
    { id: 1, name: "Offline Sync Hub (PWA)", desc: "Stores diagnostic models, NPK metrics, and ledger logs locally in indexedDB, auto-syncing when internet is detected.", cat: "Offline / Infrastructure", status: "Built", icon: Smartphone },
    { id: 2, name: "Voice Assistant Coach", desc: "Speech-to-text voice recognition allowing farmers to get real-time crop disease remedies read aloud.", cat: "User Accessibility", status: "Active", icon: Mic },
    { id: 3, name: "Multilingual UI Engines", desc: "Full real-time system translations across English, Hindi, Punjabi, Telugu, Tamil, Bengali, etc.", cat: "User Accessibility", status: "Built", icon: BookOpen },
    { id: 4, name: "3D Digital Twin Farm", desc: "Generates high-fidelity 3D spatial models of plots with active crop height, foliage index, and subsoil moisture levels.", cat: "IoT / Drone", status: "Built", icon: Layers },
    { id: 5, name: "Carbon Credit Wallet", desc: "Dynamically audits eco-friendly tillage, converts carbon savings to verified credits, and sells instantly to carbon-neutral corps.", cat: "Finance", status: "Active", icon: Coins },
    { id: 6, name: "Sovereign Escrow Smart Contracts", desc: "Locks buyer funds in simulated secure escrow accounts, releasing payments immediately after quality scanner approval.", cat: "Transactions", status: "Built", icon: ShieldCheck },
    { id: 7, name: "Daily Gamified Quests", desc: "Boosts user retention by awarding badges, XP points, and seed discounts for completing daily agronomic challenges.", cat: "Gamification", status: "Built", icon: Award },
    { id: 8, name: "AI Crop Disease Outbreak Predictor", desc: "Computes spore propagation patterns, surface winds, and canopy heat loads to map pathogen threats 7 days in advance.", cat: "AI/ML Core", status: "Active", icon: Bot },
    { id: 9, name: "Drone-as-a-Service (DaaS)", desc: "Books regional cooperative drones for multi-spectrum aerial soil analyses and autonomous spray missions.", cat: "IoT / Drone", status: "Active", icon: Cpu },
    { id: 10, name: "AI Fertilizer Blender (Exact NPK)", desc: "Calculates deficient soil nutrients from physical reports and generates precise customized organic blends.", cat: "Analytics", status: "Active", icon: Sparkles }
  ];

  const filteredFeatures = startupFeatureDatabase.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(featureSearch.toLowerCase()) || f.desc.toLowerCase().includes(featureSearch.toLowerCase());
    const matchesCat = selectedCategory === "ALL" || f.cat === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div id="startup-pitch-innovation-hub" className="bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 overflow-hidden mt-6">
      {/* Premium Header */}
      <div className="p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-b border-slate-800/80">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                <Rocket className="h-4 w-4" /> Start-up Pitch Deck & Unit Economics Hub
              </span>
              <span className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                203 Features Scaled
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight mt-1 bg-gradient-to-r from-white via-teal-100 to-emerald-300 bg-clip-text text-transparent">
              AGRICONNECT AI INC.
            </h2>
            <p className="text-slate-400 text-xs max-w-2xl font-medium">
              Interact with our Pitch Presentation, model venture financials with the dynamic Valuation Simulator, explore the 203 complete feature list, prompt our AI Pitch Coach, or test our live ⚡ Real-World Integrations Sandbox.
            </p>
          </div>

          {/* Sub-tab Navigation */}
          <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800/60 w-full md:w-auto overflow-x-auto gap-1">
            <button
              onClick={() => setActiveSubTab("deck")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === "deck" ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              <Presentation className="h-3.5 w-3.5" /> Pitch Slide Deck
            </button>
            <button
              onClick={() => setActiveSubTab("simulator")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === "simulator" ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" /> Venture Simulator
            </button>
            <button
              onClick={() => setActiveSubTab("features")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === "features" ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="h-3.5 w-3.5" /> 203 Features
            </button>
            <button
              onClick={() => setActiveSubTab("voice")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === "voice" ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              <Bot className="h-3.5 w-3.5" /> AI Coach Voice
            </button>
            <button
              onClick={() => setActiveSubTab("integrations")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === "integrations" ? "bg-emerald-600 text-white shadow-md animate-pulse" : "text-slate-400 hover:text-white"
              }`}
            >
              <Cpu className="h-3.5 w-3.5 text-emerald-400" /> ⚡ Integrations & AI
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6">
        {/* TAB 1: PITCH SLIDE DECK */}
        {activeSubTab === "deck" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* The Interactive Slide Presentation */}
            <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-3xl p-6 relative overflow-hidden min-h-[420px] flex flex-col justify-between shadow-inner">
              {/* Backglow decoration */}
              <div className="absolute -top-10 -right-10 w-44 h-44 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-850 pb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    Series A Investor Pitch • Slide {currentSlide + 1} of {pitchSlides.length}
                  </span>
                  <span className="text-[9px] bg-slate-850 text-slate-400 font-bold px-2 py-0.5 rounded-full border border-slate-800">
                    Proprietary Business Intelligence
                  </span>
                </div>

                <div className="space-y-2 mt-4">
                  <h3 className="text-2xl font-black tracking-tight text-white uppercase">
                    {pitchSlides[currentSlide].title}
                  </h3>
                  <p className="text-emerald-300 font-bold text-sm">
                    {pitchSlides[currentSlide].subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                  {pitchSlides[currentSlide].points.map((pt, pIdx) => (
                    <div key={pIdx} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2 hover:border-emerald-500/30 transition-all">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-xs font-extrabold text-slate-100">{pt.label}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                        {pt.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slider Controls */}
              <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-900">
                <div className="flex gap-1">
                  {pitchSlides.map((_, sIdx) => (
                    <span
                      key={sIdx}
                      className={`h-2 rounded-full transition-all ${
                        currentSlide === sIdx ? "w-8 bg-emerald-500" : "w-2 bg-slate-800"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                    disabled={currentSlide === 0}
                    className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-850 active:bg-slate-950 transition-all cursor-pointer disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setCurrentSlide(prev => Math.min(pitchSlides.length - 1, prev + 1))}
                    disabled={currentSlide === pitchSlides.length - 1}
                    className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-850 active:bg-slate-950 transition-all cursor-pointer disabled:opacity-30"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Business Moats & High-level Statistics Side Info */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 rounded-3xl p-5 space-y-4">
                <span className="text-[10px] text-teal-400 font-extrabold uppercase tracking-widest block">
                  AGRI-FINTECH LEADERSHIP
                </span>
                
                <h4 className="text-base font-black text-white leading-tight">
                  High-Yield Scalability Economics
                </h4>

                <div className="space-y-3 pt-2">
                  <div className="bg-slate-900 border border-slate-850/80 p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Customer Acquisition (CAC)</span>
                      <span className="text-sm font-black text-white mt-0.5">₹320 <span className="text-[10px] font-normal text-slate-500">per farmer</span></span>
                    </div>
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/20">Optimized</span>
                  </div>

                  <div className="bg-slate-900 border border-slate-850/80 p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Customer Lifetime Value (LTV)</span>
                      <span className="text-sm font-black text-white mt-0.5">₹2,340 <span className="text-[10px] font-normal text-slate-500">annual recurring</span></span>
                    </div>
                    <span className="text-[9px] bg-teal-500/10 text-teal-400 font-bold px-2 py-0.5 rounded border border-teal-500/20">7.3x Ratio</span>
                  </div>

                  <div className="bg-slate-900 border border-slate-850/80 p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Projected Market Capture</span>
                      <span className="text-sm font-black text-white mt-0.5">15% of Core Belt <span className="text-[10px] font-normal text-slate-500">by Yr-3</span></span>
                    </div>
                    <span className="text-[9px] bg-indigo-500/10 text-indigo-400 font-bold px-2 py-0.5 rounded border border-indigo-500/20">High Growth</span>
                  </div>
                </div>

                <div className="bg-teal-950/20 border border-teal-500/10 p-3 rounded-xl text-[11px] text-teal-300 font-medium leading-relaxed">
                  📢 <strong>Investor Moat:</strong> Our offline synchronization capability ensures that farmers retain 100% data fidelity in poor bandwidth zones, generating an unshakeable platform lock-in.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VENTURE ECONOMICS SIMULATOR */}
        {activeSubTab === "simulator" && (
          <div className="space-y-6">
            <div className="bg-slate-950 border border-slate-850 p-5 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-emerald-500" /> Interactive Venture Valuation Engine
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-1">
                  Adjust active farmer reach, marketplace take rates, and premium subscriptions to model Gross Merchandise Volume (GMV), Annual Recurring Revenue (ARR), and investor valuation metrics.
                </p>
              </div>

              <div className="bg-emerald-950/40 border border-emerald-500/20 p-3.5 rounded-2xl shrink-0 text-right">
                <span className="text-[9px] text-emerald-400 font-black uppercase tracking-wider block">Startup Valuation Multiple</span>
                <span className="text-white font-extrabold text-sm font-mono">12.5x ARR SaaS/Platform Hybrid</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Sliders (Left - lg:col-span-7) */}
              <div className="lg:col-span-7 bg-slate-950 border border-slate-850 p-6 rounded-3xl space-y-6">
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider border-b border-slate-850 pb-3">
                  Variables & Reach Assumptions
                </h4>

                <div className="space-y-5">
                  {/* Active Farmers Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-300 flex items-center gap-1.5"><Users className="h-4 w-4 text-emerald-500" /> Target Active Farmers:</span>
                      <span className="text-emerald-400 font-black font-mono">{(activeFarmers).toLocaleString()} Farmers</span>
                    </div>
                    <input
                      type="range"
                      min={10000}
                      max={1000000}
                      step={1000}
                      value={activeFarmers}
                      onChange={(e) => setActiveFarmers(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
                    />
                    <div className="flex justify-between text-[9px] text-slate-500 font-bold">
                      <span>10k (MVP Pilot)</span>
                      <span>500k (National Scale)</span>
                      <span>1M+ (Aggressive Expansion)</span>
                    </div>
                  </div>

                  {/* Monthly Premium Price Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-300 flex items-center gap-1.5"><Coins className="h-4 w-4 text-teal-400" /> Monthly Subscription (₹):</span>
                      <span className="text-teal-400 font-black font-mono">₹{monthlySubPrice} / month</span>
                    </div>
                    <input
                      type="range"
                      min={29}
                      max={499}
                      step={5}
                      value={monthlySubPrice}
                      onChange={(e) => setMonthlySubPrice(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500 focus:outline-none"
                    />
                    <div className="flex justify-between text-[9px] text-slate-500 font-bold">
                      <span>₹29 (Basic Ad-Tier)</span>
                      <span>₹99 (Highly Popular)</span>
                      <span>₹499 (Advanced Precision AI)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Take Rate Slider */}
                    <div className="space-y-2 bg-slate-900/40 p-4 rounded-2xl border border-slate-850">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-slate-300">Marketplace Take-rate:</span>
                        <span className="text-indigo-400 font-black font-mono">{transactionFee}%</span>
                      </div>
                      <input
                        type="range"
                        min={0.5}
                        max={5.0}
                        step={0.1}
                        value={transactionFee}
                        onChange={(e) => setTransactionFee(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
                      />
                      <span className="text-[9px] text-slate-500 font-semibold block">Commission charged on crop selling escrow transactions.</span>
                    </div>

                    {/* Autonomous Drone Scanning Fee Slider */}
                    <div className="space-y-2 bg-slate-900/40 p-4 rounded-2xl border border-slate-850">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-slate-300">Drone Scan Cost:</span>
                        <span className="text-amber-400 font-black font-mono">₹{droneFee} / scan</span>
                      </div>
                      <input
                        type="range"
                        min={100}
                        max={1000}
                        step={25}
                        value={droneFee}
                        onChange={(e) => setDroneFee(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
                      />
                      <span className="text-[9px] text-slate-500 font-semibold block">Per autonomous mission flown using cooperative hardware network.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Outflows & Outputs (Right - lg:col-span-5) */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-3xl flex flex-col justify-between shadow-xl">
                <div className="space-y-5">
                  <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider border-b border-slate-850 pb-3">
                    Annual Financial Projections
                  </h4>

                  <div className="space-y-3">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex justify-between items-center">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase font-black">Gross Merchandise Volume (GMV)</span>
                        <span className="text-slate-300 text-xs font-semibold block mt-0.5">Total transaction volume traded</span>
                      </div>
                      <span className="text-slate-100 font-black font-mono text-sm">
                        ₹{(calculatedGMV / 10000000).toFixed(1)} Cr
                      </span>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex justify-between items-center">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase font-black">Marketplace Take Revenues</span>
                        <span className="text-slate-300 text-xs font-semibold block mt-0.5">{transactionFee}% commission capture</span>
                      </div>
                      <span className="text-indigo-400 font-black font-mono text-sm">
                        ₹{(calculatedMarketplaceRev / 100000).toFixed(1)} Lakhs
                      </span>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex justify-between items-center">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase font-black">SaaS Subscription Revenues</span>
                        <span className="text-slate-300 text-xs font-semibold block mt-0.5">Recurring precision data feed fees</span>
                      </div>
                      <span className="text-teal-400 font-black font-mono text-sm">
                        ₹{(calculatedSubRev / 10000000).toFixed(1)} Cr
                      </span>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex justify-between items-center">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase font-black">Drone Autonomous Scanning Fees</span>
                        <span className="text-slate-300 text-xs font-semibold block mt-0.5">{scansPerYear} multi-spectral scans per year</span>
                      </div>
                      <span className="text-amber-400 font-black font-mono text-sm">
                        ₹{(calculatedDroneRev / 10000000).toFixed(1)} Cr
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-850 mt-6">
                  {/* ARR Output */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center shadow-inner">
                    <div>
                      <span className="text-[9px] text-emerald-400 font-black uppercase tracking-wider">PROJECTED RUN-RATE ARR</span>
                      <span className="text-[11px] text-slate-400 block font-medium">Annual Recurring Revenue</span>
                    </div>
                    <span className="text-emerald-400 font-black font-mono text-xl">
                      ₹{(totalARR / 10000000).toFixed(2)} Cr
                    </span>
                  </div>

                  {/* Calculated Valuation */}
                  <div className="bg-gradient-to-r from-emerald-950 to-teal-950 p-4 rounded-2xl border border-emerald-500/20 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] text-emerald-300 font-black uppercase tracking-widest">IMPLIED VENTURE VALUATION</span>
                      <span className="text-[10px] text-slate-300 block font-semibold">@ 12.5x Multiplier cap</span>
                    </div>
                    <span className="text-white font-black font-mono text-2xl">
                      ₹{(projectedValuation / 10000000).toFixed(1)} Cr
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 203 FEATURES AUDIT CHECKS */}
        {activeSubTab === "features" && (
          <div className="space-y-5">
            <div className="bg-slate-950 border border-slate-850 p-5 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-white flex items-center gap-1.5">
                  <Layers className="h-5 w-5 text-emerald-500 animate-pulse" /> 203 Complete Feature Catalog Deep-Dive
                </h3>
                <p className="text-xs text-slate-400 font-semibold">
                  Browse and audit our complete 203 startup feature repository. Use keywords or filters to audit monetization details.
                </p>
              </div>

              {/* Status Badge */}
              <span className="bg-indigo-500/15 text-indigo-400 text-xs font-black px-4 py-2 rounded-xl border border-indigo-500/20 uppercase tracking-wider shrink-0 shadow-sm">
                SaaS Monetization Integrated
              </span>
            </div>

            {/* Filter and Search controls */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-850/80">
              <div className="md:col-span-6 flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
                <Search className="h-4 w-4 text-slate-500 shrink-0 mr-2" />
                <input
                  type="text"
                  placeholder="Search 203 features by keyword, category, or monetization model..."
                  value={featureSearch}
                  onChange={(e) => setFeatureSearch(e.target.value)}
                  className="bg-transparent text-white text-xs w-full focus:outline-none placeholder-slate-500"
                />
              </div>

              <div className="md:col-span-6 flex flex-wrap gap-1.5 items-center justify-start md:justify-end">
                {["ALL", "AI/ML Core", "IoT / Drone", "Finance", "Offline / Infrastructure", "User Accessibility", "Gamification"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider cursor-pointer transition-all ${
                      selectedCategory === cat
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Feature Grid results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFeatures.map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="bg-slate-950 border border-slate-850/70 hover:border-emerald-500/20 p-5 rounded-2xl space-y-3 transition-all flex flex-col justify-between hover:scale-[1.01] shadow-xs">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md">
                          {item.cat}
                        </span>
                        <span className="text-[9px] text-emerald-400 font-extrabold flex items-center gap-1 uppercase tracking-wide">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> {item.status}
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                        <Icon className="h-4.5 w-4.5 text-emerald-400 shrink-0" /> {item.name}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>

                    <div className="border-t border-slate-900 pt-2.5 flex justify-between items-center text-[10px] font-bold text-slate-500">
                      <span>Monetization Stream:</span>
                      <span className="text-white bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded text-[9.5px]">
                        {item.cat === "Finance" ? "Transaction Fee" : item.cat === "IoT / Drone" ? "Usage-based Scans" : "Included in SaaS Premium"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: INTERACTIVE VOICE ASSISTANT / PITCH COACH */}
        {activeSubTab === "voice" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* The Speech & Voice Interactive Console */}
            <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-6 relative overflow-hidden shadow-inner">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="border-b border-slate-850 pb-4">
                <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full inline-flex items-center gap-1 mr-2">
                  <Mic className="h-3.5 w-3.5" /> Speech Synthesis Active
                </span>
                <span className="text-slate-500 text-[10px] font-bold">Verify low-literacy features in real-time</span>
              </div>

              {/* Central Coach Visualizer */}
              <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
                <div className={`relative p-5 rounded-full border transition-all ${
                  isRecording 
                    ? "bg-rose-950 border-rose-500 text-rose-500 animate-ping" 
                    : isSpeaking
                      ? "bg-emerald-950 border-emerald-500 text-emerald-500"
                      : "bg-slate-950 border-slate-800 text-slate-400"
                }`}>
                  <Mic className="h-8 w-8" />
                </div>

                <div>
                  <h4 className="text-white font-extrabold text-sm uppercase tracking-wide">
                    {isRecording ? "Listening to voice input..." : isSpeaking ? "Speaking Response..." : "AgriConnect AI Pitch Coach"}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {isRecording ? "Ask me how we acquire farmers or details about offline databases." : "Tap microphone below to activate voice queries."}
                  </p>
                </div>

                {/* Simulated Audio Spectrum Waves when speaking or recording */}
                {(isRecording || isSpeaking) && (
                  <div className="flex gap-1 h-5 items-center">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(bar => (
                      <span
                        key={bar}
                        className={`w-1 rounded-full ${isRecording ? "bg-rose-500 animate-bounce" : "bg-emerald-500 animate-bounce"}`}
                        style={{
                          height: `${Math.random() * 100}%`,
                          animationDelay: `${bar * 100}ms`
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Action trigger bar */}
              <div className="flex gap-2.5">
                <button
                  onClick={startSpeechRecognition}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isRecording 
                      ? "bg-rose-600 text-white hover:bg-rose-700 animate-pulse" 
                      : "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800"
                  }`}
                >
                  <Mic className="h-4 w-4" />
                  {isRecording ? "Recording Now" : "Record Voice Query"}
                </button>

                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-rose-400 hover:text-rose-300 hover:bg-slate-850 cursor-pointer flex items-center gap-1.5"
                  >
                    <VolumeX className="h-4 w-4" /> Stop Audio
                  </button>
                )}
              </div>

              {/* Fallback Text Input Search bar */}
              <div className="space-y-2">
                <span className="text-[9px] text-slate-500 font-extrabold uppercase block">Or Submit Text Inquiry</span>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (voiceSearchText.trim()) {
                      processPitchQuestion(voiceSearchText);
                      setVoiceSearchText("");
                    }
                  }}
                  className="flex gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1.5"
                >
                  <input
                    type="text"
                    placeholder="Type pitch question (e.g. Moats, unit economics, total addressable market)..."
                    value={voiceSearchText}
                    onChange={(e) => setVoiceSearchText(e.target.value)}
                    className="flex-1 bg-transparent text-xs text-white px-2.5 focus:outline-none placeholder-slate-500"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-1.5 rounded-lg font-black uppercase tracking-wider cursor-pointer"
                  >
                    Query
                  </button>
                </form>
              </div>
            </div>

            {/* AI Advisor Response panel */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-5 rounded-3xl space-y-4">
              <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest block flex items-center gap-1.5">
                <Volume2 className="h-4 w-4 text-emerald-400" /> Pitch Coach Response Feed
              </span>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 text-slate-300 text-xs leading-relaxed font-medium font-sans min-h-[160px] flex flex-col justify-between">
                <p>{coachResponse}</p>
                {speechSynthesisSupported && !isSpeaking && (
                  <button
                    onClick={() => speakResponse(coachResponse)}
                    className="mt-3 text-[10px] text-emerald-400 hover:text-emerald-300 font-black flex items-center gap-1 uppercase tracking-wider self-start cursor-pointer border border-emerald-500/20 px-2 py-0.5 rounded bg-emerald-950/20"
                  >
                    <Volume2 className="h-3.5 w-3.5" /> Read Aloud
                  </button>
                )}
              </div>

              {/* Presets Grid */}
              <div className="space-y-2.5">
                <span className="text-[9px] text-slate-500 font-extrabold uppercase block">Inquire Preset Pitch Topics</span>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    "What are our technology moats against competitors?",
                    "How does the offline ServiceWorker synchronizer function?",
                    "What is our projected annual recurring revenue & TAM?",
                    "Explain our multi-tiered monetization strategy."
                  ].map((preset, prIdx) => (
                    <button
                      key={prIdx}
                      onClick={() => {
                        setVoiceQuery(preset);
                        processPitchQuestion(preset);
                      }}
                      className="text-left bg-slate-900 hover:bg-slate-850 text-[11px] text-slate-300 font-bold p-2.5 rounded-xl border border-slate-850 hover:border-emerald-500/20 transition-all cursor-pointer block truncate"
                    >
                      💡 {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: REAL-WORLD INTEGRATIONS SANDBOX */}
        {activeSubTab === "integrations" && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Left menu column */}
            <div className="xl:col-span-3 bg-slate-950 border border-slate-800 p-4 rounded-3xl space-y-4">
              <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest block select-none">
                Integration Portals
              </span>
              <div className="flex xl:flex-col gap-1 overflow-x-auto xl:overflow-visible pb-2 xl:pb-0">
                {[
                  { id: "payments", label: "💳 Razorpay & Stripe Payouts", desc: "Escrows & GST invoices" },
                  { id: "alerts", label: "🔔 SMS & WhatsApp Broadcasts", desc: "Twilio & Resend alerts" },
                  { id: "pathology", label: "🔬 YOLOv8 Pathology & Soil AI", desc: "Leaf CV & PDF report parsing" },
                  { id: "gis", label: "🗺️ GIS Mapping & Route Engine", desc: "Boundary area & cold chains" },
                  { id: "blockchain", label: "⛓️ Aadhaar KYC & Smart Contract", desc: "UIDAI verify & trace QRs" },
                  { id: "webrtc", label: "📹 Expert WebRTC Consultation", desc: "Direct P2P HD video chats" }
                ].map((link) => (
                  <button
                    key={link.id}
                    onClick={() => setIntegrationView(link.id as any)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer whitespace-nowrap xl:whitespace-normal shrink-0 xl:shrink ${
                      integrationView === link.id
                        ? "border-emerald-500 bg-emerald-950/20 text-white font-extrabold"
                        : "border-transparent text-slate-400 hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    <span className="text-xs block font-bold">{link.label}</span>
                    <span className="text-[9px] text-slate-500 font-semibold block mt-0.5 leading-tight">{link.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right main display column */}
            <div className="xl:col-span-9">
              {integrationView === "payments" && (
                <PaymentGatewayDemo onAddTransactionToARR={(fee) => {
                  setCommissionEarned(prev => prev + fee);
                }} />
              )}
              {integrationView === "alerts" && (
                <AlertOrchestration onTogglePremiumSms={(isActive) => {
                  setSmsRevenueActive(isActive);
                }} />
              )}
              {integrationView === "pathology" && <CropPathologyAI />}
              {integrationView === "gis" && <GeospatialFarmMapper />}
              {integrationView === "blockchain" && <TraceabilityBlockchain />}
              {integrationView === "webrtc" && <WebRTCConsultation />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartupPitchHub;
