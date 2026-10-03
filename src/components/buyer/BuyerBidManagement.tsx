import React, { useState, useEffect, useMemo } from "react";
import {
  Clock,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Trophy,
  XCircle,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Play,
  RotateCw,
  Search,
  SlidersHorizontal,
  ChevronRight,
  User,
  MapPin,
  Bell,
  ArrowRight,
  HelpCircle,
  Zap,
  Info,
  CreditCard,
  Truck,
  FileText,
  QrCode,
  Calendar,
  Send,
  AlertCircle,
  ShoppingCart,
  Check,
  Plus,
  Award,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// CropListingItem matching CropBiddingSystem
export interface CropListingItem {
  id: string;
  cropName: string;
  variety: string;
  farmerName: string;
  location: string;
  region: string;
  cropType: string;
  quantity: number;
  minOrderQty: number;
  packagingType: string;
  packagingSize: string;
  farmerRating: number;
  farmerTotalCropsSold: number;
  qualityGrade: "Premium" | "Grade A" | "Grade B" | "Grade C";
  startingBid: number;
  currentHighestBid: number;
  bidCount: number;
  timeLeft: number;
  image: string;
  images: string[];
  harvestDate: string;
  moisture: string;
  purity: string;
  organic: boolean;
  bidsHistory: { company: string; amount: number; time: string }[];
}

export interface BidHistoryRecord {
  id: string;
  lotId: string;
  cropName: string;
  variety: string;
  farmerName: string;
  quantity: number;
  qualityGrade: string;
  finalBid: number;
  marketPrice: number;
  savings: number;
  status: "Won" | "Lost" | "Cancelled";
  date: string;
  image: string;
}

export interface WonOrder {
  id: string;
  lotId: string;
  cropName: string;
  variety: string;
  farmerName: string;
  quantity: number;
  qualityGrade: string;
  finalBidAmount: number;
  paymentDeadline: string;
  paymentStatus: "Pending" | "Paid";
  pickupStatus: "Unscheduled" | "Scheduled" | "Dispatched" | "In Transit" | "Delivered";
  pickupDetails?: {
    modeOfTransport: string;
    pickupDate: string;
    pickupTime: string;
    driverName: string;
    driverPhone: string;
    vehicleNumber: string;
    targetWarehouse: string;
  };
  orderConfirmationNumber?: string;
  paymentLink?: string;
}

interface BuyerBidManagementProps {
  listings: CropListingItem[];
  setListings: React.Dispatch<React.SetStateAction<CropListingItem[]>>;
  autoBidLimits: Record<string, number>;
  setAutoBidLimits: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  addNotification?: (message: string, type: "info" | "success" | "warning" | "bid", lotId?: string) => void;
}

export default function BuyerBidManagement({
  listings,
  setListings,
  autoBidLimits,
  setAutoBidLimits,
  addNotification
}: BuyerBidManagementProps) {
  // Load user active bids map from localStorage (key -> lotId, value -> user bid amount)
  const [userActiveBids, setUserActiveBids] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem("agriconnect_user_active_bids");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    // Pre-populate realistic default active bids if none exist
    const defaultBids = {
      "LOT-9102": 62000, // Premium Basmati Rice (current highest in default listings is 62500 -> Outbid!)
      "LOT-5123": 92000  // Golden Delicious Apples (current highest is 92000 -> Winning!)
    };
    localStorage.setItem("agriconnect_user_active_bids", JSON.stringify(defaultBids));
    return defaultBids;
  });

  // Bid History list with Won, Lost, and Cancelled bids
  const [bidHistory, setBidHistory] = useState<BidHistoryRecord[]>(() => {
    const saved = localStorage.getItem("agriconnect_user_bid_history");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    const defaultHistory: BidHistoryRecord[] = [
      {
        id: "HIST-101",
        lotId: "LOT-3104",
        cropName: "Organic Yellow Mustard Seeds",
        variety: "M-27 Bold Hybrid",
        farmerName: "Rajender Singh Cooperatives",
        quantity: 12,
        qualityGrade: "Premium",
        finalBid: 45000,
        marketPrice: 52000,
        savings: 7000,
        status: "Won",
        date: "2026-06-20",
        image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=200"
      },
      {
        id: "HIST-102",
        lotId: "LOT-2041",
        cropName: "Premium Long-Staple Cotton",
        variety: "MCU-5 Fine Cotton",
        farmerName: "Gurnam Singh Cotton Farms",
        quantity: 18,
        qualityGrade: "Grade A",
        finalBid: 88500,
        marketPrice: 98000,
        savings: 9500,
        status: "Won",
        date: "2026-06-15",
        image: "https://images.unsplash.com/photo-1536304997881-a372c179924b?auto=format&fit=crop&q=80&w=200"
      },
      {
        id: "HIST-103",
        lotId: "LOT-1192",
        cropName: "Organic Finger Millet (Ragi)",
        variety: "GPU-28 High Yield",
        farmerName: "S Sukhdev Orchards",
        quantity: 8,
        qualityGrade: "Grade B",
        finalBid: 22000,
        marketPrice: 24000,
        savings: 0,
        status: "Lost",
        date: "2026-06-10",
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=200"
      },
      {
        id: "HIST-104",
        lotId: "LOT-1082",
        cropName: "Desi Chickpeas (Bold Kabuli)",
        variety: "Phule G-12",
        farmerName: "Pritam Singh Dhillon",
        quantity: 15,
        qualityGrade: "Grade B",
        finalBid: 31000,
        marketPrice: 31000,
        savings: 0,
        status: "Cancelled",
        date: "2026-06-05",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200"
      }
    ];
    localStorage.setItem("agriconnect_user_bid_history", JSON.stringify(defaultHistory));
    return defaultHistory;
  });

  const [activeDeskTab, setActiveDeskTab] = useState<"bids_workspace" | "order_fulfillment">("bids_workspace");

  const [wonOrders, setWonOrders] = useState<WonOrder[]>(() => {
    const saved = localStorage.getItem("agriconnect_buyer_orders");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    const defaultOrders: WonOrder[] = [
      {
        id: "ORD-2026-001",
        lotId: "LOT-8432",
        cropName: "Wheat",
        variety: "PBW 343 Premium",
        farmerName: "Rajesh Patel",
        quantity: 10,
        qualityGrade: "Grade A",
        finalBidAmount: 250000,
        paymentDeadline: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        paymentStatus: "Paid",
        pickupStatus: "Scheduled",
        pickupDetails: {
          modeOfTransport: "Standard Freight Logistics",
          pickupDate: "2026-07-01",
          pickupTime: "11:00",
          driverName: "Sohan Singh Brar",
          driverPhone: "+91 94142 83012",
          vehicleNumber: "PB-12-FG-7431",
          targetWarehouse: "Adani Agri-Logistics Terminal (Anand)"
        },
        orderConfirmationNumber: "CONF-001-K5Y",
        paymentLink: "https://sandbox.agri-escrow.gov.in/pay/ORD-2026-001"
      },
      {
        id: "ORD-2026-002",
        lotId: "LOT-6650",
        cropName: "Corn",
        variety: "Hybrid 1 Premium Quality",
        farmerName: "Suresh Kumar",
        quantity: 8,
        qualityGrade: "Premium",
        finalBidAmount: 152000,
        paymentDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        paymentStatus: "Pending",
        pickupStatus: "Unscheduled",
        orderConfirmationNumber: "CONF-002-M2W",
        paymentLink: "https://sandbox.agri-escrow.gov.in/pay/ORD-2026-002"
      }
    ];
    localStorage.setItem("agriconnect_buyer_orders", JSON.stringify(defaultOrders));
    return defaultOrders;
  });

  // Sync orders to localStorage
  useEffect(() => {
    localStorage.setItem("agriconnect_buyer_orders", JSON.stringify(wonOrders));
  }, [wonOrders]);

  // Monitor active bids for finished auctions
  useEffect(() => {
    let changed = false;
    const newUserActiveBids = { ...userActiveBids };
    const newBidHistory = [...bidHistory];
    const newWonOrders = [...wonOrders];

    Object.entries(userActiveBids).forEach(([lotId, myBidAmount]) => {
      const liveLot = listings.find((l) => l.id === lotId);
      if (liveLot && liveLot.timeLeft <= 0) {
        // Auction finished!
        const myBidAmountValue = myBidAmount as number;
        const isHighest = liveLot.currentHighestBid <= myBidAmountValue;
        const status = isHighest ? "Won" : "Lost";

        // Remove from active bids
        delete newUserActiveBids[lotId];
        changed = true;

        // Add to history if not already present
        const alreadyInHistory = newBidHistory.some((h) => h.lotId === liveLot.id && h.status === status);
        if (!alreadyInHistory) {
          const newRecord: BidHistoryRecord = {
            id: `HIST-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            lotId: liveLot.id,
            cropName: liveLot.cropName,
            variety: liveLot.variety,
            farmerName: liveLot.farmerName,
            quantity: liveLot.quantity,
            qualityGrade: liveLot.qualityGrade,
            finalBid: myBidAmountValue,
            marketPrice: liveLot.currentHighestBid,
            savings: isHighest ? Math.max(2000, Math.round(liveLot.currentHighestBid * 0.08)) : 0,
            status,
            date: new Date().toISOString().split("T")[0],
            image: liveLot.image || "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200"
          };
          newBidHistory.unshift(newRecord);

          if (isHighest) {
            // Create corresponding Won Order
            const orderId = `ORD-2026-${liveLot.id.split("-")[1] || Math.floor(Math.random() * 9000 + 1000)}`;
            const newOrder: WonOrder = {
              id: orderId,
              lotId: liveLot.id,
              cropName: liveLot.cropName,
              variety: liveLot.variety,
              farmerName: liveLot.farmerName,
              quantity: liveLot.quantity,
              qualityGrade: liveLot.qualityGrade,
              finalBidAmount: myBidAmountValue,
              paymentDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              paymentStatus: "Pending",
              pickupStatus: "Unscheduled",
              orderConfirmationNumber: `CONF-${liveLot.id.split("-")[1] || "9102"}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
              paymentLink: `https://sandbox.agri-escrow.gov.in/pay/${orderId}`
            };
            newWonOrders.unshift(newOrder);

            if (addNotification) {
              addNotification(
                `🏆 Bid WON! You secured ${liveLot.cropName} (${liveLot.id}) at ₹${myBidAmount.toLocaleString()}. Order created!`,
                "success",
                liveLot.id
              );
            }
          } else {
            if (addNotification) {
              addNotification(
                `⚠️ Auction ended: You were outbid on ${liveLot.cropName} (${liveLot.id}).`,
                "warning",
                liveLot.id
              );
            }
          }
        }
      }
    });

    if (changed) {
      setUserActiveBids(newUserActiveBids);
      localStorage.setItem("agriconnect_user_active_bids", JSON.stringify(newUserActiveBids));
      setBidHistory(newBidHistory);
      localStorage.setItem("agriconnect_user_bid_history", JSON.stringify(newBidHistory));
      setWonOrders(newWonOrders);
    }
  }, [listings, userActiveBids, bidHistory, wonOrders, addNotification]);

  // Filter & Search states for history
  const [historySearch, setHistorySearch] = useState("");
  const [historyStatusFilter, setHistoryStatusFilter] = useState<"All" | "Won" | "Lost" | "Cancelled">("All");

  // Manual bid increase form state
  const [incrementAmount, setIncrementAmount] = useState<Record<string, string>>({});
  const [activeLotPanel, setActiveLotPanel] = useState<string | null>(null);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<WonOrder | null>(null);
  const [selectedOrderForLogistics, setSelectedOrderForLogistics] = useState<WonOrder | null>(null);

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem("agriconnect_user_active_bids", JSON.stringify(userActiveBids));
  }, [userActiveBids]);

  useEffect(() => {
    localStorage.setItem("agriconnect_user_bid_history", JSON.stringify(bidHistory));
  }, [bidHistory]);

  // Derive active bids with current live auction status
  const activeBidsList = useMemo(() => {
    return Object.entries(userActiveBids).map(([lotId, myBidAmount]) => {
      // Find the corresponding lot in live listings
      const liveLot = listings.find((l) => l.id === lotId);
      const myBidAmountValue = myBidAmount as number;

      if (!liveLot) {
        // Return a mock or placeholder active bid if not found in active listings
        return {
          id: lotId,
          cropName: "Active Lot",
          variety: "Standard Variety",
          farmerName: "Verified Partner Farm",
          location: "Andhra Pradesh, India",
          quantity: 10,
          qualityGrade: "Grade A",
          userBidAmount: myBidAmountValue,
          currentHighestBid: myBidAmountValue,
          timeLeft: 0,
          bidCount: 1,
          image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200",
          status: "Winning" as const,
          bidsHistory: []
        };
      }

      // Determine status: Winning, Losing (Outbid)
      // Since user bid is myBidAmount, if currentHighestBid is exactly userBidAmount, we are Winning!
      // If currentHighestBid is greater than userBidAmount, we are Outbid!
      const isHighest = liveLot.currentHighestBid <= myBidAmountValue;
      const status = isHighest ? ("Winning" as const) : ("Outbid" as const);

      return {
        ...liveLot,
        userBidAmount: myBidAmountValue,
        status
      };
    });
  }, [userActiveBids, listings]);

  // Stats Calculations
  const stats = useMemo(() => {
    // Won bids summary
    const wonBids = bidHistory.filter((b) => b.status === "Won");
    const totalWonValue = wonBids.reduce((sum, b) => sum + (b.finalBid * b.quantity), 0);
    const totalSavingsValue = wonBids.reduce((sum, b) => sum + (b.savings * b.quantity), 0);

    const completedCount = bidHistory.filter((b) => b.status === "Won" || b.status === "Lost").length;
    const successRate = completedCount > 0 ? Math.round((wonBids.length / completedCount) * 100) : 0;

    return {
      activeCount: activeBidsList.length,
      winningCount: activeBidsList.filter((b) => b.status === "Winning").length,
      outbidCount: activeBidsList.filter((b) => b.status === "Outbid").length,
      totalWonValue,
      totalSavingsValue,
      successRate
    };
  }, [activeBidsList, bidHistory]);

  // Handler to increase bid on a specific lot
  const handleIncreaseBid = (lotId: string, customAmount?: number) => {
    const liveLot = listings.find((l) => l.id === lotId);
    if (!liveLot) return;

    // Minimum increase is ₹500 or slightly above current highest
    const minBid = Math.max(liveLot.currentHighestBid + 500, liveLot.startingBid);
    const targetAmount = customAmount || minBid;

    if (targetAmount <= liveLot.currentHighestBid) {
      if (addNotification) {
        addNotification(`Bid must exceed the current highest bid of ₹${liveLot.currentHighestBid.toLocaleString()}`, "warning", lotId);
      }
      return;
    }

    // 1. Update listings state
    const updatedHistory = [
      { company: "Global Agrifood Corp (You)", amount: targetAmount, time: "Just now" },
      ...liveLot.bidsHistory
    ];

    setListings((prevListings) =>
      prevListings.map((item) =>
        item.id === lotId
          ? {
              ...item,
              currentHighestBid: targetAmount,
              bidCount: item.bidCount + 1,
              bidsHistory: updatedHistory
            }
          : item
      )
    );

    // 2. Update local active user bids
    setUserActiveBids((prev) => ({
      ...prev,
      [lotId]: targetAmount
    }));

    // 3. Clear inline input
    setIncrementAmount((prev) => ({ ...prev, [lotId]: "" }));

    // 4. Trigger alert
    const successMsg = `🎉 Bid increased successfully! You are now winning the auction for ${liveLot.cropName} (${lotId}) at ₹${targetAmount.toLocaleString()}.`;
    if (addNotification) {
      addNotification(successMsg, "success", lotId);
    }
  };

  // Handler to cancel/retract bid (removes from active watchlist, moves to Cancelled history)
  const handleRetractActiveBid = (lotId: string) => {
    const activeBid = activeBidsList.find((b) => b.id === lotId);
    if (!activeBid) return;

    if (window.confirm(`Are you sure you want to retract your active bid of ₹${activeBid.userBidAmount.toLocaleString()} on ${activeBid.cropName} (${lotId})?`)) {
      // Move to cancelled history
      const retractedRecord: BidHistoryRecord = {
        id: `HIST-${Date.now()}`,
        lotId: activeBid.id,
        cropName: activeBid.cropName,
        variety: activeBid.variety,
        farmerName: activeBid.farmerName,
        quantity: activeBid.quantity,
        qualityGrade: activeBid.qualityGrade,
        finalBid: activeBid.userBidAmount,
        marketPrice: activeBid.currentHighestBid,
        savings: 0,
        status: "Cancelled",
        date: new Date().toISOString().split("T")[0],
        image: activeBid.image
      };

      setBidHistory((prev) => [retractedRecord, ...prev]);

      // Remove from active user bids
      setUserActiveBids((prev) => {
        const copy = { ...prev };
        delete copy[lotId];
        return copy;
      });

      // Disable auto-bid if any
      setAutoBidLimits((prev) => {
        const copy = { ...prev };
        delete copy[lotId];
        return copy;
      });

      if (addNotification) {
        addNotification(`🚫 Retracted bid on ${activeBid.cropName} (${lotId}).`, "info", lotId);
      }
    }
  };

  // Configure Auto-bidding Max limit
  const handleSetAutoBidLimit = (lotId: string, limit: number) => {
    if (isNaN(limit) || limit <= 0) return;

    setAutoBidLimits((prev) => ({
      ...prev,
      [lotId]: limit
    }));

    if (addNotification) {
      addNotification(`🤖 Configured Smart Auto-Bid agent for lot ${lotId} up to ₹${limit.toLocaleString()}`, "success", lotId);
    }
  };

  // Disable Auto-bid
  const handleDisableAutoBid = (lotId: string) => {
    setAutoBidLimits((prev) => {
      const copy = { ...prev };
      delete copy[lotId];
      return copy;
    });

    if (addNotification) {
      addNotification(`🤖 Deactivated Auto-Bid agent for lot ${lotId}`, "info", lotId);
    }
  };

  const handleSimulateWin = (lotId: string) => {
    const activeBid = activeBidsList.find((b) => b.id === lotId);
    if (!activeBid) return;

    const winBidAmount = Math.max(activeBid.currentHighestBid, activeBid.userBidAmount);
    setUserActiveBids((prev) => ({
      ...prev,
      [lotId]: winBidAmount
    }));

    setListings((prevListings) =>
      prevListings.map((item) =>
        item.id === lotId
          ? {
              ...item,
              currentHighestBid: winBidAmount,
              timeLeft: 0,
              bidsHistory: [
                { company: "Global Agrifood Corp (You)", amount: winBidAmount, time: "Just now" },
                ...item.bidsHistory.filter((b: any) => !b.company.includes("(You)"))
              ]
            }
          : item
      )
    );

    if (addNotification) {
      addNotification(`⚡ Simulating immediate auction close for ${activeBid.cropName} (${lotId})...`, "info", lotId);
    }
  };

  // Filter history based on search and status
  const filteredHistory = useMemo(() => {
    return bidHistory.filter((record) => {
      const matchesSearch =
        record.cropName.toLowerCase().includes(historySearch.toLowerCase()) ||
        record.variety.toLowerCase().includes(historySearch.toLowerCase()) ||
        record.farmerName.toLowerCase().includes(historySearch.toLowerCase()) ||
        record.lotId.toLowerCase().includes(historySearch.toLowerCase());

      const matchesStatus = historyStatusFilter === "All" || record.status === historyStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bidHistory, historySearch, historyStatusFilter]);

  const formatTimer = (sec: number) => {
    if (sec <= 0) return "Auction Finished";
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div className="space-y-6" id="buyer-bid-desk">
      
      {/* High-Level Workspace Mode Selector */}
      <div className="flex bg-slate-150 p-1 rounded-2xl max-w-2xl border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveDeskTab("bids_workspace")}
          className={`flex-1 py-2 px-3 sm:px-4 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeDeskTab === "bids_workspace"
              ? "bg-teal-700 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-800"
          }`}
        >
          <Clock className="h-4 w-4" />
          Active Bids Sourcing Workspace ({activeBidsList.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveDeskTab("order_fulfillment")}
          className={`flex-1 py-2 px-3 sm:px-4 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeDeskTab === "order_fulfillment"
              ? "bg-teal-700 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-800"
          }`}
        >
          <ShoppingCart className="h-4 w-4" />
          Won Orders & Logistics ({wonOrders.filter(o => o.paymentStatus === "Pending").length} Pending)
        </button>
      </div>

      {activeDeskTab === "bids_workspace" ? (
        <>
          {/* Real-time Bid Board Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Bids */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-3xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Live Active Bids</p>
            <h4 className="text-2xl font-black text-slate-900 font-mono flex items-baseline gap-2">
              {stats.activeCount}
              <span className="text-xs text-slate-400 font-semibold">lots tracking</span>
            </h4>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                ● {stats.winningCount} Winning
              </span>
              <span className="text-amber-500 font-bold flex items-center gap-0.5">
                ● {stats.outbidCount} Outbid
              </span>
            </div>
          </div>
          <div className="p-3 bg-teal-50 rounded-xl border border-teal-100 text-teal-600">
            <Zap className="h-5 w-5 animate-pulse" />
          </div>
        </div>

        {/* Card 2: Total Won Value */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-3xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Value Won (Escrow)</p>
            <h4 className="text-2xl font-black text-slate-900 font-mono">
              ₹{stats.totalWonValue.toLocaleString()}
            </h4>
            <p className="text-[10px] text-slate-500 font-medium">Accumulated across completed acquisitions</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-600">
            <Trophy className="h-5 w-5" />
          </div>
        </div>

        {/* Card 3: Total Savings */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-3xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estimated Cost Savings</p>
            <h4 className="text-2xl font-black text-emerald-700 font-mono">
              ₹{stats.totalSavingsValue.toLocaleString()}
            </h4>
            <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
              <TrendingUp className="h-3.5 w-3.5" /> Direct sourcing advantage
            </p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        {/* Card 4: Success Rate */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-3xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bid Sourcing Success Rate</p>
            <h4 className="text-2xl font-black text-slate-900 font-mono">
              {stats.successRate}%
            </h4>
            <div className="w-24 bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-teal-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.successRate}%` }}
              />
            </div>
          </div>
          <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-100 text-cyan-600">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Active Bids Desk & Historic Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Active Bids Workspace (col-span-7) */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-5 shadow-3xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Clock className="h-4 w-4 text-teal-600" /> Active Auction Bid Desk
            </h3>
            <span className="text-[9px] bg-teal-50 border border-teal-200 text-teal-700 font-black px-2 py-0.5 rounded-full">
              LIVE BROADCAST ACTIVE
            </span>
          </div>

          {activeBidsList.length === 0 ? (
            <div className="text-center py-12 space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <SlidersHorizontal className="h-8 w-8 text-slate-300 mx-auto" />
              <h4 className="text-xs font-black uppercase text-slate-700">No Active Sourcing Bids</h4>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                You are not currently participating in any active crop auctions. Head over to the <strong className="text-teal-600">Crop Selling Exchange</strong> to find verified listings and place your bids.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {activeBidsList.map((bid) => {
                  const isWinning = bid.status === "Winning";
                  const isAutoBidOn = !!autoBidLimits[bid.id];
                  const autoLimit = autoBidLimits[bid.id] || 0;
                  const manualInput = incrementAmount[bid.id] || "";

                  return (
                    <motion.div
                      key={bid.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className={`border rounded-2xl overflow-hidden transition-all ${
                        isWinning
                          ? "bg-emerald-50/20 border-emerald-300 shadow-3xs"
                          : "bg-white border-rose-250 hover:border-rose-350 shadow-3xs"
                      }`}
                    >
                      {/* Top Header Row */}
                      <div className={`p-3 px-4 flex items-center justify-between border-b ${
                        isWinning ? "bg-emerald-500/5 border-emerald-150" : "bg-rose-50/20 border-rose-100"
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-black text-slate-400">{bid.id}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs font-black text-slate-900">{bid.cropName}</span>
                          <span className="text-[10px] text-slate-500 font-medium">({bid.variety})</span>
                        </div>
                        <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 border ${
                          isWinning
                            ? "bg-emerald-100 border-emerald-200 text-emerald-800"
                            : "bg-rose-100 border-rose-200 text-rose-800 animate-pulse"
                        }`}>
                          {isWinning ? (
                            <>
                              <CheckCircle className="h-3 w-3" /> Winning
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="h-3 w-3" /> Outbid!
                            </>
                          )}
                        </span>
                      </div>

                      {/* Main Workspace Body */}
                      <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                        {/* Left: Listing info */}
                        <div className="md:col-span-7 space-y-2">
                          <div className="flex items-center gap-2 text-[11px] text-slate-600">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            <span>{bid.location}</span>
                            <span className="text-slate-300">•</span>
                            <span className="font-semibold text-slate-800">{bid.farmerName}</span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-center text-xs">
                            <div>
                              <span className="text-[8px] uppercase text-slate-400 block font-bold">Volume</span>
                              <span className="font-extrabold text-slate-800 font-mono">{bid.quantity} Tons</span>
                            </div>
                            <div>
                              <span className="text-[8px] uppercase text-slate-400 block font-bold">Grade</span>
                              <span className="font-extrabold text-teal-700">{bid.qualityGrade}</span>
                            </div>
                            <div>
                              <span className="text-[8px] uppercase text-slate-400 block font-bold">Ends In</span>
                              <span className="font-extrabold text-amber-600 font-mono">{formatTimer(bid.timeLeft)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Bidding states */}
                        <div className="md:col-span-5 bg-slate-50/50 border border-slate-100 rounded-xl p-3 flex flex-col justify-between text-right">
                          <div className="flex justify-between md:block">
                            <span className="text-[9px] uppercase text-slate-400 block font-bold">Your Max Bid</span>
                            <span className="text-sm font-mono font-black text-slate-700">₹{bid.userBidAmount.toLocaleString()}</span>
                          </div>
                          
                          <div className="flex justify-between md:block border-t border-slate-100 md:border-t-0 pt-1.5 md:pt-0 mt-1.5 md:mt-0">
                            <span className="text-[9px] uppercase text-slate-400 block font-bold text-teal-600">Highest Live Bid</span>
                            <span className="text-base font-mono font-black text-teal-700">₹{bid.currentHighestBid.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Bidding Controls Panel */}
                      <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
                        
                        {/* Quick increment Buttons */}
                        <div className="flex items-center gap-1.5 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={() => handleIncreaseBid(bid.id, Math.max(bid.currentHighestBid + 500, bid.startingBid))}
                            className="flex-1 sm:flex-none px-2.5 py-1.5 bg-white border border-slate-200 hover:border-teal-500 rounded-lg text-[10px] font-extrabold text-slate-700 hover:text-teal-700 transition-all cursor-pointer"
                          >
                            + ₹500
                          </button>
                          <button
                            type="button"
                            onClick={() => handleIncreaseBid(bid.id, Math.max(bid.currentHighestBid + 1000, bid.startingBid))}
                            className="flex-1 sm:flex-none px-2.5 py-1.5 bg-white border border-slate-200 hover:border-teal-500 rounded-lg text-[10px] font-extrabold text-slate-700 hover:text-teal-700 transition-all cursor-pointer"
                          >
                            + ₹1,000
                          </button>
                          <button
                            type="button"
                            onClick={() => handleIncreaseBid(bid.id, Math.max(bid.currentHighestBid + 2000, bid.startingBid))}
                            className="flex-1 sm:flex-none px-2.5 py-1.5 bg-white border border-slate-200 hover:border-teal-500 rounded-lg text-[10px] font-extrabold text-slate-700 hover:text-teal-700 transition-all cursor-pointer"
                          >
                            + ₹2,000
                          </button>
                        </div>

                        {/* Interactive Action Forms */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <div className="relative flex-1 sm:flex-none sm:w-32">
                            <span className="absolute left-2 top-2 text-slate-400 font-bold text-[10px]">₹</span>
                            <input
                              type="number"
                              placeholder="Custom Bid"
                              value={manualInput}
                              onChange={(e) => setIncrementAmount(prev => ({ ...prev, [bid.id]: e.target.value }))}
                              className="w-full bg-white border border-slate-200 rounded-lg pl-5 pr-2.5 py-1.5 text-xs focus:outline-hidden focus:border-teal-500 text-slate-800 font-mono font-bold"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const amount = parseInt(manualInput);
                              if (amount) {
                                handleIncreaseBid(bid.id, amount);
                              } else {
                                handleIncreaseBid(bid.id);
                              }
                            }}
                            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-3xs hover:shadow-2xs shrink-0"
                          >
                            Place Bid
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSimulateWin(bid.id)}
                            className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-3xs hover:shadow-2xs shrink-0 flex items-center gap-1"
                            title="Simulate immediate auction victory to test payment and logistics creation"
                          >
                            <Zap className="h-3.5 w-3.5" /> Simulate Win
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRetractActiveBid(bid.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all border border-transparent hover:border-rose-100 cursor-pointer"
                            title="Retract bid and cancel"
                          >
                            <XCircle className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </div>

                      {/* Smart Auto-Bid Agent Control Tray */}
                      <div className="p-3 bg-slate-900 border-t border-slate-800 text-white flex flex-col md:flex-row justify-between items-center gap-3">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <Sparkles className="h-4 w-4 text-teal-400 shrink-0" />
                          <span>Smart Auto-Bid Agent is {isAutoBidOn ? "ACTIVE" : "INACTIVE"} for this lot.</span>
                        </div>

                        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                          {isAutoBidOn ? (
                            <>
                              <span className="text-[10px] font-mono text-teal-400 font-bold">
                                Limit cap: ₹{autoLimit.toLocaleString()}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDisableAutoBid(bid.id)}
                                className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 rounded text-[9px] font-bold uppercase cursor-pointer"
                              >
                                Disable Agent
                              </button>
                            </>
                          ) : (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                const form = e.currentTarget;
                                const val = parseInt((form.elements.namedItem("limit") as HTMLInputElement).value);
                                if (val) {
                                  handleSetAutoBidLimit(bid.id, val);
                                  form.reset();
                                }
                              }}
                              className="flex items-center gap-1.5 w-full md:w-auto"
                            >
                              <span className="text-[9px] text-slate-400 font-bold shrink-0">Auto-Bid Limit:</span>
                              <input
                                name="limit"
                                type="number"
                                placeholder={`Cap e.g. ${(bid.currentHighestBid + 5000)}`}
                                className="bg-slate-800 border border-slate-750 text-white rounded px-2 py-0.8 text-[9px] font-mono focus:outline-hidden w-28"
                              />
                              <button
                                type="submit"
                                className="px-2.5 py-1.2 bg-teal-500 text-slate-950 rounded text-[9px] font-black uppercase cursor-pointer tracking-wider hover:bg-teal-400"
                              >
                                Enable
                              </button>
                            </form>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Right Column: Historical Ledger Desk (col-span-5) */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl p-5 shadow-3xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Trophy className="h-4 w-4 text-teal-600" /> Historic Bidding Ledger
            </h3>
            <span className="text-[9px] text-slate-400 font-bold uppercase font-mono">
              Audit-Ready
            </span>
          </div>

          {/* Search & Tabs filter for history */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search history by crop, variety..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.8 pl-9 pr-3 text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-hidden focus:border-teal-500 focus:bg-white transition-all"
              />
            </div>

            {/* Status tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
              {(["All", "Won", "Lost", "Cancelled"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setHistoryStatusFilter(st)}
                  className={`flex-1 py-1 px-1.5 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer text-center ${
                    historyStatusFilter === st
                      ? "bg-white text-teal-700 shadow-3xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* History records list */}
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-10 space-y-2 bg-slate-50 rounded-2xl border border-slate-100">
                <Info className="h-6 w-6 text-slate-300 mx-auto" />
                <p className="text-[11px] text-slate-500">No records found matching filters</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredHistory.map((record) => {
                  const isWon = record.status === "Won";
                  const isLost = record.status === "Lost";
                  const isCancelled = record.status === "Cancelled";

                  return (
                    <motion.div
                      key={record.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-150 space-y-2.5"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono font-bold text-slate-400">{record.lotId}</span>
                          <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
                            {record.cropName}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-bold">{record.variety}</p>
                        </div>

                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                          isWon
                            ? "bg-amber-100 border border-amber-200 text-amber-800"
                            : isLost
                            ? "bg-slate-200 border border-slate-300 text-slate-600"
                            : "bg-rose-50 border border-rose-100 text-rose-700"
                        }`}>
                          {record.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-slate-200/60 pt-2 text-slate-500">
                        <div>
                          <span className="block text-[8px] uppercase text-slate-400">Volume & Quality</span>
                          <span className="font-extrabold text-slate-800">
                            {record.quantity} Tons • {record.qualityGrade}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[8px] uppercase text-slate-400">Farmer Sourced</span>
                          <span className="font-extrabold text-slate-700 truncate block">
                            {record.farmerName}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 bg-white rounded-lg border border-slate-150 p-2 text-center text-[10px]">
                        <div>
                          <span className="text-[8px] text-slate-400 block font-bold">Your Bid</span>
                          <span className="font-mono font-bold text-slate-800">₹{record.finalBid.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-slate-400 block font-bold">Market price</span>
                          <span className="font-mono font-bold text-slate-500">₹{record.marketPrice.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-teal-600 block font-bold">Savings Advantage</span>
                          <span className={`font-mono font-extrabold ${isWon ? "text-emerald-600" : "text-slate-400"}`}>
                            {isWon && record.savings > 0 ? `₹${record.savings.toLocaleString()}` : "—"}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono font-medium border-t border-slate-200/40 pt-1.5">
                        <span>Ledge Entry: {record.id}</span>
                        <span>Date: {record.date}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
      </>
      ) : (
        <OrderFulfillmentDesk
          wonOrders={wonOrders}
          setWonOrders={setWonOrders}
          selectedOrderForPayment={selectedOrderForPayment}
          setSelectedOrderForPayment={setSelectedOrderForPayment}
          selectedOrderForLogistics={selectedOrderForLogistics}
          setSelectedOrderForLogistics={setSelectedOrderForLogistics}
          addNotification={addNotification}
        />
      )}
    </div>
  );
}

// Sub-component: Won Orders & Logistics Desk
interface OrderFulfillmentDeskProps {
  wonOrders: WonOrder[];
  setWonOrders: React.Dispatch<React.SetStateAction<WonOrder[]>>;
  selectedOrderForPayment: WonOrder | null;
  setSelectedOrderForPayment: (order: WonOrder | null) => void;
  selectedOrderForLogistics: WonOrder | null;
  setSelectedOrderForLogistics: (order: WonOrder | null) => void;
  addNotification?: (message: string, type: "info" | "success" | "warning" | "bid", lotId?: string) => void;
}

function PaymentDeadlineTimer({ deadline, status }: { deadline: string; status: string }) {
  const [timeLeftStr, setTimeLeftStr] = useState("");

  useEffect(() => {
    if (status === "Paid") {
      setTimeLeftStr("Escrow Locked Successfully");
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const end = new Date(deadline).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeftStr("Overdue (Please Pay Promptly)");
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeftStr(`${h}h ${m}m ${s}s remaining`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [deadline, status]);

  return (
    <span className={`font-mono text-[11px] font-bold ${status === "Paid" ? "text-emerald-600" : "text-rose-600 animate-pulse"}`}>
      ⏰ {timeLeftStr}
    </span>
  );
}

function OrderFulfillmentDesk({
  wonOrders,
  setWonOrders,
  selectedOrderForPayment,
  setSelectedOrderForPayment,
  selectedOrderForLogistics,
  setSelectedOrderForLogistics,
  addNotification
}: OrderFulfillmentDeskProps) {
  const [selectedTransport, setSelectedTransport] = useState("Standard Freight Logistics");
  const [selectedDate, setSelectedDate] = useState("2026-07-08");
  const [selectedTime, setSelectedTime] = useState("10:00");
  const [selectedWarehouse, setSelectedWarehouse] = useState("Adani Agri-Logistics Terminal (Moga)");

  // Payment Form State
  const [paymentBank, setPaymentBank] = useState("State Bank of India Corporate");
  const [paymentPin, setPaymentPin] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForPayment) return;
    setIsPaying(true);

    setTimeout(() => {
      const orderId = selectedOrderForPayment.id;
      setWonOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === orderId
            ? { ...o, paymentStatus: "Paid", orderConfirmationNumber: `CONF-${o.lotId.split("-")[1] || "9102"}-${Math.random().toString(36).substring(2, 5).toUpperCase()}` }
            : o
        )
      );
      setIsPaying(false);
      setSelectedOrderForPayment(null);
      setPaymentPin("");

      if (addNotification) {
        addNotification(`💳 Escrow payment secured for ${selectedOrderForPayment.cropName}! Total rate has been locked in Gov Escrow, pending delivery.`, "success", selectedOrderForPayment.lotId);
      }
    }, 1500);
  };

  const handleProcessScheduling = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForLogistics) return;

    // Generate random but realistic driver details
    const drivers = [
      { name: "Gurpreet Singh Dhillon", phone: "+91 94142 83012", vehicle: "PB-12-FG-7431" },
      { name: "Vikramaditya Rao", phone: "+91 98451 20491", vehicle: "HR-26-Y-9012" },
      { name: "Rajesh Malhotra", phone: "+91 91108 53401", vehicle: "HP-10-AJ-4028" },
      { name: "Sohan Singh Brar", phone: "+91 99120 48210", vehicle: "PB-10-CH-4821" }
    ];
    const pickedDriver = drivers[Math.floor(Math.random() * drivers.length)];

    setWonOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.id === selectedOrderForLogistics.id
          ? {
              ...o,
              pickupStatus: "Scheduled",
              pickupDetails: {
                modeOfTransport: selectedTransport,
                pickupDate: selectedDate,
                pickupTime: selectedTime,
                driverName: pickedDriver.name,
                driverPhone: pickedDriver.phone,
                vehicleNumber: pickedDriver.vehicle,
                targetWarehouse: selectedWarehouse
              }
            }
          : o
      )
    );

    setSelectedOrderForLogistics(null);

    if (addNotification) {
      addNotification(`🚚 Pickup scheduled for ${selectedOrderForLogistics.cropName}! Transport: ${selectedTransport}. Driver ${pickedDriver.name} dispatched on ${selectedDate}.`, "success", selectedOrderForLogistics.lotId);
    }
  };

  const handleSimulateTransit = (orderId: string, nextStatus: "In Transit" | "Delivered") => {
    setWonOrders((prevOrders) =>
      prevOrders.map((o) => (o.id === orderId ? { ...o, pickupStatus: nextStatus } : o))
    );

    if (addNotification) {
      const order = wonOrders.find((o) => o.id === orderId);
      const name = order ? order.cropName : "Crop shipment";
      addNotification(`📦 Logistics SLA Update: ${name} (${orderId}) status is now "${nextStatus}"!`, "info");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300" id="buyer-orders-fullfillment">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-3">
        <div>
          <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-teal-600" />
            Won Bids & Sourced Orders Checkout Desk
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Securely complete payment into Gov-Escrow within 24 hours of auction close, and schedule farm-gate cargo collection.
          </p>
        </div>
        <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-800 font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5 self-start md:self-center">
          <ShieldCheck className="h-4 w-4 text-amber-600 animate-pulse" /> SECURITY PROTOCOL ACTIVE
        </span>
      </div>

      {wonOrders.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 border border-slate-250 border-dashed rounded-3xl space-y-3.5">
          <ShoppingCart className="h-12 w-12 text-slate-300 mx-auto animate-bounce" />
          <h4 className="text-xs font-black uppercase text-slate-700">No Won Auctions Sourced</h4>
          <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed">
            When you win any active auction in the Bids Workspace (or click "Simulate Win"), a dedicated secure procurement contract is created here instantly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Main Orders List */}
          <div className="xl:col-span-8 space-y-4">
            {wonOrders.map((order) => {
              const isPaid = order.paymentStatus === "Paid";
              const isScheduled = order.pickupStatus !== "Unscheduled";
              const totalCost = order.quantity * order.finalBidAmount;

              return (
                <div
                  key={order.id}
                  className={`bg-white border rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-all ${
                    isPaid && isScheduled ? "border-emerald-250 bg-emerald-50/5" : "border-slate-150"
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-200/60 px-1.8 py-0.5 rounded border border-slate-300">
                          {order.id}
                        </span>
                        <h3 className="text-xs font-black text-slate-800">{order.cropName}</h3>
                        <span className="text-slate-300">•</span>
                        <span className="text-[10px] text-slate-500 font-bold">{order.variety}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                        <span>Lot Ref: {order.lotId}</span>
                        <span>•</span>
                        <span>Farmer: {order.farmerName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg flex items-center gap-1 border ${
                        isPaid
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                          : "bg-amber-50 border-amber-200 text-amber-800 animate-pulse"
                      }`}>
                        <CreditCard className="h-3 w-3" />
                        {isPaid ? "Escrow Paid" : "Pending Payment"}
                      </span>

                      <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg flex items-center gap-1 border ${
                        order.pickupStatus === "Delivered"
                          ? "bg-teal-50 border-teal-200 text-teal-800"
                          : order.pickupStatus === "In Transit"
                          ? "bg-indigo-50 border-indigo-200 text-indigo-800 animate-pulse"
                          : order.pickupStatus === "Scheduled"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                          : "bg-slate-100 border-slate-200 text-slate-600"
                      }`}>
                        <Truck className="h-3 w-3" />
                        {order.pickupStatus === "Unscheduled" ? "Logistics Pending" : `${order.pickupStatus}`}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-5">
                    {/* Left Cost Details */}
                    <div className="md:col-span-4 space-y-3">
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                        <span className="text-[8px] uppercase font-black text-slate-400 block tracking-wider">Quantity Sourced</span>
                        <span className="text-base font-black text-slate-800 font-mono">{order.quantity} Tons</span>
                        <span className="text-[10px] text-slate-500 block font-medium mt-0.5">{order.qualityGrade}</span>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                        <span className="text-[8px] uppercase font-black text-slate-400 block tracking-wider">Total Escrow Value</span>
                        <span className="text-base font-black text-teal-700 font-mono">₹{totalCost.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-450 block font-semibold mt-0.5">₹{order.finalBidAmount.toLocaleString()} / ton</span>
                      </div>
                    </div>

                    {/* Right Tracking & Actions details */}
                    <div className="md:col-span-8 flex flex-col justify-between space-y-4">
                      {/* Deadline Countdown banner */}
                      {!isPaid ? (
                        <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-black uppercase text-rose-800 tracking-wide block">24-Hour Escrow Payment Link</span>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Secure payment is required under SLA. Failure releases contract to secondary bidders.</p>
                          </div>
                          <div className="shrink-0 bg-white border border-rose-100 p-1.5 px-3 rounded-lg text-center shadow-3xs self-start sm:self-center">
                            <PaymentDeadlineTimer deadline={order.paymentDeadline} status={order.paymentStatus} />
                          </div>
                        </div>
                      ) : (
                        <div className="bg-emerald-50/30 border border-emerald-150 rounded-xl p-3.5 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wide flex items-center gap-1">
                              <CheckCircle className="h-4 w-4 text-emerald-600" /> Escrow Contract Locked
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 bg-white border border-emerald-100 rounded px-1.5 py-0.5 font-bold">
                              {order.orderConfirmationNumber}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            Payment of <strong>₹{totalCost.toLocaleString()}</strong> is fully secured in escrow ledger wallet. Funds will release to farmer <strong>{order.farmerName}</strong> immediately upon gate logistics clearance.
                          </p>
                        </div>
                      )}

                      {/* Display pickup details if scheduled */}
                      {isScheduled && order.pickupDetails && (
                        <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-medium text-slate-700">
                          <div>
                            <span className="text-[8px] uppercase text-slate-400 block font-black mb-0.5">Carrier Type</span>
                            <span className="font-extrabold text-slate-800 block truncate">{order.pickupDetails.modeOfTransport}</span>
                          </div>
                          <div>
                            <span className="text-[8px] uppercase text-slate-400 block font-black mb-0.5">Pickup Window</span>
                            <span className="font-extrabold text-amber-700 block truncate">
                              {order.pickupDetails.pickupDate} at {order.pickupDetails.pickupTime}
                            </span>
                          </div>
                          <div>
                            <span className="text-[8px] uppercase text-slate-400 block font-black mb-0.5">Driver & Phone</span>
                            <span className="font-bold text-slate-800 block truncate">{order.pickupDetails.driverName}</span>
                            <span className="text-[9px] text-slate-400 font-mono block">{order.pickupDetails.driverPhone}</span>
                          </div>
                          <div>
                            <span className="text-[8px] uppercase text-slate-400 block font-black mb-0.5">Vehicle License</span>
                            <span className="font-bold font-mono text-[10px] text-slate-900 bg-slate-200/60 px-1.5 py-0.5 rounded border border-slate-300 block w-fit">
                              {order.pickupDetails.vehicleNumber}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-end pt-2 border-t border-slate-100">
                        {!isPaid && (
                          <button
                            type="button"
                            onClick={() => setSelectedOrderForPayment(order)}
                            className="w-full sm:w-auto px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-black uppercase tracking-wide flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                          >
                            <CreditCard className="h-4 w-4" />
                            Pay Sourcing Rate via Escrow
                          </button>
                        )}

                        {isPaid && !isScheduled && (
                          <button
                            type="button"
                            onClick={() => setSelectedOrderForLogistics(order)}
                            className="w-full sm:w-auto px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-black uppercase tracking-wide flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer animate-pulse"
                          >
                            <Truck className="h-4 w-4" />
                            Schedule Authorized Pickup
                          </button>
                        )}

                        {isPaid && isScheduled && (
                          <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                            {order.pickupStatus === "Scheduled" && (
                              <button
                                type="button"
                                onClick={() => handleSimulateTransit(order.id, "In Transit")}
                                className="px-3.5 py-1.8 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase rounded-lg transition-all cursor-pointer shadow-3xs flex items-center gap-1"
                              >
                                <Play className="h-3 w-3" /> Simulate Dispatch
                              </button>
                            )}
                            {order.pickupStatus === "In Transit" && (
                              <button
                                type="button"
                                onClick={() => handleSimulateTransit(order.id, "Delivered")}
                                className="px-3.5 py-1.8 bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-black uppercase rounded-lg transition-all cursor-pointer shadow-3xs flex items-center gap-1"
                              >
                                <Check className="h-3 w-3" /> Confirm Gate Delivery Scan
                              </button>
                            )}
                            {order.pickupStatus === "Delivered" && (
                              <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg font-black uppercase flex items-center gap-1">
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Completed & Disbursed
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right sidebar info panel */}
          <div className="xl:col-span-4 space-y-5">
            {/* Gate Pass Display for Scheduled Bids */}
            {wonOrders.some(o => o.pickupStatus !== "Unscheduled") ? (
              (() => {
                const activeScheduled = wonOrders.find(o => o.pickupStatus !== "Unscheduled");
                if (!activeScheduled || !activeScheduled.pickupDetails) return null;

                return (
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4">
                    <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                      <QrCode className="h-4.5 w-4.5 text-teal-600" />
                      Dynamic Gate-Pass Token
                    </h3>

                    <div className="p-4 bg-slate-900 text-slate-100 rounded-xl flex flex-col items-center space-y-4 relative overflow-hidden">
                      {/* Scan laser animation line */}
                      <div className="absolute left-0 top-0 w-full h-1 bg-teal-500/80 animate-bounce shadow-[0_0_10px_#14b8a6]" />

                      <span className="text-[8px] tracking-widest text-teal-400 font-mono uppercase bg-teal-500/15 px-2 py-0.5 rounded border border-teal-500/20">
                        Scan at Farm Entrance Gate
                      </span>

                      {/* Grid QR Mock */}
                      <div className="bg-white p-3 rounded-xl shadow-inner border border-teal-500">
                        <div className="grid grid-cols-6 gap-0.8 w-24 h-24">
                          {Array.from({ length: 36 }).map((_, i) => (
                            <div
                              key={i}
                              className={`rounded-xs ${
                                (i % 2 === 0 && i % 3 !== 0) || (i > 6 && i < 14) || i === 0 || i === 5 || i === 30 || i === 35
                                  ? "bg-slate-900"
                                  : "bg-transparent"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="text-center space-y-1 w-full border-t border-slate-800 pt-3 text-[10px]">
                        <p className="font-mono text-slate-400 uppercase tracking-wider font-bold">Authorized Cargo Code</p>
                        <p className="font-extrabold text-[11px] text-teal-400 font-mono">{activeScheduled.orderConfirmationNumber}</p>
                        <p className="text-slate-400 font-bold">Driver: {activeScheduled.pickupDetails.driverName}</p>
                        <p className="text-slate-500 font-mono">Plate: {activeScheduled.pickupDetails.vehicleNumber}</p>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-[11px] text-amber-900 leading-relaxed space-y-1">
                      <p className="font-black flex items-center gap-1 uppercase tracking-wide text-amber-900">
                        <Info className="h-4 w-4 text-amber-700" /> Carrier Driver Security
                      </p>
                      <p className="text-amber-800 font-medium">
                        Driver {activeScheduled.pickupDetails.driverName} must present this encrypted token to farmer <strong>{activeScheduled.farmerName}</strong> to authorize secure loading and logging on the national agricultural ledger.
                      </p>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs text-center space-y-3 py-10">
                <QrCode className="h-10 w-10 text-slate-300 mx-auto" />
                <h4 className="text-xs font-black uppercase text-slate-700">No Gate Pass Active</h4>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Gate passes are generated instantly when you authorize escrow payments and schedule agricultural freight pickup.
                </p>
              </div>
            )}

            {/* Gov-Escrow SLA standard card */}
            <div className="bg-gradient-to-br from-teal-950 to-emerald-950 text-white rounded-2xl p-4.5 shadow-xs space-y-3">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-teal-300 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-teal-400" /> Gov-Escrow Protocol
              </h3>
              <p className="text-[11px] text-teal-100/85 leading-relaxed">
                AgriConnect maintains strict trade assurance safeguards. Funds remain protected inside the Gov-Escrow clearing bank throughout the entire freight collection process. Releasing occurs only upon QR token confirmation.
              </p>
              <div className="border-t border-teal-900/60 pt-2.5 space-y-1.5 text-[10px] text-teal-200/85 font-mono">
                <div className="flex justify-between">
                  <span>Authorized Logistics Fleet</span>
                  <span className="text-teal-400 font-bold">100% SLA Compliant</span>
                </div>
                <div className="flex justify-between">
                  <span>Dispute Resolution Portal</span>
                  <span className="text-teal-400 font-bold">Active 24/7 Helpline</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Escrow Payment Portal Modal */}
      {selectedOrderForPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-100 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in duration-200 text-slate-700">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-800 text-sm flex items-center gap-1.5">
                  <CreditCard className="h-4.5 w-4.5 text-teal-600" />
                  Gov-Escrow Payment Portal
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Order Ref: {selectedOrderForPayment.id}</p>
              </div>
              <button
                onClick={() => setSelectedOrderForPayment(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 rounded-xl p-4 border border-slate-100 font-medium">
              <div className="flex justify-between">
                <span>Crop Variety Sourced:</span>
                <span className="font-extrabold text-slate-800">{selectedOrderForPayment.cropName}</span>
              </div>
              <div className="flex justify-between">
                <span>Quantity Sourced:</span>
                <span className="font-extrabold text-slate-800">{selectedOrderForPayment.quantity} Tons</span>
              </div>
              <div className="flex justify-between">
                <span>Bid rate / Ton:</span>
                <span className="font-extrabold text-slate-800">₹{selectedOrderForPayment.finalBidAmount.toLocaleString()} / Ton</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-extrabold text-teal-900">
                <span>Total Escrow Due:</span>
                <span className="font-mono">₹{(selectedOrderForPayment.quantity * selectedOrderForPayment.finalBidAmount).toLocaleString()}</span>
              </div>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Select Corporate Bank Account
                </label>
                <select
                  value={paymentBank}
                  onChange={(e) => setPaymentBank(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-teal-500 focus:bg-white text-slate-800 font-bold"
                >
                  <option value="State Bank of India Corporate">State Bank of India Corporate (Acc: ***8941)</option>
                  <option value="HDFC Agro-Corporate Card">HDFC Agro-Escrow Clearing Account (Acc: ***4012)</option>
                  <option value="ICICI Trade Finance Wallet">ICICI Escrow Account (Acc: ***9310)</option>
                  <option value="e-Rupee Central Treasury">RBI e-Rupee Corporate Wallet (Bal: ₹15,40,000)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Authorize Escrow Transfer PIN
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••"
                  maxLength={4}
                  value={paymentPin}
                  onChange={(e) => setPaymentPin(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold tracking-widest focus:outline-none focus:border-teal-500 text-slate-800"
                />
                <span className="text-[9px] text-slate-400 mt-1 block">Enter your 4-digit Agri-PIN to authorize clearing bank settlement.</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForPayment(null)}
                  className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPaying}
                  className="flex-1 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-black text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isPaying ? "Authorizing Transfer..." : "Secure Escrow Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logistics Scheduling Modal */}
      {selectedOrderForLogistics && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-100 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in duration-200 text-slate-700">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-800 text-sm flex items-center gap-1.5">
                  <Truck className="h-4.5 w-4.5 text-teal-600" />
                  Schedule Farm-Gate Sourcing Carrier
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Order: {selectedOrderForLogistics.id}</p>
              </div>
              <button
                onClick={() => setSelectedOrderForLogistics(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleProcessScheduling} className="space-y-4 text-xs font-medium text-slate-700">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Agricultural Transport Carrier Service
                </label>
                <select
                  value={selectedTransport}
                  onChange={(e) => setSelectedTransport(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-teal-500 focus:bg-white text-slate-800 font-bold"
                >
                  <option value="Standard Freight Logistics">Standard Freight Logistics (Authorized Open-bed Truck)</option>
                  <option value="Cold-chain Temp-Controlled Reefer">Cold-chain Temp-Controlled Reefer (Preservation Fleet)</option>
                  <option value="Direct Farmer Sourcing Trailer">Direct Farmer Sourcing Trailer (Farmer Co-op Fleet)</option>
                  <option value="Self-Pickup (Tractor / Buyer Carrier)">Self-Pickup (Buyer Designated Vehicle)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-teal-500 focus:bg-white text-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Pickup Hour Window
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-teal-500 focus:bg-white text-slate-800 font-bold"
                  >
                    <option value="09:00">Morning (09:00 - 12:00)</option>
                    <option value="13:00">Afternoon (13:00 - 16:00)</option>
                    <option value="17:00">Evening (17:00 - 20:00)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Destination Silo / Storage Center
                </label>
                <select
                  value={selectedWarehouse}
                  onChange={(e) => setSelectedWarehouse(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-teal-500 focus:bg-white text-slate-800 font-bold"
                >
                  <option value="Adani Agri-Logistics Terminal (Moga)">Adani Agri-Logistics Terminal (Moga, Andhra Pradesh)</option>
                  <option value="NHAI Logistics Hub Silo A (Karnal)">NHAI Logistics Hub Silo A (Karnal, Haryana)</option>
                  <option value="Central Warehousing Depot (Shimla)">Central Warehousing Depot (Shimla, HP)</option>
                  <option value="Private Milling Silo (Delhi NCR)">Private Milling Silo (Delhi NCR)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForLogistics(null)}
                  className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-black text-xs uppercase tracking-wider cursor-pointer"
                >
                  Generate Sourcing Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
