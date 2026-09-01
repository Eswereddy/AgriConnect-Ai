import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle,
  Clock,
  MapPin,
  AlertTriangle,
  UserCheck,
  Send,
  Plus,
  X,
  FileText,
  Link as LinkIcon,
  HelpCircle,
  Calendar,
  Share2,
  PhoneCall,
  UserPlus,
  BookOpen,
  TrendingUp,
  Download,
  Check,
  ChevronRight,
  Sparkles,
  Award,
  Maximize2,
  Minimize2,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Info,
  Trash2,
  Mail,
  Upload,
  AlertCircle,
  CheckSquare,
  Smartphone,
  Eye,
  FileSignature
} from "lucide-react";

interface ExpertQAGatewayProps {
  expertProfile: any;
  pendingQueries: any[];
  setPendingQueries: React.Dispatch<React.SetStateAction<any[]>>;
  upcomingConsultations: any[];
  setUpcomingConsultations: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function ExpertQAGateway({
  expertProfile,
  pendingQueries,
  setPendingQueries,
  upcomingConsultations,
  setUpcomingConsultations
}: ExpertQAGatewayProps) {
  // Navigation tabs for the Q&A system
  const [qaSubTab, setQaSubTab] = useState<"pending" | "history" | "analytics">("pending");

  // Filter/Search States for Open Queries
  const [searchQuery, setSearchQuery] = useState("");
  const [cropFilter, setCropFilter] = useState("All");
  const [issueFilter, setIssueFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

  // History states
  const [historySearch, setHistorySearch] = useState("");
  const [historyCrop, setHistoryCrop] = useState("All");
  const [historyRating, setHistoryRating] = useState("All");

  // Detail & Form States
  const [selectedQuery, setSelectedQuery] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  
  // Custom uploaded files simulation
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [customFiles, setCustomFiles] = useState<Array<{ name: string; size: string; type: string }>>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  // Resource links
  const [resourceLink, setResourceLink] = useState("");
  const [resourceLinkLabel, setResourceLinkLabel] = useState("");
  const [addedLinks, setAddedLinks] = useState<Array<{ label: string; url: string }>>([]);

  // Image zoom/rotate modal lightbox state
  const [isImgModalOpen, setIsImgModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotateAngle, setRotateAngle] = useState(0);
  const [showAIOverlay, setShowAIOverlay] = useState(true);

  // AI Pathology screening states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  // Specialist List for forwarding
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [forwardSpecialist, setForwardSpecialist] = useState("");

  // "Request More Info" states
  const [showMoreInfoModal, setShowMoreInfoModal] = useState(false);
  const [moreInfoMessage, setMoreInfoMessage] = useState("");
  const [infoChecklist, setInfoChecklist] = useState({
    closerScans: true,
    soilNPK: false,
    chemicalLogs: false,
    irrigationLogs: false
  });

  // "Schedule Call" state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [callTopic, setCallTopic] = useState("Complex Pathology Audit");
  const [callDate, setCallDate] = useState("2026-07-20");
  const [callSlot, setCallSlot] = useState("02:00 PM - 02:30 PM");
  const [callDuration, setCallDuration] = useState("20 mins");
  const [callNotes, setCallNotes] = useState("");

  // "Submit Sovereign Answer" Delivery & Progress state
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [deliveryChannels, setDeliveryChannels] = useState({
    push: true,
    sms: true,
    email: false
  });
  const [isPublishingProgress, setIsPublishingProgress] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);
  const [publishStatusText, setPublishStatusText] = useState("");
  const [publishingStep, setPublishingStep] = useState(0);

  // Textarea Ref for rich styling helper
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const specialists = [
    { id: "s1", name: "Dr. Ramesh Patel", specialty: "Soil Nutrition & Chemistry", university: "IARI New Delhi", rating: "4.9", experience: "18 Yrs" },
    { id: "s2", name: "Dr. Anita Nair", specialty: "Entomology & Pest Outbreaks", university: "Kerala Agri University", rating: "4.8", experience: "12 Yrs" },
    { id: "s3", name: "Prof. S. R. Chander", specialty: "Hydrology & Precision Irrigation", university: "PAU Ludhiana", rating: "4.95", experience: "22 Yrs" },
    { id: "s4", name: "Dr. G. Venkat", specialty: "Organic Farming & Bio-Remediation", university: "TNAU Coimbatore", rating: "4.7", experience: "15 Yrs" }
  ];

  const agriculturalHandouts = [
    { name: "Wheat Rust Organic Spray Guide (PDF)", size: "1.4 MB" },
    { name: "Trichoderma Soil Inoculation Dosages (PDF)", size: "850 KB" },
    { name: "ICAR Potassium Management Standards (PDF)", size: "2.1 MB" },
    { name: "Monsoon Downy Mildew Precaution Protocols (PDF)", size: "1.8 MB" }
  ];

  // Presets of quick reference guides
  const scientificPresets = [
    { label: "ICAR Plant Protection Guidelines", url: "https://icar.org.in/plant-protection" },
    { label: "FAO Bio-Pest Management Standards", url: "https://fao.org/organic-pest-control" },
    { label: "USDA Organic Foliar Spray Database", url: "https://usda.gov/organic-farming-database" },
    { label: "National Horticulture Board Manual", url: "https://nhb.gov.in/crop-disease-manual" }
  ];

  // Get extended farmer/crop info
  const getExtendedQueryDetails = (query: any) => {
    if (!query) return null;
    const detailsMap: { [key: string]: any } = {
      "q-1": {
        variety: "Thomson Seedless Grape vines",
        plantingDate: "November 14, 2025 (Pruned)",
        soilProfile: "Silty Clay Loam, pH 6.8",
        nitrogenLevel: "Marginal",
        potashLevel: "Severely Deficient",
        irrigationType: "Drip Irrigation (Daily 2 hrs)",
        weatherContext: "Overcast, 82% Humidity, 28°C",
        scansCount: "4 uploads this season",
        trustScore: 94
      },
      "q-3": {
        variety: "Arka Rakshak (High Yield Hybrid Tomato)",
        plantingDate: "May 2, 2026",
        soilProfile: "Silt Loam, pH 6.4",
        nitrogenLevel: "Optimal",
        potashLevel: "Optimal",
        irrigationType: "Furrow basin (Alternate Days)",
        weatherContext: "Sudden pre-monsoon showers, 90% Humidity, 31°C",
        scansCount: "2 uploads this season",
        trustScore: 91
      },
      "q-4": {
        variety: "HD 3086 Durum Wheat variety",
        plantingDate: "January 10, 2026",
        soilProfile: "Sandy Loam, pH 7.2",
        nitrogenLevel: "High (Excessive)",
        potashLevel: "Marginal",
        irrigationType: "Flood basin (Once in 10 days)",
        weatherContext: "Dense morning fog, 95% Humidity, 16°C",
        scansCount: "6 uploads this season",
        trustScore: 96
      }
    };

    return detailsMap[query.id] || {
      variety: `${query.crop} Local Landrace`,
      plantingDate: "Approx. 2 months ago",
      soilProfile: "Clay Loam, pH 6.9",
      nitrogenLevel: "Adequate",
      potashLevel: "Adequate",
      irrigationType: "Borewell Pump Sync",
      weatherContext: "Sunny, 65% Humidity, 32°C",
      scansCount: "1st upload",
      trustScore: 85
    };
  };

  // Helper to insert markdown styled text at cursor or end
  const handleInsertStyle = (type: "bold" | "italic" | "list" | "num" | "header") => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = replyText;
    const selected = text.substring(start, end);

    let replacement = "";
    if (type === "bold") {
      replacement = `**${selected || "bold text"}**`;
    } else if (type === "italic") {
      replacement = `*${selected || "italic text"}*`;
    } else if (type === "list") {
      replacement = `\n- ${selected || "bullet point"}`;
    } else if (type === "num") {
      replacement = `\n1. ${selected || "numbered step"}`;
    } else if (type === "header") {
      replacement = `\n### ${selected || "Section Heading"}\n`;
    }

    const newText = text.substring(0, start) + replacement + text.substring(end);
    setReplyText(newText);
    
    // Reset focus
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + 2, start + 2 + (selected || "text").length);
      }
    }, 50);
  };

  // Quick preset adder
  const addPresetLink = (preset: { label: string; url: string }) => {
    if (addedLinks.some(l => l.url === preset.url)) return;
    setAddedLinks([...addedLinks, preset]);
  };

  const addResourceLink = () => {
    if (resourceLink.trim()) {
      const label = resourceLinkLabel.trim() || `Reference Link (${addedLinks.length + 1})`;
      setAddedLinks([...addedLinks, { label, url: resourceLink.trim() }]);
      setResourceLink("");
      setResourceLinkLabel("");
    }
  };

  const removeResourceLink = (idx: number) => {
    setAddedLinks(addedLinks.filter((_, i) => i !== idx));
  };

  const toggleAttachment = (handoutName: string) => {
    if (attachedFiles.includes(handoutName)) {
      setAttachedFiles(attachedFiles.filter(f => f !== handoutName));
    } else {
      setAttachedFiles([...attachedFiles, handoutName]);
    }
  };

  // Custom file selection simulation
  const handleCustomFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const list = Array.from(e.target.files).map((file: any) => ({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: file.type
      }));
      setCustomFiles([...customFiles, ...list]);
    }
  };

  const removeCustomFile = (idx: number) => {
    setCustomFiles(customFiles.filter((_, i) => i !== idx));
  };

  // Drag and drop simulator
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const list = Array.from(e.dataTransfer.files).map((file: any) => ({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: file.type
      }));
      setCustomFiles([...customFiles, ...list]);
    }
  };

  // Trigger AI pathology deep scanning
  const runAIDeepScan = () => {
    if (!selectedQuery) return;
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Set results based on selected crop
            let results: any = {};
            if (selectedQuery.crop === "Grapes") {
              results = {
                pathogen: "Plasmopara viticola (Downy Mildew)",
                confidence: 94.6,
                severity: "Medium-High (Infested foliage: ~18%)",
                chlorosisScore: "78/100",
                necrosisScore: "24/100",
                recs: [
                  "Foliar application of Bacillus subtilis biological spray (5g/L)",
                  "Pruning low hanging leaves touching the soil basin",
                  "Restricting nitrogen fertilizer immediately to avoid lush vegetative hosts"
                ]
              };
            } else if (selectedQuery.crop === "Tomato") {
              results = {
                pathogen: "Alternaria solani (Early Blight)",
                confidence: 91.2,
                severity: "High (Concentric lesions expanding)",
                chlorosisScore: "45/100",
                necrosisScore: "68/100",
                recs: [
                  "Immediate spray of copper oxychloride (0.3%) or Trichoderma viride biological inoculant",
                  "Introduce immediate straw mulch to stop fungal soil spore splashback",
                  "Drip cycle calibration to avoid canopy moisture buildup overnight"
                ]
              };
            } else if (selectedQuery.crop === "Wheat") {
              results = {
                pathogen: "Puccinia triticina (Leaf Rust)",
                confidence: 96.1,
                severity: "Severe (Pustules active on 30% of field canopy)",
                chlorosisScore: "60/100",
                necrosisScore: "40/100",
                recs: [
                  "Apply biological Neem seed extract spray at 5% concentration",
                  "Drape potassium rich organic manure to synthesize defensive alkaloids",
                  "Deploy morning wind blocks to minimize airborne spore dispersion"
                ]
              };
            } else {
              results = {
                pathogen: "Pathological fungal blight suspect",
                confidence: 84.5,
                severity: "Moderate",
                chlorosisScore: "50/100",
                necrosisScore: "30/100",
                recs: [
                  "Apply organic Bio-fungicide spray at 4g/L of water at sunrise",
                  "Prune compromised leaf tissues and incinerate outside the perimeter"
                ]
              };
            }
            setAnalysisResults(results);
            setIsAnalyzing(false);
          }, 400);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // Submit Answer with beautiful stepper progress
  const triggerPublishAnswer = () => {
    if (!replyText.trim()) {
      alert("Please formulate your pathological or agronomist advice before submitting.");
      return;
    }
    setShowSubmitModal(true);
  };

  const executeAdvisoryPublish = () => {
    setIsPublishingProgress(true);
    setPublishProgress(0);
    setPublishingStep(1);
    setPublishStatusText("Assembling pathological prescription packet...");

    setTimeout(() => {
      setPublishProgress(25);
      setPublishingStep(2);
      setPublishStatusText("Generating sovereign agricultural PDF report...");
    }, 1000);

    setTimeout(() => {
      setPublishProgress(55);
      setPublishingStep(3);
      setPublishStatusText(deliveryChannels.sms ? "Dispatching SMS alert via Twilio Gateway..." : "Syncing network channels...");
    }, 2000);

    setTimeout(() => {
      setPublishProgress(80);
      setPublishingStep(4);
      setPublishStatusText("Broadcasting push notification to farmer terminal...");
    }, 3000);

    setTimeout(() => {
      setPublishProgress(100);
      setPublishStatusText("Advisory Published Successfully!");
      
      // Update pending queries
      setPendingQueries(prev =>
        prev.map(q => {
          if (q.id === selectedQuery.id) {
            return {
              ...q,
              replied: true,
              replyText: replyText,
              answeredDate: "2026-07-19",
              expertRating: 5,
              resourceLinks: addedLinks.map(l => l.url),
              attachments: [...attachedFiles, ...customFiles.map(f => f.name)],
              status: "Resolved"
            };
          }
          return q;
        })
      );
    }, 4000);
  };

  const closePublishSuccess = () => {
    setShowSubmitModal(false);
    setIsPublishingProgress(false);
    setPublishProgress(0);
    setPublishingStep(0);
    setSelectedQuery(null);
    setReplyText("");
    setAddedLinks([]);
    setAttachedFiles([]);
    setCustomFiles([]);
    setAnalysisResults(null);
  };

  // Request More Info flow
  const handleRequestMoreInfoSubmit = () => {
    if (!moreInfoMessage.trim()) {
      alert("Please type a message explaining what additional details or photos are required.");
      return;
    }

    const requestedItems = [];
    if (infoChecklist.closerScans) requestedItems.push("Closer leaf scan photos");
    if (infoChecklist.soilNPK) requestedItems.push("Soil NPK lab report parameters");
    if (infoChecklist.chemicalLogs) requestedItems.push("Fertilizer/pesticide logs");
    if (infoChecklist.irrigationLogs) requestedItems.push("Irrigation schedules");

    setPendingQueries(prev =>
      prev.map(q => {
        if (q.id === selectedQuery.id) {
          return {
            ...q,
            status: "Awaiting Farmer Info",
            timeAgo: "Awaiting response",
            priority: "Medium"
          };
        }
        return q;
      })
    );

    alert(`Information clarification request dispatched to ${selectedQuery.farmerName}!\n\nRequested items: ${requestedItems.join(", ")}\nMessage: ${moreInfoMessage}`);
    setShowMoreInfoModal(false);
    setSelectedQuery(null);
    setMoreInfoMessage("");
  };

  // Mark resolved directly (Close)
  const handleMarkAsResolvedDirectly = () => {
    setPendingQueries(prev =>
      prev.map(q => {
        if (q.id === selectedQuery.id) {
          return {
            ...q,
            replied: true,
            replyText: "Query marked as resolved and closed directly by verified Agri-Expert Vikram Singh.",
            answeredDate: "2026-07-19",
            status: "Resolved"
          };
        }
        return q;
      })
    );
    alert("Query marked as Resolved and closed directly.");
    setSelectedQuery(null);
  };

  // Schedule Call flow
  const handleScheduleCallSubmit = () => {
    if (!callNotes.trim()) {
      alert("Please enter notes for the consultation appointment topic.");
      return;
    }

    const newBookingId = `SOV-BOOK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEvent = {
      id: newBookingId,
      farmerName: selectedQuery.farmerName,
      location: selectedQuery.location,
      mode: "video",
      date: callDate === "2026-07-19" ? "Today" : callDate,
      slot: callSlot,
      topic: `${callTopic} (${selectedQuery.crop})`,
      description: callNotes,
      status: "Scheduled"
    };

    setUpcomingConsultations(prev => [newEvent, ...prev]);
    localStorage.setItem(
      "agriconnect_booked_consultations",
      JSON.stringify([newEvent, ...upcomingConsultations])
    );

    alert(`Video consultation slot proposal booked & dispatched to ${selectedQuery.farmerName}!\n\nTopic: ${callTopic}\nDate: ${callDate}\nSlot: ${callSlot}`);
    setShowScheduleModal(false);
  };

  const handleForwardSpecialistSubmit = () => {
    if (!forwardSpecialist) return;
    alert(`Query successfully forwarded to specialist ${forwardSpecialist}. It has been moved to their active workspace queue.`);
    setPendingQueries(prev => prev.filter(q => q.id !== selectedQuery.id));
    setSelectedQuery(null);
    setShowForwardModal(false);
  };

  // Helper to highlight markdown tags in Live Preview
  const renderMarkdownPreview = (text: string) => {
    if (!text) return <p className="text-slate-400 italic">No advisory written yet. Use the formatting bar above to prescribe treatment...</p>;
    
    // Simple markdown parsing simulation
    const lines = text.split("\n");
    return (
      <div className="space-y-1.5 text-[11px] text-slate-700 font-medium leading-relaxed">
        {lines.map((line, i) => {
          let renderedLine: any = line;
          
          // Header check
          if (line.startsWith("###")) {
            return <h4 key={i} className="text-xs font-black text-slate-800 uppercase tracking-tight mt-3 mb-1">{line.replace("###", "").trim()}</h4>;
          }
          if (line.startsWith("##")) {
            return <h3 key={i} className="text-sm font-black text-slate-900 mt-4 mb-1.5">{line.replace("##", "").trim()}</h3>;
          }

          // Bullet list check
          if (line.startsWith("-") || line.startsWith("* ")) {
            const content = line.substring(2).trim();
            return (
              <ul key={i} className="list-disc pl-4 space-y-0.5">
                <li>{parseInlineStyles(content)}</li>
              </ul>
            );
          }

          // Numbered list check
          const numRegex = /^\d+\.\s(.*)/;
          if (numRegex.test(line)) {
            const match = line.match(numRegex);
            return (
              <ol key={i} className="list-decimal pl-4 space-y-0.5">
                <li>{parseInlineStyles(match ? match[1] : line)}</li>
              </ol>
            );
          }

          return <p key={i}>{parseInlineStyles(line)}</p>;
        })}
      </div>
    );
  };

  const parseInlineStyles = (line: string) => {
    // Bold replacement
    let parts: any[] = [line];
    const boldRegex = /\*\*(.*?)\*\*/g;
    
    // Simulate simple styling processing
    let match;
    let index = 0;
    const resultElements = [];

    // Simple parser
    const boldSplit = line.split("**");
    if (boldSplit.length > 1) {
      return boldSplit.map((chunk, idx) => {
        if (idx % 2 === 1) {
          // Check italic inside bold
          if (chunk.includes("*")) {
            return <strong key={idx} className="font-extrabold text-slate-950 italic">{chunk.replace(/\*/g, "")}</strong>;
          }
          return <strong key={idx} className="font-extrabold text-slate-950">{chunk}</strong>;
        } else {
          if (chunk.includes("*")) {
            const italicSplit = chunk.split("*");
            return italicSplit.map((itChunk, itIdx) => {
              if (itIdx % 2 === 1) return <em key={itIdx} className="italic text-slate-800">{itChunk}</em>;
              return itChunk;
            });
          }
          return chunk;
        }
      });
    }

    const italicSplit = line.split("*");
    if (italicSplit.length > 1) {
      return italicSplit.map((chunk, idx) => {
        if (idx % 2 === 1) return <em key={idx} className="italic text-slate-800">{chunk}</em>;
        return chunk;
      });
    }

    return line;
  };

  // Filtered open queries
  const activePendingQueries = pendingQueries.filter(q => {
    if (q.replied) return false;

    // Search filter
    if (searchQuery) {
      const s = searchQuery.toLowerCase();
      const matchName = q.farmerName?.toLowerCase().includes(s);
      const matchCrop = q.crop?.toLowerCase().includes(s);
      const matchTitle = q.title?.toLowerCase().includes(s);
      const matchQuestion = q.question?.toLowerCase().includes(s);
      const matchLocation = q.location?.toLowerCase().includes(s);
      if (!matchName && !matchCrop && !matchTitle && !matchQuestion && !matchLocation) return false;
    }

    // Dropdown filters
    if (cropFilter !== "All" && q.crop !== cropFilter) return false;
    if (issueFilter !== "All" && q.issueType !== issueFilter) return false;
    if (priorityFilter !== "All" && q.priority !== priorityFilter) return false;

    // Date filters
    if (dateFilter !== "All") {
      if (dateFilter === "Today") {
        if (q.date !== "2026-07-19" && !(q.timeAgo && q.timeAgo.includes("hour"))) return false;
      } else if (dateFilter === "Past 3 Days") {
        const allowed = ["2026-07-19", "2026-07-18", "2026-07-17"];
        if (!allowed.includes(q.date)) return false;
      } else if (dateFilter === "Past Week") {
        const allowed = ["2026-07-19", "2026-07-18", "2026-07-17", "2026-07-16", "2026-07-15", "2026-07-14", "2026-07-13"];
        if (!allowed.includes(q.date)) return false;
      }
    }

    return true;
  });

  // Filtered answered history
  const activeHistoryQueries = pendingQueries.filter(q => {
    if (!q.replied) return false;

    // History search
    if (historySearch) {
      const s = historySearch.toLowerCase();
      const matchName = q.farmerName?.toLowerCase().includes(s);
      const matchCrop = q.crop?.toLowerCase().includes(s);
      const matchReply = q.replyText?.toLowerCase().includes(s);
      if (!matchName && !matchCrop && !matchReply) return false;
    }

    // History filters
    if (historyCrop !== "All" && q.crop !== historyCrop) return false;
    if (historyRating !== "All") {
      if (historyRating === "5 Stars" && q.expertRating !== 5) return false;
      if (historyRating === "Unrated" && q.expertRating !== undefined && q.expertRating > 0) return false;
    }

    return true;
  });

  const handleExport = (format: "CSV" | "Excel" | "PDF") => {
    alert(`Compiling complete database of resolved queries... Generating high-fidelity ${format} diagnostic logs payload. Your download will begin in a few seconds.`);
  };

  const extDetails = getExtendedQueryDetails(selectedQuery);

  return (
    <div className="space-y-6 text-left">
      {/* Tab Switcher */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setQaSubTab("pending")}
          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            qaSubTab === "pending"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          Pending Farmer Queries ({pendingQueries.filter(q => !q.replied).length})
        </button>
        <button
          onClick={() => setQaSubTab("history")}
          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            qaSubTab === "history"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <CheckCircle className="h-4 w-4" />
          Resolved Advisory History ({pendingQueries.filter(q => q.replied).length})
        </button>
        <button
          onClick={() => setQaSubTab("analytics")}
          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            qaSubTab === "analytics"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          Gateway Analytics
        </button>
      </div>

      <AnimatePresence mode="wait">
        {qaSubTab === "pending" && (
          <motion.div
            key="pending-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left column: List and Filters (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-3xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <MessageSquare className="h-4.5 w-4.5 text-emerald-600" />
                      Active Question Gateway
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">Filter and respond to incoming diagnostic queries</p>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded font-black font-mono">
                    {activePendingQueries.length} MATCHES
                  </span>
                </div>

                {/* Filters Row */}
                <div className="space-y-2.5">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search farmer, crop, keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <select
                      value={cropFilter}
                      onChange={(e) => setCropFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="All">All Crops</option>
                      <option value="Wheat">Wheat</option>
                      <option value="Rice">Rice</option>
                      <option value="Cotton">Cotton</option>
                      <option value="Grapes">Grapes</option>
                      <option value="Coconut Palm">Coconut Palm</option>
                      <option value="Tomato">Tomato</option>
                    </select>

                    <select
                      value={issueFilter}
                      onChange={(e) => setIssueFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="All">All Issues</option>
                      <option value="Disease">Disease</option>
                      <option value="Pest">Pest</option>
                      <option value="Soil">Soil</option>
                      <option value="Fertilizer">Fertilizer</option>
                    </select>

                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="All">Priority</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* List */}
              <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                {activePendingQueries.length === 0 ? (
                  <div className="bg-white border border-dashed border-slate-200 rounded-2xl py-12 text-center">
                    <p className="text-xs text-slate-400 italic font-bold">No pending farmer queries match the filter settings.</p>
                  </div>
                ) : (
                  activePendingQueries.map((q) => (
                    <div
                      key={q.id}
                      onClick={() => {
                        setSelectedQuery(q);
                        setAnalysisResults(null);
                      }}
                      className={`p-4 rounded-xl border transition-all text-left cursor-pointer relative overflow-hidden ${
                        selectedQuery?.id === q.id
                          ? "bg-emerald-50/50 border-emerald-400 shadow-sm"
                          : "bg-white border-slate-150 hover:border-slate-300"
                      }`}
                    >
                      {/* Left accent bar based on priority */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                        q.priority === "High" ? "bg-rose-500" : q.priority === "Medium" ? "bg-amber-400" : "bg-slate-300"
                      }`} />

                      <div className="flex justify-between items-start pl-1">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-800 text-xs">{q.farmerName}</span>
                            <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-0.5">
                              <MapPin className="h-2.5 w-2.5" />
                              {q.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className="text-[8px] bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.2 rounded font-black uppercase tracking-wider">
                              Crop: {q.crop}
                            </span>
                            <span className="text-[8px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded font-black uppercase tracking-wider">
                              {q.issueType}
                            </span>
                            {q.status && q.status !== "Pending" && (
                              <span className="text-[8px] bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.2 rounded font-black uppercase">
                                {q.status}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border flex items-center gap-1 ${
                            q.priority === "High"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : q.priority === "Medium"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-slate-50 text-slate-600 border-slate-200"
                          }`}>
                            {q.priority}
                          </span>
                          <span className="text-[9px] text-slate-400 font-bold font-mono flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {q.timeAgo || q.date}
                          </span>
                        </div>
                      </div>

                      <p className="font-extrabold text-slate-800 text-xs mt-3 leading-snug pl-1">{q.title}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-1 line-clamp-2 italic pl-1">
                        "{q.question}"
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right column: Action Workspace & detail card (7 cols) */}
            <div className="lg:col-span-7">
              {selectedQuery ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs text-left space-y-4">
                  {/* Farmer profile / Crop diagnostic details */}
                  <div className="border-b border-slate-100 pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] bg-rose-100 text-rose-800 font-black px-1.5 py-0.5 rounded uppercase">
                            DIAGNOSTIC CASE FILE
                          </span>
                          {selectedQuery.status && selectedQuery.status !== "Pending" && (
                            <span className="text-[8px] bg-purple-100 text-purple-800 font-black px-1.5 py-0.5 rounded uppercase">
                              {selectedQuery.status}
                            </span>
                          )}
                        </div>
                        <h4 className="font-black text-slate-800 text-base mt-1.5 flex items-center gap-1.5">
                          {selectedQuery.farmerName}
                          <span className="text-xs bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full font-bold">
                            Trust Index: {extDetails?.trustScore}%
                          </span>
                        </h4>
                        <p className="text-xs text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          Location: {selectedQuery.location} • Verified Land Registry active
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedQuery(null)}
                        className="p-1 hover:bg-slate-100 rounded-full"
                      >
                        <X className="h-4 w-4 text-slate-400" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3 bg-slate-50/70 p-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
                      <div>
                        <span className="text-slate-400 font-black uppercase text-[8px] block tracking-wider">Crop Variety:</span>
                        <span className="text-slate-800 font-bold">{extDetails?.variety}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-black uppercase text-[8px] block tracking-wider">Planting Date:</span>
                        <span className="text-slate-800 font-bold">{extDetails?.plantingDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-black uppercase text-[8px] block tracking-wider">Soil Profile:</span>
                        <span className="text-slate-800 font-bold">{extDetails?.soilProfile}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-black uppercase text-[8px] block tracking-wider">Atmospheric:</span>
                        <span className="text-slate-800 font-bold">{extDetails?.weatherContext}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-black uppercase text-[8px] block tracking-wider">Water Setup:</span>
                        <span className="text-slate-800 font-bold">{extDetails?.irrigationType}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-black uppercase text-[8px] block tracking-wider">Soil Potash Index:</span>
                        <span className={`font-black ${extDetails?.potashLevel.includes("Deficient") ? "text-rose-600" : "text-emerald-700"}`}>
                          {extDetails?.potashLevel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Question description & uploaded images */}
                  <div className="space-y-3">
                    <div className="bg-slate-100/40 p-4 rounded-xl border border-slate-150 leading-relaxed">
                      <h5 className="font-extrabold text-slate-800 text-sm mb-1">{selectedQuery.title}</h5>
                      <p className="text-xs text-slate-600 font-medium italic">
                        "{selectedQuery.question}"
                      </p>
                    </div>

                    {selectedQuery.imageUrl ? (
                      <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Uploaded Pathology Scans:</span>
                          <button
                            onClick={() => {
                              setZoomLevel(1);
                              setRotateAngle(0);
                              setIsImgModalOpen(true);
                            }}
                            className="text-[9px] text-emerald-700 font-black uppercase flex items-center gap-1 hover:underline"
                          >
                            <Eye className="h-3 w-3" /> Zoom / Analyze Details
                          </button>
                        </div>
                        <div className="relative group overflow-hidden rounded-lg border border-slate-200 max-w-xs cursor-pointer" onClick={() => setIsImgModalOpen(true)}>
                          <img
                            src={selectedQuery.imageUrl}
                            alt="Farmer diagnostic leaf scan"
                            referrerPolicy="no-referrer"
                            className="h-28 w-full object-cover group-hover:scale-105 transition-all duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-black uppercase tracking-wider gap-1">
                            <Maximize2 className="h-3.5 w-3.5" />
                            Expand Scanner
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[10px] text-amber-700 font-bold flex items-center gap-1.5">
                        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                        No diagnosis images uploaded. Click "Request More Info" action below to request a high-definition leaf or soil scan.
                      </div>
                    )}
                  </div>

                  {/* AI-generated preliminary diagnosis */}
                  <div className="bg-indigo-50/50 border border-indigo-150 rounded-xl p-4 space-y-2 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[10px] font-black text-indigo-800 uppercase tracking-wide">
                        <Sparkles className="h-4 w-4 text-indigo-600 fill-current animate-pulse" />
                        Gemini AI Pathology Screening
                      </div>
                      <button
                        onClick={runAIDeepScan}
                        disabled={isAnalyzing}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-[9px] uppercase px-2.5 py-1 rounded-md transition-all flex items-center gap-1"
                      >
                        {isAnalyzing ? "Analyzing..." : "Trigger Deep-Scan"}
                      </button>
                    </div>

                    {isAnalyzing ? (
                      <div className="py-4 space-y-2">
                        <div className="flex justify-between text-[10px] font-black text-indigo-700">
                          <span>Analyzing cellular structures & anomalies...</span>
                          <span>{analysisProgress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-indigo-100 rounded-full overflow-hidden relative">
                          <div className="h-full bg-indigo-600 rounded-full transition-all duration-150" style={{ width: `${analysisProgress}%` }} />
                          {/* Laser sweeping light */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-12 animate-shimmer" />
                        </div>
                      </div>
                    ) : analysisResults ? (
                      <div className="text-xs text-indigo-900/90 font-medium space-y-2 animate-in fade-in duration-300">
                        <div className="grid grid-cols-2 gap-2 text-[10px] border-b border-indigo-100 pb-2">
                          <div>
                            <span className="text-indigo-400 uppercase font-black text-[8px] block">Detected Pathogen:</span>
                            <span className="font-extrabold text-indigo-950">{analysisResults.pathogen}</span>
                          </div>
                          <div>
                            <span className="text-indigo-400 uppercase font-black text-[8px] block">Confidence Rating:</span>
                            <span className="font-extrabold text-emerald-700 font-mono text-xs">{analysisResults.confidence}% Matches</span>
                          </div>
                          <div>
                            <span className="text-indigo-400 uppercase font-black text-[8px] block">Chlorosis Score:</span>
                            <span className="font-extrabold text-indigo-950">{analysisResults.chlorosisScore}</span>
                          </div>
                          <div>
                            <span className="text-indigo-400 uppercase font-black text-[8px] block">Necrosis Score:</span>
                            <span className="font-extrabold text-indigo-950">{analysisResults.necrosisScore}</span>
                          </div>
                        </div>

                        <div className="text-[11px]">
                          <span className="text-indigo-400 uppercase font-black text-[8px] block mb-1">Recommended Bio-Mitigation pathways:</span>
                          <ul className="space-y-1 pl-4 list-disc text-slate-700 font-semibold">
                            {analysisResults.recs.map((rec: string, i: number) => (
                              <li key={i}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="text-[10px] text-indigo-700/90 font-semibold leading-relaxed">
                        <span className="font-bold text-slate-800 block">Suggested Pathology (Quick Screening):</span>
                        Pre-analyzed signature matching {selectedQuery.crop} biological anomalies. Confidence: <span className="font-bold text-slate-800 font-mono">92% Match</span>.
                        <span className="font-bold text-slate-800 block mt-1">AI Recommendation:</span> Apply 0.5% biological Trichoderma viride foliar spray directly at sunrise. Click "Trigger Deep-Scan" above to analyze cellular indices.
                      </div>
                    )}
                  </div>

                  {/* Expert Advisory Composer Form */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-700 uppercase tracking-wide block">Formulate Clinical Botanical Advice</span>
                      
                      {/* Rich Formatting simulated toolbar */}
                      <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                        <button
                          type="button"
                          onClick={() => handleInsertStyle("bold")}
                          className="px-2 py-1 hover:bg-white rounded text-[10px] font-black text-slate-700"
                          title="Bold Text (Ctrl+B)"
                        >
                          B
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertStyle("italic")}
                          className="px-2 py-1 hover:bg-white rounded text-[10px] italic font-bold text-slate-700"
                          title="Italic Text (Ctrl+I)"
                        >
                          I
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertStyle("header")}
                          className="px-2 py-1 hover:bg-white rounded text-[10px] font-extrabold text-slate-700"
                          title="Insert Section Header"
                        >
                          H3
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertStyle("list")}
                          className="px-2 py-1 hover:bg-white rounded text-[10px] font-bold text-slate-700"
                          title="Bullet List"
                        >
                          • List
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertStyle("num")}
                          className="px-2 py-1 hover:bg-white rounded text-[10px] font-bold text-slate-700"
                          title="Numbered List"
                        >
                          1. Step
                        </button>
                      </div>
                    </div>

                    <textarea
                      ref={textareaRef}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Prescribe biological formulas, organic treatment compounds, NPK ratios, or watering frequencies for ${selectedQuery.farmerName}...`}
                      rows={5}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400"
                    />

                    {/* Live Rendered Advisory Preview */}
                    <div className="bg-slate-50/50 rounded-xl border border-dashed border-slate-200 p-3 space-y-1">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Live Advisory Preview (What the Farmer Sees):</span>
                      <div className="bg-white p-3 rounded-lg border border-slate-100 min-h-[50px] shadow-3xs max-h-[140px] overflow-y-auto">
                        {renderMarkdownPreview(replyText)}
                      </div>
                    </div>

                    {/* Handout Attachment selection */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5 text-slate-400" />
                        Attach Institutional Pathology Guides & PDF Handouts
                      </span>
                      <div className="grid grid-cols-2 gap-2 max-h-[110px] overflow-y-auto pr-1">
                        {agriculturalHandouts.map((handout, i) => {
                          const isAttached = attachedFiles.includes(handout.name);
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => toggleAttachment(handout.name)}
                              className={`p-2.5 rounded-lg border text-left text-[9px] font-bold transition-all cursor-pointer flex flex-col justify-between ${
                                isAttached
                                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              <span className="line-clamp-1 flex items-center gap-1">
                                <FileText className={`h-3 w-3 shrink-0 ${isAttached ? "text-emerald-600" : "text-slate-400"}`} />
                                {handout.name}
                              </span>
                              <span className="text-[8px] font-mono text-slate-400 mt-1">{handout.size}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Custom Image/PDF File Upload Box */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Upload className="h-3.5 w-3.5 text-slate-400" />
                        Upload Custom Advisory Attachments (Schematics, Lab reports)
                      </span>
                      
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                          isDragging
                            ? "border-emerald-500 bg-emerald-50/20"
                            : "border-slate-250 bg-slate-50 hover:bg-slate-100/50"
                        }`}
                      >
                        <input
                          type="file"
                          id="custom-file-upload"
                          multiple
                          className="hidden"
                          onChange={handleCustomFileSelect}
                        />
                        <label htmlFor="custom-file-upload" className="cursor-pointer block space-y-1">
                          <Upload className="h-6 w-6 text-slate-400 mx-auto" />
                          <p className="text-[10px] font-bold text-slate-600">
                            Drag & drop files here, or <span className="text-emerald-700 underline">browse local files</span>
                          </p>
                          <p className="text-[8px] text-slate-400">Supports PDF, JPG, PNG up to 10MB</p>
                        </label>
                      </div>

                      {customFiles.length > 0 && (
                        <div className="space-y-1 pt-1">
                          {customFiles.map((file, idx) => (
                            <div key={idx} className="bg-slate-50 border border-slate-150 rounded-lg p-2 flex items-center justify-between text-[10px] font-bold text-slate-700">
                              <span className="flex items-center gap-1.5 truncate">
                                <FileText className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                                {file.name}
                                <span className="text-[8px] font-mono text-slate-400 font-normal">({file.size})</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => removeCustomFile(idx)}
                                className="text-slate-400 hover:text-rose-600 p-0.5 rounded"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Scientific resource links */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <LinkIcon className="h-3.5 w-3.5 text-slate-400" />
                        Append Academic References & Scientific Resource Links
                      </span>
                      
                      {/* Presets suggestions */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-[8px] font-black text-slate-400 uppercase self-center mr-1">Quick Add Presets:</span>
                        {scientificPresets.map((preset, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => addPresetLink(preset)}
                            className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[8px] font-bold px-2 py-1 rounded transition-all cursor-pointer"
                          >
                            + {preset.label}
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                        <input
                          type="text"
                          placeholder="Link Label (e.g., ICAR Grape Manual)"
                          value={resourceLinkLabel}
                          onChange={(e) => setResourceLinkLabel(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold focus:outline-none"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Link URL (https://...)"
                            value={resourceLink}
                            onChange={(e) => setResourceLink(e.target.value)}
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={addResourceLink}
                            className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-[10px] uppercase px-3.5 rounded-lg cursor-pointer"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      {addedLinks.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {addedLinks.map((link, idx) => (
                            <span key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded px-2.5 py-1 text-[9px] font-black flex items-center gap-1.5 animate-in zoom-in duration-200">
                              <LinkIcon className="h-2.5 w-2.5 text-emerald-600" />
                              {link.label}
                              <button onClick={() => removeResourceLink(idx)} className="hover:text-red-600 font-extrabold text-[12px] ml-1">×</button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Suite of Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                      <button
                        onClick={triggerPublishAnswer}
                        className="py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1.5 col-span-2 shadow-xs"
                      >
                        <Send className="h-4 w-4" />
                        Submit Sovereign Answer Package
                      </button>

                      <button
                        onClick={() => setShowMoreInfoModal(true)}
                        className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Info className="h-3.5 w-3.5 text-slate-500" />
                        Request More Info
                      </button>

                      <button
                        onClick={() => setShowForwardModal(true)}
                        className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1"
                      >
                        <UserPlus className="h-3.5 w-3.5 text-slate-500" />
                        Forward Specialist
                      </button>

                      <button
                        onClick={handleMarkAsResolvedDirectly}
                        className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Check className="h-3.5 w-3.5 text-slate-500" />
                        Mark Resolved
                      </button>

                      <button
                        onClick={() => {
                          setCallNotes(`Audit of ${selectedQuery.crop} biological symptoms reported in field logs.`);
                          setShowScheduleModal(true);
                        }}
                        className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1"
                      >
                        <PhoneCall className="h-3.5 w-3.5 text-slate-500" />
                        Schedule Video Call
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 space-y-2 h-full flex flex-col items-center justify-center min-h-[480px]">
                  <MessageSquare className="h-10 w-10 text-slate-300 animate-bounce" />
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-700">No Query Selected</h4>
                    <p className="text-[10px] font-bold mt-1 max-w-xs mx-auto">Select a diagnostic question from the active queue to view farm profiles, diagnostic leaf scans, and formulate botanical advice.</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {qaSubTab === "history" && (
          <motion.div
            key="history-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* History filters */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-3xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Sovereign Resolved Q&A Archive
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">Audit log of resolved diagnostic cases, farmer feedback, and advisory logs.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleExport("CSV")} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-[9px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1 cursor-pointer">
                    <Download className="h-3 w-3" /> Export CSV
                  </button>
                  <button onClick={() => handleExport("Excel")} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-[9px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1 cursor-pointer">
                    <Download className="h-3 w-3" /> Excel
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name, crop, advice..."
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <select
                  value={historyCrop}
                  onChange={(e) => setHistoryCrop(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="All">All Crops</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Rice">Rice</option>
                  <option value="Grapes">Grapes</option>
                  <option value="Coconut Palm">Coconut Palm</option>
                  <option value="Tomato">Tomato</option>
                </select>

                <select
                  value={historyRating}
                  onChange={(e) => setHistoryRating(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="All">All Ratings</option>
                  <option value="5 Stars">5 Stars Only</option>
                  <option value="Unrated">Unrated/In Progress</option>
                </select>
              </div>
            </div>

            {/* List */}
            <div className="space-y-3">
              {activeHistoryQueries.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-200 rounded-2xl py-12 text-center text-slate-400">
                  No resolved queries found matching the filters.
                </div>
              ) : (
                activeHistoryQueries.map((q) => (
                  <div key={q.id} className="bg-white border border-slate-150 rounded-2xl p-5 text-left space-y-3">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-800 text-xs">{q.farmerName}</span>
                          <span className="text-[9px] text-slate-400 font-bold">{q.location}</span>
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.2 rounded mt-1 inline-block">
                          Crop: {q.crop} • {q.issueType}
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-1 text-[10px]">
                        <span className="text-slate-400 font-bold">Resolved: {q.answeredDate || q.date}</span>
                        <div className="flex items-center text-amber-500 font-bold gap-0.5">
                          <Award className="h-3.5 w-3.5 text-amber-500" />
                          <span>Farmer endorsement: {q.expertRating || 5} ★</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2.5 text-[11px]">
                      <div>
                        <span className="font-black text-slate-400 uppercase tracking-wider text-[8px] block">Query Description:</span>
                        <p className="text-slate-600 font-semibold italic">"{q.question}"</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl">
                        <span className="font-black text-emerald-800 uppercase tracking-wider text-[8px] block">Your Prescribed Treatment Advice:</span>
                        <div className="text-slate-800 mt-1.5 leading-relaxed font-semibold">
                          {renderMarkdownPreview(q.replyText)}
                        </div>
                      </div>
                      
                      {q.attachments && q.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <span className="text-[8px] font-black text-slate-400 uppercase self-center mr-1">Dispatched Materials:</span>
                          {q.attachments.map((file: string, idx: number) => (
                            <span key={idx} className="bg-slate-100 text-slate-700 border border-slate-200 rounded px-2.5 py-0.5 text-[8px] font-bold flex items-center gap-1">
                              <FileText className="h-3 w-3 text-slate-500" />
                              {file}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {qaSubTab === "analytics" && (
          <motion.div
            key="analytics-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left"
          >
            {/* Lifetimes stats */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Response Speed & Volume</h4>
              <div className="space-y-3.5 pt-1">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Lifetime Solved Questions</span>
                  <span className="text-2xl font-black text-slate-800">428 Resolved</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Average Response Time</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-slate-800">18.4 mins</span>
                    <span className="text-[9px] text-emerald-600 font-black uppercase bg-emerald-50 px-1.5 py-0.2 rounded">Goal Met: &lt; 30 mins</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Farmer Satisfaction</span>
                  <span className="text-2xl font-black text-slate-800">4.96 / 5.0 Rating</span>
                </div>
              </div>
            </div>

            {/* Word cloud frequently asked topics */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Anomalies Word Cloud</h4>
              <p className="text-[9px] text-slate-400 font-bold">Frequently discussed pathological terms and botanical deficiencies compiled this month.</p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[12px] font-black text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">Downy Mildew (48)</span>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">Trichoderma (35)</span>
                <span className="text-[14px] font-black text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">Leaf Rust (52)</span>
                <span className="text-[9px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-md border border-rose-100 animate-pulse">Whitefly (22)</span>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">pH Salinity (18)</span>
                <span className="text-[11px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">Potassium (29)</span>
                <span className="text-[9px] font-medium text-slate-400 bg-slate-50 px-1.5 py-0.2 rounded-md">Urea Nitrate (14)</span>
                <span className="text-[12px] font-black text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">Blight (38)</span>
              </div>
            </div>

            {/* Direct Export logs suite */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs flex flex-col justify-between">
              <div className="space-y-1">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Clinical Audit Logging</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Export complete records of diagnostic queries, soil analysis matches, and prescribed organic/chemical treat logs. Standard formats comply with ICAR records requirements.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-4">
                <button
                  onClick={() => handleExport("PDF")}
                  className="py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-wider text-center cursor-pointer flex items-center justify-center gap-1 shadow-3xs border-none"
                >
                  <FileText className="h-3 w-3 text-rose-400" />
                  PDF Audit Report
                </button>
                <button
                  onClick={() => handleExport("Excel")}
                  className="py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-[9px] font-black uppercase tracking-wider text-center cursor-pointer flex items-center justify-center gap-1 shadow-3xs"
                >
                  <Download className="h-3 w-3 text-emerald-600" />
                  Excel Workbook
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Interactive Image Zoom/Rotate Lightbox Modal */}
      {isImgModalOpen && selectedQuery && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-6 text-white select-none">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <div>
              <span className="text-[9px] bg-emerald-600 text-white font-black px-2 py-0.5 rounded uppercase tracking-wider">
                Micro-Pathology Scan Explorer
              </span>
              <h3 className="text-sm font-extrabold mt-1 text-slate-100">{selectedQuery.farmerName} • {selectedQuery.crop} Leaf</h3>
            </div>
            <button
              onClick={() => setIsImgModalOpen(false)}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-all"
            >
              <X className="h-5 w-5 text-slate-200" />
            </button>
          </div>

          {/* Main workspace */}
          <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 my-4 overflow-hidden relative">
            
            {/* Left side: Canvas display */}
            <div className="flex-1 h-full flex items-center justify-center relative overflow-hidden bg-slate-900/60 rounded-2xl border border-white/5">
              <div
                className="transition-all duration-200 ease-out flex items-center justify-center relative"
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotateAngle}deg)`
                }}
              >
                <img
                  src={selectedQuery.imageUrl}
                  alt="Pathological leaves macro scan"
                  referrerPolicy="no-referrer"
                  className="max-h-[60vh] max-w-full md:max-w-[40vw] object-contain rounded-lg shadow-2xl"
                />

                {/* Simulated AI Overlays */}
                {showAIOverlay && (
                  <div className="absolute inset-0 border border-yellow-400 pointer-events-none rounded-lg overflow-hidden animate-pulse">
                    {selectedQuery.crop === "Grapes" && (
                      <>
                        <div className="absolute top-[20%] left-[30%] border border-rose-500 bg-rose-500/10 text-[8px] font-black px-1 py-0.2 rounded text-rose-300 uppercase pointer-events-auto cursor-help" title="Fungal spores colony spreading">
                          Chlorotic spots (87%)
                        </div>
                        <div className="absolute bottom-[35%] right-[25%] border border-amber-500 bg-amber-500/10 text-[8px] font-black px-1 py-0.2 rounded text-amber-300 uppercase pointer-events-auto cursor-help" title="Potassium necrosis sign">
                          Potash deficiency (92%)
                        </div>
                      </>
                    )}
                    {selectedQuery.crop === "Tomato" && (
                      <>
                        <div className="absolute top-[40%] left-[45%] border border-rose-500 bg-rose-500/10 text-[8px] font-black px-1 py-0.2 rounded text-rose-300 uppercase pointer-events-auto cursor-help" title="Concentric leaf lesions">
                          Early Blight lesions (94%)
                        </div>
                        <div className="absolute bottom-[20%] left-[20%] border border-yellow-500 bg-yellow-500/10 text-[8px] font-black px-1 py-0.2 rounded text-yellow-300 uppercase">
                          Necrotic margin (88%)
                        </div>
                      </>
                    )}
                    {selectedQuery.crop === "Wheat" && (
                      <>
                        <div className="absolute top-[30%] right-[30%] border border-orange-500 bg-orange-500/10 text-[8px] font-black px-1 py-0.2 rounded text-orange-200 uppercase">
                          Puccinia spore pustules (96%)
                        </div>
                        <div className="absolute bottom-[40%] left-[35%] border border-rose-500 bg-rose-500/10 text-[8px] font-black px-1 py-0.2 rounded text-rose-300 uppercase">
                          Rust spread line
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right side: Image Metadata & overlay toggles */}
            <div className="w-full md:w-80 shrink-0 bg-slate-900 border border-white/10 p-4 rounded-2xl space-y-4">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Analysis Console</h4>
              
              {/* Toggles */}
              <div className="space-y-2.5">
                <button
                  onClick={() => setShowAIOverlay(!showAIOverlay)}
                  className={`w-full p-2.5 rounded-xl border text-[10px] font-black uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                    showAIOverlay
                      ? "bg-indigo-600 border-indigo-400 text-white"
                      : "bg-white/5 border-white/10 text-slate-400"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" /> AI Diagnostics Overlay
                  </span>
                  <span>{showAIOverlay ? "Active" : "Disabled"}</span>
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Zoom & Orientation:</span>
                <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                  <button
                    onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 3))}
                    className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex justify-center cursor-pointer"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
                    className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex justify-center cursor-pointer"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setRotateAngle(prev => (prev + 90) % 360)}
                    className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex justify-center cursor-pointer font-mono"
                  >
                    <RotateCw className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setZoomLevel(1);
                      setRotateAngle(0);
                    }}
                    className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[9px] font-black uppercase flex items-center justify-center cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Metadata */}
              <div className="space-y-2 text-[10px] border-t border-white/10 pt-3 text-slate-300 font-semibold">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Photo EXIF Metadata:</span>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 bg-white/5 p-2.5 rounded-lg border border-white/5">
                  <div>
                    <span className="text-slate-500 text-[8px] uppercase block">Capture Device:</span>
                    <span className="text-slate-200">Vivo 1902 Camera</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[8px] uppercase block">Resolution:</span>
                    <span className="text-slate-200">3024 × 4032 (12MP)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[8px] uppercase block">GPS Location:</span>
                    <span className="text-slate-200">20.0125°N, 73.8214°E</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[8px] uppercase block">Focal Depth:</span>
                    <span className="text-slate-200">Macro F/1.8 (4.1mm)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 pt-3 text-center text-xs text-slate-500">
            Use mouse scroll or zoom buttons. High-fidelity cloud pathology analysis complies with ICAR scientific verification guidelines.
          </div>
        </div>
      )}

      {/* 2. Request More Info Modal */}
      {showMoreInfoModal && selectedQuery && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[8px] bg-indigo-100 text-indigo-800 font-black px-1.5 py-0.5 rounded uppercase">
                  Clarification Request
                </span>
                <h3 className="font-extrabold text-slate-800 text-sm mt-1">
                  Request More Info from {selectedQuery.farmerName}
                </h3>
              </div>
              <button onClick={() => setShowMoreInfoModal(false)} className="p-1 hover:bg-slate-100 rounded-full">
                <X className="h-4.5 w-4.5 text-slate-400" />
              </button>
            </div>

            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              Dispatched requests alert the farmer via in-app notification and SMS. Select which parameters are missing to formulate perfect pathology advice:
            </p>

            {/* Checklist options */}
            <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={infoChecklist.closerScans}
                  onChange={(e) => setInfoChecklist({...infoChecklist, closerScans: e.target.checked})}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <span>Closer, high-res leaf scans</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={infoChecklist.soilNPK}
                  onChange={(e) => setInfoChecklist({...infoChecklist, soilNPK: e.target.checked})}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <span>Soil lab chemistry (NPK/pH)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={infoChecklist.chemicalLogs}
                  onChange={(e) => setInfoChecklist({...infoChecklist, chemicalLogs: e.target.checked})}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <span>Fertilizer/chemical logs</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={infoChecklist.irrigationLogs}
                  onChange={(e) => setInfoChecklist({...infoChecklist, irrigationLogs: e.target.checked})}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <span>Irrigation schedule details</span>
              </label>
            </div>

            {/* Custom message */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-black text-slate-400">Custom message to the farmer:</label>
              <textarea
                value={moreInfoMessage}
                onChange={(e) => setMoreInfoMessage(e.target.value)}
                placeholder="Describe exactly what needs clarification (e.g. Please provide a photo under natural sunlight to analyze the under-leaf mold colony details.)"
                rows={3}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowMoreInfoModal(false)}
                className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestMoreInfoSubmit}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider"
              >
                Dispatch Clarification Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Schedule Video Consultation Modal */}
      {showScheduleModal && selectedQuery && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[8px] bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.5 rounded uppercase">
                  Schedule Booking
                </span>
                <h3 className="font-extrabold text-slate-800 text-sm mt-1">
                  Book Video Consultation with {selectedQuery.farmerName}
                </h3>
              </div>
              <button onClick={() => setShowScheduleModal(false)} className="p-1 hover:bg-slate-100 rounded-full">
                <X className="h-4.5 w-4.5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs font-semibold text-slate-700">
              <div className="space-y-1">
                <label className="block text-[9px] uppercase font-black text-slate-400">Meeting Topic:</label>
                <select
                  value={callTopic}
                  onChange={(e) => setCallTopic(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Complex Pathology Audit">Complex Pathology Audit</option>
                  <option value="Chemical Spray Precaution guidelines">Chemical Spray Precaution guidelines</option>
                  <option value="Soil Alkalinity Correction Plan">Soil Alkalinity Correction Plan</option>
                  <option value="Seasonal Crop Transition Audit">Seasonal Crop Transition Audit</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[9px] uppercase font-black text-slate-400">Appointment Date:</label>
                  <input
                    type="date"
                    value={callDate}
                    onChange={(e) => setCallDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] uppercase font-black text-slate-400">Time Duration:</label>
                  <select
                    value={callDuration}
                    onChange={(e) => setCallDuration(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="15 mins">15 mins (Quick Audit)</option>
                    <option value="20 mins">20 mins (Standard Consultation)</option>
                    <option value="30 mins">30 mins (Detailed Analysis)</option>
                    <option value="45 mins">45 mins (Soil + Pathology)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] uppercase font-black text-slate-400">Select Time Slot:</label>
                <select
                  value={callSlot}
                  onChange={(e) => setCallSlot(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="09:00 AM - 09:30 AM">09:00 AM - 09:30 AM</option>
                  <option value="11:30 AM - 12:00 PM">11:30 AM - 12:00 PM</option>
                  <option value="02:00 PM - 02:30 PM">02:00 PM - 02:30 PM (Recommended Slot)</option>
                  <option value="04:30 PM - 05:00 PM">04:30 PM - 05:00 PM</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] uppercase font-black text-slate-400">Meeting Notes / Agenda:</label>
                <textarea
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="Describe what will be reviewed during the live feed consultation..."
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleCallSubmit}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[10px] font-black uppercase tracking-wider"
              >
                Schedule & Dispatch Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Submit Sovereign Answer Confirmation & Step-by-Step Dispatch Progress Modal */}
      {showSubmitModal && selectedQuery && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-5 shadow-2xl text-left">
            {!isPublishingProgress ? (
              <>
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[8px] bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.5 rounded uppercase">
                    Delivery Setup
                  </span>
                  <h3 className="font-extrabold text-slate-800 text-sm mt-1">
                    Confirm Advisory Delivery Channels
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">Define how this diagnosis advice reaches {selectedQuery.farmerName}</p>
                </div>

                <div className="space-y-3 font-semibold text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-[10px] uppercase font-black text-slate-400 pb-1 border-b border-slate-200/80">Configure Channels:</div>
                  
                  <label className="flex items-center justify-between p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">
                    <span className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-emerald-600" />
                      In-App Direct Notification
                    </span>
                    <input
                      type="checkbox"
                      checked={deliveryChannels.push}
                      onChange={(e) => setDeliveryChannels({...deliveryChannels, push: e.target.checked})}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                  </label>

                  <label className="flex items-center justify-between p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">
                    <span className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-emerald-600" />
                      SMS Direct Text (via Twilio API)
                    </span>
                    <input
                      type="checkbox"
                      checked={deliveryChannels.sms}
                      onChange={(e) => setDeliveryChannels({...deliveryChannels, sms: e.target.checked})}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                  </label>

                  <label className="flex items-center justify-between p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">
                    <span className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-emerald-600" />
                      Email Attachment (Full PDF Summary)
                    </span>
                    <input
                      type="checkbox"
                      checked={deliveryChannels.email}
                      onChange={(e) => setDeliveryChannels({...deliveryChannels, email: e.target.checked})}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                  </label>
                </div>

                {/* Packet specifications summary */}
                <div className="space-y-1.5 text-[10px] text-slate-500 font-semibold">
                  <span className="font-black text-slate-400 uppercase tracking-wider text-[8px] block">Advisory Packet Composition:</span>
                  <ul className="space-y-1 bg-slate-100/50 p-2.5 rounded-lg border border-slate-200">
                    <li className="flex justify-between">
                      <span>Advice Text Length:</span>
                      <span className="text-slate-800 font-bold">{replyText.length} characters</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Educational Handouts:</span>
                      <span className="text-slate-800 font-bold">{attachedFiles.length} attached</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Uploaded Schematics:</span>
                      <span className="text-slate-800 font-bold">{customFiles.length} uploaded</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Scientific Resource Links:</span>
                      <span className="text-slate-800 font-bold">{addedLinks.length} appended</span>
                    </li>
                  </ul>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={executeAdvisoryPublish}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[10px] font-black uppercase tracking-wider"
                  >
                    Confirm & Publish Solution
                  </button>
                </div>
              </>
            ) : (
              <div className="py-4 space-y-6 text-center">
                {publishProgress < 100 ? (
                  <>
                    <div className="relative h-20 w-20 mx-auto">
                      {/* Rotating spinner */}
                      <div className="absolute inset-0 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                      <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center">
                        <FileSignature className="h-6 w-6 text-emerald-600 animate-pulse" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-black uppercase tracking-wide text-slate-800">Publishing Botanical Advisory</h4>
                      <p className="text-[11px] text-slate-500 font-bold font-mono text-center max-w-xs mx-auto animate-pulse">
                        "{publishStatusText}"
                      </p>
                    </div>

                    {/* Progress indicator */}
                    <div className="space-y-1 max-w-xs mx-auto">
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-600 rounded-full transition-all duration-300" style={{ width: `${publishProgress}%` }} />
                      </div>
                      <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-wider">
                        <span>Dispatch in progress</span>
                        <span>{publishProgress}%</span>
                      </div>
                    </div>

                    {/* Step trackers */}
                    <div className="text-[10px] font-bold text-left space-y-2 max-w-xs mx-auto border-t border-slate-100 pt-4">
                      <div className="flex items-center gap-2">
                        <span className={`h-4 w-4 rounded-full flex items-center justify-center text-[8px] ${publishingStep >= 1 ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                          {publishingStep > 1 ? "✓" : "1"}
                        </span>
                        <span className={publishingStep >= 1 ? "text-slate-800" : "text-slate-400"}>Formulating Advice Payload</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`h-4 w-4 rounded-full flex items-center justify-center text-[8px] ${publishingStep >= 2 ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                          {publishingStep > 2 ? "✓" : "2"}
                        </span>
                        <span className={publishingStep >= 2 ? "text-slate-800" : "text-slate-400"}>Generating Digital Signed Advisory PDF</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`h-4 w-4 rounded-full flex items-center justify-center text-[8px] ${publishingStep >= 3 ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                          {publishingStep > 3 ? "✓" : "3"}
                        </span>
                        <span className={publishingStep >= 3 ? "text-slate-800" : "text-slate-400"}>Twilio SMS Alert Transmission</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`h-4 w-4 rounded-full flex items-center justify-center text-[8px] ${publishingStep >= 4 ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                          {publishingStep > 4 ? "✓" : "4"}
                        </span>
                        <span className={publishingStep >= 4 ? "text-slate-800" : "text-slate-400"}>Dispatched terminal notifications</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4 animate-in zoom-in duration-300 text-center">
                    <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-300">
                      <Check className="h-8 w-8 stroke-[3]" />
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Advisory Published Successfully</h3>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
                        Botanical recommendations compiled with official credentials, stamped with ICAR verification, and dispatched to {selectedQuery.farmerName} terminal!
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 text-[10px] font-bold text-slate-600 text-left space-y-1">
                      <div className="text-[9px] uppercase font-black text-slate-400 border-b border-slate-200 pb-1 mb-1.5">Delivery Status Logs:</div>
                      <div className="flex items-center justify-between text-emerald-700">
                        <span>In-App Alert Status:</span>
                        <span>Delivered</span>
                      </div>
                      <div className="flex items-center justify-between text-emerald-700">
                        <span>Twilio SMS Alert:</span>
                        <span>Transmitted</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Email PDF summary:</span>
                        <span>Not Selected</span>
                      </div>
                    </div>

                    <button
                      onClick={closePublishSuccess}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl cursor-pointer shadow-3xs"
                    >
                      Done (Close Workspace)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Specialist Forwarding Modal */}
      {showForwardModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                Forward Query to Specialist
              </h3>
              <button onClick={() => setShowForwardModal(false)} className="p-1 hover:bg-slate-100 rounded-full">
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>

            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              Select an expert agronomist or pathologist to hand off this diagnostic file. This redirects the farmer's communication channel directly.
            </p>

            <div className="space-y-2.5">
              {specialists.map((spec) => (
                <button
                  key={spec.id}
                  onClick={() => setForwardSpecialist(spec.name)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    forwardSpecialist === spec.name
                      ? "bg-emerald-50 border-emerald-400 text-emerald-800 font-bold"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300 font-semibold"
                  }`}
                >
                  <div className="text-xs">
                    <p className="font-extrabold">{spec.name}</p>
                    <p className="text-[9px] text-slate-400">{spec.specialty} • {spec.university}</p>
                    <p className="text-[9px] text-slate-400 font-bold">Experience: {spec.experience} • Satisfied Ratings: {spec.rating} ★</p>
                  </div>
                  {forwardSpecialist === spec.name && <Check className="h-4 w-4 text-emerald-600 shrink-0" />}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => setShowForwardModal(false)}
                className="px-3.5 py-1.5 text-slate-500 hover:bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleForwardSpecialistSubmit}
                disabled={!forwardSpecialist}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-wider disabled:opacity-40"
              >
                Confirm Forward
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
