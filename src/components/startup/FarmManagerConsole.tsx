import React, { useState, useEffect, useRef } from "react";
import {
  Layers,
  MapPin,
  Trash2,
  Edit3,
  Plus,
  Compass,
  Droplets,
  Activity,
  Calendar,
  Sprout,
  Image as ImageIcon,
  FlaskConical,
  Clock,
  ChevronRight,
  AlertTriangle,
  Waves,
  Map as MapIcon,
  CheckCircle,
  X,
  PlusCircle,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { APIProvider, Map, AdvancedMarker, InfoWindow, Pin, useMap } from "@vis.gl/react-google-maps";

// Helper component to draw polygon boundaries on the Google Map
function PolygonOverlay({ paths, strokeColor, fillColor }: {
  paths: google.maps.LatLngLiteral[];
  strokeColor?: string;
  fillColor?: string;
}) {
  const map = useMap();
  const polygonRef = useRef<google.maps.Polygon | null>(null);

  useEffect(() => {
    if (!map) return;

    const polygon = new google.maps.Polygon({
      paths,
      strokeColor: strokeColor || "#10b981",
      strokeOpacity: 0.8,
      strokeWeight: 2.5,
      fillColor: fillColor || "#34d399",
      fillOpacity: 0.25,
    });

    polygon.setMap(map);
    polygonRef.current = polygon;

    // Center map on polygon center
    if (paths.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      paths.forEach(p => bounds.extend(p));
      map.fitBounds(bounds);
    }

    return () => {
      if (polygonRef.current) {
        polygonRef.current.setMap(null);
      }
    };
  }, [map, JSON.stringify(paths)]);

  return null;
}

// Maps setup key definition
const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  "";

const hasValidKey = Boolean(API_KEY) && API_KEY !== "YOUR_API_KEY";

interface Sector {
  id: string;
  name: string;
  cropName: string;
  cropVariety: string;
  moisture: number;
  temp: number;
  valveStatus: "Open" | "Closed";
  healthStatus: "Optimal" | "Warning" | "Critical";
  area: number;
}

interface FarmLocation {
  id: string;
  name: string;
  role: string;
  location: string;
  totalAcreage: number;
  soilType: string;
  organicMatter: number;
  waterSource: string;
  irrigationType: string;
  healthScore: number;
  baselineTelemetry: {
    soilMoisture: number;
    soilPh: number;
    temperature: number;
    humidity: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  sectors: Sector[];
  // Added fields for 2.2
  latitude?: number;
  longitude?: number;
  farmImage?: string;
  soilTestHistory?: Array<{
    date: string;
    pH: number;
    organicMatter: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  }>;
  activityLog?: Array<{
    id: string;
    date: string;
    action: string;
    category: "irrigation" | "sowing" | "soil" | "maintenance" | "general";
    description: string;
  }>;
}

interface ActiveCrop {
  id: string;
  farmId: string;
  name: string;
  variety: string;
  acreage: number;
  sowingDate: string;
  harvestDate: string;
  stage: string;
  projectedYield: number;
}

interface FarmManagerConsoleProps {
  farms: FarmLocation[];
  selectedFarmId: string;
  cropsList: ActiveCrop[];
  onSelectFarm: (id: string) => void;
  onAddFarm: (farm: FarmLocation) => void;
  onEditFarm: (id: string, updated: FarmLocation) => void;
  onDeleteFarm: (id: string) => void;
}

export default function FarmManagerConsole({
  farms,
  selectedFarmId,
  cropsList,
  onSelectFarm,
  onAddFarm,
  onEditFarm,
  onDeleteFarm
}: FarmManagerConsoleProps) {
  const activeFarm = farms.find((f) => f.id === selectedFarmId) || farms[0];
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form Fields State
  const [farmName, setFarmName] = useState("");
  const [landSize, setLandSize] = useState("");
  const [soilType, setSoilType] = useState("Loamy");
  const [soilPh, setSoilPh] = useState("6.5");
  const [waterSource, setWaterSource] = useState("Borewell");
  const [irrigationType, setIrrigationType] = useState("Drip");
  const [farmImage, setFarmImage] = useState<string>("");
  const [imageName, setImageName] = useState("");
  const [addressLocation, setAddressLocation] = useState("");
  
  // GPS Coordinates - default to Amritsar, Punjab region coordinates
  const [lat, setLat] = useState(31.6340);
  const [lng, setLng] = useState(74.8723);
  
  // Details tab selection: land | soil_history | crops | activity
  const [detailTab, setDetailTab] = useState<"land" | "soil_history" | "crops" | "activity">("land");

  // GPS picker state on form map
  const [pickerMarker, setPickerMarker] = useState<{lat: number; lng: number} | null>(null);

  // Sync state when editing
  const openEditForm = (farm: FarmLocation) => {
    setFormMode("edit");
    setFarmName(farm.name);
    setLandSize(farm.totalAcreage.toString());
    setSoilType(farm.soilType || "Loamy");
    setSoilPh((farm.baselineTelemetry?.soilPh || 6.5).toString());
    setWaterSource(farm.waterSource || "Borewell");
    setIrrigationType(farm.irrigationType || "Drip");
    setFarmImage(farm.farmImage || "");
    setImageName(farm.farmImage ? "Current Farm Photo" : "");
    setAddressLocation(farm.location);
    const farmLat = farm.latitude || 31.6340;
    const farmLng = farm.longitude || 74.8723;
    setLat(farmLat);
    setLng(farmLng);
    setPickerMarker({ lat: farmLat, lng: farmLng });
    setIsFormOpen(true);
  };

  const openAddForm = () => {
    setFormMode("add");
    setFarmName("");
    setLandSize("");
    setSoilType("Loamy");
    setSoilPh("6.5");
    setWaterSource("Borewell");
    setIrrigationType("Drip");
    setFarmImage("");
    setImageName("");
    setAddressLocation("");
    // Randomize Punjab coords slightly so not stacked
    const randomOffsetLat = (Math.random() - 0.5) * 0.1;
    const randomOffsetLng = (Math.random() - 0.5) * 0.1;
    const newLat = 31.6340 + randomOffsetLat;
    const newLng = 74.8723 + randomOffsetLng;
    setLat(newLat);
    setLng(newLng);
    setPickerMarker({ lat: newLat, lng: newLng });
    setIsFormOpen(true);
  };

  // Image upload base64 converter
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFarmImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Geo boundary polyline coordinate generator based on acreage
  const getBoundaryCoordinates = (farmLat: number, farmLng: number, acreage: number) => {
    // 1 acre is approx 4046 m2, so side is ~63.6m. Let's make a beautiful box
    const kmPerDegree = 111;
    const sideKm = (Math.sqrt(acreage * 4046) / 1000) / 2; // half side
    const latDiff = sideKm / kmPerDegree;
    const lngDiff = sideKm / (kmPerDegree * Math.cos(farmLat * Math.PI / 180));

    return [
      { lat: farmLat - latDiff, lng: farmLng - lngDiff },
      { lat: farmLat + latDiff, lng: farmLng - lngDiff },
      { lat: farmLat + latDiff, lng: farmLng + lngDiff },
      { lat: farmLat - latDiff, lng: farmLng + lngDiff },
      { lat: farmLat - latDiff, lng: farmLng - lngDiff } // close polygon
    ];
  };

  // Handle Map Click in GPS picker Form
  const handleMapClickOnPicker = (e: any) => {
    if (e.detail?.latLng) {
      const clickedLat = e.detail.latLng.lat;
      const clickedLng = e.detail.latLng.lng;
      setLat(clickedLat);
      setLng(clickedLng);
      setPickerMarker({ lat: clickedLat, lng: clickedLng });
      
      // Auto reverse-geocode-ish mock address
      setAddressLocation(`${clickedLat.toFixed(4)}°N, ${clickedLng.toFixed(4)}°E (Mapped Grid Point)`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmName || !landSize) return;

    const parsedPh = parseFloat(soilPh) || 6.5;
    const parsedAcreage = parseFloat(landSize) || 10;

    // Pre-seed mock history & logs for new farms
    const initialHistory = [
      { date: "2026-05-15", pH: parsedPh, organicMatter: 2.8, nitrogen: 75, phosphorus: 38, potassium: 98 },
      { date: "2026-03-10", pH: parsedPh - 0.2, organicMatter: 2.7, nitrogen: 70, phosphorus: 35, potassium: 90 },
      { date: "2026-01-05", pH: parsedPh + 0.1, organicMatter: 2.5, nitrogen: 68, phosphorus: 30, potassium: 85 }
    ];

    const initialLogs = [
      { id: "log-1", date: "2026-06-25", action: "N-P-K Mineral Balance Injected", category: "soil" as const, description: `Calibrated potassium feed to reach ${parsedPh} target.` },
      { id: "log-2", date: "2026-06-12", action: "Solenoid Valves Audit", category: "irrigation" as const, description: `${irrigationType} system checked, no pressure drops found.` },
      { id: "log-3", date: "2026-05-20", action: "Durable Organic Compost Sprinkled", category: "soil" as const, description: "Laid top layer of farm-grown cow-dung compost." },
      { id: "log-4", date: "2026-05-01", action: "Farm Unit Registered", category: "general" as const, description: `Registered ${farmName} as active managed holding.` }
    ];

    if (formMode === "add") {
      const newFarmId = `farm-${Date.now()}`;
      const newFarm: FarmLocation = {
        id: newFarmId,
        name: farmName,
        role: "Operator / Owner",
        location: addressLocation || `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`,
        totalAcreage: parsedAcreage,
        soilType: soilType,
        organicMatter: 2.8,
        waterSource: waterSource,
        irrigationType: irrigationType,
        healthScore: 85 + Math.round(Math.random() * 12),
        baselineTelemetry: {
          soilMoisture: 45,
          soilPh: parsedPh,
          temperature: 28.5,
          humidity: 60,
          nitrogen: 75,
          phosphorus: 38,
          potassium: 98
        },
        sectors: [
          {
            id: `sec-${Date.now()}-1`,
            name: "Shed Primary Grid",
            cropName: "Fallow",
            cropVariety: "None",
            moisture: 42,
            temp: 29.0,
            valveStatus: "Closed",
            healthStatus: "Optimal",
            area: parsedAcreage
          }
        ],
        latitude: lat,
        longitude: lng,
        farmImage: farmImage,
        soilTestHistory: initialHistory,
        activityLog: initialLogs
      };
      onAddFarm(newFarm);
    } else {
      // Edit mode
      const updatedFarm: FarmLocation = {
        ...activeFarm,
        name: farmName,
        totalAcreage: parsedAcreage,
        soilType: soilType,
        waterSource: waterSource,
        irrigationType: irrigationType,
        location: addressLocation || `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`,
        latitude: lat,
        longitude: lng,
        farmImage: farmImage || activeFarm.farmImage,
        baselineTelemetry: {
          ...activeFarm.baselineTelemetry,
          soilPh: parsedPh
        }
      };
      onEditFarm(activeFarm.id, updatedFarm);
    }

    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteConfirmId) {
      onDeleteFarm(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  // Safe telemetry accessor
  const telemetry = activeFarm.baselineTelemetry || {
    soilMoisture: 45,
    soilPh: 6.5,
    temperature: 28,
    humidity: 60,
    nitrogen: 70,
    phosphorus: 35,
    potassium: 90
  };

  // Seeding missing properties for default mock farms so UI looks gorgeous
  useEffect(() => {
    farms.forEach(f => {
      // Ensure default farms have coordinates
      if (!f.latitude || !f.longitude) {
        if (f.id === "farm-1") {
          f.latitude = 31.6340;
          f.longitude = 74.8723; // Amritsar, Punjab
        } else if (f.id === "farm-2") {
          f.latitude = 30.9010;
          f.longitude = 75.8573; // Ludhiana, Punjab
        } else {
          f.latitude = 31.5204;
          f.longitude = 75.9876;
        }
      }
      
      // Ensure soilTestHistory exists
      if (!f.soilTestHistory) {
        f.soilTestHistory = [
          { date: "2026-06-01", pH: f.baselineTelemetry?.soilPh || 6.4, organicMatter: 3.4, nitrogen: 82, phosphorus: 41, potassium: 112 },
          { date: "2026-04-12", pH: (f.baselineTelemetry?.soilPh || 6.4) + 0.1, organicMatter: 3.2, nitrogen: 79, phosphorus: 39, potassium: 105 },
          { date: "2026-02-20", pH: (f.baselineTelemetry?.soilPh || 6.4) - 0.2, organicMatter: 3.0, nitrogen: 75, phosphorus: 35, potassium: 98 }
        ];
      }

      // Ensure activityLog exists
      if (!f.activityLog) {
        f.activityLog = [
          { id: "al-1", date: "2026-06-29", action: "Sowed High-Yield Seed Batch", category: "sowing", description: "Successfully sowed hybrid seeds inside key sector plots." },
          { id: "al-2", date: "2026-06-20", action: "Precision Soil pH Correction", category: "soil", description: "Injected micro-calcium additives to steady acid cycles." },
          { id: "al-3", date: "2026-06-15", action: "Solar Sensor Battery Upgrade", category: "maintenance", description: "Upgraded telemetry node antennas to 5dBi." },
          { id: "al-4", date: "2026-06-02", action: "Automatic Solenoid Valves Flush", category: "irrigation", description: "Cleared mineral silt blocks within localized tubes." }
        ];
      }
    });
  }, [farms]);

  const activeFarmCrops = cropsList.filter((c) => c.farmId === activeFarm.id);
  const activeFarmHistory = activeFarm.soilTestHistory || [
    { date: "2026-06-01", pH: telemetry.soilPh, organicMatter: 2.8, nitrogen: telemetry.nitrogen, phosphorus: telemetry.phosphorus, potassium: telemetry.potassium }
  ];
  const activeFarmLogs = activeFarm.activityLog || [
    { id: "al-default-1", date: "2026-06-28", action: "Holding Synchronized", category: "general" as const, description: "Telemetry active." }
  ];

  return (
    <div id="farm-manager-workspace" className="space-y-6">
      
      {/* HEADER CONTROLS SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
        <div>
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="h-5 w-5 text-emerald-600 animate-spin" style={{ animationDuration: "12s" }} />
            Agri-Twin Farm &amp; Location Management
          </h2>
          <p className="text-slate-400 text-[10px] mt-0.5">Maintain, edit, and inspect multi-acre landholdings, active GPS coordinates, and historical soil registers.</p>
        </div>
        <button
          onClick={openAddForm}
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <PlusCircle className="h-4 w-4" />
          Add New Farm Holding
        </button>
      </div>

      {/* CORE DISPLAY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: VIEW ALL FARMS LIST VIEW */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">
              Farms Registry ({farms.length})
            </span>
            <span className="text-[9px] bg-slate-100 border border-slate-200 text-slate-500 font-extrabold px-2 py-0.5 rounded-md uppercase">
              Operational Holdings
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
            {farms.map((farm) => {
              const isSelected = farm.id === activeFarm.id;
              const farmCrops = cropsList.filter((c) => c.farmId === farm.id);
              
              return (
                <div
                  key={farm.id}
                  onClick={() => onSelectFarm(farm.id)}
                  className={`border rounded-2xl p-4 transition-all cursor-pointer relative group flex gap-3.5 items-start ${
                    isSelected
                      ? "bg-emerald-50/45 border-emerald-300 ring-2 ring-emerald-500/10 shadow-sm"
                      : "bg-white border-slate-200 hover:border-slate-350 hover:shadow-xs"
                  }`}
                >
                  {/* Farm Image or Preset Icon */}
                  <div className="h-16 w-16 bg-slate-100 border border-slate-200 rounded-xl overflow-hidden shrink-0 flex items-center justify-center relative">
                    {farm.farmImage ? (
                      <img
                        src={farm.farmImage}
                        alt={farm.name}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-slate-400" />
                    )}
                    <span className="absolute bottom-1 right-1 bg-slate-900/80 text-white text-[8px] px-1 rounded font-black">
                      {farm.totalAcreage.toFixed(0)}Ac
                    </span>
                  </div>

                  {/* Identity text info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 truncate pr-4">
                        {farm.name}
                      </h4>
                      {/* Action tools */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-3 top-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditForm(farm);
                          }}
                          className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                          title="Edit Details"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        {farms.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmId(farm.id);
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title="Delete Farm"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{farm.location}</span>
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[9px] bg-slate-50 border border-slate-200 text-slate-600 px-1.5 py-0.2 rounded font-bold">
                        {farm.soilType.split(" ")[0]} Class
                      </span>
                      {farmCrops.length > 0 ? (
                        <span className="text-[9px] bg-emerald-50 border border-emerald-150 text-emerald-700 px-1.5 py-0.2 rounded font-bold">
                          {farmCrops.length} Crop{farmCrops.length > 1 ? "s" : ""} active
                        </span>
                      ) : (
                        <span className="text-[9px] bg-amber-50 border border-amber-150 text-amber-700 px-1.5 py-0.2 rounded font-bold">
                          Fallow
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE GOOGLE MAPS WITH GEOLOCATION & DETAILED VIEW */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">
              Digital Twin Boundaries &amp; Coordinates
            </span>
            <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-1">
              <MapIcon className="h-3.5 w-3.5" />
              Interactive Geo-Map (weekly feed)
            </span>
          </div>

          {/* GOOGLE MAP WRAPPER WITH BOUNDARY POLYGONS */}
          <div className="h-[280px] w-full bg-slate-100 rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
            {hasValidKey ? (
              <APIProvider apiKey={API_KEY} version="weekly">
                <Map
                  defaultCenter={{ lat: activeFarm.latitude || 31.6340, lng: activeFarm.longitude || 74.8723 }}
                  defaultZoom={15}
                  mapId="DEMO_MAP_ID"
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  style={{ width: "100%", height: "100%" }}
                >
                  {/* Map marker for all farms */}
                  {farms.map((f) => {
                    const farmLat = f.latitude || 31.6340;
                    const farmLng = f.longitude || 74.8723;
                    const isSelected = f.id === activeFarm.id;
                    return (
                      <React.Fragment key={f.id}>
                        <AdvancedMarker
                          position={{ lat: farmLat, lng: farmLng }}
                          onClick={() => onSelectFarm(f.id)}
                        >
                          <Pin
                            background={isSelected ? "#059669" : "#94a3b8"}
                            glyphColor="#fff"
                            borderColor={isSelected ? "#047857" : "#64748b"}
                          />
                        </AdvancedMarker>
                        
                        {/* Selected farm shows boundary polygon */}
                        {isSelected && (
                          <PolygonOverlay
                            paths={getBoundaryCoordinates(farmLat, farmLng, f.totalAcreage)}
                            strokeColor="#059669"
                            fillColor="#34d399"
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </Map>
              </APIProvider>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 text-center">
                <MapIcon className="h-10 w-10 text-emerald-400 animate-bounce mb-2" />
                <h4 className="text-xs uppercase font-black tracking-widest text-emerald-400 mb-1">
                  Simulated Digital Twin Boundary Map
                </h4>
                <p className="text-[10.5px] text-slate-300 max-w-sm leading-relaxed mb-3">
                  Google Maps API integration is loaded. Connect your <code className="bg-slate-950 px-1 py-0.5 rounded text-rose-400 text-[10px]">GOOGLE_MAPS_PLATFORM_KEY</code> secret in Settings to view actual high-resolution satellite plots.
                </p>
                
                {/* SVG Mockup boundary map of farms */}
                <div className="w-full max-w-xs bg-slate-950/60 rounded-xl border border-slate-750 p-2.5 text-[10px] space-y-1.5 text-left text-slate-400 font-medium">
                  <div className="flex justify-between font-bold text-slate-200">
                    <span>🗺️ Holding boundaries:</span>
                    <span className="text-emerald-400 font-black">{activeFarm.name}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="h-2.5 w-2.5 bg-emerald-500 rounded border border-emerald-600 shrink-0" />
                    <span>Boundary Box calculated for {activeFarm.totalAcreage} Acres</span>
                  </div>
                  <div className="text-[9px] text-slate-500">
                    Coords: Lat {(activeFarm.latitude || 31.6340).toFixed(4)}, Lng {(activeFarm.longitude || 74.8723).toFixed(4)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* DETAILED VIEW SUB-CONSOLE FOR SELECTED FARM */}
          <div className="bg-white rounded-3xl border border-slate-250/70 p-5 shadow-xs space-y-4">
            
            {/* Header selection info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-3 gap-2">
              <div>
                <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                  <Layers className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                  {activeFarm.name} Detail Suite
                </h3>
                <p className="text-slate-400 text-[9.5px]">Complete registry tabs: Soil History, Activity Logs, and Crops.</p>
              </div>
              <div className="flex gap-1 bg-slate-100/80 border border-slate-200 p-1 rounded-xl">
                {[
                  { id: "land", label: "Land Details", icon: Compass },
                  { id: "soil_history", label: "Soil History", icon: FlaskConical },
                  { id: "crops", label: "Active Crops", icon: Sprout },
                  { id: "activity", label: "Activity Log", icon: Clock }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setDetailTab(t.id as any)}
                    className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
                      detailTab === t.id
                        ? "bg-white text-emerald-700 shadow-2xs font-extrabold border border-slate-200"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* TAB CONTENT IMPLEMENTATION */}
            <div className="text-slate-650 text-xs">
              
              {/* LAND DETAILS TAB */}
              {detailTab === "land" && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/50">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Holding Area</span>
                    <span className="text-xs font-black text-slate-800">{activeFarm.totalAcreage} Acres</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/50">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Soil Matrix</span>
                    <span className="text-xs font-black text-slate-800">{activeFarm.soilType}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/50">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Soil Acid Index (pH)</span>
                    <span className="text-xs font-black text-slate-800">{telemetry.soilPh} pH</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/50">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Hydric Setup</span>
                    <span className="text-xs font-black text-slate-800">{activeFarm.irrigationType}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/50">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Inflow Reservoir</span>
                    <span className="text-xs font-black text-slate-800">{activeFarm.waterSource}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/50">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Holding Status</span>
                    <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Twin
                    </span>
                  </div>
                </div>
              )}

              {/* SOIL TEST HISTORY */}
              {detailTab === "soil_history" && (
                <div className="space-y-2.5">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Multi-season Soil Quality Logs</p>
                  <div className="border border-slate-150 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-[11px] font-medium border-collapse text-slate-600">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-150 text-[9px] uppercase font-black tracking-wider text-slate-400">
                          <th className="p-2.5">Date</th>
                          <th className="p-2.5">pH</th>
                          <th className="p-2.5">Humus %</th>
                          <th className="p-2.5">N (PPM)</th>
                          <th className="p-2.5">P (PPM)</th>
                          <th className="p-2.5">K (PPM)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeFarmHistory.map((h, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-2.5 font-bold text-slate-700">{h.date}</td>
                            <td className="p-2.5">{h.pH}</td>
                            <td className="p-2.5">{h.organicMatter}%</td>
                            <td className="p-2.5 text-emerald-700 font-semibold">{h.nitrogen}</td>
                            <td className="p-2.5">{h.phosphorus}</td>
                            <td className="p-2.5 text-indigo-700 font-semibold">{h.potassium}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ACTIVE CROPS TAB */}
              {detailTab === "crops" && (
                <div className="space-y-3">
                  {activeFarmCrops.length === 0 ? (
                    <div className="text-center p-6 bg-slate-50 border border-slate-200 border-dashed rounded-2xl space-y-1.5">
                      <Sprout className="h-8 w-8 text-slate-300 mx-auto" />
                      <p className="font-bold text-slate-600">No Active Crops On This Farm</p>
                      <p className="text-[10px] text-slate-400">Plant a new crop from the core Ecosystem Hub dashboard to see it registered here.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {activeFarmCrops.map((crop) => {
                        const progress = 35; // Mock development progress bar
                        return (
                          <div key={crop.id} className="p-3 bg-emerald-50/30 border border-emerald-150 rounded-2xl space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-black text-slate-800 text-xs flex items-center gap-1">
                                  <Sprout className="h-3.5 w-3.5 text-emerald-600" />
                                  {crop.name}
                                </h5>
                                <p className="text-[9.5px] text-slate-400 font-semibold uppercase">{crop.variety}</p>
                              </div>
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.2 rounded uppercase">
                                {crop.stage}
                              </span>
                            </div>

                            <div className="space-y-1 text-[10px]">
                              <div className="flex justify-between text-slate-500 font-semibold">
                                <span>Acreage: {crop.acreage} Ac</span>
                                <span>Est. Yield: {crop.projectedYield} Tons</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-600" style={{ width: `${progress}%` }} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ACTIVITY LOG TAB */}
              {detailTab === "activity" && (
                <div className="space-y-2.5">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Operational Audit Stream</p>
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {activeFarmLogs.map((log) => (
                      <div key={log.id} className="bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl flex items-start gap-2 text-[11px] hover:border-slate-300">
                        <span className="text-[9px] font-bold text-slate-400 shrink-0 mt-0.5">{log.date}</span>
                        <div className="space-y-0.5">
                          <p className="font-extrabold text-slate-700 flex items-center gap-1.5">
                            {log.action}
                          </p>
                          <p className="text-slate-500 text-[10px] leading-relaxed">{log.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>

      {/* ============================================================================
          FORM MODAL: ADD / EDIT FARM HOLDING (With Integrated GPS Map picker)
          ============================================================================ */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 max-w-xl w-full space-y-4 text-slate-850"
            >
              {/* Form Header */}
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="h-5 w-5 text-emerald-600 animate-bounce" />
                  {formMode === "add" ? "Register New Farm Holding" : `Edit ${farmName} Registry`}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-extrabold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                {/* 2-Column fields structure */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Farm Name */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Farm Name *</label>
                    <input
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                      required
                      placeholder="e.g. Ludhiana Agri-Paddy Core"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700"
                    />
                  </div>

                  {/* Land Size (acres) */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Total Land Size (Acres) *</label>
                    <input
                      type="number"
                      step="0.1"
                      value={landSize}
                      onChange={(e) => setLandSize(e.target.value)}
                      required
                      placeholder="e.g. 15.5"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700"
                    />
                  </div>

                  {/* Soil Type Dropdown */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Soil Class / Type *</label>
                    <select
                      value={soilType}
                      onChange={(e) => setSoilType(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="Clay">Clay</option>
                      <option value="Loamy">Loamy</option>
                      <option value="Sandy">Sandy</option>
                      <option value="Silty">Silty</option>
                      <option value="Peat">Peat</option>
                      <option value="Chalky">Chalky</option>
                    </select>
                  </div>

                  {/* Soil pH */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Soil pH Index (0.0 - 14.0) *</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="14"
                      value={soilPh}
                      onChange={(e) => setSoilPh(e.target.value)}
                      required
                      placeholder="e.g. 6.4"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700"
                    />
                  </div>

                  {/* Water Source Dropdown */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Water Source *</label>
                    <select
                      value={waterSource}
                      onChange={(e) => setWaterSource(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="Borewell">Borewell</option>
                      <option value="River">River</option>
                      <option value="Canal">Canal</option>
                      <option value="Rain-fed">Rain-fed</option>
                      <option value="Pond">Pond</option>
                    </select>
                  </div>

                  {/* Irrigation Type Dropdown */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Irrigation Rig *</label>
                    <select
                      value={irrigationType}
                      onChange={(e) => setIrrigationType(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="Drip">Drip</option>
                      <option value="Sprinkler">Sprinkler</option>
                      <option value="Flood">Flood</option>
                      <option value="Manual">Manual</option>
                      <option value="None">None</option>
                    </select>
                  </div>

                  {/* Address Location / Reverse Geocode */}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Address / GPS Description</label>
                    <input
                      value={addressLocation}
                      onChange={(e) => setAddressLocation(e.target.value)}
                      placeholder="e.g. Sector 12, Tarn Taran Road, Amritsar, Punjab"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700"
                    />
                  </div>

                  {/* Farm Image Upload (Optional) */}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Upload Farm Photo (Optional)</label>
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 border-dashed rounded-xl p-3">
                      <ImageIcon className="h-5 w-5 text-slate-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="farm-photo-uploader"
                        />
                        <label
                          htmlFor="farm-photo-uploader"
                          className="text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold px-2.5 py-1.5 rounded-lg cursor-pointer uppercase transition-colors inline-block"
                        >
                          Select Image File
                        </label>
                        <span className="text-[10px] text-slate-400 ml-2 font-semibold truncate block sm:inline">
                          {imageName || "No photo attached"}
                        </span>
                      </div>
                      {farmImage && (
                        <div className="h-10 w-10 border rounded-lg overflow-hidden shrink-0">
                          <img src={farmImage} alt="Farm preview" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* GPS PICKER COMPONENT */}
                <div className="space-y-1.5 border-t border-slate-100 pt-3">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] uppercase font-black text-emerald-700 tracking-wide">
                      🗺️ GPS Pick Coordinate Terminal
                    </label>
                    <span className="text-[9.5px] font-semibold text-slate-500">
                      Latitude: {lat.toFixed(5)}, Longitude: {lng.toFixed(5)}
                    </span>
                  </div>

                  <div className="h-[180px] w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative">
                    {hasValidKey ? (
                      <APIProvider apiKey={API_KEY} version="weekly">
                        <Map
                          defaultCenter={{ lat: lat, lng: lng }}
                          defaultZoom={12}
                          mapId="GPS_PICKER_MAP"
                          onClick={handleMapClickOnPicker}
                          style={{ width: "100%", height: "100%" }}
                        >
                          {pickerMarker && (
                            <AdvancedMarker position={pickerMarker}>
                              <Pin background="#ea580c" glyphColor="#fff" />
                            </AdvancedMarker>
                          )}
                        </Map>
                      </APIProvider>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white p-4 text-center">
                        <MapIcon className="h-8 w-8 text-emerald-400 mb-1" />
                        <p className="text-[10px] text-slate-300 leading-relaxed mb-2.5">
                          Click below to simulate pinning current GPS location on custom multi-spectral charts.
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const testLat = 31.6340 + (Math.random() - 0.5) * 0.05;
                              const testLng = 74.8723 + (Math.random() - 0.5) * 0.05;
                              setLat(testLat);
                              setLng(testLng);
                              setAddressLocation(`Sector Plot ${Math.floor(Math.random() * 20 + 1)}, Tarn Taran, Punjab`);
                              alert(`GPS pinpointed to Latitude: ${testLat.toFixed(4)}, Longitude: ${testLng.toFixed(4)}!`);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                          >
                            📍 Auto Pick Current Co-ordinates
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="pt-3 flex gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-center uppercase tracking-wider"
                  >
                    {formMode === "add" ? "Create Holding" : "Save Changes"}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 p-6 max-w-sm w-full space-y-4 text-center text-slate-850"
            >
              <AlertTriangle className="h-12 w-12 text-rose-500 mx-auto animate-bounce" />
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-tight">Delete Farm Holding?</h3>
                <p className="text-[10.5px] text-slate-400 font-medium">
                  Are you absolutely sure you want to delete this farm? This action will purge all micro-climate telemetry logs, historical soil metrics, and active twin settings permanently.
                </p>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-all cursor-pointer uppercase tracking-wider"
                >
                  No, Keep It
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer uppercase tracking-wider"
                >
                  Yes, Purge
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
