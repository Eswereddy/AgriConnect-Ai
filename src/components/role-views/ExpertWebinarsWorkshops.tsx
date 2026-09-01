import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Video,
  Calendar,
  Users,
  Award,
  Plus,
  Clock,
  Globe,
  DollarSign,
  X,
  CheckCircle,
  TrendingUp,
  FileText,
  Volume2,
  Trash2,
  Download,
  Share2,
  MessageSquare,
  Sparkles,
  Play,
  Upload
} from "lucide-react";

export default function ExpertWebinarsWorkshops() {
  const [webinarTab, setWebinarTab] = useState<"dashboard" | "create" | "moderator" | "recordings">("dashboard");

  // --- 9.1 CREATE WORKSHOP STATES ---
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [agenda, setAgenda] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("60");
  const [platform, setPlatform] = useState("In-app video (WebRTC)");
  const [capacity, setCapacity] = useState("100");
  const [feeType, setFeeType] = useState("Free");
  const [feeAmount, setFeeAmount] = useState("99");
  const [lang, setLang] = useState("Hindi");
  const [targetAudience, setTargetAudience] = useState("Farmers");

  const [upcomingWebinars, setUpcomingWebinars] = useState([
    {
      id: "web-901",
      title: "Monsoon Wheat Blast Preemption Protocols",
      date: "2026-07-22",
      time: "04:00 PM",
      duration: "60 mins",
      language: "Hindi",
      platform: "In-app video (WebRTC)",
      capacity: 100,
      fee: "Free",
      registeredCount: 82,
      rating: 5
    },
    {
      id: "web-902",
      title: "Horticulture Soil Enrichment Ratios",
      date: "2026-07-28",
      time: "11:00 AM",
      duration: "90 mins",
      language: "Telugu",
      platform: "In-app video (WebRTC)",
      capacity: 50,
      fee: "₹199",
      registeredCount: 38,
      rating: 4.8
    }
  ]);

  const [pastWebinars, setPastWebinars] = useState([
    {
      id: "web-past-1",
      title: "Trichoderma Bio-Remediation Workshop",
      date: "2026-07-05",
      attendance: 142,
      rating: 4.9,
      revenue: "₹0 (Free)"
    },
    {
      id: "web-past-2",
      title: "Pesticide Spray Safety Standards",
      date: "2026-06-18",
      attendance: 95,
      rating: 4.7,
      revenue: "₹9,405"
    }
  ]);

  const handleCreateWebinar = (status: "Published" | "Draft") => {
    if (!title.trim() || !date) {
      alert("Please enter a Webinar Title and valid scheduled Date.");
      return;
    }

    const newWeb = {
      id: `web-${Math.floor(100 + Math.random() * 900)}`,
      title,
      date,
      time: "03:00 PM",
      duration: `${duration} mins`,
      language: lang,
      platform,
      capacity: parseInt(capacity) || 100,
      fee: feeType === "Free" ? "Free" : `₹${feeAmount}`,
      registeredCount: 0,
      rating: 5
    };

    setUpcomingWebinars([newWeb, ...upcomingWebinars]);
    alert(`Webinar "${title}" registered successfully as ${status}!`);
    
    // Reset form
    setTitle("");
    setDesc("");
    setAgenda("");
    setDate("");
    setWebinarTab("dashboard");
  };

  // --- 9.3 LIVE MODERATOR CONSOLE SIMULATOR ---
  const [activeModWebinar, setActiveModWebinar] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [raisedHands, setRaisedHands] = useState([
    { name: "Rajesh Patel", time: "04:12 PM" },
    { name: "Sita Devi", time: "04:14 PM" }
  ]);
  const [polls, setPolls] = useState([
    { question: "Have you spotted downy mildew this week?", options: ["Yes - severe", "Yes - mild", "No, clear"], votes: [18, 22, 12] }
  ]);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState("Yes, No");

  const handleCreatePoll = () => {
    if (!pollQuestion.trim()) return;
    const newPoll = {
      question: pollQuestion,
      options: pollOptions.split(",").map(o => o.trim()).filter(Boolean),
      votes: pollOptions.split(",").map(() => 0)
    };
    setPolls([newPoll, ...polls]);
    setPollQuestion("");
    alert("Interactive audience poll distributed live!");
  };

  const handleMockVote = (pollIdx: number, optIdx: number) => {
    setPolls(polls.map((p, pI) => {
      if (pI === pollIdx) {
        const updatedVotes = [...p.votes];
        updatedVotes[optIdx] += 1;
        return { ...p, votes: updatedVotes };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-6 text-left">
      {/* Sub tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setWebinarTab("dashboard")}
          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            webinarTab === "dashboard"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Video className="h-4 w-4" />
          Workshops Dashboard
        </button>
        <button
          onClick={() => setWebinarTab("create")}
          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            webinarTab === "create"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Plus className="h-4 w-4" />
          Schedule Webinar
        </button>
        {activeModWebinar && (
          <button
            onClick={() => setWebinarTab("moderator")}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              webinarTab === "moderator"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            Live Console ({activeModWebinar.title})
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* 9.2 DASHBOARD & LIST */}
        {webinarTab === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Quick webinar stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-3xs text-left">
                <span className="text-[8px] font-black text-slate-400 uppercase block tracking-wider">Upcoming Classes</span>
                <p className="text-2xl font-black text-slate-800 mt-1">{upcomingWebinars.length} Registered</p>
                <p className="text-[9px] text-emerald-600 font-bold mt-2">Next class: July 22</p>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-3xs text-left">
                <span className="text-[8px] font-black text-slate-400 uppercase block tracking-wider">Average Attendee stars</span>
                <p className="text-2xl font-black text-slate-800 mt-1">4.84 ★ Rating</p>
                <p className="text-[9px] text-slate-400 font-bold mt-2">Compiled across 24 historical webinars</p>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-3xs text-left flex flex-col justify-between">
                <div>
                  <span className="text-[8px] font-black text-slate-400 uppercase block tracking-wider">Ticket sales Profit</span>
                  <p className="text-2xl font-black text-slate-800 mt-1">₹38,205</p>
                </div>
                <p className="text-[9px] text-emerald-600 font-bold">100% disbursed via safe payout</p>
              </div>
            </div>

            {/* Split Upcoming / Past lists */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Upcoming List */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Upcoming Broadcast Schedule
                </h3>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {upcomingWebinars.map((web) => (
                    <div key={web.id} className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-3 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[8px] bg-indigo-50 text-indigo-800 border border-indigo-100 px-1.5 py-0.2 rounded font-black uppercase">
                            Lang: {web.language} • {web.fee}
                          </span>
                          <h4 className="font-extrabold text-slate-800 text-[11px] mt-1">{web.title}</h4>
                        </div>
                        <span className="text-[9px] text-slate-400 font-black font-mono">{web.date} ({web.time})</span>
                      </div>

                      <div className="flex justify-between items-center border-t border-slate-200/60 pt-2 text-[10px]">
                        <span className="text-slate-500 font-bold">{web.registeredCount} / {web.capacity} registered growers</span>
                        <button
                          onClick={() => {
                            setActiveModWebinar(web);
                            setWebinarTab("moderator");
                          }}
                          className="py-1 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded font-black uppercase tracking-wider text-[8px]"
                        >
                          Launch Instructor Deck
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Past List */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4 text-left">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Completed Workshop Records
                </h3>

                <div className="space-y-3">
                  {pastWebinars.map((past) => (
                    <div key={past.id} className="p-3 bg-white border border-slate-150 rounded-xl space-y-2 text-xs">
                      <div className="flex justify-between items-start">
                        <h4 className="font-extrabold text-slate-800 text-[11px]">{past.title}</h4>
                        <span className="text-[9px] text-slate-400 font-bold font-mono">{past.date}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 text-[9px] text-slate-500 font-bold">
                        <div>
                          <span>Attendance:</span>
                          <p className="text-slate-800">{past.attendance} growers</p>
                        </div>
                        <div>
                          <span>Avg Rating:</span>
                          <p className="text-slate-800">{past.rating} ★</p>
                        </div>
                        <div>
                          <span>Revenue:</span>
                          <p className="text-emerald-700 font-black">{past.revenue}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 9.1 CREATE FORM */}
        {webinarTab === "create" && (
          <motion.div
            key="create"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-3xs max-w-xl mx-auto text-xs"
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Schedule New Training Webinar</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-1">Configure live broadcast parameters. Announcements are pushed directly onto targeted regional farmer feeds.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 font-bold">
                <div className="col-span-2">
                  <label className="text-slate-400 text-[9px] uppercase">Webinar Title:</label>
                  <input
                    type="text"
                    placeholder="e.g., Identifying and treating wheat Blasts"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg mt-1 text-xs font-extrabold"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-slate-400 text-[9px] uppercase">Description & Agenda:</label>
                  <textarea
                    rows={3}
                    placeholder="Provide a quick outline of what botanical, chemical, and soil measures will be covered..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg mt-1 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-[9px] uppercase">Date & Time:</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg mt-1 text-xs font-extrabold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-[9px] uppercase">Duration (Minutes):</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg mt-1 text-xs font-extrabold"
                  >
                    <option value="30">30 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                    <option value="120">120 minutes</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 text-[9px] uppercase">Streaming Platform:</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg mt-1 text-xs font-extrabold"
                  >
                    <option value="In-app video (WebRTC)">Integrated WebRTC (In-App)</option>
                    <option value="Zoom">Zoom Video Communications</option>
                    <option value="Google Meet">Google Meet Sync</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 text-[9px] uppercase">Target Audience:</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg mt-1 text-xs font-extrabold"
                  >
                    <option value="Farmers">Farmers (Smallholders)</option>
                    <option value="Students">Agronomy Students</option>
                    <option value="Other Experts">Other Peer Pathologists</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 text-[9px] uppercase">Ticket Access fee:</label>
                  <select
                    value={feeType}
                    onChange={(e) => setFeeType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg mt-1 text-xs font-extrabold"
                  >
                    <option value="Free">Free Ticket Admission</option>
                    <option value="Paid">Paid Ticket Admission</option>
                  </select>
                </div>

                {feeType === "Paid" && (
                  <div>
                    <label className="text-slate-400 text-[9px] uppercase">Ticket Price (₹):</label>
                    <input
                      type="number"
                      value={feeAmount}
                      onChange={(e) => setFeeAmount(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg mt-1 text-xs font-extrabold"
                    />
                  </div>
                )}
              </div>

              <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition-all">
                <Upload className="h-6 w-6 text-slate-400 mx-auto" />
                <p className="text-[10px] font-black text-slate-600 mt-1">Upload PPT/PDF presentation slides</p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleCreateWebinar("Draft")}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleCreateWebinar("Published")}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-black rounded-lg"
                >
                  Publish & Schedule
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* 9.3 LIVE IN-APP MODERATOR CONSOLE SIMULATOR */}
        {webinarTab === "moderator" && activeModWebinar && (
          <motion.div
            key="moderator"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-5"
          >
            {/* Column 1: Video/Slides and Polls creator (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-slate-900 border border-slate-950 rounded-2xl overflow-hidden shadow-2xl relative h-[360px] flex items-center justify-center text-white">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
                  <span className="bg-red-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    LIVE PRESENTATION STREAM
                  </span>
                  <span className="bg-slate-900/80 text-emerald-400 border border-slate-700/50 text-[9px] font-black font-mono px-2 py-0.5 rounded-lg">
                    In-App WebRTC Ingress
                  </span>
                </div>

                <div className="text-center z-10 space-y-3 p-6">
                  <Play className="h-10 w-10 text-emerald-400 bg-slate-950/80 p-2.5 rounded-full mx-auto" />
                  <h4 className="font-black text-white text-base">{activeModWebinar.title}</h4>
                  <p className="text-[11px] text-slate-300">Target audience: {activeModWebinar.targetAudience || "Farmers"} • Lang: {activeModWebinar.language}</p>
                </div>

                {/* Stream action togglers */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-950/80 border border-slate-800 backdrop-blur-md px-5 py-2.5 rounded-full z-20 text-[10px] font-bold">
                  <button
                    onClick={() => {
                      setIsRecording(!isRecording);
                      alert(isRecording ? "Recording saved to video server archive." : "Recording started...");
                    }}
                    className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 ${
                      isRecording ? "bg-red-600 text-white" : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    {isRecording ? "Stop Recording" : "Record Live"}
                  </button>
                  <button
                    onClick={() => {
                      alert(`Webinar broadcast closed successfully. Dispatched recording access tokens to ${activeModWebinar.registeredCount} attendees.`);
                      setWebinarTab("dashboard");
                      setActiveModWebinar(null);
                    }}
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-black uppercase tracking-wider"
                  >
                    End Webinar
                  </button>
                </div>
              </div>

              {/* Poll creator */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs space-y-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Interactive Audience Poll Desk</span>
                <div className="flex gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Poll Question (e.g., Spotting rust lesions?)"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold"
                  />
                  <input
                    type="text"
                    placeholder="Options (comma separated)"
                    value={pollOptions}
                    onChange={(e) => setPollOptions(e.target.value)}
                    className="w-1/3 bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold"
                  />
                  <button
                    onClick={handleCreatePoll}
                    className="bg-slate-800 hover:bg-slate-900 text-white font-black uppercase text-[10px] px-4 rounded-lg"
                  >
                    Create
                  </button>
                </div>

                {polls.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-[11px] font-semibold text-slate-700">
                    {polls.map((p, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-150 rounded-xl p-3 text-left space-y-2">
                        <p className="font-extrabold text-slate-800 text-xs">Q: "{p.question}"</p>
                        <div className="space-y-1">
                          {p.options.map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              onClick={() => handleMockVote(idx, oIdx)}
                              className="w-full p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg flex justify-between text-left cursor-pointer"
                            >
                              <span>{opt}</span>
                              <span className="font-black text-slate-500 font-mono">{p.votes[oIdx]} votes</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Column 2: raised hands & moderate chat (4 cols) */}
            <div className="lg:col-span-4 space-y-4 text-xs font-semibold">
              {/* Hand Raises */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs space-y-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Audience hand raises ({raisedHands.length})</span>
                <div className="space-y-2">
                  {raisedHands.map((h, i) => (
                    <div key={i} className="p-2.5 bg-slate-50 border border-slate-150 rounded-xl flex justify-between items-center text-left">
                      <div>
                        <p className="font-extrabold text-slate-800">{h.name}</p>
                        <p className="text-[8px] text-slate-400">{h.time}</p>
                      </div>
                      <button
                        onClick={() => {
                          alert(`Granted mic audio privileges to ${h.name} live.`);
                          setRaisedHands(raisedHands.filter((_, idx) => idx !== i));
                        }}
                        className="py-1 px-2.5 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 text-[8px] font-black uppercase rounded"
                      >
                        Grant Mic
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat moderation */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs space-y-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Live Stream Moderated Chat</span>
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  <div className="bg-slate-50 p-2 rounded-lg text-left text-[10px] border border-slate-150">
                    <span className="font-black text-slate-400 uppercase text-[8px] block">Harpreet Kaur:</span>
                    "Can you verify Bordeaux spraying intervals again doctor?"
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg text-left text-[10px] border border-slate-150">
                    <span className="font-black text-slate-400 uppercase text-[8px] block">Suresh Patil:</span>
                    "This presentation slides PDF is highly informative. Dhanyawad."
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
