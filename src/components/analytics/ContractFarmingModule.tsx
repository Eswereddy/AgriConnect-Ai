import React, { useState, useMemo } from "react";
import {
  FileText,
  CheckSquare,
  Shield,
  DollarSign,
  UserCheck,
  Scale,
  Star,
  Lock,
  AlertCircle,
  Cpu,
  Layers,
  Globe,
  HelpCircle,
  Activity,
  Clock,
  ArrowRight,
  Coins,
  BookOpen,
  Award,
  Signature,
  FileCheck,
  AlertTriangle,
  History,
  TrendingUp,
  User,
  HeartHandshake
} from "lucide-react";

interface Milestone {
  id: string;
  name: string;
  percentage: number;
  amount: number;
  status: "Pending" | "In Escrow" | "Released" | "On Hold";
  blockchainTx?: string;
  completedAt?: string;
}

interface Contract {
  id: string;
  buyerName: string;
  buyerRating: number;
  farmerRating: number;
  crop: string;
  quantityMetricTons: number;
  preHarvestPricePerTon: number;
  floorPricePerTon: number;
  totalEstimatedValue: number;
  qualityParameters: {
    moistureTarget: string;
    grainLengthMin: string;
    impuritiesMax: string;
    proteinTarget: string;
  };
  penalties: {
    moistureDeviation: string;
    lateDelivery: string;
    residueInfestation: string;
  };
  complianceList: {
    farmActRegistered: boolean;
    soilHealthCertified: boolean;
    waterAccessVetted: boolean;
    pesticideLevelCompliant: boolean;
  };
  insuranceBacked: {
    provider: string;
    policyNumber: string;
    premiumAmount: number;
    coverageLimit: number;
  };
  escrowLedger: {
    totalEscrowed: number;
    releasedToFarmer: number;
    disputedHold: number;
    status: "Fully Funded" | "Partially Funded" | "Liquidated";
  };
  dispute?: {
    status: "None" | "Raised" | "In Arbitration" | "Resolved";
    reason?: string;
    arbitrator?: string;
    resolutionTerm?: string;
  };
  status: "Draft" | "Signed" | "Active" | "Completed";
  farmerSigned: boolean;
  buyerSigned: boolean;
  farmerSignatureText?: string;
  milestones: Milestone[];
}

export default function ContractFarmingModule() {
  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: "CON-7798",
      buyerName: "Cargill Agribusiness India Ltd",
      buyerRating: 4.8,
      farmerRating: 4.7,
      crop: "Pusa Basmati 1121 Rice",
      quantityMetricTons: 15,
      preHarvestPricePerTon: 840,
      floorPricePerTon: 780,
      totalEstimatedValue: 12600,
      qualityParameters: {
        moistureTarget: "12% - 14%",
        grainLengthMin: "8.2 mm",
        impuritiesMax: "1.5%",
        proteinTarget: "8.5%"
      },
      penalties: {
        moistureDeviation: "0.5% price reduction per 1% extra moisture",
        lateDelivery: "$50 charge per day past Nov 15 deadline",
        residueInfestation: "Immediate rejection if herbicide residues exceed FSSAI limits"
      },
      complianceList: {
        farmActRegistered: true,
        soilHealthCertified: true,
        waterAccessVetted: true,
        pesticideLevelCompliant: true
      },
      insuranceBacked: {
        provider: "Agriculture Insurance Company of India (AIC)",
        policyNumber: "AIC-CROP-99812",
        premiumAmount: 380,
        coverageLimit: 11500
      },
      escrowLedger: {
        totalEscrowed: 12600,
        releasedToFarmer: 2520,
        disputedHold: 0,
        status: "Fully Funded"
      },
      dispute: {
        status: "None"
      },
      status: "Active",
      farmerSigned: true,
      buyerSigned: true,
      farmerSignatureText: "Eswar Reddy J",
      milestones: [
        {
          id: "m-1",
          name: "Agreement Signing & Escrow Lock",
          percentage: 20,
          amount: 2520,
          status: "Released",
          blockchainTx: "0x7a83c...f102d",
          completedAt: "2026-05-12 10:44 UTC"
        },
        {
          id: "m-2",
          name: "Mid-Term Irrigation & Sowing Audit",
          percentage: 30,
          amount: 3780,
          status: "In Escrow",
          blockchainTx: "0x4b2a9...d310e"
        },
        {
          id: "m-3",
          name: "Harvest Grade Certificate & Warehouse Delivery",
          percentage: 50,
          amount: 6300,
          status: "Pending"
        }
      ]
    },
    {
      id: "CON-4451",
      buyerName: "ITC Foods Division Limited",
      buyerRating: 4.9,
      farmerRating: 4.9,
      crop: "HD-2967 Amber Wheat",
      quantityMetricTons: 25,
      preHarvestPricePerTon: 620,
      floorPricePerTon: 580,
      totalEstimatedValue: 15500,
      qualityParameters: {
        moistureTarget: "11% - 13%",
        grainLengthMin: "N/A (Standard Grain)",
        impuritiesMax: "1.0%",
        proteinTarget: "11.2%"
      },
      penalties: {
        moistureDeviation: "1% price reduction per 1% deviation",
        lateDelivery: "$40 fine per day past Nov 30 deadline",
        residueInfestation: "Full rejection if chemical content tests exceed ITC Pure Food guidelines"
      },
      complianceList: {
        farmActRegistered: true,
        soilHealthCertified: true,
        waterAccessVetted: true,
        pesticideLevelCompliant: true
      },
      insuranceBacked: {
        provider: "HDFC Ergo GIC Ltd",
        policyNumber: "HERGO-776121",
        premiumAmount: 420,
        coverageLimit: 14000
      },
      escrowLedger: {
        totalEscrowed: 15500,
        releasedToFarmer: 3100,
        disputedHold: 0,
        status: "Fully Funded"
      },
      dispute: {
        status: "None"
      },
      status: "Active",
      farmerSigned: true,
      buyerSigned: true,
      farmerSignatureText: "Eswar Reddy J",
      milestones: [
        {
          id: "m-ITC-1",
          name: "Pre-Harvest Pricing Signoff & Lockup",
          percentage: 20,
          amount: 3100,
          status: "Released",
          blockchainTx: "0xfa11b...a912c",
          completedAt: "2026-06-01 08:30 UTC"
        },
        {
          id: "m-ITC-2",
          name: "Drone-verified Tillering Phase Milestone",
          percentage: 30,
          amount: 4650,
          status: "In Escrow"
        },
        {
          id: "m-ITC-3",
          name: "Final Procurement Clearance & Moisture Grade",
          percentage: 50,
          amount: 7750,
          status: "Pending"
        }
      ]
    },
    {
      id: "CON-9912",
      buyerName: "FabIndia Organic Sourcing",
      buyerRating: 4.6,
      farmerRating: 4.8,
      crop: "Long-Staple Giza Hybrid Cotton",
      quantityMetricTons: 8,
      preHarvestPricePerTon: 1150,
      floorPricePerTon: 1050,
      totalEstimatedValue: 9200,
      qualityParameters: {
        moistureTarget: "7% - 9%",
        grainLengthMin: "34 mm staple",
        impuritiesMax: "0.5% seed hulls",
        proteinTarget: "N/A"
      },
      penalties: {
        moistureDeviation: "Reject if above 11%",
        lateDelivery: "$100 fine per day past Nov 10",
        residueInfestation: "Dispute triggers if non-organic chemical elements detected"
      },
      complianceList: {
        farmActRegistered: true,
        soilHealthCertified: true,
        waterAccessVetted: true,
        pesticideLevelCompliant: false // Needs organic certification re-audit
      },
      insuranceBacked: {
        provider: "Tata AIG General Insurance",
        policyNumber: "TAIG-COT-22819",
        premiumAmount: 290,
        coverageLimit: 8500
      },
      escrowLedger: {
        totalEscrowed: 0,
        releasedToFarmer: 0,
        disputedHold: 0,
        status: "Partially Funded"
      },
      dispute: {
        status: "Raised",
        reason: "Pesticide Level Compliance certificate validation pending third-party soil lab test",
        arbitrator: "Nandi Hills Regional Agriculture Department",
        resolutionTerm: "Final test report must show pesticide count below 0.01 ppm"
      },
      status: "Draft",
      farmerSigned: false,
      buyerSigned: true,
      milestones: [
        {
          id: "m-fab-1",
          name: "Organic Certification Validation Phase",
          percentage: 30,
          amount: 2760,
          status: "On Hold"
        },
        {
          id: "m-fab-2",
          name: "Harvest Cotton Ball picking grade evaluation",
          percentage: 70,
          amount: 6440,
          status: "Pending"
        }
      ]
    }
  ]);

  const [activeContractId, setActiveContractId] = useState<string>("CON-7798");
  const [eSignatureInput, setESignatureInput] = useState<string>("");
  const [disputeReason, setDisputeReason] = useState<string>("");
  const [selectedArbitrator, setSelectedArbitrator] = useState<string>("Central Agricultural University Expert");
  
  // Blockchain Ledger Simulator State
  const [blockchainLogs, setBlockchainLogs] = useState<Array<{
    txHash: string;
    blockNum: number;
    action: string;
    gasUsed: number;
    timestamp: string;
  }>>([
    { txHash: "0x7a83c66f5df21a08bd9a8bc47e1c8d23467e2a9bcf102d847aa3b82fd3458ef1", blockNum: 19488212, action: "Fund Escrow: CON-7798 (2520 USD)", gasUsed: 42150, timestamp: "2026-05-12 10:44 UTC" },
    { txHash: "0xfa11b988f76aa0812bd9bc7f2d34e9e1c8d2a9bccf92da8cf32b8fa58821fa91", blockNum: 19512019, action: "Fund Escrow: CON-4451 (3100 USD)", gasUsed: 42150, timestamp: "2026-06-01 08:30 UTC" },
    { txHash: "0x4b2a9cca2e78fa0a8b98e1c890fcfd2b4e8c9b678fa58fa3906a28fd3d10ee76", blockNum: 19528812, action: "Smart Contract Initialized: CON-7798 (Cargill)", gasUsed: 125400, timestamp: "2026-05-12 10:30 UTC" }
  ]);

  const activeContract = useMemo(() => {
    return contracts.find(c => c.id === activeContractId) || contracts[0];
  }, [contracts, activeContractId]);

  // Handle Sign Agreement
  const signContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eSignatureInput.trim()) {
      alert("Please type your name to complete the cryptographic e-signature.");
      return;
    }

    const updated = contracts.map(c => {
      if (c.id === activeContractId) {
        return {
          ...c,
          farmerSigned: true,
          farmerSignatureText: eSignatureInput,
          status: "Active" as const,
          escrowLedger: {
            ...c.escrowLedger,
            status: "Fully Funded" as const
          }
        };
      }
      return c;
    });

    setContracts(updated);

    // Append mock blockchain deployment transaction
    const mockTxHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const latestBlock = blockchainLogs[0] ? blockchainLogs[0].blockNum + Math.floor(Math.random() * 12) : 19540010;
    
    setBlockchainLogs(prev => [
      {
        txHash: mockTxHash,
        blockNum: latestBlock,
        action: `Contract Signed & Verified: ${activeContractId} for ${activeContract.crop}`,
        gasUsed: 84200,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC"
      },
      ...prev
    ]);

    setESignatureInput("");
  };

  // Release milestone simulation
  const triggerMilestoneRelease = (milestoneId: string) => {
    const updated = contracts.map(c => {
      if (c.id === activeContractId) {
        const revisedMilestones = c.milestones.map(m => {
          if (m.id === milestoneId) {
            return {
              ...m,
              status: "Released" as const,
              blockchainTx: "0x" + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("") + "...tx"
            };
          }
          return m;
        });

        const releasedAmt = revisedMilestones
          .filter(m => m.status === "Released")
          .reduce((sum, m) => sum + m.amount, 0);

        return {
          ...c,
          milestones: revisedMilestones,
          escrowLedger: {
            ...c.escrowLedger,
            releasedToFarmer: releasedAmt
          }
        };
      }
      return c;
    });

    setContracts(updated);

    // Block ledger log
    const mockTxHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const latestBlock = blockchainLogs[0] ? blockchainLogs[0].blockNum + 4 : 19540015;
    const targetMilestone = activeContract.milestones.find(m => m.id === milestoneId);

    setBlockchainLogs(prev => [
      {
        txHash: mockTxHash,
        blockNum: latestBlock,
        action: `Milestone Released: ${targetMilestone?.name || "Stage"} (${targetMilestone?.amount} USD)`,
        gasUsed: 52100,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC"
      },
      ...prev
    ]);
  };

  // Raise dispute
  const raiseDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeReason.trim()) {
      alert("Please provide the technical basis for the contract dispute.");
      return;
    }

    const updated = contracts.map(c => {
      if (c.id === activeContractId) {
        return {
          ...c,
          dispute: {
            status: "Raised" as const,
            reason: disputeReason,
            arbitrator: selectedArbitrator,
            resolutionTerm: "Pending independent agricultural grading lab review."
          },
          escrowLedger: {
            ...c.escrowLedger,
            disputedHold: c.totalEstimatedValue * 0.3 // hold 30% in escrow dispute lock
          }
        };
      }
      return c;
    });

    setContracts(updated);
    setDisputeReason("");

    // Block ledger log
    const mockTxHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const latestBlock = blockchainLogs[0] ? blockchainLogs[0].blockNum + 1 : 19540020;
    setBlockchainLogs(prev => [
      {
        txHash: mockTxHash,
        blockNum: latestBlock,
        action: `Dispute Logged: ${activeContractId} by Farmer - Arbitrator: ${selectedArbitrator}`,
        gasUsed: 31000,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC"
      },
      ...prev
    ]);
  };

  return (
    <div id="contract-farming-system" className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-6">
      
      {/* Banner / Title segment */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg">
              <HeartHandshake className="h-5 w-5 animate-pulse" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
              🤝 Decentralized Contract Farming & Escrow Protocol
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 font-semibold tracking-wide uppercase">
            Manage legal agreements, pre-harvest pricing covenants, dynamic multi-sig escrow, and simulated on-chain milestones
          </p>
        </div>

        {/* Contract Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Active Agreement:</span>
          <select
            value={activeContractId}
            onChange={(e) => setActiveContractId(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            {contracts.map(c => (
              <option key={c.id} value={c.id}>{c.id} - {c.buyerName.split(" ")[0]} ({c.crop.split(" ")[0]})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main KPI panel summarizing current selected contract */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Floor vs Pre-harvest price lockup */}
        <div className="p-4 rounded-2xl border bg-slate-50 border-slate-150 shadow-inner flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Locked Pre-Harvest Price</span>
            <Coins className="h-4 w-4 text-emerald-600 animate-bounce" />
          </div>
          <div className="mt-2.5">
            <h4 className="text-xl font-black text-slate-800 font-mono">
              ${activeContract.preHarvestPricePerTon} / Ton
            </h4>
            <div className="flex items-center gap-1 mt-1 text-[10px] font-semibold text-slate-500">
              <span className="text-emerald-600 font-bold">Floor Price guaranteed: ${activeContract.floorPricePerTon}</span>
            </div>
          </div>
        </div>

        {/* Escrow status and funding volume */}
        <div className="p-4 rounded-2xl border bg-slate-50 border-slate-150 shadow-inner flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Secure Escrow Lockup</span>
            <Lock className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2.5">
            <h4 className="text-xl font-black text-slate-800 font-mono">
              ${activeContract.escrowLedger.totalEscrowed.toLocaleString()} USD
            </h4>
            <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-slate-500">
              <span className={`h-1.5 w-1.5 rounded-full inline-block ${activeContract.escrowLedger.status === "Fully Funded" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`}></span>
              Status: <span className="text-slate-700 font-extrabold uppercase">{activeContract.escrowLedger.status}</span>
            </div>
          </div>
        </div>

        {/* Buyer Rating Reputation scores */}
        <div className="p-4 rounded-2xl border bg-slate-50 border-slate-150 shadow-inner flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Mutual Platform Reputation</span>
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-400" />
          </div>
          <div className="mt-2.5">
            <div className="flex gap-4 items-center">
              <div>
                <span className="block text-[8px] text-slate-400 font-black">BUYER</span>
                <span className="text-sm font-black text-slate-800">{activeContract.buyerRating} / 5.0</span>
              </div>
              <div className="border-l border-slate-200 h-6"></div>
              <div>
                <span className="block text-[8px] text-slate-400 font-black">FARMER</span>
                <span className="text-sm font-black text-slate-800">{activeContract.farmerRating} / 5.0</span>
              </div>
            </div>
            <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Excellent performance record</p>
          </div>
        </div>

        {/* Insurance backing coverage limits */}
        <div className="p-4 rounded-2xl border bg-slate-50 border-slate-150 shadow-inner flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Risk Crop Insurance</span>
            <Shield className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2.5">
            <h4 className="text-xl font-black text-slate-800 font-mono">
              ${activeContract.insuranceBacked.coverageLimit.toLocaleString()} USD
            </h4>
            <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">
              {activeContract.insuranceBacked.provider.split(" ").slice(0, 3).join(" ")}
            </p>
          </div>
        </div>
      </div>

      {/* Primary columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Contract Details, Compliance and E-Signature */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-5 bg-slate-50 border border-slate-150 rounded-2xl space-y-4">
            <div className="flex justify-between items-start">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-4.5 w-4.5 text-indigo-600" />
                Agreement Parameters & Legal Terms
              </h4>
              <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                activeContract.status === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
              }`}>
                {activeContract.status.toUpperCase()}
              </span>
            </div>

            {/* Detailed summary grids */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-bold text-[10px] uppercase">Procuring Entity:</span>
                <div className="font-extrabold text-slate-800">{activeContract.buyerName}</div>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-bold text-[10px] uppercase">Committed Harvest Volume:</span>
                <div className="font-extrabold text-slate-800">{activeContract.quantityMetricTons} Metric Tons</div>
              </div>
            </div>

            {/* Quality grade specs requirements */}
            <div className="border-t border-slate-200 pt-3.5 space-y-2">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider block">Target Procurement Quality Standard</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2 bg-white rounded-lg border text-[11px]">
                  <span className="block text-[8px] text-slate-400 font-bold uppercase">Moisture Range</span>
                  <span className="font-extrabold text-slate-700">{activeContract.qualityParameters.moistureTarget}</span>
                </div>
                <div className="p-2 bg-white rounded-lg border text-[11px]">
                  <span className="block text-[8px] text-slate-400 font-bold uppercase">Grain Length</span>
                  <span className="font-extrabold text-slate-700">{activeContract.qualityParameters.grainLengthMin}</span>
                </div>
                <div className="p-2 bg-white rounded-lg border text-[11px]">
                  <span className="block text-[8px] text-slate-400 font-bold uppercase">Max Impurities</span>
                  <span className="font-extrabold text-slate-700">{activeContract.qualityParameters.impuritiesMax}</span>
                </div>
                <div className="p-2 bg-white rounded-lg border text-[11px]">
                  <span className="block text-[8px] text-slate-400 font-bold uppercase">Protein Content</span>
                  <span className="font-extrabold text-slate-700">{activeContract.qualityParameters.proteinTarget}</span>
                </div>
              </div>
            </div>

            {/* Penalties Clause section */}
            <div className="border-t border-slate-200 pt-3.5 space-y-2">
              <span className="text-[10px] font-black text-rose-600 uppercase tracking-wider block">Penalty & Deduction Clauses (Quality Deviations)</span>
              <div className="text-[10px] leading-relaxed font-semibold text-slate-600 space-y-1.5">
                <div className="flex gap-2">
                  <span className="text-rose-500 font-extrabold">🚨 Moisture penalty:</span>
                  <span>{activeContract.penalties.moistureDeviation}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-rose-500 font-extrabold">🚨 Delivery breach:</span>
                  <span>{activeContract.penalties.lateDelivery}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-rose-500 font-extrabold">🚨 Residue clause:</span>
                  <span>{activeContract.penalties.residueInfestation}</span>
                </div>
              </div>
            </div>

            {/* Legal Compliance checks */}
            <div className="border-t border-slate-200 pt-3.5 space-y-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Mandatory Regulatory Compliance Audits</span>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className={activeContract.complianceList.farmActRegistered ? "text-emerald-500" : "text-rose-500"}>
                    {activeContract.complianceList.farmActRegistered ? "✓" : "✗"}
                  </span>
                  <span>Farm Acts APMC Registration</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={activeContract.complianceList.soilHealthCertified ? "text-emerald-500" : "text-rose-500"}>
                    {activeContract.complianceList.soilHealthCertified ? "✓" : "✗"}
                  </span>
                  <span>Soil Health Nutrient Certification</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={activeContract.complianceList.waterAccessVetted ? "text-emerald-500" : "text-rose-500"}>
                    {activeContract.complianceList.waterAccessVetted ? "✓" : "✗"}
                  </span>
                  <span>Sustainable Water Access vetting</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={activeContract.complianceList.pesticideLevelCompliant ? "text-emerald-500" : "text-rose-500"}>
                    {activeContract.complianceList.pesticideLevelCompliant ? "✓" : "✗"}
                  </span>
                  <span>Max Residue pesticide limits</span>
                </div>
              </div>
            </div>

            {/* Electronic Cryptographic Signature flow */}
            <div className="border-t border-slate-200 pt-4 space-y-3">
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Signature className="h-4 w-4 text-indigo-600" />
                Multi-Party Signature Validation Status
              </span>

              <div className="flex flex-col sm:flex-row justify-between items-stretch gap-4">
                {/* Buyer signature stamp */}
                <div className="p-3 bg-white rounded-xl border border-dashed flex items-center gap-3 w-full">
                  <UserCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div className="text-[11px]">
                    <span className="block text-[8px] text-slate-400 font-extrabold uppercase">Buyer Authorized Stamp</span>
                    <span className="font-extrabold text-slate-700 font-mono">ITC Procurement Rep (#22)</span>
                    <span className="block text-[8px] text-emerald-600 font-bold">Signed via Polygon Wallet Hash</span>
                  </div>
                </div>

                {/* Farmer signature stamp / interactive submission */}
                <div className="p-3 bg-white rounded-xl border flex flex-col justify-between w-full">
                  {activeContract.farmerSigned ? (
                    <div className="flex items-center gap-3">
                      <FileCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                      <div className="text-[11px]">
                        <span className="block text-[8px] text-slate-400 font-extrabold uppercase">Farmer Handshake Signature</span>
                        <span className="font-extrabold text-indigo-700 italic font-serif">/ {activeContract.farmerSignatureText} /</span>
                        <span className="block text-[8px] text-emerald-600 font-bold">Timestamp: Cryptographically Secured</span>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={signContract} className="space-y-2">
                      <label className="block text-[9px] font-bold text-slate-400 uppercase">Type full name to sign this agreement</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          placeholder="e.g. Eswar Reddy J"
                          value={eSignatureInput}
                          onChange={(e) => setESignatureInput(e.target.value)}
                          className="w-full bg-slate-50 border rounded-lg px-2 py-1 text-xs focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                        >
                          Sign Contract
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Automated Milestones, Escrow & Disputes */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Automated Escrow Payment Milestones tracking */}
          <div className="p-5 bg-white border border-slate-150 rounded-2xl space-y-4">
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="h-4.5 w-4.5 text-indigo-600" />
              Automated Payment Milestones Ledger
            </h4>

            <div className="space-y-3.5">
              {activeContract.milestones.map((m, idx) => (
                <div key={m.id} className="p-3 bg-slate-50 rounded-xl border border-slate-150 space-y-2 relative">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-bold text-slate-400 font-mono">Milestone #{idx + 1} ({m.percentage}%)</span>
                      <h5 className="text-[11px] font-extrabold text-slate-800">{m.name}</h5>
                    </div>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                      m.status === "Released" ? "bg-emerald-100 text-emerald-800" :
                      m.status === "In Escrow" ? "bg-blue-100 text-blue-800" :
                      m.status === "On Hold" ? "bg-red-100 text-red-800" : "bg-slate-200 text-slate-600"
                    }`}>
                      {m.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-bold pt-1.5 border-t border-slate-200/60 text-slate-600">
                    <span className="font-mono text-slate-800">${m.amount.toLocaleString()} USD</span>
                    {m.status === "Released" && m.blockchainTx && (
                      <span className="text-emerald-600 font-mono text-[9px]">Tx: {m.blockchainTx}</span>
                    )}

                    {m.status === "In Escrow" && (
                      <button
                        onClick={() => triggerMilestoneRelease(m.id)}
                        className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[9px] cursor-pointer transition-colors"
                        title="Simulate on-chain release criteria validation"
                      >
                        Release Payment
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dispute Resolution System & Arbitration */}
          <div className="p-5 bg-slate-50 border border-slate-150 rounded-2xl space-y-4">
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="h-4.5 w-4.5 text-indigo-600" />
              Agronomist Dispute & Arbitration Hub
            </h4>

            {activeContract.dispute && activeContract.dispute.status !== "None" ? (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2 text-slate-800 text-[11px]">
                <div className="flex items-center gap-1.5 font-bold text-red-800 uppercase text-[9px]">
                  <AlertTriangle className="h-4 w-4 text-red-600" /> ACTIVE DISPUTE RAISED
                </div>
                <div>
                  <span className="font-extrabold">Filing Grievance:</span> {activeContract.dispute.reason}
                </div>
                <div>
                  <span className="font-extrabold">Appointed Arbitrator:</span> {activeContract.dispute.arbitrator}
                </div>
                <div className="p-2 bg-white rounded-lg border border-red-100 text-[10px] text-slate-600 leading-relaxed font-semibold">
                  <span className="font-bold text-slate-800">Arbitration Term:</span> {activeContract.dispute.resolutionTerm}
                </div>
              </div>
            ) : (
              <form onSubmit={raiseDispute} className="space-y-3">
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                  Have a dispute regarding moisture grades or yield quality deductions? File an independent arbitration request directly to regional agronomists.
                </p>

                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">Arbitrator Body</label>
                  <select
                    value={selectedArbitrator}
                    onChange={(e) => setSelectedArbitrator(e.target.value)}
                    className="w-full bg-white border rounded-lg p-1.5 text-xs focus:outline-none"
                  >
                    <option value="Central Agricultural University Expert">Central Agricultural University Expert Panel</option>
                    <option value="Government Soil Health Lab Commissioner">Government Soil Health Lab Commissioner</option>
                    <option value="District APMC Board Ombudsman">District APMC Board Ombudsman</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">Grievance / Issue details</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Moisture deduction offset calculated incorrectly..."
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    className="w-full bg-white border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs cursor-pointer transition-colors"
                >
                  File Formal Dispute
                </button>
              </form>
            )}
          </div>

          {/* Blockchain Node Block receipt logs */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Cpu className="h-3.5 w-3.5 text-indigo-400 animate-spin" /> Live Ethereum Node Logs
              </span>
              <span className="text-[8px] bg-slate-800 text-indigo-300 font-extrabold px-1.5 py-0.5 rounded font-mono">MAINNET SYNCED</span>
            </div>

            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
              {blockchainLogs.map((log, i) => (
                <div key={i} className="text-[9px] font-mono leading-relaxed space-y-0.5 border-b border-slate-800 pb-2 last:border-b-0">
                  <div className="flex justify-between font-bold">
                    <span className="text-indigo-400">{log.action}</span>
                    <span className="text-slate-500">Block #{log.blockNum}</span>
                  </div>
                  <div className="text-slate-500 text-[8px] truncate">Tx: {log.txHash}</div>
                  <div className="text-slate-500 text-[8px] flex justify-between">
                    <span>Gas: {log.gasUsed} limits</span>
                    <span>{log.timestamp}</span>
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
