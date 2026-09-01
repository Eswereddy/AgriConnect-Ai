import React, { useState, useMemo, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Percent,
  Shield,
  Briefcase,
  Layers,
  Calculator,
  Activity,
  Award,
  BookOpen,
  Info,
  DollarSign,
  Plus,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  HelpCircle,
  FileText,
  AlertCircle,
  Clock,
  RefreshCw,
  Coins,
  Check,
  Play,
  Trash2,
  BookMarked
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Legend
} from "recharts";

interface Commodity {
  ticker: string;
  name: string;
  exchange: "NCDEX" | "MCX";
  spotPrice: number;
  futuresPrice: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  marginRequirement: number; // percentage
  lotSize: number; // e.g. 10 Metric Tons
}

interface ForwardContract {
  id: string;
  commodity: string;
  deliveryDate: string;
  contractPrice: number;
  volumeTons: number;
  buyer: string;
  status: "Active Guaranteed" | "Settled" | "Pending Verification";
}

interface OptionContract {
  id: string;
  commodity: string;
  type: "Put" | "Call";
  strikePrice: number;
  premium: number;
  expiration: string;
  lotSizeTons: number;
  hedgedStatus: string;
}

interface ActiveTrade {
  id: string;
  commodity: string;
  type: "Buy Futures" | "Sell Futures";
  entryPrice: number;
  currentPrice: number;
  lots: number;
  marginLocked: number;
  pnl: number;
}

interface ClosedTrade {
  id: string;
  commodity: string;
  type: string;
  entryPrice: number;
  exitPrice: number;
  lots: number;
  realizedPnl: number;
  timestamp: string;
}

interface MandiSpotPrice {
  mandiName: string;
  state: string;
  spotPrice: number;
  basis: number; // Spot - Futures
  arrivalVolume: number; // Tons
}

export default function AgriculturalCommodityExchange() {
  // --- EXCHANGE SYSTEM STATES ---
  const [activeTab, setActiveTab] = useState<"futures" | "options" | "forwards" | "spot_mandi" | "portfolio" | "education">("futures");
  const [selectedCommodity, setSelectedCommodity] = useState<string>("BASMATI");
  const [tradeAction, setTradeAction] = useState<"BUY" | "SELL">("BUY");
  const [tradeLots, setTradeLots] = useState<number>(1);
  const [futuresPriceAlert, setFuturesPriceAlert] = useState<number>(3150);
  const [isLiveTicking, setIsLiveTicking] = useState<boolean>(true);

  // Option Builder States
  const [optionType, setOptionType] = useState<"Put" | "Call">("Put");
  const [strikePriceSelection, setStrikePriceSelection] = useState<number>(3100);
  const [optionDuration, setOptionDuration] = useState<string>("3 Months");

  // Portfolio Balance State
  const [marginAccountBalance, setMarginAccountBalance] = useState<number>(150000); // Increased initial margin
  const [lockedMargin, setLockedMargin] = useState<number>(9232);
  const [realizedPnl, setRealizedPnl] = useState<number>(5400);

  // Technical analysis configuration
  const [technicalIndicator, setTechnicalIndicator] = useState<"SMA" | "Bollinger" | "RSI">("SMA");

  // --- COMMODITIES REGISTRY ---
  const [commoditiesList, setCommoditiesList] = useState<Commodity[]>([
    { ticker: "BASMATI", name: "Premium Pusa Basmati 1121", exchange: "NCDEX", spotPrice: 3050, futuresPrice: 3120, changePercent: 1.45, high: 3150, low: 3010, volume: 14200, marginRequirement: 10, lotSize: 10 },
    { ticker: "SOYBEAN", name: "Yellow Soybean Grade-A", exchange: "NCDEX", spotPrice: 4200, futuresPrice: 4250, changePercent: -0.85, high: 4320, low: 4180, volume: 28500, marginRequirement: 8, lotSize: 5 },
    { ticker: "MUSTARD", name: "Mustard Seed Bold Strain", exchange: "NCDEX", spotPrice: 5100, futuresPrice: 5080, changePercent: 0.62, high: 5150, low: 4980, volume: 19800, marginRequirement: 12, lotSize: 5 },
    { ticker: "COTTON", name: "Medium Staple Raw Cotton", exchange: "MCX", spotPrice: 19500, futuresPrice: 19850, changePercent: 2.11, high: 20100, low: 19200, volume: 8400, marginRequirement: 15, lotSize: 2 },
    { ticker: "WHEAT", name: "Sharbati Wheat Grain", exchange: "NCDEX", spotPrice: 2150, futuresPrice: 2180, changePercent: 0.35, high: 2210, low: 2120, volume: 34500, marginRequirement: 6, lotSize: 10 }
  ]);

  // Find active selected commodity
  const currentComp = useMemo(() => {
    return commoditiesList.find(c => c.ticker === selectedCommodity) || commoditiesList[0];
  }, [selectedCommodity, commoditiesList]);

  // Sync Option Strike Price range when selected commodity changes
  useEffect(() => {
    setStrikePriceSelection(currentComp.futuresPrice - 50);
    setFuturesPriceAlert(Math.round(currentComp.futuresPrice * 1.05));
  }, [selectedCommodity]);

  // --- RECHARTS HISTORIC FUTURES SERIES ---
  const historicPriceSeries = useMemo(() => {
    const base = currentComp.futuresPrice;
    const factor = currentComp.ticker === "COTTON" ? 200 : 30;
    
    // Different indicators calculations for rich graphics
    return [
      {
        day: "Mon",
        Price: base - factor * 2,
        Technical_EMA: base - factor * 1.5,
        UpperBand: base - factor * 0.5,
        LowerBand: base - factor * 3.5,
        RSI: 42
      },
      {
        day: "Tue",
        Price: base - factor,
        Technical_EMA: base - factor * 1.2,
        UpperBand: base + factor * 0.2,
        LowerBand: base - factor * 2.8,
        RSI: 48
      },
      {
        day: "Wed",
        Price: base + factor * 0.5,
        Technical_EMA: base - factor * 0.5,
        UpperBand: base + factor * 1.5,
        LowerBand: base - factor * 1.5,
        RSI: 58
      },
      {
        day: "Thu",
        Price: base - factor * 0.2,
        Technical_EMA: base - factor * 0.2,
        UpperBand: base + factor * 1.2,
        LowerBand: base - factor * 1.6,
        RSI: 52
      },
      {
        day: "Fri",
        Price: base + factor * 1.2,
        Technical_EMA: base + factor * 0.4,
        UpperBand: base + factor * 2.5,
        LowerBand: base - factor * 0.3,
        RSI: 64
      },
      {
        day: "Sat",
        Price: base,
        Technical_EMA: base + factor * 0.8,
        UpperBand: base + factor * 1.8,
        LowerBand: base - factor * 1.0,
        RSI: 55
      }
    ];
  }, [currentComp]);

  // --- FORWARD CONTRACTS ---
  const [forwardContracts, setForwardContracts] = useState<ForwardContract[]>([
    { id: "fwd-1", commodity: "Premium Pusa Basmati 1121", deliveryDate: "Sep 20, 2026", contractPrice: 3200, volumeTons: 15, buyer: "APEDA Global Exporters Ltd", status: "Active Guaranteed" },
    { id: "fwd-2", commodity: "Sharbati Wheat Grain", deliveryDate: "Dec 15, 2026", contractPrice: 2250, volumeTons: 30, buyer: "ITC Food Division", status: "Active Guaranteed" }
  ]);

  // --- OPTION CONTRACTS ---
  const [optionsHedges, setOptionsHedges] = useState<OptionContract[]>([
    { id: "opt-1", commodity: "BASMATI", type: "Put", strikePrice: 3100, premium: 85, expiration: "Sep 2026", lotSizeTons: 10, hedgedStatus: "Active Price Floor" },
    { id: "opt-2", commodity: "SOYBEAN", type: "Put", strikePrice: 4200, premium: 120, expiration: "Aug 2026", lotSizeTons: 5, hedgedStatus: "Active Price Floor" }
  ]);

  // --- FUTURES CONTRACTS TRADES ---
  const [activeFuturesTrades, setActiveFuturesTrades] = useState<ActiveTrade[]>([
    { id: "tr-1", commodity: "BASMATI", type: "Buy Futures", entryPrice: 3080, currentPrice: 3120, lots: 2, marginLocked: 6160, pnl: 800 },
    { id: "tr-2", commodity: "MUSTARD", type: "Sell Futures", entryPrice: 5120, currentPrice: 5080, lots: 1, marginLocked: 3072, pnl: 400 }
  ]);

  // --- CLOSED TRADES (HISTORY) ---
  const [closedTradesList, setClosedTradesList] = useState<ClosedTrade[]>([
    { id: "cl-1", commodity: "WHEAT", type: "Buy Futures", entryPrice: 2100, exitPrice: 2150, lots: 4, realizedPnl: 2000, timestamp: "2026-06-25 14:20" },
    { id: "cl-2", commodity: "SOYBEAN", type: "Sell Futures", entryPrice: 4280, exitPrice: 4220, lots: 2, realizedPnl: 1200, timestamp: "2026-06-27 11:45" }
  ]);

  // --- SPOT MANDI COMPARISONS ---
  const mandiSpotPricesList = useMemo<MandiSpotPrice[]>(() => {
    const basePrice = currentComp.spotPrice;
    return [
      { mandiName: "Amritsar Cooperative Mandi", state: "Punjab", spotPrice: basePrice + 10, basis: (basePrice + 10) - currentComp.futuresPrice, arrivalVolume: 1200 },
      { mandiName: "Khanna Grain Market", state: "Punjab", spotPrice: basePrice - 15, basis: (basePrice - 15) - currentComp.futuresPrice, arrivalVolume: 3400 },
      { mandiName: "Indore Agri Yard", state: "Madhya Pradesh", spotPrice: basePrice + 45, basis: (basePrice + 45) - currentComp.futuresPrice, arrivalVolume: 850 },
      { mandiName: "Azadpur APMC Hub", state: "Delhi NCR", spotPrice: basePrice + 90, basis: (basePrice + 90) - currentComp.futuresPrice, arrivalVolume: 2200 },
      { mandiName: "Rajasthan Alwar Yard", state: "Rajasthan", spotPrice: basePrice - 40, basis: (basePrice - 40) - currentComp.futuresPrice, arrivalVolume: 1500 }
    ];
  }, [currentComp]);

  // --- LIVE INTERACTIVE SIMULATOR (TICK FEED) ---
  useEffect(() => {
    if (!isLiveTicking) return;

    const interval = setInterval(() => {
      // 1. Simulate minor fluctuations in all commodities prices
      setCommoditiesList(prevList => {
        return prevList.map(item => {
          const changePercent = (Math.random() - 0.48) * 0.4; // Slightly positive bias
          const spotDiff = (Math.random() - 0.5) * 6;
          const futDiff = (Math.random() - 0.48) * 8;
          
          const newSpot = Math.max(100, Math.round(item.spotPrice + spotDiff));
          const newFut = Math.max(100, Math.round(item.futuresPrice + futDiff));
          
          return {
            ...item,
            spotPrice: newSpot,
            futuresPrice: newFut,
            changePercent: item.changePercent + changePercent,
            high: Math.max(item.high, newFut),
            low: Math.min(item.low, newFut)
          };
        });
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isLiveTicking]);

  // 2. Keep active positions synchronized with the live ticking prices to update real-time P&L
  useEffect(() => {
    setActiveFuturesTrades(prevTrades => {
      let changed = false;
      const updated = prevTrades.map(trade => {
        const matchingCommodity = commoditiesList.find(c => c.ticker === trade.commodity);
        if (matchingCommodity && matchingCommodity.futuresPrice !== trade.currentPrice) {
          changed = true;
          const currentPrice = matchingCommodity.futuresPrice;
          const priceDiff = currentPrice - trade.entryPrice;
          const sizeMultiplier = trade.commodity === "BASMATI" ? 10 : 5; // e.g., lot sizes in tons
          
          // Buy futures profits when price goes up; Sell futures profits when price goes down
          const pnlFactor = trade.type === "Buy Futures" ? 1 : -1;
          const pnl = priceDiff * trade.lots * sizeMultiplier * pnlFactor;

          return {
            ...trade,
            currentPrice,
            pnl: Math.round(pnl)
          };
        }
        return trade;
      });
      return changed ? updated : prevTrades;
    });
  }, [commoditiesList]);

  // --- RISK ASSESSMENT & MARGIN CALCULATIONS ---
  const riskAssessmentModel = useMemo(() => {
    const totalExposure = activeFuturesTrades.reduce((sum, t) => {
      const sizeMultiplier = t.commodity === "BASMATI" ? 10 : 5;
      return sum + (t.lots * sizeMultiplier * t.currentPrice);
    }, 0);

    const totalPremiumPaid = optionsHedges.reduce((sum, o) => sum + o.premium * (o.lotSizeTons / 10), 0);
    const hedgeRatioPercent = totalExposure > 0 ? Math.min(100, Math.round((totalPremiumPaid / totalExposure) * 100)) : 0;

    return {
      totalExposure,
      hedgeRatioPercent,
      riskTier: hedgeRatioPercent >= 15 ? "LOW RISK (Hedged Portfolio)" : totalExposure > 60000 ? "HIGH RISK (High Exposure)" : "MEDIUM RISK (Moderate Exposure)",
      riskTierColor: hedgeRatioPercent >= 15 ? "text-emerald-600 bg-emerald-50 border-emerald-200" : totalExposure > 60000 ? "text-rose-600 bg-rose-50 border-rose-200" : "text-amber-600 bg-amber-50 border-amber-200"
    };
  }, [activeFuturesTrades, optionsHedges]);

  // Margin Estimation for prospective trade
  const prospectiveMarginRequired = useMemo(() => {
    const marginPercent = currentComp.marginRequirement / 100;
    const totalNotionalVal = tradeLots * currentComp.lotSize * currentComp.futuresPrice;
    return Math.round(totalNotionalVal * marginPercent);
  }, [currentComp, tradeLots]);

  // Options premium estimate
  const prospectiveOptionPremium = useMemo(() => {
    const gapRatio = Math.abs(currentComp.spotPrice - strikePriceSelection) / currentComp.spotPrice;
    const basePremium = currentComp.spotPrice * 0.035; // 3.5% base premium
    const durationMultiplier = optionDuration === "1 Month" ? 0.6 : optionDuration === "3 Months" ? 1.0 : 1.6;
    return Math.round((basePremium + (basePremium * gapRatio)) * durationMultiplier);
  }, [currentComp, strikePriceSelection, optionDuration]);

  // Dynamic AI Trading Signals generator based on Selected Crop
  const aiSignalAdvice = useMemo(() => {
    switch (selectedCommodity) {
      case "BASMATI":
        return {
          rating: "STRONG BUY",
          color: "text-emerald-600 bg-emerald-50 border-emerald-200",
          sentiment: "Bullish (84%)",
          target: Math.round(currentComp.futuresPrice * 1.08),
          message: "Strong basmati export demands to Gulf countries and potential dry spells in competing crop belts suggest a major supply strain. Recommended to keep long call options or accumulate spot."
        };
      case "SOYBEAN":
        return {
          rating: "STRONG SELL / PUT HEGDE",
          color: "text-rose-600 bg-rose-50 border-rose-200",
          sentiment: "Bearish (72%)",
          target: Math.round(currentComp.futuresPrice * 0.92),
          message: "Massive record crop production numbers published for South American soy hubs. Supply oversaturation expected at major terminal ports. Buy Put Options immediately at strike ₹4200 to establish a solid price floor."
        };
      case "MUSTARD":
        return {
          rating: "HOLD / NEUTRAL",
          color: "text-amber-600 bg-amber-50 border-amber-200",
          sentiment: "Neutral (51%)",
          target: Math.round(currentComp.futuresPrice * 1.01),
          message: "Localized monsoon rainfall delays in Alwar and Jaipur key belts offset by adequate baseline stockpiles. Avoid taking heavy speculative futures positions. Rely on spot APMC sales."
        };
      case "COTTON":
        return {
          rating: "BUY CALLS",
          color: "text-emerald-600 bg-emerald-50 border-emerald-200",
          sentiment: "Highly Bullish (78%)",
          target: Math.round(currentComp.futuresPrice * 1.06),
          message: "Pest warning reports in certain central states might depress physical cotton gin yields by 12%. Lock in raw supply using standard MCX futures or purchase Call hedges."
        };
      default:
        return {
          rating: "NEUTRAL",
          color: "text-slate-600 bg-slate-50 border-slate-200",
          sentiment: "Stable (50%)",
          target: Math.round(currentComp.futuresPrice * 1.02),
          message: "Favorable soil condition profiles and normal MSP (Minimum Support Price) framework. Focus on local cooperative physical mandi trades."
        };
    }
  }, [selectedCommodity, currentComp]);

  // --- HANDLERS ---
  const handlePlaceFuturesTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (prospectiveMarginRequired > marginAccountBalance) {
      alert("Insufficient free margin in your trade account ledger! Close current open trades or adjust lot sizing.");
      return;
    }

    // Deduct margin from ledger
    setMarginAccountBalance(prev => prev - prospectiveMarginRequired);
    setLockedMargin(prev => prev + prospectiveMarginRequired);

    const newTrade: ActiveTrade = {
      id: "tr-" + Math.floor(Math.random() * 100000),
      commodity: currentComp.ticker,
      type: tradeAction === "BUY" ? "Buy Futures" : "Sell Futures",
      entryPrice: currentComp.futuresPrice,
      currentPrice: currentComp.futuresPrice,
      lots: tradeLots,
      marginLocked: prospectiveMarginRequired,
      pnl: 0
    };

    setActiveFuturesTrades([newTrade, ...activeFuturesTrades]);
    alert(`Success: Futures contract order executed! Locked ${tradeLots} lot(s) of ${currentComp.name} on ${currentComp.exchange} at ₹${currentComp.futuresPrice}/Quintal.`);
  };

  const handlePurchaseOptionHedge = (e: React.FormEvent) => {
    e.preventDefault();
    const totalCost = prospectiveOptionPremium * tradeLots;
    if (totalCost > marginAccountBalance) {
      alert("Insufficient balance to pay options premium! Please decrease the trade size or select a different strike.");
      return;
    }

    setMarginAccountBalance(prev => prev - totalCost);
    setRealizedPnl(prev => prev - totalCost); // Premium is immediately debit

    const newOption: OptionContract = {
      id: "opt-" + Math.floor(Math.random() * 100000),
      commodity: currentComp.ticker,
      type: optionType,
      strikePrice: strikePriceSelection,
      premium: prospectiveOptionPremium,
      expiration: optionDuration === "1 Month" ? "Sep 2026" : optionDuration === "3 Months" ? "Nov 2026" : "Jan 2027",
      lotSizeTons: currentComp.lotSize * tradeLots,
      hedgedStatus: optionType === "Put" ? "Minimum Price Guarantee" : "Ceiling Cap Active"
    };

    setOptionsHedges([newOption, ...optionsHedges]);
    alert(`Success: Option insurance hedge created! Minimum Price Floor of ₹${strikePriceSelection}/Quintal locked. Total premium debit: ₹${totalCost}.`);
  };

  const handleCloseFuturesTrade = (id: string, pnl: number, margin: number) => {
    const targetTrade = activeFuturesTrades.find(t => t.id === id);
    if (!targetTrade) return;

    setActiveFuturesTrades(prev => prev.filter(t => t.id !== id));
    setLockedMargin(prev => prev - margin);
    setMarginAccountBalance(prev => prev + margin + pnl);
    setRealizedPnl(prev => prev + pnl);

    // Save to closed history ledger
    const nowStr = new Date().toISOString().slice(0, 16).replace("T", " ");
    const newClosed: ClosedTrade = {
      id: "cl-" + Math.floor(Math.random() * 10000),
      commodity: targetTrade.commodity,
      type: targetTrade.type,
      entryPrice: targetTrade.entryPrice,
      exitPrice: targetTrade.currentPrice,
      lots: targetTrade.lots,
      realizedPnl: pnl,
      timestamp: nowStr
    };

    setClosedTradesList([newClosed, ...closedTradesList]);
    alert(`Derivatives position settled! Settle Amount returned to account: ₹${(margin + pnl).toLocaleString()} INR.`);
  };

  // --- EDUCATIONAL QUIZ STATE ---
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<string>("");

  const handleQuizSubmit = (selectedOptionIndex: number) => {
    setQuizAnswer(selectedOptionIndex);
    if (selectedOptionIndex === 1) {
      setQuizScore(prev => prev + 1);
      setQuizFeedback("Correct! A Put Option locks in a minimum price floor (Minimum Price Guarantee) for your harvested yield while letting you profit if physical prices surge higher.");
    } else {
      setQuizFeedback("Incorrect. A Put option gives you the right to sell at a guaranteed strike price, acting like a price floor to cushion against severe market crashes.");
    }
  };

  return (
    <div id="agri-commodity-exchange" className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-6">
      
      {/* Title / Banner Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg">
              <Activity className="h-5 w-5 text-indigo-600 animate-pulse" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
              📊 Agricultural Commodity Derivatives & Hedging Exchange
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 font-semibold tracking-wide uppercase">
            Hedge crop price volatility with simplified puts/calls options, spot APMC market integration, and real-time NCDEX price feeds
          </p>
        </div>

        {/* Live account balances */}
        <div className="flex flex-wrap items-center gap-4 bg-slate-900 text-white p-3 rounded-2xl border border-slate-800 shadow-md">
          <div className="text-left font-mono">
            <span className="text-[8px] uppercase text-indigo-400 font-bold block">Available Trade Balance</span>
            <span className="text-sm font-black">₹{marginAccountBalance.toLocaleString()}</span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="text-left font-mono">
            <span className="text-[8px] uppercase text-emerald-400 font-bold block">Realized Hedging P&L</span>
            <span className={`text-sm font-black ${realizedPnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {realizedPnl >= 0 ? "+" : ""}₹{realizedPnl.toLocaleString()}
            </span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="flex items-center gap-1">
            <span className="text-[8px] uppercase text-slate-400 font-bold block">Live Feed</span>
            <button
              onClick={() => setIsLiveTicking(!isLiveTicking)}
              className={`h-5 px-2 rounded text-[10px] font-black uppercase cursor-pointer ${
                isLiveTicking ? "bg-emerald-600 text-white" : "bg-slate-700 text-slate-300"
              }`}
            >
              {isLiveTicking ? "ON" : "OFF"}
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Ticker Feed from NCDEX & MCX */}
      <div className="bg-slate-50 border border-slate-150 rounded-xl p-3">
        <div className="flex justify-between items-center pb-2 border-b border-slate-200 mb-2">
          <div className="flex gap-1.5 items-center">
            <Zap className="h-3.5 w-3.5 text-yellow-500 animate-bounce" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
              Real-Time Derivatives Feed (NCDEX / MCX Exchange Gateway)
            </span>
          </div>
          <span className="text-[9px] font-bold text-indigo-600 animate-pulse">
            ● SIMULATED LIVE TICKERS ACTIVE
          </span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {commoditiesList.map(item => (
            <div
              key={item.ticker}
              onClick={() => setSelectedCommodity(item.ticker)}
              className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                selectedCommodity === item.ticker
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white border-slate-250 text-slate-800 hover:shadow-sm"
              }`}
            >
              <div className="flex justify-between items-start text-[9px] font-black">
                <span>{item.ticker}</span>
                <span className={selectedCommodity === item.ticker ? "text-indigo-200" : "text-slate-400 font-mono"}>
                  {item.exchange}
                </span>
              </div>
              <h5 className="text-[11px] font-extrabold truncate mt-0.5">{item.name}</h5>
              
              <div className="flex justify-between items-baseline mt-1">
                <span className="text-xs font-black font-mono">₹{item.futuresPrice}</span>
                <span className={`text-[9px] font-black flex items-center gap-0.5 ${
                  item.changePercent >= 0
                    ? selectedCommodity === item.ticker ? "text-emerald-200" : "text-emerald-600"
                    : selectedCommodity === item.ticker ? "text-rose-200" : "text-rose-600"
                }`}>
                  {item.changePercent >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {item.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-150 pb-1">
        <button
          onClick={() => setActiveTab("futures")}
          className={`pb-2.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeTab === "futures"
              ? "border-indigo-600 text-indigo-600 font-black"
              : "border-transparent text-slate-400 hover:text-slate-600 font-semibold"
          }`}
        >
          📈 Futures derivatives
        </button>
        <button
          onClick={() => setActiveTab("options")}
          className={`pb-2.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeTab === "options"
              ? "border-indigo-600 text-indigo-600 font-black"
              : "border-transparent text-slate-400 hover:text-slate-600 font-semibold"
          }`}
        >
          🛡️ Puts/Calls Options (Price Floors)
        </button>
        <button
          onClick={() => setActiveTab("spot_mandi")}
          className={`pb-2.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeTab === "spot_mandi"
              ? "border-indigo-600 text-indigo-600 font-black"
              : "border-transparent text-slate-400 hover:text-slate-600 font-semibold"
          }`}
        >
          🏛️ Spot Mandi Integration & Basis
        </button>
        <button
          onClick={() => setActiveTab("forwards")}
          className={`pb-2.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeTab === "forwards"
              ? "border-indigo-600 text-indigo-600 font-black"
              : "border-transparent text-slate-400 hover:text-slate-600 font-semibold"
          }`}
        >
          🤝 Pre-Harvest Forward Contracts
        </button>
        <button
          onClick={() => setActiveTab("portfolio")}
          className={`pb-2.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeTab === "portfolio"
              ? "border-indigo-600 text-indigo-600 font-black"
              : "border-transparent text-slate-400 hover:text-slate-600 font-semibold"
          }`}
        >
          💼 Trade History & Risk Calculator
        </button>
        <button
          onClick={() => setActiveTab("education")}
          className={`pb-2.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeTab === "education"
              ? "border-indigo-600 text-indigo-600 font-black"
              : "border-transparent text-slate-400 hover:text-slate-600 font-semibold"
          }`}
        >
          🎓 Hedging Academy & Quizzes
        </button>
      </div>

      {/* Main Grid containing Live Simulator & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Section: Technical analysis chart & trading lists (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main price chart displaying dynamic indicators */}
          <div className="p-5 bg-slate-50 border border-slate-150 rounded-2xl space-y-3.5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="h-4.5 w-4.5 text-indigo-600 animate-pulse" />
                  Derivative Trend Analyzer (Weekly Technical View)
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold">
                  Analyzing {currentComp.name} ({currentComp.ticker}) on {currentComp.exchange}
                </p>
              </div>

              {/* Technical indicators selector */}
              <div className="flex gap-1.5 bg-white border border-slate-200 p-1 rounded-lg">
                <button
                  onClick={() => setTechnicalIndicator("SMA")}
                  className={`px-2 py-0.5 rounded text-[9px] font-black cursor-pointer transition-all ${
                    technicalIndicator === "SMA" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  50-day SMA
                </button>
                <button
                  onClick={() => setTechnicalIndicator("Bollinger")}
                  className={`px-2 py-0.5 rounded text-[9px] font-black cursor-pointer transition-all ${
                    technicalIndicator === "Bollinger" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Bollinger Bands
                </button>
                <button
                  onClick={() => setTechnicalIndicator("RSI")}
                  className={`px-2 py-0.5 rounded text-[9px] font-black cursor-pointer transition-all ${
                    technicalIndicator === "RSI" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  RSI Osc.
                </button>
              </div>
            </div>

            {/* Recharts chart */}
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historicPriceSeries} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBollinger" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.05}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fontWeight: "bold" }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 10, fontWeight: "bold" }} stroke="#94a3b8" domain={technicalIndicator === "RSI" ? [0, 100] : ["auto", "auto"]} />
                  <Tooltip contentStyle={{ fontSize: 11, fontWeight: "bold" }} />
                  <Legend wrapperStyle={{ fontSize: 10, fontWeight: "bold" }} />
                  
                  {technicalIndicator !== "RSI" ? (
                    <>
                      <Area type="monotone" dataKey="Price" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPrice)" name="Futures Contract Price" />
                      {technicalIndicator === "SMA" && (
                        <Line type="monotone" dataKey="Technical_EMA" stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 4" name="50-Day SMA Support" />
                      )}
                      {technicalIndicator === "Bollinger" && (
                        <>
                          <Line type="monotone" dataKey="UpperBand" stroke="#10b981" strokeWidth={1} strokeDasharray="2 2" name="Bollinger Upper Band" />
                          <Line type="monotone" dataKey="LowerBand" stroke="#ef4444" strokeWidth={1} strokeDasharray="2 2" name="Bollinger Lower Band" />
                        </>
                      )}
                    </>
                  ) : (
                    <Line type="monotone" dataKey="RSI" stroke="#f59e0b" strokeWidth={2} name="Relative Strength Index (RSI)" />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Price Alert triggers & AI Signals indicator */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200">
              <div className={`flex items-start gap-2.5 border p-3 rounded-xl ${aiSignalAdvice.color}`}>
                <Zap className="h-4 w-4 mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-black uppercase tracking-wider block">AI Trading Oracle Signal</span>
                    <span className="text-[8.5px] font-black px-1.5 py-0.2 rounded bg-white border border-slate-200">
                      {aiSignalAdvice.rating}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-700 leading-normal font-semibold">
                    {aiSignalAdvice.message}
                  </p>
                  <span className="text-[9.5px] block font-mono text-slate-500 pt-1">
                    Sentiment: {aiSignalAdvice.sentiment} • target: ₹{aiSignalAdvice.target}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white border p-3 rounded-xl">
                <div className="space-y-1 flex-1">
                  <span className="text-[8.5px] font-black text-slate-400 uppercase">Set Price Alert (Quintal)</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-500">₹</span>
                    <input
                      type="number"
                      value={futuresPriceAlert}
                      onChange={(e) => setFuturesPriceAlert(parseInt(e.target.value) || 0)}
                      className="bg-transparent border-0 p-0 text-xs font-black font-mono text-slate-800 focus:ring-0 focus:outline-none w-full"
                    />
                  </div>
                </div>
                <button
                  onClick={() => alert(`Price alert created successfully! You will receive an automated SMS once ${currentComp.ticker} touches ₹${futuresPriceAlert}.`)}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded text-[10px] font-black cursor-pointer hover:bg-slate-800 transition-all"
                >
                  Create Alert
                </button>
              </div>
            </div>
          </div>

          {/* Render Lists based on active tab */}
          {activeTab === "futures" && (
            <div className="p-5 bg-white border border-slate-150 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  Active Futures Derivatives Positions
                </h4>
                <span className="text-[10px] text-slate-400 font-semibold font-mono">
                  Contracts Lot multiplier: Basmati=10T, Others=5T
                </span>
              </div>

              {activeFuturesTrades.length > 0 ? (
                <div className="space-y-3">
                  {activeFuturesTrades.map(trade => (
                    <div key={trade.id} className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[11px] font-semibold">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-800">{trade.commodity} Futures</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                            trade.type.includes("Buy") ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-rose-100 text-rose-800 border border-rose-200"
                          }`}>
                            {trade.type}
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono block">Entry Price: ₹{trade.entryPrice} • Lots: {trade.lots}</span>
                      </div>

                      <div className="flex gap-6 items-center w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-right font-mono">
                          <span className="text-[9px] text-slate-400 block font-sans">Current Price</span>
                          <span className="font-extrabold">₹{trade.currentPrice}</span>
                        </div>

                        <div className="text-right font-mono">
                          <span className="text-[9px] text-slate-400 block font-sans">Margin Sunk</span>
                          <span className="font-bold">₹{trade.marginLocked.toLocaleString()}</span>
                        </div>

                        <div className="text-right font-mono">
                          <span className="text-[9px] text-slate-400 block font-sans">Unrealized PNL</span>
                          <span className={`font-black ${trade.pnl >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                            {trade.pnl >= 0 ? "+" : ""}₹{trade.pnl}
                          </span>
                        </div>

                        <button
                          onClick={() => handleCloseFuturesTrade(trade.id, trade.pnl, trade.marginLocked)}
                          className="px-3 py-1 bg-slate-900 text-white rounded text-[10px] font-black cursor-pointer hover:bg-slate-800 transition-colors"
                        >
                          Settle Position
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-slate-50 rounded-xl border border-dashed">
                  <Info className="h-7 w-7 text-slate-400 mx-auto mb-1 animate-bounce" />
                  <p className="text-[11px] text-slate-500 font-semibold">No active futures contracts in your portfolio ledger.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "options" && (
            <div className="p-5 bg-white border border-slate-150 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  Price Floor Options Hedges (Puts & Calls)
                </h4>
                <span className="text-[10px] text-slate-400 font-semibold font-mono">
                  Acts like an insurance policy for your crop prices
                </span>
              </div>

              {optionsHedges.length > 0 ? (
                <div className="space-y-3">
                  {optionsHedges.map(opt => (
                    <div key={opt.id} className="p-4 bg-emerald-50/50 border border-emerald-150 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[11px] font-semibold">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <Shield className="h-4 w-4 text-emerald-600" />
                          <span className="font-extrabold text-slate-800">{opt.commodity} {opt.type} Option</span>
                        </div>
                        <span className="text-[9px] text-slate-400 block">Strike Price: ₹{opt.strikePrice} • Size: {opt.lotSizeTons} Tons</span>
                      </div>

                      <div className="flex gap-6 items-center w-full sm:w-auto justify-between sm:justify-start font-mono">
                        <div className="text-right">
                          <span className="text-[9px] text-slate-400 block font-sans">Premium Paid</span>
                          <span>₹{opt.premium.toLocaleString()}</span>
                        </div>

                        <div className="text-right">
                          <span className="text-[9px] text-slate-400 block font-sans">Expiration</span>
                          <span>{opt.expiration}</span>
                        </div>

                        <span className="px-2.5 py-1 bg-emerald-100 border border-emerald-200 text-emerald-800 text-[8.5px] rounded font-sans uppercase font-black tracking-wide">
                          {opt.hedgedStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-slate-50 rounded-xl border border-dashed">
                  <p className="text-[11px] text-slate-500 font-semibold">No options hedge contracts currently purchased.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "spot_mandi" && (
            <div className="p-5 bg-white border border-slate-150 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    Physical Spot Mandi Comparison & Basis Analysis
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold">
                    Basis = Spot Price - Futures Price. Gauges regional transport costs and supply bottlenecks.
                  </p>
                </div>
                <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-black font-mono">
                  Futures: ₹{currentComp.futuresPrice}
                </span>
              </div>

              <div className="space-y-3">
                {mandiSpotPricesList.map((mandi, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[11px] font-semibold">
                    <div className="space-y-0.5">
                      <h5 className="font-extrabold text-slate-800">{mandi.mandiName}</h5>
                      <span className="text-[9px] text-slate-400 block">State: {mandi.state} • Todays Volume: {mandi.arrivalVolume} Tons</span>
                    </div>

                    <div className="flex gap-6 items-center w-full sm:w-auto justify-between sm:justify-start font-mono">
                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 block font-sans">Spot APMC Price</span>
                        <span className="font-black text-slate-800">₹{mandi.spotPrice}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 block font-sans">Basis Spread</span>
                        <span className={`font-black ${mandi.basis >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                          {mandi.basis >= 0 ? "+" : ""}₹{mandi.basis}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          // Quick hedge option suggestion
                          alert(`Suggested Hedge Strategy:\nSince Alwar basis is negative (₹${mandi.basis}), selling spot is unfavorable relative to futures. Consider locking a pre-harvest Forward contract or purchasing a Put option!`);
                        }}
                        className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 rounded text-[9.5px] font-bold cursor-pointer"
                      >
                        Suggest Hedge
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "forwards" && (
            <div className="p-5 bg-white border border-slate-150 rounded-2xl space-y-4">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Guaranteed Pre-Harvest Forward Contracts Vault
              </h4>

              <div className="space-y-3">
                {forwardContracts.map(fwd => (
                  <div key={fwd.id} className="p-4 bg-slate-50 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[11px] font-semibold">
                    <div className="space-y-0.5">
                      <h5 className="font-extrabold text-slate-800">{fwd.commodity}</h5>
                      <span className="text-[9px] text-slate-400 block">Locked Delivery Date: {fwd.deliveryDate}</span>
                    </div>

                    <div className="flex gap-6 items-center w-full sm:w-auto justify-between sm:justify-start">
                      <div className="text-right font-mono">
                        <span className="text-[9px] text-slate-400 block font-sans">Contract Price</span>
                        <span className="font-extrabold text-slate-800">₹{fwd.contractPrice}</span>
                      </div>

                      <div className="text-right font-mono">
                        <span className="text-[9px] text-slate-400 block font-sans">Commit Volume</span>
                        <span>{fwd.volumeTons} Tons</span>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 block">Corporate Buyer</span>
                        <span className="font-bold text-slate-700">{fwd.buyer}</span>
                      </div>

                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 text-[8.5px] rounded uppercase font-sans">
                        {fwd.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "portfolio" && (
            <div className="p-5 bg-white border border-slate-150 rounded-2xl space-y-4">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Derivatives Trading History & Settled Ledger
              </h4>

              {closedTradesList.length > 0 ? (
                <div className="space-y-3 font-mono text-[11px]">
                  {closedTradesList.map(item => (
                    <div key={item.id} className="p-3 bg-slate-50 border rounded-xl flex justify-between items-center">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 font-sans">
                          <span className="font-extrabold text-slate-800">{item.commodity}</span>
                          <span className="text-[9px] px-1 bg-slate-200 text-slate-600 rounded">
                            {item.type}
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-400">{item.timestamp}</span>
                      </div>

                      <div className="flex gap-5 items-center">
                        <div className="text-right">
                          <span className="text-[8.5px] text-slate-400 block font-sans">Entry / Exit</span>
                          <span>₹{item.entryPrice} / ₹{item.exitPrice}</span>
                        </div>

                        <div className="text-right">
                          <span className="text-[8.5px] text-slate-400 block font-sans font-semibold">Realized PNL</span>
                          <span className={`font-black ${item.realizedPnl >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                            {item.realizedPnl >= 0 ? "+" : ""}₹{item.realizedPnl}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 font-semibold text-center py-4">No trade settlement history logged.</p>
              )}
            </div>
          )}

          {activeTab === "education" && (
            <div className="p-5 bg-white border border-slate-150 rounded-2xl space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  Interactive Hedging Simulator Quiz
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold">
                  Test your knowledge of agricultural futures, options, and minimum price floors.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-indigo-600 uppercase tracking-wider block">QUESTION 01</span>
                  <p className="text-xs font-extrabold text-slate-800">
                    A farmer wants to guarantee a minimum price of ₹3,100 per quintal for their upcoming Basmati rice harvest, while preserving the ability to sell at ₹3,400 if market prices shoot up. Which hedging tool should they purchase?
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleQuizSubmit(0)}
                    disabled={quizAnswer !== null}
                    className={`w-full p-3 text-left rounded-lg text-xs font-semibold border flex justify-between items-center transition-all ${
                      quizAnswer === 0 ? "bg-rose-50 border-rose-300 text-rose-800" : "bg-white hover:bg-slate-50 border-slate-200"
                    }`}
                  >
                    <span>Option A: Sell standard Futures Contract (Short Hedge)</span>
                    {quizAnswer !== null && quizAnswer === 0 && <span className="text-rose-600 font-bold">Incorrect</span>}
                  </button>

                  <button
                    onClick={() => handleQuizSubmit(1)}
                    disabled={quizAnswer !== null}
                    className={`w-full p-3 text-left rounded-lg text-xs font-semibold border flex justify-between items-center transition-all ${
                      quizAnswer === 1 ? "bg-emerald-50 border-emerald-300 text-emerald-800" : "bg-white hover:bg-slate-50 border-slate-200"
                    }`}
                  >
                    <span>Option B: Buy Put Option at strike ₹3,100 (Floor Price Insurance)</span>
                    {quizAnswer !== null && quizAnswer === 1 && <span className="text-emerald-600 font-bold">✓ Correct</span>}
                  </button>

                  <button
                    onClick={() => handleQuizSubmit(2)}
                    disabled={quizAnswer !== null}
                    className={`w-full p-3 text-left rounded-lg text-xs font-semibold border flex justify-between items-center transition-all ${
                      quizAnswer === 2 ? "bg-rose-50 border-rose-300 text-rose-800" : "bg-white hover:bg-slate-50 border-slate-200"
                    }`}
                  >
                    <span>Option C: Buy standard Call Option</span>
                    {quizAnswer !== null && quizAnswer === 2 && <span className="text-rose-600 font-bold">Incorrect</span>}
                  </button>
                </div>

                {quizFeedback && (
                  <div className={`p-3 rounded-lg border text-xs font-semibold leading-relaxed ${
                    quizAnswer === 1 ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-rose-50 text-rose-800 border-rose-200"
                  }`}>
                    {quizFeedback}
                  </div>
                )}

                {quizAnswer !== null && (
                  <button
                    onClick={() => {
                      setQuizAnswer(null);
                      setQuizFeedback("");
                    }}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800"
                  >
                    Reset Quiz
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Right Section: Futures Order Builder, Options premium estimator, and risk calculator (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* DERIVATIVE ORDER ENGINE (FUTURES ACTIVE TAB OR OPTIONS TAB) */}
          {(activeTab === "futures" || activeTab === "spot_mandi" || activeTab === "portfolio") && (
            <form onSubmit={handlePlaceFuturesTrade} className="p-5 bg-slate-50 border border-slate-150 rounded-2xl space-y-4 shadow-inner">
              <div className="flex justify-between items-center border-b border-slate-150 pb-2">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="h-4.5 w-4.5 text-indigo-600" />
                  Futures Derivatives Order Entry
                </h4>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono font-black">
                  {currentComp.exchange}
                </span>
              </div>

              <div className="space-y-3 text-[11px] font-bold text-slate-500">
                
                {/* Select buy/sell */}
                <div className="space-y-1">
                  <label className="block text-[8.5px] uppercase font-black text-slate-400">Trading action</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTradeAction("BUY")}
                      className={`py-1.5 rounded-lg text-center font-black cursor-pointer ${
                        tradeAction === "BUY" ? "bg-emerald-600 text-white animate-pulse" : "bg-white border text-slate-700"
                      }`}
                    >
                      Buy / Long
                    </button>
                    <button
                      type="button"
                      onClick={() => setTradeAction("SELL")}
                      className={`py-1.5 rounded-lg text-center font-black cursor-pointer ${
                        tradeAction === "SELL" ? "bg-rose-600 text-white animate-pulse" : "bg-white border text-slate-700"
                      }`}
                    >
                      Sell / Short
                    </button>
                  </div>
                </div>

                {/* Choose commodity */}
                <div className="space-y-1">
                  <label className="block text-[8.5px] uppercase font-black text-slate-400">Commodity Contract</label>
                  <select
                    value={selectedCommodity}
                    onChange={(e) => setSelectedCommodity(e.target.value)}
                    className="w-full bg-white border p-1.5 rounded-lg text-xs font-bold text-slate-700 focus:outline-none"
                  >
                    {commoditiesList.map(c => (
                      <option key={c.ticker} value={c.ticker}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Enter lots */}
                <div className="space-y-1">
                  <label className="block text-[8.5px] uppercase font-black text-slate-400">Order Quantity (Lots)</label>
                  <div className="flex items-center gap-2 bg-white border p-1.5 rounded-lg">
                    <input
                      type="number"
                      min="1"
                      required
                      value={tradeLots}
                      onChange={(e) => setTradeLots(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-transparent border-0 p-0 text-xs font-black font-mono focus:ring-0 focus:outline-none"
                    />
                    <span className="text-[9px] text-slate-400 font-sans uppercase shrink-0">
                      1 Lot = {currentComp.lotSize} Tons
                    </span>
                  </div>
                </div>

                {/* Margin Requirement audit */}
                <div className="p-3 bg-white border border-dashed rounded-xl space-y-1 font-mono text-[10px]">
                  <div className="flex justify-between text-slate-500">
                    <span>Notional Value:</span>
                    <span className="text-slate-800">₹{(tradeLots * currentComp.lotSize * currentComp.futuresPrice).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Margin Requirement ({currentComp.marginRequirement}%):</span>
                    <span className="text-indigo-600 font-bold">₹{prospectiveMarginRequired.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[8.5px] text-slate-400 font-sans italic pt-1 border-t border-slate-100">
                    <span>Account Balance after trade:</span>
                    <span>₹{(marginAccountBalance - prospectiveMarginRequired).toLocaleString()}</span>
                  </div>
                </div>

              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black cursor-pointer transition-colors shadow-sm"
              >
                Place Futures Trade
              </button>
            </form>
          )}

          {/* OPTION PURCHASE BUILDER */}
          {(activeTab === "options" || activeTab === "education") && (
            <form onSubmit={handlePurchaseOptionHedge} className="p-5 bg-slate-50 border border-slate-150 rounded-2xl space-y-4 shadow-inner">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="h-4.5 w-4.5 text-emerald-600 animate-pulse" />
                Downside Price Floor Put/Call Builder
              </h4>

              <div className="space-y-3 text-[11px] font-bold text-slate-500">
                
                {/* Select options type (mostly put for hedging downside) */}
                <div className="space-y-1">
                  <label className="block text-[8.5px] uppercase font-black text-slate-400">Option contract type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setOptionType("Put")}
                      className={`py-1.5 rounded-lg text-center font-black cursor-pointer ${
                        optionType === "Put" ? "bg-emerald-600 text-white" : "bg-white border text-slate-700"
                      }`}
                    >
                      Put (Hedge Price Drop)
                    </button>
                    <button
                      type="button"
                      onClick={() => setOptionType("Call")}
                      className={`py-1.5 rounded-lg text-center font-black cursor-pointer ${
                        optionType === "Call" ? "bg-indigo-600 text-white" : "bg-white border text-slate-700"
                      }`}
                    >
                      Call (Hedge Price Spike)
                    </button>
                  </div>
                </div>

                {/* Strike Price selector */}
                <div className="space-y-1 bg-white p-3 border rounded-xl">
                  <label className="block text-[8.5px] uppercase font-black text-slate-400">Select Strike Price / Quintal</label>
                  <input
                    type="range"
                    min={currentComp.futuresPrice - 300}
                    max={currentComp.futuresPrice + 300}
                    step="50"
                    value={strikePriceSelection}
                    onChange={(e) => setStrikePriceSelection(parseInt(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer my-1.5"
                  />
                  <div className="flex justify-between font-mono text-[10px] font-black text-slate-800">
                    <span>Floor Strike:</span>
                    <span className="text-emerald-700">₹{strikePriceSelection}</span>
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-1">
                  <label className="block text-[8.5px] uppercase font-black text-slate-400">Hedge Contract Duration</label>
                  <select
                    value={optionDuration}
                    onChange={(e) => setOptionDuration(e.target.value)}
                    className="w-full bg-white border p-1.5 rounded-lg text-xs font-bold text-slate-700 focus:outline-none"
                  >
                    <option value="1 Month">1 Month (September Expiry)</option>
                    <option value="3 Months">3 Months (November Expiry)</option>
                    <option value="6 Months">6 Months (January Expiry)</option>
                  </select>
                </div>

                {/* Number of lots */}
                <div className="space-y-1">
                  <label className="block text-[8.5px] uppercase font-black text-slate-400">Hedge Volume (Lots)</label>
                  <div className="flex items-center gap-2 bg-white border p-1.5 rounded-lg">
                    <input
                      type="number"
                      min="1"
                      required
                      value={tradeLots}
                      onChange={(e) => setTradeLots(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-transparent border-0 p-0 text-xs font-black font-mono focus:ring-0 focus:outline-none"
                    />
                    <span className="text-[9px] text-slate-400 font-sans uppercase shrink-0">
                      Lots
                    </span>
                  </div>
                </div>

                {/* Options premium feedback */}
                <div className="p-3 bg-white border border-dashed rounded-xl space-y-1 font-mono text-[10px]">
                  <div className="flex justify-between">
                    <span>Hedge Size:</span>
                    <span>{tradeLots * currentComp.lotSize} Tons</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Premium Cost per Ton:</span>
                    <span>₹{prospectiveOptionPremium}</span>
                  </div>
                  <div className="flex justify-between text-indigo-600 font-bold pt-1 border-t border-slate-100">
                    <span>Total Option Premium:</span>
                    <span>₹{(prospectiveOptionPremium * tradeLots).toLocaleString()}</span>
                  </div>
                </div>

              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black cursor-pointer transition-all shadow-sm"
              >
                Purchase Price Floor Option
              </button>
            </form>
          )}

          {/* RISK PORTFOLIO INSIGHTS */}
          <div className="p-4 bg-slate-900 border border-slate-800 text-slate-300 rounded-2xl space-y-3.5 shadow-md font-mono text-[10px] leading-relaxed">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="h-4 w-4 text-indigo-400 animate-pulse" />
              Interactive Risk & Leverage Estimator
            </h4>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Active Capital Exposure:</span>
                <span className="text-white font-extrabold">₹{riskAssessmentModel.totalExposure.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Hedge Premium Ratio:</span>
                <span className="text-emerald-400 font-bold">{riskAssessmentModel.hedgeRatioPercent}% Coverage</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Locked Margin:</span>
                <span className="text-indigo-400 font-bold">₹{lockedMargin.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2.5 border-t border-slate-800">
                <span className="font-sans">Exposure Risk Level:</span>
                <span className={`px-2 py-0.5 rounded text-[8.5px] font-bold font-sans ${riskAssessmentModel.riskTierColor}`}>
                  {riskAssessmentModel.riskTier}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Commodity Derivatives Educational resources */}
      <div className="p-6 bg-slate-50 border border-slate-150 rounded-2xl space-y-4">
        <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="h-4.5 w-4.5 text-indigo-600 animate-pulse" />
          Derivative Education & Volatility Hedging Guides
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-[11px] leading-relaxed font-semibold">
          
          <div className="bg-white p-4 rounded-xl border space-y-1.5 hover:shadow-sm transition-all">
            <h5 className="font-extrabold text-slate-800 flex items-center gap-1">
              <span>🌾 What is a Futures Contract?</span>
            </h5>
            <p className="text-slate-400">
              An agreement to buy or sell a specific quantity of crops at a predetermined future date and price on NCDEX. Uses high leverage margins.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border space-y-1.5 hover:shadow-sm transition-all">
            <h5 className="font-extrabold text-slate-800 flex items-center gap-1">
              <span>🛡️ How do Put Options hedge price drops?</span>
            </h5>
            <p className="text-slate-400">
              A Put option acts like an insurance policy. It gives you the right to sell at a guaranteed strike price if the market crashes below it.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border space-y-1.5 hover:shadow-sm transition-all">
            <h5 className="font-extrabold text-slate-800 flex items-center gap-1">
              <span>⚖️ Basis Risk Explained</span>
            </h5>
            <p className="text-slate-400">
              Basis is the difference between local spot mandi prices and futures contract pricing. Understand local transit cost spreads to optimize margins.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
