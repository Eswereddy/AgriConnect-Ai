import React, { useState, useMemo, useRef, useEffect } from "react";
import * as d3 from "d3";
import { motion, AnimatePresence } from "motion/react";
import {
  Map,
  Compass,
  Maximize2,
  Minimize2,
  RefreshCw,
  Sparkles,
  Info,
  Layers,
  Sprout,
  Droplets,
  Flame,
  LineChart,
  HelpCircle,
  MapPin,
  ChevronRight,
  TrendingUp,
  Sliders,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

interface SectorData {
  id: string;
  name: string;
  cropName: string;
  cropVariety: string;
  moisture: number;
  temp: number;
  healthStatus: "Optimal" | "Warning" | "Critical";
  area: number;
}

interface CropYieldGeospatialHeatmapProps {
  activeFarmName: string;
  sectors: SectorData[];
}

// Map layer view options
type HeatmapMetric = "yield" | "moisture" | "npk" | "temp";

export default function CropYieldGeospatialHeatmap({
  activeFarmName,
  sectors
}: CropYieldGeospatialHeatmapProps) {
  const [activeMetric, setActiveMetric] = useState<HeatmapMetric>("yield");
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  
  // Interactive View Controls
  const [zoomScale, setZoomScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Overlay Toggles
  const [showContours, setShowContours] = useState(true);
  const [showGridPoints, setShowGridPoints] = useState(false);
  const [showGPSPin, setShowGPSPin] = useState(true);

  // Simulated GPS Location Pin coordinates
  const [gpsPin, setGpsPin] = useState({ x: 200, y: 150 });
  const [isDraggingPin, setIsDraggingPin] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Auto-select first sector on farm change
  useEffect(() => {
    if (sectors && sectors.length > 0) {
      setSelectedSectorId(sectors[0].id);
    } else {
      setSelectedSectorId(null);
    }
  }, [activeFarmName, sectors]);

  // Generate stable coordinates and vertices for each plot based on the active farm name
  const plotLayouts = useMemo(() => {
    // We will generate unique plot shapes (polygons) depending on the number of sectors and farm name
    const count = sectors.length;
    const layouts = [];

    // Base viewBox is 400x300
    if (activeFarmName.includes("Himalayan") || count === 3) {
      // Terrace contours (curved terraces)
      layouts.push({
        id: sectors[0]?.id || "sec-1",
        points: "40,40 360,40 340,110 60,110",
        colorClass: "fill-emerald-100",
        center: { x: 200, y: 75 }
      });
      layouts.push({
        id: sectors[1]?.id || "sec-2",
        points: "60,110 340,110 310,190 90,190",
        colorClass: "fill-emerald-200",
        center: { x: 200, y: 150 }
      });
      if (sectors[2]) {
        layouts.push({
          id: sectors[2].id,
          points: "90,190 310,190 280,260 120,260",
          colorClass: "fill-emerald-300",
          center: { x: 200, y: 225 }
        });
      }
    } else if (activeFarmName.includes("Deccan") || count === 4) {
      // 4 neat tilled rectangular plots separated by narrow tracks
      layouts.push({
        id: sectors[0]?.id || "sec-1",
        points: "40,40 190,40 180,135 40,135",
        center: { x: 112, y: 88 }
      });
      layouts.push({
        id: sectors[1]?.id || "sec-2",
        points: "210,40 360,40 360,135 220,135",
        center: { x: 288, y: 88 }
      });
      layouts.push({
        id: sectors[2]?.id || "sec-3",
        points: "40,155 180,155 170,260 40,260",
        center: { x: 108, y: 208 }
      });
      if (sectors[3]) {
        layouts.push({
          id: sectors[3].id,
          points: "220,155 360,155 360,260 230,260",
          center: { x: 292, y: 208 }
        });
      }
    } else {
      // General fall-back layout - concentric bento layout
      layouts.push({
        id: sectors[0]?.id || "sec-1",
        points: "30,30 200,30 180,140 30,140",
        center: { x: 110, y: 85 }
      });
      layouts.push({
        id: sectors[1]?.id || "sec-2",
        points: "215,30 370,30 370,140 200,140",
        center: { x: 285, y: 85 }
      });
      if (sectors[2]) {
        layouts.push({
          id: sectors[2].id,
          points: "30,155 180,155 190,270 30,270",
          center: { x: 105, y: 212 }
        });
      }
      if (sectors[3]) {
        layouts.push({
          id: sectors[3].id,
          points: "195,155 370,155 370,270 205,270",
          center: { x: 285, y: 212 }
        });
      }
    }
    return layouts;
  }, [activeFarmName, sectors]);

  // Selected Sector full data object
  const selectedSector = useMemo(() => {
    return sectors.find((s) => s.id === selectedSectorId) || sectors[0] || null;
  }, [sectors, selectedSectorId]);

  // Generate simulated projected metrics based on sector baseline
  const projectedMetrics = useMemo(() => {
    const metricsMap: Record<string, { projectedYield: number; npkRating: number; heatIndex: number }> = {};
    
    let seed = activeFarmName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    sectors.forEach((sec) => {
      // Calculate realistic yields: baseline is area & moisture
      const baseYield = sec.cropName === "Rice Paddy" ? 2.4 :
                        sec.cropName === "Tomato" ? 8.2 :
                        sec.cropName === "Maize" ? 3.9 :
                        sec.cropName === "Wheat" ? 1.9 :
                        sec.cropName === "Coffee" ? 0.95 : 1.5;

      const moistureFactor = sec.moisture > 45 ? 1.15 : sec.moisture > 30 ? 1.0 : 0.75;
      const healthFactor = sec.healthStatus === "Optimal" ? 1.1 : sec.healthStatus === "Warning" ? 0.95 : 0.65;
      
      const finalYield = parseFloat((baseYield * moistureFactor * healthFactor + (random() - 0.5) * 0.2).toFixed(2));
      const finalNpk = Math.round(75 + random() * 40 + (sec.moisture * 0.4));
      const finalHeat = Math.round(sec.temp + (random() - 0.5) * 2);

      metricsMap[sec.id] = {
        projectedYield: finalYield,
        npkRating: finalNpk,
        heatIndex: finalHeat
      };
    });

    return metricsMap;
  }, [activeFarmName, sectors]);

  // Interpolated continuous grid heat points across the 400x300 viewBox
  // This simulates a high-resolution sub-surface geospatial kriging scan
  const heatmapGrid = useMemo(() => {
    const grid: { x: number; y: number; val: number }[] = [];
    const cols = 20;
    const rows = 15;
    const dx = 400 / cols;
    const dy = 300 / rows;

    for (let c = 0; c <= cols; c++) {
      for (let r = 0; r <= rows; r++) {
        const x = c * dx;
        const y = r * dy;

        // Find distance to each sector's center to interpolate value
        let weightedVal = 0;
        let totalWeight = 0;

        plotLayouts.forEach((layout) => {
          const distSq = Math.pow(x - layout.center.x, 2) + Math.pow(y - layout.center.y, 2);
          const weight = 1 / (distSq + 1200); // Inverse distance squared smoothing

          // Fetch the core metric value for this sector
          const metrics = projectedMetrics[layout.id];
          let sourceVal = 50;

          if (metrics) {
            if (activeMetric === "yield") {
              // Scale yield to 10-100 range
              sourceVal = (metrics.projectedYield / 10) * 100;
            } else if (activeMetric === "moisture") {
              const sec = sectors.find((s) => s.id === layout.id);
              sourceVal = sec ? sec.moisture : 50;
            } else if (activeMetric === "npk") {
              sourceVal = (metrics.npkRating / 150) * 100;
            } else if (activeMetric === "temp") {
              sourceVal = ((metrics.heatIndex - 15) / 25) * 100;
            }
          }

          weightedVal += sourceVal * weight;
          totalWeight += weight;
        });

        const interpolatedVal = weightedVal / (totalWeight || 1);
        grid.push({ x, y, val: Math.max(10, Math.min(100, Math.round(interpolatedVal))) });
      }
    }
    return grid;
  }, [plotLayouts, projectedMetrics, activeMetric, sectors]);

  // Color interpolators based on active metric
  const colorScale = useMemo(() => {
    if (activeMetric === "yield") {
      // Emerald green (high yield) to pale lime to soft amber (poor yield)
      return d3.scaleSequential()
        .domain([10, 100])
        .interpolator(d3.interpolateYlGn);
    } else if (activeMetric === "moisture") {
      // Sky blue/deep ocean (wet) to sandy tan (dry)
      return d3.scaleSequential()
        .domain([10, 100])
        .interpolator(d3.interpolateYlOrBr);
    } else if (activeMetric === "npk") {
      // Deep Purple/Blue (high nutrients) to light grey
      return d3.scaleSequential()
        .domain([10, 100])
        .interpolator(d3.interpolateBuPu);
    } else {
      // Infrared warm/thermal (red to yellow to cooling blue)
      return d3.scaleSequential()
        .domain([10, 100])
        .interpolator(d3.interpolateCool);
    }
  }, [activeMetric]);

  // AI-powered agronomic advisory based on geospatial yield data
  const geospatialAdvice = useMemo(() => {
    if (sectors.length === 0) return null;
    
    // Find the critical/lowest yield sector
    let lowestSec: SectorData | null = null;
    let minYield = 999;
    
    sectors.forEach((sec) => {
      const metric = projectedMetrics[sec.id];
      if (metric && metric.projectedYield < minYield) {
        minYield = metric.projectedYield;
        lowestSec = sec;
      }
    });

    if (!lowestSec) return null;

    const lowestSecObj: SectorData = lowestSec; // cast to avoid TS issues
    const isRice = lowestSecObj.cropName === "Rice Paddy";
    const metricDetail = projectedMetrics[lowestSecObj.id];

    return {
      sectorName: lowestSecObj.name,
      cropName: lowestSecObj.cropName,
      variety: lowestSecObj.cropVariety,
      projectedYield: minYield,
      issue: lowestSecObj.healthStatus === "Critical" ? "Critical vegetative canopy stress" :
             lowestSecObj.moisture < 30 ? "Severe micro-moisture drought" : "Localized nitrogen leaching",
      remedy: lowestSecObj.moisture < 30 ? 
        `Trigger ${lowestSecObj.name} precision solenoid valve array. Schedule 45-minute sub-surface gate drip to recover soil moisture back to 40%.` :
        `Apply localized 2% liquid zinc-foliar spray and slow-release bio-phosphate pellets to buffer subsoil microbial root activities.`
    };
  }, [sectors, projectedMetrics]);

  // Handle zooming & panning math
  const handleZoomIn = () => setZoomScale((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoomScale((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => {
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
    setGpsPin({ x: 200, y: 150 });
  };

  // Drag handlers for panning the map
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isDraggingPin) return; // ignore if dragging pin
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingPin) {
      // Dragging GPS beacon around
      if (mapContainerRef.current) {
        const rect = mapContainerRef.current.getBoundingClientRect();
        // project mouse inside viewBox coords
        const relativeX = ((e.clientX - rect.left) / rect.width) * 400;
        const relativeY = ((e.clientY - rect.top) / rect.height) * 300;
        setGpsPin({
          x: Math.max(10, Math.min(390, relativeX)),
          y: Math.max(10, Math.min(290, relativeY))
        });
      }
      return;
    }
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsDraggingPin(false);
  };

  // Find the closest sector to the draggable GPS beacon pin to auto-display localized telemetry
  const closestSectorToGps = useMemo(() => {
    let closestId = sectors[0]?.id || null;
    let minDist = 999999;

    plotLayouts.forEach((layout) => {
      const dist = Math.pow(gpsPin.x - layout.center.x, 2) + Math.pow(gpsPin.y - layout.center.y, 2);
      if (dist < minDist) {
        minDist = dist;
        closestId = layout.id;
      }
    });

    return sectors.find((s) => s.id === closestId) || null;
  }, [gpsPin, plotLayouts, sectors]);

  return (
    <div
      id="geospatial-crop-yield-heatmap"
      className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6 text-slate-800"
    >
      {/* Upper Title Header Panel */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5 text-indigo-600 animate-spin" /> Advanced GIS Cartography
          </span>
          <h2 className="text-slate-900 text-lg font-black uppercase tracking-tight mt-1.5 flex items-center gap-2">
            🛰️ Geospatial Yield Heatmap & Contour Laboratory
          </h2>
          <p className="text-slate-500 text-xs font-semibold">
            High-precision multi-spectral GIS mapping showing sub-surface moisture matrices and interpolated crop yield boundaries.
          </p>
        </div>

        {/* Metric Layer Toggles */}
        <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1 gap-1 w-full xl:w-auto">
          <button
            onClick={() => setActiveMetric("yield")}
            className={`flex-1 xl:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeMetric === "yield"
                ? "bg-white text-emerald-700 shadow-xs border border-slate-150"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Sprout className="h-3.5 w-3.5" /> Yield Est
          </button>
          <button
            onClick={() => setActiveMetric("moisture")}
            className={`flex-1 xl:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeMetric === "moisture"
                ? "bg-white text-sky-700 shadow-xs border border-slate-150"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Droplets className="h-3.5 w-3.5" /> Moisture
          </button>
          <button
            onClick={() => setActiveMetric("npk")}
            className={`flex-1 xl:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeMetric === "npk"
                ? "bg-white text-indigo-700 shadow-xs border border-slate-150"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Layers className="h-3.5 w-3.5" /> Nutrients (N)
          </button>
          <button
            onClick={() => setActiveMetric("temp")}
            className={`flex-1 xl:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeMetric === "temp"
                ? "bg-white text-rose-700 shadow-xs border border-slate-150"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Flame className="h-3.5 w-3.5" /> Thermal
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: INTERACTIVE MAP & CONTROL TOOLS (col-span-8) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Map Utility Toolbar Overlay */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200 p-3 rounded-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Layer Overlays:</span>
              <button
                onClick={() => setShowContours(!showContours)}
                className={`px-3 py-1 rounded-lg text-[10.5px] font-bold transition-colors cursor-pointer border ${
                  showContours ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-white border-slate-200 text-slate-500"
                }`}
              >
                Thermal Contours
              </button>
              <button
                onClick={() => setShowGridPoints(!showGridPoints)}
                className={`px-3 py-1 rounded-lg text-[10.5px] font-bold transition-colors cursor-pointer border ${
                  showGridPoints ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-white border-slate-200 text-slate-500"
                }`}
              >
                Kriging Sensors
              </button>
              <button
                onClick={() => setShowGPSPin(!showGPSPin)}
                className={`px-3 py-1 rounded-lg text-[10.5px] font-bold transition-colors cursor-pointer border ${
                  showGPSPin ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-white border-slate-200 text-slate-500"
                }`}
              >
                GPS Beacon Pin
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
              <button
                onClick={handleZoomOut}
                className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 cursor-pointer"
                title="Zoom Out"
              >
                <Minimize2 className="h-3.5 w-3.5" />
              </button>
              <span className="text-[10px] font-mono text-slate-600 px-1 font-extrabold">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 cursor-pointer"
                title="Zoom In"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 cursor-pointer ml-1"
                title="Reset View"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Map Viewer Port Frame */}
          <div
            ref={mapContainerRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden relative min-h-[380px] shadow-inner select-none flex items-center justify-center cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
          >
            {/* Visual Topography Scale Indicator */}
            <div className="absolute top-4 left-4 z-20 bg-slate-950/80 border border-slate-800/80 p-2.5 rounded-xl text-[9px] font-mono font-black space-y-1 text-slate-300">
              <span className="text-[8.5px] uppercase tracking-wider text-indigo-400 block font-bold">Spectral Scale</span>
              <div className="w-24 h-2 bg-gradient-to-r from-yellow-100 to-emerald-900 rounded" />
              <div className="flex justify-between text-[8px] text-slate-400 font-bold">
                <span>Low</span>
                <span>Optimal</span>
              </div>
            </div>

            {/* Active Legend Card overlay */}
            <div className="absolute bottom-4 left-4 z-20 bg-slate-950/90 border border-slate-800 p-2.5 rounded-xl flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <div className="text-[9.5px]">
                <span className="text-white font-black block uppercase tracking-wide">
                  {activeFarmName}
                </span>
                <span className="text-slate-400 font-semibold">
                  Projection Matrix: {activeMetric.toUpperCase()}
                </span>
              </div>
            </div>

            {/* DRAGGABLE GPS BEACON TELEMETRY OVERLAY */}
            {showGPSPin && closestSectorToGps && (
              <div className="absolute top-4 right-4 z-20 bg-slate-950/95 border border-slate-800 p-3 rounded-xl max-w-[200px] text-[10px] text-slate-300 space-y-1.5 shadow-xl animate-in fade-in duration-300 pointer-events-none">
                <span className="text-indigo-400 font-black uppercase tracking-wider flex items-center gap-1 text-[8.5px]">
                  <MapPin className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
                  Beacon Spot Scanner
                </span>
                <div className="border-t border-slate-800/80 pt-1.5 space-y-1 font-semibold">
                  <span className="text-white block font-bold text-[10.5px] truncate">{closestSectorToGps.name}</span>
                  <div className="flex justify-between">
                    <span>Moisture:</span>
                    <span className="font-mono text-emerald-400 font-bold">{closestSectorToGps.moisture}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Temp:</span>
                    <span className="font-mono text-amber-400 font-bold">{closestSectorToGps.temp}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Yield Est:</span>
                    <span className="font-mono text-indigo-400 font-bold">
                      {projectedMetrics[closestSectorToGps.id]?.projectedYield} t/ac
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* MAIN MAP SVG CONTAINER */}
            <svg
              viewBox="0 0 400 300"
              className="w-full max-w-[500px] h-full object-contain pointer-events-auto"
              style={{
                transform: `scale(${zoomScale}) translate(${panOffset.x / zoomScale}px, ${panOffset.y / zoomScale}px)`,
                transition: isDragging ? "none" : "transform 0.15s ease-out"
              }}
            >
              <defs>
                {/* Hatch pattern for healthy status */}
                <pattern id="diagonalHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="2" />
                </pattern>
                
                {/* Satellite topographical grid dots */}
                <pattern id="satGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="rgba(255, 255, 255, 0.1)" />
                </pattern>
              </defs>

              {/* Grid backdrop */}
              <rect width="400" height="300" fill="url(#satGrid)" />

              {/* KRIGING HEATMAP LAYER: Renders continuous cells inside plots */}
              {showContours && (
                <g id="heatmap-kriging-layer" className="opacity-75">
                  {heatmapGrid.map((pt, idx) => {
                    const cellColor = colorScale(pt.val);
                    return (
                      <rect
                        key={idx}
                        x={pt.x - 10}
                        y={pt.y - 10}
                        width="20"
                        height="20"
                        fill={cellColor}
                        className="transition-colors duration-500"
                        style={{ mixBlendMode: "screen" }}
                      />
                    );
                  })}
                </g>
              )}

              {/* INDIVIDUAL SECTOR BOUNDARIES (POLYGONS) */}
              <g id="sectors-boundary-layer">
                {plotLayouts.map((layout) => {
                  const sec = sectors.find((s) => s.id === layout.id);
                  const isSelected = selectedSectorId === layout.id;
                  
                  return (
                    <polygon
                      key={layout.id}
                      points={layout.points}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSectorId(layout.id);
                      }}
                      className={`cursor-pointer transition-all duration-300 stroke-2 stroke-slate-700/60 ${
                        isSelected 
                          ? "fill-slate-800/10 stroke-indigo-400 stroke-4" 
                          : "fill-transparent hover:fill-slate-700/10 hover:stroke-slate-400"
                      }`}
                    />
                  );
                })}
              </g>

              {/* SECTOR CENTER GRAPHICAL PIN & LABEL TEXT */}
              <g id="sector-labels-layer">
                {plotLayouts.map((layout) => {
                  const sec = sectors.find((s) => s.id === layout.id);
                  if (!sec) return null;

                  return (
                    <g key={layout.id} transform={`translate(${layout.center.x}, ${layout.center.y})`} className="pointer-events-none">
                      <circle r="4" fill="#1e293b" stroke="#ffffff" strokeWidth="1" />
                      <rect
                        x="-45"
                        y="-22"
                        width="90"
                        height="14"
                        rx="3"
                        fill="rgba(15, 23, 42, 0.85)"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="0.5"
                      />
                      <text
                        y="-12"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="6"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {sec.name.split("-")[0].trim()}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* KRIGING GRID DOTS */}
              {showGridPoints && (
                <g id="sensor-nodes-layer">
                  {heatmapGrid.map((pt, idx) => (
                    <circle
                      key={idx}
                      cx={pt.x}
                      cy={pt.y}
                      r="1.5"
                      fill="#ffffff"
                      opacity="0.3"
                    />
                  ))}
                </g>
              )}

              {/* DRAGGABLE GPS BEACON PIN (SVG ELEMENT) */}
              {showGPSPin && (
                <g
                  id="draggable-gps-beacon"
                  transform={`translate(${gpsPin.x}, ${gpsPin.y})`}
                  className="cursor-move"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setIsDraggingPin(true);
                  }}
                >
                  {/* Rippling ping circle */}
                  <circle r="12" fill="#6366f1" className="animate-ping" opacity="0.4" />
                  {/* Pin body */}
                  <path
                    d="M 0 0 C -4 -12, 4 -12, 0 0"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    fill="#4338ca"
                  />
                  <circle r="5" fill="#4f46e5" stroke="#ffffff" strokeWidth="1" />
                  <circle r="2" fill="#a5b4fc" />
                </g>
              )}
            </svg>

            {/* Instruction tooltip overlay */}
            <div className="absolute top-4 inset-x-1/2 -translate-x-1/2 pointer-events-none bg-slate-950/80 border border-slate-800 text-[9px] text-slate-300 font-black tracking-wider uppercase px-3 py-1.5 rounded-full flex items-center gap-1.5 w-max">
              <Info className="h-3.5 w-3.5 text-indigo-400" />
              Click plots to view yield logs • Drag GPS Pin
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAIL PANEL SIDEBAR (col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Section Detail Card */}
          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-5">
            {selectedSector ? (
              <div className="space-y-4">
                
                {/* Header detail */}
                <div className="border-b border-slate-200/60 pb-3">
                  <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-400">Selected GIS Sector</span>
                  <h3 className="text-slate-900 font-black text-sm uppercase mt-0.5">{selectedSector.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Sprout className="h-3.5 w-3.5 text-emerald-600" />
                      {selectedSector.cropName} ({selectedSector.cropVariety})
                    </span>
                  </div>
                </div>

                {/* Spectral metrics log */}
                <div className="space-y-3.5">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">GIS Crop Yield Predictions</span>

                  {/* Yield metric */}
                  <div className="flex items-center justify-between p-3 bg-white border border-slate-150 rounded-xl">
                    <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
                      <Sprout className="h-4 w-4 text-emerald-600" />
                      <div>
                        <span>Estimated Yield</span>
                        <span className="text-[9px] text-slate-400 block font-normal">Calculated via multi-spectral t/ac</span>
                      </div>
                    </div>
                    <span className="font-mono font-black text-slate-800 text-sm">
                      {projectedMetrics[selectedSector.id]?.projectedYield} Tons/Ac
                    </span>
                  </div>

                  {/* Soil moisture status */}
                  <div className="flex items-center justify-between p-3 bg-white border border-slate-150 rounded-xl">
                    <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
                      <Droplets className="h-4 w-4 text-sky-600" />
                      <div>
                        <span>Moisture Index</span>
                        <span className="text-[9px] text-slate-400 block font-normal">Sub-surface dielectric value</span>
                      </div>
                    </div>
                    <span className="font-mono font-black text-slate-800 text-sm">
                      {selectedSector.moisture}%
                    </span>
                  </div>

                  {/* Nutrient rating */}
                  <div className="flex items-center justify-between p-3 bg-white border border-slate-150 rounded-xl">
                    <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
                      <Layers className="h-4 w-4 text-indigo-600" />
                      <div>
                        <span>NPK Nitrogen Index</span>
                        <span className="text-[9px] text-slate-400 block font-normal">Active root-zone density</span>
                      </div>
                    </div>
                    <span className="font-mono font-black text-slate-800 text-sm">
                      {projectedMetrics[selectedSector.id]?.npkRating} mg/kg
                    </span>
                  </div>

                  {/* Thermal surface temperature */}
                  <div className="flex items-center justify-between p-3 bg-white border border-slate-150 rounded-xl">
                    <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
                      <Flame className="h-4 w-4 text-rose-600" />
                      <div>
                        <span>Surface Thermal</span>
                        <span className="text-[9px] text-slate-400 block font-normal">Thermal canopy feedback</span>
                      </div>
                    </div>
                    <span className="font-mono font-black text-slate-800 text-sm">
                      {projectedMetrics[selectedSector.id]?.heatIndex}°C
                    </span>
                  </div>
                </div>

                {/* Acreage and Harvest timelines */}
                <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-[10.5px] text-indigo-950 font-bold space-y-1.5">
                  <div className="flex justify-between border-b border-indigo-100/50 pb-1.5">
                    <span>Active Plot Acreage:</span>
                    <span className="font-mono">{selectedSector.area} Acres</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Harvest Date:</span>
                    <span className="font-mono">Mid-October 2026</span>
                  </div>
                </div>

              </div>
            ) : (
              <p className="text-xs font-bold text-slate-400 text-center py-10">Select a GIS Sector plot on the map to inspect projected yields.</p>
            )}
          </div>

          {/* AI DECISION ADVISORY FOR CROP YIELDS */}
          {geospatialAdvice && (
            <div className="bg-gradient-to-br from-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3.5 text-white shadow-md animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-indigo-400 animate-pulse" />
                <h3 className="text-xs font-black uppercase text-indigo-300 tracking-wider">
                  GIS Yield Optimization Advisory
                </h3>
              </div>

              <div className="space-y-2 text-xs font-medium">
                <span className="text-slate-300 text-[11px] leading-relaxed block">
                  Geospatial anomalies spotted in <span className="text-white font-extrabold">{geospatialAdvice.sectorName}</span> (Lowest Yield: {geospatialAdvice.projectedYield} t/ac).
                </span>

                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-[10px] space-y-1 font-semibold text-slate-400">
                  <span className="text-rose-400 block font-bold uppercase text-[9px] flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Identified Issue:
                  </span>
                  <span>"{geospatialAdvice.issue}"</span>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-[10px] space-y-1 font-semibold text-slate-400">
                  <span className="text-emerald-400 block font-bold uppercase text-[9px] flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Recommended Remediation:
                  </span>
                  <p className="leading-relaxed">
                    {geospatialAdvice.remedy}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
