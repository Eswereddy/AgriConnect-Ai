import React, { useState } from "react";
import {
  Leaf,
  Sparkles,
  Droplets,
  Award,
  Sun,
  Flame,
  Sprout,
  Compass,
  FileText,
  ShoppingBag,
  CheckCircle,
  HelpCircle,
  Plus,
  Trash2,
  Bookmark,
  TrendingUp,
  Sliders,
  Layers,
  Check,
  ChevronRight,
  Calculator,
  Grid,
  Zap,
  Info,
  Calendar,
  AlertTriangle,
  UserCheck,
  X
} from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

// --- STRUCTURAL INTERFACES ---
interface CertificationStep {
  id: number;
  stageName: string;
  duration: string;
  status: "Completed" | "In Progress" | "Not Started";
  description: string;
  checklist: { id: string; label: string; done: boolean }[];
}

interface OrganicInputItem {
  id: string;
  name: string;
  category: "Fertilizer" | "Pest Control" | "Soil Amendment" | "Bio-Inoculant";
  price: number; // in simulated coins/USD
  unit: string;
  stock: number;
  rating: number;
  description: string;
  supplier: string;
  composition: string;
}

interface BiodiversitySpecies {
  id: string;
  name: string;
  type: "Flora" | "Fauna" | "Beneficial Insect" | "Avian (Birds)";
  count: number;
  role: string;
  dateSpotted: string;
}

interface CompostingRecipe {
  id: string;
  name: string;
  type: "Aerobic Pit" | "Vermicomposting" | "Vedic Compost";
  brownRatio: number; // carbon rich (%)
  greenRatio: number; // nitrogen rich (%)
  expectedDays: number;
  instructions: string[];
}

export default function OrganicSustainableFarming() {
  // --- SUB-TABS STATE ---
  const [activeTab, setActiveTab] = useState<"dashboard" | "certification" | "inputs" | "recipes" | "engineering">("dashboard");

  // --- WALLET BALANCE ---
  const [walletBalance, setWalletBalance] = useState<number>(3850);

  // --- SUSTAINABLE PRACTICE PRACTICE CHECKBOX STATE ---
  const [practices, setPractices] = useState({
    zeroTillage: true,
    mulching: true,
    cropRotation: true,
    coverCropping: false,
    dripIrrigation: true,
    rainwaterPond: false,
    solarWaterPump: true,
    biogasDigester: false,
    agroforestryTrees: false,
    organicComposting: true,
    naturalPestPredators: false,
    sustainablePackaging: false
  });

  // Calculate Sustainable Practice Score (Max 100)
  const calculateSustainableScore = () => {
    const activeCount = Object.values(practices).filter(Boolean).length;
    const totalCount = Object.keys(practices).length;
    return Math.round((activeCount / totalCount) * 100);
  };

  // Calculate Potential Carbon Incentives ($)
  // Each active sustainable practice earns a certain estimated credit amount
  const estimateCarbonCredits = () => {
    let yearlyEarnings = 0;
    if (practices.zeroTillage) yearlyEarnings += 120;
    if (practices.mulching) yearlyEarnings += 80;
    if (practices.cropRotation) yearlyEarnings += 150;
    if (practices.coverCropping) yearlyEarnings += 180;
    if (practices.rainwaterPond) yearlyEarnings += 200;
    if (practices.solarWaterPump) yearlyEarnings += 250;
    if (practices.biogasDigester) yearlyEarnings += 300;
    if (practices.agroforestryTrees) yearlyEarnings += 350;
    if (practices.organicComposting) yearlyEarnings += 140;
    return yearlyEarnings;
  };

  // --- ORGANIC CERTIFICATION STEPS STATE ---
  const [certSteps, setCertSteps] = useState<CertificationStep[]>([
    {
      id: 1,
      stageName: "Registration & Application Submission",
      duration: "Month 1 - 2",
      status: "Completed",
      description: "Submit comprehensive land registry maps, prior 3-year chemical fertilizer application history logs, and crop management blueprints to the Organic NPOP registrar authority.",
      checklist: [
        { id: "reg-1", label: "Signed application form submitted", done: true },
        { id: "reg-2", label: "Paid baseline audit processing fees ($250)", done: true },
        { id: "reg-3", label: "Land registry maps detailing buffers uploaded", done: true },
        { id: "reg-4", label: "Historical pesticide treatment log verified", done: true }
      ]
    },
    {
      id: 2,
      stageName: "Transition Period & Buffer Zone Setup",
      duration: "Month 3 - 12 (Year 1)",
      status: "In Progress",
      description: "Establish dedicated physical boundary buffer crop hedges (e.g. Lemon grass, Casuarina trees) to prevent chemical pesticide drift from adjoining commercial plots. Cease all synthetic inputs.",
      checklist: [
        { id: "trans-1", label: "Ceased application of all synthetic NPK and weedicides", done: true },
        { id: "trans-2", label: "Planted 5-meter deep dense physical hedge barriers", done: true },
        { id: "trans-3", label: "Established separate dedicated tool storage sheds", done: false },
        { id: "trans-4", label: "Maintained local farm daily organic material diary", done: false }
      ]
    },
    {
      id: 3,
      stageName: "Soil Testing & Preliminary On-Site Auditing",
      duration: "Month 13 - 24 (Year 2)",
      status: "Not Started",
      description: "Organic certification auditors perform multi-point deep soil extraction tests checking for heavy metals, organophosphates, and synthetic chemical residues. Annual inspection checks.",
      checklist: [
        { id: "audit-1", label: "Randomized heavy metals tissue soil test passed", done: false },
        { id: "audit-2", label: "Zero glyphosate/paraquat residue certification", done: false },
        { id: "audit-3", label: "Verified non-GMO seed purchase receipts", done: false },
        { id: "audit-4", label: "First physical inspection report signed", done: false }
      ]
    },
    {
      id: 4,
      stageName: "NPOP Organic Certification Issuance",
      duration: "Month 25 - 36 (Year 3)",
      status: "Not Started",
      description: "Final comprehensive review. Issuance of NPOP & USDA-Equivalent Organic Certification seal. Enables premium sales of crops at up to a 40% market premium.",
      checklist: [
        { id: "cert-1", label: "Final audit evaluation panel cleared", done: false },
        { id: "cert-2", label: "Organic QR traceability barcodes assigned", done: false },
        { id: "cert-3", label: "Official certification license generated", done: false }
      ]
    }
  ]);

  // Toggle checklist item
  const toggleChecklistItem = (stepId: number, checkId: string) => {
    setCertSteps(prev => prev.map(step => {
      if (step.id === stepId) {
        const updatedCheck = step.checklist.map(item =>
          item.id === checkId ? { ...item, done: !item.done } : item
        );
        // Calculate status automatically based on checkbox metrics
        const allDone = updatedCheck.every(item => item.done);
        const someDone = updatedCheck.some(item => item.done);
        const newStatus = allDone ? "Completed" : someDone ? "In Progress" : "Not Started";
        return {
          ...step,
          checklist: updatedCheck,
          status: newStatus
        };
      }
      return step;
    }));
  };

  // --- BIODIVERSITY INDEX LOGGER STATE ---
  const [biodiversity, setBiodiversity] = useState<BiodiversitySpecies[]>([
    { id: "sp-1", name: "Mexican Marigold (Tagetes erecta)", type: "Flora", count: 120, role: "Nematode control & general pest bait crop", dateSpotted: "2026-06-01" },
    { id: "sp-2", name: "Seven-Spotted Ladybug (Coccinella septempunctata)", type: "Beneficial Insect", count: 85, role: "Consumes aphids, mites and scale pests", dateSpotted: "2026-06-15" },
    { id: "sp-3", name: "Indian Pond Heron (Ardeola grayii)", type: "Avian (Birds)", count: 8, role: "Eats caterpillars, field mice & grasshoppers", dateSpotted: "2026-06-22" },
    { id: "sp-4", name: "Sann Hemp (Crotalaria juncea)", type: "Flora", count: 450, role: "Green manure and biological nitrogen fixation", dateSpotted: "2026-06-10" },
    { id: "sp-5", name: "Trichogramma Wasps", type: "Beneficial Insect", count: 200, role: "Parasitizes destructive stem borer eggs", dateSpotted: "2026-06-25" }
  ]);

  const [newSpecName, setNewSpecName] = useState("");
  const [newSpecType, setNewSpecType] = useState<"Flora" | "Fauna" | "Beneficial Insect" | "Avian (Birds)">("Beneficial Insect");
  const [newSpecCount, setNewSpecCount] = useState<number>(10);
  const [newSpecRole, setNewSpecRole] = useState("");

  const handleAddSpecies = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpecName.trim() || !newSpecRole.trim()) {
      alert("Please provide the species name and its ecological role.");
      return;
    }
    const newSpec: BiodiversitySpecies = {
      id: "sp-" + Date.now(),
      name: newSpecName,
      type: newSpecType,
      count: newSpecCount,
      role: newSpecRole,
      dateSpotted: new Date().toISOString().split("T")[0]
    };
    setBiodiversity(prev => [newSpec, ...prev]);
    setNewSpecName("");
    setNewSpecRole("");
    setNewSpecCount(10);
  };

  // Biodiversity Index Estimation (Simple rich variety calculation)
  const getBiodiversityLevel = () => {
    const categoriesCount = new Set(biodiversity.map(b => b.type)).size;
    const totalCount = biodiversity.reduce((sum, b) => sum + b.count, 0);
    const uniqueSpeciesCount = biodiversity.length;

    // Simple Simpson approximation score
    const indexScore = Math.min(10, Number((uniqueSpeciesCount * 1.5 + categoriesCount * 1.0).toFixed(1)));
    let rating = "Low";
    let color = "text-rose-600";
    if (indexScore >= 7.5) {
      rating = "Exceptional (Resilient Ecosystem)";
      color = "text-emerald-600";
    } else if (indexScore >= 4.5) {
      rating = "Moderate (Stable)";
      color = "text-amber-600";
    }
    return { score: indexScore, rating, color, totalCount, uniqueSpeciesCount };
  };

  // --- ORGANIC INPUTS INVENTORY MARKETPLACE STATE ---
  const [inputsInventory, setInputsInventory] = useState<OrganicInputItem[]>([
    {
      id: "inp-neem",
      name: "Cold-Pressed Pure Neem Seed Oil Concentrate",
      category: "Pest Control",
      price: 45,
      unit: "1 Liter bottle",
      stock: 24,
      rating: 4.8,
      description: "Naturally contains Azadirachtin. Systemically deters more than 200 species of chewing/sucking crop pests.",
      supplier: "Prithvi Vedic Crop Care",
      composition: "Active ingredient: Azadirachtin (1500 PPM)"
    },
    {
      id: "inp-vermi",
      name: "Premium Red-Wiggler Vermicompost Humus",
      category: "Fertilizer",
      price: 25,
      unit: "50 Kg moisture-sealed bag",
      stock: 120,
      rating: 4.9,
      description: "Rich in humic acids, nitrogen-fixing microbes, and micronutrients. Zero heavy metals, aged 90 days.",
      supplier: "Mera Gaon Bio-Industries",
      composition: "Aged cowdung digest digested by Eisenia fetida worms"
    },
    {
      id: "inp-tricho",
      name: "Trichoderma Viride Bio-Fungicide Powder",
      category: "Pest Control",
      price: 18,
      unit: "1 Kg bag",
      stock: 35,
      rating: 4.7,
      description: "Antagonistic biological fungus that targets soil-borne root rot, damping-off, and fusarium wilt pathogens.",
      supplier: "Sovereign Organic Biotech",
      composition: "Spore count 2x10^9 CFU/gm min"
    },
    {
      id: "inp-rock",
      name: "Granulated Soft Rock Phosphate Mineral Dust",
      category: "Soil Amendment",
      price: 32,
      unit: "40 Kg bag",
      stock: 40,
      rating: 4.5,
      description: "Slow-release fossilized marine bone mineral provides critical phosphorus for crop flowering and deep root anchoring.",
      supplier: "Mineral Earth Holdings",
      composition: "Total P2O5: 28% min"
    },
    {
      id: "inp-pancha",
      name: "Fermented Panchagavya Bio-Growth Inoculant",
      category: "Bio-Inoculant",
      price: 50,
      unit: "5 Liter jerrycan",
      stock: 15,
      rating: 4.9,
      description: "Traditional liquid formulation of cow dung, urine, milk, curd, ghee, banana, tender coconut water, and jaggery.",
      supplier: "Gramin Goshala Cooperatives",
      composition: "Traditional Vedic Vedic Inoculant culture"
    }
  ]);

  const [inputFilters, setInputFilters] = useState<string>("All");

  const handlePurchaseInput = (itemId: string) => {
    const target = inputsInventory.find(i => i.id === itemId);
    if (!target) return;
    if (target.stock <= 0) {
      alert("Out of stock!");
      return;
    }
    if (walletBalance < target.price) {
      alert(`Insufficient funds! Your balance is 🪙 ${walletBalance} coins. Need 🪙 ${target.price} coins.`);
      return;
    }

    const confirmOrder = confirm(`Confirm purchase of "${target.name}" for 🪙 ${target.price} coins? Item will be dispatched to your farm storage sector.`);
    if (confirmOrder) {
      setWalletBalance(prev => prev - target.price);
      setInputsInventory(prev => prev.map(i => i.id === itemId ? { ...i, stock: i.stock - 1 } : i));
      alert(`Order placed successfully! 🪙 ${target.price} coins debited. Leftover balance: 🪙 ${walletBalance - target.price} coins.`);
    }
  };

  // --- COMPOSTING RECIPE BUILDER STATE ---
  const [selectedRecipeType, setSelectedRecipeType] = useState<"Aerobic Pit" | "Vermicomposting" | "Vedic Compost">("Aerobic Pit");
  const [brownWeight, setBrownWeight] = useState<number>(300); // Kgs dry leaves, straw, carbon
  const [greenWeight, setGreenWeight] = useState<number>(150); // Kgs green waste, manure, nitrogen

  // Dynamic calculations for composting recipe
  const calculateCompostMetrics = () => {
    const totalWeight = brownWeight + greenWeight;
    const computedRatio = Number((brownWeight / (greenWeight || 1)).toFixed(1));
    
    let classification = "Imbalanced Carbon (Too High)";
    let recommendations = "Add green waste (manures, kitchen scraps, or clover) to accelerate microbial activity.";
    let nitrogenFixationEst = "Minimal (slow decay)";

    if (computedRatio >= 2.0 && computedRatio <= 3.0) {
      classification = "Optimal Carbon-to-Nitrogen (25:1 - 30:1 Equilibrium)";
      recommendations = "Excellent balanced mix! Keep moisture levels around 50% (feels like a wrung-out sponge). Turn pile every 14 days.";
      nitrogenFixationEst = "Exceptional rich organic humus output in ~60 days.";
    } else if (computedRatio < 2.0) {
      classification = "Excess Nitrogen (Too Low Carbon)";
      recommendations = "Danger of pungent ammonia gas odors. Incorporate dry straw, shredded cardboard, or sawdust immediately to lock in nitrogen.";
      nitrogenFixationEst = "Odorous decay (nitrogen leaching out)";
    }

    return { totalWeight, computedRatio, classification, recommendations, nitrogenFixationEst };
  };

  // --- COOPERATIVE RENEWABLE ENGINEERING STATE ---
  // Simple solar/biogas generator simulator
  const [solarGeneration, setSolarGeneration] = useState<number>(24.5); // KWh today
  const [biogasProduction, setBiogasProduction] = useState<number>(3.8); // cubic meters today
  const [carbonOffsetCount, setCarbonOffsetCount] = useState<number>(1420); // total kg CO2 offset historically

  // --- RAINWATER HARVESTING DESIGN CALCULATOR STATE ---
  const [catchmentArea, setCatchmentArea] = useState<number>(1200); // square meters of greenhouse roof or soil catchment
  const [avgRainfall, setAvgRainfall] = useState<number>(850); // mm of annual rainfall
  const [runoffCoefficient, setRunoffCoefficient] = useState<number>(0.85); // 0.85 for tin roof, 0.5 for soil

  // Calculate annual water harvesting volume
  // Formula: Area (sqm) * Rainfall (mm) * Runoff Coefficient
  const calculateHarvestedWater = () => {
    const totalLiters = catchmentArea * avgRainfall * runoffCoefficient;
    const cubicMeters = Number((totalLiters / 1000).toFixed(1));
    return {
      liters: Math.round(totalLiters),
      cubicMeters,
      irrigationDaysSupported: Math.round(totalLiters / 2500) // Assuming average farm sub-surface drip uses 2500 Liters/day
    };
  };

  const scoreData = [
    { name: "Zero Tillage", value: practices.zeroTillage ? 100 : 0 },
    { name: "Water Conserv.", value: practices.dripIrrigation ? 100 : 0 },
    { name: "Energy Audit", value: practices.solarWaterPump ? 100 : 0 },
    { name: "Organic Inputs", value: practices.organicComposting ? 100 : 0 },
    { name: "Crop Divers.", value: practices.cropRotation ? 100 : 0 }
  ];

  return (
    <div id="organic-sustainable-farming" className="bg-white rounded-2xl border border-slate-150 p-6 shadow-xs space-y-6">
      
      {/* 1. SECTION HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-50 border border-emerald-150 text-emerald-700 rounded-lg">
              <Leaf className="h-5 w-5 text-emerald-600 animate-bounce" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
              🌿 Organic & Sustainable Regenerative Farming Hub
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 font-bold tracking-wide uppercase">
            Drive organic transition roadmap, track biodiversity metrics, compute composting recipes, & engineer rainwater catchment systems
          </p>
        </div>

        {/* Header Tab Toggles */}
        <div className="flex flex-wrap items-center bg-slate-50 border p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === "dashboard" ? "bg-white text-emerald-700 shadow-xs border" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Grid className="h-3.5 w-3.5" />
            Regenerative Dashboard
          </button>
          <button
            onClick={() => setActiveTab("certification")}
            className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === "certification" ? "bg-white text-emerald-700 shadow-xs border" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <UserCheck className="h-3.5 w-3.5" />
            Organic Certification Roadmap
          </button>
          <button
            onClick={() => setActiveTab("inputs")}
            className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === "inputs" ? "bg-white text-emerald-700 shadow-xs border" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Organic Inputs Market
          </button>
          <button
            onClick={() => setActiveTab("recipes")}
            className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === "recipes" ? "bg-white text-emerald-700 shadow-xs border" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Sprout className="h-3.5 w-3.5" />
            Natural Composting Guide
          </button>
          <button
            onClick={() => setActiveTab("engineering")}
            className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === "engineering" ? "bg-white text-emerald-700 shadow-xs border" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Droplets className="h-3.5 w-3.5" />
            Rainwater & Green Energy
          </button>
        </div>
      </div>

      {/* 2. DYNAMICALLY RENDERED SUB-TABS */}

      {/* SUB-TAB 1: REGENERATIVE DASHBOARD */}
      {activeTab === "dashboard" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Block: Dynamic Score Calculator (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Practice checklist box */}
            <div className="p-5 bg-gradient-to-br from-emerald-50 to-white border border-emerald-150 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-emerald-900 flex items-center gap-1.5">
                    <Sparkles className="h-4.5 w-4.5 text-emerald-600" />
                    Sustainable Practice Audit
                  </h4>
                  <p className="text-[11px] text-emerald-700 font-semibold">
                    Toggle your active physical farming practices to update your Sustainability Index & Carbon Credit potential.
                  </p>
                </div>
                <div className="text-center p-3 bg-emerald-600 text-white rounded-xl">
                  <span className="text-[9px] font-black uppercase tracking-wider block">Practice Score</span>
                  <span className="text-2xl font-black">{calculateSustainableScore()}/100</span>
                </div>
              </div>

              {/* Checkboxes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                
                <label className="flex items-start gap-2.5 p-3 bg-white hover:bg-emerald-50/50 border rounded-xl cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={practices.zeroTillage}
                    onChange={() => setPractices(prev => ({ ...prev, zeroTillage: !prev.zeroTillage }))}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-black text-slate-800 block">Zero Tillage</span>
                    <span className="text-[10px] text-slate-400 font-semibold leading-none">Minimizes soil erosion & traps CO₂.</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 bg-white hover:bg-emerald-50/50 border rounded-xl cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={practices.mulching}
                    onChange={() => setPractices(prev => ({ ...prev, mulching: !prev.mulching }))}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-black text-slate-800 block">Organic Mulching</span>
                    <span className="text-[10px] text-slate-400 font-semibold leading-none">Locks in moisture, suppresses weeds.</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 bg-white hover:bg-emerald-50/50 border rounded-xl cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={practices.cropRotation}
                    onChange={() => setPractices(prev => ({ ...prev, cropRotation: !prev.cropRotation }))}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-black text-slate-800 block">Multi-Crop Rotation</span>
                    <span className="text-[10px] text-slate-400 font-semibold leading-none">Alleviates pest cycles naturally.</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 bg-white hover:bg-emerald-50/50 border rounded-xl cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={practices.coverCropping}
                    onChange={() => setPractices(prev => ({ ...prev, coverCropping: !prev.coverCropping }))}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-black text-slate-800 block">Cover Cropping</span>
                    <span className="text-[10px] text-slate-400 font-semibold leading-none">Fixes atmospheric biological Nitrogen.</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 bg-white hover:bg-emerald-50/50 border rounded-xl cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={practices.dripIrrigation}
                    onChange={() => setPractices(prev => ({ ...prev, dripIrrigation: !prev.dripIrrigation }))}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-black text-slate-800 block">Micro-Drip Irrigation</span>
                    <span className="text-[10px] text-slate-400 font-semibold leading-none">Saves up to 50% water vs canal flooding.</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 bg-white hover:bg-emerald-50/50 border rounded-xl cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={practices.rainwaterPond}
                    onChange={() => setPractices(prev => ({ ...prev, rainwaterPond: !prev.rainwaterPond }))}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-black text-slate-800 block">Rainwater Harvesting Pond</span>
                    <span className="text-[10px] text-slate-400 font-semibold leading-none">Recharges aquifer, stores storm runoff.</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 bg-white hover:bg-emerald-50/50 border rounded-xl cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={practices.solarWaterPump}
                    onChange={() => setPractices(prev => ({ ...prev, solarWaterPump: !prev.solarWaterPump }))}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-black text-slate-800 block">Solar Pump Irrigation</span>
                    <span className="text-[10px] text-slate-400 font-semibold leading-none">Stops reliance on dirty diesel generators.</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 bg-white hover:bg-emerald-50/50 border rounded-xl cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={practices.biogasDigester}
                    onChange={() => setPractices(prev => ({ ...prev, biogasDigester: !prev.biogasDigester }))}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-black text-slate-800 block">Biogas Waste Digester</span>
                    <span className="text-[10px] text-slate-400 font-semibold leading-none">Converts manure into free cooking gas.</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 bg-white hover:bg-emerald-50/50 border rounded-xl cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={practices.agroforestryTrees}
                    onChange={() => setPractices(prev => ({ ...prev, agroforestryTrees: !prev.agroforestryTrees }))}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-black text-slate-800 block">Agroforestry (Sandal/Moringa)</span>
                    <span className="text-[10px] text-slate-400 font-semibold leading-none">Integrates trees with standard crops.</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 bg-white hover:bg-emerald-50/50 border rounded-xl cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={practices.organicComposting}
                    onChange={() => setPractices(prev => ({ ...prev, organicComposting: !prev.organicComposting }))}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-black text-slate-800 block">Composting & Vermiculture</span>
                    <span className="text-[10px] text-slate-400 font-semibold leading-none">Transforms biomass into micro-flora.</span>
                  </div>
                </label>

              </div>
            </div>

            {/* Biodiversity index logger container */}
            <div className="bg-white border rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1">
                    🐞 Ecological Biodiversity Logger
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold">
                    Monitor beneficial insects, flora buffers, and avian species on your organic farmland.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Simpson Diversity</span>
                  <span className={`text-sm font-black ${getBiodiversityLevel().color}`}>
                    {getBiodiversityLevel().score}/10 ({getBiodiversityLevel().rating})
                  </span>
                </div>
              </div>

              {/* Add flora/fauna form */}
              <form onSubmit={handleAddSpecies} className="bg-slate-50 p-3 rounded-xl border grid grid-cols-1 md:grid-cols-4 gap-2.5 items-end">
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Species Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chrysoperla carnea"
                    value={newSpecName}
                    onChange={(e) => setNewSpecName(e.target.value)}
                    className="w-full bg-white border text-xs font-semibold text-slate-700 px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Category Type</label>
                  <select
                    value={newSpecType}
                    onChange={(e) => setNewSpecType(e.target.value as any)}
                    className="w-full bg-white border text-xs font-semibold text-slate-700 px-2.5 py-1.5 rounded-lg focus:outline-none"
                  >
                    <option value="Beneficial Insect">Beneficial Insect</option>
                    <option value="Avian (Birds)">Avian (Birds)</option>
                    <option value="Flora">Flora</option>
                    <option value="Fauna">Fauna</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Count Spotted</label>
                  <input
                    type="number"
                    min={1}
                    value={newSpecCount}
                    onChange={(e) => setNewSpecCount(parseInt(e.target.value) || 1)}
                    className="w-full bg-white border text-xs font-semibold text-slate-700 px-2.5 py-1.5 rounded-lg"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-lg cursor-pointer flex items-center justify-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Log Species
                </button>
                <div className="md:col-span-4">
                  <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Ecological Role / Benefit on Farm</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Natural green lace-wings devour cotton bollworm eggs"
                    value={newSpecRole}
                    onChange={(e) => setNewSpecRole(e.target.value)}
                    className="w-full bg-white border text-xs font-semibold text-slate-700 px-2.5 py-1.5 rounded-lg"
                  />
                </div>
              </form>

              {/* Logger Table */}
              <div className="overflow-x-auto max-h-[160px] overflow-y-auto border rounded-xl">
                <table className="w-full text-left text-xs text-slate-600 border-collapse">
                  <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 border-b">
                    <tr>
                      <th className="p-2.5">Species</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5 text-center">Spotted Count</th>
                      <th className="p-2.5">Ecological Role</th>
                      <th className="p-2.5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-medium">
                    {biodiversity.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-800">{b.name}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 text-[8.5px] font-black rounded border ${
                            b.type === "Beneficial Insect" ? "bg-amber-50 border-amber-200 text-amber-700" :
                            b.type === "Avian (Birds)" ? "bg-blue-50 border-blue-200 text-blue-700" :
                            b.type === "Flora" ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
                            "bg-purple-50 border-purple-200 text-purple-700"
                          }`}>
                            {b.type}
                          </span>
                        </td>
                        <td className="p-2.5 text-center font-mono font-bold text-slate-700">{b.count}</td>
                        <td className="p-2.5 text-[11px] text-slate-500">{b.role}</td>
                        <td className="p-2.5 text-center">
                          <button
                            onClick={() => setBiodiversity(prev => prev.filter(item => item.id !== b.id))}
                            className="p-1 hover:bg-rose-50 text-rose-600 rounded-md"
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

          </div>

          {/* Right Block: Carbon Credit Potential & Radar Performance Chart (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. Practice performance radar */}
            <div className="bg-white border rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Regenerative Practice Balance
              </h4>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" data={scoreData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 9, fontWeight: "bold" }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 8 }} />
                    <Radar name="Active Compliance" dataKey="value" stroke="#059669" fill="#10b981" fillOpacity={0.4} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2. Carbon farming incentive potential card */}
            <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl border border-slate-950 space-y-4 relative overflow-hidden">
              <div className="absolute right-3 top-3 p-1.5 bg-emerald-500/20 rounded-lg">
                <Award className="h-5 w-5 text-emerald-400" />
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider">Carbon Credit Estimator</span>
                <h4 className="text-sm font-black text-slate-100">Regenerative Farming Earnings</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                  By executing zero-tillage, cover cropping, and composting, you offset atmospheric Carbon. Earn voluntary carbon credits redeemable in our sovereign exchange!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-700/60 pt-4">
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Estimated Offset</span>
                  <span className="text-lg font-black text-slate-100 font-mono">
                    {Object.values(practices).filter(Boolean).length * 1.2} Tons CO₂/Yr
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Potential Income</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">
                    ${estimateCarbonCredits()} / Year
                  </span>
                </div>
              </div>

              {/* Incentive tier feedback */}
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/50 text-[10.5px] leading-snug text-slate-300 font-semibold flex gap-2">
                <Info className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  {calculateSustainableScore() >= 75
                    ? "✓ Gold Tier Regenerator: You qualify for direct corporate offset matches and premium pricing."
                    : "Tip: Activate cover cropping or a rainwater pond to reach the next certified Carbon premium bracket."}
                </span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SUB-TAB 2: ORGANIC CERTIFICATION ROADMAP */}
      {activeTab === "certification" && (
        <div className="space-y-6">
          
          <div className="p-5 bg-slate-50 border rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="h-4.5 w-4.5 text-emerald-600" />
                Step-by-Step Organic Conversion Audit Portal (NPOP Scheme)
              </h4>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                A structured, multi-year regulatory conversion track to qualify your crops for certified NPOP/USDA organic labels.
              </p>
            </div>
            
            {/* Completion percentage gauge */}
            <div className="bg-white p-3 rounded-xl border flex items-center gap-3">
              <div className="h-10 w-10 rounded-full border-4 border-emerald-500 border-r-slate-200 animate-spin-slow flex items-center justify-center">
                <span className="text-xs font-black text-slate-800">38%</span>
              </div>
              <div className="text-left font-bold text-xs">
                <span className="text-slate-700 block">Overall Progress</span>
                <span className="text-[10px] text-slate-400 font-black uppercase">Transition Stage 2/4</span>
              </div>
            </div>
          </div>

          {/* Steps Timeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {certSteps.map((step, index) => {
              const activeCount = step.checklist.filter(c => c.done).length;
              const totalCount = step.checklist.length;
              const pct = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;

              return (
                <div
                  key={step.id}
                  className={`p-5 bg-white border-2 rounded-2xl relative flex flex-col justify-between space-y-4 shadow-xs transition-shadow ${
                    step.status === "Completed" ? "border-emerald-500/80 bg-emerald-50/10" :
                    step.status === "In Progress" ? "border-amber-400" :
                    "border-slate-100 opacity-75 hover:opacity-100"
                  }`}
                >
                  {/* Step ID marker */}
                  <div className="absolute right-3 top-3 text-[10px] font-black text-slate-400 font-mono uppercase bg-slate-50 border px-2 py-0.5 rounded">
                    Step {index + 1}
                  </div>

                  <div className="space-y-2">
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${
                      step.status === "Completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      step.status === "In Progress" ? "bg-amber-50 text-amber-700 border-amber-200 animate-pulse" :
                      "bg-slate-100 text-slate-400 border-slate-200"
                    }`}>
                      {step.status}
                    </span>

                    <h4 className="text-xs font-extrabold text-slate-800 leading-tight pt-1">
                      {step.stageName}
                    </h4>
                    <span className="text-[9px] font-bold text-slate-400 block font-mono">
                      📅 Est: {step.duration}
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                      {step.description}
                    </p>
                  </div>

                  {/* Checklist wrapper */}
                  <div className="space-y-2.5 pt-3 border-t">
                    <div className="flex justify-between items-center text-[9.5px] font-black text-slate-400 uppercase tracking-wider">
                      <span>Tasks & Documents</span>
                      <span className="font-mono text-slate-700">{pct}% Completed</span>
                    </div>

                    <div className="space-y-1.5">
                      {step.checklist.map(item => (
                        <button
                          key={item.id}
                          onClick={() => toggleChecklistItem(step.id, item.id)}
                          className="w-full text-left flex items-start gap-2 p-1.5 hover:bg-slate-50/50 rounded-lg cursor-pointer transition-colors text-[10.5px] font-semibold text-slate-600"
                        >
                          <div className={`mt-0.5 p-0.5 rounded border shrink-0 transition-colors ${
                            item.done ? "bg-emerald-500 border-emerald-600 text-white" : "bg-white border-slate-300 text-transparent"
                          }`}>
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </div>
                          <span className={item.done ? "line-through text-slate-400" : ""}>
                            {item.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* SUB-TAB 3: ORGANIC INPUTS MARKETPLACE */}
      {activeTab === "inputs" && (
        <div className="space-y-6">
          
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between border-b pb-4">
            <div className="space-y-0.5">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Certified Organic Input Sourcing Directory
              </h4>
              <p className="text-[11px] text-slate-400 font-semibold">
                Sourced from vetted Vedic, non-chemical local and national cooperatives. Certified by NPOP standard agencies.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex gap-1 bg-slate-50 border p-0.5 rounded-lg">
              {["All", "Fertilizer", "Pest Control", "Soil Amendment", "Bio-Inoculant"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setInputFilters(cat)}
                  className={`px-2.5 py-1 text-[10px] font-black rounded-md cursor-pointer transition-colors ${
                    inputFilters === cat ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {inputsInventory
              .filter(item => inputFilters === "All" || item.category === inputFilters)
              .map(item => (
                <div key={item.id} className="p-4 bg-white border rounded-2xl hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400 font-mono">
                      <span>{item.category}</span>
                      <span>By: {item.supplier}</span>
                    </div>

                    <h4 className="text-xs font-black text-slate-800 leading-snug">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                      {item.description}
                    </p>
                    <div className="p-2 bg-slate-50 border rounded-lg text-[10px] font-bold text-slate-600 font-mono">
                      🧪 Composition: {item.composition}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t text-xs">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-slate-500">Price ({item.unit})</span>
                      <span className="text-sm font-black text-emerald-600 font-mono">🪙 {item.price} Coins</span>
                    </div>

                    <div className="flex justify-between items-center text-[10.5px] font-semibold text-slate-400">
                      <span>Stock Available:</span>
                      <span className="font-mono text-slate-700">{item.stock} units remaining</span>
                    </div>

                    <button
                      onClick={() => handlePurchaseInput(item.id)}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl cursor-pointer transition-colors"
                    >
                      Instant Ledger Order
                    </button>
                  </div>

                </div>
              ))}
          </div>

        </div>
      )}

      {/* SUB-TAB 4: NATURAL FARMING & COMPOST RECIPES */}
      {activeTab === "recipes" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Interactive Carbon-to-Nitrogen Calculator (7 columns) */}
          <div className="lg:col-span-7 bg-white border p-5 rounded-2xl space-y-4">
            
            <div className="space-y-1 pb-2 border-b">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1">
                <Calculator className="h-4 w-4 text-emerald-600" />
                Vedic Composting & Carbon-Nitrogen Recipe Optimizer
              </h4>
              <p className="text-[11.5px] text-slate-400 font-semibold leading-relaxed">
                Adjust the weights of carbonaceous (Brown) biomass versus nitrogenous (Green) inputs to ensure rapid high-nitrogen natural organic compost formation.
              </p>
            </div>

            {/* Selection */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: "Aerobic Pit", desc: "For general garden waste & dry leaf mold" },
                { type: "Vermicomposting", desc: "Red wiggler worms digestive processing" },
                { type: "Vedic Compost", desc: "Includes cow urine, dung, & sugar jaggery" }
              ].map(opt => (
                <button
                  key={opt.type}
                  onClick={() => setSelectedRecipeType(opt.type as any)}
                  className={`p-3 border-2 rounded-xl text-left cursor-pointer transition-all flex flex-col justify-between ${
                    selectedRecipeType === opt.type ? "border-emerald-600 bg-emerald-50/10" : "border-slate-100"
                  }`}
                >
                  <span className="text-xs font-black text-slate-800 block">{opt.type}</span>
                  <span className="text-[9px] text-slate-400 font-semibold block leading-tight pt-1">{opt.desc}</span>
                </button>
              ))}
            </div>

            {/* Range sliders */}
            <div className="space-y-4 pt-3">
              
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-700" />
                    🪵 Dry Brown Biomass (Dry leaves, straw, sugarcane bagasse)
                  </span>
                  <span className="font-mono">{brownWeight} Kgs</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={1000}
                  step={10}
                  value={brownWeight}
                  onChange={(e) => setBrownWeight(parseInt(e.target.value) || 50)}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-700"
                />
                <span className="text-[9.5px] text-slate-400 block font-semibold">Provides energy for aerobic bacteria & maintains structural air gaps.</span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    🥗 Moist Green Biomass (Vegetable scraps, manure, weeds)
                  </span>
                  <span className="font-mono">{greenWeight} Kgs</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={800}
                  step={10}
                  value={greenWeight}
                  onChange={(e) => setGreenWeight(parseInt(e.target.value) || 20)}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <span className="text-[9.5px] text-slate-400 block font-semibold">Provides primary nitrogen & amino acids to build bacterial tissue.</span>
              </div>

            </div>

            {/* Live feedback */}
            <div className="p-4 bg-slate-50 border rounded-2xl space-y-2 text-xs">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Carbonaceous Ratio</span>
                  <span className="text-base font-black text-slate-800 font-mono">
                    {calculateCompostMetrics().computedRatio} : 1 Brown/Green Ratio
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Combined Weight</span>
                  <span className="text-base font-black text-slate-800 font-mono">
                    {calculateCompostMetrics().totalWeight} Kgs Organic Input
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t">
                <span className="text-[9px] font-black text-slate-400 uppercase block">Mix Equilibrium Classification</span>
                <span className="text-xs font-extrabold text-emerald-800 block mt-0.5">
                  {calculateCompostMetrics().classification}
                </span>
                <p className="text-[11px] leading-relaxed text-slate-500 font-semibold mt-1">
                  💡 {calculateCompostMetrics().recommendations}
                </p>
                <p className="text-[10px] text-slate-400 font-black uppercase mt-1 font-mono">
                  ⏱ Expected humus output: {selectedRecipeType === "Vermicomposting" ? "45 Days" : "60-75 Days"}
                </p>
              </div>

            </div>

          </div>

          {/* Right: Subhash Palekar natural farming methods (5 columns) */}
          <div className="lg:col-span-5 bg-white border p-5 rounded-2xl space-y-4">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider pb-2 border-b">
              🌿 Natural Vedic Farming Formulations
            </h4>

            <div className="space-y-4">
              
              <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1">
                <div className="flex justify-between items-center">
                  <h5 className="text-xs font-extrabold text-emerald-900">Jiwamrita (Soil Microbe Catalyst)</h5>
                  <span className="text-[8.5px] font-black bg-emerald-600 text-white px-1.5 py-0.5 rounded uppercase">Vedic</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600 font-semibold">
                  <strong>Recipe:</strong> Mix 10kg cowdung + 10L urine + 1kg jaggery + 1kg chickpea flour + 1 handful fertile forest soil in 200L water. Ferment for 7 days.
                </p>
                <span className="text-[9.5px] text-emerald-700 font-black uppercase font-mono block">Benefit: Introduces trillions of phosphate-solubilizing microbes.</span>
              </div>

              <div className="p-3 bg-slate-50 border rounded-xl space-y-1">
                <div className="flex justify-between items-center">
                  <h5 className="text-xs font-extrabold text-slate-800">Bijamrita (Natural Seed Coating)</h5>
                  <span className="text-[8.5px] font-black bg-slate-400 text-slate-700 px-1.5 py-0.5 rounded uppercase">Inoculant</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600 font-semibold">
                  <strong>Recipe:</strong> Mix 5kg fresh cow dung + 5L urine + 50g slaked lime + handful soil in 20L water. Dip seeds prior to planting.
                </p>
                <span className="text-[9.5px] text-slate-500 font-black uppercase font-mono block">Benefit: Prevents seed-borne fungal infections & root rot.</span>
              </div>

              <div className="p-3 bg-amber-50/40 border border-amber-100 rounded-xl space-y-1">
                <h5 className="text-xs font-extrabold text-amber-900">Green Manuring (Sesbania)</h5>
                <p className="text-[11px] leading-relaxed text-slate-600 font-semibold">
                  Sow Dhaincha/Sesbania seed at 15kg/acre. Grow for 45 days until flowering, then run disc harrow to incorporate biological biomass back into topsoil.
                </p>
                <span className="text-[9.5px] text-amber-700 font-black uppercase font-mono block">Benefit: Adds ~45Kg organic nitrogen per acre.</span>
              </div>

              <div className="p-3 bg-purple-50/40 border border-purple-100 rounded-xl space-y-1">
                <h5 className="text-xs font-extrabold text-purple-900">Multi-Cropping Companion (Tomato + Marigold)</h5>
                <p className="text-[11px] leading-relaxed text-slate-600 font-semibold">
                  Plant 1 row of Mexican Marigold for every 3 rows of Tomato. Marigold root exudates kill root-knot nematodes and yellow flowers attract pest predators.
                </p>
                <span className="text-[9.5px] text-purple-700 font-black uppercase font-mono block">Benefit: Halves standard insect damage naturally.</span>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* SUB-TAB 5: SUSTAINABLE ENGINEERING & GREEN ENERGY */}
      {activeTab === "engineering" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Block: Rainwater Catchment Calculator (7 columns) */}
          <div className="lg:col-span-7 bg-white border p-5 rounded-2xl space-y-4">
            
            <div className="space-y-1 pb-2 border-b">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1">
                <Droplets className="h-4 w-4 text-sky-600" />
                Rainwater Harvesting Catchment & Pond Estimator
              </h4>
              <p className="text-[11.5px] text-slate-400 font-semibold leading-relaxed">
                Determine the maximum clean fresh water catchment potential based on roofing surface areas and annual precipitation cycles.
              </p>
            </div>

            {/* Form controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Catchment Area (Sqm)</label>
                <input
                  type="number"
                  min={50}
                  value={catchmentArea}
                  onChange={(e) => setCatchmentArea(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border text-xs font-extrabold text-slate-700 px-3 py-2 rounded-lg"
                />
                <span className="text-[9px] text-slate-400 font-semibold">Roofs/hard surfaces</span>
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Annual Rain (Mm)</label>
                <input
                  type="number"
                  min={100}
                  value={avgRainfall}
                  onChange={(e) => setAvgRainfall(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border text-xs font-extrabold text-slate-700 px-3 py-2 rounded-lg"
                />
                <span className="text-[9px] text-slate-400 font-semibold">Local precipitation</span>
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Runoff Material Coefficient</label>
                <select
                  value={runoffCoefficient}
                  onChange={(e) => setRunoffCoefficient(parseFloat(e.target.value) || 0.5)}
                  className="w-full bg-slate-50 border text-xs font-extrabold text-slate-700 px-3 py-2 rounded-lg"
                >
                  <option value="0.95">Tin/Metal Roofing (95% efficiency)</option>
                  <option value="0.80">Concrete/Tiled Roof (80% efficiency)</option>
                  <option value="0.60">Compacted Bare Soil (60% efficiency)</option>
                  <option value="0.30">Gravel/Vegetation Hedges (30% efficiency)</option>
                </select>
                <span className="text-[9px] text-slate-400 font-semibold">Surface friction absorption</span>
              </div>
            </div>

            {/* Calculated output */}
            <div className="p-4 bg-sky-50/50 border border-sky-100 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold text-slate-600">
              
              <div className="space-y-1">
                <span className="text-[9px] font-black text-sky-800 uppercase tracking-wider block">Harvested Liter Volume</span>
                <span className="text-xl font-black text-slate-800 font-mono block">
                  {calculateHarvestedWater().liters.toLocaleString()} Liters
                </span>
                <span className="text-[10px] text-slate-400 block font-semibold">Clean liquid rain captured</span>
              </div>

              <div className="space-y-1 border-y md:border-y-0 md:border-x py-3 md:py-0 md:px-4">
                <span className="text-[9px] font-black text-sky-800 uppercase tracking-wider block">Metric Catchment</span>
                <span className="text-xl font-black text-slate-800 font-mono block">
                  {calculateHarvestedWater().cubicMeters} Cubic Met. (m³)
                </span>
                <span className="text-[10px] text-slate-400 block font-semibold">Pond dimensions ~ 10m x 5m x 1m</span>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-black text-emerald-800 uppercase tracking-wider block">Drip Irrigation Support</span>
                <span className="text-xl font-black text-emerald-700 font-mono block">
                  ~ {calculateHarvestedWater().irrigationDaysSupported} Days
                </span>
                <span className="text-[10px] text-slate-400 block font-semibold">Assuming 2,500L/day micro-drip consumption</span>
              </div>

            </div>

            {/* Permaculture design rules card */}
            <div className="p-4 bg-slate-50 border rounded-2xl space-y-3">
              <h5 className="text-xs font-black text-slate-800 uppercase flex items-center gap-1">
                <Compass className="h-4 w-4 text-emerald-600" />
                Permaculture Zonal Layout Design Suggestions
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-[10px] font-bold text-slate-500">
                <div className="p-2 bg-white rounded-lg border">
                  <span className="text-slate-800 font-black block">Zone 1 (Home)</span>
                  Kitchen herb garden, vermicompost bin, rainwater tanks.
                </div>
                <div className="p-2 bg-white rounded-lg border">
                  <span className="text-slate-800 font-black block">Zone 2 (Orchard)</span>
                  Fruit trees, poultry tractors, solar water micro-pumps.
                </div>
                <div className="p-2 bg-white rounded-lg border">
                  <span className="text-slate-800 font-black block">Zone 3 (Arable)</span>
                  Main crop (rice/tomato), conservation contour bunds.
                </div>
                <div className="p-2 bg-white rounded-lg border">
                  <span className="text-slate-800 font-black block">Zone 4 (Agroforest)</span>
                  Melia dubia carbon sync, timber woods, forage shrubs.
                </div>
                <div className="p-2 bg-white rounded-lg border">
                  <span className="text-slate-800 font-black block">Zone 5 (Wild)</span>
                  Unmanaged wildlife buffers, natural pest predator refuge.
                </div>
              </div>
            </div>

          </div>

          {/* Right Block: Solar, Biogas Active Telemetry Simulator (5 columns) */}
          <div className="lg:col-span-5 bg-slate-950 text-white border border-slate-900 p-5 rounded-2xl space-y-5">
            
            <div className="flex justify-between items-center pb-2 border-b border-slate-850">
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-amber-400" />
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-300">
                  Green Micro-Energy Telemetry
                </h4>
              </div>
              <span className="text-[8px] font-black bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-900 uppercase">
                Active Live
              </span>
            </div>

            {/* Solar Pump Stats */}
            <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1 font-bold text-slate-300">
                  <Sun className="h-4.5 w-4.5 text-amber-400 animate-spin-slow" />
                  Solar Water Pump Array
                </span>
                <span className="text-[9.5px] text-emerald-400 font-black font-mono">● OPERATIONAL</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                <div>
                  <span className="text-[9px] text-slate-500 block">Today's Generation</span>
                  <span className="text-sm font-black text-slate-100">{solarGeneration} KWh</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 block">Flow Delivered</span>
                  <span className="text-sm font-black text-slate-100">14,250 Liters/day</span>
                </div>
              </div>

              {/* simulated dial manipulation */}
              <div className="flex gap-2 pt-2 border-t border-slate-850">
                <button
                  onClick={() => setSolarGeneration(prev => Number((prev + 1.2).toFixed(1)))}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-750 text-[9px] font-black rounded text-slate-300 cursor-pointer"
                >
                  ☀️ Increase Solar Flux (+1.2 KWh)
                </button>
              </div>
            </div>

            {/* Biogas Digester Stats */}
            <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1 font-bold text-slate-300">
                  <Flame className="h-4.5 w-4.5 text-rose-500" />
                  Manure Anaerobic Biogas Digest
                </span>
                <span className="text-[9.5px] text-emerald-400 font-black font-mono">● PRODUCING</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                <div>
                  <span className="text-[9px] text-slate-500 block">Biogas Yield</span>
                  <span className="text-sm font-black text-slate-100">{biogasProduction} m³ Gas</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 block">Pressure Sensor</span>
                  <span className="text-sm font-black text-slate-100">1.8 bar (Normal)</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-850">
                <button
                  onClick={() => {
                    setBiogasProduction(prev => Number((prev + 0.5).toFixed(1)));
                    setCarbonOffsetCount(c => c + 15);
                  }}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-750 text-[9px] font-black rounded text-slate-300 cursor-pointer"
                >
                  🐮 Feed Manure Biomass (+0.5 m³)
                </button>
              </div>
            </div>

            {/* Cumulative offsets */}
            <div className="p-3.5 bg-emerald-950/20 border border-emerald-900/40 rounded-xl flex items-center justify-between text-xs font-bold text-slate-300">
              <div>
                <span className="text-[9px] text-slate-500 uppercase block font-black">Historical Carbon Offset</span>
                <span className="text-sm font-black text-emerald-400 font-mono">
                  {carbonOffsetCount.toLocaleString()} Kg CO₂
                </span>
              </div>
              <span className="text-[10px] text-emerald-500 font-extrabold uppercase">
                Equivalent to 64 trees planted
              </span>
            </div>

            {/* Sustainable Packaging Recommendations */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Eco-Packaging Recommendations</span>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-850 text-[10.5px] text-slate-400 space-y-1 font-semibold leading-relaxed">
                <div>• <strong className="text-slate-200">Cornstarch Bio-Bags:</strong> Fully compostable in 90 days. Ideal for retail tomatoes and pulses.</div>
                <div>• <strong className="text-slate-200">Jute Gunny Sacks:</strong> Traditional, highly breathable, reusable. Best for potato/onion bulk shipping.</div>
                <div>• <strong className="text-slate-200">Areca Palm Leaf Plates:</strong> Sturdy heat-molded plates for local organic market direct-sales.</div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
