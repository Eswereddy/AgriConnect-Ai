import React, { useState, useEffect, useRef } from "react";
import {
  Plane,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Play,
  Square,
  Pause,
  TrendingUp,
  Droplets,
  Thermometer,
  Bug,
  Gauge,
  Layers,
  Map,
  Navigation,
  Settings,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Sliders,
  Download,
  Sparkles,
  Cpu,
  Eye,
  Orbit,
  Battery,
  Zap,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// ==========================================
// GRID DATA GENERATOR (10x10 farm grid)
// ==========================================
interface GridCell {
  id: string;
  row: number;
  col: number;
  ndvi: number; // 0.1 to 0.95
  cropHeight: number; // in meters (0.2 to 1.8)
  waterStress: number; // 0 (dry) to 100 (wet/flooded)
  pestHotspot: "None" | "Aphids" | "Spider Mites" | "Stem Borers";
  pestConfidence: number; // %
  thermalLeak: boolean; // irrigation pipe leak (unusually cold wet spot)
  tempCelsius: number; // 20 to 45
  nitrogen: number; // mg/kg
  phosphorus: number; // mg/kg
  potassium: number; // mg/kg
  plantCount: number; // stand count (number of germinated plants in 5x5m area)
  elevation: number; // in meters (baseline topography)
}

// Deterministically generate a realistic 10x10 sector map
const generateSectorGrid = (seed: string): GridCell[] => {
  const cells: GridCell[] = [];
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      // Create some spatial patterns (e.g., dry patch in middle, healthier zone on left, a pest hotspot around row 3 col 4)
      const distFromCenter = Math.sqrt(Math.pow(r - 5, 2) + Math.pow(c - 5, 2));
      const distFromPest = Math.sqrt(Math.pow(r - 3, 2) + Math.pow(c - 4, 2));
      const distFromLeak = Math.sqrt(Math.pow(r - 7, 2) + Math.pow(c - 8, 2));

      // NDVI calculation
      let ndvi = 0.75 - distFromCenter * 0.05 + Math.sin(r * 0.8) * 0.05 + Math.cos(c * 0.8) * 0.05;
      if (distFromPest < 2.0) ndvi -= 0.35; // Pest damage lowers NDVI
      if (r === 1 && c === 2) ndvi = 0.18; // Barren soil / tractor track
      ndvi = Math.max(0.12, Math.min(0.95, ndvi));

      // Crop height
      let cropHeight = 0.3 + ndvi * 1.2; // height correlated with NDVI
      if (r === 1 && c === 2) cropHeight = 0.0;

      // Water stress (moisture)
      let waterStress = 55 + Math.sin(r * 0.5) * 15 + Math.cos(c * 0.5) * 15;
      if (distFromCenter < 2.5) waterStress -= 30; // Centered dry patch
      if (distFromLeak < 1.5) waterStress += 40; // Leak makes soil extremely wet
      waterStress = Math.max(12, Math.min(98, waterStress));

      // Pest hotspot
      let pestHotspot: GridCell["pestHotspot"] = "None";
      let pestConfidence = 0;
      if (distFromPest < 1.2) {
        pestHotspot = "Aphids";
        pestConfidence = Math.floor(82 + (r + c) * 1);
      } else if (r === 8 && c === 2) {
        pestHotspot = "Spider Mites";
        pestConfidence = 91;
      } else if (r === 6 && c === 5) {
        pestHotspot = "Stem Borers";
        pestConfidence = 76;
      }

      // Thermal leak detection (represented as anomalous cold spot on hot days)
      const thermalLeak = distFromLeak < 1.0;
      let tempCelsius = 34 + Math.sin(r * 0.3) * 2;
      if (thermalLeak) tempCelsius -= 9.5; // cooling effect of leaking water
      if (ndvi > 0.8) tempCelsius -= 3.0; // shading effect of dense crop

      // Nutrients (N-P-K)
      let nitrogen = Math.max(20, Math.floor(75 - r * 4 + c * 3));
      if (r > 6) nitrogen -= 25; // low nitrogen patch in southern quadrant
      const phosphorus = Math.max(15, Math.floor(45 + Math.sin(c) * 12));
      const potassium = Math.max(30, Math.floor(65 + Math.cos(r) * 15));

      // Stand count (germinated plants)
      let plantCount = Math.floor(18 + ndvi * 12);
      if (pestHotspot !== "None") plantCount = Math.floor(plantCount * 0.7);
      if (r === 1 && c === 2) plantCount = 0;

      // Topography Elevation
      const elevation = 100.5 + Math.sin(r * 0.4) * 1.5 + Math.cos(c * 0.4) * 1.2;

      cells.push({
        id: `${r}-${c}`,
        row: r,
        col: c,
        ndvi,
        cropHeight,
        waterStress,
        pestHotspot,
        pestConfidence,
        thermalLeak,
        tempCelsius,
        nitrogen,
        phosphorus,
        potassium,
        plantCount,
        elevation
      });
    }
  }
  return cells;
};

// ==========================================
// TELEMETRY RECORD GENERATION FOR LOGS
// ==========================================
interface FlightLog {
  id: string;
  droneName: string;
  date: string;
  durationMins: number;
  coveragePercent: number;
  averageNdvi: number;
  anomalyDetected: string;
  pathCoordinates: { x: number; y: number }[];
  telemetryData: { time: number; altitude: number; battery: number; speed: number }[];
}

const INITIAL_FLIGHTS: FlightLog[] = [
  {
    id: "log-1",
    droneName: "Agri-Hawk V4",
    date: "2026-06-27 08:30 AM",
    durationMins: 22,
    coveragePercent: 100,
    averageNdvi: 0.68,
    anomalyDetected: "Pest Hotspot in Block A3 & Minor Pipe Leak East",
    pathCoordinates: [
      { x: 10, y: 10 }, { x: 90, y: 10 }, { x: 90, y: 30 }, { x: 10, y: 30 },
      { x: 10, y: 50 }, { x: 90, y: 50 }, { x: 90, y: 70 }, { x: 10, y: 70 },
      { x: 10, y: 90 }, { x: 90, y: 90 }
    ],
    telemetryData: Array.from({ length: 24 }, (_, i) => ({
      time: i,
      altitude: 12 + Math.sin(i * 0.5) * 1.5,
      battery: Math.max(20, 100 - i * 3.5),
      speed: 8 + Math.cos(i * 0.4) * 1.2
    }))
  },
  {
    id: "log-2",
    droneName: "Thermal-Scanner Pro",
    date: "2026-06-26 02:15 PM",
    durationMins: 15,
    coveragePercent: 85,
    averageNdvi: 0.71,
    anomalyDetected: "Irrigation Pressure drop - potential pooling south",
    pathCoordinates: [
      { x: 10, y: 10 }, { x: 10, y: 90 }, { x: 30, y: 90 }, { x: 30, y: 10 },
      { x: 50, y: 10 }, { x: 50, y: 90 }, { x: 70, y: 90 }, { x: 70, y: 10 }
    ],
    telemetryData: Array.from({ length: 15 }, (_, i) => ({
      time: i,
      altitude: 15 + Math.sin(i * 0.8) * 0.5,
      battery: Math.max(40, 100 - i * 4.0),
      speed: 10 + Math.sin(i * 0.6) * 1.5
    }))
  }
];

interface DroneItem {
  id: string;
  name: string;
  status: "Ready" | "Flying" | "Charging" | "Maintenance";
  battery: number;
  payload: string;
  rangeLimit: string;
  maxFlightTime: string;
  health: {
    motors: string;
    gps: string;
    wifi: string;
    camera: string;
  };
}

const DRONE_FLEET: DroneItem[] = [
  {
    id: "drone-1",
    name: "Agri-Hawk V4",
    status: "Ready",
    battery: 95,
    payload: "RedEdge-MX Multispectral Camera",
    rangeLimit: "4.5 km",
    maxFlightTime: "35 mins",
    health: { motors: "Optimal (4)", gps: "18 Satellites (Lock)", wifi: "-45 dBm (Excellent)", camera: "Spectral Band Calibrated" }
  },
  {
    id: "drone-2",
    name: "Octo-Spray Heavy",
    status: "Ready",
    battery: 88,
    payload: "20L Smart Spraying Liquid Tank",
    rangeLimit: "3.2 km",
    maxFlightTime: "24 mins",
    health: { motors: "Optimal (8)", gps: "15 Satellites (Lock)", wifi: "-52 dBm (Strong)", camera: "Down-look Guidance Ready" }
  },
  {
    id: "drone-3",
    name: "Thermal-Scanner Pro",
    status: "Charging",
    battery: 42,
    payload: "FLIR Vue Pro Thermal Core",
    rangeLimit: "5.0 km",
    maxFlightTime: "40 mins",
    health: { motors: "Recalibrating (6)", gps: "0 Satellites (Indoor)", wifi: "-32 dBm (Docked)", camera: "Radiometric Calibrated" }
  }
];

interface FlightSchedule {
  id: string;
  droneName: string;
  time: string;
  missionType: string;
  sectorName: string;
  status: "Scheduled" | "In-Progress" | "Completed";
}

export default function DroneMonitoringSystem() {
  // Visual Mode Selectors
  const [activeSubTab, setActiveSubTab] = useState<"analysis" | "flight" | "fleet">("analysis");
  const [activeLayer, setActiveLayer] = useState<"ndvi" | "pest" | "water" | "height" | "count" | "nutrients" | "thermal" | "3d">("ndvi");
  const [selectedDroneId, setSelectedDroneId] = useState<string>("drone-1");
  const [selectedLogId, setSelectedLogId] = useState<string>("log-1");

  // Grid Data & Selected Cell Information
  const [gridCells, setGridCells] = useState<GridCell[]>([]);
  const [selectedCell, setSelectedCell] = useState<GridCell | null>(null);

  // Flight Path Simulator & Optimizations
  const [missionType, setMissionType] = useState<"sweep" | "hotspots" | "boundary">("sweep");
  const [flightSpeed, setFlightSpeed] = useState<number>(8); // m/s
  const [flightAltitude, setFlightAltitude] = useState<number>(12); // meters
  const [optimizedRoute, setOptimizedRoute] = useState<{ x: number; y: number }[]>([]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simStep, setSimStep] = useState<number>(0);
  const [simBattery, setSimBattery] = useState<number>(100);
  const [simTimeLeft, setSimTimeLeft] = useState<number>(30);
  const [simCoverage, setSimCoverage] = useState<number>(0);
  const [simAltitude, setSimAltitude] = useState<number>(0);

  // Fleet Schedules
  const [schedules, setSchedules] = useState<FlightSchedule[]>([
    { id: "sch-1", droneName: "Agri-Hawk V4", time: "09:30 AM", missionType: "Multispectral NDVI Scanning", sectorName: "North Sector (Maize)", status: "Scheduled" },
    { id: "sch-2", droneName: "Octo-Spray Heavy", time: "11:00 AM", missionType: "Spot Insecticide Treatment", sectorName: "South Sector (Blight)", status: "Scheduled" },
    { id: "sch-3", droneName: "Thermal-Scanner Pro", time: "04:30 PM", missionType: "Sub-surface Leak Audit", sectorName: "West Terrace (Grapes)", status: "Scheduled" }
  ]);
  const [newSchedule, setNewSchedule] = useState({
    droneId: "drone-1",
    time: "08:00 AM",
    missionType: "Crop Height Assessment",
    sectorName: "North-East Basin"
  });

  // Logs
  const [flightLogs, setFlightLogs] = useState<FlightLog[]>(INITIAL_FLIGHTS);

  // Initialize farm grid cell data
  useEffect(() => {
    const cells = generateSectorGrid("farm-1");
    setGridCells(cells);
    // select center cell by default
    const center = cells.find(c => c.row === 4 && c.col === 4);
    if (center) setSelectedCell(center);
  }, []);

  // AI Suggestions and Yield calculations based on Aerial Data
  const calculateTotalAcreageYield = () => {
    // Average NDVI and heights
    const validCells = gridCells.filter(c => c.ndvi > 0.2);
    if (validCells.length === 0) return { avgNdvi: 0, avgHeight: 0, yieldEstimate: 0, standCount: 0 };
    const avgNdvi = validCells.reduce((sum, c) => sum + c.ndvi, 0) / validCells.length;
    const avgHeight = validCells.reduce((sum, c) => sum + c.cropHeight, 0) / validCells.length;
    const totalStandCount = gridCells.reduce((sum, c) => sum + c.plantCount, 0) * 10; // scaled
    
    // Simple heuristic calculation for yield based on density, ndvi, and canopy height
    // yield in tons per acre estimate
    const yieldEstimate = (avgNdvi * 4.2) + (avgHeight * 2.8) + (totalStandCount / 15000);
    return {
      avgNdvi: parseFloat(avgNdvi.toFixed(2)),
      avgHeight: parseFloat(avgHeight.toFixed(2)),
      yieldEstimate: parseFloat(yieldEstimate.toFixed(1)),
      standCount: totalStandCount
    };
  };

  const yieldData = calculateTotalAcreageYield();

  // Optimizing Spraying & Survey route using specific algorithms
  useEffect(() => {
    generateOptimizedRoute();
  }, [missionType, gridCells]);

  const generateOptimizedRoute = () => {
    const pts: { x: number; y: number }[] = [];
    const stepSize = 10; // percent increments in grid
    
    if (missionType === "sweep") {
      // Standard serpentine lawnmower grid sweep path
      for (let r = 0; r < 10; r++) {
        const y = 5 + r * 10;
        if (r % 2 === 0) {
          for (let c = 0; c < 10; c++) pts.push({ x: 5 + c * 10, y });
        } else {
          for (let c = 9; c >= 0; c--) pts.push({ x: 5 + c * 10, y });
        }
      }
    } else if (missionType === "hotspots") {
      // Direct routing connecting only pest hotspots or thermal leak cells
      // Seed with start position
      pts.push({ x: 5, y: 5 });
      gridCells.forEach(cell => {
        if (cell.pestHotspot !== "None" || cell.thermalLeak) {
          pts.push({ x: 5 + cell.col * 10, y: 5 + cell.row * 10 });
        }
      });
      // Sort by nearest neighbor to simulate route optimization algorithm (TSP)
      const sortedPts = [pts[0]];
      const unvisited = pts.slice(1);
      while (unvisited.length > 0) {
        const current = sortedPts[sortedPts.length - 1];
        let nearestIdx = 0;
        let minDist = Infinity;
        for (let i = 0; i < unvisited.length; i++) {
          const d = Math.sqrt(Math.pow(current.x - unvisited[i].x, 2) + Math.pow(current.y - unvisited[i].y, 2));
          if (d < minDist) {
            minDist = d;
            nearestIdx = i;
          }
        }
        sortedPts.push(unvisited[nearestIdx]);
        unvisited.splice(nearestIdx, 1);
      }
      setOptimizedRoute(sortedPts);
      return;
    } else {
      // Boundary sweep layout (outer boundary perimeter mapping)
      pts.push({ x: 5, y: 5 });
      pts.push({ x: 95, y: 5 });
      pts.push({ x: 95, y: 95 });
      pts.push({ x: 5, y: 95 });
      pts.push({ x: 5, y: 15 });
      pts.push({ x: 85, y: 15 });
      pts.push({ x: 85, y: 85 });
      pts.push({ x: 15, y: 85 });
      pts.push({ x: 15, y: 25 });
    }
    setOptimizedRoute(pts);
  };

  // Live Flight Simulation Timer
  useEffect(() => {
    let interval: any = null;
    if (isSimulating) {
      interval = setInterval(() => {
        setSimStep(prevStep => {
          if (prevStep >= optimizedRoute.length - 1) {
            return prevStep;
          }
          return prevStep + 1;
        });
      }, 400);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isSimulating, optimizedRoute.length]);

  // Handle simulation step changes and side effects
  useEffect(() => {
    if (!isSimulating || optimizedRoute.length === 0) return;

    if (simStep >= optimizedRoute.length - 1) {
      // Mission Complete! Save to logbook
      setIsSimulating(false);
      const finishedDrone = DRONE_FLEET.find(d => d.id === selectedDroneId)?.name || "Agri-Hawk V4";
      const newLog: FlightLog = {
        id: `log-${Date.now()}`,
        droneName: finishedDrone,
        date: new Date().toLocaleString(),
        durationMins: Math.floor(optimizedRoute.length * 0.3),
        coveragePercent: missionType === "sweep" ? 100 : missionType === "boundary" ? 75 : 45,
        averageNdvi: yieldData.avgNdvi,
        anomalyDetected: missionType === "hotspots" ? "Spot Spray Mission Executed on target sectors." : "Fully scanned. Anomalies locked.",
        pathCoordinates: optimizedRoute,
        telemetryData: Array.from({ length: optimizedRoute.length }, (_, idx) => ({
          time: idx,
          altitude: flightAltitude,
          battery: Math.max(10, 100 - idx * 3.5),
          speed: flightSpeed
        }))
      };
      setFlightLogs(prev => [newLog, ...prev]);
      setSelectedLogId(newLog.id);
      return;
    }

    // Compute battery drainage and scanning progress
    const percentage = (simStep / (optimizedRoute.length - 1)) * 100;
    setSimCoverage(Math.floor(percentage));
    setSimBattery(Math.max(15, Math.floor(100 - simStep * (1.2 + (15 - flightSpeed) * 0.05))));
    setSimTimeLeft(Math.max(2, Math.floor(30 - simStep * 0.4)));
    
    // Live telemetry
    const heightVariance = Math.sin(simStep * 0.6) * 0.8;
    setSimAltitude(parseFloat((flightAltitude + heightVariance).toFixed(1)));

    // Trigger simulated telemetry updates onto selected cell
    const pt = optimizedRoute[simStep];
    if (pt) {
      const col = Math.min(9, Math.max(0, Math.floor(pt.x / 10)));
      const row = Math.min(9, Math.max(0, Math.floor(pt.y / 10)));
      const cell = gridCells.find(c => c.row === row && c.col === col);
      if (cell) {
        setSelectedCell(cell);
      }
    }
  }, [simStep, isSimulating, optimizedRoute, flightAltitude, flightSpeed, selectedDroneId, missionType, yieldData.avgNdvi]);

  const handleStartSimulation = () => {
    if (optimizedRoute.length === 0) return;
    setIsSimulating(true);
    setSimStep(0);
    setSimBattery(100);
    setSimCoverage(0);
  };

  const handleStopSimulation = () => {
    setIsSimulating(false);
  };

  // Add flight schedule
  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const drone = DRONE_FLEET.find(d => d.id === newSchedule.droneId)?.name || "Agri-Hawk V4";
    const item: FlightSchedule = {
      id: `sch-${Date.now()}`,
      droneName: drone,
      time: newSchedule.time,
      missionType: newSchedule.missionType,
      sectorName: newSchedule.sectorName,
      status: "Scheduled"
    };
    setSchedules(prev => [...prev, item]);
    setNewSchedule({
      droneId: "drone-1",
      time: "08:00 AM",
      missionType: "Crop Height Assessment",
      sectorName: "North-East Basin"
    });
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  };

  // Active flight log visual rendering
  const activeLog = flightLogs.find(l => l.id === selectedLogId) || flightLogs[0];

  return (
    <div className="space-y-6" id="drone-monitoring-dashboard">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-cyan-600 text-white rounded-lg">
              <Plane className="h-5 w-5 animate-bounce" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Ecosystem Drone Monitoring Hub</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Deploy autonomous fleet, compile multispectral index maps, optimize spray routing, and assess crop biomass telemetry.
          </p>
        </div>

        {/* Live Action Quick Selector */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-center">
          <button
            onClick={() => setActiveSubTab("analysis")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === "analysis" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Layers className="inline h-3.5 w-3.5 mr-1" />
            Aerial Analysis
          </button>
          <button
            onClick={() => setActiveSubTab("flight")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === "flight" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Navigation className="inline h-3.5 w-3.5 mr-1" />
            Flight Planner & Optimizer
          </button>
          <button
            onClick={() => setActiveSubTab("fleet")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === "fleet" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Cpu className="inline h-3.5 w-3.5 mr-1" />
            Fleet Status & Logs
          </button>
        </div>
      </div>

      {/* 1. SECTION: AERIAL INDEX MAPPING & DIAGNOSTICS */}
      {activeSubTab === "analysis" && (
        <div className="space-y-6">
          
          {/* Diagnostic overview ribbon */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Avg NDVI Index</p>
                <p className="text-sm font-extrabold text-slate-800">{yieldData.avgNdvi} (Healthy)</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center gap-3">
              <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-lg shrink-0">
                <Droplets className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Crop Height (Biomass)</p>
                <p className="text-sm font-extrabold text-slate-800">{yieldData.avgHeight}m Average</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                <Orbit className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Plant Stand Count</p>
                <p className="text-sm font-extrabold text-slate-800">~{yieldData.standCount.toLocaleString()} / Acre</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center gap-3">
              <div className="p-2.5 bg-teal-50 text-teal-600 rounded-lg shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Aerial Yield Estimate</p>
                <p className="text-sm font-extrabold text-teal-800">{yieldData.yieldEstimate} Tons / Acre</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Interactive Grid & Layer Selector */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                  <Map className="h-4 w-4 text-cyan-600" />
                  Multispectral Interactive Orthomosaic Map
                </h3>
                
                {/* Layer Picker */}
                <div className="flex flex-wrap gap-1 bg-slate-50 p-1 rounded-xl border border-slate-150">
                  <button
                    onClick={() => setActiveLayer("ndvi")}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      activeLayer === "ndvi" ? "bg-emerald-600 text-white" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    NDVI Greenness
                  </button>
                  <button
                    onClick={() => setActiveLayer("pest")}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      activeLayer === "pest" ? "bg-red-600 text-white" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Pests
                  </button>
                  <button
                    onClick={() => setActiveLayer("water")}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      activeLayer === "water" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Water Stress
                  </button>
                  <button
                    onClick={() => setActiveLayer("height")}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      activeLayer === "height" ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Height Map
                  </button>
                  <button
                    onClick={() => setActiveLayer("count")}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      activeLayer === "count" ? "bg-violet-600 text-white" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Stand Count
                  </button>
                  <button
                    onClick={() => setActiveLayer("nutrients")}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      activeLayer === "nutrients" ? "bg-amber-600 text-white" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Nutrient (N)
                  </button>
                  <button
                    onClick={() => setActiveLayer("thermal")}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      activeLayer === "thermal" ? "bg-orange-600 text-white" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Thermal Leak
                  </button>
                  <button
                    onClick={() => setActiveLayer("3d")}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      activeLayer === "3d" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Isometric 3D
                  </button>
                </div>
              </div>

              {/* Grid Workspace */}
              <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden min-h-[380px]">
                {activeLayer === "3d" ? (
                  // ISOMETRIC 3D TOPOGRAPHY & HEIGHT REPRESENTATION
                  <div className="relative w-full max-w-md h-[340px] flex items-center justify-center overflow-visible select-none py-10">
                    <div 
                      className="grid grid-cols-10 gap-1.5 transition-all duration-500 ease-in-out"
                      style={{
                        transform: "rotateX(60deg) rotateY(0deg) rotateZ(-45deg) scale(0.95)",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      {gridCells.map((cell) => {
                        const hFactor = cell.cropHeight * 22; // Height multiplier for visualization
                        return (
                          <div
                            key={`3d-${cell.id}`}
                            onClick={() => setSelectedCell(cell)}
                            className="relative group cursor-pointer transition-transform hover:scale-110"
                            style={{
                              width: "28px",
                              height: "28px",
                              transformStyle: "preserve-3d",
                              transform: "translateZ(0px)",
                            }}
                          >
                            {/* Visual extrusion bar representing crop height */}
                            <div
                              className="absolute bottom-0 left-0 w-full transition-all duration-300"
                              style={{
                                height: "28px",
                                transformStyle: "preserve-3d",
                                transform: `translateZ(${cell.cropHeight * 25}px)`,
                                backgroundColor: cell.ndvi > 0.75 ? "#15803d" : cell.ndvi > 0.5 ? "#22c55e" : cell.ndvi > 0.3 ? "#eab308" : "#b91c1c",
                                border: "1px solid rgba(255,255,255,0.15)",
                              }}
                            >
                              {/* Left side face */}
                              <div
                                className="absolute top-0 left-0 h-full bg-black/15 origin-left"
                                style={{
                                  width: `${cell.cropHeight * 25}px`,
                                  transform: "rotateY(-90deg) translateZ(0px)",
                                }}
                              />
                              {/* Top cap */}
                              <div
                                className="absolute top-0 left-0 w-full h-full bg-white/20"
                                style={{
                                  transform: "translateZ(0px)",
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="absolute bottom-2 left-2 text-[10px] font-bold text-slate-500 bg-white border px-2 py-1 rounded">
                      Perspective: Topographical Elevation + Biomass Height Profile
                    </div>
                  </div>
                ) : (
                  // 2D HEATMAP GRID LAYERS
                  <div className="grid grid-cols-10 gap-1 w-full max-w-[420px] aspect-square">
                    {gridCells.map((cell) => {
                      // Determine background color based on active layer
                      let cellColor = "bg-slate-200";
                      let content: React.ReactNode = null;

                      if (activeLayer === "ndvi") {
                        if (cell.ndvi > 0.8) cellColor = "bg-emerald-800 text-white";
                        else if (cell.ndvi > 0.65) cellColor = "bg-emerald-600 text-white";
                        else if (cell.ndvi > 0.5) cellColor = "bg-emerald-400 text-slate-800";
                        else if (cell.ndvi > 0.35) cellColor = "bg-yellow-400 text-slate-800";
                        else if (cell.ndvi > 0.2) cellColor = "bg-orange-500 text-white";
                        else cellColor = "bg-red-700 text-white";
                      } else if (activeLayer === "pest") {
                        if (cell.pestHotspot !== "None") {
                          cellColor = "bg-red-500 animate-pulse text-white";
                          content = <Bug className="h-4.5 w-4.5 text-white" />;
                        } else {
                          cellColor = "bg-slate-100 hover:bg-slate-200 text-slate-400";
                        }
                      } else if (activeLayer === "water") {
                        // water stress mapping
                        if (cell.waterStress < 25) cellColor = "bg-red-100 text-red-800 border border-red-300"; // dangerously dry
                        else if (cell.waterStress < 45) cellColor = "bg-amber-100 text-amber-800 border border-amber-300"; // dry
                        else if (cell.waterStress < 75) cellColor = "bg-blue-300 text-blue-900"; // optimal
                        else cellColor = "bg-blue-600 text-white"; // flooded/leaking
                      } else if (activeLayer === "height") {
                        if (cell.cropHeight > 1.2) cellColor = "bg-indigo-900 text-white";
                        else if (cell.cropHeight > 0.8) cellColor = "bg-indigo-700 text-white";
                        else if (cell.cropHeight > 0.5) cellColor = "bg-indigo-400 text-indigo-950";
                        else if (cell.cropHeight > 0.2) cellColor = "bg-indigo-200 text-indigo-800";
                        else cellColor = "bg-slate-200 text-slate-500";
                      } else if (activeLayer === "count") {
                        if (cell.plantCount > 24) cellColor = "bg-violet-800 text-white";
                        else if (cell.plantCount > 18) cellColor = "bg-violet-600 text-white";
                        else if (cell.plantCount > 12) cellColor = "bg-violet-400 text-violet-950";
                        else cellColor = "bg-violet-200 text-violet-800";
                        content = <span className="text-[9px] font-extrabold">{cell.plantCount}</span>;
                      } else if (activeLayer === "nutrients") {
                        if (cell.nitrogen < 35) cellColor = "bg-amber-100 text-amber-900 border border-amber-400 font-bold";
                        else if (cell.nitrogen < 55) cellColor = "bg-amber-300 text-amber-950";
                        else cellColor = "bg-amber-600 text-white";
                        content = <span className="text-[9px] font-extrabold">N{cell.nitrogen}</span>;
                      } else if (activeLayer === "thermal") {
                        if (cell.thermalLeak) {
                          cellColor = "bg-cyan-500 animate-pulse border-2 border-cyan-300";
                          content = <Droplets className="h-4 w-4 text-white animate-bounce" />;
                        } else {
                          // Standard surface heat thermal distribution
                          if (cell.tempCelsius > 35) cellColor = "bg-red-500 text-white";
                          else if (cell.tempCelsius > 31) cellColor = "bg-orange-400 text-slate-900";
                          else if (cell.tempCelsius > 27) cellColor = "bg-yellow-300 text-slate-900";
                          else cellColor = "bg-blue-400 text-slate-950";
                        }
                      }

                      const isSelected = selectedCell?.id === cell.id;

                      return (
                        <button
                          key={cell.id}
                          onClick={() => setSelectedCell(cell)}
                          className={`aspect-square rounded-md transition-all flex flex-col items-center justify-center cursor-pointer border ${cellColor} ${
                            isSelected ? "ring-3 ring-cyan-500 scale-105 z-10 shadow-lg" : "border-black/5 hover:scale-102"
                          }`}
                          title={`Row ${cell.row}, Col ${cell.col}`}
                        >
                          {content ? content : (
                            <span className="text-[8px] opacity-75 font-mono">
                              {activeLayer === "ndvi" && cell.ndvi.toFixed(2)}
                              {activeLayer === "water" && `${cell.waterStress}%`}
                              {activeLayer === "height" && `${cell.cropHeight}m`}
                              {activeLayer === "thermal" && `${Math.round(cell.tempCelsius)}°`}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Legend panel */}
                <div className="mt-4 flex flex-wrap gap-4 items-center justify-center text-[10px] text-slate-500 border-t border-slate-100 pt-3 w-full">
                  {activeLayer === "ndvi" && (
                    <>
                      <span className="font-bold">NDVI Legend:</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-4 bg-emerald-800 rounded inline-block"></span> &gt;0.80 Dense</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-4 bg-emerald-500 rounded inline-block"></span> 0.50-0.79 Healthy</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-4 bg-yellow-400 rounded inline-block"></span> 0.35-0.49 Stressed</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-4 bg-orange-500 rounded inline-block"></span> 0.20-0.34 Sparse</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-4 bg-red-700 rounded inline-block"></span> &lt;0.20 Bare/Dead</span>
                    </>
                  )}
                  {activeLayer === "pest" && (
                    <>
                      <span className="font-bold flex items-center gap-1"><Bug className="h-3.5 w-3.5 text-red-600 animate-pulse" /> Anomalies Located:</span>
                      <span>Hover cells or inspect grid to isolate aphid infestations, mites, and stem borers.</span>
                    </>
                  )}
                  {activeLayer === "water" && (
                    <>
                      <span className="font-bold">Soil Water Level:</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-4 bg-red-100 border border-red-300 rounded inline-block"></span> &lt;25% Wilt Warning</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-4 bg-blue-300 rounded inline-block"></span> 45-75% Optimal</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-4 bg-blue-600 rounded inline-block"></span> &gt;75% Waterlogging</span>
                    </>
                  )}
                  {activeLayer === "thermal" && (
                    <>
                      <span className="font-bold">Infrared Heat Probe:</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-4 bg-cyan-500 rounded inline-block"></span> Leak / Standing Water</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-4 bg-yellow-300 rounded inline-block"></span> Standard Temp</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-4 bg-red-500 rounded inline-block"></span> Dry Hot Canopy</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Drone Spot Analyzer Sidebar */}
            <div className="lg:col-span-4 space-y-4">
              
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="h-4 w-4 text-cyan-600" />
                    Drone Spot Diagnostics
                  </h4>
                  <span className="text-[10px] text-cyan-700 bg-cyan-50 font-bold px-2 py-0.5 rounded">
                    Row: {selectedCell ? selectedCell.row : "-"} Col: {selectedCell ? selectedCell.col : "-"}
                  </span>
                </div>

                {selectedCell ? (
                  <div className="space-y-4 text-xs font-semibold">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                        <span className="block text-[9px] text-slate-400 uppercase font-bold">NDVI Value</span>
                        <span className={`text-sm font-extrabold block mt-0.5 ${selectedCell.ndvi > 0.5 ? "text-emerald-700" : "text-amber-600"}`}>
                          {selectedCell.ndvi.toFixed(2)}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                        <span className="block text-[9px] text-slate-400 uppercase font-bold">Canopy Height</span>
                        <span className="text-sm font-extrabold text-indigo-700 block mt-0.5">
                          {selectedCell.cropHeight.toFixed(2)} meters
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                        <span className="block text-[9px] text-slate-400 uppercase font-bold">Moisture Level</span>
                        <span className="text-sm font-extrabold text-blue-700 block mt-0.5">
                          {selectedCell.waterStress}% Relative
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                        <span className="block text-[9px] text-slate-400 uppercase font-bold">Surface Temp</span>
                        <span className="text-sm font-extrabold text-red-600 block mt-0.5">
                          {selectedCell.tempCelsius.toFixed(1)} °C
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 space-y-2">
                      <span className="block text-[9px] text-slate-400 uppercase font-bold">Primary Soil Nutrients</span>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-white p-1 rounded border">
                          <span className="block text-[9px] text-slate-400">Nitrogen</span>
                          <span className="font-extrabold text-amber-700">{selectedCell.nitrogen} <span className="text-[8px] font-normal">mg/kg</span></span>
                        </div>
                        <div className="bg-white p-1 rounded border">
                          <span className="block text-[9px] text-slate-400">Phosphorus</span>
                          <span className="font-extrabold text-amber-700">{selectedCell.phosphorus} <span className="text-[8px] font-normal">mg/kg</span></span>
                        </div>
                        <div className="bg-white p-1 rounded border">
                          <span className="block text-[9px] text-slate-400">Potassium</span>
                          <span className="font-extrabold text-amber-700">{selectedCell.potassium} <span className="text-[8px] font-normal">mg/kg</span></span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 space-y-1.5">
                      <span className="block text-[9px] text-slate-400 uppercase font-bold">Anomalies & Stand Audit</span>
                      <div className="space-y-1 text-[11px] leading-relaxed">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Stand Count:</span>
                          <span className="text-slate-800 font-extrabold">{selectedCell.plantCount} plants (5x5m)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Pest Infestation:</span>
                          <span className={`font-extrabold ${selectedCell.pestHotspot !== "None" ? "text-red-600" : "text-emerald-700"}`}>
                            {selectedCell.pestHotspot !== "None" ? `${selectedCell.pestHotspot} (${selectedCell.pestConfidence}% Conf)` : "Clean"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Irrigation Leak:</span>
                          <span className={`font-extrabold ${selectedCell.thermalLeak ? "text-red-600 animate-pulse" : "text-emerald-700"}`}>
                            {selectedCell.thermalLeak ? "High Risk Leak Detected" : "Normal Pressure"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* AI Advisor Response panel */}
                    <div className="bg-cyan-950 text-cyan-100 p-3.5 rounded-xl border border-cyan-800 space-y-1.5 shadow-md">
                      <div className="flex items-center gap-1 text-cyan-300">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">AI Flight Advisor Action</span>
                      </div>
                      <p className="text-[10px] leading-relaxed text-cyan-200">
                        {selectedCell.pestHotspot !== "None" && `Alert: Spot spraying required in row ${selectedCell.row}. Deploy Agri-Hawk Octo-Spray with targeted liquid herbicide immediately to prevent drift.`}
                        {selectedCell.thermalLeak && `Critical leak verified at column ${selectedCell.col}. Restrict regional main-line valves to prevent soil waterlogging and conserve pump pressure.`}
                        {selectedCell.ndvi < 0.35 && selectedCell.pestHotspot === "None" && "Severe nutrient deficiency or low biomass detected. Soil chemistry shows Nitrogen below critical 30 mg/kg threshold."}
                        {selectedCell.ndvi >= 0.75 && "Optimal growth parameters. No immediate spray or structural irrigation modifications required for this sector."}
                      </p>
                    </div>

                  </div>
                ) : (
                  <div className="text-center py-10 text-slate-400">
                    Select a cell on the map grid to view aerial telemetry
                  </div>
                )}
              </div>

              {/* Automated Flight Scheduler Card */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-cyan-600" />
                  Fleet Mission Queue
                </h4>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 text-xs">
                  {schedules.map(sch => (
                    <div key={sch.id} className="p-3 bg-slate-50 border rounded-xl flex items-center justify-between gap-2 hover:border-cyan-200 transition-all">
                      <div>
                        <p className="font-extrabold text-slate-800">{sch.missionType}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase">
                          {sch.droneName} • {sch.sectorName}
                        </p>
                        <p className="text-[10px] text-cyan-600 font-bold mt-0.5 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {sch.time}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteSchedule(sch.id)}
                        className="p-1.5 bg-white text-rose-500 hover:text-rose-700 hover:bg-rose-50 border rounded-lg transition-colors cursor-pointer"
                        title="Delete Schedule"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* 2. SECTION: AUTOMATED FLIGHT PLANNER & ROUTE OPTIMIZATION */}
      {activeSubTab === "flight" && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Mission parameters controls */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
                <Settings className="h-4 w-4 text-cyan-600" />
                Flight Mission Configuration
              </h3>

              <div className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target Flight Vehicle</label>
                  <select
                    value={selectedDroneId}
                    onChange={(e) => setSelectedDroneId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 cursor-pointer focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                    disabled={isSimulating}
                  >
                    {DRONE_FLEET.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.payload})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Routing & Coverage Algorithms</label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setMissionType("sweep")}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        missionType === "sweep"
                          ? "bg-cyan-50 border-cyan-500 text-cyan-900"
                          : "border-slate-150 hover:bg-slate-50 text-slate-600"
                      }`}
                      disabled={isSimulating}
                    >
                      <div>
                        <p className="font-bold">Serpentine Lawnmower Sweep</p>
                        <p className="text-[10px] text-slate-400 font-normal mt-0.5">Full coverage orthomosaic visual & NDVI recording</p>
                      </div>
                      <span className="text-[9px] font-extrabold bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded">100% Cover</span>
                    </button>

                    <button
                      onClick={() => setMissionType("hotspots")}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        missionType === "hotspots"
                          ? "bg-red-50 border-red-500 text-red-950"
                          : "border-slate-150 hover:bg-slate-50 text-slate-600"
                      }`}
                      disabled={isSimulating}
                    >
                      <div>
                        <p className="font-bold">Targeted Hotspot Spraying</p>
                        <p className="text-[10px] text-slate-400 font-normal mt-0.5">Optimized TSP node route targeting pests & leaks</p>
                      </div>
                      <span className="text-[9px] font-extrabold bg-red-100 text-red-700 px-2 py-0.5 rounded">Spot Specific</span>
                    </button>

                    <button
                      onClick={() => setMissionType("boundary")}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        missionType === "boundary"
                          ? "bg-emerald-50 border-emerald-500 text-emerald-950"
                          : "border-slate-150 hover:bg-slate-50 text-slate-600"
                      }`}
                      disabled={isSimulating}
                    >
                      <div>
                        <p className="font-bold">Perimeter Boundary Sweep</p>
                        <p className="text-[10px] text-slate-400 font-normal mt-0.5">Thermal perimeter audit for fence line and leaks</p>
                      </div>
                      <span className="text-[9px] font-extrabold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">Border Patrol</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target Speed ({flightSpeed} m/s)</label>
                    <input
                      type="range"
                      min="5"
                      max="15"
                      step="1"
                      value={flightSpeed}
                      onChange={(e) => setFlightSpeed(parseInt(e.target.value))}
                      className="w-full accent-cyan-600 cursor-pointer"
                      disabled={isSimulating}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Altitude ({flightAltitude}m)</label>
                    <input
                      type="range"
                      min="8"
                      max="25"
                      step="1"
                      value={flightAltitude}
                      onChange={(e) => setFlightAltitude(parseInt(e.target.value))}
                      className="w-full accent-cyan-600 cursor-pointer"
                      disabled={isSimulating}
                    />
                  </div>
                </div>

                {/* Simulation control action buttons */}
                <div className="pt-2">
                  {!isSimulating ? (
                    <button
                      id="launch-mission-btn"
                      onClick={handleStartSimulation}
                      className="w-full py-3 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Play className="h-4 w-4" />
                      SIMULATE MISSION (AUTONOMOUS TAKEOFF)
                    </button>
                  ) : (
                    <button
                      onClick={handleStopSimulation}
                      className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Square className="h-4 w-4" />
                      ABORT MISSION (AUTO RETURN-TO-HOME)
                    </button>
                  )}
                </div>

              </div>
            </div>

            {/* Flight visual rendering & Live Telemetry telemetry board */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Drone cockpit simulator screen */}
              <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 shadow-lg relative overflow-hidden min-h-[380px] flex flex-col justify-between">
                
                {/* HUD overlays */}
                <div className="flex justify-between items-start z-10 select-none">
                  <div className="space-y-1.5 font-mono text-[10px]">
                    <p className="text-cyan-400 font-bold tracking-widest uppercase flex items-center gap-1.5">
                      <span className={`h-2.5 w-2.5 rounded-full ${isSimulating ? "bg-emerald-500 animate-ping" : "bg-cyan-500"} inline-block`}></span>
                      {isSimulating ? "LIVE TRANSMISSION (autonomous flight)" : "FLIGHT SYSTEM READOUTS"}
                    </p>
                    <p>VEHICLE: <span className="font-bold text-white">{DRONE_FLEET.find(d => d.id === selectedDroneId)?.name}</span></p>
                    <p>WAYPOINTS: <span className="font-bold text-white">{optimizedRoute.length} Total</span></p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 text-center text-[10px] font-mono">
                    <div className="bg-black/40 border border-white/10 p-1.5 rounded">
                      <span className="block text-slate-400 text-[8px]">ALTITUDE</span>
                      <span className="text-emerald-400 font-extrabold">{isSimulating ? `${simAltitude}m` : `${flightAltitude}m`}</span>
                    </div>
                    <div className="bg-black/40 border border-white/10 p-1.5 rounded">
                      <span className="block text-slate-400 text-[8px]">SPEED</span>
                      <span className="text-emerald-400 font-extrabold">{flightSpeed} m/s</span>
                    </div>
                    <div className="bg-black/40 border border-white/10 p-1.5 rounded">
                      <span className="block text-slate-400 text-[8px]">BATTERY</span>
                      <span className={`font-extrabold ${isSimulating && simBattery < 30 ? "text-red-500 animate-pulse" : "text-emerald-400"}`}>
                        {isSimulating ? `${simBattery}%` : "100%"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Map projection viewport with optimized path overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-40 mix-blend-screen pointer-events-none p-12">
                  <div className="border border-white/15 w-full h-full rounded-xl relative">
                    <div className="absolute inset-0 bg-radial-grid"></div>
                  </div>
                </div>

                {/* SVG Flight Path Representation */}
                <div className="relative flex-1 flex items-center justify-center py-6">
                  <div className="w-full max-w-[420px] aspect-square bg-slate-950/85 rounded-xl border border-white/5 relative shadow-inner overflow-hidden">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                      {/* Grid background guide lines */}
                      {Array.from({ length: 9 }).map((_, i) => (
                        <line key={`lh-${i}`} x1="0" y1={(i + 1) * 10} x2="100" y2={(i + 1) * 10} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                      ))}
                      {Array.from({ length: 9 }).map((_, i) => (
                        <line key={`lv-${i}`} x1={(i + 1) * 10} y1="0" x2={(i + 1) * 10} y2="100" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                      ))}

                      {/* Path Line */}
                      {optimizedRoute.length > 0 && (
                        <polyline
                          points={optimizedRoute.map(p => `${p.x},${p.y}`).join(" ")}
                          fill="none"
                          stroke={isSimulating ? "#06b6d4" : "rgba(255,255,255,0.2)"}
                          strokeWidth="1.2"
                          strokeDasharray={isSimulating ? "none" : "2,2"}
                        />
                      )}

                      {/* Hotspot indicators inside the simulator */}
                      {gridCells.map((cell) => {
                        if (cell.pestHotspot !== "None") {
                          return (
                            <circle
                              key={`p-circle-${cell.id}`}
                              cx={5 + cell.col * 10}
                              cy={5 + cell.row * 10}
                              r="2.5"
                              fill="rgba(239, 68, 68, 0.45)"
                              className="animate-pulse"
                            />
                          );
                        }
                        if (cell.thermalLeak) {
                          return (
                            <circle
                              key={`l-circle-${cell.id}`}
                              cx={5 + cell.col * 10}
                              cy={5 + cell.row * 10}
                              r="2.5"
                              fill="rgba(6, 182, 212, 0.45)"
                              className="animate-pulse"
                            />
                          );
                        }
                        return null;
                      })}

                      {/* Drone position marker */}
                      {isSimulating && optimizedRoute[simStep] && (
                        <g transform={`translate(${optimizedRoute[simStep].x}, ${optimizedRoute[simStep].y})`}>
                          <circle r="4" fill="#06b6d4" className="animate-ping" />
                          <circle r="2.5" fill="#22d3ee" />
                          {/* Crosshair indicator */}
                          <line x1="-6" y1="0" x2="6" y2="0" stroke="#22d3ee" strokeWidth="0.5" />
                          <line x1="0" y1="-6" x2="0" y2="6" stroke="#22d3ee" strokeWidth="0.5" />
                        </g>
                      )}
                    </svg>

                    {/* Simple telemetry status boxes overlay */}
                    {isSimulating && (
                      <div className="absolute bottom-3 left-3 bg-black/60 border border-white/10 px-2 py-1 rounded font-mono text-[9px] text-cyan-300">
                        LAT: 30°54'N | LON: 75°51'E
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="space-y-2 z-10">
                  <div className="flex justify-between items-center text-[11px] font-mono text-slate-300">
                    <span>MISSION PROGRESS: {simCoverage}%</span>
                    <span>EST TIME REMAINING: {isSimulating ? `${simTimeLeft}s` : "--"}</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-cyan-500 h-full transition-all duration-300"
                      style={{ width: `${simCoverage}%` }}
                    ></div>
                  </div>
                </div>

              </div>

              {/* Dynamic Flight Form to schedule next */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Plus className="h-4 w-4 text-cyan-600" />
                  Schedule Custom Automated Flight Mission
                </h4>
                <form onSubmit={handleAddSchedule} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-3">
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Select Drone</label>
                    <select
                      value={newSchedule.droneId}
                      onChange={(e) => setNewSchedule(prev => ({ ...prev, droneId: e.target.value }))}
                      className="w-full bg-slate-50 border rounded-lg px-2 py-1.5 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none cursor-pointer"
                    >
                      {DRONE_FLEET.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Mission Type</label>
                    <select
                      value={newSchedule.missionType}
                      onChange={(e) => setNewSchedule(prev => ({ ...prev, missionType: e.target.value }))}
                      className="w-full bg-slate-50 border rounded-lg px-2 py-1.5 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none cursor-pointer"
                    >
                      <option value="NDVI Multispectral Survey">NDVI Multispectral Survey</option>
                      <option value="Thermal Pipe Leak Scan">Thermal Pipe Leak Scan</option>
                      <option value="Precision Micro-Spraying">Precision Micro-Spraying</option>
                      <option value="Topographical Elevation Map">Topographical Elevation Map</option>
                    </select>
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Target Sector</label>
                    <input
                      type="text"
                      value={newSchedule.sectorName}
                      onChange={(e) => setNewSchedule(prev => ({ ...prev, sectorName: e.target.value }))}
                      className="w-full bg-slate-50 border rounded-lg px-2 py-1.5 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Time</label>
                    <input
                      type="text"
                      value={newSchedule.time}
                      onChange={(e) => setNewSchedule(prev => ({ ...prev, time: e.target.value }))}
                      placeholder="e.g., 08:30 AM"
                      className="w-full bg-slate-50 border rounded-lg px-2 py-1.5 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-1 flex items-end">
                    <button
                      type="submit"
                      className="w-full py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded-lg text-xs cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* 3. SECTION: FLEET STATUS & FLIGHT RECORD LOGBOOK */}
      {activeSubTab === "fleet" && (
        <div className="space-y-6">
          
          {/* Fleet card grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DRONE_FLEET.map(drone => (
              <div key={drone.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{drone.name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{drone.payload}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    drone.status === "Ready" ? "bg-emerald-50 text-emerald-700" :
                    drone.status === "Flying" ? "bg-cyan-50 text-cyan-700 animate-pulse" :
                    drone.status === "Charging" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"
                  }`}>
                    {drone.status}
                  </span>
                </div>

                {/* Battery and flight limits */}
                <div className="space-y-2 text-xs font-semibold">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Battery Capacity:</span>
                    <span className="text-slate-800 font-extrabold flex items-center gap-1">
                      <Battery className="h-4.5 w-4.5 text-emerald-600" />
                      {drone.battery}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Max Flight Duration:</span>
                    <span className="text-slate-800">{drone.maxFlightTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Telemetry Range Limit:</span>
                    <span className="text-slate-800">{drone.rangeLimit}</span>
                  </div>
                </div>

                {/* Vehicle Diagnostics */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Self-Diagnostics Board</p>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="block text-slate-400">Prop Motors:</span>
                      <span className="font-extrabold text-slate-700">{drone.health.motors}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400">GPS Link:</span>
                      <span className="font-extrabold text-slate-700">{drone.health.gps}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400">Wi-Fi Telemetry:</span>
                      <span className="font-extrabold text-slate-700">{drone.health.wifi}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400">Sensor Payload:</span>
                      <span className="font-extrabold text-slate-700">{drone.health.camera}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Logbook past records */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Logs List */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
                <Gauge className="h-4 w-4 text-cyan-600" />
                GPS Flight Log Registry
              </h3>
              
              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {flightLogs.map(log => (
                  <button
                    key={log.id}
                    onClick={() => setSelectedLogId(log.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                      selectedLogId === log.id
                        ? "bg-slate-900 border-slate-950 text-white"
                        : "border-slate-150 hover:bg-slate-50 text-slate-600 bg-white"
                    }`}
                  >
                    <div>
                      <p className={`font-extrabold text-xs ${selectedLogId === log.id ? "text-cyan-300" : "text-slate-800"}`}>
                        {log.droneName}
                      </p>
                      <p className={`text-[9px] mt-0.5 ${selectedLogId === log.id ? "text-slate-400" : "text-slate-400"}`}>
                        {log.date}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Log Telemetry charts */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-cyan-600" />
                  Telemetry Flight Graphs & Data Playback
                </h3>
                <button 
                  onClick={() => alert("Downloading flight-path GeoJSON logs bundle...")}
                  className="px-2.5 py-1 text-[10px] font-bold border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" /> GeoJSON
                </button>
              </div>

              {activeLog ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-semibold">
                    <div className="bg-slate-50 p-3 rounded-xl border">
                      <span className="text-[9px] text-slate-400 block uppercase">Flight Duration</span>
                      <span className="text-sm font-extrabold text-slate-800 block mt-0.5">{activeLog.durationMins} minutes</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border">
                      <span className="text-[9px] text-slate-400 block uppercase">Average NDVI Registered</span>
                      <span className="text-sm font-extrabold text-emerald-700 block mt-0.5">{activeLog.averageNdvi} (Optimal)</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border">
                      <span className="text-[9px] text-slate-400 block uppercase">Anomalies Logged</span>
                      <span className="text-sm font-extrabold text-rose-600 block mt-0.5 truncate" title={activeLog.anomalyDetected}>{activeLog.anomalyDetected}</span>
                    </div>
                  </div>

                  {/* Recharts graph plot */}
                  <div className="p-2 bg-slate-50 border rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase p-2 mb-2">Altitude & Battery Drain Profile</p>
                    <div className="h-[220px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={activeLog.telemetryData}>
                          <defs>
                            <linearGradient id="colorAlt" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorBatt" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="time" label={{ value: "Waypoint Seq", position: "insideBottom", offset: -5 }} />
                          <YAxis />
                          <Tooltip />
                          <Legend verticalAlign="top" height={36}/>
                          <Area type="monotone" dataKey="altitude" stroke="#06b6d4" fillOpacity={1} fill="url(#colorAlt)" name="Altitude (m)" />
                          <Area type="monotone" dataKey="battery" stroke="#ef4444" fillOpacity={1} fill="url(#colorBatt)" name="Battery (%)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400">
                  Select a past flight log to inspect telemetry charts
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
