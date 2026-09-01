import React, { useState, useMemo } from "react";
import {
  Building2,
  Navigation,
  ThermometerSnowflake,
  Calculator,
  Calendar,
  AlertCircle,
  FileCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Layers,
  CheckCircle,
  Clock,
  Gauge,
  Droplets,
  Wind,
  ShieldAlert,
  Download,
  Percent,
  Plus,
  AlertTriangle
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Interfaces
interface Warehouse {
  id: string;
  name: string;
  type: "Cold Storage" | "Dry Warehouse" | "Hybrid Depot";
  distanceKm: number;
  latitude: number;
  longitude: number;
  totalCapacityBags: number;
  availableCapacityBags: number;
  baseRatePerBagPerMonth: number; // ₹
  insurancePremiumRate: number; // % of crop value
  currentTemperature: number; // °C
  currentHumidity: number; // %
  ethyleneGasPpm: number; // ppm
  ventilationFanActive: boolean;
  certifiedForExport: boolean;
  transitRoutes: {
    marketName: string;
    distanceKm: number;
    durationMins: number;
    transitCostPerTon: number;
  }[];
}

interface StoredBatch {
  id: string;
  cropName: string;
  warehouseId: string;
  warehouseName: string;
  bagsCount: number;
  weightTons: number;
  storeDate: string;
  expiryDate: string;
  insuranceOpted: boolean;
  phytosanitaryCertified: boolean;
  temperatureControlled: boolean;
  qualityGrade: "A+" | "A" | "B" | "C";
  feFoRank: number; // 1 is oldest/most urgent to dispatch
}

export const WarehouseStorage: React.FC = () => {
  // Pre-seeded warehouses
  const [warehouses, setWarehouses] = useState<Warehouse[]>([
    {
      id: "wh-1",
      name: "Amritsar Agronomic Cold Depot",
      type: "Cold Storage",
      distanceKm: 8.4,
      latitude: 31.634,
      longitude: 74.872,
      totalCapacityBags: 25000,
      availableCapacityBags: 4200,
      baseRatePerBagPerMonth: 12.5,
      insurancePremiumRate: 0.15,
      currentTemperature: 4.2,
      currentHumidity: 65,
      ethyleneGasPpm: 2.1,
      ventilationFanActive: true,
      certifiedForExport: true,
      transitRoutes: [
        { marketName: "Amritsar Central APMC", distanceKm: 9.2, durationMins: 20, transitCostPerTon: 350 },
        { marketName: "Jalandhar Grain Mandi", distanceKm: 82.0, durationMins: 110, transitCostPerTon: 1800 },
        { marketName: "Ludhiana Export Terminal", distanceKm: 140.0, durationMins: 180, transitCostPerTon: 3200 }
      ]
    },
    {
      id: "wh-2",
      name: "Gurdaspur Sovereign Dry Terminal",
      type: "Dry Warehouse",
      distanceKm: 14.2,
      latitude: 32.041,
      longitude: 75.405,
      totalCapacityBags: 50000,
      availableCapacityBags: 18500,
      baseRatePerBagPerMonth: 6.0,
      insurancePremiumRate: 0.08,
      currentTemperature: 28.5,
      currentHumidity: 45,
      ethyleneGasPpm: 0.4,
      ventilationFanActive: false,
      certifiedForExport: false,
      transitRoutes: [
        { marketName: "Gurdaspur APMC Yard", distanceKm: 5.4, durationMins: 12, transitCostPerTon: 220 },
        { marketName: "Batala Grain Market", distanceKm: 34.0, durationMins: 45, transitCostPerTon: 950 },
        { marketName: "Amritsar Central APMC", distanceKm: 76.0, durationMins: 95, transitCostPerTon: 2100 }
      ]
    },
    {
      id: "wh-3",
      name: "Ludhiana Multimodal Cold Link",
      type: "Hybrid Depot",
      distanceKm: 32.1,
      latitude: 30.901,
      longitude: 75.857,
      totalCapacityBags: 80000,
      availableCapacityBags: 32400,
      baseRatePerBagPerMonth: 9.8,
      insurancePremiumRate: 0.12,
      currentTemperature: 8.5,
      currentHumidity: 55,
      ethyleneGasPpm: 1.2,
      ventilationFanActive: true,
      certifiedForExport: true,
      transitRoutes: [
        { marketName: "Ludhiana APMC Yard", distanceKm: 4.1, durationMins: 10, transitCostPerTon: 180 },
        { marketName: "Jalandhar Grain Mandi", distanceKm: 61.0, durationMins: 75, transitCostPerTon: 1400 },
        { marketName: "Amritsar Central APMC", distanceKm: 138.0, durationMins: 170, transitCostPerTon: 3100 }
      ]
    }
  ]);

  // Pre-seeded Active Inventory Batches
  const [batches, setBatches] = useState<StoredBatch[]>([
    {
      id: "BATCH-9021",
      cropName: "Tomato",
      warehouseId: "wh-1",
      warehouseName: "Amritsar Agronomic Cold Depot",
      bagsCount: 150,
      weightTons: 7.5,
      storeDate: "2026-06-15",
      expiryDate: "2026-07-10",
      insuranceOpted: true,
      phytosanitaryCertified: true,
      temperatureControlled: true,
      qualityGrade: "A+",
      feFoRank: 1 // Expiring very soon!
    },
    {
      id: "BATCH-8714",
      cropName: "Basmati Rice",
      warehouseId: "wh-2",
      warehouseName: "Gurdaspur Sovereign Dry Terminal",
      bagsCount: 800,
      weightTons: 40.0,
      storeDate: "2026-04-10",
      expiryDate: "2027-04-10",
      insuranceOpted: false,
      phytosanitaryCertified: false,
      temperatureControlled: false,
      qualityGrade: "A",
      feFoRank: 3
    },
    {
      id: "BATCH-4402",
      cropName: "Wheat",
      warehouseId: "wh-3",
      warehouseName: "Ludhiana Multimodal Cold Link",
      bagsCount: 500,
      weightTons: 25.0,
      storeDate: "2026-05-02",
      expiryDate: "2026-11-02",
      insuranceOpted: true,
      phytosanitaryCertified: false,
      temperatureControlled: true,
      qualityGrade: "A",
      feFoRank: 2
    }
  ]);

  // Selections & Booking variables
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>("wh-1");
  const selectedWarehouse = useMemo(() => {
    return warehouses.find((w) => w.id === selectedWarehouseId) || warehouses[0];
  }, [warehouses, selectedWarehouseId]);

  // Interactive booking states
  const [bookingCrop, setBookingCrop] = useState<"Rice Paddy" | "Tomato" | "Basmati Rice" | "Wheat" | "Cotton">("Basmati Rice");
  const [bookingBags, setBookingBags] = useState<number>(200);
  const [bookingMonths, setBookingMonths] = useState<number>(3);
  const [optInInsurance, setOptInInsurance] = useState<boolean>(true);
  const [optInExportCert, setOptInExportCert] = useState<boolean>(false);
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);

  // Dynamic cost estimations
  const calculatedCostSummary = useMemo(() => {
    const baseStorage = bookingBags * selectedWarehouse.baseRatePerBagPerMonth * bookingMonths;
    
    // Basmati Rice base market price ₹6800 per quintal (1 Bag ≈ 50kg, 1 Bag ≈ 0.5 Quintal, so ₹3400/Bag)
    const averageCropValuePerBag = bookingCrop === "Basmati Rice" ? 3400 : bookingCrop === "Wheat" ? 1200 : bookingCrop === "Tomato" ? 900 : 2500;
    const totalEstValuation = bookingBags * averageCropValuePerBag;
    
    const insuranceFee = optInInsurance ? (totalEstValuation * (selectedWarehouse.insurancePremiumRate / 100)) * (bookingMonths / 12) : 0;
    const certFee = optInExportCert ? 1500 : 0; // Flat certification processing fee

    const totalCost = baseStorage + insuranceFee + certFee;

    return {
      baseStorage: Math.round(baseStorage),
      totalEstValuation: Math.round(totalEstValuation),
      insuranceFee: Math.round(insuranceFee),
      certFee,
      totalCost: Math.round(totalCost)
    };
  }, [bookingBags, bookingMonths, bookingCrop, selectedWarehouse, optInInsurance, optInExportCert]);

  // Booking submit action
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingBags > selectedWarehouse.availableCapacityBags) {
      setBookingMessage("❌ Error: Requested booking capacity exceeds current available space inside the selected warehouse.");
      return;
    }

    // Add new batch to list
    const newBatchId = `BATCH-${Math.floor(1000 + Math.random() * 9000)}`;
    const storeDateStr = new Date().toISOString().split("T")[0];
    const expiryDateObj = new Date();
    expiryDateObj.setMonth(expiryDateObj.getMonth() + (bookingCrop === "Tomato" ? 1 : bookingMonths * 2));
    const expiryDateStr = expiryDateObj.toISOString().split("T")[0];

    const newBatch: StoredBatch = {
      id: newBatchId,
      cropName: bookingCrop,
      warehouseId: selectedWarehouse.id,
      warehouseName: selectedWarehouse.name,
      bagsCount: bookingBags,
      weightTons: parseFloat(((bookingBags * 50) / 1000).toFixed(1)), // 1 bag = 50kg
      storeDate: storeDateStr,
      expiryDate: expiryDateStr,
      insuranceOpted: optInInsurance,
      phytosanitaryCertified: optInExportCert,
      temperatureControlled: selectedWarehouse.type === "Cold Storage" || selectedWarehouse.type === "Hybrid Depot",
      qualityGrade: "A",
      feFoRank: batches.length + 1
    };

    setBatches((prev) => [newBatch, ...prev]);

    // Update warehouse capacity
    setWarehouses((prevWhs) =>
      prevWhs.map((w) =>
        w.id === selectedWarehouse.id
          ? { ...w, availableCapacityBags: w.availableCapacityBags - bookingBags }
          : w
      )
    );

    setBookingMessage(`🎉 Success! Booked space inside ${selectedWarehouse.name}. Reference ID: ${newBatchId}`);
    
    // Clear message after 4s
    setTimeout(() => {
      setBookingMessage(null);
    }, 5000);
  };

  // Toggle ventilation fan (IoT condition monitoring mock control)
  const toggleVentilation = (warehouseId: string) => {
    setWarehouses((prev) =>
      prev.map((w) =>
        w.id === warehouseId ? { ...w, ventilationFanActive: !w.ventilationFanActive } : w
      )
    );
  };

  // Quality preservation recommendations lookup by crop
  const qualityPreservationGuide = useMemo(() => {
    const guides = {
      "Basmati Rice": {
        temp: "10°C - 15°C",
        rh: "50% - 60%",
        maxMonths: "18 Months",
        practices: [
          "Maintain moisture content below 12% to prevent yellowing.",
          "Prevent grain weevils with low-temperature carbon dioxide flushing.",
          "Run aerated ventilation loops every 15 days."
        ]
      },
      "Tomato": {
        temp: "8°C - 12°C",
        rh: "85% - 90%",
        maxMonths: "1 Month (Highly Perishable)",
        practices: [
          "Pre-chill within 2 hours of harvesting to eliminate latent heat.",
          "Activate biological carbon scrubbing to suppress ethylene triggers.",
          "Stack only in ventilated dynamic plastic crates (maximum 3 deep)."
        ]
      },
      "Wheat": {
        temp: "15°C - 20°C",
        rh: "40% - 50%",
        maxMonths: "24 Months",
        practices: [
          "Ensure total bulk moisture remains strictly below 13.5%.",
          "Apply dry air ventilation to avoid localized hot pockets.",
          "Regular grain probing checks for pest development."
        ]
      },
      "Cotton": {
        temp: "15°C - 25°C",
        rh: "55% - 65%",
        maxMonths: "12 Months",
        practices: [
          "Store strictly in compressed high-density water-resistant bales.",
          "Implement high-intensity optical smoke sensors in all bays.",
          "Avoid direct ground contact; maintain standard dunnage height."
        ]
      },
      "Rice Paddy": {
        temp: "12°C - 18°C",
        rh: "55% - 65%",
        maxMonths: "12 Months",
        practices: [
          "Retain hull protection until final milling for long-term viability.",
          "Sieve periodically to separate field trash and husks.",
          "Turn bulk piles quarterly to homogenize temperatures."
        ]
      }
    };

    return guides[bookingCrop] || guides["Basmati Rice"];
  }, [bookingCrop]);

  // Route optimization target calculations based on selected warehouse
  const optimizedTransitRoute = useMemo(() => {
    return selectedWarehouse.transitRoutes[0];
  }, [selectedWarehouse]);

  // Generate phyto export certificate for specific batch
  const triggerPhytoCertification = (batchId: string) => {
    setBatches((prev) =>
      prev.map((b) =>
        b.id === batchId ? { ...b, phytosanitaryCertified: true } : b
      )
    );
  };

  // RECHARTS capacity data format
  const capacityChartData = useMemo(() => {
    return warehouses.map((w) => ({
      name: w.name.split(" ")[0] + " wh",
      Booked: w.totalCapacityBags - w.availableCapacityBags,
      Available: w.availableCapacityBags
    }));
  }, [warehouses]);

  return (
    <div id="warehouse-cold-storage-hub" className="space-y-6">

      {/* Main Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[9px] uppercase font-black tracking-widest text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-900 flex items-center gap-1.5 w-fit">
            <ThermometerSnowflake className="h-4 w-4 animate-pulse" /> Post-Harvest Infrastructure
          </span>
          <h2 className="text-white text-base font-black uppercase tracking-tight mt-2">Warehouse & Cold Storage Hub</h2>
          <p className="text-slate-400 text-[10px] font-medium">Bilateral GPS-routed warehouses, real-time IoT chamber monitoring, dynamic storage cost engines, and export quality certifiers.</p>
        </div>
      </div>

      {/* AUTOMATED STOCK ALERTS BANNER (Triggered dynamically on perishable crops) */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <h3 className="font-extrabold text-amber-950 uppercase text-[10.5px]">FEFO Early-Warning Stock Alert</h3>
          <p className="text-amber-900 leading-relaxed font-semibold">
            Batch <strong className="text-slate-900 font-extrabold">BATCH-9021 (Tomato, 7.5 Tons)</strong> stored inside <span className="underline">Amritsar Agronomic Cold Depot</span> has reached <strong className="text-red-700">FEFO Expiration Rank 1</strong>. Complete immediate liquidation within 5 days to avoid spoilage.
          </p>
        </div>
      </div>

      {/* Split Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: NEARBY MAP, DETAILED WAREHOUSE SELECTOR, IoT GAUGES (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">

          {/* 1. NEARBY WAREHOUSES - GPS SELECTOR */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Navigation className="h-4.5 w-4.5 text-emerald-600" /> Nearby Post-Harvest Storage Terminals
                </h3>
                <p className="text-[10px] text-slate-400">Closest GPS-tracked cold storage and multi-grain silo facilities based on current geolocations.</p>
              </div>
              <span className="text-[8.5px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-black">GPS Tracking Enabled</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {warehouses.map((wh) => (
                <button
                  key={wh.id}
                  type="button"
                  onClick={() => setSelectedWarehouseId(wh.id)}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    selectedWarehouseId === wh.id
                      ? "bg-emerald-50/70 border-emerald-600 shadow-xs"
                      : "bg-white border-slate-200 hover:bg-slate-50/50"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[8.5px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {wh.type}
                      </span>
                      <span className="text-[9px] font-mono font-bold text-slate-400">{wh.distanceKm} km away</span>
                    </div>
                    <h4 className="text-xs font-black text-slate-800 leading-snug">{wh.name}</h4>
                    <p className="text-[9px] text-slate-400 font-mono">Coordinates: {wh.latitude}° N, {wh.longitude}° E</p>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-slate-100 flex justify-between items-center text-[10px]">
                    <div>
                      <span className="text-slate-400 text-[8px] font-bold block uppercase leading-none">Space Left</span>
                      <span className="text-slate-800 font-extrabold">{wh.availableCapacityBags.toLocaleString()} / {wh.totalCapacityBags.toLocaleString()} Bags</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 text-[8px] font-bold block uppercase leading-none">Base Rate</span>
                      <span className="text-emerald-700 font-black">₹{wh.baseRatePerBagPerMonth}/Bag/mo</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. REAL-TIME WAREHOUSE CONDITION MONITORING (IoT Chamber Telemetry) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Gauge className="h-4.5 w-4.5 text-emerald-600" /> IoT Chamber Condition Monitoring
                </h3>
                <p className="text-[10px] text-slate-400">Live climate data from inside the selected warehouse's primary storing bays.</p>
              </div>
              <button
                type="button"
                onClick={() => toggleVentilation(selectedWarehouse.id)}
                className={`px-3 py-1 rounded-lg text-[9px] font-bold border cursor-pointer transition-all ${
                  selectedWarehouse.ventilationFanActive
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {selectedWarehouse.ventilationFanActive ? "✓ Ventilation Fans: Active" : "⚠ Ventilation Fans: Off"}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
              
              {/* Climate Temperature */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 relative">
                <span className="text-slate-400 text-[8.5px] font-bold block uppercase">Chamber Temp</span>
                <span className="text-slate-800 text-sm font-black tracking-tight mt-1 block">
                  {selectedWarehouse.currentTemperature}°C
                </span>
                <span className={`text-[7.5px] font-sans font-bold block mt-1.5 ${
                  selectedWarehouse.currentTemperature < 10 ? "text-blue-600" : "text-amber-600"
                }`}>
                  {selectedWarehouse.currentTemperature < 10 ? "❄ Active Chilling" : "☀ Ambient Temp"}
                </span>
                <ThermometerSnowflake className="h-4.5 w-4.5 text-blue-500 absolute top-3 right-3" />
              </div>

              {/* Climate Humidity */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 relative">
                <span className="text-slate-400 text-[8.5px] font-bold block uppercase">Relative Humidity</span>
                <span className="text-slate-800 text-sm font-black tracking-tight mt-1 block">
                  {selectedWarehouse.currentHumidity}% RH
                </span>
                <span className="text-slate-400 text-[7.5px] font-sans font-bold block mt-1.5">
                  Target: {selectedWarehouse.type === "Cold Storage" ? "65%" : "45%"}
                </span>
                <Droplets className="h-4.5 w-4.5 text-sky-500 absolute top-3 right-3" />
              </div>

              {/* Ethylene Ripening gas readings */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 relative">
                <span className="text-slate-400 text-[8.5px] font-bold block uppercase">Ethylene Gas</span>
                <span className="text-slate-800 text-sm font-black tracking-tight mt-1 block">
                  {selectedWarehouse.ethyleneGasPpm} ppm
                </span>
                <span className={`text-[7.5px] font-sans font-bold block mt-1.5 ${
                  selectedWarehouse.ethyleneGasPpm > 1.5 ? "text-amber-600" : "text-emerald-600"
                }`}>
                  {selectedWarehouse.ethyleneGasPpm > 1.5 ? "⚠ Active Ripening" : "✓ Safe Storage"}
                </span>
                <Wind className="h-4.5 w-4.5 text-teal-600 absolute top-3 right-3" />
              </div>

              {/* Export compliance indicators */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 relative">
                <span className="text-slate-400 text-[8.5px] font-bold block uppercase">Export Status</span>
                <span className="text-slate-800 text-xs font-black tracking-tight mt-1.5 block">
                  {selectedWarehouse.certifiedForExport ? "ISO 22000 Cert" : "Non-Export Capable"}
                </span>
                <span className={`text-[7.5px] font-sans font-bold block mt-1.5 ${
                  selectedWarehouse.certifiedForExport ? "text-emerald-600 font-extrabold" : "text-slate-400"
                }`}>
                  {selectedWarehouse.certifiedForExport ? "✓ Global Grade" : "Domestic Grade Only"}
                </span>
                <FileCheck className="h-4.5 w-4.5 text-emerald-600 absolute top-3 right-3" />
              </div>

            </div>
          </div>

          {/* 3. BATCH-LEVEL INVENTORY LIST WITH FIFO/FEFO FLAGS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="h-4.5 w-4.5 text-emerald-600" /> Dynamic Stored Inventory Ledger (Batch-Level FEFO)
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Automated First-Expiring, First-Out (FEFO) routing alerts for stored crops to mitigate degradation losses.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[9px] uppercase tracking-wider">
                    <th className="pb-3">Batch ID</th>
                    <th className="pb-3">Crop Name</th>
                    <th className="pb-3">Warehouse Location</th>
                    <th className="pb-3">Quantity Booked</th>
                    <th className="pb-3">Expiry Date</th>
                    <th className="pb-3 text-center">FEFO Dispatch Rank</th>
                    <th className="pb-3">Certification</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {batches.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 font-mono font-bold text-slate-800">{b.id}</td>
                      <td className="py-3">
                        <span className="text-slate-900 font-extrabold">{b.cropName}</span>
                        {b.temperatureControlled && (
                          <span className="text-[8px] bg-blue-50 text-blue-700 font-black px-1.5 py-0.2 rounded border border-blue-200 ml-1.5 uppercase">
                            Cold
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-slate-500 font-medium">{b.warehouseName}</td>
                      <td className="py-3">
                        <span className="text-slate-800 font-extrabold">{b.bagsCount} Bags</span>
                        <span className="text-slate-400 text-[9px] block">({b.weightTons} Tons)</span>
                      </td>
                      <td className="py-3 font-mono text-[10px] text-slate-600">{b.expiryDate}</td>
                      <td className="py-3 text-center">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                          b.feFoRank === 1
                            ? "bg-red-50 text-red-700 border border-red-200 animate-pulse"
                            : b.feFoRank === 2
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}>
                          Rank {b.feFoRank} {b.feFoRank === 1 ? "• Dispatch Now" : ""}
                        </span>
                      </td>
                      <td className="py-3">
                        {b.phytosanitaryCertified ? (
                          <span className="text-[8.5px] font-extrabold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 w-fit">
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Export Approved
                          </span>
                        ) : (
                          <span className="text-[8.5px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 w-fit block">
                            Domestic Only
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        {!b.phytosanitaryCertified && (
                          <button
                            type="button"
                            onClick={() => triggerPhytoCertification(b.id)}
                            className="bg-teal-50 border border-teal-200 hover:bg-teal-100 text-teal-800 font-black px-2 py-1 rounded text-[9.5px] transition-all cursor-pointer inline-flex items-center gap-1"
                          >
                            <Download className="h-3 w-3" /> Certify Export
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: BOOKING FORM, ROUTING ENGINE, CALCULATOR (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">

          {/* 1. INTERACTIVE STORAGE BOOKING FORM */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="h-4.5 w-4.5 text-emerald-600" /> Reserve Storage Chamber
              </h3>
              <p className="text-[10px] text-slate-400">Automated space reservations with instant dynamic cost estimations.</p>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Target Storing Depot</label>
                <select
                  value={selectedWarehouseId}
                  onChange={(e) => setSelectedWarehouseId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-none"
                >
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} (₹{w.baseRatePerBagPerMonth}/mo)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Target Crop</label>
                  <select
                    value={bookingCrop}
                    onChange={(e) => setBookingCrop(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-none"
                  >
                    <option value="Basmati Rice">Basmati Rice</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Rice Paddy">Rice Paddy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Duration</label>
                  <select
                    value={bookingMonths}
                    onChange={(e) => setBookingMonths(parseInt(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-none"
                  >
                    <option value="1">1 Month</option>
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="12">12 Months</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">
                  Space Capacity (Bags)
                </label>
                <input
                  type="number"
                  min="10"
                  max="10000"
                  value={bookingBags}
                  onChange={(e) => setBookingBags(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold"
                />
                <span className="text-[9px] text-slate-400 mt-1 block">
                  Max available in selected: {selectedWarehouse.availableCapacityBags.toLocaleString()} Bags
                </span>
              </div>

              {/* Extras toggles */}
              <div className="space-y-2.5 bg-slate-50 p-3 rounded-lg border border-slate-150">
                <label className="flex items-center gap-2 text-[10.5px] font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={optInInsurance}
                    onChange={(e) => setOptInInsurance(e.target.checked)}
                    className="accent-emerald-600 rounded"
                  />
                  <span>Opt-in Crop Insurance Protection</span>
                </label>
                <p className="text-[8.5px] text-slate-400 pl-5 leading-normal">
                  Covers fire, pest infestation, moisture degradation, and localized chamber system failures (Premium: {selectedWarehouse.insurancePremiumRate}% of valuation).
                </p>

                <label className="flex items-center gap-2 text-[10.5px] font-bold text-slate-700 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={optInExportCert}
                    onChange={(e) => setOptInExportCert(e.target.checked)}
                    className="accent-emerald-600 rounded"
                  />
                  <span>Apply for Export storage certification</span>
                </label>
                <p className="text-[8.5px] text-slate-400 pl-5 leading-normal">
                  Sovereign Phytosanitary testing certification required for foreign transit corridors.
                </p>
              </div>

              {/* Dynamic Storage Cost Calculator Sheet */}
              <div className="bg-slate-900 text-slate-300 rounded-xl p-4 space-y-2 font-mono text-[9.5px]">
                <div className="flex justify-between">
                  <span>Base Storage Fee:</span>
                  <span className="text-white">₹{calculatedCostSummary.baseStorage}</span>
                </div>
                {optInInsurance && (
                  <div className="flex justify-between">
                    <span>Insurance Cover Cover:</span>
                    <span className="text-white">₹{calculatedCostSummary.insuranceFee}</span>
                  </div>
                )}
                {optInExportCert && (
                  <div className="flex justify-between">
                    <span>Phytosanitary Cert:</span>
                    <span className="text-white">₹{calculatedCostSummary.certFee}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-800 pt-2 text-xs font-bold font-sans text-white">
                  <span>Total Booking Cost:</span>
                  <span className="text-emerald-400">₹{calculatedCostSummary.totalCost}</span>
                </div>
              </div>

              {bookingMessage && (
                <div className="text-[10px] font-bold p-2.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {bookingMessage}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-2.5 rounded-lg text-xs tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Book Chamber Space
              </button>
            </form>
          </div>

          {/* 2. QUALITY PRESERVATION RECOMMENDATIONS BASED ON SELECTED CROP */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-emerald-600" /> Preservation Protocol: {bookingCrop}
              </h3>
              <p className="text-[10px] text-slate-400">Scientifically verified recommendations for maximizing shelf life.</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2 text-center font-mono text-[10px]">
                <div className="bg-slate-50 border border-slate-200 p-2 rounded">
                  <span className="text-slate-400 text-[8px] font-bold block uppercase">Ideal Temp</span>
                  <span className="text-slate-800 font-extrabold">{qualityPreservationGuide.temp}</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-2 rounded">
                  <span className="text-slate-400 text-[8px] font-bold block uppercase">Humidity</span>
                  <span className="text-slate-800 font-extrabold">{qualityPreservationGuide.rh}</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-2 rounded">
                  <span className="text-slate-400 text-[8px] font-bold block uppercase">Max Term</span>
                  <span className="text-slate-800 font-extrabold">{qualityPreservationGuide.maxMonths}</span>
                </div>
              </div>

              <div className="space-y-2 pt-1 pl-1 text-[9.5px] font-semibold text-slate-500 leading-normal">
                {qualityPreservationGuide.practices.map((pr, idx) => (
                  <p key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{pr}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* 3. WAREHOUSE-TO-MARKET ROUTE OPTIMIZATION */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="h-4.5 w-4.5 text-emerald-600" /> Route to Market Optimization
              </h3>
              <p className="text-[10px] text-slate-400">AI-predicted logistical pricing index for clearing stocks to nearby Mandis.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3.5 text-xs font-semibold">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-slate-400 text-[8px] font-bold block uppercase">Optimized Target Market</span>
                  <span className="text-slate-800 font-extrabold">{optimizedTransitRoute.marketName}</span>
                </div>
                <span className="text-[8.5px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-black border border-emerald-100">
                  Fastest Route
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 font-mono text-center text-[10px]">
                <div className="bg-white p-2 border border-slate-200 rounded">
                  <span className="text-slate-400 text-[7.5px] font-bold block uppercase">Distance</span>
                  <span className="text-slate-800 font-bold">{optimizedTransitRoute.distanceKm} km</span>
                </div>
                <div className="bg-white p-2 border border-slate-200 rounded">
                  <span className="text-slate-400 text-[7.5px] font-bold block uppercase">Time</span>
                  <span className="text-slate-800 font-bold">{optimizedTransitRoute.durationMins} mins</span>
                </div>
                <div className="bg-white p-2 border border-slate-200 rounded">
                  <span className="text-slate-400 text-[7.5px] font-bold block uppercase">Cost / Ton</span>
                  <span className="text-emerald-700 font-extrabold">₹{optimizedTransitRoute.transitCostPerTon}</span>
                </div>
              </div>

              <div className="space-y-1 text-[9px] font-semibold text-slate-400 pl-1 leading-normal">
                <p>• Logistics calculated for standard <strong className="text-slate-500">Tata Ace / Mahindra Bolero Pickup</strong>.</p>
                <p>• Includes standard state toll charges and municipal parking levies.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
