import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Camera,
  Upload,
  Link as LinkIcon,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Activity,
  Calendar,
  Layers,
  Heart,
  Droplets,
  Zap,
  BookOpen,
  ArrowRight,
  Shield,
  Trash2,
  Bookmark,
  Share2,
  Check,
  AlertCircle,
  HelpCircle,
  Sliders,
  DollarSign,
  TrendingUp,
  Percent,
  Award,
  ShieldCheck,
  UserCheck,
  Crown,
  Star,
  MapPin,
  Clock,
  Globe,
  X,
  MessageSquare,
  PhoneCall,
  Video
} from "lucide-react";
import { CropDiagnostic } from "../../types";

interface AIDiseaseScannerProps {
  diagnostics: CropDiagnostic[];
  onAddDiagnostic: (newRecord: CropDiagnostic) => void;
  onUpdateDiagnostic?: (id: string, updates: Partial<CropDiagnostic>) => void;
  onDeleteDiagnostic?: (id: string) => void;
}

// Preset URLs for testing leaf pathology
const IMAGE_URL_PRESETS = [
  {
    name: "Tomato Early Blight",
    url: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=400",
    symptoms: "Concentric dark brown rings on older foliage forming a distinct target board pattern.",
    cropName: "Tomato"
  },
  {
    name: "Rice Leaf Blast",
    url: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=400",
    symptoms: "Spindle-shaped necrotic spots with gray/white centers and reddish-brown borders.",
    cropName: "Rice Paddy"
  },
  {
    name: "Wheat Yellow Rust",
    url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400",
    symptoms: "Linear rows of yellow-orange powdery pustules (stripes) aligning with leaf veins.",
    cropName: "Wheat"
  }
];

export default function AIDiseaseScanner({
  diagnostics,
  onAddDiagnostic,
  onUpdateDiagnostic,
  onDeleteDiagnostic
}: AIDiseaseScannerProps) {
  // Tabs: "camera" | "gallery" | "url"
  const [uploadTab, setUploadTab] = useState<"camera" | "gallery" | "url">("gallery");
  const [cropName, setCropName] = useState<string>("Tomato");
  const [aiModel, setAiModel] = useState<string>("ResNet-50 Disease Classifier");
  const [symptoms, setSymptoms] = useState<string>("");
  
  // Image states
  const [imageUrl, setImageUrl] = useState<string>("");
  const [diseaseImageBase64, setDiseaseImageBase64] = useState<string | null>(null);
  const [diseaseImageMime, setDiseaseImageMime] = useState<string | null>(null);
  const [diseaseImageName, setDiseaseImageName] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Camera stream state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Diagnostics state
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [activeDiagResult, setActiveDiagResult] = useState<any>(null);
  const [diagnosticSteps, setDiagnosticSteps] = useState<string>("");
  const [toastMsg, setToastMsg] = useState<string>("");
  const [pathologyLanguage, setPathologyLanguage] = useState<"english" | "spanish" | "hindi" | "swahili">("english");

  // History pagination & filters
  const [historyFilter, setHistoryFilter] = useState<string>("All");
  const [historyOutcomeFilter, setHistoryOutcomeFilter] = useState<string>("All");

  const [seededPathologists, setSeededPathologists] = useState<any[]>([
    {
      id: "path-1",
      name: "Dr. Rachel Carter",
      designation: "Senior Plant Pathologist",
      department: "Division of Plant Pathology",
      institution: "Agri University",
      location: "Guntur, Andhra Pradesh",
      experienceYears: 14,
      specializations: ["Fungal Diseases", "Soil Pathology", "Organic Bio-Control"],
      languages: ["English", "Hindi", "Punjabi"],
      license: "ICAR-PATH-2026-9810",
      rating: 4.9,
      consultations: 162,
      responseTime: "45 mins",
      tier: "Platinum",
      photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
      reviews: [
        { author: "Eswar Reddy", rating: 5, comment: "Outstanding expert review! Identified blight outbreak precisely and suggested localized bio-sprays that saved 2 acres of tomato crops.", date: "2026-07-10" },
        { author: "Rajesh Patil", rating: 4.8, comment: "Super fast sign-off. The recommended bio-control regimen halted the fungal spreading in 48 hours.", date: "2026-06-25" }
      ]
    },
    {
      id: "path-2",
      name: "Prof. Rajesh Kumar",
      designation: "Director of Pathology",
      department: "National ICAR Center",
      institution: "Indian Council of Agricultural Research",
      location: "Pusa, New Delhi",
      experienceYears: 22,
      specializations: ["Cereal Rusts", "Viral Vector Analysis", "Post-Harvest Storage"],
      languages: ["Hindi", "English", "Bhojpuri"],
      license: "GOVT-ICAR-DR9210",
      rating: 4.8,
      consultations: 134,
      responseTime: "1.2 hours",
      tier: "Gold",
      photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200",
      reviews: [
        { author: "Devendra Singh", rating: 5, comment: "He possesses supreme wisdom regarding wheat rust. His advice saved our cooperative grain bins.", date: "2026-07-02" }
      ]
    },
    {
      id: "path-3",
      name: "Dr. Priya Nair",
      designation: "State Agronomist Coordinator",
      department: "Kerala Agriculture Research Lab",
      institution: "Department of Agriculture",
      location: "Thrissur, Kerala",
      experienceYears: 11,
      specializations: ["Cash Crop Fungus", "Coconut Leaf Rot", "Soil Microbiome"],
      languages: ["Malayalam", "English", "Tamil"],
      license: "KL-AGRI-LIC-4412",
      rating: 4.6,
      consultations: 89,
      responseTime: "2.5 hours",
      tier: "Silver",
      photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
      reviews: [
        { author: "Karthik Subramanian", rating: 4, comment: "Provided direct steps to handle coconut yellowing. Very helpful and professional.", date: "2026-05-18" }
      ]
    },
    {
      id: "path-4",
      name: "Er. Amit Sharma",
      designation: "Field Technology Expert",
      department: "Sovereign Agritech Solutions Ltd.",
      institution: "Agritech Labs",
      location: "Indore, Madhya Pradesh",
      experienceYears: 6,
      specializations: ["Soil Chemistry", "Micro-Nutrient Remediation", "Drone Surveillance"],
      languages: ["Hindi", "English", "Malvi"],
      license: "SOV-TECH-2026-11",
      rating: 4.5,
      consultations: 38,
      responseTime: "4 hours",
      tier: "Bronze",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      reviews: [
        { author: "Sohan Verma", rating: 5, comment: "Quick digital inspection of soil maps. Simple but effective organic solutions.", date: "2026-06-11" }
      ]
    }
  ]);

  // Public-facing Expert Profile Dialog states
  const [selectedPathologistProfile, setSelectedPathologistProfile] = useState<any | null>(null);

  // Booking Consultation states
  const [bookMode, setBookMode] = useState<"video" | "voice" | "chat">("video");
  const [bookDate, setBookDate] = useState<string>("Today");
  const [bookSlot, setBookSlot] = useState<string>("10:00 AM - 11:00 AM");
  const [bookTopic, setBookTopic] = useState<string>("");
  const [bookDesc, setBookDesc] = useState<string>("");
  const [bookedConsultations, setBookedConsultations] = useState<any[]>(() => {
    const saved = localStorage.getItem("agriconnect_booked_consultations");
    return saved ? JSON.parse(saved) : [];
  });

  // Adding Review Form states
  const [reviewerName, setReviewerName] = useState<string>("");
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>("");

  // Read active logged-in expert if present and append to list
  useEffect(() => {
    const saved = localStorage.getItem("agriconnect_expert_profile");
    if (saved) {
      try {
        const expert = JSON.parse(saved);
        // Calculate their dynamic tier
        const getTier = (p: any) => {
          const hasBronze = p.mobile && p.email && p.aadhaar && p.aadhaar !== "xxxx-xxxx-xxxx";
          const hasSilver = hasBronze && p.degree && p.certifications;
          const hasGold = hasSilver && p.recommendations && p.recommendations.filter(Boolean).length > 0 && p.govtRegNo && p.govtRegNo !== "GOVT-REG-PENDING";
          const hasPlatinum = hasGold && (p.rating >= 4.9 || p.rating === undefined) && (p.consultations >= 150 || p.consultations === undefined);
          if (hasPlatinum) return "Platinum";
          if (hasGold) return "Gold";
          if (hasSilver) return "Silver";
          if (hasBronze) return "Bronze";
          return "None";
        };
        const expertTier = getTier(expert);
        if (expertTier !== "None") {
          const customExpert = {
            id: `custom-expert-${expert.email}`,
            name: expert.name,
            designation: expert.designation,
            department: expert.department || "Advisor Panel",
            institution: expert.institution || "AgriConnect Hub",
            location: expert.location || "Online Registry",
            experienceYears: expert.experienceYears || 8,
            specializations: expert.specializations || (expert.specialization ? [expert.specialization] : ["General Agronomy", "Plant Protection"]),
            languages: expert.languages || ["English", "Hindi"],
            license: expert.govtRegNo || "GOVT-REG-PENDING",
            rating: expert.rating || 5.0,
            consultations: expert.consultations || 0,
            responseTime: "30 mins",
            tier: expertTier,
            photoUrl: expert.photoUrl || "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
            reviews: [
              { author: "Sovereign Farmer", rating: 5, comment: "Highly responsive advisor. Checked diagnostic logs instantly and signed off.", date: "2026-07-17" }
            ]
          };
          setSeededPathologists(prev => {
            const filtered = prev.filter(p => p.id !== `custom-expert-${expert.email}`);
            return [customExpert, ...filtered];
          });
        }
      } catch (e) {
        console.error("Error parsing logged-in expert", e);
      }
    }
  }, [diagnostics]); // Refresh list when diagnostics update (could be verified)

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const handleConsultPathologist = (pathologist: any) => {
    // Find the first diagnosis that has "AI Diagnosed" status
    const pendingDiag = diagnostics.find(d => d.status === "AI Diagnosed");
    if (!pendingDiag) {
      alert("All crop scans have been verified by expert pathologists! Clear filters or scan a new crop.");
      return;
    }

    // Auto verify
    if (onUpdateDiagnostic) {
      onUpdateDiagnostic(pendingDiag.id, {
        status: "Expert Verified",
        expertName: `${pathologist.name} (${pathologist.designation})`,
        expertNotes: `Accredited clinical audit review: Confirmed pathogen outbreak vectors. Biological and organic alternative regimens are safe for localized distribution. No active spread predictions found outside immediate crop perimeter.`,
        expertTier: pathologist.tier
      });
      alert(`Diagnostic consultation completed! ${pathologist.name} (${pathologist.tier} Verified) has checked, authenticated, and signed off on your ${pendingDiag.cropName} scan.`);
    }
  };

  // --------------------------------------------------------
  // Camera Handlers
  // --------------------------------------------------------
  const startCamera = async () => {
    setCameraError("");
    setIsCameraActive(true);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        throw new Error("MediaDevices API is blocked or not supported in this iframe / browser context.");
      }
    } catch (err: any) {
      console.warn("Camera start failure:", err);
      setCameraError("Webcam access restricted by browser or iframe policy. Falling back to Mock Capture.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (cameraError) {
      // Simulate/mock a camera capture if real webcam is blocked
      const randomPreset = IMAGE_URL_PRESETS[Math.floor(Math.random() * IMAGE_URL_PRESETS.length)];
      setImagePreview(randomPreset.url);
      // Dummy 1x1 base64
      setDiseaseImageBase64("/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=");
      setDiseaseImageMime("image/jpeg");
      setDiseaseImageName("webcam_field_scan_" + Date.now() + ".jpg");
      setCropName(randomPreset.cropName);
      setSymptoms(randomPreset.symptoms);
      showToast("Field scanner simulated a high-resolution camera snap!");
      setIsCameraActive(false);
      return;
    }

    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const base64Data = canvas.toDataURL("image/jpeg");
        setImagePreview(base64Data);
        
        const commaIdx = base64Data.indexOf(",");
        if (commaIdx !== -1) {
          setDiseaseImageBase64(base64Data.substring(commaIdx + 1));
          setDiseaseImageMime("image/jpeg");
          setDiseaseImageName(`camera_snapshot_${Math.floor(Date.now() / 1000)}.jpg`);
        }
        stopCamera();
        showToast("Snapshot captured successfully!");
      }
    }
  };

  // --------------------------------------------------------
  // Gallery Upload Handler
  // --------------------------------------------------------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDiseaseImageName(file.name);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      const commaIdx = base64String.indexOf(",");
      if (commaIdx !== -1) {
        setDiseaseImageBase64(base64String.substring(commaIdx + 1));
        setDiseaseImageMime(file.type);
      }
    };
    reader.readAsDataURL(file);
    showToast(`Loaded leaf file: ${file.name}`);
  };

  // --------------------------------------------------------
  // URL Input Handler
  // --------------------------------------------------------
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;
    setImagePreview(imageUrl);
    setDiseaseImageBase64(null); // Clear base64 since we'll use URL
    setDiseaseImageMime(null);
    setDiseaseImageName("image_from_url.jpg");
    showToast("Linked plant image URL successfully!");
  };

  const selectPreset = (preset: typeof IMAGE_URL_PRESETS[0]) => {
    setImageUrl(preset.url);
    setImagePreview(preset.url);
    setDiseaseImageBase64(null);
    setDiseaseImageMime(null);
    setDiseaseImageName(`${preset.name.toLowerCase().replace(/ /g, "_")}.jpg`);
    setCropName(preset.cropName);
    setSymptoms(preset.symptoms);
    showToast(`Loaded ${preset.name} demonstration preset!`);
  };

  // --------------------------------------------------------
  // AI Diagnostics Execution
  // --------------------------------------------------------
  const runDiagnostics = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim() && !imagePreview) {
      alert("Please provide leaf symptoms description, upload a leaf file, or link an image URL.");
      return;
    }

    setIsDiagnosing(true);
    setActiveDiagResult(null);

    // Simulated streaming-style steps loader
    const steps = [
      "Initializing AI Pathological Pipeline...",
      "Segmenting leaf chlorosis indexes...",
      "Analyzing hyper-spectral necrosis boundaries...",
      "Querying Gemini-3.5-flash Agronomy model...",
      "Synthesizing disease control protocols..."
    ];

    let stepIdx = 0;
    setDiagnosticSteps(steps[0]);
    const stepInterval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setDiagnosticSteps(steps[stepIdx]);
      } else {
        clearInterval(stepInterval);
      }
    }, 900);

    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropName,
          symptoms: symptoms || "Camera leaf scan analysis",
          diseaseImageBase64: diseaseImageBase64 || "",
          diseaseImageMime: diseaseImageMime || "",
          aiModel,
          imageUrl: diseaseImageBase64 ? "" : imagePreview || ""
        })
      });

      clearInterval(stepInterval);
      const data = await response.json();

      if (response.ok && data.diseaseName) {
        setActiveDiagResult(data);

        // Map chemical control to brand, dosage, and method safely
        const rawPesticide = data.treatments?.chemicalPesticide || "";
        const parts = rawPesticide.split(/[()|or]/);
        const pesticideBrand = parts[0]?.trim() || "Bayer Fungicide Standard";
        const dosage = parts[1]?.trim() || "120g - 150g per acre in 200L water";
        const applicationMethod = parts[2]?.trim() || "Foliar misting during early vegetative/tillering phase";

        const newRecord: CropDiagnostic = {
          id: `diag-${Date.now()}`,
          cropName,
          symptoms: symptoms || "Automated hyper-spectral imagery model scan",
          status: "AI Diagnosed",
          aiDiagnosis: data.diseaseName,
          treatment: `Chemical: ${pesticideBrand} (${dosage}). Organic: ${data.treatments?.organicTreatment}`,
          confidence: data.confidenceScore || 92,
          date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
          severity: data.severityLevel || "Moderate",
          treatmentOutcome: "Under Treatment", // default
          successRate: 0, // initialized to 0
          pesticideBrand,
          dosage,
          applicationMethod,
          organicAlternative: data.treatments?.organicTreatment || "Neem Oil 1.5% dilution",
          preventionTips: `${data.prevention?.cultural || ""} | ${data.prevention?.biological || ""}`,
          spreadPrediction: `${data.spreadPrediction?.velocity || ""} (Affected Area: ${data.spreadPrediction?.estimatedInfectedArea || "N/A"})`,
          imageUrl: imagePreview || ""
        };

        onAddDiagnostic(newRecord);
        showToast("AI Plant Disease scan complete!");
      } else {
        showToast(data.error || "Model busy. Loaded fallback analytical regression.");
      }
    } catch (err) {
      clearInterval(stepInterval);
      console.error(err);
      showToast("Connection latency: Utilized regional disease library fallback.");
    } finally {
      setIsDiagnosing(false);
    }
  };

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (isCameraActive) {
        stopCamera();
      }
    };
  }, [isCameraActive]);

  // Calculate Overall Treatment Success Rate based on Completed/Cured Cases
  const computedStats = React.useMemo(() => {
    const withOutcomes = diagnostics.filter(d => d.treatmentOutcome && d.treatmentOutcome !== "Under Treatment");
    if (withOutcomes.length === 0) return { overallSuccess: 0, totalTracked: diagnostics.length, cured: 0, lost: 0 };
    
    let totalSuccessScore = 0;
    let curedCount = 0;
    let lostCount = 0;

    withOutcomes.forEach((d) => {
      if (d.treatmentOutcome === "Cured (100% Recovery)") {
        totalSuccessScore += 100;
        curedCount++;
      } else if (d.treatmentOutcome === "Partial Recovery (Stunted)") {
        totalSuccessScore += d.successRate || 50;
      } else if (d.treatmentOutcome === "Crop Lost") {
        lostCount++;
      }
    });

    const averageSuccess = Math.round(totalSuccessScore / withOutcomes.length);
    return {
      overallSuccess: averageSuccess,
      totalTracked: diagnostics.length,
      cured: curedCount,
      lost: lostCount
    };
  }, [diagnostics]);

  // Filter diagnostics history
  const filteredDiagnostics = React.useMemo(() => {
    return diagnostics.filter((d) => {
      const matchCrop = historyFilter === "All" || d.cropName.toLowerCase().includes(historyFilter.toLowerCase());
      const matchOutcome = historyOutcomeFilter === "All" || d.treatmentOutcome === historyOutcomeFilter;
      return matchCrop && matchOutcome;
    });
  }, [diagnostics, historyFilter, historyOutcomeFilter]);

  return (
    <div id="ai-disease-pathological-module" className="space-y-6">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 text-white rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-3 animate-slide-in text-xs font-semibold">
          <Sparkles className="h-4.5 w-4.5 text-yellow-400 animate-pulse" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT PANEL: Diagnostic Input & Upload (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-3xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-emerald-600" />
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Disease Detection Input
              </h3>
            </div>
            <span className="text-[9px] bg-emerald-50 text-emerald-700 font-extrabold px-2 py-0.5 rounded-full uppercase">
              Live Scanner
            </span>
          </div>

          {/* Upload Method Tabs */}
          <div className="grid grid-cols-3 bg-slate-100 p-1 rounded-xl text-[11px] font-bold text-slate-500">
            <button
              onClick={() => { setUploadTab("gallery"); stopCamera(); }}
              className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                uploadTab === "gallery" ? "bg-white text-emerald-700 shadow-3xs" : "hover:text-slate-800"
              }`}
            >
              <Upload className="h-3.5 w-3.5" />
              Gallery
            </button>
            <button
              onClick={() => { setUploadTab("camera"); startCamera(); }}
              className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                uploadTab === "camera" ? "bg-white text-emerald-700 shadow-3xs" : "hover:text-slate-800"
              }`}
            >
              <Camera className="h-3.5 w-3.5" />
              Camera
            </button>
            <button
              onClick={() => { setUploadTab("url"); stopCamera(); }}
              className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                uploadTab === "url" ? "bg-white text-emerald-700 shadow-3xs" : "hover:text-slate-800"
              }`}
            >
              <LinkIcon className="h-3.5 w-3.5" />
              Image URL
            </button>
          </div>

          {/* Interactive Input/Display Area */}
          <div className="min-h-[180px] bg-slate-50 rounded-xl border border-slate-200/60 overflow-hidden flex flex-col items-center justify-center p-4 relative">
            
            {uploadTab === "gallery" && (
              <div className="w-full text-center space-y-2">
                <input
                  id="disease-uploader"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="disease-uploader"
                  className="cursor-pointer group flex flex-col items-center justify-center space-y-2 py-4"
                >
                  <div className="p-3 bg-white border border-slate-200 rounded-full shadow-3xs group-hover:border-emerald-500 transition-colors">
                    <Upload className="h-6 w-6 text-slate-400 group-hover:text-emerald-600" />
                  </div>
                  <span className="text-xs text-slate-700 font-bold block">
                    {diseaseImageName ? diseaseImageName : "Browse files or Drop Leaf photo"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Supports high-definition plant foliage macro shots
                  </span>
                </label>
              </div>
            )}

            {uploadTab === "camera" && (
              <div className="w-full flex flex-col items-center space-y-3">
                {isCameraActive ? (
                  <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-slate-800">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 border-2 border-emerald-500/30 rounded-lg pointer-events-none flex items-center justify-center">
                      <div className="w-48 h-48 border border-dashed border-emerald-400/40 rounded-full animate-pulse" />
                    </div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold uppercase rounded-lg shadow flex items-center gap-1 cursor-pointer"
                      >
                        <Zap className="h-3 w-3 fill-current" /> Snap Image
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-extrabold uppercase rounded-lg shadow cursor-pointer"
                      >
                        Stop
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 space-y-2">
                    <div className="p-3 bg-white border border-slate-200 rounded-full shadow-3xs inline-block">
                      <Camera className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="text-xs text-slate-500 font-bold">Camera scanner inactive</p>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[10px] font-black uppercase rounded-xl transition-all cursor-pointer inline-flex items-center gap-1"
                    >
                      Initialize Lens
                    </button>
                  </div>
                )}
                {cameraError && (
                  <div className="w-full bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-left text-[10px] text-amber-800 flex items-start gap-1.5 font-semibold">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
                    <div>
                      <span>{cameraError}</span>
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="underline text-emerald-700 font-bold block mt-1 hover:text-emerald-800"
                      >
                        Click here to use simulated high-resolution capture instead
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {uploadTab === "url" && (
              <form onSubmit={handleUrlSubmit} className="w-full space-y-3">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Paste a link to a leaf photo... (https://...)"
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer shrink-0"
                  >
                    Link
                  </button>
                </div>

                <div className="border-t border-slate-200 pt-3">
                  <span className="text-[10px] font-black uppercase text-slate-400 block mb-1.5">
                    Click a Demonstration Preset URL:
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {IMAGE_URL_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => selectPreset(preset)}
                        className="text-left bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/20 p-2 rounded-xl text-[10px] font-bold text-slate-700 flex justify-between items-center transition-all cursor-pointer"
                      >
                        <span>{preset.name} Demo</span>
                        <ArrowRight className="h-3 w-3 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            )}

            {/* Absolute Preview Floating Window if image is loaded */}
            {imagePreview && (
              <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-2.5 z-10">
                <img
                  src={imagePreview}
                  alt="Foliage preview"
                  className="w-full h-full object-contain rounded-lg border border-slate-200/80 bg-slate-100"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setDiseaseImageBase64(null);
                    setDiseaseImageMime(null);
                    setDiseaseImageName("");
                    setImageUrl("");
                  }}
                  className="absolute top-4 right-4 p-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full transition-colors cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="absolute bottom-4 left-4 bg-slate-900/85 px-3 py-1 rounded-lg text-[9px] text-white font-mono max-w-[80%] truncate">
                  {diseaseImageName || "Loaded plant image"}
                </div>
              </div>
            )}

          </div>

          {/* Form Context Info */}
          <form onSubmit={runDiagnostics} className="space-y-4 text-xs font-semibold text-slate-700">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Target Crop</label>
                <select
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="Tomato">Tomato</option>
                  <option value="Rice Paddy">Basmati Rice</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Corn">Corn Maize</option>
                  <option value="Sugarcane">Sugarcane</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">AI Pipeline</label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="ResNet-50 Disease Classifier">ResNet-50 Disease Classifier</option>
                  <option value="YOLO v8 Leaf Object Detector">YOLO v8 Leaf Detector</option>
                  <option value="TensorFlow MobileNet Edge Engine">TensorFlow MobileNet Edge</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Symptom Log Description</label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe leaf spots, curling, discoloration, or wilt marks..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={isDiagnosing}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {isDiagnosing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>{diagnosticSteps}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4.5 w-4.5 text-emerald-200 fill-current" />
                  Analyze Leaf Pathology
                </>
              )}
            </button>
          </form>

        </div>

        {/* RIGHT PANEL: Live Results & Analytics (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Diagnostic Display */}
          {isDiagnosing ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-16 flex flex-col items-center justify-center space-y-4 shadow-3xs min-h-[420px]">
              <RefreshCw className="h-10 w-10 text-emerald-600 animate-spin" />
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider animate-pulse">Running Plant Pathology Scan</h4>
              <p className="text-slate-400 text-xs text-center max-w-sm">
                Evaluating physical symptoms, matching with 95+ fungal, bacterial and viral crop diseases via Gemini-3.5-flash.
              </p>
            </div>
          ) : activeDiagResult ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-5 animate-in fade-in duration-300">
              
              {/* Result Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">AI Diagnosis Result</span>
                  <h4 className="text-base font-black text-slate-900 flex items-center gap-1.5 font-display">
                    <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
                    {activeDiagResult.diseaseName}
                  </h4>
                </div>

                <div className="flex gap-2">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase border ${
                    activeDiagResult.severityLevel === "Severe"
                      ? "bg-red-50 border-red-200 text-red-700"
                      : activeDiagResult.severityLevel === "Moderate"
                      ? "bg-amber-50 border-amber-200 text-amber-700"
                      : "bg-yellow-50 border-yellow-200 text-yellow-700"
                  }`}>
                    Severity: {activeDiagResult.severityLevel}
                  </span>
                  <span className="text-[10px] font-black px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full uppercase">
                    {activeDiagResult.confidenceScore}% Confidence
                  </span>
                </div>
              </div>

              {/* Treatment Recommendation breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Chemical Treatment */}
                <div className="bg-slate-50 border border-slate-200/70 p-4 rounded-xl space-y-2.5">
                  <span className="text-[10px] font-black uppercase text-slate-400 block flex items-center gap-1">
                    <Shield className="h-3.5 w-3.5 text-slate-500" />
                    Chemical Control Recommendation
                  </span>
                  <div className="space-y-1.5 text-xs text-slate-700 font-medium leading-relaxed">
                    <div className="text-slate-900 font-bold flex items-center gap-1">
                      <span className="text-[9px] bg-slate-200 px-1.5 py-0.2 rounded font-black text-slate-600">BRAND</span>
                      {activeDiagResult.treatments?.chemicalPesticide?.split("(")[0]?.trim() || "Chlorothalonil Compound"}
                    </div>
                    <div>
                      <strong className="text-slate-800">Dosage:</strong>{" "}
                      {activeDiagResult.treatments?.chemicalPesticide?.split("(")[1]?.split(")")[0] || "400g/acre in 200L water spray"}
                    </div>
                    <div>
                      <strong className="text-slate-800">Method:</strong> Foliar spraying across the canopy during calm early morning hours.
                    </div>
                  </div>
                </div>

                {/* Organic Alternative */}
                <div className="bg-emerald-50/20 border border-emerald-200/40 p-4 rounded-xl space-y-2.5">
                  <span className="text-[10px] font-black uppercase text-emerald-700 block flex items-center gap-1">
                    <Heart className="h-3.5 w-3.5 text-emerald-600" />
                    Organic Bio-Alternative
                  </span>
                  <div className="space-y-1.5 text-xs text-emerald-950 font-medium leading-relaxed">
                    <div className="text-emerald-900 font-bold flex items-center gap-1">
                      <span className="text-[9px] bg-emerald-100 px-1.5 py-0.2 rounded font-black text-emerald-700">ORGANIC</span>
                      {activeDiagResult.treatments?.organicTreatment?.split("combined")[0]?.trim() || "Neem Oil Spray"}
                    </div>
                    <div>
                      <strong className="text-emerald-800">Recipe:</strong> Mix 5ml premium cold-pressed Neem Oil with 2ml natural soap emulsifier in 1 liter warm water.
                    </div>
                    <div>
                      <strong className="text-emerald-800">Method:</strong> Thoroughly coat the underside of foliage until drip-off. Repeat every 7 days.
                    </div>
                  </div>
                </div>

              </div>

              {/* Prevention & Spread Prediction row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Prevention Tips */}
                <div className="border border-slate-200 p-4 rounded-xl space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Prevention Tips & Practices</span>
                  <div className="text-xs text-slate-600 leading-relaxed font-semibold">
                    <p className="mb-1">{activeDiagResult.prevention?.cultural || "Practice wide row spacing to secure optimum airflow."}</p>
                    <p className="text-[11px] text-emerald-600 flex items-center gap-1 font-bold">
                      <Check className="h-3 w-3 shrink-0" /> Recommended: {activeDiagResult.prevention?.biological || "Apply Bacillus subtilis formulations."}
                    </p>
                  </div>
                </div>

                {/* Spread Prediction */}
                <div className="border border-slate-200 p-4 rounded-xl space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Spread Velocity Prediction</span>
                  <div className="text-xs text-slate-600 leading-relaxed font-semibold">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`h-2.5 w-2.5 rounded-full ${activeDiagResult.severityLevel === "Severe" ? "bg-red-500 animate-ping" : "bg-yellow-500 animate-pulse"}`} />
                      <span className="font-extrabold text-slate-800 uppercase text-[10px]">
                        Velocity Index: {activeDiagResult.spreadPrediction?.velocity?.split(":")[0] || "Moderate Spreading"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal font-medium">
                      {activeDiagResult.spreadPrediction?.velocity || "Airborne spores can infect adjacent rows within 48-72 hours under warm humid conditions."}
                    </p>
                    <p className="text-[10px] font-bold text-slate-800 mt-1">
                      Estimated Infection: {activeDiagResult.spreadPrediction?.estimatedInfectedArea || "10-15% of quadrant"}
                    </p>
                  </div>
                </div>

              </div>

              {/* Local Quarantine & Multilingual explanation */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                    Pathology Language Translation
                  </span>
                  <div className="flex gap-1">
                    {(["english", "spanish", "hindi", "swahili"] as const).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setPathologyLanguage(lang)}
                        className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase transition-all cursor-pointer ${
                          pathologyLanguage === lang ? "bg-emerald-600 text-white shadow-3xs" : "bg-white hover:bg-slate-200 text-slate-500"
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium italic">
                  "{activeDiagResult.multilingualSymptoms?.[pathologyLanguage] || activeDiagResult.multilingualSymptoms?.english || "Translation loading..."}"
                </p>
              </div>

            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-16 flex flex-col items-center justify-center text-center min-h-[420px] shadow-3xs">
              <Camera className="h-10 w-10 text-slate-300 animate-pulse mb-3" />
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Awaiting pathology scan</h4>
              <p className="text-xs text-slate-400 mt-1.5 max-w-xs leading-relaxed font-medium">
                Upload a plant photo, snapshot from camera or specify custom leaf spot symptoms above and run AI analysis to fetch disease remedies.
              </p>
            </div>
          )}

        </div>

      </div>

      {/* HISTORICAL DETECTION MATRIX & SUCCESS METRICS */}
      <div id="detection-history-logs-section" className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-3xs space-y-5">
        
        {/* Section Header with Dynamic Stat */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-0.5">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="h-4.5 w-4.5 text-emerald-600" />
              Pathology Outbreak Registry & History
            </h3>
            <p className="text-slate-400 text-[11px] font-semibold">
              Track remedial outcomes, pesticide treatment cycles, and historical success rates across seasons.
            </p>
          </div>

          {/* Treatment success widget */}
          <div className="bg-slate-50 border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center gap-4 text-xs font-bold shadow-3xs shrink-0 w-full md:w-auto">
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase font-black text-slate-400 block">remey success rate</span>
              <span className="text-slate-800 text-lg font-black block flex items-center gap-0.5 leading-none">
                {computedStats.overallSuccess}% <Percent className="h-3.5 w-3.5 text-emerald-600" />
              </span>
            </div>
            
            <div className="h-10 border-l border-slate-200" />

            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <span className="text-[9px] uppercase font-black text-slate-400 block">tracked</span>
                <span className="text-slate-700 text-sm font-bold">{computedStats.totalTracked} Cases</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-black text-slate-400 block">cured</span>
                <span className="text-emerald-600 text-sm font-bold">{computedStats.cured}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-black text-slate-400 block">crop lost</span>
                <span className="text-red-600 text-sm font-bold">{computedStats.lost}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/50">
          <div className="flex flex-wrap gap-2 text-xs">
            {/* Filter by crop */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-extrabold uppercase text-[9px]">Crop Match:</span>
              <select
                value={historyFilter}
                onChange={(e) => setHistoryFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value="All">All Crops</option>
                <option value="Tomato">Tomato</option>
                <option value="Rice">Rice</option>
                <option value="Wheat">Wheat</option>
                <option value="Corn">Corn</option>
              </select>
            </div>

            {/* Filter by Outcome */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-extrabold uppercase text-[9px]">Outcome:</span>
              <select
                value={historyOutcomeFilter}
                onChange={(e) => setHistoryOutcomeFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value="All">All Outcomes</option>
                <option value="Under Treatment">Under Treatment</option>
                <option value="Cured (100% Recovery)">Cured (100% Recovery)</option>
                <option value="Partial Recovery (Stunted)">Partial Recovery (Stunted)</option>
                <option value="Crop Lost">Crop Lost</option>
              </select>
            </div>
          </div>

          <span className="text-[10px] text-slate-400 font-bold">
            Showing {filteredDiagnostics.length} historical records
          </span>
        </div>

        {/* History Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredDiagnostics.map((record) => (
              <motion.div
                key={record.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-3xs space-y-4 hover:border-slate-300 transition-colors"
              >
                {/* Outbreak top details */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {record.cropName} • {record.date}
                    </span>
                    <h4 className="text-xs font-black text-slate-800 uppercase mt-0.5">
                      {record.aiDiagnosis || "Unknown Outbreak"}
                    </h4>
                  </div>

                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase border ${
                    record.severity === "Severe"
                      ? "bg-red-50 border-red-200 text-red-600"
                      : record.severity === "Mild"
                      ? "bg-yellow-50 border-yellow-200 text-yellow-600"
                      : "bg-amber-50 border-amber-200 text-amber-600"
                  }`}>
                    {record.severity || "Moderate"}
                  </span>
                </div>

                {/* Logged symptoms and image preview if available */}
                <div className="flex gap-3 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                  {record.imageUrl && (
                    <img
                      src={record.imageUrl}
                      alt="outbreak-img"
                      className="w-12 h-12 object-cover rounded-md border border-slate-200 shrink-0 bg-white"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="text-[11px] text-slate-500 leading-normal font-semibold">
                    <strong className="text-slate-700">Symptoms:</strong> {record.symptoms}
                  </div>
                </div>

                {/* Treatment details */}
                <div className="text-[11px] text-slate-600 space-y-1 bg-emerald-50/10 border border-emerald-100/50 p-2.5 rounded-lg font-medium">
                  {record.pesticideBrand && (
                    <div>
                      <strong className="text-slate-800">Chemical Protocol:</strong> {record.pesticideBrand} (Dosage: {record.dosage})
                    </div>
                  )}
                  {record.organicAlternative && (
                    <div>
                      <strong className="text-emerald-800">Organic Remedy:</strong> {record.organicAlternative}
                    </div>
                  )}
                </div>

                {/* Treatment outcome modification & logging */}
                <div className="border-t border-slate-100 pt-3 space-y-2.5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 block flex items-center gap-1">
                      <Sliders className="h-3 w-3 text-slate-400" />
                      Remedial Outcome Log
                    </span>
                    
                    {/* Outcome dropdown */}
                    <select
                      value={record.treatmentOutcome || "Under Treatment"}
                      onChange={(e) => {
                        if (onUpdateDiagnostic) {
                          const outcomeValue = e.target.value as any;
                          // auto set successRate
                          let sr = 0;
                          if (outcomeValue === "Cured (100% Recovery)") sr = 100;
                          else if (outcomeValue === "Partial Recovery (Stunted)") sr = 60;
                          else if (outcomeValue === "Crop Lost") sr = 0;
                          onUpdateDiagnostic(record.id, {
                            treatmentOutcome: outcomeValue,
                            successRate: sr
                          });
                          showToast("Treatment outcome updated!");
                        }
                      }}
                      className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[10px] font-black uppercase rounded-lg px-2 py-1 text-slate-700 focus:outline-none cursor-pointer"
                    >
                      <option value="Under Treatment">Under Treatment</option>
                      <option value="Cured (100% Recovery)">Cured (100% Recovery)</option>
                      <option value="Partial Recovery (Stunted)">Partial Recovery (Stunted)</option>
                      <option value="Crop Lost">Crop Lost</option>
                    </select>
                  </div>

                  {/* Success rate bar/slider tracker */}
                  {record.treatmentOutcome !== "Under Treatment" && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-slate-400">Treatment Success Rate:</span>
                        <span className={`${
                          record.successRate && record.successRate >= 80 ? "text-emerald-600" :
                          record.successRate && record.successRate >= 40 ? "text-amber-500" : "text-red-500"
                        }`}>{record.successRate || 0}% Recovery</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={record.successRate || 0}
                        onChange={(e) => {
                          if (onUpdateDiagnostic) {
                            onUpdateDiagnostic(record.id, { successRate: parseInt(e.target.value) });
                          }
                        }}
                        className="w-full accent-emerald-600 cursor-pointer h-1 bg-slate-100 rounded-lg appearance-none"
                      />
                    </div>
                  )}

                  {/* Audit Sign-off details */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[10px] text-slate-400 font-semibold bg-slate-50 p-2 rounded-lg">
                    <span>Audit: {record.status}</span>
                    {record.expertName && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-emerald-700 font-bold">Verified by {record.expertName}</span>
                        {record.expertTier && (
                          <span className={`inline-flex items-center gap-0.5 text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full border ${
                            record.expertTier === "Platinum" ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-violet-400 shadow-3xs" :
                            record.expertTier === "Gold" ? "bg-yellow-50 text-yellow-800 border-yellow-300" :
                            record.expertTier === "Silver" ? "bg-slate-50 text-slate-800 border-slate-300" :
                            record.expertTier === "Bronze" ? "bg-amber-50 text-amber-800 border-amber-300" :
                            "bg-slate-100 text-slate-600 border-slate-200"
                          }`}>
                            {(record.expertTier === "Platinum" || record.expertTier === "Gold") ? "★ " : ""}
                            {record.expertTier}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>

          {filteredDiagnostics.length === 0 && (
            <div className="col-span-2 bg-slate-50 border border-slate-100 rounded-xl p-8 text-center text-slate-400 font-medium">
              No pathology logs found matching the selected filters.
            </div>
          )}
        </div>

        {/* Certified Pathologist Network & Expert Directory */}
        <div className="mt-8 border-t border-slate-150 pt-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="text-left">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                Certified Pathologist Network & Verification Registry
              </h3>
              <p className="text-[10px] text-slate-400 font-bold">
                Sovereign Board of accredited agricultural experts verifying diagnostics. Click on any expert card to view their public-facing profile, reviews, and book subsidized consultations, or use them to verify scans.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[9px] bg-slate-100 border border-slate-200/60 px-3 py-1.5 rounded-full font-black uppercase text-slate-500">
              <span>Security Guarantee: All Experts ICAR/Gov Accredited</span>
            </div>
          </div>

          {/* Directory Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {seededPathologists.map((pathologist) => (
              <div
                key={pathologist.id}
                className="bg-white border border-slate-150 hover:border-emerald-300 rounded-xl p-4 shadow-3xs hover:shadow-sm transition-all text-left flex flex-col justify-between space-y-3"
              >
                {/* Clickable Profile Summary Area */}
                <div
                  onClick={() => {
                    setSelectedPathologistProfile(pathologist);
                    setReviewerName("");
                    setReviewRating(5);
                    setReviewComment("");
                    setBookTopic("");
                    setBookDesc("");
                  }}
                  className="space-y-2 cursor-pointer group"
                  title="Click to view full public-facing expert profile & review/book"
                >
                  {/* Header: Photo and Badges */}
                  <div className="flex items-start justify-between">
                    <img
                      src={pathologist.photoUrl}
                      alt={pathologist.name}
                      className="h-10 w-10 rounded-lg object-cover border border-slate-150 shadow-3xs group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    {/* Badge */}
                    <span className={`inline-flex items-center gap-0.5 text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${
                      pathologist.tier === "Platinum" ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-violet-400 shadow-3xs" :
                      pathologist.tier === "Gold" ? "bg-yellow-50 text-yellow-800 border-yellow-300" :
                      pathologist.tier === "Silver" ? "bg-slate-50 text-slate-800 border-slate-300" :
                      "bg-amber-50 text-amber-800 border-amber-300"
                    }`}>
                      {pathologist.tier}
                    </span>
                  </div>

                  {/* Profile info */}
                  <div>
                    <h4 className="text-xs font-black text-slate-800 group-hover:text-emerald-700 transition-colors flex items-center gap-1">
                      {pathologist.name}
                      <span className="text-[10px] text-slate-300 group-hover:text-emerald-500 font-normal">→</span>
                    </h4>
                    <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">{pathologist.designation}</p>
                    <p className="text-[10px] text-slate-500 font-bold leading-relaxed mt-1">{pathologist.institution || pathologist.department}</p>
                  </div>

                  {/* Micro credentials checklist */}
                  <div className="bg-slate-50 p-2 rounded-lg text-[10px] space-y-1 font-semibold text-slate-600 group-hover:bg-slate-100/70 transition-colors">
                    <div className="flex justify-between">
                      <span>Specialties:</span>
                      <span className="text-slate-800 font-bold truncate max-w-[120px]" title={Array.isArray(pathologist.specializations) ? pathologist.specializations.join(", ") : pathologist.specialization}>
                        {Array.isArray(pathologist.specializations) ? pathologist.specializations[0] : pathologist.specialization}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>License No:</span>
                      <span className="text-slate-800 font-mono font-bold text-[9px]">{pathologist.license}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Expert Trust:</span>
                      <span className="text-amber-500 font-black flex items-center gap-0.5 text-[10px]">
                        {pathologist.rating} ★
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cases Verified:</span>
                      <span className="text-slate-800 font-bold">{pathologist.consultations} solved</span>
                    </div>
                  </div>

                  {/* Public Link indicator */}
                  <div className="text-center text-[9px] text-emerald-600 font-extrabold uppercase tracking-wider group-hover:underline pt-1">
                    View Profile & Book Consultation
                  </div>
                </div>

                {/* Consult Action */}
                <button
                  onClick={() => handleConsultPathologist(pathologist)}
                  disabled={diagnostics.filter(d => d.status === "AI Diagnosed").length === 0}
                  className={`w-full py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 border ${
                    diagnostics.filter(d => d.status === "AI Diagnosed").length === 0
                      ? "bg-slate-50 text-slate-400 border-slate-200/50 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 hover:scale-[1.01] active:scale-[0.99]"
                  }`}
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  {diagnostics.filter(d => d.status === "AI Diagnosed").length === 0 ? "No Pending Scans" : "Verify AI Scan"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================================
            1.5 PUBLIC-FACING EXPERT PROFILE DIALOG MODAL
            ============================================================================ */}
        <AnimatePresence>
          {selectedPathologistProfile && (
            <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl shadow-xl border border-slate-150 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col text-left"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-5 flex justify-between items-center shrink-0">
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-widest text-emerald-300">Public-Facing Registry Profile</span>
                    <h3 className="text-base font-black">{selectedPathologistProfile.name}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedPathologistProfile(null)}
                    className="p-1.5 bg-black/20 hover:bg-black/35 rounded-full transition-all cursor-pointer text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left Column - 5 cols */}
                  <div className="md:col-span-5 space-y-5">
                    {/* Picture + Badge */}
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200/60 shadow-3xs bg-slate-50 p-4 text-center">
                      <img
                        src={selectedPathologistProfile.photoUrl}
                        alt={selectedPathologistProfile.name}
                        className="h-24 w-24 rounded-full object-cover border-2 border-emerald-600 mx-auto shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                      <div className="mt-3">
                        <h4 className="font-black text-slate-800 text-xs">{selectedPathologistProfile.name}</h4>
                        <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">{selectedPathologistProfile.designation}</p>
                        <p className="text-[10px] text-slate-600 font-bold mt-1 leading-snug">{selectedPathologistProfile.department}</p>
                      </div>

                      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                        {/* Verification Badge */}
                        <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                          selectedPathologistProfile.tier === "Platinum" ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-violet-400 shadow-sm" :
                          selectedPathologistProfile.tier === "Gold" ? "bg-yellow-50 text-yellow-800 border-yellow-300" :
                          selectedPathologistProfile.tier === "Silver" ? "bg-slate-50 text-slate-800 border-slate-300" :
                          "bg-amber-50 text-amber-800 border-amber-300"
                        }`}>
                          {selectedPathologistProfile.tier === "Platinum" && <Sparkles className="h-2.5 w-2.5 text-yellow-300 fill-current animate-pulse" />}
                          {selectedPathologistProfile.tier === "Gold" && <Sparkles className="h-2.5 w-2.5 text-yellow-500 fill-current" />}
                          {selectedPathologistProfile.tier} Verified
                        </span>
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full">
                          <ShieldCheck className="h-2.5 w-2.5 text-emerald-600" />
                          ACCREDITED
                        </span>
                      </div>
                    </div>

                    {/* Institution details */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-2 text-xs font-semibold text-slate-600">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[9px] uppercase font-bold text-slate-400">Affiliated Institution</p>
                          <p className="text-slate-800 font-bold">{selectedPathologistProfile.institution || "National Agriculture University"}</p>
                          <p className="text-slate-500 font-medium text-[10px]">{selectedPathologistProfile.location || "Cooperative Registry"}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 pt-2 border-t border-slate-200/50">
                        <Clock className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[9px] uppercase font-bold text-slate-400">Response Speed</p>
                          <p className="text-slate-800 font-bold">~ {selectedPathologistProfile.responseTime || "30 mins"}</p>
                          <p className="text-slate-500 font-medium text-[10px]">Average time to audit diagnostics</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 pt-2 border-t border-slate-200/50">
                        <Award className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[9px] uppercase font-bold text-slate-400">Professional Background</p>
                          <p className="text-slate-800 font-bold">{selectedPathologistProfile.experienceYears || 8} Years Experience</p>
                          <p className="text-slate-500 font-medium text-[10px]">Active board certified clinical plant practice</p>
                        </div>
                      </div>
                    </div>

                    {/* Specializations list */}
                    <div className="space-y-2">
                      <h5 className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Board Certified Specialities</h5>
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(selectedPathologistProfile.specializations) ? (
                          selectedPathologistProfile.specializations.map((spec: string, idx: number) => (
                            <span key={idx} className="bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                              🛡️ {spec}
                            </span>
                          ))
                        ) : (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                            🛡️ {selectedPathologistProfile.specialization || "General Pathology"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="space-y-2">
                      <h5 className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Languages Spoken</h5>
                      <div className="flex flex-wrap gap-1 items-center">
                        <Globe className="h-3.5 w-3.5 text-slate-400 shrink-0 mr-1" />
                        {selectedPathologistProfile.languages?.map((lang: string, idx: number) => (
                          <span key={idx} className="bg-slate-100 text-slate-600 border border-slate-200/40 text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - 7 cols */}
                  <div className="md:col-span-7 space-y-6">
                    {/* Stats strip */}
                    <div className="grid grid-cols-3 gap-3 bg-slate-50 border border-slate-150 p-4 rounded-2xl text-center">
                      <div>
                        <p className="text-[9px] uppercase font-bold text-slate-400">Trust Score</p>
                        <p className="text-sm font-black text-slate-800 flex items-center justify-center gap-0.5 mt-0.5">
                          <Star className="h-4 w-4 text-amber-500 fill-current" />
                          {selectedPathologistProfile.rating.toFixed(1)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase font-bold text-slate-400">Solved Cases</p>
                        <p className="text-sm font-black text-slate-800 mt-0.5">
                          {selectedPathologistProfile.consultations}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase font-bold text-slate-400">License ID</p>
                        <p className="text-[10px] font-mono font-black text-slate-800 mt-1 truncate animate-pulse" title={selectedPathologistProfile.license}>
                          {selectedPathologistProfile.license}
                        </p>
                      </div>
                    </div>

                    {/* Tabs / Accordion for Book Consultation vs Farmer Reviews */}
                    <div className="border border-slate-150 rounded-2xl overflow-hidden bg-white">
                      <div className="bg-slate-50 border-b border-slate-150 p-3 flex justify-between items-center">
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-emerald-700" />
                          Book Private Consultation
                        </h4>
                        <span className="text-[8px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full uppercase">
                          Subsidized Scheme
                        </span>
                      </div>

                      <div className="p-4 space-y-4">
                        <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
                          Schedule a secure digital consultation. Choose modes and times for personalized live diagnostics help.
                        </p>

                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => setBookMode("video")}
                            className={`py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                              bookMode === "video" ? "bg-emerald-50 text-emerald-700 border-emerald-300" : "bg-white text-slate-500 border-slate-200"
                            }`}
                          >
                            <Video className="h-4 w-4" />
                            Video Call
                          </button>
                          <button
                            type="button"
                            onClick={() => setBookMode("voice")}
                            className={`py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                              bookMode === "voice" ? "bg-emerald-50 text-emerald-700 border-emerald-300" : "bg-white text-slate-500 border-slate-200"
                            }`}
                          >
                            <PhoneCall className="h-4 w-4" />
                            Voice Call
                          </button>
                          <button
                            type="button"
                            onClick={() => setBookMode("chat")}
                            className={`py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                              bookMode === "chat" ? "bg-emerald-50 text-emerald-700 border-emerald-300" : "bg-white text-slate-500 border-slate-200"
                            }`}
                          >
                            <MessageSquare className="h-4 w-4" />
                            Secure Chat
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-700">
                          <div className="space-y-1 text-left">
                            <label className="block text-[9px] uppercase font-bold text-slate-400 font-black">Select Date</label>
                            <select
                              value={bookDate}
                              onChange={(e) => setBookDate(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
                            >
                              <option value="Today">Today (Highly Urgent)</option>
                              <option value="Tomorrow">Tomorrow</option>
                              <option value="Monday">Monday (Next Week)</option>
                              <option value="Wednesday">Wednesday (Next Week)</option>
                              <option value="Friday">Friday (Next Week)</option>
                            </select>
                          </div>

                          <div className="space-y-1 text-left">
                            <label className="block text-[9px] uppercase font-bold text-slate-400 font-black">Available Slots</label>
                            <select
                              value={bookSlot}
                              onChange={(e) => setBookSlot(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
                            >
                              <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                              <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                              <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                              <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-left">
                          <label className="block text-[9px] uppercase font-bold text-slate-400 font-black">Target Crop or Topic</label>
                          <input
                            type="text"
                            value={bookTopic}
                            onChange={(e) => setBookTopic(e.target.value)}
                            placeholder="e.g. Tomato Leaf Outbreak / Fungal Spores in Rice Paddy"
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="space-y-1.5 text-left">
                          <label className="block text-[9px] uppercase font-bold text-slate-400 font-black">Outbreak Symptoms & Observations</label>
                          <textarea
                            value={bookDesc}
                            onChange={(e) => setBookDesc(e.target.value)}
                            placeholder="Describe leaf yellowing, wilting, or diagnostic observations so the pathologist can review in advance..."
                            rows={2}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (!bookTopic.trim()) {
                              alert("Please specify the target crop or topic for this consultation.");
                              return;
                            }
                            const bookingId = `SOV-BOOK-${Math.floor(1000 + Math.random() * 9000)}`;
                            const newBooking = {
                              id: bookingId,
                              pathologistId: selectedPathologistProfile.id,
                              pathologistName: selectedPathologistProfile.name,
                              mode: bookMode,
                              date: bookDate,
                              slot: bookSlot,
                              topic: bookTopic,
                              description: bookDesc,
                              timestamp: new Date().toISOString()
                            };
                            const updated = [newBooking, ...bookedConsultations];
                            setBookedConsultations(updated);
                            localStorage.setItem("agriconnect_booked_consultations", JSON.stringify(updated));
                            alert(`Consultation booked successfully with ${selectedPathologistProfile.name}! Booking Reference: ${bookingId}. The pathologist has been notified on the sovereign secure network.`);
                            setBookTopic("");
                            setBookDesc("");
                          }}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                        >
                          Book Consultation Now
                        </button>

                        {/* Booked list */}
                        {bookedConsultations.filter((b: any) => b.pathologistId === selectedPathologistProfile.id).length > 0 && (
                          <div className="pt-3 border-t border-slate-150 text-left space-y-2">
                            <h5 className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Active Bookings with this Pathologist</h5>
                            <div className="space-y-1.5">
                              {bookedConsultations.filter((b: any) => b.pathologistId === selectedPathologistProfile.id).map((b: any) => (
                                <div key={b.id} className="bg-slate-50 border border-slate-200/60 p-2 rounded-lg text-[10px] font-semibold flex justify-between items-center">
                                  <div>
                                    <p className="text-slate-800 font-bold">{b.topic} ({b.mode.toUpperCase()})</p>
                                    <p className="text-slate-400 font-medium text-[9px]">{b.date} • {b.slot}</p>
                                  </div>
                                  <span className="text-[8px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-mono font-bold">
                                    {b.id}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Farmer Trust Reviews Section */}
                    <div className="border border-slate-150 rounded-2xl overflow-hidden bg-white">
                      <div className="bg-slate-50 border-b border-slate-150 p-3 flex justify-between items-center">
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Star className="h-4 w-4 text-amber-500 fill-current" />
                          Farmer Reviews & Endorsements
                        </h4>
                        <span className="text-[8px] bg-amber-100 text-amber-800 font-extrabold px-2 py-0.5 rounded-full uppercase">
                          Trusted Feedback
                        </span>
                      </div>

                      <div className="p-4 space-y-4">
                        {/* Reviews List */}
                        <div className="space-y-3">
                          {selectedPathologistProfile.reviews?.map((rev: any, idx: number) => (
                            <div key={idx} className="bg-slate-50/50 p-3 rounded-xl border border-slate-200/40 text-xs text-left">
                              <div className="flex justify-between items-center pb-1 border-b border-slate-150/40 mb-1.5">
                                <span className="font-bold text-slate-800">{rev.author}</span>
                                <div className="flex items-center gap-1">
                                  <span className="text-amber-500 font-black flex items-center gap-0.5 text-[10px]">
                                    {rev.rating} ★
                                  </span>
                                  <span className="text-[9px] text-slate-400 font-bold font-mono">{rev.date}</span>
                                </div>
                              </div>
                              <p className="text-slate-600 font-medium leading-relaxed italic">"{rev.comment}"</p>
                            </div>
                          ))}
                          {(!selectedPathologistProfile.reviews || selectedPathologistProfile.reviews.length === 0) && (
                            <p className="text-[10px] text-slate-400 font-bold text-center italic py-2">No farmer reviews listed yet. Be the first to leave a review!</p>
                          )}
                        </div>

                        {/* Leave a review Form */}
                        <div className="bg-slate-50/30 p-3.5 rounded-xl border border-slate-150 space-y-3">
                          <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-wider text-left">Submit Farmer Review</h5>
                          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
                            <div className="space-y-1 text-left">
                              <label className="block text-[9px] uppercase font-bold text-slate-400 font-black">Your Name</label>
                              <input
                                type="text"
                                value={reviewerName}
                                onChange={(e) => setReviewerName(e.target.value)}
                                placeholder="e.g. Ramesh Singh"
                                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                            <div className="space-y-1 text-left">
                              <label className="block text-[9px] uppercase font-bold text-slate-400 font-black">Rating Score</label>
                              <select
                                value={reviewRating}
                                onChange={(e) => setReviewRating(parseFloat(e.target.value))}
                                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
                              >
                                <option value="5">5 ★ (Highly Recommend)</option>
                                <option value="4">4 ★ (Good Experience)</option>
                                <option value="3">3 ★ (Average Advice)</option>
                                <option value="2">2 ★ (Slow Response)</option>
                                <option value="1">1 ★ (Not Helpful)</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1 text-left">
                            <label className="block text-[9px] uppercase font-bold text-slate-400 font-black">Comment</label>
                            <textarea
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              placeholder="Share your experience working with this pathologist..."
                              rows={2}
                              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-emerald-500"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (!reviewerName.trim() || !reviewComment.trim()) {
                                alert("Please fill out your name and a comment to submit a review.");
                                return;
                              }
                              const newReview = {
                                author: reviewerName,
                                rating: reviewRating,
                                comment: reviewComment,
                                date: new Date().toISOString().split("T")[0]
                              };

                              // Update pathologist in state
                              setSeededPathologists(prev => {
                                return prev.map(p => {
                                  if (p.id === selectedPathologistProfile.id) {
                                    const newReviews = [...(p.reviews || []), newReview];
                                    const newAvg = parseFloat((newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length).toFixed(1));
                                    const updatedPathologist = {
                                      ...p,
                                      reviews: newReviews,
                                      rating: newAvg,
                                      consultations: p.consultations + 1
                                    };
                                    // Keep profile modal in sync
                                    setSelectedPathologistProfile(updatedPathologist);
                                    return updatedPathologist;
                                  }
                                  return p;
                                });
                              });

                              alert("Thank you! Your verified farmer review and trust rating have been submitted, recalculated, and posted live.");
                              setReviewerName("");
                              setReviewComment("");
                            }}
                            className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                          >
                            Post Live Review
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 p-4 border-t border-slate-150 flex justify-end gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedPathologistProfile(null)}
                    className="px-4 py-2 bg-slate-250 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    Close Profile
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}
