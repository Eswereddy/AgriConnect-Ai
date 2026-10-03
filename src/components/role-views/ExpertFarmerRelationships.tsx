import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  Search,
  Filter,
  User,
  MapPin,
  Calendar,
  MessageSquare,
  Sparkles,
  PhoneCall,
  CheckCircle,
  X,
  FileText,
  BookOpen,
  ChevronRight,
  Send,
  Volume2
} from "lucide-react";

export default function ExpertFarmerRelationships() {
  const [farmersTab, setFarmersTab] = useState<"list" | "segment" | "broadcast">("list");

  // --- 8.1 MY FARMERS DATABASE ---
  const [farmersList, setFarmersList] = useState([
    {
      id: "f-1",
      name: "Suresh Patil",
      mobile: "+91 98304 11202",
      location: "Nashik, MH",
      totalConsultations: 5,
      lastConsultationDate: "2026-07-10",
      rating: 5,
      crop: "Grapes",
      activity: "Active",
      landSize: "4.2 Acres",
      soilType: "Clay Loam",
      waterSource: "Drip Well",
      pastCases: [
        { date: "2026-07-10", topic: "Downy Mildew Preemption", status: "Resolved" },
        { date: "2026-06-12", topic: "Potassium Soil Deficiencies", status: "Resolved" }
      ]
    },
    {
      id: "f-2",
      name: "Anjali Menon",
      mobile: "+91 88491 50201",
      location: "Palakkad, KL",
      totalConsultations: 3,
      lastConsultationDate: "2026-07-02",
      rating: 4,
      crop: "Coconut Palm",
      activity: "Active",
      landSize: "2.5 Acres",
      soilType: "Red Sandy Loam",
      waterSource: "Canal Sync",
      pastCases: [
        { date: "2026-07-02", topic: "Powdery Leaf Spots", status: "Resolved" }
      ]
    },
    {
      id: "f-3",
      name: "Ram Singh",
      mobile: "+91 91720 98114",
      location: "Guntur, AP",
      totalConsultations: 12,
      lastConsultationDate: "2026-05-20",
      rating: 5,
      crop: "Rice",
      activity: "Inactive",
      landSize: "8.0 Acres",
      soilType: "Silt Loam",
      waterSource: "Tube Well",
      pastCases: [
        { date: "2026-05-20", topic: "Stem Borer Infestation", status: "Resolved" }
      ]
    }
  ]);

  // Filters for farmers
  const [searchVal, setSearchVal] = useState("");
  const [filterCrop, setFilterCrop] = useState("All");
  const [filterActivity, setFilterActivity] = useState("All");

  // Detailed selected farmer
  const [selectedFarmer, setSelectedFarmer] = useState<any>(null);
  const [directMsg, setDirectMsg] = useState("");
  const [privateNotes, setPrivateNotes] = useState("");

  // --- 8.3 SEGMENTATION ---
  const cropSegments = [
    { name: "Wheat Growers", count: 142, description: "Rabi season cultivators in Andhra Pradesh & Haryana tracts." },
    { name: "Rice Growers", count: 98, description: "Kharif season farmers utilizing canal sync systems." },
    { name: "Grape Vineyards", count: 45, description: "Horticulture farmers based out of Nashik & Krishna." }
  ];

  const vulnerabilitySegments = [
    { name: "Disease-Prone Zones", count: 34, description: "High-humidity regions flagged for early blight." },
    { name: "Soil Deficiency Zones", count: 52, description: "Alkaline tracts flagged for low nitrogen & zinc." }
  ];

  // --- 8.4 BROADCAST ---
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [targetSegment, setTargetSegment] = useState("Wheat Growers");

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    alert(`Bulk transmission scheduled! Dispatched SMS alerts and App invites to all registered ${targetSegment} smallholders.`);
    setBroadcastMessage("");
  };

  const handleSaveNotes = () => {
    if (!privateNotes.trim()) return;
    alert(`Agronomist secure notes cataloged for ${selectedFarmer.name}.`);
    setPrivateNotes("");
  };

  const handleSendDirectMsg = (type: "text" | "voice") => {
    if (!directMsg.trim() && type === "text") return;
    alert(`Direct ${type} dispatch dispatched to ${selectedFarmer.name} via WhatsApp/SMS gateway.`);
    setDirectMsg("");
  };

  // Farmer Filter computation
  const activeFarmers = farmersList.filter(f => {
    if (searchVal) {
      const s = searchVal.toLowerCase();
      const matchName = f.name?.toLowerCase().includes(s);
      const matchLoc = f.location?.toLowerCase().includes(s);
      if (!matchName && !matchLoc) return false;
    }
    if (filterCrop !== "All" && f.crop !== filterCrop) return false;
    if (filterActivity !== "All" && f.activity !== filterActivity) return false;
    return true;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Sub Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setFarmersTab("list")}
          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            farmersTab === "list"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Users className="h-4 w-4" />
          My Farmers Registry ({farmersList.length})
        </button>
        <button
          onClick={() => setFarmersTab("segment")}
          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            farmersTab === "segment"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Filter className="h-4 w-4" />
          Vulnerability Segmentation
        </button>
        <button
          onClick={() => setFarmersTab("broadcast")}
          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            farmersTab === "broadcast"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Send className="h-4 w-4" />
          Bulk Announcements
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* 8.1 REGISTRY & DETAILS */}
        {farmersTab === "list" && (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-3xs grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative col-span-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search grower registry..."
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <select
                  value={filterCrop}
                  onChange={(e) => setFilterCrop(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[10px] font-bold"
                >
                  <option value="All">All Crops Focus</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Rice">Rice</option>
                  <option value="Coconut Palm">Coconut Palm</option>
                  <option value="Grapes">Grapes</option>
                </select>
                <select
                  value={filterActivity}
                  onChange={(e) => setFilterActivity(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[10px] font-bold"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active (Last 30 days)</option>
                  <option value="Inactive">Dormant (Over 90 days)</option>
                </select>
              </div>

              <div className="space-y-3">
                {activeFarmers.map((farmer) => (
                  <div
                    key={farmer.id}
                    onClick={() => setSelectedFarmer(farmer)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                      selectedFarmer?.id === farmer.id
                        ? "bg-emerald-50/50 border-emerald-400 shadow-sm"
                        : "bg-white border-slate-150 hover:border-slate-300"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-800 text-xs">{farmer.name}</span>
                        <span className="text-[9px] text-slate-400 font-bold flex items-center gap-0.5">
                          <MapPin className="h-2.5 w-2.5" />
                          {farmer.location}
                        </span>
                      </div>
                      <p className="text-[9px] text-slate-400 font-semibold">{farmer.mobile}</p>
                      <div className="flex gap-1">
                        <span className="text-[8px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-black uppercase">
                          Crop: {farmer.crop}
                        </span>
                        <span className={`text-[8px] px-1.5 py-0.2 rounded font-black uppercase ${
                          farmer.activity === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                        }`}>
                          {farmer.activity}
                        </span>
                      </div>
                    </div>

                    <div className="text-right text-[10px] font-bold shrink-0">
                      <p className="text-slate-800 font-mono">{farmer.totalConsultations} consultations</p>
                      <p className="text-slate-400 font-semibold mt-0.5">Rating: {farmer.rating} ★</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Farmer Dossier View */}
            <div className="lg:col-span-5">
              {selectedFarmer ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4 text-left">
                  <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
                    <div>
                      <span className="text-[8px] bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.5 rounded uppercase">
                        GROWER COMPLETE DOSSIER
                      </span>
                      <h4 className="font-black text-slate-800 text-sm mt-1">{selectedFarmer.name}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">Registered: {selectedFarmer.mobile}</p>
                    </div>
                    <button onClick={() => setSelectedFarmer(null)} className="p-1 hover:bg-slate-100 rounded-full">
                      <X className="h-4 w-4 text-slate-400" />
                    </button>
                  </div>

                  {/* Farm details */}
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg grid grid-cols-2 gap-2 text-[10px] font-semibold">
                    <div>
                      <span className="text-slate-400 text-[8px] uppercase block font-black">Land Size:</span>
                      <span className="text-slate-700">{selectedFarmer.landSize}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[8px] uppercase block font-black">Soil Matrix:</span>
                      <span className="text-slate-700">{selectedFarmer.soilType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[8px] uppercase block font-black">Irrigation Setup:</span>
                      <span className="text-slate-700">{selectedFarmer.waterSource}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[8px] uppercase block font-black">Primary Crop:</span>
                      <span className="text-emerald-700 font-bold">{selectedFarmer.crop}</span>
                    </div>
                  </div>

                  {/* Past case history */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Clinical Consultation History:</span>
                    <div className="space-y-1.5">
                      {selectedFarmer.pastCases.map((c: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center bg-white border border-slate-150 p-2 rounded-lg text-[10px]">
                          <div>
                            <p className="font-extrabold text-slate-700">{c.topic}</p>
                            <p className="text-[8px] text-slate-400">{c.date}</p>
                          </div>
                          <span className="text-[8px] bg-emerald-50 text-emerald-800 border border-emerald-100 px-1.5 py-0.2 rounded font-black uppercase">
                            {c.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions Panel */}
                  <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                    <div>
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Send Direct Message / prescribed Guide</label>
                      <div className="flex gap-1.5 mt-1">
                        <input
                          type="text"
                          placeholder="Type SMS or copy document reference link..."
                          value={directMsg}
                          onChange={(e) => setDirectMsg(e.target.value)}
                          className="flex-1 bg-slate-50 border border-slate-200 p-2 rounded-lg text-xs font-semibold focus:outline-none"
                        />
                        <button
                          onClick={() => handleSendDirectMsg("text")}
                          className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-[9px] px-3.5 rounded-lg uppercase"
                        >
                          Send
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => alert("Recommended Grape pathology sprays guide dispatched to Suresh's client feed.")}
                        className="py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[9px] font-bold uppercase rounded-lg border border-slate-200"
                      >
                        Recommend Article
                      </button>
                      <button
                        onClick={() => alert("Direct outbound VoIP cellular call placed to the farmer's registered phone number.")}
                        className="py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[9px] font-bold uppercase rounded-lg border border-slate-200 flex items-center justify-center gap-1"
                      >
                        <PhoneCall className="h-3 w-3" /> Call Farmer
                      </button>
                    </div>

                    <div>
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Private Agronomist Annotations</label>
                      <textarea
                        rows={2}
                        placeholder="Add annotations (e.g., highly vulnerable to copper burn during afternoon spraying)..."
                        value={privateNotes}
                        onChange={(e) => setPrivateNotes(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg mt-1 text-[11px] font-semibold"
                      />
                      <button
                        onClick={handleSaveNotes}
                        className="mt-1.5 py-1 bg-slate-150 hover:bg-slate-200 text-slate-700 text-[9px] font-black uppercase rounded-lg px-4"
                      >
                        Catalog Notes
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 flex flex-col items-center justify-center min-h-[300px]">
                  <User className="h-10 w-10 text-slate-300" />
                  <p className="text-xs font-black uppercase text-slate-700 mt-2">Dossier Locked</p>
                  <p className="text-[10px] font-bold max-w-xs mt-1">Select a grower from the registry queue to inspect primary crops, soil test history, or dispatch direct SMS pathology guides.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 8.3 SEGMENTATION */}
        {farmersTab === "segment" && (
          <motion.div
            key="segment"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Crop Segments */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Segmented Crop Focal Groups
              </h3>
              <div className="space-y-3">
                {cropSegments.map((seg, i) => (
                  <div key={i} className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl flex justify-between items-center text-left">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-xs">{seg.name}</h4>
                      <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-0.5">{seg.description}</p>
                    </div>
                    <span className="text-xs font-black text-slate-700 font-mono shrink-0 bg-slate-200/50 px-2.5 py-1 rounded-lg">
                      {seg.count} smallholders
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vulnerability Segments */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Vulnerability Risk Segmentation
              </h3>
              <div className="space-y-3">
                {vulnerabilitySegments.map((seg, i) => (
                  <div key={i} className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl flex justify-between items-center text-left">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-xs">{seg.name}</h4>
                      <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-0.5">{seg.description}</p>
                    </div>
                    <span className="text-xs font-black text-rose-700 bg-rose-50 border border-rose-100 shrink-0 px-2.5 py-1 rounded-lg">
                      {seg.count} flagged
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 8.4 BROADCAST ANNOUNCEMENTS */}
        {farmersTab === "broadcast" && (
          <motion.div
            key="broadcast"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-3xs max-w-xl mx-auto"
          >
            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Volume2 className="h-4.5 w-4.5 text-emerald-600" />
                  Sovereign Broadcast Terminal
                </h3>
                <p className="text-[10px] text-slate-400 font-bold mt-1">Simultaneously broadcast critical weather updates, pesticide advisories, or webinar invitations to an entire segmented target audience.</p>
              </div>

              <div className="space-y-3.5 text-xs font-bold pt-1">
                <div>
                  <label className="text-slate-400 text-[9px] block uppercase">Select Target segmented Group:</label>
                  <select
                    value={targetSegment}
                    onChange={(e) => setTargetSegment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg mt-1 font-extrabold"
                  >
                    <option value="Wheat Growers">Wheat Growers (142 smallholders)</option>
                    <option value="Rice Growers">Rice Growers (98 smallholders)</option>
                    <option value="Grape Vineyards">Grape Vineyards (45 smallholders)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 text-[9px] block uppercase font-black">Broadcast Alert Message (Rich SMS template):</label>
                  <textarea
                    rows={4}
                    placeholder="Enter alert copy (e.g., Western disturbance rain forecast in next 48h. Postpone foliar spraying of grapes to avoid runoff)..."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg mt-1 text-slate-700 font-semibold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer shadow-3xs"
              >
                Execute Bulk Broadcast
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
