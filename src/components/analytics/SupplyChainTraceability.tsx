import React, { useState, useMemo } from "react";
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
  Scale
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

interface TraceabilityBatch {
  id: string;
  crop: string;
  variety: string;
  harvestDate: string;
  weightTons: number;
  carbonFootprintKg: number; // KG CO2 per Kg crop
  organicCertId: string;
  fairTradeCertId: string;
  originPlot: string;
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

export default function SupplyChainTraceability() {
  const [activeSubTab, setActiveSubTab] = useState<"traceability" | "contracts" | "tokenization" | "zkp_ipfs">("traceability");

  const [batches, setBatches] = useState<TraceabilityBatch[]>( [
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
        { stage: "Harvested & Sorted", location: "Nandi Hills Farm Lot 1", date: "2026-06-15", actor: "Eswar Reddy (Farmer)", verified: true, txHash: "0x882a7f1a0" },
        { stage: "Cold Storage Intake", location: "District Warehouse Unit B", date: "2026-06-16", actor: "K. Shrinivas (Storage Dir)", verified: true, txHash: "0xfc1a7b21" },
        { stage: "Transport dispatched", location: "En-Route National Highway 44", date: "2026-06-18", actor: "Logistics Fleet Express #12", verified: true, txHash: "0x539c7da0" },
        { stage: "Retail Distribution Gate", location: "ITC Global Terminal 2", date: "Pending", actor: "ITC Quality Inspector", verified: false, txHash: "0x00000000" }
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
        { stage: "Harvested & Sorted", location: "Nandi Hills Farm Lot 3", date: "2026-06-10", actor: "Eswar Reddy (Farmer)", verified: true, txHash: "0xca92aa7f20" },
        { stage: "Dry Silo Warehouse Lock", location: "Nandi Hills Regional Silo", date: "2026-06-11", actor: "A. Kumar (Silo Manager)", verified: true, txHash: "0x78ea776ab1" }
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
      blockchainHash: "0xbc88ef1299dca826e7db3e19c00aa1c29b7cf3a0",
      status: "Delivered",
      temperatureLogs: [
        { time: "08:00", temp: 22.1, humidity: 50 },
        { time: "12:00", temp: 23.5, humidity: 48 },
        { time: "16:00", temp: 22.8, humidity: 51 }
      ],
      journey: [
        { stage: "Harvested & Sorted", location: "Nandi Hills Farm Lot 6", date: "2026-06-01", actor: "Eswar Reddy (Farmer)", verified: true, txHash: "0x9c317aa2d4" },
        { stage: "Regional Store Lockup", location: "District Warehouse B", date: "2026-06-02", actor: "K. Shrinivas (Storage Dir)", verified: true, txHash: "0x12bb77a87d" },
        { stage: "Delivered to FabIndia Hub", location: "FabIndia Processing Center", date: "2026-06-05", actor: "FabIndia Logistics Receiving", verified: true, txHash: "0xfa12aa7cc1" }
      ]
    }
  ]);

  const [activeBatchId, setActiveBatchId] = useState<string>("BATCH-RICE-9921");
  const [showConsumerPortal, setShowConsumerPortal] = useState<boolean>(false);
  const [recallReason, setRecallReason] = useState<string>("");

  // Smart Contracts states
  const [escrowLocked, setEscrowLocked] = useState<boolean>(true);
  const [contractTriggerStage, setContractTriggerStage] = useState<string>("Retail Distribution Gate");
  const [smartContractConsole, setSmartContractConsole] = useState<string[]>(["[08:15:30] ESCROW initialized: $8,400 locked for Basmati shipment."]);
  const [didVerified, setDidVerified] = useState<boolean>(true);
  const [selectedConsensus, setSelectedConsensus] = useState<"PoA" | "PoS">("PoA");

  // Asset Tokenization states
  const [tokensMinted, setTokensMinted] = useState<{ id: string; name: string; amount: string; category: string }[]>([
    { id: "TKN-LAND-01", name: "Punjab Plot 4B Asset-Token", amount: "10,000 SQM", category: "Farm Asset" },
    { id: "TKN-FUTR-RICE26", name: "Autumn Basmati Crop Future Option", amount: "12.5 Tons", category: "Crop Futures" },
    { id: "TKN-CARB-998", name: "Sustained No-Till Carbon Credit Offset", amount: "4.2 tCO2e", category: "Carbon Credit" }
  ]);
  const [mintAmount, setMintAmount] = useState<string>("5.0");
  const [mintCategory, setMintCategory] = useState<string>("Carbon Credit");

  // ZKP & IPFS states
  const [ipfsHash, setIpfsHash] = useState<string>("QmYwAPzwh3pC1yjhokmXg7S3bMAt91D65b7gKec3b7bK4D");
  const [pinningStatus, setPinningStatus] = useState<boolean>(false);
  const [zkpGenerating, setZkpGenerating] = useState<boolean>(false);
  const [zkpVerified, setZkpVerified] = useState<boolean | null>(null);
  const [zkpProofKey, setZkpProofKey] = useState<string>("");

  const activeBatch = useMemo(() => {
    return batches.find(b => b.id === activeBatchId) || batches[0];
  }, [batches, activeBatchId]);

  // Trigger Recall
  const triggerRecall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recallReason.trim()) {
      alert("Please detail the recall trigger grounds.");
      return;
    }

    const updated = batches.map(b => {
      if (b.id === activeBatchId) {
        return {
          ...b,
          status: "Recalled" as const,
          journey: [
            ...b.journey,
            {
              stage: "EMERGENCY SAFETY RECALL",
              location: "All Retail Warehouses",
              date: new Date().toISOString().substring(0, 10),
              actor: "Eswar Reddy (Farmer / Origin Admin)",
              verified: true,
              txHash: "0xRECALL" + Math.floor(Math.random() * 100000)
            }
          ]
        };
      }
      return b;
    });

    setBatches(updated);
    setRecallReason("");
    alert(`EMERGENCY: Batch ${activeBatchId} has been designated as RECALLED. Immutable blockchain warning logs dispatched to downstream retail networks.`);
  };

  // Escrow milestone release simulator
  const releaseEscrowMilestone = () => {
    setEscrowLocked(false);
    setSmartContractConsole(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] MILESTONE DETECTED: '${contractTriggerStage}' verified.`,
      `[${new Date().toLocaleTimeString()}] EXECUTING smart contract payout trigger...`,
      `[${new Date().toLocaleTimeString()}] SUCCESS: $8,400 routed directly to Eswar Reddy's ledger wallet.`
    ]);
  };

  // Mint new tokens
  const handleMintToken = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `TKN-${mintCategory.substring(0, 4).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
    const newTkn = {
      id,
      name: `Securitized ${mintCategory} (${mintAmount} units)`,
      amount: mintAmount + (mintCategory === "Carbon Credit" ? " tCO2e" : mintCategory === "Crop Futures" ? " Tons" : " Share Units"),
      category: mintCategory
    };
    setTokensMinted(prev => [newTkn, ...prev]);
    setMintAmount("");
    alert(`SUCCESS: Minted ${mintAmount} of ${mintCategory} asset tokens into the sovereign smart contract ledger under ID ${id}.`);
  };

  // Generate zero knowledge proofs
  const generateZKPProof = () => {
    setZkpGenerating(true);
    setZkpVerified(null);
    setTimeout(() => {
      setZkpGenerating(false);
      setZkpProofKey("0xZKP_PROOF_" + Math.random().toString(36).substring(3, 11).toUpperCase());
      setZkpVerified(true);
    }, 1500);
  };

  // Pin file to IPFS
  const handlePinIPFS = () => {
    setPinningStatus(true);
    setTimeout(() => {
      setPinningStatus(false);
      const randomCID = "Qm" + Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12) + "7gKec";
      setIpfsHash(randomCID);
      alert("SUCCESS: Batch metadata, organic certificates, and temperature logs pinned to decentralized IPFS.");
    }, 1200);
  };

  // SVG-based Procedural pseudo-QR code generator
  const renderQRCodeSVG = (id: string) => {
    const seed = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const cells = [];
    const size = 15;
    
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
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
          const val = Math.sin(seed + r * 13 + c * 37);
          cells.push({ r, c, fill: val > 0 });
        }
      }
    }

    return (
      <svg viewBox="0 0 15 15" className="w-32 h-32 bg-white p-1.5 border border-slate-200 rounded-xl shadow-inner">
        {cells.map((cell, i) => (
          <rect
            key={i}
            x={cell.c}
            y={cell.r}
            width="1.05"
            height="1.05"
            fill={cell.fill ? "#0f172a" : "#f1f5f9"}
          />
        ))}
      </svg>
    );
  };

  return (
    <div id="traceability-suite" className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-6">
      
      {/* Visual Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-indigo-600 animate-pulse" /> Full Blockchain Traceability Engine
            </span>
          </div>
          <h2 className="text-slate-800 text-lg font-black uppercase tracking-tight mt-2 flex items-center gap-2">
            🌐 Web3 Sovereign Farm Traceability Portal
          </h2>
          <p className="text-slate-500 text-xs font-semibold">
            Seamlessly secure crop histories, configure self-executing smart contracts, trade tokenized options, and generate zero-knowledge privacy proofs.
          </p>
        </div>

        {/* Batch selection */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Selected Batch:</span>
          <select
            value={activeBatchId}
            onChange={(e) => {
              setActiveBatchId(e.target.value);
              setShowConsumerPortal(false);
            }}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            {batches.map(b => (
              <option key={b.id} value={b.id}>{b.id} - {b.crop}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary Sub-Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: "traceability", label: "🗺️ Traceability & QR", desc: "Farm-to-fork journeys" },
          { id: "contracts", label: "📜 Smart Contracts & DID", desc: "Escrow, DIDs & consensus" },
          { id: "tokenization", label: "🪙 Asset Tokenization", desc: "Futures & Carbon credits" },
          { id: "zkp_ipfs", label: "🔒 ZKPs & IPFS Storage", desc: "Private proof validation" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl border text-left transition-all cursor-pointer flex-1 min-w-[150px] ${
              activeSubTab === tab.id
                ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <div className="font-extrabold text-xs">{tab.label}</div>
            <div className={`text-[9px] font-semibold ${activeSubTab === tab.id ? "text-indigo-200" : "text-slate-400"}`}>{tab.desc}</div>
          </button>
        ))}
      </div>

      {/* SUBTAB 1: TRACEABILITY & JOURNEY MAP */}
      {activeSubTab === "traceability" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-2xl border bg-slate-50 border-slate-150 shadow-inner flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Harvest Origin Stamp</span>
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="mt-2.5">
                <h4 className="text-[11px] font-black text-slate-800">
                  {activeBatch.harvestDate}
                </h4>
                <span className="text-[9px] font-semibold text-slate-400 block mt-1">Plot: {activeBatch.originPlot}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl border bg-slate-50 border-slate-150 shadow-inner flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Carbon Footprint Capture</span>
                <Globe className="h-4 w-4 text-indigo-600 animate-spin" style={{ animationDuration: "12s" }} />
              </div>
              <div className="mt-2.5">
                <h4 className="text-xl font-black text-emerald-700 font-mono">
                  {activeBatch.carbonFootprintKg} Kg CO₂ / Kg
                </h4>
                <span className="text-[9px] font-extrabold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded inline-block mt-1">
                  Low Emissions Verified
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl border bg-slate-50 border-slate-150 shadow-inner flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Reputation & Seals</span>
                <Award className="h-4 w-4 text-amber-500" />
              </div>
              <div className="mt-2.5 space-y-1">
                <div className="text-[9.5px] font-black text-slate-700">
                  🌿 USDA ID: <span className="font-mono text-slate-500">{activeBatch.organicCertId}</span>
                </div>
                <div className="text-[9.5px] font-black text-slate-700">
                  🤝 FairTrade: <span className="font-mono text-slate-500">{activeBatch.fairTradeCertId}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl border bg-slate-50 border-slate-150 shadow-inner flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Current Batch State</span>
                <Truck className="h-4 w-4 text-blue-600" />
              </div>
              <div className="mt-2.5">
                <h4 className={`text-xl font-black font-mono uppercase ${
                  activeBatch.status === "Recalled" ? "text-red-600 animate-pulse" : "text-slate-800"
                }`}>
                  {activeBatch.status}
                </h4>
                <span className="text-[9px] text-slate-400 font-bold mt-0.5">On-chain validated path</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 p-5 bg-slate-50 border border-slate-150 rounded-2xl">
                
                <div className="md:col-span-4 flex flex-col items-center justify-center space-y-3 bg-white p-4 rounded-xl border">
                  {renderQRCodeSVG(activeBatch.id)}
                  <div className="text-center">
                    <span className="text-[8px] text-slate-400 font-extrabold uppercase">Blockchain Scan Tag</span>
                    <div className="text-[10px] font-black text-slate-700 font-mono">{activeBatch.id}</div>
                  </div>

                  <button
                    onClick={() => setShowConsumerPortal(!showConsumerPortal)}
                    className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-[10px] cursor-pointer transition-colors flex items-center justify-center gap-1"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {showConsumerPortal ? "Close Consumer Receipt" : "Show Consumer View"}
                  </button>
                </div>

                <div className="md:col-span-8 space-y-3">
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <History className="h-4.5 w-4.5 text-indigo-600" />
                    Farm-To-Fork Immutable Ledger Journey
                  </h4>

                  <div className="space-y-3 relative pl-4 border-l border-slate-200">
                    {activeBatch.journey.map((step, idx) => (
                      <div key={idx} className="relative">
                        <span className={`absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full ${
                          step.verified ? "bg-emerald-500 border border-emerald-200" : "bg-slate-300 border border-slate-100 animate-pulse"
                        }`}></span>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                            <span className="font-extrabold text-slate-800">{step.stage}</span>
                            <span className="text-[9px] font-bold text-slate-400 font-mono bg-white px-1.5 py-0.5 rounded border">
                              {step.date}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                            Location: <span className="text-slate-700 font-extrabold">{step.location}</span> • Actor: <span className="text-slate-700 font-bold">{step.actor}</span>
                          </p>
                          {step.verified && (
                            <div className="text-[8.5px] font-mono text-emerald-600 flex justify-between items-center bg-white border border-emerald-50 px-2 py-0.5 rounded-md">
                              <span>Verified Block Stamp</span>
                              <span>Tx: {step.txHash}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {showConsumerPortal && (
                <div className="p-5 bg-gradient-to-br from-emerald-50 to-indigo-50 border border-indigo-200 rounded-2xl space-y-4 shadow-md transition-all">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[9px] bg-indigo-600 text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Consumer Transparency Hub
                      </span>
                      <h4 className="text-base font-extrabold text-slate-800">
                        Retail Receipt Verification Gateway
                      </h4>
                    </div>
                    <button
                      onClick={() => setShowConsumerPortal(false)}
                      className="text-xs font-black text-slate-400 hover:text-slate-600"
                    >
                      ✕ Close
                    </button>
                  </div>

                  <div className="p-4 bg-white/90 border rounded-xl space-y-3 text-[11px] leading-relaxed text-slate-600 font-semibold">
                    <div className="flex items-center gap-2 border-b pb-2">
                      <ShieldCheck className="h-5 w-5 text-emerald-600" />
                      <div>
                        <span className="font-black text-slate-800">100% Cryptographic Legitimacy Stamp:</span> This batch has passed APEDA chemical standards and is fully tracked from seed to cargo storage container.
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 font-mono">
                      <div>🌾 Crop Category: <span className="text-slate-800 font-bold">{activeBatch.crop}</span></div>
                      <div>📊 Cultivar Variety: <span className="text-slate-800 font-bold">{activeBatch.variety}</span></div>
                      <div>🔬 Soil Origin: <span className="text-slate-800 font-bold">{activeBatch.originPlot}</span></div>
                      <div>⚓ Transport Carrier: <span className="text-slate-800 font-bold">NH44 Fleet Delivery</span></div>
                    </div>

                    {activeBatch.status === "Recalled" ? (
                      <div className="p-3 bg-red-100 text-red-900 border border-red-200 rounded-xl flex gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
                        <div>
                          <span className="font-bold uppercase text-[10px] block text-red-800">WARNING: DO NOT CONSUME</span>
                          This batch has been flagged with an active recall code due to logistics temperature discrepancies.
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 bg-emerald-100 text-emerald-900 rounded-xl font-bold flex gap-1.5 items-center justify-center">
                        ✓ Verified Genuine Product (Anti-Counterfeit Certified)
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-4 space-y-5">
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl shadow-inner space-y-3">
                <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Thermometer className="h-4 w-4 text-rose-500 animate-pulse" />
                  Sensor Logs: Cold Storage Temperature (°C)
                </h4>

                <div className="h-[160px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activeBatch.temperatureLogs}>
                      <CartesianGrid strokeDasharray="2 2" stroke="#e2e8f0" />
                      <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: 9, fontWeight: "bold" }} />
                      <YAxis stroke="#64748b" style={{ fontSize: 9, fontWeight: "bold" }} />
                      <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                      <Line type="monotone" dataKey="temp" stroke="#e11d48" strokeWidth={2.5} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="humidity" stroke="#2563eb" strokeWidth={1.5} dot={{ r: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex justify-between text-[9px] font-bold text-slate-500">
                  <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-rose-500 inline-block"></span> Temp (°C)</span>
                  <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-blue-500 inline-block"></span> Humidity (%)</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-3">
                <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-red-500 animate-bounce" />
                  Safety Recall Management Panel
                </h4>

                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                  If temperature thresholds or quality audits fail, flag the batch immediately. All retail databases scanning the QR code will instantly lock out checkout transactions.
                </p>

                <form onSubmit={triggerRecall} className="space-y-3">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Discrepancy Justification</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Silo temperature spikes past 28°C..."
                      value={recallReason}
                      onChange={(e) => setRecallReason(e.target.value)}
                      className="w-full bg-white border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs cursor-pointer transition-colors"
                  >
                    Broadcast Batch Recall Trigger
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: SMART CONTRACTS & DIDS */}
      {activeSubTab === "contracts" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          
          {/* Digital Self-Sovereign Identity */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-5 bg-slate-50 border rounded-2xl space-y-4">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <User className="h-4.5 w-4.5 text-emerald-600" /> Self-Sovereign Digital Identity (DID)
              </h3>
              <p className="text-[10.5px] text-slate-500 font-semibold leading-normal">
                Your credentials are secure, private, and managed by you. Verification claims are backed by peer-reviewed co-op multi-sigs.
              </p>

              <div className="bg-white p-4 border rounded-xl space-y-3 text-xs">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-slate-500 font-bold">DID Identifier:</span>
                  <span className="font-mono text-[9.5px] font-black text-slate-800">did:agri:eswar_reddy_punjab_109</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-slate-500 font-bold">Identity Status:</span>
                  <span className="text-emerald-700 font-black flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4" /> ACTIVE & AUDITED
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold">Aadhaar Validation:</span>
                  <span className="text-indigo-700 font-extrabold">Validated (Cryptographic Proof)</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDidVerified(!didVerified);
                    alert("DID signature updated and rebroadcast to the decentralized registry.");
                  }}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs"
                >
                  Regenerate Identity Proof
                </button>
                <button
                  type="button"
                  onClick={() => alert("Immutable verification claims exported as JSON-LD data.")}
                  className="bg-white border border-slate-200 px-3 rounded-lg text-slate-600 hover:bg-slate-50 text-xs font-bold"
                >
                  Export Claim
                </button>
              </div>
            </div>

            {/* Consensus Selector */}
            <div className="p-5 bg-slate-50 border rounded-2xl space-y-4">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="h-4.5 w-4.5 text-indigo-600" /> Consensus Mechanism Simulator
              </h3>
              <p className="text-[10.5px] text-slate-500 font-semibold">
                Compare the performance and green-metrics between Proof of Authority (PoA) and Proof of Stake (PoS).
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedConsensus("PoA")}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    selectedConsensus === "PoA"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-white text-slate-600 border-slate-200"
                  }`}
                >
                  Proof of Authority (PoA)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedConsensus("PoS")}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    selectedConsensus === "PoS"
                      ? "bg-indigo-50 text-indigo-800 border-indigo-200"
                      : "bg-white text-slate-600 border-slate-200"
                  }`}
                >
                  Proof of Stake (PoS)
                </button>
              </div>

              <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2 text-[10px] font-mono">
                <div className="flex justify-between">
                  <span>Selected Node Type:</span>
                  <span className="text-emerald-400 font-black">{selectedConsensus === "PoA" ? "Cooperative Validator (PoA)" : "Staking Pool Validator"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Block Time:</span>
                  <span>{selectedConsensus === "PoA" ? "0.5 seconds" : "4.5 seconds"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Energy Footprint:</span>
                  <span className="text-emerald-400">{selectedConsensus === "PoA" ? "0.0001 kWh / Tx (Ultra-Low)" : "0.015 kWh / Tx"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Contract Escrow Release */}
          <div className="lg:col-span-7 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 flex flex-col justify-between space-y-4 shadow-md">
            <div className="space-y-1.5 border-b border-slate-800 pb-3">
              <span className="text-[8px] bg-indigo-600/20 text-indigo-400 border border-indigo-900/40 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
                Sovereign Smart Contract Controller
              </span>
              <h3 className="text-white text-sm font-black uppercase flex items-center gap-1.5">
                📜 Self-Executing Escrow Contract #AGRI-ESC-9092
              </h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                  <span className="text-[8.5px] text-slate-400 uppercase font-black block">Contract Status</span>
                  <span className={`font-extrabold text-[12.5px] block ${escrowLocked ? "text-amber-400 animate-pulse" : "text-emerald-400"}`}>
                    {escrowLocked ? "🔒 ESCROW LOCKED" : "🔓 FUNDS RELEASED"}
                  </span>
                </div>
                <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                  <span className="text-[8.5px] text-slate-400 uppercase font-black block">Total Escrow Vault Value</span>
                  <span className="text-white font-mono text-[12.5px] font-black block">$8,400 USD</span>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl space-y-3 text-xs leading-normal font-semibold">
                <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider block">Escrow Trigger Parameters</span>
                <p>
                  Payout of <strong>$8,400 USD</strong> is locked in deep escrow. Funds will be deposited to the farmer's wallet immediately when downstream logistics verify the milestone step:
                </p>

                <div className="flex items-center gap-2">
                  <select
                    value={contractTriggerStage}
                    onChange={(e) => setContractTriggerStage(e.target.value)}
                    className="bg-slate-800 border border-slate-700 text-white px-2 py-1 text-xs rounded font-bold cursor-pointer outline-none"
                  >
                    <option value="Transport dispatched">Transport Dispatched (NH44 Fleet)</option>
                    <option value="Retail Distribution Gate">Retail Distribution Gate (ITC Terminal)</option>
                    <option value="Consumer Scan">Final Consumer Scan Verification</option>
                  </select>
                  <button
                    onClick={releaseEscrowMilestone}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-black"
                  >
                    Trigger Milestone Verification
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[8.5px] text-slate-400 uppercase font-black tracking-wide block">Contract Execution Logs</span>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 max-h-[140px] overflow-y-auto font-mono text-[9.5px] text-slate-300 space-y-1">
                {smartContractConsole.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: ASSET & FUTURES TOKENIZATION */}
      {activeSubTab === "tokenization" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          
          {/* Minting Form */}
          <div className="lg:col-span-5 bg-slate-50 border rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Coins className="h-4.5 w-4.5 text-indigo-600" /> Sovereign Token Minting Panel
            </h3>
            <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed">
              Tokenize your farm's hard assets, forward crop futures contract volumes, or carbon offset logs to gain access to immediate cooperative liquidity pools.
            </p>

            <form onSubmit={handleMintToken} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[9.5px] font-black text-slate-500 uppercase">Token Category</label>
                <select
                  value={mintCategory}
                  onChange={(e) => setMintCategory(e.target.value)}
                  className="w-full bg-white border text-xs font-bold rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
                >
                  <option value="Carbon Credit">Carbon Credit Tokens (Verified No-Till)</option>
                  <option value="Crop Futures">Crop Futures Options (Autumn Basmati)</option>
                  <option value="Farm Asset">Physical Farm Land Equity shares</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[9.5px] font-black text-slate-500 uppercase">Collateral Volume Amount</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 12.5"
                  value={mintAmount}
                  onChange={(e) => setMintAmount(e.target.value)}
                  className="w-full bg-white border text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-lg text-xs shadow-sm"
              >
                Mint Sovereign Asset Token
              </button>
            </form>
          </div>

          {/* Tokenized Portfolio ledger */}
          <div className="lg:col-span-7 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-1">
              <span className="text-[8px] bg-emerald-600/20 text-emerald-400 border border-emerald-900/40 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
                Active Token Portfolio
              </span>
              <h3 className="text-white text-sm font-black uppercase flex items-center gap-1.5">
                🪙 Securitized Farm Token Balances
              </h3>
            </div>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {tokensMinted.map((t) => (
                <div key={t.id} className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl flex justify-between items-center text-xs">
                  <div className="space-y-1">
                    <span className="font-extrabold text-slate-100">{t.name}</span>
                    <div className="flex gap-1.5 text-[9px] font-bold text-slate-400">
                      <span className="text-indigo-400">{t.id}</span>
                      <span>•</span>
                      <span>Category: {t.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-black text-emerald-400 text-sm block">{t.amount}</span>
                    <button
                      onClick={() => alert(`Initiated liquidity auction routing for token ${t.id}`)}
                      className="text-[9px] text-indigo-400 hover:text-indigo-200 underline font-bold uppercase tracking-wide block"
                    >
                      Trade Options &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[9px] text-slate-400 font-semibold leading-relaxed italic border-t border-slate-800 pt-3">
              *Tokens minted here comply with ERC-1155 smart standard standards for seamless integration with national commodity exchange liquidity grids.
            </p>
          </div>
        </div>
      )}

      {/* SUBTAB 4: ZK-PROOFS & IPFS SECURE DECENTRALIZED STORAGE */}
      {activeSubTab === "zkp_ipfs" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          
          {/* Zero Knowledge Proof Sandbox */}
          <div className="lg:col-span-6 p-5 bg-slate-50 border rounded-2xl space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="h-4.5 w-4.5 text-indigo-600" /> Privacy-Preserving Zero-Knowledge Proofs (ZKP)
            </h3>
            <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed">
              Generate cryptographic proof that your basmati rice meets organic parameters and soil carbon thresholds, <strong>without revealing</strong> your exact farm coordinates or financial values to international auditors.
            </p>

            <div className="bg-white p-4 border rounded-xl space-y-3 text-xs font-semibold text-slate-600">
              <div className="flex justify-between">
                <span>Proof Type:</span>
                <span className="text-slate-800 font-bold">ZKP-Snark Organic Certification</span>
              </div>
              <div className="flex justify-between">
                <span>Private inputs (Hidden):</span>
                <span className="text-slate-400 italic">Farm Location, Land Area, Revenue Bids</span>
              </div>
              <div className="flex justify-between">
                <span>Public statement (Proven):</span>
                <span className="text-emerald-700 font-extrabold">"Soil pesticide index matches zero-residue limits"</span>
              </div>

              {zkpProofKey && (
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg font-mono text-[9px] text-emerald-800 space-y-1 break-all">
                  <span className="font-bold block uppercase text-[8px] text-slate-400">Cryptographic Verification Key</span>
                  <span>{zkpProofKey}</span>
                </div>
              )}
            </div>

            <button
              onClick={generateZKPProof}
              disabled={zkpGenerating}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-lg text-xs flex items-center justify-center gap-1.5"
            >
              {zkpGenerating ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Generating Snark Proof...
                </>
              ) : (
                <>
                  <Key className="h-4 w-4" />
                  Generate Zero-Knowledge Proof
                </>
              )}
            </button>
          </div>

          {/* Decentrailized storage IPFS Pinning */}
          <div className="lg:col-span-6 p-5 bg-slate-50 border rounded-2xl space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Database className="h-4.5 w-4.5 text-indigo-600" /> Decentralized Metadata Storage (IPFS)
            </h3>
            <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed">
              Store large telemetry logs, high-resolution multi-spectral NDVI maps, and chemical reports securely across decentralized peer-to-peer IPFS nodes.
            </p>

            <div className="bg-white p-4 border rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Storage Type:</span>
                <span className="text-slate-800 font-bold">InterPlanetary File System (IPFS)</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 font-bold">Decentralized Content ID (CID):</span>
                <div className="p-2 bg-slate-100 border rounded-lg font-mono text-[10px] text-slate-700 break-all select-all">
                  ipfs://{ipfsHash}
                </div>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-semibold">Verification Node Pin Status:</span>
                <span className="text-emerald-700 font-black">ACTIVE (Pinned on 12 gateway nodes)</span>
              </div>
            </div>

            <button
              onClick={handlePinIPFS}
              disabled={pinningStatus}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-lg text-xs flex items-center justify-center gap-1.5"
            >
              {pinningStatus ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Pinning File Metadata...
                </>
              ) : (
                <>
                  <Server className="h-4 w-4" />
                  Pin Current Batch to IPFS Nodes
                </>
              )}
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
