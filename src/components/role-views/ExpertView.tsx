import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BrainCircuit,
  ClipboardList,
  CheckCircle,
  FileText,
  UserCheck,
  AlertTriangle,
  Award,
  Sparkles,
  BookOpen,
  LogOut,
  User,
  Fingerprint,
  Laptop,
  Smartphone,
  Key,
  ShieldAlert,
  ShieldCheck,
  Check,
  Lock,
  Shield,
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
  BookMarked
} from "lucide-react";
import { CropDiagnostic } from "../../types";
import MLPredictionHub from "../analytics/MLPredictionHub";
import ExpertAuthOnboarding from "./ExpertAuthOnboarding";
import ExpertDashboardOverview from "./ExpertDashboardOverview";
import ExpertQAGateway from "./ExpertQAGateway";
import ExpertVideoConsultations from "./ExpertVideoConsultations";
import ExpertAIResearchLabs from "./ExpertAIResearchLabs";
import ExpertRevenuePayments from "./ExpertRevenuePayments";
import ExpertKnowledgeHub from "./ExpertKnowledgeHub";
import ExpertFarmerRelationships from "./ExpertFarmerRelationships";
import ExpertWebinarsWorkshops from "./ExpertWebinarsWorkshops";

interface ExpertViewProps {
  diagnostics: CropDiagnostic[];
  onUpdateDiagnostic: (id: string, updated: Partial<CropDiagnostic>) => void;
}

export default function ExpertView({ diagnostics, onUpdateDiagnostic }: ExpertViewProps) {
  // Session-aware active expert profile
  const [expertProfile, setExpertProfile] = useState<any>(() => {
    const saved = localStorage.getItem("agriconnect_expert_profile");
    return saved ? JSON.parse(saved) : null;
  });

  // Dynamic Tier Calculation
  const getVerificationTier = (profile: any) => {
    if (!profile) return "None";
    const hasBronze = profile.mobile && profile.email && profile.aadhaar && profile.aadhaar !== "xxxx-xxxx-xxxx";
    const hasSilver = hasBronze && profile.degree && profile.certifications;
    const hasGold = hasSilver && profile.recommendations && profile.recommendations.filter(Boolean).length > 0 && profile.govtRegNo && profile.govtRegNo !== "GOVT-REG-PENDING";
    const hasPlatinum = hasGold && (profile.rating >= 4.9 || profile.rating === undefined) && (profile.consultations >= 150 || profile.consultations === undefined);

    if (hasPlatinum) return "Platinum";
    if (hasGold) return "Gold";
    if (hasSilver) return "Silver";
    if (hasBronze) return "Bronze";
    return "None";
  };

  const getMilestones = (profile: any) => {
    if (!profile) return [];
    
    const hasMobile = !!profile.mobile;
    const hasEmail = !!profile.email;
    const hasAadhaar = profile.aadhaar && profile.aadhaar !== "xxxx-xxxx-xxxx";
    
    const hasDegree = !!profile.degree;
    const hasCerts = !!profile.certifications;
    
    const hasRecs = profile.recommendations && profile.recommendations.filter(Boolean).length > 0;
    const hasGovReg = profile.govtRegNo && profile.govtRegNo !== "GOVT-REG-PENDING";
    
    const hasRating = profile.rating !== undefined ? profile.rating >= 4.9 : true;
    const hasConsultations = profile.consultations !== undefined ? profile.consultations >= 150 : true;

    return [
      {
        tier: "Bronze",
        label: "Basic Verification",
        satisfied: !!(hasMobile && hasEmail && hasAadhaar),
        items: [
          { name: "Registered Mobile Number", status: hasMobile, value: profile.mobile || "Not Provided" },
          { name: "Academic or Work Email Address", status: hasEmail, value: profile.email || "Not Provided" },
          { name: "Aadhaar Identity Verification", status: hasAadhaar, value: hasAadhaar ? profile.aadhaar : "Pending Upload" }
        ]
      },
      {
        tier: "Silver",
        label: "Professional Verification",
        satisfied: !!(hasMobile && hasEmail && hasAadhaar && hasDegree && hasCerts),
        items: [
          { name: "University / Academic Degrees", status: hasDegree, value: profile.degree || "Pending Document Verify" },
          { name: "Certified Agronomist / Pathology License", status: hasCerts, value: profile.certifications || "Pending License Upload" }
        ]
      },
      {
        tier: "Gold",
        label: "Expert Verification",
        satisfied: !!(hasMobile && hasEmail && hasAadhaar && hasDegree && hasCerts && hasRecs && hasGovReg),
        items: [
          { name: "Peer-Reviewed Institutional Recommendations", status: hasRecs, value: hasRecs ? profile.recommendations.join(", ") : "Pending Endorsements" },
          { name: "Government Recognized Registry Registration", status: hasGovReg, value: hasGovReg ? profile.govtRegNo : "Pending Board Sign-off" }
        ]
      },
      {
        tier: "Platinum",
        label: "Platinum Elite status (Top 1%)",
        satisfied: !!(hasMobile && hasEmail && hasAadhaar && hasDegree && hasCerts && hasRecs && hasGovReg && hasRating && hasConsultations),
        items: [
          { name: "Farmer Trust Rating (Required >= 4.9)", status: hasRating, value: `Current Rating: ${profile.rating || 5.0} ★` },
          { name: "Consultation Volume (Required >= 150 solved cases)", status: hasConsultations, value: `Solved Cases: ${profile.consultations || 0} / 150` }
        ]
      }
    ];
  };

  // State hook declarations for simulating verification details
  const [isEditingCredentials, setIsEditingCredentials] = useState(false);
  const [editAadhaar, setEditAadhaar] = useState("");
  const [editDegree, setEditDegree] = useState("");
  const [editCertifications, setEditCertifications] = useState("");
  const [editGovtRegNo, setEditGovtRegNo] = useState("");
  const [editRecommendations, setEditRecommendations] = useState("");
  const [editRating, setEditRating] = useState<number>(4.9);
  const [editConsultations, setEditConsultations] = useState<number>(162);

  // Navigation Tabs state
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "diagnosis"
    | "registry"
    | "security"
    | "ml"
    | "qa"
    | "video"
    | "research"
    | "revenue"
    | "knowledge"
    | "farmers"
    | "webinars"
  >("dashboard");

  // State hooks for Q&A pending queries
  const [pendingQueries, setPendingQueries] = useState<any[]>([
    {
      id: "q-1",
      farmerName: "Suresh Patil",
      location: "Nashik, MH",
      crop: "Grapes",
      title: "Grape leaves margins turning yellow and curling",
      question: "The edges of grape leaves are turning yellow and curling slightly downward. I am worried it is downy mildew or potash deficiency. Please recommend organic treatment.",
      priority: "Medium",
      issueType: "Disease",
      timeAgo: "6 hours ago",
      date: "2026-07-18",
      imageUrl: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80",
      replied: false,
      replyText: ""
    },
    {
      id: "q-2",
      farmerName: "Anjali Menon",
      location: "Palakkad, KL",
      crop: "Coconut Palm",
      title: "White powdery patches under coconut leaves",
      question: "White powdery spots are appearing on lower fronds of young coconut trees. Is copper oxychloride spray safe under monsoon conditions?",
      priority: "Low",
      issueType: "Pest",
      timeAgo: "1 day ago",
      date: "2026-07-17",
      replied: false,
      replyText: ""
    },
    {
      id: "q-3",
      farmerName: "Eswar Reddy",
      location: "Chittoor, AP",
      crop: "Tomato",
      title: "Dark brown ring spots on tomatoes",
      question: "I see dark brown lesions with concentric rings on my early stage tomato crop. What is the dosage of Trichoderma viride biological spray?",
      priority: "High",
      issueType: "Disease",
      timeAgo: "2 days ago",
      date: "2026-07-16",
      imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80",
      replied: false,
      replyText: ""
    },
    {
      id: "q-4",
      farmerName: "Baldev Singh",
      location: "Amritsar, PB",
      crop: "Wheat",
      title: "Suspected Wheat Leaf Rust",
      question: "Orange-brown pustules found across leaves of HD 3086 variety. Spreading very rapidly in the morning fog. Urgent organic cure needed!",
      priority: "High",
      issueType: "Disease",
      timeAgo: "4 hours ago",
      date: "2026-07-18",
      imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
      replied: false,
      replyText: ""
    },
    {
      id: "q-5",
      farmerName: "Venkata Rao",
      location: "Guntur, AP",
      crop: "Cotton",
      title: "Cotton sucking pest whitefly infestation",
      question: "Sucking pests have covered the undersides of cotton leaves. Yellowing is intense and honeydew mold is beginning to form on leaves.",
      priority: "High",
      issueType: "Pest",
      timeAgo: "12 hours ago",
      date: "2026-07-18",
      replied: false,
      replyText: ""
    },
    {
      id: "q-6",
      farmerName: "Ramesh Kumar",
      location: "Bikaner, RJ",
      crop: "Rice",
      title: "Rice seedling tip burn & high soil salinity",
      question: "Recent canal water supply was delayed. Soil is showing cracked salt crusts and rice seedling tips are burnt.",
      priority: "Medium",
      issueType: "Soil",
      timeAgo: "3 days ago",
      date: "2026-07-15",
      replied: false,
      replyText: ""
    },
    {
      id: "q-7",
      farmerName: "Karthik Raja",
      location: "Salem, TN",
      crop: "Tapioca",
      title: "Organic magnesium deficiency mitigation",
      question: "Is magnesium sulphate application safe when combined with organic neem cake? Soil reports show mild deficiency.",
      priority: "Low",
      issueType: "Fertilizer",
      timeAgo: "5 days ago",
      date: "2026-07-13",
      replied: false,
      replyText: ""
    }
  ]);

  // Upcoming consultations
  const [upcomingConsultations, setUpcomingConsultations] = useState<any[]>(() => {
    const saved = localStorage.getItem("agriconnect_booked_consultations");
    const userBookings = saved ? JSON.parse(saved) : [];
    const defaults = [
      {
        id: "SOV-BOOK-9010",
        farmerName: "Ram Singh",
        location: "Ludhiana, PB",
        mode: "video",
        date: "Today",
        slot: "02:00 PM - 03:00 PM",
        topic: "Rice Leaf Folder Outbreak Review",
        description: "Infected patches visible in 1/2 acre. Need quick bio-pest controls.",
        status: "Scheduled"
      },
      {
        id: "SOV-BOOK-9011",
        farmerName: "Vikram Gaikwad",
        location: "Satara, MH",
        mode: "voice",
        date: "Tomorrow",
        slot: "11:00 AM - 12:00 PM",
        topic: "Soil Micro-Nutrient Optimization",
        description: "Recent soil lab test report review.",
        status: "Scheduled"
      }
    ];
    return [...userBookings, ...defaults];
  });

  // Research Advisory Articles
  const [articles, setArticles] = useState<any[]>(() => {
    const saved = localStorage.getItem("agriconnect_expert_articles");
    return saved ? JSON.parse(saved) : [
      {
        id: "art-1",
        title: "Managing Downy Mildew of Grapes with Trichoderma Sprays",
        crop: "Grapes",
        content: "Downy mildew caused by Plasmopara viticola is a highly destructive disease in vineyards. Using bio-agents like Trichoderma viride at a rate of 5g/L of water when humidity exceeds 80% shows 92% efficacy in pre-emptive defense...",
        date: "2026-07-10",
        reads: 245,
        category: "Bio-Remediation"
      },
      {
        id: "art-2",
        title: "Micro-Nutrient Remediation for Red Soil Tracts",
        crop: "General Soil",
        content: "Red soils often suffer from zinc and boron deficiencies. A balanced micro-nutrient foliar application of Zinc Sulphate (0.5%) paired with Borax (0.2%) under overcast skies maximizes absorption and prevents cell-wall rupture in tubers...",
        date: "2026-06-28",
        reads: 189,
        category: "Soil Science"
      }
    ];
  });

  // Availability state
  const [availability, setAvailability] = useState(() => {
    const saved = localStorage.getItem("agriconnect_expert_availability");
    return saved ? JSON.parse(saved) : {
      onlineStatus: "Online",
      hourlyRate: "500",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      hours: "09:00 AM - 05:00 PM",
      responseTime: "45 mins"
    };
  });

  // Farmer Profiles History Database
  const farmerHistoryDatabase = [
    { name: "Suresh Patil", location: "Nashik, MH", trustIndex: 94, consultationsCount: 5, primaryCrop: "Grapes", recentDiagnosis: "Downy Mildew" },
    { name: "Anjali Menon", location: "Palakkad, KL", trustIndex: 88, consultationsCount: 3, primaryCrop: "Coconut Palm", recentDiagnosis: "Leaf Powdery Spot" },
    { name: "Ram Singh", location: "Ludhiana, PB", trustIndex: 96, consultationsCount: 12, primaryCrop: "Rice", recentDiagnosis: "Leaf Folder" },
    { name: "Vikram Gaikwad", location: "Satara, MH", trustIndex: 91, consultationsCount: 4, primaryCrop: "Tomato", recentDiagnosis: "Early Blight" },
    { name: "Ramesh Singh", location: "Varanasi, UP", trustIndex: 95, consultationsCount: 6, primaryCrop: "Wheat", recentDiagnosis: "Puccinia Rust" },
    { name: "Harpreet Kaur", location: "Amritsar, PB", trustIndex: 98, consultationsCount: 15, primaryCrop: "Cotton", recentDiagnosis: "Whitefly Outbreak" }
  ];

  // Overlay state managers
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

  // Earnings calculations
  const [earnedBonus, setEarnedBonus] = useState(0);
  const thisMonthEarnings = 18400 + earnedBonus;

  // Farm Credit Score calculator helper
  const calculateCreditScore = () => {
    const rating = expertProfile?.rating || 4.9;
    const ratingBase = rating * 19; // 4.9 * 19 = 93.1
    const resolvedCount = pendingQueries.filter(q => q.replied).length;
    const score = Math.min(100, Math.round(ratingBase + (resolvedCount * 2) + (upcomingConsultations.length * 0.5)));
    return score;
  };

  // Video call duration timer
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

  // Sync edit credentials when profile loads
  useEffect(() => {
    if (expertProfile) {
      setEditAadhaar(expertProfile.aadhaar || "");
      setEditDegree(expertProfile.degree || "");
      setEditCertifications(expertProfile.certifications || "");
      setEditGovtRegNo(expertProfile.govtRegNo || "");
      setEditRecommendations(expertProfile.recommendations?.join(", ") || "");
      setEditRating(expertProfile.rating !== undefined ? expertProfile.rating : 4.9);
      setEditConsultations(expertProfile.consultations !== undefined ? expertProfile.consultations : 162);
    }
  }, [expertProfile]);

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    const recsArray = editRecommendations.split(",").map(r => r.trim()).filter(Boolean);
    const updated = {
      ...expertProfile,
      aadhaar: editAadhaar,
      degree: editDegree,
      certifications: editCertifications,
      govtRegNo: editGovtRegNo,
      recommendations: recsArray,
      rating: parseFloat(editRating as any) || 0,
      consultations: parseInt(editConsultations as any) || 0
    };
    setExpertProfile(updated);
    localStorage.setItem("agriconnect_expert_profile", JSON.stringify(updated));
    setIsEditingCredentials(false);
    alert("Official Verification Credentials updated and synced successfully! Re-calculating status tier...");
  };

  const renderBadge = (tier: string) => {
    switch (tier) {
      case "Platinum":
        return (
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white border border-violet-400 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm animate-pulse">
            <Sparkles className="h-2.5 w-2.5 text-yellow-300 fill-current" />
            Platinum
          </span>
        );
      case "Gold":
        return (
          <span className="inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
            <Sparkles className="h-2.5 w-2.5 text-yellow-400 fill-current" />
            Gold
          </span>
        );
      case "Silver":
        return (
          <span className="inline-flex items-center gap-1 bg-slate-300/20 text-slate-200 border border-slate-300/40 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
            <Award className="h-2.5 w-2.5 text-slate-300" />
            Silver
          </span>
        );
      case "Bronze":
        return (
          <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
            <Award className="h-2.5 w-2.5 text-amber-400" />
            Bronze
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-300 border border-red-500/40 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
            Unverified
          </span>
        );
    }
  };

  // Active Device sessions state
  const [sessions, setSessions] = useState<Array<{ id: string; device: string; ip: string; location: string; active: boolean; icon: "Laptop" | "Smartphone" }>>(() => {
    const saved = localStorage.getItem("agriconnect_expert_sessions");
    if (saved) return JSON.parse(saved);
    return [
      { id: "sess-1", device: "Chrome on macOS (Current Device)", ip: "192.168.1.102", location: "New Delhi, IN", active: true, icon: "Laptop" },
      { id: "sess-2", device: "Safari on iPhone 15 Pro", ip: "103.45.22.18", location: "Pune, IN", active: false, icon: "Smartphone" },
      { id: "sess-3", device: "Chrome on Windows 11 Workspace", ip: "203.111.45.92", location: "Hyderabad, IN", active: false, icon: "Laptop" }
    ];
  });

  useEffect(() => {
    localStorage.setItem("agriconnect_expert_sessions", JSON.stringify(sessions));
  }, [sessions]);

  const terminateSession = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    alert("Official secure token invalidated. Device session terminated successfully.");
  };

  const logoutAllOtherDevices = () => {
    const updated = sessions.filter((s) => s.active);
    setSessions(updated);
    alert("Sovereign session gateway: All other devices logged out.");
  };

  const [selectedDiag, setSelectedDiag] = useState<CropDiagnostic | null>(null);
  const [expertNotes, setExpertNotes] = useState("");

  const handleVerify = (id: string) => {
    if (!expertNotes.trim()) {
      alert("Please enter pathological verification notes.");
      return;
    }
    const signature = expertProfile 
      ? `${expertProfile.name} (${expertProfile.designation})`
      : "Dr. Rachel Carter (Senior Plant Pathologist)";

    onUpdateDiagnostic(id, {
      status: "Expert Verified",
      expertName: signature,
      expertNotes,
      expertTier: getVerificationTier(expertProfile)
    });
    setSelectedDiag(null);
    setExpertNotes("");
  };

  // Render onboarding/auth wrapper if not logged in
  if (!expertProfile) {
    return (
      <div id="expert-onboarding-wrapper" className="py-2">
        <ExpertAuthOnboarding onComplete={(profile) => setExpertProfile(profile)} />
      </div>
    );
  }

  return (
    <div id="expert-workspace" className="space-y-6">
      {/* Banner with Active Expert Profile details and log out button */}
      <div className="bg-gradient-to-r from-emerald-800 to-indigo-900 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-700/50 rounded-xl">
              <Award className="h-6 w-6 text-emerald-200" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Agricultural Pathology Clinic</h2>
          </div>
          <p className="text-emerald-100/90 text-xs max-w-xl">
            Review Gemini AI crop pathology scans, verify pathogen classifications, and append custom biological treatments for smallholders requiring specialized oversight.
          </p>

          {/* Connected Expert profile card */}
          <div className="flex items-center gap-3 pt-3.5 mt-3 border-t border-emerald-700/40">
            {expertProfile.photoUrl ? (
              <img
                src={expertProfile.photoUrl}
                alt={expertProfile.name}
                referrerPolicy="no-referrer"
                className="h-10 w-10 rounded-full object-cover border-2 border-emerald-400 shrink-0"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-emerald-700/80 border-2 border-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
                {expertProfile.name?.charAt(0) || "E"}
              </div>
            )}
            <div className="text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs font-black text-white">{expertProfile.name}</p>
                {renderBadge(getVerificationTier(expertProfile))}
              </div>
              <p className="text-[10px] text-emerald-200 font-medium">
                {expertProfile.designation} • <span className="italic">{expertProfile.department}</span>
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {expertProfile.specializations?.map((spec: string) => (
                  <span key={spec} className="bg-emerald-950/60 text-emerald-300 text-[8px] font-black uppercase px-1.5 py-0.2 rounded border border-emerald-850">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 font-semibold text-center text-sm">
          <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 text-center min-w-[100px] w-full sm:w-auto">
            <p className="text-[10px] text-emerald-200 uppercase tracking-widest font-semibold">Pending Audits</p>
            <p className="text-lg font-bold">{diagnostics.filter((d) => d.status === "AI Diagnosed").length} Scans</p>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 text-center min-w-[100px] w-full sm:w-auto">
            <p className="text-[10px] text-emerald-200 uppercase tracking-widest font-semibold">Total Signed Off</p>
            <p className="text-lg font-bold">{diagnostics.filter((d) => d.status === "Expert Verified").length} Solved</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("agriconnect_expert_profile");
              setExpertProfile(null);
            }}
            className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm w-full sm:w-auto shrink-0"
            title="Log out from Expert Workspace"
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Modern High-Contrast Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200/80 pb-3">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "dashboard"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Dashboard Overview</span>
        </button>
        <button
          onClick={() => setActiveTab("diagnosis")}
          className={`px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "diagnosis"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <BrainCircuit className="h-4 w-4" />
          <span>Diagnosis Desk</span>
          {diagnostics.filter((d) => d.status === "AI Diagnosed").length > 0 && (
            <span className="bg-red-500 text-white text-[8px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
              {diagnostics.filter((d) => d.status === "AI Diagnosed").length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("qa")}
          className={`px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "qa"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Q&A Portal</span>
          {pendingQueries.filter(q => !q.replied).length > 0 && (
            <span className="bg-amber-500 text-white text-[8px] px-1.5 py-0.2 rounded-full font-black">
              {pendingQueries.filter(q => !q.replied).length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("video")}
          className={`px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "video"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Video className="h-4 w-4" />
          <span>Video Consultations</span>
          {upcomingConsultations.length > 0 && (
            <span className="bg-emerald-600 text-white text-[8px] px-1.5 py-0.2 rounded-full font-black">
              {upcomingConsultations.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("research")}
          className={`px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "research"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>AI Research Labs</span>
        </button>
        <button
          onClick={() => setActiveTab("knowledge")}
          className={`px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "knowledge"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <BookMarked className="h-4 w-4" />
          <span>Knowledge Hub</span>
        </button>
        <button
          onClick={() => setActiveTab("farmers")}
          className={`px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "farmers"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>My Farmers</span>
        </button>
        <button
          onClick={() => setActiveTab("webinars")}
          className={`px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "webinars"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>Workshops</span>
        </button>
        <button
          onClick={() => setActiveTab("revenue")}
          className={`px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "revenue"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <DollarSign className="h-4 w-4" />
          <span>Revenue & Payouts</span>
        </button>
        <button
          onClick={() => setActiveTab("registry")}
          className={`px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "registry"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Award className="h-4 w-4" />
          <span>Registry & Verification</span>
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "security"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          <span>Security Sandbox</span>
        </button>
        <button
          onClick={() => setActiveTab("ml")}
          className={`px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "ml"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>ML Co-Pilot</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "dashboard" && (
          <motion.div
            key="dashboard-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            <ExpertDashboardOverview
              expertProfile={expertProfile}
              pendingQueries={pendingQueries}
              setPendingQueries={setPendingQueries}
              upcomingConsultations={upcomingConsultations}
              setUpcomingConsultations={setUpcomingConsultations}
              articles={articles}
              setArticles={setArticles}
              availability={availability}
              setAvailability={setAvailability}
              earnedBonus={earnedBonus}
              setEarnedBonus={setEarnedBonus}
              setActiveTab={setActiveTab}
              diagnosticsCount={diagnostics.filter((d) => d.status === "AI Diagnosed").length}
              solvedCount={diagnostics.filter((d) => d.status === "Expert Verified").length}
            />
          </motion.div>
        )}

        {activeTab === "registry" && (
          <motion.div
            key="registry-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            {/* Dynamic Verification Status & Badges Tracker */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
          <div>
            <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
              Expert Verification & Registry Status
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Verify your professional credentials, track your trust tier badge, and view milestones required for elite status.
            </p>
          </div>
          <button
            onClick={() => setIsEditingCredentials(!isEditingCredentials)}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/50 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
          >
            {isEditingCredentials ? "Cancel Updates" : "Edit Verification Credentials"}
          </button>
        </div>

        {isEditingCredentials ? (
          <form onSubmit={handleSaveCredentials} className="bg-slate-50/50 p-4 rounded-xl border border-slate-150 space-y-4 animate-in fade-in duration-200">
            <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
              Verify Credentials Registry
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold text-slate-700">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-slate-400">Aadhaar Identity</label>
                <input
                  type="text"
                  value={editAadhaar}
                  onChange={(e) => setEditAadhaar(e.target.value)}
                  placeholder="e.g. 1234-5678-9012"
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-slate-400">Degrees</label>
                <input
                  type="text"
                  value={editDegree}
                  onChange={(e) => setEditDegree(e.target.value)}
                  placeholder="e.g. PhD in Plant Pathology"
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-slate-400">Certifications</label>
                <input
                  type="text"
                  value={editCertifications}
                  onChange={(e) => setEditCertifications(e.target.value)}
                  placeholder="e.g. ICAR Certified Pathologist"
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-slate-400">Gov Registry No</label>
                <input
                  type="text"
                  value={editGovtRegNo}
                  onChange={(e) => setEditGovtRegNo(e.target.value)}
                  placeholder="e.g. ICAR-PATH-2026-9810"
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="block text-[10px] uppercase font-bold text-slate-400">Peer Recommendations (Emails, Comma-Separated)</label>
                <input
                  type="text"
                  value={editRecommendations}
                  onChange={(e) => setEditRecommendations(e.target.value)}
                  placeholder="e.g. dr.sharma@icar.org.in, prof.patil@agriuni.edu"
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-slate-400">Simulate Trust Rating</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={editRating}
                  onChange={(e) => setEditRating(parseFloat(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-slate-400">Simulate Consultations</label>
                <input
                  type="number"
                  value={editConsultations}
                  onChange={(e) => setEditConsultations(parseInt(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingCredentials(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="h-3.5 w-3.5" /> Save and Sync Credentials
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Col: Big Active Badge Showcase (4 cols) */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-150 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-3">
              <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">
                Current Trust Tier
              </span>
              <div className="relative p-4 rounded-full bg-white shadow-2xs border border-slate-100">
                {getVerificationTier(expertProfile) === "Platinum" && (
                  <div className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-slate-900 text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full animate-bounce shadow-xs">
                    ★ Top 1%
                  </div>
                )}
                <div className={`h-16 w-16 rounded-full flex items-center justify-center border-2 ${
                  getVerificationTier(expertProfile) === "Platinum" ? "bg-gradient-to-r from-violet-600 to-indigo-600 border-violet-300" :
                  getVerificationTier(expertProfile) === "Gold" ? "bg-yellow-100 border-yellow-400 text-yellow-700" :
                  getVerificationTier(expertProfile) === "Silver" ? "bg-slate-100 border-slate-400 text-slate-700" :
                  getVerificationTier(expertProfile) === "Bronze" ? "bg-amber-100 border-amber-500 text-amber-800" :
                  "bg-red-50 border-red-300 text-red-600"
                }`}>
                  {getVerificationTier(expertProfile) === "Platinum" ? (
                    <Sparkles className="h-9 w-9 text-yellow-300 animate-pulse fill-current" />
                  ) : getVerificationTier(expertProfile) === "Gold" ? (
                    <Sparkles className="h-9 w-9 text-yellow-500 fill-current" />
                  ) : (
                    <Award className="h-9 w-9 text-current" />
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-black text-slate-800 flex items-center justify-center gap-1.5">
                  {getVerificationTier(expertProfile)} Verified
                </h4>
                <p className="text-[10px] text-slate-400 mt-1 max-w-xs font-semibold leading-relaxed">
                  {getVerificationTier(expertProfile) === "Platinum" && "Elite tier recognized as topmost agricultural advisor with flawless credentials & consultations."}
                  {getVerificationTier(expertProfile) === "Gold" && "Institutional peer endorsements and national agricultural registry verification active."}
                  {getVerificationTier(expertProfile) === "Silver" && "Verified academic qualifications & plant pathology license verified."}
                  {getVerificationTier(expertProfile) === "Bronze" && "Basic identity verification completed. Ready for standard diagnostic reviews."}
                  {getVerificationTier(expertProfile) === "None" && "Please upload or complete credentials verify checklist to unlock trust badge."}
                </p>
              </div>

              {/* Farmer View Trust Signal Demo */}
              <div className="w-full pt-2 border-t border-slate-200/50">
                <p className="text-[9px] text-emerald-600 font-bold flex items-center justify-center gap-1">
                  <ShieldCheck className="h-3 w-3 shrink-0" />
                  Trust Badge displayed live to farmers
                </p>
              </div>
            </div>

            {/* Right Col: Interactive Milestones Checklist (8 cols) */}
            <div className="lg:col-span-8 space-y-3.5">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Verification Tier Milestones Progress
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getMilestones(expertProfile).map((tierItem) => (
                  <div
                    key={tierItem.tier}
                    className={`p-3 rounded-xl border text-xs flex flex-col justify-between ${
                      tierItem.satisfied
                        ? "bg-emerald-50/40 border-emerald-200/50"
                        : "bg-slate-50/50 border-slate-200/60"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between font-bold border-b border-slate-100 pb-1.5 mb-2">
                        <span className={`uppercase text-[9px] font-black ${
                          tierItem.satisfied ? "text-emerald-700" : "text-slate-400"
                        }`}>
                          {tierItem.tier} Status
                        </span>
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-md ${
                          tierItem.satisfied ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                        }`}>
                          {tierItem.satisfied ? "Active" : "Locked"}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold mb-2 uppercase tracking-wide">
                        {tierItem.label}
                      </p>
                      <ul className="space-y-1.5 text-[10px]">
                        {tierItem.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between items-start gap-2">
                            <span className="text-slate-600 font-medium leading-none flex items-center gap-1 text-left">
                              {item.status ? (
                                <CheckCircle className="h-3 w-3 text-emerald-600 shrink-0" />
                              ) : (
                                <Lock className="h-3 w-3 text-slate-400 shrink-0" />
                              )}
                              {item.name}
                            </span>
                            <span className={`text-[9px] text-right font-mono font-bold truncate max-w-[120px] ${
                              item.status ? "text-slate-700" : "text-slate-400"
                            }`} title={item.value}>
                              {item.value}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        </div>
      </motion.div>
    )}

        {activeTab === "diagnosis" && (
          <motion.div
            key="diagnosis-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left"
          >
        {/* Verification Queue (Left) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <ClipboardList className="h-4.5 w-4.5 text-emerald-600" />
              Pathology Audit Queue
            </h3>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
              AI Hand-off
            </span>
          </div>

          <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
            {diagnostics.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No pathology tickets active.</p>
            ) : (
              diagnostics.map((diag) => (
                <div
                  key={diag.id}
                  onClick={() => {
                    setSelectedDiag(diag);
                    setExpertNotes(diag.expertNotes || "");
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                    selectedDiag?.id === diag.id
                      ? "bg-indigo-50/80 border-indigo-200 shadow-xs"
                      : "bg-slate-50 border-slate-150 hover:bg-slate-100/40"
                  }`}
                >
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-slate-800">{diag.cropName} pathology</h4>
                    <p className="text-[10px] text-slate-500 mt-1 truncate max-w-[200px]">{diag.symptoms}</p>
                    <p className="text-[10px] font-bold text-indigo-700 mt-1">AI Match: {diag.aiDiagnosis || "Pending"}</p>
                  </div>

                  <div>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                      diag.status === "Expert Verified" ? "bg-emerald-100 text-emerald-800" : "bg-indigo-100 text-indigo-800"
                    }`}>
                      {diag.status === "Expert Verified" ? "Signed Off" : "Verify"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pathology Desk Worksite (Right) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm min-h-[340px] flex flex-col justify-between">
          {selectedDiag ? (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <div className="text-left">
                  <h3 className="font-extrabold text-slate-800 text-sm">{selectedDiag.cropName} Pathology Report</h3>
                  <p className="text-[10px] text-slate-400">ID: {selectedDiag.id} • Registered: {selectedDiag.date}</p>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded shrink-0">
                  Match Confidence: {selectedDiag.confidence || 88}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-xl border border-slate-150">
                <div className="text-left">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase">Farmer Symptoms Description</h4>
                  <p className="text-slate-700 font-medium mt-1 leading-normal">{selectedDiag.symptoms}</p>
                </div>
                <div className="text-left">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase">Gemini Pathologist Diagnosis</h4>
                  <p className="text-indigo-800 font-bold mt-1 leading-normal">{selectedDiag.aiDiagnosis}</p>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">Recommended treats: {selectedDiag.treatment}</p>
                </div>
              </div>

              <div className="space-y-2 text-left">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Scientific Pathological Review & Corrective Notes
                </label>
                <textarea
                  rows={4}
                  value={expertNotes}
                  onChange={(e) => setExpertNotes(e.target.value)}
                  disabled={selectedDiag.status === "Expert Verified"}
                  placeholder="Analyze tissue samples metrics, write bio-pesticide dosage rules, and sign off this ticket..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white leading-relaxed font-medium text-slate-800"
                />
              </div>

              {selectedDiag.status !== "Expert Verified" ? (
                <button
                  id="expert-verify-btn"
                  onClick={() => handleVerify(selectedDiag.id)}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserCheck className="h-4.5 w-4.5 text-emerald-300" />
                  Sign Off Pathology Diagnosis
                </button>
              ) : (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center gap-2.5 text-emerald-800 text-xs text-left">
                  <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800">Verified & Dispatched to Farmer</p>
                    <p className="text-[10px] text-emerald-700 mt-0.5">Approved by {selectedDiag.expertName || "Verified Expert"} on {selectedDiag.date}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <BrainCircuit className="h-10 w-10 text-slate-300 animate-pulse mb-2.5" />
              <h4 className="text-xs font-bold text-slate-700">Awaiting Pathology Ticket Selection</h4>
              <p className="text-[10px] text-slate-400 mt-1 max-w-sm leading-relaxed">
                Select an automated pathology diagnostic ticket from the left audit queue to calibrate treatments, verify agricultural pathogens, and release signed-off advice back to smallholders.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    )}

    {activeTab === "security" && (
      <motion.div
        key="security-tab"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.15 }}
        className="space-y-6"
      >
        {/* Sovereign Security & Device Session Auditor */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
          <div>
            <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <ShieldAlert className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
              Sovereign Session & Bio-Identity Auditor
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Monitor active credential leases, verify cryptokeys, and terminate unauthorized terminals.
            </p>
          </div>
          <button
            onClick={logoutAllOtherDevices}
            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/50 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer self-start sm:self-auto"
          >
            Logout From All Other Devices
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
          {/* Active Sessions List */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
              Connected Terminals ({sessions.length})
            </h4>
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {sessions.map((sess) => (
                <div key={sess.id} className="flex justify-between items-center text-xs p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500 shrink-0">
                      {sess.icon === "Laptop" ? (
                        <Laptop className="h-4.5 w-4.5" />
                      ) : (
                        <Smartphone className="h-4.5 w-4.5" />
                      )}
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-700 flex items-center gap-1.5">
                        {sess.device}
                        {sess.active && (
                          <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-black uppercase">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-[9px] text-slate-400 font-semibold mt-0.5">
                        Location: {sess.location} • IP: <span className="font-mono">{sess.ip}</span>
                      </div>
                    </div>
                  </div>

                  {!sess.active && (
                    <button
                      onClick={() => terminateSession(sess.id)}
                      className="px-2.5 py-1 bg-white hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200 hover:border-red-200 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-2xs"
                    >
                      Terminate
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Biometric Credentials Status */}
          <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-200/60 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <Fingerprint className="h-3.5 w-3.5 text-emerald-600" />
                Expert Biometric Authenticator
              </h4>
              <p className="text-[11px] leading-relaxed text-slate-500 font-medium">
                Your high-entropy cryptographic Touch ID and Face ID keys are linked securely in this device's TPM sandbox. This secures all pathology audit signatures with non-repudiation guarantees.
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-100/80 rounded-xl p-3 flex items-center gap-2.5 text-[11px] text-emerald-800 font-medium">
              <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-slate-800">Biometric Authenticator Enrolled</p>
                <p className="text-[9px] text-emerald-600 mt-0.5">Linked securely with Windows Hello / Apple Secure Enclave.</p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </motion.div>
    )}

    {activeTab === "qa" && (
      <motion.div
        key="qa-tab"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.15 }}
      >
        <ExpertQAGateway
          expertProfile={expertProfile}
          pendingQueries={pendingQueries}
          setPendingQueries={setPendingQueries}
          upcomingConsultations={upcomingConsultations}
          setUpcomingConsultations={setUpcomingConsultations}
        />
      </motion.div>
    )}

    {activeTab === "video" && (
      <motion.div
        key="video-tab"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.15 }}
      >
        <ExpertVideoConsultations
          expertProfile={expertProfile}
          upcomingConsultations={upcomingConsultations}
          setUpcomingConsultations={setUpcomingConsultations}
          earnedBonus={earnedBonus}
          setEarnedBonus={setEarnedBonus}
        />
      </motion.div>
    )}

    {activeTab === "research" && (
      <motion.div
        key="research-tab"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.15 }}
      >
        <ExpertAIResearchLabs />
      </motion.div>
    )}

    {activeTab === "knowledge" && (
      <motion.div
        key="knowledge-tab"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.15 }}
      >
        <ExpertKnowledgeHub
          expertProfile={expertProfile}
          articles={articles}
          setArticles={setArticles}
        />
      </motion.div>
    )}

    {activeTab === "farmers" && (
      <motion.div
        key="farmers-tab"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.15 }}
      >
        <ExpertFarmerRelationships />
      </motion.div>
    )}

    {activeTab === "webinars" && (
      <motion.div
        key="webinars-tab"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.15 }}
      >
        <ExpertWebinarsWorkshops />
      </motion.div>
    )}

    {activeTab === "revenue" && (
      <motion.div
        key="revenue-tab"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.15 }}
      >
        <ExpertRevenuePayments
          expertProfile={expertProfile}
          earnedBonus={earnedBonus}
        />
      </motion.div>
    )}

    {activeTab === "ml" && (
      <motion.div
        key="ml-tab"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.15 }}
      >
        {/* Dynamic ML Co-Pilot Suite */}
        <MLPredictionHub currentPhase="Expert" />
      </motion.div>
    )}
  </AnimatePresence>
</div>
  );
}
