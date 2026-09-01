import React, { useState, useEffect, useRef } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useAdvancedMarkerRef
} from "@vis.gl/react-google-maps";
import {
  Map as MapIcon,
  Layers,
  CloudRain,
  Sun,
  Flame,
  Droplets,
  TrendingUp,
  UserCheck,
  ClipboardCheck,
  Building,
  Leaf,
  ShieldAlert,
  AlertCircle,
  Activity,
  Locate,
  Settings,
  HelpCircle,
  X,
  ChevronRight,
  Info,
  Sparkles,
  MapPin,
  Radar
} from "lucide-react";

// --- API KEY CONFIG (From Google Maps Platform Skill) ---
const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  "";
const hasValidKey = Boolean(API_KEY) && API_KEY !== "YOUR_API_KEY" && API_KEY.length > 10;

// --- DEMO VILLAGES DATA (Amritsar District, Punjab) ---
interface Village {
  id: string;
  name: string;
  block: string;
  lat: number;
  lng: number;
  svgX: number; // For Simulated SVG map fallback
  svgY: number; // For Simulated SVG map fallback
  cropHealth: "Green" | "Yellow" | "Red";
  cropHealthText: string;
  farmerCount: number;
  crops: string[];
  avgYield: string;
  soilHealthIndex: number;
  subsidyPenetration: "Very High" | "High" | "Moderate" | "Low" | "Critical Need";
  subsidyAmount: string;
  pendingApps: number;
  weather: {
    temp: string;
    condition: string;
    alert?: string;
    alertType?: "flood" | "drought" | "none";
  };
}

const VILLAGES_DATA: Village[] = [
  {
    id: "v1",
    name: "Rajasansi",
    block: "Harsha Chhina",
    lat: 31.7086,
    lng: 74.7981,
    svgX: 180,
    svgY: 160,
    cropHealth: "Green",
    cropHealthText: "Healthy & Robust growth",
    farmerCount: 240,
    crops: ["Basmati Rice", "Wheat"],
    avgYield: "4.8 tons/ha",
    soilHealthIndex: 8.4,
    subsidyPenetration: "High",
    subsidyAmount: "₹12.5 Lakhs",
    pendingApps: 3,
    weather: { temp: "31°C", condition: "Light Showers", alert: "Normal" }
  },
  {
    id: "v2",
    name: "Ajnala",
    block: "Ajnala",
    lat: 31.8415,
    lng: 74.7618,
    svgX: 150,
    svgY: 80,
    cropHealth: "Yellow",
    cropHealthText: "Moderate - Minor moisture deficit",
    farmerCount: 310,
    crops: ["Sugarcane", "Basmati Rice", "Maize"],
    avgYield: "4.1 tons/ha",
    soilHealthIndex: 6.9,
    subsidyPenetration: "Moderate",
    subsidyAmount: "₹8.2 Lakhs",
    pendingApps: 8,
    weather: {
      temp: "34°C",
      condition: "Dry & Warm",
      alert: "Drought Warning (Low Soil Moisture)",
      alertType: "drought"
    }
  },
  {
    id: "v3",
    name: "Chogawan",
    block: "Chogawan",
    lat: 31.7161,
    lng: 74.6322,
    svgX: 80,
    svgY: 180,
    cropHealth: "Red",
    cropHealthText: "Critical - Severe waterlogging",
    farmerCount: 185,
    crops: ["Cotton", "Rice (IR64)", "Wheat"],
    avgYield: "2.2 tons/ha",
    soilHealthIndex: 5.1,
    subsidyPenetration: "Low",
    subsidyAmount: "₹4.1 Lakhs",
    pendingApps: 12,
    weather: {
      temp: "29°C",
      condition: "Heavy Rain",
      alert: "Flood Warning (Waterlogged Fields)",
      alertType: "flood"
    }
  },
  {
    id: "v4",
    name: "Majitha",
    block: "Majitha",
    lat: 31.7611,
    lng: 74.9542,
    svgX: 280,
    svgY: 130,
    cropHealth: "Green",
    cropHealthText: "Excellent soil-moisture profile",
    farmerCount: 290,
    crops: ["Basmati Rice", "Wheat", "Mustard"],
    avgYield: "5.1 tons/ha",
    soilHealthIndex: 8.8,
    subsidyPenetration: "Very High",
    subsidyAmount: "₹15.8 Lakhs",
    pendingApps: 1,
    weather: { temp: "32°C", condition: "Sunny", alert: "Normal" }
  },
  {
    id: "v5",
    name: "Jandiala Guru",
    block: "Jandiala",
    lat: 31.5645,
    lng: 74.9815,
    svgX: 300,
    svgY: 260,
    cropHealth: "Yellow",
    cropHealthText: "Moderate - Localized pest threat",
    farmerCount: 220,
    crops: ["Wheat", "Potato", "Rice"],
    avgYield: "3.9 tons/ha",
    soilHealthIndex: 7.2,
    subsidyPenetration: "Moderate",
    subsidyAmount: "₹7.5 Lakhs",
    pendingApps: 5,
    weather: { temp: "33°C", condition: "Humid", alert: "Pest Warning (Whitefly)" }
  },
  {
    id: "v6",
    name: "Baba Bakala",
    block: "Rayya",
    lat: 31.5583,
    lng: 75.2635,
    svgX: 420,
    svgY: 270,
    cropHealth: "Green",
    cropHealthText: "Healthy vegetative stage",
    farmerCount: 340,
    crops: ["Sugarcane", "Wheat", "Maize"],
    avgYield: "5.3 tons/ha",
    soilHealthIndex: 8.5,
    subsidyPenetration: "High",
    subsidyAmount: "₹11.2 Lakhs",
    pendingApps: 4,
    weather: { temp: "32°C", condition: "Clear Sky", alert: "Normal" }
  },
  {
    id: "v7",
    name: "Attari",
    block: "Gandiwind",
    lat: 31.5975,
    lng: 74.6125,
    svgX: 70,
    svgY: 240,
    cropHealth: "Red",
    cropHealthText: "Critical - Extreme heat & pest damage",
    farmerCount: 150,
    crops: ["Wheat", "Rice"],
    avgYield: "1.8 tons/ha",
    soilHealthIndex: 4.6,
    subsidyPenetration: "Critical Need",
    subsidyAmount: "₹2.4 Lakhs",
    pendingApps: 15,
    weather: {
      temp: "41°C",
      condition: "Severe Heatwave",
      alert: "Extreme Drought & Heatwave Stress",
      alertType: "drought"
    }
  }
];

interface GovernmentMapViewProps {
  onVerifyFarmerClick?: () => void;
  onVerifySubsidyClick?: () => void;
}

export default function GovernmentMapView({
  onVerifyFarmerClick,
  onVerifySubsidyClick
}: GovernmentMapViewProps) {
  const [useSimulatedMap, setUseSimulatedMap] = useState(!hasValidKey);
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(VILLAGES_DATA[0]);
  const [activeLayer, setActiveLayer] = useState<"crop" | "subsidy" | "weather">("crop");
  
  // Drone Scanning State
  const [isDroneScanning, setIsDroneScanning] = useState(false);
  const [droneProgress, setDroneProgress] = useState(0);
  const [droneScanLog, setDroneScanLog] = useState<string[]>([]);
  const droneTimerRef = useRef<any>(null);

  // Auto-clear drone timer on unmount
  useEffect(() => {
    return () => {
      if (droneTimerRef.current) clearInterval(droneTimerRef.current);
    };
  }, []);

  const startDroneScan = (villageName: string) => {
    if (isDroneScanning) return;
    setIsDroneScanning(true);
    setDroneProgress(0);
    setDroneScanLog([
      `🚀 Initializing autonomous Sentinel-V4 Survey drone...`,
      `📡 Calibrating LiDAR and multispectral cameras for ${villageName}...`,
      `🗺️ Launching from district command pad...`
    ]);

    let currentProgress = 0;
    droneTimerRef.current = setInterval(() => {
      currentProgress += 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(droneTimerRef.current);
        setIsDroneScanning(false);
        setDroneScanLog(prev => [
          ...prev,
          `✅ Scan 100% Complete: Uploading radiometric imagery to servers...`,
          `📊 Generated Orthomosaic Soil & Crop health map.`,
          `🌾 AI Audit matched with farmer registry claims perfectly!`
        ]);
      } else {
        setDroneProgress(currentProgress);
        // Add random cool drone logging messages at milestones
        if (currentProgress === 25) {
          setDroneScanLog(prev => [
            ...prev,
            `🛰️ Establishing RTK connection. Position accuracy: ±1.2cm.`,
            `📸 Surveying northern farmlands (Wheat/Rice fields)...`
          ]);
        } else if (currentProgress === 50) {
          setDroneScanLog(prev => [
            ...prev,
            `🔬 Capturing NDVI (Normalized Difference Vegetation Index) data...`,
            `🌡️ Detecting surface soil temperature: 32.4°C.`
          ]);
        } else if (currentProgress === 75) {
          setDroneScanLog(prev => [
            ...prev,
            `⚠️ Anomalous soil moisture detected in western blocks.`,
            `🤖 Running real-time pest identification matching models...`
          ]);
        }
      }
    }, 250);
  };

  const getHealthColor = (status: "Green" | "Yellow" | "Red") => {
    switch (status) {
      case "Green":
        return "#10b981"; // Emerald 500
      case "Yellow":
        return "#f59e0b"; // Amber 500
      case "Red":
        return "#ef4444"; // Red 500
    }
  };

  const handleVillageClick = (village: Village) => {
    setSelectedVillage(village);
    if (isDroneScanning) {
      // Cancel previous drone scanning
      if (droneTimerRef.current) clearInterval(droneTimerRef.current);
      setIsDroneScanning(false);
      setDroneProgress(0);
      setDroneScanLog([]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Upper Status Controls & Info Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="space-y-1">
          <h2 className="text-sm font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
            <MapIcon className="h-4.5 w-4.5 text-emerald-700" />
            Amritsar District Command Map
          </h2>
          <p className="text-[11px] text-slate-500">
            Real-time multispectral satellite telemetry, welfare distribution, and disaster coordination.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Layer Selector */}
          <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setActiveLayer("crop")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ${
                activeLayer === "crop"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Leaf className="h-3.5 w-3.5" />
              Crop Health
            </button>
            <button
              onClick={() => setActiveLayer("subsidy")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ${
                activeLayer === "subsidy"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              Subsidy Heatmap
            </button>
            <button
              onClick={() => setActiveLayer("weather")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ${
                activeLayer === "weather"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <CloudRain className="h-3.5 w-3.5" />
              Weather Overlay
            </button>
          </div>

          {/* Map Mode Switcher (only show if valid key is available) */}
          {hasValidKey && (
            <button
              onClick={() => setUseSimulatedMap(!useSimulatedMap)}
              className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border border-slate-250 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-1"
            >
              <Settings className="h-3.5 w-3.5" />
              {useSimulatedMap ? "Switch to Google Map" : "Switch to Simulated Map"}
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Interactive Map + Side Village Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Map Container */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl overflow-hidden border border-slate-850 shadow-md relative min-h-[500px] flex flex-col">
          
          {/* Simulated Notice if showing backup simulated map */}
          {useSimulatedMap && (
            <div className="absolute top-3 left-3 right-3 z-20 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-emerald-950/40 text-slate-300 text-[10px] flex items-center justify-between shadow-lg">
              <span className="flex items-center gap-1.5 font-bold">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                Showing Interactive District Vector Map.
              </span>
              <button
                onClick={() => {
                  alert(
                    "To enable Google Satellite and Maps views, register a Google Maps API Key and save it as a secret named 'GOOGLE_MAPS_PLATFORM_KEY' in Settings (⚙️ icon)."
                  );
                }}
                className="text-[9px] font-black uppercase tracking-wider bg-emerald-700 hover:bg-emerald-600 text-white px-2 py-1 rounded-md transition"
              >
                API Key Guide
              </button>
            </div>
          )}

          {/* Interactive Area */}
          <div className="flex-1 relative">
            {useSimulatedMap ? (
              /* --- HIGH FIDELITY SIMULATED SVG MAP --- */
              <div className="w-full h-full min-h-[480px] bg-slate-950 flex items-center justify-center relative p-4 select-none overflow-hidden">
                {/* Background Grid Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:30px_30px] opacity-40 pointer-events-none" />
                
                {/* Weather Overlay Shading */}
                {activeLayer === "weather" && (
                  <div className="absolute inset-0 pointer-events-none z-10 transition-all duration-500">
                    {/* Chogawan/Attari (West) Flood Overlay */}
                    <div className="absolute top-[120px] left-[30px] w-52 h-48 rounded-full bg-blue-500/15 filter blur-3xl" />
                    <div className="absolute top-[180px] left-[40px] text-blue-400/70 text-[9px] font-bold border border-blue-500/20 bg-blue-950/60 px-2 py-0.5 rounded-full backdrop-blur-xs">
                      🌊 Flood Hazard Zone
                    </div>
                    {/* Ajnala (North) / Attari (West-south) Drought Overlay */}
                    <div className="absolute top-[20px] left-[100px] w-48 h-40 rounded-full bg-amber-500/10 filter blur-3xl" />
                    <div className="absolute top-[50px] left-[140px] text-amber-500/70 text-[9px] font-bold border border-amber-500/20 bg-amber-950/60 px-2 py-0.5 rounded-full backdrop-blur-xs">
                      🔥 Drought Warning Zone
                    </div>
                  </div>
                )}

                {/* Subsidy Heatmap Overlay */}
                {activeLayer === "subsidy" && (
                  <div className="absolute inset-0 pointer-events-none z-10 transition-all duration-500">
                    {/* Majitha & Rajasansi high disbursements */}
                    <div className="absolute top-[110px] left-[160px] w-36 h-36 rounded-full bg-emerald-500/20 filter blur-2xl" />
                    <div className="absolute top-[100px] left-[240px] w-40 h-40 rounded-full bg-emerald-500/35 filter blur-2xl animate-pulse" />
                    {/* Baba Bakala */}
                    <div className="absolute top-[220px] left-[380px] w-44 h-44 rounded-full bg-emerald-500/25 filter blur-2xl" />
                  </div>
                )}

                {/* District SVG Layout */}
                <svg
                  viewBox="0 0 500 380"
                  className="w-full max-w-[500px] aspect-[500/380] relative z-10 filter drop-shadow-2xl"
                >
                  {/* Outer District Boundaries (Amritsar Mock Path) */}
                  <path
                    d="M 120 40 Q 220 20 320 60 T 460 160 Q 480 260 410 320 T 260 360 Q 150 350 80 280 T 50 140 Z"
                    fill="#022c22"
                    fillOpacity={activeLayer === "subsidy" ? "0.05" : "0.15"}
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeDasharray={activeLayer === "weather" ? "4 4" : "0"}
                    className="transition-all duration-500"
                  />

                  {/* Main Roads network / rivers inside the district */}
                  <path
                    d="M 180 160 L 150 80 M 180 160 L 80 180 M 180 160 L 280 130 M 180 160 L 300 260 M 300 260 L 420 270 M 80 180 L 70 240 M 300 260 L 70 240"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="1.5"
                    strokeOpacity="0.4"
                  />

                  {/* Village Nodes */}
                  {VILLAGES_DATA.map((village) => {
                    const isSelected = selectedVillage?.id === village.id;
                    const healthColor = getHealthColor(village.cropHealth);
                    
                    return (
                      <g
                        key={village.id}
                        className="cursor-pointer group"
                        onClick={() => handleVillageClick(village)}
                      >
                        {/* Interactive click boundary */}
                        <circle cx={village.svgX} cy={village.svgY} r="25" fill="transparent" />
                        
                        {/* Glowing Selected Ring */}
                        {isSelected && (
                          <circle
                            cx={village.svgX}
                            cy={village.svgY}
                            r="14"
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="2"
                            className="animate-ping opacity-60"
                          />
                        )}

                        {/* Outer color-coded dot */}
                        <circle
                          cx={village.svgX}
                          cy={village.svgY}
                          r={isSelected ? "11" : "8"}
                          fill={activeLayer === "subsidy" ? "#10b981" : healthColor}
                          fillOpacity={
                            activeLayer === "subsidy"
                              ? village.subsidyPenetration === "Very High"
                                ? "0.9"
                                : village.subsidyPenetration === "High"
                                ? "0.7"
                                : "0.4"
                              : "1"
                          }
                          stroke={isSelected ? "#ffffff" : "#0f172a"}
                          strokeWidth="2"
                          className="transition-all group-hover:scale-125 origin-center"
                        />

                        {/* Mini alert badge overlay */}
                        {activeLayer === "weather" && village.weather.alertType && (
                          <circle
                            cx={village.svgX + 6}
                            cy={village.svgY - 6}
                            r="4"
                            fill={village.weather.alertType === "flood" ? "#3b82f6" : "#f59e0b"}
                            stroke="#ffffff"
                            strokeWidth="1"
                          />
                        )}

                        {/* Village Name Text Label */}
                        <text
                          x={village.svgX}
                          y={village.svgY + (isSelected ? 24 : 20)}
                          textAnchor="middle"
                          fill={isSelected ? "#ffffff" : "#cbd5e1"}
                          fontSize={isSelected ? "10" : "8.5"}
                          fontWeight={isSelected ? "900" : "700"}
                          className="font-sans tracking-wide drop-shadow-md select-none"
                        >
                          {village.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Map Quick Legend */}
                <div className="absolute bottom-3 left-3 bg-slate-900/95 border border-slate-800 p-3 rounded-xl space-y-1.5 z-10">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    {activeLayer === "crop"
                      ? "Crop Health Legend"
                      : activeLayer === "subsidy"
                      ? "Subsidy Penetration"
                      : "Weather Hazard Overlay"}
                  </p>
                  
                  {activeLayer === "crop" && (
                    <div className="space-y-1 text-[9px] font-medium text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block" />
                        <span>Green - Healthy Fields</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block" />
                        <span>Yellow - Moderate Moisture Deficit</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 block" />
                        <span>Red - Crop Loss / Heatwave Alert</span>
                      </div>
                    </div>
                  )}

                  {activeLayer === "subsidy" && (
                    <div className="space-y-1 text-[9px] font-medium text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90 block" />
                        <span>Very High Penetration (&gt;₹15L)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70 block" />
                        <span>High Penetration (₹10L - ₹15L)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40 block" />
                        <span>Moderate/Low Penetration (&lt;₹10L)</span>
                      </div>
                    </div>
                  )}

                  {activeLayer === "weather" && (
                    <div className="space-y-1 text-[9px] font-medium text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 block" />
                        <span>Waterlogged / Flood Alert Zone</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block" />
                        <span>Extreme Aridity / Heatwave Area</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Satellite Coordinate Box */}
                <div className="absolute top-14 right-3 font-mono text-[8px] text-emerald-400 bg-slate-950/80 px-2.5 py-1 rounded-md border border-emerald-900/30">
                  SAT_ALT: 320km | LAT: 31.6340 | LNG: 74.8723
                </div>
              </div>
            ) : (
              /* --- GOOGLE MAPS REAL IMPLEMENTATION --- */
              <div className="w-full h-full min-h-[480px]">
                <APIProvider apiKey={API_KEY} version="weekly">
                  <Map
                    defaultCenter={{ lat: 31.7, lng: 74.85 }}
                    defaultZoom={10.5}
                    mapId="DEMO_MAP_ID"
                    internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
                    style={{ width: "100%", height: "100%" }}
                  >
                    {VILLAGES_DATA.map((village) => {
                      const isSelected = selectedVillage?.id === village.id;
                      const markerColor = getHealthColor(village.cropHealth);
                      
                      return (
                        <AdvancedMarker
                          key={village.id}
                          position={{ lat: village.lat, lng: village.lng }}
                          title={village.name}
                          onClick={() => handleVillageClick(village)}
                        >
                          <Pin
                            background={activeLayer === "subsidy" ? "#10b981" : markerColor}
                            borderColor={isSelected ? "#ffffff" : "#000000"}
                            glyphColor="#ffffff"
                            scale={isSelected ? 1.3 : 1.0}
                          />
                        </AdvancedMarker>
                      );
                    })}

                    {selectedVillage && (
                      <InfoWindow
                        position={{ lat: selectedVillage.lat, lng: selectedVillage.lng }}
                        onCloseClick={() => setSelectedVillage(null)}
                      >
                        <div className="p-1 font-sans text-xs space-y-1.5 text-slate-800 max-w-[180px]">
                          <div className="border-b pb-1">
                            <strong className="text-slate-900 block text-sm">{selectedVillage.name}</strong>
                            <span className="text-[10px] text-slate-500">Block: {selectedVillage.block}</span>
                          </div>
                          <div>
                            <p className="text-[10.5px]">🌾 <strong>Crop:</strong> {selectedVillage.crops.join(", ")}</p>
                            <p className="text-[10.5px]">📈 <strong>Health:</strong> <span className={selectedVillage.cropHealth === "Green" ? "text-emerald-600 font-bold" : selectedVillage.cropHealth === "Yellow" ? "text-amber-600 font-bold" : "text-red-600 font-bold"}>{selectedVillage.cropHealthText}</span></p>
                            <p className="text-[10.5px]">💰 <strong>Subsidies:</strong> {selectedVillage.subsidyAmount}</p>
                          </div>
                        </div>
                      </InfoWindow>
                    )}
                  </Map>
                </APIProvider>
              </div>
            )}
          </div>
        </div>

        {/* Side Village Details Panel */}
        <div className="space-y-6">
          {selectedVillage ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full justify-between">
              
              {/* Village Header */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white space-y-2 relative">
                <div className="absolute top-4 right-4 text-emerald-400 font-mono text-[9px] border border-emerald-500/20 px-1.5 py-0.5 rounded bg-emerald-500/10">
                  SECURE AUDIT
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight">{selectedVillage.name} Village</h3>
                  <p className="text-[11px] text-slate-300">
                    Jurisdiction: {selectedVillage.block} Block, Amritsar
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-1">
                  <MapPin className="h-3 w-3 text-emerald-400" />
                  <span>Lat: {selectedVillage.lat.toFixed(4)}, Lng: {selectedVillage.lng.toFixed(4)}</span>
                </div>
              </div>

              {/* Village Vital stats & Metrics */}
              <div className="p-5 space-y-4 flex-1">
                
                {/* 1. Crop Health & Crop types */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 space-y-2">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Multispectral Soil & Crops</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">Primary Crops:</span>
                    <span className="text-xs font-bold text-slate-800">{selectedVillage.crops.join(", ")}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">NDVI Health:</span>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                      selectedVillage.cropHealth === "Green"
                        ? "bg-emerald-50 text-emerald-700"
                        : selectedVillage.cropHealth === "Yellow"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-red-50 text-red-700"
                    }`}>
                      {selectedVillage.cropHealthText}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">Soil Health Index:</span>
                    <span className="text-xs font-black text-slate-800">{selectedVillage.soilHealthIndex} / 10</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">Est. Average Yield:</span>
                    <span className="text-xs font-black text-slate-800">{selectedVillage.avgYield}</span>
                  </div>
                </div>

                {/* 2. Subsidy Penetration */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 space-y-2">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Welfare & Disbursement</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">Disbursed Subsidies:</span>
                    <span className="text-xs font-black text-emerald-700">{selectedVillage.subsidyAmount}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">Penetration Rate:</span>
                    <span className="text-xs font-bold text-slate-800">{selectedVillage.subsidyPenetration}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">Total Farmers:</span>
                    <span className="text-xs font-bold text-slate-800">{selectedVillage.farmerCount} Registered</span>
                  </div>
                </div>

                {/* 3. Alerts & Pending Apps */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Alerts & Pending Apps</span>
                    {selectedVillage.pendingApps > 5 && (
                      <span className="text-[9px] bg-amber-500 text-white font-black px-1.5 py-0.2 rounded animate-pulse">
                        HIGH LOAD
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/80 bg-white shadow-xs">
                    <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
                      <ClipboardCheck className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-slate-800">
                        {selectedVillage.pendingApps} Pending Applications
                      </p>
                      <p className="text-[9px] text-slate-400">KYC verification & claim audits pending</p>
                    </div>
                    <button
                      onClick={() => {
                        if (selectedVillage.pendingApps > 0 && onVerifyFarmerClick) {
                          onVerifyFarmerClick();
                        } else {
                          alert("Redirecting to verification console...");
                        }
                      }}
                      className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  {selectedVillage.weather.alert && selectedVillage.weather.alert !== "Normal" && (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl border border-red-200 bg-red-50/50">
                      <div className="p-2 bg-red-100 text-red-700 rounded-lg">
                        <ShieldAlert className="h-4.5 w-4.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-red-700">District Hazard Alert</p>
                        <p className="text-[9px] text-red-600 font-bold">{selectedVillage.weather.alert}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Drone Scan Hub */}
                <div className="border border-slate-200/80 rounded-xl p-3 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                      <Radar className="h-3.5 w-3.5 text-emerald-700 animate-pulse" />
                      Drone Survey Deck
                    </span>
                    <button
                      disabled={isDroneScanning}
                      onClick={() => startDroneScan(selectedVillage.name)}
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded transition-all cursor-pointer ${
                        isDroneScanning
                          ? "bg-slate-200 text-slate-400"
                          : "bg-emerald-700 hover:bg-emerald-600 text-white"
                      }`}
                    >
                      {isDroneScanning ? "Drone Flying" : "Launch Scan"}
                    </button>
                  </div>

                  {isDroneScanning ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[9px] text-slate-500 font-bold">
                        <span>Flying Sentinel drone...</span>
                        <span>{droneProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-700 h-full transition-all duration-300"
                          style={{ width: `${droneProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : droneScanLog.length > 0 ? (
                    <div className="bg-slate-900 text-emerald-400 font-mono text-[9.5px] p-2.5 rounded-lg border border-slate-800 space-y-1 max-h-[110px] overflow-y-auto">
                      {droneScanLog.map((log, index) => (
                        <p key={index} className="leading-relaxed">
                          {log}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-500 font-medium">
                      Trigger direct drone-mapping flight to capture orthomosaic, thermal, and NDVI crop health matrices.
                    </p>
                  )}
                </div>

              </div>

              {/* Action Footer */}
              <div className="p-4 border-t border-slate-200 flex gap-2 bg-slate-50">
                <button
                  onClick={() => {
                    if (onVerifyFarmerClick) onVerifyFarmerClick();
                  }}
                  className="flex-1 bg-white hover:bg-slate-50 border border-slate-250 text-slate-700 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <UserCheck className="h-4 w-4 text-slate-600" />
                  Verify Village KYC
                </button>
                <button
                  onClick={() => {
                    if (onVerifySubsidyClick) onVerifySubsidyClick();
                  }}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-600 text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 shadow"
                >
                  <ClipboardCheck className="h-4 w-4" />
                  Approve Subsidies
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-2 h-[500px]">
              <MapIcon className="h-10 w-10 text-slate-300" />
              <p className="text-xs font-black text-slate-700 uppercase tracking-wider">No Village Selected</p>
              <p className="text-[11px] text-slate-500 max-w-[200px]">
                Click on any node in the district map to open its active farmers, crop NDVIs, and subsidy penetration charts.
              </p>
            </div>
          )}
        </div>

      </div>
      
    </div>
  );
}
