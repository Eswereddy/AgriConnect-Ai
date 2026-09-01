import React, { useState, useMemo } from "react";
import {
  Truck,
  Navigation,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  DollarSign,
  UserCheck,
  Share2,
  Settings,
  Flame,
  ThermometerSnowflake,
  Anchor,
  Train,
  MessageSquare,
  HelpCircle,
  Compass,
  Gauge,
  Plus
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
  AreaChart,
  Area
} from "recharts";

// Interfaces
interface Vehicle {
  id: string;
  driverName: string;
  driverRating: number;
  vehicleType: "Tata Ace (1.5T)" | "Mahindra Bolero (2.5T)" | "Eicher Pro (7.5T)" | "Reefer Cold Truck (5T)";
  regNumber: string;
  refrigerated: boolean;
  baseRatePerKm: number; // ₹
  status: "Available" | "In Transit" | "Dispatched";
  currentLocation: string;
}

interface TransitJob {
  id: string;
  cropName: string;
  weightTons: number;
  vehicleType: string;
  driverName: string;
  origin: string;
  destination: string;
  currentEtaMins: number;
  trackingStatus: "Pickup Queue" | "In Transit" | "At Customs Border" | "Delivered";
  isRefrigerated: boolean;
  transitType: "Standard Road" | "AI Optimized Road" | "Multi-modal Rail" | "Global Export Port";
}

export const LogisticsModule: React.FC = () => {
  // Pre-seeded available vehicles & drivers
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: "VEH-102",
      driverName: "Harpreet Singh",
      driverRating: 4.9,
      vehicleType: "Tata Ace (1.5T)",
      regNumber: "PB-02-CD-5621",
      refrigerated: false,
      baseRatePerKm: 14.0,
      status: "Available",
      currentLocation: "Amritsar Sector 3 APMC"
    },
    {
      id: "VEH-409",
      driverName: "Gurpreet Dhillon",
      driverRating: 4.8,
      vehicleType: "Mahindra Bolero (2.5T)",
      regNumber: "PB-46-H-9812",
      refrigerated: false,
      baseRatePerKm: 18.5,
      status: "Available",
      currentLocation: "Gurdaspur Central Mandi"
    },
    {
      id: "VEH-712",
      driverName: "Satnam Bajwa",
      driverRating: 4.95,
      vehicleType: "Reefer Cold Truck (5T)",
      regNumber: "PB-10-K-4402",
      refrigerated: true,
      baseRatePerKm: 32.0,
      status: "Available",
      currentLocation: "Ludhiana Cold Junction"
    },
    {
      id: "VEH-880",
      driverName: "Baldev Sandhu",
      driverRating: 4.7,
      vehicleType: "Eicher Pro (7.5T)",
      regNumber: "PB-06-FF-3211",
      refrigerated: false,
      baseRatePerKm: 26.0,
      status: "In Transit",
      currentLocation: "Amritsar Bypass"
    }
  ]);

  // Pre-seeded active tracking jobs
  const [activeJobs, setActiveJobs] = useState<TransitJob[]>([
    {
      id: "JOB-441",
      cropName: "Tomato",
      weightTons: 4.5,
      vehicleType: "Reefer Cold Truck (5T)",
      driverName: "Satnam Bajwa",
      origin: "Amritsar Agronomic Cold Depot",
      destination: "Jalandhar Co-op Mandi",
      currentEtaMins: 45,
      trackingStatus: "In Transit",
      isRefrigerated: true,
      transitType: "AI Optimized Road"
    },
    {
      id: "JOB-902",
      cropName: "Basmati Rice",
      weightTons: 40.0,
      vehicleType: "Eicher Pro (7.5T)",
      driverName: "Baldev Sandhu",
      origin: "Gurdaspur Sovereign Dry Terminal",
      destination: "JNPT Port Mumbai (Export Corridor)",
      currentEtaMins: 1120,
      trackingStatus: "At Customs Border",
      isRefrigerated: false,
      transitType: "Global Export Port"
    }
  ]);

  // Interactive booking inputs
  const [bookingCrop, setBookingCrop] = useState<string>("Basmati Rice");
  const [bookingWeight, setBookingWeight] = useState<number>(3.5);
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>("Tata Ace (1.5T)");
  const [transitType, setTransitType] = useState<"Standard Road" | "AI Optimized Road" | "Multi-modal Rail" | "Global Export Port">("AI Optimized Road");
  const [isRefrigerated, setIsRefrigerated] = useState<boolean>(false);
  const [destinationMandi, setDestinationMandi] = useState<string>("Amritsar Central APMC");

  // Notifications simulation
  const [smsNotificationSent, setSmsNotificationSent] = useState<string | null>(null);

  // Auto-detect recommended truck based on weight and crop perishable nature
  const recommendationEngine = useMemo(() => {
    let recVehicle = "Tata Ace (1.5T)";
    let reason = "Ideal for quick low-weight domestic trips.";

    if (bookingCrop === "Tomato" || isRefrigerated) {
      recVehicle = "Reefer Cold Truck (5T)";
      reason = "Perishable crop detected. Refrigeration loop prevents ambient fungal spoilage.";
    } else if (bookingWeight > 5.0) {
      recVehicle = "Eicher Pro (7.5T)";
      reason = "Heavy bulk cargo requires high-volume axle ratings to maintain stability.";
    } else if (bookingWeight > 1.5) {
      recVehicle = "Mahindra Bolero (2.5T)";
      reason = "Optimal weight envelope matches high-clearance flatbed specs.";
    }

    return {
      recVehicle,
      reason
    };
  }, [bookingCrop, bookingWeight, isRefrigerated]);

  // Dynamic Route & Cost Estimations
  const computedLogistics = useMemo(() => {
    // Determine distance based on destination Mandi
    let distanceKm = 12.5;
    if (destinationMandi === "Jalandhar Co-op Mandi") distanceKm = 82.0;
    if (destinationMandi === "JNPT Port Mumbai (Export Corridor)") distanceKm = 1420.0;
    if (destinationMandi === "ICP Attari Border Terminal") distanceKm = 34.0;

    // Apply route optimizations
    let routeMultiplier = 1.0;
    let etaReductionMins = 0;
    let carbonSavingsKg = 0;

    if (transitType === "AI Optimized Road") {
      routeMultiplier = 0.95; // 5% cost reduction via bypasses
      etaReductionMins = Math.round(distanceKm * 0.15); // Faster transit
      carbonSavingsKg = Math.round(distanceKm * 0.12);
    } else if (transitType === "Multi-modal Rail") {
      routeMultiplier = 0.65; // High cost savings for bulk distance
      etaReductionMins = -Math.round(distanceKm * 0.1); // Rail is slightly slower on setup
      carbonSavingsKg = Math.round(distanceKm * 0.45); // Very eco friendly
    } else if (transitType === "Global Export Port") {
      routeMultiplier = 1.15; // Customs handling surcharges
      etaReductionMins = -120; // Customs delays
      carbonSavingsKg = Math.round(distanceKm * 0.08);
    }

    // Vehicle specific multiplier
    let vehicleCostPerKm = 14.0;
    if (selectedVehicleType === "Mahindra Bolero (2.5T)") vehicleCostPerKm = 18.5;
    if (selectedVehicleType === "Eicher Pro (7.5T)") vehicleCostPerKm = 26.0;
    if (selectedVehicleType === "Reefer Cold Truck (5T)" || isRefrigerated) vehicleCostPerKm = 32.0;

    // Load balancing calculations: density of cargo weight vs vehicle capacity
    let vehicleCapacityTons = 1.5;
    if (selectedVehicleType === "Mahindra Bolero (2.5T)") vehicleCapacityTons = 2.5;
    if (selectedVehicleType === "Eicher Pro (7.5T)") vehicleCapacityTons = 7.5;
    if (selectedVehicleType === "Reefer Cold Truck (5T)") vehicleCapacityTons = 5.0;

    const loadEfficiency = Math.min(100, Math.round((bookingWeight / vehicleCapacityTons) * 100));

    const grossRate = distanceKm * vehicleCostPerKm * routeMultiplier;
    const finalTransportCost = Math.round(grossRate + (isRefrigerated ? 1200 : 0)); // Refrigeration power fee

    // Estimated transit duration
    const baseDurationMins = Math.round((distanceKm / 45) * 60); // average 45km/h speed
    const finalDurationMins = Math.max(15, baseDurationMins - etaReductionMins);

    return {
      distanceKm,
      finalTransportCost,
      finalDurationMins,
      carbonSavingsKg,
      loadEfficiency,
      hasOverload: bookingWeight > vehicleCapacityTons
    };
  }, [destinationMandi, selectedVehicleType, transitType, isRefrigerated, bookingWeight]);

  // Submit dynamic truck booking action
  const handleTruckBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (computedLogistics.hasOverload) {
      alert("❌ Load capacity exceeded! Please select a larger vehicle rating.");
      return;
    }

    const matchedDriver = vehicles.find((v) => v.vehicleType === selectedVehicleType) || vehicles[0];

    const newJob: TransitJob = {
      id: `JOB-${Math.floor(100 + Math.random() * 900)}`,
      cropName: bookingCrop,
      weightTons: bookingWeight,
      vehicleType: selectedVehicleType,
      driverName: matchedDriver.driverName,
      origin: matchedDriver.currentLocation,
      destination: destinationMandi,
      currentEtaMins: computedLogistics.finalDurationMins,
      trackingStatus: "Pickup Queue",
      isRefrigerated: isRefrigerated || selectedVehicleType === "Reefer Cold Truck (5T)",
      transitType: transitType
    };

    setActiveJobs((prev) => [newJob, ...prev]);

    setSmsNotificationSent(`📱 Dispatch Alert: Stacking instruction sent to driver ${matchedDriver.driverName} (${matchedDriver.regNumber}). Cargo safety seal applied. SMS triggered!`);
    
    setTimeout(() => {
      setSmsNotificationSent(null);
    }, 5000);
  };

  // Simulate an ETA update notification push
  const triggerEtaNotification = (jobId: string, driver: string) => {
    setSmsNotificationSent(`📱 SMS Broadcast: Automated ETA alert dispatched to buyer terminal for ${jobId}. Driver: ${driver}.`);
    setTimeout(() => {
      setSmsNotificationSent(null);
    }, 4000);
  };

  // Recharts Carbon Savings format
  const carbonImpactData = [
    { name: "Standard Road", Emissions: 420, Cost: 5800 },
    { name: "AI Corridor", Emissions: 340, Cost: 5100 },
    { name: "Rail-Multimodal", Emissions: 120, Cost: 3800 }
  ];

  return (
    <div id="logistics-control-dashboard" className="space-y-6">

      {/* Main Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[9px] uppercase font-black tracking-widest text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-900 flex items-center gap-1.5 w-fit">
            <Truck className="h-4 w-4 animate-pulse" /> Intralogistics & Transit Command
          </span>
          <h2 className="text-white text-base font-black uppercase tracking-tight mt-2">Logistical Routing & Fleet Scheduler</h2>
          <p className="text-slate-400 text-[10px] font-medium">Bilateral GPS fleet coordination, load balance metrics, cold-chain reefer channels, and customs clearance trackers.</p>
        </div>
      </div>

      {/* SMS PUSH NOTIFICATIONS POPUP SIMULATOR */}
      {smsNotificationSent && (
        <div className="bg-emerald-900 text-white border border-emerald-800 rounded-xl p-4 flex items-start gap-3 shadow-md animate-pulse">
          <MessageSquare className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs font-semibold">
            <h4 className="text-[10.5px] uppercase font-black text-emerald-300">Automated App Notification Sent</h4>
            <p className="opacity-90">{smsNotificationSent}</p>
          </div>
        </div>
      )}

      {/* Grid structure: Left interactive console / booking, Right tracking Map & fleet availability */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: VEHICLE MAP, DRIVER DETAILS, TRACKING JOBS (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">

          {/* 1. REAL-TIME DELIVERY TRACKING (GPS-SIMULATION MAP) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Navigation className="h-4.5 w-4.5 text-emerald-600" /> Real-Time Delivery Tracking (Simulated GPS Grid)
                </h3>
                <p className="text-[10px] text-slate-400">Current live location coordinates and dispatch telemetry from active fleet routes.</p>
              </div>
              <span className="text-[8px] font-black uppercase bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-0.5 rounded-md animate-pulse">
                • LIVE TRACKING ACTIVE
              </span>
            </div>

            {/* Simulated Live Vehicles Layout Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeJobs.map((job) => (
                <div key={job.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 font-semibold text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[8px] font-black uppercase text-slate-400 block font-mono">Job ID: {job.id}</span>
                      <h4 className="text-slate-800 font-extrabold text-[12.5px]">{job.cropName} shipment ({job.weightTons} Tons)</h4>
                    </div>
                    <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded ${
                      job.trackingStatus === "In Transit"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse"
                        : job.trackingStatus === "At Customs Border"
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {job.trackingStatus}
                    </span>
                  </div>

                  {/* Route indicators */}
                  <div className="bg-white border border-slate-150 rounded-lg p-2.5 text-[9.5px] leading-relaxed space-y-1 text-slate-600">
                    <p className="flex items-center gap-1.5 font-medium">
                      <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      Origin: <span className="text-slate-800 font-bold">{job.origin}</span>
                    </p>
                    <p className="flex items-center gap-1.5 font-medium">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      Destination: <span className="text-slate-800 font-bold">{job.destination}</span>
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-[10px] pt-1 border-t border-slate-150">
                    <div className="font-mono">
                      <span className="text-slate-400 text-[8px] font-bold block uppercase leading-none">ETA Remainder</span>
                      <span className="text-slate-800 font-extrabold">{job.currentEtaMins > 60 ? `${Math.round(job.currentEtaMins / 60)} hrs` : `${job.currentEtaMins} mins`}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 text-[8px] font-bold block uppercase leading-none">Driver Assigned</span>
                      <span className="text-slate-800 font-extrabold">{job.driverName}</span>
                    </div>
                  </div>

                  {/* Send Notification Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => triggerEtaNotification(job.id, job.driverName)}
                      className="bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 font-black px-2.5 py-1 rounded text-[9px] transition-all cursor-pointer flex items-center gap-1"
                    >
                      <MessageSquare className="h-3 w-3" /> Push ETA SMS Notification
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. FLEET & DRIVER AVAILABILITY LEDGER */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="h-4.5 w-4.5 text-emerald-600" /> Verified Regional Fleet & Driver Availability
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Contactable driver registries equipped with rating index points and active commercial vehicle permits.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[9px] uppercase tracking-wider">
                    <th className="pb-3">Vehicle Details</th>
                    <th className="pb-3">Driver Name</th>
                    <th className="pb-3">Rating Index</th>
                    <th className="pb-3">Base Tariff</th>
                    <th className="pb-3">Permit Registry</th>
                    <th className="pb-3">Current Location</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {vehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 font-extrabold text-slate-900">
                        {v.vehicleType}
                        {v.refrigerated && (
                          <span className="text-[8px] bg-sky-50 text-sky-700 font-black px-1.5 py-0.2 rounded border border-sky-200 ml-1.5 uppercase">
                            Reefer
                          </span>
                        )}
                      </td>
                      <td className="py-3 font-semibold text-slate-800">{v.driverName}</td>
                      <td className="py-3 font-bold text-emerald-700">★ {v.driverRating}</td>
                      <td className="py-3 font-mono text-slate-800">₹{v.baseRatePerKm}/km</td>
                      <td className="py-3 font-mono text-slate-500 text-[10px]">{v.regNumber}</td>
                      <td className="py-3 text-slate-500 font-medium">{v.currentLocation}</td>
                      <td className="py-3 text-right">
                        <span className={`text-[8.5px] font-black px-2 py-0.5 rounded ${
                          v.status === "Available"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. MULTI-MODAL & EXPORT PORT CORRIDORS TRACKER */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Anchor className="h-4.5 w-4.5 text-indigo-600" /> Indian Rail Cargo & Attari Customs Gateway
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Monitor bilateral freight routes connected directly to Mumbai JNPT or Attari border land customs terminals.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <Train className="h-4 w-4 text-emerald-600" />
                  <h4 className="text-slate-800 font-black uppercase text-[10px] tracking-wider">Indian Railways Freight Line</h4>
                </div>
                <p className="text-[9.5px] text-slate-500 leading-relaxed font-semibold">
                  Multi-modal shipping triggers road transport to the closest container yard (Ludhiana Rail Depot), routing bulk cargos directly across deep high-speed corridors.
                </p>
                <div className="text-[9.5px] text-emerald-700 font-bold bg-emerald-50/50 p-2 rounded border border-emerald-100">
                  ✓ Saves ~35% on fuel tariffs over road haulages for trips exceeding 400km.
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <Anchor className="h-4 w-4 text-indigo-600" />
                  <h4 className="text-slate-800 font-black uppercase text-[10px] tracking-wider">Customs Attari Seal Compliance</h4>
                </div>
                <p className="text-[9.5px] text-slate-500 leading-relaxed font-semibold">
                  Secures international customs clearings with authorized phytosanitary compliance sealing. Allows seamless border crossings into central export yards.
                </p>
                <div className="text-[9.5px] text-indigo-700 font-bold bg-indigo-50/50 p-2 rounded border border-indigo-100">
                  ✓ Customs clearance queue times reduced by ~4 hours via pre-booked slots.
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: BOOKING FORM & COST CALCULATOR ENGINE (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">

          {/* 1. INTERACTIVE TRUCK BOOKING SYSTEM */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="h-4.5 w-4.5 text-emerald-600" /> Book Transport Vehicle
              </h3>
              <p className="text-[10px] text-slate-400">Reserve commercial transport space with auto load balanced stacking indexes.</p>
            </div>

            <form onSubmit={handleTruckBooking} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Target Crop to Dispatch</label>
                <select
                  value={bookingCrop}
                  onChange={(e) => setBookingCrop(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-none"
                >
                  <option value="Basmati Rice">Basmati Rice</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Tomato">Tomato (Requires Reefer Cold Chain)</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Rice Paddy">Rice Paddy</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Cargo Weight (Tons)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="15"
                    value={bookingWeight}
                    onChange={(e) => setBookingWeight(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Vehicle Selection</label>
                  <select
                    value={selectedVehicleType}
                    onChange={(e) => {
                      setSelectedVehicleType(e.target.value);
                      setIsRefrigerated(e.target.value === "Reefer Cold Truck (5T)");
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-none"
                  >
                    <option value="Tata Ace (1.5T)">Tata Ace (1.5 Tons Capacity)</option>
                    <option value="Mahindra Bolero (2.5T)">Mahindra Bolero (2.5 Tons Capacity)</option>
                    <option value="Reefer Cold Truck (5T)">Reefer Cold Truck (5 Tons Capacity)</option>
                    <option value="Eicher Pro (7.5T)">Eicher Pro (7.5 Tons Capacity)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Destination Mandi / Yard</label>
                <select
                  value={destinationMandi}
                  onChange={(e) => setDestinationMandi(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-none"
                >
                  <option value="Amritsar Central APMC">Amritsar Central APMC Yard (12.5 km)</option>
                  <option value="Jalandhar Co-op Mandi">Jalandhar Co-op Mandi (82 km)</option>
                  <option value="ICP Attari Border Terminal">ICP Attari Border land Terminal (34 km)</option>
                  <option value="JNPT Port Mumbai (Export Corridor)">JNPT Port Mumbai Export Yard (1420 km)</option>
                </select>
              </div>

              {/* Transit corridor types */}
              <div>
                <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Transit Routing Model</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(["Standard Road", "AI Optimized Road", "Multi-modal Rail", "Global Export Port"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTransitType(type)}
                      className={`py-1.5 rounded-lg text-[9px] font-bold border text-center transition-all cursor-pointer ${
                        transitType === type
                          ? "bg-indigo-700 border-indigo-700 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reefer control */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 space-y-2">
                <label className="flex items-center gap-2 text-[10.5px] font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRefrigerated}
                    onChange={(e) => setIsRefrigerated(e.target.checked)}
                    className="accent-indigo-600 rounded"
                  />
                  <span>Require Cold Chain (Reefer Active)</span>
                </label>
                <p className="text-[8.5px] text-slate-400 pl-5 leading-normal">
                  Maintains continuous climate cooling loop (+2°C to +8°C) with real-time temperature telemetry log exports.
                </p>
              </div>

              {/* LOAD BALANCING EFFICIENCY METER */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 space-y-1.5">
                <div className="flex justify-between items-center text-[9.5px] font-black uppercase text-slate-500">
                  <span>Stacking Load Density</span>
                  <span className={computedLogistics.hasOverload ? "text-red-600" : "text-emerald-700"}>
                    {computedLogistics.loadEfficiency}% {computedLogistics.hasOverload ? "• Capacity Exceeded" : "• Good Stacking"}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${computedLogistics.hasOverload ? "bg-red-600" : "bg-emerald-600"}`} style={{ width: `${computedLogistics.loadEfficiency}%` }} />
                </div>
              </div>

              {/* DYNAMIC COST SHEET */}
              <div className="bg-slate-900 text-slate-300 rounded-xl p-4 space-y-2 font-mono text-[9.5px]">
                <div className="flex justify-between">
                  <span>Calculated Route Distance:</span>
                  <span className="text-white">{computedLogistics.distanceKm} km</span>
                </div>
                <div className="flex justify-between">
                  <span>Transport Duration Index:</span>
                  <span className="text-white">~ {computedLogistics.finalDurationMins} mins</span>
                </div>
                {isRefrigerated && (
                  <div className="flex justify-between text-sky-400">
                    <span>Reefer Cold Chain Surcharge:</span>
                    <span>+ ₹1,200</span>
                  </div>
                )}
                {computedLogistics.carbonSavingsKg > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Carbon Credits Achieved:</span>
                    <span>{computedLogistics.carbonSavingsKg} kg CO₂</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-800 pt-2 text-xs font-bold font-sans text-white">
                  <span>Estimated Transport Cost:</span>
                  <span className="text-emerald-400">₹{computedLogistics.finalTransportCost.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={computedLogistics.hasOverload}
                className={`w-full font-black py-2.5 rounded-lg text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 ${
                  computedLogistics.hasOverload
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                    : "bg-indigo-700 hover:bg-indigo-800 text-white cursor-pointer"
                }`}
              >
                <Truck className="h-4 w-4" /> Book Transport Space
              </button>
            </form>
          </div>

          {/* AI SMART RECOMMENDATIONS PANEL */}
          <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-2xl p-5 border border-indigo-900 space-y-3.5">
            <div className="flex justify-between items-center border-b border-indigo-800 pb-2">
              <div>
                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest block">Intralogistics Advice</span>
                <h3 className="text-xs font-bold text-white mt-0.5">AI Smart Recommendations</h3>
              </div>
              <Sparkles className="h-4.5 w-4.5 text-indigo-400" />
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="text-[9.5px] font-bold text-indigo-300 block uppercase">Recommended Fleet Rating:</span>
              <p className="text-[11.5px] font-black text-white">{recommendationEngine.recVehicle}</p>
              <p className="text-[9.5px] text-slate-300 leading-normal">{recommendationEngine.reason}</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
