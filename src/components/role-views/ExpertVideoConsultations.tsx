import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Video,
  PhoneCall,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  X,
  Send,
  Sliders,
  Sparkles,
  Award,
  Download,
  AlertTriangle,
  User,
  Volume2,
  VolumeX,
  VideoOff,
  Monitor,
  FolderOpen,
  BookOpen,
  Edit,
  Trash2,
  ChevronRight,
  Bell,
  Activity,
  Search
} from "lucide-react";

interface ExpertVideoConsultationsProps {
  expertProfile: any;
  upcomingConsultations: any[];
  setUpcomingConsultations: React.Dispatch<React.SetStateAction<any[]>>;
  earnedBonus: number;
  setEarnedBonus: React.Dispatch<React.SetStateAction<number>>;
}

export default function ExpertVideoConsultations({
  expertProfile,
  upcomingConsultations,
  setUpcomingConsultations,
  earnedBonus,
  setEarnedBonus
}: ExpertVideoConsultationsProps) {
  const [videoSubTab, setVideoSubTab] = useState<"upcoming" | "history" | "analytics">("upcoming");

  // In-Call state
  const [activeCall, setActiveCall] = useState<any>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoStopped, setIsVideoStopped] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  // Whiteboard drawings state
  const [drawings, setDrawings] = useState<Array<{ x: number; y: number; color: string }>>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // In-Call Chat & PDF states
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: "Farmer", text: "Hello doctor, can you see my grape leaves?", time: "02:01 PM" }
  ]);
  const [activePdfDoc, setActivePdfDoc] = useState("Grape pathology Leaflet.pdf");
  const [aiLookupQuery, setAiLookupQuery] = useState("");
  const [aiLookupResult, setAiLookupResult] = useState<any>(null);

  // General History list
  const [completedCalls, setCompletedCalls] = useState<any[]>([
    {
      id: "HIST-BOOK-7001",
      farmerName: "Harpreet Kaur",
      location: "Amritsar, PB",
      date: "2026-07-15",
      duration: "25 mins",
      topic: "Cotton sucking pest whitefly infestation",
      rating: 5,
      notes: "Severe honey-dew mold spotted. Recommended direct neem oil (1500ppm) spray paired with yellow sticky traps."
    },
    {
      id: "HIST-BOOK-7002",
      farmerName: "Ramesh Singh",
      location: "Varanasi, UP",
      date: "2026-07-12",
      duration: "18 mins",
      topic: "Wheat seedling tip chlorosis",
      rating: 4,
      notes: "Nitrogen deficiency detected. Advised balanced urea side-dressing before active monsoon shower."
    }
  ]);

  // Filters for completed history
  const [historySearch, setHistorySearch] = useState("");
  const [historyRating, setHistoryRating] = useState("All");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Video call timer
  useEffect(() => {
    if (activeCall) {
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
  }, [activeCall]);

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${rSecs.toString().padStart(2, "0")}`;
  };

  // Upcoming Actions
  const handleJoinCall = (consultation: any) => {
    setActiveCall(consultation);
    setChatMessages([
      { sender: "System", text: `Secure WebRTC channel established with ${consultation.farmerName}. Latency: 42ms.`, time: "Now" },
      { sender: "Farmer", text: `Namaste Vikram ji, thank you for joining the session.`, time: "02:01 PM" }
    ]);
  };

  const handleSendReminder = (name: string) => {
    alert(`SMS and App push notification reminder dispatched to ${name}. Triggered local server notification cron job.`);
  };

  const handleCancelCall = (id: string) => {
    const reason = prompt("Please provide a reason for cancellation. This will be transmitted to the farmer:");
    if (reason === null) return;
    
    setUpcomingConsultations(prev => prev.filter(c => c.id !== id));
    alert(`Consultation ${id} has been cancelled. SMS notification dispatched to farmer.`);
  };

  const handleRescheduleCall = (id: string) => {
    const newDate = prompt("Enter new scheduled date (e.g., Tomorrow, 2026-07-19):", "Tomorrow");
    const newSlot = prompt("Enter new hourly slot (e.g., 04:00 PM - 05:00 PM):", "03:00 PM - 04:00 PM");
    if (!newDate || !newSlot) return;

    setUpcomingConsultations(prev =>
      prev.map(c => {
        if (c.id === id) {
          return { ...c, date: newDate, slot: newSlot, status: "Rescheduled" };
        }
        return c;
      })
    );
    alert(`Consultation ${id} has been rescheduled. Synchronization confirmation dispatched.`);
  };

  // In-Call Chat handler
  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [
      ...prev,
      { sender: "Expert", text: chatInput.trim(), time: "02:02 PM" }
    ]);
    setChatInput("");
  };

  // Whiteboard drawing simulation
  const handleWhiteboardClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDrawings([...drawings, { x, y, color: "#ef4444" }]);
  };

  // Triggering the canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear and redraw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw some grid lines
    ctx.strokeStyle = "#f1f5f9";
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let j = 0; j < canvas.height; j += 20) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(canvas.width, j);
      ctx.stroke();
    }

    // Redraw points
    drawings.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
  }, [drawings, activeCall]);

  const handleEndCall = () => {
    const notes = prompt("Enter medical-pathological prescription summaries for this grower. This compiles into their treatment PDF:", "Spotted Downy Mildew clusters. Handout attached.");
    if (notes === null) return;

    // Move to completed calls
    const newCompleted = {
      id: activeCall.id || `COMP-BOOK-${Math.floor(1000 + Math.random() * 9000)}`,
      farmerName: activeCall.farmerName,
      location: activeCall.location,
      date: "2026-07-18",
      duration: formatDuration(callDuration),
      topic: activeCall.topic,
      rating: 5,
      notes: notes || "No private notes provided."
    };

    setCompletedCalls([newCompleted, ...completedCalls]);
    setUpcomingConsultations(prev => prev.filter(c => c.id !== activeCall.id));
    
    // Add ₹499 video consultation fee to earnings
    setEarnedBonus(prev => prev + 499);

    alert(`Consultation completed! ₹499 consultation fee has been credited. PDF summary report compiled and dispatched to ${activeCall.farmerName}.`);
    setActiveCall(null);
  };

  // AI Diagnostic Lookup assistant in call
  const handleAiLookup = () => {
    if (!aiLookupQuery.trim()) return;
    setAiLookupResult({
      term: aiLookupQuery,
      pathology: "Grape Downy Mildew (Plasmopara viticola)",
      risk: "Severe (80%+ humidity trigger)",
      organicCure: "Foliar spray with Trichoderma viride biological solution (5g/L) or neem oil emulsion (1500ppm).",
      chemicalCure: "Bordeaux mixture (1%) or Copper Oxychloride spray."
    });
  };

  // History Filter computations
  const filteredHistory = completedCalls.filter(c => {
    if (historySearch) {
      const s = historySearch.toLowerCase();
      const matchName = c.farmerName?.toLowerCase().includes(s);
      const matchTopic = c.topic?.toLowerCase().includes(s);
      const matchNotes = c.notes?.toLowerCase().includes(s);
      if (!matchName && !matchTopic && !matchNotes) return false;
    }

    if (historyRating !== "All") {
      if (historyRating === "5 Stars" && c.rating !== 5) return false;
      if (historyRating === "4 Stars" && c.rating !== 4) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Top Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setVideoSubTab("upcoming")}
          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            videoSubTab === "upcoming"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Calendar className="h-4 w-4" />
          Scheduled Consultations ({upcomingConsultations.length})
        </button>
        <button
          onClick={() => setVideoSubTab("history")}
          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            videoSubTab === "history"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <CheckCircle className="h-4 w-4" />
          Completed Consultation History ({completedCalls.length})
        </button>
        <button
          onClick={() => setVideoSubTab("analytics")}
          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            videoSubTab === "analytics"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Activity className="h-4 w-4" />
          WebRTC Analytics
        </button>
      </div>

      <AnimatePresence mode="wait">
        {videoSubTab === "upcoming" && !activeCall && (
          <motion.div
            key="upcoming-list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-3xs space-y-3">
              <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Video className="h-4.5 w-4.5 text-emerald-600" />
                Active Booked Video Appointments
              </h3>
              <p className="text-[10px] text-slate-400 font-bold">
                Join stable, peer-to-peer WebRTC rooms. Review farmer-uploaded soil sheets and draw sketches in real time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingConsultations.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-200 rounded-2xl py-12 text-center col-span-2">
                  <p className="text-xs text-slate-400 italic font-bold">No upcoming video consultations booked.</p>
                </div>
              ) : (
                upcomingConsultations.map((c) => (
                  <div key={c.id} className="bg-white border border-slate-150 rounded-2xl p-5 shadow-3xs flex flex-col justify-between space-y-4 hover:shadow-xs transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-slate-800 text-xs">{c.farmerName}</span>
                          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-0.5">
                            <MapPin className="h-2.5 w-2.5" />
                            {c.location}
                          </span>
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100 mt-1 inline-block">
                          Consultation Mode: {c.mode === "video" ? "HD Video Link" : "Voice/Phone"}
                        </p>
                      </div>

                      <span className="text-[9px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded font-black uppercase font-mono tracking-wider shrink-0">
                        {c.status || "Scheduled"}
                      </span>
                    </div>

                    <div className="space-y-1 text-slate-600 text-[11px] font-semibold">
                      <div className="flex items-center gap-1 text-slate-800">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>Date/Time: <span className="font-bold">{c.date} ({c.slot})</span></span>
                      </div>
                      <div className="flex items-start gap-1 text-slate-500 italic mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span>Topic: "{c.topic} - {c.description}"</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleJoinCall(c)}
                        className="py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1 shadow-3xs"
                      >
                        <Video className="h-3.5 w-3.5 text-emerald-400" />
                        Join Call Room
                      </button>
                      <button
                        onClick={() => handleSendReminder(c.farmerName)}
                        className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-1"
                      >
                        <Bell className="h-3 w-3" />
                        Send Reminder
                      </button>
                      <button
                        onClick={() => handleRescheduleCall(c.id)}
                        className="py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-[9px] font-bold uppercase"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => handleCancelCall(c.id)}
                        className="py-1.5 bg-slate-50 hover:bg-slate-100 text-red-600 rounded-lg text-[9px] font-bold uppercase"
                      >
                        Cancel Call
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* ACTIVE VIDEOCONFERENCE ROOM */}
        {activeCall && (
          <motion.div
            key="webrtc-workspace"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-5"
          >
            {/* Column 1: Video Display & Canvas Whiteboard (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-slate-900 border border-slate-950 rounded-2xl overflow-hidden shadow-2xl relative h-[420px] flex items-center justify-center text-white">
                {/* Simulated WebRTC Feed */}
                {!isVideoStopped ? (
                  <div className="absolute inset-0">
                    <img
                      src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80"
                      alt="Farmer crop feed"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center space-y-2">
                    <VideoOff className="h-12 w-12 text-slate-600 animate-pulse" />
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Your Video Transmission Suspended</p>
                  </div>
                )}

                {/* Local Picture-in-Picture Expert Webcam Preview */}
                <div className="absolute top-4 right-4 h-24 w-32 rounded-xl overflow-hidden border border-slate-700/50 shadow-lg bg-slate-950 z-20">
                  <img
                    src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80"
                    alt="Dr Vikram Singh"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 left-1.5 text-[8px] bg-slate-900/80 px-1 py-0.2 rounded text-white font-bold">
                    You (Senior Agronomist)
                  </div>
                </div>

                {/* Time Indicator & Latency Bar */}
                <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
                  <span className="bg-red-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    LIVE WebRTC Call
                  </span>
                  <span className="bg-slate-900/80 text-emerald-400 border border-slate-700/50 text-[9px] font-black font-mono px-2 py-0.5 rounded-lg">
                    {formatDuration(callDuration)}
                  </span>
                  <span className="bg-slate-900/80 text-emerald-400 border border-slate-700/50 text-[9px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                    Latency: 42ms • Stable Bandwidth
                  </span>
                </div>

                {/* Overlay Text Annotation details */}
                <div className="absolute bottom-16 left-6 text-left space-y-1 z-10 max-w-md">
                  <h4 className="text-sm font-black text-white flex items-center gap-1">
                    {activeCall.farmerName}
                  </h4>
                  <p className="text-[10px] text-slate-300 font-medium">Topic: <span className="font-extrabold text-white">"{activeCall.topic}"</span></p>
                  <p className="text-[9px] text-slate-400 font-bold">Land: 3.5 Acres • Silt Loam Soil Matrix • Irrigation Verified</p>
                </div>

                {/* WebRTC Video Room Control Actions */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-950/80 border border-slate-800 backdrop-blur-md px-5 py-2.5 rounded-full z-20">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-2 rounded-full cursor-pointer transition-all ${
                      isMuted ? "bg-red-600 text-white" : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                    }`}
                    title={isMuted ? "Unmute Mic" : "Mute Mic"}
                  >
                    {isMuted ? <VolumeX className="h-4.5 w-4.5" /> : <Volume2 className="h-4.5 w-4.5" />}
                  </button>

                  <button
                    onClick={() => setIsVideoStopped(!isVideoStopped)}
                    className={`p-2 rounded-full cursor-pointer transition-all ${
                      isVideoStopped ? "bg-red-600 text-white" : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                    }`}
                    title={isVideoStopped ? "Start Video" : "Stop Video"}
                  >
                    {isVideoStopped ? <VideoOff className="h-4.5 w-4.5" /> : <Video className="h-4.5 w-4.5" />}
                  </button>

                  <button
                    onClick={() => setIsScreenSharing(!isScreenSharing)}
                    className={`p-2 rounded-full cursor-pointer transition-all ${
                      isScreenSharing ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                    }`}
                    title="Share Screen"
                  >
                    <Monitor className="h-4.5 w-4.5" />
                  </button>

                  <button
                    onClick={handleEndCall}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-full shadow-lg cursor-pointer"
                  >
                    End & Compile Prescriptions
                  </button>
                </div>
              </div>

              {/* Whiteboard Drawing Canvas & Side-by-side Document Viewer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Whiteboard */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] font-black uppercase text-slate-400">Pathological Drawing Whiteboard</h4>
                    <button
                      onClick={() => setDrawings([])}
                      className="text-[9px] font-black uppercase text-red-600 hover:underline"
                    >
                      Clear Board
                    </button>
                  </div>
                  <canvas
                    ref={canvasRef}
                    width={320}
                    height={160}
                    onClick={handleWhiteboardClick}
                    className="border border-slate-200 rounded-xl cursor-crosshair w-full"
                  />
                  <p className="text-[8px] text-slate-400 font-bold text-center">Click on the whiteboard to draw lesions, nodules, or anatomical annotations live.</p>
                </div>

                {/* Side-by-Side PDF Document Viewer */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center">
                      <h4 className="text-[10px] font-black uppercase text-slate-400">Side-by-Side PDF Handout Viewer</h4>
                      <span className="text-[8px] bg-indigo-50 text-indigo-700 border border-indigo-100 font-black px-1.5 rounded uppercase">Active Doc</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-2 rounded-lg mt-2 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-slate-500 shrink-0" />
                      <span className="text-[10px] text-slate-700 font-bold truncate">{activePdfDoc}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-2 italic">
                      "Section 4.1: Bordeaux solution recipe (10g copper sulphate + 10g lime in 1L water). Apply preemptively when air relative humidity exceeds 82% to stop sporangiophore germination."
                    </p>
                  </div>
                  <div className="flex gap-2.5 pt-2">
                    <button
                      onClick={() => setActivePdfDoc("Potassium Deficiencies Diagnosis.pdf")}
                      className="flex-1 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[8px] font-black uppercase rounded-lg"
                    >
                      Swap Deficiencies PDF
                    </button>
                    <button
                      onClick={() => setActivePdfDoc("Organic Bio-Control Standards.pdf")}
                      className="flex-1 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[8px] font-black uppercase rounded-lg"
                    >
                      Swap Organic PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Live chat, AI Lookup (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Call Chat sidebar */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs flex flex-col justify-between h-[250px]">
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400">WebRTC Direct Chat Box</h4>
                  <div className="space-y-1.5 h-[150px] overflow-y-auto pr-1">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`text-[10px] p-1.5 rounded-lg text-left leading-relaxed ${
                        msg.sender === "Expert"
                          ? "bg-slate-100 text-slate-700 font-semibold self-end"
                          : msg.sender === "System"
                          ? "bg-indigo-50/50 text-indigo-700 font-bold border border-indigo-100"
                          : "bg-emerald-50 text-emerald-800 font-bold"
                      }`}>
                        <span className="font-extrabold text-[8px] uppercase block text-slate-400">{msg.sender} ({msg.time}):</span>
                        {msg.text}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-1.5 border-t border-slate-100 pt-2 shrink-0">
                  <input
                    type="text"
                    placeholder="Type call text message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-semibold"
                  />
                  <button
                    onClick={handleSendChatMessage}
                    className="p-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* AI Diagnostics Assistant sidebar */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs space-y-3">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-800 uppercase tracking-wide">
                  <Sparkles className="h-4 w-4 text-emerald-600 fill-current" />
                  In-Call AI Pathology Lookup
                </div>
                <p className="text-[9px] text-slate-400 font-bold">Query standard scientific symptoms to view biological treatments live.</p>

                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Enter pathogen or symptom..."
                    value={aiLookupQuery}
                    onChange={(e) => setAiLookupQuery(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[10px] font-bold"
                  />
                  <button
                    onClick={handleAiLookup}
                    className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-[9px] px-3 rounded-lg uppercase"
                  >
                    Search
                  </button>
                </div>

                {aiLookupResult && (
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 text-[10px] space-y-1 mt-2">
                    <p className="font-extrabold text-slate-800">{aiLookupResult.pathology}</p>
                    <p className="text-[9px] text-slate-500 font-bold"><span className="uppercase text-[8px] text-slate-400 font-black">Organic:</span> {aiLookupResult.organicCure}</p>
                    <p className="text-[9px] text-slate-500 font-bold"><span className="uppercase text-[8px] text-slate-400 font-black">Chemical:</span> {aiLookupResult.chemicalCure}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {videoSubTab === "history" && (
          <motion.div
            key="history-list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-3xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Completed Video consultation History</h3>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-black uppercase tracking-wider">Historical Logs</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search historical farmer name, topic, notes..."
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <select
                  value={historyRating}
                  onChange={(e) => setHistoryRating(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="All">All Ratings</option>
                  <option value="5 Stars">5 Stars Only</option>
                  <option value="4 Stars">4 Stars Only</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {filteredHistory.map((item) => (
                <div key={item.id} className="bg-white border border-slate-150 rounded-2xl p-5 text-left space-y-2.5 hover:shadow-xs transition-all">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-800 text-xs">{item.farmerName}</span>
                        <span className="text-[9px] text-slate-400 font-bold">{item.location}</span>
                      </div>
                      <span className="text-[8px] font-black uppercase bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.2 rounded mt-1 inline-block">
                        Topic: {item.topic}
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-1 text-[10px]">
                      <span className="text-slate-400 font-bold">Completed: {item.date} • {item.duration}</span>
                      <div className="flex items-center text-amber-500 font-bold gap-0.5">
                        <Award className="h-3.5 w-3.5" />
                        <span>Rating: {item.rating} Stars</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-150 p-3 rounded-lg text-[11px]">
                    <span className="font-black text-slate-400 uppercase tracking-wider text-[8px] block">Prescription Treatment Notes:</span>
                    <p className="text-slate-700 font-bold mt-1">"{item.notes}"</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {videoSubTab === "analytics" && (
          <motion.div
            key="analytics-list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-5"
          >
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs text-left">
              <span className="text-[8px] font-black text-slate-400 uppercase block tracking-wider">Lifetime Volume</span>
              <p className="text-2xl font-black text-slate-800 mt-1">142 Calls</p>
              <p className="text-[9px] text-emerald-600 font-bold mt-2">+12 Consultations this month</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs text-left">
              <span className="text-[8px] font-black text-slate-400 uppercase block tracking-wider">Average Call Duration</span>
              <p className="text-2xl font-black text-slate-800 mt-1">22.5 mins</p>
              <p className="text-[9px] text-slate-400 font-bold mt-2">Maximum standard limit: 45 mins</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs text-left">
              <span className="text-[8px] font-black text-slate-400 uppercase block tracking-wider">Video Star endorsemens</span>
              <p className="text-2xl font-black text-slate-800 mt-1">4.92 ★ Avg</p>
              <p className="text-[9px] text-emerald-600 font-bold mt-2">Highest rated agronomist rank</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs text-left">
              <span className="text-[8px] font-black text-slate-400 uppercase block tracking-wider">Revenue Generated</span>
              <p className="text-2xl font-black text-slate-800 mt-1">₹70,858</p>
              <p className="text-[9px] text-emerald-600 font-bold mt-2">Disbursed directly via secure bank payout</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
