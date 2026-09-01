import React, { useState } from "react";
import {
  Link,
  ShieldCheck,
  Cpu,
  Globe,
  QrCode,
  FileText,
  CheckCircle2,
  DollarSign,
  Leaf,
  Award,
  Sparkles,
  Lock,
  RefreshCw,
  ExternalLink,
  Database,
  Search,
  ArrowRight,
  Download,
  Share2,
  Building2,
  Activity,
  TrendingUp,
  Coins,
  Users,
  CloudRain,
  Truck,
  Scale,
  FileCode,
  Terminal,
  Check,
  AlertTriangle,
  ChevronRight,
  Play,
  Copy,
  Zap,
  Calendar,
  MapPin,
  Fingerprint,
  Layers,
  HelpCircle,
  Clock,
  Eye,
  Send,
  Sliders,
  CheckCircle,
  X,
  UploadCloud,
  CheckSquare
} from "lucide-react";

// Types for Blockchain & Carbon Credit System
export interface TraceabilityBatch {
  batchId: string;
  farmerName: string;
  farmerLocation: string;
  farmerPhoto?: string;
  cropName: string;
  cropVariety: string;
  harvestDate: string;
  quantityTons: number;
  qualityGrade: "Grade A Premium" | "Grade A" | "Grade B" | "Export Quality";
  organicCertified: boolean;
  fairTradeCertified: boolean;
  carbonFootprintKgPerKg: number;
  ipfsHash: string;
  blockchainTxHash: string;
  currentStageIndex: number;
  stages: {
    stageName: string;
    location: string;
    date: string;
    details: string;
    verifiedBy: string;
    ipfsHash: string;
    txHash: string;
    completed: boolean;
  }[];
}

export interface FarmingContract {
  id: string;
  contractAddress: string;
  farmerName: string;
  buyerName: string;
  cropName: string;
  quantityTons: number;
  pricePerQuintal: number;
  totalValueRs: number;
  advancePercentage: number;
  advanceEscrowRs: number;
  deliveryDate: string;
  deliveryLocation: string;
  qualitySpecs: string;
  penaltyClause: string;
  status: "Draft" | "Escrow Locked" | "In Harvest" | "Quality Inspection" | "Completed" | "Disputed";
  auditTrail: { timestamp: string; action: string; actor: string; txHash: string }[];
}

export interface CarbonCreditListing {
  id: string;
  creditId: string;
  farmerName: string;
  farmRegion: string;
  acreage: number;
  creditsAvailableTons: number;
  pricePerTonRs: number;
  verificationStandard: "Verra (VCS)" | "Gold Standard" | "NPOP Organic Carbon" | "CDM";
  sequestrationMethod: string;
  status: "Listed" | "Pending Verification" | "Retired";
  farmerWallet: string;
  ipfsReportHash: string;
}

export interface OrganicCertification {
  id: string;
  certNumber: string;
  farmerName: string;
  farmLocation: string;
  certType: "India Organic (NPOP)" | "USDA Organic" | "EU Organic" | "Fair Trade Certified";
  issuedDate: string;
  expiryDate: string;
  status: "Approved" | "Under Review" | "Pending Inspection" | "Expired";
  blockchainHash: string;
  aiComplianceScore: number;
  documentsIpfs: string[];
}

export default function BlockchainCarbonEngine() {
  const [activeTab, setActiveTab] = useState<
    "traceability" | "contracts" | "carbon" | "certification" | "corporate" | "oracles" | "security"
  >("traceability");

  // Wallet & Network State
  const [walletConnected, setWalletConnected] = useState<boolean>(true);
  const [walletAddress, setWalletAddress] = useState<string>("0x71C8a94F2B39A019b8429C71eE39");
  const [selectedNetwork, setSelectedNetwork] = useState<"Polygon Mainnet" | "Ethereum Goerli" | "Hyperledger Fabric">(
    "Polygon Mainnet"
  );
  const [accTokenBalance, setAccTokenBalance] = useState<number>(1250);
  const [maticBalance, setMaticBalance] = useState<number>(4.82);

  // Search and Filter States
  const [batchSearchQuery, setBatchSearchQuery] = useState<string>("B-2026-001");
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Carbon Credit Calculator States
  const [calcAcres, setCalcAcres] = useState<number>(12);
  const [calcNoTill, setCalcNoTill] = useState<boolean>(true);
  const [calcCoverCrop, setCalcCoverCrop] = useState<boolean>(true);
  const [calcAgroforestryTrees, setCalcAgroforestryTrees] = useState<number>(25);
  const [calcFertilizerReducePct, setCalcFertilizerReducePct] = useState<number>(30);
  const [calcSolarPump, setCalcSolarPump] = useState<boolean>(true);
  const [calcDripIrrigation, setCalcDripIrrigation] = useState<boolean>(true);
  const [calcPricePerTon, setCalcPricePerTon] = useState<number>(1200);

  // Corporate Offset States
  const [corpName, setCorpName] = useState<string>("GreenAgri Global FMCG Corp");
  const [corpEmissionsTons, setCorpEmissionsTons] = useState<number>(500);
  const [selectedCreditsToBuy, setSelectedCreditsToBuy] = useState<number>(500);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  // Seed Data: Traceability Batches
  const [batches, setBatches] = useState<TraceabilityBatch[]>([
    {
      batchId: "B-2026-001",
      farmerName: "Rajesh Patel",
      farmerLocation: "Sangli, Maharashtra",
      farmerPhoto: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80",
      cropName: "Wheat",
      cropVariety: "PBW 343 Bio-Fortified",
      harvestDate: "15-Jul-2026",
      quantityTons: 15,
      qualityGrade: "Grade A Premium",
      organicCertified: true,
      fairTradeCertified: true,
      carbonFootprintKgPerKg: 0.85,
      ipfsHash: "QmXyZ987123abcdef456789901234567890abcdef",
      blockchainTxHash: "0x8f2a4c1e90b27163c45df01932849102834710129a8f",
      currentStageIndex: 6,
      stages: [
        {
          stageName: "Seed Purchase",
          location: "National Seed Corp, Pune",
          date: "01-Nov-2025",
          details: "Certified Disease-Free PBW 343 Seeds, Batch #NSC-882",
          verifiedBy: "State Agriculture Officer",
          ipfsHash: "QmSeedHash111222333444555",
          txHash: "0x1111a4c1e90b27163c45df01932849102834710129a8f",
          completed: true
        },
        {
          stageName: "Planting & Sowing",
          location: "Green Field Farm Plot #4, Sangli",
          date: "10-Nov-2025",
          details: "GPS: 16.8524° N, 74.5815° E. Sown via Precision Seed Drill.",
          verifiedBy: "IoT Field Sensor #GPS-902",
          ipfsHash: "QmSowHash222333444555666",
          txHash: "0x2222a4c1e90b27163c45df01932849102834710129a8f",
          completed: true
        },
        {
          stageName: "Growing & Irrigation",
          location: "Green Field Farm Plot #4, Sangli",
          date: "15-Nov-2025 - 10-Jul-2026",
          details: "100% Organic Neem pest management. Zero synthetic pesticides. Solar Drip Irrigation.",
          verifiedBy: "Chainlink Soil Moisture Telemetry Oracle",
          ipfsHash: "QmGrowHash333444555666777",
          txHash: "0x3333a4c1e90b27163c45df01932849102834710129a8f",
          completed: true
        },
        {
          stageName: "Harvesting & Grading",
          location: "Green Field Farm Plot #4, Sangli",
          date: "15-Jul-2026",
          details: "Harvested with Combined Harvester. AI Spectral Scanner graded Grade A Premium.",
          verifiedBy: "AI Quality Scanner v4.2",
          ipfsHash: "QmHarvestHash444555666777888",
          txHash: "0x4444a4c1e90b27163c45df01932849102834710129a8f",
          completed: true
        },
        {
          stageName: "Warehouse Storage",
          location: "Sangli Central Cold Storage Silo #3",
          date: "18-Jul-2026",
          details: "Stored at 14°C, 55% Humidity. Humidity & temperature log verified by IoT Node.",
          verifiedBy: "Sangli Warehouse Operator",
          ipfsHash: "QmStoreHash555666777888999",
          txHash: "0x5555a4c1e90b27163c45df01932849102834710129a8f",
          completed: true
        },
        {
          stageName: "Cold Chain Transport",
          location: "NH-48 Highway En-route to Mumbai Port",
          date: "22-Jul-2026",
          details: "Refrigerated Truck #MH-10-AZ-4921. GPS & Temp tracked via Chainlink Oracle.",
          verifiedBy: "Logistics Telemetry Oracle",
          ipfsHash: "QmTransportHash666777888999000",
          txHash: "0x6666a4c1e90b27163c45df01932849102834710129a8f",
          completed: true
        },
        {
          stageName: "Buyer Delivery & Final Audit",
          location: "Mumbai Distribution Hub",
          date: "25-Jul-2026",
          details: "Delivered to Global Foods Corp. Final quality scan verified. Escrow payment released.",
          verifiedBy: "Global Foods Inspector",
          ipfsHash: "QmDeliverHash777888999000111",
          txHash: "0x7777a4c1e90b27163c45df01932849102834710129a8f",
          completed: true
        },
        {
          stageName: "Consumer Scan & Verification",
          location: "Retail Store / Direct Consumer",
          date: "Active",
          details: "QR Code scanned by consumer. Complete blockchain audit trail verified on Polygon Explorer.",
          verifiedBy: "Polygon Public Mainnet Node",
          ipfsHash: "QmConsumerHash888999000111222",
          txHash: "0x8888a4c1e90b27163c45df01932849102834710129a8f",
          completed: true
        }
      ]
    },
    {
      batchId: "B-2026-002",
      farmerName: "Gurpreet Singh",
      farmerLocation: "Ludhiana, Punjab",
      cropName: "Organic Basmati Rice",
      cropVariety: "Pusa Basmati 1121",
      harvestDate: "20-Jul-2026",
      quantityTons: 28,
      qualityGrade: "Export Quality",
      organicCertified: true,
      fairTradeCertified: true,
      carbonFootprintKgPerKg: 0.62,
      ipfsHash: "QmBasmati890123456789abcdef1234567890abcdef",
      blockchainTxHash: "0x9a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b",
      currentStageIndex: 4,
      stages: [
        {
          stageName: "Seed Purchase",
          location: "PAU Seed Farm, Ludhiana",
          date: "15-May-2025",
          details: "PAU Certified Pure Pusa 1121 Breeder Seed",
          verifiedBy: "PAU Extension Officer",
          ipfsHash: "QmRiceSeed111222333",
          txHash: "0x1111riceseedtx",
          completed: true
        },
        {
          stageName: "Planting & Sowing",
          location: "Ludhiana Bio Farm Plot #1",
          date: "10-Jun-2025",
          details: "System of Rice Intensification (SRI) technique with 50% water savings.",
          verifiedBy: "PAU Field Monitor",
          ipfsHash: "QmRiceSow222333444",
          txHash: "0x2222ricesowtx",
          completed: true
        },
        {
          stageName: "Growing & Irrigation",
          location: "Ludhiana Bio Farm Plot #1",
          date: "15-Jun-2025 - 15-Jul-2026",
          details: "Zero synthetic fertilizers. Vermicompost & Azolla bio-fertilizer application.",
          verifiedBy: "Organic Certifier Inspector",
          ipfsHash: "QmRiceGrow333444555",
          txHash: "0x3333ricegrowtx",
          completed: true
        },
        {
          stageName: "Harvesting & Grading",
          location: "Ludhiana Bio Farm Plot #1",
          date: "20-Jul-2026",
          details: "Grain length 8.2mm, moisture 12.5%. Graded Export Quality A+.",
          verifiedBy: "Export Inspector",
          ipfsHash: "QmRiceHarvest444555666",
          txHash: "0x4444riceharvesttx",
          completed: true
        },
        {
          stageName: "Warehouse Storage",
          location: "Ludhiana Silo Hub #12",
          date: "22-Jul-2026",
          details: "Aerated storage in airtight GrainPro bags.",
          verifiedBy: "Warehouse Operator",
          ipfsHash: "QmRiceStore555666777",
          txHash: "0x5555ricestoretx",
          completed: false
        }
      ]
    }
  ]);

  // Seed Data: Smart Contracts
  const [contracts, setContracts] = useState<FarmingContract[]>([
    {
      id: "SC-2026-881",
      contractAddress: "0x3f1c9012a842b78d901234567890abcdef123456",
      farmerName: "Rajesh Patel",
      buyerName: "Global Agrifood Corp",
      cropName: "Bio-Fortified Wheat",
      quantityTons: 15,
      pricePerQuintal: 2450,
      totalValueRs: 367500,
      advancePercentage: 20,
      advanceEscrowRs: 73500,
      deliveryDate: "15-Aug-2026",
      deliveryLocation: "Navi Mumbai Central Port Hub",
      qualitySpecs: "Moisture < 12%, Foreign Matter < 1%, Grain Damage < 0.5%",
      penaltyClause: "2% per week delay. 5% price deduction per 1% moisture deviation.",
      status: "Escrow Locked",
      auditTrail: [
        {
          timestamp: "2026-07-10 10:30",
          action: "Contract Terms Created & Digitally Signed",
          actor: "Farmer & Buyer",
          txHash: "0xa1b2c3d4e5f678901234567890abcdef12345678"
        },
        {
          timestamp: "2026-07-10 11:15",
          action: "Advance Escrow Deposit of ₹73,500 Locked in Smart Contract",
          actor: "Global Agrifood Corp",
          txHash: "0xb2c3d4e5f678901234567890abcdef123456789a"
        },
        {
          timestamp: "2026-07-20 14:00",
          action: "Harvest Quality Audit Submitted to Contract Oracle",
          actor: "AI Quality Scanner Node #9",
          txHash: "0xc3d4e5f678901234567890abcdef123456789ab2"
        }
      ]
    },
    {
      id: "SC-2026-882",
      contractAddress: "0x9876543210abcdef1234567890abcdef12345678",
      farmerName: "Kavita Reddy",
      buyerName: "Indus Organic Supermarkets",
      cropName: "Organic Alphonso Mangoes",
      quantityTons: 8,
      pricePerQuintal: 12000,
      totalValueRs: 960000,
      advancePercentage: 25,
      advanceEscrowRs: 240000,
      deliveryDate: "30-Jul-2026",
      deliveryLocation: "Bengaluru Retail Warehouse",
      qualitySpecs: "BRIX Sugar > 18°, Zero Chemical Pesticide Residue (NPOP Standard)",
      penaltyClause: "Rejection if chemical residue detected. Advance refunded to Buyer.",
      status: "Quality Inspection",
      auditTrail: [
        {
          timestamp: "2026-07-01 09:00",
          action: "Contract Initialized on Polygon Testnet",
          actor: "Kavita Reddy",
          txHash: "0xd4e5f678901234567890abcdef123456789ab2c3"
        },
        {
          timestamp: "2026-07-02 12:30",
          action: "Escrow Deposit ₹240,000 Confirmed",
          actor: "Indus Organic Supermarkets",
          txHash: "0xe5f678901234567890abcdef123456789ab2c3d4"
        }
      ]
    }
  ]);

  // Seed Data: Carbon Credit Listings
  const [carbonListings, setCarbonListings] = useState<CarbonCreditListing[]>([
    {
      id: "CCL-101",
      creditId: "ACC-2026-MH-001",
      farmerName: "Rajesh Patel",
      farmRegion: "Sangli, Maharashtra",
      acreage: 15,
      creditsAvailableTons: 45,
      pricePerTonRs: 1200,
      verificationStandard: "Verra (VCS)",
      sequestrationMethod: "No-Till + Cover Cropping + Solar Drip Irrigation",
      status: "Listed",
      farmerWallet: "0x71C8a94F2B39A019b8429C71eE39",
      ipfsReportHash: "QmCarbonAuditReport101MH"
    },
    {
      id: "CCL-102",
      creditId: "ACC-2026-PB-008",
      farmerName: "Gurpreet Singh",
      farmRegion: "Ludhiana, Punjab",
      acreage: 30,
      creditsAvailableTons: 110,
      pricePerTonRs: 1400,
      verificationStandard: "Gold Standard",
      sequestrationMethod: "Agroforestry + Zero Rice Stubble Burning + Bio-Char",
      status: "Listed",
      farmerWallet: "0x82D9b05G3C40B120c9530D82fF40",
      ipfsReportHash: "QmCarbonAuditReport102PB"
    },
    {
      id: "CCL-103",
      creditId: "ACC-2026-KA-014",
      farmerName: "Siddharth Rao",
      farmRegion: "Shimoga, Karnataka",
      acreage: 22,
      creditsAvailableTons: 88,
      pricePerTonRs: 1100,
      verificationStandard: "NPOP Organic Carbon",
      sequestrationMethod: "Organic Composting + Drip Micro-Irrigation + Solar Pump",
      status: "Listed",
      farmerWallet: "0x93E0c16H4D51C231d0641E93gG51",
      ipfsReportHash: "QmCarbonAuditReport103KA"
    }
  ]);

  // Seed Data: Organic Certifications
  const [certifications, setCertifications] = useState<OrganicCertification[]>([
    {
      id: "CERT-NPOP-8821",
      certNumber: "NPOP/IN/2026/8821",
      farmerName: "Rajesh Patel",
      farmLocation: "Sangli, Maharashtra",
      certType: "India Organic (NPOP)",
      issuedDate: "15-Jan-2026",
      expiryDate: "14-Jan-2027",
      status: "Approved",
      blockchainHash: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b",
      aiComplianceScore: 98,
      documentsIpfs: ["QmCertDoc111", "QmSoilTestReport222"]
    },
    {
      id: "CERT-FT-9012",
      certNumber: "FTI-FAIRTRADE-2026-9012",
      farmerName: "Gurpreet Singh",
      farmLocation: "Ludhiana, Punjab",
      certType: "Fair Trade Certified",
      issuedDate: "01-Mar-2026",
      expiryDate: "28-Feb-2027",
      status: "Approved",
      blockchainHash: "0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c",
      aiComplianceScore: 95,
      documentsIpfs: ["QmFairTradeDoc333", "QmWageAuditReport444"]
    }
  ]);

  // Calculated Carbon Values
  const totalCalculatedTons = Math.round(
    calcAcres *
      ((calcNoTill ? 1.5 : 0) +
        (calcCoverCrop ? 1.0 : 0) +
        calcAgroforestryTrees * 0.1 +
        (calcFertilizerReducePct / 100) * 1.2 +
        (calcSolarPump ? 1.5 : 0) +
        (calcDripIrrigation ? 0.8 : 0))
  );
  const calculatedIncomeRs = totalCalculatedTons * calcPricePerTon;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2500);
  };

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    const newContract: FarmingContract = {
      id: `SC-2026-${Math.floor(100 + Math.random() * 900)}`,
      contractAddress: `0x${Math.random().toString(16).substring(2, 42)}`,
      farmerName: "Rajesh Patel",
      buyerName: "AgriExport Trading Co",
      cropName: "Organic Soybeans",
      quantityTons: 20,
      pricePerQuintal: 4800,
      totalValueRs: 960000,
      advancePercentage: 20,
      advanceEscrowRs: 192000,
      deliveryDate: "15-Sep-2026",
      deliveryLocation: "Indore Central Grain Market",
      qualitySpecs: "Moisture < 10%, Oil Content > 18%",
      penaltyClause: "1.5% deduction per week late",
      status: "Escrow Locked",
      auditTrail: [
        {
          timestamp: new Date().toLocaleString(),
          action: "Smart Contract Deployed on Polygon Testnet",
          actor: "Rajesh Patel",
          txHash: `0x${Math.random().toString(16).substring(2, 42)}`
        },
        {
          timestamp: new Date().toLocaleString(),
          action: "Escrow Locked by Buyer (₹1,92,000)",
          actor: "AgriExport Trading Co",
          txHash: `0x${Math.random().toString(16).substring(2, 42)}`
        }
      ]
    };
    setContracts([newContract, ...contracts]);
    alert("Smart Contract deployed successfully to Polygon Testnet! Contract Address: " + newContract.contractAddress);
  };

  const handleMintCarbonCredits = () => {
    const newListing: CarbonCreditListing = {
      id: `CCL-${Math.floor(100 + Math.random() * 900)}`,
      creditId: `ACC-2026-MH-${Math.floor(100 + Math.random() * 900)}`,
      farmerName: "Rajesh Patel",
      farmRegion: "Sangli, Maharashtra",
      acreage: calcAcres,
      creditsAvailableTons: totalCalculatedTons,
      pricePerTonRs: calcPricePerTon,
      verificationStandard: "Verra (VCS)",
      sequestrationMethod: "No-Till + Cover Crops + Agroforestry + Solar Drip",
      status: "Listed",
      farmerWallet: walletAddress,
      ipfsReportHash: "QmCarbonAuditReport" + Math.random().toString(36).substring(7)
    };
    setCarbonListings([newListing, ...carbonListings]);
    setAccTokenBalance(accTokenBalance + totalCalculatedTons);
    alert(
      `Minted ${totalCalculatedTons} ACC Carbon Credit Tokens on Polygon! Total estimated value: ₹${calculatedIncomeRs.toLocaleString("en-IN")}`
    );
  };

  const selectedBatch = batches.find((b) => b.batchId.toLowerCase() === batchSearchQuery.toLowerCase()) || batches[0];

  return (
    <div className="space-y-6 text-slate-800">
      {/* Top Banner & Web3 Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Link className="w-64 h-64 text-emerald-400" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black rounded-full uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" /> Web3 Trust & Sustainability Engine
                </span>
                <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold rounded-full">
                  ERC-721 / ERC-20 Compliant
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-2 font-display">
                Blockchain & Carbon Credits Portal
              </h1>
              <p className="text-xs text-slate-300 max-w-2xl mt-1">
                Farm-to-Fork Immutable Traceability, Automated Smart Contract Escrows, and Global Corporate Carbon Credit Token Marketplace.
              </p>
            </div>

            {/* Connected Wallet Control Box */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3.5 space-y-2 min-w-[280px]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Active Web3 Wallet</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[10px]">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span> Connected
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 bg-slate-900/80 p-2 rounded-xl font-mono text-xs border border-slate-800">
                <span className="text-slate-200 font-semibold truncate max-w-[160px]">{walletAddress}</span>
                <button
                  onClick={() => copyToClipboard(walletAddress)}
                  className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
                  title="Copy Wallet Address"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-700/50">
                <div className="bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-800/30">
                  <p className="text-[9px] text-emerald-400 font-bold">ACC Balance</p>
                  <p className="font-mono font-extrabold text-emerald-200">{accTokenBalance} ACC</p>
                </div>
                <div className="bg-indigo-950/40 p-1.5 rounded-lg border border-indigo-800/30">
                  <p className="text-[9px] text-indigo-400 font-bold">Gas (POL / ETH)</p>
                  <p className="font-mono font-extrabold text-indigo-200">{maticBalance} POL</p>
                </div>
              </div>
            </div>
          </div>

          {/* Network Selector & Live Metrics Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">Selected Network:</span>
              <select
                value={selectedNetwork}
                onChange={(e) => setSelectedNetwork(e.target.value as any)}
                className="bg-slate-800 border border-slate-700 text-emerald-300 font-bold text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="Polygon Mainnet">Polygon Mainnet (Layer-2 Low Gas)</option>
                <option value="Ethereum Goerli">Ethereum Goerli Testnet</option>
                <option value="Hyperledger Fabric">Hyperledger Fabric (Enterprise Private)</option>
              </select>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-indigo-400" />
                <span>IPFS Cluster:</span>
                <span className="text-emerald-400 font-bold">Online (14 Nodes Pinned)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span>Gas Price:</span>
                <span className="font-mono font-bold text-slate-200">24 Gwei</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-cyan-400" />
                <span>Block:</span>
                <span className="font-mono font-bold text-slate-200">#28,941,204</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex overflow-x-auto gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs no-scrollbar">
        {[
          { id: "traceability", label: "Farm-to-Fork Traceability", icon: QrCode, badge: "7 Stages" },
          { id: "contracts", label: "Smart Contract Farming", icon: FileText, badge: "Escrow" },
          { id: "carbon", label: "Carbon Credit Marketplace", icon: Coins, badge: "ACC Tokens" },
          { id: "certification", label: "Organic & Fair Trade Certs", icon: Award, badge: "NPOP / USDA" },
          { id: "corporate", label: "Corporate ESG Offset", icon: Building2, badge: "ESG Portal" },
          { id: "oracles", label: "Chainlink Oracles & IPFS", icon: Cpu, badge: "Real-time" },
          { id: "security", label: "Smart Contracts & Audits", icon: Lock, badge: "Verified" }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                isActive
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-900/10"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200/80"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-emerald-600"}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-200/70 text-slate-700"
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: FARM-TO-FORK TRACEABILITY & QR VERIFICATION */}
      {activeTab === "traceability" && (
        <div className="space-y-6">
          {/* Search & Batch Selection Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-display">
                  <QrCode className="h-5 w-5 text-emerald-600" />
                  Farm-to-Fork Supply Chain Traceability Engine
                </h2>
                <p className="text-xs text-slate-500">
                  Every batch of harvested produce is minted as an ERC-721 NFT with full supply chain history recorded immutably on-chain.
                </p>
              </div>

              {/* Batch Quick Switcher Input */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={batchSearchQuery}
                    onChange={(e) => setBatchSearchQuery(e.target.value)}
                    placeholder="Enter Batch ID (e.g. B-2026-001)..."
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 text-xs font-mono font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <button
                  onClick={() => setBatchSearchQuery("B-2026-001")}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200 transition-colors"
                >
                  Load B-2026-001
                </button>
              </div>
            </div>

            {/* Active Batch Summary Card */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Crop Batch & Farmer</p>
                <div className="flex items-center gap-2 mt-1">
                  {selectedBatch.farmerPhoto ? (
                    <img
                      src={selectedBatch.farmerPhoto}
                      alt={selectedBatch.farmerName}
                      className="h-8 w-8 rounded-full object-cover border border-emerald-500"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                      {selectedBatch.farmerName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-extrabold text-slate-900">{selectedBatch.cropName}</p>
                    <p className="text-[11px] text-slate-600">{selectedBatch.farmerName} ({selectedBatch.farmerLocation})</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Variety & Harvest Date</p>
                <p className="font-bold text-slate-800 mt-1">{selectedBatch.cropVariety}</p>
                <p className="text-[11px] text-slate-500">Harvested on {selectedBatch.harvestDate}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Quality Grade & Quantity</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-full border border-emerald-200">
                    {selectedBatch.qualityGrade}
                  </span>
                  <span className="font-bold text-slate-800">{selectedBatch.quantityTons} Tons</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Carbon Footprint Score</p>
                <p className="font-mono font-extrabold text-emerald-700 text-sm mt-1">
                  {selectedBatch.carbonFootprintKgPerKg} kg CO₂ / kg produce
                </p>
                <p className="text-[10px] text-emerald-600 font-semibold">62% below regional average!</p>
              </div>
            </div>
          </div>

          {/* Supply Chain Timeline Stages */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-display">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Batch #{selectedBatch.batchId} – 8-Stage Immutable Supply Chain History
              </h3>
              <span className="text-xs font-mono font-bold text-slate-500">
                On-Chain Status: <span className="text-emerald-600 font-extrabold">VERIFIED (100% Match)</span>
              </span>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
              {selectedBatch.stages.map((stage, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute -left-6 top-1 h-6 w-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                      stage.completed
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                        : "bg-slate-100 border-slate-300 text-slate-400"
                    }`}
                  >
                    {stage.completed ? "✓" : idx + 1}
                  </div>

                  <div className="p-4 bg-slate-50 hover:bg-emerald-50/40 rounded-2xl border border-slate-200 transition-colors space-y-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                          Stage {idx + 1}
                        </span>
                        <h4 className="text-sm font-extrabold text-slate-900 inline-block ml-2">{stage.stageName}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{stage.date}</span>
                        <span className="text-slate-300">|</span>
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <span>{stage.location}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 font-medium">{stage.details}</p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 text-[11px] font-mono text-slate-500">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Verified by: <strong className="text-slate-800">{stage.verifiedBy}</strong></span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="truncate max-w-[150px] sm:max-w-[220px]" title={"IPFS: " + stage.ipfsHash}>
                          IPFS: <strong className="text-indigo-600">{stage.ipfsHash}</strong>
                        </span>
                        <button
                          onClick={() => copyToClipboard(stage.txHash)}
                          className="text-emerald-700 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                        >
                          TxHash: {stage.txHash.substring(0, 10)}... <ExternalLink className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Consumer QR Code & Product Verification Modal Simulation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-display">
                <QrCode className="h-5 w-5 text-indigo-600" />
                Consumer Traceability QR Code & Product Tag
              </h3>
              <p className="text-xs text-slate-500">
                Printed directly on retail packaging. Consumers scan this QR code with any smartphone camera to view full farm origin proof.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-900 text-white rounded-2xl">
                {/* Visual QR Code Representation */}
                <div className="p-3 bg-white rounded-xl shadow-lg text-center shrink-0">
                  <div className="w-32 h-32 bg-slate-900 p-2 rounded-lg flex flex-col justify-between items-center relative overflow-hidden">
                    <div className="grid grid-cols-4 gap-1 w-full h-full">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div
                          key={i}
                          className={`${
                            i % 2 === 0 || i % 5 === 0 ? "bg-white" : "bg-slate-900"
                          } rounded-xs`}
                        ></div>
                      ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="p-1 bg-emerald-600 text-white rounded-md text-[8px] font-black">
                        AGRI-TRUST
                      </div>
                    </div>
                  </div>
                  <p className="text-[9px] font-mono font-bold text-slate-700 mt-1">BATCH #{selectedBatch.batchId}</p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold">
                    <ShieldCheck className="h-4 w-4" /> 100% Genuine Produce Guaranteed
                  </div>
                  <p className="text-slate-300">
                    Scanned URL: <span className="font-mono text-emerald-300">https://agriconnect.ai/trace/{selectedBatch.batchId}</span>
                  </p>
                  <ul className="text-[11px] text-slate-400 space-y-1 pt-1">
                    <li>• Organic NPOP Standard Compliant</li>
                    <li>• Fair Trade Certified (Ethical Farm Labor)</li>
                    <li>• Zero Heavy Metal / Pesticide Residue</li>
                  </ul>
                  <button
                    onClick={() => alert(`QR Code URL copied: https://agriconnect.ai/trace/${selectedBatch.batchId}`)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Share2 className="h-3.5 w-3.5" /> Share Consumer Trace Page
                  </button>
                </div>
              </div>
            </div>

            {/* Mint New Batch Form */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-display">
                <UploadCloud className="h-5 w-5 text-emerald-600" />
                Mint New Crop Batch ERC-721 NFT
              </h3>
              <p className="text-xs text-slate-500">
                Farmer or Warehouse Operator can mint a new crop batch on Polygon to record harvest metadata onto IPFS & Blockchain.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("New Batch NFT minted on Polygon Testnet! IPFS Hash generated.");
                }}
                className="space-y-3 text-xs"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Crop Name</label>
                    <input
                      type="text"
                      defaultValue="Organic Alphonso Mango"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Quantity (Tons)</label>
                    <input
                      type="number"
                      defaultValue={12}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Quality Grade</label>
                    <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold">
                      <option>Grade A Premium</option>
                      <option>Export Quality</option>
                      <option>Grade A Standard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Organic Certification</label>
                    <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold">
                      <option>India Organic (NPOP)</option>
                      <option>USDA Organic</option>
                      <option>Non-Certified</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4 w-4" /> Mint Crop NFT Batch on Polygon
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SMART CONTRACT FARMING & ESCROW */}
      {activeTab === "contracts" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-display">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  Automated Smart Contract Farming & Escrow Engine
                </h2>
                <p className="text-xs text-slate-500">
                  Enforceable agreements between Farmers and Buyers with funds locked safely in automated escrow smart contracts.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-extrabold rounded-full border border-indigo-200">
                  {contracts.length} Active Contracts
                </span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-extrabold rounded-full border border-emerald-200">
                  Total Locked: ₹13,27,500
                </span>
              </div>
            </div>

            {/* Contract List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {contracts.map((sc) => (
                <div key={sc.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">CONTRACT #{sc.id}</span>
                      <h3 className="text-base font-extrabold text-slate-900">{sc.cropName} Agreement</h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Farmer: <strong className="text-slate-900">{sc.farmerName}</strong> | Buyer: <strong className="text-indigo-700">{sc.buyerName}</strong>
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                        sc.status === "Escrow Locked"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : sc.status === "Quality Inspection"
                          ? "bg-blue-100 text-blue-800 border border-blue-300"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      }`}
                    >
                      {sc.status}
                    </span>
                  </div>

                  {/* Contract Financial Terms */}
                  <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-slate-200/80 text-center text-xs">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400">Total Contract Value</p>
                      <p className="font-extrabold text-slate-900 text-sm">₹{sc.totalValueRs.toLocaleString("en-IN")}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400">Quantity & Rate</p>
                      <p className="font-bold text-slate-800">{sc.quantityTons} Tons @ ₹{sc.pricePerQuintal}/q</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400">Advance in Escrow</p>
                      <p className="font-extrabold text-emerald-700">₹{sc.advanceEscrowRs.toLocaleString("en-IN")}</p>
                    </div>
                  </div>

                  {/* Specifications & Terms */}
                  <div className="space-y-1 text-xs text-slate-600 bg-slate-100/80 p-3 rounded-xl">
                    <p><strong>Quality Parameters:</strong> {sc.qualitySpecs}</p>
                    <p><strong>Delivery Schedule:</strong> {sc.deliveryDate} at {sc.deliveryLocation}</p>
                    <p><strong>Penalty Terms:</strong> {sc.penaltyClause}</p>
                  </div>

                  {/* Smart Contract On-Chain Audit Log */}
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <p className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
                      <Terminal className="h-3 w-3 text-indigo-600" /> On-Chain Audit Trail
                    </p>
                    <div className="space-y-1 text-[11px] font-mono">
                      {sc.auditTrail.map((log, lIdx) => (
                        <div key={lIdx} className="p-2 bg-white rounded-lg border border-slate-200/60 flex justify-between items-center text-[10px]">
                          <div>
                            <span className="text-slate-400">{log.timestamp}</span> – <span className="font-bold text-slate-800">{log.action}</span>
                          </div>
                          <span className="text-indigo-600 font-bold">{log.txHash.substring(0, 8)}...</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Smart Contract Interactive Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      onClick={() => alert(`Escrow funds for ${sc.id} verified on Polygon Testnet!`)}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Verify Escrow On-Chain
                    </button>
                    <button
                      onClick={() => alert(`Milestone approved for contract ${sc.id}. Payment automatically triggered.`)}
                      className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Approve Quality & Release Payment
                    </button>
                    <button
                      onClick={() => alert(`Dispute ticket raised for ${sc.id}. Third-party neutral arbitrator notified.`)}
                      className="py-2 px-3 bg-rose-50 text-rose-700 font-bold rounded-xl text-xs border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
                    >
                      Raise Dispute
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New Smart Contract Deployment Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-display">
              <FileCode className="h-5 w-5 text-indigo-600" />
              Deploy New Contract Farming Agreement Smart Contract
            </h3>

            <form onSubmit={handleCreateContract} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Crop Type & Variety</label>
                <input
                  type="text"
                  required
                  defaultValue="Organic Soybeans"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Quantity (Tons)</label>
                <input
                  type="number"
                  required
                  defaultValue={20}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Price per Quintal (₹)</label>
                <input
                  type="number"
                  required
                  defaultValue={4800}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Advance Escrow Deposit (%)</label>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500">
                  <option value={20}>20% Advance</option>
                  <option value={30}>30% Advance</option>
                  <option value={50}>50% Advance</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Delivery Date</label>
                <input
                  type="date"
                  defaultValue="2026-09-15"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Delivery Hub Location</label>
                <input
                  type="text"
                  defaultValue="Indore Central Grain Market"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="md:col-span-3">
                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Lock className="h-4 w-4" /> Deploy ContractFarming.sol Smart Contract & Lock Escrow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: CARBON CREDIT MARKETPLACE */}
      {activeTab === "carbon" && (
        <div className="space-y-6">
          {/* Carbon Credit Calculator for Farmers */}
          <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-emerald-800/80 pb-4">
              <div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black rounded-full uppercase tracking-wider">
                  AI Carbon Sequestration Engine
                </span>
                <h2 className="text-xl font-extrabold text-white mt-1 font-display">
                  Farmer Carbon Credit Revenue Calculator
                </h2>
                <p className="text-xs text-slate-300">
                  Calculate annual carbon credits earned via sustainable farming practices and list them as AgriConnect Carbon Tokens (ACC).
                </p>
              </div>

              <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl text-center min-w-[220px]">
                <p className="text-[10px] font-bold text-emerald-400 uppercase">Estimated Annual Carbon Revenue</p>
                <p className="text-2xl font-extrabold text-emerald-300 font-mono">₹{calculatedIncomeRs.toLocaleString("en-IN")}</p>
                <p className="text-[11px] text-slate-300">{totalCalculatedTons} Tons CO₂e / Year @ ₹{calcPricePerTon}/ton</p>
              </div>
            </div>

            {/* Interactive Calculator Sliders & Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="space-y-4 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Farm Size (Acres)</span>
                    <span className="text-emerald-400 font-mono font-extrabold">{calcAcres} Acres</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={100}
                    value={calcAcres}
                    onChange={(e) => setCalcAcres(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Target Price per Ton (₹)</span>
                    <span className="text-emerald-400 font-mono font-extrabold">₹{calcPricePerTon} / ton</span>
                  </div>
                  <input
                    type="range"
                    min={800}
                    max={4000}
                    step={100}
                    value={calcPricePerTon}
                    onChange={(e) => setCalcPricePerTon(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Agroforestry Trees Planted</span>
                    <span className="text-emerald-400 font-mono font-extrabold">{calcAgroforestryTrees} Trees</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={200}
                    step={5}
                    value={calcAgroforestryTrees}
                    onChange={(e) => setCalcAgroforestryTrees(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Climate Practice Checkboxes */}
              <div className="space-y-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
                <p className="font-extrabold text-emerald-300 uppercase text-[10px] tracking-wider">Sustainable Practices Applied</p>

                <label className="flex items-center justify-between p-2 bg-slate-900/60 rounded-xl border border-slate-700/50 cursor-pointer hover:bg-slate-900">
                  <span className="font-medium">No-Till Tillage (+1.5 t/acre)</span>
                  <input
                    type="checkbox"
                    checked={calcNoTill}
                    onChange={(e) => setCalcNoTill(e.target.checked)}
                    className="h-4 w-4 accent-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2 bg-slate-900/60 rounded-xl border border-slate-700/50 cursor-pointer hover:bg-slate-900">
                  <span className="font-medium">Cover Cropping (+1.0 t/acre)</span>
                  <input
                    type="checkbox"
                    checked={calcCoverCrop}
                    onChange={(e) => setCalcCoverCrop(e.target.checked)}
                    className="h-4 w-4 accent-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2 bg-slate-900/60 rounded-xl border border-slate-700/50 cursor-pointer hover:bg-slate-900">
                  <span className="font-medium">Solar Drip Pump (+1.5 t/acre)</span>
                  <input
                    type="checkbox"
                    checked={calcSolarPump}
                    onChange={(e) => setCalcSolarPump(e.target.checked)}
                    className="h-4 w-4 accent-emerald-500"
                  />
                </label>
              </div>

              {/* Sequestration Summary & Mint Action */}
              <div className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-500/30 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <p className="font-extrabold text-emerald-300 text-xs">7-Step Carbon Token Pipeline</p>
                  <ol className="text-[11px] text-slate-300 space-y-1">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> 1. AI Satellite Baseline Audit</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> 2. Verra / Gold Standard Verification</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> 3. Mint ACC ERC-20 Tokens</li>
                  </ol>
                </div>

                <button
                  onClick={handleMintCarbonCredits}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition-colors cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <Coins className="h-4 w-4" /> Mint {totalCalculatedTons} ACC Tokens to Wallet
                </button>
              </div>
            </div>
          </div>

          {/* Active Marketplace Listings */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-display">
                <Coins className="h-5 w-5 text-emerald-600" />
                AgriConnect Carbon Credit (ACC) Marketplace
              </h3>
              <span className="text-xs font-mono font-bold text-slate-500">
                1 ACC Token = 1 Metric Ton CO₂ Offset
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {carbonListings.map((c) => (
                <div key={c.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 relative hover:border-emerald-400 transition-colors">
                  <span className="absolute top-4 right-4 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full border border-emerald-300">
                    {c.verificationStandard}
                  </span>

                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400">{c.creditId}</span>
                    <h4 className="text-sm font-extrabold text-slate-900">{c.farmerName}</h4>
                    <p className="text-xs text-slate-500">{c.farmRegion} ({c.acreage} Acres)</p>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1">
                    <p className="text-xs font-semibold text-slate-700">{c.sequestrationMethod}</p>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400">Available Credits</p>
                        <p className="font-extrabold text-emerald-700">{c.creditsAvailableTons} Tons ACC</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400">Price / Ton</p>
                        <p className="font-extrabold text-slate-900">₹{c.pricePerTonRs.toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      alert(
                        `Initiated purchase of ${c.creditsAvailableTons} ACC credits from ${c.farmerName} for ₹${(
                          c.creditsAvailableTons * c.pricePerTonRs
                        ).toLocaleString("en-IN")}. Payment routed via Razorpay.`
                      )
                    }
                    className="w-full py-2 bg-slate-900 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <DollarSign className="h-4 w-4" /> Buy Carbon Credits (₹{(c.creditsAvailableTons * c.pricePerTonRs).toLocaleString("en-IN")})
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ORGANIC & FAIR TRADE CERTIFICATION REGISTRY */}
      {activeTab === "certification" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-display">
                  <Award className="h-5 w-5 text-emerald-600" />
                  Tamper-Proof Organic & Fair Trade Certification Registry
                </h2>
                <p className="text-xs text-slate-500">
                  Verifiable certifications stored on blockchain with AI compliance monitoring and 1-click renewal tracking.
                </p>
              </div>

              <button
                onClick={() => alert("Redirecting to Organic Certification Application Workflow...")}
                className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                Apply for Organic Certification
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certifications.map((cert) => (
                <div key={cert.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-indigo-600">{cert.certNumber}</span>
                      <h3 className="text-base font-extrabold text-slate-900">{cert.certType}</h3>
                      <p className="text-xs text-slate-600">{cert.farmerName} – {cert.farmLocation}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-full border border-emerald-300">
                      {cert.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-slate-200/80">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400">Issued & Expiry</p>
                      <p className="font-semibold text-slate-800">{cert.issuedDate} to {cert.expiryDate}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400">AI Compliance Score</p>
                      <p className="font-mono font-extrabold text-emerald-700">{cert.aiComplianceScore}% Audit Pass</p>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-900 text-slate-300 rounded-xl text-[11px] font-mono truncate">
                    On-Chain Hash: <span className="text-emerald-400">{cert.blockchainHash}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => alert(`Blockchain Hash Verified: ${cert.blockchainHash}`)}
                      className="flex-1 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer"
                    >
                      Verify On-Chain
                    </button>
                    <button
                      onClick={() => alert(`Certificate renewal request sent for ${cert.certNumber}`)}
                      className="px-3 py-1.5 bg-slate-200 text-slate-800 font-bold text-xs rounded-xl hover:bg-slate-300 transition-colors cursor-pointer"
                    >
                      Auto-Renew
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CORPORATE ESG CARBON OFFSET PORTAL */}
      {activeTab === "corporate" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-display">
              <Building2 className="h-5 w-5 text-indigo-600" />
              Corporate ESG Carbon Neutrality Portal
            </h2>
            <p className="text-xs text-slate-500">
              Corporates and FMCG companies calculate Scope 1/2/3 carbon footprint, purchase verified ACC credits, and generate official audit reports.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Corporate Footprint Form */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
                <h3 className="font-extrabold text-slate-900 text-sm">Calculate & Offset Corporate Footprint</h3>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={corpName}
                    onChange={(e) => setCorpName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Annual Emissions to Offset (Tons CO₂e)</label>
                  <input
                    type="number"
                    value={corpEmissionsTons}
                    onChange={(e) => setCorpEmissionsTons(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
                  <p className="font-extrabold">Total Offset Investment</p>
                  <p className="text-lg font-black font-mono">₹{(corpEmissionsTons * 1200).toLocaleString("en-IN")}</p>
                  <p className="text-[10px] text-emerald-700">Directly funds 35 smallholder Indian farmers adopting regenerative agriculture.</p>
                </div>

                <button
                  onClick={() => setShowCertificateModal(true)}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Award className="h-4 w-4" /> Purchase & Generate ESG Carbon Neutral Certificate
                </button>
              </div>

              {/* ESG Certificate Preview */}
              <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-4 relative flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">ESG AUDIT COMPLIANT</span>
                    <span className="text-xs font-mono text-slate-400">CERT-ESG-2026-9021</span>
                  </div>

                  <div className="text-center py-4 space-y-2">
                    <Award className="h-12 w-12 text-emerald-400 mx-auto" />
                    <h3 className="text-lg font-extrabold text-white">{corpName}</h3>
                    <p className="text-xs text-emerald-300 font-medium">Officially Certified Carbon Neutral Entity</p>
                  </div>

                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs space-y-1">
                    <p>• Offset Quantity: <strong>{corpEmissionsTons} Tons CO₂e</strong></p>
                    <p>• Tokens Retired: <strong>{corpEmissionsTons} ACC (AgriConnect Carbon Tokens)</strong></p>
                    <p>• Blockchain Tx: <span className="font-mono text-emerald-400">0x9f8e7d6c5b4a3f2e1d0c</span></p>
                  </div>
                </div>

                <button
                  onClick={() => alert("Downloading Official ESG Carbon Neutrality Certificate PDF...")}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" /> Download Official ESG Certificate (PDF)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: CHAINLINK ORACLES & IPFS STORAGE */}
      {activeTab === "oracles" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chainlink Decentralized Oracles */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-display">
                <Cpu className="h-5 w-5 text-indigo-600" />
                Chainlink Decentralized Oracle Feeds
              </h3>
              <p className="text-xs text-slate-500">
                Feeds off-chain IoT telemetry, weather station sensors, and Mandi price indexes directly into Smart Contracts.
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <p className="font-extrabold text-slate-900">Cold Chain Temperature Oracle</p>
                    <p className="text-[10px] text-slate-500">Node #MH-COLD-901</p>
                  </div>
                  <span className="font-mono font-extrabold text-emerald-600">14.2°C (Optimal)</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <p className="font-extrabold text-slate-900">Weather Rainfall Insurance Oracle</p>
                    <p className="text-[10px] text-slate-500">Node #PB-RAIN-402</p>
                  </div>
                  <span className="font-mono font-extrabold text-indigo-600">42mm (Normal)</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <p className="font-extrabold text-slate-900">Wheat Mandi Price Oracle</p>
                    <p className="text-[10px] text-slate-500">Node #AGMARK-WHEAT-101</p>
                  </div>
                  <span className="font-mono font-extrabold text-amber-600">₹2,450 / Quintal</span>
                </div>
              </div>
            </div>

            {/* IPFS Storage Cluster Explorer */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-display">
                <Database className="h-5 w-5 text-emerald-600" />
                IPFS Decentralized Storage Explorer
              </h3>
              <p className="text-xs text-slate-500">
                Crop images, soil test PDFs, and inspection videos are pinned across global IPFS nodes for permanent immutability.
              </p>

              <div className="p-4 bg-slate-900 text-slate-300 rounded-2xl font-mono text-xs space-y-2">
                <p className="text-emerald-400 font-bold">├── crop_images/</p>
                <p className="pl-4">└── batch_B-2026-001/harvest_photo.jpg (QmXyZ987...)</p>
                <p className="text-emerald-400 font-bold">├── quality_reports/</p>
                <p className="pl-4">└── batch_B-2026-001/lab_audit.pdf (QmReport444...)</p>
                <p className="text-emerald-400 font-bold">├── certifications/</p>
                <p className="pl-4">└── farmer_Rajesh/NPOP_cert.pdf (QmCertDoc111...)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: SECURITY, AUDITS & SMART CONTRACTS */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-display">
              <Lock className="h-5 w-5 text-emerald-600" />
              Smart Contract Code Viewer & Security Audit Reports
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                <p className="font-extrabold text-emerald-900 text-sm">CertiK Audit Score</p>
                <p className="text-2xl font-black text-emerald-700 font-mono mt-1">99.4 / 100</p>
                <p className="text-[10px] text-emerald-600">Zero Critical Vulnerabilities Found</p>
              </div>

              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-center">
                <p className="font-extrabold text-indigo-900 text-sm">ConsenSys Audit Pass</p>
                <p className="text-2xl font-black text-indigo-700 font-mono mt-1">VERIFIED</p>
                <p className="text-[10px] text-indigo-600">Reentrancy & Overflow Protected</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                <p className="font-extrabold text-slate-900 text-sm">AWS KMS Key Security</p>
                <p className="text-2xl font-black text-slate-800 font-mono mt-1">MULTI-SIG</p>
                <p className="text-[10px] text-slate-500">3-of-5 Governance Multisig Active</p>
              </div>
            </div>

            <div className="bg-slate-900 text-emerald-400 p-5 rounded-2xl font-mono text-xs space-y-2">
              <div className="flex justify-between text-slate-400 border-b border-slate-800 pb-2 text-[10px]">
                <span>AgriConnectToken.sol (ERC-20 Carbon Token)</span>
                <span>Solidity v0.8.20</span>
              </div>
              <p className="text-slate-300">// SPDX-License-Identifier: MIT</p>
              <p className="text-slate-300">pragma solidity ^0.8.20;</p>
              <p className="text-indigo-400">import "@openzeppelin/contracts/token/ERC20/ERC20.sol";</p>
              <p className="text-indigo-400">import "@openzeppelin/contracts/access/Ownable.sol";</p>
              <p className="pt-2 text-emerald-300">contract AgriConnectToken is ERC20, Ownable {'{'}</p>
              <p className="pl-4 text-slate-200">constructor() ERC20("AgriConnect Carbon Credit", "ACC") Ownable(msg.sender) {'{}'}</p>
              <p className="pl-4 text-slate-200">function mintCarbonCredit(address farmer, uint256 tons) external onlyOwner {'{'}</p>
              <p className="pl-8 text-emerald-400">_mint(farmer, tons * 10**18);</p>
              <p className="pl-4 text-slate-200">{'}'}</p>
              <p className="text-emerald-300">{'}'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Certificate Confirmation */}
      {showCertificateModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white p-6 rounded-3xl max-w-md w-full space-y-4 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 font-display">
                ESG Carbon Purchase Confirmed!
              </h3>
              <p className="text-xs text-slate-600">
                {corpName} has successfully retired {corpEmissionsTons} ACC tokens on Polygon.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-700 space-y-1">
              <p>TxHash: <span className="text-emerald-600 font-bold">0x8f2a4c1e90b27163c45df019328</span></p>
              <p>Timestamp: {new Date().toLocaleString()}</p>
            </div>

            <button
              onClick={() => {
                setShowCertificateModal(false);
                alert("ESG Certificate saved and ready for public download!");
              }}
              className="w-full py-2.5 bg-emerald-600 text-white font-extrabold rounded-xl text-xs hover:bg-emerald-700 transition-colors"
            >
              Close & View In Portfolio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
