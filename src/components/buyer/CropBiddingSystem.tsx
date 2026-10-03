import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Grid,
  List,
  Search,
  Filter,
  SlidersHorizontal,
  Clock,
  User,
  MapPin,
  CheckCircle,
  TrendingUp,
  Tag,
  ArrowUpDown,
  ChevronRight,
  Info,
  DollarSign,
  Briefcase,
  Layers,
  Heart,
  Calendar,
  Sparkles,
  Award,
  Eye,
  EyeOff,
  Bell,
  BellRing,
  ArrowRight,
  ChevronDown,
  Star,
  Package,
  FileText,
  RotateCw,
  Plus,
  Minus,
  Check,
  AlertTriangle,
  Flame,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { defaultListings } from "../../data/defaultListings";

interface CropBiddingSystemProps {
  bids: any[];
  onAddBid?: (newBid: any) => void;
  listings?: CropListingItem[];
  setListings?: React.Dispatch<React.SetStateAction<CropListingItem[]>>;
  watchedLots?: string[];
  setWatchedLots?: React.Dispatch<React.SetStateAction<string[]>>;
  autoBidLimits?: Record<string, number>;
  setAutoBidLimits?: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  notifications?: NotificationAlert[];
  setNotifications?: React.Dispatch<React.SetStateAction<NotificationAlert[]>>;
}

export interface CropListingItem {
  id: string;
  cropName: string;
  variety: string;
  farmerName: string;
  location: string;
  region: string;
  cropType: string;
  quantity: number; // in tons
  minOrderQty: number; // MOQ (tons)
  packagingType: string; // packaging type
  packagingSize: string; // packaging size (e.g. 50 kg jute bags)
  farmerRating: number; // farmer rating
  farmerTotalCropsSold: number; // total tons sold
  qualityGrade: "Premium" | "Grade A" | "Grade B" | "Grade C";
  startingBid: number;
  currentHighestBid: number;
  bidCount: number;
  timeLeft: number; // remaining seconds
  image: string; // primary image
  images: string[]; // gallery images
  harvestDate: string;
  moisture: string;
  purity: string;
  organic: boolean;
  bidsHistory: { company: string; amount: number; time: string }[];
}

interface NotificationAlert {
  id: string;
  message: string;
  time: string;
  type: "info" | "success" | "warning" | "bid";
  lotId?: string;
}

export default function CropBiddingSystem({
  bids,
  onAddBid,
  listings: propListings,
  setListings: propSetListings,
  watchedLots: propWatchedLots,
  setWatchedLots: propSetWatchedLots,
  autoBidLimits: propAutoBidLimits,
  setAutoBidLimits: propSetAutoBidLimits,
  notifications: propNotifications,
  setNotifications: propSetNotifications
}: CropBiddingSystemProps) {
  // Grid/List views
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCropType, setSelectedCropType] = useState("All");
  const [selectedQuality, setSelectedQuality] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [maxPrice, setMaxPrice] = useState(150000);
  const [sortBy, setSortBy] = useState("newest");

  // Global Watchlist and Auto-bidding limits
  const [localWatchedLots, setLocalWatchedLots] = useState<string[]>(["LOT-9102", "LOT-5123"]);
  const watchedLots = propWatchedLots || localWatchedLots;
  const setWatchedLots = propSetWatchedLots || setLocalWatchedLots;

  const [localAutoBidLimits, setLocalAutoBidLimits] = useState<Record<string, number>>({
    "LOT-9102": 75000
  });
  const autoBidLimits = propAutoBidLimits || localAutoBidLimits;
  const setAutoBidLimits = propSetAutoBidLimits || setLocalAutoBidLimits;

  // Dynamic Live Alerts
  const [localNotifications, setLocalNotifications] = useState<NotificationAlert[]>([
    {
      id: "notif-1",
      message: "Welcome to the Live Escrow Auction Room. Track lots using the Watch feature.",
      time: "Just now",
      type: "info"
    },
    {
      id: "notif-2",
      message: "Smart Auto-Bid active for Premium Basmati Rice (LOT-9102) up to ₹75,000.",
      time: "2 mins ago",
      type: "success",
      lotId: "LOT-9102"
    }
  ]);
  const notifications = propNotifications || localNotifications;
  const setNotifications = propSetNotifications || setLocalNotifications;

  // Main Listings state containing all enhanced crop items
  const [localListings, setLocalListings] = useState<CropListingItem[]>(defaultListings);
  const listings = propListings || localListings;
  const setListings = propSetListings || setLocalListings;

  // View Details Modal States
  const [selectedLot, setSelectedLot] = useState<CropListingItem | null>(null);
  const [newBidAmount, setNewBidAmount] = useState("");
  const [isAutoBidEnabled, setIsAutoBidEnabled] = useState(false);
  const [maxAutoBidAmount, setMaxAutoBidAmount] = useState("");
  const [bidError, setBidError] = useState("");
  const [bidSuccess, setBidSuccess] = useState(false);

  // AI Bidding suggestion states
  const [aiSuggestion, setAiSuggestion] = useState<{
    fairMarketValue: number;
    optimalInitialBid: number;
    suggestedMaxAutoBid: number;
    marketTrend: "Upward" | "Stable" | "Downward";
    reasoning: string;
  } | null>(null);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);

  const fetchBidSuggestion = useCallback(async (lot: CropListingItem) => {
    setIsLoadingSuggestion(true);
    try {
      const response = await fetch("/api/suggest-bid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropName: lot.cropName,
          variety: lot.variety,
          qualityGrade: lot.qualityGrade,
          startingBid: lot.startingBid,
          currentHighestBid: lot.currentHighestBid,
          organic: lot.organic,
          quantity: lot.quantity,
          location: lot.location
        })
      });
      const data = await response.json();
      setAiSuggestion(data);
    } catch (error) {
      console.error("Failed to fetch bidding suggestions:", error);
    } finally {
      setIsLoadingSuggestion(false);
    }
  }, []);

  // Gallery interactive states
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeMediaTab, setActiveMediaTab] = useState<"photos" | "360">("photos");
  const [rotationDeg, setRotationDeg] = useState(180);

  // Helper helper to add alert logs
  const addNotification = (message: string, type: "info" | "success" | "warning" | "bid", lotId?: string) => {
    const newNotif: NotificationAlert = {
      id: `notif-${Date.now()}`,
      message,
      time: "Just now",
      type,
      lotId
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 8)]);
  };

  // Watchlist Toggle
  const handleToggleWatch = (lotId: string) => {
    setWatchedLots((prev) => {
      const isWatched = prev.includes(lotId);
      if (isWatched) {
        addNotification(`Removed ${lotId} from your watch subscription list.`, "info", lotId);
        return prev.filter((id) => id !== lotId);
      } else {
        addNotification(`🔔 Subscribed to bid changes and notifications for ${lotId}.`, "success", lotId);
        return [...prev, lotId];
      }
    });
  };

  // 1. Live Countdown Loop
  // 2. Automated competing bidder simulation to showcase auto-bidding & watchlists live!
  useEffect(() => {
    if (propListings) return;
    const timer = setInterval(() => {
      setListings((prevListings) =>
        prevListings.map((item) => {
          if (item.timeLeft > 0) {
            return { ...item, timeLeft: item.timeLeft - 1 };
          }
          return item;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [propListings]);

  // Simulates live competing bids every 14 seconds on a random lot
  useEffect(() => {
    if (propListings) return;
    const rivalBidder = setInterval(() => {
      // Choose a random lot
      const randomLotIndex = Math.floor(Math.random() * listings.length);
      const targetLot = listings[randomLotIndex];

      if (targetLot.timeLeft <= 0) return;

      const bidIncrease = Math.floor(Math.random() * 3 + 1) * 500; // ₹500, ₹1000, ₹1500
      const rivalBidAmount = targetLot.currentHighestBid + bidIncrease;

      // Competing company pool
      const companies = ["Cargill India", "ITC Food Division", "Adani Wilmar", "TATA Foods", "Indus Milling Group"];
      const competingCompany = companies[Math.floor(Math.random() * companies.length)];

      // Check if user has active auto-bid limit
      const userMaxLimit = autoBidLimits[targetLot.id];

      setListings((prevListings) => {
        return prevListings.map((item) => {
          if (item.id !== targetLot.id) return item;

          let updatedHighestBid = rivalBidAmount;
          let updatedCount = item.bidCount + 1;
          let history = [...item.bidsHistory];

          // Push the competitor's bid
          history.unshift({
            company: competingCompany,
            amount: rivalBidAmount,
            time: "Just now"
          });

          // Watchlist notification check
          if (watchedLots.includes(item.id)) {
            addNotification(
              `📈 Competing Bid placed: ${competingCompany} bid ₹${rivalBidAmount.toLocaleString()} on Watched lot ${item.id}`,
              "bid",
              item.id
            );
          }

          // Trigger Auto-Bid Evaluation!
          if (userMaxLimit && userMaxLimit > rivalBidAmount) {
            const userAutoCounterAmount = rivalBidAmount + 500;
            if (userAutoCounterAmount <= userMaxLimit) {
              updatedHighestBid = userAutoCounterAmount;
              updatedCount += 1;
              history.unshift({
                company: "Global Agrifood Corp (Your Auto-Bid)",
                amount: userAutoCounterAmount,
                time: "Just now"
              });

              addNotification(
                `🤖 Smart Auto-Bid Countered: Your agent bid ₹${userAutoCounterAmount.toLocaleString()} on ${item.id} to stay ahead.`,
                "success",
                item.id
              );
            }
          } else if (userMaxLimit && userMaxLimit <= rivalBidAmount) {
            // Outbid on auto-bid limit
            addNotification(
              `⚠️ Outbid limit exceeded: Competing bid of ₹${rivalBidAmount.toLocaleString()} exceeded your Auto-Bid cap on ${item.id}.`,
              "warning",
              item.id
            );
            // disable the auto-bid
            setAutoBidLimits((prev) => {
              const copy = { ...prev };
              delete copy[item.id];
              return copy;
            });
          }

          const updatedLot: CropListingItem = {
            ...item,
            currentHighestBid: updatedHighestBid,
            bidCount: updatedCount,
            bidsHistory: history
          };

          // If this lot is currently open in modal, update it dynamically too!
          if (selectedLot && selectedLot.id === item.id) {
            setSelectedLot(updatedLot);
            // Also suggest a bid slightly higher than new price
            setNewBidAmount((updatedHighestBid + 1000).toString());
            fetchBidSuggestion(updatedLot);
          }

          return updatedLot;
        });
      });
    }, 14000);

    return () => clearInterval(rivalBidder);
  }, [listings, autoBidLimits, watchedLots, selectedLot, propListings, fetchBidSuggestion]);

  const formatTimer = (sec: number) => {
    if (sec <= 0) return "Auction Finished";
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h}h ${m}m ${s}s`;
  };

  // Filter & Sort computation
  const filteredListings = useMemo(() => {
    return listings
      .filter((l) => {
        const matchesSearch =
          l.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.farmerName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedCropType === "All" || l.cropType === selectedCropType;
        const matchesQuality = selectedQuality === "All" || l.qualityGrade === selectedQuality;
        const matchesRegion = selectedRegion === "All" || l.region === selectedRegion;
        const matchesPrice = l.currentHighestBid <= maxPrice;

        return matchesSearch && matchesType && matchesQuality && matchesRegion && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.currentHighestBid - b.currentHighestBid;
        if (sortBy === "price-desc") return b.currentHighestBid - a.currentHighestBid;
        if (sortBy === "bids") return b.bidCount - a.bidCount;
        if (sortBy === "time") return a.timeLeft - b.timeLeft;
        if (sortBy === "newest") return new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime();
        return 0;
      });
  }, [listings, searchQuery, selectedCropType, selectedQuality, selectedRegion, maxPrice, sortBy]);

  // Opening details modal
  const handleOpenDetails = (lot: CropListingItem) => {
    setSelectedLot(lot);
    setActiveImageIndex(0);
    setActiveMediaTab("photos");
    setRotationDeg(180);
    setNewBidAmount((lot.currentHighestBid + 1000).toString());
    setBidError("");
    setBidSuccess(false);
    setAiSuggestion(null);
    fetchBidSuggestion(lot);

    // Read previous auto-bid limits if active
    if (autoBidLimits[lot.id]) {
      setIsAutoBidEnabled(true);
      setMaxAutoBidAmount(autoBidLimits[lot.id].toString());
    } else {
      setIsAutoBidEnabled(false);
      setMaxAutoBidAmount("");
    }
  };

  // Placing standard or auto bids
  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLot) return;

    const bidAmt = parseInt(newBidAmount);
    if (isNaN(bidAmt)) {
      setBidError("Please specify a numeric value.");
      return;
    }

    if (bidAmt <= selectedLot.currentHighestBid) {
      setBidError(`Bid must be greater than current highest: ₹${selectedLot.currentHighestBid.toLocaleString()}`);
      return;
    }

    // Process Auto-Bid limit setting
    if (isAutoBidEnabled) {
      const maxLimit = parseInt(maxAutoBidAmount);
      if (isNaN(maxLimit) || maxLimit <= bidAmt) {
        setBidError("Auto-bid max limit must exceed your initial bid amount.");
        return;
      }
      setAutoBidLimits((prev) => ({
        ...prev,
        [selectedLot.id]: maxLimit
      }));
      addNotification(`🤖 Configured smart auto-bidding agent on ${selectedLot.id} up to ₹${maxLimit.toLocaleString()}.`, "success", selectedLot.id);
    } else {
      // Remove auto-bid limit if disabled
      setAutoBidLimits((prev) => {
        const copy = { ...prev };
        delete copy[selectedLot.id];
        return copy;
      });
    }

    // Place the bid
    const updatedHistory = [
      { company: "Global Agrifood Corp (You)", amount: bidAmt, time: "Just now" },
      ...selectedLot.bidsHistory
    ];

    setListings((prev) =>
      prev.map((item) =>
        item.id === selectedLot.id
          ? {
              ...item,
              currentHighestBid: bidAmt,
              bidCount: item.bidCount + 1,
              bidsHistory: updatedHistory
            }
          : item
      )
    );

    setSelectedLot((prev) =>
      prev
        ? {
            ...prev,
            currentHighestBid: bidAmt,
            bidCount: prev.bidCount + 1,
            bidsHistory: updatedHistory
          }
        : null
    );

    // Call parent handler
    if (onAddBid) {
      onAddBid({
        id: `bid-${Date.now()}`,
        cropType: selectedLot.cropType,
        quantity: selectedLot.quantity,
        quality: selectedLot.qualityGrade,
        pricePerTon: bidAmt,
        buyerName: "Global Agrifood Corp",
        status: "Active",
        date: new Date().toLocaleDateString()
      });
    }

    setBidSuccess(true);
    addNotification(`🎉 Successful Bid Placed! You are currently the highest bidder on ${selectedLot.id} with ₹${bidAmt.toLocaleString()}`, "success", selectedLot.id);
    setTimeout(() => {
      setBidSuccess(false);
    }, 2500);
  };

  const incrementBid = (val: number) => {
    const cur = parseInt(newBidAmount) || selectedLot?.currentHighestBid || 0;
    setNewBidAmount((cur + val).toString());
  };

  return (
    <div className="space-y-6" id="crop-bidding-marketplace">
      {/* Dynamic Alerts Banner - live activity indicator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-md text-white overflow-hidden relative">
        <div className="absolute right-3 top-3 animate-pulse flex items-center gap-1 bg-teal-500/10 border border-teal-500/20 text-teal-400 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase">
          <Activity className="h-3 w-3" /> Live Auction feed
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-500/15 border border-teal-500/30 rounded-xl">
            <Flame className="h-4.5 w-4.5 text-teal-400" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-slate-200">Interactive Trading Ledger active</p>
            <div className="h-5 overflow-hidden relative">
              <AnimatePresence mode="wait">
                {notifications.length > 0 && (
                  <motion.div
                    key={notifications[0].id}
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-0.5"
                  >
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-teal-500" />
                    <span>{notifications[0].message}</span>
                    <span className="text-[9px] text-slate-600 font-mono">({notifications[0].time})</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Search and view toggle panel */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-3xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Left: Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search crop variety, farmer name, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all"
          />
        </div>

        {/* Right: Layout Toggle & Sorting options */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-black uppercase text-slate-400">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-[11px] font-black uppercase text-slate-700 focus:outline-hidden"
            >
              <option value="newest">🕒 Newest Harvest</option>
              <option value="price-asc">📈 Price: Low to High</option>
              <option value="price-desc">📉 Price: High to Low</option>
              <option value="bids">🔥 Most Bids</option>
              <option value="time">⌛ Ending Soonest</option>
            </select>
          </div>

          <div className="border-l border-slate-200 h-6 mx-1" />

          {/* List/Grid View Toggle controls */}
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "grid" ? "bg-white text-teal-600 shadow-3xs" : "text-slate-400 hover:text-slate-700"
              }`}
              title="Grid View"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "list" ? "bg-white text-teal-600 shadow-3xs" : "text-slate-400 hover:text-slate-700"
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid with Filters Sidebar and Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-2xl p-5 shadow-3xs space-y-5 h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="h-4 w-4 text-teal-600" /> Filter Catalog
            </h3>
            {searchQuery || selectedCropType !== "All" || selectedQuality !== "All" || selectedRegion !== "All" ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCropType("All");
                  setSelectedQuality("All");
                  setSelectedRegion("All");
                  setMaxPrice(150000);
                }}
                className="text-[9px] text-teal-600 hover:text-teal-700 font-black uppercase cursor-pointer"
              >
                Reset
              </button>
            ) : null}
          </div>

          {/* Filter 1: Crop Type */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Crop Variety Type</label>
            <select
              value={selectedCropType}
              onChange={(e) => setSelectedCropType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-semibold focus:outline-hidden"
            >
              <option value="All">🌾 All Varieties</option>
              <option value="Rice">Rice</option>
              <option value="Wheat">Wheat</option>
              <option value="Soybean">Soybean</option>
              <option value="Corn">Corn</option>
              <option value="Apple">Apple</option>
              <option value="Chickpeas">Chickpeas</option>
            </select>
          </div>

          {/* Filter 2: Quality Grade Badge */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Quality Grade</label>
            <div className="grid grid-cols-2 gap-2">
              {["All", "Premium", "Grade A", "Grade B"].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setSelectedQuality(g)}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all text-center cursor-pointer ${
                    selectedQuality === g
                      ? "bg-teal-600 text-white border-teal-600 shadow-3xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {g === "All" ? "All Grades" : g}
                </button>
              ))}
            </div>
          </div>

          {/* Filter 3: Region State */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">State Region</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-semibold focus:outline-hidden"
            >
              <option value="All">📍 All India Regions</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Haryana">Haryana</option>
              <option value="Himachal Pradesh">Himachal Pradesh</option>
            </select>
          </div>

          {/* Filter 4: Price Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-extrabold uppercase text-slate-400">
              <span>Max Price Per Ton</span>
              <span className="text-teal-700 font-black font-mono">₹{maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="20000"
              max="150000"
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-150 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
            <div className="flex justify-between text-[8px] text-slate-400 font-bold">
              <span>₹20,000</span>
              <span>₹1,50,000</span>
            </div>
          </div>
        </div>

        {/* Right Listings Display area */}
        <div className="lg:col-span-9 space-y-4">
          {filteredListings.length === 0 ? (
            <div className="p-16 bg-white border border-slate-100 rounded-2xl text-center space-y-3">
              <Tag className="h-10 w-10 text-slate-200 mx-auto" />
              <h4 className="text-sm font-black uppercase text-slate-700">No Bidding Lots Match Filters</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No lots match your current search queries or filters. Try raising your price slider threshold or clearing active category filters.
              </p>
            </div>
          ) : viewMode === "grid" ? (
            /* --- GRID VIEW --- */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="bidding-grid">
              <AnimatePresence mode="popLayout">
                {filteredListings.map((lot) => {
                  const getGradeBadge = (g: string) => {
                    if (g === "Premium") return "bg-teal-50 border-teal-200 text-teal-700";
                    if (g === "Grade A") return "bg-emerald-50 border-emerald-200 text-emerald-700";
                    if (g === "Grade B") return "bg-blue-50 border-blue-200 text-blue-700";
                    return "bg-slate-50 border-slate-200 text-slate-700";
                  };

                  const isWatched = watchedLots.includes(lot.id);
                  const isAutoBidOn = !!autoBidLimits[lot.id];

                  return (
                    <motion.div
                      key={lot.id}
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-3xs hover:shadow-xs hover:border-teal-400 transition-all flex flex-col justify-between"
                    >
                      {/* Crop Image thumbnail with organic badge overlay */}
                      <div className="relative h-40 bg-slate-100 overflow-hidden shrink-0">
                        <img
                          src={lot.image}
                          alt={lot.cropName}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                          <span className={`text-[8px] font-black px-2 py-0.5 border rounded-full uppercase shadow-2xs ${getGradeBadge(lot.qualityGrade)}`}>
                            {lot.qualityGrade} Grade
                          </span>
                          {lot.organic && (
                            <span className="text-[8px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-wider shadow-2xs">
                              100% Organic
                            </span>
                          )}
                        </div>

                        {/* Watch & Auto Bid overlay markers */}
                        <div className="absolute top-2.5 right-2.5 flex gap-1">
                          {isWatched && (
                            <div className="bg-amber-500 text-white p-1 rounded-lg shadow-2xs" title="Subscribed to Bid Alerts">
                              <Bell className="h-3 w-3 fill-white" />
                            </div>
                          )}
                          {isAutoBidOn && (
                            <div className="bg-teal-500 text-slate-950 px-1.5 py-0.5 text-[8px] font-black uppercase rounded-md shadow-2xs flex items-center gap-0.5">
                              <span>Auto-Bid</span>
                            </div>
                          )}
                        </div>

                        <div className="absolute bottom-2 right-2 bg-slate-900/85 backdrop-blur-xs text-white text-[9px] font-mono font-black px-2 py-0.5 rounded flex items-center gap-1 border border-slate-700">
                          <Clock className="h-3 w-3 text-amber-400" />
                          {formatTimer(lot.timeLeft)}
                        </div>
                      </div>

                      {/* Content Card Body */}
                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-mono font-bold text-slate-400">{lot.id}</span>
                            <span className="text-[9px] bg-slate-50 text-slate-500 font-bold px-1.5 py-0.2 rounded border border-slate-200">{lot.cropType}</span>
                          </div>
                          <h4 className="text-xs font-black text-slate-950 leading-snug tracking-tight">
                            {lot.cropName}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-bold">{lot.variety}</p>

                          {/* Farmer meta */}
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-medium pt-1">
                            <User className="h-3.5 w-3.5 text-slate-400" />
                            <span className="font-bold">{lot.farmerName}</span>
                            <span className="text-amber-500 font-black flex items-center gap-0.5 ml-auto text-[9px]">
                              ★{lot.farmerRating}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            <span className="truncate">{lot.location}</span>
                          </div>
                        </div>

                        {/* Specs overview */}
                        <div className="grid grid-cols-2 gap-1.5 bg-slate-50 border border-slate-100 rounded-xl p-2 text-center text-[11px] font-medium">
                          <div className="border-r border-slate-200">
                            <span className="text-[8px] uppercase text-slate-400 block font-black">Qty Available</span>
                            <span className="font-bold text-slate-800 font-mono text-xs">{lot.quantity} Tons</span>
                          </div>
                          <div>
                            <span className="text-[8px] uppercase text-slate-400 block font-black">Min Order (MOQ)</span>
                            <span className="font-bold text-slate-700 font-mono text-xs">{lot.minOrderQty} Tons</span>
                          </div>
                        </div>

                        {/* Pricing details */}
                        <div className="border-t border-slate-100 pt-2.5 flex justify-between items-end">
                          <div>
                            <span className="text-[8px] text-slate-400 font-bold uppercase block">Starting Bid</span>
                            <span className="text-[10px] font-bold text-slate-500 font-mono">₹{lot.startingBid.toLocaleString()}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[8px] text-teal-600 font-black uppercase block">Highest Bid</span>
                            <span className="text-sm font-black text-teal-700 font-mono">₹{lot.currentHighestBid.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Card CTA Block */}
                        <div className="grid grid-cols-4 gap-1.5 pt-1.5">
                          <button
                            type="button"
                            onClick={() => handleToggleWatch(lot.id)}
                            className={`py-2 border rounded-xl flex items-center justify-center cursor-pointer transition-all ${
                              isWatched
                                ? "bg-amber-50 border-amber-300 text-amber-600"
                                : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700"
                            }`}
                            title={isWatched ? "Unsubscribe lot" : "Watch lot changes"}
                          >
                            <Bell className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenDetails(lot)}
                            className="col-span-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            Enter Auction Room <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            /* --- LIST VIEW --- */
            <div className="space-y-3" id="bidding-list">
              <AnimatePresence mode="popLayout">
                {filteredListings.map((lot) => {
                  const getGradeBadge = (g: string) => {
                    if (g === "Premium") return "bg-teal-50 border-teal-200 text-teal-700";
                    if (g === "Grade A") return "bg-emerald-50 border-emerald-200 text-emerald-700";
                    if (g === "Grade B") return "bg-blue-50 border-blue-200 text-blue-700";
                    return "bg-slate-50 border-slate-200 text-slate-700";
                  };

                  const isWatched = watchedLots.includes(lot.id);
                  const isAutoBidOn = !!autoBidLimits[lot.id];

                  return (
                    <motion.div
                      key={lot.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="bg-white border border-slate-150 rounded-2xl p-4 shadow-3xs hover:shadow-xs hover:border-teal-300 transition-all flex flex-col md:flex-row gap-4 items-center justify-between"
                    >
                      {/* Left: Thumbnail & primary info */}
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative w-18 h-18 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                          <img
                            src={lot.image}
                            alt={lot.cropName}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[9px] font-mono font-bold text-slate-400">{lot.id}</span>
                            <span className={`text-[8px] font-black px-1.5 py-0.2 border rounded-full uppercase ${getGradeBadge(lot.qualityGrade)}`}>
                              {lot.qualityGrade} Grade
                            </span>
                            {isWatched && <span className="text-[8px] bg-amber-500 text-white font-black px-1 rounded">WATCHED</span>}
                            {isAutoBidOn && <span className="text-[8px] bg-teal-500 text-slate-950 font-black px-1 rounded">AUTO-BID ACTIVE</span>}
                          </div>
                          <h4 className="text-xs font-black text-slate-950 leading-tight">
                            {lot.cropName} <span className="text-[10px] text-slate-400 font-bold">({lot.variety})</span>
                          </h4>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-slate-500">
                            <span className="font-bold text-slate-700">{lot.farmerName}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3 text-slate-400" /> {lot.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Middle stats & timing columns */}
                      <div className="grid grid-cols-4 gap-2 text-center md:text-right md:w-2/5 text-xs">
                        <div>
                          <span className="text-[8px] text-slate-400 font-black uppercase block">Available</span>
                          <span className="font-bold text-slate-800 font-mono text-xs">{lot.quantity} T</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-slate-400 font-black uppercase block">MOQ</span>
                          <span className="font-bold text-slate-800 font-mono text-xs">{lot.minOrderQty} T</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-slate-400 font-black uppercase block">Total Bids</span>
                          <span className="font-bold text-teal-600 font-mono text-xs">{lot.bidCount}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] text-slate-400 font-black uppercase block">Ends In</span>
                          <span className="text-[10px] font-mono font-black text-amber-600 block">{formatTimer(lot.timeLeft)}</span>
                        </div>
                      </div>

                      {/* Right action block */}
                      <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                        <div className="text-left md:text-right">
                          <span className="text-[8px] text-slate-400 font-bold uppercase block">Highest Bid</span>
                          <span className="text-sm font-black text-teal-700 font-mono">₹{lot.currentHighestBid.toLocaleString()}</span>
                        </div>

                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleToggleWatch(lot.id)}
                            className={`p-2 border rounded-xl flex items-center justify-center cursor-pointer transition-all ${
                              isWatched ? "bg-amber-50 border-amber-300 text-amber-600" : "bg-slate-50 border-slate-200 text-slate-400"
                            }`}
                          >
                            <Bell className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDetails(lot)}
                            className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                          >
                            Enter Room <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* DETAILED AUCTION ROOM WORKSPACE POPUP DIALOG */}
      <AnimatePresence>
        {selectedLot && (
          <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 md:p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="bg-white border border-slate-150 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden my-4"
            >
              {/* Modern Grid layout representing an actual live trading station */}
              <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-150">
                
                {/* LEFT HALF: Media Galleries, Specifications & Farmer Credentials (col-span-6) */}
                <div className="lg:col-span-6 p-4 md:p-5 space-y-4 max-h-[85vh] overflow-y-auto">
                  {/* Top lot identifier metadata */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded-md font-mono font-black tracking-wider">
                        AUCTION ROOM: {selectedLot.id}
                      </span>
                      {selectedLot.organic && (
                        <span className="text-[9px] bg-amber-500 text-white px-2 py-0.5 rounded-md font-black uppercase tracking-wider">
                          Organic Cert.
                        </span>
                      )}
                    </div>
                    
                    {/* Watch toggle in modal */}
                    <button
                      type="button"
                      onClick={() => handleToggleWatch(selectedLot.id)}
                      className={`px-3 py-1.5 border rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                        watchedLots.includes(selectedLot.id)
                          ? "bg-amber-50 border-amber-300 text-amber-700 font-extrabold"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {watchedLots.includes(selectedLot.id) ? (
                        <>
                          <BellRing className="h-3.5 w-3.5 text-amber-500 fill-amber-500 animate-swing" /> Watching
                        </>
                      ) : (
                        <>
                          <Bell className="h-3.5 w-3.5" /> Watch Lot
                        </>
                      )}
                    </button>
                  </div>

                  {/* Media Workspace Tabs */}
                  <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
                    <button
                      type="button"
                      onClick={() => setActiveMediaTab("photos")}
                      className={`flex-1 py-1.5 text-center text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                        activeMediaTab === "photos" ? "bg-white text-slate-950 shadow-3xs" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      📸 HD Photo Gallery
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMediaTab("360")}
                      className={`flex-1 py-1.5 text-center text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                        activeMediaTab === "360" ? "bg-white text-teal-700 shadow-3xs" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      🔄 360° Hyperspectral Scan
                    </button>
                  </div>

                  {/* Media Content Box */}
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden relative">
                    {activeMediaTab === "photos" ? (
                      /* PHOTO GALLERY */
                      <div className="space-y-2">
                        <div className="relative h-64 bg-slate-900 flex items-center justify-center">
                          <img
                            src={selectedLot.images[activeImageIndex] || selectedLot.image}
                            alt={`${selectedLot.cropName} Detail`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-slate-950/70 text-slate-300 text-[8px] font-mono px-2 py-0.5 rounded border border-slate-800">
                            Photo {activeImageIndex + 1} of {selectedLot.images.length}
                          </div>
                        </div>
                        {/* Thumbnails array selection */}
                        <div className="p-2 flex gap-2 overflow-x-auto justify-center bg-white border-t border-slate-100">
                          {selectedLot.images.map((img, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setActiveImageIndex(idx)}
                              className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                                activeImageIndex === idx ? "border-teal-500 scale-102" : "border-slate-200 opacity-60 hover:opacity-100"
                              }`}
                            >
                              <img src={img} alt="Thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* 360 DEGREE HYPERSPECTRAL VIEW ROTATOR MOCK */
                      <div className="p-4 bg-slate-950 text-emerald-400 space-y-4">
                        <div className="relative h-56 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center">
                          
                          {/* Animated scanner graphic line */}
                          <div className="absolute inset-x-0 top-0 h-0.5 bg-teal-500/60 shadow-[0_0_10px_#14b8a6] animate-bounce z-10" />

                          {/* Crop rotating illustration simulation */}
                          <div className="relative flex flex-col items-center">
                            <motion.img
                              src={selectedLot.image}
                              alt="Hyperspectral scan rotation render"
                              referrerPolicy="no-referrer"
                              style={{
                                rotate: rotationDeg - 180,
                                scale: 1 + Math.sin((rotationDeg * Math.PI) / 180) * 0.08
                              }}
                              className="w-32 h-32 rounded-full object-cover border-4 border-teal-500/20 shadow-2xl"
                            />
                            
                            {/* Scanning telemetry readouts */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none w-full">
                              <div className="bg-slate-950/80 p-2.5 rounded-lg border border-teal-500/30 font-mono text-[9px] uppercase space-y-0.5 max-w-[140px] mx-auto text-emerald-300">
                                <p className="font-black text-teal-400 text-[10px]">ROTATING SCAN</p>
                                <p>Angle: {rotationDeg}°</p>
                                <p>Grain Density: 99.1%</p>
                                <p>Refractivity: 1.45</p>
                              </div>
                            </div>
                          </div>

                          <div className="absolute bottom-2 left-2 right-2 bg-slate-950/90 p-2 rounded border border-slate-800 text-[8px] font-mono text-slate-400 leading-tight">
                            ⚡ Adjust slider below to execute rotational fiber diagnostic and moisture density inspect. (3D simulation matches physical sample parcel lote checks).
                          </div>
                        </div>

                        {/* Drag rotational slider */}
                        <div className="space-y-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
                          <div className="flex justify-between font-mono text-[9px] uppercase text-slate-400 px-1">
                            <span>0° (West)</span>
                            <span className="text-teal-400 font-bold">Inspect rotation: {rotationDeg}°</span>
                            <span>360° (East)</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            value={rotationDeg}
                            onChange={(e) => setRotationDeg(parseInt(e.target.value))}
                            className="w-full h-1 bg-slate-800 appearance-none rounded-lg cursor-pointer accent-teal-400"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Farmer Profile metrics */}
                  <div className="space-y-2">
                    <h5 className="text-[10px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-slate-500" /> Agronomic Producer Profile
                    </h5>
                    <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 flex gap-4 items-center">
                      <div className="h-12 w-12 bg-slate-200 border border-slate-300 rounded-full flex items-center justify-center text-slate-700 font-bold uppercase text-sm shrink-0">
                        {selectedLot.farmerName.substring(0, 2)}
                      </div>
                      <div className="space-y-1 flex-1">
                        <p className="text-xs font-black text-slate-900">{selectedLot.farmerName}</p>
                        <p className="text-[10px] text-slate-500 font-medium flex items-center gap-0.5">
                          <MapPin className="h-3 w-3 text-slate-400" /> {selectedLot.location}
                        </p>
                        <div className="flex gap-2 items-center pt-0.5 text-[9px]">
                          <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 border border-amber-200 rounded font-bold flex items-center gap-0.5">
                            ★ {selectedLot.farmerRating} Stars
                          </span>
                          <span className="text-slate-500 font-semibold font-mono">
                            Sold: {selectedLot.farmerTotalCropsSold} Tons
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Crop Information: Specs & Packaging details */}
                  <div className="space-y-2">
                    <h5 className="text-[10px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1">
                      <Package className="h-3.5 w-3.5 text-slate-500" /> Lot Logistics & Packaging
                    </h5>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                        <span className="text-[8px] text-slate-400 uppercase block font-black">Crop Name</span>
                        <span className="font-bold text-slate-800">{selectedLot.cropName}</span>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                        <span className="text-[8px] text-slate-400 uppercase block font-black">Variety Class</span>
                        <span className="font-bold text-slate-800">{selectedLot.variety}</span>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                        <span className="text-[8px] text-slate-400 uppercase block font-black">Minimum Order (MOQ)</span>
                        <span className="font-bold text-amber-700 font-mono text-xs">{selectedLot.minOrderQty} Tons</span>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                        <span className="text-[8px] text-slate-400 uppercase block font-black">Harvest Date</span>
                        <span className="font-mono text-slate-700 font-bold">{selectedLot.harvestDate}</span>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                        <span className="text-[8px] text-slate-400 uppercase block font-black">Packaging Type</span>
                        <span className="font-bold text-slate-800">{selectedLot.packagingType}</span>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                        <span className="text-[8px] text-slate-400 uppercase block font-black">Packaging Unit Size</span>
                        <span className="font-bold text-slate-800 font-mono text-xs">{selectedLot.packagingSize}</span>
                      </div>
                    </div>
                  </div>

                  {/* Physical Lab Metrics */}
                  <div className="space-y-2 bg-slate-50 border border-slate-150 rounded-xl p-3">
                    <p className="text-[9px] uppercase font-black text-slate-400 tracking-wider mb-2">Quality Assurance Laboratory Verification</p>
                    <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                      <div>
                        <span className="text-[8px] block text-slate-400 uppercase">Chemical Purity</span>
                        <span className="font-bold font-mono text-slate-800">{selectedLot.purity}</span>
                      </div>
                      <div className="border-x border-slate-200">
                        <span className="text-[8px] block text-slate-400 uppercase">Moisture Level</span>
                        <span className="font-bold font-mono text-slate-800">{selectedLot.moisture}</span>
                      </div>
                      <div>
                        <span className="text-[8px] block text-slate-400 uppercase">Certification Code</span>
                        <span className="font-bold font-mono text-teal-600">QA-ESC-{selectedLot.id}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT HALF: Bidding Console, Auto-bid configurations & Bid ledger (col-span-6) */}
                <div className="lg:col-span-6 p-4 md:p-5 space-y-4 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
                  
                  {/* Title & Live Countdown Timer Block */}
                  <div className="space-y-3">
                    <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-md space-y-3 relative overflow-hidden">
                      {/* Grid representation */}
                      <div className="absolute right-0 top-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <span className="text-[9px] uppercase font-black text-teal-400 tracking-wider flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 animate-spin-slow text-amber-400" /> LIVE Escrow countdown
                        </span>
                        <span className="text-[10px] text-amber-400 font-mono font-black uppercase">
                          {formatTimer(selectedLot.timeLeft)}
                        </span>
                      </div>

                      {/* Financial summary metrics */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <span className="text-[8px] uppercase text-slate-400 block font-bold">Starting Bid</span>
                          <span className="text-xs font-bold font-mono text-slate-300">₹{selectedLot.startingBid.toLocaleString()}</span>
                        </div>
                        <div className="border-x border-slate-800">
                          <span className="text-[8px] uppercase text-slate-400 block font-bold">Total Bids Placed</span>
                          <span className="text-xs font-bold font-mono text-teal-400">{selectedLot.bidCount} Bids</span>
                        </div>
                        <div>
                          <span className="text-[8px] uppercase text-teal-400 block font-bold">Current Highest</span>
                          <span className="text-sm font-black font-mono text-white">₹{selectedLot.currentHighestBid.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bidding Command Center Form */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3.5">
                      <div className="flex justify-between items-center border-b border-slate-150 pb-2">
                        <h4 className="text-[10px] uppercase font-black text-slate-700 tracking-wider">Place Escalation Bid</h4>
                        <span className="text-[9px] text-slate-400">Values in ₹ per Ton</span>
                      </div>

                      {bidSuccess ? (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-center text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5">
                          <CheckCircle className="h-4.5 w-4.5 text-emerald-600" /> ✨ Bid Recorded! You are Leading!
                        </div>
                      ) : (
                        <form onSubmit={handlePlaceBid} className="space-y-4">
                          
                          {/* AI Bidding Strategy Assistant */}
                          <div className="bg-slate-900 text-white rounded-2xl p-3 border border-slate-800 space-y-2.5 shadow-inner">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] uppercase font-black text-teal-400 tracking-wider flex items-center gap-1">
                                <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" /> AI Broker Insights
                              </span>
                              {isLoadingSuggestion ? (
                                <span className="text-[8px] font-mono text-slate-400 animate-pulse">Calculating...</span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => fetchBidSuggestion(selectedLot)}
                                  className="text-[8px] text-teal-400 hover:text-white font-bold underline cursor-pointer"
                                >
                                  Refresh AI Suggestion
                                </button>
                              )}
                            </div>

                            {isLoadingSuggestion ? (
                              <div className="py-4 flex flex-col justify-center items-center gap-1">
                                <div className="h-4 w-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
                                <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest">Consulting Commodity Mandis...</span>
                              </div>
                            ) : aiSuggestion ? (
                              <div className="space-y-2">
                                <p className="text-[9px] text-slate-300 leading-relaxed bg-slate-950/40 p-2 rounded border border-slate-800/50">
                                  {aiSuggestion.reasoning}
                                </p>
                                
                                <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                                  <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800">
                                    <span className="text-[7.5px] text-slate-400 block uppercase font-bold">Fair Value</span>
                                    <span className="font-mono text-white font-black">₹{aiSuggestion.fairMarketValue.toLocaleString()}</span>
                                  </div>
                                  <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800">
                                    <span className="text-[7.5px] text-teal-400 block uppercase font-black">AI Best Bid</span>
                                    <span className="font-mono text-teal-300 font-black block">₹{aiSuggestion.optimalInitialBid.toLocaleString()}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setNewBidAmount(aiSuggestion.optimalInitialBid.toString());
                                        addNotification(`Prefilled Bid Amount with AI recommendation: ₹${aiSuggestion.optimalInitialBid.toLocaleString()}`, "success", selectedLot.id);
                                      }}
                                      className="mt-1 w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-[7.5px] py-0.5 rounded cursor-pointer uppercase transition-all"
                                    >
                                      Apply
                                    </button>
                                  </div>
                                  <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800">
                                    <span className="text-[7.5px] text-amber-400 block uppercase font-extrabold">Auto-Bid Cap</span>
                                    <span className="font-mono text-amber-300 font-bold block">₹{aiSuggestion.suggestedMaxAutoBid.toLocaleString()}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setIsAutoBidEnabled(true);
                                        setMaxAutoBidAmount(aiSuggestion.suggestedMaxAutoBid.toString());
                                        addNotification(`Prefilled Auto-Bid Cap with AI suggestion: ₹${aiSuggestion.suggestedMaxAutoBid.toLocaleString()}`, "success", selectedLot.id);
                                      }}
                                      className="mt-1 w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[7.5px] py-0.5 rounded cursor-pointer uppercase transition-all"
                                    >
                                      Apply
                                    </button>
                                  </div>
                                </div>
                                
                                <div className="flex justify-between text-[8px] text-slate-400 px-1 pt-1 border-t border-slate-800/40">
                                  <span>Market Trend: <strong className={`font-black uppercase ${aiSuggestion.marketTrend === "Upward" ? "text-emerald-400" : aiSuggestion.marketTrend === "Downward" ? "text-rose-400" : "text-amber-400"}`}>{aiSuggestion.marketTrend}</strong></span>
                                  <span>Realtime Mandi Index</span>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-2">
                                <button
                                  type="button"
                                  onClick={() => fetchBidSuggestion(selectedLot)}
                                  className="px-3 py-1 bg-teal-500 text-slate-950 rounded-lg text-[9px] font-black uppercase hover:bg-teal-400 cursor-pointer transition-all"
                                >
                                  Consult AI Broker
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Standard Bid input with micro increments */}
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Your Bid Amount (₹ per Ton)</label>
                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">₹</span>
                                <input
                                  type="number"
                                  required
                                  value={newBidAmount}
                                  onChange={(e) => {
                                    setNewBidAmount(e.target.value);
                                    setBidError("");
                                  }}
                                  className="w-full bg-white border border-slate-250 rounded-xl py-2.5 pl-8 pr-3 text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                                />
                              </div>
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => incrementBid(1000)}
                                  className="px-2.5 bg-white border border-slate-250 rounded-xl text-[10px] font-black hover:bg-slate-100 cursor-pointer"
                                  title="Add ₹1,000"
                                >
                                  +1k
                                </button>
                                <button
                                  type="button"
                                  onClick={() => incrementBid(5000)}
                                  className="px-2.5 bg-white border border-slate-250 rounded-xl text-[10px] font-black hover:bg-slate-100 cursor-pointer"
                                  title="Add ₹5,000"
                                >
                                  +5k
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Smart Auto-Bid setup */}
                          <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2.5">
                            <div className="flex justify-between items-center">
                              <div className="space-y-0.5">
                                <span className="text-[9px] font-black uppercase text-slate-700 block tracking-wider">Smart Auto-Bidding Agent</span>
                                <span className="text-[8px] text-slate-400 block">System immediately outbids competitors by ₹500</span>
                              </div>
                              <input
                                type="checkbox"
                                id="auto-bid-toggle"
                                checked={isAutoBidEnabled}
                                onChange={(e) => {
                                  setIsAutoBidEnabled(e.target.checked);
                                  if (!e.target.checked) setMaxAutoBidAmount("");
                                }}
                                className="w-4 h-4 text-teal-600 border-slate-300 rounded-sm focus:ring-teal-500 accent-teal-600"
                              />
                            </div>

                            {isAutoBidEnabled && (
                              <div className="space-y-1.5 pt-1.5 border-t border-slate-100">
                                <label className="text-[8px] font-extrabold uppercase text-slate-400 tracking-wider block">Auto-Bid Price Cap (Max ₹ Limit)</label>
                                <div className="relative">
                                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">₹</span>
                                  <input
                                    type="number"
                                    required={isAutoBidEnabled}
                                    placeholder={(selectedLot.currentHighestBid + 8000).toString()}
                                    value={maxAutoBidAmount}
                                    onChange={(e) => setMaxAutoBidAmount(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-6 pr-3 text-xs font-mono font-bold focus:outline-hidden"
                                  />
                                </div>
                                <p className="text-[8px] text-slate-400 leading-normal">
                                  Your auto-bid agent will counter competing offers instantly up to this price threshold. Safe, automated, and secure.
                                </p>
                              </div>
                            )}
                          </div>

                          {bidError && (
                            <p className="text-[9px] text-rose-600 font-extrabold flex items-center gap-1 bg-rose-50 border border-rose-100 p-2 rounded-lg">
                              <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> {bidError}
                            </p>
                          )}

                          {/* Submit button */}
                          <button
                            type="submit"
                            className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-slate-950 font-black uppercase text-[10.5px] tracking-wider rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1"
                          >
                            <DollarSign className="h-4 w-4" /> Commit Smart Escrow Bid
                          </button>
                        </form>
                      )}
                    </div>
                  </div>

                  {/* Auction Activity Bid History log */}
                  <div className="space-y-2">
                    <h5 className="text-[9.5px] uppercase font-black text-slate-400 tracking-wider flex items-center justify-between">
                      <span>Recent Bid Log Activity Ledger</span>
                      <span className="font-mono text-teal-600 font-bold">REALTIME</span>
                    </h5>
                    <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                      <AnimatePresence initial={false}>
                        {selectedLot.bidsHistory.map((bh, idx) => {
                          const isUser = bh.company.includes("You") || bh.company.includes("Global Agrifood");
                          return (
                            <motion.div
                              key={`${bh.company}-${bh.amount}-${idx}`}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={`flex justify-between items-center p-2 rounded-xl text-[10.5px] border ${
                                isUser
                                  ? "bg-teal-50/70 border-teal-200 text-teal-950"
                                  : "bg-slate-50 border-slate-150 text-slate-800"
                              }`}
                            >
                              <div className="space-y-0.5">
                                <p className="font-bold flex items-center gap-1">
                                  {bh.company}
                                  {isUser && <span className="bg-teal-600 text-white text-[7px] font-black px-1 rounded uppercase">Current lead</span>}
                                </p>
                                <p className="text-[8px] text-slate-400">{bh.time}</p>
                              </div>
                              <span className="font-mono font-black">₹{bh.amount.toLocaleString()}</span>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Auction Room footer action controls */}
                  <div className="pt-2 border-t border-slate-150 flex items-center justify-between">
                    <div className="text-[9px] text-slate-400 flex items-center gap-1">
                      <Award className="h-3.5 w-3.5 text-teal-600" /> Escrow locks buyer funds upon bid award.
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedLot(null)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold uppercase text-[9px] tracking-wider transition-all cursor-pointer"
                    >
                      Exit Auction Room
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
