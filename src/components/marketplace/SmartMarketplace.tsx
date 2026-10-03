import React, { useState, useMemo } from "react";
import {
  ShoppingBag,
  Star,
  Award,
  Sliders,
  Calendar,
  MapPin,
  Truck,
  History,
  HeartHandshake,
  Check,
  Percent,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Info,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Map,
  BadgeAlert,
  Bell,
  Clock,
  ThumbsUp,
  RotateCcw,
  ShieldCheck,
  Compass,
  Sprout,
  RefreshCw,
  Plus,
  Minus,
  ShoppingCart,
  X,
  User,
  CreditCard,
  QrCode,
  Wallet,
  Globe,
  Home,
  Building,
  Phone,
  Download,
  FileText,
  Upload,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ReferenceLine } from "recharts";

// Interfaces
interface Product {
  id: string;
  name: string;
  category: "Seeds" | "Fertilizers" | "Pesticides" | "Equipment" | "Irrigation" | "Organic Inputs";
  price: number;
  unit: string;
  rating: number;
  reviewsCount: number;
  reviews: { author: string; rating: number; text: string; date: string; verified?: boolean }[];
  supplier: string;
  supplierLocation: string;
  supplierRating: number;
  supplierProductsSold: number;
  certification: string;
  isGovApproved: boolean;
  popularityCount: number;
  distance: number;
  returnPolicy: string;
  warranty: string;
  stockLevel: "In Stock" | "Low Stock" | "Out of Stock";
  maxStock: number;
  nearbyStock: { dealer: string; distance: number; stock: number; price: number }[];
  aiMatchReason: string;
  priceForecast: {
    recommendation: "Buy Now" | "Wait" | "Strong Buy";
    reason: string;
    trendData: { month: string; historicalPrice: number; projectedPrice?: number }[];
  };
  description: string;
  images: string[];
  discountPercent?: number;
}

interface OrderItem {
  id: string;
  product: Product;
  qty: number;
  deliverySpeed: string;
  priceRupees: number;
}

interface OrderReturn {
  reason: string;
  proofPreview: string | null;
  note: string;
  date: string;
  selectedItems: string[];
}

interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotalRupees: number;
  discountRupees: number;
  taxRupees: number;
  shippingRupees: number;
  totalRupees: number;
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
  shippingAddress: {
    name: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  trackingNumber: string;
  returnRequested?: boolean;
  returnDetails?: OrderReturn;
}

interface SmartMarketplaceProps {
  activeCrops: { name: string; stage: string; healthStatus: string; sector: string }[];
  soilType: string;
  activeDiseases: string[];
}

export const SmartMarketplace: React.FC<SmartMarketplaceProps> = ({
  activeCrops = [],
  soilType = "Clay Loam",
  activeDiseases = []
}) => {
  // Mock products database
  const products: Product[] = [
    {
      id: "prod-wheat-seeds",
      name: "Wheat Seeds (PBW 343 Premium)",
      category: "Seeds",
      price: 14.45, // ₹1,200 / 5kg (at exchange rate 83)
      unit: "5kg bag",
      rating: 4.9,
      reviewsCount: 142,
      reviews: [
        { author: "Rajesh Patel", rating: 5, text: "Gives amazing high-grain output. Extremely resistant to yellow rust.", date: "2026-06-20", verified: true },
        { author: "Suresh Kumar", rating: 5, text: "Highest yielding wheat seeds we have ever sown. Sows 3.2 acres perfectly.", date: "2026-07-02", verified: true }
      ],
      supplier: "Saraswati Agro-Seeds Ltd",
      supplierLocation: "Andhra Pradesh Sowing Hub",
      supplierRating: 4.9,
      supplierProductsSold: 42000,
      certification: "APEDA Premium Seed Certified #W-343",
      isGovApproved: true,
      popularityCount: 2540,
      distance: 2.5,
      returnPolicy: "30-Day Germination Performance Guarantee",
      warranty: "100% germination viability guarantee",
      stockLevel: "In Stock",
      maxStock: 500,
      nearbyStock: [
        { dealer: "Andhra Progressive Co-op", distance: 2.5, stock: 500, price: 14.45 }
      ],
      aiMatchReason: "Optimal match for your active Wheat PBW 343 crop and loamy clay soils.",
      priceForecast: {
        recommendation: "Strong Buy",
        reason: "Sowing window starts soon. Secure high-germination premium seed batches before prices go up.",
        trendData: [
          { month: "May", historicalPrice: 13.5 },
          { month: "Jun", historicalPrice: 14.0 },
          { month: "Jul (Now)", historicalPrice: 14.45, projectedPrice: 14.45 }
        ]
      },
      description: "Premium high-yielding wheat seed cross-bred for exceptional high-heat tolerances and rust resistance. Tailored specifically for modern deep-root irrigation systems in clay loam soils.",
      images: [
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80"
      ]
    },
    {
      id: "prod-urea-fertilizer",
      name: "Premium Urea Fertilizer",
      category: "Fertilizers",
      price: 9.64, // ₹800 / 50kg (at exchange rate 83)
      unit: "50kg bag",
      rating: 4.8,
      reviewsCount: 215,
      reviews: [
        { author: "Rajesh Patel", rating: 5, text: "Essential for pre-flowering nitrogen boosting. Works instantly.", date: "2026-05-18", verified: true }
      ],
      supplier: "Prithvi Organic Inputs",
      supplierLocation: "National Chemicals Depot",
      supplierRating: 4.8,
      supplierProductsSold: 88000,
      certification: "FCO Certified (Fertilizer Control Order)",
      isGovApproved: true,
      popularityCount: 5200,
      distance: 3.8,
      returnPolicy: "14-Day return if seals are intact",
      warranty: "3-year chemical stability certificate",
      stockLevel: "In Stock",
      maxStock: 1000,
      nearbyStock: [
        { dealer: "State Agroworks", distance: 3.8, stock: 1000, price: 9.64 }
      ],
      aiMatchReason: "Provides high-grade nitrogen replenishment for active wheat and rice crops.",
      priceForecast: {
        recommendation: "Buy Now",
        reason: "Subsidies are fully locked for the current quarter. Buy now to avoid high delivery charges during rain seasons.",
        trendData: [
          { month: "May", historicalPrice: 9.5 },
          { month: "Jun", historicalPrice: 9.6 },
          { month: "Jul (Now)", historicalPrice: 9.64, projectedPrice: 9.64 }
        ]
      },
      description: "Standard top-grade nitrogen fertilizer (46-0-0) ideal for intensive cereal production. Promotes lush dark-green vegetative growth and rapid tillering in rice paddy and wheat.",
      images: [
        "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=600&q=80"
      ]
    },
    {
      id: "prod-mahindra-tractor",
      name: "Tractor (Mahindra 575)",
      category: "Equipment",
      price: 6.02, // ₹500 / hour (at exchange rate 83)
      unit: "hour",
      rating: 4.95,
      reviewsCount: 38,
      reviews: [
        { author: "Rajesh Patel", rating: 5, text: "Excellent fuel efficiency and solid traction on wet mud.", date: "2026-06-12", verified: true }
      ],
      supplier: "Mahindra Training Academy",
      supplierLocation: "Local Machinery Yard",
      supplierRating: 4.9,
      supplierProductsSold: 1200,
      certification: "TEMA Standard Safety Certified",
      isGovApproved: true,
      popularityCount: 890,
      distance: 1.5,
      returnPolicy: "Free breakdown replacement in 1 hour",
      warranty: "Serviced & insured by Mahindra",
      stockLevel: "In Stock",
      maxStock: 10,
      nearbyStock: [
        { dealer: "Local Machinery Yard", distance: 1.5, stock: 10, price: 6.02 }
      ],
      aiMatchReason: "Highly recommended for fast tilling, field leveling, and heavy carting under current wet soils.",
      priceForecast: {
        recommendation: "Buy Now",
        reason: "Peak sowing hours starting soon, book your reservation early.",
        trendData: [
          { month: "May", historicalPrice: 5.8 },
          { month: "Jun", historicalPrice: 5.9 },
          { month: "Jul (Now)", historicalPrice: 6.02, projectedPrice: 6.02 }
        ]
      },
      description: "Powerful 47 HP tractor optimized for high torque, smooth gear shifting, and extreme fuel savings. Complete with heavy rotary tiller and deep-soil leveling plow attachments.",
      images: [
        "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80"
      ]
    },
    {
      id: "prod-1",
      name: "Pre-Vigor F1 Hybrid Tomato Seeds",
      category: "Seeds",
      price: 18.5,
      discountPercent: 15,
      unit: "pack (500 seeds)",
      rating: 4.8,
      reviewsCount: 34,
      reviews: [
        { author: "Gurdev S.", rating: 5, text: "Outstanding germination rate (above 96%). Vigorous vines.", date: "2026-05-12", verified: true },
        { author: "Ramesh P.", rating: 4, text: "High yield, but needs solid trellis support.", date: "2026-06-01", verified: true }
      ],
      supplier: "Saraswati Agro-Seeds Ltd",
      supplierLocation: "Vijayawada Rural Hub",
      supplierRating: 4.9,
      supplierProductsSold: 18200,
      certification: "APEDA Quality Seed Stamp #A-483",
      isGovApproved: true,
      popularityCount: 1540,
      distance: 4.2,
      returnPolicy: "30-Day Germination Performance Guarantee (Free return/replace if germination < 90%)",
      warranty: "Germination viability guaranteed for 12 months in sealed storage",
      stockLevel: "In Stock",
      maxStock: 85,
      nearbyStock: [
        { dealer: "Vijayawada Farmers Co-op", distance: 4.2, stock: 45, price: 18.0 },
        { dealer: "Precision Agri-Inputs Guntur", distance: 12.8, stock: 150, price: 18.5 }
      ],
      aiMatchReason: "Optimal match for your active Tomato crop. Supports high-density vertical row farming.",
      priceForecast: {
        recommendation: "Buy Now",
        reason: "Seed supply projected to tighten next month ahead of the major sowing window, causing a 12% price hike.",
        trendData: [
          { month: "Mar", historicalPrice: 17.5 },
          { month: "Apr", historicalPrice: 17.8 },
          { month: "May", historicalPrice: 18.2 },
          { month: "Jun (Now)", historicalPrice: 18.5, projectedPrice: 18.5 },
          { month: "Jul (Proj)", historicalPrice: 20.2, projectedPrice: 20.2 },
          { month: "Aug (Proj)", historicalPrice: 21.0, projectedPrice: 21.0 }
        ]
      },
      description: "Premium high-germination F1 hybrid seeds specifically cross-bred for high heat tolerance and disease resistance. Best suited for early summer planting in well-aerated sandy loam and clay loam sectors.",
      images: [
        "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1591857172899-41d9024aaee9?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80"
      ]
    },
    {
      id: "prod-2",
      name: "Bio-Organic Nitrogen Booster",
      category: "Fertilizers",
      price: 34.0,
      discountPercent: 10,
      unit: "bag (25 kg)",
      rating: 4.6,
      reviewsCount: 52,
      reviews: [
        { author: "Sukhwinder S.", rating: 5, text: "Very gentle release. Leaf color improved in 5 days.", date: "2026-04-20", verified: true },
        { author: "Amit K.", rating: 4, text: "No burning compared to urea. Great organic supplement.", date: "2026-05-28", verified: true }
      ],
      supplier: "Prithvi Organic Inputs",
      supplierLocation: "Nellore Eco Park",
      supplierRating: 4.7,
      supplierProductsSold: 9400,
      certification: "NPOP National Organic Standard Certified",
      isGovApproved: true,
      popularityCount: 980,
      distance: 4.2,
      returnPolicy: "14-Day Unopened bag hassle-free returns",
      warranty: "Nutrient analysis guaranteed; 2-year chemical stability warranty",
      stockLevel: "In Stock",
      maxStock: 250,
      nearbyStock: [
        { dealer: "Vijayawada Farmers Co-op", distance: 4.2, stock: 120, price: 33.5 },
        { dealer: "Machilipatnam Agro Hub", distance: 8.5, stock: 80, price: 34.0 }
      ],
      aiMatchReason: "Highly recommended for nitrogen replenishment in Clay Loam soil to prevent compaction yellowing.",
      priceForecast: {
        recommendation: "Wait",
        reason: "Global urea import subsidies starting in 10 days will drive down organic/inorganic fertilizer prices by ~10%.",
        trendData: [
          { month: "Mar", historicalPrice: 38.0 },
          { month: "Apr", historicalPrice: 36.5 },
          { month: "May", historicalPrice: 35.0 },
          { month: "Jun (Now)", historicalPrice: 34.0, projectedPrice: 34.0 },
          { month: "Jul (Proj)", historicalPrice: 31.2, projectedPrice: 31.2 },
          { month: "Aug (Proj)", historicalPrice: 30.5, projectedPrice: 30.5 }
        ]
      },
      description: "An advanced slow-release nitrogen pellet fertilizer derived entirely from natural plant meals and soil micro-flora inoculants. Rapidly rebuilds humic compounds and prevents nitrogen runoffs in heavily irrigated fields.",
      images: [
        "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80"
      ]
    },
    {
      id: "prod-3",
      name: "Copper-Shield Bio-Fungicide",
      category: "Pesticides",
      price: 22.8,
      unit: "bottle (1 Liter)",
      rating: 4.9,
      reviewsCount: 19,
      reviews: [
        { author: "Eswar R.", rating: 5, text: "Completely arrested my tomato early blight outbreak within 36 hours. Best copper formula.", date: "2026-06-15", verified: true }
      ],
      supplier: "Apex Plant Protection",
      supplierLocation: "Guntur Chemical Zone",
      supplierRating: 4.5,
      supplierProductsSold: 12100,
      certification: "Govt Insecticides Act Approved (No. G-9284)",
      isGovApproved: true,
      popularityCount: 2100,
      distance: 8.5,
      returnPolicy: "Full refund if packaging seal arrives damaged",
      warranty: "24-month expiry from manufacturing date",
      stockLevel: "Low Stock",
      maxStock: 15,
      nearbyStock: [
        { dealer: "Machilipatnam Agro Hub", distance: 8.5, stock: 3, price: 24.0 },
        { dealer: "Precision Agri-Inputs Guntur", distance: 12.8, stock: 12, price: 22.8 }
      ],
      aiMatchReason: "Perfect match! Direct remediation target for suspected Tomato Early Blight pathogens.",
      priceForecast: {
        recommendation: "Strong Buy",
        reason: "Monsoon humidity spikes are initiating active fungal spore alerts across the region. Demand is surging, stocks are critical.",
        trendData: [
          { month: "Mar", historicalPrice: 21.0 },
          { month: "Apr", historicalPrice: 21.5 },
          { month: "May", historicalPrice: 22.0 },
          { month: "Jun (Now)", historicalPrice: 22.8, projectedPrice: 22.8 },
          { month: "Jul (Proj)", historicalPrice: 26.5, projectedPrice: 26.5 },
          { month: "Aug (Proj)", historicalPrice: 28.0, projectedPrice: 28.0 }
        ]
      },
      description: "Water-soluble micro-granular copper formulation designed to establish a persistent physical barrier on leaf surfaces. Highly resilient against heavy rain washes, offering up to 14 days of protective coverage.",
      images: [
        "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1463121088476-3ff21008f2a2?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80"
      ]
    },
    {
      id: "prod-4",
      name: "Smart Micro-Drip Irrigation Kit",
      category: "Irrigation",
      price: 185.0,
      unit: "kit (covers 0.5 acre)",
      rating: 4.7,
      reviewsCount: 28,
      reviews: [
        { author: "Baldev D.", rating: 5, text: "Halved my water bills. Easy installation with push-fit components.", date: "2026-03-10", verified: true }
      ],
      supplier: "Neer-Agri Water Tech",
      supplierLocation: "Pathankot Irrigation Center",
      supplierRating: 4.6,
      supplierProductsSold: 5400,
      certification: "BIS Certified (IS:12786) / Govt Subsidy Approved",
      isGovApproved: true,
      popularityCount: 880,
      distance: 12.8,
      returnPolicy: "30-Day trial returns (buyer pays shipping)",
      warranty: "3-Year UV degradation warranty on emitter lines & flow nodes",
      stockLevel: "In Stock",
      maxStock: 30,
      nearbyStock: [
        { dealer: "Precision Agri-Inputs Guntur", distance: 12.8, stock: 25, price: 180.0 }
      ],
      aiMatchReason: "Essential upgrade for your clay-loam sectors to avoid waterlogged root zones and root rot.",
      priceForecast: {
        recommendation: "Buy Now",
        reason: "Irrigation metal and polymer tariffs scheduled to rise next month. Prices stable now but set to increase by 8%.",
        trendData: [
          { month: "Mar", historicalPrice: 180.0 },
          { month: "Apr", historicalPrice: 182.0 },
          { month: "May", historicalPrice: 185.0 },
          { month: "Jun (Now)", historicalPrice: 185.0, projectedPrice: 185.0 },
          { month: "Jul (Proj)", historicalPrice: 198.0, projectedPrice: 198.0 },
          { month: "Aug (Proj)", historicalPrice: 200.0, projectedPrice: 200.0 }
        ]
      },
      description: "A complete heavy-duty 5-row drip line system with integrated pressure-compensating emitters. Includes sub-main pipe connectors, pressure regulators, and water-saving control manifolds designed to optimize sub-surface crop hydration.",
      images: [
        "https://images.unsplash.com/photo-1413868631112-92147318ecf3?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80"
      ]
    },
    {
      id: "prod-5",
      name: "Premium Vermicompost Blend",
      category: "Organic Inputs",
      price: 15.0,
      unit: "bag (50 kg)",
      rating: 4.5,
      reviewsCount: 41,
      reviews: [
        { author: "Harman S.", rating: 5, text: "Excellent humic acid levels. Great soil conditioner.", date: "2026-05-30", verified: true }
      ],
      supplier: "GreenEarth Bio-Inputs",
      supplierLocation: "Hoshiarpur Organic Farmstead",
      supplierRating: 4.8,
      supplierProductsSold: 11000,
      certification: "Vedic Farming Guild Certified Organic",
      isGovApproved: true,
      popularityCount: 1100,
      distance: 4.2,
      returnPolicy: "No return on open soil/compost bags unless mold is present",
      warranty: "100% pure worm castings guaranteed; shelf stable for 6 months",
      stockLevel: "In Stock",
      maxStock: 300,
      nearbyStock: [
        { dealer: "Vijayawada Farmers Co-op", distance: 4.2, stock: 300, price: 14.5 },
        { dealer: "Machilipatnam Agro Hub", distance: 8.5, stock: 110, price: 15.0 }
      ],
      aiMatchReason: "Will improve biological aeration and nutrient holding in hard clay loam soil layers.",
      priceForecast: {
        recommendation: "Wait",
        reason: "Local municipal compost processing plants are doubling capacity, creating a regional organic input surplus next month.",
        trendData: [
          { month: "Mar", historicalPrice: 16.5 },
          { month: "Apr", historicalPrice: 16.0 },
          { month: "May", historicalPrice: 15.5 },
          { month: "Jun (Now)", historicalPrice: 15.0, projectedPrice: 15.0 },
          { month: "Jul (Proj)", historicalPrice: 13.5, projectedPrice: 13.5 },
          { month: "Aug (Proj)", historicalPrice: 12.8, projectedPrice: 12.8 }
        ]
      },
      description: "100% pure organic worm castings fortified with custom strains of mycorrhizal fungi. Exceptionally rich in stable humic matter and plant growth regulators. Drastically improves seed germination and active water retention.",
      images: [
        "https://images.unsplash.com/photo-1595155554625-f376f6291771?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80"
      ]
    },
    {
      id: "prod-6",
      name: "Solar-Powered Ultrasonic Pest Repeller",
      category: "Equipment",
      price: 45.0,
      unit: "unit",
      rating: 4.4,
      reviewsCount: 15,
      reviews: [
        { author: "Kartar S.", rating: 4, text: "Keeps wild rodents away from grain stores quite effectively.", date: "2026-06-05", verified: true }
      ],
      supplier: "AgriShield Electronic Solutions",
      supplierLocation: "Mohali High-Tech Zone",
      supplierRating: 4.3,
      supplierProductsSold: 3200,
      certification: "CE Certified / FCC Compliant",
      isGovApproved: false,
      popularityCount: 320,
      distance: 12.8,
      returnPolicy: "45-Day risk free trial. Full refund if pests don't diminish.",
      warranty: "2-Year full electrical & solar panel warranty replacement",
      stockLevel: "In Stock",
      maxStock: 50,
      nearbyStock: [
        { dealer: "Precision Agri-Inputs Guntur", distance: 12.8, stock: 15, price: 45.0 }
      ],
      aiMatchReason: "Recommended tool to protect grain assets and chore barns from vermin pressure.",
      priceForecast: {
        recommendation: "Buy Now",
        reason: "Component shortages are causing delayed imports. Price expected to remain steady but lead times will double.",
        trendData: [
          { month: "Mar", historicalPrice: 42.0 },
          { month: "Apr", historicalPrice: 43.5 },
          { month: "May", historicalPrice: 45.0 },
          { month: "Jun (Now)", historicalPrice: 45.0, projectedPrice: 45.0 },
          { month: "Jul (Proj)", historicalPrice: 45.0, projectedPrice: 45.0 },
          { month: "Aug (Proj)", historicalPrice: 46.5, projectedPrice: 46.5 }
        ]
      },
      description: "Autonomous pest control device designed to emit low-frequency variable ultrasonic pulses. Effective range up to 400 square meters. Weatherproof solar casing keeps the system running 24/7 in harsh outdoor conditions.",
      images: [
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80"
      ]
    },
    {
      id: "prod-7",
      name: "Sovereign Basmati Paddy Seeds #370",
      category: "Seeds",
      price: 24.0,
      unit: "pack (10 kg)",
      rating: 4.9,
      reviewsCount: 88,
      reviews: [
        { author: "Gurmail S.", rating: 5, text: "Excellent resistance to bacterial blight. Beautiful long grains.", date: "2026-06-11", verified: true }
      ],
      supplier: "Saraswati Agro-Seeds Ltd",
      supplierLocation: "Vijayawada Rural Hub",
      supplierRating: 4.9,
      supplierProductsSold: 18200,
      certification: "APEDA Quality Seed Stamp #A-370",
      isGovApproved: true,
      popularityCount: 3200,
      distance: 6.5,
      returnPolicy: "15-Day Unopened bag exchange",
      warranty: "Germination viability guaranteed for 12 months",
      stockLevel: "In Stock",
      maxStock: 120,
      nearbyStock: [
        { dealer: "Machilipatnam Agro Hub", distance: 6.5, stock: 200, price: 23.5 }
      ],
      aiMatchReason: "High compatibility with wet clay-loam sectors. Excellent flood tolerance indicators.",
      priceForecast: {
        recommendation: "Strong Buy",
        reason: "Early monsoon projections are boosting basmati export prospects, set to raise local seed rates by 15% soon.",
        trendData: [
          { month: "Mar", historicalPrice: 22.0 },
          { month: "Apr", historicalPrice: 22.5 },
          { month: "May", historicalPrice: 23.0 },
          { month: "Jun (Now)", historicalPrice: 24.0, projectedPrice: 24.0 },
          { month: "Jul (Proj)", historicalPrice: 27.5, projectedPrice: 27.5 },
          { month: "Aug (Proj)", historicalPrice: 28.0, projectedPrice: 28.0 }
        ]
      },
      description: "Certified high-grade Basmati paddy seeds with outstanding elongation and premium aroma potential. Highly resistant to stem-borers and lodging, ensuring massive crop density in irrigated lowlands.",
      images: [
        "https://images.unsplash.com/photo-1536882240095-0379873feb4e?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80"
      ]
    },
    {
      id: "prod-8",
      name: "Azadirachtin Cold-Pressed Neem Spray",
      category: "Pesticides",
      price: 15.5,
      unit: "bottle (1 Liter)",
      rating: 4.7,
      reviewsCount: 65,
      reviews: [
        { author: "Daljit K.", rating: 5, text: "Very effective against whiteflies and aphids without harming ladybugs.", date: "2026-05-18", verified: true }
      ],
      supplier: "Prithvi Organic Inputs",
      supplierLocation: "Nellore Eco Park",
      supplierRating: 4.7,
      supplierProductsSold: 9400,
      certification: "Govt Insecticides Act Approved (No. N-4911)",
      isGovApproved: true,
      popularityCount: 1800,
      distance: 3.1,
      returnPolicy: "30-Day refund if unopened",
      warranty: "18-month storage stability guarantee",
      stockLevel: "In Stock",
      maxStock: 200,
      nearbyStock: [
        { dealer: "Vijayawada Farmers Co-op", distance: 3.1, stock: 85, price: 15.0 }
      ],
      aiMatchReason: "Zero-residue botanical pest solution recommended for organic crop protection plans.",
      priceForecast: {
        recommendation: "Buy Now",
        reason: "Supplies stable from raw seed crushers, price index expected to remain flat over the next quarter.",
        trendData: [
          { month: "Mar", historicalPrice: 15.0 },
          { month: "Apr", historicalPrice: 15.2 },
          { month: "May", historicalPrice: 15.5 },
          { month: "Jun (Now)", historicalPrice: 15.5, projectedPrice: 15.5 },
          { month: "Jul (Proj)", historicalPrice: 15.6, projectedPrice: 15.6 },
          { month: "Aug (Proj)", historicalPrice: 15.8, projectedPrice: 15.8 }
        ]
      },
      description: "High-concentration, cold-pressed biodegradable neem solution. Controls over 200 species of sucking and chewing pests while completely maintaining ecological safety for natural bees and earthworms.",
      images: [
        "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1463121088476-3ff21008f2a2?auto=format&fit=crop&w=600&q=80"
      ]
    },
    {
      id: "prod-9",
      name: "Heavy-Duty Ergonomic Seed Planter",
      category: "Equipment",
      price: 115.0,
      unit: "unit",
      rating: 4.5,
      reviewsCount: 22,
      reviews: [
        { author: "Jagdev S.", rating: 4, text: "Saves massive labor hours. Smooth depth adjustment triggers.", date: "2026-04-12", verified: true }
      ],
      supplier: "AgriShield Electronic Solutions",
      supplierLocation: "Mohali High-Tech Zone",
      supplierRating: 4.3,
      supplierProductsSold: 3200,
      certification: "National Agricultural Machinery Approved",
      isGovApproved: true,
      popularityCount: 650,
      distance: 9.8,
      returnPolicy: "30-Day manufacturing fault replacement",
      warranty: "1-Year structural iron framework warranty",
      stockLevel: "In Stock",
      maxStock: 20,
      nearbyStock: [
        { dealer: "Machilipatnam Agro Hub", distance: 9.8, stock: 12, price: 112.0 }
      ],
      aiMatchReason: "Perfect manual implement to complete precise depth-regulated seed planting.",
      priceForecast: {
        recommendation: "Wait",
        reason: "Local supplier is running a promotional 10% discount campaign next month.",
        trendData: [
          { month: "Mar", historicalPrice: 120.0 },
          { month: "Apr", historicalPrice: 118.0 },
          { month: "May", historicalPrice: 115.0 },
          { month: "Jun (Now)", historicalPrice: 115.0, projectedPrice: 115.0 },
          { month: "Jul (Proj)", historicalPrice: 103.5, projectedPrice: 103.5 },
          { month: "Aug (Proj)", historicalPrice: 105.0, projectedPrice: 105.0 }
        ]
      },
      description: "Robust hand-held seed planter with custom seed wheels and single-button spring-loaded injection. Substantially reduces back strain and guarantees a precise planting depth across hard soils.",
      images: [
        "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80"
      ]
    },
    {
      id: "prod-10",
      name: "Automatic Siphon Irrigation Valve",
      category: "Irrigation",
      price: 29.0,
      unit: "unit",
      rating: 4.1,
      reviewsCount: 8,
      reviews: [
        { author: "Karamjit R.", rating: 4, text: "Good valve, but instruction manual was slightly unclear.", date: "2026-06-25", verified: false }
      ],
      supplier: "Neer-Agri Water Tech",
      supplierLocation: "Pathankot Irrigation Center",
      supplierRating: 4.6,
      supplierProductsSold: 5400,
      certification: "BIS Certified (IS:9481)",
      isGovApproved: true,
      popularityCount: 150,
      distance: 18.2,
      returnPolicy: "14-Day returns policy",
      warranty: "6-Month operational seal warranty",
      stockLevel: "Out of Stock",
      maxStock: 0,
      nearbyStock: [
        { dealer: "Precision Agri-Inputs Guntur", distance: 18.2, stock: 0, price: 29.0 }
      ],
      aiMatchReason: "Allows automatic gravity feed control in low-pressure micro-dam outlets.",
      priceForecast: {
        recommendation: "Wait",
        reason: "Factory batch restock expected in 20 days which will normalize back-order premium rates.",
        trendData: [
          { month: "Mar", historicalPrice: 28.0 },
          { month: "Apr", historicalPrice: 28.5 },
          { month: "May", historicalPrice: 29.0 },
          { month: "Jun (Now)", historicalPrice: 29.0, projectedPrice: 29.0 },
          { month: "Jul (Proj)", historicalPrice: 27.0, projectedPrice: 27.0 },
          { month: "Aug (Proj)", historicalPrice: 27.0, projectedPrice: 27.0 }
        ]
      },
      description: "Heavy-duty anti-siphon valve featuring automatic air vents and custom non-corrosive seals. Specifically built for high-performance municipal and private agricultural pond flow regulation.",
      images: [
        "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1413868631112-92147318ecf3?auto=format&fit=crop&w=600&q=80"
      ]
    },
    {
      id: "prod-11",
      name: "Liquid Seaweed Extract Bio-Stimulant",
      category: "Organic Inputs",
      price: 27.0,
      unit: "bottle (1 Liter)",
      rating: 4.8,
      reviewsCount: 47,
      reviews: [
        { author: "Hardev S.", rating: 5, text: "Outstanding growth accelerator. Great trace minerals profile.", date: "2026-05-24", verified: true }
      ],
      supplier: "GreenEarth Bio-Inputs",
      supplierLocation: "Hoshiarpur Organic Farmstead",
      supplierRating: 4.8,
      supplierProductsSold: 11000,
      certification: "NPOP Organic Inputs Approved #O-119",
      isGovApproved: true,
      popularityCount: 1400,
      distance: 5.0,
      returnPolicy: "No-hassle 30-day unopened returns",
      warranty: "24-month high performance enzymatic stability guarantee",
      stockLevel: "In Stock",
      maxStock: 150,
      nearbyStock: [
        { dealer: "Vijayawada Farmers Co-op", distance: 5.0, stock: 40, price: 26.5 }
      ],
      aiMatchReason: "Provides micro-nutrients & amino acids to alleviate transplantation shock in young seedlings.",
      priceForecast: {
        recommendation: "Buy Now",
        reason: "Raw kelp supply limits are predicted to escalate import costs by 8% over summer months.",
        trendData: [
          { month: "Mar", historicalPrice: 25.0 },
          { month: "Apr", historicalPrice: 26.0 },
          { month: "May", historicalPrice: 27.0 },
          { month: "Jun (Now)", historicalPrice: 27.0, projectedPrice: 27.0 },
          { month: "Jul (Proj)", historicalPrice: 29.1, projectedPrice: 29.1 },
          { month: "Aug (Proj)", historicalPrice: 29.5, projectedPrice: 29.5 }
        ]
      },
      description: "Concentrated marine seaweed solution containing high counts of naturally occurring cytokinins and gibberellins. Activates dormant plant cells and significantly accelerates metabolic nutrient updates.",
      images: [
        "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80"
      ]
    },
    {
      id: "prod-12",
      name: "Sulphate of Potash Soluble Fertilizer",
      category: "Fertilizers",
      price: 42.5,
      unit: "bag (25 kg)",
      rating: 4.3,
      reviewsCount: 12,
      reviews: [
        { author: "Harchand B.", rating: 4, text: "Quickly corrects potassium deficiency in basmati plots.", date: "2026-06-03", verified: true }
      ],
      supplier: "Saraswati Agro-Seeds Ltd",
      supplierLocation: "Vijayawada Rural Hub",
      supplierRating: 4.9,
      supplierProductsSold: 18200,
      certification: "FCI Quality Inspected Grade",
      isGovApproved: false,
      popularityCount: 450,
      distance: 15.0,
      returnPolicy: "14-Day unopened bag return",
      warranty: "100% nutrient guarantees",
      stockLevel: "Low Stock",
      maxStock: 8,
      nearbyStock: [
        { dealer: "Precision Agri-Inputs Guntur", distance: 15.0, stock: 4, price: 42.5 }
      ],
      aiMatchReason: "Helps solidify starch granules and strengthens basmati straw from lodging risks.",
      priceForecast: {
        recommendation: "Wait",
        reason: "Potash shipments at ports are clearing backlog, rates likely to fall slightly in July.",
        trendData: [
          { month: "Mar", historicalPrice: 45.0 },
          { month: "Apr", historicalPrice: 44.0 },
          { month: "May", historicalPrice: 43.0 },
          { month: "Jun (Now)", historicalPrice: 42.5, projectedPrice: 42.5 },
          { month: "Jul (Proj)", historicalPrice: 40.0, projectedPrice: 40.0 },
          { month: "Aug (Proj)", historicalPrice: 39.5, projectedPrice: 39.5 }
        ]
      },
      description: "Premium grade soluble Sulphate of Potash (SOP) containing high sulfur levels and zero chloride. Reinvigorates chlorophyll creation and drastically reduces basmati crop lodging risk.",
      images: [
        "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80"
      ]
    }
  ];

  // States
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0].id);
  const [purchaseQty, setPurchaseQty] = useState<number>(10);
  const [deliverySpeed, setDeliverySpeed] = useState<"standard" | "express" | "drone">("standard");
  const [purchaseType, setPurchaseType] = useState<"one-time" | "subscription">("one-time");
  const [subscriptionInterval, setSubscriptionInterval] = useState<"monthly" | "quarterly">("monthly");
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [onlyAiMatches, setOnlyAiMatches] = useState<boolean>(false);

  // Advanced Filters & Sort State
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [minRating, setMinRating] = useState<number>(1);
  const [govApprovedOnly, setGovApprovedOnly] = useState<boolean>(false);
  const [maxDistance, setMaxDistance] = useState<number>(20);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("popularity"); // price-asc, price-desc, rating-desc, popularity

  // 4.2 Product Detail State Additions
  const [activeImgIdx, setActiveImgIdx] = useState<number>(0);
  const [cart, setCart] = useState<{ id: string; product: Product; qty: number; purchaseType: "one-time" | "subscription"; interval?: string; deliverySpeed: string; total: number }[]>([]);
  const [dynamicReviews, setDynamicReviews] = useState<Record<string, { author: string; rating: number; text: string; date: string; verified: boolean }[]>>({});
  const [reviewRatingFilter, setReviewRatingFilter] = useState<number | "All">("All");
  const [newReviewAuthor, setNewReviewAuthor] = useState<string>("");
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewText, setNewReviewText] = useState<string>("");
  const [isVerifiedBuyer, setIsVerifiedBuyer] = useState<boolean>(true);
  const [showReviewSuccess, setShowReviewSuccess] = useState<boolean>(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [checkoutModalStep, setCheckoutModalStep] = useState<"confirm" | "success">("confirm");

  // 4.3 & 4.4 Shopping Cart & Checkout States & Helpers
  const [activeMarketTab, setActiveMarketTab] = useState<"catalog" | "cart" | "orders" | "suppliers">("catalog");

  // 4.6 Supplier Ratings & Reviews State
  const [suppliersList, setSuppliersList] = useState([
    {
      id: "sup-1",
      name: "Saraswati Agro-Seeds Ltd",
      location: "Vijayawada Rural Hub",
      productsSold: 18200,
      reviews: [
        { author: "Gurdev S.", rating: 5, text: "Outstanding seed viability (above 96%). Excellent support.", date: "2026-05-12", photo: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=150&q=80" },
        { author: "Ramesh P.", rating: 4, text: "High germination rate, but delivery was delayed by a day.", date: "2026-06-01", photo: null },
        { author: "Sohan L.", rating: 5, text: "Best hybrid seeds in the Vijayawada region. High resistance.", date: "2026-06-20", photo: null }
      ]
    },
    {
      id: "sup-2",
      name: "Prithvi Organic Inputs",
      location: "Guntur Co-op Center",
      productsSold: 12500,
      reviews: [
        { author: "Baljit S.", rating: 5, text: "Their nitrogen booster did wonders for my paddy fields. Clean, chemical-free compost.", date: "2026-05-18", photo: null },
        { author: "Gurpreet D.", rating: 4, text: "Excellent compost. Fast delivery to Nellore.", date: "2026-06-15", photo: null }
      ]
    },
    {
      id: "sup-3",
      name: "Apex Plant Protection",
      location: "Kurnool Chemical Mandi",
      productsSold: 9400,
      reviews: [
        { author: "Harman S.", rating: 4, text: "Affordable bio-pesticides. Kept whiteflies fully under control.", date: "2026-05-22", photo: null }
      ]
    },
    {
      id: "sup-4",
      name: "Neer-Agri Water Tech",
      location: "Nellore Industrial Area",
      productsSold: 6100,
      reviews: [
        { author: "Jasbir S.", rating: 5, text: "Durable drip tubes. Saved nearly 30% water this season.", date: "2026-06-01", photo: null }
      ]
    }
  ]);

  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("sup-1");
  const [newSupplierReviewAuthor, setNewSupplierReviewAuthor] = useState<string>("");
  const [newSupplierReviewRating, setNewSupplierReviewRating] = useState<number>(5);
  const [newSupplierReviewText, setNewSupplierReviewText] = useState<string>("");
  const [newSupplierReviewPhoto, setNewSupplierReviewPhoto] = useState<string | null>(null);
  const [supplierReviewSuccess, setSupplierReviewSuccess] = useState<boolean>(false);

  // 4.5 Order History & Return States
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "COOP-ORD-209481",
      date: "June 20, 2026",
      items: [
        {
          id: "item-1",
          product: {
            id: "prod-1",
            name: "Pre-Vigor F1 Hybrid Tomato Seeds",
            category: "Seeds",
            price: 18.5,
            unit: "pack (500 seeds)",
            rating: 4.8,
            reviewsCount: 34,
            reviews: [],
            supplier: "Saraswati Agro-Seeds Ltd",
            supplierLocation: "Vijayawada Rural Hub",
            supplierRating: 4.9,
            supplierProductsSold: 18200,
            certification: "APEDA Quality Seed Stamp #A-483",
            isGovApproved: true,
            popularityCount: 1540,
            distance: 4.2,
            returnPolicy: "30-Day Germination Performance Guarantee",
            warranty: "Germination viability guaranteed for 12 months",
            stockLevel: "In Stock",
            maxStock: 85,
            nearbyStock: [],
            aiMatchReason: "",
            priceForecast: { recommendation: "Buy Now", reason: "", trendData: [] },
            description: "Premium seeds",
            images: ["https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80"]
          },
          qty: 2,
          deliverySpeed: "express",
          priceRupees: Math.round(18.5 * 83)
        },
        {
          id: "item-2",
          product: {
            id: "prod-2",
            name: "Bio-Organic Nitrogen Booster",
            category: "Fertilizers",
            price: 34.0,
            unit: "bag (25 kg)",
            rating: 4.6,
            reviewsCount: 52,
            reviews: [],
            supplier: "Prithvi Organic Inputs",
            supplierLocation: "Nellore Eco Park",
            supplierRating: 4.7,
            supplierProductsSold: 9400,
            certification: "NPOP National Organic Standard Certified",
            isGovApproved: true,
            popularityCount: 980,
            distance: 4.2,
            returnPolicy: "14-Day unopened returns",
            warranty: "2-year chemical stability warranty",
            stockLevel: "In Stock",
            maxStock: 250,
            nearbyStock: [],
            aiMatchReason: "",
            priceForecast: { recommendation: "Wait", reason: "", trendData: [] },
            description: "Organic nitrogen booster",
            images: ["https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80"]
          },
          qty: 1,
          deliverySpeed: "standard",
          priceRupees: Math.round(34.0 * 83)
        }
      ],
      subtotalRupees: Math.round(18.5 * 2 * 83) + Math.round(34.0 * 1 * 83),
      discountRupees: 500,
      taxRupees: 270,
      shippingRupees: 350,
      totalRupees: Math.round(18.5 * 2 * 83) + Math.round(34.0 * 1 * 83) - 500 + 270 + 350,
      status: "Delivered",
      shippingAddress: {
        name: "Gurdev Singh (Primary)",
        phone: "+91 98765-43210",
        addressLine: "H.No 142, Street 3, Near Co-op Society",
        city: "Vijayawada",
        state: "Andhra Pradesh",
        pincode: "143001"
      },
      paymentMethod: "UPI (BHIM Gateway)",
      trackingNumber: "TRK-COOP-829471924"
    },
    {
      id: "COOP-ORD-748102",
      date: "July 01, 2026",
      items: [
        {
          id: "item-3",
          product: {
            id: "prod-2",
            name: "Bio-Organic Nitrogen Booster",
            category: "Fertilizers",
            price: 34.0,
            unit: "bag (25 kg)",
            rating: 4.6,
            reviewsCount: 52,
            reviews: [],
            supplier: "Prithvi Organic Inputs",
            supplierLocation: "Nellore Eco Park",
            supplierRating: 4.7,
            supplierProductsSold: 9400,
            certification: "NPOP National Organic Standard Certified",
            isGovApproved: true,
            popularityCount: 980,
            distance: 4.2,
            returnPolicy: "14-Day unopened returns",
            warranty: "2-year chemical stability warranty",
            stockLevel: "In Stock",
            maxStock: 250,
            nearbyStock: [],
            aiMatchReason: "",
            priceForecast: { recommendation: "Wait", reason: "", trendData: [] },
            description: "Organic nitrogen booster",
            images: ["https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80"]
          },
          qty: 1,
          deliverySpeed: "drone",
          priceRupees: Math.round(34.0 * 83)
        }
      ],
      subtotalRupees: Math.round(34.0 * 1 * 83),
      discountRupees: 0,
      taxRupees: 141,
      shippingRupees: 1660,
      totalRupees: Math.round(34.0 * 1 * 83) + 141 + 1660,
      status: "Shipped",
      shippingAddress: {
        name: "Gurdev Singh (Primary)",
        phone: "+91 98765-43210",
        addressLine: "H.No 142, Street 3, Near Co-op Society",
        city: "Vijayawada",
        state: "Andhra Pradesh",
        pincode: "143001"
      },
      paymentMethod: "Co-op Credit Card",
      trackingNumber: "TRK-COOP-104928124"
    },
    {
      id: "COOP-ORD-928471",
      date: "July 03, 2026",
      items: [
        {
          id: "item-4",
          product: {
            id: "prod-1",
            name: "Pre-Vigor F1 Hybrid Tomato Seeds",
            category: "Seeds",
            price: 18.5,
            unit: "pack (500 seeds)",
            rating: 4.8,
            reviewsCount: 34,
            reviews: [],
            supplier: "Saraswati Agro-Seeds Ltd",
            supplierLocation: "Vijayawada Rural Hub",
            supplierRating: 4.9,
            supplierProductsSold: 18200,
            certification: "APEDA Quality Seed Stamp #A-483",
            isGovApproved: true,
            popularityCount: 1540,
            distance: 4.2,
            returnPolicy: "30-Day Germination Performance Guarantee",
            warranty: "Germination viability guaranteed for 12 months",
            stockLevel: "In Stock",
            maxStock: 85,
            nearbyStock: [],
            aiMatchReason: "",
            priceForecast: { recommendation: "Buy Now", reason: "", trendData: [] },
            description: "Premium seeds",
            images: ["https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80"]
          },
          qty: 1,
          deliverySpeed: "standard",
          priceRupees: Math.round(18.5 * 83)
        }
      ],
      subtotalRupees: Math.round(18.5 * 83),
      discountRupees: 0,
      taxRupees: 77,
      shippingRupees: 414,
      totalRupees: Math.round(18.5 * 83) + 77 + 414,
      status: "Pending",
      shippingAddress: {
        name: "Balwinder Singh (Farm-gate Depot)",
        phone: "+91 87654-32109",
        addressLine: "Kheti Badi Farm, G.T. Road",
        city: "Guntur",
        state: "Andhra Pradesh",
        pincode: "141008"
      },
      paymentMethod: "Cash on Delivery",
      trackingNumber: "TRK-COOP-573918239"
    },
    {
      id: "COOP-ORD-481029",
      date: "May 15, 2026",
      items: [
        {
          id: "item-5",
          product: {
            id: "prod-2",
            name: "Bio-Organic Nitrogen Booster",
            category: "Fertilizers",
            price: 34.0,
            unit: "bag (25 kg)",
            rating: 4.6,
            reviewsCount: 52,
            reviews: [],
            supplier: "Prithvi Organic Inputs",
            supplierLocation: "Nellore Eco Park",
            supplierRating: 4.7,
            supplierProductsSold: 9400,
            certification: "NPOP National Organic Standard Certified",
            isGovApproved: true,
            popularityCount: 980,
            distance: 4.2,
            returnPolicy: "14-Day unopened returns",
            warranty: "2-year chemical stability warranty",
            stockLevel: "In Stock",
            maxStock: 250,
            nearbyStock: [],
            aiMatchReason: "",
            priceForecast: { recommendation: "Wait", reason: "", trendData: [] },
            description: "Organic nitrogen booster",
            images: ["https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80"]
          },
          qty: 3,
          deliverySpeed: "standard",
          priceRupees: Math.round(34.0 * 3 * 83)
        }
      ],
      subtotalRupees: Math.round(34.0 * 3 * 83),
      discountRupees: 800,
      taxRupees: 383,
      shippingRupees: 414,
      totalRupees: Math.round(34.0 * 3 * 83) - 800 + 383 + 414,
      status: "Cancelled",
      shippingAddress: {
        name: "Gurdev Singh (Primary)",
        phone: "+91 98765-43210",
        addressLine: "H.No 142, Street 3, Near Co-op Society",
        city: "Vijayawada",
        state: "Andhra Pradesh",
        pincode: "143001"
      },
      paymentMethod: "Kisan Subsidized Wallet",
      trackingNumber: "TRK-COOP-091823984"
    }
  ]);

  const [selectedOrderId, setSelectedOrderId] = useState<string>("COOP-ORD-209481");
  const [orderFilter, setOrderFilter] = useState<string>("All");

  // Return modal details
  const [isReturnModalOpen, setIsReturnModalOpen] = useState<boolean>(false);
  const [returnOrderId, setReturnOrderId] = useState<string>("");
  const [returnItemSelection, setReturnItemSelection] = useState<Record<string, boolean>>({});
  const [returnReason, setReturnReason] = useState<"Damaged" | "Wrong item" | "Not as described" | "">("");
  const [returnProofPreview, setReturnProofPreview] = useState<string | null>(null);
  const [returnNote, setReturnNote] = useState<string>("");
  const [isSubmittingReturn, setIsSubmittingReturn] = useState<boolean>(false);
  const [returnSuccessMsg, setReturnSuccessMsg] = useState<string>("");
  const [couponInput, setCouponInput] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number; description: string } | null>(null);
  const [couponError, setCouponError] = useState<string>("");
  const [couponSuccess, setCouponSuccess] = useState<string>("");
  const [shippingLocation, setShippingLocation] = useState<string>("Vijayawada");
  const [isCartCheckoutModalOpen, setIsCartCheckoutModalOpen] = useState<boolean>(false);
  const [isDirectCheckout, setIsDirectCheckout] = useState<boolean>(false);
  const [originalCartBeforeDirect, setOriginalCartBeforeDirect] = useState<any[] | null>(null);
  const [cartCheckoutStep, setCartCheckoutStep] = useState<"address" | "payment" | "summary" | "success">("address");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking" | "wallet" | "cod">("upi");
  const [upiIdInput, setUpiIdInput] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpInput, setOtpInput] = useState<string>("");
  const [isProcessingCartCheckout, setIsProcessingCartCheckout] = useState<boolean>(false);

  // 4.4 Checkout States
  const [addressType, setAddressType] = useState<"saved" | "new">("saved");
  const [selectedAddressId, setSelectedAddressId] = useState<number>(1);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    addressLine: "",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    pincode: ""
  });
  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: 1,
      name: "Gurdev Singh (Primary)",
      phone: "+91 98765-43210",
      addressLine: "H.No 142, Street 3, Near Co-op Society",
      city: "Vijayawada",
      state: "Andhra Pradesh",
      pincode: "143001"
    },
    {
      id: 2,
      name: "Balwinder Singh (Farm-gate Depot)",
      phone: "+91 87654-32109",
      addressLine: "Kheti Badi Farm, G.T. Road",
      city: "Guntur",
      state: "Andhra Pradesh",
      pincode: "141008"
    }
  ]);
  const [upiOption, setUpiOption] = useState<"qr" | "collect">("qr");
  const [netBankingBank, setNetBankingBank] = useState<string>("SBI");
  const [walletProvider, setWalletProvider] = useState<string>("Paytm");
  const [cardDetails, setCardDetails] = useState({
    number: "4315 8824 9012 5562",
    expiry: "12/29",
    cvv: "392",
    name: "Gurdev Singh"
  });
  const [cartEstimatedDelivery, setCartEstimatedDelivery] = useState<string>("");
  const [generatedOrderNumber, setGeneratedOrderNumber] = useState<string>("");
  const [trackingStep, setTrackingStep] = useState<number>(0);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState<boolean>(false);

  const closeCartCheckoutModal = () => {
    setIsCartCheckoutModalOpen(false);
    if (isDirectCheckout && originalCartBeforeDirect !== null) {
      setCart(originalCartBeforeDirect);
    }
    setIsDirectCheckout(false);
    setOriginalCartBeforeDirect(null);
  };

  const EXCHANGE_RATE = 83;
  const toRupees = (usd: number) => Math.round(usd * EXCHANGE_RATE);

  const handleDownloadInvoice = (order: Order) => {
    const invoiceContent = `=====================================================
KVP FARMERS COOPERATIVE MARKETPLACE - OFFICIAL INVOICE
=====================================================
Order Number: ${order.id}
Date: ${order.date}
Payment Method: ${order.paymentMethod}
Tracking Number: ${order.trackingNumber}

Shipping Destination:
---------------------
Name: ${order.shippingAddress.name}
Phone: ${order.shippingAddress.phone}
Address: ${order.shippingAddress.addressLine}
City: ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}

Items Purchased:
----------------
${order.items.map(item => `- ${item.product.name} (Qty: ${item.qty}) @ ₹${item.priceRupees.toLocaleString()}/unit = ₹${(item.priceRupees * item.qty).toLocaleString()}`).join("\n")}

Financial Breakdown:
--------------------
Subtotal: ₹${order.subtotalRupees.toLocaleString()}
State & Central Subsidies Applied: -₹${order.discountRupees.toLocaleString()}
Central & State GST (5%): +₹${order.taxRupees.toLocaleString()}
Kisan Drone/Logistics Delivery: +₹${order.shippingRupees.toLocaleString()}
-----------------------------------------------------
GRAND TOTAL PAID: ₹${order.totalRupees.toLocaleString()}
=====================================================
This is a certified digital cooperative invoice under APEDA regulations.
=====================================================`;
    const blob = new Blob([invoiceContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Invoice-${order.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const SHIPPING_LOCATIONS = [
    { name: "Vijayawada", baseCostUsd: 4.99 },
    { name: "Guntur", baseCostUsd: 7.50 },
    { name: "Nellore", baseCostUsd: 6.20 },
    { name: "Patiala", baseCostUsd: 8.99 },
    { name: "Kurnool", baseCostUsd: 11.50 },
    { name: "Firozpur", baseCostUsd: 12.99 },
    { name: "Pathankot", baseCostUsd: 14.50 },
  ];

  const VALID_COUPONS: Record<string, { percent: number; description: string }> = {
    "KISAN15": { percent: 15, description: "15% Special Co-op discount applied successfully!" },
    "GREEN20": { percent: 20, description: "20% Bio-Organic inputs discount applied successfully!" },
    "BUMPER10": { percent: 10, description: "10% Flat Rate subsidy discount applied successfully!" },
    "FREEFALL": { percent: 0, description: "Free standard shipping coupon applied successfully!" }
  };

  // Cart calculations in Rupees (₹)
  const cartSubtotalRupees = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.qty * EXCHANGE_RATE), 0);
  }, [cart]);

  const cartShippingRupees = useMemo(() => {
    if (appliedCoupon?.code === "FREEFALL") return 0;
    const currentLocObj = SHIPPING_LOCATIONS.find(l => l.name === shippingLocation) || { baseCostUsd: 4.99 };
    return cart.reduce((sum, item) => {
      let usdCost = currentLocObj.baseCostUsd;
      if (item.deliverySpeed === "express") usdCost += 7.50;
      if (item.deliverySpeed === "drone") usdCost += 20.00;
      return sum + Math.round(usdCost * EXCHANGE_RATE);
    }, 0);
  }, [cart, shippingLocation, appliedCoupon]);

  const cartDiscountRupees = useMemo(() => {
    if (!appliedCoupon || appliedCoupon.code === "FREEFALL") return 0;
    return Math.round(cartSubtotalRupees * (appliedCoupon.discountPercent / 100));
  }, [cartSubtotalRupees, appliedCoupon]);

  const cartTaxRupees = useMemo(() => {
    // 5% GST (CGST + SGST) on the discounted subtotal
    return Math.round((cartSubtotalRupees - cartDiscountRupees) * 0.05);
  }, [cartSubtotalRupees, cartDiscountRupees]);

  const cartTotalRupees = useMemo(() => {
    return cartSubtotalRupees - cartDiscountRupees + cartTaxRupees + cartShippingRupees;
  }, [cartSubtotalRupees, cartDiscountRupees, cartTaxRupees, cartShippingRupees]);

  const handleApplyCoupon = (code: string) => {
    setCouponError("");
    setCouponSuccess("");
    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode) {
      setCouponError("Please enter a coupon code.");
      return;
    }
    if (VALID_COUPONS[normalizedCode]) {
      const match = VALID_COUPONS[normalizedCode];
      setAppliedCoupon({
        code: normalizedCode,
        discountPercent: match.percent,
        description: match.description
      });
      setCouponSuccess(match.description);
    } else {
      setCouponError("Invalid coupon code. Try KISAN15, GREEN20, BUMPER10 or FREEFALL.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponSuccess("");
    setCouponError("");
  };

  // Sync state helpers
  React.useEffect(() => {
    setActiveImgIdx(0);
    setReviewRatingFilter("All");
    setShowReviewSuccess(false);
  }, [selectedProductId]);

  const selectedProduct = useMemo(() => {
    const match = products.find((p) => p.id === selectedProductId);
    if (match) return match;
    // Fallback to first filtered product or any product
    const categoryFiltered = products.filter(p => selectedCategory === "All" || p.category === selectedCategory);
    return categoryFiltered[0] || products[0];
  }, [selectedProductId, selectedCategory]);

  // Dynamic reviews merge and average calculations
  const activeReviews = useMemo(() => {
    const staticReviews = selectedProduct.reviews;
    const addedReviews = dynamicReviews[selectedProduct.id] || [];
    const merged = [...addedReviews, ...staticReviews];
    
    if (reviewRatingFilter === "All") {
      return merged;
    }
    return merged.filter(r => r.rating === reviewRatingFilter);
  }, [selectedProduct, dynamicReviews, reviewRatingFilter]);

  const activeReviewsCount = useMemo(() => {
    const staticReviews = selectedProduct.reviews;
    const addedReviews = dynamicReviews[selectedProduct.id] || [];
    return staticReviews.length + addedReviews.length;
  }, [selectedProduct, dynamicReviews]);

  const activeRating = useMemo(() => {
    const staticReviews = selectedProduct.reviews;
    const addedReviews = dynamicReviews[selectedProduct.id] || [];
    const merged = [...addedReviews, ...staticReviews];
    if (merged.length === 0) return selectedProduct.rating;
    const sum = merged.reduce((acc, r) => acc + r.rating, 0);
    return parseFloat((sum / merged.length).toFixed(1));
  }, [selectedProduct, dynamicReviews]);

  React.useEffect(() => {
    if (selectedProduct.stockLevel === "Out of Stock") {
      setPurchaseQty(0);
    } else {
      if (purchaseQty > selectedProduct.maxStock) {
        setPurchaseQty(selectedProduct.maxStock);
      } else if (purchaseQty < 1) {
        setPurchaseQty(1);
      }
    }
  }, [selectedProductId, selectedProduct]);

  // Bulk Discount Calculator Math
  const discountTier = useMemo(() => {
    if (purchaseQty >= 50) return { percent: 15, label: "Volume Super Discount (15% Off)" };
    if (purchaseQty >= 10) return { percent: 5, label: "Bulk Tier Discount (5% Off)" };
    return { percent: 0, label: "No bulk discount (< 10 units)" };
  }, [purchaseQty]);

  const deliveryCost = useMemo(() => {
    const base = deliverySpeed === "drone" ? 25.0 : deliverySpeed === "express" ? 12.5 : 4.99;
    return base;
  }, [deliverySpeed]);

  const subTotal = useMemo(() => {
    return selectedProduct.price * purchaseQty;
  }, [selectedProduct, purchaseQty]);

  const discountValue = useMemo(() => {
    return subTotal * (discountTier.percent / 100);
  }, [subTotal, discountTier]);

  const subscriptionDiscountValue = useMemo(() => {
    if (purchaseType === "subscription") {
      return (subTotal - discountValue) * 0.10; // extra 10% off for subscription
    }
    return 0;
  }, [purchaseType, subTotal, discountValue]);

  const grandTotal = useMemo(() => {
    return subTotal - discountValue - subscriptionDiscountValue + deliveryCost;
  }, [subTotal, discountValue, subscriptionDiscountValue, deliveryCost]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.supplier.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.aiMatchReason.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPrice = p.price <= maxPrice;
      const matchesRating = p.rating >= minRating;
      const matchesGov = !govApprovedOnly || p.isGovApproved;
      const matchesDistance = p.distance <= maxDistance;
      const matchesStock = !inStockOnly || p.stockLevel !== "Out of Stock";

      // AI matches matching current context (Tomato or Clay Loam or Blight)
      const matchesAi = !onlyAiMatches || 
        p.aiMatchReason.toLowerCase().includes("tomato") || 
        p.aiMatchReason.toLowerCase().includes("blight") || 
        p.aiMatchReason.toLowerCase().includes("clay loam") ||
        p.category === "Pesticides"; // copper fungicide always matched for blight
      
      return matchesCategory && matchesSearch && matchesPrice && matchesRating && matchesGov && matchesDistance && matchesStock && matchesAi;
    });

    // Apply Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating-desc") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "popularity") {
      result.sort((a, b) => b.popularityCount - a.popularityCount);
    }

    return result;
  }, [selectedCategory, searchTerm, maxPrice, minRating, govApprovedOnly, maxDistance, inStockOnly, sortBy, onlyAiMatches]);

  // Smart Reorder Reminders Data
  const reorderReminders = useMemo(() => {
    const list = [];
    // Crop stage checks
    const tomatoCrop = activeCrops.find(c => c.name.toLowerCase().includes("tomato"));
    if (tomatoCrop) {
      list.push({
        id: "rem-1",
        crop: "Tomato",
        stage: tomatoCrop.stage,
        product: "Bio-Organic Nitrogen Booster",
        timing: "Due in 4 days",
        reason: `Your Tomatoes are in "${tomatoCrop.stage}" phase. To optimize nitrogen levels before flowering, apply organic boosters now.`
      });
    } else {
      // Default placeholder reminder if no tomato active
      list.push({
        id: "rem-1",
        crop: "Tomato (Planned)",
        stage: "Vegetative Sowing",
        product: "Bio-Organic Nitrogen Booster",
        timing: "Due in 3 days",
        reason: "Based on climate cycles and clay loam composition, soil nitrogen needs fortification prior to root elongation."
      });
    }

    if (activeDiseases.length > 0 || activeCrops.some(c => c.healthStatus.toLowerCase().includes("blight") || c.healthStatus.toLowerCase().includes("diseased"))) {
      list.push({
        id: "rem-2",
        crop: "Tomato",
        stage: "Defense Cycle",
        product: "Copper-Shield Bio-Fungicide",
        timing: "IMMEDIATE REORDER",
        reason: "Suspected Early Blight detected in sector. High humidity prediction indicates high pathogen dispersion vector. Stock depleted."
      });
    }

    list.push({
      id: "rem-3",
      crop: "Alluvial Field (Rotation)",
      stage: "Pre-Sowing Conditioning",
      product: "Premium Vermicompost Blend",
      timing: "Buy now for July delivery",
      reason: "Bulk compost deliveries require a 14-day booking buffer to secure government-subsidized shipping rates."
    });

    return list;
  }, [activeCrops, activeDiseases]);

  // Delivery estimation text
  const estimatedDeliveryDate = useMemo(() => {
    const today = new Date();
    let daysToAdd = 4;
    if (deliverySpeed === "drone") daysToAdd = 0; // Same day!
    else if (deliverySpeed === "express") daysToAdd = 1;
    
    today.setDate(today.getDate() + daysToAdd);
    
    if (deliverySpeed === "drone") {
      return "TODAY (Within 2 hours - autonomous drone delivery)";
    }
    return today.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  }, [deliverySpeed]);

  const handleCheckout = () => {
    setIsAddingToCart(true);
    setTimeout(() => {
      setIsAddingToCart(false);
      setSuccessMsg(`✓ Successfully ordered ${purchaseQty} ${selectedProduct.unit} of "${selectedProduct.name}"! Total charged: $${grandTotal.toFixed(2)}. Delivery dispatched via ${deliverySpeed.toUpperCase()} payload.`);
      setTimeout(() => setSuccessMsg(""), 6000);
    }, 1200);
  };

  const handleAutoSchedule = (productName: string) => {
    alert(`[Autonomous Agent] Smart auto-delivery scheduler activated for "${productName}". The system will automatically place orders based on real-time soil nitrogen/moisture sensor levels.`);
  };

  return (
    <div id="smart-marketplace-module" className="space-y-6 animate-in fade-in duration-300">
      
      {/* Upper Alerts & Smart Reminders Panel */}
      <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-amber-500 animate-bounce" />
            <div>
              <h3 className="text-xs uppercase font-black tracking-widest text-slate-300">Autonomous Reorder Engine</h3>
              <p className="text-[10px] text-slate-400 font-medium">Predictive input restocking based on real-time crop stage growth velocity & localized weather forecasts.</p>
            </div>
          </div>
          <span className="text-[9px] bg-slate-800 border border-slate-700 font-bold px-2.5 py-1 rounded-md text-slate-300">
            {reorderReminders.length} Active Reminders
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reorderReminders.map((rem) => (
            <div key={rem.id} className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[9px] uppercase font-black text-amber-400 tracking-wider">
                    {rem.crop} • {rem.stage}
                  </span>
                  <span className="text-[8px] bg-amber-500/20 text-amber-300 font-extrabold px-1.5 py-0.5 rounded uppercase">
                    {rem.timing}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white leading-snug">{rem.product}</h4>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{rem.reason}</p>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const match = products.find(p => p.name === rem.product);
                    if (match) setSelectedProductId(match.id);
                  }}
                  className="flex-1 text-center py-1.5 bg-emerald-700 hover:bg-emerald-600 transition-colors text-[9px] font-bold rounded text-white cursor-pointer"
                >
                  Configure Order
                </button>
                <button
                  type="button"
                  onClick={() => handleAutoSchedule(rem.product)}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 transition-colors text-[9px] font-bold rounded text-slate-300 cursor-pointer"
                  title="Auto-delivery based on sensor feedback"
                >
                  Auto-Schedule
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 font-semibold p-4 rounded-xl text-xs shadow-sm flex items-start gap-2 animate-bounce">
          <Check className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Dynamic Tab Navigation (4.3 shopping cart) */}
      <div className="flex border-b border-slate-200 bg-slate-50 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveMarketTab("catalog")}
          className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeMarketTab === "catalog"
              ? "bg-white text-emerald-800 shadow-xs border border-slate-200"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          Marketplace Catalog
        </button>
        <button
          type="button"
          onClick={() => setActiveMarketTab("cart")}
          className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 relative cursor-pointer ${
            activeMarketTab === "cart"
              ? "bg-white text-emerald-800 shadow-xs border border-slate-200"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
          }`}
        >
          <ShoppingCart className="h-4 w-4" />
          Procurement Cart ({cart.length})
          {cart.length > 0 && (
            <span className="bg-red-500 text-white text-[9px] font-black h-4.5 min-w-4.5 px-1.5 rounded-full flex items-center justify-center ml-1 animate-pulse">
              {cart.reduce((sum, item) => sum + item.qty, 0)}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveMarketTab("orders")}
          className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 relative cursor-pointer ${
            activeMarketTab === "orders"
              ? "bg-white text-emerald-800 shadow-xs border border-slate-200"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
          }`}
        >
          <History className="h-4 w-4" />
          Order History & Returns
        </button>
        <button
          type="button"
          onClick={() => setActiveMarketTab("suppliers")}
          className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 relative cursor-pointer ${
            activeMarketTab === "suppliers"
              ? "bg-white text-emerald-800 shadow-xs border border-slate-200"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
          }`}
        >
          <Star className="h-4 w-4 text-amber-500" />
          Supplier Reviews
        </button>
      </div>

      {activeMarketTab === "catalog" ? (
        /* Main Grid: left column products list, right column detailed selected product */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PRODUCTS CATALOG SECTION (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            
            {/* Catalog Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                  <ShoppingBag className="h-4.5 w-4.5 text-emerald-600" />
                  Smart Supplier Marketplace
                </h3>
                <p className="text-slate-400 text-[10px] mt-0.5">APEDA & NPOP certified inputs matched with localized diagnostic demands.</p>
              </div>

              {/* Toggle AI Recommendation Filter */}
              <button
                type="button"
                onClick={() => setOnlyAiMatches(!onlyAiMatches)}
                className={`text-[9px] font-extrabold px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                  onlyAiMatches 
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                    : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {onlyAiMatches ? "Showing AI Matched Inputs" : "Show Only Farm Matches"}
              </button>
            </div>

            {/* Category selection pill rows */}
            <div className="flex flex-wrap gap-1.5">
              {["All", "Seeds", "Fertilizers", "Pesticides", "Equipment", "Irrigation", "Organic Inputs"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search catalog by input name, supplier, keyword or crop suitability..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-xl text-xs font-semibold text-slate-700"
              />
            </div>

            {/* Advanced Filters & Sorting Dashboard Grid */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                <span className="text-[10px] uppercase font-black text-slate-700 tracking-wider flex items-center gap-1.5">
                  <Sliders className="h-4 w-4 text-emerald-600" />
                  Advanced Filters & Sort Engine
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMaxPrice(200);
                    setMinRating(1);
                    setGovApprovedOnly(false);
                    setMaxDistance(25);
                    setInStockOnly(false);
                    setSortBy("popularity");
                    setSearchTerm("");
                  }}
                  className="text-[9px] font-bold text-slate-400 hover:text-emerald-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Price Range Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>Max Price:</span>
                    <span className="text-slate-900 font-extrabold">${maxPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="250"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[8px] text-slate-400 font-medium">
                    <span>$10</span>
                    <span>$250</span>
                  </div>
                </div>

                {/* Distance Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>Max Supplier Location:</span>
                    <span className="text-slate-900 font-extrabold">{maxDistance} km</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="30"
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[8px] text-slate-400 font-medium">
                    <span>2 km</span>
                    <span>30 km</span>
                  </div>
                </div>

                {/* Sort Option Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Sort Results By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg text-[10px] font-extrabold p-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="popularity">Popularity (Most Purchased)</option>
                    <option value="price-asc">Price (Low to High)</option>
                    <option value="price-desc">Price (High to Low)</option>
                    <option value="rating-desc">Rating (High to Low)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 border-t border-slate-200/50">
                {/* Min Ratings Stars */}
                <div className="space-y-1.5">
                  <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider font-sans">Min Rating (1-5★)</span>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setMinRating(star)}
                        className={`p-1.5 rounded-md border transition-all cursor-pointer flex items-center justify-center ${
                          minRating >= star
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                            : "bg-white border-slate-200 text-slate-300 hover:border-slate-300"
                        }`}
                      >
                        <Star className={`h-3 w-3 ${minRating >= star ? "fill-amber-500" : ""}`} />
                      </button>
                    ))}
                    <span className="text-[9px] font-black text-slate-500 ml-1">({minRating}+)</span>
                  </div>
                </div>

                {/* Government Approved Toggle */}
                <div className="flex items-center justify-between sm:justify-start gap-3 sm:pt-2">
                  <button
                    type="button"
                    onClick={() => setGovApprovedOnly(!govApprovedOnly)}
                    className={`h-5 w-9 rounded-full transition-colors relative cursor-pointer outline-none focus:ring-1 focus:ring-emerald-500 ${
                      govApprovedOnly ? "bg-emerald-600" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                        govApprovedOnly ? "translate-x-4" : ""
                      }`}
                    />
                  </button>
                  <div className="text-left">
                    <span className="text-[9px] font-extrabold text-slate-700 block uppercase tracking-wide">Gov-Approved Only</span>
                    <span className="text-[8px] text-slate-400 font-bold">APEDA/NPOP cleared</span>
                  </div>
                </div>

                {/* In stock only toggle */}
                <div className="flex items-center justify-between sm:justify-start gap-3 sm:pt-2">
                  <button
                    type="button"
                    onClick={() => setInStockOnly(!inStockOnly)}
                    className={`h-5 w-9 rounded-full transition-colors relative cursor-pointer outline-none focus:ring-1 focus:ring-emerald-500 ${
                      inStockOnly ? "bg-emerald-600" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                        inStockOnly ? "translate-x-4" : ""
                      }`}
                    />
                  </button>
                  <div className="text-left">
                    <span className="text-[9px] font-extrabold text-slate-700 block uppercase tracking-wide">In-Stock Only</span>
                    <span className="text-[8px] text-slate-400 font-bold">Exclude backorders</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Recommendation Context Box if Blight or Tomato is active */}
            {(activeDiseases.length > 0 || activeCrops.length > 0) && (
              <div className="bg-gradient-to-r from-emerald-550/5 to-emerald-550/10 border border-emerald-100 rounded-xl p-3.5 flex items-start gap-2.5">
                <Sparkles className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-black text-emerald-700 tracking-wider">Dynamic Agronomy Recommendation</span>
                  <p className="text-[10px] text-slate-700 font-semibold leading-relaxed">
                    Active disease markers <strong className="text-red-700 font-bold">({activeDiseases.join(", ") || "Early Blight"})</strong> and crop logs <strong className="text-emerald-800 font-bold">({activeCrops.map(c=>c.name).join(", ") || "Tomatoes"})</strong> require defensive biochemical copper shielding and nitrogen aeration compost to reinforce root density.
                  </p>
                </div>
              </div>
            )}

            {/* Grid of Products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredProducts.map((prod) => {
                const isSelected = prod.id === selectedProductId;
                const isAiRecommended = prod.aiMatchReason.toLowerCase().includes("tomato") || 
                                        prod.aiMatchReason.toLowerCase().includes("blight") || 
                                        prod.category === "Pesticides";
                return (
                  <div
                    key={prod.id}
                    onClick={() => setSelectedProductId(prod.id)}
                    className={`rounded-xl border p-4 transition-all cursor-pointer flex flex-col justify-between hover:shadow-md space-y-3 relative ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/10 ring-2 ring-emerald-600/20"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    {/* Badge Overlay */}
                    {isAiRecommended && (
                      <span className="absolute top-2.5 right-2.5 bg-emerald-100 text-emerald-800 text-[8px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs border border-emerald-200">
                        <Sparkles className="h-2 w-2" /> AI Match
                      </span>
                    )}

                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-black text-slate-400 tracking-wide">{prod.category}</span>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug pr-12">{prod.name}</h4>
                      <p className="text-[9px] text-slate-500 font-bold">Supplier: {prod.supplier}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-black text-slate-900">${prod.price.toFixed(2)}</span>
                        <span className="text-[10px] text-slate-400">/ {prod.unit}</span>
                      </div>

                      {/* Ratings and reviews summary */}
                      <div className="flex items-center gap-1">
                        <div className="flex items-center text-amber-500">
                          <Star className="h-3 w-3 fill-amber-500" />
                          <span className="text-[10px] font-bold text-slate-700 ml-0.5">{prod.rating}</span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-semibold">({prod.reviewsCount} reviews)</span>
                        <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-md ml-auto ${
                          prod.stockLevel === "In Stock" ? "bg-emerald-50 text-emerald-700" :
                          prod.stockLevel === "Low Stock" ? "bg-amber-50 text-amber-700 animate-pulse" :
                          "bg-red-50 text-red-700"
                        }`}>
                          {prod.stockLevel}
                        </span>
                      </div>
                    </div>

                    {/* Gov badge representation */}
                    <div className="border-t border-slate-100/70 pt-2 flex items-center justify-between text-[8px] text-slate-400 font-bold">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Award className="h-3.5 w-3.5 text-emerald-600" />
                        Gov-Approved Badge
                      </span>
                      <span className="text-slate-500 font-semibold">{prod.certification.split(" ")[0]} Certified</span>
                    </div>

                  </div>
                );
              })}

              {filteredProducts.length === 0 && (
                <div className="col-span-2 text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <Search className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">No matching certified inputs found</p>
                  <p className="text-[10px] text-slate-400 mt-1">Try clearing your filters or resetting search parameters.</p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* SELECTED PRODUCT DETAILS SECTION (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Main Details Panel */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-5">
            
            {/* INTERACTIVE IMAGE GALLERY (4.2 GALLERY WITH MULTIPLE IMAGES) */}
            <div className="space-y-3">
              <div className="relative aspect-video rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                <img
                  src={selectedProduct.images && selectedProduct.images.length > 0 ? selectedProduct.images[activeImgIdx] : "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80"}
                  alt={selectedProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-all duration-300"
                />
                
                {/* Government Approved Badge overlay if applicable */}
                {selectedProduct.isGovApproved && (
                  <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[9px] font-black uppercase px-2 py-1 rounded shadow-md flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    Gov Approved
                  </div>
                )}

                {/* Stock status overlay */}
                <div className={`absolute top-3 right-3 text-[9px] font-black uppercase px-2 py-1 rounded shadow-md ${
                  selectedProduct.stockLevel === "In Stock" ? "bg-emerald-500 text-white" :
                  selectedProduct.stockLevel === "Low Stock" ? "bg-amber-500 text-white" :
                  "bg-red-500 text-white"
                }`}>
                  {selectedProduct.stockLevel}
                </div>
              </div>

              {/* Gallery Thumbnails */}
              {selectedProduct.images && selectedProduct.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {selectedProduct.images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImgIdx(idx)}
                      className={`relative w-16 h-12 rounded-md overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        activeImgIdx === idx ? "border-emerald-600 scale-95 shadow-sm" : "border-slate-200 opacity-75 hover:opacity-100"
                      }`}
                    >
                      <img src={imgUrl} alt="Thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Core Meta */}
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                    {selectedProduct.category}
                  </span>
                  {selectedProduct.isGovApproved && (
                    <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-100 flex items-center gap-0.5">
                      <Award className="h-2.5 w-2.5" />
                      Gov Approved
                    </span>
                  )}
                  {selectedProduct.certification && (
                    <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-100">
                      {selectedProduct.certification.split(" #")[0]}
                    </span>
                  )}
                </div>
                <span className="text-[9px] bg-slate-100 text-slate-600 font-extrabold px-2 py-0.5 rounded-full border border-slate-200">
                  ID: {selectedProduct.id}
                </span>
              </div>
              
              <div>
                <h3 className="text-slate-900 font-black text-base leading-snug">{selectedProduct.name}</h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap text-[10px]">
                  <p className="text-slate-500 font-semibold">Dispatched by: <strong className="text-slate-700">{selectedProduct.supplier}</strong></p>
                  <span className="text-slate-300">•</span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < Math.round(selectedProduct.rating) ? "fill-amber-500 text-amber-500" : "text-slate-200"}`} />
                      ))}
                    </div>
                    <span className="text-slate-700 font-extrabold">{selectedProduct.rating}</span>
                    <span className="text-slate-400 font-normal">({selectedProduct.reviewsCount} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Price display with discount badge */}
              <div className="flex items-baseline gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-lg font-black text-emerald-700">
                  ${selectedProduct.price.toFixed(2)}
                </span>
                <span className="text-[9px] text-slate-400 font-extrabold">
                  per {selectedProduct.unit}
                </span>
                {selectedProduct.discountPercent && selectedProduct.discountPercent > 0 ? (
                  <>
                    <span className="text-xs line-through text-slate-400 font-bold">
                      ${((selectedProduct.price * 100) / (100 - selectedProduct.discountPercent)).toFixed(2)}
                    </span>
                    <span className="text-[9px] bg-red-100 text-red-700 font-black px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse">
                      {selectedProduct.discountPercent}% OFF
                    </span>
                  </>
                ) : null}
                <div className="ml-auto flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${
                    selectedProduct.stockLevel === "In Stock" ? "bg-emerald-500 animate-pulse" :
                    selectedProduct.stockLevel === "Low Stock" ? "bg-amber-500 animate-pulse" :
                    "bg-red-500"
                  }`} />
                  <span className={`text-[10px] font-black uppercase ${
                    selectedProduct.stockLevel === "In Stock" ? "text-emerald-700" :
                    selectedProduct.stockLevel === "Low Stock" ? "text-amber-700" :
                    "text-red-700"
                  }`}>
                    {selectedProduct.stockLevel === "Low Stock" ? `Low Stock (${selectedProduct.maxStock} left)` : selectedProduct.stockLevel}
                  </span>
                </div>
              </div>
              
              {/* Product description (4.2 DESCRIPTION REQUIREMENT) */}
              <p className="text-[10px] text-slate-600 leading-relaxed font-medium bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                {selectedProduct.description || "Premium agricultural input formulated to maximize yield potential, optimize crop immunity pathways, and ensure maximum biological efficacy under dynamic soil conditions."}
              </p>
            </div>

            {/* Quality Certifications & Return Policy */}
            <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
              <div className="flex items-center gap-2 text-xs">
                <Award className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-[9px] uppercase font-black text-emerald-800 tracking-wider block">Official Agriculture Quality Badge</span>
                  <p className="text-[10px] text-slate-700 font-bold">{selectedProduct.certification}</p>
                </div>
              </div>
              <div className="border-t border-slate-200/50 my-2 pt-2 flex justify-between text-[10px]">
                <div className="flex items-center gap-1 text-slate-500">
                  <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
                  <span>Return: <strong className="text-slate-700 font-bold">{selectedProduct.returnPolicy.split(" (")[0]}</strong></span>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                  <span>Warranty: <strong className="text-slate-700 font-bold">{selectedProduct.warranty.split(" ")[0]}</strong></span>
                </div>
              </div>
            </div>

            {/* Price Forecasting & Trends (AI FORECAST) */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="h-4.5 w-4.5 text-emerald-600" />
                  AI Price Forecasting Index
                </h4>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border uppercase ${
                  selectedProduct.priceForecast.recommendation === "Buy Now" || selectedProduct.priceForecast.recommendation === "Strong Buy"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}>
                  {selectedProduct.priceForecast.recommendation}
                </span>
              </div>

              <div className="text-[10px] bg-slate-50/50 border border-slate-100 p-2.5 rounded-lg text-slate-600 leading-normal font-semibold">
                <span className="text-[9px] uppercase font-black text-slate-800 tracking-wider block mb-0.5">Predictive Recommendation:</span>
                {selectedProduct.priceForecast.reason}
              </div>

              {/* Price Trend Chart */}
              <div className="h-36 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={selectedProduct.priceForecast.trendData}
                    margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={8} fontWeight="bold" />
                    <YAxis stroke="#94a3b8" fontSize={8} fontWeight="bold" />
                    <Tooltip contentStyle={{ fontSize: "9px", borderRadius: "6px" }} />
                    <Line type="monotone" name="Actual Price ($)" dataKey="historicalPrice" stroke="#059669" strokeWidth={2.5} activeDot={{ r: 4 }} />
                    <Line type="monotone" name="Projected Price ($)" dataKey="projectedPrice" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="4 4" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pricing Configuration Matrix */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="h-4.5 w-4.5 text-emerald-600" />
                  Pricing Configuration Matrix
                </h4>
                <div className="text-right">
                  <span className="text-xs font-black text-slate-900">${selectedProduct.price.toFixed(2)}</span>
                  <span className="text-[8px] text-slate-400 font-bold ml-1">per {selectedProduct.unit}</span>
                </div>
              </div>

              {/* Purchase Type Toggle (One-time vs Subscription) */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setPurchaseType("one-time")}
                  className={`py-1.5 rounded-md text-[10px] font-black transition-all cursor-pointer ${
                    purchaseType === "one-time"
                      ? "bg-white text-emerald-700 shadow-xs border border-slate-200/50"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  One-time Order
                </button>
                <button
                  type="button"
                  onClick={() => setPurchaseType("subscription")}
                  className={`py-1.5 rounded-md text-[10px] font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    purchaseType === "subscription"
                      ? "bg-white text-emerald-700 shadow-xs border border-slate-200/50"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Percent className="h-3 w-3 text-emerald-600" />
                  Subscribe (Save 10%)
                </button>
              </div>

              {/* Subscription Options */}
              {purchaseType === "subscription" && (
                <div className="bg-emerald-50/20 border border-emerald-100 p-3 rounded-lg space-y-2 text-xs">
                  <label className="block text-[9px] uppercase font-black text-emerald-800">Choose Delivery Interval</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSubscriptionInterval("monthly")}
                      className={`py-1 rounded text-[10px] font-bold ${
                        subscriptionInterval === "monthly" ? "bg-emerald-700 text-white" : "bg-white text-slate-600 border border-slate-200"
                      }`}
                    >
                      Monthly Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubscriptionInterval("quarterly")}
                      className={`py-1 rounded text-[10px] font-bold ${
                        subscriptionInterval === "quarterly" ? "bg-emerald-700 text-white" : "bg-white text-slate-600 border border-slate-200"
                      }`}
                    >
                      Quarterly Delivery
                    </button>
                  </div>
                </div>
              )}

              {/* QUANTITY SELECTOR WITH +/- BUTTONS (4.2 +/- QUANTITY SELECTOR REQUIREMENT) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-500">Order Quantity (Max Available: {selectedProduct.maxStock}):</span>
                  <span className="text-slate-900 font-extrabold">{purchaseQty} {selectedProduct.unit.split(" ")[0]}s</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={selectedProduct.stockLevel === "Out of Stock" || purchaseQty <= 1}
                    onClick={() => setPurchaseQty(p => Math.max(1, p - 1))}
                    className="h-8 w-10 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg flex items-center justify-center font-black text-xs disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  
                  <div className="flex-1 h-8 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center text-xs font-black text-slate-800">
                    {selectedProduct.stockLevel === "Out of Stock" ? 0 : purchaseQty}
                  </div>

                  <button
                    type="button"
                    disabled={selectedProduct.stockLevel === "Out of Stock" || purchaseQty >= selectedProduct.maxStock}
                    onClick={() => setPurchaseQty(p => Math.min(selectedProduct.maxStock, p + 1))}
                    className="h-8 w-10 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg flex items-center justify-center font-black text-xs disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                {/* Bulk pricing tier hints */}
                <div className="flex justify-between text-[8px] text-slate-400 font-bold uppercase pt-1">
                  <span>1 unit (Base)</span>
                  <span className={purchaseQty >= 10 ? "text-emerald-600 font-extrabold" : ""}>10 units (5% off)</span>
                  <span className={purchaseQty >= 50 ? "text-emerald-600 font-extrabold" : ""}>50+ units (15% off)</span>
                </div>
              </div>

              {/* Delivery Methods Panel */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-slate-500 text-[10px] font-bold">Autonomous Dispatch Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "standard", label: "Standard Truck", desc: "$4.99 • 3-5d" },
                    { id: "express", label: "Express Cargo", desc: "$12.50 • 1-2d" },
                    { id: "drone", label: "Drone-Drop", desc: "$25.00 • 2 hrs" }
                  ].map((speed) => (
                    <button
                      key={speed.id}
                      type="button"
                      onClick={() => setDeliverySpeed(speed.id as any)}
                      className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                        deliverySpeed === speed.id
                          ? "border-emerald-600 bg-emerald-50/20 text-emerald-800 ring-1 ring-emerald-500/25"
                          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <span className="block text-[10px] font-black">{speed.label}</span>
                      <span className="block text-[8px] font-bold text-slate-400 mt-0.5">{speed.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost Summary Breakdown */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 text-[10px] space-y-2">
                <div className="flex justify-between font-bold text-slate-600">
                  <span>Base Price ({purchaseQty} x ${selectedProduct.price.toFixed(2)}):</span>
                  <span>${subTotal.toFixed(2)}</span>
                </div>
                {discountValue > 0 && (
                  <div className="flex justify-between font-extrabold text-emerald-600">
                    <span>{discountTier.label}:</span>
                    <span>-${discountValue.toFixed(2)}</span>
                  </div>
                )}
                {subscriptionDiscountValue > 0 && (
                  <div className="flex justify-between font-extrabold text-blue-600">
                    <span>Subscription discount (10% Off):</span>
                    <span>-${subscriptionDiscountValue.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-slate-600 border-t border-slate-200/40 pt-1.5">
                  <span className="flex items-center gap-1">
                    <Truck className="h-3 w-3 text-slate-400" />
                    Dispatch Logistics Mode:
                  </span>
                  <span>${deliveryCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-black text-slate-900 border-t border-slate-200 pt-2">
                  <span>Total (Inc. Subsidies & Taxes):</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
                
                {/* Live Delivery Timeline Estimation */}
                <div className="border-t border-slate-200/50 pt-2 text-[9px] text-slate-400 font-bold flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>Est. Delivery: <strong className="text-slate-600">{estimatedDeliveryDate}</strong></span>
                </div>
              </div>

              {/* ACTION BUTTONS: DUAL ADD TO CART & BUY NOW (4.2 REQUIREMENT) */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {/* Add to Cart button */}
                <button
                  type="button"
                  disabled={selectedProduct.stockLevel === "Out of Stock"}
                  onClick={() => {
                    const newItem = {
                      id: `cart-${Date.now()}`,
                      product: selectedProduct,
                      qty: purchaseQty,
                      purchaseType: purchaseType,
                      interval: purchaseType === "subscription" ? subscriptionInterval : undefined,
                      deliverySpeed: deliverySpeed,
                      total: grandTotal
                    };
                    setCart(prev => [newItem, ...prev]);
                    // Temporarily show check feedback
                    setSuccessMsg(`✓ Added ${purchaseQty} units of "${selectedProduct.name}" to your procurement batch drawer below.`);
                    setTimeout(() => setSuccessMsg(""), 5000);
                  }}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-black rounded-lg text-[10px] transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
                >
                  <ShoppingCart className="h-3.5 w-3.5 text-slate-600" />
                  Add to Cart
                </button>

                {/* Buy Now (Direct Checkout) */}
                <button
                  type="button"
                  disabled={selectedProduct.stockLevel === "Out of Stock"}
                  onClick={() => {
                    // Save original cart
                    const original = [...cart];
                    setOriginalCartBeforeDirect(original);
                    setIsDirectCheckout(true);

                    // Create single-item cart for direct checkout
                    const buyNowItem = {
                      id: `buynow-${selectedProduct.id}-${Date.now()}`,
                      product: selectedProduct,
                      qty: purchaseQty,
                      purchaseType: purchaseType,
                      interval: subscriptionInterval,
                      deliverySpeed: deliverySpeed,
                      total: Math.round(selectedProduct.price * EXCHANGE_RATE) * purchaseQty
                    };

                    setCart([buyNowItem]);

                    // Set step and reset inputs
                    setCartCheckoutStep("address");
                    setOtpSent(false);
                    setOtpInput("");
                    setUpiIdInput("");
                    
                    // Initialize dynamic details
                    const orderNum = "COOP-ORD-" + Math.floor(100000 + Math.random() * 900000);
                    setGeneratedOrderNumber(orderNum);
                    
                    const targetDate = new Date();
                    targetDate.setDate(targetDate.getDate() + 3);
                    const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" };
                    setCartEstimatedDelivery(targetDate.toLocaleDateString("en-US", options));
                    
                    setTrackingStep(0);
                    setIsCartCheckoutModalOpen(true);
                  }}
                  className="py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-lg text-[10px] transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer disabled:opacity-40"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Buy Now
                </button>
              </div>
            </div>

            {/* Shopping Cart Drawer / Active Procurement List */}
            {cart.length > 0 && (
              <div className="border border-indigo-200 bg-indigo-50/10 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center border-b border-indigo-100 pb-2">
                  <h4 className="text-[10px] font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                    <ShoppingCart className="h-4 w-4 text-indigo-600" />
                    Active Procurement Cart ({cart.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => setCart([])}
                    className="text-[9px] text-red-600 font-bold hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-white border border-slate-200 p-2 rounded-lg flex items-start justify-between text-[10px]">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 block">{item.product.name}</span>
                        <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-[9px]">
                          <span>Qty: <strong>{item.qty}</strong></span>
                          <span>•</span>
                          <span className="capitalize">{item.purchaseType}</span>
                          {item.interval && <span>({item.interval})</span>}
                          <span>•</span>
                          <span className="uppercase text-[8px] bg-slate-100 px-1 rounded font-bold">{item.deliverySpeed}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900">${item.total.toFixed(2)}</span>
                        <button
                          type="button"
                          onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))}
                          className="text-slate-400 hover:text-red-600 p-0.5"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-indigo-50 border border-indigo-100 p-2.5 rounded-lg flex justify-between items-center text-[10px]">
                  <div>
                    <span className="block font-semibold text-slate-600">Subtotal Procurement:</span>
                    <span className="text-xs font-black text-indigo-900">${cart.reduce((sum, item) => sum + item.total, 0).toFixed(2)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMarketTab("cart");
                    }}
                    className="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white font-black rounded-md text-[9px] cursor-pointer"
                  >
                    View in Rupees & Checkout
                  </button>
                </div>
              </div>
            )}

            {/* SUPPLIER INFORMATION CARD (4.2 SUPPLIER COMPREHENSIVE STATS) */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/30">
              <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="h-4.5 w-4.5 text-emerald-600" />
                Verified Supplier Profile
              </h4>
              
              <div className="flex items-start justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200/60">
                <div className="space-y-1">
                  <span className="font-black text-slate-800 text-xs block leading-tight">{selectedProduct.supplier}</span>
                  <div className="flex items-center gap-1 text-[9px] text-slate-500 font-semibold">
                    <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
                    <span>{selectedProduct.supplierLocation || "Vijayawada Rural Hub"}</span>
                  </div>
                  <div className="text-[9px] text-slate-400 font-bold pt-1">
                    Certified Organic, FCI-Verified distributor with GPS checked warehouses.
                  </div>
                </div>

                <div className="text-right shrink-0 border-l border-slate-100 pl-3">
                  <div className="flex items-center justify-end gap-1 text-amber-500 font-black text-xs">
                    <Star className="h-3.5 w-3.5 fill-amber-500" />
                    <span>{selectedProduct.supplierRating || selectedProduct.rating}</span>
                  </div>
                  <span className="text-[8px] text-slate-400 font-bold block mt-0.5">Rating Score</span>
                  <div className="text-[9px] font-black text-slate-700 mt-1">
                    {selectedProduct.supplierProductsSold ? selectedProduct.supplierProductsSold.toLocaleString() : "14,500"}+
                  </div>
                  <span className="text-[7px] text-slate-400 font-bold block">Units Sold</span>
                </div>
              </div>
            </div>

            {/* Nearby Availability Dealers Map Representation */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-3.5">
              <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Map className="h-4.5 w-4.5 text-emerald-600" />
                Local Regional Inventory Map
              </h4>
              <p className="text-[10px] text-slate-400 leading-normal font-semibold">Closest approved retailers stock matching of selected certified input.</p>

              {/* Styled Mock Mini Map Grid */}
              <div className="h-28 rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                {/* Map style dots and grid overlays */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px]" />
                
                {/* Path Lines between dealers */}
                <svg className="absolute inset-0 w-full h-full text-emerald-200/60 pointer-events-none">
                  <line x1="20%" y1="30%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="2" strokeDasharray="4" />
                  <line x1="80%" y1="70%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="2" strokeDasharray="4" />
                </svg>

                {/* Main Farm representation */}
                <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="h-5 w-5 bg-emerald-600 text-white border-2 border-white rounded-full flex items-center justify-center shadow-md">
                    <Sprout className="h-3 w-3" />
                  </div>
                  <span className="text-[8px] font-black bg-emerald-900 text-white px-1 rounded shadow-xs mt-0.5">Your Farm</span>
                </div>

                {/* Dealer Vijayawada Co-op */}
                <div className="absolute top-[20%] left-[15%] flex flex-col items-center">
                  <div className="h-4.5 w-4.5 bg-amber-500 text-white border border-white rounded-full flex items-center justify-center shadow-md animate-pulse">
                    <MapPin className="h-2.5 w-2.5" />
                  </div>
                  <span className="text-[7px] font-bold bg-slate-800 text-slate-100 px-1 rounded shadow-xs mt-0.5">Vijayawada (4.2km)</span>
                </div>

                {/* Dealer Precision Inputs */}
                <div className="absolute bottom-[20%] left-[70%] flex flex-col items-center">
                  <div className="h-4.5 w-4.5 bg-amber-500 text-white border border-white rounded-full flex items-center justify-center shadow-md">
                    <MapPin className="h-2.5 w-2.5" />
                  </div>
                  <span className="text-[7px] font-bold bg-slate-800 text-slate-100 px-1 rounded shadow-xs mt-0.5">Guntur (12.8km)</span>
                </div>
              </div>

              {/* Retailers List */}
              <div className="space-y-2">
                {selectedProduct.nearbyStock.map((ns, nsIdx) => (
                  <div key={nsIdx} className="bg-slate-50 border border-slate-200/50 p-2.5 rounded-lg flex items-center justify-between text-[10px]">
                    <div>
                      <span className="font-bold text-slate-800 block">{ns.dealer}</span>
                      <span className="text-slate-400 font-semibold">{ns.distance} km away • Coordinates checked by GPS</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 block">${ns.price.toFixed(2)} / unit</span>
                      <span className="text-emerald-700 font-extrabold">{ns.stock} units available</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DYNAMIC REVIEWS & RATING MODULE (4.2 COMPREHENSIVE REVIEWS SYSTEM) */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <div>
                  <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider">
                    Supplier Performance & Reviews
                  </h4>
                  <div className="flex items-center gap-1 text-[9px] text-slate-500 font-bold mt-0.5">
                    <span className="text-amber-500 flex items-center gap-0.5">
                      <Star className="h-3.5 w-3.5 fill-amber-500" />
                      <strong>{activeRating}★</strong>
                    </span>
                    <span>({activeReviewsCount} user reviews)</span>
                  </div>
                </div>
                
                {/* 4.2 FILTER REVIEWS BY RATING DROP-DOWN */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] text-slate-400 font-bold uppercase">Filter:</span>
                  <select
                    value={reviewRatingFilter}
                    onChange={(e) => {
                      const val = e.target.value;
                      setReviewRatingFilter(val === "All" ? "All" : parseInt(val));
                    }}
                    className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[9px] font-bold text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="All">All Stars</option>
                    <option value="5">5★ Stars Only</option>
                    <option value="4">4★ Stars Only</option>
                    <option value="3">3★ Stars Only</option>
                    <option value="2">2★ Stars Only</option>
                    <option value="1">1★ Stars Only</option>
                  </select>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {activeReviews.map((rev, rIdx) => (
                  <div key={rIdx} className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 pb-3 last:border-b-0 space-y-1 text-[10px]">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-700">{rev.author}</span>
                        {rev.verified && (
                          <span className="text-[7px] bg-emerald-50 border border-emerald-200 text-emerald-700 px-1 rounded font-bold uppercase">
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400 font-bold">{rev.date}</span>
                    </div>
                    
                    <div className="flex items-center text-amber-500">
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <Star key={starIdx} className={`h-3 w-3 ${starIdx < rev.rating ? "fill-amber-500" : "text-slate-200"}`} />
                      ))}
                    </div>
                    <p className="text-slate-600 leading-normal italic font-medium">"{rev.text}"</p>
                  </div>
                ))}

                {activeReviews.length === 0 && (
                  <p className="text-[10px] text-slate-400 text-center py-4 font-semibold italic">
                    No reviews matching Star rating criteria.
                  </p>
                )}
              </div>

              {/* 4.2 WRITE A REVIEW SECTION */}
              <div className="border-t border-slate-200/60 pt-3 space-y-2.5">
                <span className="block text-[9px] font-black text-slate-700 uppercase tracking-wider">
                  Write a Verified Review
                </span>

                {showReviewSuccess && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[9px] font-black rounded-lg">
                    ✓ Thank you! Your review has been dynamically queued & added to this certified batch catalog.
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold text-slate-500">Farmer Name / Handle</label>
                    <input
                      type="text"
                      placeholder="e.g. Jasbir S."
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-[10px] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  
                  {/* Rating Selector */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold text-slate-500">Your Rating</label>
                    <div className="flex items-center gap-1 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className="p-0.5 focus:outline-none cursor-pointer"
                        >
                          <Star className={`h-4.5 w-4.5 ${star <= newReviewRating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-500 text-[10px]">Review Feedback</label>
                  <textarea
                    rows={2}
                    placeholder="Provide insights on soil efficacy, crop response, delivery timing, or fertilizer response..."
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded p-2 text-[10px] focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-normal"
                  />
                </div>

                {/* Verified Buyer toggle */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="verifiedToggle"
                      checked={isVerifiedBuyer}
                      onChange={(e) => setIsVerifiedBuyer(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <label htmlFor="verifiedToggle" className="text-[9px] text-slate-500 font-bold uppercase select-none cursor-pointer">
                      Confirm I purchased this batch (Verified Buyer) <span className="text-red-500 font-black">*</span>
                    </label>
                  </div>
                  {!isVerifiedBuyer && (
                    <p className="text-[9px] text-amber-600 font-extrabold bg-amber-50 border border-amber-200/50 p-1.5 rounded">
                      ⚠️ Cooperative policy: You must be a verified buyer to submit reviews for agricultural inputs.
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!newReviewAuthor.trim() || !newReviewText.trim() || !isVerifiedBuyer) return;
                    const newRev = {
                      author: newReviewAuthor,
                      rating: newReviewRating,
                      text: newReviewText,
                      date: new Date().toISOString().split("T")[0],
                      verified: isVerifiedBuyer
                    };
                    
                    setDynamicReviews(prev => {
                      const existing = prev[selectedProduct.id] || [];
                      return {
                        ...prev,
                        [selectedProduct.id]: [newRev, ...existing]
                      };
                    });

                    // Reset fields
                    setNewReviewAuthor("");
                    setNewReviewText("");
                    setNewReviewRating(5);
                    setShowReviewSuccess(true);
                    setTimeout(() => {
                      setShowReviewSuccess(false);
                    }, 5000);
                  }}
                  disabled={!newReviewAuthor.trim() || !newReviewText.trim() || !isVerifiedBuyer}
                  className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-lg text-[9px] transition-all disabled:opacity-40 cursor-pointer uppercase tracking-wider"
                >
                  Publish Review on Marketplace
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
      ) : activeMarketTab === "cart" ? (
        <div className="space-y-6 animate-in fade-in duration-300" id="smart-procurement-cart-section">
          {cart.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                <ShoppingCart className="h-8 w-8 animate-bounce" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-slate-800 font-extrabold text-xs uppercase tracking-wide">Your Procurement Cart is Empty</h3>
                <p className="text-slate-400 text-[10px] leading-normal font-medium">
                  You have not added any certified crops, smart tools, or bio-inputs to your active procurement list. Navigate back to the marketplace catalog to secure certified allocations.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveMarketTab("catalog")}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-xl text-[10px] shadow-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Explore Marketplace Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* CART ITEMS LIST (Col-span-8) */}
              <div className="lg:col-span-8 space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                    <div>
                      <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <ShoppingCart className="h-4.5 w-4.5 text-emerald-600" />
                        Active Procurement Batch
                      </h3>
                      <p className="text-slate-400 text-[9px] font-semibold">Verify allotment metrics, apply state subsidies, and authorize delivery coordinates.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCart([])}
                      className="text-[10px] text-red-600 hover:text-red-700 font-black flex items-center gap-1 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                      Clear All Items
                    </button>
                  </div>

                  {/* Table/List of Cart Items */}
                  <div className="divide-y divide-slate-100">
                    {cart.map((item) => {
                      const itemPriceInRupees = Math.round(item.product.price * 83);
                      const itemTotalInRupees = itemPriceInRupees * item.qty;
                      return (
                        <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 first:pt-0 last:pb-0">
                          
                          {/* Product Info & Thumbnail */}
                          <div className="flex items-center gap-3.5 min-w-0 flex-1">
                            <div className="h-14 w-14 rounded-lg bg-slate-100 border border-slate-200/60 overflow-hidden shrink-0">
                              <img 
                                src={item.product.images[0]} 
                                alt={item.product.name} 
                                className="h-full w-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[11px] font-black text-slate-800 hover:text-emerald-700 block transition-colors leading-snug truncate">
                                {item.product.name}
                              </span>
                              <span className="text-[9px] text-slate-400 font-bold block mt-0.5">Category: {item.product.category}</span>
                              <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-100/50 px-1.5 py-0.5 rounded-md mt-1 inline-block font-mono">
                                Supplier: {item.product.supplier}
                              </span>
                            </div>
                          </div>

                          {/* Unit price indicator */}
                          <div className="text-left sm:text-right shrink-0">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Unit Price</span>
                            <span className="text-[11px] font-extrabold text-slate-700 block">
                              ₹{itemPriceInRupees.toLocaleString()} <span className="text-[9px] text-slate-400 font-medium">/{item.product.unit.split(" ")[0]}</span>
                            </span>
                          </div>

                          {/* Quantity Controls (with minus/plus) */}
                          <div className="flex flex-col items-center gap-1.5 shrink-0">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Allotment Qty</span>
                            <div className="flex items-center bg-slate-100 border border-slate-200 p-1 rounded-lg">
                              <button
                                type="button"
                                onClick={() => {
                                  if (item.qty > 1) {
                                    setCart(prev => prev.map(i => i.id === item.id ? { ...i, qty: i.qty - 1 } : i));
                                  } else {
                                    setCart(prev => prev.filter(i => i.id !== item.id));
                                  }
                                }}
                                className="h-6 w-6 bg-white hover:bg-slate-50 border border-slate-200/50 text-slate-800 rounded-md flex items-center justify-center font-black cursor-pointer transition-colors"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-10 text-center text-xs font-black text-slate-900">
                                {item.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setCart(prev => prev.map(i => i.id === item.id ? { ...i, qty: Math.min(item.product.maxStock, i.qty + 1) } : i));
                                }}
                                className="h-6 w-6 bg-white hover:bg-slate-50 border border-slate-200/50 text-slate-800 rounded-md flex items-center justify-center font-black cursor-pointer transition-colors"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>

                          {/* Total price & removal */}
                          <div className="flex items-center gap-3.5 shrink-0">
                            <div className="text-right">
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Total Price</span>
                              <span className="text-xs font-black text-slate-900 block font-mono">
                                ₹{itemTotalInRupees.toLocaleString()}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))}
                              className="h-8 w-8 bg-red-50 hover:bg-red-100/80 border border-red-200/40 text-red-600 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                              title="Remove item"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Logistics & Delivery Speed Summary inside Cart */}
                <div className="bg-indigo-50/15 border border-indigo-100/60 rounded-2xl p-5 space-y-3 shadow-xs">
                  <h4 className="text-[10px] font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Truck className="h-4.5 w-4.5 text-indigo-600" />
                    Consolidated Logistics Optimization
                  </h4>
                  <p className="text-[9.5px] text-slate-500 font-semibold leading-relaxed">
                    All deliveries are scheduled directly to your registered GPS land parcel boundaries in Andhra Pradesh. You can optimize the transport dispatch speed for each item directly from the catalog.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="bg-white border border-slate-100 p-3 rounded-xl">
                      <span className="text-[8.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Default Target Destination</span>
                      <span className="text-[10px] font-black text-slate-800 block mt-1 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                        Andhra Pradesh Co-op Sector 4
                      </span>
                    </div>
                    <div className="bg-white border border-slate-100 p-3 rounded-xl">
                      <span className="text-[8.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Calculated Shipping Route</span>
                      <span className="text-[10px] font-black text-slate-800 block mt-1 font-mono">
                        {shippingLocation} Hub ↔ Farm-Gate
                      </span>
                    </div>
                    <div className="bg-white border border-slate-100 p-3 rounded-xl">
                      <span className="text-[8.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Active Transport Modes</span>
                      <span className="text-[10px] font-black text-emerald-800 block mt-1 uppercase">
                        {Array.from(new Set(cart.map(i => i.deliverySpeed))).join(" + ") || "Standard"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CART SUMMARY CARD & PROCEED TO CHECKOUT (Col-span-4) */}
              <div className="lg:col-span-4 space-y-4">
                
                {/* 1. SHIPPING LOCATION SELECTOR */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
                  <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    1. Shipping Location (Andhra Pradesh)
                  </label>
                  <p className="text-[9px] text-slate-400 font-medium leading-tight">
                    Select your nearest district hub to automatically calculate specific co-op shipping rates & distance surcharges.
                  </p>
                  <select
                    value={shippingLocation}
                    onChange={(e) => setShippingLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-black p-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    {SHIPPING_LOCATIONS.map((loc) => (
                      <option key={loc.name} value={loc.name}>
                        {loc.name} District (Base: ₹{Math.round(loc.baseCostUsd * EXCHANGE_RATE)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. APPLY SUBSIDY COUPON MODULE */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
                  <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <Percent className="h-4 w-4 text-amber-500" />
                    2. State Subsidy Coupon
                  </label>
                  <p className="text-[9px] text-slate-400 font-medium leading-tight">
                    Apply valid central or co-op coupons to redeem state agricultural subsidies.
                  </p>
                  
                  {appliedCoupon ? (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-2.5 rounded-xl flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-black uppercase text-emerald-800 block">Code: {appliedCoupon.code}</span>
                        <span className="text-[9px] text-emerald-600 font-bold block truncate leading-tight">{appliedCoupon.description}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-[9px] text-red-600 font-extrabold hover:underline ml-2 shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => {
                            setCouponInput(e.target.value);
                            setCouponError("");
                          }}
                          placeholder="e.g. KISAN15"
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 uppercase"
                        />
                        <button
                          type="button"
                          onClick={() => handleApplyCoupon(couponInput)}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-black rounded-xl text-[10px] uppercase tracking-wider cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && <p className="text-[9.5px] text-red-600 font-bold">{couponError}</p>}
                      {couponSuccess && <p className="text-[9.5px] text-emerald-600 font-bold">{couponSuccess}</p>}
                    </div>
                  )}

                  {/* Pre-defined vouchers to make it interactive */}
                  <div className="border-t border-slate-100 pt-2">
                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Recommended Co-op Vouchers</span>
                    <div className="flex flex-col gap-1.5">
                      {[
                        { code: "KISAN15", desc: "15% Crop Booster Subsidy", active: appliedCoupon?.code === "KISAN15" },
                        { code: "GREEN20", desc: "20% Bio-Organic inputs voucher", active: appliedCoupon?.code === "GREEN20" },
                        { code: "BUMPER10", desc: "10% General Input Subsidy", active: appliedCoupon?.code === "BUMPER10" },
                        { code: "FREEFALL", desc: "Free standard shipping route", active: appliedCoupon?.code === "FREEFALL" }
                      ].map((v) => (
                        <button
                          key={v.code}
                          type="button"
                          onClick={() => handleApplyCoupon(v.code)}
                          className={`w-full text-left p-1.5 rounded-lg border text-[9px] font-bold transition-all flex justify-between items-center cursor-pointer ${
                            v.active 
                              ? "bg-emerald-50 border-emerald-300 text-emerald-800" 
                              : "bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-600"
                          }`}
                        >
                          <span>{v.code} <span className="text-slate-400 font-medium">({v.desc})</span></span>
                          {v.active && <Check className="h-3 w-3 text-emerald-600" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. FINAL PRICING SUMMARY CARD */}
                <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 shadow-md space-y-3.5">
                  <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-1">
                    <Percent className="h-4 w-4 text-emerald-400" />
                    3. Procurement Cost Summary
                  </h4>

                  <div className="space-y-2 text-[10px]">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal (Base):</span>
                      <span className="font-extrabold text-slate-200">₹{cartSubtotalRupees.toLocaleString()}</span>
                    </div>

                    {cartDiscountRupees > 0 && (
                      <div className="flex justify-between text-emerald-400 font-extrabold">
                        <span>Subsidy Coupon Discount:</span>
                        <span>-₹{cartDiscountRupees.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-400">
                      <span>Central & State GST (5%):</span>
                      <span className="font-extrabold text-slate-200">+₹{cartTaxRupees.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-slate-400">
                      <span>Logistics Route Shipping:</span>
                      <span className="font-extrabold text-slate-200">₹{cartShippingRupees.toLocaleString()}</span>
                    </div>

                    <div className="border-t border-slate-800/80 pt-3 flex justify-between text-xs font-black text-white">
                      <span>Grand Total (₹):</span>
                      <span className="text-sm font-black text-emerald-400">₹{cartTotalRupees.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Proceed to Checkout */}
                  <button
                    type="button"
                    onClick={() => {
                      setCartCheckoutStep("address");
                      setOtpSent(false);
                      setOtpInput("");
                      setUpiIdInput("");
                      
                      // Initialize dynamic details
                      const orderNum = "COOP-ORD-" + Math.floor(100000 + Math.random() * 900000);
                      setGeneratedOrderNumber(orderNum);
                      
                      const targetDate = new Date();
                      targetDate.setDate(targetDate.getDate() + 3);
                      const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" };
                      setCartEstimatedDelivery(targetDate.toLocaleDateString("en-US", options));
                      
                      setTrackingStep(0);
                      setIsCartCheckoutModalOpen(true);
                    }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                  >
                    <Check className="h-4 w-4" />
                    Proceed to Checkout
                  </button>
                  <p className="text-[8.5px] text-slate-500 font-semibold text-center leading-tight">
                    Fully eligible for interest-free crop credit scheme & central fertilizer offsets. UPI / RuPay supported.
                  </p>
                </div>

              </div>

            </div>
          )}
        </div>
      ) : activeMarketTab === "orders" ? (
        <div className="space-y-6 animate-in fade-in duration-300" id="orders-history-section">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-slate-800 font-extrabold text-sm uppercase tracking-wider flex items-center gap-1.5">
                  <History className="h-5 w-5 text-emerald-600 animate-pulse" />
                  Cooperative Procurement Order History
                </h3>
                <p className="text-slate-400 text-[10px] font-semibold leading-relaxed">
                  Monitor registered state vouchers, manage active logistics runs, and request returns under APEDA guidelines.
                </p>
              </div>

              {/* Status Filters */}
              <div className="flex flex-wrap gap-1">
                {["All", "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"].map((status) => {
                  const count = status === "All" 
                    ? orders.length 
                    : orders.filter(o => o.status === status).length;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setOrderFilter(status)}
                      className={`px-3 py-1.5 text-[9px] font-black rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                        orderFilter === status
                          ? "bg-emerald-700 text-white shadow-xs"
                          : "bg-slate-50 text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200/60"
                      }`}
                    >
                      {status} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left column: Orders list */}
              <div className="lg:col-span-5 space-y-3 max-h-[550px] overflow-y-auto pr-1">
                {orders.filter(o => orderFilter === "All" || o.status === orderFilter).length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                    <History className="h-8 w-8 text-slate-300 mx-auto" />
                    <span className="text-[10px] text-slate-400 font-black uppercase block">No Orders Found</span>
                    <p className="text-[9px] text-slate-400 max-w-xs mx-auto">
                      No procurement orders match the selected filter status in your cooperative digital ledger.
                    </p>
                  </div>
                ) : (
                  orders
                    .filter(o => orderFilter === "All" || o.status === orderFilter)
                    .map((order) => {
                      const isSelected = selectedOrderId === order.id;
                      return (
                        <div
                          key={order.id}
                          onClick={() => setSelectedOrderId(order.id)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left space-y-2.5 ${
                            isSelected
                              ? "bg-emerald-50/40 border-emerald-500/80 shadow-xs"
                              : "bg-white border-slate-200/80 hover:bg-slate-50/60"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-900 font-mono">{order.id}</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                              order.status === "Pending" ? "bg-amber-100 text-amber-800 border border-amber-200" :
                              order.status === "Confirmed" ? "bg-blue-100 text-blue-800 border border-blue-200" :
                              order.status === "Shipped" ? "bg-purple-100 text-purple-800 border border-purple-200" :
                              order.status === "Delivered" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                              "bg-red-100 text-red-800 border border-red-200"
                            }`}>
                              {order.returnRequested ? "Return Pending" : order.status}
                            </span>
                          </div>

                          <div className="space-y-1 text-[9px] text-slate-500 font-bold">
                            <div>Date Authorized: <span className="text-slate-700 font-extrabold">{order.date}</span></div>
                            <div className="truncate">Items: <span className="text-slate-800 font-black">{order.items.map(i => `${i.product.name} (x${i.qty})`).join(", ")}</span></div>
                            <div className="flex justify-between items-center border-t border-slate-150/40 pt-1.5 mt-1">
                              <span className="text-[8px] text-slate-400 font-semibold uppercase">Grand Total:</span>
                              <span className="text-[11px] font-black text-emerald-700 font-mono">₹{order.totalRupees.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>

              {/* Right column: Selected Order details */}
              <div className="lg:col-span-7">
                {(() => {
                  const order = orders.find(o => o.id === selectedOrderId);
                  if (!order) {
                    return (
                      <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-slate-50 rounded-2xl border border-slate-200">
                        <History className="h-10 w-10 text-slate-300 mb-3 animate-bounce" />
                        <h4 className="text-slate-800 font-extrabold text-xs uppercase tracking-wide">Procurement Details Panel</h4>
                        <p className="text-slate-400 text-[10px] font-medium max-w-sm mt-1">
                          Select a completed or active procurement record from the ledger on the left to view dispatch logs, track coordinates, and download tax invoices.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4 text-left shadow-xs">
                      
                      {/* Detail Header */}
                      <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                        <div>
                          <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Co-op Allocation Record</span>
                          <h4 className="text-slate-900 font-black text-xs font-mono flex items-center gap-1.5">
                            {order.id}
                          </h4>
                          <span className="text-[9px] text-slate-500 font-bold">Date Authorized: {order.date}</span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                            order.status === "Pending" ? "bg-amber-100 text-amber-800 border border-amber-200" :
                            order.status === "Confirmed" ? "bg-blue-100 text-blue-800 border border-blue-200" :
                            order.status === "Shipped" ? "bg-purple-100 text-purple-800 border border-purple-200" :
                            order.status === "Delivered" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                            "bg-red-100 text-red-800 border border-red-200"
                          }`}>
                            {order.returnRequested ? "Return Pending" : order.status}
                          </span>
                          <span className="text-[8px] font-mono text-slate-400 font-semibold uppercase">Tracking: {order.trackingNumber}</span>
                        </div>
                      </div>

                      {/* Items Purchased */}
                      <div className="space-y-2">
                        <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Certified Input Allocations</h5>
                        <div className="border border-slate-100 rounded-xl divide-y divide-slate-50 overflow-hidden">
                          {order.items.map((item) => (
                            <div key={item.id} className="p-3 bg-slate-50/30 flex items-center gap-3">
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                referrerPolicy="no-referrer"
                                className="h-10 w-10 object-cover rounded-lg border border-slate-200"
                              />
                              <div className="flex-1 min-w-0">
                                <span className="text-[10px] font-black text-slate-800 block truncate">{item.product.name}</span>
                                <span className="text-[8.5px] text-slate-400 font-bold block">{item.product.supplier} • {item.product.certification.split(" ")[0]} Stamp</span>
                                <span className="text-[8px] font-black uppercase text-emerald-700 bg-emerald-50 border border-emerald-100/60 px-1 py-0.2 rounded inline-block mt-0.5">
                                  {item.deliverySpeed.toUpperCase()} DELIVERY
                                </span>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-[9.5px] text-slate-500 font-bold block">Qty: {item.qty}</span>
                                <span className="text-[10px] font-black text-slate-900 font-mono">₹{(item.priceRupees * item.qty).toLocaleString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping address & payment details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-3 rounded-xl border border-slate-150/40 text-[9px] font-semibold">
                        <div className="space-y-1 border-b md:border-b-0 md:border-r border-slate-200/50 pb-2 md:pb-0 md:pr-3">
                          <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider block mb-1">Co-op Shipping Coordinates</span>
                          <span className="text-slate-900 font-extrabold block">{order.shippingAddress.name}</span>
                          <span className="text-slate-400 block">{order.shippingAddress.phone}</span>
                          <span className="text-slate-600 block leading-tight mt-0.5">
                            {order.shippingAddress.addressLine}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                          </span>
                        </div>
                        <div className="space-y-1 md:pl-1">
                          <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider block mb-1">State Subsidy & Payment Log</span>
                          <div>Gateway: <strong className="text-slate-800 font-extrabold">{order.paymentMethod}</strong></div>
                          <div>Subtotal: <strong className="text-slate-700 font-mono">₹{order.subtotalRupees.toLocaleString()}</strong></div>
                          <div>Subsidy Deductions: <strong className="text-emerald-700 font-mono">-₹{order.discountRupees.toLocaleString()}</strong></div>
                          <div>Logistics Fee: <strong className="text-slate-700 font-mono">₹{order.shippingRupees.toLocaleString()}</strong></div>
                          <div className="border-t border-slate-200/60 pt-1.5 mt-1 flex justify-between items-center text-[10.5px] font-black text-slate-900">
                            <span>Grand Paid Total:</span>
                            <span className="text-emerald-700 font-mono">₹{order.totalRupees.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Returns Details Banner if already requested */}
                      {order.returnRequested && order.returnDetails && (
                        <div className="bg-amber-50/40 border border-amber-200 p-3 rounded-xl space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                            <span className="text-[10px] font-black text-amber-800 uppercase tracking-wide">Agricultural Claim Return Pending Verification</span>
                          </div>
                          <p className="text-[9px] text-slate-600 leading-normal font-medium">
                            A co-op claim inspector has been dispatched to review your <strong>{order.returnDetails.reason}</strong> return request submitted on <strong>{order.returnDetails.date}</strong>.
                          </p>
                          <div className="text-[8.5px] text-slate-500 font-semibold bg-white/60 p-2 rounded border border-amber-100">
                            <strong>Farmer Note:</strong> {order.returnDetails.note || "No comments left."}
                          </div>
                          {order.returnDetails.proofPreview && (
                            <div className="pt-1 flex items-center gap-2">
                              <span className="text-[8px] text-slate-400 font-bold uppercase block">Submitted Proof:</span>
                              <img
                                src={order.returnDetails.proofPreview}
                                alt="Claim proof"
                                referrerPolicy="no-referrer"
                                className="h-10 w-10 object-cover rounded border border-slate-200 shadow-2xs"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => handleDownloadInvoice(order)}
                          className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-[9px] font-black rounded-lg uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xs"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download Invoice (PDF)
                        </button>

                        {/* Return eligible (only if delivered and not already requested return) */}
                        {order.status === "Delivered" && !order.returnRequested && (
                          <button
                            type="button"
                            onClick={() => {
                              setReturnOrderId(order.id);
                              // Reset item selection for return modal
                              const initialSelect: Record<string, boolean> = {};
                              order.items.forEach(item => {
                                initialSelect[item.id] = true;
                              });
                              setReturnItemSelection(initialSelect);
                              setReturnReason("");
                              setReturnProofPreview(null);
                              setReturnNote("");
                              setReturnSuccessMsg("");
                              setIsReturnModalOpen(true);
                            }}
                            className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white text-[9px] font-black rounded-lg uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xs"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Request Return / Exchange
                          </button>
                        )}

                        {/* Cancel eligible (only if Pending or Confirmed) */}
                        {(order.status === "Pending" || order.status === "Confirmed") && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Are you sure you want to cancel cooperative procurement order ${order.id}?`)) {
                                setOrders(prev => prev.map(o => {
                                  if (o.id === order.id) {
                                    return { ...o, status: "Cancelled" };
                                  }
                                  return o;
                                }));
                                setSuccessMsg(`✓ Procurement Order ${order.id} cancelled successfully. State subsidies refunded.`);
                                setTimeout(() => setSuccessMsg(""), 5000);
                              }
                            }}
                            className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-[9px] font-black rounded-lg uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xs"
                          >
                            <X className="h-3.5 w-3.5" />
                            Cancel Procurement Order
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })()}
              </div>

            </div>
          </div>
        </div>
      ) : (
        /* SUPPLIER REVIEWS TAB SECTION (PART 4.6) */
        <div className="space-y-6 animate-in fade-in duration-300 animate-out duration-300" id="supplier-ratings-reviews-section">
          {/* Supplier Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* SUPPLIERS LIST (Col-span-4) */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 space-y-4 shadow-3xs">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">Verified Suppliers</span>
              
              <div className="space-y-2.5">
                {suppliersList.map((sup) => {
                  const totalStars = sup.reviews.reduce((sum, r) => sum + r.rating, 0);
                  const avgRating = sup.reviews.length > 0 ? (totalStars / sup.reviews.length).toFixed(1) : "0.0";
                  const isSelected = selectedSupplierId === sup.id;
                  
                  return (
                    <button
                      key={sup.id}
                      type="button"
                      onClick={() => {
                        setSelectedSupplierId(sup.id);
                        setSupplierReviewSuccess(false);
                      }}
                      className={`w-full p-3.5 rounded-xl border transition-all text-left block cursor-pointer ${
                        isSelected 
                          ? "bg-slate-900 border-slate-900 text-white shadow-md" 
                          : "bg-slate-50 border-slate-200/60 hover:bg-slate-100/80 text-slate-700"
                      }`}
                    >
                      <span className="font-extrabold text-xs block leading-tight">{sup.name}</span>
                      <span className={`text-[9px] font-semibold block mt-0.5 ${isSelected ? "text-slate-300" : "text-slate-400"}`}>
                        {sup.location}
                      </span>
                      
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-dashed border-slate-200/20">
                        <div className="flex items-center gap-1">
                          <Star className={`h-3.5 w-3.5 ${isSelected ? "text-amber-400 fill-amber-400" : "text-amber-500 fill-amber-500"}`} />
                          <span className="text-xs font-black">{avgRating}</span>
                          <span className="text-[9px] font-semibold opacity-80">({sup.reviews.length} reviews)</span>
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-wider opacity-90">{sup.productsSold.toLocaleString()}+ Units</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SUPPLIER DETAILS, BREAKDOWN & FEED (Col-span-8) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* CURRENTLY SELECTED SUPPLIER OVERVIEW */}
              {(() => {
                const activeSupplier = suppliersList.find(s => s.id === selectedSupplierId);
                if (!activeSupplier) return null;
                
                const totalStars = activeSupplier.reviews.reduce((sum, r) => sum + r.rating, 0);
                const avgRating = activeSupplier.reviews.length > 0 ? parseFloat((totalStars / activeSupplier.reviews.length).toFixed(1)) : 0.0;
                
                // Stars Breakdown Map
                const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
                activeSupplier.reviews.forEach(r => {
                  const ratingKey = Math.round(r.rating) as 5 | 4 | 3 | 2 | 1;
                  if (breakdown[ratingKey] !== undefined) {
                    breakdown[ratingKey]++;
                  }
                });

                return (
                  <div className="space-y-6">
                    {/* DETAILS CARD */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-3xs space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                        <div className="space-y-1">
                          <h3 className="text-sm font-extrabold text-slate-800">{activeSupplier.name}</h3>
                          <span className="text-[10px] text-slate-500 font-semibold block">{activeSupplier.location} • APEDA Registered Supplier</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl self-start">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500 shrink-0" />
                          <span className="text-sm font-black text-slate-800">{avgRating.toFixed(1)}</span>
                          <span className="text-[10px] font-bold text-slate-400">/ 5.0</span>
                        </div>
                      </div>

                      {/* SUMMARY & BREAKDOWN GRID */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        {/* Summary Score */}
                        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <strong className="text-4xl font-black text-slate-800 leading-none">{avgRating.toFixed(1)}</strong>
                          <div className="flex items-center text-amber-500 mt-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < Math.round(avgRating) ? "fill-amber-500" : "text-slate-200"}`} />
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold block mt-1 uppercase tracking-wider">
                            {activeSupplier.reviews.length} Cooperative Reviews
                          </span>
                        </div>

                        {/* Star Breakdown Bars */}
                        <div className="md:col-span-8 space-y-2 text-[10px] font-bold text-slate-500">
                          {([5, 4, 3, 2, 1] as const).map((stars) => {
                            const count = breakdown[stars];
                            const percent = activeSupplier.reviews.length > 0 ? (count / activeSupplier.reviews.length) * 100 : 0;
                            return (
                              <div key={stars} className="flex items-center gap-3">
                                <span className="w-10 font-black">{stars} Star</span>
                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-amber-400 transition-all duration-300" style={{ width: `${percent}%` }} />
                                </div>
                                <span className="w-6 text-right font-black text-slate-700">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* SUBMIT REVIEW FORM */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-3xs space-y-4">
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">Write a Supplier Review</span>
                      
                      {supplierReviewSuccess && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
                          <CheckCircle className="h-4.5 w-4.5 shrink-0" />
                          ✓ Your review has been dynamically registered to this supplier profile ledger.
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-extrabold text-slate-400 uppercase">Your Name / Handle</label>
                          <input
                            type="text"
                            placeholder="e.g. Jasbir S."
                            value={newSupplierReviewAuthor}
                            onChange={(e) => setNewSupplierReviewAuthor(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <label className="block text-[10px] font-extrabold text-slate-400 uppercase">Supplier Star Rating</label>
                          <div className="flex items-center gap-1.5 pt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setNewSupplierReviewRating(star)}
                                className="p-0.5 focus:outline-none cursor-pointer"
                              >
                                <Star className={`h-6 w-6 ${star <= newSupplierReviewRating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase">Text Review</label>
                        <textarea
                          rows={2.5}
                          placeholder="Describe crop response, packing quality, logistic delays, and compliance to standards..."
                          value={newSupplierReviewText}
                          onChange={(e) => setNewSupplierReviewText(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-normal"
                        />
                      </div>

                      {/* Photo Upload for Supplier Reviews (Part 4.6 Upload Proof/Photo optional) */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="md:col-span-8">
                          <label className="flex flex-col items-center justify-center border-2 border-slate-200 border-dashed rounded-xl p-3 bg-slate-50 hover:bg-slate-100/50 cursor-pointer transition-all">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setNewSupplierReviewPhoto(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            <Upload className="h-4.5 w-4.5 text-slate-400 mb-1" />
                            <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Upload Proof / Photo (Optional)</span>
                          </label>
                        </div>
                        <div className="md:col-span-4">
                          {newSupplierReviewPhoto ? (
                            <div className="flex items-center gap-2 p-1.5 border border-slate-200 rounded-xl bg-slate-50">
                              <img src={newSupplierReviewPhoto} alt="Review attachment" className="h-10 w-10 object-cover rounded-lg shrink-0" />
                              <button
                                type="button"
                                onClick={() => setNewSupplierReviewPhoto(null)}
                                className="text-[8px] font-black text-red-600 uppercase tracking-wider"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <span className="text-[9px] text-slate-400 font-bold italic block text-center">No Photo Added</span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={!newSupplierReviewAuthor.trim() || !newSupplierReviewText.trim()}
                        onClick={() => {
                          const newRev = {
                            author: newSupplierReviewAuthor,
                            rating: newSupplierReviewRating,
                            text: newSupplierReviewText,
                            date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
                            photo: newSupplierReviewPhoto
                          };

                          setSuppliersList(prev => prev.map(s => {
                            if (s.id === selectedSupplierId) {
                              return {
                                ...s,
                                reviews: [newRev, ...s.reviews]
                              };
                            }
                            return s;
                          }));

                          setNewSupplierReviewAuthor("");
                          setNewSupplierReviewText("");
                          setNewSupplierReviewRating(5);
                          setNewSupplierReviewPhoto(null);
                          setSupplierReviewSuccess(true);
                          setTimeout(() => {
                            setSupplierReviewSuccess(false);
                          }, 5000);
                        }}
                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-40"
                      >
                        Publish Verified Supplier Review
                      </button>
                    </div>

                    {/* REVIEWS FEED */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-3xs space-y-4">
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">Supplier Review Ledger</span>
                      
                      <div className="divide-y divide-slate-100">
                        {activeSupplier.reviews.map((rev, rIdx) => (
                          <div key={rIdx} className="py-4 first:pt-0 last:pb-0 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <span className="font-extrabold text-slate-800 block">{rev.author}</span>
                                <span className="text-[9px] text-slate-400 block font-semibold">{rev.date} • Verified Client</span>
                              </div>
                              <div className="flex items-center text-amber-500">
                                {Array.from({ length: 5 }).map((_, starIdx) => (
                                  <Star key={starIdx} className={`h-3.5 w-3.5 ${starIdx < rev.rating ? "fill-amber-500 text-amber-500" : "text-slate-200"}`} />
                                ))}
                              </div>
                            </div>
                            
                            <p className="text-slate-600 leading-normal italic font-medium">"{rev.text}"</p>
                            
                            {rev.photo && (
                              <div className="pt-1.5">
                                <img src={rev.photo} alt="User Proof" className="h-20 w-28 object-cover rounded-xl border border-slate-200" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>
        </div>
      )}

      {/* PORTAL/MODAL OVERLAY FOR DYNAMIC CHECKOUT STEP-BY-STEP (4.2 REQUIREMENT) */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between bg-slate-50 px-4 py-3 border-b border-slate-200">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 animate-pulse" />
                <span className="text-[10px] font-black uppercase text-slate-800 tracking-wider">
                  Secure Government-Subsidized Gateway
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCheckoutModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Modal Step 1: CONFIRM ORDER */}
            {checkoutModalStep === "confirm" && (
              <div className="p-5 space-y-4">
                <div className="text-left space-y-1">
                  <h3 className="text-slate-900 font-extrabold text-sm">Review Your Certified Agriculture Order</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">Your allocation will be locked upon final verification.</p>
                </div>

                {/* Main Item Card */}
                <div className="bg-slate-50 border border-slate-200/60 p-3.5 rounded-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[11px] font-black text-slate-900 block">{selectedProduct.name}</span>
                      <span className="text-[9px] text-slate-400 font-bold block">Supplier: {selectedProduct.supplier}</span>
                      <span className="text-[9px] text-slate-500 font-bold">Certification: {selectedProduct.certification.split(" ")[0]} Verified</span>
                    </div>
                    <span className="text-[11px] font-black text-slate-900 shrink-0">
                      ${selectedProduct.price.toFixed(2)}/u
                    </span>
                  </div>

                  <div className="border-t border-slate-200/40 pt-2 grid grid-cols-2 text-[9px] text-slate-500 font-semibold gap-1.5">
                    <div>Quantity Requested: <strong className="text-slate-800 font-black">{purchaseQty} unit(s)</strong></div>
                    <div>Purchase Mode: <strong className="text-slate-800 font-black">{purchaseType === "subscription" ? `Subscription (${subscriptionInterval})` : "One-time"}</strong></div>
                    <div>Logistics Mode: <strong className="text-slate-800 font-black uppercase">{deliverySpeed}</strong></div>
                    <div>Est. Hours: <strong className="text-slate-800 font-black">{deliverySpeed === "drone" ? "Within 2 Hours" : "2-5 Working Days"}</strong></div>
                  </div>
                </div>

                {/* Subsidies & Tax details */}
                <div className="space-y-1.5 text-[9px] bg-emerald-50/20 border border-emerald-100 p-3 rounded-xl font-bold">
                  <div className="flex justify-between text-slate-600">
                    <span>Base Subtotal ({purchaseQty} x ${selectedProduct.price.toFixed(2)}):</span>
                    <span>${subTotal.toFixed(2)}</span>
                  </div>
                  {discountValue > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>{discountTier.label}:</span>
                      <span>-${discountValue.toFixed(2)}</span>
                    </div>
                  )}
                  {subscriptionDiscountValue > 0 && (
                    <div className="flex justify-between text-indigo-700">
                      <span>Subscription Offset:</span>
                      <span>-${subscriptionDiscountValue.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600 border-t border-slate-200/50 pt-1">
                    <span>Vedic/NPOP Subsidy Offset (15%):</span>
                    <span className="text-emerald-700">-${(subTotal * 0.15).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>FCI Delivery Fee ({deliverySpeed}):</span>
                    <span>${deliveryCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Central GST (2.5%) / State GST (2.5%):</span>
                    <span>+${(subTotal * 0.05).toFixed(2)}</span>
                  </div>
                  
                  {/* Total */}
                  <div className="flex justify-between text-slate-900 font-black border-t border-slate-300 pt-1.5 text-[11px]">
                    <span>Total Subsidized Payable:</span>
                    <span>${(grandTotal - (subTotal * 0.15) + (subTotal * 0.05)).toFixed(2)}</span>
                  </div>
                </div>

                {/* Gps confirmation */}
                <div className="bg-amber-50/30 border border-amber-200/60 p-2.5 rounded-lg flex items-start gap-1.5">
                  <MapPin className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-[8.5px] text-slate-600 font-medium">
                    <span className="font-extrabold text-slate-900 block">Automatic GPS Farm-Gate Dispatch Address</span>
                    Coordinates derived from soil-health database. Matches registered land parcel in Andhra Pradesh co-op registries. No manual verification required.
                  </div>
                </div>

                {/* Place Order triggers */}
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingToCart(true);
                    setTimeout(() => {
                      setIsAddingToCart(false);
                      setCheckoutModalStep("success");
                      
                      // Add order to orders history
                      const defaultAddr = savedAddresses[0];
                      const orderNum = "COOP-ORD-" + Math.floor(100000 + Math.random() * 900000);
                      const chargedUsd = grandTotal - (subTotal * 0.15) + (subTotal * 0.05);
                      const newOrderObj: Order = {
                        id: orderNum,
                        date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
                        items: [{
                          id: `buy-now-${Date.now()}`,
                          product: selectedProduct,
                          qty: purchaseQty,
                          deliverySpeed: deliverySpeed,
                          priceRupees: Math.round(selectedProduct.price * EXCHANGE_RATE)
                        }],
                        subtotalRupees: Math.round(subTotal * EXCHANGE_RATE),
                        discountRupees: Math.round((discountValue + subscriptionDiscountValue + (subTotal * 0.15)) * EXCHANGE_RATE),
                        taxRupees: Math.round((subTotal * 0.05) * EXCHANGE_RATE),
                        shippingRupees: Math.round(deliveryCost * EXCHANGE_RATE),
                        totalRupees: Math.round(chargedUsd * EXCHANGE_RATE),
                        status: "Confirmed",
                        shippingAddress: {
                          name: defaultAddr.name,
                          phone: defaultAddr.phone,
                          addressLine: defaultAddr.addressLine,
                          city: defaultAddr.city,
                          state: defaultAddr.state,
                          pincode: defaultAddr.pincode
                        },
                        paymentMethod: "UPI (BHIM Secure Gateway)",
                        trackingNumber: "TRK-COOP-" + Math.floor(100000000 + Math.random() * 900000000)
                      };
                      setOrders(prev => [newOrderObj, ...prev]);
                      setSelectedOrderId(orderNum);

                      // Add to actual checkout confirmation string
                      setSuccessMsg(`✓ Direct purchase of ${purchaseQty} units of "${selectedProduct.name}" verified. Delivery via ${deliverySpeed.toUpperCase()} initiated.`);
                    }, 1200);
                  }}
                  disabled={isAddingToCart}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-55"
                >
                  {isAddingToCart ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Securing blockchain allotment...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Authorize Secure Allocation (${(grandTotal - (subTotal * 0.15) + (subTotal * 0.05)).toFixed(2)})
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Modal Step 2: SUCCESS RECEIPT */}
            {checkoutModalStep === "success" && (
              <div className="p-6 space-y-5 text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 animate-bounce mx-auto">
                  <Check className="h-6 w-6" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-slate-900 font-black text-sm">Allotment Authenticated</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Invoice Code: FCI-ORD-{Math.floor(100000 + Math.random() * 900000)}</p>
                </div>

                <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-xl text-left space-y-2 text-[9px]">
                  <div className="flex justify-between font-bold border-b border-slate-200/40 pb-1.5">
                    <span className="text-slate-500">Scheduled Dispatch Target:</span>
                    <span className="text-slate-800 font-extrabold">Autonomous GPS Coordinates (Andhra Pradesh Sector 4)</span>
                  </div>
                  <div className="flex justify-between font-bold border-b border-slate-200/40 pb-1.5">
                    <span className="text-slate-500">Logistics Payload Method:</span>
                    <span className="text-slate-800 font-extrabold uppercase">{deliverySpeed}</span>
                  </div>
                  <div className="flex justify-between font-bold border-b border-slate-200/40 pb-1.5">
                    <span className="text-slate-500">Est. Dispatch Timeframe:</span>
                    <span className="text-slate-800 font-extrabold">{deliverySpeed === "drone" ? "Within 2 Hours (Air Cargo)" : "2-5 Working Days"}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-1 text-[10px] text-slate-900 font-black">
                    <span>Authorized Price Charged:</span>
                    <span>${(grandTotal - (subTotal * 0.15) + (subTotal * 0.05)).toFixed(2)}</span>
                  </div>
                </div>

                <p className="text-[9px] text-slate-400 leading-normal font-semibold">
                  A receipt has been submitted to your registered farmer portal. This transaction is eligible for interest free credit scheme and central crop insurance offsets.
                </p>

                <button
                  type="button"
                  onClick={() => setIsCheckoutModalOpen(false)}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-black rounded-lg text-[10px] uppercase cursor-pointer"
                >
                  Return to Marketplace Catalog
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* PORTAL/MODAL OVERLAY FOR MULTI-ITEM CART CHECKOUT */}
      {isCartCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto" id="cart-checkout-modal">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between bg-slate-50 px-4 py-3 border-b border-slate-200">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 animate-pulse" />
                <span className="text-[10px] font-black uppercase text-slate-800 tracking-wider">
                  Secure Co-op Procurement Checkout
                </span>
              </div>
              <button
                type="button"
                onClick={closeCartCheckoutModal}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Stepper Progress Bar (only shown during checkout steps) */}
            {cartCheckoutStep !== "success" && (
              <div className="bg-slate-50/50 border-b border-slate-100 px-5 py-2.5 flex justify-between items-center text-[9px] font-black uppercase tracking-wider text-slate-400">
                <div className={`flex items-center gap-1 ${cartCheckoutStep === "address" ? "text-emerald-700" : "text-emerald-600 font-bold"}`}>
                  <span className={`h-4 w-4 rounded-full flex items-center justify-center ${cartCheckoutStep === "address" ? "bg-emerald-700 text-white" : "bg-emerald-100 text-emerald-800"}`}>1</span>
                  <span>Address</span>
                </div>
                <div className="h-px bg-slate-200 flex-1 mx-3" />
                <div className={`flex items-center gap-1 ${cartCheckoutStep === "payment" ? "text-emerald-700" : cartCheckoutStep === "summary" ? "text-emerald-600" : ""}`}>
                  <span className={`h-4 w-4 rounded-full flex items-center justify-center ${cartCheckoutStep === "payment" ? "bg-emerald-700 text-white" : cartCheckoutStep === "summary" ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-500"}`}>2</span>
                  <span>Payment</span>
                </div>
                <div className="h-px bg-slate-200 flex-1 mx-3" />
                <div className={`flex items-center gap-1 ${cartCheckoutStep === "summary" ? "text-emerald-700 font-black" : ""}`}>
                  <span className={`h-4 w-4 rounded-full flex items-center justify-center ${cartCheckoutStep === "summary" ? "bg-emerald-700 text-white" : "bg-slate-200 text-slate-500"}`}>3</span>
                  <span>Summary</span>
                </div>
              </div>
            )}

            {/* STEP 1: DELIVERY ADDRESS CONFIGURATION */}
            {cartCheckoutStep === "address" && (
              <div className="p-5 space-y-4">
                <div className="text-left space-y-1">
                  <h3 className="text-slate-900 font-extrabold text-sm flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    Specify Dispatch Delivery Address
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold">Please select one of your registered co-op addresses or define a new drop point.</p>
                </div>

                {/* Saved vs New Address Toggle */}
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setAddressType("saved")}
                    className={`py-1.5 text-[9.5px] font-black rounded-lg transition-all cursor-pointer ${
                      addressType === "saved"
                        ? "bg-white text-slate-800 shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Use Saved Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddressType("new")}
                    className={`py-1.5 text-[9.5px] font-black rounded-lg transition-all cursor-pointer ${
                      addressType === "new"
                        ? "bg-white text-slate-800 shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    + Add New Address
                  </button>
                </div>

                {/* SAVED ADDRESS SELECTOR */}
                {addressType === "saved" && (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {savedAddresses.map((addr) => (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer block relative ${
                          selectedAddressId === addr.id
                            ? "border-emerald-600 bg-emerald-50/25 ring-1 ring-emerald-500/25"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10.5px] font-black text-slate-800 block flex items-center gap-1">
                              {addr.id === 1 ? <Home className="h-3 w-3 text-emerald-600" /> : <Building className="h-3 w-3 text-amber-600" />}
                              {addr.name}
                            </span>
                            <span className="text-[9.5px] font-semibold text-slate-500 block mt-0.5">{addr.addressLine}</span>
                            <span className="text-[9px] font-bold text-slate-400 block">{addr.city}, {addr.state} - {addr.pincode}</span>
                          </div>
                          {selectedAddressId === addr.id && (
                            <span className="h-4.5 w-4.5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                              <Check className="h-3 w-3" />
                            </span>
                          )}
                        </div>
                        <div className="mt-2 text-[8.5px] font-black text-slate-500 flex items-center gap-1">
                          <Phone className="h-2.5 w-2.5 text-slate-400" />
                          <span>Phone: {addr.phone}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* ADD NEW ADDRESS FORM */}
                {addressType === "new" && (
                  <div className="space-y-3 bg-slate-50/50 border border-slate-150 p-4 rounded-xl text-left animate-in fade-in duration-150">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="space-y-1">
                        <label className="block text-[8.5px] font-black text-slate-500 uppercase">Receiver Full Name</label>
                        <input
                          type="text"
                          value={newAddress.name}
                          onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                          placeholder="e.g. Gurdev Singh"
                          className="w-full bg-white border border-slate-200 rounded-lg text-[10.5px] px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[8.5px] font-black text-slate-500 uppercase">Contact Phone No.</label>
                        <input
                          type="text"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          placeholder="e.g. +91 98123-45678"
                          className="w-full bg-white border border-slate-200 rounded-lg text-[10.5px] px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[8.5px] font-black text-slate-500 uppercase">Address Line / Field Landmark</label>
                      <input
                        type="text"
                        value={newAddress.addressLine}
                        onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                        placeholder="H.No, Street, Farm Plot Coordinates"
                        className="w-full bg-white border border-slate-200 rounded-lg text-[10.5px] px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <label className="block text-[8.5px] font-black text-slate-500 uppercase">City / Tehsil</label>
                        <input
                          type="text"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          placeholder="Vijayawada"
                          className="w-full bg-white border border-slate-200 rounded-lg text-[10.5px] px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[8.5px] font-black text-slate-500 uppercase">State</label>
                        <input
                          type="text"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          placeholder="Andhra Pradesh"
                          className="w-full bg-white border border-slate-200 rounded-lg text-[10.5px] px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[8.5px] font-black text-slate-500 uppercase">Pincode (6 Digit)</label>
                        <input
                          type="text"
                          maxLength={6}
                          value={newAddress.pincode}
                          onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value.replace(/\D/g, "") })}
                          placeholder="143001"
                          className="w-full bg-white border border-slate-200 rounded-lg text-[10.5px] px-2.5 py-1.5 font-black text-slate-800 tracking-wider focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (addressType === "new") {
                      if (!newAddress.name || !newAddress.phone || !newAddress.addressLine || !newAddress.city || !newAddress.pincode) {
                        alert("Please complete all the fields to add your dispatch address.");
                        return;
                      }
                      if (newAddress.pincode.length < 6) {
                        alert("Pincode must be exactly 6 digits.");
                        return;
                      }
                      // Append to saved addresses dynamically
                      const newlyAdded = {
                        id: Date.now(),
                        name: newAddress.name,
                        phone: newAddress.phone,
                        addressLine: newAddress.addressLine,
                        city: newAddress.city,
                        state: newAddress.state,
                        pincode: newAddress.pincode
                      };
                      setSavedAddresses([...savedAddresses, newlyAdded]);
                      setSelectedAddressId(newlyAdded.id);
                      setAddressType("saved");
                    }
                    // Go to payment step
                    setCartCheckoutStep("payment");
                  }}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                >
                  Proceed to Payment Gateway
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* STEP 2: PAYMENT METHOD CONFIGURATION */}
            {cartCheckoutStep === "payment" && (
              <div className="p-5 space-y-4">
                <div className="text-left space-y-1">
                  <h3 className="text-slate-900 font-extrabold text-sm flex items-center gap-1.5">
                    <CreditCard className="h-4 w-4 text-emerald-600" />
                    Select Safe Payment Channel
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold">Select your preferred transaction gateway. Fully secured via encrypted APEDA channel.</p>
                </div>

                {/* 5-Payment Options Selector */}
                <div className="grid grid-cols-5 gap-1 bg-slate-50 border border-slate-200/60 p-1 rounded-xl">
                  {[
                    { id: "upi", label: "UPI", desc: "No charges" },
                    { id: "card", label: "Card", desc: "1% back" },
                    { id: "netbanking", label: "NetBank", desc: "Direct" },
                    { id: "wallet", label: "Wallet", desc: "Kisan" },
                    { id: "cod", label: "COD", desc: "Farm" }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPaymentMethod(opt.id as any)}
                      className={`py-2 px-1 rounded-lg text-center transition-all cursor-pointer border ${
                        paymentMethod === opt.id
                          ? "border-emerald-600 bg-white text-emerald-800 font-black shadow-xs"
                          : "border-transparent text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <span className="block text-[9px] font-bold uppercase tracking-tight">{opt.label}</span>
                      <span className="block text-[7.5px] font-medium text-slate-400">{opt.desc}</span>
                    </button>
                  ))}
                </div>

                {/* BHIM UPI GATEWAY */}
                {paymentMethod === "upi" && (
                  <div className="space-y-3 bg-slate-50 border border-slate-150 p-4 rounded-xl text-left animate-in fade-in duration-200">
                    <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setUpiOption("qr")}
                        className={`flex-1 py-1 text-[8.5px] font-black uppercase rounded-md ${
                          upiOption === "qr" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500"
                        }`}
                      >
                        Display QR Code
                      </button>
                      <button
                        type="button"
                        onClick={() => setUpiOption("collect")}
                        className={`flex-1 py-1 text-[8.5px] font-black uppercase rounded-md ${
                          upiOption === "collect" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500"
                        }`}
                      >
                        Enter BHIM VPA
                      </button>
                    </div>

                    {upiOption === "qr" ? (
                      <div className="text-center py-2 space-y-2 flex flex-col items-center">
                        {/* Dynamic Stylized QR Code using Lucide & CSS */}
                        <div className="relative h-28 w-28 bg-white border border-slate-200 p-2 rounded-xl flex items-center justify-center shadow-xs">
                          <QrCode className="h-24 w-24 text-slate-800" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="bg-emerald-600 text-white font-black text-[6.5px] uppercase tracking-wider px-1 rounded-sm py-0.5 border border-white">UPI Pay</span>
                          </div>
                        </div>
                        <p className="text-[8.5px] text-slate-500 font-semibold leading-normal max-w-xs mx-auto">
                          Scan this secure QR code using GPay, PhonePe, Paytm or BHIM app to complete authorization of <span className="font-mono font-black text-slate-800">₹{cartTotalRupees.toLocaleString()}</span>.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="block text-[8.5px] font-black text-slate-500 uppercase">Enter your BHIM VPA ID</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={upiIdInput}
                            onChange={(e) => setUpiIdInput(e.target.value)}
                            placeholder="e.g. farmername@upi"
                            className="flex-1 bg-white border border-slate-200 rounded-lg text-xs font-bold px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (upiIdInput.includes("@")) {
                                setOtpSent(true);
                              } else {
                                alert("Please enter a valid UPI ID (e.g. mobile@upi or name@okaxis)");
                              }
                            }}
                            className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white font-black rounded-lg text-[10px] uppercase cursor-pointer"
                          >
                            Send request
                          </button>
                        </div>
                        {otpSent && (
                          <div className="space-y-1 pt-1.5 animate-in slide-in-from-top-1 duration-200">
                            <label className="block text-[8.5px] font-bold text-slate-500 uppercase flex justify-between">
                              <span>Simulated SMS PIN</span>
                              <span className="text-emerald-600 animate-pulse font-black">Code: 4819</span>
                            </label>
                            <input
                              type="text"
                              maxLength={4}
                              value={otpInput}
                              onChange={(e) => setOtpInput(e.target.value)}
                              placeholder="Enter 4819"
                              className="w-full bg-white border border-slate-200 rounded-lg text-xs font-black text-center tracking-widest px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* CREDIT/DEBIT CARD GATEWAY */}
                {paymentMethod === "card" && (
                  <div className="space-y-3 bg-slate-50 border border-slate-150 p-4 rounded-xl text-left animate-in fade-in duration-200">
                    {/* Visual Card Representation */}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-950 p-3.5 rounded-xl text-white space-y-4 shadow-md font-mono relative overflow-hidden">
                      <div className="absolute right-0 bottom-0 opacity-10 font-bold text-[60px] select-none -mb-4 mr-1">RuPay</div>
                      <div className="flex justify-between items-start">
                        <span className="text-[7.5px] bg-slate-700 px-1.5 py-0.5 rounded-sm uppercase tracking-widest text-emerald-300 font-extrabold">Co-op Credit Card</span>
                        <span className="text-[9px] font-black italic">RuPay </span>
                      </div>
                      <div className="space-y-1.5">
                        <span className="block text-xs font-bold tracking-widest">{cardDetails.number}</span>
                        <div className="flex justify-between text-[7px] text-slate-400 uppercase">
                          <div>
                            <span className="block">Holder</span>
                            <span className="text-white font-bold">{cardDetails.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="block">Expiry</span>
                            <span className="text-white font-bold">{cardDetails.expiry}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-2 pt-1 text-[9px] font-bold">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-500 uppercase text-[8px] mb-1">Card Number</label>
                          <input
                            type="text"
                            value={cardDetails.number}
                            onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-lg text-[10px] font-semibold px-2.5 py-1.5"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 uppercase text-[8px] mb-1">Cardholder Name</label>
                          <input
                            type="text"
                            value={cardDetails.name}
                            onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-lg text-[10px] font-semibold px-2.5 py-1.5"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-500 uppercase text-[8px] mb-1">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            maxLength={5}
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-lg text-[10px] font-semibold px-2.5 py-1.5"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 uppercase text-[8px] mb-1">CVV Code</label>
                          <input
                            type="password"
                            maxLength={3}
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, "") })}
                            className="w-full bg-white border border-slate-200 rounded-lg text-[10px] font-semibold px-2.5 py-1.5 text-center tracking-widest"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* NET BANKING GATEWAY */}
                {paymentMethod === "netbanking" && (
                  <div className="space-y-3 bg-slate-50 border border-slate-150 p-4 rounded-xl text-left animate-in fade-in duration-200">
                    <label className="block text-[8.5px] font-black text-slate-500 uppercase">Select Net Banking Bank</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { code: "SBI", name: "State Bank of India" },
                        { code: "PNB", name: "State Bank of India" },
                        { code: "HDFC", name: "HDFC Bank" },
                        { code: "ICICI", name: "ICICI Bank" }
                      ].map((bank) => (
                        <button
                          key={bank.code}
                          type="button"
                          onClick={() => setNetBankingBank(bank.code)}
                          className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                            netBankingBank === bank.code
                              ? "border-emerald-600 bg-white ring-1 ring-emerald-500/20 font-black text-emerald-800"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-[9.5px]"
                          }`}
                        >
                          <span className="block text-[10px] font-extrabold">{bank.code}</span>
                          <span className="block text-[8px] text-slate-400 font-semibold">{bank.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* KISAN WALLET */}
                {paymentMethod === "wallet" && (
                  <div className="space-y-3 bg-slate-50 border border-slate-150 p-4 rounded-xl text-left animate-in fade-in duration-200">
                    <div className="bg-emerald-50 border border-emerald-150 p-3 rounded-lg flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-emerald-800">
                        <Wallet className="h-4.5 w-4.5" />
                        <span className="text-[10px] font-black uppercase">Subsidized Kisan Wallet</span>
                      </div>
                      <span className="text-xs font-black text-emerald-700 font-mono">₹5,000.00</span>
                    </div>

                    <div className="text-[9px] text-slate-500 font-bold space-y-1 leading-tight">
                      <div className="flex justify-between">
                        <span>Available Wallet Capital:</span>
                        <span className="font-mono text-slate-800">₹5,000.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Procurement Batch Cost:</span>
                        <span className="font-mono text-slate-800">-₹{cartTotalRupees.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200 pt-1.5 font-black text-slate-700">
                        <span>Estimated Balance After:</span>
                        <span className="font-mono text-emerald-700">
                          {5000 - cartTotalRupees >= 0 
                            ? `₹${(5000 - cartTotalRupees).toLocaleString()}` 
                            : "Insufficient Wallet Funds"}
                        </span>
                      </div>
                    </div>

                    {5000 - cartTotalRupees < 0 && (
                      <p className="text-[7.5px] text-amber-700 font-semibold leading-normal">
                        ⚠️ Your current wallet capital is insufficient. Select card or UPI to pay the difference, or top up your registered wallet via co-op bank desk.
                      </p>
                    )}
                  </div>
                )}

                {/* CASH ON DELIVERY */}
                {paymentMethod === "cod" && (
                  <div className="bg-amber-50/40 border border-amber-200/60 p-4 rounded-xl text-left space-y-1 animate-in fade-in duration-200">
                    <h4 className="text-[10px] font-bold text-amber-900 flex items-center gap-1">
                      <Info className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                      Cash on Delivery (Farm-Gate Drop)
                    </h4>
                    <p className="text-[8.5px] text-slate-600 leading-relaxed font-semibold">
                      Payment is authorized in cash or private UPI directly to our logistics vehicle or drone pilots upon payload delivery at your fields. No credit transaction charges apply.
                    </p>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCartCheckoutStep("address")}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-black rounded-xl cursor-pointer uppercase tracking-wider"
                  >
                    Back to Address
                  </button>
                  <button
                    type="button"
                    disabled={paymentMethod === "wallet" && 5000 - cartTotalRupees < 0}
                    onClick={() => setCartCheckoutStep("summary")}
                    className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-black rounded-xl shadow-md transition-all cursor-pointer uppercase tracking-wider disabled:opacity-40"
                  >
                    Proceed to Summary
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: ORDER SUMMARY & REVIEW */}
            {cartCheckoutStep === "summary" && (
              <div className="p-5 space-y-4">
                <div className="text-left space-y-1">
                  <h3 className="text-slate-900 font-extrabold text-sm flex items-center gap-1.5">
                    <ShoppingBag className="h-4 w-4 text-emerald-600" />
                    Review and Place Order
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold">Verify all details of your subsidized agricultural batch before clicking Place Order.</p>
                </div>

                {/* Combined review card */}
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-left">
                  {/* Address Selection */}
                  <div className="p-3 bg-slate-50/50">
                    <span className="text-[8.5px] font-black text-slate-400 uppercase block mb-1">Dispatch Destination Address:</span>
                    {(() => {
                      const activeAddr = savedAddresses.find(a => a.id === selectedAddressId) || savedAddresses[0];
                      return (
                        <div className="text-[9.5px] font-semibold text-slate-700">
                          <span className="font-extrabold text-slate-900 block">{activeAddr.name} ({activeAddr.phone})</span>
                          <span>{activeAddr.addressLine}, {activeAddr.city}, {activeAddr.pincode}</span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Payment Selection */}
                  <div className="p-3 bg-slate-50/50">
                    <span className="text-[8.5px] font-black text-slate-400 uppercase block mb-1">Selected Payment Gateway:</span>
                    <div className="flex items-center gap-1 text-[9.5px] font-extrabold text-slate-900">
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="uppercase">{paymentMethod === "upi" ? "BHIM UPI Gateway" : paymentMethod === "card" ? "Co-op RuPay Card" : paymentMethod === "netbanking" ? `Net Banking (${netBankingBank})` : paymentMethod === "wallet" ? "Subsidized Kisan Wallet" : "Cash on Delivery"}</span>
                    </div>
                  </div>

                  {/* Summarized item list */}
                  <div className="p-3 max-h-28 overflow-y-auto divide-y divide-slate-50">
                    <span className="text-[8.5px] font-black text-slate-400 uppercase block mb-1">Batch Procurement Items ({cart.length}):</span>
                    {cart.map((item) => (
                      <div key={item.id} className="text-[9px] flex justify-between items-center py-1 font-bold">
                        <div className="min-w-0 flex-1 pr-2">
                          <span className="text-slate-800 block truncate">{item.product.name}</span>
                          <span className="text-slate-400 text-[8px]">Qty: {item.qty} • Speed: {item.deliverySpeed.toUpperCase()}</span>
                        </div>
                        <span className="font-black text-slate-900 font-mono">₹{(Math.round(item.product.price * 83) * item.qty).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Calculations breakdown */}
                  <div className="p-3 bg-slate-50 text-[9.5px] font-bold space-y-1">
                    <div className="flex justify-between text-slate-500">
                      <span>Gross Subtotal:</span>
                      <span className="text-slate-800 font-mono">₹{cartSubtotalRupees.toLocaleString()}</span>
                    </div>
                    {cartDiscountRupees > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Voucher Discount ({appliedCoupon?.code}):</span>
                        <span className="font-mono">-₹{cartDiscountRupees.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-500">
                      <span>Central & State GST (5%):</span>
                      <span className="text-slate-800 font-mono">+₹{cartTaxRupees.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Logistics Route Shipping ({shippingLocation}):</span>
                      <span className="text-slate-800 font-mono">₹{cartShippingRupees.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-900 font-black border-t border-slate-200 pt-1.5 text-[10.5px]">
                      <span>Grand Total Amount (INR):</span>
                      <span className="text-emerald-700 font-mono">₹{cartTotalRupees.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Back and Place Order Buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCartCheckoutStep("payment")}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-black rounded-xl cursor-pointer uppercase tracking-wider"
                  >
                    Back to Payment
                  </button>
                  <button
                    type="button"
                    disabled={isProcessingCartCheckout}
                    onClick={() => {
                      setIsProcessingCartCheckout(true);
                      setTimeout(() => {
                        setIsProcessingCartCheckout(false);
                        setCartCheckoutStep("success");
                        
                        // Create and add new order to history
                        const activeAddr = savedAddresses.find(a => a.id === selectedAddressId) || savedAddresses[0];
                        const newOrderObj: Order = {
                          id: generatedOrderNumber,
                          date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
                          items: cart.map(item => ({
                            id: item.id,
                            product: item.product,
                            qty: item.qty,
                            deliverySpeed: item.deliverySpeed,
                            priceRupees: Math.round(item.product.price * EXCHANGE_RATE)
                          })),
                          subtotalRupees: cartSubtotalRupees,
                          discountRupees: cartDiscountRupees,
                          taxRupees: cartTaxRupees,
                          shippingRupees: cartShippingRupees,
                          totalRupees: cartTotalRupees,
                          status: "Confirmed",
                          shippingAddress: {
                            name: activeAddr.name,
                            phone: activeAddr.phone,
                            addressLine: activeAddr.addressLine,
                            city: activeAddr.city,
                            state: activeAddr.state,
                            pincode: activeAddr.pincode
                          },
                          paymentMethod: paymentMethod === "upi" ? "BHIM UPI Gateway" : paymentMethod === "card" ? "Co-op Credit Card" : paymentMethod === "netbanking" ? `Net Banking (${netBankingBank})` : paymentMethod === "wallet" ? "Subsidized Kisan Wallet" : "Cash on Delivery",
                          trackingNumber: "TRK-COOP-" + Math.floor(100000000 + Math.random() * 900000000)
                        };
                        setOrders(prev => [newOrderObj, ...prev]);
                        setSelectedOrderId(generatedOrderNumber);

                        // Clear the active cart
                        setCart([]);
                      }, 1800);
                    }}
                    className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                  >
                    {isProcessingCartCheckout ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Place Order (₹{cartTotalRupees.toLocaleString()})
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: ORDER CONFIRMATION & LIVE TRACKING */}
            {cartCheckoutStep === "success" && (
              <div className="p-6 space-y-5 text-center">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 animate-bounce mx-auto">
                  <Check className="h-8 w-8 font-black" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-slate-900 font-black text-base">Your Order Confirmed!</h3>
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Order Reference Code: {generatedOrderNumber}</p>
                </div>

                {/* Order Confirmation details card */}
                <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-xl text-left space-y-2.5 text-[9.5px] font-medium">
                  <div className="flex justify-between font-bold border-b border-slate-200/30 pb-1.5">
                    <span className="text-slate-500">Scheduled Dispatch Target:</span>
                    <span className="text-slate-800 font-extrabold">Coordinates ({shippingLocation} Sector)</span>
                  </div>
                  <div className="flex justify-between font-bold border-b border-slate-200/30 pb-1.5">
                    <span className="text-slate-500">Estimated Delivery Date:</span>
                    <span className="text-emerald-700 font-extrabold">{cartEstimatedDelivery}</span>
                  </div>
                  <div className="flex justify-between font-bold border-b border-slate-200/30 pb-1.5">
                    <span className="text-slate-500">Subsidized Payment Gateway:</span>
                    <span className="text-slate-800 font-extrabold uppercase">{paymentMethod} Gateway</span>
                  </div>
                  <div className="flex justify-between font-bold pt-0.5 text-[10px] text-slate-900 font-black">
                    <span>Authorized Price Charged:</span>
                    <span className="text-emerald-700 font-black font-mono">₹{cartTotalRupees.toLocaleString()}</span>
                  </div>
                </div>

                {/* Interactive Tracking Section */}
                <div className="bg-slate-50/50 border border-slate-150 p-4 rounded-xl text-left space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-700">Live Logistics Tracker</span>
                    <button
                      type="button"
                      onClick={() => {
                        setTrackingStep((prev) => (prev < 3 ? prev + 1 : 0));
                      }}
                      className="px-2 py-1 bg-slate-800 text-white text-[8px] font-black uppercase rounded hover:bg-slate-950 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCw className="h-2.5 w-2.5 animate-spin-slow" />
                      Simulate Progress
                    </button>
                  </div>

                  {/* Horizontal step line */}
                  <div className="relative pt-2 pb-1">
                    <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-200" />
                    <div 
                      className="absolute top-4 left-4 h-0.5 bg-emerald-600 transition-all duration-300"
                      style={{ width: `${(trackingStep / 3) * 100}%` }}
                    />
                    
                    <div className="flex justify-between items-center relative">
                      {[
                        { step: 0, label: "Placed", desc: "Order confirmed" },
                        { step: 1, label: "Dispatched", desc: "In Hub" },
                        { step: 2, label: "Transit", desc: "Drone flying" },
                        { step: 3, label: "Delivered", desc: "Dropped" }
                      ].map((item) => (
                        <div key={item.step} className="text-center relative flex flex-col items-center">
                          <div 
                            className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[8px] font-bold border-2 transition-all duration-200 ${
                              trackingStep >= item.step 
                                ? "bg-emerald-600 border-emerald-600 text-white" 
                                : "bg-white border-slate-200 text-slate-400"
                            }`}
                          >
                            {trackingStep > item.step ? "✓" : item.step + 1}
                          </div>
                          <span className={`block text-[8px] font-black mt-1 ${trackingStep >= item.step ? "text-slate-800" : "text-slate-400"}`}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-[8.5px] text-slate-500 leading-normal font-semibold text-center border-t border-slate-200/50 pt-2 bg-slate-100/40 p-1.5 rounded-md">
                    {trackingStep === 0 && "📌 Order logged in Central Kisan Registry. Packaging at district hub."}
                    {trackingStep === 1 && "🚚 Order sorted and handed over to local cooperative delivery team."}
                    {trackingStep === 2 && "🚀 Payload in transit. Automated GPS drone piloting routes assigned."}
                    {trackingStep === 3 && "🎉 Mission complete! Package successfully dropped at field GPS coordinates."}
                  </p>
                </div>

                <p className="text-[8.5px] text-slate-400 leading-normal font-semibold">
                  A dynamic receipt invoice has been submitted to your registered farmer profile. This order qualifies for co-op crop insurance protection and state machinery tax benefits.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      closeCartCheckoutModal();
                      setActiveMarketTab("orders");
                    }}
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-lg text-[10px] uppercase tracking-wider cursor-pointer shadow-xs"
                  >
                    Track Order
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closeCartCheckoutModal();
                      setActiveMarketTab("catalog");
                    }}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-black rounded-lg text-[10px] uppercase tracking-wider cursor-pointer"
                  >
                    Return to Catalog
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Return Modal Overlay */}
      {isReturnModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full shadow-xl overflow-hidden animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="bg-slate-950 px-5 py-4 flex justify-between items-center text-white">
              <div>
                <h3 className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <RotateCcw className="h-4.5 w-4.5 text-amber-500" />
                  APEDA Agricultural Return Claim
                </h3>
                <span className="text-[8px] text-slate-400 font-mono block">Order Ref: {returnOrderId}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsReturnModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-left">
              
              {/* Step 1: Select items to return */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">1. Select Certified Items to Return</span>
                <div className="border border-slate-200/80 rounded-xl divide-y divide-slate-100 overflow-hidden bg-slate-50/50">
                  {(() => {
                    const orderObj = orders.find(o => o.id === returnOrderId);
                    return orderObj?.items.map(item => (
                      <label key={item.id} className="p-2.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 transition-all">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={!!returnItemSelection[item.id]}
                            onChange={(e) => {
                              setReturnItemSelection(prev => ({ ...prev, [item.id]: e.target.checked }));
                            }}
                            className="h-3.5 w-3.5 accent-emerald-700 cursor-pointer"
                          />
                          <div className="min-w-0">
                            <span className="text-[9.5px] font-extrabold text-slate-900 block truncate max-w-[240px]">{item.product.name}</span>
                            <span className="text-[8px] text-slate-400 font-bold block">Allocated Qty: {item.qty} • ₹{item.priceRupees.toLocaleString()}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-slate-800 font-mono">₹{(item.priceRupees * item.qty).toLocaleString()}</span>
                      </label>
                    ));
                  })()}
                </div>
              </div>

              {/* Step 2: Reason for Return */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">2. Select Primary Defect Category</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: "Damaged", desc: "Compromised bag/tears" },
                    { val: "Wrong item", desc: "Variety mismatch" },
                    { val: "Not as described", desc: "Viability test failed" }
                  ].map((r) => (
                    <button
                      key={r.val}
                      type="button"
                      onClick={() => setReturnReason(r.val as any)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-between h-14 ${
                        returnReason === r.val
                          ? "bg-amber-50 border-amber-500 shadow-3xs"
                          : "bg-white border-slate-200/80 hover:bg-slate-50/50"
                      }`}
                    >
                      <span className="text-[9.5px] font-black text-slate-900 block uppercase tracking-wider leading-none">{r.val}</span>
                      <span className="text-[7.5px] text-slate-400 font-bold block leading-tight">{r.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Photo Upload */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">3. Upload Damage Proof (Photo)</span>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
                  <div className="md:col-span-8">
                    <label className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all h-20 bg-slate-50/30">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setReturnProofPreview(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <Upload className="h-4 w-4 text-slate-400 animate-pulse mb-1" />
                      <span className="text-[8px] font-black uppercase text-slate-500 tracking-wider">Drag or Tap to Upload Image</span>
                      <span className="text-[7px] text-slate-400 font-bold block">Camera / gallery captures accepted</span>
                    </label>
                  </div>
                  <div className="md:col-span-4 space-y-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setReturnProofPreview("https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=150&q=80");
                      }}
                      className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[7.5px] font-black uppercase rounded border border-slate-200 cursor-pointer"
                    >
                      Use Sample Proof Photo
                    </button>
                    {returnProofPreview ? (
                      <div className="flex items-center justify-center border border-emerald-500 rounded-lg p-1 bg-emerald-50/30">
                        <img
                          src={returnProofPreview}
                          alt="Proof preview"
                          className="h-10 w-10 object-cover rounded-md"
                        />
                      </div>
                    ) : (
                      <div className="h-12 border border-slate-200 border-dashed rounded-lg flex items-center justify-center text-[7.5px] text-slate-300 font-bold uppercase">
                        No File Added
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 4: Notes */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">4. Explanatory Comments (Optional)</span>
                <textarea
                  placeholder="Describe seed viability parameters, nitrogen analysis or packaging defects..."
                  value={returnNote}
                  onChange={(e) => setReturnNote(e.target.value)}
                  className="w-full border border-slate-200/80 rounded-xl p-2 text-[9.5px] text-slate-800 font-semibold focus:outline-emerald-600 focus:ring-0 placeholder:text-slate-300 h-14 resize-none"
                />
              </div>

              {/* Error or Success feedback */}
              {returnSuccessMsg && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold p-2.5 rounded-xl text-[9.5px] text-center uppercase tracking-wide">
                  {returnSuccessMsg}
                </div>
              )}

              {/* Submit Return */}
              <button
                type="button"
                disabled={isSubmittingReturn || !returnReason || Object.values(returnItemSelection).filter(Boolean).length === 0}
                onClick={() => {
                  setIsSubmittingReturn(true);
                  setTimeout(() => {
                    setIsSubmittingReturn(false);
                    setReturnSuccessMsg("✓ Claim filed with APEDA district registry.");
                    
                    // Update the order in state
                    setOrders(prev => prev.map(order => {
                      if (order.id === returnOrderId) {
                        return {
                          ...order,
                          returnRequested: true,
                          returnDetails: {
                            reason: returnReason,
                            proofPreview: returnProofPreview,
                            note: returnNote,
                            date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
                            selectedItems: Object.keys(returnItemSelection).filter(k => returnItemSelection[k])
                          }
                        };
                      }
                      return order;
                    }));

                    setTimeout(() => {
                      setIsReturnModalOpen(false);
                      setReturnSuccessMsg("");
                    }, 1500);

                  }, 1600);
                }}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
              >
                {isSubmittingReturn ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Registering blockchain APEDA return...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    File Cooperative Claim Refund
                  </>
                )}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
