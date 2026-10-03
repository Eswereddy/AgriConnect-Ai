import React, { useState, useMemo, useEffect } from "react";
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Upload,
  Info,
  Sliders,
  DollarSign,
  TrendingUp,
  MapPin,
  ChevronRight,
  Sparkles,
  HelpCircle,
  FileSpreadsheet,
  Award,
  Bell,
  Search,
  Scale,
  ShieldCheck,
  Send,
  MessageSquare,
  Globe,
  RefreshCw,
  UserCheck,
  ThumbsUp,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Check,
  FileDown
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

// --- INTERFACES ---
interface Scheme {
  id: string;
  name: string;
  level: "Central" | "State";
  type: string;
  description: string;
  simpleExplanation: string; // Explained in simple terms
  eligibilityCriteria: {
    maxLandSizeHectares: number;
    requiredDocuments: string[];
    otherConditions: string;
    incomeLimit?: string;
    minAge?: number;
    socialCategory?: string;
    cropType?: string;
  };
  financialBenefit: string;
  estimatedSubsidyFormula: (landSize: number) => number; // Interactive estimator callback
  deadline: string;
  status: "Open" | "Closing Soon" | "Suspended" | "Expired" | "Upcoming";
  penetrationPercentage: number;
  successStory: {
    farmerName: string;
    location: string;
    amountReceived: string;
    quote: string;
  };
  category: "Income Support" | "Subsidies" | "Insurance" | "Education" | "Infrastructure";
  state: string;
  deadlineStatus: "Active" | "Upcoming" | "Expired";
  ministry?: string;
  benefitsDetails?: string;
  applicationUrl?: string;
  allocatedBudget?: string;
  utilizedBudget?: string;
}

interface Application {
  id: string;
  schemeId: string;
  schemeName: string;
  submittedDate: string;
  status: "Under Review" | "Verified" | "Approved" | "Disbursed" | "Rejected" | "Action Required";
  progressPercent: number;
  comments: string;
  rejectionReason?: string;
  verifiedDocuments: { name: string; status: "Verified" | "Rejected" | "Pending" }[];
}

interface Complaint {
  id: string;
  subject: string;
  category: string;
  status: "Pending Investigation" | "In Progress" | "Resolved";
  filedDate: string;
  lastUpdated: string;
  replies: { author: string; message: string; timestamp: string }[];
}

export interface FarmerAidRequest {
  id: string;
  farmerName: string;
  aadhaar: string;
  phone: string;
  district: string;
  block: string;
  reason: "Crop Loss" | "Livestock Loss" | "Property Damage";
  description: string;
  estimatedLoss: number;
  requestedAmount: number;
  status: "Pending" | "Approved" | "Rejected";
  approvedAmount?: number;
  disbursementStatus?: "Pending" | "Processing" | "Disbursed";
  rejectionReason?: string;
  submittedAt: string;
}

const INITIAL_AID_REQUESTS: FarmerAidRequest[] = [
  {
    id: "AID-901",
    farmerName: "Amir Patel",
    aadhaar: "xxxx-xxxx-8012",
    phone: "+91 98765 43210",
    district: "Vijayawada",
    block: "Verka Block",
    reason: "Crop Loss",
    description: "Heavy lodging and submerged paddy crops across 2 hectares due to localized flooding.",
    estimatedLoss: 120000,
    requestedAmount: 50000,
    status: "Approved",
    approvedAmount: 45000,
    disbursementStatus: "Disbursed",
    submittedAt: "2026-07-13"
  },
  {
    id: "AID-902",
    farmerName: "Gurpreet Kaur",
    aadhaar: "xxxx-xxxx-9182",
    phone: "+91 98821 34912",
    district: "Karnal",
    block: "Nilokheri Block",
    reason: "Livestock Loss",
    description: "Two milch cows lost due to severe localized lightning storm and cattle shed collapse.",
    estimatedLoss: 85000,
    requestedAmount: 40000,
    status: "Pending",
    submittedAt: "2026-07-15"
  }
];

export const GovernmentIntegration: React.FC = () => {
  // --- STATES ---
  const [activeSubTab, setActiveSubTab] = useState<
    "eligibility" | "compare" | "documents" | "tracking" | "itr" | "complaints" | "disaster_aid"
  >("eligibility");

  // User Profile Data (Mock context bound)
  const [farmerProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("agriconnect_farmer_data");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          name: parsed.name || "Amir Patel",
          aadhaar: parsed.aadhaar || "xxxx-xxxx-8012",
          pan: parsed.pan || "BNXPA1928K",
          phone: parsed.phone || parsed.mobile || "+91 98765 43210",
          district: parsed.district || "Vijayawada Block B",
          state: parsed.state || "Andhra Pradesh",
          landSizeHectares: parsed.landSizeHectares || (parsed.landSize ? parseFloat(parsed.landSize) * 0.404686 : 1.82), // convert acres to hectares
          mainCrop: parsed.mainCrop || (parsed.cropsGrown && parsed.cropsGrown[0]) || "Heirloom Basmati Rice",
          annualIncome: parsed.annualIncome || 260000,
          irrigationType: (parsed.irrigationType === "Drip" || parsed.irrigationType === "Drip Irrigation" ? "Micro-Drip Solar" : "Canal/Borewell") as "Rainfed" | "Canal/Borewell" | "Micro-Drip Solar",
          isTaxPayer: parsed.isTaxPayer || false,
          age: parsed.age || 42,
          socialCategory: parsed.socialCategory || "Small & Marginal Farmers",
          ownedDocuments: parsed.ownedDocuments || ["Aadhaar Card", "Bank Account Passbook", "Sowing Certificate", "ID Proof", "Soil Nutrient Report"]
        };
      }
    } catch (e) {
      // ignore
    }
    return {
      name: "Amir Patel",
      aadhaar: "xxxx-xxxx-8012",
      pan: "BNXPA1928K",
      phone: "+91 98765 43210",
      district: "Vijayawada Block B",
      state: "Andhra Pradesh",
      landSizeHectares: 1.82,
      mainCrop: "Heirloom Basmati Rice",
      annualIncome: 260000, // ₹2,60,000 / Year
      irrigationType: "Canal/Borewell" as "Rainfed" | "Canal/Borewell" | "Micro-Drip Solar",
      isTaxPayer: false,
      age: 42,
      socialCategory: "Small & Marginal Farmers",
      ownedDocuments: ["Aadhaar Card", "Bank Account Passbook", "Sowing Certificate", "ID Proof", "Soil Nutrient Report"]
    };
  });

  // Dynamic calculations states (overrides based on form inputs)
  const [calcLandSize, setCalcLandSize] = useState<number>(1.82);
  const [calcAnnualIncome, setCalcAnnualIncome] = useState<number>(260000);
  const [calcIrrigationType, setCalcIrrigationType] = useState<"Rainfed" | "Canal/Borewell" | "Micro-Drip Solar">(
    "Canal/Borewell"
  );
  const [calcTaxPayer, setCalcTaxPayer] = useState<boolean>(false);
  const [calcCropCategory, setCalcCropCategory] = useState<"Cereals" | "Horticulture" | "Fibre Crops">("Cereals");

  // --- NEW ELIGIBILITY CHECKER STATES ---
  const [eligibilityCheckMode, setEligibilityCheckMode] = useState<"auto" | "manual">("auto");
  const [calcAge, setCalcAge] = useState<number>(42);
  const [calcSocialCategory, setCalcSocialCategory] = useState<string>("Small & Marginal Farmers");
  const [calcOwnedDocs, setCalcOwnedDocs] = useState<string[]>([
    "Aadhaar Card", "Bank Account Passbook", "Sowing Certificate", "ID Proof", "Soil Nutrient Report"
  ]);

  // Synchronize parameter simulator when in Auto mode
  React.useEffect(() => {
    if (eligibilityCheckMode === "auto") {
      setCalcLandSize(farmerProfile.landSizeHectares);
      setCalcAnnualIncome(farmerProfile.annualIncome);
      setCalcIrrigationType(farmerProfile.irrigationType);
      setCalcTaxPayer(farmerProfile.isTaxPayer);
      setCalcAge(farmerProfile.age);
      setCalcSocialCategory(farmerProfile.socialCategory);
      setCalcOwnedDocs(farmerProfile.ownedDocuments);
    }
  }, [eligibilityCheckMode, farmerProfile]);

  // --- NEW EMERGENCY DISASTER AID STATES ---
  const [aidRequests, setAidRequests] = useState<FarmerAidRequest[]>(() => {
    const saved = localStorage.getItem("agriconnect_emergency_aid_requests");
    if (saved) return JSON.parse(saved);
    return INITIAL_AID_REQUESTS;
  });

  useEffect(() => {
    localStorage.setItem("agriconnect_emergency_aid_requests", JSON.stringify(aidRequests));
  }, [aidRequests]);

  const [newAidReason, setNewAidReason] = useState<"Crop Loss" | "Livestock Loss" | "Property Damage">("Crop Loss");
  const [newAidDescription, setNewAidDescription] = useState("");
  const [newAidEstimatedLoss, setNewAidEstimatedLoss] = useState<number>(60000);
  const [newAidRequestedAmount, setNewAidRequestedAmount] = useState<number>(25000);

  const handleRequestAid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAidDescription.trim()) {
      alert("Please enter a description of the damage.");
      return;
    }

    const newRequest: FarmerAidRequest = {
      id: `AID-${Date.now().toString().slice(-3)}`,
      farmerName: farmerProfile.name,
      aadhaar: farmerProfile.aadhaar,
      phone: farmerProfile.phone,
      district: farmerProfile.district ? farmerProfile.district.split(" ")[0] : "Vijayawada",
      block: farmerProfile.district && farmerProfile.district.includes("Block") ? farmerProfile.district : "Verka Block",
      reason: newAidReason,
      description: newAidDescription.trim(),
      estimatedLoss: Number(newAidEstimatedLoss),
      requestedAmount: Number(newAidRequestedAmount),
      status: "Pending",
      submittedAt: new Date().toISOString().split('T')[0]
    };

    const updated = [newRequest, ...aidRequests];
    setAidRequests(updated);
    setNewAidDescription("");
    setNewAidEstimatedLoss(60000);
    setNewAidRequestedAmount(25000);
    alert(`Emergency Aid Request ${newRequest.id} successfully registered under state crisis protocol!`);
  };

  // Schemes Database (Central & State representation)
  const [schemes] = useState<Scheme[]>([
    {
      id: "PM-KISAN",
      name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
      level: "Central",
      type: "Direct Income Support",
      description: "Direct sovereign cash transfers to support marginal landholder families, disbursed in equal quad-monthly installments directly to bank accounts.",
      simpleExplanation: "Get a guaranteed cash payment of ₹6,000 every year from the Central Government, paid directly into your bank account in 3 equal parts. Ideal for buying seeds or small supplies.",
      eligibilityCriteria: {
        maxLandSizeHectares: 2.0,
        requiredDocuments: ["Aadhaar Card", "Land Registration Records (Jamabandi)", "Bank Account Passbook"],
        otherConditions: "Must not hold constitutional posts or pay professional income taxes.",
        incomeLimit: "Below ₹3,00,000 / Year",
        minAge: 18,
        socialCategory: "Small & Marginal Farmers",
        cropType: "All Crops"
      },
      financialBenefit: "$120 / Year (₹6,000 paid in 3 installments)",
      estimatedSubsidyFormula: (land) => (land <= 2.0 ? 120 : 0),
      deadline: "2026-12-31",
      status: "Open",
      penetrationPercentage: 94,
      successStory: {
        farmerName: "Sarbjit Singh",
        location: "Guntur District",
        amountReceived: "$120",
        quote: "The direct transfers helped me buy high-quality organic Basmati seed inputs exactly before the monsoon began without high-interest loans."
      },
      category: "Income Support",
      state: "All States",
      deadlineStatus: "Active",
      ministry: "Ministry of Agriculture & Farmers Welfare",
      benefitsDetails: "₹6,000 per year transferred directly to the verified bank account in three equal installments of ₹2,000.",
      applicationUrl: "https://pmkisan.gov.in/",
      allocatedBudget: "₹60,000 Crores ($7.2 Billion)",
      utilizedBudget: "₹54,200 Crores ($6.5 Billion)"
    },
    {
      id: "ANDHRA PRADESH-LIVELIHOOD",
      name: "Andhra Pradesh Smallholder Livelihood Income Support",
      level: "State",
      type: "Livelihood Support",
      description: "State-funded matching grants to secure secondary income streams for marginal farmers during lean seasons, with dynamic direct cash payouts.",
      simpleExplanation: "An extra income boost of ₹4,500 during non-harvest months from the Andhra Pradesh Government. Designed to support minor farm expenses when crop income is low.",
      eligibilityCriteria: {
        maxLandSizeHectares: 1.5,
        requiredDocuments: ["Aadhaar Card", "Active Bank Ledger Statement", "Cultivation Certificate"],
        otherConditions: "Exclusive to registered smallholders in border districts of Andhra Pradesh.",
        incomeLimit: "Below ₹1,50,000 / Year",
        minAge: 18,
        socialCategory: "Marginal Farmers",
        cropType: "All Crops"
      },
      financialBenefit: "$90 / Year (₹4,500 paid during lean season)",
      estimatedSubsidyFormula: (land) => (land <= 1.5 ? 90 : 0),
      deadline: "2026-10-15",
      status: "Upcoming",
      penetrationPercentage: 70,
      successStory: {
        farmerName: "Baldev Singh",
        location: "Ferozepur District",
        amountReceived: "$90",
        quote: "The lean season matching cash made sure we could pay for tube-well repairs without skipping basic food or household expenses."
      },
      category: "Income Support",
      state: "Andhra Pradesh",
      deadlineStatus: "Upcoming",
      ministry: "Department of Agriculture & Farmers Welfare, Andhra Pradesh",
      benefitsDetails: "₹4,500 direct seasonal income support paid in two installments during dry winter months.",
      applicationUrl: "https://agri.andhra pradesh.gov.in/",
      allocatedBudget: "₹1,200 Crores ($145 Million)",
      utilizedBudget: "₹1,120 Crores ($135 Million)"
    },
    {
      id: "PMFBY",
      name: "Pradhan Mantri Fasal Bima Yojana (PMFBY Crop Insurance)",
      level: "Central",
      type: "Crop Insurance",
      description: "Comprehensive multi-risk yield insurance protection shielding against natural calamities, pests, droughts, storms, and localized water inundation.",
      simpleExplanation: "Protect your crop fields against bad weather, bugs, or floods. You only pay a very small amount (1.5% to 2% premium), and the government pays the rest to keep you fully insured.",
      eligibilityCriteria: {
        maxLandSizeHectares: 10.0,
        requiredDocuments: ["Sowing Certificate", "Land Tenancy Agreement", "ID Proof", "Bank Details"],
        otherConditions: "Must be sown within official seasonal limits for specified kharif/rabi crops.",
        incomeLimit: "No Limit",
        minAge: 18,
        socialCategory: "All Landholding & Tenant Farmers",
        cropType: "Cereals, Oilseeds, Commercial Crops"
      },
      financialBenefit: "Covers up to 100% of loss-adjusted sum assured; premium capped at 1.5% to 2%.",
      estimatedSubsidyFormula: (land) => Math.round(land * 340), // Sum assured coverage estimator
      deadline: "2026-07-15",
      status: "Closing Soon",
      penetrationPercentage: 78,
      successStory: {
        farmerName: "Gurpreet Kaur",
        location: "Vijayawada Sector 3",
        amountReceived: "$1,450 (Claim settled)",
        quote: "After the unseasonal hailstorm damaged my wheat, the crop insurance officer verified my land map and cleared my payout in 18 days."
      },
      category: "Insurance",
      state: "All States",
      deadlineStatus: "Active",
      ministry: "Ministry of Agriculture & Farmers Welfare",
      benefitsDetails: "Complete comprehensive insurance protection with up to 100% financial compensation for localized crop loss or regional post-harvest damage.",
      applicationUrl: "https://pmfby.gov.in/",
      allocatedBudget: "₹15,000 Crores ($1.8 Billion)",
      utilizedBudget: "₹14,100 Crores ($1.7 Billion)"
    },
    {
      id: "WBCIS-HARYANA",
      name: "Weather-Based Crop Insurance Scheme (WBCIS)",
      level: "State",
      type: "Weather Insurance",
      description: "Sovereign crop insurance plan leveraging advanced automated weather stations to measure adverse heatwaves, deficit rainfall, and humidity drops.",
      simpleExplanation: "A modern weather insurance scheme. Get paid automatically if local government weather monitors record extreme heatwaves or dry spells that ruin your crops.",
      eligibilityCriteria: {
        maxLandSizeHectares: 8.0,
        requiredDocuments: ["ID Proof", "Landholding Records", "Sowing Declaration"],
        otherConditions: "Must be in a notified weather block registered with automatic monitoring nodes.",
        incomeLimit: "No Limit",
        minAge: 18,
        socialCategory: "All Registered Farmers",
        cropType: "Horticulture, Cotton, Paddy"
      },
      financialBenefit: "Payout issued directly based on certified deviations from historical climate indexes.",
      estimatedSubsidyFormula: (land) => Math.round(land * 280),
      deadline: "2026-06-15",
      status: "Expired",
      penetrationPercentage: 65,
      successStory: {
        farmerName: "Rajender Prasad",
        location: "Karnal Block",
        amountReceived: "$850",
        quote: "We had a severe heatwave in May. I didn't even have to file a manual crop damage request; the automated weather index triggered my payout."
      },
      category: "Insurance",
      state: "Haryana",
      deadlineStatus: "Expired",
      ministry: "Department of Agriculture, Haryana",
      benefitsDetails: "Automatic climate-indexed cash payouts calibrated based on temperature, rainfall, and wind speed deviations recorded at local monitoring stations.",
      applicationUrl: "https://agriharyana.gov.in/",
      allocatedBudget: "₹850 Crores ($102 Million)",
      utilizedBudget: "₹820 Crores ($99 Million)"
    },
    {
      id: "SEED-SUBSIDY",
      name: "Certified High-Yield Seeds Distribution Subsidy",
      level: "Central",
      type: "Input Subsidy",
      description: "Direct-to-benefit subsidy program reducing the purchasing price of climate-resilient, pest-resistant hybrid seeds for core cereal crops.",
      simpleExplanation: "Get verified, high-yield seeds at half the normal price. The government covers up to 50% of the cost directly at accredited seed centers.",
      eligibilityCriteria: {
        maxLandSizeHectares: 4.0,
        requiredDocuments: ["Aadhaar Card", "Soil Health Card", "Seed Center Purchase Ticket"],
        otherConditions: "Limited to verified varieties of wheat, basmati paddy, and key legumes.",
        incomeLimit: "Below ₹5,00,000 / Year",
        minAge: 18,
        socialCategory: "Small, Marginal & SC/ST Farmers",
        cropType: "Wheat, Basmati Paddy, Legumes"
      },
      financialBenefit: "50% direct discount on seeds bought from state-certified co-operative distribution depots.",
      estimatedSubsidyFormula: (land) => Math.round(land * 150),
      deadline: "2026-08-10",
      status: "Open",
      penetrationPercentage: 88,
      successStory: {
        farmerName: "Harbhajan Brar",
        location: "Sangrur Center",
        amountReceived: "$180 (Seed Grant)",
        quote: "Getting certified disease-resistant basmati seeds at half price saved me substantial cost and secured a 25% higher yield this season."
      },
      category: "Subsidies",
      state: "All States",
      deadlineStatus: "Active",
      ministry: "Ministry of Agriculture & Farmers Welfare",
      benefitsDetails: "50% upfront subsidy on purchase of high-yielding varieties from accredited co-operative outlets.",
      applicationUrl: "https://seednet.gov.in/",
      allocatedBudget: "₹3,500 Crores ($420 Million)",
      utilizedBudget: "₹3,150 Crores ($380 Million)"
    },
    {
      id: "FERT-SUBSIDY",
      name: "Direct Fertilizer Benefit & Soil Nutrient Subsidy",
      level: "Central",
      type: "Nutrient Subsidy",
      description: "National DBT-linked fertilizer support system providing controlled access to subsidized Urea, DAP, and complex organic bio-fertilizers.",
      simpleExplanation: "Buy fertilizer bags at highly subsidized rates. The government pays the chemical companies directly so you only pay a fraction of the market rate.",
      eligibilityCriteria: {
        maxLandSizeHectares: 6.0,
        requiredDocuments: ["Biometric Verification receipt", "Soil Nutrient Report"],
        otherConditions: "Must purchase via biometric POS machines in licensed rural retail shops.",
        incomeLimit: "No Limit",
        minAge: 18,
        socialCategory: "All Active Cultivators",
        cropType: "All Crop Varieties"
      },
      financialBenefit: "Secures highly subsidized inputs; Urea bags capped at a tiny fraction of global rates.",
      estimatedSubsidyFormula: (land) => Math.round(land * 120),
      deadline: "2026-09-10",
      status: "Open",
      penetrationPercentage: 92,
      successStory: {
        farmerName: "Karan Johal",
        location: "Pathankot Hub",
        amountReceived: "$220",
        quote: "Biometric POS purchase is fast. With the fertilizer subsidy, we managed to buy enough bio-nutrient bags without exhausting our savings."
      },
      category: "Subsidies",
      state: "All States",
      deadlineStatus: "Active",
      ministry: "Ministry of Chemicals and Fertilizers",
      benefitsDetails: "Urea and DAP bags price-capped directly at POS merchants, with the government covering remaining market premiums under direct benefit transfer schemes.",
      applicationUrl: "https://urvarak.nic.in/",
      allocatedBudget: "₹1,75,000 Crores ($21 Billion)",
      utilizedBudget: "₹1,62,000 Crores ($19.5 Billion)"
    },
    {
      id: "EQUIP-SUBSIDY",
      name: "Sub-Mission on Agricultural Mechanization (SMAM - Equipment)",
      level: "State",
      type: "Machinery Subsidy",
      description: "Andhra Pradesh state initiative providing massive matching grants for renting or purchasing high-efficiency machinery like happy seeders, laser levelers, and tractors.",
      simpleExplanation: "Rent or buy modern farm machinery with 50% to 80% funding covered by the State. Perfect for renting rotavators or high-precision laser land levelers.",
      eligibilityCriteria: {
        maxLandSizeHectares: 3.0,
        requiredDocuments: ["Equipment Quotation", "Landownership Record", "Biometric verification"],
        otherConditions: "Priority given to women farmers and registered local village co-operatives.",
        incomeLimit: "Below ₹6,00,000 / Year",
        minAge: 18,
        socialCategory: "Marginal Farmers & Co-operative Societies",
        cropType: "Residue Management & Field Prep Crops"
      },
      financialBenefit: "50% capital subsidy on machinery and up to 80% support for collective co-op custom hiring centers.",
      estimatedSubsidyFormula: (land) => Math.round(land * 600),
      deadline: "2026-09-05",
      status: "Open",
      penetrationPercentage: 58,
      successStory: {
        farmerName: "Jasmeet Kaur",
        location: "Ropar Co-op Cell",
        amountReceived: "$1,200",
        quote: "Our co-op was able to buy a custom Happy Seeder under the 80% subsidy. Now we all sow our fields without burning residue."
      },
      category: "Subsidies",
      state: "Andhra Pradesh",
      deadlineStatus: "Active",
      ministry: "Department of Agriculture & Farmers Welfare, Andhra Pradesh",
      benefitsDetails: "50% capital assistance grant for purchase of individual tractors, tillers, levelers, and up to 80% for local custom hiring hubs.",
      applicationUrl: "https://agrimachinery.nic.in/",
      allocatedBudget: "₹450 Crores ($54 Million)",
      utilizedBudget: "₹390 Crores ($47 Million)"
    },
    {
      id: "FARMER-TRAINING",
      name: "Andhra Pradesh Sovereign Farm Training & Skill Development",
      level: "State",
      type: "Education Support",
      description: "State-certified educational programs focusing on precision agronomy, organic certification compliance, and micro-irrigation management.",
      simpleExplanation: "A free training program from Andhra Pradesh state. Learn how to double your crop yield, use less water, and get organic certification with fully funded classroom and field lessons.",
      eligibilityCriteria: {
        maxLandSizeHectares: 15.0,
        requiredDocuments: ["ID Proof", "Active Sowing Self-Declaration"],
        otherConditions: "Must complete at least 80% of interactive workshop hours to claim the daily stipend.",
        incomeLimit: "No Limit",
        minAge: 15,
        socialCategory: "All Rural Youth & Farmers",
        cropType: "All Crops (Organic, Horticulture)"
      },
      financialBenefit: "100% free hands-on schooling, certified organic training, and $100 completing allowance.",
      estimatedSubsidyFormula: (land) => 100,
      deadline: "2026-08-25",
      status: "Open",
      penetrationPercentage: 42,
      successStory: {
        farmerName: "Daljit Sandhu",
        location: "Nellore Krishi Vigyan",
        amountReceived: "$100 (Stipend)",
        quote: "The soil biology sessions were outstanding. We learned exactly how to blend vermicompost to reduce costly chemical dependencies."
      },
      category: "Education",
      state: "Andhra Pradesh",
      deadlineStatus: "Active",
      ministry: "Acharya N.G. Ranga Agricultural University & PAU Extension",
      benefitsDetails: "Fully-funded residential courses on sustainable farm techniques plus ₹8,00,000 stipend upon graduation and certification.",
      applicationUrl: "https://www.pau.edu/",
      allocatedBudget: "₹120 Crores ($14 Million)",
      utilizedBudget: "₹98 Crores ($11.8 Million)"
    },
    {
      id: "SUBSIDY-SOLAR",
      name: "PM-KUSUM Off-Grid Solar Water Pump Subsidy",
      level: "Central",
      type: "Subsidy",
      description: "Massive bilateral subsidy to replace high-emission diesel engines with heavy-duty photovoltaic submersible water pumping units.",
      simpleExplanation: "Get a heavy-duty solar water pump for your fields. The government pays 60% of the entire cost directly, and banks cover another 30%, so you only pay 10% out of pocket!",
      eligibilityCriteria: {
        maxLandSizeHectares: 5.0,
        requiredDocuments: ["Soil Water Availability Report", "Land Ownership Deed", "Bank IFSC details"],
        otherConditions: "Must have micro-irrigation system installed or planned.",
        incomeLimit: "No Limit",
        minAge: 18,
        socialCategory: "All Landholders with water rights",
        cropType: "All Crop Varieties"
      },
      financialBenefit: "Provides 60% direct state capital subsidy, with 30% bank credit support.",
      estimatedSubsidyFormula: (land) => (land >= 1.0 ? 1800 : 900), // Estimated capital support value
      deadline: "2026-07-20",
      status: "Closing Soon",
      penetrationPercentage: 55,
      successStory: {
        farmerName: "Sukhwinder Dhillon",
        location: "Tenali Block A",
        amountReceived: "$2,400 (Solar Capital Grant)",
        quote: "No more diesel fuel bills or waiting for overnight power grids. My solar pump runs completely free under daylight sun."
      },
      category: "Infrastructure",
      state: "All States",
      deadlineStatus: "Active",
      ministry: "Ministry of New and Renewable Energy",
      benefitsDetails: "60% direct financial grant split between center and state, with low-interest bank debt of 30%, meaning only 10% upfront cost for farmers.",
      applicationUrl: "https://mnre.gov.in/",
      allocatedBudget: "₹22,000 Crores ($2.6 Billion)",
      utilizedBudget: "₹18,500 Crores ($2.2 Billion)"
    },
    {
      id: "WAREHOUSE-ANDHRA PRADESH",
      name: "Agricultural Infrastructure Warehousing & Storage Subsidy",
      level: "State",
      type: "Infrastructure Support",
      description: "Andhra Pradesh Agricultural Infrastructure Fund providing capital subsidies and interest subvention for constructing localized cold storages and warehouses.",
      simpleExplanation: "Build your own crop warehouse or micro cold storage. The government offers a 3% interest discount on construction loans and covers up to 35% of the total cost.",
      eligibilityCriteria: {
        maxLandSizeHectares: 12.0,
        requiredDocuments: ["Approved Warehouse Blueprints", "Soil Suitability Certificate", "Bank Loan Approval"],
        otherConditions: "Must comply with national warehousing authority standardization codes.",
        incomeLimit: "No Limit",
        minAge: 18,
        socialCategory: "All Rural Entrepreneurs & Farmers",
        cropType: "Perishable & Storage-Based Crops"
      },
      financialBenefit: "3% annual interest subvention on capital loans up to $15,000 and 35% capital grants.",
      estimatedSubsidyFormula: (land) => Math.round(land * 1200),
      deadline: "2026-11-01",
      status: "Upcoming",
      penetrationPercentage: 38,
      successStory: {
        farmerName: "Arjan Dev",
        location: "Moga District",
        amountReceived: "$3,600",
        quote: "By building a cold storage shed under this scheme, we now store our potatoes for up to 4 months, selling when market prices peak."
      },
      category: "Infrastructure",
      state: "Andhra Pradesh",
      deadlineStatus: "Upcoming",
      ministry: "Department of Agriculture & Farmers Welfare, Andhra Pradesh",
      benefitsDetails: "35% credit-linked capital investment subsidy and 3% interest discount on development bank loans for rural storage hubs.",
      applicationUrl: "https://agriinfra.dac.gov.in/",
      allocatedBudget: "₹850 Crores ($102 Million)",
      utilizedBudget: "₹620 Crores ($74.5 Million)"
    },
    {
      id: "SOIL-HEALTH-CARD",
      name: "National Soil Health Card Scheme",
      level: "Central",
      type: "Free Diagnostics & Input Optimization",
      description: "Free soil nutrient testing and customized fertilizer advisory to optimize soil health, decrease chemical usage, and increase yield.",
      simpleExplanation: "Get your soil tested for free! Receive a Soil Health Card listing your field's exact nutrient levels (NPK, pH, Organic Carbon) with expert fertilizer recommendations.",
      eligibilityCriteria: {
        maxLandSizeHectares: 20.0,
        requiredDocuments: ["Aadhaar Card", "Land Possession Certificate", "Soil Sample Coordinates Ticket"],
        otherConditions: "Sufficient for any land owner or leaseholder.",
        incomeLimit: "No Limit",
        minAge: 18,
        socialCategory: "All Landholding & Tenant Farmers",
        cropType: "All Crops"
      },
      financialBenefit: "Free soil health report (valued at ₹1,500) and expert customized fertilizer dosage cards.",
      estimatedSubsidyFormula: (land) => 15,
      deadline: "2026-12-31",
      status: "Open",
      penetrationPercentage: 98,
      successStory: {
        farmerName: "Rajesh Patel",
        location: "Green Valley Farms, AP",
        amountReceived: "Free Soil Card",
        quote: "We received a free Soil Health Card and realized we were overusing Urea! Switching to customized inputs saved us ₹12,000 in fertilizer costs alone."
      },
      category: "Soil Testing & Diagnostics",
      state: "All States",
      deadlineStatus: "Active",
      ministry: "Ministry of Agriculture & Farmers Welfare",
      benefitsDetails: "Comprehensive analysis of 12 critical soil parameters including macro, micro, and physical soil metrics delivered in under 14 days.",
      applicationUrl: "https://soilhealth.dac.gov.in/",
      allocatedBudget: "₹250 Crores ($30 Million)",
      utilizedBudget: "₹210 Crores ($25 Million)"
    }
  ]);

  // Active Interactive Schemes State
  const [assistanceSchemeId, setAssistanceSchemeId] = useState<string>("PM-KISAN");
  const [isExplanationSimple, setIsExplanationSimple] = useState<boolean>(true);

  // Browse Schemes Search & Filter States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedState, setSelectedState] = useState<string>("All");
  const [selectedEligibility, setSelectedEligibility] = useState<string>("All");
  const [selectedDeadline, setSelectedDeadline] = useState<string>("All");

  // Active Applications with Historical Records included
  const [applications, setApplications] = useState<Application[]>([
    {
      id: "APP-509182",
      schemeId: "PM-KISAN",
      schemeName: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
      submittedDate: "2026-06-10",
      status: "Approved",
      progressPercent: 100,
      comments: "Direct transfer payout verified. Aadhaar biometric matching successful.",
      verifiedDocuments: [
        { name: "Aadhaar Card", status: "Verified" },
        { name: "Jamabandi Land Deed", status: "Verified" }
      ]
    },
    {
      id: "APP-402910",
      schemeId: "SUBSIDY-SOLAR",
      schemeName: "PM-KUSUM Off-Grid Solar Water Pump Subsidy",
      submittedDate: "2026-06-25",
      status: "Action Required",
      progressPercent: 65,
      comments: "Uploaded Land Registration Deed is blurry or incomplete. Please provide a clear scan.",
      verifiedDocuments: [
        { name: "Soil Water Availability Report", status: "Verified" },
        { name: "Land Ownership Deed", status: "Rejected" }
      ]
    },
    {
      id: "APP-102948",
      schemeId: "PMFBY",
      schemeName: "Pradhan Mantri Fasal Bima Yojana (PMFBY Crop Insurance)",
      submittedDate: "2025-07-12",
      status: "Disbursed",
      progressPercent: 100,
      comments: "Historical record: Completed disbursement for crop damages during unseasonal monsoon.",
      verifiedDocuments: [
        { name: "Sowing Certificate", status: "Verified" },
        { name: "Land map", status: "Verified" }
      ]
    },
    {
      id: "APP-284910",
      schemeId: "STATE-DRIP",
      schemeName: "Andhra Pradesh State Micro-Irrigation & Drip Incentive",
      submittedDate: "2026-06-01",
      status: "Rejected",
      progressPercent: 40,
      rejectionReason: "Supplied GPS-linked farm layout was missing proper block coordinates stamp.",
      comments: "Rejection notification received on 2026-06-15. Eligible for immediate AI-powered appeal.",
      verifiedDocuments: [
        { name: "GPS-linked farm layout", status: "Rejected" },
        { name: "Water Source Proof", status: "Verified" }
      ]
    }
  ]);

  // Appeal Letter State
  const [appealAppId, setAppealAppId] = useState<string | null>(null);
  const [generatedAppealLetter, setGeneratedAppealLetter] = useState<string>("");
  const [appealSent, setAppealSent] = useState<boolean>(false);

  // --- SUBMIT APPLICATION & FORM STATE ---
  const [activeApplyingScheme, setActiveApplyingScheme] = useState<Scheme | null>(null);
  const [appFormName, setAppFormName] = useState<string>("Amir Patel");
  const [appFormAadhaar, setAppFormAadhaar] = useState<string>("xxxx-xxxx-8012");
  const [appFormLandSize, setAppFormLandSize] = useState<number>(1.82);
  const [appFormCrop, setAppFormCrop] = useState<string>("Heirloom Basmati Rice");
  const [appFormIncome, setAppFormIncome] = useState<number>(260000);
  const [appFormBank, setAppFormBank] = useState<string>("State Bank of India");
  const [appFormAccount, setAppFormAccount] = useState<string>("xxxx-xxxx-1294");
  const [appFormIfsc, setAppFormIfsc] = useState<string>("PUNB002194");
  const [appFormSocialClass, setAppFormSocialClass] = useState<string>("Small & Marginal Farmers");
  const [appFormPhone, setAppFormPhone] = useState<string>("+91 98765 43210");
  const [appFormDistrict, setAppFormDistrict] = useState<string>("Vijayawada Block B");

  // Simulated Files
  const [fileAadhaar, setFileAadhaar] = useState<{ name: string; size: string } | null>(null);
  const [fileLandRecord, setFileLandRecord] = useState<{ name: string; size: string } | null>(null);
  const [fileBankPassbook, setFileBankPassbook] = useState<{ name: string; size: string } | null>(null);

  // Notifications Log
  interface NotificationLog {
    id: string;
    timestamp: string;
    type: "SMS" | "Email" | "System";
    recipient: string;
    title: string;
    message: string;
    isRead: boolean;
  }

  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>([
    {
      id: "NTF-SMS-401928",
      timestamp: "2026-06-25 14:21",
      type: "SMS",
      recipient: "+91 98765 43210",
      title: "Grievance Response Received",
      message: "Dear Amir Patel, your grievance ticket GRI-2041 status updated: Nodal Officer replied regarding PM-KISAN verification status.",
      isRead: true
    },
    {
      id: "NTF-EML-302918",
      timestamp: "2026-06-10 11:15",
      type: "Email",
      recipient: "amir.patel@apmail.in",
      title: "Scheme Approved: PM-KISAN",
      message: "Congratulations Amir Patel,\n\nYour biometric credentials and land record files match. Your application APP-509182 has been APPROVED and the direct financial payout verified.",
      isRead: true
    }
  ]);

  const [toastNotification, setToastNotification] = useState<{
    show: boolean;
    type: "emerald" | "amber" | "rose" | "blue";
    sms: string;
    email: string;
  } | null>(null);

  // Selected receipt application for overlay dialog display
  const [receiptApp, setReceiptApp] = useState<Application | null>(null);

  // Auto-Scan State
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [hasScanned, setHasScanned] = useState<boolean>(false);

  // Comparison Selected list
  const [compareSchemeIds, setCompareSchemeIds] = useState<string[]>(["PM-KISAN", "PMFBY"]);

  // --- AUTOMATED REGISTRATION AUTO-FILL STATE ---
  const [autofillAppId, setAutofillAppId] = useState<string | null>(null);
  const [isAutofilling, setIsAutofilling] = useState<boolean>(false);
  const [autofillForm, setAutofillForm] = useState<{
    farmerName: string;
    aadhaar: string;
    landSize: string;
    surveyNo: string;
    bankName: string;
    accountNo: string;
    ifsc: string;
  } | null>(null);

  // --- DOCUMENT VERIFICATION OCR STATES ---
  const [selectedDocType, setSelectedDocType] = useState<string>("Aadhaar Card");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<{
    status: "Verified" | "Rejected";
    confidence: number;
    extractedData: Record<string, string>;
    warnings: string[];
  } | null>(null);

  // --- COMPLAINTS AND GRIEVANCES ---
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: "GRI-2041",
      subject: "Delayed PM-KISAN 12th Installment Release",
      category: "Direct Income Support Delay",
      status: "In Progress",
      filedDate: "2026-06-15",
      lastUpdated: "2026-06-25",
      replies: [
        {
          author: "Amir Patel",
          message: "Disbursement status shows complete but funds have not cleared my State Bank of India ledger.",
          timestamp: "2026-06-15 09:30"
        },
        {
          author: "Nodal Officer (Vijayawada Hub)",
          message: "Aadhaar verification was pending. We have updated your biometric credentials. Please expect the credit clearance within 3 bank working days.",
          timestamp: "2026-06-25 14:20"
        }
      ]
    }
  ]);
  const [newGrievanceSubject, setNewGrievanceSubject] = useState("");
  const [newGrievanceCategory, setNewGrievanceCategory] = useState("Direct Income Support Delay");
  const [newGrievanceMsg, setNewGrievanceMsg] = useState("");

  // --- TAXES STATE ---
  const [taxAgriculturalRevenue, setTaxAgriculturalRevenue] = useState<number>(4800);
  const [taxNonAgriculturalRevenue, setTaxNonAgriculturalRevenue] = useState<number>(1200);
  const [taxInputDeductions, setTaxInputDeductions] = useState<number>(1850);

  // Computed active assistance scheme
  const activeAssistanceScheme = useMemo(() => {
    return schemes.find((s) => s.id === assistanceSchemeId) || schemes[0];
  }, [assistanceSchemeId, schemes]);

  // Compute best fit recommendation based on profile parameters
  const bestFitRecommendation = useMemo(() => {
    // Look for high match, high estimated subsidy, or fits the crop type
    if (calcIrrigationType !== "Micro-Drip Solar" && calcLandSize >= 1.0) {
      return {
        schemeId: "SUBSIDY-SOLAR",
        title: "PM-KUSUM Solar Water Pump Subsidy",
        reasons: [
          "Your land size is over 1.0 Hectare, making solar power highly cost-effective.",
          "Replacing traditional borehole diesel fuel pumps with solar saves up to $800 annually.",
          "You qualify for a whopping 60% direct state capital subsidy!"
        ]
      };
    } else if (calcCropCategory === "Cereals") {
      return {
        schemeId: "PM-KISAN",
        title: "PM-KISAN Direct Income Support",
        reasons: [
          "Your land size (under 2.0 hectares) fits the marginal landholder criteria perfectly.",
          "No risk or repayment obligation — 100% free cash transfer.",
          "Can be combined with organic certification programs."
        ]
      };
    }
    return {
      schemeId: "PMFBY",
      title: "PMFBY Crop Insurance",
      reasons: [
        "Perfect protection for variable seasonal crops.",
        "A premium cap of only 1.5% maximizes financial protection."
      ]
    };
  }, [calcLandSize, calcIrrigationType, calcCropCategory]);

  // Enhanced dynamic Eligibility score calculator
  const calculatedEligibility = useMemo(() => {
    return schemes.map((sch) => {
      let isEligible = true;
      const reasons: string[] = [];
      const missingDocs: string[] = [];
      const failedCriteria: string[] = [];
      let criteriaCount = 0;
      let criteriaMet = 0;

      // 1. Landholding size check
      criteriaCount++;
      if (calcLandSize <= sch.eligibilityCriteria.maxLandSizeHectares) {
        criteriaMet++;
        reasons.push(`✓ Land size ${calcLandSize} Ha is within limit (max ${sch.eligibilityCriteria.maxLandSizeHectares} Ha).`);
      } else {
        isEligible = false;
        failedCriteria.push("Land size limit exceeded");
        reasons.push(`❌ Land size ${calcLandSize} Ha exceeds maximum permitted of ${sch.eligibilityCriteria.maxLandSizeHectares} Ha.`);
      }

      // 2. Income Limit check
      const incLimitStr = sch.eligibilityCriteria.incomeLimit;
      if (incLimitStr && incLimitStr !== "No Limit") {
        criteriaCount++;
        const cleanLimit = parseInt(incLimitStr.replace(/[^0-9]/g, "")) || 0;
        if (cleanLimit > 0) {
          if (calcAnnualIncome <= cleanLimit) {
            criteriaMet++;
            reasons.push(`✓ Annual income (₹${calcAnnualIncome.toLocaleString()}) is below the limit (${incLimitStr}).`);
          } else {
            isEligible = false;
            failedCriteria.push("Income limit exceeded");
            reasons.push(`❌ Annual income (₹${calcAnnualIncome.toLocaleString()}) exceeds the limit of ${incLimitStr}.`);
          }
        } else {
          criteriaMet++;
          reasons.push("✓ Compliant with income criteria.");
        }
      } else {
        criteriaCount++;
        criteriaMet++;
        reasons.push("✓ No general income limit restrictions.");
      }

      // 3. Age Limit check
      if (sch.eligibilityCriteria.minAge) {
        criteriaCount++;
        if (calcAge >= sch.eligibilityCriteria.minAge) {
          criteriaMet++;
          reasons.push(`✓ Age (${calcAge} years) meets the minimum requirement of ${sch.eligibilityCriteria.minAge}+ years.`);
        } else {
          isEligible = false;
          failedCriteria.push("Age below minimum limit");
          reasons.push(`❌ Age ${calcAge} is below the minimum required of ${sch.eligibilityCriteria.minAge} years.`);
        }
      }

      // 4. Tax Exclusion Check
      if (sch.eligibilityCriteria.otherConditions && sch.eligibilityCriteria.otherConditions.toLowerCase().includes("tax")) {
        criteriaCount++;
        if (!calcTaxPayer) {
          criteriaMet++;
          reasons.push("✓ Compliant with tax exclusion rules (not an active income tax payer).");
        } else {
          isEligible = false;
          failedCriteria.push("Excluded due to tax payer status");
          reasons.push("❌ Excluded: Active professional income tax payers are ineligible.");
        }
      }

      // 5. Social Focus Check (soft match)
      const socCatLimit = sch.eligibilityCriteria.socialCategory;
      if (socCatLimit && !socCatLimit.includes("All")) {
        criteriaCount++;
        const fitsCategory = calcSocialCategory.toLowerCase().includes("marginal") && socCatLimit.toLowerCase().includes("marginal") ||
                             calcSocialCategory.toLowerCase().includes("small") && socCatLimit.toLowerCase().includes("small") ||
                             calcSocialCategory.toLowerCase().includes("sc/st") && socCatLimit.toLowerCase().includes("sc/st") ||
                             socCatLimit.toLowerCase().includes("active") ||
                             socCatLimit.toLowerCase().includes("registered") ||
                             socCatLimit.toLowerCase().includes("rural");
        if (fitsCategory) {
          criteriaMet++;
          reasons.push(`✓ Social Category (${calcSocialCategory}) aligns with scheme focus (${socCatLimit}).`);
        } else {
          reasons.push(`⚠️ Focus category is "${socCatLimit}"; your status is "${calcSocialCategory}". Alignment required.`);
        }
      }

      // 6. Documents Check
      sch.eligibilityCriteria.requiredDocuments.forEach((doc) => {
        const hasDoc = calcOwnedDocs.some(
          (d) => d.toLowerCase() === doc.toLowerCase() || d.toLowerCase().includes(doc.toLowerCase()) || doc.toLowerCase().includes(d.toLowerCase())
        );
        if (!hasDoc) {
          missingDocs.push(doc);
        }
      });

      const docsCount = sch.eligibilityCriteria.requiredDocuments.length;
      const docsPossessed = docsCount - missingDocs.length;
      const docPercentage = docsCount > 0 ? (docsPossessed / docsCount) : 1;

      const criteriaPercentage = criteriaCount > 0 ? (criteriaMet / criteriaCount) : 1;
      
      let finalScore = Math.round((criteriaPercentage * 60) + (docPercentage * 40));
      
      if (!isEligible) {
        finalScore = Math.min(45, finalScore);
      } else if (missingDocs.length > 0) {
        // Meets policy but missing documents
        finalScore = Math.min(75, finalScore);
      }

      // Specific booster conditions
      if (sch.id === "SUBSIDY-SOLAR") {
        if (calcIrrigationType === "Micro-Drip Solar") {
          finalScore = Math.min(100, finalScore + 10);
          reasons.push("✨ Priority match: Active solar drip conversions receive a +10% booster rating.");
        } else if (calcIrrigationType === "Rainfed") {
          finalScore = Math.max(0, finalScore - 15);
          reasons.push("⚠️ Recommendation: Rainfed farms must install water storage tanks for solar pump feasibility.");
        }
      }

      if (sch.id === "PMFBY" && calcCropCategory === "Horticulture") {
        finalScore = Math.min(100, finalScore + 5);
        reasons.push("✨ Optimal match: Horticulture crops receive enhanced regional multi-crop insurance parameters.");
      }

      return {
        id: sch.id,
        name: sch.name,
        level: sch.level,
        type: sch.type,
        score: finalScore,
        reasons,
        isEligible: isEligible && missingDocs.length === 0,
        criteriaMet: isEligible,
        failedCriteria,
        missingDocs,
        requiredDocs: sch.eligibilityCriteria.requiredDocuments,
        status: finalScore >= 75 ? "High Fit" : finalScore >= 45 ? "Moderate Match" : "Low Match"
      };
    });
  }, [
    calcLandSize,
    calcAnnualIncome,
    calcIrrigationType,
    calcTaxPayer,
    calcCropCategory,
    calcAge,
    calcSocialCategory,
    calcOwnedDocs,
    schemes
  ]);

  // Dynamic filtered schemes for Browse Schemes feature
  const filteredSchemes = useMemo(() => {
    return schemes.filter((sch) => {
      // 1. Search Query filter (name, description, simpleExplanation, keyword)
      const q = searchQuery.toLowerCase();
      if (q) {
        const nameMatch = sch.name.toLowerCase().includes(q);
        const descMatch = sch.description.toLowerCase().includes(q);
        const simpleMatch = sch.simpleExplanation.toLowerCase().includes(q);
        const idMatch = sch.id.toLowerCase().includes(q);
        const typeMatch = sch.type.toLowerCase().includes(q);
        if (!nameMatch && !descMatch && !simpleMatch && !idMatch && !typeMatch) {
          return false;
        }
      }

      // 2. Category filter
      if (selectedCategory !== "All" && sch.category !== selectedCategory) {
        return false;
      }

      // 3. State filter
      if (selectedState !== "All") {
        if (selectedState === "Central") {
          if (sch.level !== "Central") return false;
        } else {
          if (sch.state !== selectedState) return false;
        }
      }

      // 4. Eligibility filter
      if (selectedEligibility !== "All") {
        const matchInfo = calculatedEligibility.find((c) => c.id === sch.id);
        const isEligible = matchInfo ? matchInfo.score >= 55 : true;
        if (selectedEligibility === "Eligible" && !isEligible) return false;
        if (selectedEligibility === "Not Eligible" && isEligible) return false;
      }

      // 5. Deadline status filter
      if (selectedDeadline !== "All" && sch.deadlineStatus !== selectedDeadline) {
        return false;
      }

      return true;
    });
  }, [schemes, searchQuery, selectedCategory, selectedState, selectedEligibility, selectedDeadline, calculatedEligibility]);

  // Comparison Chart Data
  const schemeComparisonChartData = useMemo(() => {
    return [
      { name: "Direct Cash Payout (%)", "PM-KISAN": 100, "PMFBY Insurance": 10, "KCC Loan": 15, "PM-KUSUM Solar": 10, "Andhra Pradesh State Drip": 5 },
      { name: "Input Protection (%)", "PM-KISAN": 25, "PMFBY Insurance": 90, "KCC Loan": 80, "PM-KUSUM Solar": 100, "Andhra Pradesh State Drip": 100 },
      { name: "Success Rate (%)", "PM-KISAN": 98, "PMFBY Insurance": 75, "KCC Loan": 85, "PM-KUSUM Solar": 60, "Andhra Pradesh State Drip": 70 },
      { name: "Low-Debt Safety (%)", "PM-KISAN": 100, "PMFBY Insurance": 80, "KCC Loan": 30, "PM-KUSUM Solar": 85, "Andhra Pradesh State Drip": 90 }
    ];
  }, []);

  // Tax calculations
  const taxCalculations = useMemo(() => {
    const netAgriculturalIncome = Math.max(0, taxAgriculturalRevenue - taxInputDeductions);
    const taxableIncome = taxNonAgriculturalRevenue;
    let estimatedTax = 0;
    if (taxableIncome > 5000) {
      estimatedTax = (taxableIncome - 5000) * 0.1;
    }
    return {
      netAgriculturalIncome,
      taxableIncome,
      exemptionClaimed: netAgriculturalIncome,
      estimatedTax
    };
  }, [taxAgriculturalRevenue, taxNonAgriculturalRevenue, taxInputDeductions]);

  // Initial scanning logs generator
  const triggerAutoScan = () => {
    setIsScanning(true);
    setScanLogs([]);
    const logs = [
      "🔄 Initializing bilateral state-central scanning node...",
      "📡 Interfacing with Soil Health Board & GPS registry databases...",
      "📂 Fetching land registration certificates for Krishna District Block B...",
      "🔍 Resolving digital land deeds and Jamabandi registry hash codes...",
      "🤖 Parsing historical crop sowing calendars & pesticide reports...",
      "✨ AI Matching: 5 potential programs found. Estimating optimal matching profiles..."
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setScanLogs((prev) => [...prev, log]);
        if (index === logs.length - 1) {
          setIsScanning(false);
          setHasScanned(true);
        }
      }, (index + 1) * 600);
    });
  };

  // OCR Simulator
  const handleDocumentScan = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      if (selectedDocType === "Aadhaar Card") {
        setVerificationResult({
          status: "Verified",
          confidence: 99.1,
          extractedData: {
            "National UID": "xxxx-xxxx-8012",
            "Name Match Status": "Amir Patel (100% Match)",
            "Authentication Channel": "Biometric OTP Enabled"
          },
          warnings: ["Ensure active mobile linked matches Jamabandi registration files."]
        });
      } else if (selectedDocType === "Land Registration Records (Jamabandi)") {
        setVerificationResult({
          status: "Verified",
          confidence: 95.8,
          extractedData: {
            "Survey Block ID": "AMR-SEC4-B",
            "Certified Hectares": "1.82 Hectares",
            "Ledger Integrity Key": "JAM-2025-001928"
          },
          warnings: ["Needs latest digital sign-off from local Block Tehsildar."]
        });
      } else {
        setVerificationResult({
          status: "Rejected",
          confidence: 38.5,
          extractedData: {},
          warnings: ["Low image contrast detected.", "Official seal stamp is missing or altered."]
        });
      }
    }, 1200);
  };

  // Submit new application via Wizard submit
  const submitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeApplyingScheme) return;

    const newApp: Application = {
      id: `APP-${Math.floor(100000 + Math.random() * 900000)}`,
      schemeId: activeApplyingScheme.id,
      schemeName: activeApplyingScheme.name,
      submittedDate: new Date().toISOString().split("T")[0],
      status: "Under Review",
      progressPercent: 15,
      comments: "Application submitted successfully. Awaiting District Block biometric authentication.",
      verifiedDocuments: activeApplyingScheme.eligibilityCriteria.requiredDocuments.map((doc) => {
        let isUploaded = false;
        if (doc.toLowerCase().includes("aadhaar") && fileAadhaar) isUploaded = true;
        if ((doc.toLowerCase().includes("land") || doc.toLowerCase().includes("jamabandi") || doc.toLowerCase().includes("deed")) && fileLandRecord) isUploaded = true;
        if ((doc.toLowerCase().includes("bank") || doc.toLowerCase().includes("passbook") || doc.toLowerCase().includes("account")) && fileBankPassbook) isUploaded = true;
        return {
          name: doc,
          status: isUploaded ? "Verified" : "Pending"
        };
      })
    };

    setApplications((prev) => [newApp, ...prev]);

    // Send notifications
    const dateStr = new Date().toLocaleTimeString();
    const smsMsg = `Dear ${appFormName}, your application ${newApp.id} for "${newApp.schemeName}" was successfully SUBMITTED on ${newApp.submittedDate}. Track progress on your portal.`;
    const emailMsg = `Dear ${appFormName},\n\nWe have successfully received your electronic application for "${newApp.schemeName}" (Application Reference: ${newApp.id}).\n\nSubmission Date: ${newApp.submittedDate}\nStatus: SUBMITTED\n\nRequired files (Aadhaar, Land records, Bank statement) have been routed to the District Verification Board.\n\nRespectfully,\nDirect Benefit Registry, Andhra Pradesh & Central Portal`;

    const newSms: NotificationLog = {
      id: `NTF-SMS-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString().split("T")[0] + " " + dateStr.slice(0, 5),
      type: "SMS",
      recipient: appFormPhone,
      title: "Application Submitted Successfully",
      message: smsMsg,
      isRead: false
    };

    const newEmail: NotificationLog = {
      id: `NTF-EML-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString().split("T")[0] + " " + dateStr.slice(0, 5),
      type: "Email",
      recipient: "amir.patel@apmail.in",
      title: "Receipt Confirmation: Application Submitted",
      message: emailMsg,
      isRead: false
    };

    setNotificationLogs((prev) => [newSms, newEmail, ...prev]);
    setToastNotification({
      show: true,
      type: "blue",
      sms: smsMsg,
      email: `Email Subject: Submission Confirmed - ${newApp.id}`
    });

    setTimeout(() => {
      setToastNotification((prev) => (prev ? { ...prev, show: false } : null));
    }, 8000);

    setActiveApplyingScheme(null);
    setActiveSubTab("tracking");
  };

  // Submit new application
  const handleApplyNow = (schemeId: string) => {
    const sch = schemes.find((s) => s.id === schemeId);
    if (!sch) return;

    // Check if already applied
    const exists = applications.find(
      (a) => a.schemeId === schemeId && (a.status === "Under Review" || a.status === "Verified" || a.status === "Action Required")
    );
    if (exists) {
      alert(`An active application for "${sch.name}" is already pending. You can track its status in the Application Tracker.`);
      setActiveSubTab("tracking");
      return;
    }

    // Pre-populate fields from the farmer's profile
    setAppFormName(farmerProfile.name);
    setAppFormAadhaar(farmerProfile.aadhaar);
    setAppFormLandSize(farmerProfile.landSizeHectares);
    setAppFormCrop(farmerProfile.mainCrop);
    setAppFormIncome(farmerProfile.annualIncome);
    setAppFormBank("State Bank of India");
    setAppFormAccount("xxxx-xxxx-1294");
    setAppFormIfsc("PUNB002194");
    setAppFormSocialClass(farmerProfile.socialCategory);
    setAppFormPhone(farmerProfile.phone);
    setAppFormDistrict(farmerProfile.district);

    // Simulated pre-uploads from profile data for convenient testing
    setFileAadhaar({ name: "Aadhaar_Card_Verified.pdf", size: "142 KB" });
    setFileLandRecord({ name: "Jamabandi_Deed_Signed.pdf", size: "824 KB" });
    setFileBankPassbook({ name: "Bank_Passbook_Verified.pdf", size: "295 KB" });

    setActiveApplyingScheme(sch);
  };

  // Handle simulated file uploading
  const handleSimulateUpload = (type: "aadhaar" | "land" | "bank") => {
    const fileNames = {
      aadhaar: ["My_Aadhaar_Card.pdf", "Aadhaar_Biometrics_Final.pdf", "UID_Aadhaar_Scanned.pdf"],
      land: ["Jamabandi_Land_Deed_2026.pdf", "Survey_Block_AMR_Sec4.pdf", "Khasra_Deed_Official.pdf"],
      bank: ["Passbook_State_Bank.pdf", "Bank_Ledger_Certified.pdf", "Statement_Andhra Pradesh_Bank.pdf"]
    };
    const list = fileNames[type];
    const randomName = list[Math.floor(Math.random() * list.length)];
    const size = `${Math.floor(100 + Math.random() * 900)} KB`;

    if (type === "aadhaar") {
      setFileAadhaar(null);
      setTimeout(() => setFileAadhaar({ name: randomName, size }), 500);
    } else if (type === "land") {
      setFileLandRecord(null);
      setTimeout(() => setFileLandRecord({ name: randomName, size }), 500);
    } else if (type === "bank") {
      setFileBankPassbook(null);
      setTimeout(() => setFileBankPassbook({ name: randomName, size }), 500);
    }
  };

  // Trigger alert logs & notifications
  const triggerNotification = (appId: string, schemeName: string, oldStatus: string, newStatus: string) => {
    const dateStr = new Date().toLocaleTimeString();
    const smsMsg = `Dear Amir Patel, your application ${appId} for "${schemeName}" status has changed from ${oldStatus.toUpperCase()} to ${newStatus.toUpperCase()}.`;
    const emailMsg = `Dear Amir Patel,\n\nWe would like to notify you that your application (ID: ${appId}) for the "${schemeName}" program has changed status.\n\nPrevious Status: ${oldStatus.toUpperCase()}\nNew Status: ${newStatus.toUpperCase()}\n\nComments: ${
      newStatus === "Processing"
        ? "Biometric Aadhaar identity checked and cleared. Field land survey documents under active analysis."
        : newStatus === "Approved"
        ? "Direct transfer payout verified. Aadhaar biometric matching successful. Funds queued for transfer."
        : newStatus === "Rejected"
        ? "Sovereign audit rejected: GPS coordinates do not align with Jamabandi block survey deed records."
        : "Application logged in sovereign gateway pipeline."
    }\n\nYou can view details on your secure tracking portal.\n\nBest regards,\nDepartment of Agriculture, Direct Benefit Registry`;

    const newSms: NotificationLog = {
      id: `NTF-SMS-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString().split("T")[0] + " " + dateStr.slice(0, 5),
      type: "SMS",
      recipient: "+91 98765 43210",
      title: `Status Changed to ${newStatus}`,
      message: smsMsg,
      isRead: false
    };

    const newEmail: NotificationLog = {
      id: `NTF-EML-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString().split("T")[0] + " " + dateStr.slice(0, 5),
      type: "Email",
      recipient: "amir.patel@apmail.in",
      title: `Notification: ${newStatus} Update`,
      message: emailMsg,
      isRead: false
    };

    setNotificationLogs((prev) => [newSms, newEmail, ...prev]);

    setToastNotification({
      show: true,
      type: newStatus === "Rejected" ? "rose" : newStatus === "Approved" ? "emerald" : newStatus === "Processing" ? "amber" : "blue",
      sms: smsMsg,
      email: `Email Subject: Status Updated to ${newStatus} - ${appId}`
    });

    setTimeout(() => {
      setToastNotification((prev) => (prev ? { ...prev, show: false } : null));
    }, 8000);
  };

  // Real-time downloadable receipt (.txt file format)
  const downloadReceiptTxt = (app: Application) => {
    const textContent = `===========================================================
             SOVEREIGN UNION DIRECT BENEFIT REGISTRY
                       STATE OF ANDHRA PRADESH
===========================================================
APPLICATION RECEIPT & DIRECT PAYOUT ENROLLMENT
-----------------------------------------------------------
TRANSACTION REF  : ${app.id}
SCHEME NAME      : ${app.schemeName}
SUBMISSION DATE  : ${app.submittedDate}
CURRENT STATUS   : ${app.status.toUpperCase()}
PAYOUT TARGET    : STATE BANK OF INDIA (xxxx-xxxx-1294)
IFSC ROUTE CODE  : PUNB002194
-----------------------------------------------------------
ENROLLED APPLICANT DETAILS:
Name             : Amir Patel
Biometric ID     : xxxx-xxxx-8012
Deeded Land size : 1.82 Hectares
Block District   : Vijayawada Block B, Andhra Pradesh
-----------------------------------------------------------
DOCUMENT INTEGRITY CHECK:
${app.verifiedDocuments.map(doc => `* ${doc.name.padEnd(25)}: [${doc.status}]`).join('\n')}
-----------------------------------------------------------
GATEWAY COMMENTARY:
"${app.comments}"
-----------------------------------------------------------
This is an automated, cryptographically signed direct payout
receipt issued on behalf of the Central Portal Registry.
Digital Signature Match Key: JAM-2025-001928-APSEC4
===========================================================`;

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Receipt_${app.id}_${app.schemeId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Change Application Status manually (simulation panel)
  const changeAppStatus = (appId: string, newStatus: "Under Review" | "Verified" | "Approved" | "Rejected") => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;

        const oldStatus = app.status;
        let progressPercent = 15;
        let comments = "";

        if (newStatus === "Under Review") {
          progressPercent = 15;
          comments = "Application submitted successfully. Awaiting District Block biometric authentication.";
        } else if (newStatus === "Verified") {
          progressPercent = 50;
          comments = "Biometric Aadhaar identity checked and cleared. Field land survey documents under active analysis.";
        } else if (newStatus === "Approved") {
          progressPercent = 100;
          comments = "Direct transfer payout verified. Aadhaar biometric matching successful. Funds queued for transfer.";
        } else if (newStatus === "Rejected") {
          progressPercent = 100;
          comments = "Sovereign audit rejected: GPS coordinates do not align with Jamabandi block survey deed records.";
        }

        triggerNotification(app.id, app.schemeName, oldStatus, newStatus);

        return {
          ...app,
          status: newStatus,
          progressPercent,
          comments,
          rejectionReason: newStatus === "Rejected" ? "GPS coordinates misalignment" : undefined
        };
      })
    );
  };

  // Handle auto-fill process
  const triggerAutoFill = (schemeId: string) => {
    setIsAutofilling(true);
    setAutofillAppId(schemeId);

    setTimeout(() => {
      setIsAutofilling(false);
      setAutofillForm({
        farmerName: farmerProfile.name,
        aadhaar: farmerProfile.aadhaar,
        landSize: `${farmerProfile.landSizeHectares} Hectares`,
        surveyNo: "AMR-992-SEC4",
        bankName: "State Bank of India",
        accountNo: "xxxx-xxxx-1294",
        ifsc: "PUNB002194"
      });

      // Populate application wizard state too in case they want to open it
      setAppFormName(farmerProfile.name);
      setAppFormAadhaar(farmerProfile.aadhaar);
      setAppFormLandSize(farmerProfile.landSizeHectares);
      setAppFormCrop(farmerProfile.mainCrop);
      setAppFormIncome(farmerProfile.annualIncome);
    }, 1000);
  };

  // Draft Appeal letter for rejected/action required cases
  const generateAppealText = (app: Application) => {
    setAppealAppId(app.id);
    setAppealSent(false);
    const letter = `TO: The District Nodal Officer / Commissioner
Ministry of Agriculture, State of Andhra Pradesh

SUBJECT: Appeal for Review of Application ${app.id} (${app.schemeName})

Respected Sir/Madam,

I, ${farmerProfile.name}, holding registered agricultural land measuring ${farmerProfile.landSizeHectares} hectares at ${farmerProfile.district}, am filing this formal appeal regarding the current status of my application (${app.id}).

Reason for Appeal:
${app.status === "Rejected" ? `Resolution to Rejection: "${app.rejectionReason}". I have updated my coordinates stamp via state-approved GPS tools.` : `Resolution to Action Required item: "${app.comments}". I have uploaded high-contrast scanned files of my Jamabandi Deed.`}

I certify that I meet all marginal landholding limits under NPOP/Central guidelines, do not pay professional income taxes, and cultivate my fields actively. I kindly request a re-examination of my credentials to authorize the release of benefits.

Thank you.

Sincerely,
${farmerProfile.name}
Biometric Hash: SEC4-AMIR-2026-X8012`;

    setGeneratedAppealLetter(letter);
  };

  // Dispatch Grievance
  const handleFileComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGrievanceSubject.trim() || !newGrievanceMsg.trim()) return;

    const newGri: Complaint = {
      id: `GRI-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: newGrievanceSubject,
      category: newGrievanceCategory,
      status: "Pending Investigation",
      filedDate: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
      replies: [
        {
          author: "Amir Patel",
          message: newGrievanceMsg,
          timestamp: new Date().toLocaleTimeString()
        }
      ]
    };

    setComplaints((prev) => [newGri, ...prev]);
    setNewGrievanceSubject("");
    setNewGrievanceMsg("");
    alert(`✓ Grievance registered! Ticket ID: ${newGri.id} has been dispatched to Krishna District Nodal Head.`);
  };

  // Toggle schemes comparison checklist
  const toggleCompareScheme = (id: string) => {
    setCompareSchemeIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev; // Keep at least one
        return prev.filter((i) => i !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  return (
    <div id="ai-smart-subsidy-finder" className="bg-white rounded-2xl border border-slate-150 p-6 shadow-xs space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-50 border border-emerald-150 text-emerald-700 rounded-lg">
              <Sparkles className="h-5 w-5 text-emerald-600 animate-pulse" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
              🌟 AI-Powered Smart Subsidy Finder
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 font-bold tracking-wide uppercase">
            Auto-scan bilateral government schemes, verify eligibility scores, predict success, auto-fill forms, and manage appeals
          </p>
        </div>

        {/* Outer Tabs Selector */}
        <div className="flex flex-wrap items-center bg-slate-50 border p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveSubTab("eligibility")}
            className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
              activeSubTab === "eligibility"
                ? "bg-white text-emerald-700 shadow-xs border border-slate-100"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Subsidy Scanner
          </button>

          <button
            onClick={() => setActiveSubTab("compare")}
            className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
              activeSubTab === "compare"
                ? "bg-white text-emerald-700 shadow-xs border border-slate-100"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Scale className="h-3.5 w-3.5" />
            Comparison Matrix
          </button>

          <button
            onClick={() => setActiveSubTab("documents")}
            className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
              activeSubTab === "documents"
                ? "bg-white text-emerald-700 shadow-xs border border-slate-100"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            Document Checklist
          </button>

          <button
            onClick={() => setActiveSubTab("tracking")}
            className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
              activeSubTab === "tracking"
                ? "bg-white text-emerald-700 shadow-xs border border-slate-100"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            Application Tracker
          </button>

          <button
            onClick={() => setActiveSubTab("itr")}
            className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
              activeSubTab === "itr"
                ? "bg-white text-emerald-700 shadow-xs border border-slate-100"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <DollarSign className="h-3.5 w-3.5" />
            ITR Assistance
          </button>

          <button
            onClick={() => setActiveSubTab("complaints")}
            className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
              activeSubTab === "complaints"
                ? "bg-white text-emerald-700 shadow-xs border border-slate-100"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Escalation Desk
          </button>

          <button
            onClick={() => setActiveSubTab("disaster_aid")}
            className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
              activeSubTab === "disaster_aid"
                ? "bg-white text-red-700 shadow-xs border border-slate-100 border-b-red-200"
                : "text-slate-500 hover:text-slate-850"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
            Emergency Aid Desk
          </button>
        </div>
      </div>

      {/* BEST FIT RECOMMENDATION BANNER */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 rounded-2xl border border-emerald-950 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-6 opacity-10 pointer-events-none">
          <Award className="h-44 w-44" />
        </div>

        <div className="space-y-1.5 relative z-10">
          <span className="text-[9px] font-black uppercase text-emerald-300 tracking-widest bg-emerald-950/55 px-2.5 py-1 rounded-full border border-emerald-700/40 inline-flex items-center gap-1">
            <Award className="h-3 w-3" /> Best-Fit AI Recommendation
          </span>
          <h4 className="text-base font-black text-slate-50">
            Highly Endorsed: {bestFitRecommendation.title}
          </h4>
          <div className="space-y-1 text-xs text-emerald-100/90 font-medium">
            {bestFitRecommendation.reasons.map((r, i) => (
              <p key={i} className="flex items-start gap-1">
                <span className="text-emerald-300 shrink-0 mt-0.5">•</span>
                <span>{r}</span>
              </p>
            ))}
          </div>
        </div>

        <div className="shrink-0 space-y-2 text-right relative z-10 w-full md:w-auto">
          <div className="bg-emerald-950/60 border border-emerald-700/50 p-3 rounded-xl inline-block text-center w-full md:w-auto">
            <span className="text-emerald-300 text-[9px] font-black tracking-wider uppercase block">
              Estimated Subsidy Amount
            </span>
            <span className="text-xl text-yellow-300 font-black">
              ${schemes.find((s) => s.id === bestFitRecommendation.schemeId)?.estimatedSubsidyFormula(calcLandSize) || 120} Payout
            </span>
          </div>
          <button
            onClick={() => setAssistanceSchemeId(bestFitRecommendation.schemeId)}
            className="w-full bg-white text-emerald-900 hover:bg-emerald-50 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
          >
            View Scheme Details <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* DEADLINE ALERTS AND CRITICAL NOTICES ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-150 rounded-xl p-4 flex gap-3">
          <div className="h-9 w-9 rounded-full bg-red-100 border border-red-200 flex items-center justify-center shrink-0">
            <Bell className="h-4.5 w-4.5 text-red-600 animate-bounce" />
          </div>
          <div className="space-y-0.5 text-xs">
            <span className="text-red-700 font-black block">URGENT: PMFBY Crop Insurance</span>
            <span className="text-red-500 font-bold block text-[10.5px]">Deadline: 15 July 2026</span>
            <p className="text-slate-500 text-[10px] font-medium pt-0.5">
              Only 16 days remaining. Clear the Sowing Certificate checklist to lock in Kharif safety.
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-150 rounded-xl p-4 flex gap-3">
          <div className="h-9 w-9 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
            <Clock className="h-4.5 w-4.5 text-amber-600" />
          </div>
          <div className="space-y-0.5 text-xs">
            <span className="text-amber-700 font-black block">CLOSING SOON: Solar Pump Support</span>
            <span className="text-amber-500 font-bold block text-[10.5px]">Deadline: 20 July 2026</span>
            <p className="text-slate-500 text-[10px] font-medium pt-0.5">
              PM-KUSUM capital grant submission requires verified Jamabandi files. Low-tier queue available.
            </p>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-150 rounded-xl p-4 flex gap-3">
          <div className="h-9 w-9 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
            <Award className="h-4.5 w-4.5 text-emerald-600" />
          </div>
          <div className="space-y-0.5 text-xs">
            <span className="text-emerald-700 font-black block">STABILITY REPORT</span>
            <span className="text-emerald-600 font-bold block text-[10.5px]">Direct Income Transfers Active</span>
            <p className="text-slate-500 text-[10px] font-medium pt-0.5">
              PM-KISAN direct payments are fully budgeted. Next quad-monthly transfer scheduled for August.
            </p>
          </div>
        </div>
      </div>

      {/* MAIN VIEWPORT BODY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ACTIVE SCHEME DIRECTORY SCANNER (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            
            {/* Auto-scanner interface */}
            <div className="flex justify-between items-center border-b pb-3.5">
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1">
                  <Search className="h-4 w-4 text-emerald-600" /> Browse & Scan Schemes
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold">
                  Search & filter 10 major Central and Andhra Pradesh State schemes.
                </p>
              </div>

              <button
                onClick={triggerAutoScan}
                disabled={isScanning}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white text-xs font-black rounded-lg cursor-pointer transition-all flex items-center gap-1.5 shrink-0"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Scanning...
                  </>
                ) : (
                  "Scan Now"
                )}
              </button>
            </div>

            {/* Scanning active state logs */}
            {isScanning && (
              <div className="bg-slate-900 text-slate-300 font-mono text-[10px] p-4 rounded-xl border border-slate-800 space-y-1.5 animate-fadeIn">
                {scanLogs.map((log, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {log}
                  </p>
                ))}
                <div className="flex justify-start items-center gap-1 pt-1.5 text-emerald-400">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Parsing sovereign ledger records...</span>
                </div>
              </div>
            )}

            {/* Search and Filters Section */}
            <div className="space-y-3.5 border-b pb-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search scheme name, keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Category selector chips */}
              <div className="space-y-1">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">
                  Category Filter
                </label>
                <div className="flex flex-wrap gap-1">
                  {["All", "Income Support", "Subsidies", "Insurance", "Education", "Infrastructure"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2 py-1 rounded-lg text-[9.5px] font-bold transition-all cursor-pointer border ${
                        selectedCategory === cat
                          ? "bg-emerald-600 border-emerald-600 text-white font-black"
                          : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Three-column micro-filters */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[8.5px] font-black text-slate-400 uppercase tracking-wider mb-1">
                    State / Level
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[10px] font-bold text-slate-700 focus:outline-none"
                  >
                    <option value="All">All Regions</option>
                    <option value="Central">Central Govt</option>
                    <option value="Andhra Pradesh">Andhra Pradesh State</option>
                    <option value="Haryana">Haryana State</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[8.5px] font-black text-slate-400 uppercase tracking-wider mb-1">
                    Your Eligibility
                  </label>
                  <select
                    value={selectedEligibility}
                    onChange={(e) => setSelectedEligibility(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[10px] font-bold text-slate-700 focus:outline-none"
                  >
                    <option value="All">All Scores</option>
                    <option value="Eligible">Eligible (Score &ge; 55)</option>
                    <option value="Not Eligible">Ineligible (Score &lt; 55)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[8.5px] font-black text-slate-400 uppercase tracking-wider mb-1">
                    Deadline status
                  </label>
                  <select
                    value={selectedDeadline}
                    onChange={(e) => setSelectedDeadline(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[10px] font-bold text-slate-700 focus:outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Open / Active</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>

              {/* Reset Filters Option if any filter is set */}
              {(searchQuery || selectedCategory !== "All" || selectedState !== "All" || selectedEligibility !== "All" || selectedDeadline !== "All") && (
                <div className="flex justify-between items-center text-[10px] pt-1">
                  <span className="text-slate-400 font-bold">
                    Found {filteredSchemes.length} matching {filteredSchemes.length === 1 ? "scheme" : "schemes"}
                  </span>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                      setSelectedState("All");
                      setSelectedEligibility("All");
                      setSelectedDeadline("All");
                    }}
                    className="text-emerald-600 hover:text-emerald-800 font-extrabold cursor-pointer"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

            {/* Schemes List */}
            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {filteredSchemes.length > 0 ? (
                filteredSchemes.map((sch) => {
                  const isSelected = sch.id === assistanceSchemeId;
                  const matchInfo = calculatedEligibility.find((c) => c.id === sch.id);
                  const isEligible = matchInfo ? matchInfo.score >= 55 : true;
                  return (
                    <div
                      key={sch.id}
                      onClick={() => setAssistanceSchemeId(sch.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer relative space-y-3 hover:shadow-xs ${
                        isSelected
                          ? "border-emerald-600 bg-white ring-2 ring-emerald-600/10"
                          : "border-slate-150 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest block">
                            {sch.level} Level • {sch.category}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 pr-4 leading-snug">{sch.name}</h4>
                        </div>
                        <span
                          className={`text-[8.5px] font-black px-1.5 py-0.5 rounded uppercase shrink-0 ${
                            sch.status === "Open"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : sch.status === "Closing Soon"
                              ? "bg-amber-50 text-amber-700 border border-amber-250"
                              : sch.status === "Upcoming"
                              ? "bg-blue-50 text-blue-700 border border-blue-100"
                              : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}
                        >
                          {sch.status}
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-600 line-clamp-2 leading-relaxed">
                        {isExplanationSimple ? sch.simpleExplanation : sch.description}
                      </p>

                      {/* Progress score indicators */}
                      <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[9.5px]">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400 font-bold">Match Probability:</span>
                          <span
                            className={`font-black ${
                              (matchInfo?.score || 0) >= 75
                                ? "text-emerald-600"
                                : (matchInfo?.score || 0) >= 45
                                ? "text-amber-600"
                                : "text-rose-600"
                            }`}
                          >
                            {matchInfo?.score || 90}%
                          </span>
                          <span
                            className={`text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase ${
                              isEligible
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : "bg-rose-50 text-rose-700 border border-rose-100"
                            }`}
                          >
                            {isEligible ? "Eligible" : "Not Eligible"}
                          </span>
                        </div>
                        <span className="text-slate-700 font-black shrink-0">
                          Est: ${sch.estimatedSubsidyFormula(calcLandSize)}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center bg-white border border-dashed rounded-xl space-y-2">
                  <Sliders className="h-7 w-7 text-slate-300 mx-auto" />
                  <p className="text-xs font-black text-slate-600 font-sans">No matching schemes</p>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                    No schemes matched your search or selected filters. Try broadening your criteria.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                      setSelectedState("All");
                      setSelectedEligibility("All");
                      setSelectedDeadline("All");
                    }}
                    className="px-3 py-1 bg-emerald-50 border border-emerald-150 text-emerald-700 text-[10px] font-black rounded-lg hover:bg-emerald-100 cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: WORKSPACE FOR INTERACTIVE SUBTABS (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* TAB 1: SUBSIDY DETAIL & PROBABILITY ADVISOR */}
          {activeSubTab === "eligibility" && (
            <div className="space-y-4">
              
              {/* Sovereign Eligibility Checker Dashboard */}
              <div className="bg-slate-50 border rounded-2xl p-5 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b pb-3.5">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders className="h-4.5 w-4.5 text-emerald-600" />
                      Statutory Eligibility Checker
                    </h4>
                    <span className="text-[9.5px] text-slate-400 font-bold block">
                      Verify program compliance using official biometrics or simulate manual criteria
                    </span>
                  </div>

                  {/* Mode Toggles */}
                  <div className="flex bg-slate-200/80 p-0.5 rounded-lg border text-[9.5px] font-black shrink-0 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setEligibilityCheckMode("auto")}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        eligibilityCheckMode === "auto"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      Auto-Check (Profile)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEligibilityCheckMode("manual")}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        eligibilityCheckMode === "manual"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      Manual Check
                    </button>
                  </div>
                </div>

                {eligibilityCheckMode === "auto" ? (
                  /* Auto-Check Mode Display */
                  <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-3.5 space-y-3">
                    <div className="flex justify-between items-center text-[9px] border-b border-emerald-100/50 pb-2">
                      <span className="text-emerald-800 font-extrabold flex items-center gap-1">
                        <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
                        Linked Profile: {farmerProfile.name}
                      </span>
                      <span className="text-slate-400 font-bold uppercase">Biometric ID: {farmerProfile.aadhaar}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5 text-[10.5px] font-bold text-slate-600">
                      <div>
                        <span className="text-[8px] text-slate-400 block uppercase font-black">Cultivated Land</span>
                        <span className="text-slate-800 font-extrabold">{farmerProfile.landSizeHectares} Hectares</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-400 block uppercase font-black">Annual Revenue (INR)</span>
                        <span className="text-slate-800 font-extrabold">₹{farmerProfile.annualIncome.toLocaleString()} / Year</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-400 block uppercase font-black">Farmer Social Class</span>
                        <span className="text-slate-800 font-extrabold">{farmerProfile.socialCategory}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-400 block uppercase font-black">Active Age Check</span>
                        <span className="text-slate-800 font-extrabold">{farmerProfile.age} Years Old</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Manual Check Mode Parameter Inputs */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                    <div>
                      <label className="block text-[9.5px] font-black text-slate-400 uppercase mb-1">
                        Cultivated Land Size (Hectares)
                      </label>
                      <input
                        type="number"
                        step="0.05"
                        min="0"
                        value={calcLandSize}
                        onChange={(e) => setCalcLandSize(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border rounded-xl px-3 py-2 text-xs font-extrabold text-slate-700 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[9.5px] font-black text-slate-400 uppercase mb-1">
                        Annual Farm Income (₹ INR)
                      </label>
                      <input
                        type="number"
                        step="5000"
                        min="0"
                        value={calcAnnualIncome}
                        onChange={(e) => setCalcAnnualIncome(parseInt(e.target.value) || 0)}
                        className="w-full bg-white border rounded-xl px-3 py-2 text-xs font-extrabold text-slate-700 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[9.5px] font-black text-slate-400 uppercase mb-1">
                        Farmer Age (Years)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={calcAge}
                        onChange={(e) => setCalcAge(parseInt(e.target.value) || 0)}
                        className="w-full bg-white border rounded-xl px-3 py-2 text-xs font-extrabold text-slate-700 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[9.5px] font-black text-slate-400 uppercase mb-1">
                        Social Focus Category
                      </label>
                      <select
                        value={calcSocialCategory}
                        onChange={(e) => setCalcSocialCategory(e.target.value)}
                        className="w-full bg-white border rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="Small & Marginal Farmers">Small & Marginal Farmers</option>
                        <option value="Marginal Farmers">Marginal Farmers</option>
                        <option value="SC/ST Farmers">SC/ST Farmers</option>
                        <option value="All Active Cultivators">All Active Cultivators</option>
                        <option value="General Category">General (Other) Farmers</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9.5px] font-black text-slate-400 uppercase mb-1">
                        Main Irrigation Type
                      </label>
                      <select
                        value={calcIrrigationType}
                        onChange={(e) => setCalcIrrigationType(e.target.value as any)}
                        className="w-full bg-white border rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="Rainfed">Rainfed (Dryland)</option>
                        <option value="Canal/Borewell">Canal / Traditional Borewells</option>
                        <option value="Micro-Drip Solar">Micro-Drip Sprinklers (Solar powered)</option>
                      </select>
                    </div>

                    <div className="flex flex-col justify-end">
                      <label className="flex items-center gap-2 bg-white border rounded-xl p-2 cursor-pointer text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                        <input
                          type="checkbox"
                          checked={calcTaxPayer}
                          onChange={(e) => setCalcTaxPayer(e.target.checked)}
                          className="accent-emerald-600 h-4 w-4 cursor-pointer"
                        />
                        Professional Income Tax Payer
                      </label>
                    </div>
                  </div>
                )}

                {/* Interactive Documents Possession Checklist */}
                <div className="border-t pt-3.5 space-y-2">
                  <div className="flex justify-between items-center text-[9.5px]">
                    <span className="font-black text-slate-500 uppercase tracking-wider block">
                      Required Documents Possession Checklist
                    </span>
                    <span className="text-emerald-700 font-extrabold text-[8.5px] bg-emerald-50 border border-emerald-150 px-1.5 py-0.2 rounded">
                      Toggle to simulate real-time uploads
                    </span>
                  </div>

                  <div className="p-3 bg-white border rounded-xl space-y-2 text-[10.5px]">
                    <span className="text-[8px] text-slate-400 block uppercase font-black mb-1">
                      Documents demanded by {activeAssistanceScheme.id}:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeAssistanceScheme.eligibilityCriteria.requiredDocuments.map((doc) => {
                        const hasDoc = calcOwnedDocs.includes(doc);
                        return (
                          <label
                            key={doc}
                            className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-all ${
                              hasDoc ? "bg-emerald-50/50 border-emerald-200 text-emerald-900 font-extrabold" : "bg-slate-50/50 border-slate-200 text-slate-500 font-medium"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={hasDoc}
                              onChange={() => {
                                if (hasDoc) {
                                  setCalcOwnedDocs(prev => prev.filter(d => d !== doc));
                                } else {
                                  setCalcOwnedDocs(prev => [...prev, doc]);
                                }
                              }}
                              className="accent-emerald-600 h-3.5 w-3.5 cursor-pointer shrink-0"
                            />
                            <span className="truncate">{doc}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Specific Selected Scheme Detail */}
              {activeApplyingScheme ? (
                /* --- INTERACTIVE SCHEME APPLICATION WIZARD --- */
                <form onSubmit={submitApplication} className="bg-white border-2 border-emerald-600 rounded-2xl p-6 space-y-5 animate-scaleUp shadow-lg">
                  <div className="border-b pb-3 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-150 uppercase tracking-wider block w-fit mb-1">
                        Sovereign Portal Application Wizard
                      </span>
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        Applying For: {activeApplyingScheme.name}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveApplyingScheme(null)}
                      className="text-slate-400 hover:text-slate-600 font-extrabold text-sm"
                    >
                      × Cancel Draft
                    </button>
                  </div>

                  <p className="text-[10.5px] text-slate-500 font-medium leading-relaxed bg-emerald-50/30 border border-emerald-100 p-3 rounded-xl">
                     🚀 <span className="font-extrabold text-emerald-800">Biometric Auto-Fill Confirmed:</span> The application fields below have been automatically synchronized with your official biometric farmer card credentials. Review, adjust, or upload missing files to proceed.
                  </p>

                  <div className="space-y-4 text-xs font-semibold text-slate-700">
                    
                    {/* SECTION 1: Identification & Profile */}
                    <div className="space-y-3">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block border-b pb-1">
                        1. Biometric Identification
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9.5px] font-bold text-slate-400 mb-1">Applicant Name</label>
                          <input
                            type="text"
                            value={appFormName}
                            onChange={(e) => setAppFormName(e.target.value)}
                            className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[9.5px] font-bold text-slate-400 mb-1">Phone Number (Alerts channel)</label>
                          <input
                            type="text"
                            value={appFormPhone}
                            onChange={(e) => setAppFormPhone(e.target.value)}
                            className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[9.5px] font-bold text-slate-400 mb-1">Aadhaar National UID</label>
                          <input
                            type="text"
                            value={appFormAadhaar}
                            onChange={(e) => setAppFormAadhaar(e.target.value)}
                            className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[9.5px] font-bold text-slate-400 mb-1">Social Category</label>
                          <input
                            type="text"
                            value={appFormSocialClass}
                            onChange={(e) => setAppFormSocialClass(e.target.value)}
                            className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: Land & Cultivation details */}
                    <div className="space-y-3 pt-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block border-b pb-1">
                        2. Agricultural Asset Details
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[9.5px] font-bold text-slate-400 mb-1">Deeded Hectares</label>
                          <input
                            type="number"
                            step="0.01"
                            value={appFormLandSize}
                            onChange={(e) => setAppFormLandSize(parseFloat(e.target.value) || 0)}
                            className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[9.5px] font-bold text-slate-400 mb-1">Main Crop Cultivated</label>
                          <input
                            type="text"
                            value={appFormCrop}
                            onChange={(e) => setAppFormCrop(e.target.value)}
                            className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[9.5px] font-bold text-slate-400 mb-1">Annual Revenue (₹)</label>
                          <input
                            type="number"
                            value={appFormIncome}
                            onChange={(e) => setAppFormIncome(parseInt(e.target.value) || 0)}
                            className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 3: Banking disbursement details */}
                    <div className="space-y-3 pt-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block border-b pb-1">
                        3. Direct Benefit Disbursement Channel
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[9.5px] font-bold text-slate-400 mb-1">Bank Name</label>
                          <input
                            type="text"
                            value={appFormBank}
                            onChange={(e) => setAppFormBank(e.target.value)}
                            className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[9.5px] font-bold text-slate-400 mb-1">Account Number</label>
                          <input
                            type="text"
                            value={appFormAccount}
                            onChange={(e) => setAppFormAccount(e.target.value)}
                            className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[9.5px] font-bold text-slate-400 mb-1">IFSC Routing Code</label>
                          <input
                            type="text"
                            value={appFormIfsc}
                            onChange={(e) => setAppFormIfsc(e.target.value)}
                            className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 4: Required files upload slots */}
                    <div className="space-y-3 pt-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block border-b pb-1">
                        4. Mandatory Document Attachments
                      </span>
                      
                      <div className="space-y-2.5">
                        {/* Aadhaar card slot */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl gap-2">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-extrabold text-slate-800 block">Aadhaar Card Copy</span>
                            <p className="text-[9px] text-slate-400">PDF copy for identity and biometric matching audit.</p>
                          </div>
                          {fileAadhaar ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-150 px-2 py-1 rounded font-black flex items-center gap-1 shrink-0">
                                <Check className="h-3 w-3" /> {fileAadhaar.name} ({fileAadhaar.size})
                              </span>
                              <button
                                type="button"
                                onClick={() => setFileAadhaar(null)}
                                className="text-[10px] text-rose-600 hover:text-rose-800 font-extrabold cursor-pointer shrink-0"
                              >
                                Delete
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSimulateUpload("aadhaar")}
                              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-extrabold border border-emerald-150 rounded-lg cursor-pointer shrink-0"
                            >
                              Browse & Upload File
                            </button>
                          )}
                        </div>

                        {/* Land Record deed slot */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl gap-2">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-extrabold text-slate-800 block">Land Deed (Jamabandi Records)</span>
                            <p className="text-[9px] text-slate-400">Official certified survey map and land block registration registry.</p>
                          </div>
                          {fileLandRecord ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-150 px-2 py-1 rounded font-black flex items-center gap-1 shrink-0">
                                <Check className="h-3 w-3" /> {fileLandRecord.name} ({fileLandRecord.size})
                              </span>
                              <button
                                type="button"
                                onClick={() => setFileLandRecord(null)}
                                className="text-[10px] text-rose-600 hover:text-rose-800 font-extrabold cursor-pointer shrink-0"
                              >
                                Delete
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSimulateUpload("land")}
                              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-extrabold border border-emerald-150 rounded-lg cursor-pointer shrink-0"
                            >
                              Browse & Upload File
                            </button>
                          )}
                        </div>

                        {/* Bank Passbook pass check */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl gap-2">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-extrabold text-slate-800 block">Bank Account Passbook / Statement</span>
                            <p className="text-[9px] text-slate-400">Front page passbook scan with clear IFSC routing layout.</p>
                          </div>
                          {fileBankPassbook ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-150 px-2 py-1 rounded font-black flex items-center gap-1 shrink-0">
                                <Check className="h-3 w-3" /> {fileBankPassbook.name} ({fileBankPassbook.size})
                              </span>
                              <button
                                type="button"
                                onClick={() => setFileBankPassbook(null)}
                                className="text-[10px] text-rose-600 hover:text-rose-800 font-extrabold cursor-pointer shrink-0"
                              >
                                Delete
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSimulateUpload("bank")}
                              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-extrabold border border-emerald-150 rounded-lg cursor-pointer shrink-0"
                            >
                              Browse & Upload File
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submission and Confirmation actions */}
                  <div className="border-t pt-4 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                    <span className="text-[9px] text-slate-400 font-bold max-w-xs leading-normal">
                      By submitting, you certify that the auto-filled credentials align with Andhra Pradesh direct benefit transfer policies.
                    </span>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setActiveApplyingScheme(null)}
                        className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase rounded-xl cursor-pointer"
                      >
                        Cancel Draft
                      </button>
                      <button
                        type="submit"
                        className="flex-1 sm:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase rounded-xl cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                      >
                        <UserCheck className="h-4 w-4" /> Confirm & Submit Application
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                /* Specific Selected Scheme Detail */
                <div className="bg-white border rounded-2xl p-5 space-y-4">
                  
                  {/* Jargon Toggle */}
                  <div className="flex justify-between items-center border-b pb-3">
                    <div className="space-y-0.5">
                      <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest block">
                        Active Workspace Portfolio
                      </span>
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        {activeAssistanceScheme.id} Program Details & Advice
                      </h3>
                    </div>

                    <div className="flex bg-slate-100 border p-1 rounded-lg gap-1 shrink-0 text-[10px] font-black">
                      <button
                        onClick={() => setIsExplanationSimple(true)}
                        className={`px-2 py-1 rounded cursor-pointer transition-all ${
                          isExplanationSimple ? "bg-white text-slate-800 shadow-xs" : "text-slate-500"
                        }`}
                      >
                        Simple Terms
                      </button>
                      <button
                        onClick={() => setIsExplanationSimple(false)}
                        className={`px-2 py-1 rounded cursor-pointer transition-all ${
                          !isExplanationSimple ? "bg-white text-slate-800 shadow-xs" : "text-slate-500"
                        }`}
                      >
                        Gazette Jargon
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 border rounded-xl space-y-2.5">
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-slate-200 text-slate-800 rounded border border-slate-300">
                          {activeAssistanceScheme.category}
                        </span>
                        <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-250">
                          {activeAssistanceScheme.level} Level
                        </span>
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-900">
                        {activeAssistanceScheme.name}
                      </h4>
                      {activeAssistanceScheme.ministry && (
                        <p className="text-[10px] font-bold text-slate-500">
                          🏛️ Ministry: <span className="text-slate-700 font-extrabold">{activeAssistanceScheme.ministry}</span>
                        </p>
                      )}
                      <p className="text-xs font-medium text-slate-600 leading-relaxed font-serif italic border-t pt-2 mt-1">
                        &ldquo;
                        {isExplanationSimple
                          ? activeAssistanceScheme.simpleExplanation
                          : activeAssistanceScheme.description}
                        &rdquo;
                      </p>
                    </div>

                    {/* Dynamic Eligibility Advisory Hub Output */}
                    {(() => {
                      const result = calculatedEligibility.find(e => e.id === activeAssistanceScheme.id);
                      if (!result) return null;

                      const scoreColorClass = result.score >= 75
                        ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                        : result.score >= 45
                        ? "text-amber-700 bg-amber-50 border-amber-200"
                        : "text-rose-700 bg-rose-50 border-rose-200";

                      const scoreBarColorClass = result.score >= 75
                        ? "bg-emerald-500"
                        : result.score >= 45
                        ? "bg-amber-500"
                        : "bg-rose-500";

                      return (
                        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white space-y-3 p-4">
                          <div className="flex justify-between items-center border-b pb-2.5">
                            <div>
                              <span className="text-[8px] text-slate-400 block uppercase font-black">
                                Real-Time Advisory Status
                              </span>
                              <span className="text-[11px] font-black uppercase tracking-wider">
                                Compliance Verification
                              </span>
                            </div>
                            
                            {/* Eligibility Status Pill */}
                            <div className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${scoreColorClass}`}>
                              {result.score >= 75 ? (
                                <span className="flex items-center gap-1">✓ Eligible</span>
                              ) : result.score >= 45 ? (
                                <span className="flex items-center gap-1">⚠️ Missing requirements</span>
                              ) : (
                                <span className="flex items-center gap-1">❌ Not Eligible</span>
                              )}
                            </div>
                          </div>

                          {/* Eligibility Score Progress bar */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-[10px] font-black text-slate-600">
                              <span>Compliance Suitability Score</span>
                              <span className="text-xs">{result.score}%</span>
                            </div>
                            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-500 rounded-full ${scoreBarColorClass}`}
                                style={{ width: `${result.score}%` }}
                              />
                            </div>
                          </div>

                          {/* Statutory Verification Logs */}
                          <div className="space-y-1 pt-1.5">
                            <span className="text-[8.5px] text-slate-400 uppercase font-black block mb-2">
                              Statutory Verification Logs:
                            </span>
                            <div className="space-y-1.5">
                              {result.reasons.map((reason, idx) => (
                                <div key={idx} className="flex gap-2 text-[10px] leading-relaxed font-semibold text-slate-700">
                                  <span className="shrink-0">{reason.startsWith("✓") || reason.startsWith("✨") ? "🟢" : reason.startsWith("❌") ? "🔴" : "🟡"}</span>
                                  <span>{reason}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Missing Requirements Alert Panel */}
                          {(result.missingDocs.length > 0 || result.failedCriteria.length > 0) ? (
                            <div className="mt-3 p-3 bg-rose-50 border border-rose-150 rounded-xl space-y-2 text-[10px] font-bold text-rose-950">
                              <span className="text-rose-800 block uppercase font-black tracking-wider text-[8px]">
                                ⚠️ Action Needed: Missing Statutory Requirements
                              </span>
                              
                              {result.failedCriteria.length > 0 && (
                                <div className="space-y-1">
                                  <span className="text-slate-400 block text-[8px] uppercase font-black">Policy Violations:</span>
                                  {result.failedCriteria.map((fail, idx) => (
                                    <p key={idx} className="flex items-center gap-1 pl-1 text-rose-700">
                                      • {fail} (Adjust simulated variables or profile values to qualify)
                                    </p>
                                  ))}
                                </div>
                              )}

                              {result.missingDocs.length > 0 && (
                                <div className="space-y-1">
                                  <span className="text-slate-400 block text-[8px] uppercase font-black">Missing Documents Needed:</span>
                                  {result.missingDocs.map((doc, idx) => (
                                    <p key={idx} className="flex items-center gap-1.5 pl-1 text-rose-800 font-extrabold">
                                      • {doc} (Possess or check the upload box above to simulate clearance)
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="mt-3 p-3 bg-emerald-50 border border-emerald-150 rounded-xl text-[10px] font-black text-emerald-950 flex items-center gap-2">
                              <span>✅</span>
                              <span>Statutory clearance approved! All criteria are met and all required documents are possessed.</span>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Program Benefits Overview */}
                    <div className="bg-emerald-50/50 border border-emerald-150 rounded-xl p-4 space-y-1.5 text-xs">
                      <span className="text-[9px] font-black text-emerald-800 uppercase tracking-wider block">
                        Program Benefits Overview
                      </span>
                      <p className="text-xs font-extrabold text-slate-800 leading-snug">
                        {activeAssistanceScheme.benefitsDetails || activeAssistanceScheme.financialBenefit}
                      </p>
                    </div>

                    {/* Financial Estimator Card */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-xl p-3.5 space-y-1.5 text-xs">
                        <span className="text-[9px] font-black text-slate-400 uppercase block">
                          Estimated Subsidy Payout
                        </span>
                        <span className="text-lg font-black text-slate-800 block">
                          ${activeAssistanceScheme.estimatedSubsidyFormula(calcLandSize)} Cash Value
                        </span>
                        <p className="text-[9.5px] text-slate-400 font-bold">
                          Calculated based on {calcLandSize} Ha land area.
                        </p>
                      </div>

                      <div className="border rounded-xl p-3.5 space-y-1.5 text-xs">
                        <span className="text-[9px] font-black text-slate-400 uppercase block">
                          Audit Deadline Alert
                        </span>
                        <span className="text-xs font-bold text-slate-800 block flex items-center gap-1">
                          <Clock className="h-4 w-4 text-rose-500" />
                          {activeAssistanceScheme.deadline}
                        </span>
                        <p className="text-[9.5px] text-rose-600 font-black uppercase">
                          {activeAssistanceScheme.status === "Closing Soon" ? "🔥 Closing Extremely Soon!" : "✓ Registration Open"}
                        </p>
                      </div>
                    </div>

                    {/* Detailed Eligibility Thresholds */}
                    <div className="border rounded-xl p-4 space-y-3 text-xs bg-white">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                        Detailed Eligibility Criteria
                      </span>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="bg-slate-50 p-2.5 rounded-lg border">
                          <span className="text-[8px] text-slate-400 uppercase font-black block">Land Ownership</span>
                          <span className="text-[10.5px] text-slate-800 font-extrabold block">
                            ≤ {activeAssistanceScheme.eligibilityCriteria.maxLandSizeHectares} Hectares
                          </span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-lg border">
                          <span className="text-[8px] text-slate-400 uppercase font-black block">Income Limit</span>
                          <span className="text-[10.5px] text-slate-800 font-extrabold block">
                            {activeAssistanceScheme.eligibilityCriteria.incomeLimit || "No Limit"}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-lg border">
                          <span className="text-[8px] text-slate-400 uppercase font-black block">Minimum Age</span>
                          <span className="text-[10.5px] text-slate-800 font-extrabold block">
                            {activeAssistanceScheme.eligibilityCriteria.minAge || 18} Years
                          </span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-lg border">
                          <span className="text-[8px] text-slate-400 uppercase font-black block">Social Category</span>
                          <span className="text-[10.5px] text-slate-800 font-extrabold block truncate">
                            {activeAssistanceScheme.eligibilityCriteria.socialCategory || "All Farmers"}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-lg border col-span-2 md:col-span-1">
                          <span className="text-[8px] text-slate-400 uppercase font-black block">Target Crops</span>
                          <span className="text-[10.5px] text-slate-800 font-extrabold block truncate">
                            {activeAssistanceScheme.eligibilityCriteria.cropType || "All crops"}
                          </span>
                        </div>
                      </div>
                      {activeAssistanceScheme.eligibilityCriteria.otherConditions && (
                        <p className="text-[9.5px] text-slate-500 font-semibold border-t pt-2">
                          ⚠️ <span className="font-extrabold">Other conditions:</span> {activeAssistanceScheme.eligibilityCriteria.otherConditions}
                        </p>
                      )}
                    </div>

                    {/* Budget Allocation vs Utilization Section */}
                    {activeAssistanceScheme.allocatedBudget && (
                      <div className="border rounded-xl p-4 space-y-2.5 text-xs bg-white">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                            Sovereign Fiscal Budget Outlay
                          </span>
                          <span className="text-[9.5px] font-black text-slate-500">
                            Utilized / Allocated
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                          <div className="border-l-2 border-slate-300 pl-2">
                            <span className="text-[8.5px] text-slate-400 block uppercase font-bold">Allocated Budget</span>
                            <span className="text-[11.5px] font-black text-slate-800">{activeAssistanceScheme.allocatedBudget}</span>
                          </div>
                          <div className="border-l-2 border-emerald-500 pl-2">
                            <span className="text-[8.5px] text-emerald-600 block uppercase font-bold">Utilized Budget</span>
                            <span className="text-[11.5px] font-black text-emerald-700">{activeAssistanceScheme.utilizedBudget}</span>
                          </div>
                        </div>
                        {/* Simple visual budget bar */}
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden relative">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: "85%" }}></div>
                        </div>
                      </div>
                    )}

                    {/* Criteria Checklist */}
                    <div className="border rounded-xl p-4 space-y-2 text-xs">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                        Required Documentation Checklist
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {activeAssistanceScheme.eligibilityCriteria.requiredDocuments.map((doc, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 font-semibold text-slate-700">
                            <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                            <span>{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Local Success Story */}
                    <div className="bg-amber-50/50 border border-amber-200 p-4 rounded-xl space-y-2">
                      <span className="text-[8px] font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200 w-fit block">
                        Local Success Story
                      </span>
                      <p className="text-xs font-serif text-slate-700 leading-relaxed italic">
                        &ldquo;{activeAssistanceScheme.successStory.quote}&rdquo;
                      </p>
                      <div className="text-[9.5px] text-slate-500 font-bold text-right">
                        — {activeAssistanceScheme.successStory.farmerName}, {activeAssistanceScheme.successStory.location} ({activeAssistanceScheme.successStory.amountReceived})
                      </div>
                    </div>

                    {/* Action CTA */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleApplyNow(activeAssistanceScheme.id)}
                        className="flex-1 min-w-[140px] py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase rounded-xl cursor-pointer shadow-xs transition-all flex items-center justify-center gap-1.5"
                      >
                        <UserCheck className="h-4 w-4" /> Apply for program
                      </button>

                      {activeAssistanceScheme.applicationUrl && (
                        <a
                          href={activeAssistanceScheme.applicationUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="py-2.5 px-3.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-250 font-black text-xs uppercase rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1"
                        >
                          Official Portal ↗
                        </a>
                      )}

                      <button
                        onClick={() => triggerAutoFill(activeAssistanceScheme.id)}
                        className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5"
                      >
                        <FileText className="h-4 w-4" /> Auto-Fill Forms
                      </button>
                    </div>

                    {/* Interactive Auto-fill Mock Form Display */}
                    {autofillAppId === activeAssistanceScheme.id && (
                      <div className="border border-slate-200 p-4 rounded-xl bg-slate-50 space-y-3.5 animate-fadeIn">
                        <div className="flex justify-between items-center border-b pb-2">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            Sovereign Portal Auto-Fill Form Template
                          </span>
                          {isAutofilling ? (
                            <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-1">
                              <RefreshCw className="h-3 w-3 animate-spin" /> Fetching secure biometric profile...
                            </span>
                          ) : (
                            <span className="text-[8.5px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-150 uppercase">
                              ✓ Auto-filled
                            </span>
                          )}
                        </div>

                        {autofillForm && (
                          <div className="grid grid-cols-2 gap-3 text-[10px] font-mono">
                            <div>
                              <span className="text-[8px] text-slate-400 block uppercase font-bold">Applicant Full Name:</span>
                              <span className="text-slate-800 font-black block">{autofillForm.farmerName}</span>
                            </div>
                            <div>
                              <span className="text-[8px] text-slate-400 block uppercase font-bold">Biometric ID (Aadhaar):</span>
                              <span className="text-slate-800 font-black block">{autofillForm.aadhaar}</span>
                            </div>
                            <div>
                              <span className="text-[8px] text-slate-400 block uppercase font-bold">Deeded Landholding:</span>
                              <span className="text-slate-800 font-black block">{autofillForm.landSize}</span>
                            </div>
                            <div>
                              <span className="text-[8px] text-slate-400 block uppercase font-bold">Survey Block No:</span>
                              <span className="text-slate-800 font-black block">{autofillForm.surveyNo}</span>
                            </div>
                            <div>
                              <span className="text-[8px] text-slate-400 block uppercase font-bold">Disbursement Bank:</span>
                              <span className="text-slate-800 font-black block">{autofillForm.bankName}</span>
                            </div>
                            <div>
                              <span className="text-[8px] text-slate-400 block uppercase font-bold">Account Passbook No:</span>
                              <span className="text-slate-800 font-black block">{autofillForm.accountNo}</span>
                            </div>
                          </div>
                        )}

                        <div className="text-[9px] text-slate-400 font-semibold border-t pt-2 flex justify-between items-center">
                          <span>Digital Signature Key: AMIR_PATEL_SEC4_ APReg</span>
                          <button
                            type="button"
                            onClick={() => handleApplyNow(activeAssistanceScheme.id)}
                            className="px-2 py-1 bg-emerald-700 text-white font-black rounded hover:bg-emerald-800"
                          >
                            Apply with Pre-fill
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: COMPARISON MATRIX */}
          {activeSubTab === "compare" && (
            <div className="bg-white border rounded-2xl p-5 space-y-5 animate-fadeIn">
              
              <div className="border-b pb-3 space-y-1">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Scale className="h-4.5 w-4.5 text-emerald-600" /> Scheme-vs-Scheme Utility Comparison
                </h3>
                <p className="text-[10px] text-slate-500 font-medium">
                  Select multiple schemes from the checklists to verify and analyze eligibility metrics, loan terms, and cash safety.
                </p>
              </div>

              {/* Selector checkboxes */}
              <div className="flex flex-wrap gap-2 pt-1">
                {schemes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => toggleCompareScheme(s.id)}
                    className={`px-3 py-1.5 rounded-xl border text-[10.5px] font-black transition-all cursor-pointer ${
                      compareSchemeIds.includes(s.id)
                        ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {compareSchemeIds.includes(s.id) ? "✓ " : "+ "} {s.id}
                  </button>
                ))}
              </div>

              {/* Responsive comparison tables */}
              <div className="border rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b">
                      <th className="p-3 font-black text-slate-500 uppercase text-[9px] w-1/4">Metric Parameters</th>
                      {compareSchemeIds.map((id) => (
                        <th key={id} className="p-3 font-black text-slate-800 uppercase text-[9px]">
                          {id}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y font-semibold">
                    <tr>
                      <td className="p-3 text-slate-400 text-[9px] uppercase font-black">Level Limit</td>
                      {compareSchemeIds.map((id) => {
                        const s = schemes.find((sc) => sc.id === id);
                        return <td key={id} className="p-3 text-slate-800">{s?.level} Ministry</td>;
                      })}
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-400 text-[9px] uppercase font-black">Max Land Allowed</td>
                      {compareSchemeIds.map((id) => {
                        const s = schemes.find((sc) => sc.id === id);
                        return <td key={id} className="p-3 text-slate-800">{s?.eligibilityCriteria.maxLandSizeHectares} Hectares</td>;
                      })}
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-400 text-[9px] uppercase font-black">Financial Benefit</td>
                      {compareSchemeIds.map((id) => {
                        const s = schemes.find((sc) => sc.id === id);
                        return <td key={id} className="p-3 text-emerald-700 font-extrabold">{s?.financialBenefit}</td>;
                      })}
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-400 text-[9px] uppercase font-black">Est. Value (Your Land)</td>
                      {compareSchemeIds.map((id) => {
                        const s = schemes.find((sc) => sc.id === id);
                        return <td key={id} className="p-3 text-slate-900 font-black">${s?.estimatedSubsidyFormula(calcLandSize)}</td>;
                      })}
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-400 text-[9px] uppercase font-black">Key Exclusion</td>
                      {compareSchemeIds.map((id) => {
                        const s = schemes.find((sc) => sc.id === id);
                        return <td key={id} className="p-3 text-[10.5px] text-slate-500 leading-snug">{s?.eligibilityCriteria.otherConditions}</td>;
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Utility comparative bar charts */}
              <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-4 space-y-3.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                  Interactive Comparative Performance Index
                </span>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={schemeComparisonChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight="black" />
                      <YAxis stroke="#94a3b8" fontSize={9} />
                      <Tooltip contentStyle={{ fontSize: "10px", borderRadius: "8px" }} />
                      <Legend wrapperStyle={{ fontSize: "9px", fontWeight: "black" }} />
                      {compareSchemeIds.includes("PM-KISAN") && <Bar name="PM-KISAN" dataKey="PM-KISAN" fill="#059669" radius={[4, 4, 0, 0]} />}
                      {compareSchemeIds.includes("PMFBY") && <Bar name="PMFBY Crop Insurance" dataKey="PMFBY Insurance" fill="#d97706" radius={[4, 4, 0, 0]} />}
                      {compareSchemeIds.includes("KCC") && <Bar name="KCC Loan Support" dataKey="KCC Loan" fill="#2563eb" radius={[4, 4, 0, 0]} />}
                      {compareSchemeIds.includes("SUBSIDY-SOLAR") && <Bar name="PM-KUSUM Solar" dataKey="PM-KUSUM Solar" fill="#6366f1" radius={[4, 4, 0, 0]} />}
                      {compareSchemeIds.includes("STATE-DRIP") && <Bar name="Andhra Pradesh State Drip" dataKey="Andhra Pradesh State Drip" fill="#ec4899" radius={[4, 4, 0, 0]} />}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: DOCUMENT UPLOADS & AI OCR */}
          {activeSubTab === "documents" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fadeIn">
              
              {/* Document form uploads */}
              <div className="md:col-span-5 bg-slate-50 border rounded-2xl p-5 space-y-4">
                <div className="border-b pb-3">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Upload className="h-4.5 w-4.5 text-emerald-600" /> AI Document Verification Scan
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Verify biometric Aadhaar or Jamabandi land deeds before submitting to registries.
                  </p>
                </div>

                <form onSubmit={handleDocumentScan} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[9.5px] font-black text-slate-400 uppercase mb-1">
                      Target Verification Document
                    </label>
                    <select
                      value={selectedDocType}
                      onChange={(e) => setSelectedDocType(e.target.value)}
                      className="w-full bg-white border rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                    >
                      <option value="Aadhaar Card">Aadhaar Card (Biometric Verification)</option>
                      <option value="Land Registration Records (Jamabandi)">Land Registration Records (Jamabandi)</option>
                      <option value="Pesticide/Organic Compliance Statement">Organic NPOP Statement</option>
                    </select>
                  </div>

                  {/* Drop zone box */}
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center bg-white/50 hover:bg-white transition-all cursor-pointer">
                    <Upload className="h-6 w-6 text-slate-400 mx-auto mb-1.5" />
                    <span className="block text-[10px] text-slate-700 font-extrabold">Attach Scanned PDF</span>
                    <span className="block text-[8px] text-slate-400 mt-0.5">Drag & Drop or tap to upload (Max 8MB)</span>
                  </div>

                  {isVerifying && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-150 text-emerald-800 font-bold text-[9px] rounded-lg text-center flex items-center justify-center gap-1">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Analyzing biometric security stamps...
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase rounded-xl cursor-pointer shadow-xs transition-all"
                  >
                    Run OCR Verification Scan
                  </button>
                </form>
              </div>

              {/* OCR Scan display */}
              <div className="md:col-span-7 bg-white border rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">AI OCR Scanning Readout</h3>

                {verificationResult ? (
                  <div className="space-y-4">
                    <div className="bg-slate-50 border p-3.5 rounded-xl space-y-2 text-[10.5px] font-semibold text-slate-700 leading-relaxed">
                      <div className="flex justify-between items-center border-b pb-2 mb-1.5">
                        <span className="text-slate-400 font-bold uppercase text-[8px]">Extracted File Type:</span>
                        <span className="text-slate-900 font-black text-[10.5px]">{selectedDocType}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-400 font-bold uppercase text-[8px]">Validation Result:</span>
                        <span className={`font-black ${verificationResult.status === "Verified" ? "text-emerald-700" : "text-rose-600"}`}>
                          {verificationResult.status} ({verificationResult.confidence}% confidence)
                        </span>
                      </div>

                      {Object.keys(verificationResult.extractedData).length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t text-[9.5px]">
                          {Object.entries(verificationResult.extractedData).map(([k, v]) => (
                            <div key={k} className="flex justify-between">
                              <span className="text-slate-400">{k}:</span>
                              <span className="text-slate-800 font-black">{v}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Warnings shelf */}
                    <div className="p-3.5 bg-amber-50 border border-amber-100 rounded-xl text-[9px] font-bold text-amber-900 leading-relaxed">
                      <span className="text-amber-950 block font-black uppercase text-[8px] mb-1">
                        ⚠️ Landholder Compliance Notice
                      </span>
                      {verificationResult.warnings.map((w, i) => (
                        <p key={i}>• {w}</p>
                      ))}
                    </div>

                    {verificationResult.status === "Verified" && (
                      <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-[9.5px] text-emerald-800 font-black flex items-center gap-2">
                        <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                        Verification signature generated. The file matches physical block coordinates.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-12 text-center text-slate-400 text-xs font-semibold bg-slate-50 border border-dashed rounded-2xl">
                    <FileSpreadsheet className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                    No verification scan is active. Please trigger the file OCR scan on the left.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 4: APPLICATION TRACKING & APPEAL ADVISOR */}
          {activeSubTab === "tracking" && (
            <div className="bg-white border rounded-2xl p-5 space-y-5 animate-fadeIn">
              
              <div className="border-b pb-3.5">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  State Application Progress Desk & Historical Records
                </h3>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  Check direct biometric transfers and generate formal appeal briefs if your land coordinates are flagged.
                </p>
              </div>

              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-3.5">
                    
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-mono text-slate-400 block uppercase">
                          ID Reference: {app.id} • Submitted: {app.submittedDate}
                        </span>
                        <h4 className="text-xs font-black text-slate-800 leading-snug">{app.schemeName}</h4>
                      </div>
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase ${
                          app.status === "Approved" || app.status === "Disbursed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-150"
                            : app.status === "Action Required"
                            ? "bg-amber-50 text-amber-700 border-amber-200 animate-pulse"
                            : app.status === "Rejected"
                            ? "bg-rose-50 text-rose-700 border-rose-150"
                            : "bg-blue-50 text-blue-700 border-blue-150"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    {/* Progress milestone dots */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[8px] text-slate-400 uppercase font-black tracking-wider">
                        <span>Submitted</span>
                        <span>Documents Verified</span>
                        <span>Approved</span>
                        <span>Disbursed</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden relative">
                        <div
                          className={`h-full ${app.status === "Rejected" ? "bg-rose-500" : app.status === "Action Required" ? "bg-amber-500" : "bg-emerald-600"}`}
                          style={{ width: `${app.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-[10px] font-medium text-slate-600 leading-relaxed bg-white border p-3 rounded-lg italic">
                      <strong>Status Update:</strong> &ldquo;{app.comments}&rdquo;
                    </p>

                    {/* Appeal Section trigger if rejected or action required */}
                    {(app.status === "Rejected" || app.status === "Action Required") && (
                      <div className="pt-2 border-t flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                        <div className="text-[10px] text-rose-700 font-semibold leading-relaxed flex items-center gap-1">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          <span>Flagged: Appeal Nodal Head Review with updated GPS layout or biometric receipts immediately.</span>
                        </div>
                        <button
                          onClick={() => generateAppealText(app)}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[9.5px] font-black uppercase rounded-lg cursor-pointer transition-all flex items-center gap-1 shrink-0"
                        >
                          <Award className="h-3.5 w-3.5" /> AI Appeal Advisor
                        </button>
                      </div>
                    )}

                    {/* Verified Docs details */}
                    <div className="flex flex-wrap gap-2 text-[9px] font-bold">
                      {app.verifiedDocuments.map((doc, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-0.5 rounded border ${
                            doc.status === "Verified"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-150"
                              : doc.status === "Rejected"
                              ? "bg-rose-50 text-rose-700 border-rose-150 animate-pulse"
                              : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}
                        >
                          {doc.name}: {doc.status}
                        </span>
                      ))}
                    </div>

                    {/* Receipt download button */}
                    <div className="pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[10px]">
                      <span className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wide">
                        Verified Direct Benefit Ledger Entry
                      </span>
                      <button
                        onClick={() => setReceiptApp(app)}
                        className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50/20 text-[9px] font-black uppercase rounded-lg cursor-pointer transition-all flex items-center gap-1.5 shrink-0"
                      >
                        <FileDown className="h-3.5 w-3.5 text-emerald-600" /> View & Download Receipt
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* APPEAL MODAL / PANEL DISPLAY */}
              {appealAppId && (
                <div className="border border-rose-200 p-5 rounded-2xl bg-rose-50/20 space-y-4 animate-fadeIn">
                  <div className="flex justify-between items-center border-b border-rose-100 pb-2">
                    <div className="flex items-center gap-1 text-rose-800">
                      <Sparkles className="h-4 w-4 text-rose-600" />
                      <h4 className="text-xs font-black uppercase tracking-wider">
                        AI-Generated Appeal Brief Draft
                      </h4>
                    </div>
                    <button
                      onClick={() => setAppealAppId(null)}
                      className="text-slate-400 hover:text-slate-600 font-bold text-xs"
                    >
                      Close Brief
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                    The appeal is pre-formatted with Andhra Pradesh Ministry criteria. Correct any coordinates stamps and dispatch directly to the Vijayawada Nodal Office.
                  </p>

                  <textarea
                    value={generatedAppealLetter}
                    onChange={(e) => setGeneratedAppealLetter(e.target.value)}
                    rows={8}
                    className="w-full bg-white border border-rose-150 rounded-xl p-3 text-[10.5px] font-mono text-slate-700 leading-relaxed focus:outline-none"
                  />

                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400 font-bold">Document Match: Verified Biometric Hash</span>
                    <button
                      onClick={() => {
                        setAppealSent(true);
                        setTimeout(() => setAppealAppId(null), 2500);
                      }}
                      disabled={appealSent}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black uppercase rounded-xl cursor-pointer"
                    >
                      {appealSent ? "✓ Dispatch Successful" : "Submit Formal Appeal letter"}
                    </button>
                  </div>

                  {appealSent && (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 text-[10px] font-bold rounded-xl text-center">
                      ✓ Appeal brief uploaded to sovereign gateway. Nodal review queue updated.
                    </div>
                  )}
                </div>
              )}

              {/* RECEIPT VIEW & DOWNLOAD MODAL */}
              {receiptApp && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
                  <div className="bg-white border-2 border-emerald-600 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-scaleUp">
                    
                    {/* Header bar */}
                    <div className="bg-emerald-700 text-white p-5 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-emerald-100" />
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-100 leading-none">
                            Sovereign Union of India
                          </h4>
                          <h3 className="text-xs font-bold font-serif leading-tight">
                            Direct Benefit Registry Receipt
                          </h3>
                        </div>
                      </div>
                      <button
                        onClick={() => setReceiptApp(null)}
                        className="bg-emerald-800/50 hover:bg-emerald-800 text-emerald-100 hover:text-white px-2.5 py-1 rounded-lg text-xs font-black transition-all"
                      >
                        ✕ Close
                      </button>
                    </div>

                    {/* Receipt body */}
                    <div className="p-6 space-y-5">
                      
                      {/* Barcode representation */}
                      <div className="bg-slate-50 border rounded-xl p-3 flex flex-col items-center justify-center space-y-1.5">
                        <div className="font-mono text-[14px] font-bold text-slate-800 tracking-[0.25em] select-none">
                          ||||| | ||||| ||| |||| || |||| |||
                        </div>
                        <span className="text-[8px] font-mono text-slate-400">
                          TXN-REF-{receiptApp.id}-SEC4
                        </span>
                      </div>

                      {/* Info grid */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-[10.5px] border-b pb-4">
                        <div>
                          <span className="text-[8px] text-slate-400 uppercase font-black block">Scheme Enrolled</span>
                          <span className="font-extrabold text-slate-800 block truncate">{receiptApp.schemeName}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-slate-400 uppercase font-black block">Transaction Reference</span>
                          <span className="font-mono font-extrabold text-emerald-700 block">{receiptApp.id}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-slate-400 uppercase font-black block">Submission Date</span>
                          <span className="font-extrabold text-slate-800 block">{receiptApp.submittedDate}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-slate-400 uppercase font-black block">Registration Status</span>
                          <span className="font-extrabold text-blue-700 block uppercase">{receiptApp.status}</span>
                        </div>
                      </div>

                      {/* Farmer info */}
                      <div className="space-y-2 text-[10.5px]">
                        <span className="text-[8px] text-slate-400 uppercase font-black block">Applicant Profile</span>
                        <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 font-semibold text-slate-700">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Name:</span>
                            <span className="font-black text-slate-800">Amir Patel</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Aadhaar:</span>
                            <span className="font-black text-slate-800">xxxx-xxxx-8012</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Land Holding:</span>
                            <span className="font-black text-slate-800">1.82 Hectares</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Disbursement Bank:</span>
                            <span className="font-black text-slate-800">State Bank of India (xxxx-1294)</span>
                          </div>
                        </div>
                      </div>

                      {/* Doc check */}
                      <div className="space-y-2">
                        <span className="text-[8px] text-slate-400 uppercase font-black block">Digital Document Seals</span>
                        <div className="grid grid-cols-1 gap-1.5">
                          {receiptApp.verifiedDocuments.map((doc, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[10px] bg-slate-50 px-2.5 py-1.5 rounded-lg border">
                              <span className="font-bold text-slate-700">{doc.name}</span>
                              <span className={`text-[8.5px] font-black uppercase px-1.5 py-0.25 rounded ${doc.status === "Verified" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-600"}`}>
                                {doc.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Download actions */}
                      <div className="pt-2 flex justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            downloadReceiptTxt(receiptApp);
                          }}
                          className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-[10.5px] font-black uppercase rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <FileDown className="h-4 w-4" /> Download Official Receipt (.txt)
                        </button>
                        <button
                          type="button"
                          onClick={() => setReceiptApp(null)}
                          className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 text-[10.5px] font-black uppercase rounded-xl cursor-pointer transition-all"
                        >
                          Dismiss
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 5: AGRICULTURAL TAX SERVICES (ITR) */}
          {activeSubTab === "itr" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fadeIn">
              
              {/* Inputs */}
              <div className="md:col-span-5 bg-slate-50 border rounded-2xl p-5 space-y-4">
                <div className="border-b pb-3">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1">
                    <DollarSign className="h-4.5 w-4.5 text-emerald-600" /> Landowner Exemption ITR Calculator
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Analyze agricultural crop sales to claim proper tax exemptions under Section 10(1).
                  </p>
                </div>

                <div className="space-y-4 text-xs font-semibold text-slate-600">
                  <div>
                    <label className="block text-[9.5px] font-black text-slate-400 uppercase mb-1">
                      Gross Agricultural Revenues ($)
                    </label>
                    <input
                      type="number"
                      value={taxAgriculturalRevenue}
                      onChange={(e) => setTaxAgriculturalRevenue(parseInt(e.target.value) || 0)}
                      className="w-full bg-white border rounded-xl px-3 py-2 text-xs font-extrabold text-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[9.5px] font-black text-slate-400 uppercase mb-1">
                      Non-Agricultural Business Sales ($)
                    </label>
                    <input
                      type="number"
                      value={taxNonAgriculturalRevenue}
                      onChange={(e) => setTaxNonAgriculturalRevenue(parseInt(e.target.value) || 0)}
                      className="w-full bg-white border rounded-xl px-3 py-2 text-xs font-extrabold text-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[9.5px] font-black text-slate-400 uppercase mb-1">
                      Certified Input Deductions ($)
                    </label>
                    <input
                      type="number"
                      value={taxInputDeductions}
                      onChange={(e) => setTaxInputDeductions(parseInt(e.target.value) || 0)}
                      className="w-full bg-white border rounded-xl px-3 py-2 text-xs font-extrabold text-slate-700"
                    />
                    <span className="text-[8px] text-slate-400 font-medium block mt-1 leading-snug">
                      Includes seed receipts, fertilizer vouchers, tractor fuel, and organic compost certificates.
                    </span>
                  </div>
                </div>
              </div>

              {/* Exemption readout */}
              <div className="md:col-span-7 bg-white border rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" /> Exemption Statement & ITR Receipt
                </h3>

                <div className="bg-slate-50 border p-4 rounded-xl space-y-3 text-[10.5px] font-semibold text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Net Agricultural Profit:</span>
                    <span className="text-slate-800 font-black">${taxCalculations.netAgriculturalIncome}</span>
                  </div>

                  <div className="flex justify-between border-b pb-2.5">
                    <span className="text-slate-400">Sovereign Section 10(1) Exemption:</span>
                    <span className="text-emerald-700 font-extrabold">-${taxCalculations.exemptionClaimed} Exempted</span>
                  </div>

                  <div className="flex justify-between pt-1">
                    <span className="text-slate-400">Taxable Non-Agri Income:</span>
                    <span className="text-slate-800 font-black">${taxCalculations.taxableIncome}</span>
                  </div>

                  <div className="flex justify-between border-t pt-2.5 text-xs font-black text-slate-900">
                    <span>Estimated Net Income Tax:</span>
                    <span className="text-emerald-600">${taxCalculations.estimatedTax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl text-[9px] font-bold text-emerald-900 leading-relaxed space-y-1">
                  <p>✓ Zero Professional Income Tax triggered for your crop profile.</p>
                  <p>✓ Ledger automatically generates standardized compliance records ready to file with tax attorneys.</p>
                </div>

                <button
                  type="button"
                  onClick={() => alert("✓ Compliance receipt downloaded to local file registry (ITR-SCH10_AMIR.pdf)")}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] uppercase rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                >
                  <FileDown className="h-4 w-4" /> Download ITR Tax Receipt
                </button>
              </div>

            </div>
          )}

          {/* TAB 6: GRIVANCE ESCALATION & ESCALATION DESK */}
          {activeSubTab === "complaints" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fadeIn">
              
              {/* Form submit */}
              <div className="md:col-span-5 bg-slate-50 border rounded-2xl p-5 space-y-4">
                <div className="border-b pb-3">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    File Bilateral Grievance
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Escalate delayed PM-KISAN cash installments or PMFBY crop verification coordinates errors.
                  </p>
                </div>

                <form onSubmit={handleFileComplaint} className="space-y-4 text-xs font-semibold text-slate-600">
                  <div>
                    <label className="block text-[9.5px] font-black text-slate-400 uppercase mb-1">
                      Escalation Category
                    </label>
                    <select
                      value={newGrievanceCategory}
                      onChange={(e) => setNewGrievanceCategory(e.target.value)}
                      className="w-full bg-white border rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                    >
                      <option value="Direct Income Support Delay">Direct Income Support Delay</option>
                      <option value="Crop Insurance Claim Dispute">Crop Insurance Claim Dispute</option>
                      <option value="Solar Subsidy Delayed Audit">Solar Subsidy Delayed Audit</option>
                      <option value="Land Jamabandi coordinates Error">Land Jamabandi coordinates Error</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9.5px] font-black text-slate-400 uppercase mb-1">
                      Escalation Subject Brief
                    </label>
                    <input
                      type="text"
                      value={newGrievanceSubject}
                      onChange={(e) => setNewGrievanceSubject(e.target.value)}
                      className="w-full bg-white border rounded-xl px-3 py-2 text-xs font-extrabold text-slate-800"
                      placeholder="e.g. Missing bank clearance for installment"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[9.5px] font-black text-slate-400 uppercase mb-1">
                      Detailed Explanatory Statement
                    </label>
                    <textarea
                      value={newGrievanceMsg}
                      onChange={(e) => setNewGrievanceMsg(e.target.value)}
                      rows={3}
                      className="w-full bg-white border rounded-xl p-3 text-[10.5px] font-medium text-slate-700 leading-relaxed focus:outline-none resize-none"
                      placeholder="Specify dates, transaction IDs, or surveyor coordinates flags..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all"
                  >
                    <Send className="h-4 w-4" /> Dispatch Escalation Ticket
                  </button>
                </form>
              </div>

              {/* Chat threads with nodal officers */}
              <div className="md:col-span-7 bg-white border rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Nodal Officers Communications
                </h3>

                <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                  {complaints.map((c) => (
                    <div key={c.id} className="bg-slate-50 border p-4 rounded-xl space-y-3.5 text-[10px] font-semibold text-slate-700">
                      <div className="flex justify-between items-start border-b pb-2 mb-1">
                        <div>
                          <span className="text-[8px] font-mono text-slate-400 block uppercase">
                            Ticket: {c.id} • Category: {c.category}
                          </span>
                          <h4 className="text-xs font-black text-slate-900 leading-snug mt-1">
                            {c.subject}
                          </h4>
                        </div>
                        <span
                          className={`text-[8.5px] font-black px-2 py-0.5 rounded uppercase border ${
                            c.status === "Resolved"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-150"
                              : "bg-amber-50 text-amber-700 border-amber-200 animate-pulse"
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>

                      {/* Chat box history */}
                      <div className="space-y-3">
                        {c.replies.map((reply, i) => (
                          <div key={i} className="bg-white border p-3 rounded-xl space-y-1 relative">
                            <div className="flex justify-between items-center text-[8px] font-black uppercase text-slate-400">
                              <span>{reply.author}</span>
                              <span>{reply.timestamp}</span>
                            </div>
                            <p className="text-slate-600 leading-relaxed font-serif italic">
                              &ldquo;{reply.message}&rdquo;
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 7: DISASTER AID REQUESTS & TRACKING */}
          {activeSubTab === "disaster_aid" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fadeIn text-left">
              
              {/* Form submit */}
              <div className="md:col-span-5 bg-slate-50 border rounded-2xl p-5 space-y-4">
                <div className="border-b pb-3">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="h-4.5 w-4.5 text-red-600" />
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      File Emergency Aid Request
                    </h4>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Register damage assessments due to active floods, severe droughts, or crop pest infestations to claim sovereign disaster assistance.
                  </p>
                </div>

                <form onSubmit={handleRequestAid} className="space-y-4 text-xs font-semibold text-slate-600">
                  <div>
                    <label className="block text-[9.5px] font-black text-slate-400 uppercase mb-1">
                      Calamity / Damage Reason
                    </label>
                    <select
                      value={newAidReason}
                      onChange={(e) => setNewAidReason(e.target.value as any)}
                      className="w-full bg-white border rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                    >
                      <option value="Crop Loss">Crop Loss (Inundation, Lodging, Drought)</option>
                      <option value="Livestock Loss">Livestock Loss (Disease, Lightning, Barn collapse)</option>
                      <option value="Property Damage">Property Damage (Well breakdown, Storage leak)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9.5px] font-black text-slate-400 uppercase mb-1">
                        Estimated Loss (₹)
                      </label>
                      <input
                        type="number"
                        value={newAidEstimatedLoss}
                        onChange={(e) => setNewAidEstimatedLoss(Number(e.target.value))}
                        className="w-full bg-white border rounded-xl px-3 py-2 text-xs font-extrabold text-slate-800"
                        min={100}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[9.5px] font-black text-slate-400 uppercase mb-1">
                        Requested Aid Amount (₹)
                      </label>
                      <input
                        type="number"
                        value={newAidRequestedAmount}
                        onChange={(e) => setNewAidRequestedAmount(Number(e.target.value))}
                        className="w-full bg-white border rounded-xl px-3 py-2 text-xs font-extrabold text-slate-800"
                        min={100}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9.5px] font-black text-slate-400 uppercase mb-1">
                      Detailed Explanatory Statement & Evidence Details
                    </label>
                    <textarea
                      value={newAidDescription}
                      onChange={(e) => setNewAidDescription(e.target.value)}
                      rows={4}
                      className="w-full bg-white border rounded-xl p-3 text-[10.5px] font-medium text-slate-700 leading-relaxed focus:outline-none resize-none"
                      placeholder="Specify the date of occurrence, exact crop varieties affected, physical acreage destroyed, and any photographs or surveyors reference..."
                      required
                    />
                  </div>

                  <div className="p-3 bg-red-50 text-red-800 rounded-xl space-y-1 border border-red-150">
                    <p className="text-[9px] font-black uppercase tracking-wider">Legal Verification Notice</p>
                    <p className="text-[8px] text-red-700 leading-relaxed">
                      By submitting, you certify that the damage occurred in your registered survey coordinates. Nodal officers will trigger verification audits.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white font-black text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all"
                  >
                    <Send className="h-4 w-4" /> Dispatch Aid Request
                  </button>
                </form>
              </div>

              {/* Status and Disbursement Tracking List */}
              <div className="md:col-span-7 bg-white border rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      Emergency Aid Tracker & Disbursement
                    </h3>
                    <p className="text-[10px] text-slate-400">Track claim audits, direct cash approvals, and RTGS bank transfers</p>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[9px] font-black uppercase">
                    {aidRequests.length} claims
                  </span>
                </div>

                <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
                  {aidRequests.length === 0 ? (
                    <div className="py-12 text-center border border-dashed rounded-2xl space-y-2">
                      <Clock className="h-8 w-8 text-slate-300 mx-auto" />
                      <p className="text-xs text-slate-400 font-bold">No registered emergency aid requests found.</p>
                    </div>
                  ) : (
                    aidRequests.map((req) => (
                      <div key={req.id} className="bg-slate-50 border p-4 rounded-xl space-y-3.5 text-[10.5px] font-semibold text-slate-700 font-sans">
                        <div className="flex justify-between items-start border-b pb-2">
                          <div>
                            <span className="text-[8px] font-mono text-slate-400 block uppercase">
                              ID: {req.id} • Submitted: {req.submittedAt}
                            </span>
                            <span className="inline-flex items-center gap-1 mt-1 text-xs font-black text-slate-900">
                              <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-700 text-[8px] font-black uppercase">
                                {req.reason}
                              </span>
                              {req.district} District
                            </span>
                          </div>

                          <div className="flex flex-col items-end gap-1.5">
                            <span
                              className={`text-[8.5px] font-black px-2 py-0.5 rounded uppercase border ${
                                req.status === "Approved"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-150"
                                  : req.status === "Rejected"
                                  ? "bg-red-50 text-red-750 border-red-150"
                                  : "bg-amber-50 text-amber-700 border-amber-200 animate-pulse"
                              }`}
                            >
                              {req.status}
                            </span>

                            {req.status === "Approved" && (
                              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase border ${
                                req.disbursementStatus === "Disbursed"
                                  ? "bg-blue-50 text-blue-700 border-blue-150"
                                  : "bg-slate-100 text-slate-600"
                              }`}>
                                {req.disbursementStatus || "Pending"}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1 text-slate-600 leading-relaxed">
                          <p className="font-serif italic text-slate-755">
                            &ldquo;{req.description}&rdquo;
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-150/50 text-[10px] text-slate-500 font-bold">
                            <div>
                              <span className="text-slate-400 block text-[8px] uppercase font-black">Estimated Loss</span>
                              <span className="text-slate-800 font-black">₹{req.estimatedLoss.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[8px] uppercase font-black">Requested Aid</span>
                              <span className="text-slate-800 font-black">₹{req.requestedAmount.toLocaleString()}</span>
                            </div>
                            {req.status === "Approved" && (
                              <div>
                                <span className="text-emerald-600 block text-[8px] uppercase font-black">Approved Grant</span>
                                <span className="text-emerald-700 font-black">₹{req.approvedAmount?.toLocaleString()}</span>
                              </div>
                            )}
                            {req.status === "Rejected" && (
                              <div className="col-span-2 bg-red-50/50 p-1.5 rounded border border-red-100">
                                <span className="text-red-700 block text-[8px] uppercase font-black">Rejection Reason</span>
                                <span className="text-red-800 font-extrabold">{req.rejectionReason || "No details provided"}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {req.status === "Approved" && req.disbursementStatus === "Disbursed" && (
                          <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-lg text-[9px] flex items-center gap-1.5 border border-emerald-150">
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            <div>
                              <span className="font-black uppercase tracking-wider block">Direct Benefit Transferred (RTGS)</span>
                              <span className="text-emerald-700 font-medium">Funds successfully released to Aadhaar-linked bank account. Reference Ref-TXN940212</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
