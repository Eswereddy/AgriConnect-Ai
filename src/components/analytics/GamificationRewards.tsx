import React, { useState, useMemo } from "react";
import {
  Award,
  Sparkles,
  TrendingUp,
  Coins,
  Medal,
  Users,
  Brain,
  CloudSun,
  Flame,
  CheckCircle,
  ShoppingBag,
  Gift,
  ArrowUpRight,
  Shield,
  HelpCircle,
  AlertCircle,
  ChevronRight,
  Zap,
  Leaf,
  DollarSign,
  Heart
} from "lucide-react";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  unlocked: boolean;
  xpValue: number;
}

interface RewardItem {
  id: string;
  title: string;
  description: string;
  costPoints: number;
  category: "Discount" | "Rental" | "AI Feature" | "Consultation" | "Cashback";
  redeemed: boolean;
  code?: string;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  village: string;
  points: number;
  level: number;
  sustainabilityScore: number;
  specialBadge: string;
}

export default function GamificationRewards() {
  // --- XP & POINTS SYSTEM STATES ---
  const [totalPoints, setTotalPoints] = useState<number>(3750);
  const [currentXP, setCurrentXP] = useState<number>(1250); // XP towards next level
  const xpNeededForNextLevel = 2000;
  const currentLevel = 4;

  const [redeemedRewards, setRedeemedRewards] = useState<string[]>([]);
  const [activitiesFeed, setActivitiesFeed] = useState<Array<{
    id: string;
    action: string;
    points: number;
    timestamp: string;
    category: string;
  }>>([
    { id: "feed-1", action: "Planted Berseem Clover (Nitrogen Cover)", points: 150, timestamp: "Today 08:30 UTC", category: "Sustainability" },
    { id: "feed-2", action: "Analyzed Crop Diagnostic with AI Pathologist", points: 80, timestamp: "Yesterday", category: "AI Tool" },
    { id: "feed-3", action: "Completed Pusa Basmati Marketplace sale", points: 250, timestamp: "2 days ago", category: "Marketplace" },
    { id: "feed-4", action: "Answered organic certification query in forum", points: 120, timestamp: "3 days ago", category: "Community" }
  ]);

  // --- INITIAL BADGES REGISTRY ---
  const [badges, setBadges] = useState<Badge[]>([
    {
      id: "b-1",
      name: "First Harvest",
      description: "Successfully locked in and completed your first marketplace crop sale.",
      icon: <CheckCircle className="h-6 w-6" />,
      color: "text-emerald-700",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      unlocked: true,
      xpValue: 100
    },
    {
      id: "b-2",
      name: "Golden Yield",
      description: "Achieved the highest localized Basmati rice yield in the Nandi Hills cooperative.",
      icon: <Award className="h-6 w-6" />,
      color: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      unlocked: true,
      xpValue: 500
    },
    {
      id: "b-3",
      name: "Eco Warrior",
      description: "Applied 100% organic rotation and green cover crops across all 6 active farm plots.",
      icon: <Leaf className="h-6 w-6" />,
      color: "text-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      unlocked: true,
      xpValue: 400
    },
    {
      id: "b-4",
      name: "Profit Master",
      description: "Secured over ₹1,00,000 equivalent in pre-harvest contract pricing guarantees.",
      icon: <DollarSign className="h-6 w-6" />,
      color: "text-indigo-700",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      unlocked: true,
      xpValue: 350
    },
    {
      id: "b-5",
      name: "Community Hero",
      description: "Shared fertilizer application strategies and helped over 50 regional farmers.",
      icon: <Users className="h-6 w-6" />,
      color: "text-rose-700",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
      unlocked: false,
      xpValue: 600
    },
    {
      id: "b-6",
      name: "Innovation Star",
      description: "Used 10+ smart AI tools including Lidar Scanning and 5-Year Rotation plans.",
      icon: <Brain className="h-6 w-6" />,
      color: "text-sky-700",
      bgColor: "bg-sky-50",
      borderColor: "border-sky-200",
      unlocked: true,
      xpValue: 300
    },
    {
      id: "b-7",
      name: "Weather Wise",
      description: "Averted storm degradation by reacting proactively to AI weather alerts.",
      icon: <CloudSun className="h-6 w-6" />,
      color: "text-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      unlocked: false,
      xpValue: 250
    },
    {
      id: "b-8",
      name: "Market Expert",
      description: "Sold crops within 3% of the absolute seasonal peak pricing window.",
      icon: <Medal className="h-6 w-6" />,
      color: "text-purple-700",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      unlocked: false,
      xpValue: 450
    }
  ]);

  // --- REWARDS CATALOG ---
  const [rewardsList, setRewardsList] = useState<RewardItem[]>([
    { id: "rew-1", title: "15% Seed Discount Voucher", description: "Get 15% off your next high-grade seed order in the Smart Marketplace.", costPoints: 800, category: "Discount", redeemed: false },
    { id: "rew-2", title: "1-Day Free Drone Rental", description: "Redeem for 24 hours of autonomous drone soil mapping & spraying.", costPoints: 1500, category: "Rental", redeemed: false },
    { id: "rew-3", title: "Premium AI Yield Intelligence", description: "Unlock ultra-high resolution regional microclimate yield modeling dashboards for 30 days.", costPoints: 1200, category: "AI Feature", redeemed: false },
    { id: "rew-4", title: "Soil Microbiologist Consultation", description: "Schedule a 1-on-1 soil chemistry consultation call with a Central University Scientist.", costPoints: 2000, category: "Consultation", redeemed: false },
    { id: "rew-5", title: "₹500 Instant Crop Cashback", description: "Receive instant cashback transferred straight to your escrow billing wallet.", costPoints: 1000, category: "Cashback", redeemed: false },
    { id: "rew-6", title: "Official Agronomist Cap & Jacket", description: "Wear the official embroidered village cooperative uniform with pride.", costPoints: 2500, category: "Consultation", redeemed: false }
  ]);

  // --- VILLAGE LEADERBOARD ---
  const leaderboard: LeaderboardUser[] = useMemo(() => [
    { rank: 1, name: "Srinivas Gowda", village: "Nandi Valley Cooperative", points: 5840, level: 6, sustainabilityScore: 98, specialBadge: "Eco Champion" },
    { rank: 2, name: "Meena Patel", village: "Gagan Hills Agro Union", points: 4950, level: 5, sustainabilityScore: 92, specialBadge: "Golden Yield" },
    { rank: 3, name: "Eswar Reddy J (You)", village: "Nandi Valley Cooperative", points: 3750, level: 4, sustainabilityScore: 95, specialBadge: "Innovation Star" },
    { rank: 4, name: "Ramesh Sharma", village: "Gagan Hills Agro Union", points: 3200, level: 4, sustainabilityScore: 84, specialBadge: "First Harvest" },
    { rank: 5, name: "Anjali Rao", village: "Nandi Valley Cooperative", points: 2900, level: 3, sustainabilityScore: 90, specialBadge: "Weather Wise" }
  ], []);

  // --- ACTIONS SIMULATOR ---
  const handleSimulateAction = (actionName: string, ptsEarned: number, category: string) => {
    // Add points
    setTotalPoints(prev => prev + ptsEarned);
    
    // Add current XP with level-up check
    setCurrentXP(prev => {
      const nextXP = prev + ptsEarned;
      if (nextXP >= xpNeededForNextLevel) {
        alert(`🎉 CONGRATULATIONS! You leveled up to Level ${currentLevel + 1}! Premium consultation features unlocked.`);
        return nextXP - xpNeededForNextLevel;
      }
      return nextXP;
    });

    // Add to live actions feed
    setActivitiesFeed(prev => [
      {
        id: "feed-" + Math.floor(Math.random() * 10000),
        action: actionName,
        points: ptsEarned,
        timestamp: "Just Now",
        category
      },
      ...prev
    ]);
  };

  // --- REDEEM REWARD HANDLER ---
  const handleRedeemReward = (rewardId: string, cost: number) => {
    if (totalPoints < cost) {
      alert("Inadequate points balance! Complete more farm chore activities or AI diagnoses to accumulate points.");
      return;
    }

    setTotalPoints(prev => prev - cost);
    setRedeemedRewards(prev => [...prev, rewardId]);

    // Generate voucher code
    const generatedCode = "REDEEM-" + Math.floor(Math.random() * 90000 + 10000);

    setRewardsList(prev =>
      prev.map(item => {
        if (item.id === rewardId) {
          return { ...item, redeemed: true, code: generatedCode };
        }
        return item;
      })
    );

    alert(`Successfully redeemed reward! Your promo code is: ${generatedCode}. This discount has been appended to your Smart Marketplace checkout panel.`);
  };

  // Badge click interaction to unlock
  const handleTriggerBadgeUnlock = (badgeId: string) => {
    const targetBadge = badges.find(b => b.id === badgeId);
    if (!targetBadge) return;
    if (targetBadge.unlocked) {
      alert(`You already achieved "${targetBadge.name}"! +${targetBadge.xpValue} XP was added to your ledger.`);
      return;
    }

    // Unlock
    setBadges(prev =>
      prev.map(b => {
        if (b.id === badgeId) {
          return { ...b, unlocked: true };
        }
        return b;
      })
    );

    handleSimulateAction(`Unlocked Badge: ${targetBadge.name}`, targetBadge.xpValue, "Badge Achievement");
  };

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div id="gamification-rewards-system" className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-6">
      
      {/* Banner / Title segment */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg">
              <Award className="h-5 w-5 text-indigo-600 animate-bounce" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
              🏆 Agritech Gamification & Farmer Rewards Portal
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 font-semibold tracking-wide uppercase">
            Earn loyalty points through sustainable rotations, complete challenges, and redeem exclusive marketplace discounts
          </p>
        </div>

        {/* Level indicator / progress wheel */}
        <div className="flex items-center gap-3.5 bg-slate-900 text-white p-3 rounded-2xl border border-slate-800 shadow-md">
          <div className="relative flex items-center justify-center">
            <span className="text-xl font-black text-indigo-400 font-mono">Lv.{currentLevel}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-extrabold text-slate-300">
              <span>XP to Level {currentLevel + 1}</span>
              <span className="font-mono">{currentXP} / {xpNeededForNextLevel} XP</span>
            </div>
            {/* Progress bar */}
            <div className="w-36 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${(currentXP / xpNeededForNextLevel) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main KPI panel: Live Coins Balance and sustainability stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Points/Coins Balance */}
        <div className="p-4 rounded-2xl border bg-slate-50 border-slate-150 shadow-inner flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Available Loyalty Balance</span>
            <Coins className="h-4.5 w-4.5 text-yellow-500 animate-spin" style={{ animationDuration: "15s" }} />
          </div>
          <div className="mt-2">
            <h4 className="text-2xl font-black text-slate-800 font-mono flex items-center gap-1.5">
              {totalPoints.toLocaleString()} <span className="text-xs font-semibold text-slate-400 uppercase">Points</span>
            </h4>
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full inline-block mt-1">
              Redeemable for Cash & Discounts
            </span>
          </div>
        </div>

        {/* Badges unlocked statistic */}
        <div className="p-4 rounded-2xl border bg-slate-50 border-slate-150 shadow-inner flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Badges Achievement Rate</span>
            <Medal className="h-4.5 w-4.5 text-indigo-600" />
          </div>
          <div className="mt-2">
            <h4 className="text-2xl font-black text-slate-800 font-mono">
              {unlockedCount} / {badges.length}
            </h4>
            <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${(unlockedCount / badges.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Live Streaks */}
        <div className="p-4 rounded-2xl border bg-slate-50 border-slate-150 shadow-inner flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Daily Activity Streak</span>
            <Flame className="h-4.5 w-4.5 text-rose-500 animate-bounce" />
          </div>
          <div className="mt-2">
            <h4 className="text-2xl font-black text-slate-800 font-mono">
              14 Days
            </h4>
            <span className="text-[9px] font-bold text-slate-400 uppercase block">Consistency Multipier active: 1.2x</span>
          </div>
        </div>

        {/* Sustainability index */}
        <div className="p-4 rounded-2xl border bg-slate-50 border-slate-150 shadow-inner flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Sustainability Merit Rating</span>
            <Leaf className="h-4.5 w-4.5 text-emerald-600" />
          </div>
          <div className="mt-2">
            <h4 className="text-2xl font-black text-emerald-700 font-mono">
              A+ Grade
            </h4>
            <span className="text-[9px] font-semibold text-slate-400 block">Eco-friendly nitrogen fixing leader</span>
          </div>
        </div>
      </div>

      {/* Grid containing Interactive Simulations, Badges, and Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Section: Badges list (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Achievements Gallery */}
          <div className="p-5 bg-slate-50 border border-slate-150 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Medal className="h-4.5 w-4.5 text-indigo-600" />
                Emblem Gallery (Farmer Badges)
              </h4>
              <span className="text-[10px] text-slate-400 font-bold">CLICK BADGES TO COMPLETE OR EARN XP</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {badges.map(b => (
                <div
                  key={b.id}
                  onClick={() => handleTriggerBadgeUnlock(b.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-3.5 items-start ${
                    b.unlocked
                      ? `${b.bgColor} ${b.borderColor} opacity-100 scale-100 hover:shadow-md`
                      : "bg-slate-100/50 border-slate-200 opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className={`p-2.5 rounded-xl border shrink-0 ${
                    b.unlocked ? `${b.color} bg-white ${b.borderColor}` : "bg-slate-200 text-slate-400 border-slate-300"
                  }`}>
                    {b.icon}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <h5 className="text-xs font-extrabold text-slate-800">{b.name}</h5>
                      {b.unlocked ? (
                        <span className="text-[8px] bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.5 rounded uppercase">Unlocked</span>
                      ) : (
                        <span className="text-[8px] bg-slate-200 text-slate-500 font-bold px-1.5 py-0.5 rounded uppercase">Locked (+{b.xpValue} XP)</span>
                      )}
                    </div>
                    <p className="text-[10.5px] text-slate-500 leading-relaxed font-medium">
                      {b.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Simulate Loyalty Activities widget */}
          <div className="p-5 bg-white border border-slate-150 rounded-2xl space-y-4">
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-indigo-600" />
              Simulate Farm Activities (Earn Real XP)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleSimulateAction("Completed Legume Rotation Crop Plan", 150, "Sustainability")}
                className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl hover:bg-emerald-100/70 text-left transition-all cursor-pointer space-y-1.5 group"
              >
                <div className="flex justify-between items-center text-emerald-800 font-black text-[10px] uppercase">
                  <span>Rotation Cycle</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600 group-hover:translate-x-0.5" />
                </div>
                <div className="text-[11px] font-extrabold text-slate-800">Clover/Legume Planting</div>
                <span className="text-[9px] font-bold text-emerald-700 font-mono">+150 XP Loyalty</span>
              </button>

              <button
                onClick={() => handleSimulateAction("Submitted Government Subsidy Application", 120, "Scheme Application")}
                className="p-3 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100/70 text-left transition-all cursor-pointer space-y-1.5 group"
              >
                <div className="flex justify-between items-center text-blue-800 font-black text-[10px] uppercase">
                  <span>Subsidy Claim</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-blue-600 group-hover:translate-x-0.5" />
                </div>
                <div className="text-[11px] font-extrabold text-slate-800">PM-Kisan Scheme Filing</div>
                <span className="text-[9px] font-bold text-blue-700 font-mono">+120 XP Loyalty</span>
              </button>

              <button
                onClick={() => handleSimulateAction("Sold Wheat at Seasonal Peak window", 200, "Marketplace")}
                className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100/70 text-left transition-all cursor-pointer space-y-1.5 group"
              >
                <div className="flex justify-between items-center text-indigo-800 font-black text-[10px] uppercase">
                  <span>Smart Trade</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-indigo-600 group-hover:translate-x-0.5" />
                </div>
                <div className="text-[11px] font-extrabold text-slate-800">Sold Peak Price Window</div>
                <span className="text-[9px] font-bold text-indigo-700 font-mono">+200 XP Loyalty</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Section: Leaderboard and Feed (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Cooperative Leaderboard */}
          <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-4">
            <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Users className="h-4 w-4 text-indigo-600" />
              Village Leaderboard Recognition
            </h4>

            <div className="space-y-2.5">
              {leaderboard.map(user => (
                <div
                  key={user.rank}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                    user.name.includes("You")
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                      : "bg-white border-slate-200 text-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[11px] font-black w-5 text-center font-mono ${
                      user.rank === 1 ? "text-yellow-500" : user.rank === 2 ? "text-slate-400" : ""
                    }`}>
                      #{user.rank}
                    </span>
                    <div>
                      <h5 className="text-[11px] font-extrabold leading-tight">{user.name}</h5>
                      <span className={`text-[9px] block font-semibold ${
                        user.name.includes("You") ? "text-indigo-200" : "text-slate-400"
                      }`}>
                        {user.village} • {user.specialBadge}
                      </span>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-xs font-black">{user.points} pts</span>
                    <span className={`block text-[8px] font-extrabold ${
                      user.name.includes("You") ? "text-indigo-100" : "text-emerald-600"
                    }`}>
                      Eco Score: {user.sustainabilityScore}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activities History Feed */}
          <div className="p-4 bg-slate-900 text-slate-300 border border-slate-800 rounded-2xl space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
              Live Micro-Transaction Ledger
            </h4>

            <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
              {activitiesFeed.map((feed, idx) => (
                <div key={feed.id} className="text-[10px] font-mono border-b border-slate-850 pb-2 last:border-b-0 space-y-0.5">
                  <div className="flex justify-between items-start">
                    <span className="text-white font-semibold leading-tight">{feed.action}</span>
                    <span className="text-emerald-400 font-boldshrink-0">+{feed.points} XP</span>
                  </div>
                  <div className="text-[8.5px] text-slate-500 flex justify-between">
                    <span>Category: {feed.category}</span>
                    <span>{feed.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Loyalty Rewards Redemption Catalog Marketplace */}
      <div className="p-6 bg-slate-50 border border-slate-150 rounded-2xl space-y-4">
        <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Gift className="h-4.5 w-4.5 text-indigo-600 animate-pulse" />
          Loyalty Rewards Redemption Catalog
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewardsList.map(reward => (
            <div key={reward.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3.5">
              
              <div className="space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="text-[8.5px] bg-indigo-50 border border-indigo-100 text-indigo-700 font-black px-2 py-0.5 rounded uppercase">
                    {reward.category}
                  </span>
                  <span className="text-xs font-black text-indigo-600 font-mono">
                    Cost: {reward.costPoints} Pts
                  </span>
                </div>
                <h5 className="text-xs font-extrabold text-slate-800">{reward.title}</h5>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                  {reward.description}
                </p>
              </div>

              <div>
                {reward.redeemed ? (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-1">
                    <span className="text-[8.5px] font-black uppercase text-emerald-800 block">Redemption Success Voucher</span>
                    <span className="font-mono text-xs font-black text-emerald-700">{reward.code}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRedeemReward(reward.id, reward.costPoints)}
                    disabled={totalPoints < reward.costPoints}
                    className={`w-full py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      totalPoints >= reward.costPoints
                        ? "bg-slate-900 text-white hover:bg-slate-800"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    {totalPoints >= reward.costPoints ? "Redeem Reward" : `Needs ${reward.costPoints - totalPoints} more Points`}
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
