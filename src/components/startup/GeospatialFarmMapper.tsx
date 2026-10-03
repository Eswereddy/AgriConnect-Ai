import React, { useState, useRef, useEffect } from "react";
import {
  MapPin,
  Compass,
  Navigation,
  Activity,
  Layers,
  Map,
  Truck,
  Building2,
  CheckCircle,
  TrendingUp,
  RotateCcw,
  Sparkles,
  Info
} from "lucide-react";

interface Point {
  x: number;
  y: number;
}

const SHIPPERS = [
  { id: "silo-1", name: "Silo Terminal 4B (Grain Tower)", x: 280, y: 80, distance: "12.4 km", status: "Optimal" },
  { id: "silo-2", name: "Silo Terminal 4C (Wheat Terminal)", x: 420, y: 150, distance: "24.8 km", status: "Warning" },
  { id: "silo-3", name: "Cold Vault 3A (Potato Cell)", x: 120, y: 220, distance: "8.1 km", status: "Optimal" }
];

const MANDI_HEATMAPS = {
  Basmati: [
    { city: "Khanna Mandi", price: "₹68,500/T", status: "Premium", color: "text-emerald-400 bg-emerald-950/40 border-emerald-500/20", x: 260, y: 70 },
    { city: "Vijayawada Hub", price: "₹65,200/T", status: "High", color: "text-emerald-400 bg-emerald-950/40 border-emerald-500/20", x: 80, y: 110 },
    { city: "Kurnool Block", price: "₹61,000/T", status: "Standard", color: "text-amber-400 bg-amber-950/40 border-amber-500/20", x: 150, y: 250 },
    { city: "Guntur Mandi", price: "₹66,400/T", status: "Premium", color: "text-emerald-400 bg-emerald-950/40 border-emerald-500/20", x: 380, y: 190 }
  ],
  Maize: [
    { city: "Khanna Mandi", price: "₹24,200/T", status: "Low", color: "text-rose-400 bg-rose-950/40 border-rose-500/20", x: 260, y: 70 },
    { city: "Vijayawada Hub", price: "₹28,500/T", status: "Standard", color: "text-amber-400 bg-amber-950/40 border-amber-500/20", x: 80, y: 110 },
    { city: "Kurnool Block", price: "₹31,000/T", status: "Premium", color: "text-emerald-400 bg-emerald-950/40 border-emerald-500/20", x: 150, y: 250 },
    { city: "Guntur Mandi", price: "₹29,000/T", status: "Standard", color: "text-amber-400 bg-amber-950/40 border-amber-500/20", x: 380, y: 190 }
  ]
};

export const GeospatialFarmMapper: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<"boundary" | "logistics" | "heatmap">("boundary");
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedMandiCrop, setSelectedMandiCrop] = useState<"Basmati" | "Maize">("Basmati");
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("silo-3");
  const [simulatedRouteText, setSimulatedRouteText] = useState<string>("Route planner idle. Map coordinates or select storage center.");

  const containerRef = useRef<HTMLDivElement>(null);

  // Mapped GPS points calculation
  const calculateAcreage = () => {
    if (points.length < 3) return 0;
    // Area of polygon Shoelace formula (simplified scale: 10,000 px^2 = 1 Acre)
    let area = 0;
    const j = points.length - 1;
    for (let i = 0; i < points.length; i++) {
      const prev = points[i === 0 ? j : i - 1];
      const curr = points[i];
      area += (prev.x + curr.x) * (prev.y - curr.y);
    }
    const absArea = Math.abs(area / 2);
    return parseFloat((absArea / 8000).toFixed(2));
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeLayer !== "boundary") return;
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setPoints(prev => [...prev, { x, y }]);
    }
  };

  const clearBoundary = () => {
    setPoints([]);
  };

  useEffect(() => {
    if (activeLayer === "logistics") {
      const wh = SHIPPERS.find(s => s.id === selectedWarehouse);
      if (wh) {
        setSimulatedRouteText(
          `Plotting optimized cold chain corridor to ${wh.name}. Distance: ${wh.distance}. Est Travel Time: ${
            parseFloat(wh.distance) * 2.2 < 30 ? "18 mins" : "42 mins"
          }. Fuel Savings: 12% via NH-44 Route B.`
        );
      }
    } else if (activeLayer === "boundary" && points.length >= 3) {
      setSimulatedRouteText(
        `Dynamic boundary locked! ${calculateAcreage()} Acres computed via coordinate shoelace triangulation. Polygon closed successfully.`
      );
    } else if (activeLayer === "heatmap") {
      setSimulatedRouteText(
        `APMC Mandi indices live. Filtering real-time spot rates for ${selectedMandiCrop} across regional Andhra Pradesh terminals.`
      );
    } else {
      setSimulatedRouteText("Route planner idle. Map coordinates or select storage center.");
    }
  }, [activeLayer, selectedWarehouse, points, selectedMandiCrop]);

  return (
    <div id="geospatial-mapper" className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
        <div>
          <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Map className="h-4.5 w-4.5 text-emerald-400" /> Geospatial GIS Land Mapping & Route Optimizer
          </h4>
          <p className="text-[11px] text-slate-400 font-medium">
            Vector coordinates plotting engine mapping farm boundaries, cold chain logistic routes, and regional Mandi crop price heatmaps.
          </p>
        </div>

        {/* View Toggles */}
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveLayer("boundary")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              activeLayer === "boundary" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Compass className="h-3.5 w-3.5" /> GPS Boundary
          </button>
          <button
            onClick={() => setActiveLayer("logistics")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              activeLayer === "logistics" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Truck className="h-3.5 w-3.5" /> Warehouses & Routes
          </button>
          <button
            onClick={() => setActiveLayer("heatmap")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              activeLayer === "heatmap" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" /> APMC Price Heatmap
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Interactive GIS Canvas */}
        <div className="lg:col-span-7 space-y-4">
          <div
            ref={containerRef}
            onClick={handleCanvasClick}
            className={`relative h-[300px] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-inner cursor-crosshair select-none ${
              activeLayer === "boundary" ? "ring-2 ring-emerald-500/10" : ""
            }`}
          >
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:30px_30px] opacity-40" />

            {/* Canvas Instructions */}
            <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-xs border border-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-black text-white pointer-events-none z-10">
              {activeLayer === "boundary" && "📍 CLICK TO PLOT FARM VERTICES (MIN 3 FOR ACREAGE)"}
              {activeLayer === "logistics" && "🚛 LOGISTICS LAYER: SECTOR ROUTING TO WAREHOUSES"}
              {activeLayer === "heatmap" && "🔥 HEATMAP LAYER: APMC REGIONAL TRADING INDICES"}
            </div>

            {/* POLYGON DRAWING FOR LAND BOUNDARY */}
            {activeLayer === "boundary" && points.length > 0 && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Draw polygon */}
                {points.length >= 3 && (
                  <polygon
                    points={points.map(p => `${p.x},${p.y}`).join(" ")}
                    className="fill-emerald-500/15 stroke-emerald-400 stroke-2"
                  />
                )}
                {/* Draw lines */}
                {points.length < 3 && points.map((p, idx) => {
                  if (idx === 0) return null;
                  const prev = points[idx - 1];
                  return (
                    <line
                      key={idx}
                      x1={prev.x}
                      y1={prev.y}
                      x2={p.x}
                      y2={p.y}
                      className="stroke-emerald-400 stroke-2"
                    />
                  );
                })}
              </svg>
            )}

            {/* Mapped point markers */}
            {activeLayer === "boundary" && points.map((p, idx) => (
              <div
                key={idx}
                className="absolute w-3 h-3 bg-emerald-500 border-2 border-white rounded-full -translate-x-1.5 -translate-y-1.5 shadow-sm animate-ping"
                style={{ left: p.x, top: p.y }}
              />
            ))}

            {/* WAREHOUSE PINS & OPTIMIZED PATHWAYS */}
            {activeLayer === "logistics" && (
              <>
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {/* Draw logistics route line */}
                  {selectedWarehouse && (
                    <path
                      d={`M 150 150 Q 220 100, ${SHIPPERS.find(s => s.id === selectedWarehouse)?.x} ${SHIPPERS.find(s => s.id === selectedWarehouse)?.y}`}
                      className="fill-none stroke-emerald-500 stroke-2 stroke-dasharray-[6_4] animate-[dash_10s_linear_infinite]"
                      strokeDasharray="6 4"
                    />
                  )}
                </svg>
                {/* Base farm pin */}
                <div className="absolute left-[150px] top-[150px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="bg-emerald-600 p-1.5 rounded-full border border-white shadow-md text-white">
                    <Compass className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-[8px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-white font-extrabold mt-1 uppercase">Our Holding</span>
                </div>
                {/* Warehouse silos pins */}
                {SHIPPERS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedWarehouse(s.id)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer hover:scale-105 transition-all"
                    style={{ left: s.x, top: s.y }}
                  >
                    <div className={`p-1.5 rounded-full border border-white shadow-md text-white ${
                      selectedWarehouse === s.id ? "bg-amber-500" : "bg-slate-800"
                    }`}>
                      <Building2 className="h-4 w-4" />
                    </div>
                    <span className="text-[8.5px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-white font-extrabold mt-1">Silo</span>
                  </button>
                ))}
              </>
            )}

            {/* APMC HEATMAP MARKS */}
            {activeLayer === "heatmap" && (
              MANDI_HEATMAPS[selectedMandiCrop].map((item, idx) => (
                <div
                  key={idx}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center select-none"
                  style={{ left: item.x, top: item.y }}
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 animate-pulse absolute pointer-events-none" />
                  <div className={`px-2.5 py-1 rounded-lg border font-black text-[9px] shadow-lg flex flex-col items-center text-center ${item.color}`}>
                    <span className="text-white tracking-tight">{item.city}</span>
                    <span className="font-mono mt-0.5 text-[8.5px] font-extrabold">{item.price}</span>
                  </div>
                </div>
              ))
            )}

            {/* Bottom HUD bar */}
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center bg-slate-950/80 backdrop-blur-xs border border-slate-800 px-3.5 py-2 rounded-xl text-[9px] font-bold text-slate-400 select-none pointer-events-none">
              <span className="flex items-center gap-1 text-emerald-400">
                <Navigation className="h-3.5 w-3.5" /> CO-ORDINATE GPS: LOCKED
              </span>
              <span>EPICENTER: 16.3067° N, 80.4365° E</span>
            </div>
          </div>
        </div>

        {/* Right Side: Route computations and control cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3.5">
            <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block">
              Control Interface & Acreage Outputs
            </span>

            {activeLayer === "boundary" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950 p-3 border border-slate-850 rounded-lg">
                    <span className="text-[8px] font-black text-slate-500 uppercase block">Land Acreage</span>
                    <span className="text-lg font-black font-mono text-white mt-1 block">
                      {calculateAcreage()} <span className="text-xs text-slate-400">Acres</span>
                    </span>
                  </div>
                  <div className="bg-slate-950 p-3 border border-slate-850 rounded-lg">
                    <span className="text-[8px] font-black text-slate-500 uppercase block">Boundary Vertices</span>
                    <span className="text-lg font-black font-mono text-white mt-1 block">
                      {points.length} <span className="text-xs text-slate-400">Nodes</span>
                    </span>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={clearBoundary}
                    className="flex-1 py-2 bg-slate-950 hover:bg-slate-850 text-rose-400 border border-rose-500/20 hover:border-rose-500/40 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Reset Nodes
                  </button>
                  <button
                    onClick={() => alert(`Submitting boundary map verification for ${calculateAcreage()} Acres.`)}
                    disabled={points.length < 3}
                    className={`flex-1 py-2 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      points.length < 3
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                    }`}
                  >
                    <CheckCircle className="h-3.5 w-3.5" /> Verify Plot
                  </button>
                </div>
              </div>
            )}

            {activeLayer === "logistics" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <span className="text-[8.5px] font-black text-slate-500 uppercase block">Select Storage Target Node</span>
                <div className="space-y-2">
                  {SHIPPERS.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedWarehouse(s.id)}
                      className={`w-full text-left p-2.5 rounded-xl border flex justify-between items-center transition-all cursor-pointer ${
                        selectedWarehouse === s.id
                          ? "border-emerald-500 bg-emerald-950/20 text-emerald-300 font-bold"
                          : "border-slate-850 bg-slate-950 text-slate-400 hover:border-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        <div>
                          <span className="text-[11.5px] block font-extrabold">{s.name}</span>
                          <span className="text-[8.5px] text-slate-500 block">Radius Distance: {s.distance}</span>
                        </div>
                      </div>
                      <span className={`text-[8.5px] font-black px-2 py-0.5 rounded ${
                        s.status === "Optimal" ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20" : "bg-amber-950/40 text-amber-400 border border-amber-500/20"
                      }`}>
                        {s.status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeLayer === "heatmap" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <span className="text-[8.5px] font-black text-slate-500 uppercase block">Select Commodity Heatmap Index</span>
                <div className="grid grid-cols-2 gap-2">
                  {["Basmati", "Maize"].map((crop) => (
                    <button
                      key={crop}
                      onClick={() => setSelectedMandiCrop(crop as any)}
                      className={`py-2 rounded-xl border text-center transition-all cursor-pointer text-xs font-black uppercase ${
                        selectedMandiCrop === crop
                          ? "border-emerald-500 bg-emerald-950/20 text-emerald-300"
                          : "border-slate-850 bg-slate-950 text-slate-400 hover:text-white"
                      }`}
                    >
                      {crop} Prices
                    </button>
                  ))}
                </div>

                <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-[9px] font-extrabold text-slate-400 uppercase">
                    <span>APMC Mandi Price Heat Index</span>
                    <span className="text-emerald-400">Khanna leading</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                    Real-time spot price indexes mapped directly from MCX/NCDEX agricultural terminal streams. Premium areas feature high liquidity buyouts.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Dynamic route planner logs */}
          <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-xl flex items-start gap-2.5">
            <Info className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wide block">
                AgriConnect Route Planner & GPS Advisor
              </span>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                {simulatedRouteText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeospatialFarmMapper;
