import React, { useState, useMemo } from "react";
import {
  Users,
  MessageSquare,
  Share2,
  Calendar,
  Gift,
  HelpCircle,
  Award,
  ChevronRight,
  ShieldAlert,
  Wrench,
  ShoppingBag,
  TrendingUp,
  Heart,
  Volume2,
  BookOpen,
  UserCheck,
  Building2,
  Plus,
  Send,
  Sparkles,
  MapPin,
  Clock,
  ThumbsUp,
  Lightbulb,
  Sprout
} from "lucide-react";

interface ForumPost {
  id: string;
  author: string;
  role: string;
  avatarColor: string;
  village: string;
  title: string;
  content: string;
  likes: number;
  commentsCount: number;
  tags: string[];
  traditionalKnowledge: boolean;
  timestamp: string;
  region: string;
  postType: "Question" | "Harvest Experience" | "Best Practice";
  votesCount: number;
}

interface EquipmentShare {
  id: string;
  owner: string;
  item: string;
  ratePerDay: string;
  availability: "Available" | "Rented" | "Maintenance";
  statusText: string;
  contactNumber: string;
}

interface SeedBank {
  id: string;
  crop: string;
  variety: string;
  storedQuantityKg: number;
  contributedBy: string;
  traditionalVariety: boolean;
}

interface GroupBuyDeal {
  id: string;
  product: string;
  originalPricePerBag: number;
  discountedPricePerBag: number;
  minimumBagsRequired: number;
  currentBagsCommitted: number;
  deadline: string;
  bargainingPowerMultiplier: string;
}

interface CooperativeSupport {
  id: string;
  title: string;
  membersCount: number;
  objective: string;
  status: "Formation Phase" | "Active" | "Expanding";
  districtOfficerAssigned: string;
}

interface MentorshipMatch {
  id: string;
  mentorName: string;
  mentorExpertise: string;
  yearsExperience: number;
  menteeName: string;
  status: "Active" | "Pending Match" | "Completed Cycle";
}

interface CommunityProject {
  id: string;
  title: string;
  location: string;
  objective: string;
  totalBudgetSimulated: number;
  fundedPercentage: number;
  volunteersRequired: number;
  volunteersJoined: number;
}

export default function FarmerCommunityNetwork() {
  const [activeTab, setActiveTab] = useState<"forum" | "sharing" | "coops" | "spotlight">("forum");
  
  // --- SUB-STATES ---
  const [districtSelected, setDistrictSelected] = useState<string>("Nandi Valley District");
  const [postTitle, setPostTitle] = useState<string>("");
  const [postContent, setPostContent] = useState<string>("");
  const [postIsTraditional, setPostIsTraditional] = useState<boolean>(false);
  const [postTag, setPostTag] = useState<string>("Soil Prep");
  const [postType, setPostType] = useState<"Question" | "Harvest Experience" | "Best Practice">("Question");
  const [postRegion, setPostRegion] = useState<string>("Nandi Valley Block 2");
  
  // Filtering and Sorting States for the P2P Forum
  const [filterRegion, setFilterRegion] = useState<string>("All Regions");
  const [filterType, setFilterType] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"latest" | "votes">("latest");
  const [votedPosts, setVotedPosts] = useState<string[]>([]);

  const [chatMessage, setChatMessage] = useState<string>("");
  const [chatChannel, setChatChannel] = useState<"village" | "district">("village");

  // --- FORUM POSTS REGISTRY ---
  const [posts, setPosts] = useState<ForumPost[]>([
    {
      id: "post-1",
      author: "Eswar Reddy J",
      role: "Farmer of the Month (Basmati Expert)",
      avatarColor: "bg-indigo-600 text-white",
      village: "Nandi Valley Block 2",
      title: "Natural Neem Decoction for Leaf Blast Control",
      content: "I have successfully controlled early leaf blast infection in my Pusa Basmati Lot 2 using a 5% cold-pressed neem seed oil decoction combined with natural biological soap spray. Highly recommend trying this traditional remedy before buying synthetic compounds!",
      likes: 24,
      commentsCount: 8,
      tags: ["Bio-Control", "Pest Control"],
      traditionalKnowledge: true,
      timestamp: "Today 05:30 UTC",
      region: "Nandi Valley Block 2",
      postType: "Best Practice",
      votesCount: 24
    },
    {
      id: "post-2",
      author: "Meena Patel",
      role: "Progressive Organic Lead",
      avatarColor: "bg-emerald-600 text-white",
      village: "Gagan Hills Agro Union",
      title: "Legume Crop Rotation Nitrogen Experiment Yield Results",
      content: "After planting Berseem Clover during the late rabi fallow cycle, our organic soil nitrate levels increased by 18 ppm without chemical inputs! Our subsequent wheat yield rose by 1.2 metric tons across the entire plot.",
      likes: 42,
      commentsCount: 15,
      tags: ["Soil Health", "Clover Rotation"],
      traditionalKnowledge: false,
      timestamp: "Yesterday",
      region: "Gagan Hills Agro Union",
      postType: "Harvest Experience",
      votesCount: 42
    },
    {
      id: "post-3",
      author: "Srinivas Gowda",
      role: "Senior Agronomist Mentor",
      avatarColor: "bg-amber-600 text-white",
      village: "Nandi Valley Block 1",
      title: "Community Pond Silt Recovery Drive starting Nov 12",
      content: "We are organizing our bi-annual pond dredging drive. The rich organic silt recovered will be distributed for free to all cooperative members to enrich clay-heavy topsoil blocks.",
      likes: 19,
      commentsCount: 3,
      tags: ["Water Conservation", "Community Drive"],
      traditionalKnowledge: true,
      timestamp: "3 days ago",
      region: "Nandi Valley Block 1",
      postType: "Best Practice",
      votesCount: 19
    },
    {
      id: "post-4",
      author: "Rahul Kumar",
      role: "Junior Cultivator",
      avatarColor: "bg-sky-600 text-white",
      village: "Nandi Valley Block 1",
      title: "How to optimize Automated Irrigation moisture threshold for Clay loam soil?",
      content: "I'm setting up our Automated Irrigation Control valve system. On clay loam, does anyone recommend a moisture trigger threshold higher than 45% VWC? The water holds quite well, but I don't want deep root stress.",
      likes: 7,
      commentsCount: 5,
      tags: ["Irrigation", "Clay Loam"],
      traditionalKnowledge: false,
      timestamp: "Yesterday",
      region: "Nandi Valley Block 1",
      postType: "Question",
      votesCount: 7
    }
  ]);

  // --- LIVE P2P CHAT ENGINE ---
  const [villageChat, setVillageChat] = useState<Array<{ sender: string; msg: string; time: string; systemMsg?: boolean }>>([
    { sender: "System", msg: "Welcome to Nandi Valley Block 2 Peer-to-Peer Chat Room.", time: "06:00 UTC", systemMsg: true },
    { sender: "Ramesh Sharma", msg: "Hey Eswar, is the shared tractor rotavator available tomorrow morning?", time: "06:12 UTC" },
    { sender: "Srinivas Gowda", msg: "Yes, I just returned it to the community storage lot. Keys are with the gatekeeper.", time: "06:15 UTC" },
    { sender: "Anjali Rao", msg: "Organic Mustard seeds arrived at the cooperative seed bank for anyone who needs them!", time: "06:20 UTC" }
  ]);

  const [districtChat, setDistrictChat] = useState<Array<{ sender: string; msg: string; time: string; systemMsg?: boolean }>>([
    { sender: "System", msg: "Welcome to Nandi District Broadcasters Channel. 142 Farmers online.", time: "06:00 UTC", systemMsg: true },
    { sender: "District APMC Coordinator", msg: "Emergency warning: Fertilizer subsidy applications portal closing soon. Please file under government schemes today.", time: "06:05 UTC" },
    { sender: "Meena Patel", msg: "Gagan Hills Cooperative achieved 100% organic classification today! Celebration meetup on Saturday.", time: "06:10 UTC" }
  ]);

  // --- SHARING & SEED BANK DATA ---
  const [equipmentList, setEquipmentList] = useState<EquipmentShare[]>([
    { id: "eq-1", owner: "Srinivas Gowda", item: "Mahindra 55HP Rotary Tiller (Rotavator)", ratePerDay: "$15 / Day", availability: "Available", statusText: "Cleaned and freshly serviced", contactNumber: "9981-2231" },
    { id: "eq-2", owner: "Ramesh Sharma", item: "Solar-Powered Water Sprinkler System", ratePerDay: "$8 / Day", availability: "Rented", statusText: "Rented by Anjali Rao until Nov 10", contactNumber: "9912-8871" },
    { id: "eq-3", owner: "Meena Patel", item: "Precision Drone Crop Sprayer Model X", ratePerDay: "$25 / Day", availability: "Available", statusText: "Includes dynamic Lidar obstacle avoidance", contactNumber: "9901-4432" }
  ]);

  const [seedBank, setSeedBank] = useState<SeedBank[]>([
    { id: "sd-1", crop: "Traditional Basmati Rice", variety: "Dehradun Type-3 (Pure Heirloom)", storedQuantityKg: 450, contributedBy: "Srinivas Gowda", traditionalVariety: true },
    { id: "sd-2", crop: "Nitrogen Fixation Clover", variety: "Egyptian Clover (Berseem)", storedQuantityKg: 800, contributedBy: "Meena Patel", traditionalVariety: false },
    { id: "sd-3", crop: "High-Protein Millet", variety: "Kodo Millet (Traditional Coarse)", storedQuantityKg: 250, contributedBy: "Eswar Reddy J", traditionalVariety: true }
  ]);

  // --- GROUP BUYING & BARGAINING DEALS ---
  const [groupBuyDeals, setGroupBuyDeals] = useState<GroupBuyDeal[]>([
    { id: "deal-1", product: "High-Grade Organic Bio-Potash Fertilizer (50 Kg Bag)", originalPricePerBag: 45, discountedPricePerBag: 32, minimumBagsRequired: 100, currentBagsCommitted: 84, deadline: "Nov 15", bargainingPowerMultiplier: "30% off Bulk Deal" },
    { id: "deal-2", product: "Neem Cake Organic Powder Pest Insecticide (25 Kg Bag)", originalPricePerBag: 30, discountedPricePerBag: 21, minimumBagsRequired: 80, currentBagsCommitted: 45, deadline: "Nov 20", bargainingPowerMultiplier: "33% off Co-op Volume" }
  ]);

  // --- COOPERATIVE FORMATION & PROJECTS ---
  const coops: CooperativeSupport[] = useMemo(() => [
    { id: "coop-1", title: "Nandi Organic Paddy Producers Association", membersCount: 42, objective: "Consolidate Basmati rice cargo volumes to gain direct corporate export bargaining power.", status: "Active", districtOfficerAssigned: "Dr. K. Swamy" },
    { id: "coop-2", title: "Nandi Youth Drones & Precision Machinery Union", membersCount: 15, objective: "Pool resources to purchase collective Lidar drones and smart agricultural rovers.", status: "Formation Phase", districtOfficerAssigned: "Siddharth Rao" }
  ], []);

  const [communityProjects, setCommunityProjects] = useState<CommunityProject[]>([
    { id: "proj-1", title: "Rainwater Harvesting Check Dam #3 Construction", location: "North Foothills Ravine", objective: "Prevent excessive monsoon water runoff and recharge shallow well water tables.", totalBudgetSimulated: 3500, fundedPercentage: 78, volunteersRequired: 20, volunteersJoined: 16 },
    { id: "proj-2", title: "Cooperative Seed Storage Silo Solar-Cooling Retrofit", location: "Village Warehouse Center", objective: "Add solar-powered cooling vents to keep stored grain below 18°C.", totalBudgetSimulated: 2200, fundedPercentage: 45, volunteersRequired: 8, volunteersJoined: 4 }
  ]);

  // --- MENTORSHIP MATCHES ---
  const [mentorships, setMentorships] = useState<MentorshipMatch[]>([
    { id: "ment-1", mentorName: "Srinivas Gowda (Senior)", mentorExpertise: "Organic Multi-Cropping", yearsExperience: 28, menteeName: "Rahul Kumar (Junior)", status: "Active" },
    { id: "ment-2", mentorName: "Eswar Reddy J (You)", mentorExpertise: "Pre-Harvest Pricing & Escrow", yearsExperience: 12, menteeName: "Anjali Rao (Junior)", status: "Active" }
  ]);

  // --- ACTIONS SIMULATION ---
  const handleLikePost = (postId: string) => {
    setPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  const handleVoteBestPractice = (postId: string) => {
    if (votedPosts.includes(postId)) {
      setVotedPosts(prev => prev.filter(id => id !== postId));
      setPosts(prev =>
        prev.map(p => (p.id === postId ? { ...p, votesCount: Math.max(0, p.votesCount - 1) } : p))
      );
    } else {
      setVotedPosts(prev => [...prev, postId]);
      setPosts(prev =>
        prev.map(p => (p.id === postId ? { ...p, votesCount: p.votesCount + 1 } : p))
      );
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) {
      alert("Please fill out both the title and content fields for the community post.");
      return;
    }

    const newPost: ForumPost = {
      id: "post-" + Math.floor(Math.random() * 10000),
      author: "Eswar Reddy J",
      role: "Farmer of the Month (You)",
      avatarColor: "bg-indigo-600 text-white",
      village: postRegion,
      title: postTitle,
      content: postContent,
      likes: 1,
      commentsCount: 0,
      tags: [postTag, postIsTraditional ? "Traditional Wisdom" : "Tech Tip"],
      traditionalKnowledge: postIsTraditional,
      timestamp: "Just Now",
      region: postRegion,
      postType: postType,
      votesCount: 1
    };

    setPosts([newPost, ...posts]);
    setPostTitle("");
    setPostContent("");
    setPostIsTraditional(false);
  };

  // Filtered and sorted forum posts memo
  const filteredPosts = useMemo(() => {
    let result = [...posts];
    if (filterRegion !== "All Regions") {
      result = result.filter(p => p.region === filterRegion);
    }
    if (filterType !== "All") {
      result = result.filter(p => p.postType === filterType);
    }
    if (sortBy === "votes") {
      result.sort((a, b) => b.votesCount - a.votesCount);
    } else {
      result.sort((a, b) => {
        if (a.timestamp === "Just Now" && b.timestamp !== "Just Now") return -1;
        if (b.timestamp === "Just Now" && a.timestamp !== "Just Now") return 1;
        return b.likes - a.likes;
      });
    }
    return result;
  }, [posts, filterRegion, filterType, sortBy]);

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const timeString = new Date().toISOString().substring(11, 16) + " UTC";
    const newMsg = { sender: "Eswar Reddy J (You)", msg: chatMessage, time: timeString };

    if (chatChannel === "village") {
      setVillageChat([...villageChat, newMsg]);
    } else {
      setDistrictChat([...districtChat, newMsg]);
    }
    setChatMessage("");
  };

  const handleCommitGroupBuy = (dealId: string) => {
    const updated = groupBuyDeals.map(d => {
      if (d.id === dealId) {
        return {
          ...d,
          currentBagsCommitted: d.currentBagsCommitted + 5 // Commit 5 bags
        };
      }
      return d;
    });
    setGroupBuyDeals(updated);
    alert("Commitment locked! Your bulk cooperative order discount code has been generated and dispatched to APMC purchasing agents.");
  };

  const handleJoinVolunteerProject = (projId: string) => {
    const updated = communityProjects.map(p => {
      if (p.id === projId) {
        if (p.volunteersJoined >= p.volunteersRequired) {
          alert("All volunteer nodes on this infrastructure project have been filled. Thank you!");
          return p;
        }
        return {
          ...p,
          volunteersJoined: p.volunteersJoined + 1
        };
      }
      return p;
    });
    setCommunityProjects(updated);
    alert("Wonderful! You have signed up as an active village volunteer. A notification has been broadcast to cooperative project managers.");
  };

  return (
    <div id="community-network-module" className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
              👥 Farmer Community & Cooperative Network
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 font-semibold tracking-wide uppercase">
            Village/District peer chats, traditional knowledge vaults, machinery sharing, seed banks, group buying pools, and senior mentorship logs
          </p>
        </div>

        {/* Global local network tag selector */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
          <MapPin className="h-4 w-4 text-indigo-600 animate-bounce" />
          <span className="text-xs font-bold text-slate-700">{districtSelected}</span>
        </div>
      </div>

      {/* Main Stats panel: Community Pulse */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* District Active population */}
        <div className="p-4 rounded-2xl border bg-slate-50 border-slate-150 shadow-inner flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Local Network Online</span>
            <MessageSquare className="h-4 w-4 text-emerald-600 animate-pulse" />
          </div>
          <div className="mt-2.5">
            <h4 className="text-xl font-black text-slate-800 font-mono">
              184 Farmers
            </h4>
            <span className="text-[9px] font-bold text-slate-400 uppercase block">Active across Nandi Valley</span>
          </div>
        </div>

        {/* Group bargaining savings */}
        <div className="p-4 rounded-2xl border bg-slate-50 border-slate-150 shadow-inner flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Co-op Bargaining Power</span>
            <TrendingUp className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2.5">
            <h4 className="text-xl font-black text-indigo-700 font-mono">
              ₹14,250 Saved
            </h4>
            <span className="text-[9px] font-extrabold text-emerald-600 block">Collective buy discounts active</span>
          </div>
        </div>

        {/* Equipment pooled count */}
        <div className="p-4 rounded-2xl border bg-slate-50 border-slate-150 shadow-inner flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Machinery Pooled Vault</span>
            <Wrench className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2.5">
            <h4 className="text-xl font-black text-slate-800 font-mono">
              12 Active Tools
            </h4>
            <span className="text-[9px] text-slate-400 font-bold block">F2F Sharing program synced</span>
          </div>
        </div>

        {/* Traditional wisdom seed strains available */}
        <div className="p-4 rounded-2xl border bg-slate-50 border-slate-150 shadow-inner flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Heirloom Seed Bank Strains</span>
            <Sprout className="h-4 w-4 text-emerald-700" />
          </div>
          <div className="mt-2.5">
            <h4 className="text-xl font-black text-slate-800 font-mono">
              3 Rare Strains
            </h4>
            <span className="text-[9px] text-emerald-600 font-bold block">100% Traditional seeds stored</span>
          </div>
        </div>
      </div>

      {/* Sub tabs navigation */}
      <div className="flex gap-2 border-b border-slate-150 pb-1">
        <button
          onClick={() => setActiveTab("forum")}
          className={`pb-2.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeTab === "forum"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          💬 Forums, Chat & Emergency Support
        </button>
        <button
          onClick={() => setActiveTab("sharing")}
          className={`pb-2.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeTab === "sharing"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          🚜 Machinery Sharing, Seed Bank & Group Buying
        </button>
        <button
          onClick={() => setActiveTab("coops")}
          className={`pb-2.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeTab === "coops"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          🤝 Cooperatives, Mentorship & Projects
        </button>
        <button
          onClick={() => setActiveTab("spotlight")}
          className={`pb-2.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeTab === "spotlight"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          🌟 Spotlight (Farmer of the Month)
        </button>
      </div>

      {/* Columns & Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* TAB 1: Forums, Chat & Emergency Broadcasts */}
        {activeTab === "forum" && (
          <>
            {/* Forum post editor & stream (8 columns) */}
            <div className="lg:col-span-8 space-y-5">
              
              {/* Form to submit advice */}
              <form onSubmit={handleCreatePost} className="p-5 bg-slate-50 border border-slate-150 rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-indigo-600 animate-pulse" />
                    Publish to regional peer-to-peer forum
                  </h4>
                  <span className="text-[9px] bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold px-2 py-0.5 rounded uppercase">
                    Interactive Mode
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Post Title */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-black text-slate-500 uppercase">Post Title / Topic</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Clay-Loam Moisture Threshold or Wheat yields rotation success..."
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none font-bold text-slate-850"
                    />
                  </div>

                  {/* Post Type Selector */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-black text-slate-500 uppercase">Post Classification</label>
                    <select
                      value={postType}
                      onChange={(e) => setPostType(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs focus:outline-none font-bold text-slate-800"
                    >
                      <option value="Question">❓ Ask peer a help question</option>
                      <option value="Harvest Experience">🌾 Share a successful harvest experience</option>
                      <option value="Best Practice">⭐ Share a community best practice</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Category Tag */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-black text-slate-500 uppercase">Topic category</label>
                    <select
                      value={postTag}
                      onChange={(e) => setPostTag(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs focus:outline-none text-slate-750 font-semibold"
                    >
                      <option value="Soil Prep">Soil Prep</option>
                      <option value="Irrigation">Irrigation</option>
                      <option value="Bio-Pesticide">Bio-Pesticide</option>
                      <option value="Water Saving">Water Saving</option>
                      <option value="Tractor Tip">Tractor Tip</option>
                      <option value="Crop Rotation">Crop Rotation</option>
                    </select>
                  </div>

                  {/* Region Select */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-black text-slate-500 uppercase">Target region block</label>
                    <select
                      value={postRegion}
                      onChange={(e) => setPostRegion(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs focus:outline-none text-slate-750 font-semibold"
                    >
                      <option value="Nandi Valley Block 1">Nandi Valley Block 1</option>
                      <option value="Nandi Valley Block 2">Nandi Valley Block 2</option>
                      <option value="Gagan Hills Agro Union">Gagan Hills Agro Union</option>
                    </select>
                  </div>

                  {/* Traditional Wisdom Checkbox */}
                  <div className="flex flex-col justify-end pb-1.5">
                    <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={postIsTraditional}
                        onChange={(e) => setPostIsTraditional(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                      />
                      Traditional Wisdom?
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-black text-slate-500 uppercase">Knowledge, Advice, or Inquiry details</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Enter details of your harvest success metrics, crop rotation schedule, or ask details about irrigation, soil prep, pest outbreaks..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none text-slate-800"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-black rounded-xl text-xs cursor-pointer transition-all shadow-sm"
                >
                  Publish to Peer Network
                </button>
              </form>

              {/* Advanced regional search/filter and sorting header bar */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                  <span className="text-[10px] text-slate-700 font-black uppercase tracking-wider flex items-center gap-1">
                    🔍 Filter regional forum streams
                  </span>
                  <span className="text-[9px] font-mono font-bold text-slate-400">
                    Showing {filteredPosts.length} of {posts.length} entries
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Filter Region */}
                  <div className="space-y-0.5">
                    <label className="block text-[8px] text-slate-400 font-black uppercase">Region Block</label>
                    <select
                      value={filterRegion}
                      onChange={(e) => setFilterRegion(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-1 text-xs focus:outline-none font-semibold text-slate-700"
                    >
                      <option value="All Regions">🌍 All Regions</option>
                      <option value="Nandi Valley Block 1">📍 Nandi Valley Block 1</option>
                      <option value="Nandi Valley Block 2">📍 Nandi Valley Block 2</option>
                      <option value="Gagan Hills Agro Union">📍 Gagan Hills Agro Union</option>
                    </select>
                  </div>

                  {/* Filter Type */}
                  <div className="space-y-0.5">
                    <label className="block text-[8px] text-slate-400 font-black uppercase">Post Type</label>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-1 text-xs focus:outline-none font-semibold text-slate-700"
                    >
                      <option value="All">📂 All Classifications</option>
                      <option value="Question">❓ Questions & Help</option>
                      <option value="Harvest Experience">🌾 Harvest Experiences</option>
                      <option value="Best Practice">⭐ Best Practices</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div className="space-y-0.5">
                    <label className="block text-[8px] text-slate-400 font-black uppercase">Sort Order</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-1 text-xs focus:outline-none font-semibold text-slate-700"
                    >
                      <option value="latest">⏱️ Latest Threads</option>
                      <option value="votes">🏆 Most Voted Best Practices</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Forum Post stream */}
              <div className="space-y-4">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map(post => {
                    const isVoted = votedPosts.includes(post.id);
                    return (
                      <div key={post.id} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3.5 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div className="flex gap-3">
                            <div className={`p-2.5 h-10 w-10 flex items-center justify-center rounded-full font-black text-xs shrink-0 ${post.avatarColor}`}>
                              {post.author.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-extrabold text-xs text-slate-800">{post.author}</span>
                                <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono font-bold">
                                  {post.role}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold mt-0.5">
                                <span className="bg-slate-100 text-slate-600 px-1.5 py-0.1 rounded text-[8.5px]">📍 {post.region}</span>
                                <span>•</span>
                                <span>{post.timestamp}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            {post.traditionalKnowledge && (
                              <span className="text-[8px] bg-amber-50 border border-amber-200 text-amber-800 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                                <Sprout className="h-3.5 w-3.5 text-amber-600" />
                                Heritage Wisdom
                              </span>
                            )}

                            {/* Post Type Badge */}
                            {post.postType === "Question" && (
                              <span className="text-[8.5px] bg-sky-50 border border-sky-100 text-sky-800 font-black px-2 py-0.5 rounded-full uppercase tracking-wide flex items-center gap-1">
                                ❓ Question
                              </span>
                            )}
                            {post.postType === "Harvest Experience" && (
                              <span className="text-[8.5px] bg-emerald-50 border border-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full uppercase tracking-wide flex items-center gap-1">
                                🌾 Harvest Experience
                              </span>
                            )}
                            {post.postType === "Best Practice" && (
                              <span className="text-[8.5px] bg-indigo-50 border border-indigo-150 text-indigo-800 font-black px-2 py-0.5 rounded-full uppercase tracking-wide flex items-center gap-1">
                                ⭐ Best Practice
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Title & Content */}
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-black text-slate-800 leading-snug flex items-center gap-1.5">
                            {post.postType === "Question" && <span className="text-sky-600 font-bold">Q:</span>}
                            {post.postType === "Harvest Experience" && <span className="text-emerald-600 font-bold">Success:</span>}
                            {post.postType === "Best Practice" && <span className="text-indigo-600 font-bold">Standard:</span>}
                            {post.title}
                          </h4>
                          <p className="text-[11px] leading-relaxed text-slate-600 font-semibold">{post.content}</p>
                        </div>

                        {/* Likes & Best Practice Voting */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-150 text-[10px] font-bold text-slate-400">
                          <div className="flex gap-2">
                            {post.tags.map((tag, i) => (
                              <span key={i} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border">
                                #{tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleLikePost(post.id)}
                              className="flex items-center gap-1 text-slate-500 hover:text-rose-600 cursor-pointer transition-colors"
                              title="Upvote/Like this post"
                            >
                              <ThumbsUp className="h-3.5 w-3.5" />
                              <span>{post.likes} Likes</span>
                            </button>

                            <span>•</span>

                            {/* Best Practice Regional Recommendation Voting */}
                            <button
                              onClick={() => handleVoteBestPractice(post.id)}
                              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                                isVoted
                                  ? "bg-amber-100 border-amber-300 text-amber-800 font-extrabold"
                                  : "bg-slate-50 hover:bg-amber-50 border-slate-200 text-slate-500 hover:text-amber-700"
                              }`}
                              title="Vote as a regional best practice recommendation"
                            >
                              <Award className={`h-3.5 w-3.5 ${isVoted ? "text-amber-600 fill-amber-500" : ""}`} />
                              <span>{post.votesCount} Regional Votes</span>
                            </button>

                            {/* Regional Standard threshold badge */}
                            {post.votesCount >= 20 && (
                              <span className="hidden sm:inline-flex items-center gap-0.5 text-[8.5px] text-amber-700 bg-amber-50 font-black px-1.5 py-0.2 rounded border border-amber-200">
                                🏆 Standard
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-10 bg-slate-50 border border-dashed rounded-2xl p-5 space-y-2">
                    <HelpCircle className="h-8 w-8 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-600">No regional topics matched your search parameters.</p>
                    <p className="text-[10px] text-slate-400">Be the first to ask a question or share a harvest best practice for this block!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Live Chat P2P & Emergency network (4 columns) */}
            <div className="lg:col-span-4 space-y-5">
              
              {/* Emergency Alert Network Broadcasts */}
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-3.5">
                <div className="flex items-center gap-2 font-black text-rose-800 text-[10px] uppercase tracking-wider">
                  <ShieldAlert className="h-4.5 w-4.5 text-rose-600 animate-bounce" />
                  EMERGENCY VILLAGE SUPPORT NET
                </div>
                <p className="text-[10px] text-rose-700 leading-relaxed font-semibold">
                  Active Frost warning forecast in adjoining Nandi Ridge plots. Share heavy crop blankets or coordinate high-volume smudge fire smoke plots.
                </p>
                <button
                  onClick={() => alert("SOS message broadast to all 184 regional farmers: Coordinate frost cover mobilization.")}
                  className="w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[10px] cursor-pointer transition-colors"
                >
                  Broadcast SOS Help Request
                </button>
              </div>

              {/* Chat channels widget */}
              <div className="p-4 bg-slate-900 border border-slate-800 text-slate-300 rounded-2xl space-y-3 flex flex-col justify-between h-[360px]">
                
                <div className="space-y-3">
                  {/* Select channel */}
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">P2P Chat Channels</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setChatChannel("village")}
                        className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          chatChannel === "village" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        Village Block
                      </button>
                      <button
                        onClick={() => setChatChannel("district")}
                        className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          chatChannel === "district" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        District Broad
                      </button>
                    </div>
                  </div>

                  {/* Chat logs render */}
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {(chatChannel === "village" ? villageChat : districtChat).map((chat, idx) => (
                      <div key={idx} className="text-[10.5px] font-mono leading-relaxed">
                        {chat.systemMsg ? (
                          <div className="text-[9px] text-indigo-400 text-center font-bold bg-indigo-950/40 p-1.5 rounded-lg border border-indigo-900/40">
                            {chat.msg}
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <div className="flex justify-between font-bold text-[9px]">
                              <span className="text-indigo-400">{chat.sender}</span>
                              <span className="text-slate-500">{chat.time}</span>
                            </div>
                            <p className="text-slate-200">{chat.msg}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form to submit chat */}
                <form onSubmit={handleSendChatMessage} className="flex gap-1.5 border-t border-slate-800 pt-3">
                  <input
                    type="text"
                    required
                    placeholder={`Type message to ${chatChannel}...`}
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="w-full bg-slate-850 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none text-white"
                  />
                  <button
                    type="submit"
                    className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>

              </div>
            </div>
          </>
        )}

        {/* TAB 2: Machinery Sharing, Seed Bank & Group Buying */}
        {activeTab === "sharing" && (
          <div className="lg:col-span-12 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Farmer to farmer Equipment rent pooling */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 shadow-sm">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Wrench className="h-4.5 w-4.5 text-indigo-600" />
                  P2P Shared Farm Equipment Pooling
                </h4>

                <div className="space-y-3">
                  {equipmentList.map(eq => (
                    <div key={eq.id} className="p-3 bg-white border rounded-xl space-y-2 text-[11px] font-semibold leading-relaxed">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-extrabold text-slate-800">{eq.item}</h5>
                          <span className="text-[9px] text-slate-400">Owner: {eq.owner}</span>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold ${
                          eq.availability === "Available" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {eq.availability}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pt-1.5 border-t border-slate-100 text-[10px] text-slate-500">
                        <span className="font-mono text-indigo-600 font-black">{eq.ratePerDay}</span>
                        <button
                          onClick={() => alert(`Dialing owner ${eq.owner} at phone node ${eq.contactNumber} to coordinate rotavator sharing.`)}
                          className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[9px] font-bold cursor-pointer"
                        >
                          Request Booking
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seed Bank */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 shadow-sm">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sprout className="h-4.5 w-4.5 text-emerald-700" />
                  Community Heirloom Seed Vault
                </h4>

                <div className="space-y-3">
                  {seedBank.map(seed => (
                    <div key={seed.id} className="p-3 bg-white border rounded-xl space-y-2 text-[11px] leading-relaxed font-semibold">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-extrabold text-slate-800">{seed.crop}</h5>
                          <span className="text-[9px] text-slate-400">Cultivar Variety: {seed.variety}</span>
                        </div>
                        {seed.traditionalVariety && (
                          <span className="text-[8px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">Heirloom</span>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-1.5 border-t border-slate-100 text-[9.5px] text-slate-500 font-mono">
                        <span>Quantity: {seed.storedQuantityKg} Kg</span>
                        <button
                          onClick={() => alert(`Seed allocation of 10Kg locked for collection under your name: ${seed.variety}`)}
                          className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[9px] font-bold cursor-pointer transition-colors"
                        >
                          Request Seeds
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Group buying discounts and bargaining deals */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 shadow-sm">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingBag className="h-4.5 w-4.5 text-indigo-600" />
                  Group Buying Pools (Collective Power)
                </h4>

                <div className="space-y-3">
                  {groupBuyDeals.map(deal => (
                    <div key={deal.id} className="p-3 bg-white border rounded-xl space-y-2 text-[11px] leading-relaxed font-semibold">
                      <div className="flex justify-between items-start gap-1">
                        <h5 className="font-extrabold text-slate-800 leading-snug">{deal.product}</h5>
                        <span className="text-[8px] bg-indigo-100 text-indigo-800 font-black px-1.5 py-0.5 rounded uppercase font-mono tracking-wide shrink-0">
                          {deal.bargainingPowerMultiplier}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                        <span>Price: <span className="line-through">${deal.originalPricePerBag}</span> <span className="text-emerald-600 font-extrabold">${deal.discountedPricePerBag}</span></span>
                        <span>Committed: <span className="font-bold text-slate-800">{deal.currentBagsCommitted}</span> / {deal.minimumBagsRequired} Bags</span>
                      </div>

                      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${(deal.currentBagsCommitted / deal.minimumBagsRequired) * 100}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-between items-center text-[9px] pt-1.5 border-t border-slate-100 text-slate-400">
                        <span>Deadline: {deal.deadline}</span>
                        <button
                          onClick={() => handleCommitGroupBuy(deal.id)}
                          className="px-2 py-1 bg-indigo-600 text-white rounded-lg text-[9px] font-bold cursor-pointer hover:bg-indigo-700 transition-colors"
                        >
                          Commit +5 Bags
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: Cooperatives, Mentorship & Joint Infrastructure Projects */}
        {activeTab === "coops" && (
          <div className="lg:col-span-12 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Mentorship logs */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="h-4.5 w-4.5 text-indigo-600" />
                  Senior Farmer Mentorship Covenants
                </h4>

                <div className="space-y-3">
                  {mentorships.map(ment => (
                    <div key={ment.id} className="p-3 bg-white border rounded-xl space-y-1 text-[11px] leading-relaxed font-semibold">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-slate-800">Mentor: {ment.mentorName}</span>
                        <span className="text-[8px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded uppercase">Active match</span>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Focus: <span className="text-slate-700 font-bold">{ment.mentorExpertise}</span> • Exp: {ment.yearsExperience} yrs
                      </p>
                      <div className="text-[9px] text-slate-400 font-mono flex justify-between pt-1 border-t">
                        <span>Mentee: {ment.menteeName}</span>
                        <button
                          onClick={() => alert(`Launching chat room with your paired agricultural student: ${ment.menteeName}`)}
                          className="text-indigo-600 hover:underline font-bold"
                        >
                          Chat Now
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => alert("Registration logged: Your profile has been listed on the cooperative dashboard as available to mentor junior students.")}
                    className="w-full py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Volunteer as Senior Mentor
                  </button>
                </div>
              </div>

              {/* Cooperative Support Objective list */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="h-4.5 w-4.5 text-indigo-600" />
                  Co-operative Formation Support
                </h4>

                <div className="space-y-3">
                  {coops.map(coop => (
                    <div key={coop.id} className="p-3 bg-white border rounded-xl space-y-1.5 text-[11px] leading-relaxed font-semibold">
                      <div className="flex justify-between items-start gap-1">
                        <h5 className="font-extrabold text-slate-800 leading-snug">{coop.title}</h5>
                        <span className="text-[8px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-black uppercase shrink-0">
                          {coop.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                        Goal: {coop.objective}
                      </p>
                      <div className="text-[9px] text-slate-500 pt-1 border-t flex justify-between font-mono">
                        <span>Members: {coop.membersCount}</span>
                        <span>Assigned Officer: {coop.districtOfficerAssigned}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Infrastructure Community Projects */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="h-4.5 w-4.5 text-indigo-600" />
                  Community Projects (Ponds & Roads)
                </h4>

                <div className="space-y-3">
                  {communityProjects.map(proj => (
                    <div key={proj.id} className="p-3 bg-white border rounded-xl space-y-2 text-[11px] leading-relaxed font-semibold">
                      <div>
                        <h5 className="font-extrabold text-slate-800 leading-snug">{proj.title}</h5>
                        <span className="text-[9px] text-slate-400">Location: {proj.location}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] text-slate-500 font-bold">
                          <span>Cooperative Budget: ${proj.totalBudgetSimulated}</span>
                          <span className="text-indigo-600 font-mono">{proj.fundedPercentage}% Funded</span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full"
                            style={{ width: `${proj.fundedPercentage}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[9px] pt-1.5 border-t text-slate-400 font-mono">
                        <span>Volunteers: {proj.volunteersJoined} / {proj.volunteersRequired}</span>
                        <button
                          onClick={() => handleJoinVolunteerProject(proj.id)}
                          className="px-2 py-0.5 bg-slate-900 text-white rounded font-bold cursor-pointer"
                        >
                          Join Effort
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: Farmer Spotlight, Success Stories, and Youth/Women Groups */}
        {activeTab === "spotlight" && (
          <div className="lg:col-span-12 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 bg-gradient-to-br from-indigo-50 to-emerald-50 border border-indigo-150 rounded-2xl">
              
              {/* Left Column: Visual avatar of the Farmer of the Month */}
              <div className="md:col-span-4 flex flex-col items-center justify-center text-center space-y-3 bg-white p-6 rounded-xl border">
                <div className="p-3.5 bg-yellow-100 border border-yellow-200 text-yellow-700 rounded-full">
                  <Award className="h-10 w-10 animate-bounce" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] bg-yellow-600 text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    FARMER OF THE MONTH
                  </span>
                  <h4 className="text-base font-extrabold text-slate-800">
                    Eswar Reddy J
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold">Nandi Valley Block 2</p>
                </div>

                <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-xl font-bold text-[11px]">
                  🏆 100% Organic Soil Health Rating & Zero-Weed Lidar Scan Stamp
                </div>
              </div>

              {/* Right Column: Case study description & achievements */}
              <div className="md:col-span-8 space-y-4">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="h-4.5 w-4.5 text-indigo-600" />
                  Case Study: 30% Yield Boost via Lidar Terrain Heightmap Rotations
                </h4>

                <div className="p-4 bg-white/90 border rounded-xl space-y-3 text-[11px] leading-relaxed text-slate-600 font-semibold">
                  <div>
                    <span className="font-black text-slate-800 block mb-0.5">Summary Case Study Objective:</span>
                    By utilizing drone-mapped heightmap sensors to identify low moisture pooling terrain on Plot #1 and subsequently planting organic nitrogen-fixing clover during winter fallows, Eswar Reddy boosted Basmati grain yields by 30% without chemical potash inputs.
                  </div>

                  <div className="grid grid-cols-2 gap-3 font-mono">
                    <div>🌾 Crop: <span className="text-slate-800 font-bold">Pusa Basmati 1121</span></div>
                    <div>📊 Volume: <span className="text-slate-800 font-bold">15 Metric Tons</span></div>
                    <div>🔬 Soil Health: <span className="text-slate-800 font-bold">A+ Certified</span></div>
                    <div>🧪 Chemicals used: <span className="text-slate-800 font-bold">0% (All Bio-Neem)</span></div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => alert("Complete PDF success booklet downloaded to your files directory.")}
                      className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Read Complete Case Study Booklet
                    </button>
                    <button
                      onClick={() => alert("Link shared to district APMC agricultural board newsletter!")}
                      className="px-3 py-1.5 bg-white border rounded-lg text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1"
                    >
                      <Share2 className="h-4 w-4" /> Share Case Study
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
