import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  TrendingUp,
  Tag,
  DollarSign,
  Plus,
  Scale,
  Calendar,
  Check,
  Percent,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  BarChart2
} from "lucide-react";
import { MarketBid } from "../../types";
import { CropSellingMarketplace } from "../marketplace/CropSellingMarketplace";
import CropBiddingSystem from "../buyer/CropBiddingSystem";
import BuyerBidManagement from "../buyer/BuyerBidManagement";
import { defaultListings } from "../../data/defaultListings";
import MLPredictionHub from "../analytics/MLPredictionHub";
import ProduceTraceabilityModule from "../analytics/ProduceTraceabilityModule";
import BuyerAuthOnboarding from "../buyer/BuyerAuthOnboarding";
import BuyerVerificationSystem from "../buyer/BuyerVerificationSystem";
import BuyerDashboard from "../buyer/BuyerDashboard";
import BuyerOrderDashboard from "../buyer/BuyerOrderDashboard";
import BuyerLogisticsDashboard from "../buyer/BuyerLogisticsDashboard";
import BuyerQualityVerification from "../buyer/BuyerQualityVerification";
import BuyerAIPricePredictor from "../buyer/BuyerAIPricePredictor";
import BuyerAIChatAssistant from "../buyer/BuyerAIChatAssistant";
import BuyerPaymentDashboard from "../buyer/BuyerPaymentDashboard";
import BuyerAnalyticsDashboard from "../buyer/BuyerAnalyticsDashboard";
import BuyerProfileSettings from "../buyer/BuyerProfileSettings";

interface BuyerViewProps {
  bids: MarketBid[];
  onAddBid: (newBid: MarketBid) => void;
  onUpdateBid: (id: string, updated: Partial<MarketBid>) => void;
}

export default function BuyerView({ bids, onAddBid, onUpdateBid }: BuyerViewProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("agriconnect_buyer_auth") === "true";
  });

  const [buyerTab, setBuyerTab] = useState<"dashboard" | "exchange" | "bidding" | "procurement" | "traceability" | "verification" | "orders" | "logistics" | "quality" | "predictor" | "assistant" | "payments" | "analytics" | "profile">("dashboard");
  const [cropType, setCropType] = useState("Premium Basmati Rice");
  const [quantity, setQuantity] = useState(15);
  const [quality, setQuality] = useState<"Grade A" | "Grade B" | "Grade C">("Grade A");
  const [pricePerTon, setPricePerTon] = useState(650);
  const [triggerUpdate, setTriggerUpdate] = useState(0);

  // Lifted Auction States for Live Sync between Exchange & Bid Desk
  const [listings, setListings] = useState<any[]>(() => {
    const saved = localStorage.getItem("agriconnect_live_listings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return defaultListings;
  });

  const [watchedLots, setWatchedLots] = useState<string[]>(["LOT-9102", "LOT-5123"]);

  const [autoBidLimits, setAutoBidLimits] = useState<Record<string, number>>({
    "LOT-9102": 75000
  });

  const [notifications, setNotifications] = useState<any[]>([
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

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem("agriconnect_live_listings", JSON.stringify(listings));
  }, [listings]);

  const addNotification = (message: string, type: "info" | "success" | "warning" | "bid", lotId?: string) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      message,
      time: "Just now",
      type,
      lotId
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 8)]);
  };

  // Live Countdown Loop
  useEffect(() => {
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
  }, []);

  // Automated competing bidder simulation to showcase auto-bidding & watchlists live!
  useEffect(() => {
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

              // Update user's active bids map in localStorage
              const savedActiveBids = localStorage.getItem("agriconnect_user_active_bids");
              if (savedActiveBids) {
                try {
                  const parsed = JSON.parse(savedActiveBids);
                  parsed[item.id] = userAutoCounterAmount;
                  localStorage.setItem("agriconnect_user_active_bids", JSON.stringify(parsed));
                } catch (e) {
                  // ignore
                }
              }
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

          const updatedLot = {
            ...item,
            currentHighestBid: updatedHighestBid,
            bidCount: updatedCount,
            bidsHistory: history
          };

          return updatedLot;
        });
      });
    }, 14000);

    return () => clearInterval(rivalBidder);
  }, [listings, autoBidLimits, watchedLots]);

  const handleOnboardingComplete = (data: any) => {
    localStorage.setItem("agriconnect_buyer_auth", "true");
    localStorage.setItem("agriconnect_buyer_data", JSON.stringify(data));
    setIsAuthenticated(true);
  };

  const handleVerificationChange = () => {
    setTriggerUpdate((prev) => prev + 1);
  };

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    const buyerDataStr = localStorage.getItem("agriconnect_buyer_data");
    const buyerName = buyerDataStr ? JSON.parse(buyerDataStr).businessName : "Global Agrifood Corp (Procurement)";
    
    const newBid: MarketBid = {
      id: `bid-${Date.now()}`,
      cropType,
      quantity,
      quality,
      pricePerTon,
      buyerName: buyerName || "Global Agrifood Corp (Procurement)",
      status: "Active",
      date: new Date().toLocaleDateString()
    };
    onAddBid(newBid);
  };

  if (!isAuthenticated) {
    return <BuyerAuthOnboarding onComplete={handleOnboardingComplete} />;
  }

  const buyerDataStr = localStorage.getItem("agriconnect_buyer_data");
  const buyerName = buyerDataStr ? JSON.parse(buyerDataStr).businessName : "Global Agrifood Corp";
  const buyerData = buyerDataStr ? JSON.parse(buyerDataStr) : null;
  const verificationProgress = buyerData?.verificationProgress;

  // Calculate dynamic trust score and badge level for banner
  const getTrustScoreInfo = () => {
    if (!verificationProgress) {
      return { score: 350, badge: "Bronze Trader", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    }
    let score = 350;
    if (verificationProgress.emailVerified) score += 100;
    if (verificationProgress.mobileVerified) score += 100;
    if (verificationProgress.gstVerified) score += 250;
    if (verificationProgress.bankVerified) score += 100;
    if (verificationProgress.creditVerified) score += 100;

    if (
      verificationProgress.emailVerified &&
      verificationProgress.mobileVerified &&
      verificationProgress.gstVerified &&
      verificationProgress.bankVerified &&
      verificationProgress.creditVerified
    ) {
      score = 1000;
    }

    let badge = "Bronze Trader";
    let color = "text-amber-400 bg-amber-500/10 border-amber-500/20";

    if (score === 1000) {
      badge = "Elite Diamond";
      color = "text-cyan-300 bg-cyan-500/20 border-cyan-500/30 animate-pulse";
    } else if (score >= 700) {
      badge = "Corporate Gold";
      color = "text-yellow-300 bg-yellow-500/20 border-yellow-500/30";
    } else if (score >= 500) {
      badge = "Silver Partner";
      color = "text-slate-300 bg-slate-500/20 border-slate-500/30";
    }

    return { score, badge, color };
  };

  const { score: currentTrustScore, badge: currentBadge, color: currentBadgeColor } = getTrustScoreInfo();

  return (
    <div id="buyer-workspace" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-cyan-900 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-700/50 rounded-xl">
              <ShoppingBag className="h-6 w-6 text-teal-200" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Commodity Procurement Board</h2>
          </div>
          <p className="text-teal-100/90 text-xs max-w-xl">
            Acquire premium harvests directly from verified smallholder farms and agricultural cooperatives. Secure smart contracts, audit quality compliance, and review automated pricing algorithms.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
            <div className="text-center">
              <p className="text-[8px] text-teal-200 uppercase tracking-widest font-extrabold font-mono flex items-center justify-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-300" />
                Badge Level
              </p>
              <span className={`inline-block text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full mt-0.5 border ${currentBadgeColor}`}>
                🛡️ {currentBadge}
              </span>
            </div>
            <div className="border-l border-white/10 h-8 self-center" />
            <div className="text-left">
              <p className="text-[9px] text-teal-200 uppercase tracking-widest font-bold">Trust Score</p>
              <p className="text-sm font-extrabold font-mono">{currentTrustScore} / 1000</p>
            </div>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 text-center">
            <p className="text-[10px] text-teal-200 uppercase tracking-widest font-semibold">Total Escrow</p>
            <p className="text-lg font-bold">$124,500</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("agriconnect_buyer_auth");
              setIsAuthenticated(false);
            }}
            className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/25 text-rose-300 font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Tabs Navigator */}
      <div className="flex border-b border-slate-200 overflow-x-auto whitespace-nowrap">
        <button
          type="button"
          onClick={() => setBuyerTab("dashboard")}
          className={`pb-3 text-xs font-black uppercase tracking-wider border-b-2 px-6 cursor-pointer transition-all ${
            buyerTab === "dashboard"
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          🏪 Buyer Dashboard
        </button>
        <button
          type="button"
          onClick={() => setBuyerTab("orders")}
          className={`pb-3 text-xs font-black uppercase tracking-wider border-b-2 px-6 cursor-pointer transition-all ${
            buyerTab === "orders"
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          📦 Order Dashboard
        </button>
        <button
          type="button"
          onClick={() => setBuyerTab("payments")}
          className={`pb-3 text-xs font-black uppercase tracking-wider border-b-2 px-6 cursor-pointer transition-all ${
            buyerTab === "payments"
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          💳 Payments & Finances
        </button>
        <button
          type="button"
          onClick={() => setBuyerTab("analytics")}
          className={`pb-3 text-xs font-black uppercase tracking-wider border-b-2 px-6 cursor-pointer transition-all ${
            buyerTab === "analytics"
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          📊 Sourcing Analytics
        </button>
        <button
          type="button"
          onClick={() => setBuyerTab("logistics")}
          className={`pb-3 text-xs font-black uppercase tracking-wider border-b-2 px-6 cursor-pointer transition-all ${
            buyerTab === "logistics"
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          🚚 Logistics & Pickup
        </button>
        <button
          type="button"
          onClick={() => setBuyerTab("quality")}
          className={`pb-3 text-xs font-black uppercase tracking-wider border-b-2 px-6 cursor-pointer transition-all ${
            buyerTab === "quality"
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          🧪 Quality & Refunds
        </button>
        <button
          type="button"
          onClick={() => setBuyerTab("predictor")}
          className={`pb-3 text-xs font-black uppercase tracking-wider border-b-2 px-6 cursor-pointer transition-all ${
            buyerTab === "predictor"
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          🤖 AI Price Predictor
        </button>
        <button
          type="button"
          onClick={() => setBuyerTab("assistant")}
          className={`pb-3 text-xs font-black uppercase tracking-wider border-b-2 px-6 cursor-pointer transition-all ${
            buyerTab === "assistant"
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          💬 AI Chat Assistant
        </button>
        <button
          type="button"
          onClick={() => setBuyerTab("exchange")}
          className={`pb-3 text-xs font-black uppercase tracking-wider border-b-2 px-6 cursor-pointer transition-all ${
            buyerTab === "exchange"
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          🌾 Crop Selling Exchange
        </button>
        <button
          type="button"
          onClick={() => setBuyerTab("bidding")}
          className={`pb-3 text-xs font-black uppercase tracking-wider border-b-2 px-6 cursor-pointer transition-all ${
            buyerTab === "bidding"
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          📋 Bid Management Desk
        </button>
        <button
          type="button"
          onClick={() => setBuyerTab("procurement")}
          className={`pb-3 text-xs font-black uppercase tracking-wider border-b-2 px-6 cursor-pointer transition-all ${
            buyerTab === "procurement"
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          🛒 Procurement Intent Board
        </button>
        <button
          type="button"
          onClick={() => setBuyerTab("traceability")}
          className={`pb-3 text-xs font-black uppercase tracking-wider border-b-2 px-6 cursor-pointer transition-all ${
            buyerTab === "traceability"
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          🔍 Produce Traceability Portal
        </button>
        <button
          type="button"
          onClick={() => setBuyerTab("verification")}
          className={`pb-3 text-xs font-black uppercase tracking-wider border-b-2 px-6 cursor-pointer transition-all ${
            buyerTab === "verification"
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          🛡️ Verification & Trust
        </button>
        <button
          type="button"
          onClick={() => setBuyerTab("profile")}
          className={`pb-3 text-xs font-black uppercase tracking-wider border-b-2 px-6 cursor-pointer transition-all ${
            buyerTab === "profile"
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          ⚙️ Profile & Settings
        </button>
      </div>

      {buyerTab === "profile" && (
        <BuyerProfileSettings />
      )}

      {buyerTab === "dashboard" && (
        <BuyerDashboard bids={bids} onAddBid={onAddBid} onUpdateBid={onUpdateBid} onNavigate={(tab) => setBuyerTab(tab)} />
      )}

      {buyerTab === "orders" && (
        <BuyerOrderDashboard />
      )}

      {buyerTab === "payments" && (
        <BuyerPaymentDashboard />
      )}

      {buyerTab === "analytics" && (
        <BuyerAnalyticsDashboard />
      )}

      {buyerTab === "logistics" && (
        <BuyerLogisticsDashboard />
      )}

      {buyerTab === "quality" && (
        <BuyerQualityVerification />
      )}

      {buyerTab === "exchange" && (
        <CropBiddingSystem
          bids={bids}
          onAddBid={onAddBid}
          listings={listings}
          setListings={setListings}
          watchedLots={watchedLots}
          setWatchedLots={setWatchedLots}
          autoBidLimits={autoBidLimits}
          setAutoBidLimits={setAutoBidLimits}
          notifications={notifications}
          setNotifications={setNotifications}
        />
      )}

      {buyerTab === "bidding" && (
        <BuyerBidManagement
          listings={listings}
          setListings={setListings}
          autoBidLimits={autoBidLimits}
          setAutoBidLimits={setAutoBidLimits}
          addNotification={addNotification}
        />
      )}

      {buyerTab === "procurement" && (
        <>
          {/* Main Grid: Bid Submission & Active Contracts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Create Bid Form */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <Plus className="h-4.5 w-4.5 text-teal-600" />
            Create Procurement Intent
          </h3>

          <form onSubmit={handlePlaceBid} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Crop Variety</label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 focus:bg-white transition-colors font-medium text-slate-800"
              >
                <option value="Premium Basmati Rice">Premium Basmati Rice</option>
                <option value="Non-GMO Corn / Maize">Non-GMO Corn / Maize</option>
                <option value="Soft Red Winter Wheat">Soft Red Winter Wheat</option>
                <option value="Organic Soybean Seed">Organic Soybean Seed</option>
                <option value="Arabica Coffee Bean">Arabica Coffee Bean</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Quantity</label>
                <div className="relative">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-10 py-2.5 text-xs focus:outline-none focus:border-teal-500"
                  />
                  <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-bold">TONS</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Quality Grade</label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500"
                >
                  <option value="Grade A">Grade A (Premium)</option>
                  <option value="Grade B">Grade B (Standard)</option>
                  <option value="Grade C">Grade C (Industrial)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Offered Price</label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-xs">$</span>
                <input
                  type="number"
                  value={pricePerTon}
                  onChange={(e) => setPricePerTon(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-12 py-2.5 text-xs focus:outline-none focus:border-teal-500"
                />
                <span className="absolute right-3.5 top-2.5 text-[10px] text-slate-400 font-bold">/ TON</span>
              </div>
            </div>

            <button
              id="buyer-submit-bid-btn"
              type="submit"
              className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              <DollarSign className="h-4 w-4" />
              Publish Escrow Contract
            </button>
          </form>
        </div>

        {/* Active Market Contracts List */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <Scale className="h-4.5 w-4.5 text-teal-600" />
              Active Procurement Lots & Escrow Bids
            </h3>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
              SLA Compliant
            </span>
          </div>

          <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
            {bids.map((bid) => (
              <div key={bid.id} className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-teal-200 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-800">{bid.cropType}</h4>
                    <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                      bid.quality === "Grade A" ? "bg-emerald-50 text-emerald-700" : bid.quality === "Grade B" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"
                    }`}>
                      {bid.quality}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1.5">
                    <span>Buyer: {bid.buyerName}</span>
                    <span className="text-slate-300">•</span>
                    <span>Quantity: {bid.quantity} Tons</span>
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Offered Rate</p>
                    <p className="text-sm font-extrabold text-slate-800">${bid.pricePerTon} <span className="text-[10px] text-slate-400 font-normal">/ton</span></p>
                  </div>

                  <div className="flex items-center gap-2">
                    {bid.status === "Active" ? (
                      <>
                        <button
                          onClick={() => onUpdateBid(bid.id, { status: "Accepted" })}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <Check className="h-3 w-3" />
                          Accept Contract
                        </button>
                        <button
                          onClick={() => onUpdateBid(bid.id, { status: "Countered", pricePerTon: Math.round(bid.pricePerTon * 1.05) })}
                          className="px-2.5 py-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded text-[10px] font-bold cursor-pointer transition-all"
                        >
                          Counter Offer
                        </button>
                      </>
                    ) : (
                      <span className={`px-2 py-1 text-[10px] font-bold rounded ${
                        bid.status === "Accepted" ? "bg-emerald-50 text-emerald-800" : bid.status === "Countered" ? "bg-amber-50 text-amber-800" : "bg-slate-200 text-slate-500"
                      }`}>
                        {bid.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demand & Pricing Forecast Section */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
          <TrendingUp className="h-4.5 w-4.5 text-teal-600" />
          AI Agricultural Demand and Price Prognosis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-150">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase">Basmati Rice Index</h4>
            <div className="flex items-baseline gap-1.5 mt-2">
              <p className="text-xl font-extrabold text-slate-800">$640</p>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center">
                <TrendingUp className="h-3 w-3" /> +4.2%
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">Strong regional monsoon disruptions limiting short-term stocks.</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-150">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase">Non-GMO Maize Index</h4>
            <div className="flex items-baseline gap-1.5 mt-2">
              <p className="text-xl font-extrabold text-slate-800">$310</p>
              <span className="text-[10px] text-rose-500 font-bold flex items-center">
                <TrendingDown className="h-3 w-3" /> -1.8%
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">Harvest yields stabilizing after bumper crop supplies in Brazil.</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-150">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase">Arabica Coffee Index</h4>
            <div className="flex items-baseline gap-1.5 mt-2">
              <p className="text-xl font-extrabold text-slate-800">$1,850</p>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center">
                <TrendingUp className="h-3 w-3" /> +12.5%
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">Severe frost outbreaks restricting export yields in major highlands.</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl border border-teal-100 flex flex-col justify-between">
            <div>
              <h4 className="text-[10px] font-bold text-teal-800 uppercase tracking-wide flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Market Health Protocol
              </h4>
              <p className="text-[10px] text-teal-900 mt-1.5 leading-relaxed">
                Escrow system locks funds, releasing automatically upon drone quality scan confirmation at delivery port.
              </p>
            </div>
            <div className="text-[9px] text-teal-700/80 font-bold uppercase mt-2">Verified SLA Standards Active</div>
          </div>
        </div>
      </div>
    </>
      )}

      {buyerTab === "traceability" && (
        <ProduceTraceabilityModule userRole="Buyer" />
      )}

      {buyerTab === "verification" && (
        <BuyerVerificationSystem onVerificationUpdate={handleVerificationChange} />
      )}

      {buyerTab === "predictor" && (
        <BuyerAIPricePredictor />
      )}

      {buyerTab === "assistant" && (
        <BuyerAIChatAssistant />
      )}

      {/* Dynamic ML Co-Pilot Suite */}
      <MLPredictionHub currentPhase="Buyer" />
</div>
  );
}
