import React, { useState, useMemo, useEffect } from "react";
import {
  QrCode,
  Link,
  History,
  TrendingUp,
  Activity,
  Award,
  Globe,
  Thermometer,
  Truck,
  Database,
  Search,
  CheckCircle,
  AlertTriangle,
  FileCheck,
  Cpu,
  User,
  ExternalLink,
  MapPin,
  RefreshCw,
  Coins,
  ShieldCheck,
  Layers,
  Key,
  Lock,
  EyeOff,
  Server,
  Zap,
  Bookmark,
  Scale,
  Plus,
  Terminal,
  Check,
  Info,
  Calendar,
  Sparkles,
  SearchCode
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import { motion, AnimatePresence } from "motion/react";

export interface TraceabilityBatch {
  id: string;
  crop: string;
  variety: string;
  harvestDate: string;
  weightTons: number;
  carbonFootprintKg: number; // KG CO2 per Kg crop
  organicCertId: string;
  fairTradeCertId: string;
  originPlot: string;
  soilPh: number;
  nitrogenResidue: string; // e.g., "0.01%"
  heavyMetalsPpm: number; // Lead/pesticides indicator
  blockchainHash: string;
  status: "Harvested" | "In Storage" | "In Transit" | "Delivered" | "Recalled";
  temperatureLogs: Array<{ time: string; temp: number; humidity: number }>;
  journey: Array<{
    stage: string;
    location: string;
    date: string;
    actor: string;
    verified: boolean;
    txHash: string;
  }>;
}

const INITIAL_BATCHES: TraceabilityBatch[] = [
  {
    id: "BATCH-RICE-9921",
    crop: "Pusa Basmati Rice",
    variety: "Super-Fine 1121 Grade",
    harvestDate: "2026-06-15 06:30 UTC",
    weightTons: 12.5,
    carbonFootprintKg: 0.85,
    organicCertId: "USDA-ORG-IN-9988",
    fairTradeCertId: "FT-FLO-88712",
    originPlot: "North-West Meadow (Plot #1)",
    soilPh: 6.4,
    nitrogenResidue: "0.02%",
    heavyMetalsPpm: 0.004,
    blockchainHash: "0x3e18c52e82fa9b4a1b066fd9219d99723ecdbf7a",
    status: "In Transit",
    temperatureLogs: [
      { time: "08:00", temp: 14.5, humidity: 62 },
      { time: "10:00", temp: 15.2, humidity: 60 },
      { time: "12:00", temp: 14.8, humidity: 64 },
      { time: "14:00", temp: 15.0, humidity: 63 },
      { time: "16:00", temp: 15.6, humidity: 61 },
      { time: "18:00", temp: 14.2, humidity: 65 }
    ],
    journey: [
      { stage: "Harvested & Sorted", location: "Nandi Hills Farm Lot 1", date: "2026-06-15", actor: "Eswar Reddy (Farmer)", verified: true, txHash: "0x882a7f1a0b31" },
      { stage: "Cold Storage Intake", location: "District Warehouse Unit B", date: "2026-06-16", actor: "K. Shrinivas (Storage Dir)", verified: true, txHash: "0xfc1a7b21cd54" },
      { stage: "Transport Dispatched", location: "En-Route National Highway 44", date: "2026-06-18", actor: "Logistics Fleet Express #12", verified: true, txHash: "0x539c7da09f18" },
      { stage: "Retail Distribution Gate", location: "ITC Global Terminal 2", date: "Pending", actor: "ITC Quality Inspector", verified: false, txHash: "0x000000000000" }
    ]
  },
  {
    id: "BATCH-WHT-4481",
    crop: "HD-2967 Amber Wheat",
    variety: "High-Protein Durum",
    harvestDate: "2026-06-10 08:15 UTC",
    weightTons: 22.0,
    carbonFootprintKg: 0.62,
    organicCertId: "APEDA-INDIA-7761",
    fairTradeCertId: "FT-FLO-10291",
    originPlot: "Clay Bottomlands (Plot #3)",
    soilPh: 6.8,
    nitrogenResidue: "0.01%",
    heavyMetalsPpm: 0.002,
    blockchainHash: "0x7f2a10bedd12a818c3ee09ff382a9dbcdff1a100",
    status: "In Storage",
    temperatureLogs: [
      { time: "08:00", temp: 18.2, humidity: 45 },
      { time: "10:00", temp: 18.5, humidity: 44 },
      { time: "12:00", temp: 19.0, humidity: 43 },
      { time: "14:00", temp: 18.8, humidity: 46 },
      { time: "16:00", temp: 18.2, humidity: 47 }
    ],
    journey: [
      { stage: "Harvested & Sorted", location: "Nandi Hills Farm Lot 3", date: "2026-06-10", actor: "Eswar Reddy (Farmer)", verified: true, txHash: "0xca92aa7f20aa" },
      { stage: "Dry Silo Warehouse Lock", location: "Nandi Hills Regional Silo", date: "2026-06-11", actor: "A. Kumar (Silo Manager)", verified: true, txHash: "0x78ea776ab1df" }
    ]
  },
  {
    id: "BATCH-MIL-2201",
    crop: "Pearl Millet (Bajra)",
    variety: "Drought-Resistant Pearl",
    harvestDate: "2026-06-01 11:00 UTC",
    weightTons: 8.4,
    carbonFootprintKg: 0.35,
    organicCertId: "ECO-CERT-992120",
    fairTradeCertId: "FT-FLO-22819",
    originPlot: "Riverside Flat (Plot #6)",
    soilPh: 7.1,
    nitrogenResidue: "0.00%",
    heavyMetalsPpm: 0.001,
    blockchainHash: "0xbc88ef1299dca826e7db3e19c00aa1c29b7cf3a0",
    status: "Delivered",
    temperatureLogs: [
      { time: "08:00", temp: 22.1, humidity: 50 },
      { time: "12:00", temp: 23.5, humidity: 48 },
      { time: "16:00", temp: 22.8, humidity: 51 }
    ],
    journey: [
      { stage: "Harvested & Sorted", location: "Nandi Hills Farm Lot 6", date: "2026-06-01", actor: "Eswar Reddy (Farmer)", verified: true, txHash: "0x9c317aa2d48c" },
      { stage: "Regional Store Lockup", location: "District Warehouse B", date: "2026-06-02", actor: "K. Shrinivas (Storage Dir)", verified: true, txHash: "0x12bb77a87de9" },
      { stage: "Delivered to FabIndia Hub", location: "FabIndia Processing Center", date: "2026-06-05", actor: "FabIndia Logistics Receiving", verified: true, txHash: "0xfa12aa7cc192" }
    ]
  }
];

interface LedgerLog {
  timestamp: string;
  type: "Mint" | "Audit" | "Checkpoint" | "ZKP" | "Recall";
  message: string;
  txHash: string;
  blockHeight: number;
}

const INITIAL_LEDGER_LOGS: LedgerLog[] = [
  { timestamp: "2026-06-15 06:35 UTC", type: "Mint", message: "Genesis registration: Registered BATCH-RICE-9921 on-chain with USDA Organic tags.", txHash: "0x882a7f1a0b31", blockHeight: 1402891 },
  { timestamp: "2026-06-16 09:12 UTC", type: "Checkpoint", message: "Cold Storage milestone signed by K. Shrinivas with valid DID key.", txHash: "0xfc1a7b21cd54", blockHeight: 1403010 },
  { timestamp: "2026-06-18 14:40 UTC", type: "Checkpoint", message: "Sovereign transport reefer dispatched. NH44 telemetry feed bound.", txHash: "0x539c7da09f18", blockHeight: 1403211 },
  { timestamp: "2026-06-10 08:30 UTC", type: "Mint", message: "Genesis registration: Registered BATCH-WHT-4481. Soil Carbon level: 2.1%.", txHash: "0xca92aa7f20aa", blockHeight: 1399824 },
  { timestamp: "2026-06-11 11:22 UTC", type: "Checkpoint", message: "Warehouse grain Silo entry accepted. Humidity validated at 12.2%.", txHash: "0x78ea776ab1df", blockHeight: 1400018 }
];

export default function ProduceTraceabilityModule({ userRole = "Buyer" }: { userRole?: "Farmer" | "Buyer" | string }) {
  const [batches, setBatches] = useState<TraceabilityBatch[]>(INITIAL_BATCHES);
  const [ledgerLogs, setLedgerLogs] = useState<LedgerLog[]>(INITIAL_LEDGER_LOGS);
  
  // Selection States
  const [selectedBatchId, setSelectedBatchId] = useState<string>("BATCH-RICE-9921");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterCrop, setFilterCrop] = useState<string>("All");
  
  // Scanning Simulation
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanSuccessMessage, setScanSuccessMessage] = useState<string | null>(null);
  
  // Consensus / Audit Simulation
  const [auditProgress, setAuditProgress] = useState<number>(-1); // -1 = idle, 0-100 = progress
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [auditResult, setAuditResult] = useState<"Verified" | "Failed" | null>(null);

  // New Batch Form (Farmer view)
  const [formCrop, setFormCrop] = useState<string>("Premium Basmati Rice");
  const [formVariety, setFormVariety] = useState<string>("Super-Fine 1121 Grade");
  const [formWeight, setFormWeight] = useState<number>(15.0);
  const [formPlot, setFormPlot] = useState<string>("North-West Meadow (Plot #1)");
  const [formSoilPh, setFormSoilPh] = useState<number>(6.5);
  const [formNitrogen, setFormNitrogen] = useState<string>("0.02%");
  const [formHeavyMetals, setFormHeavyMetals] = useState<number>(0.003);
  const [formOrganicId, setFormOrganicId] = useState<string>("USDA-ORG-IN-" + Math.floor(1000 + Math.random() * 9000));
  const [formFairTradeId, setFormFairTradeId] = useState<string>("FT-FLO-" + Math.floor(10000 + Math.random() * 90000));

  const cropsList = ["Premium Basmati Rice", "HD-2967 Amber Wheat", "Pearl Millet (Bajra)", "Vine-Ripened Tomato"];

  // Filter crops
  const filteredBatches = useMemo(() => {
    return batches.filter((b) => {
      const matchesSearch = b.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            b.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            b.originPlot.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCrop = filterCrop === "All" || b.crop === filterCrop;
      return matchesSearch && matchesCrop;
    });
  }, [batches, searchQuery, filterCrop]);

  const activeBatch = useMemo(() => {
    return batches.find((b) => b.id === selectedBatchId) || batches[0] || INITIAL_BATCHES[0];
  }, [batches, selectedBatchId]);

  // Generate dynamic QR Code SVG
  const renderQRCodeSVG = (id: string, crop: string) => {
    const seed = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) + crop.charCodeAt(0);
    const size = 15;
    const cells: { r: number; c: number; fill: boolean }[] = [];
    
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        // Finder patterns in three corners
        const isFinderPattern = 
          (r < 4 && c < 4) || 
          (r < 4 && c >= size - 4) || 
          (r >= size - 4 && c < 4);
          
        if (isFinderPattern) {
          const isBorder = r === 0 || r === 3 || c === 0 || c === 3 || 
                           r === size - 1 || r === size - 4 || 
                           (c === size - 1 && r < 4) || (c === size - 4 && r < 4) ||
                           (c === 0 && r >= size - 4) || (c === 3 && r >= size - 4);
          const isCenterDot = (r === 1 && c === 1) || (r === size - 2 && c === 1) || (r === 1 && c === size - 2);
          cells.push({ r, c, fill: isBorder || isCenterDot });
        } else {
          // Semi-random filler pattern based on mathematical hash function
          const val = Math.sin(seed + r * 17 + c * 43);
          cells.push({ r, c, fill: val > 0 });
        }
      }
    }

    return (
      <svg id={`qr-code-svg-${id}`} viewBox="0 0 15 15" className="w-40 h-40 bg-white p-2 border border-slate-150 rounded-2xl shadow-inner mx-auto">
        {cells.map((cell, i) => (
          <rect
            key={i}
            x={cell.c}
            y={cell.r}
            width="1.02"
            height="1.02"
            fill={cell.fill ? "#0f172a" : "#f8fafc"}
          />
        ))}
      </svg>
    );
  };

  // Farmer registers a new batch
  const handleRegisterBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `BATCH-${formCrop.substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const txHash = "0x" + Math.random().toString(16).substring(2, 14) + Math.random().toString(16).substring(2, 14);
    const block = 1403212 + batches.length * 3;
    
    const newBatch: TraceabilityBatch = {
      id: newId,
      crop: formCrop,
      variety: formVariety,
      harvestDate: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC",
      weightTons: formWeight,
      carbonFootprintKg: parseFloat((0.4 + Math.random() * 0.5).toFixed(2)),
      organicCertId: formOrganicId,
      fairTradeCertId: formFairTradeId,
      originPlot: formPlot,
      soilPh: formSoilPh,
      nitrogenResidue: formNitrogen,
      heavyMetalsPpm: formHeavyMetals,
      blockchainHash: txHash,
      status: "Harvested",
      temperatureLogs: [
        { time: "08:00", temp: 16.5, humidity: 55 },
        { time: "10:00", temp: 17.2, humidity: 53 },
        { time: "12:00", temp: 17.0, humidity: 56 }
      ],
      journey: [
        {
          stage: "Harvested & Sorted",
          location: formPlot,
          date: new Date().toISOString().substring(0, 10),
          actor: "Eswar Reddy (Farmer)",
          verified: true,
          txHash: txHash
        }
      ]
    };

    setBatches((prev) => [newBatch, ...prev]);
    setSelectedBatchId(newId);

    // Append to general blockchain ledger log
    const newLog: LedgerLog = {
      timestamp: newBatch.harvestDate,
      type: "Mint",
      message: `Minted crop batch ${newId} (${formCrop}) on sovereign co-op node.`,
      txHash,
      blockHeight: block
    };
    setLedgerLogs((prev) => [newLog, ...prev]);

    alert(`🎉 Successfully Minted Produce Batch ${newId}! SVG QR code has been generated on the blockchain ledger.`);
  };

  // Buyer scans QR simulation
  const handleSimulateScan = () => {
    setIsScanning(true);
    setScanSuccessMessage(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanSuccessMessage(`✓ Decoded Cryptographic QR Stamp! Loaded Batch ID: ${activeBatch.id}`);
    }, 1800);
  };

  // Run blockchain peer auditor consensus check
  const handleRunConsensus = () => {
    setAuditProgress(0);
    setAuditLogs([]);
    setAuditResult(null);
    
    const logs = [
      "🔄 Initializing peer-to-peer ledger audit on Nandi Hills Co-op validator ring...",
      "🔗 Connecting to sovereign nodes: did:agri:node-1, did:agri:node-2, did:agri:node-3...",
      "🧪 Fetching Merkle root signatures & cryptographic DNA for: " + activeBatch.id,
      "🛡️ Verifying zero-knowledge proofs (ZKP) against soil pesticide & organic claims...",
      "❄️ Validating sensor timelines: Cold storage integrity certified at < 18°C.",
      "📝 Recomputing SHA-256 batch hash: " + activeBatch.blockchainHash,
      "✅ Consensus reached: 3/3 validator nodes approved block stamp."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < logs.length) {
        setAuditLogs((prev) => [...prev, logs[currentStep]]);
        setAuditProgress((currentStep + 1) * (100 / logs.length));
        currentStep++;
      } else {
        clearInterval(interval);
        setAuditResult("Verified");
        // Add a ledger audit log
        const auditLog: LedgerLog = {
          timestamp: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC",
          type: "Audit",
          message: `Consensus Audit PASSED for ${activeBatch.id}. Cryptographic signatures match exactly.`,
          txHash: "0xAUDIT" + Math.random().toString(16).substring(2, 10).toUpperCase(),
          blockHeight: 1403212 + ledgerLogs.length
        };
        setLedgerLogs((prev) => [auditLog, ...prev]);
      }
    }, 450);
  };

  return (
    <div id="produce-traceability-module" className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-6 shadow-xs">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-indigo-100 text-indigo-700 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
              <Layers className="h-3 w-3 animate-pulse" /> Blockchain Produce Traceability
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> Anti-Counterfeit Certified
            </span>
          </div>
          <h2 className="text-slate-800 text-lg font-black uppercase tracking-tight mt-1 flex items-center gap-2">
            🔗 Farm-to-Fork Sovereign Quality Ledger
          </h2>
          <p className="text-slate-500 text-xs font-semibold">
            Empower growers to mint unalterable produce histories, generate scannable verification logs, and let buyers audit origin and soil health timelines with blockchain security.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-3xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Selected Batch:</span>
          <select
            value={selectedBatchId}
            onChange={(e) => {
              setSelectedBatchId(e.target.value);
              setScanSuccessMessage(null);
              setAuditResult(null);
              setAuditProgress(-1);
              setAuditLogs([]);
            }}
            className="text-slate-800 text-xs font-black bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 cursor-pointer focus:outline-none"
          >
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.id} ({b.crop.split(" ")[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main double column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (span 4): Batches List & Management */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Form to mint new batch - visible to Growers / Farmers, or simulated */}
          <div className="bg-white border border-slate-250/50 rounded-2xl p-5 shadow-3xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex justify-between items-center">
                <span className="text-[9px] uppercase font-black text-indigo-600 tracking-wider flex items-center gap-1">
                  <Plus className="h-3 w-3" /> Producer Registrar
                </span>
                <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">
                  Farmer Workspace
                </span>
              </div>
              <h3 className="font-bold text-slate-800 text-xs mt-0.5">Register & Mint New Harvest Batch</h3>
              <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Generate a unique on-chain QR stamp and write soil analytics into history logs.</p>
            </div>

            <form onSubmit={handleRegisterBatch} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Crop Name</label>
                <select
                  value={formCrop}
                  onChange={(e) => {
                    setFormCrop(e.target.value);
                    if (e.target.value === "Premium Basmati Rice") setFormVariety("Super-Fine 1121 Grade");
                    else if (e.target.value === "HD-2967 Amber Wheat") setFormVariety("High-Protein Durum");
                    else if (e.target.value === "Pearl Millet (Bajra)") setFormVariety("Drought-Resistant Pearl");
                    else setFormVariety("Grade-A Greenhouse Sourced");
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none"
                >
                  {cropsList.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Variety/Grade</label>
                  <input
                    type="text"
                    value={formVariety}
                    onChange={(e) => setFormVariety(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Weight (Tons)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formWeight}
                    onChange={(e) => setFormWeight(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Origin Farm Plot</label>
                  <input
                    type="text"
                    value={formPlot}
                    onChange={(e) => setFormPlot(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Soil pH Indicator</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="14"
                    value={formSoilPh}
                    onChange={(e) => setFormSoilPh(parseFloat(e.target.value) || 7.0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nitrogen Residue</label>
                  <input
                    type="text"
                    value={formNitrogen}
                    onChange={(e) => setFormNitrogen(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Heavy Metals (PPM)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={formHeavyMetals}
                    onChange={(e) => setFormHeavyMetals(parseFloat(e.target.value) || 0.0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <QrCode className="h-4 w-4" />
                Mint Crop QR & Blockchain Record
              </button>
            </form>
          </div>

          {/* Active Ledger Batches Matrix */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-3xs space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                <Database className="h-4 w-4 text-indigo-500" /> Live Ledger Batches
              </h3>
              <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-black font-mono">
                {filteredBatches.length} Total
              </span>
            </div>

            {/* Filter controls */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by Batch ID/Plot..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 w-full"
                />
              </div>

              <div className="flex gap-1 overflow-x-auto pb-1">
                {["All", ...cropsList.map(c => c.split(" ")[0])].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCrop(cat === "All" ? "All" : cropsList.find(cl => cl.startsWith(cat)) || "All")}
                    className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-tight shrink-0 transition-all cursor-pointer ${
                      (cat === "All" && filterCrop === "All") || (filterCrop.startsWith(cat) && cat !== "All")
                        ? "bg-indigo-600 text-white shadow-3xs"
                        : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Micro-feed list of batches */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {filteredBatches.map((b) => {
                const isSelected = b.id === selectedBatchId;
                return (
                  <div
                    key={b.id}
                    onClick={() => {
                      setSelectedBatchId(b.id);
                      setScanSuccessMessage(null);
                      setAuditResult(null);
                      setAuditProgress(-1);
                      setAuditLogs([]);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer text-xs flex justify-between items-center ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/20 shadow-3xs"
                        : "border-slate-150 hover:bg-slate-50"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-slate-800">{b.id}</span>
                        <span className={`px-1.5 py-0.2 text-[8px] font-bold rounded ${
                          b.status === "Delivered" ? "bg-emerald-50 text-emerald-700" :
                          b.status === "In Transit" ? "bg-blue-50 text-blue-700 animate-pulse" :
                          b.status === "Recalled" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
                        }`}>
                          {b.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-semibold">{b.crop}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold block">{b.weightTons} T</span>
                      <span className="text-[9px] text-slate-500 font-semibold font-mono">{b.harvestDate.split(" ")[0]}</span>
                    </div>
                  </div>
                );
              })}
              {filteredBatches.length === 0 && (
                <p className="text-[11px] text-slate-400 text-center py-4 font-semibold">No harvest batches found matching filters.</p>
              )}
            </div>
          </div>

        </div>

        {/* Right Column (span 8): Dynamic Visual QR Scanner, Quality Timeline, Lab Certs */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Top block: Verification Scan Console */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-3xs">
            
            {/* Live QR generator and click-to-scan */}
            <div className="md:col-span-5 flex flex-col justify-between items-center bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 text-center space-y-4">
              <div className="space-y-1 w-full">
                <span className="text-[8px] bg-indigo-500/20 text-indigo-300 border border-indigo-900/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-extrabold inline-block">
                  On-Chain Quality Code
                </span>
                <h4 className="text-white text-xs font-black uppercase mt-1">Sovereign QR Seal</h4>
              </div>

              {/* QR Container with cool scanning lines */}
              <div className="relative p-2.5 bg-slate-950 rounded-2xl border border-slate-800">
                {renderQRCodeSVG(activeBatch.id, activeBatch.crop)}
                
                {/* Simulated scanner animation */}
                <AnimatePresence>
                  {isScanning && (
                    <motion.div
                      initial={{ top: 10 }}
                      animate={{ top: 160 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute left-4 right-4 h-0.5 bg-emerald-500 shadow-[0_0_12px_#10b981] z-10"
                    />
                  )}
                </AnimatePresence>
                
                {isScanning && (
                  <div className="absolute inset-2.5 bg-emerald-950/20 rounded-xl border border-emerald-500/30 flex items-center justify-center">
                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest bg-slate-950 px-2 py-1 rounded animate-pulse">Scanning...</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 w-full">
                <p className="text-[9px] text-slate-400 font-mono select-all font-bold">SHA-256 Hash: {activeBatch.blockchainHash.substring(0, 24)}...</p>
                
                <button
                  onClick={handleSimulateScan}
                  disabled={isScanning}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <SearchCode className="h-4 w-4" />
                  {isScanning ? "Processing Scan..." : "Simulate QR Scanner Scan"}
                </button>
              </div>
            </div>

            {/* Quality Certifications & Soil Lab Results */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <h4 className="text-slate-800 text-xs font-black uppercase flex items-center gap-1.5">
                    <Award className="h-4.5 w-4.5 text-indigo-600" /> Agronomic Lab & Quality Report
                  </h4>
                  <span className="text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">
                    SLA Compliant
                  </span>
                </div>

                {/* Grid for Lab details */}
                <div className="grid grid-cols-2 gap-3.5 text-xs">
                  <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                    <span className="text-[8.5px] text-slate-400 font-black uppercase block">USDA Organic Certificate</span>
                    <span className="text-slate-700 font-black font-mono tracking-tight text-[11.5px] mt-0.5 block">{activeBatch.organicCertId}</span>
                  </div>
                  <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                    <span className="text-[8.5px] text-slate-400 font-black uppercase block">FairTrade Audit ID</span>
                    <span className="text-slate-700 font-black font-mono tracking-tight text-[11.5px] mt-0.5 block">{activeBatch.fairTradeCertId}</span>
                  </div>
                </div>

                {/* Analytical Quality Parameters list */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 space-y-2 text-[11px] leading-relaxed font-semibold text-slate-600">
                  <span className="text-[9px] uppercase font-black text-indigo-600 block tracking-wider">Cultivation & Residual Biochemistry</span>
                  
                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="bg-white border rounded-lg p-2">
                      <span className="text-[8px] text-slate-400 font-bold block uppercase">Soil pH</span>
                      <span className="text-slate-800 text-xs font-extrabold">{activeBatch.soilPh}</span>
                    </div>
                    <div className="bg-white border rounded-lg p-2">
                      <span className="text-[8px] text-slate-400 font-bold block uppercase">Nitrogen Res</span>
                      <span className="text-slate-800 text-xs font-extrabold">{activeBatch.nitrogenResidue}</span>
                    </div>
                    <div className="bg-white border rounded-lg p-2">
                      <span className="text-[8px] text-slate-400 font-bold block uppercase">Heavy Metals</span>
                      <span className="text-emerald-700 text-xs font-black">{activeBatch.heavyMetalsPpm} PPM</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 italic leading-normal pt-1 flex items-start gap-1">
                    <Info className="h-3.5 w-3.5 text-indigo-500 shrink-0 mt-0.5" />
                    Bio-residue tests confirm zero presence of glyphosate, organophosphates, and synthetic trace elements. Soil acidity levels fall within Basmati optimal vegetative brackets.
                  </p>
                </div>
              </div>

              {scanSuccessMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold p-3 rounded-xl flex items-center gap-2 animate-fade-in shadow-2xs">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <span>{scanSuccessMessage}</span>
                    <p className="text-[9.5px] text-emerald-700 font-medium mt-0.5">Authenticity verified against Merkle proof hashes on sovereign co-op ledger.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom block: Sensory timeline chart (Cold chain logs) & Consensus logs */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left side: cold chain telemetry line chart */}
            <div className="md:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-3xs space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h4 className="text-slate-800 text-xs font-black uppercase flex items-center gap-1.5">
                  <Thermometer className="h-4.5 w-4.5 text-rose-500" /> Cold-Chain Telemetry Timeline
                </h4>
                <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded">
                  Live Sensor Feed
                </span>
              </div>
              
              <div className="h-[150px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activeBatch.temperatureLogs}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="time" stroke="#94a3b8" style={{ fontSize: 9, fontWeight: "bold" }} />
                    <YAxis stroke="#94a3b8" style={{ fontSize: 9, fontWeight: "bold" }} />
                    <Tooltip contentStyle={{ fontSize: 10, borderRadius: 12, border: "1px solid #e2e8f0" }} />
                    <Line type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3 }} name="Temp (°C)" />
                    <Line type="monotone" dataKey="humidity" stroke="#3b82f6" strokeWidth={1.5} dot={{ r: 2 }} name="Humidity (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-between text-[9px] font-black uppercase tracking-wider text-slate-400 font-sans">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500 inline-block animate-pulse"></span> Temperature (°C)</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500 inline-block"></span> Humidity (%)</span>
              </div>
            </div>

            {/* Right side: peer consensus check & cryptographic logs */}
            <div className="md:col-span-5 bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-4 shadow-md">
              <div className="space-y-1.5 border-b border-slate-800 pb-2.5">
                <span className="text-[8px] bg-indigo-600/20 text-indigo-400 border border-indigo-900/40 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold inline-block">
                  Ledger Node Auditor
                </span>
                <h4 className="text-white text-xs font-black uppercase flex items-center gap-1">
                  <Cpu className="h-4 w-4 text-indigo-400" /> Decentralized Consensus
                </h4>
              </div>

              {auditProgress >= 0 ? (
                <div className="space-y-3 w-full">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>Audit Verification:</span>
                      <span className="text-emerald-400 font-bold">{Math.round(auditProgress)}%</span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${auditProgress}%` }} />
                    </div>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 max-h-[100px] overflow-y-auto font-mono text-[8px] text-slate-300 space-y-1">
                    {auditLogs.map((log, idx) => (
                      <div key={idx} className="leading-tight">{log}</div>
                    ))}
                  </div>

                  {auditResult === "Verified" && (
                    <div className="bg-emerald-950/70 border border-emerald-800/80 text-emerald-300 text-[10px] font-black p-2 rounded-lg flex items-center justify-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      BLOCKCHAIN AUDIT PASSED!
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 text-center">
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                    Verify the authenticity of this batch across multi-sig cooperative nodes. Calculates cryptographic SHA-256 hashes on public keys.
                  </p>
                  <button
                    onClick={handleRunConsensus}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Run Peer Consensus Check
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Full Blockchain Journey Map & Checkpoint validation */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-3xs space-y-4">
            <h4 className="text-slate-800 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border-b pb-2.5">
              <History className="h-4.5 w-4.5 text-indigo-600 animate-spin" style={{ animationDuration: "12s" }} /> Farm-to-Fork Blockchain-style Journey Logs
            </h4>

            {/* Checkpoint step tracker */}
            <div className="space-y-4 relative pl-4 border-l border-slate-200 ml-2 pt-1">
              {activeBatch.journey.map((step, idx) => (
                <div key={idx} className="relative">
                  {/* Indicator bullet */}
                  <span className={`absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full ${
                    step.verified ? "bg-emerald-500 border border-emerald-200 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-300 border border-slate-100 animate-pulse"
                  }`} />

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                      <span className="font-extrabold text-slate-800 flex items-center gap-1">
                        {step.stage}
                        {step.verified && <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 font-mono bg-slate-50 border px-1.5 py-0.5 rounded">
                        {step.date}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed">
                      Location: <span className="text-slate-700 font-extrabold">{step.location}</span> • Signatory Actor: <span className="text-slate-700 font-bold">{step.actor}</span>
                    </p>
                    {step.verified && (
                      <div className="text-[9px] font-mono text-emerald-700 flex justify-between items-center bg-emerald-50/50 border border-emerald-100/40 px-2 py-0.5 rounded-md">
                        <span>Verified Cryptographic Block Blockmark</span>
                        <span>Tx Hash: {step.txHash}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decentrailized General Agri-Ledger Transaction Streams */}
          <div className="bg-slate-950 text-white rounded-2xl p-5 border border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h4 className="text-xs font-black uppercase flex items-center gap-1.5 text-indigo-300">
                <Terminal className="h-4.5 w-4.5 text-indigo-400" /> Decentralized General Agri-Ledger Feed
              </h4>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-2 max-h-[160px] overflow-y-auto font-mono text-[9.5px] text-slate-300 pr-1">
              {ledgerLogs.map((log, idx) => (
                <div key={idx} className="p-2 bg-slate-900/60 border border-slate-850 rounded-lg space-y-1 hover:border-slate-800 transition-colors">
                  <div className="flex justify-between text-[8px] font-black text-slate-500">
                    <span>Block #{log.blockHeight} • {log.timestamp}</span>
                    <span className={`px-1 rounded uppercase font-black tracking-wider ${
                      log.type === "Mint" ? "bg-indigo-950/60 text-indigo-400" :
                      log.type === "Audit" ? "bg-emerald-950/60 text-emerald-400" :
                      log.type === "Recall" ? "bg-red-950/60 text-red-400 animate-pulse" :
                      "bg-slate-850 text-slate-400"
                    }`}>{log.type}</span>
                  </div>
                  <p className="text-slate-200 leading-normal font-semibold">"{log.message}"</p>
                  <div className="flex justify-between items-center text-[8px] text-slate-500 pt-0.5 border-t border-slate-850/50">
                    <span>IPFS Record Pin Verified</span>
                    <span>TX Hash: {log.txHash}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
