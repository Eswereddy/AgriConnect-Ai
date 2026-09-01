import React, { useState, useEffect, useRef } from "react";
import {
  BrainCircuit,
  Sprout,
  Cpu,
  Plane,
  Globe,
  Database,
  Activity,
  Zap,
  Sparkles,
  Sliders,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Send,
  Upload,
  Camera,
  Layers,
  MapPin,
  TrendingUp,
  CloudRain,
  Sun,
  Thermometer,
  Droplets,
  Wind,
  ShieldAlert,
  BarChart3,
  Bot,
  RefreshCw,
  Search,
  Filter,
  Plus,
  Trash2,
  Settings,
  Terminal,
  Radio,
  Server,
  Key,
  Code2,
  Gauge,
  Clock,
  ArrowRight,
  Maximize2,
  Eye,
  Info,
  Check,
  X,
  Volume2,
  Mic,
  MicOff,
  Share2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Award,
  ZapOff,
  Battery,
  Wifi,
  Sparkle,
  DollarSign,
  Code,
  Target,
  Trophy,
  Gamepad2,
  Lock,
  ShieldCheck,
  Scale,
  Receipt,
  CloudLightning,
  Bug,
  Droplet,
  Download,
  Flame,
  Coins,
  Users,
  Briefcase,
  Shield,
  CheckCircle,
  FileSpreadsheet
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
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
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";

import { UserRole } from "../types";

// ==========================================
// TYPES & DATA MODELS
// ==========================================

export type EngineSection =
  | "overview"
  | "autonomous_ai"
  | "smart_hardware"
  | "drone_aerial"
  | "satellite_global"
  | "streaming_apis"
  | "gamification_monetization"
  | "ai_models"
  | "iot_network"
  | "drone_system"
  | "satellite_gis"
  | "kafka_pipeline"
  | "storage_retention"
  | "external_apis"
  | "ecosystem_integration";

export type AIModelType =
  | "crop_recommendation"
  | "disease_detection"
  | "yield_prediction"
  | "price_prediction"
  | "rag_chat"
  | "soil_analysis"
  | "weather_intelligence"
  | "farm_health_score";

interface DeviceNode {
  id: string;
  name: string;
  type: string;
  unit: string;
  currentValue: number;
  battery: number;
  signal: number; // dBm
  status: "Active" | "Offline" | "Maintenance";
  location: string;
  samplingFreq: string;
  lastReading: string;
}

interface DroneMission {
  id: string;
  name: string;
  type: "Scan" | "Spray" | "Mapping" | "Emergency" | "Inspection";
  farmId: string;
  areaAcres: number;
  altitudeMeters: number;
  speedMs: number;
  status: "Scheduled" | "Ready" | "In Progress" | "Completed" | "Failed";
  progress: number;
  scheduledTime: string;
  ndviAverage: number;
}

interface KafkaEvent {
  id: string;
  timestamp: string;
  topic: string;
  partition: number;
  payload: string;
  status: "Processed" | "Pending" | "Error";
}

interface APIEndpointDoc {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  title: string;
  description: string;
  sampleInput: string;
  sampleOutput: string;
}

// Sample Data for Recharts
const PRICE_FORECAST_DATA = [
  { day: "Current", basmati: 6400, wheat: 2450, maize: 1850, cotton: 7200 },
  { day: "+7 Days", basmati: 6480, wheat: 2470, maize: 1880, cotton: 7280 },
  { day: "+15 Days", basmati: 6620, wheat: 2510, maize: 1910, cotton: 7350 },
  { day: "+30 Days", basmati: 6850, wheat: 2580, maize: 1960, cotton: 7500 },
  { day: "+60 Days", basmati: 7100, wheat: 2640, maize: 2020, cotton: 7680 },
  { day: "+90 Days", basmati: 7350, wheat: 2720, maize: 2090, cotton: 7850 }
];

const HISTORIC_IOT_TELEMETRY = [
  { time: "00:00", moisture: 42, temp: 22, humidity: 82, par: 0 },
  { time: "04:00", moisture: 41, temp: 20, humidity: 88, par: 0 },
  { time: "08:00", moisture: 39, temp: 25, humidity: 72, par: 450 },
  { time: "12:00", moisture: 35, temp: 32, humidity: 54, par: 1850 },
  { time: "16:00", moisture: 33, temp: 31, humidity: 58, par: 1200 },
  { time: "20:00", moisture: 38, temp: 26, humidity: 75, par: 120 }
];

const SOIL_RADAR_DATA = [
  { subject: "Nitrogen (N)", current: 65, optimal: 80 },
  { subject: "Phosphorus (P)", current: 48, optimal: 60 },
  { subject: "Potassium (K)", current: 82, optimal: 75 },
  { subject: "Organic Matter", current: 55, optimal: 70 },
  { subject: "Micronutrients", current: 70, optimal: 85 },
  { subject: "Moisture Retention", current: 78, optimal: 80 }
];

export default function AIIoTIntegrationEngine() {
  // Main Active Section Tab
  const [activeSection, setActiveSection] = useState<EngineSection>("overview");

  // Selected AI Model inside Sub-tab
  const [selectedAIModel, setSelectedAIModel] = useState<AIModelType>("crop_recommendation");

  // API Tester State
  const [activeApiTab, setActiveApiTab] = useState<string>("recommend");
  const [apiResponseJson, setApiResponseJson] = useState<string>("");
  const [isExecutingApi, setIsExecutingApi] = useState<boolean>(false);

  // --- NEW AUTONOMOUS & ADVANCED AI STATE ---
  const [autonomousMode, setAutonomousMode] = useState<boolean>(true);
  const [autoLogs, setAutoLogs] = useState<Array<{ time: string; action: string; category: string; impact: string }>>([
    { time: "06:00 AM", action: "Triggered Solenoid Valve #3 in Sector A (Soil moisture < 35%)", category: "Irrigation", impact: "Saved 4,200L water" },
    { time: "08:15 AM", action: "Calculated NPK micro-dosing: Dispensed 12kg Urea + 8kg DAP", category: "Fertilization", impact: "+15% expected yield" },
    { time: "11:30 AM", action: "Detected Early Chlorosis on Drone Orthomosaic. Scheduled Mancozeb spray for 4 PM", category: "Pest Control", impact: "Prevented ₹45,000 crop loss" },
    { time: "02:00 PM", action: "Auto-filed Insurance Premium Optimizer with ICICI Lombard", category: "Finance", impact: "Saved ₹2,500 premium" }
  ]);

  // --- NEW GAMIFICATION & SIMULATOR STATE ---
  const [userCoins, setUserCoins] = useState<number>(540);
  const [userLevel, setUserLevel] = useState<number>(14);
  const [simCropChoice, setSimCropChoice] = useState<string>("Chickpeas (Desi)");
  const [simAcreageInput, setSimAcreageInput] = useState<number>(5);
  const [simFertilizerType, setSimFertilizerType] = useState<string>("Nano Urea + Organic Compost");
  const [simWeatherShift, setSimWeatherShift] = useState<string>("Unseasonal Rain (+15%)");

  // --- NEW DRONE SCAN STATE ---
  const [isScanningDrone, setIsScanningDrone] = useState<boolean>(false);
  const [droneProgress, setDroneProgress] = useState<number>(0);

  // --- MODEL 1: CROP RECOMMENDATION STATE ---
  const [recSoilType, setRecSoilType] = useState<string>("Loam");
  const [recPh, setRecPh] = useState<number>(6.5);
  const [recNitrogen, setRecNitrogen] = useState<number>(60);
  const [recPhosphorus, setRecPhosphorus] = useState<number>(45);
  const [recPotassium, setRecPotassium] = useState<number>(55);
  const [recRainfall, setRecRainfall] = useState<number>(850);
  const [recSeason, setRecSeason] = useState<string>("Kharif");
  const [recBudget, setRecBudget] = useState<number>(35000);
  const [recResults, setRecResults] = useState<any>(null);
  const [isRunningRec, setIsRunningRec] = useState<boolean>(false);

  // --- MODEL 2: DISEASE DETECTION STATE ---
  const [selectedDiseaseSample, setSelectedDiseaseSample] = useState<string>("early_blight");
  const [diseaseDiagnosis, setDiseaseDiagnosis] = useState<any>(null);
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);

  // --- MODEL 3: YIELD PREDICTION STATE ---
  const [yieldCrop, setYieldCrop] = useState<string>("Basmati Rice");
  const [yieldFertilizer, setYieldFertilizer] = useState<number>(120); // kg/acre
  const [yieldIrrigation, setYieldIrrigation] = useState<number>(450); // mm
  const [yieldPestPressure, setYieldPestPressure] = useState<string>("Low");
  const [yieldOutput, setYieldOutput] = useState<any>(null);

  // --- MODEL 4: PRICE PREDICTION STATE ---
  const [priceCrop, setPriceCrop] = useState<string>("Basmati Rice");
  const [priceDays, setPriceDays] = useState<number>(30);
  const [priceForecastResult, setPriceForecastResult] = useState<any>(null);

  // --- MODEL 5: RAG CHAT ASSISTANT STATE ---
  const [chatLanguage, setChatLanguage] = useState<string>("Telugu");
  const [chatUserRole, setChatUserRole] = useState<string>("Farmer");
  const [chatInput, setChatInput] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "bot"; text: string; sources?: string[] }>>([
    {
      sender: "bot",
      text: "Namaste! I am AgriConnect AI Copilot powered by Gemini & RAG. Ask me anything regarding soil health, disease mitigation, or government schemes.",
      sources: ["ICAR Agronomy Handbook v4.2", "PM-KISAN Scheme Circular 2026"]
    }
  ]);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // --- MODEL 6: SOIL ANALYSIS STATE ---
  const [soilPhInput, setSoilPhInput] = useState<number>(6.2);
  const [soilEC, setSoilEC] = useState<number>(1.1);
  const [soilOrganicCarbon, setSoilOrganicCarbon] = useState<number>(0.62);
  const [soilReportOutput, setSoilReportOutput] = useState<any>(null);

  // --- SECTION 2: IOT SENSOR STATE ---
  const [devices, setDevices] = useState<DeviceNode[]>([
    { id: "DEV-101", name: "North Block Soil Station", type: "Soil Moisture", unit: "%", currentValue: 38, battery: 94, signal: -62, status: "Active", location: "Sector A1", samplingFreq: "15 min", lastReading: "2 mins ago" },
    { id: "DEV-102", name: "Greenhouse Canopy Temp", type: "Temperature", unit: "°C", currentValue: 28.4, battery: 88, signal: -58, status: "Active", location: "Greenhouse 3", samplingFreq: "5 min", lastReading: "Just now" },
    { id: "DEV-103", name: "Borewell Level Monitor", type: "Water Level", unit: "m", currentValue: 18.2, battery: 76, signal: -71, status: "Active", location: "Reservoir South", samplingFreq: "1 hour", lastReading: "12 mins ago" },
    { id: "DEV-104", name: "Micro-Climate Anemometer", type: "Wind Speed", unit: "m/s", currentValue: 4.8, battery: 92, signal: -55, status: "Active", location: "Weather Tower", samplingFreq: "10 min", lastReading: "4 mins ago" },
    { id: "DEV-105", name: "NPK Optical Sensor", type: "Electrical Conductivity", unit: "dS/m", currentValue: 1.45, battery: 81, signal: -68, status: "Active", location: "Sector B4", samplingFreq: "30 min", lastReading: "18 mins ago" }
  ]);
  const [newDevName, setNewDevName] = useState<string>("");
  const [newDevType, setNewDevType] = useState<string>("Soil Moisture");
  const [isPumpActive, setIsPumpActive] = useState<boolean>(false);

  // --- SECTION 3: DRONE MISSIONS STATE ---
  const [droneMissions, setDroneMissions] = useState<DroneMission[]>([
    { id: "MSN-8801", name: "North Sector Crop Health Survey", type: "Scan", farmId: "FARM-HYD-01", areaAcres: 45, altitudeMeters: 60, speedMs: 8, status: "Completed", progress: 100, scheduledTime: "Today, 08:30 AM", ndviAverage: 0.78 },
    { id: "MSN-8802", name: "Targeted Pesticide Spray (Spot B)", type: "Spray", farmId: "FARM-HYD-01", areaAcres: 12, altitudeMeters: 15, speedMs: 4, status: "In Progress", progress: 68, scheduledTime: "Today, 11:15 AM", ndviAverage: 0.42 },
    { id: "MSN-8803", name: "3D Topographic Elevation Mapping", type: "Mapping", farmId: "FARM-HYD-01", areaAcres: 120, altitudeMeters: 100, speedMs: 12, status: "Scheduled", progress: 0, scheduledTime: "Tomorrow, 07:00 AM", ndviAverage: 0.81 }
  ]);
  const [activeDroneLayer, setActiveDroneLayer] = useState<"NDVI" | "RGB" | "Thermal" | "PestHotspot" | "3DHeight">("NDVI");

  // --- SECTION 5: KAFKA REAL-TIME EVENT STREAM ---
  const [kafkaEvents, setKafkaEvents] = useState<KafkaEvent[]>([
    { id: "EVT-9001", timestamp: "10:14:02.122", topic: "agriconnect.iot.readings", partition: 2, payload: '{"devId":"DEV-101","moisture":38,"temp":28.4}', status: "Processed" },
    { id: "EVT-9002", timestamp: "10:14:03.450", topic: "agriconnect.ai.predictions", partition: 0, payload: '{"model":"YOLOv8","disease":"Early Blight","conf":0.94}', status: "Processed" },
    { id: "EVT-9003", timestamp: "10:14:04.881", topic: "agriconnect.drone.missions", partition: 1, payload: '{"droneId":"DRN-X1","battery":78%,"lat":17.385,"lon":78.486}', status: "Processed" },
    { id: "EVT-9004", timestamp: "10:14:05.109", topic: "agriconnect.alerts", partition: 3, payload: '{"type":"MOISTURE_CRITICAL","farmId":"FARM-01","val":32}', status: "Processed" }
  ]);

  // Handle Crop Recommendation Run
  const handleRunCropRec = () => {
    setIsRunningRec(true);
    setTimeout(() => {
      setIsRunningRec(false);
      setRecResults([
        { crop: "Basmati Rice (PBW-1121)", confidence: 96, expectedYield: "4.8 Tons/Acre", profit: "₹78,400/Acre", npk: "120:60:40 kg/ha", irrigation: "45 mm/week", window: "June 15 - July 10", risk: "Low (Optimal climate)" },
        { crop: "Hybrid Maize (DKC-9108)", confidence: 91, expectedYield: "5.2 Tons/Acre", profit: "₹62,000/Acre", npk: "150:75:60 kg/ha", irrigation: "30 mm/week", window: "June 20 - July 15", risk: "Low" },
        { crop: "Organic Soybean (JS-335)", confidence: 87, expectedYield: "2.1 Tons/Acre", profit: "₹54,000/Acre", npk: "30:60:40 kg/ha", irrigation: "Rainfed / Supplementary", window: "June 10 - July 05", risk: "Moderate (Price Volatility)" },
        { crop: "Bt Cotton (RCH-658)", confidence: 82, expectedYield: "1.8 Tons/Acre", profit: "₹69,500/Acre", npk: "100:50:50 kg/ha", irrigation: "25 mm/week", window: "June 01 - June 25", risk: "Moderate (Pest Risk)" },
        { crop: "Chickpea / Chana (JG-11)", confidence: 78, expectedYield: "1.4 Tons/Acre", profit: "₹42,000/Acre", npk: "20:40:20 kg/ha", irrigation: "Minimal", window: "Oct 15 - Nov 10", risk: "Low" }
      ]);
    }, 800);
  };

  // Handle Disease Classifier
  const handleDiagnoseDisease = () => {
    setIsDiagnosing(true);
    setTimeout(() => {
      setIsDiagnosing(false);
      if (selectedDiseaseSample === "early_blight") {
        setDiseaseDiagnosis({
          diseaseName: "Early Blight (Alternaria solani)",
          severity: "Moderate",
          confidence: 94.8,
          chemicalTreatment: "Spray Copper Hydroxide @ 2.5g/L or Mancozeb 75% WP @ 2g/L.",
          organicTreatment: "Apply Neem Oil (10,000 ppm) @ 5ml/L or Pseudomonas fluorescens @ 10g/L.",
          applicationTiming: "Spray early morning or late evening; repeat after 10 days.",
          prevention: "Prune lower infected leaves, maintain 45cm row spacing for aeration, avoid overhead watering.",
          spreadSpeed: "Moderate (15-20 meters/week depending on wind and humidity)",
          quarantineNeeded: false
        });
      } else if (selectedDiseaseSample === "leaf_streak") {
        setDiseaseDiagnosis({
          diseaseName: "Bacterial Leaf Streak (Xanthomonas oryzae)",
          severity: "Severe",
          confidence: 91.2,
          chemicalTreatment: "Streptocycline @ 1g/10L + Copper Oxychloride @ 30g/10L water.",
          organicTreatment: "Cow dung slurry filtrate spray + Panchagavya 3% spray.",
          applicationTiming: "Immediate application required upon early lesion detection.",
          prevention: "Drain standing water, avoid excess nitrogen fertilizer, use certified resistant seeds.",
          spreadSpeed: "High (Rapid waterborne and wind-driven spread)",
          quarantineNeeded: true
        });
      } else {
        setDiseaseDiagnosis({
          diseaseName: "Healthy Crop Leaf (No Disease Detected)",
          severity: "None",
          confidence: 98.4,
          chemicalTreatment: "None required.",
          organicTreatment: "Standard bio-stimulant foliar spray for maintenance.",
          applicationTiming: "N/A",
          prevention: "Continue routine crop monitoring and soil nutrient balancing.",
          spreadSpeed: "N/A",
          quarantineNeeded: false
        });
      }
    }, 700);
  };

  // Handle Chat Submit
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages(prev => [...prev, { sender: "user", text: userText }]);
    setChatInput("");

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: `[AgriConnect AI Assistant - ${chatLanguage} Mode]: Based on real-time soil telemetry (${recSoilType}, pH ${recPh}) and market price trends for ${priceCrop}, my recommendation is to maintain 38% moisture and check for early blight spots. You are also eligible for the Solar Irrigation Subsidy (80% funding).`,
          sources: ["ICAR Precision Agronomy Portal", "APMC Mandi Price Stream", "PM KISAN Scheme Docs"]
        }
      ]);
    }, 700);
  };

  // Handle Adding Device
  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevName) return;
    const newDev: DeviceNode = {
      id: `DEV-${Math.floor(100 + Math.random() * 900)}`,
      name: newDevName,
      type: newDevType,
      unit: newDevType === "Soil Moisture" ? "%" : newDevType === "Temperature" ? "°C" : "mg/kg",
      currentValue: Math.floor(20 + Math.random() * 60),
      battery: 100,
      signal: -55,
      status: "Active",
      location: "Sector C1",
      samplingFreq: "15 min",
      lastReading: "Just now"
    };
    setDevices(prev => [newDev, ...prev]);
    setNewDevName("");
  };

  // Run initial calculations
  useEffect(() => {
    handleRunCropRec();
    handleDiagnoseDisease();
  }, []);

  return (
    <div id="ai-iot-integration-engine-hub" className="space-y-6 animate-in fade-in pb-12">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-2xl border border-indigo-500/20 relative overflow-hidden">
        {/* Background Glowing Accents */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-500/30 flex items-center justify-center text-white">
                <BrainCircuit className="h-7 w-7 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display">
                    AgriConnect <span className="text-emerald-400">AI & IoT</span> Integration Engine
                  </h1>
                  <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                    V4.8 Central Brain Active
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  Real-time intelligence connecting Sensors, Drones, Satellites, AI/ML Models & Kafka Streaming Pipelines across all 8 Platform Portals.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Engine Telemetry Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/5 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/10 text-center">
              <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-400 uppercase tracking-widest font-bold">
                <Cpu className="h-3.5 w-3.5" /> AI Models
              </div>
              <p className="text-lg font-black text-white mt-0.5">8 Pipelines</p>
              <p className="text-[9px] text-slate-400 font-semibold">94.2% Avg Accuracy</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/10 text-center">
              <div className="flex items-center justify-center gap-1 text-[10px] text-blue-400 uppercase tracking-widest font-bold">
                <Radio className="h-3.5 w-3.5 animate-pulse" /> IoT Nodes
              </div>
              <p className="text-lg font-black text-white mt-0.5">120 Active</p>
              <p className="text-[9px] text-slate-400 font-semibold">1,240 msg/min</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/10 text-center">
              <div className="flex items-center justify-center gap-1 text-[10px] text-purple-400 uppercase tracking-widest font-bold">
                <Plane className="h-3.5 w-3.5" /> Drone Fleet
              </div>
              <p className="text-lg font-black text-white mt-0.5">4 Drones</p>
              <p className="text-[9px] text-slate-400 font-semibold">NDVI & LiDAR Active</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/10 text-center">
              <div className="flex items-center justify-center gap-1 text-[10px] text-amber-400 uppercase tracking-widest font-bold">
                <Zap className="h-3.5 w-3.5" /> Kafka Stream
              </div>
              <p className="text-lg font-black text-white mt-0.5">3.4k msg/s</p>
              <p className="text-[9px] text-slate-400 font-semibold">4ms Latency</p>
            </div>
          </div>
        </div>

        {/* SECTION NAVIGATION TABS */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-2 overflow-x-auto">
          {[
            { id: "overview", label: "0. System Architecture", icon: Server },
            { id: "autonomous_ai", label: "1. Autonomous & Predictive AI (15 Features)", icon: Bot },
            { id: "smart_hardware", label: "2. Advanced IoT Hardware (10 Features)", icon: Cpu },
            { id: "drone_aerial", label: "3. Precision Drone Fleet (10 Features)", icon: Plane },
            { id: "satellite_global", label: "4. Satellite GIS Intelligence (6 Features)", icon: Globe },
            { id: "streaming_apis", label: "5. Real-Time Streaming & APIs (5 Features)", icon: Zap },
            { id: "gamification_monetization", label: "6. Gamification, Simulator & Business (5 Features)", icon: Trophy },
            { id: "ai_models", label: "7. Classic AI/ML Suite", icon: BrainCircuit },
            { id: "iot_network", label: "8. Live IoT Nodes", icon: Radio },
            { id: "drone_system", label: "9. Drone Telemetry", icon: Plane },
            { id: "satellite_gis", label: "10. Satellite Feeds", icon: Globe },
            { id: "kafka_pipeline", label: "11. Apache Kafka", icon: Activity },
            { id: "storage_retention", label: "12. Polyglot DBs", icon: Database },
            { id: "external_apis", label: "13. API Sandbox", icon: Terminal },
            { id: "ecosystem_integration", label: "14. Ecosystem Matrix", icon: Layers }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as EngineSection)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-102"
                    : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================== */}
      {/* TAB 0: OVERVIEW & ARCHITECTURE             */}
      {/* ========================================== */}
      {activeSection === "overview" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 font-display">
                  <Server className="h-5 w-5 text-emerald-600" />
                  AgriConnect AI & IoT Platform Architecture
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  End-to-end data pipeline from physical field sensors to AI inference models and multi-portal actionable notifications.
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                Full Ecosystem Connected
              </span>
            </div>

            {/* Architecture Flow Visualizer */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Layer 1: Ingestion */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <Radio className="h-4 w-4 text-emerald-600" />
                  <span>1. Ingestion Layer</span>
                </div>
                <div className="space-y-2 text-[11px] text-slate-600 font-medium">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                    <p className="font-bold text-slate-800">IoT Sensors (MQTT)</p>
                    <p className="text-[10px] text-slate-400">Soil, Temp, Moisture, PAR, pH</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                    <p className="font-bold text-slate-800">Drone Missions</p>
                    <p className="text-[10px] text-slate-400">NDVI, Thermal, RGB, LiDAR</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                    <p className="font-bold text-slate-800">Satellite Feeds</p>
                    <p className="text-[10px] text-slate-400">Sentinel-2, Landsat 9</p>
                  </div>
                </div>
              </div>

              {/* Layer 2: Realtime Stream */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <Zap className="h-4 w-4 text-amber-600" />
                  <span>2. Streaming Pipeline</span>
                </div>
                <div className="space-y-2 text-[11px] text-slate-600 font-medium">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                    <p className="font-bold text-slate-800">Apache Kafka Cluster</p>
                    <p className="text-[10px] text-slate-400">7 Partitioned Topics</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                    <p className="font-bold text-slate-800">Stream Anomaly Detector</p>
                    <p className="text-[10px] text-slate-400">Threshold & Range Validation</p>
                  </div>
                </div>
              </div>

              {/* Layer 3: AI Inference Engine */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <BrainCircuit className="h-4 w-4 text-purple-600" />
                  <span>3. AI Inference Hub</span>
                </div>
                <div className="space-y-2 text-[11px] text-slate-600 font-medium">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                    <p className="font-bold text-slate-800">8 Dedicated Models</p>
                    <p className="text-[10px] text-slate-400">YOLOv8, LSTM, XGBoost, Transformers</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                    <p className="font-bold text-slate-800">RAG Vector Search</p>
                    <p className="text-[10px] text-slate-400">Pinecone + Gemini API Copilot</p>
                  </div>
                </div>
              </div>

              {/* Layer 4: Storage */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <Database className="h-4 w-4 text-blue-600" />
                  <span>4. Polyglot Storage</span>
                </div>
                <div className="space-y-2 text-[11px] text-slate-600 font-medium">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                    <p className="font-bold text-slate-800">TimescaleDB</p>
                    <p className="text-[10px] text-slate-400">Time-series sensor logs</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                    <p className="font-bold text-slate-800">PostgreSQL / Redis</p>
                    <p className="text-[10px] text-slate-400">Relational & Session Cache</p>
                  </div>
                </div>
              </div>

              {/* Layer 5: Ecosystem Delivery */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <Layers className="h-4 w-4 text-indigo-600" />
                  <span>5. Ecosystem Views</span>
                </div>
                <div className="space-y-2 text-[11px] text-slate-600 font-medium">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                    <p className="font-bold text-slate-800">All 8 Ecosystem Roles</p>
                    <p className="text-[10px] text-slate-400">Farmer, Buyer, Govt, Warehouse, etc.</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                    <p className="font-bold text-slate-800">SMS / App Push Alerts</p>
                    <p className="text-[10px] text-slate-400">10 Indian Languages</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Model Status Matrix */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800 font-display">8 Core AI/ML Models Real-time Health</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {[
                  { name: "1.1 Crop Recommendation", algo: "Random Forest + XGBoost", acc: "94.2%", speed: "12ms", status: "Active" },
                  { name: "1.2 Disease Detection", algo: "CNN + YOLOv8 + ResNet", acc: "93.8%", speed: "42ms", status: "Active" },
                  { name: "1.3 Yield Prediction", algo: "LSTM + Prophet + ARIMA", acc: "91.5%", speed: "28ms", status: "Active" },
                  { name: "1.4 Price Prediction", algo: "Transformers + Ensemble", acc: "90.4%", speed: "35ms", status: "Active" },
                  { name: "1.5 RAG Chat Assistant", algo: "Gemini API + Pinecone", acc: "95.0%", speed: "110ms", status: "Active" },
                  { name: "1.6 Soil Analysis", algo: "Random Forest Regressor", acc: "92.6%", speed: "18ms", status: "Active" },
                  { name: "1.7 Weather Intelligence", algo: "Multi-API Ensembling", acc: "96.1%", speed: "15ms", status: "Active" },
                  { name: "1.8 Farm Health Score", algo: "Weighted Composite ML", acc: "94.8%", speed: "8ms", status: "Active" }
                ].map((m, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-800">{m.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{m.algo}</p>
                      <div className="flex items-center gap-2 pt-1 text-[10px]">
                        <span className="text-emerald-700 font-bold">Accuracy: {m.acc}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500 font-medium">Latency: {m.speed}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-[9px] font-extrabold text-emerald-700 bg-emerald-100 rounded-full">
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 1: AUTONOMOUS & PREDICTIVE AI ENGINE   */}
      {/* ========================================== */}
      {activeSection === "autonomous_ai" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-purple-600 animate-bounce" />
                  <h2 className="text-lg font-bold text-slate-800 font-display">
                    1. Autonomous Farm Manager & Advanced AI (15 Core Capabilities)
                  </h2>
                </div>
                <p className="text-xs text-slate-500">
                  Zero-human-intervention farming engine, 30-day crop failure predictors, NPK blending, tax & insurance optimization.
                </p>
              </div>

              {/* Feature 1: Autonomous Toggle */}
              <div className="flex items-center gap-3 bg-purple-50 px-4 py-2 rounded-2xl border border-purple-200">
                <span className="text-xs font-bold text-purple-900">Autonomous Mode</span>
                <button
                  onClick={() => setAutonomousMode(!autonomousMode)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                    autonomousMode ? "bg-purple-600" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      autonomousMode ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                  {autonomousMode ? "Active (5.2 hrs/day saved)" : "Manual Overridden"}
                </span>
              </div>
            </div>

            {/* Feature 1 Action Feed */}
            {autonomousMode && (
              <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl space-y-3 font-mono text-xs border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                  <span className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Activity className="h-3.5 w-3.5 animate-pulse" /> Live Autonomous Agent Decision Stream
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                    100% Automated
                  </span>
                </div>
                <div className="space-y-2">
                  {autoLogs.map((log, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400 font-bold">[{log.time}]</span>
                        <span className="text-slate-200 font-sans">{log.action}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[9px] font-sans font-bold">{log.category}</span>
                        <span className="text-emerald-400 font-bold font-sans text-[10px]">{log.impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grid of 14 Other AI Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 2: 30-Day Failure Predictor */}
              <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-rose-600" /> 2. 30-Day Failure Predictor
                  </span>
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded-full">88% Accuracy</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>Wheat Crop Risk</span>
                    <span className="text-rose-600">72% Risk (Late Blight Trend)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full w-[72%]" />
                  </div>
                </div>
                <p className="text-[11px] text-slate-600">
                  <strong className="text-slate-800">Action Suggested:</strong> Apply Mancozeb 75% WP within 48h to reduce failure risk from 72% to 8%.
                </p>
                <button className="w-full py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer">
                  Execute Preventive Action
                </button>
              </div>

              {/* Feature 3: Insurance Optimizer */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" /> 3. Insurance Premium Optimizer
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">Scanned 15 Insurers</span>
                </div>
                <p className="text-xs text-slate-700">
                  Switch from standard SBI policy to ICICI Lombard Agrisure to save <strong className="text-emerald-700 font-extrabold">₹2,500/year</strong>.
                </p>
                <div className="bg-white p-2.5 rounded-xl border border-emerald-200 text-[11px] space-y-1 text-slate-600">
                  <div className="flex justify-between"><span>Current Premium:</span><span className="line-through text-slate-400">₹8,900/yr</span></div>
                  <div className="flex justify-between font-bold text-emerald-700"><span>Optimized Premium:</span><span>₹6,400/yr</span></div>
                </div>
                <button className="w-full py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer">
                  Auto-Apply via DigiLocker API
                </button>
              </div>

              {/* Feature 4: Fertilizer Blender */}
              <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="h-4 w-4 text-blue-600" /> 4. AI Fertilizer Blender
                  </span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">Save 30% Cost</span>
                </div>
                <p className="text-xs text-slate-700 font-medium">Input Soil NPK Target:</p>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="bg-white p-1.5 rounded-lg border border-blue-200">
                    <p className="text-slate-400 font-bold">N</p>
                    <p className="font-extrabold text-blue-800">20 kg Urea</p>
                  </div>
                  <div className="bg-white p-1.5 rounded-lg border border-blue-200">
                    <p className="text-slate-400 font-bold">P</p>
                    <p className="font-extrabold text-blue-800">15 kg DAP</p>
                  </div>
                  <div className="bg-white p-1.5 rounded-lg border border-blue-200">
                    <p className="text-slate-400 font-bold">K</p>
                    <p className="font-extrabold text-blue-800">10 kg MOP</p>
                  </div>
                </div>
                <button className="w-full py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer">
                  Order Pre-Blended NPK Bag (2-5% Affiliate Off)
                </button>
              </div>

              {/* Feature 5: AI Seed Selector */}
              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sprout className="h-4 w-4 text-amber-600" /> 5. AI Seed Selector (500+ Var)
                  </span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">Soil Match 98%</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-amber-200 text-xs space-y-1">
                  <p className="font-bold text-slate-800">Recommended Variety: PBW 343 Wheat</p>
                  <p className="text-[11px] text-slate-600">Expected Yield: <strong className="text-amber-800 font-bold">18.5 tons/acre</strong></p>
                  <p className="text-[11px] text-emerald-700 font-bold">Estimated Profit: ₹85,000/acre</p>
                </div>
                <button className="w-full py-1.5 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors cursor-pointer">
                  Reserve Certified Seed Bags
                </button>
              </div>

              {/* Feature 6: AI Pest Controller */}
              <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Bug className="h-4 w-4 text-indigo-600" /> 6. AI Pest Controller
                  </span>
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-full">Lifecycle Engine</span>
                </div>
                <p className="text-xs text-slate-700">
                  Targeted spray calendar based on humidity & aphid lifecycle:
                </p>
                <div className="space-y-1 text-[11px] text-slate-600">
                  <div className="flex justify-between bg-white p-1.5 rounded-lg border border-indigo-100">
                    <span>15-Jul-2026 @ 06:00 AM</span>
                    <span className="font-bold text-indigo-700">Mancozeb 75%</span>
                  </div>
                  <div className="flex justify-between bg-white p-1.5 rounded-lg border border-indigo-100">
                    <span>22-Jul-2026 @ 06:00 AM</span>
                    <span className="font-bold text-indigo-700">Neem Oil 10,000 PPM</span>
                  </div>
                </div>
              </div>

              {/* Feature 7: Water Manager */}
              <div className="p-4 bg-teal-50/60 border border-teal-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Droplet className="h-4 w-4 text-teal-600" /> 7. AI Water Manager
                  </span>
                  <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-[10px] font-bold rounded-full">40% Water Saved</span>
                </div>
                <p className="text-xs text-slate-700">
                  Moisture-aware drip scheduling across fields:
                </p>
                <div className="bg-white p-2 rounded-xl border border-teal-200 text-[11px] space-y-1">
                  <p className="text-slate-800 font-bold">Field A: Irrigate 15-Jul for 2.0 Hours</p>
                  <p className="text-slate-800 font-bold">Field B: Irrigate 16-Jul for 1.5 Hours</p>
                </div>
              </div>

              {/* Feature 8: Solar Panel Optimizer */}
              <div className="p-4 bg-yellow-50/60 border border-yellow-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-yellow-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sun className="h-4 w-4 text-yellow-600" /> 8. Solar Panel Optimizer
                  </span>
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] font-bold rounded-full">+25% Power</span>
                </div>
                <p className="text-xs text-slate-700">
                  Tilt array at <strong className="text-yellow-900 font-bold">15° South</strong> for maximum solar irrigation pump generation (4.2 kWh/day).
                </p>
              </div>

              {/* Feature 9: AI Business Plan Generator */}
              <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-purple-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-purple-600" /> 9. AI Business Plan Generator
                  </span>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full">Bank Loan Ready</span>
                </div>
                <p className="text-xs text-slate-700">
                  Auto-generates 12-page PDF bank proposal with 5-yr P&L, IRR, and PM-KISAN subsidy justification.
                </p>
                <button className="w-full py-1.5 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-colors cursor-pointer flex items-center justify-center gap-1">
                  <Download className="h-3.5 w-3.5" /> Generate "Farm_Business_Plan.pdf"
                </button>
              </div>

              {/* Feature 10: AI Tax Assistant */}
              <div className="p-4 bg-slate-100 border border-slate-300 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Receipt className="h-4 w-4 text-slate-700" /> 10. AI Tax Assistant (ITR-1/2)
                  </span>
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-800 text-[10px] font-bold rounded-full">Auto-Fill</span>
                </div>
                <p className="text-xs text-slate-700">
                  Agri income exempt under Sec 10(1). Calculated taxable non-agri balance: <strong className="text-slate-900 font-bold">₹0</strong>.
                </p>
              </div>

              {/* Feature 11: Carbon Footprint */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-emerald-600" /> 11. Carbon Footprint & Credits
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">Monetizable</span>
                </div>
                <p className="text-xs text-slate-700">
                  Farm emits 45 tons CO2/yr. Plant 50 agroforestry trees to earn <strong className="text-emerald-800 font-bold">₹18,000/yr</strong> in carbon credits.
                </p>
              </div>

              {/* Feature 12: Farm Valuation Engine */}
              <div className="p-4 bg-cyan-50/60 border border-cyan-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-cyan-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Scale className="h-4 w-4 text-cyan-600" /> 12. AI Farm Valuation
                  </span>
                  <span className="px-2 py-0.5 bg-cyan-100 text-cyan-800 text-[10px] font-bold rounded-full">Market Assessment</span>
                </div>
                <p className="text-xs text-slate-700">
                  Estimated Valuation: <strong className="text-cyan-900 font-extrabold text-sm">₹45.0 Lakhs</strong> (+12% regional soil premium).
                </p>
              </div>

              {/* Feature 13: Export Quality Predictor */}
              <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-indigo-600" /> 13. Export Quality Predictor
                  </span>
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded-full">EU / USA Grade</span>
                </div>
                <p className="text-xs text-slate-700">
                  Meets EU Maximum Residue Limits (MRL). Premium price unlock: <strong className="text-indigo-800 font-bold">₹3,200/quintal (+40%)</strong>.
                </p>
              </div>

              {/* Feature 14: 5-Year Market Demand Forecaster */}
              <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-purple-800 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-purple-600" /> 14. 5-Yr Demand Forecaster
                  </span>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-full">Macro Trend</span>
                </div>
                <p className="text-xs text-slate-700">
                  Wheat global demand projected <strong className="text-purple-900 font-bold">+15% by 2031</strong> due to export deficit.
                </p>
              </div>

              {/* Feature 15: 30-Day Disaster Predictor */}
              <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                    <CloudLightning className="h-4 w-4 text-rose-600" /> 15. 30-Day Disaster Early Warning
                  </span>
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded-full">82% Probability</span>
                </div>
                <p className="text-xs text-slate-700">
                  Monsoon deluge probability high for 15-Aug-2026. Advise harvesting early on Day -3.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 2: ADVANCED IOT HARDWARE CONTROL       */}
      {/* ========================================== */}
      {activeSection === "smart_hardware" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-emerald-600" />
                  2. Advanced IoT Hardware & Sensor Integration (10 Devices)
                </h2>
                <p className="text-xs text-slate-500">
                  Hardware-software closed loop: Solenoid valves, NPK dosing pumps, smart insect traps, cattle collars & deep-soil probes.
                </p>
              </div>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                10 Hardware Modules Operational
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { num: "16", title: "Automatic Irrigation System", desc: "Solenoid valve + pump controller auto-triggers on soil moisture < 35%.", spec: "MQTT Solenoid Relay", status: "Active" },
                { num: "17", title: "Fertilizer Dosage Controller", spec: "Precision NPK Dispenser", desc: "Dispenses precise N-P-K liquid milliliters direct to drip lines.", status: "Active" },
                { num: "18", title: "Smart Insect Trap", spec: "Camera + LED Light + GSM", desc: "AI camera counts attracted pests and alerts farmer before infestation.", status: "Active" },
                { num: "19", title: "Greenhouse Automation", spec: "Temp/RH/CO2 Actuators", desc: "Automates roof vents, misting nozzles, and circulation fans.", status: "Active" },
                { num: "20", title: "Livestock Health Wearable", spec: "Cattle Smart Collar", desc: "Monitors core body temp, heart rate & rumination with fever alerts.", status: "Active" },
                { num: "21", title: "Hyper-Local Weather Station", spec: "0.5°C Precision Sensor", desc: "Measures rain, wind speed, solar radiation & barometric pressure.", status: "Active" },
                { num: "22", title: "Deep Soil Multi-Depth Probe", spec: "6 Depths (10cm-60cm)", desc: "Tracks root-zone moisture gradient to prevent over-irrigating.", status: "Active" },
                { num: "23", title: "RFID Farm Gate System", spec: "RFID Reader + GPS", desc: "Logs worker attendance, tracks tractor entries, and deters theft.", status: "Active" },
                { num: "24", title: "Ultrasonic Water Sensor", spec: "Borewell & Tank Probe", desc: "Monitors groundwater table depth and prevents pump dry-runs.", status: "Active" },
                { num: "25", title: "Time-Lapse Crop Camera", spec: "Solar HD Diary Cam", desc: "Daily time-lapse images for crop height & growth velocity tracking.", status: "Active" }
              ].map((hw) => (
                <div key={hw.num} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 hover:border-emerald-400 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                      <Cpu className="h-4 w-4 text-emerald-600" /> {hw.num}. {hw.title}
                    </span>
                    <span className="px-2 py-0.5 text-[9px] font-black bg-emerald-100 text-emerald-800 rounded-full">{hw.status}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{hw.desc}</p>
                  <div className="bg-white p-2 rounded-xl border border-slate-200 text-[10px] font-mono text-slate-700 flex justify-between">
                    <span>Hardware Spec:</span>
                    <span className="font-bold text-slate-900">{hw.spec}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 3: PRECISION DRONE AERIAL INTELLIGENCE */}
      {/* ========================================== */}
      {activeSection === "drone_aerial" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
                  <Plane className="h-5 w-5 text-indigo-600" />
                  3. Precision Drone Aerial Intelligence (10 Capabilities)
                </h2>
                <p className="text-xs text-slate-500">
                  Autonomous flight mission planning, 99% AI plant counting, spot spraying, and 3D orthomosaic rendering.
                </p>
              </div>

              <button
                onClick={() => {
                  setIsScanningDrone(true);
                  setDroneProgress(0);
                  const timer = setInterval(() => {
                    setDroneProgress(prev => {
                      if (prev >= 100) {
                        clearInterval(timer);
                        setIsScanningDrone(false);
                        return 100;
                      }
                      return prev + 20;
                    });
                  }, 400);
                }}
                disabled={isScanningDrone}
                className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer flex items-center gap-2"
              >
                <Play className="h-3.5 w-3.5" />
                <span>{isScanningDrone ? `Scanning Fleet (${droneProgress}%)...` : "Simulate Fleet Aerial Scan"}</span>
              </button>
            </div>

            {/* Drone Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { num: "26", title: "AI Plant Count", desc: "Scans field to count plants: 12,345 detected (95% germination rate, 99% accuracy).", metric: "12,345 Plants Counted" },
                { num: "27", title: "Weed Detection & Mapping", desc: "Maps weed infestation zones for targeted spraying, saving 50% herbicide.", metric: "12 Weed Hotspots" },
                { num: "28", title: "Pre-Harvest Yield Estimator", desc: "Analyzes canopy volume via LiDAR to estimate 18.5 tons/acre (±5%).", metric: "18.5 Tons/Acre" },
                { num: "29", title: "Precision Pesticide Spraying", desc: "Autonomous flight path applies chemical only to infected zones.", metric: "70% Less Pesticide" },
                { num: "30", title: "Variable Rate Fertilizer", desc: "Delivers custom NPK dosage maps based on aerial chlorophyll density.", metric: "25% Less Fertilizer" },
                { num: "31", title: "3D Orthomosaic Mapping", desc: "High-res 3D elevation map for topographic water flow planning.", metric: "1.2cm/pixel Res" },
                { num: "32", title: "Thermal Leak Detection", desc: "FLIR thermal camera pinpoints underground irrigation line leaks.", metric: "40% Water Saved" },
                { num: "33", title: "Emergency Storm Assessment", desc: "Rapid post-disaster flight generates instant PDF claim reports.", metric: "1-Hour Claims" },
                { num: "34", title: "Disease Outbreak Early Warning", desc: "Detects subtle chlorosis 7 days before symptoms become visible.", metric: "7-Day Headstart" },
                { num: "35", title: "Aerial Seed Planting", desc: "Drone drops seed pods into optimal soil depth (50x faster).", metric: "10 Acres / Hour" }
              ].map((dr) => (
                <div key={dr.num} className="p-4 bg-indigo-50/40 border border-indigo-200 rounded-2xl space-y-3 hover:border-indigo-400 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-indigo-900 flex items-center gap-1.5">
                      <Plane className="h-4 w-4 text-indigo-600" /> {dr.num}. {dr.title}
                    </span>
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-indigo-100 text-indigo-800 rounded-full">{dr.metric}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{dr.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 4: SATELLITE GIS REMOTE SENSING        */}
      {/* ========================================== */}
      {activeSection === "satellite_global" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  4. Satellite Remote Sensing & Regional GIS (6 Capabilities)
                </h2>
                <p className="text-xs text-slate-500">
                  Global macro-intelligence using Sentinel-2, Landsat 9 & SAR microwave radar.
                </p>
              </div>
              <span className="text-xs font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                10m Spatial Resolution
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { num: "36", title: "Satellite Crop Classification", desc: "Multi-spectral Sentinel-2 AI automatically maps crop types across districts.", metric: "District-Wide" },
                { num: "37", title: "Satellite Drought Index (0-100)", desc: "Calculates NDWI & Vegetation Condition Index for drought early warnings.", metric: "Score: 82 (Normal)" },
                { num: "38", title: "Real-Time Flood Mapping", desc: "SAR radar pierces cloud cover to delineate submerged crop areas during storms.", metric: "Radar SAR Active" },
                { num: "39", title: "Regional Yield Forecast", desc: "Macro production estimation for state policy makers & grain trading desks.", metric: "1.2M Tons Estimated" },
                { num: "40", title: "Regional Soil Moisture Map", desc: "Microwave radiometer maps topsoil moisture at 1km grid resolution.", metric: "1km Grid Scale" },
                { num: "41", title: "National Crop Health Index", desc: "District-by-district health leaderboard for government subsidy tracking.", metric: "Top 5% Health Rank" }
              ].map((sat) => (
                <div key={sat.num} className="p-4 bg-blue-50/40 border border-blue-200 rounded-2xl space-y-3 hover:border-blue-400 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-blue-900 flex items-center gap-1.5">
                      <Globe className="h-4 w-4 text-blue-600" /> {sat.num}. {sat.title}
                    </span>
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-blue-100 text-blue-800 rounded-full">{sat.metric}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{sat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 5: REAL-TIME STREAMING & APIS          */}
      {/* ========================================== */}
      {activeSection === "streaming_apis" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-600" />
                  5. Real-Time Streaming & Enterprise APIs (5 Pipelines)
                </h2>
                <p className="text-xs text-slate-500">
                  Apache Kafka streaming, APMC price tickers, SMS engines, and enterprise REST/GraphQL data export APIs.
                </p>
              </div>
              <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                3,400 msgs/sec
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { num: "42", title: "APMC Mandi & NCDEX Stream", desc: "Live market price tickers from 100+ mandis with price breach push notifications.", metric: "100+ Mandis Live" },
                { num: "43", title: "Real-Time Weather Alert Engine", desc: "Automated SMS & WhatsApp weather warnings sent in 10 regional languages.", metric: "10 Languages" },
                { num: "44", title: "Live MQTT Sensor Dashboard", desc: "Sub-second gauge visualization for soil, temperature, wind and solar irradiance.", metric: "4ms Latency" },
                { num: "45", title: "Automated Report Generator", desc: "1-click generation of PDF, Excel & JSON telemetry summaries for farm audits.", metric: "PDF / XLSX / JSON" },
                { num: "46", title: "Enterprise Data Export API", desc: "Secure RESTful & GraphQL endpoints for banks, insurers, and researchers.", metric: "₹50,000/mo B2B" }
              ].map((st) => (
                <div key={st.num} className="p-4 bg-amber-50/40 border border-amber-200 rounded-2xl space-y-3 hover:border-amber-400 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5">
                      <Zap className="h-4 w-4 text-amber-600" /> {st.num}. {st.title}
                    </span>
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-800 rounded-full">{st.metric}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 6: GAMIFICATION, SIMULATOR & BUSINESS  */}
      {/* ========================================== */}
      {activeSection === "gamification_monetization" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  6. Gamification, What-If Simulator & Monetization Engine
                </h2>
                <p className="text-xs text-slate-500">
                  User retention quests, leaderboards, 50+ badges, scenario simulator & monetization tiers.
                </p>
              </div>

              {/* Gamification Stats */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-200 text-xs font-extrabold text-yellow-900">
                  <Coins className="h-4 w-4 text-yellow-600 animate-spin" />
                  <span>{userCoins} AgriCoins</span>
                </div>
                <div className="flex items-center gap-1.5 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200 text-xs font-extrabold text-purple-900">
                  <Trophy className="h-4 w-4 text-purple-600" />
                  <span>Level {userLevel} Farmer</span>
                </div>
              </div>
            </div>

            {/* Feature 47: Daily Quests */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Target className="h-4 w-4 text-emerald-600" /> 47. Daily Quests & Gamified Challenges
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { title: "Plant 100 Seeds Today", reward: "+10 Coins", status: "Completed" },
                  { title: "Irrigate Sector B Drip Lines", reward: "+15 Coins", status: "Claim Reward" },
                  { title: "Scan Soil pH via Optical Probe", reward: "+25 Coins", status: "In Progress" }
                ].map((q, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{q.title}</p>
                      <p className="text-[10px] text-yellow-700 font-bold">{q.reward}</p>
                    </div>
                    <button
                      onClick={() => setUserCoins(prev => prev + 15)}
                      className="px-2.5 py-1 text-[10px] font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
                    >
                      {q.status}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature 48 & 49: Leaderboard & Badges */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Feature 48: Leaderboard */}
              <div className="p-4 bg-yellow-50/40 border border-yellow-200 rounded-2xl space-y-3">
                <span className="text-xs font-extrabold text-yellow-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Trophy className="h-4 w-4 text-yellow-600" /> 48. Regional Farmer Leaderboard
                </span>
                <div className="space-y-2 text-xs">
                  {[
                    { rank: 1, name: "Ramesh Patel (Pune)", yield: "19.2 Tons/Acre", coins: "2,450" },
                    { rank: 2, name: "Sita Sharma (Nasik)", yield: "18.8 Tons/Acre", coins: "2,100" },
                    { rank: 3, name: "You (Sector A)", yield: "18.5 Tons/Acre", coins: `${userCoins}` }
                  ].map((f) => (
                    <div key={f.rank} className="flex justify-between items-center p-2 bg-white rounded-xl border border-yellow-200">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-yellow-400 text-yellow-950 font-black text-[10px] flex items-center justify-center">
                          #{f.rank}
                        </span>
                        <span className="font-bold text-slate-800">{f.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 font-medium">
                        <span>{f.yield}</span> • <strong className="text-yellow-700">{f.coins} Coins</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature 49: Badges */}
              <div className="p-4 bg-purple-50/40 border border-purple-200 rounded-2xl space-y-3">
                <span className="text-xs font-extrabold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-purple-600" /> 49. AI Badges & Achievements (50+ Badges)
                </span>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="p-2 bg-white rounded-xl border border-purple-200">
                    <p className="font-extrabold text-purple-800">🌾 Golden Harvest</p>
                    <p className="text-[9px] text-slate-500">18+ Tons Yield</p>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-purple-200">
                    <p className="font-extrabold text-purple-800">💧 Water Saver</p>
                    <p className="text-[9px] text-slate-500">Saved 40% Water</p>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-purple-200">
                    <p className="font-extrabold text-purple-800">🤖 Autonomous Master</p>
                    <p className="text-[9px] text-slate-500">30 Days Auto AI</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 50: What-If Farming Simulator */}
            <div className="p-5 bg-indigo-900 text-white rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-indigo-800 pb-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 text-indigo-300">
                  <Gamepad2 className="h-4 w-4 text-indigo-400" /> 50. AI What-If Farming Simulator
                </span>
                <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-2.5 py-0.5 rounded-full font-bold">
                  Monte Carlo Predictive Engine
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-indigo-200 font-bold block mb-1">Crop Choice:</label>
                  <select
                    value={simCropChoice}
                    onChange={(e) => setSimCropChoice(e.target.value)}
                    className="w-full bg-indigo-950 border border-indigo-700 text-white p-2 rounded-xl"
                  >
                    <option>Chickpeas (Desi)</option>
                    <option>Basmati Rice (PBW-1121)</option>
                    <option>Durum Wheat</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-indigo-200 font-bold block mb-1">Fertilizer Regimen:</label>
                  <select
                    value={simFertilizerType}
                    onChange={(e) => setSimFertilizerType(e.target.value)}
                    className="w-full bg-indigo-950 border border-indigo-700 text-white p-2 rounded-xl"
                  >
                    <option>Nano Urea + Organic Compost</option>
                    <option>Standard NPK Chemical</option>
                    <option>100% Organic Bio-fertilizer</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-indigo-200 font-bold block mb-1">Weather Shift Simulation:</label>
                  <select
                    value={simWeatherShift}
                    onChange={(e) => setSimWeatherShift(e.target.value)}
                    className="w-full bg-indigo-950 border border-indigo-700 text-white p-2 rounded-xl"
                  >
                    <option>Unseasonal Rain (+15%)</option>
                    <option>Extended Heatwave (+3°C)</option>
                    <option>Normal Seasonal Monsoon</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-indigo-950 rounded-xl border border-indigo-800 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="space-y-0.5 text-xs">
                  <p className="text-emerald-400 font-bold">Simulated Net Profit: ₹92,400 / Acre</p>
                  <p className="text-slate-300 text-[11px]">Risk Index: Low (12%) • Water Required: 3,200L/day</p>
                </div>
                <button
                  onClick={() => alert(`Applied simulated scenario for ${simCropChoice} to farm plan!`)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl cursor-pointer"
                >
                  Apply Scenario to Farm Plan
                </button>
              </div>
            </div>

            {/* Feature 51: Tiered Pricing & Monetization Model */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                <DollarSign className="h-4 w-4 text-emerald-600" /> 51. Tiered Subscription Plans (AI & IoT Engine)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <p className="text-xs font-black text-slate-700 uppercase">Free Tier</p>
                  <p className="text-2xl font-extrabold text-slate-900">₹0 <span className="text-xs text-slate-500 font-normal">/ mo</span></p>
                  <ul className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-200/60">
                    <li>✓ Basic recommendations</li>
                    <li>✓ Daily weather alerts</li>
                    <li>✓ Manual soil analysis</li>
                  </ul>
                  <button className="w-full py-1.5 mt-2 bg-slate-200 text-slate-800 text-xs font-bold rounded-xl">Current Active</button>
                </div>

                <div className="p-4 bg-blue-50/80 border border-blue-300 rounded-2xl space-y-2">
                  <p className="text-xs font-black text-blue-800 uppercase">Pro Tier</p>
                  <p className="text-2xl font-extrabold text-blue-900">₹99 <span className="text-xs text-blue-700 font-normal">/ mo</span></p>
                  <ul className="text-xs text-slate-700 space-y-1 pt-1 border-t border-blue-200">
                    <li>✓ AI Crop recommendations</li>
                    <li>✓ CNN Disease detection</li>
                    <li>✓ Yield prediction & market advice</li>
                  </ul>
                  <button className="w-full py-1.5 mt-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer">Upgrade to Pro</button>
                </div>

                <div className="p-4 bg-emerald-50 border-2 border-emerald-500 rounded-2xl space-y-2 relative shadow-2xs">
                  <span className="absolute -top-3 right-3 bg-emerald-600 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full">Most Popular</span>
                  <p className="text-xs font-black text-emerald-900 uppercase">Premium Tier</p>
                  <p className="text-2xl font-extrabold text-emerald-900">₹499 <span className="text-xs text-emerald-700 font-normal">/ mo</span></p>
                  <ul className="text-xs text-emerald-950 font-medium space-y-1 pt-1 border-t border-emerald-200">
                    <li>✓ Autonomous Farm Manager</li>
                    <li>✓ Drone fleet integration</li>
                    <li>✓ IoT solenoid automation</li>
                  </ul>
                  <button className="w-full py-1.5 mt-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer">Start 14-Day Free Trial</button>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl space-y-2">
                  <p className="text-xs font-black text-purple-900 uppercase">Enterprise / FPO</p>
                  <p className="text-2xl font-extrabold text-purple-900">₹2,999 <span className="text-xs text-purple-700 font-normal">/ mo</span></p>
                  <ul className="text-xs text-purple-950 font-medium space-y-1 pt-1 border-t border-purple-200">
                    <li>✓ Full platform fleet access</li>
                    <li>✓ Dedicated API integrations</li>
                    <li>✓ Priority 24/7 account manager</li>
                  </ul>
                  <button className="w-full py-1.5 mt-2 bg-purple-700 text-white text-xs font-bold rounded-xl hover:bg-purple-800 transition-colors cursor-pointer">Contact Enterprise Sales</button>
                </div>
              </div>
            </div>

            {/* Feature 52: Pay-Per-Use Pricing */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Receipt className="h-4 w-4 text-indigo-600" /> 52. On-Demand Pay-Per-Use Hardware & Aerial Pricing
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  { name: "Drone Scan", price: "₹500 / acre", icon: Plane },
                  { name: "Drone Spray", price: "₹800 / acre", icon: Droplet },
                  { name: "IoT Installation", price: "₹2,500 / node", icon: Cpu },
                  { name: "IoT Sub-Feed", price: "₹500 / mo", icon: Radio },
                  { name: "Satellite Report", price: "₹10,000 / report", icon: Globe }
                ].map((ppu, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">{ppu.name}</p>
                    <p className="text-sm font-black text-slate-800">{ppu.price}</p>
                    <button className="w-full mt-1 py-1 text-[10px] bg-slate-900 text-white font-bold rounded-lg cursor-pointer hover:bg-slate-800">
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature 53: Annual B2B Contracts */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Briefcase className="h-4 w-4 text-amber-600" /> 53. B2B Annual Institutional Contracts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-amber-900 uppercase">Government Contracts</span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[9px] font-bold">State Scale</span>
                  </div>
                  <p className="text-xl font-extrabold text-amber-900">₹10 Lakhs <span className="text-xs text-amber-700 font-normal">/ year</span></p>
                  <p className="text-xs text-slate-600">Access to district satellite radar, PM-KISAN subsidy allocation analytics, and regional disaster forecasts.</p>
                </div>

                <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-indigo-900 uppercase">Corporate Contracts</span>
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded text-[9px] font-bold">FMCG / Trade</span>
                  </div>
                  <p className="text-xl font-extrabold text-indigo-900">₹5 Lakhs <span className="text-xs text-indigo-700 font-normal">/ year</span></p>
                  <p className="text-xs text-slate-600">Supply chain yield projections, macro market forecasts, contract farming quality audit scores.</p>
                </div>

                <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-rose-900 uppercase">Insurance Companies</span>
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded text-[9px] font-bold">Risk Audit</span>
                  </div>
                  <p className="text-xl font-extrabold text-rose-900">₹2 Lakhs <span className="text-xs text-rose-700 font-normal">/ year</span></p>
                  <p className="text-xs text-slate-600">Automated crop health index feeds, pre-claim disaster verification, loss assessment data.</p>
                </div>
              </div>
            </div>

            {/* Feature 54: White-Label API Access */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Code className="h-4 w-4 text-emerald-400" /> 54. White-Label B2B API Ecosystem
                </span>
                <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  ₹50,000 / month
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Full white-label API access for third-party AgriTech startups, tractor manufacturers, and bank portals. Embed our AI models, live MQTT sensor feeds, and satellite GIS layers directly into external web/mobile apps.
              </p>
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-emerald-400">
                <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">POST /api/v1/agri/ai/recommend</span>
                <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">GET /api/v1/agri/iot/stream</span>
                <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">GET /api/v1/agri/satellite/ndvi</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeSection === "ai_models" && (
        <div className="space-y-6">
          {/* AI Model Switcher Sub-nav */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap gap-2">
            {[
              { id: "crop_recommendation", label: "1.1 Crop Recommendation", icon: Sprout },
              { id: "disease_detection", label: "1.2 Disease Detection", icon: ShieldAlert },
              { id: "yield_prediction", label: "1.3 Yield Prediction", icon: BarChart3 },
              { id: "price_prediction", label: "1.4 Price Prediction", icon: TrendingUp },
              { id: "rag_chat", label: "1.5 RAG Chat Assistant", icon: Bot },
              { id: "soil_analysis", label: "1.6 Soil Analysis", icon: Filter },
              { id: "weather_intelligence", label: "1.7 Weather Intelligence", icon: CloudRain },
              { id: "farm_health_score", label: "1.8 Farm Health Score", icon: Activity }
            ].map((m) => {
              const Icon = m.icon;
              const isActive = selectedAIModel === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedAIModel(m.id as AIModelType)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white shadow-md"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 text-emerald-500" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* 1.1 CROP RECOMMENDATION MODEL */}
          {selectedAIModel === "crop_recommendation" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input Form */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Sprout className="h-4 w-4 text-emerald-600" />
                    Crop Recommendation Inputs
                  </h3>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">Random Forest + XGBoost</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">Soil Type</label>
                    <select
                      value={recSoilType}
                      onChange={(e) => setRecSoilType(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700"
                    >
                      <option value="Loam">Loam Soil (Optimal)</option>
                      <option value="Clay">Clay Soil</option>
                      <option value="Sandy">Sandy Loam</option>
                      <option value="Black Cotton">Black Cotton Soil</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-500 font-medium block mb-1">Soil pH ({recPh})</label>
                      <input
                        type="range"
                        min="4.5"
                        max="8.5"
                        step="0.1"
                        value={recPh}
                        onChange={(e) => setRecPh(parseFloat(e.target.value))}
                        className="w-full accent-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 font-medium block mb-1">Season</label>
                      <select
                        value={recSeason}
                        onChange={(e) => setRecSeason(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700"
                      >
                        <option value="Kharif">Kharif (Monsoon)</option>
                        <option value="Rabi">Rabi (Winter)</option>
                        <option value="Zaid">Zaid (Summer)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-slate-500 font-medium block mb-1">N (kg/ha)</label>
                      <input
                        type="number"
                        value={recNitrogen}
                        onChange={(e) => setRecNitrogen(Number(e.target.value))}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 font-medium block mb-1">P (kg/ha)</label>
                      <input
                        type="number"
                        value={recPhosphorus}
                        onChange={(e) => setRecPhosphorus(Number(e.target.value))}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 font-medium block mb-1">K (kg/ha)</label>
                      <input
                        type="number"
                        value={recPotassium}
                        onChange={(e) => setRecPotassium(Number(e.target.value))}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-500 font-medium block mb-1">Annual Rain (mm)</label>
                      <input
                        type="number"
                        value={recRainfall}
                        onChange={(e) => setRecRainfall(Number(e.target.value))}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 font-medium block mb-1">Budget (₹/Acre)</label>
                      <input
                        type="number"
                        value={recBudget}
                        onChange={(e) => setRecBudget(Number(e.target.value))}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleRunCropRec}
                    disabled={isRunningRec}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-900/20 transition-colors cursor-pointer"
                  >
                    {isRunningRec ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                    Execute Crop Recommendation Model
                  </button>
                </div>
              </div>

              {/* Model Outputs */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    Top Recommended Crops (Confidence & Profitability)
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">Model Confidence: 94.2%</span>
                </div>

                {recResults && recResults.length > 0 ? (
                  <div className="space-y-3">
                    {recResults.map((res: any, idx: number) => (
                      <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 hover:border-emerald-300 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="h-6 w-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                                #{idx + 1}
                              </span>
                              <h4 className="font-extrabold text-slate-800 text-sm">{res.crop}</h4>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium mt-1">
                              Window: <span className="font-bold text-slate-700">{res.window}</span> | Risk: <span className="font-bold text-slate-700">{res.risk}</span>
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-black text-xs rounded-full">
                              {res.confidence}% Match
                            </span>
                            <p className="text-xs font-bold text-emerald-700 mt-1">{res.profit}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 bg-white p-2.5 rounded-xl border border-slate-200 text-[11px]">
                          <div>
                            <span className="text-slate-400 font-bold block text-[9px] uppercase">Yield Forecast</span>
                            <span className="font-extrabold text-slate-700">{res.expectedYield}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold block text-[9px] uppercase">NPK Dosage</span>
                            <span className="font-extrabold text-slate-700">{res.npk}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold block text-[9px] uppercase">Irrigation Need</span>
                            <span className="font-extrabold text-slate-700">{res.irrigation}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs font-medium">
                    Click execute to compute recommendation.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 1.2 DISEASE DETECTION MODEL */}
          {selectedAIModel === "disease_detection" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sample Photo Selector */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Camera className="h-4 w-4 text-emerald-600" />
                    Upload / Select Crop Leaf Sample
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">CNN + YOLOv8 Object Detection Model</p>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-700">Select Sample Leaf Diagnostic Image:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "early_blight", label: "Tomato Early Blight", severity: "Moderate" },
                      { id: "leaf_streak", label: "Paddy Leaf Streak", severity: "Severe" },
                      { id: "healthy", label: "Healthy Wheat Leaf", severity: "None" }
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedDiseaseSample(s.id)}
                        className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                          selectedDiseaseSample === s.id
                            ? "border-emerald-600 bg-emerald-50 text-emerald-900 font-bold"
                            : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        <p className="font-bold">{s.label}</p>
                        <span className="text-[10px] text-slate-500 font-semibold">Severity: {s.severity}</span>
                      </button>
                    ))}
                  </div>

                  <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl text-center space-y-2">
                    <Upload className="h-6 w-6 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-600">Drag and Drop Crop Leaf Image</p>
                    <p className="text-[10px] text-slate-400">Supports JPG, PNG, WEBP (Max 10MB)</p>
                  </div>

                  <button
                    onClick={handleDiagnoseDisease}
                    disabled={isDiagnosing}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    {isDiagnosing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    Run CNN + YOLOv8 Disease Classifier
                  </button>
                </div>
              </div>

              {/* Diagnosis Results */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-emerald-600" />
                    AI Pathology Diagnosis & Treatment Plan
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">500,000+ Training Samples</span>
                </div>

                {diseaseDiagnosis ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Identified Pathology</span>
                        <h4 className="text-lg font-black text-slate-800">{diseaseDiagnosis.diseaseName}</h4>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-black ${
                          diseaseDiagnosis.severity === "Severe" ? "bg-rose-100 text-rose-800" : diseaseDiagnosis.severity === "Moderate" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                        }`}>
                          Severity: {diseaseDiagnosis.severity}
                        </span>
                        <p className="text-xs font-extrabold text-emerald-700 mt-1">{diseaseDiagnosis.confidence}% Confidence</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-2">
                        <h5 className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-blue-600" />
                          Recommended Chemical Treatment
                        </h5>
                        <p className="text-xs text-slate-700 font-medium leading-relaxed">{diseaseDiagnosis.chemicalTreatment}</p>
                      </div>

                      <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-2">
                        <h5 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                          <Sprout className="h-4 w-4 text-emerald-600" />
                          Organic Alternative Treatment
                        </h5>
                        <p className="text-xs text-slate-700 font-medium leading-relaxed">{diseaseDiagnosis.organicTreatment}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                      <p className="font-bold text-slate-800">Cultural Prevention & Spread Forecast:</p>
                      <p className="text-slate-600 font-medium">{diseaseDiagnosis.prevention}</p>
                      <div className="pt-2 flex items-center gap-4 text-[11px]">
                        <span className="text-slate-500 font-bold">Spread Velocity: <span className="text-slate-800">{diseaseDiagnosis.spreadSpeed}</span></span>
                        <span className="text-slate-500 font-bold">Quarantine Alert: <span className="text-slate-800">{diseaseDiagnosis.quarantineNeeded ? "Yes (Isolate Block)" : "No"}</span></span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs font-medium">Select a sample and run diagnosis.</div>
                )}
              </div>
            </div>
          )}

          {/* 1.3 YIELD PREDICTION MODEL */}
          {selectedAIModel === "yield_prediction" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-emerald-600" />
                    Yield Prediction Engine (LSTM + Prophet + ARIMA)
                  </h3>
                  <p className="text-xs text-slate-500">Evaluates fertilizer, irrigation, pest pressure, and historical climate trends.</p>
                </div>
                <span className="text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-700 font-bold">Model Accuracy: 91.5%</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">Target Crop</label>
                    <select value={yieldCrop} onChange={(e) => setYieldCrop(e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700">
                      <option value="Basmati Rice">Basmati Rice</option>
                      <option value="Hybrid Wheat">Hybrid Wheat</option>
                      <option value="Yellow Corn">Yellow Corn / Maize</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">Fertilizer Application ({yieldFertilizer} kg/Acre)</label>
                    <input type="range" min="40" max="250" value={yieldFertilizer} onChange={(e) => setYieldFertilizer(Number(e.target.value))} className="w-full accent-emerald-600" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">Irrigation Water ({yieldIrrigation} mm)</label>
                    <input type="range" min="100" max="800" value={yieldIrrigation} onChange={(e) => setYieldIrrigation(Number(e.target.value))} className="w-full accent-blue-600" />
                  </div>
                </div>

                <div className="md:col-span-2 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Predicted Yield Estimate</span>
                      <p className="text-3xl font-black text-slate-800">
                        {(2.4 + (yieldFertilizer * 0.012) + (yieldIrrigation * 0.003)).toFixed(2)} Tons / Acre
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                        95% CI: [{((2.4 + (yieldFertilizer * 0.012) + (yieldIrrigation * 0.003)) * 0.92).toFixed(2)} - {((2.4 + (yieldFertilizer * 0.012) + (yieldIrrigation * 0.003)) * 1.08).toFixed(2)}]
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-emerald-600" />
                      AI Actionable Yield Booster Recommendation:
                    </p>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      "Increasing nitrogen application by 15% during flowering stage combined with a drip irrigation cycle will boost predicted yield by <span className="font-bold text-emerald-700">+0.42 Tons/Acre (+12.4%)</span>."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 1.4 PRICE PREDICTION MODEL */}
          {selectedAIModel === "price_prediction" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    Commodity Price Forecasting Model (Transformer Attention Ensemble)
                  </h3>
                  <p className="text-xs text-slate-500">APMC Mandi spot rates, NCDEX futures, global trade data, and weather impact drivers.</p>
                </div>
                <span className="text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-700 font-bold">10 Years Training Data</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <label className="text-xs font-bold text-slate-700 block">Select Commodity:</label>
                    <select value={priceCrop} onChange={(e) => setPriceCrop(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-800">
                      <option value="Basmati Rice">Basmati Rice (Grade A)</option>
                      <option value="Wheat">Wheat (PBW 343)</option>
                      <option value="Maize">Non-GMO Maize</option>
                      <option value="Cotton">Long Staple Cotton</option>
                    </select>

                    <div className="pt-2 space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-500">Spot Market Rate:</span>
                        <span className="text-slate-800">₹6,400 / Quintal</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-500">90-Day Forecast Peak:</span>
                        <span className="text-emerald-700">₹7,350 / Quintal (+14.8%)</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-500">Best Selling Window:</span>
                        <span className="text-slate-800">Aug 15 - Sept 05</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2">
                    <span className="px-2.5 py-0.5 text-[10px] font-black uppercase bg-emerald-200 text-emerald-900 rounded-full">
                      AI Recommendation
                    </span>
                    <h5 className="font-extrabold text-slate-800 text-xs">HOLD & STORE IN WAREHOUSE</h5>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      "Net expected price appreciation (+₹950/quintal) exceeds warehouse storage fees (₹120/quintal). Estimated net additional gain: <span className="font-bold text-emerald-700">₹830/quintal</span>."
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-2 h-72 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-700 mb-2">90-Day Price Trajectory Forecast (₹/Quintal)</p>
                  <ResponsiveContainer width="100%" height="90%">
                    <AreaChart data={PRICE_FORECAST_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} domain={['dataMin - 200', 'dataMax + 200']} />
                      <Tooltip />
                      <Area type="monotone" dataKey="basmati" name="Basmati Rice" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2.5} />
                      <Area type="monotone" dataKey="wheat" name="Wheat" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* 1.5 RAG CHAT ASSISTANT */}
          {selectedAIModel === "rag_chat" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Bot className="h-4 w-4 text-emerald-600" />
                    Multilingual RAG Configuration
                  </h3>
                  <p className="text-xs text-slate-500">Gemini API + Pinecone Vector Knowledge Search</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">Target Language (10 Supported)</label>
                    <select value={chatLanguage} onChange={(e) => setChatLanguage(e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700">
                      <option value="Telugu">Telugu (తెలుగు)</option>
                      <option value="Hindi">Hindi (हिंदी)</option>
                      <option value="English">English</option>
                      <option value="Tamil">Tamil (தமிழ்)</option>
                      <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                      <option value="Marathi">Marathi (मराठी)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-500 font-medium block mb-1">User Context Persona</label>
                    <select value={chatUserRole} onChange={(e) => setChatUserRole(e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700">
                      <option value="Farmer">Farmer (Crop & Soil Advisory)</option>
                      <option value="Buyer">Buyer (Market Procurement)</option>
                      <option value="Logistics">Logistics Operator</option>
                      <option value="Government">Government Officer</option>
                    </select>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <p className="font-bold text-slate-800">Indexed Knowledge Vector DB:</p>
                    <div className="space-y-1 text-[11px] text-slate-600 font-medium">
                      <p>• 10,000+ ICAR Agronomy Articles</p>
                      <p>• 500+ Government Subsidy Schemes</p>
                      <p>• 500+ Crop Disease Entries</p>
                      <p>• 1,000+ Crop Variety Specs</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Canvas */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between h-[450px]">
                <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    AI Copilot Interactive Chat ({chatLanguage})
                  </h3>
                  <button onClick={() => setIsSpeaking(!isSpeaking)} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
                    {isSpeaking ? <Volume2 className="h-4 w-4 text-emerald-600" /> : <Mic className="h-4 w-4" />}
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-2">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs space-y-1.5 ${
                        msg.sender === "user"
                          ? "bg-emerald-600 text-white rounded-br-none font-medium shadow-2xs"
                          : "bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200"
                      }`}>
                        <p className="leading-relaxed">{msg.text}</p>
                        {msg.sources && (
                          <div className="pt-1 border-t border-slate-200/50 text-[10px] text-slate-500 font-semibold space-x-2">
                            <span>Sources:</span>
                            {msg.sources.map((src, i) => (
                              <span key={i} className="bg-white/80 px-1.5 py-0.5 rounded border border-slate-200 text-slate-700">{src}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChatMessage} className="pt-3 border-t border-slate-100 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={`Type your agricultural query in ${chatLanguage}...`}
                    className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden"
                  />
                  <button type="submit" className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl cursor-pointer">
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 1.6 SOIL ANALYSIS MODEL */}
          {selectedAIModel === "soil_analysis" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Filter className="h-4 w-4 text-emerald-600" />
                    Soil Health & Nutrient Analysis Engine
                  </h3>
                  <p className="text-xs text-slate-500">Evaluates pH, Organic Carbon, Electrical Conductivity, and NPK Radar.</p>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">Fertility Index: 78/100</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">pH Level ({soilPhInput})</label>
                    <input type="range" min="4.0" max="9.0" step="0.1" value={soilPhInput} onChange={(e) => setSoilPhInput(parseFloat(e.target.value))} className="w-full accent-emerald-600" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">Organic Carbon ({soilOrganicCarbon}%)</label>
                    <input type="range" min="0.1" max="2.0" step="0.05" value={soilOrganicCarbon} onChange={(e) => setSoilOrganicCarbon(parseFloat(e.target.value))} className="w-full accent-amber-600" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">Electrical Conductivity EC ({soilEC} dS/m)</label>
                    <input type="range" min="0.2" max="4.0" step="0.1" value={soilEC} onChange={(e) => setSoilEC(parseFloat(e.target.value))} className="w-full accent-blue-600" />
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-slate-700">
                    <p className="font-bold text-slate-800">pH Balancer Dosage:</p>
                    <p className="text-[11px] font-semibold">{soilPhInput < 6.0 ? "Apply Agricultural Lime @ 250 kg/Acre" : soilPhInput > 7.5 ? "Apply Gypsum / Elemental Sulfur @ 180 kg/Acre" : "Optimal pH Range (No balancer required)"}</p>
                  </div>
                </div>

                <div className="lg:col-span-2 h-72 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-700 mb-2">Nutrient Profile vs. Optimal Target (Radar Chart)</p>
                  <ResponsiveContainer width="100%" height="90%">
                    <RadarChart data={SOIL_RADAR_DATA}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={11} />
                      <PolarRadiusAxis />
                      <Radar name="Current Soil Level" dataKey="current" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                      <Radar name="Optimal Target" dataKey="optimal" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* 1.7 WEATHER INTELLIGENCE MODEL */}
          {selectedAIModel === "weather_intelligence" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <CloudRain className="h-4 w-4 text-blue-600" />
                    7-Day Hyper-Local Weather Intelligence & Hazard Warnings
                  </h3>
                  <p className="text-xs text-slate-500">Ensembled from IMD, OpenWeatherMap, NASA POWER, and Local IoT Weather Nodes.</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">IMD Station Synced</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                {[
                  { day: "Mon", temp: "31°C", rain: "10%", wind: "12 km/h", status: "Sunny" },
                  { day: "Tue", temp: "29°C", rain: "25%", wind: "14 km/h", status: "Partly Cloudy" },
                  { day: "Wed", temp: "27°C", rain: "80%", wind: "24 km/h", status: "Heavy Rain" },
                  { day: "Thu", temp: "26°C", rain: "65%", wind: "20 km/h", status: "Shower" },
                  { day: "Fri", temp: "30°C", rain: "15%", wind: "10 km/h", status: "Clear" },
                  { day: "Sat", temp: "32°C", rain: "0%", wind: "8 km/h", status: "Clear" },
                  { day: "Sun", temp: "33°C", rain: "5%", wind: "9 km/h", status: "Sunny" }
                ].map((w, idx) => (
                  <div key={idx} className={`p-3 rounded-2xl border text-center space-y-1 ${idx === 2 ? "bg-blue-50 border-blue-300" : "bg-slate-50 border-slate-200"}`}>
                    <p className="text-xs font-bold text-slate-700">{w.day}</p>
                    <p className="text-lg font-black text-slate-800">{w.temp}</p>
                    <p className="text-[10px] text-blue-600 font-bold">Rain: {w.rain}</p>
                    <p className="text-[9px] text-slate-400 font-medium">{w.status}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
                  <h5 className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    Harvest Window Recommendation
                  </h5>
                  <p className="text-xs text-amber-800 font-medium">"Harvest Wheat by Tuesday evening. Heavy rain expected on Wednesday (80% probability) may cause lodging."</p>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
                  <h5 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Optimal Spray Window
                  </h5>
                  <p className="text-xs text-emerald-800 font-medium">"Optimal spray window: Tuesday 06:00 - 10:00 AM (Low wind speed & no precipitation)."</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-1">
                  <h5 className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                    <Droplets className="h-4 w-4 text-blue-600" />
                    Irrigation Adjustment
                  </h5>
                  <p className="text-xs text-blue-800 font-medium">"Pause automated drip irrigation for Sector B on Wednesday to prevent waterlogging."</p>
                </div>
              </div>
            </div>
          )}

          {/* 1.8 FARM HEALTH SCORE MODEL */}
          {selectedAIModel === "farm_health_score" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-600" />
                    Real-time Composite Farm Health Score Engine
                  </h3>
                  <p className="text-xs text-slate-500">5 Weighted Factors: Soil (30%), Crop (30%), Water (20%), Pest (10%), Activity (10%).</p>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">Status: Excellent (86/100)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-3 flex flex-col justify-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Composite Health Score</span>
                  <p className="text-5xl font-black text-emerald-600">86 <span className="text-xl text-slate-400">/ 100</span></p>
                  <p className="text-xs font-bold text-slate-700 bg-white py-1 px-3 rounded-full border border-slate-200 inline-block mx-auto">
                    Grade: Excellent (Top 10% in Co-Op)
                  </p>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <p className="text-xs font-bold text-slate-800">Health Breakdown Sub-scores:</p>
                  {[
                    { label: "Soil Nutrient & Moisture Health", weight: "30%", score: 88, color: "bg-emerald-500" },
                    { label: "Crop Canopy Vegetation Index (NDVI)", weight: "30%", score: 92, color: "bg-emerald-500" },
                    { label: "Water & Irrigation Efficiency", weight: "20%", score: 78, color: "bg-blue-500" },
                    { label: "Pest & Pathology Resistance", weight: "10%", score: 82, color: "bg-emerald-500" },
                    { label: "Agronomic Activity Timeliness", weight: "10%", score: 90, color: "bg-purple-500" }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-700">{item.label} ({item.weight})</span>
                        <span className="text-slate-800">{item.score}/100</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.score}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 2: IOT SENSOR NETWORK                 */}
      {/* ========================================== */}
      {activeSection === "iot_network" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Device Management & Add Device */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Radio className="h-4 w-4 text-emerald-600" />
                  IoT Device Registration & Config
                </h3>
                <p className="text-xs text-slate-500">Register new field sensors with custom sampling frequency.</p>
              </div>

              <form onSubmit={handleAddDevice} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-500 font-medium block mb-1">Device Label/Name</label>
                  <input
                    type="text"
                    value={newDevName}
                    onChange={(e) => setNewDevName(e.target.value)}
                    placeholder="e.g. South Paddy Soil Sensor 04"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-slate-500 font-medium block mb-1">Sensor Measurement Type</label>
                  <select
                    value={newDevType}
                    onChange={(e) => setNewDevType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  >
                    <option value="Soil Moisture">Soil Moisture (0-100%)</option>
                    <option value="Temperature">Temperature (°C)</option>
                    <option value="Humidity">Humidity (% RH)</option>
                    <option value="Water Level">Water Level (m)</option>
                    <option value="Wind Speed">Wind Speed (m/s)</option>
                    <option value="Electrical Conductivity">Electrical Conductivity (dS/m)</option>
                  </select>
                </div>

                <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer">
                  <Plus className="h-4 w-4" /> Register Sensor Node
                </button>
              </form>

              {/* Pump Control Automation */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">Automated Drip Pump Relay</h4>
                    <p className="text-[10px] text-slate-400">Triggered when moisture drops below 35%</p>
                  </div>
                  <button
                    onClick={() => setIsPumpActive(!isPumpActive)}
                    className={`px-3 py-1.5 rounded-xl font-extrabold text-xs cursor-pointer transition-colors ${
                      isPumpActive ? "bg-emerald-600 text-white shadow-md" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {isPumpActive ? "PUMP ACTIVE" : "PUMP OFF"}
                  </button>
                </div>
              </div>
            </div>

            {/* Active Sensors Table */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-600" />
                  Active Field IoT Nodes ({devices.length})
                </h3>
                <span className="text-xs text-slate-500 font-medium">Sampling Stream: Live MQTT</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[9px] border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Device ID & Name</th>
                      <th className="p-2.5">Type</th>
                      <th className="p-2.5">Value</th>
                      <th className="p-2.5">Battery</th>
                      <th className="p-2.5">Signal</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {devices.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-800">
                          {d.name} <span className="text-[10px] text-slate-400 font-mono block">{d.id}</span>
                        </td>
                        <td className="p-2.5">{d.type}</td>
                        <td className="p-2.5 font-black text-emerald-700">{d.currentValue} {d.unit}</td>
                        <td className="p-2.5">{d.battery}%</td>
                        <td className="p-2.5 font-mono text-[10px]">{d.signal} dBm</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                            {d.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* IoT Historic Telemetry Chart */}
              <div className="h-56 pt-2">
                <p className="text-xs font-bold text-slate-700 mb-1">24-Hour Telemetry Stream (Moisture vs. Temp)</p>
                <ResponsiveContainer width="100%" height="90%">
                  <LineChart data={HISTORIC_IOT_TELEMETRY}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip />
                    <Line type="monotone" dataKey="moisture" name="Soil Moisture (%)" stroke="#10b981" strokeWidth={2.5} />
                    <Line type="monotone" dataKey="temp" name="Temperature (°C)" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 3: DRONE FLEET & IMAGERY               */}
      {/* ========================================== */}
      {activeSection === "drone_system" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Plane className="h-4 w-4 text-emerald-600" />
                  Autonomous Drone Mission Dispatcher & Aerial Imagery Analyzer
                </h3>
                <p className="text-xs text-slate-500">Multi-spectral (NDVI), Thermal, RGB mapping, and LiDAR 3D elevation profiling.</p>
              </div>
              <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-bold">4 Drones Active</span>
            </div>

            {/* Drone Imagery Layer Toggle */}
            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-600 pl-2">Select Multispectral Layer:</span>
              {[
                { id: "NDVI", label: "NDVI Crop Health Heatmap" },
                { id: "RGB", label: "High-Res RGB Mapping" },
                { id: "Thermal", label: "Thermal Water Stress Map" },
                { id: "PestHotspot", label: "Pest Hotspot Overlay" },
                { id: "3DHeight", label: "LiDAR 3D Canopy Height" }
              ].map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => setActiveDroneLayer(layer.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDroneLayer === layer.id
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {layer.label}
                </button>
              ))}
            </div>

            {/* Drone Simulation Canvas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-950 p-6 rounded-2xl border border-slate-800 text-white relative min-h-[320px] flex flex-col justify-between overflow-hidden">
                <div className="flex justify-between items-center z-10">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="font-mono text-xs font-bold text-emerald-400">MISSION MSN-8802 IN PROGRESS</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">Altitude: 15m | Speed: 4.0 m/s</span>
                </div>

                {/* Simulated Heatmap View */}
                <div className="my-auto text-center space-y-2 py-8 z-10">
                  <p className="text-xs font-mono text-slate-300">Active Viewing Layer: <span className="font-bold text-emerald-400 uppercase">{activeDroneLayer}</span></p>
                  <p className="text-2xl font-extrabold text-white">Grid Sector A1-B4 Analyzed (Avg NDVI: 0.78)</p>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Spot B pest hotspot detected with 94.2% confidence. Automated precision spray payload deployed.
                  </p>
                </div>

                <div className="flex justify-between items-center z-10 text-xs font-mono text-slate-400 pt-4 border-t border-slate-800">
                  <span>Battery: 78%</span>
                  <span>Payload: 4.2 L / 10 L</span>
                  <span>ETA: 4 mins remaining</span>
                </div>
              </div>

              {/* Drone Mission List */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-800">Drone Flight Log & Missions:</p>
                {droneMissions.map((m) => (
                  <div key={m.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <h5 className="font-bold text-slate-800 text-xs">{m.name}</h5>
                      <span className="px-2 py-0.5 text-[9px] font-bold bg-purple-100 text-purple-800 rounded-full">{m.status}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">Area: {m.areaAcres} Acres | Scheduled: {m.scheduledTime}</p>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                      <div className="bg-purple-600 h-full rounded-full" style={{ width: `${m.progress}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 4: SATELLITE REMOTE SENSING            */}
      {/* ========================================== */}
      {activeSection === "satellite_gis" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Globe className="h-4 w-4 text-emerald-600" />
                  Satellite Remote Sensing & GIS Crop Monitoring
                </h3>
                <p className="text-xs text-slate-500">Sentinel-2 (10m ESA) & Landsat 9 (30m NASA) orbital passes.</p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">Sentinel-2 Orbit Synced</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { name: "Sentinel-2 (ESA)", res: "10m Resolution", frequency: "Every 5 Days", status: "Optimal" },
                { name: "Landsat 8/9 (NASA)", res: "30m Resolution", frequency: "Every 16 Days", status: "Optimal" },
                { name: "MODIS (NASA)", res: "250m Global", frequency: "Daily", status: "Active" },
                { name: "PlanetScope", res: "3m Commercial", frequency: "Daily", status: "Synced" }
              ].map((sat, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <h5 className="font-bold text-slate-800 text-xs">{sat.name}</h5>
                  <p className="text-[11px] text-slate-500 font-medium">{sat.res} • {sat.frequency}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">{sat.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 5: APACHE KAFKA STREAMING PIPELINE     */}
      {/* ========================================== */}
      {activeSection === "kafka_pipeline" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  Apache Kafka Real-time Event Streaming Inspector
                </h3>
                <p className="text-xs text-slate-500">Distributed partition event log streaming sensor data, drone missions, and AI predictions.</p>
              </div>
              <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-bold">Broker Cluster Online</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 space-y-3">
              <div className="flex justify-between items-center text-[10px] text-slate-500 border-b border-slate-800 pb-2">
                <span>EVENT ID & TIMESTAMP</span>
                <span>KAFKA TOPIC</span>
                <span>PARTITION</span>
                <span>PAYLOAD JSON</span>
                <span>STATUS</span>
              </div>

              {kafkaEvents.map((e) => (
                <div key={e.id} className="flex justify-between items-center text-[11px] hover:bg-slate-900 p-1.5 rounded">
                  <span className="text-slate-400 font-bold">{e.id} [{e.timestamp}]</span>
                  <span className="text-emerald-400 font-bold">{e.topic}</span>
                  <span className="text-slate-500">P-{e.partition}</span>
                  <span className="text-slate-200 truncate max-w-xs">{e.payload}</span>
                  <span className="text-emerald-400 font-bold">{e.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 6: POLYGLOT STORAGE & RETENTION         */}
      {/* ========================================== */}
      {activeSection === "storage_retention" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Database className="h-4 w-4 text-blue-600" />
                  Polyglot Database Storage & Automated Data Retention Engine
                </h3>
                <p className="text-xs text-slate-500">Manages TimescaleDB, PostgreSQL, Redis, MongoDB, and Pinecone Vector Stores.</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">Database Cluster Healthy</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { db: "TimescaleDB", purpose: "Time-series IoT sensor logs", retention: "2 Years Raw / 5 Years Aggregated", size: "142 GB" },
                { db: "PostgreSQL", purpose: "Relational users, crops, orders", retention: "7 Years (Tax Compliance)", size: "48 GB" },
                { db: "Pinecone / Weaviate", purpose: "AI Vector Embeddings for RAG", retention: "Indefinite Indexing", size: "12 GB" },
                { db: "Redis Cluster", purpose: "Real-time session cache", retention: "Transient / Session", size: "4.2 GB" },
                { db: "MongoDB", purpose: "Unstructured drone imagery & logs", retention: "1 Year Active", size: "380 GB" },
                { db: "Elasticsearch", purpose: "Full-text agronomy search index", retention: "Indefinite Indexing", size: "22 GB" }
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <h5 className="font-bold text-slate-800 text-xs">{item.db}</h5>
                  <p className="text-[11px] text-slate-600 font-medium">{item.purpose}</p>
                  <div className="pt-1 text-[10px] text-slate-500 flex justify-between font-bold">
                    <span>Retention: {item.retention}</span>
                    <span className="text-blue-700">{item.size}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 7: EXTERNAL API PLAYGROUND             */}
      {/* ========================================== */}
      {activeSection === "external_apis" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-emerald-600" />
                  REST API Playground & Integrations Tester
                </h3>
                <p className="text-xs text-slate-500">Interactive testing studio for AgriConnect AI REST endpoints.</p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">API Key Authorized</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-2 text-xs">
                <p className="font-bold text-slate-800">Available Endpoints:</p>
                {[
                  { id: "recommend", method: "POST", path: "/api/ai/recommend-crop" },
                  { id: "disease", method: "POST", path: "/api/ai/detect-disease" },
                  { id: "yield", method: "POST", path: "/api/ai/predict-yield" },
                  { id: "price", method: "POST", path: "/api/ai/predict-price" },
                  { id: "iot_devices", method: "GET", path: "/api/iot/devices/FARM-01" },
                  { id: "drone_mission", method: "POST", path: "/api/drone/mission" }
                ].map((ep) => (
                  <button
                    key={ep.id}
                    onClick={() => setActiveApiTab(ep.id)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between font-mono text-[11px] transition-all cursor-pointer ${
                      activeApiTab === ep.id ? "bg-slate-900 text-white border-slate-900 font-bold" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{ep.path}</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white font-sans text-[9px] font-bold">{ep.method}</span>
                  </button>
                ))}
              </div>

              <div className="lg:col-span-2 bg-slate-950 p-6 rounded-2xl border border-slate-800 text-slate-200 font-mono text-xs space-y-4">
                <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-2">
                  <span>Endpoint Code Execution Response</span>
                  <span className="text-emerald-400">200 OK (14ms)</span>
                </div>

                <pre className="text-[11px] text-emerald-300 overflow-x-auto p-3 bg-slate-900/80 rounded-xl leading-relaxed">
{`{
  "status": "success",
  "model": "RandomForest_XGBoost_v4.8",
  "timestamp": "2026-07-24T10:14:02.122Z",
  "recommendations": [
    {
      "crop": "Basmati Rice (PBW-1121)",
      "confidence": 0.962,
      "expectedYieldTonsPerAcre": 4.8,
      "estimatedProfitINR": 78400,
      "irrigationLitersPerDay": 4500
    }
  ]
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 8: ECOSYSTEM INTEGRATION MATRIX       */}
      {/* ========================================== */}
      {activeSection === "ecosystem_integration" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Layers className="h-4 w-4 text-emerald-600" />
                  Ecosystem Role Intelligence Matrix
                </h3>
                <p className="text-xs text-slate-500">How real-time AI & IoT data flows into every role on the platform.</p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">8 Portals Powered</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { role: "Farmer Portal", icon: Sprout, desc: "Real-time crop disease diagnosis, soil moisture gauges, harvest weather warnings." },
                { role: "Buyer Portal", icon: Search, desc: "Commodity price predictions, harvest yield forecasts, quality grade verification." },
                { role: "Supplier Portal", icon: Filter, desc: "Demand forecasting for seeds & fertilizers based on regional crop recommendations." },
                { role: "Government Officer", icon: ShieldAlert, desc: "Drought & flood detection overlays, subsidy eligibility verification via satellite." },
                { role: "Agriculture Expert", icon: Award, desc: "Pathology diagnostic verification, AI second opinion, drone pest heatmap review." },
                { role: "Logistics Operator", icon: Radio, desc: "Cold storage temperature telemetry, route weather hazard updates, ETA optimizer." },
                { role: "Warehouse Operator", icon: Server, desc: "Silo humidity aeration automation, grain degradation prediction." },
                { role: "Admin Portal", icon: Activity, desc: "Kafka cluster stream monitoring, AI model accuracy tracking, device health logs." }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 hover:border-emerald-300 transition-colors">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span>{item.role}</span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
