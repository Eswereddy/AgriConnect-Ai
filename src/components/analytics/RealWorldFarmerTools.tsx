import React, { useState } from "react";
import {
  TrendingUp,
  DollarSign,
  Users,
  FlaskConical,
  Droplets,
  Building2,
  ShieldAlert,
  Bell,
  Search,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Download,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  PhoneCall,
  Sun,
  Wind,
  Info,
  Layers,
  FileText,
  HeartHandshake,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Check,
  Zap,
  Calculator,
  Award,
  Edit2,
  X,
  Printer,
  Tractor,
  FileSpreadsheet,
  CheckSquare,
  CreditCard,
  Warehouse,
  Gauge,
  ShieldCheck,
  Cpu,
  BatteryCharging,
  Box,
  FileCheck
} from "lucide-react";

// ============================================================================
// TYPES & INTERFACES FOR ALL FARMER MODULES
// ============================================================================

export interface MandiPrice {
  id: string;
  mandiName: string;
  district: string;
  distanceKm: number;
  commodity: string;
  variety: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  arrivalsQuintals: number;
  trend: "up" | "down" | "stable";
  changePct: number;
  lastUpdated: string;
}

export interface FarmerSellOffer {
  id: string;
  commodity: string;
  quantityQuintals: number;
  targetPricePerQuintal: number;
  mandiName: string;
  farmerContact: string;
  status: "Active Offer" | "Locked Rate" | "Sold & Dispatched" | "Cancelled";
  dateCreated: string;
}

export interface FarmPlot {
  id: string;
  plotName: string;
  areaAcres: number;
  soilType: string;
  currentCrop: string;
  soilPh: number;
  moisturePct: number;
  irrigationType: "Drip Irrigation" | "Canal Flood" | "Borewell Sprinkler";
  healthStatus: "Optimal" | "Action Required" | "Harvest Ready";
  khasraNumber: string;
}

export interface ExpenseEntry {
  id: string;
  category: "Seeds & Nursery" | "Tractor & Tillage" | "Fertilizers" | "Pesticides" | "Labor Wages" | "Irrigation Power" | "Transport & Mandi";
  amountRs: number;
  date: string;
  notes: string;
}

export interface LaborWorker {
  id: string;
  name: string;
  gender: "Male" | "Female";
  skillType: "General Sowing/Weeding" | "Tractor Operator" | "Harvesting Crew" | "Pesticide Sprayer";
  dailyWage: number;
  daysWorked: number;
  advancePaid: number;
  allowance: number;
  phone: string;
  attendanceStatus: "Present" | "Absent" | "Half Day";
}

export interface PMFBYClaim {
  id: string;
  cropName: string;
  surveyNumber: string;
  causeOfLoss: "Unseasonal Rain / Cyclonic Deluge" | "Hailstorm Damage" | "Drought / Pest Outbreak" | "Post-Harvest In-Field Loss";
  damagePercentage: number;
  estimatedLossRs: number;
  submissionDate: string;
  status: "Under Inspection" | "Verified by Surveyor" | "Approved & Disbursed" | "Pending Geo-Photos";
  referenceNo: string;
}

export interface EquipmentBooking {
  id: string;
  equipmentType: string;
  bookingDate: string;
  durationHours: number;
  ratePerHourRs: number;
  operatorRequired: boolean;
  status: "Confirmed" | "In Progress" | "Completed" | "Cancelled";
  chcCenterName: string;
}

export interface SprayPlan {
  id: string;
  cropName: string;
  targetPest: string;
  pesticideName: string;
  sprayDate: string;
  areaAcres: number;
  waterLiters: number;
  status: "Scheduled" | "Completed" | "Overdue";
}

export interface WaterSlotRequest {
  id: string;
  plotName: string;
  requestDate: string;
  hoursNeeded: number;
  volumeCusecs: number;
  status: "Approved" | "Pending Officer Sign" | "Completed";
  officerContact: string;
}

export interface KCCLoan {
  id: string;
  bankName: string;
  loanType: "Crop Finance (KCC)" | "Post-Harvest Storage" | "Farm Machinery";
  sanctionedAmount: number;
  interestRatePct: number;
  subventionPct: number;
  netInterestRatePct: number;
  dueDate: string;
  status: "Active Disbursed" | "Under Sanction" | "Application Submitted" | "Closed";
  accountNo: string;
}

export interface WarehouseReceipt {
  id: string;
  warehouseName: string;
  location: string;
  commodity: string;
  quantityBags: number;
  totalWeightMT: number;
  receiptNo: string;
  storageFeePerBagMonth: number;
  enwrValueRs: number;
  pledgeLoanStatus: "Eligible for 75% Pledge" | "Loan Disbursed" | "Unpledged Grain";
}

export interface SolarPumpSystem {
  id: string;
  pumpHp: number;
  type: "Submersible Solar Pump" | "Surface Irrigation Pump";
  locationPlot: string;
  dailyKwGenerated: number;
  flowLitersPerMin: number;
  isPumpActive: boolean;
  subsidyStatus: "PM-KUSUM 60% Sanctioned" | "Grid Export Active";
}

// ============================================================================
// INITIAL SEED DATA
// ============================================================================

const INITIAL_MANDI_RATES: MandiPrice[] = [
  {
    id: "mandi-1",
    mandiName: "Warangal Grain Market",
    district: "Warangal, Telangana",
    distanceKm: 18,
    commodity: "Red Chili (Teja Variety)",
    variety: "Teja High-Grade",
    minPrice: 17200,
    maxPrice: 19800,
    modalPrice: 18600,
    arrivalsQuintals: 2450,
    trend: "up",
    changePct: +4.2,
    lastUpdated: "Today 08:30 AM"
  },
  {
    id: "mandi-2",
    mandiName: "Azadpur APMC Mandi",
    district: "North Delhi",
    distanceKm: 42,
    commodity: "Rice Paddy (Pusa Basmati 1121)",
    variety: "Super-Fine Paddy",
    minPrice: 4200,
    maxPrice: 4850,
    modalPrice: 4620,
    arrivalsQuintals: 8900,
    trend: "up",
    changePct: +2.1,
    lastUpdated: "Today 09:15 AM"
  },
  {
    id: "mandi-3",
    mandiName: "Indore Agriculture Produce Market",
    district: "Indore, MP",
    distanceKm: 35,
    commodity: "Soybean (Yellow JS 335)",
    variety: "Grade A Oilseed",
    minPrice: 4300,
    maxPrice: 4920,
    modalPrice: 4750,
    arrivalsQuintals: 5200,
    trend: "down",
    changePct: -1.4,
    lastUpdated: "Today 08:00 AM"
  }
];

const INITIAL_SELL_OFFERS: FarmerSellOffer[] = [
  {
    id: "offer-1",
    commodity: "Rice Paddy (Pusa Basmati 1121)",
    quantityQuintals: 120,
    targetPricePerQuintal: 4750,
    mandiName: "Warangal Grain Market",
    farmerContact: "+91 98765 43210",
    status: "Active Offer",
    dateCreated: "2026-07-28"
  },
  {
    id: "offer-2",
    commodity: "Red Chili (Teja Variety)",
    quantityQuintals: 45,
    targetPricePerQuintal: 19000,
    mandiName: "Guntur Mirchi Yard",
    farmerContact: "+91 98765 43210",
    status: "Locked Rate",
    dateCreated: "2026-07-25"
  }
];

const INITIAL_PLOTS: FarmPlot[] = [
  {
    id: "plot-1",
    plotName: "North River Bank Plot #1",
    areaAcres: 4.5,
    soilType: "Black Cotton Soil",
    currentCrop: "Paddy (Pusa Basmati)",
    soilPh: 6.8,
    moisturePct: 78,
    irrigationType: "Drip Irrigation",
    healthStatus: "Optimal",
    khasraNumber: "Sy. No. 142/3A"
  },
  {
    id: "plot-2",
    plotName: "East Hillside Field #2",
    areaAcres: 3.0,
    soilType: "Red Loamy Soil",
    currentCrop: "Red Chili (Teja)",
    soilPh: 7.2,
    moisturePct: 52,
    irrigationType: "Borewell Sprinkler",
    healthStatus: "Action Required",
    khasraNumber: "Sy. No. 89/1B"
  }
];

const INITIAL_LABOR_ROSTER: LaborWorker[] = [
  { id: "lab-1", name: "Ramesh Naik", gender: "Male", skillType: "Tractor Operator", dailyWage: 650, daysWorked: 6, advancePaid: 1000, allowance: 200, phone: "+91 98765 43210", attendanceStatus: "Present" },
  { id: "lab-2", name: "Laxmi Bai", gender: "Female", skillType: "General Sowing/Weeding", dailyWage: 450, daysWorked: 8, advancePaid: 500, allowance: 150, phone: "+91 98765 43211", attendanceStatus: "Present" },
  { id: "lab-3", name: "Srinivas Rao", gender: "Male", skillType: "Pesticide Sprayer", dailyWage: 600, daysWorked: 4, advancePaid: 0, allowance: 100, phone: "+91 98765 43212", attendanceStatus: "Present" }
];

const INITIAL_CLAIMS: PMFBYClaim[] = [
  {
    id: "claim-101",
    cropName: "Paddy (Basmati 1121)",
    surveyNumber: "Sy. No. 142/3A",
    causeOfLoss: "Unseasonal Rain / Cyclonic Deluge",
    damagePercentage: 65,
    estimatedLossRs: 84500,
    submissionDate: "2026-07-18",
    status: "Verified by Surveyor",
    referenceNo: "PMFBY-2026-TL-88912"
  }
];

const INITIAL_BOOKINGS: EquipmentBooking[] = [
  {
    id: "book-1",
    equipmentType: "John Deere 5050D Tractor + Rotavator",
    bookingDate: "2026-08-04",
    durationHours: 6,
    ratePerHourRs: 850,
    operatorRequired: true,
    status: "Confirmed",
    chcCenterName: "Warangal CHC Hub #4"
  }
];

const INITIAL_SPRAY_PLANS: SprayPlan[] = [
  {
    id: "spray-1",
    cropName: "Red Chili",
    targetPest: "Chili Thrips & Mites",
    pesticideName: "Neem Oil 10000 PPM + Fipronil",
    sprayDate: "2026-08-02",
    areaAcres: 3,
    waterLiters: 600,
    status: "Scheduled"
  }
];

const INITIAL_WATER_SLOTS: WaterSlotRequest[] = [
  {
    id: "water-1",
    plotName: "North River Bank Plot #1",
    requestDate: "2026-08-05",
    hoursNeeded: 8,
    volumeCusecs: 450,
    status: "Approved",
    officerContact: "Er. K. V. Sharma (Irrigation Dept)"
  }
];

const INITIAL_KCC_LOANS: KCCLoan[] = [
  {
    id: "kcc-1",
    bankName: "State Bank of India (Warangal Agri Branch)",
    loanType: "Crop Finance (KCC)",
    sanctionedAmount: 185000,
    interestRatePct: 7,
    subventionPct: 3,
    netInterestRatePct: 4,
    dueDate: "2027-03-31",
    status: "Active Disbursed",
    accountNo: "SBIN-KCC-38829104"
  },
  {
    id: "kcc-2",
    bankName: "Telangana Grameena Bank",
    loanType: "Post-Harvest Storage",
    sanctionedAmount: 95000,
    interestRatePct: 7,
    subventionPct: 3,
    netInterestRatePct: 4,
    dueDate: "2026-12-15",
    status: "Under Sanction",
    accountNo: "TGB-KCC-9948210"
  }
];

const INITIAL_WAREHOUSES: WarehouseReceipt[] = [
  {
    id: "wh-1",
    warehouseName: "CWC State Warehousing Depot #3",
    location: "Warangal Industrial Zone",
    commodity: "Pusa Basmati 1121 Paddy",
    quantityBags: 350,
    totalWeightMT: 17.5,
    receiptNo: "WDRA-eNWR-8849201",
    storageFeePerBagMonth: 8,
    enwrValueRs: 245000,
    pledgeLoanStatus: "Eligible for 75% Pledge"
  },
  {
    id: "wh-2",
    warehouseName: "Cold Storage Agritrade Hub",
    location: "Guntur Highway Mile 12",
    commodity: "Red Chili (Teja Cold Preserved)",
    quantityBags: 120,
    totalWeightMT: 6.0,
    receiptNo: "WDRA-eNWR-7719230",
    storageFeePerBagMonth: 18,
    enwrValueRs: 380000,
    pledgeLoanStatus: "Loan Disbursed"
  }
];

const INITIAL_SOLAR_PUMPS: SolarPumpSystem[] = [
  {
    id: "solar-1",
    pumpHp: 5,
    type: "Submersible Solar Pump",
    locationPlot: "North River Bank Plot #1",
    dailyKwGenerated: 24.8,
    flowLitersPerMin: 320,
    isPumpActive: true,
    subsidyStatus: "PM-KUSUM 60% Sanctioned"
  }
];

export default function RealWorldFarmerTools() {
  const [activeSubTab, setActiveSubTab] = useState<
    "mandi" | "farm_plots" | "cost_calculator" | "labor_muster" | "govt_schemes" | "equipment_rental" | "fertilizer_dosage" | "water_canal" | "safety_shield" | "kcc_loan" | "cold_storage" | "solar_kusum"
  >("mandi");

  // Notifications Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ============================================================================
  // 1. MANDI STATE & CRUD
  // ============================================================================
  const [mandiList] = useState<MandiPrice[]>(INITIAL_MANDI_RATES);
  const [mandiSearch, setMandiSearch] = useState<string>("");
  const [sellOffers, setSellOffers] = useState<FarmerSellOffer[]>(INITIAL_SELL_OFFERS);
  
  // Create / Edit Sell Offer state
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [offerCommodity, setOfferCommodity] = useState("Rice Paddy (Pusa Basmati 1121)");
  const [offerQty, setOfferQty] = useState(100);
  const [offerPrice, setOfferPrice] = useState(4800);
  const [offerMandi, setOfferMandi] = useState("Warangal Grain Market");
  const [offerPhone, setOfferPhone] = useState("+91 98765 43210");

  const handleSaveSellOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOfferId) {
      setSellOffers(
        sellOffers.map((o) =>
          o.id === editingOfferId
            ? {
                ...o,
                commodity: offerCommodity,
                quantityQuintals: Number(offerQty),
                targetPricePerQuintal: Number(offerPrice),
                mandiName: offerMandi,
                farmerContact: offerPhone
              }
            : o
        )
      );
      showToast("Sell Offer updated successfully!");
    } else {
      const newOffer: FarmerSellOffer = {
        id: `offer-${Date.now()}`,
        commodity: offerCommodity,
        quantityQuintals: Number(offerQty),
        targetPricePerQuintal: Number(offerPrice),
        mandiName: offerMandi,
        farmerContact: offerPhone,
        status: "Active Offer",
        dateCreated: new Date().toISOString().split("T")[0]
      };
      setSellOffers([newOffer, ...sellOffers]);
      showToast("New Farmer Sell Offer posted to Mandi Buyers!");
    }
    setShowOfferModal(false);
    setEditingOfferId(null);
  };

  const handleDeleteSellOffer = (id: string) => {
    setSellOffers(sellOffers.filter((o) => o.id !== id));
    showToast("Sell Offer cancelled and removed.");
  };

  const handleLockPrice = (offer: FarmerSellOffer) => {
    setSellOffers(
      sellOffers.map((o) => (o.id === offer.id ? { ...o, status: "Locked Rate" } : o))
    );
    showToast(`Rate locked at ₹${offer.targetPricePerQuintal}/Qtl! Mandi Gate Pass generated.`);
  };

  // ============================================================================
  // 2. FARM PLOTS & SOIL CRUD
  // ============================================================================
  const [plots, setPlots] = useState<FarmPlot[]>(INITIAL_PLOTS);
  const [showPlotModal, setShowPlotModal] = useState(false);
  const [editingPlotId, setEditingPlotId] = useState<string | null>(null);
  const [plotName, setPlotName] = useState("");
  const [plotAcres, setPlotAcres] = useState(3.5);
  const [plotSoil, setPlotSoil] = useState("Black Cotton Soil");
  const [plotCrop, setPlotCrop] = useState("Cotton");
  const [plotPh, setPlotPh] = useState(6.8);
  const [plotMoisture, setPlotMoisture] = useState(65);
  const [plotIrrigation, setPlotIrrigation] = useState<FarmPlot["irrigationType"]>("Drip Irrigation");

  const handleSavePlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plotName.trim()) return;

    if (editingPlotId) {
      setPlots(
        plots.map((p) =>
          p.id === editingPlotId
            ? {
                ...p,
                plotName,
                areaAcres: Number(plotAcres),
                soilType: plotSoil,
                currentCrop: plotCrop,
                soilPh: Number(plotPh),
                moisturePct: Number(plotMoisture),
                irrigationType: plotIrrigation
              }
            : p
        )
      );
      showToast("Farm Plot details updated.");
    } else {
      const newPlot: FarmPlot = {
        id: `plot-${Date.now()}`,
        plotName,
        areaAcres: Number(plotAcres),
        soilType: plotSoil,
        currentCrop: plotCrop,
        soilPh: Number(plotPh),
        moisturePct: Number(plotMoisture),
        irrigationType: plotIrrigation,
        healthStatus: "Optimal",
        khasraNumber: `Sy. No. ${Math.floor(100 + Math.random() * 800)}/2B`
      };
      setPlots([...plots, newPlot]);
      showToast("New Farm Plot added to system.");
    }
    setShowPlotModal(false);
    setEditingPlotId(null);
  };

  const handleDeletePlot = (id: string) => {
    setPlots(plots.filter((p) => p.id !== id));
    showToast("Plot removed from register.");
  };

  const handleRunSoilTest = (plot: FarmPlot) => {
    showToast(`AI Soil Diagnostic Complete for ${plot.plotName}: N-P-K level balanced. Apply 15kg Zinc Sulfate.`);
  };

  // ============================================================================
  // 3. COST OF CULTIVATION & EXPENSES CRUD
  // ============================================================================
  const [calcAcreage, setCalcAcreage] = useState<number>(5);
  const [calcCropType, setCalcCropType] = useState<string>("Paddy / Rice");
  const [costSeed, setCostSeed] = useState<number>(2500);
  const [costTractor, setCostTractor] = useState<number>(3800);
  const [costFertilizer, setCostFertilizer] = useState<number>(4200);
  const [costPesticide, setCostPesticide] = useState<number>(2800);
  const [costIrrigationPower, setCostIrrigationPower] = useState<number>(1500);
  const [costLaborWage, setCostLaborWage] = useState<number>(6500);
  const [costTransport, setCostTransport] = useState<number>(2000);
  const [expectedYieldQuintalsPerAcre, setExpectedYieldQuintalsPerAcre] = useState<number>(24);
  const [expectedMarketPricePerQuintal, setExpectedMarketPricePerQuintal] = useState<number>(2250);

  const totalCostPerAcre =
    costSeed + costTractor + costFertilizer + costPesticide + costIrrigationPower + costLaborWage + costTransport;
  const grandTotalCost = totalCostPerAcre * calcAcreage;
  const grossRevenuePerAcre = expectedYieldQuintalsPerAcre * expectedMarketPricePerQuintal;
  const grandGrossRevenue = grossRevenuePerAcre * calcAcreage;
  const netProfitPerAcre = grossRevenuePerAcre - totalCostPerAcre;
  const grandNetProfit = grandGrossRevenue - grandTotalCost;
  const roiPercentage = totalCostPerAcre > 0 ? Math.round((netProfitPerAcre / totalCostPerAcre) * 100) : 0;
  const breakevenYield = expectedMarketPricePerQuintal > 0 ? (totalCostPerAcre / expectedMarketPricePerQuintal).toFixed(1) : "0";

  // ============================================================================
  // 4. LABOR MUSTER ROLL & WAGE CRUD
  // ============================================================================
  const [laborList, setLaborList] = useState<LaborWorker[]>(INITIAL_LABOR_ROSTER);
  const [showLaborModal, setShowLaborModal] = useState(false);
  const [editingLaborId, setEditingLaborId] = useState<string | null>(null);
  const [laborName, setLaborName] = useState("");
  const [laborGender, setLaborGender] = useState<"Male" | "Female">("Male");
  const [laborSkill, setLaborSkill] = useState<LaborWorker["skillType"]>("General Sowing/Weeding");
  const [laborWage, setLaborWage] = useState(500);
  const [laborAdvance, setLaborAdvance] = useState(0);

  const handleSaveLabor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!laborName.trim()) return;

    if (editingLaborId) {
      setLaborList(
        laborList.map((l) =>
          l.id === editingLaborId
            ? {
                ...l,
                name: laborName,
                gender: laborGender,
                skillType: laborSkill,
                dailyWage: Number(laborWage),
                advancePaid: Number(laborAdvance)
              }
            : l
        )
      );
      showToast("Worker details updated.");
    } else {
      const worker: LaborWorker = {
        id: `lab-${Date.now()}`,
        name: laborName,
        gender: laborGender,
        skillType: laborSkill,
        dailyWage: Number(laborWage),
        daysWorked: 1,
        advancePaid: Number(laborAdvance),
        allowance: 50,
        phone: "+91 98765 00000",
        attendanceStatus: "Present"
      };
      setLaborList([...laborList, worker]);
      showToast("New Worker registered on Muster Roll.");
    }
    setShowLaborModal(false);
    setEditingLaborId(null);
  };

  const handleDeleteWorker = (id: string) => {
    setLaborList(laborList.filter((l) => l.id !== id));
    showToast("Worker removed from Muster Roll.");
  };

  const handleSettlePayout = (worker: LaborWorker) => {
    const gross = worker.dailyWage * worker.daysWorked + worker.allowance;
    const net = gross - worker.advancePaid;
    showToast(`Payout settled for ${worker.name}: ₹${net.toLocaleString()} transferred via Direct UPI.`);
    setLaborList(
      laborList.map((l) => (l.id === worker.id ? { ...l, daysWorked: 0, advancePaid: 0 } : l))
    );
  };

  // ============================================================================
  // 5. PMFBY CROP INSURANCE & SUBSIDIES CRUD
  // ============================================================================
  const [claimsList, setClaimsList] = useState<PMFBYClaim[]>(INITIAL_CLAIMS);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [editingClaimId, setEditingClaimId] = useState<string | null>(null);
  const [claimCrop, setClaimCrop] = useState("Cotton");
  const [claimSurvey, setClaimSurvey] = useState("Sy. No. 89/1B");
  const [claimCause, setClaimCause] = useState<PMFBYClaim["causeOfLoss"]>("Unseasonal Rain / Cyclonic Deluge");
  const [claimPct, setClaimPct] = useState(50);

  const handleSaveClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClaimId) {
      setClaimsList(
        claimsList.map((c) =>
          c.id === editingClaimId
            ? {
                ...c,
                cropName: claimCrop,
                surveyNumber: claimSurvey,
                causeOfLoss: claimCause,
                damagePercentage: Number(claimPct),
                estimatedLossRs: (Number(claimPct) / 100) * 85000
              }
            : c
        )
      );
      showToast("Insurance claim updated.");
    } else {
      const claim: PMFBYClaim = {
        id: `claim-${Date.now()}`,
        cropName: claimCrop,
        surveyNumber: claimSurvey,
        causeOfLoss: claimCause,
        damagePercentage: Number(claimPct),
        estimatedLossRs: (Number(claimPct) / 100) * 85000,
        submissionDate: new Date().toISOString().split("T")[0],
        status: "Under Inspection",
        referenceNo: `PMFBY-2026-${Math.floor(10000 + Math.random() * 90000)}`
      };
      setClaimsList([claim, ...claimsList]);
      showToast("PMFBY Crop Damage Claim filed! Reference ID generated.");
    }
    setShowClaimModal(false);
    setEditingClaimId(null);
  };

  const handleDeleteClaim = (id: string) => {
    setClaimsList(claimsList.filter((c) => c.id !== id));
    showToast("Claim withdrawn.");
  };

  const handleRequestSurveyor = (claim: PMFBYClaim) => {
    showToast(`Surveyor Inspection requested for Ref ${claim.referenceNo}. Officer will visit within 24 hours.`);
  };

  // ============================================================================
  // 6. EQUIPMENT RENTAL CRUD
  // ============================================================================
  const [bookings, setBookings] = useState<EquipmentBooking[]>(INITIAL_BOOKINGS);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookEquipmentType, setBookEquipmentType] = useState("John Deere 5050D Tractor + Rotavator");
  const [bookDate, setBookDate] = useState("2026-08-05");
  const [bookHours, setBookHours] = useState(8);
  const [bookOperator, setBookOperator] = useState(true);

  const handleSaveBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking: EquipmentBooking = {
      id: `book-${Date.now()}`,
      equipmentType: bookEquipmentType,
      bookingDate: bookDate,
      durationHours: Number(bookHours),
      ratePerHourRs: 850,
      operatorRequired: bookOperator,
      status: "Confirmed",
      chcCenterName: "Warangal CHC Hub #4"
    };
    setBookings([newBooking, ...bookings]);
    setShowBookingModal(false);
    showToast("Equipment reserved with Custom Hiring Center!");
  };

  const handleCancelBooking = (id: string) => {
    setBookings(bookings.filter((b) => b.id !== id));
    showToast("Equipment booking cancelled.");
  };

  // ============================================================================
  // 7. FERTILIZER & SPRAY DOSAGE ENGINE
  // ============================================================================
  const [doseCrop, setDoseCrop] = useState("Wheat");
  const [doseAreaAcres, setDoseAreaAcres] = useState(4);
  const [doseSoilType, setDoseSoilType] = useState("Black Cotton / Heavy Clay");
  const [sprayPlans, setSprayPlans] = useState<SprayPlan[]>(INITIAL_SPRAY_PLANS);

  const calculateFertilizerDosage = () => {
    let ureaBags = 2.5 * doseAreaAcres;
    let dapBags = 1.2 * doseAreaAcres;
    let mopBags = 0.8 * doseAreaAcres;
    let zincKg = 5 * doseAreaAcres;

    if (doseCrop === "Rice Paddy") {
      ureaBags = 3.2 * doseAreaAcres;
      dapBags = 1.5 * doseAreaAcres;
      mopBags = 1.0 * doseAreaAcres;
    } else if (doseCrop === "Cotton") {
      ureaBags = 3.5 * doseAreaAcres;
      dapBags = 1.8 * doseAreaAcres;
      mopBags = 1.5 * doseAreaAcres;
    }

    return {
      ureaBags: Math.round(ureaBags),
      dapBags: Math.round(dapBags),
      mopBags: Math.round(mopBags),
      zincKg: Math.round(zincKg),
      waterTankLiters: doseAreaAcres * 200
    };
  };

  const dosageResult = calculateFertilizerDosage();

  const handleOrderFertilizerPACS = () => {
    showToast(`Order placed with PACS Store for ${dosageResult.ureaBags} Urea & ${dosageResult.dapBags} DAP Bags!`);
  };

  // ============================================================================
  // 8. WATER CANAL & IRRIGATION CRUD
  // ============================================================================
  const [waterSlots, setWaterSlots] = useState<WaterSlotRequest[]>(INITIAL_WATER_SLOTS);
  const [showWaterModal, setShowWaterModal] = useState(false);
  const [waterPlot, setWaterPlot] = useState("North River Bank Plot #1");
  const [waterDate, setWaterDate] = useState("2026-08-06");
  const [waterHours, setWaterHours] = useState(6);

  const handleSaveWaterSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const newSlot: WaterSlotRequest = {
      id: `water-${Date.now()}`,
      plotName: waterPlot,
      requestDate: waterDate,
      hoursNeeded: Number(waterHours),
      volumeCusecs: 400,
      status: "Approved",
      officerContact: "Er. K. V. Sharma (Irrigation Dept)"
    };
    setWaterSlots([newSlot, ...waterSlots]);
    setShowWaterModal(false);
    showToast("Canal Irrigation Water Slot reserved successfully!");
  };

  const handleDeleteWaterSlot = (id: string) => {
    setWaterSlots(waterSlots.filter((w) => w.id !== id));
    showToast("Irrigation slot cancelled.");
  };

  // ============================================================================
  // 9. KCC LOAN STATE & CRUD
  // ============================================================================
  const [kccLoans, setKccLoans] = useState<KCCLoan[]>(INITIAL_KCC_LOANS);
  const [showKccModal, setShowKccModal] = useState(false);
  const [kccBank, setKccBank] = useState("State Bank of India");
  const [kccAmount, setKccAmount] = useState(150000);
  const [kccCropAcreage, setKccCropAcreage] = useState(4);
  const [kccCropType, setKccCropType] = useState("Cotton (High Yield)");

  const handleApplyKccLoan = (e: React.FormEvent) => {
    e.preventDefault();
    const newLoan: KCCLoan = {
      id: `kcc-${Date.now()}`,
      bankName: kccBank,
      loanType: "Crop Finance (KCC)",
      sanctionedAmount: Number(kccAmount),
      interestRatePct: 7,
      subventionPct: 3,
      netInterestRatePct: 4,
      dueDate: "2027-03-31",
      status: "Application Submitted",
      accountNo: `KCC-APP-${Math.floor(100000 + Math.random() * 900000)}`
    };
    setKccLoans([newLoan, ...kccLoans]);
    setShowKccModal(false);
    showToast("Kisan Credit Card (KCC) Loan Application submitted to Bank Manager!");
  };

  const handleDeleteKccLoan = (id: string) => {
    setKccLoans(kccLoans.filter((k) => k.id !== id));
    showToast("KCC Loan record deleted.");
  };

  // ============================================================================
  // 10. WAREHOUSE & e-NWR PLEDGE LOAN STATE & CRUD
  // ============================================================================
  const [warehouses, setWarehouses] = useState<WarehouseReceipt[]>(INITIAL_WAREHOUSES);
  const [showWarehouseModal, setShowWarehouseModal] = useState(false);
  const [whName, setWhName] = useState("Central Warehousing Depot #3");
  const [whCommodity, setWhCommodity] = useState("Paddy Grain");
  const [whBags, setWhBags] = useState(200);

  const handleStoreGrain = (e: React.FormEvent) => {
    e.preventDefault();
    const newReceipt: WarehouseReceipt = {
      id: `wh-${Date.now()}`,
      warehouseName: whName,
      location: "District Mandi Agri Park",
      commodity: whCommodity,
      quantityBags: Number(whBags),
      totalWeightMT: Number(whBags) * 0.05,
      receiptNo: `WDRA-eNWR-${Math.floor(1000000 + Math.random() * 9000000)}`,
      storageFeePerBagMonth: 10,
      enwrValueRs: Number(whBags) * 1200,
      pledgeLoanStatus: "Eligible for 75% Pledge"
    };
    setWarehouses([newReceipt, ...warehouses]);
    setShowWarehouseModal(false);
    showToast("Grain stored & e-NWR Electronic Negotiable Receipt generated!");
  };

  const handlePledgeEnwrLoan = (receipt: WarehouseReceipt) => {
    const loanVal = Math.round(receipt.enwrValueRs * 0.75);
    setWarehouses(
      warehouses.map((w) =>
        w.id === receipt.id ? { ...w, pledgeLoanStatus: "Loan Disbursed" } : w
      )
    );
    showToast(`e-NWR Pledge Loan of ₹${loanVal.toLocaleString()} disbursed to your Bank Account!`);
  };

  const handleDeleteWarehouse = (id: string) => {
    setWarehouses(warehouses.filter((w) => w.id !== id));
    showToast("Warehouse receipt entry removed.");
  };

  // ============================================================================
  // 11. SOLAR PUMP STATE & REMOTE CONTROL TOGGLE
  // ============================================================================
  const [solarPumps, setSolarPumps] = useState<SolarPumpSystem[]>(INITIAL_SOLAR_PUMPS);

  const handleToggleSolarPump = (id: string) => {
    setSolarPumps(
      solarPumps.map((p) => {
        if (p.id === id) {
          const nextState = !p.isPumpActive;
          showToast(
            nextState
              ? `Solar Pump ON! IoT controller broadcasting ${p.flowLitersPerMin} L/min water stream.`
              : "Solar Pump powered OFF via Remote IoT Switch."
          );
          return { ...p, isPumpActive: nextState };
        }
        return p;
      })
    );
  };

  // Filtered Mandi List
  const filteredMandi = mandiList.filter(
    (m) =>
      m.commodity.toLowerCase().includes(mandiSearch.toLowerCase()) ||
      m.mandiName.toLowerCase().includes(mandiSearch.toLowerCase()) ||
      m.district.toLowerCase().includes(mandiSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 text-slate-800">
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-6 rounded-3xl shadow-lg border border-emerald-700/50 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black rounded-full uppercase tracking-widest mb-2">
              <Zap className="h-3.5 w-3.5" /> Comprehensive Real-World Farmer Operations Suite
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-display">
              Farmer Operational Portal & CRUD Suite
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl mt-1">
              Complete management tools for APMC Mandi Sales, Farm Plots, Labor Muster Rolls, PMFBY Insurance Claims, CHC Equipment Rentals, NPK Fertilizer Dosing, and Irrigation Canal Schedules.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveSubTab("mandi")}
              className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <TrendingUp className="h-4 w-4" /> Live Mandi Rates
            </button>
            <button
              onClick={() => setActiveSubTab("farm_plots")}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Layers className="h-4 w-4" /> Farm Plot Manager
            </button>
          </div>
        </div>
      </div>

      {/* Primary Sub-Navigation Bar */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-2 scrollbar-none">
        {[
          { id: "mandi", label: "Mandi Rates & Sell Bids", icon: TrendingUp },
          { id: "farm_plots", label: "Farm Plots & Soil Health", icon: Layers },
          { id: "cost_calculator", label: "P&L & Cultivation Cost", icon: Calculator },
          { id: "labor_muster", label: "Labor Muster & Wages", icon: Users },
          { id: "kcc_loan", label: "KCC Loan Finance Hub", icon: CreditCard },
          { id: "cold_storage", label: "e-NWR Warehouses", icon: Warehouse },
          { id: "solar_kusum", label: "PM-KUSUM Solar Pumps", icon: Sun },
          { id: "govt_schemes", label: "PMFBY Insurance Claims", icon: Building2 },
          { id: "equipment_rental", label: "CHC Tractor Rentals", icon: Tractor },
          { id: "fertilizer_dosage", label: "NPK & Spray Engine", icon: FlaskConical },
          { id: "water_canal", label: "Water Canal Rotations", icon: Droplets },
          { id: "safety_shield", label: "Safety & Heat Shield", icon: ShieldAlert }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? "bg-emerald-700 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
              }`}
            >
              <Icon className={`h-4 w-4 ${isSelected ? "text-emerald-200" : "text-emerald-600"}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ============================================================================
          SECTION 1: LIVE MANDI RATES & FARMER SELL OFFERS (FULL CRUD)
          ============================================================================ */}
      {activeSubTab === "mandi" && (
        <div className="space-y-6">
          {/* APMC Live Rates Grid */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 font-display flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  Live APMC Mandi Price Feed (Real-Time Arrival Data)
                </h2>
                <p className="text-xs text-slate-500">
                  Daily modal prices per quintal across government registered mandis.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search commodity or mandi..."
                    value={mandiSearch}
                    onChange={(e) => setMandiSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
                <button
                  onClick={() => {
                    setEditingOfferId(null);
                    setOfferCommodity("Rice Paddy (Pusa Basmati 1121)");
                    setOfferQty(100);
                    setOfferPrice(4800);
                    setShowOfferModal(true);
                  }}
                  className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="h-4 w-4" /> Post Sell Offer
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredMandi.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 hover:border-emerald-500 transition-all space-y-3 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">{item.mandiName}</span>
                      <h3 className="font-extrabold text-slate-900 text-sm mt-0.5">{item.commodity}</h3>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-emerald-600" /> {item.district} ({item.distanceKm} km away)
                      </p>
                    </div>

                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-black flex items-center gap-0.5 ${
                        item.trend === "up"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.trend === "down"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {item.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : item.trend === "down" ? <ArrowDownRight className="h-3 w-3" /> : null}
                      {item.changePct > 0 ? `+${item.changePct}%` : `${item.changePct}%`}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <p className="text-[9px] uppercase text-slate-400 font-bold">Modal Mandi Rate</p>
                      <p className="text-xl font-black text-emerald-700">₹{item.modalPrice.toLocaleString()}</p>
                      <p className="text-[9px] text-slate-400">per Quintal (100 kg)</p>
                    </div>

                    <div className="text-right text-[10px] text-slate-500 space-y-0.5">
                      <p>Range: <strong className="text-slate-800">₹{item.minPrice} - ₹{item.maxPrice}</strong></p>
                      <p>Arrivals: <strong className="text-slate-800">{item.arrivalsQuintals} Qtl</strong></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Farmer Active Sell Offers & CRUD Table */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 font-display flex items-center gap-2 border-b border-slate-100 pb-3">
              <DollarSign className="h-4.5 w-4.5 text-emerald-600" />
              Farmer Direct Sell Offers & Mandi Rate Locks (CRUD)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[10px] uppercase font-bold">
                  <tr>
                    <th className="p-3">Commodity</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3">Target Price</th>
                    <th className="p-3">Target Mandi</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {sellOffers.map((offer) => (
                    <tr key={offer.id} className="hover:bg-slate-50">
                      <td className="p-3 font-extrabold text-slate-900">{offer.commodity}</td>
                      <td className="p-3 font-bold text-slate-700">{offer.quantityQuintals} Quintals</td>
                      <td className="p-3 font-black text-emerald-700">₹{offer.targetPricePerQuintal}/Qtl</td>
                      <td className="p-3 text-slate-600">{offer.mandiName}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 text-[10px] font-black rounded-full ${
                            offer.status === "Locked Rate"
                              ? "bg-indigo-100 text-indigo-800"
                              : offer.status === "Active Offer"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {offer.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 text-[10px]">{offer.dateCreated}</td>
                      <td className="p-3 text-right space-x-1">
                        {offer.status === "Active Offer" && (
                          <button
                            onClick={() => handleLockPrice(offer)}
                            className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-lg cursor-pointer"
                          >
                            Lock Rate
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingOfferId(offer.id);
                            setOfferCommodity(offer.commodity);
                            setOfferQty(offer.quantityQuintals);
                            setOfferPrice(offer.targetPricePerQuintal);
                            setOfferMandi(offer.mandiName);
                            setShowOfferModal(true);
                          }}
                          className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSellOffer(offer.id)}
                          className="p-1.5 text-slate-600 hover:text-rose-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sell Offer Modal */}
          {showOfferModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white max-w-md w-full p-6 rounded-3xl space-y-4 border border-slate-200 shadow-2xl">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                    {editingOfferId ? "Edit Sell Offer" : "Post Direct Mandi Sell Offer"}
                  </h3>
                  <button onClick={() => setShowOfferModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveSellOffer} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Commodity / Crop</label>
                    <input
                      type="text"
                      value={offerCommodity}
                      onChange={(e) => setOfferCommodity(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Quantity (Quintals)</label>
                      <input
                        type="number"
                        value={offerQty}
                        onChange={(e) => setOfferQty(Number(e.target.value))}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Expected Price (₹/Qtl)</label>
                      <input
                        type="number"
                        value={offerPrice}
                        onChange={(e) => setOfferPrice(Number(e.target.value))}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Target Mandi Location</label>
                    <input
                      type="text"
                      value={offerMandi}
                      onChange={(e) => setOfferMandi(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      required
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowOfferModal(false)}
                      className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 cursor-pointer"
                    >
                      {editingOfferId ? "Update Offer" : "Post Offer"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================================
          SECTION 2: FARM PLOTS & SOIL HEALTH (FULL CRUD)
          ============================================================================ */}
      {activeSubTab === "farm_plots" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 font-display flex items-center gap-2">
                  <Layers className="h-5 w-5 text-emerald-600" />
                  Farm Plots & Soil Health Management (CRUD)
                </h2>
                <p className="text-xs text-slate-500">
                  Manage plot acreage, soil pH meters, crop rotation logs, and GPS khasra boundaries.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingPlotId(null);
                  setPlotName("");
                  setPlotAcres(3.5);
                  setPlotSoil("Black Cotton Soil");
                  setPlotCrop("Cotton");
                  setShowPlotModal(true);
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Add New Farm Plot
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plots.map((plot) => (
                <div key={plot.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{plot.khasraNumber}</span>
                      <h3 className="font-extrabold text-slate-900 text-sm mt-0.5">{plot.plotName}</h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {plot.areaAcres} Acres | <strong>{plot.currentCrop}</strong>
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                        plot.healthStatus === "Optimal"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {plot.healthStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs bg-white p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase">Soil pH</span>
                      <span className="font-black text-slate-900 text-sm">{plot.soilPh} pH</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase">Moisture</span>
                      <span className="font-black text-blue-700 text-sm">{plot.moisturePct}%</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase">Irrigation</span>
                      <span className="font-bold text-slate-700 text-[10px]">{plot.irrigationType}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <button
                      onClick={() => handleRunSoilTest(plot)}
                      className="px-3 py-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-bold rounded-xl text-[10px] cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="h-3.5 w-3.5" /> AI Soil Diagnostic
                    </button>

                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingPlotId(plot.id);
                          setPlotName(plot.plotName);
                          setPlotAcres(plot.areaAcres);
                          setPlotSoil(plot.soilType);
                          setPlotCrop(plot.currentCrop);
                          setPlotPh(plot.soilPh);
                          setPlotMoisture(plot.moisturePct);
                          setPlotIrrigation(plot.irrigationType);
                          setShowPlotModal(true);
                        }}
                        className="p-1.5 bg-white text-slate-600 hover:text-emerald-700 border border-slate-200 rounded-lg cursor-pointer"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePlot(plot.id)}
                        className="p-1.5 bg-white text-slate-600 hover:text-rose-700 border border-slate-200 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Farm Plot Modal */}
          {showPlotModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white max-w-md w-full p-6 rounded-3xl space-y-4 border border-slate-200 shadow-2xl">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <Layers className="h-5 w-5 text-emerald-600" />
                    {editingPlotId ? "Edit Farm Plot" : "Add New Farm Plot"}
                  </h3>
                  <button onClick={() => setShowPlotModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSavePlot} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Plot Name</label>
                    <input
                      type="text"
                      value={plotName}
                      onChange={(e) => setPlotName(e.target.value)}
                      placeholder="e.g. South Paddy Field #3"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Area (Acres)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={plotAcres}
                        onChange={(e) => setPlotAcres(Number(e.target.value))}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Current Crop</label>
                      <input
                        type="text"
                        value={plotCrop}
                        onChange={(e) => setPlotCrop(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Soil pH</label>
                      <input
                        type="number"
                        step="0.1"
                        value={plotPh}
                        onChange={(e) => setPlotPh(Number(e.target.value))}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Moisture (%)</label>
                      <input
                        type="number"
                        value={plotMoisture}
                        onChange={(e) => setPlotMoisture(Number(e.target.value))}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Irrigation System</label>
                    <select
                      value={plotIrrigation}
                      onChange={(e) => setPlotIrrigation(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer"
                    >
                      <option>Drip Irrigation</option>
                      <option>Canal Flood</option>
                      <option>Borewell Sprinkler</option>
                    </select>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowPlotModal(false)}
                      className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 cursor-pointer"
                    >
                      {editingPlotId ? "Update Plot" : "Save Plot"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================================
          SECTION 3: COST OF CULTIVATION & P&L CALCULATOR
          ============================================================================ */}
      {activeSubTab === "cost_calculator" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 font-display flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calculator className="h-4.5 w-4.5 text-emerald-600" />
              Cost of Cultivation Input Parameters (per Acre)
            </h2>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Total Farm Area (Acres)</label>
                <input
                  type="number"
                  value={calcAcreage}
                  onChange={(e) => setCalcAcreage(Math.max(1, Number(e.target.value)))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Crop Type</label>
                <select
                  value={calcCropType}
                  onChange={(e) => setCalcCropType(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer"
                >
                  <option>Paddy / Rice</option>
                  <option>Wheat</option>
                  <option>Tomato</option>
                  <option>Cotton</option>
                  <option>Maize</option>
                  <option>Soybean</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Seeds & Nursery (₹/Acre)</label>
                <input
                  type="number"
                  value={costSeed}
                  onChange={(e) => setCostSeed(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Tractor & Tillage (₹/Acre)</label>
                <input
                  type="number"
                  value={costTractor}
                  onChange={(e) => setCostTractor(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Fertilizers & Organic (₹/Acre)</label>
                <input
                  type="number"
                  value={costFertilizer}
                  onChange={(e) => setCostFertilizer(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Pesticides & Sprays (₹/Acre)</label>
                <input
                  type="number"
                  value={costPesticide}
                  onChange={(e) => setCostPesticide(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Labor Wages (₹/Acre)</label>
                <input
                  type="number"
                  value={costLaborWage}
                  onChange={(e) => setCostLaborWage(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Irrigation & Power (₹/Acre)</label>
                <input
                  type="number"
                  value={costIrrigationPower}
                  onChange={(e) => setCostIrrigationPower(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Expected Yield (Quintals/Acre)</label>
                <input
                  type="number"
                  value={expectedYieldQuintalsPerAcre}
                  onChange={(e) => setExpectedYieldQuintalsPerAcre(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Expected Price (₹/Quintal)</label>
                <input
                  type="number"
                  value={expectedMarketPricePerQuintal}
                  onChange={(e) => setExpectedMarketPricePerQuintal(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-4 shadow-md">
              <h2 className="text-sm font-extrabold text-emerald-400 font-display flex items-center gap-2 border-b border-slate-800 pb-3">
                <BarChart3 className="h-4.5 w-4.5" />
                Financial Profitability Analysis
              </h2>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-800/80 rounded-xl">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Total Cost / Acre</p>
                  <p className="text-lg font-black text-rose-400">₹{totalCostPerAcre.toLocaleString()}</p>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-xl">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Gross Revenue / Acre</p>
                  <p className="text-lg font-black text-emerald-400">₹{grossRevenuePerAcre.toLocaleString()}</p>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-xl col-span-2 border border-emerald-500/40">
                  <p className="text-[10px] text-emerald-300 uppercase font-bold">Net Profit / Acre</p>
                  <p className="text-2xl font-black text-emerald-400">₹{netProfitPerAcre.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-300 mt-0.5">
                    For {calcAcreage} Acres Total: <strong className="text-white">₹{grandNetProfit.toLocaleString()} Net Profit</strong>
                  </p>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-xl">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">ROI Return</p>
                  <p className="text-base font-black text-amber-300">+{roiPercentage}%</p>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-xl">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Breakeven Yield</p>
                  <p className="text-base font-black text-indigo-300">{breakevenYield} Qtl / Acre</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================================
          SECTION 4: DAILY LABOR MUSTER & WAGE REGISTER (FULL CRUD)
          ============================================================================ */}
      {activeSubTab === "labor_muster" && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 font-display flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-600" />
                  Farm Labor Muster Roll & Advance Register (CRUD)
                </h2>
                <p className="text-xs text-slate-500">
                  Track daily field worker attendance, wages, advances, and direct wage settlements.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingLaborId(null);
                  setLaborName("");
                  setLaborWage(500);
                  setLaborAdvance(0);
                  setShowLaborModal(true);
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Register Worker
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[10px] uppercase font-bold">
                  <tr>
                    <th className="p-3">Worker Name</th>
                    <th className="p-3">Skill Role</th>
                    <th className="p-3">Daily Rate</th>
                    <th className="p-3">Days Worked</th>
                    <th className="p-3">Advance Paid</th>
                    <th className="p-3">Net Payable</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {laborList.map((worker) => {
                    const grossAmount = worker.dailyWage * worker.daysWorked + worker.allowance;
                    const netPayable = grossAmount - worker.advancePaid;

                    return (
                      <tr key={worker.id} className="hover:bg-slate-50">
                        <td className="p-3 font-extrabold text-slate-900">{worker.name}</td>
                        <td className="p-3 text-slate-600">{worker.skillType}</td>
                        <td className="p-3 font-bold text-slate-800">₹{worker.dailyWage}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setLaborList(
                                  laborList.map((l) =>
                                    l.id === worker.id ? { ...l, daysWorked: Math.max(0, l.daysWorked - 1) } : l
                                  )
                                );
                              }}
                              className="w-5 h-5 bg-slate-200 rounded text-center font-black cursor-pointer"
                            >
                              -
                            </button>
                            <span className="font-bold px-2">{worker.daysWorked} d</span>
                            <button
                              onClick={() => {
                                setLaborList(
                                  laborList.map((l) =>
                                    l.id === worker.id ? { ...l, daysWorked: l.daysWorked + 1 } : l
                                  )
                                );
                              }}
                              className="w-5 h-5 bg-slate-200 rounded text-center font-black cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-3 text-rose-600 font-bold">₹{worker.advancePaid}</td>
                        <td className="p-3 font-black text-emerald-700 text-sm">₹{netPayable.toLocaleString()}</td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={() => handleSettlePayout(worker)}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg cursor-pointer"
                          >
                            Pay UPI
                          </button>
                          <button
                            onClick={() => {
                              setEditingLaborId(worker.id);
                              setLaborName(worker.name);
                              setLaborGender(worker.gender);
                              setLaborSkill(worker.skillType);
                              setLaborWage(worker.dailyWage);
                              setLaborAdvance(worker.advancePaid);
                              setShowLaborModal(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 rounded-lg cursor-pointer"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteWorker(worker.id)}
                            className="p-1.5 text-slate-600 hover:text-rose-700 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Labor Worker Modal */}
          {showLaborModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white max-w-md w-full p-6 rounded-3xl space-y-4 border border-slate-200 shadow-2xl">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <Users className="h-5 w-5 text-emerald-600" />
                    {editingLaborId ? "Edit Worker Details" : "Register Worker on Muster"}
                  </h3>
                  <button onClick={() => setShowLaborModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveLabor} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Worker Name</label>
                    <input
                      type="text"
                      value={laborName}
                      onChange={(e) => setLaborName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Skill Category</label>
                      <select
                        value={laborSkill}
                        onChange={(e) => setLaborSkill(e.target.value as any)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer"
                      >
                        <option>General Sowing/Weeding</option>
                        <option>Tractor Operator</option>
                        <option>Harvesting Crew</option>
                        <option>Pesticide Sprayer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Daily Wage (₹)</label>
                      <input
                        type="number"
                        value={laborWage}
                        onChange={(e) => setLaborWage(Number(e.target.value))}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Advance Paid (₹)</label>
                    <input
                      type="number"
                      value={laborAdvance}
                      onChange={(e) => setLaborAdvance(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowLaborModal(false)}
                      className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 cursor-pointer"
                    >
                      {editingLaborId ? "Update Worker" : "Add Worker"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================================
          SECTION 5: PMFBY INSURANCE CLAIMS (FULL CRUD)
          ============================================================================ */}
      {activeSubTab === "govt_schemes" && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 font-display flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-emerald-600" />
                  PMFBY Crop Loss Insurance Claims (CRUD)
                </h2>
                <p className="text-xs text-slate-500">
                  File disaster damage claims within 72 hours for direct insurance disbursement.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingClaimId(null);
                  setClaimCrop("Cotton");
                  setClaimSurvey("Sy. No. 89/1B");
                  setClaimPct(50);
                  setShowClaimModal(true);
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> File PMFBY Claim
              </button>
            </div>

            <div className="space-y-3">
              {claimsList.map((c) => (
                <div key={c.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">{c.cropName} ({c.surveyNumber})</span>
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-extrabold text-[10px] rounded-full">
                        {c.referenceNo}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Cause: <strong>{c.causeOfLoss}</strong> | Impact: <strong className="text-rose-600">{c.damagePercentage}% Damage</strong>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Submitted: {c.submissionDate}</p>
                  </div>

                  <div className="text-right space-y-1">
                    <p className="text-xs font-bold text-slate-500">Claim Payout Amount</p>
                    <p className="text-lg font-black text-emerald-700">₹{c.estimatedLossRs.toLocaleString()}</p>
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => handleRequestSurveyor(c)}
                        className="px-2.5 py-1 bg-slate-800 text-white text-[10px] font-bold rounded-lg cursor-pointer"
                      >
                        Request Surveyor
                      </button>
                      <button
                        onClick={() => handleDeleteClaim(c.id)}
                        className="p-1 text-slate-500 hover:text-rose-700 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showClaimModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white max-w-md w-full p-6 rounded-3xl space-y-4 border border-slate-200 shadow-2xl">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-emerald-600" />
                    {editingClaimId ? "Edit PMFBY Claim" : "File 72-Hour Crop Loss Claim"}
                  </h3>
                  <button onClick={() => setShowClaimModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveClaim} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Crop Name</label>
                    <input
                      type="text"
                      value={claimCrop}
                      onChange={(e) => setClaimCrop(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Survey / Khasra No.</label>
                    <input
                      type="text"
                      value={claimSurvey}
                      onChange={(e) => setClaimSurvey(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Cause of Loss</label>
                    <select
                      value={claimCause}
                      onChange={(e) => setClaimCause(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer"
                    >
                      <option>Unseasonal Rain / Cyclonic Deluge</option>
                      <option>Hailstorm Damage</option>
                      <option>Drought / Pest Outbreak</option>
                      <option>Post-Harvest In-Field Loss</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Damage Percentage (%)</label>
                    <input
                      type="number"
                      value={claimPct}
                      onChange={(e) => setClaimPct(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      required
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowClaimModal(false)}
                      className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 cursor-pointer"
                    >
                      Submit Claim
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================================
          SECTION 6: CHC EQUIPMENT RENTAL (FULL CRUD)
          ============================================================================ */}
      {activeSubTab === "equipment_rental" && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 font-display flex items-center gap-2">
                  <Tractor className="h-5 w-5 text-emerald-600" />
                  Custom Hiring Center (CHC) Equipment Rentals (CRUD)
                </h2>
                <p className="text-xs text-slate-500">
                  Book tractors, rotavators, laser land levelers, and combine harvesters.
                </p>
              </div>

              <button
                onClick={() => setShowBookingModal(true)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Reserve Machinery
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map((b) => (
                <div key={b.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{b.chcCenterName}</span>
                      <h3 className="font-extrabold text-slate-900 text-sm mt-0.5">{b.equipmentType}</h3>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-black text-[10px] rounded-full">
                      {b.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-0.5">
                    <p>Date: <strong>{b.bookingDate}</strong> ({b.durationHours} Hours)</p>
                    <p>Total Estimated Rent: <strong className="text-emerald-700">₹{(b.durationHours * b.ratePerHourRs).toLocaleString()}</strong></p>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleCancelBooking(b.id)}
                      className="px-3 py-1 bg-rose-100 text-rose-700 hover:bg-rose-200 font-bold rounded-xl text-xs cursor-pointer"
                    >
                      Cancel Reservation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showBookingModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white max-w-md w-full p-6 rounded-3xl space-y-4 border border-slate-200 shadow-2xl">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <Tractor className="h-5 w-5 text-emerald-600" />
                    Reserve CHC Farm Machinery
                  </h3>
                  <button onClick={() => setShowBookingModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveBooking} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Equipment / Tractor</label>
                    <select
                      value={bookEquipmentType}
                      onChange={(e) => setBookEquipmentType(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer"
                    >
                      <option>John Deere 5050D Tractor + Rotavator</option>
                      <option>Kubota Combine Harvester</option>
                      <option>Laser Guided Land Leveler</option>
                      <option>High Pressure Boom Sprayer</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Date Needed</label>
                      <input
                        type="date"
                        value={bookDate}
                        onChange={(e) => setBookDate(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Hours Needed</label>
                      <input
                        type="number"
                        value={bookHours}
                        onChange={(e) => setBookHours(Number(e.target.value))}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowBookingModal(false)}
                      className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 cursor-pointer"
                    >
                      Confirm Rental
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================================
          SECTION 7: FERTILIZER & SPRAY ENGINE
          ============================================================================ */}
      {activeSubTab === "fertilizer_dosage" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 font-display flex items-center gap-2 border-b border-slate-100 pb-3">
              <FlaskConical className="h-4.5 w-4.5 text-emerald-600" />
              NPK Fertilizer Bag Calculation
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Select Crop</label>
                <select
                  value={doseCrop}
                  onChange={(e) => setDoseCrop(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer"
                >
                  <option>Wheat</option>
                  <option>Rice Paddy</option>
                  <option>Cotton</option>
                  <option>Tomato / Vegetables</option>
                  <option>Maize</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Plot Area (Acres)</label>
                <input
                  type="number"
                  value={doseAreaAcres}
                  onChange={(e) => setDoseAreaAcres(Math.max(1, Number(e.target.value)))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Soil Texture Context</label>
                <select
                  value={doseSoilType}
                  onChange={(e) => setDoseSoilType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer"
                >
                  <option>Black Cotton / Heavy Clay</option>
                  <option>Red Loamy / Alluvial</option>
                  <option>Sandy Gravelly Soil</option>
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-emerald-900 text-white p-5 rounded-2xl border border-emerald-800 space-y-4 shadow-md">
            <h2 className="text-sm font-extrabold text-emerald-300 font-display flex items-center gap-2 border-b border-emerald-800 pb-3">
              <Sparkles className="h-4.5 w-4.5 text-emerald-400" />
              Recommended Fertilizer Bags & Knapsack Water Volume
            </h2>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-emerald-950/80 rounded-xl border border-emerald-800">
                <p className="text-[10px] text-emerald-300 font-bold uppercase">Urea (46% N)</p>
                <p className="text-xl font-black text-white">{dosageResult.ureaBags} Bags (45kg)</p>
              </div>

              <div className="p-3 bg-emerald-950/80 rounded-xl border border-emerald-800">
                <p className="text-[10px] text-emerald-300 font-bold uppercase">DAP (18-46-0)</p>
                <p className="text-xl font-black text-white">{dosageResult.dapBags} Bags (50kg)</p>
              </div>

              <div className="p-3 bg-emerald-950/80 rounded-xl border border-emerald-800">
                <p className="text-[10px] text-emerald-300 font-bold uppercase">MOP Potash (60% K2O)</p>
                <p className="text-xl font-black text-white">{dosageResult.mopBags} Bags (50kg)</p>
              </div>

              <div className="p-3 bg-emerald-950/80 rounded-xl border border-emerald-800">
                <p className="text-[10px] text-emerald-300 font-bold uppercase">Zinc Sulfate</p>
                <p className="text-xl font-black text-white">{dosageResult.zincKg} kg Total</p>
              </div>

              <div className="p-3 bg-emerald-950/80 rounded-xl border border-emerald-800 col-span-2">
                <p className="text-[10px] text-emerald-300 font-bold uppercase">Knapsack Water Mixing Volume</p>
                <p className="text-2xl font-black text-emerald-400">{dosageResult.waterTankLiters} Liters Total</p>
              </div>
            </div>

            <button
              onClick={handleOrderFertilizerPACS}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs cursor-pointer shadow-md transition-colors"
            >
              Order Subsidized Fertilizer Bags from PACS Store
            </button>
          </div>
        </div>
      )}

      {/* ============================================================================
          SECTION 8: WATER CANAL ROTATIONS (FULL CRUD)
          ============================================================================ */}
      {activeSubTab === "water_canal" && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 font-display flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-600" />
                  Irrigation Canal Water Release Slots (CRUD)
                </h2>
                <p className="text-xs text-slate-500">
                  Book and track irrigation canal turn slots and borewell water release schedules.
                </p>
              </div>

              <button
                onClick={() => setShowWaterModal(true)}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Request Water Slot
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {waterSlots.map((w) => (
                <div key={w.id} className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-blue-700 uppercase">{w.plotName}</span>
                      <h3 className="font-extrabold text-slate-900 text-sm mt-0.5">{w.hoursNeeded} Hours Inflow Slot</h3>
                    </div>
                    <span className="px-2 py-0.5 bg-blue-200 text-blue-900 font-black text-[10px] rounded-full">
                      {w.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Date: <strong>{w.requestDate}</strong> | Discharge: <strong>{w.volumeCusecs} Cusecs</strong>
                  </p>

                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-[10px] text-slate-500">{w.officerContact}</span>
                    <button
                      onClick={() => handleDeleteWaterSlot(w.id)}
                      className="px-2.5 py-1 bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold rounded-lg text-xs cursor-pointer"
                    >
                      Cancel Slot
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showWaterModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white max-w-md w-full p-6 rounded-3xl space-y-4 border border-slate-200 shadow-2xl">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-blue-600" />
                    Request Canal Water Slot
                  </h3>
                  <button onClick={() => setShowWaterModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveWaterSlot} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Target Plot</label>
                    <input
                      type="text"
                      value={waterPlot}
                      onChange={(e) => setWaterPlot(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Requested Date</label>
                      <input
                        type="date"
                        value={waterDate}
                        onChange={(e) => setWaterDate(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Hours Needed</label>
                      <input
                        type="number"
                        value={waterHours}
                        onChange={(e) => setWaterHours(Number(e.target.value))}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowWaterModal(false)}
                      className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 cursor-pointer"
                    >
                      Reserve Inflow
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================================
          SECTION 9: PESTICIDE & HEAT SAFETY SHIELD
          ============================================================================ */}
      {activeSubTab === "safety_shield" && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-slate-900 font-display flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-600" />
              Pesticide Spray Safety & Emergency Protocols
            </h2>
            <p className="text-xs text-slate-500">
              Wind velocity safety check and 24x7 emergency helpline numbers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-900 text-xs">Wind Spray Velocity</span>
                <Wind className="h-4 w-4 text-emerald-700" />
              </div>
              <p className="text-2xl font-black text-emerald-800">11.4 km/h</p>
              <p className="text-[10px] text-emerald-700 font-bold">SAFE TO SPRAY (Low Chemical Drift)</p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-amber-900 text-xs">Field Heat Index</span>
                <Sun className="h-4 w-4 text-amber-700" />
              </div>
              <p className="text-2xl font-black text-amber-900">33.2°C</p>
              <p className="text-[10px] text-amber-800 font-bold">Hydrate with 500ml water every 45 minutes.</p>
            </div>

            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-rose-900 text-xs">Toll-Free Kisan Call Center</span>
                <PhoneCall className="h-4 w-4 text-rose-700" />
              </div>
              <p className="text-2xl font-black text-rose-900">1800-180-1551</p>
              <p className="text-[10px] text-rose-800 font-bold">24x7 Government Agronomist Helpline</p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================================
          SECTION 10: KISAN CREDIT CARD (KCC) LOAN & CROP FINANCE HUB
          ============================================================================ */}
      {activeSubTab === "kcc_loan" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 font-display flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-indigo-600" />
                  Kisan Credit Card (KCC) Loan & Scale of Finance Hub
                </h2>
                <p className="text-xs text-slate-500">
                  7% Base Rate with 3% Prompt Repayment Govt Interest Subvention = <strong>Effective 4% p.a. Crop Loan</strong>
                </p>
              </div>

              <button
                onClick={() => {
                  setKccBank("State Bank of India");
                  setKccAmount(180000);
                  setShowKccModal(true);
                }}
                className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Plus className="h-4 w-4" /> Apply for New KCC Limit
              </button>
            </div>

            {/* Interest Subvention Overview Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-indigo-600 uppercase">Scale of Finance (SoF)</span>
                <p className="text-xl font-black text-indigo-950">₹38,000 / Acre</p>
                <p className="text-[10px] text-indigo-700">Paddy & Cotton Standard Credit Limit</p>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-emerald-600 uppercase">Govt Interest Subvention</span>
                <p className="text-xl font-black text-emerald-950">3.0% Subvention</p>
                <p className="text-[10px] text-emerald-700">Net Effective Interest: <strong>4.0% p.a.</strong></p>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-amber-700 uppercase">Accidental Cover Insurance</span>
                <p className="text-xl font-black text-amber-950">₹5,000,000</p>
                <p className="text-[10px] text-amber-800">Bundled PMSBY Cover for KCC Holders</p>
              </div>
            </div>

            {/* KCC Loans CRUD Table */}
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[10px] uppercase font-bold">
                  <tr>
                    <th className="p-3">Bank & Account No</th>
                    <th className="p-3">Facility Type</th>
                    <th className="p-3">Sanctioned Limit</th>
                    <th className="p-3">Interest Rate</th>
                    <th className="p-3">Due Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {kccLoans.map((loan) => (
                    <tr key={loan.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        <span className="font-extrabold text-slate-900 block">{loan.bankName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{loan.accountNo}</span>
                      </td>
                      <td className="p-3 text-slate-700 font-bold">{loan.loanType}</td>
                      <td className="p-3 font-black text-indigo-700">₹{loan.sanctionedAmount.toLocaleString()}</td>
                      <td className="p-3">
                        <span className="font-extrabold text-emerald-700">{loan.netInterestRatePct}%</span>
                        <span className="text-[9px] text-slate-400 block">(7% - 3% Subvention)</span>
                      </td>
                      <td className="p-3 text-slate-600 text-[10px]">{loan.dueDate}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 text-[10px] font-black rounded-full ${
                            loan.status === "Active Disbursed"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-indigo-100 text-indigo-800"
                          }`}
                        >
                          {loan.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteKccLoan(loan.id)}
                          className="p-1.5 text-slate-600 hover:text-rose-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Apply KCC Modal */}
          {showKccModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white max-w-md w-full p-6 rounded-3xl space-y-4 border border-slate-200 shadow-2xl">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-indigo-600" />
                    Apply for Kisan Credit Card (KCC)
                  </h3>
                  <button onClick={() => setShowKccModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleApplyKccLoan} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Preferred Lending Bank</label>
                    <select
                      value={kccBank}
                      onChange={(e) => setKccBank(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    >
                      <option value="State Bank of India (Warangal Agri Branch)">State Bank of India (SBI)</option>
                      <option value="Telangana Grameena Bank">Telangana Grameena Bank (RRB)</option>
                      <option value="District Central Cooperative Bank (DCCB)">DCCB Cooperative Bank</option>
                      <option value="State Bank of India">State Bank of India (PNB)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Crop Area (Acres)</label>
                      <input
                        type="number"
                        value={kccCropAcreage}
                        onChange={(e) => {
                          const acres = Number(e.target.value);
                          setKccCropAcreage(acres);
                          setKccAmount(acres * 38000);
                        }}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Requested Loan Limit (₹)</label>
                      <input
                        type="number"
                        value={kccAmount}
                        onChange={(e) => setKccAmount(Number(e.target.value))}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-[11px] text-indigo-900 space-y-1">
                    <p className="font-bold flex items-center gap-1">
                      <FileCheck className="h-3.5 w-3.5 text-indigo-600" /> Documents Auto-Attached:
                    </p>
                    <ul className="list-disc list-inside text-[10px] text-indigo-800 space-y-0.5 font-medium">
                      <li>Pahani / ROR 1-B Land Revenue Record</li>
                      <li>Aadhaar & PAN Identity Verification</li>
                      <li>Khasra Map Boundaries with Crop Declaration</li>
                    </ul>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowKccModal(false)}
                      className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-indigo-700 text-white font-bold rounded-xl hover:bg-indigo-800 cursor-pointer"
                    >
                      Submit KCC Application
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================================
          SECTION 11: COLD STORAGE & e-NWR WAREHOUSE RECEIPT FINANCING
          ============================================================================ */}
      {activeSubTab === "cold_storage" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 font-display flex items-center gap-2">
                  <Warehouse className="h-5 w-5 text-amber-600" />
                  WDRA-Accredited Cold Storage & e-NWR Pledge Loans
                </h2>
                <p className="text-xs text-slate-500">
                  Store harvested crops in WDRA licensed warehouses to prevent distress sale & get up to <strong>75% instant bank loan</strong>.
                </p>
              </div>

              <button
                onClick={() => {
                  setWhName("Central Warehousing Depot #3");
                  setWhCommodity("Pusa Basmati 1121 Paddy");
                  setWhBags(250);
                  setShowWarehouseModal(true);
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Plus className="h-4 w-4" /> Deposit Grain & Generate e-NWR
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {warehouses.map((wh) => (
                <div key={wh.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-amber-600 uppercase font-mono">{wh.receiptNo}</span>
                      <h3 className="font-extrabold text-slate-900 text-sm mt-0.5">{wh.warehouseName}</h3>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-amber-600" /> {wh.location}
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                        wh.pledgeLoanStatus === "Loan Disbursed"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {wh.pledgeLoanStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs bg-white p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase">Commodity</span>
                      <span className="font-extrabold text-slate-900 text-xs">{wh.commodity}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase">Stored Weight</span>
                      <span className="font-black text-slate-900 text-xs">{wh.quantityBags} Bags ({wh.totalWeightMT} MT)</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase">e-NWR Collateral Value</span>
                      <span className="font-black text-emerald-700 text-xs">₹{wh.enwrValueRs.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {wh.pledgeLoanStatus !== "Loan Disbursed" ? (
                      <button
                        onClick={() => handlePledgeEnwrLoan(wh)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] rounded-xl cursor-pointer flex items-center gap-1"
                      >
                        <DollarSign className="h-3.5 w-3.5" /> Pledge for 75% Bank Loan (₹{Math.round(wh.enwrValueRs * 0.75).toLocaleString()})
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> 75% Collateral Disbursed
                      </span>
                    )}

                    <button
                      onClick={() => handleDeleteWarehouse(wh.id)}
                      className="p-1.5 bg-white text-slate-600 hover:text-rose-700 border border-slate-200 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deposit Grain Modal */}
          {showWarehouseModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white max-w-md w-full p-6 rounded-3xl space-y-4 border border-slate-200 shadow-2xl">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <Warehouse className="h-5 w-5 text-amber-600" />
                    Deposit Produce & Issue e-NWR Receipt
                  </h3>
                  <button onClick={() => setShowWarehouseModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleStoreGrain} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Warehouse Center</label>
                    <input
                      type="text"
                      value={whName}
                      onChange={(e) => setWhName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Commodity / Crop</label>
                      <input
                        type="text"
                        value={whCommodity}
                        onChange={(e) => setWhCommodity(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Quantity (Bags @ 50kg)</label>
                      <input
                        type="number"
                        value={whBags}
                        onChange={(e) => setWhBags(Number(e.target.value))}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowWarehouseModal(false)}
                      className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 cursor-pointer"
                    >
                      Deposit & Issue e-NWR
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================================
          SECTION 12: PM-KUSUM SOLAR PUMP & GREEN ENERGY
          ============================================================================ */}
      {activeSubTab === "solar_kusum" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 font-display flex items-center gap-2">
                <Sun className="h-5 w-5 text-amber-500" />
                PM-KUSUM Solar Water Pump & IoT Remote Controller
              </h2>
              <p className="text-xs text-slate-500">
                60% Central + State Subsidy | Real-Time Telemetry and Remote Mobile Control
              </p>
            </div>

            {/* PM-KUSUM Subsidy Card */}
            <div className="p-4 bg-gradient-to-r from-amber-500 to-emerald-700 text-white rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-200">Government Scheme</span>
                <h3 className="text-lg font-black font-display">PM-KUSUM Component-B Solar Pump Subsidy</h3>
                <p className="text-xs text-amber-100 mt-0.5">
                  60% Subsidy (30% Central + 30% State) | 30% Bank Loan | <strong>Only 10% Farmer Contribution</strong>
                </p>
              </div>

              <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-center border border-white/30 shrink-0">
                <span className="text-[9px] uppercase font-bold block text-white/80">Approved Subsidy</span>
                <span className="text-xl font-black">₹1,92,000</span>
              </div>
            </div>

            {/* Active Solar Pump IoT Telemetry */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Active Solar Pumps (IoT Connected)</h3>

              {solarPumps.map((pump) => (
                <div key={pump.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-slate-900 text-sm">{pump.pumpHp} HP {pump.type}</h4>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md">
                          {pump.subsidyStatus}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-emerald-600" /> Location: {pump.locationPlot}
                      </p>
                    </div>

                    <button
                      onClick={() => handleToggleSolarPump(pump.id)}
                      className={`px-5 py-2.5 rounded-2xl font-black text-xs transition-all cursor-pointer flex items-center gap-2 shadow-sm ${
                        pump.isPumpActive
                          ? "bg-rose-600 hover:bg-rose-700 text-white"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white"
                      }`}
                    >
                      <Cpu className="h-4 w-4" />
                      {pump.isPumpActive ? "Turn OFF Solar Pump" : "Remote Turn ON Solar Pump"}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[9px] uppercase text-slate-400 font-bold block">Power Status</span>
                      <span className={`font-black text-xs ${pump.isPumpActive ? "text-emerald-600" : "text-slate-400"}`}>
                        {pump.isPumpActive ? "RUNNING (SOLAR)" : "STANDBY"}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[9px] uppercase text-slate-400 font-bold block">Water Flow Rate</span>
                      <span className="font-black text-xs text-blue-700">
                        {pump.isPumpActive ? `${pump.flowLitersPerMin} L/min` : "0 L/min"}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[9px] uppercase text-slate-400 font-bold block">Solar Energy Today</span>
                      <span className="font-black text-xs text-amber-600">{pump.dailyKwGenerated} kWh</span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[9px] uppercase text-slate-400 font-bold block">Grid Export Earnings</span>
                      <span className="font-black text-xs text-emerald-700">₹{(pump.dailyKwGenerated * 3.5).toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
