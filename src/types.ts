export enum UserRole {
  FARMER = "Farmer",
  BUYER = "Buyer",
  GOVERNMENT = "Government Officer",
  SUPPLIER = "Supplier",
  EXPERT = "Agriculture Expert",
  ADMIN = "Admin",
  LOGISTICS = "Logistics Provider",
  WAREHOUSE = "Warehouse Operator",
  INSURANCE = "Insurance Agent",
  BANK = "Bank Officer",
  RESEARCHER = "Researcher",
  EXTENSION = "Extension Officer",
  PRECISION_FINTECH = "AI Precision Agronomy & Fintech",
  AI_IOT = "AI & IoT Engine",
  BLOCKCHAIN = "Blockchain & Carbon Credits",
  MOBILE_APP = "Mobile Apps (iOS & Android)",
  STARTUP_HUB = "Startup Pitch & Investor Hub",
  GEMINI_SUITE = "Gemini AI & Maps/Firebase Suite",
}

export interface TelemetryReading {
  soilMoisture: number; // %
  soilPh: number;
  temperature: number; // °C
  humidity: number; // %
  nitrogen: number; // mg/kg
  phosphorus: number; // mg/kg
  potassium: number; // mg/kg
  timestamp: string;
}

export interface CropDiagnostic {
  id: string;
  cropName: string;
  symptoms: string;
  imageType?: string; // Mock or visual simulation
  status: "Pending AI" | "AI Diagnosed" | "Expert Verified";
  aiDiagnosis?: string;
  treatment?: string;
  confidence?: number;
  expertName?: string;
  expertNotes?: string;
  expertTier?: string;
  date: string;
  severity?: "Mild" | "Moderate" | "Severe";
  treatmentOutcome?: "Under Treatment" | "Cured (100% Recovery)" | "Partial Recovery (Stunted)" | "Crop Lost";
  successRate?: number; // percentage, e.g. 95
  pesticideBrand?: string;
  dosage?: string;
  applicationMethod?: string;
  organicAlternative?: string;
  preventionTips?: string;
  spreadPrediction?: string;
  imageUrl?: string;
}

export interface MarketBid {
  id: string;
  cropType: string;
  quantity: number; // tons
  quality: "Grade A" | "Grade B" | "Grade C";
  pricePerTon: number; // USD
  buyerName: string;
  status: "Active" | "Accepted" | "Countered" | "Completed";
  date: string;
}

export interface SubsidyScheme {
  id: string;
  title: string;
  category: "Climate Resilience" | "Equipment" | "Organic Transition" | "Financial Relief";
  fundingAmount: number;
  approvedCount: number;
  status: "Active" | "Closed";
  description: string;
  assignedNodalOfficer?: string;
  rejectedCount?: number;
}

export interface SupplierItem {
  id: string;
  name: string;
  category: "Seeds" | "Fertilizers" | "IoT Sensors" | "Machinery";
  price: number;
  stock: number;
  rating: number;
  image: string;
  sku?: string;
  publishStatus?: "Active" | "Draft" | "Archived";
  dateAdded?: string;
  images?: string[];
  subCategory?: string;
  description?: string;
  unit?: string;
  costPrice?: number;
  mrp?: number;
  moq?: number;
  bulkPricing?: { minQty: number; discount: number }[];
  lowStockThreshold?: number;
  reorderPoint?: number;
  video?: string;
  certifications?: {
    govApproved: boolean;
    organicCertified: boolean;
    isoCertified: boolean;
    fssaiLicense: string;
  };
  shipping?: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    cost: number;
    costType: "flat" | "calculated";
    zones: string[];
  };
}

export interface LogisticsRoute {
  id: string;
  driverName: string;
  cargo: string;
  weight: number; // kg
  origin: string;
  destination: string;
  tempCelsius: number;
  status: "In Transit" | "Dispatched" | "Delivered";
  progress: number; // %
}

export interface WarehouseSilo {
  id: string;
  name: string;
  grainType: string;
  capacityTons: number;
  currentFillTons: number;
  tempCelsius: number;
  humidityPercent: number;
  status: "Optimal" | "Warning" | "Critical";
}

export interface InsurancePolicy {
  id: string;
  farmerName: string;
  premiumAmount: number;
  coverageAmount: number;
  riskScore: number; // 0 - 100
  status: "Active" | "Claimed" | "Expired";
  cropInsured: string;
}

export interface MicroLoan {
  id: string;
  farmerName: string;
  requestedAmount: number;
  purpose: string;
  creditScore: number;
  status: "Applied" | "Approved" | "Disbursed" | "Rejected";
  date: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  author: string;
  domain: string;
  summary: string;
  views: number;
  date: string;
}

export interface FieldWorkshop {
  id: string;
  title: string;
  location: string;
  date: string;
  attendeesCount: number;
  status: "Scheduled" | "Completed";
  objective: string;
}
