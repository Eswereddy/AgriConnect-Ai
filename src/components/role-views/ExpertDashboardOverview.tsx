import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Star,
  DollarSign,
  TrendingUp,
  Clock,
  Users,
  MessageSquare,
  PhoneCall,
  Video,
  Globe,
  X,
  Calendar,
  ArrowUpRight,
  Activity,
  ArrowRight,
  Search,
  Filter,
  Plus,
  Sliders,
  MapPin,
  Flame,
  BookMarked,
  Award,
  Sparkles,
  CheckCircle,
  FileText,
  UserCheck
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface ExpertDashboardOverviewProps {
  expertProfile: any;
  pendingQueries: any[];
  setPendingQueries: React.Dispatch<React.SetStateAction<any[]>>;
  upcomingConsultations: any[];
  setUpcomingConsultations: React.Dispatch<React.SetStateAction<any[]>>;
  articles: any[];
  setArticles: React.Dispatch<React.SetStateAction<any[]>>;
  availability: any;
  setAvailability: React.Dispatch<React.SetStateAction<any>>;
  earnedBonus: number;
  setEarnedBonus: React.Dispatch<React.SetStateAction<number>>;
  setActiveTab: (tab: any) => void;
  diagnosticsCount: number;
  solvedCount: number;
}

export default function ExpertDashboardOverview({
  expertProfile,
  pendingQueries,
  setPendingQueries,
  upcomingConsultations,
  setUpcomingConsultations,
  articles,
  setArticles,
  availability,
  setAvailability,
  earnedBonus,
  setEarnedBonus,
  setActiveTab,
  diagnosticsCount,
  solvedCount
}: ExpertDashboardOverviewProps) {
  // Modal states
  const [isAnsweringQueries, setIsAnsweringQueries] = useState(false);
  const [activeQueryToAnswer, setActiveQueryToAnswer] = useState<any>(null);
  const [replyInput, setReplyInput] = useState("");

  const [isStartingVideoConsultation, setIsStartingVideoConsultation] = useState(false);
  const [activeConsultationToStart, setActiveConsultationToStart] = useState<any>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoStopped, setIsVideoStopped] = useState(false);
  const [consultationNotes, setConsultationNotes] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [isViewingFarmerHistory, setIsViewingFarmerHistory] = useState(false);
  const [farmerSearchQuery, setFarmerSearchQuery] = useState("");

  const [isPublishingArticle, setIsPublishingArticle] = useState(false);
  const [newArticleTitle, setNewArticleTitle] = useState("");
  const [newArticleCrop, setNewArticleCrop] = useState("");
  const [newArticleCategory, setNewArticleCategory] = useState("Bio-Remediation");
  const [newArticleContent, setNewArticleContent] = useState("");

  const [isUpdatingAvailability, setIsUpdatingAvailability] = useState(false);

  // Performance trends tab state
  const [trendsTab, setTrendsTab] = useState<"consultations" | "revenue">("consultations");

  // Pending queries filters
  const [qSearchQuery, setQSearchQuery] = useState("");
  const [qCropFilter, setQCropFilter] = useState("All");
  const [qIssueFilter, setQIssueFilter] = useState("All");
  const [qPriorityFilter, setQPriorityFilter] = useState("All");
  const [qDateFilter, setQDateFilter] = useState("All");

  // Availability form states
  const [tempStatus, setTempStatus] = useState(availability.onlineStatus);
  const [tempRate, setTempRate] = useState(availability.hourlyRate);
  const [tempDays, setTempDays] = useState<string[]>(availability.days);
  const [tempHours, setTempHours] = useState(availability.hours);

  // Farmer history DB
  const farmerHistoryDatabase = [
    { name: "Suresh Patil", location: "Nashik, MH", trustIndex: 94, consultationsCount: 5, primaryCrop: "Grapes", recentDiagnosis: "Downy Mildew" },
    { name: "Anjali Menon", location: "Palakkad, KL", trustIndex: 88, consultationsCount: 3, primaryCrop: "Coconut Palm", recentDiagnosis: "Leaf Powdery Spot" },
    { name: "Ram Singh", location: "Ludhiana, PB", trustIndex: 96, consultationsCount: 12, primaryCrop: "Rice", recentDiagnosis: "Leaf Folder" },
    { name: "Vikram Gaikwad", location: "Satara, MH", trustIndex: 91, consultationsCount: 4, primaryCrop: "Tomato", recentDiagnosis: "Early Blight" },
    { name: "Ramesh Singh", location: "Varanasi, UP", trustIndex: 95, consultationsCount: 6, primaryCrop: "Wheat", recentDiagnosis: "Puccinia Rust" },
    { name: "Harpreet Kaur", location: "Amritsar, PB", trustIndex: 98, consultationsCount: 15, primaryCrop: "Cotton", recentDiagnosis: "Whitefly Outbreak" }
  ];

  // Camera feed refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Video call timer
  useEffect(() => {
    if (isStartingVideoConsultation && activeConsultationToStart) {
      setCallDuration(0);
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStartingVideoConsultation, activeConsultationToStart]);

  // Webcam binder
  useEffect(() => {
    if (isStartingVideoConsultation && activeConsultationToStart && !isVideoStopped) {
      navigator.mediaDevices?.getUserMedia?.({ video: true, audio: true })
        .then((stream) => {
          streamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.warn("Webcam access declined or unavailable in iframe container:", err);
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isStartingVideoConsultation, activeConsultationToStart, isVideoStopped]);

  const thisMonthEarnings = 18400 + earnedBonus;

  // Farm Credit Score calculator helper (0-100)
  const calculateCreditScore = () => {
    const rating = expertProfile?.rating || 4.9;
    const ratingBase = rating * 19; // 4.9 * 19 = 93.1
    const resolvedCount = pendingQueries.filter((q) => q.replied).length;
    const score = Math.min(100, Math.round(ratingBase + (resolvedCount * 2) + (upcomingConsultations.length * 0.5)));
    return score;
  };

  const score = calculateCreditScore();
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const handlePostAnswer = (queryId: string) => {
    if (!replyInput.trim()) {
      alert("Please provide pathology recommendation advice text.");
      return;
    }
    setPendingQueries((prev) =>
      prev.map((q) =>
        q.id === queryId ? { ...q, replied: true, replyText: replyInput } : q
      )
    );
    setEarnedBonus((prev) => prev + 500); // Earn ₹500
    alert(`Pathological consultation uploaded live to registry. Farmer has been dispatched bio-remedies! Earning updated.`);
    setReplyInput("");
    setIsAnsweringQueries(false);
    setActiveQueryToAnswer(null);
  };

  const handleCompleteCall = () => {
    if (!consultationNotes.trim()) {
      alert("Please specify pathological notes for this farmer's electronic advisory records.");
      return;
    }
    setUpcomingConsultations((prev) =>
      prev.filter((c) => c.id !== activeConsultationToStart.id)
    );
    setEarnedBonus((prev) => prev + 800); // Video call payout
    alert(`Video consultation completed successfully with ${activeConsultationToStart.farmerName}! Synchronized notes with sovereign registry. Earning payout updated.`);
    setConsultationNotes("");
    setIsStartingVideoConsultation(false);
    setActiveConsultationToStart(null);
  };

  // 2.2 PERFORMANCE WIDGET ANALYTICS DATASETS (30-day metrics)
  const consultationTrendsData = [
    { date: "06/20", count: 12 },
    { date: "06/23", count: 15 },
    { date: "06/26", count: 18 },
    { date: "06/29", count: 14 },
    { date: "07/02", count: 20 },
    { date: "07/05", count: 22 },
    { date: "07/08", count: 19 },
    { date: "07/11", count: 25 },
    { date: "07/14", count: 28 },
    { date: "07/18", count: 32 }
  ];

  const revenueTrendsData = [
    { date: "06/20", amount: 6000 },
    { date: "06/23", amount: 7500 },
    { date: "06/26", amount: 9000 },
    { date: "06/29", amount: 7000 },
    { date: "07/02", amount: 10000 },
    { date: "07/05", amount: 11000 },
    { date: "07/08", amount: 9500 },
    { date: "07/11", amount: 12500 },
    { date: "07/14", amount: 14000 },
    { date: "07/18", amount: 16000 }
  ];

  const ratingDistributionData = [
    { name: "5 Stars", value: 82, color: "#059669" },
    { name: "4 Stars", value: 12, color: "#10b981" },
    { name: "3 Stars", value: 4, color: "#34d399" },
    { name: "2 Stars", value: 1, color: "#f59e0b" },
    { name: "1 Star", value: 1, color: "#ef4444" }
  ];

  const topCropsAndIssues = [
    { name: "Wheat Blast", crop: "Wheat", cases: 38, percentage: 85, color: "bg-amber-500" },
    { name: "Downy Mildew", crop: "Grapes", cases: 29, percentage: 68, color: "bg-indigo-500" },
    { name: "Soil pH Acidification", crop: "Multiple", cases: 22, percentage: 52, color: "bg-emerald-500" },
    { name: "Whitefly Outbreak", crop: "Cotton", cases: 18, percentage: 42, color: "bg-red-500" },
    { name: "Early Blight", crop: "Tomato", cases: 14, percentage: 32, color: "bg-teal-500" }
  ];

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  // Filtered queries computation
  const filteredQueries = pendingQueries.filter((q) => {
    // Exclude replied ones
    if (q.replied) return false;

    // Search query: Farmer name, keyword, crop name
    if (qSearchQuery) {
      const s = qSearchQuery.toLowerCase();
      const nameMatch = q.farmerName?.toLowerCase().includes(s) || false;
      const cropMatch = q.crop?.toLowerCase().includes(s) || false;
      const titleMatch = q.title?.toLowerCase().includes(s) || false;
      const questionMatch = q.question?.toLowerCase().includes(s) || false;
      const locationMatch = q.location?.toLowerCase().includes(s) || false;
      if (!nameMatch && !cropMatch && !titleMatch && !questionMatch && !locationMatch) {
        return false;
      }
    }

    // Crop filter
    if (qCropFilter !== "All" && q.crop !== qCropFilter) {
      return false;
    }

    // Issue type filter
    if (qIssueFilter !== "All" && q.issueType !== qIssueFilter) {
      return false;
    }

    // Priority filter
    if (qPriorityFilter !== "All" && q.priority !== qPriorityFilter) {
      return false;
    }

    // Date range filter
    if (qDateFilter !== "All") {
      if (qDateFilter === "Today (24h)") {
        if (q.date !== "2026-07-18" && !(q.timeAgo && q.timeAgo.includes("hour"))) return false;
      } else if (qDateFilter === "Past 3 Days") {
        const allowed = ["2026-07-18", "2026-07-17", "2026-07-16"];
        if (!allowed.includes(q.date)) return false;
      } else if (qDateFilter === "Past Week") {
        const allowed = ["2026-07-18", "2026-07-17", "2026-07-16", "2026-07-15", "2026-07-14", "2026-07-13", "2026-07-12"];
        if (!allowed.includes(q.date)) return false;
      }
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* 2.1 HERO SECTION */}
      <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-3xs text-left grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left welcome (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[9px] uppercase tracking-widest font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              Active Expert Dashboard
            </span>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{availability.onlineStatus}</span>
            </div>
          </div>
          <h2 className="text-xl font-black text-slate-800 leading-tight">
            Welcome Back, {expertProfile.name}!
          </h2>
          <p className="text-[11px] text-slate-500 font-bold leading-relaxed max-w-lg">
            {expertProfile.designation} • <span className="text-emerald-700">{expertProfile.department}</span>. Your signed-off biological treatment regimens protect smallholder yields across regional cooperative farms.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <div className="bg-slate-50 border border-slate-150 px-3.5 py-2 rounded-xl text-center min-w-[110px]">
              <p className="text-[9px] text-slate-400 uppercase font-black">Pending Scans</p>
              <p className="text-sm font-black text-slate-700 mt-0.5">{diagnosticsCount} Audits</p>
            </div>
            <div className="bg-slate-50 border border-slate-150 px-3.5 py-2 rounded-xl text-center min-w-[110px]">
              <p className="text-[9px] text-slate-400 uppercase font-black">Upcoming Consults</p>
              <p className="text-sm font-black text-slate-700 mt-0.5">
                {upcomingConsultations.length} Booked
              </p>
            </div>
            <div className="bg-emerald-50/50 border border-emerald-150 px-3.5 py-2 rounded-xl text-center min-w-[110px]">
              <p className="text-[9px] text-emerald-600 uppercase font-black">Payouts (July)</p>
              <p className="text-sm font-black text-emerald-800 mt-0.5">
                ₹{thisMonthEarnings.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Right Farm Credit Score Widget (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 to-emerald-50/40 border border-slate-150 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="space-y-1.5 text-left max-w-[65%]">
            <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              Sovereign Credit Score
            </h4>
            <p className="text-lg font-black text-slate-800">{score} / 100</p>
            <p className="text-[9px] text-slate-400 font-bold leading-normal">
              Based on rating quality ({expertProfile.rating || "4.9"}), response speed, and diagnostic accuracy indices.
            </p>
          </div>

          {/* Radial score gauge */}
          <div className="relative shrink-0 flex items-center justify-center">
            <svg className="h-20 w-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="stroke-slate-100 fill-transparent"
                strokeWidth="6"
              />
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="stroke-emerald-600 fill-transparent transition-all duration-500"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-[11px] font-black text-slate-800">
              {score}%
            </div>
          </div>
        </div>
      </div>

      {/* 2.2 QUICK STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Stat 1 */}
        <div className="bg-white border border-slate-150 rounded-xl p-4 shadow-3xs text-left">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[9px] uppercase font-black">Lifetime Consults</span>
            <Users className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-lg font-black text-slate-800 mt-1.5">
            {expertProfile.consultations + Math.round(earnedBonus / 500)}
          </p>
          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Verified Cases</p>
        </div>

        {/* Stat 2 */}
        <div className="bg-white border border-slate-150 rounded-xl p-4 shadow-3xs text-left">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[9px] uppercase font-black">Average Rating</span>
            <Star className="h-4 w-4 text-amber-500 fill-current" />
          </div>
          <p className="text-lg font-black text-slate-800 mt-1.5 flex items-center gap-0.5">
            {expertProfile.rating || "4.9"}
            <span className="text-xs text-slate-400 font-bold">★</span>
          </p>
          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Farmer Endorsement</p>
        </div>

        {/* Stat 3 */}
        <div className="bg-white border border-slate-150 rounded-xl p-4 shadow-3xs text-left">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[9px] uppercase font-black">Response Speed</span>
            <Clock className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="text-lg font-black text-slate-800 mt-1.5">{availability.responseTime}</p>
          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Avg Turnaround</p>
        </div>

        {/* Stat 4 */}
        <div className="bg-white border border-slate-150 rounded-xl p-4 shadow-3xs text-left">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[9px] uppercase font-black">Farmers Helped</span>
            <Globe className="h-4 w-4 text-teal-500" />
          </div>
          <p className="text-lg font-black text-slate-800 mt-1.5">
            {148 + Math.round(earnedBonus / 500)}
          </p>
          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Active smallholders</p>
        </div>

        {/* Stat 5 */}
        <div className="bg-white border border-slate-150 rounded-xl p-4 shadow-3xs text-left col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[9px] uppercase font-black">Annual Revenue</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-lg font-black text-slate-800 mt-1.5">
            ₹{(210000 + earnedBonus).toLocaleString()}
          </p>
          <div className="flex justify-between text-[8px] text-slate-400 font-bold uppercase mt-1">
            <span>M: ₹{thisMonthEarnings.toLocaleString()}</span>
            <span>Q: ₹{(56200 + earnedBonus).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 2.3 QUICK ACTION BUTTONS */}
      <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl text-left space-y-3">
        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
          <LayoutDashboard className="h-4 w-4 text-slate-400" />
          Expert Pathological Actions & Advisory Suite
        </h4>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Action 1 */}
          <button
            onClick={() => {
              setIsAnsweringQueries(true);
              setActiveQueryToAnswer(null);
            }}
            className="bg-white hover:bg-emerald-50 border border-slate-150 hover:border-emerald-300 rounded-xl p-4 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 group shadow-3xs"
          >
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg group-hover:scale-105 transition-transform">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-800 group-hover:text-emerald-700 transition-colors">Answer Queries</p>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">
                {pendingQueries.filter((q) => !q.replied).length} pending
              </p>
            </div>
          </button>

          {/* Action 2 */}
          <button
            onClick={() => {
              setIsStartingVideoConsultation(true);
              setActiveConsultationToStart(null);
            }}
            className="bg-white hover:bg-emerald-50 border border-slate-150 hover:border-emerald-300 rounded-xl p-4 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 group shadow-3xs"
          >
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg group-hover:scale-105 transition-transform">
              <Video className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-800 group-hover:text-emerald-700 transition-colors">Tele-Health Call</p>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">
                {upcomingConsultations.length} Scheduled
              </p>
            </div>
          </button>

          {/* Action 3 */}
          <button
            onClick={() => setIsViewingFarmerHistory(true)}
            className="bg-white hover:bg-emerald-50 border border-slate-150 hover:border-emerald-300 rounded-xl p-4 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 group shadow-3xs"
          >
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg group-hover:scale-105 transition-transform">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-800 group-hover:text-emerald-700 transition-colors">Farmer History</p>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">Patient Records</p>
            </div>
          </button>

          {/* Action 4 */}
          <button
            onClick={() => {
              setIsPublishingArticle(true);
              setNewArticleTitle("");
              setNewArticleCrop("");
              setNewArticleContent("");
            }}
            className="bg-white hover:bg-emerald-50 border border-slate-150 hover:border-emerald-300 rounded-xl p-4 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 group shadow-3xs"
          >
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg group-hover:scale-105 transition-transform">
              <BookMarked className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-800 group-hover:text-emerald-700 transition-colors">Publish Research</p>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">
                {articles.length} Advisory Notes
              </p>
            </div>
          </button>

          {/* Action 5 */}
          <button
            onClick={() => {
              setTempStatus(availability.onlineStatus);
              setTempRate(availability.hourlyRate);
              setTempDays(availability.days);
              setTempHours(availability.hours);
              setIsUpdatingAvailability(true);
            }}
            className="bg-white hover:bg-emerald-50 border border-slate-150 hover:border-emerald-300 rounded-xl p-4 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 group shadow-3xs"
          >
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg group-hover:scale-105 transition-transform">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-800 group-hover:text-emerald-700 transition-colors">Set Availability</p>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">
                {availability.onlineStatus} • ₹{availability.hourlyRate}/hr
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Main content split: Left list, Right Advisory feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pending Q&As and Upcoming list (7 cols) */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Upcoming Consultations widget */}
          <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-3xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-150 pb-3">
              <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Video className="h-4.5 w-4.5 text-emerald-600" />
                Active Booked Consultations
              </h3>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full uppercase">
                Sovereign Secure Call Room
              </span>
            </div>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {upcomingConsultations.length === 0 ? (
                <p className="text-[10px] text-slate-400 text-center py-4 italic font-bold">No consultations scheduled.</p>
              ) : (
                upcomingConsultations.map((c) => (
                  <div key={c.id} className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-black text-slate-800">{c.farmerName}</p>
                        <span className="text-[9px] text-slate-400 font-semibold">{c.location}</span>
                        <span className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-150 text-[9px] text-indigo-700 font-bold px-2 py-0.2 rounded uppercase">
                          {c.mode} call
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-700">{c.topic}</p>
                      <p className="text-[10px] text-slate-400 italic font-medium">"{c.description}"</p>
                      <p className="text-[10px] text-slate-500 font-mono">Date: {c.date} • {c.slot}</p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveConsultationToStart(c);
                        setIsStartingVideoConsultation(true);
                      }}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-3xs shrink-0 flex items-center gap-1"
                    >
                      <PhoneCall className="h-3 w-3" />
                      Start
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pending Q&As widget with Text-Based Query System */}
          <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-3xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-150 pb-3 gap-2">
              <div>
                <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="h-4.5 w-4.5 text-emerald-600" />
                  Farmer Direct Advisory Workspace
                </h3>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                  Filter, search, and prescribe botanical treatment advice for active grower queries.
                </p>
              </div>
              <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded-full font-black uppercase shrink-0">
                Text Q&A Gateway
              </span>
            </div>

            {/* 3.1 SEARCH & FILTERS CORE SUITE */}
            <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-3 text-left">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by farmer name, crop name, issue, or keywords..."
                  value={qSearchQuery}
                  onChange={(e) => setQSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
                {qSearchQuery && (
                  <button
                    onClick={() => setQSearchQuery("")}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 font-bold text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* Crop Filter */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Crop Type</label>
                  <select
                    value={qCropFilter}
                    onChange={(e) => setQCropFilter(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="All">All Crops</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Rice">Rice</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Grapes">Grapes</option>
                    <option value="Coconut Palm">Coconut Palm</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Tapioca">Tapioca</option>
                  </select>
                </div>

                {/* Issue Type Filter */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Issue Category</label>
                  <select
                    value={qIssueFilter}
                    onChange={(e) => setQIssueFilter(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="All">All Issues</option>
                    <option value="Disease">Disease</option>
                    <option value="Pest">Pest</option>
                    <option value="Soil">Soil</option>
                    <option value="Fertilizer">Fertilizer</option>
                    <option value="Irrigation">Irrigation</option>
                    <option value="General">General</option>
                  </select>
                </div>

                {/* Priority Filter */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">AI Priority</label>
                  <select
                    value={qPriorityFilter}
                    onChange={(e) => setQPriorityFilter(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="All">All Priorities</option>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>

                {/* Date Filter */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Date Range</label>
                  <select
                    value={qDateFilter}
                    onChange={(e) => setQDateFilter(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="All">All Time</option>
                    <option value="Today (24h)">Today (24h)</option>
                    <option value="Past 3 Days">Past 3 Days</option>
                    <option value="Past Week">Past Week</option>
                  </select>
                </div>
              </div>

              {/* Active Filter Badges */}
              {(qSearchQuery || qCropFilter !== "All" || qIssueFilter !== "All" || qPriorityFilter !== "All" || qDateFilter !== "All") && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-150">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Active:</span>
                  {qCropFilter !== "All" && (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[8px] font-black px-2 py-0.5 rounded flex items-center gap-1">
                      Crop: {qCropFilter}
                      <button onClick={() => setQCropFilter("All")} className="hover:text-emerald-900 font-extrabold">×</button>
                    </span>
                  )}
                  {qIssueFilter !== "All" && (
                    <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[8px] font-black px-2 py-0.5 rounded flex items-center gap-1">
                      Issue: {qIssueFilter}
                      <button onClick={() => setQIssueFilter("All")} className="hover:text-indigo-900 font-extrabold">×</button>
                    </span>
                  )}
                  {qPriorityFilter !== "All" && (
                    <span className="bg-rose-50 text-rose-700 border border-rose-100 text-[8px] font-black px-2 py-0.5 rounded flex items-center gap-1">
                      Priority: {qPriorityFilter}
                      <button onClick={() => setQPriorityFilter("All")} className="hover:text-rose-900 font-extrabold">×</button>
                    </span>
                  )}
                  {qDateFilter !== "All" && (
                    <span className="bg-amber-50 text-amber-700 border border-amber-100 text-[8px] font-black px-2 py-0.5 rounded flex items-center gap-1">
                      Date: {qDateFilter}
                      <button onClick={() => setQDateFilter("All")} className="hover:text-amber-900 font-extrabold">×</button>
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setQSearchQuery("");
                      setQCropFilter("All");
                      setQIssueFilter("All");
                      setQPriorityFilter("All");
                      setQDateFilter("All");
                    }}
                    className="text-[8px] text-slate-500 font-black uppercase hover:underline ml-auto cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>

            {/* List area */}
            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
              {filteredQueries.length === 0 ? (
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl py-8 text-center">
                  <p className="text-xs text-slate-400 italic font-bold">No grower queries match the selected search & filters.</p>
                  <button
                    onClick={() => {
                      setQSearchQuery("");
                      setQCropFilter("All");
                      setQIssueFilter("All");
                      setQPriorityFilter("All");
                      setQDateFilter("All");
                    }}
                    className="mt-2 text-[10px] bg-slate-800 text-white font-black px-3 py-1 rounded-lg uppercase tracking-wider hover:bg-slate-900 cursor-pointer"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                filteredQueries.map((q) => (
                  <div key={q.id} className="bg-slate-50/60 border border-slate-150 p-4 rounded-xl space-y-3 text-left hover:shadow-xs transition-all">
                    {/* Card Header */}
                    <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-black text-slate-800">{q.farmerName}</p>
                          <span className="text-[9px] text-slate-400 font-semibold flex items-center gap-0.5">
                            <MapPin className="h-2.5 w-2.5" />
                            {q.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-black uppercase tracking-tight text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                            Crop: {q.crop}
                          </span>
                          <span className="text-[9px] font-black uppercase tracking-tight text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                            Type: {q.issueType}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {/* Priority Badge */}
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border flex items-center gap-1 ${
                          q.priority === "High"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : q.priority === "Medium"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}>
                          {q.priority === "High" && <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />}
                          AI Priority: {q.priority}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono font-bold flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-300" />
                          {q.timeAgo || q.date}
                        </span>
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="space-y-2">
                      {q.title && (
                        <h4 className="text-xs font-extrabold text-slate-800 leading-snug">
                          {q.title}
                        </h4>
                      )}
                      <p className="text-[11px] leading-relaxed text-slate-600 font-semibold italic bg-white p-2.5 rounded-lg border border-slate-100">
                        "{q.question}"
                      </p>
                    </div>

                    {/* Question Uploaded Image Section */}
                    {q.imageUrl && (
                      <div className="space-y-1.5">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Farmer Uploaded Diagnostic Image:</span>
                        <div className="relative inline-block group overflow-hidden rounded-lg border border-slate-150 max-w-sm">
                          <img
                            src={q.imageUrl}
                            alt={`${q.crop} diagnostic sample`}
                            referrerPolicy="no-referrer"
                            className="h-28 w-44 object-cover group-hover:scale-105 transition-all duration-300 cursor-zoom-in"
                            onClick={() => window.open(q.imageUrl, "_blank")}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-[8px] text-white font-black uppercase tracking-wider px-2 py-1 bg-slate-900/80 rounded-md">View Original Image</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Footer Call-to-action */}
                    <button
                      onClick={() => {
                        setActiveQueryToAnswer(q);
                        setIsAnsweringQueries(true);
                        setReplyInput("");
                      }}
                      className="py-2 px-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 mt-2"
                    >
                      <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                      Formulate Treatment Advice
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Scientific Advisory feed (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-150 rounded-2xl p-5 shadow-3xs text-left space-y-4">
          <div className="flex justify-between items-center border-b border-slate-150 pb-3">
            <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <BookReadIcon className="h-4.5 w-4.5 text-emerald-600" />
              Sovereign Advisory Research
            </h3>
            <span className="text-[9px] bg-indigo-50 border border-indigo-150 text-indigo-700 font-black px-2 py-0.5 rounded-full uppercase">
              Community Hub
            </span>
          </div>

          <p className="text-[10px] text-slate-400 font-bold leading-normal">
            Scientific agronomical notes published on the public bulletin feed to guide cooperative smallholder bio-protection.
          </p>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {articles.map((art) => (
              <div key={art.id} className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl space-y-2.5">
                <div className="flex items-start justify-between">
                  <span className="text-[8px] uppercase font-black bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.2 rounded-md">
                    {art.category}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">{art.date}</span>
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800 leading-snug">{art.title}</h4>
                  <p className="text-[9px] text-slate-400 font-extrabold uppercase mt-0.5">Crop: {art.crop}</p>
                </div>
                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed line-clamp-3">
                  {art.content}
                </p>
                <div className="flex items-center gap-1.5 text-[9px] text-emerald-600 font-black uppercase">
                  <Activity className="h-3 w-3" />
                  <span>{art.reads} Reads</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2.2 PERFORMANCE, TRENDS & RATING DISTRIBUTION ANALYTICS DESK */}
      <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-3xs text-left space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-150 pb-4 gap-3">
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Sovereign Performance & Patient Analytics
            </h3>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">
              Real-time diagnostic consultation volume, revenue streams, and quality metrics over the last 30 days.
            </p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setTrendsTab("consultations")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                trendsTab === "consultations"
                  ? "bg-white text-emerald-800 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Consultations
            </button>
            <button
              onClick={() => setTrendsTab("revenue")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                trendsTab === "revenue"
                  ? "bg-white text-emerald-800 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Revenue Streams
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Column 1: Trend Charts (Line chart) - 6 cols */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                {trendsTab === "consultations" ? "Monthly Consultation Volume" : "Sovereign Revenue Trajectory"}
              </h4>
              <span className="text-[10px] text-emerald-600 font-black bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                {trendsTab === "consultations" ? "+28% Month-on-Month" : "+₹18,500 July Yield"}
              </span>
            </div>

            <div className="h-[260px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={(trendsTab === "consultations" ? consultationTrendsData : revenueTrendsData) as any[]}
                  margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 9, fontWeight: "bold" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 9, fontWeight: "bold" }}
                  />
                  <ChartTooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "10px",
                      fontWeight: "bold"
                    }}
                    labelStyle={{ color: "#94a3b8" }}
                  />
                  <Line
                    type="monotone"
                    dataKey={trendsTab === "consultations" ? "count" : "amount"}
                    stroke={trendsTab === "consultations" ? "#4f46e5" : "#059669"}
                    strokeWidth={3}
                    dot={{ fill: trendsTab === "consultations" ? "#4f46e5" : "#059669", strokeWidth: 1 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Column 2: Rating Distribution (Pie Chart) - 3 cols */}
          <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-6 flex flex-col justify-between">
            <div className="space-y-1">
              <h4 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                Farmer Rating Distribution
              </h4>
              <p className="text-[9px] text-slate-400 font-bold">
                Aggregated from {expertProfile.consultations || 148} digital endorsements.
              </p>
            </div>

            <div className="h-[150px] w-full relative flex items-center justify-center my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ratingDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {ratingDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "10px",
                      fontWeight: "bold"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                <span className="text-lg font-black text-slate-800 leading-none">
                  {expertProfile.rating || "4.9"}
                </span>
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Rating</span>
              </div>
            </div>

            <div className="space-y-1">
              {ratingDistributionData.slice(0, 3).map((r, i) => (
                <div key={i} className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5 font-bold text-slate-500">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.color }} />
                    <span>{r.name}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-700">{r.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Top Crops & Pathology Issues - 3 cols */}
          <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-6 space-y-3">
            <div>
              <h4 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                Top Crops & Bio-pathologies
              </h4>
              <p className="text-[9px] text-slate-400 font-bold">
                Most prevalent biological treatment interventions.
              </p>
            </div>

            <div className="space-y-3">
              {topCropsAndIssues.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-700 font-extrabold">{item.name}</span>
                    <span className="text-slate-400 text-[9px] font-mono">{item.cases} cases</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-slate-400">
                    <span>Crop: <span className="text-emerald-700 font-extrabold">{item.crop}</span></span>
                    <span>{item.percentage}% prevalence</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================================
          MODALS & DIALOG OVERLAYS
          ========================================================== */}
      <AnimatePresence>
        {/* 1. Answer Q&A Query Modal */}
        {isAnsweringQueries && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-slate-150 shadow-xl max-w-lg w-full overflow-hidden text-left"
            >
              <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-4 flex justify-between items-center">
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-emerald-300">Farmer Query Board</span>
                  <h3 className="font-black text-sm">Formulate Pathology Advice</h3>
                </div>
                <button
                  onClick={() => {
                    setIsAnsweringQueries(false);
                    setActiveQueryToAnswer(null);
                  }}
                  className="p-1 hover:bg-black/20 rounded-full text-white cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {activeQueryToAnswer ? (
                  <div className="space-y-4">
                    <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl text-xs text-left">
                      <div className="flex justify-between border-b border-slate-200/50 pb-1 mb-2 text-slate-400 text-[10px] font-black">
                        <span>FARMER: {activeQueryToAnswer.farmerName} ({activeQueryToAnswer.location})</span>
                        <span>CROP: {activeQueryToAnswer.crop}</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed italic font-semibold">"{activeQueryToAnswer.question}"</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase font-bold text-slate-400">Pathology Diagnosis & Bio-Remediation Plan</label>
                      <textarea
                        rows={5}
                        value={replyInput}
                        onChange={(e) => setReplyInput(e.target.value)}
                        placeholder="Specify biological treatments, active agent concentration (e.g. Trichoderma at 5g/L), application schedules, and precautions..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-500 text-slate-800 leading-relaxed font-semibold focus:bg-white"
                      />
                    </div>

                    <button
                      onClick={() => handlePostAnswer(activeQueryToAnswer.id)}
                      className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-3xs"
                    >
                      <CheckCircle className="h-4 w-4 text-emerald-300" />
                      Post Secure Treatment Advice
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-400 uppercase font-black">Choose Query to Resolve</p>
                    <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                      {pendingQueries
                        .filter((q) => !q.replied)
                        .map((q) => (
                          <div
                            key={q.id}
                            onClick={() => {
                              setActiveQueryToAnswer(q);
                              setReplyInput("");
                            }}
                            className="bg-slate-50 hover:bg-slate-100 border border-slate-150 p-3 rounded-xl cursor-pointer transition-all text-xs"
                          >
                            <div className="flex justify-between font-bold text-slate-700 mb-1">
                              <span>{q.farmerName} ({q.location})</span>
                              <span className="text-emerald-700 font-extrabold uppercase">{q.crop}</span>
                            </div>
                            <p className="text-slate-500 italic truncate font-medium">"{q.question}"</p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* 2. Video Call simulation Modal */}
        {isStartingVideoConsultation && (
          <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-slate-150 shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row text-left"
            >
              {activeConsultationToStart ? (
                <>
                  {/* Left Column: Live Webcam/Video Feed (6 cols relative) */}
                  <div className="md:w-[55%] bg-slate-950 p-4 relative flex flex-col justify-between min-h-[300px] md:min-h-[450px]">
                    {/* Top Status */}
                    <div className="flex justify-between items-center z-10">
                      <div className="flex items-center gap-1.5 bg-red-600 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                        LIVE CONSULTATION
                      </div>
                      <div className="bg-black/50 backdrop-blur-xs text-white text-xs font-mono px-2 py-0.5 rounded-md">
                        {formatTime(callDuration)}
                      </div>
                    </div>

                    {/* Camera Feed Area */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {!isVideoStopped ? (
                        <video
                          ref={localVideoRef}
                          autoPlay
                          playsInline
                          muted={isMuted}
                          className="w-full h-full object-cover opacity-85"
                        />
                      ) : (
                        <div className="text-center space-y-2">
                          <div className="h-14 w-14 rounded-full bg-white/10 flex items-center justify-center mx-auto border border-white/20">
                            <Video className="h-6 w-6 text-slate-500" />
                          </div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Video Feed Muted</p>
                        </div>
                      )}

                      {/* Fallback overlay graphic in case video fails to bind */}
                      {(!localVideoRef.current?.srcObject && !isVideoStopped) && (
                        <div className="text-center space-y-4 px-4 z-0">
                          <div className="relative flex items-center justify-center">
                            <span className="absolute h-16 w-16 bg-emerald-500/10 rounded-full animate-ping" />
                            <span className="absolute h-10 w-10 bg-emerald-500/20 rounded-full animate-pulse" />
                            <PhoneCall className="h-6 w-6 text-emerald-400 z-10" />
                          </div>
                          <div>
                            <p className="text-white font-black text-xs uppercase tracking-wider">
                              Biosecurity Encryption Active
                            </p>
                            <p className="text-[9px] text-slate-400 mt-1">
                              Securing high-resolution diagnosis frames from {activeConsultationToStart.farmerName}...
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom buttons strip */}
                    <div className="flex justify-center gap-3 z-10 pt-4">
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-2.5 rounded-full border cursor-pointer transition-all ${
                          isMuted ? "bg-red-600 text-white border-red-500" : "bg-white/15 text-white border-white/20 hover:bg-white/25"
                        }`}
                        title={isMuted ? "Unmute Mic" : "Mute Mic"}
                      >
                        <Globe className="h-4.5 w-4.5" /> {/* Mic proxy symbol */}
                      </button>
                      <button
                        onClick={() => setIsVideoStopped(!isVideoStopped)}
                        className={`p-2.5 rounded-full border cursor-pointer transition-all ${
                          isVideoStopped ? "bg-red-600 text-white border-red-500" : "bg-white/15 text-white border-white/20 hover:bg-white/25"
                        }`}
                        title={isVideoStopped ? "Start Video" : "Stop Video"}
                      >
                        <Video className="h-4.5 w-4.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Disconnect and discard this session's unsaved notes?")) {
                            setIsStartingVideoConsultation(false);
                            setActiveConsultationToStart(null);
                          }
                        }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 border border-red-500 text-white rounded-full text-[10px] font-black uppercase tracking-wider cursor-pointer"
                      >
                        Disconnect Call
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Case Management Notes (5 cols) */}
                  <div className="md:w-[45%] p-5 flex flex-col justify-between max-h-[450px] md:max-h-none overflow-y-auto bg-slate-50 border-t md:border-t-0 md:border-l border-slate-200">
                    <div className="space-y-4">
                      <div>
                        <span className="text-[8px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full uppercase">
                          Bio-Consult Case Desk
                        </span>
                        <h4 className="text-sm font-black text-slate-800 mt-1">{activeConsultationToStart.farmerName}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{activeConsultationToStart.location}</p>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-150 text-xs text-left">
                        <p className="text-[9px] uppercase font-black text-slate-400 mb-1">Reported Symptoms</p>
                        <p className="text-slate-700 font-semibold">{activeConsultationToStart.topic}</p>
                        <p className="text-[10px] text-slate-500 mt-1 italic">"{activeConsultationToStart.description}"</p>
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase font-bold text-slate-400">Pathological Recommendations (Advisory Notes)</label>
                        <textarea
                          rows={4}
                          value={consultationNotes}
                          onChange={(e) => setConsultationNotes(e.target.value)}
                          placeholder="Foliar spray instructions, biological pesticides dosage rate, irrigation calibrations..."
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-500 font-semibold text-slate-800 leading-relaxed"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleCompleteCall}
                      className="w-full mt-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-3xs flex items-center justify-center gap-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Sync and Dispatch Diagnostics
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-6 w-full text-center space-y-4">
                  <h3 className="font-black text-slate-800 text-sm uppercase">Select Consultation to Connect</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {upcomingConsultations.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setActiveConsultationToStart(c);
                          setConsultationNotes("");
                        }}
                        className="bg-slate-50 hover:bg-slate-100 border border-slate-200/60 p-4 rounded-xl cursor-pointer text-left space-y-1"
                      >
                        <p className="text-xs font-black text-slate-800">{c.farmerName}</p>
                        <p className="text-[10px] text-emerald-700 font-bold">{c.topic}</p>
                        <p className="text-[10px] text-slate-500">{c.date} • {c.slot}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* 3. View Farmer History Database Modal */}
        {isViewingFarmerHistory && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-slate-150 shadow-xl max-w-3xl w-full overflow-hidden text-left"
            >
              <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400">Cooperative Records</span>
                  <h3 className="font-black text-sm">National Smallholder Pathology Registry</h3>
                </div>
                <button
                  onClick={() => setIsViewingFarmerHistory(false)}
                  className="p-1 hover:bg-white/25 rounded-full text-white cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Search bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={farmerSearchQuery}
                    onChange={(e) => setFarmerSearchQuery(e.target.value)}
                    placeholder="Filter smallholders by name, crop type, or pathological history..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>

                <div className="overflow-x-auto border border-slate-150 rounded-xl bg-white">
                  <table className="w-full text-xs font-semibold text-slate-700 border-collapse">
                    <thead className="bg-slate-50 text-[9px] uppercase tracking-wider text-slate-400 border-b border-slate-150">
                      <tr>
                        <th className="p-3 text-left">Farmer Name</th>
                        <th className="p-3 text-left">Primary Crop</th>
                        <th className="p-3 text-left">Regional Location</th>
                        <th className="p-3 text-center">Consultations</th>
                        <th className="p-3 text-center">Trust Index</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {farmerHistoryDatabase
                        .filter(
                          (f) =>
                            f.name.toLowerCase().includes(farmerSearchQuery.toLowerCase()) ||
                            f.primaryCrop.toLowerCase().includes(farmerSearchQuery.toLowerCase()) ||
                            f.location.toLowerCase().includes(farmerSearchQuery.toLowerCase())
                        )
                        .map((f, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-3 text-slate-800 font-black">{f.name}</td>
                            <td className="p-3">
                              <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-100 text-[9px] font-black uppercase">
                                {f.primaryCrop}
                              </span>
                            </td>
                            <td className="p-3 text-slate-500">{f.location}</td>
                            <td className="p-3 text-center text-slate-800 font-mono font-bold">
                              {f.consultationsCount} cases
                            </td>
                            <td className="p-3 text-center">
                              <span className="text-emerald-700 font-bold font-mono">
                                {f.trustIndex}%
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* 4. Publish Advisory Article Modal */}
        {isPublishingArticle && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-slate-150 shadow-xl max-w-xl w-full overflow-hidden text-left"
            >
              <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-4 flex justify-between items-center">
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-emerald-300">Agronomical Advisory</span>
                  <h3 className="font-black text-sm">Publish Community Advisory Note</h3>
                </div>
                <button
                  onClick={() => setIsPublishingArticle(false)}
                  className="p-1 hover:bg-black/20 rounded-full text-white cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newArticleTitle.trim() || !newArticleContent.trim() || !newArticleCrop.trim()) {
                    alert("Please fill out the advisory title, target crop, and advisory advisory note text content.");
                    return;
                  }
                  const newArtObj = {
                    id: `art-${Date.now()}`,
                    title: newArticleTitle,
                    crop: newArticleCrop,
                    content: newArticleContent,
                    category: newArticleCategory,
                    reads: 0,
                    date: new Date().toISOString().split("T")[0]
                  };
                  const updated = [newArtObj, ...articles];
                  setArticles(updated);
                  localStorage.setItem("agriconnect_expert_articles", JSON.stringify(updated));
                  alert(`Research article published successfully to public bulletin feed! Smallholders have been notified.`);
                  setIsPublishingArticle(false);
                }}
                className="p-5 space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-slate-400">Advisory Note Title</label>
                  <input
                    type="text"
                    value={newArticleTitle}
                    onChange={(e) => setNewArticleTitle(e.target.value)}
                    placeholder="e.g. Remedial foliar sprays for Tomato Early Blight"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-700">
                  <div className="space-y-1.5 text-left">
                    <label className="block text-[10px] uppercase font-bold text-slate-400">Target Crop</label>
                    <input
                      type="text"
                      value={newArticleCrop}
                      onChange={(e) => setNewArticleCrop(e.target.value)}
                      placeholder="e.g. Tomato / Rice Paddy"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500 font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="block text-[10px] uppercase font-bold text-slate-400">Scientific Category</label>
                    <select
                      value={newArticleCategory}
                      onChange={(e) => setNewArticleCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500 font-semibold cursor-pointer"
                    >
                      <option value="Bio-Remediation">Bio-Remediation</option>
                      <option value="Soil Science">Soil Science</option>
                      <option value="Pest Management">Pest Management</option>
                      <option value="Monsoon Mitigation">Monsoon Mitigation</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-slate-400">Advisory Advisory Text</label>
                  <textarea
                    rows={5}
                    value={newArticleContent}
                    onChange={(e) => setNewArticleContent(e.target.value)}
                    placeholder="Type scientific evidence, dose guidelines, environmental constraints, and peer reference notes..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-500 font-semibold text-slate-800 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-3xs"
                >
                  Publish Advisory live
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* 5. Set Availability Modal */}
        {isUpdatingAvailability && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-slate-150 shadow-xl max-w-md w-full overflow-hidden text-left"
            >
              <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400">Schedule Calibrations</span>
                  <h3 className="font-black text-sm">Update Consultation Hours & Pricing</h3>
                </div>
                <button
                  onClick={() => setIsUpdatingAvailability(false)}
                  className="p-1 hover:bg-white/25 rounded-full text-white cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs font-semibold text-slate-700">
                {/* Live Status */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-slate-400">Online Status Mode</label>
                  <select
                    value={tempStatus}
                    onChange={(e) => setTempStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="Online">Online (Ready to Accept Video Consultations)</option>
                    <option value="Busy">Busy (Available for Text-only queries)</option>
                    <option value="Offline">Offline (Unavailable)</option>
                  </select>
                </div>

                {/* Pricing rate */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-slate-400">Hourly Consult Fee (₹)</label>
                  <input
                    type="number"
                    value={tempRate}
                    onChange={(e) => setTempRate(e.target.value)}
                    placeholder="500"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                  />
                </div>

                {/* Days */}
                <div className="space-y-1.5 text-left">
                  <label className="block text-[10px] uppercase font-bold text-slate-400">Active Working Days</label>
                  <div className="grid grid-cols-3 gap-2 pt-1 text-[10px]">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
                      <button
                        type="button"
                        key={d}
                        onClick={() => {
                          if (tempDays.includes(d)) {
                            setTempDays(tempDays.filter((day) => day !== d));
                          } else {
                            setTempDays([...tempDays, d]);
                          }
                        }}
                        className={`py-1 rounded border font-bold ${
                          tempDays.includes(d) ? "bg-emerald-50 border-emerald-300 text-emerald-800" : "bg-white border-slate-200 text-slate-500"
                        }`}
                      >
                        {d.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active slots */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-slate-400">Working Hours Block</label>
                  <input
                    type="text"
                    value={tempHours}
                    onChange={(e) => setTempHours(e.target.value)}
                    placeholder="09:00 AM - 05:00 PM"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => {
                    const updatedAvail = {
                      onlineStatus: tempStatus,
                      hourlyRate: tempRate,
                      days: tempDays,
                      hours: tempHours,
                      responseTime: tempStatus === "Online" ? "45 mins" : "3 hours"
                    };
                    setAvailability(updatedAvail);
                    localStorage.setItem("agriconnect_expert_availability", JSON.stringify(updatedAvail));
                    alert("Consultation availability parameters updated live across all registries!");
                    setIsUpdatingAvailability(false);
                  }}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-3xs"
                >
                  Save Active Availability Schedule
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Inline fallback for missing imports or custom sub-components
function BookReadIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
      <path d="M6 6h10" />
      <path d="M6 10h10" />
    </svg>
  );
}
