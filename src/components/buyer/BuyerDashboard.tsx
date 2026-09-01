import React, { useState, useEffect, useMemo } from "react";
import {
  Shield,
  Briefcase,
  TrendingUp,
  Clock,
  DollarSign,
  Heart,
  Truck,
  FileCheck,
  Search,
  PlusCircle,
  Eye,
  Calendar,
  AlertCircle,
  MapPin,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Star,
  Layers,
  Sparkles,
  Award,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Tag
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BuyerDashboardProps {
  bids: any[];
  onAddBid?: (newBid: any) => void;
  onUpdateBid?: (id: string, updated: any) => void;
  onNavigate: (tab: "exchange" | "procurement" | "traceability" | "verification" | "orders") => void;
}

export default function BuyerDashboard({ bids, onAddBid, onUpdateBid, onNavigate }: BuyerDashboardProps) {
  // Load Buyer Data
  const [buyerData, setBuyerData] = useState<any>(() => {
    const raw = localStorage.getItem("agriconnect_buyer_data");
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  const buyerName = buyerData?.businessName || buyerData?.personalDetails?.companyName || "Global Agrifood Corp";
  const verificationProgress = buyerData?.verificationProgress;

  // 1. Calculate Trust Score (0 - 100)
  const getTrustScore0To100 = () => {
    let score = 35; // Base score
    if (!verificationProgress) return score;
    if (verificationProgress.emailVerified) score += 20;
    if (verificationProgress.mobileVerified) score += 20;
    if (verificationProgress.gstVerified) score += 30;
    if (verificationProgress.bankVerified) score += 15;
    if (verificationProgress.creditVerified) score += 15;
    return Math.min(100, score);
  };

  const trustScore = getTrustScore0To100();

  // Color Indicator
  const getScoreColor = (score: number) => {
    if (score >= 70) return { text: "text-emerald-600", bg: "bg-emerald-500", border: "border-emerald-200", lightBg: "bg-emerald-50", fill: "stroke-emerald-500" };
    if (score >= 45) return { text: "text-amber-600", bg: "bg-amber-500", border: "border-amber-200", lightBg: "bg-amber-50", fill: "stroke-amber-500" };
    return { text: "text-rose-600", bg: "bg-rose-500", border: "border-rose-200", lightBg: "bg-rose-50", fill: "stroke-rose-500" };
  };

  const colors = getScoreColor(trustScore);

  // Live countdown auction state for listings
  const [listings, setListings] = useState([
    {
      id: "lot-1",
      cropName: "Premium Basmati Rice (Pusa-1121)",
      farmerName: "Sukhdev Singh",
      location: "Gurdaspur, Punjab",
      region: "Punjab",
      cropType: "Rice",
      quantity: 18,
      qualityGrade: "Premium",
      currentBidPrice: 65000, // in ₹
      harvestDate: "2026-06-28",
      timeLeft: 4800, // in seconds
    },
    {
      id: "lot-2",
      cropName: "Soft Red Winter Wheat (HD-2967)",
      farmerName: "Baldev Mann",
      location: "Karnal, Haryana",
      region: "Haryana",
      cropType: "Wheat",
      quantity: 32,
      qualityGrade: "Grade A",
      currentBidPrice: 24000,
      harvestDate: "2026-06-25",
      timeLeft: 7200,
    },
    {
      id: "lot-3",
      cropName: "Golden Delicious Apples",
      farmerName: "Devender Sharma",
      location: "Shimla, Himachal Pradesh",
      region: "Himachal Pradesh",
      cropType: "Apple",
      quantity: 6,
      qualityGrade: "Grade A",
      currentBidPrice: 95000,
      harvestDate: "2026-07-02",
      timeLeft: 3600,
    },
    {
      id: "lot-4",
      cropName: "Non-GMO Feed Corn (Yellow Dent)",
      farmerName: "Rajinder Singh",
      location: "Moga, Punjab",
      region: "Punjab",
      cropType: "Corn",
      quantity: 45,
      qualityGrade: "Grade B",
      currentBidPrice: 18500,
      harvestDate: "2026-06-18",
      timeLeft: 12000,
    },
    {
      id: "lot-5",
      cropName: "Organic High-Protein Soybeans",
      farmerName: "Gurnam Singh",
      location: "Ambala, Haryana",
      region: "Haryana",
      cropType: "Soybean",
      quantity: 12,
      qualityGrade: "Grade A",
      currentBidPrice: 42000,
      harvestDate: "2026-06-22",
      timeLeft: 900, // Ending soon
    },
    {
      id: "lot-6",
      cropName: "Shahi Sweet Honey Cherries",
      farmerName: "Zahoor Lone",
      location: "Sopore, Jammu & Kashmir",
      region: "Jammu & Kashmir",
      cropType: "Cherry",
      quantity: 3,
      qualityGrade: "Premium",
      currentBidPrice: 145000,
      harvestDate: "2026-07-04",
      timeLeft: 5400,
    }
  ]);

  // Live Timer Countdowns
  useEffect(() => {
    const timer = setInterval(() => {
      setListings((prevListings) =>
        prevListings.map((l) => {
          if (l.timeLeft > 0) {
            return { ...l, timeLeft: l.timeLeft - 1 };
          }
          return l;
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimeLeft = (sec: number) => {
    if (sec <= 0) return "Auction Ended";
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h}h ${m}m ${s}s`;
  };

  // 2.2 Live Crop Feed filters state
  const [filterCropType, setFilterCropType] = useState("All");
  const [filterQuality, setFilterQuality] = useState("All");
  const [filterRegion, setFilterRegion] = useState("All");
  const [filterMaxPrice, setFilterMaxPrice] = useState(160000);
  const [filterRecentlyHarvested, setFilterRecentlyHarvested] = useState(false);
  const [sortBy, setSortBy] = useState("newest"); // "newest", "price-asc", "price-desc", "quality"

  // Helper to determine days since harvest relative to metadata time 2026-07-06
  const getDaysSinceHarvest = (dateStr: string) => {
    const harvest = new Date(dateStr);
    const today = new Date("2026-07-06");
    const diffTime = Math.abs(today.getTime() - harvest.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Helper for grade sorting weight
  const getQualityWeight = (grade: string) => {
    if (grade === "Premium") return 4;
    if (grade === "Grade A") return 3;
    if (grade === "Grade B") return 2;
    if (grade === "Grade C") return 1;
    return 0;
  };

  // Filtered and Sorted Listings computed list
  const filteredListings = useMemo(() => {
    return listings
      .filter((l) => {
        if (filterCropType !== "All" && l.cropType !== filterCropType) return false;
        if (filterQuality !== "All" && l.qualityGrade !== filterQuality) return false;
        if (filterRegion !== "All" && l.region !== filterRegion) return false;
        if (l.currentBidPrice > filterMaxPrice) return false;
        if (filterRecentlyHarvested) {
          const days = getDaysSinceHarvest(l.harvestDate);
          if (days > 10) return false; // within last 10 days
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") {
          return a.currentBidPrice - b.currentBidPrice;
        }
        if (sortBy === "price-desc") {
          return b.currentBidPrice - a.currentBidPrice;
        }
        if (sortBy === "quality") {
          return getQualityWeight(b.qualityGrade) - getQualityWeight(a.qualityGrade);
        }
        if (sortBy === "newest") {
          return new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime();
        }
        return 0;
      });
  }, [listings, filterCropType, filterQuality, filterRegion, filterMaxPrice, filterRecentlyHarvested, sortBy]);

  // Stats Counters
  const activeBidsCount = useMemo(() => {
    const customBids = bids.filter(b => b.buyerName === buyerName || b.buyerName === "Global Agrifood Corp").length;
    return customBids > 0 ? customBids : 4;
  }, [bids, buyerName]);

  const [pendingOrdersCount, setPendingOrdersCount] = useState(3);
  const [totalSpent, setTotalSpent] = useState("₹8,45,000");
  const [warehouseUsed, setWarehouseUsed] = useState(480);
  const [warehouseTotal, setWarehouseTotal] = useState(1000);

  // Favorites List state
  const [favorites, setFavorites] = useState([
    { id: 1, name: "Sukhdev Singh Farms", type: "Farm", crop: "Premium Basmati Rice", rating: 4.9 },
    { id: 2, name: "Golden Fields Cooperative", type: "Cooperative", crop: "Soft Red Winter Wheat", rating: 4.8 },
    { id: 3, name: "Himachal Apple Orchard", type: "Farm", crop: "Grade A Apples", rating: 4.7 }
  ]);

  // Modal Dialog states
  const [activeModal, setActiveModal] = useState<"orders" | "pickup" | "quality" | "place-bid" | "create-rfq" | null>(null);
  const [selectedBidCrop, setSelectedBidCrop] = useState<any>(null);
  const [customBidAmount, setCustomBidAmount] = useState<string>("");
  const [bidError, setBidError] = useState("");
  const [bidSuccess, setBidSuccess] = useState(false);

  // RFQ Form state
  const [rfqCrop, setRfqCrop] = useState("Premium Basmati Rice");
  const [rfqGrade, setRfqGrade] = useState("Grade A");
  const [rfqQuantity, setRfqQuantity] = useState("25");
  const [rfqTargetPrice, setRfqTargetPrice] = useState("64000");
  const [rfqDeliveryDate, setRfqDeliveryDate] = useState("2026-08-15");
  const [rfqLocation, setRfqLocation] = useState("Jalandhar Central Logistics Hub");
  const [rfqSuccess, setRfqSuccess] = useState(false);

  // Form states for Pickup
  const [pickupLocation, setPickupLocation] = useState("Warehouse Lot-B4, Jalandhar");
  const [pickupDate, setPickupDate] = useState("2026-07-15");
  const [pickupVehicle, setPickupVehicle] = useState("10-Ton Container Truck");
  const [pickupSuccess, setPickupSuccess] = useState(false);

  // Form states for Quality Check
  const [qualityCrop, setQualityCrop] = useState("Premium Basmati Rice");
  const [qualityLot, setQualityLot] = useState("LOT-8821");
  const [qualityLab, setQualityLab] = useState("Agri-Tech Government Certified Labs");
  const [qualitySuccess, setQualitySuccess] = useState(false);

  // Simulated Orders List
  const [orders, setOrders] = useState([
    { id: "ORD-9921", seller: "Sukhdev Singh Farms", crop: "Premium Basmati Rice", qty: "15 Tons", value: "₹4,50,000", status: "Escrow Deposited", date: "July 04, 2026" },
    { id: "ORD-8812", seller: "Golden Fields Coop", crop: "Soft Red Winter Wheat", qty: "20 Tons", value: "₹2,80,000", status: "In Transit", date: "June 28, 2026" },
    { id: "ORD-7745", seller: "Sukhbir Mann Farms", crop: "Organic Soybeans", qty: "8 Tons", value: "₹1,15,000", status: "Quality Check Approved", date: "June 24, 2026" }
  ]);

  const handleSchedulePickup = (e: React.FormEvent) => {
    e.preventDefault();
    setPickupSuccess(true);
    setTimeout(() => {
      setPickupSuccess(false);
      setActiveModal(null);
    }, 1800);
  };

  const handleRequestQualityCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setQualitySuccess(true);
    setTimeout(() => {
      setQualitySuccess(false);
      setActiveModal(null);
    }, 1800);
  };

  const handleCreateRfqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBid = {
      id: `bid-${Date.now()}`,
      cropType: rfqCrop,
      quantity: Number(rfqQuantity) || 20,
      quality: rfqGrade,
      pricePerTon: Number(rfqTargetPrice) || 60000,
      buyerName: buyerName,
      status: "Active",
      date: new Date().toLocaleDateString()
    };
    if (onAddBid) {
      onAddBid(newBid);
    }
    setRfqSuccess(true);
    setTimeout(() => {
      setRfqSuccess(false);
      setActiveModal(null);
    }, 1800);
  };

  // Open the Place Bid modal
  const handleOpenBidModal = (cropListing: any) => {
    setSelectedBidCrop(cropListing);
    setCustomBidAmount((cropListing.currentBidPrice + 1500).toString());
    setBidError("");
    setBidSuccess(false);
    setActiveModal("place-bid");
  };

  // Submit Bid Logic
  const handlePlaceBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedBid = parseInt(customBidAmount);
    if (isNaN(parsedBid) || parsedBid <= selectedBidCrop.currentBidPrice) {
      setBidError(`Your bid must be strictly greater than the current bid of ₹${selectedBidCrop.currentBidPrice.toLocaleString()}`);
      return;
    }

    // 1. Update listing currentBidPrice in state
    setListings((prev) =>
      prev.map((item) =>
        item.id === selectedBidCrop.id ? { ...item, currentBidPrice: parsedBid } : item
      )
    );

    // 2. Call parent callback if defined to synchronize Active Bids count
    if (onAddBid) {
      onAddBid({
        id: `bid-${Date.now()}`,
        cropType: selectedBidCrop.cropType,
        quantity: selectedBidCrop.quantity,
        quality: selectedBidCrop.qualityGrade,
        pricePerTon: parsedBid,
        buyerName: buyerName,
        status: "Active",
        date: new Date().toLocaleDateString()
      });
    }

    setBidSuccess(true);
    setTimeout(() => {
      setBidSuccess(false);
      setActiveModal(null);
      setSelectedBidCrop(null);
    }, 1800);
  };

  return (
    <div className="space-y-6" id="buyer-dashboard-landing">
      {/* 2.1 Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Welcome Hero card */}
        <div className="lg:col-span-8 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/15 border border-teal-500/30 rounded-full text-[10px] text-teal-300 font-extrabold uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" /> Enterprise Dashboard
            </div>
            <h1 className="text-2xl font-black tracking-tight mt-1">
              Welcome back, <span className="text-teal-400">{buyerName}</span>
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              Monitor active market bids, review secure crop escrow agreements, audit real-time logistical pickups, and manage certified quality checks from a unified command panel.
            </p>
          </div>

          {/* Core Stats overview in Hero */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800 mt-6 text-center">
            <div>
              <p className="text-[9px] uppercase tracking-widest font-black text-slate-500">Active Bids</p>
              <p className="text-xl font-mono font-black text-white mt-1">{activeBidsCount}</p>
            </div>
            <div className="border-l border-slate-800">
              <p className="text-[9px] uppercase tracking-widest font-black text-slate-500">Pending Orders</p>
              <p className="text-xl font-mono font-black text-white mt-1">{pendingOrdersCount}</p>
            </div>
            <div className="border-l border-slate-800">
              <p className="text-[9px] uppercase tracking-widest font-black text-slate-500">Total Spent <span className="text-[8px] text-slate-600 block lowercase md:inline">(this month)</span></p>
              <p className="text-xl font-mono font-black text-teal-400 mt-1">{totalSpent}</p>
            </div>
          </div>
        </div>

        {/* 2.1 Hero Section Trust Score Card */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Verification Audit</h3>
              <p className="text-sm font-bold text-slate-800 mt-0.5">Trust Score Index</p>
            </div>
            <div className={`p-1.5 rounded-lg ${colors.lightBg} ${colors.text} border ${colors.border}`}>
              <Shield className="h-5 w-5" />
            </div>
          </div>

          <div className="flex items-center gap-4 py-4">
            {/* Visual Circular Gauge 0-100 */}
            <div className="relative flex items-center justify-center shrink-0">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  className="stroke-slate-100"
                  strokeWidth="7"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  className={`${colors.fill} transition-all duration-1000 ease-out`}
                  strokeWidth="7"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 38}
                  strokeDashoffset={2 * Math.PI * 38 * (1 - trustScore / 100)} // scale from 100 index
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className={`text-xl font-black font-mono ${colors.text}`}>
                  {Math.round(trustScore)}
                </span>
                <span className="text-[8px] text-slate-400 block font-bold">/ 100</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-800">
                {trustScore >= 70 ? "Highly Trusted Partner" : trustScore >= 45 ? "Verified Trader Status" : "Basic Registration Tier"}
              </p>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Your score is calculated based on business, tax and account verification levels. Complete more steps to unlock full bidding capacity.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate("verification")}
            className="w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 cursor-pointer"
          >
            Upgrade Trust Score <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* 2.2 Quick Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="buyer-stats-grid">
        {/* Quick Stat 1: Active Bids */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider block">Active Escrow Bids</span>
            <h4 className="text-base font-black text-slate-800 font-mono">{activeBidsCount} Active</h4>
            <p className="text-[10px] text-slate-500 font-medium">Estimated: ₹5,40,000 value</p>
          </div>
          <div className="p-2.5 bg-teal-50 border border-teal-100 text-teal-600 rounded-xl">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        {/* Quick Stat 2: Pending Deliveries */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider block">Pending Deliveries</span>
            <h4 className="text-base font-black text-slate-800 font-mono">2 Shipments</h4>
            <p className="text-[10px] text-slate-500 font-medium">1 arriving in Jalandhar tomorrow</p>
          </div>
          <div className="p-2.5 bg-cyan-50 border border-cyan-100 text-cyan-600 rounded-xl">
            <Truck className="h-5 w-5" />
          </div>
        </div>

        {/* Quick Stat 3: Warehouse Capacity */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5 flex-1 pr-3">
            <span className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider block">Warehouse Capacity</span>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
              <span>{warehouseUsed} / {warehouseTotal} TONS</span>
              <span className="text-slate-400 font-medium">{Math.round((warehouseUsed / warehouseTotal) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-teal-600 h-full rounded-full transition-all duration-500" style={{ width: `${(warehouseUsed / warehouseTotal) * 100}%` }} />
            </div>
          </div>
          <div className="p-2.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl shrink-0">
            <Layers className="h-5 w-5" />
          </div>
        </div>

        {/* Quick Stat 4: Favorites */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider block">Farms & Crops Saved</span>
            <h4 className="text-base font-black text-slate-800 font-mono">{favorites.length} Saved</h4>
            <p className="text-[10px] text-slate-500 font-medium">Direct procurement links</p>
          </div>
          <div className="p-2.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl">
            <Heart className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 2.3 Quick Action Buttons Section */}
      <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 shadow-inner space-y-4">
        <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">Fast Access Workflows</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {/* Action 1 */}
          <button
            type="button"
            onClick={() => onNavigate("exchange")}
            className="p-3 bg-white border border-slate-150 rounded-xl flex flex-col items-center justify-center text-center gap-2 hover:border-teal-500 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="p-2 bg-teal-50 border border-teal-100 text-teal-600 rounded-lg group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Search className="h-4.5 w-4.5" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">Browse Crops</span>
          </button>

          {/* Action 2 */}
          <button
            type="button"
            onClick={() => setActiveModal("create-rfq")}
            className="p-3 bg-white border border-slate-150 rounded-xl flex flex-col items-center justify-center text-center gap-2 hover:border-teal-500 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="p-2 bg-teal-50 border border-teal-100 text-teal-600 rounded-lg group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <PlusCircle className="h-4.5 w-4.5" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">Issue Spot RFQ</span>
          </button>

          {/* Action 3 */}
          <button
            type="button"
            onClick={() => onNavigate("procurement")}
            className="p-3 bg-white border border-slate-150 rounded-xl flex flex-col items-center justify-center text-center gap-2 hover:border-teal-500 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="p-2 bg-teal-50 border border-teal-100 text-teal-600 rounded-lg group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Tag className="h-4.5 w-4.5" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">Place Bid</span>
          </button>

          {/* Action 4 */}
          <button
            type="button"
            onClick={() => onNavigate("orders")}
            className="p-3 bg-white border border-slate-150 rounded-xl flex flex-col items-center justify-center text-center gap-2 hover:border-teal-500 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="p-2 bg-teal-50 border border-teal-100 text-teal-600 rounded-lg group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Eye className="h-4.5 w-4.5" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">View Orders</span>
          </button>

          {/* Action 5 */}
          <button
            type="button"
            onClick={() => setActiveModal("pickup")}
            className="p-3 bg-white border border-slate-150 rounded-xl flex flex-col items-center justify-center text-center gap-2 hover:border-teal-500 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="p-2 bg-teal-50 border border-teal-100 text-teal-600 rounded-lg group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Calendar className="h-4.5 w-4.5" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">Schedule Pickup</span>
          </button>

          {/* Action 6 */}
          <button
            type="button"
            onClick={() => setActiveModal("quality")}
            className="p-3 bg-white border border-slate-150 rounded-xl flex flex-col items-center justify-center text-center gap-2 hover:border-teal-500 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="p-2 bg-teal-50 border border-teal-100 text-teal-600 rounded-lg group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <FileCheck className="h-4.5 w-4.5" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">Request Quality</span>
          </button>
        </div>
      </div>

      {/* 2.2 Live Crop Feed Section */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6" id="live-crop-feed-section">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-100 pb-4 gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[9px] uppercase font-black">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              Live Auction Feed
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">🌾 Real-Time Graded Crop Listings</h2>
            <p className="text-xs text-slate-500">
              Browse authentic certified farmer lots. Place instant bids protected by secure escrow contracts.
            </p>
          </div>

          {/* Sort Menu Options */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
              <ArrowUpDown className="h-3 w-3" /> Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-[11px] font-black uppercase text-slate-700 focus:ring-1 focus:ring-teal-500"
            >
              <option value="newest">🕒 Newest Listings</option>
              <option value="price-asc">📈 Price: Low to High</option>
              <option value="price-desc">📉 Price: High to Low</option>
              <option value="quality">🌟 Quality: Highest Grade</option>
            </select>
          </div>
        </div>

        {/* Filters Dashboard Toolbar */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Filter 1: Crop Type */}
          <div className="space-y-1">
            <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider flex items-center gap-1">
              <Tag className="h-3 w-3 text-teal-600" /> Crop Class
            </label>
            <select
              value={filterCropType}
              onChange={(e) => setFilterCropType(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-2.5 text-xs text-slate-800 font-semibold"
            >
              <option value="All">🌾 All Crop Types</option>
              <option value="Rice">Rice</option>
              <option value="Wheat">Wheat</option>
              <option value="Apple">Apple</option>
              <option value="Corn">Corn</option>
              <option value="Soybean">Soybean</option>
              <option value="Cherry">Cherry</option>
            </select>
          </div>

          {/* Filter 2: Quality Grade */}
          <div className="space-y-1">
            <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider flex items-center gap-1">
              <Award className="h-3 w-3 text-teal-600" /> AI-Graded Level
            </label>
            <select
              value={filterQuality}
              onChange={(e) => setFilterQuality(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-2.5 text-xs text-slate-800 font-semibold"
            >
              <option value="All">🌟 All Grades</option>
              <option value="Premium">Premium</option>
              <option value="Grade A">Grade A</option>
              <option value="Grade B">Grade B</option>
              <option value="Grade C">Grade C</option>
            </select>
          </div>

          {/* Filter 3: Region / State */}
          <div className="space-y-1">
            <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider flex items-center gap-1">
              <MapPin className="h-3 w-3 text-teal-600" /> Region / State
            </label>
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-2.5 text-xs text-slate-800 font-semibold"
            >
              <option value="All">📍 All India Regions</option>
              <option value="Punjab">Punjab</option>
              <option value="Haryana">Haryana</option>
              <option value="Himachal Pradesh">Himachal Pradesh</option>
              <option value="Jammu & Kashmir">Jammu & Kashmir</option>
            </select>
          </div>

          {/* Filter 4: Price Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">
              <span className="flex items-center gap-1"><DollarSign className="h-3 w-3 text-teal-600" /> Max Price / Ton</span>
              <span className="text-teal-700 font-black font-mono">₹{filterMaxPrice.toLocaleString()}</span>
            </div>
            <div className="pt-2">
              <input
                type="range"
                min="15000"
                max="160000"
                step="5000"
                value={filterMaxPrice}
                onChange={(e) => setFilterMaxPrice(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[8px] text-slate-400 font-bold mt-1">
                <span>₹15k</span>
                <span>₹80k</span>
                <span>₹160k</span>
              </div>
            </div>
          </div>

          {/* Filter 5: Harvest Date Toggle */}
          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-2.5 cursor-pointer text-[10px] font-bold text-slate-700 shadow-3xs hover:bg-slate-100/50 transition-colors">
              <input
                type="checkbox"
                checked={filterRecentlyHarvested}
                onChange={(e) => setFilterRecentlyHarvested(e.target.checked)}
                className="accent-teal-600 h-4 w-4 rounded"
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-[10px]">Recent Harvest Only</span>
                <span className="text-[8px] text-slate-400 font-normal">Within last 10 days</span>
              </div>
            </label>
          </div>
        </div>

        {/* Live List Board Grid */}
        {filteredListings.length === 0 ? (
          <div className="p-12 border border-dashed border-slate-200 rounded-2xl text-center space-y-3">
            <AlertCircle className="h-8 w-8 text-slate-300 mx-auto" />
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">No Matching Crops Found</h4>
            <p className="text-[10px] text-slate-500 max-w-sm mx-auto">
              Try adjusting your region filters, expanding your price range slider, or toggling off the "Recent Harvest Only" parameter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="listings-grid">
            <AnimatePresence mode="popLayout">
              {filteredListings.map((l) => {
                // Quality theme configuration
                const getQualityTagColor = (grade: string) => {
                  if (grade === "Premium") return "bg-teal-50 border-teal-200 text-teal-700";
                  if (grade === "Grade A") return "bg-emerald-50 border-emerald-200 text-emerald-700";
                  if (grade === "Grade B") return "bg-blue-50 border-blue-200 text-blue-700";
                  return "bg-slate-50 border-slate-200 text-slate-700";
                };

                const daysAgo = getDaysSinceHarvest(l.harvestDate);

                return (
                  <motion.div
                    key={l.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white border border-slate-150 rounded-2xl p-4 shadow-3xs hover:shadow-md hover:border-teal-300 transition-all relative flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2.5">
                      {/* Top Header Row of card */}
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-tight">LOT {l.id.toUpperCase()}</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[8px] font-black px-2 py-0.5 border rounded-full uppercase ${getQualityTagColor(l.qualityGrade)}`}>
                            {l.qualityGrade}
                          </span>
                          <span className="text-[8px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded uppercase font-black font-mono">
                            AI-Graded
                          </span>
                        </div>
                      </div>

                      {/* Crop info */}
                      <div>
                        <h4 className="text-xs font-black text-slate-800 leading-snug tracking-tight group-hover:text-teal-600">
                          {l.cropName}
                        </h4>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold mt-1">
                          <span className="text-slate-800">{l.farmerName}</span>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-0.5 text-slate-500 font-medium">
                            <MapPin className="h-3 w-3 shrink-0 text-slate-400" /> {l.location}
                          </span>
                        </div>
                      </div>

                      {/* Key specs grid */}
                      <div className="grid grid-cols-2 gap-2 bg-slate-50/50 p-2.5 border border-slate-100 rounded-xl text-center text-xs">
                        <div className="border-r border-slate-200/60">
                          <span className="text-[8px] uppercase text-slate-400 font-bold block">Qty Available</span>
                          <span className="font-bold text-slate-800 font-mono text-xs">{l.quantity} Tons</span>
                        </div>
                        <div>
                          <span className="text-[8px] uppercase text-slate-400 font-bold block">Harvest Age</span>
                          <span className="font-bold text-slate-800 font-mono text-xs">
                            {daysAgo === 0 ? "Harvested Today" : `${daysAgo} days ago`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Bid Area */}
                    <div className="border-t border-slate-100 pt-3.5 space-y-3">
                      <div className="flex justify-between items-end">
                        <div>
                          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Current High Bid</span>
                          <span className="text-base font-black text-teal-700 font-mono">₹{l.currentBidPrice.toLocaleString()} <span className="text-[8px] text-slate-400 font-normal">/ Ton</span></span>
                        </div>
                        
                        <div className="text-right">
                          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block flex items-center gap-0.5 justify-end">
                            <Clock className="h-2.5 w-2.5 text-amber-500" /> Time Left
                          </span>
                          <span className="text-[10px] font-mono font-black text-amber-600 block bg-amber-50 px-1.5 py-0.2 rounded mt-0.5 border border-amber-100">
                            {formatTimeLeft(l.timeLeft)}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenBidModal(l)}
                        disabled={l.timeLeft <= 0}
                        className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer ${
                          l.timeLeft <= 0
                            ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                            : "bg-slate-900 text-white border border-slate-900 hover:bg-slate-800 hover:scale-[1.01]"
                        }`}
                      >
                        Place Auction Bid <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Grid: Saved Partners & Current Bid Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Favorite Partners */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="h-4 w-4 text-rose-500" /> Saved Production Partners
            </h3>
            <span className="text-[10px] text-slate-400 font-bold">Quick Contact</span>
          </div>

          <div className="space-y-3">
            {favorites.map(partner => (
              <div key={partner.id} className="p-3 bg-slate-50 hover:bg-slate-100/75 border border-slate-150 rounded-xl flex items-center justify-between transition-colors">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-extrabold text-slate-800">{partner.name}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                    <span className="bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded text-indigo-600 uppercase font-black text-[8px]">{partner.type}</span>
                    <span>Spec: {partner.crop}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded text-amber-700 font-bold font-mono text-[10px]">
                  <Star className="h-3 w-3 fill-amber-500 stroke-amber-500 shrink-0" />
                  {partner.rating}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Marketplace Guidelines */}
        <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-bold text-teal-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Award className="h-4.5 w-4.5 text-teal-400" /> Procurement SLA Guidelines
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              AgriConnect enforces a strict 72-hour escrow guarantee. Upon accepting a farmer’s lot, funds are secured in the public escrow ledger. A verified laboratory technician audits the lot at dispatch, with payment released instantly on confirmation of grade delivery.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle className="h-4 w-4 text-teal-400 shrink-0" />
                <span className="text-slate-200">99.4% Dispute-Free Settlements</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle className="h-4 w-4 text-teal-400 shrink-0" />
                <span className="text-slate-200">Compulsory ISO-9001 Lab Certification</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate("traceability")}
            className="w-full mt-4 py-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 font-bold uppercase text-[10px] tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            Audit Live Supply Chain <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* WORKFLOW MODAL DIALOGS */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-150 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {activeModal === "orders" && <Eye className="h-5 w-5 text-teal-400" />}
                  {activeModal === "pickup" && <Calendar className="h-5 w-5 text-teal-400" />}
                  {activeModal === "quality" && <FileCheck className="h-5 w-5 text-teal-400" />}
                  {activeModal === "place-bid" && <TrendingUp className="h-5 w-5 text-teal-400" />}
                  <h3 className="font-bold text-sm uppercase tracking-wider">
                    {activeModal === "orders" && "Active Escrow Orders Log"}
                    {activeModal === "pickup" && "Schedule Logistic Pickup"}
                    {activeModal === "quality" && "Request Certified Quality Check"}
                    {activeModal === "place-bid" && "Submit Competitive Bid"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal(null);
                    setSelectedBidCrop(null);
                  }}
                  className="text-slate-400 hover:text-white font-extrabold text-sm font-mono cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5">
                {/* 1. VIEW ORDERS */}
                {activeModal === "orders" && (
                  <div className="space-y-4">
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Below are your current procurement lots secured in the escrow bank ledger, awaiting logistical pickup or quality assessment.
                    </p>

                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {orders.map(order => (
                        <div key={order.id} className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] font-bold text-slate-400">{order.id}</span>
                            <span className="text-[9px] bg-teal-50 border border-teal-200 text-teal-700 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {order.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 text-xs">
                            <div>
                              <p className="text-[9px] font-bold text-slate-400 uppercase">Seller Partner</p>
                              <p className="font-bold text-slate-800">{order.seller}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] font-bold text-slate-400 uppercase">Crop Spec</p>
                              <p className="font-bold text-slate-800">{order.crop} ({order.qty})</p>
                            </div>
                          </div>

                          <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
                            <span>Contract Date: {order.date}</span>
                            <span className="font-bold text-slate-800">Escrow Value: {order.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer mt-2"
                    >
                      Acknowledge Ledger Log
                    </button>
                  </div>
                )}

                {/* 2. SCHEDULE PICKUP */}
                {activeModal === "pickup" && (
                  <div className="space-y-4">
                    {pickupSuccess ? (
                      <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-center space-y-2">
                        <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto" />
                        <h4 className="font-black text-xs uppercase tracking-wider">Logistics Arranged</h4>
                        <p className="text-[10px] leading-relaxed">
                          Your pickup request has been scheduled. The designated driver details and GPS link have been broadcast to the cooperative partner.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSchedulePickup} className="space-y-4">
                        <p className="text-[11px] text-slate-500">
                          Schedule a transport vehicle to collect your verified crops. The logistics service coordinates directly with the farmer cooperative's dispatch bay.
                        </p>

                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold uppercase text-slate-500">Destination Warehouse Location</label>
                          <input
                            type="text"
                            required
                            value={pickupLocation}
                            onChange={(e) => setPickupLocation(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 font-medium"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-extrabold uppercase text-slate-500">Target Pickup Date</label>
                            <input
                              type="date"
                              required
                              value={pickupDate}
                              onChange={(e) => setPickupDate(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 font-medium"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-extrabold uppercase text-slate-500">Transport Fleet Class</label>
                            <select
                              value={pickupVehicle}
                              onChange={(e) => setPickupVehicle(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 font-medium"
                            >
                              <option value="10-Ton Container Truck">10-Ton Container Truck</option>
                              <option value="25-Ton Flatbed Carrier">25-Ton Flatbed Carrier</option>
                              <option value="Temperature Controlled Cold-Chain">Cold-Chain Truck</option>
                            </select>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer"
                        >
                          Book Logistic Pickup Dispatch
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* 3. REQUEST QUALITY CHECK */}
                {activeModal === "quality" && (
                  <div className="space-y-4">
                    {qualitySuccess ? (
                      <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-center space-y-2">
                        <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto" />
                        <h4 className="font-black text-xs uppercase tracking-wider">Quality Ticket Opened</h4>
                        <p className="text-[10px] leading-relaxed">
                          A laboratory technician has been assigned to audit the lot. You will receive the moisture, grain size, and chemical purity reports upon inspection completion.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleRequestQualityCheck} className="space-y-4">
                        <p className="text-[11px] text-slate-500">
                          Deploy an on-site technician or laboratory examiner to audit moisture levels, chemical residue thresholds, and average grain size prior to bulk packing.
                        </p>

                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold uppercase text-slate-500">Selected Crop Variety</label>
                          <select
                            value={qualityCrop}
                            onChange={(e) => setQualityCrop(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 font-medium"
                          >
                            <option value="Premium Basmati Rice">Premium Basmati Rice</option>
                            <option value="Non-GMO Corn / Maize">Non-GMO Corn / Maize</option>
                            <option value="Soft Red Winter Wheat">Soft Red Winter Wheat</option>
                            <option value="Organic Soybean Seed">Organic Soybean Seed</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-extrabold uppercase text-slate-500">Batch Lot ID</label>
                            <input
                              type="text"
                              required
                              value={qualityLot}
                              onChange={(e) => setQualityLot(e.target.value.toUpperCase())}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 font-mono font-bold"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-extrabold uppercase text-slate-500">Accredited Lab Partner</label>
                            <select
                              value={qualityLab}
                              onChange={(e) => setQualityLab(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 font-medium"
                            >
                              <option value="Agri-Tech Government Certified Labs">Agri-Tech Labs (Govt)</option>
                              <option value="SGS Global Quality Audits Ltd">SGS Global Audits</option>
                              <option value="Eco-Cert Organic Integrity Agency">Eco-Cert Organic</option>
                            </select>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer"
                        >
                          Dispatch Laboratory Technician Ticket
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* 4. PLACE AUCTION BID (INTERACTIVE CO-PILOT WORKFLOW) */}
                {activeModal === "place-bid" && selectedBidCrop && (
                  <div className="space-y-4">
                    {bidSuccess ? (
                      <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-center space-y-2">
                        <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto" />
                        <h4 className="font-black text-xs uppercase tracking-wider">Bid Submitted Successfully</h4>
                        <p className="text-[10px] leading-relaxed">
                          Your corporate bid has been locked onto the escrow contract channel. You are now the leading bidder for Lot {selectedBidCrop.id.toUpperCase()}.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handlePlaceBidSubmit} className="space-y-4">
                        <div className="bg-slate-50 p-3 border border-slate-150 rounded-xl space-y-2">
                          <h4 className="text-xs font-black text-slate-800">{selectedBidCrop.cropName}</h4>
                          <div className="grid grid-cols-2 text-[10px] text-slate-500 font-semibold gap-2">
                            <div>
                              <span>Farmer: {selectedBidCrop.farmerName}</span>
                            </div>
                            <div className="text-right">
                              <span>Volume: {selectedBidCrop.quantity} Tons</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-teal-50/50 border border-teal-150 rounded-xl flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-600">Current Leader Bid Rate:</span>
                          <span className="font-black text-teal-700 text-sm font-mono">₹{selectedBidCrop.currentBidPrice.toLocaleString()} / Ton</span>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Enter Your Premium Corporate Bid (₹ / Ton)</label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-2.5 font-mono text-slate-400 font-extrabold text-xs">₹</span>
                            <input
                              type="number"
                              required
                              min={selectedBidCrop.currentBidPrice + 1}
                              value={customBidAmount}
                              onChange={(e) => {
                                setCustomBidAmount(e.target.value);
                                setBidError("");
                              }}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-8 pr-16 text-xs text-slate-800 font-mono font-black"
                            />
                            <span className="absolute right-3 top-2.5 text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">INR / TON</span>
                          </div>
                          {bidError && <p className="text-red-500 text-[9px] font-bold mt-1">{bidError}</p>}
                        </div>

                        <div className="bg-slate-50 border border-slate-200 p-2.5 rounded text-[8px] text-slate-500 flex items-center gap-1 leading-relaxed">
                          <Shield className="h-4.5 w-4.5 text-teal-600 shrink-0" />
                          Placing this bid temporarily pledges escrow deposit capacity of ₹{(parseInt(customBidAmount) || 0) * selectedBidCrop.quantity} from your corporate margin.
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer"
                        >
                          Confirm & Lodge Official Bid
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* 5. CREATE B2B SPOT RFQ / PURCHASE INTENT MODAL */}
                {activeModal === "create-rfq" && (
                  <div className="space-y-4">
                    {rfqSuccess ? (
                      <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-center space-y-2">
                        <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto" />
                        <h4 className="font-black text-xs uppercase tracking-wider">Spot RFQ Broadcasted to Farmers</h4>
                        <p className="text-[10px] leading-relaxed">
                          Your Request for Quotation for {rfqQuantity} MT of {rfqCrop} ({rfqGrade}) at target rate ₹{Number(rfqTargetPrice).toLocaleString()}/MT has been posted to certified farmer cooperatives.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleCreateRfqSubmit} className="space-y-3">
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                          Issue a formal B2B Request for Quotation (RFQ). Local farming cooperatives with matching inventory will be notified to submit direct counter-bids.
                        </p>

                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold uppercase text-slate-500">Target Crop Commodity</label>
                          <select
                            value={rfqCrop}
                            onChange={(e) => setRfqCrop(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 font-medium"
                          >
                            <option value="Premium Basmati Rice">Premium Basmati Rice (Pusa-1121)</option>
                            <option value="Soft Red Winter Wheat">Soft Red Winter Wheat (HD-2967)</option>
                            <option value="Non-GMO Feed Corn">Non-GMO Feed Corn / Yellow Dent</option>
                            <option value="Organic Soybean Seed">Organic Soybean Seed</option>
                            <option value="Golden Delicious Apples">Golden Delicious Apples</option>
                            <option value="Premium Long-Staple Cotton">Premium Long-Staple Cotton</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-extrabold uppercase text-slate-500">Quality Spec</label>
                            <select
                              value={rfqGrade}
                              onChange={(e) => setRfqGrade(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 font-medium"
                            >
                              <option value="Grade A">Grade A (Export Specification)</option>
                              <option value="Premium">Premium Grade</option>
                              <option value="Grade B">Grade B (Standard Milling)</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-extrabold uppercase text-slate-500">Volume (Metric Tons)</label>
                            <input
                              type="number"
                              required
                              min="1"
                              value={rfqQuantity}
                              onChange={(e) => setRfqQuantity(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 font-mono font-bold"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-extrabold uppercase text-slate-500">Target Price (₹ / Ton)</label>
                            <input
                              type="number"
                              required
                              min="1000"
                              value={rfqTargetPrice}
                              onChange={(e) => setRfqTargetPrice(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 font-mono font-bold"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-extrabold uppercase text-slate-500">Required Delivery Date</label>
                            <input
                              type="date"
                              required
                              value={rfqDeliveryDate}
                              onChange={(e) => setRfqDeliveryDate(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 font-medium"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold uppercase text-slate-500">Delivery Warehouse / Terminal</label>
                          <input
                            type="text"
                            required
                            value={rfqLocation}
                            onChange={(e) => setRfqLocation(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 font-medium"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer shadow-sm mt-2"
                        >
                          Broadcast Spot RFQ to Farm Network
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
